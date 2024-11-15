import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/contracts/jwt-contract';

@Injectable()
export class AppJwtService {
  constructor(private jwtService: JwtService) {}
  sign(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  verify(token: string): Promise<JwtPayload | null> {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
