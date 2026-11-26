# v4.2.0.0 Bug and Drift Audit, Generation 3: Research Synthesis

Topic: bugs, drift and issues in all logic, skills and work changed since v4.1.0.0 (`v4.1.0.0..HEAD`). This is generation 3 of the packet's research: ten iterations on cli-codex `gpt-6-luna` at `xhigh` on the `fast` tier, one lineage, stop policy max-iterations. Generation 2 is archived at `research_archive/20261126T112816Z/` and generation 1 at `research_archive/20261125T162358Z/`. Findings those generations confirmed and fixed are not repeated here.

A finding counts as in the window when the line it rests on was written by a commit that is not an ancestor of tag `v4.1.0.0`. Older lines are listed separately as pre-existing. Every finding below was re-read in the repository during synthesis, and section 12 lists what was run.

## 1. Verdict

What shipped since v4.1.0.0 holds no P0 or P1. The audit confirmed 2 P2 and 2 P3 defects in the window, plus 3 pre-existing P3 issues the run surfaced, one of them a by-design rule. Two candidates were rejected.

The two P2s in the window are a fan-out stop path that can mark a still-running child as stopped and a fixed heredoc delimiter in every hub's compiled-route example that lets task text run as shell. The second one contradicts the release notes, which say the quoted heredoc keeps the shell out of the task.

## 2. Findings Ranked by Severity (in the window)

### F1, P2, bug: a held fan-out child whose start time cannot be read is never signalled, and its lineage is closed as stopped

- Where: `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1048` and `:5288`, with the classifier at `:1334` and `:1416`.
- Commits: `9f332867143` (the held-child fallback at `:1048`) and `978b74e8df7` (the survivor filter at `:5288`).
- What happens: `lineageIdentityRefusal` returns `identity_unreadable` when `ps -o lstart= -p <pid>` fails. If the leader still answers, `exitedLeaderGroupMembers` returns null, so the lineage is refused. The runner's signal handler then terminates held children only for `no_recorded_identity`, and the survivor check after the grace period also keeps only that reason. A live child refused as `identity_unreadable` is therefore neither signalled nor tracked as a survivor, and the loop at `:5296` writes its `stopped` row while it keeps running.
- Trigger: `ps` fails for a pid that is alive, for example under a sandbox that blocks `ps` or a transient `ps` failure. That is narrow, which is why this stays P2 and not P1.
- Relation to generation 2: the generation-2 fix (`9f332867143`, AC-004) handled the ledger row with no start time. This is the sibling case it left out. The comment at `:1044` ("A child still held here was never reaped, so its pid is still its own") applies equally to an unreadable start time.

### F2, P2, bug and drift: the fixed `TASK` heredoc delimiter lets task text escape into the calling shell

- Where: `.skilled/skills/sk-code/ROUTER.md:497` and 44 more lines across `.skilled` (`rg -n "<<'TASK'" .skilled`). They cover the routers of all eight activated hubs (`sk-code`, `sk-doc`, `sk-design`, `system-deep-loop`, `mcp-tooling`, `mcp-browser-use`, `cli-external-orchestration`, `cli-classifier`), their `SKILL.md` files, READMEs, feature catalogs and playbooks. They also cover the generator for new hubs: `sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md:167` and `sk-create-skill/scripts/init_skill.py:529`.
- Commit: `991fe6d127a` ("pass the task to every hub front door on stdin"). `mcp-browser-use/SKILL.md:62` was last written by `1ad6a392b3d`.
- What happens: the front door is invoked as `node .skilled/bin/compiled-route.cjs --hub <hub> --prompt-stdin <<'TASK'`, then the task, then `TASK`. A task line that is exactly `TASK` closes the heredoc early, and every line after it runs as a shell command. The quoting stops expansion only inside the heredoc.
- Drift: `.skilled/skills/sk-doc/changelog/v2.10.1.0.md:15` and `:23` say the quoted heredoc keeps the shell from expanding the task, and `mcp-browser-use/SKILL.md:62` says it "keeps the shell from running anything in the task". The first half of that claim holds, the second does not.
- Why P2: the task is often pasted or model-composed text, so this is a prompt-to-shell path. The fix is a delimiter the task cannot contain, or a file argument.
- Wider than iteration 10 reported: iteration 10 named only `sk-code`. The scaffold writes the same form into every new hub. The v4.2.0.0 release notes say only that front doors read the task from stdin (`v4.2.0.0.md:800`), which is true, so the contradicted claims are in the per-skill changelogs and `SKILL.md` text.

