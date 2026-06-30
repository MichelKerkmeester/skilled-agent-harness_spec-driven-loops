---
title: "Decision Record: Deprecate cli-codex skill and operational references"
description: "Decision to retire cli-codex from active OpenCode routing while preserving historical archive records."
trigger_phrases:
  - "cli-codex deprecation decision"
  - "codex cli retirement adr"
  - "operational archive boundary"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/122-cli-codex-deprecation"
    last_updated_at: "2026-06-30T06:40:00Z"
    last_updated_by: "opencode"
    recent_action: "Accepted operational retirement boundary for cli-codex"
    next_safe_action: "Apply source cleanup and verify graph/test fallout"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/"
      - ".opencode/skills/deep-loop-runtime/"
      - ".opencode/skills/system-skill-advisor/"
    session_dedup:
      fingerprint: "sha256:951b82df8b7b03d01f3aecac83cfb367798059f3291c5484a195365fe50d8a33"
      session_id: "159-cli-codex-deprecation-plan"
      parent_session_id: null
    completion_pct: 35
    open_questions: []
    answered_questions:
      - "Historical archive records are not runtime guidance and remain out of scope."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Deprecate cli-codex skill and operational references

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Operational retirement with archive preservation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-30 |
| **Deciders** | User, OpenCode |

---

<!-- ANCHOR:adr-001-context -->
### Context

`cli-codex` appears in active OpenCode skill discovery, executor routing, command assets, agents, docs, tests, and generated metadata. The user asked to deprecate the skill and all operational mentions, so a doc-only warning would leave live routes and advertisements behind.

### Constraints

- Active runtime docs and code must not route to a deleted or deprecated skill.
- Historical specs, changelogs, and run logs are audit records and should not be rewritten unless consumed by runtime tooling.
- Generic Codex runtime hook support is separate from the `cli-codex` skill and should remain unless it names the retired skill/executor kind.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: retire `cli-codex` from active operational surfaces, including the discoverable skill identity and executor kind, while preserving historical archive records.

**How it works**: Delete or make non-discoverable the skill package, remove executor-kind support, remove command/advisor/doc references, and rebuild checked-in graph metadata. Final verification uses targeted tests and scoped grep that excludes historical archive paths but includes generated metadata that can affect routing.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Operational retirement with archive preservation** | Removes live routes and stale guidance while keeping audit history stable. | Requires coordinated edits across runtime, docs, tests, and metadata. | 9/10 |
| Soft-deprecate docs only | Smallest immediate diff. | Leaves advisor, commands, and executors advertising or dispatching the retired path. | 4/10 |
| Remove skill folder only | Fast way to stop skill discovery. | Creates broken references and missing-skill routes in active surfaces. | 3/10 |
| Rewrite every historical mention | Satisfies a literal global grep. | Rewrites audit history and large generated run artifacts without runtime value. | 2/10 |

**Why this one**: It solves the operational problem now without corrupting historical context or creating broken runtime references.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Operators no longer see `cli-codex` as an available skill or executor choice.
- Advisor recommendations and deep-loop command assets stay aligned with supported executor surfaces.

**What it costs**:
- Tests and docs that used `cli-codex` as a representative external executor need replacement examples. Mitigation: retarget to supported executors or assert retired-kind rejection.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Generated graph cache keeps stale node | H | Rebuild or update skill graph artifacts and verify no node remains. |
| Raw executor support remains after docs cleanup | H | Remove deep-loop runtime and command asset support in same packet. |
| Over-broad cleanup removes generic Codex runtime docs | M | Keep references that do not name `cli-codex` and document the distinction. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User explicitly requested deprecation and all operational mentions. |
| 2 | **Beyond Local Maxima?** | PASS | Considered doc-only, folder-only, full history rewrite, and operational retirement. |
| 3 | **Sufficient?** | PASS | Removes live routes without rewriting archival records. |
| 4 | **Fits Goal?** | PASS | Directly targets skills, commands, READMEs, advisor, agents, and executor support. |
| 5 | **Open Horizons?** | PASS | Leaves room for a future supported OpenAI executor without stale `cli-codex` coupling. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Retire `.opencode/skills/cli-codex/` from active skill discovery.
- Remove `cli-codex` from deep-loop runtime, command assets, advisor routes, matrix runner, docs, agents, mirrors, and tests.
- Regenerate or update skill graph metadata and document archival exceptions.

**How to roll back**: Restore deleted and modified files from git, rebuild skill graph metadata, rerun advisor/deep-loop targeted tests, and verify `cli-codex` is again discoverable only if rollback is intentional.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
