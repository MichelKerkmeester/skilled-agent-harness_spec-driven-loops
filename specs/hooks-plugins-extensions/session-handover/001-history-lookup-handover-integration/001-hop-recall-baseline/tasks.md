---
title: "Tasks: Phase 1: hop-recall-baseline"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hop recall baseline tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: hop-recall-baseline

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Shell variables this list uses**, exported once from the repository root:

```bash
export A=.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md
export B=.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-baseline-conversation.md
export IDX=.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md
export PKT=specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/001-hop-recall-baseline
```
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the wrapper and the enable flag exist (`README.md`). Verify: `test -x .skilled/bin/skilled-loop && echo ok` prints `ok`, and `rg -n 'SYSTEM_SESSION_RELAUNCH_ENABLED=1' .skilled/hooks/session-relaunch/README.md` prints line 93.
- [x] T002 Record the playbook validator's baseline count (`validate-playbook-package.cjs`). Verify: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook --repo-root . --skills-root .skilled/skills` prints `scenarios=124 violations=0`.
- [x] T003 Confirm the code generator yields the expected code (`compaction-history-recall-conversation.md`). Verify: `node -e 'const A="ABCDEFGHJKMNPQRSTUVWXYZ23456789";let x=20261108;const r=()=>{x=(x*1103515245+12345)%2147483648;return x};const L=[];for(let i=1;i<=120;i++){let v="";for(let j=0;j<8;j++)v+=A[r()%A.length];L.push("K"+String(i).padStart(3,"0")+" "+v)}console.log(L[72])'` prints `K073 PDSNMMBW`.
- [x] T004 Confirm the handover names no locator (`relaunch-core.cjs`, `session-relaunch.cjs`). Verify: `rg -n --include-zero --sort path -c 'historyLocator' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs .skilled/hooks/session-relaunch/bin/session-relaunch.cjs .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` prints `relaunch-core.cjs:0`, `session-relaunch.cjs:0` and `compact-inject.ts:16`.
- [x] T005 Confirm the runner cannot drive a hop (`validate-playbook-package.cjs`). Verify: `rg -n "'restart', 'compact'" .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` prints line 47.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Write arm A, the hop with the lookup CLI on disk (`$A`). Verify: `rg -c '^## [1-5]\. ' "$A"` prints 5.
- [x] T007 Write arm B, the same hop with the CLI hidden by the mirror (`$B`). Verify: `rg -c '^## [1-5]\. ' "$B"` prints 5.
- [x] T008 Register both pages in the playbook index (`$IDX`). Verify: `rg -c 'hop-recall-conversation|hop-recall-baseline-conversation' "$IDX"` prints 2.
- [x] T009 Run arm A on Claude Code and record one row per run (`$A`). Verify: `rg -c '^\| lookup \| claude-code \|' "$A"` prints the run count, at least 1.
- [x] T010 Run arm B on Claude Code and record one row per run (`$B`). Verify: `rg -c '^\| baseline \| claude-code \|' "$B"` prints the run count, at least 1.
- [x] T011 Record Pi, OpenCode and Codex as optional follow-ups in both pages (`$A`, `$B`). Verify: `rg -l 'Pi, OpenCode and Codex' "$A" "$B"` prints both paths.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the playbook validator over both new pages (`validate-playbook-package.cjs`). Verify: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook --repo-root . --skills-root .skilled/skills` prints `scenarios=126 violations=0`.
- [x] T013 Confirm every recorded row carries all five signals (`$A`, `$B`). Verify: `rg -c 'answer=(correct|wrong|missing) lookup_attempted=[01] native_recall=[01] transcript_read=[01] note_leaked=[01]' "$A" "$B"` prints one line per page, and the two counts sum to the number of recorded rows.
- [x] T014 Confirm no runtime file changed (`relaunch-core.cjs`, `session-relaunch.cjs`, `hook-state.ts`). Verify: `git status --porcelain -- .skilled/hooks .skilled/skills/system-spec-kit/runtime` prints nothing.
- [x] T015 Record the threshold and the answer (`$PKT/goal.md`). Verify: `rg -c '^(Threshold|Decision):' "$PKT/goal.md"` prints 2.
- [x] T016 Validate the packet (`$PKT`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$PKT" --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `goal.md` §4 holds the `Threshold:` line, the `Decision:` line and the two `Open question:` lines
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---
