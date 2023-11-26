import { Injectable } from '@nestjs/common';
import axios from 'axios';
import envConfig from 'src/config/env.config';
import { removeNullFields } from 'src/shared/utils';

@Injectable()
export class DataAccess {
  async getData() {
    try {
      const data = await axios.get(envConfig.source.getAllUrl);

      return data.data.map(removeNullFields) as any[];
    } catch (error: any) {
      console.log(error.data);
      return null;
    }
  }
}
