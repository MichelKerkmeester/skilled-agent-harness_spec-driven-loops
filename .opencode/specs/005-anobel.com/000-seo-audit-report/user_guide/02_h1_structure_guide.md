# H1 Header Structure SEO Fix Guide for anobel.com

> Detailed guide for fixing H1 non-sequential and Title Same as H1 issues identified in the SEO audit.

---

## Executive Summary

### Issues Identified

| Issue | Severity | Pages Affected | Impact |
|-------|----------|----------------|--------|
| **H1 Non-Sequential** | High | 59 pages (100%) | H2s appear before H1 in DOM order |
| **Title Same as H1** | Medium | 18 pages (31%) | Missed keyword opportunity |
| **Empty H1 Tags** | High | 15+ pages | No primary heading for SEO |

### What "H1 Non-Sequential" Means

In proper HTML semantic structure, the H1 should be the **first heading** encountered in the document's DOM (reading) order. On anobel.com:

```
CURRENT (Problematic):
<body>
  <nav>...</nav>
  <dialog>
    <h2>Cookie Settings</h2>  <!-- H2 appears FIRST -->
  </dialog>
  <main>
    <section id="hero">
      <h1>Page Title</h1>      <!-- H1 appears SECOND -->
    </section>
  </main>
</body>

CORRECT:
<body>
  <nav>...</nav>
  <dialog aria-hidden="true">
    <div role="heading">Cookie Settings</div>  <!-- Not a heading tag -->
  </dialog>
  <main>
    <section id="hero">
      <h1>Page Title</h1>      <!-- H1 is FIRST heading -->
    </section>
  </main>
</body>
```

---

## Root Cause Analysis

### 1. Cookie Consent Modal Contains H2

**Location in Webflow:** Symbol named "Cookie Consent" or "Modal - Cookie"

**Current HTML:**
```html
<div class="modal--dialog is--cookie">
  <div class="modal--header">
    <h2 class="u--text-size-inherit u--text-wrap-balance w-dyn-bind-empty"></h2>
  </div>
</div>
```

This H2 appears at approximately line 3253 in all pages, while the H1 in the hero section appears around line 4321+ (varies by page).

### 2. Empty H1 Tags Bound to CMS

**Location in Webflow:** Hero section component, bound to CMS field

**Current HTML:**
```html
<section id="hero" aria-label="Hero" data-target="hero-section" class="hero--section">
  <div class="heading is--hero-video">
    <h1 class="u--text-size-inherit u--text-wrap-balance w-dyn-bind-empty"></h1>
  </div>
</section>
```

The `w-dyn-bind-empty` class indicates CMS content is not rendering. This could be:
- Missing CMS field binding
- Empty CMS collection field
- Conditional visibility hiding the content

### 3. Title Same as H1

When the `<title>` tag and H1 are identical, you miss SEO opportunities:
- Title should be optimized for search results (include brand, keywords)
- H1 should be optimized for on-page readability

---

## Page-by-Page Analysis

### Legend
- **URL**: Page location (NL version shown; EN follows same pattern)
- **Title Tag**: What appears in browser tab and search results
- **Current H1**: What the H1 contains (or "EMPTY" if CMS not binding)
- **First Heading in DOM**: The heading that appears first in source order

---

## CMS Template H1 Issues

### Blog Template (`detail_blog.html`)

**Current State (Line 4573):**
```html
<h1 fs-socialshare-element="content" class="u--text-size-inherit u--text-wrap-break-word u--text-wrap-balance w-dyn-bind-empty"></h1>
```

**Problem:** The `w-dyn-bind-empty` class indicates the CMS binding exists but has no content in the exported static file. The H1 appears empty to crawlers analyzing the template.

**Additional H6 Issues (Wrong heading level):**
Lines 5092, 5329, 5348, 5354, 5360, 5366 all have:
```html
<h6 class="w-dyn-bind-empty"></h6>
```
Using H6 for subheadings in blog content is semantically incorrect - should be H2/H3.

**Fix in Webflow:**
1. Select the H1 element in the hero section
2. Verify CMS binding to `Post Title` field
3. Ensure the element is NOT set to `display: none` or conditional visibility
4. For H6 tags: Change tag from H6 to H2 or H3 in Webflow Settings > Tag

