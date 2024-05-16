import { selectStyles } from '@/components/UI/Select/react-select-style';
import TextField from '@/components/UI/TextField';
import { GmailModalProps } from '@/pages/accounts/accounts.types';
import { Box, Typography } from '@mui/material';
import ReactSelect from 'react-select';
import styles from './GmailModal.module.scss';

const GmailModal: React.FC<GmailModalProps> = ({
  method,
  setMethod,
  email,
  setEmail,
  password,
  setPassword,
  authCode,
  setAuthCode,
}) => {
  return (
    <form className={styles.form}>
      <Typography>Gmail Login</Typography>
      <Box>
        <ReactSelect
          placeholder="Choose Method"
          options={[
            { label: 'App Password', value: 'AppPassword' },
            { label: 'OAuth', value: 'OAuth' },
          ]}
          styles={selectStyles}
          onChange={(e: any) => setMethod(e)}
          value={method?.value}
        />
      </Box>
      {method?.value === 'AppPassword' && (
        <Box className={styles.form}>
          <TextField type="text" label="Gmail Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <TextField
            type="password"
            label="Gmail App Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Box>
      )}
      {method?.value === 'OAuth' && (
        <Box className={styles.form}>
          <Box>
            <Typography>1. Use the following Client-ID to search for Instantly:</Typography>
            <Typography className={styles.tokenSample}>
              677696330804-en436ien8o6ijeenlsg5ekj1223jghs8.apps.googleusercontent.com
            </Typography>
          </Box>
          <Box>
            <Typography>2. </Typography>
            <a
              className={styles.oAuthUrl}
              target="_blank"
              href="https://accounts.google.com/o/oautTypography/v2/auth/oauthchooseaccount?redirect_uri=https%3A%2F%2Fdevelopers.google.com%2Foauthplayground&prompt=consent&response_type=code&client_id=677696330804-en436ien8o6ijeenlsg5ekj1223jghs8.apps.googleusercontent.com&scope=https%3A%2F%2Fmail.google.com%2F&access_type=offline&service=lso&o2v=2&flowName=GeneralOAuthFlow"
            >
              Log an account in sdsd
            </a>
            <Box className={styles.authCode}>
              <TextField type="text" label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
              <TextField
                type="text"
                label="Authorization code"
                value={authCode}
                onChange={(event) => setAuthCode(event.target.value)}
              />
            </Box>
          </Box>
        </Box>
      )}
    </form>
  );
};

export default GmailModal;
