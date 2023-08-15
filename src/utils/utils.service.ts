import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  public formatDateToTimestamp(date?: Date) {
    date = date ? new Date(date) : new Date(Math.floor(Date.now() / 1000));
    return date.getTime();
  }

  public formatTimestampToDate(timestamp?: number | string) {
    if (!timestamp) {
      return undefined;
    }
    return new Date(parseInt(timestamp as string, 10));
  }
}
