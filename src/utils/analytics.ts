import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initGA = (trackingId: string) => {
  try {
    if (trackingId && typeof window !== 'undefined' && ReactGA) {
      ReactGA.initialize(trackingId);
      console.log('Google Analytics initialized with tracking ID:', trackingId);
    }
  } catch (error) {
    console.error('Failed to initialize Google Analytics:', error);
  }
};

// Track page views
export const trackPageView = (path: string) => {
  try {
    if (typeof ReactGA !== 'undefined') {
      ReactGA.send({ hitType: 'pageview', page: path });
      console.log('Page view tracked:', path);
    }
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
};

// Track events (for interactions like button clicks, form submissions, etc.)
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  try {
    if (typeof ReactGA !== 'undefined') {
      ReactGA.event({
        category,
        action,
        label,
        value
      });
      console.log('Event tracked:', { category, action, label, value });
    }
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}; 