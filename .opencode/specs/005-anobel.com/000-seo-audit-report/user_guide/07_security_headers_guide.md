# Security Headers SEO Guide for anobel.com

> Guide for adding missing security headers (X-Content-Type-Options, Referrer-Policy) identified in the SEO audit. Covers Webflow implementation options, limitations, and verification steps.

---

## Executive Summary

### Issues Identified

| Issue | Severity | Pages Affected | Impact |
|-------|----------|----------------|--------|
| **Missing X-Content-Type-Options** | Medium | 59 pages (94%) | No MIME-sniffing protection |
| **Missing Referrer-Policy** | Medium | 59 pages (94%) | No control over referrer data sent to third parties |

### Priority: P3 MEDIUM

Security headers are **not a direct Google ranking factor**, but they contribute to overall site trustworthiness and security posture. Search engines increasingly consider site security as part of quality assessment. More importantly, these headers protect your visitors from certain types of attacks and privacy leaks.

### Scope

This is a **site-wide, one-time fix**. Adding these headers in Webflow's Project Settings applies them to all pages automatically.

**Estimated time:** 30 minutes

---

## Why Security Headers Matter

When someone visits anobel.com, their browser and your server exchange information through HTTP headers. Security headers are instructions you send to the browser that say: "Here are the security rules for this page."

Without these headers, browsers fall back to default behavior that may be less secure:

- Files could be interpreted as a different type than intended (security risk)
- Full page URLs could be leaked to third-party sites when visitors click links (privacy risk)

**Think of it like this:** Security headers are like locking the doors of your office. Not having them doesn't mean you'll be robbed, but having them signals that you take security seriously — to both visitors and search engines.

---

## Headers to Add

### 1. X-Content-Type-Options: nosniff

**What it does:** Tells the browser to strictly follow the file type (MIME type) declared by the server. Without it, browsers may "guess" what a file is and execute it differently than intended.

**Why it matters:** Prevents a class of attacks called "MIME-type confusion" where a malicious file disguised as an image could be executed as a script. The `nosniff` value blocks this behavior entirely.

**Example scenario without this header:**
```
1. Your site serves a file declared as "text/plain"
2. Browser inspects the content and decides it looks like JavaScript
3. Browser executes it as JavaScript — potential security risk
```

**With the header:** The browser respects the declared type and does not execute it as something else.

---

### 2. Referrer-Policy: strict-origin-when-cross-origin

**What it does:** Controls how much information about the current page URL is shared when a visitor clicks a link to another website.

**Why it matters:** Protects visitor privacy and prevents internal URL structures from leaking to third parties.

**How it works with `strict-origin-when-cross-origin`:**

| Navigation Type | What Gets Sent | Example |
|-----------------|----------------|---------|
| Same site (anobel.com → anobel.com) | Full URL | `https://anobel.com/scheepsbunkering` |
| Cross-site, HTTPS → HTTPS | Origin only | `https://anobel.com` (no path) |
| HTTPS → HTTP (downgrade) | Nothing | *(empty — protects against insecure targets)* |

**Without this header:** The full URL (including page path, query parameters, etc.) may be sent to any external site your visitors navigate to. This could expose internal page structures or tracking parameters.

---

## Implementation in Webflow

### Option A: Meta Tags in Project Settings (Recommended for Webflow)

This is the simplest approach and works without any external services.

**Steps:**

1. Log in to your **Webflow Dashboard**
2. Open the **anobel.com** project
3. Go to **Project Settings** (gear icon in the left sidebar)
4. Click the **Custom Code** tab
5. In the **Head Code** section, add the following code:

```html
<!-- Security Headers (SEO Audit Fix - P3 Medium) -->
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta name="referrer" content="strict-origin-when-cross-origin">
```

6. Click **Save Changes**
7. Go back to the Designer and **Publish** the site

**Where to paste it:**

```
Project Settings > Custom Code > Head Code
┌─────────────────────────────────────────────────┐
│  Head Code                                      │
│  ┌───────────────────────────────────────────┐  │
│  │ <!-- existing code... -->                 │  │
│  │                                           │  │
│  │ <!-- Security Headers (SEO Audit Fix) --> │  │
│  │ <meta http-equiv="X-Content-Type-Options" │  │
│  │       content="nosniff">                  │  │
│  │ <meta name="referrer"                     │  │
│  │       content="strict-origin-when-cross-  │  │
│  │       origin">                            │  │
│  │                                           │  │
│  └───────────────────────────────────────────┘  │
│                                  [Save Changes] │
└─────────────────────────────────────────────────┘
```

> **Important limitation:** Meta tag implementation has limited effectiveness compared to actual HTTP response headers. Specifically, `X-Content-Type-Options` as a meta tag is **not fully honored by all browsers** — it is designed to be an HTTP response header. However, this is the best option available in Webflow without server-level access. The `Referrer-Policy` via `<meta name="referrer">` is well-supported across all modern browsers.

---

### Option B: Cloudflare HTTP Headers (If Using Cloudflare)

If anobel.com uses Cloudflare (or another CDN/reverse proxy), you can set **real HTTP response headers**, which is more effective than meta tags.

**Steps in Cloudflare:**

1. Log in to **Cloudflare Dashboard**
2. Select the **anobel.com** domain
3. Go to **Rules** > **Transform Rules** > **Modify Response Header**
4. Click **Create Rule**
5. Configure the rule:

| Setting | Value |
|---------|-------|
| **Rule name** | Security Headers |
| **When** | All incoming requests (or URI Path contains `/`) |
| **Then** | Set static response headers |

6. Add two headers:

| Header Name | Operation | Value |
|-------------|-----------|-------|
| `X-Content-Type-Options` | Set | `nosniff` |
| `Referrer-Policy` | Set | `strict-origin-when-cross-origin` |

7. Click **Deploy**

**Cloudflare advantage:** These are proper HTTP response headers sent by the server, which browsers fully respect. No meta tag workarounds needed.

**Alternative — Cloudflare Workers (advanced):**

```javascript
// Cloudflare Worker to add security headers
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const response = await fetch(request);
  const newResponse = new Response(response.body, response);

  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return newResponse;
}
```

---

## Limitations in Webflow

Webflow is a hosted platform and **does not provide direct access to server configuration or HTTP response headers**. This means:

| What You Can Do | What You Cannot Do |
|-----------------|--------------------|
| Add `<meta>` tags in Head Code | Set HTTP response headers directly |
| Use inline security attributes | Configure server-level security policies |
| Add Cloudflare/CDN headers (if applicable) | Modify Webflow's default server headers |

**Practical impact:**

- **`Referrer-Policy`** via `<meta name="referrer">` works well — browsers fully support this meta tag approach. This is effectively equivalent to the HTTP header.
- **`X-Content-Type-Options`** via `<meta http-equiv>` has limited browser support as a meta tag. For full protection, a CDN-level solution (Cloudflare) is needed.

**Recommendation:** If you have Cloudflare or another proxy in front of anobel.com, use Option B for `X-Content-Type-Options` and Option A for `Referrer-Policy` (or both via Cloudflare). If you only have Webflow, use Option A for both — it still signals intent and partially mitigates the issues.

---

## Verification Steps

After implementing the headers, verify they are working correctly.

### Method 1: Browser DevTools (Response Headers)

This method works for **Option B (Cloudflare)** where actual HTTP headers are set:

1. Open anobel.com in Chrome or Firefox
2. Press **F12** to open DevTools
3. Click the **Network** tab
4. Press **Ctrl+Shift+R** (hard reload) to refresh the page
5. Click the **first request** in the list (the document request, usually the page URL)
6. Click the **Headers** tab in the right panel
7. Scroll down to **Response Headers**
8. Look for:

```
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
```

If these appear in the response headers, the Cloudflare implementation is working.

---

### Method 2: View Page Source (Meta Tags)

This method works for **Option A (Webflow meta tags)**:

1. Open anobel.com in your browser
2. Right-click anywhere on the page
3. Select **View Page Source** (or press **Ctrl+U**)
4. Press **Ctrl+F** to open the search bar
5. Search for `X-Content-Type-Options`
6. Verify you see:

```html
<meta http-equiv="X-Content-Type-Options" content="nosniff">
```

7. Search for `referrer`
8. Verify you see:

```html
<meta name="referrer" content="strict-origin-when-cross-origin">
```

Both tags should appear inside the `<head>` section of the page.

---

### Method 3: Online Security Scanner

1. Go to **[securityheaders.com](https://securityheaders.com)**
2. Enter `https://anobel.com`
3. Click **Scan**
4. Check the results for:
   - **X-Content-Type-Options** — should show as present (green) if using Cloudflare headers
   - **Referrer-Policy** — should show as present (green) if using Cloudflare headers

> **Note:** securityheaders.com only detects **HTTP response headers**, not meta tags. If you used Option A (meta tags only), this scanner will still show these headers as missing. That is expected — the meta tags work at the browser level but are not visible as HTTP headers.

---

## Additional Recommended Headers (Nice-to-Have)

These headers were **not flagged in the SEO audit** but are considered security best practices. They can be added alongside the required headers if desired.

### Content-Security-Policy (CSP)

Controls which resources (scripts, styles, images) the browser is allowed to load. Prevents cross-site scripting (XSS) attacks.

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline';
```

> **Caution:** CSP requires careful configuration. A misconfigured policy can break site functionality (e.g., blocking Webflow's own scripts). Only implement after thorough testing.

### X-Frame-Options

Prevents your site from being loaded inside an iframe on another website. Protects against clickjacking attacks.

```
X-Frame-Options: SAMEORIGIN
```

### Permissions-Policy

Controls which browser features (camera, microphone, geolocation) the page can access. Limits what third-party scripts can do.

```
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

> **Implementation:** All three of these additional headers require Cloudflare or CDN-level configuration — they cannot be effectively set via meta tags in Webflow.

---

## Summary

| Item | Details |
|------|---------|
| **Issues** | X-Content-Type-Options and Referrer-Policy missing on 59 pages |
| **Priority** | P3 Medium — not a ranking factor but improves site trust |
| **Best Fix** | Cloudflare Transform Rules (proper HTTP headers) |
| **Webflow-Only Fix** | Meta tags in Project Settings > Custom Code > Head Code |
| **Scope** | Site-wide, one-time implementation |
| **Estimated Time** | 30 minutes |
| **Republish Required** | Yes (if using Option A) |
| **Verification** | DevTools Network tab, View Source, or securityheaders.com |
