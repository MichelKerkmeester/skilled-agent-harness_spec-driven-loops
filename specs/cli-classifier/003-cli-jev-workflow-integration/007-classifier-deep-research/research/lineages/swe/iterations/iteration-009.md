---
title: "Iteration 9: Build order in code"
trigger_phrases: []
---
# Iteration 9: Build order in code

**Angle:** swe-09 · **Lens:** code-level slice design · **Maps to:** H

## Sibling check (W4)

- `deepseek/iterations/iteration-009.md`: full failure-mode table on both backends (Jev rows from BASE2 §11 + `jev_cli` exit map; Deem rows from its iterations 1/4/6/8). Its fixture rule (N-deepseek-09-1): ship stub-backend tests with the first live-path form.
- `deepseek/iterations/iteration-010.md`: replacement two-backend gate text usable verbatim in phase specs; six-step dependency order; F5 — **006's mechanical lint must never take a classifier** (its value is determinism; the classifier form is a *separate* advisory — matching my swe-06 cite-scan being a sibling, not a lint flag).
- `grok/iterations/iteration-010.md`: "if only one phase ships — ship no new classifier phase; order by kill rules, not enthusiasm." Duly noted: the order below is dependency-driven, and every backend step sits behind a printed gate.
- `glm/iterations/` stops at 5, `mimo/` at 4 — no newer order proposals from them (recorded, not invented).

## Actions Taken

- Reopened BASE2 §13 phase tables (`004-deep-research-expansion/research/research.md:908-990`) and §9 order/cost/kill lines (`:440-495`).
- Consolidated own iterations 1–8 into the dependency graph.

## The order — five steps, backend-free until step 3

BASE2's invariant holds and is widened: *free numbers first, first billed call second, labels third, arms last* — plus one leading step (spec text) and one trailing step (the hub).

### Step 0 — phase-text amendments (no code)

| File | Edit |
|---|---|
| `002-advisor-jev-tiebreak-arm/spec.md` | REQ-002's gate replaced by deepseek-10's two-backend text verbatim; add `--backend jev|deem` arm switch; REQ-009 record gains `backend`/`model` fields; Deem comparator column behind `--backend deem` |
| `003-goal-verifier-jev-shadow/spec.md` | same gate text; `OPENCODE_GOAL_VERIFIER` doc line reserves `deem` as a future value (not built) |
| `005-compaction-recall-harness/spec.md` | arm section gains the swe-04 insertion table: `--arm-backend`, `probeBackend`, `probe_timeout_ms`, Deem skip lines; census REQs untouched (zero-call) |
| `006-goal-criteria-lint/spec.md` | REQ-012's three checks → two-backend text; explicit line that the *lint* never takes a backend (deepseek-10 F5) |

Files: 4 spec edits. LOC: ~120 doc lines. Rollback: revert the doc commits. This step also writes swe-08's skip-line vocabulary once, so every later script quotes it instead of inventing strings (BASE1 row 27's "align now").

### Step 1 — zero-call measurement wave (no backend, parallel-safe)

| Artifact | Home | LOC | Test | Exit/kill line |
|---|---|---|---|---|
| `score-jev-tiebreak.mjs` (census mode) | `system-skill-advisor/runtime/scripts/routing-accuracy/` | ~180 | vitest + corpus fixtures | `baseline mismatch: comparison void` / `no headroom` / `underpowered` |
| `score-compaction-recall.mjs` | `system-spec-kit/runtime/scripts/compaction-recall/` | ~700 | six fixture transcripts | `unknown record shape: …` / `arm not built: fit_throws>=50% OR …` |
| `count-pi-goal-nudges.mjs` | `.skilled/hooks/goal/lib/` | ~100 | transcript fixtures | `stop: fewer than 30 rows` |
| `lint-goal-criteria.cjs` + `score-goal-lint.cjs` | `sk-create-goal/scripts/` | ~370 | labels file (~100 rows, after rubric) | `r20 jev arm not built: labeled_violation_rate<0.05` |
| `leaf-route-replay.cjs` (scorer path only) | `sk-doc/shared/scripts/` | ~150 | bank mocks | no kill line — measurement only |
| cite-drift label collection | operator + swe-06 labeler | 0 code | n/a | `stop: fewer than 30 labeled pairs` |

All six are independent; each is its own commit; each prints its stop line *before* any backend work starts. Operator labor: rubric (~10 min), goal labels (~55 min), cite labels (~50 min) — the labels are the long pole, matching BASE2's 2–2.5 h estimate.

### Step 2 — the Deem client (first backend-bearing code)

