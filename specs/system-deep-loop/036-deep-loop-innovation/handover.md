---
title: "Handover: 036 Deep-Loop-Innovation Epic — completion roadmap"
description: "Epic-level resume doc: the 17-phase substrate is built, the 018-033 remediation tree is in progress, and the 014 authority cutover is the blocked crux. Sequenced path to close and merge."
trigger_phrases:
  - "036 epic next steps"
  - "deep-loop-innovation completion roadmap"
  - "resume WS1 remediation"
  - "014 authority cutover gate"
importance_tier: "critical"
contextType: "handover"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation"
    last_updated_at: "2026-08-08T02:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Containment safety fix + REQ-010 uniform + F-016-03 rejection LANDED 568aa17a40 (fixes 020's 3372513722 data-loss regression). Earlier this session: 033 corrected (1876f27e97), 026/027/030/032 completed docs (085baf6d29, 030 fabrication corrected). 028 docs reconciling to landed."
    next_safe_action: "Land reconciled 028 docs (uncommitted→568aa17a40). 028 has RESIDUAL P0 open (unrecoverable pre-edit baseline, rollback rehearsal, per-finding negative tests, per-mode artifact contract) — surfaced to operator. Then HOLD — 014 per-mode cutover is IRREVERSIBLE + operator-gated (F001/F002/F005 preconditions first); then 015/017/merge"
    blockers:
      - "014 authority cutover is IRREVERSIBLE + operator-gated (safety clause) — needs explicit go-ahead. Per-mode preconditions from the 016 verdict: (F001) wire an identityResolver at the gateway (dormant today); (F002) bind captured auth-state at the policy-registry level (harness-only today); (F005) close the loop-lock fresh-acquisition wx-open window. Rollback: each cutover is one git revert; ledger stays additive-dark until flipped."
      - "deepseek provider BANNED for this epic (operator directive). Build transport = cli-codex GPT-5.6-LUNA; Sonnet in-process agents (contention-immune) did 033, the tsc-gap fix, the doc-batch, and the 016 validation."
    key_files:
      - "016-whole-system-gate/review/pre-014-clearance-verdict.md"
      - "033-identity-and-lock-ownership-hardening/handover.md"
      - "024-durable-write-boundaries/review/lineages/luna/review-report.md"
    completion_pct: 95
    open_questions:
      - "RESOLVED 2026-08-08: 033 corrected + landed (1876f27e97). The docs described a hard-link/linkSync lock design that NEVER shipped; real code is rename+O_EXCL — atomic-state.ts F004 = rename-aside claim + existsSync-guarded renameSync CAS (no linkSync); loop-lock.ts F005 = openSync(lockPath,'wx') create-then-write, partial-record window still OPEN (a 014 precondition). F001/F002/F005 framed as per-mode 014 preconditions; F003/F004 cleared."
      - "SYSTEMATIC LANDING-GAP — fixed for 026/027/030/032 (@085baf6d29); 028 finalization in progress: the leak-guard lander lands ONLY named paths, so per-child CODE landed but the completed DOCS stayed in the worktree — origin showed 026/027/028/030/032 as stale 'Planned' scaffolds despite landed code. Fix = per un-landed child: validate + ground the cited landed commits + code cross-check the impl-summary, then land. 030 had a real fabrication (reverted F-028-01 sandbox-derivation described as landed) corrected before land. WHEN LANDING A CHILD, name ALL its docs, not just the code."
      - "Worktree quirk: .opencode/specs is a REAL DIR here but a SYMLINK on origin → land docs at the canonical top-level specs/ path (copy from .opencode/specs/ first), never .opencode/specs/. A fresh clone matching origin's layout avoids this."
    answered_questions:
      - "Spine 001-013 is built and landed; graph-metadata status labels are stale for landed children."
---

# Handover — 036 Deep-Loop-Innovation Epic

## Status: substrate built · remediation WS1 in progress · 014 cutover is the blocked crux

The epic is a **17-phase program (001-017)** building ONE convergent architecture — an
append-only typed event ledger behind a **fail-closed transition-authorization gateway**, with
sealed/frozen reference artifacts, replay fingerprints, receipts/certificates, and blinded
adjudication — landed **additive + dark**, authority cutting over **one mode at a time** behind
rollback windows. A **remediation tree (018-033)** was spawned by the validation-gate review that
**BLOCKED the 014 authority cutover**; WS1 lands those fixes so cutover can proceed.

