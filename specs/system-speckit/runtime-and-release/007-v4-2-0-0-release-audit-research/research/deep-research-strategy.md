---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.3.0
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `frontier`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
v4.2.0.0 logic and features: remaining bugs, docs that drifted from the code, and bad UX in what shipped since v4.1.0.0 (window `v4.1.0.0..v4.2.0.0`, tag at `4be93f7ba19`).

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Does the overlay engine and its doctor commands (relayout, rollback, repin, json-entry merge, path and case handling) carry logic bugs in v4.2.0.0?
- [x] Do the deep-loop runtime changes (fan-out, expansive frontier, frontier_drained, --extend, convergence and the append gateway) carry logic bugs or drift from their docs?
- [x] Does the skill advisor (loop offers, the typed-only Python fallback, the common-words floor, native versus Python parity) misroute or drift from its docs?
- [x] Do the session hooks and spec tooling (Stop decision auto-record, tail packet detection, nested sub-tracks in create, validate and relocate) carry bugs or UX friction?
- [x] Where do the new v4.2.0.0 commands and hooks give operators bad UX: silent failures, misleading messages, unsafe defaults or dead ends?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Changelog prose and voice, already audited and fixed in the archived run.
- Fixing anything: this run reports findings only.
- Code that did not change in the window, unless a changed caller breaks it.

---

## 5. STOP CONDITIONS
- Every key question has a confirmed answer with `file:line` evidence, or is marked unresolved with what would settle it.
- Ten iterations reached.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Does the overlay engine and its doctor commands (relayout, rollback, repin, json-entry merge, path and case handling) carry logic bugs in v4.2.0.0?
- Do the deep-loop runtime changes (fan-out, expansive frontier, frontier_drained, --extend, convergence and the append gateway) carry logic bugs or drift from their docs?
- Does the skill advisor (loop offers, the typed-only Python fallback, the common-words floor, native versus Python parity) misroute or drift from its docs?
- Do the session hooks and spec tooling (Stop decision auto-record, tail packet detection, nested sub-tracks in create, validate and relocate) carry bugs or UX friction?
- Where do the new v4.2.0.0 commands and hooks give operators bad UX: silent failures, misleading messages, unsafe defaults or dead ends?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- blaming each cited line against `v4.1.0.0` before writing. It moved four plausible issues out of the window and kept the findings honest about NON-GOALS. (iteration 1)
- reading each fix as a rule, then grepping for every call site that rule should cover. Both findings came from a fix that guarded one site while a sibling kept the old pattern. Running the engine's own fixtures turned both into reproduced results instead of inference. (iteration 2)
- picking the smallest in-window script first paid off. `workflow-steps.cjs` is new in the window and short, so one reproduction proved the bug without a live run. (iteration 3)
- reading the current code around each in-window hunk, not just the hunk, is what surfaced the regression. It sits in `a20a1d96a05`, a sibling commit outside the five named. A cheap scratch reproduction closed the lineageId lead in one call, where reading alone kept it suspicious. (iteration 4)
- probing the same refusal prompt on both paths exposed the parity gap faster than reading the 60-commit gate history. (iteration 5)
- the probe through the compiled exported detector, fed transcripts built with `JSON.stringify`, exposed a gap the unit tests miss. The tests feed raw text, not JSON-escaped lines. (iteration 6)
- running `create.sh` from a scratch git repository was cheap and safe, because the script takes its root from `git rev-parse --show-toplevel`. That made the exact refusal text quotable. (iteration 7)
- a copied script, an empty provision list and a mode-switched stub isolated the new step in a few seconds. That made the exists-equals-done flaw reproducible without the real advisor or repository state. (iteration 8)
- runtime probes through the DB-dir override settled the self-heal question in one run. Source reading could not have done that, because the heal goes through the daemon rather than through `initDb` alone. (iteration 9)
- following each post-merge step in YAML order, and checking each step's skip condition, settled the question without running a fan-out. The data flow is declared in the YAML. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- reading the largest functions first, which spent budget on code mostly older than the window. The 76 in-window commits are the better map. (iteration 1)
- the first `grep -v "^#"` filter also hid the repro's own `###` result lines, which cost a rerun. (iteration 2)
- the commit list is too large to triage by subject line. The fan-out scripts alone carry 80 in-window commits, so they need an iteration of their own. (iteration 3)
- the reducer could not be run on the scratch copy because it refuses artifact roots outside the approved specs roots. So the typed-reducer half of the lead stays open. (iteration 4)
- the degraded CLI path cannot be forced without stopping the daemon, so its render step stayed inferred. (iteration 5)
- the race could not be shown without running the writer against real state, so it stays an inference. (iteration 6)
- the budget went to the Stop hook and `create.sh` first, so `worktree-naming.sh` was never reached. (iteration 7)
- the first scratch run cleaned up with `rm`, which the prompt bans. A fresh directory per case is the right pattern. (iteration 8)
- the planned processStartOf stub, because the stop functions are module-private. (iteration 9)
- trusting the inherited :1732 citation. A citation reused across iterations needs a reread before it carries a conclusion. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### (a) `parseArguments` treats any token whose text after its first two characters is `upstream`, `to`, `stage` or `rollback` as that flag [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8975], from commit `0bfe4d6e929`. So `auto`, `onto` and `xxto` act as `--to`. Reproduced: `repin --upstream /tmp xxto deadbeef --root /nonexistent-zz` gets past parsing to `root is not a directory` (exit 2) instead of printing usage. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: (a) `parseArguments` treats any token whose text after its first two characters is `upstream`, `to`, `stage` or `rollback` as that flag [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8975], from commit `0bfe4d6e929`. So `auto`, `onto` and `xxto` act as `--to`. Reproduced: `repin --upstream /tmp xxto deadbeef --root /nonexistent-zz` gets past parsing to `root is not a directory` (exit 2) instead of printing usage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: (a) `parseArguments` treats any token whose text after its first two characters is `upstream`, `to`, `stage` or `rollback` as that flag [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8975], from commit `0bfe4d6e929`. So `auto`, `onto` and `xxto` act as `--to`. Reproduced: `repin --upstream /tmp xxto deadbeef --root /nonexistent-zz` gets past parsing to `root is not a directory` (exit 2) instead of printing usage.

