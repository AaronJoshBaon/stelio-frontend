import { useEffect, useState } from "react";
import MessageHead from "../../components/message/MessageHead";
import type ChatHead from "./MessagesTypes";
import { getChatHeads } from "../../api/message";
import { Link, useParams } from "react-router-dom";
import ChatBox from "../../components/message/ChatBox";
import { useUserData } from "../../context/UserContext";

export default function Messages() {
  const { userData } = useUserData();
  const [chatHeads, setChatHeads] = useState<ChatHead[]>([]);
  const [active, setActive] = useState<String | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchChatHeads = async () => {
      setIsLoading(true);
      const res = await getChatHeads();
      if (res.success) {
        setChatHeads(res.chats);
      }
      setIsLoading(false);
    };
    fetchChatHeads();
  }, []);

  useEffect(() => {
    setActive(id ?? null);
  }, [id]);

  const selectedHead = chatHeads.find((h) => h.conversationId === active);
  const heightClass =
    userData.role === "OWNER" ? "h-[83dvh]" : "h-[90dvh]";

  return (
    <div className={`page-enter bg-dark-800 overflow-hidden ${heightClass}`}>
      <div className="grid h-full grid-cols-1 md:grid-cols-[300px_1fr]">
        {/* Sidebar — hidden on mobile when a chat is active */}
        <div
          className={`${
            active !== null ? "hidden md:flex" : "flex"
          } flex-col border-r border-white/[0.07] p-4 overflow-hidden`}
        >
          <input
            className="s-msg-input s-input w-full bg-dark-900 border border-white/[0.08] rounded-lg px-[14px] py-[9px] text-primary text-[12px] font-sans mb-3 flex-shrink-0"
            placeholder="Search conversations..."
          />
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {isLoading ? (
              <div className="stagger-children">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2.5 mb-1">
                    <div className="skel-block w-[38px] h-[38px] rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="skel-block h-3 rounded w-2/3" />
                      <div className="skel-block h-2.5 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : chatHeads.length === 0 ? (
              <p className="text-muted-faint text-[13px] text-center mt-6 animate-fadeInUp">
                No conversations yet
              </p>
            ) : (
              <div className="message-chat-heads-list stagger-children">
                {chatHeads.map((headInfo) => (
                  <Link
                    key={headInfo.conversationId}
                    to={`/messages/${headInfo.conversationId}`}
                    onClick={() => setActive(headInfo.conversationId)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-colors duration-200 border-l-2 hover:bg-white/[0.04] ${
                      headInfo.conversationId === active
                        ? "bg-gold/[0.08] border-gold/50"
                        : "border-transparent"
                    }`}
                  >
                    <MessageHead head={headInfo} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Main — hidden on mobile when no chat is active */}
        <div
          className={`${
            active === null ? "hidden md:flex" : "flex"
          } flex-col h-full`}
        >
          {active != null ? (
            <>
              {/* Header — derived from real chatHead data */}
              <div className="px-5 py-[14px] border-b border-white/[0.07] flex items-center gap-2.5 flex-shrink-0">
                {/* Back chevron — mobile only */}
                <Link
                  to="/messages"
                  className="md:hidden w-8 h-8 flex items-center justify-center text-muted-faint hover:text-gold transition-colors mr-1 flex-shrink-0"
                  onClick={() => setActive(null)}
                  aria-label="Back to conversations"
                >
                  ←
                </Link>
                {selectedHead?.profileLink ? (
                  <img
                    src={selectedHead.profileLink}
                    alt={selectedHead.chatName}
                    className="w-[38px] h-[38px] rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-[38px] h-[38px] rounded-full bg-dark-600 flex items-center justify-center text-[14px] font-medium text-gold cursor-default flex-shrink-0">
                    {selectedHead?.chatName
                      ? selectedHead.chatName
                          .split(" ")
                          .filter((n) => n.length > 0)
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "??"}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-[14px] font-medium text-primary truncate">
                    {selectedHead?.chatName ?? ""}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ChatBox />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-faint text-[13px]">
                Select a conversation to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
