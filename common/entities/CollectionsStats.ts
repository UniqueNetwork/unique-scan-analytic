import { Column, Entity, Index } from 'typeorm';

@Index('collections_pkey', ['chain', 'timestamp'], { unique: true })
@Entity('collections_stats', { schema: 'public' })
export class CollectionsStats {
  @Column('text', { primary: true, name: 'chain' })
  chain: string;

  @Column('int8', { name: 'count' })
  count: number;

  @Column('int8', { primary: true, name: 'timestamp' })
  timestamp: number;
}
