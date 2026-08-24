# Research Report — Runtime Migration/Rollback Residue Audit (ox-alpha lineage)

**Session:** fanout-ox-alpha-1787574283712-fmjp15 · **Loop type:** research · **Stop reason:** max_iterations (3/3)
**Scope:** READ-ONLY audit of `.opencode/skills/system-deep-loop/runtime/` — no files modified.
**Baseline state:** all 8 modes at `new_authoritative_final`; ledger is the single write authority; legacy surfaces are read-only projections.

## Convergence Report
| Metric | Value |
|---|---|
| Stop reason | max_iterations |
| Iterations | 3 (migration → rollback → over-built abstraction) |
| newInfoRatio trend | 1.0 → 0.7 → 0.4 |
| Convergence threshold | 0.05 (treated as telemetry; loop broadened angles instead of early synthesis) |
| Candidates found | 8 ranked findings, ~6,200 LOC lib + ~5,050 LOC tests removable |

## Ranked Findings (deletion safety × LOC saved)

### 1. Seven dead per-mode legacy-compat upcast modules — ~2,506 lib LOC (+~1,800 test LOC), risk: low-medium
`legacy-compatibility.ts` in deep-ai-council / deep-improvement-common / model-benchmark / deep-alignment / deep-review / skill-benchmark / agent-improvement ledger-schema dirs (475+397+411+367+334+269+253). Each exports `decide<Mode>Compatibility` + `upcastLegacy<Mode>Record`; every symbol greps to only its own module, its barrel re-export, and its own unit test — no reachable call from any shipped entrypoint.
⚠️ The **deep-research** variant is live (`scripts/append-mode-event.cjs:453`) — keep it.

### 2. mode-contracts value layer — ~1,606 lib LOC (+1,382 test LOC), risk: low-medium
`conformance.ts` (1120) + `strict-gate-validator.ts` (225) + `compatibility-policy.ts` (121) + `substrate-ports.ts` (140): the pre-flip conformance/certification harness; only importer is `tests/unit/mode-contracts.vitest.ts`. All 8 reducers consume the module via `import type` exclusively — keep `mode-contract-types.ts` and the type re-exports, delete the value engine.

### 3. Fleet enablement stack — ~869 lib/script LOC (+~1,180 test LOC), risk: medium
`scripts/enable-modes.cjs` (550) + `lib/fleet-enablement/` (319) + their two test files. Purpose (serial per-mode enablement during rollout) is complete; callers are its own tests only.

### 4. flip-authority.cjs — 665 script LOC (+311 test LOC), risk: medium
One-time durable registry-direct flip runner. All modes final; referenced only by its own tests, scripts README, changelog. Deleting it removes the last instrumented authority-move path — consistent with the "no authority moves" posture of this packet.

### 5. hierarchical-budgets shadow-adapters.ts — 164 LOC (+~150 test LOC), risk: low-medium
"Shadow-parity evidence" wrappers around legacy fan-out/cost-guard modules for independent derivation; constructed by nothing outside its own test suite. hierarchical-budgets core stays (voc-allocation consumes it).

### 6. receipts-and-effect-recovery/legacy-compatibility.ts — 93 LOC, risk: low
Frozen observe-only `LEGACY_RECOVERY_SURFACES` manifest; sole consumer is one test assertion block.

### 7. CAS two-phase cutover machinery in per-mode-authority-flip — ~300 reducible LOC, risk: high-adjacency
`prepareCutover` / `compareAndSwap` / pending-transition persistence are called ONLY by findings 3–4. Reduce the registry to read+selector **after** 3–4 land. Adjacent to the fail-closed gateway — sequence carefully or defer.

### 8. Dead exports AUTHORITY_FLIP_COMMON_MODE/_VARIANTS — ~15 LOC, risk: low
Zero consumers outside their own barrel; bundle with finding 7 or remove standalone.

## Explicit KEEP list (load-bearing / adjacent to live loop)
- **Typed append-only ledger stack**: authorized-ledger, event-envelope, locks-and-fencing, replay-fingerprint, mode-append gateway — preserved untouched.
- **lib/legacy-projections/** — the live projection surface the gateway invokes on every write ("readable as projections" mandate).
- **lib/cutover-binding/** — resolved by the gateway on each append.
- **per-mode-authority-flip read path** (`AuthorityRegistry.read`, `selectAuthorityRoute`, `AUTHORITY_FLIP_MODE_ORDER`) — used by composition, fanout dispatch, gateway; includes the `rollback_pending` deny branch (defensive, adjacent).
- **Receipts/certificates gating real writes**: receipts-and-effect-recovery core, dispatch-receipts.
- **Fail-closed enforcement CLIs**: check-projection-coverage, check-direct-append, check-protocol-append-sites, verify-authority (read-only ops insurance).
- **deep-research-ledger-schema/legacy-compatibility.ts** — live caller in the shipped append CLI.

## Suggested sequencing (for a future implementation pass, not executed here)
1. Findings 1, 2, 5, 6, 8 (independent, low risk) → run vitest + tsc.
2. Findings 3, 4 (ops tooling removal) → re-grep `prepareCutover|compareAndSwap` to confirm finding 7's isolation proof still holds.
3. Finding 7 reduction last, with the gateway test suite as the gate.

## Sources
All evidence from symbol-level import-graph analysis recorded in iterations 001–003 and findings-registry.json (paths + grep results cited per finding).
