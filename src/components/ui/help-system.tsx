'use client'

import React, { useState, useRef, useEffect } from 'react'
import { HelpCircle, X, Search, Play, BookOpen, MessageCircle, ChevronRight } from 'lucide-react'
import { Button } from './button'
import { Input } from './input'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'

// Tooltip Component
interface TooltipProps {
  content: string | React.ReactNode
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function Tooltip({ content, children, position = 'top', className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const updatePosition = () => {
    if (triggerRef.current && tooltipRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      
      let x = 0
      let y = 0
      
      switch (position) {
        case 'top':
          x = rect.left + rect.width / 2 - tooltipRect.width / 2
          y = rect.top - tooltipRect.height - 8
          break
        case 'bottom':
          x = rect.left + rect.width / 2 - tooltipRect.width / 2
          y = rect.bottom + 8
          break
        case 'left':
          x = rect.left - tooltipRect.width - 8
          y = rect.top + rect.height / 2 - tooltipRect.height / 2
          break
        case 'right':
          x = rect.right + 8
          y = rect.top + rect.height / 2 - tooltipRect.height / 2
          break
      }
      
      setTooltipPosition({ x, y })
    }
  }

  useEffect(() => {
    if (isVisible) {
      updatePosition()
      window.addEventListener('scroll', updatePosition)
      window.addEventListener('resize', updatePosition)
      
      return () => {
        window.removeEventListener('scroll', updatePosition)
        window.removeEventListener('resize', updatePosition)
      }
    }
  }, [isVisible])

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-block"
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg max-w-xs ${className}`}
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          {content}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
            position === 'top' ? 'top-full -mt-1 left-1/2 -ml-1' :
            position === 'bottom' ? 'bottom-full -mb-1 left-1/2 -ml-1' :
            position === 'left' ? 'left-full -ml-1 top-1/2 -mt-1' :
            'right-full -mr-1 top-1/2 -mt-1'
          }`} />
        </div>
      )}
    </div>
  )
}

// Help Icon Component
interface HelpIconProps {
  content: string | React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function HelpIcon({ content, position = 'top', size = 'md', className = '' }: HelpIconProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <Tooltip content={content} position={position} className={className}>
      <HelpCircle className={`${sizeClasses[size]} text-gray-400 hover:text-blue-500 cursor-help transition-colors`} />
    </Tooltip>
  )
}

// Example Content Component
interface ExampleContentProps {
  title: string
  examples: Array<{
    label: string
    content: string
    description?: string
  }>
  onUseExample?: (example: string) => void
}

export function ExampleContent({ title, examples, onUseExample }: ExampleContentProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          {title}
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? 'Hide' : 'Show'} Examples
        </Button>
      </div>
      
      {isExpanded && (
        <div className="space-y-3">
          {examples.map((example, index) => (
            <div key={index} className="bg-white p-3 rounded border border-gray-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">{example.label}</p>
                  <p className="text-sm text-gray-600 mb-2">{example.content}</p>
                  {example.description && (
                    <p className="text-xs text-gray-500">{example.description}</p>
                  )}
                </div>
                {onUseExample && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUseExample(example.content)}
                    className="text-xs"
                  >
                    Use This
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Video Tutorial Component
interface VideoTutorialProps {
  title: string
  description: string
  videoUrl: string
  duration: string
  thumbnail?: string
  onPlay?: () => void
}

export function VideoTutorial({ title, description, videoUrl, duration, thumbnail, onPlay }: VideoTutorialProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
    onPlay?.()
  }

  if (isPlaying) {
    return (
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full h-64 object-cover"
          onEnded={() => setIsPlaying(false)}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPlaying(false)}
          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow cursor-pointer" onClick={handlePlay}>
      <div className="flex items-start gap-3">
        <div className="relative">
          {thumbnail ? (
            <img src={thumbnail} alt={title} className="w-20 h-16 object-cover rounded" />
          ) : (
            <div className="w-20 h-16 bg-gray-200 rounded flex items-center justify-center">
              <Play className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded flex items-center justify-center">
            <div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-gray-700 ml-0.5" />
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {duration}
            </Badge>
            <span className="text-xs text-gray-500">Click to play</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// FAQ Component
interface FAQItem {
  question: string
  answer: string
  category: string
  tags: string[]
}

interface FAQProps {
  items: FAQItem[]
  searchable?: boolean
  categorized?: boolean
}

export function FAQ({ items, searchable = true, categorized = true }: FAQProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))]
  
  const filteredItems = items.filter(item => {
    const matchesSearch = !searchTerm || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search FAQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {categorized && (
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-xs"
            >
              {category === 'all' ? 'All Categories' : category}
            </Button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {filteredItems.map((item, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleItem(index)}
              >
                <CardTitle className="text-base font-medium text-gray-900">
                  {item.question}
                </CardTitle>
                <ChevronRight 
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedItems.has(index) ? 'rotate-90' : ''
                  }`} 
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
                {item.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            
            {expandedItems.has(index) && (
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No FAQ items found matching your search.</p>
        </div>
      )}
    </div>
  )
}

// Live Chat Component
interface LiveChatProps {
  isOpen: boolean
  onClose: () => void
  onSendMessage: (message: string) => void
  messages: Array<{
    id: string
    text: string
    sender: 'user' | 'support'
    timestamp: Date
  }>
  isTyping?: boolean
}

export function LiveChat({ isOpen, onClose, onSendMessage, messages, isTyping }: LiveChatProps) {
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim())
      setNewMessage('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
      <div className="bg-blue-600 text-white p-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Live Support</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-blue-700">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 h-64 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.text}
              <div className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-3 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} size="sm">
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

// Floating Help Button
interface FloatingHelpButtonProps {
  onClick: () => void
  className?: string
}

export function FloatingHelpButton({ onClick, className = '' }: FloatingHelpButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white z-40 ${className}`}
    >
      <HelpCircle className="w-6 h-6" />
    </Button>
  )
}
