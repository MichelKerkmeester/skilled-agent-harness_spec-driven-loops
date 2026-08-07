---
title: "Decision Record: Deprecate project .gemini runtime surface"
description: "Decision record for deleting project .gemini while preserving external Gemini CLI support and historical specs."
trigger_phrases:
  - "gemini deprecation decision"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/021-cli-gemini-deprecation/001-runtime-surface-and-skill-deletion"
    last_updated_at: "2026-06-05T06:55:00Z"
    last_updated_by: "opencode"
    recent_action: "Accepted decision to delete project .gemini"
    next_safe_action: "Implement deletion and reference cleanup"
    blockers: []
    key_files:
      - ".gemini/**"
      - ".opencode/commands/**"
      - ".opencode/skills/**"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "gemini-deprecation-2026-06-05"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Deprecate project .gemini runtime surface

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Delete project `.gemini` while preserving external Gemini CLI support

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-05 |
| **Deciders** | User, OpenCode |

---

<!-- ANCHOR:adr-001-context -->
### Context

The repo still carries a project `.gemini/` runtime mirror with agents, commands, workflows, MCP config, and symlinks. The user requested deletion of that project directory and clarified that all specs are historical records for cleanup purposes.

### Constraints

- Do not sweep historical specs for `.gemini` references.
- Delete the `cli-gemini` skill completely per the user's clarification.
- Keep user-home Gemini documentation such as `~/.gemini` and `.geminiignore` when it describes installed Gemini CLI behavior.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: delete the checked-in project `.gemini` surface, delete the checked-in `cli-gemini` skill, and update active non-spec repo references that depend on either deleted surface.

**How it works**: Remove tracked files under `.gemini/**` and `.opencode/skills/cli-gemini/**`. Update active docs, command assets, runtime capability manifests, scripts, tests, skill catalogs, and advisor routing so they no longer require project `.gemini/settings.json`, `.gemini/agents`, other project `.gemini` paths, or a live `cli-gemini` skill.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Delete project `.gemini`, delete `cli-gemini`, and update active references** | Matches clarified user request and removes stale routing targets | Requires broad docs/tests/source cleanup | 10/10 |
| Keep `.gemini` as a tombstone | Minimizes immediate test churn | Violates explicit deletion request and can still attract future references | 3/10 |
| Delete only project `.gemini` and preserve `cli-gemini` | Preserves Google Gemini CLI delegation docs | Violates the clarified request that the skill be deleted completely | 2/10 |

**Why this one**: It directly satisfies the clarified deletion scope while still avoiding a historical or user-home documentation sweep.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Maintainers no longer need to keep a Gemini project runtime mirror in sync with OpenCode, Claude, or Codex surfaces.
- Active setup docs and tests stop depending on a deleted project path.

**What it costs**:
- Existing parity tests and docs that included `.gemini` must be rewritten. Mitigation: use targeted test runs and exact path searches.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Deleted path still referenced by active tests | H | Update tests and run targeted suites. |
| User-home docs accidentally removed | M | Scope searches to project `.gemini` paths and preserve `~/.gemini`. |
| Specs still contain historical mentions | L | Preserve them as the user requested. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User explicitly requested deletion of the project `.gemini` surface. |
| 2 | **Beyond Local Maxima?** | PASS | Considered tombstone and full Gemini CLI removal alternatives. |
| 3 | **Sufficient?** | PASS | Deletion plus active-reference cleanup solves the stated problem. |
| 4 | **Fits Goal?** | PASS | Work is directly on the requested deprecation path. |
| 5 | **Open Horizons?** | PASS | Reduces mirror maintenance and removes stale skill routing. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Delete `.gemini/**` tracked project runtime files.
- Delete `.opencode/skills/cli-gemini/**` tracked skill files.
- Update active docs, command assets, source files, manifests, and tests that list project `.gemini` paths.
- Remove `cli-gemini` from active catalogs, graph metadata, and advisor fallback routing.

**How to roll back**: Restore `.gemini/**` and all edited references from git only if the user cancels this deprecation. Do not recreate a partial `.gemini` directory as a compatibility shim.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
