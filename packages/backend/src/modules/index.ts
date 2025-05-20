import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module'
import { ChatModule } from './chat/chat.module'
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    UserModule,
    ChatModule,
  ],
})
export class AppModule {}