### (b) `status --json` prints plain text, not JSON, for a usage error and for a root that is not a directory [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9020] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9030]. That contradicts the catch block's own comment [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9044], from commit `f965c658d49`. Reproduced with `status --json --root /nonexistent-zz`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: (b) `status --json` prints plain text, not JSON, for a usage error and for a root that is not a directory [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9020] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9030]. That contradicts the catch block's own comment [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9044], from commit `f965c658d49`. Reproduced with `status --json --root /nonexistent-zz`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: (b) `status --json` prints plain text, not JSON, for a usage error and for a root that is not a directory [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9020] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9030]. That contradicts the catch block's own comment [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9044], from commit `f965c658d49`. Reproduced with `status --json --root /nonexistent-zz`.

### (c) `repin --rollback` has no staleness guard. `backup.json` records only the bytes from before the run [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:6641]. `rollbackUnderLock` checks only that the backup itself is intact [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:7323]. It never checks that the live tree still holds what the run wrote. So rolling back an older run after later re-pins, applies or hand edits overwrites them and removes the paths that run created. The route's plan is only a `find` listing of the run folder [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-repin.yaml:76]. This is inference and was not executed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: (c) `repin --rollback` has no staleness guard. `backup.json` records only the bytes from before the run [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:6641]. `rollbackUnderLock` checks only that the backup itself is intact [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:7323]. It never checks that the live tree still holds what the run wrote. So rolling back an older run after later re-pins, applies or hand edits overwrites them and removes the paths that run created. The route's plan is only a `find` listing of the run folder [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-repin.yaml:76]. This is inference and was not executed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: (c) `repin --rollback` has no staleness guard. `backup.json` records only the bytes from before the run [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:6641]. `rollbackUnderLock` checks only that the backup itself is intact [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:7323]. It never checks that the live tree still holds what the run wrote. So rolling back an older run after later re-pins, applies or hand edits overwrites them and removes the paths that run created. The route's plan is only a `find` listing of the run folder [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-repin.yaml:76]. This is inference and was not executed.

### (d) The relayout's final `run node ... apply` line lacks the `from <root>:` prefix [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8939], from commit `3d39e6a488b`. The in-window sweep `e7244e53648` left it as it was. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: (d) The relayout's final `run node ... apply` line lacks the `from <root>:` prefix [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8939], from commit `3d39e6a488b`. The in-window sweep `e7244e53648` left it as it was.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: (d) The relayout's final `run node ... apply` line lacks the `from <root>:` prefix [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8939], from commit `3d39e6a488b`. The in-window sweep `e7244e53648` left it as it was.

### **`documentLayout` misreads the indent unit or line ending.** None found on a read of the opener-step logic. The function had six in-window fixes, and the archived run already holds M7 for it [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1220]. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`documentLayout` misreads the indent unit or line ending.** None found on a read of the opener-step logic. The function had six in-window fixes, and the archived run already holds M7 for it [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1220].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`documentLayout` misreads the indent unit or line ending.** None found on a read of the opener-step logic. The function had six in-window fixes, and the archived run already holds M7 for it [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1220].

### **`frontier_drained` drifts from its docs.** It does not. The research candidate needs `depthMode == expansive`, `fanoutLineage`, at least one frontier node, none open or active, and at least one answered [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1243]. `fanoutLineage` is set only when the config carries `fanout_lineage_artifact_dir` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1673], and "open" counts both `open` and `active` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1667]. That matches [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:191] and [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:130]. The node-status vocabulary has no extra in-flight status that the open count would miss [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:79]. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`frontier_drained` drifts from its docs.** It does not. The research candidate needs `depthMode == expansive`, `fanoutLineage`, at least one frontier node, none open or active, and at least one answered [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1243]. `fanoutLineage` is set only when the config carries `fanout_lineage_artifact_dir` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1673], and "open" counts both `open` and `active` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1667]. That matches [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:191] and [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:130]. The node-status vocabulary has no extra in-flight status that the open count would miss [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:79].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`frontier_drained` drifts from its docs.** It does not. The research candidate needs `depthMode == expansive`, `fanoutLineage`, at least one frontier node, none open or active, and at least one answered [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1243]. `fanoutLineage` is set only when the config carries `fanout_lineage_artifact_dir` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1673], and "open" counts both `open` and `active` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1667]. That matches [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:191] and [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:130]. The node-status vocabulary has no extra in-flight status that the open count would miss [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:79].

### **A second signal re-enters the runner's stop.** It cannot. `writeStoppedSummary` returns early once it has written [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5255]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A second signal re-enters the runner's stop.** It cannot. `writeStoppedSummary` returns early once it has written [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5255].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A second signal re-enters the runner's stop.** It cannot. `writeStoppedSummary` returns early once it has written [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5255].

### **overlay.md omits `--stage` and `repin --json`.** Not drift. overlay.md documents the `/doctor:overlay` route, which uses `--stage` internally [SOURCE: .skilled/commands/doctor/overlay.md:110]. The engine's USAGE lists both flags [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:133]. A route narrower than its engine is not a contradiction. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **overlay.md omits `--stage` and `repin --json`.** Not drift. overlay.md documents the `/doctor:overlay` route, which uses `--stage` internally [SOURCE: .skilled/commands/doctor/overlay.md:110]. The engine's USAGE lists both flags [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:133]. A route narrower than its engine is not a contradiction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **overlay.md omits `--stage` and `repin --json`.** Not drift. overlay.md documents the `/doctor:overlay` route, which uses `--stage` internally [SOURCE: .skilled/commands/doctor/overlay.md:110]. The engine's USAGE lists both flags [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:133]. A route narrower than its engine is not a contradiction.

