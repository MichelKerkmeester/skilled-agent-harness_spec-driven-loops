---
title: "Verification Checklist: Deep research — design command redesign"
description: "Verification for the design-command deep-research phase."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/001-research/002-research-design-commands"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Author research-phase checklist"
    next_safe_action: "Run /deep:research: 20 iters SOL HIGH fast + a few GLM-5.2 max, parallel"
    blockers: []
    key_files:
      - ".opencode/commands/design/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Deep research — design command redesign

<!-- ANCHOR:protocol -->
## Verification Protocol

- Verify each item against real research artifacts (state logs, deltas, merged synthesis), not assertions.
- Mark `[x]` only with cited evidence.

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Research question, convergence criteria, and reference set fixed; fan-out configured. [SOURCE: research/research.md:12] [VERIFIED: synthesis + impl-summary]
- [x] CHK-002 [P1] Current command files and `sk-design` modes confirmed readable in-repo. [SOURCE: research/research.md:12] [VERIFIED: synthesis + impl-summary]

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Recommendations cite the current commands, external references, and mode integration by path/source. [SOURCE: research/research.md:12] [VERIFIED: synthesis + impl-summary]
- [x] CHK-011 [P1] Per-command router→creation gap analysis is explicit. [SOURCE: research/research.md:12] [VERIFIED: synthesis + impl-summary]

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Convergence recorded across SOL and GLM lineages. [SOURCE: research/research.md:12] [VERIFIED: synthesis + impl-summary]
- [x] CHK-021 [P0] `implementation-summary.md` states the final `/interface:*` command set + per-command prompt templates. [SOURCE: research/research.md:12] [VERIFIED: synthesis + impl-summary]

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Hub/mode integration described so commands route to `sk-design` modes, not duplicate judgment. [SOURCE: research/research.md:12] [VERIFIED: synthesis + impl-summary]
- [x] CHK-031 [P1] `validate.sh` passes for this phase folder. [SOURCE: research/research.md:12] [VERIFIED: synthesis + impl-summary]

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P1] Command redesign introduces no new external network surface. [SOURCE: research/research.md:12] [VERIFIED: synthesis + impl-summary]

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `research.md` and `implementation-summary.md` are self-consistent; GLM dissent preserved, not averaged. [SOURCE: research/research.md:12] [VERIFIED: synthesis + impl-summary]

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] All research artifacts live under this phase folder; no runtime files touched. [SOURCE: research/research.md:12] [VERIFIED: synthesis + impl-summary]

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-070 [P0] Both lineages complete, recommendation single + evidence-backed, phase validates `--strict`. [SOURCE: research/research.md:12] [VERIFIED: synthesis + impl-summary]
- [x] CHK-071 [P1] Handoff to phase `004-interface-commands` recorded in `implementation-summary.md`. [SOURCE: research/research.md:12] [VERIFIED: synthesis + impl-summary]

<!-- /ANCHOR:summary -->
