---
title: "Tasks: Registry static-audit gate (scanHubRegistry)"
description: "Ordered build + verification tasks for the additive scanHubRegistry() scan in d5-connectivity.cjs, including a synthetic-broken-registry test and no-regression checks."
trigger_phrases:
  - "scanhubregistry tasks"
  - "registry static audit build"
  - "blocked-by-registry verification"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/007-registry-static-audit"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all scanHubRegistry build and verification tasks complete with evidence"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Registry static-audit gate (scanHubRegistry)

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

- [x] T001 Read `scanConnectivity` end-to-end; note its return shape, severity/penalty scheme (`P0:40, P1:12, P2:3`), and `gateFailed` rule to mirror (`d5-connectivity.cjs`) [15m] — Evidence: shape/severity/gate mirrored; the literal lifted to the shared `SEVERITY_PENALTY` const
- [x] T002 Add `scanHubRegistry({ skillRoot })` skeleton next to `scanConnectivity`; add it to `module.exports` alongside `scanConnectivity` + `listMarkdownRefs` (`d5-connectivity.cjs`) [10m] — Evidence: `function scanHubRegistry` at `d5-connectivity.cjs:131`; exported at `:358`
- [x] T003 Implement the registry-presence guard: when `mode-registry.json` is absent at `skillRoot`, return `{ registryPresent:false, score:100, gateFailed:false, verdict:null, findings:[], missingModes:[], deadPackets:[], packetNameMismatches:[], aliasCollisions:[], uncoveredIntentRate:null, uncoveredKeywords:[] }` (`d5-connectivity.cjs`) [10m] — Evidence: registry-less skill returns `registryPresent:false`, no gate
- [x] T004 Read + JSON-parse `mode-registry.json` and `hub-router.json`; on a parse failure emit a P0 `registry_unparseable` finding (fail-soft, no throw) rather than crashing (`d5-connectivity.cjs`) [10m] — Evidence: `registry_unparseable` class at `:95`/`:143`; missing `hub-router.json` → `BLOCKED-BY-REGISTRY`, no throw

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Hard-gate checks (P0)
- [x] T005 `missingModes`: for each `modes[].workflowMode`, require BOTH a packet folder `<skillRoot>/<mode.packet>/` with `SKILL.md` AND a `hub-router.json.routerSignals[mode.workflowMode]` projection; record which facet is missing (`d5-connectivity.cjs`) [30m] — Evidence: live sk-design `missingModes:[]`
- [x] T006 `deadPackets`: enumerate on-disk packet folders (registry `.packet` set ∪ sibling `design-*/` dirs); flag any folder not referenced by a registry mode (`d5-connectivity.cjs`) [25m] — Evidence: live sk-design `deadPackets:[]`
- [x] T007 `aliasCollisions`: build `alias(lowercased) → Set<workflowMode>` over all `modes[].aliases[]`; flag any alias owned by ≥2 distinct modes (`d5-connectivity.cjs`) [20m] — Evidence: live `aliasCollisions:[]`; seeded collision → populated + `alias_collision` finding (`:250`)

### Reported facets
- [x] T008 [P] `packetNameMismatches` (P1): compare each `mode.packetSkillName` to the packet `SKILL.md` frontmatter `name:`; record mismatches (reported, NOT a gate trigger) (`d5-connectivity.cjs`) [20m] — Evidence: live `packetNameMismatches:[]`; P1 non-gating
- [x] T009 [P] `uncoveredIntentRate` + `uncoveredKeywords` (metric): raw = deduped/lowercased registry alias phrases; typed = union of `hub-router.json.vocabularyClasses[*].keywords` (lowercased); rate = `|raw \ typed| / |raw|`; threshold gate documented but OFF by default (`d5-connectivity.cjs`) [25m] — Evidence: live `uncoveredIntentRate` `0.39` (`0.3928…`), threshold OFF

