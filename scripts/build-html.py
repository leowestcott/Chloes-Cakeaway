#!/usr/bin/env python3
"""Builds index.html and index-welcome.html from scripts/template.html.

- inlines (and lightly minifies) assets/css/site.css so there is no render-blocking stylesheet
- expands {{img:id|sizes|eager}} into responsive <picture> markup (AVIF + WebP) using
  scripts/image-sizes.json (written by build-images.mjs)
- expands {{I:name}} into inline SVG icons
- generates the collection chapters and the gallery from scripts/images.json

Usage:  python3 scripts/build-html.py
"""
import html, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE_URL = os.environ.get('SITE_URL', 'https://leowestcott.github.io/Chloes-Cakeaway/')
P = lambda *a: os.path.join(ROOT, *a)

images = {e['id']: e for e in json.load(open(P('scripts', 'images.json')))}
sizes = json.load(open(P('scripts', 'image-sizes.json')))

ICONS = {
    'arrow': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 12h15m-5-6 6 6-6 6"/></svg>',
    'down': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 4v15m-6-5 6 6 6-6"/></svg>',
    'left': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20 12H5m5-6-6 6 6 6"/></svg>',
    'right': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 12h15m-5-6 6 6-6 6"/></svg>',
    'close': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    'star': '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 3 2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/></svg>',
    'check': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>',
    'info': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/></svg>',
    'ig': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r=".9" fill="currentColor" stroke="none"/></svg>',
    'pencil': '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M5 27l4-1 15-15-3-3L6 23l-1 4zM19 10l3 3M24 5l3 3-2 2-3-3z"/></svg>',
    'hand': '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M9 17V8a2 2 0 0 1 4 0v7m0-9a2 2 0 0 1 4 0v9m0-7a2 2 0 0 1 4 0v8m0-5a2 2 0 0 1 4 0v8c0 5-3.5 9-9 9-4 0-6-2-8.5-5.5L5 18.5a2 2 0 0 1 3-2.6L9 17"/></svg>',
    'leaf': '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M6 26C6 13 13 6 27 5c0 14-7 21-20 21zM6 26 18 14"/></svg>',
    'shield': '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M16 4 6 8v7c0 6.5 4.2 11 10 13 5.8-2 10-6.5 10-13V8z"/><path d="m11.5 16 3 3 6-6.5"/></svg>',
}

def esc(s):
    return html.escape(s, quote=True)

def picture(img_id, sz, eager=False, extra=''):
    e, s = images[img_id], sizes[img_id]
    ws = s['widths']
    avif = ', '.join(f'assets/img/{img_id}-{w}.avif {w}w' for w in ws)
    webp = ', '.join(f'assets/img/{img_id}-{w}.webp {w}w' for w in ws)
    fallback = f'assets/img/{img_id}-{min(ws, key=lambda w: abs(w - 720))}.webp'
    load = 'fetchpriority="high" loading="eager"' if eager else 'loading="lazy"'
    return (f'<picture><source type="image/avif" srcset="{avif}" sizes="{sz}">'
            f'<img src="{fallback}" srcset="{webp}" sizes="{sz}" width="{s["w"]}" height="{s["h"]}" '
            f'alt="{esc(e["alt"])}" {load} decoding="async"{extra} style="background:{s["bg"]}"></picture>')

