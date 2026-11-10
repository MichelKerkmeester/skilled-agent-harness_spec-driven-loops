---
title: "Research Synthesis: Root causes, hardening and external-user experience of the sk-code Ponytail refinement epic (dsflash-llmgw lineage)"
description: "Ten-iteration synthesis over packet specs/sk-code/011-sk-code-poinytail-based-refinement: every process error traced to its producing mechanism, every named product issue confirmed or bounded, the external-user path read end to end, and eight small implementation phases ranked by external-user impact against cost."
trigger_phrases:
  - "root cause and ux research synthesis"
  - "ponytail epic process errors"
  - "external user experience framework"
importance_tier: "important"
contextType: "research"
---
# Research Synthesis: Root causes, hardening and external-user experience of the sk-code Ponytail refinement epic

**Lineage:** `dsflash-llmgw` (detached fan-out lineage). **Executor:** cli-pi, DeepSeek V4.1 Flash at max effort via the llmgateway route. **Iterations:** 10 of 10, stop policy `max-iterations`, stop reason `maxIterationsReached` (convergence telemetry only). **Question coverage:** 10 of 10 key questions answered. **Run id:** `fanout-dsflash-llmgw-1791657639979-xxbomr`. Every iteration was recorded through the append gateway (`.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs`), which refreshed `deep-research-state.jsonl` from the ledger; the rich per-iteration records live in `iteration-NNN-record.json` and `deltas/iter-NNN.jsonl`.

**Verification marks.** `[VERIFIED]` means the cited line was read or the cited command was run in this lineage, and the claim would have failed had it been false. `[INFERRED]` means the claim follows from cited evidence without a direct read or run, with the settling artifact or command named where one exists. The reader should note that CONFIRMED marks in the iteration files correspond to VERIFIED here.

---

## 1. Executive summary

The epic shipped and its machine guards are green, but three classes of debt remain, and all three trace to the same shape: **a producer and a consumer that must agree, with nothing that keeps them in step.**

1. **Part 1, process errors.** The duplicated tasks.md tail is the JavaScript replacement-pattern expansion of `$'` in a fix-unit insertion; the same class already shipped to users once in the changelog generator and the repo's fix is the canonical pattern (`nested-changelog.ts:572`). The link-scan error is a class whose guards exist in three scanners today; the specific incident is unrecorded. The wildcard `rm` and the committed regenerated scratch tree both stem from scratch holding run outputs and planner helpers in one namespace, with the packet's evidence-keeping convention committing regenerations beside their first generation. Claims-before-verification survives where tasks encode process steps whose only evidence is a report. Generated-artifact drift is a designed split (round-four D4): builders may not run the writers, so every child accumulates drift the orchestrator clears. The changelog version collision is a branch-local mint with no upstream read.

2. **Part 2, product issues.** The `jev-transport-single` canary defers because it is a stale case left in the hub the transport axis left; its successor lives in the cli-classifier fixture. The admission test fails exactly one test: `LIVE_CORPUS_SIZE` pins 80 against 86 live scenarios. The manifest suite's 16 failures trace to seven assertions pinning `all 6 hubs` while the tree serves seven. The advisor battery fails both aggregates (13 of 17, 2 of 5) because hub-owned tokens outrank intent tokens, and the advisor never passes `--surface-hint`, so multi-surface ties serve a fixed order. The hub `SKILL.md` carries 36 hard blockers (27 semicolons, 9 em dashes). The 500 ms hook deadline is silent on a late payload and has no late-write test. The reducer change is a correct deduplication whose measurement is 146 of 499 review folders changed, none raised. All eight named items are confirmed.

3. **Part 3, the external-user lens.** Setup is three commands and one verification, with a three-way Node-floor disagreement; a second clone's git hooks silently disable enforcement until trusted; generated-artifact recovery is unevenly discoverable; the pi dispatch guard refuses legitimate commands with a message that names nothing; a slow host loses hook payloads invisibly; version minting can collide at merge for a fork as well.

