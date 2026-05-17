---
title: "Plan: 021/002 root readme update"
description: "Phases for root README refresh"
trigger_phrases: ["021/002 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/021-skill-docs-alignment/002-root-readme-update"
    last_updated_at: "2026-05-17T20:40:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored phases"
    next_safe_action: "Dispatch markdown agent"
    blockers: []
    key_files: ["README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000021002"
      session_id: "021-002-root-readme-update-plan"
      parent_session_id: "021-002-root-readme-update"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 021/002 root readme update

<!-- ANCHOR:summary -->
## 1. SUMMARY

Dispatch markdown agent (Sonnet) with scoped prompt: refresh root README.md with current embedder defaults + 1-paragraph architecture summary + cross-links. Minimal diff.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Stale claims | Zero remaining |
| Cross-links | Resolve to existing files |
| Diff size | Under 100 LOC unless severe outdate |
| Strict-validate | PASSED |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
markdown agent (Sonnet)
  ↓ reads root README.md
  ↓ surgical edits: defaults + cross-links
  ↓ writes README.md
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Read existing README
### Phase 2: Surgical edits
### Phase 3: Strict-validate + commit
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Hand-review diff
- Link-check cross-refs resolve
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 021/003 (cross-link target; can land concurrently)
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Trigger | Action |
|---|---|
| Agent over-rewrites | Revert; narrow dispatch prompt |
| Cross-links break | Update links or stub the targets |
<!-- /ANCHOR:rollback -->
