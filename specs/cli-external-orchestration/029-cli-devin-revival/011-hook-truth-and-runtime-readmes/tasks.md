---
title: "Tasks: Devin hook truth and runtime README parity"
description: "Track the bounded correction of current Devin hook documentation, runtime discovery mirrors, approved Zed MCP cleanup and verification evidence."
trigger_phrases:
  - "Devin hook truth tasks"
  - "runtime README parity tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/011-hook-truth-and-runtime-readmes"
    last_updated_at: "2026-07-26T19:05:13Z"
    last_updated_by: "opencode"
    recent_action: "Completed phase 011 with recursive strict validation"
    next_safe_action: "Rotate or revoke the removed credentials in the provider dashboards"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-011-hook-truth"
      parent_session_id: null
    completion_pct: 100
    open_questions: ["Provider-side credential rotation remains operator-only."]
    answered_questions: ["Current branch selected."]
---
# Tasks: Devin Hook Truth and Runtime README Parity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable |
| `[B]` | Blocked by an external actor or decision |

**Task Format**: `T### [P?] Description (evidence)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm parent phase scope, Level 3 depth and current-branch execution choice (`Use current branch` selected in session).
- [x] T002 Capture recursive strict packet baseline: 0 errors and 0 warnings across parent plus 10 children (`validate.sh --recursive --strict`).
- [x] T003 [P] Capture README baseline: Claude, Codex and Cursor mirrors each fail only for missing `OVERVIEW`; seven Devin READMEs pass.
- [x] T004 [P] Count corrected registration: 8 events, 11 matcher groups, 19 commands and no wrapper keys (`.devin/hooks.v1.json`).
- [x] T005 Scaffold phase 011 from manifest-backed templates; `inline-gate-renderer.sh --level 3` succeeded after the upgrade helper safely restored from a missing legacy addendum path.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Correct `../hook-testing-results.md`, parent `../spec.md`, handover and continuation prompt to lead with tests 10-14 as current truth.
- [x] T007 [P] Correct completed phase 004 docs while preserving the superseded negative experiment as dated history. [EVIDENCE: `004-devin-hook-adapter-layer/implementation-summary.md` records corrected live status and superseded inference.]
- [x] T008 [P] Correct completed phase 008 docs and retain `PermissionRequest`, `PostCompaction`, `run_subagent` and deny-branch caveats.
- [x] T009 [P] Correct phase 006 and 010 planned requirements so future artifacts use observed/unobserved status, not a dormant enum. [EVIDENCE: both child `spec.md` files now require event-specific evidence states.]
- [x] T010 Refresh the seven Devin hook READMEs from current registration and payload evidence. [EVIDENCE: 7/7 Devin `validate_document.py` checks passed.]
- [x] T011 Refresh Claude, Codex, Cursor and Devin discovery-mirror READMEs with validator-conformant orientation and exact inventories. [EVIDENCE: 4/4 discovery README validators passed.]
- [x] T012 Add `.cursor/hooks/mcp-route-guard.mjs` as a relative discovery symlink; leave `.cursor/hooks.json` unchanged.
- [x] T013 Remove approved Zed `figma`, `web-to-mcp` and `spec_kit_memory` entries and correct the `code_mode` path.
- [x] T014 Refresh affected `description.json` and `graph-metadata.json` files using the metadata scripts. [EVIDENCE: scoped `generate-description.js` and graph backfill runs reported zero failures and zero drift.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run focused hook-truth grep and classify every surviving dormancy reference as historical or independently current. [EVIDENCE: focused `rg -n dormant` output contains only superseded history and independent dormant conditions.]
- [x] T016 [P] Validate all eleven target READMEs with `validate_document.py`.
- [x] T017 [P] Verify the Cursor symlink target and prove `.cursor/hooks.json` is unchanged.
- [x] T018 [P] Parse Zed settings and prove obsolete server keys plus local credentials are absent. [EVIDENCE: bounded JSONC assertion returned `zed settings: PASS`.]
- [x] T019 [P] Recount `.devin/hooks.v1.json` and re-run the bounded live `devin -p` confirmation; result: `YES`.
- [x] T020 Run strict phase validation, recursive parent validation, placeholder checks and target-only diff review. [EVIDENCE: recursive `validate.sh --recursive --strict` passed parent plus 11 children with 0 errors and 0 warnings.]
- [x] T021 Update `implementation-summary.md`, checklist evidence and continuity metadata to the verified final state. [EVIDENCE: `implementation-summary.md`, `checklist.md` and generated metadata record the complete state.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 and P1 tasks are complete or explicitly user-deferred.
- [x] No unclassified false dormancy claim remains in current operational docs.
- [x] No local exposed credential value remains in Zed settings.
- [x] Recursive strict validation passes with 0 errors and 0 warnings.
- [x] Unrelated concurrent work remains untouched.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent**: See `../spec.md`
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Evidence**: See `../hook-testing-results.md`
<!-- /ANCHOR:cross-refs -->
