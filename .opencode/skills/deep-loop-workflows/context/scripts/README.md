---
title: "deep-context scripts: Code README"
description: "Code-facing README for .opencode/skills/deep-loop-workflows/context/scripts — documents reduce-state.cjs, the agreement-weighted context reducer."
trigger_phrases:
  - "deep-context scripts"
  - "reduce-state deep-context"
---

# deep-context scripts

Operator and maintenance scripts for the `deep-context` skill.

---

## 1. OVERVIEW

### Purpose

This README documents the code-bearing folder `.opencode/skills/deep-loop-workflows/context/scripts` so operators can understand its role without opening every source file first. It follows the sk-doc skill README structure while staying focused on code navigation. Behavior details live in source comments; higher-level workflow details live in the owning `SKILL.md`.

### Usage

Use this file to identify the folder boundary, the verification path, and the local source files that follow sk-code conventions. Run scripts from the repository root with the documented arguments.

### Key Statistics

| Metric | Value |
|---|---:|
| Code files | 1 (`reduce-state.cjs`) |
| sk-code surface | OPENCODE |
| README scope | Direct files in this folder |

---

## 2. QUICK START

**Step 1: Confirm the owner.**

Start with `.opencode/skills/deep-loop-workflows/context/SKILL.md` for runtime routing and workflow boundaries.

**Step 2: Inspect the local code.**

```bash
rg --files .opencode/skills/deep-loop-workflows/context/scripts
```

Expected result: lists `reduce-state.cjs` and `README.md`.

**Step 3: Run the reducer.**

```bash
node .opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs <spec-folder>
```

Expected result: JSON summary written to stdout with `registryPath`, `dashboardPath`, `iterationsCompleted`, `findings`, `agreementEligible`, `contradictions`, and `corruptionCount`. Also writes `context/findings-registry.json` and `context/deep-context-dashboard.md` under the spec folder.

**Step 4: Verify syntax.**

```bash
node --check .opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs && echo "SYNTAX OK"
```

---

## 3. FEATURES

| Feature | What It Does |
|---|---|
| Agreement-weighted merge | Deduplicates seat findings by `unit_id`; boosts confidence by cross-executor agreement count |
| Contradiction detection | Surfaces incompatible `signature` or `reuse` verbs for the same `unit_id`; never auto-resolves |
| Findings registry | Writes agreement-weighted, sorted `context/findings-registry.json` for downstream consumers |
| Dashboard generation | Writes human-readable `context/deep-context-dashboard.md` with status, metrics, top reuse, contradictions, and graph signals |
| Idempotent output | Repeated calls on the same inputs produce identical outputs |
| Corrupt-line reporting | Reports corrupt JSONL lines with line number and error; partial runs surface rather than silently degrade |

---

## 4. STRUCTURE

| Path | Purpose |
|---|---|
| `reduce-state.cjs` | Agreement-weighted context reducer. Reads host-written state log + per-seat findings; writes registry and dashboard. |
| `README.md` | This file. |

---

## 5. CONFIGURATION

| Setting | Default | Purpose |
|---|---|---|
| sk-code surface | OPENCODE | Applies OpenCode JavaScript/CJS naming, header, error-handling, and type-discipline conventions |
| README scope | Direct folder | Documents this folder only, not sibling folders |

The reducer reads `relevanceGate` and `agreementMin` from `{spec_folder}/context/deep-context-config.json` at runtime. If the config file is absent or corrupt, it falls back to the defaults defined in the constants section of `reduce-state.cjs` (`DEFAULT_RELEVANCE_GATE = 0.55`, `DEFAULT_AGREEMENT_MIN = 2`).

**Non-configurable invariants**:
- The reducer is the host writer for `findings-registry.json` and `deep-context-dashboard.md`. Seats must never write these files.
- `unit_id = sha256(path:symbol:kind)` is the canonical dedup key. It matches the coverage-graph node id so registry and graph deduplicate the same unit.

---

## 6. USAGE EXAMPLES

**Reduce the current packet**

```text
User request: Run the reducer against my-feature context packet.
Command: node .opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs .opencode/specs/my-feature
Expected output: Updated findings-registry.json and deep-context-dashboard.md, plus a JSON summary on stdout.
```

**Dry-run without writing**

The reducer does not expose a `--dry-run` flag yet. To inspect without writing, call `reduceContextState(specFolder, { write: false })` from within Node:

```bash
node -e "
const { reduceContextState } = require('./.opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs');
const r = reduceContextState('.opencode/specs/my-feature', { write: false });
console.log(JSON.stringify(r.registry.metrics, null, 2));
"
```

---

## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| `reducer failed: ENOENT` | `deep-context-state.jsonl` or `seats/` directory does not exist | Run at least one iteration before reducing; check the spec-folder path |
| `corruptionCount > 0` in output | One or more JSONL lines could not be parsed | Inspect `deep-context-state.jsonl`; remove the corrupt line and re-run |
| Registry is empty | No seat findings exist under `seats/` | Verify that at least one iteration completed and seats wrote their output JSON files |
| Dashboard is stale | Reducer was not re-run after new iterations | Re-run the reducer; it is idempotent and safe to call any time |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`deep-context/SKILL.md`](../SKILL.md) | Runtime instructions for the owning skill |
| [`deep-context/README.md`](../README.md) | Human-facing skill overview |
| [`deep-context/references/protocol/loop_protocol.md`](../references/protocol/loop_protocol.md) | Iteration lifecycle and host-writes-state invariant |
| [`sk-code/SKILL.md`](../../sk-code/SKILL.md) | OpenCode coding standards and verification routing |
| [`sk-doc/assets/skill/skill_readme_template.md`](../../sk-doc/assets/skill/skill_readme_template.md) | README structure used for this code README |
