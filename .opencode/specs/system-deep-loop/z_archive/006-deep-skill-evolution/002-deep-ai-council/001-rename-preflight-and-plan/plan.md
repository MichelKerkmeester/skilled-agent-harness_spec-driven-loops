---
title: "Implementation Plan: 115/001 — preflight scope-map"
description: "Read-only recon phase: rg baseline → per-file live/historical classification → resource-map.md + rename-plan.json emission → 3 cli-devin SWE-1.6 verification dispatches → bundle gate. Gates entry to parallel phases 002-005."
trigger_phrases:
  - "115 preflight plan"
  - "rename plan emission"
  - "cli-devin dispatch plan 115"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/002-deep-ai-council/001-rename-preflight-and-plan"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 115/001 plan.md"
    next_safe_action: "Author 115/001 tasks.md"
    blockers: []
    key_files:
      - "scratch/resource-map.md"
      - "scratch/rg/rg-baseline-before-files.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115001"
      session_id: "115-001-plan-init"
      parent_session_id: "115-001-spec-init"
    completion_pct: 40
    open_questions: []
    answered_questions:
      - "cli-devin job count: 3 (live skill + sibling graphs; root docs + hooks + memory; TypeScript code/tests)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: 115/001 — preflight scope-map

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + JSON + shell (rg, jq) |
| **Framework** | spec-kit + cli-devin SWE-1.6 |
| **Storage** | `scratch/` files only |
| **Testing** | `validate.sh --strict` exit 0 |

### Overview
Read-only recon: capture rg baselines, classify every `deep-ai-council` hit as live or historical, emit `scratch/resource-map.md` + `scratch/rename-plan.json` (the contract that 002-005 work against), and dispatch 3 cli-devin SWE-1.6 verification jobs against the proposed rename plan. No mutations to skill/agent/code/docs surfaces in this phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent 115/spec.md authored
- [x] rg baseline already captured (415 files via earlier session work)
- [x] resource-map.md drafted (covers all surface groups)

### Definition of Done
- [ ] `scratch/rename-plan.json` emitted with disjoint phase scopes (jq intersection = empty)
- [ ] 3 cli-devin SWE-1.6 bundles verified per bundle-gate (grep + smoke-run)
- [ ] `scratch/rg-classification.json` covers every baseline hit
- [ ] `validate.sh --strict` exits 0 on 001
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
**Recon-only with externalized contract.** Read-only sweep emits a machine-readable contract (`rename-plan.json`) that downstream phases 002-005 consume. The contract enforces disjoint scope.

### Key Components
- **`scratch/rg/rg-baseline-before-files.txt`**: 415 files containing `deep-ai-council`
- **`scratch/rg/rg-baseline-before-counts.txt`**: per-file hit counts
- **`scratch/rg-classification.json`**: per-file live/historical classification with reasoning
- **`scratch/resource-map.md`**: human-readable surface map (already authored)
- **`scratch/rename-plan.json`**: per-phase file_scope + rename + literal_substitution rules
- **`scratch/cli-devin/job-{1,2,3}-prompt.md` + `job-{1,2,3}.log`**: 3 SWE-1.6 dispatches with verified bundles

### Data Flow
```
rg sweep → baseline files
  ↓
manual classification + cli-devin × 3 verification
  ↓
rename-plan.json (disjoint phase scopes)
  ↓
emitted to 001/scratch/
  ↓
phases 002-005 consume the contract; phase 006 verifies post-rename
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A for this recon phase. The phase MAKES NO mutations outside `001/`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Author 001/spec.md + plan.md + tasks.md + checklist.md
- [x] `scratch/rg/rg-baseline-before-files.txt` captured (415 lines)
- [x] `scratch/resource-map.md` authored

### Phase 2: cli-devin verification
- [ ] Author 3 cli-devin prompt files (skill body + root/memory + TypeScript)
- [ ] Dispatch 3 cli-devin SWE-1.6 jobs in parallel (capped at 3 per [[feedback_cli_dispatch_unreliability]])
- [ ] Apply bundle gate per [[feedback_cli_devin_bundle_verification]] + [[feedback_bundle_gate_smoke_run]]
- [ ] Aggregate verified bundles into `scratch/rename-plan.json`

### Phase 3: Verification
- [ ] `jq` intersection check on rename-plan.json phase scopes (must be empty)
- [ ] `validate.sh --strict` on 001 spec folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:phase-deps -->
## 4.5 PHASE DEPENDENCIES

```
Setup → cli-devin verification → contract emission → strict validate → DONE
```

Sequential within 001; gates parallel 002-005 entry.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 4.6 EFFORT ESTIMATION

| Step | Wall clock |
|------|-----------|
| Author spec docs (spec/plan/tasks/checklist) | 15 min (done) |
| Capture rg baseline | 1 min (done) |
| Resource-map.md authoring | 10 min (done) |
| 3 cli-devin prompts | 10 min |
| 3 cli-devin dispatches (parallel) | 10 min wall |
| Bundle gate verification | 5 min |
| rename-plan.json emission | 5 min |
| Strict validate | 1 min |
| **Total** | **~57 min** (~30 min remaining) |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec folder strict | 001/ validate | `validate.sh --strict` |
| Contract disjoint-scope invariant | rename-plan.json phase scopes | `jq` set intersection check |
| Bundle gate | per cli-devin bundle | grep + smoke-run validation_commands |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| `rg` (ripgrep) | shell | Green |
| `jq` | shell | Green |
| `cli-devin` SWE-1.6 | external | Green (verified during 007) |
| `validate.sh` | spec-kit | Green |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: 001 strict validate fails OR cli-devin bundle gate fails OR rename-plan.json scopes overlap.
- **Procedure**: `git restore .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/001-rename-preflight-and-plan/` to revert 001 spec docs; or `git clean -fd 001/scratch/` to clear scratch artifacts.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## 7.5 ENHANCED ROLLBACK (LEVEL 2)

| Scenario | Detection | Response |
|----------|-----------|----------|
| cli-devin bundle hallucinates files | Bundle gate (grep verification) fails | Re-dispatch with tightened prompt; fall back to manual rename-plan.json authoring |
| rg baseline incomplete (case variants missed) | `rg -i "deep[-_]ai[-_]council"` finds additional hits | Augment classification; re-emit rename-plan.json |
| Contract scope intersection non-empty | jq check fails | Manual scope adjustment; document conflict resolution in spec.md §10 |
<!-- /ANCHOR:enhanced-rollback -->
