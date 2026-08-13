# Handover: 036/024 durable-write-boundaries (P1-2 CLOSED — regressions fixed, aggregate clean, landing)

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v2.2 -->

**Status:** 024's code is implemented, hardened, adversarially verified, and its one open verification gate (P1-2) is **CLOSED** — the full 168-file serial aggregate shows only the four pre-existing failures (no 024 regressions). Two regressions the aggregate exposed post-hardening (idempotent-replay rejection across the resume adapters / contradiction-supersession; a deep-ai-council test-fixture lease leak) were fixed and independently adversarially verified on a different model. This packet is landed to `origin/skilled/v4.0.0.0` in the same change. The OPEN ITEMS below are historical (the P1-2 gate they describe is now closed).

Worktree: `.worktrees/0129-system-deep-loop-036-remediation-execution`, branch `system-deep-loop/0129-036-remediation-execution`, on top of origin tip `9229cb8f3e`.

---

## 1. What is DONE and verified

All 18 findings fixed. Gateway-only fenced mutation enforced at RUNTIME:
- `appendAuthorized` is now ECMAScript hard-private (`#appendAuthorized`); the fence is verified **inside the ledger primitive** via a coordinator-issued capability (module-scoped WeakMap bridge). A superseded writer with an unexpired proof is rejected even via a cast — not only by the wrapper. (ADR-008 in `decision-record.md`.)
- All 32 production callers migrated to the fenced writer; all ~90 white-box test callers migrated to `tests/fixtures/authorized-ledger-test-helper.ts` (`appendAuthorizedForTest`). **Zero surviving direct `.appendAuthorized(` calls** anywhere (grep-verified).
- Single-winner enforced BY DEFAULT (derived from `writer.rootDirectory`, no caller opt-in); branch workers fenced for lease lifetime; cross-process lock for the diff-gated append; identity-verified atomic lock reclaim/release; torn-tail quarantine behind a durable marker; closed record parser rejecting wrong-typed fields; atomic staged leaf publication.
- Deterministic two-process concurrency tests + crash-injection, with **red-before/green-after evidence for 7 P0 negative tests** (digests + SHA in `implementation-summary.md` / `checklist.md`).

**Gates that PASSED (reliable, isolated):**
- `tsc --noEmit` (project TS 5.9.3 at `.opencode/skills/system-spec-kit/node_modules/.bin/tsc`) → rc 0. (Global homebrew tsc is too new — errors on `moduleResolution=node10`; use the sibling 5.9.3.)
- 024's 8 owned test suites in isolation → **223/223 pass** (hardening leaf + independent Sonnet verify at 221 pre-hardening).
- Child `validate.sh --strict` → Errors 0, Warnings 0.
- Adversarial verify (Sonnet, independent actor): 2 P1s found, both resolved (P1-1 = the runtime-hardening now done; P1-2 = the open item below). No P0s. Comment hygiene clean, scope clean.

---

## 2. OPEN ITEMS — must close before landing

