import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos/login-request.dto';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { RegisterResponseDto } from './dtos/register-response.dto';
import { Public } from './decorators/public.decorators';
import { CurrentUser } from './decorators/users.decorators';
import { User } from '../users/users.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: RegisterRequestDto): Promise<RegisterResponseDto> {
        return this.authService.register(dto.email, dto.password, dto.role);
    }

    @Public()
    @UseGuards(AuthGuard('local'))
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() dto: LoginRequestDto,
        @CurrentUser() user: User,
    ): Promise<LoginResponseDto> {
        return this.authService.login(user);
    }
}
