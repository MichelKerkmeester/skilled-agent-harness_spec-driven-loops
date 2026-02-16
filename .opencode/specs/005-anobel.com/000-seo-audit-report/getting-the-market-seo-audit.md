# Getting the Market - Technical SEO Audit (anobel.com)

## Introduction

This technical SEO audit provides a comprehensive analysis of anobel.com, identifying issues that may be impacting search engine visibility and user experience. The audit follows the CTAX framework:

- **Content**: Quality, uniqueness, and relevance of page content
- **Technique**: Technical implementation affecting crawlability and indexability
- **Authority**: Internal and external link signals
- **User Experience**: Page speed, mobile-friendliness, and usability

All findings are documented with specific URLs in **Appendix A** (please see the Excel file in my email) for easy reference during implementation.

Note: we did not review the web shop yet, since this part of the website is not live. We do have some recommendations and compared A.Nobel with some competitors who sell their products also via a web shop.

---

## In short

The audit of anobel.com revealed significant technical SEO issues requiring immediate attention. The Screaming Frog crawl identified 26 distinct issue types across the website, with critical problems affecting indexability, duplicate content, and international SEO implementation.

### Audit statistics

| Metric                        | Value      |
|------------------------------|------------|
| Total Pages Crawled          | 59         |
| Total Issue Types Identified | 26         |
| Critical/Warning Issues      | 14         |
| Opportunity Issues           | 12         |
| Data Reference               | Appendix A |

### Key findings

- **100% of pages missing canonical tags (59 pages)** - Critical duplicate content risk between NL/EN versions
- **100% of pages have H1 structure issues (59 pages)** - Non-sequential header hierarchy
- **100% of pages have H2 issues (59 pages)** - Duplicate and multiple H2 tags
- **94% of pages missing security headers (59 pages)** - X-Content-Type-Options, Referrer-Policy
- **98% of images missing size attributes (184 images)** - Causes layout shift
- **24% of pages missing hreflang x-default (14 pages)** - International SEO implementation incomplete

See Appendix A for complete URL lists organized by issue type.

---

## Current website traffic and competitor analysis

### Traffic (recent period shown)

Key metrics shown:

- Users: 450
- Sessions: 802
- Engaged Sessions: 426
- Avg. engagement time: 00:00:37
- Engaged Sessions per user: 0.95
- Engagement rate: 53.12%

Anobel.com currently generates a good amount of traffic at 802 monthly sessions and 450 users in the last month.

### Keyword visibility

Anobel.com ranks on primarily branded keywords and for industry-related keywords there is little to no visibility at all. This is probably due to the split between the corporate website and the webshop, but there should at least be a couple of industry keywords in the mix.

### Competitor comparison (as shown)

| Domain                | Authority score | Semrush Rank | Org. Traffic | Org. Keywords | Backlinks | Ref. Domains |
|----------------------|----------------:|-------------:|-------------:|--------------:|----------:|-------------:|
| anobel.com           | 8               | 223.8K       | 472          | 23            | 158       | 89           |
| filterwebshop.nl     | 12              | 62.7K        | 2.4K         | 292           | 682       | 136          |
| femm.be              | 19              | 382K         | 201          | 144           | 614       | 61           |
| binnenvaartwinkel.nl | 20              | 141.2K       | 891          | 1.4K          | 720       | 217          |
| shipco.com           | 32              | 206.8K       | 528          | 491           | 14.3K     | 1.4K         |

When compared to top competitors, Anobel.com falls short in every aspect. Once again, this might be since this is just the corporate website whereas all other competitors have both the webshop and corporate site under one single domain.

However, we also understand that the website was recently launched, and we did not include the .nl domain in the scan. So we expect a huge SEO boost once the subdomain is live.

### Traffic share and branded vs non-branded (as shown)

Traffic share (NL market snapshot shown):

- anobel.com: 11%
- filterwebshop.nl: 53%
- femm.be: 4%
- binnenvaartwinkel.nl: 20%
- shipco.com: 12%

Non-branded / branded mix (as shown):

- anobel.com: 0% / 100%
- filterwebshop.nl: 25% / 75%
- femm.be: 63% / 37%
- binnenvaartwinkel.nl: 77% / 23%
- shipco.com: 40% / 60%

Unlike Anobel whose current traffic share comes from only branded keywords, all other competitors have a mix of non-branded keywords and branded keywords. This means that organic traffic is coming from keyword search queries that are product/industry related.