> **Metadata warning:** many landed children show `planned`/`in_progress` in their
> `graph-metadata.json` — the labels are **stale**, not the truth. The phase map in `spec.md`
> §PHASE MAP and the ledger below are authoritative. Reconciling this staleness is step 2 below.

## Session update — 2026-08-08 (supersedes the stale "DEFERRED" ledger lines below for 030 & 033)

A systematic **landing-gap** was found and largely closed. The leak-guard lander lands only
**named** paths, so each child's CODE landed while its completed DOCS stayed in the worktree —
origin showed **026/027/028/030/032 as stale "Planned" scaffolds** despite landed code, and **033**
was under-landed (3 of 9 files) carrying hard-link/`linkSync` mechanism claims that never shipped.

Fixed + verified on `origin/skilled/v4.0.0.0` this session:
- **033 (`1876f27e97`)** — corrected every doc to the real code: `atomic-state.ts` F004 = rename-aside
  claim + `existsSync`-guarded `renameSync` CAS (NO `linkSync`); `loop-lock.ts` F005 = `openSync(...,'wx')`
  create-then-write, partial-record window **still OPEN** (a 014 precondition). F001/F002/F005 = per-mode
  014 preconditions; F003/F004 cleared. Landed the full honest 9-file set; post-land verified clean.
- **026/027/030/032 (`085baf6d29`)** — landed their completed docs; each validates --strict Errors 0.
  **030's** impl-summary had a real fabrication (the REVERTED F-028-01 sandbox-derivation described as
  landed) — corrected (sync-agents keeps `HISTORICAL_SETTINGS`, ai-council stays `workspace-write`,
  F-028-01 deferred). ⇒ the **"030 DEFERRED (minimax)"** and **"033 DEFERRED"** lines below are OBSOLETE.
- **028** — code landed (`d0d8623ddf`, 10/12; F-016-01/F-016-06 deferred) but spec was still "Planned"
  and checklist 0/51 template; finalization (status flip + honest checklist run) is in progress —
  the ONLY remaining WS1 doc-land item.

Lesson: a subagent "clean" is a hypothesis — the first correction agent's own grep missed 7 overclaims
(caught on my re-read), and the verification agent's `030` fabrication finding was re-confirmed against
code before acting. When landing a child, name ALL its docs, not just the code. 014 stays operator-gated.

### 028 P0 completion + a VERIFIED data-loss regression fixed (operator-directed, `568aa17a40`)

Finalizing 028 uncovered that it was NOT honestly Complete (its own P0 bar unmet) AND a real safety
regression in landed code. Escalated; operator chose "restore preserve + guard tests" and "build real
uniform containment", "complete the P0 work". Landed `568aa17a40`:
- **Data-loss fix:** `write-containment.ts` no longer `rmSync`-deletes unattributable untracked
  out-of-scope files (preserved as non-fatal advisories). This restores `6d762f4393` — made after a
  fan-out irreversibly deleted 12 untracked files (8 from unrelated work) — which `3372513722` (packet
  020, mislabeled "behavior-preserving") silently reverted and `d0d8623ddf` (028) cemented by INVERTING
  the guard tests. Guard tests restored (red-before/green-after).
- **REQ-010:** post-dispatch containment now runs for ALL dispatch kinds (was cli-codex-only), safe
  because unattributable writes are advisories not deletions; per-kind legit-write dirs excluded.
- **F-016-03:** explicit unenforceable cli-opencode sandbox now fails dispatch; unspecified → danger-full-access.
- Verified: tsc rc0 (authoritative runtime/ invocation — NOT a wrong-cwd tsc which false-reports TS5107/rc2);
  write-containment 18/18, fanout-run 102/102, combo-matrix 2/2, executor-audit 27/27, dispatch-receipts 26/26.

**028 RESIDUAL P0 still open** (this build did not touch; surfaced to operator): no pre-edit baseline was
ever captured (UNRECOVERABLE — cannot fabricate), rollback unrehearsed, several of the 10 landed findings
lack dedicated negative tests (incl. `findMissingLineageStateLog` dead code), per-mode artifact contract
(T005/T006) never built. So 028's spec Status is honestly "Complete (10/12 … residual QA items open)",
NOT a clean Complete. `016` gate (PATH step 2) should account for these residuals.

## The ledger (confirmed)

- **Spine 001-013 — BUILT + landed.** Research (001-002), census (003), architecture/transition
  contract (004), fan-out unblock (005), ledger core (006, dark), shared services (007),
  compat/shadow/rollback bridge (008), durable fan-in (009), novelty/convergence (010-011), mode
  contracts (012), and the 8 per-mode migrations (013).
