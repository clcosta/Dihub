import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Req } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { UserService } from "./users.service";
import { Public } from '../auth/decorators/public.decorator';
import { ApiUnauthorized } from '../../common/swagger'
import { CreateUserDTO, UpdateUserDTO } from "./users.dto";
import { AppRequest } from "../../contracts/app-request-contract";
import { UsersSwagger } from "./users.swagger";

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiSecurity('bearer')
  @ApiOperation(UsersSwagger.ApiGetMeDescription)
  @ApiOkResponse(UsersSwagger.ApiGetMeOK)
  @ApiUnauthorizedResponse(ApiUnauthorized)
  @Get('/me')
  async getMe(@Req() request: AppRequest) {
    const userId = request.user.id
    return this.userService.get(userId);
  }

  @ApiOperation(UsersSwagger.ApiGetAllUsersDescription)
  @ApiOkResponse(UsersSwagger.ApiGetAllUsersOK)
  @Public()
  @Get('')
  async getAllUsers() {
    return this.userService.getAll();
  }

  @ApiOperation(UsersSwagger.ApiCreateUserDescription)
  @ApiOkResponse(UsersSwagger.ApiCreateUserOK)
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('')
  async createUser(@Body() user: CreateUserDTO) {
    return this.userService.create(user);
  }

  @ApiSecurity('bearer')
  @ApiOperation(UsersSwagger.ApiUpdateUserDescription)
  @ApiOkResponse(UsersSwagger.ApiUpdateUserOK)
  @ApiUnauthorizedResponse(ApiUnauthorized)
  @Patch('')
  async updateUser(
    @Body() user: UpdateUserDTO,
    @Req() request: AppRequest
  ) {
    const userId = request.user.id
    return this.userService.update(userId, user);
  }

  @ApiSecurity('bearer')
  @ApiOperation(UsersSwagger.ApiDeleteUserDescription)
  @ApiOkResponse(UsersSwagger.ApiDeleteUserOK)
  @ApiUnauthorizedResponse(ApiUnauthorized)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('')
  async deleteUser(@Req() request: AppRequest) {
    const userId = request.user.id
    return this.userService.delete(userId);
  }
}