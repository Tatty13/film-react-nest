import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { ResponseListDto } from 'src/common/dto/response.dto';

export class CreateOrderTicketDto {
  @IsString()
  @IsNotEmpty()
  film: string;

  @IsString()
  @IsNotEmpty()
  session: string;

  @IsInt()
  @Min(1)
  row: number;

  @IsInt()
  @Min(1)
  seat: number;
}

export class OrderDto {
  film: string;
  session: string;
  daytime: string; // UTC
  row: number;
  seat: number;
  price: number;
}

export class OrderResultDto extends OrderDto {
  id: string;
}

export class CreateOrderDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderTicketDto)
  tickets: CreateOrderTicketDto[];
}

export class ResponseCreateOrderDto extends ResponseListDto<OrderResultDto> {}
