import Button from '@/components/UI/Button';
import Select from '@/components/UI/Select';
import TextField from '@/components/UI/TextField';
import { Box, List, ListItem, Typography } from '@mui/material';
import Link from 'next/link';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import styles from './EmailModal.module.scss';

interface EmailModalProps {
  onCancel: () => void;
  onSubmit: () => void;
  method:
    | {
        label: string;
        value: string;
      }
    | undefined;
  setMethod: Dispatch<
    SetStateAction<{
      label: string;
      value: string;
    }>
  >;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  authCode: string;
  setAuthCode: Dispatch<SetStateAction<string>>;
}

interface IFormInput {
  email: string;
  password: string;
}

const EmailModal: React.FC<EmailModalProps> = ({
  onCancel,
  method,
  setMethod,
  email,
  setEmail,
  authCode,
  setAuthCode,
  password,
  setPassword,
  onSubmit,
}: EmailModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const submit = () => {
    onCancel();
    onSubmit();
  };

  // the text that will be copied to the clipboard
  const textRef = useRef<HTMLPreElement>(null);

  // the function that will be called when the copy button is clicked
  const handleCopy = () => {
    if (!textRef.current) return;

    const text = textRef.current.textContent || '';

    // copy the text to the clipboard
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Success message or action
        toast.success('Copied to clipboard');
      })
      .catch(() => {
        // Error handling
        toast.error('Failed to copy');
      });
  };

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };

  return (
    <form className={styles.modalContent} onSubmit={handleSubmit(submit)}>
      <Typography variant="h4" component="h3">
        OAuth Login
      </Typography>

      {activeStep === 0 && (
        <Box className={styles.modalContent}>
          <Typography variant="body1" component="h4">
            1. On your computer, open Gmail
          </Typography>
          <Typography variant="body1" component="h4">
            2. Click the gear icon in the top right corner
          </Typography>
          <Typography variant="body1" component="h4">
            3. Select "All Settings"
          </Typography>
          <Typography variant="body1" component="h4">
            4. Navigate to the "Forwarding and POP/IMAP" tab
          </Typography>
          <Typography variant="body1" component="h4">
            5. In the "IMAP access" section, select "Enable IMAP"
          </Typography>
          <Typography variant="body1" component="h4">
            6. Click "Save Changes"
          </Typography>
          <Button onClick={handleNext}>Yes, IMAP has been enabled</Button>
        </Box>
      )}

      {activeStep === 1 && (
        <Box className={styles.modalContent}>
          <Select
            placeholder="Choose Method"
            options={[
              { label: 'App Password', value: 'AppPassword' },
              { label: 'OAuth', value: 'OAuth' },
            ]}
            onChange={(e) => setMethod(e as any)}
            value={method}
          />
          {method?.value === 'AppPassword' && (
            <>
              <Typography variant="body1" component="h4">
                1. Go to your Google Account's Security Settings
              </Typography>
              <Typography variant="body1" component="h4">
                2. Enable 2-step verification
              </Typography>
              <Typography variant="body1" component="h4">
                3. Create an App password
              </Typography>

              <Button onClick={() => setActiveStep(2)}>Next</Button>
            </>
          )}
          {method?.value === 'OAuth' && (
            <>
              <Typography variant="body1" component="h4">
                Instruction for OAUTH
              </Typography>
              <Button onClick={() => setActiveStep(3)}>Next</Button>
            </>
          )}
        </Box>
      )}

      {method?.value === 'AppPassword' && activeStep === 2 && (
        <Box className={styles.inputs}>
          <TextField
            type="text"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
            register={register}
            validations={{
              required: "Email can't be empty",
              minLength: { value: 4, message: 'Email must be at least 4 characters long' },
            }}
            name="email"
          />
          <TextField
            type="text"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            label="App Password"
            error={!!errors.password}
            helperText={errors.password?.message}
            register={register}
            validations={{
              required: "Password can't be empty",
              minLength: { value: 4, message: 'Password must be at least 4 characters long' },
            }}
            name="password"
          />
          <Box className={styles.buttons}>
            <Button
              type="button"
              onClick={() => {
                onCancel();
              }}
              color="danger"
            >
              Cancel
            </Button>
            <Button color="primary" type="submit" className={styles.add}>
              Submit
            </Button>
          </Box>
        </Box>
      )}

      {method?.value === 'OAuth' && activeStep === 3 && (
        <Box className={styles.form}>
          <Box>
            <List>
              <ListItem>
                1. Go to your{' '}
                <Link target="_blank" href="https://admin.google.com/" className={styles.oAuthUrl}>
                  Google Workspace Admin Panel
                </Link>
              </ListItem>
              <ListItem>
                2. Click "Add App" <br />
                and then select "OAuth App Name or Client ID"
              </ListItem>
              <ListItem className={styles.clientIdList}>
                <Typography>3. Use the following Client-ID to search for Autolead:</Typography>
                <pre ref={textRef} className={styles.clientIdBox} onClick={handleCopy}>
                  677696330804-en436ien8o6ijeenlsg5ekj1223jghs8.apps.googleusercontent.com{' '}
                </pre>
                <Button className={styles.copyBtn} color="secondary" onClick={handleCopy}>
                  Copy
                </Button>
              </ListItem>
              <ListItem>4. Select and approve Autolead to access your Google Workspace</ListItem>
            </List>
          </Box>
          <Box className={styles.buttons} marginTop={1}>
            <Button onClick={() => setActiveStep(1)} color="secondary" type="button">
              Back
            </Button>
            <Button onClick={() => setActiveStep(4)} color="primary" type="button">
              Login
            </Button>
          </Box>
        </Box>
      )}

      {method?.value === 'OAuth' && activeStep === 4 && (
        <Box>
          <Box>
            <Typography>Login</Typography>
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

          <Box className={styles.buttons}>
            <Button
              type="button"
              onClick={() => {
                onCancel();
              }}
              color="danger"
            >
              Cancel
            </Button>
            <Button color="primary" type="submit" className={styles.add} onClick={submit}>
              Submit
            </Button>
          </Box>
        </Box>
      )}
    </form>
  );
};

export default EmailModal;
