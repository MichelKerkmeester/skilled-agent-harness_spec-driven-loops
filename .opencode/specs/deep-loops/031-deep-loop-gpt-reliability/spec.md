---
title: "Phase Parent: GPT Reliability (Deep-Loop)"
description: "Packet root for making GPT-backed OpenCode run deep-loop routing, dispatch, identity, and orchestration correctly. Regrouped into 7 themed tracks: research/diagnosis, routing/dispatch/identity, guard/enforcement, benchmarks/verification, skill-doc hygiene, reliability fixes, and the compiled-contract compiler."
trigger_phrases:
  - "gpt reliability deep-loop"
  - "deep loop gpt opencode routing identity"
  - "deep agent router guard benchmark"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability"
    last_updated_at: "2026-07-04T00:00:00.000Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Regrouped 21 flat phases into 7 themed L1 tracks; renumbered per track"
    next_safe_action: "Packet complete; see context-index.md for the old-to-new remap"
    blockers: []
    key_files:
      - "spec.md"
      - "context-index.md"
      - "001-research-and-diagnosis/spec.md"
      - "002-routing-dispatch-and-identity/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-parent-reorg-7-tracks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The GPT-reliability work is the packet's own phases plus the moved 034/035/036 packets, regrouped into 7 themed tracks."
      - "The routing and FIX-5 identity work stays one track (002) as a single core-fixes story."
      - "The old-number to new-track-number remap is recorded in context-index.md for cross-reference traceability."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: phase -->

# Phase Parent: GPT Reliability (Deep-Loop)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase |
| **Priority** | P0 |
| **Status** | complete |
| **Created** | 2026-06-30 |
| **Parent Packet** | `deep-loops` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
GPT-backed OpenCode mis-handled deep-loop routing, dispatch, host identity, and orchestration — deep skills were mis-invoked, routes were mismatched, and the host could not hold a hard identity (FIX-5). The work grew across many phases plus three moved-in packets.

### Purpose
Root of the GPT-reliability program. Groups the research, core fixes, enforcement, verification, hygiene, and the two late fix programs into 7 themed tracks. Detailed planning and evidence live in each track and its child phases.

> **Phase-parent note:** This packet-root spec.md is the only authored document at the root level. The old-to-new phase remap lives in `context-index.md`; detailed work lives in the track folders below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All GPT-reliability deep-loop work: research/diagnosis, routing/dispatch/identity fixes, guard/enforcement, benchmarks/verification, skill-doc hygiene.
- The two late fix programs: reliability fixes (from 035) and the compiled-contract compiler (from 036).

### Out of Scope
- The distinct top-level `034-deep-router-agent-rename` and `035-deprecate-deep-context` packets (number collision only).
- Packets 029/030/032/033 and `z_archive/`.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Maintain | root | Root purpose and track map |
| `context-index.md` | Maintain | root | Old-to-new phase remap narrative |
| `description.json` | Generator-owned | root | Search metadata for this packet root |
| `graph-metadata.json` | Generator-owned | root | Track identity and phase graph metadata |
| `001-research-and-diagnosis/spec.md` | Track | 001 | Research and diagnosis |
| `007-compiled-contract-compiler/spec.md` | Track | 007 | Compiled-contract compiler |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Track | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-research-and-diagnosis/` | Behavioral-hardening + GPT-reliability research | COMPLETE |
| 002 | `002-routing-dispatch-and-identity/` | Routing, dispatch, host/FIX-5 identity core fixes | COMPLETE |
| 003 | `003-guard-and-enforcement/` | Route-guard plugin, hardening, loop detection, fanout tolerance | COMPLETE |
| 004 | `004-benchmarks-and-verification/` | Verification smoke + GPT/Claude benchmark | COMPLETE |
| 005 | `005-skill-doc-hygiene/` | Skill-doc drift audit + remediation | COMPLETE |
| 006 | `006-reliability-fixes/` | Acute reliability fixes (from 035) | COMPLETE |
| 007 | `007-compiled-contract-compiler/` | Command-contract compiler (from 036) | COMPLETE |

### Phase Transition Rules

- Each track owns one theme; detailed evidence lives in its child phases.
- Root state follows the completed tracks.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| root | track | Inspect one themed track | Track `spec.md` names scope and child map |
| track | root | Track phases complete | Track feeds the packet's overall GPT-reliability outcome |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None at the root level. The old-to-new remap and consolidation narrative live in `context-index.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Context index**: `context-index.md`
- **Timeline**: `timeline.md`
- **Graph metadata**: `graph-metadata.json`
- **Tracks**: `001-research-and-diagnosis/` through `007-compiled-contract-compiler/`
