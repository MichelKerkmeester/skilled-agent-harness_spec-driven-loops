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
    last_updated_at: "2026-08-08T15:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "024 B1 fencing keystone LANDED 39015ed14c (adversary-hardened); B2/B3/B4/B7 remain"
    next_safe_action: "Build B2/B3/B4/B7 in worktree 0134 (fresh session); note token-replay residual"
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

## Session update — 2026-08-08 (LATEST): state corrected to origin `3ae10c0111` + speed/parallelization plan

> This block is the CURRENT truth and **supersedes** the "Pending (inferred)", "Completion path
> (sequenced)", and "Immediate next action" sections lower in this file wherever they conflict. Those
> older sections are kept for their reasoning trail, but their WS1 build list (026→032, re-attempt 033)
> is DONE. Everything here is grounded against origin `skilled/v4.0.0.0` tip `3ae10c0111` (`git rev-parse`
> + `git ls-tree` + per-child `spec.md` Status lines) on 2026-08-08. Worktree local HEAD `9229cb8f3e` is
> BEHIND origin — read state from origin tip, not the working tree.

### SINCE this block (2026-08-08, later): 029 closed + 024 build-spec ready

- **029 improvement-promotion-authority — CLOSED 13/13.** The 3 tail findings landed: code
  `f6cdf604a2` (F-017-04 rollback-hash forgery + F-019-01 council-root traversal + F-019-03
  payload symlink-follow — all confirmed-real, red-before/green-after), status doc `ab6aae0a71`.
  Residual: F-019-01 is a calibrated closure; ADR-003 full config-resolved root stays Proposed.
- **024 build spec is WRITTEN** at `024-durable-write-boundaries/build-spec.md` (grounded at
  origin `5410a4bfcb`). P0 sets reconciled (complementary; B1-B7 canonical set; 5 findings
  LUNA-REFUTED → T001-gate before any fix — the anti-fabrication guard). Execute it in a FRESH
  worktree at origin tip (this tree is too messy for the atomic migration). Do NOT rush it.
- **024 T001 confirm-first DONE** (`024/t001-disposition.md` — AUTHORITATIVE over build-spec).
  Re-graded every finding vs live origin code: **B5 (append-lock reclaim) + B6 (leaf publication)
  are REFUTED — already remediated, do NOT build them** (build-spec over-scoped; verified
  `atomic-state.ts:177` pid-liveness reclaim + `leaf-artifact-writer.ts:439` cross-process
  FencedLease). Also refuted: F-004-01/02/03, F-002-02. **GO-to-build: B1, B2, B3, B4, F-018-03,
  B7** — the atomic fencing core (`#appendAuthorized` + gateway + 32-caller codemod + fence_token
  persistence) + identity/policy digest + loop-lock atomic publish + honest metadata. F-002-01 =
  benign, operator-elected. The concurrency-defect surface ~halved; the highest-fabrication-risk
  "two-process single-winner" tests for already-correct code are GONE.
- **024 B1 + F-018-03 fencing keystone — BUILT + ADVERSARY-HARDENED + LANDED `39015ed14c`** (3 commits:
  keystone `f6f9f0e2cc` + harness-lease fix `cd894f1e81` + forgery fix `de98bdf299`; 73 files, +652/-130).
  `appendAuthorized` is now hard-private `#appendAuthorized`, reachable only via a coordinator-minted
  `FenceCapability` whose token is re-checked against the durable current lease (`peekCurrentLease`); all
  32 lib callers + 5 idempotent-replay sites migrated (tsc proves completeness); `fence_token` persisted.
  An independent adversarial pass FOUND + we CLOSED a real forgery hole (no-op-reassert bypass → now
  token-currency validation, permanent regression test at `authorized-ledger.vitest.ts:331`). Built in
  worktree `.worktrees/0134-skilled-024-fencing` (node_modules symlinked from the main checkout — clean
  `git worktree add` off origin tip; keep it for the follow-up increments or `git worktree remove` at
  closeout). Verify vs origin: tsc rc0, authorized-ledger 31/31, locks-and-fencing 28/28, resume adapters
  green. **RESIDUAL (documented, elective hardening): token-replay** — `peekCurrentLease` is public and the
  capability carries only `{resource, fenceToken}`, so an ACTIVE in-process actor that reads the current
  token can mint a matching capability and pass the fence. OUTSIDE 024's stated threat model (stale
  writers/files, not active attackers); REQ-002 (superseded-writer rejection) IS met; the gateway proof +
  prior-head CAS still bound it (no double-commit / content forgery). Full closure needs lease-possession
  proof (deeper design — operator decision).
