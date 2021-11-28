import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from 'src/dao/dtos/conversation.dto';
import { Message } from 'src/dao/dtos/message.dto';

@Injectable()
export class MessageService {
	constructor(@InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>) {}

	async create(conversationId: string, message: Message): Promise<Message> {
		const conversation = await this.conversationModel.findById(conversationId);
		conversation.messages.push(message);
		await conversation.save();
		return message;
	}

	async markAsRead(conversationId: string, messageId: string): Promise<void> {
		const conversation = await this.conversationModel.findById(conversationId);
		conversation.messages.forEach((message) => {
			if (message._id === messageId && !message.isRead) {
				message.seenDate = new Date();
				message.isRead = true;
			}
		});
		await conversation.save();
	}

	async readAll(conversationId: string, readerId: string, limit: number, offset: number): Promise<Message[]> {
		const conversation = await this.conversationModel.findById(conversationId);
		conversation.messages.forEach((message) => {
			if (message.receiverId === readerId) {
				message.isRead = true;
				message.seenDate = new Date();
			}
		});
		await conversation.save();
		return conversation.messages.slice(offset, limit);
	}

	async readById(conversationId: string, messageId: string): Promise<Message> {
		const conversation = await this.conversationModel.findById(conversationId);
		return conversation.messages.find((message) => message._id === messageId);
	}
}
