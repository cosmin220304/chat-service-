import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from 'src/dao/dtos/conversation.dto';
import { Message } from 'src/dao/dtos/message.dto';

@Injectable()
export class ConversationService {
	constructor(@InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>) {}

	async readConversationById(conversationId: string): Promise<Conversation> {
		const conversation = await this.conversationModel.findById(conversationId);
		return conversation;
	}

	async create(conversation: Conversation): Promise<Conversation> {
		const createdConversation = new this.conversationModel(conversation);
		return await createdConversation.save();
	}

	async readConversationBetweenUsers(participant1: string, participant2: string): Promise<Conversation> {
		const conversation = await this.conversationModel.findOne({
			participants: { $all: [ participant1, participant2 ] }
		});
		return conversation;
	}

	async readConversationsOfUser(userId: string): Promise<Conversation[]> {
		const conversations = await this.conversationModel.find({ participants: userId });
		return conversations;
	}

	async addMessageToConversation(conversationId: string, message: Message): Promise<Conversation> {
		const conversation = await this.conversationModel.findById(conversationId);
		conversation.lastMessage = message;
		conversation.messages.push(message);

		return await conversation.save();
	}
}