### **Pre-existing, out of window by NON-GOALS.** Each of these was blamed to a commit that `git merge-base --is-ancestor` puts before `v4.1.0.0`. They are recorded as observations, not findings: -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Pre-existing, out of window by NON-GOALS.** Each of these was blamed to a commit that `git merge-base --is-ancestor` puts before `v4.1.0.0`. They are recorded as observations, not findings:
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Pre-existing, out of window by NON-GOALS.** Each of these was blamed to a commit that `git merge-base --is-ancestor` puts before `v4.1.0.0`. They are recorded as observations, not findings:

### **Restored dropped values keep upstream's layout, not the live file's.** This is deliberate and the same on both restore paths. `restoreDroppedSets` writes the pin's own slice back ("so the file returns to upstream's bytes") [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2112]. `restoreDroppedKeys` does the same with `pinnedValueText` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2199]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Restored dropped values keep upstream's layout, not the live file's.** This is deliberate and the same on both restore paths. `restoreDroppedSets` writes the pin's own slice back ("so the file returns to upstream's bytes") [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2112]. `restoreDroppedKeys` does the same with `pinnedValueText` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2199].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Restored dropped values keep upstream's layout, not the live file's.** This is deliberate and the same on both restore paths. `restoreDroppedSets` writes the pin's own slice back ("so the file returns to upstream's bytes") [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2112]. `restoreDroppedKeys` does the same with `pinnedValueText` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2199].

### **Rollback writes through a linked ancestor.** It does not. `isDirectory` uses `lstat`, so a link standing where a folder was is unlinked rather than followed [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:273] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:7381]. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Rollback writes through a linked ancestor.** It does not. `isDirectory` uses `lstat`, so a link standing where a folder was is unlinked rather than followed [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:273] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:7381].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Rollback writes through a linked ancestor.** It does not. `isDirectory` uses `lstat`, so a link standing where a folder was is unlinked rather than followed [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:273] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:7381].

### **The `--extend-minutes` arithmetic is off.** It is not. The code computes `max(prior, elapsed) + M`, defaults M to the prior budget, and keeps no budget when the prior was 0 [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:157]. That matches [SOURCE: .skilled/commands/deep/research.md:119]. The reproduction gave 1062 = 1002 elapsed minutes + 60. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The `--extend-minutes` arithmetic is off.** It is not. The code computes `max(prior, elapsed) + M`, defaults M to the prior budget, and keeps no budget when the prior was 0 [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:157]. That matches [SOURCE: .skilled/commands/deep/research.md:119]. The reproduction gave 1062 = 1002 elapsed minutes + 60.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `--extend-minutes` arithmetic is off.** It is not. The code computes `max(prior, elapsed) + M`, defaults M to the prior budget, and keeps no budget when the prior was 0 [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:157]. That matches [SOURCE: .skilled/commands/deep/research.md:119]. The reproduction gave 1062 = 1002 elapsed minutes + 60.

### **The `documentLayout` chain `2b9a2328922`..`5f1af6159d0` has a reader bug.** None found by reading. The reader does the following: -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The `documentLayout` chain `2b9a2328922`..`5f1af6159d0` has a reader bug.** None found by reading. The reader does the following:
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `documentLayout` chain `2b9a2328922`..`5f1af6159d0` has a reader bug.** None found by reading. The reader does the following:

### **The `run_extended` lineageId breaks a restarted run (iteration 3 lead).** It does not, on the live path, and the line is out of window anyway. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The `run_extended` lineageId breaks a restarted run (iteration 3 lead).** It does not, on the live path, and the line is out of window anyway.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `run_extended` lineageId breaks a restarted run (iteration 3 lead).** It does not, on the live path, and the line is out of window anyway.

### **The exited-leader member split reads start times in the wrong zone.** It does not. Both sides are rendered under `TZ=UTC` and parsed field by field with `Date.UTC` (commit `4fc94bae0d3`) [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1282]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The exited-leader member split reads start times in the wrong zone.** It does not. Both sides are rendered under `TZ=UTC` and parsed field by field with `Date.UTC` (commit `4fc94bae0d3`) [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1282].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The exited-leader member split reads start times in the wrong zone.** It does not. Both sides are rendered under `TZ=UTC` and parsed field by field with `Date.UTC` (commit `4fc94bae0d3`) [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1282].

### **The gateway's legacy research branch mis-mints identity.** No defect was found. It drops caller-keyed fields before the builder mints them, and it uses the gateway clock for completed iterations [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:452]. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The gateway's legacy research branch mis-mints identity.** No defect was found. It drops caller-keyed fields before the builder mints them, and it uses the gateway clock for completed iterations [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:452].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The gateway's legacy research branch mis-mints identity.** No defect was found. It drops caller-keyed fields before the builder mints them, and it uses the gateway clock for completed iterations [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:452].

### **The json-entry layout fixes missed an emitter.** They did not. After `512be46971a`, every value writer passes the document's `unit` and `eol`, and none uses a hard-coded `\n` or two spaces: -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The json-entry layout fixes missed an emitter.** They did not. After `512be46971a`, every value writer passes the document's `unit` and `eol`, and none uses a hard-coded `\n` or two spaces:
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The json-entry layout fixes missed an emitter.** They did not. After `512be46971a`, every value writer passes the document's `unit` and `eol`, and none uses a hard-coded `\n` or two spaces:

### **The legacy flush-left rewrite skips `insertObjectKeys`.** Not a miss. Before `512be46971a`, that rewrite took its indent from `existing.keyStart`, which sits at the start of a line, so it never wrote flush-left. Only `set` and `setKeyOnItem` read the indent at the value's start, and both got the `isLegacyFlushLeft` path [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1304]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The legacy flush-left rewrite skips `insertObjectKeys`.** Not a miss. Before `512be46971a`, that rewrite took its indent from `existing.keyStart`, which sits at the start of a line, so it never wrote flush-left. Only `set` and `setKeyOnItem` read the indent at the value's start, and both got the `isLegacyFlushLeft` path [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1304].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The legacy flush-left rewrite skips `insertObjectKeys`.** Not a miss. Before `512be46971a`, that rewrite took its indent from `existing.keyStart`, which sits at the start of a line, so it never wrote flush-left. Only `set` and `setKeyOnItem` read the indent at the value's start, and both got the `isLegacyFlushLeft` path [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1304].

