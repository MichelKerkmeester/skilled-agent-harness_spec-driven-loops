# H2 Header Structure SEO Guide for anobel.com

> Detailed analysis and fix recommendations for H2 heading issues across all pages.

---

## Executive Summary

### Critical Finding: Empty CMS-Bound H2 Tags

The SEO audit identified **161 H2 tags across 21 files**, but the root cause is different than initially assumed:

| Issue Type | Count | Severity | Root Cause |
|------------|-------|----------|------------|
| **Empty H2 tags** | ~150+ | Critical | CMS fields bound but no content populated |
| **Duplicate H2s across pages** | 2 | High | Same text used on multiple pages |
| **H2s appearing before H1** | All pages | Medium | Cookie consent modal in source order |
| **Excessive H2s per page** | 7-16 per page | High | Empty placeholder H2s from components |

### Key Insight

Most H2 tags have the CSS class `w-dyn-bind-empty`, indicating they are **Webflow CMS dynamic bindings with no content**. These empty H2s:
- Confuse search engines about page structure
- Create false "multiple H2" and "duplicate H2" signals
- Waste crawl budget on meaningless heading tags

---

## Why Unique, Meaningful H2s Matter for SEO

### Search Engine Impact

1. **Page Structure Understanding**
   - H2s tell Google what major sections exist on a page
   - Empty H2s signal "this section has no topic" - confusing ranking algorithms

2. **Featured Snippets & Rich Results**
   - Google uses H2s to identify answer-worthy sections
   - Empty H2s = missed opportunities for featured snippets

3. **Duplicate Content Signals**
   - Same H2 on multiple pages = "these pages cover the same topic"
   - Can cause keyword cannibalization

4. **Accessibility**
   - Screen readers announce all headings
   - Empty headings create confusing navigation for users

### Best Practices

```
GOOD: Each H2 describes a unique section topic
- "Onze Filtratie Diensten" (unique to filtration page)
- "Hoe Scheepsbunkering Werkt" (unique to bunkering page)

BAD: Generic or empty H2s
- "" (empty)
- "Alle expertise op een locatie." (used on 2+ pages)
```

---

## CMS Template H2 Issues

### Blog Template (`detail_blog.html`)

**H2 Tags Found:**
| Line | Content | Status | Issue |
|------|---------|--------|-------|
| 3502 | *(empty)* | `w-dyn-bind-empty` | Cookie modal - same issue as static pages |
| 5397 | "Nobel houdt u op koers." | Has content | CTA section - static, OK |

**H6 Tags (WRONG LEVEL) - Lines 5092, 5329, 5348, 5354, 5360, 5366:**
```html
<h6 class="w-dyn-bind-empty"></h6>
```

**Problem:** Using H6 for subheadings in blog content is semantically incorrect. These should be H2 or H3 tags.

**Fix in Webflow:**
1. Select each H6 element in the blog rich text area
2. Change tag from H6 to H2 or H3 (Webflow Settings > Tag)
3. Bind to appropriate CMS field (subheading fields)

### Vacature Template (`detail_vacatures.html`)

**H2 Tags Found:**
| Line | Content | Status | Issue |
|------|---------|--------|-------|
| 4128 | *(empty)* | `w-dyn-bind-empty` | Modal heading |
| 4406 | *(empty)* | `w-dyn-bind-empty` | Modal success heading |
| 6027 | *(empty)* | `w-dyn-bind-empty` | CMS content section |
| 6323 | *(empty)* | `w-dyn-bind-empty` | CMS content section |
| 6425 | *(empty)* | `w-dyn-bind-empty` | Related content |

**H6 Tags (WRONG LEVEL) - Lines 5689-5711 (6 instances):**
```html
<h6 class="w-dyn-bind-empty"></h6>
```

**Problem:** Same issue as blog - using H6 for section headings instead of H2/H3.

**Fix in Webflow:**
1. Select each empty H2/H6 element
2. Either bind to CMS field OR change to non-heading element (div with role="heading" if needed for styling)
3. Change H6 tags to H2 or H3 for proper hierarchy

