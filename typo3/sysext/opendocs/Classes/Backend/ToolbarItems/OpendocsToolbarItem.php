<?php
namespace TYPO3\CMS\Opendocs\Backend\ToolbarItems;

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

use TYPO3\CMS\Backend\Toolbar\ToolbarItemInterface;
use TYPO3\CMS\Backend\Backend\ToolbarItems\AbstractToolbarItem;
use TYPO3\CMS\Backend\Utility\IconUtility;
use TYPO3\CMS\Core\Utility\GeneralUtility;

/**
 * A list of all open documents
 *
 * @author Benjamin Mack <benni@typo3.org>
 * @author Ingo Renner <ingo@typo3.org>
 */
class OpendocsToolbarItem extends AbstractToolbarItem implements ToolbarItemInterface {

	/**
	 * @var string Extension context
	 */
	protected $extension = 'opendocs';

	/**
	 * @var string Template file for the dropdown menu
	 */
	protected $templateFile = 'Opendocs.html';

	/**
	 * @var array
	 */
	protected $openDocs;

	/**
	 * @var array
	 */
	protected $recentDocs;

	/**
	 * Constructor
	 */
	public function __construct() {
		parent::__construct();

		$this->loadDocsFromUserSession();
		$pageRenderer = $this->getPageRenderer();
		$pageRenderer->loadRequireJsModule('TYPO3/CMS/Opendocs/Toolbar/OpendocsMenu');
	}

	/**
	 * Checks whether the user has access to this toolbar item
	 *
	 * @return bool TRUE if user has access, FALSE if not
	 */
	public function checkAccess() {
		$conf = $this->getBackendUser()->getTSConfig('backendToolbarItem.tx_opendocs.disabled');
		return $conf['value'] != 1;
	}

	/**
	 * Loads the opened and recently opened documents from the user
	 *
	 * @return void
	 */
	public function loadDocsFromUserSession() {
		$backendUser = $this->getBackendUser();
		list($this->openDocs, ) = $backendUser->getModuleData('FormEngine', 'ses');
		$this->recentDocs = $backendUser->getModuleData('opendocs::recent');
	}

	/**
	 * Render toolbar icon
	 *
	 * @return string HTML
	 */
	public function getItem() {
		$numDocs = count($this->openDocs);
		$title = $this->getLanguageService()->getLL('toolbaritem', TRUE);

		$opendocsMenu = array();
		$opendocsMenu[] = IconUtility::getSpriteIcon('apps-toolbar-menu-opendocs', array('title' => $title));
		$opendocsMenu[] = '<span class="badge" id="tx-opendocs-counter">' . $numDocs . '</span>';

		return implode(LF, $opendocsMenu);
	}

	/**
	 * Render drop down
	 *
	 * @return string HTML
	 */
	public function getDropDown() {
		$openDocuments = $this->openDocs;
		$recentDocuments = $this->recentDocs;
		$entries = array(
			'open' => array(),
			'recent' => array()
		);
		if (!empty($openDocuments)) {
			$i = 0;
			foreach ($openDocuments as $md5sum => $openDocument) {
				$i++;
				$entry = $this->renderMenuEntry($openDocument, $md5sum, FALSE, $i === 1);
				if (!empty($entry)) {
					$entries['open'][] = $entry;
				}
			}
		}
		// If there are "recent documents" in the list, add them
		if (!empty($recentDocuments)) {
			$i = 0;
			foreach ($recentDocuments as $md5sum => $recentDocument) {
				$i++;
				$entry = $this->renderMenuEntry($recentDocument, $md5sum, TRUE, $i === 1);
				if (!empty($entry)) {
					$entries['recent'][] = $entry;
				}
			}
		}

		$standaloneView = $this->getStandaloneView();
		$standaloneView->assignMultiple(array(
			'entries' => $entries,
			'hasEntries' => !empty($entries['open']) || !empty($entries['recent'])
		));
		return $standaloneView->render();
	}

	/**
	 * Returns the recent documents list as an array
	 *
	 * @param array $document
	 * @param string $md5sum
	 * @param bool $isRecentDoc
	 * @param bool $isFirstDoc
	 * @return array All recent documents as list-items
	 */
	protected function renderMenuEntry($document, $md5sum, $isRecentDoc = FALSE, $isFirstDoc = FALSE) {
		$table = $document[3]['table'];
		$uid = $document[3]['uid'];
		$record = \TYPO3\CMS\Backend\Utility\BackendUtility::getRecordWSOL($table, $uid);
		if (!is_array($record)) {
			// Record seems to be deleted
			return '';
		}
		$label = strip_tags(htmlspecialchars_decode($document[0]));
		$icon = \TYPO3\CMS\Backend\Utility\IconUtility::getSpriteIconForRecord($table, $record);
		$link = \TYPO3\CMS\Backend\Utility\BackendUtility::getModuleUrl('record_edit') . '&' . $document[2];
		$pageId = (int)$document[3]['uid'];
		if ($document[3]['table'] !== 'pages') {
			$pageId = (int)$document[3]['pid'];
		}
		$onClickCode = 'jump(' . GeneralUtility::quoteJSvalue($link) . ', \'web_list\', \'web\', ' . $pageId . '); TYPO3.OpendocsMenu.toggleMenu(); return false;';
		if (!$isRecentDoc) {
			$title = $this->getLanguageService()->sL('LLL:EXT:lang/locallang_core.xlf:rm.closeDoc', TRUE);
			// Open document
			$closeIcon = \TYPO3\CMS\Backend\Utility\IconUtility::getSpriteIcon('actions-document-close');
			$entry = array(
				'onclick' => $onClickCode,
				'icon' => $icon,
				'label' => $label,
				'md5sum' => $md5sum,
				'title' => $title,
				'closeIcon' => $closeIcon
			);
		} else {
			// Recently used document
			$entry = array(
				'onclick' => $onClickCode,
				'icon' => $icon,
				'label' => $label
			);
		}
		return $entry;
	}