### **The relayout backup skips files silently.** It does not. `copyForBackup` prints a `skipped` line for each protected path it leaves out, and the failure message names them [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8580]. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The relayout backup skips files silently.** It does not. `copyForBackup` prints a `skipped` line for each protected path it leaves out, and the failure message names them [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8580].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The relayout backup skips files silently.** It does not. `copyForBackup` prints a `skipped` line for each protected path it leaves out, and the failure message names them [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8580].

### **The removal edits mangle CRLF files.** They do not. They delete from the previous item's end or to the next item's start, so they insert no line ending [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1732] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1833]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The removal edits mangle CRLF files.** They do not. They delete from the previous item's end or to the next item's start, so they insert no line ending [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1732] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1833].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The removal edits mangle CRLF files.** They do not. They delete from the previous item's end or to the next item's start, so they insert no line ending [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1732] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1833].

### **The research `--extend` warning should name `frontier_drained` as the review twin does.** It should not. `--extend` refuses fan-out [SOURCE: .skilled/commands/deep/research.md:118], and only a fan-out lineage forms the research candidate [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1244]. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The research `--extend` warning should name `frontier_drained` as the review twin does.** It should not. `--extend` refuses fan-out [SOURCE: .skilled/commands/deep/research.md:118], and only a fan-out lineage forms the research candidate [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1244].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The research `--extend` warning should name `frontier_drained` as the review twin does.** It should not. `--extend` refuses fan-out [SOURCE: .skilled/commands/deep/research.md:118], and only a fan-out lineage forms the research candidate [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1244].

### **The research trust merge keys untrust on the wrong iteration field.** It does not. `findingUntrustReason` is passed `finding.addedAtIteration` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:841], and the reducer writes key findings with `addedAtIteration: iteration.run` [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2818]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The research trust merge keys untrust on the wrong iteration field.** It does not. `findingUntrustReason` is passed `finding.addedAtIteration` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:841], and the reducer writes key findings with `addedAtIteration: iteration.run` [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2818].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The research trust merge keys untrust on the wrong iteration field.** It does not. `findingUntrustReason` is passed `finding.addedAtIteration` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:841], and the reducer writes key findings with `addedAtIteration: iteration.run` [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2818].

### `--extend`, `step_frontier_*` and the frontier caps as post-merge readers. The first two are refused on a fan-out config, and the seed steps run before spawn, not after the merge. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `--extend`, `step_frontier_*` and the frontier caps as post-merge readers. The first two are refused on a fan-out config, and the seed steps run before spawn, not after the merge.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `--extend`, `step_frontier_*` and the frontier caps as post-merge readers. The first two are refused on a fan-out config, and the seed steps run before spawn, not after the merge.

### `[speckit] This packet fits no existing sub-track of demo. Consider proposing a new sub-track.` printed on a level-2 create in scratch. The scratch sub-track descriptions held no keywords, so the advice is a fixture artifact and is not counted. The "fits no" branch is also unchanged in the window. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `[speckit] This packet fits no existing sub-track of demo. Consider proposing a new sub-track.` printed on a level-2 create in scratch. The scratch sub-track descriptions held no keywords, so the advice is a fixture artifact and is not counted. The "fits no" branch is also unchanged in the window.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `[speckit] This packet fits no existing sub-track of demo. Consider proposing a new sub-track.` printed on a level-2 create in scratch. The scratch sub-track descriptions held no keywords, so the advice is a fixture artifact and is not counted. The "fits no" branch is also unchanged in the window.

### `documentLayout` has a single caller [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2228]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `documentLayout` has a single caller [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2228].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `documentLayout` has a single caller [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2228].

### `insertItems` and `appendItems` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1561] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1581] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `insertItems` and `appendItems` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1561] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1581]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `insertItems` and `appendItems` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1561] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1581]

### `insertObjectKeys` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1620] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1638] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `insertObjectKeys` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1620] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1638]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `insertObjectKeys` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1620] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1638]

### `process.on` (from `978b74e8df7`) keeps libuv catching the repeat, so the repeat no longer kills the process with the default disposition. This matches [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:183]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `process.on` (from `978b74e8df7`) keeps libuv catching the repeat, so the repeat no longer kills the process with the default disposition. This matches [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:183].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `process.on` (from `978b74e8df7`) keeps libuv catching the repeat, so the repeat no longer kills the process with the default disposition. This matches [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:183].

### `set` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1426] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1445] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `set` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1426] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1445]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `set` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1426] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1445]

### `setKeyOnItem` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1483] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1492] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `setKeyOnItem` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1483] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1492]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `setKeyOnItem` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1483] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1492]

### A scan exit code that reads success when the scan's own status is `failed`. The CLI returns `invoked.isError ? EXIT_RUNTIME : EXIT_SUCCESS` [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1702], and whether a failed scan sets `isError` was not traced. This is left as a lead, not counted. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A scan exit code that reads success when the scan's own status is `failed`. The CLI returns `invoked.isError ? EXIT_RUNTIME : EXIT_SUCCESS` [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1702], and whether a failed scan sets `isError` was not traced. This is left as a lead, not counted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A scan exit code that reads success when the scan's own status is `failed`. The CLI returns `invoked.isError ? EXIT_RUNTIME : EXIT_SUCCESS` [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1702], and whether a failed scan sets `isError` was not traced. This is left as a lead, not counted.

