# Heading Semantic Guide: Complete Site-Wide Reference

> Per-page heading tag recommendations for anobel.com.
> Generated from 10 parallel agent analyses of all Webflow-exported HTML pages.
> Each heading is assigned: **KEEP** | **CHANGE** | **CONVERT to text** | **REMOVE** | **POPULATE**

---

## Executive Summary

| Metric | Count |
|--------|-------|
| **Pages analyzed** | 18 (15 static + 2 CMS templates + 1 global) |
| **Total heading tags found** | ~210+ |
| **Empty headings (w-dyn-bind-empty)** | ~185 (88%) |
| **Headings with content** | ~25 (12%) |
| **Pages with empty H1** | 15 of 15 (in export; some populate via CMS at runtime) |
| **Dual-H2 anti-pattern instances** | ~20 across all pages |
| **H6 misuse (should be H2)** | 12 (blog + vacature templates) |

### Root Causes

| Root Cause | Impact | Fix Location |
|------------|--------|-------------|
| **Unpopulated CMS fields** | ~150+ empty headings | Webflow CMS Editor |
| **Dual-H2 pattern** (two sibling H2s for multi-line styling) | Doubles H2 count per section | Webflow Designer (change 2nd H2 to `<span>`) |
| **H6 for article subheadings** | Wrong hierarchy in blog/vacature | Webflow Designer (change H6 to H2) |
| **CMS Nest explosion** (homepage) | 146+ H2s from nested subpages | Webflow/Finsweet config |

### Three Systemic Fixes (Apply Once, Fix Everywhere)

1. **Dual-H2 to H2+span** -- Every CTA card and `heading has--span` wrapper uses two sibling `<h2>` tags. Change the 2nd to `<span>` in the Webflow component/symbol. Affects ~20 instances across all pages.

2. **H6 to H2 in CMS templates** -- Blog and vacature templates use `<h6>` for article section subheadings. Change to `<h2>` in the Webflow template. Affects 12 instances.

3. **Populate CMS heading fields** -- Every page uses CMS-bound headings that are empty. Fill them in Webflow CMS Editor. Affects ~150 headings.

---

## Quick Reference: All Pages

| Page | File | H1 | H2 | H3 | H4 | H6 | Empty | Critical Fix |
|------|------|----|----|----|----|-----|-------|-------------|
| **Home** | home.html | 1 (empty) | 7 (6 empty) | 1 | 0 | 0 | 7 | CMS Nest H2 explosion (146+ on live) |
| **Contact** | contact.html | 1 (empty) | 7 (all empty) | 1 | 0 | 0 | 8 | Populate H1 + all H2s |
| **Blog listing** | blog.html | 1 (empty) | 4 (3 empty) | 1 | 0 | 0 | 4 | Populate H1 |
| **Blog template** | blog_template.html | 1 (CMS) | 1 | 1 | 0 | 6 (all empty) | 7 | Change 6x H6 to H2 |
| **Werkenbij** | werken_bij.html | 1 (empty) | 12 (all empty) | 1 | 0 | 0 | 13 | Populate all + fix dual-H2s |
| **Vacature template** | vacature.html | 1 (CMS) | 3 (all empty) | 1 | 0 | 6 (all empty) | 10 | Change 6x H6 to H2 |
| **Bunkering** | d1_bunkering.html | 1 (empty) | 7 (all empty) | 1 | 0 | 0 | 8 | Populate H1 + section H2s |
| **Filtratie** | d2_filtratie.html | 1 (empty) | 7 (all empty) | 1 | 0 | 0 | 8 | Populate H1 + section H2s |
| **Uitrusting** | d3_uitrusting.html | 1 (empty) | 7 (all empty) | 1 | 0 | 0 | 8 | Populate H1 + section H2s |
| **Maatwerk** | d4_maatwerk.html | 1 (empty) | 10 (all empty) | 1 | 0 | 0 | 11 | Populate + fix canonical URL |
| **Webshop** | d5_webshop.html | 1 (empty) | 7 (5 empty) | 1 | 8 | 0 | 6 | H4 to H3 + populate H1 |
| **Dit is Nobel** | n1_dit_is_nobel.html | 1 (empty) | 10 (9 empty) | 1 | 0 | 0 | 10 | Replace duplicate H2 |
| **ISPS Kade** | n2_isps_kade.html | 1 (empty) | 10 (all empty) | 1 | 0 | 0 | 11 | Populate all |
| **De Locatie** | n3_de_locatie.html | 1 (empty) | 8 (all empty) | 1 | 0 | 0 | 9 | Populate all |
| **Het Team** | n4_het_team.html | 1 (empty) | 11 (all empty) | 1 | 0 | 0 | 12 | Populate + fix 5x dual-H2 |
| **Brochures** | n5_brochures.html | 1 (empty) | 15 (all empty) | 1 | 0 | 0 | 16 | Populate + fix 7x dual-H2 |
| **Voorwaarden** | voorwaarden.html | 1 (empty) | 0 | 1 | 0 | 60 (all empty) | 61 | Change H6 to H2 + populate |
| **Global** | global.html | 0 | 0 | 0 | 0 | 0 | 0 | No headings (scripts only) |