Eight phases follow, ranked by external-user impact against cost, each one file and one proving command, each checked against `.skilled/repo-rules/prevent-overengineering.md`'s reversal-cost order.

---

## 2. Scope and method

**Scope.** Read-only research over packet `specs/sk-code/011-sk-code-poinytail-based-refinement` children 001 to 011, the round-one to round-three research synthesis in `001-ponytail-deep-research/research/research.md`, every child implementation-summary Known Limitations and Deviations, every round goal.md log, and the current tree as the consumers of those records. No product file was modified; every artifact this run wrote is inside the lineage directory `specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/research/lineages/dsflash-llmgw`.

**Method.** Ten iterations, each with one focus no earlier iteration covered; packet records first for Part 1, then code and read-only runs for Part 2, then the front door and guards for Part 3. Runs performed, all read-only in repository terms: the compiled-route-admission suite (writes only to the OS temp dir), the HVR scanner, an in-memory re-implementation of the cli-external canary evaluation, the admission gold-corpus loader, and the voice scanner. One command was refused live by the pi dispatch guard and became evidence for Phase 5.

**Evidence standard.** Every finding in the iteration narratives carries `path:line` evidence, a CONFIRMED/INFERRED mark, a P0/P1/P2 by external-user impact, and a smallest fix. This synthesis keeps the same discipline at summary level and names the settling artifact where a claim stays INFERRED.

---

## 3. Part 1 — Process errors, each traced to its producing mechanism

### 3.1 (a) The duplicated tasks.md tail — `$'` as a replacement pattern

**Mechanism.** T050's check text ends `...It reports$' .skilled/...` (the `$` is a regex end-anchor before the closing quote). When the fix-unit insertion passed that text as the **string** replacement argument of `String.replace`, JavaScript read `$'` as a replacement pattern meaning "the portion of the string after the match", so the tasks.md tail was inserted a second time. The packet records the outcome and the cause verbatim; the trigger string survives in `fix-chain.json` and `fix-units.json`. [VERIFIED] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/goal.md:93] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/tasks.md:79] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/scratch/fix-chain.json:2]

**Prior art, same class.** The nested changelog generator already read `$'` or `$&` in a user-authored summary as a replacement pattern and "cut the summary short and pasted template text in its place"; the shipped fix is a single-pass replacer function with the durable comment naming both sequences. That is the canonical pattern to copy. [VERIFIED] [SOURCE: .skilled/skills/system-spec-kit/changelog/v2.1.3.0.md:14] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts:569]

**Gap.** `check-units.cjs` proves an edit unit's OLD span occurs once before the edit, but nothing compares the assembled tasks.md shape after insertion, so the doubled tail was found by reading. [VERIFIED] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/scratch/check-units.cjs:14]

**Smallest fix.** Pass a replacer function (`() => text`) in any helper that inserts authored text, and assert the expected line-count delta in the same helper. A repository-wide linter for `String.replace` call sites is rejected (see §7).

### 3.2 (b) The validator and link-shaped task text

**Mechanism class.** A scanner that resolves `](`-shaped text must blank fenced blocks and inline code spans first. The current tree guards this in three places: `check-markdown-links.cjs` blanks fences and spans and ships known-bad test rows ("inline-code link ignored", "real link on same line as inline code caught"); `heal-spec-docs.cjs`'s link-repoint lane skips fenced lines and blanks spans; the validator's anchor parser skips fences and blanks spans because "Matching inside code would read those examples as real anchors". [VERIFIED] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs:95] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs:130] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1244] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:601]

**In-packet specimen.** `002-surface-contract-alignment/tasks.md:65` carries the backticked regex `["']([^"']+)["']` whose bytes hold `"](`; a span-blind scanner reads link text `["']` and a target `([^"']+)["']`. [VERIFIED] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment/tasks.md:65]

**The incident itself is UNKNOWN.** No goal log, implementation summary or commit body names the validator run that produced it. What would settle it: that run's stderr, or the pre-repair tasks.md copy. [INFERRED: absence across every packet record searched]

