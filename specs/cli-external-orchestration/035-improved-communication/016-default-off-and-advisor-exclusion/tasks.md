---
title: "Tasks: Phase 016 Default-Off and Advisor Exclusion"
description: "Completed task breakdown for the default-off enablement gate, the adjustable advisor route-exclusion, the live routing probe, and packet closeout."
trigger_phrases:
  - "default-off-and-advisor-exclusion"
  - "tasks"
  - "enablement gate and advisor exclusion tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/016-default-off-and-advisor-exclusion"
    last_updated_at: "2026-08-13T19:03:35.000Z"
    last_updated_by: "claude"
    recent_action: "Recorded all enablement and exclusion tasks as complete with evidence."
    next_safe_action: "After landing on main, rebuild the advisor dist, reindex, and re-probe to confirm the exclusion."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-016-default-off-20260813"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every task has observed completion evidence and no blocker remains."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 016 Default-Off and Advisor Exclusion

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies |
| `[B]` | Blocked with a named condition |

**Task format**: `T### [P?] Description (primary surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Confirm the two enablement opt-in sources and their precedence (`src/config/enablement.ts`) [evidence: `COMMUNICATION_PROJECTION_ENABLED` wins when set to `1`/`true`/`on`, else the git-ignored `enablement.local.json` opts in]
- [x] T002 [P] Locate both advisor routability seams (`lib/scorer/fusion.ts`, `lib/lifecycle/archive-handling.ts`) [evidence: `isDefaultRoutable` is the sole production recommend gate; `filterDefaultRoutable` is the defense-in-depth filter]
- [x] T003 Capture the advisor failure baseline before verifying the change (`tests/`) [evidence: 41 pre-existing failures from unrelated prior worktree drift]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T004 Verify the default-off resolver and gate (`src/config/enablement.ts`) [evidence: `isProjectionEnabled()` defaults false; pure `resolveProjectionEnablement(env, localOverride)`; neither source present yields false]
- [x] T005 Verify the enablement exports and the git-ignored opt-in template (`src/config/index.ts`, `src/index.ts`, `enablement.local.json.example`, `.gitignore`) [evidence: enablement re-exported to the public surface; committed `.example`; `.gitignore` ignores `enablement.local.json`]
- [x] T006 Verify the fail-safe route-exclusion loader (`lib/routing/route-exclusions.ts`) [evidence: cached loader, `SPECKIT_ADVISOR_ROUTE_EXCLUSIONS_DIR` override, reset seam; missing or malformed config yields an empty set and never throws]
- [x] T007 [P] Verify the committed denylist and the git-ignored local override (`config/route-exclusions.json`, `config/route-exclusions.local.json.example`, root `.gitignore`) [evidence: committed list holds `sk-communication`; local override fully replaces including an empty list; root `.gitignore` ignores the local file]
- [x] T008 Verify the denylist wired into both seams (`lib/scorer/fusion.ts`, `lib/lifecycle/archive-handling.ts`) [evidence: excluded ids return non-routable at the recommend gate and are dropped by the archive filter]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T009 Run the package gate from the package directory (`npm run check`) [evidence: typecheck, build, public-import smoke, and 296/296 tests, which is 289 prior plus 7 new enablement tests]
- [x] T010 Run the advisor route-exclusion unit tests and confirm the advisor build (`tests/route-exclusions.vitest.ts`) [evidence: ten new tests pass; advisor typecheck and build green]
- [x] T011 Run the live advisor probe (`skill_advisor.py`) [evidence: `"make CLI output readable, claudish to english" --threshold 0.5` returns `cli-external-orchestration`, `sk-git`, `sk-design`, `sk-code`; before the change it returned `sk-communication` at confidence 0.95 and score 0.85]
- [x] T012 Run the negative control against the failure baseline (`tests/`) [evidence: an empty exclusions directory makes both seam edits exact no-ops; the change adds +10 passing and 0 new failures against the 41-failure baseline]
- [x] T013 Author and wire the complete Level-3 packet (`016-default-off-and-advisor-exclusion/`, parent and Phase 015 links) [evidence: complete packet, phase map, transition chain, handoff table, files table, and graph children]
- [x] T014 Backfill metadata and run final strict validation (`graph-metadata.json`, `validate.sh`) [evidence: Phase 016 and parent each report zero errors and zero warnings]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Enablement defaults to off and opts in through either source, with the environment variable winning. [evidence: `resolveProjectionEnablement` unit coverage inside the 296-test gate]
- [x] The live advisor probe no longer returns `sk-communication`. [evidence: probe output lists four other skills]
- [x] The package gate reports 296 of 296 tests passing. [evidence: `npm run check`]
- [x] The advisor change adds ten passing tests and zero new failures. [evidence: negative control against the 41-failure baseline]
- [x] Phase 016 and parent metadata, navigation, and strict validation agree. [evidence: graph backfills and zero-error, zero-warning strict runs]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Parent packet**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
