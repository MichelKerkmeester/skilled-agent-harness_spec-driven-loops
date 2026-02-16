# Blog Template SEO Guide for anobel.com

> **Document Type:** CMS Template SEO Implementation Guide
> **Severity:** P1 CRITICAL (template-level issues affecting ALL blog posts)
> **Template:** Blog Post Collection Page (`detail_blog.html`)
> **Estimated Time:** 2-3 hours (template fixes) + ongoing per-post content
> **Applies To:** All current and future blog posts

---

## Executive Summary

The blog post CMS template has **structural SEO issues that cascade to every published blog post**. Because these are template-level problems, fixing them once in the Webflow Designer automatically fixes every post.

### Issues at a Glance

| # | Issue | Type | Severity | Scope |
|---|-------|------|----------|-------|
| 1 | **H6 tags used for article subheadings** | Template | P1 Critical | 6 elements, all posts |
| 2 | **Missing dynamic canonical tag** | Template | P1 Critical | All posts |
| 3 | **Missing dynamic hreflang tags** | Template | P1 Critical | All posts |
| 4 | **Missing dynamic title tag binding** | Template | P1 Critical | All posts |
| 5 | **Missing dynamic meta description** | Template | P1 Critical | All posts |
| 6 | **Empty headings (unpopulated CMS fields)** | Per-post | P2 High | Many posts |
| 7 | **"Back to overview" link target** | Template | P3 Medium | All posts |

### Why This Is Critical

Every blog post inherits the broken heading hierarchy (H1 jumps to H6) and lacks basic SEO signals (canonical, hreflang, unique title, meta description). Search engines cannot properly understand, index, or rank any blog content until these template issues are resolved.

---

## Template vs Per-Post: Understanding the Two Fix Types

```
TEMPLATE FIXES (Webflow Designer)          PER-POST FIXES (Webflow CMS Editor)
========================================   ========================================
Fix ONCE in the Collection Template        Fix INDIVIDUALLY in each CMS item
Automatically applies to ALL posts         Must be done for each blog post
                                           
- H6 -> H2 tag conversion                 - Populate title (H1 content)
- Dynamic canonical tag                    - Populate subheadings (H2 content)
- Dynamic hreflang tags                    - Write excerpt/summary (meta desc)
- Title tag CMS binding                    - Set proper slug
- Meta description CMS binding             - Fill in all CMS fields
- "Back to overview" link                  
```

**Do template fixes first.** Per-post fixes depend on the template being correct.

---

## Part 1: Template Fixes (Webflow Designer)

### Fix 1: Convert H6 Tags to H2 (P1 CRITICAL)

**Problem:** The blog template uses 6 H6 tags for article section subheadings. This breaks heading hierarchy because H1 jumps directly to H6, skipping H2 through H5.

**Current heading structure (broken):**
```
H1: Blog Post Title
  H6: Section Heading 1    <-- skips H2-H5!
  H6: Section Heading 2    <-- skips H2-H5!
  H6: Section Heading 3    <-- skips H2-H5!
  H6: Section Heading 4    <-- skips H2-H5!
  H6: Section Heading 5    <-- skips H2-H5!
  H6: Section Heading 6    <-- skips H2-H5!
    H3: Subsection
  H2: CTA Section
```

**Why this matters:**
- Search engines use heading hierarchy to understand content structure
- Screen readers use headings for navigation - skipped levels confuse users
- Google may interpret H6 as insignificant rather than major section headings
- Featured snippet eligibility depends on proper heading structure

**Steps in Webflow Designer:**

1. Open the **Blog Post Collection Template** in the Designer
2. Navigate to the blog content area where article sections are defined
3. Select the **first H6 element** (it will have a CMS binding for a subheading field)
4. In the **Element Settings** panel (gear icon, right sidebar):
   - Find the **Tag** dropdown (shows "H6")
   - Change it to **H2**
