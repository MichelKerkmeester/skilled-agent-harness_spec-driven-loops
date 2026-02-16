# Image Alt Text SEO Fix Guide

> **Severity:** MEDIUM
> **Impact:** Accessibility, Image SEO, Google Image Search
> **Estimated Time:** 1-2 hours
> **Last Updated:** 2026-01-24

---

## Table of Contents

1. [Why Alt Text Matters](#1-why-alt-text-matters)
2. [Summary of Missing Alt Text](#2-summary-of-missing-alt-text)
3. [Page-by-Page Fixes](#3-page-by-page-fixes)
4. [How to Add Alt Text in Webflow](#4-how-to-add-alt-text-in-webflow)
5. [Best Practices for Writing Alt Text](#5-best-practices-for-writing-alt-text)
6. [Quick Reference Table](#6-quick-reference-table)

---

## 1. Why Alt Text Matters

### Accessibility (WCAG Compliance)
- Screen readers use alt text to describe images to visually impaired users
- Required for WCAG 2.1 Level A compliance
- Legal requirement in many jurisdictions

### SEO Benefits
- Google uses alt text to understand image content
- Images with proper alt text can appear in Google Image Search
- Contributes to overall page relevance signals

### User Experience
- Alt text displays when images fail to load
- Helps users understand content even on slow connections

### Image Search Traffic
- Images with descriptive alt text rank in Google Images
- Can drive significant traffic for product and visual content

---

## 2. Summary of Missing Alt Text

Based on the SEO audit, **approximately 40 images (21%)** across the website have empty or missing alt text.

### Images by Category

| Category | Count | Priority |
|----------|-------|----------|
| Logo/Ship Illustration (Footer) | 15+ | HIGH - Brand identity |
| Contact Team Photos | 14+ | HIGH - People images |
| Flag Icons (Language Selector) | 30+ | LOW - Decorative |
| Content Images (Sections) | 20+ | HIGH - Main content |
| Product Images | 8+ | HIGH - E-commerce |
| CTA/Brochure Images | 15+ | MEDIUM - Marketing |
| Video Thumbnails/Placeholders | 10+ | MEDIUM - Dynamic content |
| Grid/Gallery Images | 6+ | HIGH - Visual content |

### Priority Legend
- **HIGH**: Visible content images that affect SEO and accessibility
- **MEDIUM**: Supporting images with moderate impact
- **LOW**: Decorative elements (can use empty alt for decorative images)

---

## 3. Page-by-Page Fixes

### 3.1 index.html (Homepage)

| Image | Class | Current Alt | Suggested Alt Text |
|-------|-------|-------------|-------------------|
| `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | `""` | "A. Nobel & Zn scheepsilllustratie logo" |
| `Icon---Flag---The-Netherlands.webp` | `language--flag` | `""` | "Nederlandse vlag" or `""` (decorative) |
| `Icon---Flag---United-Kingdom.webp` | `language--flag` | `""` | "Britse vlag" or `""` (decorative) |
| `player-placeholder.jpg` | `video--thumbnail` | `""` | "Video afspelen over A. Nobel & Zn" |
| `logo---Baldwin-Filters.webp` | `logo--marquee` | `""` | "Baldwin Filters partner logo" |
| `Foto---De-oprichter-in-een-verkoopgesprek.webp` | `nobel--image` | `""` | "De oprichter van Nobel in een verkoopgesprek met klant" |
| `Foto---Medewerker-van-Anobel-achter-de-computer.webp` | `nobel--image` | `""` | "Medewerker van A. Nobel & Zn achter de computer" |
| `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--brochure` | `""` | "A. Nobel webshop interface op MacBook" |
| `Contact-Image-2.webp` | `footer--contact-photo-image` | `""` | "Contactpersoon A. Nobel & Zn klantenservice" |
| `Contact-Image-1.webp` | `footer--contact-photo-image` | `""` | "Contactpersoon A. Nobel & Zn verkoop" |

---

### 3.2 contact.html

| Image | Class | Current Alt | Suggested Alt Text |
|-------|-------|-------------|-------------------|
| `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | `""` | "A. Nobel & Zn scheepsilllustratie logo" |
| `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image u--size-100` | `""` | "A. Nobel webshop bevestiging" |
| `Foto---De-oprichter-in-een-verkoopgesprek.webp` | `nobel--image` | `""` | "De oprichter van Nobel in gesprek" |
| `Foto---Medewerker-van-Anobel-achter-de-computer.webp` | `nobel--image` | `""` | "Medewerker van A. Nobel & Zn" |
| `Contact-Image-2.webp` | `footer--contact-photo-image` | `""` | "Contactpersoon klantenservice" |
| `Contact-Image-1.webp` | `footer--contact-photo-image` | `""` | "Contactpersoon verkoop" |

---

### 3.3 blog.html

| Image | Class | Current Alt | Suggested Alt Text |
|-------|-------|-------------|-------------------|
| `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | `""` | "A. Nobel & Zn scheepsilllustratie logo" |
| `Reddingsjas-KI-310N.webp` | `image is--product` | `""` | "Reddingsjas KI-310N product afbeelding" |
| `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--brochure` | `""` | "A. Nobel webshop interface" |
| `Foto---De-oprichter-in-een-verkoopgesprek.webp` | `nobel--image` | `""` | "De oprichter van Nobel" |
| `Foto---Medewerker-van-Anobel-achter-de-computer.webp` | `nobel--image` | `""` | "Medewerker achter computer" |

---

### 3.4 brochures.html

| Image | Class | Current Alt | Suggested Alt Text |
|-------|-------|-------------|-------------------|
| `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | `""` | "A. Nobel & Zn scheepsilllustratie logo" |
| `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--brochure` | `""` | "Voorbeeld brochure op MacBook" |
| `Foto---De-oprichter-in-een-verkoopgesprek.webp` | `nobel--image` | `""` | "De oprichter in verkoopgesprek" |
| `Foto---Medewerker-van-Anobel-achter-de-computer.webp` | `nobel--image` | `""` | "Medewerker van A. Nobel" |
| `Contact-Image-2.webp` | `footer--contact-photo-image` | `""` | "Contactpersoon klantenservice" |
| `Contact-Image-1.webp` | `footer--contact-photo-image` | `""` | "Contactpersoon verkoop" |

---

### 3.5 voorwaarden.html (Terms & Conditions)

| Image | Class | Current Alt | Suggested Alt Text |
|-------|-------|-------------|-------------------|
| `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | `""` | "A. Nobel & Zn scheepsilllustratie logo" |
| `Contact-Image-2.webp` | `footer--contact-photo-image` | `""` | "Contactpersoon A. Nobel" |
| `Contact-Image-1.webp` | `footer--contact-photo-image` | `""` | "Contactpersoon A. Nobel" |

---

### 3.6 webshop.html

| Image | Class | Current Alt | Suggested Alt Text |
|-------|-------|-------------|-------------------|
| `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | `""` | "A. Nobel & Zn scheepsilllustratie logo" |
| `placeholder.svg` (product images) | `link--product-image` | `""` | Dynamic: Product name from CMS |
| `logo---Baldwin-Filters.webp` | `logo--marquee` | `""` | "Baldwin Filters partner logo" |
| `Blacklisten-in-de-Nobel-Webshop.webp` | `image is--tab-autoplay` | `""` | "Blacklist functie in de Nobel webshop" |
| `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--brochure` | `""` | "A. Nobel webshop op MacBook" |
| `Foto---De-oprichter-in-een-verkoopgesprek.webp` | `nobel--image` | `""` | "De oprichter van Nobel" |
| `Contact-Image-2.webp` | `footer--contact-photo-image` | `""` | "Contactpersoon webshop support" |
| `Contact-Image-1.webp` | `footer--contact-photo-image` | `""` | "Contactpersoon verkoop" |

---

### 3.7 team.html

| Image | Class | Current Alt | Suggested Alt Text |
|-------|-------|-------------|-------------------|
| `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | `""` | "A. Nobel & Zn scheepsilllustratie logo" |
| Team member photos | `team--photo-image` | `""` | Dynamic: "[Naam medewerker] - [Functie]" |
| `logo---Baldwin-Filters.webp` | `logo--marquee` | `""` | "Baldwin Filters partner logo" |
| `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--brochure` | `""` | "A. Nobel webshop interface" |
| `Foto---De-oprichter-in-een-verkoopgesprek.webp` | `nobel--image` | `""` | "De oprichter van Nobel" |
| `Foto---Medewerker-van-Anobel-achter-de-computer.webp` | `nobel--image` | `""` | "Medewerker achter computer" |

**Note:** Team member photos from CMS should have alt text set in the CMS collection.

---

### 3.8 dit-is-nobel.html (About Us)

| Image | Class | Current Alt | Suggested Alt Text |
|-------|-------|-------------|-------------------|
| `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | `""` | "A. Nobel & Zn scheepsilllustratie logo" |
| `player-placeholder.jpg` | `video--thumbnail` | `""` | "Video over A. Nobel & Zn bedrijf" |
| `logo---Baldwin-Filters.webp` | `logo--marquee` | `""` | "Baldwin Filters partner logo" |
| `Foto---De-oprichter-in-een-verkoopgesprek.webp` | `nobel--image` | `""` | "De oprichter van A. Nobel & Zn" |
| `Foto---Medewerker-van-Anobel-achter-de-computer.webp` | `nobel--image` | `""` | "Medewerker van A. Nobel" |
| `Unibarge.webp` | `logo is--testimonial` | `""` | "Unibarge klant logo" |
| `Foto---Kantoor-en-haven-van-Anobel.webp` | `grid--image` | `""` | "Kantoor en haven van A. Nobel & Zn" |
| `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--brochure` | `""` | "A. Nobel webshop interface" |
| `Contact-Image-2.webp` | `footer--contact-photo-image` | `""` | "Contactpersoon A. Nobel" |
| `Contact-Image-1.webp` | `footer--contact-photo-image` | `""` | "Contactpersoon A. Nobel" |

---

### 3.9 maatwerk.html (Custom Work)

| Image | Class | Current Alt | Suggested Alt Text |
|-------|-------|-------------|-------------------|
| `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | `""` | "A. Nobel & Zn scheepsilllustratie logo" |
| `logo---Baldwin-Filters.webp` | `logo--marquee` | `""` | "Baldwin Filters partner logo" |
| `Foto---De-oprichter-in-een-verkoopgesprek.webp` | `nobel--image` | `""` | "De oprichter bespreekt maatwerk oplossingen" |
| `Foto---Medewerker-van-Anobel-achter-de-computer.webp` | `nobel--image` | `""` | "Medewerker werkt aan maatwerk order" |
| `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--brochure` | `""` | "A. Nobel webshop voor maatwerk" |
| `Ondersteunend---Aart-Nobel.webp` | `footer--contact-photo-image` | `""` | "Aart Nobel - Maatwerk specialist" |
| `Filtratie---Martijn-Nobel.webp` | `footer--contact-photo-image` | `""` | "Martijn Nobel - Filtratie expert" |

---

### 3.10 scheepsuitrusting.html (Ship Equipment)

| Image | Class | Current Alt | Suggested Alt Text |
|-------|-------|-------------|-------------------|
| `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | `""` | "A. Nobel & Zn scheepsilllustratie logo" |
| `player-placeholder.jpg` | `video--thumbnail` | `""` | "Video over scheepsuitrusting" |
| `logo---Baldwin-Filters.webp` | `logo--marquee` | `""` | "Baldwin Filters partner logo" |
| `Foto---De-oprichter-in-een-verkoopgesprek.webp` | `nobel--image` | `""` | "Scheepsuitrusting adviesgesprek" |
| `Foto---Medewerker-van-Anobel-achter-de-computer.webp` | `nobel--image` | `""` | "Medewerker scheepsuitrusting afdeling" |
| `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--brochure` | `""` | "Scheepsuitrusting webshop" |
| `Contact-Image-2.webp` | `footer--contact-photo-image` | `""` | "Contactpersoon scheepsuitrusting" |
| `Contact-Image-1.webp` | `footer--contact-photo-image` | `""` | "Contactpersoon verkoop" |

---

### 3.11 isps.html (ISPS Security)

| Image | Class | Current Alt | Suggested Alt Text |
|-------|-------|-------------|-------------------|
| `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | `""` | "A. Nobel & Zn scheepsilllustratie logo" |
| `player-placeholder.jpg` | `video--thumbnail` | `""` | "Video over ISPS beveiliging" |
| `logo---Baldwin-Filters.webp` | `logo--marquee` | `""` | "Baldwin Filters partner logo" |
| `Foto---De-oprichter-in-een-verkoopgesprek.webp` | `nobel--image` | `""` | "ISPS beveiligingsadvies gesprek" |
| `Foto---Medewerker-van-Anobel-achter-de-computer.webp` | `nobel--image` | `""` | "Medewerker ISPS afdeling" |
| `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--brochure` | `""` | "ISPS producten in webshop" |
| `Contact-Image-2.webp` | `footer--contact-photo-image` | `""` | "Contactpersoon ISPS" |
| `Contact-Image-1.webp` | `footer--contact-photo-image` | `""` | "Contactpersoon verkoop" |

---

### 3.12 filtratie.html (Filtration)

| Image | Class | Current Alt | Suggested Alt Text |
|-------|-------|-------------|-------------------|
| `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | `""` | "A. Nobel & Zn scheepsilllustratie logo" |
| `player-placeholder.jpg` | `video--thumbnail` | `""` | "Video over filtratiesystemen" |
| `logo---Baldwin-Filters.webp` | `logo--marquee` | `""` | "Baldwin Filters partner logo" |
| `Foto---De-oprichter-in-een-verkoopgesprek.webp` | `nobel--image` | `""` | "Filtratie adviesgesprek" |
| `Foto---Medewerker-van-Anobel-achter-de-computer.webp` | `nobel--image` | `""` | "Medewerker filtratie afdeling" |
| `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--brochure` | `""` | "Filtratieproducten in webshop" |
| `Contact-Image-2.webp` | `footer--contact-photo-image` | `""` | "Contactpersoon filtratie" |
| `Contact-Image-1.webp` | `footer--contact-photo-image` | `""` | "Contactpersoon verkoop" |

---

### 3.13 locatie.html (Location)

| Image | Class | Current Alt | Suggested Alt Text |
|-------|-------|-------------|-------------------|
| `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | `""` | "A. Nobel & Zn scheepsilllustratie logo" |
| `player-placeholder.jpg` | `video--thumbnail` | `""` | "Video van A. Nobel & Zn locatie" |
| `logo---Baldwin-Filters.webp` | `logo--marquee` | `""` | "Baldwin Filters partner logo" |
| `Foto---De-oprichter-in-een-verkoopgesprek.webp` | `nobel--image` | `""` | "Gesprek op locatie" |
| `Foto---Kantoor-en-haven-van-Anobel.webp` | `grid--image` | `""` | "Kantoor en haven van A. Nobel & Zn" |
| `Foto---Medewerker-van-Anobel-achter-de-computer.webp` | `grid--image` | `""` | "Medewerker op kantoor" |
| `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--brochure` | `""` | "A. Nobel webshop interface" |
| `Ondersteunend---Aart-Nobel.webp` | `footer--contact-photo-image` | `""` | "Aart Nobel - Contactpersoon" |
| `Filtratie---Martijn-Nobel.webp` | `footer--contact-photo-image` | `""` | "Martijn Nobel - Contactpersoon" |

---

### 3.14 werkenbij.html (Careers)

| Image | Class | Current Alt | Suggested Alt Text |
|-------|-------|-------------|-------------------|
| `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | `""` | "A. Nobel & Zn scheepsilllustratie logo" |
| `player-placeholder.jpg` | `video--thumbnail` | `""` | "Video over werken bij A. Nobel & Zn" |
| `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image u--size-100` | `""` | "Sollicitatie bevestiging" |
| `Foto---De-oprichter-in-een-verkoopgesprek.webp` | `nobel--image` | `""` | "Werksfeer bij A. Nobel & Zn" |
| `Foto---Medewerker-van-Anobel-achter-de-computer.webp` | `nobel--image` | `""` | "Collega achter de computer" |
| `Foto---Kantoor-en-haven-van-Anobel.webp` | `grid--image` | `""` | "Ons kantoor en haven" |
| `Contact-Image-2.webp` | `footer--contact-photo-image` | `""` | "HR contactpersoon" |
| `Contact-Image-1.webp` | `footer--contact-photo-image` | `""` | "HR contactpersoon" |

---

### 3.15 scheepsbunkering.html (Ship Bunkering)

| Image | Class | Current Alt | Suggested Alt Text |
|-------|-------|-------------|-------------------|
| `Illustratie---A.-Nobel--Zn---Schip.webp` | `logo--footer` | `""` | "A. Nobel & Zn scheepsilllustratie logo" |
| `player-placeholder.jpg` | `video--thumbnail` | `""` | "Video over scheepsbunkering" |
| `logo---Baldwin-Filters.webp` | `logo--marquee` | `""` | "Baldwin Filters partner logo" |
| `Foto---De-oprichter-in-een-verkoopgesprek.webp` | `nobel--image` | `""` | "Bunkering adviesgesprek" |
| `Foto---Medewerker-van-Anobel-achter-de-computer.webp` | `nobel--image` | `""` | "Medewerker bunkering afdeling" |
| `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `image is--brochure` | `""` | "Bunkering producten in webshop" |
| `Contact-Image-2.webp` | `footer--contact-photo-image` | `""` | "Contactpersoon bunkering" |
| `Contact-Image-1.webp` | `footer--contact-photo-image` | `""` | "Contactpersoon verkoop" |

---

## 4. How to Add Alt Text in Webflow

### Step-by-Step Instructions

#### For Static Images:

1. **Open Webflow Designer** and navigate to the page with the image
2. **Select the image element** by clicking on it
3. **Open the Settings panel** (gear icon in the right panel, or press `D`)
4. **Find the "Alt Text" field** in the Image Settings section
5. **Enter descriptive alt text** following the suggestions above
6. **Save and publish** your changes

#### For CMS-Bound Images:

1. **Open your CMS Collections** in Webflow
2. **Find the image field** in the collection (e.g., Team Member Photo)
3. **Add an "Alt Text" field** to the collection if it doesn't exist:
   - Add a new field
   - Choose "Plain Text" type
   - Name it "Photo Alt Text" or similar
4. **Bind the alt text field** to the image element in the Designer:
   - Select the image
   - In Settings, click the purple dot next to Alt Text
   - Choose your CMS alt text field
5. **Update CMS items** with appropriate alt text

#### For Dynamic/Placeholder Images:

Some images use placeholders or are bound to empty CMS fields. For these:

1. Ensure the CMS field has a default alt text value
2. Or use conditional visibility to hide empty images

---

## 5. Best Practices for Writing Alt Text

### Do's

- **Be descriptive but concise** (125 characters or less)
- **Describe the content and function** of the image
- **Include relevant keywords naturally** (don't keyword stuff)
- **Use the same language** as the page content (Dutch for Dutch pages)
- **Consider context** - what is this image communicating?

### Don'ts

- **Don't start with "Image of..." or "Picture of..."** - screen readers already announce it's an image
- **Don't use file names** as alt text (e.g., "IMG_1234.jpg")
- **Don't leave alt text empty** for meaningful images
- **Don't duplicate surrounding text** exactly
- **Don't use only keywords** without context

### Special Cases

| Image Type | Recommendation |
|------------|----------------|
| **Decorative images** | Use empty alt: `alt=""` |
| **Icons with text labels** | Use empty alt or describe function |
| **Logos** | Include company name: "A. Nobel & Zn logo" |
| **Product images** | Include product name and key features |
| **Team photos** | Include name and role |
| **Charts/diagrams** | Describe the data or provide text alternative |

### Examples

| Bad | Good |
|-----|------|
| "image.jpg" | "Reddingsjas KI-310N in oranje kleur" |
| "Picture of a person" | "Martijn Nobel, Filtratie specialist" |
| "Click here" | "Bekijk product details knop" |
| "" (empty for content image) | "A. Nobel & Zn magazijn met scheepsuitrusting" |

---

## 6. Quick Reference Table

### Summary: Images Requiring Alt Text by Page

| Page | Missing Alt Count | Priority Images |
|------|------------------|-----------------|
| index.html | ~15 | Logo, contact photos, content images |
| contact.html | ~12 | Logo, form success images, contact photos |
| blog.html | ~14 | Logo, product images, content images |
| brochures.html | ~16 | Logo, brochure previews, contact photos |
| voorwaarden.html | ~8 | Logo, contact photos |
| webshop.html | ~20 | Logo, products, webshop features, contact photos |
| team.html | ~12 | Logo, team photos, contact photos |
| dit-is-nobel.html | ~18 | Logo, company images, grid photos, testimonials |
| maatwerk.html | ~15 | Logo, content images, contact photos |
| scheepsuitrusting.html | ~12 | Logo, content images, contact photos |
| isps.html | ~14 | Logo, content images, contact photos |
| filtratie.html | ~12 | Logo, content images, contact photos |
| locatie.html | ~14 | Logo, location images, grid photos |
| werkenbij.html | ~16 | Logo, career images, grid photos |
| scheepsbunkering.html | ~12 | Logo, content images, contact photos |

### Common Images Across All Pages

These images appear on most/all pages and should be updated globally:

| Image File | Current Alt | Recommended Alt |
|------------|-------------|-----------------|
| `Illustratie---A.-Nobel--Zn---Schip.webp` | `""` | "A. Nobel & Zn scheepsilllustratie logo" |
| `Icon---Flag---The-Netherlands.webp` | `""` | "Nederlandse vlag" or `""` (decorative) |
| `Icon---Flag---United-Kingdom.webp` | `""` | "Britse vlag" or `""` (decorative) |
| `Contact-Image-1.webp` | `""` | "[Name] - Verkoop contactpersoon" |
| `Contact-Image-2.webp` | `""` | "[Name] - Klantenservice contactpersoon" |
| `logo---Baldwin-Filters.webp` | `""` | "Baldwin Filters partner logo" |
| `player-placeholder.jpg` | `""` | "Video afspelen" (or page-specific) |
| `Foto---De-oprichter-in-een-verkoopgesprek.webp` | `""` | "De oprichter van A. Nobel & Zn in gesprek" |
| `Foto---Medewerker-van-Anobel-achter-de-computer.webp` | `""` | "Medewerker van A. Nobel & Zn achter de computer" |
| `Foto---Anobel-webshop-op-Macbook-op-oranje-plateau.webp` | `""` | "A. Nobel webshop interface op MacBook" |
| `Foto---Kantoor-en-haven-van-Anobel.webp` | `""` | "Kantoor en haven van A. Nobel & Zn" |

---

## Verification Checklist

After making changes, verify:

- [ ] All content images have descriptive alt text
- [ ] Decorative images have empty alt (`alt=""`)
- [ ] Alt text is in the same language as the page
- [ ] No alt text exceeds 125 characters
- [ ] CMS-bound images have alt text fields populated
- [ ] Product images include product names
- [ ] Team photos include names and roles
- [ ] Logo has consistent alt text across pages
- [ ] Run accessibility checker to verify changes

---

## Related Resources

- [Webflow Alt Text Documentation](https://university.webflow.com/lesson/image-element#alt-text)
- [W3C Alt Text Decision Tree](https://www.w3.org/WAI/tutorials/images/decision-tree/)
- [WCAG 2.1 Image Requirements](https://www.w3.org/WAI/WCAG21/quickref/#non-text-content)
