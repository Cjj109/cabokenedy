/**
 * Genera public/og.png (1200x630), la imagen que se ve al compartir el enlace
 * por WhatsApp, Instagram o Telegram.
 *
 * A proposito NO lleva el contador de dias: las plataformas cachean la imagen
 * y quedaria congelada en un numero viejo. El texto es el que no envejece.
 *
 * Requiere sharp:  npm i -D sharp && node scripts/generate-og.mjs
 */
import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const W = 1200;
const H = 630;

const fondo = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="brasa" cx="50%" cy="118%" r="72%">
      <stop offset="0%" stop-color="#E87A1E" stop-opacity="0.30"/>
      <stop offset="55%" stop-color="#E87A1E" stop-opacity="0.07"/>
      <stop offset="100%" stop-color="#E87A1E" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="oro" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#bf953f" stop-opacity="0"/>
      <stop offset="50%" stop-color="#fcf6ba"/>
      <stop offset="100%" stop-color="#bf953f" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#08070E"/>
  <rect width="${W}" height="${H}" fill="url(#brasa)"/>

  <text x="${W / 2}" y="368" text-anchor="middle"
        font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="26"
        letter-spacing="7" fill="#E87A1E" opacity="0.85">CARTA ABIERTA A QLQCOMIDA</text>

  <text x="${W / 2}" y="446" text-anchor="middle"
        font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="52"
        font-weight="bold" fill="#F5F0E8">El carbón está apagado</text>
  <text x="${W / 2}" y="510" text-anchor="middle"
        font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="52"
        font-weight="bold" fill="#F5F0E8">desde el 24 de junio.</text>

  <rect x="${W / 2 - 170}" y="548" width="340" height="1.5" fill="url(#oro)"/>

  <text x="${W / 2}" y="592" text-anchor="middle"
        font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="24"
        fill="#8A7F74">Cabo Kenedy · Caraballeda, La Guaira · desde 1980</text>
</svg>`;

const logo = await sharp(join(rootDir, 'public', 'logo-trim.webp'))
  .resize({ width: 420 })
  .toBuffer();
const { height: logoH } = await sharp(logo).metadata();

await sharp(Buffer.from(fondo))
  .composite([{ input: logo, top: Math.round(300 - logoH), left: Math.round((W - 420) / 2) }])
  .png()
  .toFile(join(rootDir, 'public', 'og.png'));

console.log('public/og.png generado (1200x630)');
