---
title: "Implementation Summary: CLI Hooks and Plugin (Playbook Run Phase 003)"
description: "All four runtime hook adapters (Claude, Gemini, Codex, Devin) surface prompt-safe advisor briefs and fail open correctly; only the OpenCode plugin bridge is PARTIAL because its native route does not engage and it fails open to the python path."
trigger_phrases:
  - "playbook cli hooks summary"
  - "CL results summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/006-playbook-run-and-remediation/003-cli-hooks-and-plugin"
    last_updated_at: "2026-05-26T20:00:00Z"
    last_updated_by: "playbook-run-operator"
    recent_action: "CL-001/003/004/005/006 executed; bridge fail-open finding recorded"
    next_safe_action: "Phase 004 shell/python/daemon waves"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-playbook-run-and-remediation/003-cli-hooks-and-plugin |
| **Completed** | 2026-05-26 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every prompt-time hook adapter does its job: Claude, Gemini, Codex and Devin all surface a compact `Advisor:` brief for a substantive prompt, return `{}` for short or malformed input, exit 0, and keep the raw prompt out of their stderr diagnostics. The one soft spot is the OpenCode plugin bridge, which fails open safely but never reaches its native route.

### The four runtime adapters (CL-001, CL-003, CL-004, CL-006)
- **Claude**: `Advisor: live; use sk-doc 0.93/0.12 pass.`, `runtime:"claude"`, no leak.
- **Gemini** (BeforeAgent schema): an ambiguous two-skill brief, `runtime:"gemini"`, no leak.
- **Codex**: SessionStart returns the startup-context block; UserPromptSubmit returns the advisor brief; the prompt-wrapper returns `{}` because native hooks are available (correct). All exit 0.
- **Devin**: `.devin/hooks.v1.json` correctly cites the advisor-owned hook path; the substantive prompt returns `additionalContext` starting `Advisor:`, the short prompt returns `{}`, and malformed stdin returns `{}` (fail-open). No prompt leak.

### The OpenCode plugin bridge (CL-005)
Running `mk-skill-advisor-bridge.mjs` directly exits 0 and returns a prompt-safe fail-open envelope with the correct `0.8/0.35/false` threshold pair — so the safety contract holds. But `metadata.route` is `python` and `error` is `SYSTEM_SKILL_ADVISOR_UNAVAILABLE`, meaning the native compat route never engaged even though `dist/mcp_server/compat/index.js` is present on disk. The native success path (`route:"native"` + an `Advisor:` brief) could not be demonstrated, so CL-005 is PARTIAL.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `/tmp/skill-advisor-playbook/cl-*.stdout.json`, `/tmp/devin-hook-playbook/*` | Created | Captured hook stdout/stderr (untracked) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each adapter was exercised by piping the scenario's documented JSON payload into its compiled `dist` hook and capturing stdout, stderr and exit code separately. Prompt-safety was checked by grepping each stderr for the prompt literal (none found). The Devin registration was confirmed with `jq` against `.devin/hooks.v1.json`. Live interactive steps (Devin `/hooks`, `codex features list`, stdin-over-argv precedence) are optional manual checks and were left out of scope.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mark CL-005 PARTIAL, not PASS | The bridge fails open safely but never reaches `route:"native"`; the scenario's native-success expected signal is unmet |
| Treat live TUI steps as out-of-scope | They require an interactive session; the compiled-hook smokes carry the contract |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| CL-001 Claude hook | PASS |
| CL-003 Gemini hook | PASS |
| CL-004 Codex hooks + wrapper | PASS |
| CL-005 OpenCode bridge | PARTIAL (fail-open correct; native route does not engage) |
| CL-006 Devin hook | PASS |
| Prompt-leak check (all stderr) | PASS — no leak |
| **CL total** | **4 PASS, 1 PARTIAL, 0 FAIL, 0 SKIP** |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **CL-005 native route is unverified.** The bridge falls to the python route and reports `SYSTEM_SKILL_ADVISOR_UNAVAILABLE` even though the compat entry exists. Root cause (subprocess invocation of the native compat path) is recorded for a follow-on packet.
2. **Live TUI behavior not exercised.** Devin `/hooks` listing, `codex features list`, and stdin-over-argv precedence are documented optional manual steps that were not run.
<!-- /ANCHOR:limitations -->