---

## Per-Page Heading Action Tables

### 1. Homepage (home.html / index.html)

**Source:** `src/0_html/home.html` (head/footer scripts only)
**Webflow:** `z_webflow_exported_code/index.html`
**Detailed guide:** `scratch/heading-guide-home.md`

| # | Current Tag | Content | Section | Action | Priority |
|---|------------|---------|---------|--------|----------|
| 1 | H1 | EMPTY | Hero | **POPULATE**: "Uw maritieme totaalleverancier." (verify CMS) | P0 |
| 2 | H2 | EMPTY | Home-A (CMS Nest) | **POPULATE** or **REMOVE** if CMS Nest provides content | P0 |
| 3 | H2 | "Alle expertise op een locatie." | Services Grid | **KEEP as H2** but make unique (not on dit-is-nobel too) | P1 |
| 4 | H2 | EMPTY | CTA Card line 1 | **POPULATE**: CTA heading via CMS | P1 |
| 5 | H2 | EMPTY | CTA Card line 2 | **CONVERT to `<span>`** (dual-H2 pattern) | P1 |
| 6 | H2 | EMPTY | Home-B (CMS Nest) | **POPULATE** or **REMOVE** | P0 |
| 7 | H2 | EMPTY | Home-C (CMS Nest) | **POPULATE** or **REMOVE** | P0 |
| 8 | H2 | EMPTY | Blog/Articles | **POPULATE**: "Blijf op de hoogte" | P1 |
| 9 | H3 | "Vragen? Nobel staat klaar." | Footer | **KEEP as H3** | -- |

**CRITICAL:** Live site renders 146+ H2 tags via Finsweet CMS Nest. Nested subpage headings should be demoted to H3 on the homepage context.

**Target hierarchy:**
```
H1: Uw maritieme totaalleverancier.
 +-- H2: [Home-A section title]
 +-- H2: Alle expertise op een locatie. (services)
 +-- H2: [CTA text]
 +-- H2: [Home-B section title]
 +-- H2: [Home-C section title]
 +-- H2: Blijf op de hoogte (blog)
 +-- H3: Vragen? Nobel staat klaar. (footer)
```

---

### 2. Contact (contact.html)

**Detailed guide:** `scratch/heading-guide-contact.md`

| # | Current Tag | Content | Section | Action | Priority |
|---|------------|---------|---------|--------|----------|
| 1 | H1 | EMPTY | Hero | **POPULATE**: "Neem contact op met Nobel" | P0 |
| 2 | H2 | EMPTY | Contact cards | **POPULATE**: "Hoe kunt u ons bereiken" | P0 |
| 3 | H2 | EMPTY | Departments | **POPULATE**: "Onze afdelingen" | P1 |
| 4 | H2 | EMPTY | CTA line 1 | **POPULATE**: CTA text | P1 |
| 5 | H2 | EMPTY | CTA line 2 | **CONVERT to `<span>`** | P1 |
| 6 | H2 | EMPTY | Nobel section A | **POPULATE**: section heading | P1 |
| 7 | H2 | EMPTY | Contact form | **POPULATE**: "Stuur ons een bericht" | P0 |
| 8 | H2 | EMPTY | Contact side panel | **POPULATE**: "Contactgegevens" | P1 |
| 9 | H3 | "Vragen? Nobel staat klaar." | Footer | **KEEP as H3** | -- |

