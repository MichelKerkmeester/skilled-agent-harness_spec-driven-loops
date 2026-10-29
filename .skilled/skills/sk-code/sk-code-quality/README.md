---
title: sk-code-quality
description: The post-implementation quality gate for the sk-code family. It runs the quality runner over the change, loads the checklists the verdict names, applies P0/P1/P2 author checks and hands only clean evidence to verification.
trigger_phrases:
  - "quality gate"
  - "code quality"
  - "comment hygiene"
  - "authoring checklist"
importance_tier: important
contextType: implementation
version: 1.3.7.0
---

# sk-code-quality

> Implementation can be behaviorally close and still not shippable. This mode runs the author-side quality gate after files change and before verification, so gate failures are fixed in place and only clean evidence reaches the surface verification workflow.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Post-implementation quality checks, P0/P1/P2 author-side fixes, comment hygiene and OpenCode target-path checklists |
| **Invoke with** | `quality gate`, `code quality`, `comment hygiene`, `authoring checklist`, `check before done` |
| **Works on** | Any repository: the runner checks the change with the universal floor and the checks the repository names. In this repository it also loads the SKILLED checklists for skills, agents, commands, specs, MCP servers, scripts, config and language files |
| **Produces** | In-place quality fixes plus a handoff that states the runner's verdict, the checklists used, the hygiene rules switched off and any remaining risk |

---

## 2. OVERVIEW

### Why This Mode Exists

Implementation can produce code that is behaviorally close and still not shippable: a forbidden comment label, a missing authoring checklist, stale generated output, a style violation or a P0 quality defect that verification would not explain well. The quality mode closes that gap before final evidence is collected.

### What It Does

The quality mode runs `scripts/quality-gate.cjs` over the change, which works in any repository. The runner's verdict names the gate, the state of each enforcement layer and the checklists that apply. The mode loads those checklists and applies P0/P1/P2 author checks. It can edit existing scoped files to fix gate failures in place. It does not create new files, dispatch tasks, produce formal review reports or make done claims.

### The Checklist Router

The mode's headline strength is routing by target path: every surface family lands on the checklist that covers it, so the gate checks the same things a human reviewer would check. The universal floor applies to every file. The rows below are this hub's own SKILLED surface, which loads for files the surface detection places in it.

| Target family | What the mode knows how to check |
|---|---|
| **OpenCode skills** | loads the skill-authoring checklist by target path |
| **OpenCode agents and commands** | routes to the agent-authoring and command-authoring checklists |
| **Spec folders** | routes to the spec-folder authoring checklist that `system-spec-kit` owns |
| **MCP servers** | routes to the MCP-server-authoring checklist |
| **Language files and config** | applies the language-specific and config checklists |
| **Your own surface** | a surface another skill declares, or a checklist your `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` names, brings its own checklists |

---

## 3. QUICK START

**Step 1: Route after implementation.** Use this mode after the surface skill (`sk-code-skilled`) has changed files and before the surface verification workflow (`workflow-verify.md`) collects final evidence.

**Step 2: Run the quality runner.**

```bash
node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --format text
```

The runner reads the change, by default the working tree against `HEAD`. It runs the conflict-marker, secret and debug-leftover sensors, one comment-hygiene call over the changed files and a parse floor, and probes which hooks and workflows enforce hygiene. It prints one verdict with a gate and an exit code from 0 to 4. No gate means pass: exit 0 says only that no blocker was found and that every required check produced evidence. [`references/runner-contract.md`](./references/runner-contract.md) documents every field. A committed `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` runs its commands only in a trusted repository. Without a grant each configured check reads `SKIPPED_UNTRUSTED` with the repair `git config --local skilled.trustRepoChecks true`, and [section 8 of the quality config reference](./references/quality-config.md) names the grants.

