// Type definitions for gtag
interface GTagEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}

// Declare global gtag function
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'set',
      action: string,
      params?: Record<string, any>
    ) => void;
  }
}

// Track page views
export const pageview = (url: string) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-MD5CG3N4WF', {
        page_path: url,
      });
      console.log('Pageview tracked:', url);
    }
  } catch (error) {
    console.error('Failed to track pageview:', error);
  }
};

// Track events
export const event = ({ action, category, label, value }: GTagEvent) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
      console.log('Event tracked:', { action, category, label, value });
    }
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}; 