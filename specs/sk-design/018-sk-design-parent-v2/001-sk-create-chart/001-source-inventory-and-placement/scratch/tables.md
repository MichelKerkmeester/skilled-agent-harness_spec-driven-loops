---
trigger_phrases: []
---
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
