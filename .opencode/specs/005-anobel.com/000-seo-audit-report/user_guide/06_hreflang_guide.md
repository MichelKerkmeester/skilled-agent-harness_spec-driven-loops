# Hreflang Tags SEO Guide for anobel.com

> Detailed guide for implementing missing hreflang x-default tags identified in the SEO audit. Priority: P2 HIGH. Pages affected: 14 (24%).

---

## Executive Summary

### Issue Identified

| Issue | Severity | Pages Affected | Impact |
|-------|----------|----------------|--------|
| **Missing hreflang x-default** | High | 14 pages (24%) | Search engines cannot determine the default language version, risking wrong language shown to users |

### What This Means

anobel.com serves content in **Dutch (NL)** and **English (EN)**. Hreflang tags tell Google which language version of a page to show to which users. Currently, 14 pages are missing the `x-default` tag, which acts as the fallback — it tells search engines "if you don't know the user's language, show them this version."

Without correct hreflang tags:
- Dutch users may land on the English page (and vice versa)
- Google may treat NL and EN pages as duplicate content
- Search rankings can split between language versions instead of consolidating

---

## Why Hreflang Tags Matter

### The Problem They Solve

anobel.com has two language versions of every page:

```
https://anobel.com/nl/contact    ← Dutch version
https://anobel.com/en/contact    ← English version
```

Without hreflang tags, Google sees these as **two separate pages with very similar layouts**. It has no way to know they are translations of each other. This causes:

1. **Wrong language in search results** — A Dutch user searching on google.nl might see the English page
2. **Diluted rankings** — Instead of one strong page, ranking signals split across two URLs
3. **Wasted crawl budget** — Google may crawl both versions without understanding the relationship

### What Hreflang Tags Do

Hreflang tags are small pieces of HTML placed in the `<head>` of each page. They explicitly tell search engines:

- "This page has a Dutch version at this URL"
- "This page has an English version at this URL"
- "If you're unsure which to show, use this URL as the default"

Think of it as a **signpost system** — every page points to all its language versions, including itself.

---

## How Hreflang Tags Work

### The 3-Tag Set

Every page on anobel.com needs exactly **3 hreflang tags**:

```
┌─────────────────────────────────────────────────────────────────┐
│  Tag 1:  hreflang="nl"         → Points to the Dutch page      │
│  Tag 2:  hreflang="en"         → Points to the English page    │
│  Tag 3:  hreflang="x-default"  → Points to the fallback page   │
│                                   (= the NL version for Nobel)  │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Example

For the Contact page, the **Dutch page** (`/nl/contact`) contains:

```html
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/contact" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/contact" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/contact" />
```

And the **English page** (`/en/contact`) contains the **exact same 3 tags**:

```html
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/contact" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/contact" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/contact" />
```

Notice: **both pages have identical hreflang tags**. This is called the reciprocal requirement — each page must reference the other AND itself.

---

## Rules for Correct Implementation

### The 5 Rules

| # | Rule | Detail |
|---|------|--------|
| 1 | **Every page needs 3 hreflang tags** | `nl`, `en`, and `x-default` — no exceptions for bilingual pages |
| 2 | **x-default points to the NL version** | Dutch is Nobel's primary language; this is the fallback for all unmatched users |
| 3 | **URLs must exactly match canonical URLs** | If the canonical is `https://anobel.com/nl/contact`, the hreflang must use that exact URL — no trailing slashes, no `www.`, no `http://` |
| 4 | **Reciprocal linking is required** | The NL page must reference the EN page, AND the EN page must reference the NL page. Both must also reference themselves |
| 5 | **Use absolute URLs with https://** | Always use the full URL starting with `https://anobel.com` — never relative paths like `/nl/contact` |

### Common Pitfall: Canonical Mismatch

The hreflang URL **must match** the canonical URL on that page. If the canonical says:

```html
<link rel="canonical" href="https://anobel.com/nl/contact" />
```

Then the hreflang must use `https://anobel.com/nl/contact` — not `https://anobel.com/nl/contact/` (trailing slash) or `https://www.anobel.com/nl/contact`.

---

## Page-by-Page Implementation

### Static Pages

Each row shows the NL/EN pair and the exact 3 hreflang tags to add. **Both the NL and EN page in each pair get the same 3 tags.**

