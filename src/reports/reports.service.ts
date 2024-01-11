import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dots/create-report.dto';
import { User } from 'src/users/user.entity';
import { EstimateReportDto } from './dots/estimate-report.dot';

@Injectable()
export class ReportsService {

    constructor(
        @InjectRepository(Report) private reportRepository: Repository<Report>,
    ) { }

    createEstimate({ make, model, lng, lat, year, mileage }: EstimateReportDto) {
        return this.reportRepository.createQueryBuilder()
            .select('AVG(price)', 'price')
            .where('make = :make', { make })
            .andWhere('model = :model', { model })
            .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
            .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
            .andWhere('year - :year BETWEEN -3 AND 3', { year })
            .andWhere('approved IS TRUE')
            .orderBy('ABS(mileage - :mileage)', 'DESC')
            .setParameters({ mileage })
            .limit(3)
            .getRawOne();
    }

    create(createReportDto: CreateReportDto, user: User) {
        const report = this.reportRepository.create(createReportDto);
        report.user = user;
        return this.reportRepository.save(report);
    }

    async changeApproval(id: string, approved: boolean) {
        const report = await this.reportRepository.findOne({ where: { id: parseInt(id) } });
        if (!report) throw new NotFoundException('report not found');
        report.approved = approved;
        return this.reportRepository.save(report);
    }

}