---

## Page-by-Page H2 Analysis

### Summary Table

| Page | URL | Total H2s | With Content | Empty | Duplicate Text |
|------|-----|-----------|--------------|-------|----------------|
| index.html | / | 8 | 1 | 7 | "Alle expertise op een locatie." |
| dit-is-nobel.html | /dit-is-nobel | 10 | 1 | 9 | "Alle expertise op een locatie." (DUPLICATE) |
| webshop.html | /webshop | 7 | 2 | 5 | None |
| blog.html | /blog | 5 | 1 | 4 | None |
| contact.html | /contact | 9 | 0 | 9 | None |
| team.html | /team | 12 | 0 | 12 | None |
| brochures.html | /brochures | 16 | 0 | 16 | None |
| voorwaarden.html | /voorwaarden | 1 | 0 | 1 | None |
| maatwerk.html | /maatwerk | 10 | 0 | 10 | None |
| scheepsuitrusting.html | /scheepsuitrusting | 7 | 0 | 7 | None |
| scheepsbunkering.html | /scheepsbunkering | 8 | 0 | 8 | None |
| filtratie.html | /filtratie | 8 | 0 | 8 | None |
| isps.html | /isps | 10 | 0 | 10 | None |
| locatie.html | /locatie | 9 | 0 | 9 | None |
| werkenbij.html | /werkenbij | 13 | 0 | 13 | None |

---

## Detailed Page Analysis

### 1. Homepage (index.html)

**URL:** `/` or `/index.html`

**H2 Tags Found (8 total):**

| Line | Content | Status | Issue |
|------|---------|--------|-------|
| 3253 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 4558 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 4609 | **"Alle expertise op een locatie."** | Has content | Duplicated on dit-is-nobel.html |
| 4798 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 4799 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 4948 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 5013 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 5065 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |

**Section Context for "Alle expertise op een locatie.":**
- Caption: "Diensten" (Services)
- Links to: scheepsbunkering.html, and other service pages
- This is a legitimate section heading for the services grid

**Recommended Unique H2 Replacement:**
```
Current:  "Alle expertise op een locatie."
Replace:  "Onze Maritieme Diensten" (Our Maritime Services)
```

**Empty H2 Fixes:**
- Line 3253: Part of hero/CMS section - either populate or remove H2 element
- Line 4558: Part of dynamic list - remove if unused, or populate via CMS
- Lines 4798-5065: Card/grid components - remove H2 tags if content comes from elsewhere

---

### 2. Dit is Nobel (dit-is-nobel.html)

**URL:** `/dit-is-nobel`

**H2 Tags Found (10 total):**

| Line | Content | Status | Issue |
|------|---------|--------|-------|
| 3266 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 4509 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 4563 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 4564 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 4679 | **"Alle expertise op een locatie."** | Has content | **DUPLICATE of homepage** |
| 4868 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 4919 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 4973 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 4974 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 5094 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |

**Duplicate H2 Analysis:**
- The exact text "Alle expertise op een locatie." appears on both index.html and dit-is-nobel.html
- This creates SEO confusion about which page is authoritative for this topic

**Recommended Unique H2 Replacement:**
```
Current:  "Alle expertise op een locatie."
Replace:  "Meer dan 50 Jaar Maritieme Expertise" (Over 50 Years of Maritime Expertise)
          - or -
          "Nobel: Al Uw Scheepvaartbehoeften onder Een Dak"
```

---

### 3. Webshop (webshop.html)

**URL:** `/webshop`

**H2 Tags Found (7 total):**

| Line | Content | Status | Issue |
|------|---------|--------|-------|
| 3382 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 4729 | **"Uw maritieme totaaloplossing."** | Has content | Dutch on EN page |
| 5007 | **"Een systeem, vele mogelijkheden."** | Has content | Dutch on EN page |
| 5148 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 5149 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 5298 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 5363 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |

**Section Context:**
- Line 4729: Caption "Uitgelichte functies" (Featured Functions) - Tab section for webshop features
- Line 5007: Pricing comparison section

**Recommendations:**