`cli-deem` standalone packet under `.skilled/skills/cli-deem/` — NOT inside a hub yet: `deem-client.mjs` (~180: POST `/v1/systemone`, envelope → Jev-shaped `{verdicts|options|scores}`, `error` mapping per deepseek-01 F5), `wire-format.md` (~100 doc), `deem-ctl` reference docs, fixture servers (~50), test (~110). **~440 LOC, 4 files + test.** Every later Deem caller imports this; Jev callers keep spawning the binary (002's contract). Rollback: delete the packet.

Why standalone-first: swe-07's hub move is a 53-file atomic relocation; per row-27 logic the *hub* is the third-caller extraction, not the client. A standalone `cli-deem` skill is a leaf today and becomes the hub's `cli-deem` mode verbatim at step 4 — the move doesn't invalidate it.

### Step 3 — first gated arms (need 002's latency record + redaction cases)

Ordered by gate cheapness:

1. **002's arm** (`--jev`, then `--backend deem` variant): first latency record on record; kills on `verdict: kill`.
2. **leaf-route replay classifier arm** (`--backend`): zero-call scorer path already built in step 1; the arm adds `probeBackend` + typed calls. Cheapest second arm — corpus already exists.
3. **cite-drift-scan** (`--cite-backend`): needs its label set from step 1.
4. **005's deletion arm** (`--arm-backend`): needs census stop line + redaction cases (fitted-history egress).
5. **006's Jev arm** (`--jev`/D5): needs rubric + `labeled_violation_rate>=0.05`.
6. **003's shadow**: last — the only live-path form; needs redaction cases + 002 latency + keep verdict.

Each arm carries: its own switch, `probeBackend` inline (steps 3.1–3.3 are callers 1–3), the swe-08 skip lines, `stopped:`/`partial` handling (002 REQ-010), and per-call records with `backend:`/`model:`/`latencyMs:`.

### Step 4 — extraction wave (fires on counts, not dates)

- **Third backend-aware caller exists** → extract `.skilled/bin/backend-probe.cjs` (~90 LOC + ~140 tests); refactor the three callers to import it. Rollback: inline the copies back (they're identical by construction).
- **Second transport packet exists** (`cli-deem` + `cli-usage`) → the `cli-classifier` hub move (swe-07: 53 files, 39 refs, 12 generated surfaces, atomic commit). Rollback: revert the move commit.

## What becomes shared, and when (Q3)

| Shared artifact | Trigger | Today |
|---|---|---|
| Skip-line vocabulary + gate text | step 0 (doc) | written once, quoted by all |
| `deem-client.mjs` translator | step 2, first Deem arm | n/a until then |
| `backend-probe.cjs` file | third built caller (swe-08) | inlined ~35 LOC per caller |
| four-outcome verdict + flip≤0.10 rule | 002 REQ-008/REQ-013 already the family template | copied per arm, not imported (each spec owns its wording) |
| `cli-classifier` hub | second transport packet | not built |

## Failure modes and their printed lines (Q4)

BASE2 §9's family + swe-08's skip lines + two Deem-specific additions this iteration requires:

- `deem arm stopped: server gone` — server dies mid-run (deem-ctl update/restart): finished rows `partial`, remaining `unmeasured`, exit per REQ-010's table. New line; the Jev equivalent is `key rejected`.
- `deem arm skipped: wrong model (deem-1.5)` — the unpinned-id trap (deepseek-01 F3); fires at probe time, costs nothing.
- `unknown record shape: <type> at <file>:<line>` (005 census), `baseline mismatch` (002), `stop:`/`arm not built:` lines — all unchanged, all pre-registered in specs.

## Totals (Q5)

- **New code ≈ 2,600–3,100 LOC** across ~14 new files + tests: step 1 ≈ 1,500; cli-deem ≈ 440; arms ≈ 600–900 combined; probe ≈ 230 when extracted.
- **Doc lines ≈ 120** (step 0).
- **Moved** ≈ 53 files (step 4, optional and reversible).
- Zero of it touches a validator exit code, a router decision, or a hook deadline.

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| Step 0 spec amendments are separable from code and carry the probe contract verbatim | **new** (deepseek-10 wrote the text; its placement as a distinct step is this iteration's) | deepseek-10 F2; BASE2 §13 |
| `cli-deem` standalone leaf precedes the hub move — hub waits for the second transport packet, not the first | **new; contests deepseek-10's step-2 hub-first order** | swe-07's 53-file blast radius; row-27 extraction logic; a leaf→mode move is verbatim |
| Deem mid-run death needs its own `stopped:` line (`server gone` ≠ `key rejected`) | **new** | deepseek-09's table has no Deem stopped row; `deem-ctl` update can kill a server mid-run (LOCAL:55-70) |
| The four-outcome/flip-0.10 rule is a *copied template*, not shared code — specs own their wording | confirms BASE2 pattern with the boundary stated | 002 REQ-008 ≡ 006 REQ-013 verbatim |
| Step 1 wave: six zero-call artifacts, three of which (leaf replay, cite labels, Pi census) aren't in BASE2's phase list | **new** | swe-03/06 designs; BASE2 §9 order |

## Hand-off

- swe-10 picks the first PR: by this order it's **step 1's `score-jev-tiebreak.mjs` census slice** (180 LOC, zero-call, tests a stub-jev silence) — or, if the criterion is "proves both backends with neither available", the cli-deem fixture suite; decide there.
- Synthesis: the order + totals + shared-code triggers are the lineage's H answer.
