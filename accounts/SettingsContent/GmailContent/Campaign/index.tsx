import InputSlider from '@/components/UI/InputSlider';
import TextField from '@/components/UI/TextField';
import { SettingState } from '@/pages/accounts/accounts.types';
import CampaignIcon from '@mui/icons-material/Campaign';
import { Box, Grid, Typography } from '@mui/material';
import styles from './campaign.module.scss';

interface CampaignProps {
  settingData: SettingState | null;
  setSettingData: (settingData: SettingState | null) => void;
}

const Campaign = ({ setSettingData, settingData }: CampaignProps) => {
  return (
    <Box className={styles.campaignMain}>
      <Box>
        <Grid className={styles.header}>
          <CampaignIcon />
          <Typography className={styles.title}>Campaign Settings</Typography>
        </Grid>
        <Box className={styles.limitsForm}>
          <Grid className={styles.limit}>
            <Box>
              <Typography className={styles.title}>Daily campaign limit</Typography>
              <Typography className={styles.desc}>Daily sending limit</Typography>
              <Grid className={styles.input}>
                <InputSlider
                  initValue={settingData?.limits?.maxDailyEmails ? settingData.limits.maxDailyEmails : 50}
                  setProgress={(value) => {
                    if (!settingData) return;
                    setSettingData({
                      ...settingData,
                      limits: {
                        ...settingData.limits,
                        maxDailyEmails: value as any,
                      },
                    });
                  }}
                  max={120}
                />
              </Grid>
            </Box>
          </Grid>
          <Grid className={styles.limit}>
            <Box>
              <Typography className={styles.title}>Minimum wait time</Typography>
              <Typography className={styles.desc}>When used with multiple campaigns</Typography>
              <Grid className={styles.input}>
                <InputSlider
                  initValue={settingData?.limits?.waitFor ? settingData.limits.waitFor : 30}
                  setProgress={(value) => {
                    if (!settingData) return;
                    setSettingData({
                      ...settingData,
                      limits: {
                        ...settingData.limits,
                        waitFor: value as any,
                      },
                    });
                  }}
                  max={120}
                />
              </Grid>
            </Box>
          </Grid>
        </Box>
        <Box className={styles.replyTo}>
          <TextField
            value={settingData?.setting?.replyTo ? settingData.setting.replyTo : ''}
            variant="standard"
            label="Reply To"
            onChange={(e) => {
              if (!settingData) return;
              setSettingData({
                ...settingData,
                setting: {
                  ...settingData.setting,
                  replyTo: e.target.value,
                },
              });
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Campaign;
