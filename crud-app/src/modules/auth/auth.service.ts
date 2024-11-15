import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDTO } from './auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/entities/user';
import { Repository } from 'typeorm';
import { HashService } from '../../providers/hash/hash.service';
import { AppJwtService } from '../../providers/jwt/jwt.service';
import { env } from '../../config';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
    private readonly appJwtService: AppJwtService,
  ) {}
  private readonly loginException = new UnauthorizedException(
    'Usuário ou senha inválidos',
  );

  async authenticate(loginDto: AuthServicesTypes.Authenticate.Params): Promise<AuthServicesTypes.Authenticate.Result> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    })
    if (!user) throw this.loginException;
    const isValidPwd = await this.hashService.compare(loginDto.password, user.password);
    if (!isValidPwd) throw this.loginException;

    const token = this.appJwtService.sign({
      id: user.id,
      email: user.email,
    });

    return {
      token,
      validUntil: new Date().getTime() + 1000 * 60 * env.security.jwt.expiration,
    }
  }

}

export namespace AuthServicesTypes {
  export namespace Authenticate {
    export type Params = AuthDTO;
    export type Result = {
      token: string;
      validUntil: number;
    }
  }
}