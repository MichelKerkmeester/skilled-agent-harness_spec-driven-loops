---
title: "Tasks: Phase 5: pi-command-layer [template:level-1/tasks.md]"
description: "Task breakdown for classifying, flattening, and translating the 36 invokable .opencode/commands/*.md files into the .pi/prompts/*.md doctrine."
trigger_phrases:
  - "pi command layer tasks"
  - "command flattening tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/005-pi-command-layer"
    last_updated_at: "2026-07-27T07:50:00Z"
    last_updated_by: "claude-code"
    recent_action: "tasks.md drafted: 12 tasks, 14 Task-dependent commands enumerated"
    next_safe_action: "Author checklist.md"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring-005"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: pi-command-layer

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Enumerate `.opencode/commands/**/*.md` (`find .opencode/commands -name "*.md" | wc -l` → 49) and classify into 36 invokable / 13 supporting via `grep -rl "^argument-hint:" .opencode/commands --include="*.md"` (spec.md REQ-001)
- [ ] T002 [P] Cross-reference the pi.dev `prompt-templates` docs findings (filename→command-name mapping, non-recursive discovery, `$1`/`$2`/`$@`/`${1:-default}` substitution) against the real `argument-hint` line of all 36 commands
- [ ] T003 Confirm the 8 command groups + 2 top-level files account for all 36 invokable commands: `create`=11, `deep`=8, `doctor`=3, `interface`=3, `memory`=4, `prompt`=1, `speckit`=4, top-level=2 (sums to 36)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

This phase's own deliverable is documentation authoring, not source code.

- [ ] T004 Draft the `<group>-<name>.md` flattening/naming convention (`plan.md` §3 component B); produce the full 36-row worklist and verify zero collisions (`plan.md` §"FULL 36-ROW PER-GROUP WORKLIST")
- [ ] T005 Draft the `$ARGUMENTS` → `$1`/`$2`/`$@`/`${1:-default}` translation table covering the 5 observed patterns: whole-string self-parsing routers, single positional slots, sub-action enums, `--flag=value` grammars kept in `$@`, and `:auto`/`:confirm` mode suffixes (`plan.md` §3 component C)
- [ ] T006 Draft the frontmatter-key disposition table for `allowed-tools` (36/36), `argument-hint` (36/36), `skill` (2/36), `title`/`version` (1/36 each), `description` (36/36, UNCONFIRMED tolerance) (`plan.md` §3 component D)
- [ ] T007 Enumerate the 14 Task-dependent commands — `deep/agent-improvement.md`, `deep/ai-council.md`, `deep/alignment.md`, `deep/command-benchmark.md`, `deep/model-benchmark.md`, `deep/research.md`, `deep/review.md`, `deep/skill-benchmark.md`, `memory/save.md`, `prompt/improve.md`, `speckit/complete.md`, `speckit/implement.md`, `speckit/plan.md`, `speckit/resume.md` — and flag the phase-006 (`pi-subagents`) sequencing dependency (`plan.md` §3 component E)
- [ ] T008 Produce the full 36-row per-group worklist (source path → flattened name → invocation → Task-dependency flag) — see `plan.md`
- [ ] T009 Document the 13 excluded non-command files (5 READMEs + 4 compiled contracts + 4 legacy bodies under `deep/assets/`) and the exclusion rationale (`plan.md` §3 component A)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Deferred to a future execution pass — not run by this planning phase.

- [ ] T010 [B] Re-run `grep -rl "^argument-hint:" .opencode/commands --include="*.md" | wc -l` at execution time and confirm 36 still holds (the tree may have changed since this authoring pass) — blocked on execution, not authorable now
- [ ] T011 [B] Manually re-derive all 36 flattened names from the stated convention rule and diff against the `plan.md` worklist for drift — blocked on execution
- [ ] T012 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 005-pi-command-layer --strict`, confirm `Errors: 0` — this task alone is runnable now, at doc-completion time, since it validates the docs themselves rather than live Pi behavior
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (T010/T011 remain intentionally `[B]` — blocked on a future execution pass touching real `.pi/prompts/` files, which this planning-only phase does not create)
- [ ] No `[B]` blocked tasks remaining once a future execution pass runs T010/T011
- [ ] T012 (`validate.sh --strict`) passes `Errors: 0` for this phase's own docs
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md` (full worklist, translation table, frontmatter disposition table)
- **Predecessor**: `../004-pi-skill-discovery-bridge/`
- **Successor**: `../006-pi-agent-bridge/` — depends on the 14 Task-dependent commands enumerated in T007
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
