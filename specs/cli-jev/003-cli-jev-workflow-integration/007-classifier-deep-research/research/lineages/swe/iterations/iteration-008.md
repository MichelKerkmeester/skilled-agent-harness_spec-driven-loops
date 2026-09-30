---
title: "Iteration 8: The two-backend probe — shared or duplicated"
trigger_phrases: []
---
# Iteration 8: The two-backend probe — shared or duplicated

**Angle:** swe-08 · **Lens:** code-level slice design · **Maps to:** A, G

## Sibling check (W3)

- `deepseek/iterations/iteration-001.md` (named): owns the Deem half of the gate — `/health` is a free dict read (`deem_server.py:845-846`, `:772-777`); stub servers pass `status` alone and are refused only on `backend` (`:145`, `:972-977`); the model id is unpinned server-side (`DEFAULT_MODEL_ID="deem-1.5"`, `:107`,`:929-931`) so the pass condition needs `model=="deem-0.8-v1"`; no auth + CORS `*` (`:809-811`); loading server == connection refused (port binds after weights load, `:1000-1005`); probe budgets — offline 2,000 ms, hook 500 ms (their N-deepseek-01-2); **F11: no Deem check exists anywhere in `.skilled/` today**.
- `deepseek/iterations/iteration-004.md` steer correction (carried): the `backend` check is an **allowlist** — `torch` or `ensemble:*` sans `stub`, matching `deem-ctl`'s own rule (`deem-ctl:59-66`).
- glm-002, deepseek-007, grok-010, mimo-001: already folded into swe-07.

## Actions Taken

- `002-advisor-jev-tiebreak-arm/spec.md` — REQ-002's gate verbatim (three checks in order, once per run, exact skip lines), REQ-003 (no key ever handled), REQ-009 (per-call record), REQ-010 (exit-code table), REQ-011 (payload-class print), `:97-98` ("This script is the only caller and `--jev` is its own switch" — the shared helper is *forbidden inside* 002), `:143` (Gate-3 calibration rides the same gate), `:147` (live-confirmed `auth status` exit behavior)
- `003-goal-verifier-jev-shadow/spec.md:44-61` — census → zero-call arms → Jev arm only past REQ-014's gate; Jev arm waits on 002's latency record + redaction cases
- `006-goal-criteria-lint/spec.md:139-166` — REQ-012 carries the **identical three-check gate verbatim**, stop line `r20 jev arm not built: labeled_violation_rate<0.05`, arm ~600 `noul` calls
- BASE1 `research.md:1071` (row 27): "A shared Jev client helper now — **Zero callers today. Extract a shared probe at the third certain caller**, which is whichever of the R19 or R20 Jev arms is built first. Align the skip lines now"
- swe-07's constraint (own lineage): a hub-root helper is impossible (`OVERLAY_FILES={}`)

## Q1 — certain callers of a two-backend probe, counted by phase

Distinguish **Jev-only gates** (the three-check contract, already written per-phase) from **two-backend probes** (the thing a shared helper would own). Counted as "certain" = the caller's code will exist per the phase spec or a surviving lineage design; "conditional" = gated on a printed stop/keep line.

| Caller | Phase/lineage | Probe need | Status |
|---|---|---|---|
| `score-jev-tiebreak.mjs` | 002 | Jev-only (REQ-002 verbatim); Deem variant = glm-01's second-scorer proposal | certain code, Jev-only today; two-backend **conditional** on census |
| goal-verifier shadow arm | 003 | Jev-only (`--jev` + REQ-014 gate) | conditional (gate) |
| `score-compaction-recall.mjs` | 005 | **none** — zero-call by spec | no probe |
| `deletion-arm.mjs` | 005 amendment (swe-04) | two-backend (Deem-preferred) | conditional on stop line |
| `score-goal-lint.cjs` + arm | 006 | Jev-only (REQ-012 verbatim) | lint certain (zero-call); arm conditional on rubric+stop |
| `leaf-route-replay.cjs` | swe-03 (N-swe-03-2) | two-backend (`--backend deem|jev|none`) | designed certain-if-built |
| `cite-drift-scan.mjs` | swe-06 (N-swe-06-1) | two-backend (`--cite-backend`) | designed certain-if-built |
| `intent-port` + fallback arm | swe-05 (N-swe-05-1/2) | two-backend (optional arm) | designed conditional |

**Count: zero built; two certain-if-built lineage slices (leaf-replay, cite-scan); three phase arms conditional on printed gates.** The phases' *existing* gates are all Jev-only — the two-backend probe's first true caller is whichever of {005 deletion arm, leaf-route replay, cite-drift scan} ships first.

## Q2 — the probe contract

