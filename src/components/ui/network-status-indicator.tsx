'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NetworkStatusIndicatorProps {
  className?: string
  showDetails?: boolean
  variant?: 'badge' | 'icon' | 'full'
}

export function NetworkStatusIndicator({ 
  className, 
  showDetails = false,
  variant = 'badge'
}: NetworkStatusIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [connectionType, setConnectionType] = useState<string>('')
  const [lastSeen, setLastSeen] = useState<Date>(new Date())

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setLastSeen(new Date())
    }
    
    const handleOffline = () => {
      setIsOnline(false)
    }

    // Check initial status
    setIsOnline(navigator.onLine)
    setLastSeen(new Date())

    // Try to detect connection type
    if ('connection' in navigator) {
      const connection = (navigator as Navigator & { 
        connection?: { 
          effectiveType?: string; 
          type?: string;
          addEventListener?: (event: string, listener: () => void) => void;
          removeEventListener?: (event: string, listener: () => void) => void;
        } 
      }).connection
      if (connection) {
        setConnectionType(connection.effectiveType || connection.type || '')
        
        const updateConnectionInfo = () => {
          setConnectionType(connection.effectiveType || connection.type || '')
        }
        
        if (connection.addEventListener) {
          connection.addEventListener('change', updateConnectionInfo)
          return () => {
            if (connection.removeEventListener) {
              connection.removeEventListener('change', updateConnectionInfo)
            }
          }
        }
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const getStatusConfig = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        label: 'Offline',
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 border-red-200',
        iconClassName: 'text-red-600'
      }
    }

    if (connectionType === 'slow-2g' || connectionType === '2g') {
      return {
        icon: AlertTriangle,
        label: 'Slow Connection',
        variant: 'secondary' as const,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        iconClassName: 'text-yellow-600'
      }
    }

    return {
      icon: Wifi,
      label: 'Online',
      variant: 'default' as const,
      className: 'bg-green-100 text-green-800 border-green-200',
      iconClassName: 'text-green-600'
    }
  }

  const config = getStatusConfig()
  const IconComponent = config.icon

  if (variant === 'icon') {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <IconComponent 
          className={cn("w-4 h-4", config.iconClassName)} 
        />
      </div>
    )
  }

  if (variant === 'full') {
    return (
      <div className={cn("flex items-center gap-2 p-2 rounded-md border", config.className, className)}>
        <IconComponent className={cn("w-4 h-4", config.iconClassName)} />
        <span className="text-sm font-medium">{config.label}</span>
        
        {showDetails && isOnline && (
          <>
            {connectionType && (
              <span className="text-xs opacity-75">({connectionType})</span>
            )}
            <span className="text-xs opacity-75">
              Last seen: {lastSeen.toLocaleTimeString()}
            </span>
          </>
        )}
      </div>
    )
  }

  // Default badge variant
  return (
    <Badge 
      variant={config.variant} 
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 text-xs font-medium border",
        config.className,
        className
      )}
    >
      <IconComponent className="w-3 h-3" />
      <span>{config.label}</span>
    </Badge>
  )
}
