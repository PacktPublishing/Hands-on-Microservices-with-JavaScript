import {EventStoreDBClient, FORWARDS, START} from '@eventstore/db-client'

const client = EventStoreDBClient.connectionString(
  'esdb://localhost:2113?tls=false',
)

const connect = () => {
  try {
    client.readAll({
      direction: FORWARDS,
      fromPosition: START,
      maxCount: 1,
    })
  } catch (error) {
    console.error('Failed to connect to EventStoreDB:', error)
  }
}

export {client, connect}