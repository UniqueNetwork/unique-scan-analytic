import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  public formatDateToTimestamp(date?: Date) {
    date = date ? new Date(date) : new Date();
    return Math.floor(date.getTime() / 1000);
  }

  public formatTimestampToDate(timestamp?: number) {
    if (!timestamp) {
      return undefined;
    }
    return new Date(timestamp * 1000);
  }
}
