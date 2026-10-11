---
title: "Review Report: T2 remediation commits"
description: "Five-iteration deep review of commits fde8a56d87..8e1be919a4. One P1 and two P2 findings hold against the range after a rerun; two more confirmed defects predate it."
trigger_phrases:
  - "remediation deep review report"
importance_tier: "normal"
contextType: "review"
---
# Review Report: T2 remediation commits

## 1. Verdict

**CONDITIONAL.** Every fix does what its commit message says, and every regression gate is green. One fix is incomplete: the cli-classifier rebuild now traces, but it would publish an authored canary fixture that fails its own gold. Two wording problems sit in the new Pi denial text.

| Severity | In the range | Predating the range |
|----------|-------------:|--------------------:|
| P0 | 0 | 0 |
| P1 | 1 | 1 |
| P2 | 2 | 1 |

## 2. How It Ran

- `/deep:review :auto`, `--max-iterations=5 --stop-policy=max-iterations`, executor cli-pi `deepseek-v4.1-flash` at `max` on llmgateway (DevPass). The run went through the workflow's fan-out step with one lineage, `review/lineages/dsflash-llmgw`, as this packet's research run did. It ran 21:19Z to 21:40Z, 5 iteration records, merge verdict CONDITIONAL, containment advisory 0. DevPass never hit its limit, so no cline-pass switch.
- The lineage reported 3 P1 and 1 P2. Each was treated as a hypothesis: the synthesizer reran the probe or read the line before keeping it, and re-ranked it by whether the reviewed commits introduced it.

## 3. Confirmed Findings Against the Range

### P1-1. The authored cli-classifier fixture still carries the removed cli-deem cases, so the next rebuild publishes a failing fixture

- **Where**: `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json:70` (`deem-choice-single`, expects mode `cli-deem`) and `:107` (`deem-verb-narrowness`). Phase 001, commit `fde8a56d87`.
- **Evidence**:
  - `diff` of the authored fixture against `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json` shows both deem cases only on the authored side; the served side has `classifier-verb-narrowness` instead.
  - Comparing every one of the 55 files `compiled-route-sync.cjs --check` traces, authored against served, finds exactly one that differs: this fixture.
  - The build copies every traced authored file byte for byte (`.skilled/bin/compiled-route-sync.cjs:806`, `fs.copyFileSync(abs, dest)`), while `check()` (`:997-1021`) only traces and compares no content, which is why `--check` exit 0 and the guard's "all hubs fresh" both miss it.
  - Running the hub canary script over the authored tree, which is what a rebuild serves: hubs 001 to 007 report 0 failures, then cli-classifier throws `Error: gold mismatch for deem-choice-single: action defer but expected route` (`GOLD_MISMATCH`), exit 1.
- **Why it matters**: phase 001 exists so an adopter's documented rebuild works. The rebuild now resolves all 7 hubs, then serves a classifier fixture that breaks `all hub canaries`. Phase 001's summary says the fix "made the authored and served copies identical"; that holds for the harness, not for the closure.
- **Smallest fix**: `cp .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json`. Proof: `cmp` exits 0, and the canary script run over the authored tree prints `all hubs failures 0`.

### P2-1. The new denial text forbids a literal path, which the guard accepts

- **Where**: `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:252`. Phase 004, commit `7cd3e8e5db`.
- **Evidence**: the message says "not through a variable, alias or path". `inspectDispatch` classifies `/Users/x/.local/bin/pi -p task`, `~/bin/pi -p task` and `./node_modules/.bin/codex exec task` as `direct`; only the variable forms (`"$HOME/bin/pi" -p task`, `$(which pi) -p task`) are `ambiguous`.
- **Smallest fix**: drop the word: "not through a variable or alias". The test at `dispatch-preflight-lint.test.ts` asserts only the leading phrase, so it keeps passing.

### P2-2. The ambiguous denial fires on commands that dispatch nothing, and the new text sends those callers the wrong way

