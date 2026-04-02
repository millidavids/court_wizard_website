# Court Wizard Website — Implementation Plan

## Context

Court Wizard needs a marketing website — a static single-page site hosted on S3 + CloudFront. This is the first title from Blackhearth Games, and the site should tell that story while showcasing the game's depth: 11 wizard archetypes, 32 spells with talent trees, roguelite + endless modes, multiplayer, and boss fights. The design should feel dark fantasy / arcane — fitting a game about a wizard defending a kingdom.

**Tech:** Vanilla HTML/CSS only. No frameworks. No JavaScript required.
**Hosting:** Static files in S3 behind CloudFront.
**Assets:** Placeholders for now — real screenshots and art to be added later.

---

## Game Context (for writing copy)

**What is Court Wizard?**
A 3D real-time strategy / tower defense game built with Rust and Bevy. You play as a powerful wizard defending your castle from waves of attackers. Built as a hobby project that became Blackhearth Games' first title. Licensed under GPL v3.0.

**Core loop:** Cast spells from your tower to defend your king and army against increasingly difficult waves of attackers. Choose from 11 wizard archetypes, each with radically different playstyles. Master 32 spells, each with 9-talent upgrade trees.

**Game modes:**
- Roguelite Campaign — 25 levels, seeded runs, difficulty sliders, run history
- Endless Mode — Infinitely scaling, per-wizard progression, saves between sessions
- Multiplayer — Peer-to-peer real-time co-op

**Wizard archetypes (11):**
1. Boring Ole Mage — Straightforward baseline with 5% bonus to all stats
2. Rune Caster — Build Q/W/E/R rune sequences for spell empowerment
3. Randomancer — Spin a roulette wheel for random spell casting (1.75x bonus)
4. Arcanorouter — Dynamically allocate arcane energy between Range, Mana, Power, Speed
5. Excremage — Satirical variant where all spells deal "Poop" damage
6. Alchemist — Brewing specialist with Philosopher's Stone
7. Warglock — Replaces spells with 5 different guns
8. Swordcerer (Battlemage) — Leave the tower and fight as a melee warrior
9. Meteorologist — Control weather (Storm/Blizzard/Drought) for status effects
10. Shepherd — Cannot cast damage spells, but support spells are 30% more powerful
11. Psychopath — Spells deal 30% extra damage to own defenders; need 70% dead to win

**Spells (32):** Magic Missile, Fireball, Disintegrate, Chain Lightning, Black Hole, Meteor Fall, Squall, Finger of Death, Lightning Rod, Wall of Fire, Sleep, Entangle, Polymorph, Banishment, Mind Control, Wall of Stone, Telekinesis, Spike Growth, Grease, Guardian Circle, Healing Plume, Teleport, Haste, Berserker Rage, Mark of Death, Raise The Dead, Battle Hymn, Fog Cloud, Dispel, Arcane Crystal, Plague Wind. Each has a 9-talent tree (3 tiers).

**Boss enemies:** Ogre (charging enrage), Lich (raises undead), Hags (eye attacks), Dark Mage (telegraphed AoE spells). Rotate in endless mode.

**Enemy types:** Infantry, Archer, Assassin, Brute, Aerialist (flying), Commander, Shielder, Dispeller, Healer, Undead, Swordcerer.

**Defender units:** King, King's Guard, Infantry, Archer, Healer.

**Environmental systems:** Procedural terrain (trees, bushes, ponds, boulders), status effects (wet, cold, dry, burning, etc.), trampled ground/mud trails, seeded generation.

---

## Site Sections (single page, smooth scroll)

### 1. Navigation
Fixed top bar. Links: About, Features, Wizards, Screenshots, Links.
Transparent over hero, becomes solid dark background on scroll (achievable with CSS `position: sticky` and a solid background).

### 2. Hero
Full viewport height. Game title "COURT WIZARD" in Cinzel Decorative with arcane glow pulse animation. Tagline: *"Defend your kingdom with arcane power."*

Two CTA buttons:
- "Wishlist on Steam" — disabled/placeholder, links to `#`
- "View Source" — GitHub placeholder, links to `#`

Subtle fog animation layer behind the text.

### 3. About
The human story. Two columns on desktop (text left, placeholder key art right). Stacks on mobile.

Copy direction: Started as a hobby project — one developer learning Rust and game development. Built with Rust and the Bevy engine. Grew into something more. Now the first title from Blackhearth Games, an indie studio.

Use a parchment-textured panel for this section to contrast with the dark theme.

### 4. Features
2x3 grid of feature cards with glowing animated borders:

| Card | Headline | Subtext |
|------|----------|---------|
| 1 | 11 Wizard Archetypes | From the Rune Caster to the Meteorologist — every wizard plays differently |
| 2 | 32 Spells with Talent Trees | 9 talents per spell across 3 tiers — master your arsenal |
| 3 | Roguelite Campaign | 25 levels, seeded runs, and difficulty sliders — every run is different |
| 4 | Endless Mode | Infinitely scaling progression with per-wizard tracking |
| 5 | Boss Fights | Ogre, Lich, Hags, and Dark Mage — each with unique mechanics |
| 6 | Multiplayer | Peer-to-peer real-time co-op — no servers required |

### 5. Wizards Showcase
Grid of 11 wizard archetype cards. Each card has:
- Placeholder portrait area
- Wizard name (MedievalSharp font)
- Short flavor text (1 sentence describing playstyle)
- Glowing hover effect

### 6. Screenshots
Simple gallery grid — 6 placeholder slots. CSS-only lightbox using `:target` pseudo-class or checkbox hack for click-to-expand.