5. Repeat for all 6 H6 elements in the template
6. The CMS bindings will remain intact - only the HTML tag changes

**Target heading structure (correct):**
```
H1: Blog Post Title
  H2: Section Heading 1    <-- proper hierarchy
  H2: Section Heading 2
  H2: Section Heading 3
    H3: Subsection          <-- correct nesting under H2
  H2: Section Heading 4
  H2: Section Heading 5
  H2: Section Heading 6
```

**Visual styling note:** Changing from H6 to H2 may change the visual size of the text. After changing the tag:
- Check if the existing CSS class (e.g., `u--text-size-inherit`) handles the styling
- If the text appears too large, adjust the font size on the class applied to these H2 elements
- Do NOT keep the tag as H6 just to preserve styling - fix the styling separately

---

### Fix 2: Add Dynamic Canonical Tag (P1 CRITICAL)

**Problem:** Blog posts have no canonical tag, so search engines cannot determine the authoritative URL for each post. This can cause duplicate content issues and indexing problems.

**Steps in Webflow Designer:**

1. Open the **Blog Post Collection Template**
2. Go to **Collection Template Settings** (gear icon on the Collection Template)
3. Navigate to **Custom Code** > **Inside `<head>` tag**
4. Add the following code:

```html
<link rel="canonical" href="https://anobel.com/nl/blog/{{wf {"path":"slug","type":"PlainText"} }}" />
```

**How it works:**
- `{{wf {"path":"slug","type":"PlainText"} }}` is Webflow's CMS template syntax
- It dynamically inserts each blog post's slug
- For a post with slug `maritime-safety-tips`, the rendered output becomes:

```html
<link rel="canonical" href="https://anobel.com/nl/blog/maritime-safety-tips" />
```

**Important:** Verify the URL path matches your actual blog URL structure. If your blog posts live at `/blog/` (without `/nl/`), adjust accordingly.

---

### Fix 3: Add Dynamic Hreflang Tags (P1 CRITICAL)

**Problem:** Blog posts lack hreflang tags, so search engines do not know which language version to serve in different regions. This is especially important for anobel.com's Dutch/English bilingual setup.

**Steps in Webflow Designer:**

1. In the same **Custom Code** > **Inside `<head>` tag** section (from Fix 2), add:

```html
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/blog/{{wf {"path":"slug","type":"PlainText"} }}" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/blog/{{wf {"path":"slug","type":"PlainText"} }}" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/blog/{{wf {"path":"slug","type":"PlainText"} }}" />
```

**Complete `<head>` custom code block (Fix 2 + Fix 3 combined):**

```html
<!-- SEO: Canonical and Hreflang for blog posts -->
<link rel="canonical" href="https://anobel.com/nl/blog/{{wf {"path":"slug","type":"PlainText"} }}" />
<link rel="alternate" hreflang="nl" href="https://anobel.com/nl/blog/{{wf {"path":"slug","type":"PlainText"} }}" />
<link rel="alternate" hreflang="en" href="https://anobel.com/en/blog/{{wf {"path":"slug","type":"PlainText"} }}" />
<link rel="alternate" hreflang="x-default" href="https://anobel.com/nl/blog/{{wf {"path":"slug","type":"PlainText"} }}" />
```

**Note on `x-default`:** This points to the Dutch version as the default, consistent with the site's primary language. Search engines use this when a user's language preference does not match `nl` or `en`.

**Note on EN blog posts:** If English blog posts exist at a different path or in a separate CMS collection, the hreflang `en` href should point to that collection's URL structure instead.

---

### Fix 4: Bind Title Tag to CMS Field (P1 CRITICAL)

**Problem:** Blog post pages may all share the same generic title tag, or the title tag may not reflect the individual post's content. Each post needs a unique, descriptive title for search results.

**Steps in Webflow Designer:**

