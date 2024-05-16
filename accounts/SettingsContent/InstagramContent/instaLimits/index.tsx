import InputSlider from '@/components/UI/InputSlider';
import { SettingState } from '@/pages/accounts/accounts.types';
import LockResetIcon from '@mui/icons-material/LockReset';
import { Box, Grid, Typography } from '@mui/material';
import styles from './instaLimits.module.scss';
interface InstaLimitsProps {
  settingData: SettingState | null;
  setSettingData: (settingData: SettingState | null) => void;
}

const InstaLimits = ({ setSettingData, settingData }: InstaLimitsProps) => {
  const FormData = [
    [
      {
        title: 'Connections',
        desc: 'The number of times a profile can be connected before it is blocked by LinkedIn, from 1 to 60.',
        value: settingData?.limits?.connections ? settingData.limits.connections : 1,
        max: 60,
        onChange: (value: number) => {
          if (!settingData) return;
          setSettingData({
            ...settingData,
            limits: {
              ...settingData.limits,
              connections: value,
            },
          });
        },
      },
      {
        title: 'Messages',
        desc: 'The number of times a profile can be sent a message before it is blocked by LinkedIn, from 1 to 60.',
        value: settingData?.limits?.messages ? settingData.limits.messages : 1,
        max: 60,
        onChange: (value: number) => {
          if (!settingData) return;
          setSettingData({
            ...settingData,
            limits: {
              ...settingData.limits,
              messages: value,
            },
          });
        },
      },
    ],
    [
      {
        title: 'Likes',
        desc: 'The number of times a profile can be likes before it is blocked by LinkedIn, from 1 to 100.',
        value: settingData?.limits?.likes ? settingData.limits.likes : 1,
        max: 100,
        onChange: (value: number) => {
          if (!settingData) return;
          setSettingData({
            ...settingData,
            limits: {
              ...settingData.limits,
              likes: value,
            },
          });
        },
      },
    ],
  ];

  return (
    <Box className={styles.campaignMain}>
      <Box>
        <Grid className={styles.header}>
          <LockResetIcon />
          <Typography className={styles.title}>Limits Settings</Typography>
        </Grid>
        {FormData.map((form) => (
          <Box className={styles.limitsForm}>
            {form.map((limit) => (
              <Grid className={styles.limit}>
                <Box>
                  <Typography className={styles.title}>{limit.title}</Typography>
                  <Typography className={styles.desc}>{limit.desc}</Typography>
                  <Grid className={styles.input}>
                    <InputSlider
                      initValue={limit.value}
                      setProgress={(value) => {
                        limit.onChange(value as number);
                      }}
                      max={limit.max}
                    />
                  </Grid>
                </Box>
              </Grid>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default InstaLimits;
