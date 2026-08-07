---
title: "Tasks: Code README Truth And Missing Orientation"
description: "Task list for child 002: instrument two truth gates (referenced-path resolution and derived-count), then fix broken content, stale inventories and missing orientation across the 20 findings in three waves, then verify."
trigger_phrases:
  - "code readme truth tasks"
  - "readme missing orientation tasks"
importance_tier: "normal"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-doc/022-code-readme-coverage/002-code-readme-truth-and-missing-orientation"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored task list across setup, three fix waves and verification"
    next_safe_action: "Start T001: confirm all 20 findings against HEAD"
    blockers:
      - "T040 (wave 3) blocked on 001's tree ruling landing"
    key_files:
      - ".opencode/specs/sk-doc/022-code-readme-coverage/002-code-readme-truth-and-missing-orientation/spec.md"
      - ".opencode/specs/sk-doc/022-code-readme-coverage/002-code-readme-truth-and-missing-orientation/plan.md"
      - ".opencode/specs/sk-doc/022-code-readme-coverage/002-code-readme-truth-and-missing-orientation/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-002-code-readme-truth-and-missing-orientation"
      parent_session_id: null
    completion_pct: 0
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

# Tasks: Code README Truth And Missing Orientation

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) {deps: T###}`

Status: Planned — no task is started.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

*(originally: Confirm And Instrument)*

- [ ] **T001 Confirm all 20 findings against HEAD.** Findings are hypotheses. For every ID record confirmed / drifted / refuted with file:line. Specifically re-verify:
  - the claimed-absent files are still absent (`isolation-check.yml`, `post-commit-code-graph-invalidation.sh`, `.opencode/hooks/skills/`)
  - the claimed-present files are still present (the three live workflow guards, the three live deep-research entrypoints)
  - the counts are still wrong (`agent-improvement/tests` = 6 not 5; `skill-benchmark/tests` = **19** not 3 — research recorded 20, carry the correction)
  - `install-chrome-devtools.sh` still fails `test -e`
  - the three gap folders are still README-less **and** still unmentioned by their parent READMEs
- [ ] T002 Build the referenced-path resolution script: extract every inline-code filename, relative link and command path from a README and assert each resolves from that README's own directory {deps: T001}
- [ ] T003 [P] Build the derived-count gate: fail any numeric file/suite count that is a retyped literal rather than a derived-and-asserted value {deps: T001}
- [ ] T004 Capture the pre-fix output of both gates over all 20 files as the baseline {deps: T002, T003}
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Wave 1 — Broken Content (P1)

- [ ] T010 Re-derive the installer inventory from the directory; state the real count as derived, and either repair or document the broken `install-chrome-devtools.sh` symlink (`.opencode/install-guides/install-scripts/README.md`) — `RA-007-01` {deps: T004}
- [ ] T011 Execute every documented command, then re-derive the harness inventory from the directory (`.opencode/scripts/git-hooks/tests/README.md`) — `RA-007-03` {deps: T004}
- [ ] T012 [P] Repoint every link at a path that exists (`.opencode/hooks/git/README.md`) — `RA-007-02` {deps: T004}
- [ ] T013 [P] Remove the absent workflow and document `naming-standard-guard.yml`, `runtime-no-spec-import.yml` and `spec-root-resolution-matrix.yml` (`.github/workflows/README.md`) — `RA-010-02` {deps: T004}
- [ ] T014 Run both gates over the four wave-1 files; zero unresolved, zero literals {deps: T010, T011, T012, T013}

### Wave 2 — Stale Inventories

- [ ] T020 Re-derive the suite inventory and execute the documented command (`system-deep-loop/deep-improvement/scripts/agent-improvement/tests/README.md`) — `RA-004-01` {deps: T004}
- [ ] T021 Re-derive the suite inventory and execute the documented command (`.../skill-benchmark/tests/README.md`) — `RA-004-02` {deps: T004}
- [ ] T022 [P] Re-derive the entrypoint inventory (`system-deep-loop/deep-research/scripts/README.md`) — `RA-004-03` {deps: T004}
- [ ] T023 [P] Re-derive the entrypoint inventory (`system-deep-loop/deep-review/scripts/README.md`) — `RA-004-04` {deps: T004}
- [ ] T024 [P] Re-derive the inventory (`sk-doc/sk-create-skill/scripts/README.md`) — `RA-005-20` {deps: T004}
- [ ] T025 [P] Re-derive the inventory (`sk-doc/sk-create-skill/scripts/lib/README.md`) — `RA-005-21` {deps: T004}
- [ ] T026 [P] Re-derive the inventory and execute the documented command (`sk-doc/sk-create-skill/scripts/tests/README.md`) — `RA-005-22` {deps: T004}
- [ ] T027 [P] Re-derive the inventory (`system-skill-advisor/mcp-server/handlers/skill-graph/README.md`) — `RA-005-33` {deps: T004}
- [ ] T028 [P] Re-derive the inventory (`system-skill-advisor/mcp-server/lib/skill-graph/README.md`) — `RA-005-38` {deps: T004}
- [ ] T029 [P] Re-derive the entrypoint inventory (`.opencode/commands/doctor/scripts/README.md`) — `RA-006-05` {deps: T004}
- [ ] T030 [P] Add the two omitted loaded plugins, derived from the loader (`.opencode/plugins/README.md`) — `RA-007-04` {deps: T004}
- [ ] T031 [P] Re-derive the inventory (`.opencode/plugins/tests/README.md`) — `RA-007-05` {deps: T004}
- [ ] T032 [P] Re-derive the entrypoint inventory (`.opencode/scripts/README.md`) — `RA-007-06` {deps: T004}
- [ ] T033 Run both gates over the thirteen wave-2 files {deps: T020, T021, T022, T023, T024, T025, T026, T027, T028, T029, T030, T031, T032}
- [ ] T034 Escalate to `003` any structural defect noticed in a wave-2 file; do not fix structure here {deps: T033}

### Wave 3 — Missing Orientation

- [ ] T040 [B] Confirm `001`'s tree ruling has landed and the code-folder validator mode is runnable
- [ ] T041 Author orientation for the reusable validation boundary — purpose, the three files, and how a caller uses it (`sk-design/shared/authored-brand/README.md`) — `RA-002-01` {deps: T040}
- [ ] T042 [P] Author orientation including the authored-versus-generated boundary (`system-spec-kit/scripts/runtime-mirrors/README.md`) — `RA-003-01` {deps: T040}
- [ ] T043 [P] Author orientation naming the generated JSON, its deriver, and which file a human may edit (`system-skill-advisor/mcp-server/scripts/command-bridges/README.md`) — `RA-005-01` {deps: T040}
- [ ] T044 Add each new folder to its parent README's inventory so it is discoverable; touch only that row {deps: T041, T042, T043}
- [ ] T045 Run `001`'s code-folder validator mode over the three new files; zero blocking {deps: T044}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T050 Referenced-path resolution gate over all 20 files: zero unresolved {deps: T014, T033, T045}
- [ ] T051 Derived-count gate over all 20 files: zero retyped literals {deps: T050}
- [ ] T052 Broken-symlink gate: `find .opencode/install-guides/install-scripts -type l ! -exec test -e {} \; -print` returns empty, or the README states the surface is unavailable {deps: T010}
- [ ] T053 Command-execution evidence recorded for `git-hooks/tests` and the three benchmark test READMEs {deps: T011, T020, T021, T026}
- [ ] T054 Second reader audits 5 of the 20 files against source and records per-file verdicts {deps: T051}
- [ ] T055 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/022-code-readme-coverage/002-code-readme-truth-and-missing-orientation --strict` → Errors: 0 {deps: T054}
- [ ] T056 Mark every checklist item with evidence {deps: T055}
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Zero unresolved references, zero retyped count literals
- [ ] Every documented command executed green or marked as an example
- [ ] All 8 P1 findings closed
- [ ] `validate.sh --strict` → Errors: 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: `sk-doc/022-code-readme-coverage`
- **Upstream**: `001-code-readme-standard-and-enforcement` (soft gate; hard for wave 3)
- **Downstream**: `003-code-readme-structure-and-durability-sweep` re-runs this phase's resolution gate per lane
<!-- /ANCHOR:cross-refs -->
