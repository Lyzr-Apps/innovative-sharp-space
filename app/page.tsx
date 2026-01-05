'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  MessageCircle,
  X,
  Send,
  ChevronDown,
  History,
  Plus,
  Search,
  Clock,
  User,
  Bot,
  Minimize2,
  Maximize2,
} from 'lucide-react'

// Agent configuration
const AGENT_ID = '695bb11f6363be71980ee619'
const KNOWLEDGE_BASE_ID = '695bb1191fd00875a2eb68cf'

// Types
interface Message {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

// Typing Indicator Component
function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center">
      <div
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: '0ms' }}
      />
      <div
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: '150ms' }}
      />
      <div
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  )
}

// Message Bubble Component
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-blue-600" />
        </div>
      )}
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <span
          className={`text-xs mt-1 block ${isUser ? 'text-blue-100' : 'text-gray-500'}`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  )
}

// Quick Reply Chips Component
function QuickReplyChips({
  onSelect,
}: {
  onSelect: (question: string) => void
}) {
  const suggestedQuestions = [
    "What are your pricing plans?",
    "How do I reset my password?",
    "What's your refund policy?",
  ]

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {suggestedQuestions.map((question, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(question)}
          className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
        >
          {question}
        </button>
      ))}
    </div>
  )
}

// Chat Window Component
function ChatWindow({
  messages,
  isLoading,
  onSendMessage,
  onNewConversation,
  onViewHistory,
}: {
  messages: Message[]
  isLoading: boolean
  onSendMessage: (message: string) => void
  onNewConversation: () => void
  onViewHistory: () => void
}) {
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input)
      setInput('')
    }
  }

  const handleQuickReply = (question: string) => {
    setInput(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <h2 className="font-semibold">Customer Support</h2>
        </div>
        <button className="p-1 hover:bg-blue-500 rounded-lg transition-colors">
          <Minimize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div ref={scrollRef} className="pr-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-gray-700 font-semibold mb-2">
                Welcome to Customer Support
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                How can we help you today?
              </p>
              <QuickReplyChips onSelect={handleQuickReply} />
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                    <TypingIndicator />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      <Separator />

      {/* Quick Links */}
      {messages.length > 0 && !isLoading && (
        <div className="px-4 py-3 flex gap-2 border-t">
          <button
            onClick={onNewConversation}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-4 h-4" />
            New Conversation
          </button>
          <span className="text-gray-300">•</span>
          <button
            onClick={onViewHistory}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <History className="w-4 h-4" />
            View History
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) =>
              setInput(e.target.value.slice(0, 500))
            }
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {input.length}/500 characters
        </p>
      </div>
    </div>
  )
}

// Chat History Sidebar
function ChatHistorySidebar({
  conversations,
  onSelectConversation,
  onDeleteConversation,
  onClose,
}: {
  conversations: Conversation[]
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  onClose: () => void
}) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-72 bg-white rounded-l-lg shadow-2xl flex flex-col border-r h-[600px]">
      {/* Header */}
      <div className="px-4 py-4 border-b flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Chat History</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {filteredConversations.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-8">
              No conversations yet
            </p>
          ) : (
            <div className="space-y-2">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <h4 className="font-medium text-sm text-gray-800 truncate">
                    {conv.title}
                  </h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {conv.updatedAt.toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// Floating Chat Widget
function ChatWidget({
  isOpen,
  onToggle,
  unreadCount,
}: {
  isOpen: boolean
  onToggle: () => void
  unreadCount: number
}) {
  return (
    <>
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white h-6 w-6 flex items-center justify-center rounded-full">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </button>
      )}
    </>
  )
}

// Main App Component
export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null)
  const [unreadCount, setUnreadCount] = useState(0)

  // Load conversations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('chat_conversations')
    if (saved) {
      const parsed = JSON.parse(saved, (key, value) => {
        if (key === 'timestamp' || key === 'createdAt' || key === 'updatedAt') {
          return new Date(value)
        }
        return value
      })
      setConversations(parsed)
    }
  }, [])

  // Save conversations to localStorage
  useEffect(() => {
    localStorage.setItem('chat_conversations', JSON.stringify(conversations))
  }, [conversations])

  // Initialize new conversation when opening chat
  useEffect(() => {
    if (isOpen && !currentConversationId) {
      const newConvId = Date.now().toString()
      setCurrentConversationId(newConvId)
      setMessages([])
      setUnreadCount(0)
    }
  }, [isOpen, currentConversationId])

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: AGENT_ID,
          message: content,
          session_id: currentConversationId,
        }),
      })

      const data = await response.json()

      let agentContent = 'I apologize, but I encountered an error. Please try again.'

      if (data.success && data.response) {
        // Handle both structured JSON and plain text responses
        if (typeof data.response === 'string') {
          agentContent = data.response
        } else if (typeof data.response === 'object') {
          // Try to extract meaningful content from structured response
          if (data.response.message) {
            agentContent = data.response.message
          } else if (data.response.result) {
            agentContent = JSON.stringify(data.response.result, null, 2)
          } else if (data.response.response) {
            agentContent = String(data.response.response)
          } else {
            agentContent = JSON.stringify(data.response, null, 2)
          }
        }
      } else if (data.raw_response) {
        agentContent = data.raw_response
      }

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: agentContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, agentMessage])

      // Update current conversation
      if (currentConversationId) {
        setConversations((prev) => {
          const updated = prev.map((conv) => {
            if (conv.id === currentConversationId) {
              return {
                ...conv,
                messages: [...conv.messages, userMessage, agentMessage],
                updatedAt: new Date(),
              }
            }
            return conv
          })

          // If conversation doesn't exist, create it
          if (!updated.find((c) => c.id === currentConversationId)) {
            updated.push({
              id: currentConversationId,
              title: content.slice(0, 50) || 'New Conversation',
              messages: [userMessage, agentMessage],
              createdAt: new Date(),
              updatedAt: new Date(),
            })
          }

          return updated
        })
      }

      // Increment unread count if chat is not focused
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content:
          'Network error. Please check your connection and try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewConversation = () => {
    const newConvId = Date.now().toString()
    setCurrentConversationId(newConvId)
    setMessages([])
  }

  const handleSelectConversation = (id: string) => {
    const conv = conversations.find((c) => c.id === id)
    if (conv) {
      setCurrentConversationId(id)
      setMessages(conv.messages)
      setShowHistory(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Main chat interface for demo purposes */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="flex gap-4">
          {/* Chat window or welcome screen */}
          {isOpen ? (
            <div className="flex gap-4">
              {showHistory && (
                <ChatHistorySidebar
                  conversations={conversations}
                  onSelectConversation={handleSelectConversation}
                  onDeleteConversation={() => {}}
                  onClose={() => setShowHistory(false)}
                />
              )}
              <ChatWindow
                messages={messages}
                isLoading={isLoading}
                onSendMessage={sendMessage}
                onNewConversation={handleNewConversation}
                onViewHistory={() => setShowHistory(!showHistory)}
              />
            </div>
          ) : (
            <Card className="w-96 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Customer Support
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8 pb-8">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Welcome to Support
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Click the button in the bottom right to start a conversation
                    with our support team.
                  </p>
                  <Button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 w-full"
                  >
                    Open Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Floating widget */}
      <ChatWidget
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        unreadCount={unreadCount}
      />
    </div>
  )
}
