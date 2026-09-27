---
title: "Implementation Plan: Phase 17: deem-search-narrowing-arm"
description: "One read-only Node script in system-spec-kit's retrieval package builds a leak-filtered track test set, scores ripgrep and the trigger-index lookup at track level with zero calls, then, behind --deem (preferred) or --jev and each backend's own checks, scores one choice over the 16 spec tracks per column under a keep rule fixed in the spec."
trigger_phrases:
  - "track narrowing plan"
  - "score-track-narrowing plan"
  - "deem narrowing keep rule"
  - "track-level baseline plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 17: deem-search-narrowing-arm

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`.mjs`), standard library plus the retrieval package's own `lib/` and `lookup-trigger-index.mjs` exports |
| **Framework** | None. The script spawns `rg` through `lib/rg-lane.mjs`, and `cli-deem` and `jev` as binaries |
| **Storage** | None. Reads the committed index and `description.json` files, writes only to an operator-named directory |
| **Testing** | Vitest, the `cli` project of `.skilled/skills/system-spec-kit/vitest.config.ts` |

### Overview
`score-track-narrowing.mjs` (proposed) builds questions from packet descriptions, drops placeholders and name leaks, and scores two zero-call baselines at track level with each question's own folder excluded. It prints the baseline and a headroom line first. Behind `--deem` and a passing Deem check, or `--jev` and a passing Jev gate, it asks one `choice` per question in three option orders and prints `verdict <backend>: keep` or `verdict <backend>: stop (<reason>)` per column under the rule in spec REQ-004. Deem is preferred: the plan's live run is `--deem`, and a `--jev` run happens only on the operator's flag.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 010's regenerated index is committed and a scratch rebuild finds 0 missing documents
- [ ] Phase 008's `cli-deem` has landed, for the Deem arm only
- [ ] `jev` 0.6.2 is on `PATH` with a credential for provider P, for a `--jev` run only
- [ ] The margin, leak rule and baseline definitions in `spec.md` are unchanged since planning

### Definition of Done
- [ ] Every `acceptance-criteria.md` row is `Met` with observed evidence
- [ ] The vitest file exits 0
- [ ] `git status --porcelain` shows only the three planned paths and the report directory
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file offline measurement script, the same shape as the retrieval package's `measure-cold-lookup.mjs`: a MODULE banner, exported pure functions for tests and a `main()` behind `isMainModule`.

### Key Components
- **Test-set builder**: walks `specs/<track>/`, reads `description.json`, applies the placeholder and leak filters, keeps at most 20 rows per track by SHA-256 of the folder path and records per-track counts.
- **Lookup baseline**: `loadIndex()` and `lookup()` with limit 0, own-folder rows removed, first scoring `specs/` row gives the track.
- **Ripgrep baseline**: the path-only recipe from `lib/rg-lane.mjs` over `specs`, one run per distinct token with a per-token cache, files scored by distinct tokens matched.
- **Deem arm**: the health gate, the payload notice, 17-option `choice` calls in three rotations, exit handling and the shared `calls.jsonl` writer.
- **Jev arm**: phase 002's gate (identity line, `command -v jev`, `jev --version`, `jev auth status --provider P`), one `jev auth test --provider P`, the payload notice, the same 17 options and three rotations with no answer cache, the 90 s spawn cap and phase 002's exit handling, writing to the same `calls.jsonl`.
- **Verdict**: per backend column, accuracy against the baseline on the rows that column measured, the exact one-sided sign test on discordant rows, the flip rate across three calls and the fixed 10-point margin.

