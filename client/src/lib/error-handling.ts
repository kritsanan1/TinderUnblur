
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown): APIError {
  if (error instanceof APIError) {
    return error;
  }

  if (error instanceof Error) {
    return new APIError(error.message);
  }

  if (typeof error === 'string') {
    return new APIError(error);
  }

  return new APIError('An unexpected error occurred');
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context?: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const apiError = handleAPIError(error);
    
    if (context) {
      console.error(`Error in ${context}:`, apiError);
    }
    
    throw apiError;
  }
}

export function createErrorHandler(toast: any) {
  return (error: unknown, context?: string) => {
    const apiError = handleAPIError(error);
    
    console.error(`Error${context ? ` in ${context}` : ''}:`, apiError);
    
    toast({
      title: 'Error',
      description: apiError.message,
      variant: 'destructive'
    });
  };
}