### Vacature Template (`detail_vacatures.html`)

**Current State (Line 5285):**
```html
<h1 class="u--text-size-inherit u--text-wrap-balance w-dyn-bind-empty"></h1>
```

**Problem:** Same issue - the `w-dyn-bind-empty` class indicates no CMS binding or empty field:
- No primary heading for the page
- Critical ranking signal missing
- Screen readers have no page context

**Additional Empty Headings:**
| Line | Heading | Class | Issue |
|------|---------|-------|-------|
| 4128 | `<h2>` | `w-dyn-bind-empty` | Modal heading |
| 4406 | `<h2>` | `w-dyn-bind-empty` | Modal success heading |
| 5689-5711 | `<h6>` (6x) | `w-dyn-bind-empty` | Section headings |
| 6027 | `<h2>` | `w-dyn-bind-empty` | CMS content |
| 6323 | `<h2>` | `w-dyn-bind-empty` | CMS content |
| 6425 | `<h2>` | `w-dyn-bind-empty` | Related content |

**Fix in Webflow:**
1. Select the H1 element (currently empty at line 5285)
2. In Element Settings panel, click "Get text from..."
3. Select "Naam" (Job Title) from CMS fields
4. Publish and verify the `w-dyn-bind-empty` class is removed
- **Issue**: What needs fixing
- **Recommended H1**: Suggested replacement

---

## Homepage (`index.html`)

| Field | Value |
|-------|-------|
| **URL** | `anobel.com` |
| **Title Tag** | "A. Nobel & Zn - Uw maritieme totaalleverancier" |
| **Current H1** | EMPTY (CMS bound, not rendering) |
| **First H2 in DOM** | Cookie modal H2 (line 3253) |
| **Issue** | H1 is empty; H2 appears before H1 |

### Recommended Fix

**New H1 Text:**
```
Uw Maritieme Totaalleverancier
```

**Why different from title:**
- Title includes company name for branding
- H1 focuses on value proposition for page content

**Webflow Steps:**
1. Open Designer > Pages > Home
2. Navigate to Hero section (use Navigator panel)
3. Find the `<h1>` element with class `heading is--hero-video`
4. Check if CMS binding exists:
   - If bound: Check CMS collection for empty field
   - If not bound: Add static text or bind to correct CMS field
5. Enter: "Uw Maritieme Totaalleverancier"

---

## Contact Page (`contact.html`)

| Field | Value |
|-------|-------|
| **URL** | `anobel.com/contact` |
| **Title Tag** | "Contact \| A. Nobel & Zn. - 6 dagen per week geopend" |
| **Current H1** | EMPTY (CMS bound, not rendering) |
| **First H2 in DOM** | Cookie modal H2 (line 3921) |
| **Issue** | H1 is empty; H2 appears before H1 |

### Recommended Fix

**New H1 Text:**
```
Contact Nobel - 6 Dagen Per Week Bereikbaar
```

**Why different from title:**
- Title uses brand pattern with pipe separator
- H1 is a direct, actionable statement

**Webflow Steps:**
1. Open Designer > Pages > Contact
2. Navigate to Hero section (`#hero--title`)
3. Find the `<h1>` element (around `div.heading.is--hero`)
4. Enter: "Contact Nobel - 6 Dagen Per Week Bereikbaar"

---

## Blog Page (`blog.html`)

| Field | Value |
|-------|-------|
| **URL** | `anobel.com/blog` |
| **Title Tag** | "Blog \| A. Nobel & Zn. - Lees en ontdek meer" |
| **Current H1** | EMPTY (CMS bound, not rendering) |
| **First H2 in DOM** | Cookie modal H2 (line 3758), then "Blog & Updates" (line 5117) |
| **Issue** | H1 is empty; Multiple H2s appear before H1 |

### Recommended Fix

**New H1 Text:**
```
Nobel Blog - Maritiem Nieuws & Updates
```

**Note:** There's already an H2 "Blog & Updates" at line 5117. Consider:
- Make the H1 more descriptive
- Change "Blog & Updates" H2 to a different heading or paragraph

