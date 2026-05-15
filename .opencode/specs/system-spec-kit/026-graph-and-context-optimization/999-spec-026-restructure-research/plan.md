---
title: "Plan: 999 — 026 restructure research"
description: "Sequenced plan for the 40-iter cli-devin SWE-1.6 deep-research dispatch and the synthesis pass that produces the architecture / resource-map deliverable."
trigger_phrases:
  - "999 plan"
  - "026 restructure plan"
  - "40-iter cli-devin plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research"
    last_updated_at: "2026-05-15T21:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored plan.md"
    next_safe_action: "Invoke /spec_kit:deep-research:auto"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:5e54e0a4c0a4f08a9f9eaa6f4f88b6e2b5fb1c5d4c2a8f7e2e0c8a5d4f3b2a1c"
      session_id: "999-plan"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: 999 — 026 restructure research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Three phases executed in sequence on `main`:

1. **Dispatch** — invoke `/spec_kit:deep-research:auto` with PRE-BOUND ANSWERS so the loop runs unattended for 40 iter against cli-devin / SWE-1.6.
2. **Synthesis** — when the loop completes, run the synthesis pass to produce `research/research.md`.
3. **Resource map authoring** — read the synthesized research and author `resource-map.md` containing the proposed 026 target-state architecture.

The synthesis output feeds a follow-on restructure packet that executes the merge / delete / rename operations. This 999 packet is read-only on the rest of the codebase and gets deleted by the follow-on.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check |
|------|-------|
| Per-iter | `iteration-NNN.md` ≥ 1000 bytes; JSONL row appended |
| Per-iter | git commit landed on main |
| Loop end | 40 iter files exist; JSONL has 40 rows |
| Synthesis | `research.md` exists; cites every iter |
| Resource map | `resource-map.md` authored with all required sections; sk-doc validate passes |
| Packet | strict-validate exits 0 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
999-spec-026-restructure-research/
├── spec.md
├── plan.md
├── tasks.md
├── implementation-summary.md
├── description.json
├── graph-metadata.json
├── resource-map.md            (authored in Phase 3)
└── research/
    ├── deep-research-config.json   (created by /spec_kit:deep-research)
    ├── deep-research-state.jsonl   (40 rows; per-iter delta)
    ├── research.md                 (synthesis output, Phase 2)
    ├── iterations/
    │   ├── iteration-001.md
    │   ├── ...
    │   └── iteration-040.md
    └── prompts/
        ├── iteration-001.md        (rendered iter prompt)
        ├── agent-config-iter-001.json  (substituted recipe)
        └── ...
```

The `agent-config-iter-NNN.json` files are temp substitutions of `agent-config-deep-research-iter.json` (with `<repo-root>` resolved) — co-located with the rendered iter prompts per the `if_cli_devin:` YAML wiring shipped in packet 059.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Deep-research dispatch

Invocation:

```
/spec_kit:deep-research:auto Refactor and consolidate 026 graph-and-context-optimization. Analyze every direct child of .opencode/specs/system-spec-kit/026-graph-and-context-optimization/. For each child, score still-load-bearing / merge-candidate / delete-candidate. Propose a target restructure optimized for historic recall.

PRE-BOUND SETUP ANSWERS:
  research_topic: 026 graph-and-context-optimization restructure for historic recall
  spec_folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research
  execution_mode: AUTONOMOUS
  maxIterations: 40
  convergenceThreshold: 0.0
  executor: cli-devin
  executor_model: swe-1.6
  executor_timeout: 1200
  resource_map_emit: true
```

**Track distribution** (40 iter spread across 10 thematic tracks):

| Track | Iter share | Focus |
|------:|-----------:|-------|
| 1 | 6 | Direct-child packet inventory: read every 026/NNN-name/ folder, classify status + size + last activity |
| 2 | 4 | Phase-parent (014-local-llama-cpp) deep-read: read every nested child under 014 since that's where the 056-059 arc lives |
| 3 | 4 | Phase-parent (013-doctor-update-orchestrator) deep-read: doctor consolidation arc |
| 4 | 4 | Phase-parent (007-code-graph) deep-read: code-graph extraction arc |
| 5 | 4 | Phase-parent (009-hook-parity) deep-read: hook-parity arc |
| 6 | 4 | Cross-packet duplicate detection: which children solve overlapping problems and should merge |
| 7 | 4 | Stale-context detection: which children are completed and unreferenced (delete candidates) |
| 8 | 4 | Naming-quality audit: do current phase names accurately describe the work that landed |
| 9 | 4 | Target-state proposal: based on tracks 1-8, propose the consolidated phase list with clear names |
| 10 | 2 | Resource-map structure: how should the phase-parent's spec.md + resource-map.md + graph-metadata.json be reorganized for resume / search / graph traversal |

### Phase 2 — Synthesis

After all 40 iter commit, run one final cli-devin SWE-1.6 dispatch that reads `research/iterations/iteration-001.md` through `iteration-040.md` plus `research/deep-research-state.jsonl`, and emits `research/research.md` consolidated by track / theme, with per-finding iter citation.

The synthesis dispatch uses the synthesis recipe (`agent-config-synthesis.json`) per the iter contract.

### Phase 3 — Resource map authoring

Main agent reads `research/research.md` and authors `resource-map.md` containing:

1. **Current state** — table of all 22 current children with size, status, last-activity, classification
2. **Proposed state** — target phase list with each phase's name, description, constituent children, deletions, renames
3. **Migration plan** — order of operations for the follow-on restructure packet
4. **Recall optimization** — proof points: sample queries with target lookup paths
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Read-only research packet — no automated tests. Verification surfaces:

- Per-iter post-dispatch validator (built into `/spec_kit:deep-research`): asserts `iteration-NNN.md` exists, JSONL row appended, required fields present
- Synthesis citation density: `grep` iter numbers in `research.md`; must hit every iter
- Resource-map structural validate via sk-doc
- Packet strict-validate
- Sample-query proof points authored in the resource-map (manual verification)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Packet 059 shipped surfaces**:
  - cli-devin SWE-1.6 deep-loop iter contract — `.opencode/skills/cli-devin/references/deep-loop-iter-contract.md`
  - `agent-config-deep-research-iter.json` recipe (research-iter profile)
  - `agent-config-synthesis.json` recipe (synthesis profile)
  - `if_cli_devin:` branches in `spec_kit_deep-research_auto.yaml` with `--agent-config` wiring
- **Validator**: `executor-config.ts:7` accepts `cli-devin` (already shipped)
- **HEAD baseline**: `40eaf8007` (packet 059 follow-on)
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This packet is read-only on the rest of the codebase. Rollback options:

1. **Cancel mid-run** — kill the iter dispatch; `research/` dir survives with committed iters; resume later or scrap
2. **Discard the packet entirely** — `git rm -rf 999-spec-026-restructure-research/`; other 026 children unaffected
3. **Disagree with the proposal** — do not execute the follow-on restructure packet; the resource-map is advisory

Recovery baseline: HEAD = `40eaf8007`. Any phase rolls back here.
<!-- /ANCHOR:rollback -->