1. Open the **Blog Post Collection Template**
2. Go to **Collection Template Settings** (gear icon)
3. Navigate to **SEO Settings** > **Title Tag**
4. Click the **purple "CMS" icon** (+ Add Field) to insert a dynamic field
5. Select the **blog post title** CMS field
6. After the dynamic field reference, type the suffix: ` | A. Nobel & Zn`

**Result pattern:**
```
{Blog Post Title} | A. Nobel & Zn
```

**Example rendered output:**
```
Maritieme Veiligheidstips voor 2026 | A. Nobel & Zn
```

**Best practices for the title tag:**
- Keep total length under 60 characters (Google truncates longer titles)
- The blog post title CMS field should be descriptive and keyword-rich
- The ` | A. Nobel & Zn` suffix provides brand recognition (12 characters including spaces)
- This means blog post titles should ideally be under 48 characters

---

### Fix 5: Bind Meta Description to CMS Field (P1 CRITICAL)

**Problem:** Blog posts likely share a generic meta description or have none, missing the opportunity to control how each post appears in search results.

**Steps in Webflow Designer:**

1. In the same **SEO Settings** panel as Fix 4
2. Navigate to **Meta Description**
3. Click the **purple "CMS" icon** (+ Add Field) to insert a dynamic field
4. Select the **excerpt** or **summary** CMS field

**If no excerpt/summary field exists in the CMS:**
1. Go to the **Blog Posts CMS Collection** settings
2. Add a new **Plain Text** field named "Meta Description" or "Excerpt"
3. Set the character limit guidance to 155 characters
4. Return to the template SEO settings and bind to this new field

**Best practices for meta descriptions:**
- 150-160 characters maximum
- Include relevant keywords naturally
- Write a compelling summary that encourages clicks
- Each post must have a unique description (per-post task)

---

### Fix 6: Verify "Back to Overview" Link (P3 MEDIUM)

**Problem:** The blog template contains a "back to overview" navigation link. Verify it points to the correct blog listing page.

**Steps:**

1. In the Blog Post Collection Template, locate the "back to overview" link element
2. Check the link destination in the **Element Settings** panel
3. It should point to the **blog listing page** (e.g., `/nl/blog` or `/blog`)
4. If it points to a different page (e.g., homepage, or a wrong section), update it

---

### Fix 7: Check for Dual-H2 Pattern in CTA Section (P2 HIGH)

**Problem:** Across the site, CTA (Call-to-Action) sections use a pattern where two consecutive H2 tags appear - one for a caption/label and one for the actual heading. This same anti-pattern may exist in the blog template's CTA section.

**Current blog template CTA section (from analysis):**
```
H2: "Nobel houdt u op koers." (line 5397 in detail_blog.html)
```

**Steps to check and fix:**

1. Locate the CTA section at the bottom of the blog post template
2. Check if there are **two consecutive H2 elements** in that section:
   - First H2: A short label/caption (e.g., "Contact" or section name)
   - Second H2: The actual heading text (e.g., "Nobel houdt u op koers.")
3. If the dual-H2 pattern exists:
   - Keep the **meaningful heading** as H2 (e.g., "Nobel houdt u op koers.")
   - Change the **caption/label H2** to a `<span>` or `<div>` element
   - Apply the same CSS class it already has to maintain visual styling
4. This is the same fix applied site-wide (see `03_h2_structure_guide.md`)

---

## Part 2: Per-Post CMS Fixes (Webflow CMS Editor)

After completing the template fixes above, each individual blog post needs content populated in its CMS fields.

### Required Fields per Blog Post

| CMS Field | Maps To | Priority | Notes |
|-----------|---------|----------|-------|
| **Title** | H1 heading + Title tag | P1 Critical | Must be descriptive, keyword-rich, <48 chars ideal |
| **Slug** | Canonical URL + hreflang URLs | P1 Critical | Lowercase, hyphens, no special characters |
| **Subheading fields** (x6) | H2 tags (after Fix 1) | P2 High | Each populated field creates a visible H2 section heading |
| **Excerpt / Summary** | Meta description | P1 Critical | 150-160 chars, compelling, includes keywords |
| **Body content** | Article content | P1 Critical | Substantive content under each H2 section |