CHAPTERS = [
    ('Celebration Cakes', 'Birthday cake', 'celebration-cakes',
     'Buttercream rosettes, vintage piping, glossy drips and hand-painted gold. Tall, layered and made to be the first thing everyone sees when they walk in.',
     ['Birthdays', 'Drip cakes', 'Vintage piping', 'Rosettes'],
     ['strawberry-drip-90th', 'black-heart-disco', 'pink-gold-16th', 'golden-drip-loaded']),
    ('Sculpted &amp; Novelty', 'Sculpted / novelty cake', 'sculpted',
     'If it can be imagined, it can probably be cake. Sofas complete with the family dog, a teenager’s messy bed, a giant custard cream: fully edible and modelled by hand.',
     ['Couch cakes', 'Hand-modelled figures', 'Fully edible'],
     ['couch-dog', 'messy-bed', 'custard-cream', 'teddy-bear']),
    ('For the Little Ones', 'Children’s birthday cake', 'little-ones',
     'Swings, fairies, trains and rainbows. Cakes built around the things they love most, so the birthday girl or boy recognises it the moment they see it.',
     ['First birthdays', 'Themes', 'Names &amp; ages'],
     ['swing-cake', 'rainbow-train', 'fairy-woodland', 'unicorn']),
    ('Cupcakes &amp; Treats', 'Cupcakes', 'cupcakes',
     'Personalised cupcakes for parties, teams and thank-yous, rose-piped boxes for gifting, and the occasional tray of brownies too good not to share.',
     ['Personalised', 'Gift boxes', 'Mini cupcakes', 'Brownies'],
     ['rainbow-cupcakes', 'wedding-cupcakes', 'gold-fleck-cupcakes', 'brownies']),
    ('Tiers &amp; Milestones', 'Anniversary or milestone', 'tiers',
     'Golden anniversaries, christenings, confirmations and the big birthdays. Two and three tiers, from simple semi-naked finishes to gift-wrapped gold. Wedding cakes are a rare treat, so do ask.',
     ['Anniversaries', 'Christenings', 'Big birthdays', 'Two &amp; three tiers'],
     ['golden-anniversary-bow', 'gold-leaf-tiers', 'semi-naked-80th', 'fabulous-50th']),
    ('Free-From', 'Gluten-free, dairy-free or vegan cake', 'free-from',
     'Gluten-free, dairy-free and vegan cakes have all come out of Chloé’s kitchen, from a dairy-free vanilla sponge with vegan ganache to a fully gluten-free rose gold drip. Tell her about any dietary needs or allergies when you enquire.',
     ['Gluten-free', 'Dairy-free', 'Vegan', 'Just ask'],
     ['dairy-free-strawberries', 'rose-gold-drip-gf', 'strawberry-gold-anniversary', 'silver-lilac-cupcakes']),
]

CTA = ['Enquire about a celebration cake', 'Enquire about a sculpted cake', 'Plan a children’s cake',
       'Enquire about cupcakes', 'Plan a tiered cake', 'Enquire about a free-from cake']

def chapters():
    out = []
    for n, (title, occ, slug, text, tags, imgs) in enumerate(CHAPTERS, 1):
        figs = []
        for k, img_id in enumerate(imgs):
            cls = ' class="third"' if k == 3 else ''
            sz = '(min-width: 900px) 24vw, 52vw' if k == 0 else '(min-width: 900px) 14vw, 40vw'
            figs.append(f'<figure{cls}><div class="reveal-img" style="height:100%;--d:{0.1 * k:.1f}s">{picture(img_id, sz)}</div>'
                        f'<figcaption>{esc(images[img_id]["cap"])}</figcaption></figure>')
        tag_html = ''.join(f'<li>{t}</li>' for t in tags)
        out.append(f'''      <article class="chapter" id="{slug}" aria-labelledby="{slug}-t">
        <div class="chapter__copy">
          <span class="chapter__num" aria-hidden="true">{n:02d}</span>
          <h3 id="{slug}-t">{title}</h3>
          <p>{text}</p>
          <ul class="tags">{tag_html}</ul>
          <a class="link-arrow" href="#enquire" data-occasion="{esc(occ)}">{CTA[n - 1]} {ICONS["arrow"]}</a>
        </div>
        <div class="chapter__media">{"".join(figs)}</div>
      </article>''')
    return '\n'.join(out)

GALLERY_ORDER = [
    'gold-ruffle-birthday', 'couch-golf', 'pastel-bows-18th', 'rainbow-cupcakes', 'pink-vintage-bows', 'dino-drip',
    'yellow-vintage-heart', 'golden-drip-70th', 'pink-butterflies', 'messy-bed', 'congrats-gcse', 'floral-wrap',
    'flower-fairy-garden', 'pink-rose-gold-rosette', 'mermaid-textured-tiers', 'wedding-cupcakes', 'biscoff-drip-50th',
    'rose-gold-drip-gf', 'teddy-bear', 'buttercream-roses', 'gold-21st', 'pastel-rainbow-drip', 'watercolour-drip',
    'semi-naked-gypsophila', 'christmas-tree', 'caramel-drip-topper', 'faultline-prosecco', 'brownies', 'pink-two-tier',
    'valentine-cupcakes', 'unicorn-rainbow', 'santa-chimney', 'green-marble-tiers', 'gold-fleck-cupcakes',
    'semi-naked-wedding', 'mothers-day-cupcakes', 'strawberry-drip-90th', 'couch-dog', 'swing-cake', 'golden-anniversary-bow',
    'dairy-free-strawberries', 'rainbow-train', 'black-heart-disco', 'lemon-blueberry', 'fairy-woodland',
    'semi-naked-80th', 'custard-cream', 'unicorn', 'ombre-rosettes', 'silver-lilac-cupcakes', 'fabulous-50th',
    'golden-drip-loaded', 'strawberry-gold-anniversary', 'pink-gold-16th', 'gold-leaf-tiers', 'rosette-cream-gold', 'pink-signature',
]