| Current (Dutch) | Recommended (English) | Context |
|-----------------|----------------------|---------|
| "Uw maritieme totaaloplossing." | "Your Complete Maritime Solution" | Features section |
| "Een systeem, vele mogelijkheden." | "One System, Many Possibilities" | Pricing section |

**If site is Dutch-only, make unique:**
```
Current:  "Uw maritieme totaaloplossing."
Replace:  "De Krachtige Functies van de Nobel Webshop"

Current:  "Een systeem, vele mogelijkheden."
Replace:  "Webshop Abonnementen Vergelijken"
```

---

### 4. Blog (blog.html)

**URL:** `/blog`

**H2 Tags Found (5 total):**

| Line | Content | Status | Issue |
|------|---------|--------|-------|
| 3758 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 5117 | **"Blog & Updates"** | Has content | Good, but generic |
| 5581 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 5582 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 5731 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |

**Recommendation:**
- "Blog & Updates" is acceptable but could be more descriptive
- Consider: "Laatste Maritieme Nieuws & Inzichten" (Latest Maritime News & Insights)

---

### 5. Contact (contact.html)

**URL:** `/contact`

**H2 Tags Found (9 total):**

| Line | Content | Status | Issue |
|------|---------|--------|-------|
| 3921 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 4199 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 5332 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 5722 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 5928 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 6030 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 6084 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 6085 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |
| 6207 | *(empty)* | `w-dyn-bind-empty` | Empty CMS binding |

**All H2s are empty!** This is a critical issue.

**Recommended H2 Content to Add:**

| Section Purpose | Recommended H2 |
|-----------------|----------------|
| Contact form | "Stuur Ons een Bericht" |
| Phone/callback | "Bel Ons Direct" |
| Location map | "Bezoek Nobel in Zwijndrecht" |
| Opening hours | "Openingstijden" |
| FAQ section | "Veelgestelde Vragen" |

---

### 6. Team (team.html)

**URL:** `/team`

**H2 Tags Found (12 total):**

| Line | Content | Status |
|------|---------|--------|
| 3204 | *(empty)* | `w-dyn-bind-empty` |
| 4525 | *(empty)* | `w-dyn-bind-empty` |
| 4526 | *(empty)* | `w-dyn-bind-empty` |
| 4622 | *(empty)* | `w-dyn-bind-empty` |
| 4623 | *(empty)* | `w-dyn-bind-empty` |
| 4719 | *(empty)* | `w-dyn-bind-empty` |
| 4720 | *(empty)* | `w-dyn-bind-empty` |
| 4816 | *(empty)* | `w-dyn-bind-empty` |
| 4817 | *(empty)* | `w-dyn-bind-empty` |
| 4923 | *(empty)* | `w-dyn-bind-empty` |
| 4924 | *(empty)* | `w-dyn-bind-empty` |
| 5071 | *(empty)* | `w-dyn-bind-empty` |

**All H2s are empty!**

**Recommended H2 Content:**

| Section | Recommended H2 |
|---------|----------------|
| Department: Filtration | "Team Filtratie & Separatie" |
| Department: Bunkering | "Team Scheepsbunkering" |
| Department: Equipment | "Team Scheepsuitrusting" |
| Department: Backoffice | "Team Backoffice" |
| Join us CTA | "Werken bij Nobel" |

---

### 7. Brochures (brochures.html)

**URL:** `/brochures`

**H2 Tags Found (16 total):**

All 16 H2 tags are empty (`w-dyn-bind-empty`).

**Recommended H2 Content Based on Context:**

| Brochure Type | Recommended H2 |
|---------------|----------------|
| Company overview | "Welkom bij Nobel" |
| Bunkering | "Brochure: Scheepsbunkering" |
| Filtration | "Brochure: Filtratie & Separatie" |
| Equipment | "Brochure: Scheepsuitrusting" |
| Webshop | "Brochure: De Nobel Webshop" |
| ISPS | "Brochure: De ISPS-Kade" |
| Careers | "Brochure: Werken bij Nobel" |

---

