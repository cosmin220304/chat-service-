import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Message {
	@ApiProperty()
	@Prop({ required: false, type: MongooseSchema.Types.ObjectId })
	_id: string;

	@ApiProperty()
	@Prop({ required: true })
	conversationId: string;

	@ApiProperty()
	@Prop({ required: true })
	senderId: string;

	@ApiProperty()
	@Prop({ required: true })
	receiverId: string;

	@ApiProperty()
	@Prop({ required: false, selfDefault: new Date() })
	sentDate: Date;

	@ApiProperty()
	@Prop({ selfDefault: false })
	isRead: boolean;

	@ApiProperty()
	@Prop({ required: false })
	seenDate: Date;

	@ApiProperty()
	@Prop({ required: true })
	content: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
