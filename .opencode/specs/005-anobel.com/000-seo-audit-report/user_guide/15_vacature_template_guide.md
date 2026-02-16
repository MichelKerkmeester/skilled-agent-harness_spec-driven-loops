# Vacature Template SEO Guide for anobel.com

> **Severity:** P1 CRITICAL
> **Template:** Vacature (Job Posting) CMS Collection Page
> **Source file:** `detail_vacatures.html` (Webflow export)
> **Scope:** Template-level fixes (apply once, fix ALL job postings)
> **Estimated time:** 2-3 hours
> **Affects:** Every job posting published via the Vacature CMS Collection

---

## Executive Summary

The vacature (job posting) CMS template has **7 issues** that affect every single job posting on anobel.com. Because this is a CMS Collection template, fixing it once in the Webflow Designer automatically fixes all current and future job postings.

| Issue | Severity | Type | Fix Location |
|-------|----------|------|-------------|
| **Wrong "Back to overview" link** | CRITICAL | UX + SEO bug | Webflow Designer |
| **6x H6 tags should be H2** | High | Heading hierarchy | Webflow Designer |
| **Missing dynamic canonical tag** | High | SEO/indexing | Webflow Page Settings |
| **Missing dynamic hreflang tags** | High | International SEO | Webflow Custom Code |
| **Title tag not bound to CMS** | High | SEO | Webflow Page Settings |
| **Meta description not bound to CMS** | Medium | SEO | Webflow Page Settings |
| **Empty CMS headings** | Medium | Content/SEO | Webflow CMS Editor (per post) |

### Current Template State

```
Headings found in template:
  H1: 1  (CMS-bound, works when populated)
  H2: 3  (all empty, CMS-bound with w-dyn-bind-empty)
  H3: 1
  H6: 6  (all empty, CMS-bound — WRONG TAG, should be H2)

Total empty headings: 10 of 11
```

---

## 1. CRITICAL BUG: Wrong "Back to Overview" Link

> **WARNING: This is a live UX bug. Users clicking "Terug naar overzicht" on any job posting are sent to the blog page instead of the jobs overview.**

### The Problem

The "Terug naar overzicht" (Back to overview) CTA link in the vacature template points to the wrong page:

```
CURRENT (BROKEN):
<a href="blog.html" class="...">Terug naar overzicht</a>

CORRECT:
<a href="werkenbij.html" class="...">Terug naar alle vacatures</a>
```

This link appears **twice** in the template (approximately lines 5411 and 5733 in the exported HTML), likely in both a main content area and a CTA section. Both instances must be fixed.

### Impact

- **UX:** Job seekers clicking "back to overview" land on the blog — confusing and increases bounce rate
- **SEO:** Internal link equity flows to the wrong page; Google sees blog.html as related to job postings instead of werkenbij.html
- **All job postings affected:** Since this is in the template, every published vacature has this broken link

### Fix in Webflow Designer

1. Open the **Vacature CMS Collection template** in the Webflow Designer
2. Find the link element labeled **"Terug naar overzicht"** (there are 2 instances)
3. For **each instance**:
   - Select the link element
   - In the **Element Settings** panel (right side, gear icon), change the link:
     - **Current:** Page link → `blog.html`
     - **Change to:** Page link → `werkenbij.html`
   - Update the **link text** from "Terug naar overzicht" to **"Terug naar alle vacatures"**
4. If the site has an English version of this template:
   - Change href to `careers.html`
   - Change text to "Back to all vacancies"

### Verification

After publishing, visit any job posting and click the "Terug naar alle vacatures" link. You should land on the Werken bij (jobs overview) page, **not** the blog.

---

## 2. Fix H6 → H2 Conversion (Template)

### The Problem

Six section headings in the vacature template use `<h6>` tags instead of `<h2>`. This breaks heading hierarchy — jumping from H1 directly to H6 tells search engines these sections are deeply nested and unimportant, when they are in fact the primary content sections of the page.

