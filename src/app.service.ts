import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'This app is running! Read documentation on http://localhost:3334/docs';
  }
}
