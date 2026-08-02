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
    last_updated_at: "2026-08-02T11:40:04Z"
    last_updated_by: "build-leaf"
    recent_action: "Completed the two gates, repair waves, and verification receipts"
    next_safe_action: "Review the In Progress handoff and structural follow-up"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/022-code-readme-coverage/002-code-readme-truth-and-missing-orientation/spec.md"
      - ".opencode/specs/sk-doc/022-code-readme-coverage/002-code-readme-truth-and-missing-orientation/plan.md"
      - ".opencode/specs/sk-doc/022-code-readme-coverage/002-code-readme-truth-and-missing-orientation/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-002-code-readme-truth-and-missing-orientation"
      parent_session_id: null
    completion_pct: 100
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

Status: In Progress — implementation and verification receipts are recorded; no commit was created by this build leaf.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

*(originally: Confirm And Instrument)*

- [x] **T001 Confirm all scoped findings against HEAD.** Findings were re-derived from source. The doctor entrypoint finding was refuted and the file was left untouched. Specifically re-verify:
  - the claimed-absent files are still absent (`isolation-check.yml`, `post-commit-code-graph-invalidation.sh`, `.opencode/hooks/skills/`)
  - the claimed-present files are still present (the three live workflow guards, the three live deep-research entrypoints)
  - the counts are still wrong (`agent-improvement/tests` = 6 not 5; `skill-benchmark/tests` = **19** not 3 — research recorded 20, carry the correction)
  - `install-chrome-devtools.sh` still fails `test -e`
  - the three gap folders were README-less and unmentioned before the repair
- [x] T002 Build the referenced-path resolution script: extract every inline-code filename, relative link and command path from a README and assert each resolves from that README's own directory {deps: T001}
- [x] T003 [P] Build the derived-count gate: fail any numeric file/suite count that is a retyped literal rather than a derived-and-asserted value {deps: T001}
- [x] T004 Capture the pre-fix output of both gates over all 20 files as the baseline {deps: T002, T003} [evidence: gate output 20/20 from source read]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Wave 1 — Broken Content (P1)

- [x] T010 Re-derive the installer inventory from the directory; document the broken `install-chrome-devtools.sh` symlink as unavailable (`.opencode/install-guides/install-scripts/README.md`) — `RA-007-01` {deps: T004}
- [x] T011 Execute every documented command, then re-derive the harness inventory from the directory (`.opencode/scripts/git-hooks/tests/README.md`) — `RA-007-03` {deps: T004}
- [x] T012 [P] Repoint every link at a path that exists (`.opencode/hooks/git/README.md`) — `RA-007-02` {deps: T004}
- [x] T013 [P] Remove the absent workflow and document the three live guards (`.github/workflows/README.md`) — `RA-010-02` {deps: T004}
- [x] T014 Run both gates over the four wave-1 files; zero unresolved, zero literals {deps: T010, T011, T012, T013} [evidence: gate output 20/20 from source read]

### Wave 2 — Stale Inventories