	/**
	 * No additional attributes
	 *
	 * @return string List item HTML attibutes
	 */
	public function getAdditionalAttributes() {
		return array();
	}

	/**
	 * This item has a drop down
	 *
	 * @return bool
	 */
	public function hasDropDown() {
		return TRUE;
	}


	/*******************
	 ***    HOOKS    ***
	 *******************/
	/**
	 * Called as a hook in \TYPO3\CMS\Backend\Utility\BackendUtility::setUpdateSignal, calls a JS function to change
	 * the number of opened documents
	 *
	 * @param array $params
	 * @param unknown_type $ref
	 * @return string list item HTML attributes
	 */
	public function updateNumberOfOpenDocsHook(&$params, $ref) {
		$params['JScode'] = '
			if (top && top.TYPO3.OpendocsMenu) {
				top.TYPO3.OpendocsMenu.updateMenu();
			}
		';
	}

	/******************
	 *** AJAX CALLS ***
	 ******************/
	/**
	 * Closes a document in the session and
	 *
	 * @param array $params Array of parameters from the AJAX interface, currently unused
	 * @param \TYPO3\CMS\Core\Http\AjaxRequestHandler $ajaxObj Object of type AjaxRequestHandler
	 * @return string List item HTML attributes
	 */
	public function closeDocument($params = array(), \TYPO3\CMS\Core\Http\AjaxRequestHandler $ajaxObj = NULL) {
		$backendUser = $this->getBackendUser();
		$md5sum = \TYPO3\CMS\Core\Utility\GeneralUtility::_GP('md5sum');
		if ($md5sum && isset($this->openDocs[$md5sum])) {
			// Add the document to be closed to the recent documents
			$this->recentDocs = array_merge(array($md5sum => $this->openDocs[$md5sum]), $this->recentDocs);
			// Allow a maximum of 8 recent documents
			if (count($this->recentDocs) > 8) {
				$this->recentDocs = array_slice($this->recentDocs, 0, 8);
			}
			// Remove it from the list of the open documents, and store the status
			unset($this->openDocs[$md5sum]);
			list(, $docDat) = $backendUser->getModuleData('FormEngine', 'ses');
			$backendUser->pushModuleData('FormEngine', array($this->openDocs, $docDat));
			$backendUser->pushModuleData('opendocs::recent', $this->recentDocs);
		}
		$this->renderAjax($params, $ajaxObj);
	}

	/**
	 * Renders the menu so that it can be returned as response to an AJAX call
	 *
	 * @param array $params Array of parameters from the AJAX interface, currently unused
	 * @param \TYPO3\CMS\Core\Http\AjaxRequestHandler $ajaxObj Object of type AjaxRequestHandler
	 * @return void
	 */
	public function renderAjax($params = array(), \TYPO3\CMS\Core\Http\AjaxRequestHandler $ajaxObj = NULL) {
		$ajaxObj->addContent('opendocsMenu', $this->getDropDown());
	}

	/**
	 * Position relative to others
	 *
	 * @return int
	 */
	public function getIndex() {
		return 30;
	}

	/**
	 * Returns the current BE user.
	 *
	 * @return \TYPO3\CMS\Core\Authentication\BackendUserAuthentication
	 */
	protected function getBackendUser() {
		return $GLOBALS['BE_USER'];
	}

	/**
	 * Returns current PageRenderer
	 *
	 * @return \TYPO3\CMS\Core\Page\PageRenderer
	 */
	protected function getPageRenderer() {
		/** @var  \TYPO3\CMS\Backend\Template\DocumentTemplate $documentTemplate */
		$documentTemplate = $GLOBALS['TBE_TEMPLATE'];
		return $documentTemplate->getPageRenderer();
	}

	/**
	 * Returns LanguageService
	 *
	 * @return \TYPO3\CMS\Lang\LanguageService
	 */
	protected function getLanguageService() {
		return $GLOBALS['LANG'];
	}

	/**
	 * Return DatabaseConnection
	 *
	 * @return \TYPO3\CMS\Core\Database\DatabaseConnection
	 */
	protected function getDatabaseConnection() {
		return $GLOBALS['TYPO3_DB'];
	}

}
