import * as env from 'env-var';
import 'dotenv/config';

const config = {
  service: {
    port: env.get('PORT').default(3000).asIntPositive(),
    updateCron: env.get('UPDATE_CRON').default('0 */3 * * *').asString(),
    runCronOnStart: env.get('RUN_CRON_ON_START').default('true').asBool(),
  },
  mongo: {
    uri: env.get('MONGO_URI').required().asUrlString(),
    usersCollectionName: env.get('USERS_COLLECTION_NAME').required().asString(),
    isReplaceAll: env.get('IS_REPLACE_ALL').default('true').asBool(),
    queries: {
      personalNumberKeyName: env.get('PERSONAL_NUMBER_KEY_NAME').required().asString(),
      identityCardKeyName: env.get('IDENTITY_CARD_KEY_NAME').required().asString(),
      usernameKeyName: env.get('USERNAME_KEY_NAME').required().asString(),
    },
  },
  rabbit: {
    uri: env.get('RABBIT_URI').required().asUrlString(),
    retryOptions: {
      minTimeout: env.get('RABBIT_RETRY_MIN_TIMEOUT').default(1000).asIntPositive(),
      retries: env.get('RABBIT_RETRY_RETRIES').default(5).asIntPositive(),
      factor: env.get('RABBIT_RETRY_FACTOR').default(1.8).asFloatPositive(),
    },
    usersQueueName: env.get('USERS_QUEUE_NAME').default('users-queue').asString(),
    usersQueuePrefetch: env.get('USERS_QUEUE_PREFETCH').default(5).asIntPositive(),
  },
  source: {
    getAllUrl: env.get('SOURCE_GET_ALL_URL').required().asUrlString(),
    timeout: env.get('SOURCE_TIMEOUT').default(10000).asIntPositive(),
  },
  metaData: {
    systemName: env.get('SYSTEM_NAME').required().asString(),
    serviceName: env.get('SERVICE_NAME').required().asString(),
    description: env.get('DESCRIPTION').required().asString(),
  },
};

export default config;
