# Response Codes SEO Guide for anobel.com

> **Audit Category:** Response Codes (4XX Errors & 3XX Redirects)
> **Severity:** HIGH (P2)
> **Estimated Fix Time:** 2-3 hours
> **CMS Platform:** Webflow
> **Affects:** Crawl budget, user experience, link equity

---

## Executive Summary

The SEO audit identified **broken links and redirect chains** across anobel.com that are actively harming the site's search performance.

| Metric | Count | % of Total |
|--------|------:|----------:|
| Internal pages returning 4XX errors | 2 | 0.6% |
| External resources returning 4XX errors | 2 | 0.6% |
| Links pointing to 4XX pages | 571 | — |
| Internal pages returning 3XX redirects | 2 | 0.6% |
| Links pointing to redirect URLs | 56 | — |

**Why this matters:** While only 4 pages have problematic status codes, the ripple effect is severe — **571 links** across the site point to broken pages. Every time Google's crawler or a visitor hits one of these links, it wastes crawl budget, creates a poor user experience, and leaks link equity that should be strengthening your pages.

---

## Understanding Response Codes

When a browser or search engine crawler requests a page, the server responds with a three-digit status code. Here is what each code means:

| Code | Name | Meaning | Good or Bad? |
|------|------|---------|:------------:|
| **200** | OK | Page loaded successfully | Good |
| **301** | Moved Permanently | Page has a new permanent URL | Acceptable (but wastes crawl budget if links aren't updated) |
| **302** | Found (Temporary Redirect) | Page temporarily at a different URL | Avoid for permanent moves |
| **404** | Not Found | Page does not exist | Bad — broken link |
| **410** | Gone | Page was permanently removed | Acceptable if intentional |

**The goal:** Every internal link on anobel.com should lead to a page that returns **200 OK**. No visitor or crawler should encounter a 4XX error or an unnecessary redirect.

---

## 4XX Error Analysis

### What the audit found

**2 internal pages** return a 4XX status code (most likely 404 Not Found). These 2 pages are linked to from **571 locations** across the site.

That means 571 links are currently broken — every one of them sends visitors and crawlers to a dead end.

### Impact

| Impact Area | Description |
|------------|-------------|
| **Crawl budget** | Google allocates a limited number of pages to crawl per visit. Every 4XX error wastes part of that budget on a page that returns nothing useful. |
| **User experience** | Visitors clicking a link and landing on a 404 page are likely to leave the site entirely. This increases bounce rate and reduces conversions. |
| **Link equity** | Internal links pass ranking power (link equity) between pages. A link to a 404 page passes zero equity — that ranking power is lost. With 571 broken links, a meaningful amount of internal link equity is being wasted. |

### Finding the specific broken URLs

The exact URLs returning 4XX errors are listed in **Appendix A of the audit Excel file**. If you do not have the Excel file, you can find them yourself using Screaming Frog:

1. Open **Screaming Frog SEO Spider**
2. Enter `https://www.anobel.com` and click **Start**
3. Wait for the crawl to complete
4. Click the **Response Codes** tab in the top pane
5. In the filter dropdown, select **Client Error (4XX)**
6. The table now shows all pages returning 4XX status codes
7. Click on any 4XX URL, then look at the **Inlinks** tab at the bottom to see every page that links to it

---

## 3XX Redirect Analysis

### What the audit found

**2 internal pages** return a 3XX redirect (most likely 301 Moved Permanently). Instead of linking directly to the final destination, **56 links** across the site point to the old URL that then redirects.

### Impact

| Impact Area | Description |
|------------|-------------|
| **Link equity loss** | Each redirect loses approximately **10-15%** of link equity. With 56 links going through redirects, this adds up. |
| **Page load speed** | A redirect adds an extra server round-trip before the page loads. This makes the site feel slower, especially on mobile. |
| **Crawl budget** | Google must follow the redirect chain, using additional crawl budget to reach the final page. |

### Example of the problem

```
Current (bad):
Link on page → old-url (301 redirect) → new-url (200 OK)

Correct (good):
Link on page → new-url (200 OK)
```

The redirect itself should stay in place (for external links and bookmarks), but all **internal** links should be updated to point directly to the final destination URL.

---

## How to Find Broken Links

### Method 1: Screaming Frog (Recommended)

This is the most thorough approach.

**Finding 4XX errors:**
1. Crawl `https://www.anobel.com`
2. Go to **Response Codes** tab
3. Filter: **Client Error (4XX)**
4. Note each URL and its **Inlinks** (bottom pane)

**Finding 3XX redirects:**
1. Same crawl results
2. Filter: **Redirection (3XX)**
3. Note each URL, its **redirect destination**, and its **Inlinks**

### Method 2: Google Search Console

1. Log in to [Google Search Console](https://search.google.com/search-console)
2. Select the anobel.com property
3. Go to **Pages** (formerly Coverage) in the left sidebar
4. Click on **Not indexed** to see pages with errors
5. Look for entries marked **Not found (404)** or **Page with redirect**

### Method 3: Manual browser check

1. Open each suspected URL in your browser
2. If you see a 404 error page, the link is broken
3. If the URL changes after loading (check the address bar), it is a redirect

---

## How to Fix in Webflow

### Fixing 4XX Errors

There are three scenarios. Determine which applies to each broken URL:

#### Scenario A: The page was moved to a new URL

The old URL no longer works, but the content exists at a different URL.

**Steps:**
1. Go to **Project Settings** > **Hosting** > **301 Redirects**
2. Add a redirect:
   - **Old Path:** `/old-page-slug` (just the path, not the full URL)
   - **New Path:** `/new-page-slug`
3. Click **Add Redirect**
4. **Then update all internal links** (see "Updating links in Webflow Designer" below)

#### Scenario B: The page was deleted and has no replacement

The content no longer exists and there is no equivalent page.

**Steps:**
1. Open the **Webflow Designer**
2. Find every page that links to the deleted URL (use Screaming Frog's Inlinks list)
3. Remove or replace each link — point it to the most relevant existing page
4. Publish the site

#### Scenario C: The URL contains a typo

The link simply has the wrong URL (e.g., `/servics` instead of `/services`).

**Steps:**
1. Open the **Webflow Designer**
2. Find the element with the broken link
3. Select it and open the **Link Settings** panel (right side)
4. Correct the URL
5. Publish the site

---

### Fixing 3XX Redirect Issues

For each of the 56 links pointing to redirect URLs:

**Steps:**
1. Identify the **old URL** (the one that redirects) and the **final destination URL** (where it redirects to)
2. Open the **Webflow Designer**
3. Find each page containing a link to the old URL
4. Select the link element
5. Update the **href** to the final destination URL
6. **Keep the 301 redirect in place** — external sites and bookmarks may still use the old URL
7. Publish the site

---

### Updating Links in Webflow Designer

For both 4XX and 3XX fixes, you need to update links across the site. Here is how:

1. Open the **Webflow Designer** for anobel.com
2. Navigate to the page that contains the broken/redirect link
3. Select the link element (button, text link, image link, etc.)
4. In the right panel, click the **link icon** or open **Link Settings**
5. Update the URL to the correct destination
6. Repeat for every page listed in the Inlinks report
7. **Publish** the site when all links on a page are fixed

**Tip:** Work through one broken URL at a time. Fix all 571 links pointing to broken URL #1, then all links pointing to broken URL #2. This is more efficient than going page by page.

---

### Webflow 301 Redirects Reference

**Location:** Project Settings > Hosting > 301 Redirects

| Field | Description | Example |
|-------|-------------|---------|
| **Old Path** | The path that no longer works (no domain) | `/oude-pagina` |
| **New Path** | The path it should redirect to (no domain) | `/nieuwe-pagina` |

**Rules:**
- Paths must start with `/`
- Do not include the domain (`https://www.anobel.com`)
- Redirects apply after publishing
- Webflow supports basic wildcard patterns (e.g., `/blog/%` redirects all blog subpages)

**Example:**

| Old Path | New Path |
|----------|----------|
| `/diensten-oud` | `/diensten` |
| `/over-ons/team-oud` | `/over-ons/team` |

---

## Prioritized Fix List

Work through the fixes in this order for maximum impact:

| Priority | Task | Why | Effort |
|:--------:|------|-----|--------|
| **1** | Fix the 2 internal 4XX pages | Resolves **571 broken links** in one action. Biggest SEO and UX impact. | 30-60 min |
| **2** | Update the 56 links pointing to 3XX redirects | Recovers lost link equity and improves page load speed. | 60-90 min |
| **3** | Fix the 2 external 4XX errors | These are links to external sites that no longer work. Replace or remove them. | 15-30 min |

### Priority 1 detail: Internal 4XX pages

For each of the 2 broken internal pages:
1. Determine if the page was moved, deleted, or has a typo (Scenarios A/B/C above)
2. Apply the appropriate fix
3. Update all internal links pointing to it
4. This single action fixes the majority of the 571 broken link instances

### Priority 2 detail: Links pointing to redirects

For each of the 2 pages that redirect:
1. Find the final destination URL
2. Update all 56 internal links to point directly to the final URL
3. Keep the 301 redirect active for external traffic

### Priority 3 detail: External 4XX errors

For each of the 2 broken external links:
1. Check if the external page has moved to a new URL
2. If yes, update the link to the new URL
3. If no, remove the link or replace it with a link to a similar resource

---

## Verification

After completing the fixes, verify that everything works correctly.

### Immediate verification

1. **Re-crawl with Screaming Frog**
   - Run a full crawl of `https://www.anobel.com`
   - Check the Response Codes tab
   - Filter by 4XX — there should be **0 internal client errors**
   - Filter by 3XX — the 2 redirects may still exist (that is fine), but no internal links should point to them

2. **Test manually**
   - Visit each previously broken URL in your browser
   - Confirm it either loads correctly (200) or redirects properly (301)
   - Click through the links you updated to verify they reach the correct page

### Ongoing monitoring

| Task | Frequency | Tool |
|------|-----------|------|
| Check Google Search Console for new crawl errors | Weekly | GSC > Pages |
| Run a Screaming Frog crawl | Monthly | Screaming Frog |
| Test new pages and links before publishing | Before each publish | Manual / Screaming Frog |

---

## Prevention

Follow these practices to avoid response code issues in the future:

### When moving or renaming a page in Webflow

1. **Before** changing the slug, note the current URL path
2. Change the page slug in the **Page Settings** panel
3. Immediately add a **301 redirect** from the old path to the new path
4. Search the site for any internal links using the old URL and update them
5. Publish

### When deleting a page

1. Check which pages link to it (use Screaming Frog or search in Designer)
2. Update or remove all internal links pointing to it
3. If the page had external traffic or backlinks, set up a 301 redirect to the most relevant alternative page
4. Delete the page
5. Publish

### Before publishing any changes

1. Review all new or updated links
2. Click each one in Preview mode to verify it loads correctly
3. Check that no links point to staging URLs, placeholder pages, or `#`

### Monthly maintenance

1. Run a Screaming Frog crawl at least once per month
2. Check for any new 4XX errors or redirect chains
3. Fix issues immediately — they compound over time as more links accumulate

---

## Quick Reference Card

| Problem | How to Identify | How to Fix |
|---------|----------------|------------|
| 404 broken link | Screaming Frog > Response Codes > 4XX | Update link href or set up 301 redirect |
| 301 redirect link | Screaming Frog > Response Codes > 3XX > check Inlinks | Update internal links to final destination URL |
| External broken link | Screaming Frog > Response Codes > 4XX (external tab) | Replace or remove the link |
| Redirect chain (A → B → C) | Screaming Frog > Redirect Chains report | Update link to point to final URL (C) |

---

*This guide is part of the anobel.com SEO audit. For the full list of issues and priorities, see the [Master SEO Implementation Guide](00_master_seo_implementation_guide.md).*
