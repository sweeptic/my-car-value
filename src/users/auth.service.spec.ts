import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an service of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'my-password');

    expect(user.password).not.toEqual('my-password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', (done) => {
    (async () => {
      fakeUsersService.find = () =>
        Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
      try {
        await service.signup('test@test.com', 'my-password');
      } catch (error) {
        console.log('error');
        done();
      }
    })();
  });

  it('throws if signin is called with an unused email', (done) => {
    (async () => {
      try {
        await service.signin('test@test.com', 'my-password');
      } catch (error) {
        done();
      }
    })();
  });
});
