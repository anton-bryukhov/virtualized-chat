import * as React from "react";
import { memo } from "react";
import styled from "styled-components";

import { formatTimestamp, Message } from "./utils";

const Container = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-template-rows: min-content 1fr;
  grid-template-columns: 48px min-content 1fr;
  padding: 16px;
  transition: background-color 100ms linear;

  &:hover {
    background-color: var(--background-color-lighter);
  }
`;

const UserPicUrl = styled.img`
  border-radius: 6px;
  height: 48px;
  width: 48px;
  grid-row: 1 / 3;
`;

const Username = styled.h4`
  margin: 0;
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
  color: var(--secondary-font-color);
`;

const Text = styled.p`
  margin: 0;
  grid-column: 2 / 4;
  font-size: 16px;
  line-height: 22px;
`;

const Time = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 22px;
`;

export default memo(function ChatMessage({ message }: { message: Message }) {
  return (
    <Container>
      <UserPicUrl src={message.userPicUrl} />
      <Username>{message.username}</Username>
      <Time>{formatTimestamp(message.timestamp)}</Time>
      <Text>{message.text}</Text>
    </Container>
  );
});
