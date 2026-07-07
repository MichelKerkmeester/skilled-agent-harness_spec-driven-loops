---
title: "Implementation Plan: 101/005 Deep AI Council Fix-ups and Graph Value Scenarios"
description: "Apply 2 targeted test fixes, author 6 value-comparison playbook scenarios, refresh root playbook + parent 101 phase map."
trigger_phrases:
  - "101/005 plan"
  - "deep-ai-council fixups plan"
  - "graph value comparison plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/020-deep-multi-ai-council-skill/005-deep-ai-council-fixups-and-graph-value-scenarios"
    last_updated_at: "2026-05-11T08:10:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored implementation plan"
    next_safe_action: "Apply runtime-parity vitest fix"
    blockers: []
    key_files:
      - .opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts
      - .opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-persist-artifacts.vitest.ts
      - .opencode/skills/deep-ai-council/manual_testing_playbook/09--council-graph-value-comparison/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-005-fixups-and-value-scenarios"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 101/005 Deep AI Council Fix-ups and Graph Value Scenarios

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (vitest test fixes), Markdown (playbook scenarios) |
| **Framework** | system-spec-kit playbook + vitest |
| **Storage** | Filesystem only |
| **Testing** | sk-doc validators + spec validate.sh --strict + vitest reruns |

### Overview
Two surgical vitest fixes — one for Claude's translated frontmatter parity, one for a stale HELPER_PATH — restore the 7-file vitest matrix to fully green. Six new value-comparison scenarios under a new `09--council-graph-value-comparison/` category prove the graph adds measurable value over the no-graph baseline in real-world council situations.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Both vitest failures diagnosed precisely (parity test design vs Claude translated frontmatter; HELPER_PATH stale)
- [x] Six real-world value scenarios designed: disagreement triage, decision audit, safety convergence, blocker ranking, hot-topic discovery, interruption recovery
- [x] Phase 003 graph surface fully shipped and tested (101/004 confirmed 6/6 vitest green)

### Definition of Done
- [ ] Both fixed vitests pass cleanly
- [ ] Six scenario files exist, pass sk-doc validators, and contrast no-graph vs with-graph workflows
- [ ] Root playbook count, coverage note, TOC, and cross-ref tables match the new state
- [ ] Parent 101 phase map and graph-metadata include phase 005
- [ ] Strict spec validation passes for 005 and parent
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-track delivery: (1) targeted test fixes restoring green CI baseline, (2) value-comparison scenario authoring with consistent A/B structure.

### Key Components
- **Scenario template**: same 5-section structure as `07--writer-library-contract/001`; value-comparison scenarios add explicit "Without graph" vs "With graph" subsections inside §3 TEST EXECUTION
- **Value metrics**: each scenario reports a measurable delta (file-reads saved, prompt-size saved, safety guarantee, time-to-diagnosis)
- **Anchor docs**: `references/graph_support.md` (tool surface), `handlers/council-graph/*.ts` (handler behavior), `tests/council-graph.vitest.ts` (behaviors)

### Data Flow
Test fixes touch only vitest files. Scenario authoring writes only into `manual_testing_playbook/09--council-graph-value-comparison/`. No runtime code touched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Diagnose both vitest failures precisely
- [x] Design 6 value-comparison scenarios
- [x] Create packet 101/005 spec docs

### Phase 2: Core Implementation
- [ ] Fix runtime-parity vitest: loosen byte-equivalence for Claude; preserve OpenCode/Gemini equivalence
- [ ] Fix persist-artifacts vitest: update HELPER_PATH line 15
- [ ] Author DAC-027..DAC-032 scenario files
- [ ] Update root playbook header, TOC, §11 path, §16 new, §17/§18 renumber, §17 cross-ref row, §18 catalog rows
- [ ] Update parent 101 spec.md phase map + graph-metadata.json

### Phase 3: Verification
- [ ] Re-run fixed vitests; expect 0 failures
- [ ] Run all 7 council-related vitest files; confirm full green
- [ ] Run sk-doc quick_validate.py on deep-ai-council
- [ ] Run sk-doc validate_document.py on each new file
- [ ] Run validate.sh --strict on packet 005 and parent 101
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Targeted vitest reruns | Both fixed test files | `npx vitest run <file>` from `mcp_server/` and `scripts/` |
| Full council vitest matrix | All 7 council-related test files | `npx vitest run <files>` |
| Doc validation | Per-file scenario authoring | `sk-doc/scripts/validate_document.py` |
| Skill-level doc quality | Whole `deep-ai-council/` skill | `sk-doc/scripts/quick_validate.py` |
| Spec validation | 005 + parent 101 | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 101/003 council graph implementation | Internal | Complete | n/a — value scenarios reference shipped tools |
| 101/004 playbook graph coverage | Internal | Complete | n/a — 005 is purely additive |
| sk-doc validators | Internal | Available | Doc-quality regression goes undetected without them |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: vitest fixes regress other tests, OR value-comparison scenarios drift from shipped tool behavior.
- **Procedure**: `git restore` to drop the 2 vitest edits + 6 new scenario files + root playbook edits + parent 101 phase map edit. No runtime code touched, so rollback is purely doc-tree + test-file restore.
<!-- /ANCHOR:rollback -->
