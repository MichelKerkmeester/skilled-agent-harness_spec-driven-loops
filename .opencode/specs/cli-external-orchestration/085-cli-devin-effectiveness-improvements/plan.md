---
title: "Plan: 105 cli-devin v1.0.4.0 effectiveness improvements"
description: "Three-bucket parallel execution plan for 8 improvements to cli-devin + deep-loop infrastructure."
trigger_phrases:
  - "105 plan"
  - "cli-devin v1.0.4.0 plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/085-cli-devin-effectiveness-improvements"
    last_updated_at: "2026-05-16T05:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored plan.md"
    next_safe_action: "Dispatch 3 parallel opus agents"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:d28bc5776096e11985d8018d2f0d0a1c09db3e16aaef58b190812df439e128c9"
      session_id: "105-plan"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: 105 cli-devin v1.0.4.0 effectiveness improvements

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Three opus agents work in parallel on disjoint file sets:

- **Bucket A** (Agent 1): MCP registration + 3 recipe JSON updates
- **Bucket B** (Agent 2): SKILL.md + 2 reference docs + 1 asset
- **Bucket C** (Agent 3): 2 YAML `if_cli_devin:` branches + dispatcher scripts

Each agent strict-validates its outputs. Final commit on main bundles all three.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check |
|------|-------|
| Pre-execution | Packet 105 strict-validate passes; all 9 target files exist |
| Per-bucket | Agent's deliverables sk-doc validate exit 0 |
| Per-recipe | `devin -p --agent-config <recipe> --model swe-1.6 -- "say ok then stop"` exits 0 |
| MCP smoke | `devin mcp list` shows sequential_thinking after registration |
| Final | Packet 105 strict-validate exits 0; commits on main |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
105-cli-devin-effectiveness-improvements/
├── spec.md, plan.md, tasks.md, implementation-summary.md
├── description.json, graph-metadata.json
└── research/
    └── retrospective.md   (findings ledger from 999 run)

Target files (under repo root):
├── .opencode/skills/cli-devin/SKILL.md                                       [Bucket B]
├── .opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json    [Bucket A]
├── .opencode/skills/cli-devin/assets/agent-config-deep-review-iter.json      [Bucket A]
├── .opencode/skills/cli-devin/assets/agent-config-synthesis.json             [Bucket A]
├── .opencode/skills/cli-devin/references/deep-loop-iter-contract.md          [Bucket B]
├── .opencode/skills/cli-devin/references/agent-config-recipes.md             [Bucket B]
├── .opencode/skills/cli-devin/assets/deep-loop-iter-template.md              [Bucket B]
├── .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml       [Bucket C]
└── .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml         [Bucket C]
```

No file overlap between buckets. Parallel-safe.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Scaffold + retrospective
Main agent (this turn):
- Scaffold 105 packet (L1: spec / plan / tasks / impl-summary / description / graph-metadata)
- Author `research/retrospective.md` capturing the 999 findings
- Strict-validate packet

### Phase 2 — Three parallel opus agents

#### Bucket A (Agent 1, opus)
- Register sequential_thinking with devin: `devin mcp add sequential_thinking npx @modelcontextprotocol/server-sequential-thinking@2025.12.18`
- Verify registration: `devin mcp list | grep sequential_thinking`
- Update 3 recipe JSONs: add `mcp_servers`, update `system_instructions`, add narrow `Write(...)` scope to research-iter + review-iter
- Smoke-test each recipe with devin -p

#### Bucket B (Agent 2, opus)
- Update SKILL.md frontmatter version 1.0.3.0 → 1.0.4.0; add ALWAYS rule #14 mandating sequential_thinking
- Update references/deep-loop-iter-contract.md with sequential_thinking section + prompt invariants
- Update references/agent-config-recipes.md schema reference + per-recipe wording
- Update assets/deep-loop-iter-template.md with inline JSONL + explicit ref_tag requirement
- sk-doc validate each

#### Bucket C (Agent 3, opus)
- Update `if_cli_devin:` branch in deep_start-research-loop_auto.yaml: gtimeout wrapper + tool-rejection detection + boilerplate-strip post-process
- Update same in deep_start-review-loop_auto.yaml
- Update run-loop.sh dispatcher in packet 999's scripts/ to mirror the YAML changes (forward-compatible — future runs use these patterns)
- YAML safe_load validate

### Phase 3 — Integration + commit
Main agent:
- Verify all three buckets landed cleanly
- Run final strict-validate on 105 packet
- Final smoke-test: `devin -p --agent-config <substituted-recipe> --model swe-1.6 --permission-mode auto -- "What 5 sequential thoughts would you use to plan a research iter?"` — confirms sequential_thinking gets invoked
- Final commit: `feat(105): cli-devin v1.0.4.0 — sequential_thinking mandatory + 7 SWE-1.6 effectiveness improvements`
- Push to origin/main
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Per-recipe smoke: `devin -p --agent-config <recipe> --model swe-1.6 -- "say ok then stop"` exits 0
- MCP discovery: `devin mcp list` shows sequential_thinking
- Sequential_thinking tool-trace check: dispatch a tiny iter and inspect stderr/trace for `mcp__sequential_thinking__sequentialthinking` invocation
- sk-doc validate every touched .md file
- YAML safe_load every touched .yaml file
- Strict-validate the 105 packet folder
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- cli-devin v1.0.3.0 shipped (packet 059)
- Devin CLI v2026.5.6-8 (current)
- sequential_thinking MCP package `@modelcontextprotocol/server-sequential-thinking@2025.12.18` (already in our opencode.json — proves the package exists)
- HEAD baseline: `f7493bbd0` (iter 999/039 re-dispatch — most recent commit before this packet)
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Per-bucket rollback options:

1. **Bucket A rollback**: `devin mcp remove sequential_thinking` + `git checkout HEAD -- .opencode/skills/cli-devin/assets/agent-config-*.json`
2. **Bucket B rollback**: `git checkout HEAD -- .opencode/skills/cli-devin/SKILL.md .opencode/skills/cli-devin/references/ .opencode/skills/cli-devin/assets/deep-loop-iter-template.md`
3. **Bucket C rollback**: `git checkout HEAD -- .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`

Full rollback: `git reset --hard <105-baseline-sha>` (captured before agent dispatch).

The in-flight packet 999 run is unaffected — it uses pre-v1.0.4.0 recipes.
<!-- /ANCHOR:rollback -->