### 7. Footer
Links: Steam (placeholder `#`), GitHub (placeholder `#`), Blackhearth Games (placeholder `#`).
Copyright line: "2026 Blackhearth Games. All rights reserved."
Small studio logo placeholder.

---

## File Structure

```
court-wizard-website/
├── index.html
├── css/
│   └── styles.css
├── images/
│   ├── screenshots/        # 6 placeholder slots
│   ├── wizards/             # 11 archetype placeholder slots
│   ├── hero-bg.png          # Hero background placeholder
│   ├── logo.png             # Game logo placeholder
│   └── studio-logo.png      # Blackhearth Games logo placeholder
└── favicon.ico              # Placeholder
```

---

## Design System

### Color Palette

```css
:root {
  --bg-deepest:      #090A0F;   /* Page background */
  --bg-surface:      #1a1a2e;   /* Cards, nav, sections */
  --bg-surface-alt:  #16213e;   /* Alternating sections */
  --parchment:       #f8f0e0;   /* About panel background */
  --parchment-dark:  #e8daba;   /* Parchment edges/gradient */
  --gold:            #c9a84c;   /* Borders, headings, highlights */
  --purple:          #7209b7;   /* Glows, links, magical effects */
  --violet:          #3a0ca3;   /* Deeper glow layers */
  --lavender:        #9d4edd;   /* Hover states */
  --text-primary:    #e8d5b5;   /* Body text on dark */
  --text-secondary:  #6b6e7f;   /* Captions, muted text */
  --text-on-light:   #2a1b12;   /* Text on parchment */
}
```

### Typography (Google Fonts)

```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cinzel:wght@400;600;700&family=Cardo:ital,wght@0,400;0,700;1,400&family=MedievalSharp&display=swap');
```

| Font | Weight | Usage |
|------|--------|-------|
| Cinzel Decorative | 700 | Game title in hero only |
| Cinzel | 600, 700 | Section headings |
| Cardo | 400, 400i, 700 | Body text |
| MedievalSharp | 400 | Wizard names, decorative accents |

### CSS Effects

**Arcane glow pulse** (hero title):
```css
@keyframes arcane-pulse {
  0%, 100% {
    text-shadow:
      0 0 4px #fff,
      0 0 11px var(--gold),
      0 0 19px var(--gold),
      0 0 40px var(--purple),
      0 0 80px var(--purple);
  }
  50% {
    text-shadow:
      0 0 2px #fff,
      0 0 6px var(--gold),
      0 0 10px var(--gold),
      0 0 20px var(--purple),
      0 0 45px var(--purple);
  }
}
```

**Rotating gradient border** (feature cards):
```css
@property --glow-angle {
  inherits: false;
  initial-value: 0deg;
  syntax: "<angle>";
}

@keyframes rotate-glow {
  to { --glow-angle: 360deg; }
}

.feature-card {
  border: 3px solid transparent;
  background:
    linear-gradient(var(--bg-surface), var(--bg-surface)) padding-box,
    conic-gradient(from var(--glow-angle), var(--purple), var(--gold), var(--violet), var(--purple)) border-box;
  animation: rotate-glow 3s linear infinite;
}
```

**Parchment texture** (About section):
```css
.parchment {
  background-color: var(--parchment);
  background-image:
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.05"/></svg>'),
    radial-gradient(circle at center, var(--parchment), var(--parchment-dark));
  box-shadow:
    inset 0 0 20px rgba(0, 0, 0, 0.1),
    inset 0 0 3px rgba(0, 0, 0, 0.1);
}
```

**Fog drift** (hero background):
```css
.fog-layer {
  position: absolute;
  width: 200%;
  height: 100%;
  opacity: 0.15;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(100, 100, 120, 0.15) 25%,
    rgba(100, 100, 120, 0.25) 50%,
    rgba(100, 100, 120, 0.15) 75%,
    transparent 100%
  );
  animation: drift-fog 30s linear infinite;
}

@keyframes drift-fog {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
```

**Card hover glow**:
```css
.card:hover {
  box-shadow:
    0 0 20px var(--lavender),
    0 0 40px var(--purple),
    0 0 60px var(--violet),
    inset 0 0 25px rgba(114, 9, 183, 0.15);
}
```

**Accessibility — reduced motion**:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Responsive Breakpoints

- Desktop: 1200px+ (default layout)
- Tablet: 768px–1199px (2-column features, stacked About)
- Mobile: <768px (single column, hamburger nav via checkbox hack)

---

## Implementation Order

1. Create `index.html` with all semantic sections and placeholder content
2. Create `css/styles.css` with CSS variables, reset, base styles
3. Style hero section with fog and glow title
4. Style nav with sticky behavior
5. Style About section with parchment texture
6. Style feature cards grid with animated borders
7. Style wizard showcase cards
8. Style screenshot gallery with CSS lightbox
9. Style footer
10. Add responsive media queries
11. Add reduced motion media query
12. Add placeholder images (colored SVG rectangles with text)

## Verification

- Open `index.html` directly in browser — works without a server
- Check responsive at 320px, 768px, 1200px widths
- Toggle `prefers-reduced-motion` in dev tools — animations stop
- All placeholder links go to `#` with clear "coming soon" indicators
- Validate HTML at validator.w3.org

## Out of Scope (future)

- Real screenshots and art assets
- Steam widget / iframe integration
- Analytics (add when live)
- Full SEO meta tags (add when content is final)
- Contact form
- Cookie consent (no cookies on static site)
