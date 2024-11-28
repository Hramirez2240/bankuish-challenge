import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { CourseService } from "./course.service";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { BaseResponseDto } from "src/model/dto/common/base-response.dto";
import { StudyScheduleResponseDto } from "src/model/dto/study-schedule-response.dto";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { StudyScheduleRequestDto } from "src/model/dto/study-schedule-request.dto";

@Controller('courses')
export class CourseController{

    constructor(
        private readonly courseService: CourseService
    )
    {}

    @ApiOperation({ operationId: 'Get study schedule' })
    @Post('/schedule')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns the study schedule of the user with the given email address.'
    })
    getStudySchedule(@Body() request: StudyScheduleRequestDto): Promise<BaseResponseDto<StudyScheduleResponseDto>>{
        return this.courseService.getStudySchedule(request);
    }

}