---
title: Destructive Scope Violations under cli-opencode Deep-Loop Dispatch (RM-8)
description: Root cause + prevention for destructive filesystem writes when cli-opencode dispatches a long-running model (e.g. deepseek-v4-pro under /deep:review:auto) and the model hallucinates a cleanup action.
trigger_phrases:
  - "opencode destructive scope violation"
  - "opencode deep-loop dispatch safety"
  - "dangerously skip permissions risk"
  - "opencode worktree isolation dispatch"
  - "rm-8 prevention playbook"
importance_tier: important
contextType: implementation
version: 1.3.0.7
---

# Destructive Scope Violations under cli-opencode Deep-Loop Dispatch (RM-8)

This document records the **2026-05-04 destructive scope violation incident**, the **root cause**, and the **prevention playbook** every caller of cli-opencode (and any deep-loop dispatch wrapper that drives `opencode run`) must apply.

---

## 1. OVERVIEW

### Purpose

Record the 2026-05-04 destructive scope violation (RM-8), explain its root cause, and provide the prevention playbook so the same uncontrolled-deletion failure cannot recur on a cli-opencode deep-loop dispatch.

### When to Use

Read this before any non-interactive `opencode run` deep-loop dispatch that uses `--dangerously-skip-permissions` against a populated worktree, especially long-running `/deep:research:auto` and `/deep:review:auto` runs.

### Core Principle

An instruction-only scope guard layered on `--dangerously-skip-permissions` is the root cause; neither layer alone is sufficient, so prevention must add an enforced capability boundary, not more prose.

---

## 2. INCIDENT (2026-05-04)

Source-of-truth: local destructive-scope violation policy.

- **What ran**: `/deep:review:auto` against a phase parent across two of its phase children.
- **Executor**: cli-opencode (`opencode run`) with `--model opencode-go/deepseek-v4-pro --variant high --dangerously-skip-permissions --pure --dir <repo-root>`.
- **Damage**: **44 files deleted** across the two phase children. Spec docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`) **and** the `review/` packet subtrees were physically removed.
- **Recovery**: `git restore` from commit `7beb80769` (a pre-dispatch "bundled session sync") — single command. **No findings lost**, but ≈30 minutes of recovery time and trust damage.

The deep-review skill is contractually read-only on its target spec docs. DeepSeek violated that contract.

---

## 3. ROOT CAUSE

Two contributing layers, both required to enable the failure:

### Layer A — unrestricted filesystem write capability

The YAML dispatch wrapper (`.opencode/commands/deep/assets/deep_review_auto.yaml` step `if_cli_opencode`) hands the executor:

```bash
opencode run \
  --model "<provider/model>" \
  --agent general \
  --format json \
  --dangerously-skip-permissions \
  --pure \
  --dir "<repo-root>" \
  --variant <effort> \
  "<rendered prompt>" \
  </dev/null
```

`--dangerously-skip-permissions` disables OpenCode's per-tool-call permission prompts. Combined with `--dir <repo-root>` the executor's working directory is the live worktree, and it can `rm`, `mv`, or overwrite **any** file the running user has permissions for.

### Layer B — instruction-only guard

Before the RM-8 mitigation shipped, the only safeguard against the model was a single prose line in `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl` §CONSTRAINTS:

> "Review target is READ-ONLY. Do not modify reviewed files."

That line **is not enforced anywhere**. The harness reads it as documentation; OpenCode doesn't parse it; nothing inspects the executor's tool calls against it before they run. A confused model (DeepSeek hallucinated a cleanup step, plausibly anchored on stale spec-folder pointers it found while reading) can simply ignore the instruction and the harness has no way to stop it.

**The combination — instruction-only guard layered on `--dangerously-skip-permissions` — is the root cause.** Neither layer alone is sufficient to cause the damage (model would refuse harmless instruction-only with permission prompts; permission-skipped dispatches with a runtime guard would survive a confused model). Both together produced the destructive event.

---

## 4. PREVENTION — APPLY BEFORE EVERY DEEP-LOOP DISPATCH

The default risk surface for cli-opencode is **any non-interactive `opencode run` invocation that uses `--dangerously-skip-permissions` against a populated worktree**, especially long-running deep-loop dispatches like `/deep:research:auto` and `/deep:review:auto`. Apply all four layers before dispatch:

### Layer 1 (REQUIRED) — RM-8 prompt hardening, already shipped

`.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl` §CONSTRAINTS now includes:

- An **ALLOWED WRITE PATHS** list enumerating the five state-path tokens (`{state_paths_iteration_pattern}`, `{state_paths_state_log}`, `{state_paths_delta_pattern}`, `{state_paths_strategy}`, `{state_paths_findings_registry}`)
- A **BANNED OPERATIONS** list naming `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, and shell output-redirect truncate `>` against any non-allowed path
- A **SCOPE VIOLATION PROTOCOL**: a would-be out-of-scope mutation MUST be recorded as a `scope_violation` finding under `## SCOPE VIOLATIONS` heading instead of executed

