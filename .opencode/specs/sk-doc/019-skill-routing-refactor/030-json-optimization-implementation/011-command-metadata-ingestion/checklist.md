---
title: "Checklist: Ingest command-metadata.json into Command Routing"
description: "QA checklist for deriving TS and Python COMMAND_BRIDGES from command-metadata.json behind a shadow-mode-first, corpus-gated rollout with a 3-way drift-guard and denser e2e tests."
trigger_phrases:
  - "command bridges generator checklist"
  - "command metadata ingestion checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/011-command-metadata-ingestion"
    last_updated_at: "2026-07-29T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Depends on 006 (routing-accuracy CI gate)"
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "030-json-optimization-implementation/011-command-metadata-ingestion"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Ingest command-metadata.json into Command Routing

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item carries a command or artifact reference. All items stay `[ ]` until implementation runs (this packet is Planned).

| Priority | Meaning | Rule |
|----------|---------|------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] CHK-001 [P0] Current hardcoded TS (6 entries, `projection.ts:58-149`) and Python (16 entries + `COMMAND_BRIDGE_OWNER_NORMALIZATION`, `skill_advisor.py:2004-2108`) `COMMAND_BRIDGES` re-confirmed against the live tree before generation work starts
- [ ] CHK-002 [P0] All 7 fleet `command-metadata.json` files enumerated (22 entries) and the uncovered-command residual (`/speckit:*`, `/memory:save` — `system-spec-kit` has no `command-metadata.json`) documented as an explicit, file-committed allow-list
- [ ] CHK-003 [P1] REQ-001 routing-accuracy corpus baseline (pinned hash) and pre-change `COMMAND_BRIDGES` dumps captured before any code change
- [ ] CHK-004 [P1] 006's CI wiring (`routing-registry-drift.yml` + `score-routing-corpus.py`) confirmed reachable before this phase's drift-guard is added
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-005 [P0] TS `COMMAND_BRIDGES` replaced by a clearly delimited `BEGIN/END GENERATED` block mirroring `aliases.ts`'s `DEEP_ROUTING_PROJECTION` pattern — no hand-edit inside the generated region
- [ ] CHK-006 [P0] Python `COMMAND_BRIDGES` replaced by an equivalent generated block via new `--emit-command-bridges`/`--check-command-bridges` flags mirroring the existing `--emit-routing-projection`/`--check-routing-projection`
- [ ] CHK-007 [P1] Generator preserves every existing per-subcommand distinction in the Python dict — no `/speckit:*` subcommand collapses back to the deprecated generic `command-spec-kit` bridge
- [ ] CHK-008 [P2] No spec paths, packet numbers, or CHK/REQ/task ids embedded in any code comment added to `projection.ts` or `skill_advisor.py` (comment hygiene)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-009 [P0] New drift-guard vitest asserts `(JSON-derived ids ∪ allow-list) == TS COMMAND_BRIDGES ids == Python COMMAND_BRIDGES ids`, failing loud with the specific offending ids named on any mismatch
- [ ] CHK-010 [P0] Denser e2e coverage added: every JSON-declared `command-metadata.json` entry (22) has at least one routing assertion resolving to its declared `ownerMode`
- [ ] CHK-011 [P1] Equivalent e2e coverage added for `leaf-aliases.json` resolution, closing the O10 thin-test gap alongside command-metadata
- [ ] CHK-012 [P0] `score-routing-corpus.py` re-run against the pinned hash shows zero regression against the CHK-003 baseline after generation
- [ ] CHK-013 [P1] Shadow-mode diff (pre-change vs generated `COMMAND_BRIDGES`) shows zero routing-outcome changes before the live cutover commit is made
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-014 [P0] Both O7 (command-metadata ingestion) and O10 (denser e2e tests) are addressed by this phase's deliverables, not just one
- [ ] CHK-015 [P1] The sol-high/glm-high disagreement on O7 (distinct choreography consumer vs advisor-routing consumer, 029 research §4) stays resolved as documented in spec.md §6 — this phase adds a routing consumer without claiming the existing choreography-consumption path was broken
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-016 [P1] No credentials, tokens, or proprietary data introduced by the generator or new test fixtures
- [ ] CHK-017 [P2] Generator reads only repo-local `command-metadata.json` files; no network fetch or external data source
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-018 [P1] `plan.md`'s two-commit rollback plan (shadow-mode landing / live cutover) matches what actually shipped, so a single revert of the cutover commit restores pre-phase behavior
- [ ] CHK-019 [P2] Any newly-discovered gap (e.g. `system-spec-kit` missing `command-metadata.json`, or a live routing miss surfaced by the new e2e tests) recorded as an explicit follow-up, not silently absorbed into this phase's scope
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-020 [P1] All new/changed files stay within `projection.ts`, `skill_advisor.py`, the new drift-guard vitest, and new e2e vitest files — no unrelated file touched (scope lock)
- [ ] CHK-021 [P2] New vitest files follow the existing `*.vitest.ts` naming and location convention under `mcp-server/tests/`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-flight checks | 4 | 0/4 |
| Code quality | 4 | 0/4 |
| Testing | 5 | 0/5 |
| Fix completeness | 2 | 0/2 |
| Security | 2 | 0/2 |
| Documentation | 2 | 0/2 |
| File organization | 2 | 0/2 |

**Verification Date**: Pending (packet Planned, not yet implemented)
<!-- /ANCHOR:summary -->
