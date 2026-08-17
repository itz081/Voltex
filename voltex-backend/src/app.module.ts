import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VoltexModule } from './voltex/voltex.module';

@Module({
  imports: [VoltexModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
