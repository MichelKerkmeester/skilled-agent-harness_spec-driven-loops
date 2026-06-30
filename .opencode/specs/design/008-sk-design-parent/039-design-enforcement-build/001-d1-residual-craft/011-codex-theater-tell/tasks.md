---
title: "Tasks: Codex theater / meta-criticism copy tell for the design-audit AI-fingerprint layer"
description: "Task breakdown for adding the Codex theater tell as a reconciled catalog row, registry row, clean+tell fixture, and copy-scanning matcher, keeping both AI-fingerprint checkers green at ten rows with zero off-family or hubRoute regression."
trigger_phrases:
  - "codex theater tell tasks"
  - "ai fingerprint theater meta criticism tasks"
  - "design audit copy tell reconciliation tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/011-codex-theater-tell"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all tasks complete with evidence; set canonical Setup/Implementation/Verification headers"
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
      - "The four reconciled artifacts are the faithful reading of the spec acceptance against the two checker scripts"
      - "The matcher gates deterministically while a live theater hit stays advisory on movie/home theater copy"
---
# Tasks: Codex theater / meta-criticism copy tell for the design-audit AI-fingerprint layer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [catalog tell + registry row, 1-1.5h]

### Canonical contract values
- [x] T001 Fix the canonical reconciliation values once: catalog heading `Theater / meta-criticism copy` → slug (recommended `theater-meta-criticism-copy`), `fixture_id` `ai-fingerprint-<slug>`, `model_family` `codex`, `severity_floor` `P2`, `owner` (recommend `interface`), and the single `deterministic_check` sentence reused verbatim by the matcher [15m] — locked: `tell_id` `theater-meta-criticism-copy`, `fixture_id` `ai-fingerprint-theater-meta-criticism-copy`, `codex`, `P2`, `owner: interface`

### Catalog tell
- [x] T002 Add `### 2.6 Theater / meta-criticism copy` under `## 2. CODEX TELLS` with a Check / Owner / Severity block matching the existing Codex tells (`design-audit/references/ai_fingerprint_tells.md`) [25m] — entry present under `## 2. CODEX TELLS`; registry checker reads `catalogTells=10`
- [x] T003 Add an explicit advisory note: a `<word> theater` match is a hint that false-positives on legitimate copy ("movie theater", "home theater"), so it is flag-and-confirm, not an automatic high-severity finding (`ai_fingerprint_tells.md`) [10m] — advisory caveat written into the catalog entry

### Registry row
- [x] T004 Add the tenth row to the registry, reconciled to the catalog slug, with exactly the seven required fields, `model_family: codex`, `severity_floor: P2`, and no unknown keys (`design-audit/assets/ai_fingerprint_registry.json`) [15m] — tenth row parses with seven fields, `codex`, `P2`, no unknown keys
- [x] T005 Set the registry `deterministic_check` to the canonical sentence from T001 so it normalizes byte-for-byte to the Phase 2 matcher key (`ai_fingerprint_registry.json`) [10m] — "Detect body copy containing a word followed by theater as meta-criticism copy." normalizes to the matcher key

### Self-defect mirror (fix-completeness)
- [x] T006 [P] Add a `### <slug>` self-audit prompt under `## Codex` mirroring the new row (`design-audit/assets/ai_fingerprint_self_defect_card.md`) [10m] — self-audit prompt added under `## Codex`

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [fixture pair + detection matcher, 1.5-2.5h]

### Fixture corpus
- [x] T007 Create the fixture directory `ai_fingerprint_fixtures/<fixture_id>/` for the new slug (`design-audit/assets/ai_fingerprint_fixtures/`) [10m] — `ai-fingerprint-theater-meta-criticism-copy/` created
- [x] T008 Author `tell.html`: faithful page copy containing a `<word> theater` meta-criticism phrase, plain safe CSS that trips none of the nine structural matchers (`ai_fingerprint_fixtures/<fixture_id>/tell.html`) [25m] — `tell.html` fires exactly `[theater-meta-criticism-copy]`, no structural matcher cross-fire
- [x] T009 Author `clean.html`: near-twin whose copy avoids the `<word> theater` pattern entirely and likewise fires nothing (`ai_fingerprint_fixtures/<fixture_id>/clean.html`) [20m] — `clean.html` fires `[]`

