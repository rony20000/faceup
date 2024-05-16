import * as mongoose from 'mongoose';
import { InAccountsService } from './in-accounts.service';
import { InAccount, InAccountDocument } from './schemas/in-account.schema';

describe('InAccountsService', () => {
  let inAccountsService: InAccountsService;
  let inAccountModel: mongoose.Model<InAccountDocument>;

  beforeEach(() => {
    inAccountModel =
      {
        find: jest.fn(),
      } as unknown as mongoose.Model<InAccountDocument>;


    inAccountsService = new InAccountsService(
      null,
      inAccountModel,
      null, // Inject your mock connection here if needed
      null, // Mock other injected dependencies if needed
    );
  });

  describe('findAll', () => {
    it('should return an array of inAccounts', async () => {
      // Mock data
      const mockTeamId = new mongoose.Schema.Types.ObjectId("mockTeamId");
      const mockInAccounts = [
        {
          fullName: 'John Doe',
          email: 'johndoe@example.com',
          photoUrl: 'https://example.com/avatar.jpg',
          accessKey: 'dummy_access_key',
          encryptedPassword: 'dummy_encrypted_password',
          cookies: [{ name: 'cookie1', value: 'value1' }, { name: 'cookie2', value: 'value2' }],
          limits: {} as any, // Replace with a valid ObjectId
          teamId: mockTeamId, // Replace with a valid ObjectId
          isConnected: true,
        },


      ];

      // Mock the find method of the model to return the mockInAccounts
      jest.spyOn(inAccountModel, 'find').mockResolvedValue(mockInAccounts as InAccountDocument[]);

      // Call the findAll method
      const result = await inAccountsService.findAll(mockTeamId);

      // Check if the result matches the mock data
      expect(result).toEqual(mockInAccounts);
    });

  });
});