---

### 3. Blog Listing (blog.html)

**Detailed guide:** `scratch/heading-guide-blog.md`

| # | Current Tag | Content | Section | Action | Priority |
|---|------------|---------|---------|--------|----------|
| 1 | H1 | EMPTY | Hero | **POPULATE**: "Blog & Nieuws" | P0 |
| 2 | H2 | "Blog & Updates" | CMS list header (mobile) | **KEEP as H2** | -- |
| 3 | H2 | EMPTY | CTA line 1 | **POPULATE** via CMS | P1 |
| 4 | H2 | EMPTY | CTA line 2 | **CONVERT to `<span>`** | P1 |
| 5 | H2 | EMPTY | Nobel section | **POPULATE** via CMS | P1 |
| 6 | H3 | "Vragen? Nobel staat klaar." | Footer | **KEEP as H3** | -- |

---

### 4. Blog Template (detail_blog.html / cms/blog_template.html)

**Detailed guide:** `scratch/heading-guide-blog.md`

| # | Current Tag | Content | Section | Action | Priority |
|---|------------|---------|---------|--------|----------|
| 1 | H1 | EMPTY (CMS-filled at runtime) | Hero | **KEEP as H1** -- auto-populates with article title | -- |
| 2 | H6 | EMPTY | Article subheading 1 | **CHANGE to H2** | P0 |
| 3 | H6 | EMPTY | Article subheading 2 | **CHANGE to H2** | P0 |
| 4 | H6 | EMPTY | Article subheading 3 | **CHANGE to H2** | P0 |
| 5 | H6 | EMPTY | Article subheading 4 | **CHANGE to H2** | P0 |
| 6 | H6 | EMPTY | Article subheading 5 | **CHANGE to H2** | P0 |
| 7 | H6 | EMPTY | Article subheading 6 | **CHANGE to H2** | P0 |
| 8 | H2 | "Nobel houdt u op koers." | Related articles | **KEEP as H2** | -- |
| 9 | H3 | "Vragen? Nobel staat klaar." | Footer | **KEEP as H3** | -- |

---

### 5. Werkenbij / Careers (werken_bij.html / werkenbij.html)

**Detailed guide:** `scratch/heading-guide-careers.md`

| # | Current Tag | Content | Section | Action | Priority |
|---|------------|---------|---------|--------|----------|
| 1 | H1 | EMPTY | Hero | **POPULATE**: "Werken bij Nobel" | P0 |
| 2 | H2 | EMPTY | Vacancies listing | **POPULATE**: "Openstaande Vacatures" | P0 |
| 3 | H2 | EMPTY | CTA #1 line 1 | **POPULATE** via CMS | P1 |
| 4 | H2 | EMPTY | CTA #1 line 2 | **CONVERT to `<span>`** | P1 |
| 5 | H2 | EMPTY | General section (right) | **POPULATE**: "Waarom Werken bij Nobel" | P1 |
| 6 | H2 | EMPTY | General section (left) | **POPULATE**: "Wat Wij Bieden" | P1 |
| 7 | H2 | EMPTY | CTA #2 line 1 | **POPULATE** via CMS | P1 |
| 8 | H2 | EMPTY | CTA #2 line 2 | **CONVERT to `<span>`** | P1 |
| 9 | H2 | EMPTY | General section | **POPULATE**: "Onze Bedrijfscultuur" | P1 |
| 10 | H2 | EMPTY | Image grid overlay | **CONVERT to `<div>`** (decorative) | P2 |
| 11 | H2 | EMPTY | Contact form | **POPULATE**: "Solliciteer Direct" | P1 |
| 12 | H2 | EMPTY | Contact side panel | **POPULATE**: section heading | P1 |
| 13 | H3 | "Vragen? Nobel staat klaar." | Footer | **KEEP as H3** | -- |

---

### 6. Vacature Template (vacature.html / detail_vacatures.html)

**Detailed guide:** `scratch/heading-guide-careers.md`

