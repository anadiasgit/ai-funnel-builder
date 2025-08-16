'use client'

import { useState, useEffect, forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ValidationRule {
  test: (value: string) => boolean
  message: string
  severity?: 'error' | 'warning' | 'info'
}

interface InputWithValidationProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
  validationRules?: ValidationRule[]
  showValidation?: boolean
  error?: string
  success?: string
  variant?: 'default' | 'error' | 'success'
  showPasswordToggle?: boolean
  className?: string
  labelClassName?: string
  onValidationChange?: (isValid: boolean, errors: string[]) => void
}

export const InputWithValidation = forwardRef<HTMLInputElement, InputWithValidationProps>(
  ({
    label,
    description,
    validationRules = [],
    showValidation = true,
    error: externalError,
    success: externalSuccess,
    variant = 'default',
    showPasswordToggle = false,
    className,
    labelClassName,
    onValidationChange,
    ...props
  }, ref) => {
    const [value, setValue] = useState(props.value || props.defaultValue || '')
    const [errors, setErrors] = useState<string[]>([])
    const [warnings, setWarnings] = useState<string[]>([])
    const [isValid, setIsValid] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [hasInteracted, setHasInteracted] = useState(false)

    // Determine input type for password toggle
    const inputType = showPasswordToggle && props.type === 'password' 
      ? (showPassword ? 'text' : 'password')
      : props.type

    // Validate input based on rules
    const validateInput = (inputValue: string) => {
      const newErrors: string[] = []
      const newWarnings: string[] = []

      validationRules.forEach(rule => {
        if (!rule.test(inputValue)) {
          if (rule.severity === 'warning') {
            newWarnings.push(rule.message)
          } else {
            newErrors.push(rule.message)
          }
        }
      })

      setErrors(newErrors)
      setWarnings(newWarnings)
      
      const newIsValid = newErrors.length === 0
      setIsValid(newIsValid)
      
      onValidationChange?.(newIsValid, newErrors)
    }

    // Handle value changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setValue(newValue)
      setHasInteracted(true)
      
      if (validationRules.length > 0) {
        validateInput(newValue)
      }
      
      props.onChange?.(e)
    }

    // Handle focus/blur
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasInteracted(true)
      
      if (validationRules.length > 0) {
        validateInput(e.target.value)
      }
      
      props.onBlur?.(e)
    }

    // Validate on mount if there's a default value
    useEffect(() => {
      if (props.defaultValue && validationRules.length > 0) {
        validateInput(props.defaultValue as string)
      }
    }, [props.defaultValue, validationRules])

    // Update internal value when external value changes
    useEffect(() => {
      if (props.value !== undefined) {
        setValue(props.value)
      }
    }, [props.value])

    // Determine variant based on state
    const getVariant = () => {
      if (externalError || errors.length > 0) return 'error'
      if (externalSuccess || (isValid && hasInteracted && value)) return 'success'
      if (warnings.length > 0) return 'warning'
      return variant
    }

    const currentVariant = getVariant()

    const getVariantStyles = () => {
      switch (currentVariant) {
        case 'error':
          return 'border-red-300 focus:border-red-500 focus:ring-red-500'
        case 'success':
          return 'border-green-300 focus:border-green-500 focus:ring-green-500'
        case 'warning':
          return 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500'
        default:
          return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
      }
    }

    const getStatusIcon = () => {
      if (externalError || errors.length > 0) {
        return <AlertCircle className="w-4 h-4 text-red-500" />
      }
      if (externalSuccess || (isValid && hasInteracted && value)) {
        return <CheckCircle className="w-4 h-4 text-green-500" />
      }
      if (warnings.length > 0) {
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      }
      return null
    }

    const shouldShowValidation = showValidation && (hasInteracted || isFocused || externalError || externalSuccess)

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label 
            htmlFor={props.id} 
            className={cn("text-sm font-medium text-gray-700", labelClassName)}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}

        <div className="relative">
          <Input
            ref={ref}
            {...props}
            type={inputType}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              "pr-10", // Make room for status icon and password toggle
              getVariantStyles(),
              className
            )}
          />
          
          {/* Status Icon */}
          {shouldShowValidation && getStatusIcon() && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {getStatusIcon()}
            </div>
          )}
          
          {/* Password Toggle */}
          {showPasswordToggle && props.type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}

        {/* External Error */}
        {externalError && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>{externalError}</span>
          </div>
        )}

        {/* External Success */}
        {externalSuccess && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>{externalSuccess}</span>
          </div>
        )}

        {/* Validation Errors */}
        {shouldShowValidation && errors.length > 0 && (
          <div className="space-y-1">
            {errors.map((error, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            ))}
          </div>
        )}

        {/* Validation Warnings */}
        {shouldShowValidation && warnings.length > 0 && (
          <div className="space-y-1">
            {warnings.map((warning, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-yellow-600">
                <AlertCircle className="w-4 h-4" />
                <span>{warning}</span>
              </div>
            ))}
          </div>
        )}

        {/* Validation Summary */}
        {shouldShowValidation && validationRules.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Validation:</span>
            <Badge 
              variant={isValid ? 'default' : 'destructive'}
              className="text-xs"
            >
              {isValid ? 'Valid' : `${errors.length} errors`}
            </Badge>
            {warnings.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {warnings.length} warnings
              </Badge>
            )}
          </div>
        )}
      </div>
    )
  }
)

InputWithValidation.displayName = 'InputWithValidation'
