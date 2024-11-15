import { Injectable } from '@nestjs/common';
import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';
import { env } from '../../config';

@Injectable()
export class HashService {
  async hash(plainText: string): Promise<string> {
    const hash = await bcryptHash(plainText, env.security.hash.rounds);
    return hash;
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    const isValid = await bcryptCompare(plainText, hash);
    return isValid;
  }
}
