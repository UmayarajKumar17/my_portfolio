# Umayaraj Kumar's Portfolio Website

This is the source code for my personal portfolio website built with React, Vite, TailwindCSS, and EmailJS.

Live demo: [https://umayarajkumar17.github.io/portfolio/](https://umayarajkumar17.github.io/portfolio/)

## Features

- Modern, responsive design
- Interactive UI elements with Tailwind CSS
- AI-powered chatbot assistant
- Animated components with CSS animations
- Contact form with EmailJS integration
- Smooth scrolling and navigation
- Dark mode design

## Technologies Used

- **React** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool
- **TailwindCSS** - Utility-first CSS framework
- **EmailJS** - Contact form email service
- **Groq API** - AI chatbot integration
- **GitHub Pages** - Hosting

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/UmayarajKumar17/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with the following variables:
   ```
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   VITE_GROQ_API_KEY=your_groq_api_key
   VITE_GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
   VITE_GROQ_MODEL=llama3-8b-8192
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Deployment

This site is deployed on GitHub Pages using GitHub Actions. The workflow is configured in `.github/workflows/deploy.yml` and automatically deploys the site when changes are pushed to the main branch.

## Connect With Me

- GitHub: [UmayarajKumar17](https://github.com/UmayarajKumar17)
- LinkedIn: [umayaraj-kumar](https://www.linkedin.com/in/umayaraj-kumar)
- Email: umaya1776@gmail.com

## License

MIT
