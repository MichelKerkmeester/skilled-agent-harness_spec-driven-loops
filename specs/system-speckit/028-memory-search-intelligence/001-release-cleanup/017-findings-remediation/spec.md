---
title: "Feature Specification: Findings Remediation Phase Parent"
description: "Phase parent for remediating the 88 findings produced by the dead-code and architecture audit, gated behind a verification phase because two of the six claims re-tested during the audit were wrong."
trigger_phrases:
  - "findings remediation"
  - "017 remediation program"
  - "dead code remediation phases"
  - "audit findings fix program"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation"
    last_updated_at: "2026-07-27T08:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Scaffolded nine remediation child phases from the audit findings"
    next_safe_action: "Operator approves per-phase finding sets; phase 002 is the lowest-risk start"
    blockers: []
    key_files:
      - "spec.md"
      - "../016-dead-code-and-architecture-audit/findings-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-017-findings-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which phase-009 subsystems does the operator approve for execution after assessment?"
    answered_questions:
      - "Remediation is gated behind verification; nothing is deleted on an unverified finding."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: Findings Remediation Phase Parent

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-speckit/028-memory-search-intelligence/001-release-cleanup` |
| **Predecessor** | `../016-dead-code-and-architecture-audit/spec.md` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The audit in phase 016 produced 88 findings across six categories. Six were independently re-verified, two were disproved, and eighty were path-checked but never claim-tested. Acting on that set as though it were uniformly reliable would break working code: one refuted finding declared a script dead that runs on every commit through an installed git hook.

### Purpose

Remediate the audit findings in a gated order that verifies before it deletes, groups work by remediation nature rather than discovery order, and sequences lowest blast radius first so confidence is earned before the risky phases begin.

> **Phase-parent note:** This spec.md is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Re-testing all 80 unverified findings and recording a disposition for each.
- Executing approved remediations across residue, dead code, legacy artifacts, misplacement, documentation drift, tooling contract drift, runtime mirror divergence, and over-engineering.
- Correcting the audit record where a finding is disproved.

### Out of Scope

- Acting on any finding that has not passed child 001 triage.
- New features, or refactors not traceable to a specific audit finding.
- `.opencode/specs/` content, which phase 014 owns.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Maintain | parent | Root purpose and child map |
| `description.json` | Generator-owned | parent | Search metadata |
| `graph-metadata.json` | Generator-owned | parent | Child identity and phase graph metadata |
| `001-findings-triage-and-verification/` | Create | 001 | Disposition for all 80 unverified findings |
| `002-repo-hygiene-and-residue/` | Create | 002 | Residue, ignore rules, committed temp output |
| `003-dead-code-removal/` | Create | 003 | Verified dead scripts, flags, deps, unreachable subcommands |
| `004-legacy-and-superseded-removal/` | Create | 004 | Superseded benchmark runs, fixtures, changelogs |
| `005-misplacement-and-layout/` | Create | 005 | Files contradicting documented layout |
| `006-hub-doc-runtime-drift/` | Create | 006 | Hub docs that disagree with their own registries |
| `007-deep-loop-and-cli-contract-drift/` | Create | 007 | Tooling contracts documenting behavior that does not exist |
| `008-runtime-mirror-and-mcp-config/` | Create | 008 | Mirror divergence and duplicated MCP config sources |
| `009-overengineering-simplification/` | Create | 009 | Simplification decisions for outsized subsystems |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Findings | Risk | Status |
|-------|--------|-------|----------|------|--------|
| 001 | `001-findings-triage-and-verification/` | Re-test every unverified finding; record CONFIRMED, REFUTED or DEFERRED per item | 83 | Gate | **COMPLETE** — 46 confirmed, 17 refuted, 20 deferred |
| 002 | `002-repo-hygiene-and-residue/` | Committed scratch residue, stale and duplicate ignore rules, rotated logs, dated benchmark output | 6 | Low | Planned |
| 003 | `003-dead-code-removal/` | Dead npm script, unused deps, unreachable CLI subcommands, orphan smoke scripts, hidden test file, broken config references | 5 | Low-Med | Planned |
| 004 | `004-legacy-and-superseded-removal/` | Superseded benchmark runs and fixtures, pre-v4 changelogs, removed-runtime leftovers | 4 | Low-Med | Planned |
| 005 | `005-misplacement-and-layout/` | Layout contradictions, personal config in a public repo, absolute workstation paths, dual SQLite state paths | 8 | Medium | Planned |
| 006 | `006-hub-doc-runtime-drift/` | Hub SKILL.md and README claims contradicting mode registries and on-disk reality | 12 | Medium | Planned |
| 007 | `007-deep-loop-and-cli-contract-drift/` | The `cli-devin` executor kind, dropped `--convergence-mode`, `--lineage-timeout-hours` ceiling, mirror-sync checker gap | 6 | Med-High | Planned |
| 008 | `008-runtime-mirror-and-mcp-config/` | Runtime mirror divergence and duplicated MCP config sources of truth | 2 | High | Planned |
| 009 | `009-overengineering-simplification/` | Outsized subsystems: resume and shadow-parity pair, launcher triplication, shared-payload triplication, always-off metrics, oversized pseudocode router | 3 | High | Planned |

### Phase Transition Rules

- **Child 001 is a hard gate.** No other child may act on a finding that 001 has not dispositioned CONFIRMED. This exists because two of the six claims re-tested during the audit were wrong, one of them dangerously.
- Phases run in ascending order. Blast radius rises monotonically, so each phase earns confidence for the next.
- Phases 002 through 005 are mechanical once verified. Phases 006 through 009 require a decision per finding about which side of the contradiction is correct.
- Phase 009 changes no behavior without an explicit operator decision per item; a simplification proposal is not an approval.
- Each child MUST pass `validate.sh --strict` independently before the next begins.
- **Doc-versus-runtime default (operator ruling, 2026-07-27):** where documentation and runtime disagree, the runtime is the intended truth and the documentation is corrected. Triage escalates only cases where the documentation describes something clearly intended but never built. Under this ruling the `cli-devin` executor-kind claim is a documentation fix, not a mandate to build an adapter.
- **Phase 009 scope (operator ruling, 2026-07-27):** assess every over-engineering finding, then execute only the items the operator approves, one subsystem at a time, behavior-preserving with a green suite before and after and a recorded rollback point.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| parent | 001 | Findings registry and normalized manual findings are available | Phase 016 `research/findings-registry.json` and `research/devin-findings.json` |
| 001 | 002-009 | Every finding carries a disposition and a re-runnable verification command | Child 001 disposition table |
| child | parent | Child closes | Update this phase map and roll up the changelog |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- After child 001 triage, which CONFIRMED findings does the operator approve for execution, and which are accepted as-is?
- For phases 006 through 009, is the documentation or the runtime the intended truth in each contradiction?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:ai-protocol -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [ ] Read `../016-dead-code-and-architecture-audit/findings-report.md` section 2 before touching any finding.
- [ ] Confirm the finding carries a phase-001 disposition of CONFIRMED. If it does not, stop.
- [ ] Re-verify the finding against current `HEAD`; a concurrent session has been active on this tree.
- [ ] Confirm the target file is in this phase's declared scope.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Verify before delete | Every removal needs a string-literal search across `.ts`, `.js`, `.cjs`, `.md`, `.yaml`, `.json` returning zero live callers. Import graphs alone are insufficient. |
| One phase at a time | Do not batch changes across phases; blast radius rises monotonically and each phase gates the next. |
| Decide, do not assume | For a documentation-versus-runtime contradiction, record which side is the intended truth before editing either. |
| Preserve behavior | Simplification and de-duplication change structure, not behavior. Behavior changes need an explicit operator decision. |
| Halt on surprise | If a finding does not reproduce, stop and record a refutation rather than adapting the claim to fit. |

### Escalation

Escalate to the operator when a finding's remediation would change behavior, when documentation and runtime disagree and neither is obviously correct, or when a removal target turns out to be reachable.

### Sign-Offs

| Gate | Owner | Criteria |
|------|-------|----------|
| Triage complete | Operator | 80/80 findings dispositioned |
| Per-phase execution | Operator | Approved finding list for that phase |
| Program close | Operator | Every finding either remediated, refuted, or explicitly accepted |
<!-- /ANCHOR:ai-protocol -->

---

## RELATED DOCUMENTS

- **Audit findings**: `../016-dead-code-and-architecture-audit/findings-report.md`
- **Packet parent**: `../spec.md`
- **Graph metadata**: `graph-metadata.json`
- **Child phases**: `001-findings-triage-and-verification/` through `009-overengineering-simplification/`
