---
title: "Goal: Phase 3: Goal Verifier Labeled Set and Opt-In Jev Shadow Mode"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow"
    last_updated_at: "2026-09-26T19:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: Goal Verifier Labeled Set and Opt-In Jev Shadow Mode

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Measure the OpenCode goal verifier's error rates on an operator-labeled set, score a key-gated Jev `choice` arm against them, and add a shadow `OPENCODE_GOAL_VERIFIER=jev` mode, inert without a key, only if that arm clears the keep threshold.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The heuristic's verdict is the only one that acts in every mode this phase adds. A Jev answer is logged beside it and never applied |
| D2 | Key gate before any Jev call: `command -v jev`, `jev --version` printing `jev 0.6.2` (the npm `jevctl` is refused), and `jev auth status` exiting 0. The slice switch is also required: `--jev` on the scorer, `OPENCODE_GOAL_VERIFIER=jev` in the plugin |
| D3 | The plugin checks the gate once per OpenCode session. Without a key, `jev` mode writes one line at enablement and then acts exactly as `heuristic`. An exit 3 on a live call disables the shadow for the session with one line. Exit 4, a timeout or a malformed answer skip that one record. No Jev failure reaches the error-to-`blocked` path |
| D4 | Wrapper rule: a row or verification that the heuristic stops at its length or blocking-language check is never sent to Jev |
| D5 | The keep threshold in the fourth criterion is fixed now. The plugin mode is built only on keep |
| D6 | The operator authors the labeled set and strips secrets from it before any call. State reaches `jev` on stdin, no key appears on a command line, no row text appears in any record, and the plugin mode announces egress at enablement |
| D7 | `not-met` from the shared core and its `unclear` both normalize to the plugin's `not_met` |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `score-verifier-labeled-set.cjs` reads the operator's 30 to 50 labeled rows and, with no flag, prints the plugin heuristic's `met`, `not_met` and `blocked` confusion table with every error attributed to one of its five checks, spawning zero `jev` processes
- [ ] With `jev` missing from `PATH`, a `jev --version` other than `jev 0.6.2`, or `jev auth status` exiting non-zero, the scorer prints `jev arm skipped: <check>`, prints the same baseline and exits 0
- [ ] With `--jev` and the gate passing, the report shows both arms on identical rows over 3 reruns and a per-call record with wall time and exit code for every call and no row text. It also asserts that no row the heuristic stopped at its length or blocking-language check was sent to Jev
- [ ] The report ends `keep` only if, on each rerun, the Jev arm's false `not_met` count is at most 0.70 times the heuristic's, it adds no false `met`, it answers every asked `blocked` row `blocked`, and stability `1 - stddev/mean` is at least 0.95. Otherwise it ends `drop` or names the stop boundary that fired
- [ ] On keep, `OPENCODE_GOAL_VERIFIER=jev` applies the heuristic's verdict, and with `jev auth status` failing, a session writes one enablement line, no line per verification and the same verdicts as `heuristic`. On drop, `.opencode/plugins/opencode-goal.js` is unchanged
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`, and `git status` shows no change outside the scorer, its test, the fixture, this phase folder and, only on keep, the plugin, its supervisor test, `goal-plugin.md` and `ENV-REFERENCE.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase planned | Done | `spec.md`, `plan.md`, `tasks.md` and this goal authored from research R2 on 2026-09-26 |
| Labeled set | Pending | The operator's task, T001 |
| Scorer and keep decision | Pending | Nothing built |

### Deviations and findings

| Item | Note |
|------|------|
| Level 1 criteria source | This phase has no `acceptance-criteria.md`, so the criteria come from `spec.md` REQ-001 to REQ-012 |
| One plugin file, not two | `.skilled/plugins` is a git symlink (mode 120000) to `../.opencode/plugins`. `.skilled/plugins/opencode-goal.js`, `.opencode/plugins/opencode-goal.js` and `.skilled/hooks/goal/opencode/opencode-goal.js` share inode 563711073 (checked with `stat` on 2026-09-26). A promoted mode edits `.opencode/plugins/opencode-goal.js` once. T003 rechecks this before the edit |
| Verdict vocabulary split | The plugin returns `not_met` (`opencode-goal.js:179`). The shared core returns `not-met` for blocking language (`goal-core.cjs:603-604`) and `unclear` for its other four failing checks (`:601-617`). D7 normalizes both |
| Wrapper rule without a pattern copy | `VERIFIER_BLOCKING_PATTERN` is exported by neither module. The heuristic runs its length check and then its blocking check first (`opencode-goal.js:2201-2207`), so holding rows stopped at either check holds every pattern match |
| Reading "misses no `blocked` row" | Research R2's threshold is read as rows Jev was asked about. Rows labeled `blocked` that the wrapper rule holds keep the heuristic's `not_met` and are reported on their own line |
| Key-gate amendment | The research had one log line per verification with no key. The operator's rule is one line at enablement and none per verification, with exit 3 on a live call disabling the shadow for the session (D3) |
<!-- /ANCHOR:log -->
