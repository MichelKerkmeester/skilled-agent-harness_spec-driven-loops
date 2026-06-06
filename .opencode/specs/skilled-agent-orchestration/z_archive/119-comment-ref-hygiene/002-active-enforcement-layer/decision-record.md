---
title: "Decision Record: Active enforcement layer for comment hygiene"
description: "ADR-001: OpenCode gap. ADR-002: Codex gap. ADR-003: Gemini gap. ADR-004: Devin gap."
trigger_phrases:
  - "comment hygiene gap ADR"
  - "opencode write hook gap"
  - "codex comment hygiene"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/119-comment-ref-hygiene/002-active-enforcement-layer"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-sonnet-4-6"
    recent_action: "Gap ADRs documented"
    next_safe_action: "None; ADRs complete"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Active Enforcement Layer — Runtime Gaps

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->

---

<!-- ANCHOR:adr-log -->
## ADR Log

| ID | Decision | Status |
|----|----------|--------|
| ADR-001 | OpenCode: rely on pre-commit gate (no write-time hook available) | Accepted |
| ADR-002 | Codex CLI: rely on pre-commit gate (no write-time hook available) | Accepted |
| ADR-003 | Gemini CLI: rely on pre-commit gate (no write-time hook available) | Accepted |
| ADR-004 | Devin: rely on pre-commit gate (no write-time hook available) | Accepted |
<!-- /ANCHOR:adr-log -->

---

<!-- ANCHOR:adrs -->
## ADR-001 — OpenCode: No Write-Time Hook

**Status**: Accepted
**Context**: OpenCode's plugin API exposes only session.*, message.*, and server lifecycle events. No post-tool-use or file-write event exists that could call an external script after a file is written. The experimental.chat.system.transform hook fires at prompt time, not after a file write.
**Decision**: Rely on the pre-commit gate (.opencode/hooks/pre-commit) for OpenCode sessions. The gate is runtime-agnostic and catches all violations at commit time regardless of which AI wrote the code.
**Consequences**: OpenCode sessions get no real-time warning during writing, only a commit-time block. Acceptable: the pre-commit gate is the mandatory floor for all runtimes.

---

## ADR-002 — Codex CLI: No Write-Time Hook

**Status**: Accepted
**Context**: Codex CLI supports UserPromptSubmit and SessionStart hooks (when codex_hooks=true is enabled in config). No PreToolUse or PostToolUse hook for file-write operations exists in the current Codex hook contract.
**Decision**: Rely on the pre-commit gate for Codex CLI sessions.
**Consequences**: Same as ADR-001. Codex-authored code is caught at commit time.

---

## ADR-003 — Gemini CLI: No Write-Time Hook

**Status**: Accepted
**Context**: Gemini CLI hook vocabulary covers SessionStart, PreCompress, BeforeAgent, and SessionEnd. No post-tool-use or file-write event is available.
**Decision**: Rely on the pre-commit gate for Gemini CLI sessions.
**Consequences**: Same as ADR-001.

---

## ADR-004 — Devin: No Write-Time Hook

**Status**: Accepted
**Context**: Devin does not expose a write-time or post-tool-use hook in its current configuration.
**Decision**: Rely on the pre-commit gate for Devin sessions.
**Consequences**: Same as ADR-001. The pre-commit gate covers all four runtimes with a single script.
<!-- /ANCHOR:adrs -->