**Smallest fix.** Keep the guards and their known-bad rows; if a fourth scanner appears, blank spans there. Nothing new is proposed.

### 3.3 (c) The reviewer wildcard `rm` and (d) the committed regenerated scratch tree

**Mechanism.** Disposable run outputs and planner helpers live in one `scratch/` namespace, so a wildcard cleanup cannot tell them apart; the executors' guards refuse `rm -rf` where configured (the round-one cli-codex run stopped because the command runner refuses it), and every later brief adds a do-not-delete rule aimed at the class. [VERIFIED] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/004-webflow-checker-fix/implementation-summary.md:71] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/003-codex-mirror-gate/tasks.md:39] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/scratch/build_tasks.py:116]

**The recorded artifact for (d).** The packet commits scratch as evidence, and one commit added three generations of one unit tree (`units/` 195 files, `units-extra/` 32, `units-extra2/` 8) with their generator scripts; nothing marks the authoritative generation. [VERIFIED] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs/scratch/gen_extra2.py:1]

**Both incidents are UNKNOWN as events**; the mechanisms are as above. Settling artifact: the run records that produced the deletion and the commit message that introduced the regenerated tree.

**Smallest fix.** Keep planner tools under a `tools/` child of scratch (or the existing `plan-`/`probe-` prefixes) and point cleanup rules at run outputs only; name regenerated generations distinctly. Convention, not machinery.

### 3.4 (e) Claims before verification

**Mechanism.** Tasks encode process steps whose only evidence is the executor's report; the parent rule correctly makes the executor's report a claim and has the orchestrator rerun **goal criteria**, which cannot recheck "read these contracts" or "capture before-state". Recorded instances: a skipped Phase 1 with no before files; "before state was not captured by the builder"; "builder captured no before-state files"; "Task T009 has no build report … did not name the authoring contracts they read". [VERIFIED] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/spec.md:87] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/005-opencode-and-guards/goal.md:91] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/003-quality-mode/implementation-summary.md:76] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/001-review-canary-pins/implementation-summary.md:123]

**Smallest fix.** Mark a task process-only when its evidence is prose, and require one artifact per process claim (round four's "Contracts read" row shows the shape).

### 3.5 (f) Generated-artifact drift

**Mechanism (design).** Round-four decision D4: "Builders never run the Hermes generator or a compiled-route re-mint in write mode; the orchestrator runs each once after the builds", because parallel children share the generated tree. Every child therefore logs a PENDING-ORCHESTRATOR block (Hermes `DRIFT sk-code`; compiled-route `sk-code stale-manifest … Re-mint: sk-code`) and the orchestrator clears each after the builds. [VERIFIED] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/goal.md:50] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/goal.md:113] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/001-review-canary-pins/goal.md:91]

