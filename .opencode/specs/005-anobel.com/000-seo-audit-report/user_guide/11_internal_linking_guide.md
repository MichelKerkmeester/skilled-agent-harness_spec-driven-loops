# Internal Linking SEO User Guide for anobel.com

## Overview

This guide addresses two critical internal linking issues identified in the SEO audit:
- **59 pages (100%)** have links with no anchor text
- **59 pages (100%)** have high external outlinks

**Severity: MEDIUM**

---

## Why Descriptive Anchor Text Matters for SEO

### Search Engine Perspective
1. **Context for Crawlers**: Google uses anchor text to understand what the linked page is about
2. **Ranking Signal**: Descriptive anchor text helps pages rank for relevant keywords
3. **Link Equity Distribution**: Clear anchor text helps search engines understand site structure

### User Experience Perspective
1. **Accessibility**: Screen readers announce link text - empty links are confusing
2. **Clarity**: Users know what to expect before clicking
3. **Trust**: Descriptive links increase confidence and click-through rates

### Common Problems Found
| Issue | Impact | Prevalence |
|-------|--------|------------|
| Empty `<span>` tags in links | Critical - No anchor text for SEO or accessibility | **398 instances** |
| Image-only links without alt text | Critical - No accessible text | **34 instances** |
| Links with `href="#"` (placeholder) | Medium - No destination value | Multiple per page |
| Generic anchor text | Low - Missed keyword opportunities | Various |

---

## CMS Template Internal Linking Issues

### Vacature Template (`detail_vacatures.html`)

**Critical Issue: Wrong "Back to Overview" Link**

**Location:** Lines 5411, 5733

```html
<a href="blog.html" class="btn--link"><span class="btn--text-aria">Terug naar overzicht</span></a>
```

**Problem:**
- "Terug naar overzicht" (Back to overview) links point to `blog.html`
- On a vacature (job) template, this should link to the vacatures overview
- Wrong destination: should be `werkenbij.html` or vacature listing

**Fix in Webflow:**
1. Select the "Terug naar overzicht" link element
2. Change href from `blog.html` to `werkenbij.html`
3. Verify text is descriptive: "Terug naar alle vacatures"

### Blog Template (`detail_blog.html`)

**Empty Anchor Text Issues:**
Same pattern as static pages - empty `<span class="btn--text-aria"></span>` elements.

**Fix:** Ensure all CTA buttons have descriptive text bound to CMS fields or static text.

---

## Page-by-Page Analysis

### 1. index.html (Homepage)

**Internal Links: 41** | **External Links: 39** | **Ratio: 1.05:1**

#### Links Without Anchor Text (20 instances)

| Destination | Current State | Suggested Anchor Text |
|------------|---------------|----------------------|
| `#` (navigation trigger) | `<span class="btn--text-aria"></span>` | "Open diensten menu" |
| `#` (navigation trigger) | `<span class="btn--text-aria"></span>` | "Open over ons menu" |
| `#` (navigation trigger) | `<span class="btn--text-aria"></span>` | "Taal selectie" |
| `werkenbij.html` | `<span class="btn--text-aria"></span>` | "Bekijk vacatures bij Nobel" |
| `blog.html` | `<span class="btn--text-aria"></span>` | "Lees ons laatste nieuws" |
| `contact.html` | `<span class="btn--text-aria"></span>` | "Neem contact met ons op" |
| `team.html` | `<span class="btn--text-aria"></span>` | "Ontmoet ons team" |
| `dit-is-nobel.html` | `<span class="btn--text-aria"></span>` | "Meer over Nobel" |
| `index.html` (logo) | Image only, no alt | "A. Nobel & Zn - Homepage" |

#### Image Links Missing Alt Text

| Element | Current | Suggested Alt Text |
|---------|---------|-------------------|
| Header logo (SVG) | No alt attribute | "A. Nobel & Zn logo - Ga naar homepage" |
| Footer logo (image) | `alt=""` | "A. Nobel & Zn scheepvaart illustratie" |

---

### 2. contact.html

**Internal Links: 31** | **External Links: 38** | **Ratio: 0.82:1**

#### Links Without Anchor Text (27 instances)

| Destination | Current State | Suggested Anchor Text |
|------------|---------------|----------------------|
| `#` (navigation triggers) | Empty spans | "Open menu", "Sluiten" |
| `werkenbij.html` | `<span class="btn--text-aria"></span>` | "Werk bij Nobel" |
| `blog.html` | `<span class="btn--text-aria"></span>` | "Bekijk blog artikelen" |
| `contact.html` (current) | `<span class="btn--text-aria"></span>` | "Contact pagina" |
| Navigation service links | Empty spans in dropdown | See service-specific text below |

#### Clickable Elements Without Text

| Element | Issue | Fix |
|---------|-------|-----|
| `clickable--link` buttons | `<span class="clickable--text u--screen-reader"></span>` | Add descriptive screen reader text |

