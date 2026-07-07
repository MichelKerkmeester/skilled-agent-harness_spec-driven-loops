---
title: "Resource Map: Multi-AI Council write authority"
description: "Path ledger for packet 098 files analyzed, updated, and created."
trigger_phrases:
  - "098 resource map"
  - "council write authority paths"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/018-multi-ai-council-write-authority"
    last_updated_at: "2026-05-08T23:15:00Z"
    last_updated_by: "codex"
    recent_action: "Authored resource map"
    next_safe_action: "Fix Codex mirror and rerun validation"
    blockers:
      - ".codex/agents/multi-ai-council.toml is not writable in current sandbox (EPERM)"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "council-write-authority-2026-05-08-codex"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 27
- **By category**: Documents=3, Agents=4, Skills=8, Specs=12, Tests=4
- **Missing on disk**: 0
- **Scope**: files analyzed, created, or updated during packet 098 implementation attempt
- **Generated**: 2026-05-08T23:15:00+02:00
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:documents -->
## 2. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md | Updated | OK | Added v1.2 audit events. |
| .opencode/skills/system-spec-kit/references/multi-ai-council/folder-layout.md | Updated | OK | Flipped canonical writer language. |
| .opencode/skills/system-spec-kit/templates/manifest/*.md.tmpl | Analyzed | OK | Level 3 template anchors. |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:agents -->
## 4. Agents

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/agents/multi-ai-council.md | Updated | OK | Scoped-write body and permission frontmatter. |
| .claude/agents/multi-ai-council.md | Updated | OK | Mirror of OpenCode body. |
| .gemini/agents/multi-ai-council.md | Updated | OK | Mirror of OpenCode body with permission frontmatter. |
| .codex/agents/multi-ai-council.toml | Analyzed | OK | Update blocked by EPERM. |
<!-- /ANCHOR:agents -->

---

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs | Updated | OK | Thin wrapper. |
| .opencode/skills/system-spec-kit/scripts/multi-ai-council/lib/package.json | Created | OK | CommonJS boundary for lib. |
| .opencode/skills/system-spec-kit/scripts/multi-ai-council/lib/persist-artifacts.js | Created | OK | Named writer exports. |
| .opencode/skills/system-spec-kit/scripts/multi-ai-council/lib/audit-trail.js | Created | OK | Audit event helpers. |
| .opencode/skills/system-spec-kit/scripts/multi-ai-council/lib/rollback.js | Created | OK | Rollback helpers. |
| .opencode/skills/system-spec-kit/scripts/multi-ai-council/advise-council-completion.cjs | Updated | OK | Counts v1.2 events. |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/specs/skilled-agent-orchestration/098-multi-ai-council-write-authority/spec.md | Analyzed | OK | Source of requirements. |
| .opencode/specs/skilled-agent-orchestration/098-multi-ai-council-write-authority/research.md | Analyzed | OK | Source of scoped-write wording. |
| .opencode/specs/skilled-agent-orchestration/098-multi-ai-council-write-authority/decision-record.md | Updated | OK | ADR anchors added. |
| .opencode/specs/skilled-agent-orchestration/098-multi-ai-council-write-authority/plan.md | Updated | OK | Level 3 anchors restored. |
| .opencode/specs/skilled-agent-orchestration/098-multi-ai-council-write-authority/tasks.md | Updated | OK | Uppercase phase headers. |
| .opencode/specs/skilled-agent-orchestration/098-multi-ai-council-write-authority/checklist.md | Updated | OK | Level 3 anchors and priority tags. |
| .opencode/specs/skilled-agent-orchestration/098-multi-ai-council-write-authority/implementation-summary.md | Updated | OK | Blocked status summary. |
| .opencode/specs/skilled-agent-orchestration/098-multi-ai-council-write-authority/changelog.md | Created | OK | Packet change history. |
| .opencode/specs/skilled-agent-orchestration/098-multi-ai-council-write-authority/resource-map.md | Created | OK | Path ledger. |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-permission-scope.vitest.ts | Created | OK | Path scope. |
| .opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts | Created | OK | Four mirror parity. |
| .opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-audit-trail.vitest.ts | Created | OK | v1.2 audit. |
| .opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-rollback.vitest.ts | Created | OK | Rollback E2E. |
<!-- /ANCHOR:tests -->
