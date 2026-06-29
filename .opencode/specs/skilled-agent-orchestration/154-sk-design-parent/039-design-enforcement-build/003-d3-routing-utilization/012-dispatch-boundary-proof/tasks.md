---
title: "Tasks: D3-R12 — Dispatch-boundary child proof"
description: "Phased task list to author the DESIGN_BOUNDARY_PROOF v1 envelope + shared design_dispatch_boundary.md asset, build the design-dispatch-boundary-proof.cjs envelope-lint + asset-parity checker, add the requiresDesignBoundaryProof boundary fixtures + vitest, and verify the hubRoute 13/5/0 gate stays unchanged with the protected files byte-unchanged."
trigger_phrases:
  - "d3-r12 dispatch boundary proof tasks"
  - "design boundary proof task list"
  - "design dispatch boundary parity tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/012-dispatch-boundary-proof"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark every build task done with one-line file-anchored evidence"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - ".opencode/skills/sk-design/shared/design_dispatch_boundary.md"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/design-dispatch-boundary-proof.vitest.ts"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: D3-R12 — Dispatch-boundary child proof

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

> Author the contract: the shared asset, the copy-set decision, and the SKILL.md reference.

- [x] T001 Author the `DESIGN_BOUNDARY_PROOF v1` envelope schema + boundary accept/reject rules + named residual (`.opencode/skills/sk-design/shared/design_dispatch_boundary.md`) [60m] — asset created with §2 schema, §3 JSON shape, §4 rules, §5 residual
- [x] T002 In the asset, specify the required bindings: `version=1`, routed-mode binding to the `ROUTED:`/`observedIntents` declaration, context-manifest digest, design-dispatch-manifest digest, proof-of-application card digest, `DESIGN_PROOF_TOKEN` `nonce`+`runId` reference, and an asset digest [25m] — §2 table lists all required fields; `sha256:<64 lowercase hex>` format
- [x] T003 Resolve and record the copy manifest — the boundary consumer(s) that hold a duplicate of the asset; confirm against real consumers, do not invent any (`shared/design_dispatch_boundary.md` §1) [20m] — copy-set decision: canonical-only (no real duplicate consumer; no fake duplicate invented)
- [x] T004 Attach the `DESIGN_BOUNDARY_PROOF v1` requirement at the child-agent/small-model dispatch success-criterion, referencing the shared asset by relative path (`.opencode/skills/sk-design/design-interface/SKILL.md`) [20m] — `SKILL.md:258` requires the envelope per `../shared/design_dispatch_boundary.md`

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Build the enforcement: the envelope lint, the asset-parity check, and the fixtures.

### Envelope lint
- [x] T005 Implement the envelope lint as a pure function returning `{verdict, findings}`, modeled on `lintDesignToken` (`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs`) [45m] — `lintDesignBoundaryProof()` returns `{verdict, findings}`
- [x] T006 Fail closed on: absent envelope, `version !== 1`, missing routed-mode binding, malformed/missing digests, missing token ref, and routed mode ≠ route-gold `expected.workflowMode` (the mismatched-envelope case) (same file) [30m] — finding codes `missing-boundary-proof`/`unsupported-version`/`missing-routed-mode-binding`/`malformed-digest`/`missing-token-ref`/`routed-mode-mismatch`

### CLI asset-parity checker
- [x] T007 Implement the asset-parity checker as a pure function + `_args.cjs` CLI; read canonical + declared copies, normalize, report `driftDetected` with per-copy findings (`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs`) [50m] — `checkDesignDispatchBoundaryParity()` reports `driftDetected` + `copySetDecision` + per-copy reports
- [x] T008 Wire exit codes: 0 pass, 1 drift-or-missing-copy or rejected envelope (fail closed), 2 unparseable/unreadable input (same file) [15m] — CLI `--file` lint exit 0/1; parity exit 0 / 1 / 2 (unparseable)

### Fixtures + copy set
- [x] T009 [P] Author the faithful fixture pair: envelope present + well-formed → `valid`; `requiresDesignBoundaryProof: true` in the private expected block (`.../fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.{public,private}.json`) [25m] — present-001 public embeds the envelope; private expects `verdict: valid`, `requiresDesignBoundaryProof: true`
- [x] T010 [P] Author the missing/mismatched fixture pair: envelope absent on a route-gold dispatch → flagged/`rejected` (`.../fixtures/sk-design-dispatch/sk-design-dispatch-boundary-missing-001.{public,private}.json`) [25m] — missing-001 omits the envelope; private expects `verdict: rejected`, `findingCodes: ["missing-boundary-proof"]`
- [x] T011 Copy-set resolved canonical-only (T003), so no second copy was placed; the parity checker guards the canonical asset's contract markers + the SKILL.md back-reference, and the vitest exercises drift/missing against a temp clone [20m] — no fabricated duplicate; drift/missing proven via `mkdtemp` clone in the vitest

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Syntax + unit
- [x] T012 `node --check` passes on `design-dispatch-boundary-proof.cjs` [10m] — exit 0
- [x] T013 Author the Vitest spec mirroring `design-token-lint.vitest.ts`: present → `valid`, missing/mismatched → fail-closed `rejected` with expected finding code (`.../scripts/skill-benchmark/tests/design-dispatch-boundary-proof.vitest.ts`) [30m] — spec covers present/absent + version/routed-mode/digest mutations + parity cases
- [x] T014 Parity probe: synthetic drift in one copy → exit 1; identical copies → exit 0; missing copy → fail-closed [15m] — canonical-only exit 0; temp-clone identical valid; drift → `asset-copy-drift`; missing → `missing-copy`

### Regression
- [x] T015 Re-run the route-gold guard; confirm 18 rows / 13 pass / 5 known-gaps / 0 regressions unchanged [15m] — `hubRoute` 13/5/0, `failed: false` (asserted in `design-token-lint.vitest.ts`)
- [x] T016 Confirm the existing `sk-design-dispatch` token-lint tests (faithful/stripped/neither) still pass [10m] — token-lint cases green; combined vitest 11/11

### Static / honesty
- [x] T017 Evergreen scan over the diff: no spec/packet/phase IDs or `specs/` paths in the asset, SKILL.md edit, checker, or fixtures [10m] — scan clean across all 7 new/edited artifacts
- [x] T018 Record the code-enforced vs advisory residual split in `implementation-summary.md` (envelope presence + shape + copy parity enforceable; applied design quality advisory) [10m] — recorded in `implementation-summary.md` Known Limitations #1 + asset §5
- [x] T019 Confirm the protected harness files are byte-unchanged (`router-replay.cjs`, `score-skill-benchmark.cjs`, `live-executor.cjs`, `fixtures/sk-design/`) [10m] — `git diff HEAD` shows no diff on any protected file

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Envelope lint + asset-parity checker both fail closed on their negative cases
- [x] Route-gold guard unchanged at 13/5/0; existing dispatch token-lint tests green
- [x] `node --check` clean; evergreen scan clean; protected files byte-unchanged
- [x] Checklist.md fully verified with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates, explicit verification tasks)
- Build complete: envelope lint + asset-parity checker fail closed; canonical-only copy set; hubRoute 13/5/0; vitest 11/11; protected files byte-unchanged
-->