**Webflow Steps:**
1. Open Designer > Pages > Blog
2. Navigate to Hero section
3. Find the `<h1>` element
4. Enter: "Nobel Blog - Maritiem Nieuws & Updates"
5. **Also:** Find the H2 "Blog & Updates" and change to `<p>` with styled class

---

## Brochures Page (`brochures.html`)

| Field | Value |
|-------|-------|
| **URL** | `anobel.com/brochures` |
| **Title Tag** | "Brochures \| A. Nobel & Zn. - Alle info binnen handbereik" |
| **Current H1** | EMPTY (CMS bound, not rendering) |
| **First H2 in DOM** | Cookie modal H2 (line 3265) |
| **Issue** | H1 is empty; H2 appears before H1 |

### Recommended Fix

**New H1 Text:**
```
Download Onze Brochures
```

**Webflow Steps:**
1. Open Designer > Pages > Brochures
2. Navigate to Hero section
3. Find the `<h1>` element
4. Enter: "Download Onze Brochures"

---

## Voorwaarden (Terms) Page (`voorwaarden.html`)

| Field | Value |
|-------|-------|
| **URL** | `anobel.com/voorwaarden` |
| **Title Tag** | "Voorwaarden \| A. Nobel & Zn. - Transparantie sinds 1966" |
| **Current H1** | EMPTY (CMS bound, not rendering) |
| **First H2 in DOM** | Cookie modal H2 (line 3297) |
| **Issue** | H1 is empty; H2 appears before H1 |

### Recommended Fix

**New H1 Text:**
```
Algemene Voorwaarden A. Nobel & Zn.
```

**Why different from title:**
- Title emphasizes brand value ("Transparantie sinds 1966")
- H1 is a clear, descriptive page header

**Webflow Steps:**
1. Open Designer > Pages > Voorwaarden
2. Navigate to Hero section
3. Find the `<h1>` element
4. Enter: "Algemene Voorwaarden A. Nobel & Zn."

---

## Webshop Page (`webshop.html`)

| Field | Value |
|-------|-------|
| **URL** | `anobel.com/webshop` |
| **Title Tag** | "Ontdek de Nobel Webshop - De maritieme totaaloplossing" |
| **Current H1** | EMPTY (CMS bound, not rendering) |
| **First H2 in DOM** | Cookie modal H2, then "Uw maritieme totaaloplossing." (line 4729) |
| **Issue** | H1 is empty; H2 appears before H1; **Dutch content on potentially EN page** |

### Recommended Fix

**New H1 Text:**
```
Nobel Webshop - Shop Maritieme Producten Online
```

**Critical Note:** The H2 "Uw maritieme totaaloplossing." and "Een systeem, vele mogelijkheden." appear in Dutch. If this is the EN page, these need translation.

**Webflow Steps:**
1. Open Designer > Pages > Webshop
2. Navigate to Hero section
3. Find the `<h1>` element
4. Enter: "Nobel Webshop - Shop Maritieme Producten Online"
5. **Also:** Verify language locale settings for this page

---

## Team Page (`team.html`)

| Field | Value |
|-------|-------|
| **URL** | `anobel.com/team` |
| **Title Tag** | "Het Team \| A. Nobel & Zn. - Een team, een koers." |
| **Current H1** | EMPTY (CMS bound, not rendering) |
| **First H2 in DOM** | Cookie modal H2 (line 3204) |
| **Issue** | H1 is empty; H2 appears before H1 |

### Recommended Fix

**New H1 Text:**
```
Maak Kennis met Het Nobel Team
```

**Webflow Steps:**
1. Open Designer > Pages > Team
2. Navigate to Hero section
3. Find the `<h1>` element
4. Enter: "Maak Kennis met Het Nobel Team"

---

## Dit is Nobel (About) Page (`dit-is-nobel.html`)

| Field | Value |
|-------|-------|
| **URL** | `anobel.com/dit-is-nobel` |
| **Title Tag** | "Dit is Nobel - Meer dan 50 jaar maritieme kennis" |
| **Current H1** | EMPTY (CMS bound, not rendering) |
| **First H2 in DOM** | Cookie modal H2, then "Alle expertise op een locatie." (line 4679) |
| **Issue** | H1 is empty; H2 appears before H1 |

