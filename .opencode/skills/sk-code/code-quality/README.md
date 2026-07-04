---
title: code-quality
description: The sk-code post-implementation quality gate that applies P0/P1/P2 checks, target-path authoring checklists, and comment hygiene before verification.
trigger_phrases:
  - "quality gate"
  - "code quality"
  - "comment hygiene"
  - "authoring checklist"
importance_tier: important
contextType: implementation
version: 1.0.0.1
---

# code-quality

> Runs the author-side gate after files are changed and before verification: load the right checklist, check comment hygiene, fix gate failures in place, then hand clean evidence to `code-verify`.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Post-implementation quality checks, P0/P1/P2 author-side fixes, comment hygiene, and OpenCode target-path checklists |
| **Invoke with** | `quality gate`, `code quality`, `comment hygiene`, `authoring checklist`, `check before done` |
| **Works on** | WEBFLOW/frontend files and OPENCODE skills, agents, commands, specs, MCP servers, scripts, config, and language files |
| **Produces** | In-place quality fixes plus a handoff stating checklist, comment-hygiene, and remaining-risk status |

---

## 2. OVERVIEW

### Why This Mode Exists

Implementation can produce code that is behaviorally close but still not shippable: a forbidden comment label, a missing authoring checklist, stale generated output, a style violation, or a P0 quality defect that verification would not explain well. The quality mode closes that gap before final evidence is collected.

### What It Does

`code-quality` consumes the parent `sk-code` surface detection, loads the required quality checklist, selects an OpenCode authoring checklist by target path when needed, runs the comment-hygiene checker per modified file, and applies P0/P1/P2 author checks. It can edit existing scoped files to fix gate failures. It does not create new files, dispatch tasks, or produce formal review reports.

---

## 3. QUICK START

**Step 1: Route after implementation.** Use this mode after `code-implement` has changed files and before `code-verify` collects final evidence.

**Step 2: Load the right checklist.** The mode always loads [`assets/code_quality_checklist.md`](./assets/code_quality_checklist.md). For `.opencode/` targets, it also loads the matching checklist under [`assets/opencode-checklists/`](../opencode/assets/checklists/).

**Step 3: Run comment hygiene per modified file.** Use [`scripts/check-comment-hygiene.sh`](./scripts/check-comment-hygiene.sh) for every modified file that can contain comments.

**Step 4: Fix or hand back.** Fix in-place quality failures with `Edit`. Hand broader implementation to `code-implement`, root-cause failures to `code-debug`, and final evidence to `code-verify`.

---

## 4. HOW IT WORKS

The mode sits between implementation and verification. It reads the changed files, resolves surface identity from shared router references, applies the right checklist family, runs comment hygiene, and checks P0/P1/P2 status. P0 blocks completion. P1 is fixed unless the user accepts a documented risk. P2 is fixed when cheap or explicitly deferred with a reason.

### Target-Path Routing

OpenCode authoring targets route to specific checklists: skills, agents, commands, spec folders, MCP servers, language files, and config each have their own checklist. Webflow/frontend work uses the code quality checklist and shared universal standards.

### Mutation Boundary

This mode can edit already-scoped files because author-side quality correction is part of implementation. It cannot write new files and cannot dispatch subagents. Findings-only review belongs to `code-review`.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Mode

Use it when a change is already written and needs standards enforcement before final verification: skill authoring, script changes, config changes, frontend quality, comment hygiene, or stale generated-output checks. Skip it when the task is to build new behavior, debug a failing symptom, verify non-mutating evidence, or review without editing.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Parent hub that routes the quality workflow here |
| `code-implement` | Writes the files this mode checks |
| `code-debug` | Handles root-cause failures exposed by the gate |
| `code-verify` | Runs final non-mutating verification after the gate clears |
| `code-review` | Produces findings-first reports when no author-side editing is wanted |

---

## 6. VERIFICATION

| Check | How to run it |
|---|---|
| Comment hygiene | `bash .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh <modified-file>` |
| Distribution drift | `bash .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh` when generated artifacts are involved |
| Skill structure | Validate changed skill docs with the project documentation validator when applicable |
| Final claim | Hand to `code-verify`; this mode does not make done or works claims |

---

## 7. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime contract for the quality mode |
| [`assets/code_quality_checklist.md`](./assets/code_quality_checklist.md) | Required quality checklist before implementation completion claims |
| [`assets/opencode-checklists/`](../opencode/assets/checklists/) | Target-path OpenCode authoring checklists |
| [`scripts/check-comment-hygiene.sh`](./scripts/check-comment-hygiene.sh) | Per-file comment-hygiene checker |
| [`scripts/check-dist-staleness.sh`](./scripts/check-dist-staleness.sh) | Generated artifact drift checker |
| [`../shared/references/stack_detection.md`](../shared/references/stack_detection.md) | Shared surface detection |
| [`../shared/references/phase_detection.md`](../shared/references/phase_detection.md) | Lifecycle placement for the quality gate |
| [`../shared/references/universal/code_quality_standards.md`](../shared/references/universal/code_quality_standards.md) | Universal quality standards |