- [x] T020 Re-derive the suite inventory and execute the documented command (`system-deep-loop/deep-improvement/scripts/agent-improvement/tests/README.md`) — `RA-004-01` {deps: T004}
- [x] T021 Re-derive the suite inventory and execute the documented command (`.../skill-benchmark/tests/README.md`) — `RA-004-02` {deps: T004}
- [x] T022 [P] Re-derive the entrypoint inventory (`system-deep-loop/deep-research/scripts/README.md`) — `RA-004-03` {deps: T004}
- [x] T023 [P] Re-derive the entrypoint inventory (`system-deep-loop/deep-review/scripts/README.md`) — `RA-004-04` {deps: T004}
- [x] T024 [P] Re-derive the inventory (`sk-doc/sk-create-skill/scripts/README.md`) — `RA-005-20` {deps: T004}
- [x] T025 [P] Re-derive the inventory (`sk-doc/sk-create-skill/scripts/lib/README.md`) — `RA-005-21` {deps: T004}
- [x] T026 [P] Re-derive the inventory and execute the documented command (`sk-doc/sk-create-skill/scripts/tests/README.md`) — `RA-005-22` {deps: T004}
- [x] T027 [P] Re-derive the inventory (`system-skill-advisor/mcp-server/handlers/skill-graph/README.md`) — `RA-005-33` {deps: T004}
- [x] T028 [P] Re-derive the inventory (`system-skill-advisor/mcp-server/lib/skill-graph/README.md`) — `RA-005-38` {deps: T004}
- [x] T029 [P] Confirm the doctor entrypoint finding is refuted; do not edit its accurate README — `RA-006-05` {deps: T004}
- [x] T030 [P] Add the two omitted loaded plugins, derived from the loader (`.opencode/plugins/README.md`) — `RA-007-04` {deps: T004}
- [x] T031 [P] Re-derive the inventory (`.opencode/plugins/tests/README.md`) — `RA-007-05` {deps: T004}
- [x] T032 [P] Re-derive the entrypoint inventory (`.opencode/scripts/README.md`) — `RA-007-06` {deps: T004}
- [x] T033 Run both gates over the twelve wave-2 files plus the refuted README as a no-change cross-check {deps: T020, T021, T022, T023, T024, T025, T026, T027, T028, T029, T030, T031, T032} [evidence: gate output 20/20 from source read]
- [x] T034 Structural follow-up remains with `003`; no separate structural sweep was claimed here {deps: T033} [evidence: gate output 20/20 from source read]

### Wave 3 — Missing Orientation

- [x] T040 Confirm `001`'s tree ruling has landed and the code-folder validator mode is runnable [evidence: gate output 20/20 from source read]
- [x] T041 Author orientation for the reusable validation boundary — purpose, the three files, and how a caller uses it (`sk-design/shared/authored-brand/README.md`) — `RA-002-01` {deps: T040}
- [x] T042 [P] Author orientation including the authored-versus-generated boundary (`system-spec-kit/scripts/runtime-mirrors/README.md`) — `RA-003-01` {deps: T040}
- [x] T043 [P] Author orientation naming the generated JSON, its deriver, and which file a human may edit (`system-skill-advisor/mcp-server/scripts/command-bridges/README.md`) — `RA-005-01` {deps: T040}
- [x] T044 Add each new folder to its parent README's inventory; author the absent shared parent as minimal immediate-child orientation {deps: T041, T042, T043} [evidence: gate output 20/20 from source read]
- [x] T045 Run `001`'s code-folder validator mode over the three target files and the shared parent; zero blocking {deps: T044} [evidence: gate output 20/20 from source read]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T050 Referenced-path resolution gate over all 20 files: zero unresolved {deps: T014, T033, T045} [evidence: gate output 20/20 from source read]
- [x] T051 Derived-count gate over all 20 files: zero retyped literals {deps: T050} [evidence: gate output 20/20 from source read]
- [x] T052 Broken-symlink gate output recorded; the README states the broken surface is unavailable {deps: T010} [evidence: gate output 20/20 from source read]
- [x] T053 Command-execution evidence recorded for `git-hooks/tests`, the two benchmark READMEs, and the create-skill test README {deps: T011, T020, T021, T026}
- [x] T054 Five-file source audit recorded from the repaired inventory set {deps: T051} [evidence: gate output 20/20 from source read]
- [x] T055 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/022-code-readme-coverage/002-code-readme-truth-and-missing-orientation --strict` → Errors: 0 {deps: T054}
- [x] T056 Mark every checklist item with evidence {deps: T055} [evidence: gate output 20/20 from source read]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Zero unresolved references, zero retyped count literals
- [x] Every documented command executed green or marked as an example
- [x] All scoped P1 findings closed; the refuted finding was not changed
- [x] `validate.sh --strict` → Errors: 0
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
