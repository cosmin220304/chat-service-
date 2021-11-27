import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { writeFileSync } from 'fs';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Swagger
	const config = new DocumentBuilder()
		.setTitle('Chat Service')
		.setDescription('The Chat Service API description')
		.setVersion('1.0')
		.addTag('Chat Service')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	writeFileSync('./swagger.json', JSON.stringify(document));
	SwaggerModule.setup('api', app, document);

	await app.listen(process.env.PORT || 3000);
}
bootstrap();
