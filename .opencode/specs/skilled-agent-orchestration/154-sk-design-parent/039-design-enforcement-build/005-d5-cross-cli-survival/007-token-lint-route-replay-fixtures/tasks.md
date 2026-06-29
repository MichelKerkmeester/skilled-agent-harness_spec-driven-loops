---
title: "Tasks: D5-R7 token lint + route-replay fixtures"
description: "Effort-estimated task list with explicit verification tasks for the additive design-proof-token lint and route-replay/negative-control fixtures."
trigger_phrases:
  - "d5-r7 tasks"
  - "design token lint tasks"
  - "route replay fixtures tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/007-token-lint-route-replay-fixtures"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all setup, implementation, and verification tasks complete"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r7-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: D5-R7 token lint + route-replay fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm new sibling corpus dir keeps the gated corpus byte-identical (`.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/`) [10m] — `git status` shows `fixtures/sk-design/` unchanged
- [x] T002 [P] Re-read the v1 lint rules to implement (`.opencode/skills/sk-design/references/design_proof_token.md` §2/§6/§7) [10m] — encoded in `REQUIRED_FIELDS`/`REQUIRED_DIGEST_FIELDS`/`DIGEST_RE`/`ISO_UTC_RE`
- [x] T003 [P] Pin the manifest token files the faithful token cites (`.opencode/skills/sk-design/shared/context_loading_contract.md`, `.opencode/skills/sk-design/shared/register.md`, `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md`) [10m] — encoded in `REQUIRED_MANIFEST_PATHS`

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lint Module
- [x] T004 Implement `lintDesignToken(payload)` returning `{ verdict, findings }` per the v1 static rules (`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs`) [1.5h] — pure function exported; verdict `valid` iff zero findings
- [x] T005 Add a thin CLI entry mirroring `router-replay.cjs`/`d5-connectivity.cjs` (exit 0 clean, non-zero on verdict mismatch) (`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs`) [30m] — `--file` CLI exits 0 valid / 1 rejected / 2 usage
- [x] T004/T005 verified — CLI exit 0 (faithful) and 1 (stripped) confirmed on the public fixtures

### Fixtures (sk-design-dispatch corpus)
- [x] T006 [P] Faithful positive pair: prompt routes `DESIGN` + faithful token with all v1 fields + manifest token files → expected lint `valid` (`.../fixtures/sk-design-dispatch/sk-design-dispatch-faithful-001.public.json` + `.private.json`) [25m] — lint `valid`, 0 findings
- [x] T007 [P] Stripped/weakened negative pair: prompt routes `DESIGN` + token missing a required digest / downgraded `singleUse` → expected lint `rejected` (`.../fixtures/sk-design-dispatch/sk-design-dispatch-stripped-001.public.json` + `.private.json`) [25m] — lint `rejected`, `single-use-not-true`
- [x] T008 [P] Neither-loaded negative control pair: non-design prompt (no `DESIGN` route) + no payload → expected lint `rejected` / fail closed (`.../fixtures/sk-design-dispatch/sk-design-dispatch-neither-001.public.json` + `.private.json`) [20m] — lint `rejected`, `missing-token`

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Syntax
- [x] T009 `node --check` passes on the new lint module (`design-token-lint.cjs`) [5m] — NODE_CHECK_OK

### Test Hook
- [x] T010 Author the vitest hook reusing `routeSkillResources` for route-replay (`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/design-token-lint.vitest.ts`) [40m] — two describe blocks: dispatch fixtures + route-gold guard
- [x] T011 Assert faithful payload → `valid` AND positive prompt routes to the `DESIGN`/sk-design lane [10m] — `expectDesignRoute` + `lint.verdict === 'valid'`
- [x] T012 Assert stripped/weakened payload → `rejected` with the expected finding (fails closed) [10m] — `findingCodes` contains `single-use-not-true`
- [x] T013 Assert neither-loaded control does not route to `DESIGN` and fails the lint [10m] — `intents == []`, `defaultApplied == true`, lint `missing-token`

### No-Regression
- [x] T014 Re-score the existing 18-pair `fixtures/sk-design/` corpus; assert hubRoute gate `failed:false`, 13 pass / 5 known-gap / 0 regression [15m] — guard block asserts the exact headline
- [x] T015 Confirm `fixtures/sk-design/` and `score-skill-benchmark.cjs` are byte-identical (no edits) [10m] — `git status` shows neither modified

### Evergreen + Docs
- [x] T016 Grep new fixtures + `.cjs`/test code for spec IDs/paths/packet numbers; confirm none present [10m] — finding codes and file paths only
- [x] T017 Mark all checklist.md items with evidence [10m] — all CHK items `[x]` with evidence

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Token-lint catches a stripped/weakened token — `rejected` `single-use-not-true`
- [x] Faithful token lints clean AND routes correctly — `valid` + `interface` route
- [x] No-regression on the existing corpus (13/5/0 unchanged) — vitest guard asserts the headline
- [x] `node --check` passes on new `.cjs`; vitest hook passes — NODE_CHECK_OK
- [x] checklist.md fully verified — all CHK items `[x]`

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research evidence**: `037-design-routing-and-integration-research/research/research.md` §8 (D5-R7)

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
- PLANNING ONLY: status planned, all boxes pending
-->