- **Where**: the in-range part is the text at `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:252`. Its cause is `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:260`, where any expanded token plus any `-p`/`--print` token makes a candidate, and `shouldDenyPiDispatch` denies every `ambiguous` result (`dispatch-preflight-lint.ts:185`). That classifier dates from commit `330427cf30` (2026-09-17), outside the range.
- **Evidence**: `mkdir -p "$DIR"`, `cp -p "$SRC" "$DST"` and `node -p "$EXPR"` all classify `ambiguous`; `mkdir -p specs/x` classifies `none`. The lineage hit this live: its own `mkdir -p "$LIN/prompts" ...` was blocked with the new message.
- **Smallest fix**: at the source, count an expanded token as a variable executor only in command position (`tokens[0]`), with one negative test for `mkdir -p "$DIR"`. Until then, the text can say a `-p` flag next to a shell variable trips the guard.

## 4. Confirmed Defects That Predate the Range

These hold on a rerun but no reviewed commit introduced them. They belong to whoever owns the dispatch guard.

- **P1, Pi guard misses shell `-c` wrappers.** `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:235` calls `inspectDispatch`, which returns `none` for `bash -c 'devin -p task'`, `sh -c 'opencode run task'` and `zsh -c 'codex exec task'`, so the call runs with no authorization check and no hard rules. `resolveDispatchPacket` in the same module maps all three to their executor, and the Claude, Codex and Devin adapters already use it. Line last changed 2026-08-05. Smallest fix: unwrap `SHELL_WRAPPER` payloads inside `inspectDispatch`, with one test per wrapper.
- **P2, docs promise wrappers are ambiguous.** `.skilled/skills/cli-external-orchestration/feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md:21` and `.skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md:28` say wrapper forms classify `ambiguous`; shell `-c` wrappers classify `none`. Fix together with the P1 above.

## 5. Refuted or Clean

| Candidate | Result |
|-----------|--------|
| `HUB_COUNT = sync.HUBS.length` makes the manifest test tautological | Refuted. `resolver.DEFAULT_ON_HUBS` is a separate hardcoded set (`.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:37`), and the suite asserts its size equals `HUB_COUNT`, so a dropped hub still fails |
| `LIVE_CORPUS_SIZE = 86` is wrong | Refuted. Admission suite 29 of 29 |
| Removing `jev-transport-single` loses coverage | Refuted. cli-classifier's `jev-choice-single` routes the identical prompt to `cli-jev`; both cli-external fixture copies are byte-identical |
| README `Node.js 20.19+` is wrong | Not a finding. The floor comes from rolldown and vite in the advisor lockfile (`^20.19.0 \|\| >=22.12.0`); both are dev dependencies of vitest, so npm warns below it rather than fails. The README's own "22.12+ for the spec-kit runtime CLI" covers the 22.0 to 22.11 gap |
| A new test passes without its fix | Refuted for all four. 004: the pre-fix source holds 0 matches for the asserted phrase. 006: a payload written at 100 ms is forwarded (`{"received":{"prompt":"early prompt"}}`), so the `{}` assertion fails on that mutant. 001 and 002: the phase records 26 of 42 and 28 of 29 before |
| Version or changelog drift | Clean. Canonical and Hermes `SKILL.md` read 2.7.2.1; `v2.7.2.1.md` validates with 0 issues; Hermes `--check` PASS, 70 in sync |
| Ephemeral labels in code comments | Clean. No spec path, phase number or id in any added code line |
| Overengineering | Clean. Each change edits a value, a string or one test helper option in place; no new module, option or dependency |

## 6. Regression Gates, Rerun by the Synthesizer

| Gate | Result |
|------|--------|
| `node .skilled/bin/compiled-route-sync.cjs --check` | exit 0, all 7 hubs resolve |
| `compiled-route-admission.test.cjs` | 29 of 29 |
| `compiled-route-front-door.test.cjs` | 1 of 1 |
| `compiled-route-manifest.test.cjs` | 42 of 42 |
| `compiled-route-surface-hint.test.cjs` | 6 of 6 |
| `all-canaries.cjs` over the served tree | `all hubs failures 0`, exit 0 |
| `compiled-route-guard.cjs` | exit 0, all hubs fresh or excused |
| `hook-stdin-deadline.test.mjs` | 40 of 40 |
| `vitest run dispatch-preflight-lint.test.ts` | 36 of 36 |