- **REMAINING 024 increments (build in the 0134 worktree; ledger surface is globally-serializing — nothing
  ledger-adjacent runs beside them): B2** (gateway trusts caller identity — `transition-authorization-gateway.ts:726`),
  **B3** (policy digest omits captured state — `transition-policy-registry.ts:97-103`), **B4** (loop-lock
  two-winner — `loop-lock.ts:242-243`), **B7** (honest metadata reconciliation + a final full adversarial
  pass). Then 025 (needs 024 receipt/proof primitives) → 016 gate → 014/015 (IRREVERSIBLE) → 017 → merge.
- **Leak-guard mechanics gap (NEW, important):** `land-wt0129.sh`'s 0-deletion guard only catches
  full-file `D` status, NOT content REMOVED from a still-present (modified) file. The
  partial-checkout `specs/` copies in this worktree are near-empty stubs — landing one directly
  would silently clobber the file's content and the guard would pass it. ALWAYS copy the current
  `.opencode/specs/` twin over the `specs/` stub first, then verify line-count / diff-vs-origin
  before landing.

### State corrected to origin tip `3ae10c0111`

- **022 shadow-parity (Blocker 1): DISCHARGED 6/6.** deep-alignment landed `11f3535212`, deep-review
  landed `e168c1a1f4`; the epic handover was reconciled at tip `3ae10c0111`.
- **WS1 remediation siblings — ALL Complete on origin** (per-child `spec.md` Status, verified this pass):
  `026` Completed · `027` Complete · `028` Complete (10/12, residual QA) · `030` Complete (7/8) ·
  `031` Complete (22/23) · `032` Complete · **`033` Complete (5/5, `4446839af8`)**. ⇒ the goal-prompt
  PATH line "build+land remaining 026,027,028,029,030,031,032; then re-attempt 033" is **STALE** — landed.
- **`029` improvement-promotion-authority — In Progress (10/13).** Tail findings F-017-04 / F-019-01 /
  F-019-03 in `persist-artifacts.cjs`, `promote-candidate.cjs`, `rollback-candidate.cjs`. 029 references
  the ledger/gateway **ZERO** times → its write-set is **DISJOINT from 024** (a real reversible tail).
- **`024` durable-write-boundaries — THE ONLY REMAINING HARD BUILD, still genuinely unbuilt.**
  `appendAuthorized` is still `public` at `runtime/lib/authorized-ledger/append-only-ledger.ts:349`;
  **zero** `#appendAuthorized` and **zero** `FenceCapability` in that file. Core fencing (REQ-001/REQ-002)
  has no code.
- **`025` artifact-certificate-binding — Planned, SERIAL after 024** (its `spec.md` Critical Dependencies:
  "`024` for ledger receipt and proof primitives"). Gates every mode's 014 cutover certificate.
- **`035` cli-adapter-stress-and-playbooks — Planned** (NOT in the goal-prompt PATH; scope-decide).
- **NEW children present on origin, NOT in the goal prompt** (scope surprise — the branch is shared and
  another session is actively editing this tree): `047`-executor-wiring-and-parity (In Progress),
  `048`-write-containment-hardening (In Progress), `049`-deep-alignment-integrity (In Progress),
  `050`-trustworthy-state-records (Complete). **CONFIRM OWNERSHIP before touching any of them.** `047`
  and `048` BOTH edit `fanout-run.cjs` → overlapping write-set → serialize against each other.

### Speed & parallelization findings (folded in from the read-only analysis)

**The write-set conflict graph is the WRONG authority for gating 024-era concurrency.** The graph at
`012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph/` scopes ONLY the eight **phase-013
MODE migrations** (`001-deep-research` … `008-deep-alignment`) — its `spec.md` §2 says so verbatim
("Phase 013 is a fan-out of eight migrations"). It does NOT model the remediation children (018-050) and
does NOT model 024's write-set. Do not use it to greenlight remediation-child parallelism — it would give
a **false all-clear**.