Anobel can improve its SEO scoring and increase organic traffic from:

- SEO optimization
- Keyword targeting - Pages optimized with commercial search terms
- Strong content strategy - Pages targeting buyer intent keywords
- Technical SEO improvements and fixes

---

# Section 1: Technical issues

This section details all technical SEO issues identified during the audit. Each issue includes a definition, impact assessment, affected pages, and specific remediation steps. Reference Appendix A for complete URL lists.

## 1.1 Canonical tags

- **Issue**: Missing Canonical Tags
- **Severity**: Critical
- **Affected pages**: 59 pages (100%)
- **Appendix A tab**: Missing canonicals

**Definition:** A canonical tag (`rel="canonical"`) tells search engines which version of a page is the preferred or "master" copy. This is essential for websites with multiple language versions or URL variations.

**Impact:** Without canonical tags, search engines may index duplicate versions of pages (e.g., both `/nl/` and `/en/` versions). This dilutes ranking signals, wastes crawl budget, and can result in the wrong language version appearing in search results.

**How to fix:**

1. Add a self-referencing canonical tag to every page's `<head>` section
2. Use absolute URLs (e.g., `https://anobel.com/en/products` not `/en/products`)
3. Ensure canonical URL matches the page's actual URL exactly
4. For language variants, each page should be canonical to itself (not to another language)

## 1.2 Header structure

- **Issue**: Non-Sequential and Duplicate Headers
- **Severity**: High
- **Appendix A tabs**: H1 Issues, H2 Issues

**Definition:** HTML headers (H1-H6) create a hierarchical structure that helps search engines understand page content. Headers should follow a logical sequence: H1 first, then H2s, then H3s, etc.

**Issues found:**

- **H1 Non-sequential**: 59 pages (100%) - H1 not appearing as first heading
- **H2 Duplicate**: 59 pages (100%) - Same H2 text used across multiple pages
- **H2 Multiple**: 59 pages (100%) - Excessive H2 tags on pages
- **H2 Non-sequential**: 38 pages (64%) - H2 appearing before H1
- **Title Same as H1**: 18 pages (31%) - Missing keyword optimization opportunity

**Impact:** Poor header structure confuses search engines about page hierarchy and topic relevance. Duplicate H2s reduce content uniqueness signals.

**How to fix:**

1. Ensure each page has exactly one H1 tag as the first heading
2. Follow logical hierarchy: H1 -> H2 -> H3 (never skip levels)
3. Create unique H2 headings for each page section
4. Differentiate title tag from H1 using related but distinct keywords

## 1.3 Title tags and meta descriptions

- **Issue**: Improperly Sized Metadata
- **Severity**: High
- **Appendix A tabs**: Page Titles, Meta Descriptions

**Definition:** Title tags and meta descriptions are HTML elements that define how your page appears in search results. They directly impact click-through rates and help search engines understand page content.

**Title tag issues:**

- Below 30 characters (too short): 7 pages (12%)
- Over 60 characters (too long): 9 pages (15%)
- Over 561 pixels (truncated in SERP): 9 pages (15%)
- Same as H1: 18 pages (31%)

**Meta description issues:**

- Below 70 characters (too short): 12 pages (20%)
- Below 400 pixels (too short): 8 pages (14%)
- Over 155 characters (too long): 11 pages (19%)
- Over 985 pixels (truncated): 10 pages (17%)

**Impact:** Truncated titles/descriptions reduce click-through rates. Short metadata misses keyword opportunities. Identical H1 and title wastes optimization potential.

**How to fix:**

1. Write unique title tags for each page (30-60 characters, under 561 pixels)
2. Write unique meta descriptions (70-155 characters, under 985 pixels)
3. Include primary keywords naturally in both elements
4. Add compelling call-to-action in meta descriptions

## 1.4 Hreflang implementation

- **Issue**: Missing X-Default Hreflang
- **Severity**: High
- **Affected pages**: 14 pages (24%)
- **Appendix A tab**: Hreflang Issues

**Definition:** Hreflang tags tell search engines which language and regional version of a page to show users. The `x-default` tag specifies a fallback page for users whose language is not specifically targeted.

**Impact:** Without `x-default`, search engines have no fallback instruction for users outside targeted regions. This can result in unpredictable language serving.

**How to fix:**