| # | Current Tag | Content | Section | Action | Priority |
|---|------------|---------|---------|--------|----------|
| 1 | H1 | EMPTY (CMS-filled at runtime) | Hero | **KEEP as H1** -- auto-populates with job title | -- |
| 2 | H6 | EMPTY | Job detail section 1 | **CHANGE to H2** | P0 |
| 3 | H6 | EMPTY | Job detail section 2 | **CHANGE to H2** | P0 |
| 4 | H6 | EMPTY | Job detail section 3 | **CHANGE to H2** | P0 |
| 5 | H6 | EMPTY | Job detail section 4 | **CHANGE to H2** | P0 |
| 6 | H6 | EMPTY | Job detail section 5 | **CHANGE to H2** | P0 |
| 7 | H6 | EMPTY | Job detail section 6 | **CHANGE to H2** | P0 |
| 8 | H2 | EMPTY | CTA line 1 | **POPULATE** via CMS | P1 |
| 9 | H2 | EMPTY | CTA line 2 | **CONVERT to `<span>`** | P1 |
| 10 | H2 | EMPTY | Nobel section | **POPULATE** via CMS | P1 |
| 11 | H3 | "Vragen? Nobel staat klaar." | Footer | **KEEP as H3** | -- |

---

### 7. Scheepsbunkering (d1_bunkering.html / scheepsbunkering.html)

**Detailed guide:** `scratch/heading-guide-bunkering-filtratie.md`

| # | Current Tag | Content | Section | Action | Priority |
|---|------------|---------|---------|--------|----------|
| 1 | H1 | EMPTY | Hero | **POPULATE**: "Scheepsbunkering bij Nobel" | P0 |
| 2 | H2 | EMPTY | Bunkering-A (right) | **POPULATE**: "Bunkerstation Zwijndrecht" | P0 |
| 3 | H2 | EMPTY | Bunkering-B (left) | **POPULATE**: "Duurzame Brandstoffen" | P0 |
| 4 | H2 | EMPTY | Bunkering-C (right) | **POPULATE**: "350 Meter Kade" | P0 |
| 5 | H2 | EMPTY | CTA line 1 | **POPULATE** via CMS | P1 |
| 6 | H2 | EMPTY | CTA line 2 | **CONVERT to `<span>`** | P1 |
| 7 | H2 | EMPTY | Bunkering-D (right) | **POPULATE**: "Smeerolien & AdBlue" | P0 |
| 8 | H2 | EMPTY | Bunkering-E (left) | **POPULATE**: section heading | P1 |
| 9 | H3 | "Vragen? Nobel staat klaar." | Footer | **KEEP as H3** | -- |

---

### 8. Filtratie (d2_filtratie.html / filtratie.html)

**Detailed guide:** `scratch/heading-guide-bunkering-filtratie.md`

| # | Current Tag | Content | Section | Action | Priority |
|---|------------|---------|---------|--------|----------|
| 1 | H1 | EMPTY | Hero | **POPULATE**: "Filtratie & Separatie" | P0 |
| 2 | H2 | EMPTY | Filtratie-A (right) | **POPULATE**: "Marktleider in Filtratie" | P0 |
| 3 | H2 | EMPTY | Filtratie-B (left) | **POPULATE**: "Filters Direct van de Bron" | P0 |
| 4 | H2 | EMPTY | Filtratie-C (right) | **POPULATE**: "Grote Filtervoorraad" | P0 |
| 5 | H2 | EMPTY | CTA line 1 | **POPULATE** via CMS | P1 |
| 6 | H2 | EMPTY | CTA line 2 | **CONVERT to `<span>`** | P1 |
| 7 | H2 | EMPTY | Filtratie-D (right) | **POPULATE**: "Geautoriseerde Distributeur" | P0 |
| 8 | H2 | EMPTY | Filtratie-E (left) | **POPULATE**: section heading | P1 |
| 9 | H3 | "Vragen? Nobel staat klaar." | Footer | **KEEP as H3** | -- |

---

### 9. Scheepsuitrusting (d3_uitrusting.html / scheepsuitrusting.html)

**Detailed guide:** `scratch/heading-guide-uitrusting-maatwerk.md`