- **014 authority cutover — BLOCKED** by the validation-gate review. The epic crux; WS1 de-risks it.
- **Remediation WS1 — landed on `origin/skilled/v4.0.0.0`:** 018, 021, 022/001-002, 024
  (`5c98e4654e`), 025/002-004. **Autonomous-loop additions:** Step-0 033-manifest (`79870daa10`),
  **019** runtime-code-readmes (`44cc6cdfc2`, 56 READMEs + 14 repairs), **020** sk-code-opencode-alignment
  (`3372513722`, 13 comment-only MODULE headers), **023** legacy-compat-event-vocabulary
  (`aa66365e78`, 6 upcasters + real-capture fixtures, T001 all confirmed + 1 sub-claim refuted).
  **026** alignment coverage/seal/lane (`ca64df3f55`+`ee8c4dd67a`+`c83c53d44c`+`1578d8533e`),
  **027** mode-gate & contract binding (`c6957eac3c`, 9 findings), **028** fanout-dispatch-integrity
  (`d0d8623ddf`, 10/12; F-016-01 yaml-argv + F-016-06 codex-env DEFERRED), **029** promotion/rollback/
  council receipts (`0d1827eef5`, 10/11; persist-artifacts cwd-confinement DEFERRED).
- **030 runtime-mirror/routing — DEFERRED (minimax build reverted):** mirror-sync-verify wrongly
  added `codex` to the checked-runtime set (broke 4 tests incl. a landed 029 test); hub-router
  mis-routed `/deep:command-benchmark` under alignment-aliases; sync-agents sandbox derivation
  unverified. Re-building on codex+LUNA. Brief: `/tmp/ks/build-036-030.md` (carries the 4 lessons).
- **TRANSPORT (operator directive):** the **deepseek provider is BANNED for this epic** — its API
  key went invalid mid-run and it produced low-quality builds. Build transport = **cli-codex
  GPT-5.6-LUNA max/fast** (contention cleared). NOT cli-opencode/deepseek, NOT minimax. Verify-then-land
  per child stays mandatory (each codex/opencode build so far shipped ≥1 bad finding caught + deferred).
- **033 identity/lock hardening — DEFERRED** (3 non-converged passes; the last hung on the full
  aggregate's shared-graph SQLite append-lock). Design docs + postmortem landed (`2c39edddd1`,
  status Blocked). Launch brief: `/tmp/ks/build-036-033-reattempt.md` (root-cause-first; the
  regen brief is ephemeral — reconstruct from `033/handover.md` if `/tmp` is gone).

## Pending (inferred — no impl-summary + the standing WS1 goal; verify at resume)

`026` alignment-coverage-integrity (NEXT — densest cluster, 15 confirmed findings, provability code) ·
`027` mode-gate-and-contract-binding · `028` fanout-dispatch-integrity · `029`
improvement-promotion-authority · `030` runtime-mirror-and-routing-parity · `031`
silent-failure-and-harness-repair · `032` docs-drift-and-p2-batch · then the `033` re-attempt.
(019/020/023 landed — see the ledger above.)

## Completion path (sequenced)

1. **Finish WS1 remediation** — build 019, 020, 023, 026→032 and re-attempt/land **033**. Each is
   a build → Sonnet adversarial verify (explicit `model:sonnet`) → leak-guard land cycle. These
   clear the findings that blocked 014.
2. **Reconcile stale metadata + parent validate debt** — run `generate-description.js` (2-arg:
   folder + repo-root) + `backfill-graph-metadata.js` across the landed 036 children so status is
   truthful. The parent also fails `validate.sh --strict` on **pre-existing** debt (not from this
   handover): (a) 033 is on disk but absent from the `validate.sh` declared child manifest (the 021
   hashed `001..032` set — extend to `033` and recompute its sha256); (b) parent `spec.md` is
   missing a `RELATED DOCUMENTS` section; (c) child predecessor/successor cross-refs are absent
   (018→019, 020→021, 032→033). Cheap, high-value.
3. **Re-run whole-system gate (016)** on a frozen SHA — prove remediations cleared the 014-blocking
   findings (mode gates, shadow parity, mixed-version replay, crash-injection, budget/receipt
   parity vs 003, blocking SOL review, recursive `validate.sh --strict`).
4. **Execute 014 cutover** — flip authority legacy→ledger one mode at a time, each behind a cutover
   certificate + rollback window. Then **015** legacy-writer retirement (only after zero-use telemetry).