1. Add self-referencing hreflang to every page
2. Add reciprocal hreflang links (NL page must link to EN, EN must link to NL)
3. Add `x-default` hreflang pointing to language selector or default version
4. Ensure hreflang URLs exactly match canonical URLs

## 1.5 Security headers

- **Issue**: Missing Security Headers
- **Severity**: Medium
- **Affected pages**: 59 pages (94%)
- **Appendix A tab**: Security Headers

**Definition:** Security headers are HTTP response headers that protect against common web vulnerabilities. While not direct ranking factors, they contribute to overall site trustworthiness.

**Issues found:**

- **Missing x-content-type-options**: 59 pages (94%) - Prevents MIME type sniffing
- **Missing referrer-policy**: 59 pages (94%) - Controls referrer information sent

**How to fix:**

Add the following headers via `.htaccess` or server configuration:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 1.6 Unsafe cross-origin links

- **Issue**: External Links Missing Security Attributes
- **Severity**: Medium
- **Affected pages**: 59 pages (94%)
- **Appendix A tab**: Unsafe CrossOrigin

**Definition:** External links that open in new tabs (`target="_blank"`) without `rel="noopener noreferrer"` can be exploited through the `window.opener` API, potentially compromising security.

**How to fix:**

- Add `rel="noopener noreferrer"` to all external links with `target="_blank"`

## 1.7 Response codes

- **Issue**: Client Errors and Redirects
- **Severity**: High
- **Appendix A tabs**: 4XX Errors, 4XX Link Sources, 3XX Redirects, 3XX Link Sources

**4XX client errors:**

- Internal 4XX errors: 2 pages (0.6%)
- External 4XX errors: 2 resources (0.6%)
- Links pointing to 4XX pages: 571 instances

**3XX redirects:**

- Internal redirects: 2 pages (0.6%)
- Links pointing to redirects: 56 instances

**Impact:** Broken links waste crawl budget and create poor user experience. Links to redirects pass reduced link equity.

**How to fix:**

1. Fix or remove pages returning 4XX errors
2. Update internal links to point directly to final URLs (not redirects)
3. Convert temporary redirects (302/307) to permanent (301) if appropriate

## 1.8 Image optimization

- **Issue**: Missing Alt Text, Size Attributes, and Large File Sizes
- **Severity**: Medium
- **Appendix A tabs**: Image Issues, Missing Size Attrs

**Issues found:**

- Missing alt text: 40 images (21%)
- Missing size attributes: 184 images (98%) - Causes layout shift (CLS)
- Over 100KB: 8 images (4%) - Slows page load

**Impact:** Missing alt text hurts accessibility and image SEO. Missing dimensions cause Cumulative Layout Shift (Core Web Vital). Large images slow page load times.

**How to fix:**

1. Add descriptive alt text to all images (describe the image content)
2. Add width and height attributes to all `<img>` tags
3. Compress images over 100KB using tools like TinyPNG or Squoosh
4. Convert images to WebP format for better compression

## 1.9 Internal linking

- **Issue**: Missing Anchor Text and High External Outlinks
- **Severity**: Medium
- **Appendix A tabs**: No Anchor Text, High External Links

**Issues found:**

- Links with no anchor text: 59 pages (100%)
- Pages with high external outlinks: 59 pages (100%)

**Impact:** Links without anchor text miss keyword relevance signals. High external outlinks can dilute page authority if not properly managed.

**How to fix:**

1. Add descriptive anchor text to all internal links
2. Review external links and ensure they add value for users
3. Consider using `rel="nofollow"` on low-value external links

## 1.10 Content quality

- **Issue**: Difficult Readability
- **Severity**: Low
- **Affected pages**: 4 pages (7%)
- **Appendix A tab**: Readability

**Definition:** Readability scores measure how easy content is to read based on sentence length, word complexity, and other factors. Difficult content reduces user engagement.

**Impact:** Complex content can increase bounce rates and reduce time on page, indirectly affecting SEO performance.

**How to fix:**

1. Simplify complex sentences
2. Use shorter paragraphs
3. Replace jargon with simpler alternatives where possible
4. Add subheadings to break up long content sections

---

# Section 2: Issues summary

Complete list of all identified issues from Screaming Frog, prioritized by severity. Use the Appendix Tab column to locate detailed URL lists in Appendix A.

