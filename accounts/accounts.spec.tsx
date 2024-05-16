import theme from '@/styles/theme';
import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import AccountsPage from './index.page';
import { Store, AnyAction } from 'redux';

// Mock the necessary API functions if needed
jest.mock('../gmail/accounts/accounts.api', () => ({}));

const mockStore = configureStore([thunk]);

describe('AccountsPage Component', () => {
  let store: Store<unknown, AnyAction>;

  beforeEach(() => {
    store = mockStore({
      gmailAccounts: [],
      inAccounts: [],
      instaAccounts: [],
      fbAccounts: [],
      addAccountStage: 'MOCK_STAGE',
    });
  });

  it('renders without crashing', () => {
    render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <AccountsPage />
        </Provider>
      </ThemeProvider>,
    );
  });
});
