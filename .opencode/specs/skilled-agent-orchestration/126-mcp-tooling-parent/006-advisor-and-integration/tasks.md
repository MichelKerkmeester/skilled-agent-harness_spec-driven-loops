---
title: "Tasks: Phase 6: advisor-and-integration"
description: "Task list for unifying the hub graph identity and repointing every live functional and documentation referrer for the mcp-tooling fold-in."
trigger_phrases:
  - "advisor integration tasks"
  - "hub graph union tasks"
  - "referrer sweep tasks"
  - "phase 006 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration"
    last_updated_at: "2026-07-10T07:20:00Z"
    last_updated_by: "claude"
    recent_action: "Checked off integration tasks; 2 items stay deferred"
    next_safe_action: "Rebuild advisor skill-graph DB when scheduled"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/plan.md"
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-advisor-and-integration"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: advisor-and-integration

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

- [x] T001 Confirm phases 004-005 complete: all three trees resolve under the hub — both phases validated 0/0 before this phase started
- [x] T002 Re-run the phase 001 referrer sweep to refresh the live-hit inventory — sweep re-run against `doctor_mcp_install.yaml` before authoring the referrer repoints
- [x] T003 [P] Read the three source `graph-metadata.json` files for the union inputs — the union inputs are visible in `.opencode/skills/mcp-tooling/graph-metadata.json`'s `derived.source_docs` list
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author `mcp-tooling/graph-metadata.json` unioning intent signals, trigger phrases, and outward edges (figma to sk-design, union enhances to sk-code); record code-mode as an external cross-skill dependency; delete the three child graph files; and repoint the inbound/reverse edges in `mcp-code-mode/graph-metadata.json` and `sk-design/graph-metadata.json` to `mcp-tooling` — all in one atomic change (never rebuild the advisor between deletion and hub-identity authoring) — `.opencode/skills/mcp-tooling/graph-metadata.json` carries the union `edges` (depends_on sk-design@0.7 + mcp-code-mode@0.7, enhances sk-code@0.5, siblings sk-design@0.45); `git status --short` shows the three child `graph-metadata.json` files as `D`; `mcp-code-mode/graph-metadata.json` and `sk-design/graph-metadata.json` both show `"target": "mcp-tooling"` reverse edges
- [x] T005 Repoint `doctor_mcp_install.yaml` `skill_dir`/`install_guide` for the 3 bridges and fix the stale `mcp-open-design` entry — `.opencode/commands/doctor/assets/doctor_mcp_install.yaml` lines 198-229 point all 3 bridges at `.opencode/skills/mcp-tooling/mcp-*` and `mcp-open-design` now points at `.opencode/skills/sk-design/design-mcp-open-design`
- [x] T006 Retarget the 3 `labeled-prompts.jsonl` rows from `mcp-chrome-devtools` to `mcp-tooling` — `grep -c "mcp-tooling" labeled-prompts.jsonl` returns 3, and 0 rows still target the old flat id
- [ ] T007 Update `.opencode/skills/README.md` + root `README.md` catalogs and restate the CLAUDE.md/AGENTS.md figma-transport prose — README catalogs done (both files reference `mcp-tooling`); CLAUDE.md/AGENTS.md prose restatement deferred, both still read "`mcp-figma` is the external sibling Figma transport" (operator decision, governs agents repo-wide)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Re-run the grep sweep; confirm zero live hits for the old flat skill-folder paths, and grep all `graph-metadata.json` for the three bridge ids to confirm no dangling reverse edge remains — repo-wide `rg` sweep confirms the only remaining hits are historical spec/changelog/playbook-fixture text outside this packet, plus the deferred CLAUDE.md/AGENTS.md prose (tracked separately, not a dangling path)
- [ ] T009 Rebuild the advisor skill-graph DB; confirm `mcp-tooling` is re-keyed and the `code_mode` registration plus the name-keyed `.utcp` manuals are byte-unchanged (only `mcp-code-mode`'s graph-metadata reverse edges changed) — DB rebuild deferred (coordinated operator-gated reindex); the byte-unchanged half is confirmed: `git diff .utcp_config.json` shows the `chrome_devtools_1/2`, `clickup_official`, and `figma` manual blocks untouched (the file's only diff is an unrelated `gitkraken` manual addition from a different, concurrent packet)
- [x] T010 Run phase-folder validation — `validate.sh .../006-advisor-and-integration --strict` reports `Errors: 0  Warnings: 0`, `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` — T007 and T009 stay open (2 operator-approved P1 deferrals: CLAUDE.md/AGENTS.md prose, advisor DB rebuild)
- [x] No `[B]` blocked tasks remaining
- [ ] One hub graph identity; zero live functional hits for the old paths; advisor re-keyed — first two true; advisor re-key deferred with the DB rebuild
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
