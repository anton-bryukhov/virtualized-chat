type Option<T> = T | null | undefined;
type Some<T> = NonNullable<T>;

export function isSome<T>(option: Option<T>): option is Some<T> {
  return option !== null && option !== undefined;
}

export type Id = string;
export type Message = Readonly<{
  id: Id;
  username: string;
  text: string;
  timestamp: Date;
  userPicUrl: string;
}>;

export type State = Readonly<{
  isLoading: boolean;
  messages: ReadonlyArray<Message>;
}>;

export const LOAD_PAGE_ACTION_TYPE = "LOAD_PAGE";
export const PAGE_LOADED_ACTION_TYPE = "PAGE_LOADED";
export const LOAD_PAGE_FAILURE_ACTION_TYPE = "LOAD_PAGE_FAILURE";

export type LoadPageAction = Readonly<{ type: typeof LOAD_PAGE_ACTION_TYPE }>;
export type PageLoadedAction = Readonly<{
  type: typeof PAGE_LOADED_ACTION_TYPE;
  payload: Readonly<{ messages: ReadonlyArray<Message> }>;
}>;
export type LoadPageFailureAction = Readonly<{
  type: typeof LOAD_PAGE_FAILURE_ACTION_TYPE;
}>;

export type Action = LoadPageAction | PageLoadedAction | LoadPageFailureAction;

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case LOAD_PAGE_ACTION_TYPE:
      return { messages: state.messages, isLoading: true };
    case PAGE_LOADED_ACTION_TYPE:
      return {
        messages: action.payload.messages,
        isLoading: false,
      };
    case LOAD_PAGE_FAILURE_ACTION_TYPE:
      return { messages: state.messages, isLoading: false };
    default:
      return state;
  }
}

export function getLoadPageAction(): LoadPageAction {
  return { type: LOAD_PAGE_ACTION_TYPE };
}

export function getPageLoadedAction(
  messages: ReadonlyArray<Message>
): PageLoadedAction {
  return { type: PAGE_LOADED_ACTION_TYPE, payload: { messages } };
}

export function getLoadPageFailureAction(): LoadPageFailureAction {
  return { type: LOAD_PAGE_FAILURE_ACTION_TYPE };
}

export function formatTimestamp(timestamp: Date): string {
  const hours = timestamp.getHours().toString().padStart(2, "0");
  const minutes = timestamp.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
