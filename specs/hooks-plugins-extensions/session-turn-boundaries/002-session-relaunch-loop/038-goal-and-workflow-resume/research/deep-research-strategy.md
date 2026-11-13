# Deep Research Strategy

## 2. TOPIC
Verify and deepen the hand-over gap report at `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/scratch/handover-gaps-research-2026-11-13.md`: for each claim about running workers at hand-over, session names across a hop and other state a hop drops, confirm or refute it against the code and each runtime's own help output, close the items it marks UNCONFIRMED, and name the smallest change for each confirmed gap.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Running workers: for each worker kind the report names (Claude background tasks, Claude foreground sub-agents, OpenCode task sessions, external CLI workers, fan-out lineages), does the code at hand-over do what the report says, and what do the two UNCONFIRMED items (an OpenCode child alive at parent idle, pid liveness in markOrphanedLineages) and the inferred orphan claim resolve to?
- [x] Session names: what happens to a session name on a hop per runtime, and which flag, command or API does each runtime's own help output (claude, pi, opencode, codex, cursor-agent, devin) offer for naming a session, including the shape of a Claude /rename entry?
- [x] Other dropped state: are the report's claims on permission mode, Pi mode flags, added directories and wakeups, crons and the todo list correct in the code, and do scheduled items end with the session?
- [x] Report accuracy: which claims or path:line citations in the report are refuted or wrong, and which of its proposed changes does the session-relaunch README already document as shipped?
- [x] Smallest changes: for each gap that survives verification, what is the smallest change, in which file and function, and how do the report's nine ranked changes re-rank?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any fix. This run reports findings and names changes only.
- Starting a runtime session, or running the session-relaunch `prepare`, `claim`, `keep`, `cancel` or `complete` commands. Evidence comes from reading code, tests and fixtures, and from each runtime's `--help` output.
- Redesigning the relaunch record format or the goal carry-over that packet 038 already shipped.
- Committing or pushing.

---

## 5. STOP CONDITIONS
- Three iterations run, whatever the convergence telemetry says (stop policy `max-iterations`).
- Every claim in the report carries one of: confirmed, refuted, or still unconfirmed with the read-only evidence that is missing.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Running workers: for each worker kind the report names (Claude background tasks, Claude foreground sub-agents, OpenCode task sessions, external CLI workers, fan-out lineages), does the code at hand-over do what the report says, and what do the two UNCONFIRMED items (an OpenCode child alive at parent idle, pid liveness in markOrphanedLineages) and the inferred orphan claim resolve to?
- Session names: what happens to a session name on a hop per runtime, and which flag, command or API does each runtime's own help output (claude, pi, opencode, codex, cursor-agent, devin) offer for naming a session, including the shape of a Claude /rename entry?
- Other dropped state: are the report's claims on permission mode, Pi mode flags, added directories and wakeups, crons and the todo list correct in the code, and do scheduled items end with the session?
- Report accuracy: which claims or path:line citations in the report are refuted or wrong, and which of its proposed changes does the session-relaunch README already document as shipped?
- Smallest changes: for each gap that survives verification, what is the smallest change, in which file and function, and how do the report's nine ranked changes re-rank?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading every cited range in a few batched shell reads. Each citation got checked against the exact line, which caught the misplaced 3 s figure and the guard's understated scope. (iteration 1)
- help output closed the four "UNCONFIRMED" flags at once, and the SDK's own doc comment answered the OpenCode child question that repo code could not. (iteration 2)
- the fixture grep found `session_crons`, which the report's adapter-only search missed, and the official page closed the cron question that no on-disk name could. (iteration 3)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- OpenCode child timing cannot be settled from this repo because the behaviour lives in the runtime. (iteration 1)
- the first help runs failed because `timeout command ...` runs `command` as a program and zsh does not split `$c`. (iteration 2)
- the `~/.claude` name listing could not settle the todo list, because the absence of a directory does not prove the list ends with the session. (iteration 3)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A Claude launch flag that restores crons: none exists, and `--resume` is deny-listed on a hop. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A Claude launch flag that restores crons: none exists, and `--resume` is deny-listed on a hop.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A Claude launch flag that restores crons: none exists, and `--resume` is deny-listed on a hop.

### A launch flag carrying added directories on OpenCode, Pi or Devin: their help has none. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A launch flag carrying added directories on OpenCode, Pi or Devin: their help has none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A launch flag carrying added directories on OpenCode, Pi or Devin: their help has none.

### A launch flag for naming on Codex, Cursor, Devin and the OpenCode root command: the help output has none. Candidates for "Exhausted Approaches". -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A launch flag for naming on Codex, Cursor, Devin and the OpenCode root command: the help output has none. Candidates for "Exhausted Approaches".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A launch flag for naming on Codex, Cursor, Devin and the OpenCode root command: the help output has none. Candidates for "Exhausted Approaches".

### Looking for `markOrphanedLineages` inside `fanout-run.cjs`: it is only imported there, at line 41. The definition is in `fanout-pool.cjs:307`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Looking for `markOrphanedLineages` inside `fanout-run.cjs`: it is only imported there, at line 41. The definition is in `fanout-pool.cjs:307`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for `markOrphanedLineages` inside `fanout-run.cjs`: it is only imported there, at line 41. The definition is in `fanout-pool.cjs:307`.

