import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {connect as connectToEventStore} from './eventstore'

const port: number = 8080

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  connectToEventStore()
  await app.listen(port)
}
bootstrap().then(() => console.log('Application is listening on port ' + port))
