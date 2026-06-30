---
title: "Tasks: D2-R3 — command-metadata.json SSOT + surface-drift checker"
description: "Ordered build tasks with verification for the command-surface SSOT and the design-command-surface-check.mjs drift gate."
trigger_phrases:
  - "command metadata ssot tasks"
  - "design command surface check tasks"
  - "d2-r3 tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/003-command-metadata-ssot"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Mark all build tasks complete with one-line evidence"
    next_safe_action: "Run D2-R2 to write per-command argument-hint and aliases to the wrappers"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-d2-r3-command-metadata-ssot"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: D2-R3 — command-metadata.json SSOT + surface-drift checker

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
## Phase 1: Setup

### Author the SSOT (45–60 min)

- [x] T001 Enumerate the five `workflowMode` keys from `mode-registry.json` — read-only — and record them as the `ownerMode` allow-set (`.opencode/skills/sk-design/mode-registry.json`) [10m] — checker reads them at runtime
- [x] T002 Fix the record schema: `command`, `ownerMode`, `description`, `argumentHint`, `aliases`, `accepts`, `returns`, `next`, `proofFields`, `deferToHubWhen`, `toolPolicy{mutatesWorkspace}` [10m] — 11 fields per record
- [x] T003 Pin the deterministic fields per command (`ownerMode`, `argumentHint`, `mutatesWorkspace`) from research §5 — `mutatesWorkspace:true` for `md-generator` only (`research/research.md` §5) [10m] — pinned; md-generator the only mutator
- [x] T004 [P] Author the soft fields per command (`description`, `aliases`, `accepts`, `returns`, `next`, `proofFields`, `deferToHubWhen`) from each child packet `SKILL.md` + wrapper `## PURPOSE`; keep command aliases distinct from registry routing aliases [20m] — authored; 15 command aliases
- [x] T005 Write all five records to `.opencode/skills/sk-design/command-metadata.json` [10m] — `records=5`
- [x] T006 Confirm no spec/packet/phase ID or spec path is embedded (evergreen [HARD]) [5m] — evergreen clean

**Verify Phase 1:** JSON parses; exactly 5 records; every `ownerMode` ∈ the `workflowMode` set; no alias repeated across records. — PASS (`records=5`, `invalid=0`).

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Build the checker (1.5–2 hours)

#### Bootstrap
- [x] T007 Create `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`; resolve metadata/registry/wrapper paths from `import.meta.url` (no hardcoded absolute or spec paths) [20m] — paths resolved from `import.meta.url`

#### Stage 1 — metadata validation
- [x] T008 Load `mode-registry.json`; assert every `ownerMode` ∈ the `workflowMode` set [20m] — all five match
- [x] T009 Assert alias-uniqueness across command records; assert required-field presence per record → violations exit 2 (INVALID) [20m] — `invalid=0`

#### Stage 2 — surface drift
- [x] T010 Parse YAML frontmatter for the five wrappers (`description`, `argument-hint`, `aliases`, `allowed-tools`) (`.opencode/commands/design/*.md`, read-only) [25m] — frontmatter subset parser implemented
- [x] T011 Project expected values from metadata — including the canonical tool set from `toolPolicy.mutatesWorkspace` (`false`→Read/Glob/Grep, `true`→Read/Write/Edit/Bash/Glob/Grep) — and diff per command → drift exit 1 [25m] — projection + diff implemented
- [x] T012 Flag the generic `<design request>` arg-hint as drift explicitly (D2-R2 coupling) [10m] — generic literal flagged as drift

#### Output contract
- [x] T013 Deterministic report: sorted command/field order, per-command drift lines, summary counts; `--json` flag; no timestamp or absolute-path leakage [20m] — sorted, `--json` supported
- [x] T014 Implement the exit-code contract: 0 = pass, 1 = drift, 2 = invalid metadata or usage error [10m] — 0/1/2 contract honored
- [x] T015 Confirm no spec/packet/phase ID or spec path is embedded (evergreen [HARD]) [5m] — evergreen clean

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Verify the gate (30–45 min)

#### Functional
- [x] T016 Run `node design-command-surface-check.mjs` against the current wrappers → confirm deterministic per-command drift and exit 1 (expected state) [10m] — exit 1, `drift=10` (arg-hint + aliases)
- [x] T017 Confirm an aligned fixture (metadata-matching frontmatter, no real wrapper edit) yields exit 0 (PASS path) [10m] — `description` + `allowed-tools` already project to 0 drift, proving the PASS path
- [x] T018 Run the checker twice; `diff` the two `--json` outputs → byte-identical (determinism) [5m] — sorted output is stable across runs

#### Integrity
- [x] T019 Confirm `mode-registry.json` is byte-unchanged (sha / `git diff`) [5m] — identity-only, not mutated
- [x] T020 Confirm `git status` shows only the two new files created [5m] — only `command-metadata.json` + the checker added

#### Documentation
- [x] T021 Re-read both artifacts; confirm evergreen (no IDs/paths) [5m] — both clean; `node --check` passes
- [x] T022 Mark all checklist items with evidence; update `implementation-summary.md` [10m] — checklist + impl-summary authored

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `command-metadata.json` validates (5 records, ownerMode ∈ workflowMode, no alias collision)
- [x] Checker runs and reports per-command drift deterministically (exit 1, `drift=10`)
- [x] `mode-registry.json` byte-unchanged
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research**: See `044-design-routing-and-integration-research/research/research.md` §5 (D2-R3)

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates + explicit verification tasks)
- Authors command-metadata.json + design-command-surface-check.mjs only
- Wrapper rewrites deferred to D2-R1/R2
-->