### A unit stub of `processStartOf`: `classifyLineagesForStop`, `lineageIdentityRefusal` and `processStartOf` are not in `module.exports`. The pinned vitest case covers the same row shape. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A unit stub of `processStartOf`: `classifyLineagesForStop`, `lineageIdentityRefusal` and `processStartOf` are not in `module.exports`. The pinned vitest case covers the same row shape.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A unit stub of `processStartOf`: `classifyLineagesForStop`, `lineageIdentityRefusal` and `processStartOf` are not in `module.exports`. The pinned vitest case covers the same row shape.

### Duplicate rows when the consumed write fails. The writer keys rows by source key [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:806], and `recordConsumedKeys` skips keys already logged [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:936]. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Duplicate rows when the consumed write fails. The writer keys rows by source key [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:806], and `recordConsumedKeys` skips keys already logged [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:936].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Duplicate rows when the consumed write fails. The writer keys rows by source key [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:806], and `recordConsumedKeys` skips keys already logged [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:936].

### Forcing the CLI degraded path: no env switch exists. It runs only when the daemon is unreachable [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1636], so finding 1's render step stays inferred. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Forcing the CLI degraded path: no env switch exists. It runs only when the daemon is unreachable [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1636], so finding 1's render step stays inferred.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Forcing the CLI degraded path: no env switch exists. It runs only when the daemon is unreachable [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1636], so finding 1's render step stays inferred.

### It breaks ties toward the shorter step, and otherwise falls back to the shallowest indent [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1220]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: It breaks ties toward the shorter step, and otherwise falls back to the shallowest indent [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1220].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: It breaks ties toward the shorter step, and otherwise falls back to the shallowest indent [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1220].

### It counts steps only from a line that opens one container, with strings stripped first. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: It counts steps only from a line that opens one container, with strings stripped first.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: It counts steps only from a line that opens one container, with strings stripped first.

### It requires the next line's indent to extend the opener's. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: It requires the next line's indent to extend the opener's.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: It requires the next line's indent to extend the opener's.

### It takes the majority line ending. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: It takes the majority line ending.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: It takes the majority line ending.

### None new. -- BLOCKED (iteration 10, 2 attempts)
- What was tried: None new.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new.

### None that the reducer should treat as exhausted. The json-entry layout chain is closed for sibling sites, and a further pass on it is unlikely to pay. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: None that the reducer should treat as exhausted. The json-entry layout chain is closed for sibling sites, and a further pass on it is unlikely to pay.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None that the reducer should treat as exhausted. The json-entry layout chain is closed for sibling sites, and a further pass on it is unlikely to pay.

### None this iteration. The `frontier_drained` stop logic and the `--extend-minutes` arithmetic are candidates for the reducer to mark exhausted. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: None this iteration. The `frontier_drained` stop logic and the `--extend-minutes` arithmetic are candidates for the reducer to mark exhausted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration. The `frontier_drained` stop logic and the `--extend-minutes` arithmetic are candidates for the reducer to mark exhausted.

### None to promote. -- BLOCKED (iteration 8, 2 attempts)
- What was tried: None to promote.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None to promote.

### None to promote. The relocate two-level rewrite (`relocate.mjs`) was only grep-read for depth logic and is not exhausted. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: None to promote. The relocate two-level rewrite (`relocate.mjs`) was only grep-read for depth logic and is not exhausted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None to promote. The relocate two-level rewrite (`relocate.mjs`) was only grep-read for depth logic and is not exhausted.

### None. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: None.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None.

### Proving (c) by execution needs a live re-pin with a later edit, which writes outside this packet. It is left as inference. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Proving (c) by execution needs a live re-pin with a later edit, which writes outside this packet. It is left as inference.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Proving (c) by execution needs a live re-pin with a later edit, which writes outside this packet. It is left as inference.

### Reproduced on a scratch copy of this packet, which is itself a restart (generation 2, `parentSessionId` set). `extend-research` exited 0 and staged `scope.lineageId = 2026-11-25T08:04:38Z`. The gateway accepted it (exit 0, receipt sequence 8, `projectionRefreshed: true`), and a later iteration record with `lineageId = sessionId` was accepted too (exit 0, sequence 9). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Reproduced on a scratch copy of this packet, which is itself a restart (generation 2, `parentSessionId` set). `extend-research` exited 0 and staged `scope.lineageId = 2026-11-25T08:04:38Z`. The gateway accepted it (exit 0, receipt sequence 8, `projectionRefreshed: true`), and a later iteration record with `lineageId = sessionId` was accepted too (exit 0, sequence 9).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reproduced on a scratch copy of this packet, which is itself a restart (generation 2, `parentSessionId` set). `extend-research` exited 0 and staged `scope.lineageId = 2026-11-25T08:04:38Z`. The gateway accepted it (exit 0, receipt sequence 8, `projectionRefreshed: true`), and a later iteration record with `lineageId = sessionId` was accepted too (exit 0, sequence 9).

### Residual: the typed reducer's `assertRunIdentity` refuses a lineageId that differs from `run_initialized`'s [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts:465]. Its callers were not traced, so a typed full-ledger fold of a restarted and extended run is unverified. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Residual: the typed reducer's `assertRunIdentity` refuses a lineageId that differs from `run_initialized`'s [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts:465]. Its callers were not traced, so a typed full-ledger fold of a restarted and extended run is unverified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Residual: the typed reducer's `assertRunIdentity` refuses a lineageId that differs from `run_initialized`'s [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts:465]. Its callers were not traced, so a typed full-ledger fold of a restarted and extended run is unverified.

### The `run_extended` lineageId lead is closed for the live gateway path. The reducer can mark it exhausted. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The `run_extended` lineageId lead is closed for the live gateway path. The reducer can mark it exhausted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `run_extended` lineageId lead is closed for the live gateway path. The reducer can mark it exhausted.

### The doc states the same rule [SOURCE: .skilled/skills/system-skilled-doctor/references/overlays.md:65], so there is no drift. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The doc states the same rule [SOURCE: .skilled/skills/system-skilled-doctor/references/overlays.md:65], so there is no drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The doc states the same rule [SOURCE: .skilled/skills/system-skilled-doctor/references/overlays.md:65], so there is no drift.

