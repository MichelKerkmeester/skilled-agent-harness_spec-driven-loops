---
title: "Implementation Summary: Phase 6: live-verification-capture (mcp-refero)"
description: "The refero doubled-prefix naming conflict is closed with live registry evidence: all eight tools listed pre-auth on 2026-07-16 as refero.refero.refero_<tool>, and 7 packet files now cite the dated fixture instead of hedging."
trigger_phrases:
  - "refero discovery summary"
  - "refero fixture summary"
  - "refero doubled prefix summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/006-live-verification-capture"
    last_updated_at: "2026-07-16T16:30:00Z"
    last_updated_by: "claude-agent"
    recent_action: "Phase complete; gates green"
    next_safe_action: "Operator handoff: OAuth completion and first authenticated search"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-refero/references/discovery-fixture-2026-07-16.json"
      - ".opencode/skills/mcp-tooling/mcp-refero/references/mcp-wiring.md"
      - ".opencode/skills/mcp-tooling/mcp-refero/changelog/v1.1.1.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-006-live-verification-capture-refero"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-live-verification-capture |
| **Completed** | 2026-07-16 |
| **Level** | 2 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The packet's central naming hedge is gone. A direct stdio MCP probe of CodeMode-MCP (initialize, then `tools/call` on `list_tools`, `search_tools`, `tool_info`, with `UTCP_CONFIG_FILE=.utcp_config.json`) listed all eight Refero tools on 2026-07-16 and wrote the dated fixture `references/discovery-fixture-2026-07-16.json`; seven packet files now cite it instead of preserving a two-lineage dispute.

### The captured facts

You can now state the naming rule as observation, not derivation. The registry carries the dotted doubled names `refero.refero.refero_{search_styles,search_screens,get_style,get_similar_screens,get_screen_image,get_screen,search_flows,get_flow}` - all eight, exactly the documented surface - and the TS callable inside `call_tool_chain` is the doubled `refero.refero_refero_<tool>(...)` form per the fixture's `Access as:` line. The circulating single-prefix derivation is refuted and recorded as negative knowledge. Two schema details landed as well: `response_format?: "json" | "md"` (default `"md"`) is confirmed on both search tools shown in full by the fixture, and `refero_search_screens` requires `platform: "ios" | "web"`.

### The pre-auth correction

The probe worked WITHOUT OAuth, which disproved a precondition several docs asserted: discovery is pre-auth; only authenticated CALLS are operator-gated. README, INSTALL_GUIDE, and the server README now say so precisely, and the OAuth-gated live-call items keep their SKIP-valid status with exact commands.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `references/discovery-fixture-2026-07-16.json` | Created (by the probe) | Ground-truth discovery payloads (8 registry names) |
| `SKILL.md` | Modified | Naming trap flipped to confirmed; version 1.1.1.0 |
| `README.md`, `INSTALL_GUIDE.md` | Modified | Resolved conflict + pre-auth preconditions |
| `references/mcp-wiring.md` | Modified | Naming section confirmed; single-prefix derivation refuted |
| `references/tool-surface.md` | Modified | Open question 1 resolved; question 2 partially resolved |
| `mcp-servers/refero-mcp/README.md` | Modified | Discovery expectation corrected to pre-auth |
| `manual_testing_playbook/discovery-setup/discovery-first.md` | Modified | DISCOVER-001 rationale records the closed conflict |
| `changelog/v1.1.1.0.md` | Created | Release record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

The fixture was read before any edit and the flip set came from a packet-wide grep of conflict and OAuth-gated-discovery wording. `scripts/doctor.sh` and `scripts/install.sh` were grepped first and left untouched - they already stated the correct doubled-prefix forms, and the phase rule was update-only-if-stale. The packet closed through `package_skill.py --check --strict` (PASS), a residual conflict-wording grep (0 non-changelog hits), and `validate.sh --strict --no-recursive` on this spec child.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

| Decision | Why |
|----------|-----|
| Record the single-prefix derivation as refuted, not deleted | Negative knowledge prevents the next research pass from re-deriving the same plausible-looking mistake |
| State the pre-auth boundary in both halves everywhere | "Discovery needs no OAuth" without "calls still do" invites unauthorized-call attempts; the pair travels together |
| Record `response_format` only for the two fixture-shown schemas | The `search_tools` payload truncates after two full tool schemas; claiming the other six would be inference dressed as observation |
| Leave doctor.sh and install.sh untouched | Grep proved they already carry the winning form; editing correct scripts adds churn without truth |
| Keep per-session `tool_info` re-confirmation mandatory | Confirmation moves the baseline; provider drift discipline stays |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|-------|--------|
| `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/mcp-tooling/mcp-refero --check --strict` | PASS ("Skill is valid!"; 2 warnings: SKILL.md word count, .json fixture in references/, both accepted) |
| Fixture cross-check: 8 `discoveredCallableNames` vs flipped claims | PASS (8/8 dotted names match; `Access as:` line matches every TS claim) |
| Residual conflict-wording grep (`conflicting derivations exist`, OAuth-gated discovery phrasing) | PASS (0 hits outside changelog history) |
| Script staleness grep (`rg -n "refero_refero" scripts/`) | PASS (correct doubled form only; 0 edits needed) |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict --no-recursive` | PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

1. **Authenticated calls remain unexercised, by design.** The capture phase is complete; OAuth completion, the first authenticated search, rate-limit observation, and the Bearer-token acquisition path are documented operator handoff items (SKIP-valid with exact commands in the packet), not unfinished work in this phase.
2. **Six tools' `response_format` exposure is still a runtime check.** The fixture shows full schemas for the two search tools only; per-tool `tool_info` remains the rule for the rest.
3. **The fixture is a dated snapshot.** Provider surface drift after 2026-07-16 reopens the claims; the fail-closed drift protocol in SKILL.md and mcp-wiring.md is the guard.
<!-- /ANCHOR:limitations -->