def gallery():
    assert len(set(GALLERY_ORDER)) == len(GALLERY_ORDER) == len(images), (len(GALLERY_ORDER), len(images))
    out = []
    for img_id in GALLERY_ORDER:
        e, s = images[img_id], sizes[img_id]
        full = f' data-full="assets/img/{img_id}-{max(s["widths"])}.webp"'
        pic = picture(img_id, '(min-width: 1180px) 22vw, (min-width: 760px) 30vw, 46vw', extra=full)
        out.append(f'      <button class="masonry__item" type="button" data-cat="{e["cat"]}" data-cap="{esc(e["cap"])}" '
                   f'data-url="{e["url"]}" aria-label="View larger: {esc(e["cap"])}">{pic}</button>')
    return '\n'.join(out)

def minify_css(css):
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    css = re.sub(r'\s+', ' ', css)
    css = re.sub(r'\s*([{};,>])\s*', r'\1', css)
    css = re.sub(r';}', '}', css)
    return css.strip()

import shutil, subprocess

def esbuild(args, stdin=None):
    exe = shutil.which('esbuild') or os.path.join(ROOT, 'node_modules', '.bin', 'esbuild')
    if not os.path.exists(exe) and not shutil.which('esbuild'):
        return None
    r = subprocess.run([exe] + args, input=stdin, capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else None

def minify_js():
    for name in ('site', 'welcome'):
        src = P('assets', 'js', name + '.js')
        out = esbuild([src, '--minify', '--target=es2018'])
        open(P('assets', 'js', name + '.min.js'), 'w').write(out if out else open(src).read())

def build(welcome: bool):
    t = open(P('scripts', 'template.html')).read()
    raw = open(P('assets', 'css', 'site.css')).read()
    css = (esbuild(['--loader=css', '--minify'], raw) or minify_css(raw)).strip().replace('../fonts/', 'assets/fonts/')
    hero = sizes['rosette-cream-gold']
    hero_srcset = ', '.join(f'assets/img/rosette-cream-gold-{w}.avif {w}w' for w in hero['widths'])
    preload = (f'<link rel="preload" as="image" type="image/avif" imagesrcset="{hero_srcset}" '
               f'imagesizes="(min-width: 900px) 40vw, 86vw" fetchpriority="high">')
    welcome_html = ''
    welcome_js = ''
    if welcome:
        w = sizes['gold-ruffle-birthday']
        wset = ', '.join(f'assets/img/gold-ruffle-birthday-{x}.avif {x}w' for x in w['widths'])
        preload = (f'<link rel="preload" as="image" type="image/avif" imagesrcset="{wset}" '
                   f'imagesizes="200px" fetchpriority="high">')
        welcome_html = f'''<div class="welcome" id="welcome" role="dialog" aria-modal="false" aria-label="Welcome to Chloé’s Cakeaway">
  <button class="welcome__skip" type="button">Skip</button>
  <div>
    <div class="welcome__orb">{picture('gold-ruffle-birthday', '200px', eager=True)}</div>
    <p class="welcome__script">Chloé’s</p>
    <p class="welcome__word">Cakeaway</p>
    <p class="welcome__line">Something beautiful is baking…</p>
    <button class="btn btn--blush" type="button">Come on in {ICONS["arrow"]}</button>
  </div>
  <span class="welcome__bar" aria-hidden="true"></span>
</div>'''
        welcome_js = '<script src="assets/js/welcome.min.js"></script>'
    rep = {
        '{{CSS}}': css, '{{SITE_URL}}': SITE_URL, '{{PRELOAD_HERO}}': preload,
        '{{ROBOTS}}': '',
        '{{WELCOME}}': welcome_html, '{{WELCOME_JS}}': welcome_js,
        '{{CHAPTERS}}': chapters(), '{{GALLERY}}': gallery(),
    }
    for k, v in rep.items():
        t = t.replace(k, v)
    t = re.sub(r'\{\{I:(\w+)\}\}', lambda m: ICONS[m.group(1)], t)

    def img_tok(m):
        parts = m.group(1).split('|')
        return picture(parts[0], parts[1], eager=len(parts) > 2 and parts[2] == 'eager')
    t = re.sub(r'\{\{img:([^}]+)\}\}', img_tok, t)
    assert '{{' not in t, re.findall(r'\{\{[^}]*\}\}', t)
    return t

minify_js()
open(P('index.html'), 'w').write(build(False))
open(P('index-welcome.html'), 'w').write(build(True))
print('built index.html (%d KB) and index-welcome.html' % (len(build(False)) // 1024))