### The file-mode regression in `957f47570f3` was restored before the tag, as noted under Checked clean. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: The file-mode regression in `957f47570f3` was restored before the tag, as noted under Checked clean.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The file-mode regression in `957f47570f3` was restored before the tag, as noted under Checked clean.

### The grace wait blocks synchronously on `Atomics.wait`, so a queued handler runs only after `process.exit` has already been called in `finally` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:714]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The grace wait blocks synchronously on `Atomics.wait`, so a queued handler runs only after `process.exit` has already been called in `finally` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:714].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The grace wait blocks synchronously on `Atomics.wait`, so a queued handler runs only after `process.exit` has already been called in `finally` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:714].

### The live record in this packet holds rows Q001 to Q007, all `Recorded automatically:`, one source comment each, and no duplicates [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/decision-record.md:37] [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/decision-record.md:43]. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: The live record in this packet holds rows Q001 to Q007, all `Recorded automatically:`, one source comment each, and no duplicates [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/decision-record.md:37] [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/decision-record.md:43].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The live record in this packet holds rows Q001 to Q007, all `Recorded automatically:`, one source comment each, and no duplicates [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/decision-record.md:37] [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/decision-record.md:43].

### The reducer as a reader of the merged frontier. It rebuilds the frontier from the node store. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: The reducer as a reader of the merged frontier. It rebuilds the frontier from the node store.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The reducer as a reader of the merged frontier. It rebuilds the frontier from the node store.

### The research trust merge's labelling and question reopening read clean. A further pass on it is unlikely to pay, except for the frontier lead below. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The research trust merge's labelling and question reopening read clean. A further pass on it is unlikely to pay, except for the frontier lead below.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The research trust merge's labelling and question reopening read clean. A further pass on it is unlikely to pay, except for the frontier lead below.

### The same `lineageId = lineage.parentSessionId || sessionId` was already in the v4.1.0.0 YAML at line 594 (`git show v4.1.0.0:.skilled/commands/deep/assets/deep-research.yaml`). `d239dd6d2ae` only moved it into [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:166]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The same `lineageId = lineage.parentSessionId || sessionId` was already in the v4.1.0.0 YAML at line 594 (`git show v4.1.0.0:.skilled/commands/deep/assets/deep-research.yaml`). `d239dd6d2ae` only moved it into [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:166].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The same `lineageId = lineage.parentSessionId || sessionId` was already in the v4.1.0.0 YAML at line 594 (`git show v4.1.0.0:.skilled/commands/deep/assets/deep-research.yaml`). `d239dd6d2ae` only moved it into [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:166].

### The stuck-close gate at yaml:1388 on merged data, because the merged frontier has no `activeNodeId`. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: The stuck-close gate at yaml:1388 on merged data, because the merged frontier has no `activeNodeId`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The stuck-close gate at yaml:1388 on merged data, because the merged frontier has no `activeNodeId`.

### Two sub-track levels in the track reader: the depth guard reports a declared folder past level 2 and never reads it [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:41] (`MAX_SUB_TRACK_DEPTH = 2`, added in `b0b3c8d9bf1`). In `validate.sh`, sub-track detection recognizes a level-2 sub-track only directly inside a level-1 one [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:222], and the recursive walk descends exactly one more level [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:453]. `create.sh` refuses a `--track` with four or more segments and prints an actionable message (`b0b3c8d9bf1` hunk). No two-level path break was found in what was read. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Two sub-track levels in the track reader: the depth guard reports a declared folder past level 2 and never reads it [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:41] (`MAX_SUB_TRACK_DEPTH = 2`, added in `b0b3c8d9bf1`). In `validate.sh`, sub-track detection recognizes a level-2 sub-track only directly inside a level-1 one [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:222], and the recursive walk descends exactly one more level [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:453]. `create.sh` refuses a `--track` with four or more segments and prints an actionable message (`b0b3c8d9bf1` hunk). No two-level path break was found in what was read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Two sub-track levels in the track reader: the depth guard reports a declared folder past level 2 and never reads it [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:41] (`MAX_SUB_TRACK_DEPTH = 2`, added in `b0b3c8d9bf1`). In `validate.sh`, sub-track detection recognizes a level-2 sub-track only directly inside a level-1 one [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:222], and the recursive walk descends exactly one more level [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:453]. `create.sh` refuses a `--track` with four or more segments and prints an actionable message (`b0b3c8d9bf1` hunk). No two-level path break was found in what was read.

### Untrusted-only answers go back to open, and the doc states the same rule [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md:50]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Untrusted-only answers go back to open, and the doc states the same rule [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md:50].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Untrusted-only answers go back to open, and the doc states the same rule [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md:50].

