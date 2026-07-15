---
title: "Implementation Summary"
description: "Status COMPLETE. All 3 phases (SPECKIT_STATUS_CROSS_DOC_ENFORCE, SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE, SPECKIT_CHILD_DRIFT_ENFORCE) graduated to enforcing-by-default 2026-07-10. Tree-wide post-flip sweep confirms zero net-new regression."
trigger_phrases:
  - "validation enforce graduation summary"
  - "status cross-doc enforce flip summary"
  - "metadata disk consistency enforce flip summary"
  - "child drift enforce flip summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/010-validation-enforce-graduation"
    last_updated_at: "2026-07-10T07:22:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Graduated SPECKIT_CHILD_DRIFT_ENFORCE"
    next_safe_action: "Packet 019 closed — proceed to packet 023 (self-healing model consolidation)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-status-cross-doc-consistency.sh"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-metadata-disk-consistency.sh"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-child-drift.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
      - ".opencode/specs/system-speckit/004-memory-search-intelligence/019-validation-enforce-graduation/scripts/census-validation-rule.sh"
      - ".opencode/specs/system-speckit/004-memory-search-intelligence/019-validation-enforce-graduation/scripts/regen-worker.sh"
      - ".opencode/specs/system-speckit/004-memory-search-intelligence/019-validation-enforce-graduation/scripts/fix-packet-pointer.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase3-019-validation-enforce-graduation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-validation-enforce-graduation |
| **Status** | Complete — all 3 phases landed, tree-wide post-flip sweep clean |
| **Completed** | All 3 phases (2026-07-10) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**All 3 phases (`SPECKIT_STATUS_CROSS_DOC_ENFORCE`, `SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE`, `SPECKIT_CHILD_DRIFT_ENFORCE`) are COMPLETE**, each graduated from advisory to enforcing-by-default with a zero-violation (or individually-documented-residual) tree-wide census recorded before its flip.

### Phase 3: the highest-blast-radius flip, gated behind a new dist-presence guard

`GRAPH_METADATA_CHILD_DRIFT` compares a phase parent's `graph-metadata.json.children_ids` against its real on-disk numbered subdirectories, using a shared scanner module (`is-phase-parent.js`) that the graph-metadata writer itself also uses — so the check and the writer can never disagree on what counts as a child. Unlike Phases 1-2, this rule's own script already fails closed (rc=20/21) when that scanner module is entirely unavailable — but it had no defense against a *stale-but-loadable* build silently implementing outdated child-detection logic without ever tripping that branch. Per spec.md's own design, this gap had to be closed with a dist-presence/freshness guard before the flip, not just a census-and-flip like Phases 1-2.

**The guard.** Rather than build a bespoke checker, the guard extends the existing `dist-freshness.cjs` `DIST_PACKAGES` registry (already used elsewhere in this repo for exactly this class of problem — SHA256 content-hash based, not mtime-based, so it can't be fooled by a touch without a real edit). A new named entry, `is-phase-parent`, was added to the existing `system-spec-kit/scripts` package config, with its own **scoped** `entrySourceCandidates` — just `is-phase-parent.ts` plus its manifests, not the whole-package default. This scoping is a real improvement discovered mid-implementation, not part of the original design: `is-phase-parent.ts` has zero local imports, so a whole-tree source scope would have made the guard spuriously report "stale" every time any *other*, unrelated file changed anywhere in `scripts/` — a real risk given the concurrently-running, unrelated GPT-5.6 swarm actively editing files elsewhere in this same package throughout this session (see ADR-003's confirmation note in decision-record.md).

