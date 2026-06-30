---
title: "Implementation Plan: Codex theater / meta-criticism copy tell for the design-audit AI-fingerprint layer"
description: "Plan to add the Codex theater/meta-criticism copy tell as a reconciled four-artifact set — catalog tell, registry row, clean+tell fixture, and a copy-scanning matcher — keeping the registry parity checker and the fixture detection checker green at 10=10 with no off-family or hubRoute regression."
trigger_phrases:
  - "codex theater tell plan"
  - "ai fingerprint theater meta criticism plan"
  - "design audit copy tell reconciliation"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/011-codex-theater-tell"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark plan complete with evidence; set canonical phase-deps/effort/enhanced-rollback anchors"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md"
      - ".opencode/skills/sk-design/design-audit/assets/ai_fingerprint_registry.json"
      - ".opencode/skills/sk-design/shared/scripts/ai-fingerprint-fixture-check.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The reconciled four-artifact target set is the faithful reading of the spec acceptance, confirmed against the two checker scripts, not scope drift"
      - "The matcher gates deterministically while a live theater hit stays advisory because the copy scan false-positives on movie/home theater"
---
# Implementation Plan: Codex theater / meta-criticism copy tell for the design-audit AI-fingerprint layer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Skill / mode** | `sk-design`, `design-audit` mode (anti-slop AI-fingerprint layer) |
| **Artifact types** | A prose catalog tell, a JSON registry row, an HTML clean+tell fixture pair, a Node ESM matcher, plus two consistency mirrors |
| **Runtime** | Node ESM checkers under `shared/scripts/`; static HTML fixtures scanned as source text |
| **Validation** | The registry parity checker and the fixture detection checker must both stay green at ten rows; the new copy matcher fires deterministically while the catalog labels a live hit advisory |

### Overview
The catalog at `design-audit/references/ai_fingerprint_tells.md` is missing the Codex "theater / meta-criticism copy" tell — the slop habit of copy that narrates its own importance ("design theater", "engagement theater"). The spec names the catalog file as the target and a positive/negative fixture as the acceptance, but the live parity machinery makes the real deliverable a single reconciled set of four artifacts that must land together. Adding a catalog tell alone turns both checkers red, because the registry parity checker enforces a strict one-to-one binding between catalog tells and registry rows, and the spec's own acceptance — "the fixture check fires on the positive and not on the negative" — is only reachable through the registry-driven fixture checker, which needs a registry row, a fixture directory, and a matcher. This plan therefore adds the tell as catalog row + registry row + clean/tell fixture + copy-scanning matcher, reconciled so the registry checker holds parity at ten and the fixture checker fires the new tell on its positive, fires nothing on its negative, and produces zero off-family false positives in either direction. The change is additive: the nine existing tells, fixtures, and matchers are untouched.

### Source-of-truth reconciliation note (read before building)
The spec TARGET line names only the catalog file and a fixture, but the spec ACCEPTANCE ("fixture check fires on the positive, not on the negative") binds the work to the full machinery. This is not a scope deviation — it is the faithful reading of the acceptance:

- `ai-fingerprint-registry-check.mjs` parses each `### N.N` heading under a `## N. CODEX/GEMINI/2026-GENERAL TELLS` section as one catalog tell and requires a registry row with the same slug; a catalog tell with no row fails ("missing registry row"), and a row with no catalog tell fails ("no matching catalog tell"). The catalog tell and registry row are bijective and must move together.
- The same checker requires each registry row's `fixture_id` to resolve to a directory holding `clean.html` and `tell.html`.
- `ai-fingerprint-fixture-check.mjs` is registry-driven: it requires a matcher keyed to the row's `deterministic_check` whose `tellId` equals the row's `tell_id`, then asserts the positive fires exactly that tell and the clean fires none.

So the spec's "add it to the catalog plus a fixture" expands, by the checkers' own rules, into the four reconciled artifacts below. There is no spec-vs-code contradiction to escalate; the broader target set is what the spec acceptance already demands.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Baseline captured: both checkers green at nine rows (`catalogTells=9 registryRows=9`; fixture `registryRows=9 samples=18`)
- [x] Parity model read: catalog↔registry bijection, per-row fixture-file existence, and registry-driven matcher binding all confirmed in the two checker scripts
- [x] Tell shape resolved: this is the first copy/text tell; the matcher scans visible copy, not CSS, unlike the nine structural matchers
- [x] No-regression baseline identified: the AI-fingerprint playbook scenario is a hubRoute corpus member, so the routing scorer baseline must hold

