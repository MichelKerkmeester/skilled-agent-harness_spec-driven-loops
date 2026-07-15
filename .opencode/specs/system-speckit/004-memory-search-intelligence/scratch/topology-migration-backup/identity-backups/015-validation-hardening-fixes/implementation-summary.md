---
title: "Implementation Summary: Validation-Hardening Tooling Fixes — Evidence Substance, Status Classifier, Freshness Baseline"
description: "Implemented and verified all four fixes (F6/F7/F9/F10). Two out-of-scope findings surfaced during verification, flagged for operator review rather than silently fixed or hidden."
trigger_phrases:
  - "validation hardening fixes implemented"
  - "evidence substance checker fixed"
  - "status classifier implemented recognized"
  - "freshness sweep baseline fixed"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/015-validation-hardening-fixes"
    last_updated_at: "2026-07-10T18:39:17.000Z"
    last_updated_by: "claude-code"
    recent_action: "Annotated stale 83/2,121 plan.md figure as superseded by spec.md's 80/2,235 addendum"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/status-classifier.sh"
      - ".opencode/skills/system-spec-kit/scripts/sweep/strict-pass-freshness.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/validation-gate-hardening.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-015-validation-hardening-fixes"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "DEFERRED-marker exemption: unconditional bypass beyond the existing case-statement, no new length floor."
      - "F9 cross-reference: paired comments, not a shared literal list."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-validation-hardening-fixes |
| **Completed** | Implemented and verified 2026-07-09; not committed (operator instructed no commit/push this turn) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All six requirements (REQ-001 through REQ-006) implemented and verified against real evidence, not just against the fixture set the plan named.

**F6 — check-evidence.sh.** Removed the bare-filename-without-linenum branch from `evidence_item_has_substance()` entirely. A checklist item that only names a file in its own subject line no longer counts as evidence; `filename:linenum`, backtick output, fraction/percent, and test-tool-keyword checks are untouched. Added a bracket-keyword probe (`evidence` vs `deferred`) and a bypass: non-trivial `[DEFERRED: ...]` content now passes without needing to look evidence-shaped, as long as it survives the existing trivial-placeholder case-statement (no new minimum-length floor added).

**F7 — status-classifier.sh / strict-pass-freshness.ts.** Both `classify_status()` and `classifyStatus()` now recognize `implemented`/`implementing` as the `complete` bucket. This was NOT a single-line regex addition as the plan's literal text suggested — see Key Decisions below for why, and for the collision it required guarding against.

**F9 — cross-reference.** Both classifier copies carry a comment naming the other file, at each of the three buckets (complete/in-progress/planned). Decided paired comments over a shared literal list (see Key Decisions).

**F10 — strict-pass-freshness.ts baseline classification.** `runValidate()` now distinguishes "no baseline exists at all" (`hasBaseline = baselinePasses.size > 0`) from "this folder was a recorded baseline pass" (`wasBaselinePass`). A currently-failing folder with no baseline gets a new `'first-run'` status instead of `'regression'`. A currently-failing folder with a real baseline that recorded it as a pass still correctly reports `'regression'`. Added `firstRun` to the JSON payload and the text-mode summary line.

**REQ-006 — reconciliation.** Re-ran `STATUS_CROSS_DOC_CONSISTENCY` on `006-presentation-layer-fixes` and `010-query-channel-calibration` after the classifier fix landed. Both now correctly compare (previously both were "not applicable; one status is missing or unclassified") and both agree cleanly (`complete` == `complete` on both sides). No docs edit needed. Recorded explicitly here and in spec.md rather than left unstated, per REQ-006's own instruction for the no-mismatch case.

### Files Changed

- `.opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh` — F6 (REQ-001, REQ-002)
- `.opencode/skills/system-spec-kit/scripts/lib/status-classifier.sh` — F7, F9 (REQ-003, REQ-004), plus the `not implemented` collision guard
- `.opencode/skills/system-spec-kit/scripts/sweep/strict-pass-freshness.ts` — F7, F9, F10 (REQ-003, REQ-004, REQ-005), plus the same collision guard
- `.opencode/skills/system-spec-kit/scripts/tests/validation-gate-hardening.vitest.ts` — new regression coverage for all four fixes, added to the existing test file that already exercised these three scripts (no new test infrastructure created)

