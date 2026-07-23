---
title: "Implementation Summary: Compiled-Routing Coverage Build-Out & Genuine Default-On"
description: "COMPLETE. All 7 hubs (sk-code, sk-design, sk-doc, sk-prompt, mcp-tooling, system-deep-loop, cli-external-orchestration) are compiled-serving with 0 route-gold drift each, and DEFAULT_ON_HUBS lists all 7 in both resolver copies as of commit 7dfffa0c93. Delivered across 6 commits: sk-code routing recipe + manifest refresh (f19ee17179), parity-harness correctness fixes (e56361ee53), sk-design/system-deep-loop/mcp-tooling coverage (f9f639674b), sk-doc under-routing fixes (b03b1dd882), a non-route/surface-layer parity refinement (6ba5f2957f), and the default-on flip (7dfffa0c93). Frozen scorer trio byte-identical throughout; 258/258 skill-benchmark vitest green."
trigger_phrases:
  - "compiled routing coverage build-out complete"
  - "all 7 hubs compiled-serving default-on"
  - "manifest refresh implementation summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout"
    last_updated_at: "2026-07-21T12:57:09Z"
    last_updated_by: "claude"
    recent_action: "Refreshed graph-metadata.json; reconciled spec.md Status to Complete"
    next_safe_action: "None required; open items are tracked follow-ups, not blockers"
    blockers:
      - "None — all 6 phases shipped; remaining items are follow-ups, not blockers"
    key_files:
      - ".opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs"
      - ".opencode/bin/lib/compiled-route-manifest.cjs"
      - "handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "013-manifest-refresh-mechanism"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "None blocking — advisor-side compiledRoute enrichment cohort and the LUNA-HIGH full sweep are tracked follow-ups"
    answered_questions:
      - "Phase 3's open question (a new refresh verb vs. hand-regeneration) is settled: a refresh verb was built."
      - "Did the sk-doc/system-deep-loop refresh blocker get fixed? Yes — both SKILL.md files gained UNKNOWN_FALLBACK_CHECKLIST arrays; both manifests are now fresh."
      - "Fleet-wide unset=on or per-hub cohort staging? Per-hub cohort staging; DEFAULT_ON_HUBS now lists all 7 (7dfffa0c93)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->
# Implementation Summary: Compiled-Routing Coverage Build-Out & Genuine Default-On

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | COMPLETE. All 6 planned phases shipped: sk-code pilot (Phase 1), replicate via harness fix (Phase 2), fix sk-design TV-003 + re-mint sk-doc/system-deep-loop (Phase 3), build sk-doc/system-deep-loop coverage (Phase 4), staged default-on flip (Phase 5), fleet verification (Phase 6). |
| **Date** | 2026-07-21 |
| **Level** | 3 (upgraded from this doc's earlier Level 2 "Phase 3 slice" framing to match the packet's actual scope — decision-record.md and this full-packet completion both require Level 3) |
| **Implementation** | 6 commits: `f19ee17179`, `e56361ee53`, `f9f639674b`, `b03b1dd882`, `6ba5f2957f`, `7dfffa0c93` |
| **Position in packet** | This is now the packet-wide completion summary, superseding its earlier "Manifest Refresh Path (Phase 3 slice)" scope. That original content is preserved below under "The manifest-refresh mechanism (Phase 3)" — it is still accurate and is the mechanism that eventually unblocked `sk-doc`/`system-deep-loop`. |
| **Routing impact** | All 7 hubs now serve compiled routes by default. `DEFAULT_ON_HUBS` (authored + promoted, byte-identical) lists `sk-code`, `sk-design`, `sk-doc`, `sk-prompt`, `mcp-tooling`, `system-deep-loop`, `cli-external-orchestration`. `SPECKIT_COMPILED_ROUTING=0` remains the fleet-wide kill-switch; per-hub cohort removal restores legacy byte-for-byte. Non-hub skills (e.g. `sk-git`) carry no compiled-routing directive and stay legacy-only. |
| **Strict validation** | This packet's `checklist.md` and `handover.md` are reconciled alongside this summary in the same pass. `spec.md`/`plan.md`/`decision-record.md`/`tasks.md` were authored by an earlier concurrent pass and are not touched by this reconciliation. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:exec-summary -->
## Executive Summary

This packet built genuine compiled-routing coverage for all 7 hubs and completed the fleet-wide default-on flip — the outcome `011-activation-cutover-p4`'s own cutover attempt was blocked on. The work landed in six commits:

1. **`f19ee17179`** — the `sk-code` routing recipe (the reference fix for under-routing) plus the `compiled-route-manifest.cjs refresh` verb (see "The manifest-refresh mechanism" below) plus this packet's own `spec.md`/`plan.md`.
2. **`e56361ee53`** — three parity-harness classification bugs fixed: a `selectionKind` label bug (`surfaceBundle` misclassified for ties), a both-fail-gold conflation (match required gold-achievability instead of pure behavioral parity), and a resource-projection namespace/granularity mismatch. Fixing the harness alone — no routing change — unblocked `sk-code`, `sk-prompt`, and `cli-external-orchestration` to `compiled-serving`.
3. **`f9f639674b`** — real coverage build-out (routing fixes, not just harness fixes) for `sk-design`, `system-deep-loop`, and `mcp-tooling`.
4. **`b03b1dd882`** — `sk-doc` under-routing fixes, moving it from 27 matches / 5 drifts to 31/1.
5. **`6ba5f2957f`** — a fourth parity refinement (SD-015): matched non-route decisions are exempted from the gold requirement, closing the remaining drift.
6. **`7dfffa0c93`** — the default-on flip itself: `DEFAULT_ON_HUBS` populated with all 7 hubs in both resolver copies; 7 `SKILL.md` directives, both create-skill parent templates, and 7 feature-catalog leaves rewritten to default-on + `=0` kill-switch wording; all 7 activation manifests re-minted to their current shadow-child snapshot hash.

**Result, confirmed live during this reconciliation pass** (not merely cited from commit messages): all 7 hubs report `servingAuthority: compiled`, `causeCode: compiled-serving`, `manifestFreshness.fresh: true` via `compiled-route-status.cjs`; the authored and promoted `resolve.cjs` copies are byte-identical; the three frozen scorer files match their pinned SHA-256 digests exactly; the 18-file skill-benchmark Vitest suite passes 258/258; and a live re-run of the compiled-routing-parity benchmark for two hubs reproduced the packet's recorded numbers exactly (`sk-doc` 32/0, `sk-prompt` 5/0). The remaining five hubs' figures (sk-code 23, sk-design 38, mcp-tooling 14, system-deep-loop 21, cli-ext 8, 0 drift each) are cited from `7dfffa0c93`'s commit message and corroborated by the live cross-hub assertion inside `compiled-routing-parity.vitest.ts` ("every live hub manifest reads servingAuthority: compiled"), which is part of the passing suite.

No routing decision changed for any prompt already covered by legacy; no non-hub skill was added to `DEFAULT_ON_HUBS`; the frozen scorer trio was never opened for write.
<!-- /ANCHOR:exec-summary -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### 1. The manifest-refresh mechanism (Phase 3 — the packet's first slice, preserved from the original authoring session)