**Inventory (five families, one more than the brief names).** Hermes skill copies (70); Codex/Pi agent mirrors; the compiled-route manifest plus its authored archive copy; the leaf manifest; the trigger index **and its retrieval fixtures**, which surfaced at merge (the merge commit's own body records rebuilding "the Hermes copy, the trigger index and its retrieval fixtures from the merged sources"; commit `144b1d339e`). The leaf-manifest defect inside this family was real and fixed: the walk listed git-ignored files, so a Python test run made a committed manifest look stale. [VERIFIED] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/002-leaf-generator-ignores/implementation-summary.md:69]

**Smallest fix.** No new generator; keep the split, and let the existing gate messages carry the recovery (they mostly do). Add the retrieval-fixtures row where the family is documented.

### 3.6 (g) The changelog version collision

**Mechanism.** Main minted system-spec-kit `v2.7.1.0` for repairs/upgrades while the epic branch minted its own `v2.7.1.0` for the hook deadlines; the merge (commit `144b1d339e`) kept main's note and folded the branch's into `v2.7.2.0`. The version is minted from the local changelog folder and `nested-changelog.ts` has no exists/duplicate/upstream check, so two branches forked before the other's mint both pick the same number. [VERIFIED] [SOURCE: .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md:18] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts:1]

**Smallest fix.** One contract rule plus a read of `origin/main`'s changelog before minting. A reservation service is rejected (see §7).

---

## 4. Part 2 — Open product issues

| # | Issue | Root cause | Evidence | Status |
|---|-------|-----------|----------|--------|
| 2.1 | `jev-transport-single` canary defers | Stale case left in the cli-external fixture after the transport axis moved to the cli-classifier hub; the successor `jev-choice-single` covers the same prompt there | Run of the fixture evaluation returned `defer`/`no-match` vs expected route; `mode-registry.json:8`; both fixtures | VERIFIED |
| 2.2 | `LIVE_CORPUS_SIZE 80` vs 86 | A deliberate change-detector pin not updated when scenarios were added; suite fails 1 of 29 | Read-only run: `tests 29, pass 28, fail 1`, `actual: 86, expected: 80` | VERIFIED |
| 2.3 | Manifest tests 26 pass / 16 fail | Seven assertions pin `all 6 hubs resolve` while `HUBS` has 7 entries (sk-design added 2026-09-22; test unchanged since 09-20) | `compiled-route-manifest.test.cjs:162,461,474,505,651,881,899`; `compiled-route-sync.cjs:51,1020`; recorded 26/16 over 42 tests | VERIFIED (pinned text and timeline); INFERRED (that these sites account for all 16) |
| 2.4 | Advisor battery 13 of 17, 2 of 5 false positives | Hub-owned tokens in the prompt outrank intent tokens; the battery's own triage names the shape | Recorded run tsv (P1→cli-external, P4→system-deep-loop, P11→system-spec-kit, P15→sk-doc; N1, N5→sk-code); rule at `advisor-probe-battery.md:60` | VERIFIED |
| 2.5 | Advisor never passes `--surface-hint` | The handler spawns the front door with only `--hub` and `--prompt-stdin`; without the hint the engine serves the compiled tie order (OPENCODE > OBSIDIAN > WEBFLOW) | `advisor-recommend.ts:372`; `compiled-route.cjs:36`; engine comment at `compiled-route.cjs:99` | VERIFIED |
| 2.6 | 36 HVR hard blockers in `sk-code/SKILL.md` | 27 semicolons and 9 em dashes left while other files were swept to zero | `hvr_scan.py` -> `x27 hard punctuation ;`, `x9 hard punctuation —`, `hard blockers: 36` | VERIFIED |
| 2.7 | 500 ms hook deadline, no late-write test | The suite writes payloads at spawn, so a post-deadline write is untested; the child records the loss | `hook-stdin-deadline.test.mjs:116,225`; 011/007 Known Limitation 2 | VERIFIED |
| 2.8 | Reducer change lowered open findings in 146 folders | Deduplication: F### narrative findings restating structured rows counted twice; the new rule yields numbered findings to their run and F### only to a same-id row. Measured `dirs=499 same=310 changed=146 raised=0 liveErrors=43`; the first draft over-dropped 15 findings in 3 folders and the review restored them | Three probe outputs; `reduce-state.cjs:1002-1004`; changelog v1.9.4.0 | VERIFIED |

---

## 5. Part 3 — The external-user lens

1. **Setup is short and verified.** Clone; `npm --prefix .skilled/skills/system-spec-kit install`; install and build the advisor runtime; verify with `skill-advisor.cjs list-tools --format json`. [VERIFIED] [SOURCE: README.md:154]
2. **The Node floor contradicts itself.** README says 20.11+ (22.12+ for the CLI); the package engines say `>=20.11.0`; the lockfile npm enforces says `^20.19.0 || >=22.12.0`. A user on 20.11–20.18 installs dependencies that declare them unsupported. [VERIFIED] [SOURCE: README.md:160] [SOURCE: .skilled/skills/system-spec-kit/package.json:11] [SOURCE: .skilled/package-lock.json:200]
3. **Git hooks silently disable in a second clone.** The machine-wide hooks run only where the repo shares the installer's git common dir or sets `skilled.trustRepoHooks true`; untrusted repos run nothing and print nothing by design. Only the README and the installer mention the trust command. [VERIFIED] [SOURCE: .skilled/scripts/git-hooks/pre-commit:44] [SOURCE: README.md:197]
4. **Generated-artifact recovery is uneven.** `/doctor:speckit` and `/doctor:runtime-mirrors` name their repairs, the pre-commit gate auto-re-mints compiled-route manifests; the compiled-route family is absent from the README, so an adopter meets it through a gate message that does carry the re-mint command. [VERIFIED] [SOURCE: README.md:1254] [SOURCE: README.md:1269]
5. **Half-applied recovery is designed.** `/doctor:update` exposes rollback; an apply on uncommitted files keeps before-images in the git directory; a stale manifest stops the apply rather than overwriting; refusals are recorded per packet. Crash recovery for loops is ledger-based. [VERIFIED] [SOURCE: README.md:1283] [SOURCE: .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:58]
6. **Hook timing on slower hosts is a silent loss.** A payload written after the short deadline is dropped and the hook takes its empty answer; nothing records it, and the value is an unmeasured judgment. [VERIFIED] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/implementation-summary.md:4]
7. **Routing surprises** are the advisor path-owner pull (§4.4) and the unpassed surface hint (§4.5), both documented where the user is not looking.
8. **Error messages are bimodal.** Exemplary: the compiled-route guard's re-mint line, the doc-claims usage error, doctor routes, gateway refusal codes. Outlier, observed live: the pi guard's "the command does not prove one direct executor" names neither the offending nor the acceptable shape, while its sibling branch says what to do. [VERIFIED] [SOURCE: .skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:249]
9. **Version collisions are not fork-proof.** The mint is local and unchecked, so a long-lived fork branch meets the same collision at merge. [VERIFIED] [SOURCE: .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md:18]

