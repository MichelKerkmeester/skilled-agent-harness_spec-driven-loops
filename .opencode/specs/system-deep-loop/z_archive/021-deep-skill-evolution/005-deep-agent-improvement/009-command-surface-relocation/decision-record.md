---
title: "Decision Record: Deep Agent Improvement Command Surface Relocation"
description: "Decision record for removing the improve command group, promoting /deep:start-agent-improvement-loop and /prompt as canonical surfaces, and rewriting historical references."
trigger_phrases:
  - "decision record deep agent command relocation"
  - "remove improve command aliases"
  - "canonical prompt command decision"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/005-deep-agent-improvement/009-command-surface-relocation"
    last_updated_at: "2026-05-24T06:47:43Z"
    last_updated_by: "codex"
    recent_action: "recorded command-surface decisions"
    next_safe_action: "verify implementation results"
    blockers: []
    key_files:
      - ".opencode/commands/deep/start-agent-improvement-loop.md"
      - ".opencode/commands/prompt.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000013"
      session_id: "codex-2026-05-24-command-surface-relocation"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions:
      - "Compatibility aliases are intentionally not kept."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Deep Agent Improvement Command Surface Relocation

<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Remove the improve command group

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-24 |
| **Deciders** | User, Codex |

<!-- ANCHOR:adr-001-context -->
### Context

The agent improvement command already belongs conceptually to the deep-loop family, and the prompt command has been moved to the root command directory. Keeping `the legacy agent-improvement command` or `the legacy prompt-improvement command` as aliases would make the command surface harder to reason about and would preserve references to a folder the user explicitly asked to delete.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: remove the `improve/` command group and make `/deep:start-agent-improvement-loop` plus `/prompt` the canonical public surfaces.

**How it works**: The agent command lives under `.opencode/commands/deep/` and loads `deep_start-agent-improvement-loop_{auto,confirm}.yaml`. The prompt command lives at `.opencode/commands/prompt.md`. Gemini mirrors delegate to those OpenCode specs instead of embedding stale command bodies.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Remove aliases and rewrite references | Clean command surface; no stale folder path | Requires broad docs/archive rewrite | 9/10 |
| Keep compatibility aliases | Less disruption for old callers | Contradicts requested deletion and keeps old names alive | 4/10 |
| Move files only, leave docs historical | Fast | Fails the user's "entire repo" policy and grep gate | 2/10 |

**Why this one**: The user explicitly requested no compatibility alias and repo-wide cleanup, so correctness is measured by a clean old-reference gate rather than preserving historical command text.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Operators see a single deep-loop entrypoint for agent improvement.
- Prompt improvement is available as the short root `/prompt` command.
- Runtime mirrors no longer point at deleted command folders.

**What it costs**:

- Historical transcripts and archives no longer preserve the exact old command text. Mitigation: this was an explicit user choice for this migration.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| External docs outside this repo still mention old commands | Medium | Report the repo-local cleanup and leave external cleanup for a separate task |
| Hidden mirror files reintroduce aliases | High | Search hidden files and verify `.gemini/commands` inventory |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The old command group is deleted, so stale references break routing |
| 2 | **Beyond Local Maxima?** | PASS | Alias and docs-only alternatives were considered |
| 3 | **Sufficient?** | PASS | Exact replacement plus manual live-surface normalization covers the requested scope |
| 4 | **Fits Goal?** | PASS | Directly implements the public surfaces named by the user |
| 5 | **Open Horizons?** | PASS | Deep command family remains coherent for future loop commands |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes

Implementation uses file moves for assets/mirrors, exact-string replacement for repo-wide old references, and manual review for command indexes and runtime mirrors.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