### Steps for Each Blog Post

1. Open the **Webflow CMS Editor** (or navigate to CMS > Blog Posts in the Designer)
2. Select a blog post to edit
3. Fill in or review the following:

**Title field:**
```
Good:  "Maritieme Veiligheidstips voor Scheepvaart in 2026"
Bad:   "Blog post 1"
Bad:   "" (empty)
```

**Slug field:**
```
Good:  "maritieme-veiligheidstips-2026"
Bad:   "blog-post-1"
Bad:   "maritieme veiligheidstips" (no spaces allowed)
```

**Subheading fields (section headings):**
```
Good:  "Waarom Maritieme Veiligheid Essentieel Is"
Good:  "Top 5 Veiligheidsmaatregelen aan Boord"
Bad:   "" (empty - creates invisible empty H2 tag)
Bad:   "Section 1"
```

**Excerpt / Meta Description field:**
```
Good:  "Ontdek de belangrijkste maritieme veiligheidstips voor 2026. 
        A. Nobel & Zn deelt praktische maatregelen voor scheepvaart."
Bad:   "" (empty - no meta description in search results)
Bad:   "Lorem ipsum dolor sit amet..." (placeholder text)
```

### Handling Empty Subheading Fields

If a blog post has fewer than 6 sections, some subheading CMS fields will be empty. Empty CMS-bound H2 tags render as:

```html
<h2 class="w-dyn-bind-empty"></h2>
```

**Options:**
1. **Preferred:** Populate all subheading fields with meaningful section titles
2. **Acceptable:** Leave unused fields empty - Webflow hides `w-dyn-bind-empty` elements via CSS (`display: none`), so they do not render visually, but they still exist in the DOM
3. **Best for SEO:** Consider whether the template needs all 6 subheading slots. If most posts use only 3-4 sections, consider reducing the number of subheading elements in the template

---

## Part 3: Heading Hierarchy Reference

### Before Template Fix (Current - Broken)

```
<h1> Blog Post Title                    (CMS-bound, sometimes empty)
  <h6> Section Heading 1                (WRONG LEVEL - skips H2-H5)
  <h6> Section Heading 2                (WRONG LEVEL)
  <h6> Section Heading 3                (WRONG LEVEL)
    <h3> Subsection                     (appears AFTER H6 - broken nesting)
  <h6> Section Heading 4                (WRONG LEVEL)
  <h6> Section Heading 5                (WRONG LEVEL)
  <h6> Section Heading 6                (WRONG LEVEL)
  <h2> CTA Section Heading              (correct level, but after H6 chaos)
```

**What search engines see:** A page that starts with a main heading (H1), then immediately drops to the least important heading level (H6) for its primary content sections. An H3 appears nested under H6 (nonsensical), and an H2 appears at the end. The hierarchy is unintelligible.

### After Template Fix (Target - Correct)

```
<h1> Blog Post Title
  <h2> Section Heading 1               (proper hierarchy under H1)
  <h2> Section Heading 2
  <h2> Section Heading 3
    <h3> Subsection                     (correctly nested under H2)
  <h2> Section Heading 4
  <h2> Section Heading 5
  <h2> Section Heading 6
  <h2> CTA Section Heading              (consistent with other H2s)
```

**What search engines see:** A clearly structured article with a main topic (H1), logically organized sections (H2s), and detailed subsections where needed (H3s). This is the expected structure for blog content.

---

## Part 4: Verification Steps

After completing the template fixes, verify everything works correctly.

### Step 1: Preview a Published Blog Post

1. In the Webflow Designer, click **Preview** (eye icon)
2. Navigate to a blog post that has populated CMS fields
3. Confirm the page renders correctly with no visual regressions