| Page | NL URL | EN URL | hreflang Tags (add to BOTH pages) |
|------|--------|--------|-----------------------------------|
| **Homepage** | `/nl` | `/en` | `nl` → `https://anobel.com/nl` · `en` → `https://anobel.com/en` · `x-default` → `https://anobel.com/nl` |
| **Contact** | `/nl/contact` | `/en/contact` | `nl` → `https://anobel.com/nl/contact` · `en` → `https://anobel.com/en/contact` · `x-default` → `https://anobel.com/nl/contact` |
| **Scheepsbunkering** | `/nl/scheepsbunkering` | `/en/bunkering` | `nl` → `https://anobel.com/nl/scheepsbunkering` · `en` → `https://anobel.com/en/bunkering` · `x-default` → `https://anobel.com/nl/scheepsbunkering` |
| **Filtratie** | `/nl/filtratie` | `/en/filtration` | `nl` → `https://anobel.com/nl/filtratie` · `en` → `https://anobel.com/en/filtration` · `x-default` → `https://anobel.com/nl/filtratie` |
| **Scheepsuitrusting** | `/nl/scheepsuitrusting` | `/en/equipment` | `nl` → `https://anobel.com/nl/scheepsuitrusting` · `en` → `https://anobel.com/en/equipment` · `x-default` → `https://anobel.com/nl/scheepsuitrusting` |
| **Maatwerk** | `/nl/maatwerk` | `/en/customization` | `nl` → `https://anobel.com/nl/maatwerk` · `en` → `https://anobel.com/en/customization` · `x-default` → `https://anobel.com/nl/maatwerk` |
| **Webshop** | `/nl/webshop` | `/en/webshop` | `nl` → `https://anobel.com/nl/webshop` · `en` → `https://anobel.com/en/webshop` · `x-default` → `https://anobel.com/nl/webshop` |
| **Dit is Nobel** | `/nl/dit-is-nobel` | `/en/this-is-nobel` | `nl` → `https://anobel.com/nl/dit-is-nobel` · `en` → `https://anobel.com/en/this-is-nobel` · `x-default` → `https://anobel.com/nl/dit-is-nobel` |
| **ISPS** | `/nl/isps` | `/en/isps` | `nl` → `https://anobel.com/nl/isps` · `en` → `https://anobel.com/en/isps` · `x-default` → `https://anobel.com/nl/isps` |
| **Team** | `/nl/team` | `/en/team` | `nl` → `https://anobel.com/nl/team` · `en` → `https://anobel.com/en/team` · `x-default` → `https://anobel.com/nl/team` |
| **Locatie** | `/nl/locatie` | `/en/location` | `nl` → `https://anobel.com/nl/locatie` · `en` → `https://anobel.com/en/location` · `x-default` → `https://anobel.com/nl/locatie` |
| **Werkenbij** | `/nl/werkenbij` | `/en/careers` | `nl` → `https://anobel.com/nl/werkenbij` · `en` → `https://anobel.com/en/careers` · `x-default` → `https://anobel.com/nl/werkenbij` |
| **Blog** | `/nl/blog` | `/en/blog` | `nl` → `https://anobel.com/nl/blog` · `en` → `https://anobel.com/en/blog` · `x-default` → `https://anobel.com/nl/blog` |
| **Brochures** | `/nl/brochures` | `/en/brochures` | `nl` → `https://anobel.com/nl/brochures` · `en` → `https://anobel.com/en/brochures` · `x-default` → `https://anobel.com/nl/brochures` |
| **Voorwaarden** | `/nl/voorwaarden` | `/en/terms` | `nl` → `https://anobel.com/nl/voorwaarden` · `en` → `https://anobel.com/en/terms` · `x-default` → `https://anobel.com/nl/voorwaarden` |

### CMS Template Pages (Dynamic)

These use Webflow's dynamic binding to generate the slug automatically.

| Template | NL Pattern | EN Pattern | Binding Method |
|----------|-----------|-----------|----------------|
| **Blog Post** | `/nl/blog/[slug]` | `/en/blog/[slug]` | CMS slug field via `{{wf {"path":"slug","type":"PlainText"} }}` |
| **Vacature** | `/nl/werkenbij/[slug]` | `/en/careers/[slug]` | CMS slug field via `{{wf {"path":"slug","type":"PlainText"} }}` |