| # | Current Tag | Content | Section | Action | Priority |
|---|------------|---------|---------|--------|----------|
| 1 | H1 | EMPTY | Hero | **POPULATE**: "Scheepsuitrusting" | P0 |
| 2 | H2 | EMPTY | Section A-D (4 sections) | **POPULATE**: "Scheepsbenodigdheden", "Ons Assortiment", "Stickers & Labels", "Shop Uitrusting Online" | P0 |
| 3 | H2 | EMPTY | CTA line 1 | **POPULATE** via CMS | P1 |
| 4 | H2 | EMPTY | CTA line 2 | **CONVERT to `<span>`** | P1 |
| 5 | H3 | "Vragen? Nobel staat klaar." | Footer | **KEEP as H3** | -- |

**Target: 1x H1, 5x H2, 1x H3**

---

### 10. Maatwerk (d4_maatwerk.html / maatwerk.html)

**Detailed guide:** `scratch/heading-guide-uitrusting-maatwerk.md`

| # | Current Tag | Content | Section | Action | Priority |
|---|------------|---------|---------|--------|----------|
| 1 | H1 | EMPTY | Hero | **POPULATE**: "Maatwerk Oplossingen" | P0 |
| 2 | H2 | EMPTY | Sections A-G (7 sections) | **POPULATE**: "Assemblage & Reiniging", "Digitale Schema's", "Nieuwbouw Inventarissen", etc. | P0 |
| 3 | H2 | EMPTY | CTA line 1 | **POPULATE** via CMS | P1 |
| 4 | H2 | EMPTY | CTA line 2 | **CONVERT to `<span>`** | P1 |
| 5 | H3 | "Vragen? Nobel staat klaar." | Footer | **KEEP as H3** | -- |

**BONUS FINDING:** Maatwerk has a **wrong canonical URL** pointing to `/nl/scheepsuitrusting` instead of `/nl/maatwerk`. Fix in Webflow Page Settings.

**Target: 1x H1, 8x H2, 1x H3**

---

### 11. Webshop (d5_webshop.html / webshop.html)

**Detailed guide:** `scratch/heading-guide-webshop.md`

| # | Current Tag | Content | Section | Action | Priority |
|---|------------|---------|---------|--------|----------|
| 1 | H1 | EMPTY | Hero | **POPULATE**: "Nobel Webshop -- Uw Maritieme Inkoopplatform" | P0 |
| 2 | H2 | "Uw maritieme totaaloplossing." | Featured Functions | **KEEP as H2** (optionally improve to "De Functies van de Nobel Webshop") | P2 |
| 3 | H4 x6 | Feature card names | Bento Grid | **CHANGE to H3** (skips H3 level) | P2 |
| 4 | H2 | "Een systeem, vele mogelijkheden." | Pricing | **KEEP as H2** (optionally improve to "Webshop Abonnementen Vergelijken") | P2 |
| 5 | H4 x2 | "Basis" / "Nobel Pro" | Pricing Cards | **CHANGE to H3** | P2 |
| 6 | H2 | EMPTY | CTA line 1 | **POPULATE** via CMS | P1 |
| 7 | H2 | EMPTY | CTA line 2 | **CONVERT to `<span>`** | P1 |
| 8 | H2 | EMPTY | Nobel Section A | **POPULATE** via CMS | P1 |
| 9 | H2 | EMPTY | Nobel Section B | **POPULATE** via CMS | P1 |
| 10 | H3 | "Vragen? Nobel staat klaar." | Footer | **KEEP as H3** | -- |

**Note:** Page `lang="nl"` is correct. Dutch content is intentional, not a language mismatch.

---

### 12. Dit is Nobel (n1_dit_is_nobel.html / dit-is-nobel.html)

**Detailed guide:** `scratch/heading-guide-nobel-isps.md`

