import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Message } from 'src/dao/dtos/message.dto';
import { MessageRequest } from 'src/model/message.model';
import { MessageService } from 'src/service/message.service';

@ApiTags('messages')
@Controller('conversations/:conversationId/messages')
export class MessageController {
	constructor(private readonly messageService: MessageService) {}

	@Get('/')
	@ApiQuery({
		name: 'limit',
		required: false,
		type: Number
	})
	@ApiQuery({
		name: 'offset',
		required: false,
		type: Number
	})
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
		@Query('readerId') readerId: string,
		@Query('limit') limit?: number,
		@Query('offset') offset?: number
	): Promise<Message[]> {
		const messages = await this.messageService.readAll(conversationId, readerId, limit || 20, offset || 0);
		return messages;
	}

	@Get('/:messageId')
	@ApiResponse({ status: 200, description: `The found message`, type: Message })
	async readMessageById(
		@Param('conversationId') conversationId: string,
		@Param('messageId') messageId: string
	): Promise<Message> {
		const message = await this.messageService.readById(conversationId, messageId);
		return message;
	}

	@Post('/')
	@ApiResponse({ status: 201, description: `The created message`, type: Message })
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
		const createdMessage = await this.messageService.create(conversationId, newMessage);
		return createdMessage;
	}

	@Post('/:messageId/markAsRead')
	@ApiResponse({ status: 200, description: `The result of operation`, type: Boolean })
	async markAsReadMessageById(
		@Param('conversationId') conversationId: string,
		@Param('messageId') messageId: string
	): Promise<boolean> {
		this.messageService.markAsRead(conversationId, messageId);
		return true;
	}
}
