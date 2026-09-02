---
title: "Implementation Plan: Phase 6: legacy-memory-surface-inventory"
description: "How the five-iteration inventory run was configured, how the scan classified what it found and where the resulting artifacts live."
trigger_phrases:
  - "inventory research plan"
  - "detached lineage"
  - "ripgrep json scan"
  - "lifecycle classification"
  - "luna-max lineage"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: legacy-memory-surface-inventory

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep research loop, `rg --json` scanning, JSON artifacts |
| **Framework** | `/deep:research` fan-out, one detached lineage named `luna-max` |
| **Storage** | Lineage-local files under `research/lineages/luna-max/` |
| **Testing** | Scan-to-artifact parity audit, no repository test suite run |

### Overview

Five forced iterations ran on a single executor, `cli-codex` with model `gpt-5.6-luna` at max reasoning on the fast service tier, under stop policy `max-iterations` with convergence recorded as telemetry only. The lineage was detached, so every write landed inside its own directory and no parent document, memory database or git index was touched. Each iteration widened the search axis, and the fifth closed with an exact-query parity audit against the artifact.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Detached research lineage. One executor, five iterations, all artifacts lineage-local.

### Key Components

- **The scan**: `rg --json` with `--ignore-case` and `--no-ignore-global`. JSON event parsing keeps colon-containing paths intact, which a colon-delimited scan had previously broken. The global ignore was bypassed because it was hiding root `opencode.json` and `.utcp_config.json`.
- **Exclusions**: `.git`, `node_modules`, `z_archive`, the lineage itself and the whole `.opencode/skills/system-spec-kit/mcp-server` tree.
- **The aggregate**: the mcp-server tree is censused separately and represented as one entry, per the operator topic, so the tree being deleted does not flood the consumer counts.
- **Lifecycle classification**: structural and conservative. Paths under runs, research, reports, reviews, deltas, archive, fixtures, snapshots and JSONL read as historical narrative, and everything else reads as live instruction or implementation. The label is triage, not a semantic claim.
- **The artifacts**: `research/lineages/luna-max/iterations/iteration-001.md` through `iteration-005.md`, the synthesis at `research/lineages/luna-max/research.md` and the row-level inventory at `research/lineages/luna-max/inventory.external.json`.

### Data Flow

Repository files feed the ripgrep scan, the scan feeds per-row classification into `inventory.external.json`, and the artifact feeds the counts, worklists and preserve set written into `research.md`. The synthesis tables are summaries. The row artifact is authoritative.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No repository test suite was run, because the lineage was forbidden repository tooling and out-of-scope writes. The gate was a scan-to-artifact parity audit instead. The implementation phases own the runtime and test gates.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The run configuration is frozen at `research/deep-research-config.json`. Phases 002 and 003 consume the worklists.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Nothing outside the lineage directory was modified, so reverting means deleting `research/lineages/luna-max/`. The 69 MB `inventory.external.json` stays out of git by design, which means it is reproducible from the recorded scan rather than recoverable from history.
<!-- /ANCHOR:rollback -->

---