---

### 3. blog.html

**Internal Links: 32** | **External Links: 31** | **Ratio: 1.03:1**

#### Links Without Anchor Text (19 instances)

| Destination | Current State | Suggested Anchor Text |
|------------|---------------|----------------------|
| `#` (blog article links) | `<a class="link--blog">` with no text | "[Article title]" |
| `werkenbij.html` | Empty span | "Bekijk openstaande vacatures" |
| `blog.html` (current) | Empty span | "Blog overzicht" |
| `dit-is-nobel.html` | Empty span | "Leer Nobel kennen" |
| Pagination links | "Previous/Next Page" only | "Vorige pagina: Oudere artikelen" |

#### Dynamic Content Links

Blog article cards use `link--blog` class but anchor text is dynamically generated. Ensure:
- CMS collection items have title field populated
- Link text block contains `{Article Title}` binding

---

### 4. brochures.html

**Internal Links: 31** | **External Links: 36** | **Ratio: 0.86:1**

#### Links Without Anchor Text (29 instances)

| Destination | Current State | Suggested Anchor Text |
|------------|---------------|----------------------|
| `#` (download buttons) | Empty spans | "[Brochure name] downloaden (PDF)" |
| `https://anobel.com/en/brochures` | Empty span | "English version of brochures" |
| `dit-is-nobel.html` | Empty span | "Over A. Nobel & Zn" |
| Various navigation | Empty spans | See navigation fixes below |

---

### 5. voorwaarden.html (Terms & Conditions)

**Internal Links: 36** | **External Links: 31** | **Ratio: 1.16:1**

#### Links Without Anchor Text (13 instances)

| Destination | Current State | Suggested Anchor Text |
|------------|---------------|----------------------|
| Navigation menu triggers | Empty spans | "Menu openen/sluiten" |
| Footer links | Have proper text | OK - no changes needed |

---

### 6. webshop.html

**Internal Links: 35** | **External Links: 30** | **Ratio: 1.17:1**

#### Links Without Anchor Text (19 instances)

| Destination | Current State | Suggested Anchor Text |
|------------|---------------|----------------------|
| `#` (tab buttons) | `<a class="tab--webshop-btn">` | "[Category name] producten" |
| `#` (product content links) | `<a class="link--product-content">` | "[Product category] bekijken" |
| `team.html` | Empty span | "Ons team ontmoeten" |
| `werkenbij.html` | Empty span | "Carriere bij Nobel" |

---

### 7. team.html

**Internal Links: 37** | **External Links: 35** | **Ratio: 1.06:1**

#### Links Without Anchor Text (23 instances)

| Destination | Current State | Suggested Anchor Text |
|------------|---------------|----------------------|
| `#` (hero card link) | `<a class="card is--hero-general">` | "Meer over ons team" |
| `werkenbij.html` | Empty span | "Werk met ons samen" |
| `filtratie.html` | Empty span | "Filtratie diensten" |
| Pagination links | Generic aria-labels | "Volgende teamleden bekijken" |

---

### 8. dit-is-nobel.html

**Internal Links: 36** | **External Links: 36** | **Ratio: 1:1**

#### Links Without Anchor Text (22 instances)

| Destination | Current State | Suggested Anchor Text |
|------------|---------------|----------------------|
| Navigation triggers | Empty spans | "Diensten menu", "Over ons menu" |
| `team.html` | Empty span | "Maak kennis met ons team" |
| Service page links | Empty spans | "[Service name] diensten bekijken" |

---

### 9. maatwerk.html

**Internal Links: 38** | **External Links: 36** | **Ratio: 1.06:1**

#### Links Without Anchor Text (25 instances)

| Destination | Current State | Suggested Anchor Text |
|------------|---------------|----------------------|
| CTA buttons | Empty spans | "Vraag maatwerk offerte aan" |
| Related services | Empty spans | "[Service] oplossingen" |
| Contact links | Empty spans | "Bespreek uw maatwerk project" |

---

### 10. scheepsuitrusting.html

**Internal Links: 34** | **External Links: 35** | **Ratio: 0.97:1**

#### Links Without Anchor Text (22 instances)

Similar pattern to other service pages. Focus on:
- Service-specific CTAs: "Scheepsuitrusting catalogus", "Offerte aanvragen"
- Team references: "Onze scheepsuitrusting experts"

---

### 11. isps.html

**Internal Links: 33** | **External Links: 40** | **Ratio: 0.83:1**

#### Links Without Anchor Text (23 instances)

| Destination | Current State | Suggested Anchor Text |
|------------|---------------|----------------------|
| ISPS-specific CTAs | Empty spans | "ISPS-kade informatie", "Veiligheidsprotocollen" |
| Contact for ISPS | Empty spans | "ISPS toegang aanvragen" |

