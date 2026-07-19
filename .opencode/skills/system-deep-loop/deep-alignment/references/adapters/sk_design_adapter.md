---
title: sk-design Adapter (Static v1) - standardSource, discover, check
description: The concrete standardSource("sk-design")/discover(scope)/check(artifact,rules) specification for the v1 static-only DESIGN.md/tokens.json structural + audit-rubric adapter, built to the phase-005 reference adapter's shape. Live-render audits are explicitly OUT of this adapter's scope (phase 010).
trigger_phrases:
  - "sk-design alignment adapter"
  - "static DESIGN.md conformance"
  - "design token audit rubric adapter"
  - "deep-alignment sk-design check"
importance_tier: important
contextType: implementation
version: 1.0.0.3
---

# sk-design Adapter (Static v1)

The concrete `standardSource("sk-design")` / `discover(scope)` / `check(artifact,rules)` specification for the v1 **static-only** `DESIGN.md`/`tokens.json` conformance adapter. Built to the phase-005 reference adapter's shape (`sk_doc_adapter.md`), sk-design's own content.

---

## 1. OVERVIEW

### Contract This Adapter Implements

ADR-003 (`.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ANCHOR `adr-003`) freezes a three-method, authority-agnostic contract: `discover(scope) -> artifacts`, `standardSource(authority) -> {templates, rules}`, `check(artifact, rules) -> findings`. This document specifies sk-design's implementation of all three, and `scripts/adapters/sk-design.cjs` is the real, executable code behind it.

### Static-Only v1 Boundary: HARD SCOPE LIMIT (ADR-004, ADR-009)

**Live-render and `chrome-devtools`-driven audits (accessibility, performance, responsive behavior against an actually-rendered surface) are explicitly OUT of this adapter's scope.** ADR-004 locks v1's sk-design adapter to "static DESIGN.md/token checks only," and ADR-009 (now LOCKED) splits the live-render dimension into its own peer phase, `010-adapter-sk-design-live-render`, which, per ADR-009's own Decision text, will route exclusively through the existing `design-mcp-open-design` dispatch boundary (`.opencode/skills/sk-design/shared/design-dispatch-boundary.md`, and `.opencode/skills/sk-design/SKILL.md:30`: "a read-only bridge, always paired with a design-judgment mode that owns the taste") rather than a parallel chrome-devtools path. This adapter never renders anything, never invokes `design-md-generator`'s Playwright extraction pipeline and never drives `chrome-devtools` (NFR-S01). It reads `DESIGN.md`/`tokens.json` files already present on disk in scope, nothing more.

This has a concrete, checkable consequence for which `audit_contract.md` dimensions this adapter can honestly claim to cover. Of the Five-Dimension Score's five dimensions (`audit_contract.md` Section 3: Accessibility, Performance, Responsive Design, Theming, Anti-Patterns), only **Theming** and **Anti-Patterns** are staticaly assessable from a `DESIGN.md`'s own text. A spec document has no keyboard to navigate, no Core Web Vitals to measure, no breakpoint to resize. Accessibility, Performance and Responsive Design genuinely require a rendered surface, which is exactly what phase 010 exists to add. This adapter does not attempt to fake coverage of those three dimensions from static text. `standardSource()`'s `accessibilityPerformance` rule entry carries this limitation as an explicit `note` field (Section 4.4).

### What This Adapter Wraps (Not Reimplements)

Five real, live sk-design reference sources, cited with exact paths so this specification stays checkable against the live files:

1. `.opencode/skills/sk-design/design-md-generator/references/design-md-format.md`: the authoritative Style Reference structural specification (13-section presence table, Cardinal rules, Quick-Start consistency rule). This adapter's structural-conformance sub-check (Section 4.1) is built directly against this document, section by section.
2. `.opencode/skills/sk-design/shared/design-token-vocabulary.md`: shared color/typography/layout/elevation/motion/state token naming vocabulary.
3. `.opencode/skills/sk-design/design-audit/references/audit-contract.md`: P0-P3 severity model and five-dimension score, cited by `spec.md` REQ-002 as the v1 static rule source (this is the exact path REQ-002 names. The two sibling references below were separately confirmed live-present and are cited as additional, real static rubric inputs, not a substitution for REQ-002's own citation).
4. `.opencode/skills/sk-design/design-audit/references/accessibility-performance.md`: WCAG/contrast/touch-target/performance thresholds. Reasoning-agent-layer input only in v1 (Section 4.4).
5. `.opencode/skills/sk-design/design-audit/references/anti-patterns-production.md`: anti-slop, theming-drift, token-misuse and production-readiness signals. A mix of staticaly-checkable (Section 4.1's banned-pattern checks) and reasoning-agent-layer content.
6. `.opencode/skills/sk-design/design-audit/references/ai-fingerprint-tells.md`: model-specific AI-generated-design tell catalog. Reasoning-agent-layer input only in v1 (Section 4.4).

Explicitly **not wrapped**: `design-md-generator`'s own Playwright extraction backend (`.opencode/skills/sk-design/design-md-generator/backend/`). This adapter never invokes it (NFR-S01).

---

## 2. STANDARDSOURCE("SK-DESIGN")

`standardSource('sk-design')` returns a single object naming every real source Section 1 lists, tagged with the static/live-render boundary and each source's determinism role. Live output (`node scripts/adapters/sk-design.cjs standard-source`, re-run 2026-07-11):

```json
{
  "authority": "sk-design",
  "determinism": "hybrid",
  "scopeBoundary": "static-only-v1",
  "rules": {
    "structuralFormat": { "doc": "design_md_format.md", "path": "<repo>/.opencode/skills/sk-design/design-md-generator/references/design-md-format.md" },
    "tokenVocabulary": { "doc": "design_token_vocabulary.md", "path": "<repo>/.opencode/skills/sk-design/shared/design-token-vocabulary.md" },
    "auditContract": { "doc": "audit_contract.md", "path": "<repo>/.opencode/skills/sk-design/design-audit/references/audit-contract.md" },
    "accessibilityPerformance": { "doc": "accessibility_performance.md", "path": "...", "note": "reasoning-agent-layer input only in v1 -- ..." },
    "antiPatternsProduction": { "doc": "anti_patterns_production.md", "path": "..." },
    "aiFingerprintTells": { "doc": "ai_fingerprint_tells.md", "path": "...", "note": "reasoning-agent-layer input only in v1 -- ..." }
  },
  "knownDeviations": [ /* parsed from sk_design_known_deviations.md Section 6 */ ]
}
```

Calling `standardSource()` with any authority other than `'sk-design'` throws.

---

## 3. DISCOVER(SCOPE) FOR SK-DESIGN

sk-design's registered artifact-class is `designs` (`scripts/scoping.cjs`'s `AUTHORITY_ARTIFACT_CLASSES`), which pairs with `paths`/`globs` scopes (`lane_config_schema.md` Section 4). A `branchRange` scope resolves to `{artifacts:[], nodes:[]}`, mirroring sk-doc.cjs's reciprocal treatment.

`discover()` walks the scope with the same recursive directory-walker shape sk-doc.cjs's `collectMarkdownFiles()` uses (same `EXCLUDED_PATH_SEGMENTS` set, same repo-root containment defense-in-depth), generalized to this authority's two artifact basenames instead of a blanket `*.md` filter: any file literally named `DESIGN.md` or `tokens.json` becomes an artifact, tagged `artifactKind: 'design-doc'` or `'tokens'` respectively, matching plan.md's own Architecture wording ("resolves a lane's scope into `DESIGN.md` / `tokens.json` artifact paths"). Live-verified (2026-07-11) against this repo's own real example fixtures: `discover({type:'paths', values:['.opencode/skills/sk-design/design-md-generator/references/examples']})` correctly found all 8 real artifacts (4 `DESIGN.md` + 4 `tokens.json`, one pair each for `vercel`, `linear`, `supabase`, `stripe`).

### Required-Heading Scope (Top-Level Only, Named Explicitly)

`check()`'s structural checker (Section 4.1) tests for `##`-level heading **presence** only. It never descends into sub-block content. This single design choice has two consequences worth stating plainly rather than leaving implicit:

- It is precise enough to catch a genuinely missing required section (a real P0-worthy defect).
- It is *why* three real, documented `design_md_format.md` conventions (an omittable `### Shadows` sub-block, the Tailwind block's intentionally narrower token set and the stamped-absence `_No <X> data was extracted._` convention) never need active suppression. The checker was designed from the start to operate at a granularity where they cannot trigger a false positive. See `sk_design_known_deviations.md` Sections 2-4 for the full "dormant by construction" reasoning.

The one section given softer-than-hard-required treatment is **Imagery**: the Section-presence table marks it "conditional" (Section 10: "no imagery signal — stamp ABSENT"), so an absent `## Imagery` heading with no ABSENT-style stamp phrase anywhere in the doc produces a `P2` `imagery-section-unclear` finding, not a `P0`: a soft signal to confirm, not an asserted defect.

---

## 4. CHECK(ARTIFACT, RULES)

`check(artifact, rules, options)` runs a deterministic structural sub-check for both artifact kinds, plus an optional reasoning-agent audit-rubric sub-check, then returns a flat findings array after known-deviation suppression (Section 6).

### 4.1 Structural Conformance: `artifactKind: 'design-doc'` (Deterministic)

1. **H1 file header presence**: `design_md_format.md` Section 1 requires `# <Brand> — Style Reference`. A missing H1 is `P0`.
2. **Required-section presence**: the 11 headings the Section-presence table marks "yes" (Tokens — Colors, Tokens — Typography, Tokens — Spacing & Shapes, Components, Do's and Don'ts, Surfaces, Elevation, Layout, Agent Prompt Guide, Similar Brands, Quick Start). Each missing heading is `P0`. Imagery is checked separately at `P2` (Section 3).
3. **Quick-Start color consistency** (`design_md_format.md` Section 14's own rule: "Every `--color-*` slug and value MUST match a row in §3... A validator check (Quick-Start consistency) enforces this."). Every `--color-<slug>: <hex>;` declaration inside the Quick Start's CSS Custom Properties block is cross-checked against the backtick-wrapped hex values in the Tokens — Colors table. A mismatch is `P1` `quick-start-color-drift`.

   **Quick-Start Consistency Is Colors-Only in v1 (Named Limitation, Not a Silent Gap)**: design_md_format.md Section 14 requires §4 (`--text-*`) and §5 (`--spacing-*`) consistency too, but this adapter checks colors only. The Tokens — Colors table's `Value` column is reliably backtick-wrapped (`` `#hex` ``) in every real example this adapter was verified against. The Typography table's `Size` column is not (`design_md_format.md` Section 4's own example shows `16px` as a bare table cell, not backtick-wrapped), making it meaningfully less reliable to parse without a real risk of false positives or false negatives. This is a deliberate v1 scope decision, not an oversight. Extending to typography/spacing consistency is a defensible future increment, not a phase-006 requirement.
4. **Banned-pattern checks** (`design_md_format.md` Section 0's Cardinal rule 4: "never print raw frequency dumps... the extractor's internal CSS var names... placeholder labels"):
   - Extractor-internal CSS var leakage (`--_<name>` shape): `P1`.
   - Placeholder component naming (`### Variant-N`): `P1`.
   - Raw frequency-dump-shaped text: `P1` (see the Live-Reality Finding below for this check's precise, narrowed shape).

### 4.2 Tokens.json Parse-Validity: `artifactKind: 'tokens'` (Deterministic)

Confirms the file is well-formed JSON (`P1` `could-not-validate` on parse failure). Deeper, per-field token-shape validation against `design-md-generator`'s internal schema is a named, out-of-v1-scope limitation, not a silently thin check. Reverse-engineering that internal schema without the generator's own source contract would risk asserting a shape rule this adapter cannot actually cite evidence for.

### 4.3 Audit Rubric: Both Artifact Kinds (Reasoning-Agent)

Mirrors sk-doc.cjs's `checkRealityAlignment()` shape exactly (`sk_doc_adapter.md` Section 4.2): deciding whether a `DESIGN.md`'s Similar-Brands inference is credible, or whether a component name reads as generic AI slop, is a reasoning act no deterministic script can invent. `checkAuditRubric()` structurally **enforces** the "cite a real dimension" invariant rather than performing the semantic judgment itself. It accepts an optional `options.verifiedFindings` array of pre-judged `{dimension, citation, severity, note}` records. A record missing either `dimension` or `citation` is silently skipped (`plan.md`'s own Risk mitigation: "Require every finding to cite the specific `audit_contract.md` or `ai_fingerprint_tells.md` dimension violated... not a bare 'looks off' verdict"). No `verifiedFindings` supplied -> no reasoning-agent findings, never an invented one. Live-verified (2026-07-11): a two-entry `verifiedFindings` array (one complete, one missing `citation`) produced exactly one finding, the complete one.

### 4.4 Why `accessibility_performance.md`/`ai_fingerprint_tells.md` Are Reasoning-Agent-Only in v1

`accessibility_performance.md`'s concrete thresholds (4.5:1 body-text contrast, 3:1 large-text/UI-component contrast, 44x44px touch targets) are real, checkable numbers, but computing an actual contrast *ratio* requires a foreground/background color **pairing**, and `design_md_format.md`'s Tokens — Colors table schema (Name/Value/Token/Role) carries no such pairing field. A pairing would have to be extracted from free-text "Do's and Don'ts" prose, which is not reliably deterministic. `ai_fingerprint_tells.md` is explicitly a rendered-or-source-surface catalog (its own Section 1: "Checking whether a **rendered or source surface** shows OpenCode, Gemini, or 2026-general AI design tells"). A `DESIGN.md` spec document is neither. Both remain real, cited `standardSource()` inputs (Section 2) available to a reasoning-agent caller supplying `options.verifiedFindings`, honestly labeled as reasoning-agent-only rather than silently ignored or force-fit into a deterministic check that cannot actually verify them.

---

## 5. VERIFY-FIRST BEHAVIOR (ADR-005)

Unlike sk-git (which re-fetches live git state on every `check()` call because `discover()` never caches anything beyond a bare identifier) or sk-doc (whose reality-alignment sub-check structurally requires caller-supplied re-probe evidence), sk-design's structural sub-check (Section 4.1) reads the artifact's file content fresh on every `check()` call. There is no separate "discover-time snapshot" to go stale, since `discover()` itself never reads file contents, only paths. The reasoning-agent sub-check (Section 4.3) carries the same VERIFY-FIRST discipline sk-doc's does: it never asserts a finding without a caller-supplied `citation`, structurally preventing an invented judgment call from posing as a verified one.

---

## 6. KNOWN-DEVIATION SUPPRESSION (ADR-005)

Every finding `check()` produces passes through `suppressKnownDeviations()` before being returned. The full seeded list, its structured evidence and the machine-readable rule block `sk-design.cjs` actually parses live in [sk_design_known_deviations.md](./sk_design_known_deviations.md), not duplicated here. All three seeded entries are dormant by construction (Section 3's "Required-Heading Scope" above explains why). A suppression only silences the matched finding on the matched artifact, never the whole artifact.

---

## 7. SEVERITY MAPPING

Consolidated from Section 4's structural, tokens-validity and audit-rubric sub-checks:

| Source | Condition | Severity |
|---|---|---|
| Structural conformance | Missing H1 file header | P0 |
| Structural conformance | Missing required section (of 11) | P0 |
| Structural conformance | Missing `## Imagery` heading, no ABSENT-style stamp phrase | P2 (`imagery-section-unclear`) |
| Structural conformance | Quick-Start color mismatch vs Colors table | P1 (`quick-start-color-drift`) |
| Structural conformance | Extractor-internal CSS var leakage (`--_<name>` shape) | P1 |
| Structural conformance | Placeholder component naming (`### Variant-N`) | P1 |
| Structural conformance | Raw frequency-dump-shaped text | P1 |
| Tokens.json parse-validity | Malformed JSON | P1 (`could-not-validate`) |
| Audit rubric | Caller-verified dimension violation (`citation` present) | caller-supplied |

---

## 8. LIVE-REALITY FINDINGS (SURFACED DURING THIS ADAPTER'S OWN CONSTRUCTION)

Building and dry-running this adapter against real repo files (Section 3) surfaced two genuine defects in this adapter's own first-draft logic, caught before shipping, exactly the discipline `deep-alignment` exists to apply, turned inward on its own newest adapter.

**Defect 1: `extractSection()`'s end-of-section lookahead silently matched zero characters.** The first draft's section-extraction helper used a single regex with a `(?=\n##\s|\n?$)` lookahead intended to mean "up to the next `##` heading, or end of string." In JavaScript's multiline (`m`) mode, `$` matches immediately before **any** `\n`, not only at true end-of-string, including the `\n` ending the heading line itself. `\n?$` was therefore satisfiable at the position right after the matched heading (zero characters into the section), so the non-greedy capture group stopped immediately every time, and `checkQuickStartConsistency()` silently returned zero findings regardless of input. This was caught by dry-running the consistency check against a deliberately mismatched synthetic doc (`--color-ink: #111111` in Quick Start vs. `` `#000000` `` in the Colors table) and observing zero findings when one was expected, not by code review alone. **The fix**: rewrote `extractSection()` using explicit string-index arithmetic (find the heading match, slice from its end to the next `\n##\s` or end-of-string) instead of a single combined regex, eliminating the `$`/multiline ambiguity entirely. Re-verified: the same mismatched synthetic doc now correctly produces one `quick-start-color-drift` finding. A matching-hex variant correctly produces none. All four real example `DESIGN.md` files remain clean (no regression).

**Defect 2: the frequency-dump banned-pattern check false-positived on legitimate CSS-value prose.** The first draft's `FREQUENCY_DUMP_RE` (`\b[a-zA-Z-]+\s+\d{3,}(?:,\s*[a-zA-Z-]+\s+\d{3,})+`) matched design_md_format.md's own illustrative example ("border 9685, text 4258") but was broad enough to also match real, legitimate component-description prose in the live `vercel` example fixture: "Geist 14px weight 400, border-radius 9999px, padding 8px 12px" contains "weight 400, border-radius 9999", a `word number, word number` shape indistinguishable from a frequency dump under the original pattern. **The fix**: narrowed the pattern to a closed set of bare extractor-category words (`border`, `text`, `background`, `shadow`, `color`, `spacing`, `radius`, `font`, never a hyphenated compound like `border-radius`/`font-weight`, since a compound property name directly followed by whitespace+digits cannot match a bare-word alternative) with a negative lookahead rejecting a following CSS unit (`px`/`em`/`rem`/`%`/`s`/`ms`/`deg`/`vh`/`vw`). Re-verified: the tightened pattern still matches the documented example (`border 9685, text 4258` -> true) while no longer matching either real false-positive case from the `vercel` fixture (`weight 400, border-radius 9999px` -> false and `color 0.09s, background 0.09s` -> false). Both `vercel` and `linear` example docs are now clean.

**What this means going forward**: this pattern is deliberately calibrated for low false-positive risk over broad recall, because `design_md_format.md`'s own example is the only confirmed real shape this adapter has direct evidence for. A genuine frequency-dump leak using a hyphenated compound property name (for example a hypothetical `border-radius 9685, font-weight 4258`) would not be caught by the current pattern, a named, honest limitation rather than a silently over-broad net that would have kept false-positiving on real docs.

---

## 9. REFERENCE IMPLEMENTATION

`scripts/adapters/sk-design.cjs` implements every function this document specifies: `discover(scope)`, `standardSource(authority)`, `check(artifact, rules, options)`, plus the directory walker, the structural checkers and the suppression matcher. It also exposes a small CLI (`discover`, `check`, `standard-source` subcommands). Every behavior this document describes was live-verified against this repo's real files on 2026-07-11:

- `discover` over the real `design-md-generator/references/examples/` directory: found all 8 real artifacts across 4 fixture pairs.
- `check` against all 4 real example `DESIGN.md` files (`vercel`, `linear`, `stripe`, `supabase`): all clean after Section 8's two fixes (vercel/linear were the two that surfaced the fixes).
- `check` against a real `tokens.json`: clean (valid JSON).
- A synthetic malformed `tokens.json`: correctly produced `P1` `could-not-validate`.
- A synthetic DESIGN.md missing 8 of 11 required sections plus its H1: correctly produced exactly 9 `P0` `missing-required-section` findings (matching the missing set precisely, none extra) plus the expected `P2` `imagery-section-unclear`.
- `options.verifiedFindings` with one complete and one citation-missing entry: correctly produced exactly one finding.

See that file's own header comment for exact invocation examples.

---

## 10. REFERENCES AND RELATED RESOURCES

- [sk_design_known_deviations.md](./sk_design_known_deviations.md): the structured, evidence-cited suppression list.
- [sk-design.cjs](../../scripts/adapters/sk-design.cjs): the executable reference implementation.
- [sk_doc_adapter.md](./sk_doc_adapter.md): the phase-005 reference adapter this document's shape was copied from.
- `.opencode/skills/sk-design/design-md-generator/references/design-md-format.md`: the live Style Reference format specification this adapter's structural checker implements.
- `.opencode/skills/sk-design/shared/design-token-vocabulary.md`, `.opencode/skills/sk-design/design-audit/references/{audit-contract,accessibility-performance,anti-patterns-production,ai-fingerprint-tells}.md`: the full static rule-source set `standardSource()` names.
- `.opencode/skills/sk-design/shared/design-dispatch-boundary.md`, `.opencode/skills/sk-design/SKILL.md:30`: the dispatch boundary phase 010's live-render adapter must route through (this adapter itself never touches it).
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md` (ANCHORS `adr-003`, `adr-004`, `adr-005`, `adr-009`): the contract, static-v1 sequencing rationale, alignment invariants and live-render split this adapter satisfies.
- [../discover_contract.md](../discover_contract.md), [../lane_config_schema.md](../lane_config_schema.md), [../scoping_protocol.md](../scoping_protocol.md): the real, live `discover(scope)->artifacts` contract this adapter's `discover()` conforms to.
