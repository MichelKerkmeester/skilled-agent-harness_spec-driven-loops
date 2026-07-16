---
title: "Verification Checklist: Phase 9: incumbent-inventory-parity"
description: "Verification Date: 2026-07-16"
trigger_phrases:
  - "incumbent inventory parity checklist"
  - "verification"
  - "checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/009-incumbent-inventory-parity"
    last_updated_at: "2026-07-16T13:17:05Z"
    last_updated_by: "claude-opus"
    recent_action: "All applicable items verified with evidence"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-009-incumbent-inventory-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 9: incumbent-inventory-parity

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

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` §4 lists REQ-001 through REQ-008 (8-of-8 with concrete acceptance criteria)
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` §1-§4; derive-and-mirror architecture with named sibling models per element
- [x] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: `.utcp_config.json` chrome entries extracted via `jq`; sibling structures (mcp-click-up catalog, mcp-figma assets/mcp-servers) read before authoring
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks
  - **Evidence**: `package_skill.py <packet> --check --strict` prints `Result: PASS` for 3-of-3 packets; `bash -n` exits 0 for both new figma scripts
- [x] CHK-011 [P0] No console errors or warnings introduced
  - **Evidence**: post-change warnings identical in kind to baseline (click-up/figma SKILL.md word-count warnings pre-existed at 3110/3285 words); chrome has zero warnings
- [x] CHK-012 [P1] Error handling implemented
  - **Evidence**: both figma scripts use `set -euo pipefail`, preflight checks with exit 1, and an explicit overwrite-refusal branch in `inspect-export-readonly.sh`
- [x] CHK-013 [P1] Code follows project patterns
  - **Evidence**: catalog leaves mirror `mcp-click-up/feature_catalog/cupt_task_listing/filter_today.md` frontmatter and section shape; mcp-servers READMEs mirror `clickup-cli`/`figma-mcp` pointer patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met
  - **Evidence**: REQ-001..REQ-008 verified 8-of-8; per-REQ evidence in `tasks.md` T005-T015
- [x] CHK-021 [P0] Manual testing complete
  - **Evidence**: byte-parity of the assets snapshot verified programmatically (`BYTE-TRUE VERIFIED` for both JSON blocks vs `jq` extraction); link check walked 151 relative links in 43 touched files with 0 broken
- [x] CHK-022 [P1] Edge cases tested
  - **Evidence**: pinned-vs-latest MCP package divergence documented in the snapshot asset (live pin `chrome-devtools-mcp@0.26.0` wins); export-path collision path present in the figma script
- [x] CHK-023 [P1] Error scenarios validated
  - **Evidence**: each new pointer/example doc carries a failure-mode table sourced from its packet's `references/troubleshooting.md` (4-of-4 new READMEs/pointers have one)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class
  - **Evidence**: the one contract-touching change (click-up install-guide promotion) classed `cross-consumer`; all other work is additive documentation classed `instance-only`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep
  - **Evidence**: install-guide producers inventoried; only click-up lacked a top-level guide (`ls` of chrome/figma packets shows `INSTALL_GUIDE.md` present in both)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests
  - **Evidence**: `rg -n "references/install_guide"` inventory (11 consumer sites) recorded in tasks.md T004 and plan.md FIX ADDENDUM; all preserved unchanged
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests
  - **Evidence**: not applicable, no security/path/parser/redaction code changed; documentation-only phase, 0-of-44 touched files are runtime code (`git status` shows only `.md` additions plus 2 example `.sh`)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed
  - **Evidence**: verification matrix = 3 packets x {`package_skill.py`, link-check} + 2 scripts x `bash -n` + 1 snapshot byte-parity + 1 spec-child validate; 10-of-10 rows run
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state
  - **Evidence**: not applicable, no process-wide state read by any added artifact; scripts read only their own arguments and `PATH`
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range
  - **Evidence**: work performed on `skilled/v4.0.0.0` as uncommitted working-tree changes at verification time; evidence pinned to exact file paths + gate outputs recorded in implementation-summary.md §5, to be bound to the commit SHA at commit time
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
  - **Evidence**: snapshot embeds only public npm package/args (`env: {}` in both manuals); figma docs repeat the never-print-token rule and scripts never read the token file
- [x] CHK-031 [P0] Input validation implemented
  - **Evidence**: `inspect-export-readonly.sh` refuses existing output paths (exit 1) and preflights binary + daemon before any operation
- [x] CHK-032 [P1] Auth/authz working correctly
  - **Evidence**: not applicable, no auth surface changed; install docs reproduce the packets' existing auth guidance verbatim in intent (cupt `pk_` token, prefixed `figma_FIGMA_API_KEY`)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: all three docs describe the same 16-task, 3-gate delivery; file inventories match `git status` for the touched trees
- [x] CHK-041 [P1] Code comments adequate
  - **Evidence**: 2-of-2 scripts open with purpose/safety-model/preconditions/usage headers; `safe-connect-daemon-health.sh` cites DETECT-001/CONNECT-001/DAEMON-001
- [x] CHK-042 [P2] README updated (if applicable)
  - **Evidence**: figma `examples/README.md` created; packet SKILL.md §8 sections link every new surface; packet root READMEs intentionally untouched (out of minimal scope)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: verification ran via inline Bash heredocs; 0 temp files written into packet or spec trees (`git status` shows no strays)
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: `ls scratch/` in this packet returns empty
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
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