```
CURRENT (BROKEN):                          CORRECT:
H1: Job Title                              H1: Job Title
  H6: Wat ga je doen        ← WRONG          H2: Wat ga je doen
  H6: Wat breng je mee      ← WRONG          H2: Wat breng je mee
  H6: Wat bieden wij        ← WRONG          H2: Wat bieden wij
  H6: Requirements           ← WRONG          H2: Requirements
  H6: Responsibilities       ← WRONG          H2: Responsibilities
  H6: Benefits               ← WRONG          H2: Benefits
```

All six H6 elements have the `w-dyn-bind-empty` class, meaning they are CMS-bound but unpopulated in the export.

### Fix in Webflow Designer

1. Open the **Vacature CMS Collection template** in the Webflow Designer
2. For **each of the 6 H6 elements**:
   - Select the heading element
   - In **Element Settings** (gear icon, right panel), find the **Tag** dropdown
   - Change from **H6** to **H2**
3. Verify that styling is preserved — you may need to apply an H2 class or adjust the typography styles for H2 within this template context

### Identifying the H6 Elements

These H6 elements represent job description sections. In the Webflow Designer, look for text blocks within the vacature template that serve as section headings for content areas like:

- "Wat ga je doen" (What will you do)
- "Wat breng je mee" (What do you bring)
- "Wat bieden wij" (What do we offer)
- Or similar job section titles bound to CMS fields

They will likely be inside a repeating content structure within the vacature template body.

---

## 3. Fix Empty CMS-Bound H2 Headings

### The Problem

The template has 3 existing H2 tags, all empty (CMS-bound but unpopulated):

```html
<h2 class="u--text-size-inherit u--text-wrap-balance w-dyn-bind-empty"></h2>
```

### Fix in Webflow CMS Editor

These H2s need content per job posting. For each vacature in the CMS:

1. Go to **CMS** → **Vacatures** collection
2. Open each job posting
3. Find the CMS fields bound to these H2 elements
4. Populate them with meaningful section headings, for example:
   - "Over de functie" (About the role)
   - "Over A. Nobel & Zn" (About the company)
   - "Solliciteren" (Apply)

If the CMS fields for these H2s are not needed, consider converting the empty H2 elements to `<div>` or `<span>` tags in the Designer so they do not produce empty heading tags.

---

## 4. Check and Fix the Dual-H2 Pattern

### The Problem

Across anobel.com, CTA sections commonly use two sibling `<h2>` tags for multi-line heading styling (e.g., one H2 for line 1, another H2 for line 2). This doubles the H2 count and confuses heading hierarchy.

### Check in the Vacature Template

1. In the Webflow Designer, look for CTA or "heading has--span" wrapper elements
2. If you find two adjacent H2 elements inside the same wrapper:

```
CURRENT (if dual-H2 pattern exists):
<div class="heading has--span">
  <h2>Line one of heading</h2>
  <h2>Line two of heading</h2>      ← WRONG: duplicate H2
</div>

CORRECT:
<div class="heading has--span">
  <h2>Line one of heading</h2>
  <span class="h2-visual">Line two of heading</span>  ← Visual only
</div>
```

3. Change the **second** H2 to a `<span>` tag in Element Settings
4. Apply the same visual class/styling so it still looks like a heading

---

## 5. Add Dynamic SEO Meta Tags

### a. Dynamic Canonical Tag

**Why:** Without a canonical tag, Google may index duplicate or parameterized URLs for each job posting.

**Fix in Webflow:**

1. Open the **Vacature CMS Collection page settings** (gear icon on the page, not an element)
2. In **SEO Settings** → scroll to the **Custom Code** section (inside `<head>`)
3. Add:

```html
<link rel="canonical" href="https://anobel.com/nl/werkenbij/{{wf {"path":"slug","type":"PlainText"} }}" />
```

**Note:** If Webflow's built-in SEO settings already generate a canonical tag for CMS pages, check the live HTML source first. You may only need to verify the generated URL is correct rather than adding a custom one.