**Step 3: Load the checklists the verdict names.** The universal floor [`code-quality-standards.md`](../shared/references/universal/code-quality-standards.md) loads for every target. It gives each rule an id and marks it FIXED or overridable. [`universal-checklist.md`](../sk-code-skilled/assets/checklists/universal-checklist.md) is the SKILLED house checklist, and it loads only when SKILLED is a resolved surface. On SKILLED it also names the JavaScript and CSS house checks for a `.js` or `.css` target, in [`js-css-style/`](../sk-code-skilled/assets/checklists/js-css-style/). For `.skilled/` targets it names the matching checklist under [`../sk-code-skilled/assets/checklists/`](../sk-code-skilled/assets/checklists/). The house style of this framework (file layout, `MODULE:` headers, the `ceiling:` marker, test layout) lives in those SKILLED files, so another repository does not inherit it.

**Step 4: Fix or hand back.** Fix in-place quality failures with `Edit`. Root-cause failures that need investigation to the surface debugging workflow (`workflow-debug.md`). Send final evidence to the surface verification workflow (`workflow-verify.md`).

---

## 4. HOW IT WORKS

The mode sits between implementation and verification. It runs the quality runner over the changed files, which resolves surface identity through the shared surface reader and names the checklists that apply. The mode loads them and checks P0/P1/P2 status. P0 blocks completion. P1 is fixed unless the user accepts a documented risk. P2 is fixed when cheap or explicitly deferred with a reason.

### The P0/P1/P2 Gate

| Severity | Meaning | Gate effect |
|---|---|---|
| **P0** | Correctness, safety, broken contract, forbidden comment metadata, unchecked generated drift or missing checklist evidence | Blocks completion until fixed or escalated |
| **P1** | Maintainability or authoring-contract issue that would confuse future work | Fixed before handoff unless the user accepts a documented risk |
| **P2** | Local polish or minor consistency issue with low behavioral risk | Fixed when cheap, otherwise deferred with a documented reason |

### Target-Path Routing

OpenCode authoring targets route to specific checklists: skills, agents, commands, MCP servers, language files and config each have their own checklist under `sk-code-skilled`. Spec folders route to the spec-folder authoring checklist that `system-spec-kit` owns. `node scripts/quality-gate.cjs --explain <path> [<path>...]` answers for a whole change in one call. For each file it names the surfaces, the folder each surface loads from and every checklist with the seat that declared it, plus each checklist's parsed `## Rule overrides` rows. It runs nothing and writes nothing. It exits 2 when every path resolves, and 3 (ERROR) on a usage error or a missing path.

### Rules Your Repository Can Change

The universal floor splits into FIXED rules and overridable ones. The hard floor stays on in every repository: secrets, conflict markers, parse failures, input validation, silent failures, initialization safety, resource cleanup and accessibility for UI code. A repository can drop or replace the rest, such as documentation, typing strictness, naming and the `ceiling:` marker.

There are two ways to say so, and they work together.

- **A `## Rule overrides` section** in a checklist the repository already declares, such as one named in `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` `checklists[]`. Each row gives a rule id, `none` or `replace: <text>` and an optional reason. The shared contract is [`rule-overrides.md`](../shared/references/universal/rule-overrides.md), and `node ../shared/scripts/check-rule-overrides.cjs <checklist.md>` checks a section. A row that names a hard-floor id is refused.
- **`commentHygiene.disableRules`** in `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` switches off named core comment-hygiene rules, such as `issue` or `task`. The runner, the pre-commit hook and the CI job all honor it, and the verdict lists what is off in `config.hygiene.disabled`. An unknown id, or a hard-floor id such as `secret.private-key`, is `CONFIG_INVALID`.

A run reads the section of every checklist it loads. A refused section, or a row whose rule id no declaring document carries, ends the run `ERROR` with `CONFIG_INVALID` and exit 3, and the error names the checklist and every reason. Each accepted row is recorded in `rule_overrides` and in the envelope's `p0_p1_p2_decisions` as `override <rule id> <none|replace> from <checklist>`, ahead of `PENDING_AGENT_JUDGMENT`. Two checklists at one precedence level that disagree on a rule leave its default in force, appear in `rule_conflicts` and join `summary.unverified`, so the gate reads `UNVERIFIED`.

A recorded hygiene row tells the agent and the review mode what to apply. The runner's own comment-hygiene check changes only through `disableRules`, so a repository that wants a hygiene rule off everywhere sets both. `--explain` shows what each checklist's section says and the conflicts for each file, and `/doctor:sk-code quality` shows the same answer for the whole repository.

