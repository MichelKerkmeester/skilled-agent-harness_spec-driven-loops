# Canonical Tags SEO Guide for anobel.com

> **Issue:** Missing canonical tags on 100% of pages (59/59 pages affected)
> **Severity:** CRITICAL (P1 -- highest priority)
> **Impact:** Duplicate content risk, diluted ranking signals, crawl budget waste
> **Affected Pages:** All 59 pages across NL and EN language versions
> **Domain:** `https://anobel.com`
> **Site Platform:** Webflow

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Why Canonical Tags Matter](#2-why-canonical-tags-matter)
3. [How Canonical Tags Work](#3-how-canonical-tags-work)
4. [Critical Bug: Maatwerk Page](#4-critical-bug-maatwerk-page)
5. [Page-by-Page Implementation](#5-page-by-page-implementation)
6. [How to Add Canonical Tags in Webflow](#6-how-to-add-canonical-tags-in-webflow)
7. [Code Templates](#7-code-templates)
8. [Verification Steps](#8-verification-steps)
9. [Common Mistakes to Avoid](#9-common-mistakes-to-avoid)

---

## 1. Executive Summary

The SEO audit of anobel.com revealed that **not a single page** on the website has a canonical tag. This is the **#1 most critical SEO issue** found during the audit.

### What does this mean?

| Metric | Value |
|---|---|
| Pages missing canonical tags | **59 out of 59 (100%)** |
| Priority level | **P1 -- Critical** |
| Estimated fix time | 2--3 hours |
| Pages affected | All static pages, all CMS pages, all utility pages |
| Languages affected | Both NL and EN |

### Why is this urgent?

Without canonical tags, Google sees every page as potentially duplicated content. Because anobel.com has two language versions (NL and EN), search engines may:

- **Index the wrong language version** for a given market
- **Split ranking power** between duplicate pages instead of concentrating it
- **Waste crawl budget** by re-crawling pages Google is confused about
- **Lower overall search visibility** across both Dutch and English results

### Additionally: a critical bug was found

The **Maatwerk** page currently has a **wrong canonical tag** pointing to the Scheepsuitrusting page. This actively tells Google to ignore the Maatwerk page entirely. See [Section 4](#4-critical-bug-maatwerk-page) for details and the fix.

---

## 2. Why Canonical Tags Matter

### The problem: search engines get confused

Think of anobel.com's website structure. Every page exists in two versions:

```
https://anobel.com/nl/scheepsbunkering   (Dutch version)
https://anobel.com/en/bunkering          (English version)
```

Without a canonical tag, Google has no clear signal about which URL is the "official" version of each page. Google might:

- Show the English page to Dutch searchers (or vice versa)
- Decide on its own which version to index (and pick the wrong one)
- Treat both versions as duplicates and penalize both

### The solution: self-referencing canonical tags

A canonical tag is a small piece of HTML code that says: **"This is the official URL for this page."**

Each page should point to **itself**:
- The NL page says "my canonical is the NL URL"
- The EN page says "my canonical is the EN URL"

This gives Google a clear, unambiguous signal about which URL to index for each language version.

### Business impact

| Without Canonicals | With Canonicals |
|---|---|
| Google guesses which page to show | Google knows exactly which page to show |
| Ranking power is diluted across URLs | Ranking power is concentrated on the right URL |
| Crawl budget is wasted on confusion | Crawl budget is used efficiently |
| Risk of wrong language in search results | Correct language shown to correct market |

---

## 3. How Canonical Tags Work

### What a canonical tag looks like

A canonical tag is a single line of HTML placed inside the `<head>` section of a page:

```html
<link rel="canonical" href="https://anobel.com/nl/scheepsbunkering" />
```

### Visual example

Here is how the canonical tag works for the Scheepsbunkering page:

```
Page: https://anobel.com/nl/scheepsbunkering
                    |
                    v
    <head>
        <link rel="canonical" href="https://anobel.com/nl/scheepsbunkering" />
    </head>
                    |
                    v
    Google reads: "The official URL for this page is
                   https://anobel.com/nl/scheepsbunkering"
```

And for the English counterpart:

```
Page: https://anobel.com/en/bunkering
                    |
                    v
    <head>
        <link rel="canonical" href="https://anobel.com/en/bunkering" />
    </head>
                    |
                    v
    Google reads: "The official URL for this page is
                   https://anobel.com/en/bunkering"
```

### The golden rule

> **Every canonical tag must be self-referencing.** The NL page's canonical points to the NL URL. The EN page's canonical points to the EN URL. A page should never point to a different page's URL (unless intentionally consolidating duplicate content).

---

## 4. Critical Bug: Maatwerk Page

> **BUG: WRONG CANONICAL -- IMMEDIATE FIX REQUIRED**
>
> The file `maatwerk.html` currently contains a canonical tag pointing to the **wrong page**.

### What is happening

| Detail | Value |
|---|---|
| Affected page | `/nl/maatwerk` |
| Source file | `maatwerk.html` |
| Current (WRONG) canonical | `https://anobel.com/nl/scheepsuitrusting` |
| Correct canonical | `https://anobel.com/nl/maatwerk` |

### What this bug does

This wrong canonical tag is actively telling Google:

> "Ignore the Maatwerk page. The official version of this content lives at /nl/scheepsuitrusting."

As a result, Google may:
- **De-index the Maatwerk page entirely** from search results
- **Not show** the Maatwerk page when people search for "maatwerk" or custom maritime solutions
- **Attribute** the Maatwerk page's content and links to the Scheepsuitrusting page instead

### How to fix it

**In Webflow**, open the Maatwerk page settings:

1. Go to **Pages** panel > find **Maatwerk**
2. Open **Page Settings** (gear icon)
3. Scroll to **Custom Code** > **Inside `<head>` tag**
4. Find the existing canonical tag
5. **Replace** the URL from `/nl/scheepsuitrusting` to `/nl/maatwerk`

**Change this:**
```html
<!-- WRONG - currently on maatwerk.html -->
<link rel="canonical" href="https://anobel.com/nl/scheepsuitrusting" />
```

**To this:**
```html
<!-- CORRECT - fix for maatwerk.html -->
<link rel="canonical" href="https://anobel.com/nl/maatwerk" />
```

**Do the same for the EN version** (`customization.html`):
```html
<link rel="canonical" href="https://anobel.com/en/customization" />
```

---

## 5. Page-by-Page Implementation

### 5.1 Static Pages -- Dutch (NL)

These pages each need a hardcoded canonical tag added in Webflow's Page Settings.

| # | Page Name | URL Path | Canonical URL to Add |
|---|---|---|---|
| 1 | Homepage (NL) | `/nl` | `https://anobel.com/nl` |
| 2 | Contact | `/nl/contact` | `https://anobel.com/nl/contact` |
| 3 | Scheepsbunkering | `/nl/scheepsbunkering` | `https://anobel.com/nl/scheepsbunkering` |
| 4 | Filtratie | `/nl/filtratie` | `https://anobel.com/nl/filtratie` |
| 5 | Scheepsuitrusting | `/nl/scheepsuitrusting` | `https://anobel.com/nl/scheepsuitrusting` |
| 6 | Maatwerk | `/nl/maatwerk` | `https://anobel.com/nl/maatwerk` |
| 7 | Webshop | `/nl/webshop` | `https://anobel.com/nl/webshop` |
| 8 | Dit is Nobel | `/nl/dit-is-nobel` | `https://anobel.com/nl/dit-is-nobel` |
| 9 | ISPS Kade | `/nl/isps` | `https://anobel.com/nl/isps` |
| 10 | Team | `/nl/team` | `https://anobel.com/nl/team` |
| 11 | Locatie | `/nl/locatie` | `https://anobel.com/nl/locatie` |
| 12 | Werkenbij | `/nl/werkenbij` | `https://anobel.com/nl/werkenbij` |
| 13 | Blog | `/nl/blog` | `https://anobel.com/nl/blog` |
| 14 | Brochures | `/nl/brochures` | `https://anobel.com/nl/brochures` |
| 15 | Voorwaarden | `/nl/voorwaarden` | `https://anobel.com/nl/voorwaarden` |

### 5.2 Static Pages -- English (EN)

| # | Page Name | URL Path | Canonical URL to Add |
|---|---|---|---|
| 1 | Homepage (EN) | `/en` | `https://anobel.com/en` |
| 2 | Contact | `/en/contact` | `https://anobel.com/en/contact` |
| 3 | Bunkering | `/en/bunkering` | `https://anobel.com/en/bunkering` |
| 4 | Filtration | `/en/filtration` | `https://anobel.com/en/filtration` |
| 5 | Equipment | `/en/equipment` | `https://anobel.com/en/equipment` |
| 6 | Customization | `/en/customization` | `https://anobel.com/en/customization` |
| 7 | Webshop | `/en/webshop` | `https://anobel.com/en/webshop` |
| 8 | This is Nobel | `/en/this-is-nobel` | `https://anobel.com/en/this-is-nobel` |
| 9 | ISPS | `/en/isps` | `https://anobel.com/en/isps` |
| 10 | Team | `/en/team` | `https://anobel.com/en/team` |
| 11 | Location | `/en/location` | `https://anobel.com/en/location` |
| 12 | Careers | `/en/careers` | `https://anobel.com/en/careers` |
| 13 | Blog | `/en/blog` | `https://anobel.com/en/blog` |
| 14 | Brochures | `/en/brochures` | `https://anobel.com/en/brochures` |
| 15 | Terms | `/en/terms` | `https://anobel.com/en/terms` |

### 5.3 CMS Template Pages (Dynamic Canonical)

These pages use Webflow's CMS and need a **dynamic** canonical tag that automatically includes the CMS item's slug.

| Template | Source File | NL Canonical Pattern | EN Canonical Pattern |
|---|---|---|---|
| Blog Post | `detail_blog.html` | `https://anobel.com/nl/blog/[slug]` | `https://anobel.com/en/blog/[slug]` |
| Vacature | `detail_vacatures.html` | `https://anobel.com/nl/werkenbij/[slug]` | `https://anobel.com/en/careers/[slug]` |

**Important:** For CMS pages, you do not manually type the slug. Instead, you use Webflow's dynamic binding syntax. See [Section 7](#7-code-templates) for the exact code to copy-paste.

### 5.4 Utility Pages

Utility pages should have **both** a `noindex` tag and a canonical tag.

| Page | Canonical URL | Additional Tag |
|---|---|---|
| 404 (NL) | `https://anobel.com/nl/404` | `<meta name="robots" content="noindex, nofollow" />` |
| 404 (EN) | `https://anobel.com/en/404` | `<meta name="robots" content="noindex, nofollow" />` |
| 401 (NL) | `https://anobel.com/nl/401` | `<meta name="robots" content="noindex, nofollow" />` |
| 401 (EN) | `https://anobel.com/en/401` | `<meta name="robots" content="noindex, nofollow" />` |
| Search (NL) | `https://anobel.com/nl/search` | `<meta name="robots" content="noindex, nofollow" />` |
| Search (EN) | `https://anobel.com/en/search` | `<meta name="robots" content="noindex, nofollow" />` |

---

## 6. How to Add Canonical Tags in Webflow

### For Static Pages (step-by-step)

**Step 1:** Open the Webflow Designer for anobel.com.

**Step 2:** Click the **Pages** panel (page icon) in the left sidebar.

**Step 3:** Hover over the page you want to edit (e.g., "Scheepsbunkering") and click the **gear icon** to open Page Settings.

**Step 4:** In the Page Settings panel, scroll down to the **Custom Code** section.

**Step 5:** Find the field labeled **Inside `<head>` tag**.

**Step 6:** Paste the canonical tag HTML for that specific page. For example, for the NL Scheepsbunkering page:

```html
<link rel="canonical" href="https://anobel.com/nl/scheepsbunkering" />
```

**Step 7:** Click **Save** (or close the panel -- Webflow auto-saves).

**Step 8:** Repeat for every static page listed in Section 5.1 and 5.2.

**Step 9:** **Publish** the site to make changes live.

### For CMS Template Pages (step-by-step)

CMS template pages work differently because each blog post or vacature has a unique slug. You need to use Webflow's **dynamic embed** syntax.

**Step 1:** In the Pages panel, find the CMS Collection page template (e.g., "Blog Posts Template" or the page named `detail_blog`).

**Step 2:** Click the **gear icon** to open its Page Settings.

**Step 3:** In the **Custom Code** > **Inside `<head>` tag** field, paste the dynamic canonical code.

For the NL blog template:
```html
<link rel="canonical" href="https://anobel.com/nl/blog/{{wf {"path":"slug","type":"PlainText"} }}" />
```

**How this works:** When Webflow renders each blog post, it replaces `{{wf {"path":"slug","type":"PlainText"} }}` with the actual slug of that blog post. For example, if you have a blog post with the slug `onderhoud-tips`, the rendered HTML will be:

```html
<link rel="canonical" href="https://anobel.com/nl/blog/onderhoud-tips" />
```

**Step 4:** Click **Save** and repeat for the EN template and the Vacature templates.

**Step 5:** **Publish** to make changes live.

### For Utility Pages (step-by-step)

Follow the same process as static pages, but add **two** tags in the `<head>` field:

```html
<meta name="robots" content="noindex, nofollow" />
<link rel="canonical" href="https://anobel.com/nl/404" />
```

---

## 7. Code Templates

Copy-paste these exact code snippets into the corresponding Webflow page's **Custom Code > Inside `<head>` tag** field.

### 7.1 Static Pages -- NL

**Homepage (NL):**
```html
<link rel="canonical" href="https://anobel.com/nl" />
```

**Contact:**
```html
<link rel="canonical" href="https://anobel.com/nl/contact" />
```

**Scheepsbunkering:**
```html
<link rel="canonical" href="https://anobel.com/nl/scheepsbunkering" />
```

**Filtratie:**
```html
<link rel="canonical" href="https://anobel.com/nl/filtratie" />
```

**Scheepsuitrusting:**
```html
<link rel="canonical" href="https://anobel.com/nl/scheepsuitrusting" />
```

**Maatwerk:**
```html
<link rel="canonical" href="https://anobel.com/nl/maatwerk" />
```

**Webshop:**
```html
<link rel="canonical" href="https://anobel.com/nl/webshop" />
```

**Dit is Nobel:**
```html
<link rel="canonical" href="https://anobel.com/nl/dit-is-nobel" />
```

**ISPS Kade:**
```html
<link rel="canonical" href="https://anobel.com/nl/isps" />
```

**Team:**
```html
<link rel="canonical" href="https://anobel.com/nl/team" />
```

**Locatie:**
```html
<link rel="canonical" href="https://anobel.com/nl/locatie" />
```

**Werkenbij:**
```html
<link rel="canonical" href="https://anobel.com/nl/werkenbij" />
```

**Blog:**
```html
<link rel="canonical" href="https://anobel.com/nl/blog" />
```

**Brochures:**
```html
<link rel="canonical" href="https://anobel.com/nl/brochures" />
```

**Voorwaarden:**
```html
<link rel="canonical" href="https://anobel.com/nl/voorwaarden" />
```

### 7.2 Static Pages -- EN

**Homepage (EN):**
```html
<link rel="canonical" href="https://anobel.com/en" />
```

**Contact:**
```html
<link rel="canonical" href="https://anobel.com/en/contact" />
```

**Bunkering:**
```html
<link rel="canonical" href="https://anobel.com/en/bunkering" />
```

**Filtration:**
```html
<link rel="canonical" href="https://anobel.com/en/filtration" />
```

**Equipment:**
```html
<link rel="canonical" href="https://anobel.com/en/equipment" />
```

**Customization:**
```html
<link rel="canonical" href="https://anobel.com/en/customization" />
```

**Webshop:**
```html
<link rel="canonical" href="https://anobel.com/en/webshop" />
```

**This is Nobel:**
```html
<link rel="canonical" href="https://anobel.com/en/this-is-nobel" />
```

**ISPS:**
```html
<link rel="canonical" href="https://anobel.com/en/isps" />
```

**Team:**
```html
<link rel="canonical" href="https://anobel.com/en/team" />
```

**Location:**
```html
<link rel="canonical" href="https://anobel.com/en/location" />
```

**Careers:**
```html
<link rel="canonical" href="https://anobel.com/en/careers" />
```

**Blog:**
```html
<link rel="canonical" href="https://anobel.com/en/blog" />
```

**Brochures:**
```html
<link rel="canonical" href="https://anobel.com/en/brochures" />
```

**Terms:**
```html
<link rel="canonical" href="https://anobel.com/en/terms" />
```

### 7.3 CMS Templates -- Blog

**NL Blog Template** (`detail_blog.html`):
```html
<link rel="canonical" href="https://anobel.com/nl/blog/{{wf {"path":"slug","type":"PlainText"} }}" />
```

**EN Blog Template** (`detail_blog.html`):
```html
<link rel="canonical" href="https://anobel.com/en/blog/{{wf {"path":"slug","type":"PlainText"} }}" />
```

### 7.4 CMS Templates -- Vacatures / Careers

**NL Vacature Template** (`detail_vacatures.html`):
```html
<link rel="canonical" href="https://anobel.com/nl/werkenbij/{{wf {"path":"slug","type":"PlainText"} }}" />
```

**EN Careers Template** (`detail_vacatures.html`):
```html
<link rel="canonical" href="https://anobel.com/en/careers/{{wf {"path":"slug","type":"PlainText"} }}" />
```

### 7.5 Utility Pages

**404 Page (NL):**
```html
<meta name="robots" content="noindex, nofollow" />
<link rel="canonical" href="https://anobel.com/nl/404" />
```

**404 Page (EN):**
```html
<meta name="robots" content="noindex, nofollow" />
<link rel="canonical" href="https://anobel.com/en/404" />
```

**401 Page (NL):**
```html
<meta name="robots" content="noindex, nofollow" />
<link rel="canonical" href="https://anobel.com/nl/401" />
```

**401 Page (EN):**
```html
<meta name="robots" content="noindex, nofollow" />
<link rel="canonical" href="https://anobel.com/en/401" />
```

**Search Page (NL):**
```html
<meta name="robots" content="noindex, nofollow" />
<link rel="canonical" href="https://anobel.com/nl/search" />
```

**Search Page (EN):**
```html
<meta name="robots" content="noindex, nofollow" />
<link rel="canonical" href="https://anobel.com/en/search" />
```

---

## 8. Verification Steps

After adding canonical tags and publishing the site, verify that everything is working correctly.

### Method 1: View Page Source (quickest)

1. Open any page on anobel.com in your browser (e.g., `https://anobel.com/nl/scheepsbunkering`)
2. Right-click anywhere on the page and select **View Page Source** (or press `Ctrl+U` / `Cmd+Option+U`)
3. Press `Ctrl+F` / `Cmd+F` to open the search bar
4. Search for `canonical`
5. You should find exactly one result that looks like:
   ```html
   <link rel="canonical" href="https://anobel.com/nl/scheepsbunkering" />
   ```
6. Verify the URL in the `href` matches the page you are currently on

**What to check:**
| Check | Pass | Fail |
|---|---|---|
| Canonical tag exists | Found one `<link rel="canonical" ...>` | No results for "canonical" |
| URL is correct | `href` matches the current page URL | `href` points to a different page |
| Protocol is HTTPS | URL starts with `https://` | URL starts with `http://` |
| No trailing slash | URL ends with the page path (e.g., `/nl/contact`) | URL has an extra `/` at the end |
| Only one canonical | Exactly 1 canonical tag found | Multiple canonical tags found |

### Method 2: Google Search Console (GSC)

1. Open [Google Search Console](https://search.google.com/search-console) for `anobel.com`
2. Go to **URL Inspection** (top search bar)
3. Enter a page URL (e.g., `https://anobel.com/nl/scheepsbunkering`)
4. Click **Enter** and wait for the inspection
5. Under the results, look for **Google-selected canonical**
6. It should show the same URL you entered
7. If it shows a different URL, there may be a canonical conflict

**Check all important pages in GSC after implementation:**

| Page to Check | Expected Google-Selected Canonical |
|---|---|
| `https://anobel.com/nl` | `https://anobel.com/nl` |
| `https://anobel.com/en` | `https://anobel.com/en` |
| `https://anobel.com/nl/scheepsbunkering` | `https://anobel.com/nl/scheepsbunkering` |
| `https://anobel.com/nl/maatwerk` | `https://anobel.com/nl/maatwerk` |
| `https://anobel.com/en/bunkering` | `https://anobel.com/en/bunkering` |

> **Note:** It can take days or weeks for Google to re-process canonical tags. Do not panic if GSC shows different values immediately after publishing. Check again after 1--2 weeks.

### Method 3: Screaming Frog SEO Spider

For a comprehensive audit of all pages at once:

1. Open Screaming Frog SEO Spider
2. Enter `https://anobel.com` in the URL bar and click **Start**
3. Wait for the crawl to complete
4. Go to the **Canonicals** tab (or filter by the canonical column)
5. For each page, verify:
   - **Canonical 1** column shows the correct self-referencing URL
   - No pages show "Canonicalised" status (meaning they point elsewhere) unless intentional
   - No pages show "Missing" in the canonical column

**Export the canonical report** and compare against the tables in Section 5 of this guide.

---

## 9. Common Mistakes to Avoid

### Mistake 1: HTTP instead of HTTPS

```html
<!-- WRONG: http protocol -->
<link rel="canonical" href="http://anobel.com/nl/scheepsbunkering" />

<!-- CORRECT: https protocol -->
<link rel="canonical" href="https://anobel.com/nl/scheepsbunkering" />
```

**Why it matters:** Google treats `http://` and `https://` as different URLs. If your site runs on HTTPS (which anobel.com does), the canonical must also use HTTPS. A mismatch confuses Google about which version is official.

### Mistake 2: Adding www to the domain

```html
<!-- WRONG: www subdomain -->
<link rel="canonical" href="https://www.anobel.com/nl/scheepsbunkering" />

<!-- CORRECT: no www -->
<link rel="canonical" href="https://anobel.com/nl/scheepsbunkering" />
```

**Why it matters:** The anobel.com site does not use `www`. Adding it creates a URL that does not match the actual site, which defeats the purpose of the canonical tag.

### Mistake 3: Trailing slash inconsistency

```html
<!-- WRONG: trailing slash added -->
<link rel="canonical" href="https://anobel.com/nl/scheepsbunkering/" />

<!-- CORRECT: no trailing slash -->
<link rel="canonical" href="https://anobel.com/nl/scheepsbunkering" />
```

**Why it matters:** Google may treat `/scheepsbunkering` and `/scheepsbunkering/` as different URLs. Pick one format and use it consistently everywhere. The anobel.com URLs do not use trailing slashes.

### Mistake 4: Pointing to the wrong language version

```html
<!-- WRONG: NL page pointing to EN canonical -->
<!-- On page: /nl/scheepsbunkering -->
<link rel="canonical" href="https://anobel.com/en/bunkering" />

<!-- CORRECT: NL page pointing to NL canonical -->
<!-- On page: /nl/scheepsbunkering -->
<link rel="canonical" href="https://anobel.com/nl/scheepsbunkering" />
```

**Why it matters:** If the Dutch page's canonical points to the English version, Google will de-index the Dutch page and only show the English version. Each language version must have a self-referencing canonical.

### Mistake 5: Pointing to a different page entirely (the Maatwerk bug)

```html
<!-- WRONG: Maatwerk page pointing to Scheepsuitrusting -->
<!-- On page: /nl/maatwerk -->
<link rel="canonical" href="https://anobel.com/nl/scheepsuitrusting" />

<!-- CORRECT: Maatwerk page pointing to itself -->
<!-- On page: /nl/maatwerk -->
<link rel="canonical" href="https://anobel.com/nl/maatwerk" />
```

**Why it matters:** This is the exact bug currently live on anobel.com. It tells Google to completely ignore the Maatwerk page and treat Scheepsuitrusting as the canonical version. This means the Maatwerk page will not appear in search results at all.

### Mistake 6: Multiple canonical tags on one page

```html
<!-- WRONG: two canonical tags -->
<link rel="canonical" href="https://anobel.com/nl/scheepsbunkering" />
<link rel="canonical" href="https://anobel.com/en/bunkering" />

<!-- CORRECT: only one canonical tag per page -->
<link rel="canonical" href="https://anobel.com/nl/scheepsbunkering" />
```

**Why it matters:** If Google finds multiple canonical tags, it may ignore all of them. Each page must have exactly one canonical tag.

### Mistake 7: Using a relative URL instead of an absolute URL

```html
<!-- WRONG: relative URL -->
<link rel="canonical" href="/nl/scheepsbunkering" />

<!-- CORRECT: absolute URL with full domain -->
<link rel="canonical" href="https://anobel.com/nl/scheepsbunkering" />
```

**Why it matters:** Canonical tags must always use a full, absolute URL including the protocol (`https://`) and domain (`anobel.com`). Relative URLs can be misinterpreted.

---

## Quick Reference Checklist

Use this checklist when implementing canonical tags across the site:

- [ ] **Fix the Maatwerk bug first** -- change canonical from `/nl/scheepsuitrusting` to `/nl/maatwerk`
- [ ] **All 15 NL static pages** have self-referencing canonical tags
- [ ] **All 15 EN static pages** have self-referencing canonical tags
- [ ] **Blog template (NL)** has dynamic canonical with `{{wf {"path":"slug","type":"PlainText"} }}`
- [ ] **Blog template (EN)** has dynamic canonical with `{{wf {"path":"slug","type":"PlainText"} }}`
- [ ] **Vacature template (NL)** has dynamic canonical with `{{wf {"path":"slug","type":"PlainText"} }}`
- [ ] **Careers template (EN)** has dynamic canonical with `{{wf {"path":"slug","type":"PlainText"} }}`
- [ ] **Utility pages** (404, 401, search) have both `noindex` and canonical tags
- [ ] All URLs use `https://` (not `http://`)
- [ ] All URLs use `anobel.com` (not `www.anobel.com`)
- [ ] No trailing slashes on any canonical URL
- [ ] Each page has exactly **one** canonical tag
- [ ] Site is **published** after all changes
- [ ] **View-source verification** done on at least 5 representative pages
- [ ] **GSC URL Inspection** scheduled for key pages after 1--2 weeks