### None yet. The OpenCode child-at-idle question moves to runtime help or source, not to more in-repo reads. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None yet. The OpenCode child-at-idle question moves to runtime help or source, not to more in-repo reads.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None yet. The OpenCode child-at-idle question moves to runtime help or source, not to more in-repo reads.

### Reading `~/.claude` file content for todo or cron storage: barred by the dispatch, and the names alone showed no such store. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reading `~/.claude` file content for todo or cron storage: barred by the dispatch, and the names alone showed no such store.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `~/.claude` file content for todo or cron storage: barred by the dispatch, and the names alone showed no such store.

### Reading `opencode session --help` for a rename: it has no title or name option. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Reading `opencode session --help` for a rename: it has no title or name option.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `opencode session --help` for a rename: it has no title or name option.

### Using `opencode run --title` on a hop: the wrapper starts the root command, not `run`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Using `opencode run --title` on a hop: the wrapper starts the root command, not `run`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using `opencode run --title` on a hop: the wrapper starts the root command, not `run`.

### Using repository code to settle the OpenCode child-at-idle question: the behaviour belongs to the OpenCode runtime, not to this repo. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Using repository code to settle the OpenCode child-at-idle question: the behaviour belongs to the OpenCode runtime, not to this repo.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using repository code to settle the OpenCode child-at-idle question: the behaviour belongs to the OpenCode runtime, not to this repo.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Looking for `markOrphanedLineages` inside `fanout-run.cjs`: it is only imported there, at line 41. The definition is in `fanout-pool.cjs:307`. (iteration 1)
- None yet. The OpenCode child-at-idle question moves to runtime help or source, not to more in-repo reads. (iteration 1)
- Using repository code to settle the OpenCode child-at-idle question: the behaviour belongs to the OpenCode runtime, not to this repo. (iteration 1)
- A launch flag for naming on Codex, Cursor, Devin and the OpenCode root command: the help output has none. Candidates for "Exhausted Approaches". (iteration 2)
- Reading `opencode session --help` for a rename: it has no title or name option. (iteration 2)
- Using `opencode run --title` on a hop: the wrapper starts the root command, not `run`. (iteration 2)
- A Claude launch flag that restores crons: none exists, and `--resume` is deny-listed on a hop. (iteration 3)
- A launch flag carrying added directories on OpenCode, Pi or Devin: their help has none. (iteration 3)
- Reading `~/.claude` file content for todo or cron storage: barred by the dispatch, and the names alone showed no such store. (iteration 3)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Q2 session names, Q3 other dropped state, Q4 report accuracy beyond Q1, and Q5 re-ranking. (iteration 1)
- The OpenCode child alive at parent idle: needs OpenCode runtime evidence. (iteration 1)
- Whether fan-out `started` ledger events carry a lineage pid (decides the cost of the fix in finding 20). (iteration 1)
- Q3 other dropped state, Q4 report accuracy beyond Q1 and Q2, Q5 re-ranking. (iteration 2)
- Pi plan-mode extension state readability. (iteration 3)
- The `bypassPermissions` replay requirement on Claude. (iteration 3)
- OpenCode 2.2.7 traces: a backgrounded child at parent idle, and `session.update` setting a title. (iteration 3)
- Todo-list persistence across a Claude relaunch. (iteration 3)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- The report under verification: `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/scratch/handover-gaps-research-2026-11-13.md`. Its brief: `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/scratch/handover-gaps-research-brief-2026-11-13.txt`.
- The report's author had no shell, so it ran no `<runtime> --help`. Every flag statement in it comes from the wrapper's own lists. It did not read `withdraw.cjs`, `goal-handover.cjs`, the Pi adapter body, the `cli-*` reference files or the definition of `markOrphanedLineages`.
- Packet 038 is Complete. It shipped the `Active command:` note line, the deep-loop lock release step, goal carry-over per runtime and the `skilled-loop` shell function. A change the README already documents as shipped is not a gap.
- The packet has no `handover.md`, `implementation-summary.md` or `decision-record.md` at the parent level, so the continuity ladder adds nothing beyond `spec.md`.
- resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: `.skilled/hooks/session-relaunch/README.md`, `bin/session-relaunch.cjs`, `lib/relaunch-core.cjs`, `lib/killer.cjs`, `lib/nudge.cjs`, `lib/withdraw.cjs`, `lib/goal-handover.cjs`, the `claude/`, `codex/`, `opencode/` and `pi/` adapter folders and `tests/fixtures/` beside them; `.opencode/plugins/session-relaunch.js`; `.skilled/bin/skilled-loop` and `.skilled/bin/skilled-loop-shell.sh`; `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`; `.skilled/skills/cli-external-orchestration/` (the `cli-*` SKILL.md files and their references); `.skilled/commands/speckit/handoff.md`.
- Runtime binaries for help output: `claude`, `pi`, `opencode`, `codex`, `cursor-agent`, `devin`. Call the binary, not a shell function of the same name, and only with `--help` or a subcommand's `--help`.
- Constraints and risks: read-only on everything outside this research packet. In an interactive shell `claude` and the other runtime names are functions that start the relaunch wrapper, so use `command <name> --help`.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 3
- Convergence threshold: 0.05 (telemetry only under stop policy `max-iterations`)
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-11-13T08:00:46Z
