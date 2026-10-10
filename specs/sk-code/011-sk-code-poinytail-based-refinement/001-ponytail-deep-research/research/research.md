---
title: "Research: Ponytail 5.1.0 teachings for the sk-code hub, modes and tooling"
description: "Merged, orchestrator-verified and independently re-reviewed synthesis of two deep-research lineages over Ponytail 5.1.0: what is already adopted, what is new, which defects the run exposed, and the proposed implementation phases."
trigger_phrases:
  - "ponytail 5 research synthesis"
  - "sk-code ponytail refinement research"
  - "ponytail sk-code findings"
importance_tier: "important"
contextType: "research"
---

# Research: Ponytail 5.1.0 teachings for the sk-code hub, modes and tooling

Two independent lineages ran ten iterations each over the vendored Ponytail 5.1.0 source. The orchestrator checked their claims against the repository and corrected the ones that failed. A fresh reviewer, Claude Opus 5.5 at xhigh effort, then re-checked 54 claims in the first synthesis: 40 held, 4 were wrong, 9 were overstated and 1 was left untraced. The orchestrator opened the source behind every correction before applying it. This document is the amended result. Where it disagrees with a lineage report, this document wins, and Section 13 says why.

---

## 1. Executive Summary

The earlier Ponytail refinement mostly survived the move to a two-axis hub. Twelve of its seventeen recommendations are in place. The restraint ladder, the review checklist rows, the `ceiling:` convention, the review-depth alias and the anti-stall rule all still exist.

Ponytail 5 adds one doctrine change that sk-code only half has. Its ladder now asks "is it already in this codebase?" as the second step, before the standard library [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:28]. sk-code's always-loaded ladder goes from "does it need to exist" straight to "standard library" [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:46]. Its implement workflow already says to reuse existing helpers [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:73], so the gap is the ladder itself and the drift between the two files.

The run's most valuable output is not a Ponytail idea. Checking sk-code against Ponytail's discipline exposed four real defects and one stale test scenario:

1. The Webflow minified-runtime checker passes scripts whose deferred code throws. Reproduced.
2. A change touching only Codex agent files passes the mirror check in CI and at commit time. Reproduced.
3. The stack-folder scenario's index row and expected output are stale. The validator is right.
4. The shared hook stdin reader, and the post-edit hooks' own copy of it, have no deadline.
5. The deep-research reducer wrote to the wrong folder inside fan-out lineages. Fixed in `specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path`.

The surface precedence contradiction matters more than the first synthesis said. Two files that load on every sk-code route state different precedence orders.

Ponytail's other transferable value is its measurement honesty: it tests its own grader, keeps size metrics out of pass/fail gates, publishes correctness beside every restraint number and refuses to print savings it never measured.

---

## 2. Scope and Method