> **Important:** CMS templates generate hreflang tags dynamically for each CMS item. The slug must be identical in both language collections for this to work. See the Code Templates section below for the exact dynamic code.

### Utility Pages (No Hreflang Needed)

| Page | Reason |
|------|--------|
| 404 (Not Found) | Should have `<meta name="robots" content="noindex">` — no hreflang needed |
| 401 (Unauthorized) | Should have `<meta name="robots" content="noindex">` — no hreflang needed |
| Search Results | Should have `<meta name="robots" content="noindex">` — no hreflang needed |

These pages are not indexed by search engines, so language annotations are unnecessary.

---

## How to Add in Webflow

### Step-by-Step for Static Pages

1. **Open Webflow Designer** and navigate to the page you want to edit
2. Click the **gear icon** (Page Settings) in the Pages panel
3. Scroll down to **Custom Code**
4. In the **Inside `<head>` tag** field, paste the 3-tag hreflang block (see Code Templates below)
5. Click **Save** and close Page Settings
6. **Repeat** for the corresponding language page (e.g., after doing `/nl/contact`, also do `/en/contact` with the same tags)
7. **Publish** the site for changes to go live

### Step-by-Step for CMS Template Pages

1. **Open Webflow Designer** and navigate to the CMS **Collection Page Template** (e.g., Blog Post template)
2. Click the **gear icon** (Page Settings) for the template
3. Scroll down to **Custom Code**
4. In the **Inside `<head>` tag** field, paste the **dynamic** hreflang block that uses the Webflow CMS binding (see Code Templates below)
5. Click **Save** and **Publish**

> **Note:** In Webflow, CMS template custom code applies to all items in that collection. The dynamic binding `{{wf {"path":"slug","type":"PlainText"} }}` automatically inserts each item's slug.

---

## Code Templates

Copy-paste these blocks directly into Webflow's **Inside `<head>` tag** field.

### Static Pages

#### Homepage — NL page (`/nl`) AND EN page (`/en`)

```html
<!-- Hreflang: Homepage -->
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl" />
```

#### Contact — NL page (`/nl/contact`) AND EN page (`/en/contact`)

```html
<!-- Hreflang: Contact -->
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/contact" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/contact" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/contact" />
```

#### Scheepsbunkering — NL page (`/nl/scheepsbunkering`) AND EN page (`/en/bunkering`)

```html
<!-- Hreflang: Scheepsbunkering / Bunkering -->
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/scheepsbunkering" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/bunkering" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/scheepsbunkering" />
```

#### Filtratie — NL page (`/nl/filtratie`) AND EN page (`/en/filtration`)

```html
<!-- Hreflang: Filtratie / Filtration -->
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/filtratie" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/filtration" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/filtratie" />
```

#### Scheepsuitrusting — NL page (`/nl/scheepsuitrusting`) AND EN page (`/en/equipment`)

```html
<!-- Hreflang: Scheepsuitrusting / Equipment -->
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/scheepsuitrusting" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/equipment" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/scheepsuitrusting" />
```

#### Maatwerk — NL page (`/nl/maatwerk`) AND EN page (`/en/customization`)

```html
<!-- Hreflang: Maatwerk / Customization -->
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/maatwerk" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/customization" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/maatwerk" />
```

#### Webshop — NL page (`/nl/webshop`) AND EN page (`/en/webshop`)

```html
<!-- Hreflang: Webshop -->
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/webshop" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/webshop" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/webshop" />
```

#### Dit is Nobel — NL page (`/nl/dit-is-nobel`) AND EN page (`/en/this-is-nobel`)

```html
<!-- Hreflang: Dit is Nobel / This is Nobel -->
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/dit-is-nobel" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/this-is-nobel" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/dit-is-nobel" />
```

#### ISPS — NL page (`/nl/isps`) AND EN page (`/en/isps`)

```html
<!-- Hreflang: ISPS -->
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/isps" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/isps" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/isps" />
```

#### Team — NL page (`/nl/team`) AND EN page (`/en/team`)

```html
<!-- Hreflang: Team -->
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/team" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/team" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/team" />
```

#### Locatie — NL page (`/nl/locatie`) AND EN page (`/en/location`)

```html
<!-- Hreflang: Locatie / Location -->
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/locatie" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/location" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/locatie" />
```

