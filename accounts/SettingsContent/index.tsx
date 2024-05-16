import { Box } from '@mui/material';
import React, { Suspense, lazy } from 'react';
import { Account, SettingState } from '../accounts.types';
const Campaign = lazy(() => import('./GmailContent/Campaign'));
const Sender = lazy(() => import('./GmailContent/Sender'));
const FBLimits = lazy(() => import('./FacebookContent/fbLimits'));
const InstaLimits = lazy(() => import('./InstagramContent/instaLimits'));
const InLimits = lazy(() => import('./LinkedinContent/inLimits'));

interface SettingsContentProps {
  account: Account | null;
  activePlatform: string;
  settingData: SettingState | null;
  setSettingData: (settingData: SettingState | null) => void;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ account, activePlatform, settingData, setSettingData }) => {
  if (!account) return <></>;

  return (
    <Box>
      <Suspense fallback="Loading...">
        {activePlatform === 'gmail' && (
          <>
            <Sender settingData={settingData} setSettingData={setSettingData} />
            <Campaign settingData={settingData} setSettingData={setSettingData} />
          </>
        )}
      </Suspense>
      <Suspense fallback="Loading...">
        {activePlatform === 'linkedIn' && <InLimits settingData={settingData} setSettingData={setSettingData} />}
      </Suspense>
      <Suspense fallback="Loading...">
        {activePlatform === 'facebook' && <FBLimits settingData={settingData} setSettingData={setSettingData} />}
      </Suspense>
      <Suspense fallback="Loading...">
        {activePlatform === 'instagram' && <InstaLimits settingData={settingData} setSettingData={setSettingData} />}
      </Suspense>
    </Box>
  );
};

export default SettingsContent;
