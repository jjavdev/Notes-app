import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    if (dto.username === 'admin' && dto.password === 'admin') {
      const token = this.jwtService.sign({ username: dto.username });
      return { token };
    }
    throw new UnauthorizedException();
  }
}
