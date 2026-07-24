---
title: "Implementation Summary: Compiled-Routing Deep-Review Remediation"
description: "Fixed all eight confirmed findings from two GPT-5.6 deep reviews of the compiled-routing v4 landing: two routing-parity bugs, a manifest race, an authored-closure drift, a cohort guard, a stale telemetry value, and two doc-honesty gaps. Every fix ships with a regression test and every release invariant was re-verified."
trigger_phrases:
  - "compiled routing remediation"
  - "deep review remediation"
  - "routing parity remediation"
  - "F001 F002 F005 F007 remediation"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/016-review-remediation"
    last_updated_at: "2026-07-22T06:53:44Z"
    last_updated_by: "claude"
    recent_action: "Remediated all 8 confirmed deep-review findings; re-verified every release invariant."
    next_safe_action: "Operator sign-off; merge to v4 remains operator-gated."
    blockers: []
    key_files:
      - ".opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs"
      - ".opencode/bin/lib/compiled-route-manifest.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/cutover-playbook-executor.cjs"
      - ".opencode/bin/compiled-routing-foundation.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-016-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-review-remediation |
| **Completed** | 2026-07-22 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two GPT-5.6 deep reviews (LUNA xhigh and SOL high, ten non-converging iterations each) audited the compiled-routing v4 landing and both returned CONDITIONAL with zero P0s. This packet fixes every confirmed finding: four P1 code defects, two P2 test and telemetry gaps, and two documentation-honesty gaps. Each code fix landed test-first, and the release invariants held throughout.

### F005: sk-doc `preview` over-route (P1)

The compiled sk-doc matcher substring-matched the bare keyword `review`, so `preview the latest changes` routed to `create-quality-control` while legacy word-boundary-defers. `containsSignal` now word-boundary-matches the same `{review, lcp, inp, cls}` set the frozen legacy replay uses (`router-replay.cjs`), in both the runtime and spec-tree router copies. `preview…` now defers; a real `review` prompt and `/doc:quality` still route. A `preview-not-review` canary case guards it in both fixtures.

### F002: cutover gate false-passes a terminal disagreement (P1)

The cutover parity gate treated any non-route compiled action as "defer to legacy, therefore PASS." A compiled `clarify` or `reject` that disagreed with a legacy route slipped through. The gate now short-circuits only on a genuine `defer`; `clarify` and `reject` are compared against legacy and drift when they disagree. New cutover cases cover clarify-vs-route and reject-vs-route (both FAIL) plus clarify-vs-empty (PASS).

### F001: manifest refresh reverts a concurrent serving flip (P1)

`refreshCanonicalManifest` read the serving state, ran a slow recompile, then wrote back the stale serving value, silently reverting a concurrent legacy-to-compiled flip. Refresh now re-reads the serving fields after the compile (failing closed if the manifest vanished or corrupted) and publishes atomically via a temp file plus rename. A deterministic mid-refresh-flip regression proves the flip survives.

### F007: authored closure diverged from the promoted engine (P1)

The v4 merge refreshed the authored manifests to the promoted (bin) hashes but left the authored engine code stale, so four hubs' authored compiler produced a hash that no longer bound to its own manifest. Reconciled the twelve divergent engine files from the promoted bin twins into the authored spec-tree, restoring a byte-faithful mirror so a future promote stays idempotent. `--check` and `--verify` now resolve all seven hubs with zero reads under `.opencode/specs`.

### DOC-3 and F006: cohort guard and stale telemetry (P2)

Strengthened the default-on cohort drift-guard to span all four copies (runtime resolver, spec-tree twin, advisor source, advisor dist) with order-identity within each family and membership-identity across families, since the two families order the set differently by design. Fixed `classifyFlagState` so its `permitsCompiledWhenEligible` telemetry reflects the post-cutover reality (an unset flag permits compiled for eligible hubs), a report-only value no runtime gate consumes.

### DOC-1 and DOC-2: packet honesty (P1 and P2)

