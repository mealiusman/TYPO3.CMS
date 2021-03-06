<?php
declare(strict_types=1);
namespace TYPO3\CMS\Install\Updates\RowUpdater;

/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

use TYPO3\CMS\Core\Authentication\BackendUserAuthentication;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\DataHandling\DataHandler;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Install\Service\LoadTcaService;

/**
 * Migrate values for database records having columns
 * using "l10n_mode" set to "mergeIfNotBlank".
 *
 * @todo: This needs a review and finish
 */
class L10nModeUpdater implements RowUpdaterInterface
{
    /**
     * List of tables with information about to migrate fields.
     * Created during hasPotentialUpdateForTable(), used in updateTableRow()
     *
     * @var array
     */
    protected $payload = [];

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle(): string
    {
        return 'Migrate values in database records having "l10n_mode"'
            . ' either set to "exclude" or "mergeIfNotBlank"';
    }

    /**
     * Return true if a table needs modifications.
     *
     * @param string $tableName Table name to check
     * @return bool True if this table has fields to migrate
     */
    public function hasPotentialUpdateForTable(string $tableName): bool
    {
        $result = false;
        $payload = $this->getL10nModePayloadForTable($tableName);
        if (count($payload) !== 0) {
            $this->payload[$tableName] = $payload;
            $result = true;
        }
        return $result;
    }

    /**
     * Update single row if needed
     *
     * @param string $tableName
     * @param array $inputRow Given row data
     * @return array Modified row data
     */
    public function updateTableRow(string $tableName, array $inputRow): array
    {
        $tablePayload = $this->payload[$tableName];

        $uid = $inputRow['uid'];
        if (empty($tablePayload['localizations'][$uid])) {
            return $inputRow;
        }

        $source = $tablePayload['localizations'][$uid];

        $connectionPool = GeneralUtility::makeInstance(ConnectionPool::class);
        $fakeAdminUser = GeneralUtility::makeInstance(BackendUserAuthentication::class);
        $fakeAdminUser->user = ['admin' => 1];

        // disable DataHandler hooks for processing this update
        if (!empty($GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['t3lib/class.t3lib_tcemain.php'])) {
            $dataHandlerHooks = $GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['t3lib/class.t3lib_tcemain.php'];
            unset($GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['t3lib/class.t3lib_tcemain.php']);
        }

        $fields = $tablePayload['fields'];
        $fieldNames = array_keys($fields);
        $fieldTypes = $tablePayload['fieldTypes'];
        $sourceFieldName = $tablePayload['sourceFieldName'];

        $sourceTableName = $tableName;
        if ($tableName === 'pages_language_overlay') {
            $sourceTableName = 'pages';
        }
        $sourceRow = $this->getRow($sourceTableName, $source);

        $updateValues = [];
        $l10nState = [];

        $row = $this->getRow($tableName, $uid);
        foreach ($row as $fieldName => $fieldValue) {
            if (!in_array($fieldName, $fieldNames)) {
                continue;
            }

            $l10nState[$fieldName] = 'custom';

            if (
                // default
                empty($fieldTypes[$fieldName])
                && trim((string)$fieldValue) === ''
                // group types (basically as comma seprated values)
                || $fieldTypes[$fieldName] === 'group'
                && (
                    $fieldValue === ''
                    || $fieldValue === null
                    || (string)$fieldValue === '0'
                )
            ) {
                $updateValues[$fieldName] = $sourceRow[$fieldName];
                $l10nState[$fieldName] = 'parent';
            }
            // inline types, but only file references
            if (
                !empty($fieldTypes[$fieldName])
                && $fieldTypes[$fieldName] === 'inline/FAL'
            ) {
                $parentId = (!empty($row['t3ver_oid']) ? $row['t3ver_oid'] : $source);
                $commandMap = [
                    $sourceTableName => [
                        $parentId => [
                            'inlineLocalizeSynchronize' => [
                                'action' => 'localize',
                                'language' => $row[$sourceFieldName],
                                'field' => $fieldName,
                            ]
                        ]
                    ]
                ];
                $fakeAdminUser->workspace = $row['t3ver_wsid'];
                $dataHandler = GeneralUtility::makeInstance(DataHandler::class);
                $dataHandler->start([], $commandMap, $fakeAdminUser);
                $dataHandler->process_cmdmap();
                $l10nState[$fieldName] = 'parent';
            }
        }

        $updateValues['l10n_state'] = json_encode($l10nState);

        $queryBuilder = $connectionPool->getQueryBuilderForTable($tableName);
        foreach ($updateValues as $updateFieldName => $updateValue) {
            $queryBuilder->set($updateFieldName, $updateValue);
        }

        $queryBuilder
            ->update($tableName)
            ->where(
                $queryBuilder->expr()->eq(
                    'uid',
                    $queryBuilder->createNamedParameter($uid, \PDO::PARAM_INT)
                )
            )
            ->execute();
        $databaseQueries[] = $queryBuilder->getSQL();

        if (!empty($dataHandlerHooks)) {
            $GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['t3lib/class.t3lib_tcemain.php'] = $dataHandlerHooks;
        }

        return $inputRow;
    }