### b. Dynamic Hreflang Tags

**Why:** anobel.com has both Dutch (NL) and English (EN) versions. Without hreflang tags, Google cannot associate the correct language version with each user's locale.

**Fix:** In the same Custom Code `<head>` section, add:

```html
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/werkenbij/{{wf {"path":"slug","type":"PlainText"} }}" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/careers/{{wf {"path":"slug","type":"PlainText"} }}" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/werkenbij/{{wf {"path":"slug","type":"PlainText"} }}" />
```

**Important:** This assumes NL and EN job postings share the same slug. If they use different slugs or separate CMS collections, adjust the English URL path accordingly.

### c. Bind Title Tag to CMS

**Why:** Each job posting should have a unique, descriptive title tag for search results.

**Fix:**

1. In **Page Settings** → **SEO Title**
2. Click the purple **"+ Add Field"** button to bind a CMS field
3. Select the **Job Title** (name) field
4. Add a static suffix: ` | Vacature | A. Nobel & Zn`

**Result:**

```
Monteur Buitendienst | Vacature | A. Nobel & Zn
```

### d. Bind Meta Description to CMS

**Why:** A unique meta description for each posting improves click-through rates from search results.

**Fix:**

1. In **Page Settings** → **Meta Description**
2. Click **"+ Add Field"** to bind a CMS field
3. Select the **Job Summary** or **Short Description** field
4. If no suitable summary field exists, create one in the CMS Collection structure:
   - Field name: `Functie samenvatting` (Job summary)
   - Type: Plain text
   - Max length: 160 characters

---

## 6. Per-Post CMS Content Requirements

After applying all template-level fixes above, each individual job posting needs to be reviewed in the CMS Editor.

### Checklist Per Job Posting

| Field | Action | Example |
|-------|--------|---------|
| **Job Title** (→ H1) | Populate with descriptive title | "Monteur Buitendienst - Regio Rotterdam" |
| **Section headings** (→ H2, after template fix) | Populate all CMS-bound headings | "Wat ga je doen", "Wat breng je mee", "Wat bieden wij" |
| **Job summary** (→ meta description) | Write 120-155 char summary | "Als Monteur Buitendienst bij A. Nobel & Zn werk je aan maritieme installaties in de regio Rotterdam." |
| **Slug** | Verify it is descriptive and lowercase | `monteur-buitendienst-rotterdam` |
| **OG Image** | Set a relevant image for social sharing | Company photo or job-specific image |

### Example: Complete Job Posting Fields

```
Title:            Monteur Buitendienst
Slug:             monteur-buitendienst
Summary:          Word Monteur Buitendienst bij A. Nobel & Zn. Werk aan maritieme 
                  installaties in de Rotterdamse haven. Ervaring met hydrauliek vereist.

Section Headings:
  H2:             Over de functie
  H2:             Wat ga je doen
  H2:             Wat breng je mee
  H2:             Wat bieden wij
```

---

## 7. Target Heading Hierarchy After All Fixes

```
BEFORE (current, broken):
=========================================
H1: [Job Title]                          ← CMS-bound, often empty
  H2: (empty)                            ← CMS-bound, unpopulated
  H2: (empty)                            ← CMS-bound, unpopulated
  H2: (empty)                            ← CMS-bound, unpopulated
  H3: (navigation/misc)
  H6: Wat ga je doen                     ← WRONG TAG (skips H2-H5)
  H6: Wat breng je mee                   ← WRONG TAG
  H6: Wat bieden wij                     ← WRONG TAG
  H6: [section]                          ← WRONG TAG
  H6: [section]                          ← WRONG TAG
  H6: [section]                          ← WRONG TAG

AFTER (target, correct):
=========================================
H1: Monteur Buitendienst                 ← Populated via CMS
  H2: Over de functie                    ← Populated via CMS
  H2: Wat ga je doen                     ← Changed from H6, populated
  H2: Wat breng je mee                   ← Changed from H6, populated
  H2: Wat bieden wij                     ← Changed from H6, populated
  H2: [additional sections as needed]    ← Changed from H6, populated
  H2: Solliciteren                       ← Populated via CMS
```

