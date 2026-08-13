# Research: Further Improvements for the deep-pi and pi-cache-optimizer Forks

**Method**: 4 independent lineages, 24 iterations total, forced to full depth (`--stop-policy max-iterations`, no early convergence) — `gpt-5.6-sol` (high, cli-codex, 7 iterations, 35 source findings), `gpt-5.6-luna` (max, cli-codex, 7 iterations, 28 findings), Grok 4.5 (`cursor-grok-4.5-high-fast`, cli-cursor, 6 iterations, 7 curated findings + a P0/P1/P2 backlog), and a 4th lineage added afterward — `deepseek-v4-flash` (via `opencode-go`, cli-opencode, 4 iterations, 20 findings) — explicitly briefed to read the first 3 lineages' synthesis and either corroborate or refute it, not just restate it. All four read the real source (`.pi/extensions/pi-cache-optimizer/`, `.pi/extensions/deep-pi/`) independently; convergence below means "found the same real issue from a cold start," not "copied from each other."

**Run integrity note**: sol's own research completed cleanly (7/7 iterations, `synthesis_complete`, 35 findings) — but a post-synthesis continuity-sync step then attempted to write outside its lineage sandbox (into sibling packet `006`'s `description.json` files and the repo-wide `specs/descriptions.json`). The fan-out write-containment guard caught and reverted all 3 out-of-scope writes (confirmed via `git diff`, clean). sol's *research* is fully valid and included below; only its administrative lineage status shows "failed." This is itself a real finding, listed under Maintainability.

---

## Tier 1 — All four lineages independently found this (highest confidence)

