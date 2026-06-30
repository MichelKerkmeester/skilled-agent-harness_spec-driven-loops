---
title: "Verification Checklist: Codex theater / meta-criticism copy tell for the design-audit AI-fingerprint layer"
description: "Priority-tagged verification checklist with a fix-completeness section binding every spec acceptance and parity-machinery requirement to a concrete check for the reconciled Codex theater tell, all items marked with evidence after both checkers passed at ten rows."
trigger_phrases:
  - "codex theater tell checklist"
  - "ai fingerprint theater meta criticism checklist"
  - "design audit copy tell reconciliation checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/011-codex-theater-tell"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all checklist items verified; reorder to canonical sections and recompute counts"
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
      - "Off-family safety proven both ways: the first copy matcher fires on no structural fixture and no structural matcher fires on the new copy fixture"
      - "The gate is deterministic while a live theater hit stays advisory on movie/home theater copy"
---
# Verification Checklist: Codex theater / meta-criticism copy tell for the design-audit AI-fingerprint layer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: spec.md OBJECTIVE, BUILD OUTLINE, and ACCEPTANCE read; the four-artifact reconciliation resolved against the two checker scripts
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: plan.md names the catalog tell, registry row, fixture pair, matcher, and the two consistency mirrors, with the reconciliation invariants
- [x] CHK-003 [P1] Baseline at nine rows captured
  - **Evidence**: both checkers were green before the edit (registry `catalogTells=9 registryRows=9`; fixture `registryRows=9 samples=18`)

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Registry row carries exactly the seven required fields with no unknown keys
  - **Evidence**: the tenth row parses with `tell_id`/`model_family`/`self_defect_prompt`/`deterministic_check`/`fixture_id`/`severity_floor`/`owner`; `model_family: codex`, `severity_floor: P2`, `tell_id`/`fixture_id` valid slugs; registry checker reports no missing/extra-field errors
- [x] CHK-011 [P0] Catalog, registry, fixtures, matcher, and self-defect card are evergreen
  - **Evidence**: grep over the touched assets returns no packet/dimension/finding IDs or spec-folder paths
- [x] CHK-012 [P1] Slug and check-string parity hold
  - **Evidence**: `matcher.tellId` = registry `tell_id` = `theater-meta-criticism-copy`; the normalized `deterministic_check` equals the matcher map key (both checkers pass, so no "no matcher" / "maps to" error)
- [x] CHK-013 [P1] Matcher is narrow and the catalog framing is advisory
  - **Evidence**: `matchesTheaterMetaCriticism` scans `extractVisibleBodyText` only (the first copy/text matcher); the catalog entry states the `<word> theater` false-positive caveat ("movie theater", "home theater") and flag-and-confirm handling

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] The new positive fires exactly the theater tell
  - **Evidence**: fixture checker reports `tell.html` firing `[theater-meta-criticism-copy]` and nothing else
- [x] CHK-021 [P0] The new clean fires zero tells
  - **Evidence**: fixture checker reports `clean.html` firing `[]`
- [x] CHK-022 [P0] No off-family false positives in either direction
  - **Evidence**: the theater matcher fires on none of the nine existing samples; the nine structural matchers fire on neither new fixture; off-family count = 0 across all twenty samples
- [x] CHK-023 [P1] Negative cases bite
  - **Evidence**: removing the new registry row fails the registry checker (exit 1); blanking the theater phrase from `tell.html` fails the fixture checker (exit 1, `FAIL fixture-scan`)

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

> Every spec ACCEPTANCE point and parity-machinery requirement binds to a concrete check here.

- [x] CHK-FIX-001 [P0] ACCEPTANCE: the tell fires on the positive fixture (deterministic)
  - **Evidence**: CHK-020 satisfied — `tell.html` fires `[theater-meta-criticism-copy]` with a fixed, repeatable result
