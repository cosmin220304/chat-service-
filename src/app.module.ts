import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationModule, MessageModule } from './dao/dao.module';

const DB_URL =
	'mongodb+srv://cosmin0123:cosmin0123@cluster0.a2fi8.mongodb.net/ConversationStorage?retryWrites=true&w=majority';
@Module({
	imports: [ MongooseModule.forRoot(DB_URL), ConversationModule, MessageModule ]
})
export class AppModule {}
