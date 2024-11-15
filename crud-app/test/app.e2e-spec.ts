import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/modules/users/users.service';
import { AuthService } from '../src/modules/auth/auth.service';
import { AuthGuard } from '../src/modules/auth/auth.guard';

class MockAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    request.user = { id: '1' };
    return true;
  }
}

let userService = {
  get: jest.fn(),
  getAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const basicUser = {
  id: '1',
  name: 'John Doe',
  email: 'jonhdoe@email.com',
  createdAt: "2024-11-12T14:54:27.100Z",
  updatedAt: "2024-11-12T14:54:27.100Z"
}

let authService = { authenticate: jest.fn() };

describe('End to end tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthGuard).useClass(MockAuthGuard)
      .overrideProvider(UserService).useValue(userService)
      .overrideProvider(AuthService).useValue(authService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => { // to certitfy after all tests run the app is closed
    await app.close();
  });

  it('/user/me (GET)', () => {
    userService.get.mockResolvedValue(basicUser);
    return request(app.getHttpServer())
      .get('/user/me')
      .set('Authorization' , 'Bearer fake-token')
      .expect(200)
      .expect(basicUser);
  });

  it('/user (GET)', () => {
    userService.getAll.mockResolvedValue([basicUser]);
    return request(app.getHttpServer())
      .get('/user')
      .expect(200)
      .expect([basicUser]);
  });

  it('/user (POST)', () => {
    userService.create.mockResolvedValue(basicUser);
    return request(app.getHttpServer())
      .post('/user')
      .send({ name: basicUser.name, email: basicUser.email })
      .expect(201)
      .expect(basicUser);
  });

  it('/user (PATCH)', () => {
    userService.update.mockResolvedValue({...basicUser, name: 'Updated User'});
    return request(app.getHttpServer())
      .patch('/user')
      .send({ name: 'Updated User', email: basicUser.email })
      .expect(200)
      .expect({ ...basicUser, name: 'Updated User' });
  });

  it('/user (DELETE)', () => {
    userService.delete.mockResolvedValue({});
    return request(app.getHttpServer()).delete('/user').expect(204);
  });

  it('/auth (POST)', () => {
    authService.authenticate.mockResolvedValue({ token: 'eyJhbGciOiJIUzI1...', "validUntil": 1727989957482  });
    return request(app.getHttpServer())
      .post('/auth')
      .send({ username: 'test', password: 'test' })
      .expect(200)
      .expect({ token: 'eyJhbGciOiJIUzI1...', "validUntil": 1727989957482 });
  });
});