This is instruction-side mitigation. It tightens the guard but does NOT remove the underlying capability. Confirm the dispatched prompt contains these strings literally before relying on this layer alone.

Policy record: local destructive-scope violation policy.

### Layer 2 (STRONGLY RECOMMENDED) — git worktree isolation

Dispatch into a `git worktree` cloned from current HEAD instead of the live worktree. Any scope violation is contained to the isolated worktree (deletable as a single directory). Main repo is physically untouched because the executor's `--dir` is the worktree path.

```bash
# Cut a worktree from the recovery-baseline commit
git worktree add --detach /Users/<you>/MEGA/Development/Code_Environment/<short-name>-review HEAD

# Dispatch INSIDE the worktree
opencode run \
  --model deepseek/deepseek-v4-pro \
  --agent general \
  --variant high \
  --format json \
  --dangerously-skip-permissions \
  --pure \
  --dir /Users/<you>/MEGA/Development/Code_Environment/<short-name>-review \
  --variant high \
  "<prompt>" \
  </dev/null

# On success: copy review/ artifacts back, prune worktree
# On destruction: nothing to do — main repo never saw the writes
git worktree remove --force /Users/<you>/MEGA/Development/Code_Environment/<short-name>-review
```

Worktree isolation is the cheapest single change that converts "deletion of N tracked files in main" into "deletion of N tracked files in throwaway worktree". For multi-phase work (the exact shape of the 2026-05-04 incident), worktrees are not optional.

### Layer 3 (REQUIRED) — commit-before-dispatch safety net

Before dispatching, commit any in-flight working-tree state on `main`. Even with Layer 2, a commit guarantees `git restore` is a one-command recovery if anything escapes the worktree (or if your own orchestration overwrites files in main during artifact sync-back).

```bash
git status --short
git add <relevant-paths>
git commit -m "chore(wip): snapshot in-flight work before deep-loop dispatch on <target>"
```

The commit hash is the recovery baseline. Surface it to the operator before dispatch.

### Layer 4 (FALLBACK) — model selection

The 2026-05-04 incident was specifically observed with `opencode-go/deepseek-v4-pro` under `/deep:review:auto`. Until a runtime scope guard ships (see §5), the cross-phase synthesis recommendation stands: **for multi-phase deep-review work, prefer `cli-copilot` with `gpt-5.5 --reasoning-effort high`** when available, and fall back to deepseek only with Layers 1+2+3 all in place. Memory feedback `feedback_copilot_concurrency_override.md` caps Copilot at 3 parallel dispatches; sequence the work accordingly.

---

## 5. OUT OF SCOPE — RUNTIME SCOPE GUARD (future work)

The true RM-8 fix is a runtime scope guard:

- Pre-dispatch: snapshot the file tree (`git ls-tree -r HEAD` or `find ... -type f -printf '%P %s %T@\n'`)
- During dispatch: rely on Layers 1–3 only
- Post-dispatch: diff the file tree; any modification outside the allowed-write list is reverted via `git restore` and surfaced as a `scope_violation` event

This requires changes to the YAML wrapper (pre/post hooks) and is a separate packet. Layer 1 + 2 + 3 are the operational ceiling until the runtime guard ships.

---

## 6. QUICK CHECKLIST BEFORE DISPATCH

- [ ] Layer 1: rendered prompt contains literal `BANNED OPERATIONS` and `ALLOWED WRITE PATHS` strings (grep the rendered prompt before dispatch).
- [ ] Layer 2: dispatch `--dir` points at a `git worktree`, not the live working tree.
- [ ] Layer 3: `git status` clean OR working tree committed; recovery commit hash recorded.
- [ ] Layer 4: model+executor pairing matches risk tolerance for the target shape (single child = lower risk; phase parent with multiple children = higher risk, prefer copilot or pair with all of Layers 1–3).

---

## 7. RELATED MATERIAL

- **Incident source**: local destructive-scope violation policy
- **RM-8 hardening context**: local destructive-scope violation policy
- **Hardened prompt template**: `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl` §CONSTRAINTS
- **YAML dispatch surface**: `.opencode/commands/deep/assets/deep_review_auto.yaml` step `if_cli_opencode`
- **Memory feedback**: `feedback_opencode_run_requires_dev_null_stdin.md`, `feedback_opencode_provider_fallback.md`, `feedback_cli_executor_only_when_requested.md`
