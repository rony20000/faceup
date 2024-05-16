import axios from '../../utils/axios';
import { SettingState } from './accounts.types';

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;

const updateGmailAccount = async (accountId: string, updateGmailAccountDto: SettingState) => {
  const { data } = await axios.patch<any>(`${baseUrl}/gmail/accounts/${accountId}`, updateGmailAccountDto);
  return data;
};

const updateInstaAccount = async (accountId: string, updateInstaAccountDto: SettingState) => {
  const { data } = await axios.patch<any>(`${baseUrl}/instagram/accounts/${accountId}`, updateInstaAccountDto);
  return data;
};

const updateFBAccount = async (accountId: string, updateFBAccountDto: SettingState) => {
  const { data } = await axios.patch<any>(`${baseUrl}/facebook/accounts/${accountId}`, updateFBAccountDto);
  return data;
};

const updateInAccount = async (accountId: string, updateInAccountDto: SettingState) => {
  const { data } = await axios.patch<any>(`${baseUrl}/linkedin/accounts/${accountId}`, updateInAccountDto);
  return data;
};

export default { updateGmailAccount, updateInstaAccount, updateFBAccount, updateInAccount };