| # | Current Tag | Content | Section | Action | Priority |
|---|------------|---------|---------|--------|----------|
| 1 | H1 | EMPTY | Hero (video) | **POPULATE**: "Dit is Nobel" | P0 |
| 2 | H2 | EMPTY | Section 1 | **POPULATE**: "Meer dan 50 Jaar Maritieme Expertise" | P0 |
| 3 | H2 | EMPTY | CTA #1 line 1 | **POPULATE** via CMS | P1 |
| 4 | H2 | EMPTY | CTA #1 line 2 | **CONVERT to `<span>`** | P1 |
| 5 | H2 | "Alle expertise op een locatie." | Services Grid | **CHANGE text** to something unique (DUPLICATE of homepage) | P0 |
| 6 | H2 | EMPTY | Grid overlay | **CONVERT to `<div>`** (decorative, not a heading) | P2 |
| 7 | H2 | EMPTY | Section 2 | **POPULATE** via CMS | P1 |
| 8 | H2 | EMPTY | CTA #2 line 1 | **POPULATE** via CMS | P1 |
| 9 | H2 | EMPTY | CTA #2 line 2 | **CONVERT to `<span>`** | P1 |
| 10 | H2 | EMPTY | Section 3 | **POPULATE** via CMS | P1 |
| 11 | H3 | "Vragen? Nobel staat klaar." | Footer | **KEEP as H3** | -- |

---

### 13. ISPS Kade (n2_isps_kade.html / isps.html)

**Detailed guide:** `scratch/heading-guide-nobel-isps.md`

| # | Current Tag | Content | Section | Action | Priority |
|---|------------|---------|---------|--------|----------|
| 1 | H1 | EMPTY | Hero | **POPULATE**: "ISPS-Beveiligde Kade" | P0 |
| 2 | H2 | EMPTY | Sections A-E (5 sections) | **POPULATE**: "Toegang Aanvragen", "Hoe Het Werkt", "Beveiligingsvereisten", etc. | P0 |
| 3 | H2 | EMPTY | CTA line 1 | **POPULATE** via CMS | P1 |
| 4 | H2 | EMPTY | CTA line 2 | **CONVERT to `<span>`** | P1 |
| 5 | H2 | EMPTY | Additional sections | **POPULATE** via CMS | P1 |
| 6 | H3 | "Vragen? Nobel staat klaar." | Footer | **KEEP as H3** | -- |

---

### 14. De Locatie (n3_de_locatie.html / locatie.html)

**Detailed guide:** `scratch/heading-guide-locatie-team-brochures.md`

| # | Current Tag | Content | Section | Action | Priority |
|---|------------|---------|---------|--------|----------|
| 1 | H1 | EMPTY | Hero | **POPULATE**: "Onze Locatie in Zwijndrecht" | P0 |
| 2 | H2 | EMPTY | Content sections (5) | **POPULATE**: "Routebeschrijving", "Openingstijden", "Parkeerinformatie", etc. | P0 |
| 3 | H2 | EMPTY | CTA line 1 | **POPULATE** via CMS | P1 |
| 4 | H2 | EMPTY | CTA line 2 | **CONVERT to `<span>`** | P1 |
| 5 | H3 | "Vragen? Nobel staat klaar." | Footer | **KEEP as H3** | -- |

---

### 15. Het Team (n4_het_team.html / team.html)

**Detailed guide:** `scratch/heading-guide-locatie-team-brochures.md`

| # | Current Tag | Content | Section | Action | Priority |
|---|------------|---------|---------|--------|----------|
| 1 | H1 | EMPTY | Hero | **POPULATE**: "Het Nobel Team" | P0 |
| 2 | H2 x5 pairs (10 total) | ALL EMPTY | Department sections | **POPULATE 1st of each pair** + **CONVERT 2nd to `<span>`** | P0 |
| 3 | H2 | EMPTY | Additional section | **POPULATE**: "Werken bij Nobel" | P1 |
| 4 | H3 | "Vragen? Nobel staat klaar." | Footer | **KEEP as H3** | -- |

**Suggested H2 content per department:** "Team Filtratie & Separatie", "Team Scheepsbunkering", "Team Scheepsuitrusting", "Team Backoffice", "Team Management"

**Target: 1x H1, 6x H2, 1x H3** (down from 11 H2s after fixing 5x dual-H2 pairs)

---

### 16. Brochures (n5_brochures.html / brochures.html)

**Detailed guide:** `scratch/heading-guide-locatie-team-brochures.md`

