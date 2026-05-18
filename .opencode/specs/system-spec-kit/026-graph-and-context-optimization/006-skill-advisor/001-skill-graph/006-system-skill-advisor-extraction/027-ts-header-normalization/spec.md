---
title: "Feature Specification: TypeScript Header Normalization"
description: "Normalize TypeScript source module headers found by the packet 026 sk-code audit."
trigger_phrases:
  - "027"
  - "ts header normalization"
  - "sk-code follow-on"
importance_tier: "high"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/027-ts-header-normalization"
    last_updated_at: "2026-05-15T12:04:51Z"
    last_updated_by: "codex"
    recent_action: "Closed packet 026 sk-code follow-on ledger"
    next_safe_action: "Use verification evidence before any future expansion"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: TypeScript Header Normalization

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
| **Audit Bucket** | 79 audit findings: 78 TypeScript source headers fixed, 1 deleted path marked not applicable. Declaration headers are handled in 028. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 026 recorded unresolved sk-code violations after the README coverage sweep. This packet closes its assigned ledger slice without renaming tools, changing subsystem topology, or touching unrelated dirty files.

### Purpose
Normalize TypeScript source module headers found by the packet 026 sk-code audit.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 78 existing `.ts`/`.tsx`/`.mts` files across deep-agent-improvement, system-code-graph, system-skill-advisor, and system-spec-kit.
- Source-of-truth ledger: `026-sk-code-and-code-readme-audit/audit-report.md`.
- Surgical, annotation-only edits plus packet documentation and metadata.

### Out of Scope
- Broader verifier warnings outside packet 026 - hard whitelist limits this dispatch.
- Tool-id, server-id, skill-id, package-boundary, or architecture changes.
- Refactors larger than the annotation/header work needed to close the finding.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Audited code files | Modify/Review | Added or normalized sk-code `MODULE:` header blocks without adding TypeScript `use strict` or changing imports/logic. |
| This packet folder | Create | Level 2 docs plus metadata. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Read packet 026 audit report before edits. | Audit ledger bucket and counts are captured in this spec. |
| REQ-002 | Close every assigned finding as fixed or not applicable. | Ledger closure script reports zero failures for packet 027. |
| REQ-003 | Keep edits behavior-neutral. | Diff contains header, strict-mode, declaration, or type-review changes only. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Preserve hard scope and dirty worktree boundaries. | Staging excludes unrelated dirty database and cli-devin files. |
| REQ-005 | Run targeted verification. | Typecheck, ledger check, and packet validation evidence is recorded. |
| REQ-006 | Document exceptions explicitly. | Any not-applicable finding is named in implementation-summary.md. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every existing TypeScript source finding has a `MODULE:` marker within the first 40 lines.
- **SC-002**: **Given** the packet 026 audit ledger, **When** this packet is checked, **Then** no assigned finding remains silent or unclassified.
- **SC-003**: **Given** the modified files, **When** TypeScript or language checks run, **Then** they pass or identify only existing out-of-scope baseline failures.
- **SC-004**: **Given** the Level 2 packet docs, **When** strict validation runs, **Then** the packet validates successfully.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing audit ledger | Wrong buckets could leave silent skips. | Parsed the markdown ledger and rechecked all 121 rows. |
| Risk | Generated or sidecar files | Rebuild could churn unrelated outputs. | Used surgical edits where rebuild ownership was mixed. |
| Risk | Existing dirty worktree | Accidental staging could capture parallel work. | Stage only packet-specific docs and audited code files. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. `.opencode/skills/system-spec-kit/mcp_server/lib/context/budget-allocator.ts` no longer exists on main and is recorded as not applicable.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Header/type annotation work must not add runtime hot-path behavior.
- **NFR-P02**: Verification commands must run locally without network-dependent services.

### Security
- **NFR-S01**: No secrets, credentials, or permission broadening introduced.
- **NFR-S02**: Existing path and workspace safety boundaries remain unchanged.

### Reliability
- **NFR-R01**: Typechecks remain green after the packet changes.
- **NFR-R02**: Tests show no new regression attributable to this packet.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty audit bucket: not applicable here because packet 026 contains assigned rows.
- Missing file: classify as not applicable only when absent on current `main`.
- Invalid generated owner: prefer surgical sync over broad rebuild churn.

### Error Scenarios
- Typecheck failure: stop and inspect before commit.
- Validation failure: repair packet docs before claiming closure.
- Existing baseline test failure: record exact failing test and do not hide it.

### State Transitions
- Partial completion: commit only completed packet slices.
- Session expiry: implementation-summary.md and parent handover carry resume state.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Multi-file audit follow-on, but edits are mechanical. |
| Risk | 10/25 | Low behavior risk; generated sidecars require care. |
| Research | 8/20 | Requires sk-code references and packet 026 ledger. |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
