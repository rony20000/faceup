import Button from '@/components/UI/Button';
import TextField from '@/components/UI/TextField';
import { RootState } from '@/utils/store';
import { Box, Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { AddAccountStage } from '../../linkedin/accounts/add-account-stage.slice';
import styles from './FacebookModal.module.scss';

interface FacebookModalProps {
  onCancel: () => void;
  onSubmit: () => void;
  addAccountStage: AddAccountStage;
  accessKey: string;
  setAccessKey: (accessKey: string) => void;
  password: string;
  setPassword: (password: string) => void;
  verificationCode: string;
  setVerificationCode: Dispatch<SetStateAction<string>>;
  setFbVerificationCode: (val: string) => void;
}

interface IFormInput {
  accessKey: string;
  password: string;
  verificationCode: string;
}

const FacebookModal: React.FC<FacebookModalProps> = ({
  onCancel,
  addAccountStage,
  accessKey,
  setAccessKey,
  password,
  setPassword,
  verificationCode,
  setVerificationCode,
  onSubmit,
  setFbVerificationCode,
}: FacebookModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const { isLoading } = useSelector((state: RootState) => state.addAccountStage);

  const submit = () => {
    // onCancel();
    onSubmit();
  };

  return (
    <>
      {addAccountStage === AddAccountStage.NEED_LOGIN ? (
        <form className={styles.modalContent} onSubmit={handleSubmit(submit)}>
          <Typography variant="h4" component="h3">
            Facebook Login
          </Typography>
          <TextField
            type="text"
            value={accessKey}
            onChange={(event) => setAccessKey && setAccessKey(event.target.value)}
            label="Facebook Email"
            error={!!errors.accessKey}
            helperText={errors.accessKey?.message}
            register={register}
            validations={{
              required: "Email can't be empty",
              minLength: { value: 4, message: 'Email must be at least 4 characters long' },
            }}
            name="accessKey"
          />
          <TextField
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            label="Facebook Password"
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
            <Button color="primary" type="submit" className={styles.add}>
              Submit
            </Button>

            <Button
              type="button"
              onClick={() => {
                onCancel();
              }}
              color="danger"
            >
              Cancel
            </Button>
          </Box>

          {isLoading && (
            <Box py={2} textAlign={'center'}>
              Loading...
            </Box>
          )}
        </form>
      ) : addAccountStage === AddAccountStage.NEED_VERIFICATION ? (
        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
          <Typography component="h4" variant="h4">
            Verification Code
          </Typography>

          <TextField
            type="text"
            value={verificationCode}
            onChange={(event) => {
              setVerificationCode(event.target.value);
              setFbVerificationCode(event.target.value);
            }}
            label="6 PIN Numbers"
            error={!!errors.verificationCode}
            helperText={errors.verificationCode?.message}
            register={register}
            validations={{
              required: "Verification code can't be empty",
              minLength: { value: 4, message: 'Verification code must be at least 4 characters long' },
            }}
            name="verificationCode"
          />
          <Box className={styles.buttons}>
            <Button color="primary" type="submit" className={styles.add}>
              Submit
            </Button>

            <Button
              type="button"
              onClick={() => {
                onCancel();
              }}
              color="danger"
            >
              Cancel
            </Button>
          </Box>
        </form>
      ) : addAccountStage === AddAccountStage.LOGGING_IN ? (
        <Typography component="h4" variant="h4">
          Loggin in ...
        </Typography>
      ) : (
        <Typography component="h4" variant="h4">
          Verifiying ...
        </Typography>
      )}
    </>
  );
};

export default FacebookModal;
