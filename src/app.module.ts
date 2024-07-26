import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import typeOrmConfig from './config/type.orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { PriorityModule } from './modules/priority/priority.module';
import { CardTypesModule } from './modules/cardTypes/cardTypes.module';
import { SiteModule } from './modules/site/site.module';
import { PreclassifierModule } from './modules/preclassifier/preclassifier.module';
import { RolesModule } from './modules/roles/roles.module';
import { LevelModule } from './modules/level/level.module';
import { CardModule } from './modules/card/card.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { StatusModule } from './modules/status/status.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    typeOrmConfig,
    UsersModule,
    AuthModule,
    CompanyModule,
    PriorityModule,
    CardTypesModule,
    SiteModule,
    PreclassifierModule,
    RolesModule,
    LevelModule,
    CardModule,
    CurrencyModule,
    StatusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
