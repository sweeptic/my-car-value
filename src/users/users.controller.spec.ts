import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'fggff@gfhgfre.com',
          password: 'password',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: 'password' } as User,
        ]);
      },
      //   remove: () => {},
      //   update: () => {},
    };
    fakeAuthService = {
      //   signup: () => {},
      signin: (email: string, password: string) => {
        console.log('FAKE RUN');

        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUser('asd@asdf.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asd@asdf.com');
  });

  it('findOne returns a single user with the given id', async () => {
    const users = await controller.findUser('1');
    expect(users).toBeDefined();
  });

  it('findOne throws an error if the given id is not found', (done) => {
    (async () => {
      fakeUserService.findOne = () => null;
      try {
        await controller.findUser('1');
      } catch (error) {
        done();
      }
    })();
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      { email: 'dfdf@sdf.com', password: 'dfd' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
