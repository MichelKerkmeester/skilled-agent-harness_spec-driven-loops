---
title: "Implementation Summary: Phase 6: live-verification-capture (mcp-aside-devtools)"
description: "The aside Code Mode callable is now an observed fact, not a prediction: live discovery on 2026-07-16 returned registry name aside.aside.repl and TS callable aside.aside_repl(args), and 12 packet files plus the doctor now cite the dated fixture."
trigger_phrases:
  - "aside discovery summary"
  - "aside fixture summary"
  - "aside callable confirmed summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside/006-live-verification-capture"
    last_updated_at: "2026-07-16T16:30:00Z"
    last_updated_by: "claude-agent"
    recent_action: "Phase complete; gates green"
    next_safe_action: "Operator handoff: authenticated smoke invocation and binding probe"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-aside-devtools/references/discovery-fixture-2026-07-16.json"
      - ".opencode/skills/mcp-tooling/mcp-aside-devtools/references/mcp-wiring.md"
      - ".opencode/skills/mcp-tooling/mcp-aside-devtools/changelog/v1.1.1.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-006-live-verification-capture-aside"
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

Live Code Mode discovery finally ran against the registered `aside` manual, and the packet now tells the observed truth instead of a convention prediction. A direct stdio MCP probe of CodeMode-MCP (initialize, then `tools/call` on `list_tools`, `search_tools`, `tool_info`, with `UTCP_CONFIG_FILE=.utcp_config.json`) produced the dated fixture `references/discovery-fixture-2026-07-16.json`, and every discovery-pending claim in the packet flipped to cite it.

### The captured facts

You can now trust two precise, different name forms. Discovery returns the registry name `aside.aside.repl` (dot-separated `{manual}.{server}.{tool}`) - which means the packet's old registry prediction `aside.aside_repl` was wrong by one separator. Inside `call_tool_chain` TypeScript, the callable is `aside.aside_repl(args)` - exactly the fixture's `Access as:` line and the `{manual_name}.{manual_name}_{tool_name}` convention, so the prediction was right about the call surface. The one-`repl`-tool inventory is re-confirmed: `aside.aside.repl` is the only `aside.*` registry entry. The fixture also enumerates the REPL's full helper surface (tab attachment helpers, `snapshot`, `display`, screenshots/PDF, `fs`/`fetch`/`sleep` and friends), which now supersedes the older version-pinned description in both references.

### The flip sweep

Twelve packet files stopped saying "unconfirmed" and started citing the fixture: SKILL.md (contract + NEVER rule + version 1.1.1.0), README, INSTALL_GUIDE, both references, the asset checklist (three items now `[x]` with fixture evidence), the server-package README, the feature catalog root and MCP leaf, the playbook root and the ASD-011 scenario (which now diffs future discovery output against the fixture baseline), and the doctor's discovery hint. The rediscovery mandate survives everywhere: the fixture is a dated baseline, not a permanent contract, because `tools.listChanged` is true.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `references/discovery-fixture-2026-07-16.json` | Created (by the probe) | Ground-truth discovery payloads |
| `SKILL.md` | Modified | Dual naming, re-confirmed inventory, version 1.1.1.0 |
| `README.md`, `INSTALL_GUIDE.md` | Modified | Consumer-facing steps quote both forms |
| `references/mcp-wiring.md`, `references/aside-cli-reference.md` | Modified | DONE banner, naming bullet, fixture helper surface |
| `assets/utcp-aside-manual.md` | Modified | Discovery checklist items flipped with evidence |
| `mcp-servers/aside-mcp/README.md` | Modified | Checklist step 4 confirmed naming |
| `feature_catalog/feature_catalog.md`, `feature_catalog/mcp/mcp-transport-and-code-mode.md` | Modified | Catalog mirrors flipped to CONFIRMED |
| `manual_testing_playbook/manual_testing_playbook.md`, `manual_testing_playbook/mcp-transport/code-mode-discovery.md` | Modified | ASD-011 records the satisfied run + drift protocol |
| `scripts/doctor.sh` | Modified | Hint states the fixture baseline (both forms) |
| `changelog/v1.1.1.0.md` | Created | Release record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

The fixture was read end to end before any edit, and a packet-wide grep of `aside_repl`/`unconfirmed`/`discovery` drove the flip set so no mirror was missed. Each flip presents both observed name forms with the fixture path cited, and the historical changelogs kept their original wording. The packet closed through `package_skill.py --check --strict` (PASS), `bash -n` on the doctor, a residual stale-claim grep (0 non-changelog hits), and `validate.sh --strict --no-recursive` on this spec child.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

| Decision | Why |
|----------|-----|
| Present BOTH name forms everywhere, never just one | The dotted registry form and the underscore TS form differ by design; recording only one recreates the exact confusion the fixture just resolved |
| State that the old registry prediction was wrong, explicitly | An honest correction teaches the next reader the failure mode; silently swapping the string would hide that convention-derived registry names are risky |
| Keep per-session rediscovery mandatory after confirmation | `tools.listChanged: true` makes any fixture a dated snapshot; confirmation changes the baseline, not the discipline |
| Leave live-call items open as SKIP-valid operator work | Discovery lists the surface without exercising calls; claiming invocation behavior from a listing would be overclaiming |
| Update doctor.sh only at the stale hint line | Grep confirmed line 111 was the only hardcoded old name; the check logic itself was already registered-state correct |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|-------|--------|
| `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/mcp-tooling/mcp-aside-devtools --check --strict` | PASS ("Skill is valid!"; 1 warning: .json fixture in references/, accepted) |
| `bash -n .opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/doctor.sh` | PASS (exit 0) |
| Residual stale-claim grep (`unconfirmed until`, `discovery is still pending`, `UNKNOWN until confirmed`) | PASS (0 hits outside changelog history) |
| Fixture cross-check: `discoveredCallableNames` vs flipped claims | PASS (`aside.aside.repl` matches every flipped registry claim; `Access as: aside.aside_repl(args)` matches every TS claim) |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict --no-recursive` | PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

1. **Live calls remain unexercised, by design.** The capture phase is complete; the authenticated smoke invocation inside `call_tool_chain`, the browser-profile binding probe, bound-page output shapes, and the multi-client isolation test are documented operator handoff items (SKIP-valid with exact commands in the packet), not unfinished work in this phase.
2. **The fixture is a dated snapshot.** `tools.listChanged: true` means a future Aside release can change the inventory; ASD-011 and the doctor now diff against the fixture and reopen the claims on drift.
3. **The binding procedure is still UNKNOWN.** Discovery confirmed the tool surface, not how an MCP process binds to a browser profile; that stays an escalation path, unchanged from phase 005.
<!-- /ANCHOR:limitations -->
