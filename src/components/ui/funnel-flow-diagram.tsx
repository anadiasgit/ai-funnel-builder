'use client'

import { CheckCircle2, Clock, AlertCircle, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FunnelStep {
  id: string
  name: string
  status: 'pending' | 'generating' | 'completed' | 'error'
  icon?: React.ComponentType<{ className?: string }>
}

interface FunnelFlowDiagramProps {
  steps: FunnelStep[]
  currentStep: string
  onStepClick?: (stepId: string) => void
  className?: string
}

export function FunnelFlowDiagram({ 
  steps, 
  currentStep, 
  onStepClick, 
  className 
}: FunnelFlowDiagramProps) {
  const getStatusIcon = (status: FunnelStep['status']) => {
    switch (status) {
      case 'completed':
        return CheckCircle2
      case 'generating':
        return Clock
      case 'error':
        return AlertCircle
      default:
        return Circle
    }
  }

  const getStatusColor = (status: FunnelStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-500'
      case 'generating':
        return 'text-blue-500'
      case 'error':
        return 'text-red-500'
      default:
        return 'text-gray-400'
    }
  }

  const getStepColor = (step: FunnelStep) => {
    if (step.id === currentStep) {
      return 'bg-green-100 border-green-400 text-green-700 shadow-lg ring-2 ring-green-300'
    }
    if (step.status === 'completed') {
      return 'bg-green-50 border-green-200 text-green-700'
    }
    if (step.status === 'generating') {
      return 'bg-blue-50 border-blue-200 text-blue-700'
    }
    if (step.status === 'error') {
      return 'bg-red-50 border-red-200 text-red-700'
    }
    return 'bg-gray-50 border-gray-200 text-gray-600'
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Funnel Flow</h3>
        <span className="text-xs text-gray-500">
          {steps.filter(s => s.status === 'completed').length} of {steps.length} completed
        </span>
      </div>
      
      <div className="relative">
        {/* Connection Lines */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200 -translate-y-1/2 z-0" />
        
        {/* Progress Line - Green up to completed steps */}
        <div className="absolute top-1/2 left-0 h-px bg-green-400 -translate-y-1/2 z-0 transition-all duration-500"
             style={{
               width: `${(steps.filter(s => s.status === 'completed').length / (steps.length - 1)) * 100}%`
             }} />
        
        {/* Steps */}
        <div className="relative z-10 flex items-center justify-between">
          {steps.map((step, index) => {
            const IconComponent = step.icon || getStatusIcon(step.status)
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Step Circle */}
                <button
                  onClick={() => onStepClick?.(step.id)}
                  className={cn(
                    "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                    getStepColor(step),
                    "hover:scale-110 cursor-pointer"
                  )}
                >
                  <IconComponent className={cn("w-5 h-5", getStatusColor(step.status))} />
                </button>
                
                {/* Step Label */}
                <span className={cn(
                  "text-xs font-medium mt-2 text-center max-w-20",
                  step.id === currentStep ? "text-blue-700" : "text-gray-600"
                )}>
                  {step.name}
                </span>
                
                {/* Status Text */}
                <span className={cn(
                  "text-xs mt-1 text-center max-w-20",
                  getStatusColor(step.status)
                )}>
                  {step.status === 'completed' && 'Done'}
                  {step.status === 'generating' && 'Working...'}
                  {step.status === 'error' && 'Error'}
                  {step.status === 'pending' && 'Pending'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
