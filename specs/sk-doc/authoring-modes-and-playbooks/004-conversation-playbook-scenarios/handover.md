---
title: "Handover: conversation playbook scenarios"
description: "Session handover for the conversation scenario format and the shared tmux runner: what is built and proven, what is open, the traps, and the bar for calling the packet perfect."
trigger_phrases:
  - "conversation runner handover"
  - "065 handover"
  - "playbook scenarios continuation"
importance_tier: "important"
contextType: "general"
---
# Session Handover Document

Handover of the conversation playbook scenarios packet to a fresh session, written 2026-11-02 after the build session stopped at a clean boundary.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

**Closed 2026-11-02, about 14:15 CET, by session `beb6e7b1-5f31-42db-8cd9-f58f27216e79`.** Both phases are Complete and `validate.sh --strict --recursive` prints `RESULT: PASSED` for the parent, 001 and 002. Every step of the "perfect" bar (Q010) except the commit has run. Every acceptance row is Met. `/deep:review` ran and its eight findings are fixed. `/local-skilled-alignment` ran and its in-scope findings are fixed. The second five-runtime pass ran: `matrix5` and `matrix6` each passed four runtimes 6/6, and every runtime passed 6/6 in one of them. The two failures were a case-sensitive scenario check, since fixed, and Codex's weekly usage limit. A final Claude Code run passed 6/6 with exit 0. The detail is in `002-conversation-runner/implementation-summary.md`.

The operator approved the four commits, deleting the repository snapshots and removing the live-run worktree. After the operator reset Codex's quota, Codex passed MTP-007 6/6 on the final scenario (`002-conversation-runner/scratch/runs/codex-final/`). The snapshots are deleted and the worktree is removed. The commits are not made: the pre-commit mirror-parity gate blocks every commit while the decision-capture session's Devin mirror (`.devin/hooks/ask-capture-posttooluse.mjs`) is missing, and the operator chose to wait for that session to land it rather than bypass the gate.

- **From Session:** `beb6e7b1-5f31-42db-8cd9-f58f27216e79` (Claude Code, continuing `fe0c9990-06d3-454e-a8e7-7c7bc649bc49`)
- **To Session:** none needed
- **Phase Completed:** IMPLEMENTATION and VERIFICATION of 001 and 002
- **Handover Time:** 2026-11-02, about 14:15 CET
- **Recent action**: closed phase 002 after the review, the alignment check and the second live pass

**How to start the fresh session.** Paste this as the first message:

```text
Continue specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios. Read its handover.md first and follow it. Gate 3 answer: A) existing, that packet. Workspace: B) current branch main.
```

Then bind the goal: run `node .skilled/hooks/goal/bin/goal.cjs packet specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios --workspace /Users/michelkerkmeester/MEGA/Development/Skilled`, check `packet_budget=ok`, and set the printed chat slice with `/goal`.
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

All operator answers. Every one is now in `decision-record.md` (Q001 to Q013). The "still to build" notes below were built and proven on 2026-11-02.

| Decision | Rationale | Impact |
| --- | --- | --- |
| The runner is shared and lives in the playbook skill (Q003) | Every skill's playbook can use conversation scenarios, not only decision capture | `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` |
| New sk-doc packet, not a child of decision capture (Q002) | The runner is a playbook-skill feature; decision capture is one consumer | This packet; `specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-*` consumes it |
| Codex question tool: `default_mode_request_user_input = true` enabled in `~/.codex/config.toml` and the repo `.codex/config.toml` (2026-11-02, "Enable it in repo and macbook"; recorded as Q005) | Codex shows its question tool outside Plan mode only with this flag | Codex tool-question turns are tested, not skipped; the repo `.codex/config.toml` line goes into the commit |
| Codex hooks in scratch projects: trust them only in decision-capture 006 runs (2026-11-02) | "Trust all" writes trust entries to `~/.codex/config.toml`; 043/006 may need Codex hooks to fire | Runner change still to build: trust only when the scenario asks for it, record each trust entry it added, remove those entries after the run. Today the runner always declines (ADR-003) |
| Codex multi-select stays typed as a note on the "None of the above" row (2026-11-02) | Codex's question tool offers one choice only | Keep; document it as a Codex difference in `references/conversation-scenarios.md` |
| Folder trust accepted on Codex and Devin (ADR-003, reversible) | Same as Claude Code already does | Saved in their global configs |
| Upstream Cursor issue: separate small Skilled packet after this track (2026-11-02) | The Cursor hook wrapper turns an exit-2 refusal into exit 0 plus allow | Not this packet's scope; open it only when this packet and 043 close |
| Commit and push: only after both builds are checked, and the operator sees the file list first (2026-11-02) | D4 of the master goal: every commit and push needs a yes | Never commit or push without that yes |
| "Perfect" means (2026-11-02): every acceptance row Met, then `/deep:review` with a fix pass, then `/local-skilled-alignment`, then a second full live pass, then a commit list for the operator's yes | Operator's definition of done for this track | Section 3.2 |

