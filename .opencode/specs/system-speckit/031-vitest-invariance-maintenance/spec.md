---
title: "Feature Specification: Repair the three RED system-spec-kit vitest suites left by the ADR-007-deferred 699-file catalog/playbook de-numbering"
description: "Restore outsourced-agent-handback-docs, feature-flag-reference-docs, and workflow-invariance vitest suites to green after the de-numbering reorg — honestly, without weakening the private-taxonomy-leak invariant."
trigger_phrases:
  - "feature"
  - "specification"
  - "vitest"
  - "invariance"
  - "allowlist maintenance"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/031-vitest-invariance-maintenance"
    last_updated_at: "2026-07-11T20:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All 3 suites green + independently verified; packet complete"
    next_safe_action: "Complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/031-vitest-invariance-maintenance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Repair the three RED system-spec-kit vitest suites left by the ADR-007-deferred 699-file catalog/playbook de-numbering

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-11 |
| **Branch** | `skilled/v4.0.0.0` (no dedicated branch — `--skip-branch`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Commit `5149f3abe5` ("refactor(system-spec-kit): de-number 699 catalog+playbook snippet files") renamed 699 system-spec-kit catalog and playbook snippet files, stripping the `NNN-` numeric prefixes. Packet `sk-doc/026`'s ADR-007 explicitly *deferred* the resulting test fallout as a booked maintenance item rather than fixing it in-line. Three system-spec-kit vitest suites are therefore RED:

- **(a)** `scripts/tests/outsourced-agent-handback-docs.vitest.ts` — a stale `149-` filename literal (the file was de-numbered) plus a `cli-opencode` `prompt_templates.md` content-parity assertion that fails because the doc is missing a `recentContext` example.
- **(b)** `mcp_server/tests/feature-flag-reference-docs.vitest.ts` — 14 failures: 8 env-var mapping-row assertions whose target rows relocated during the reorg, and 6 numbered-doc content assertions pointing at the old numbered paths.
- **(c)** `scripts/tests/workflow-invariance.vitest.ts` — the private-taxonomy-leak invariant is *systemically* RED (~120 hits). Roughly ~3 are genuine de-numbering-caused stale allowlist entries, ~11 are spurious hits from a local `node_modules/` tree the scanner should never have walked, and ~40 are legitimate technical-vocab uses of `preset` / `capability` / `kind` / `manifest` that predate the de-numbering and were never leaks.

The suites are red for banal reorg reasons, but the fixes must not become an excuse to gut assertions or disable the invariant.

### Purpose
Return all three suites to green **honestly**: fix the real docs, relocate assertions to where the real content now lives, add a `node_modules/` scan guard, and add justified allowlist entries for the legitimate technical vocabulary — while keeping the workflow-invariance test strong enough to still catch a genuine NEW private-taxonomy leak.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Suite (a)**: replace the stale `149-` filename literal with the current de-numbered filename; close the `cli-opencode` `prompt_templates.md` content-parity gap by adding the missing `recentContext` example so the doc actually matches what the test asserts.
- **Suite (b)**: relocate the env-var mapping-row assertions to the rows' new locations post-reorg (7 relocated to the aggregate `feature_catalog.md`); repoint the 6 numbered-doc content assertions at the de-numbered doc paths / current content. The `MEMORY_DB_DIR` mapping is removed as a genuinely dead flag (unread by any source repo-wide) rather than relocated, and its stale `feature_catalog.md` rows corrected to the real precedence chain.
- **Suite (c)**: add a `node_modules/` exclusion guard to the invariance scanner so the ~11 spurious local-dependency hits disappear; refresh the ~3 stale de-numbering allowlist entries; add justified allowlist entries for the ~40 legitimate `preset`/`capability`/`kind`/`manifest` technical-vocab uses. The invariant MUST still fail on a genuine new taxonomy leak.
- Full repair to green across all three suites.

### Out of Scope
- Re-litigating the 699-file de-numbering itself (commit `5149f3abe5`) — this packet works *downstream* of it, treating it as settled.
- Any weakening of the private-taxonomy-leak invariant — deleting assertions, broad-brush allowlisting, or disabling the test is explicitly forbidden (see decision-record ADR-007 anti-false-green principle).
- The `it.fails.skip` at `outsourced-agent-handback-docs.vitest.ts:~26` — it belongs to the `vitest-recovery-followup` lane and MUST be left untouched (foreign-lane constraint).

### Files to Change (this packet)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts` | Modify | Replace stale `149-` filename literal with the current de-numbered name (do NOT touch the `vitest-recovery-followup` `it.fails.skip` at ~line 26) |
| `.opencode/skills/system-spec-kit/.../cli-opencode/.../prompt_templates.md` | Modify | Add the missing `recentContext` example to close the content-parity gap |
| `.opencode/skills/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts` | Modify | Relocate 8 env-var mapping-row assertions + repoint 6 numbered-doc content assertions |
| `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts` | Modify | Add `node_modules/` scan guard; refresh ~3 stale allowlist entries; add justified allowlist entries for ~40 technical-vocab uses |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Modify | Correct the stale `MEMORY_DB_DIR` rows (dead flag, unread by any source): remove the dead row and drop it from the `MEMORY_DB_PATH`/`SPEC_KIT_DB_DIR` precedence prose |

> Exact `prompt_templates.md` path is resolved at implementation time from the test's own asserted path; recorded here as `UNKNOWN` until the implementing session reads the assertion.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Suite (a) `outsourced-agent-handback-docs.vitest.ts` passes green | Stale `149-` literal replaced with the current filename; `recentContext` example added to `prompt_templates.md`; suite runs green; `vitest-recovery-followup` `it.fails.skip` at ~line 26 byte-identical |
| REQ-002 | Suite (b) `feature-flag-reference-docs.vitest.ts` passes green | 13 of 14 failures resolved by relocating the mapping-row assertions and repointing the numbered-doc content assertions to real current content; the 14th (`MEMORY_DB_DIR`) removed as a genuinely dead mapping (no source reads it) with the stale `feature_catalog.md` rows corrected. No assertion force-passed. |
| REQ-003 | Suite (c) `workflow-invariance.vitest.ts` passes green WITHOUT weakening the invariant | `node_modules/` guard added; ~3 stale entries refreshed; ~40 technical-vocab uses justified-allowlisted; a deliberately-injected NEW taxonomy leak still fails the test (proven) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Every allowlist addition carries a one-line justification (why it is legitimate technical vocab, not a leak) | Each new allowlist entry has an inline rationale; no bare/unexplained entries |
| REQ-005 | The ADR-006 exclusion-assumption logic-sync gap is documented and superseded | `decision-record.md` ADR-007 records that system-spec-kit WAS de-numbered by `5149f3abe5`, contradicting `sk-doc/026` ADR-006's exclusion claim |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All three named vitest suites run green after the repair (evidence: full `vitest run` output for each suite, 0 failures).
- **SC-002**: The workflow-invariance invariant still catches a genuine new leak — proven by a temporary injected-leak run that must FAIL, then reverted (anti-false-green evidence).
- **SC-003**: The `vitest-recovery-followup`-owned `it.fails.skip` line is untouched (evidence: `git diff` shows no change on that line).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | "Fix" the invariant by over-broad allowlisting or disabling it → false green | High | REQ-003 + REQ-004 force per-entry justification and an injected-leak proof; ADR-007 anti-false-green principle is the governing rule |
| Risk | Editing the foreign `vitest-recovery-followup` `it.fails.skip` line | Med | SC-003 pins the line as untouched; scope table calls it out explicitly |
| Risk | Relocating suite (b) assertions to the wrong new rows (guessed, not verified) | Med | Each relocated assertion must be grounded against the actual current doc content, not the pre-reorg memory |
| Dependency | The de-numbering commit `5149f3abe5` is the settled upstream state | Analysis anchor | Treated as frozen; this packet is downstream maintenance only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The `node_modules/` scan guard should reduce, not increase, workflow-invariance scan time (fewer walked paths).

### Security
- **NFR-S01**: No test credential or secret is introduced by any fixture or doc edit.

### Reliability
- **NFR-R01**: All three suites pass deterministically on a clean checkout (no dependence on a local `node_modules/` layout — the guard makes the scan checkout-independent).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty allowlist match: scanner must still flag a truly unknown token, not silently pass.
- Nested `node_modules/`: the guard must exclude nested dependency trees, not just the top-level one.
- A technical-vocab token that later becomes a real leak vector: allowlisting is per-known-legitimate-use, not a blanket token ban-lift.

### Error Scenarios
- Missing de-numbered target file: a repointed assertion whose new path does not resolve must fail loudly (not be silently skipped).
- Partial content-parity: `recentContext` example added but shaped differently than the test asserts → fix the doc to match real intent, not the assertion to match a stub.

### State Transitions
- Injected-leak proof run left un-reverted: the temporary leak MUST be reverted before completion is claimed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 4 files, ~120 invariance hits triaged into 3 classes, 14 flag-reference failures, 1 parity gap |
| Risk | 12/25 | Low blast radius (test + doc only), but a real risk of masking the invariant if done carelessly |
| Research | 8/20 | Triage already done in the investigation; implementation must re-ground each assertion relocation |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Confirm the exact current de-numbered filename that replaces the stale `149-` literal (resolve from the test + on-disk file at implementation time).
- Confirm the resolved `cli-opencode` `prompt_templates.md` path the parity assertion targets.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
