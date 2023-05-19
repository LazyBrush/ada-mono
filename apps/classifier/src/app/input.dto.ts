import { ApiProperty } from '@nestjs/swagger';

export class InputDTO {
  @ApiProperty({
    description: 'Array to classify',
    example: '[1,2,3]',
  })
  array: number[];

  @ApiProperty({
    description: 'name of array',
    example: 'my array',
  })
  name: string;
}
