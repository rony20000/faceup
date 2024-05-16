import { HideSensitiveDataInterceptor } from './hide-sensitive-data.interceptor';

describe('HideSensitiveDataInterceptor', () => {
  it('should be defined', () => {
    expect(new HideSensitiveDataInterceptor()).toBeDefined();
  });
});
