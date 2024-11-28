export interface BaseResponseDto<T> {
    statusCode: number;
    data: T;
    message: string;
}