import Button from '@/components/UI/Button';
import CheckBox from '@/components/UI/CheckBox';
import { Account } from '@/pages/accounts/accounts.types';
import InAccount from '@/pages/linkedin/accounts/accounts.types';
import { Box, Typography } from '@mui/material';
import styles from './accountCard.module.scss';

export interface CardProps {
  email: string;
  isChecked: boolean;
  isMenuOpen: boolean;
  account: InAccount;
  handleOpenDrawer: (account: Account) => void;
  onCheckboxChange: (checked: boolean) => void;
}

const AccountCard: React.FC<CardProps> = ({ email, onCheckboxChange, isMenuOpen, account, handleOpenDrawer }) => {
  return (
    <Box className={` ${isMenuOpen && `${styles.hidden}`} ${styles.container}`}>
      <Box className={styles.wrapper}>
        <Box className={styles.inputBox}>
          <CheckBox onChange={onCheckboxChange} />
          <Typography className={styles.email}>{email}</Typography>
        </Box>
        <Button className={styles.btn} onClick={() => handleOpenDrawer(account)}>
          Manage
        </Button>
      </Box>
    </Box>
  );
};
export default AccountCard;
