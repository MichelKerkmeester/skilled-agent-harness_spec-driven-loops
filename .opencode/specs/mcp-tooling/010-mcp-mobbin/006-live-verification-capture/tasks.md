---
title: "Tasks: Phase 6: live-verification-capture (mcp-mobbin)"
description: "Task list for recording the 2026-07-16 mobbin discovery fixture, superseding the one-tool baseline with three live tools, and resolving the deep-mode conflict."
trigger_phrases:
  - "mobbin discovery tasks"
  - "mobbin fixture tasks"
  - "mobbin live verification tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/006-live-verification-capture"
    last_updated_at: "2026-07-16T16:30:00Z"
    last_updated_by: "claude-agent"
    recent_action: "All tasks complete with evidence"
    next_safe_action: "Close phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-006-live-verification-capture-mobbin"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: live-verification-capture

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

- [x] T001 Read the discovery fixture end to end and extract the observed facts (`references/discovery_fixture_2026-07-16.json`) [evidence: 3/3 names in `discoveredCallableNames` (`mobbin.mobbin.search_screens`, `.search_flows`, `.search_sections`); `mode?: "deep" | "standard" | "fast"` in the `search_screens` schema; declared output `{ query, screens[] }` without `index`/`failed[]`]
- [x] T002 Grep the packet for INFERRED, one-tool, and open-deep wording (`mcp-mobbin/**`) [evidence: `rg -n "INFERRED|single documented|one documented|deep"` produced the 22-file flip set including both scripts]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Rebuild SKILL.md: discovery banner, three-tool surface table, resolved deep, workflows (search_flows + search_sections), ALWAYS/NEVER rules, quick ref, version 1.1.1.0 (`mcp-mobbin/SKILL.md`) [evidence: 9 edits; frontmatter `version: 1.1.1.0`]
- [x] T004 Rebuild references/tool_surface.md on the fixture schemas; resolve open questions 1, 3, 4, 10 (`references/tool_surface.md`) [evidence: section 1 retitled "THE LIVE-DISCOVERED TOOLS (THREE)"; 4/10 open questions marked RESOLVED with fixture citations]
- [x] T005 [P] Flip references/mcp_wiring.md naming section to CONFIRMED and troubleshooting.md drift row (`references/mcp_wiring.md`, `references/troubleshooting.md`) [evidence: observed-shape table 2/2 rows CONFIRMED; drift row names the fixture baseline]
- [x] T006 [P] Flip README.md, INSTALL_GUIDE.md, and the server README (`README.md`, `INSTALL_GUIDE.md`, `mcp-servers/mobbin-mcp/README.md`) [evidence: 8 edits; 2 INSTALL_GUIDE checklist items `[x]` with fixture evidence]
- [x] T007 [P] Flip the feature catalog: root banner/inventory/areas/count + flows, screens, apps, elements leaves (`feature_catalog/**`) [evidence: 10 edits; flows leaf rebuilt on `mobbin.mobbin_search_flows`; areas table gains the Sections row]
- [x] T008 [P] Flip the examples: README banner/preflight/rules + all three walkthroughs (`examples/**`) [evidence: 10 edits; flow walkthrough now calls `mobbin.mobbin_search_flows` and uses returned `position` ordering as fact]
- [x] T009 [P] Flip the playbook: root naming status + do-not-run note + DISCOVER-001 row, discovery_first.md, flow_intent.md, screens_search.md (`manual_testing_playbook/**`) [evidence: 12 edits; FLOWS-001 pass/fail re-anchored on the live tool; SCREENS-001 allows deliberate `mode` use]
- [x] T010 [P] Flip the asset checklist (`assets/utcp_mobbin_manual.md`) [evidence: 3 items flipped: naming confirmed, tool-set supersession, deep/schema resolution, each citing the fixture]
- [x] T011 Update both script hints and add `changelog/v1.1.1.0.md` (`scripts/doctor.sh`, `scripts/install.sh`, `changelog/v1.1.1.0.md`) [evidence: doctor prints the 3-name fixture baseline; install prints "confirmed 2026-07-16"; changelog has 15 file rows]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the packet gate and residual sweeps (`package_skill.py`, `bash -n`, `rg`) [evidence: `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/mcp-tooling/mcp-mobbin --check --strict` printed "Result: PASS"; `bash -n` exit 0 on both scripts; INFERRED grep returns 0 non-changelog hits]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: T001-T012 above, 12/12]
- [x] No `[B]` blocked tasks remaining [evidence: zero `[B]` rows in this file]
- [x] Manual verification passed [evidence: checklist.md 100% verified with per-item evidence]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