    /**
     * Retrieves field names grouped per table name having "l10n_mode" set
     * to a relevant value that shall be migrated in database records.
     *
     * Resulting array is structured like this:
     * + fields: [field a, field b, ...]
     * + sources
     *   + source uid: [localization uid, localization uid, ...]
     *
     * @param string $tableName Table name
     * @return array Payload information for this table
     * @throws \RuntimeException
     */
    protected function getL10nModePayloadForTable(string $tableName): array
    {
        $loadTcaService = GeneralUtility::makeInstance(LoadTcaService::class);
        $loadTcaService->loadExtensionTablesWithoutMigration();
        if (!is_array($GLOBALS['TCA'][$tableName])) {
            throw new \RuntimeException(
                'Globals TCA of given table name must exist',
                1484176136
            );
        }
        $tableDefinition = $GLOBALS['TCA'][$tableName];

        $payload = [];
        $connectionPool = GeneralUtility::makeInstance(ConnectionPool::class);

        if (
            empty($tableDefinition['columns'])
            || !is_array($tableDefinition['columns'])
            || empty($tableDefinition['ctrl']['languageField'])
            || empty($tableDefinition['ctrl']['transOrigPointerField'])
        ) {
            return $payload;
        }

        $fields = [];
        $fieldTypes = [];
        foreach ($tableDefinition['columns'] as $fieldName => $fieldConfiguration) {
            if (
                empty($fieldConfiguration['l10n_mode'])
                || empty($fieldConfiguration['config']['type'])
            ) {
                continue;
            }
            if (
                $fieldConfiguration['l10n_mode'] === 'exclude'
                || $fieldConfiguration['l10n_mode'] === 'mergeIfNotBlank'
            ) {
                $fields[$fieldName] = $fieldConfiguration;
            }
        }

        if (empty($fields)) {
            return $payload;
        }

        $queryBuilder = $connectionPool->getQueryBuilderForTable($tableName);
        $queryBuilder->getRestrictions()->removeAll();
        $queryBuilder->from($tableName);

        foreach ($fields as $fieldName => $fieldConfiguration) {
            if (empty($fieldConfiguration['config']['type'])) {
                continue;
            }

            if ($fieldConfiguration['config']['type'] === 'group') {
                $fieldTypes[$fieldName] = 'group';
            }
            if (
                $fieldConfiguration['config']['type'] === 'inline'
                && !empty($fieldConfiguration['config']['foreign_field'])
                && $fieldConfiguration['config']['foreign_field'] === 'uid_foreign'
                && !empty($fieldConfiguration['config']['foreign_table'])
                && $fieldConfiguration['config']['foreign_table'] === 'sys_file_reference'
            ) {
                $fieldTypes[$fieldName] = 'inline/FAL';
            }
        }

        $sourceFieldName = $tableDefinition['ctrl']['transOrigPointerField'];
        $selectFieldNames = ['uid', $sourceFieldName];

        if (!empty($tableDefinition['ctrl']['versioningWS'])) {
            $selectFieldNames = array_merge(
                $selectFieldNames,
                ['t3ver_wsid', 't3ver_oid']
            );
        }

        $statement = $queryBuilder
            ->select(...$selectFieldNames)
            ->andWhere(
                $queryBuilder->expr()->gt(
                    $tableDefinition['ctrl']['languageField'],
                    $queryBuilder->createNamedParameter(0, \PDO::PARAM_INT)
                ),
                $queryBuilder->expr()->gt(
                    $sourceFieldName,
                    $queryBuilder->createNamedParameter(0, \PDO::PARAM_INT)
                )
            )
            ->execute();

        foreach ($statement as $row) {
            $source = $row[$sourceFieldName];
            $payload['sources'][$source][] = $row['uid'];
            $payload['localizations'][$row['uid']] = $source;
        }

        if (!empty($payload['sources'])) {
            $payload['fields'] = $fields;
            $payload['fieldTypes'] = $fieldTypes;
            $payload['sourceFieldName'] = $sourceFieldName;
        }

        return $payload;
    }

    /**
     * @param string $tableName
     * @param int $id
     * @return array
     */
    protected function getRow(string $tableName, int $id)
    {
        $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)
            ->getQueryBuilderForTable($tableName);
        $queryBuilder->getRestrictions()->removeAll();

        $statement = $queryBuilder
            ->select('*')
            ->from($tableName)
            ->where(
                $queryBuilder->expr()->eq(
                    'uid',
                    $queryBuilder->createNamedParameter($id, \PDO::PARAM_INT)
                )
            )
            ->execute();

        return $statement->fetch();
    }
}
