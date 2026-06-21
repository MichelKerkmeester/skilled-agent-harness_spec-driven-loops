# Iteration 002 — B1: the standing scheduled DQ sweep with a guarded auto-fix tier

Focus: the scheduler, the safe-vs-risky fix classification, the corpus-wide runner, and idempotency for the retroactive keystone. Reader class: A/L/R(metadata). Floor: BYPASS. This is the layer dq-skilldoc-cmd-ctx proved is the empty multiplier slot (8 CI workflows all `on: pull_request`, ZERO `schedule:`/`cron:`/`workflow_dispatch` — re-confirmed this iteration by grep over `.github/workflows/`).

## The scheduler decision (build-ready)

Three candidate triggers exist in this repo; the design uses TWO of them, not one:

1. **GitHub Actions `schedule:` + `workflow_dispatch` (PRIMARY).** New `.github/workflows/dq-corpus-sweep.yml`. This is the literally-empty tier. Pattern mirrors the 8 existing path-filtered workflows but inverts the trigger: instead of `on: pull_request [paths]`, use `on: {schedule: [{cron: '0 6 * * 1'}], workflow_dispatch: {}}`. Runs the corpus runner in **report mode**, uploads the JSON report as an artifact, and opens/updates a tracking issue (or fails soft) — it does NOT auto-commit fixes in CI. Rationale: CI is the only trigger that runs for the whole team without per-dev install, and `workflow_dispatch` gives the on-demand manual run the operator asked about.
2. **Local `post-merge` git hook (SECONDARY, opt-in).** Add `.opencode/scripts/git-hooks/post-merge`. The installer (`install-git-hooks.sh`) already globs every file in `.opencode/scripts/git-hooks/` and symlinks it (`install-git-hooks.sh:42-52`), so dropping a `post-merge` file there is the entire wiring — no installer change. It runs the SAME runner in report-only/advisory mode (mirroring the existing advisory pre-commit at `.git/hooks/pre-commit:35-45`, which warns but always `exit 0`). This catches drift right after a `git pull` for devs who opt in.

**Rejected as PRIMARY: post-merge alone.** Local hooks are per-developer and unenforced; the corpus property ("nothing rots untouched") needs a team-wide trigger, which only the scheduled CI workflow provides. Post-merge is a fast local echo, not the system of record.

## The corpus-wide runner (build-ready)

New `scripts/sweep/dq-sweep.ts` (+ `dist/sweep/dq-sweep.js`). It is a thin orchestrator over machinery that already exists:

- **Enumeration:** reuse the spec-folder discovery already in `validate.sh`'s `run_recursive_validation` (`validate.sh:955`) — or, for a single-process TS runner, walk `.opencode/specs/**` + `specs/**` for folders containing `spec.md|description.json` (the same roots `backfill-frontmatter.ts:144` uses via `--roots .opencode/specs,specs`).
- **Detectors:** invoke the A1 `content-quality` scorer (iter 001 H3) + the existing `validate.sh --json` per folder + `scoreMetadataJson`. Aggregate into one report. Do NOT reimplement detectors — the sweep is a fan-out caller.
- **Output contract:** copy the backfill report shape verbatim — `--dry-run` (default), `--apply`, `--report <path>`, `--roots`, `--limit` (`backfill-frontmatter.ts:131-144`). A sweep run prints `{scanned, byBand, safeFixable, riskyReportOnly, applied, skipped}`.

This makes the sweep the SHARED retroactive runner for A1 (content quality), the parent's Stage-1 invalid-graph-file scan, and B2's detectors — one process, one report.

## Safe-vs-risky fix classification (the core of the guarded tier)

The classification is a property of the FIX, not the detector. Encode it as a `fixClass: 'safe' | 'risky' | 'none'` field on each detector's output, with this rule:

| fixClass | Definition | Examples | Sweep behavior |
|---|---|---|---|
| `safe` | Deterministic, length-non-destructive, reversible, no semantic authorship | HVR style swaps (em-dash→` - `, semicolon split, Oxford-comma); close unclosed `<!-- /ANCHOR -->`; enum case-normalization (`Important`→`important`); propagate curated frontmatter `trigger_phrases` INTO `description.json` (additive metadata, not body) | auto-apply under `--apply`, batched, git-committed |
| `risky` | Content-removing OR semantic OR judgment-bearing | budget trim (`quality-loop.ts:463-468`), description REWRITE, requirement/EARS edits, any body text deletion, decision-record edits | report-only, ALWAYS, even under `--apply` |
| `none` | Detector is a pure signal | low `coherence`/`budget` sub-score, never-retrieved telemetry | report-only |

