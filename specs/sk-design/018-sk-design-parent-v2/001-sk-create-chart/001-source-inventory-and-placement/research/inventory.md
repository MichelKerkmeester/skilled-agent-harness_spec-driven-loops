---
title: "Source Inventory and Character Census: lieflat-charts"
description: "Every file in the lieflat-charts clone with a disposition and a reason, the Chinese character census that sizes the translation phase, and the licence terms the adoption inherits."
trigger_phrases:
  - "chart source inventory"
  - "lieflat file dispositions"
  - "chinese character census"
  - "polyform noncommercial licence"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: research-inventory | v2.2 -->
# Source Inventory and Character Census: lieflat-charts

<!-- SPECKIT_LEVEL: 3 -->

---

## 1. PROVENANCE

| Field | Value |
|-------|-------|
| **Upstream** | `https://github.com/larashero3-dotcom/lieflat-charts.git` |
| **Commit** | `4eef5ce00d0907a03b8eff42578b5a04942915e9` |
| **Commit subject** | Add 16 chart types across Lupi, Basics, Glance and Maps (#12) |
| **Author** | `lieflat <larashero3@gmail.com>` |
| **History** | A single commit, dated 2026-08-19. There is no upstream history to track. |
| **Licence** | PolyForm Noncommercial License 1.0.0 |
| **Read from** | A session-scoped scratch clone, which is why the URL and commit are recorded here |

The clone lives in scratch and will not survive the session. Everything below was measured from
it. Refetch at the recorded commit to reproduce.

---

## 2. HOW THIS WAS MEASURED

Two scripts, both kept in this packet's `scratch/`, so a second reader gets the same numbers
rather than a second opinion.

| Script | What it does |
|--------|--------------|
| `scratch/scan-source.mjs` | Walks the tree and emits one row per file: bytes, text or binary, line count, Han count, CJK punctuation count |
| `scratch/classify.mjs` | Applies one ordered rule list to assign each row a disposition, and exits non-zero if any file matches no rule |

Text and binary are decided by NUL byte and UTF-8 decodability, never by file extension. An
extension-based split would have silently skipped the census on any mislabelled file, which is
the failure this phase exists to prevent.

---

## 3. RECONCILIATION

Both success criteria that depend on counting were checked against a second, independent method.

| Check | Method A | Method B | Result |
|-------|----------|----------|--------|
| **SC-001** file set | `scan-source.mjs` directory walk, 124 paths | `git ls-files`, 124 paths | `diff` reports zero difference |
| **SC-003** Han census | Regex over Unicode ideograph ranges, 45,778 | `python3` `unicodedata.name()` filter, 45,778 | Exact match, across 67 decodable text files |

Every one of the 124 files carries a disposition. `classify.mjs` fails loudly rather than
defaulting, so an unclassified file cannot pass silently.

### Corrections to the figures this phase was briefed with

| Briefed | Measured | Why they differ |
|---------|----------|-----------------|
| 65 text files | **67** | The brief counted by extension, which misses `LICENSE` (131 lines) and `.gitignore` (6 lines) |
| ~26,500 text lines | **26,637** | Same two files, adding 137 lines |
| Chinese in 6 named files, 15,647 Han | **45,778 Han across 60 files** | The six named counts are each exactly right. The list was not exhaustive: 30,131 Han live in files it does not name |
| 51 templates | **50 templates** | `templates/` holds 51 files, of which one is `templates/color/README.md` and not a template |

The third row is the one that changes someone's work. It is expanded in section 6.

---

## 4. SHAPE OF THE SOURCE

| Directory | Files | Notes |
|-----------|------:|-------|
| `(root)` | 10 | `SKILL.md`, both READMEs, both catalogs, both colour token files, `LICENSE`, `THIRD_PARTY_NOTICES.md`, `.gitignore` |
| `agents/` | 1 | An OpenAI-agent interface descriptor |
| `docs/assets/` | 32 | 11 animated GIFs (8,357,942 bytes) and 21 preview PNGs |
| `docs/assets/reports/` | 12 | Chinese report previews, 5,099,809 bytes |
| `docs/assets/reports/en/` | 12 | English report previews, 1,937,600 bytes |
| `docs/assets/examples/` | 1 | One worked-example screenshot |
| `examples/` | 2 | One English survey page, one folder README |
| `examples/reports/` | 1 | One Chinese financial report |
| `scripts/` | 2 | A structural validator and a Playwright smoke test |
| `templates/` | 7 | 4 gallery pages and 3 standalone mono charts |
| `templates/color/` | 19 | 18 colour-system variants and a README |
| `templates/reports/` | 25 | An index page and 12 reports in Chinese and English |
| **Total** | **124** | 67 text (1,394,814 bytes), 57 binary (19,159,589 bytes) |

Three chart families (Lupi Editorial, Glance, Lupi Basics) plus Maps and Interactive, across four
colour systems (Mono, Porcelain, Palm, Wire).

---

## 5. DISPOSITIONS

| Disposition | Files | Bytes | Han |
|-------------|------:|------:|----:|
| adapt | 6 | 90,820 | 11,657 |
| translate | 53 | 1,239,962 | 30,941 |
| port | 18 | 5,144,864 | 0 |
| drop | 47 | 14,078,757 | 3,180 |
| **Total** | **124** | **20,554,403** | **45,778** |

`port` means it crosses unchanged. `translate` means it crosses once its Chinese prose is English,
with no structural change. `adapt` means it crosses but is restructured to this repository's
conventions. `drop` means it does not cross, and every drop carries its reason below.

### ADAPT (6 files, 90,820 bytes, 11,657 Han)

| File | Bytes | Lines | Han | Reason |
|------|------:|------:|----:|--------|
| `catalog.md` | 14,410 | 108 | 1986 | The lookup index the workflow depends on. It needs translation and re-pathing to the packet layout |
| `report-catalog.md` | 4,869 | 49 | 1010 | The lookup index the workflow depends on. It needs translation and re-pathing to the packet layout |
| `README.en.md` | 19,420 | 304 | 2 | Source of fact for the packet README, but rewritten to the readme template and stripped of dead image references |
| `scripts/smoke-new-charts.mjs` | 3,356 | 77 | 151 | Path assumptions and Chinese comments both change. Smoke additionally needs a global Playwright install |
| `scripts/validate.mjs` | 11,344 | 322 | 204 | Path assumptions and Chinese comments both change. Smoke additionally needs a global Playwright install |
| `SKILL.md` | 37,421 | 355 | 8304 | Becomes the packet SKILL.md under the create-skill template, and carries the largest translation load |

### TRANSLATE (53 files, 1,239,962 bytes, 30,941 Han)

| File | Bytes | Lines | Han | Reason |
|------|------:|------:|----:|--------|
| `color-presets.js` | 9,888 | 179 | 763 | Block comments and the cn display-name field are Chinese. The name field is already the latin id, so behaviour is unaffected |
| `mono-tokens.js` | 10,427 | 177 | 518 | Block comments and the cn display-name field are Chinese. The name field is already the latin id, so behaviour is unaffected |
| `examples/README.md` | 2,680 | 35 | 515 | Folder-level guidance that ports structurally unchanged once the prose is English |
| `templates/color/README.md` | 2,836 | 37 | 652 | Folder-level guidance that ports structurally unchanged once the prose is English |
| `examples/reports/r04-financial-report.zh.html` | 19,737 | 375 | 790 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/basics-gallery.html` | 49,417 | 943 | 905 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/color/basics-palm.html` | 48,341 | 901 | 568 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/color/basics-porcelain.html` | 47,617 | 893 | 427 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/color/basics-wire.html` | 47,910 | 899 | 516 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/color/big-circular-palm.html` | 4,161 | 112 | 25 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/color/big-circular-porcelain.html` | 4,169 | 112 | 26 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/color/big-force-palm.html` | 4,773 | 111 | 25 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/color/big-force-porcelain.html` | 4,781 | 111 | 26 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/color/big-threads-palm.html` | 7,724 | 164 | 3 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/color/big-threads-porcelain.html` | 7,729 | 164 | 3 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/color/glance-palm.html` | 52,790 | 1172 | 696 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/color/glance-porcelain.html` | 52,672 | 1171 | 637 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/color/glance-wire.html` | 52,988 | 1176 | 698 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/color/lupi-palm.html` | 65,693 | 1260 | 884 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/color/lupi-porcelain.html` | 65,540 | 1257 | 813 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/color/lupi-wire.html` | 65,503 | 1257 | 832 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/color/maps-palm.html` | 9,813 | 180 | 216 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/color/maps-porcelain.html` | 9,825 | 180 | 216 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/color/maps-wire.html` | 9,840 | 180 | 224 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/glance-gallery.html` | 49,086 | 1135 | 319 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/lupi-gallery.html` | 61,263 | 1220 | 429 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/maps-gallery.html` | 9,786 | 180 | 236 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/index.html` | 10,836 | 42 | 818 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-01.en.html` | 16,347 | 306 | 349 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-01.zh.html` | 16,314 | 308 | 924 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-02.en.html` | 18,640 | 351 | 496 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-02.zh.html` | 18,794 | 355 | 896 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-03.en.html` | 19,602 | 390 | 487 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-03.zh.html` | 19,647 | 391 | 823 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-04.en.html` | 19,064 | 369 | 330 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-04.zh.html` | 19,546 | 375 | 773 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-05.en.html` | 13,594 | 260 | 458 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-05.zh.html` | 13,694 | 258 | 928 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-06.en.html` | 23,443 | 434 | 745 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-06.zh.html` | 23,202 | 433 | 1307 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-07.en.html` | 22,358 | 419 | 668 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-07.zh.html` | 22,126 | 415 | 1179 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-08.en.html` | 12,995 | 255 | 454 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-08.zh.html` | 12,820 | 255 | 683 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-09.en.html` | 23,029 | 448 | 615 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-09.zh.html` | 23,095 | 449 | 933 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-10.en.html` | 21,360 | 430 | 424 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-10.zh.html` | 20,908 | 423 | 1241 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-11.en.html` | 14,358 | 182 | 446 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-11.zh.html` | 14,401 | 180 | 713 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-12.en.html` | 21,043 | 412 | 813 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `templates/reports/report-12.zh.html` | 21,011 | 413 | 1348 | Chinese appears in human-facing copy rather than in structural keys, so the markup ports unchanged |
| `THIRD_PARTY_NOTICES.md` | 746 | 11 | 128 | Names the runtime dependencies and their licences, so it has to survive and has to be readable |

### PORT (18 files, 5,144,864 bytes, 0 Han)

| File | Bytes | Lines | Han | Reason |
|------|------:|------:|----:|--------|
| `agents/openai.yaml` | 466 | 4 | 0 | Required by scripts/validate.mjs, and inert in this runtime but too small to be worth diverging over |
| `docs/assets/reports/report-01.png` | 516,177 | - | - | Hard-required by scripts/validate.mjs:44 and referenced 12 times by templates/reports/index.html |
| `docs/assets/reports/report-02.png` | 320,920 | - | - | Hard-required by scripts/validate.mjs:44 and referenced 12 times by templates/reports/index.html |
| `docs/assets/reports/report-03.png` | 303,966 | - | - | Hard-required by scripts/validate.mjs:44 and referenced 12 times by templates/reports/index.html |
| `docs/assets/reports/report-04.png` | 417,258 | - | - | Hard-required by scripts/validate.mjs:44 and referenced 12 times by templates/reports/index.html |
| `docs/assets/reports/report-05.png` | 349,679 | - | - | Hard-required by scripts/validate.mjs:44 and referenced 12 times by templates/reports/index.html |
| `docs/assets/reports/report-06.png` | 744,527 | - | - | Hard-required by scripts/validate.mjs:44 and referenced 12 times by templates/reports/index.html |
| `docs/assets/reports/report-07.png` | 472,056 | - | - | Hard-required by scripts/validate.mjs:44 and referenced 12 times by templates/reports/index.html |
| `docs/assets/reports/report-08.png` | 243,567 | - | - | Hard-required by scripts/validate.mjs:44 and referenced 12 times by templates/reports/index.html |
| `docs/assets/reports/report-09.png` | 468,253 | - | - | Hard-required by scripts/validate.mjs:44 and referenced 12 times by templates/reports/index.html |
| `docs/assets/reports/report-10.png` | 519,061 | - | - | Hard-required by scripts/validate.mjs:44 and referenced 12 times by templates/reports/index.html |
| `docs/assets/reports/report-11.png` | 269,540 | - | - | Hard-required by scripts/validate.mjs:44 and referenced 12 times by templates/reports/index.html |
| `docs/assets/reports/report-12.png` | 474,805 | - | - | Hard-required by scripts/validate.mjs:44 and referenced 12 times by templates/reports/index.html |
| `examples/lenny-2026-survey.html` | 23,629 | 445 | 0 | No Chinese content and no repository-specific assumption to rewrite |
| `templates/big-circular.html` | 4,035 | 112 | 0 | No Chinese content and no repository-specific assumption to rewrite |
| `templates/big-force.html` | 4,651 | 111 | 0 | No Chinese content and no repository-specific assumption to rewrite |
| `templates/big-threads.html` | 7,711 | 164 | 0 | No Chinese content and no repository-specific assumption to rewrite |
| `LICENSE` | 4,563 | 131 | 0 | The Notices clause requires the terms to travel with any part of the software |

### DROP (47 files, 14,078,757 bytes, 3,180 Han)

| File | Bytes | Lines | Han | Reason |
|------|------:|------:|----:|--------|
| `.gitignore` | 61 | 6 | 0 | Ignore rules for a standalone repository root. This repository has its own |
| `docs/assets/color-palm-support-motion.gif` | 412,405 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/color-palm-wave-motion.gif` | 466,327 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/color-porcelain-almanac-motion.gif` | 1,783,106 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/color-porcelain-motion.gif` | 1,037,942 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/color-wire-hourglass-motion.gif` | 622,011 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/color-wire-patchwork-motion.gif` | 612,693 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/examples/r04-financial-report.zh.png` | 221,753 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/glance-motion.gif` | 234,967 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/glance-race-motion.gif` | 586,056 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/glance-stroke-motion.gif` | 78,713 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/glance-wave-motion.gif` | 44,721 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/interactive-motion.gif` | 2,479,001 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/moxt-quick-start-en.png` | 62,009 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/moxt-quick-start-zh.png` | 62,629 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/preview-basics-01.png` | 226,774 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/preview-basics-02.png` | 355,269 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/preview-color-palm-basics.png` | 76,144 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/preview-color-palm-glance.png` | 80,460 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/preview-color-palm.png` | 122,280 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/preview-color-porcelain-basics.png` | 140,997 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/preview-color-porcelain-glance.png` | 80,396 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/preview-color-porcelain.png` | 124,801 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/preview-color-wire-basics.png` | 73,919 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/preview-color-wire-glance.png` | 76,930 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/preview-color-wire.png` | 119,377 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/preview-glance-01.png` | 247,612 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/preview-glance-02.png` | 336,511 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/preview-glance-03.png` | 230,410 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/preview-lupi-01.png` | 265,190 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/preview-lupi-02.png` | 340,168 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/preview-lupi-03.png` | 358,310 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/readme-hero-en.png` | 81,327 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/readme-hero-zh.png` | 80,972 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/reports/en/report-01.png` | 207,226 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/reports/en/report-02.png` | 134,914 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/reports/en/report-03.png` | 156,102 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/reports/en/report-04.png` | 123,716 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/reports/en/report-05.png` | 139,930 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/reports/en/report-06.png` | 211,270 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/reports/en/report-07.png` | 186,174 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/reports/en/report-08.png` | 105,932 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/reports/en/report-09.png` | 104,352 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/reports/en/report-10.png` | 210,713 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/reports/en/report-11.png` | 200,991 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `docs/assets/reports/en/report-12.png` | 156,280 | - | - | Preview imagery referenced only from the GitHub README surfaces, which do not cross over |
| `README.md` | 18,916 | 304 | 3180 | Chinese twin of README.en.md. Keeping both would duplicate content the adoption wants in one language |
---

## 6. CHARACTER CENSUS

45,778 Han characters and 6,189 CJK punctuation marks, across 60 of the 124 files.

**What phase 2 actually inherits: 42,598 Han and 5,889 CJK punctuation marks across 59 files.**
The difference is `README.md`, which is dropped because its content survives in English as
`README.en.md`.

### The brief's list was not the job

The phase brief named six files holding 15,647 Han. Each of those six counts is exactly right,
and re-measurement confirmed all six. The list is not the whole census. The other 30,131 Han sit
in files the brief does not mention:

| Where | Files | Han | Why it was easy to miss |
|-------|------:|----:|-------------------------|
| `templates/reports/*.zh.html` | 12 | 11,748 | Expected, these are the Chinese report variants |
| `templates/reports/*.en.html` | 12 | 6,285 | **Not expected.** The English variants are only partly translated |
| `templates/color/*.html` | 18 | 6,834 | Palette prose in `<p>` description blocks |
| `templates/*.html` galleries | 4 | 1,889 | Card copy inside the gallery pages |
| `templates/reports/index.html` | 1 | 818 | Index page copy |
| `examples/reports/r04-financial-report.zh.html` | 1 | 790 | A Chinese worked example |
| `color-presets.js`, `mono-tokens.js` | 2 | 1,281 | Design-contract block comments and a `cn` display-name field |
| `scripts/*.mjs` | 2 | 355 | Code comments |
| `THIRD_PARTY_NOTICES.md` | 1 | 128 | The whole file is Chinese |
| `README.en.md` | 1 | 2 | A single language-switch link reading 中文 |

The second row is the finding that matters. `templates/reports/report-NN.en.html` are the files a
reader would assume are already English, and they carry between 330 and 813 Han each. Anyone
sizing phase 2 from filenames would under-count by 6,285 characters and then discover it midway.

### Where the Chinese sits, and why that makes it safe to translate

Two checks were run before calling this a prose problem rather than a data problem.

In `color-presets.js` the Han appear in block comments and in a `cn:` field. The sibling `name:`
field already carries the latin identifier (`porcelain`, `palm`, `wire`), and `cn:` has no `en:`
counterpart. There are 3 `cn:` occurrences and 0 `en:` occurrences. Translating touches display
text only, because lookups go through `name:`.

In the colour templates the Han appear inside `<p>` description paragraphs that explain each
palette. The colour values themselves are hex literals. No Han character was found in a
structural key, an id, or a selector.

Both checks are what make `translate` a safe disposition for 53 files: the markup and the logic
cross unchanged, and only the words change.

### Full per-file census

Sorted by Han count. Disposition included so phase 2 can skip the dropped file.

| File | Han | CJK punctuation | Disposition |
|------|----:|----------------:|-------------|
| `SKILL.md` | 8304 | 1097 | adapt |
| `README.md` | 3180 | 300 | drop |
| `catalog.md` | 1986 | 316 | adapt |
| `templates/reports/report-12.zh.html` | 1348 | 117 | translate |
| `templates/reports/report-06.zh.html` | 1307 | 142 | translate |
| `templates/reports/report-10.zh.html` | 1241 | 154 | translate |
| `templates/reports/report-07.zh.html` | 1179 | 164 | translate |
| `report-catalog.md` | 1010 | 146 | adapt |
| `templates/reports/report-09.zh.html` | 933 | 146 | translate |
| `templates/reports/report-05.zh.html` | 928 | 111 | translate |
| `templates/reports/report-01.zh.html` | 924 | 117 | translate |
| `templates/basics-gallery.html` | 905 | 138 | translate |
| `templates/reports/report-02.zh.html` | 896 | 113 | translate |
| `templates/color/lupi-palm.html` | 884 | 113 | translate |
| `templates/color/lupi-wire.html` | 832 | 108 | translate |
| `templates/reports/report-03.zh.html` | 823 | 110 | translate |
| `templates/reports/index.html` | 818 | 64 | translate |
| `templates/reports/report-12.en.html` | 813 | 113 | translate |
| `templates/color/lupi-porcelain.html` | 813 | 107 | translate |
| `examples/reports/r04-financial-report.zh.html` | 790 | 81 | translate |
| `templates/reports/report-04.zh.html` | 773 | 83 | translate |
| `color-presets.js` | 763 | 103 | translate |
| `templates/reports/report-06.en.html` | 745 | 110 | translate |
| `templates/reports/report-11.zh.html` | 713 | 83 | translate |
| `templates/color/glance-wire.html` | 698 | 100 | translate |
| `templates/color/glance-palm.html` | 696 | 100 | translate |
| `templates/reports/report-08.zh.html` | 683 | 94 | translate |
| `templates/reports/report-07.en.html` | 668 | 137 | translate |
| `templates/color/README.md` | 652 | 78 | translate |
| `templates/color/glance-porcelain.html` | 637 | 91 | translate |
| `templates/reports/report-09.en.html` | 615 | 122 | translate |
| `templates/color/basics-palm.html` | 568 | 77 | translate |
| `mono-tokens.js` | 518 | 82 | translate |
| `templates/color/basics-wire.html` | 516 | 69 | translate |
| `examples/README.md` | 515 | 76 | translate |
| `templates/reports/report-02.en.html` | 496 | 88 | translate |
| `templates/reports/report-03.en.html` | 487 | 89 | translate |
| `templates/reports/report-05.en.html` | 458 | 74 | translate |
| `templates/reports/report-08.en.html` | 454 | 86 | translate |
| `templates/reports/report-11.en.html` | 446 | 66 | translate |
| `templates/lupi-gallery.html` | 429 | 58 | translate |
| `templates/color/basics-porcelain.html` | 427 | 57 | translate |
| `templates/reports/report-10.en.html` | 424 | 94 | translate |
| `templates/reports/report-01.en.html` | 349 | 72 | translate |
| `templates/reports/report-04.en.html` | 330 | 63 | translate |
| `templates/glance-gallery.html` | 319 | 53 | translate |
| `templates/maps-gallery.html` | 236 | 39 | translate |
| `templates/color/maps-wire.html` | 224 | 39 | translate |
| `templates/color/maps-porcelain.html` | 216 | 38 | translate |
| `templates/color/maps-palm.html` | 216 | 38 | translate |
| `scripts/validate.mjs` | 204 | 28 | adapt |
| `scripts/smoke-new-charts.mjs` | 151 | 22 | adapt |
| `THIRD_PARTY_NOTICES.md` | 128 | 7 | translate |
| `templates/color/big-force-porcelain.html` | 26 | 4 | translate |
| `templates/color/big-circular-porcelain.html` | 26 | 4 | translate |
| `templates/color/big-force-palm.html` | 25 | 4 | translate |
| `templates/color/big-circular-palm.html` | 25 | 4 | translate |
| `templates/color/big-threads-porcelain.html` | 3 | 0 | translate |
| `templates/color/big-threads-palm.html` | 3 | 0 | translate |
| `README.en.md` | 2 | 0 | adapt |

---

## 7. THE 57 BINARY ASSETS, DECIDED EXPLICITLY

REQ-005 exists because the easy failure here is porting 18 MB of imagery by default, on the
grounds that dropping it felt like a loss. So the split was made from reference-tracing, not from
taste.

**12 cross. 45 do not.**

### The 12 that cross

`docs/assets/reports/report-01.png` through `report-12.png`, 5,099,809 bytes.

They are not decoration. They are load-bearing in two places:

- `scripts/validate.mjs:44` pushes `docs/assets/reports/report-${n}.png` onto its required-files
  list for all twelve. The validator fails if they are absent.
- `templates/reports/index.html` references all twelve, once each, as the visual index of the
  report library.

Dropping them breaks the phase 4 handoff criterion, which is that the source's own `validate.mjs`
runs green from the new location.

### The 45 that do not

| Group | Files | Bytes | Referenced only by |
|-------|------:|------:|--------------------|
| Motion GIFs in `docs/assets/` | 11 | 8,357,942 | `README.md`, `README.en.md` |
| Preview, hero and quick-start PNGs in `docs/assets/` | 21 | 3,542,485 | `README.md`, `README.en.md` |
| English report previews `docs/assets/reports/en/` | 12 | 1,937,600 | `README.en.md` only |
| Worked-example screenshot `docs/assets/examples/` | 1 | 221,753 | `examples/README.md` |
| **Total dropped** | **45** | **14,059,780** | |

Every one is referenced from a README and from nowhere else. `README.md` and `README.en.md`
account for 43 references each. `SKILL.md`, the file an agent actually reads, references
`docs/assets` exactly once, and that reference is to the report previews being kept.

The reason for dropping them is a size argument with a number attached. The entire `sk-doc` hub
is 9,512 KB today. Porting all 57 assets would add 18,710 KB, nearly tripling the hub, to carry
GitHub marketing imagery into a tree whose consumer is an agent reading `SKILL.md`. The 12 kept
assets add 4,980 KB, which is the price of the validator passing.

### The residual cost, stated rather than hidden

Keeping 12 PNGs still grows `sk-doc` by roughly half its current size. That is a real cost and it
buys one thing: the source's validator runs unmodified. The cheaper alternative is to drop them
and amend `scripts/validate.mjs:44` plus the twelve references in `templates/reports/index.html`.
That alternative was not taken because the operator's instruction is to keep the source as
literal as possible, and amending the validator is exactly the kind of divergence that
instruction rules out. It remains available if the operator prefers the bytes.

---

## 8. LICENCE AND PROVENANCE

### What the source is licensed under

**PolyForm Noncommercial License 1.0.0**, read in full from `LICENSE` in the clone. The clauses
that bind this adoption:

| Clause | What it means here |
|--------|--------------------|
| **Noncommercial Purposes** | Only a noncommercial purpose is a permitted purpose. Personal study, hobby projects and amateur pursuits qualify, expressly "without any anticipated commercial application" |
| **Distribution License** | Redistribution is permitted, including with changes |
| **Changes and New Works** | Modification is permitted, for a permitted purpose. Translating and restructuring the skill is therefore allowed |
| **Notices** | Anyone who receives any part of the software must also receive these terms or the URL, plus any `Required Notice:` lines the licensor supplied |
| **No Other Rights** | "These terms do not allow you to sublicense or transfer any of your licenses to anyone else" |

A grep for `Required Notice:` across the clone returns hits only inside `LICENSE` itself, at
lines 35 and 38, and line 38 is the template's own Yoyodyne example. **The licensor supplied no
`Required Notice:` line,** so no specific attribution string is mandated. The terms themselves
still have to travel, which is why `LICENSE` is dispositioned `port` rather than `drop`.

### The conflict this creates, stated plainly

This repository is MIT licensed. Its `LICENSE` grants every recipient the right to "use, copy,
modify, merge, publish, distribute, sublicense, and/or sell". It is published at
`https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git`.

Those two things cannot both be true of the same files:

- PolyForm restricts use to noncommercial purposes. MIT permits commercial use and sale.
- PolyForm forbids sublicensing. MIT is a sublicense to every recipient.

**OBSERVED**: both licence texts, read from `LICENSE` in each repository.
**DERIVED**: vendoring the source verbatim into this repository would hand every downstream
recipient an MIT grant the upstream licensor never gave, for the ported files.

This does not make the adoption impossible, and it is not this phase's call to make. It is a
decision the operator owns, and it is recorded as ADR-002 in `decision-record.md` with the
options and the check that settles it. **It blocks phase 4, not phase 2 or phase 3**, because
nothing is copied into the skills tree until phase 4.

### Third-party dependencies the templates pull at runtime

`THIRD_PARTY_NOTICES.md` names three, and grepping the templates confirms all three are loaded
from a CDN rather than vendored:

| Project | Licence | Loaded from | References found |
|---------|---------|-------------|------------------|
| Apache ECharts | Apache 2.0 | `cdn.jsdelivr.net` | 27, plus 4 to `echarts-examples` |
| Chart.js | MIT | `cdn.jsdelivr.net` | 9 |
| Inter | SIL OFL 1.1 | `fonts.googleapis.com` | 50 stylesheet references |

None of the three is PolyForm-encumbered, and none is vendored into the clone. The practical
consequence is that most templates need network access to render. The source's own `SKILL.md`
states this: pure SVG charts run offline, and anything using Chart.js, ECharts, map GeoJSON or a
web font does not.

---

## 9. FINDINGS THAT CHANGE A LATER PHASE

Each of these was found while inventorying and would otherwise be discovered mid-execution.

| # | Finding | Phase affected |
|---|---------|----------------|
| F-01 | The `report-NN.en.html` templates carry 6,285 Han between them. The English variants are not fully English | 2 |
| F-02 | Phase 2's real size is 42,598 Han across 59 files, not the 15,647 across 6 files the brief implied | 2 |
| F-03 | `color-presets.js` has a `cn:` display-name field with no `en:` sibling. Translating means adding a field or dropping one, and `name:` is already the latin id so lookups are unaffected | 2 |
| F-04 | `scripts/validate.mjs` hard-requires `LICENSE`, `agents/openai.yaml`, both `.zh` and `.en` report templates, and the 12 report PNGs. Any file dropped from that list breaks the phase 4 handoff criterion | 4 |
| F-05 | `scripts/smoke-new-charts.mjs` resolves Playwright from the global npm root, so it needs a global Playwright install to run at all | 6 |
| F-06 | `sk-create-diagram`, already shipping in `sk-doc`, lists Bar chart, Line chart, Scatter plot and Radar in its own selection guide. Two modes in one hub will answer to overlapping phrasing | 5 |
| F-07 | The advisor currently returns nothing for "make a chart from this data" and misroutes "create a data visualization report" to `command-create-agent` at 0.48 confidence. Vocabulary work is required whatever the placement | 5 |
| F-08 | Templates load ECharts, Chart.js and Inter from CDNs, so the playbook cannot assume an offline render | 6 |

---

## 10. UNKNOWNS

Recorded rather than guessed, each with the check that would settle it.

| # | UNKNOWN | What would settle it |
|---|---------|----------------------|
| U-01 | Whether this repository's use of a noncommercial-only work is permitted, and on what terms it may be redistributed under MIT | An operator decision on ADR-002. It is a licensing judgment, not a measurable fact |
| U-02 | Whether "make sure it's all English" means the 12 `report-NN.zh.html` template assets are dropped, or kept as bilingual data with only authored prose translated | An operator answer. The inventory assumes kept-and-translated, because dropping them removes an advertised feature and breaks `validate.mjs` |
| U-03 | Whether `sk-create-chart` and `sk-create-diagram` should share the simple chart types or divide them | A router replay of real chart phrasings against both modes once phase 5 wires the first one. Cannot be measured before the mode exists |
| U-04 | Whether the 12 kept report PNGs can be re-encoded smaller without breaking the index page | An image pass in phase 4, measuring bytes before and after. Not attempted here because this phase writes nothing outside itself |

---

## RELATED DOCUMENTS

- **Placement decision**: See `../decision-record.md`
- **Specification**: See `../spec.md`
