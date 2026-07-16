---
title: "Tasks: Phase 5: inventory-parity-and-doc-truth"
description: "Task list for the mcp-mobbin registered-state doc-truth sweep and inventory-parity additions: state verification, per-file flips, doctor/install scripts, examples, playbook enrichment to 9 scenarios, catalog constraints, 1.1.0.0 release, and gates."
trigger_phrases:
  - "mobbin doc truth tasks"
  - "mobbin parity tasks"
  - "phase 005 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/005-inventory-parity-and-doc-truth"
    last_updated_at: "2026-07-16T18:00:00Z"
    last_updated_by: "claude"
    recent_action: "All 16 tasks complete with evidence"
    next_safe_action: "Run phase 006 live-verification-capture after operator reconnect + OAuth"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/005-inventory-parity-and-doc-truth/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-inventory-parity-and-doc-truth"
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

> Setup here means verifying the registered state and inventorying the stale markers before any edit.

- [x] T001 Verify the registered `mobbin` manual read-only: JSON parse plus field-for-field match against the researched shape (`.utcp_config.json`) [evidence: parse OK; 1 entry; `stdio` / `npx -y mcp-remote https://api.mobbin.com/mcp` / `env: {}`]
- [x] T002 Baseline the stale-marker inventory (`rg -i` over the packet) [evidence: 98 marker lines across 15 files recorded before edits]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Implementation covers the per-file doc-truth flips and the parity additions.

- [x] T003 Flip SKILL.md to registered-state truth: discovery trap, routing STEP 0, first-step section, RULES, ESCALATE, quick reference, resources (`.opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md`) [evidence: 16 stale spots flipped; version 1.1.0.0]
- [x] T004 [P] Flip README.md: at-a-glance, overview, quick start, wiring section, troubleshooting, FAQ, verification, related docs (`README.md`) [evidence: 15 stale spots flipped incl. lines ~25/~97/~191]
- [x] T005 [P] Flip INSTALL_GUIDE.md: intro, AI-first prompt, quick checks, Section 4 reframed reconnect-and-authenticate, quick-reference card, checkpoints, 1.1.0.0 history row (`INSTALL_GUIDE.md`) [evidence: 17 stale spots flipped; historical 1.0.0.0 row kept]
- [x] T006 [P] Flip references: mcp-wiring.md (§3 heading + discovery framing), tool-surface.md (~line 17, ~line 134), troubleshooting.md (baseline + no-tools row + never-do) (`references/`) [evidence: 10 stale spots flipped across 3 files]
- [x] T007 Rewrite assets/utcp-mobbin-manual.md as the registered reference shape; execute the 9-item checklist doc-side (`assets/utcp-mobbin-manual.md`) [evidence: 3 items `[x]` with dated evidence; 6 live items SKIP-valid with exact commands]
- [x] T008 Flip scripts/doctor.sh: absence INFO to ERR; header comment; callable pointer notes pending discovery/OAuth (`scripts/doctor.sh`) [evidence: `bash -n` clean; live run reports `OK 'mobbin' manual registered` + bridge shape]
- [x] T009 [P] Flip mcp-servers pointer and feature_catalog root (`mcp-servers/mobbin-mcp/README.md`, `feature_catalog/feature_catalog.md`) [evidence: 6 stale spots flipped across the 2 files]
- [x] T010 Create examples/: README + smoke_search_limit_1 + platform_flow_research + element_intent_query, each with mandatory `tool_info` first, SKIP-valid OAuth, traces to tool-surface.md only (`examples/`) [evidence: 4 files created; every walkthrough opens with the tool_info step]
- [x] T011 Create scripts/install.sh: verify-only, non-interactive (node 18+/npx, manual presence = OK, OAuth pointer) (`scripts/install.sh`) [evidence: `bash -n` clean; live run exit 0 with `OK` posture lines]
- [x] T012 Rename+rewrite MANUAL-001 scenario: manual_absent_expected.md becomes manual-registered-expected.md; presence expected, absence escalated (`manual_testing_playbook/discovery-setup/`) [evidence: file renamed via mv; 0 dangling old-name links (the single remaining mention is the rename narrative in `changelog/v1.1.0.0.md`)]
- [x] T013 Add PLATFORM-001, RATELIMIT-001 (SKIP-valid), PAIDGATE-001; update root playbook to 9 scenarios / 5 categories / 5 waves with registered-state preconditions (`manual_testing_playbook/`) [evidence: index lists 9 IDs mapped to 9 files; coverage table totals 9]
- [x] T014 [P] Enrich the 4 catalog leaves with query recipes + cross-cutting constraints traced to tool-surface.md (`feature_catalog/{apps,screens,flows,elements}/`) [evidence: 4 of 4 leaves carry a recipes table and a constraints section citing tool-surface.md §1/§3]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Verification covers the release bump and every gate run.

- [x] T015 Bump packet to 1.1.0.0 and author changelog/v1.1.0.0.md (`changelog/v1.1.0.0.md`, frontmatter versions) [evidence: SKILL.md frontmatter `version: 1.1.0.0`; changelog file present]
- [x] T016 Run the gates: marker-grep regression, `bash -n` both scripts, live script runs, `package_skill.py --check --strict` [evidence: grep clean outside documented exclusions; strict gate Result: PASS (1 word-count advisory, sibling parity)]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: T001-T016 above, 16 of 16]
- [x] No `[B]` blocked tasks remaining [evidence: zero `[B]` rows in this file]
- [x] Manual verification passed [evidence: doctor.sh + install.sh live runs green; strict package gate PASS]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
