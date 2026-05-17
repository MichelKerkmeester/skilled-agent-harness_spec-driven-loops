---
title: "Plan: 022/003 install guide docs"
description: "Phases for skill-advisor INSTALL_GUIDE + README updates"
trigger_phrases: ["022/003 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/022-skill-advisor-embedder-parity/003-install-guide-docs"
    last_updated_at: "2026-05-17T21:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored phases"
    next_safe_action: "Wait for 022/001+002"
    blockers: ["depends on 022/001+002"]
    key_files: ["INSTALL_GUIDE.md", "README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000022003"
      session_id: "022-003-install-guide-docs-plan"
      parent_session_id: "022-003-install-guide-docs"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 022/003 install guide docs

<!-- ANCHOR:summary -->
## 1. SUMMARY

Dispatch markdown agent (Sonnet) — mirror 019/002 pattern for skill-advisor. Surgical edits to existing INSTALL_GUIDE + README. Cross-link to 021/003 narrative + 022/002 swap-runbook.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Stale claims | Zero remaining (gemma defaults flipped to jina-v3) |
| Cross-links | Resolve |
| Diff size | < 100 LOC unless severely outdated |
| Strict-validate | PASSED |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
markdown agent (Sonnet)
  ↓ reads skill-advisor INSTALL_GUIDE + README + 022/001 MANIFESTS
  ↓ surgical edits + cross-links
  ↓ writes updated docs
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Inventory current docs
### Phase 2: Draft INSTALL_GUIDE "Choosing an embedder" section
### Phase 3: README pointer paragraph
### Phase 4: Strict-validate + commit
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Read-through: new contributor can swap embedder in < 10 min
- Link-check resolves
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 022/001 MANIFESTS content
- 022/002 swap-runbook (cross-link)
- 021/003 narrative (cross-link)
- markdown agent
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Trigger | Action |
|---|---|
| Agent over-rewrites | Revert; narrow prompt |
| Broken cross-links | Fix or stub |
<!-- /ANCHOR:rollback -->