### F3, P3, bug: Pi never passes its session id, so the weak-follow-up route receipt never applies on Pi

- Where: `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:290`, against `hooks/claude/user-prompt-submit.ts:339`, `:370` and `:407`.
- Commit: `c27addb7117` ("hold weak follow-ups to the session's route") added the session-keyed receipt. The Pi call site predates it and was not updated.
- What happens: Pi calls the shared handler with only `prompt`, `cwd` and `hook_event_name`. `receiptSessionId` reads `input.session_id` and returns null without it, so both the follow-up guard (`:370`) and the receipt writer (`:407`) return early. The same file already has `sessionIdFromContext` at `:57` and uses it for raw-input capture.
- Drift: `hooks/skill-advisor-hook.md:57` describes per-session receipts for the shared handler, and the adapter table at `:74` lists Pi as a shared-handler adapter.

### F4, P3, bug: a lowercase second sentence passes the compact-field narrative check

- Where: `.skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:350`, applied at `:744`.
- Commit: `e1788fce8e0` ("stop reading dots inside versions as sentence ends").
- What happens: a terminator counts only before an uppercase word or the end of the value, so `Ready. fine.` counts one terminator and is accepted as compact for `recent_action` or `next_safe_action`. The discourse regex at `:169` catches only a fixed phrase list. The rejection test at `tests/thin-continuity-record.vitest.ts:129` uses an uppercase second sentence, so this boundary is untested.
- Impact: low. A two-sentence lowercase value slips into a field meant to hold one compact line.

## 3. Evidence Strength

- F1: confirmed by reading the classifier, the fallback and the survivor filter together. Not reproduced, because it needs `ps` to fail for a live pid.
- F2: confirmed by a harmless shell probe run during synthesis (section 12).
- F3: confirmed by reading the call site and the shared handler. Not run in a live Pi session.
- F4: confirmed by evaluating the regex in Node: `Ready. fine.` yields 1 terminator.

## 4. Pre-existing Issues (outside the window)

### P1-pre, P3, by-design rule with a cost: the reducer marks a question resolved when an iteration's focus equals its text

- Where: `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2751`. Last written by `b16087f6064`, which shipped in v4.1.0.0 or earlier.
- What happens: `buildRegistry` resolves a strategy question when `normalizeOptionalText(record.focus) === normalized`, even when that record's `answeredQuestions` is empty. In this run, iteration 1's focus was the Q1 text and its narrative says Q1 "remains open", yet the reducer checked Q1 off after iteration 1. Iteration 2 reported the conflict.
- By design: the comment at `reduce-state.cjs:2580` states the rule ("An iteration whose focus equals a question's text resolves that question") and adds a frontier marker so a frontier visit alone does not close a node. Default depth mode has no marker, so the rule closes a question on focus alone there. This is a design choice with a measurable cost, not a code defect in its own terms.
- Impact: question coverage reads higher than the evidence. Under a convergence stop policy the answered ratio feeds the stop decision, so a run can stop with a question still open. That impact is inferred. A convergence-mode fixture whose iteration focuses a question without answering it would confirm it.

### P2-pre, P3, drift: pre-push lets a track-root sweep error through, and the README does not say so

- Where: `.skilled/scripts/git-hooks/pre-push:709`, with the sweep's exit 2 at `.skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs:86`. Last written by `f13b77defb0`, pre-window.
- What happens: exit 1 (drift) blocks the push. Any other nonzero exit prints "push gate failed open" and continues. The fail-open is deliberate in code. The README at `.skilled/scripts/git-hooks/README.md:119` describes the gate as blocking and omits the error path, so this is doc drift plus a policy question, not a defect in the code's own terms.