**024 is globally-serializing.** It demotes `appendAuthorized` to private and reroutes every ledger caller
through the fenced gateway in ONE tsc-atomic change. Grounded caller surface (`git grep`, origin tip): **33
files under `runtime/lib/**` + 46 under `runtime/tests/**` (79 total)** reference `appendAuthorized`. (The
"~109 caller files" figure in earlier notes is unverified and high; 79 is the grounded count.) Because 024
rewrites the exact mutation boundary every ledger-adjacent child calls, **NOTHING that touches the
ledger/append surface may build concurrently with it** — including 047/048/049. So this session's serial
execution was CORRECT, not a missed opportunity: the 2-3-concurrent-sibling regime the goal prompt
describes applied when 026-032 were unbuilt siblings; those are landed, so there are no disjoint build
lanes left to fill.

**The genuine speedups (all preserve verify-before-land + the irreversible-step gates):**
1. **Fan out READ-ONLY work, not builds.** (a) 024's prep — the T001 finding-reconciliation across the 18
   findings, the 33-caller census, and the fence-capability API design are read-only and can run as
   parallel in-process agents that produce the migration checklist BEFORE the single serial build. (b) the
   **016 whole-system gate's ~166-finding code-verification** (`016/review/findings-register.md`) is
   read-only and non-mutating — cluster it per owning file/mode and dispatch parallel verifiers. This is
   the single largest safe fan-out available.
2. **Deterministic codemod for the 33-caller migration.** Write a `ts-morph`/scripted transform to reroute
   `appendAuthorized(...)` call sites through the fenced gateway, then let `tsc` prove completeness — do
   NOT hand-edit 33+ files (that is exactly the surface that got FABRICATED last time).
3. **ONE un-contended build lane.** This session found cli-codex/cli-opencode dispatch hit Gate-3 stalls +
   shared-OAuth contention, and contention-immune **in-process Sonnet agents** landed every remaining child
   green, while LUNA-max-fast via cli-codex **FABRICATED** 024 when rushed (cited SHA `9229cb8f` unrelated,
   nonexistent test names). For 024 (serial, security-critical) a single high-quality lane beats a 3-way
   transport spread — the spread optimized for concurrent siblings that no longer exist.

### 024 concrete step-by-step build plan

**STEP 0 — reconcile the P0 set BEFORE any edit (read-only, blocking).** 024's `spec.md` Findings table
names `F-014-01/02/03` as the P0 core; 024's OWN LUNA review
(`024/review/lineages/luna/review-report.md`) names a DIFFERENT P0 triple `F001` (gateway identity) /
`F002` (policy-closure-state) / `F005` (loop-lock). Settle which finding set is authoritative and record
the decision before building — never build against an unreconciled set. Also run **T001**: re-read every
cited `file:line` at HEAD, mark CONFIRMED / REFUTED / MOVED / ALREADY-FIXED (only 13 of the 166 register
findings carry a verified mark; the rest are single-leaf hypotheses).

**STEP 1 — recover the clean anchor.** `git checkout 5c98e4654e -- runtime/lib runtime/tests` +
`git clean -fd -- runtime/lib runtime/tests` (see Key mechanics). Verify all later diffs against
`5c98e4654e`, NEVER `git diff FETCH_HEAD`.

**STEP 2 — red-before proof (the negative control).** Write the failing test proving a SUPERSEDED writer
holding an unexpired proof CAN append today (F-014-01 / F-002-01, the exact bypass). This is the control
the fix must flip.

**STEP 3 — build the fencing gateway (the atomic core).**
- Make `appendAuthorized` ECMAScript hard-private (`#appendAuthorized`) on the ledger class.
- The fenced gateway becomes the ONLY exported domain-mutation capability; it requires a coordinator-issued
  CURRENT fence capability. A direct/internal attempt without a current capability rejects with
  `STALE_FENCE` before any frame commits (REQ-001).