### Definition of Done
- [x] The catalog carries the new Codex theater tell as a `### 2.6` entry, framed advisory — `### 2.6 Theater / meta-criticism copy` lives under `## 2. CODEX TELLS` with the movie/home-theater false-positive caveat
- [x] The registry carries a tenth row reconciled to the catalog slug, with all seven required fields and no unknown fields — row `theater-meta-criticism-copy`, `model_family: codex`, `severity_floor: P2`, seven fields, registry parses to ten rows
- [x] A fixture directory exists with a `tell.html` that fires only the theater tell and a `clean.html` that fires nothing — `ai-fingerprint-theater-meta-criticism-copy/` holds both; `tell.html` fires `[theater-meta-criticism-copy]`, `clean.html` fires `[]`
- [x] The fixture checker has a tenth matcher that fires on the theater copy pattern and on none of the nine existing fixtures — `matchesTheaterMetaCriticism` (the first copy/text matcher, `\b(\w+)\s+theater\b`); zero off-family cross-fires
- [x] Both checkers pass at ten rows; the consistency mirrors (self-defect card, fixtures README) carry the tenth entry; the hubRoute scorer holds its baseline with zero regression — registry `catalogTells=10 registryRows=10`, fixture `registryRows=10 samples=20 matcherCount=10`; both mirrors carry the tenth entry; hubRoute `23/5/0`

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reconciled four-artifact tell behind two green checkers. The registry stays the single source of truth: one row binds a catalog tell, a fixture directory, and a matcher. The catalog is the human layer, the registry is the parity spine, the fixture pair is the deterministic evidence, and the matcher is the detector. All four must agree on the same slug, the same canonical check string, and the same fixture directory name, or one of the two checkers turns red.

### The reconciliation invariants (every value must agree)
- **Slug agreement** — the catalog `### 2.6 <Title>` slugified equals the registry `tell_id`, the matcher's `tellId`, and (prefixed `ai-fingerprint-`) the `fixture_id` and its directory name. Recommended slug: `theater-meta-criticism-copy`, fixture `ai-fingerprint-theater-meta-criticism-copy`; whatever heading is chosen, its slug must be reused verbatim everywhere.
- **Family agreement** — the catalog section is `## 2. CODEX TELLS`, so the registry `model_family` is `codex`.
- **Check-string byte parity** — the registry `deterministic_check` string, after lowercasing and whitespace-collapse, must be byte-identical to the matcher's map key. This is the single most common reconciliation break; author both from one canonical sentence.
- **Field discipline** — the registry row carries exactly the seven required fields (`tell_id`, `model_family`, `self_defect_prompt`, `deterministic_check`, `fixture_id`, `severity_floor`, `owner`), each a non-empty string, with no extra keys. `severity_floor` is `P2`; `owner` is one of `foundations | interface | motion | sk-code` (recommend `interface` for the copy/voice call — implementer confirms against house ownership).
- **Advisory framing** — the matcher fires deterministically so the fixture gate is repeatable, but the catalog entry labels a live hit advisory: a `<word> theater` match is a hint that false-positives on legitimate copy ("movie theater", "home theater"), so it is flag-and-confirm, not an automatic high-severity finding.

### Key Components
- **Catalog tell** (`design-audit/references/ai_fingerprint_tells.md`): a new `### 2.6 Theater / meta-criticism copy` under `## 2. CODEX TELLS`, content-first, with a Check / Owner / Severity block matching the existing five Codex tells and an explicit advisory note on false positives.
- **Registry row** (`design-audit/assets/ai_fingerprint_registry.json`): the tenth row, reconciled to the catalog slug, carrying the canonical `deterministic_check` sentence that the matcher keys on.
- **Fixture pair** (`design-audit/assets/ai_fingerprint_fixtures/<fixture_id>/`): `tell.html` carries faithful page copy that includes a `<word> theater` meta-criticism phrase and uses plain, safe CSS that trips none of the nine structural matchers; `clean.html` is the near-twin whose copy avoids the `<word> theater` pattern entirely and likewise fires nothing.
- **Fixture matcher** (`shared/scripts/ai-fingerprint-fixture-check.mjs`): a tenth `CHECK_MATCHERS` entry keyed to the canonical check string, mapped to `{ tellId: <slug>, matches: matchesTheaterMetaCriticism }`; the function scans visible body copy (tags stripped) for `\b(\w+)\s+theater\b`. It must fire on the new `tell.html` and on none of the existing eighteen samples.
- **Consistency mirrors** (not checker-gated, fix-completeness): `design-audit/assets/ai_fingerprint_self_defect_card.md` gains a `### <slug>` self-audit prompt under `## Codex`; `design-audit/assets/ai_fingerprint_fixtures/README.md` gains the tenth table row.
- **No-edit / stays-green** (`shared/scripts/ai-fingerprint-registry-check.mjs`): data-driven; needs no code change but must pass once the catalog, registry, and fixtures all carry the tenth entry.

