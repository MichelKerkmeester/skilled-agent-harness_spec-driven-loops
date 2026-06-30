---
title: "Phase Parent: Deep-Loop Issues with GPT-backed OpenCode"
description: "Parent packet for fixing deep-skill invocation, routing, and orchestration under GPT-backed OpenCode. Children implement research, validator hardening, and the structural deep-agent router."
trigger_phrases:
  - "gpt deep agent"
  - "deep loop gpt"
  - "deep skills gpt opencode"
  - "deep agent router"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode"
    last_updated_at: "2026-06-30T13:55:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Backfilled phase-parent lean trio"
    next_safe_action: "Run deep research in child 001, then implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-parent-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase Parent: Deep-Loop Issues with GPT-backed OpenCode

<!-- SPECKIT_LEVEL: phase -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-06-30 |
| **Parent Packet** | None (top-level packet under deep-loops track) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PURPOSE

GPT-backed models running inside OpenCode do not properly invoke deep skills (deep-research, deep-review, deep-context, deep-ai-council). The deep-loop dispatch path relies on prose/prompt contracts rather than a hard runtime identity boundary, so GPT absorbs or misinterprets deep LEAF roles, re-dispatches incorrectly, and is often slower than Claude even in fast mode. This parent packet owns the research and phased implementation that fix deep-skill invocation, routing, orchestration, and adherence for GPT while preserving Claude's flexibility.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:phases -->
## 3. PHASE MAP

| Phase | Status | Purpose |
|-------|--------|---------|
| `001-deep-agent-router-and-orchestration` | Phase Parent (research complete) | Owns the research (DONE — `research/research.md` v2) + the phased implementation of the DEEP router, orchestrate hardening, pre-route headers, and verification. Research decomposed the work into 5 single-concern child phases below. |
| `001/001-route-proof-validation` | Draft | Route-proof validator fields (close the FIX-5 false-negative) + recover/confirm prior-research evidence base + citation corrections. Lands first. |
| `001/002-agent-dispatch-hardening` | Draft | Land `deep.md` (from iter-4 draft) + `.claude` mirror + `Deep Route:` field in `orchestrate.md`. |
| `001/003-command-pre-route-headers` | Draft | `Resolved route:` headers across all 4 deep modes (research/review/context/council) — prompt templates + CLI/inline dispatch. |
| `001/004-gpt-verification-smoke` | Draft | GPT before/after smoke per mode with route-proof assertions — the acceptance gate; produces the FIX-5 escalation decision. |
| `001/005-host-hard-identity-fix5` | Parked | Host-runtime hard identity (architectural) + FIX-5 process isolation. Escalated only if 004's trigger fires. |
<!-- /ANCHOR:phases -->
