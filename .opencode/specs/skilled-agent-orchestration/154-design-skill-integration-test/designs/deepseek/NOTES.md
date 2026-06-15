# Design Notes — DeepSeek v4 Pro

Three self-contained HTML designs built against the sk-interface-design process: ground in the subject, derive a distinctive token system that avoids the templated AI default for that category, build, and self-critique against the quality floor.

---

## 1. Meridian Roasters — Landing Page

**Subject grounding:** Meridian Roasters is a small-batch coffee roaster in Portland, Oregon. The audience is coffee enthusiasts who care about origin, roast profile, and craft. The page's single job is to introduce the brand and drive purchases of three featured single-origin coffees.

**Token system:**
- **Palette:** #1E293B steel midnight (headers), #F8FAFC mist (page background), #FFFFFF (card surfaces), #2D5A27 conifer green (CTAs and highlights), #64748B bridge grey (secondary text), #0F172A near-black (body text), #E2E8F0 cloud (dividers and subtle borders).
- **Type:** System sans-serif stack throughout. The brand wordmark is set tight and uppercase for a technical, precise feel. Body type is comfortable at 16px and up, with generous line-height. The type treatment itself, rather than a decorative display face, carries the personality through tracking, weight contrast, and scale.
- **Layout:** Full-bleed hero with the brand thesis in oversized type ("COFFEE THAT KNOWS WHERE IT'S FROM"). Below, a three-column product grid where each single-origin coffee is presented as a precision "roast spec sheet" with origin, altitude, process, and roast date laid out like technical data, not a tasting-menu card. Concise footer with location and ethos.
- **Motion:** A single scroll-triggered fade-up on the product grid cards. Reduced motion: cards appear immediately with no animation.

**AI default deliberately avoided:** The warm cream background with serif display and terracotta accent (the "coffee-shop default"). This design uses a cold Pacific Northwest steel-and-mist palette, conifer green as the accent, and precision industrial typography. The only warmth comes from the product copy and the roasted bean imagery implied in the descriptions, not from warm brown page chrome.