---

### 12. filtratie.html

**Internal Links: 35** | **External Links: 35** | **Ratio: 1:1**

#### Links Without Anchor Text (23 instances)

| Destination | Current State | Suggested Anchor Text |
|------------|---------------|----------------------|
| Product categories | Empty spans | "Filtratie producten", "Separatie systemen" |
| Technical documentation | Empty spans | "Technische specificaties bekijken" |

---

### 13. locatie.html

**Internal Links: 35** | **External Links: 36** | **Ratio: 0.97:1**

#### Links Without Anchor Text (22 instances)

| Destination | Current State | Suggested Anchor Text |
|------------|---------------|----------------------|
| Map/directions | Empty spans | "Routebeschrijving", "Op de kaart bekijken" |
| Contact from location | Empty spans | "Bezoek plannen" |

---

### 14. werkenbij.html

**Internal Links: 31** | **External Links: 51** | **Ratio: 0.61:1** (HIGH EXTERNAL)

#### Links Without Anchor Text (31 instances)

| Destination | Current State | Suggested Anchor Text |
|------------|---------------|----------------------|
| Job listings | Empty spans | "[Functie titel] - Solliciteren" |
| Current page (werkenbij) | Empty span | "Alle vacatures" |
| Application forms | Empty spans | "Direct solliciteren" |

**Note:** This page has the highest external link ratio due to job platform integrations.

---

### 15. scheepsbunkering.html

**Internal Links: 34** | **External Links: 35** | **Ratio: 0.97:1**

#### Links Without Anchor Text (22 instances)

| Destination | Current State | Suggested Anchor Text |
|------------|---------------|----------------------|
| `mailto:bunkers@anobel.nl` | Empty span | "E-mail ons bunkerteam" |
| `team.html` | Empty span | "Bunker specialisten ontmoeten" |
| `locatie.html` | Empty span | "Bunkerfaciliteiten locatie" |
| `maatwerk.html` | Empty span | "Maatwerk bunkeroplossingen" |

---

## Systematic Issue Categories

### Category 1: Navigation Menu Triggers (Present on ALL pages)

**Pattern Found:**
```html
<a href="#" class="btn--link w-inline-block">
  <span class="btn--text-aria"></span>
</a>
```

**Fix:** Add descriptive text:
```html
<a href="#" class="btn--link w-inline-block" aria-label="Open diensten menu">
  <span class="btn--text-aria">Diensten</span>
</a>
```

**Instances per page:** 7-10

---

### Category 2: Logo Links (Present on ALL pages)

**Header Logo Pattern:**
```html
<a href="index.html" class="logo w-inline-block">
  <svg>...</svg>
</a>
```

**Fix in Webflow:**
1. Select the link wrapper around the logo
2. Add aria-label: "A. Nobel & Zn - Ga naar homepage"

**Footer Logo Pattern:**
```html
<a href="index.html" class="logo--footer w-inline-block">
  <img alt="" class="logo--footer">
</a>
```

**Fix:**
1. Select the image element
2. Change alt from empty to: "A. Nobel & Zn scheepvaart illustratie - Ga naar homepage"
3. Or add aria-label to the link wrapper

---

### Category 3: CMS Collection Links

**Pattern Found:**
```html
<a id="w-node-..." href="#" class="link--blog w-inline-block">
  <!-- Dynamic content but no visible link text -->
</a>
```

**Fix in Webflow CMS:**
1. Open the Collection List settings
2. Ensure "Link Text" binding is connected to Title field
3. Or add a Text Block inside the link with Title binding

---

### Category 4: Clickable Elements with Screen Reader Text

**Pattern Found:**
```html
<a target="_blank" href="#" class="clickable--link w-inline-block">
  <span class="clickable--text u--screen-reader"></span>
</a>
```

**Fix:**
1. Add content to the screen-reader span
2. Example: `<span class="clickable--text u--screen-reader">Bekijk product details</span>`

**Instances across site:** 31

---

## How to Fix in Webflow

### Step 1: Fixing Empty Span Links

1. **Open Webflow Designer**
2. **Navigate to the page** with the issue
3. **Select the link element** (look for `btn--link` class)
4. **Find the child span** with class `btn--text-aria`
5. **Add descriptive text** inside the span
6. **Ensure visibility settings** allow screen readers to access the text

### Step 2: Fixing Image-Only Links

**Option A: Add aria-label (Recommended for icons/logos)**
1. Select the `<a>` tag wrapping the image
2. Go to Element Settings
3. Add Custom Attribute:
   - Name: `aria-label`
   - Value: Descriptive text (e.g., "A. Nobel & Zn homepage")

**Option B: Add alt text to image**
1. Select the image element
2. In Image Settings, add Alt Text
3. For decorative images in links, add `aria-label` to the link instead

### Step 3: Fixing Navigation Dropdown Triggers

