import React, {useContext, useEffect, useRef, useState} from "react";
import {SERVER_HOST} from "../constants.ts";
import {paddingX} from "../styles.ts";
import {format, isSameDay, isSameMinute, isThisWeek, isThisYear, isToday, isYesterday} from "date-fns";
import {BsArrowUpCircleFill} from "react-icons/bs";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {toast} from "react-toastify";
import useSize from "../hooks/useSize.ts";
import {NavContext} from "../utils/contexts.ts";
import useWindowSize from "../hooks/useWindowSize.ts";

export interface Message {
  senderName: string,
  text: string,
  timestamp: Date,
}

function parseMessage(json: object): Message {
  return {
    senderName: json["senderName"],
    text: json["text"],
    timestamp: new Date(json["timestamp"]),
  };
}

function scrollToBottom() {
  window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
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

const bubbleBackgroundColor = {
  [Alignment.LEFT]: "bg-gray-300",
  [Alignment.RIGHT]: "bg-primary",
};

const bubbleTextColor = {
  [Alignment.LEFT]: "text-black",
  [Alignment.RIGHT]: "text-white",
};

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

  const backgroundColor = bubbleBackgroundColor[alignment];
  const textColor = bubbleTextColor[alignment];
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
      <p className={`${textColor} text-lg break-words`}>{message.text}</p>
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
    if (isToday(date)) {
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

  if (messages.length === 0) {
    return <p className={"text-4xl"}>Start conversation</p>
  }

  const messageGroupByDate = splitMessages(messages, (left, right) => !isSameDay(left.timestamp, right.timestamp))
    .map(group =>
      splitMessages(group, (left, right) => left.senderName !== right.senderName)
        .flatMap(group => splitMessages(group, (left, right) =>
          !isSameMinute(left.timestamp, right.timestamp))
        )
    );

  return (
    <div>
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
  const windowHeight = useWindowSize().height;

  const navRef = useContext(NavContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const { sendMessage, lastMessage, readyState } = useWebSocket(SERVER_HOST.replace("http", "ws") + "/api/ws");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const navHeight = useSize(navRef).height;
  const inputHeight = useSize(inputRef).height;

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(SERVER_HOST + "/api/chat");
        if (!response.ok) {
          toast.error("Could not load messages. Please try again later.")
          console.log(response.status, response.statusText);
          return;
        }

        const json = await response.json();

        setMessages(json.map(parseMessage));
      } catch (e) {
        toast.error("Could not load messages. Please try again later.")
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!lastMessage) {
      return;
    }

    setMessages((values: Message[]) => [
      ...values,
      parseMessage(JSON.parse(lastMessage.data)),
    ]);
  },[lastMessage]);

  useEffect(() => {
    if (readyState === ReadyState.CLOSED && lastMessage) {
      toast.error("Disconnected from the server. Try refreshing the page.");
    }
  }, [readyState]);

  useEffect(scrollToBottom, [messages]);

  return (
    <div className={"flex flex-col"}>
      <div
        className={`flex overflow-scroll justify-center items-center ${paddingX}`}
        style={{height: windowHeight - navHeight - inputHeight}}>
          <MessageList messages={messages} />
      </div>
      <div
        ref={inputRef}
        className={`absolute bottom-0 flex flex-row w-full border-t border-gray-400 bg-white py-3 z-50 ${paddingX}`}
      >
        <input
          className={`${bubbleTextColor[Alignment.LEFT]} ${bubbleBackgroundColor[Alignment.LEFT]} focus:outline-none 
          text-lg w-full px-6 py-2 rounded-3xl placeholder:italic placeholder-gray-600`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"Message"}
        />
        {input.trim() && <button
          className={"ml-4 text-4xl text-primary disabled:opacity-50"}
          disabled={readyState !== ReadyState.OPEN}
          onClick={() => {
            sendMessage(JSON.stringify({
              senderName: "SeoulSKY",
              text: input,
              timestamp: new Date().toISOString(),
            }));
            setInput("");
          }}
        >
          <BsArrowUpCircleFill/>
        </button>}
      </div>
    </div>
  );
}
