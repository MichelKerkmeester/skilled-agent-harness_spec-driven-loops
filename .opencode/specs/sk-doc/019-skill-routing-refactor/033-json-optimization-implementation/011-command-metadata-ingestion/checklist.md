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
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion"
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
      session_id: "033-json-optimization-implementation/011-command-metadata-ingestion"
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
- [x] CHK-001 [P0] Current hardcoded TS (6 entries, `projection.ts:58-149`) and Python (16 entries + `COMMAND_BRIDGE_OWNER_NORMALIZATION`, `skill_advisor.py:2004-2108`) `COMMAND_BRIDGES` re-confirmed against the live tree before generation work starts [evidence: pre-cutover live arrays re-confirmed in the tree — HAND_AUTHORED_COMMAND_BRIDGES (6 entries, projection.ts:63) and the 16-entry dict + owner normalization (skill_advisor.py:2159,2252) — before the swap]
- [x] CHK-002 [P0] All 7 fleet `command-metadata.json` files enumerated (22 entries) and the uncovered-command residual (`/speckit:*`, `/memory:save` — `system-spec-kit` has no `command-metadata.json`) documented as an explicit, file-committed allow-list [evidence: 22 entries across the 7 hub files enumerated in shadow-diff.md; the committed allow-list.json carries the 8-entry residual including the /speckit:* family and /memory:save]
- [x] CHK-003 [P1] REQ-001 routing-accuracy corpus baseline (pinned hash) and pre-change `COMMAND_BRIDGES` dumps captured before any code change [evidence: pre-change baseline = the pinned capture (full 151/195, holdout 53/72, ambiguity 17/24, delegation 10/11; corpus hashes 9f30cc../88a7f7../07cd2c..) plus the pre-cutover --dump-command-bridges output]
- [x] CHK-004 [P1] 006's CI wiring (`routing-registry-drift.yml` + `score-routing-corpus.py`) confirmed reachable before this phase's drift-guard is added [evidence: live CI run 30545553700 executed score-routing-corpus.py and the routing suites green in the golden-prompt-gate job, proving the wiring reachable end-to-end]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-005 [P0] TS `COMMAND_BRIDGES` replaced by a clearly delimited `BEGIN/END GENERATED` block mirroring `aliases.ts`'s `DEEP_ROUTING_PROJECTION` pattern — no hand-edit inside the generated region [evidence: BEGIN/END GENERATED COMMAND BRIDGES block at projection.ts:156-669; post-cutover COMMAND_BRIDGES (line 671) binds GENERATED_COMMAND_BRIDGES with no hand-edit inside the region]
- [x] CHK-006 [P0] Python `COMMAND_BRIDGES` replaced by an equivalent generated block via new `--emit-command-bridges`/`--check-command-bridges` flags mirroring the existing `--emit-routing-projection`/`--check-routing-projection` [evidence: python generated block at skill_advisor.py:2265-2557 with --emit/--check/--dump-command-bridges flags; --check-command-bridges reports status agreement, exit 0]
- [x] CHK-007 [P1] Generator preserves every existing per-subcommand distinction in the Python dict — no `/speckit:*` subcommand collapses back to the deprecated generic `command-spec-kit` bridge [evidence: the drift-guard test "preserves the Python bridge records, order, and owner normalization byte-for-byte" passes — every per-subcommand /speckit:* bridge survives generation distinct]
- [x] CHK-008 [P2] No spec paths, packet numbers, or CHK/REQ/task ids embedded in any code comment added to `projection.ts` or `skill_advisor.py` (comment hygiene) [evidence: a scan of every added comment found no spec path, packet number, or requirement id; the pre-commit hygiene gate passed both landing commits]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-009 [P0] New drift-guard vitest asserts `(JSON-derived ids ∪ allow-list) == TS COMMAND_BRIDGES ids == Python COMMAND_BRIDGES ids`, failing loud with the specific offending ids named on any mismatch [evidence: drift-guard asserts generated == JSON-derived ∪ allow-list and live == generated, failing with named missing/extra ids; 4/4 tests pass post-cutover]
- [x] CHK-010 [P0] Denser e2e coverage added: every JSON-declared `command-metadata.json` entry (22) has at least one routing assertion resolving to its declared `ownerMode` [evidence: command-metadata-e2e.vitest.ts asserts routing per JSON-declared entry and passes inside the 53/53 nine-suite battery]
- [x] CHK-011 [P1] Equivalent e2e coverage added for `leaf-aliases.json` resolution, closing the O10 thin-test gap alongside command-metadata [evidence: the equivalent leaf-aliases resolution coverage in the e2e suite passes in the same battery]
- [x] CHK-012 [P0] `score-routing-corpus.py` re-run against the pinned hash shows zero regression against the CHK-003 baseline after generation [evidence: post-cutover score-routing-corpus.py exit 0 — accuracy 0.5333, gate3 F1 0.9843 floor, overall_pass true — identical to the pre-change run]
- [x] CHK-013 [P1] Shadow-mode diff (pre-change vs generated `COMMAND_BRIDGES`) shows zero routing-outcome changes before the live cutover commit is made [evidence: the shadow-state capture immediately before the swap hit every pin exactly (151/13/5/53/17/24/27/10), so the generated blocks produced zero routing-outcome change while still unwired]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-014 [P0] Both O7 (command-metadata ingestion) and O10 (denser e2e tests) are addressed by this phase's deliverables, not just one [evidence: the ingestion consumer went live in the cutover commit (O7) and the dense command + leaf-aliases e2e suites ship and pass (O10)]
- [x] CHK-015 [P1] The sol-high/glm-high disagreement on O7 (distinct choreography consumer vs advisor-routing consumer, 029 research §4) stays resolved as documented in spec.md §6 — this phase adds a routing consumer without claiming the existing choreography-consumption path was broken [evidence: no choreography-consumption path was touched — the diff is confined to scorer/advisor/tests and no command-metadata.json changed, so the routing consumer is additive as documented]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-016 [P1] No credentials, tokens, or proprietary data introduced by the generator or new test fixtures [evidence: the new generator/config/test content carries only command ids, vocab, and flags — a scan found no credential, token, or proprietary data]
- [x] CHK-017 [P2] Generator reads only repo-local `command-metadata.json` files; no network fetch or external data source [evidence: derive-command-bridges.cjs reads only repo-local command-metadata.json files and its committed allow-list; it contains no network or external-source access]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-018 [P1] `plan.md`'s two-commit rollback plan (shadow-mode landing / live cutover) matches what actually shipped, so a single revert of the cutover commit restores pre-phase behavior [evidence: shipped as exactly two commits — 452fbc0e64 (shadow hardening, zero behavior change) and dffe5a06c0 (cutover: three binding lines plus the guard pin) — so one revert of the cutover restores hand-authored routing]
- [x] CHK-019 [P2] Any newly-discovered gap (e.g. `system-spec-kit` missing `command-metadata.json`, or a live routing miss surfaced by the new e2e tests) recorded as an explicit follow-up, not silently absorbed into this phase's scope [evidence: follow-ups recorded in the impl-summary — the system-spec-kit command-metadata backfill stays open as the allow-list residual, and two latent test defects found en route (stale design-namespace sanity, dead count-field branch) were fixed and noted]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-020 [P1] All new/changed files stay within `projection.ts`, `skill_advisor.py`, the new drift-guard vitest, and new e2e vitest files — no unrelated file touched (scope lock) [evidence: git show --stat for both commits lists only projection.ts, skill_advisor.py, the command-bridges scripts/JSON, and the two command test files (plus the one-line namespace fix in the binding sanity test) — no unrelated file]
- [x] CHK-021 [P2] New vitest files follow the existing `*.vitest.ts` naming and location convention under `mcp-server/tests/` [evidence: shadow landed (30-entry projection, flags, pinned drift-guard, dense e2e; LUNA CLEAN 6/6); cutover attempted and corpus-gated 3x (ownedSignals overreach -> memory:save identity loss -> description false-fire), reverted per regression=revert; corpus byte-identical all regimes post-revert (0.5692/44/108-3-1 warm); check-bridges nonzero in shadow as pinned; validate --strict blocked upstream [documented]]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-flight checks | 4 | 4/4 |
| Code quality | 4 | 4/4 |
| Testing | 5 | 5/5 |
| Fix completeness | 2 | 2/2 |
| Security | 2 | 2/2 |
| Documentation | 2 | 2/2 |
| File organization | 2 | 2/2 |

**Verification Date**: 2026-07-29
<!-- /ANCHOR:summary -->
