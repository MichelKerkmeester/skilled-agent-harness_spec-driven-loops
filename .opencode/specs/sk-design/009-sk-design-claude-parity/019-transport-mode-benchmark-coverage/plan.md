---
title: "Implementation Plan: Phase 019 - Transport Mode Benchmark Coverage & Routing Re-Verification"
description: "Plan for adding playbook coverage for the new transport mode, syncing the skill-level advisor descriptor, and re-running both benchmark modes."
trigger_phrases:
  - "phase 019 plan"
  - "transport mode benchmark plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/019-transport-mode-benchmark-coverage"
    last_updated_at: "2026-07-07T11:05:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and checklist.md, wait for live-mode benchmark to complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "transport-benchmark-019"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 019 - Transport Mode Benchmark Coverage & Routing Re-Verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown playbook scenarios + JSON skill descriptors |
| **Framework** | Existing `{PREFIX}-NNN` scenario contract shape already used by the other 32 playbook scenarios |
| **Storage** | `.opencode/skills/sk-design/manual_testing_playbook/`, `description.json`, `graph-metadata.json`, `benchmark/` |
| **Testing** | `run-skill-benchmark.cjs` in both `--trace-mode router` and `--trace-mode live` |

### Overview

Phase 018 added a registry mode (`design-mcp-open-design`) without adding matching benchmark corpus coverage — the playbook and skill-level descriptors were out of scope for that phase. This phase closes that gap: one new mode-routing scenario, one new probe in the existing advisor-integration battery, descriptor syncs, and two fresh benchmark runs (router for fast deterministic confirmation, live for the real whole-hub baseline the user asked for).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Read the playbook's root index (scenario ID scheme, category structure, critical-path rules) in full
- [x] Read one existing `MR-*` scenario (`audit-mode.md`) as the exact template to replicate
- [x] Read `AI-001`'s existing 5-probe battery to extend it correctly
- [x] Confirmed `command-metadata.json` needs no entry (the transport mode has no dedicated command)

### Definition of Done
- [x] `MR-007` scenario authored, matching the existing contract shape exactly
- [x] `AI-001` extended with `P6`
- [x] All stale "five modes" references in sk-design's own live docs fixed
- [x] `description.json`/`graph-metadata.json` synced to six modes
- [x] Router-mode benchmark re-run: scenario count 24 -> 25, PASS, D5 100/100
- [ ] Live-mode benchmark re-run: fresh baseline saved
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Additive-only playbook and descriptor updates — no change to the registries themselves (those were phase 018's job). The new scenario and probe follow the exact existing contract shape (frontmatter, OVERVIEW, SCENARIO CONTRACT, TEST EXECUTION, SOURCE FILES, SOURCE METADATA) so the benchmark loader's parser (which reads this shape structurally) picks them up without any loader code change.

### Key Components

- **`MR-007`**: a full scenario file mirroring `MR-004` (`audit-mode.md`)'s exact section shape, but naming `design-mcp-open-design` as the expected mode, `packetKind: "transport"` as the discriminator being tested, and a Read/Bash-only tool surface (vs. the design modes' Read/Glob/Grep or md-generator's mutating surface).
- **`AI-001` `P6`**: one additional row in the existing probe table plus matching updates to "Expected packet loaded" and "Expected shared resources" lists — the shared-resources note for P6 is explicit that a transport packet does NOT consume the shared design reference base, unlike the five design modes.
- **Descriptor sync**: `description.json`'s `modes[]`/`backend_kinds[]` arrays and `graph-metadata.json`'s `causal_summary`/`intent_signals` are the skill-level (not spec-folder) advisor-facing metadata — these are what actually get discovered by the advisor/graph systems at runtime, separate from the spec-folder `description.json` files generated during spec-kit saves.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `manual_testing_playbook/01--mode-routing/` | 6 existing scenarios | Add `MR-007` | Router-mode benchmark scenario count |
| `manual_testing_playbook/02--advisor-integration/` | 3 existing scenarios | Extend `AI-001`, fix `AI-003` prompt text | Router-mode benchmark report |
| `manual_testing_playbook/manual_testing_playbook.md` | Root index | Update overview, preconditions, critical-path list, cross-reference index, totals | Grep sweep + validate.sh |
| `sk-design/description.json`, `sk-design/graph-metadata.json` | Skill-level advisor descriptors | Sync to six modes | JSON parse + grep sweep |
| `sk-design/benchmark/after-018-transport-integration/` | Does not exist yet | New live-mode baseline | Directory listing + report verdict |

Required inventories:
- Same-class producers: this is the first `MR-*`/probe addition since phases 016-018; no other in-flight work touches the playbook concurrently (confirmed via scoped `git status`).
- Consumers of changed symbols: `run-skill-benchmark.cjs`'s `load-playbook-scenarios.cjs` (parses the playbook into scored scenarios); the skill advisor (reads `description.json` at discovery time).
- Matrix axes: mode x {playbook coverage, descriptor mention, benchmark verdict}.
- Algorithm invariant: every change is additive to the corpus/descriptors; no existing scenario's prompt, expected mode, or pass criteria changed.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the playbook root index, one MR scenario template, and AI-001 in full
- [x] Confirm no `command-metadata.json` entry is needed for the transport mode

### Phase 2: Implementation
- [x] Author `MR-007`
- [x] Extend `AI-001` with `P6`
- [x] Fix `AI-003`'s stale prompt text and its playbook table row
- [x] Update the root playbook index (overview, preconditions, critical-path list, cross-reference index, totals, version bump)
- [x] Fix `README.md`'s stale playbook description line
- [x] Sync `description.json` (description, keywords, trigger_examples, modes[], backend_kinds[], version bump)
- [x] Sync `graph-metadata.json` (causal_summary, intent_signals)

### Phase 3: Verification
- [x] Router-mode benchmark re-run: scenario count 25, PASS, D5 100/100
- [ ] Live-mode benchmark re-run, saved to `benchmark/after-018-transport-integration/`
- [ ] Write this phase's own `implementation-summary.md`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Router-mode benchmark | Full sk-design skill, deterministic replay | `run-skill-benchmark.cjs --trace-mode router` |
| Live-mode benchmark | Full sk-design skill, real dispatch via cli-opencode | `run-skill-benchmark.cjs --trace-mode live` |
| JSON syntax | `description.json`, `graph-metadata.json` | `python3 -c "import json; json.load(open(f))"` |
| Grep sweep | Zero stale "five modes" text in live docs | `grep -rn` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 018's transport integration | Prerequisite | Complete, pushed as `f1b5c08e9f` | Blocks any benchmark of the new mode |
| `run-skill-benchmark.cjs` | Verification tool | Available | Would need manual routing verification only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The new scenario or probe causes a benchmark regression on the existing 32 scenarios, or the descriptor sync introduces a JSON error.
- **Procedure**: `git restore` the specific new/edited file; re-run the router-mode benchmark to confirm recovery to the prior 24-scenario baseline.
<!-- /ANCHOR:rollback -->
