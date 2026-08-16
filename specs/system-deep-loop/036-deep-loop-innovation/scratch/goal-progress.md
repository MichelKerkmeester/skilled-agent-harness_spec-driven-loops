# 036 Autonomous Execution — Progress & Resume Anchor

> Live progress for the autonomous two-model run driving the 036 tail. Pairs with `goal-prompt.md` (the operational
> contract) and `goal-plan-review.md` (the findings authority). Update as pieces land.

## Workspace
- **Worktree:** `.worktrees/0144-system-deep-loop-036-p0-remediation`, branch `system-deep-loop/0144-036-p0-remediation`,
  based at origin/skilled/v4.0.0.0 tip `ced5fe53cc1` (tsc rc0 baseline). NOTHING landed to `skilled/v4`; all work is local
  commits in 0144. Isolated from the moving shared branch and from worktrees 0091/0100/0101 and lanes 047-050 (other sessions).
- **Design artifact:** `<scratch>/036-run/design-f721-FINAL.md` (the F7/F2/F1 coupled architecture; if scratch is gone,
  it is summarized below and re-derivable from the packet design docs). Should be promoted into the packet as a decision-record at closeout.
- **Toolchain:** runtime node_modules symlinked from main; run gates from `runtime/`: tsc =
  `../../system-spec-kit/node_modules/.bin/tsc --noEmit -p tsconfig.json`; vitest per-file with `--configLoader runner --no-coverage`
  (never the aggregate — it hangs). `git checkout -- database/` between suites. After every codex build, `git checkout -- specs/`
  to sweep a tree-wide description.json regen a metadata daemon triggers (commit only named runtime paths).

## Findings ledger (goal-plan-review.md, 13 findings)
- **F5** ALREADY-FIXED (tsc break resolved pre-run).
- **F6** HANDLED-BY-DESIGN — permanent-lock rows are a deliberately-deferred PIN redesign, NOT a blockedRows===0 gate
  (that over-denies; hardening-notes.md:132-145). A naive fix was tried + reverted. Folded into piece 2's closure rule (committed dependents only).
- **F3** DONE + cross-confirmed SOUND — commit `cb1e6c621d`: mandatory verified evidence identity at the cutover consumer
  (not the generic gateway — 102-caller landmine).
