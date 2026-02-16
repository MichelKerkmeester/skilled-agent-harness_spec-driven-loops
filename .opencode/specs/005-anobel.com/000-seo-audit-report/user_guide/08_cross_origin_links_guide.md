# Cross-Origin Links Security Guide for anobel.com

> Detailed guide for fixing unsafe cross-origin destination links identified in the SEO audit. This issue affects 94% of all pages and exposes the site to reverse tabnabbing vulnerabilities.

---

## Executive Summary

### Issue Identified

| Issue | Severity | Pages Affected | Impact |
|-------|----------|----------------|--------|
| **Unsafe Cross-Origin Destinations** | Medium (P3) | 59 pages (94%) | Security vulnerability + minor performance impact |

### What This Means

External links on anobel.com that open in a new tab (`target="_blank"`) are missing the `rel="noopener noreferrer"` attribute. This is a widespread issue affecting nearly every page on the site.

```
CURRENT (Problematic):
<a href="https://linkedin.com/company/anobel" target="_blank">LinkedIn</a>

CORRECT:
<a href="https://linkedin.com/company/anobel" target="_blank" rel="noopener noreferrer">LinkedIn</a>
```

**Estimated Fix Time:**
- **Approach A (Script):** ~30 minutes (recommended)
- **Approach B (Manual):** 2-3 hours

---

## Why This Matters

### 1. Security Risk: Reverse Tabnabbing

When a link opens in a new tab without `rel="noopener"`, the newly opened page gains access to your original page through the `window.opener` JavaScript property. A malicious or compromised external site could use this to:

```
User clicks external link → New tab opens external site
                            ↓
                External site runs: window.opener.location = "https://fake-anobel.com/login"
                            ↓
                Original anobel.com tab silently redirects to a phishing page
                            ↓
                User switches back and sees a fake login page
```

This is called **reverse tabnabbing**. While the risk is low for trusted destinations like LinkedIn or Google Maps, it is a recognized security vulnerability that audit tools flag.

### 2. Performance: Shared Process

Without `noopener`, the new tab may share the same operating system process as your page. This means:

- The external site's JavaScript can affect your page's performance
- Heavy external pages can slow down the anobel.com tab
- Adding `noopener` ensures the new tab runs in its own process

### 3. Privacy: Referrer Information

Without `noreferrer`, when a visitor clicks an external link:

- The external site receives the full URL of the anobel.com page the visitor came from
- This includes any URL parameters or internal page paths
- Adding `noreferrer` prevents this referrer information from being sent

> **Note:** For most of anobel.com's external links (social media, Google Maps, partner sites), the referrer data is not sensitive. However, applying `noreferrer` universally is the accepted best practice and prevents future edge cases.

---

## What Needs to Change

Every `<a>` tag on anobel.com that has `target="_blank"` must also include `rel="noopener noreferrer"`.

### The Rule

```
IF a link has target="_blank"
THEN it MUST also have rel="noopener noreferrer"
```

This applies to:

- Footer social media links (LinkedIn, Facebook, Instagram)
- Google Maps embed links
- Partner and supplier website links (Baldwin Filters, etc.)
- Any CMS-generated external links in blog posts
- Any external link added in rich text fields

---

## Approach A: Automated Script (Recommended)

This approach uses a small JavaScript snippet to automatically fix all external links site-wide, including any links added in the future through the CMS.

### Step 1: Open Webflow Project Settings

1. Log in to Webflow
2. Open the **anobel.com** project
3. Click the gear icon (⚙) in the left sidebar to open **Project Settings**
4. Navigate to the **Custom Code** tab

### Step 2: Add the Script

Scroll down to the **Footer Code** section (the field labeled "Before `</body>` tag"). Paste the following script:

```html
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

### Step 3: Save and Publish

1. Click **Save Changes** at the bottom of the Project Settings page
2. Go back to the Designer
3. Click **Publish** to push the changes live

### How the Script Works

| Step | What Happens |
|------|--------------|
| 1 | Page finishes loading (`DOMContentLoaded` fires) |
| 2 | Script finds ALL links with `target="_blank"` |
| 3 | For each link, checks if `noopener` is already present |
| 4 | If missing, adds `noopener noreferrer` to the `rel` attribute |

### Benefits of This Approach

- **One-time setup** - No need to edit individual links
- **Covers all pages** - The footer code runs on every page
- **Future-proof** - Any new external links added via CMS or Designer are automatically fixed
- **Catches CMS content** - Links inside blog posts and other CMS rich text fields are included
- **Non-destructive** - Does not remove existing `rel` values, only adds what is missing

### Limitations

- The fix is applied via JavaScript after the page loads. If a search engine's crawler does not execute JavaScript, it may still see the unfixed HTML. In practice, Google's crawler executes JavaScript, so this is not an issue for Google.
- The fix is not visible in Webflow's Designer view (only on the published site).

---

## Approach B: Manual Fix in Webflow Designer

If you prefer not to use custom code, you can fix each link individually in the Webflow Designer.

### For Each External Link

1. Open the Webflow Designer
2. Use the **Navigator** panel (left sidebar, layers icon) to find link elements
3. Select the `<a>` element that links to an external site
4. Open the **Settings** panel (right sidebar, gear icon)
5. Verify that **Open in new tab** is enabled
6. Add a custom attribute:
   - Click **+ Add Custom Attribute** (at the bottom of the Settings panel)
   - Name: `rel`
   - Value: `noopener noreferrer`
7. Repeat for every external link on every page

### Important Notes for Manual Approach

- **Symbols:** If an external link is inside a Webflow Symbol (e.g., the footer), fixing it in the Symbol will fix it on all pages that use the Symbol. This significantly reduces work.
- **CMS Rich Text:** Links inside CMS Rich Text fields cannot be edited in the Designer. You must open each CMS item, edit the rich text content, click on the link, and add the attribute there. This is tedious.
- **Webflow Default Behavior:** Newer versions of Webflow automatically add `rel="noopener noreferrer"` when you enable "Open in new tab." For older links, this may not have been applied. Re-toggling the "Open in new tab" setting off and on may trigger Webflow to add the attribute.

---

## Page-by-Page External Links Summary

The following table shows pages with the highest concentration of external links. These are the pages that benefit most from the fix.

### Pages with Most External Links

| Page | URL Path | Approx. External Links | Key Destinations |
|------|----------|------------------------|------------------|
| **Homepage** | `/` | ~39 | Social media, partner sites, Google Maps |
| **Contact** | `/contact` | ~38 | Google Maps, social media, email links |
| **Scheepsuitrusting** | `/scheepsuitrusting` | ~30+ | Supplier websites, product catalogs |
| **Filtratie** | `/filtratie` | ~30+ | Baldwin Filters, supplier sites |
| **Scheepsbunkering** | `/scheepsbunkering` | ~30+ | Industry associations, supplier sites |
| **Maatwerk** | `/maatwerk` | ~30+ | Partner websites, supplier links |
| **Dit is Nobel** | `/dit-is-nobel` | ~30+ | Social media, industry links |
| **Team** | `/team` | ~25+ | LinkedIn profiles, social links |
| **Locatie** | `/locatie` | ~25+ | Google Maps, direction links |
| **Werken Bij** | `/werkenbij` | ~25+ | Job platforms, social media |
| **Blog (template)** | `/blog/*` | Variable | CMS content links, social sharing |
| **Vacature (template)** | `/vacatures/*` | Variable | Job platforms, application links |

### Common External Link Destinations

| Destination | Type | Appears On |
|-------------|------|------------|
| LinkedIn (company page) | Social media | Footer (all pages), Team page |
| Facebook | Social media | Footer (all pages) |
| Instagram | Social media | Footer (all pages) |
| Google Maps | Location/directions | Contact, Locatie |
| Baldwin Filters | Supplier/partner | Filtratie, product pages |
| Other supplier websites | Partner links | Service pages |
| External blog references | CMS content | Blog posts |

> **Note:** Footer social media links appear in a Webflow Symbol. Fixing the Symbol once fixes it across all pages. This means the ~30 external links that repeat on every page (footer links) can be fixed in one action.

---

## Verification Steps

After applying the fix (either Approach A or B), verify that it works correctly.

### Method 1: Browser DevTools (Quick Check)

1. Open the published anobel.com site in Chrome
2. Right-click on any external link and select **Inspect**
3. In the **Elements** panel, look at the `<a>` tag
4. Verify it includes `rel="noopener noreferrer"`

You can also run this in the browser console (`F12` > Console tab):

```javascript
// Find all target="_blank" links missing noopener
var unsafe = [];
document.querySelectorAll('a[target="_blank"]').forEach(function(link) {
  if (!link.rel.includes('noopener')) {
    unsafe.push(link.href);
  }
});
if (unsafe.length === 0) {
  console.log('All cross-origin links are safe.');
} else {
  console.log(unsafe.length + ' unsafe links found:');
  unsafe.forEach(function(url) { console.log(' - ' + url); });
}
```

**Expected output after fix:**
```
All cross-origin links are safe.
```

### Method 2: View Page Source

1. Navigate to any page on anobel.com
2. Right-click > **View Page Source** (or press `Ctrl+U` / `Cmd+U`)
3. Press `Ctrl+F` / `Cmd+F` to open search
4. Search for `target="_blank"`
5. For each result, check that the same `<a>` tag also contains `rel="noopener noreferrer"`

> **Note:** If you used Approach A (script), the fix is applied by JavaScript after page load. It will NOT appear in View Page Source. Use DevTools (Method 1) instead, which shows the live DOM after JavaScript has run.

### Method 3: Screaming Frog (Full Audit)

1. Open Screaming Frog SEO Spider
2. Enter `https://anobel.com` and start the crawl
3. After the crawl completes, go to the **External** tab
4. Look at the **rel** column for each external link
5. Verify all entries show `noopener noreferrer`

### Method 4: Lighthouse

1. Open Chrome DevTools (`F12`)
2. Go to the **Lighthouse** tab
3. Run a **Best Practices** audit
4. Check for the "Links to cross-origin destinations are unsafe" warning
5. After the fix, this warning should no longer appear

---

## Common Mistakes to Avoid

### 1. Only Adding `noopener` Without `noreferrer`

```html
<!-- Incomplete fix -->
<a href="https://example.com" target="_blank" rel="noopener">Example</a>

<!-- Correct fix -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Example</a>
```

While `noopener` addresses the security vulnerability, `noreferrer` adds the privacy layer. Always include both.

### 2. Forgetting CMS-Generated Content

Blog posts and other CMS collection items often contain external links added through Rich Text fields. These links are not visible in the Webflow Designer's page structure. The script approach (Approach A) handles these automatically. The manual approach requires editing each CMS item individually.

### 3. Overlooking Footer Social Links

The footer appears on every page and typically contains 3-5 social media links. Because the footer is a Webflow Symbol, it counts as external links on every page. This is why 59 pages are affected — the same footer links are flagged on each page.

### 4. Removing the Fix During Site Updates

If you reorganize the Project Settings > Custom Code section, make sure the cross-origin fix script is not accidentally deleted. Consider adding a comment:

```html
<!-- SEO Fix: Cross-origin link security (noopener noreferrer) -->
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

### 5. Assuming Webflow Handles It Automatically

Webflow's newer versions add `rel="noopener noreferrer"` when you create a new link with "Open in new tab" enabled. However:

- **Older links** created before this behavior was added are NOT retroactively updated
- **CMS links** added through Rich Text editors may not include it
- **Custom embed code** links are not managed by Webflow

Do not assume all links are covered — always verify.

---

## Technical Background

### What Is `window.opener`?

When Page A opens Page B in a new tab using `target="_blank"`, Page B receives a reference to Page A through `window.opener`. This means Page B can:

```javascript
// Page B (external site) can do this:
window.opener.location = 'https://malicious-site.com';
```

This silently redirects the original anobel.com tab to a different URL. The user, trusting the original tab, might enter credentials on the phishing page.

### What `noopener` Does

Adding `rel="noopener"` sets `window.opener` to `null` in the new tab. The external page has no reference to anobel.com.

### What `noreferrer` Does

Adding `rel="noreferrer"` prevents the browser from sending the `Referer` HTTP header to the external site. Without it, the external site knows the exact URL the visitor came from (e.g., `https://anobel.com/filtratie`).

### Browser Support

`rel="noopener"` is supported by all modern browsers. As of 2024, most browsers also treat `target="_blank"` as implying `noopener` by default. However, explicitly adding the attribute ensures compatibility with older browsers and satisfies audit tools.

---

## Summary

| Aspect | Detail |
|--------|--------|
| **Issue** | 59 pages (94%) have external links without `rel="noopener noreferrer"` |
| **Severity** | Medium (P3) |
| **Root Cause** | External links with `target="_blank"` missing security attributes |
| **Recommended Fix** | Approach A: Add JavaScript snippet to Project Settings > Footer Code |
| **Time to Fix** | ~30 minutes (script) or 2-3 hours (manual) |
| **Verification** | DevTools console check or Lighthouse Best Practices audit |
| **Republish Required** | Yes, after adding the script or editing links |
