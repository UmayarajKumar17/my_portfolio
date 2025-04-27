import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initGA = (trackingId: string) => {
  if (trackingId && typeof window !== 'undefined') {
    ReactGA.initialize(trackingId);
    console.log('Google Analytics initialized with tracking ID:', trackingId);
  }
};

// Track page views
export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
  console.log('Page view tracked:', path);
};

// Track events (for interactions like button clicks, form submissions, etc.)
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  ReactGA.event({
    category,
    action,
    label,
    value
  });
  console.log('Event tracked:', { category, action, label, value });
}; 