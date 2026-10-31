---
title: "Implementation Plan: v4 state inventory research"
description: "Two lineages, cli-codex GPT-5.6 Luna and cli-devin DeepSeek V4 Flash, run the deep-research loop for ten iterations each over the repository and the old changelog draft, then this session merges and reproduces."
trigger_phrases:
  - "research lane execution plan"
  - "fanout run two lineages"
  - "luna and deepseek research"
  - "v4 state inventory research"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: v4 state inventory research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON registries, TypeScript runtime as ground truth |
| **Framework** | system-deep-loop research mode via fanout-run.cjs |
| **Storage** | JSONL state under research/ |
| **Testing** | Reproduction by hand in this session |

### Overview
Two lineages run in parallel with concurrency two: `luna` on cli-codex (`gpt-5.6-luna`, `xhigh`, fast tier) and `deepseek` on cli-devin (`deepseek-v4-flash-max`, `dangerous` permission mode so the leaf can read and run its own checks). Each takes one angle per iteration from the shared charter, reads registries and code rather than READMEs, and writes rows with citations. After both lanes finish, this session merges the two `research.md` files into one inventory and one drift table, reproduces every P0 and P1 row, and hands the confirmed table to the rewrite child.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Both CLIs present on PATH and authenticated (`codex login status`, `devin auth status`)
- [x] The charter names the ten angles and the ground-truth files per angle
- [x] The parent's Gate 3 answer binds writes to this child's `research/`

### Definition of Done
- [x] Ten iteration files and ten state events per lane
- [x] `research/research.md` merged with the inventory and the drift table
- [x] Every P0 and P1 drift row reproduced or dropped with a note
- [x] `validate.sh --strict` passes on this child and the parent
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Components

| Component | Role |
|-----------|------|
| `fanout-run.cjs` | Owns process construction, the per-lineage state ledger, the reducer and synthesis |
| `luna` lineage | cli-codex, read-only sandbox, one iteration per dispatch |
| `deepseek` lineage | cli-devin, one iteration per dispatch |
| This session | Charter author, monitor, merger, reproducer |

### Data Flow
Charter → per-iteration prompt pack → leaf reads repository → iteration file + JSONL event → reducer dashboard → per-lane research.md → merged research.md → confirmed table.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. PHASES

| Phase | Work | Output |
|-------|------|--------|
| 1 Setup | Planning docs, charter, launch script, CLI probes | `scratch/launch-research.sh`, `scratch/topic.txt` |
| 2 Run | Launch both lanes detached; monitor; resume on silence | `research/lineages/{luna,deepseek}/` |
| 3 Merge | Merge the two lane outputs; reproduce; write the confirmed table | `research/research.md`, `research/confirmed-drift.md` |
| 4 Close | Validate, regenerate metadata, update the parent map and timeline | metadata pair, parent `spec.md`, `timeline.md` |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Iteration count and event count by listing, per lane
- Each drift row opened at both cited lines in this session
- Inventory rows spot-checked against `mode-registry.json`, `hub-router.json` and the command directory, not against READMEs
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:rollback -->
## 6. ROLLBACK

Research is read-only outside `research/`; deleting this child's `research/` directory restores the pre-run state.
<!-- /ANCHOR:rollback -->
