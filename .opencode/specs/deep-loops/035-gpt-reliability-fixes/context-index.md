# Context Index — 035 Restructure (unified command-contract architecture)

> Migration bridge for the phase-parent reorganization. The parent `spec.md` documents root purpose only; this file records the restructure narration, the old→new phase mapping, and how all 58 plan-review gaps are absorbed. Source of the restructure: `plan-review/gap-synthesis.md` (GAP-58) + the full `plan-review/gap-registry.md`.

## Why the restructure

The 10-phase plan fixed **one** defect — GPT executors don't reliably see a command's contract because it's distributed across ~14 files and weighted by file position — in **five fragments** (old phases 002 prelude, 003 render, 007 agent-contracts, 008 compiled, 010 injection). The plan-review (58 verified gaps, cross-model) recommended collapsing them into **one build-time self-contained contract per command** (GAP-58), which also neutralizes GAP-57 (a raw-injected prelude is itself a new Claude-shaped convention). The user approved the unified-contract restructure.

Two blocker-class design holes and the dropped rollout safety-belt are fixed as part of the new phases, not deferred:
- **GAP-16** (Gate-3 skip trusts an unvalidated boolean) → new phase 002 ships a concrete `validateSpecFolderBinding()`.
- **GAP-23** (receipt HMAC key leaks through the command string) → new phase 004 keeps the key engine-side.
- **GAP-47** (synthesis-mandated feature-flag rollout was dropped) → folded into new phase 001 as foundation, sequenced **before** the risky rewrites.

## Old → new phase mapping

| Old phase | Disposition | New home |
|---|---|---|
| 001 benchmark-harness-hardening | expanded | **001** acceptance-and-rollout-foundation |
| 002 gate3-precedence | expanded + validator | **002** gate3-precedence-and-validator |
| 003 presentation-render | subsumed | **003** command-contract-compiler (render block IN the contract) |
| 004 dispatch-receipts | merged | **004** dispatch-receipts-and-progress |
| 005 progress-records | merged | **004** dispatch-receipts-and-progress |
| 006 routing-offer | moved | **005** retrofit-pacing-and-rollout-completion |
| 007 agent-executor-contracts | subsumed | **003** command-contract-compiler (EXECUTOR CONTRACT block IN the contract) |
| 008 compiled-contract | subsumed (is the compiler) | **003** command-contract-compiler |
| 009 pacing-and-resume | moved | **005** retrofit-pacing-and-rollout-completion |
| 010 injection-slimming | subsumed | **003** command-contract-compiler (inject the contract + one link) |

The old `001-…` through `010-…` folders are removed; their committed content is recoverable at commit `5483436d6a`.

## New phase map (dependency order)

1. **001 — acceptance-and-rollout-foundation.** Make the 033 harness trustworthy AND build the rollout safety net, both before any rewrite lands. Closes F-014, F-025 + the synthesis §5.4 rollout mechanism.
2. **002 — gate3-precedence-and-validator.** The P0 Gate-3 autonomous-precedence bridge with a concrete, called validator + classifier API + caller migration. Closes F-001/002/004/005/028/030/040 + F-003.
3. **003 — command-contract-compiler.** Design-first: one build-time self-contained typed contract per command (Gate-3 precedence line, verbatim setup-render block, output template, write boundary, receipts + progress contracts, tool list, absorption-abort rule), a drift-guard contract, and a deterministic setup loader. Subsumes old 003/007/008/010. Closes F-006/007/042, F-019/020/021/022/039, F-035/036/037/038/009, F-027/029.
4. **004 — dispatch-receipts-and-progress.** Engine-held HMAC receipts + step-transition progress records, embedded in the compiled contract. Closes F-010/011/012/013/041, F-015/016/017/031/043.
5. **005 — retrofit-pacing-and-rollout-completion.** Retrofit the remaining commands + sibling lanes + non-deep-loop surfaces to the contract; the Gate-2 routing offer; pacing/resume (design-first); the council convergence rule (F-018); flag promotion. Closes F-023/024/026, F-032/033/034, F-018.

## 58-gap absorption table