### Using the parent as the lineage id is the packet's convention, not a slip. The legacy deltas contract reads `scope.lineageId` back as `parentSessionId` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-deltas-contract.ts:96], and `run_restarted` takes its archived lineage from `parentSessionId` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:654]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Using the parent as the lineage id is the packet's convention, not a slip. The legacy deltas contract reads `scope.lineageId` back as `parentSessionId` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-deltas-contract.ts:96], and `run_restarted` takes its archived lineage from `parentSessionId` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:654].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using the parent as the lineage id is the packet's convention, not a slip. The legacy deltas contract reads `scope.lineageId` back as `parentSessionId` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-deltas-contract.ts:96], and `run_restarted` takes its archived lineage from `parentSessionId` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:654].

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- (a) `parseArguments` treats any token whose text after its first two characters is `upstream`, `to`, `stage` or `rollback` as that flag [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8975], from commit `0bfe4d6e929`. So `auto`, `onto` and `xxto` act as `--to`. Reproduced: `repin --upstream /tmp xxto deadbeef --root /nonexistent-zz` gets past parsing to `root is not a directory` (exit 2) instead of printing usage. (iteration 1)
- (b) `status --json` prints plain text, not JSON, for a usage error and for a root that is not a directory [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9020] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9030]. That contradicts the catch block's own comment [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9044], from commit `f965c658d49`. Reproduced with `status --json --root /nonexistent-zz`. (iteration 1)
- (c) `repin --rollback` has no staleness guard. `backup.json` records only the bytes from before the run [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:6641]. `rollbackUnderLock` checks only that the backup itself is intact [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:7323]. It never checks that the live tree still holds what the run wrote. So rolling back an older run after later re-pins, applies or hand edits overwrites them and removes the paths that run created. The route's plan is only a `find` listing of the run folder [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-repin.yaml:76]. This is inference and was not executed. (iteration 1)
- (d) The relayout's final `run node ... apply` line lacks the `from <root>:` prefix [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8939], from commit `3d39e6a488b`. The in-window sweep `e7244e53648` left it as it was. (iteration 1)
- **`documentLayout` misreads the indent unit or line ending.** None found on a read of the opener-step logic. The function had six in-window fixes, and the archived run already holds M7 for it [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1220]. (iteration 1)
- **overlay.md omits `--stage` and `repin --json`.** Not drift. overlay.md documents the `/doctor:overlay` route, which uses `--stage` internally [SOURCE: .skilled/commands/doctor/overlay.md:110]. The engine's USAGE lists both flags [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:133]. A route narrower than its engine is not a contradiction. (iteration 1)
- **Pre-existing, out of window by NON-GOALS.** Each of these was blamed to a commit that `git merge-base --is-ancestor` puts before `v4.1.0.0`. They are recorded as observations, not findings: (iteration 1)
- **Rollback writes through a linked ancestor.** It does not. `isDirectory` uses `lstat`, so a link standing where a folder was is unlinked rather than followed [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:273] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:7381]. (iteration 1)
- **The relayout backup skips files silently.** It does not. `copyForBackup` prints a `skipped` line for each protected path it leaves out, and the failure message names them [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8580]. (iteration 1)
- Proving (c) by execution needs a live re-pin with a later edit, which writes outside this packet. It is left as inference. (iteration 1)
- **Restored dropped values keep upstream's layout, not the live file's.** This is deliberate and the same on both restore paths. `restoreDroppedSets` writes the pin's own slice back ("so the file returns to upstream's bytes") [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2112]. `restoreDroppedKeys` does the same with `pinnedValueText` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2199]. (iteration 2)
- **The `documentLayout` chain `2b9a2328922`..`5f1af6159d0` has a reader bug.** None found by reading. The reader does the following: (iteration 2)
- **The json-entry layout fixes missed an emitter.** They did not. After `512be46971a`, every value writer passes the document's `unit` and `eol`, and none uses a hard-coded `\n` or two spaces: (iteration 2)
- **The legacy flush-left rewrite skips `insertObjectKeys`.** Not a miss. Before `512be46971a`, that rewrite took its indent from `existing.keyStart`, which sits at the start of a line, so it never wrote flush-left. Only `set` and `setKeyOnItem` read the indent at the value's start, and both got the `isLegacyFlushLeft` path [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1304]. (iteration 2)
- **The removal edits mangle CRLF files.** They do not. They delete from the previous item's end or to the next item's start, so they insert no line ending [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1732] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1833]. (iteration 2)
- `documentLayout` has a single caller [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2228]. (iteration 2)
- `insertItems` and `appendItems` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1561] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1581] (iteration 2)
- `insertObjectKeys` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1620] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1638] (iteration 2)
- `set` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1426] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1445] (iteration 2)
- `setKeyOnItem` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1483] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1492] (iteration 2)
- It breaks ties toward the shorter step, and otherwise falls back to the shallowest indent [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1220]. (iteration 2)
- It counts steps only from a line that opens one container, with strings stripped first. (iteration 2)
- It requires the next line's indent to extend the opener's. (iteration 2)
- It takes the majority line ending. (iteration 2)
- None that the reducer should treat as exhausted. The json-entry layout chain is closed for sibling sites, and a further pass on it is unlikely to pay. (iteration 2)
- The doc states the same rule [SOURCE: .skilled/skills/system-skilled-doctor/references/overlays.md:65], so there is no drift. (iteration 2)
- **`frontier_drained` drifts from its docs.** It does not. The research candidate needs `depthMode == expansive`, `fanoutLineage`, at least one frontier node, none open or active, and at least one answered [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1243]. `fanoutLineage` is set only when the config carries `fanout_lineage_artifact_dir` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1673], and "open" counts both `open` and `active` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1667]. That matches [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:191] and [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:130]. The node-status vocabulary has no extra in-flight status that the open count would miss [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:79]. (iteration 3)
- **The `--extend-minutes` arithmetic is off.** It is not. The code computes `max(prior, elapsed) + M`, defaults M to the prior budget, and keeps no budget when the prior was 0 [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:157]. That matches [SOURCE: .skilled/commands/deep/research.md:119]. The reproduction gave 1062 = 1002 elapsed minutes + 60. (iteration 3)
- **The gateway's legacy research branch mis-mints identity.** No defect was found. It drops caller-keyed fields before the builder mints them, and it uses the gateway clock for completed iterations [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:452]. (iteration 3)
- **The research `--extend` warning should name `frontier_drained` as the review twin does.** It should not. `--extend` refuses fan-out [SOURCE: .skilled/commands/deep/research.md:118], and only a fan-out lineage forms the research candidate [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1244]. (iteration 3)
- None this iteration. The `frontier_drained` stop logic and the `--extend-minutes` arithmetic are candidates for the reducer to mark exhausted. (iteration 3)
- **A second signal re-enters the runner's stop.** It cannot. `writeStoppedSummary` returns early once it has written [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5255]. (iteration 4)
- **The `run_extended` lineageId breaks a restarted run (iteration 3 lead).** It does not, on the live path, and the line is out of window anyway. (iteration 4)
- **The exited-leader member split reads start times in the wrong zone.** It does not. Both sides are rendered under `TZ=UTC` and parsed field by field with `Date.UTC` (commit `4fc94bae0d3`) [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1282]. (iteration 4)
- **The research trust merge keys untrust on the wrong iteration field.** It does not. `findingUntrustReason` is passed `finding.addedAtIteration` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:841], and the reducer writes key findings with `addedAtIteration: iteration.run` [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2818]. (iteration 4)
- `process.on` (from `978b74e8df7`) keeps libuv catching the repeat, so the repeat no longer kills the process with the default disposition. This matches [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:183]. (iteration 4)
- Reproduced on a scratch copy of this packet, which is itself a restart (generation 2, `parentSessionId` set). `extend-research` exited 0 and staged `scope.lineageId = 2026-11-25T08:04:38Z`. The gateway accepted it (exit 0, receipt sequence 8, `projectionRefreshed: true`), and a later iteration record with `lineageId = sessionId` was accepted too (exit 0, sequence 9). (iteration 4)
- Residual: the typed reducer's `assertRunIdentity` refuses a lineageId that differs from `run_initialized`'s [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts:465]. Its callers were not traced, so a typed full-ledger fold of a restarted and extended run is unverified. (iteration 4)
- The `run_extended` lineageId lead is closed for the live gateway path. The reducer can mark it exhausted. (iteration 4)
- The grace wait blocks synchronously on `Atomics.wait`, so a queued handler runs only after `process.exit` has already been called in `finally` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:714]. (iteration 4)
- The research trust merge's labelling and question reopening read clean. A further pass on it is unlikely to pay, except for the frontier lead below. (iteration 4)
- The same `lineageId = lineage.parentSessionId || sessionId` was already in the v4.1.0.0 YAML at line 594 (`git show v4.1.0.0:.skilled/commands/deep/assets/deep-research.yaml`). `d239dd6d2ae` only moved it into [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:166]. (iteration 4)
- Untrusted-only answers go back to open, and the doc states the same rule [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md:50]. (iteration 4)
- Using the parent as the lineage id is the packet's convention, not a slip. The legacy deltas contract reads `scope.lineageId` back as `parentSessionId` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-deltas-contract.ts:96], and `run_restarted` takes its archived lineage from `parentSessionId` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:654]. (iteration 4)
- Forcing the CLI degraded path: no env switch exists. It runs only when the daemon is unreachable [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1636], so finding 1's render step stays inferred. (iteration 5)
- None. (iteration 5)
- Duplicate rows when the consumed write fails. The writer keys rows by source key [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:806], and `recordConsumedKeys` skips keys already logged [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:936]. (iteration 6)
- None to promote. The relocate two-level rewrite (`relocate.mjs`) was only grep-read for depth logic and is not exhausted. (iteration 6)
- The live record in this packet holds rows Q001 to Q007, all `Recorded automatically:`, one source comment each, and no duplicates [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/decision-record.md:37] [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/decision-record.md:43]. (iteration 6)
- Two sub-track levels in the track reader: the depth guard reports a declared folder past level 2 and never reads it [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:41] (`MAX_SUB_TRACK_DEPTH = 2`, added in `b0b3c8d9bf1`). In `validate.sh`, sub-track detection recognizes a level-2 sub-track only directly inside a level-1 one [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:222], and the recursive walk descends exactly one more level [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:453]. `create.sh` refuses a `--track` with four or more segments and prints an actionable message (`b0b3c8d9bf1` hunk). No two-level path break was found in what was read. (iteration 6)
- `[speckit] This packet fits no existing sub-track of demo. Consider proposing a new sub-track.` printed on a level-2 create in scratch. The scratch sub-track descriptions held no keywords, so the advice is a fixture artifact and is not counted. The "fits no" branch is also unchanged in the window. (iteration 7)
- None to promote. (iteration 7)
- A scan exit code that reads success when the scan's own status is `failed`. The CLI returns `invoked.isError ? EXIT_RUNTIME : EXIT_SUCCESS` [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1702], and whether a failed scan sets `isError` was not traced. This is left as a lead, not counted. (iteration 8)
- The file-mode regression in `957f47570f3` was restored before the tag, as noted under Checked clean. (iteration 8)
- A unit stub of `processStartOf`: `classifyLineagesForStop`, `lineageIdentityRefusal` and `processStartOf` are not in `module.exports`. The pinned vitest case covers the same row shape. (iteration 9)
- None new. (iteration 9)
- `--extend`, `step_frontier_*` and the frontier caps as post-merge readers. The first two are refused on a fan-out config, and the seed steps run before spawn, not after the merge. (iteration 10)
- The reducer as a reader of the merged frontier. It rebuilds the frontier from the node store. (iteration 10)
- The stuck-close gate at yaml:1388 on merged data, because the merged frontier has no `activeNodeId`. (iteration 10)

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
- Can a lineage dealt zero frontier nodes seed its own `F-1-*` ids? (iteration 9)
- Does any base-directory step after a fan-out merge read `registry.frontier` from the merged `findings-registry.json`? (iteration 9)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
The archived run at `research_archive/20261125T162358Z/research.md` audited the release notes against the window. It confirmed 16 findings (9 missing, 5 drift, 2 bug) and rejected 10. Both bugs are fixed: the case-insensitive `root/skilled` overlay guard (`.skilled/commands/doctor/scripts/overlay-engine.cjs`) and the lost executable bits on `worktree-naming.sh`, its test and `skill_advisor.py`. Do not report those again. The Stop decision auto-record limits (Claude only, exactly one tail packet, misfiling on a late packet switch) are already documented in the notes.

resource-map.md not present; skipping coverage gate

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`, `completed-continue` through `--extend=N` and `--extend-minutes=M` (live)
- Deferred lifecycle branch: `fork` (not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 2
- Started: 2026-11-25T16:24:14Z
