---
title: "Tasks: Phase 5: inventory-parity-and-doc-truth"
description: "Task breakdown for the registered-state doc-truth flips, feature catalog and asset additions, doctor hardening, and gate runs on the mcp-aside-devtools packet."
trigger_phrases:
  - "aside parity tasks"
  - "aside doc truth tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside/005-inventory-parity-and-doc-truth"
    last_updated_at: "2026-07-16T13:16:00Z"
    last_updated_by: "claude-agent"
    recent_action: "Marked all tasks complete with evidence"
    next_safe_action: "Run validate.sh --strict on this folder"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-aside-devtools/feature_catalog/feature_catalog.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-005-inventory-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: inventory-parity-and-doc-truth

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Inventory every stale registration marker across the packet [evidence: `rg -n -i "not registered|later phase|not yet registered|manual absent" .opencode/skills/mcp-tooling/mcp-aside-devtools` returned hits in 9 files pre-flip]
- [x] T002 Read exemplars for structure and frontmatter (mcp-mobbin) [evidence: `mcp-mobbin/feature_catalog/feature_catalog.md` + 4 domain leaves and `mcp-mobbin/assets/utcp-mobbin-manual.md` read; 6/6 exemplar files]
- [x] T003 [P] Capture live `aside` entry bytes from the config [evidence: `jq '.manual_call_templates[] | select(.name == "aside")' .utcp_config.json` returned the stdio entry at .utcp_config.json:50]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Flip registration claims in SKILL.md, README.md, INSTALL_GUIDE.md (.opencode/skills/mcp-tooling/mcp-aside-devtools/) [evidence: 12/12 stale spots flipped across the 3 files; e.g. SKILL.md:240 now reads "is registered in `.utcp_config.json`"]
- [x] T005 Flip references, server packages, playbook root; ungate ASD-011 (references/mcp-wiring.md, mcp-servers/, manual_testing_playbook/) [evidence: 18/18 stale spots flipped; code-mode-discovery.md:17 precondition now "session with the code_mode MCP loaded"]
- [x] T006 Doctor error posture: manual absence becomes err + exit 1, read-only preserved (scripts/doctor.sh) [evidence: doctor.sh:110-115 err branch with `manual_missing=1`; `bash -n scripts/doctor.sh` clean]
- [x] T007 Create feature_catalog/ root + 5 intent domains (feature_catalog/) [evidence: 6/6 files created matching the 5 INTENT_SIGNALS keys at SKILL.md:75-81 plus the root catalog]
- [x] T008 Create assets/utcp-aside-manual.md byte-true snapshot (assets/) [evidence: python3 comparison printed `BYTE-TRUE: True` against `jq` output of the live entry]
- [x] T009 Consistency pass + version bump + changelog (SKILL.md, README.md, changelog/v1.1.0.0.md) [evidence: 2/2 frontmatter versions read 1.1.0.0; changelog/v1.1.0.0.md lists 12 file rows]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Residual stale-marker sweep [evidence: `rg -n -i "not registered|later phase|not yet registered|manual absent" .opencode/skills/mcp-tooling/mcp-aside-devtools` returns 0 hits outside changelog/v1.0.0.0.md]
- [x] T011 Packet gate [evidence: `python3 .opencode/skills/sk-doc/create-skill/scripts/package_skill.py .opencode/skills/mcp-tooling/mcp-aside-devtools --check --strict` printed "Result: PASS"]
- [x] T012 Spec child metadata backfill and strict validation [evidence: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/mcp-tooling/008-mcp-aside/005-inventory-parity-and-doc-truth --strict --no-recursive` printed "RESULT: PASSED"]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: 12/12 tasks T001-T012 completed above]
- [x] No `[B]` blocked tasks remaining [evidence: `grep -c "\[B\]" tasks.md` matches only the notation-table row, 0 blocked tasks]
- [x] Manual verification passed [evidence: checklist.md Verification Summary 23/23 items verified]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