#### Werkenbij — NL page (`/nl/werkenbij`) AND EN page (`/en/careers`)

```html
<!-- Hreflang: Werkenbij / Careers -->
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/werkenbij" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/careers" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/werkenbij" />
```

#### Blog — NL page (`/nl/blog`) AND EN page (`/en/blog`)

```html
<!-- Hreflang: Blog -->
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/blog" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/blog" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/blog" />
```

#### Brochures — NL page (`/nl/brochures`) AND EN page (`/en/brochures`)

```html
<!-- Hreflang: Brochures -->
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/brochures" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/brochures" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/brochures" />
```

#### Voorwaarden — NL page (`/nl/voorwaarden`) AND EN page (`/en/terms`)

```html
<!-- Hreflang: Voorwaarden / Terms -->
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/voorwaarden" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/terms" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/voorwaarden" />
```

### CMS Template Pages (Dynamic)

#### Blog Post Template — NL CMS template

```html
<!-- Hreflang: Blog Post (NL template, dynamic slug) -->
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/blog/{{wf {"path":"slug","type":"PlainText"} }}" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/blog/{{wf {"path":"slug","type":"PlainText"} }}" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/blog/{{wf {"path":"slug","type":"PlainText"} }}" />
```

#### Blog Post Template — EN CMS template

```html
<!-- Hreflang: Blog Post (EN template, dynamic slug) -->
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/blog/{{wf {"path":"slug","type":"PlainText"} }}" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/blog/{{wf {"path":"slug","type":"PlainText"} }}" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/blog/{{wf {"path":"slug","type":"PlainText"} }}" />
```

#### Vacature Template — NL CMS template

```html
<!-- Hreflang: Vacature (NL template, dynamic slug) -->
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/werkenbij/{{wf {"path":"slug","type":"PlainText"} }}" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/careers/{{wf {"path":"slug","type":"PlainText"} }}" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/werkenbij/{{wf {"path":"slug","type":"PlainText"} }}" />
```

#### Vacature Template — EN CMS template

```html
<!-- Hreflang: Careers (EN template, dynamic slug) -->
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/werkenbij/{{wf {"path":"slug","type":"PlainText"} }}" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/careers/{{wf {"path":"slug","type":"PlainText"} }}" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/werkenbij/{{wf {"path":"slug","type":"PlainText"} }}" />
```

> **CMS Prerequisite:** For dynamic hreflang to work correctly, the blog post or vacature slug must be identical in both the NL and EN CMS collections. For example, if a Dutch blog post has slug `onderhoud-scheepsmotoren`, the corresponding English blog post must also have slug `onderhoud-scheepsmotoren`. If slugs differ between languages, you will need a reference field linking the NL and EN items, which requires a different approach.

---

## Verification Steps

After implementing hreflang tags, verify them using these methods:

### 1. View Page Source (Quick Check)

1. Open the page in Chrome (e.g., `https://anobel.com/nl/contact`)
2. Right-click anywhere on the page and select **View Page Source**
3. Press `Ctrl+F` (or `Cmd+F` on Mac) and search for `hreflang`
4. Confirm you see exactly 3 `<link rel="alternate" hreflang="...">` tags
5. Verify the URLs are correct and use `https://`
6. Repeat for the corresponding EN page — it should have the **same 3 tags**

### 2. Hreflang Validator Tool (Thorough Check)