Reconciled the sibling 013 packet's lifecycle metadata (three docs carried a stale `planned` status while the work had shipped and served) and marked its stale SD-015 "no test yet" limitation resolved, citing the positive and adversarial lock-in tests that already exist. Genuinely-deferred rows (a LUNA acceptance sweep, a parent-doc sync, a P2 diagram check) stay recorded as follow-ups, and the operator sign-off is surfaced rather than granted.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `007-sk-doc/lib/router.cjs` (bin + spec-tree) | Modified | F005 word-boundary matcher |
| `007-sk-doc/fixtures/canary-cases.v1.json` (bin + spec-tree) | Modified | F005 `preview-not-review` canary |
| `cutover-playbook-executor.cjs` | Modified | F002 fallback only on defer |
| `tests/compiled-routing-cutover-luna.test.cjs` | Modified | F002 clarify/reject cases |
| `compiled-route-manifest.cjs` | Modified | F001 re-read serving + atomic write |
| `bin/tests/compiled-route-manifest.test.cjs` | Modified | F001 concurrent-refresh regression |
| 12 authored engine files under `006-parent-hub-rollout` + `011-runtime-engine` | Modified | F007 reconcile to bin twins |
| `compiled-routing-foundation.vitest.ts` | Modified | DOC-3 four-copy cohort guard |
| `compiled-routing-parity.cjs` + `tests/compiled-routing-parity.vitest.ts` | Modified | F006 telemetry + locking test |
| `013-compiled-coverage-buildout/{plan,tasks,decision-record,checklist,implementation-summary}.md` | Modified | DOC-1 and DOC-2 reconciliation |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each code fix ran test-first: a failing regression proved the defect (compiled routes `preview`; the cutover gate PASSes a clarify; the refresh reverts a flip), then the fix turned it green. Every fix was checked against the release invariants before moving on. The three frozen scorer SHA-256 digests never changed, compiled routing stayed byte-identical to legacy (parity 49/49), all seven hubs stayed compiled-serving and fresh, the kill-switch still fell back to legacy fleet-wide, and no runtime path read under `.opencode/specs`. The full bin vitest suite (8 files, 64 tests) and the manifest suite (17/17) are green. Merge to v4 remains operator-gated.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mirror legacy's exact `WORD_BOUNDARY_KEYWORDS` set rather than invent a matcher | The invariant is compiled equals legacy; reusing legacy's own rule guarantees parity and never changes what legacy routes |
| Reconcile F007 bin into authored, not authored into bin | The promoted bin engine is the runtime-serving, parity-verified source of truth; the merge left the authored copy stale, so bin is correct |
| Scope F005 to sk-doc only | The finding and its parity evidence are sk-doc-specific; other hubs share the latent pattern but are out of this remediation's scope (surfaced in Known Limitations) |
| Keep CHK-025, CHK-041, CHK-103 unchecked in 013 | They are genuine follow-ups (a LUNA acceptance sweep, a parent-doc sync, a P2 diagram check) my fixes do not complete; honesty over a clean tally |
| Leave the operator sign-off ungranted | Formal sign-off is the operator's act; this pass surfaces the reconciled state only |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Frozen scorer SHA-256 | PASS, byte-identical (`d5e13daf / d5a9cc72 / 5029f22d`) |
| Parity (compiled equals legacy) | PASS, 49/49, 0 drift, all 7 hubs |
| `compiled-route-status.cjs --all` | PASS, 7/7 compiled-serving and fresh |
| Kill-switch `SPECKIT_COMPILED_ROUTING=0` | PASS, 7/7 fall back to legacy |
| `compiled-route-sync.cjs --check` and `--verify` | PASS, all 7 resolve; 0 reads under `.opencode/specs` |
| Manifest suite | PASS, 17/17 (includes the new F001 regression) |
| Cutover and LUNA test | PASS (includes the new F002 cases) |
| Bin vitest suite (`vitest.config.bin.ts`) | PASS, 8 files / 64 tests |
| `validate.sh --strict` (this packet) | PASS, Errors:0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **F005 is scoped to sk-doc, and that scope is verified sufficient.** The `.includes()` versus word-boundary pattern exists in every hub's generated router, but a direct check against the frozen legacy oracle (`routeSkillResources`) shows it produces no parity divergence anywhere else. `lcp`, `inp`, and `cls` are keywords in no hub, and `review` is a keyword only in sk-code and sk-doc. sk-doc is fixed; sk-code already defers on substring-only `review` probes (its single-keyword match never crosses the route threshold), matching legacy. Only sk-doc's config gave a lone `review` match enough weight to tip the action, which is why it was the one real divergence. No fleet-wide expansion is warranted.
2. **Merge to v4 is operator-gated.** All work sits on branch `sk-doc/0089-default-routing-cutover`; no merge has occurred.
<!-- /ANCHOR:limitations -->