### 2A. Full-suite regression aggregate (P1-2) — the ONLY blocker
Operator ruled: **capture a full-suite aggregate proving zero regressions before landing.** Not yet achieved because:
- The runtime suite is **serial by config** (`runtime/vitest.config.ts` has `fileParallelism: false`, UNCHANGED by 024 — it exists because the code-graph tests share SQLite DBs). A full serial run takes **hours** (≥8 pre-existing `*-rollback-gate.vitest.ts` files each run ~20 tests at ~14s = 2,000+ s, plus 024's two-process/crash tests). A 45-min and a 60-min wall-clock run both ended before the aggregate.
- Running with `--fileParallelism` is **NOT valid** — it produces spurious failures from shared-graph-DB + fence-lock contention (it failed `branch-leases-waves`, a 024-owned file that passes 223/223 in isolation). Do not trust parallel results.

**Recommended strategy to close 2A (fresh session, in this order):**
1. First rebuild the SQLite binding: `cd runtime && npm rebuild better-sqlite3` (the worktree's `better_sqlite3.node` was compiled for NODE_MODULE_VERSION 127; current node needs 141 — without the rebuild every graph/DB test fails on binding load and the suite stalls). **This is already done in this session's node_modules, but a fresh clone/re-sync loses it.**
2. Verify the migrated-caller test files in ISOLATION (they are the real regression risk — the hardening migrated 89 callers across ~30 files, but only the 8 OWNED suites were re-run). Run serially, in small batches, the files that contained migrated callers: the `*-ledger-schema`, `*-certificates`, `*-resume-adapter`, `*-shadow-parity`, `*-rollback-gate` vitest files + `contradiction-supersession`, `claim-continuity`, `stopping-clocks`, `voc-allocation`, `cycle-detection`, `partial-failure-policy`, `replay-fingerprint`, `conditional-fanin`, `blinded-adjudication`, `stream-fold-gauges`, `agent-improvement-reducers`, `legacy-projections`. Any failure whose message is `appendAuthorized is not a function` or a fence/proof error is a migration miss → fix it the same way `legacy-projections.test.ts` was fixed (import `appendAuthorizedForTest` from `../fixtures/authorized-ledger-test-helper.js`, swap the call).
3. Then capture the whole-suite aggregate SERIALLY with a multi-hour budget (or run in isolated file-group batches and sum), and confirm the ONLY failures are the 4 pre-existing files below.

### 2B. Known PRE-EXISTING failures (NOT 024; do not "fix" here)
The 021 RED baseline is `148 files / 3,992 tests / 3,986 pass / 6 fail in 3 files`. The confirmed pre-existing failing files (owned by child `031-silent-failure-and-harness-repair` or content-drift, verified NOT caused by 024):
- `tests/unit/render-command-contract.vitest.ts` (4 fail) — 031.
- `tests/unit/check-contract-drift.vitest.ts` (1 fail) — 031.
- `tests/unit/legacy-projections.test.ts` (1 fail) — the "state-census disposition" test, a `sk-prompt/prompt-models` vs `sk-prompt/sk-prompt-models` path assertion, 031. (Its OTHER 14 tests pass; the appendAuthorized migration there is DONE.)
- `tests/integration/review-depth-convergence.vitest.ts` (1 fail) — review-workflow content drift (a `searchLedger` prose assertion) from a concurrent doc change at HEAD `9229cb8f3e`. Not 024.

A "no new failures vs baseline" claim = the final failing set is exactly these 4 files.

---

## 3. LAND RECIPE (once 2A is green)
1. Re-sync is NOT needed unless landing on a newer origin tip; the leak-guard lander fetches fresh origin itself.
2. Re-confirm child `validate.sh --strict` → Errors 0.
3. Land via the leak-guard tree-to-tree lander:
   - Paths file (`/tmp/ks/paths-036-024.txt` — recreate if scratch wiped): the three prefixes
     `.opencode/skills/system-deep-loop/runtime/lib`,
     `.opencode/skills/system-deep-loop/runtime/tests`,
     `.opencode/specs/system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries`.
   - **EXCLUDE** `runtime/database/*` (council-graph.sqlite, deep-loop-graph.sqlite, observability-events.jsonl are test-run byproducts — not named, so the leak-guard drops them). Also exclude the ambient `specs/descriptions.json` + parent `036/graph-metadata.json` metadata churn.
   - Lander: `zsh /tmp/ks/land-wt0129.sh <paths-file> <msg-file>` (temp GIT_INDEX_FILE from fresh origin FETCH_HEAD, stages only named prefixes, guards 0 deletions + all-under-prefix, commit-tree, braced push with `SPECKIT_ALLOW_REMOTE_PUSH=1`). Draft commit message is at `/tmp/ks/msg-036-024.txt`.
4. After land: mark the child Status Complete + reconcile completion metadata; re-sync worktree.

---

## 4. Restore the build in a fresh session
The full 110-file dirty build is on `wip/024-build-checkpoint` (`fbd39097909`). To resume:
`git -C <worktree> stash apply fbd39097909` onto a clean tree, OR reset the worktree to it. The dirty worktree currently already holds this state — do NOT `git reset --hard` / re-sync it (that discards the build; the checkpoint is the recovery).

---

## 5. After 024 lands — the rest of the WS1 036 runtime chain
Per the updated goal prompt (STEP 0 scaffold is DONE — do NOT re-scaffold; 021-032 committed, 021 Complete):
- **026-alignment-coverage** (unblocks once 024's `leaf-artifact-writer.ts` closed parser lands — 024 owns it structurally; 026 layers slice-binding).
- Then per-MANIFEST: 027, 028, 029, 030, 031 (031 after 026 on `reduce-alignment-state.cjs`), 032, plus 019, 020.
- Per-child discipline (hard): confirm findings vs HEAD first → LUNA-xhigh build via cli-codex → SOL/Sonnet adversarial verify → tsc + serial vitest green vs the 021 baseline → leak-guard land. Executor policy: builds = GPT-5.6-LUNA xhigh (cli-codex workspace-write); confirm/verify = GPT-5.6-SOL cli-codex fast + Sonnet; NEVER cli-opencode; SERIAL dispatch.

Also still open in the broader program (sk-doc, not runtime): 022/003 (full structural sweep, ruling locked), 023/002+003, 024/002+003, sk-code/021/002-005.

---

## 6. Session ledger (what landed to origin/skilled/v4.0.0.0 THIS session)
All adversarially verified pre-land: 025/002 `c6a07b226c` · 022/001 `98f2e639b3` · 022/002 `07e008dee9` · 025/003 `65db3ed73c` · 025/004 `0df71a042d` (025 skill-doc-currency family COMPLETE). Plus the standing goal prompt was rewritten to drop the stale STEP 0 (scaffold is done).