```js
// .skilled/bin/backend-probe.cjs  (the fleet home — see Q3)
async function probeBackends(opts = {}) => Promise<{
  deem: { ok: bool, reason: 'no-server'|'unhealthy'|'stub'|'wrong-model'|'malformed'|'timeout'|null,
          model: string|null, backend: string|null, latencyMs: number },
  jev:  { ok: bool, reason: 'not-on-path'|'version'|'no-credential'|null,
          path: string|null, version: string|null, provider: string, latencyMs: number },
  selected: 'deem'|'jev'|null,      // opts.prefer if ok, else the other ok backend, else null
  skipped: 'no-backend'|null
}>
// opts: { prefer='deem', timeoutMs=2000 (offline) | 500 (hook caller),
//         modelId='deem-0.8-v1', provider=env.JEV_PROVIDER||'official' }
```

Rules, all from code read in this packet:

- **Independence**: the two probes run in parallel and never share a verdict (deepseek-01 F12 — `jev auth status` says nothing about a Deem server; the custom-provider trap).
- **Deem pass condition** (deepseek-01 F1–F3 + deepseek-04's allowlist correction): HTTP 200 within `timeoutMs`, JSON object, `status=="ok"`, `backend ∈ {torch} ∪ {ensemble:*}` with no `stub` substring, `model == modelId`.
- **Jev pass condition** (002 REQ-002 verbatim, ordered): `command -v jev` → `jev --version` prints exactly `jev 0.6.2` → `jev auth status --provider P` exits 0. The exact-version check is also the `jevctl`-shadowing defense (002 `:102`: the npm package installs a `jev` with a different exit contract — check 2 catches it).
- **Cache**: per-process memoization only — REQ-002 runs the checks "in order, once per run". **No cross-run cache**: `deem-ctl update` swaps weights (LOCAL:55-70); a cached `ok` could describe weights that no longer serve. The model pin + fresh read each run is the reproducibility defense (glm-01's provenance point).
- **Timeout split** (deepseek-01's rule): 2,000 ms offline scripts, 500 ms inside hooks — probe budget = hook budget minus the feature's reserved call budget.
- **Skip lines** (aligned vocabulary, each feature's own switch): `skipped: no backend`; `jev arm skipped: jev not on PATH` / `version` (+details) / `no credential` (REQ-002's canonical strings); `deem arm skipped: no-server` / `unhealthy (<status>)` / `stub backend` / `wrong model (<found>)` / `malformed` / `timeout`. Malformed or timed-out **answers** at call time are the feature's row-level `unasked`/`unmeasured`, not a probe concern (REQ-010's table).

## Q3 — row 27 applied: is the third caller certain yet?

Row 27's rule: *extract a shared probe at the third certain caller.* Honest application:

- **Certain today**: 0 built two-backend callers.
- **Certain-if-designed-slices-ship**: leaf-route replay (swe-03) and cite-drift scan (swe-06) are this packet's most likely early builds — that's **2**.
- **Third**: whichever of {005's deletion arm (stop-line gated), 002's Deem variant (census-gated), 006's arm (rubric+stop gated)} clears its gate first — exactly row 27's own phrasing ("whichever of the R19 or R20 Jev arms is built first", generalized to either backend).

**Ruling: not yet — extraction fires at the third *built* caller, and zero are built.** But row 27's second clause ("align the skip lines now") is actionable and cheap: the contract above is the alignment. When extraction does fire, the helper's home is `.skilled/bin/backend-probe.cjs` — the fleet-level directory holding `compiled-route.cjs`/`skill-advisor.cjs`, because the callers span ≥3 packages (system-spec-kit runtime, sk-doc shared scripts, system-skill-advisor runtime) and swe-07 proved a hub root can't host it. Until then each caller inlines the ~30–40-line probe (deepseek-01's own estimate) — duplication is cheaper than a premature cross-package dependency.

## Q4 — test cases

Eight cases over loopback fixture servers + a stub `jev` (deepseek-01 F11's harness — "testable with no weights and no network beyond loopback"):

1. `{status:"ok", backend:"stub"}` → `deem.ok=false, reason='stub'` — the trap case
2. `{status:"ok", backend:"torch", model:"deem-1.5"}` → `wrong-model` — the default-id trap
3. `{status:"ok", backend:"ensemble:torch+stub", model:"deem-0.8-v1"}` → `stub` (substring rule)
4. malformed JSON body → `malformed`; port refused → `no-server`; slow fixture → `timeout`
5. `jev --version` prints `jevctl 0.2.3` (the npm shadow) → `reason='version'` + details line — **the key-present-for-wrong-binary case**
6. key stored under `openrouter`, `JEV_PROVIDER` unset → `auth status --provider official` exits 3 → `no-credential` — **the wrong-provider case**: the check is provider-scoped by design, and the probe reports it as absent rather than probing other providers (no enumeration — a stored key is only ever checked under the provider the feature declared)
7. both healthy → `selected = prefer` respected, latency recorded
8. neither → `selected=null, skipped='no-backend'`; caller's zero-call output byte-identical (REQ-002 semantics)

## Q5 — LOC

`backend-probe.cjs` ≈ **70–90 LOC** (Deem fetch+parse ~35, Jev spawn+parse ~30, combine/memo ~15); tests ~110 LOC + two tiny fixture servers (~30). Inlined per caller: ~30–40 LOC each (deepseek-01's estimate, which matches these splits).

## Idea record

### N-swe-08-1 — the aligned probe contract now, the shared file at the third built caller

| Field | |
|---|---|
| **Idea** | Contract + skip-line vocabulary above, adopted by every slice in this packet; file extracted when the third backend-aware caller is built. Type: process contract |
| **Question** | A, G |
| **Builds on** | BASE1 row 27 verbatim; deepseek-01's gate; REQ-002's canonical Jev checks; swe-07's placement constraint |
| **Value** | Prevents skip-line drift across ≥5 future callers; one audit point for the stub/model-pin rules when the file lands |
| **Seam** | future `.skilled/bin/backend-probe.cjs`; today: the contract text each slice's spec quotes |
| **Metric, baseline, harness** | Metric: count of backend-aware callers carrying divergent skip lines (baseline 0 files exist; contract aligns before divergence). Harness: the 8-case fixture suite |
| **Savings** | ~30 LOC × (future callers − 1) at extraction; review minutes — one probe to audit instead of N |
| **Cost, latency, privacy** | Probe is zero-model: one loopback GET (Deem) + three cheap spawns (Jev); nothing leaves the machine for Deem; `auth status` spawns `jev` locally and never prints the key (002 :147) |
| **Two-backend gate** | This IS the gate; per-feature switches unchanged; neither-backend → `skipped: no backend`, byte-identical fallback |
| **Rough LOC** | ~90 + ~140 tests/fixtures when extracted; contract text ~40 lines now |
| **Verdict** | **build-now as contract text** (row 27's "align now" clause); **the file itself waits for caller #3** — earlier extraction is the "shared helper with zero callers" row 27 dropped |
| **Confidence** | Confirmed: caller census, both backend check semantics, placement constraint. Inferred: which caller lands third — depends on gate outcomes, unmeasurable now |

## Ruled out

- **One probe with two readings fused** — deepseek-01 F12: `auth status` reports a stored Jev key, not the Deem server; the probes stay independent, `selected` composes them.
- **Cross-run/TTL cache** — `deem-ctl` updates swap weights; a stale `ok` would attribute answers to the wrong model (glm-01's provenance finding). Per-process memo only.
- **Probing the Deem MCP server** — deepseek-01 F7: stdio, no health route, different contract.
- **Provider enumeration on `no-credential`** — the probe checks only the declared provider; hunting other providers' keys is the credential-discovery shape the safety policy forbids and 002's design deliberately avoids.
- **Extracting at caller #2** — at ~30 LOC inlined, two copies cost less than the import edge; row 27's number stands.

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| Certain two-backend callers today: **0 built**; designed: 2 lineage slices + 3 gated phase arms; all *existing* phase gates are Jev-only (REQ-002 ≡ REQ-012 verbatim) | **new** (first by-phase census of the probe's callers) | 002 `:126`, 006 `:151`, 003 `:44-61`, 005 `:122-128`; lineage designs swe-03/04/06 |
| Row 27's "third certain caller" is answerable: it is whichever of {005 deletion arm, 002 Deem variant, 006 arm} clears its printed gate first — extraction waits, contract aligns now | **new** (row applied to post-round-3 survivors) | BASE1 `:1071`; gate analysis above |
| The helper's home is decided by elimination: not hub root (`OVERLAY_FILES={}`, swe-07), not a single skill package (callers span 3) → `.skilled/bin/` | **new** | `skill-root-metadata-contract.cjs:122`; caller table |
| A cross-run probe cache is *wrong by design* here: deem-ctl updates swap weights, so cached health attributes answers to stale weights | **new** (cache semantics against the update mechanism) | LOCAL:55-70; glm-002's provenance argument |
| The wrong-provider case is handled by provider-scoping, not enumeration: `auth status --provider P` only ever checks P | confirms BASE2 with the negative clarified | 002 REQ-002/REQ-003 |

## Hand-off

- swe-09: the caller table above is the build-order input — zero-call artifacts first (census, replay runner, lint), arms after their gates.
- swe-10: the probe contract is half of the first-PR checklist if a slice carries a backend arm; the skip-line strings are copy-paste ready.
- Synthesis: `skipped: no backend` + the six `deem arm skipped:` + three `jev arm skipped:` strings are the lineage's contribution to row 27's "align the skip lines now".
