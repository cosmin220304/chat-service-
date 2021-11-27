import { ApiProperty } from '@nestjs/swagger';

export class ConversationRequest {
	@ApiProperty() participants: Array<string>;
}
