---
title: "Tasks: Phase 9: incumbent-inventory-parity"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "incumbent inventory parity tasks"
  - "tasks"
  - "feature catalog tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/009-incumbent-inventory-parity"
    last_updated_at: "2026-07-16T13:17:05Z"
    last_updated_by: "claude-opus"
    recent_action: "All 16 tasks complete with evidence; no blocked tasks"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-chrome-devtools/feature_catalog/feature_catalog.md"
      - ".opencode/skills/mcp-tooling/mcp-click-up/INSTALL_GUIDE.md"
      - ".opencode/skills/mcp-tooling/mcp-figma/examples/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-009-incumbent-inventory-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: incumbent-inventory-parity

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

- [x] T001 Read all three packets' full doc surface (SKILL.md, references/, manual_testing_playbook/, examples/, mcp-servers/, changelog/) [evidence: leaf `SOURCE FILES` tables cite file-and-section per claim, e.g. `references/cdp_patterns.md §8`]
- [x] T002 [P] Extract and record live chrome_devtools manuals (`jq '.manual_call_templates[] | select(.name | startswith("chrome_devtools"))' .utcp_config.json`) [evidence: 2 entries, `chrome-devtools-mcp@0.26.0`, `--isolated=true`, empty env]
- [x] T003 [P] Baseline gates: `package_skill.py --check --strict` x3 [evidence: PASS 3-of-3; pre-existing word-count warnings only (click-up 3110, figma 3285)]
- [x] T004 [P] Inventory inbound links to click-up `references/install_guide.md` before choosing link direction [evidence: `rg -n "references/install_guide"` hits in SKILL.md:75,169,463, README.md:199,229, examples/README.md:327, mcp-servers READMEs, scripts/doctor.sh:90, references/mcp_tools.md:47, doctor_mcp_install.yaml:229]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 chrome: author `feature_catalog/feature_catalog.md` root (.opencode/skills/mcp-tooling/mcp-chrome-devtools/feature_catalog/) [evidence: root doc with 7 domain sections and 29-feature count table]
- [x] T006 chrome: author 29 per-feature leaves across 7 snake_case domain dirs [evidence: `find feature_catalog -type f | wc -l` = 30]
- [x] T007 chrome: generate `assets/utcp_chrome_devtools_manuals.md` with jq-embedded JSON blocks [evidence: python byte-comparison prints `BYTE-TRUE VERIFIED`]
- [x] T008 [P] chrome: author `mcp-servers/bdg-cli/README.md` + `mcp-servers/chrome-devtools-mcp/README.md` [evidence: both files created, nothing vendored, install path points at `INSTALL_GUIDE.md`]
- [x] T009 chrome: bump SKILL.md 1.0.9.0 to 1.0.10.0, link new surfaces in §8, write `changelog/v1.0.10.0.md` [evidence: SKILL.md:5 `version: 1.0.10.0`; changelog file created]
- [x] T010 click-up: author top-level `INSTALL_GUIDE.md` front door from `references/install_guide.md` content [evidence: file created; every command/config block traceable to the reference]
- [x] T011 click-up: append pointer note to `references/install_guide.md`; preserve all content above it [evidence: diff is a 3-line trailing blockquote plus separator; no line removed]
- [x] T012 click-up: bump SKILL.md 1.0.0.0 to 1.0.1.0, link front door in §8, write `changelog/v1.0.1.0.md` [evidence: SKILL.md:6 `version: 1.0.1.0`; changelog file created]
- [x] T013 figma: author `examples/` (README.md, safe-connect-daemon-health.sh, inspect-export-readonly.sh, optional-mcp-context.md) [evidence: 4 files; scenarios mirror DETECT/CONNECT/DAEMON-001, INSPECT/EXPORT-001, MCP-001; destructive verbs absent]
- [x] T014 figma: bump SKILL.md 1.0.0.0 to 1.0.1.0, link examples in §8, write `changelog/v1.0.1.0.md` [evidence: SKILL.md:6 `version: 1.0.1.0`; changelog file created]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run all gates: `package_skill.py --check --strict` x3, `bash -n` x2, relative-link check [evidence: PASS 3-of-3; `bash -n PASS both scripts`; 0 broken of 151 links in 43 files]
- [x] T016 Spec child: rewrite Level 2 docs, run generate-description.js + backfill-graph-metadata.js, `validate.sh --strict --no-recursive` [evidence: validate PASSED, recorded in implementation-summary.md §5]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: T001-T016 above, 16-of-16]
- [x] No `[B]` blocked tasks remaining [evidence: zero `[B]` markers in this file]
- [x] Manual verification passed [evidence: checklist.md all P0/P1 items verified]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
