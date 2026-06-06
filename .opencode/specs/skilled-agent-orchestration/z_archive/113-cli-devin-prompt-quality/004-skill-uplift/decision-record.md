---
title: "Decision Record: Skill Uplift"
description: "ADR-001: No 4-runtime mirror for cli-devin skill changes (skill, not agent)."
trigger_phrases:
  - "113/004 decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/113-cli-devin-prompt-quality/004-skill-uplift"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded decision-record.md with ADR-001"
    next_safe_action: "Add ADRs if uplift uncovers new architectural choices"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114044"
      session_id: "114-004-decisions"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Skill Uplift

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: No 4-runtime mirror for cli-devin skill changes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-05-16 |
| **Deciders** | Main agent (operator-confirmed via memory rule scope) |

---

<!-- ANCHOR:adr-001-context -->
### Context

Memory `feedback_new_agent_mirror_all_runtimes` specifies: "New agents must mirror to all 4 runtimes — .opencode/.md → .claude/.md + .gemini/.md + .codex/.toml (workspace-write sandbox + Path Convention adjusted) + 4 README.txt + root README.md count". This rule applies to AGENTS — top-level decision-making entities. cli-devin is a SKILL — a tooling extension loaded by agents on-demand. Skills live exclusively in `.opencode/skills/`. There is no Claude/Codex/Gemini equivalent of a skill; those runtimes load agents via their respective directories but don't have a parallel skill-loading mechanism.

### Constraints

- Memory rule explicitly scopes to "agents" not "skills"
- `.opencode/skills/cli-devin/` is the canonical skill location
- Mirror writes would create stale duplicates with no consumer
- Future skill updates would need same exemption — establishing precedent
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Skill changes stay in `.opencode/skills/cli-devin/`. No mirror writes to `.claude/`, `.codex/`, or `.gemini/`.

**How it works**: Phase 2 edits are all scoped to `.opencode/skills/cli-devin/` tree. REQ-004 enforces this via git status check. Future cli-devin updates inherit this scope rule.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **No mirror (chosen)** | Smaller diff, no stale duplicates, correct rule scoping | Need to document the agent-vs-skill distinction | 9/10 |
| Mirror to all 4 runtimes | Consistent with agent rule | Memory rule doesn't apply; creates stale files | 3/10 |
| Mirror to .codex/ only (since codex is most agent-like) | Partial consistency | Still creates a stale file with no consumer | 4/10 |

**Why this one**: The memory rule is unambiguous about "agents". Stretching it to skills creates artifacts that drift and confuse future readers. Document the distinction clearly in this ADR so future skill updates inherit the rule.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Faster review (smaller diff)
- No mirror-sync overhead in future cli-devin maintenance
- Sets correct precedent for other skill updates

**What it costs**:
- Future readers from Claude / Codex / Gemini runtimes don't see cli-devin updates. Mitigation: cli-devin already documents itself as OpenCode-only in its top-level README; verify before commit.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future maintainer mirrors cli-devin to other runtimes thinking it's an agent | L | This ADR documents the distinction; cite from changelog v1.0.5.0 |
| User invokes cli-devin from .claude/ context expecting it to exist | L | cli-devin README + skill_advisor exposes scope clearly |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Memory rule scope is real; explicit ADR prevents future confusion |
| 2 | **Beyond Local Maxima?** | PASS | Considered partial-mirror and full-mirror alternatives |
| 3 | **Sufficient?** | PASS | One ADR documents the distinction; no further policy needed |
| 4 | **Fits Goal?** | PASS | Keeps uplift scope tight; serves correct mirror policy |
| 5 | **Open Horizons?** | PASS | Pattern applies to all future skill updates |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- REQ-004 enforces scope-boundary at commit time (`git status` check)
- v1.0.5.0 changelog cites this ADR for the no-mirror rationale
- Future skill packets reference this ADR if they need to document the same distinction

**How to roll back**: If future Claude/Codex/Gemini runtimes adopt a skill-loading mechanism, revisit this ADR and define the mirror policy then. Until that day, no rollback needed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