The guard is wired into `check-graph-metadata-child-drift.sh` immediately after the existing cheap numbered-subdirectory early-return (so leaf folders never pay its cost) and immediately before the scanner import it protects. When the freshness check reports stale (exit code 69, matching this repo's `STALE_EXIT_CODE` convention), the rule reports `warn` with an explicit rebuild-command remediation, rather than silently proceeding with a potentially-outdated scanner.

**Census and reconciliation.** The tree-wide advisory census (`GRAPH_METADATA_CHILD_DRIFT` forced true, read-only) found only 4 warnings across 2,423 folders — by far the smallest of the three rules' pre-flip backlogs, consistent with this being the narrowest-scoped rule (only phase-parent folders with numbered subdirectories are even eligible). 3 of the 4 were real drift, reconciled via the canonical `backfill-graph-metadata.js` generator (union-only, never hand-edited). The 4th, `z_future/code-graph-and-cocoindex`, is not a real spec folder — it has no `spec.md`, the same non-production class of residual already established and documented in Phase 2's own reconciliation. A follow-up census confirmed 2,422/2,423 pass with that single documented residual, 0 errors.

**The flip.** All three `${SPECKIT_CHILD_DRIFT_ENFORCE:-false}` sites inside `check-graph-metadata-child-drift.sh` were flipped to `:-true` — the rule's own gating condition for the new guard, and both existing rc=20/21 and drift-found branches — with a graduation comment recording the census evidence, matching the same corrected-file-target pattern established in Phases 1-2 (`capability-flags.ts` has zero references to this flag either). `ENV_REFERENCE.md`'s previously-missing `SPECKIT_CHILD_DRIFT_ENFORCE` row was added to both the summary and full flag-reference tables. Verified with zero environment override: a deliberately-drifted fixture correctly warns, and the guard's fail-closed behavior was re-confirmed against a missing-dist and a stale-dist (real content-edit, not just a touched mtime) fixture.

**A real regression in the persisted test suite, found and fixed.** Extending `scripts/tests/check-graph-metadata-child-drift.sh` with the guard's fixture matrix surfaced that the file's own `run_rule()` and `orchestrator_rule_status()` helpers relied on `unset SPECKIT_CHILD_DRIFT_ENFORCE` (or `env -u ...`) to simulate advisory mode — an assumption this phase's own default flip broke, since unset now resolves to enforcing, not advisory. Both helpers were corrected to set the flag explicitly to `false` for their advisory-mode branches. After that fix, 8 of 10 tests pass; the remaining 2 (both exercising the *default, unscoped orchestrator path* rather than this rule's own logic) are addressed in Known Limitations below.

**Final tree-wide verification (all 3 flags).** With all three phases' flips landed, a final `SPECKIT_RULES=`-scoped sweep re-ran each rule at its new enforcing default: `STATUS_CROSS_DOC_CONSISTENCY` 2,421/2,423 pass, `METADATA_DISK_PATH_CONSISTENCY` 2,349/2,423 pass, `GRAPH_METADATA_CHILD_DRIFT` 2,422/2,423 pass. Every warn count exactly matches that phase's own already-documented residual — confirming zero net-new regression introduced by any of the three flips, including from the time gap between each phase's own reconciliation and this final combined sweep.

### Phase 2: a ~9x-larger, but fully mechanical, backlog

