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
    last_updated_at: "2026-08-07T03:18:09Z"
    last_updated_by: "claude-opus"
    recent_action: "landed WS1 019/020/023 + 033-manifest via autonomous loop"
    next_safe_action: "resume WS1 at child 026 (build-verify-land loop)"
    blockers:
      - "014 authority cutover blocked pending WS1 remediation clearing review findings"
    key_files:
      - "spec.md"
      - "033-identity-and-lock-ownership-hardening/handover.md"
      - "024-durable-write-boundaries/review/lineages/luna/review-report.md"
    completion_pct: 60
    open_questions:
      - "Which of 026-032/019/020/023 are truly unbuilt vs stale-labeled — verify at resume"
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