### Step 2: Verify Heading Hierarchy

**Using browser DevTools:**
1. Right-click on the page > **Inspect**
2. In the console, run:
   ```javascript
   document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => 
     console.log(h.tagName, h.textContent.trim().substring(0, 60))
   );
   ```
3. Verify the output shows: H1 first, then H2s, with H3s nested logically

**Using HeadingsMap browser extension:**
1. Install [HeadingsMap](https://chrome.google.com/webstore/detail/headingsmap/) for Chrome/Firefox
2. Navigate to a blog post
3. Click the HeadingsMap icon
4. Verify:
   - One H1 at the top
   - H2s for section headings (no H6s remaining)
   - H3s only appear under H2s
   - No skipped heading levels

### Step 3: Verify `<head>` Tags

1. Right-click on the blog post page > **View Page Source** (Ctrl+U / Cmd+U)
2. Search for (Ctrl+F) the following:

**Canonical tag:**
```
Search for: rel="canonical"
Expected:   <link rel="canonical" href="https://anobel.com/nl/blog/[post-slug]" />
```

**Hreflang tags:**
```
Search for: hreflang
Expected:   3 link tags with hreflang="nl", hreflang="en", hreflang="x-default"
            Each containing the correct blog post slug
```

**Title tag:**
```
Search for: <title>
Expected:   <title>[Blog Post Title] | A. Nobel &amp; Zn</title>
```

**Meta description:**
```
Search for: name="description"
Expected:   <meta name="description" content="[Post excerpt/summary text]" />
```

### Step 4: Test Multiple Posts

Repeat the above checks on at least 2-3 different blog posts to confirm the dynamic CMS bindings work correctly across all posts (not just one).

### Step 5: Test an Empty Post

Check a blog post that has minimal CMS content populated. Verify:
- Empty subheading H2s are hidden (not visible on page)
- The canonical and hreflang tags still render with the slug
- The title tag falls back gracefully (not blank)

---

## Implementation Checklist

### Template Fixes (Do First)

- [ ] **Fix 1:** Convert all 6 H6 tags to H2 in the blog template
- [ ] **Fix 2:** Add dynamic canonical tag in Collection Template `<head>` custom code
- [ ] **Fix 3:** Add dynamic hreflang tags (nl, en, x-default) in same custom code block
- [ ] **Fix 4:** Bind title tag to blog post title CMS field + add ` | A. Nobel & Zn` suffix
- [ ] **Fix 5:** Bind meta description to excerpt/summary CMS field
- [ ] **Fix 6:** Verify "Back to overview" link points to blog listing page
- [ ] **Fix 7:** Check CTA section for dual-H2 pattern; fix if present

### Per-Post Fixes (Ongoing)

- [ ] Audit all existing blog posts for empty CMS fields
- [ ] Populate title field for every post
- [ ] Populate subheading fields with descriptive section titles
- [ ] Write unique excerpt/meta description for every post (150-160 chars)
- [ ] Verify slugs are clean and descriptive

### Verification

- [ ] Preview blog post and confirm visual correctness
- [ ] Verify heading hierarchy with DevTools or HeadingsMap
- [ ] Confirm canonical tag in page source with correct slug
- [ ] Confirm hreflang tags in page source with correct slug
- [ ] Confirm title tag includes post title + brand suffix
- [ ] Confirm meta description renders post excerpt
- [ ] Test on at least 3 different blog posts
- [ ] Publish and verify on live site

---

## Related Guides

| Guide | Relevance to Blog Template |
|-------|---------------------------|
| `02_h1_structure_guide.md` | H1 handling, empty H1 fix, cookie modal H2 issue |
| `03_h2_structure_guide.md` | Dual-H2 pattern fix, empty H2 analysis, H6-to-H2 context |
| `04_heading_semantic_guide.md` | Full heading hierarchy best practices |
| `00_master_seo_implementation_guide.md` | Overall priority matrix and timeline |
