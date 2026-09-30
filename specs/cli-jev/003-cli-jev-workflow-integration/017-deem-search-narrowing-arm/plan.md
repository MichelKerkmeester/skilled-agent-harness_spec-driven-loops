---
title: "Implementation Plan: Phase 17: deem-search-narrowing-arm"
description: "One read-only Node script in system-spec-kit's retrieval package builds a leak-filtered track test set, scores ripgrep and the trigger-index lookup at track level with zero calls, then, behind --jev or --deem (Jev first, then Deem) and each backend's own checks, scores one choice over the 16 spec tracks per column under a keep rule fixed in the spec."
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
`score-track-narrowing.mjs` (proposed) builds questions from packet descriptions, drops placeholders and name leaks, and scores two zero-call baselines at track level with each question's own folder excluded. It prints the baseline and a headroom line first. Behind `--deem` and a passing Deem check, or `--jev` and a passing Jev gate, it asks one `choice` per question in three option orders and prints `verdict <backend>: keep` or `verdict <backend>: stop (<reason>)` per column under the rule in spec REQ-004. Jev first, then Deem (operator, 2026-09-29): a `--jev` run happens only on the operator's flag, and the plan's live run is `--deem`. A `verdict deem: keep` from that live run is the operator's keep that unlocks phase 009 (parent goal D4). (Superseded 2026-09-29: 009 unlocks once 008 is Complete, parent D4 amended. A keep still decides whether a pick may be served, which needs a later phase.) Any other verdict still closes the phase and goes in `goal.md`'s log for the parent goal.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 010's regenerated index is committed and a scratch rebuild finds 0 missing documents (010 is Complete, so this is a check, not a wait). `--check` exit 0 with 0 stale, and the scratch rebuild matched the committed index (`tasks.md` T001)
- [x] Phase 008's `cli-deem` has landed, for the Deem arm only. 008 is Complete (`ee3a1b057c`)
- [x] `jev` 0.6.2 is on `PATH` with a credential for provider P, for a `--jev` run only. Used once: before the live `--jev` run of 2026-09-29 `jev --version` printed `jev 0.6.2` and `jev auth status --provider official` exited 0 (`tasks.md` T018)
- [x] The leak rule, the baseline definitions, the `-q` instruction and the REQ-004 keep rule in `spec.md` are unchanged since the 2026-09-28 amendment. The closure amendment touched only REQ-008's call count and NFR-P02, after the runs

### Definition of Done
- [x] Every `acceptance-criteria.md` row is `Met` with observed evidence. 14 of 14
- [x] The vitest file exits 0. 33 passed
- [x] `git status --porcelain` shows only the paths in spec section 3 and the report directory. At the build's final check, and the build commit `f7ae1ff44c` holds the same paths plus the Hermes copy of `SKILL.md` and the build record (`tasks.md` T015)
- [x] `validate_document.py` exits 0 on every skill doc the phase changed (parent goal D6). 8 of 8
- [x] A cross-family review of the code leaves no open P0 or P1 finding, and the `cli` vitest project fails nothing beyond its baseline recorded before the build (parent goal D5). Round 2 PASS, and 1,602 passed with 0 failures against a baseline of 1,569
- [x] The verdict line, or `no headroom`, is in `goal.md`'s log for the parent goal's log (parent goal D4). `verdict deem: stop (margin)`
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
- **Verdict**: per backend column, spec REQ-004 in its fixed order: coverage (at least 90 percent of kept rows measured), the 10-point margin against the baseline method on the measured rows, the exact one-sided sign test on discordant rows and the flip rate across three calls. Integer counts, an exact p, one stdout line and the same verdict with its inputs in `report.json`.

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
| `system-spec-kit` `SKILL.md`, `README.md`, changelog, feature catalog and manual testing playbook | Skill docs (parent goal D6) | One sentence, one line, one new changelog file, one catalog entry and one playbook entry with their index rows, each through its sk-doc mode | `validate_document.py` exits 0 on each, and `rg -n 'score-track-narrowing'` finds the script in each |
| Hooks, `AGENTS.md` Gate 1 text | Live search path | Not a consumer | `git status --porcelain` lists neither |
| Credentials | `jev` resolves its own key | Never read or passed | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on the script returns no match |

Required inventories:
- Same-class producers: `rg -n 'semantic-probes' .skilled/skills/system-spec-kit/runtime/cli` finds only the README and the new script, confirming the fixture gains exactly one reader.
- Consumers of changed symbols: none. The script adds exports that only its own test imports. Phase 009 consumes the Deem verdict line and its `report.json` column, never the code (parent goal D4).
- Matrix axes: Deem state (none, stub, wrong model, healthy), Jev state (not on `PATH`, wrong version, no credential, passing, key rejected), switches (`--deem`, `--jev`, both, neither) and baseline headroom (above or below 0.90). The vitest cases cover one row per axis value.
- Algorithm invariant: a question never scores against a document inside its own folder, no row enters a column's verdict unless that backend measured it, and every logged `jev` call carries the same `--provider`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

**Who builds (parent goal D5).** A fresh Opus 5.5 xhigh build orchestrator writes one single-change brief per step below and runs the CLI executors by Bash only: Devin `deepseek-v4-1-flash-max`, Pi on Cline `cline-pass/cline-pass/deepseek-v4.1-flash` at `xhigh` (probe passed 2026-09-28) and Cursor `grok-4.7-xhigh-fast`. It never uses the Agent tool. The parent orchestrator session verifies each step against its check, gets a cross-family review of the code from a model family other than the one that wrote it and commits with path-scoped commits. Code follows sk-code's OpenCode route (`sk-code-opencode`), and the skill docs go through sk-doc (parent goal D6).

