import { Module } from '@nestjs/common';
import { CourseModule } from './modules/course.module';
import { UserModule } from './modules/user.module';

@Module({
  imports: [CourseModule, UserModule],
})
export class AppModule {}