The hard invariant (the parent's net-negative rail, now mechanized): **a fix touching an authored doc BODY is never `safe`.** Only metadata-JSON fields and length-neutral fence-aware style swaps qualify. The `attemptAutoFix` budget-trim from `quality-loop.ts` is permanently `risky` and the sweep refuses to call it. Implement the classifier as a frozen allow-list of `safe` fix ids — anything not on the list defaults to `risky` (deny-by-default), so a new detector cannot accidentally gain auto-fix rights.

## Idempotency

Reuse the backfill idempotency contract exactly:
- **Skip-if-conformant:** each detector re-checks before fixing; if the doc already passes, no write (so re-running the sweep on a clean corpus is a no-op — the `backfill-frontmatter.ts` "skip already-conformant" pattern).
- **content_hash guard:** before applying a safe fix, recompute the doc hash; after, recompute and only write if changed (mirrors `memory-save.ts:546 computeContentHash` after fix). A second pass finds the hash already at the fixed value and skips.
- **Atomic writes:** reuse `generate-context.ts:398 atomicWriteJson` (temp+rename) for JSON fixes and the `memory-save.ts:600 finalizeMemoryFileContent` backup+temp+rename for doc fixes — no partial writes on crash.
- **Batched + git-tracked:** `--apply` commits in batches (`--limit N`) so a bad batch is one `git revert`. The report from the prior dry-run is the diff preview.

## On-write vs retroactive timing

B1 is RETROACTIVE by definition (it catches what on-write A1 missed: pre-existing docs, path-filter escapes, cross-surface coherence). The scheduled cron is weekly; `workflow_dispatch` is on-demand; post-merge is per-pull. None are on-write — on-write is A1's job. The two compose: A1 keeps new writes clean, B1 sweeps the backlog and the escapes.

## Rollback

- Workflow: delete `dq-corpus-sweep.yml` (additive file). 
- Post-merge hook: `install-git-hooks.sh --uninstall` (already supported, `:24-37`) or `rm .git/hooks/post-merge`.
- Applied safe fixes: batched git commits → `git revert <batch>`. Because `safe` fixes are length-neutral/additive-metadata only, a revert is clean (no merge hazard).
- The runner itself is dormant if never invoked.

## Risks

- **RISK-B1a (CI auto-commit hazard):** if the scheduled workflow auto-applied fixes and pushed, a bad classifier could corrupt the corpus team-wide. MITIGATION: CI is report-ONLY; `--apply` runs only locally/operator-invoked where a human reviews the dry-run first. Hard rule: the scheduled workflow never gets write/push credentials beyond opening an issue.
- **RISK-B1b (classifier drift):** a new detector silently marked `safe`. MITIGATION: deny-by-default frozen allow-list; adding a `safe` id requires editing the allow-list (a reviewable, gate-able change — wire it into the existing `rule-canary-sync` cross-copy pattern).
- **RISK-B1c (sweep latency / scale):** scoring the whole corpus each run. MITIGATION: `--limit`, `--roots` scoping, and a `--since <git-ref>` mode that scores only files changed since the last sweep tag (incremental), falling back to full on schedule.

## Rollout order (B1 internal)

1. Build `dq-sweep.ts` as a `--dry-run`-only report over the A1 detectors (no fix path yet). Validates enumeration + aggregation.
2. Add the `fixClass` allow-list + the `safe`-fix executors (style/anchor/enum/metadata-propagate). Still dry-run default.
3. Ship `dq-corpus-sweep.yml` (`schedule` + `workflow_dispatch`), report-only, artifact + issue.
4. Add the opt-in `post-merge` hook (advisory).
5. Enable operator-local `--apply` for the `safe` tier, batched, after the dry-run report is reviewed.

## Dead ends ruled out this iteration

- Post-merge hook as the PRIMARY trigger — per-dev, unenforced; can't guarantee corpus-wide coverage. CI `schedule:` is the system of record. [evidence: `.git/hooks/pre-commit` is advisory/per-install; `install-git-hooks.sh` is opt-in]
- A new bespoke enumeration walker — `validate.sh:955 run_recursive_validation` + the backfill `--roots` convention already enumerate the corpus. [evidence: `validate.sh:955`, `backfill-frontmatter.ts:144`]
- Per-detector safe/risky flags decided ad hoc — classification is a property of the FIX, deny-by-default allow-list, body-touching never safe. [evidence: parent net-negative rail; `quality-loop.ts:463-468`]
- CI that auto-commits fixes — corpus-wide blast radius; CI stays report-only. [design]

## Assessment

newInfoRatio: 0.82 — net-new scheduler choice (CI schedule PRIMARY + post-merge SECONDARY with zero-install wiring via the existing globbing installer), the fixClass deny-by-default allow-list, and the reuse of the backfill dry-run/idempotency contract are concrete and not in prior lineages (which said "a standing scheduled sweep" without the trigger choice, the classification mechanism, or the idempotency contract). Status: complete. Sources: `.github/workflows/` (8 files, grep schedule/cron empty); `install-git-hooks.sh:24-52`; `.git/hooks/pre-commit:35-45`; `validate.sh:955`; `backfill-frontmatter.ts:131-144`; `generate-context.ts:398`; `memory-save.ts:546,600`; `quality-loop.ts:463-468`.