Each step's observable check:

1. **Freshness.** Rebuild the index to scratch with `--out`, `--manifest`, `--diagnostics` and `--variants` all pointing into scratch, since the generator writes tracked fixtures by default (`generate-trigger-index.mjs:76-79`), and diff its path set against the committed index. Since phase 010, `--out` alone already keeps the fixtures untouched (spec risks), so the extra flags are harmless. Check: 0 documents missing and `git status --porcelain` unchanged.
2. **Test set.** Build and print the rows. Check: per-track kept, placeholder and leak counts print, and the kept total is at most 320.
3. **Baselines.** Score both. Check: two accuracies on identical rows, the `manifestHash` and the headroom line print, and stub `cli-deem` and `jev` log nothing.
4. **Model arms.** Add the Deem arm, then the Jev arm with phase 002's gate, each with its notice, calls, exits and records in one `calls.jsonl`. Check: the vitest stub-`cli-deem` and stub-`jev` cases pass, and the stub `jev` log shows one `--provider` value.
5. **Verdict.** Add the keep rule and the probe line. Check: the vitest `keep`, `stop (margin)` and `stop (coverage)` cases pass, and the default run prints `margin: 0.10` and the `keep rule:` line before any call.
6. **Runs.** One zero-call run, then, unless it prints `no headroom`, one `--deem` run with `--out`. A `--jev` run follows only if the operator passes `--jev`, and the build never waits for that flag (parent goal D7). Check: one verdict line per column that ran, and a `calls.jsonl` whose every line has a wall time, with the commit pair on Deem lines and provider and model on Jev lines. The verdict line, or `no headroom`, goes in `goal.md`'s log for the parent goal's log (parent goal D4).
7. **Skill docs.** Update `system-spec-kit`'s `SKILL.md`, `README.md`, changelog, feature catalog and manual testing playbook through sk-doc, after the runs so no doc names a verdict that did not print. Check: `validate_document.py` exits 0 on each changed doc.
8. **Review and commit.** A cross-family review of the script and its test, then the parent orchestrator's path-scoped commits. Check: no open P0 or P1 finding, and the `cli` vitest project fails nothing beyond the baseline recorded before step 2.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Test-set builder (stratified rows, leak drop), lookup baseline (pick, own-folder exclusion), ripgrep baseline (distinct-token pick), verdict (`keep`, `stop (margin)`, `stop (coverage)`, `requalify`), each per column | Vitest, `cli` project, a temp fixture corpus and an index built with the package's `generate()` |
| Integration | Default run with stub binaries (no call, `no headroom` on a saturated fixture), Deem gate (fake health passes, stub backend skips byte-identically), Deem exit 4 with a changed commit pair, Jev gate (passing stub, `no credential` skip), Jev exit 3 after the gate, one `--provider` on every logged `jev` call | Vitest with stub `cli-deem` and `jev` first on `PATH` |
| Manual | One zero-call run, one `--deem` run and, on the operator's flag, one `--jev` run on the real tree | Terminal, operator-named `--out` directory |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 010 fresh index | Internal | Green, Complete since 2026-09-27 | Step 1 still checks freshness. A stale index would make the lookup baseline unfair |
| Phase 008 `cli-deem` | Internal | Green, Complete since 2026-09-28 (`ee3a1b057c`) | Steps 4 and 6's `--deem` run wait. Steps 1 to 3 do not |
| sk-doc modes for the skill docs | Internal | Green | Step 7 waits |
| Local Deem server | External, operator-run | Green, served per `deem-local.md` | The `--deem` run prints its skip line |
| `jev` 0.6.2 and a credential for provider P | External, operator-held | Exercised once, by the live `--jev` run of 2026-09-29 on `jev 0.6.2`, provider `official` and model `jev-1.13.0`. Phase 002's session check found `jev auth status --provider official` exit 0 | The `--jev` run prints its skip line |
| `rg` on `PATH` or `SPECKIT_RG_BIN` | External | Green | The ripgrep baseline exits 2 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A test fails after merge, the script writes outside its report directory, or the operator drops the idea after a `stop` verdict.
- **Procedure**: Revert the phase's path-scoped commits: the script, its test, the retrieval README lines and the skill docs of spec section 3. Delete the operator-named report directory if it is inside the repository. Nothing else changed, so nothing else reverts.
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
Jev arm ──────────────────┘                                        │
                                                                   ▼
                                                  Skill docs ──► Review and commit
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Freshness | Phase 010 | Baselines |
| Test set | None | Baselines |
| Baselines | Freshness, Test set | Zero-call run, Verdict |
| Deem arm | Phase 008 | Verdict |
| Jev arm | None | Verdict |
| Verdict | Baselines, Deem arm, Jev arm | `--deem` run, `--jev` run |
| Skill docs | The runs, so no doc names a verdict that did not print | Review and commit |
| Review and commit | Skill docs, the vitest file | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | About 1 hour: freshness check and fixture corpus |
| Core Implementation | Med | About 5 to 7 hours: builder, baselines, both arms and verdict |
| Verification | Low | About 1 to 2 hours: vitest and the two runs |
| Skill docs and review | Low | About 1 to 2 hours: five sk-doc updates, the cross-family review and the commits |
| **Total** | | **About 8 to 12 hours (estimate)** |
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
2. Revert the phase's commits: the script, its test, the README lines and the skill docs.
3. Rerun the retrieval vitest suite and confirm the lookup's own tests still pass.
4. Tell the operator the narrowing measurement is withdrawn. Nothing user-facing changed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. Delete the operator-named report directory if it is inside the repository.
<!-- /ANCHOR:enhanced-rollback -->

---
