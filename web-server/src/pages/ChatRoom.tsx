import React, { useState, useEffect, useRef } from "react";
import env from "react-dotenv";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import {SERVER_HOST} from "../constants.ts";
import {paddingX} from "../styles.ts";
import { format, isSameDay, isSameMinute, isYesterday, isThisWeek, isThisYear } from "date-fns";

// const socket = new WebSocket("ws" + SERVER_HOST + "/ws");


export interface Message {
  senderName: string,
  message: string,
  timestamp: Date,
}

enum Alignment {
  LEFT,
  RIGHT,
}

enum Position {
  TOP,
  CENTER,
  BOTTOM,
  SINGLE,
}

interface MessageBubbleProps {
  message: Message,
  alignment: Alignment,
  position: Position,
}

function MessageBubble({message, alignment, position}: MessageBubbleProps) {
  const borderRadius = {
    [Position.TOP]: {
      [Alignment.LEFT]: "rounded-bl-sm",
      [Alignment.RIGHT]: "rounded-br-sm",
    },
    [Position.CENTER]: {
      [Alignment.LEFT]: "rounded-l-sm",
      [Alignment.RIGHT]: "rounded-r-sm",
    },
    [Position.BOTTOM]: {
      [Alignment.LEFT]: "rounded-tl-sm",
      [Alignment.RIGHT]: "rounded-tr-sm",
    },
    [Position.SINGLE]: {
      [Alignment.LEFT]: "",
      [Alignment.RIGHT]: "",
    }
  };

  const backgroundColor = alignment === Alignment.LEFT ? "bg-gray-300" : "bg-primary";
  const textColor = alignment === Alignment.LEFT ? "text-black" : "text-white";
  const timestampColor = alignment === Alignment.LEFT ? "text-gray-500" : "text-gray-100";

  return (
    <div
      className={`flex flex-col px-6 py-3 my-1 rounded-3xl ${backgroundColor} ${borderRadius[position][alignment]}`}
    >
      {[Position.TOP, Position.SINGLE].includes(position) && alignment === Alignment.LEFT &&
        <p className={"font-semibold text-primary text-sm"}>
          {message.senderName}
        </p>
      }
      <p className={`${textColor} text-lg`}>{message.message}</p>
      {[Position.BOTTOM, Position.SINGLE].includes(position) &&
        <p
          className={`${timestampColor} self-end text-xs`}>
          {format(message.timestamp, "h:mm a")}
        </p>
      }
    </div>
  );
}

interface MessageGroupProps {
  messages: Message[],
  alignment: Alignment,
}

function MessageGroup({messages, alignment}: MessageGroupProps) {
  return (
    <div className={`min-w-36 max-w-xl ${alignment === Alignment.LEFT ? "self-start" : "self-end"}`}>
      {messages.map((message, index) => {
        let position: Position;
        if (messages.length === 1) {
          position = Position.SINGLE;
        } else if (index === 0) {
          position = Position.TOP;
        } else if (index === messages.length - 1) {
          position = Position.BOTTOM;
        } else {
          position = Position.CENTER;
        }

        return <MessageBubble message={message} alignment={alignment} position={position} />;
      })}
    </div>
  );
}

interface MessageListProps {
  messages: Message[],
}