### Data Flow
`description.json` files become filtered rows. Each row goes through both baselines, giving a pick or an abstention per method. The headroom line decides whether any arm may call. With `--deem` or `--jev`, each row gets three `choice` answers from that backend, reduced to a modal pick. Each verdict compares its backend with the better baseline on the rows that backend measured. A failed check never starts the other backend. The paraphrase-probe line runs beside it and never enters the verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lookup-trigger-index.mjs` exports `loadIndex`, `lookup` | Gate 1 lookup | Unchanged. Imported read-only | `git diff --stat` on the file is empty |
| `lib/rg-lane.mjs` `pathOnlyRecipe`, `runRecipe` | Ripgrep recipe lane | Unchanged. Imported read-only | `git diff --stat` on the file is empty |
| `runtime/data/trigger-index.json` and `retrieval/fixtures/*` | Committed index and fixtures | Unchanged. Read only | `git status --porcelain` lists neither |
| `retrieval/README.md` | Package inventory | One row, one tree line and the probe-reader note | `rg -n 'score-track-narrowing' README.md` returns the new lines |
| Hooks, `AGENTS.md` Gate 1 text | Live search path | Not a consumer | `git status --porcelain` lists neither |
| Credentials | `jev` resolves its own key | Never read or passed | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on the script returns no match |

Required inventories:
- Same-class producers: `rg -n 'semantic-probes' .skilled/skills/system-spec-kit/runtime/cli` finds only the README and the new script, confirming the fixture gains exactly one reader.
- Consumers of changed symbols: none. The script adds exports that only its own test imports.
- Matrix axes: Deem state (none, stub, wrong model, healthy), Jev state (not on `PATH`, wrong version, no credential, passing, key rejected), switches (`--deem`, `--jev`, both, neither) and baseline headroom (above or below 0.90). The vitest cases cover one row per axis value.
- Algorithm invariant: a question never scores against a document inside its own folder, no row enters a column's verdict unless that backend measured it, and every logged `jev` call carries the same `--provider`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Each step's observable check:

1. **Freshness.** Rebuild the index to scratch with `--out`, `--manifest`, `--diagnostics` and `--variants` all pointing into scratch, since the generator writes tracked fixtures by default (`generate-trigger-index.mjs:64-67`), and diff its path set against the committed index. Check: 0 documents missing and `git status --porcelain` unchanged.
2. **Test set.** Build and print the rows. Check: per-track kept, placeholder and leak counts print, and the kept total is at most 320.
3. **Baselines.** Score both. Check: two accuracies on identical rows, the `manifestHash` and the headroom line print, and stub `cli-deem` and `jev` log nothing.
4. **Model arms.** Add the Deem arm, then the Jev arm with phase 002's gate, each with its notice, calls, exits and records in one `calls.jsonl`. Check: the vitest stub-`cli-deem` and stub-`jev` cases pass, and the stub `jev` log shows one `--provider` value.
5. **Verdict.** Add the keep rule and the probe line. Check: the vitest keep and stop cases pass.
6. **Runs.** One zero-call run, then, unless it prints `no headroom`, one `--deem` run with `--out`. A `--jev` run follows only if the operator passes `--jev`. Check: one verdict line per column that ran, and a `calls.jsonl` whose every line has a wall time, with the commit pair on Deem lines and provider and model on Jev lines.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Test-set builder (stratified rows, leak drop), lookup baseline (pick, own-folder exclusion), ripgrep baseline (distinct-token pick), verdict (`keep`, `stop (margin)`, `requalify`), each per column | Vitest, `cli` project, a temp fixture corpus and an index built with the package's `generate()` |
| Integration | Default run with stub binaries (no call, `no headroom` on a saturated fixture), Deem gate (fake health passes, stub backend skips byte-identically), Deem exit 4 with a changed commit pair, Jev gate (passing stub, `no credential` skip), Jev exit 3 after the gate, one `--provider` on every logged `jev` call | Vitest with stub `cli-deem` and `jev` first on `PATH` |
| Manual | One zero-call run, one `--deem` run and, on the operator's flag, one `--jev` run on the real tree | Terminal, operator-named `--out` directory |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 010 fresh index | Internal | Yellow, Planned | The lookup baseline is unfair. Steps 3 and 6 wait |
| Phase 008 `cli-deem` | Internal | Yellow, Planned | Steps 4 and 6's `--deem` run wait. Steps 1 to 3 do not |
| Local Deem server | External, operator-run | Green, served per `deem-local.md` | The `--deem` run prints its skip line |
| `jev` 0.6.2 and a credential for provider P | External, operator-held | UNKNOWN until `jev auth status --provider P` runs | The `--jev` run prints its skip line |
| `rg` on `PATH` or `SPECKIT_RG_BIN` | External | Green | The ripgrep baseline exits 2 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A test fails after merge, the script writes outside its report directory, or the operator drops the idea after a `stop` verdict.
- **Procedure**: Revert the one commit that adds the script, its test and the README lines. Delete the operator-named report directory if it is inside the repository. Nothing else changed, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Freshness (010 landed) ──► Test set ──► Baselines ──► Zero-call run
                                                      │
008 landed ──► Deem arm ──┐                           │
                          ├──► Verdict ───────────────┴──► --deem run, then --jev on the operator's flag
Jev arm ──────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Freshness | Phase 010 | Baselines |
| Test set | None | Baselines |
| Baselines | Freshness, Test set | Zero-call run, Verdict |
| Deem arm | Phase 008 | Verdict |
| Jev arm | None | Verdict |
| Verdict | Baselines, Deem arm, Jev arm | `--deem` run, `--jev` run |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | About 1 hour: freshness check and fixture corpus |
| Core Implementation | Med | About 5 to 7 hours: builder, baselines, both arms and verdict |
| Verification | Low | About 1 to 2 hours: vitest and the two runs |
| **Total** | | **About 7 to 10 hours (estimate)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No backup needed: the phase writes no data outside its report directory
- [ ] No feature flag: `--deem` and `--jev` are the script's own switches and nothing else reads them
- [ ] No monitoring: nothing is served

### Rollback Procedure
1. Stop any running `--deem` or `--jev` run with Ctrl-C. It exits 130 and prints `interrupted`.
2. Revert the commit that added the script, its test and the README lines.
3. Rerun the retrieval vitest suite and confirm the lookup's own tests still pass.
4. Tell the operator the narrowing measurement is withdrawn. Nothing user-facing changed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. Delete the operator-named report directory if it is inside the repository.
<!-- /ANCHOR:enhanced-rollback -->

---
