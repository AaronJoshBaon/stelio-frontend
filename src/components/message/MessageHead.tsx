import type ChatHead from "../../pages/messages/MessagesTypes";
import { chatDateFormatted } from "../../api/DateFormat";

export default function MessageHead({ head }: { head: ChatHead }) {
  return (
    <div className="flex items-center gap-2.5 p-1 cursor-pointer">
      <div className="relative flex-shrink-0 hover-scale transition-transform duration-200">
        <img
          src={
            head.profileLink
              ? `${head.profileLink}`
              : "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
          }
          alt="Profile"
          className="w-[38px] h-[38px] rounded-full object-cover"
        />
        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow border border-dark-800" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] text-primary font-medium mb-0.5">
          {head.chatName}
        </div>
        <div className="text-[11px] text-muted-faint truncate">
          {head.messagePreview}
        </div>
      </div>
      <div className="text-[10px] text-muted-ghost ml-auto flex-shrink-0">
        {chatDateFormatted(head.date)}
      </div>
    </div>
  );
}
