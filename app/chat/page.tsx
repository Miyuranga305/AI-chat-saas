import ChatBox from "@/components/ChatBox";

export default function ChatPage() {
  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">AI Chat</h1>
          <p className="text-sm text-gray-600">Protected page (requires login).</p>
        </div>
      </div>
      <ChatBox />
    </div>
  );
}