**Self-critique against quality floor:** The conifer green accent (#2D5A27) clears 4.5:1 contrast against the mist background on large text but is borderline on smaller UI elements. The primary CTA button uses the green on white card surfaces, which clears the bar. Responsive at 320px the three-column grid stacks to a single column, the hero type scales down without breaking, and no horizontal scroll appears. Focus rings are visible on all interactive elements. The risk is that the cold palette reads as sterile for a food product; the copy must carry the warmth. The signature, the "roast spec sheet" product cards, earns its place because it transforms a generic coffee-feature-list into something that teaches the buyer something true about each origin.

---

## 2. Wavelength — Pricing Page

**Subject grounding:** Wavelength is an indie podcast-hosting tool for independent podcasters and small to mid-size creators. The page's single job is to present three pricing tiers so the middle tier (Professional) is the clear best choice, and drive signups.

**Token system:**
- **Palette:** #0C4A6E broadcast navy (page background), #FFFFFF (text on dark surfaces), #06B6D4 cyan (interactive elements and tier highlights), #F97316 signal orange (CTA buttons, the "RECOMMENDED" badge, the one "live on air" indicator), #155E75 darker cyan-mid (feature checkmarks), #0A2A40 deep navy (cards and headers), #E2E8F0 (subtle text on light surfaces only).
- **Type:** System sans-serif throughout. Tier prices are set large (48px on desktop) as the visual anchor of each column. Feature text is set at 14px with generous spacing. The price number itself is the display element; there is no separate display face.
- **Layout:** Three columns bound in a single connected container with subtle border separators, not three floating cards with drop shadows. The Professional tier column is wider and capped with the signal orange "RECOMMENDED" badge styled like a recording indicator light. On mobile, the columns stack vertically with Professional always positioned second, between Starter and Enterprise.
- **Motion:** The waveform lines above each tier price animate on page load as one orchestrated moment: Starter gets a simple sine, Professional a balanced complex wave, Enterprise the densest waveform. Reduced motion: the waveforms render as static lines.

**AI default deliberately avoided:** The generic purple-gradient three-card SaaS pricing page. This design uses a recording-studio navy backdrop, cyan and signal orange as the accent pair (not purple), and the tiers are rendered as connected audio channel strips with waveform comparison lines, not as isolated elevation cards. It also avoids the near-black + single acid-accent default by using cyan as the primary interactive color and orange as the deliberate warm counterpoint.

**Self-critique against quality floor:** White text (#FFFFFF) on broadcast navy (#0C4A6E) clears 4.5:1 contrast at all sizes. Signal orange CTA buttons on navy clear 3:1 for large UI elements. Feature checkmarks use cyan, which meets AA for icons at the size used. The tier columns stack cleanly on mobile and each CTA button is a minimum 44x44px touch target. Focus rings are visible and distinct on all interactive elements. The risk is that the navy background may feel intense on a bright screen; the design compensates with generous whitespace and the cyan highlights to keep it lively rather than heavy.

---

## 3. Wattbird — Dashboard

**Subject grounding:** Wattbird is a home energy monitor that shows real-time usage, daily cost estimates, and per-circuit breakdowns. The audience is homeowners and energy-conscious individuals who want to understand and reduce consumption. The page's single job is to give an at-a-glance picture of home energy use and cost, with enough detail to act on.

**Token system:**
- **Palette:** #F5F5F0 warm appliance white (page background), #FFFFFF (card surfaces), #1E293B slate (primary text), #64748B secondary grey, #16A34A energy green (low usage and savings), #F59E0B energy amber (moderate usage), #DC2626 alert red (high usage, used sparingly as a signal), #E2E8F0 (card borders), #0F172A (the gauge ring stroke). Semantic colors for energy states are the core of the palette; the chrome stays neutral.
- **Type:** System sans-serif throughout. The main "Now" usage number is set at 72px on desktop as the hero data point, legible from across a room. Circuit labels and breakdown numbers use a smaller but clear 14px with adequate spacing. A monospace stack (ui-monospace) is used for precise numeric data in the circuit breakdown table.
- **Layout:** Two-column on desktop: left column holds the hero radial usage gauge and the daily cost estimate. Right column holds per-circuit breakdown cards in a 2x2 grid plus a 24-hour usage timeline bar chart. On mobile, everything stacks vertically with the gauge on top.
- **Motion:** The radial gauge arc draws in on page load over 800ms using SVG stroke-dashoffset animation. Reduced motion: the arc appears at its final value instantly. No hover animations on data; the focus stays on readability.

**AI default deliberately avoided:** The generic dark-mode neon-charts dashboard. This design uses a warm domestic appliance-white background, not near-black. The color coding for energy states uses natural green-to-red semantics rather than acid-neon on dark. The gauge is a physical-feeling radial readout, not a glowing donut chart. The entire interface feels like a premium smart-home thermostat display, not a spaceship console or a crypto trading dashboard.

**Self-critique against quality floor:** All text colors clear 4.5:1 against their backgrounds. The energy green (#16A34A) on white cards reaches 3.5:1 (passes for large text, borderline for body). The amber (#F59E0B) on white is borderline at 2.4:1 for small text, so amber is used only on large numbers or with an accompanying text label. The circuit breakdown uses color bars plus text labels so meaning is never encoded in color alone. The 24-hour bar chart uses distinct bar borders plus fill so the data is legible without relying on hue. Touch targets on the circuit filter buttons are 44px minimum. Keyboard navigation is fully supported with visible focus rings. On mobile at 320px, the two-column layout collapses cleanly, the gauge scales proportionally, and no horizontal scroll is needed. The main risk is that the light-background dashboard is less common and may initially surprise users expecting dark data interfaces; the design validates by being genuinely more readable in lit rooms (which is where people check energy usage). The bar chart SVG provides its data in an accessible table below it for screen readers.
