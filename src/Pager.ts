import { isSome } from "./utils";

export default class Pager<K, V extends Readonly<{ id: K }>> {
  private items: Map<K, V> = new Map();
  private allIds: K[] = [];
  private cursor: number = 0;
  private nextCursor?: K;

  constructor(
    private readonly getNextPage: ({
      cursor,
    }: Readonly<{
      cursor?: K;
    }>) => Promise<Readonly<{ items: ReadonlyArray<V>; nextCursor: K }>>,
    private readonly windowSize: number = 1000,
    private readonly pageSize: number = 100
  ) {}

  async next(): Promise<V[]> {
    if (
      this.allIds.length < this.windowSize ||
      this.allIds.length - (this.cursor + this.pageSize) < this.windowSize
    ) {
      const { items, nextCursor } = await this.getNextPage({
        cursor: this.nextCursor,
      });
      this.nextCursor = nextCursor;

      items.forEach((item) => {
        this.items.set(item.id, item);
        this.allIds.push(item.id);
      });

      if (this.allIds.length > this.windowSize) {
        this.cursor += this.pageSize;
      }
    } else {
      this.cursor += this.pageSize;
    }
    return this.currentItems;
  }

  async prev(): Promise<V[]> {
    this.cursor = Math.max(0, this.cursor - this.pageSize);
    return this.currentItems;
  }

  private get currentItems(): V[] {
    return this.allIds
      .slice(this.cursor, this.cursor + this.windowSize)
      .map((id) => this.items.get(id))
      .filter(isSome);
  }
}