### Assemble + emit
- [x] T010 Build `findings[]` with consistent severities; compute `score` (100 − penalties, floored 0) (`d5-connectivity.cjs`) [15m] — Evidence: shared `SEVERITY_PENALTY` const (`:31`); live `score:100`, 0 findings
- [x] T011 Set `gateFailed = missingModes.length || deadPackets.length || aliasCollisions.length > 0`; when true set `verdict = 'BLOCKED-BY-REGISTRY'`, else `null` (`d5-connectivity.cjs`) [10m] — Evidence: `:268`/`:274`; live `gateFailed:false`, `verdict:null`
- [x] T012 Extend the `require.main === module` CLI block additively: keep the `scanConnectivity` run/print/exit identical; only when `registryPresent`, append the registry result and fold its gate into the exit code (`d5-connectivity.cjs`) [20m] — Evidence: CLI calls `scanHubRegistry` at `:367` only when registry present
- [x] T013 Comment hygiene pass: durable WHY only — no spec/packet/phase IDs, no spec paths in code or comments (evergreen [HARD]) (`d5-connectivity.cjs`) [10m] — Evidence: evergreen grep over the module returned no IDs or `specs/` paths

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Syntax
- [x] T014 `node --check d5-connectivity.cjs` exits 0 [5m] — Evidence: re-run at doc time, `NODE_CHECK_EXIT=0`

### Unit — real state
- [x] T015 Add a Vitest block asserting `scanHubRegistry` on the live sk-design root returns `aliasCollisions:[]`, `missingModes:[]`, `deadPackets:[]`, `packetNameMismatches:[]` (5/5 parity), a numeric `uncoveredIntentRate`, and `gateFailed:false` (`tests/skill-benchmark.vitest.ts`) [25m] — Evidence: additive real-state block added; re-confirmed by requiring the module directly
- [x] T016 Record the measured `uncoveredIntentRate`; sanity-check it lands near the documented ~0.465 baseline. If it diverges materially, reconcile the raw-keyword definition (aliases only vs aliases ∪ hub-identity keywords) and document the decision — do NOT hard-code the rate (`tests/skill-benchmark.vitest.ts`) [15m] — Evidence: measured `0.39` (`0.3928…`), improved from ~0.46 because the typed hub-router vocab now covers more keywords; not hard-coded
- [x] T017 Add a Vitest helper that builds a synthetic registry skill in an OS temp dir (`mkdtempSync`, mirroring `makeRouterlessSkill()`): `mode-registry.json` + `hub-router.json` + packet folders with `SKILL.md` (`tests/skill-benchmark.vitest.ts`) [20m] — Evidence: additive synthetic-registry helper + blocks added
- [x] T018 Seed a missing mode / unparseable registry (missing `hub-router.json`) → assert `gateFailed:true` + `verdict:'BLOCKED-BY-REGISTRY'` (`tests/skill-benchmark.vitest.ts`) [15m] — Evidence: missing `hub-router.json` → `registry_unparseable` → `BLOCKED-BY-REGISTRY`
- [x] T019 Seed an alias collision (same alias under two modes) → assert `gateFailed:true` + `verdict:'BLOCKED-BY-REGISTRY'`; clean fixtures via `afterAll` (`tests/skill-benchmark.vitest.ts`) [15m] — Evidence: colliding alias → `aliasCollisions` populated + `alias_collision` finding → `BLOCKED-BY-REGISTRY`

### Non-regression
- [x] T020 Assert `scanHubRegistry` on a registry-less skill (`makeRouterlessSkill()` / cli-codex) returns `registryPresent:false`, `gateFailed:false` (`tests/skill-benchmark.vitest.ts`) [10m] — Evidence: registry-presence guard returns benign pass
- [x] T021 Full skill-benchmark Vitest suite NOT runnable offline (needs network / own config); no-regression verified at the function level (`scanConnectivity` logic-unchanged + runs, only the same-value `SEVERITY_PENALTY` refactor + the export line touch it) + the additive-diff level (5 new blocks, no existing block modified) [15m] — Evidence: diff deletions are only the penalty literal → const + the `module.exports` line

### Documentation
- [x] T022 Update spec.md status + implementation-summary.md with the measured real-state numbers and synthetic-gate evidence [15m] — Evidence: spec upgraded to Level 2 complete; implementation-summary.md authored
- [x] T023 Mark all checklist items with evidence [10m] — Evidence: checklist fully `[x]` with evidence + Fix Completeness section

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `node --check` passes (exit 0)
- [x] Real-state + synthetic-gate verified; no-regression at function + diff level (full suite not runnable offline)
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
- Additive scanHubRegistry build + emit in d5-connectivity.cjs
- Verification: real-state, synthetic-broken-registry gate, no-regression
-->