### Detection matcher
- [x] T010 Add the tenth `CHECK_MATCHERS` entry keyed to the canonical `deterministic_check`, mapped to `{ tellId: <slug>, matches: matchesTheaterMetaCriticism }` (`shared/scripts/ai-fingerprint-fixture-check.mjs`) [30m] — entry added; `matcherCount=10`
- [x] T011 Implement `matchesTheaterMetaCriticism`: scan visible body copy (tags stripped) for `\b(\w+)\s+theater\b`; keep it narrow enough to ignore titles, attributes, and `<style>` blocks (`ai-fingerprint-fixture-check.mjs`) [40m] — `matchesTheaterMetaCriticism` runs the regex over `extractVisibleBodyText`, the first copy/text matcher
- [x] T012 Confirm slug + check-string parity: `matcher.tellId` equals the registry `tell_id` and the normalized `deterministic_check` equals the matcher map key (else "no matcher" / "deterministic_check maps to" fire) [15m] — both checkers pass, so parity holds; `tellId` = `tell_id` = `theater-meta-criticism-copy`

### Fixtures README mirror (fix-completeness)
- [x] T013 [P] Add the tenth fixture row (fixture, family, tell) to the corpus map (`ai_fingerprint_fixtures/README.md`) [10m] — tenth corpus-map row added

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [reconciliation gate, 1-1.5h]

### Checker reconciliation
- [x] T014 Run `node ai-fingerprint-registry-check.mjs` green at `catalogTells=10 registryRows=10` (bijection intact, fixtures present) [10m] — `PASS ai-fingerprint-registry-check: catalogTells=10 registryRows=10` (exit 0)
- [x] T015 Run `node ai-fingerprint-fixture-check.mjs` green at `registryRows=10 samples=20 matcherCount=10`; new positive fires `[<slug>]`, new clean fires `[]` [10m] — `PASS ai-fingerprint-fixture-check: registryRows=10 samples=20 matcherCount=10` (exit 0); positive `[theater-meta-criticism-copy]`, clean `[]`
- [x] T016 Confirm zero off-family false positives both directions: the theater matcher fires on none of the nine existing samples, and the nine structural matchers fire on neither new fixture [15m] — fixture checker reports zero off-family cross-fires across all twenty samples

### No-regression + boundary
- [x] T017 Capture the hubRoute scorer baseline over the full sk-design corpus BEFORE the addition [10m] — baseline `23/5/0`
- [x] T018 Re-run the hubRoute scorer AFTER and confirm `23 pass / 5 known-gap / 0 regression` (delta 0) [10m] — held `23/5/0`; the fingerprint fixtures are off the hubRoute corpus
- [x] T019 Confirm both negatives bite: a removed new fixture fails the registry checker; a `tell.html` with the theater phrase stripped fails the fixture checker [10m] — removed row → registry exit 1; blanked `tell.html` → fixture exit 1, `FAIL fixture-scan`
- [x] T020 Grep the catalog, registry, fixtures, matcher, and self-defect card for packet/dimension/finding IDs and spec paths to confirm evergreen [10m] — grep clean across all touched assets

### Documentation
- [x] T021 Author `implementation-summary.md` with both checker outputs, off-family evidence, and the no-regression delta [20m] — authored at Level 2 with both checker outputs, off-family + hubRoute evidence
- [x] T022 Mark all checklist items with evidence [15m] — all P0/P1/P2 items marked with evidence; counts recomputed

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — T001-T022 complete
- [x] No `[B]` blocked tasks remaining — none
- [x] Registry checker passes at ten rows with catalog↔registry bijection and fixtures present — `catalogTells=10 registryRows=10`, exit 0
- [x] Fixture checker passes: new positive fires its tell, new clean fires none, zero off-family false positives — `registryRows=10 samples=20 matcherCount=10`, exit 0
- [x] hubRoute scorer holds its baseline with zero regression — `23/5/0`, delta 0
- [x] Checklist.md fully verified — all P0/P1/P2 items marked with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
-->
