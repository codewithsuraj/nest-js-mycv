import { ReportsService } from './reports.service';
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dots/create-report.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDto } from './dots/report.dto';
import { ApproveReportDto } from './dots/approve-report.dot';
import { AdminGuard } from 'src/guards/admin.guard';
import { EstimateReportDto } from './dots/estimate-report.dot';

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) { }

    @Get()
    getEstimate(@Query() query: EstimateReportDto) {
        return this.reportsService.createEstimate(query);
    }

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        return this.reportsService.create(body, user);
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
        return this.reportsService.changeApproval(id, body.approved);
    }

}
