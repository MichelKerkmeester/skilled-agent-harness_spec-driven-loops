# Master SEO Implementation Guide for anobel.com

> **Document Type:** Master Implementation Guide
> **Created:** 2026-01-24
> **Status:** Active
> **Purpose:** Central hub for all SEO fixes identified in the Getting the Market audit

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Priority Matrix](#priority-matrix)
3. [Implementation Timeline](#implementation-timeline)
4. [Quick Start Checklist](#quick-start-checklist)
5. [Page-by-Page Master Checklist](#page-by-page-master-checklist)
6. [Webflow-Specific Workflow](#webflow-specific-workflow)
7. [Guide Index](#guide-index)
8. [Verification Checklist](#verification-checklist)
9. [Monitoring Setup](#monitoring-setup)
10. [Appendix: Issue Reference](#appendix-issue-reference)

---

## Executive Summary

### Audit Overview

| Metric | Value |
|--------|-------|
| **Audit Date** | January 2026 |
| **Auditor** | Getting the Market |
| **Pages Crawled** | 59 |
| **Issue Types Found** | 26 |
| **Critical/Warning Issues** | 14 |
| **Opportunity Issues** | 12 |

### Key Findings at a Glance

```
CRITICAL (Fix Week 1)
=======================
[!] 100% of pages missing canonical tags (59 pages)
[!] 100% of pages have H1 structure issues (59 pages)
[!] 100% of pages have H2 issues (duplicate/multiple)

HIGH (Fix Week 2)
===================
[!] 100% of pages missing anchor text on internal links
[!] 24% of pages missing hreflang x-default (14 pages)
[!] Internal 4XX errors found (2 pages, 571 link instances)

MEDIUM (Fix Weeks 3-4)
======================
[!] 94% of pages missing security headers
[!] 98% of images missing size attributes (184 images)
[!] 21% of images missing alt text (40 images)
[!] Title/meta description optimization needed
```

### Current Traffic Context

- **Monthly Sessions:** 802
- **Monthly Users:** 450
- **Traffic Source:** 100% branded keywords (no non-branded visibility)
- **Engagement Rate:** 53.12%

**Competitive Gap:** anobel.com ranks only for branded keywords while competitors capture 25-77% of traffic from non-branded (product/industry) keywords.

---

## Priority Matrix

### Visual Priority Overview

```
                    IMPACT
                    High         Medium       Low
              +------------+------------+------------+
       High   |   P1       |   P1       |   P2       |
              | Canonicals | Hreflang   | Readability|
  URGENCY     | H1/H2      | 4XX Errors |            |
              +------------+------------+------------+
       Medium |   P2       |   P2       |   P3       |
              | Anchor Text| Security   | Large      |
              | Internal   | Headers    | Images     |
              | Links      | Alt Text   |            |
              +------------+------------+------------+
       Low    |   P3       |   P3       |   P4       |
              | Title Opt. | Image Size | Monitoring |
              | Meta Desc  | Cross-Orig |            |
              +------------+------------+------------+
```

### Priority Definitions

| Priority | Level | Response Time | Description |
|----------|-------|---------------|-------------|
| **P1** | Critical | Week 1 | Directly impacts indexability and rankings |
| **P2** | High | Week 2 | Significantly affects SEO performance |
| **P3** | Medium | Weeks 3-4 | Optimization opportunities |
| **P4** | Ongoing | Monthly | Maintenance and monitoring |

### Complete Issue Priority Table

| Priority | Issue | Pages Affected | % | Est. Time |
|----------|-------|----------------|---|-----------|
| **P1** | Missing Canonical Tags | 59 | 100% | 2-3 hours |
| **P1** | H1 Non-Sequential | 59 | 100% | 4-6 hours |
| **P1** | H2 Duplicate/Multiple | 59 | 100% | 4-6 hours |
| **P2** | Links With No Anchor Text | 59 | 100% | 3-4 hours |
| **P2** | High External Outlinks | 59 | 100% | 2-3 hours |
| **P2** | Missing Hreflang X-Default | 14 | 24% | 2-3 hours |
| **P2** | Internal 4XX Errors | 2 | 0.6% | 1-2 hours |
| **P2** | Internal 3XX Redirects | 2 | 0.6% | 1 hour |
| **P3** | Missing X-Content-Type-Options | 59 | 94% | 30 min |
| **P3** | Missing Referrer-Policy | 59 | 94% | 30 min |
| **P3** | Unsafe Cross-Origin Links | 59 | 94% | 2-3 hours |
| **P3** | Missing Alt Text | 40 | 21% | 2-3 hours |
| **P3** | Missing Image Size Attributes | 184 | 98% | 3-4 hours |
| **P3** | Title Tag Issues | 25 | 42% | 2-3 hours |
| **P3** | Meta Description Issues | 23 | 39% | 2-3 hours |
| **P4** | Images Over 100KB | 8 | 4% | 1 hour |
| **P4** | Difficult Readability | 4 | 7% | 2 hours |

**Total Estimated Implementation Time:** 35-45 hours

---

## Implementation Timeline

### Week 1: Critical Fixes (Priority 1)

**Goal:** Fix issues that directly impact search engine indexability

| Day | Task | Guide Reference | Est. Time |
|-----|------|-----------------|-----------|
| Mon | Add canonical tags to all 59 pages | [01_canonical_tags_guide.md](#01-canonical-tags) | 3 hours |
| Tue-Wed | Fix H1 structure (ensure H1 is first heading) | [heading-structure-fix-guide.md](#02-heading-structure) | 4 hours |
| Thu-Fri | Create unique H2 headings, remove duplicates | [heading-structure-fix-guide.md](#02-heading-structure) | 4 hours |

**Week 1 Note:** CMS Templates (Blog and Vacature) require special attention for dynamic SEO fields. These templates need CMS-bound values for canonical, title, meta description, and hreflang tags. See Guides 14 and 15.

**Week 1 Verification:**
- [ ] All 59 pages have self-referencing canonical tags
- [ ] All pages have exactly one H1 as the first heading
- [ ] No duplicate H2s across pages (shared components fixed)
- [ ] H6 misuse on service pages corrected
- [ ] CMS templates have dynamic canonical tags with CMS slug binding

### Week 2: High Priority Fixes (Priority 2)

**Goal:** Fix issues significantly affecting SEO performance

| Day | Task | Guide Reference | Est. Time |
|-----|------|-----------------|-----------|
| Mon | Add descriptive anchor text to internal links | [11_internal_links_guide.md](#11-internal-links) | 3 hours |
| Tue | Fix 4XX errors and update broken links | [12_response_codes_guide.md](#12-response-codes) | 2 hours |
| Wed | Update links pointing to 3XX redirects | [12_response_codes_guide.md](#12-response-codes) | 1 hour |
| Thu | Add hreflang x-default to 14 pages | [06_hreflang_guide.md](#06-hreflang) | 3 hours |
| Fri | Review and optimize high external outlinks | [11_internal_links_guide.md](#11-internal-links) | 2 hours |

**Week 2 Verification:**
- [ ] All internal links have descriptive anchor text
- [ ] No 4XX errors in internal links
- [ ] No internal links pointing to 3XX redirects
- [ ] All 14 pages have hreflang x-default
- [ ] External links reviewed and nofollow added where appropriate

### Week 3: Medium Priority Fixes - Security & Images (Priority 3a)

**Goal:** Improve security posture and image optimization

| Day | Task | Guide Reference | Est. Time |
|-----|------|-----------------|-----------|
| Mon | Add security headers (X-Content-Type-Options, Referrer-Policy) | [07_security_headers_guide.md](#07-security-headers) | 1 hour |
| Tue | Add rel="noopener noreferrer" to external links | [08_cross_origin_links_guide.md](#08-cross-origin-links) | 3 hours |
| Wed-Thu | Add alt text to 40 images | [09_image_alt_text_guide.md](#09-image-alt-text) | 3 hours |
| Fri | Add width/height to 184 images | [10_image_size_attributes_guide.md](#10-image-size-attributes) | 3 hours |

**Week 3 Verification:**
- [ ] Security headers visible in browser dev tools
- [ ] All external `target="_blank"` links have `rel="noopener noreferrer"`
- [ ] All images have descriptive alt text
- [ ] All images have width and height attributes

### Week 4: Medium Priority Fixes - Content Optimization (Priority 3b)

**Goal:** Optimize metadata for better click-through rates

| Day | Task | Guide Reference | Est. Time |
|-----|------|-----------------|-----------|
| Mon-Tue | Fix title tags (length, uniqueness, keywords) | [04_title_tags_guide.md](#04-title-tags) | 3 hours |
| Wed-Thu | Fix meta descriptions (length, CTAs) | [05_meta_descriptions_guide.md](#05-meta-descriptions) | 3 hours |
| Fri | Compress images over 100KB | [13_image_optimization_guide.md](#13-image-optimization) | 1 hour |

**Week 4 Verification:**
- [ ] All title tags 30-60 characters / under 561 pixels
- [ ] All meta descriptions 70-155 characters / under 985 pixels
- [ ] Titles differentiated from H1s with additional keywords
- [ ] All images under 100KB

---

## Quick Start Checklist

### Before You Begin

- [ ] Access to Webflow Designer for anobel.com
- [ ] Access to Webflow Project Settings
- [ ] Access to Google Search Console
- [ ] Access to hosting/CDN for security headers (if applicable)
- [ ] Screaming Frog license (for verification crawls)
- [ ] Excel file from audit (Appendix A) for specific URLs

### Daily Workflow

```
1. PICK a task from current week's timeline
2. OPEN the corresponding guide document
3. READ the "How to Fix" section
4. IMPLEMENT in Webflow Designer
5. VERIFY using the guide's verification steps
6. MARK as complete in this checklist
7. PUBLISH changes in Webflow
```

### After Each Session

- [ ] Publish changes in Webflow
- [ ] Test live pages to verify changes
- [ ] Update progress in this document
- [ ] Note any issues encountered

---

## Page-by-Page Master Checklist

### Main Pages Checklist

Use this checklist to track all fixes for each page. Mark each item as you complete it.

#### Homepage (`/`, `/nl`, `/en`)

| Issue | Priority | Status | Notes |
|-------|----------|--------|-------|
| Canonical tag | P1 | [ ] | Should point to `https://anobel.com/nl` or `/en` |
| H1 is first heading | P1 | [ ] | "Your maritime total supplier" |
| Remove duplicate H2s | P1 | [ ] | USP features, testimonials |
| Add hreflang x-default | P2 | [ ] | If missing |
| Security headers | P3 | [ ] | Via custom code |
| External links secured | P3 | [ ] | Add noopener noreferrer |
| Image alt text | P3 | [ ] | All images |
| Image dimensions | P3 | [ ] | Width/height attributes |
| Title tag optimized | P3 | [ ] | 30-60 characters |
| Meta description | P3 | [ ] | 70-155 characters |

#### Contact (`/nl/contact`, `/en/contact`)

| Issue | Priority | Status | Notes |
|-------|----------|--------|-------|
| Canonical tag | P1 | [ ] | |
| H1 is first heading | P1 | [ ] | "Nobel is here for you" |
| Remove empty H2s | P1 | [ ] | 3 empty H2s found |
| Hreflang tags | P2 | [ ] | |
| Security headers | P3 | [ ] | |
| External links secured | P3 | [ ] | |
| Image alt text | P3 | [ ] | |
| Image dimensions | P3 | [ ] | |
| Title tag optimized | P3 | [ ] | |
| Meta description | P3 | [ ] | |

#### Filtration (`/nl/filtratie`, `/en/filtration`)

| Issue | Priority | Status | Notes |
|-------|----------|--------|-------|
| Canonical tag | P1 | [ ] | |
| H1 is first heading | P1 | [ ] | "Market leader in filtration" |
| **Fix H6 misuse** | P1 | [ ] | Change H6 features to `<ul>` list |
| Remove duplicate H2s | P1 | [ ] | Shared components |
| Hreflang tags | P2 | [ ] | |
| Security headers | P3 | [ ] | |
| External links secured | P3 | [ ] | |
| Image alt text | P3 | [ ] | |
| Image dimensions | P3 | [ ] | |
| Title tag optimized | P3 | [ ] | |
| Meta description | P3 | [ ] | |

#### Bunkering (`/nl/scheepsbunkering`, `/en/bunkering`)

| Issue | Priority | Status | Notes |
|-------|----------|--------|-------|
| Canonical tag | P1 | [ ] | |
| H1 is first heading | P1 | [ ] | Check if truncated |
| **Fix H6 misuse** | P1 | [ ] | Sustainable, On-site, etc. |
| Remove duplicate H2s | P1 | [ ] | |
| Hreflang tags | P2 | [ ] | |
| Security headers | P3 | [ ] | |
| External links secured | P3 | [ ] | |
| Image alt text | P3 | [ ] | |
| Image dimensions | P3 | [ ] | |
| Title tag optimized | P3 | [ ] | |
| Meta description | P3 | [ ] | |

#### Equipment (`/nl/scheepsuitrusting`, `/en/equipment`)

| Issue | Priority | Status | Notes |
|-------|----------|--------|-------|
| Canonical tag | P1 | [ ] | |
| H1 is first heading | P1 | [ ] | Check if truncated |
| **Fix H6 misuse** | P1 | [ ] | 500m2, assortment features |
| Remove duplicate H2s | P1 | [ ] | |
| Hreflang tags | P2 | [ ] | |
| Security headers | P3 | [ ] | |
| External links secured | P3 | [ ] | |
| Image alt text | P3 | [ ] | |
| Image dimensions | P3 | [ ] | |
| Title tag optimized | P3 | [ ] | |
| Meta description | P3 | [ ] | |

#### Customization (`/nl/maatwerk`, `/en/customization`)

| Issue | Priority | Status | Notes |
|-------|----------|--------|-------|
| **Fix canonical tag** | P1 | [ ] | Currently points to /scheepsuitrusting - FIX! |
| H1 is first heading | P1 | [ ] | |
| **Fix H6 misuse** | P1 | [ ] | Assembly, schematics features |
| Remove duplicate H2s | P1 | [ ] | |
| Hreflang tags | P2 | [ ] | |
| Security headers | P3 | [ ] | |
| External links secured | P3 | [ ] | |
| Image alt text | P3 | [ ] | |
| Image dimensions | P3 | [ ] | |
| Title tag optimized | P3 | [ ] | |
| Meta description | P3 | [ ] | |

#### Webshop (`/nl/webshop`, `/en/webshop`)

| Issue | Priority | Status | Notes |
|-------|----------|--------|-------|
| Canonical tag | P1 | [ ] | |
| H1 is first heading | P1 | [ ] | |
| **Translate Dutch headings** | P1 | [ ] | CRITICAL: Dutch content on EN page |
| Remove duplicate H2s | P1 | [ ] | |
| Change H4s to H3s | P1 | [ ] | Maintain hierarchy |
| Hreflang tags | P2 | [ ] | |
| Security headers | P3 | [ ] | |
| External links secured | P3 | [ ] | |
| Image alt text | P3 | [ ] | |
| Image dimensions | P3 | [ ] | |
| Title tag optimized | P3 | [ ] | |
| Meta description | P3 | [ ] | |

#### This is Nobel (`/nl/dit-is-nobel`, `/en/this-is-nobel`)

| Issue | Priority | Status | Notes |
|-------|----------|--------|-------|
| Canonical tag | P1 | [ ] | |
| H1 is first heading | P1 | [ ] | |
| Remove duplicate H2s | P1 | [ ] | "50 years" appears multiple times |
| Hreflang tags | P2 | [ ] | |
| Security headers | P3 | [ ] | |
| External links secured | P3 | [ ] | |
| Image alt text | P3 | [ ] | |
| Image dimensions | P3 | [ ] | |
| Title tag optimized | P3 | [ ] | |
| Meta description | P3 | [ ] | |

#### Team (`/nl/team`, `/en/team`)

| Issue | Priority | Status | Notes |
|-------|----------|--------|-------|
| Canonical tag | P1 | [ ] | |
| H1 is first heading | P1 | [ ] | |
| Remove empty H2s | P1 | [ ] | 4 empty H2s found |
| Convert department H2s to H3s | P1 | [ ] | Maintain hierarchy |
| Hreflang tags | P2 | [ ] | |
| Security headers | P3 | [ ] | |
| External links secured | P3 | [ ] | |
| Image alt text | P3 | [ ] | Team member photos |
| Image dimensions | P3 | [ ] | |
| Title tag optimized | P3 | [ ] | |
| Meta description | P3 | [ ] | |

#### Careers (`/nl/werkenbij`, `/en/careers`)

| Issue | Priority | Status | Notes |
|-------|----------|--------|-------|
| Canonical tag | P1 | [ ] | |
| H1 is first heading | P1 | [ ] | |
| Remove empty H2s | P1 | [ ] | 1 empty H2 found |
| Convert success message H2 to `<p>` | P1 | [ ] | |
| Hreflang tags | P2 | [ ] | |
| Security headers | P3 | [ ] | |
| External links secured | P3 | [ ] | |
| Image alt text | P3 | [ ] | |
| Image dimensions | P3 | [ ] | |
| Title tag optimized | P3 | [ ] | |
| Meta description | P3 | [ ] | |

#### Blog (`/nl/blog`, `/en/blog`)

| Issue | Priority | Status | Notes |
|-------|----------|--------|-------|
| Canonical tag | P1 | [ ] | |
| H1 is first heading | P1 | [ ] | |
| Remove empty H2 | P1 | [ ] | |
| Hreflang tags | P2 | [ ] | |
| Security headers | P3 | [ ] | |
| External links secured | P3 | [ ] | |
| Image alt text | P3 | [ ] | |
| Image dimensions | P3 | [ ] | |
| Title tag optimized | P3 | [ ] | |
| Meta description | P3 | [ ] | |

#### Blog Post Template (`detail_blog.html`)

| Issue | Priority | Status | Notes |
|-------|----------|--------|-------|
| Dynamic canonical tag | P1 | [ ] | Use CMS slug: `{{wf {"path":"slug","type":"PlainText"} }}` |
| Dynamic title tag | P1 | [ ] | Bind to CMS post title field |
| Dynamic meta description | P1 | [ ] | Bind to CMS excerpt/summary field |
| H1 is first heading | P1 | [ ] | Blog post title (CMS bound) |
| **Fix H6 article sections** | P1 | [ ] | Change to H2 |
| Remove empty H6s | P1 | [ ] | |
| Dynamic hreflang tags | P2 | [ ] | Use CMS slug for both NL/EN variants |
| Hreflang x-default | P2 | [ ] | Include x-default pointing to NL variant |
| Security headers | P3 | [ ] | Via site-wide custom code |
| External links secured | P3 | [ ] | Add noopener noreferrer |
| Image alt text | P3 | [ ] | CMS-bound alt text for featured image |
| Image dimensions | P3 | [ ] | Width/height on template images |

#### Vacature Template (`detail_vacatures.html`)

| Issue | Priority | Status | Notes |
|-------|----------|--------|-------|
| Dynamic canonical tag | P1 | [ ] | Use CMS slug: `{{wf {"path":"slug","type":"PlainText"} }}` |
| Dynamic title tag | P1 | [ ] | Bind to job title field |
| Dynamic meta description | P1 | [ ] | Bind to job description/summary field |
| H1 is first heading | P1 | [ ] | Job title (CMS bound) |
| Proper heading hierarchy | P1 | [ ] | H2 for sections (Requirements, etc.) |
| Dynamic hreflang tags | P2 | [ ] | Use CMS slug for both NL/EN variants |
| Hreflang x-default | P2 | [ ] | Include x-default pointing to NL variant |
| Security headers | P3 | [ ] | Via site-wide custom code |
| External links secured | P3 | [ ] | Add noopener noreferrer |
| Image alt text | P3 | [ ] | Descriptive alt for job images |
| Image dimensions | P3 | [ ] | Width/height on template images |

#### Terms (`/nl/voorwaarden`, `/en/terms`)

| Issue | Priority | Status | Notes |
|-------|----------|--------|-------|
| Canonical tag | P1 | [ ] | |
| H1 is first heading | P1 | [ ] | Consider changing from tagline |
| **Fix H6 articles** | P1 | [ ] | Change Art. 1-18 to H3 |
| Remove duplicate H6s | P1 | [ ] | Privacy/Disclaimer 11x each |
| Hreflang tags | P2 | [ ] | |
| Security headers | P3 | [ ] | |
| External links secured | P3 | [ ] | |
| Image alt text | P3 | [ ] | |
| Image dimensions | P3 | [ ] | |
| Title tag optimized | P3 | [ ] | |
| Meta description | P3 | [ ] | |

#### ISPS (`/nl/isps`, `/en/isps`)

| Issue | Priority | Status | Notes |
|-------|----------|--------|-------|
| Canonical tag | P1 | [ ] | |
| H1 is first heading | P1 | [ ] | |
| Remove duplicate "50 years" H2s | P1 | [ ] | Not ISPS-specific |
| Hreflang tags | P2 | [ ] | |
| Security headers | P3 | [ ] | |
| External links secured | P3 | [ ] | |
| Image alt text | P3 | [ ] | |
| Image dimensions | P3 | [ ] | |
| Title tag optimized | P3 | [ ] | |
| Meta description | P3 | [ ] | |

#### Brochures (`/nl/brochures`, `/en/brochures`)

| Issue | Priority | Status | Notes |
|-------|----------|--------|-------|
| Canonical tag | P1 | [ ] | |
| H1 is first heading | P1 | [ ] | Good structure - minor fixes only |
| Hreflang tags | P2 | [ ] | |
| Security headers | P3 | [ ] | |
| External links secured | P3 | [ ] | |
| Image alt text | P3 | [ ] | |
| Image dimensions | P3 | [ ] | |
| Title tag optimized | P3 | [ ] | |
| Meta description | P3 | [ ] | |

#### Location (`/nl/locatie`, `/en/location`)

| Issue | Priority | Status | Notes |
|-------|----------|--------|-------|
| Canonical tag | P1 | [ ] | |
| H1 is first heading | P1 | [ ] | |
| Add section H2s | P1 | [ ] | Currently minimal hierarchy |
| Hreflang tags | P2 | [ ] | |
| Security headers | P3 | [ ] | |
| External links secured | P3 | [ ] | |
| Image alt text | P3 | [ ] | |
| Image dimensions | P3 | [ ] | |
| Title tag optimized | P3 | [ ] | |
| Meta description | P3 | [ ] | |

### Utility Pages Checklist

These pages should have `noindex` meta tags:

| Page | noindex | Canonical | Notes |
|------|---------|-----------|-------|
| 404.html | [ ] | [ ] | Add `<meta name="robots" content="noindex, follow" />` |
| 401.html | [ ] | [ ] | Add `<meta name="robots" content="noindex, follow" />` |
| search.html | [ ] | [ ] | Add `<meta name="robots" content="noindex, follow" />` |
| design-system/* | [ ] | [ ] | All 5 pages need noindex |

---

## Webflow-Specific Workflow

### Where to Make Each Type of Change

| Fix Type | Location in Webflow | How to Access |
|----------|---------------------|---------------|
| **Canonical Tags** | Page Settings > Custom Code > Head | Pages Panel > Gear icon |
| **Hreflang Tags** | Page Settings > Custom Code > Head | Pages Panel > Gear icon |
| **Title Tags** | Page Settings > SEO Settings > Title Tag | Pages Panel > Gear icon |
| **Meta Descriptions** | Page Settings > SEO Settings > Meta Description | Pages Panel > Gear icon |
| **Security Headers** | Project Settings > Custom Code > Head Code | Settings (gear) > Custom Code |
| **Heading Tags (H1-H6)** | Designer > Element Settings | Select element > Settings Panel > Tag |
| **External Link Attributes** | Designer > Link Settings | Select link > Settings Panel |
| **Image Alt Text** | Designer > Image Settings | Select image > Settings Panel |
| **Image Dimensions** | Designer > Image Settings | Select image > Settings Panel (Add width/height) |
| **noindex Tags** | Page Settings > SEO Settings | Pages Panel > Gear icon > Exclude from search |

### Webflow Locations Reference

```
PROJECT SETTINGS (Top-left gear icon)
├── General
├── Custom Code
│   ├── Head Code ← Security headers, site-wide scripts
│   └── Footer Code
├── SEO
└── Publishing

PAGE SETTINGS (Pages panel > Gear icon on page)
├── Page Info
├── Open Graph Settings
├── SEO Settings
│   ├── Title Tag ← Page title
│   ├── Meta Description ← Page description
│   └── Exclude from Search Results ← noindex
└── Custom Code
    └── Inside <head> tag ← Canonical, hreflang tags

DESIGNER
├── Element Settings Panel (right side)
│   ├── Tag dropdown ← Change H1-H6 to Div/Paragraph
│   └── Link Settings ← Add rel attributes
└── Style Panel (right side)
```

### Custom Code Templates

#### Page-Level Custom Code (Inside `<head>` tag)

```html
<!-- Canonical Tag -->
<link rel="canonical" href="https://anobel.com/nl/[PAGE-SLUG]" />

<!-- Hreflang Tags -->
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/[PAGE-SLUG]" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/[PAGE-SLUG]" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/[PAGE-SLUG]" />
```

#### Site-Wide Custom Code (Project Settings > Head Code)

```html
<!-- Security Headers (via meta tags - limited effectiveness) -->
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta name="referrer" content="strict-origin-when-cross-origin">

<!-- External Links Security Script -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[target="_blank"]').forEach(function(link) {
    if (!link.rel.includes('noopener')) {
      link.rel = (link.rel + ' noopener noreferrer').trim();
    }
  });
});
</script>
```

### CMS Template Code

For CMS collection pages (blog posts, products, etc.):

```html
<!-- Blog Post Canonical -->
<link rel="canonical" href="https://anobel.com/nl/blog/{{wf {"path":"slug","type":"PlainText"} }}" />

<!-- Product Canonical -->
<link rel="canonical" href="https://anobel.com/nl/products/{{wf {"path":"slug","type":"PlainText"} }}" />
```

### CMS Collection Templates

CMS collection templates (like blog posts and job postings) require special handling because their SEO elements must use **dynamic bindings** rather than static values.

**Key Differences from Static Pages:**

| Element | Static Page | CMS Template |
|---------|-------------|--------------|
| Canonical | Hardcoded URL | CMS slug binding: `{{wf {"path":"slug","type":"PlainText"} }}` |
| Title | Fixed text | CMS field binding (e.g., post title) |
| Meta Description | Fixed text | CMS field binding (e.g., excerpt) |
| Hreflang | Hardcoded URLs | CMS slug binding for each language variant |
| H1 | Fixed heading | CMS field binding (e.g., post title) |

**Implementation Steps for CMS Templates:**

1. **In Collection Template Settings:**
   - Bind Title Tag to the CMS title field
   - Bind Meta Description to the CMS summary/excerpt field

2. **In Template Custom Code (Head):**
   ```html
   <!-- Dynamic Canonical -->
   <link rel="canonical" href="https://anobel.com/nl/[collection]/{{wf {"path":"slug","type":"PlainText"} }}" />

   <!-- Dynamic Hreflang -->
   <link rel="alternate" hreflang="nl" href="https://anobel.com/nl/[collection]/{{wf {"path":"slug","type":"PlainText"} }}" />
   <link rel="alternate" hreflang="en" href="https://anobel.com/en/[collection]/{{wf {"path":"slug","type":"PlainText"} }}" />
   <link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/[collection]/{{wf {"path":"slug","type":"PlainText"} }}" />
   ```

3. **In Template Designer:**
   - Ensure H1 is bound to CMS title field
   - Ensure proper heading hierarchy (H2, H3) for content sections

**Affected Templates:**
- `detail_blog.html` - Blog post template (see Guide 14)
- `detail_vacatures.html` - Job posting template (see Guide 15)

### Shared Components (Symbols) to Update

| Symbol Name | Current Issue | Fix Required |
|-------------|---------------|--------------|
| Cookie Consent | H2 before page H1 | Change to Div |
| USP Strip | H2 for features | Change to Paragraph or List |
| Testimonials | H2 for quotes | Change to Blockquote |
| Footer | H2 for section titles | Change to H4 |
| CTA Sections | Duplicate H2s | Make unique per placement |

---

## Guide Index

### Individual Fix Guides

Click each link to access the detailed implementation guide:

| # | Guide | Issues Covered | Priority |
|---|-------|----------------|----------|
| **01** | [Canonical Tags Guide](./01_canonical_tags_guide.md) | Missing canonical tags, incorrect canonicals | P1 |
| **02** | [H1 Structure Guide](./02_h1_structure_guide.md) | H1 non-sequential, empty H1s, Title = H1 | P1 |
| **03** | [H2 Structure Guide](./03_h2_structure_guide.md) | Duplicate/multiple H2s, H2 hierarchy | P1 |
| **03+** | [Heading Semantic Guide](./04_heading_semantic_guide.md) | Complete per-page heading tag analysis (H1-H6) | P1 |
| **04** | [Title Tags Guide](./marketing/04_title_tags_guide.md) | Short/long titles, title = H1 issues | P3 |
| **05** | [Meta Descriptions Guide](./marketing/05_meta_descriptions_guide.md) | Short/long descriptions, missing CTAs | P3 |
| **06** | [Hreflang Guide](./06_hreflang_guide.md) | Missing x-default, reciprocal links | P2 |
| **07** | [Security Headers Guide](./07_security_headers_guide.md) | X-Content-Type-Options, Referrer-Policy | P3 |
| **08** | [Cross-Origin Links Guide](./08_cross_origin_links_guide.md) | Missing noopener noreferrer | P3 |
| **09** | [Image Alt Text Guide](./marketing/09_image_alt_text_guide.md) | Missing alt text for 40 images | P3 |
| **10** | [Image Size Attributes Guide](./10_image_size_attributes_guide.md) | Missing width/height for 184 images | P3 |
| **11** | [Internal Links Guide](./11_internal_linking_guide.md) | No anchor text, high external outlinks | P2 |
| **12** | [Response Codes Guide](./12_response_codes_guide.md) | 4XX errors, 3XX redirects | P2 |
| **13** | [Large Images Guide](./13_large_images_guide.md) | Large image files | P4 |
| **14** | [Blog Template Guide](./14_blog_template_guide.md) | CMS blog post template SEO fixes | P1 |
| **15** | [Vacature Template Guide](./15_vacature_template_guide.md) | CMS job posting template SEO fixes | P1 |

### Quick Reference Cards

#### Canonical Tag Quick Reference

```
PATTERN: <link rel="canonical" href="https://anobel.com/[lang]/[page]" />

EXAMPLES:
- Homepage NL:      https://anobel.com/nl
- Homepage EN:      https://anobel.com/en
- Contact NL:       https://anobel.com/nl/contact
- Filtration EN:    https://anobel.com/en/filtration

RULES:
1. Always use absolute URLs
2. Self-referencing (canonical = current page URL)
3. Must match hreflang URLs exactly
```

#### Heading Hierarchy Quick Reference

```
CORRECT PATTERN:
H1 (only one, first heading)
  H2 (section)
    H3 (subsection)
  H2 (section)
    H3 (subsection)
    H3 (subsection)

WRONG PATTERNS:
- H1 after H2 (cookie modal issue)
- H6 after H1 (skipped levels)
- Multiple H1s on page
- H2 before H1 in DOM order
```

---

## Verification Checklist

### After Each Fix Type

#### Canonical Tags Verification

- [ ] View page source (Ctrl+U / Cmd+Option+U)
- [ ] Search for `rel="canonical"`
- [ ] Verify href matches current page URL exactly
- [ ] Check Google Search Console > URL Inspection > Canonical section
- [ ] Run Screaming Frog crawl of affected pages

#### Heading Structure Verification

- [ ] Install [HeadingsMap browser extension](https://chrome.google.com/webstore/detail/headingsmap)
- [ ] Verify H1 is first heading in document outline
- [ ] Verify logical hierarchy (H1 > H2 > H3, no skipped levels)
- [ ] Verify no empty heading tags
- [ ] Verify no duplicate heading text on same page

#### Hreflang Verification

- [ ] View page source and search for `hreflang`
- [ ] Verify NL, EN, and x-default variants present
- [ ] Verify URLs match canonical URLs exactly
- [ ] Check reciprocal links (NL page lists EN, EN page lists NL)
- [ ] Use [hreflang validator tool](https://technicalseo.com/tools/hreflang/)

#### Security Headers Verification

- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Reload page
- [ ] Click on document request
- [ ] Check Response Headers section
- [ ] Verify X-Content-Type-Options and Referrer-Policy present

#### Image Verification

- [ ] Run Screaming Frog crawl with "Images" tab selected
- [ ] Export images missing alt text
- [ ] Export images missing size attributes
- [ ] Verify all images have descriptive alt text
- [ ] Verify all images have width/height

### Final Verification (End of Implementation)

Run a complete Screaming Frog crawl and verify:

| Issue Category | Before | Target | Actual |
|----------------|--------|--------|--------|
| Missing Canonicals | 59 | 0 | |
| H1 Issues | 59 | 0 | |
| H2 Issues | 59 | <10 | |
| Missing Hreflang | 14 | 0 | |
| 4XX Errors | 2 | 0 | |
| Security Headers | 59 | 0 | |
| Missing Alt Text | 40 | 0 | |
| Missing Size Attrs | 184 | 0 | |
| Title Issues | 25 | 0 | |
| Meta Desc Issues | 23 | 0 | |

---

## Monitoring Setup

### Google Search Console Setup

If not already configured:

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://anobel.com`
3. Verify ownership via DNS TXT record or HTML file
4. Submit sitemaps:
   - `https://anobel.com/sitemap.xml`
   - `https://anobel.com/nl/sitemap.xml` (if separate)
   - `https://anobel.com/en/sitemap.xml` (if separate)

### Weekly Monitoring Tasks

| Task | Tool | Frequency | What to Check |
|------|------|-----------|---------------|
| Index coverage | Google Search Console | Weekly | Errors, warnings, excluded pages |
| Crawl stats | Google Search Console | Weekly | Response codes, crawl frequency |
| Core Web Vitals | Google Search Console | Weekly | CLS, LCP, FID scores |
| Hreflang errors | Google Search Console | Weekly | International targeting issues |

### Monthly Monitoring Tasks

| Task | Tool | Frequency | What to Check |
|------|------|-----------|---------------|
| Full site crawl | Screaming Frog | Monthly | New issues, broken links |
| Ranking positions | SEMrush/Ahrefs | Monthly | Keyword rankings, visibility |
| Backlink profile | Ahrefs | Monthly | New/lost links, toxic links |
| Traffic trends | Google Analytics | Monthly | Organic sessions, engagement |

### Key Metrics to Track

| Metric | Current Baseline | Target (3 months) | Target (6 months) |
|--------|------------------|-------------------|-------------------|
| Organic traffic | 450 users/month | 600 users/month | 900 users/month |
| Non-branded keywords | 0 | 10+ | 30+ |
| Pages indexed | TBD | All main pages | All pages |
| Core Web Vitals | TBD | All "Good" | All "Good" |
| Average position | TBD | <20 for branded | <30 for target |

### Alert Setup

Configure alerts for:

- [ ] Index coverage drops > 10%
- [ ] New crawl errors
- [ ] Core Web Vitals fail threshold
- [ ] Manual actions (Google penalties)
- [ ] Security issues detected

---

## Appendix: Issue Reference

### Complete Issue List by Appendix Tab

| Appendix Tab | Issue Type | Count | Priority |
|--------------|------------|-------|----------|
| Missing Canonicals | Pages without canonical tags | 59 | P1 |
| H1 Issues | Non-sequential H1 headers | 59 | P1 |
| H2 Issues | Duplicate/multiple H2 headers | 59 | P1 |
| No Anchor Text | Internal links without anchor text | 59 | P2 |
| High External Links | Pages with many external links | 59 | P2 |
| Hreflang Issues | Missing x-default hreflang | 14 | P2 |
| 4XX Errors | Pages returning 4XX status | 2 | P2 |
| 4XX Link Sources | Links pointing to 4XX pages | 571 | P2 |
| 3XX Redirects | Pages returning 3XX status | 2 | P2 |
| 3XX Link Sources | Links pointing to redirects | 56 | P2 |
| Security Headers | Missing security headers | 59 | P3 |
| Unsafe CrossOrigin | Links missing noopener | 59 | P3 |
| Image Issues | Images missing alt text | 40 | P3 |
| Missing Size Attrs | Images missing dimensions | 184 | P3 |
| Page Titles | Title length issues | 25 | P3 |
| Meta Descriptions | Description length issues | 23 | P3 |
| Readability | Content with low readability | 4 | P4 |

### CTAX Framework Reference

The audit follows the CTAX framework:

- **C**ontent: Quality, uniqueness, and relevance
- **T**echnique: Technical implementation (indexability, crawlability)
- **A**uthority: Internal and external link signals
- **U**ser Experience: Page speed, mobile-friendliness, usability

### Resources

- [Getting the Market SEO Audit (full report)](../getting-the-market-seo-audit.md)
- [Appendix A Excel File](contact Getting the Market for file)
- [Google Search Console](https://search.google.com/search-console)
- [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/seo-spider/)
- [Ahrefs Webmaster Tools](https://ahrefs.com/webmaster-tools)
- [hreflang Tag Generator](https://technicalseo.com/tools/hreflang/)

---

## Progress Tracking

### Implementation Status

| Week | Status | % Complete | Notes |
|------|--------|------------|-------|
| Week 1 | Not Started | 0% | Canonical tags, heading structure |
| Week 2 | Not Started | 0% | Internal links, hreflang, errors |
| Week 3 | Not Started | 0% | Security, images |
| Week 4 | Not Started | 0% | Titles, meta descriptions |
| Ongoing | Not Started | 0% | Monitoring, maintenance |

### Blockers & Notes

| Date | Issue | Resolution |
|------|-------|------------|
| | | |

---

*Document generated: 2026-01-24*
*Last updated: 2026-01-24*
*Version: 1.0*
