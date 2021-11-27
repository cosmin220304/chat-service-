import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Message, MessageSchema } from './message.dto';

export type ConversationDocument = Conversation & Document;

@Schema()
export class Conversation {
	@ApiProperty()
	@Prop({ type: MongooseSchema.Types.ObjectId })
	_id: string;

	@ApiProperty()
	@Prop({ required: true, length: 2 })
	participants: Array<string>;

	@ApiProperty()
	@Prop({ required: false, selfDefault: null, type: MessageSchema })
	lastMessage: Message;

	@ApiProperty()
	@Prop({ required: false, selfDefault: [], type: [ MessageSchema ] })
	messages: Array<Message>;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
