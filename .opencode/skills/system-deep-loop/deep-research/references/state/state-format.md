---
title: State Format Reference
description: Live state packet hub for the deep-research loop.
trigger_phrases:
  - "research state format"
  - "research state packet hub"
  - "research file ownership model"
  - "research file protection rules"
  - "research packet location"
importance_tier: important
contextType: implementation
version: 1.14.0.30
---

# State Format Reference

Live state packet hub for deep-research files, mutability, and routed state references.

---

## 1. OVERVIEW

### Purpose

Summarize the live deep-research packet files, mutability rules, and focused state references without carrying every JSON shape inline.

### When to Use

Load this hub when navigating packet files, deciding file ownership, or choosing which detailed state reference to load next.

### Routed Details

- `state-jsonl.md` for config, iteration, event, lifecycle, graph, and blocked-stop records.
- `state-outputs.md` for strategy, iteration markdown, `research.md`, dashboard, and resource-map output.
- `state-reducer-registry.md` for reducer ownership, findings registry, validation, reconstruction, and file protection.

For iterative code review state, use `deep-review`. Review-mode state is not part of this skill's live state contract.

### Packet Summary

The deep-research loop persists continuity in packet files so each iteration can run with fresh context.

| File | Format | Purpose | Mutability |
|------|--------|---------|------------|
| `deep-research-config.json` | JSON | Loop parameters and lineage | Created at init; read-only after |
| `deep-research-state.jsonl` | JSONL | Append-only structured log | Append-only |
| `deep-research-strategy.md` | Markdown | Current research plan and next focus | Reducer-managed sections |
| `deep-research-findings-registry.json` / `findings-registry.json` | JSON | Reducer-owned findings and question state | Auto-generated |
| `deep-research-dashboard.md` | Markdown | Operator summary | Auto-generated |
| `iterations/iteration-NNN.md` | Markdown | Per-iteration narrative | Write-once |
| `deltas/iter-NNN.jsonl` | JSONL | Per-iteration structured delta | Write-once |
| `research.md` | Markdown | Final/progressive synthesis | Workflow-owned |
| `resource-map.md` | Markdown | Optional evidence-derived resource map | Workflow-owned |

The artifact directory is resolved by `resolveArtifactRoot(specFolder, 'research')` from `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs`.

---

## 2. PACKET LOCATION

Root specs use:

```text
{spec_folder}/research/
```

Child-phase and sub-phase targets use flat-first behavior:

- first run with an empty local `research/` directory writes flat at `{spec_folder}/research/`;
- a `{basename(spec_folder)}-pt-NN` subfolder is allocated only when prior content already exists for a non-matching target;
- continuation runs reuse the existing matching packet.

This avoids an unnecessary `pt-01` wrapper on first runs.

**Example (first run on a child phase):** `.../026-graph.../019-system-hardening/001-initial-research/004-desc-regen/` writes to `004-desc-regen/research/` directly.

**Example (subsequent run with prior content for a different target):** `004-desc-regen/research/004-desc-regen-pt-02/` (pt-NN allocated as a sibling to the prior content).

---

## 3. OWNERSHIP MODEL

| Owner | Writes |
|-------|--------|
| Agent iteration | `iterations/iteration-NNN.md`, JSONL iteration/event append, optional progressive synthesis contribution |
| Workflow reducer | strategy machine-owned sections, findings registry, dashboard |
| Workflow synthesis | `research.md`, lifecycle snapshots |
| Spec anchoring protocol | bounded `spec.md` seed/context/fenced findings block |

The reducer is the source of truth for derived state. Manual edits to reducer-owned outputs are overwritten on the next refresh.

---

## 4. FILE PROTECTION

| Protection | Meaning |
|------------|---------|
| `immutable` | Created once and not modified after init |
| `append-only` | New JSONL records may be appended; existing records are not rewritten |
| `write-once` | Each iteration artifact is created once |
| `mutable` | Workflow may update the file under defined ownership rules |
| `auto-generated` | Reducer/workflow regenerates the full file |

The config file carries the protection map; details live in `state-reducer-registry.md`.

---

## 5. ROUTED REFERENCES

| Resource | Use When |
|----------|----------|
| `state-jsonl.md` | Need the JSONL config, iteration, event, lineage, graph, or blocked-stop schemas |
| `state-outputs.md` | Need markdown output structure for strategy, iterations, dashboard, research synthesis, or resource map |
| `state-reducer-registry.md` | Need reducer ownership, registry schema, validation, fault tolerance, or reconstruction |
| `../convergence/convergence.md` | Need STOP contract and legal-stop semantics |
| `../protocol/spec-check-protocol.md` | Need bounded `spec.md` anchoring and generated-fence write-back |

---

## 6. NON-GOALS

- Do not document `deep-review` state here; route to the sibling skill.
- Do not treat legacy aliases as write targets. The workflow reads legacy aliases only for migration windows and writes canonical `deep-research-*` names.
- Do not manually edit reducer-owned dashboard or registry files.

---

## 7. LEDGER VOCABULARY AND PROJECTION CEILING

### Registered vocabulary

The canonical dotted stems for this mode live in `.opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts`:

- `DeepResearchEventStems` — the registered stems the ledger accepts.
- `DEEP_RESEARCH_STEM_PRODUCERS` — one entry per stem recording whether a mechanical producer emits it today (`spoken`, with the producer files) or why nothing does (`reserved`).

`.opencode/skills/system-deep-loop/runtime/scripts/check-ledger-stem-producers.cjs` scans the workflow assets and runtime scripts and fails (exit 2) when a registered stem has no producer, a spoken stem has no emitter, or a reserved stem is emitted anyway.

### Which file is authoritative

`deep-research-state.jsonl` is authoritative while the mode's authority record (`authority-deep-research.json`, state `legacy_authoritative`) names the legacy writer. Once the record moves to `new_authoritative_reversible` or `new_authoritative_final` with `selectedWriter: "dark"`, the ledger is authoritative and the append gateway refreshes this file as a projection after each append.

### What a projection refresh can reproduce

The projection folds only registered stems, and its `run_initialized` arm rebuilds a thin config row: `type`, `topic`, `maxIterations`, `generation`, `timestamp`. A pre-flip config row written by the workflow carries more — `convergenceThreshold`, `minIterations`, `minIdeaObservations`, `antiConvergence`, `sessionId`, `executor`, `specFolder`, `createdAt` — and a refresh cannot rebuild those keys.

Because losing them silently would look like a complete projection, a replace that would drop keys from an existing `type: "config"` first row is refused with `ATTRIBUTION_COLLAPSE` (invariant `no-attribution-loss-on-replace`) before any bytes are written. An operator who hits it either migrates the attribution into a registered `deep_research.run_initialized` payload or moves the legacy file aside to accept the loss deliberately.
