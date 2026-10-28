import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { ResponseListDto } from 'src/common/dto/response.dto';

export class TicketDto {
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
  @IsString()
  @IsNotEmpty()
  film: string;

  @IsString()
  @IsNotEmpty()
  session: string;

  @IsDateString()
  daytime: string; // UTC

  @IsInt()
  @Min(1)
  row: number;

  @IsInt()
  @Min(1)
  seat: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class OrderResultDto extends OrderDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class CreateOrderDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}

export class ResponseCreateOrderDto extends ResponseListDto<OrderResultDto> {}
