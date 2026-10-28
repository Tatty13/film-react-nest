import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';
export class ResponseListDto<Data> {
  @IsInt()
  @Min(0)
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  items: Data[];
}