### Recommended Fix

**New H1 Text:**
```
Dit is Nobel - Meer dan 50 Jaar Maritieme Expertise
```

**Note:** The title and H1 are similar here, which is acceptable for brand pages. To differentiate:
- Title: "Dit is Nobel - Meer dan 50 jaar maritieme kennis"
- H1: "Ontdek Nobel - Uw Maritieme Partner Sinds 1966"

**Webflow Steps:**
1. Open Designer > Pages > Dit is Nobel
2. Navigate to Hero section
3. Find the `<h1>` element
4. Enter preferred H1 text

---

## Maatwerk (Customization) Page (`maatwerk.html`)

| Field | Value |
|-------|-------|
| **URL** | `anobel.com/maatwerk` |
| **Title Tag** | "Maatwerk \| A. Nobel & Zn. - Maritieme oplossingen op maat" |
| **Current H1** | EMPTY (CMS bound, not rendering) |
| **First H2 in DOM** | Cookie modal H2 (line 3265) |
| **Issue** | H1 is empty; H2 appears before H1 |

### Recommended Fix

**New H1 Text:**
```
Maritiem Maatwerk - Oplossingen Op Maat
```

**Webflow Steps:**
1. Open Designer > Pages > Maatwerk
2. Navigate to Hero section
3. Find the `<h1>` element
4. Enter: "Maritiem Maatwerk - Oplossingen Op Maat"

---

## Scheepsuitrusting (Equipment) Page (`scheepsuitrusting.html`)

| Field | Value |
|-------|-------|
| **URL** | `anobel.com/scheepsuitrusting` |
| **Title Tag** | "Scheepsuitrusting \| A. Nobel & Zn. - Alle benodigdheden voor aan boord" |
| **Current H1** | EMPTY (CMS bound, not rendering) |
| **First H2 in DOM** | Cookie modal H2 (line 3265) |
| **Issue** | H1 is empty; H2 appears before H1 |

### Recommended Fix

**New H1 Text:**
```
Scheepsuitrusting - Complete Maritieme Benodigdheden
```

**Webflow Steps:**
1. Open Designer > Pages > Scheepsuitrusting
2. Navigate to Hero section
3. Find the `<h1>` element
4. Enter: "Scheepsuitrusting - Complete Maritieme Benodigdheden"

---

## ISPS Page (`isps.html`)

| Field | Value |
|-------|-------|
| **URL** | `anobel.com/isps` |
| **Title Tag** | "ISPS \| A. Nobel & Zn. - Krijg toegang tot de ISPS-kade" |
| **Current H1** | EMPTY (CMS bound, not rendering) |
| **First H2 in DOM** | Cookie modal H2 (line 3280) |
| **Issue** | H1 is empty; H2 appears before H1 |

### Recommended Fix

**New H1 Text:**
```
ISPS-Kade - Veilige Toegang voor Scheepvaart
```

**Webflow Steps:**
1. Open Designer > Pages > ISPS
2. Navigate to Hero section
3. Find the `<h1>` element
4. Enter: "ISPS-Kade - Veilige Toegang voor Scheepvaart"

---

## Filtratie (Filtration) Page (`filtratie.html`)

| Field | Value |
|-------|-------|
| **URL** | `anobel.com/filtratie` |
| **Title Tag** | "Filtratie & Separatie \| A. Nobel & Zn. - Marktleider in filtratie" |
| **Current H1** | EMPTY (CMS bound, not rendering) |
| **First H2 in DOM** | Cookie modal H2 (line 3265) |
| **Issue** | H1 is empty; H2 appears before H1 |

### Recommended Fix

**New H1 Text:**
```
Filtratie & Separatie - Marktleider in Maritieme Filtratie
```

**Webflow Steps:**
1. Open Designer > Pages > Filtratie
2. Navigate to Hero section
3. Find the `<h1>` element
4. Enter: "Filtratie & Separatie - Marktleider in Maritieme Filtratie"

---

## Locatie (Location) Page (`locatie.html`)

