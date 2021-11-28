import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationController } from 'src/controller/conversation.controller';
import { MessageController } from 'src/controller/message.controller';
import { ConversationService } from 'src/service/conversation.service';
import { MessageService } from 'src/service/message.service';
import { Conversation, ConversationSchema } from './dtos/conversation.dto';
import { Message, MessageSchema } from './dtos/message.dto';

@Module({
	imports: [ MongooseModule.forFeature([ { name: Conversation.name, schema: ConversationSchema } ]) ],
	providers: [ ConversationService ],
	controllers: [ ConversationController ]
})
export class ConversationModule {}

@Module({
	imports: [ MongooseModule.forFeature([ { name: Conversation.name, schema: ConversationSchema } ]) ],
	providers: [ MessageService ],
	controllers: [ MessageController ]
})
export class MessageModule {}
