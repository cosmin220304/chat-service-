import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from 'src/dao/dtos/message.dto';

@Injectable()
export class MessageService {
	constructor(@InjectModel(Message.name) private readonly messageModel: Model<Message>) {}

	async create(message: Message): Promise<Message> {
		const createdMessage = new this.messageModel(message);
		return await createdMessage.save();
	}

	async markAsRead(messageId: string): Promise<Message> {
		const message = await this.messageModel.findById(messageId);
		if (!message.isRead) {
			message.seenDate = new Date();
			message.isRead = true;
			return await message.save();
		}
		return message;
	}

	async readAll(conversationId: string, limit: number, offset: number): Promise<Message[]> {
		return await this.messageModel
			.find({ conversationId: conversationId })
			.sort({ sentDate: -1 })
			.limit(limit)
			.skip(offset)
			.exec();
	}

	async readById(id: string): Promise<Message> {
		return await this.messageModel.findById(id);
	}
}
