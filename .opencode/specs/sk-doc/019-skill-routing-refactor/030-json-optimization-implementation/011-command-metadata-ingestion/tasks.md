---
title: "Task Breakdown: Ingest command-metadata.json into Command Routing"
description: "Tasks for deriving TS and Python COMMAND_BRIDGES from command-metadata.json behind a shadow-mode-first, corpus-gated rollout with a 3-way drift-guard and denser e2e tests."
trigger_phrases:
  - "command bridges generator tasks"
  - "command metadata ingestion tasks"
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
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "030-json-optimization-implementation/011-command-metadata-ingestion"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Task Breakdown: Ingest command-metadata.json into Command Routing

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-01 Re-confirm the current three-way drift against the live tree: TS `COMMAND_BRIDGES` (`projection.ts:58-149`, 6 entries), Python `COMMAND_BRIDGES` + `COMMAND_BRIDGE_OWNER_NORMALIZATION` (`skill_advisor.py:2004-2108`, 16 entries), and every fleet `command-metadata.json` (7 files, 22 entries)
- [ ] T-02 Enumerate commands with no `command-metadata.json` source (today: `/speckit:*`, `/memory:save` — `system-spec-kit` has no such file) and write the documented allow-list residual
- [ ] T-03 Capture the REQ-001 routing-accuracy corpus baseline (pinned hash, `score-routing-corpus.py`) and the pre-change TS/Python `COMMAND_BRIDGES` dumps as the shadow-mode comparison baseline
- [ ] T-04 Confirm 006's CI wiring (`routing-registry-drift.yml` + `score-routing-corpus.py`) is reachable so this phase's drift-guard and corpus-gate run in CI
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-05 Build the canonical command-bridge projection derivation: reads all `command-metadata.json` files plus the T-02 allow-list, emits one ordered projection with `file:line` provenance per entry
- [ ] T-06 Add `--emit-command-bridges` / `--check-command-bridges` / `--dump-command-bridges` flags to `skill_advisor.py`, mirroring the existing `--emit-routing-projection` / `--check-routing-projection` / `--dump-routing-maps` flags
- [ ] T-07 Generate the TS GENERATED block in `projection.ts` from the projection, mirroring `aliases.ts:21-71`'s `DEEP_ROUTING_PROJECTION` pattern — land in shadow mode only, `COMMAND_BRIDGES` still points at the pre-existing hand-authored array
- [ ] T-08 Generate the Python GENERATED block in `skill_advisor.py` from the same projection, preserving every existing per-subcommand distinction and the `COMMAND_BRIDGE_OWNER_NORMALIZATION` map — land in shadow mode only
- [ ] T-09 Write the new drift-guard vitest asserting `(JSON ∪ allow-list) == generated TS ids == generated Python ids`, failing loud with named ids on mismatch
- [ ] T-10 Write denser e2e tests: one routing assertion per JSON-declared `command-metadata.json` entry, plus equivalent `leaf-aliases.json` e2e coverage
- [ ] T-11 Run the shadow-mode diff (T-03 baseline vs generated output) and the corpus regression check (T-03 pinned hash, before/after); confirm zero diff and zero regression
- [ ] T-12 Cut `COMMAND_BRIDGES` over to the generated blocks in both files, as a separate, independently revertible commit from T-05–T-10
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-13 Run the full advisor vitest suite plus the new drift-guard and e2e files; confirm 100% pass
- [ ] T-14 Re-run `score-routing-corpus.py` against the T-03 pinned hash; confirm zero regression post-cutover
- [ ] T-15 Run `--check-command-bridges`; confirm both generated blocks report fresh
- [ ] T-16 Confirm the two-commit structure (shadow-mode landing / live cutover) is in place so the cutover alone is one-command revertible
- [ ] T-17 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict`; confirm Errors:0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

TS and Python `COMMAND_BRIDGES` are generated from `command-metadata.json` plus the documented allow-list; the drift-guard passes clean and fails loud on injected drift; command-metadata/leaf-aliases e2e coverage is dense; the pinned routing-accuracy corpus shows zero regression across the cutover; shadow-mode landing and live cutover are separate, independently revertible commits; `validate --strict` reports Errors:0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

Spec `spec.md` · Plan `plan.md` · QA `checklist.md` · Research `../../029-skill-json-optimization-research/research/research.md` §3 O7/O10 · Program parent `../spec.md`
<!-- /ANCHOR:cross-refs -->