- [x] CHK-FIX-002 [P0] ACCEPTANCE: the tell does not fire on the negative fixture (deterministic)
  - **Evidence**: CHK-021 and CHK-022 satisfied — `clean.html` fires `[]` and there are no off-family fires
- [x] CHK-FIX-003 [P0] ACCEPTANCE: flagging real slop stays advisory
  - **Evidence**: CHK-013 satisfied — the matcher gates deterministically but the catalog labels a live hit flag-and-confirm with the false-positive caveat
- [x] CHK-FIX-004 [P0] MACHINERY: catalog↔registry bijection holds at ten
  - **Evidence**: CHK-031 satisfied — registry checker green at `catalogTells=10 registryRows=10` with no "missing registry row" / "no matching catalog tell"
- [x] CHK-FIX-005 [P0] MACHINERY: the registry-driven matcher binding is satisfied
  - **Evidence**: CHK-012 satisfied — a matcher exists for the new `deterministic_check` and its `tellId` equals the row `tell_id`
- [x] CHK-FIX-006 [P1] EVIDENCE: the missing Codex theater / meta-criticism tell gap is closed
  - **Evidence**: the catalog `## 2. CODEX TELLS` section now carries `### 2.6 Theater / meta-criticism copy`, the tell impeccable's record names
- [x] CHK-FIX-007 [P1] No-regression invariant honored where the skill_benchmark corpus is touched
  - **Evidence**: CHK-030 satisfied — hubRoute `23/5/0` held with zero regression; the fingerprint fixtures are off the hubRoute corpus

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No-regression integrity: the hubRoute scorer holds its baseline with zero regression
  - **Evidence**: baseline `23/5/0` captured before the addition; re-run after shows `23 pass / 5 known-gap / 0 regression` (delta 0); fingerprint fixtures are off the hubRoute corpus
- [x] CHK-031 [P0] Both checkers green at ten rows
  - **Evidence**: registry `catalogTells=10 registryRows=10` (exit 0); fixture `registryRows=10 samples=20 matcherCount=10` (exit 0)
- [x] CHK-032 [P1] Additive scope respected (no false trust signal from out-of-scope edits)
  - **Evidence**: the nine existing tells, fixtures, matchers, and both checker scripts unchanged except the tenth additive entries; `ai-fingerprint-registry-check.mjs` needed no code edit

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: all three reflect the catalog tell, registry row, fixture pair, matcher, and the two mirrors
- [x] CHK-041 [P1] Consistency mirrors carry the tenth entry
  - **Evidence**: the self-defect card has the `theater-meta-criticism-copy` prompt under `## Codex`; the fixtures README has the tenth corpus-map row
- [x] CHK-042 [P2] Owner choice recorded
  - **Evidence**: implementation-summary records the `owner: interface` decision for the copy/voice tell and the rationale

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Only the six fingerprint artifacts changed; no scorer, router, or hubRoute fixture touched
  - **Evidence**: the change set is the catalog, registry, fixture pair, matcher, self-defect card, and fixtures README; the scorer/router/hubRoute fixtures are untouched and no fingerprint-count vitest existed to update
- [x] CHK-051 [P1] No temp/scratch files left outside the scratchpad
  - **Evidence**: the negative-case tamper checks (removed row, blanked `tell.html`) were exercised and reverted; the working tree carries only the six additive fingerprint artifacts

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-29
**Verified By**: orchestrator — verified independently without pipe-masking against the delivered six fingerprint artifacts (registry `catalogTells=10 registryRows=10` exit 0 and BITE on the removed row; fixture `registryRows=10 samples=20 matcherCount=10` exit 0, `tell.html` → `[theater-meta-criticism-copy]`, `clean.html` → `[]`, zero off-family, and BITE on the blanked `tell.html`; `node --check` both `.mjs`; registry parses to ten rows; hubRoute `23/5/0`)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
Fix Completeness section binds each spec acceptance and parity-machinery requirement to a check
-->
