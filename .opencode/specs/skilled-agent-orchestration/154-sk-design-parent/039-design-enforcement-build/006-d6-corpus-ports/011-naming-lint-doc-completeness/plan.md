---
title: "Implementation Plan: NAMING LINT + DOC COMPLETENESS design-system artifact contract"
description: "Additive conditional contract + deterministic lint for token/component/library artifacts only: naming regexes, token tiers, required doc headings. Passes on the clean foundations surface (token_starter.md), bites on a violation, exempts non-system outputs; holds hubRoute 23/5/0 and registry identity."
trigger_phrases:
  - "d6-r11 naming lint doc completeness"
  - "naming lint design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/011-naming-lint-doc-completeness"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark the naming/doc lint plan complete with per-task verification evidence"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-foundations/references/design_system_artifact_contract.md"
      - ".opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py"
      - ".opencode/skills/sk-design/design-foundations/scripts/fixtures/naming_doc/violating.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: NAMING LINT + DOC COMPLETENESS design-system artifact contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | sk-design `design-foundations` (token/component/library artifact discipline) |
| **Contract doc (new)** | `.opencode/skills/sk-design/design-foundations/references/design_system_artifact_contract.md` — naming regexes, token tiers, required doc headings |
| **Lint (new)** | `.opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py` — deterministic per-artifact name + heading lint |
| **Convention siblings** | `design-foundations/scripts/{contrast_check,baseline_rhythm_check}.py`, `shared/scripts/variant_parameter_check.py` (Python checker: file arg + `--json`, exit 0/1/2) |
| **Token category SSOT (read-only)** | `.opencode/skills/sk-design/shared/design_token_vocabulary.md` |
| **Artifact under lint (read-only)** | `.opencode/skills/sk-design/design-foundations/assets/token_starter.md` |
| **Change shape** | Additive only — one new reference doc + one new lint script (+ optional fixture pair, optional one-line SKILL.md wiring). No existing artifact edited. |

### Overview

The corpus that motivates this phase prescribes a documented naming convention for design-system assets — components `[category]/[name]/[variant]/[state]`, tokens `{category}-{property}-{concept}-{variant}-{state}` — and explicitly recommends "Document rules in a single reference page" plus "Automate name linting" (naming-convention SKILL.md). sk-design today has a token category vocabulary (`shared/design_token_vocabulary.md`) and a fill-in token scaffold (`assets/token_starter.md`), but **no enforceable contract** for how token/component/library outputs must be named or which doc sections they must carry. Token and component artifacts can therefore ship with inconsistent names or missing documentation and nothing bites.

This phase ports a **conditional `NAMING LINT` + `DOC COMPLETENESS` contract** that applies **only to design-system artifacts** (tokens, components, libraries) and a **deterministic lint** over names + required headings. It ships two additive artifacts:

1. A **contract reference page** under `design-foundations/references/` defining (a) the **token tiers** and their **naming regexes**, and (b) the **required doc headings** per artifact kind.
2. A **per-artifact lint script** (`naming_doc_check.py`) that, given a target markdown artifact, detects whether it is a design-system artifact, lints its declared token names against the tier regexes, checks the required headings are present, and exits non-zero on a violation. Non-system outputs (screen/flow work, reference/theory docs, skill docs) are **exempt** — the lint returns a "not applicable" pass.

The work is scope-locked: the lint targets **token/component/library artifacts only**. It does **not** check skill-doc template conformance (the queued `## OVERVIEW`-heading work over ~22 sk-design docs is a **separate** concern and MUST NOT be flagged here), and it does not touch routing. The single design-system artifact currently on the surface — `assets/token_starter.md` — must **pass** the lint as-shipped, so the tier regexes and required-heading set are designed to be satisfied by its existing token names and section headings.

### Verified baseline (captured before any edit)

