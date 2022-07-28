import { Column, Entity, Index } from 'typeorm';

@Index('accounts_pkey', ['chain', 'timestamp'], { unique: true })
@Entity('accounts_stats', { schema: 'public' })
export class AccountsStats {
  @Column('text', { primary: true, name: 'chain' })
  chain: string;

  @Column('int8', { name: 'count' })
  count: number;

  @Column('int8', { primary: true, name: 'timestamp' })
  timestamp: number;
}