| Field | Value |
|-------|-------|
| **URL** | `anobel.com/locatie` |
| **Title Tag** | "De Locatie \| A. Nobel & Zn. - Een ligging waar 'U' tegen wordt gezegd" |
| **Current H1** | EMPTY (CMS bound, not rendering) |
| **First H2 in DOM** | Cookie modal H2 (line 3266) |
| **Issue** | H1 is empty; H2 appears before H1 |

### Recommended Fix

**New H1 Text:**
```
Onze Locatie - Centraal Gelegen in Zwijndrecht
```

**Webflow Steps:**
1. Open Designer > Pages > Locatie
2. Navigate to Hero section
3. Find the `<h1>` element
4. Enter: "Onze Locatie - Centraal Gelegen in Zwijndrecht"

---

## Werken Bij (Careers) Page (`werkenbij.html`)

| Field | Value |
|-------|-------|
| **URL** | `anobel.com/werkenbij` |
| **Title Tag** | "Werken bij Nobel - Wereldwijd de maritieme sector in vaart houden" |
| **Current H1** | EMPTY (CMS bound, not rendering) |
| **First H2 in DOM** | Cookie modal H2 (line 3937) |
| **Issue** | H1 is empty; H2 appears before H1 |

### Recommended Fix

**New H1 Text:**
```
Werken bij Nobel - Bouw Mee aan de Maritieme Toekomst
```

**Webflow Steps:**
1. Open Designer > Pages > Werken Bij
2. Navigate to Hero section
3. Find the `<h1>` element
4. Enter: "Werken bij Nobel - Bouw Mee aan de Maritieme Toekomst"

---

## Scheepsbunkering (Bunkering) Page (`scheepsbunkering.html`)

| Field | Value |
|-------|-------|
| **URL** | `anobel.com/scheepsbunkering` |
| **Title Tag** | "Scheepsbunkering \| A. Nobel & Zn. - Wereldwijde bunkering" |
| **Current H1** | EMPTY (CMS bound, not rendering) |
| **First H2 in DOM** | Cookie modal H2 (line 3265) |
| **Issue** | H1 is empty; H2 appears before H1 |

### Recommended Fix

**New H1 Text:**
```
Scheepsbunkering - Wereldwijde Maritieme Brandstoffen
```

**Webflow Steps:**
1. Open Designer > Pages > Scheepsbunkering
2. Navigate to Hero section
3. Find the `<h1>` element
4. Enter: "Scheepsbunkering - Wereldwijde Maritieme Brandstoffen"

---

## Global Fix: Cookie Modal H2

This is the root cause of the "H1 Non-Sequential" issue on all 59 pages.

### The Problem

The cookie consent modal contains an H2 element that appears in the DOM before the hero section's H1. Even though the modal is visually hidden on page load, search engines read the DOM in order and see:

1. H2 (Cookie modal) - appears first
2. H1 (Hero section) - appears second

This violates heading hierarchy best practices.

### The Solution

**Option A (Recommended): Change H2 to DIV**

1. Open Webflow Designer
2. Go to **Symbols** panel (puzzle piece icon)
3. Find the Cookie Consent symbol
4. Select the H2 element inside the modal header
5. In **Settings** panel > **Tag** dropdown
6. Change from `H2` to `Div`
7. Publish all pages

**Option B: Use ARIA**

If you want to keep heading semantics for accessibility:

1. Keep the H2 tag
2. Add custom attribute `role="presentation"` to remove from accessibility tree
3. OR wrap the modal in `<div aria-hidden="true">` when closed

**Webflow Custom Attribute Steps:**
1. Select the H2 element
2. Settings panel > Custom Attributes section
3. Add: `role` = `presentation`

---

## How to Change H1 in Webflow

### Step-by-Step Instructions

#### Method 1: Direct Text Edit (Static H1)

1. Open Webflow Designer
2. Select the page from **Pages** panel
3. In the canvas, locate the hero section
4. Use **Navigator** panel to find the `<h1>` element
5. Double-click to edit text
6. Enter the recommended H1 text
7. Click outside to save
8. Publish

#### Method 2: CMS Binding Fix (Dynamic H1)

