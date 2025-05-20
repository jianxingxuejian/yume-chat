import { Injectable, Logger, LogLevel, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '../../../generated/prisma'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  public constructor(configService: ConfigService) {
    super({
      errorFormat: 'colorless',
    })
  }

  public async onModuleInit() {
    try {
      await this.$connect()
    } catch (error) {
      Logger.error(error, 'PrismaService')
    }
  }

  public async onModuleDestroy() {
    await this.$disconnect()
  }
}
