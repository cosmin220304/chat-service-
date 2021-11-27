import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Message } from 'src/dao/dtos/message.dto';
import { MessageRequest } from 'src/model/message.model';
import { ConversationService } from 'src/service/conversation.service';
import { MessageService } from 'src/service/message.service';

@ApiTags('messages')
@Controller('conversations/:conversationId/messages')
export class MessageController {
	constructor(
		private readonly messageService: MessageService,
		private readonly conversationService: ConversationService
	) {}

	@Get('/')
	@ApiResponse({
		status: 200,
		description: `The found messages of conversation with id <conversationId>. 
					  Will mark as read all messages from conversation.
					  You can use query string limit and offset for retrieving:
						e.g. limit = 1 and no offset will read last message`,
		type: [ Message ]
	})
	async readAllMessages(
		@Param('conversationId') conversationId: string,
		@Query('limit') limit?: number,
		@Query('offset') offset?: number
	): Promise<Message[]> {
		const messages = await this.messageService.readAll(conversationId, limit || 20, offset || 0);
		for (const message of messages) {
			await this.messageService.markAsRead(message._id);
		}
		return messages;
	}

	@Get('/:messageId')
	@ApiResponse({ status: 200, description: `The found message`, type: Message })
	async readMessageById(@Param('messageId') messageId: string): Promise<Message> {
		return await this.messageService.readById(messageId);
	}

	@Post('/')
	@ApiResponse({ status: 201, description: `The created message`, type: Message })
	@ApiResponse({ status: 500, description: `Message not created` })
	async sendMessage(
		@Param('conversationId') conversationId: string,
		@Body() message: MessageRequest
	): Promise<Message> {
		const newMessage: Message = {
			...message,
			_id: null,
			conversationId: conversationId,
			sentDate: new Date(),
			isRead: false,
			seenDate: null
		};

		const createdMessage = await this.messageService.create(newMessage);
		if (!createdMessage) {
			throw new Error('Message not created');
		}
		await this.conversationService.addMessageToConversation(conversationId, createdMessage);

		return createdMessage;
	}
}
