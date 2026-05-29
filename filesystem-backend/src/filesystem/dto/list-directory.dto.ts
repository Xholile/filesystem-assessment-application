import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class ListDirectoryDto {

  @IsString()
  @IsNotEmpty()
  @Matches(/^\/host(\/.*)?$/, {
    message: 'Path must start with /host',
  })
  path: string;
}