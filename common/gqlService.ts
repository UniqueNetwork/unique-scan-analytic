import axios, { AxiosResponse } from 'axios';

interface IGQLErrors {
  errors: {
    message: string;
  }[];
}

interface IParams {
  fromDate?: Date;
  toDate?: Date;
  type?: string;
}

export class GqlService {
  private static readonly axios = axios.create({ timeout: 30 * 1000 });

  static async makeRequest<T>(
    gqlUrl: string,
    query: string,
    variables?: IParams,
  ): Promise<AxiosResponse<T>> {
    try {
      const response = await this.axios.post<T>(gqlUrl, {
        query,
        variables,
      });

      if ((response.data as unknown as IGQLErrors).errors) {
        throw new Error(
          (response.data as unknown as IGQLErrors).errors[0].message,
        );
      }

      return response;
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