- **F4** DONE + cross-confirmed SOUND — certified rollback-window execution receipts via the trusted-provider registry.
- **F1/F2/F7** = the coupled architecture chain, built as 4 design pieces:
  - **Piece 1 (F2 core)** DONE + cross-confirmed SOUND: one immutable `AuthorityTransactionCommitted` frame is the sole
    authority fact; in-lock `LedgerCommitGuard` (append-only-ledger.ts) does the head/state/epoch CAS before frame creation;
    registry demoted to a validated projection; mandatory genesis; selector reads a verified fold. Non-authority events unaffected.
  - **Piece 2 (F7 pt1)** DONE + cross-confirmed (commits `658c63fdc2` + fix `1e307046b9`): `AuthorityDependencyGraph`
    (common→3 variants) + `activeDependents` (committed new-authoritative only) + in-lock closure enforcement on rollback
    frames + census metadata. DeepSeek cross-check caught a real strand bug (closure checked set membership but not that
    each dependent's next.state exits to legacy); fixed by pinning the rollback state edge + a red-before control.
  - **Piece 3 (F7 pt2)** DONE + cross-confirmed SOUND (commit `0d0ad5c0b4`): context-bound partitioned improvement journal
    (`ImprovementJournalContext` unforgeable, internally-derived partitions, fenced sequence-CAS append, NO path API);
    every consumer + command asset migrated (incl. trade-off-detector); 0 remaining path callers. DeepSeek verified partition isolation.
  - **Piece 4 (F1)** DONE (commit `6d3ed95ebe`, cross-check in flight): `AuthorityRollbackCoordinator` + `rollback-switch-adapters`
    compose the 8 non-mutating switches onto the transaction + graph; reverse-topological, one atomic frame per closure,
    no rollback_pending record. Coordinator suite 14/14, per-mode 65/65, authorized-ledger 34/34, switches untouched, no live wiring.

## MILESTONE (2026-08-12): 10/13 FINDINGS CLOSED + PUSHED
All 7 P0s (F3, F4, coupled F1/F2/F7 pieces 1-4) + P1 F8 (cert evidence families, SOUND) + P1 F13 (017 baseline
000->phase-003 tuple) are committed and pushed to origin feature branch `system-deep-loop/0144-036-p0-remediation`
(11 commits, tip `51b319fc4c`). Every code finding is DeepSeek-cross-confirmed SOUND. NOTHING landed to skilled/v4 or main.

**Remaining: 4 spec-level P1s (post-frontier phase contracts), then the fresh review:**
- F9 (015 spec): closed-world consumer inventory — deployed binary/config hashes, API/queue/cache TTLs, scheduled/repair
  jobs, replay producers; drain/expire beyond dormancy; deny/tombstone for old writes; delayed N-1 + oldest-log canary before deletion.
- F10 (014/015 spec): integration freeze/merge-train BEFORE the first irreversible CAS; reconcile origin + invalidate certs
  on drift before each flip; freeze shared surfaces through 015; a fresh integration before deletion (017 stays final recensus).
- F11 (016 spec): Stage-B authority-lifecycle matrix — rolling N-1/N, partial orders, shared-backend concurrency, forward/
  reverse crash boundaries, restart/reconciliation, stale-writer rejection, window closure, post-retirement replay + signal positive controls.
- F12 (016/017 spec): final validation from a fresh DETACHED checkout; assert every canonical/twin input tracked; record
  git status/ls-files/tree-hash + digest/topology in the SOL receipt.
## MILESTONE (2026-08-12): ALL 13 FINDINGS CLOSED + PUSHED
F9/F10 (015 spec REQ-011/012), F11/F12 (016 spec REQ-013/014), F13 (017 baseline) all committed with reconciled
generated metadata (regen description.json + backfill graph-metadata; 015/016/017 validate --strict PASSED 0/0).
Feature branch `system-deep-loop/0144-036-p0-remediation` tip `a128aa9b41`, 13 commits. Every code finding DeepSeek-SOUND;
every spec finding validates clean. NOTHING landed to skilled/v4 or main.

NEXT (SEQUENCE step 4): **FRESH independent GPT-5.6-SOL review of the whole remediated candidate -> must return APPROVE
with 0 open P0.** If APPROVE, the next step is the [IRREVERSIBLE FRONTIER] (8 mode cutovers) which STOPS for operator go-ahead.

## MILESTONE (2026-08-12): FRESH-REVIEW RESIDUALS CLOSED (F2/F4/F7/F8/F10); AT THE FRONTIER GATE
Round-1 fresh SOL review surfaced 5 residuals on top of F1-F13. Discharged across rounds 1-4:
- F4 (rollback signals via providers), F8 (cert re-verify), F10 (pre-flip integration freeze in goal.md §8 P1-10) — DISCHARGED.
- **F2 branded authority commit guard** (`68caf40399`): unforgeable Symbol+WeakMap brand minted only by
  `createAuthorityTransactionCommitGuard()`; append boundary (`append-only-ledger.ts` `#appendAuthorized` ~424) rejects a
  missing OR unbranded/no-op guard fail-closed before any frame. Sole authority-commit path (`commitFrameUnlocked` ~526 reached
  only inside it). Seam = `per-mode-authority-flip/ledger-event.ts` → `appendAuthorizedThroughFence` → `#appendAuthorized`.
- **F7 atomic exclusive frame publish** (`b47af84c02`): the journal lock reclaim had a read-then-rename TOCTOU (split-brain).
  Fixed by keying the frame filename by SEQUENCE ALONE + publishing via exclusive `fs.linkSync` (EEXIST → JOURNAL_SEQUENCE_CONFLICT),
  so two writers who both hold the best-effort fence still cannot both commit. Chain+content digest verified from frame body
  (name digest was redundant); crash-safe (only .tmp dotfiles orphan). Deterministic two-writer test red-on-rename/green-on-link.
- Round-4 SOL review (multi-pass): F7 DISCHARGED first; F2 needed a second fix. Round-4 caught that branding-by-factory was
  still substitutable because the factory was EXPORTED and took a caller `dependencyGraph` → a caller could mint a
  branded-but-weakened guard. **F2 round-4 fix `c42ed8fa28`: removed the parameter so the factory only ever binds the canonical
  graph** (transaction naming any non-canonical graph now rejected at DEPENDENCY_GRAPH_MISMATCH). red-before/green-after +
  tsc 5.9.3 rc0 + per-mode-authority-flip 69/69 + authorized-ledger 35/35.
- **Round-4d consolidated verdict on `c42ed8fa28`: REVIEW VERDICT: APPROVE — 0 open P0.** F2 DISCHARGED, F7 DISCHARGED,
  new-defect none, F1/F3/F4/F5/F6/F8/F10 no-regression. **FRONTIER GATE PASSED.**

Branch tip `c42ed8fa28`, **3 commits AHEAD of origin (F2-brand 68caf40399 + F7 b47af84c02 + F2-pin c42ed8fa28), NOT pushed.**
NOTHING landed to skilled/v4 or main; runtime authority is still legacy (all modes legacy_authoritative / selectedWriter dark).

## MILESTONE (2026-08-12): FRONTIER HAND-BACK — operator chose "draft cutover plan" + "keep commits local"
At the frontier, operator declined to flip and chose to draft a reversible execution plan (no execution) and NOT push.
- Authored `cutover-execution-plan.md` at the 036 parent, committed locally `fd35f95672` (branch now **4 ahead, still unpushed**).
- Plan covers: 4-mode dependency-ordered flip (deep-improvement-common FIRST, then agent-improvement/model-benchmark/skill-benchmark),
  what "wire dark→live" means per mode, shadow-parity + rollback-drill + cutover-certificate gates, the 14-calendar-day + 5-execution
  rollback window, abort/rollback criteria, reversibility ledger, and the three operator-gated irreversible steps (first flip / 015
  legacy retirement / 017 merge).
- **SURFACED: the built authority domain is 4 modes (deep-improvement), NOT 8** — goal prompt's "8" is unresolved (OPEN DECISION 1).
- **STILL AT THE FRONTIER — nothing flipped, legacy authoritative.** Awaiting operator answers to the §9 open decisions before any flip.
cli-devin executor investigation DEFERRED until AFTER the frontier (operator: "Investigate after 036 frontier").

METADATA-EDIT RECIPE (learned): after editing any phase spec.md, run `generate-description.ts <path> <repo-root>` +
`backfill-graph-metadata.ts <path>`, then validate --strict, and commit spec.md + description.json + graph-metadata.json
together. CAUTION: never `git checkout -- specs/` while spec edits are in flight (it reverts them); stage specific files.
- **P1s remaining:** F8 (cert evidence families), F9 (015 closed-world), F10 (integration freeze), F11 (Stage-B matrix),
  F12 (detached-checkout validate), F13 (017 baseline 000→003 — cheap).

## Gates after F1-F13
Fresh independent review (SOL) must return APPROVE with 0 open P0 → **[IRREVERSIBLE FRONTIER — operator go-ahead]** 8 mode
cutovers → 015 telemetry/deletion → 016 Stage-B → 017 integrate/reconcile → merge to main. None reached; all far off.

## Execution discipline (learned)
- Every build: read design-rationale docs first → red-before → green-after → tsc rc0 → per-file suites → scoped diff (only
  intended files, nothing deleted) → cross-model adversarial check (the model that did NOT build it) → local commit.
- A green test is NOT proof (F6 over-denial passed tests yet broke every mode; caught by DeepSeek reading design docs).
- Models: GPT-5.6-SOL HIGH (cli-codex) + DeepSeek-v4-flash (cli-opencode/opencode-go), alternating implementer/checker.
  SOL hit "model at capacity" once on piece 2 (transient, zero changes lost) — fall back to the other model on capacity errors.
- DeepSeek cross-check prompts must be ONE bounded question or the opencode run truncates before a verdict.
