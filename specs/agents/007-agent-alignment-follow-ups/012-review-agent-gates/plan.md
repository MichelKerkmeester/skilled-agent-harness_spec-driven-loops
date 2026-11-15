---
title: "Implementation Plan: Phase 12: review-agent-gates"
description: "Edit `.skilled/agents/review.md` in five places so its self-checks agree, a review with an open gap can still be sent, step 7 runs the two report checkers and the gate types and advisory score say only what callers use. Carry the edit through the fork and the generated copies, and prove each fix with the command that reproduced it."
trigger_phrases:
  - "review agent gates plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 12: review-agent-gates

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | One Markdown agent definition, its hand-edited `.claude` fork and three generated runtime copies |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `rg` counts on `review.md`, the step 7 checker command run on the mode's fixtures, and the roster and mirror checks |

The four step 5 explorers (architecture, feature, dependency, test) ran inline, as the workflow's `fallback: Use inline planning activities`, because a leaf worker cannot dispatch agents. They were `rg` and `sed` searches over `review.md`, its fork and copies, the sk-code review mode's scripts and fixtures, `orchestrate.md` and the `/speckit:*` workflow assets. Their findings are the Measured Behavior block in `spec.md` and the affected-surfaces table in section 9.

There is no unknown that needs `/deep:research`. The one open item is the phase 6 self-score rule, which REQ-007 waits on.

### Overview
Five text edits to one agent file, in file order: step 7, the gate types, the advisory score, the self-validation and confidence rules, and the anti-pattern block. Each edit replaces or removes text, and only step 7 adds a working command. The `.claude` fork takes the same edits by text anchor, and the sync scripts rewrite the Pi, Codex and harness copies. Each fix is proved by the `rg` count or checker run that reproduced its finding.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 6 has shipped, and the Measured Behavior commands in `spec.md` are re-run on the tree that holds it
- [ ] The phase 6 self-score rule and fast-path budget are read from phase 6's `implementation-summary.md`
- [ ] The baseline of every check in section 5 is saved in `scratch/baseline.txt`

### Definition of Done
- [ ] Every requirement in `spec.md` section 4 holds
- [ ] `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK` and `node .skilled/bin/check-agent-mirror-sync.cjs` prints `all comparable mirrors in sync`
- [ ] The step 7 command prints `final-line=0 findings=0` on `pr-shape-valid.md`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Agent definition text edit. No runtime code changes.

### Key Components
- **`.skilled/agents/review.md`**: the canonical `@review` definition. `.opencode/agents/review.md` resolves to this same file.
- **`.claude/agents/review.md`**: a hand-kept fork that runs 15 lines behind the canonical file and uses `.claude/agents/` in its paths.
- **The sync scripts**: `sync-agents-pi.cjs`, `codex/sync-agents.cjs` and `sync-agents-dsh.cjs` rewrite `.pi/agents/review.md`, `.codex/agents/review.toml` and `.dsh/agents/review.patch.yml` from the canonical file.
- **The mode's report checkers**: `check-review-final-line.js` and `check-review-findings.js` in `.skilled/skills/sk-code/sk-code-review/scripts/`. Each reads a file argument or stdin and exits 0 on pass, 1 on failure and 2 on a read error.

### Data Flow
A caller dispatches `@review`. `/speckit:implement` and `/speckit:complete` send `Mode: Gate Validation` with `gate_type: post_execution`, and `@orchestrate` sends a review with no gate type. The agent writes its report, and after this phase pipes it through both checkers before it sends. The caller reads the verdict from the final `Review status:` line, and the score never decides it.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup re-runs the Measured Behavior commands on the tree that holds phase 6 and saves the baseline. Implementation makes the five edits in `.skilled/agents/review.md`, repeats them in the `.claude` fork and runs the three sync scripts. Verification re-runs every REQ check, the step 7 command on three fixtures, the roster and mirror checks and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each finding is closed by the command that reproduced it.

