// Generates responsive AVIF + WebP sets into assets/img and writes scripts/image-sizes.json
// Requires: npm i sharp   (run from the repo root)
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const list = JSON.parse(fs.readFileSync(path.join(root, 'scripts/images.json')));
const outDir = path.join(root, 'assets/img');
fs.mkdirSync(outDir, { recursive: true });
const WIDTHS = [400, 720, 1080, 1440];
const sizes = {};
async function one(e) {
  const src = path.join(root, 'scripts/.crops', e.id + '.png');
  const meta = await sharp(src).metadata();
  const ws = WIDTHS.filter(w => w < meta.width * 0.97);
  if (!ws.includes(Math.min(meta.width, 1440))) ws.push(Math.min(meta.width, 1440));
  sizes[e.id] = { w: meta.width, h: meta.height, widths: ws };
  for (const w of ws) {
    const base = sharp(src).resize({ width: w }).modulate({ saturation: 1.03 }).sharpen({ sigma: 0.5 });
    const a = path.join(outDir, `${e.id}-${w}.avif`), b = path.join(outDir, `${e.id}-${w}.webp`);
    if (!fs.existsSync(a) || process.env.FORCE) await base.clone().avif({ quality: 52, effort: 4 }).toFile(a);
    if (!fs.existsSync(b) || process.env.FORCE) await base.clone().webp({ quality: 74, effort: 5 }).toFile(b);
  }
  // tiny blurred placeholder colour
  const { dominant } = await sharp(src).stats();
  sizes[e.id].bg = `rgb(${dominant.r},${dominant.g},${dominant.b})`;
  process.stdout.write('.');
}
const queue = [...list];
await Promise.all(Array.from({ length: 4 }, async () => { while (queue.length) await one(queue.shift()); }));
fs.writeFileSync(path.join(root, 'scripts/image-sizes.json'), JSON.stringify(sizes, null, 1));
console.log('\ndone');
