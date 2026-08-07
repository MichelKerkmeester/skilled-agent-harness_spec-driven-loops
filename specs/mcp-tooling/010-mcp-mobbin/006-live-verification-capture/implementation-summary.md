---
title: "Implementation Summary: Phase 6: live-verification-capture (mcp-mobbin)"
description: "Live discovery on 2026-07-16 listed THREE Mobbin tools pre-auth, superseding the one-tool research baseline and resolving the deep-search conflict as a client-settable mode input; 22 packet files now cite the dated fixture."
trigger_phrases:
  - "mobbin discovery summary"
  - "mobbin fixture summary"
  - "mobbin three tools summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/006-live-verification-capture"
    last_updated_at: "2026-07-17T06:03:04.467Z"
    last_updated_by: "claude-agent"
    recent_action: "Phase complete; gates green"
    next_safe_action: "Operator handoff: browser OAuth and first authenticated smoke search"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-mobbin/references/discovery-fixture-2026-07-16.json"
      - ".opencode/skills/mcp-tooling/mcp-mobbin/references/tool-surface.md"
      - ".opencode/skills/mcp-tooling/mcp-mobbin/changelog/v1.1.1.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-006-live-verification-capture-mobbin"
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

The fixture did not just confirm the packet - it corrected it. A direct stdio MCP probe of CodeMode-MCP (initialize, then `tools/call` on `list_tools`, `search_tools`, `tool_info`, with `UTCP_CONFIG_FILE=.utcp_config.json`) listed **three** Mobbin tools pre-auth on 2026-07-16, where the packet's entire doctrine assumed one. The dated fixture `references/discovery-fixture-2026-07-16.json` is now ground truth, and 22 packet files flipped to match it.

### The supersession

You can now call `search_flows` and `search_sections` - two tools the packet previously forbade an agent to even imagine. The live registry lists `mobbin.mobbin.{search_screens,search_flows,search_sections}` (TS callables `mobbin.mobbin_search_screens(args)` etc., exactly the convention-predicted forms), all read-only search tools; the mutation-refusal check passed. The one-public-tool record stays visible as a dated historical baseline in `tool-surface.md`, and every operating claim now tracks the live inventory. Flow research rebuilt around the real tool: `search_flows` returns flow objects with `actions[]`, `screen_count`, and per-screen previews ordered by `position`, so returned ordering is retrieved fact and only interpolation beyond it stays labeled inference.

### The resolutions

The `deep` conflict is closed: the fixture schema shows `mode?: "deep" | "standard" | "fast"` as a client-settable `search_screens` input (`"deep"` = AI-powered relevance pipeline for nuanced queries; `"fast"` = deprecated alias for `"standard"`), alongside newly-declared `exclude_screen_ids` and `image_format` parameters. Discovery is pre-auth - the probe needed no OAuth - so the docs that gated callable confirmation on operator OAuth were corrected; authenticated CALLS remain operator-gated. One honest caveat landed with the wins: the declared `search_screens` output is `{ query, screens[{id, image_url, mobbin_url, app_name, platform}] }`, and the research-documented `index`/`failed[]` fields do not appear in it - flagged for verification on the first authenticated call rather than asserted either way.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `references/discovery-fixture-2026-07-16.json` | Created (by the probe) | Ground-truth discovery payloads (3 tools, full schemas) |
| `SKILL.md` | Modified | Three-tool surface, resolved deep, workflows, rules, quick ref, version 1.1.1.0 |
| `references/tool-surface.md` | Modified | Rebuilt on fixture schemas; open questions 1/3/4/10 resolved |
| `references/mcp-wiring.md`, `references/troubleshooting.md` | Modified | Naming CONFIRMED; drift rows diff against the fixture |
| `README.md`, `install-guide.md`, `mcp-servers/mobbin-mcp/README.md` | Modified | Three tools + pre-auth discovery in all consumer mirrors |
| `feature-catalog/` (root + flows/screens/apps/elements) | Modified | Inventory, areas, count; flows leaf rebuilt on search_flows |
| `examples/` (README + 3 walkthroughs) | Modified | Confirmed names; flow example calls search_flows |
| `manual-testing-playbook/` (root + 3 scenarios) | Modified | Grading re-anchored on the fixture baseline |
| `assets/utcp-mobbin-manual.md` | Modified | Checklist items flipped with fixture evidence |
| `scripts/doctor.sh`, `scripts/install.sh` | Modified | Hints state the confirmed three-tool baseline |
| `changelog/v1.1.1.0.md` | Created | Release record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

The fixture was read end to end first, and a packet-wide grep of INFERRED, one-tool, and deep-conflict wording built the 22-file flip set so mirrors (catalog leaves, examples, playbook scenarios, scripts) could not drift from the contract docs. The supersession is stated as a dated reviewed update, never as silent drift-acceptance, and the old boundary survives as historical context with its original reasoning. The packet closed through `package_skill.py --check --strict` (PASS), `bash -n` on both scripts, residual sweeps (0 non-changelog stale claims), and `validate.sh --strict --no-recursive` on this spec child.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

| Decision | Why |
|----------|-----|
| Record the supersession as dated fact, keep the old baseline as history | The one-tool record was correct about the public documentation; deleting it would hide why the packet once forbade `search_flows`, and dating the change makes the epistemic chain auditable |
| Flag the `index`/`failed[]` absence instead of rewriting the response shape | The declared schema is discovery output, not an exercised response; asserting either shape as live behavior would trade one overclaim for another |
| Treat `search_flows` returned ordering as fact, keep inference labels beyond it | The tool now provides what reconstruction used to approximate; the honesty rule survives where the tool's contract ends |
| Update both scripts (unlike refero) | Grep showed both hardcoded the INFERRED status, meeting the update-only-if-stale bar |
| Defer the `search_sections` catalog leaf | The capture phase records the live surface; authoring a new capability leaf is follow-up work, noted in the areas table |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|-------|--------|
| `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/mcp-tooling/mcp-mobbin --check --strict` | PASS ("Skill is valid!"; 2 warnings: SKILL.md word count, .json fixture in references/, both accepted) |
| `bash -n scripts/doctor.sh` and `bash -n scripts/install.sh` | PASS (exit 0, 2/2) |
| Fixture cross-check: 3 `discoveredCallableNames` vs flipped claims | PASS (3/3 dotted names and the `Access as:` TS forms match every flipped claim) |
| Residual sweep (`INFERRED` callable claims, one-tool boundary, open deep conflict) | PASS (0 hits outside changelog history) |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict --no-recursive` | PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

1. **Authenticated calls remain unexercised, by design.** The capture phase is complete; browser OAuth on a paid plan, the first `limit: 1` smoke search, inline-image fidelity through `call_tool_chain`, rate-limit observation, and Free-denial semantics are documented operator handoff items (SKIP-valid with exact commands in the packet), not unfinished work in this phase.
2. **Declared output vs live response is unverified.** The fixture's declared `search_screens` output lacks the research-documented `index`/`failed[]` fields; which description matches actual authenticated responses is a first-call check, and the docs deliberately assert neither.
3. **`search_sections` has no dedicated feature-catalog leaf yet.** The live tool is documented in the contract docs and the catalog areas table; a per-feature leaf is follow-up authoring.
4. **The fixture is a dated snapshot.** Provider surface drift after 2026-07-16 reopens the claims; the fail-closed drift protocol now diffs against the three-tool fixture baseline.
<!-- /ANCHOR:limitations -->
