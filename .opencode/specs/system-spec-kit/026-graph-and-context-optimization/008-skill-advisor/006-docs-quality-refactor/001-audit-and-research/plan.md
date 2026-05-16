---
title: "Implementation Plan: 001-audit-and-research"
description: "Execute 20-iter /spec_kit:deep-research:auto via cli-devin SWE 1.6 over the skill-advisor doc surface. Per-iter dispatch follows the 4-block contract; final synthesis ships research.md."
trigger_phrases:
  - "001 audit research plan"
  - "20-iter deep-research plan skill-advisor"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "006-docs-quality-refactor/001-audit-and-research"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Authored plan"
    next_safe_action: "Execute Phase 2"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-plan"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 001-audit-and-research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown audit + JSONL state |
| **Framework** | `/spec_kit:deep-research:auto` workflow + cli-devin SWE 1.6 |
| **Storage** | `research/` subdir (state.jsonl, iterations/, deltas/, research.md) |
| **Testing** | P0 verification gates (grep-verify, smoke-run, JSONL strict-validate) |

### Overview
Single-command dispatch of `/spec_kit:deep-research:auto` with `--max-iterations=20 --convergence=0.0 --executor=cli-devin --model swe-1.6`. The workflow handles per-iter prompt rendering, dispatch, JSONL state-log appends, and final synthesis. Manual P0 gates run after loop completes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent + this child scaffolded
- [x] cli-devin + SWE 1.6 access verified
- [x] 20 iter angles designed (see Phase 2)

### Definition of Done
- [ ] 20 iters complete (stopReason=`maxIterationsReached`)
- [ ] `research.md` synthesis exists
- [ ] All P0 gates green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Externalized iter loop via workflow YAML. Per-iter dispatch is one `devin` subprocess invocation reading a generated prompt file and writing to `iteration-NN.md`. Synthesis switches recipes to allow scoped Write of `research.md`.

### Key Components
- **Workflow YAML**: `.opencode/skills/system-spec-kit/workflows/spec_kit_deep-research_auto.yaml` (drives the loop)
- **Iter recipe**: `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json` (read-only scope)
- **Synthesis recipe**: `.opencode/skills/cli-devin/assets/agent-config-synthesis.json` (scoped Write)
- **Iter prompt template**: `.opencode/skills/cli-devin/assets/deep-loop-iter-template.md` (4-block contract)

### Data Flow
prompt → render iter-NN prompt → devin dispatch → iteration-NN.md + JSONL delta → state.jsonl append → reducer update → next iter
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Parent scaffolded with phase-parent template
- [x] This child scaffolded with Level 1 baseline
- [x] Iter angles defined (see Phase 2 list of 20)

### Phase 2: Deep-research dispatch (20 iters)

Iter angles:

| Iter | Angle |
|------|-------|
| 01 | SKILL.md anchor coverage + smart-router INPUTS↔ACTIONS↔OUTPUTS conformance |
| 02 | README.md marketing-voice gap audit vs peer system-code-graph/README.md |
| 03 | ARCHITECTURE.md vs `mcp_server/` source code drift |
| 04 | INSTALL_GUIDE.md command-by-command smoke vs reality |
| 05 | references/advisor-scorer.md ↔ scorer code drift |
| 06 | references/db-path-policy.md + standalone-mcp-shape.md freshness |
| 07 | references/{legacy-tool-bridge, tool-ids-reference, propagate-enhances, skill-graph-extraction-plan} cross-link integrity |
| 08 | feature_catalog/01--daemon-and-freshness alignment + cross-links |
| 09 | feature_catalog/02..04 (auto-indexing, lifecycle-routing, scorer-fusion) sk-doc alignment |
| 10 | feature_catalog/05 GAP root-cause investigation |
| 11 | feature_catalog/06..08 (mcp-surface, hooks-and-plugin, python-compat) alignment |
| 12 | manual_testing_playbook/01..04 coverage |
| 13 | playbook/05..08 coverage |
| 14 | playbook/09 GAP investigation + coverage matrix vs feature_catalog |
| 15 | HVR compliance sweep across all 6 surfaces |
| 16 | Cross-link integrity: every relative link + ADR path resolves |
| 17 | hooks/ reference resolution: Claude/Codex/Devin/Gemini paths vs reality |
| 18 | mcp_server/ ↔ docs drift: tool count + tool documentation truth-check |
| 19 | Bug hunt: TODO/FIXME/XXX/HACK in code; broken graph-metadata refs; freshness-contract absence |
| 20 | Synthesis prep: impact-rank findings 1-100, group by sub-phase 002-005 mapping |

- [ ] Invoke `/spec_kit:deep-research:auto "<topic>" --max-iterations=20 --convergence=0.0 --spec-folder=<this-folder> --executor=cli-devin --model swe-1.6`

### Phase 3: Verification
- [ ] P0 grep-verify: every iter's file:line citations match actual file content
- [ ] P0 smoke-run: re-run each iter's grep commands; counts match within ±10%
- [ ] P0 JSONL strict-validate: required fields present per row
- [ ] P0 schema-mismatch check: grep state.jsonl for conflict rows
- [ ] P0 parent metadata restore: `derived.last_active_child_id` correct on parent graph-metadata.json
- [ ] Update implementation-summary.md with results
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Workflow contract | State.jsonl conformance | jq + manual grep |
| Iter quality | Citation accuracy | rg + Read |
| Synthesis | research.md completeness | manual review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-devin CLI | External | Green | Cannot dispatch; fallback to native executor |
| SWE 1.6 model | External | Green | Cannot use specified model |
| /spec_kit:deep-research skill | Internal | Green | Cannot run workflow |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Loop hangs, >50% iters fail P0 gates, or model unavailable
- **Procedure**: `rm -rf research/` to discard state; re-dispatch fresh; if persistent, fall back to `--executor=native` and re-run
<!-- /ANCHOR:rollback -->
