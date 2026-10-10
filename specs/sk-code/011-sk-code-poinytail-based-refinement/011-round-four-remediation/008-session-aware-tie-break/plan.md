---
title: "Implementation Plan: Phase 8: session-aware-tie-break"
description: "The caller runs the hub's surface detection and passes the result to the compiled front door as --surface-hint. At serve time the hinted surface takes the first surface slot of a bundle the prompt already matched, after the route decision is validated, so targets, bundle kind and workflow-mode order never change and a call without a usable hint serves the compiled order."
trigger_phrases:
  - "session aware tie break plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: session-aware-tie-break

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (v26.8.2 observed), JSON fixtures, Markdown hub docs |
| **Framework** | None. The compiled-routing runtime under `.skilled/bin/lib/compiled-routing/` and its authored copy under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/` |
| **Storage** | None |
| **Testing** | `node --test` with the TAP reporter, the sk-code canary assertion, the all-hub canary run, a route probe, router-sync, doc-claims, parent-skill-check, the leaf manifest `--check`, the advisor battery replay |

### Overview
The sk-code canary router gains an exported `applySurfaceHint` that moves a hinted surface into the first surface slot of a validated route. The runtime engine calls it when `compiledRoute` receives `options.surfaceHint`, the resolver passes the option through, and the front door reads it from `--surface-hint`. The sk-code canary harness applies a case's `surfaceHint` field the same way, so five canary cases can pin the behavior. The hub `SKILL.md` and `ROUTER.md` tell the caller to run the existing surface detection and pass its result, and the hub moves to release 2.2.7.0.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A serve-time post-processing step over a validated route decision, behind an optional input that defaults to the current behavior.

### Key Components
- **Recheck (2026-10-10).** `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/scratch/probe-route.cjs` with the WF-005 prompt and the WF-013 prompt printed `route orderedBundle sk-code-opencode,sk-code-webflow` for both. `.skilled/bin/compiled-route.cjs` has no hint input (`grep -c -F -- '--surface-hint' .skilled/bin/compiled-route.cjs` prints `0`). The item reproduces. The probe is a byte copy of child 003's.
- **Where the tie-break order lives.** `evaluateCanary` sorts the near-tied modes by `routerPolicy.tieBreak` (`canary-router.cjs:250`, `:264`), looks up the bundle kind for that exact order and builds the route through `parseRouteDecision`. The decision contract rejects any bundle order that is not one of the compiled `policy.compositionRules` (`005-decision-evaluator/lib/decision-contract.cjs:325`, code `BUNDLE_NOT_IN_POLICY`), and those rules are compiled from the tie-break list. A planner dry run that reordered inside `evaluateCanary` hit that error on the first hinted case. So the hint is applied at serve time over the compiled order, after validation.
- **Router: `applySurfaceHint(snapshot, targets, surfaceHint)`.** Added to the authored `009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs` with a helper `hintedSurface`, and exported. A hint matches a policy destination whose `id.packetKind` is `surface` when its normalized value equals the `workflowMode` or `<skillId>-<value>`, so `WEBFLOW`, `webflow` and `sk-code-webflow` all name `sk-code-webflow`. When that surface is among the route's targets, it takes the first surface slot and the other surfaces keep their relative order. Workflow targets keep their slots. Otherwise the targets come back unchanged.
- **Engine: `compiledRoute(hubId, taskText, options = {})`.** `loadHubEngine` stores the router's `applySurfaceHint` when the hub's router exports one, else `null`. `compiledRoute` still calls `evaluate(snapshot, { prompt: taskText })` exactly as today, then, only when a route exists, the hub has the function and `options.surfaceHint` is a string, replaces the route's targets with the reordered copy before normalizing them. `selectionKind`, `action` and the policy identity are untouched.
- **Resolver and front door.** `resolveRoute(hubId, taskText, options = {})` passes `options` to `compiledRoute`. The front door reads `--surface-hint <SURFACE>` and passes `{ surfaceHint }`. A missing flag passes `undefined`, which the engine ignores.
- **Canary harness.** `typedGold` in `009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs` maps `applySurfaceHint(snapshot, route.targets, entry.surfaceHint)` instead of `route.targets`, so a fixture case can carry `"surfaceHint": "WEBFLOW"`. Cases without the field produce the same rows as before.
- **Canary cases.** After `surface-collision-obsidian-over-webflow-implementation`: `surface-hint-absent-webflow-testing` and `surface-hint-webflow-testing` (WF-005 prompt), `surface-hint-absent-webflow-language` and `surface-hint-webflow-language` (WF-013 prompt), and `surface-hint-webflow-over-obsidian` (`obsidian plugin webflow implementation` with `WEBFLOW`). The no-hint Obsidian case is child 003's existing case.
- **Caller step.** In `SKILL.md`, a `**Session surface hint.**` paragraph right after the compiled-routing blockquote. In `ROUTER.md`, one sentence at the end of the Core Principle paragraph.
- **Release.** 2.2.6.0 to 2.2.7.0 across the six carriers that `SKILL.md:17` names, with `changelog/v2.2.7.0.md` in the compact shape of `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md`. Its full text is `scratch/units/v2.2.7.0.md`.

### Data Flow
The agent runs `stack-detection.md` on its working directory and target files, then calls `compiled-route.cjs --hub sk-code --prompt "<task>" --surface-hint <SURFACE>`. The resolver gates on the flag and the manifest, the engine routes the prompt exactly as before, and only then moves the hinted surface forward among the targets it already chose.

### Decisions

| ID | Decision | Why |
|----|----------|-----|
| D1 | Apply the hint after validation, in an exported `applySurfaceHint`, called by the engine and by the sk-code canary harness | Reordering inside `evaluateCanary` fails the decision contract (`BUNDLE_NOT_IN_POLICY`). One function serves both callers, so the canary tests the same code that serves |
| D2 | The flag is `--surface-hint <SURFACE>`, and a value is a detection label or a `workflowMode`, matched case-insensitively against the hub's declared surface destinations | The caller holds a label from `stack-detection.md`. Matching declared destinations is the validation the operator asked for, and `UNKNOWN` matches nothing |
| D3 | Edit each authored closure file, then `cp` it over its runtime copy. No `compiled-route-sync.cjs` rebuild | `compiled-route-sync.cjs --check` already fails on the authored tree (`authored closure failed to resolve hubs: cli-classifier`). Commit `f9fb96c37e5` edited both copies of these files the same way. The serving-closure manifest lists paths, not hashes, so it does not change |
| D4 | An invalid hint is silent on both stdout and stderr | The router stays pure and the front door test asserts an empty stderr. The brief allows a debug-gated report but does not require one |
| D5 | The caller step is a paragraph after the compiled-routing blockquote, not inside it | The blockquote is lockstep text across seven surfaces (`sk-create-skill/references/parent-skill/compiled-routing-lockstep-surfaces.json`). An edit inside it would show as directive drift |
| D6 | Patch bump to 2.2.7.0 | It fixes a misrouting with an optional input and breaks no caller, which `sk-create-changelog` section 4 maps to a patch |
| D7 | The new test file builds a temporary activation root whose manifest selects the policy the engine compiles now | The committed manifest is stale until the orchestrator re-mints, and the existing front door test fails for that reason today |
| D8 | Three test cases are regression guards that pass before the change, and three test cases plus three canary cases fail before it | No hint, an ignored hint and other hubs must stay unchanged, so they cannot fail first. The negative controls T015 and T017 prove the hint cases can fail |

### Round three's reason, and this plan's answer
This item is not a round-three residual. Child 003's review in round four showed that generic words decide keyword ties, and the operator added this child on 2026-10-10 (parent `spec.md` section 7 and the "Child 008 added" row of the parent `goal.md`). No earlier round recorded a reason to leave it out.

### Handoffs
- **`.skilled/bin/README.md`, no owning child.** The orchestrator decides whether to apply it. In the front door row (line 161 at plan time), find the text that occurs once:

  ```text
  which keeps a user's prompt out of the process table. |
  ```

  and replace it with:

  ```text
  which keeps a user's prompt out of the process table. `--surface-hint <SURFACE>` passes the surface the caller's session works in, which leads a keyword tie between surfaces the prompt matched. |
  ```

### Orchestrator steps
The builder never runs these: the compiled manifest re-mint and its archive copy (T042, T043), the Hermes generator (T044) and the trigger-index rebuild (T045). The builder runs only the `--check` forms in Phase 3. The leaf manifest needs no refresh, because it lists packet leaves and this child changes no packet.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Planner dry run (2026-10-10).** `scratch/mirror-setup.sh` built a mirror with copies of `.skilled/bin`, the sk-code hub and the five authored closure files, with every other skill linked read-only. `scratch/mirror-apply.cjs` applied all 28 units of `scratch/dispatch-units.json` in order and every check printed its expected text. The negative controls printed `# pass 3`, `# fail 3` and `cases 18 failures 3`. After the units: the new test file printed `# pass 6` and `# fail 0`, the canary `cases 18 failures 0`, the four-prompt probe matched its before output, the all-hub run changed only `001-sk-code cases 13` to `cases 18`, router-sync 5/5, doc-claims 4/4, parent-skill-check `OK` with 5e, 5i, 13c (2.2.7.0) and 13d PASS, the leaf manifest stayed `OK (59ea33fd...)`, `SKILL.md` kept 0 issues and 36 hard blockers, `ROUTER.md` kept 1 issue and 32 hard blockers, and the changelog was `VALID` with 0 issues and 0 hard blockers. The admission and manifest tests kept `28/1` and `26/16`. A re-mint in the mirror gave `sk-code fresh`, the front door returned `sk-code-webflow` then `sk-code-opencode` with the hint, the existing front door test passed and `compiled-route-sync.cjs --verify` printed `move-simulation OK: all 7 hubs resolve`. The mirror was deleted afterwards.
- **Lockstep.** The compiled-routing blockquote extracted from the edited `SKILL.md` was identical to the original.
- **Advisor.** `scratch/advisor-battery.cjs` printed `positives 13/17 negatives-false-positive 2/5` at plan time. The bar is no change.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Baselines at plan time, before children 001 to 007 were committed: sk-code canary `cases 13 failures 0`, all hubs `all hubs failures 1` (`004-cli-external-orchestration jev-transport-single`), router-sync 5/5, doc-claims 4/4, parent-skill-check `OK`, leaf manifest `OK (59ea33fd...)`, compiled guard `sk-code stale-manifest`, existing front door test `# fail 1` (stale manifest), admission test `# pass 28` `# fail 1`, manifest test `# pass 26` `# fail 16`, Hermes `--check` `FAIL: 6 drifted, 0 stale` from sibling builds. Phase 1 records the build-time values, and Phase 3 compares against those.
- `canary-router.cjs` holds two literal NUL bytes inside `join('\0')` calls, so `grep` reports it as a binary file. `grep -c` still counts. The builder's edit must keep both bytes, and T050 counts them.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Restore the modified tracked files in the `spec.md` Files to Change table with `git restore`, and delete `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` and `.skilled/skills/sk-code/changelog/v2.2.7.0.md`.
- If the orchestrator has re-minted, rerun `node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code`, copy the manifest over its archive copy again and regenerate Hermes.
<!-- /ANCHOR:rollback -->

---
