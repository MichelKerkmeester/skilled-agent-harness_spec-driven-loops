# Iteration 5: Minimum Sequenced Work

## Focus
Q5: minimum sequenced work for reproducibility, self-reporting, and unattended safety — split into work safe before the concurrent `sk-design` restructure ends versus work that must wait. Synthesizes Q1–Q4; does not re-litigate them.

## Findings
1. **Ordering principle:** fix closure self-reporting and dual-location hygiene before expanding enforcement; do not block the fleet on hubs known mid-restructure without an escape hatch; do not prune publish recovery until lifecycle tests can execute. [SOURCE: iterations 001–004]
2. **Safe NOW (does not require sk-design to declare six modes again):**
   1. **Align `cli-external-orchestration` harness with live skills** — remove `cli-devin` from promoted `sourceInputs`, add/keep `cli-cursor` in **authored** harness so both graphs compile against the four live modes. This is independent of sk-design and unblocks `--check` for at least one of the two named hubs. [SOURCE: iteration-002 findings 4] [SOURCE: runtime build-artifacts.cjs:82] [SOURCE: authored build-artifacts missing cli-cursor]
   2. **Mint/write-back dual-location policy (Q1)** — when mint/refresh writes runtime activation, also write (or sync) the authored activation copy, or make sync the sole writer that updates both. Closes the `sk-doc` authored-drift / identity-bind failure mode. [SOURCE: iteration-001] [SOURCE: sk-doc hash mismatch in iteration-002]
   3. **Wire CI guard job (Q3)** — add workflow invoking `compiled-route-guard.cjs` with a reviewed allowlist entry for `sk-design` reason=`inputs-do-not-compile` (and temporarily `cli-external-orchestration` until step 1 lands). Keep pre-commit/session as `--warn-only`. [SOURCE: iteration-003]
   4. **Surface compile errors in sync `--check`** — today unresolved hubs only print names; print the underlying `loadHubEngine` message (ENOENT / six modes / undefined.toString) so operators do not guess. [SOURCE: compiled-route-sync.cjs:741] [SOURCE: resolve.cjs:119 swallows]
   5. **Do not strip staging/rollback (Q4)** while doing the above. [SOURCE: iteration-004]
3. **MUST WAIT for sk-design restructure completion:**
   1. Remove `sk-design` from the uncompilable allowlist.
   2. Re-mint sk-design after registry/compiler agree on mode cardinality (4 vs required 6 — either update compiler contract or restore six modes; **UNVERIFIED which side is the intended end state**).
   3. Re-run full lifecycle test suite / nested rename recovery prune once `--check` and build succeed for the fleet.
   4. Any change that assumes sk-design compiled serving is green. [SOURCE: registry-compiler.cjs:296] [SOURCE: live mode count 4]
4. **Self-reporting minimum:** guard JSON + CI annotation of reason codes; sync `--check` error detail; status tool already exists (`compiled-route-status.cjs`) — ensure operators see fresh/stale/drift/compile-error in one place. [SOURCE: .opencode/bin/compiled-route-status.cjs exists] [INFERENCE: status UX integration depth not audited this iteration]
5. **Unattended safety minimum:** CI blocking on `stale-manifest` and `authored-drift` with no escape; allowlist only `inputs-do-not-compile`; keep `runtime-no-spec-import` and `routing-registry-drift` as siblings. [SOURCE: iteration-003] [SOURCE: workflow files]
6. **Reproducibility minimum:** dual-location write-back (step 2.2) + successful authored closure trace after cli harness fix + sk-design wait item. Without write-back, runtime-healthy + unreproducible-from-source remains. [SOURCE: guard authored-drift wording :17]

## Ruled Out
- Re-litigating Q1–Q4 instead of sequencing.
- Making pre-commit/pre-push/session the authoritative freshness blocker.
- Removing staging/rollback before closure failures are fixed and tests run.
- Excusing sk-design beyond a narrow, reviewed `inputs-do-not-compile` window.

## Dead Ends
None beyond noise greps already noted in prior iterations.

## Edge Cases
- UNVERIFIED: whether sk-design's end-state mode count is 4 (update compiler) or 6 (restore modes).
- UNVERIFIED: exact CI path filters / allowlist file location.
- Confirmed contradiction carried forward: runtime does not currently resolve the two hubs; baseline claim otherwise is stale.

## Sources Consulted
- iterations 001–004 in this lineage
- prior evidence pointers in sync/guard/harness/compiler/workflows

## Assessment
- New information ratio: 0.85 (sequence decisions new; rests on prior evidence; +simplicity bonus for safe-now vs wait split)
- All five questions answered for synthesis.

## Recommended Next Focus
Synthesis → `research.md` with concrete recommendations and explicit UNVERIFIED markers.
