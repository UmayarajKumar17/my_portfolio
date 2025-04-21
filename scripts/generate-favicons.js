import fs from 'fs';
import { createCanvas } from 'canvas';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create directory if it doesn't exist
const faviconDir = path.join(__dirname, '../public/favicon');
if (!fs.existsSync(faviconDir)) {
  fs.mkdirSync(faviconDir, { recursive: true });
}

// Simple function to create a neural network style favicon
async function createFavicon(outputPath, width, height) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Create a simple canvas with a neural network style favicon
  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, width, height);

  // Draw nodes
  const nodeRadius = width * 0.05;
  const nodes = [
    { x: width * 0.25, y: height * 0.25 }, // Top-left
    { x: width * 0.5, y: height * 0.2 },   // Top-center
    { x: width * 0.75, y: height * 0.25 }, // Top-right
    
    { x: width * 0.2, y: height * 0.5 },   // Middle-left
    { x: width * 0.5, y: height * 0.5 },   // Center
    { x: width * 0.8, y: height * 0.5 },   // Middle-right
    
    { x: width * 0.25, y: height * 0.75 }, // Bottom-left
    { x: width * 0.5, y: height * 0.8 },   // Bottom-center
    { x: width * 0.75, y: height * 0.75 }, // Bottom-right
  ];

  // Draw connections
  ctx.strokeStyle = '#8B5CF6';
  ctx.lineWidth = width * 0.01;

  // Connect nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      // Only connect nodes that are close to each other
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < width * 0.4) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  // Draw nodes on top of connections
  for (const node of nodes) {
    ctx.fillStyle = '#8B5CF6';
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Draw UK letters
  const letterSize = width * 0.08;
  ctx.fillStyle = 'white';
  ctx.font = `bold ${letterSize}px sans-serif`;
  
  // Draw U
  ctx.fillText("U", width * 0.4 - letterSize/2, height * 0.55);
  
  // Draw K
  ctx.fillText("K", width * 0.6 - letterSize/2, height * 0.55);

  // Save to PNG
  const out = fs.createWriteStream(outputPath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  return new Promise((resolve, reject) => {
    out.on('finish', resolve);
    out.on('error', reject);
  });
}

// Generate favicons of different sizes
async function generateFavicons() {
  const sizes = [16, 32, 64, 192, 512];
  
  for (const size of sizes) {
    const outputPath = path.join(faviconDir, `favicon-${size}x${size}.png`);
    await createFavicon(outputPath, size, size);
    console.log(`Generated ${size}x${size} favicon`);
  }
  
  // Special names for standard favicon files
  const specialSizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 192, name: 'android-chrome-192x192.png' },
    { size: 512, name: 'android-chrome-512x512.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 150, name: 'mstile-150x150.png' },
  ];
  
  for (const { size, name } of specialSizes) {
    const outputPath = path.join(faviconDir, name);
    await createFavicon(outputPath, size, size);
    console.log(`Generated ${name}`);
  }
  
  // Also create favicon.ico (32x32)
  const faviconPath = path.join(faviconDir, 'favicon.ico');
  await createFavicon(faviconPath, 32, 32);
  console.log('Generated favicon.ico');
}

generateFavicons().catch(console.error); 