No other files were touched. `006-presentation-layer-fixes` and `010-query-channel-calibration`'s own docs were NOT edited — REQ-006's re-run showed clean agreement, so the conditional docs-edit authorization in spec.md's Files-to-Change table was not triggered.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented in dependency order matching plan.md's resequenced phases: Phase 1 (F7+F9, status classifier) first since it was confirmed live against real packets, Phase 2 (F6, evidence checker) second, Phase 3 (F10, freshness sweep) third. Each fix was fixture-tested in isolation before moving to the next. After Phase 1 landed, ran the real `check-scaffold-never-touched.sh` and `check-status-cross-doc-consistency.sh` rules against the two real sibling packets named in spec.md rather than trusting the plan's own (partially incorrect) description of their behavior. After Phase 2 landed, ran the real `EVIDENCE_CITED` rule against every checklist.md/tasks.md-bearing folder under `.opencode` (originally reported as "2,121 folders"; independently re-verified 2026-07-09 as 2,235 folders — see Known Limitations) before and after the fix, not just the four named fixture lines, to measure actual blast radius. After Phase 3 landed, built a real synthetic known-failing spec folder inside `scratch/` (required — `strict-pass-freshness.ts` rejects roots outside the repo) and ran the sweep against it both with and without a baseline file, then cleaned the fixture up. All temporary scan scripts and fixtures live under the session scratchpad or were deleted after use; none were committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**F9 cross-reference: paired comments, not a shared literal list.** spec.md §7 left this open. Chose paired comments because spec.md's own Out-of-Scope bullet rules out "building a general-purpose bash/TypeScript shared-config-loading mechanism," and its open question notes paired comments "match this repo's existing bash/TypeScript-duplication precedent elsewhere." A shared JSON/text list would need a bash-side parser (no `jq` dependency currently exists in this rule set) for zero real benefit over a comment, since the two word lists are edited together in the same packet anyway.

**F6 DEFERRED-bypass scope: unconditional beyond the existing case-statement.** spec.md §7 left this open too. Chose no new minimum-length floor, following spec.md's own risk-mitigation text verbatim ("Keep the existing trivial-placeholder case-statement as the floor"). Verified this doesn't reopen a loophole: `[DEFERRED: tbd]` (already in the case-statement) still fails; `[DEFERRED: blocked on operator decision]` (not in the case-statement, real prose) now passes.

**F7 implementation correction: added a collision guard the plan's literal text didn't anticipate.** REQ-003's literal instruction was "add implemented/implementing to the complete bucket regex." Implementing that literally first, then testing it against `classify_status "Not Implemented"`, showed it returns `complete` instead of `planned` — the new `implemented` word collided with the `planned` bucket's pre-existing `not implemented` / `not yet implemented` phrases, because bucket checks run in order (complete checked before planned) and bash's `[[ =~ ]]` has no lookbehind to exclude the "not " prefix inline. Confirmed this is not theoretical: `not implemented` and `Planned (not implemented)` are real, current Status values in multiple live, non-028 packets (`system-skill-advisor/008-skill-advisor-cli/{001,002,003}/spec.md`, `system-deep-loop/z_archive/009-.../009-fanout-remediation/implementation-summary.md`, four `z_future/code-graph-and-cocoindex/002-code-graph-trace/*/implementation-summary.md` files). Since `complete` also feeds `check-scaffold-never-touched.sh`'s ERROR-severity gate, shipping the naive version would have broken `validate.sh --strict` on those unrelated packets the next time anyone re-validated them.

