import { IsNotEmpty, IsNumber } from "class-validator";

export class StudyScheduleResponseDto{

    @IsNumber()
    userId: number;

    @IsNotEmpty()
    schedule: string[];
}