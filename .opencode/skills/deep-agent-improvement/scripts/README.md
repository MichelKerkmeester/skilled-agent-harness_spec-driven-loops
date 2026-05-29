---
title: "deep agent improvement scripts: Code README"
description: "Code-facing README for .opencode/skills/deep-agent-improvement/scripts."
trigger_phrases:
  - "deep-agent-improvement scripts"
  - "code README"
---

# deep agent improvement scripts

Operator and maintenance scripts for this skill.

---

## 1. OVERVIEW

### Purpose

This README documents the code-bearing folder `.opencode/skills/deep-agent-improvement/scripts` so operators can understand its role without opening every source file first. It follows the sk-doc skill README structure while staying focused on code navigation.

### Usage

Use this file to identify the folder boundary, the likely verification path, and the local source files that need sk-code conventions. Keep behavior details in source comments and higher-level workflow details in the owning `SKILL.md`.

### Key Statistics

| Metric | Value |
|---|---:|
| Code files (lane-separated) | 16 |
| Lane subtrees | `agent-improvement/` (8), `model-benchmark/` (2 + `scorer/`), `shared/` (6) |
| Subtrees | `model-benchmark/scorer/` (ported 120/003 5-dim scorer, det-checks, grader, cache); `lib/` (shared CJS modules, stays at root) |
| README scope | Direct files in this folder |
| Audit context | Internal validation notes |

---

## 2. QUICK START

**Step 1: Confirm the owner.**

Start with `.opencode/skills/deep-agent-improvement/SKILL.md` for runtime routing and workflow boundaries.

**Step 2: Inspect the local code.**

```bash
rg --files .opencode/skills/deep-agent-improvement/scripts
```

Expected result: the command lists the source files summarized below.

**Step 3: Verify changes.**

Run individual scripts from the repository root with the documented arguments.

---

## 3. FEATURES

| Feature | What It Does |
|---|---|
| Folder boundary | Documents direct code files under `scripts`. |
| sk-code alignment | Points reviewers at OpenCode naming, header, error-handling, and type-discipline checks. |
| Verification handoff | Records the expected owner and audit packet for follow-up work. |

---

## 4. STRUCTURE

| Path | Purpose |
|---|---|
| `agent-improvement/benchmark-stability.cjs` | Lane A: agent-improvement source file. |
| `agent-improvement/candidate-lineage.cjs` | Lane A: agent-improvement source file. |
| `agent-improvement/check-mirror-drift.cjs` | Lane A: agent-improvement source file. |
| `agent-improvement/generate-profile.cjs` | Lane A: agent-improvement source file. |
| `agent-improvement/rollback-candidate.cjs` | Lane A: agent-improvement source file. |
| `agent-improvement/scan-integration.cjs` | Lane A: agent-improvement source file. |
| `agent-improvement/score-candidate.cjs` | Lane A: dynamic-mode 5-dimension candidate scorer. |
| `agent-improvement/trade-off-detector.cjs` | Lane A: agent-improvement source file. |
| `model-benchmark/run-benchmark.cjs` | Lane B: fixture/integration scorer. `--scorer pattern` (default) or `5dim` (121/005 opt-in via `scorer/`). |
| `model-benchmark/dispatch-model.cjs` | Lane B: model-agnostic CLI dispatcher for model-benchmark mode, 121/003. |
| `model-benchmark/scorer/` | Lane B: ported 120/003 five-dimension scorer: `score-model-variant.cjs`, `deterministic/`, `grader/`, `lib/cache.cjs` (runtime `cache/` git-ignored). |
| `shared/loop-host.cjs` | Shared: mode-switching entry point (agent-improvement vs model-benchmark), 121/003. Resolves lane paths at spawn time. |
| `shared/improvement-journal.cjs` | Shared: source file used by both lanes. |
| `shared/materialize-benchmark-fixtures.cjs` | Shared: source file used by both lanes. |
| `shared/mutation-coverage.cjs` | Shared: source file used by both lanes. |
| `shared/promote-candidate.cjs` | Shared: guarded canonical mutation. |
| `shared/reduce-state.cjs` | Shared: dashboard + experiment registry reducer. |
| `lib/` | Stays at root: shared CJS modules (`typed-errors.cjs`, `promotion-gates.cjs`, `mirror-sync-verify.cjs`). |
| Additional files | `vitest.config.mjs`, `tests/` (vitest suites incl. remediation + opt-in-scorer) |

---

## 5. CONFIGURATION

| Setting | Default | Purpose |
|---|---|---|
| sk-code surface | OPENCODE | Applies OpenCode TypeScript, JavaScript, Python, Shell, and config conventions. |
| README scope | Direct folder | This file documents this folder, not sibling folders. |

---

## 6. USAGE EXAMPLES

**Audit this folder**

```text
User request: Check .opencode/skills/deep-agent-improvement/scripts for sk-code and README coverage.
Skill routing: sk-code plus sk-doc.
Expected output: Findings recorded in the 026 audit report.
```

---

## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| README appears stale | Source files changed after this audit | Refresh the structure table and rerun the 026 audit check. |
| Verification command is unclear | Folder is a helper boundary | Use the nearest package or skill-level verification command. |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`deep-agent-improvement/SKILL.md`](../SKILL.md) | Runtime instructions for the owning skill. |
| [`sk-code/SKILL.md`](../../sk-code/SKILL.md) | OpenCode coding standards and verification routing. |
| [`sk-doc skill_readme_template.md`](../../sk-doc/assets/skill/skill_readme_template.md) | README structure used for this code README. |