- REQ-002: `rg -c 'or is this a Fast Path review' .skilled/agents/review.md .claude/agents/review.md` prints 1 for each file.
- REQ-003: `rg -c 'DO NOT send until fixed' .skilled/agents/review.md` exits 1, and `rg -c 'cannot be closed' .skilled/agents/review.md` prints 2 or more.
- REQ-004: `rg -c 'check-review-final-line.js' .skilled/agents/review.md` prints 1 or more. The step 7 command, copied out of the edited file with the text of a fixture as its heredoc body, prints `final-line=0 findings=0` for `pr-shape-valid.md`, `findings=1` for `status-commented-open-p1.md` and `final-line=1 findings=1` for `overall-contradicts-status.md`.
- REQ-005: `rg -c 'pre_execution|mid_execution|pre/mid' .skilled/agents/review.md` exits 1, `rg -c 'post_execution' .skilled/agents/review.md` prints 1 or more, and `rg -c 'invoked by orchestrator for review gate' .skilled/agents/review.md` exits 1.
- REQ-006: `sed -n '/^### Advisory Score/,/^## 7\./p' .skilled/agents/review.md | wc -l` prints 15 or less when measured right after the REQ-006 edit, and 15 plus the lines REQ-007 adds at the end, which the summary names. `rg -c 'Never let the score decide' .skilled/agents/review.md` exits 1.
- REQ-007: `rg -n` with the anchor text of the phase 6 rule prints one line in `review.md`, or the summary records the no-op.
- REQ-001: `node .skilled/bin/sync-agent-roster.cjs --check` and `node .skilled/bin/check-agent-mirror-sync.cjs` both exit 0, and `wc -l .skilled/agents/review.md` prints 600 or less.

The checker test suite, `bash .skilled/skills/sk-code/sk-code-review/scripts/tests/check-rule-copies.test.sh`, runs before and after as a guard, although no pin in it reads `review.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node`, `sh` and `rg`. No new package.

| Phase | What this phase needs from it | When it is not there |
|-------|-------------------------------|----------------------|
| 006-shared-agent-contract | The fast-path budget at `review.md:63` and the self-score rule | Hold the build. A phase 6 that removes the fast path's skip of the self-check closes REQ-002 as not needed, and one with no rule for this score closes REQ-007 as a recorded no-op |
| 011-debug-agent-revert-and-handoff | Nothing. It edits `debug.md` only | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the mirror check fails after the edit, the step 7 command fails a fixture the test suite passes, or a `/speckit:implement` review dispatch stops returning a final `Review status:` line. Revert the phase's commit with `git revert`. The canonical file, the fork and the three generated copies ship in that one commit, so the revert keeps them in sync, and `check-agent-mirror-sync.cjs` is run once more after it.
<!-- /ANCHOR:rollback -->

---

## 8. FIX APPROACH

Line numbers are those at `c1dbb1bcc4` in the canonical file. Phase 6 lands first, so every edit is anchored by its quoted text, not its number. The `.claude` fork takes the same text at the line 15 lower.

**REQ-002, review-2.** Replace question 6 at `:362` with `6. Did I run adversarial self-check on all P0/P1 findings, or is this a Fast Path review that skips it?`. The `:386` skip stays as it is, because the fast path's purpose is to skip it.

**REQ-003, review-3.** Three places get one exit.
- `:364` becomes `If ANY is NO → close the gap first. A gap that cannot be closed follows the LOW row below.`
- The `:372` action cell becomes `Close the gap, or send with it on the Not checked: line when it cannot be closed`.
- One paragraph goes under the confidence table: a gap that cannot be closed never blocks the send. The report names it on its `Not checked:` line, states confidence LOW and, in a requested `AGENT_IO_RESULT` block, carries `failure_type: low_confidence` when no P0 or open P1 sets the type. The verdict still follows the Section 6 table.
- `:380` changes its `Fix gaps` step to `Fix gaps, or record one that cannot be closed as the LOW row says`.

The reviewer's `COMMENTED` fix is not used. The findings checker fails a `COMMENTED` status over an open P1, as the Measured Behavior block shows.

**REQ-004, review-4.** Step 7 at `:56` keeps its first sentence and gains the checker run. The scripts are named the way `:46` names the mode, wherever the runtime installed the sk-code skill, with this repository's path as the example. The command is the one Setup ran on the fixtures:

