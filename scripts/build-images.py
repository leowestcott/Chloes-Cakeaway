"""Crop the source Instagram photos (removing TikTok watermarks) into scripts/.crops/*.png.
Usage: python3 scripts/build-images.py   (then: node scripts/build-images.mjs)"""
import json, os
from PIL import Image
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = os.path.join(root, 'scripts', '.crops'); os.makedirs(out, exist_ok=True)
for e in json.load(open(os.path.join(root, 'scripts', 'images.json'))):
    im = Image.open(os.path.join(root, 'source', e['src'])).convert('RGB')
    if 'crop' in e:
        l, t, r, b = e['crop']; W, H = im.size
        im = im.crop((round(l*W), round(t*H), round(r*W), round(b*H)))
    im.save(os.path.join(out, e['id'] + '.png'))
print('cropped')