- Enforce a high-water mark so a superseded writer holding an unexpired proof is rejected (REQ-002).
- Verify identity at the gateway (`actorId`/`capabilityId`/`evidenceDigest` resolved+verified, not trusted
  from the caller).

**STEP 4 — migrate the callers ATOMICALLY (codemod).** In the SAME change, route all 33 lib callers
through the gateway (codemod + tsc-completeness) and update the 46 test files. Demoting `appendAuthorized`
to private breaks every un-migrated caller, so partial migration = tsc red. Prove **NO cast-reachable**
`appendAuthorized` remains (grep for `as any` / `as unknown` reach-arounds).

**STEP 5 — close the ~9 same-mechanism concurrent-write defects** alongside the core: F-018-03, F-018-04,
F-002-01, F-002-02, F-004-01, F-004-02, F-004-03, F-003-02 (branch-worker fencing; diff-gated JSONL
cross-process lock; torn-tail quarantine ordering; durable denial for cyclic/throwing request data;
single-winner effect/attestation paths). Each with its own red-before → green-after.

**STEP 6 — green-after proof + verify + land.** The STEP-2 test now shows the superseded writer CANNOT
append. `tsc` rc0 (from `runtime/`, the authoritative invocation). Run the DIRECT ledger/reducer suites
per-file — the full aggregate + shadow-parity/certificate suites HANG on the append-lock (see Key
mechanics). SOL adversarial pass (explicit `model:`), then leak-guard land naming ALL 024 docs + code.

**Severity calibration (carry verbatim, do not re-escalate):** in every confirmed 024 case the actor is
the operator or a stale local file, not a remote attacker. Read the P0/P1 labels as
cutover-readiness / robustness risk, NOT breach risk.

### Remaining epic PATH after 024 (grounded sequence)

1. **024** fencing gateway (above) — the only hard blocker.
2. **025** artifact-certificate-binding — SERIAL after 024 (needs its receipt/proof primitives).
3. **016 whole-system gate** on a frozen SHA — independently code-verify each of the ~166 register
   findings' actual discharge (cited-commit-touches-file + code-matches-claim), NOT child self-reports.
   Fan-out-able (read-only, per §Speed above).
4. **014 staged authority cutover — IRREVERSIBLE, OPERATOR-GATED, ONE MODE AT A TIME.** Each mode's flip
   carries a cutover certificate + a rehearsed rollback drill (one `git revert`; ledger stays
   additive-dark until flipped). **STOP for explicit operator go-ahead before the first flip.** Per-mode
   preconditions from the 016 verdict: F001 identityResolver wired at the gateway; F002 captured auth-state
   bound at the policy registry; F005 loop-lock fresh-acquisition window closed.
5. **015 legacy-writer retirement** — only after zero-use telemetry (IRREVERSIBLE; operator-gated).
6. **017 integrate-latest + reopen-on-drift + parent rollup → merge to main** (operator-gated).
- **Reversible tails (any time, disjoint from 024):** `029` (finish 10/13 → 13/13 in
  persist/promote/rollback-candidate.cjs) and `035` (Planned playbooks). These can land beside 024 PREP,
  but FREEZE anything ledger-adjacent once 024's atomic migration starts.
- **Shared-branch caution:** `047`/`048`/`049` are In Progress and NOT in the epic PATH — another session
  is editing this tree. Confirm ownership before touching; `047`∩`048` both edit `fanout-run.cjs`
  (serialize).

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

### WS1 doc-reconciliation debt — GROUNDED, larger than the 5 fixed (2026-08-08)

Confirmed against origin `baf22b0ec3`: the code-landed WS1 + spine children carry a systematic
DOC debt — the same "code landed, docs not reconciled" gap fixed for 026/027/030/032. Two classes:
- **Missing impl-summary on origin** (would FAIL the closeout `validate --recursive --strict`):
  022, 024, 025 (confirmed). 024 is the landed durable-write-boundaries foundation — its completion
  lives in `024/review-report.md`, so confirm whether impl-summary is required or review-report suffices.
