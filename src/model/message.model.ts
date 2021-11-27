import { ApiProperty } from '@nestjs/swagger';

export class MessageRequest {
	@ApiProperty() senderId: string;
	@ApiProperty() receiverId: string;
	@ApiProperty() content: string;
}
