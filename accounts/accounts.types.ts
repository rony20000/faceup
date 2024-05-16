export interface ModalProps {
  addAccountStage: any;
  AddAccountStage: any;
  accessKey: string;
  setAccessKey: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  verificationCode: string;
  setVerificationCode: (value: string) => void;
}

export interface GmailModalProps {
  method: { value: string; label: string } | undefined;
  setMethod: React.Dispatch<React.SetStateAction<{ value: string; label: string } | undefined>>;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  authCode: string;
  setAuthCode: (value: string) => void;
}

export interface Account {
  _id: string;
  email?: string;
  limits: Limits;
  setting: Setting;
  status?: boolean;
  lastUsage?: string;
  accessKey?: string;
  fullName?: string;
  isConnected?: boolean;
  photoUrl?: string;
  __v?: number;
}

export interface SettingState {
  setting: Setting;
  limits: Limits;
  status?: boolean;
  isConnected?: boolean;
}

export interface Setting {
  sender?: {
    firstName?: string;
    lastName?: string;
    signature?: string;
  };
  replyTo?: string;
}

export interface Limits {
  _id?: string;
  __v?: number;
  maxDailyEmails?: number;
  waitFor?: number;
  connections?: number;
  endorses?: number;
  likes?: number;
  messages?: number;
  views?: number;
  withdraws?: number;
}
