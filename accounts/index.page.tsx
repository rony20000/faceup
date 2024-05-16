import AccountsTemplate from '@/components/templates/AccountsTemplate';
import { Tool } from '@/components/templates/SettingsTemplate/index';
import InAccount from '@/pages/linkedin/accounts/accounts.types';
import { AppDispatch, RootState } from '@/utils/store';
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import FbAccountsAPI from '../facebook/accounts/accounts.api';
import { addNewFbAccount, initializeFbAccounts, verifyAndAddNewFbAccount } from '../facebook/accounts/accounts.slice';
import GmailAccountsAPI from '../gmail/accounts/accounts.api';
import { addNewGmailAccount, initializeGmailAccounts } from '../gmail/accounts/accounts.slice';
import InstaAccountsAPI from '../instagram/accounts/accounts.api';
import {
  addNewInstaAccount,
  initializeInstaAccounts,
  verifyAndAddNewInstaAccount,
} from '../instagram/accounts/accounts.slice';
import LinkedInAccountsAPI from '../linkedin/accounts/accounts.api';
import {
  addNewInAccount,
  initializeInAccounts,
  reconnect,
  reverify,
  verifyAndAddNewInAccount,
} from '../linkedin/accounts/accounts.slice';
import { AddAccountStage } from '../linkedin/accounts/add-account-stage.slice';
import SettingsContent from './SettingsContent';
import { updateFBSetting, updateGmailSetting, updateInSetting, updateInstaSetting } from './accounts.slice';
import { Account, Limits, Setting, SettingState } from './accounts.types';

const platforms = [
  { name: 'gmail', number: 3 },
  { name: 'facebook', number: 0 },
  { name: 'instagram', number: 0 },
  { name: 'linkedIn', number: 0 },
];

export type Platform = 'gmail' | 'linkedIn' | 'facebook' | 'instagram';

