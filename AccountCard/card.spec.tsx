import { Account } from '@/pages/accounts/accounts.types';
import { render } from '@testing-library/react';
import React from 'react';
import Card from './';
import InAccount from '@/pages/linkedin/accounts/accounts.types';

const mockAccount: InAccount = {
  email: '',
  _id: '',
  accessKey: '',
  fullName: '',
  photoUrl: '',
  limits: {
    views: 0,
    connections: 0,
    withdraws: 0,
    messages: 0,
    likes: 0,
    endorses: 0,
  },

  isConnected: false,
  setting: {},
  __v: 0,
};

jest.mock('../../../components/UI/Button', () => ({
  // Mock the Button component
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
describe('Card component', () => {
  const email = 'test@example.com';
  const onCheckboxChange = jest.fn();
  const isMenuOpen = false;

  it('renders correctly', () => {
    const { getByText } = render(
      <Card
        email={email}
        onCheckboxChange={onCheckboxChange}
        isMenuOpen={isMenuOpen}
        isChecked={false}
        account={mockAccount}
        handleOpenDrawer={function (_: Account): void {
          throw new Error('Function not implemented.');
        }}
      />,
    );

    expect(getByText(email)).toBeInTheDocument();
    expect(getByText('Manage')).toBeInTheDocument();
  });
});
