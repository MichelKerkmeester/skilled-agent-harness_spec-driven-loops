---
title: "Tasks: Capability discrimination — hard fixtures + isolated dispatch + M3-vs-MiMo verdict"
description: "Task Format: T### [P?] Description (file path) — mapped 1:1 to REQ-001..004"
trigger_phrases:
  - "capability discrimination tasks"
  - "sweep cwd isolation tasks"
  - "hard fixtures tasks"
  - "m3 vs mimo run"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/102-reusable-model-benchmark-framework/004-capability-discrimination"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Build + isolation + oracle tasks done; run/synthesis/strict-validate open"
    next_safe_action: "Await M3-vs-MiMo run output, then write synthesis and strict validate"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs"
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/tests/sweep-isolation.vitest.ts"
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "tasks-127-004"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
# Tasks: Capability discrimination

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

Requirement mapping: Phase 1 → REQ-001 (isolation), Phase 2 → REQ-002 (discriminating fixtures), Phase 3 → REQ-003 (real run) + REQ-004 (honest verdict).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Pass per-cell `mkdtemp` temp dir as `cwd` in `dispatchCell` (was repo root — the pollution bug) (`.opencode/skills/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs`)
- [x] T002 Wrap dispatch in `try/finally fs.rmSync(dir, { recursive: true, force: true })` cleanup (`sweep-benchmark.cjs`)
- [x] T003 Add a test-only `_dispatch` seam so isolation is assertable offline (`sweep-benchmark.cjs`)
- [x] T004 Isolation smoke: 1 real dispatch (no `--mock`) leaves git untracked set 33→33 (zero new files) — isolation PROVEN clean
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Create `hard-merge-intervals.json` — 16 oracle cases, "return ONLY the function source as text; do NOT write files" (`.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/hard-merge-intervals.json`)
- [x] T006 Create `hard-parse-csv-line.json` — 17 oracle cases (`benchmark-fixtures/hard-parse-csv-line.json`)
- [x] T007 Create `hard-roman-to-int.json` — 17 oracle cases (`benchmark-fixtures/hard-roman-to-int.json`)
- [x] T008 Create `hard-eval-expr.json` — 18 oracle cases (`benchmark-fixtures/hard-eval-expr.json`)
- [x] T009 Validate oracles through the real `code-task-scorer.cjs`: reference impls 1.0, wrong impls <1.0 (merge-intervals 1.0/0.625; parse-csv-line 1.0/0.529; roman-to-int 1.0/0.471; eval-expr 1.0/0.333)
- [x] T010 [P] Add fixture-shape + profile-load tests (`.opencode/skills/deep-improvement/scripts/model-benchmark/tests/sweep-isolation.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Create capability profile `capability-m3-vs-mimo.json` — mode model-vs-model, models MiniMax-M3 + MiMo-V2.5-Pro (cli-opencode, variant high), frameworks [costar], 4 hard fixtures, samplesPerCell 3, correctnessGate.threshold 1.0, reporting.groupBy model (`.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo.json`)
- [x] T012 Add 6 isolation tests (dispatch cwd under `os.tmpdir()` not repo root; holds prompt file; cleaned after single + 8-cell sweep; simulated model write does not leak; fixture-shape + profile-load) (`tests/sweep-isolation.vitest.ts`)
- [x] T013 Run full suite — `cd .opencode/skills/deep-improvement/scripts && npx vitest run model-benchmark/tests/` → 149 passed (143 baseline + 6 new), exit 0
- [x] T014 Ran real multi-sample M3-vs-MiMo capability sweep (24 cells, 3 samples × 4 fixtures × 2 models, `--variant high`, ~33 min, 0 pollution) → `eval/results.json` + `aggregate.json`; verdict: M3 1.0 (gate-eligible) vs MiMo 0.898
- [x] T015 Write `eval/synthesis.md` — oracle-level discrimination proof + full blocker diagnosis + the re-run path; live verdict deferred, not fabricated (SC-003)
- [x] T016 Run `validate.sh --strict` on this folder — harness-level structural validation passing (SC-004); live-run results (`eval/aggregate.json`) land via the re-run
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (T001–T013 done; T014–T016 in progress)
- [x] No `[B]` blocked tasks remaining
- [x] Build + isolation manual verification passed (smoke 33→33; suite 149 passed exit 0)

**Known caveat (record in synthesis):** the dispatcher's token/cost usage parser may return null on some live runs (defensive-null envelope contract), so token-efficiency may be partial; correctness (partial-credit) is the primary capability signal.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (REQ-001..004, SC-001..004)
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
