---
title: "Implementation Summary: Manifest Refresh Path (Phase 3 slice)"
description: "Implemented-state record for the safe manifest-refresh mechanism (compiled-route-manifest.cjs `refresh` verb) named in plan.md's Phase 3 and Files-to-Change table, plus the resulting attempt to re-mint sk-doc and system-deep-loop and the coverage-reveal benchmark run against both."
trigger_phrases:
  - "manifest refresh implementation summary"
  - "sk-doc system-deep-loop re-mint attempt"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout"
    last_updated_at: "2026-07-21T12:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Built the refresh verb for compiled-route-manifest.cjs; 16/16 tests pass."
    next_safe_action: "Add UNKNOWN_FALLBACK_CHECKLIST arrays to sk-doc/system-deep-loop SKILL.md, then retry refresh."
    blockers:
      - "Refresh blocked: sk-doc/system-deep-loop SKILL.md lack the required UNKNOWN_FALLBACK_CHECKLIST array."
    key_files:
      - ".opencode/bin/lib/compiled-route-manifest.cjs"
      - ".opencode/bin/compiled-route-manifest.cjs"
      - ".opencode/bin/tests/compiled-route-manifest.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "013-manifest-refresh-mechanism"
      parent_session_id: null
    completion_pct: 75
    open_questions:
      - "Should the SKILL.md fallback-checklist fix land as a new phase-3 sub-child, or fold into Phase 4 (sk-doc/system-deep-loop coverage) as its first task?"
    answered_questions:
      - "Phase 3's open question ('a new refresh verb on compiled-route-manifest.cjs, or hand-regeneration verified by the freshness check') is settled: a refresh verb was built, following the mint verb's existing safety-helper pattern exactly."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary: Manifest Refresh Path (Phase 3 slice)

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Partially implemented — see What Was Built vs Known Limitations |
| **Date** | 2026-07-21 |
| **Level** | 2 |
| **Implementation** | New lib function + CLI verb + unit tests; a real re-mint attempt against both target hubs; a real coverage-reveal benchmark run against both target hubs |
| **Position in packet** | Implements the `compiled-route-manifest.cjs` row of `plan.md`'s "FIX ADDENDUM: AFFECTED SURFACES" table and the "Build the safe manifest re-mint path" checkbox of Phase 3. Does **not** implement Phase 3's TV-003 fix, Phase 1/2 (sk-code pilot / replicate), or Phase 4/5/6. |
| **Routing impact** | None. Both manifests are byte-unchanged (refresh failed closed on both). `servingAuthority`/`shadowOnly` were never written, only read. `DEFAULT_ON_HUBS` untouched. |
| **Strict validation** | Not run for this child — see Known Limitations (tasks.md/checklist.md/decision-record.md are pending, owned by the packet's concurrent authoring pass that produced spec.md/plan.md). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

| File | Delivered behavior |
|------|--------------------|
| `.opencode/bin/lib/compiled-route-manifest.cjs` | New `refreshCanonicalManifest({hubId, skillRoot})`: reads the existing manifest, refuses closed if it's missing/unsafe/structurally invalid, recompiles the hub's *current* authored inputs at `existingGeneration + 1` via the existing `compileCanonicalParent`, and overwrites `selectedPolicy` only — `servingAuthority`/`shadowOnly` are copied verbatim from the manifest being replaced, never hardcoded. `resultRecord()` gained an optional `refreshed` boolean mirroring the existing `created` boolean. Exported alongside `mintCanonicalManifest`. |
| `.opencode/bin/compiled-route-manifest.cjs` | `refresh` added as a third verb (`<mint\|refresh\|freshness>`), same `--hub`/`--skill-root`/`--pretty` contract, same JSON-record-then-exit-code shape as the other two verbs. |
| `.opencode/bin/tests/compiled-route-manifest.test.cjs` | Three new tests using dedicated per-test hub fixtures (never `PRIMARY_HUB`, to avoid perturbing the existing suite's sequential-ordering invariants): (1) stale-to-fresh through the CLI, asserting generation bump, hash change, and `servingAuthority: 'legacy'`/`shadowOnly: true` preserved from a real mint; (2) unsafe hubId (5 identities) and a never-minted hub both refused with zero bytes written, exercised both via direct lib call and the CLI; (3) a hand-written manifest with a **non-default** `shadowOnly: false` refreshed successfully with that value still `false` afterward — proof the preservation is a genuine read-and-copy, not a hardcoded mint-style default. |

**Full suite result**: `node --test .opencode/bin/tests/compiled-route-manifest.test.cjs` → 16/16 pass (13 pre-existing unchanged + 3 new).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`refreshCanonicalManifest` reuses every safety helper `mintCanonicalManifest` already established in 012 (`canonicalManifestPath`, `readManifestBytes`/`safeManifestLocationExists`, `validateCanonicalManifestBytes`, `compileCanonicalParent`, `contractError`) — no new safety surface was introduced. The only structural difference from mint: it reads the CURRENT on-disk manifest first (mint requires absence), takes `servingAuthority`/`shadowOnly` from that read rather than from literals, and writes with a plain overwrite instead of mint's atomic `wx`-flag create-if-absent (refresh's contract is "overwrite an existing file," not "win a race to create one"). Compilation happens entirely in memory before the single `fs.writeFileSync`, so every failure path — unsafe hubId, missing manifest, invalid manifest shape, or a `compileCanonicalParent` throw — returns before any byte is written.

Applying `refresh` to the two real stale hubs (`sk-doc` generation 5, `system-deep-loop` generation 3) surfaced a genuine defect outside this mechanism: `compileRegistry()` (`.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:85-93`, `extractFallbackChecklist`) requires a literal `UNKNOWN_FALLBACK_CHECKLIST = [...]` array (>=3 items) in the hub's `SKILL.md`, matched by regex. Neither `sk-doc/SKILL.md` nor `system-deep-loop/SKILL.md` contains that literal array — both only have prose mentioning "UNKNOWN_FALLBACK" — so `compileRegistry` throws `FALLBACK_CHECKLIST_MISSING` at **any** generation, not specifically the next one. This was confirmed by invoking `compileRegistry` directly (bypassing the manifest lib entirely) against both hubs' real current source bytes, and by grepping both `SKILL.md` files against the known-good comparator `sk-code/SKILL.md:70` which does contain the literal array. Because compilation happens before the write, both refresh attempts correctly returned `causeCode: 'compile-error'`, `refreshed: false`, and left both manifests byte-identical to their pre-attempt state (verified via `git status` on the activation directory and a raw byte re-read).

With refresh blocked, the compiled-routing-parity benchmark lane was still run against both hubs (their manifests are unchanged, so this reflects their real current — still-stale — state) to answer the packet's coverage question regardless of the re-mint outcome.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Preserve `servingAuthority`/`shadowOnly` by reading the existing manifest, never by hardcoding `'legacy'`/`true` | The task brief's "(i.e. `'legacy'`/`true`)" was illustrative, not a claim about these hubs' actual state. Both hubs' real on-disk manifests already carry `servingAuthority: 'compiled'`, `shadowOnly: false` (most likely written by `011-activation-cutover-p4`'s per-hub staging). Preserving verbatim is the only behavior that cannot silently flip serving configuration either direction, and matches the task's explicit "must NOT alter" requirement. |
| Plain overwrite (`fs.writeFileSync`, no `wx` flag) instead of mint's atomic create-if-absent | Refresh's contract is "the file already exists and I am replacing its content," which is a different guarantee than mint's "only I may create this file." No other file in the compiled-routing lib uses an atomic-rename overwrite pattern (checked `harness/build-artifacts.cjs` across all 7 hub rollout dirs — all use a plain `writeFileSync`), so this follows the codebase's existing convention rather than introducing a new one. |
| Compile fully in memory before the single write | Matches mint's existing ordering exactly; guarantees no partial/corrupt manifest is ever written on a `compile-error` path. Proven in production against the two real broken hubs, not just synthetic fixtures. |
| Do not attempt to fix the missing `UNKNOWN_FALLBACK_CHECKLIST` arrays | Editing `SKILL.md` changes legacy routing surface — an explicit HARD constraint for this task, and out of this session's assigned scope regardless. Surfacing the confirmed root cause is the correct stopping point. |
| Do not author `tasks.md`/`checklist.md`/`decision-record.md` for the parent packet | `spec.md` and `plan.md` for this same folder were authored minutes before this session started (Level 3, 7-hub program covering far more than this session's task); the remaining Level-3 docs are evidently owned by that same concurrent authoring pass. This summary is scoped to only what this session actually built, to avoid colliding with or prematurely committing that packet's still-open Phase 1/2/4/5/6 planning. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Evidence | Result |
|----------|--------|
| Baseline hub status | `compiled-route-status.cjs --hub sk-doc` / `--hub system-deep-loop` captured before any change: both `manifestFreshness.causeCode: 'stale-manifest'`, `manifestValid: true`; `sk-doc` generation 5, `system-deep-loop` generation 3; both manifests `servingAuthority: 'compiled'`, `shadowOnly: false` on disk (pre-existing, not written by this session). |
| Syntax | `node --check` passed for both edited `.cjs` files. |
| Focused contract matrix | `node --test .opencode/bin/tests/compiled-route-manifest.test.cjs` → 16/16 passed (13 pre-existing + 3 new), 0 failures. |
| Refresh attempt — sk-doc | `node .opencode/bin/compiled-route-manifest.cjs refresh --hub sk-doc --skill-root .opencode/skills/sk-doc` → exit 1, `causeCode: 'compile-error'`, `refreshed: false`, manifest byte-unchanged (confirmed via `git status` on the activation directory and a raw re-read). Root cause confirmed by direct `compileRegistry()` invocation: `error.code === 'FALLBACK_CHECKLIST_MISSING'`. |
| Refresh attempt — system-deep-loop | Same command/result shape as sk-doc: exit 1, `causeCode: 'compile-error'`, `refreshed: false`, byte-unchanged, same confirmed root cause. |
| Post-attempt status re-check | Both hubs re-queried via `compiled-route-status.cjs`: still `causeCode: 'stale-manifest'`, identical generation/hash/fingerprint to the pre-attempt baseline — no accidental partial write occurred. |
| Coverage-reveal benchmark — sk-doc | `SPECKIT_COMPILED_ROUTING=1 node system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs --skill sk-doc --compiled-routing-parity on --route-gold on` → verdict `BLOCKED-BY-COMPILED-DRIFT` (harness exit 3, an expected reported verdict, not a crash). `report.compiledRouting`: `subVerdict: 'legacy-fallback-drifted'`, `scored: 32`, `counts: {match: 0, drift: 32, vacuous: 0, "n/a": 0, "resolver-missing": 0}`, `breakages: []`. All 32 `driftRows` carry `reason: 're-mint-required'` / `statusCauseCode: 'stale-manifest'` — i.e. **100% of drift is the safe "manifest needs a re-mint" kind; 0 rows are an unsafe compiled-routes-to-a-different-target misroute.** |
| Coverage-reveal benchmark — system-deep-loop | Same invocation shape → verdict `BLOCKED-BY-COMPILED-DRIFT` (exit 3). `subVerdict: 'legacy-fallback-drifted'`, `scored: 21`, `counts: {match: 0, drift: 21, vacuous: 0, "n/a": 0, "resolver-missing": 0}`, `breakages: []`. All 21 `driftRows` are `reason: 're-mint-required'` / `statusCauseCode: 'stale-manifest'` — same 100%-safe / 0%-unsafe breakdown as sk-doc. |
| Frozen scorer files | Confirmed unchanged twice: this agent's own `shasum -a 256` before and after all work, AND both benchmark reports' own embedded `compiledRouting.frozenHashes.{before,after}` — identical in all three sources, `unchanged: true` in both reports. |
| Global serving guardrails | `DEFAULT_ON_HUBS` re-confirmed `Set(0) {}` after all work. `git log --oneline -3` shows no new commit was created. `git status` shows exactly the 3 files this session intentionally edited plus this new spec-folder content; no other file (including the 2 known pre-existing strays and anything under `006-parent-hub-rollout/001-sk-code/`) was touched. |

### Frozen scorer SHA-256 equality

| File | Start | End |
|------|-------|-----|
| `router-replay.cjs` | `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47` | `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47` |
| `score-skill-benchmark.cjs` | `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c` | `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c` |
| `load-playbook-scenarios.cjs` | `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029` | `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029` |

### Sign-off

Claude implementation verification on 2026-07-21 confirms the refresh mechanism is built, unit-tested (16/16), and proven fail-closed in production against two genuinely broken real hubs — but confirms neither `sk-doc` nor `system-deep-loop` actually reached `fresh`, and that this is blocked on out-of-scope authored-`SKILL.md` content, not on anything this mechanism could fix. Coverage-reveal data for both hubs was still captured successfully and shows exclusively safe (re-mint-required) drift, zero unsafe misroute, for whenever the blocker is cleared.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Neither target hub reached `fresh`.** `sk-doc` and `system-deep-loop` remain at their original generation/hash (5 and 3 respectively), `manifestFreshness.causeCode: 'stale-manifest'`, unchanged by this session.
2. **Root cause is outside the manifest-refresh mechanism.** Both hubs' authored `SKILL.md` lacks the literal `UNKNOWN_FALLBACK_CHECKLIST = [...]` array the shared compiler requires. This is an authored-content gap, not a hash/generation-drift problem — refresh (or even a from-scratch mint) would fail identically against these inputs today.
3. **Coverage-reveal numbers reflect the still-stale state, not a post-refresh state.** Both hubs' `subVerdict: 'legacy-fallback-drifted'` and 100%-`re-mint-required` drift breakdown describe today's blocked reality; the *actual* compiled-vs-legacy parity for either hub (match/drift/misroute on real routing decisions, Phase 4's real question) remains unmeasured until refresh can succeed.
4. **This session did not touch Phase 1, 2, 5, or 6**, or the TV-003/MT-008 over-detection fixes named elsewhere in Phase 3 — `plan.md`'s broader 7-hub program is unaffected and remains Planned.
5. **`tasks.md`, `checklist.md`, and `decision-record.md` for this packet were not authored by this session** — `spec.md`/`plan.md` were written moments before this session started by what appears to be a concurrent authoring pass; completing the remaining Level-3 docs for the full packet is left to that effort to avoid collision.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- [ ] Add `UNKNOWN_FALLBACK_CHECKLIST = [...]` (>=3 items) to `sk-doc/SKILL.md` and `system-deep-loop/SKILL.md`, modeled on `sk-code/SKILL.md:70`, through its own reviewed change (touches legacy routing surface — needs its own gate).
- [ ] Re-run `compiled-route-manifest.cjs refresh --hub <hub> --skill-root .opencode/skills/<hub>` for both hubs once the SKILL.md fix lands; confirm `manifestFreshness.fresh == true` via `compiled-route-status.cjs`.
- [ ] Re-run the compiled-routing-parity benchmark for both hubs post-refresh to get their *real* coverage numbers (this session's numbers are pre-refresh/still-stale).
- [ ] Feed the real post-refresh coverage numbers into Phase 4 ("Build sk-doc and system-deep-loop Coverage") effort estimation in `plan.md`, which currently notes the gap as "unknown until re-mint reveals it."
<!-- /ANCHOR:follow-up -->