---

## 6. Findings table (ranked by external-user impact against cost)

| Rank | Finding | Severity | Key evidence | Fix shape |
|---|---|---|---|---|
| 1 | Advisor multi-surface ties serve a fixed order because `--surface-hint` is unpassed | P1 | `advisor-recommend.ts:372` | One argument at an existing call |
| 2 | Manifest suite pins 6 hubs against 7 (16 red tests) | P1 | `compiled-route-manifest.test.cjs:162` | One count-agnostic regex |
| 3 | Admission suite pins 80 scenarios against 86 | P1 | `compiled-route-admission.test.cjs:32` | One constant + baseline rerun |
| 4 | Stale `jev-transport-single` canary defers permanently | P1 | cli-external fixture `:201` | Delete one case (successor exists) |
| 5 | Pi guard refuses with an unactionable message | P1 | `dispatch-preflight-lint.ts:249` | One clause in one string |
| 6 | Git hooks silently off in untrusted clones | P1 | `pre-commit:44` | One stderr line in an existing branch |
| 7 | Late hook payloads dropped silently, untested | P1 | `hook-stdin-deadline.test.mjs:225` | One test case; semantics then decided |
| 8 | Node floor three-way disagreement | P2 | `package.json:11` | Two values aligned |
| 9 | Replacement-pattern `$'` class not uniformly guarded | P1 class | `nested-changelog.ts:569`, `005/goal.md:93` | Copy the existing replacer pattern |
| 10 | Version mint unchecked against upstream | P1 | `v2.7.2.0.md:18` | Contract rule + upstream read |
| 11 | Advisor battery fails both aggregates | P1 | recorded tsv; rule `:60` | Owner decision on signal additions |
| 12 | 36 HVR blockers in the hub SKILL.md | P2 | scanner output | One punctuation sweep |
| 13 | 43 of 499 review folders error during reduction | P2 | probe `liveErrors=43` | Print one named failure in the probe |
| 14 | Archived route-gold stale (9 vs 18 cases) | P2 | archive vs fixture | One refresh or a frozen note |
| 15 | F### restatement under another id double-counts | P2 | `reduce-state.cjs:1003` | Reader-side tolerance |
| 16 | Quality playbook has no Obsidian scenario | P2 | playbook dir search | One scenario file |

