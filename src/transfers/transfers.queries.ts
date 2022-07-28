import { print } from 'graphql';
import { gql } from 'apollo-server-express';

export const getExtrinsicsStat = print(
  gql`
    query getExtrinsicsStat(
      $fromDate: DateTime
      $toDate: DateTime
      $type: ExtrinsicsStatsTypeEnum
    ) {
      extrinsicsStatistics(fromDate: $fromDate, toDate: $toDate, type: $type) {
        data {
          date
          count
        }
      }
    }
  `,
);