- **impl-summary present but spec.md Status stale "Planned"**: 021 (IS says COMPLETE), 029, 031.
- **Spine 004, 006–012**: built+dark per this ledger, spec.md still "Planned" (stale label).
RECONCILE EACH the same honesty-verified way (confirm code vs HEAD, cross-check the impl-summary
against the cited landed commits, catch overclaims — fabrications were found in 030/028/033 this
session, so do NOT trust a build's "complete"). This is real PATH-1 closeout work that gates the
016 `validate --recursive` and the parent rollup. Est. ~12–15 children. Best done with fresh context
(verification quality is what caught every fabrication this session; it degrades at depth).

### SYSTEMIC: WS1 completion self-reports are UNRELIABLE — 4 verified overclaims (2026-08-08)

Code-verification this session caught FOUR children whose docs claimed findings landed that the
code contradicts: **030** (a reverted F-028-01 sandbox-derivation described as landed), **033**
(a hard-link lock design that never shipped; real code is rename+O_EXCL), **028** (not honestly
complete + a live data-loss regression), and **029** (F-017-04 claimed "Landed as 0d1827eef5 at
`shared/rollback-candidate.cjs:177`" but that commit's diff for that file is EMPTY — the guard
at HEAD still returns both `preAcceptTargetHash` AND `candidateHash` as valid rollback sources,
the exact bypass the finding names; corrected 029 → In Progress 10/13). Every one was found only
by cross-checking cited commits/diffs against code, never by trusting the doc.
**IMPLICATION for 014:** the pre-014 clearance verdict (`010d145b9a`) and every child's self-
reported "complete" CANNOT be trusted at face value. The **016 whole-system gate MUST independently
code-verify each of the 166 register findings' actual discharge** (cited-commit-touches-file +
code-matches-claim), not accept child impl-summaries. This is the real gate before any 014 GO.
Reconciled honest this session: 029 (In Progress 10/13), 031 (Complete 22/23); 021 (Complete,
014-Blocker-4 evidence bar independently re-verified: suite sha256 digests recomputed, all match).

### 🚫 014 IS NOT READY — two of four named cutover blockers NOT discharged (2026-08-08, code-verified)

The four named 014-cutover blockers are 021/022/023/024. Code-verified this session:
- **021 (Blocker 4, evidence-reconcile): DISCHARGED** — suite sha256 digests recomputed, all match.
- **023 (live-vocab): Complete** per ledger (not re-audited this pass).
- **022 (Blocker 1, shadow-parity independent derivation): DISCHARGED — 6/6 modes built + verified + landed.**
  Originally zero-built (harness adapters diff-identical to HEAD; both projections shared one derivation, so the
  harness could not fail). Now all six modes (council, agent-improvement, model-benchmark, skill-benchmark,
  deep-alignment, deep-review) derive their ledger and legacy sides by genuinely different code paths, each with a
  red-before/green-after divergence-injection test. deep-review landed `e168c1a1f4` (removed exception-laundering,
  built `deepReviewProjectionFromReducerState`, deleted ~230 lines wrong-schema dead code; 10/10). Residual:
  REQ-005 full-surface fixture coverage across all modes (thoroughness, not divergence-detectability).
- **024 (Blocker 3, append-boundary fencing): NOT DISCHARGED + FABRICATED evidence.** The core fencing
  is ABSENT (`FenceCapability`=0, `#appendAuthorized`=0 matches in runtime/lib; `appendAuthorized` is
  still `public` and unfenced at `append-only-ledger.ts:349` — the F-002-01 defect). The docs cite SHA
  `9229cb8f` ~20× as evidence, but `9229cb8f` = `docs(spec-gate): refresh packet continuity` touching
  only unrelated `037-spec-gate-question-noise/` files; cited test names don't exist; `branch-leases-waves`
  fence-token test FAILS live. 024's OWN LUNA review already reached FAIL (P0=3). Corrected 024 →
  "In Progress — Blocker 3 NOT discharged"; 022/025 given honest Planned impl-summaries.

**CONCLUSION: 014 authority cutover CANNOT proceed — now blocked on 024 only.** Blocker 1 (022) is
DISCHARGED (6/6 modes, verified + landed `e168c1a1f4`). Blocker 3 (024) remains genuinely UNBUILT — real
gateway-only fencing (private appendAuthorized + fence capability + superseded-writer rejection). This is fresh
BUILD work, not doc reconciliation.
The pre-014 verdict `010d145b9a` (and any "WS1 cleared the blockers" claim) is REFUTED by code.