### 1. The DeepSeek-ownership predicate is duplicated with no shared source of truth
Both forks hardcode the same two model IDs (`deepseek-v4-flash`, `deepseek-v4-pro`) as their activation boundary — `pi-cache-optimizer/index.ts:1275-1281` and `deep-pi/extensions/deeppi/eligibility.ts:1-17`. Nothing forces the two lists to change together; a future model addition to one without the other silently breaks the split. All four lineages flagged this as the top structural risk (`deepseek-v4-flash`'s independent read: `f-ownership-duplicated-corroborated`); grok scored it P0.
**Fix direction**: a shared, generated allowlist fixture both forks import from, plus a combined-host contract test (see #5) that fails if the lists ever diverge.

### 2. `/deeppi`'s report is still UI-notify-only — the disclosed 006 limitation, now with a concrete fix
`deep-pi/extensions/deeppi.ts:64` routes the full report exclusively through `ctx.ui.notify()`. All four lineages independently proposed the same shape (`deepseek-v4-flash`: `f-report-ui-only-corroborated`): persist a versioned, structured report object (data separate from its text rendering) that both the TUI and a non-interactive caller (RPC, a file, a command) can read. Luna additionally notes there's no shared `schemaVersion` across either fork's command output at all (`f-015`).
**Fix direction**: separate report *data* from *rendering* from *transport*; write the data to a small JSON snapshot on each report, independent of whether `ctx.ui` exists.

### 3. deep-pi keeps no persistent stats file, unlike pi-cache-optimizer
Confirmed structural asymmetry: `pi-cache-optimizer/index.ts:4066-4103` persists versioned session/total buckets to disk; `deep-pi/extensions/deeppi/telemetry.ts:27-45` resets in-memory state every session. All four lineages flagged this independently (`deepseek-v4-flash`: `f-stats-asymmetry-corroborated`, plus a concrete design note that the new stats file should reuse deep-pi's own already-atomic `atomicWriteFile` rather than copy pi-cache-optimizer's racier read-merge-rename — `f-deeppi-stats-design`); grok scored it P1.
**Fix direction**: add a deep-pi analog of pi-cache-optimizer's stats file, with the same session + cumulative-daily scope split sol proposes (`f-deeppi-dual-scope-stats`), written via deep-pi's own atomic-write helper.

### New in the 4th pass: deep-pi's cold-start cache write is entirely invisible to its own telemetry
`deepseek-v4-flash`'s own independent finding (`f-deeppi-coldstart-invisible`): every session's first request establishes the cache but deep-pi's recorder drops it and flips `usageUnavailable` permanently for that session — the exact cold-start gap this research was scoped to characterize turns out to be a real correctness bug in deep-pi specifically, not just an uninstrumented economics question. `f-pco-coldstart-instrumented` confirms pi-cache-optimizer is structurally able to characterize the same window; only the actual measurement run is missing there.
**Fix direction**: fix the recorder to not drop first-request usage before running any cold-start benchmark — otherwise the benchmark would measure the recorder's own bug, not the real cache-write cost.

### 4. Cost/savings arithmetic omits cache-write cost; cold-start behavior is uncharacterized for both forks
sol, luna, and grok independently found the same gap from different angles: deep-pi's `estimatedSavings` is a no-cache *counterfactual*, not a causal measurement, and silently drops nonzero `cacheWrite` usage from its own accounting (`deep-pi/extensions/deeppi/telemetry.ts:47-67`); no controlled cold/warm crossover benchmark exists for either fork to actually measure this.
**Fix direction**: label the existing metric honestly as a counterfactual (cheap, immediate); design a real crossover experiment (enabled/disabled, repeated, randomized) before publishing any savings percentage as causal — this directly extends the benchmark I ran on 2026-08-08, whose numbers are real but are exactly this kind of counterfactual estimate, not a controlled causal measurement.

### 5. Both forks are missing boundary, fault-injection, and cross-extension composition tests
pi-cache-optimizer's tests concentrate almost entirely in one file despite an 8,390-line entry module (`pi-cache-optimizer/tests/review-findings.test.ts`), and never exercise `message_end` through actual persistence + restart. deep-pi's tests are modular but don't cover pure-cache-write usage, malformed numeric input, or failed/aborted messages (`deep-pi/tests/telemetry.test.ts:20-38,142-226`). No test anywhere loads **both** extensions into one host and proves the ownership split holds when they coexist — grok and luna both flagged this specific gap (`f-composition-test`, `f-012`) as P0.
**Fix direction**: a combined-host test that registers both extensions together and asserts exactly one ever activates per model id, plus the specific missing fault-injection cases named above.

---

## Tier 2 — Two of three lineages converged independently

### 6. deep-pi's declared live-benchmark script doesn't exist
Both sol and luna independently ran the same check and got the same result: `deep-pi/package.json`'s `benchmark:live` points at `scripts/live-benchmark.mjs`, which is absent — `test -e .pi/extensions/deep-pi/scripts/live-benchmark.mjs` exits 1. This is a real, reproducible, one-line-to-verify defect, not a design opinion.

### 7. pi-cache-optimizer's stats persistence has no cross-process concurrency control
sol traced the actual read-merge-rename cycle (`index.ts:4215-4306`) and found no lock across concurrent Pi processes writing the same stats file, malformed persisted data silently treated as empty (data loss on corruption), and weak temp-file naming with no guaranteed cleanup. Luna's `f-016`/`f-017` independently confirm the durability gap from a different angle: in-memory trend samples don't survive restart, and persistence failures leave no durable health signal.

**Correction from the 4th lineage**: sol's separate `f-deeppi-cas-gap` finding (a cross-process TOCTOU window in deep-pi's `edit_lines`, between an expected-content check and rename) is a different, narrower claim than the pi-cache-optimizer persistence issue above — and `deepseek-v4-flash`'s independent trace of `atomicWriteFile` found it already verifies landed content post-rename (`f-post-rename-verification`), meaning that specific deep-pi TOCTOU severity is overstated. The pi-cache-optimizer persistence gap in this section stands unaffected; only the narrower deep-pi `edit_lines` claim is downgraded. This is exactly the kind of correction a single-model synthesis can't catch on its own.

### 8. Vendored fork provenance and sync are entirely manual
Both packet 003 and 006 document byte-identical vendored copies, but nothing automatically re-checks that against the upstream forks over time — sol (`f-fork-build-identity`, `f-patch-ledger`), luna (`f-025`), and grok (`f-vendor-drift`, P2) all flagged this as a slow-burn maintainability risk, not an active bug.

### 9. pi-cache-optimizer's monolithic entry file mixes unrelated concerns
8,390 lines in one file combining prompt transforms, provider adapters, persistence, routing, diagnostics, commands, and hooks (luna `f-022`, sol `f-monolith`/`f-pco-staged-modularization`). Both lineages explicitly recommend staged extraction by *characterized* responsibility seam, not a big-bang refactor — and sol's own final "adversarial prioritization" iteration independently ranks this below correctness/persistence fixes, not above them.

---

## Tier 3 — Single-lineage, well-evidenced, worth acting on

- **deep-pi silently drops pure cache-write usage from its own accounting** and lacks a `stopReason` guard on `message_end`, so failed/aborted turns can still get recorded — both cite exact line ranges (`deep-pi/extensions/deeppi/telemetry.ts:47-67,130-185`) against pi-cache-optimizer's already-correct handling of the same cases (luna `f-005`, `f-006`).
- **deep-pi trusts unvalidated numeric usage values** (no finite/non-negative check before mutating counters), unlike pi-cache-optimizer's normalization layer (luna `f-008`).
- **deep-pi's report omits counters it already maintains** — `errorsEnhanced`, `prunedThinking`, `preservedThinking` are tracked internally but never wired into `/deeppi`'s output (luna `f-014`) — this is a cheap, mechanical fix, same shape as the HANDOFF fix already applied to `costMathErrors` in 006/001.
- **The two forks' headline cache-hit-rate metrics use different denominators** (deep-pi excludes cache-write tokens, pi-cache-optimizer includes them) — luna `f-020`. This means the benchmark artifact I published on 2026-08-08 correctly avoided cross-fork rate comparisons, but any future dashboard combining both numbers needs to normalize the denominator first or it will silently mislead.
- **A local Pi/provider fixture could close the missing-credential gap directly** rather than working around it — sol `f-credential-independent-boundary-test`. This would let the `opencode/deepseek-v4-flash-free` regression check (blocked in 006/003 by a missing live credential) run for real without needing that credential at all.
- **sol's post-synthesis continuity-sync step isn't containment-aware in fan-out mode** — a workflow-level finding, not a fork finding: the deep-research agent's own late-stage metadata-sync habit reached outside its lineage sandbox into a sibling packet. The guard caught it correctly, but the underlying step should scope its own writes to `{artifact_dir}` before this recurs on a less-guarded surface.

---

## Tier 4 — New from the 4th lineage's own independent read (not found by the first 3)

`deepseek-v4-flash` corroborated most of Tiers 1-3 (above) from a cold start, then surfaced several genuinely new findings none of sol/luna/grok caught:

- **`before_provider_request` digests the entire conversation on every request, and `messageDigests` grows unboundedly** (`f-hotpath-prefix-digest`) — a real performance/memory concern in a hot path, not just a design nit.
- **deep-pi's `benchmark:live` is broken two separate ways, not one** (`f-benchmark-double-broken`) — sol and luna both found the script missing; this lineage additionally found the package's `files` allowlist excludes the `scripts/` directory entirely, so even fixing the missing file wouldn't ship it.
- **The combined-host composition test (#5, Tier 1) has a concrete blocker**: the two forks use divergent test runners — `node:test`+`jiti` vs `vitest` (`f-composition-test-seam`) — so the fixture that would prove one-owner behavior can't just be dropped into either suite as-is; the runner mismatch has to be resolved first.
- **`/deeppi`'s report command has a read-only-looking side effect**: it mutates `telemetry.latestChurn` even though nothing about invoking a report should change state (`f-report-command-side-effect`) — worth fixing before or alongside the structured-report refactor in #2, since that refactor will otherwise inherit the same bug.
- **No stopReason guard on `message_end` has a sharper failure mode than "retry inflation"**: a zero-usage failed attempt can flip `usageUnavailable` permanently for the rest of the session (`f-stopreason-guard-absent`), extending luna's `f-006`.
- **DeepSeek v4 has no separate cache-write pricing tier — the write cost *is* the cache-miss price** (`f-write-cost-is-miss-price`). This sharpens Tier 1 finding #4: any savings calculation that ignores cache-write cost isn't just incomplete, it's silently double-crediting a price DeepSeek already charges at the miss rate.
- **Self-correction, worth noting on its own**: this lineage's own first iteration wrongly concluded `errorsEnhanced` doesn't exist in deep-pi; iteration 4 caught and corrected that against the real source (`f-errorsenhanced-corrected`) — luna's original `f-014` finding (storm/stability counters tracked but unsurfaced) stands as originally stated.

---

## Ruled out (all lineages agree these are wrong directions)

- Broadening `isDeepPiOwned`/`isDeepSeekLikeModel` into one shared predicate — would orphan `opencode/deepseek-v4-flash-free`, already decided against in packet 003 (grok).
- Treating RPC status visibility as having closed the full-report observability gap — 006 already correctly scoped this as a partial answer; the full report body is still unconfirmed over RPC (grok, cross-checked against 006/003's own disclosed limitation).
- Publishing any universal savings percentage as a guarantee — deep-pi's own README already disclaims fixed hit rates, and the counterfactual-vs-causal gap above means neither fork should claim a fixed number (grok, sol).
- A bare try/catch-after shape for any new validation guard — already the exact bug class fix #3 of 006/001 was built to prevent; no lineage proposed reintroducing it.

---

## Priority-ranked action list (cross-validated: grok's P0/P1/P2 backlog, sol's own final adversarial-prioritization pass, and luna's staged-order finding all independently converge on this ordering)

**P0 — do first, correctness/contract floor:**
1. Fix deep-pi's cold-start telemetry bug — the first request of every session is dropped and permanently flips `usageUnavailable` (new, Tier 1) — fix this *before* running any cold-start economics benchmark, or the benchmark measures the bug
2. Shared ownership-predicate fixture + combined-host composition test (#1, #5) — note the test-runner mismatch blocker (node:test+jiti vs vitest) found in the 4th pass must be resolved first
3. Hook-level early-return integration tests for pi-cache-optimizer's DeepSeek exclusion (#5)
4. Fix `/deeppi`'s report command's read-only-looking side effect on `telemetry.latestChurn` (new, Tier 4) before or alongside item 5

**P1 — observability and cost-economics foundations:**
5. Persistent, versioned deep-pi stats file with session + cumulative-daily scope, written via deep-pi's own atomic-write helper, not a copy of pi-cache-optimizer's racier one (#3)
6. Structured report data separated from its text rendering, independent of `ctx.ui` (#2)
7. Honest counterfactual labeling for existing savings numbers, explicitly accounting for cache-write cost (DeepSeek prices it at the miss rate, sharpened in the 4th pass); design (don't yet run) a real crossover benchmark (#4)
8. Fix deep-pi's dropped-cache-write-usage and missing `stopReason` guard, including the sharper zero-usage-flips-usageUnavailable failure mode found in the 4th pass (Tier 3/4)
9. Investigate the unbounded `messageDigests` growth in `before_provider_request` (new, Tier 4) — a real memory/perf concern in a hot path

**P2 — maintainability, once the floor is solid:**
10. Staged, seam-characterized extraction of pi-cache-optimizer's monolith — not before items 1-4 land (#9)
11. Vendored-fork provenance/drift checks (#8)
12. Credential-independent local boundary fixture, closing the disclosed 006/003 credential gap (Tier 3)
13. Fix deep-pi's `benchmark:live` packaging (script is both missing and excluded from the `files` allowlist) before attempting item 7's crossover benchmark on the actual shipped package (new, Tier 4)

No lineage recommends starting with maintainability/refactoring work before the correctness and contract items above — this ordering is a genuine agreement across all four models, not a single model's opinion. One deep-pi TOCTOU claim from the first pass (sol's `f-deeppi-cas-gap`) was downgraded by the 4th lineage's own trace of `atomicWriteFile` — see Tier 2 #7's correction note — and is intentionally not on this list.
