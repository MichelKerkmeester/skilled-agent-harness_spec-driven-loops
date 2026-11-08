---
title: "Decision Record: Phase 4: advisor-hooks-relaunch"
description: "Decisions taken while running the forced-depth deep-research loop for the advisor, hooks and relaunch cluster: how the workflow was executed, how it was steered and every executor or scope call made without an operator."
trigger_phrases:
  - "advisor hooks relaunch decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/004-advisor-hooks-relaunch"
    last_updated_at: "2026-11-08T20:05:00Z"
    last_updated_by: "orchestrator-b"
    recent_action: "Initialized the research run and dispatched iteration 1"
    next_safe_action: "Steer each iteration, then run the depth checkpoint after iteration 10"
    blockers: []
    key_files:
      - "research/deep-research-state.jsonl"
      - "research/deep-research-strategy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-b-004"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 4: advisor-hooks-relaunch

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Execute the auto workflow step by step with a one-pass driver

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-08 |
| **Deciders** | Orchestrator B (operator unavailable; decisions pre-authorized by the lead's brief) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The brief asks for `/deep:research:auto` with `--executor=cli-devin --model=deepseek-v4-1-flash-max --executor-timeout=2400 --max-iterations=10 --stop-policy=max-iterations`, executed through `deep-research-auto.yaml` with no hand-rolled loop, and asks for steering after every iteration. The `deep:research` skill is not exposed to this leaf, so the YAML has to be run by hand.

### Constraints

- Dispatch must go through the YAML's `if_cli_devin` branch, which builds the command with `buildLineageCommand` from `fanout-run.cjs`.
- Steering needs a pause between iterations, so one long-running loop process would remove the steering window.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a scratch driver that runs exactly one `phase_loop` pass per call, using the YAML's own commands for every step, and the orchestrator calls it once per iteration.

**How it works**: `init.sh` runs `phase_init` (lock acquire, config, gateway run-open event, strategy, registry, spec check, targeted validate, telemetry). `iter.sh` runs lock refresh, read state, sentinels, graph convergence, the convergence decision, marker scan, prompt-pack render, the executor sentinel, the `if_cli_devin` heredoc verbatim, `verify-iteration.cjs` with one redispatch, the reducer, graph upsert and progress telemetry. The driver lives in the orchestrator's scratchpad, never in the repository.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One-pass driver per iteration** | YAML commands verbatim, steering window between passes | Driver must bind placeholders correctly | 8/10 |
| Single-lineage fan-out through `fanout-run.cjs` | One command runs the whole loop | No steering window, and the brief names the single-executor path | 4/10 |

**Why this one**: it keeps the workflow's dispatch, validation and reducer contract while giving the orchestrator the per-iteration steering the brief requires.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Every iteration is validated by `verify-iteration.cjs` and reduced by `reduce-state.cjs` before the next focus is set.

**What it costs**:
- Placeholder binding is done by the orchestrator. Mitigation: bind from the config file each pass and log every step's output.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Driver diverges from the YAML | M | Each step in the driver is labelled with its YAML step id and copies the YAML command |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The skill tool is unavailable to this leaf |
| 2 | **Beyond Local Maxima?** | PASS | Fan-out path considered and rejected |
| 3 | **Sufficient?** | PASS | One pass per call is the smallest unit that still allows steering |
| 4 | **Fits Goal?** | PASS | Forced depth plus steering is the brief |
| 5 | **Open Horizons?** | PASS | The same driver serves the extension iterations |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Research state under `research/` only.

**How to roll back**: move `research/` aside; nothing outside this folder was written.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:run-decisions -->
## Run Decisions Log

| ID | Decision | Why | Evidence |
|----|----------|-----|----------|
| D-01 | Write `executor.kind` in the config and bind the YAML's `{config.executor.type}` to it | `executor-config.ts` treats `type` as a deprecated alias of `kind` and warns on it | `normalizeExecutorConfigInput` in `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` |
| D-02 | Steer through the strategy's Next Focus section between the reducer pass and the next prompt render | The reducer rewrites that section after every iteration and `step_read_state` reads it before the next render, so that window is the workflow's own steering surface | `step_read_state.next_focus` and `step_reduce_state` in `deep-research-auto.yaml` |
| D-03 | Run child 003 and child 004 dispatches concurrently, two devin processes | The brief asks for concurrent children; cli-devin rule 15 allows parallel dispatch when it is explicitly authorized | `cli-devin/SKILL.md` §4 rule 15, the lead's brief |
| D-04 | Continue after the targeted pre-init validate failed | It failed only on `PLACEHOLDER_FILLED` in the still-scaffolded plan, tasks and implementation summary; the spec check itself was a dedupe with no mutation | init log: `Summary: Errors: 1`, all listed lines in `implementation-summary.md`, `plan.md`, `tasks.md` |
| D-05 | Skip `step_stage_artifact_dir` (`git add`) | The brief allows no git mutation and another orchestrator shares the index; the step is non-fatal by contract | `step_stage_artifact_dir.on_fail` in `deep-research-auto.yaml` |
| D-06 | Export `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` for each dispatch | The prompt pack already says no operator is present; the variables pass the dispatch env allowlist | `buildExecutorDispatchEnv` allowlist in `executor-audit.ts` |
| D-07 | Leave the prompt pack without an inlined deep-research persona | Changing the workflow is out of scope; recorded as a research observation instead | `prompt-pack-iteration.md.tmpl` carries only the route line |
| D-08 | Keep the git-hook and doctor findings from iterations 12 and 13 as cross-cluster P2s, then pull the focus back to the cluster | They are verified and useful, but they belong to cluster 005; dropping them would lose evidence, and promoting them would misstate this cluster | `template-phrase-lint.mjs:28-34`, `pre-commit:232-234`, `agents-md-manifest.cjs --check` exit 1 |
| D-09 | Depth checkpoint after iteration 10: extend by +5 to 15 | Below the bar: v4.0.0.5, .10, .11, .12, .15 and .16 were only partly read, and P1s arrived in iterations 5 to 8 | `extend.sh` printed `maxIterations 10 -> 15` and `resumed gateway exit=0` |
| D-10 | Second checkpoint after iteration 15: stop | Every release has a coverage row, and iteration 15 was a re-verification sweep (newInfoRatio 0.30) whose new P1s the orchestrator downgraded on evidence | `research/research.md` section 14 |
| D-11 | Correct three executor P1s and downgrade two more to P2, keeping the executor's text and recording why | The plugin suite is green without the inherited `AI_SESSION_CHILD`; the doctor-bridge order follows the lead-phrase rule; the child-session quiet is deliberate; the "zero coverage" claim ignores `fixtures/prose-menu-numbered.json`; the "181 adapters" count was not reproducible | Steering Log rows for generation-2 iterations 9, 10, 11 and 15 |
| D-12 | Accept iteration 15 after one redispatch | The first dispatch failed `verify-iteration.cjs` with `route_proof_missing`; the workflow's one redispatch passed. The state log keeps both rows for iteration 15, so the iteration count is 15 and the row count 16 | `log-004-g2i15` driver log: `verify exit=1 route_proof_missing`, then `verify(after redispatch) exit=0` |
| D-13 | The orchestrator compiles `research/research.md` itself under `step_compile_research` | The step is the workflow runner's own action; compiling it here carries the corrections the executor never saw | `step_compile_research` in `deep-research-auto.yaml` |
| D-14 | Reopen after close: supersede D-10, extend to 20 iterations on `cli-pi` `opencode-go/deepseek-v4.1-flash` max, and keep extending in +5 steps up to the lead's ceiling until three consecutive iterations add no new P0 or P1 that survives verification. The lead asked for D-11; that id was taken, so this is D-14 | The lead's depth rule: iteration 13 produced a new P1 and iteration 15 produced new P1s, even though the orchestrator downgraded some | `reopen.sh`: lock re-acquired, config status back to `initialized`, `maxIterations 15 -> 20`, `resumed gateway exit=0` |
| D-15 | Set `maxIterations` to 21 rows, not 20 | `read-state` counts state rows, and the redispatched iteration 15 left two rows, so a cap of 20 would allow only four more iterations. 21 rows gives five, so the run ends at 20 distinct iterations, numbered 17 to 21 because the workflow's counter skips 16 | `read-state.cjs` printed `current_iteration 17, iteration_count 16` after the reopen |
| D-16 | Raise the row cap to 22 | Iteration 19 also failed `verify-iteration.cjs` once (`delta_file_missing`) and passed on the redispatch, leaving a second duplicate row; 22 rows still means at most 20 distinct iterations, the lead's ceiling | state log: 20 iteration rows for 18 distinct iterations after iteration 19 |
| D-17 | Stop at 20 distinct iterations with the depth rule cleared | Iteration 18 added a new P1 (dispatch-audit logs resolved against the session cwd, observed as a stray log in the parent spec folder); distinct iterations 19, 21 and 22 then added no new surviving P0 or P1. That clears the lead's rule exactly at the ceiling | Steering Log rows for reopened iterations 17 to 22 |
| D-18 | Downgrade the front-door disagreement (former Strongest 3) to P2 | The Python front door reaches no operator-visible ranking: the OpenCode plugin only hashes `skill_advisor.py` into a signature (`system-skill-advisor.js:355-357`), and no `.skilled/bin` script calls Python | Steering Log row for iteration 17 |
<!-- /ANCHOR:run-decisions -->

---

<!-- ANCHOR:executor-switches -->
## Executor Switches

| When | From | To | Trigger and evidence | Mechanism |
|------|------|----|----------------------|-----------|
| 2026-11-08T20:12Z, generation 1 iteration 3 | `cli-devin` `deepseek-v4-1-flash-max` | (skipped) `cli-deepseek-harness` | Dispatch and redispatch both exited 1 in 2 to 3 s with `Error: Agent error: Your daily usage quota has been exhausted. Visit https://app.devin.ai/settings/usage ...` and `"cognition.ai/errorKind": "resource_exhausted"` (dispatch receipts `research-i3-g1`). The first fallback, dsh, cannot dispatch through the workflow: `deep-research-auto.yaml` has no `if_cli_deepseek_harness` branch, and the shared builder throws `cli-deepseek-harness requires a lineage directory` because the single-executor branch passes only `{ env, cwd }` (repro in the generation-2 Known Context). | Recorded as a research finding for cluster 003 |
| 2026-11-08T20:14Z | `cli-devin` | `cli-pi` `opencode-go/deepseek-v4.1-flash`, `reasoningEffort: max` (`--thinking max`), timeout 2400 | Same quota error; a read-only probe `pi -p --offline --model opencode-go/deepseek-v4.1-flash` returned `PONG`, exit 0 | Contract `restart`: lock released, `research/` archived to `research_archive/20261108T201439Z`, generation 2 opened with `parentSessionId` set to the generation-1 session, `restarted` event recorded through the gateway. Config stayed immutable within each generation. |

Generation 1 holds two valid iterations and one `error` iteration (iteration 3). Its verified findings were carried into the generation-2 strategy's Known Context.
<!-- /ANCHOR:executor-switches -->

---

<!-- ANCHOR:steering-log -->
## Steering Log

One row per iteration, written when the orchestrator read it. Severity changes the orchestrator made are recorded in the verdict.

| Iteration | Verdict on the iteration | Next focus set |
|-----------|--------------------------|----------------|
| Gen 1, iteration 1 | accepted but narrow: 3 P2 all in sk-doc (fixture routers, duplicate package_skill.py, shared-packet mode); orchestrator verified sk-doc/mode-registry.json:53 (no folder) and identical sha256 | advisor scoring rules with live advisor runs |
| Gen 1, iteration 2 | accepted: 4 P2 (floored-top tie rule, 'do not write' not read-only, workflow-first override unlabeled, sk-doc review defer); verified ambiguity.ts:42-46 and fusion.ts:675 | advisor transport, daemon and python/node parity |
| Gen 1, iteration 3 | error: devin quota exhausted; restart to gen 2 on cli-pi | - |
| Gen 2, iteration 1 | accepted, deep: 2 P1 (front doors disagree, CI parity blind) + 3 P2; verified python-compat.vitest.ts:19 label and reran both advisors (sk-doc 0.82 vs command-create-changelog 0.63) | advisor prompt hook across runtimes |
| Gen 2, iteration 2 | accepted with caveat: 4 P2 (stale matrix without dsh, OpenCode timeout var unread by plugin, Codex 2800ms under 3s, dsh adapter no deadline); verified codex user-prompt-submit.ts:21 2_800 and .codex/hooks.json timeout 3; OpenCode var IS read by subprocess.ts and skill_advisor.py, so the drift is the README naming the plugin as consumer | session relaunch |
| Gen 2, iteration 3 | accepted: 4 P2 (effort carry-over only claude/codex/pi, runtime defaults to claude outside loop, HERMES still in v4.0.0.14 note, dsh absent from RUNTIMES); verified v4.0.0.14.md:55, skilled-loop:206, session-relaunch.cjs:476 | history after compaction |
| Gen 2, iteration 4 | accepted: 6 P2 on history lookup (dist path hides section on fresh clone, follow-up lines lack prefix, duplicated loaders, runtime list twice, Codex mint hypothesis, 600-char cap unenforced); verified history/cli.ts:489 and lookup-offer.ts:21 used only by tests | question-tool decision capture |
| Gen 2, iteration 5 | accepted: 3 P1 (1)-steps false positive, 1. menus false negative, once-guard per message on OpenCode/dsh) + 4 P2; orchestrator reproduced both detector P1s via detectProseMenu (1. menu -> null; 1) how-to + yes/no -> menu) and read OPTION_LINE at ask-surface-core.cjs:39 | hook safety deadlines + Hermes residue |
| Gen 2, iteration 6 | accepted: 2 P1 (Claude ask-surface Stop hook blocking readFileSync(0), doctor AGENTS manifest still carries Hermes, cross-cluster with 005) + 3 P2; verified ask-surface-stop.cjs:83 (codex variant has no such call) and 3 hermes hits in agents-md-manifest.json | over-engineering in hooks and advisor |
| Gen 2, iteration 7 | accepted: 1 P1 (181 adapters, 132 bypass shared reader) + 5 P2, two proposed cuts falsified with evidence; verified 30 symlinks + 1 file in .claude/hooks, advisory-stop.cjs:44 bare readFileSync(0), system-skill-advisor.js:153 still invokes skill_advisor.py | unread releases v4.0.0.6 surfaceHint, v4.0.0.12 and v4.0.1.0 doctor routing |
| Gen 2, iteration 8 | accepted: 1 P1 (problem prompt gets no doctor command) + 2 P2; orchestrator reproduced the hooks-not-firing prompt (top 3 all <0.13, no doctor) and the README bare topK call failing with exit 64 | unread releases v4.0.0.3 hooks on more tools and v4.0.0.13 OpenCode 2 plugins |
| Gen 2, iteration 9 | corrected: claimed P1 red plugin suite is environment-induced; orchestrator ran node --test .opencode/plugins/tests/*.test.cjs -> 572/572 pass, and session-relaunch.test.cjs -> 27/65 fail only with AI_SESSION_CHILD=1 (test isolation defect, P2). hook-flags.env is untracked so f-iter009-003 is local-only. Delta finding rows lack "type":"finding" (contract slip) | UX and extension close-out |
| Gen 2, iteration 10 | accepted, P1 downgraded: nudge.cjs:568-569 quiets the nudge for AI_SESSION_CHILD on purpose (comment at :565-567), so the bug is the tests not scrubbing the inherited env: P2 test isolation, root cause of the 27/65 failures seen at g2-9. hook-flags.env absent from a clone is by design (gitignored, copied from the example per hooks/README.md:79), kept as low P2 UX only. Three extensions accepted. CHECKPOINT: below bar (v4.0.0.5/.10/.11/.12/.15/.16 partly or not read, P1s still arriving at g2-5..g2-8) -> extend to 15 | v4.0.0.5 and v4.0.0.10-12 advisor and hook changes |
| Gen 2, iteration 11 | corrected, P1 downgraded to P2: orchestrator reproduced command-doctor-env 0.54 first over system-spec-kit 0.7596 and sk-doc 0.7313, but the prompt contains the doctor-env lead phrase "check my environment variables" (doctor/_routes.yaml:764) and fusion.ts:935-940 moves a passing lead-phrase bridge first by design (catalog doctor-command-routing.md:19), so this is not a contract violation; residual UX P2: a lead phrase outranks a skill the prompt names explicitly. Missing dist fusion.js and absent passes_threshold field accepted as P2 | v4.0.0.5, v4.0.0.15 and v4.0.0.16 cluster claims |
| Gen 2, iteration 12 | accepted, scope drift noted: 5 P2; verified template-phrase-lint.mjs:28-34 execFileSync git with no timeout and pre-commit:232-234 treating any non-zero exit as a phrase block. The git-hook findings sit closer to cluster 005 (doctor, git, CI), so they are kept as cross-cluster P2s and the next focus pulls back to the advisor, hooks and relaunch | v4.0.0.9, v4.0.0.4, v4.0.0.3, v4.0.0.11 advisor/hook claims |
| Gen 2, iteration 13 | accepted: 1 P1 cross-cluster (agents-md-manifest --check fails at HEAD; orchestrator ran it: exit 1) + 3 P2; verified the Pi ask-surface adapter imports ../../.skilled/hooks/shared/hook-flags.mjs (ask-surface-guard.ts:11), which resolves only through the .pi/extensions symlink (ls of the real-path target fails), so it is P2 fragility, not a broken hook. v4.0.0.4 verified-empty, v4.0.0.3/.11 partly | v4.0.0.1, v4.0.0.6, v4.0.0.9, v4.0.0.10 advisor claims |
| Gen 2, iteration 14 | accepted: 3 P2 (Pi advisor dedup suppresses the brief on a proven repeat, documented at prompt-advisor.ts:84-91 but contradicting the v4.0.0.1 every-prompt claim; v4.0.0.9 lowercase-alias claim has no field to be true about; OpenCode workspaceSurfaceCache never invalidates, system-skill-advisor.js:841-857). Orchestrator read both code citations. v4.0.0.1, .6, .9, .10 now covered | final sweep: re-verify the open P1s, one line per finding type |
| Gen 2, iteration 15 | accepted with corrections: re-verification sweep. HOLDS: front-door disagreement, both detector defects, once-per-message guard, readFileSync(0) at ask-surface-stop.cjs:83, Hermes in the manifest, no doctor command for hooks-not-firing. CHANGED: parity ratchet narrowed to outcome-level divergence; the 181-adapter count is not reproducible (kept as a qualitative P2). Orchestrator corrections: "zero regression coverage" overstated because fixtures/prose-menu-numbered.json covers the 1) happy path, so P2 (no fixture for the three defects); "order not explicable" reproduced (sk-doc 0.347 above system-spec-kit 0.579) but merged into the P2 on the missing passes_threshold field. First dispatch failed route proof and the redispatch passed, leaving two state rows for iteration 15. CHECKPOINT: stop at 15, every release has a coverage row | - |
| Gen 2, iteration 17 | verification pass, no new surviving P0/P1 (clean count 1 of 3). Python advisor reach CONFIRMED narrow: orchestrator read system-skill-advisor.js:152-157 and :355-357 (the plugin only hashes skill_advisor.py into a signature) and found no python call in .skilled/bin, so Strongest 3 (front-door disagreement) drops to P2 and the earlier "OpenCode plugin is a live consumer" point is corrected. Claimed P1 README.md:44 degraded-fallback claim recorded as P2 drift (doc only). Claimed P1 dsh steer re-fire is the existing B3 sharpened (dsh/ask-surface-guard.mjs:107 keys on turn, steer starts a new turn), not new. Once-guard: four contracts, only pi/ask-surface-guard.test.ts:64 pins once-per-operator-turn (P2) | decision capture and audit writers resolving .skilled/logs against cwd; goal hook; thin types |
| Gen 2, iteration 18 | NEW P1 accepted (clean count reset to 0): dispatch-audit adapters resolve the log against the session cwd; orchestrator read dispatch-audit-posttooluse.mjs:56-57 (payload.cwd before CLAUDE_PROJECT_DIR) and confirmed the observed stray log is hidden by .gitignore:263 (git check-ignore). The preflight-lint order (CLAUDE_PROJECT_DIR first, :55) is the correct one, so its claimed P1 is recorded as P2 part of the same finding. Gitignore masking, README drift, rooted-resolver improvement and nested-log doctor check accepted as P2 | goal hook and history hook; misalignment and extension |
| Gen 2, iteration 19 | no new surviving P0/P1 (clean count 1 of 3). Claimed P1 "no Claude or Codex goal adapter" FALSIFIED: goal-plugin.md:159-160 documents both hosts as native, outside this contract (orchestrator read it). Goal-slice P2s accepted (unknown budget state, template prose surviving the scrub, hardcoded 4000, missing overage); v4.0.2.0 dsh goal registration P2. First dispatch failed delta_file_missing, redispatch passed (D-16) | decision-capture hook and dsh plugin registration |
| Gen 2, iteration 21 | no new P0/P1 (clean count 2 of 3); numbered 21 because read-state counts rows, 19th distinct iteration. Three P2s accepted; orchestrator read .dsh/plugins/repo-guards/index.mjs:52 (prompt advisor opt-in via promptAdvisor === true) and .dsh/patches/guards.patch.yml:4-6 (the only switch), and confirmed DECISION_CAPTURE_README_PATH occurs once, at its definition | comment-hygiene and sk-code convention sweep over the cluster |
| Gen 2, iteration 22 | no new P0/P1 (clean count 3 of 3: distinct iterations 19, 21 and 22): four P2s accepted; comment-hygiene sweep passes apart from test-fixture literals; orchestrator confirmed specs/hooks does not exist and the relaunch README rows at :25-30 link SPIKE files under a missing path | - |
<!-- /ANCHOR:steering-log -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

No operator answers were captured; the operator was unavailable and the lead's brief pre-resolved every gate.
<!-- /ANCHOR:operator-answers-verbatim -->

---
