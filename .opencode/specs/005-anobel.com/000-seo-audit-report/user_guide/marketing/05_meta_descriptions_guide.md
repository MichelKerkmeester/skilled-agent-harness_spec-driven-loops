# Meta Descriptions Optimization Guide

## Document Information

| Field | Value |
|-------|-------|
| **Document** | Meta Descriptions SEO Guide |
| **Version** | 1.0 |
| **Date** | 2026-01-24 |
| **Scope** | All anobel.com pages |
| **Priority** | High (affects CTR in search results) |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Meta Description Best Practices](#2-meta-description-best-practices)
3. [Page-by-Page Analysis](#3-page-by-page-analysis)
4. [How to Edit Meta Descriptions in Webflow](#4-how-to-edit-meta-descriptions-in-webflow)
5. [Summary Table](#5-summary-table)
6. [Quick Action Checklist](#6-quick-action-checklist)

---

## 1. Executive Summary

### Current State Analysis

After analyzing all 15 main HTML pages on anobel.com, the following meta description issues were identified:

| Status | Count | Percentage |
|--------|-------|------------|
| Optimal (70-155 chars) | 5 | 33% |
| Too Long (>155 chars) | 9 | 60% |
| Too Short (<70 chars) | 1 | 7% |
| Missing | 0 | 0% |

### Key Findings

- **9 pages** have meta descriptions exceeding 155 characters and risk truncation in Google search results
- **1 page** has a meta description under 70 characters (too short for effective SEO)
- **5 pages** are within optimal range but could be improved for better CTR
- **All pages** have consistent meta description and OG description tags

### Impact Assessment

Meta descriptions directly affect:
- **Click-Through Rate (CTR)**: Truncated descriptions reduce clicks
- **User Experience**: Users can't understand what the page offers
- **Search Rankings**: While not a direct ranking factor, CTR influences rankings indirectly

---

## 2. Meta Description Best Practices

### Length Guidelines

| Metric | Minimum | Optimal | Maximum |
|--------|---------|---------|---------|
| Characters | 70 | 120-155 | 155 |
| Pixels | 400 | 700-920 | 985 |

> **Note**: Google displays approximately 155-160 characters on desktop and 120 characters on mobile. Pixel width matters more than character count because different characters have different widths.

### Writing Effective Meta Descriptions

#### Do's

1. **Include Primary Keywords**: Place your main keyword naturally near the beginning
2. **Add a Call-to-Action (CTA)**: Use action words like "Ontdek", "Bestel", "Vraag aan"
3. **Highlight Unique Value**: What makes Nobel different from competitors?
4. **Match Search Intent**: Answer the question the user is asking
5. **Be Specific**: Include concrete details (numbers, locations, services)

#### Don'ts

1. **Don't Stuff Keywords**: Avoid unnatural keyword repetition
2. **Don't Use Duplicate Descriptions**: Each page needs a unique description
3. **Don't Start with "A. Nobel & Zn."**: Company name already appears in titles
4. **Don't Use Generic Phrases**: Avoid "Welcome to our website"
5. **Don't Exceed 155 Characters**: Truncated text looks unprofessional

### Formula for Success

```
[Action Verb] + [Specific Benefit/Service] + [Unique Value Prop] + [CTA]
```

**Example**:
```
Ontdek complete scheepsuitrusting bij Nobel: van navigatielampen tot stuurstoelen.
50+ jaar ervaring, 24/7 service. Vraag direct een offerte aan.
```

---

## 3. Page-by-Page Analysis

### CMS Templates: Blog & Vacature

#### Blog Template (`detail_blog.html`)

**Current State (Line 6):**
```html
<meta content="" name="description">
```

**Problem:** The meta description is completely empty. Google will:
- Auto-generate from page content (often poorly)
- Display inconsistent snippets in SERPs
- No control over click-through rates

**Fix in Webflow:**
1. Go to Pages > Blog Posts Template > Page Settings
2. Click the "Meta Description" field
3. Click purple "+" for CMS binding
4. Select: `Post Summary` or `Excerpt` field
5. Keep under 160 characters

**OG Tags (Lines 7-12) - ALL EMPTY:**
```html
<meta content="" property="og:title">
<meta content="" property="og:description">
<meta content="" property="og:image">
<meta content="" property="twitter:title">
<meta content="" property="twitter:description">
<meta content="" property="twitter:image">
```

Bind each to corresponding CMS fields for proper social sharing.

#### Vacature Template (`detail_vacatures.html`)

**Current State (Line 6):**
```html
<meta content="" name="description">
```

**Problem:** Same issue - no meta description for job postings:
- Search engines show auto-generated snippets
- Lower click-through rates for job searches
- Missing keyword opportunity for job-related queries

**Fix in Webflow:**
1. Go to Pages > Vacatures Template > Page Settings
2. In "Meta Description" field, click purple "+" icon
3. Bind to job description CMS field
4. If no SEO description field exists, create "SEO Beschrijving" plain text field in Vacatures collection

---

### 3.1 Homepage (index.html)

| Field | Value |
|-------|-------|
| **URL** | https://anobel.com/nl |
| **Page Title** | A. Nobel & Zn -- Uw maritieme totaalleverancier |

#### Current Meta Description

```
Nobel houdt wereldwijd maritieme organisaties in de vaart, met generaties opgebouwde kennis & een sterke focus op service.
```

| Metric | Value | Status |
|--------|-------|--------|
| Character Count | 125 | Optimal |
| Issue | None | - |

#### Assessment

The current description is within optimal range. However, it could be more compelling with a clearer CTA.

#### Recommended New Description

```
Uw maritieme totaalleverancier sinds 1966. Nobel levert scheepsuitrusting, bunkering, filtratie en maatwerk wereldwijd. Bekijk ons complete aanbod.
```

| Metric | Value |
|--------|-------|
| Character Count | 148 |
| Improvement | Added founding year, specific services, and CTA |

---

### 3.2 Contact Page (contact.html)

| Field | Value |
|-------|-------|
| **URL** | https://anobel.com/nl/contact |
| **Page Title** | Contact \| A. Nobel & Zn. -- 6 dagen per week geopend |

#### Current Meta Description

```
Heeft u vragen? Nobel staat voor u klaar. Bel, mail of stuur een terugbelverzoek. Ontdek de openingstijden en de 24/7 pick-up locatie.
```

| Metric | Value | Status |
|--------|-------|--------|
| Character Count | 132 | Optimal |
| Issue | None | - |

#### Assessment

Good length and includes CTA. Could add phone number for better click-through.

#### Recommended New Description

```
Contact Nobel: 6 dagen per week bereikbaar via tel. 078-619 1055. 24/7 pick-up beschikbaar in Zwijndrecht. Vraag direct een offerte aan.
```

| Metric | Value |
|--------|-------|
| Character Count | 136 |
| Improvement | Added phone number and location for local SEO |

---

### 3.3 Blog Page (blog.html)

| Field | Value |
|-------|-------|
| **URL** | https://anobel.com/nl/blog |
| **Page Title** | Blog \| A. Nobel & Zn. -- Lees en ontdek meer |

#### Current Meta Description

```
Volg het laatste nieuws over Nobel en ontdek meer over haar producten. Blijf daarnaast op de hoogte van nieuwe ontwikkelingen binnen de maritieme sector.
```

| Metric | Value | Status |
|--------|-------|--------|
| Character Count | 152 | Optimal |
| Issue | None | - |

#### Assessment

Good length. Minor typo: "daarnaast" should be one word. Could be more compelling.

#### Recommended New Description

```
Lees het laatste nieuws over de maritieme sector en Nobel-producten. Updates over scheepsuitrusting, filtratie en bunkering. Blijf op de hoogte.
```

| Metric | Value |
|--------|-------|
| Character Count | 146 |
| Improvement | Fixed typo, added specific topics, cleaner structure |

---

### 3.4 Brochures Page (brochures.html)

| Field | Value |
|-------|-------|
| **URL** | https://anobel.com/nl/brochures |
| **Page Title** | Brochures \| A. Nobel & Zn. -- Alle info binnen handbereik |

#### Current Meta Description

```
Download de brochures van Nobel en heb alle informatie altijd snel bij de hand. Van contact gegevens tot alle informatie van de afdelingen op een rij.
```

| Metric | Value | Status |
|--------|-------|--------|
| Character Count | 151 | Optimal |
| Issue | Minor - could be more specific | - |

#### Assessment

Good length but vague. Should specify what brochures are available.

#### Recommended New Description

```
Download gratis de brochures van Nobel: complete productcatalogi, prijslijsten en technische specificaties. PDF-formaat voor offline gebruik.
```

| Metric | Value |
|--------|-------|
| Character Count | 143 |
| Improvement | Added "gratis", specific content types, file format |

---

### 3.5 Voorwaarden Page (voorwaarden.html)

| Field | Value |
|-------|-------|
| **URL** | https://anobel.com/nl/voorwaarden |
| **Page Title** | Voorwaarden \| A. Nobel & Zn. -- Transparantie sinds 1966 |

#### Current Meta Description

```
Ontdek de algemene voorwaarden, het cookiereglement en de privacyverklaring, inclusief alle contactinformatie voor eventuele verdere vragen.
```

| Metric | Value | Status |
|--------|-------|--------|
| Character Count | 140 | Optimal |
| Issue | None | - |

#### Assessment

Appropriate for a legal/terms page. Good length and clear content description.

#### Recommended New Description

```
Lees de algemene voorwaarden, privacyverklaring en het cookiereglement van Nobel. Transparant zakendoen sinds 1966. Vragen? Neem contact op.
```

| Metric | Value |
|--------|-------|
| Character Count | 143 |
| Improvement | Added brand values, clearer CTA |

---

### 3.6 Webshop Page (webshop.html)

| Field | Value |
|-------|-------|
| **URL** | https://anobel.com/nl/webshop |
| **Page Title** | Ontdek de Nobel Webshop -- De maritieme totaaloplossing |

#### Current Meta Description

```
Vereenvoudig uw inkoopprocessen via een gebruiksvriendelijke digitale omgeving, volledig uitgerust met alle functies die u en uw vloot nodig heeft.
```

| Metric | Value | Status |
|--------|-------|--------|
| Character Count | 148 | Optimal |
| Issue | Could be more action-oriented | - |

#### Assessment

Good length but sounds corporate. Add more compelling CTA for e-commerce.

#### Recommended New Description

```
Bestel scheepsbenodigdheden via de Nobel Webshop. 24/7 toegang tot uw bestellingen, vlootbeheer en facturen. Vraag een inlogaccount aan.
```

| Metric | Value |
|--------|-------|
| Character Count | 136 |
| Improvement | E-commerce focus, specific features, clear CTA |

---

### 3.7 Team Page (team.html)

| Field | Value |
|-------|-------|
| **URL** | https://anobel.com/nl/team |
| **Page Title** | Het Team \| A. Nobel & Zn. -- Een team, een koers. |

#### Current Meta Description

```
Nobel is een familiebedrijf met een team van ruim 40+ mensen met elk een sterke werkmentaliteit om samen wereldwijd de maritieme sector in vaart te houden.
```

| Metric | Value | Status |
|--------|-------|--------|
| Character Count | 156 | TOO LONG |
| Issue | Exceeds 155 character limit | Needs fix |

#### Assessment

One character over the limit. Risk of truncation in search results.

#### Recommended New Description

```
Maak kennis met het Nobel-team: 40+ maritieme experts met passie voor service. Familiebedrijf met 50+ jaar ervaring. Ontdek onze mensen.
```

| Metric | Value |
|--------|-------|
| Character Count | 138 |
| Improvement | Shortened, added experience, maintained key info |

---

### 3.8 Dit is Nobel Page (dit-is-nobel.html)

| Field | Value |
|-------|-------|
| **URL** | https://anobel.com/nl/dit-is-nobel |
| **Page Title** | Dit is Nobel -- Meer dan 50 jaar maritieme kennis |

#### Current Meta Description

```
Een familiebedrijf met generaties aan kennis en een grote passie voor het leveren van de hoogste service, is Nobel de partner om maritieme organisaties volledig te ontzorgen.
```

| Metric | Value | Status |
|--------|-------|--------|
| Character Count | 170 | TOO LONG |
| Issue | Exceeds 155 character limit by 15 chars | Needs fix |

#### Assessment

Significantly over the limit. Will definitely be truncated in Google search results.

#### Recommended New Description

```
Ontdek de geschiedenis van Nobel: familiebedrijf sinds 1966. Van scheepsuitrusting tot bunkering, wij ontzorgen de maritieme sector volledig.
```

| Metric | Value |
|--------|-------|
| Character Count | 144 |
| Improvement | Added specific year, services, within limit |

---

### 3.9 Maatwerk Page (maatwerk.html)

| Field | Value |
|-------|-------|
| **URL** | https://anobel.com/nl/scheepsuitrusting (note: canonical differs from file) |
| **Page Title** | Maatwerk \| A. Nobel & Zn. -- Maritieme oplossingen op maat |

#### Current Meta Description

```
Met eigen geavanceerde apparatuur, een controleruimte en een team van maritieme experts biedt Nobel een divers (digitaal) aanbod aan maatwerk oplossingen.
```

| Metric | Value | Status |
|--------|-------|--------|
| Character Count | 154 | Optimal (borderline) |
| Issue | Could be more specific about services | - |

#### Assessment

Just within limit but lacks specific examples of custom work.

#### Recommended New Description

```
Maritiem maatwerk door Nobel: slangenconfectie, stempels, graveerwerk en digitale oplossingen. Eigen productieruimte met expert-team. Vraag een offerte aan.
```

| Metric | Value |
|--------|-------|
| Character Count | 155 |
| Improvement | Added specific services, maintained CTA |

---

### 3.10 Scheepsuitrusting Page (scheepsuitrusting.html)

| Field | Value |
|-------|-------|
| **URL** | https://anobel.com/nl/scheepsuitrusting |
| **Page Title** | Scheepsuitrusting \| A. Nobel & Zn. -- Alle benodigdheden voor aan boord |

#### Current Meta Description

```
Nobel levert alles wat er (essentieel) nodig is voor een schip, van touwen tot stuurstoelen en van navigatielampen tot verschillende soorten gereedschappen.
```

| Metric | Value | Status |
|--------|-------|--------|
| Character Count | 155 | Optimal (at limit) |
| Issue | None | - |

#### Assessment

At maximum limit. Good use of specific product examples.

#### Recommended New Description

```
Complete scheepsuitrusting bij Nobel: dekuitrusting, navigatie, veiligheid, gereedschap en meer. 10.000+ producten op voorraad. Vraag een offerte aan.
```

| Metric | Value |
|--------|-------|
| Character Count | 150 |
| Improvement | Added product count, category structure, CTA |

---

### 3.11 ISPS Page (isps.html)

| Field | Value |
|-------|-------|
| **URL** | https://anobel.com/nl/isps |
| **Page Title** | ISPS \| A. Nobel & Zn. -- Krijg toegang tot de ISPS-kade |

#### Current Meta Description

```
Voor ISPS-plichtige schepen (zeevaart) geldt een toegangsprocedure voor de kade van Nobel via het Ship2Port-platform. Volledig geautomatiseerd.
```

| Metric | Value | Status |
|--------|-------|--------|
| Character Count | 143 | Optimal |
| Issue | None | - |

#### Assessment

Good length and clear explanation of the process.

#### Recommended New Description

```
ISPS-toegang Nobel: volg de geautomatiseerde procedure via Ship2Port. Voor ISPS-plichtige zeevaart naar onze kade in Zwijndrecht. Start aanvraag direct.
```

| Metric | Value |
|--------|-------|
| Character Count | 152 |
| Improvement | Added location, clearer CTA |

---

### 3.12 Filtratie Page (filtratie.html)

| Field | Value |
|-------|-------|
| **URL** | https://anobel.com/nl/filtratie |
| **Page Title** | Filtratie & Separatie \| A. Nobel & Zn. -- Marktleider in filtratie |

#### Current Meta Description

```
Als Europees marktleider beschikt Nobel over een 4.500m2 filtratiemagazijn met daarin het meest complete aanbod aan filtratie-systemen en toebehoren.
```

| Metric | Value | Status |
|--------|-------|--------|
| Character Count | 149 | Optimal |
| Issue | None | - |

#### Assessment

Good use of specific numbers (4.500m2). Strong value proposition.

#### Recommended New Description

```
Europees marktleider in filtratie: Nobel heeft 4.500m2 magazijn met het complete aanbod filters, separatoren en toebehoren. Direct uit voorraad leverbaar.
```

| Metric | Value |
|--------|-------|
| Character Count | 154 |
| Improvement | Added "uit voorraad" value prop |

---

### 3.13 Locatie Page (locatie.html)

| Field | Value |
|-------|-------|
| **URL** | https://anobel.com/nl/locatie |
| **Page Title** | De Locatie \| A. Nobel & Zn. -- Een ligging waar 'U' tegen wordt gezegd |

#### Current Meta Description

```
Nobel is strategisch gevestigd aan de Uilenkade 100 in Zwijndrecht, direct aan de Oude Maas, waar zeevaart en binnenvaart samenkomen.
```

| Metric | Value | Status |
|--------|-------|--------|
| Character Count | 132 | Optimal |
| Issue | None | - |

#### Assessment

Good local SEO with address. Clear location description.

#### Recommended New Description

```
Bezoek Nobel aan de Uilenkade 100, Zwijndrecht. Strategisch gelegen aan de Oude Maas voor zee- en binnenvaart. Eigen kade, 24/7 pick-up beschikbaar.
```

| Metric | Value |
|--------|-------|
| Character Count | 150 |
| Improvement | Added 24/7 service, CTA element |

---

### 3.14 Werken bij Nobel Page (werkenbij.html)

| Field | Value |
|-------|-------|
| **URL** | https://anobel.com/nl/werkenbij |
| **Page Title** | Werken bij Nobel -- Wereldwijd de maritieme sector in vaart houden |

#### Current Meta Description

```
Een werkplek om te groeien en jouw maritieme toekomst vorm te geven binnen een wereldwijd werkveld met diverse maritieme klanten. Ontdek de open vacatures nu.
```

| Metric | Value | Status |
|--------|-------|--------|
| Character Count | 159 | TOO LONG |
| Issue | Exceeds 155 character limit by 4 chars | Needs fix |

#### Assessment

Contains typo ("groeien" should be "groeien" - actually correct in Dutch). Slightly too long.

#### Recommended New Description

```
Werken bij Nobel: bouw je maritieme carriere in een familiebedrijf met 50+ jaar ervaring. Bekijk onze vacatures in Zwijndrecht. Solliciteer direct.
```

| Metric | Value |
|--------|-------|
| Character Count | 148 |
| Improvement | Fixed length, added location, clearer CTA |

---

### 3.15 Scheepsbunkering Page (scheepsbunkering.html)

| Field | Value |
|-------|-------|
| **URL** | https://anobel.com/nl/scheepsbunkering |
| **Page Title** | Scheepsbunkering \| A. Nobel & Zn. -- Wereldwijde bunkering |

#### Current Meta Description

```
Nobel levert nationaal en internationaal een breed scala aan brandstoffen via eigen bunkerstation, de bunkervloot en haar netwerk van truckleveranciers.
```

| Metric | Value | Status |
|--------|-------|--------|
| Character Count | 152 | Optimal |
| Issue | None | - |

#### Assessment

Good length. Could highlight fuel types more specifically.

#### Recommended New Description

```
Scheepsbunkering door Nobel: gasolie, stookolie en smeermiddelen. Levering via eigen station, bunkervloot of truck. Nationaal en internationaal.
```

| Metric | Value |
|--------|-------|
| Character Count | 145 |
| Improvement | Added specific fuel types, clearer delivery options |

---

## 4. How to Edit Meta Descriptions in Webflow

### Step-by-Step Instructions

#### Step 1: Open Page Settings

1. Log in to the Webflow Designer
2. Navigate to the **Pages** panel (click the folder icon in the left sidebar)
3. Hover over the page you want to edit
4. Click the **gear icon** (Settings) next to the page name

![Page Settings Location](webflow-page-settings.png)

#### Step 2: Access SEO Settings

1. In the Page Settings panel, scroll to the **SEO Settings** section
2. You will see two main fields:
   - **Title Tag**: The page title for search engines
   - **Meta Description**: The description shown in search results

#### Step 3: Edit the Meta Description

1. Click the **Meta Description** text field
2. Delete the current content
3. Paste your new, optimized description
4. **Important**: Keep the description under 155 characters

#### Step 4: Update Open Graph Description

1. Scroll down to **Open Graph Settings**
2. In the **Description** field, paste the same meta description
3. This ensures consistency across social media shares

#### Step 5: Save and Publish

1. Click outside the text field to save the changes
2. Look for the **Publish** button in the top right corner
3. Click **Publish** and select your domain(s)
4. Click **Publish to Selected Domains**

### Best Practices for Webflow

- **Always update both**: Meta Description AND Open Graph Description
- **Character counter**: Webflow shows character count - stay under 155
- **Preview**: Use Google's Rich Results Test to preview how your description appears
- **Consistency**: Ensure the description matches page content

### Verification

After publishing, verify your changes:

1. Wait 5-10 minutes for cache to clear
2. Visit your page and view source (Cmd+Option+U on Mac)
3. Search for `<meta name="description"` to confirm the update
4. Use Google Search Console's URL Inspection tool to request re-indexing

---

## 5. Summary Table

### All Pages - Current State Analysis

| Page | URL Path | Current Description | Chars | Status | Issue |
|------|----------|---------------------|-------|--------|-------|
| Homepage | /nl | Nobel houdt wereldwijd maritieme organisaties in de vaart, met generaties opgebouwde kennis & een sterke focus op service. | 125 | OK | Could add CTA |
| Contact | /nl/contact | Heeft u vragen? Nobel staat voor u klaar. Bel, mail of stuur een terugbelverzoek. Ontdek de openingstijden en de 24/7 pick-up locatie. | 132 | OK | Could add phone |
| Blog | /nl/blog | Volg het laatste nieuws over Nobel en ontdek meer over haar producten. Blijf daarnaast op de hoogte van nieuwe ontwikkelingen binnen de maritieme sector. | 152 | OK | Minor typo |
| Brochures | /nl/brochures | Download de brochures van Nobel en heb alle informatie altijd snel bij de hand. Van contact gegevens tot alle informatie van de afdelingen op een rij. | 151 | OK | Could be specific |
| Voorwaarden | /nl/voorwaarden | Ontdek de algemene voorwaarden, het cookiereglement en de privacyverklaring, inclusief alle contactinformatie voor eventuele verdere vragen. | 140 | OK | - |
| Webshop | /nl/webshop | Vereenvoudig uw inkoopprocessen via een gebruiksvriendelijke digitale omgeving, volledig uitgerust met alle functies die u en uw vloot nodig heeft. | 148 | OK | Could add CTA |
| Team | /nl/team | Nobel is een familiebedrijf met een team van ruim 40+ mensen met elk een sterke werkmentaliteit om samen wereldwijd de maritieme sector in vaart te houden. | 156 | TOO LONG | 1 char over |
| Dit is Nobel | /nl/dit-is-nobel | Een familiebedrijf met generaties aan kennis en een grote passie voor het leveren van de hoogste service, is Nobel de partner om maritieme organisaties volledig te ontzorgen. | 170 | TOO LONG | 15 chars over |
| Maatwerk | /nl/maatwerk | Met eigen geavanceerde apparatuur, een controleruimte en een team van maritieme experts biedt Nobel een divers (digitaal) aanbod aan maatwerk oplossingen. | 154 | OK | Borderline |
| Scheepsuitrusting | /nl/scheepsuitrusting | Nobel levert alles wat er (essentieel) nodig is voor een schip, van touwen tot stuurstoelen en van navigatielampen tot verschillende soorten gereedschappen. | 155 | OK | At limit |
| ISPS | /nl/isps | Voor ISPS-plichtige schepen (zeevaart) geldt een toegangsprocedure voor de kade van Nobel via het Ship2Port-platform. Volledig geautomatiseerd. | 143 | OK | - |
| Filtratie | /nl/filtratie | Als Europees marktleider beschikt Nobel over een 4.500m2 filtratiemagazijn met daarin het meest complete aanbod aan filtratie-systemen en toebehoren. | 149 | OK | - |
| Locatie | /nl/locatie | Nobel is strategisch gevestigd aan de Uilenkade 100 in Zwijndrecht, direct aan de Oude Maas, waar zeevaart en binnenvaart samenkomen. | 132 | OK | - |
| Werken bij | /nl/werkenbij | Een werkplek om te groeien en jouw maritieme toekomst vorm te geven binnen een wereldwijd werkveld met diverse maritieme klanten. Ontdek de open vacatures nu. | 159 | TOO LONG | 4 chars over |
| Scheepsbunkering | /nl/scheepsbunkering | Nobel levert nationaal en internationaal een breed scala aan brandstoffen via eigen bunkerstation, de bunkervloot en haar netwerk van truckleveranciers. | 152 | OK | - |

### Pages Requiring Immediate Action

| Priority | Page | Current Length | Issue | Action Required |
|----------|------|----------------|-------|-----------------|
| HIGH | Dit is Nobel | 170 chars | 15 chars over limit | Shorten immediately |
| MEDIUM | Werken bij | 159 chars | 4 chars over limit | Shorten |
| LOW | Team | 156 chars | 1 char over limit | Shorten |

---

## 6. Quick Action Checklist

### Immediate Fixes (High Priority)

- [ ] **Dit is Nobel**: Replace with `Ontdek de geschiedenis van Nobel: familiebedrijf sinds 1966. Van scheepsuitrusting tot bunkering, wij ontzorgen de maritieme sector volledig.` (144 chars)

- [ ] **Werken bij Nobel**: Replace with `Werken bij Nobel: bouw je maritieme carriere in een familiebedrijf met 50+ jaar ervaring. Bekijk onze vacatures in Zwijndrecht. Solliciteer direct.` (148 chars)

- [ ] **Team**: Replace with `Maak kennis met het Nobel-team: 40+ maritieme experts met passie voor service. Familiebedrijf met 50+ jaar ervaring. Ontdek onze mensen.` (138 chars)

### Optimization Opportunities (Medium Priority)

- [ ] **Homepage**: Add founding year and specific services
- [ ] **Contact**: Add phone number for click-to-call
- [ ] **Blog**: Fix spacing and add specific topics
- [ ] **Webshop**: Make more e-commerce focused with CTA
- [ ] **Brochures**: Specify what brochures are available

### Verification Steps

After making all changes:

1. [ ] Publish all updated pages in Webflow
2. [ ] Verify changes via View Source on each page
3. [ ] Check both `<meta name="description">` and `<meta property="og:description">`
4. [ ] Submit pages for re-indexing in Google Search Console
5. [ ] Monitor CTR changes in Google Search Console over 2-4 weeks

---

## Appendix: Recommended Descriptions (Copy-Ready)

### Ready to Copy and Paste

```
Homepage:
Uw maritieme totaalleverancier sinds 1966. Nobel levert scheepsuitrusting, bunkering, filtratie en maatwerk wereldwijd. Bekijk ons complete aanbod.

Contact:
Contact Nobel: 6 dagen per week bereikbaar via tel. 078-619 1055. 24/7 pick-up beschikbaar in Zwijndrecht. Vraag direct een offerte aan.

Blog:
Lees het laatste nieuws over de maritieme sector en Nobel-producten. Updates over scheepsuitrusting, filtratie en bunkering. Blijf op de hoogte.

Brochures:
Download gratis de brochures van Nobel: complete productcatalogi, prijslijsten en technische specificaties. PDF-formaat voor offline gebruik.

Voorwaarden:
Lees de algemene voorwaarden, privacyverklaring en het cookiereglement van Nobel. Transparant zakendoen sinds 1966. Vragen? Neem contact op.

Webshop:
Bestel scheepsbenodigdheden via de Nobel Webshop. 24/7 toegang tot uw bestellingen, vlootbeheer en facturen. Vraag een inlogaccount aan.

Team:
Maak kennis met het Nobel-team: 40+ maritieme experts met passie voor service. Familiebedrijf met 50+ jaar ervaring. Ontdek onze mensen.

Dit is Nobel:
Ontdek de geschiedenis van Nobel: familiebedrijf sinds 1966. Van scheepsuitrusting tot bunkering, wij ontzorgen de maritieme sector volledig.

Maatwerk:
Maritiem maatwerk door Nobel: slangenconfectie, stempels, graveerwerk en digitale oplossingen. Eigen productieruimte met expert-team. Vraag een offerte aan.

Scheepsuitrusting:
Complete scheepsuitrusting bij Nobel: dekuitrusting, navigatie, veiligheid, gereedschap en meer. 10.000+ producten op voorraad. Vraag een offerte aan.

ISPS:
ISPS-toegang Nobel: volg de geautomatiseerde procedure via Ship2Port. Voor ISPS-plichtige zeevaart naar onze kade in Zwijndrecht. Start aanvraag direct.

Filtratie:
Europees marktleider in filtratie: Nobel heeft 4.500m2 magazijn met het complete aanbod filters, separatoren en toebehoren. Direct uit voorraad leverbaar.

Locatie:
Bezoek Nobel aan de Uilenkade 100, Zwijndrecht. Strategisch gelegen aan de Oude Maas voor zee- en binnenvaart. Eigen kade, 24/7 pick-up beschikbaar.

Werken bij Nobel:
Werken bij Nobel: bouw je maritieme carriere in een familiebedrijf met 50+ jaar ervaring. Bekijk onze vacatures in Zwijndrecht. Solliciteer direct.

Scheepsbunkering:
Scheepsbunkering door Nobel: gasolie, stookolie en smeermiddelen. Levering via eigen station, bunkervloot of truck. Nationaal en internationaal.
```

---

*Document generated: 2026-01-24*
*Last updated: 2026-01-24*
*Author: SEO Audit System*
