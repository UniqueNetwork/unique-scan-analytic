import { print } from 'graphql';
import { gql } from 'apollo-server-express';

export const getTokensStat = print(
  gql`
    query getTokensStat($fromDate: DateTime, $toDate: DateTime) {
      tokenStatistics(fromDate: $fromDate, toDate: $toDate) {
        data {
          date
          count
        }
      }
    }
  `,
);
