'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Leaf, Plus, Trash2 } from 'lucide-react';
import { useChatWithGroqMutation } from '@/store/api/groqApi';
import type { GroqChatHistoryItem } from '@/store/api/groqApi';
import { useGetChatHistoryQuery, useSaveChatMutation, useDeleteChatHistoryMutation } from '@/store/api/api';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [chatWithGroq] = useChatWithGroqMutation();
  const { data: chatHistory, isLoading: isHistoryLoading } = useGetChatHistoryQuery();
  const [saveChat] = useSaveChatMutation();
  const [deleteChatHistory, { isLoading: isDeleting }] = useDeleteChatHistoryMutation();
  const [showConfirm, setShowConfirm] = useState(false);

  // Typing effect state
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom and focus input
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    inputRef.current?.focus();
  }, [messages, isTyping]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  // On mount, load chat history if available
  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      // Convert chatHistory to Message[]
      const historyMessages: Message[] = chatHistory.flatMap((item) => [
        {
          id: item._id + '-user',
          sender: 'user',
          text: item.userMessage,
          timestamp: new Date(item.timestamp),
        },
        {
          id: item._id + '-ai',
          sender: 'ai',
          text: item.aiResponse,
          timestamp: new Date(item.timestamp),
        },
      ]);
      setMessages(historyMessages);
    }
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMsg: Message = { 
      id: Date.now().toString(),
      sender: 'user', 
      text: input,
      timestamp: new Date()
    };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setIsTyping(true);
    
    // Build history for API
    const history: GroqChatHistoryItem[] = [
      ...messages.map((msg) => ({
        role: msg.sender === 'user' ? 'user' as const : 'system' as const,
        content: msg.text,
      })),
      { role: 'user', content: input }
    ];

    try {
      const res = await chatWithGroq({ message: input, history }).unwrap();
      const aiText = res.reply;
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: '',
        timestamp: new Date()
      };
      setMessages(msgs => [...msgs, aiMsg]);

      let charIndex = 0;
      typingIntervalRef.current = setInterval(() => {
        charIndex++;
        setMessages(msgs => {
          const updated = [...msgs];
          const lastIdx = updated.length - 1;
          if (updated[lastIdx].sender === 'ai') {
            updated[lastIdx] = {
              ...updated[lastIdx],
              text: aiText.slice(0, charIndex)
            };
          }
          return updated;
        });
        if (charIndex >= aiText.length) {
          if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
          setIsTyping(false);
        }
      }, 5);
      // Save chat after full AI response
      saveChat({ userMessage: input, aiResponse: aiText }).catch((err) => {
        // Optionally log error, but do not block UI
        console.error('Failed to save chat:', err);
      });
    } catch (err) {
      setMessages(msgs => [...msgs, {
        id: (Date.now() + 2).toString(),
        sender: 'ai',
        text: 'Sorry, there was an error getting a response. Please try again.',
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearHistory = () => setShowConfirm(true);
  const handleConfirmClear = async () => {
    try {
      await deleteChatHistory().unwrap();
      setMessages([]);
      setShowConfirm(false);
    } catch (err) {
      // Optionally show error toast
      setShowConfirm(false);
    }
  };
  const newChat = () => setMessages([]);

  return (
    <div className="flex flex-col h-[calc(100vh-70px)] bg-gradient-to-br from-indigo-50 via-purple-50 to-green-50 p-4 ">
      {/* Header */}
      <div className="flex items-center justify-end mb-4">
        {/* <div></div> */}
        {/* <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI Budtender
          </h1>
        </div> */}
        
        <div className="flex space-x-2">
          {/* <button
            onClick={newChat}
            className="flex items-center space-x-1 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">New Chat</span>
          </button> */}
          <button
            onClick={clearHistory}
            className="flex items-center space-x-1 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium cursor-pointer">Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-h-[calc(100vh-140px)] bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <Leaf className="w-12 h-12 text-indigo-200 mb-4" />
              <h2 className="text-xl font-medium text-slate-600 mb-2">Welcome to AI Budtender</h2>
              <p className="text-slate-500 max-w-md">
                Ask me about strains, products, dosages, or anything cannabis-related. I'm here to help!
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.sender === 'ai' && (
                    <div className="flex-shrink-0 mr-2 mt-1">
                      <div className="p-1.5 rounded-full bg-gradient-to-br from-green-100 to-indigo-100">
                        <Leaf className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl ${msg.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-none'
                      : 'bg-green-50 text-slate-700 rounded-bl-none border border-green-100'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex max-w-[85%]">
                <div className="flex-shrink-0 mr-2 mt-1">
                  <div className="p-1.5 rounded-full bg-gradient-to-br from-green-100 to-indigo-100">
                    <Leaf className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="px-4 py-3 rounded-2xl bg-green-50 text-slate-700 rounded-bl-none border border-green-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center space-x-2 bg-white rounded-full pl-4 pr-2 py-2 shadow-lg border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-300 focus-within:border-indigo-400 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Ask your budtender anything..."
              className="flex-1 outline-none text-slate-700 placeholder-slate-400 bg-transparent"
              disabled={isTyping}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className={`p-2 rounded-full ${input.trim()
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                : 'bg-slate-100 text-slate-400'
              } transition-all`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Clear Chat History?</h2>
            <p className="mb-6 text-gray-600">Are you sure you want to clear your entire chat history? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-6 py-2 cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition"
                disabled={isDeleting}
              >
                No
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-6 py-2 cursor-pointer rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition flex items-center justify-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                ) : null}
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}