### P3-pre, P3, drift: the pre-commit header's uninstall command can remove the wrong file

- Where: `.skilled/scripts/git-hooks/pre-commit:13` (`rm .git/hooks/pre-commit`). Last written by `020011d11b6`, pre-window.
- What happens: the installer resolves the hook directory through `git rev-parse --git-path hooks` (`install-git-hooks.sh:50`), which honors `core.hooksPath`, and the README recommends `install-git-hooks.sh --uninstall`. With `core.hooksPath` set, the header command removes an inactive file and leaves the active hook. This machine sets `core.hooksPath` globally to `~/.config/git/hooks`, so the header is wrong here today.

## 5. Eliminated Alternatives

Rejected candidates:

- Iteration 8, "stale `.opencode/scripts/install-git-hooks.sh` path in the commit-msg header": rejected. `.opencode/scripts` is a symlink to `../.skilled/scripts`, so the documented command resolves and runs. The pre-commit header uses the same path, and it works too.
- Iteration 4, "Q2's stored answer omits the `Q2:` prefix the reducer matches": rejected as a code defect. The executor wrote the answer without the prefix the strategy carries, and the reducer's exact match is its stated contract. Iteration 4 itself said the evidence shows no reducer defect. The Q2 row closed once the full text was recorded.

Iteration 2's "two incompatible Q1 closure states" was not rejected. It was traced to its cause, which is the pre-existing reducer rule in section 4.

Areas checked and found clean (static review, not end-to-end runs):

- All 23 declared hub-router resource paths resolve: 5 in `mcp-browser-use`, 8 in `mcp-tooling`, 10 in `cli-external-orchestration` (iteration 5).
- The executor-registry consumer matches the CLI mode registry's eight workflow entries (iteration 5).
- The embedding-lane removal is consistent across the lane registry and the README and architecture docs, which list four scorer lanes (iteration 3).
- The fan-out retry ledger, CLI dispatch wrapper and append-gateway replay and projection paths (iteration 2).
- The OpenCode 2 storage path, unknown-version dispatch and overlay status command (iteration 6).
- The session-handover transitions sampled, the two-level sub-track reader and validator, and the pre-commit trust and comment-hygiene paths (iteration 7).
- The mirror checks split across `agent-mirror-sync`, `spec-kit-check` and `command-tree-parity`, as the crosswalk describes. Also the doctor ownership wording and the sk-git Pi message gate (iteration 9).

## 6. Divergence Map

No divergent pivots ran. The run used the default depth and convergence modes, recorded no saturated directions and no pivot failures or overrides, and left no frontier. Breadth came from moving through Q1 to Q5 in order, not from divergence.

## 7. Open Questions

- Q4 and Q5 were sampled, not exhausted. Not reviewed: the sk-doc validator and rename paths, the doctor commands beyond their ownership wording, the remaining session-handover runtime adapters, and the cli-orca executor builder at runtime.
- Q1 shows as answered only because of the reducer rule in section 4. In evidence terms it is open past the fan-out stop path, the retry ledger, dispatch and the append gateway. Convergence, the lock and the reducer itself were not audited as a whole.
- Q3 was answered from source and metadata only. The compiled route CLI was not invoked against each mode.

## 8. Recommended Remediation Order

Fixes are out of scope for this run. If the operator wants them, this order puts the shell-reachable defect first:

1. F2: give the front door a delimiter the task cannot contain, or a file argument, in all seven routers, the three `SKILL.md` files and the scaffold. Correct the v2.10.1.0 claim and the `mcp-browser-use/SKILL.md:62` sentence.
2. F1: treat a held child refused as `identity_unreadable` the way `no_recorded_identity` is treated, in both the fallback and the survivor filter. Add a regression test with `ps` stubbed to fail.
3. P1-pre: decide whether default depth mode should keep the focus-equality rule, and if not, require `answeredQuestions` evidence there too.
4. F3: pass `session_id: sessionIdFromContext(ctx)` from the Pi adapter.
5. F4, P2-pre and P3-pre are small: a lowercase-sentence test and regex change, one README sentence and one header line.

