import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationModule, MessageModule } from './dao/dao.module';

const DB_URL = 'mongodb+srv://radu:radu@cluster0.6vxoq.mongodb.net/DATABASE?retryWrites=true&w=majority';
@Module({
	imports: [ MongooseModule.forRoot(DB_URL), ConversationModule, MessageModule ]
})
export class AppModule {}