### Data Flow
1. The catalog gains a tenth tell; the registry gains the matching tenth row (parity stays 10=10).
2. The fixture directory provides one clean and one tell-present sample for the new row.
3. The fixture checker builds ten matchers, scans every fixture, and asserts the new positive fires exactly the theater tell, the new clean fires none, and no off-family match appears in either direction.
4. The registry checker confirms catalog↔registry bijection and that the new `fixture_id` resolves to real files.
5. The self-defect card and fixtures README mirror the tenth row; the routing scorer is re-run to prove the corpus addition kept hubRoute stable.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Catalog tell + registry row (the parity pair)
- [x] Add `### 2.6 Theater / meta-criticism copy` under `## 2. CODEX TELLS` in `ai_fingerprint_tells.md` with Check / Owner / Severity and an advisory false-positive note — entry present with the movie/home-theater caveat
- [x] Add the tenth registry row in `ai_fingerprint_registry.json`, reconciled to the catalog slug, with all seven required fields, `model_family: codex`, `severity_floor: P2`, and no unknown keys — row `theater-meta-criticism-copy` parses as the tenth, seven fields, no unknown keys
- [x] Fix the canonical `deterministic_check` sentence once and reuse it byte-for-byte as the matcher key in Phase 2 — "Detect body copy containing a word followed by theater as meta-criticism copy." normalizes to the matcher map key
- [x] Add the matching `### <slug>` self-audit prompt under `## Codex` in `ai_fingerprint_self_defect_card.md` (mirror, fix-completeness) — self-defect prompt added under `## Codex`
- [x] Keep all new prose evergreen: no spec/packet/dimension/finding IDs and no spec-folder paths — evergreen grep over the touched assets returns clean

### Phase 2: Fixture pair + detection matcher
- [x] Create `ai_fingerprint_fixtures/<fixture_id>/tell.html`: faithful copy containing a `<word> theater` meta-criticism phrase, plain safe CSS that trips none of the nine structural matchers — `ai-fingerprint-theater-meta-criticism-copy/tell.html` fires only `[theater-meta-criticism-copy]`
- [x] Create `ai_fingerprint_fixtures/<fixture_id>/clean.html`: near-twin whose copy avoids the `<word> theater` pattern and fires nothing — `clean.html` fires `[]`
- [x] Add the tenth `CHECK_MATCHERS` entry plus `matchesTheaterMetaCriticism` in `ai-fingerprint-fixture-check.mjs`, keyed to the canonical check string, scanning visible body copy for `\b(\w+)\s+theater\b` — added as the first copy/text matcher; `matchesTheaterMetaCriticism` scans `extractVisibleBodyText`
- [x] Add the tenth fixture row to `ai_fingerprint_fixtures/README.md` (mirror, fix-completeness) — corpus-map row added
- [x] Confirm the matcher is narrow: it must not fire on any of the nine existing `clean.html`/`tell.html` samples, and the nine existing matchers must not fire on the new fixtures — fixture checker reports zero off-family cross-fires in either direction

