import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PriorityEntity } from './entities/priority.entity';
import { Repository } from 'typeorm';
import { HandleException } from 'src/common/exceptions/handler/handle.exception';
import {
  NotFoundCustomException,
  NotFoundCustomExceptionType,
} from 'src/common/exceptions/types/notFound.exception';
import { CreatePriorityDTO } from './models/dto/create.priority.dto';
import { CompanyService } from '../company/company.service';
import { stringConstants } from 'src/utils/string.constant';
import { UpdatePriorityDTO } from './models/dto/update.priority.dto';
import { SiteService } from '../site/site.service';
import { UsersService } from '../users/users.service';
import { FirebaseService } from '../firebase/firebase.service';
import { NotificationDTO } from '../firebase/models/firebase.request.dto';

@Injectable()
export class PriorityService {
  constructor(
    @InjectRepository(PriorityEntity)
    private readonly priorityRepository: Repository<PriorityEntity>,
    private readonly siteService: SiteService,
    private readonly userService: UsersService,
    private readonly firebaseService: FirebaseService,
  ) {}

  findSiteActivePriorities = async (siteId: number) => {
    try {
      return await this.priorityRepository.findBy({
        siteId: siteId,
        status: stringConstants.A,
      });
    } catch (exception) {
      HandleException.exception(exception);
    }
  };
  findSitePriorities = async (siteId: number) => {
    try {
      return await this.priorityRepository.findBy({ siteId: siteId });
    } catch (exception) {
      HandleException.exception(exception);
    }
  };

  create = async (createPriorityDTO: CreatePriorityDTO) => {
    try {
      const foundSite = await this.siteService.findById(
        createPriorityDTO.siteId,
      );

      if (!foundSite) {
        throw new NotFoundCustomException(NotFoundCustomExceptionType.COMPANY);
      }

      createPriorityDTO.siteCode = foundSite.siteCode;
      createPriorityDTO.createdAt = new Date();

      const tokens = await this.userService.getSiteUsersTokens(
        createPriorityDTO.siteId,
      );
      await this.firebaseService.sendMultipleMessage(
        new NotificationDTO(
          stringConstants.catalogsTitle,
          stringConstants.catalogsDescription,
          stringConstants.catalogsNotificationType,
        ),
        tokens,
      );

      return await this.priorityRepository.save(createPriorityDTO);
    } catch (exception) {
      HandleException.exception(exception);
    }
  };

  update = async (updatepriorityDTO: UpdatePriorityDTO) => {
    try {
      const foundPriority = await this.priorityRepository.findOne({
        where: { id: updatepriorityDTO.id },
      });

      if (!foundPriority) {
        throw new NotFoundCustomException(NotFoundCustomExceptionType.PRIORITY);
      }

      foundPriority.priorityCode = updatepriorityDTO.priorityCode;
      foundPriority.priorityDescription = updatepriorityDTO.priorityDescription;
      foundPriority.priorityDays = updatepriorityDTO.priorityDays;
      foundPriority.status = updatepriorityDTO.status;
      if (updatepriorityDTO.status !== stringConstants.A) {
        foundPriority.deletedAt = new Date();
      }
      foundPriority.updatedAt = new Date();

      const tokens = await this.userService.getSiteUsersTokens(
        foundPriority.siteId,
      );
      await this.firebaseService.sendMultipleMessage(
        new NotificationDTO(
          stringConstants.catalogsTitle,
          stringConstants.catalogsDescription,
          stringConstants.catalogsNotificationType,
        ),
        tokens,
      );

      return await this.priorityRepository.save(foundPriority);
    } catch (exception) {
      HandleException.exception(exception);
    }
  };
  findById = async (id: number) => {
    try {
      const priorityExist = await this.priorityRepository.existsBy({ id: id });
      if (!priorityExist) {
        throw new NotFoundCustomException(NotFoundCustomExceptionType.PRIORITY);
      }

      return await this.priorityRepository.findOneBy({ id: id });
    } catch (exception) {
      HandleException.exception(exception);
    }
  };
}
