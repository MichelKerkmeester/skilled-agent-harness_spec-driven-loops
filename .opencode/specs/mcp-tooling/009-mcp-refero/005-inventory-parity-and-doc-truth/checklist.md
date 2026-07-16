---
title: "Verification Checklist: Phase 5: inventory-parity-and-doc-truth"
description: "Verification checklist for the mcp-refero inventory-parity phase: examples and install.sh shipped, playbook and feature catalog enriched, sk-design de-duplicated behind a byte-diffed gate, version 1.1.0.0 released."
trigger_phrases:
  - "refero parity checklist"
  - "mcp-refero 005 checklist"
  - "refero dedup checklist"
  - "verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/005-inventory-parity-and-doc-truth"
    last_updated_at: "2026-07-16T18:00:00Z"
    last_updated_by: "claude"
    recent_action: "Marked checklist with gate evidence"
    next_safe_action: "Proceed to 006-live-verification-capture when operator auth is available"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/009-mcp-refero/005-inventory-parity-and-doc-truth/checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-inventory-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 5: inventory-parity-and-doc-truth

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Ground truth read before writing: research sections A/C/D/G, tool-surface.md, playbook root + sibling scenario, catalog files [evidence: `research.md` + `tool-surface.md` + `styles-funnel.md` + 3 catalog files read pre-write]
- [x] CHK-002 [P0] Exemplar conventions read: `mcp-aside-devtools/examples/` (README + probe script) and its `scripts/install.sh` [evidence: 3/3 exemplar files read; examples README mirrors its section shape]
- [x] CHK-003 [P0] BEFORE gates captured: sk-design `validate_skill_package.py` saved to scratchpad (25 lines, 1 pre-existing FAIL 6a `[styles]`); mcp-refero strict PASS baseline [evidence: `skdesign-before.txt` 25 lines; `package_skill.py --check --strict` Result: PASS]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Examples: 4 files (README + 3 walkthroughs), every callable in the doubled-prefix form, `tool_info` confirmation first in every walkthrough, OAuth steps SKIP-valid with the exact command [evidence: 4/4 files in `examples/`; 0 single-prefix callables; each walkthrough Step 1 = `tool_info`]
- [x] CHK-011 [P0] No invented tools or params: every documented callable/argument/bound matches `references/tool-surface.md`; the one unpinned field (flow-record ID key) is explicitly deferred to live `tool_info` [evidence: 8/8 tools + args traced; `funnel-styles-screens-flows.md` flow-ID comment defers the key name]
- [x] CHK-012 [P0] `scripts/install.sh` verify-only: node>=18 + npx checks, manual presence via read-only grep (presence = OK), Node-25 SIGSEGV warning, OAuth marked operator-only; durable-WHY comments only [evidence: `bash -n` exit 0; live run all-OK with zero writes; header comment states verify-only WHY]
- [x] CHK-013 [P1] Feature catalog: 8 per-tool leaves + 3 domain files linked both ways; root count summary matches (3 domain + 8 leaves) [evidence: 8/8 leaves exist; `feature_catalog.md` Section 5 table lists all 8]
- [x] CHK-014 [P1] Relative links resolve across all touched files [evidence: 0/29 touched files with broken relative links per Python sweep]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `package_skill.py --check --strict` PASS after enrichment [evidence: Result: PASS, exit 0; 1 pre-existing word-count advisory (SKILL.md 3,889/3,000 rec, 5,000 cap)]
- [x] CHK-021 [P0] sk-design gate byte-identical before/after the de-dup [evidence: `diff skdesign-before.txt skdesign-after.txt` empty - GATE OUTPUT IDENTICAL; same 1 pre-existing FAIL 6a `[styles]`]
- [x] CHK-022 [P0] Playbook index consistency: 9 scenario IDs = 9 per-scenario files; 17 files total under the playbook tree [evidence: index table 9 rows; `find manual_testing_playbook -name '*.md' ! -name 'manual_testing_playbook.md'` = 17]
- [x] CHK-023 [P1] New scenarios grounded in research section D/C with live parts SKIP-valid [evidence: 3/3 scenarios anchor to `tool-surface.md` contracts; QUOTA-001 live 429 half marked SKIP-valid]
- [x] CHK-024 [P1] Spec child validation [evidence: `validate.sh <child> --strict --no-recursive` Status: PASSED]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The de-dup finding (duplicated catalog) classified: `cross-consumer` (one producer file, multiple prose consumers) [evidence: plan.md FIX ADDENDUM classifies and tables the surfaces]
- [x] CHK-FIX-002 [P0] Same-class producer inventory: checked for OTHER duplicated Refero fact carriers in sk-design beyond refero_tools.md [evidence: `rg -l "refero" design-interface` = 7 files; only refero_tools.md carried catalog-class facts; design_references_mcp.md carries judgment discipline (kept by design)]
- [x] CHK-FIX-003 [P0] Consumer inventory for the changed reference target completed before the rewrite [evidence: 7 files reviewed, 6 edited, 1 needed no change (`query_default_then_deviate.md` frontmatter path only)]
- [x] CHK-FIX-004 [P0] No security/path/parser fix landed in scripts/ (install.sh is new read-only reporting, not a fix) [evidence: N/A - `install.sh` performs 0 writes; no parser/path fix landed]
- [x] CHK-FIX-005 [P1] Inventory matrix (deliverable x content source) listed before completion [evidence: 10/10 Files-to-Change rows in `spec.md` map to sources; `tasks.md` T004-T012 mirror them]
- [x] CHK-FIX-006 [P1] Hostile-env consideration for install.sh (reads PATH/node/npx + one repo file) [evidence: `set -euo pipefail`; missing node/npx degrade to ERR + exit 1, absent config degrades to WARN, no env trust beyond PATH]
- [x] CHK-FIX-007 [P1] Gate evidence pinned [evidence: uncommitted working tree on `skilled/v4.0.0.0`; before/after gate outputs stored as scratchpad files `skdesign-before.txt`/`skdesign-after.txt` captured this session]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets, tokens, or account identifiers in any new or edited file [evidence: 0/29 files contain secret/token values; `Bearer` appears only as the documented operator-owned alternative]
- [x] CHK-031 [P0] No instruction to mutate `.utcp_config.json`, auth state, or the workspace; read-only boundary preserved everywhere [evidence: install.sh performs zero writes; QUOTA-001 grades mutation proposals as FAIL]
- [x] CHK-032 [P1] OAuth-gated steps consistently marked operator-only / SKIP-valid with the exact command [evidence: 3/3 walkthroughs + 3/3 new scenarios carry the SKIP-valid marking]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with what actually shipped [evidence: Files-to-Change table matches `git status` for the two skill trees + this folder]
- [x] CHK-041 [P1] Version discipline: SKILL.md/README/playbook/catalog bumped to 1.1.0.0; `changelog/v1.1.0.0.md` describes the release; sk-design pointer bumped to 1.6.0.0 [evidence: `grep -rn "version: 1.1.0.0"` hits SKILL.md:6 + README.md:10 + playbook + catalog files; changelog exists]
- [x] CHK-042 [P2] De-dup direction documented in both homes (changelog names the directive; pointer names the canonical owner) [evidence: `changelog/v1.1.0.0.md` sk-design section; `refero_tools.md` canonical-home-moved note]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Writes confined to the two authorized skill surfaces and this phase folder [evidence: 29/29 session writes under `mcp-tooling/mcp-refero/`, 6 `design-interface` files, and this spec child; other dirty paths in `git status` predate this session]
- [x] CHK-051 [P1] scratch/ clean (only the scaffold `.gitkeep`); temp gate outputs live in the session scratchpad, not the repo [evidence: `ls scratch/` = `.gitkeep` only]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-16
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