| # | Current Tag | Content | Section | Action | Priority |
|---|------------|---------|---------|--------|----------|
| 1 | H1 | EMPTY | Hero | **POPULATE**: "Brochures & Downloads" | P0 |
| 2 | H2 x7 pairs (14 total) | ALL EMPTY | Brochure sections | **POPULATE 1st of each pair** + **CONVERT 2nd to `<span>`** | P0 |
| 3 | H2 | EMPTY | Additional section | **POPULATE** via CMS | P1 |
| 4 | H3 | "Vragen? Nobel staat klaar." | Footer | **KEEP as H3** | -- |

**Suggested H2 content:** "Brochure: Scheepsbunkering", "Brochure: Filtratie & Separatie", "Brochure: Scheepsuitrusting", "Brochure: De Nobel Webshop", "Brochure: ISPS-Kade", "Brochure: Werken bij Nobel", "Brochure: Nobel Algemeen"

**Target: 1x H1, 8x H2, 1x H3** (down from 15 H2s after fixing 7x dual-H2 pairs)

---

### 17. Voorwaarden (voorwaarden.html)

**Detailed guide:** `scratch/heading-guide-voorwaarden-global.md`

| # | Current Tag | Content | Section | Action | Priority |
|---|------------|---------|---------|--------|----------|
| 1 | H1 | EMPTY | Hero | **POPULATE**: "Algemene Voorwaarden" | P0 |
| 2 | H6 x60 | ALL EMPTY | Article sections | **CHANGE to H2** (article section headings) + **POPULATE** via CMS | P0 |
| 3 | H3 | "Vragen? Nobel staat klaar." | Footer | **KEEP as H3** | -- |

**NOTE:** 60 H6 tags is the highest misuse count on the site. These are CMS-bound article section headings that should be H2 or H3. Many should also be hidden when empty (Webflow conditional visibility).

---

### 18. Global Components (global.html)

**Detailed guide:** `scratch/heading-guide-voorwaarden-global.md`

The `global.html` source file contains **zero heading tags** -- only `<link>` preloads, `<script>` tags, and CSS injection code for the site-wide header/footer. All headings are defined in the Webflow Designer components, not in custom code.

**Site-wide heading note:** The H3 "Vragen? Nobel staat klaar." appears on every page's footer. This is appropriate as a consistent H3 across all pages.

---

### 19. Utility Pages (401, 404, search)

| Page | H1 | H2 | Action |
|------|----|----|--------|
| 401.html | None | "Protected Page" | **CHANGE H2 to H1** |
| 404.html | None | "Page Not Found" | **CHANGE H2 to H1** |
| search.html | "Search results" | None | **KEEP as H1** |

---

## Implementation Priority Matrix

### Phase 1: Critical (Week 1) -- Template-Level Fixes

These fixes apply once in Webflow Designer and propagate to all pages using the template/component:

| Fix | Scope | Pages Affected | Effort |
|-----|-------|---------------|--------|
| **Dual-H2 to H2+span** | CTA card component | All 15+ pages | 1 component edit |
| **H6 to H2** in blog template | CMS template | All blog posts | 1 template edit |
| **H6 to H2** in vacature template | CMS template | All vacatures | 1 template edit |
| **H6 to H2** in voorwaarden | Page template | 1 page | 1 template edit |

### Phase 2: High Priority (Week 2) -- CMS Content Population

| Fix | Scope | Effort |
|-----|-------|--------|
| **Populate all H1 fields** | 15 pages | 15 CMS edits |
| **Populate service page H2s** | 5 service pages | ~30 CMS edits |
| **Fix duplicate "Alle expertise op een locatie."** | dit-is-nobel.html | 1 CMS edit |
| **Fix maatwerk canonical URL** | maatwerk.html | 1 Page Settings edit |

### Phase 3: Medium Priority (Week 3) -- Remaining CMS Content

| Fix | Scope | Effort |
|-----|-------|--------|
| **Populate company page H2s** | nobel pages (5) | ~25 CMS edits |
| **Populate careers H2s** | werkenbij + vacature | ~10 CMS edits |
| **Populate contact H2s** | contact page | ~6 CMS edits |
| **Improve generic H2 text** | webshop (2 H2s) | 2 CMS edits |
| **Promote H4 to H3** on webshop | webshop bento grid + pricing | 8 tag changes |

