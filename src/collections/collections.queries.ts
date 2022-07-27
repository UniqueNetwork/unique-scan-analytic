import { print } from 'graphql';
import { gql } from 'apollo-server-express';

export const getCollectionsStats = print(
  gql`
    query getCollectionsStats($fromDate: DateTime, $toDate: DateTime) {
      collectionsStatistics(fromDate: $fromDate, toDate: $toDate) {
        data {
          date
          count
        }
      }
    }
  `,
);
