---
title: "Implementation Plan: Phase 8 — rename sk-ai-small-model → sk-prompt-small-model"
description: "8-bucket mechanical rename + REWRITE-ALL historical sweep + advisor reindex. Reuses phase-007 workflow with 2 new buckets: symlink rotation + global historical sweep."
trigger_phrases:
  - "rename sk-ai-small-model plan"
  - "sk-prompt-small-model plan"
  - "phase 8 rename plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/008-sk-prompt-small-model-rename"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000008"
      session_id: "114-008-plan-init"
      parent_session_id: "114-008-spec-init"
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 8 — rename sk-ai-small-model → sk-prompt-small-model

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Stack | Markdown + JSON + symlinks |
| Framework | spec-kit Level 2 + skill-advisor compiler |
| Storage | Filesystem + 2 compiled `skill-graph.json` mirrors |
| Testing | validate.sh --strict + skill_graph_compiler.py --validate-only + advisor smoke + rg residual sweep |

### Overview
Mechanical rename in 8 buckets matching phase-007's shape with 2 new buckets: Bucket 3 (symlink rotation) + Bucket 8 (REWRITE-ALL historical sweep). cli-devin pre-implementation context-gathering skipped per D-004; bundle-gate via direct rg + jq.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem clear + scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] decision-record.md captures ADR-002 trade-off

### Definition of Done
- [ ] All P0/P1 met
- [ ] validate.sh --strict exit 0
- [ ] Zero name-only residuals outside exemptions
- [ ] Advisor confidence ≥0.7
- [ ] Symlink resolves
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Two-rename chain: `sk-small-model` (002) → `sk-ai-small-model` (007) → `sk-prompt-small-model` (008). Sentinel; `enhances` edges + family unchanged.

USER PROMPT → SKILL ADVISOR → compiled skill-graph.json → RECOMMENDATION → OPERATOR.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Bucket | Surface | Action | Verification |
|--------|---------|--------|--------------|
| 1 | sk-ai-small-model dir | rename + sweep | ls, rg, git log |
| 2 | cli-devin + cli-opencode metadata | enhances target | jq |
| 3 | aggregator symlink | rm + ln -s | readlink |
| 4 | 4 cli-* playbook files | rename + content | ls, rg |
| 5 | Root markdown (4) | content sweep | rg |
| 6 | Compiled graph (2 mirrors) | regenerate | jq, advisor |
| 7 | Memory dir (3) | content sweep | rg |
| 8 | 007/, 131/scratch/115, deep-ai-council/v1.2.0.0, rename-pattern.md | REWRITE-ALL | rg |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
T001-T007: pre-flight + context-gathering skip (D-004)

### Phase 2: Implementation
T010-T034: 8 buckets (core rename → propagation → historical sweep)

### Phase 3: Verification
T035-T040: 5 gates + impl-summary + canonical save
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:phase-deps -->
## 4.5 PHASE DEPENDENCIES

```text
Phase 1 → Phase 2 → Phase 3
          Buckets 1+2 → Bucket 6 (compiler) → Bucket 8 (historical)
```

Critical ordering: Bucket 6 runs after 1+2; Bucket 8 runs last (its scope expansion would corrupt un-swept live surfaces otherwise).
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Tool |
|------|------|
| Strict validate | validate.sh --strict |
| Residual sweep | rg -il (case-insensitive) + disambiguating PCRE |
| Skill-graph compile | skill_graph_compiler.py |
| Advisor live-check | skill_advisor.py |
| Symlink | readlink, ls -l |
| Git history | git log --follow |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:effort -->
## 5.5 EFFORT ESTIMATION

| Phase | Time |
|-------|------|
| Setup | 5 min |
| Buckets 1-3 | 10 min |
| Buckets 4-7 | 15 min |
| Bucket 8 | 5 min |
| Verification | 15 min |
| **Total** | **~50 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status |
|------------|--------|
| Predecessor 007 complete | Green |
| git mv | Green |
| skill_graph_compiler.py | Green |
| validate.sh baseline | Green |
| cli-devin (skipped per D-004) | N/A |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Reversible via `git revert` (sed sweep produces clean inverse diff).

<!-- ANCHOR:enhanced-rollback -->
### Enhanced Rollback (ADR-002 aware)

- **Trigger**: validate fails unrecoverable; advisor <0.4; git mv inconsistent; user abort.
- **Procedure**: git stash + git checkout HEAD + recreate old symlink + recompile + verify.
- **Partial**: revert only Bucket 8 if rewrite-all unwanted.
<!-- /ANCHOR:enhanced-rollback -->
<!-- /ANCHOR:rollback -->
