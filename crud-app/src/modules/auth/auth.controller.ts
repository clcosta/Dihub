import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService, AuthServicesTypes } from './auth.service';
import { Public } from './decorators/public.decorator';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthSwagger } from './auth.swagger';
import { ApiUnauthorized } from '../../common/swagger';
import { AuthDTO } from './auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse(AuthSwagger.ApiLoginOK)
  @ApiUnauthorizedResponse(ApiUnauthorized)
  @ApiOperation(AuthSwagger.ApiLoginDescription)
  // FIXME: Find a way to use the AuthServiceTypes instead the DTO directly
  // discover why the swagger can't infer the types from the namespace
  @ApiBody({ type: AuthDTO, description: 'Credenciais de acesso' })
  @Public()
  @HttpCode(200)
  @Post('')
  async loginApi(
    @Body() loginDto: AuthServicesTypes.Authenticate.Params,
  ): Promise<AuthServicesTypes.Authenticate.Result> {
    const data = await this.authService.authenticate(loginDto);
    return data;
  }
}
