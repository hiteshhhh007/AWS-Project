import { toast } from '@/components/ui/use-toast';

class ErrorHandler {
  static init() {
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    window.addEventListener('error', this.handleError);
  }

  static cleanup() {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    window.removeEventListener('error', this.handleError);
  }

  static handleError(error) {
    console.error('Error:', error);
    
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message || "An unexpected error occurred",
    });
  }

  static handleAPIError(error) {
    console.error('API Error:', error);
    
    toast({
      variant: "destructive",
      title: "API Error",
      description: error.response?.data?.message || error.message || "An API error occurred",
    });
  }

  static handleUnhandledRejection(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    this.handleError(event.reason);
  }

  static handleApiError(error) {
    let message = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with error
      message = error.response.data?.message || error.message;
    } else if (error.request) {
      // Request made but no response
      message = 'Unable to connect to server';
    } else {
      // Request setup error
      message = error.message;
    }

    this.handleAPIError(error);
    return Promise.reject(error);
  }
}

export default ErrorHandler;
