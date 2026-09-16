---
title: "Goal: teach every gate and CI workflow the .skilled root"
description: "The durable directive for the phase that makes hooks and CI check changes under either root and fail loudly when a gate cannot find its script, and the criteria it closes against."
trigger_phrases:
  - "gate readiness phase goal"
  - "skilled gate teaching goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/005-gate-and-ci-readiness"
    last_updated_at: "2026-09-16T21:05:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Committed T013 and logged the staging-through-link finding"
    next_safe_action: "Dispatch T014 with its payload, then verify it against the expected files"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-005-goal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: teach every gate and CI workflow the .skilled root

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Before anything moves, every git hook and CI workflow checks changes under `.skilled/` or `.opencode/` and fails loudly when a gate cannot find its script, proven by a check that lives outside the moved tree.

### Decisions

Frozen. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Gate scripts keep literal `.opencode/` paths that resolve through phase 004's tracked link. Each gate file defines `_in_toolchain_repo` to decide whether a missing script is loud. Amended under L1 on 2026-09-16 after a GPT-5.6 scope review, replacing the copied two-root block |
| D2 | Where the spec-kit sentinel resolves under either root, a missing gate script never passes: blocking gates block and name the path, and gates that cannot block warn. Any other repository sees no change. |
| D3 | DeepSeek V4.1 Flash max on cli-pi through the LLM Gateway makes the literal edits, one workflow or hook section per brief, suite-verified before the next. The block, the missing-script rule, the fail-closed workflows, the check and the drill are drafted by the orchestrator or DeepSeek, reviewed by GPT-5.6 on cli-codex and verified by the orchestrator. |
| D4 | The scripts the gates call and the human-facing text naming `.opencode` stay as they are in this phase. Phase 006 teaches those scripts and phase 009 rewrites that text. |

### Operator copy

