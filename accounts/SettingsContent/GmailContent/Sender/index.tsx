import TextField from '@/components/UI/TextField';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Grid, Typography } from '@mui/material';
import { SettingState } from '../../../accounts.types';
import styles from './sender.module.scss';

interface SenderProps {
  settingData: SettingState | null;
  setSettingData: (settingData: SettingState | null) => void;
}

const Sender = ({ settingData, setSettingData }: SenderProps) => {
  return (
    <Box className={styles.main}>
      <Box>
        <Grid className={styles.header}>
          <PersonIcon />
          <Typography className={styles.title}>Sender name</Typography>
        </Grid>
        <Box className={styles.nameForm}>
          <TextField
            value={settingData?.setting?.sender?.firstName ? settingData.setting.sender.firstName : ''}
            variant="standard"
            label="First Name"
            onChange={(e) => {
              if (!settingData) return;
              setSettingData({
                ...settingData,
                setting: {
                  ...settingData.setting,
                  sender: { ...settingData.setting.sender, firstName: e.target.value },
                },
              });
            }}
          />
          <TextField
            value={settingData?.setting?.sender?.lastName ? settingData.setting.sender.lastName : ''}
            variant="standard"
            label="Last Name"
            onChange={(e) => {
              if (!settingData) return;
              setSettingData({
                ...settingData,
                setting: {
                  ...settingData.setting,
                  sender: { ...settingData.setting.sender, lastName: e.target.value },
                },
              });
            }}
          />
        </Box>
      </Box>
      <Box>
        <Grid className={styles.header}>
          <Typography className={styles.title}>Signature</Typography>
        </Grid>
        <Box className={styles.nameForm}>
          <TextField
            value={settingData?.setting?.sender?.signature ? settingData.setting.sender.signature : ''}
            variant="standard"
            label="Account Signature"
            onChange={(e) => {
              if (!settingData) return;
              setSettingData({
                ...settingData,
                setting: {
                  ...settingData.setting,
                  sender: { ...settingData.setting.sender, signature: e.target.value },
                },
              });
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Sender;
