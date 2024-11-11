import { AxiosError } from 'axios';

interface ErrorResponse {
  error: string;
  success: boolean;
  status: number;
  innerError?: {
    message: string;
    stack: string;
    requestId: string;
    headers: Record<string, string>;
    body: string;
  };
}

interface ApiErrorResponse {
    error?: {
      message?: string;
    };
  }

export function handleAxiosError(error: unknown): ErrorResponse {
  const errorType = error instanceof Error ? error.name : 'UnknownError';
  const errorResponse: ErrorResponse = {
    error: errorType,
    success: false,
    status: 500,
    innerError: {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack || '' : '',
      requestId: '',
      headers: {},
      body: '',
    },
  };

  if (error && typeof error === 'object' && 'isAxiosError' in error && error.isAxiosError) {
    const axiosError = error as AxiosError;
    errorResponse.innerError = {
      requestId: axiosError.response?.headers?.['x-ms-request-id'] || '',
      headers: Object.fromEntries(
        Object.entries(axiosError.response?.headers || {})
          .map(([k, v]) => [k, v?.toString() || ''])
      ),
      body: JSON.stringify(axiosError.response?.data || ''),
      message: (axiosError.response?.data as ApiErrorResponse)?.error?.message || axiosError.message,
      stack: '',
    };
    errorResponse.status = axiosError.response?.status || 500;

    console.trace('Axios error details:', {
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      headers: errorResponse.innerError?.headers,
      body: errorResponse.innerError?.body,
    });
  }

  return errorResponse;
} 