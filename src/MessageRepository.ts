import { Id, Message } from "./utils";

export default class MessageRepository {
  private baseUrl: string = process.env.API_BASE_URL as string;

  async getMessages(
    cursor?: Id
  ): Promise<Readonly<{ messages: ReadonlyArray<Message>; nextCursor: Id }>> {
    const url = `${this.baseUrl}/api/messages${this.asQueryString({ cursor })}`;
    const response = await fetch(url);
    if (response.status !== 200) {
      throw Error("Unsuccessful status code");
    }
    const {
      messages,
      nextCursor,
    }: {
      messages: ReadonlyArray<Message>;
      nextCursor: Id;
    } = await response.json();
    return {
      nextCursor,
      messages: messages.map(({ timestamp, ...rest }) => ({
        ...rest,
        timestamp: new Date(timestamp),
      })),
    };
  }

  private asQueryString(obj: Record<string, any>): string {
    const queryString = Object.entries(obj)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    return queryString.length > 0 ? `?${queryString}` : "";
  }
}
