/**
 * External dependencies
 */
import React, { FunctionComponent, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslate } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { Button } from '@automattic/components';
import { defaultRewindConfig, RewindConfig } from './types';
import { rewindBackup } from 'state/activity-log/actions';
import { useLocalizedMoment } from 'components/localized-moment';
import CheckYourEmail from './rewind-flow-notice/check-your-email';
import RewindFlowNotice, { RewindFlowNoticeLevel } from './rewind-flow-notice';
import getBackupDownloadId from 'state/selectors/get-backup-download-id';
import getBackupDownloadUrl from 'state/selectors/get-backup-download-url';
import getBackupDownloadProgress from 'state/selectors/get-backup-download-progress';
import ProgressBar from './progress-bar';
import QueryRewindBackupStatus from 'components/data/query-rewind-backup-status';
import RewindConfigEditor from './rewind-config-editor';

interface Props {
	rewindId: string;
	siteId: number;
}

const BackupDownloadFlow: FunctionComponent< Props > = ( { rewindId, siteId } ) => {
	const dispatch = useDispatch();
	const moment = useLocalizedMoment();
	const translate = useTranslate();

	const [ rewindConfig, setRewindConfig ] = useState< RewindConfig >( defaultRewindConfig );

	const downloadId = useSelector( state => getBackupDownloadId( state, siteId, rewindId ) );
	const downloadUrl = useSelector( state => getBackupDownloadUrl( state, siteId, rewindId ) );
	const downloadProgress = useSelector( state =>
		getBackupDownloadProgress( state, siteId, rewindId )
	);

	const downloadTimestamp = moment.unix( rewindId ).format( 'LLL' );

	const requestDownload = useCallback(
		() => dispatch( rewindBackup( siteId, rewindId, rewindConfig ) ),
		[ dispatch, rewindConfig, rewindId, siteId ]
	);

	const renderConfirm = () => (
		<>
			<div className="rewind-flow__header">
				<img
					src="/calypso/images/illustrations/jetpack-cloud-download-ready.svg"
					alt="jetpack cloud download ready"
				/>
			</div>
			<h3 className="rewind-flow__title">{ translate( 'Create downloadable backup' ) }</h3>
			<p className="rewind-flow__info">
				{ translate(
					'{{strong}}%(downloadTimestamp)s{{/strong}} is the selected point to create a download backup of. ',
					{
						args: {
							downloadTimestamp,
						},
						components: {
							strong: <strong />,
						},
					}
				) }
			</p>
			<h4 className="rewind-flow__cta">{ translate( 'Choose the items you wish to restore:' ) }</h4>
			<RewindConfigEditor currentConfig={ rewindConfig } onConfigChange={ setRewindConfig } />
			<RewindFlowNotice
				gridicon="notice-outline"
				title={ translate( 'More info' ) }
				type={ RewindFlowNoticeLevel.NOTICE }
				link="https://jetpack.com/support/backup"
			/>
			<Button
				className="rewind-flow__primary-button"
				primary
				onClick={ requestDownload }
				disabled={ Object.values( rewindConfig ).every( setting => ! setting ) }
			>
				{ translate( 'Create downloadable file' ) }
			</Button>
		</>
	);

	const renderInProgress = () => (
		<>
			<div className="rewind-flow__header">
				<img
					src="/calypso/images/illustrations/jetpack-cloud-download-ready.svg"
					alt="jetpack cloud download ready"
				/>
			</div>
			<h3 className="rewind-flow__title">
				{ translate( 'Currently creating a downloadable backup of your site' ) }
			</h3>
			<ProgressBar percent={ downloadProgress } />
			<p className="rewind-flow__info">
				{ translate(
					"We're creating a downloadable backup of your site from {{strong}}%(downloadTimestamp)s{{/strong}}.",
					{
						args: {
							downloadTimestamp,
						},
						components: {
							strong: <strong />,
						},
					}
				) }
			</p>
			<CheckYourEmail
				message={ translate( "For your convenience, we'll email you when your file is ready." ) }
			/>
		</>
	);

	const renderReady = () => (
		<>
			<div className="rewind-flow__header">
				<img
					src="/calypso/images/illustrations/jetpack-cloud-download-success.svg"
					alt="jetpack cloud download success"
				/>
			</div>
			<h3 className="rewind-flow__title">
				{ translate( 'Your backup is now available for download.' ) }
			</h3>
			<p className="rewind-flow__info">
				{ translate(
					'We successfully created a backup of your site from {{strong}}%(downloadTimestamp)s{{/strong}}.',
					{
						args: {
							downloadTimestamp,
						},
						components: {
							strong: <strong />,
						},
					}
				) }
			</p>
			<Button href={ downloadUrl } primary className="rewind-flow__primary-button">
				{ translate( 'Download file' ) }
			</Button>
			<CheckYourEmail
				message={ translate(
					"For your convenience, we've emailed you a link to your downloadable backup file."
				) }
			/>
		</>
	);

	const renderError = () => (
		<>
			<div className="rewind-flow__header">
				<img
					src="/calypso/images/illustrations/jetpack-cloud-download-failure.svg"
					alt="jetpack cloud download error"
				/>
			</div>
			<h3 className="rewind-flow__title">
				{ translate( 'An error occurred while creating your download' ) }
			</h3>
		</>
	);

	const render = () => {
		if ( downloadProgress === null && downloadUrl === null ) {
			return renderConfirm();
		} else if ( downloadProgress !== null && downloadUrl === null ) {
			return renderInProgress();
		} else if ( downloadUrl !== null ) {
			return renderReady();
		}

		return renderError();
	};

	return (
		<div>
			<QueryRewindBackupStatus downloadId={ downloadId } siteId={ siteId } />
			{ render() }
		</div>
	);
};

export default BackupDownloadFlow;
