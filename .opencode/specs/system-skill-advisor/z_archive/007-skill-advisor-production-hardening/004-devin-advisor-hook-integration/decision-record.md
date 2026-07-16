---
title: "Decision Record: CLI Devin Skill Advisor Hook"
description: "Accepted ADRs for Devin variant strategy, mk-skill-advisor plugin rename, and advisor bridge ownership migration."
trigger_phrases:
  - "ADR"
  - "decision"
  - "skill-advisor"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/007-skill-advisor-production-hardening/004-devin-advisor-hook-integration"
    last_updated_at: "2026-05-15T17:30:00Z"
    last_updated_by: "cli-codex-phase-b"
    recent_action: "Phase B synthesis complete"
    next_safe_action: "Phase C implementation"
    blockers: []
    key_files:
      - "decision-record.md"
    completion_pct: 40
    open_questions: []
    answered_questions: []
---

# Decision Record: CLI Devin Skill Advisor Hook

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---
<!-- ANCHOR:adr-001 -->
## ADR-001: Devin Variant Location Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | ACCEPTED |
| **Date** | 2026-05-15 |
| **Deciders** | Packet owner, cli-codex Phase B |
| **Related Findings** | F001/Q1, F002/Q2, F003/Q3 |

---
<!-- ANCHOR:adr-001-context -->
### Context

Phase A found that Devin documents Claude-compatible hooks but does not explicitly document `hookSpecificOutput.additionalContext` for advisor-style `UserPromptSubmit` context injection. The empirical test was blocked by the self-invocation constraint (`research/iterations/iteration-01.md`). Existing advisor hooks are skill-owned under `.opencode/skills/system-skill-advisor/hooks/{claude,gemini,codex}/`, and the skill-owned pattern keeps code locality, runtime contract clarity, diagnostics, and tests together (`research/iterations/iteration-02.md`).

### Constraints

- Devin live verification cannot be performed by self-invoking cli-devin during Phase B.
- Phase C must not rely solely on undocumented inheritance behavior.
<!-- /ANCHOR:adr-001-context -->

---
<!-- ANCHOR:adr-001-decision -->
### Decision

Use a hybrid strategy:

1. Implement an explicit skill-owned Devin variant at `.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts`.
2. Keep `.devin/config.json` `read_config_from.claude=true` as an inheritance safety net.
3. In Phase D, verify whether both paths fire. If double-firing appears, either disable inheritance for hooks or rely on Devin deduplication only with evidence.
<!-- /ANCHOR:adr-001-decision -->

---
<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| A: Skill-owned explicit variant only | Clear ownership; testable; mirrors existing advisor runtime tree. | More code and config than pure inheritance. | Part of chosen hybrid. |
| B: Devin-local hook source | Keeps Devin files near `.devin`. | No repo precedent; creates cross-boundary dependency and weaker deletion safety. | Rejected. |
| C: Inheritance only | Zero code if Devin imports Claude hooks correctly. | Q1 remains low-confidence; no explicit Devin fixture or registration. | Retained only as safety net. |
<!-- /ANCHOR:adr-001-alternatives -->

---
<!-- ANCHOR:adr-001-consequences -->
### Consequences

- Small dist increase for one hook variant.
- Possible redundant firing between Devin-native variant and inherited Claude variant.
- Phase D must include live `/hooks` and prompt smoke evidence.
- The hook implementation remains close to advisor code and tests.
<!-- /ANCHOR:adr-001-consequences -->

---
<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| Check | Result |
|-------|--------|
| Simplicity | Hybrid is slightly more code but avoids relying on undocumented behavior alone. |
| Performance | Hook stays under timeout and fails open; no heavy work added. |
| Maintainability | Skill-owned source matches existing advisor pattern. |
| Scope | Limited to Devin `UserPromptSubmit`; no unrelated runtime changes. |
| Sustainability | Inheritance safety net can be revisited after live Devin proof. |
<!-- /ANCHOR:adr-001-five-checks -->

---
<!-- ANCHOR:adr-001-impl -->
### Implementation Notes

- Mirror Claude variant behavior from `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`.
- Compile to `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/devin/user-prompt-submit.js`.
- Register with `DEVIN_PROJECT_DIR` in `.devin/hooks.v1.json`.
- Evidence: `research/iterations/iteration-02.md` and `research/iterations/iteration-03.md`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

