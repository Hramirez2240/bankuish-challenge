import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class StudyScheduleRequestDto{

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({description: 'User id'})
    id: number;

    @IsNotEmpty()
    @ApiProperty({description: 'User desired courses'})
    desiredCourses: string[];
}