---
title: "Plan: 022/003 Codex Agents Mirror Investigation + Qualifier Removal"
description: "Investigation-gated phase: P0 found already-closed; P1 reduces to 2 token deletions in .opencode/agents/."
trigger_phrases:
  - "022/003 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/003-codex-agents-mirror-fill"
    last_updated_at: "2026-05-23T17:05:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan authored post-execution"
    next_safe_action: "n/a — phase shipped"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022e2"
      session_id: "016-002-022-003-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Investigation-driven scope reduction validated"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan: 022/003 Codex Agents Mirror Investigation + Qualifier Removal

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Audit reported `.codex/agents/` empty (P0) + stale `(proposed)` qualifier (P1). Investigation revealed BOTH P0 sub-claims stale (directory has 11 .toml files; ai-council block declared at .codex/config.toml:139). Only P1 qualifier removal in actual scope.

### Overview

2 token deletions in .opencode/agents/{deep-research,deep-review}.md.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- `.codex/agents/` directory inspected — DONE (11 files confirmed)
- `.codex/config.toml [agents.ai-council]` location confirmed — DONE (line 139)
- `(proposed)` qualifier sites enumerated — DONE (2 sites)

### Definition of Done
- R1–R5 from spec.md §4 satisfied
- Strict-validate exit 0
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Mechanical token deletion: remove ` (proposed)` substring from the qualified `deep-ai-council` name reference.

### Key Components

- `.opencode/agents/deep-research.md:51`
- `.opencode/agents/deep-review.md:45`
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Investigation

1. `ls -la .codex/agents/` → confirm directory contents
2. `grep "^\[agents\." .codex/config.toml` → confirm [agents.ai-council] block exists
3. `grep -n "proposed" .opencode/agents/`

### Phase 2: Edits

Two Edit calls applied.

### Phase 3: Verification

- `rg "deep-ai-council \(proposed\)" .opencode/agents/ .claude/agents/ .codex/agents/ .gemini/agents/` → 0 hits
- `grep "(proposed) on adjudicator-verdict stability" .opencode/agents/ai-council.md` → 1 hit (preserved)
- Strict-validate exit 0
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation-only; ban-list grep verification.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Investigation findings (this session) supersede audit's stale P0 claims
- `deep-ai-council` rename arc (116-deep-skill-evolution) shipped — makes `(proposed)` qualifier stale
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git restore` on the 2 changed agent docs. Reverts to historical `(proposed)` qualifier; no behavior or state impact.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

Phase 003 is independent of all other 022 phases. Council ordering placed it after 002b; functionally interchangeable.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE

| Phase | Estimate | Actual |
|---|---|---|
| Investigation | 15 min | ~5 min |
| Edits | 5 min | ~1 min |
| Verify + doc | 10 min | ~5 min |
| Total | 30 min | ~10 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

If a downstream skill relies on the `(proposed)` qualifier to gate behavior (unlikely — qualifier is human-readable documentation only), `git revert` and document the dependency. Low probability since the threshold-comparison block is descriptive prose.
<!-- /ANCHOR:enhanced-rollback -->
