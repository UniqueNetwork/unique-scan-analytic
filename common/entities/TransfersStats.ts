import { Column, Entity, Index } from 'typeorm';

// tokens, coins
@Index('transfers_pkey', ['chain', 'timestamp', 'type'], { unique: true })
@Entity('transfers_stats', { schema: 'public' })
export class TransfersStats {
  @Column('text', { primary: true, name: 'chain' })
  chain: string;

  @Column('int8', { name: 'count' })
  count: number;

  @Column('int8', { primary: true, name: 'timestamp' })
  timestamp: number;

  @Column('text', { primary: true, name: 'type' })
  type: string;
}
