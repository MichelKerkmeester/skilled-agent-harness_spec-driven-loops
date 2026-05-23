---
title: "Implementation Summary: 101 - cli-opencode executor support"
description: "Added cli-opencode as 5th supported executor for deep-review/deep-research workflows."
trigger_phrases:
  - "101 implementation"
  - "cli-opencode executor summary"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/006-cli-opencode-executor"
    last_updated_at: "2026-05-07T21:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "cli-opencode executor wired into deep-loop workflows"
    next_safe_action: "Dispatch deep-review re-run via cli-opencode"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts"
      - ".opencode/commands/speckit/assets/speckit_deep-review_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: 101 - cli-opencode executor support

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/006-cli-opencode-executor` |
| **Completed** | 2026-05-07 |
| **Level** | 2 |
| **Findings resolved** | (n/a — feature add) |
| **Actual Effort** | ~15 minutes wall-clock |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Extended the deep-loop executor system to recognize `cli-opencode` as a 5th supported executor kind:

1. **`mcp_server/lib/deep-loop/executor-config.ts:7`**: appended `'cli-opencode'` to `EXECUTOR_KINDS` tuple.
2. **`mcp_server/lib/deep-loop/executor-config.ts:32-41`**: added `'cli-opencode': ['model', 'reasoningEffort', 'sandboxMode', 'timeoutSeconds']` to `EXECUTOR_KIND_FLAG_SUPPORT`. `serviceTier` excluded (no opencode equivalent).
3. **4 deep-loop workflow YAMLs**: inserted `if_cli_opencode:` branch parallel to existing branches in `spec_kit_deep-review_auto.yaml`, `spec_kit_deep-review_confirm.yaml`, `spec_kit_deep-research_auto.yaml`, `spec_kit_deep-research_confirm.yaml`. The branch maps `--variant` to `reasoningEffort` and uses `--dangerously-skip-permissions` for hands-off automation.
4. **Rebuilt `mcp_server/dist/`** via `npm run build`.

### Files Changed

| File | Change Type | Purpose |
|------|-------------|---------|
| `mcp_server/lib/deep-loop/executor-config.ts:7` | Modified | Append cli-opencode to EXECUTOR_KINDS |
| `mcp_server/lib/deep-loop/executor-config.ts:32-41` | Modified | Add cli-opencode allowed-fields entry |
| `mcp_server/dist/lib/deep-loop/executor-config.js` | Regenerated | dist counterpart |
| `commands/speckit/assets/speckit_deep-review_auto.yaml` | Modified | Insert if_cli_opencode |
| `commands/speckit/assets/speckit_deep-review_confirm.yaml` | Modified | Insert if_cli_opencode |
| `commands/speckit/assets/speckit_deep-research_auto.yaml` | Modified | Insert if_cli_opencode |
| `commands/speckit/assets/speckit_deep-research_confirm.yaml` | Modified | Insert if_cli_opencode |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Direct Edit on executor-config.ts source. Python script for the 4-file YAML insertion (anchor: locate `if_cli_claude_code:` then the next `post_dispatch_validate:`, insert before). Verified all 4 YAMLs landed exactly 1 if_cli_opencode block each. Rebuilt mcp_server dist; ran 33 executor-config + executor-audit vitest tests; all pass.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Map --variant to reasoningEffort | Variant values overlap with REASONING_EFFORTS enum (high/medium/minimal/low); avoids schema bloat |
| No model whitelist for cli-opencode | OpenCode supports many provider/model combos; narrow whitelist would reject legitimate models |
| --dangerously-skip-permissions always-on | Required for hands-off automation; no read-only equivalent in opencode CLI |
| Self-invocation guard at skill level only | The cli-opencode SKILL.md SELF-INVOCATION PROHIBITED contract is the authoritative gate |
| No serviceTier field for cli-opencode | OpenCode CLI has no service-tier concept |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| EXECUTOR_KINDS includes cli-opencode | Pass | grep cli-opencode executor-config.ts returns hit at line 7 |
| Allowed-fields registered | Pass | EXECUTOR_KIND_FLAG_SUPPORT cli-opencode entry populated |
| 4 YAMLs have if_cli_opencode branch | Pass | grep -c if_cli_opencode returns 1 per file |
| Executor tests pass | Pass | 33/33 vitest run on executor-config + executor-audit |
| dist regenerated | Pass | npm run build exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR | Target | Actual | Status |
|-----|--------|--------|--------|
| NFR-P01 | TS rebuild <60s | ~5s | Pass |
| NFR-P02 | YAML edits idempotent | Re-running script skips already-present blocks | Pass |
| NFR-S01 | Self-invocation guard preserved | cli-opencode SKILL.md unmodified | Pass |
| NFR-R01 | 33 executor tests pass | All pass | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No adversarial test fixture for cli-opencode dispatch path**: relies on existing executor-config tests for schema validation; runtime dispatch tested via the deep-review re-run.
2. **OpenCode model tool-name pattern compatibility unknown**: prior session memory noted opencode + DeepSeek failed with "Invalid tools[...].function.name" rejection. The deep-review YAML uses MCP tools with `:` in names; if the dispatched model rejects these, the iteration will fail. Recommended provider per cli-opencode SKILL.md: opencode-go/deepseek-v4-pro.
3. **--dangerously-skip-permissions is always-on**: no read-only mode equivalent in opencode CLI; sandboxMode='read-only' silently degrades.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

(none)
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Packet 101 wires cli-opencode as a 5th executor kind across executor-config.ts and 4 deep-loop workflow YAMLs. All 33 executor tests pass. Ready for the optional deep-review re-run dispatch via cli-opencode.
<!-- /ANCHOR:summary -->

---

## Followups

- **Adversarial dispatch test for cli-opencode**: dedicated vitest fixture proving the YAML branch resolves correctly with valid + invalid configs.
- **Model whitelist for cli-opencode**: if specific provider/model combinations prove unstable (e.g., DeepSeek tool-name issues), add a narrow whitelist similar to GEMINI_SUPPORTED_MODELS.