- **No prior art:** no `design_system_artifact_contract.md` under `design-foundations/references/` and no `naming_doc_check.py` under `design-foundations/scripts/` exist yet (confirmed: `scripts/` holds only `contrast_check.py` + `baseline_rhythm_check.py`; `references/` holds `corpus_map.md`, `data_viz.md`, `worked_examples.md`, `color/`, `layout/`, `type/`).
- **The one artifact under lint — `assets/token_starter.md` — must pass.** Its declared token names are: `--neutral-50/100/300/600/900`, `--color-primary`, `--color-primary-hover`, `--color-on-primary`, `--color-success/warning/danger/info`, `--baseline`, `--space-2xs/xs/sm/md/lg/xl/2xl/section`, `--surface-base/raised/overlay`, `--text-primary-dark`. Its content headings are `COLOR RAMP`, `TYPE SCALE`, `SPACING SCALE`, `DARK MODE (IF NEEDED)`, `HAND OFF` (all numeric-prefixed `## N. ...`). The tier regexes + required-heading set are designed to validate exactly these.
- **Token category SSOT:** `shared/design_token_vocabulary.md` defines the category families (color, typography, layout/spacing, elevation/shape, motion/state) the tier regexes derive from.
- **No-regression anchors:** this phase touches neither `hub-router.json` nor `mode-registry.json`, so the `hubRoute` floor (23 pass / 5 known-gap / 0 regression) is unaffected by construction. No routing artifact or fixture is read or written.
- **Separate work, explicitly out of scope:** the skill-doc `## OVERVIEW` template-conformance backlog (~22 files lacking an OVERVIEW heading) is NOT a design-system-artifact concern; the lint's required-heading set is artifact-content headings (ramp/scale/handoff), and the lint only runs on design-system artifacts, so those 22 files are never reached.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec deliverable read: add a conditional contract (naming regexes, token tiers, required doc headings) for token/component/library outputs only, plus a deterministic lint over names + required headings (spec §3/§4/§5). — Evidence: restated in §1 and spec §3/§4/§5.
- [x] Baseline captured: no existing contract doc or lint script; `token_starter.md` token names + headings enumerated; registry/`hubRoute` no-regression anchors noted. — Evidence: §1 "Verified baseline"; 25 token names + 4 headings enumerated.
- [x] Three design decisions resolved (see Dependencies): (a) applicability-detection mechanism, (b) per-tier regex shape vs single category-led shape regex, (c) whether to commit a fixture pair vs scratch-only negative probe. — Evidence: resolved in §6 + spec §7; chose artifactKind-or-table marker, per-tier regexes, committed fixture pair.
- [x] Confirmed: token tiers + regexes are derived to **pass `token_starter.md` as-shipped** and bite on a malformed name; required headings are a **subset of `token_starter.md`'s** content headings. — Evidence: `token_starter.md` exits 0 (25 names, 4 headings); `violating.md` exits 1.

