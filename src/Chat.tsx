import * as React from "react";
import {
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import styled from "styled-components";

import { useScrollObserver } from "./ScrollObserver";
import {
  getLoadPageAction,
  getLoadPageFailureAction,
  getPageLoadedAction,
  Id,
  Message,
  reducer,
  State,
} from "./utils";
import ChatMessage from "./ChatMessage";
import MessageRepository from "./MessageRepository";
import Pager from "./Pager";

const List = styled.div`
  display: flex;
  flex-direction: column-reverse;
  background-color: var(--background-color);
`;

const LoadingPlaceholder = styled.p`
  padding: 16px 0 16px 0;
  margin: 0;
  text-align: center;
  font-size: 16px;
  line-height: 22px;
  color: var(--secondary-font-color);
`;

export default function Chat() {
  const pager: Pager<Id, Message> = useMemo(() => {
    const messageRepository = new MessageRepository();
    const getNextPage = async ({ cursor }: { cursor?: Id }) => {
      const { messages, nextCursor } = await messageRepository.getMessages(
        cursor
      );
      return { items: messages, nextCursor };
    };
    return new Pager(getNextPage);
  }, []);
  const initialState: State = useMemo(
    () => ({ messages: [], isLoading: true }),
    []
  );
  const [state, dispatch] = useReducer(reducer, initialState);
  const list: RefObject<HTMLDivElement> = useRef(null);
  const loadingRef: MutableRefObject<boolean> = useRef(false);

  const onError = useCallback(() => {
    dispatch(getLoadPageFailureAction());
    console.error("Error occurred!");
  }, []);
  const onStartReached = useCallback(async () => {
    if (loadingRef.current) return;
    const messages = await pager.prev();
    dispatch(getPageLoadedAction(messages));
  }, []);
  const onEndReached = useCallback(async () => {
    if (loadingRef.current) return;
    dispatch(getLoadPageAction());
    try {
      const messages = await pager.next();
      dispatch(getPageLoadedAction(messages));
    } catch (e) {
      onError();
    }
  }, [onError]);

  useEffect(() => {
    loadingRef.current = state.isLoading;
  }, [state]);

  useEffect(() => {
    pager
      .next()
      .then((messages) => {
        dispatch(getPageLoadedAction(messages));
        list?.current?.firstElementChild?.scrollIntoView();
      })
      .catch(onError);
  }, [onError]);

  useScrollObserver({
    listRef: list,
    onStartReached,
    onEndReached,
  });

  return (
    <div>
      {state.isLoading && <LoadingPlaceholder>Loading...</LoadingPlaceholder>}
      <List ref={list}>
        {state.messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </List>
    </div>
  );
}
