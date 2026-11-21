---
title: "Tasks: Phase 1: research"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "research tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: research

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

`P` is `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research`. `R` is `$P/research`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the executor model resolves (`.skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md`). Verify: `opencode models --standalone | rg -c 'opencode-go/hy4-flash-free'` prints 1 or more. Evidence: the run executed on that model; `research/deep-research-config.json` and `research/dispatch-receipts/` name `opencode-go/hy4-flash-free`. The verify command was not re-run after the fact.
- [x] T002 Confirm no research packet exists yet (`$R`). Verify: `ls $R` reports no such file or directory. Evidence: satisfied before the run started; `research/` now exists because the run created it, so the verify command cannot be re-run truthfully.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run `/deep:research:auto "mcp-browser-use hub: answer KQ1-KQ8 in spec.md (capability, lane rule, hub contract, blast radius, naming, macOS verification, security, Aside overlap)" --spec-folder=$P --executor=cli-opencode --model=opencode-go/hy4-flash-free --reasoning-effort=high --sandbox-mode=danger-full-access --max-iterations=10 --stop-policy=max-iterations` from Claude Code, never from inside OpenCode (`$R/deep-research-state.jsonl`). Verify: `rg -c '"type":"iteration"' $R/deep-research-state.jsonl` prints 10. Evidence: `rg -c` printed 12, not 10: the run was extended to 12 iterations for two operator inbox questions.
- [x] T004 Confirm the synthesis exists (`$R/research.md`). Verify: `test -s $R/research.md && echo ok` prints ok. Evidence: printed ok.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Check every key question has a section (`$R/research.md`). Verify: `rg -o 'KQ[1-8]' $R/research.md | sort -u | wc -l` prints 8. Evidence: printed 8.
- [x] T006 Check every downstream phase has a synthesis section (`$R/research.md`). Verify: `rg -o '00[2-6]-[a-z-]+' $R/research.md | sort -u | wc -l` prints 5 or more. Evidence: printed 5.
- [x] T007 Open one cited file:line and compare it with the quoted text (`$R/research.md`). Verify: `sed -n` on the cited line of the cited file prints the quoted text. Evidence: `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:45` prints the `skill_dir` value `iteration-011.md` quotes.
- [x] T008 Validate the phase (`$P`). Verify: `validate.sh $P --strict --quiet` prints RESULT: PASSED. Evidence: RESULT: PASSED, one SOURCE_TAGS warning inside workflow-owned `research/**`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: accepted by operator with known closeout gap; reducer heading-format blind spot tracked as a separate follow-up
- [x] `research/research.md` answers KQ1-KQ8 and names the mode folders (§7)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