### Phase 4: Verification (Week 4)

- [ ] Re-export Webflow HTML and verify heading counts
- [ ] Run SEO audit to confirm fixes
- [ ] Check live site with browser inspector
- [ ] Verify screen reader navigation

---

## Appendix: CMS Nest H2 Explosion (Homepage Critical Issue)

### Problem

The homepage uses Finsweet CMS Nest to pull collection items from service pages (bunkering, filtratie, etc.) into the homepage layout. Each nested CMS item brings its own headings, resulting in **146+ H2 tags** on the live homepage.

In the Webflow-exported HTML (`index.html`), only 7 H2 tags exist (6 empty). But on the live site, CMS Nest dynamically injects subpage content, multiplying the heading count dramatically.

### Why This Is Critical

- Google sees 146+ H2 tags on a single page -- no clear topic hierarchy
- Each H2 competes for keyword relevance, diluting all heading signals
- The "H2 Duplicate" audit finding (59 pages, 100%) is largely driven by this
- Screen readers present an unnavigable heading outline

### Root Cause

Finsweet CMS Nest renders collection items inline. When a subpage has `<h2>Service Title</h2>`, that H2 appears verbatim on the homepage. The homepage thus inherits every nested page's heading structure.

### Solution Options

**Option A: Demote nested headings to H3 (Recommended)**

In Webflow Designer, within the CMS Nest wrapper on the homepage:
1. Select the heading element that renders the nested item's title
2. Change it from H2 to H3 (Element Settings > Tag > H3)
3. This preserves visual styling while fixing semantic hierarchy

Expected result:
```
Homepage:
  H1: Uw maritieme totaalleverancier.
    H2: Scheepsbunkering (section title)
      H3: Duurzame bunkering (nested item)
      H3: On-site service (nested item)
    H2: Filtratie (section title)
      H3: Baldwin Filters (nested item)
```

**Option B: Use CSS class for visual H2, semantic Div**

If the nested content should not appear in the heading outline at all:
1. Change the nested heading tag to `<div>`
2. Apply the existing H2 CSS class for visual styling
3. The div will look like an H2 but not register as one

**Option C: Limit CMS Nest output**

In Finsweet CMS Nest configuration:
1. Limit the number of nested items rendered
2. Or use a different rendering mode that doesn't inject full heading structure

### Implementation Steps

1. Open Webflow Designer > Homepage
2. Locate the CMS Nest collection list wrapper
3. Inside the nested collection item template, find the heading element
4. Change its tag from H2 to H3 (or Div if appropriate)
5. Publish and verify on live site
6. Re-run heading audit to confirm count is manageable

### Expected Outcome

| Metric | Before | After |
|--------|--------|-------|
| H2 count on homepage | 146+ | 7-10 |
| Heading outline | Unnavigable | Clear hierarchy |
| SEO heading signal | Diluted | Focused |

---

## Detailed Scratch Files Index

| File | Pages Covered |
|------|--------------|
| `scratch/heading-guide-home.md` | Homepage (index.html) |
| `scratch/heading-guide-contact.md` | Contact |
| `scratch/heading-guide-blog.md` | Blog listing + Blog template |
| `scratch/heading-guide-careers.md` | Werkenbij + Vacature template |
| `scratch/heading-guide-bunkering-filtratie.md` | Scheepsbunkering + Filtratie |
| `scratch/heading-guide-uitrusting-maatwerk.md` | Scheepsuitrusting + Maatwerk |
| `scratch/heading-guide-webshop.md` | Webshop |
| `scratch/heading-guide-nobel-isps.md` | Dit is Nobel + ISPS Kade |
| `scratch/heading-guide-locatie-team-brochures.md` | Locatie + Team + Brochures |
| `scratch/heading-guide-voorwaarden-global.md` | Voorwaarden + Global + 401/404/search |

---

*Generated: February 2026*
*Analysis method: 10 parallel Opus agents, each analyzing 1-3 pages*
*SEO Audit Reference: specs/005-anobel.com/022-seo-audit-report/*
