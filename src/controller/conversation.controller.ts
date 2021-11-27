import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Conversation } from 'src/dao/dtos/conversation.dto';
import { ConversationRequest } from 'src/model/conversation.model';
import { ConversationService } from 'src/service/conversation.service';

@ApiTags('conversations')
@Controller('conversations')
export class ConversationController {
	constructor(private readonly conversationService: ConversationService) {}

	@Get('/:id')
	@ApiResponse({ status: 200, description: 'The found conversation', type: Conversation })
	async getConversationById(@Param('id') id: string): Promise<Conversation> {
		return await this.conversationService.readConversationById(id);
	}

	@Get('/user/:userId')
	@ApiResponse({ status: 200, description: 'The found conversations', type: [ Conversation ] })
	async getConversationOfUser(@Param('userId') userId: string): Promise<Conversation[]> {
		return await this.conversationService.readConversationsOfUser(userId);
	}

	@Get('/user1/:userId1/user2/:userId2')
	@ApiResponse({ status: 200, description: 'The found conversation', type: Conversation })
	@ApiResponse({ status: 201, description: 'The created conversation', type: Conversation })
	async getConversationBetweenUsers(
		@Param('userId1') user1: string,
		@Param('userId2') user2: string
	): Promise<Conversation> {
		let conversation = await this.conversationService.readConversationBetweenUsers(user1, user2);
		if (!conversation) {
			const newConversation: Conversation = {
				_id: null,
				participants: [ user1, user2 ],
				lastMessage: null,
				messages: []
			};
			conversation = await this.conversationService.create(newConversation);
		}
		return conversation;
	}

	@Post('/')
	@ApiResponse({ status: 201, description: 'The created conversation', type: Conversation })
	@ApiResponse({ status: 500, description: 'Conversation already exists' })
	async createConversation(@Body() conversation: ConversationRequest): Promise<Conversation> {
		let foundConversation = await this.conversationService.readConversationBetweenUsers(
			conversation.participants[0],
			conversation.participants[1]
		);
		if (foundConversation) {
			throw new Error('Conversation already exists');
		}

		return await this.conversationService.create({
			...conversation,
			_id: null,
			messages: [],
			lastMessage: null
		});
	}
}
