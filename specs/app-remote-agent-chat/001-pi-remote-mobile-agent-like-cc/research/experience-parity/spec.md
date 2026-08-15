---
title: "Feature Specification: Pi Remote Experience Parity Research"
description: "Deep-research charter and findings for a best-in-class Pi remote mobile experience that matches and exceeds the Claude Code + Claude mobile app pairing."
trigger_phrases:
  - "pi remote experience parity"
  - "pi remote ux research"
  - "pi claude app parity"
  - "pi remote best experience"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-pi-remote-experience-parity"
    last_updated_at: "2026-08-12T06:47:00Z"
    last_updated_by: "claude"
    recent_action: "Synthesized the two-lineage deep-research run into research/research.md"
    next_safe_action: "Review recommendations and amend the 041 packet"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pi-remote-parity-research"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
# Feature Specification: Pi Remote Experience Parity Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Review |
| **Created** | 2026-08-12 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 041 Pi remote packet reproduces the engine of the Claude Code + Claude mobile app pairing (local-first relay, cross-device resume, network-resilient replay, steer/stop) but not the app feel. A UX-fidelity review found four feel gaps driven by a hard privacy/security posture: an inverted content-free notification loop, no low-friction approval mode, an opaque session list, and no interaction-design layer.

### Purpose
Produce evidence-backed, buildable design recommendations — relay event schemas, PWA UX patterns, and security-preserving mechanisms — so 041 can be amended toward an experience that matches and exceeds the Claude reference without abandoning the privacy boundary.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Two-lineage deep-research investigation (GPT-5.6 LUNA MAX + DeepSeek-v4-Flash), 20 iterations each, no early convergence.
- SOL-high synthesis into a consolidated `research/research.md`.
- Per-axis recommendations across the eight experience axes plus the four feel gaps.

### Out of Scope
- Implementation of the recommendations — that lands as amendments to the 041 packet.
- Any weakening of the loopback / tailnet-only / foreground-authority / redaction posture.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| specs/cli-external-orchestration/042-pi-remote-experience-parity/research/research.md | Create | Consolidated synthesis of both lineages |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both lineages complete 20 iterations with no early convergence | Per-lineage state ends at synthesis_complete with 20 iterations on disk |
| REQ-002 | A consolidated synthesis covers all eight experience axes | research/research.md contains an executive summary, all 8 axes, convergence analysis, ranked recommendations, and open questions |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every convenience recovery reconciles with the security posture | Each ranked recommendation names its security reconciliation |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Consolidated research.md exists and is grounded in both lineages with cited sources
- **SC-002**: Ranked P0/P1/P2 recommendations are buildable and map onto the 041 architecture
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Live Pi RPC event surface | Schema recommendations may need adjustment | Validate against recorded/live children before freezing |
| Risk | Single-lineage findings | Over-weighting unvalidated ideas | Convergence section flags single-source items |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Superiority claims remain hypotheses until measured on the target host
- **NFR-P02**: Transcript rendering must stay frame-coalesced and virtualized

### Security
- **NFR-S01**: No decision, transcript, tool, path, diff, or error content in push payloads
- **NFR-S02**: Redaction precedes every remote and durable boundary

### Reliability
- **NFR-R01**: Stale/offline clients display state but never decide
- **NFR-R02**: Expiry defaults to no action
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an empty findings set is reported, never fabricated
- Maximum length: transcript blocks coalesce without dropping durable sequence identity
- Invalid format: unknown future event kinds are ignored safely

### Error Scenarios
- External service failure: a failed lineage's on-disk output is still salvaged
- Network timeout: reconnect forces a snapshot barrier, not silent blending
- Concurrent access: two-device approval races settle via CAS first-writer-wins

### State Transitions
- Partial completion: a lineage marked failed by containment can still contribute its data
- Session expiry: pending approvals settle as denied/expired, never approved
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Research-only; informs one downstream packet |
| Risk | 10/25 | No runtime change; recommendation risk only |
| Research | 18/20 | Two independent lineages, 40 iterations total |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Which live Pi RPC events authoritatively supply thinking summaries, plans, tool-input deltas, and file diffs?
- Which push-platform rows (installed PWA, iOS Web Push action limits) hold on the target device matrix?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Product packet**: [../041-pi-remote-mobile-agent-like-cc/spec.md](../041-pi-remote-mobile-agent-like-cc/spec.md)
- **Consolidated research**: [research/research.md](research/research.md)