5. **Closeout** — final **016** gate on the frozen SHA → **017** integrate-latest + reopen-on-drift
   + parent rollup + **merge to main**.
6. **Optional 034** runtime-lib modularization (scaffolded plan; explicitly *reorg-last*, after the
   lib-touching children land).

## Immediate next action (next session)

Quota-permitting, start with **step 2** (reconcile metadata — gives an accurate completion picture),
then resume WS1 at **026-alignment-coverage-integrity**, or re-attempt **033** first if you want the
hardening closed before the rest. Do NOT start a build on low quota — each child is a full
build+verify+land cycle and a mid-flight halt just leaves partial state.

## Key mechanics (carry-forward)

- **Executor policy:** GPT-5.6-LUNA MAX FAST for building (cli-codex/cli-opencode/cli-pi); keep a
  Sonnet adversarial pass (explicit `model:sonnet`) per child before land; serial dispatch.
- **Leak-guard lander:** `/tmp/ks/land-wt0129.sh <paths-file> <msg-file>` — seeds a temp index from
  fresh origin FETCH_HEAD, `git add -A` per named path, guards 0 deletions + all-under-prefix,
  commit-tree, braced push with `SPECKIT_ALLOW_REMOTE_PUSH=1`. Does NOT advance the local branch HEAD.
  List **specific files** as prefixes for a parent-scoped land (a folder prefix stages all children).
- **gh push:** active account must be `MichelKerkmeester` (`gh auth switch --user MichelKerkmeester`
  + `gh auth setup-git`); `michelkerkmeester-barter` has no push access (403). `skilled/v*` is allowlisted.
- **Env:** node = `/opt/homebrew/bin/node`; `export PATH="/opt/homebrew/bin:/usr/bin:/bin:$PATH"`
  AFTER any cd (chpwd clobbers PATH). Run runtime gates FROM `runtime/`: tsc =
  `../../system-spec-kit/node_modules/.bin/tsc`, vitest = `node_modules/.bin/vitest`. Wrong cwd =
  false-pass tsc (config-not-found emits no `error TS`) and vitest rc 127.
- **Runtime test traps:** `vitest.config` `fileParallelism:false` (shared graph SQLite) — never
  `--fileParallelism`; `git checkout -- database/` before isolation runs; better-sqlite3 ABI 141.
  **The full 168-file aggregate can hang on append-lock contention — run the per-mode matrix
  per-mode, not the whole suite in one process** (this is what killed the last 033 pass).
- **Landed-024 clean anchor + verification baseline:** commit `5c98e4654e`. Recover runtime with
  `git checkout 5c98e4654e -- runtime/lib runtime/tests` + `git clean -fd -- runtime/lib runtime/tests`.
  **VERIFY a build's changes against `5c98e4654e` (a real ancestor), NEVER `git diff FETCH_HEAD`** —
  the leak-guard lands via commit-tree without updating the local index, so origin-tracked files
  (landed READMEs, 024 code) false-report as spurious deletions/additions vs FETCH_HEAD (this
  false-alarmed a whole 020 verification pass before I traced it). A child's runtime `.ts`/fixture
  diff vs `5c98e4654e`, minus prior-child files, isolates its true change.
- **Shadow-parity/certificate suites HANG even in small groups** (append-lock), not just the full
  aggregate — but the ledger-schema/reducer/direct suites run fine. So verify a code child via its
  DIRECT suites + tsc + scoped diff; for the hang-prone shadow-parity/certificate suites you cannot
  cheaply re-run, rely on the build's per-mode-matrix claim (and its honesty signals — real
  SHA-documented fixtures, refuted sub-claims). This limits independent verification for the
  provability-heavy children (026 especially) — weigh it.
- **Headless deep-review:** direct `runtime/scripts/fanout-run.cjs --loop-type review
  --fanout-config-json '<cfg>'` with `AI_SESSION_CHILD=1 MK_SPEC_GATE_ENFORCE=0`
  (`opencode run --command deep/review` does NOT execute headlessly). Config + cost-cap details in
  `033/handover.md`.

## Confirmed vs inferred

- **Confirmed:** 024 landed clean; WS1 021/022/024/025 landed this session; 033 deferred; the
  001-017 phase map (from `spec.md` §PHASE MAP); 014 is the cutover gate.
- **Inferred (verify at resume):** which of 026-032/019/020/023 are truly unbuilt (graph labels are
  stale); the precise 014-blocked residual set; whether every 013 per-mode migration is fully green.