Severity is by external-user impact: a user can observe ranks 1–12 failing (rank 13–16 are archive/coverage hygiene). Full per-finding narratives with CONFIRMED marks live in `iterations/iteration-001.md` to `iteration-010.md` and the delta files.

---

## 7. Rejected Ideas

Each idea below was rejected because the smallest complete fix already exists, or because the addition would have no failing caller today (the prevent-overengineering record).

| Idea | Where it would go | Why rejected |
|---|---|---|
| Repository-wide `String.replace` linter | new checker | Both known sites are fixed; no current failing caller; regex maintenance with false positives |
| Scratch-lifecycle manager | packet tooling | The convention exists; naming, not machinery, is the gap |
| Version-reservation service or changelog lock | release tooling | Rare collision; both sides can read `origin/main`; adds a dependency and a failure mode |
| Residual tracker file | packet docs | The summaries and this synthesis already hold the list; a second copy drifts |
| Cross-suite pin registry | test tooling | Three literals are cheaper to fix directly; the registry has no caller once fixed |
| Guided installer wrapper | setup tooling | The commands are idempotent and copy-pasteable; a wrapper duplicates npm and adds a surface |
| Intent-beats-artifact scoring mode or path-stripping preprocessor | advisor | Paths are legitimate targets when they are the work item; the signal list and the hint already cover the gap |
| Per-hook telemetry counter for dropped payloads | hooks | Needs a measured host latency and a test first; adds state to fail-open hooks |
| Shared message template for all guards | guards | The exemplary messages differ by context; a template would flatten gateway reason codes |
| Deadline config option per host | hooks | No host exposes its write latency or budget; the option would have no input |
| Rewriting existing review registries on upgrade | reducer | Derived state; recomputed on next run; changelog says no migration required |

**Deferred (not rejected):** the HVR sweep behind the P1 phases; advisor battery signal additions behind an owner decision; first-byte deadline semantics behind Phase 7's test and a measured latency; the P2 residuals from §6 ranks 13–16.

---

## 8. Proposed Implementation Phases

Ranked by external-user impact against cost. Each phase is small, names the one file it changes, and the command that would prove it.