### 8. Service Pages (Common Pattern)

The following pages share a similar empty H2 pattern:

| Page | URL | Empty H2 Count |
|------|-----|----------------|
| maatwerk.html | /maatwerk | 10 |
| scheepsuitrusting.html | /scheepsuitrusting | 7 |
| scheepsbunkering.html | /scheepsbunkering | 8 |
| filtratie.html | /filtratie | 8 |
| isps.html | /isps | 10 |
| locatie.html | /locatie | 9 |

**Recommended Unique H2s per Service Page:**

| Page | Recommended H2s |
|------|-----------------|
| **maatwerk.html** | "Maatwerk Oplossingen", "Assemblage & Reiniging", "Digitale Schema's", "Nieuwbouw Inventarissen" |
| **scheepsuitrusting.html** | "Scheepsbenodigdheden", "Ons Assortiment", "Stickers & Labels", "Shop Uitrusting Online" |
| **scheepsbunkering.html** | "Bunkerstation Zwijndrecht", "Duurzame Brandstoffen", "350 Meter Kade", "Smeerolien & AdBlue" |
| **filtratie.html** | "Marktleider in Filtratie", "Filters Direct van de Bron", "Grote Filtervoorraad", "Geautoriseerde Distributeur" |
| **isps.html** | "ISPS-Beveiligde Kade", "Toegang Aanvragen", "Hoe Het Werkt", "Beveiligingsvereisten" |
| **locatie.html** | "Onze Locatie", "Routebeschrijving", "Openingstijden", "Parkeerinformatie" |

---

### 9. Werkenbij / Careers (werkenbij.html)

**URL:** `/werkenbij`

**H2 Tags Found (13 total):** All empty.

**Recommended H2 Content:**

| Section | Recommended H2 |
|---------|----------------|
| Open vacancies | "Openstaande Vacatures" |
| Why work here | "Waarom Werken bij Nobel" |
| Benefits | "Wat Wij Bieden" |
| Application form | "Solliciteer Direct" |
| Team culture | "Onze Bedrijfscultuur" |

---

### 10. Voorwaarden / Terms (voorwaarden.html)

**URL:** `/voorwaarden`

**H2 Tags Found (1 total):** Empty.

**Note:** This page likely uses H6 for article sections (see heading-structure-fix-guide.md for details).

**Recommended H2:**
- "Algemene Voorwaarden Nobel B.V."

---

## Cross-Page Duplicate H2 Summary

### Exact Duplicates Found

| H2 Text | Pages Where It Appears | Fix Recommendation |
|---------|------------------------|-------------------|
| "Alle expertise op een locatie." | index.html, dit-is-nobel.html | Make unique per page |
| "Uw maritieme totaaloplossing." | webshop.html, design-system/sections.html | OK if design-system is not indexed |
| "Een systeem, vele mogelijkheden." | webshop.html, design-system/sections.html | OK if design-system is not indexed |

### Empty H2s (Semantic Duplicates)

Empty H2 tags across pages create a different kind of duplication - they all communicate "nothing" to search engines, making pages appear structurally similar.

**Total empty H2s:** ~150+ across 15 main pages

---

## Webflow Instructions for Fixing H2s

### Finding H2 Elements in Webflow Designer

1. **Open the Designer** for your project
2. **Select the page** you want to edit from the Pages panel
3. **Use the Navigator** (keyboard shortcut: Z) to see the element hierarchy
4. **Search for "H2"** or look for elements with:
   - Class names containing "heading"
   - Elements in "header" or "section" containers

### Identifying CMS-Bound vs Static H2s

**CMS-Bound H2s (have `w-dyn-bind-empty`):**
- Located inside Collection Lists or CMS Template pages
- Content pulled from CMS Collection fields
- Show purple "Get text from..." binding in the element settings

**Static H2s:**
- Fixed text that you type directly
- Located on static pages outside Collection Lists

### Fixing Empty CMS-Bound H2s

**Option A: Remove the H2 Element**
1. Select the empty H2 in Navigator
2. Press Delete/Backspace
3. Publish changes

