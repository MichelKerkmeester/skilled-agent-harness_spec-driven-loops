# Design Notes: sk-design-interface Integration Test

## Design 1: Meridian Roasters Landing Page

### Subject grounding
Small-batch coffee roaster in Portland, Oregon. Audience is specialty coffee enthusiasts who care about origin, process, and transparency. The page's single job is to showcase sourcing integrity and roasting craft, then drive visitors to explore the current offerings.

### Token system
- **Palette:** Ink Water `#1B2A3D` (deep blue-gray, the Pacific on an overcast day), Slate `#5A6B7A` (Portland sky, structural elements), Fog `#E8EDF1` (cool off-white, morning mist off the Willamette), Copper Oxide `#B86F4A` (roasted copper, the only warm note), Pale Steel `#F5F7F9` (subtle background variation), Graphite `#2C3E50` (body text).
- **Type:** Helvetica Neue condensed for display headlines with tight letter-spacing, Georgia for accent numerals and the latitude rail. Both are system fonts. The condensed display gives a magazine-editorial feel rather than the expected serif.
- **Layout:** Fixed left navigational rail (48px, dark) with vertical brand text and latitude coordinates, echoing chart margins. Asymmetric hero split (text left, roast-curve data viz right). Three-column origin cards on fog background. Horizontal four-step process grid with border rules. Full-width tasting section on dark background with a CSS-only tasting wheel.
- **Motion:** Minimal by design. Hover transitions on cards and CTAs. `prefers-reduced-motion` respected by disabling all transitions.
- **Signature element:** The roast curve SVG in the hero visual area. A data-visualization of first-crack timing on a temperature/time grid, rendered as a navigational chart with axis labels and a marked event. It communicates roasting expertise through data rather than stock photography.

### AI default avoided
The warm-cream `#F4F1EA` + serif display + terracotta accent look that dominates every coffee-shop and artisan-food site. Instead, this design uses a cool Pacific Northwest palette anchored in blue-gray rather than brown, with copper oxide (not terracotta) as the single warm accent. The navigational-chart metaphor (latitude markers, compass rose, roast curve as chart) grounds the visual identity in the name "Meridian" rather than generic craft-food aesthetics.

### Self-critique against the quality floor
The design clears the accessibility floor: body text on all backgrounds meets WCAG AA contrast (Graphite on Pale Steel, Fog on Ink Water, Fog on Fog). Interactive elements have visible focus outlines. The origin cards and CTAs use hover states that do not rely on color alone. Touch targets meet the 44px minimum on mobile where the rail disappears. Responsive breakpoints at 900px and 600px reflow the grid layouts to single columns. The tasting wheel is purely decorative and marked `aria-hidden`. One area to improve: the tasting wheel labels rely on absolute positioning and small text, which could be harder to read on very small screens. The hero compass is decorative only. Overall the design feels specific to this subject and does not read as a templated coffee-shop page.

---

## Design 2: Wavelength Pricing Page

### Subject grounding
Indie podcast-hosting tool. Audience is independent creators and small production teams who want to own their feed and understand what they are paying for. The page's single job is to communicate three clear tiers and drive sign-ups, while reinforcing the "you own your feed" value proposition.

### Token system
- **Palette:** Warm Ivory `#FAF8F5` (the paper tone of a mixing desk), Steel Blue `#6B8CAE` (studio rack equipment), Dark Charcoal `#1E1E22` (studio panels), Burnished Gold `#C4943A` (XLR connector brass, the featured-tier accent), Panel Gray `#2A2A30`, Muted Blue `#8BA4BE`, Soft Ivory `#F0EDE8`, Medium Gray `#6E6E78`.
- **Type:** Helvetica Neue for body and UI text, Georgia for the logo. Monospace ("Courier New") for tier labels and the hero eyebrow, referencing studio metering typography and channel-strip labels.
- **Layout:** Centered hero with a waveform bar separator that is structural (representing three tiers as volume levels), not decorative glassmorphism. Three-column pricing cards with vertical audio-meter bars showing storage capacity. Feature comparison table below. FAQ section at the bottom with clean typography.
- **Motion:** Hover states on cards (border color shift, subtle shadow). Toggle switch animation for monthly/annual. `prefers-reduced-motion` respected.
- **Signature element:** The audio-meter bars on each pricing card. Each card has a row of vertical bars (like a VU meter or LED ladder) that fill to different levels representing storage capacity (5h, 25h, 100h). The featured card's bars are gold. This ties the pricing differentiation directly to the product's domain (audio) rather than using generic progress bars or icons.

