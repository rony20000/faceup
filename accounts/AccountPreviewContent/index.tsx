import React from 'react'
import { Box, Grid, Typography } from '@mui/material';
import Button from '@/components/UI/Button';
import BasicTabs from '@/components/UI/Tabs';
import { Tool } from '@/components/UI/Tabs/tabs.types';
import { Account, SettingState } from '@/pages/accounts/accounts.types';
import styles from './AccountPreviewContent.module.scss';

type Platform = 'gmail' | 'linkedIn' | 'facebook' | 'instagram';

export interface Props {
    activePlatform: Platform;
    selectedAccountForDrawer: Account | null;
    handleSaveSetting: () => void;
    settingData: SettingState;
    setSettingData: (settingData: SettingState) => void;  
    tools: Tool[];
}
const AccountPreviewContent = ({
    activePlatform,
    selectedAccountForDrawer,
    handleSaveSetting,
    settingData,
    setSettingData,
    tools
}: Props) => {
  return (
    <Box className={styles.drawerMain}>
        <Grid className={styles.header}>
        <Typography className={styles.title}>{selectedAccountForDrawer?.email}</Typography>
        <Grid>
            {/* // Check Later: selectedAccountForDrawer?.isConnected: is this its right place! */}
            <Button
            onClick={() => {
                if (activePlatform === 'gmail') setSettingData({ ...settingData, status: !settingData?.status });
                else setSettingData({ ...settingData, isConnected: !settingData?.isConnected });
            }}
            color={settingData?.status ? 'danger' : settingData?.isConnected ? 'danger' : 'success'}
            >
            {settingData?.status ? 'Pause' : settingData?.isConnected ? 'Pause' : 'Start'}
            </Button>
        </Grid>
        </Grid>
        <Box>
        <BasicTabs tools={tools} />
        </Box>

        <Box className={styles.actionsFooter}>
        <Button onClick={() => handleSaveSetting()}>Save</Button>
        </Box>
    </Box>
  )
}

export default AccountPreviewContent;