A change here that alters a parent decision or criterion is applied to the parent first.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED` on the phase tip
- [ ] `bash .github/scripts/tests/broken-move-drill.sh` prints `RESULT: PASSED`, which it does only when every deliberate break failed both the check and its hook
- [ ] The six hook test scripts pass above their 126-case baseline with no case removed, and every new test script passes
- [ ] Every workflow `paths:` entry naming `.opencode/` has a `.skilled/` twin, and no workflow exits 0 on a missing guard
- [ ] Every contract change has a GPT-5.6 review with no open finding
- [ ] The phase validates PASSED
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this goal, written on 2026-09-16 against `728c4f3efc` |
| Baseline hook tests | Observed | Six test scripts at `728c4f3efc` pass 126 cases: `pre-commit` 25, `pre-push` 19, `prepare-commit-msg` 51, `commit-msg` 17, `autostash-orphan-guard` 2, `mass-deletion-guard` 12 |
| T003 hook test baseline | Observed 2026-09-16 at `d26f0c60ca` | autostash-orphan-guard 2, commit-msg 17, mass-deletion-guard 12, pre-commit 25, pre-push 19, prepare-commit-msg 51: 126 passing, 0 failing; `bash -n` clean on the seven hooks and both libraries |
| T003 no-op pre-commit timing | Observed | Ten runs: 548 to 659 ms, median 559 ms |
| T003 CI baseline (pre-005) | Observed at remote tip `728c4f3efc` | Red, with failure sets: Playbook Operator Contract on main (16 lines, the same set since 06:40Z: FAIL packages cli-devin, sk-communication, sk-create-manual-testing-playbook, sk-git, system-deep-loop); Spec-Kit Check on both branches (`hook-registration-sync` expected 81 to be 77, `scaffold-golden-snapshots` lazy-goal.md snapshot); Routing Registry Drift Guard on both branches (`scorer-eval-baseline-ratchet`: full_corpus_top1 151 vs 152, ambiguity_top1 17 vs 18). Every other workflow's latest run is green |
| T001 phase 004 inputs | Read | Layout L1 (`.opencode -> .skilled`, tracked relative link); `.opencode/` keeps K1 to K13 of ADR-003; the move is one rename-only commit plus the link; hook logs keep writing through `.opencode/logs`, which resolves into `.skilled/logs` under L1 |
| T004 silent pass reproduced | Observed in `/tmp/skilled-p005/control`, a clone with `.opencode/` moved to `.skilled/` and no link | Today's `pre-commit` with `.skilled/agents/markdown.md` staged: exit 0, 0 bytes of output. Today's `comment-hygiene.yml` guard step: exit 0 with `::warning::Comment hygiene checker not found ... skipping` |
| T005 executors | Observed 2026-09-16 | DeepSeek V4.1 Flash on cli-pi answers through `PI_CODING_AGENT_DIR=/tmp/skilled-pi-agent` (`supportsDeveloperRole: false`); GPT-5.6 sol on cli-codex completed a 428 s read-only review for phase 004 |
| L1 amendment | Applied 2026-09-16 | GPT-5.6 sol at `high` (read-only) found the smaller change sufficient with no missed case (`review/gpt-5-6-sol-scope-under-l1.md`). Withdrawn: T006 to T008, T029, H20 and the check's block-copies and escaped-roots rules |
| T002 cited lines re-opened | Observed at phase start `7085ec3290` | No gate file changed since `728c4f3efc` (`git diff --stat` over the hooks, the legacy helper, the SessionStart check and `.github` is empty), and `grep -c '\.opencode'` still gives 43 in `pre-commit`, 19 in `pre-push` and 148 across the 19 workflows |
| T013 H04 and H05 | Committed `259f4f6cf4` | DeepSeek's second attempt matched the expected files byte for byte and touched only the two authorized files. Against the HEAD hook the harness failed the 2 new assertions; against the changed hook it passed 28 of 28 under `/bin/bash` 3.2.57. Comment hygiene exits 2 on both files |

### Deviations and findings

| Item | Note |
|------|------|
| Gate lines moved since phase 001 cited them | Comment hygiene is now `pre-commit:50`, the agent filter `:95` and the parity skip `:180`, with the six parity scripts at `:168-175` |
| "12 of 19 workflows skip on a missing guard" | The workflow count holds and the mechanism does not. Only 6 of the 12 missing-guard conditionals skip, in five workflows, and the other six fail closed. The twelve silent workflows combine those skips with eight path-filtered workflows and one name filter |
| Two pre-push gates disengage silently | `pre-push:52-54` skips the remote-push permission gate, and `:252` skips the compiled-routing guard with no output |
| The agent checker drops names it does not match | `check-agent-mirror-sync.cjs:32` and `:60-68` exit 0 with "nothing verified", so a hook filter that admits `.skilled/agents/` checks nothing there until phase 006 changes the checker |
| The skill-root metadata gate's comment and code disagree | `pre-push:201-203` says the gate blocks, but `:216-229` never exits non-zero, even where it prints "AUTOSYNC BLOCKED". Noted, not changed: this phase follows the code |
| Hook edits run as DeepSeek units | After a context compaction the orchestrator applied its own pre-commit draft directly, which D3 assigns to DeepSeek. It restored the file, kept the draft as the expected result, and runs T013 to T018 as literal briefs that must match that result byte for byte |
| Git cannot stage through the link | Observed in a scratch repository with `.opencode -> .skilled`: `git add .opencode/<path>` fails with "pathspec ... is beyond a symbolic link", and `git diff --quiet` through the link exits 0 on a changed file. Under L1 the route re-mint gate would stop at its `git add`. T017 twins the per-hub pathspecs and addresses the manifests through the directory `.opencode` resolves to. `--skill-root` keeps `.opencode`, because reading works through the link |
| Two re-mint gates blocked other repositories | "Skip silently, as today" did not hold for route and spec re-mint: a repository with its own `.opencode/skills/*/SKILL.md` or spec folder staged was blocked on the missing module or tool. Under the missing-script rule such a repository passes, and case 35 stages every trigger at once to prove it |
| The comment checker block names its bypass | The missing-checker block at `pre-commit:50` ignored `SPECKIT_SKIP_COMMENT_HYGIENE`. The rule's message names the gate's escape, so the flag now bypasses that block as well |
| Pi print mode wrote nothing | T013's first dispatch in text mode ran 150 s, exit 0, with empty output and no edit. The same brief with `--mode json` applied all 8 edits in 23 s. Units now dispatch in JSON mode and keep the last assistant text as the return |
| Adjacent, not fixed: a trigger can miss on a large commit | The card-sync and mutation-class triggers pipe `git diff` into `grep -q` under `pipefail`. With 6,001 staged names and the trigger listed first, the trigger missed in 3 of 3 runs, because `grep -q` exits at the match and git dies of SIGPIPE. The move commit is not exposed, since pure renames are filtered out. A one-line fix is `grep -E ... >/dev/null` in place of `grep -Eq` |
| Control case | Case 33, a missing route module blocking where the toolchain ships, passes against the unchanged hook by design: it guards the new condition against skipping inside this repository. Every other new case fails against the hook it precedes |
<!-- /ANCHOR:log -->
