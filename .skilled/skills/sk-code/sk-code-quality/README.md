---
title: code-quality
description: The post-implementation quality gate for the sk-code family. It applies P0/P1/P2 author checks, runs comment hygiene per modified file, loads the right surface checklist and hands only clean evidence to verification.
trigger_phrases:
  - "quality gate"
  - "code quality"
  - "comment hygiene"
  - "authoring checklist"
importance_tier: important
contextType: implementation
version: 1.0.0.2
---

# code-quality

> Implementation can be behaviorally close and still not shippable. This mode runs the author-side quality gate after files change and before verification, so gate failures are fixed in place and only clean evidence reaches the surface verification workflow.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Post-implementation quality checks, P0/P1/P2 author-side fixes, comment hygiene and OpenCode target-path checklists |
| **Invoke with** | `quality gate`, `code quality`, `comment hygiene`, `authoring checklist`, `check before done` |
| **Works on** | Webflow frontend files and OpenCode skills, agents, commands, specs, MCP servers, scripts, config and language files |
| **Produces** | In-place quality fixes plus a handoff that states the checklist used, the comment-hygiene result and any remaining risk |

---

## 2. OVERVIEW

### Why This Mode Exists

Implementation can produce code that is behaviorally close and still not shippable: a forbidden comment label, a missing authoring checklist, stale generated output, a style violation or a P0 quality defect that verification would not explain well. The quality mode closes that gap before final evidence is collected.

### What It Does

The quality mode consumes the parent `sk-code` surface detection, loads the required quality checklist, selects an OpenCode authoring checklist by target path when needed, runs the comment-hygiene checker per modified file and applies P0/P1/P2 author checks. It can edit existing scoped files to fix gate failures in place. It does not create new files, dispatch tasks, produce formal review reports or make done claims.

### The Checklist Router

The mode's headline strength is routing by target path: every surface family lands on the checklist that covers it, so the gate checks the same things a human reviewer would check.

| Target family | What the mode knows how to check |
|---|---|
| **Webflow frontend files** | applies the code quality checklist and the shared universal standards |
| **OpenCode skills** | loads the skill-authoring checklist by target path |
| **OpenCode agents and commands** | routes to the agent-authoring and command-authoring checklists |
| **Spec folders and MCP servers** | routes to the spec-folder and MCP-server-authoring checklists |
| **Language files and config** | applies the language-specific and config checklists |

---

## 3. QUICK START

**Step 1: Route after implementation.** Use this mode after the surface skill (`sk-code-webflow` or `sk-code-opencode`) has changed files and before the surface verification workflow (`workflow-verify.md`) collects final evidence.

**Step 2: Load the right checklist.** The mode always loads [`assets/code-quality-checklist/overview-header-and-comments.md`](./assets/code-quality-checklist/overview-header-and-comments.md). For `.opencode/` targets it also loads the matching checklist under [`../sk-code-opencode/assets/checklists/`](../sk-code-opencode/assets/checklists/).

**Step 3: Run comment hygiene per modified file.**

```bash
bash .opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh <modified-file>
```

The script reports zero violations and exits 0 when every comment keeps durable WHY and drops ephemeral artifact labels.

**Step 4: Fix or hand back.** Fix in-place quality failures with `Edit`. Root-cause failures that need investigation to the surface debugging workflow (`workflow-debug.md`). Send final evidence to the surface verification workflow (`workflow-verify.md`).

---

## 4. HOW IT WORKS

The mode sits between implementation and verification. It reads the changed files, resolves surface identity from the shared router references, applies the right checklist family, runs comment hygiene and checks P0/P1/P2 status. P0 blocks completion. P1 is fixed unless the user accepts a documented risk. P2 is fixed when cheap or explicitly deferred with a reason.

### The P0/P1/P2 Gate

| Severity | Meaning | Gate effect |
|---|---|---|
| **P0** | Correctness, safety, broken contract, forbidden comment metadata, unchecked generated drift or missing checklist evidence | Blocks completion until fixed or escalated |
| **P1** | Maintainability or authoring-contract issue that would confuse future work | Fixed before handoff unless the user accepts a documented risk |
| **P2** | Local polish or minor consistency issue with low behavioral risk | Fixed when cheap, otherwise deferred with a documented reason |

### Target-Path Routing

OpenCode authoring targets route to specific checklists: skills, agents, commands, spec folders, MCP servers, language files and config each have their own checklist. Webflow frontend work uses the code quality checklist and the shared universal standards.

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
| `sk-code-webflow` / `sk-code-opencode` | Surface skills that implement and change files, own root-cause debugging and gather verification evidence through the implement → debug → verify workflow doctrine |
| `sk-code-review` | Produces findings-first reports when no author-side editing is wanted |

---

## 6. VERIFICATION

| Check | How to run it |
|---|---|
| Comment hygiene | `bash .opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh <modified-file>` reports zero violations and exits 0 |
| Distribution drift | `bash .opencode/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` exits 0 when generated artifacts are current |
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-code/sk-code-quality/README.md --type readme` reports zero issues |
| Final claim | Hand to the surface verification workflow (`workflow-verify.md`). This mode does not make done or works claims |

---

## 7. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime contract for the quality mode |
| [`assets/code-quality-checklist/overview-header-and-comments.md`](./assets/code-quality-checklist/overview-header-and-comments.md) | Required quality checklist before implementation completion claims |
| [`assets/checklists/`](../sk-code-opencode/assets/checklists/) | Target-path OpenCode authoring checklists |
| [`scripts/check-comment-hygiene.sh`](./scripts/check-comment-hygiene.sh) | Per-file comment-hygiene checker |
| [`scripts/check-dist-staleness.sh`](./scripts/check-dist-staleness.sh) | Generated artifact drift checker |
| [`../shared/references/stack-detection.md`](../shared/references/stack-detection.md) | Shared surface detection |
| [`../shared/references/phase-detection.md`](../shared/references/phase-detection.md) | Lifecycle placement for the quality gate |
| [`../shared/references/universal/code-quality-standards.md`](../shared/references/universal/code-quality-standards.md) | Universal quality standards |