| Priority  | Issue                         | Pages | % Total | Appendix Tab       |
|----------|-------------------------------|------:|--------:|--------------------|
| Critical | Missing Canonical Tags        | 59    | 100%    | Missing Canonicals |
| High     | H1 Non-Sequential             | 59    | 100%    | H1 Issues          |
| High     | H2 Duplicate                  | 59    | 100%    | H2 Issues          |
| High     | H2 Multiple                   | 59    | 100%    | H2 Issues          |
| High     | H2 Non-Sequential             | 38    | 64%     | H2 Issues          |
| High     | Links With No Anchor Text     | 59    | 100%    | No Anchor Text     |
| High     | High External Outlinks        | 59    | 100%    | High External Links|
| Medium   | Missing X-Content-Type-Options| 59    | 94%     | Security Headers   |
| Medium   | Missing Referrer-Policy       | 59    | 94%     | Security Headers   |
| Medium   | Unsafe Cross-Origin Links     | 59    | 94%     | Unsafe CrossOrigin |
| Medium   | Missing Alt Text              | 40    | 21%     | Image Issues       |
| Medium   | Missing Image Size Attributes | 184   | 98%     | Missing Size Attrs |
| Medium   | Hreflang Missing X-Default    | 14    | 24%     | Hreflang Issues    |
| Medium   | Title Below 30 Characters     | 7     | 12%     | Page Titles        |
| Medium   | Title Over 60 Characters      | 9     | 15%     | Page Titles        |
| Medium   | Title Over 561 Pixels         | 9     | 15%     | Page Titles        |
| Medium   | Title Same as H1              | 18    | 31%     | Page Titles        |
| Medium   | Meta Desc Below 70 Chars      | 12    | 20%     | Meta Descriptions  |
| Medium   | Meta Desc Over 155 Chars      | 11    | 19%     | Meta Descriptions  |
| Medium   | Internal 4XX Errors           | 2     | 0.6%    | 4XX Errors         |
| Medium   | Internal 3XX Redirects        | 2     | 0.6%    | 3XX Redirects      |
| Low      | Images Over 100KB             | 8     | 4%      | Image Issues       |
| Low      | Difficult Readability         | 4     | 7%      | Readability        |
| Low      | External 4XX Errors           | 2     | 0.6%    | 4XX Errors         |

---

# Section 3: Recommendations and next steps

Prioritized action plan for addressing identified issues. Tasks are organized by urgency and impact. Reference Appendix A for specific URLs to fix.

## Priority 1: Critical (Week 1 2026)

These issues directly impact indexability and should be fixed immediately.

1. Add canonical tags to all 59 pages (see Appendix A: Missing Canonicals)
2. Fix header structure on all pages - ensure H1 is first heading (see Appendix A: H1 Issues)
3. Create unique H2 headings across pages (see Appendix A: H2 Issues)

## Priority 2: High (Week 2 2026)

These issues significantly affect SEO performance and user experience. We are not sure if all these things are doable in Webflow.

1. Add descriptive anchor text to internal links (see Appendix A: No Anchor Text)
2. Fix 4XX errors and update links pointing to them (see Appendix A: 4XX Errors, 4XX Link Sources)
3. Update links pointing to redirects (see Appendix A: 3XX Link Sources)
4. Add hreflang x-default to 14 pages (see Appendix A: Hreflang Issues)

## Priority 3: Medium (Weeks 3-4 2026)

These issues provide optimization opportunities and security improvements.

1. Add security headers: X-Content-Type-Options, Referrer-Policy (see Appendix A: Security Headers)
2. Add `rel="noopener noreferrer"` to external links (see Appendix A: Unsafe CrossOrigin)
3. Add alt text to 40 images (see Appendix A: Image Issues)
4. Add width/height attributes to 184 images (see Appendix A: Missing Size Attrs)
5. Optimize title tags and meta descriptions (see Appendix A: Page Titles, Meta Descriptions)

## Priority 4: Ongoing maintenance (as of March/April 2026)

Regular tasks to maintain and improve SEO health.

- Run monthly Screaming Frog crawl to monitor for new issues
- Monitor Google Search Console for crawl errors and indexing issues
- Compress and optimize images before uploading
- Create unique titles and descriptions for all new pages
- Maintain proper hreflang implementation for new language pages
- Content and keyword optimization will be part of work planned for A.Nobel as of March/April 2026

---

# Appendix reference

Appendix A: See Excel file in the email attachments.

This Excel file contains 18 tabs with complete URL lists for all issues identified in this report. Each tab corresponds to a specific issue type and includes all affected URLs for easy implementation.