```bash
S=.skilled/skills/sk-code/sk-code-review/scripts sh -c 'r=$(cat); printf "%s\n" "$r" | node "$S/check-review-final-line.js"; a=$?; printf "%s\n" "$r" | node "$S/check-review-findings.js"; echo "final-line=$a findings=$?"' <<'REVIEW_EOF'
<the complete report>
REVIEW_EOF
```

The report goes in a quoted heredoc, so its backticks and `$` stay literal and the agent writes no file, which its `write: deny` forbids. The heredoc feeds `sh -c` directly, because a heredoc inside `$(...)` broke on a report that holds an apostrophe when it was tried. The step also says three things. A non-zero result means fix the report and run both again. A report that holds the line `REVIEW_EOF` takes another delimiter. When the scripts are absent, the review names them on its `Not checked:` line. The `:250` sentence stays, because it now describes a check that runs.

**REQ-005, review-6 gate types.** The Gate Types table at `:227-233` becomes one sentence under a `### Gate Type` heading: `gate_type` is `post_execution`, a full review and its verdict after a task completes, which `/speckit:implement` and `/speckit:complete` send. `:223` reads `gate_type (post_execution)`. `:460` drops its `(pre/mid/post execution)` parenthetical. The two lines that name `@orchestrate` as the gate caller change with it, because the new sentence names the commands that send the gate: `:221` reads `When invoked for review gate validation (Mode: Gate Validation):` and the `:137` Trigger cell reads `A Gate Validation dispatch`.

**REQ-006, review-6 score.** The first score table at `:172-178` and its blank line go. The second table already carries the points in its Dimension column, as `(30)` and the like. `:170` then reads `It sums the five dimensions below, each judged against the rules the mode applied:`. The anti-pattern block `Never let the score decide` at `:426-429` goes, because `:153`, `:170` and `:317` state the same rule. `:24`, `:303` and `:358` stay. The first is the agent's identity, the second asks for traceability and the third is a self-check question.

**REQ-007, review-6 self-score rule.** Read the rule phase 6 ships. Apply it to the score section in its own words, by a pointer or by the change it names, and add nothing it does not ask for.

**Mirror routine.** After the canonical edit, hand-edit `.claude/agents/review.md` to match. Then run `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`, `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs` and `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs`, then `node .skilled/bin/sync-agent-roster.cjs --check` and `node .skilled/bin/check-agent-mirror-sync.cjs`. All five script paths exist at `c1dbb1bcc4`. The commit gate blocks a commit with an unstaged mirror. The agent file stays at or below 600 lines (`.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md:62`). The edits remove about twelve lines from 462.

---

## 9. AFFECTED SURFACES

| Surface | Role | Effect of this phase |
|---------|------|----------------------|
| `.skilled/agents/review.md` | Producer | Edited |
| `.opencode/agents/review.md` | Copy | Resolves to the canonical file, so no edit |
| `.claude/agents/review.md` | Fork | Hand-edited to match |
| `.pi/agents/review.md`, `.codex/agents/review.toml`, `.dsh/agents/review.patch.yml` | Generated copies | Rewritten by the sync scripts. Each holds the `mid_execution` row today |
| `.skilled/commands/speckit/assets/speckit-implement.yaml:574` and `speckit-complete.yaml:984` | Consumers of `gate_type` | Send `post_execution`, which stays. No change |
| `speckit-implement.yaml:583`, `speckit-complete.yaml:993` | Consumers of the score | `advisory_score: "Never blocks."` stays true. No change |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:269`, `check-review-findings.js:150` | Read by the new step 7 | Read stdin today. No change |
| `.skilled/skills/sk-code/sk-code-review/scripts/tests/fixtures/review-output/pr-shape-valid.md:4` | Fixture of the agent's PR shape | Keeps its `Advisory score` line, which the edit keeps. No change |
| `.skilled/skills/sk-code/feature-catalog/review-calibration/review-agent-severity-verdict.md:26` | Describes the score and verdict | Its description stays true. No change |
| `.skilled/agents/orchestrate.md:258`, `:327`, `:562` | Reads the result block, sets the fast path and reads the final status line | No change. A `low_confidence` result it reads as a routing hint already |
