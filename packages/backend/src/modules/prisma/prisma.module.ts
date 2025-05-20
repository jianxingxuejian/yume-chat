import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from './prisma.service'

@Module({
  exports: [PrismaService],
  providers: [ConfigService, PrismaService],
})
export class PrismaModule {}