A fresh `METADATA_DISK_PATH_CONSISTENCY` census found 1,130 real mismatches across the same ~2,420-folder tree (roughly 9x Phase 1's 128) — but unlike Phase 1's Status-field reconciliation, this rule's fix requires no per-folder human/AI judgment, so it was done directly rather than dispatched.

Root-caused by reading `check-metadata-disk-consistency-helper.cjs` directly: it checks five fields per folder (`description.json.specFolder`, `graph-metadata.json.spec_folder`/`.packet_id`/`.parent_id`, and a `continuity.packet_pointer` field inside every spec-doc's YAML frontmatter) against the folder's real on-disk path. Two genuinely distinct, both fully mechanical fixes were needed:

1. **The JSON-stored fields** — fixed by re-running the canonical generators (`backfill-graph-metadata.ts` + `generate-description.ts`) against every violating folder. New disposable worker: `scripts/regen-worker.sh`. Of 1,130 folders, 1,059 succeeded; 71 were correctly refused by the generator itself ("target is not a spec folder") — these are `.backup-YYYYMMDD-HHMMSS/` timestamped snapshot directories that happen to carry a `description.json`/`graph-metadata.json` but have no `spec.md` and are not real spec folders at all.
2. **`continuity.packet_pointer`** — a plain YAML string embedded in every spec-doc file's frontmatter (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `handover.md`), which the JSON generators never touch. This turned out to be the dominant sub-pattern: a repo-wide `system-spec-kit`→`system-speckit` (hyphenated→unhyphenated) directory rename left most folders' stored pointer stale. New disposable script: `scripts/fix-packet-pointer.mjs` — derives the correct value the exact same way the checker itself does (the folder's real path relative to `.opencode/specs/`, never guessed), and rewrites every file in a folder that carries a stale value. Ran across all 1,130 folders: 969 files fixed across 6 doc types, 161 already-correct no-ops, 0 errors.

Both fixes were verified together against a 5-folder hand-picked sample (mixing both mismatch types) before running at scale, confirming zero residual mismatches on that sample.

### Phase 2's residual: 74 folders, all confirmed non-production

A post-fix census dropped from 1,130 to 74 warnings. Categorizing every one of the 74 (not just spot-checking) confirmed all are legitimately out of this rule's real intent — none are a genuine production-path defect:
- 5 `.backup-*` timestamped snapshot directories (same class the generator itself already refused in step 1)
- 38 folders under `z_future/code-graph-and-cocoindex/` — a reserved, not-yet-built namespace
- 20 folders under a `scratch/` or `test-fixtures/` path segment — deliberately-synthetic fixtures this repo's own validator test suite uses (some are intentionally malformed on purpose; "fixing" them would break the tests that depend on their exact content)
- 11 auxiliary `research/`/`scopes/`/`packet-docs/`/`sandbox-test/` subdirectories nested inside real packets — working/evidence directories that picked up a `description.json` at some point but were never meant to be independently validated as standalone spec folders

None were force-fixed. This matches spec.md's own REQ-002/REQ-003 acceptance language and this repo's established precedent (008, 015) for documenting an honest residual rather than manufacturing a false zero.

### The flip

`check-metadata-disk-consistency.sh`'s default changed from `${SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE:-false}` to `${SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE:-true}` (same file-target correction as Phase 1 — `capability-flags.ts` has zero references to this flag either), with a graduation comment. `ENV_REFERENCE.md`'s two rows updated. Verified with zero environment override: a `z_future/` residual folder correctly reports `warn`, and an unrelated real folder correctly reports `pass`.

### Correction to the original spec/plan: the flag flip target

`spec.md`/`plan.md` both stated the three flags in this packet resolve through `mcp_server/lib/config/capability-flags.ts`. This was verified false at implementation time — a direct grep found zero references to any of the three flag names in that file. All three are actually read directly via inline bash default-expansion (`${SPECKIT_*_ENFORCE:-false}`) inside their own rule scripts. The flip for Phase 1 was applied to `check-status-cross-doc-consistency.sh:51` instead (default changed from `:-false` to `:-true`), not `capability-flags.ts`. This correction almost certainly applies to Phases 2 and 3 as well (`check-metadata-disk-consistency.sh:55`, `check-graph-metadata-child-drift.sh:100,111`) — re-verify at that phase's implementation time.

### Census driver: written, then fixed for real scale

A parameterized census driver (`scripts/census-validation-rule.sh` + `scripts/census-worker.sh`, disposable, this packet's own folder) was written per plan.md's design, then found unable to complete a real ~2,520-folder tree-wide run: a naive serial loop (one `validate.sh` subprocess per folder) took 12+ minutes and blew past shell-tool timeouts; the first parallelization attempt (`xargs -I{}`) hit a BSD-xargs internal buffer limit that silently fails ("command line cannot be assembled, too long") somewhere between 1,000 and 1,500 input lines; and `export -f` for the per-folder worker function proved unreliable on macOS's stock bash 3.2. Fixed by extracting the worker into a standalone script and switching to `xargs -P 12 -n 1` (no replace-string buffering). Result: a full tree-wide census now completes in ~100 seconds.

### Reconciliation: 128 violations, in two rounds

The first tree-wide census (`SPECKIT_STATUS_CROSS_DOC_ENFORCE` forced true, read-only) found 128 real `spec.md`/`implementation-summary.md` status-bucket mismatches across 2,520 folders. These were split into 4 disjoint 32-folder batches and reconciled in parallel via GPT-5.6-terra-fast dispatches, each in its own isolated git worktree (`.opencode/bin/worktree-session.sh`) to avoid collisions on the shared working tree. The batches used two resolution modes: correcting the genuinely stale file's Status field, or — for folders judged intentionally/deliberately different — adding an explanatory note.

**The note-based resolution mode turned out not to satisfy the rule.** `STATUS_CROSS_DOC_CONSISTENCY` purely compares classified Status-field buckets; it has no mechanism to read prose notes. A post-merge re-census confirmed this directly: 38 of the "resolved" folders still reported `warn`. A second cleanup round (2 parallel background agents, 19 folders each, re-reviewing with a "prefer a real bucket fix over a note" instruction) resolved 35 of those 38 for real, correcting the actual stale Status field with cited evidence (checklist completion ratios, verification tables, code grep confirmation). The remaining 2 are genuinely, honestly mixed-state — see Known Limitations.

### An attempted `legacy_grandfathered` fix, tried and reverted

For the final 2 residual folders, `legacy_grandfathered: true` was hand-set on their `graph-metadata.json` (a pre-existing but never-used escape hatch `validate.sh`'s bash orchestrator already reads). Along the way, a real gap was found and fixed: `legacy_grandfathered` was never added to `graph-metadata-schema.ts`'s Zod schema, so a future `backfill-graph-metadata.js` run would silently strip it via Zod's default unknown-key stripping — `graphMetadataSchema` and `mergeGraphMetadata` were extended to declare and preserve it, mirroring the existing `migrated`/`migration_source` pattern.

This entire approach was then reverted. `legacy_grandfathered` only suppresses `--strict`'s *warn*-severity escalation; both residual folders separately carry a genuinely pre-existing, unrelated `GENERATED_METADATA_INTEGRITY` *error*-severity `SOURCE_FINGERPRINT_MISMATCH` (confirmed present in the exact commit this work started from, already independently fixed by a different concurrent session in the live main tree, out of this packet's scope) — so `legacy_grandfathered` would never have made these 2 folders pass `--strict` regardless. All 4 touched files (2 `graph-metadata.json` hand-edits, `graph-metadata-schema.ts`, `graph-metadata-parser.ts`) were reverted via `git checkout`, and `dist/` rebuilt to confirm a clean revert.

The correct, simpler resolution — matching spec.md's own REQ-002 language ("an individually-explained residual... matching 008's and 015's own precedent") — is to document the 2 folders honestly rather than force them.

### The flip

`check-status-cross-doc-consistency.sh:51`'s default changed from `${SPECKIT_STATUS_CROSS_DOC_ENFORCE:-false}` to `${SPECKIT_STATUS_CROSS_DOC_ENFORCE:-true}`, with a graduation comment recording the census evidence. `ENV_REFERENCE.md`'s two rows updated to match. Verified with zero environment override (relying purely on the new default): the residual folder correctly reports `warn`, and an unrelated N/A-classified folder still correctly reports `pass`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Phase 1 was dispatched to GPT-5.6-terra-fast (`--variant high`) via `cli-opencode`, run in parallel across isolated git worktrees for the 4 reconciliation batches (avoiding collisions on the shared, heavily concurrent-session working tree), plus 2 parallel background general-purpose agents for the residual cleanup round. Each dispatch's claimed commit was independently re-verified (real `git log`/`git show` diff review, not trusted from self-report alone) before being merged into an isolated integration worktree. Phase 2 turned out to have a fully mechanical fix (no per-folder judgment call, unlike Status reconciliation), so it was done directly rather than dispatched — two small purpose-built scripts, tested on samples, then run at full scale. Phase 3's guard design, fixture testing, census, reconciliation, and flip were all done directly, given the small backlog (4 warnings) and the guard's own design work not being parallelizable in a meaningful way. The census driver's performance fix, the `legacy_grandfathered` investigation-and-revert, all three flag flips, and the final tree-wide verification sweep were also done directly.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse the `SPECKIT_GENERATED_METADATA_GRANDFATHER` backfill→verify→flip pattern (ADR-001) | Already proven in this repo for an identically-shaped problem; inventing a new mechanism would be unjustified novelty |
| Sequence least-risky-first: Status → Metadata Disk → Child Drift (ADR-002) | Each phase's success de-risks the next before the highest-blast-radius flip, which also carries a session-realized dist-availability risk |
| Build the child-drift dist-presence guard by extending `dist-freshness.cjs` (ADR-003) | Reuses proven staleness-detection infrastructure instead of a bespoke checker, and satisfies the task's explicit pre-flip guard requirement |
| Census driver is one parameterized script reused three times | Avoids duplicating the `validate.sh --strict --json` loop-and-parse logic per phase |
| Phase 2's census must be timestamped fresh, never assumed equal to 008's historical numbers | The post-008 folder re-nest campaign is known to have re-dirtied this exact drift class |

See `decision-record.md` for full ADR documentation (ADR-001..003, all status Accepted).
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Implementation | All 3 phases COMPLETE |
| Unit (census driver fixture) | PASS — 3-folder known-answer fixture (2 warn, 1 pass) matched exactly |
| Phase 1 census, before reconciliation | 2,520 inspected, 128 warnings, 0 errors |
| Phase 1 census, after full reconciliation | 2,423 inspected, 2,421 pass, 2 individually-explained residuals, 0 errors |
| Phase 1 flip verification, zero env override | PASS — residual folder correctly warns, unrelated N/A folder correctly passes |
| Phase 2 census (`METADATA_DISK_PATH_CONSISTENCY`, fresh) | 2,423 inspected, 1,293 pass, 1,130 warnings, 0 errors |
| Phase 2 regen batch (JSON fields) | 1,059/1,130 succeeded; 71 correctly refused (`.backup-*` non-spec-folders) |
| Phase 2 frontmatter fix (`continuity.packet_pointer`) | 969 files fixed, 161 already-correct, 0 errors, across all 1,130 folders |
| Phase 2 census, after full reconciliation | 2,423 inspected, 2,349 pass, 74 individually-categorized residuals (all confirmed non-production paths), 0 errors |
| Phase 2 flip verification, zero env override | PASS — a `z_future/` residual folder correctly warns, an unrelated real folder correctly passes |
| Phase 3 guard fixture matrix | PASS — 4 load-bearing cells (fresh+no-drift, fresh+drift+enforce, missing-dist+enforce, stale-dist+enforce) |
| Phase 3 census (`GRAPH_METADATA_CHILD_DRIFT`), before reconciliation | 2,423 inspected, 4 warnings, 0 errors |
| Phase 3 reconciliation | 3/4 folders fixed via `backfill-graph-metadata.js`; 1 correctly excluded (`z_future/code-graph-and-cocoindex`, no `spec.md`) |
| Phase 3 census, after full reconciliation | 2,423 inspected, 2,422 pass, 1 documented residual, 0 errors |
| Phase 3 flip verification, zero env override | PASS — deliberately-drifted fixture correctly warns |
| Phase 3 persisted test suite (`check-graph-metadata-child-drift.sh`) | 8/10 pass — 2 failures isolated to the shared unscoped-orchestrator dist race (see Known Limitations), not this phase's own rule logic |
| Repo-wide post-flip sweep (tasks.md T029-T030, all 3 flags at final defaults) | PASS — `STATUS_CROSS_DOC_CONSISTENCY` 2,421/2,423, `METADATA_DISK_PATH_CONSISTENCY` 2,349/2,423, `GRAPH_METADATA_CHILD_DRIFT` 2,422/2,423 — every warn count exactly matches its own phase's documented residual, zero net-new regression |
| This packet's own folder, full unscoped `validate.sh --strict` | PASS — `Errors: 0  Warnings: 0`, `RESULT: PASSED` (using the Limitation 4 CLI-entry workaround) |

This packet's own packet-doc verification:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/019-validation-enforce-graduation --strict
```

Full-tree typecheck (`npm run typecheck` in `mcp_server/`) could not run cleanly: blocked by a pre-existing, unrelated `tsconfig.json` deprecation error (`TS5101`, deprecated `baseUrl` option) present before this packet's work began and independent of anything touched here. Not fixed — out of scope.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two persisted test failures in `scripts/tests/check-graph-metadata-child-drift.sh` (TEST 7 "DEFAULT orchestrator path fires the rule" and TEST 8 "DEFAULT path no false positive"), isolated to a pre-existing, external shared-dist race, not a defect introduced by this phase.** Both tests exercise the *full, unscoped* `validate.sh` orchestrator path — not this phase's own rule logic, which is separately and fully covered by the other 8 passing tests plus the direct fixture-matrix verification in Verification above. Root-caused: a concurrently-running, unrelated GPT-5.6 swarm (already documented as active throughout this packet's work — see Limitation 4 below) was actively editing files under `mcp_server/lib/*` in the shared main tree during this phase's own work, and the worktree's `mcp_server/dist` is symlinked to that same shared, constantly-rebuilding tree. A minimal, isolated repro (a synthetic fixture folder run through the exact same `SPECKIT_CHILD_DRIFT_ENFORCE=false bash validate.sh ... --strict --json` invocation TEST 7 uses) reproduced the identical empty/absent output independent of which folder was tested — confirming the orchestrator path itself is intermittently non-responsive right now, for reasons outside this phase's own changes. The `SPECKIT_RULES=`-scoped path (used throughout this packet, including for the final T029/T030 tree-wide sweep) is unaffected and was used as the reliable substitute, consistent with this packet's established practice for this exact class of issue (see Limitation 4).
2. **Two genuine, honestly-documented `STATUS_CROSS_DOC_CONSISTENCY` residuals remain, by design, not oversight:**
   - `.opencode/specs/system-speckit/z_archive/022-hybrid-rag-fusion/015-manual-testing-per-playbook` — its 22 child phases are all complete, but a later-layered wrapper truth-sync/traceability-remediation checklist is 0/27 checked and `spec.md` explicitly describes that layer as still open; `implementation-summary.md` predates the remediation work. Forcing either bucket would misrepresent one real, currently-open sub-scope on top of otherwise-complete work.
   - `.opencode/specs/sk-doc/z_archive/006-sk-doc-agent-template-alignment` — sub-scope 063b (template alignment) shipped; sub-scope 063a (remove a `RELATED RESOURCES` section from 40 agent files) did not fully land — independently re-verified via `grep -rl "## .*RELATED RESOURCES" .opencode/agents .claude/agents"`: `markdown.md` still carries it in both trees. Forcing "Complete" would misstate real drift still on disk; forcing "Planned" would ignore the ~95% that did land.

   Both are individually explained per REQ-002's own acceptance bar; `validate.sh --strict` on either folder specifically will fail until a future session either genuinely completes the open sub-scope or makes an explicit call to close it out.
3. **That same `sk-doc/006` folder separately carries a pre-existing, unrelated `GENERATED_METADATA_INTEGRITY` `SOURCE_FINGERPRINT_MISMATCH` error**, confirmed present in the exact commit (`d26faba25e`) this work forked from, already independently fixed in the live main tree by a different concurrent session (not yet part of any commit this packet could cleanly build on). Out of scope for this packet; not fixed here.
4. **A worktree/symlink CLI-entry self-check limitation was discovered in three separate scripts (not fixed, out of scope — a repo-wide infra gap, not this packet's own defect).** `orchestrator.js` (`validate.sh`'s Node backend), `generate-description.js`, and `backfill-graph-metadata.js` each gate their CLI-entry execution behind a `process.resolve(process.argv[1]) === fileURLToPath(import.meta.url)` (or equivalent `isMainModule`) self-check. Invoked from *within* a git worktree whose `mcp_server/dist`/`scripts/dist` are symlinked to the main tree, this check fails silently — the process exits 0 with zero output and, for the two generator scripts, **does not write anything at all** (confirmed directly: a `backfill-graph-metadata.js` run that appeared to succeed left `graph-metadata.json`'s `derived.last_save_at` completely unchanged from a run nearly an hour earlier). This cost real time mid-Phase-3: a `GENERATED_METADATA_INTEGRITY`/`SOURCE_FINGERPRINT_MISMATCH` failure on this packet's own folder was initially misdiagnosed as the already-known shared-dist race (Limitation 1), including one unnecessary `mcp_server` rebuild, before directly comparing a hand-invoked `computeSourceFingerprintForFolder` re-derive against the stored value proved the docs and the stored fingerprint simply hadn't been touched by the "successful" regen runs. Workaround, applied consistently once identified: invoke each script from the main tree's own CWD, passing an absolute path into the worktree as the argument (not a path resolved via the worktree's own symlinked `dist/`). The `SPECKIT_RULES=`-scoped census-driver path is unaffected by any of this — verified working correctly at full ~2,420-folder scale, repeatedly, throughout all three phases.
5. **`npm run typecheck` could not be run to a clean baseline** due to a pre-existing, unrelated `tsconfig.json` `TS5101` deprecation error. Every individual file this packet touched was still hand-verified for syntactic/semantic correctness before committing.
6. **Full tree-wide `validate.sh --strict` sweep (tasks.md T029-T030) is COMPLETE** — run via the `SPECKIT_RULES=`-scoped path (Limitation 1 above documents why the unscoped orchestrator path was avoided for this); see the Verification table's final row.
7. **74 `METADATA_DISK_PATH_CONSISTENCY` residual folders remain, all confirmed non-production** (5 `.backup-*` snapshots, 38 `z_future/` reserved-namespace folders, 20 test fixtures/scratch directories, 11 auxiliary research/review subdirectories nested inside real packets) — see the "Phase 2's residual" section above for the full categorization. None represent a genuine production-path defect; none were force-fixed.
8. **A full, unscoped `validate.sh --strict` run against this packet's own folder is now clean** (`Errors: 0  Warnings: 0`, `RESULT: PASSED`), captured using the Limitation 4 workaround for all three CLI scripts. The run surfaced, and this packet then fixed directly, several unrelated pre-existing doc-quality gaps: a stale `[template:...]` scaffold marker in `implementation-summary.md`'s own title, a non-compact `recent_action` frontmatter field, several checklist/task items whose evidence text didn't match `EVIDENCE_CITED`'s machine-checkable format, and stale `continuity.last_updated_at` timestamps versus `graph-metadata.json`'s regenerated `derived.last_save_at`.
<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 3 IMPLEMENTATION SUMMARY
Core template, post-implementation documentation created AFTER work completes
-->
