---
title: "Findings Ledger: Phase 2 — skin-contract"
description: "The single reconciled fact base every skin-contract decision signs against, merging glm's 29 findings with sonnet's disk verification (D10)."
trigger_phrases:
  - "findings ledger"
  - "reconciled fact base"
  - "glm sonnet verification"
  - "skin contract findings"
importance_tier: "important"
contextType: "planning"
---

# Findings Ledger: Phase 2 — skin-contract

> This is T001 (D10): both research lineages' findings, reconciled into one fact base, before any
> of phase 2's seven contract decisions sign. Every row's Verdict and Corrected Value come from
> `../001-upgrade-research/research/lineages/glm/findings-registry.json` and
> `../001-upgrade-research/research/lineages/sonnet/findings-registry.json`, cross-read against
> `../001-upgrade-research/research/research.md`. Nothing here is re-derived by hand.

---

## 1. TALLY NOTE

The dispatch brief that commissioned this phase frames the verification as "15 CONFIRMED, 15
CORRECTED, 1 fabrication" across glm's 29 findings plus two iteration-5 citations (31 items). The
source registry — `lineages/sonnet/findings-registry.json` — does not tally that way when counted
row by row: **19 CONFIRMED (including F3.5, carried forward unchallenged), 11 CORRECTED, 1
FABRICATION**, across the same 31 items. Both counts agree on the one fabrication and on the
rough balance of corrections to confirmations; they disagree on the exact split. This ledger uses
the registry's per-row verdict as the grep-checkable source of truth and states the mismatch here
rather than silently picking a number that matches the brief.

The ledger's verdict column uses only the three values this phase's contract allows —
`CONFIRMED`, `CORRECTED`, `FABRICATION` — so F3.5, which the registry marks `UNVERIFIABLE`
("not independently re-derived"), is recorded as `CONFIRMED` with that distinction kept in its
note.

---

## 2. GLM'S 29 FINDINGS (F1.1–F4.6), SONNET-VERIFIED