1. **Pass the session surface hint at the advisor's compiled-route call.** File: `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts`. Change: add `--surface-hint` to the existing spawn, using the detection contract the hub already publishes. Prove: the advisor compiled-route handler suite (`.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts`) plus the existing `compiled-route-surface-hint.test.cjs`. Reversal cost: one line.
2. **De-pin the hub count in the compiled-route manifest test.** File: `.skilled/bin/tests/compiled-route-manifest.test.cjs`. Change: `all 6 hubs` → the count-agnostic `all \d+ hubs` at seven sites. Prove: `node --test .skilled/bin/tests/compiled-route-manifest.test.cjs`.
3. **Re-pin the live corpus count.** File: `.skilled/bin/tests/compiled-route-admission.test.cjs`. Change: `LIVE_CORPUS_SIZE` 80 → 86; rerun the baseline report the comment names. Prove: `node --test .skilled/bin/tests/compiled-route-admission.test.cjs` (expect `tests 29`, `pass 29`, `fail 0`).
4. **Remove the stale `jev-transport-single` case.** File: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json`. Change: delete the case; `jev-choice-single` in the cli-classifier fixture covers the prompt. Prove: the hub's canary harness evaluating the fixture.
5. **Give the pi denial a next step.** File: `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts`. Change: one clause naming what makes a command direct, mirroring the sibling branch. Prove: a focused `shouldDenyPiDispatch` case asserting the new text.
6. **Surface the git-hooks trust state.** File: `.skilled/scripts/git-hooks/pre-commit`. Change: in the untrusted branch, when the repo carries its own installer, print one stderr line naming `git config --local skilled.trustRepoHooks true`. Prove: `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` with untrusted-toolchain and foreign-repo cases.
7. **Pin the late-write loss with one test.** File: `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs`. Change: write a short-deadline payload after ~800 ms and assert the observed outcome. Prove: `node --test .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs`.
8. **Align the Node floor.** File: `.skilled/skills/system-spec-kit/package.json` (README line as the doc half). Change: `engines.node` to `^20.19.0 || >=22.12.0`. Prove: `npm --prefix .skilled/skills/system-spec-kit install --dry-run` below the floor reports the engine refusal; a supported Node installs.

Phases 1 to 7 each fix a user-observable failure confirmed in this run; Phase 8 removes a first-command contradiction. None adds a module, option or dependency.

---

## 9. Convergence report

- **Stop reason:** `maxIterationsReached` under stop policy `max-iterations`. Convergence was telemetry only and was never claimed.
- **Iterations:** 10 of 10. Every iteration record carries `target_agent: deep-research`, `agent_definition_loaded: true`, `mode: research` and status `complete`.
- **newInfoRatio trend:** 0.90, 0.85, 0.90, 0.85, 0.88, 0.90, 0.82, 0.80, 0.70, 0.60 — mean 0.82, never near the 0.05 threshold; the decline reflects consolidation, not saturation of new evidence.
- **Findings per iteration:** 6, 6, 5, 5, 4, 4, 5, 5, 5, 8 (the last being the eight phase proposals).
- **Questions answered:** 10 of 10 (Q1–Q10).
- **Gateway:** 10 canonical `type=iteration` records plus one `run_initialized`, each appended through `append-mode-event.cjs`; the terminal `synthesis_complete` event carries `stopReason: maxIterationsReached`.
- **Write boundary:** every artifact under the lineage directory; the parent packet's writeback and strict validation belong to the orchestrator. The gateway's own ledger and projection writes inside the run directory are its contract.
- **Saturated directions:** Part 1 process errors (iterations 1–2); the test/canary cluster (3); the advisor cluster (4); blockers and deadlines (5); the reducer dedup (6); the external-user lens (7–8); residual sweep (9); consolidation (10).
- **Settling artifacts for the three UNKNOWN incidents:** the failing validator's stderr or pre-repair tasks.md for (b); the run records for the `rm` (c) and the introducing commit for the regenerated tree (d).

---

## 10. Sources

**Packet records:** children 001 to 011 under `specs/sk-code/011-sk-code-poinytail-based-refinement/` — goal logs, implementation summaries, plan/spec/tasks where cited, and scratch probes; `001-ponytail-deep-research/research/research.md` (rounds one to three) and the r2/r3 lineage reports; the merge commit `144b1d339e` and the epic's worktree commit history.

**Tree:** `.skilled/bin/tests/compiled-route-{admission,manifest,front-door,surface-hint}.test.cjs`; `.skilled/bin/compiled-route{,-guard,-sync,-admission,-manifest}.cjs`; `.skilled/bin/lib/compiled-routing/**`; `.skilled/skills/system-spec-kit/runtime/{scripts,lib,hooks}/**`; `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts`; `.skilled/skills/sk-code/**`; `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts`; `.skilled/scripts/git-hooks/{pre-commit,tests}`; `.skilled/repo-rules/prevent-overengineering.md`; `README.md`.

**Changelogs consulted:** system-spec-kit v2.1.3.0, v2.7.1.0, v2.7.2.0; deep-loop-runtime v1.9.4.0.

**Iteration artifacts:** `iterations/iteration-001.md` to `iteration-010.md`, `iteration-0NN-record.json`, `deltas/iter-0NN.jsonl`, `deep-research-state.jsonl`, `findings-registry.json`, `resource-map.md`.