If the H1 is bound to a CMS Collection:

1. Open Webflow Designer
2. Select the H1 element
3. Check the **Settings** panel for CMS binding (purple connection icon)
4. If bound:
   - Click the binding icon
   - Verify the correct field is selected
   - Go to **CMS** panel > Open the Collection
   - Find the item and add content to the bound field
5. If not bound but should be:
   - Click **Connect to CMS**
   - Select the appropriate Collection and Field
6. Publish

#### Method 3: Check Conditional Visibility

If CMS binding exists but content isn't showing:

1. Select the H1 element
2. Check **Conditional Visibility** settings (eye icon)
3. Verify conditions aren't hiding the content
4. Test with different CMS items

---

## Best Practices for H1 Optimization

### Do's

| Practice | Example |
|----------|---------|
| Use one H1 per page | Single clear headline |
| Make H1 first heading in DOM | Before any H2, H3, etc. |
| Include primary keyword | "Scheepsbunkering - Wereldwijde Service" |
| Keep under 70 characters | Short, descriptive, scannable |
| Differentiate from title tag | Title for SERP, H1 for page |

### Don'ts

| Anti-Pattern | Why It's Bad |
|--------------|--------------|
| Multiple H1s | Confuses search engines |
| Empty H1 tags | No SEO value, accessibility issue |
| H1 same as title exactly | Missed keyword opportunity |
| Generic H1 ("Welcome") | Not descriptive, no keywords |
| H1 inside hidden elements | May still be read by crawlers |

### H1 vs Title Tag Strategy

| Element | Purpose | Character Limit | Include Brand? |
|---------|---------|-----------------|----------------|
| Title Tag | Search results, browser tab | 50-60 chars | Yes (at end) |
| H1 | On-page headline | 20-70 chars | Optional |

**Example:**
- **Title:** "Scheepsbunkering \| A. Nobel & Zn. - Wereldwijde bunkering"
- **H1:** "Wereldwijde Scheepsbunkering Services"

The title includes the brand name for SERP recognition. The H1 focuses on the page topic.

---

## Verification Checklist

After making all fixes, verify each page:

### Per-Page Checks

- [ ] H1 exists and contains text (not empty)
- [ ] H1 is the first `<h1>` tag in DOM order
- [ ] No H2/H3/H4/H5/H6 appears before H1
- [ ] H1 text is unique (not duplicated from other pages)
- [ ] H1 is different from title tag (slight variation OK)
- [ ] H1 includes target keywords for the page
- [ ] H1 is under 70 characters

### Technical Verification

**Browser DevTools Method:**
```javascript
// Open browser console (F12) and run:
const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
console.log('First 5 headings in DOM order:');
headings.forEach((h, i) => {
  if (i < 5) console.log(`${i+1}. <${h.tagName}>: ${h.textContent.trim().substring(0, 50)}`);
});
```

**Expected Output (after fix):**
```
1. <H1>: Uw Maritieme Totaalleverancier
2. <H2>: Alle expertise op een locatie.
3. <H2>: ...
```

---

## Implementation Priority

### Week 1: Critical (Empty H1s)

| Page | Action |
|------|--------|
| Homepage | Add H1 content |
| Contact | Add H1 content |
| Webshop | Add H1 content + verify language |
| Blog | Add H1 content |
| Team | Add H1 content |

### Week 2: High (Cookie Modal)

| Component | Action |
|-----------|--------|
| Cookie Modal Symbol | Change H2 to DIV |
| Republish all pages | Verify fix across site |

### Week 3: Medium (Remaining Pages)

| Pages | Action |
|-------|--------|
| All service pages | Add unique H1 content |
| Verify Title vs H1 | Ensure differentiation |

---

## Summary

| Total Issues | Root Cause | Fix Strategy |
|--------------|------------|--------------|
| 59 pages H1 non-sequential | Cookie modal H2 before hero H1 | Change modal H2 to DIV |
| 15+ pages empty H1 | CMS binding not rendering | Add content or fix binding |
| 18 pages title = H1 | Same text in both | Differentiate with keywords |

**Estimated Time:** 2-4 hours for all fixes
**Republish Required:** Yes, after each page edit