| ID | GLM's claim | Corrected value / verdict note | Verdict | Node | Task / one-line scope |
|----|-------------|-------------------------------|---------|------|------------------------|
| F1.1 | No HTML/SVG checker ships; the taste gate is a manual checklist | Confirmed as-is — no automated checker exists on disk today | CONFIRMED | 005 | `check-diagram-corpus.cjs` is built from nothing; this finding is the reason phase 5 exists |
| F1.2 | Chart contract = named families with WHY-carrying errors; 75 tally sites / 47 literal names vs. a documented 42 | Confirmed | CONFIRMED | 005 | Family taxonomy and tally-site accounting ported into the diagram checker |
| F1.3 | Accessible-SVG contract; the brief said 33/34 pass, naming `example-loop-terminal.html` as the exception | Corrects the brief, not the corpus — holds 34/34. The `<svg>` open tag spans lines 172-177; `<title>` at 178 is still the first child. A line-oriented grep false-negatives a multi-line tag | CONFIRMED | 005 | Checker asserts the already-passing 34/34 contract as a regression guard; the accessible-SVG family must read a flattened tag, not per-line |
| F1.4 | no-external: 38/38 files depend on `fonts.googleapis.com`, the only remote host | Confirmed | CONFIRMED | **002** | T006 — self-contained bar / font allowlist decision |
| F1.5 | 4px grid fails at `example-flowchart.html:90-112`; `SKILL.md:403` contradicts `:337` | Confirmed | CONFIRMED | **002** | T002 — 4px exemption adjudication |
| F1.6 | Orthogonal-line rule holds on sampled node lines; needs a type-aware allowlist; full geometry needs a 2D pass | Corrected — both of glm's cited line numbers exceed the files' actual line counts | CORRECTED | 005 / 006 | 005 builds the type-aware allowlist family; the residual pairwise 2D geometry is judged at 006. No single 002 task |
| F1.7 | Marker trio (`arrow`, `arrow-accent`, `arrow-link`) defined together in "11/34" files; `dots` id unprefixed in 26/34 | Corrected — 10/34, not 11/34 | CORRECTED | **002** | T003 — marker vocabulary + id-uniqueness scope |
| F1.8 | Budget lacks node/coral markup conventions; accent has two spellings; occurrence is not element; `example-high-level.html` has "29" raw `<rect>`s | Corrected — 36 raw rects, not 29 (the 7-rect gap is arrow-label mask rects, not nodes) | CORRECTED | **002** | T004 — node markup convention (`data-diagram-node`) + coral two-spellings |
| F1.9 | Single-source scope: `#3d4460` only in type tables; `example-er.html` types "88" hex literals vs. 4 `var()` uses | Corrected — 91 hex literals, not 88 | CORRECTED | **002** | T005 — token-source scope |
| F1.10 | Not statically holdable: pairwise geometry, budget semantics, page-level uniqueness, semantic rules, the `:403`/`:337` adjudication | Confirmed | CONFIRMED | 005 / 006 | 005 registers what stays judged as the checker's boundary — the enforceable half; 006 judges the remainder — connector overlap, fan, visible gap, behind-box, focal balance |
| F2.1 | 25 distinct values / "1,585" literals across 34 examples; 83% are four role values | Corrected — 1,577 literals, not 1,585; the four-value share is 83.5%, not 83% | CORRECTED | 003 / 004 | 003 takes it as the applicator's input — the token source's shape: three grounds, which four values carry 83.5%, and how a treatment role differs from a type-scoped or global role; 004 keeps it as the repaint census — the number the repaint's diff must reproduce |
| F2.2 | Foundations 24/25 named values (`#ffffff` = treatment, `style-guide.md:132`); references 25/25; `#3d4460` only in type tables | Confirmed | CONFIRMED | **002** | T005 — folded with F1.9 (token-source scope) |
| F2.3 | Keep 1-skin-per-file; source holds all grounds; the chart's dual `prefers-color-scheme` block does not transfer | Confirmed | CONFIRMED | 003 | D1 settled the policy — one skin per file; 003 turns it into the `DIAGRAM_PALETTE:BEGIN skin=… :END` sentinel contract, one block per file, with the chart's paired `_DARK` block explicitly not transferring; a real task in `003-applicator-and-sentinels/tasks.md`, not a carried-forward settled item |
| F2.4 | Derivation doctrine scattered and half-stale: `style-guide.md:56`'s warm rgba spellings are 0/34 on disk vs. cool's 32/34; adopt a `palettes.json`-style shape | Confirmed | CONFIRMED | **002** | T007 — derivation record |
| F2.5 | Computed gates: soft 3.48:1 (sublabel, fails AA-4.5); accent-as-text 2.86:1 (tint ~2.7:1); accent-vs-ink 4.13:1; hairlines 1.25-1.58:1 (exempt) | Confirmed — independently re-derived via WCAG computation | CONFIRMED | **002** | T008 — gates signed |
| F2.6 | Repaint scope: "1,585" literals + 4 template roots = the `style-guide.md:52` "v5.1" debt; must be derivation-driven or it misses rgba and bakes stale values | Corrected — same 1,577 correction as F2.1 | CORRECTED | 004 | Repaint execution |
| F3.1 | Two documented self-contained bars exist; 38/38 fail the strict no-network bar on one assertion; `check-corpus.cjs:936-938` is a "documented-exception precedent" | Corrected — no real exception precedent exists; `:934-938` is a comment-stripping rationale, and the active pattern at `:918-923` would flag a real remote href | CORRECTED | **002** | T006 — folded with F1.4 (self-contained bar) |
| F3.2 | Chart ships font families WITH fallback chains; diagram ships families with no fallback anywhere; "port the chains" | Corrected — fallback chains already ship in every template `:root` and every inline SVG `font-family`; this is a documentation gap in `style-guide.md`'s typography table, not missing code | CORRECTED | **002** | T013 — fallback-chain documentation fix |
| F3.3 | The schematic type-scale trio is load-bearing (`onboarding.md:87,139` defends it); metric-reflow risk under font substitution is inference | Confirmed | CONFIRMED | 006 | Judged — taste/fit review, not checker-holdable |
| F3.4 | Keep onboarding AND add the applicator (mirrors the chart's own extraction/application split); applicator input = the diagram's own token source; `--default` = stock-exact | Confirmed | CONFIRMED | 003 | Applicator build; `--default` reproducing stock bytes is 003's own gate |
| F3.5 | No second carried Style Reference; inherit the pin discipline (reference path + sha256); the 34 examples are the exemplar set | Not independently re-derived by sonnet — carried forward unchallenged | CONFIRMED* (registry: UNVERIFIABLE) | **002** | T009 — pin discipline inherited |
| F3.6 | Derivation = three lists + kinds + tolerance record; `style-guide.md:52` is its unstructured prose draft; the stale warm spelling at `:56` is exactly the decay a structured record prevents | Confirmed | CONFIRMED | **002** | T007 — folded with F2.4 (derivation record) |
| F3.7 | Emphasis conflict: accent 2.86:1 sits below the standard's 3.0 gate (departs-or-rederives); hairlines are the ungated doctrine; connectors' marks-vs-structure classification is an open mapping decision | Confirmed | CONFIRMED | **002** | T008 — folded with F2.5 (gates signed) |
| F4.1 | The 34 examples = 27 canonical (1:1 with the 27 type references) + 5 variant proofs + 2 import proofs + 0 decoration; sketchy is unproven; each non-light template is proven exactly once | Confirmed | CONFIRMED | 004 | Sketchy proof-or-descope executed at repaint time — enacts parent D9's second clause. The reason (zero decoration examples on disk) is recorded here, not re-litigated at 002 |
| F4.2 | Screenshots: "38/34" files, 1:1 with sources; a `:52`-vs-`:56` staleness question was pixel-check-pending (vision tool outage) | Corrected — 39 files (34 examples + 4 templates + `screenshots/icons.png`), not 38; `icons.html` has both a font link and a screenshot | CORRECTED | 004 | Fresh-capture pass; also settles S4.1 below |
| F4.3 | The 27 type references are mirrored by hand 4+ times and already disagree: `SKILL.md` 1.0.0.0, `style-guide.md` 1.0.0.5, playbook 1.0.0.5, `README.md` 1.0.0.7; ownership says `sk-doc`, only `sk-design/mode-registry.json:89-110` registers it (sk-doc's own registry: zero diagram hits) | Confirmed — extended with a fifth version-field locus, `feature-catalog/feature-catalog.md:11` (also 1.0.0.5) | CONFIRMED | **002** | T010 — version loci collapse (five loci, not four) |
| F4.4 | Catalog contract: sentinels, header-NAME matching required in both directions; mirror-drift already confessed in `check-corpus.cjs:2543-2545` and stopped by `checkCatalogSystem`; port = selection-guide move + machine columns + skin-from-palette-block | Confirmed | CONFIRMED | 004 | Catalog port to `references/catalog.md` |
| F4.5 | `SKILL.md` anatomy: the accessibility contract is stated three times; treatments are duplicated; router pseudocode is "31%" of the file's 37,116 bytes; fix = one locus per contract, then the size answers itself | Corrected — the pseudocode is 4,692 bytes = 12.6% of the file, not 31% (off by more than 2.5x); the "stated three times" sub-claim is exactly right | CORRECTED | **002** / 004 | 002 signs the accessibility contract's single locus (T012); the pseudocode extraction and the rest of the `SKILL.md` duplicate sweep are 004's work |
| F4.6 | Command surface: 2 stale YAML names + 1 ownership locus + 1 version field need fixing | Confirmed — narrowed to a single stale line, `diagram.md:67` (lines 25-26 and 50-51 already name the real assets `diagram-auto.yaml`/`diagram-confirm.yaml` correctly) | CONFIRMED | **002** | T011 — stale YAML fix + ownership locus move |

`*` F3.5's registry verdict is `UNVERIFIABLE`; mapped to `CONFIRMED` here per §1's three-value contract, with the distinction preserved in this note.

---

## 3. SONNET'S ADDITIONS (BEYOND THE 29)

| ID | Finding | Verdict | Node | Task / one-line scope |
|----|---------|---------|------|------------------------|
| S1.1 | `example-high-level.html` carries 13 `<svg>` elements: 1 accessible frame + 12 `aria-hidden` icon glyphs | NEW (it. 1) | 005 | The corpus's only multi-svg file; the accessible-SVG checker family needs a rule for nested `aria-hidden` icon svgs so it does not misfire here |
| S2.1 | `#ffffff`: 40 occurrences across 13 files, always the backend/API/step white-fill/ink-stroke treatment, never a paper substitute | NEW (it. 2) | **002** | T005 — folded into the token-source-scope task alongside F1.9/F2.2, so `#ffffff`'s role is recorded and not mistaken for a paper substitute during the 004 repaint |
| S2.3 | No stated ratio derives `#f08a59` from `#eb6c36`; computed HSL delta is H+1.6 degrees, S+1.5pp, L+7.8pp | NEW (it. 2) | **002** | T007 — folded into the derivation-record task; the light-to-dark accent shift is recorded as two hand-picked verbatim values, not a formula |
| S3.1 | Font substitution cannot violate the 4px grid — the grid is coordinate-based (node dimensions, x/y, gaps, padding, radius), orthogonal to glyph metrics | NEW (it. 3) | **002** | T002 — folded into the 4px task; closes the "unmeasured" reflow-risk question `research.md` left open |
| S3.2 | `README.md`'s self-contained wording does not strictly conflict with the remote stylesheet link (disagrees with glm's F3.1 framing) | NEW (it. 3) | **002** | T006 — folded into the self-contained-bar task; supports naming two documented bars rather than one contradiction |
| S4.1 | The four PNG screenshots opened directly all show the current cool skin; none show the retired warm inversion | NEW (it. 4) | 004 | Closes the PNG-staleness risk before the repaint; retired from the open-risk register rather than re-investigated |
| S4.3 | `feature-catalog/` already exists on disk, unread by glm, and mirrors the chart skill's own feature-catalog structure | NEW (it. 4) | **002** & 004 | 002 — its version field (`feature-catalog.md:11`) is the fifth locus in T010; 004 — its content is reconciled against the repainted corpus |
| S5.1 | Recommend a reconciliation pass before phase 2 signs any decision | NEW (it. 5) | **002** | This is T001 itself (D10) — the task that produced this ledger |
| S5.2 | All seven phase-2 decisions given a recommended answer with supporting evidence | NEW (it. 5) | **002** | Frames T002-T008's decisions; each task cites the recommendation it signs or departs from |

---

## 4. ITERATION-5 CITATIONS (BEYOND THE 29 NUMBERED FINDINGS)

| ID | GLM's claim | Corrected value | Verdict | Node | Task / one-line scope |
|----|-------------|------------------|---------|------|------------------------|
| IT5-MUT | A mutation-suite path was cited that does not match disk | The real path is `scripts/tests/corpus-mutations.test.cjs` | CORRECTED | 005 | Mutation-suite build targets the corrected path, not glm's cited one |
| IT5-CI | `.github/workflows/diagram-corpus.yml` "mirrors the chart's shape exactly" | No such file exists anywhere in the repository — 17 workflow files enumerated, none matching | FABRICATION | 005 | Phase 5 builds the diagram's CI gate from nothing; glm's claim is void, not a starting point to adapt |

---

## 5. UNPLACED

None. Every finding above maps to a node (001 settled, 002 this node, 003, 004, 005, or 006). No
finding was dropped.

---

## 6. SUMMARY COUNTS

| Verdict | Count (of 31: 29 findings + 2 iteration-5 citations) |
|---------|--------------------------------------------------------|
| CONFIRMED | 19 |
| CORRECTED | 11 |
| FABRICATION | 1 |

Plus 9 sonnet-only additions (S1.1, S2.1, S2.3, S3.1, S3.2, S4.1, S4.3, S5.1, S5.2), not verdict-graded
since glm never made the corresponding claim.

**Node distribution:**

| Node | Findings resolved there |
|------|--------------------------|
| 001 (settled) | None |
| **002 (this node)** | F1.4, F1.5, F1.7, F1.8, F1.9, F2.2, F2.4, F2.5, F3.1, F3.2, F3.5, F3.6, F3.7, F4.3, F4.5 (decision slice), F4.6, S2.1, S2.3, S3.1, S3.2, S4.3 (partial), S5.1, S5.2 |
| 003 | F2.1 (partial), F2.3, F3.4 |
| 004 | F2.1 (partial), F2.6, F4.1, F4.2, F4.4, F4.5 (execution slice), S4.1, S4.3 (partial) |
| 005 | F1.1, F1.2, F1.3, F1.6 (partial), F1.10 (partial), S1.1, IT5-MUT, IT5-CI |
| 006 | F1.6 (partial), F1.10 (partial), F3.3 |
