import React, {useContext, useEffect, useRef, useState} from "react";
import {SERVER_HOST} from "../constants.ts";
import {paddingX} from "../styles.ts";
import {format, isSameDay, isSameMinute, isThisWeek, isThisYear, isToday, isYesterday} from "date-fns";
import {BsArrowUpCircleFill, BsChevronDown} from "react-icons/bs";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {toast} from "react-toastify";
import useSize from "../hooks/useSize.ts";
import {UserContext} from "../utils/contexts.ts";
import useWindowSize from "../hooks/useWindowSize.ts";
import useScroll from "../hooks/useScroll.ts";
import {useNavigate} from "react-router-dom";
import useNavSize from "../hooks/useNavSize.ts";
import {motion} from "framer-motion";
import {pressable} from "../utils/motion.ts";

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

enum Alignment {
  LEFT,
  RIGHT,
}

enum MessageBubbleType {
  TOP,
  CENTER,
  BOTTOM,
  SINGLE,
}

interface MessageBubbleProps {
  message: Message,
  alignment: Alignment,
  type: MessageBubbleType,
}

const bubbleBackgroundColor = {
  [Alignment.LEFT]: "bg-gray-300",
  [Alignment.RIGHT]: "bg-primary",
};

const bubbleTextColor = {
  [Alignment.LEFT]: "text-black",
  [Alignment.RIGHT]: "text-white",
};

function MessageBubble({message, alignment, type}: MessageBubbleProps) {
  const borderRadius = {
    [MessageBubbleType.TOP]: {
      [Alignment.LEFT]: "rounded-bl-sm",
      [Alignment.RIGHT]: "rounded-br-sm",
    },
    [MessageBubbleType.CENTER]: {
      [Alignment.LEFT]: "rounded-l-sm",
      [Alignment.RIGHT]: "rounded-r-sm",
    },
    [MessageBubbleType.BOTTOM]: {
      [Alignment.LEFT]: "rounded-tl-sm",
      [Alignment.RIGHT]: "rounded-tr-sm",
    },
    [MessageBubbleType.SINGLE]: {
      [Alignment.LEFT]: "",
      [Alignment.RIGHT]: "",
    }
  };

  const backgroundColor = bubbleBackgroundColor[alignment];
  const textColor = bubbleTextColor[alignment];
  const timestampColor = alignment === Alignment.LEFT ? "text-gray-500" : "text-gray-100";

  return (
    <div
      className={`inline-flex flex-col px-6 py-3 my-0.5 rounded-3xl 
      ${backgroundColor} ${borderRadius[type][alignment]}`}
    >
      {[MessageBubbleType.TOP, MessageBubbleType.SINGLE].includes(type) && alignment === Alignment.LEFT &&
        <p className={"font-semibold text-primary text-sm"}>
          {message.senderName}
        </p>
      }
      <p className={`${textColor} text-lg break-words`}>{message.text}</p>
      {[MessageBubbleType.BOTTOM, MessageBubbleType.SINGLE].includes(type) &&
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
    <div className={`min-w-36 max-w-xl my-1
    ${alignment === Alignment.LEFT ? "self-start text-left" : "self-end text-right"}`}
    >
      {messages.map((message, index) => {
        let type: MessageBubbleType;
        if (messages.length === 1) {
          type = MessageBubbleType.SINGLE;
        } else if (index === 0) {
          type = MessageBubbleType.TOP;
        } else if (index === messages.length - 1) {
          type = MessageBubbleType.BOTTOM;
        } else {
          type = MessageBubbleType.CENTER;
        }

        return <MessageBubble key={index} message={message} alignment={alignment} type={type} />;
      })}
    </div>
  );
}

interface MessageListProps {
  messages: Message[],
}

function MessageList({messages}: MessageListProps) {
  const [user] = useContext(UserContext);

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
    return <p className={"flex h-full text-4xl justify-center items-center"}>Start Conversation</p>;
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
      {messages && messageGroupByDate.map((groupByDate, index) => {
        return (
          <div key={index} className={"flex flex-col my-5"}>
            <div className={"self-center"}>{formatDateFromNow(groupByDate[0][0].timestamp)}</div>
            <div className={"flex flex-col my-2"}>
              {groupByDate.map((group, index) => {
                const alignment = group[0].senderName === user.name ? Alignment.RIGHT : Alignment.LEFT;
                return <MessageGroup key={index} messages={group} alignment={alignment} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}


export default function ChatRoom() {
  const navHeight = useNavSize().height;
  const windowHeight = useWindowSize().height;

  const [user] = useContext(UserContext);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { sendMessage, lastMessage, readyState } = useWebSocket(SERVER_HOST.replace("http", "ws") + "/api/ws");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOverflow, setIsOverflow] = useState(false);
  const inputHeight = useSize(inputRef).height;
  const scroll = useScroll(listRef);

  const navigate = useNavigate();

  if (!user) {
    navigate("/signin");
  }

  function scrollToBottom() {
    if (!scrollRef.current) {
      return;
    }
    scrollRef.current.scrollIntoView({behavior: "smooth"});
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(SERVER_HOST + "/api/chat");
        if (!response.ok) {
          toast.error("Could not load messages. Please try again later.");
          console.log(response.status, response.statusText);
          return;
        }

        const json = await response.json();

        setMessages(json.map(parseMessage));
      } catch (e) {
        toast.error("Could not load messages. Please try again later.");
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

  useEffect(() => {
    scrollToBottom();
    setIsOverflow(listRef.current.scrollHeight > listRef.current.clientHeight);
  }, [messages]);

  function onSend() {
    if (!input.trim()) {
      return;
    }

    sendMessage(JSON.stringify({
      senderName: user.name,
      text: input,
    }));
    setInput("");
  }

  return (
    <div className={"flex flex-col"}>
      <div
        ref={listRef}
        className={`overflow-scroll ${paddingX}`}
        style={{height: windowHeight - navHeight - inputHeight}}>
        <MessageList messages={messages}/>
        <div ref={scrollRef}></div>
      </div>
      {isOverflow && scroll < 1 && <div
        className={"absolute mb-5 z-50 flex justify-center w-full"}
        style={{bottom: `${inputHeight}px`}}>
        <motion.button
          className={"text-xl bg-gray-400 text-white rounded-full p-3"}
          {...pressable()}
          onClick={scrollToBottom}
        >
          <BsChevronDown />
        </motion.button>
      </div>}
      <div
        ref={inputRef}
        className={`absolute bottom-0 flex flex-row w-full border-t border-gray-400 bg-white py-3 z-50 ${paddingX}`}
      >
        <motion.input
          className={`${bubbleTextColor[Alignment.LEFT]} ${bubbleBackgroundColor[Alignment.LEFT]} focus:outline-none 
          text-lg w-full px-6 py-2 rounded-3xl placeholder:italic placeholder-gray-600`}
          {...pressable(0.01)}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"Message"}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              onSend();
            }
          }}
        />
        {input.trim() && <motion.button
          className={"ml-4 text-4xl text-primary disabled:opacity-50"}
          {...pressable()}
          disabled={readyState !== ReadyState.OPEN}
          onClick={onSend}
        >
          <BsArrowUpCircleFill/>
        </motion.button>}
      </div>
    </div>
  );
}