## 9. References

- Resource map: `research/resource-map.md`, emitted from the run's deltas.
- Iteration narratives: `research/iterations/iteration-001.md` to `iteration-010.md`.
- State: `research/deep-research-state.jsonl`, `research/findings-registry.json`, `research/deep-research-strategy.md`.
- Window inputs: `scratch/window-commits.txt` and `scratch/recent-packets.txt`.

## 10. Iteration Log

- Iteration 1, Q1 fan-out stop safety: F1. Ratio 1.0.
- Iteration 2, Q1 retry, dispatch and append gateway: the Q1 closure conflict, traced to P1-pre. Ratio 1.0.
- Iteration 3, Q2 skill advisor: F3. Ratio 1.0.
- Iteration 4, Q3 hubs and executors: the Q2 prefix mismatch, rejected. Ratio 0.5.
- Iteration 5, Q3 follow-up: hub paths and registry consumer clean. Ratio 1.0.
- Iteration 6, Q4 runtime and hooks: P3-pre. Ratio 1.0.
- Iteration 7, Q4 handover and runtime: F4. Ratio 1.0.
- Iteration 8, Q4 adapters and hook gates: P2-pre, plus the stale-path candidate, rejected. Ratio 1.0.
- Iteration 9, Q5 cross-entrypoint and CI parity: insight pass, no defect. Ratio 0.
- Iteration 10, Q5 implementation and gate paths: F2. Ratio 1.0.

Each dispatch took about 12 to 15 minutes, and every iteration passed `verify-iteration.cjs` on its first dispatch.

## 11. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 10
- Questions answered: 3 / 5 (Q1, Q2, Q3 by the strategy checkboxes. Q1's check comes from the focus-equality rule in section 4, not from an answer.)
- Remaining questions: 2 (Q4, Q5)
- Last 3 iteration summaries: run 8: Q4 adapters and hook gates (1.0); run 9: Q5 cross-entrypoint and CI parity (0); run 10: Q5 implementation and gate paths (1.0)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
- Budget: the duration budget was raised from 120 to 180 minutes on the operator's choice after iteration 1 took 887 seconds. The per-iteration timeout was 1,800 seconds. No iteration timed out.

## 12. Independent Verification

Run or read during synthesis, on `main` at `035c9dd6bdd` plus this packet's uncommitted state:

- F1: blamed `:1048` and `:5288`, and read `fanout-run.cjs` at `:1291`, `:1334`, `:1374`, `:1405` to `:1425`, `:1040` to `:1052` and `:5280` to `:5305`.
- F2: `printf "cat <<'TASK'\nfix the parser\nTASK\necho ESCAPED_TO_SHELL\nTASK\n" > probe.sh && bash probe.sh` printed `ESCAPED_TO_SHELL`. An uncapped `rg -n "<<'TASK'" .skilled` returned 45 lines, and `grep -n heredoc` on `v4.2.0.0.md` found no heredoc claim.
- F3: read `pi/prompt-advisor.ts:57`, `:145` to `:200` (its own `receiptSessionKey` keys directive dedup, not the route receipt) and `:280` to `:298`, and `claude/user-prompt-submit.ts:335` to `:410`.
- F4: `node -e` on the regex at `:350` with `Ready. fine.` printed `1`.
- P1-pre: read `reduce-state.cjs:2734` to `:2752`, compared with iteration 1's narrative and the strategy's checked Q1.
- P3-pre: `git config --get core.hooksPath` printed `/Users/michelkerkmeester/.config/git/hooks`.
- Rejection of the stale-path candidate: `ls -la .opencode/scripts` showed a symlink to `../.skilled/scripts`.
- Commit attribution: `git blame --porcelain` on each cited line, then `git merge-base --is-ancestor <commit> v4.1.0.0` to separate in-window commits from pre-existing ones.
