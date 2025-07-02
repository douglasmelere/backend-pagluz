import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'API Sistema Solar Energy - Acesse /api para documentação';
  }
}