The research covered the sk-code hub (`SKILL.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `shared/`), its two workflow modes, its three surface packets and the tooling around them: hooks, mirror checks, validators, the skill advisor probes, the compiled-routing fixtures and the benchmark lanes. Everything under `context/` was read as data. Ponytail ships its own `AGENTS.md` and agent rule files, and the brief told both lineages not to follow them.

Every finding was classified against the earlier refinement:

- **NEW**: not in the earlier recommendation set and not in sk-code today.
- **PARTIAL**: part of it is already in sk-code.
- **ALREADY-ADOPTED**: present in sk-code today.
- **LOST**: adopted earlier, then lost or made stale by the hub restructure.
- **NOT-BUILT**: deferred by the earlier refinement and never built.

---

## 3. Run and Verification Provenance

| Lineage | Executor | Model | Effort | Iterations | Wall time |
|---|---|---|---|---|---|
| `luna-max-fast` | cli-codex | gpt-6-luna, fast tier | max | 10 | 38 min |
| `deepseek-flash-cline` | cli-pi | cline-pass/deepseek-v4.1-flash | xhigh | 10 | 28 min |

The operator asked for DeepSeek at `max`. The runner pins Cline's Flash models, including DeepSeek V4.1 Flash, to `xhigh`, because that route has no `max` tier [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2320].

Both lineages stopped at the iteration cap, not by convergence. The fan-out runner reported 2 of 2 lineages fulfilled with no timeouts, retries or containment advisories. Route proof (`target_agent: deep-research`, `agent_definition_loaded: true`, `mode: research`) is present for all twenty iterations: in the delta files for DeepSeek and for Luna's iterations 1 to 4, and in `iteration-NNN-record.json` for Luna's iterations 5 to 10. The merge produced 97 findings from 20 delta sources.

Verification ran in two passes:

- **Orchestrator.** Opened the citations behind every carried claim about repository state. Three DeepSeek claims were refuted (Section 13).
- **Independent re-review.** A fresh Claude Opus 5.5 at xhigh effort, read-only, re-checked 54 claims and reproduced D1 and D2. The orchestrator then opened the source behind each of its corrections. All held.

Neither lineage was fully right about repository state. DeepSeek made the three refuted claims. Luna was wrong that the ladder was fully adopted, and cited the stale index row for D3. Luna found the first four rows of Section 7. DeepSeek covered Ponytail's own design more broadly.

---

## 4. Research Questions and Answers

1. **What is Ponytail 5's core doctrine, and how much of it does sk-code already carry?** The smallest complete change, with a reuse-first ladder, a never-cut list and a test reflex. sk-code's implement workflow carries reuse but its ladder does not. Its coverage floor is stronger than Ponytail's test reflex. Its P0 tier covers part of the never-cut list (Section 6).
2. **Which hook and activation mechanisms transfer?** The codebase map and a stdin deadline. Session-wide intensity state does not transfer (Sections 6 and 7).
3. **Which review and audit additions are missing?** A "Not checked:" line and a stated workload for performance findings. The consequence line and the search list are partly there already (Section 6).
4. **What portability and guard lessons apply?** Agreement checks need an outside reference point, and retired guards need a named successor. The Codex mirror gap is a live defect in three places (Sections 7 and 10).
5. **What do Ponytail's benchmarks teach?** Separate measuring from gating, test the grader, pair restraint with correctness and run deliberately weak comparison arms (Section 9).
6. **What did the hub restructure lose?** The precedence order and the Obsidian coverage around it, in more files than first found (Section 8).
7. **What original ideas does Ponytail inspire?** Nine. Two of the three strong ones turned out to exist in part already (Section 10).

---

## 5. Already Adopted

These need no new work. Do not duplicate them.

| Earlier recommendation | Where it lives now |
|---|---|
| Design restraint ladder after routing (rec 1, 2) | [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:42] |
| Hand-rolled standard-library and native-duplication review rows (rec 3) | [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:122] |
| Review-status rule-copy canary (rec 4) | `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` |
| Neutral `ceiling:` comment and its downgrade evidence (rec 5, 6) | `.skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md` |
| Needed-ness and removal guidance (rec 7) | `.skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md` |
| `Replacement` field in the removal plan (rec 8) | [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md:53] |
| Stack-folder validation (rec 13), rewritten to check language folders | [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_stack_folders.py:13] |
| Review-depth alias (rec 14) | [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:530] |
| Anti-stall rule (rec 17) | `.skilled/skills/sk-code/shared/references/workflow-implement.md` |
| Correctness as an eligibility gate, never blended | [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/correctness-gate.cjs:8] |
| Cross-runtime mirrors generated and freshness-checked | [SOURCE: .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:34] |

Three are partial:

- **Iron Law canonicalization (rec 9):** in place, but not as one exact string.
- **Mirror gates (rec 12):** CI and both pre-commit hooks exist, but all three miss Codex-only changes (D2).
- **Review-agent canary (rec 16):** checks concepts rather than an exact string.

---

## 6. New Teachings from Ponytail 5

### Doctrine

- **The reuse step. PARTIAL.** Add "already in this codebase (a helper, component, service, pattern)? Use it the way the surrounding code does" as the second ladder step [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md:14]. The implement workflow already prefers "existing helpers" [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:66] and says to reuse existing helpers, templates and patterns [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:73]. The always-loaded ladder does not. Both files must change together, or the workflow's summary of the ladder drifts from the ladder. sk-code keeps stdlib and native as separate rungs where Ponytail merges them [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md:15], so the result has seven rungs.
- **The never-cut list beside the ladder. PARTIAL.** Ponytail lists trust-boundary validation, error handling that prevents data loss, security, accessibility, real-hardware calibration and anything the user asked for [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md:30]. sk-code's P0 tier covers boundary validation [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:76] and silent failures [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:78]. Accessibility appears nowhere in that file. The fix is a pointer from the ladder to the P0 tier, plus accessibility, not a second copy of the floors.
- **The full reach list before editing. NEW.** Ponytail lists callers, tests, fixtures, config and exports [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md:7]. sk-code asks only for "nearby conventions, callers, and existing examples" [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:51].
- **The test reflex. Rejected.** Ponytail's "one small test ... Trivial changes need none" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md:27] is a lower bar than sk-code's P1 coverage floor of a happy path plus at least one edge case per public surface [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:90]. The first synthesis listed it as NEW because DeepSeek's citation stopped before that line. It moves to Eliminated Alternatives.

### Review output

- **"Not checked:" line. NEW.** Ponytail's review ends with one line naming what mattered and could not be checked [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:96]. sk-code-review's output contract has no such section [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:332]. Constraint: `Review status: …` must stay the absolute final line, because automation matches it exactly.
- **Consequence of inaction per finding. PARTIAL.** Ponytail's "If we skip it" line [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:91] is a user-impact sentence. Every sk-code-review finding already carries Risk and User impact [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:344]. Reword User impact to name the cost of deferring the fix, rather than adding a line.
- **Stated workload for performance findings. NEW.** A scale finding names the load it assumes. This fits sk-code's existing evidence text without a schema change.
- **Search list before calling code unused. PARTIAL.** Ponytail names the places to search first [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-audit/SKILL.md:61]. sk-code already requires a codebase reference search and a check for dynamic usage [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md:57]. Extend that one line to tests, fixtures, config and string references.

### Hooks

- **Codebase map. NEW, deferred.** A regex-based, model-free listing of exported names by folder, capped at 2,000 characters, skipping tests and vendored code [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-map.js:16]. It makes the reuse step cheap.
- **Sub-agent injection. NEW, deferred.** Ponytail injects its rules into sub-agents because session context never reaches them [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-subagent.js:4]. This repo's `Task` guard checks only deep-loop mode mismatches, loop-like hand-offs and the Fable model policy [SOURCE: .skilled/hooks/task-dispatch/README.md:16], and passes no sk-code guidance. `@code` and `@review` load sk-code from their own definitions [SOURCE: .claude/agents/code.md:51]. General-purpose sub-agents get nothing.

---

## 7. Defects Found in sk-code and Adjacent Tooling

Each row was checked by the orchestrator and again by the independent reviewer.

| # | Defect | Severity | Evidence | How confirmed |
|---|---|---|---|---|
| D1 | The Webflow minified-runtime checker passes scripts whose deferred code throws. Stand-in `setTimeout`, `requestAnimationFrame` and `Webflow.push` run callbacks inside empty `try {} catch (e) {}`, and `addEventListener` is a no-op, so PASS only means top-level code ran. It is a pre-deploy gate | Medium | [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:118] | Reproduced: a script whose deferred callbacks all throw got PASS; a top-level throw got FAIL |
| D2 | A change touching only `.codex/agents/` passes unchecked. The checker's path pattern omits `.codex` [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs:32]; both pre-commit hooks drop Codex paths before the checker sees them [SOURCE: .skilled/hooks/git/pre-commit:87] [SOURCE: .skilled/scripts/git-hooks/pre-commit:170]; the orphan check lists only the Claude mirror | Medium | as cited | Reproduced: exit 0 with "nothing verified" for `.codex/agents/code.toml`; a Claude path control checked one agent |
| D3 | Stale scenario text, not a validator gap. The scenario seeds and expects an orphan under `references/` [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/design-restraint/stack-folders-validator.md:80]. Only the index row still says `assets/<fake-surface>` [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:293], and the expected output names five languages where the validator now prints six | Low, documentation | as cited | Validator run: exit 0, six folders including rust. `sk-code-opencode/assets/` holds only `checklists/` and `scripts/`, so scanning it would be wrong |
| D4 | No stdin deadline. The shared reader used by the task-dispatch, MCP-route and spec-gate hooks reads until stdin closes [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:14], and the post-edit adapters carry their own copy [SOURCE: .skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs:43]. Only each host's hook timeout bounds them | Low, never observed | as cited | Code read |
| D5 | Inside a fan-out lineage, the deep-research reducer refreshed the base research folder instead of the lineage's | Medium for research tooling | [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1843] | Fixed in `038/006`. Confirmed by a live two-lineage run on 2026-10-09: the lineage that ran the reducer got its registry, dashboard and strategy in its own folder, and the base folder got none. The other lineage skipped the reducer and wrote its projections by hand, which is a separate executor-compliance issue |

Fix caveat for D1: the stand-in page returns null for every element lookup, so recording every callback error would fail real scripts. Collect errors only from callbacks the checker actually invokes, as Luna proposed.

---

## 8. Lost After the Hub Restructure

- **Surface precedence order.** Two files that load on every route [SOURCE: .skilled/skills/sk-code/ROUTER.md:320] disagree. The universal standard says OPENCODE > WEBFLOW > UNKNOWN [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:53]. The detection reference says OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:40]. The hub `SKILL.md` repeats the old order and still lists `MOTION_DEV` as a surface [SOURCE: .skilled/skills/sk-code/SKILL.md:136] [SOURCE: .skilled/skills/sk-code/SKILL.md:163], and `ROUTER.md` describes detection as WEBFLOW/OPENCODE/UNKNOWN [SOURCE: .skilled/skills/sk-code/ROUTER.md:300]. The detection reference is the authority: the hub places detection in the shared layer, and the routing fixture already routes Obsidian.
- **Obsidian coverage around it.**
  - A blank line breaks the OBSIDIAN row out of the surface table, in both the hub `SKILL.md` [SOURCE: .skilled/skills/sk-code/SKILL.md:38] and the detection reference [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:30].
  - The detection reference's Motion.dev note still says detection "chooses WEBFLOW, OPENCODE, or UNKNOWN" [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:34].
  - The hub `SKILL.md` leaves Obsidian out of its mode keys [SOURCE: .skilled/skills/sk-code/SKILL.md:67], its clarifying question [SOURCE: .skilled/skills/sk-code/SKILL.md:79] and its surface packet list [SOURCE: .skilled/skills/sk-code/SKILL.md:193].
  - The advisor probe battery names Obsidian nowhere, and the `surface-detection/` playbook has no Obsidian scenario.
- **NOT-BUILT, not lost.** The `shrink` review row (rec 10) and the code-size metric for Lane B (rec 11) were deferred by the earlier refinement and never built. A priming hook payload (rec 15) still has no consumer.

---

## 9. Measurement and Benchmark Lessons

The benchmark tracks need naming, because the lineages appeared to disagree when they were describing different ones:

- **Lane B** benchmarks models and prompts through `/deep:model-benchmark`. It is live, and correctness is a pass/fail gate there.
- **Lane C** was sk-code's routing benchmark. It is retired, and its folder is a frozen index of old reports [SOURCE: .skilled/skills/sk-code/benchmark/README.md:14].

Ponytail's lessons, all NEW:

1. **Test the grader.** Ponytail feeds known good and bad outputs through its behavior checker without an API key, proving the grader can tell them apart [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/tests/behavior.test.js:2].
2. **Measure effect, not text.** Its behavior eval asks whether the rules change what the model writes [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/behavior.yaml:1].
3. **Keep size out of the gate.** `code_loc` "always passes; it is a measurement, not a gate" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/loc.js:3].
4. **Run deliberately weak comparison arms.** One-line "Follow YAGNI principles." prompts run beside the full skill [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/run.py:39].
5. **Compare candidate against release in one run** through a second plugin slot [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/run.py:42].
6. **Never print a savings number nobody measured** [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-gain/SKILL.md:44].
7. **Anchor agreement checks outside the pair.** Ponytail's version guard exists because its manifests went stale together while an agreement test passed [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/check-versions.js:5].
8. **Pair any size metric with an adversarial safety tier.** Ponytail leaves the safety requirement implicit in seven tasks and runs the produced code against adversarial input, so a smaller answer that drops a check fails. Any future Lane B size metric needs this counterweight (DeepSeek lineage report, line 85).

---

## 10. Original Ideas

Ideas Ponytail inspires but cannot contain, because it has no hub, router or scenario corpus.

1. **Route-outcome checks. Mostly exists.** The compiled-routing fixture already holds nine deterministic cases covering single (including Obsidian), ordered bundle, surface bundle, defer and reject [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:1]. What is missing is a workflow-plus-Obsidian surface bundle case and any link from the playbook scenarios to the fixture. Extend the fixture rather than building a new check.
2. **Known-bad inputs for checkers. Partly exists.** The rule-copy canary already has tamper tests (`check-rule-copies.test.sh`). The checkers that lack a known-bad input are exactly D1's and the stack-folder validator, so this belongs in their regression work.
3. **A retirement note for every guard.** A retired check's umbrella script names its successor, or records the gap and an owner. The retired router-sync guard can point at `.github/workflows/routing-registry-drift.yml` as partial coverage. Strong, and cheap.
4. **Behavior checks for sk-code's own rules,** such as scope lock and comment hygiene, against a no-skill control. Needs a model-dispatch lane.
5. **A correctness pairing rule.** No restraint metric is published without a correctness number beside it.
6. **An outside reference point for agreement guards.**
7. **Reuse evidence in removal proposals,** citing the same inventory the reuse step uses. Depends on the reuse step existing first.
8. **No unmeasured savings claims** in research and refinement packets, including this one.
9. **Test effectiveness, not test presence.** If a future coding benchmark captures agent-written tests, inject a small fault and check that the tests catch it.

### Carried from the lineages after re-review

The first synthesis dropped these. They are kept, with their place in the plan:

- **Pin each never-cut item in the rule-copy canary,** so a later reword cannot silently drop one (DeepSeek lineage report, line 70). Goes with the doctrine phase.
- **A report-only "Lean: -N lines" line** as the replacement for the never-built `shrink` row (DeepSeek lineage report, lines 63 and 130). Deferred.
- **A verified-runtime record per runtime surface,** naming the host version each adapter was last verified against (DeepSeek lineage report, line 73). Deferred.

---

## 11. Recommendations

Ranked by value over cost. Each names its target and owner.

1. **Make surface precedence and Obsidian coverage consistent.** `stack-detection.md` is the authority; correct `code-quality-standards.md:53`, the hub `SKILL.md`, `ROUTER.md:300` and both broken tables, and add Obsidian to the advisor probes and the surface-detection playbook. It removes a contradiction loaded on every route. Owner: sk-code.
2. **Fix D1** by collecting errors from the callbacks the checker invokes, with a known-bad test input. Owner: sk-code.
3. **Fix D3** by correcting the playbook index row and the expected output to match the validator. Owner: sk-code.
4. **Add the reuse step and the full reach list,** in `code-quality-standards.md` and `workflow-implement.md` together. Replace the never-cut list with a pointer to the P0 tier, add accessibility, and pin the items in the rule-copy canary. Measure the always-loaded file before and after. Owner: sk-code.
5. **Extend the routing canary fixture** with a workflow-plus-Obsidian surface bundle case. Owner: sk-code.
6. **Add "Not checked:" and the workload note to sk-code-review output,** reword User impact, and widen the removal-plan search line. Add a check that the output still ends on the exact `Review status:` line; the rule-copy canary only checks that strings exist [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:31], so it cannot prove this. Owner: sk-code.
7. **Add retirement notes to retired guards.** Owner: sk-code.
8. **Hand off D2:** add `codex` to the checker pattern, both pre-commit greps and the orphan list, plus a Codex regression case. Owner: deep-improvement and the git hooks.
9. **Hand off D4:** one deadline in the shared stdin helper, with the post-edit adapters switched to it, keeping fail-open behavior. Owner: hooks.
10. **Defer the codebase map hook** until the reuse step has been used and its search cost observed.

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| A session-wide intensity setting (lite/full/ultra) | Flattens the two routing axes and duplicates review depth | `context/.opencode/command/ponytail.md:2`; earlier rejection at `z_archive/015/research/research.md:74` | Luna 1, DeepSeek 1 |
| A standalone ponytail-review or audit skill | Splits the single findings-first review baseline | `.skilled/skills/sk-code/sk-code-review/SKILL.md:13` | Luna 2, DeepSeek 3 |
| Lines of code as a severity gate | Rewards under-solving; size belongs in measurement only | `context/benchmarks/loc.js:3` | Luna 4, DeepSeek 6, 8 |
| Injecting the full standard on every prompt | sk-code loads resources on demand | `.skilled/skills/sk-code/SKILL.md:52` | Luna 1, DeepSeek 2 |
| Per-project mode flag files | No consumer; dirties the repo | `context/hooks/ponytail-config.js` | DeepSeek 2 |
| Byte-equality checks across skill surfaces | Surfaces consume shared doctrine rather than copy it | `context/scripts/check-rule-copies.js` | DeepSeek 4 |
| Importing Ponytail's 39-task corpus | Measures code-writing restraint, not routing | `context/benchmarks/agentic/README.md` | DeepSeek 6 |
| Reviving the retired Lane C harness, or building a new route replay | The compiled-routing canary fixture already replays deterministically | `canary-cases.v1.json` | Luna 4, 10; re-review |
| A literal `ponytail:` comment prefix | Perishable brand label; the content is what matters | earlier rejection at `z_archive/015/research/research.md:73` | Luna 5, DeepSeek 9 |
| Generating mirror copies as new work | The repo already generates and checks them | `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:34` | DeepSeek 4 (refuted) |
| Ponytail's one-small-test reflex | Weaker than sk-code's P1 coverage floor | `code-quality-standards.md:90` | DeepSeek 1; re-review |
| Extending the stack-folder validator to `assets/` | The validator is right; the scenario index is stale | `stack-folders-validator.md:80` | Luna 6; re-review |
| A separate consequence-of-inaction line | Duplicates the existing User impact field | `sk-code-review/SKILL.md:344` | DeepSeek 3; re-review |

---

## Divergence Map

No divergent pivots ran. Convergence mode was `default`, and neither lineage converged by ratio: both stopped at the ten-iteration cap.

- **Saturated directions:** doctrine and the restraint ladder (both lineages, iterations 1, 5 and 7); the earlier recommendation crosswalk (Luna 5, DeepSeek 7).
- **Directions only one lineage covered:** benchmark design and Ponytail's honesty machinery (DeepSeek 5, 6, 8, 9); sk-code defect hunting in hooks, Webflow and mirror CI (Luna 3, 5, 6, 7).
- **Covered by neither lineage, found in re-review:** the compiled-routing canary fixture, the P1 coverage floor, the pre-commit Codex gap and the shared stdin helper.
- **Pivots taken, Council artifacts, pivot failures and audited overrides:** none.
- **Remaining frontier:** the open questions in Section 12.

---

## 12. Open Questions

1. Does sk-code's hook layer match Ponytail's Windows stdin and byte-order-mark coverage? No counterpart was located.
2. What is the current pass state of the design-restraint playbook scenarios? Their last verdicts came from the retired harness.
3. Ponytail splits functions "by job, never by line count" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:53], while sk-code-review flags functions over 20 lines [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:116]. Should that row change, given that this report rejects size as a gate?

Answered in re-review: the `Task` guard passes no sk-code guidance to sub-agents (Section 6), and for D3 the validator prevails over the scenario index (Section 7).

---

## 13. Lineage Disagreements and How They Were Settled

| Claim | DeepSeek | Luna | Settled by source |
|---|---|---|---|
| Is the ladder fully adopted? | Missing the reuse step | Fully adopted | DeepSeek is closer. Ponytail 5 added the step at `context/skills/ponytail/SKILL.md:28`; sk-code's ladder lacks it, though its implement workflow already says to reuse |
| Does the short Ponytail `AGENTS.md` have the reuse step? | No | Not stated | It does, at `context/AGENTS.md:14`. DeepSeek is wrong |
| Are cross-runtime mirrors maintained by hand? | Yes | Not stated | No. They are generated and checked by `/doctor:runtime-mirrors`. DeepSeek is wrong |
| Was the hand-rolled standard-library review row added? | No | Yes | Yes, at `code-quality-checklist.md:122`. DeepSeek is wrong |
| Is the stack-folder validator complete? | Yes, with a scenario | Partial | Neither. The validator is right; the scenario index row and expected output are stale |
| Is a test reflex missing? | Yes | Not stated | No. The P1 coverage floor at `code-quality-standards.md:90` is stronger |
| Is the routing benchmark lost? | LOST | Retired; do not revive | Both describe Lane C correctly. It was never a Ponytail adoption, and the canary fixture already replays routes |
| Lane B correctness gate | Not discussed | Live | Luna is right; it is a different lane from Lane C |

---

## 14. Evidence Limits and Confidence

- **High confidence:** Sections 5, 7 and 8 and the doctrine findings in Section 6. Each was checked against source lines by the orchestrator and by the independent reviewer, and D1 and D2 were reproduced.
- **Medium:** the review-output and benchmark lessons. They rest on Ponytail's source, which was read but not run.
- **Inferred:** that context added by a PreToolUse hook reaches the parent model, not the sub-agent.
- **Not traced:** the lineage wall times in Section 3.
- **Not measured:** no Ponytail benchmark was run. No savings, speed or size claim in this document is a measurement of sk-code.

---

## 15. Proposed Implementation Phases

Phase numbers continue the parent packet. Each phase is a child of `specs/sk-code/011-sk-code-poinytail-based-refinement/`.

1. **002: Surface contract alignment.** Recommendations 1, 3 and 5: precedence and Obsidian coverage across the hub, the D3 playbook fix and the canary fixture case. Goes through the hub-routing rule, since it edits hub routing documents. Comes first because it removes a contradiction on every route.
2. **003: Doctrine pass.** Recommendation 4, one edit pass over `code-quality-standards.md:42-53` and `workflow-implement.md`. No test reflex.
3. **004: Webflow checker fix.** Recommendation 2: D1, with known-bad test inputs for the D1 checker and the stack-folder validator.
4. **005: Review output additions.** Recommendation 6.
5. **006: Guard retirement notes.** Recommendation 7.
6. **Handoffs, outside sk-code.** D2 to deep-improvement and the git hooks; D4 to the hooks owner.
7. **Deferred.** Codebase map hook, sub-agent guidance, behavior checks against a control, the Lane B size metric with its adversarial safety tier, the lean line, verified-runtime records and test-effectiveness measurement. Each waits for a consumer or a lane.

---

## 16. Convergence Report

- **Stop reason:** iteration cap (`maxIterationsReached`) in both lineages.
- **Iterations:** 10 of 10 per lineage, 20 in total.
- **Luna new-information ratios:** 0.0, 0.33, 1.0, 0.67, 0.6, 1.0, 1.0, 0.0, 0.0, 0.0. The last three average 0.0, under the 0.05 threshold, but the cap ended the run first.
- **DeepSeek rolling ratios:** 0.5, 0.31, 0.56, 0.56, 0.69, 0.75, 0.5, 0.5, 0.75, 0.3. All above the threshold.
- **Reducer state:** Luna's lineage projection was stale during the run because of D5. It was refreshed afterwards with the fixed reducer (`--artifact-dir`): 10 iterations, 0 corruption.
- **Legal-stop certification:** not claimed. This is a cap stop.

---

## 17. References

- Resource map: `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/resource-map.md`
- Lineage reports: `research/lineages/luna-max-fast/research.md`, `research/lineages/deepseek-flash-cline/research.md`
- Merge attribution: `research/fanout-attribution.md`
- Earlier refinement: `specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md`
- Reducer fix: `specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/`
- Ponytail source: `specs/sk-code/011-sk-code-poinytail-based-refinement/context/`

---

## Round 2 (2026-10-10): agents, repository rules and hub vocabulary

Round one's sections above are unchanged. This section was appended after a second `/deep:research:auto` run over the same Ponytail 5.1.0 source. Round two had its own lineage, `r2-dsflash-llmgw`, and its own targets: the code-working agent definitions and their runtime mirrors, the repository rules and root framework, and the parts of the sk-code hub that round one did not reach. The full round-two synthesis is the lineage report at `research/lineages/r2-dsflash-llmgw/research.md`. This section summarizes it.

### R2.1 Answer

Most of round one's recommendations are already in the tree. The lineage re-read each target and found recs 1, 3, 4, 5, 6 and 8 and the D4 hand-off closed. Rec 2 is half closed: the Webflow checker fix landed, but its known-bad test input did not. Rec 7, the retirement note, is open. Rec 10 is deferred by design. The new ground sits in places round one did not target. Four of them matter most:

1. **Restraint has no front door in the hub.** Ponytail activates on "simplest solution", "yagni", over-engineering and bloat [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:7]. None of those words appears in `hub-router.json`, `mode-registry.json` or `description.json` (zero case-insensitive matches in each file). A "simplify this" request cannot score the mode built for it.
2. **The review contract never asks for a reproducing case.** Ponytail: "Every finding needs a concrete case" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:59]. @review's evidence table asks only for file:line plus a snippet, pattern or suggestion [SOURCE: .skilled/agents/review.md:358].
3. **The reviewer never reads the connected code as a step.** Ponytail reads callers, called functions, tests and the README [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:21]. The review agent and the review mode's Phase 1 do not [SOURCE: .skilled/agents/review.md:72] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:290].
4. **The agent definitions lag their own hub.** @code's pre-implementation checklist has no reach list [SOURCE: .skilled/agents/code.md:205], although the implement workflow now states it [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:51] and Ponytail opens with it [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md:7]. @code's RETURN has no line for what was skipped or not checked [SOURCE: .skilled/agents/code.md:297], which Ponytail ends every reply with [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:15].

### R2.2 Ranked findings (P1)

| # | Finding | Target file | Classification | Rationale |
|---|---|---|---|---|
| 1 | Restraint and simplification vocabulary absent from the hub's lexical surfaces | `.skilled/skills/sk-code/hub-router.json`, `mode-registry.json`, `description.json` | NEW | The mode exists, but the words that would route to it do not |
| 2 | Review finding contract lacks a reproducing case | `.skilled/skills/sk-code/sk-code-review/SKILL.md`, `.skilled/agents/review.md` | NEW | Cheapest upgrade to the review evidence floor |
| 3 | Review never reads callers, callees and tests as a named step | `.skilled/skills/sk-code/sk-code-review/SKILL.md`, `.skilled/agents/review.md` | NEW | Diff-only reviews miss breakage in code the diff does not touch |
| 4 | @code pre-implementation gate lacks the reach list | `.skilled/agents/code.md` | NEW target, ALREADY-COVERED idea | The shared workflow carries it; the agent that executes does not |
| 5 | @code RETURN has no gap-disclosure line | `.skilled/agents/code.md` | NEW target | Repo close-out already requires the disclosure [SOURCE: .skilled/repo-rules/evidence-and-proof.md:194] |
| 6 | The `ceiling:` convention has no harvest report | `.skilled/skills/sk-code/sk-code-quality/scripts/` | NEW | Ponytail's debt skill lists markers and tags the ones with no trigger [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-debt/SKILL.md:36]; the quality scripts cover only comment hygiene and dist staleness |
| 7 | Hermes agent-persona mirror is checked only in CI | `.skilled/scripts/git-hooks/pre-commit`, doctor runtime-mirror config | NEW | Same local-gate failure class as round one's D2; the pre-commit gate has no Hermes reference |
| 8 | One authored agent source per dialect (original) | runtime-mirror sync scripts | NEW | Three byte-identical OpenCode-dialect copies with no mutual equality check |
| 9 | Vocabulary-parity check across router, registry, description and canary (original) | `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | NEW | Four surfaces share one vocabulary and nothing checks that they agree |

The P2 rows (20 of them) are in section 7 of the lineage report. In brief: @debug disclosure and harness-reading gaps, an @orchestrate reach-set field, @review assumed load, cross-group numbering and report order, a residual-risk half for the close-out contract, accessibility absent from every repo rule and root doc (zero matches), the reach set half-listed in `prevent-overengineering.md` §2, a decodability floor and an equal-cost edge-case tiebreak, move-or-merge behavior preservation, a restraint canary case, and the two residual round-one items.

### R2.3 Original ideas and rejections

The lineage proposes five original ideas. Three of them are P1 rows 8 and 9 and a `no-signal` tag for `ceiling:` markers whose trigger can never be measured. The other two are citation resolution for agent and rule docs, and a review-output contract fixture. It rejects twelve transfers with reasons. Among them are the session-wide intensity levels, a persona sentence for the agent definitions, renaming `ceiling:`, porting the numbered ladder into the repo rules, a 20-finding review cap, and a second plain-English contract in the review mode (lineage report §6).

### R2.4 Verification by the orchestrating run

The lineage's claims are hypotheses until checked. These were re-checked against the tree after the run:

- Confirmed: zero matches for yagni, simplif, over-engineer and bloat in the three hub lexical files. Ponytail's trigger words are at `context/skills/ponytail/SKILL.md:7`.
- Confirmed: @review's evidence table has no case field (`.skilled/agents/review.md:358`), and @code's checklist has no reach list (`.skilled/agents/code.md:205`).
- Confirmed: no `hermes` reference in `.skilled/scripts/git-hooks/pre-commit`, and no accessibility mention in `.skilled/repo-rules/*.md`, `AGENTS.md` or `REPO RULES.md`.
- Confirmed: `sk-code-quality/scripts/` holds only the comment-hygiene and dist-staleness checks.
- Corrected: the lineage cites the reach list at `context/AGENTS.md:14`. That line is the reuse rung. The reach list is at `context/AGENTS.md:7` and `context/skills/ponytail/SKILL.md:21`.
- Not re-checked here: the closure ledger rows, the three-way mirror hash equality, and the line numbers of the P2 rows.

### R2.5 Round 2 convergence report

- **Lineage:** `r2-dsflash-llmgw`, executor `cli-pi`, model `deepseek-v4.1-flash` through the llmgateway provider, reasoning effort `max`.
- **Stop reason:** `maxIterationsReached`, under stop policy `max-iterations`.
- **Iterations:** 10 of 10. Every iteration record carries `target_agent: deep-research`, `agent_definition_loaded: true` and status `complete`.
- **Findings per iteration:** 8, 7, 4, 7, 5, 4, 6, 6, 5, 4 (56 in total).
- **newInfoRatio:** 0.69, 0.57, 0.75, 0.57, 0.40, 0.62, 0.83, 0.92, 1.00, 0.88. The ratio never fell under the 0.05 threshold, so convergence is not claimed.
- **Questions answered:** 9 of 9 in the lineage strategy.
- **Merge:** `fanout-merge.cjs` merged all three lineages into `research/findings-registry.json` with 153 key findings. `research/resource-map.md` was regenerated from all 30 lineage delta files.
- **Round one's state:** its two lineages are untouched. Its root config is preserved at `research/round-1-deep-research-config.json`, because the round-two setup wrote a new root `deep-research-config.json`.

### R2.6 Round 2 references

- Round-two synthesis: `research/lineages/r2-dsflash-llmgw/research.md`
- Round-two iterations: `research/lineages/r2-dsflash-llmgw/iterations/iteration-001.md` to `iteration-010.md`
- Merge attribution: `research/fanout-attribution.md`
- Round-one config: `research/round-1-deep-research-config.json`

## Round 3 (2026-10-10): the shared layer, the review mode and the remaining hub surfaces

Rounds one and two above are unchanged. This section was appended after a third `/deep:research:auto` run in this folder, with its own lineage, `r3-dsflash-llmgw`, and its own targets: the sk-code shared layer and how the hub, modes and surfaces load it; sk-code-review as a codebase-agnostic mode together with `.skilled/agents/review.md`; and a fresh pass over the other modes and hub files. Phase 009's scope was in flight during the run and is recorded as IN-FLIGHT only. The full round-three synthesis is the lineage report at `research/lineages/r3-dsflash-llmgw/research.md`. This section summarizes it.

### R3.1 Answer

The machine surfaces of the hub hold. Every guard the lineage executed passed: the router-sync guard's wired legs, the Webflow runtime checker on its fixture pairs, the check-5k legs, version parity across the five hub artifacts, and the playbook ID sets of the hub and the review packet. The defects sit in prose that no guard reads. Every cluster the run found is pointer or claim drift left behind by a rename or restructure that updated the routers, manifests and guards but not the documents citing them. The eight P1 findings:

1. **The shared layer duplicates two Webflow pattern assets, and the copies have drifted.** `shared/assets/patterns/wait-patterns.js` and `validation-patterns.js` differ from their `sk-code-webflow/assets/patterns/` namesakes, and both READMEs are children of the same `IMPLEMENTATION` intent [SOURCE: .skilled/skills/sk-code/ROUTER.md:382] [SOURCE: .skilled/skills/sk-code/ROUTER.md:384].
2. **Shared references cite directory families that no longer exist.** Seven shared files route readers through `references/webflow/`, `references/opencode/`, `references/motion_dev/`, `assets/webflow/` or `assets/universal/` paths, for example [SOURCE: .skilled/skills/sk-code/shared/references/phase-detection.md:62] and [SOURCE: .skilled/skills/sk-code/shared/references/universal-verification-checklist.md:71].
3. **`phase-detection.md` describes two surfaces.** "Both supported surfaces follow the same lifecycle" [SOURCE: .skilled/skills/sk-code/shared/references/phase-detection.md:16], in a file loaded on every route, while the hub has three surfaces.
4. **`workflow-verify.md` contradicts the document that owns the `validate.sh` contract.** It says warnings become a failing outcome under `--strict` [SOURCE: .skilled/skills/sk-code/shared/references/workflow-verify.md:86]; the owner says a warning stays advice in both modes and never changes the exit code [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:44].
5. **The review mode's private detector misroutes generic repositories to Webflow.** Any `package.json` or `src/` path returns `sk-code:code-webflow` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:225]; the shared authority keeps generic Node at UNKNOWN [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:142].
6. **The review mode has no Obsidian surface.** The only `obsidian` match in the review packet is one changelog line, while the hub routes Obsidian work.
7. **The findings checker passes the finding shape its own doctrine prescribes without checking it.** `review-core.md` writes findings as `### 2 [P1] ...` headings [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:110]; the checker matches only numbered list items.
8. **The quality mode names the comment-hygiene gate by hook paths whose live status depends on the machine.** It cites `.skilled/hooks/git/pre-commit` as the block [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:133], and the shared standard repeats it.

### R3.2 Ranked findings

| # | Finding | Target file | Part | Classification | Priority | Rationale |
|---|---|---|---|---|---|---|
| 1 | Shared and Webflow pattern assets duplicated with drifted bytes, both routed | `shared/assets/patterns/`, `sk-code-webflow/assets/patterns/` | Shared | NEW | P1 | Two sources for one shipped pattern set |
| 2 | Seven shared files cite pre-merge directory families | `shared/references/*.md` | Shared | NEW | P1 | Every route that opens them follows dead pointers |
| 3 | `phase-detection.md` describes two surfaces and one verifier | `shared/references/phase-detection.md` | Shared | NEW | P1 | Always-loaded file disagrees with the surface set |
| 4 | `validate.sh` warning claim contradicts its owner | `shared/references/workflow-verify.md` | Shared | NEW | P1 | Wrong exit-contract guidance on every verify route |
| 5 | Private detector misroutes generic repos to Webflow | `sk-code-review/SKILL.md` | Review | NEW | P1 | Foreign repositories are the normal input of a codebase-agnostic mode |
| 6 | No Obsidian surface in the review mode | `sk-code-review/` | Review | NEW | P1 | A routed surface is invisible to the mode and its output contract |
| 7 | Findings checker passes heading-shaped findings vacuously | `sk-code-review/scripts/check-review-findings.js` | Review | NEW | P1 | Half the documented format skips the checker built for it |
| 8 | Quality mode and shared standard name hook paths as the live gate | `sk-code-quality/SKILL.md`, universal standard | Other modes | NEW | P1 | The gate cited may not be the gate that runs |
| 9 | Shared workflow floors restate the repo rules with no pointer either way | workflow trio, `.skilled/repo-rules/` | Shared | NEW | P2 | Agree today; the same class diverged once already |
| 10 | Surface-conditioned subsections inside the surface-agnostic tier | `workflow-implement.md`, `workflow-verify.md` | Shared | NEW | P2 | Hub purity rule and file content disagree |
| 11 | Three exemption lists disagree on shared hub controls | `ROUTER.md`, `verify_router_sync.cjs` | Shared | NEW | P2 | A validator treating the declaration as exhaustive rejects a correct file |
| 12 | M-1 cache writes a `.skilled/` directory into any reviewed repo | `sk-code-review/SKILL.md` | Review | NEW | P2 | Side effect on foreign repositories |
| 13 | Removal plan reuses `P0/P1/P2` for urgency | `sk-code-review/assets/removal-plan.md` | Review | NEW | P2 | One report can carry two meanings of `P0` |
| 14 | Three spellings of the review status vocabulary | review UX reference, README, SKILL | Review | NEW | P2 | An exact-string contract with three variants |
| 15 | OpenCode SKILL credits leg 1a with leg 1b's orphan coverage | `sk-code-opencode/SKILL.md` | Other modes | NEW | P2 | An orphan-coverage audit reads as covered when it is not |
| 16 | `ROUTER.md` universal-tier load claim overstates the machine map | `ROUTER.md` | Other modes | NEW | P2 | Prose tier claims and emitted entries differ |
| 17 | Two-surface prose across `description.json`, feature catalog and hub README | hub files | Other modes | NEW | P2 | Six instances of one stale sentence |
| 18 | Rename-miss rows in four packets (39 in quality, 21 in review, others) | packet SKILL and README files | Other modes | NEW | P2 | One sweep fixes the family |

The lineage report §9 carries all 73 findings (NEW 50, ALREADY-ADOPTED 18, IN-FLIGHT 3, observations 2; P1 8, P2 65), grouped by part, with path:line citations and reproducing cases.

### R3.3 Original ideas and rejections

Seven original ideas, ranked by proof value. The first answers the root cause: a documentation path-, name- and claim-checker for skill docs, modeled on the rule-copy canary, which would have caught every drift cluster in this round. The others: one declared shared-controls source read by `ROUTER.md`, the router guard and `SKILL.md`; a review-output shape fixture that feeds both documented finding shapes through both checkers; routing the review detector through the shared detection contract; one canonical surface-list sentence or a lint for the two-surface phrasing; a load-tier claims check against `RESOURCE_MAP`; and version parity extended to the hub README and packet changelogs. Seven ideas are rejected with reasons, among them renaming the removal plan's priority scale, an include system for repeated prose, per-file playbook validation and editing the legacy compatibility hook files (lineage report §8).

### R3.4 Verification by the orchestrating run

The lineage's claims are hypotheses until checked. These were re-checked against the tree after the run:

- Confirmed by command: the heading-shaped review (`### 1 [P1] ...` then `### 3 [P2] ...`, no `Case:` lines) made `check-review-findings.js` print `OK: no numbered findings to check` and exit 0, while the same content as a numbered list failed with three errors and exit 1.
- Confirmed by command: `diff` of the two `wait-patterns.js` copies shows the six-line banner and `'use strict'` move on one side and the six-line Motion reference on the other; the two `validation-patterns.js` copies also differ.
- Confirmed by reading: the stale `code-webflow`/`code-opencode` names and the missing Obsidian in `shared/README.md:17`; the two-surface sentence at `phase-detection.md:16`; the dead directory families at `phase-detection.md:62` and `universal-verification-checklist.md:71`; the `workflow-verify.md:86` claim against `validation-rules.md:44`; the detector branch at `sk-code-review/SKILL.md:225` against `stack-detection.md:142`; the single changelog mention of Obsidian in the review packet.
- Partly settled: finding 8. Both `.skilled/hooks/git/pre-commit` and `.skilled/scripts/git-hooks/pre-commit` exist, and this machine's `core.hooksPath` points outside the repository, so which hook runs depends on the operator's setup. The defect is that the documents name a hook without saying so.
- Not re-checked here: the P2 rows' line numbers, the rename-miss row counts and the per-iteration finding counts.

### R3.5 Round 3 convergence report

- **Lineage:** `r3-dsflash-llmgw`, executor `cli-pi`, model `deepseek-v4.1-flash` through the llmgateway provider, reasoning effort `max`.
- **Stop policy and convergence mode:** `max-iterations` with convergence mode `default`. The `divergent` mode was not bound, because it pivots only on a legal `composite_converged` or `all_questions_answered` STOP, and under `max-iterations` the workflow keeps those signals as telemetry, so the pivot could never fire. Widening came from the stop clause ("broaden ... instead of synthesizing early") and from a lead steer file in the lineage directory that told each iteration to take a focus no earlier iteration covered.
- **Stop reason:** `maxIterationsReached`.
- **Iterations:** 20 of 20. Every iteration record carries `target_agent: deep-research`, `agent_definition_loaded: true`, `mode: research` and status `complete`.
- **Findings per iteration:** 4, 4, 4, 5, 4, 4, 4, 3, 3, 3, 3, 4, 4, 4, 3, 3, 3, 4, 4, 3 (73 in total).
- **newInfoRatio:** 0.88, 0.87, 0.88, 0.90, 0.83, 0.88, 0.88, 0.80, 0.85, 0.90, 0.80, 0.85, 0.85, 0.75, 0.70, 0.75, 0.75, 0.80, 0.85, 0.70. The ratio never fell near the 0.05 threshold, so convergence is not claimed.
- **Merge:** `fanout-merge.cjs` merged all four lineages into `research/findings-registry.json` with 226 key findings (153 before this round). `research/resource-map.md` was regenerated from all 50 lineage delta files.
- **Earlier rounds' state:** the three earlier lineages are untouched. Round two's root config is preserved at `research/round-2-deep-research-config.json`, because the round-three setup wrote a new root `deep-research-config.json`.

### R3.6 Proposed implementation phases

1. **Documentation consistency sweep.** Fix the stale path families, rename misses, two-surface prose, hook naming, broken section pointers, phantom Obsidian assets and README rows, and add the documentation path-, name- and claim-checker as the regression guard.
2. **Review contract hardening.** Teach the findings checker the heading shape, add the review-output shape fixture, route the detector through the shared detection contract, add the Obsidian surface, and settle one status vocabulary.
3. **Shared-layer source-of-truth repairs.** De-duplicate the pattern assets behind a pointer, declare the shared controls once, correct the `validate.sh` paragraph against its owner, refresh `phase-detection.md` for three surfaces, align `ROUTER.md`'s load claims with the machine map, and decide who owns the comment budget.
4. **Guards and claims alignment.** Correct the OpenCode leg-1a wording, add an OBSIDIAN-versus-WEBFLOW collision case to the canary, extend version parity to the README and packet changelogs, and add the load-tier claims check.

### R3.7 Round 3 references

- Round-three synthesis: `research/lineages/r3-dsflash-llmgw/research.md`
- Round-three iterations: `research/lineages/r3-dsflash-llmgw/iterations/iteration-001.md` to `iteration-020.md`
- Lead steer file: `research/lineages/r3-dsflash-llmgw/steer.md`
- Merge attribution: `research/fanout-attribution.md`
- Round-two config: `research/round-2-deep-research-config.json`