Key changes:
- **H1** populated with job title
- **H6 → H2** for all job section headings (6 elements)
- **Empty H2s** populated with meaningful content OR converted to non-heading tags
- **Dual-H2 pattern** fixed (second H2 → `<span>`) if present
- Clean, sequential hierarchy: H1 → H2 (no level skipping)

---

## 8. Verification Steps

After applying all fixes and publishing:

### Template-Level Checks

- [ ] **"Back to overview" link** — Click "Terug naar alle vacatures" on any job posting. Must go to `werkenbij.html`, NOT `blog.html`
- [ ] **Both link instances** — Verify both instances of the link are fixed (check by scrolling through the full page)
- [ ] **H6 → H2 conversion** — View page source, search for `<h6`. Should return 0 results on the vacature template
- [ ] **Heading hierarchy** — Use a browser extension (e.g., HeadingsMap, WAVE) to verify clean H1 → H2 flow with no level skipping
- [ ] **Canonical tag** — View page source, verify `<link rel="canonical" href="https://anobel.com/nl/werkenbij/[slug]" />`
- [ ] **Hreflang tags** — View page source, verify all three hreflang links (nl, en, x-default) with correct dynamic slugs
- [ ] **Title tag** — Check browser tab shows "[Job Title] | Vacature | A. Nobel & Zn"
- [ ] **Meta description** — Inspect `<meta name="description">` in page source. Should show the job summary text

### Per-Post Checks (Repeat for Each Job Posting)

- [ ] **H1 not empty** — Page has a visible H1 with the job title
- [ ] **Section headings populated** — All H2s have content (no empty headings)
- [ ] **Slug is descriptive** — URL reads as `/werkenbij/monteur-buitendienst`, not `/werkenbij/untitled-1`
- [ ] **Meta description unique** — Each posting has its own meta description, not a generic one

### Google Search Console (1-2 Weeks After Publishing)

- [ ] Submit updated URLs for re-indexing via the URL Inspection tool
- [ ] Monitor **Coverage** report for any new indexing issues
- [ ] Check **Enhancements** → **Job postings** for structured data opportunities (future improvement)

---

## 9. Implementation Order

For maximum efficiency, follow this sequence:

| Step | Task | Time | Type |
|------|------|------|------|
| 1 | Fix "Back to overview" link (both instances) | 5 min | Designer |
| 2 | Change 6x H6 → H2 | 10 min | Designer |
| 3 | Fix dual-H2 pattern (if present) | 10 min | Designer |
| 4 | Bind title tag to CMS field + suffix | 5 min | Page Settings |
| 5 | Bind meta description to CMS field | 5 min | Page Settings |
| 6 | Add canonical tag in custom code | 5 min | Page Settings |
| 7 | Add hreflang tags in custom code | 5 min | Page Settings |
| 8 | Publish and verify template fixes | 15 min | Live site |
| 9 | Populate CMS fields per job posting | 60-90 min | CMS Editor |
| 10 | Final verification of all postings | 15 min | Live site |

**Total estimated time:** 2-3 hours (depending on number of active job postings)

---

## Related Guides

- [00 — Master SEO Implementation Guide](./00_master_seo_implementation_guide.md) — Central hub and priority matrix
- [02 — H1 Structure Guide](./02_h1_structure_guide.md) — H1 issues affecting all pages
- [03 — H2 Structure Guide](./03_h2_structure_guide.md) — H2 issues and dual-H2 pattern
- [04 — Heading Semantic Guide](./04_heading_semantic_guide.md) — Per-page heading reference (includes vacature)
- [11 — Internal Linking Guide](./11_internal_linking_guide.md) — Site-wide internal link fixes
