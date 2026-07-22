import { useState } from "react";
import type { Message } from "../../pages/messages/MessagesTypes";

const MessageComponent = ({
  message,
  userId,
}: {
  message: Message;
  userId: string;
}) => {
  const [showTime, setShowTime] = useState<Boolean>(false);

  const messageLines = message.message.split("\n");

  const timeText = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isOwn = message.userId === userId;

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} gap-2`}>
      {/* Message Bubble */}
      <div
        className={`${
          isOwn
            ? "bg-gold/20 border border-gold/25 text-primary rounded-xl p-[14px] max-w-[80%] md:max-w-[420px] text-[13px] leading-[1.5]"
            : "bg-dark-700 border border-white/[0.07] text-white rounded-xl p-[14px] max-w-[80%] md:max-w-[420px] text-[13px] leading-[1.5]"
        }`}
        onClick={() => setShowTime((prev) => !prev)}
      >
        {/* Sender's Name (Only for incoming messages) */}
        {!isOwn && (
          <h5 className="font-medium text-primary text-[13px] mb-1">
            {message.name}
          </h5>
        )}

        {/* Message Content */}
        {messageLines.map((line, index) => (
          <p key={index} className="mb-1">
            {line}
          </p>
        ))}

        {/* Time Display (Appears on hover) */}
        <h6
          className={`text-[10px] text-muted-faint transition-all duration-200 ${showTime ? "opacity-100 max-h-8" : "opacity-0 max-h-0 overflow-hidden"}`}
        >
          {timeText}
        </h6>
      </div>
    </div>
  );
};

export default MessageComponent;