1. **Locate dropdown trigger links** (usually `href="#"`)
2. **Add text inside the span** that describes the menu
3. **Use aria-expanded** for accessibility:
   ```html
   <a href="#" aria-expanded="false" aria-label="Diensten menu">
     <span class="btn--text-aria">Diensten</span>
   </a>
   ```

### Step 4: Fixing CMS Collection Links

1. Open the **Collection List** wrapper
2. Navigate to **Link Block** settings
3. Bind the link's **aria-label** or **text content** to:
   - `{Item Title}` - for article/product names
   - `{Item Name}` - for category names
   - Custom field with descriptive text

---

## Internal Linking Best Practices

### 1. Anchor Text Guidelines

| Do | Don't |
|----|-------|
| "Bekijk onze scheepsbunkering diensten" | "Klik hier" |
| "Download productcatalogus (PDF)" | "Download" |
| "Lees meer over filtratie technologie" | "Lees meer" |
| "Contact opnemen met ons team" | Empty link |

### 2. Link Distribution Strategy

**Current State:**
- Average internal links per page: 34
- Average external links per page: 36
- Internal/External ratio: ~0.94:1

**Recommended:**
- Aim for 2:1 internal to external ratio
- Add contextual internal links within content
- Link to related services from each service page

### 3. Navigation Structure

**Primary Navigation:** Already well-structured with:
- Diensten (Services)
- Over Ons (About)
- Blog
- Contact

**Improvement Opportunities:**
- Add breadcrumb navigation (currently missing)
- Add related content sections at bottom of pages
- Link between related service pages

### 4. Footer Link Optimization

**Current footer links are good:**
- All service pages linked
- Contact information present
- Social media links (external)

**Add:**
- Sitemap link
- Privacy policy link (if not already in voorwaarden.html)

---

## Summary Table: Links Needing Fixes Per Page

| Page | Empty Anchor Links | Image Links No Alt | Total Fixes Needed | Priority |
|------|-------------------|-------------------|-------------------|----------|
| index.html | 20 | 2 | 22 | HIGH |
| contact.html | 27 | 2 | 29 | HIGH |
| blog.html | 19 | 2 | 21 | HIGH |
| brochures.html | 29 | 2 | 31 | HIGH |
| webshop.html | 19 | 2 | 21 | HIGH |
| team.html | 23 | 2 | 25 | MEDIUM |
| werkenbij.html | 31 | 2 | 33 | HIGH |
| dit-is-nobel.html | 22 | 2 | 24 | MEDIUM |
| maatwerk.html | 25 | 2 | 27 | MEDIUM |
| scheepsuitrusting.html | 22 | 2 | 24 | MEDIUM |
| isps.html | 23 | 2 | 25 | MEDIUM |
| filtratie.html | 23 | 2 | 25 | MEDIUM |
| locatie.html | 22 | 2 | 24 | MEDIUM |
| scheepsbunkering.html | 22 | 2 | 24 | MEDIUM |
| voorwaarden.html | 13 | 2 | 15 | LOW |
| **TOTAL** | **~340** | **~30** | **~370** | - |

---

## Implementation Checklist

### Phase 1: Critical Fixes (Week 1)
- [ ] Fix header logo alt text (all pages - global component)
- [ ] Fix footer logo alt text (all pages - global component)
- [ ] Fix navigation menu trigger anchor text (global component)
- [ ] Fix mobile menu trigger anchor text (global component)

### Phase 2: High-Priority Pages (Week 2)
- [ ] Fix all empty spans on index.html
- [ ] Fix all empty spans on contact.html
- [ ] Fix all empty spans on werkenbij.html
- [ ] Fix all empty spans on brochures.html

### Phase 3: Content Pages (Week 3)
- [ ] Fix blog.html and blog article template
- [ ] Fix webshop.html and product links
- [ ] Fix team.html and employee cards

### Phase 4: Service Pages (Week 4)
- [ ] Fix scheepsbunkering.html
- [ ] Fix filtratie.html
- [ ] Fix scheepsuitrusting.html
- [ ] Fix maatwerk.html
- [ ] Fix isps.html
- [ ] Fix locatie.html
- [ ] Fix dit-is-nobel.html

### Phase 5: Verification
- [ ] Run accessibility audit (WAVE or axe)
- [ ] Run SEO audit (Screaming Frog)
- [ ] Test with screen reader
- [ ] Verify in Google Search Console

---

## Related Resources

- [09_image_alt_text_guide.md](./09_image_alt_text_guide.md) - For image accessibility
- [08_cross_origin_links_guide.md](./08_cross_origin_links_guide.md) - For external link security
- [06_hreflang_guide.md](./06_hreflang_guide.md) - For multilingual link handling

---

*Document generated: January 2025*
*Based on analysis of 15 main HTML files from Webflow export*