### Definition of Done
- [x] New contract reference page exists under `design-foundations/references/` defining token tiers, per-tier naming regexes, and required doc headings per artifact kind (token/component/library). — Evidence: `design_system_artifact_contract.md` created (8 tiers, headings for token/component/library).
- [x] New lint script exists under `design-foundations/scripts/`, takes a target markdown path + `--json`, and exits 0 = pass/exempt, 1 = violation, 2 = usage/read error (matching the sibling Python checker convention). — Evidence: `naming_doc_check.py` created; `py_compile` exit 0; exit codes verified.
- [x] **Passes on the clean surface:** the lint run against `assets/token_starter.md` exits 0 (every declared token name conforms; every required heading present). — Evidence: `artifact kind: token`, 25 names, 4 headings, PASS, exit 0.
- [x] **Bites on a violation:** the lint run against a token artifact with a malformed token name OR a missing required heading exits 1 with the offending name/heading reported. — Evidence: `violating.md` exit 1, reports 3 malformed names + missing SPACING SCALE.
- [x] **Non-system exempt:** the lint run against a non-design-system markdown (e.g., a reference/theory doc) exits 0 as "not applicable" — no naming/heading violations emitted. — Evidence: `design_token_vocabulary.md` → NOT_APPLICABLE, exit 0.
- [x] **Does NOT touch the separate OVERVIEW backlog:** the lint, run across the sk-design tree (or its design-system artifacts), does not flag the ~22 skill/reference docs lacking `## OVERVIEW`; it only evaluates design-system artifacts. — Evidence: sk-design `SKILL.md` → NOT_APPLICABLE, exit 0.
- [x] No existing file edited (the optional SKILL.md wiring line was NOT taken); `token_starter.md` byte-unchanged. — Evidence: `git status` shows 3 new untracked files only; `token_starter.md` and both `SKILL.md` clean.
- [x] No-regression: `hub-router.json` / `mode-registry.json` untouched; `hubRoute` 23/5/0 held. — Evidence: neither routing file read or written; additive-only diff leaves routing unaffected by construction.
- [x] Evergreen [HARD]: no spec path, phase number, or artifact id embedded in the contract doc, the lint script, fixtures, or any SKILL.md line. — Evidence: the 3 new files carry no spec id/path; no SKILL.md line added.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single documented contract page + deterministic per-artifact lint — the same shape as the existing foundations checkers (`baseline_rhythm_check.py` lints `token_starter.md`'s spacing scale; `variant_parameter_check.py` lints a contract table). The contract page is the human-readable single source of the rules; the lint is the executable enforcement. The lint is **conditional**: it self-detects whether the target is a design-system artifact and exempts everything else, so it can be pointed at any file (or swept over a tree) and never false-positives on screen/flow or skill/reference docs.

### Key Components

| Target | Class | What it is / changes |
|--------|-------|----------------------|
| `.opencode/skills/sk-design/design-foundations/references/design_system_artifact_contract.md` | NEW — additive | The contract page: token **tiers** (color / neutral / spacing / surface / text / type — grounded in `design_token_vocabulary.md`), one **naming regex per tier** (or one category-led shape regex + category allowlist), and the **required doc headings** per artifact kind. Includes a worked compliant example and a labelled anti-example. Evergreen — no ids/paths. |
| `.opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py` | NEW — additive | The lint. Reads a target markdown path (+ `--json`); detects design-system-artifact applicability; extracts declared token names (`--token` custom properties) and headings; validates names against the tier regexes and required headings present; exits 0 (pass/exempt) / 1 (violation) / 2 (usage/read). Mirrors `variant_parameter_check.py` structure (table/row parse, `--json`, exit codes). |
| `.opencode/skills/sk-design/design-foundations/scripts/fixtures/naming_doc/{compliant.md,violating.md}` | NEW — additive (decision) | Optional committed fixture pair making the bite **permanently** provable (evergreen regression guard). Alternative: scratch-only negative probe (lighter; matches sibling 007). |
| `.opencode/skills/sk-design/design-foundations/assets/token_starter.md` | UNCHANGED — read-only | The design-system artifact the lint must pass on. Its names + headings define the must-pass set. Not edited. |
| `.opencode/skills/sk-design/shared/design_token_vocabulary.md` | UNCHANGED — read-only | The token-category SSOT the tier set derives from. It is a vocabulary **reference**, not a design-system **artifact** — the lint must NOT lint it. |
| `.opencode/skills/sk-design/design-foundations/SKILL.md` | EDIT — additive (decision, P2) | Optionally add one evergreen line wiring/listing the new checker alongside `contrast_check.py` (CONDITIONAL row + scripts mention). Flagged as a decision because spec §3 names only `references/`. |

> **Target derivation honesty:** spec §3 names `design-foundations/references/` as the target file location (the contract page). The lint **script** and any **fixtures** are the enforcement mechanism the same spec demands in §4 ("Provide a deterministic lint over names + required headings") and §5 ("fails the lint" / "a compliant artifact passes"), so they are in-scope targets even though §3 lists only the reference dir — exactly as the sibling foundations checkers (`contrast_check.py`, `baseline_rhythm_check.py`) pair a reference/asset with an executable check. `token_starter.md`, `design_token_vocabulary.md`, and the ~22 OVERVIEW-lacking docs are read-only / out-of-scope.

### Proposed contract shape (buildable, must pass token_starter.md)

Token names are CSS custom properties (`--` prefix), lowercase **kebab-case**, **category-led** from the allowed category set, no underscores, no camelCase, no author-only abbreviations. Tiers (grounded in `token_starter.md` + `design_token_vocabulary.md`):

| Tier | Example names (must pass) | Naming regex (shape, tune to pass) |
|------|---------------------------|-------------------------------------|
| neutral ramp | `--neutral-50 … --neutral-900` | `^--neutral-\d{2,3}$` |
| color | `--color-primary`, `--color-primary-hover`, `--color-on-primary`, `--color-success/warning/danger/info` | `^--color-[a-z]+(-[a-z]+)*$` |
| spacing | `--baseline`, `--space-2xs … --space-section` | `^--baseline$` or `^--space-[a-z0-9]+$` |
| surface | `--surface-base/raised/overlay` | `^--surface-[a-z]+$` |
| text | `--text-primary-dark` | `^--text-[a-z]+(-[a-z]+)*$` |

A simpler equivalent the implementer may prefer: one **category-led shape regex** `^--[a-z][a-z0-9]*(-[a-z0-9]+)*$` plus a **category allowlist** (`neutral|color|space|surface|text|…` from `design_token_vocabulary.md`). Either way, the acceptance is identical: **all ~24 `token_starter.md` names pass**, and a malformed name (`--PrimaryColor`, `--color_primary`, `--clr-1`, `--c-1`, camelCase, underscore, or off-allowlist category) bites.

Required doc headings (doc-completeness), as a **subset** of token_starter.md's headings so it passes — matched tolerant of numeric prefixes (reuse the sibling idiom `^#{1,6}\s+(?:\d+\.\s+)?<NAME>\s*$`):

| Artifact kind | Required headings (token kind exercised on current surface) |
|---------------|-------------------------------------------------------------|
| token | a color/ramp heading, a type-scale heading, a spacing-scale heading, a hand-off heading |
| component | (defined in contract; not exercised — no component artifact on surface yet) |
| library | (defined in contract; not exercised — no library artifact on surface yet) |

### Applicability detection (the conditional gate)
The lint must decide "is this a design-system artifact?" before linting. Recommended: detect a **design-system artifact marker** — presence of declared `--token` custom properties in a token table (token kind), or an explicit `artifactKind: token|component|library` frontmatter key, or a contract-defined marker heading. If no marker → exit 0 **NOT_APPLICABLE** (this is how screen/flow docs, `design_token_vocabulary.md`, and the 22 OVERVIEW-lacking skill docs are exempted). This keeps the lint sweep-safe across the whole tree.

### Data flow
1. Implementer authors the contract page (tiers + regexes + required headings + compliant/anti examples).
2. Implementer builds the lint: applicability detection → token-name extraction + regex check → required-heading presence check → JSON/text report + exit code.
3. Lint runs against `token_starter.md` → exit 0; against a fixture violation → exit 1; against a non-system doc → exit 0 NOT_APPLICABLE.
4. Confirm a tree sweep (if offered) does not flag the 22 OVERVIEW docs; confirm registry + `hubRoute` untouched.

### Enforcement honesty (code-enforced vs advisory)
- **Code-enforced (the lint bites):** on a design-system artifact, every declared token name matches its tier regex (kebab-case, category-led, no underscore/camelCase/off-allowlist); every required doc heading is present. A malformed name or a missing required heading exits non-zero, deterministically. Non-system exemption is enforced by the applicability gate.
- **Advisory (the lint cannot certify):** whether a *well-formed* token name is the *right* concept (`--color-primary` is shape-valid but "is primary the tasteful role here" is human judgment — naming-convention's "purpose before appearance" principle is not machine-decidable); whether a *present* required heading actually documents complete, correct content (heading presence ≠ substance). The lint guarantees **name + heading shape**, not naming taste or doc substance — mirroring the research's honest spine (structural presence enforceable; application/taste advisory).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract page
- [x] Capture baseline: confirm no existing contract doc / lint script; enumerate `token_starter.md` token names + headings; note registry/`hubRoute` no-regression anchors. — Evidence: §1 baseline; 25 names + COLOR RAMP/TYPE SCALE/SPACING SCALE/HAND OFF enumerated.
- [x] Resolve the three design decisions (Dependencies) before authoring. — Evidence: §6 + spec §7; marker = artifactKind-or-table, per-tier regexes, committed fixtures.
- [x] Author the contract page under `design-foundations/references/`: token tiers + per-tier naming regexes (derived to pass every `token_starter.md` name), required doc headings per artifact kind, plus a compliant worked example and a labelled anti-example. — Evidence: `design_system_artifact_contract.md` (8 tiers, per-kind headings, compliant + anti examples).
- [x] Keep the contract evergreen — no spec id/path; describe rules, not this build. — Evidence: grep of the page shows no spec id/path.

### Phase 2: Lint script
- [x] Create the lint under `design-foundations/scripts/` following the sibling Python convention (file arg + `--json`; exit 0/1/2; `_clean_cell`/row-parse helpers as needed). — Evidence: `naming_doc_check.py` reuses `_clean_cell`/`_split_table_row`; exit 0/1/2; `py_compile` OK.
- [x] Implement the applicability gate: detect a design-system-artifact marker; no marker → exit 0 NOT_APPLICABLE (exempts screen/flow, reference, and skill docs). — Evidence: `_detect_artifact` keys on artifactKind frontmatter or token-table-plus-headings; non-markers → NOT_APPLICABLE.
- [x] Implement the naming lint: extract declared `--token` names; validate each against its tier regex; report each offender. — Evidence: `_check_tokens` against 9 tier regexes; `violating.md` reports 3 offenders.
- [x] Implement the doc-completeness lint: check each required heading is present (numeric-prefix tolerant); report each missing heading. — Evidence: `_check_headings` with `_normalize_heading`; `violating.md` reports missing SPACING SCALE.
- [x] Keep all comments evergreen — no spec path, phase id, or artifact number in the script. — Evidence: grep of the script shows no spec id/path.

### Phase 3: Wiring + verification
- [x] Run the lint against `assets/token_starter.md`; resolve the contract/regex until it exits 0 (every name conforms, every required heading present). — Evidence: `token_starter.md` → 25 names, 4 headings, PASS, exit 0.
- [x] Bite proof: run against a violating fixture with a malformed token name AND a missing required heading; confirm exit 1 with the offender reported. — Evidence: `violating.md` exit 1, 3 malformed names + missing SPACING SCALE.
- [x] Exemption proof: run against a non-system markdown; confirm exit 0 NOT_APPLICABLE. — Evidence: `design_token_vocabulary.md` → NOT_APPLICABLE, exit 0.
- [x] Separate-backlog proof: confirm the lint does NOT flag the ~22 skill/reference docs lacking `## OVERVIEW`. — Evidence: sk-design `SKILL.md` → NOT_APPLICABLE, exit 0.
- [x] No-regression: confirm `hub-router.json` / `mode-registry.json` untouched and `hubRoute` 23/5/0 held. — Evidence: routing files not read/written; additive-only diff.
- [x] (Decision, P2) The optional `design-foundations/SKILL.md` wiring line was NOT taken — spec §3 named only `references/` and the scope stays additive-only. — Evidence: `git status` shows no SKILL.md change.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Pass-on-clean | `naming_doc_check.py assets/token_starter.md` → exit 0 (all names conform, all required headings present) | the new lint |
| Naming bite | A token artifact with a malformed name (`--PrimaryColor` / `--color_primary` / off-allowlist category) → exit 1, offender reported | the new lint (fixture or scratch) |
| Doc-completeness bite | A token artifact missing a required heading (e.g., no spacing-scale heading) → exit 1, missing heading reported | the new lint (fixture or scratch) |
| Non-system exemption | A reference/theory doc (no artifact marker) → exit 0 NOT_APPLICABLE | the new lint |
| Separate-backlog non-flag | The ~22 docs lacking `## OVERVIEW` are not flagged (not design-system artifacts) | the new lint sweep / spot-check |
| Usage/read errors | Missing arg / unreadable path → exit 2 | the new lint |
| No-regression | `hub-router.json` / `mode-registry.json` untouched; `hubRoute` 23/5/0 held; `token_starter.md` byte-unchanged | diff / routing replay where exercised |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Applicability-detection mechanism | Internal (design) | **Needs confirm** | How the lint decides "design-system artifact". Recommendation: detect declared `--token` custom properties (token kind) and/or an explicit `artifactKind` frontmatter marker; no marker → exit 0 NOT_APPLICABLE. This is what exempts screen/flow, reference, and skill docs and keeps a tree sweep false-positive-free. |
| Regex shape: per-tier vs category-led | Internal (design) | **Needs confirm** | Per-tier regexes (precise) vs one category-led shape regex + category allowlist (simpler). Either is acceptable; the hard constraint is identical — pass every `token_starter.md` name, bite a malformed one. Recommendation: category-led shape + allowlist (fewer moving parts, derives the allowlist from `design_token_vocabulary.md`). |
| Fixture pair vs scratch probe | Internal (design) | **Needs confirm** | A committed `fixtures/naming_doc/{compliant.md,violating.md}` makes the bite a **permanent** evergreen regression guard; a scratch-only probe is lighter and keeps the surface minimal (matches sibling 007). Recommendation: commit the minimal pair so "bites, evergreen" stays provable without re-deriving a probe. |
| `token_starter.md` is the only artifact under lint | Internal | Green (read-only) | The single design-system artifact on the current surface. Its names + headings are the must-pass set. No component/library artifact exists yet, so only the token rules are exercised; component/library rules are defined but dormant. Do not edit it. |
| OVERVIEW template-conformance backlog | Internal (scope-lock) | Green (out of scope) | The ~22 skill/reference docs lacking `## OVERVIEW` are a **separate** template-conformance concern, NOT a design-system-artifact concern. The lint's required headings are artifact-content headings; the applicability gate exempts non-artifacts. This lint must NOT flag those files. |
| Routing artifacts untouched | Internal | Green | `hub-router.json` / `mode-registry.json` are not read or written; `hubRoute` 23/5/0 is unaffected by construction. |
| Python runtime for the checker | External | Green | Required to run the lint; standard library only, no new packages (mirrors the sibling `.py` checkers). |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger:** the lint cannot be made to pass on `token_starter.md` without weakening it past the bite threshold, it false-positives on a non-system doc or the OVERVIEW backlog, or any no-regression anchor moves.
- **Procedure:** delete the new contract page, the new lint script, and any fixture pair; revert the optional SKILL.md line. All artifacts are new additive plain-text files under version control, so rollback is a clean delete/checkout with no data migration and no impact on `token_starter.md` or routing.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Contract page) ──> Phase 2 (Lint script) ──> Phase 3 (Wiring + verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract page | Design decisions | Lint script |
| Lint script | Contract page (tiers/regexes/headings) | Verification |
| Wiring + verify | Contract, Lint | None |

Order matters: the regexes and required-heading set must be derived from `token_starter.md` first (Phase 1), or the lint built in Phase 2 risks either failing the clean surface (too strict) or not biting (too loose).

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract page (tiers + regexes + required headings + examples) | Low-Medium | 1-1.5 hours |
| Lint script (applicability gate + name lint + heading lint + `--json` + exit codes) | Medium | 2-3 hours |
| Fixtures + verification (pass / two bites / exemption / OVERVIEW non-flag / no-regression) | Low-Medium | 1-1.5 hours |
| **Total** | | **4-6 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured: `token_starter.md` token names + headings enumerated; no existing contract/lint present. — Evidence: §1 baseline; 25 names + 4 headings; neither target file existed pre-build.
- [x] `token_starter.md` and `design_token_vocabulary.md` confirmed read-only. — Evidence: `git status` shows both byte-unchanged (clean).
- [x] Working tree clean except the new additive files (contract page, lint, fixtures). — Evidence: `git status` shows exactly 3 new untracked entries under sk-design.

### Rollback Procedure
1. **Immediate:** delete the new contract page, lint script, and fixture pair; revert the optional SKILL.md line.
2. **Verify:** confirm `git status` shows no residual changes; `token_starter.md` and routing artifacts byte-unchanged.
3. **Confirm identity:** diff `token_starter.md`, `design_token_vocabulary.md`, `mode-registry.json` against recorded hashes; confirm `hubRoute` 23/5/0 if exercised.

### Data Reversal
- **Has data migrations?** No — new text-only artifacts under version control.
- **Reversal procedure:** plain delete/revert; no database or generated state to unwind.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Additive conditional naming-lint + doc-completeness contract for design-system artifacts only
- Passes on token_starter.md (the one artifact on surface), bites on a violation, exempts non-system outputs
- Scope-locked OUT of the separate OVERVIEW template-conformance backlog (~22 docs); routing untouched; hubRoute 23/5/0 held
- Name + heading SHAPE code-enforced; naming taste + doc substance advisory
-->
