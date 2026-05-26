---
title: "Implementation Summary: CORE operator-surface realignment"
description: "Realigned the system-spec-kit install guide + scripts and the /doctor command surface (both .opencode and .claude mirrors) to post-CocoIndex + post-116 reality; both route validators pass the now-functional F2 gate."
trigger_phrases:
  - "operator surface realignment"
  - "doctor command realignment"
  - "install guide cross-encoder mmr"
  - "015 002 core rework"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-install-scripts-doctor-realignment/002-operator-surface-realignment"
    last_updated_at: "2026-05-26T09:25:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Applied all CORE install/scripts/doctor edits and verified both route validators"
    next_safe_action: "Proceed to 003 advisor and adjacent-116 realignment"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md"
      - ".opencode/commands/doctor/_routes.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "70859d71-f191-429c-96cd-6b73bb9745d8"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-operator-surface-realignment |
| **Completed** | 2026-05-26 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The CORE rework from the 015/001 research: the operator-facing surfaces now describe the post-CocoIndex, post-116 world instead of a removed one. Two surfaces were realigned.

### system-spec-kit install guide + scripts

`mcp_server/INSTALL_GUIDE.md` no longer advertises "cross-encoder reranking enabled by default" (rewritten to Stage-3 MMR diversity + MPAB), and its three code-graph DB rows now point at the canonical `.opencode/.spec-kit/code-graph/database/code-graph.sqlite` (verified from source: no config overrides `SPECKIT_CODE_GRAPH_DB_DIR`; `opencode.json` documents this default + the auto-migrated legacy location). `scripts/setup/install.sh:280` help text dropped the cross-encoder phrase. `scripts/test-council-matrix.sh:14` now validates `deep-ai-council` (was the renamed-away `sk-ai-council`; the script is live via `mcp_server/package.json` `test:council:full`).

### /doctor command surface (`.opencode` + `.claude` full mirror)

Both runtime trees were realigned: code-graph DB paths → `.opencode/.spec-kit/code-graph/database/`; deep-loop DB paths (`storage/` and pre-116 `mcp_server/database/`) → `.opencode/skills/deep-loop-runtime/database/deep-loop-graph.sqlite`; `/doctor:update` advisor tools → `mcp__mk_skill_advisor__advisor_*`; the no-arg menu dropped the dead CocoIndex-era "Debug Code Graph (semantic search daemon)" option (renumbered 7→6, 8→7 + help block); `mcp-doctor.sh` tool count 11→8; `doctor_code-graph.yaml` includeSkills glob `sk-*`→`<name>` (covers renamed `deep-*`). Critically, `route-validate.sh` `ROUTER_FILE` was fixed (`$COMMANDS_DIR/doctor.md` → `$DOCTOR_DIR/speckit.md`) so the F2 tool-subset gate — silently skipped before — now runs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Modified | cross-encoder→MMR; 3 code-graph DB rows→.spec-kit |
| `system-spec-kit/scripts/setup/install.sh` | Modified | drop cross-encoder help phrase |
| `system-spec-kit/scripts/test-council-matrix.sh` | Modified | sk-ai-council→deep-ai-council |
| `{.opencode,.claude}/commands/doctor/**` | Modified | DB paths, advisor tools, menu, tool count, ROUTER_FILE, includeSkills |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

system-spec-kit surface edited directly (surgical, ASCII-box aware). The /doctor ×2-runtime edits applied via deterministic literal/regex replacement across both trees (safer than an LLM dispatch for path-exact edits), then verified. The fixed `route-validate.sh` was run as the gate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| code-graph DB target = `.opencode/.spec-kit/code-graph/database/` | Verified from source (readiness-marker.ts, opencode.json `_NOTE_1_DB`); the doctor manifest's old `system-code-graph/database/` value was itself stale |
| Removed menu option 6 + renumber, not just re-annotate | Option 6 was unmapped (no `6 →` in the answer map) and named the removed semantic daemon; option 4 already covers structural code-graph |
| Edit both `.opencode` and `.claude` | iter-5 confirmed `.claude/commands/doctor` is a full text mirror (SHARED-STALE) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `.opencode` route-validate.sh | PASS — F2 (tool-subset) now runs and passes |
| `.claude` route-validate.sh | PASS — F2 passes |
| Residual stale-token sweep (both trees + install guide) | ZERO (only the intentional past-tense cross-encoder note in INSTALL_GUIDE:720) |
| ASCII box alignment (INSTALL_GUIDE:83) | PASS — 71 bytes, matches sibling lines |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **None for this surface.** Adjacent-116 (advisor/optimizer/tests/gemini) is handled in sibling phase 003.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
-->
