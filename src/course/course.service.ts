import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Constants } from 'src/config/constants';
import { BaseResponseDto } from 'src/model/dto/common/base-response.dto';
import { StudyScheduleRequestDto } from 'src/model/dto/study-schedule-request.dto';
import { StudyScheduleResponseDto } from 'src/model/dto/study-schedule-response.dto';
import { User } from 'src/model/entities/user';
import { Repository } from 'typeorm';

@Injectable()
export class CourseService {
  constructor(
    @Inject('CONSTANTS') private readonly constants: typeof Constants,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getStudySchedule(request: StudyScheduleRequestDto): Promise<BaseResponseDto<StudyScheduleResponseDto>> {
    const user = await this.userRepository.findOne({where: {id: request.id}});
    if(!user) throw new BadRequestException(this.constants.responseMessage.USER_NOT_FOUND);

    const filterUniqueCourses = [...new Set(request.desiredCourses)];
    const requiredCourses = Object.keys(this.constants.COURSE_ORDER);
    const seenCourses = new Set<string>();
    const courseSorted = filterUniqueCourses.sort(
      (a, b) => 
          this.constants.COURSE_ORDER[a] - this.constants.COURSE_ORDER[b]
  );

    for (const course of courseSorted) {
      const courseIndex = this.constants.COURSE_ORDER[course];

      if (courseIndex === undefined) {
        throw new BadRequestException(`${this.constants.responseMessage.INVALID_COURSE} ${course}`);
      }

      for(let i = 0; i < courseIndex; i++) {
          const prerequisite = requiredCourses[i];
          if(!seenCourses.has(prerequisite)){
            throw new BadRequestException(`The course ${prerequisite} must be completed before ${course}`);
          }
      }

      seenCourses.add(course);
    }

    return {
        statusCode: HttpStatus.OK,
        data: {
            userId: user.id,
            schedule: courseSorted
        },
        message: this.constants.responseMessage.SCHEDULE_SUCCESSFULLY
    }
  }
}
