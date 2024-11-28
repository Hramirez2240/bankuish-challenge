import { Module } from "@nestjs/common";
import { CourseController } from "src/course/course.controller";
import { CourseService } from "src/course/course.service";
import { AuthModule } from "./common/auth.module";

@Module({
    imports: [AuthModule],
    controllers: [CourseController],
    providers: [CourseService]
})

export class CourseModule {}