### Phase 3: Reconciliation gate + no-regression verification
- [x] Run `ai-fingerprint-registry-check.mjs` green at `catalogTells=10 registryRows=10` — `PASS ai-fingerprint-registry-check: catalogTells=10 registryRows=10` (exit 0)
- [x] Run `ai-fingerprint-fixture-check.mjs` green at `registryRows=10 samples=20 matcherCount=10`; new positive fires `[<slug>]`, new clean fires `[]`, zero off-family in either direction — `PASS ai-fingerprint-fixture-check: registryRows=10 samples=20 matcherCount=10` (exit 0); positive fires `[theater-meta-criticism-copy]`, clean fires `[]`
- [x] Capture the hubRoute scorer baseline before, re-run after, and confirm `23 pass / 5 known-gap / 0 regression` (delta 0) — hubRoute held `23/5/0`; the fingerprint fixtures are off the hubRoute corpus
- [x] Confirm both negatives bite: removing the new fixture fails the registry checker, and a `tell.html` stripped of the theater phrase fails the fixture checker — removed registry row → exit 1; blanked `tell.html` → exit 1, `FAIL fixture-scan`
- [x] Grep the catalog, registry, fixtures, matcher, and self-defect card for packet/dimension IDs and spec paths to confirm evergreen — grep clean across all touched assets
- [x] Author `implementation-summary.md` with checker output, off-family evidence, and the no-regression delta — authored at Level 2 with both checker outputs and the off-family + hubRoute evidence

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The theater matcher fires on its `tell.html`, stays silent on its `clean.html`, and never fires on another tell's fixtures | `ai-fingerprint-fixture-check.mjs` |
| Integration | Full corpus run at ten rows: the new positive fires exactly the theater tell, all twenty samples produce zero off-family false positives, and the registry checker holds bijective parity with fixtures present | Node ESM checkers |
| Parity | Catalog↔registry bijection at ten and per-row fixture-file existence both green; the check-string byte parity between registry and matcher confirmed | `ai-fingerprint-registry-check.mjs` |
| Regression | hubRoute scorer over the full sk-design corpus holds its baseline after the catalog/asset addition | skill-benchmark hubRoute scorer |
| Manual | The advisory catalog entry reads cleanly and states the false-positive caveat; the self-defect card and fixtures README carry the tenth entry | Read + audit-mode dry run |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `ai_fingerprint_registry.json` (9 rows, bijective with the catalog) | Internal | Green | No source of truth to extend; parity cannot stay 10=10 |
| `ai_fingerprint_tells.md` (catalog with the CODEX TELLS section) | Internal | Green | No catalog home for the `### 2.6` tell |
| `ai-fingerprint-registry-check.mjs` (catalog↔registry + fixture existence) | Internal | Green | Parity at ten cannot be proven |
| `ai-fingerprint-fixture-check.mjs` (registry-driven matcher gate) | Internal | Green | The spec's fire/no-fire acceptance cannot be met |
| hubRoute / skill-benchmark scorer over the sk-design corpus | Internal | Green | No-regression invariant cannot be proven for the corpus addition |
| Node ESM runtime | Internal | Green | Neither checker can run |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The matcher produces off-family false positives, the check-string parity breaks (no matcher / wrong tellId), the catalog and registry diverge, or the corpus addition regresses a hubRoute route
- **Procedure**: Remove the new fixture directory and the tenth matcher, revert the registry row, the catalog `### 2.6` entry, and the two mirror additions; the nine existing tells, fixtures, matchers, and both checker scripts are otherwise untouched

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Catalog + registry pair) ──> Phase 2 (Fixture pair + matcher) ──> Phase 3 (Reconcile + verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Catalog + registry pair | Baseline at nine rows | Fixture pair + matcher |
| Fixture pair + matcher | Catalog slug + canonical check string | Reconcile + verify |
| Reconcile + verify | Fixture pair + matcher | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Catalog tell + registry row + self-defect mirror | Low-Medium | 1-1.5 hours |
| Fixture pair + detection matcher + README mirror | Medium | 1.5-2.5 hours |
| Reconciliation gate + no-regression verify + summary | Low-Medium | 1-1.5 hours |
| **Total** | | **3.5-5.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Registry checker green at ten: `catalogTells=10 registryRows=10`, bijection intact, fixtures present — exit 0 confirmed
- [x] Fixture checker green at ten: new positive fires `[<slug>]`, new clean fires `[]`, zero off-family false positives across all twenty samples — `registryRows=10 samples=20 matcherCount=10`, exit 0
- [x] hubRoute scorer baseline captured before the addition and held at `23/5/0` after (delta 0) — held; fingerprint fixtures are off the hubRoute corpus
- [x] Additive scope verified: the nine existing tells, fixtures, matchers, and both checker scripts unchanged except the tenth additive entries — only the six fingerprint artifacts changed; `ai-fingerprint-registry-check.mjs` needed no edit

### Rollback Procedure
1. **Immediate**: Stop relying on the tenth tell in any audit or delivery step
2. **Revert files**: Remove the new fixture directory and the tenth matcher; revert the registry row, the catalog `### 2.6` entry, the self-defect mirror, and the fixtures README row
3. **Verify**: Re-run both checkers and confirm they pass at nine rows again and the playbook scenario still routes to its prior intent
4. **Note**: Record the divergence reason in the implementation summary

### Data Reversal
- **Has data migrations?** No (pure skill assets, static fixtures, and a matcher addition; no stored state)
- **Reversal procedure**: File removal and JSON-row revert only; no data to preserve or migrate

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
-->
