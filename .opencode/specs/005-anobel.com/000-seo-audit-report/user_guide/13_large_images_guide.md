# Large Images Optimization Guide for anobel.com

> **SEO Issue**: Images over 100KB affecting page load times
> **Severity**: LOW
> **Impact**: Page Speed, Largest Contentful Paint (LCP) - Core Web Vital
> **Affected Images**: 11 images (7% of 154 total images)

---

## Table of Contents

1. [Why Image File Size Matters](#1-why-image-file-size-matters)
2. [Understanding LCP and Image Performance](#2-understanding-lcp-and-image-performance)
3. [Target File Sizes](#3-target-file-sizes)
4. [Large Images Audit](#4-large-images-audit)
5. [Page Usage Analysis](#5-page-usage-analysis)
6. [Image Optimization Workflow](#6-image-optimization-workflow)
7. [Webflow-Specific Optimization](#7-webflow-specific-optimization)
8. [Recommended Tools](#8-recommended-tools)
9. [How to Verify Improvements](#9-how-to-verify-improvements)
10. [Summary and Recommendations](#10-summary-and-recommendations)

---

## 1. Why Image File Size Matters

Large image files are one of the most common causes of slow page load times. When users visit your website:

1. **Bandwidth consumption**: Large images consume more data, affecting mobile users and slow connections
2. **Download time**: A 400KB image takes 4x longer to download than a 100KB image
3. **Server load**: More bytes transferred means higher hosting costs and server strain
4. **User experience**: Slow-loading images create a poor first impression
5. **SEO ranking**: Google uses page speed as a ranking factor

### The Cost of Large Images

| Image Size | 3G Connection (1 Mbps) | 4G Connection (10 Mbps) | Desktop (50 Mbps) |
|------------|------------------------|-------------------------|-------------------|
| 100KB | 0.8 seconds | 0.08 seconds | 0.016 seconds |
| 200KB | 1.6 seconds | 0.16 seconds | 0.032 seconds |
| 400KB | 3.2 seconds | 0.32 seconds | 0.064 seconds |

For users on slower connections, every extra kilobyte matters significantly.

---

## 2. Understanding LCP and Image Performance

### Largest Contentful Paint (LCP)

LCP measures how long it takes for the largest visible content element to render. Often, this is a hero image or main content image.

### LCP Score Thresholds

| Score | Rating | User Experience |
|-------|--------|-----------------|
| < 2.5s | Good | Fast, responsive feel |
| 2.5s - 4.0s | Needs Improvement | Noticeable delay |
| > 4.0s | Poor | Frustratingly slow |

### How Large Images Affect LCP

1. **Hero images**: Often the LCP element, directly impacting the score
2. **Above-the-fold content**: Large images delay visible content rendering
3. **Resource competition**: Large images compete with critical resources (CSS, JS)
4. **Render blocking**: Browser waits for image data before painting

### Google's Core Web Vitals

Since **June 2021**, Google uses Core Web Vitals as ranking signals:

| Metric | Measures | Target | Image Impact |
|--------|----------|--------|--------------|
| **LCP** | Loading performance | < 2.5s | Direct - large images slow LCP |
| **INP** | Interactivity | < 200ms | Indirect - bandwidth competition |
| **CLS** | Visual stability | < 0.1 | Indirect - slow images cause shifts |

---

## 3. Target File Sizes

### Recommended Maximum Sizes by Image Type

| Image Type | Target Size | Maximum Size | Format |
|------------|-------------|--------------|--------|
| Hero/Banner (Full Width) | < 150KB | 200KB | WebP |
| Content Images | < 80KB | 100KB | WebP |
| Thumbnails | < 30KB | 50KB | WebP |
| Icons/Logos | < 10KB | 20KB | WebP/SVG |
| Video Placeholders | < 100KB | 150KB | WebP/JPEG |

### Why 100KB as a Benchmark?

- **Mobile data costs**: Many users have limited data plans
- **Time to Interactive**: Sub-100KB images load fast enough to feel instant
- **Modern compression**: Quality WebP images can look excellent under 100KB
- **Cumulative impact**: 10 images at 50KB each = 500KB total, keeping pages lean

### Format Comparison

| Format | Quality | File Size | Browser Support |
|--------|---------|-----------|-----------------|
| WebP | Excellent | Smallest | 98%+ modern browsers |
| AVIF | Best | Even smaller | ~90% browsers |
| JPEG | Good | Medium | Universal |
| PNG | Lossless | Large | Universal |

**Recommendation**: Use WebP as primary format with JPEG fallback.

---

## 4. Large Images Audit

### Images Over 100KB (Requires Optimization)

The following 11 images exceed the 100KB threshold and should be optimized:

| # | Filename | File Size | Format | Priority |
|---|----------|-----------|--------|----------|
| 1 | `player-placeholder.jpg` | **439KB** | JPEG | HIGH |
| 2 | `Foto---Kantoor-en-haven-van-Anobel.webp` | **353KB** | WebP | HIGH |
| 3 | `player-placeholder-p-1080.jpg` | **212KB** | JPEG | HIGH |
| 4 | `Foto---Kantoor-en-haven-van-Anobel-p-1600.webp` | **189KB** | WebP | MEDIUM |
| 5 | `Foto---Man-loopt-met-winkelwagen-door-magazijn.webp` | **187KB** | WebP | MEDIUM |
| 6 | `Mijn-assortiment-in-de-Nobel-Webshop.webp` | **118KB** | WebP | LOW |
| 7 | `Blacklisten-in-de-Nobel-Webshop.webp` | **117KB** | WebP | LOW |
| 8 | `player-placeholder-p-800.jpg` | **114KB** | JPEG | MEDIUM |
| 9 | `Filtratie---Martijn-Nobel.webp` | **109KB** | WebP | LOW |
| 10 | `Foto---Kantoor-en-haven-van-Anobel-p-1080.webp` | **105KB** | WebP | MEDIUM |
| 11 | `Video---Home---Hero---Background-Scene-p-1600.webp` | **100KB** | WebP | LOW |

### Total Impact

- **Combined size of oversized images**: ~2.04MB
- **Potential savings with optimization**: ~1.2MB (60% reduction possible)
- **Pages affected**: 15+ pages

### Images Approaching Threshold (80-100KB)

These images are within acceptable range but could benefit from optimization:

| Filename | File Size |
|----------|-----------|
| `Ondersteunend---Aart-Nobel.webp` | 93KB |
| `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | 86KB |
| `Foto---Medewerker-van-Anobel-achter-de-computer.webp` | 86KB |
| `Foto---De-oprichter-in-een-verkoopgesprek.webp` | 81KB |
| `Illustratie---A.-Nobel--Zn---Schip.webp` | 77KB |
| `Goedkeuren-in-de-Nobel-Webshop.webp` | 73KB |

---

## 5. Page Usage Analysis

### Critical Images by Page

#### Homepage (index.html)
| Image | Size | Usage | LCP Risk |
|-------|------|-------|----------|
| `player-placeholder.jpg` | 439KB | Hero video thumbnail | HIGH |

#### Dit is Nobel (dit-is-nobel.html)
| Image | Size | Usage | LCP Risk |
|-------|------|-------|----------|
| `player-placeholder.jpg` | 439KB | Hero video thumbnail | HIGH |
| `Foto---Kantoor-en-haven-van-Anobel.webp` | 353KB | Grid section | MEDIUM |

#### Locatie (locatie.html)
| Image | Size | Usage | LCP Risk |
|-------|------|-------|----------|
| `player-placeholder.jpg` | 439KB | Hero video thumbnail | HIGH |
| `Foto---Kantoor-en-haven-van-Anobel.webp` | 353KB | Grid section | MEDIUM |
| `Filtratie---Martijn-Nobel.webp` | 109KB | Footer contact | LOW |

#### Werken Bij (werkenbij.html)
| Image | Size | Usage | LCP Risk |
|-------|------|-------|----------|
| `player-placeholder.jpg` | 439KB | Hero video thumbnails (3x) | HIGH |
| `Foto---Kantoor-en-haven-van-Anobel.webp` | 353KB | Grid section | MEDIUM |

#### Webshop (webshop.html)
| Image | Size | Usage | LCP Risk |
|-------|------|-------|----------|
| `Mijn-assortiment-in-de-Nobel-Webshop.webp` | 118KB | Tab content | LOW |
| `Blacklisten-in-de-Nobel-Webshop.webp` | 117KB | Tab content | LOW |

#### Maatwerk (maatwerk.html)
| Image | Size | Usage | LCP Risk |
|-------|------|-------|----------|
| `player-placeholder.jpg` | 439KB | Hero video thumbnail | HIGH |
| `Filtratie---Martijn-Nobel.webp` | 109KB | Footer contact | LOW |

#### Blog Detail (detail_blog.html)
| Image | Size | Usage | LCP Risk |
|-------|------|-------|----------|
| `Foto---Man-loopt-met-winkelwagen-door-magazijn.webp` | 187KB | Hero image | HIGH |

#### Service Pages (filtratie.html, scheepsuitrusting.html, scheepsbunkering.html, isps.html, brochures.html, team.html, blog.html)
| Image | Size | Usage | LCP Risk |
|-------|------|-------|----------|
| `player-placeholder.jpg` | 439KB | Hero video thumbnail | HIGH |

### Summary: `player-placeholder.jpg` Usage

This is the most problematic image, appearing on **13 pages**:
- index.html (homepage)
- dit-is-nobel.html
- locatie.html
- werkenbij.html (3 instances)
- maatwerk.html
- filtratie.html
- scheepsuitrusting.html
- scheepsbunkering.html
- isps.html
- brochures.html
- team.html
- blog.html

**Impact**: Optimizing this single image would improve load times across the entire site.

---

## 6. Image Optimization Workflow

### Step-by-Step Process

#### Step 1: Download Original from Webflow

1. Open Webflow Designer
2. Navigate to **Assets** panel (left sidebar)
3. Find the image to optimize
4. Right-click > **Download**
5. Save original as backup

#### Step 2: Analyze Current Dimensions

Check if the image is larger than needed:

```bash
# Mac/Linux
sips -g pixelWidth -g pixelHeight image.jpg

# Or use online tool like https://imagecompressor.com
```

#### Step 3: Resize if Necessary

| Display Context | Recommended Max Width |
|-----------------|----------------------|
| Hero (full width) | 1920px |
| Content area | 1200px |
| Sidebar/cards | 600px |
| Thumbnails | 400px |

#### Step 4: Compress the Image

**For WebP conversion:**
```bash
# Using cwebp (install via Homebrew: brew install webp)
cwebp -q 80 input.jpg -o output.webp
```

**For JPEG optimization:**
```bash
# Using jpegoptim (install via Homebrew: brew install jpegoptim)
jpegoptim --max=80 --strip-all image.jpg
```

#### Step 5: Verify Quality

1. Compare original vs optimized visually
2. Check file size reduction
3. Ensure no visible artifacts at intended display size

#### Step 6: Upload to Webflow

1. In Webflow Designer, go to **Assets**
2. Click **Upload** or drag the optimized file
3. Replace existing image references
4. Publish changes

#### Step 7: Test in Browser

1. Clear browser cache
2. Load the page
3. Verify image displays correctly
4. Run Lighthouse audit

---

## 7. Webflow-Specific Optimization

### Using Webflow's Built-in Features

#### 1. Responsive Images (srcset)

Webflow automatically generates multiple sizes when you upload images:

```html
<!-- Webflow auto-generates this -->
<img srcset="
  images/photo-p-500.webp 500w,
  images/photo-p-800.webp 800w,
  images/photo-p-1080.webp 1080w,
  images/photo-p-1600.webp 1600w,
  images/photo.webp 1920w"
  sizes="100vw"
  src="images/photo.webp"
>
```

This means smaller screens automatically receive smaller images.

#### 2. Image Settings in Designer

1. **Select the image** in Webflow Designer
2. Click the **Settings** panel (gear icon)
3. Options available:
   - **High DPI**: Generates 2x versions for retina displays
   - **Load**: Choose "Lazy" for below-the-fold images
   - **Alt text**: Add descriptive text (also helps SEO)

#### 3. Lazy Loading

For images below the fold:

1. Select image element
2. Open Settings
3. Set Load to **"Lazy"**

This delays loading of non-visible images until user scrolls.

#### 4. Using Picture Element for Format Fallback

For optimal format support:

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>
```

Note: Webflow handles WebP conversion automatically for most modern browsers.

### Current Pattern Analysis

The anobel.com export shows Webflow is already:
- Generating responsive srcset variants (`-p-500`, `-p-800`, `-p-1080`, `-p-1600`)
- Using WebP format for most images
- Applying lazy loading to below-fold images

**Issue**: The source images are too large, so even the optimized variants are oversized.

### Recommendation

Upload pre-optimized source images to Webflow:
- Maximum 1920px width for full-bleed images
- Maximum 1200px width for content images
- Pre-compressed to WebP or high-quality JPEG

---

## 8. Recommended Tools

### Free Online Tools

| Tool | Best For | URL |
|------|----------|-----|
| **Squoosh** | Best quality/size balance | https://squoosh.app |
| **TinyPNG** | Batch processing | https://tinypng.com |
| **Compressor.io** | Multiple formats | https://compressor.io |
| **SVGOMG** | SVG optimization | https://jakearchibald.github.io/svgomg/ |

### Desktop Applications

| Tool | Platform | Features |
|------|----------|----------|
| **ImageOptim** | Mac | Drag-and-drop batch optimization |
| **FileOptimizer** | Windows | Multiple format support |
| **GIMP** | Cross-platform | Advanced editing + export optimization |
| **Photoshop** | Cross-platform | "Save for Web" with fine control |

### Command Line Tools

```bash
# Install on Mac via Homebrew
brew install webp jpegoptim pngquant imagemagick

# WebP conversion (lossy, quality 80)
cwebp -q 80 input.jpg -o output.webp

# WebP conversion (lossless)
cwebp -lossless input.png -o output.webp

# JPEG optimization
jpegoptim --max=80 --strip-all *.jpg

# PNG optimization
pngquant --quality=65-80 input.png

# Batch resize + convert with ImageMagick
mogrify -resize 1920x1920\> -format webp -quality 80 *.jpg
```

### Squoosh Recommended Settings

For the problematic `player-placeholder.jpg`:

1. Open https://squoosh.app
2. Upload `player-placeholder.jpg`
3. Select **WebP** as output format
4. Settings:
   - **Quality**: 75-80
   - **Effort**: 4 (balanced)
   - **Resize**: 1920x1080 (if larger)
5. Download optimized version

Expected result: 439KB → ~80KB (82% reduction)

---

## 9. How to Verify Improvements

### Before Optimization: Baseline Measurements

1. **Run Lighthouse Audit**
   - Open Chrome DevTools (F12)
   - Go to "Lighthouse" tab
   - Select "Performance" category
   - Run audit on mobile preset
   - Note LCP score and "Properly size images" warning

2. **Check Network Transfer**
   - Open DevTools > Network tab
   - Reload page with cache disabled (Cmd+Shift+R)
   - Filter by "Img"
   - Note total image transfer size

3. **Document Current State**
   ```
   Page: index.html
   Date: [today]
   LCP Score: [X.X seconds]
   Total Image Transfer: [X.XX MB]
   Largest Image: player-placeholder.jpg (439KB)
   ```

### After Optimization: Verify Improvements

1. **Clear CDN Cache** (if using Cloudflare or similar)

2. **Clear Browser Cache**
   - Chrome: Settings > Privacy > Clear browsing data
   - Or use Incognito mode

3. **Re-run Lighthouse Audit**
   - Compare LCP before/after
   - Check if "Properly size images" warning is resolved

4. **Verify Network Transfer**
   - Same process as baseline
   - Compare total bytes transferred

5. **Document Improvements**
   ```
   Page: index.html
   Date: [today]
   LCP Score: [X.X seconds] (was X.X - improved by X%)
   Total Image Transfer: [X.XX MB] (was X.XX - saved X%)
   Largest Image: player-placeholder.webp (80KB)
   ```

### Testing Tools

| Tool | Purpose | URL |
|------|---------|-----|
| **PageSpeed Insights** | Google's official tool | https://pagespeed.web.dev |
| **WebPageTest** | Detailed waterfall analysis | https://webpagetest.org |
| **GTmetrix** | Performance scoring | https://gtmetrix.com |
| **Lighthouse CI** | Automated testing | Built into Chrome DevTools |

### Metrics to Track

| Metric | Target | How to Measure |
|--------|--------|----------------|
| LCP | < 2.5s | Lighthouse |
| Total Page Weight | < 2MB | Network tab |
| Image Transfer | < 500KB | Network tab (filter: Img) |
| Time to First Byte | < 600ms | WebPageTest |

---

## 10. Summary and Recommendations

### Priority Action Items

#### Priority 1: Critical (Do First)

| Action | Image | Current | Target | Impact |
|--------|-------|---------|--------|--------|
| Optimize | `player-placeholder.jpg` | 439KB | <100KB | 13 pages improved |
| Optimize | `Foto---Kantoor-en-haven-van-Anobel.webp` | 353KB | <100KB | 4 pages improved |
| Optimize | `player-placeholder-p-1080.jpg` | 212KB | <80KB | Responsive variant |

#### Priority 2: Important (Do Soon)

| Action | Image | Current | Target | Impact |
|--------|-------|---------|--------|--------|
| Optimize | `Foto---Kantoor-en-haven-van-Anobel-p-1600.webp` | 189KB | <100KB | Responsive variant |
| Optimize | `Foto---Man-loopt-met-winkelwagen-door-magazijn.webp` | 187KB | <100KB | Blog hero |
| Optimize | `player-placeholder-p-800.jpg` | 114KB | <60KB | Responsive variant |
| Optimize | `Foto---Kantoor-en-haven-van-Anobel-p-1080.webp` | 105KB | <60KB | Responsive variant |

#### Priority 3: Nice to Have (When Possible)

| Action | Image | Current | Target |
|--------|-------|---------|--------|
| Optimize | `Mijn-assortiment-in-de-Nobel-Webshop.webp` | 118KB | <80KB |
| Optimize | `Blacklisten-in-de-Nobel-Webshop.webp` | 117KB | <80KB |
| Optimize | `Filtratie---Martijn-Nobel.webp` | 109KB | <80KB |
| Optimize | `Video---Home---Hero---Background-Scene-p-1600.webp` | 100KB | <80KB |

### Expected Results After Optimization

| Metric | Before | After (Expected) | Improvement |
|--------|--------|------------------|-------------|
| Total oversized images | 11 | 0 | 100% resolved |
| Combined size of flagged images | 2.04MB | ~0.8MB | 60% reduction |
| Average LCP (estimated) | 3.0s | 2.2s | 27% faster |
| PageSpeed score impact | Moderate | Good | +10-15 points |

### Implementation Checklist

```
[ ] Download all 11 oversized images from Webflow
[ ] Create backup folder with originals
[ ] Optimize player-placeholder.jpg (highest priority)
[ ] Optimize Foto---Kantoor-en-haven-van-Anobel.webp
[ ] Optimize remaining Priority 1 images
[ ] Upload optimized versions to Webflow
[ ] Update image references (if filenames changed)
[ ] Publish changes
[ ] Clear CDN cache
[ ] Run Lighthouse audit on key pages
[ ] Document before/after metrics
[ ] Monitor Google Search Console Core Web Vitals
```

### Long-term Best Practices

1. **Before uploading new images to Webflow**:
   - Resize to maximum needed dimensions
   - Compress using Squoosh or ImageOptim
   - Use WebP format when possible
   - Target under 100KB for most images

2. **Regular audits**:
   - Check PageSpeed Insights monthly
   - Monitor Search Console Core Web Vitals
   - Re-audit after adding new content

3. **Webflow settings**:
   - Enable lazy loading for below-fold images
   - Use appropriate "sizes" attribute
   - Let Webflow generate responsive variants

---

## Appendix: Image Inventory

### Complete List of Images in Export (154 files)

**Total folder size**: 5.6MB

#### By Size Category

| Category | Count | Size Range |
|----------|-------|------------|
| Over 100KB (needs optimization) | 11 | 100KB - 439KB |
| 50KB - 100KB (acceptable) | 23 | 50KB - 99KB |
| 20KB - 50KB (good) | 42 | 20KB - 49KB |
| Under 20KB (excellent) | 78 | <20KB |

#### By Format

| Format | Count | Notes |
|--------|-------|-------|
| WebP | 141 | Modern, well-compressed |
| JPEG | 12 | Legacy, should convert to WebP |
| SVG | 1 | Vector, already optimal |

---

*Document generated: January 24, 2026*
*Based on Webflow export analysis of anobel.com*
