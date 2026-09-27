---
title: "Iteration 10: The first PR-sized slice"
trigger_phrases: []
---
# Iteration 10: The first PR-sized slice

**Angle:** swe-10 · **Lens:** code-level slice design · **Maps to:** H

## Sibling check (W4)

- `grok/iterations/iteration-010.md`: "if only one phase ships — ship no new classifier phase." This iteration's slice is inside an already-Planned phase (002) and makes zero calls: compatible — it ships *measurement*, not a new classifier.
- `deepseek/iterations/iteration-010.md`: puts `cli-deem`+hub at step 2; my swe-09 contests and reorders (client leaf first, hub last). Their census-first principle is identical.
- glm, mimo: no iteration 10.

## Actions Taken

- Reopened `002-advisor-jev-tiebreak-arm/spec.md` REQ-001/004/005/006/007/011 and the corpus directory (`routing-accuracy/` files all present: `labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `scorer-eval-baseline.json`, `capture-scorer-eval-baseline.mjs`).

## The first PR: `score-jev-tiebreak.mjs`, census slice only

**Scope line:** the zero-call census, baseline column, comparators and power line. No `--jev` flag handling beyond parsing-and-refusing, no probe call, no arm code. The arm is a later PR behind the gate.

### Files (all new; nothing else touched)

| File | LOC | Contents |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` | ~180 | census + baseline + comparators + power line |
| `…/routing-accuracy/score-jev-tiebreak.vitest.ts` | ~120 | happy path + stub-jev silence + mismatch case |
| `002-advisor-jev-tiebreak-arm/spec.md` | ~20 lines edited | step-0 amendment text (two-backend gate reservation, `--backend` reserved) |

### Functions

- `readCorpus(file)` — stream both corpus JSONLs, keep skill-firing rows only (177 + 64 per REQ-004).
- `runScorer(prompt, env)` — imports the built `dist` scorer under REQ-005's exact env (`mkdtemp` db dir, `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1`, `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1`, `PYTHONDONTWRITEBYTECODE=1`, `VITEST=true`, three lane deletes).
- `isAliasMatch(gold, pick)` — the alias-aware match of `scorer-eval-baseline.json`'s capture (`capture-scorer-eval-baseline.mjs:70-76`).
- `clusterColumns(rows)` — eligible / movable / gold-first / gold-outside / gold-in-top-3 from `ambiguousWith`; tau-0.03 slice membership beside it.
- `comparators(rows)` — scorer order, confidence order, always-second, outcome-weighted rerank (held-out rows only), each scored MRR / right@1 / right@3.
- `powerLine(movable)` — exact one-sided binomial at 0.05: decided-row ceiling, wins needed, true win rate for 80% power; prints `no headroom` at 0 movable, `underpowered` at 1–4.
- `main()` — prints the report; `--jev` accepted and answered with `arm not in this slice: census only` (a documented refusal line, not silence).

### Observable check

`node score-jev-tiebreak.mjs` prints per-file counts, holdout top-1 `53/70`, comparator table, power line; a stub `jev` first on PATH logs zero invocations; `git status --porcelain` afterward shows only the two new files; exit 0.

## Kill rule in code (Q2)

Three pre-registered exits, all inside `main()` — no judge needed:

1. `baseline mismatch: comparison void` — alias-aware holdout top-1 ≠ 53/70 → non-zero exit, run voided (REQ-005).
2. `no headroom` — 0 movable rows → exit 0, the phase's arm never builds (REQ-004).
3. `underpowered` — 1–4 movable rows → exit 0, `choice` arm skipped; R21 conditional arm is the only follow-on (REQ-004/REQ-007).

A fourth, repo-level kill: the PR's diff is two files — `git revert` is the whole rollback.

## What it proves about both backends with neither available (Q3)

- **The zero-call boundary is testable, not trusted.** REQ-001's stub-jev test is the audit pattern every later arm (Jev *or* Deem — stub `deem-ctl`, closed port) reuses: "the flag was absent, therefore nothing was invoked" becomes a proven property, not a promise.
- **The arm's input size is priced for both backends before either is probed.** `movable` is the row count a classifier would face; the power line's wins-needed and true-rate numbers apply identically to a `--backend deem` arm. The census is backend-neutral measurement — it doesn't assume Jev wins the backend choice.
- **The baseline reproduction check** (53/70 under the pinned env) proves the comparator the arm must beat is itself reproducible — without that, any later `keep`/`kill` verdict is void regardless of backend.

## Reviewer checklist (Q4)

- [ ] `grep -n "spawn\|execFile\|jev" score-jev-tiebreak.mjs` — the only `jev` occurrences are flag parsing and the refusal line.
- [ ] Stub `jev` (appends to a log) first on PATH → run → log empty (REQ-001).
- [ ] Holdout top-1 prints `53/70`; a doctored baseline fixture prints `baseline mismatch` + non-zero exit (test 3).
- [ ] Env block matches `capture-scorer-eval-baseline.mjs:35-46` exactly (REQ-005), incl. the three lane deletes.
- [ ] `git status` after run: only the two new files; corpus and baseline JSON untouched (REQ-006).
- [ ] `--jev` prints the refusal line and exits; no call path exists to dead-code audit.
- [ ] Report directory, if written, is inside the repo or operator-named (REQ-006).

## Rollback (Q5)

`git revert` the PR commit — deletes the script and test, restores the spec lines. No state, no generated artifacts, no registry writes: REQ-006's read-only contract makes the slice revert-clean by construction.

## Why this slice and not the runners-up

- **vs. `cli-deem` client (swe-09 step 2):** the client is the first *backend-bearing* PR (~440 LOC, fixture tests) — it is PR #2 in the order. The census is smaller, sits inside an approved Planned spec, and its power line decides whether the client's first caller ever runs. Deleting the client before knowing `movable` risks shipping a client whose only user was already killed.
- **vs. 005's census (~700 LOC):** 4× the LOC for the same measurement-class value; its transcript corpus needs operator naming. Second in step 1, not first.
- **vs. probe contract as code:** swe-08's ruling — zero callers today; a zero-caller shared file is exactly what BASE1 row 27 dropped.

## Idea record

### N-swe-10-1 — the census slice as first PR

| Field | |
|---|---|
| **Idea** | `score-jev-tiebreak.mjs` census-only slice: two files + ~20 spec lines; three pre-registered exits; the stub-silence test as the audit pattern both backends inherit |
| **Question** | H |
| **Builds on** | swe-09 order step 1.1; BASE2 §13 002 table; REQ-001/004/005/006 verbatim |
| **Value** | First real numbers (movable rows, power) at zero cost and zero privacy surface; gates every arm; the audit-boundary test becomes the family template |
| **Seam** | `routing-accuracy/` script set (exists; new sibling only) |
| **Metric, baseline, harness** | Metric: movable/eligible counts, comparator MRR/right@1/right@3; baseline: 53/70 + scorer order; harness: the script itself |
| **Savings** | Operator context: replaces manual corpus arithmetic (per-file counts, power math) with one command; sets the ≤723-call ceiling before any call |
| **Cost, latency, privacy** | Zero calls; seconds offline; reads committed corpora only — nothing leaves the machine |
| **Two-backend gate** | n/a — zero-call slice; proves the audit boundary both backends' arms inherit; `--jev` refused with a printed line |
| **Rough LOC** | ~180 + ~120 test + ~20 doc |
| **Verdict** | **build-now** — smallest unblocked slice, approved spec, revert-clean |
| **Confidence** | Confirmed: corpus files, baseline, REQ text all opened this iteration. Inferred: the ~180 LOC estimate is BASE2's lineage estimate, not a recount |

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| First PR = 002 census slice (script + vitest + step-0 spec lines); arm deliberately excluded — `--jev` gets a printed refusal | **new** (a slice boundary BASE2 leaves as one script) | 002 REQ-001/004/005; swe-09 |
| The stub-silence test is the audit template all later arms reuse, on both backends | **new** (names the pattern's purpose) | REQ-001's stub test; deepseek-09 N-1 |
| `movable` prices the arm for *both* backends — census output is backend-neutral input sizing | **new** | REQ-004 columns vs swe-08 contract |
| The census slice is revert-clean by REQ-006's read-only contract | confirms REQ-006 with the rollback consequence named | REQ-006 |

## Hand-off

- Synthesis: this slice + swe-09's order + swe-08's contract are the packet's actionable core: one PR, five steps, three extraction triggers.
