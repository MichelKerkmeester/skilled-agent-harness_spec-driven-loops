# Title Tags Optimization Guide

> **Comprehensive guide for fixing title tag SEO issues on anobel.com**

---

## Table of Contents

1. [Title Tag Best Practices](#1-title-tag-best-practices)
2. [Current Issues Overview](#2-current-issues-overview)
3. [Page-by-Page Analysis](#3-page-by-page-analysis)
4. [How to Edit Titles in Webflow](#4-how-to-edit-titles-in-webflow)
5. [Summary Table](#5-summary-table)

---

## 1. Title Tag Best Practices

### Optimal Title Tag Requirements

| Criterion | Requirement | Reason |
|-----------|-------------|--------|
| **Character Count** | 30-60 characters | Titles under 30 chars don't utilize available SERP space; over 60 chars get truncated |
| **Pixel Width** | Under 561 pixels | Google displays approximately 561px of title text in desktop SERPs |
| **Uniqueness** | Different from H1 | Duplicate title/H1 wastes keyword opportunities and appears spammy |
| **Brand Placement** | End of title | Primary keywords at start get more weight |
| **Keywords** | Include primary keyword | Critical for search rankings |

### Title Tag Formula

```
[Primary Keyword] | [Secondary Benefit] - [Brand Name]
```

**Example:**
```
Scheepsuitrusting | Maritieme Supplies - A. Nobel & Zn.
```

### Common Mistakes to Avoid

1. **Too Short (< 30 chars)**: Wastes valuable SERP real estate
2. **Too Long (> 60 chars)**: Gets truncated with "..." in search results
3. **Same as H1**: Missed opportunity to target additional keywords
4. **Missing Brand**: Reduces brand recognition and trust signals
5. **Keyword Stuffing**: Appears spammy and hurts rankings

---

## 2. Current Issues Overview

Based on the SEO audit, the following issues were identified:

| Issue Type | Count | Percentage |
|------------|-------|------------|
| Titles too short (< 30 chars) | 7 pages | 12% |
| Titles too long (> 60 chars) | 9 pages | 15% |
| Titles over 561px (truncated) | 9 pages | 15% |
| Title same as H1 | 18 pages | 31% |

### Issue Distribution by Page Type

**Utility Pages (Low Priority)**
- 404 Page: "Not Found" (9 chars) - Too short
- 401 Page: "Protected page" (14 chars) - Too short
- Search Page: "Search Results" (14 chars) - Too short

**Main Content Pages (High Priority)**
- 4 pages with titles over 60 characters
- Multiple pages with title/H1 duplication

---

## 3. Page-by-Page Analysis

### 3.1 Pages with Titles TOO SHORT (< 30 characters)

---

#### 404.html - Not Found Page

| Attribute | Value |
|-----------|-------|
| **URL** | https://anobel.com/404 |
| **Current Title** | `Not Found` |
| **Character Count** | 9 characters |
| **Issue** | Too short - wastes SERP space |
| **Priority** | Low (utility page) |

**Recommended Title:**
```
Pagina Niet Gevonden | A. Nobel & Zn.
```
**Character Count:** 38 characters

---

#### 401.html - Protected Page

| Attribute | Value |
|-----------|-------|
| **URL** | https://anobel.com/401 |
| **Current Title** | `Protected page` |
| **Character Count** | 14 characters |
| **Issue** | Too short - wastes SERP space |
| **Priority** | Low (utility page, not indexed) |

**Recommended Title:**
```
Beveiligde Pagina | Toegang Vereist - A. Nobel & Zn.
```
**Character Count:** 52 characters

---

#### search.html - Search Results Page

| Attribute | Value |
|-----------|-------|
| **URL** | https://anobel.com/search |
| **Current Title** | `Search Results` |
| **Character Count** | 14 characters |
| **Issue** | Too short - wastes SERP space |
| **Priority** | Low (utility page) |

**Recommended Title:**
```
Zoekresultaten | Vind Wat U Zoekt - A. Nobel & Zn.
```
**Character Count:** 50 characters

---

### 3.2 Pages with Titles TOO LONG (> 60 characters)

---

#### scheepsuitrusting.html - Ship Equipment Page

| Attribute | Value |
|-----------|-------|
| **URL** | https://anobel.com/nl/scheepsuitrusting |
| **Current Title** | `Scheepsuitrusting | A. Nobel & Zn. - Alle benodigdheden voor aan boord` |
| **Character Count** | 70 characters |
| **Issue** | Too long - will be truncated in SERP |
| **Priority** | High (service page) |

**SERP Preview (truncated):**
```
Scheepsuitrusting | A. Nobel & Zn. - Alle benodigdheden voo...
```

**Recommended Title:**
```
Scheepsuitrusting | Maritieme Supplies - A. Nobel & Zn.
```
**Character Count:** 55 characters

---

#### filtratie.html - Filtration Page

| Attribute | Value |
|-----------|-------|
| **URL** | https://anobel.com/nl/filtratie |
| **Current Title** | `Filtratie & Separatie | A. Nobel & Zn. - Marktleider in filtratie` |
| **Character Count** | 65 characters |
| **Issue** | Too long - will be truncated in SERP |
| **Priority** | High (service page) |

**SERP Preview (truncated):**
```
Filtratie & Separatie | A. Nobel & Zn. - Marktleider in filt...
```

**Recommended Title:**
```
Filtratie & Separatie | Europees Marktleider - A. Nobel & Zn.
```
**Character Count:** 60 characters

**Alternative (shorter):**
```
Filtratie & Separatie | A. Nobel & Zn.
```
**Character Count:** 38 characters

---

#### locatie.html - Location Page

| Attribute | Value |
|-----------|-------|
| **URL** | https://anobel.com/nl/locatie |
| **Current Title** | `De Locatie | A. Nobel & Zn. - Een ligging waar 'U' tegen wordt gezegd` |
| **Character Count** | 69 characters |
| **Issue** | Too long - will be truncated in SERP |
| **Priority** | Medium (informational page) |

**SERP Preview (truncated):**
```
De Locatie | A. Nobel & Zn. - Een ligging waar 'U' tegen wo...
```

**Recommended Title:**
```
Locatie Zwijndrecht | Aan de Oude Maas - A. Nobel & Zn.
```
**Character Count:** 55 characters

---

#### werkenbij.html - Careers Page

| Attribute | Value |
|-----------|-------|
| **URL** | https://anobel.com/nl/werkenbij |
| **Current Title** | `Werken bij Nobel - Wereldwijd de maritieme sector in vaart houden` |
| **Character Count** | 65 characters |
| **Issue** | Too long - will be truncated in SERP |
| **Priority** | Medium (recruitment page) |

**SERP Preview (truncated):**
```
Werken bij Nobel - Wereldwijd de maritieme sector in vaart h...
```

**Recommended Title:**
```
Vacatures | Werken bij Nobel - A. Nobel & Zn.
```
**Character Count:** 45 characters

---

### 3.3 Pages with OPTIMAL Title Length (30-60 characters)

---

#### index.html - Homepage

| Attribute | Value |
|-----------|-------|
| **URL** | https://anobel.com/nl |
| **Current Title** | `A. Nobel & Zn - Uw maritieme totaalleverancier` |
| **Character Count** | 47 characters |
| **Status** | OPTIMAL |
| **Notes** | Good length, includes brand and value proposition |

---

#### contact.html - Contact Page

| Attribute | Value |
|-----------|-------|
| **URL** | https://anobel.com/nl/contact |
| **Current Title** | `Contact | A. Nobel & Zn. - 6 dagen per week geopend` |
| **Character Count** | 51 characters |
| **Status** | OPTIMAL |
| **Notes** | Good length, includes unique selling point |

---

#### blog.html - Blog Page

| Attribute | Value |
|-----------|-------|
| **URL** | https://anobel.com/nl/blog |
| **Current Title** | `Blog | A. Nobel & Zn. - Lees en ontdek meer` |
| **Character Count** | 43 characters |
| **Status** | OPTIMAL |
| **Notes** | Could be more descriptive but length is fine |

**Optional Enhancement:**
```
Maritiem Blog | Nieuws & Updates - A. Nobel & Zn.
```
**Character Count:** 49 characters

---

#### brochures.html - Brochures Page

| Attribute | Value |
|-----------|-------|
| **URL** | https://anobel.com/nl/brochures |
| **Current Title** | `Brochures | A. Nobel & Zn. - Alle info binnen handbereik` |
| **Character Count** | 56 characters |
| **Status** | OPTIMAL |
| **Notes** | Good descriptive title |

---

#### voorwaarden.html - Terms & Conditions

| Attribute | Value |
|-----------|-------|
| **URL** | https://anobel.com/nl/voorwaarden |
| **Current Title** | `Voorwaarden | A. Nobel & Zn. - Transparantie sinds 1966` |
| **Character Count** | 55 characters |
| **Status** | OPTIMAL |
| **Notes** | Good length, includes heritage reference |

---

#### webshop.html - Webshop Page

| Attribute | Value |
|-----------|-------|
| **URL** | https://anobel.com/nl/webshop |
| **Current Title** | `Ontdek de Nobel Webshop - De maritieme totaaloplossing` |
| **Character Count** | 54 characters |
| **Status** | OPTIMAL |
| **Notes** | Good length, action-oriented |

---

#### team.html - Team Page

| Attribute | Value |
|-----------|-------|
| **URL** | https://anobel.com/nl/team |
| **Current Title** | `Het Team | A. Nobel & Zn. - Een team, een koers.` |
| **Character Count** | 48 characters |
| **Status** | OPTIMAL |
| **Notes** | Good length with tagline |

---

#### dit-is-nobel.html - About Page

| Attribute | Value |
|-----------|-------|
| **URL** | https://anobel.com/nl/dit-is-nobel |
| **Current Title** | `Dit is Nobel - Meer dan 50 jaar maritieme kennis` |
| **Character Count** | 48 characters |
| **Status** | OPTIMAL |
| **Notes** | Good length, heritage focus |

---

#### maatwerk.html - Custom Solutions

| Attribute | Value |
|-----------|-------|
| **URL** | https://anobel.com/nl/scheepsuitrusting (Note: canonical mismatch) |
| **Current Title** | `Maatwerk | A. Nobel & Zn. - Maritieme oplossingen op maat` |
| **Character Count** | 57 characters |
| **Status** | OPTIMAL |
| **Notes** | Good length, descriptive |

---

#### isps.html - ISPS Information

| Attribute | Value |
|-----------|-------|
| **URL** | https://anobel.com/nl/isps |
| **Current Title** | `ISPS | A. Nobel & Zn. - Krijg toegang tot de ISPS-kade` |
| **Character Count** | 54 characters |
| **Status** | OPTIMAL |
| **Notes** | Good length, specific |

---

#### scheepsbunkering.html - Bunkering Services

| Attribute | Value |
|-----------|-------|
| **URL** | https://anobel.com/nl/scheepsbunkering |
| **Current Title** | `Scheepsbunkering | A. Nobel & Zn. - Wereldwijde bunkering` |
| **Character Count** | 57 characters |
| **Status** | OPTIMAL |
| **Notes** | Good length, service-focused |

---

## 4. How to Edit Titles in Webflow

### Step-by-Step Instructions

#### Method 1: Via Page Settings (Recommended)

1. **Open Webflow Designer**
   - Go to https://webflow.com/dashboard
   - Select the anobel.com project

2. **Navigate to Pages Panel**
   - Click the Pages icon (stack of papers) in the left sidebar
   - Or press `P` as keyboard shortcut

3. **Select the Page to Edit**
   - Find the page in the list
   - Click the gear icon next to the page name

4. **Edit SEO Settings**
   - Scroll to "SEO Settings" section
   - Find the "Title Tag" field
   - Enter your new title

5. **Save and Publish**
   - Click "Save" at the top right
   - Publish changes to make them live

#### Method 2: Via Site Settings (Global)

1. **Go to Site Settings**
   - Click the Webflow logo in the top left
   - Select "Site Settings"

2. **Navigate to SEO Tab**
   - Click "SEO" in the left menu

3. **Set Default Title Format**
   - Define a title format using the `%` syntax
   - Example: `%PAGE_TITLE% | A. Nobel & Zn.`

### Webflow Title Tag Tips

1. **Dynamic Titles for CMS Pages**
   - Use Webflow's dynamic fields
   - Format: `{Field Name} | Brand`

2. **Title Inheritance**
   - Child pages can inherit from parent
   - Override individually when needed

3. **Preview Before Publishing**
   - Use "SEO" tab preview
   - Check how it appears in Google

---

## 5. Summary Table

### All Pages - Title Tag Status

| # | Page | URL | Current Title | Chars | Status | Recommendation |
|---|------|-----|---------------|-------|--------|----------------|
| 1 | Homepage | /nl | A. Nobel & Zn - Uw maritieme totaalleverancier | 47 | OK | No change needed |
| 2 | Contact | /nl/contact | Contact \| A. Nobel & Zn. - 6 dagen per week geopend | 51 | OK | No change needed |
| 3 | Blog | /nl/blog | Blog \| A. Nobel & Zn. - Lees en ontdek meer | 43 | OK | Optional: More descriptive |
| 4 | Brochures | /nl/brochures | Brochures \| A. Nobel & Zn. - Alle info binnen handbereik | 56 | OK | No change needed |
| 5 | Voorwaarden | /nl/voorwaarden | Voorwaarden \| A. Nobel & Zn. - Transparantie sinds 1966 | 55 | OK | No change needed |
| 6 | Webshop | /nl/webshop | Ontdek de Nobel Webshop - De maritieme totaaloplossing | 54 | OK | No change needed |
| 7 | Team | /nl/team | Het Team \| A. Nobel & Zn. - Een team, een koers. | 48 | OK | No change needed |
| 8 | Dit is Nobel | /nl/dit-is-nobel | Dit is Nobel - Meer dan 50 jaar maritieme kennis | 48 | OK | No change needed |
| 9 | Maatwerk | /nl/maatwerk | Maatwerk \| A. Nobel & Zn. - Maritieme oplossingen op maat | 57 | OK | No change needed |
| 10 | Scheepsuitrusting | /nl/scheepsuitrusting | Scheepsuitrusting \| A. Nobel & Zn. - Alle benodigdheden voor aan boord | **70** | **TOO LONG** | Shorten to 55 chars |
| 11 | ISPS | /nl/isps | ISPS \| A. Nobel & Zn. - Krijg toegang tot de ISPS-kade | 54 | OK | No change needed |
| 12 | Filtratie | /nl/filtratie | Filtratie & Separatie \| A. Nobel & Zn. - Marktleider in filtratie | **65** | **TOO LONG** | Shorten to 60 chars |
| 13 | Locatie | /nl/locatie | De Locatie \| A. Nobel & Zn. - Een ligging waar 'U' tegen wordt gezegd | **69** | **TOO LONG** | Shorten to 55 chars |
| 14 | Werken bij | /nl/werkenbij | Werken bij Nobel - Wereldwijd de maritieme sector in vaart houden | **65** | **TOO LONG** | Shorten to 45 chars |
| 15 | Scheepsbunkering | /nl/scheepsbunkering | Scheepsbunkering \| A. Nobel & Zn. - Wereldwijde bunkering | 57 | OK | No change needed |
| 16 | 404 | /404 | Not Found | **9** | **TOO SHORT** | Expand to 38 chars |
| 17 | 401 | /401 | Protected page | **14** | **TOO SHORT** | Expand to 52 chars |
| 18 | Search | /search | Search Results | **14** | **TOO SHORT** | Expand to 50 chars |

### Quick Fix Reference

| Page | Current Title | Recommended Title | Change |
|------|---------------|-------------------|--------|
| Scheepsuitrusting | Scheepsuitrusting \| A. Nobel & Zn. - Alle benodigdheden voor aan boord | Scheepsuitrusting \| Maritieme Supplies - A. Nobel & Zn. | -15 chars |
| Filtratie | Filtratie & Separatie \| A. Nobel & Zn. - Marktleider in filtratie | Filtratie & Separatie \| Europees Marktleider - A. Nobel & Zn. | -5 chars |
| Locatie | De Locatie \| A. Nobel & Zn. - Een ligging waar 'U' tegen wordt gezegd | Locatie Zwijndrecht \| Aan de Oude Maas - A. Nobel & Zn. | -14 chars |
| Werken bij | Werken bij Nobel - Wereldwijd de maritieme sector in vaart houden | Vacatures \| Werken bij Nobel - A. Nobel & Zn. | -20 chars |
| 404 | Not Found | Pagina Niet Gevonden \| A. Nobel & Zn. | +29 chars |
| 401 | Protected page | Beveiligde Pagina \| Toegang Vereist - A. Nobel & Zn. | +38 chars |
| Search | Search Results | Zoekresultaten \| Vind Wat U Zoekt - A. Nobel & Zn. | +36 chars |

---

## Appendix: Title Tag Character Count Reference

### Optimal Range Visual

```
|-------- 30 chars --------|---------------------- 60 chars ---------------------|
                           [========= OPTIMAL RANGE =========]
<-- TOO SHORT                                                        TOO LONG -->
```

### Character Counting Tips

1. **Include all characters**: Spaces, pipes (|), dashes (-), and special characters all count
2. **HTML entities**: `&` counts as 1 character (not 5 for `&amp;`)
3. **Use online tools**: Google SERP simulators show actual pixel width
4. **Test on mobile**: Mobile titles may truncate differently

---

## Related Guides

- [01_webflow_seo_fix_guide.md](./webflow-seo-fix-guide.md) - General SEO fixes
- [02_heading_structure_fix_guide.md](./heading-structure-fix-guide.md) - H1/H2/H3 optimization

---

*Last updated: January 24, 2026*
*Generated from Webflow export analysis*