| File | Delivered behavior |
|------|--------------------|
| `.opencode/bin/lib/compiled-route-manifest.cjs` | New `refreshCanonicalManifest({hubId, skillRoot})`: reads the existing manifest, refuses closed if it's missing/unsafe/structurally invalid, recompiles the hub's *current* authored inputs at `existingGeneration + 1` via the existing `compileCanonicalParent`, and overwrites `selectedPolicy` only — `servingAuthority`/`shadowOnly` are copied verbatim from the manifest being replaced, never hardcoded. `resultRecord()` gained an optional `refreshed` boolean mirroring the existing `created` boolean. Exported alongside `mintCanonicalManifest`. |
| `.opencode/bin/compiled-route-manifest.cjs` | `refresh` added as a third verb (`<mint\|refresh\|freshness>`), same `--hub`/`--skill-root`/`--pretty` contract, same JSON-record-then-exit-code shape as the other two verbs. |
| `.opencode/bin/tests/compiled-route-manifest.test.cjs` | Three new tests using dedicated per-test hub fixtures (never `PRIMARY_HUB`, to avoid perturbing the existing suite's sequential-ordering invariants): (1) stale-to-fresh through the CLI, asserting generation bump, hash change, and `servingAuthority: 'legacy'`/`shadowOnly: true` preserved from a real mint; (2) unsafe hubId (5 identities) and a never-minted hub both refused with zero bytes written, exercised both via direct lib call and the CLI; (3) a hand-written manifest with a **non-default** `shadowOnly: false` refreshed successfully with that value still `false` afterward — proof the preservation is a genuine read-and-copy, not a hardcoded mint-style default. |

**Full suite result at the time**: `node --test .opencode/bin/tests/compiled-route-manifest.test.cjs` → 16/16 pass (13 pre-existing unchanged + 3 new).

Applying `refresh` to the two real stale hubs (`sk-doc` generation 5, `system-deep-loop` generation 3) at first surfaced a genuine defect outside this mechanism: `compileRegistry()` (`.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs`, `extractFallbackChecklist`) requires a literal `UNKNOWN_FALLBACK_CHECKLIST = [...]` array (>=3 items) in the hub's `SKILL.md`, matched by regex. Neither `sk-doc/SKILL.md` nor `system-deep-loop/SKILL.md` contained that literal array at the time — both only had prose mentioning "UNKNOWN_FALLBACK" — so `compileRegistry` threw `FALLBACK_CHECKLIST_MISSING`. Both refresh attempts correctly returned `causeCode: 'compile-error'`, `refreshed: false`, and left both manifests byte-identical to their pre-attempt state — fail-closed, exactly as designed.

**Resolution (confirmed during this reconciliation pass):** both `sk-doc/SKILL.md` and `system-deep-loop/SKILL.md` now contain a literal `UNKNOWN_FALLBACK_CHECKLIST = [...]` array (`sk-doc/SKILL.md:67`, `system-deep-loop/SKILL.md:59`), landing as part of the fleet lockstep-docs work in later commits. Both manifests are now `manifestFreshness.fresh: true` (re-confirmed live via `compiled-route-status.cjs`), and both hubs are `compiled-serving` (`sk-doc` 32/0, `system-deep-loop` 21/0).

### 2. Parity-harness correctness fixes (`e56361ee53`)

`compiled-routing-parity.cjs` had three classification bugs that made every hub read `legacy-fallback-drifted` regardless of real routing behavior — this is the root cause `011-activation-cutover-p4`'s own cutover attempt hit:

1. `selectionKindForTargets` now returns `surfaceBundle` only for exactly-1-actor ties (was over-firing on other tie shapes).
2. `match` is now `firstDifference === null && compiledGoldPass === legacyGoldPass` — parity means identical behavior, decoupled from whether either side happens to achieve gold. The prior logic effectively required both sides to pass gold to count as a match, which is a stronger and wrong condition.
3. The compiled resource projection is now packet-qualified and narrowed to legacy's granularity, fixing a namespace/granularity mismatch that manufactured false drift.

A real misroute (different targets) and a compiled-only leaf gap both still classify `drift` after these fixes — proven by a permanent vitest suite (part of the 258 passing tests), so the fix is adversarially sound, not a loosened gate.

### 3. Per-hub coverage build-out (`f9f639674b`, `b03b1dd882`, `6ba5f2957f`)

The compiled shadow-child router (`.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/00N-<hub>/lib/{router,canary-router}.cjs` + `registry-compiler.cjs`) had to be brought up to the same scoring/selection behavior as the frozen legacy replay (`router-replay.cjs`): weighted keyword match over the hub's own `hub-router.json` vocabulary, ambiguity-delta near-tie retention, always-route on near-tied sets, correct bundle rules. `sk-design` (`006-sk-design/lib/router.cjs`) was the reference implementation this was patterned on. `sk-design`, `system-deep-loop`, and `mcp-tooling` were brought to `compiled-serving` in `f9f639674b`; `sk-doc` moved from 27/5 to 31/1 in `b03b1dd882`. A fourth harness refinement (SD-015, `6ba5f2957f`) — exempting matched non-route decisions from the gold requirement — closed the remaining drift fleet-wide.

### 4. The default-on flip (`7dfffa0c93`)

Once all 7 hubs independently cleared parity, this commit populated `DEFAULT_ON_HUBS` with the full 7-hub cohort in both the authored and promoted `resolve.cjs` copies (confirmed byte-identical), rewrote all 7 `SKILL.md` compiled-routing directives to default-on + `SPECKIT_COMPILED_ROUTING=0` kill-switch wording (fallback wording preserved), rewrote both create-skill parent templates and 7 feature-catalog leaves to match, and re-minted all 7 activation manifests to their current shadow-child snapshot hash (a provenance-hash shift only — routing rules derive from `hub-router.json`, never `SKILL.md` prose, so served behavior did not change).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`refreshCanonicalManifest` (Phase 3's first slice) reuses every safety helper `mintCanonicalManifest` already established in `012-p3-canonical-minter-foundation` (`canonicalManifestPath`, `readManifestBytes`/`safeManifestLocationExists`, `validateCanonicalManifestBytes`, `compileCanonicalParent`, `contractError`) — no new safety surface was introduced. The only structural difference from mint: it reads the CURRENT on-disk manifest first (mint requires absence), takes `servingAuthority`/`shadowOnly` from that read rather than from literals, and writes with a plain overwrite instead of mint's atomic `wx`-flag create-if-absent. Compilation happens entirely in memory before the single `fs.writeFileSync`, so every failure path returns before any byte is written.

The rest of the packet followed the diagnose-fix-verify loop the manifest-refresh discovery kicked off: the `sk-doc`/`system-deep-loop` refresh failure proved the parity signal could be wrong for reasons having nothing to do with routing, which motivated auditing the harness itself rather than only the routers. That audit found the three classification bugs fixed in `e56361ee53` — fixing them alone (no routing change) immediately unblocked `sk-prompt` and `cli-external-orchestration`, confirming the harness, not the routing, had been the problem for those hubs. The remaining hubs (`sk-design`, `sk-doc`, `system-deep-loop`, `mcp-tooling`) still drifted after the harness fix, confirming they had genuinely thin compiled coverage that needed real routing work — delivered per-hub across `f9f639674b` and `b03b1dd882`, using `sk-design`'s already-production router as the reference pattern. A fourth harness refinement (`6ba5f2957f`) closed the last gap. Once every hub's own parity run independently reported `compiled-serving`, the flip (`7dfffa0c93`) was executed as a single reconciling commit — populating the cohort and rewriting the lockstep documentation surfaces together — rather than as a live run of `011`'s staged, one-hub-at-a-time controller (which stayed dry-run-only throughout; see `011-activation-cutover-p4/implementation-summary.md` for that packet's own record, now reconciled to reflect this outcome).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:arch-decisions -->
## Architecture Decisions Summary

Full context, alternatives, and consequences are authoritative in `decision-record.md` (ADR-001: build full compiled-routing coverage — Path 1 — rather than a byte-identical-via-legacy-fallback shortcut — Path 2 — or holding — Path 3).

| Decision | Status | Effect |
|----------|--------|--------|
| ADR-001: Build full compiled-routing coverage (Path 1), not byte-identical-via-fallback | Accepted; shipped | All 7 hubs genuinely reach `compiled-serving` rather than being declared done via a legacy-fallback shortcut |
| Preserve `servingAuthority`/`shadowOnly` in `refresh` by reading, never hardcoding | Accepted; shipped, proven against 2 real broken hubs | Refresh can never silently flip serving configuration either direction |
| Treat the real Lane C sub-verdict, not harness presence, as parity authority | Accepted; shipped | Directly inherited from `011`'s own decision record; validated when fixing the harness alone unblocked 3 hubs |
| Flip via a single reconciling commit once all hubs independently clear parity, not a live staged loop | Accepted; shipped (`7dfffa0c93`) | Deviates from `011`'s planned one-hub-at-a-time persister — recorded honestly in both packets' docs, not implied |
<!-- /ANCHOR:arch-decisions -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Preserve `servingAuthority`/`shadowOnly` by reading the existing manifest, never by hardcoding `'legacy'`/`true` | Both hubs' real on-disk manifests already carried `servingAuthority: compiled`, `shadowOnly: false` (written by `011`'s per-hub staging). Preserving verbatim is the only behavior that cannot silently flip serving configuration either direction. |
| Plain overwrite (`fs.writeFileSync`, no `wx` flag) instead of mint's atomic create-if-absent | Refresh's contract is "the file already exists and I am replacing its content," a different guarantee than mint's "only I may create this file." Matches the codebase's existing convention (checked across all 7 hub rollout dirs). |
| Compile fully in memory before the single write | Guarantees no partial/corrupt manifest is ever written on a `compile-error` path. Proven in production against the two real broken hubs, not just synthetic fixtures. |
| Fix the parity harness before assuming routing is broken | The `sk-doc`/`system-deep-loop` refresh block revealed a defect (`UNKNOWN_FALLBACK_CHECKLIST`) unrelated to routing; the same instinct — check the measuring instrument, not only the thing being measured — found the three harness classification bugs that had been misclassifying `sk-prompt` and `cli-external-orchestration` as drifted when they were not. |
| Use `sk-design`'s production router as the reference pattern for coverage build-out | Avoided re-deriving scoring/selection semantics per hub; `sk-design`'s router already matched the frozen legacy replay's behavior in production. |
| Flip default-on via a single commit once every hub independently verified, not a live staged run of `011`'s controller | `011`'s controller remained dry-run-only; re-running its staged loop for real would have re-executed work already independently proven per-hub. The single-commit flip achieves the same lockstep guarantee (cohort + directives + catalogs + templates move together) with less risk of a mid-sequence inconsistent state. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Evidence | Result |
|----------|--------|
| Baseline hub status (Phase 3 start) | `compiled-route-status.cjs --hub sk-doc` / `--hub system-deep-loop` before any change: both `manifestFreshness.causeCode: 'stale-manifest'`; `sk-doc` generation 5, `system-deep-loop` generation 3; both `servingAuthority: 'compiled'`, `shadowOnly: false` on disk already (pre-existing from `011`'s staging, not written by this packet). |
| Manifest-refresh unit tests | `node --test .opencode/bin/tests/compiled-route-manifest.test.cjs` → 16/16 passed (13 pre-existing + 3 new), 0 failures. |
| Parity-harness fix regression suite | `compiled-routing-parity.vitest.ts` — permanent vitest asserting a real misroute and a compiled-only leaf gap both still classify `drift` after the fix (not a loosened gate); part of the 258/258-passing suite. |
| Route-gold parity, all 7 hubs — CURRENT (re-confirmed live during this reconciliation pass) | All 7 report `compiled-serving`, 0 drift: sk-code 23, sk-design 38, sk-doc 32, sk-prompt 5, mcp-tooling 14, system-deep-loop 21, cli-ext 8. `sk-doc` and `sk-prompt` directly re-run live (32/0 and 5/0, exact match); remaining five cited from `7dfffa0c93`'s commit message and the live cross-hub vitest assertion. |
| `compiled-route-status.cjs`, all 7 hubs — CURRENT | Every hub reports `servingAuthority: compiled`, `causeCode: compiled-serving`, `manifestFreshness.fresh: true` (re-run live during this reconciliation pass). |
| `DEFAULT_ON_HUBS`, both resolver copies — CURRENT | `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs` and its authored twin under `.../007-unified-refactor-implementation/011-runtime-engine/lib/resolve.cjs` both list all 7 hubs; `diff` confirms byte-identical. |
| Hub `SKILL.md` directive wording, all 7 — CURRENT | Each carries `Compiled routing is now the default for <hub>; set SPECKIT_COMPILED_ROUTING=0 to force legacy routing fleet-wide — the explicit kill-switch.` (spot-checked live across all 7). |
| Create-skill parent templates — CURRENT | `parent-skill-hub-template.md` and `scaffold/hub-skill-scaffold.md` both list all 7 hubs by name plus the `=0` kill-switch, with an inert-until-activated clause for newly scaffolded hubs. |
| Non-hub exclusion — CURRENT | `sk-git/SKILL.md` carries zero occurrences of a compiled-routing directive; stays legacy-only. |
| Frozen scorer files | Unchanged throughout — confirmed via SHA-256 at Phase 3 start, in each report's embedded `compiledRouting.frozenHashes.{before,after}`, and via a direct re-hash during this reconciliation pass; all three match the pins in every check. |
| Full skill-benchmark Vitest suite — CURRENT | `npx vitest run` in `.opencode/skills/system-deep-loop/deep-improvement/scripts` → **18 files / 258 tests, all passing** (re-run live during this reconciliation pass; grew from 247 across the packet's commits as new lock-in tests were added). |
| Global serving guardrails | `DEFAULT_ON_HUBS` (current) = the 7 compiled-eligible hubs, confirmed both copies; no non-hub skill present; `git log` shows the 6 commits above as the only ones touching compiled-routing surfaces since `f19ee17179^`. |

### Frozen scorer SHA-256 (pinned, re-confirmed unchanged during this reconciliation pass)

| File | SHA-256 |
|------|---------|
| `router-replay.cjs` | `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47` |
| `score-skill-benchmark.cjs` | `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c` |
| `load-playbook-scenarios.cjs` | `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029` |

### Sign-off

Claude reconciliation pass on 2026-07-21 directly re-confirms, rather than merely re-citing, the packet's central claims: all 7 hubs `compiled-serving` and `fresh` (live probe), both resolver copies byte-identical (live diff), frozen scorer digests byte-identical to the pins (live re-hash), and the full 258/258 skill-benchmark suite green (live run). Two hubs' route-gold parity (`sk-doc`, `sk-prompt`) were independently re-run live and matched the packet's recorded figures exactly; the remaining five are cited from the commit trail and corroborated by a live cross-hub vitest assertion covering all 7. This packet is COMPLETE for its own stated scope (coverage build-out + genuine default-on); remaining items are tracked follow-ups (see below), not blockers.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:milestones -->
## Milestone Status

| Milestone | Status | Evidence |
|-----------|--------|----------|
| Phase 1: sk-code pilot build-out | COMPLETE | `f19ee17179`; `sk-code` reached `compiled-serving` (23/0) via `e56361ee53`'s harness fix |
| Phase 2: replicate to cli-external-orchestration, mcp-tooling, sk-prompt | COMPLETE | `sk-prompt` and `cli-external-orchestration` unblocked by the harness fix alone (`e56361ee53`); `mcp-tooling` needed real coverage work, delivered in `f9f639674b` |
| Phase 3: fix sk-design TV-003 + re-mint sk-doc/system-deep-loop | COMPLETE | TV-003 fixed as part of `sk-design`'s coverage build-out (`f9f639674b`); manifest-refresh mechanism built (`f19ee17179`), blocked on missing `UNKNOWN_FALLBACK_CHECKLIST` arrays, later resolved (confirmed live: both `SKILL.md` files now carry the array, both manifests `fresh: true`) |
| Phase 4: build sk-doc and system-deep-loop coverage | COMPLETE | `sk-doc` 27/5 → 31/1 (`b03b1dd882`) → 32/0 after SD-015 (`6ba5f2957f`); `system-deep-loop` reached 21/0 in `f9f639674b` |
| Phase 5: staged default-on flip | COMPLETE | `7dfffa0c93` — `DEFAULT_ON_HUBS` populated with all 7 hubs, both resolver copies, confirmed byte-identical |
| Phase 6: fleet verification | COMPLETE | All 7 hubs `compiled-serving` + `fresh`; 3 frozen scorer SHA-256 unchanged; 258/258 vitest; kill-switch and per-hub reversibility drilled (see `checklist.md`) |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. ~~The advisor-side compiled-routing enrichment cohort is still empty.~~ **RESOLVED (follow-up dispatch, 2026-07-21, same worktree).** Investigation found the "dropped downstream" risk this limitation was hedging against no longer held: `mk-skill-advisor-bridge.mjs` already derives a `compiledRouteSummary` from the attached `compiledRoute` and threads it into `buildNativeBrief`'s metadata, `.opencode/plugins/mk-skill-advisor.js` already renders it into the injected system-context line, and `SPECKIT_COMPILED_ROUTING` is already present in both `CHILD_ENV_ALLOWLIST` sets (bridge + launcher) — all proven by the dedicated, already-green `tests/compiled-routing-consumption.vitest.ts` (12/12 passing). The enrichment's subprocess target (`.opencode/bin/compiled-route.cjs`) is a thin delegate to the exact same `011-runtime-engine/lib/resolve.cjs` the main resolver uses, so surfacing it is additive metadata only — no routing decision changes. `DEFAULT_ON_HUBS` in `compiled-routing-flag.ts` (+ its `dist/` mirror) was populated with the same 7 hubs, mirroring the main resolver's cohort exactly (verified equal by a strengthened assertion in `.opencode/bin/compiled-routing-foundation.vitest.ts`). Advisor test suite green; runtime resolver's own `DEFAULT_ON_HUBS` untouched (still exactly 7); frozen scorer SHA-256 unchanged.
2. ~~No dedicated vitest lock-in test yet for the SD-015 non-route/surface-layer exemption clause.~~ **RESOLVED.** Dedicated lock-in tests exist in `compiled-routing-parity.vitest.ts`: a positive case — `'SD-015 clause: a matched non-route decision is parity even when a surface-layer resource gold disagrees'` (pins the fix commit `6ba5f2957f`) — and its adversarial twin — `'adversarial: the SD-015 exemption does not leak to a served route with a real compiled resource gap'` (proves the exemption is scoped to non-route decisions and never leaks to a served route). Both green in the parity suite.
3. **LUNA-HIGH acceptance-plane runs are archived for 2 of 7 hubs.** `luna-high-acceptance-*` directories exist under `sk-code` and `sk-doc`'s `benchmark/compiled-routing/` only (confirmed live); all 7 hubs have `luna-high-real-*` and `luna-high-verify-*` runs. The full 7-hub LUNA-HIGH acceptance sweep is a separate, in-flight effort per the operator.
4. **`011-activation-cutover-p4`'s own controller and verification harness never executed a real persist.** They remain exactly the dry-run provers they were built as; the real flip in `7dfffa0c93` was hand-implemented directly rather than run through that controller. `011`'s docs are reconciled (in this same pass) to record this honestly rather than implying its own mechanism executed.
5. **This worktree is not yet merged to v4.** Per the operator's explicit gate, merge remains a separate, operator-authorized step.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- [x] Wire the advisor-side `compiled-routing-flag.ts` `DEFAULT_ON_HUBS` cohort to mirror the main runtime resolver's, so advisor recommend enrichment also reflects the flip. — DONE (2026-07-21, follow-up dispatch): populated with the same 7 hubs (+ `dist/` mirror regenerated); consumer path proven live (bridge → `compiledRouteSummary` → plugin system-context line); `.opencode/bin/compiled-routing-foundation.vitest.ts` and `tests/compiled-routing-consumption.vitest.ts` green.
- [x] Add a dedicated vitest lock-in test for the SD-015 non-route/surface-layer gold-exemption clause in `compiled-routing-parity.vitest.ts`. — DONE: positive + adversarial lock-in tests exist and pass (`'SD-015 clause: …'` and `'adversarial: the SD-015 exemption does not leak …'`).
- [ ] Extend the LUNA-HIGH acceptance sweep from 2/7 hubs (`sk-code`, `sk-doc`) to the full 7-hub sweep (tracked as a separate, in-flight effort).
- [ ] Merge this worktree branch to v4 — operator-gated, not started.
- [x] Add `UNKNOWN_FALLBACK_CHECKLIST = [...]` (>=3 items) to `sk-doc/SKILL.md` and `system-deep-loop/SKILL.md` — DONE; confirmed present at `sk-doc/SKILL.md:67` and `system-deep-loop/SKILL.md:59`.
- [x] Re-run `compiled-route-manifest.cjs refresh`/re-mint for both hubs once the SKILL.md fix landed — DONE; both `manifestFreshness.fresh: true`.
- [x] Re-run the compiled-routing-parity benchmark for both hubs post-refresh — DONE; `sk-doc` 32/0, `system-deep-loop` 21/0.
- [x] Feed the real post-refresh coverage numbers into Phase 4 effort estimation — DONE implicitly; Phase 4 shipped using exactly these numbers.
<!-- /ANCHOR:follow-up -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

1. **Scope grew from a single Phase-3 slice (manifest refresh only) to the full 6-phase packet.** This document originally covered only the manifest-refresh mechanism, authored in the same session that discovered the `UNKNOWN_FALLBACK_CHECKLIST` blocker. Subsequent sessions completed Phases 1-2 and 4-6 (documented above); this reconciliation pass rewrites this summary to cover the whole packet rather than leaving five phases undocumented in the canonical implementation-summary while `handover.md` alone carried the full picture.
2. **The default-on flip landed as a single reconciling commit, not a live run of `011`'s staged one-hub-at-a-time controller.** `011`'s plan called for its own controller to execute the persist per hub, ascending blast-radius order, stop-on-first-failure. Once every hub had independently reached `compiled-serving` across this packet's commits, `7dfffa0c93` moved the cohort and all lockstep documentation together in one commit rather than re-running that live loop. The delivered guarantees (per-hub parity proven, lockstep docs, kill-switch, byte-exact rollback) match `011`'s plan; the execution mechanism does not, and both packets' docs now record that explicitly rather than implying otherwise.
3. **`sk-code` was fixed first, not cut over last.** `011`'s ascending-blast-radius plan put `sk-code` (the `surfaceBundle` hub) last. In practice `sk-code` was the Phase-1 pilot and reached `compiled-serving` in the second commit (`e56361ee53`); the final flip then added all 7 hubs together rather than preserving a distinguishable last-of-sequence step for any one hub.
<!-- /ANCHOR:deviations -->
