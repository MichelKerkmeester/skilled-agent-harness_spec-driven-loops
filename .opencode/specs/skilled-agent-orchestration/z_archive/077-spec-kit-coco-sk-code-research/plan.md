---
title: "Implementation Plan: 077 Deep Research on system-spec-kit + mcp-coco-index + sk-code OpenCode"
description: "Init the deep-research packet, dispatch 10 cli-codex iterations, synthesize research.md + resource-map.md, validate, commit, save memory."
trigger_phrases: ["077 plan"]
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/077-spec-kit-coco-sk-code-research"
    last_updated_at: "2026-05-05T17:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "10-iter loop complete; research.md synthesized"
    next_safe_action: "Validate + commit + memory save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "077-final"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 077 Deep Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

077 runs the canonical `/speckit:deep-research:auto` workflow with a cli-codex (gpt-5.5/high/fast) executor against three intertwined OpenCode skill surfaces. The loop produces 10 iteration narratives, a synthesized research.md with a prioritized 4-phase remediation roadmap, and a resource-map.md covering all 43+ touched paths. No code is changed in this packet; subsequent packets (078+) consume the synthesis as planning input.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criterion |
|---|---|
| G1 | All 10 iterations dispatched cleanly via cli-codex (exit 0 each) |
| G2 | 10 iteration-NNN.md files + 10 deltas/iter-NNN.jsonl files produced |
| G3 | State log has ≥10 `"type":"iteration"` records + loop_complete + synthesized events |
| G4 | research.md surfaces concrete per-surface + cross-cutting findings with severity tags |
| G5 | resource-map.md is section-grouped with ≥40 path entries |
| G6 | validate.sh --strict on 077 exits 0 |
| G7 | Memory save (generate-context.js) exits 0; graph-metadata refreshed |
| G8 | One commit on main + push origin/main success |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Packet layout

```
077-spec-kit-coco-sk-code-research/
├── spec.md              # this packet's spec
├── plan.md              # this file
├── tasks.md             # task tracker
├── implementation-summary.md
├── description.json     # auto-generated metadata
├── graph-metadata.json  # auto-generated graph entry
└── research/            # deep-research packet
    ├── deep-research-config.json     # loop config (executor, iterations, threshold)
    ├── deep-research-state.jsonl     # append-only canonical state log
    ├── deep-research-strategy.md     # session strategy (machine-owned sections)
    ├── findings-registry.json        # reducer-owned findings registry
    ├── research.md                   # synthesis (workflow-owned canonical)
    ├── resource-map.md               # 43-path inventory
    ├── loop-master.log               # dispatcher's stdout
    ├── prompts/                      # iteration prompts + codex stdout logs
    ├── iterations/                   # iteration-NNN.md narratives
    ├── deltas/                       # per-iteration JSONL streams
    └── scripts/                      # dispatch-iter.sh + run-loop.sh
```

### Executor pipeline

cli-codex invocation per iteration (per memory rule):
```
codex exec --sandbox workspace-write \
  -c service_tier="fast" -c model="gpt-5.5" -c model_reasoning_effort="high" \
  - < prompts/iter-NNN.md > prompts/iter-NNN.codex.log 2>&1
```

stdin redirection mitigates the "cli-codex stalls on large prompts in background" pattern documented in memory.

### Convergence detection

After each iteration, run-loop.sh:
1. Counts `[P0]` and `[P1]` finding tags in `iteration-NNN.md`
2. If combined count = 0, increment `streak` counter; else reset to 0
3. Stop early if `streak ≥ 2` (two consecutive iterations with no new P0/P1 findings)
4. Otherwise dispatch the next iteration up to maxIterations=10

In practice the loop ran all 10 iterations because every iteration found new P1 issues — convergence didn't trigger, which itself signals the audit surface was rich.

### Synthesis approach

After loop completion:
- Aggregate all P1/P2 finding headlines across 10 iterations via `grep "^### F-"`
- Group by surface (system-spec-kit / mcp-coco-index / sk-code) using finding ID prefix patterns + content
- Identify cross-cutting integration findings in iterations 9-10
- Sequence remediation into dependent phases (foundation → integration → indexing → cleanup)
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Init (spec folder + research packet scaffold)

- create.sh (Level 1) → 077 spec folder
- mkdir research/{prompts,iterations,deltas} + research_archive/
- Author deep-research-config.json (cli-codex executor block)
- Author deep-research-state.jsonl (config + initialized event)
- Author deep-research-strategy.md (topic + 7 key questions + non-goals + stop conditions)
- Author findings-registry.json (open question seed)

### Phase 2: Dispatcher + Loop

- Author dispatch-iter.sh (per-iteration prompt builder + codex exec)
- Author run-loop.sh (10-iter loop with convergence streak)
- Run loop in background; iter 1 smoke test; resume after bug fix from iter 2

### Phase 3: Synthesis

- research.md with executive summary + per-surface findings + cross-cutting + remediation roadmap + answered questions + ruled-out + artifacts + verdict
- resource-map.md with 10 sections (READMEs/Documents/Commands/Agents/Skills/Specs/Scripts/Tests/Config/Meta) + section counts

### Phase 4: Spec Docs

- spec.md, plan.md, tasks.md, implementation-summary.md (Level 1 anchors per template manifest)

### Phase 5: Validate + Commit + Save

- validate.sh --strict 077 → exit 0
- Refresh description.json + graph-metadata.json
- git add 077 + commit + push origin main
- /memory:save via generate-context.js
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Method |
|---|---|
| Iteration artifact contract | Each iter produces 3 artifacts; dispatcher verifies presence + state-log append |
| Codex exit-code | All 10 iters exit_code 0 |
| State log integrity | `grep -c '"type":"iteration"'` = 10 (canonical record only; reducer rejects variants) |
| Synthesis completeness | research.md §2-3 lists ≥22 P1 + ≥20 P2 finding headlines |
| Spec doc anchors | validate.sh --strict matches Level 1 plan-core/spec-core/tasks-core/impl-summary-core manifests |
| Memory save | generate-context.js exits 0; graph-metadata.json refreshed |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dep | Status | Note |
|---|---|---|
| cli-codex CLI (codex-cli 0.128.0) | Green | `which codex` returned `/Users/michelkerkmeester/.superset/bin/codex` |
| OPENAI_API_KEY | Green | All 10 codex calls returned exit 0 |
| system-spec-kit/scripts/spec/validate.sh | Green | Used as completion gate |
| system-spec-kit/scripts/dist/spec-folder/generate-description.js | Green | For metadata refresh |
| system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js | Green | For graph metadata refresh |
| system-spec-kit/scripts/dist/memory/generate-context.js | Green | For canonical /memory:save |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

077 is purely additive (research-only, no code changes outside `.opencode/specs/skilled-agent-orchestration/077-*`):

- `rm -rf .opencode/specs/skilled-agent-orchestration/077-spec-kit-coco-sk-code-research/` removes all packet artifacts
- No external file modifications to revert (the strategy.md reducer-edits and state log appends are confined to the packet)
- Per memory rule: DELETE not archive. No `.bak`, no `_deprecated`.

If a remediation packet (078+) is later started and needs to revisit findings, the 077 research.md + resource-map.md remain accessible via git history.
<!-- /ANCHOR:rollback -->
