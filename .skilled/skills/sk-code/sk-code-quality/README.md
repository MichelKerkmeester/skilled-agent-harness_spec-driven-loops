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
version: 1.3.3.0
---

# sk-code-quality

> Implementation can be behaviorally close and still not shippable. This mode runs the author-side quality gate after files change and before verification, so gate failures are fixed in place and only clean evidence reaches the surface verification workflow.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Post-implementation quality checks, P0/P1/P2 author-side fixes, comment hygiene and OpenCode target-path checklists |
| **Invoke with** | `quality gate`, `code quality`, `comment hygiene`, `authoring checklist`, `check before done` |
| **Works on** | OpenCode skills, agents, commands, specs, MCP servers, scripts, config and language files |
| **Produces** | In-place quality fixes plus a handoff that states the runner's verdict, the checklists used and any remaining risk |

---

## 2. OVERVIEW

### Why This Mode Exists

Implementation can produce code that is behaviorally close and still not shippable: a forbidden comment label, a missing authoring checklist, stale generated output, a style violation or a P0 quality defect that verification would not explain well. The quality mode closes that gap before final evidence is collected.

### What It Does

The quality mode runs `scripts/quality-gate.cjs` over the change, which works in any repository. The runner's verdict names the gate, the state of each enforcement layer and the checklists that apply. The mode loads those checklists and applies P0/P1/P2 author checks. It can edit existing scoped files to fix gate failures in place. It does not create new files, dispatch tasks, produce formal review reports or make done claims.

### The Checklist Router

The mode's headline strength is routing by target path: every surface family lands on the checklist that covers it, so the gate checks the same things a human reviewer would check.

| Target family | What the mode knows how to check |
|---|---|
| **OpenCode skills** | loads the skill-authoring checklist by target path |
| **OpenCode agents and commands** | routes to the agent-authoring and command-authoring checklists |
| **Spec folders** | routes to the spec-folder authoring checklist that `system-spec-kit` owns |
| **MCP servers** | routes to the MCP-server-authoring checklist |
| **Language files and config** | applies the language-specific and config checklists |

---

## 3. QUICK START

**Step 1: Route after implementation.** Use this mode after the surface skill (`sk-code-skilled`) has changed files and before the surface verification workflow (`workflow-verify.md`) collects final evidence.

**Step 2: Run the quality runner.**

```bash
node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --format text
```

The runner reads the change, by default the working tree against `HEAD`. It runs the conflict-marker, secret and debug-leftover sensors, one comment-hygiene call over the changed files and a parse floor, and probes which hooks and workflows enforce hygiene. It prints one verdict with a gate and an exit code from 0 to 4. No gate means pass: exit 0 says only that no blocker was found and that every required check produced evidence. [`references/runner-contract.md`](./references/runner-contract.md) documents every field. A committed `.sk-code/quality.json` runs its commands only in a trusted repository. Without a grant each configured check reads `SKIPPED_UNTRUSTED` with the repair `git config --local skilled.trustRepoChecks true`, and [section 8 of the quality config reference](./references/quality-config.md) names the grants.

**Step 3: Load the checklists the verdict names.** The universal floor [`code-quality-standards.md`](../shared/references/universal/code-quality-standards.md) loads for every target. [`universal-checklist.md`](../sk-code-skilled/assets/checklists/universal-checklist.md) is the SKILLED house checklist, and it loads only when SKILLED is a resolved surface. On SKILLED it also names the JavaScript and CSS house checks for a `.js` or `.css` target, in [`js-css-style/`](../sk-code-skilled/assets/checklists/js-css-style/). For `.skilled/` targets it names the matching checklist under [`../sk-code-skilled/assets/checklists/`](../sk-code-skilled/assets/checklists/).

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

OpenCode authoring targets route to specific checklists: skills, agents, commands, MCP servers, language files and config each have their own checklist under `sk-code-skilled`. Spec folders route to the spec-folder authoring checklist that `system-spec-kit` owns. `node scripts/quality-gate.cjs --explain <path>` names the checklists for any one file, and why.

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
| Comment hygiene | `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh <modified-file>` reports zero violations and exits 0. Run it directly, not through `bash`, because it is a Python program |
| Distribution drift | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh <changed-file>` prints a banner when the package that holds the file is stale or cannot be checked, and nothing when it is current. This per-file form never rebuilds. It always exits 0 because it warns and does not gate. Run it directly, not through `bash`, because it is a Python program |
| Ceiling markers | `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh` prints one line per `ceiling:` or `intentional-limit:` marker and a closing `markers=N no-trigger=N no-signal=N` line, and exits 0 because it reports and does not gate |
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/sk-code-quality/README.md --type readme` reports zero issues |
| Final claim | Hand to the surface verification workflow (`workflow-verify.md`). This mode does not make done or works claims |

---

## 7. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime contract for the quality mode |
| [`references/runner-contract.md`](./references/runner-contract.md) | The runner's CLI, exit codes, states, verdict, envelope grammar and rule ids |
| [`scripts/quality-gate.cjs`](./scripts/quality-gate.cjs) | The quality runner, one verdict per change in any repository |
| [`../sk-code-skilled/assets/checklists/`](../sk-code-skilled/assets/checklists/) | Target-path OpenCode authoring checklists for skills, agents, commands, MCP servers, language files and config |
| [`spec-folder-authoring-checklist.md`](../../system-spec-kit/references/workflows/spec-folder-authoring-checklist.md) | Spec-folder authoring checklist, owned by `system-spec-kit` |
| [`scripts/check-comment-hygiene.sh`](./scripts/check-comment-hygiene.sh) | Comment-hygiene checker, which the runner calls once per run |
| [`scripts/check-dist-staleness.sh`](./scripts/check-dist-staleness.sh) | Generated artifact drift checker |
| [`scripts/ceiling-report.sh`](./scripts/ceiling-report.sh) | Ceiling-marker report for debt passes and release checks |
| [`../shared/references/stack-detection.md`](../shared/references/stack-detection.md) | Shared surface detection |
| [`../shared/references/phase-detection.md`](../shared/references/phase-detection.md) | Lifecycle placement for the quality gate |
| [`../shared/references/universal/code-quality-standards.md`](../shared/references/universal/code-quality-standards.md) | Universal quality standards |
