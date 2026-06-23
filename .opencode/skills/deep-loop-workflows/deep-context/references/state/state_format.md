---
title: State Format Reference
description: Live state packet hub for the deep-context loop.
trigger_phrases:
  - "deep-context packet files"
  - "context state file ownership"
  - "context packet hub"
  - "context file protection rules"
importance_tier: normal
contextType: implementation
version: 1.2.0.3
---

# State Format Reference

Live state packet hub for deep-context files, ownership, mutability, and routed state references.

---

## 1. OVERVIEW

### Purpose

Summarize the live deep-context packet files, their owner (host / reducer / per-seat), mutability, and what each holds — without carrying every JSON shape inline.

### When to Use

Load this hub when navigating packet files, deciding file ownership, or choosing which detailed state reference to load next.

### Core Principle

Seats are read-only analyzers; the host writes ALL merged state and the reducer derives registry and dashboard from raw state. Ownership decides who may write a file.

### Routed Details

- `state_jsonl.md` for the `deep-context-state.jsonl` config, iteration, event, and lifecycle records.
- `state_outputs.md` for strategy, iteration markdown, dashboard, deltas, and the Context Report outputs.
- `state_reducer_registry.md` for reducer ownership, the findings-registry schema, agreement weighting, and runtime robustness.

For iterative code review state use `deep-review`; for autonomous investigation state use `deep-research`. Neither is part of this skill's live state contract.

### Packet Summary

The deep-context loop persists continuity in packet files so each parallel sweep can run with fresh context.

| File | Format | Owner | Purpose | Mutability |
|------|--------|-------|---------|------------|
| `deep-context-config.json` | JSON | Host (init) | Run config: scope, pool, thresholds, lineage | Created at init; read-only after (status flips to `complete` at synthesis) |
| `deep-context-state.jsonl` | JSONL | Host (append) | Append-only structured state log | Append-only |
| `deep-context-strategy.md` | Markdown | Host | Scope, seeded frontier, pool roster, next focus | Mutable (host-managed sections) |
| `iterations/iteration-NNN.md` | Markdown | Host | Per-sweep narrative | Write-once |
| `deltas/iter-NNN.jsonl` | JSONL | Host | Per-iteration structured delta stream | Write-once |
| `seats/iter-NNN/{label}.json` | JSON | Per-seat (host-collected) | Raw per-seat structured findings | Write-once per seat |
| `findings-registry.json` | JSON | Reducer | Merged, deduped, agreement-weighted findings | Auto-generated |
| `deep-context-dashboard.md` | Markdown | Reducer | Operator progress view | Auto-generated |
| `context-report.md` + `.json` | Markdown + JSON | Host (synthesis) | The reuse-first deliverable | Workflow-owned |
| `prompts/iter-NNN/{label}.md` | Markdown | Host | Rendered per-seat prompt for the shared focus | Write-once per seat |
| `.deep-context.lock` | sentinel | Host | Single-writer advisory lock | Lifecycle-managed |
| `.deep-context-pause` | sentinel | Operator | Pause signal honored before each sweep | Operator-created |

The artifact directory is resolved by `resolveArtifactRoot(specFolder, 'context')` from `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs`.

---

## 2. PACKET LOCATION

Root specs keep context artifacts directly in:

```text
{spec_folder}/context/
```

Child-phase and sub-phase targets keep local packet dirs in `{spec_folder}/context/{packet}/`, and archives stay local at `{spec_folder}/context_archive/{packet}/`. The local packet subfolder is `{ownerSlug}-pt-NN` when prior content already exists for a non-matching target; otherwise the run writes flat at `{spec_folder}/context/`.

When no spec folder exists yet, the host uses a standalone run dir and hands `context-report.md` to `/speckit:plan`.

---

## 3. OWNERSHIP MODEL

| Owner | Writes |
|-------|--------|
| Host (`/deep:context` command / `@deep-context` orchestrator) | config, state-log appends, strategy, iteration markdown, deltas, collected seat files, the Context Report and its JSON companion, coverage-graph upserts |
| Reducer (`scripts/reduce-state.cjs`) | `findings-registry.json`, `deep-context-dashboard.md` |
| Per-seat analyzer | only its own `seats/iter-NNN/{label}.json` (returned to the host, written by the host) |

The host is the ONLY writer of merged state — this keeps the loop Gate-3-safe even when CLI seats run with permissive sandboxes. The reducer is the source of truth for derived state; manual edits to reducer-owned outputs are overwritten on the next refresh.

---

## 4. FILE PROTECTION

| Protection | Meaning |
|------------|---------|
| `immutable` | Created once at init; not modified after (config only flips `status` to `complete`) |
| `append-only` | New JSONL records may be appended; existing records are not rewritten |
| `write-once` | Each iteration / delta / seat artifact is created once |
| `mutable` | Host may update under defined ownership rules (strategy) |
| `auto-generated` | Reducer regenerates the full file (registry, dashboard) |

Read-only seats, host-writes-state, and per-seat artifact isolation are the reliability invariants enforced across these files. See `../protocol/loop_protocol.md` §9.

---

## 5. ROUTED REFERENCES

| Resource | Use When |
|----------|----------|
| `state_jsonl.md` | Need the JSONL config, iteration, event, or lifecycle record shapes |
| `state_outputs.md` | Need markdown output structure for strategy, iterations, dashboard, deltas, or the Context Report |
| `state_reducer_registry.md` | Need reducer ownership, registry schema, agreement weighting, contradiction surfacing, or runtime robustness |
| `../protocol/loop_protocol.md` | Need the iteration lifecycle, parallel-sweep mechanics, merge rules, and packet layout |
| `../convergence/convergence.md` | Need the convergence signal table and STOP / STOP_BLOCKED contract |
| `../../assets/deep_context_config.json` | Need the config template and default pool / thresholds |
| `../../assets/context_report_template.md` | Need the Context Report section order and field schemas |

---

## 6. NON-GOALS

- Do not document `deep-review` or `deep-research` state here; route to the sibling skill.
- Do not manually edit reducer-owned `findings-registry.json` or `deep-context-dashboard.md`.
- Do not let a seat write merged state, the shared strategy, or the report.