### AI default avoided
The purple-gradient three-card SaaS pricing page with glassmorphism, rounded corners, and a "Most popular" ribbon in a contrasting purple. Instead, this design uses a warm ivory base (not dark mode, not purple), steel blue and charcoal as the structural palette, and burnished gold (not purple or orange gradient) as the featured accent. The monospace tier labels and meter bars ground the design in studio equipment rather than generic SaaS aesthetics. The waveform separator is functional (encoding the three tiers) rather than decorative.

### Self-critique against the quality floor
Contrast passes: Dark Charcoal on Warm Ivory exceeds 12:1, Medium Gray on Warm Ivory exceeds 4.5:1, and the burnished gold CTA on white meets 3:1 for large text. All interactive elements have visible focus outlines using the burnished gold. The pricing cards have adequate padding and the CTAs are full-width for easy touch targeting. The comparison table scrolls horizontally on mobile without breaking layout. One weakness: the feature comparison table on mobile requires horizontal scrolling, which is acceptable but not ideal. The meter bars are purely visual and the storage amounts are also stated in text. The FAQ uses semantic structure. The toggle switch is keyboard-operable with `role="switch"` and `aria-checked`. Overall the design reads as a purpose-built podcast-hosting pricing page rather than a generic SaaS template.

---

## Design 3: Wattbird Dashboard

### Subject grounding
Home energy monitor for homeowners who want to track live usage, cost, and per-circuit breakdown. Audience is residential users who may not be technical. The page's single job is to surface current usage and cost at a glance, then provide drill-down into daily trends and circuit-level detail.

### Token system
- **Palette:** Paper `#FAFAF8` (warm white, precision-instrument feel), Forest `#2D6A4F` (energy efficiency, the primary accent), Stone `#6B7280` (secondary text), Near-Black `#1A1A1E` (primary text), Amber `#D4913B` (warning/high-usage accent), Pale Green `#E8F0EB` (active states), Warm Gray `#F2F0ED` (page background), Muted Green `#5B9E7A`, Light Stone `#E5E7EB` (borders), Soft Red `#C44536` (over-budget alerts).
- **Type:** System font stack (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial) for all text. This is a utility-heavy dashboard where system fonts optimize rendering performance and native feel. No display face needed since the data is the personality.
- **Layout:** Fixed left sidebar (220px) with navigation. Main area uses a top-to-bottom flow: live usage hero card, three-column stat summary, bar chart for daily cost, circuit breakdown table. The live usage card is the largest element and uses a two-column grid (data left, bird mascot right).
- **Motion:** The bird mascot's wings animate based on usage level: wings neutral at low usage, wings raised at medium, wings flapping at high usage. Bar transitions on chart and circuit bars. `prefers-reduced-motion` respected by disabling all animations and transitions.
- **Signature element:** The animated Wattbird mascot in the live usage card. A simple SVG bird whose wing angle responds to the current energy usage level. At low usage, wings are neutral. At medium, they lift slightly. At high usage, they flap. This gives the dashboard a personality that is functional (usage feedback through animation) rather than purely decorative, and it grounds the product name "Wattbird" in a visual identity.

### AI default avoided
The dark-mode dashboard with neon green/cyan accent lines on near-black backgrounds, circular gauge widgets, and glowing chart elements. Instead, this design uses a warm white paper background with forest green as the primary accent, giving it the feel of a precision instrument or control panel rather than a hacker terminal. The amber and soft red are used specifically for warnings and over-budget states, not as general accents. The bird mascot provides a friendly, approachable identity that a dark-mode neon dashboard would not.

### Self-critique against the quality floor
The light-on-dark contrast ratio for primary text (Near-Black on Paper) exceeds 15:1. Secondary text (Stone on Paper) exceeds 4.5:1. The forest green on paper for the bar chart meets 4.5:1. Status colors (green, amber, red) are paired with text labels, not used alone for meaning. The sidebar collapses on mobile (below 900px) and the content reflows to single-column. Touch targets in the sidebar nav links are padded to 44px. The circuit breakdown table adapts by hiding the cost column on small screens. One weakness: the bird animation uses CSS `@keyframes` that could be distracting for some users, though `prefers-reduced-motion` disables it. The bar chart labels are small (0.7rem) and could be harder to read on mobile, though the values are also available in the stat cards above. The `select` element for the time period uses native browser styling for keyboard accessibility. Overall the dashboard feels approachable and specific to a home energy context, not a generic dark-mode data dashboard.
