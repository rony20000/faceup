import { AppThunk } from '@/utils/store';
import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import Api from './accounts.api';
import { SettingState } from './accounts.types';

interface InitialState {
  isLoading: boolean;
}

const initialState: InitialState = {
  isLoading: false,
};

const AccountsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    updateGmailSettingStart(state) {
      state.isLoading = true;
    },
    updateGmailSettingFailure(state) {
      state.isLoading = false;
    },
    updateGmailSettingSuccess(state) {
      state.isLoading = false;
    },
    updateInstaSettingStart(state) {
      state.isLoading = true;
    },
    updateInstaSettingFailure(state) {
      state.isLoading = false;
    },
    updateInstaSettingSuccess(state) {
      state.isLoading = false;
    },
    updateFBSettingStart(state) {
      state.isLoading = true;
    },
    updateFBSettingFailure(state) {
      state.isLoading = false;
    },
    updateFBSettingSuccess(state) {
      state.isLoading = false;
    },
    updateInSettingStart(state) {
      state.isLoading = true;
    },
    updateInSettingFailure(state) {
      state.isLoading = false;
    },
    updateInSettingSuccess(state) {
      state.isLoading = false;
    },
  },
});

const {
  updateGmailSettingStart,
  updateGmailSettingFailure,
  updateGmailSettingSuccess,
  updateInstaSettingStart,
  updateInstaSettingFailure,
  updateInstaSettingSuccess,
  updateFBSettingStart,
  updateFBSettingFailure,
  updateFBSettingSuccess,
  updateInSettingStart,
  updateInSettingFailure,
  updateInSettingSuccess,
} = AccountsSlice.actions;

export const updateGmailSetting =
  (accountId: string, updateGmailAccountDto: SettingState): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(updateGmailSettingStart());
      await Api.updateGmailAccount(accountId, updateGmailAccountDto);
      dispatch(updateGmailSettingSuccess());
      toast.success('Gmail setting updated successfully');
    } catch (error) {
      dispatch(updateGmailSettingFailure());
      toast.error('Gmail setting update failed');
    }
  };

export const updateInstaSetting =
  (accountId: string, updateInstaAccountDto: SettingState): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(updateInstaSettingStart());
      await Api.updateInstaAccount(accountId, updateInstaAccountDto);
      dispatch(updateInstaSettingSuccess());
      toast.success('Instagram setting updated successfully');
    } catch (error) {
      dispatch(updateInstaSettingFailure());
      toast.error('Instagram setting update failed');
    }
  };

export const updateFBSetting =
  (accountId: string, updateFBAccountDto: SettingState): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(updateFBSettingStart());
      await Api.updateFBAccount(accountId, updateFBAccountDto);
      dispatch(updateFBSettingSuccess());
      toast.success('Facebook setting updated successfully');
    } catch (error) {
      dispatch(updateFBSettingFailure());
      toast.error('Facebook setting update failed');
    }
  };

export const updateInSetting =
  (accountId: string, updateInAccountDto: SettingState): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(updateInSettingStart());
      await Api.updateInAccount(accountId, updateInAccountDto);
      dispatch(updateInSettingSuccess());
      toast.success('Linkedin setting updated successfully');
    } catch (error) {
      dispatch(updateInSettingFailure());
      toast.error('Linkedin setting update failed');
    }
  };

export default AccountsSlice.reducer;