## ADR-002: Plugin Rename Strategy

| Field | Value |
|-------|-------|
| **Status** | ACCEPTED |
| **Date** | 2026-05-15 |
| **Related Findings** | F004/Q4, F009/Q9 |

### Context

Phase A found 293 files referencing `spec-kit-skill-advisor`. Current owned surfaces include `.opencode/plugins/spec-kit-skill-advisor.js`, the `PLUGIN_ID` constant, plugin README entries, docs, tests, feature catalog, manual testing playbook, and the legacy bridge path. Historical references in `z_archive/`, changelogs, and frozen spec history are hands-off.

### Decision

Perform a full current-surface rename from `spec-kit-skill-advisor` to `mk-skill-advisor`:

- Rename plugin file to `.opencode/plugins/mk-skill-advisor.js`.
- Change `PLUGIN_ID` to `mk-skill-advisor`.
- Rename/move the bridge per ADR-003.
- Update current docs, tests, feature catalog, and manual testing playbook.
- Retain `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` as a backcompat alias.
- Add canonical `MK_SKILL_ADVISOR_PLUGIN_DISABLED` and `MK_SKILL_ADVISOR_HOOK_DISABLED`; retain `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`.

### Alternatives Considered

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| A: Symbolic rename only with compatibility layer | Lowest immediate churn. | Leaves stale current refs and prolongs extraction-era naming. | Rejected. |
| B: Full rename with env-var compatibility | Aligns current name while preserving deployments. | Requires broad current-doc/test updates. | Accepted. |
| C: Full rename and remove legacy env vars | Cleanest naming. | Breaks legacy consumers unnecessarily. | Rejected. |

### Consequences

- Roughly 293 references must be classified; only current refs should change.
- OpenCode plugin cache may need cold-start validation.
- Legacy users keep env-var behavior.
- Phase ordering is rename first, Devin variant second, so tests target the final plugin identity.

### Five-Checks

| Check | Result |
|-------|--------|
| Simplicity | One final name, one compatibility layer. |
| Performance | No runtime cost beyond env-var checks. |
| Maintainability | Current docs/tests stop carrying extraction-era plugin names. |
| Scope | Historical archives remain untouched. |
| Sustainability | New `MK_*` names become canonical while legacy aliases can be retired in a future packet. |

### Implementation Notes

- Run case-insensitive grep before and after rename.
- Exclude `z_archive/`, changelogs, and historical spec docs from cleanup.
- Update tests that currently assert old env-var names to assert both old and new behavior.

## ADR-003: Bridge Ownership Migration

| Field | Value |
|-------|-------|
| **Status** | ACCEPTED |
| **Date** | 2026-05-15 |
| **Related Findings** | F005/Q5, F006/Q6 |

### Context

Phase A found no duplicate advisor bridge under `system-skill-advisor`; the only bridge lives at `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs`. That is legacy pre-extraction placement. Keeping it there means the extracted advisor plugin still depends on `system-spec-kit` ownership for its bridge.

### Decision

Move and rename the bridge to `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`. Update the plugin import path and current bridge tests. Preserve ignore/build behavior for the new directory.

### Alternatives Considered

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| A: Move bridge to advisor ownership | Matches extraction boundary and current plugin name. | Requires one file move plus import/test updates. | Accepted. |
| B: Leave bridge in system-spec-kit | Fewer changes. | Keeps ownership misalignment and stale plugin identity. | Rejected. |

### Consequences

- One bridge file move.
- One plugin import path flip plus test/doc updates.
- `system-spec-kit` no longer owns the advisor bridge.
- Post-extraction grep should show only justified shared utility/build/shim references.

### Five-Checks

| Check | Result |
|-------|--------|
| Simplicity | The bridge lives with the skill it serves. |
| Performance | No runtime behavior change expected. |
| Maintainability | Ownership follows extraction boundary. |
| Scope | Only the advisor bridge moves; shared utilities remain untouched. |
| Sustainability | Future advisor plugin work no longer edits legacy bridge location. |

### Implementation Notes

- Create `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/` if absent.
- Flip plugin bridge path in `.opencode/plugins/mk-skill-advisor.js`.
- Update `.gitignore` or package includes only if the new directory is excluded by existing patterns.
