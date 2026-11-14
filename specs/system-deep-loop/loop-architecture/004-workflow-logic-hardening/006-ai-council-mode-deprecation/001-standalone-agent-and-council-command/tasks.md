---
title: "Tasks: Phase 1: standalone-agent-and-council-command"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "standalone agent and council command tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: standalone-agent-and-council-command

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Shell variables used below. `S` is `.skilled/skills/system-deep-loop`. `R` is `.skilled/skills/system-deep-loop/runtime`. `A` is `.skilled/skills/system-skill-advisor/runtime`. `K` is `.skilled/skills/system-spec-kit/runtime/cli`. `C` is `.skilled/commands`. `P` is the phase parent `specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation`, which holds the shared `scratch/` files and the parent `goal.md`. `H` is this child folder. `Q` is the council prompt "convene an ai council to compare three migration plans". Run every command from the repository root. Task ids come from the task list this phase had before it was split, so a task keeps its id in the child that owns it. Ids from T090 up were added at the split.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phases 004 and 005 are Complete (`specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/`). Verify: `rg -l -F '| **Status** | Complete' specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/00[45]-*/spec.md | wc -l` prints 2.
- [ ] T002 Record the operator's D3 decision as a line `D3 decision: option A` or `D3 decision: option B`, plus the start SHA, in the log (`$P/goal.md`). Verify: `rg -n '^D3 decision: option [AB]$|^Start SHA: ' $P/goal.md` prints 2 lines.
- [ ] T003 Rerun the council inventory and save it beside the baseline (`$P/scratch/council-inventory-start.txt`). Verify: `wc -l < $P/scratch/council-inventory-start.txt` prints a count, logged in `goal.md` beside 451.
- [ ] T004 Capture every gate in the precedent list `specs/system-deep-loop/loop-architecture/003-deprecate-improvement-modes/010-verification-and-closeout/scratch/baseline.md` that still applies, plus the gates in `plan.md` section 5, with exit status and counts (`$P/scratch/gate-baseline.md`). Verify: `rg -c '^\| ' $P/scratch/gate-baseline.md` prints at least 25 and the file names the start SHA.
- [ ] T005 Write the history allowlist for the sweep: changelogs, dated benchmark reports, spec-copy fixtures, `cite-drift-redirects.json` and CI ignore paths into archived specs (`$P/scratch/exceptions.md`). Verify: `sed 's/^- //' $P/scratch/exceptions.md | xargs ls >/dev/null` exits 0, so every listed path exists.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Agent first (D2)
- [ ] T006 Move the artifact layout and output schema into the agent body and drop every packet path, script call and `node` instruction (`.skilled/agents/ai-council.md`). Verify: `rg -n 'system-deep-loop|deep-ai-council|/deep:ai-council|append-mode-event|persist-artifacts|node ' .skilled/agents/ai-council.md` prints nothing and the frontmatter still says `bash: deny`.
- [ ] T007 Apply the same body to the Claude twin (`.claude/agents/ai-council.md`). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs --all` exits 0.
- [ ] T008 Regenerate the Codex agent (`.codex/agents/ai-council.toml`). Verify: `node $K/codex/sync-agents.cjs --check` exits 0.
- [ ] T009 Regenerate the Pi agent (`.pi/agents/ai-council.md`). Verify: `node $K/pi/sync-agents-pi.cjs --check` exits 0.
- [ ] T010 Regenerate the DSH agent (`.dsh/agents/ai-council.patch.yml`). Verify: `node $K/dsh/sync-agents-dsh.cjs --check` exits 0.
- [ ] T011 Confirm the symlink mirrors still resolve (`.cursor/agents/ai-council.md`). Verify: `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` exits 0 and `find -L .skilled/agents .claude/agents .codex/agents .cursor/agents .devin/agents .dsh/agents .opencode/agents .pi/agents -maxdepth 1 -name 'ai-council*' | wc -l` prints 8.
- [ ] T012 Drop `@ai-council` from the deep-route rule and keep it as a LEAF (`.skilled/agents/orchestrate.md`). Verify: `rg -n 'Deep Route' .skilled/agents/orchestrate.md | rg 'ai-council' | wc -l` prints 0, and the checks from T007 to T010 exit 0 again after the twin and generators run.

### Kept command (D3 option B)
- [ ] T013 Write the single-round council command doc that binds the spec folder and dispatches the agent once (`$C/speckit/ai-council.md`). Verify: `rg -c 'speckit-ai-council.yaml|speckit-ai-council-presentation.txt' $C/speckit/ai-council.md` prints at least 2.
- [ ] T014 Write the one workflow file for both modes (`$C/speckit/assets/speckit-ai-council.yaml`). Verify: `ls $C/speckit/assets/speckit-ai-council*.yaml | wc -l` prints 1.
- [ ] T015 Write the presentation file (`$C/speckit/assets/speckit-ai-council-presentation.txt`). Verify: `ls $C/speckit/assets/speckit-ai-council-presentation.txt` prints the path.
- [ ] T016 Add the command row with owner `system-spec-kit` (`.skilled/skills/system-spec-kit/command-metadata.json`). Verify: `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` exits 0.
- [ ] T017 Add the command to the advisor's tracked commands with owner `system-spec-kit` (`$A/lib/command-attach.ts`). Verify: `rg -n "'/speckit:ai-council'" $A/lib/command-attach.ts` prints at least 1 line, and after the mirror syncs `find -L .claude/commands .cursor/commands .opencode/commands .codex/prompts .pi/prompts .dsh/prompts -maxdepth 2 \( -path '*/speckit/ai-council.md' -o -name 'speckit-ai-council.md' \) | wc -l` prints 6.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T099 Dispatch the rewritten agent once against a scratch spec folder and confirm it writes only council artifacts (`.skilled/agents/ai-council.md`). Verify: `git status --porcelain` in the scratch folder lists only paths under `ai-council/`.
- [ ] T090 Validate this child folder (`$H/spec.md`). Verify: `bash $K/spec/validate.sh $H --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every focused check this child names was rerun from its final tree, with output and exit status read
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task stays `[B]` while the child before this one is not Complete. A `[B]` task blocks close. CHK ids below 060 come from the checklist this phase had before it was split. Ids from 060 up were added at the split.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `rg -c '^\| REQ-' spec.md` prints 4.
- [ ] CHK-002 [P0] `rg -c '^## 4. IMPLEMENTATION PHASES' plan.md` prints 1.
- [ ] CHK-003 [P1] `rg -n '^D3 decision: option [AB]$' ../goal.md` prints 1 line.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-068 [P1] `cd .skilled/skills/system-skill-advisor/runtime && npm run typecheck` exits 0 after T017.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-071 [P0] `node .skilled/bin/check-agent-mirror-sync.cjs --all` and `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-008 [P1] N/A: this child removes nothing. Child 005 owns the finding class and the sweep.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] `rg -n '^  bash:' .skilled/agents/ai-council.md` prints `  bash: deny`.
- [ ] CHK-031 [P0] `rg -n 'ai-council/\*\*' .skilled/agents/ai-council.md` prints at least 1 line stating the write boundary.
- [ ] CHK-032 [P1] N/A: no auth surface changes.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `rg -o 'REQ-0[0-9]+' spec.md | sort -u` and `rg -o 'REQ-0[0-9]+' acceptance-criteria.md | sort -u` print the same ids.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-052 [P1] `git status --porcelain` lists no new file outside the files this spec names, this folder and `../scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 0/5 |
| P1 Items | 6 | 0/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
