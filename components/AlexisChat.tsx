'use client';

import { useCallback, useEffect,  useRef, useState } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { BsRocketTakeoffFill } from 'react-icons/bs';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

export default function AlexisChat({ onClose }: { onClose: () => void }) {
  const ASK_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/ask`;

  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hi! I'm Alexis. How can I help you with your course today?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const append = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const replaceThinking = useCallback((text: string) => {
    setMessages((prev) => prev.slice(0, -1).concat({ sender: 'bot', text }));
  }, []);

  const safeJson = async (res: Response) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const doAsk = useCallback(
    async (question: string) => {
      // Cancel any in-flight request
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      const fetchOnce = async () => {
        const res = await fetch(ASK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question }),
          signal: ctrl.signal,
        });
        const data = await safeJson(res);
        if (!res.ok) {
          const msg = data?.error || `${res.status} ${res.statusText}`;
          throw new Error(msg);
        }
        const answer = data?.answer ?? '';
        if (!answer) throw new Error('Empty answer from server');
        return answer as string;
      };

      // Basic retry for transient edge errors
      try {
        return await fetchOnce();
      } catch (e: unknown) {
        if (/(502|503|network|fetch)/i.test(String((e as Error)?.message))) {
          // small backoff
          await new Promise((r) => setTimeout(r, 350));
          return await fetchOnce();
        }
        throw e;
      }
    },
    [ASK_URL]
  );

  const handleSend = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;

    setLoading(true);
    append({ sender: 'user', text: q });
    append({ sender: 'bot', text: 'Thinking…' });
    setInput('');

    try {
      const answer = await doAsk(q);
      replaceThinking(answer);
    } catch (err: unknown) {
      console.error(err);
      replaceThinking('Sorry, something went wrong. Please try again later.');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [append, doAsk, input, loading, replaceThinking]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div
      className="fixed bottom-24 right-8 w-[300px] sm:w-[350px] h-[500px] rounded-xl shadow-lg z-50 flex flex-col animate-fade-in"
      style={{ backgroundColor: '#111827', color: '#FFFFFF' }}
      aria-busy={loading}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center px-4 py-2 rounded-t-xl"
        style={{ backgroundColor: '#f97316', color: '#000000' }}
      >
        <h2 className="font-bold">Alexis AI</h2>
        <button className="cursor-pointer" onClick={onClose} aria-label="Close chat">
          <IoCloseCircleOutline className="text-2xl" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto text-sm space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className="p-2 rounded-lg max-w-[90%] break-words whitespace-pre-wrap"
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              marginLeft: msg.sender === 'user' ? 'auto' : undefined,
              backgroundColor:
                msg.sender === 'user'
                  ? 'rgba(251, 146, 60, 0.4)'
                  : 'rgba(60, 124, 251, 0.2)',
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="p-3 border-t rounded-b-xl"
        style={{
          backgroundColor: '#0f172a',
          borderTopColor: '#1A1A1A',
          borderTopWidth: '1px',
        }}
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type your message… (Enter to send, Shift+Enter for newline)"
            rows={2}
            className="flex-1 px-4 py-2 rounded-md focus:outline-none placeholder-[#9ca3af] resize-none"
            style={{ backgroundColor: '#1f2937', color: '#ffffff', border: 'none' }}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            className="cursor-pointer p-2 rounded-full bg-[#f97316] hover:opacity-90 transition disabled:opacity-50"
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
            <BsRocketTakeoffFill className="text-white w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