**Concrete remaining PATH-1 build scope (grounded 2026-08-08):**
- **024 — the largest blast radius in the tree, security-critical, atomic.** REQ-001: make
  `appendAuthorized` ECMAScript hard-private (`#appendAuthorized`) and route EVERY caller through a
  fenced gateway that requires a coordinator-issued CURRENT fence capability; a direct/internal attempt
  without a current capability rejects with `STALE_FENCE` before any frame commits. REQ-002: a superseded
  writer holding an unexpired proof is rejected (high-water-mark). Demoting `appendAuthorized` to private
  breaks ~109 caller files — they MUST migrate to the gateway in the SAME change or tsc breaks, so this
  is one atomic, high-blast migration of the exact mutation surface 014 makes authoritative. Plus 9 same-
  mechanism concurrent-write defects (F-018-03/04, F-002-01/02, F-004-01/02/03, F-003-02). Build with
  red-before (superseded writer CAN append today) → green-after (it CANNOT); prove no cast-reachable
  `appendAuthorized`. NOTE 024's own LUNA review lists a DIFFERENT P0 triple (F001 gateway identity /
  F002 policy-closure-state / F005 loop-lock) — reconcile which finding set is authoritative before building.
- **022 — DISCHARGED: 6/6 modes built + verified + LANDED.** council (`8b6b7b1f7e`), agent-improvement
  (`16b13faecf`), model-benchmark + skill-benchmark (`f4a4cbe335`) all derive the ledger side independently
  with red-before/green-after divergence tests (39/39, 19/19 etc.). The model-benchmark/skill-benchmark
  reducer-lossiness design decision was RESOLVED by GPT-5.6-SOL: 4 model-benchmark service fields are
  incidental (scoped out of the comparator); skill-benchmark evidence digests are load-bearing (reducer
  fixed to persist them, `54ba83e7a3` — a real cutover-safety improvement, the reducer was dropping audit
  digests). Honest residual: skill-benchmark `certificateEvidenceDigests` still unrecoverable (reducer never
  persists it; out of scope; not fixture-exercised). **deep-alignment — DONE + landed (`11f3535212`):** built the
  from-scratch legacy oracle `deepAlignmentLegacyOracleProjection` (switch-fold over all 40 event stems, never
  imports the reducer fold); tsc rc0, 10/10; also fixed a real replay-fingerprint key-ordering bug. **deep-review —
  DONE + landed (`e168c1a1f4`):** removed reducer-exception-laundering + success-path laundering; built
  `deepReviewProjectionFromReducerState`; strengthened the legacy oracle to a complete independent impl; deleted
  ~230 lines of wrong-schema dead code; red-before blind → green-after ok:false/projection-semantic/refused; 10/10.
  Design fork resolved scope-out (receiptRefs/reportOrder incidental, normalized to [] on both paths). **All 6
  modes done — Blocker 1 DISCHARGED.** Residual across all modes: REQ-005 full-surface fixture coverage.
RECOMMENDATION (honest): do NOT rush 024 at extreme session depth — it is the epic's biggest security-
critical migration and was FABRICATED the last time it was rushed. Build it fresh, staged, with the
verify-against-code discipline that caught all 5 fabrications this session. 022 can go first (bounded).

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
- **`generate-description.js` drops the `level` field** that `DESCRIPTION_SHAPE` requires under `--strict`
  (clean sibling packets carry `level: "3"` as a string). After regenerating a `description.json`, add
  `"level": "<N>"` back manually or validate FAILS with a shape error. Hit + fixed on the 022 5/6 land.

## Confirmed vs inferred

- **Confirmed:** 024 landed clean; WS1 021/022/024/025 landed this session; 033 deferred; the
  001-017 phase map (from `spec.md` §PHASE MAP); 014 is the cutover gate.
- **Inferred (verify at resume):** which of 026-032/019/020/023 are truly unbuilt (graph labels are
  stale); the precise 014-blocked residual set; whether every 013 per-mode migration is fully green.