### 2.2 Blockers Encountered

**Blockers**: none open. One live verification is outstanding.

| Blocker | Status | Resolution/Workaround |
| --- | --- | --- |
| Chat-reply turn failed live on Claude Code (runs 3 to 5) | Resolved | The runner looked for questions only through the question-tool dialog parser, and the scenario pattern required "keep" before "colours". Now chat questions are matched in text after the turn's echoed send line, and the pattern is `[Kk]eep`. Attempt 7 passed 6/6 |
| Attempt 6 passed 6/6 but failed `REPO_CHANGED` | Resolved | The repository snapshot counted the runner's own evidence folder; it is now excluded |
| OpenCode FAIL 2/6 TIMEOUT in the matrix run | Fixed, not yet proven live | A question with only the free-text row was rejected by the OpenCode parser; the parser now accepts it and has a test |
| Luna quota ran out about 22:40 UTC on 2026-11-01 (reset 02:22) | Resolved | DeepSeek via cli-pi took over; Luna answered again at 04:42 UTC |

### 2.3 Files Modified

**Key files**: `run-conversation-scenario.cjs`, `scripts/tests/run-conversation-scenario.test.cjs`, `scripts/tests/fixtures/fake-subject.cjs`, `scripts/tests/fixtures/question-screens/` (23 screens), `manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md`, `references/conversation-scenarios.md` (all under `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/`).

| File | Change Summary | Status |
| --- | --- | --- |
| `scripts/validate-playbook-package.cjs` and its test | Phase 001: the `json conversation` block, closed key set, `parseConversationScript` | complete |
| `SKILL.md`, `ROUTER.md`, `README.md`, `assets/manual-testing-playbook-snippet-template.md`, `references/README.md`, `changelog/v1.1.0.0.md`, `leaf-manifest.json` | Phase 001 docs, template, changelog and manifest | complete, not yet alignment-checked |
| `scripts/run-conversation-scenario.cjs` (about 70 KB) | The runner: tmux launch, five adapters, turn loop, chat questions, checks, compact and restart, `checkpoints.tsv`, `matrix.md`, repository content hash, cleanup | in_progress (Codex hook-trust change still to build) |
| `scripts/tests/run-conversation-scenario.test.cjs`, `fixtures/fake-subject.cjs`, `fixtures/question-screens/` | Fake-subject suite and recorded screens for all five runtimes | complete |
| `manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md` | MTP-007, the runner's own scenario | complete |
| `references/conversation-scenarios.md` | Reference, with per-runtime notes from the probes | in_progress (AC-010 terms unchecked) |
| `002-conversation-runner/` docs | `tasks.md`, `implementation-summary.md`, `acceptance-criteria.md` record the stopping point | in_progress |

Run evidence: `002-conversation-runner/scratch/runs/` (`mtp007-attempt7`, `opencode-attempt2`, `codex-attempt6`, `pi-attempt2`, `devin-attempt2`, each with a `matrix.md` row PASS 6/6; `matrix.log` is the stopped five-runtime run).

### 2.4 Traps & Scar Tissue

| Trap / blast site | Activation condition | Load-bearing or defensive? | How to avoid re-paying it |
| --- | --- | --- | --- |
| Agents of type `opus-*` refuse to dispatch cli workers | Their definition says "leaf only; never dispatches further agents", which they read as outranking a worker rule. Two orchestrators did all the work themselves on 2026-11-02 | load-bearing | The main session dispatches cli-codex workers itself through Bash. Don't delegate implementation to an `opus-*` agent and expect it to fan out to Luna |
| `REPO_CHANGED` in a live run | Anything edits `specs/` or the watched `.skilled/skills/.state` folders while a run is live, including your own doc edits and other sessions | load-bearing | Don't edit specs during a live run. Coordinate with the decision-capture session (it edits `specs/system-speckit/043-*`) |
| Codex trust screen and paste timing | Codex briefly shows a prompt before its trust screen; Enter right after a paste lands inside the paste on Codex and Devin | load-bearing | Already handled: launch waits for a still idle screen; 500 ms pause before Enter. Keep both |
| Chat question echo marks differ per runtime | Each runtime echoes the sent line differently | load-bearing | Use the adapter's echo mark; never match the whole screen (old scrollback gives false matches) |
| Codex hooks untrusted in scratch projects | Today the runner always declines "Trust all" | load-bearing for 043/006 | Build the operator's rule: trust only when the scenario asks, record and remove the entries |
| Free-text-only questions | The Claude Code, Codex, Pi and Devin parsers still reject a question with no choices; only OpenCode was fixed | defensive | Not seen live on those four; add a fixture and fix if a live run shows it |
| Vitest for system-spec-kit CLI tests | The runtime's default config excludes `runtime/cli/**`, so "No test files found" | load-bearing | `cd .skilled/skills/system-spec-kit && npx vitest run runtime/cli/tests/<file> --config vitest.config.ts` |
| Leftover tmux sockets | A killed run can leave `conv-*` sockets | defensive | After every run: `tmux -L <socket> list-sessions` must fail. The `cprobe` and `ev0*` sockets are not this packet's; leave them |
| Another session's files | Untracked `specs/system-speckit/040-*` and `/private/tmp/fixture/cli-jortt` | load-bearing | Never touch them |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

