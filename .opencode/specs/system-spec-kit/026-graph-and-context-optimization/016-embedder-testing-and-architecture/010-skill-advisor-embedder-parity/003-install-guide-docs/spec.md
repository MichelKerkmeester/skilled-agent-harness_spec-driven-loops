---
title: "Spec: 022/003 Skill-advisor INSTALL_GUIDE + README docs"
description: "Document the new pluggable embedder + auto-detect for new users — mirror 019/002 for skill-advisor"
trigger_phrases:
  - "022/003 install guide"
  - "skill-advisor onboarding docs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-skill-advisor-embedder-parity/003-install-guide-docs"
    last_updated_at: "2026-05-17T21:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded packet"
    next_safe_action: "Wait for 022/001+002 then write docs"
    blockers: ["depends on 022/001+002"]
    key_files: ["plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000022003"
      session_id: "022-003-install-guide-docs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 022/003 Skill-advisor INSTALL_GUIDE + README docs

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned (blocked on 022/001+002) |
| Level | 1 |
| Owner | markdown agent (Sonnet) — same pattern as 019/002 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

After 022/001+002 ship, a new user landing on skill-advisor needs to know:
- Default embedder is now jina-v3 (post-swap)
- How to swap to alternatives (env var + daemon restart + reindex)
- Auto-detect device behavior (Metal preferred on Apple Silicon)
- Kill switch if MPS produces issues

Purpose: mirror 019/002 (CocoIndex INSTALL_GUIDE) for skill-advisor.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` — new "Choosing an embedder" section
- `.opencode/skills/system-skill-advisor/README.md` — short "Embedder choice" paragraph + link
- Cross-link to `.opencode/skills/system-spec-kit/references/embedder-pluggability.md` (canonical narrative from 021/003)

Out of scope:
- New canonical narrative doc (covered by 021/003)
- Code changes (022/001+002)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | INSTALL_GUIDE has "Choosing an embedder" section ≤ 5 min read |
| R2 | Alternatives table sourced from 022/001 MANIFESTS |
| R3 | Swap runbook (daemon stop + env var + reindex) |
| R4 | Auto-detect note + CPU kill switch |
| R5 | README short paragraph + link to INSTALL_GUIDE |
| R6 | Cross-link to embedder-pluggability narrative (021/003 output) |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 6 requirements met
- New contributor can swap skill-advisor embedder in < 10 min
- Strict-validate PASSED
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Risks:
- Doc rot (mitigated by linking to registry source-of-truth)
- Operator confusion across mk-spec-memory vs skill-advisor swap flows (mitigated by canonical narrative cross-link)

Dependencies:
- 022/001 (MANIFESTS content source)
- 022/002 swap-runbook.md (operational ref)
- 021/003 narrative (cross-link target)
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether to extend 021/003 narrative to cover skill-advisor explicitly, or keep skill-advisor docs separate. Default: cross-link only; add skill-advisor section to 021/003 in a follow-on if needed.
<!-- /ANCHOR:questions -->