| Gap | Home | How it's tackled |
|---|---|---|
| GAP-01 RSB-001 unphased | 001 | Named as a harness acceptance cell (fixture strict-valid or intended-probe decision) |
| GAP-02 interim absorption guard dropped | 003 | Absorption-abort rule is a durable line in the compiled contract, landing before 004's structural receipts |
| GAP-03 ACB-004 double-claimed / no attribution | 001 (+parent) | `primary_cause`/`secondary_cause` result fields + locked multi-cause list {ACB-004,ACB-005,CXB-004}; per-effort cell ownership recorded in parent |
| GAP-04 high-effort mandate unenforced | 002 | Enforced config point (dispatch-mode default), not a reference |
| GAP-05 baseline-green impossible for ACB-005 | parent | Documented non-green exception list in success criteria |
| GAP-06 single-sample acceptance | 001 | N≥3 rule for contested cells before any flip claim |
| GAP-07 F-003 misclassified non-actionable | 002 | Reclassified actionable; YAML write-mandate wording clarification |
| GAP-08 missing harness instrumentation | 001 | Snapshot assertions + budget-edge checks + advisor telemetry added |
| GAP-09 002↔010 injection collision | 003 | Dissolved — injection folded into the single contract |
| GAP-10 007/008/010 no unique cells | 003 | Measurable structural cells: contract-present assertion, drift-guard CI, token-budget assertion |
| GAP-11 006 mis-serialized | 005 | Routing sequenced correctly (predecessor 001/002, not 005) |
| GAP-12 002 cells co-owned by agent files | 002/003 | Agent Gate-3 hoisted into the contract; co-ownership dissolved |
| GAP-13 009→004 receipt dependency | 004 | Receipts + resumable key lifecycle co-located |
| GAP-14 001 rewrites 006's baseline | 001 | Post-rewrite re-score captured as the new baseline handed to routing |
| GAP-15 004↔005 shared surfaces | 004 | Receipts + progress merged — coupling now internal |
| GAP-16 Gate-3 validator undefined (BLOCKER) | 002 | Concrete `validateSpecFolderBinding()` the rule calls |
| GAP-17 writeBoundary unenforced | 002 | Enforced + returned; out-of-boundary write re-opens Gate 3 |
| GAP-18 child re-classify re-halts | 002 | Contract + boundSpecFolder propagated to dispatched children; 7th test |
| GAP-19 /doctor precedence conflict | 002 | Precedence line reconciling router clause vs autonomous bridge |
| GAP-20 prior_answer cross-task leak | 002 | prior_answer satisfaction gated to interactive answers only |
| GAP-21 phase-parent pollution | 002 | Validator resolves last_active_child_id / rejects bare parent |
| GAP-22 :confirm classifier vocab | 002 | `:confirm` added + autonomous-confirm+bound test |
| GAP-23 receipt key leaks via command string (BLOCKER) | 004 | Key stays engine-side; wrapper returns facts to countersign |
| GAP-24 wrapper unreachable (12-cmd migration) | 004 | Per-branch × per-YAML migration scoped |
| GAP-25 native receipt can't bind child id | 004 | Split pre-dispatch intent + post-dispatch completion countersign |
| GAP-26 receipt-write I/O failure | 004 | Atomic write + distinct write-failed class + retry |
| GAP-27 route-field demotion breaks 4 YAMLs | 004 | Migration enumerates every assert_jsonl_fields + reader |
| GAP-28 key lifecycle on resume | 004 | Key derived from run-master + dispatchId (re-verifiable, non-persisted) |
| GAP-29 receipt-log DoS | 004 | Parent-owned child-unwritable receipt path |
| GAP-30 reducer allowlist not a REQ | 004 | Allowlist mandated in every completion reducer + test |
| GAP-31 IMB-001/improvement scope contradiction | 004 | Improvement progress scoped correctly (or moved to 005 pacing) |
| GAP-32 council stepwise-persist no writer | 004 | Named writer (incremental flag / seat_dir contract) + test |
| GAP-33 F-018 scope-creep | 005 | F-018 convergence rule moved to 005 (council rules), out of progress |
| GAP-34 60s threshold unanchored | 004 | Threshold derived from watchdog window |
| GAP-35 no-op heartbeats unenforceable | 004 | Work-anchored schema field (progress_delta / artifact check) |
| GAP-36 in-CLI seat granularity | 004 | Per-seat sub-step records or watchdog-only fallback documented |
| GAP-37 broken-runner baselines carried forward | 001 | One-shot full 32×3 re-score before any flip |
| GAP-38 no stall-rate delta | 001 | Pre/post per-mode stall-rate recorded |
| GAP-39 D-007 host confound | 001 (+parent) | Latency compared GPT-leg-vs-itself; D-007 restated on latency phases |
| GAP-40 coverage overclaim | parent | Success scoped to the 32-scenario suite explicitly |
| GAP-41 sibling improvement lanes unphased | 005 | model/skill/ai-system lanes retrofit or deferral recorded |
| GAP-42 :confirm render unaddressed | 003 | Contract render block covers :auto and :confirm |
| GAP-43 11/14 agent files unaudited | 003 | All 14 converted to contract pointers |
| GAP-44 non-deep-loop surfaces | 005 | Named + retrofit or written exclusion boundary |
| GAP-45 single-executor validation | 001 | One non-GPT executor leg added to acceptance |
| GAP-46 other injection paths | 003 | Enumerated + slimmed/deferred in the contract inject step |
| GAP-47 rollout mechanism dropped (BLOCKER by convergence) | 001 | Feature flag + byte-identical fallback + CI comparator + promotion rule, before 002 |
| GAP-48 classifier caller migration | 002 | Migration table for 34 vitest + corpus-runner + 2 machine_contracts |
| GAP-49 baseline-green no CI enforcement | 001 | CI gate script on affected cells + Claude leg |
| GAP-50 boilerplate risks rows | parent (+all) | Each phase's Risks rows carry its specific gap-IDs |
| GAP-51 002 effort M→L | 002 | Re-rated L; optionally split into 002a/002b |
| GAP-52 010 effort S-M→M | 003 | Folded; effort accounted in the contract phase |
| GAP-53 008 research-sized/no design | 003 | Design-first REQ (contract schema + compiler + drift-guard designed before build) |
| GAP-54 009 research-sized/no design | 005 | Pacing/resume design-first REQ + per-sub-invocation cells |
| GAP-55 008 drift class | 003 | Drift-guard contract specified (fail/warn UX, resolve order, recovery) |
| GAP-56 010↔006 routing starvation | 003 (+005) | Per-command deferral matrix + 006-cell non-regression gate |
| GAP-57 prelude is new Claude-shaped convention | 003 | Prelude typed + mode-bound inside the contract, not raw injected text |
| GAP-58 simpler root fix (unified contract) | 003 (this restructure) | Executed — one compiled contract per command |
