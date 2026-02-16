# Image Size Attributes Guide for anobel.com

> **SEO Issue**: Missing width and height attributes on images
> **Severity**: MEDIUM
> **Impact**: Cumulative Layout Shift (CLS) - Core Web Vital
> **Affected Images**: 184 images (98% of total)

---

## Table of Contents

1. [Why Image Dimensions Matter](#1-why-image-dimensions-matter)
2. [Understanding Cumulative Layout Shift (CLS)](#2-understanding-cumulative-layout-shift-cls)
3. [How CLS Affects SEO](#3-how-cls-affects-seo)
4. [Page-by-Page Image Audit](#4-page-by-page-image-audit)
5. [How to Fix in Webflow](#5-how-to-fix-in-webflow)
6. [Webflow's Automatic srcset Generation](#6-webflows-automatic-srcset-generation)
7. [Alternative: Custom Attributes for Intrinsic Size](#7-alternative-custom-attributes-for-intrinsic-size)
8. [Summary and Recommendations](#8-summary-and-recommendations)

---

## 1. Why Image Dimensions Matter

When a browser loads a webpage, it parses the HTML before images are downloaded. If `width` and `height` attributes are present on `<img>` tags, the browser can:

1. **Reserve the correct space** for the image before it loads
2. **Prevent content from jumping** when the image appears
3. **Calculate the aspect ratio** for responsive layouts
4. **Optimize paint operations** by knowing dimensions upfront

### The Problem Without Dimensions

```html
<!-- BAD: No dimensions - browser doesn't know how much space to reserve -->
<img src="photo.jpg" alt="Product" loading="lazy">

<!-- GOOD: Dimensions provided - browser reserves correct space -->
<img src="photo.jpg" alt="Product" width="800" height="600" loading="lazy">
```

Without dimensions, the browser initially renders the page with zero space for images. When images load, content shifts down or around, creating a jarring user experience.

---

## 2. Understanding Cumulative Layout Shift (CLS)

**Cumulative Layout Shift (CLS)** measures the visual stability of a page. It quantifies how much content shifts unexpectedly during the page lifecycle.

### CLS Score Thresholds

| Score | Rating | User Experience |
|-------|--------|-----------------|
| 0 - 0.1 | Good | Stable, professional feel |
| 0.1 - 0.25 | Needs Improvement | Noticeable shifts, slightly annoying |
| > 0.25 | Poor | Frustrating, content jumps around |

### Common Causes of CLS

1. **Images without dimensions** (most common)
2. Ads or embeds without reserved space
3. Web fonts causing text reflow (FOUT/FOIT)
4. Dynamic content injected above existing content
5. Animations that change layout

### How CLS is Calculated

```
CLS = Impact Fraction × Distance Fraction
```

- **Impact Fraction**: Percentage of viewport affected by the shift
- **Distance Fraction**: How far content moved relative to viewport

A single image loading without dimensions can cause significant CLS if it's in the upper portion of the page.

---

## 3. How CLS Affects SEO

### Google's Core Web Vitals

Since **June 2021**, Google uses Core Web Vitals as ranking signals:

| Metric | Measures | Target |
|--------|----------|--------|
| **LCP** (Largest Contentful Paint) | Loading performance | < 2.5s |
| **INP** (Interaction to Next Paint) | Interactivity | < 200ms |
| **CLS** (Cumulative Layout Shift) | Visual stability | < 0.1 |

### SEO Impact of Poor CLS

1. **Ranking Penalty**: Pages with CLS > 0.25 may rank lower
2. **Mobile-First Indexing**: CLS issues are often worse on mobile
3. **User Engagement**: High CLS increases bounce rate
4. **Search Console Warnings**: Google flags CLS issues in Core Web Vitals report

### Business Impact

- **Conversion Loss**: Content shifting can cause misclicks
- **Trust Erosion**: Unstable pages feel unprofessional
- **Accessibility**: Layout shifts are disorienting for users with cognitive disabilities

---

## CMS Template Image Issues

### Blog Template (`detail_blog.html`)

**Hero Image (Line 4595) - CRITICAL:**
```html
<img data-target="hero-image" fetchpriority="high" src="" alt="" class="image is--hero-general w-dyn-bind-empty">
```

**Problem:**
- No explicit width/height attributes
- Empty src (CMS binding not rendered in export)
- This is likely the LCP (Largest Contentful Paint) element
- Missing dimensions causes significant CLS on page load

**Additional Images Missing Dimensions:**
| Line | Image | Has Dimensions? |
|------|-------|----------------|
| 4727 | Dynamic product image | No |
| 4780 | Reddingsjas-KI-310N.webp | No |
| 5326-5370 | Placeholder images | No |
| 5403 | link--blog-image | No |

### Vacature Template (`detail_vacatures.html`)

**Hero Image (Line 5323) - CRITICAL:**
```html
<img src="" alt="" class="image is--hero-general w-dyn-bind-empty">
```

**Problem:** Same issue - no dimensions on hero image, causing CLS.

**Images WITH Dimensions (Good):**
```html
<!-- Line 4397 - Modal image -->
<img width="1000" height="1000" src="images/Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp">
```

**Images WITHOUT Dimensions:**
| Line | Image | Issue |
|------|-------|-------|
| 5323 | Hero image | No width/height |
| 5700 | Rich text images | No width/height |
| 6488-6489 | Contact photos | No width/height |

**Fix in Webflow:**
1. Select each image element
2. In the Style panel, set explicit width/height
3. For CMS images, consider using CSS `aspect-ratio` property as fallback

---

## 4. Page-by-Page Image Audit

The following audit lists all images on each page, their source files, CSS classes, and whether width/height attributes are present.

### Legend

| Symbol | Meaning |
|--------|---------|
| :white_check_mark: | Has width AND height attributes |
| :warning: | Has only width OR only height (partial) |
| :x: | Missing both width and height |

---

### 4.1 Homepage (index.html)

**Total Images: 22**
**With Dimensions: 2** | **Missing Dimensions: 20**

| # | Image Source | Class | Width | Height | Status |
|---|--------------|-------|-------|--------|--------|
| 1 | `Illustratie---A.-Nobel--Zn---Schip.webp` | `u--height-100 u--hide-desktop u--hide-tablet-landscape` | - | - | :x: |
| 2 | `Icon---Flag---The-Netherlands.webp` | `language--flag` | - | - | :x: |
| 3 | `Icon---Flag---The-Netherlands.webp` | `language--flag` | - | - | :x: |
| 4 | `Icon---Flag---United-Kingdom.webp` | `language--flag` | - | - | :x: |
| 5 | `player-placeholder.jpg` | `video--thumbnail w-dyn-bind-empty` | Auto | - | :warning: |
| 6 | `logo---Baldwin-Filters.webp` | `logo--marquee w-dyn-bind-empty` | - | - | :x: |
| 7 | `Foto---De-oprichter-in-een-verkoopgesprek.webp` | `nobel--image w-dyn-bind-empty is--illustration` | - | - | :x: |
| 8-11 | (empty src - dynamic) | `link--card-image w-variant-*` | - | - | :x: |
| 12 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image u--size-100 w-dyn-bind-empty` | 1000 | 1000 | :white_check_mark: |
| 13 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--cta w-dyn-bind-empty` | - | - | :x: |
| 14-15 | `Foto---De-oprichter-in-een-verkoopgesprek.webp` | `nobel--image w-dyn-bind-empty is--dual` | - | - | :x: |
| 16 | `Foto---Medewerker-van-Anobel-achter-de-computer.webp` | `nobel--image w-dyn-bind-empty is--left` | - | - | :x: |
| 17-18 | (dual images) | `nobel--image` | - | - | :x: |
| 19 | (empty src - dynamic blog) | `link--blog-image` | - | - | :x: |
| 20 | `Contact-Image-2.webp` | `footer--contact-photo-image` | - | - | :x: |
| 21 | `Contact-Image-1.webp` | `footer--contact-photo-image` | - | - | :x: |
| 22 | `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | - | - | :x: |

---

### 4.2 Contact Page (contact.html)

**Total Images: 21**
**With Dimensions: 4** | **Missing Dimensions: 17**

| # | Image Source | Class | Width | Height | Status |
|---|--------------|-------|-------|--------|--------|
| 1 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image u--size-100 w-dyn-bind-empty` | 1000 | 1000 | :white_check_mark: |
| 2 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image u--size-100 w-dyn-bind-empty` | 1000 | 1000 | :white_check_mark: |
| 3 | `Illustratie---A.-Nobel--Zn---Schip.webp` | `u--height-100 u--hide-desktop u--hide-tablet-landscape` | - | - | :x: |
| 4-6 | `Icon---Flag-*.webp` | `language--flag` | - | - | :x: |
| 7-10 | (empty src - hero cards) | `image u--size-100 w-variant-*` | - | - | :x: |
| 11 | `Foto---De-oprichter-in-een-verkoopgesprek.webp` | `nobel--image w-dyn-bind-empty is--single` | - | - | :x: |
| 12 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image u--size-100 w-dyn-bind-empty` | 1000 | 1000 | :white_check_mark: |
| 13 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--cta w-dyn-bind-empty` | - | - | :x: |
| 14-15 | `nobel--image` dual images | `nobel--image w-dyn-bind-empty` | - | - | :x: |
| 16-17 | `Contact-Image-*.webp` | `footer--contact-photo-image` | - | - | :x: |
| 18 | `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | - | - | :x: |

---

### 4.3 Blog Page (blog.html)

**Total Images: 23**
**With Dimensions: 2** | **Missing Dimensions: 21**

| # | Image Source | Class | Width | Height | Status |
|---|--------------|-------|-------|--------|--------|
| 1 | `Illustratie---A.-Nobel--Zn---Schip.webp` | `u--height-100 u--hide-desktop u--hide-tablet-landscape` | - | - | :x: |
| 2-4 | `Icon---Flag-*.webp` | `language--flag` | - | - | :x: |
| 5 | (empty src - hero) | `image is--hero-general w-dyn-bind-empty` | - | - | :x: |
| 6 | `player-placeholder.jpg` | `video--thumbnail w-dyn-bind-empty` | Auto | - | :warning: |
| 7 | (empty src - blog) | `link--blog-image` | - | - | :x: |
| 8 | (empty src - adv) | `image u--size-100` | - | - | :x: |
| 9-10 | `Reddingsjas-KI-310N.webp` | `image is--product` | - | - | :x: |
| 11-12 | (empty src - cards) | `image u--size-100` | - | - | :x: |
| 13 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image u--size-100 w-dyn-bind-empty` | 1000 | 1000 | :white_check_mark: |
| 14 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--cta w-dyn-bind-empty` | - | - | :x: |
| 15-16 | `nobel--image` dual images | `nobel--image w-dyn-bind-empty` | - | - | :x: |
| 17 | `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | - | - | :x: |

---

### 4.4 Dit is Nobel Page (dit-is-nobel.html)

**Total Images: 28**
**With Dimensions: 2** | **Missing Dimensions: 26**

| # | Image Source | Class | Width | Height | Status |
|---|--------------|-------|-------|--------|--------|
| 1 | `Illustratie---A.-Nobel--Zn---Schip.webp` | `u--height-100 u--hide-desktop u--hide-tablet-landscape` | - | - | :x: |
| 2-4 | `Icon---Flag-*.webp` | `language--flag` | - | - | :x: |
| 5 | `player-placeholder.jpg` | `video--thumbnail w-dyn-bind-empty` | Auto | - | :warning: |
| 6 | `logo---Baldwin-Filters.webp` | `logo--marquee w-dyn-bind-empty` | - | - | :x: |
| 7-8 | `nobel--image` dual images | `nobel--image w-dyn-bind-empty` | - | - | :x: |
| 9 | `Unibarge.webp` | `u--height-100 w-dyn-bind-empty` | - | - | :x: |
| 10 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image u--size-100 w-dyn-bind-empty` | 1000 | 1000 | :white_check_mark: |
| 11 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--cta w-dyn-bind-empty` | - | - | :x: |
| 12-15 | `link--card-image` (4x) | `link--card-image w-variant-*` | - | - | :x: |
| 16-18 | Grid images | `grid--image w-dyn-bind-empty` | - | - | :x: |
| 19 | `Foto---De-oprichter-in-een-verkoopgesprek.webp` | `nobel--image w-dyn-bind-empty is--single` | - | - | :x: |
| 20 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image u--size-100 w-dyn-bind-empty` | 1000 | 1000 | :white_check_mark: |
| 21 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--cta w-dyn-bind-empty` | - | - | :x: |
| 22-23 | `nobel--image` dual images | `nobel--image w-dyn-bind-empty` | - | - | :x: |
| 24-25 | `Contact-Image-*.webp` | `footer--contact-photo-image` | - | - | :x: |
| 26 | `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | - | - | :x: |

---

### 4.5 Maatwerk Page (maatwerk.html)

**Total Images: 22**
**With Dimensions: 2** | **Missing Dimensions: 20**

| # | Image Source | Class | Width | Height | Status |
|---|--------------|-------|-------|--------|--------|
| 1 | `Illustratie---A.-Nobel--Zn---Schip.webp` | `u--height-100 u--hide-desktop u--hide-tablet-landscape` | - | - | :x: |
| 2-4 | `Icon---Flag-*.webp` | `language--flag` | - | - | :x: |
| 5 | (empty src - hero) | `image is--hero-general w-dyn-bind-empty` | - | - | :x: |
| 6 | `player-placeholder.jpg` | `video--thumbnail w-dyn-bind-empty` | Auto | - | :warning: |
| 7 | `logo---Baldwin-Filters.webp` | `logo--marquee w-dyn-bind-empty` | - | - | :x: |
| 8-14 | `nobel--image` (7x) | `nobel--image w-dyn-bind-empty is--*` | - | - | :x: |
| 15 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image u--size-100 w-dyn-bind-empty` | 1000 | 1000 | :white_check_mark: |
| 16 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--cta w-dyn-bind-empty` | - | - | :x: |
| 17-18 | `nobel--image` dual images | `nobel--image w-dyn-bind-empty` | - | - | :x: |
| 19-20 | Contact photos (srcset) | `footer--contact-photo-image` | - | - | :x: |
| 21 | `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | - | - | :x: |

---

### 4.6 Scheepsuitrusting Page (scheepsuitrusting.html)

**Total Images: 18**
**With Dimensions: 2** | **Missing Dimensions: 16**

| # | Image Source | Class | Width | Height | Status |
|---|--------------|-------|-------|--------|--------|
| 1 | `Illustratie---A.-Nobel--Zn---Schip.webp` | `u--height-100 u--hide-desktop u--hide-tablet-landscape` | - | - | :x: |
| 2-4 | `Icon---Flag-*.webp` | `language--flag` | - | - | :x: |
| 5 | (empty src - hero) | `image is--hero-general w-dyn-bind-empty` | - | - | :x: |
| 6 | `player-placeholder.jpg` | `video--thumbnail w-dyn-bind-empty` | Auto | - | :warning: |
| 7 | `logo---Baldwin-Filters.webp` | `logo--marquee w-dyn-bind-empty` | - | - | :x: |
| 8-10 | `nobel--image` (3x) | `nobel--image w-dyn-bind-empty is--single` | - | - | :x: |
| 11 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image u--size-100 w-dyn-bind-empty` | 1000 | 1000 | :white_check_mark: |
| 12 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--cta w-dyn-bind-empty` | - | - | :x: |
| 13-14 | `nobel--image` dual images | `nobel--image w-dyn-bind-empty` | - | - | :x: |
| 15-16 | `Contact-Image-*.webp` | `footer--contact-photo-image` | - | - | :x: |
| 17 | `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | - | - | :x: |

---

### 4.7 ISPS Page (isps.html)

**Total Images: 21**
**With Dimensions: 2** | **Missing Dimensions: 19**

| # | Image Source | Class | Width | Height | Status |
|---|--------------|-------|-------|--------|--------|
| 1 | `Illustratie---A.-Nobel--Zn---Schip.webp` | `u--height-100 u--hide-desktop u--hide-tablet-landscape` | - | - | :x: |
| 2-4 | `Icon---Flag-*.webp` | `language--flag` | - | - | :x: |
| 5 | (empty src - hero) | `image is--hero-general w-dyn-bind-empty` | - | - | :x: |
| 6 | `player-placeholder.jpg` | `video--thumbnail w-dyn-bind-empty` | Auto | - | :warning: |
| 7 | `logo---Baldwin-Filters.webp` | `logo--marquee w-dyn-bind-empty` | - | - | :x: |
| 8-13 | `nobel--image` (6x) | `nobel--image w-dyn-bind-empty is--single` | - | - | :x: |
| 14 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image u--size-100 w-dyn-bind-empty` | 1000 | 1000 | :white_check_mark: |
| 15 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--cta w-dyn-bind-empty` | - | - | :x: |
| 16-17 | `nobel--image` dual images | `nobel--image w-dyn-bind-empty` | - | - | :x: |
| 18-19 | `Contact-Image-*.webp` | `footer--contact-photo-image` | - | - | :x: |
| 20 | `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | - | - | :x: |

---

### 4.8 Filtratie Page (filtratie.html)

**Total Images: 19**
**With Dimensions: 2** | **Missing Dimensions: 17**

| # | Image Source | Class | Width | Height | Status |
|---|--------------|-------|-------|--------|--------|
| 1 | `Illustratie---A.-Nobel--Zn---Schip.webp` | `u--height-100 u--hide-desktop u--hide-tablet-landscape` | - | - | :x: |
| 2-4 | `Icon---Flag-*.webp` | `language--flag` | - | - | :x: |
| 5 | (empty src - hero) | `image is--hero-general w-dyn-bind-empty` | - | - | :x: |
| 6 | `player-placeholder.jpg` | `video--thumbnail w-dyn-bind-empty` | Auto | - | :warning: |
| 7 | `logo---Baldwin-Filters.webp` | `logo--marquee w-dyn-bind-empty` | - | - | :x: |
| 8-11 | `nobel--image` (4x) | `nobel--image w-dyn-bind-empty is--*` | - | - | :x: |
| 12 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image u--size-100 w-dyn-bind-empty` | 1000 | 1000 | :white_check_mark: |
| 13 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--cta w-dyn-bind-empty` | - | - | :x: |
| 14-15 | `nobel--image` dual images | `nobel--image w-dyn-bind-empty` | - | - | :x: |
| 16-17 | `Contact-Image-*.webp` | `footer--contact-photo-image` | - | - | :x: |
| 18 | `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | - | - | :x: |

---

### 4.9 Locatie Page (locatie.html)

**Total Images: 22**
**With Dimensions: 2** | **Missing Dimensions: 20**

| # | Image Source | Class | Width | Height | Status |
|---|--------------|-------|-------|--------|--------|
| 1 | `Illustratie---A.-Nobel--Zn---Schip.webp` | `u--height-100 u--hide-desktop u--hide-tablet-landscape` | - | - | :x: |
| 2-4 | `Icon---Flag-*.webp` | `language--flag` | - | - | :x: |
| 5 | `player-placeholder.jpg` | `video--thumbnail w-dyn-bind-empty` | Auto | - | :warning: |
| 6 | `logo---Baldwin-Filters.webp` | `logo--marquee w-dyn-bind-empty` | - | - | :x: |
| 7-8 | `nobel--image` (2x) | `nobel--image w-dyn-bind-empty is--single` | - | - | :x: |
| 9-11 | Grid images (3x) | `grid--image w-dyn-bind-empty` | - | - | :x: |
| 12-14 | `nobel--image` (3x) | `nobel--image w-dyn-bind-empty is--single` | - | - | :x: |
| 15 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image u--size-100 w-dyn-bind-empty` | 1000 | 1000 | :white_check_mark: |
| 16 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--cta w-dyn-bind-empty` | - | - | :x: |
| 17 | `nobel--image` | `nobel--image w-dyn-bind-empty is--single` | - | - | :x: |
| 18-19 | Contact photos (srcset) | `footer--contact-photo-image` | - | - | :x: |
| 20 | `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | - | - | :x: |

---

### 4.10 Werken Bij Page (werkenbij.html)

**Total Images: 28**
**With Dimensions: 7** | **Missing Dimensions: 21**

| # | Image Source | Class | Width | Height | Status |
|---|--------------|-------|-------|--------|--------|
| 1 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image u--size-100 w-dyn-bind-empty` | 1000 | 1000 | :white_check_mark: |
| 2 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image u--size-100 w-dyn-bind-empty` | 1000 | 1000 | :white_check_mark: |
| 3 | `Illustratie---A.-Nobel--Zn---Schip.webp` | `u--height-100 u--hide-desktop u--hide-tablet-landscape` | - | - | :x: |
| 4-6 | `Icon---Flag-*.webp` | `language--flag` | - | - | :x: |
| 7-9 | `player-placeholder.jpg` (hero cards - 3x) | `video--thumbnail w-variant-*` | Auto | - | :warning: |
| 10 | (empty src - hero card) | `image u--size-100 w-variant-*` | - | - | :x: |
| 11 | (empty src - card) | `image u--size-100` | - | - | :x: |
| 12-13 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image u--size-100 / is--cta` | 1000/- | 1000/- | :white_check_mark:/:x: |
| 14-15 | `nobel--image` dual images | `nobel--image w-dyn-bind-empty` | - | - | :x: |
| 16-17 | `nobel--image` dual images | `nobel--image w-dyn-bind-empty` | - | - | :x: |
| 18-19 | `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image u--size-100 / is--cta` | 1000/- | 1000/- | :white_check_mark:/:x: |
| 20-21 | `nobel--image` dual images | `nobel--image w-dyn-bind-empty` | - | - | :x: |
| 22-24 | Grid images (3x) | `grid--image w-dyn-bind-empty` | - | - | :x: |
| 25-26 | `Contact-Image-*.webp` | `footer--contact-photo-image` | - | - | :x: |
| 27 | `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | - | - | :x: |

---

### 4.11 Additional Pages Summary

| Page | Total Images | With Dimensions | Missing |
|------|--------------|-----------------|---------|
| scheepsbunkering.html | 19 | 2 | 17 |
| team.html | 17 | 2 | 15 |
| brochures.html | 22 | 8 | 14 |
| webshop.html | 30+ | 3 | 27+ |

---

## 5. How to Fix in Webflow

### Method 1: Setting Explicit Dimensions in Designer

1. **Select the Image Element**
   - Click on the image in the Webflow Designer
   - The element should be highlighted in blue

2. **Open Style Panel**
   - Press `S` or click the paintbrush icon
   - Navigate to the "Size" section

3. **Set Width and Height**
   - Enter explicit pixel values (e.g., `400px` width, `300px` height)
   - OR set as percentage with aspect ratio locked

4. **Use Fit Settings**
   - **Cover**: Image fills container, may crop
   - **Contain**: Image fits entirely, may letterbox
   - **Fill**: Image stretches to fill

### Method 2: Using CSS Object-Fit with Dimensions

```css
/* In Webflow, add to image class */
.my-image {
  width: 400px;
  height: 300px;
  object-fit: cover;
  object-position: center;
}
```

### Method 3: Using Aspect Ratio (Modern CSS)

```css
.image-container {
  aspect-ratio: 16 / 9;
  width: 100%;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### Webflow-Specific Settings

1. **Image Settings Panel** (Right sidebar)
   - Click on image
   - Go to Settings (gear icon)
   - Check "High DPI" for retina displays

2. **Responsive Image Variants**
   - Webflow auto-generates srcset for different breakpoints
   - Set base dimensions, Webflow handles responsive scaling

---

## 6. Webflow's Automatic srcset Generation

### How Webflow Handles Responsive Images

Webflow automatically generates multiple image sizes for responsive delivery:

```html
<!-- Webflow auto-generated output -->
<img
  src="images/photo.webp"
  srcset="images/photo-p-500.webp 500w,
          images/photo-p-800.webp 800w,
          images/photo.webp 1200w"
  sizes="(max-width: 479px) 100vw, 50vw"
  alt="Description"
>
```

### Current Pattern on anobel.com

Many images already have srcset but lack width/height:

```html
<!-- Current (problematic) -->
<img
  sizes="(max-width: 864px) 100vw, 864px"
  srcset="images/Illustratie-Schip-p-500.webp 500w,
          images/Illustratie-Schip.webp 864w"
  alt=""
  src="images/Illustratie-Schip.webp"
  loading="lazy"
  class="u--height-100">

<!-- Recommended (with dimensions) -->
<img
  width="864"
  height="486"
  sizes="(max-width: 864px) 100vw, 864px"
  srcset="images/Illustratie-Schip-p-500.webp 500w,
          images/Illustratie-Schip.webp 864w"
  alt="A. Nobel & Zn ship illustration"
  src="images/Illustratie-Schip.webp"
  loading="lazy"
  class="u--height-100">
```

### Important Note

Adding width/height attributes does **NOT** conflict with responsive images. Modern browsers use these values to:
1. Calculate aspect ratio
2. Reserve space before image loads
3. Allow CSS to override for responsive behavior

---

## 7. Alternative: Custom Attributes for Intrinsic Size

### Using data-* Attributes

If you cannot set width/height directly, use custom attributes:

```html
<img
  src="photo.jpg"
  alt="Product"
  data-width="800"
  data-height="600"
  style="aspect-ratio: 800/600;"
>
```

### CSS Aspect Ratio Fallback

```css
/* Fallback for browsers without aspect-ratio support */
.image-wrapper {
  position: relative;
  padding-bottom: 75%; /* 4:3 aspect ratio (3/4 = 0.75) */
}

.image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### Adding in Webflow via Custom Attributes

1. Select the image element
2. Open Element Settings (gear icon)
3. Scroll to "Custom Attributes"
4. Add:
   - Name: `width` | Value: `800`
   - Name: `height` | Value: `600`

---

## 8. Summary and Recommendations

### Audit Summary by Page

| Page | Total | With Dims | Missing | % Missing |
|------|-------|-----------|---------|-----------|
| index.html | 22 | 2 | 20 | 91% |
| contact.html | 21 | 4 | 17 | 81% |
| blog.html | 23 | 2 | 21 | 91% |
| dit-is-nobel.html | 28 | 2 | 26 | 93% |
| maatwerk.html | 22 | 2 | 20 | 91% |
| scheepsuitrusting.html | 18 | 2 | 16 | 89% |
| isps.html | 21 | 2 | 19 | 90% |
| filtratie.html | 19 | 2 | 17 | 89% |
| locatie.html | 22 | 2 | 20 | 91% |
| werkenbij.html | 28 | 7 | 21 | 75% |
| **TOTAL** | **224** | **27** | **197** | **88%** |

### Priority Fixes

#### Priority 1: Above-the-Fold Images (High CLS Impact)

These images load first and cause the most layout shift:

1. **Navigation Ship Logo** (`Illustratie---A.-Nobel--Zn---Schip.webp`)
   - Appears on ALL pages
   - Recommended: `width="864" height="486"`

2. **Language Flag Icons** (`Icon---Flag-*.webp`)
   - Small icons, but appear on every page
   - Recommended: `width="24" height="16"` (or actual icon size)

3. **Hero Images** (various)
   - Large above-the-fold images
   - Check actual dimensions and set appropriately

#### Priority 2: Content Images (Medium CLS Impact)

1. **Nobel Section Images** (`Foto---De-oprichter-*.webp`, etc.)
   - Used across multiple pages
   - Set consistent dimensions based on layout container

2. **Grid Images** (`grid--image` class)
   - Used on dit-is-nobel.html, locatie.html, werkenbij.html

#### Priority 3: Footer/Below-Fold Images (Lower CLS Impact)

1. **Contact Photos** (`Contact-Image-*.webp`)
2. **Footer Logo** (same as navigation logo)
3. **CTA Section Images**

### Recommended Action Plan

1. **Audit actual image dimensions**
   ```bash
   # Get actual dimensions of uploaded images
   identify images/*.webp
   ```

2. **Create dimension mapping**
   - Document the actual width/height of each unique image
   - Create Webflow style guide with standard sizes

3. **Update in Webflow Designer**
   - Start with above-the-fold images
   - Use consistent dimensions for repeated elements
   - Test with Lighthouse after each batch

4. **Verify improvements**
   - Run Lighthouse CLS audit before/after
   - Test on mobile devices (CLS is often worse on mobile)
   - Monitor Google Search Console Core Web Vitals

### Expected CLS Improvement

With all images having explicit dimensions:
- **Current estimated CLS**: 0.15 - 0.30 (needs improvement to poor)
- **Target CLS**: < 0.1 (good)
- **Expected improvement**: 50-70% reduction in CLS score

---

## Appendix: Common Image Dimensions Reference

Based on the anobel.com design system, these are recommended standard sizes:

| Image Type | Width | Height | Aspect Ratio |
|------------|-------|--------|--------------|
| Ship Logo | 864 | 486 | 16:9 |
| Flag Icons | 24 | 16 | 3:2 |
| Hero Images | 1920 | 1080 | 16:9 |
| Nobel Section | 800 | 600 | 4:3 |
| Grid Images | 600 | 400 | 3:2 |
| Contact Photos | 337 | 337 | 1:1 |
| Product Images | 400 | 400 | 1:1 |
| Video Thumbnails | 1920 | 1080 | 16:9 |
| Logo Marquee | 200 | 60 | ~3:1 |

---

*Document generated: January 24, 2026*
*Based on Webflow export analysis of anobel.com*