const AccountsPage = () => {
  // lists
  const [accounts, setAccounts] = useState<InAccount[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());

  // single states
  const [activePlatform, setActivePlatform] = useState<Platform>('gmail');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [loading] = useState<boolean>(false);

  // modals and menus
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isEmailModalVisible, setIsEmailModalVisible] = useState<boolean>(false);
  const [isLinkedInModalVisible, setIsLinkedInModalVisible] = useState<boolean>(false);
  const [isInstagramModalVisible, setIsInstagramModalVisible] = useState<boolean>(false);
  const [isFacebookModalVisible, setIsFacebookModalVisible] = useState<boolean>(false);

  // email
  const [email, setEmail] = useState<string>('');
  const [authCode, setAuthCode] = useState<string>('');
  const [gmailPass, setGmailPass] = useState<string>('');
  const [method, setMethod] = useState<{ label: string; value: string }>({
    label: 'App Password',
    value: 'AppPassword',
  });

  // facebook
  const [fbAccessKey, setFbAccessKey] = useState<string>('');
  const [fbPass, setFbPass] = useState<string>('');
  const [fbVerificationCode, setFbVerificationCode] = useState<string>('');
  // instagram
  const [instaAccessKey, setInstaAccessKey] = useState<string>('');
  const [instaPass, setInstaPass] = useState<string>('');
  const [instaVerificationCode, setInstaVerificationCode] = useState<string>('');
  // linkedin
  const [inAccessKey, setInAccessKey] = useState<string>('');
  const [inPass, setInPass] = useState<string>('');
  const [inVerificationCode, setInVerificationCode] = useState<string>('');

  const [isForReconnect, setIsForReconnect] = useState(false);
  const [selectedAccountId] = useState<string | null>(null);

  // Drawer States
  const { gmailAccounts, inAccounts, instaAccounts, fbAccounts, addAccountStage } = useSelector((state: RootState) => ({
    gmailAccounts: state.gmailAccounts.gmailAccounts,
    inAccounts: state.inAccounts.inAccounts,
    instaAccounts: state.instaAccounts.instaAccounts,
    fbAccounts: state.fbAccounts.fbAccounts,
    addAccountStage: state.addAccountStage.isVerificationCode,
  }));

  const [selectedAccountForDrawer, setSelectedAccountForDrawer] = useState<Account | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [settingData, setSettingData] = useState<SettingState | null>(null);

  const handleOpenDrawer = (account: Account) => {
    setSelectedAccountForDrawer(account);
    setIsDrawerOpen(true);
  };

  const handleSaveSetting = () => {
    if (!selectedAccountForDrawer || !settingData) return;
    const { __v, _id, ...restLimits } = settingData.limits;
    settingData.limits = restLimits;
    switch (activePlatform) {
      case 'gmail':
        dispatch(updateGmailSetting(selectedAccountForDrawer._id, settingData));
        break;
      case 'instagram':
        dispatch(updateInstaSetting(selectedAccountForDrawer._id, settingData));
        break;
      case 'facebook':
        dispatch(updateFBSetting(selectedAccountForDrawer._id, settingData));
        break;
      case 'linkedIn':
        dispatch(updateInSetting(selectedAccountForDrawer._id, settingData));
        break;
      default:
        toast.error('There is something wrong, Try reload the page');
    }
  };

  // tools for drawer BasicTabs Component
  const tools: Tool[] = [
    {
      title: 'Settings',
      description: '',
      component: (
        <SettingsContent
          settingData={settingData}
          setSettingData={setSettingData}
          account={selectedAccountForDrawer}
          activePlatform={activePlatform}
        />
      ),
    },
  ];

  useEffect(() => {
    if (selectedAccountForDrawer) {
      const optionalData = () => {
        switch (activePlatform) {
          case 'gmail':
            return { status: selectedAccountForDrawer.status };
          default:
            return { isConnected: selectedAccountForDrawer.isConnected };
        }
      };
      const data = optionalData();
      setSettingData({
        limits: selectedAccountForDrawer.limits as Limits,
        setting: selectedAccountForDrawer.setting as Setting,
        ...data,
      });
    }
  }, [selectedAccountForDrawer]);

  // Redux states
  const dispatch: AppDispatch = useDispatch();

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => account.email.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, accounts]);

  // Effects
  useEffect(() => {
    const platformAccountsMap: Record<Platform, any> = {
      gmail: gmailAccounts,
      linkedIn: inAccounts,
      facebook: fbAccounts,
      instagram: instaAccounts,
    };

    setAccounts(platformAccountsMap[activePlatform as Platform] || []);
  }, [gmailAccounts, inAccounts, fbAccounts, instaAccounts, activePlatform]);

  useEffect(() => {
    const platform: Platform = activePlatform as Platform;
    const platformInitMap = {
      gmail: async () => {
        dispatch(initializeGmailAccounts());
      },
      linkedIn: async () => {
        dispatch(initializeInAccounts());
      },
      facebook: async () => {
        dispatch(initializeFbAccounts());
      },
      instagram: async () => {
        dispatch(initializeInstaAccounts());
      },
    };

    const initFunction = platformInitMap[platform];
    if (initFunction) {
      initFunction();
    } else {
      console.error(`Unsupported platform: ${platform}`);
    }
  }, [activePlatform, dispatch]);

  // Handlers

  const handleCheckboxChange = (email: string) => (checked: boolean) => {
    setSelectedAccounts((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(email);
      } else {
        newSet.delete(email);
      }
      return newSet;
    });
  };

  const handleDelete = () => {
    const platformApiMap: Record<Platform, any> = {
      gmail: GmailAccountsAPI,
      linkedIn: LinkedInAccountsAPI,
      facebook: FbAccountsAPI,
      instagram: InstaAccountsAPI,
    };
    const activeApi = platformApiMap[activePlatform];
    if (activeApi) {
      activeApi.remove([...selectedAccounts]);
    } else {
      console.error(`No API found for platform: ${activePlatform}`);
    }
  };

  const handleSearch = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  const handleModalSubmit = async () => {
    const platformFunctionMap: Record<Platform, () => Promise<void>> = {
      gmail:
        method?.value === 'AppPassword'
          ? async () => dispatch(addNewGmailAccount(email, gmailPass))
          : async () => dispatch(addNewGmailAccount(email, undefined, authCode)),
      instagram:
        addAccountStage === AddAccountStage.NEED_VERIFICATION
          ? async () => dispatch(verifyAndAddNewInstaAccount(instaAccessKey, instaPass, instaVerificationCode))
          : async () => dispatch(addNewInstaAccount(instaAccessKey, instaPass)),
      facebook:
        addAccountStage === AddAccountStage.NEED_VERIFICATION
          ? async () => dispatch(verifyAndAddNewFbAccount(fbAccessKey, fbPass, fbVerificationCode))
          : async () => dispatch(addNewFbAccount(fbAccessKey, fbPass)),
      linkedIn: isForReconnect
        ? addAccountStage === AddAccountStage.NEED_VERIFICATION
          ? async () => dispatch(reverify(selectedAccountId as string, inAccessKey, inVerificationCode))
          : async () => dispatch(reconnect(selectedAccountId as string, inAccessKey, inPass, setIsForReconnect))
        : addAccountStage === AddAccountStage.NEED_VERIFICATION
          ? async () => dispatch(verifyAndAddNewInAccount(inAccessKey, inPass, inVerificationCode))
          : async () => dispatch(addNewInAccount(inAccessKey, inPass)),
    };

    const platformFunction = platformFunctionMap[activePlatform as Platform];
    if (platformFunction) {
      await platformFunction();
    } else {
      console.error(`Unsupported platform: ${activePlatform}`);
    }
  };

  const handleModalClick = () => {
    const platformAccountsMap: Record<Platform, any> = {
      gmail: () => setIsEmailModalVisible(true),
      linkedIn: () => setIsLinkedInModalVisible(true),
      facebook: () => setIsFacebookModalVisible(true),
      instagram: () => setIsInstagramModalVisible(true),
    };
    platformAccountsMap[activePlatform as Platform]();
  };

  return (
    <>
      <Head>
        <title>Auto Lead | Accounts</title>
        <meta name="description" content="Linkedin Sequences Management" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AccountsTemplate
        addAccountStage={addAccountStage}
        platforms={platforms}
        activePlatform={activePlatform}
        setActivePlatform={setActivePlatform}
        filteredAccounts={filteredAccounts}
        loading={loading}
        handleCheckboxChange={handleCheckboxChange}
        handleDelete={handleDelete}
        handleModalSubmit={handleModalSubmit}
        handleSearch={handleSearch}
        handleModalClick={handleModalClick}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isEmailModalVisible={isEmailModalVisible}
        setIsEmailModalVisible={setIsEmailModalVisible}
        isLinkedInModalVisible={isLinkedInModalVisible}
        setIsLinkedInModalVisible={setIsLinkedInModalVisible}
        isInstagramModalVisible={isInstagramModalVisible}
        setIsInstagramModalVisible={setIsInstagramModalVisible}
        isFacebookModalVisible={isFacebookModalVisible}
        setIsFacebookModalVisible={setIsFacebookModalVisible}
        email={email}
        setEmail={setEmail}
        authCode={authCode}
        setAuthCode={setAuthCode}
        gmailPass={gmailPass}
        setGmailPass={setGmailPass}
        method={method}
        setMethod={setMethod}
        inAccessKey={inAccessKey}
        setInAccessKey={setInAccessKey}
        inPass={inPass}
        setInPass={setInPass}
        inVerificationCode={inVerificationCode}
        setInVerificationCode={setInVerificationCode}
        selectedAccounts={selectedAccounts}
        handleOpenDrawer={handleOpenDrawer}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        selectedAccountForDrawer={selectedAccountForDrawer}
        tools={tools}
        handleSaveSetting={handleSaveSetting}
        setFbAccessKey={setFbAccessKey}
        setFbPass={setFbPass}
        fbAccessKey={fbAccessKey}
        fbPass={fbPass}
        settingData={settingData as SettingState}
        setSettingData={setSettingData}
        setFbVerificationCode={setFbVerificationCode}
        instaAccessKey={instaAccessKey}
        setInstaAccessKey={setInstaAccessKey}
        instaPass={instaPass}
        setInstaPass={setInstaPass}
        instaVerificationCode={instaVerificationCode}
        setInstaVerificationCode={setInstaVerificationCode}
      />
    </>
  );
};
export default AccountsPage;
