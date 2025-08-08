
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to external service if needed
    if (import.meta.env.PROD) {
      // Analytics logging would go here
    }
  }

  componentDidMount() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Only show error boundary for critical errors, not all rejections
    if (event.reason instanceof Error && event.reason.message.includes('Network')) {
      this.setState({ 
        hasError: true, 
        error: new Error(`Network error: ${event.reason.message}`) 
      });
    } else {
      // Log but don't crash the app for other rejections
      console.warn('Promise rejected but not showing error boundary:', event.reason);
    }
    
    event.preventDefault();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="mt-2">
              {this.state.error?.message || 'An unexpected error occurred'}
              <div className="mt-4">
                <button
                  onClick={() => this.setState({ hasError: false, error: undefined })}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm"
                >
                  Try Again
                </button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