1. Go to [https://technicalseo.com/tools/hreflang/](https://technicalseo.com/tools/hreflang/)
2. Enter a page URL (e.g., `https://anobel.com/nl/contact`)
3. The tool will:
   - Show all hreflang tags found on the page
   - Check reciprocal tags on the linked pages
   - Flag any errors (missing reciprocals, URL mismatches)
4. Fix any reported issues before moving to the next page

### 3. Google Search Console — International Targeting

1. Open [Google Search Console](https://search.google.com/search-console/)
2. Select the `anobel.com` property
3. Go to **Legacy tools and reports** > **International Targeting**
4. Check the **Language** tab for any hreflang errors
5. Note: GSC data can take days/weeks to update after changes

### 4. Bulk Validation Checklist

After implementing all pages, verify:

| Check | Pass? |
|-------|-------|
| Every NL page has 3 hreflang tags (nl, en, x-default) | |
| Every EN page has 3 hreflang tags (nl, en, x-default) | |
| x-default always points to the NL version | |
| All URLs use `https://anobel.com` (absolute, no trailing slash) | |
| NL and EN pages in each pair have identical hreflang tag sets | |
| Hreflang URLs match canonical URLs on those pages | |
| CMS template pages render dynamic slugs correctly in hreflang | |
| Utility pages (404, 401, search) do NOT have hreflang tags | |

---

## Common Mistakes

### 1. Non-Reciprocal Links

**Mistake:** Adding hreflang tags to the NL page but forgetting the EN page (or vice versa).

```
❌ NL page references EN page, but EN page doesn't reference NL page
✅ BOTH pages must contain the same set of hreflang tags
```

Google ignores hreflang tags that are not reciprocal. If `/nl/contact` says "my English version is `/en/contact`" but `/en/contact` does not say "my Dutch version is `/nl/contact`", Google treats both tags as invalid.

### 2. URL Mismatch with Canonical

**Mistake:** The hreflang URL differs from the canonical URL on the target page.

```
❌ hreflang says: href="https://anobel.com/nl/contact/"   (trailing slash)
   canonical says: href="https://anobel.com/nl/contact"    (no trailing slash)

✅ Both must be identical: https://anobel.com/nl/contact
```

Even a trailing slash difference will cause Google to ignore the hreflang tag.

### 3. Missing x-default

**Mistake:** Only adding `nl` and `en` hreflang tags without the `x-default` fallback.

```
❌ Only two tags:
   <link rel="alternate" hreflang="nl" href="..." />
   <link rel="alternate" hreflang="en" href="..." />

✅ Three tags (include x-default):
   <link rel="alternate" hreflang="nl" href="..." />
   <link rel="alternate" hreflang="en" href="..." />
   <link rel="alternate" hreflang="x-default" href="..." />
```

The `x-default` tells search engines what to show users whose language does not match nl or en. For anobel.com, this should always point to the NL version.

### 4. Using Relative URLs

**Mistake:** Using relative paths instead of absolute URLs.

```
❌ href="/nl/contact"
✅ href="https://anobel.com/nl/contact"
```

Hreflang tags require full absolute URLs including the protocol (`https://`) and domain.

### 5. Self-Referencing Omitted

**Mistake:** A page only references the other language but not itself.

```
❌ NL page only has:
   <link rel="alternate" hreflang="en" href="https://anobel.com/en/contact" />

✅ NL page must also reference itself:
   <link rel="alternate" hreflang="nl" href="https://anobel.com/nl/contact" />
   <link rel="alternate" hreflang="en" href="https://anobel.com/en/contact" />
   <link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/contact" />
```

Each page must include a self-referencing hreflang tag in addition to tags for the other language versions.

### 6. Different CMS Slugs Between Languages

**Mistake:** NL blog post has slug `scheepsmotoren` but EN version has slug `ship-engines`, breaking dynamic hreflang.

```
❌ NL: /nl/blog/scheepsmotoren  →  hreflang points to /en/blog/scheepsmotoren
   EN: /en/blog/ship-engines    →  URL doesn't exist = broken link

✅ Solution: Use identical slugs in both language collections
   NL: /nl/blog/scheepsmotoren
   EN: /en/blog/scheepsmotoren
```

If slugs must differ between languages, dynamic Webflow binding alone will not work. You would need a CMS reference field linking translations, which requires a more complex implementation.

---

## Implementation Priority

Recommended order for implementing hreflang tags:

| Priority | Pages | Reason |
|----------|-------|--------|
| **1st** | Homepage (`/nl`, `/en`) | Highest traffic, most important for SEO |
| **2nd** | Service pages (Scheepsbunkering, Filtratie, Scheepsuitrusting, Maatwerk) | Core business pages, likely ranking targets |
| **3rd** | About pages (Dit is Nobel, Team, Locatie, ISPS) | Supporting brand pages |
| **4th** | Blog index and CMS templates | Content marketing pages |
| **5th** | Remaining pages (Webshop, Werkenbij, Brochures, Voorwaarden, Contact) | Utility/secondary pages |

> **Estimated time:** 5-10 minutes per page pair (copy-paste the code template into both NL and EN page settings). Total for all static pages: approximately 2-3 hours.
