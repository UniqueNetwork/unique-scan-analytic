import { Column, Entity, Index } from 'typeorm';

@Index('tokens_pkey', ['chain', 'timestamp'], { unique: true })
@Entity('tokens_stats', { schema: 'public' })
export class TokensStats {
  @Column('text', { primary: true, name: 'chain' })
  chain: string;

  @Column('int8', { name: 'count' })
  count: number;

  @Column('int8', { primary: true, name: 'timestamp' })
  timestamp: number;
}