- **File:** `002-conversation-runner/implementation-summary.md`
- **Next safe action**: once `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` exits 0, make the four approved commits in section 3.2, each with `git commit --only` on its own paths, because other sessions keep files staged.
- **Cold-read order**: 1. this file → 2. `002-conversation-runner/implementation-summary.md` → 3. `002-conversation-runner/acceptance-criteria.md` → 4. `decision-record.md`

### 3.2 Priority Tasks Remaining

1. **Commits, approved and waiting on the mirror gate.** Make them in this order, each with `git add -- <paths>` then `git commit --only -F <msg> -- <paths>`, and no `Co-Authored-By` or `Claude-Session` trailer (the commit rules forbid both):
   - `feat(sk-doc): add a runner that plays conversation scenarios into live runtimes`: `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/`
   - `feat(sk-doc): route playbook conversation requests to the playbook mode`: `.skilled/skills/sk-doc/` `hub-router.json`, `mode-registry.json`, `ROUTER.md`, `graph-metadata.json`, `leaf-manifest.json`, and the 14 hub scenarios under `.skilled/skills/sk-doc/manual-testing-playbook/` that now list 19 intents; `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` and its copy under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-doc/manifest.json`; `.hermes/skills/sk-create-manual-testing-playbook/` and `.hermes/skills/sk-doc/ROUTER.md`
   - `chore(codex): enable the question tool in the project config`: `.codex/config.toml`
   - `docs(specs): close the conversation playbook scenarios packet`: `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/`
   Each body says why, and each ends with `Spec: sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios`. The first message is drafted in this session's scratchpad as `msg1.txt`.
2. **Done 2026-11-02:** the snapshot deletion, the worktree removal and the Codex rerun. After close, five runner and routing improvements landed (`002-conversation-runner/implementation-summary.md` step 8), proven by `scratch/runs/matrix7/`. They add files to commits 1, 2 and 4 above. The style-rule and alignment round also touched `.skilled/commands/create/assets/create-manual-testing-playbook-{auto,confirm}.yaml` and `-presentation.txt`, `.env.example` and `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`: add the command assets and the graph export to commit 2, and `.env.example` to commit 1. The root `README.md` entries for sk-doc and `/create:manual-testing-playbook` go in commit 1. The hub changelog `.skilled/skills/sk-doc/changelog/v2.3.35.0.md` and the hub version bump in `SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json` and `.hermes/skills/sk-doc/SKILL.md` go in commit 2. The detached worktree `~/worktrees/public/313-detached-runner-sandbox-live-runs` that `matrix7` ran against still holds the original copy of that evidence and waits for the operator's yes to remove.
3. **Phase 003, conversation adoption research (2026-11-02, Complete).** Luna ran 8 iterations before its usage limit; a cli-devin lineage on `deepseek-v4-1-flash-max` then audited the 28 packages Luna skipped in 6 iterations. `003-conversation-adoption-research/research/research.md` gives all 56 packages a verdict and ranks the candidates. Building any conversion is a later phase. It goes in commit 4 with the rest of the packet. Its `research/lineages/luna/containment/baseline/` snapshot is gitignored and stays out.
4. **Phase 004, conversation adoption build (built 2026-11-03).** 24 scenario files are written and every touched package passes the validator. The operator dropped two phases on 2026-11-03: 006-sk-prompt (the SP-008 conversion reverted) and 008-sk-design-hub (the SD-007 companion deleted). The 11 original scenarios on OpenCode, Pi, Codex and Devin pass live against worktree 313. Children 001, 002, 013, 014, 016 and 017 are Complete, with evidence under each child's `scratch/live-runs/`. The operator then added OpenCode, and Pi where no colon command is involved, to the Claude-only scenarios. After one fix round: DOC-407, CHG-014, SCG-010 and RRD-005 pass on OpenCode, and CHG-014 and RRD-005 pass on Pi; CM-027 and DOC-409 SKIP validly. DOC-367, DOC-408, DIA-003 and SD-004 dropped back to Claude Code only, and SCG-010 dropped Pi, each with one dated "tried and dropped" sentence. The Claude Code runs (children 004, 005, 007, 009-012 and 015) wait for the Claude weekly reset, because the account stood at 82% of its weekly limit and the operator chose to defer them. 003-system-spec-kit stays deferred by the operator. 018-runner-gaps now lists four new gaps in its open questions: Pi tabbed dialogs, OpenCode scrollback, OpenCode not sending `/doctor:skill-advisor`, and literal scenario `env`. Before any live run in worktree 313, its gitignored build output must be present: the 26 `dist/` and `node_modules/` folders were copied in from the main checkout on 2026-11-03, and without them every hook is missing and the guards report SKIP. One skill bug is recorded and was not fixed: `cli-codex/SKILL.md:180` recommends `2>&1`, which Pi's dispatch preflight denies as ambiguous.
5. **Tell the decision-capture session:** the `trust_hooks` key and its `hook-trust.json` evidence, the `HOOK_TRUST_OUTSIDE_PROJECT` blocker, and the advice to run live passes against a worktree through `--repo-root`. Its `.devin/hooks.v1.json` change also needs the Devin mirror of `ask-capture-posttooluse.mjs`. Separately, `match-decision-table` cannot match a hand-written Operator Decisions table that has no answer column, so the five 2026-11-02 answers stay pending in the capture queue even though Q011 to Q013 hold them.

**Workers.** Use `gpt-6-luna` at reasoning `xhigh`, service tier `default` (normal speed, the operator's 2026-11-02 choice), through cli-codex: read `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` first. If Luna's quota is used up, fall back to `pi --model llmgateway/deepseek-v4.1-flash-1017 --thinking max` (read `cli-pi/SKILL.md` first). Never route a GPT model through a gateway or DevPass. If DeepSeek also fails, stop and ask. Keep worker briefs short, with one change each, literal paths and an observable check. Workers get `AI_SESSION_CHILD=1` and `</dev/null`. You, not a worker, run every tmux test and live run (D5).

**Shared with the decision-capture session.** That session owns `.skilled/hooks/decision-capture/`, the decision-record writer and the system-spec-kit playbook files. This session owns the runner and the playbook skill. If the other session reports a runner bug, it comes through `open-questions.md` here; fix it here.

### 3.3 Critical Context to Load

- [ ] Continuity: `_memory.continuity` in `002-conversation-runner/implementation-summary.md`; save with `/speckit:save` at the end.
- [ ] Spec file: `spec.md` (problem, scope, open questions) and `002-conversation-runner/spec.md` (REQ-001 to REQ-015)
- [ ] Plan file: `002-conversation-runner/plan.md` (feasibility table, T002)
- [ ] Research: `research/research.md` (3 DeepSeek iterations; section 7.1 sets the task order)
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

State at handover, each rerun by the main session on 2026-11-02:
- [x] `validate.sh specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios --strict --recursive`: `RESULT: PASSED` for 3 of 3 folders
- [x] `run-conversation-scenario.test.cjs`: `adapter screens: PASS (5 runtimes)`, `PASS conversation runner suite`, exit 0
- [x] `validate-playbook-package.test.cjs`: `conversation script regressions: PASS (95 assertions)`
- [x] Per-runtime MTP-007 `matrix.md` rows: claude-code, opencode, codex, pi and devin each `PASS | 6/6`
- [x] No tmux server on the default socket, no `conv-*` socket left
- [ ] In-progress work committed: no, by design (commit waits for the operator)
- [ ] Five-runtime matrix in one run: not yet

The successor reruns all of the above plus `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` (must end `OK: parent-skill-check`) before claiming anything.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

- The operator asked for "elaborate human-like orchestrator vs test subject multi-prompt conversation" scenarios, because decision capture was only proven with single prompts and canned input. Keep the human-like parts: seeded random delays, plain-chat answers next to tool answers, compact and restart mid-conversation.
- Runner fixes since the chat-turn failures: scoped chat matching after the echoed send line; `[Kk]eep`; evidence folder excluded from the repository hash; launch waits for a still idle screen; several start-up screens per runtime; a busy line may sit above the prompt; 500 ms before Enter on Codex and Devin; real adapters for OpenCode, Codex, Pi (both of its question tools) and Devin; setup copies `opencode.json`; an optional chat reply covers a subject that asks the sizes question in chat.
- Fleet baseline for the validator: `packages 56 violations 1 warnings 93`. It must stay identical after any validator change.
- One earlier cleanup deleted the suite's leftover temp folders by wildcard. They were believed to be the suite's own, but nobody checked them one by one. Don't repeat that pattern; delete by exact path.
<!-- /ANCHOR:session-notes -->