### The Mutation Boundary

This mode can edit already-scoped files because author-side quality correction is part of implementation. It cannot write new files and cannot dispatch subagents. Findings-only review belongs to `sk-code-review`.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Mode

Use it when a change is already written and needs standards enforcement before final verification: skill authoring, script changes, config changes, frontend quality, comment hygiene or stale generated-output checks. Skip it when the task is to build new behavior, debug a failing symptom, verify non-mutating evidence or review without editing.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Parent hub that routes the quality workflow here |
| `sk-code-skilled` | Surface skills that implement and change files, own root-cause debugging and gather verification evidence through the implement → debug → verify workflow doctrine |
| `sk-code-review` | Produces findings-first reports when no author-side editing is wanted |

---

## 6. VERIFICATION

| Check | How to run it |
|---|---|
| Quality verdict | `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` prints one `code-quality-run/v1` verdict and exits 0 to 4, as `references/runner-contract.md` section 2 states. It writes no file |
| Runner tests | `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` runs the named fixtures and unit cases, each in a throwaway repository |
| Comment hygiene | `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh <modified-file>` reports zero violations and exits 0. Run it directly, not through `bash`, because it is a Python program. Add `--disable-rule <id>` to skip one core rule |
| Rule overrides | `node .skilled/skills/sk-code/shared/scripts/check-rule-overrides.cjs <checklist.md>` exits 0 for a valid or absent `## Rule overrides` section and 1 when a row is refused |
| Distribution drift | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh <changed-file>` prints a banner when the package that holds the file is stale or cannot be checked, and nothing when it is current. This per-file form never rebuilds. It always exits 0 because it warns and does not gate. Run it directly, not through `bash`, because it is a Python program |
| Ceiling markers | `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh` prints one line per `ceiling:` or `intentional-limit:` marker and a closing `markers=N no-trigger=N no-signal=N` line, and exits 0 because it reports and does not gate |
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/sk-code-quality/README.md --type readme` reports zero issues |
| Final claim | Hand to the surface verification workflow (`workflow-verify.md`). This mode does not make done or works claims |

---

## 7. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime contract for the quality mode |
| [`ROUTER.md`](./ROUTER.md) | Machine router: intent map, resource map and routing pseudocode |
| [`references/runner-contract.md`](./references/runner-contract.md) | The runner's CLI, exit codes, states, verdict, envelope grammar and rule ids |
| [`scripts/quality-gate.cjs`](./scripts/quality-gate.cjs) | The quality runner, one verdict per change in any repository |
| [`../sk-code-skilled/assets/checklists/`](../sk-code-skilled/assets/checklists/) | Target-path OpenCode authoring checklists for skills, agents, commands, MCP servers, language files and config |
| [`spec-folder-authoring-checklist.md`](../../system-spec-kit/references/workflows/spec-folder-authoring-checklist.md) | Spec-folder authoring checklist, owned by `system-spec-kit` |
| [`scripts/check-comment-hygiene.sh`](./scripts/check-comment-hygiene.sh) | Comment-hygiene checker, which the runner calls once per run |
| [`scripts/check-dist-staleness.sh`](./scripts/check-dist-staleness.sh) | Generated artifact drift checker |
| [`scripts/ceiling-report.sh`](./scripts/ceiling-report.sh) | Ceiling-marker report for debt passes and release checks |
| [`../shared/references/stack-detection.md`](../shared/references/stack-detection.md) | Shared surface detection |
| [`../shared/references/phase-detection.md`](../shared/references/phase-detection.md) | Lifecycle placement for the quality gate |
| [`../shared/references/universal/code-quality-standards.md`](../shared/references/universal/code-quality-standards.md) | Universal quality standards, with rule ids and FIXED or overridable marks |
| [`../shared/references/universal/rule-overrides.md`](../shared/references/universal/rule-overrides.md) | How a repository drops or replaces a rule, and the hard floor no one can change |
| [`references/quality-config.md`](./references/quality-config.md) | The `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` schema, including `commentHygiene.disableRules` |
