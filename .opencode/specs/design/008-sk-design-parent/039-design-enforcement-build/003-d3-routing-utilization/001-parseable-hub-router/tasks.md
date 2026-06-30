---
title: "Tasks: D3-R1 Parseable hub-router projection"
description: "Ordered implementer work items plus verification tasks (acceptance replay and no-regression diff) for the sibling sk-design/hub-router.json and the additive router-replay.cjs reader."
trigger_phrases:
  - "hub router tasks"
  - "router-replay reader tasks"
  - "hub-router.json work items"
  - "d3-r1 tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/001-parseable-hub-router"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all hub-router projection work items and verification tasks complete"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: D3-R1 Parseable hub-router projection

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

### Routing policy + signals
- [x] T001 Create `hub-router.json` with `routerPolicy` (defaultMode `interface`, ambiguityDelta `1`, tieBreak order, outcomes single/orderedBundle/defer) (`.opencode/skills/sk-design/hub-router.json`) [30m]
- [x] T002 Add `routerSignals` per mode (interface, foundations, motion, audit, md-generator) with mode-level `weight`, `classes`, and `resources` packet paths (`.opencode/skills/sk-design/hub-router.json`) [20m]

### Typed vocabulary
- [x] T003 Add `vocabularyClasses` seeded from `mode-registry.json` aliases, one keyword per class (no duplication) (`.opencode/skills/sk-design/hub-router.json`) [30m]
- [x] T004 Extend `vocabularyClasses` to cover the currently-untyped hub keywords from the `sk-design/SKILL.md` `<!-- Keywords: ... -->` block so the ~46.5% untyped set is fully typed (`.opencode/skills/sk-design/hub-router.json`) [25m]
- [x] T005 Verify `"animate the menu"` is present in a `motion` class so the acceptance prompt routes to `motion` (`.opencode/skills/sk-design/hub-router.json`) [10m]

### Identity boundary
- [x] T006 Confirm `mode-registry.json` is unchanged — identity-only; no routerPolicy/routerSignals added there (`.opencode/skills/sk-design/mode-registry.json`) [5m]


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Helper
- [x] T007 Add `projectHubRouter(filePath)` helper that parses `hub-router.json` and returns `{ intentSignals, resourceMap, defaultResource }` per the §3 contract — one intent per mode, keywords unioned from each mode's classes, lowercased (`.../skill-benchmark/router-replay.cjs`) [25m]

### Branch wiring
- [x] T008 Insert a presence-gated branch in `parseRouter` AFTER the referenced-doc block: only when still empty AND `fs.existsSync(skillRoot/hub-router.json)`; set `routerSource = 'hub-router.json'` (`.../skill-benchmark/router-replay.cjs`) [15m]
- [x] T009 Confirm the change is additive/backward-compatible: inline still wins, referenced doc still wins over sibling, branch is a no-op when `hub-router.json` is absent (`.../skill-benchmark/router-replay.cjs`) [5m]

### Hygiene
- [x] T010 [P] Ensure new code comments + `hub-router.json` carry NO spec/packet/phase IDs or spec paths (durable WHY only) [5m]


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Acceptance
- [x] T011 Run `node router-replay.cjs --skill .opencode/skills/sk-design --task "animate the menu"`; assert `parseable:true` and `intents` includes `motion` (exit 0) [10m]
- [x] T012 [P] Run a second prompt (e.g. `--task "audit the design"`) and assert it routes to `audit` (sanity that routing discriminates) [5m]

### No-regression
- [x] T013 Capture BEFORE-change parse output for `sk-code` and `design-interface` (baseline) [10m]
- [x] T014 Re-run `router-replay.cjs` on `sk-code` and `design-interface` AFTER the change; `diff` against baseline and assert identical (zero regression) [10m]

### Static / evergreen
- [x] T015 [P] `grep` `hub-router.json` and any edited SKILL.md text for spec paths / packet-phase IDs; assert none [5m]

### Documentation
- [x] T016 Mark checklist items with evidence; set status `complete` once acceptance + no-regression are both green [5m]


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Acceptance replay: `parseable:true` and routes to `motion`
- [x] No-regression diff clean for sk-code and design-interface
- [x] `mode-registry.json` unchanged (identity-only)
- [x] Checklist.md fully verified


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
LEVEL 2 TASKS
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks (acceptance + no-regression)
-->
