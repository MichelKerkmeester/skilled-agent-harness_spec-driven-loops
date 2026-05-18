---
title: "Feature Specification: P2 remediation for 015 deep-review advisories"
description: "Close the nine P2 advisories from 015-mcp-server-mk-skill-advisor-rename and document the two shared-seam follow-ups from 011 D2b."
trigger_phrases:
  - "013/009/016"
  - "p2 remediation 015"
  - "mk_skill_advisor deep-review cleanup"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/016-deep-review-p2-remediation"
    last_updated_at: "2026-05-14T21:30:00Z"
    last_updated_by: "codex"
    recent_action: "P2 remediation committed and pushed"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: P2 remediation for 015 deep-review advisories

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 cleanup |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 015 deep review passed the `system_skill_advisor` to `mk_skill_advisor` rename but left nine P2 advisories: stale parent graph metadata, an env-var discoverability gap, build freshness evidence, three missing rename-invariant tests, and one stale advisor README validation path. D2b from packet 011 also flagged two shared-concern seams that need either extraction or explicit acceptance.

### Purpose

Close or document all 11 bounded items without changing locked ids, package ownership, or sibling packets.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Refresh parent `013/009/graph-metadata.json` entries for the mk-prefixed launcher and active child.
- Add `MK_SKILL_ADVISOR_DB_DIR` as the preferred database override while preserving `SYSTEM_SKILL_ADVISOR_DB_DIR` as a legacy fallback.
- Add advisor Vitest coverage for server id, launcher identity, and four runtime config entries.
- Rebuild advisor MCP output or otherwise verify build freshness.
- Fix the stale advisor validation command in README-adjacent documentation.
- Document acceptance of the two D2b shared seams in this packet.

### Out of Scope

- Tool id, server id, skill id, or folder renames.
- Moving the two shared seams into `@spec-kit/shared`; the utilities remain advisor-source-of-truth until a dedicated extraction packet.
- Editing sibling packets 001 through 015.
- Runtime database state and parallel-session dirty files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/.../013/009/graph-metadata.json` | Modify | Replace stale launcher path/entity/trigger and register child 016 as active. |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | Prefer `MK_SKILL_ADVISOR_DB_DIR`, keep legacy fallback. |
| `.opencode/skills/system-skill-advisor/mcp_server/**` | Modify/Create | Align env var reads and add rename-invariant Vitest coverage. |
| `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.gemini/settings.json` | Modify | Update DB override notes. |
| `.opencode/skills/system-skill-advisor/{README.md,SET-UP_GUIDE.md,ARCHITECTURE.md,references/db-path-policy.md}` | Modify | Update validation and env-var documentation. |
| `.opencode/specs/.../016-deep-review-p2-remediation/*` | Create | Level 2 packet documentation and metadata. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve locked ids and boundaries. | `mk_skill_advisor` server id, public `advisor_*` and `skill_graph_*` tool ids, and `system-skill-advisor` folder remain unchanged. |
| REQ-002 | Keep changes inside the whitelist. | `git diff --name-only` contains only scoped remediation and packet files. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Close architecture P2s F-001 through F-003. | Parent metadata no longer references `.opencode/bin/skill-advisor-launcher.cjs`, old launcher entity, or `system_skill_advisor next steps`. |
| REQ-004 | Close correctness P2 F-004. | All DB dir readers prefer `MK_SKILL_ADVISOR_DB_DIR` and keep `SYSTEM_SKILL_ADVISOR_DB_DIR` as fallback. |
| REQ-005 | Close robustness P2 F-005. | Advisor MCP build runs after source changes and completion docs record freshness evidence. |
| REQ-006 | Close testing P2s F-006 through F-008. | New Vitest assertions cover server registration, launcher state identity, and config parity. |
| REQ-007 | Close documentation P2 F-009. | Advisor validation docs point at the standalone advisor package test command. |
| REQ-008 | Resolve the two D2b shared seams. | This packet documents accepted-as-is decisions for the two neutral re-export seams. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 9 deep-review P2 advisories are fixed or explicitly addressed.
- **SC-002**: Both D2b shared seams are documented as accepted-as-is with rationale.
- **SC-003**: Advisor Vitest remains at least 291 tests passing.
- **SC-004**: Strict validation passes for packet 016 and parent 013/009.
- **SC-005**: One authorized commit lands on `main` and pushes successfully.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Env var precedence changes behavior for users setting both names. | Low | Prefer mk-prefixed variable and document the legacy fallback. |
| Risk | Static rename tests can miss dynamic MCP construction refactors. | Low | Assert source registration plus runtime config parity; future refactors should update tests with the new public identity source. |
| Dependency | Advisor package Vitest/build tooling. | Medium | Use existing `npm test` and `npm run build` from the advisor package. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime hot-path work beyond one env-var coalescing expression.
- **NFR-P02**: Rename-invariant tests remain static file checks and do not launch the MCP server.

### Security
- **NFR-S01**: No secrets or database runtime files are committed.
- **NFR-S02**: Runtime DB override remains explicit through environment variables only.

### Reliability
- **NFR-R01**: Existing `SYSTEM_SKILL_ADVISOR_DB_DIR` consumers continue to work.
- **NFR-R02**: New `MK_SKILL_ADVISOR_DB_DIR` behavior is covered by code review and package tests.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Both env vars unset: use package-local advisor database.
- Only `SYSTEM_SKILL_ADVISOR_DB_DIR` set: use legacy fallback.
- Both env vars set: `MK_SKILL_ADVISOR_DB_DIR` wins.

### Error Scenarios
- Build artifacts stale: run `npm run build` before final verification.
- Config drift: `rename-invariants.vitest.ts` fails when one runtime config diverges.
- Shared seams need extraction later: current acceptance is documented, not silent.

### State Transitions
- Parent active child moves from 015 to 016.
- Packet starts as in-progress and moves to complete only after verification.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Several files, all bounded to one rename cleanup. |
| Risk | 9/25 | Env-var precedence is the main behavioral change. |
| Research | 11/20 | Required review ledger plus D2b seam classification. |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Gate 3, branch policy, commit authorization, and scope are pre-answered by the operator.
<!-- /ANCHOR:questions -->