**Option B: Populate CMS Field**
1. Go to CMS Collections (database icon)
2. Find the collection (e.g., "Services", "Team Members")
3. Edit each item to add the missing heading text
4. Publish CMS changes

**Option C: Change to Non-Heading Element**
1. Select the H2 element
2. In Settings panel, find "Tag" dropdown
3. Change from "H2" to "Div" or "Paragraph"
4. This preserves styling but removes heading semantics

### Fixing Duplicate H2s Across Pages

**For Symbol/Component H2s:**
1. Open the Symbol (right-click > Edit Symbol)
2. If heading text should be page-specific, "Unlink" the text from the Symbol
3. Edit the unlinked text on each page

**For CMS Collection H2s:**
1. Each collection item should have unique heading text
2. Check CMS Collection > Items > [field name]
3. Ensure no two items have identical heading text

### Making H2 Text Unique

**Process:**
1. Identify the section purpose (Services, About, Contact, etc.)
2. Include page-specific context in the H2
3. Use descriptive, keyword-rich phrasing

**Examples:**

| Generic (Bad) | Page-Specific (Good) |
|---------------|---------------------|
| "Our Services" | "Nobel's Scheepsbunkering Services" |
| "Contact Us" | "Neem Contact op met Nobel Zwijndrecht" |
| "About" | "Meer dan 50 Jaar Nobel Geschiedenis" |

---

## Implementation Checklist

### Phase 1: Critical Fixes (Week 1)

- [ ] **Remove or populate empty H2s on homepage**
  - 7 empty H2s need attention
  - Keep: "Alle expertise op een locatie." but make unique

- [ ] **Fix duplicate "Alle expertise op een locatie."**
  - Change on dit-is-nobel.html to unique text
  - Suggested: "Meer dan 50 Jaar Maritieme Expertise"

- [ ] **Populate contact page H2s**
  - 9 empty H2s - most critical user-facing page
  - Add form section, location, hours headings

### Phase 2: High Priority (Week 2)

- [ ] **Fix webshop H2s**
  - Translate if EN page, or make more descriptive

- [ ] **Populate service page H2s**
  - filtratie.html (8 empty)
  - scheepsbunkering.html (8 empty)
  - scheepsuitrusting.html (7 empty)
  - maatwerk.html (10 empty)

### Phase 3: Medium Priority (Week 3)

- [ ] **Fix team page H2s** (12 empty)
- [ ] **Fix brochures page H2s** (16 empty)
- [ ] **Fix careers page H2s** (13 empty)
- [ ] **Fix ISPS page H2s** (10 empty)
- [ ] **Fix location page H2s** (9 empty)

### Phase 4: Verification (Week 4)

- [ ] Re-run SEO audit to verify fixes
- [ ] Check Google Search Console for indexing issues
- [ ] Verify no new duplicate H2s introduced
- [ ] Test screen reader navigation on key pages

---

## Technical Notes

### Why Empty H2s Happen in Webflow

1. **CMS Binding Without Content**
   - H2 element is bound to a CMS field
   - The field exists but is empty in most/all items
   - Webflow renders the H2 tag with class `w-dyn-bind-empty`

2. **Conditional Visibility Not Set**
   - H2 should be hidden when CMS field is empty
   - No "Hide if field is empty" condition applied

3. **Symbol/Component Placeholder**
   - Reusable component has H2 for structure
   - Not all pages need that H2
   - Element should be removed from unused instances

### Webflow Conditional Visibility Fix

To hide H2 when CMS field is empty:
1. Select the H2 element
2. Open Element Settings (D)
3. Add Condition: "When [field name] is set"
4. This hides the H2 when there's no content

---

## Resources

- [Google's Heading Guidelines](https://developers.google.com/search/docs/fundamentals/seo-starter-guide#use-headings)
- [Webflow CMS Documentation](https://university.webflow.com/lesson/intro-to-the-cms)
- [WCAG 2.1 Heading Requirements](https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels.html)

---

*Generated: January 2025*
*SEO Audit Reference: specs/005-anobel.com/022-seo-audit-report/*