function MessageList({messages}: MessageListProps) {
  const now = new Date();

  // eslint-disable-next-line no-unused-vars
  function splitMessages(messages: Message[], predicate: (left: Message, right: Message) => boolean): Message[][] {
    const groups: Message[][] = [];
    let currentGroup: Message[] = [messages[0]];

    for (let i = 1; i < messages.length; i++) {
      if (predicate(messages[i - 1], messages[i])) {
        groups.push(currentGroup);
        currentGroup = [messages[i]];
      } else {
        currentGroup.push(messages[i]);
      }
    }

    groups.push(currentGroup);
    return groups;
  }

  function formatDateFromNow(date: Date) {
    if (isSameDay(date, now)) {
      return "Today";
    }
    if (isYesterday(date)) {
      return "Yesterday";
    }
    if (isThisWeek(date)) {
      return format(date, "E, MMM d");
    }
    if (isThisYear(date)) {
      return format(date, "MMM d");
    }
    return format(date, "MMM d, yyyy");
  }

  const messageGroupByDate = splitMessages(messages, (left, right) => !isSameDay(left.timestamp, right.timestamp))
    .map(group =>
      splitMessages(group, (left, right) => left.senderName !== right.senderName)
        .flatMap(group => splitMessages(group, (left, right) =>
          !isSameMinute(left.timestamp, right.timestamp))
        )
    );

  return (
    <div className={"flex flex-col"}>
      {messages && messageGroupByDate.map((groupByDate) => {
        return (
          <div className={"flex flex-col my-5"}>
            <div className={"self-center"}>{formatDateFromNow(groupByDate[0][0].timestamp)}</div>
            <div className={"flex flex-col my-2"}>
              {groupByDate.map((group) => {
                const alignment = group[0].senderName === "SeoulSKY" ? Alignment.RIGHT : Alignment.LEFT;
                return <MessageGroup messages={group} alignment={alignment} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages([
      {
        senderName: "SeoulSKY",
        message: "Hello, world!",
        timestamp: new Date("2021-09-01T00:00:00Z"),
      },
      {
        senderName: "Test",
        message: "How are you?",
        timestamp: new Date("2024-03-02T00:00:00Z"),
      },
      {
        senderName: "Test",
        message: "How are you?",
        timestamp: new Date("2024-03-02T00:00:01Z"),
      },
      {
        senderName: "Test",
        message: "How are you?",
        timestamp: new Date("2024-03-02T00:00:01Z"),
      },
      {
        senderName: "Test",
        message: "How are you?",
        timestamp: new Date("2024-03-02T00:00:01Z"),
      },
      {
        senderName: "Test",
        message: "How are you?",
        timestamp: new Date("2024-03-02T00:00:01Z"),
      },
      {
        senderName: "Test",
        message: "How are you?",
        timestamp: new Date("2024-03-02T00:00:01Z"),
      },
      {
        senderName: "Test",
        message: "How are you?",
        timestamp: new Date("2024-03-02T00:00:01Z"),
      },
      {
        senderName: "Test",
        message: "How are you?",
        timestamp: new Date("2024-03-02T00:00:01Z"),
      },
      {
        senderName: "SeoulSKY",
        message: "I'm fine, thank you uuuuuuuuuuuuuuuuuu !",
        timestamp: new Date("2024-03-02T00:00:00Z"),
      },
    ]);
  }, []);

  const [error, setError] = useState("");

  if (messages.length === 0) return <></>;

  return (
    <div className={paddingX}>
      <MessageList messages={messages} />
    </div>
  );

  // // automatically scroll to the bottom of the chats
  // const chatRef = useRef<null | HTMLDivElement>(null);
  // useEffect(() => {
  //   if (chatRef.current) {
  //     chatRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  //   }
  // }, [chats]);

  // GET existing chats
  // useEffect(() => {
  //   fetch(env.GO_SERVER_HOST + "/chat")
  //     .then(response => response.json())
  //     .then(chats => {
  //       setTimestamps(chats);
  //       setChats(chats);
  //     })
  //     .catch(err => {
  //       setError("An error has been occurred");
  //       console.log(err);
  //     });
  // }, []);

  // listen messages from go server
  // socket.onmessage = e => {
  //   const clonedArray = [...chats];
  //
  //   const chat: Message = JSON.parse(e.data);
  //   setTimestamps([chat]);
  //
  //   clonedArray.push(chat);
  //   setChats(clonedArray);
  // };
  //
  // // handle other socket events
  // socket.onopen = () => setError("");
  // socket.onclose = e => {
  //   setError("Connection to go server has been closed");
  //   console.log(e.reason);
  // };

  const [input, setInput] = useState("");

  // /**
  //    * Send a message to go server
  //    * @param e event
  //    */
  // function onSubmit(e: React.FormEvent) {
  //   e.preventDefault();
  //
  //   const json = {
  //     senderName: name,
  //     message: input
  //   };
  //
  //   socket.send(JSON.stringify(json));
  //
  //   setInput("");
  // }
}
