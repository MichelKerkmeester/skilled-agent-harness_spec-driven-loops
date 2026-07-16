---
title: "Implementation Summary: Phase 5: inventory-parity-and-doc-truth"
description: "Brought mcp-refero to hub-sibling inventory parity (examples, install.sh, 9-scenario playbook, 8 per-tool catalog leaves, v1.1.0.0 changelog) and executed the researched sk-design de-duplication with a byte-identical package-gate before/after."
trigger_phrases:
  - "refero parity summary"
  - "mcp-refero phase 005 summary"
  - "refero dedup summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/005-inventory-parity-and-doc-truth"
    last_updated_at: "2026-07-16T18:00:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped parity + dedup; all gates green"
    next_safe_action: "Proceed to 006-live-verification-capture when operator auth is available"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-refero/examples/README.md"
      - ".opencode/skills/mcp-tooling/mcp-refero/scripts/install.sh"
      - ".opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-inventory-parity-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Did the sk-design de-dup change its validation gate? No - validate_skill_package.py output is byte-identical before/after (same 1 pre-existing 6a failure)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
# Implementation Summary: Phase 5: inventory-parity-and-doc-truth

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Completed** | 2026-07-16 |
| **Level** | 2 |
| **Branch** | `skilled/v4.0.0.0` |
| **Phase** | 5 of 6 |
| **Predecessor** | ../004-validation-and-handoff/ |
| **Successor** | ../006-live-verification-capture/ |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

`mcp-refero` v1.1.0.0 - full inventory parity plus the executed research section G de-duplication. You can now walk a worked Code Mode invocation instead of reverse-engineering the SKILL.md snippets, verify install posture non-interactively, and find every one of the eight tools in its own catalog leaf; and there is exactly one canonical home for the Refero tool surface.

- **`examples/`** (new, 4 files) - README mirroring the `mcp-aside-devtools/examples/` conventions plus three walkthroughs: the full styles -> screens -> flows funnel, a metadata-first single-tool lookup (including the elements facet), and the image-last screenshot lane. Every callable uses the doubled prefix, every walkthrough opens with the mandatory `tool_info` confirmation, and every OAuth-gated step is SKIP-valid with the exact command.
- **`scripts/install.sh`** (new) - verify-only posture: Node>=18 + npx, `refero` manual presence via read-only grep (presence = OK; registration stays operator-owned), the Node-25 SIGSEGV warning, OAuth boundaries operator-only. Zero writes.
- **Playbook 6 -> 9 indexed scenarios** (14 -> 17 files) - FUNNEL-001 (full funnel walk with per-transition ID typing), FORMAT-001 (`response_format` discipline incl. the image-tool exclusion), QUOTA-001 (quota/429 honesty: verbatim relay, declared unknowns, no invented backoff, live half SKIP-valid). Root index, coverage, waves, and readiness rule updated consistently.
- **Feature catalog** - 8 per-tool leaves (2 styles, 4 screens, 2 flows) under the existing domain dirs, domain files linking both ways, root count summary tracking 3 domain files + 8 leaves.
- **sk-design de-dup** - `design-interface/references/mcp_tooling/refero_tools.md` slimmed from the full v1.5.0.3 catalog to a v1.6.0.0 POINTER (canonical home + only the judgment-side styles-first/anti-averaging guidance that is sk-design's own), plus 8 bounded prose edits across 5 more design-interface files adopting the "mcp-refero transport over mcp-code-mode" phrasing.
- **Release** - SKILL.md/README/playbook/catalog bumped to 1.1.0.0; `changelog/v1.1.0.0.md` authored.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp-refero/examples/` (4 files) | Created | Worked Code Mode walkthroughs |
| `mcp-refero/scripts/install.sh` | Created | Verify-only posture check |
| `mcp-refero/manual_testing_playbook/` (3 new + root) | Created/Modified | 9-scenario playbook |
| `mcp-refero/feature_catalog/` (8 new + 4 edited) | Created/Modified | Per-tool tool homes |
| `mcp-refero/{SKILL,README}.md`, `changelog/v1.1.0.0.md` | Modified/Created | v1.1.0.0 release |
| `sk-design/design-interface/` (6 files) | Modified | Pointer + transport phrasing |
| This spec child (spec/plan/tasks/checklist/summary) | Created/Modified | Level 2 documentation |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Read-first, gate-bracketed: ground truth (research sections A/C/D/G, `tool_surface.md`) and the aside-devtools exemplar were read before writing; both gates were captured BEFORE (sk-design gate saved to scratchpad, mcp-refero strict PASS), all additive packet work landed, then the sk-design rewrite ran against a consumer inventory (7 files reviewed, 6 edited), and the AFTER gates plus a 29-file relative-link sweep closed it out.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

| Decision | Why |
|----------|-----|
| Examples as .md walkthroughs, not .sh scripts | Every Refero call runs inside Code Mode (`call_tool_chain`), never in a shell; a shell script could only fake the calls. The one shell step (posture) delegates to `install.sh`. |
| Flow-record ID key left unpinned in the funnel example | `tool_surface.md` pins the numeric typing but not the field name; the example defers the key to live `tool_info` rather than inventing `first.id` as fact. |
| Per-tool leaves ADDED under domain dirs instead of replacing domain files | Domain files carry funnel-role context the leaves should not duplicate; both tiers are indexed in the root count summary so drift is checkable. |
| QUOTA-001 placed in Safety Gate with a never-SKIP contract half | The live 429 cannot be produced without burning paid quota (itself a discipline failure), but the honesty contract (no invented backoff, no mutation-as-recovery) is gradable offline. |
| `refero_tools.md` kept as a pointer file instead of deleted | Five design-interface consumers (SKILL router RESOURCE_MAP, README, discipline doc, sibling catalog, ID-010 playbook) reference the path; keeping a pointer preserves routing and the byte-identical gate. |
| New/edited packet files carry version 1.1.0.0 | Files ship with the release that introduced them; untouched files stay at 1.0.0.0. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|-------|--------|
| `package_skill.py .opencode/skills/mcp-tooling/mcp-refero --check --strict` | PASS, exit 0 (1 pre-existing advisory: SKILL.md 3,889 words vs 3,000 recommendation; hard cap 5,000) |
| `validate_skill_package.py .opencode/skills/sk-design` before vs after | Byte-identical (`diff` empty). Same single pre-existing FAIL both runs: 6a child dir `[styles]` not allowlisted - untouched by this phase |
| `bash -n scripts/install.sh` + live run | Exit 0 both; all posture checks OK, zero writes |
| Relative-link sweep (29 touched files) | 0 broken links |
| Playbook consistency | 9 index rows = 9 per-scenario files; 17 files total under the playbook tree |
| `validate.sh <this child> --strict --no-recursive` | PASSED (after generate-description.js + backfill-graph-metadata.js) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

1. **Everything live remains SKIP-valid, not verified.** No operator OAuth exists in this repo's record, so walkthrough and scenario live steps (discovery, searches, the 429 capture) are documented with exact commands but unexecuted. Phase 006 owns live capture.
2. **The sk-design 6a gate failure predates this phase.** `validate_skill_package.py` fails on the unallowlisted `[styles]` child directory both before and after; this phase's contract was output-identity, not repair.
3. **The flow-record ID field name is unpinned.** The docs pin the numeric typing only; the funnel example defers the key name to live `tool_info` output.
4. **SKILL.md word-count advisory persists** (3,889 words vs the 3,000 recommendation, matching the mcp-figma exemplar's advisory; hard cap 5,000).
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
