---
title: "Plan: 019/002 INSTALL_GUIDE updates"
description: "Implementation phases for the new-user embedder onboarding docs"
trigger_phrases: ["019/002 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/006-install-guide-updates"
    last_updated_at: "2026-05-17T20:20:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored implementation phases"
    next_safe_action: "Wait for 019/001 + 018/003"
    blockers:
      - "depends on 019/001"
    key_files:
      - "INSTALL_GUIDE.md"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000019002"
      session_id: "019-002-install-guide-updates-plan"
      parent_session_id: "019-002-install-guide-updates"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 019/002 INSTALL_GUIDE updates

<!-- ANCHOR:summary -->
## 1. SUMMARY

Add a "Choosing an embedder" section to CocoIndex INSTALL_GUIDE.md (+ short README pointer). Section sources its model list from 019/001 registry, includes swap runbook, MPS auto-detect note, kill switch.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Section length | "Choosing an embedder" reads in ≤ 5 min |
| Table coverage | ≥ 4 alternatives with dim / RAM / disk / category |
| Swap runbook | Env var + daemon restart + first-use download |
| Cross-refs | Links 019/001 registry + 018/001 swap-runbook.md + 018/003 ADR-001 |
| Strict-validate | Returns PASSED |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
.opencode/skills/mcp-coco-index/
  INSTALL_GUIDE.md
    ## Choosing an embedder        (NEW SECTION)
      Default + why
      Alternatives table
      Swap runbook
      MPS auto-detect + kill switch
  README.md
    ## Embedder choice            (NEW SHORT SECTION)
      1 paragraph + link to INSTALL_GUIDE
  mcp_server/cocoindex_code/registered_embedders.py  (consumed for table content)
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Inventory current docs
- Read `INSTALL_GUIDE.md` + `README.md` existing structure
- Identify the right insertion point for new sections

### Phase 2: Draft INSTALL_GUIDE section
- Lead with default + rationale
- Alternatives table sourced from 019/001 MANIFESTS
- Swap runbook (env var + daemon restart + first-use download)
- MPS auto-detect note + `COCOINDEX_CODE_DEVICE=cpu` kill switch
- Link to 018/001 swap-runbook.md for operational details

### Phase 3: Draft README pointer
- 1-paragraph "Embedder choice" section pointing to INSTALL_GUIDE

### Phase 4: Cross-references
- Add link to 018/003 ADR-001 (when it lands) for default-justification evidence
- If 018/003 hasn't landed yet, add TODO note for follow-up

### Phase 5: Commit + push
- Strict-validate (this packet)
- Commit + push
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Manual read-through: a fresh-clone user can pick + activate a non-default embedder in <10 min
- Optional: link-check script verifying cross-refs resolve
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 019/001 registry (BLOCKING — content source)
- 018/001 swap-runbook.md (cross-referenced)
- 018/003 ADR-001 (cross-referenced when available)
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Trigger | Action |
|---|---|
| Docs become too long | Move alternatives table to separate `ALTERNATIVES.md` |
| Registry drift breaks docs | Add CI link-check or "regenerate from registry" note |
| INSTALL_GUIDE becomes monolithic | Split into `INSTALL_GUIDE.md` + `EMBEDDERS.md` |
<!-- /ANCHOR:rollback -->
