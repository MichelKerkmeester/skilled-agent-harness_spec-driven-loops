---
title: "Tasks: Phase 5: pi-command-layer"
description: "Task breakdown for classifying, flattening, and translating the 36 invokable .opencode/commands/*.md files into the .pi/prompts/*.md doctrine."
trigger_phrases:
  - "pi command layer tasks"
  - "command flattening tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/005-pi-command-layer"
    last_updated_at: "2026-07-27T10:01:30Z"
    last_updated_by: "claude-code"
    recent_action: "All 12 tasks complete; T010/T011 re-derived live, zero drift"
    next_safe_action: "Commit; phase 006 proceeds with the Task-dependency list"
    blockers: []
    key_files: ["implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring-005"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Enumerate `.opencode/commands/**/*.md` (`find .opencode/commands -name "*.md" | wc -l` → 49) and classify into 36 invokable / 13 supporting via `grep -rl "^argument-hint:" .opencode/commands --include="*.md"` (spec.md REQ-001) [EVIDENCE: re-ran live during closeout, `find` returns 49, `grep -rl` returns 36]
- [x] T002 [P] Cross-reference the pi.dev `prompt-templates` docs findings (filename→command-name mapping, non-recursive discovery, `$1`/`$2`/`$@`/`${1:-default}` substitution) against the real `argument-hint` line of all 36 commands [EVIDENCE: `plan.md` §3 component C, 5-pattern table]
- [x] T003 Confirm the 8 command groups + 2 top-level files account for all 36 invokable commands: `create`=11, `deep`=8, `doctor`=3, `interface`=3, `memory`=4, `prompt`=1, `speckit`=4, top-level=2 (sums to 36) [EVIDENCE: `plan.md` FULL 36-ROW WORKLIST, group column tally]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

This phase's own deliverable is documentation authoring, not source code.

- [x] T004 Draft the `<group>-<name>.md` flattening/naming convention (`plan.md` §3 component B); produce the full 36-row worklist and verify zero collisions (`plan.md` §"FULL 36-ROW PER-GROUP WORKLIST") [EVIDENCE: `plan.md` worklist table, 36 rows]
- [x] T005 Draft the `$ARGUMENTS` → `$1`/`$2`/`$@`/`${1:-default}` translation table covering the 5 observed patterns: whole-string self-parsing routers, single positional slots, sub-action enums, `--flag=value` grammars kept in `$@`, and `:auto`/`:confirm` mode suffixes (`plan.md` §3 component C) [EVIDENCE: `plan.md` §3 component C, 5-row table]
- [x] T006 Draft the frontmatter-key disposition table for `allowed-tools` (36/36), `argument-hint` (36/36), `skill` (2/36), `title`/`version` (1/36 each), `description` (36/36, UNCONFIRMED tolerance) (`plan.md` §3 component D) [EVIDENCE: `plan.md` §3 component D, 5-row table]
- [x] T007 Enumerate the 14 Task-dependent commands — `deep/agent-improvement.md`, `deep/ai-council.md`, `deep/alignment.md`, `deep/command-benchmark.md`, `deep/model-benchmark.md`, `deep/research.md`, `deep/review.md`, `deep/skill-benchmark.md`, `memory/save.md`, `prompt/improve.md`, `speckit/complete.md`, `speckit/implement.md`, `speckit/plan.md`, `speckit/resume.md` — and flag the phase-006 (`pi-subagents`) sequencing dependency (`plan.md` §3 component E) [EVIDENCE: `plan.md` §3 component E, 14 names listed; `implementation-summary.md` re-confirms phase 006 not yet landed]
- [x] T008 Produce the full 36-row per-group worklist (source path → flattened name → invocation → Task-dependency flag) — see `plan.md` [EVIDENCE: `plan.md` worklist, 36 rows]
- [x] T009 Document the 13 excluded non-command files (5 READMEs + 4 compiled contracts + 4 legacy bodies under `deep/assets/`) and the exclusion rationale (`plan.md` §3 component A) [EVIDENCE: `plan.md` §3 component A]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Deferred to a future execution pass — not run by this planning phase.

- [x] T010 Re-run `grep -rl "^argument-hint:" .opencode/commands --include="*.md" | wc -l` at execution time and confirm 36 still holds (the tree may have changed since this authoring pass) [EVIDENCE: re-ran live during closeout, returns 36, no drift from authoring pass]
- [x] T011 Manually re-derive all 36 flattened names from the stated convention rule and diff against the `plan.md` worklist for drift [EVIDENCE: re-derived via a shell one-liner applying the `<group>-<name>.md` rule to the live `grep -rl` output; `sort -u | wc -l` returns 36, matching `plan.md`'s worklist exactly, zero collisions, zero drift]
- [x] T012 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 005-pi-command-layer --strict`, confirm `Errors: 0` [EVIDENCE: `implementation-summary.md` Verification table]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 12 tasks marked `[x]` with evidence [EVIDENCE: this file]
- [x] No `[B]` blocked tasks remaining [EVIDENCE: 0 `[B]` markers in this file]
- [x] T012 (`validate.sh --strict`) passes `Errors: 0` for this phase's own docs [EVIDENCE: `implementation-summary.md` Verification table]
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