Fixed it with a second, separately-guarded check (both in bash and TypeScript): `implemented`/`implementing` counts as `complete` only when not immediately preceded by `not (yet )`. This stays inside the same function REQ-003 already authorizes editing — it is not a new file, not a new scope, and does not touch the pre-existing, unrelated `not started`/`started` collision between the `in-progress` and `planned` buckets (confirmed that one already exists today, unmodified, out of this phase's scope). Verified with 17 test strings covering both the required REQ-003 cases and the newly-found collision cases; bash and TypeScript outputs are identical for all 17.

This is the one place implementation diverged from plan.md's literal text rather than following it exactly. It was not silently improvised: the divergence is the minimum fix required to make REQ-003 actually true (recognize Implemented as complete) without breaking already-correct existing behavior (recognize "not implemented" as planned), and is documented here, in spec.md's Implementation Findings addendum, and in tasks.md's T005 evidence line for review.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

**Fixture-level (all four fixes):**
- F6: 4/4 fixture outcomes confirmed (bare filename now fails, filename:linenum still passes, non-trivial DEFERRED now passes, trivial DEFERRED still fails) — both via a standalone script and as a permanent vitest case.
- F7/F9: `classify_status`/`classifyStatus` confirmed identical across 17 test strings including the two real REQ-003 acceptance strings and the `not implemented`/`not yet implemented`/`Planned (not implemented)` collision cases — both via direct sourcing/node and as a permanent vitest case.
- F10: built a real synthetic known-failing folder, confirmed it genuinely fails `validate.sh --strict` (Errors: 6), then ran the sweep both with no baseline (`status: "first-run"`, `regressions: 0`) and with a baseline recording it as a prior pass (`status: "regression"`, `regressions: 1`) — both via direct invocation and as a permanent vitest case.

**Integration-level:**
- `validate.sh --strict` re-run on `006-presentation-layer-fixes`: `STATUS_CROSS_DOC_CONSISTENCY` now compares and agrees (`complete`==`complete`); `SCAFFOLD_NEVER_TOUCHED` clean.
- `validate.sh --strict` re-run on `010-query-channel-calibration`: `STATUS_CROSS_DOC_CONSISTENCY` now compares and agrees (`complete`==`complete`); `SCAFFOLD_NEVER_TOUCHED` now FAILS with 4 real scaffold markers — see Known Limitations, not fixed here.
- Real `EVIDENCE_CITED` rule re-run (sourced directly, not simulated) against repo folders carrying checklist.md/tasks.md, before and after the F6 fix: a number of folders flip pass→warn, 0 flip warn→pass. Flipped lines spot-checked by hand against the rule's own remaining shape checks; all confirmed genuine bare-filename-only citations with no other evidence signal — zero false positives found. **CORRECTION (independently re-verified 2026-07-09, see Known Limitations for full methodology):** the original "5 within this packet's own 028 parent (009, 010, 011, 012, 014)" was wrong. Only **`009-validation-integrity-hardening`** and **`010-query-channel-calibration`** currently flip; `012-orphan-sweep-scoped-scan-safety`, `013-drift-marker-pipeline-resilience`, and `014-self-healing-internals-hardening` do not and never did. `011-automatic-drift-self-healing` flipped in an earlier pass (matching the original claim at that time) but was independently edited by a concurrent, unrelated session mid-investigation (confirmed via file mtimes) to add real evidence content, and no longer flips as of the final re-test.

**Build/typecheck/tests:**
- `npm run typecheck` (`tsc --noEmit --composite false -p tsconfig.json`) in `scripts/`: exit 0, no output.
- `npm run build` (`tsc --build`) in `scripts/`: exit 0, no output.
- `strict-pass-freshness.ts` is not in `scripts/tsconfig.json`'s `include` list (confirmed by reading it), so it is not covered by the project build/typecheck above. Ran a standalone `tsc --noEmit` against it with the project's own compiler flags (`--target es2022 --module es2022 --moduleResolution node --strict --esModuleInterop --skipLibCheck --types node`): 0 diagnostics.
- `npx vitest run tests/validation-gate-hardening.vitest.ts` (the test file that already exercised all three touched scripts, now extended with the new regression coverage): 9/9 tests passed (6 pre-existing + 3 new), run twice for a clean confirmation.
- Full `npx vitest run --config mcp_server/vitest.config.ts --root . scripts/tests/` (the properly-scoped `@spec-kit/scripts` package test surface — 123 files): **17 test files failed | 99 passed | 7 skipped (123); 26 tests failed | 1,123 passed | 48 skipped (1,197)**. Investigated all 17 failing files individually, not just by name: none reference `status-classifier`, `check-evidence.sh`, `classify_status`, or `classifyStatus` (confirmed via `grep`); `graph-metadata-refresh.vitest.ts`'s failures trace to a completely separate `deriveStatus()` function in `mcp_server/lib/graph/graph-metadata-parser.ts` that this packet never touches (confirmed via direct `grep`); `multi-ai-council-validator.vitest.ts` and `review-record-validation.vitest.ts` (both of which DO call `validate.sh --strict` on real fixtures, so were checked most carefully) fail on `FILE_EXISTS`/`LEVEL_MATCH`/`SECTION_COUNTS` — rules this packet never touches — reproduced manually outside vitest to confirm; `gate-3-classifier.vitest.ts`'s 4 failures are Gate-3 prompt-satisfaction logic, unrelated. The remaining files (`coverage-graph-*`, `session-isolation.vitest.ts`) import modules confirmed absent anywhere in the source tree via `find` (not merely unbuilt). All pre-existing, none caused by this packet.
- A first, wider attempt (`--config mcp_server/vitest.config.ts --root .` with no path filter, spanning `mcp_server/tests` + `scripts/tests` + `system-deep-loop/runtime/tests`) hit a worker-fork crash under confirmed CPU contention with a concurrent session's own simultaneous vitest run in this same repo (`ps aux` showed a second `vitest run` process writing to this same scratchpad) and did not print a final summary; the properly-scoped run above superseded it with a complete, clean result.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/015-validation-hardening-fixes --strict`: `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0 — confirmed after also fixing two self-inflicted issues surfaced by the packet's own tightened rules: two `tasks.md` evidence lines that used literal `[DEFERRED: ...]` example syntax in prose (the rule correctly parsed them as real, trivial deferral markers) were reworded, and `graph-metadata.json`/frontmatter `last_updated_at` were regenerated/refreshed after the doc edits.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`010-query-channel-calibration` newly fails `SCAFFOLD_NEVER_TOUCHED` — not fixed here.** F7's fix correctly un-masks a real, pre-existing defect: `010`'s `plan.md:2`, `tasks.md:2`, `implementation-summary.md:2`, and `checklist.md:2` all still carry literal `[template:level_2/...]` text in their frontmatter `title` fields, left over from scaffolding and never cleaned up. This packet's Files-to-Change table only conditionally authorizes editing `006`/`010`'s `spec.md`/`implementation-summary.md`, and only for REQ-006's Status-field purpose — not `plan.md`/`tasks.md`/`checklist.md` frontmatter titles, and REQ-006 itself only names `STATUS_CROSS_DOC_CONSISTENCY`, not `SCAFFOLD_NEVER_TOUCHED`. Needs an operator decision: fix `010`'s scaffold titles in a follow-up packet, or accept the new `--strict` failure on that packet until then.
2. **80 repo-wide folders newly flip `EVIDENCE_CITED` from pass to warn — not fixed here.** All 80 were relying solely on the bare-filename loophole REQ-001 closes; none had real evidence content. Under `--strict`, a WARN-severity result is a non-zero exit (exit 2 under strict-tier mapping, per `validate.sh` — corrected 2026-07-10; this note previously said exit 1), so any of these folders' own `validate.sh --strict` will newly fail instead of returning exit 0 the next time someone re-validates them. This packet's own scope, by design (see spec.md's Out-of-Scope and REQ-006's narrow framing), does not extend to backfilling evidence citations in unrelated folders across the repo.
   **CORRECTION (independently re-verified 2026-07-09, ~21:06–21:26 CEST):** the original "83 of 2,121, 5 within this packet's own 028 parent (009, 010, 011, 012, 014)" figure was wrong on both counts, not just the within-parent breakdown.
   - **Within-parent (corrected):** only `009` and `010` actually flip — not 5, not 3. `012`, `013`, and `014` never relied on the loophole and pass `EVIDENCE_CITED` in both the reconstructed pre-fix and the real post-fix run. `011` is the interesting case: it DID flip in an earlier pass during this same re-verification (matching the original claim), but a concurrent, unrelated editing session in this repo modified `011`'s `checklist.md`/`tasks.md` mid-investigation (file mtimes 21:15–21:16 CEST, folder marked `??` untracked in git) to add real evidence content; a second re-test against a frozen snapshot taken immediately after (21:25:50 CEST) confirms `011` no longer flips. The original list's `012`/`014` inclusion was never accurate at any point tested; its `011` inclusion was accurate once and then stopped being accurate mid-session.
   - **Repo-wide total (corrected, re-scoped):** re-running the same before/after comparison across every `checklist.md`/`tasks.md`-bearing folder under `.opencode` (2,235 folders as of this re-verification, deliberately excluding `.worktrees/` — ~19,600 duplicate `checklist.md` files from git-worktree checkouts of this same repo, not independent content, and almost certainly excluded from the original count too since "2,121" is far closer to the `.opencode`-only total than the `.worktrees`-inclusive one) gives **80 flips, 0 reverse** — not 83 of 2,121. This repo is under active, unrelated concurrent edit outside this packet's control (confirmed twice during this re-verification: the `011` edit above, and a second in-flight packet, `016-cross-package-flag-governance`, whose `tasks.md` was created mid-scan — it does not flip), so an exact repeat of the original 83 is not achievable and 80/2,235 should be read as a timestamped snapshot, not a fixed constant.
3. **The pre-existing `not started` vs `started` bucket collision was found but not fixed.** While investigating the `not implemented` collision (see Key Decisions), confirmed `classify_status "Not Started"` already returns `in-progress` instead of `planned`, unrelated to and unmodified by this packet's changes (the `in-progress` bucket's `started` word already shadows the `planned` bucket's `not started` phrase, and this predates this packet). Left untouched — same category of bug, but a bucket-ordering issue with no explicit requirement or task naming it in this phase's scope.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
