import { print } from 'graphql';
import { gql } from 'apollo-server-express';

export const getAccountsStats = print(
  gql`
    query getAccountsStats($fromDate: DateTime, $toDate: DateTime) {
      accountsStatistics(fromDate: $fromDate, toDate: $toDate) {
        data {
          date
          count
        }
      }
    }
  `,
);
