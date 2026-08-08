---
title: "Changelog: README Migration Audit [032/005]"
description: "Chronological changelog for the post-flip documentation-drift audit, its independent review, and the resulting fix swarm."
trigger_phrases:
  - "phase changelog"
  - "readme migration audit"
  - "specs root doc drift"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-07 to 2026-08-08

> Spec folder: `specs/system-speckit/032-relocate-specs-folder/005-readme-migration-audit` (Level 1)
> Parent packet: `specs/system-speckit/032-relocate-specs-folder`

### Summary

Three passes. First: a dual-executor `/deep:review` (deepseek-flash completed all 10 iterations; glm-high never spawned a process, root-caused to a confirmed silent-failure gap in the shared fan-out runtime, out of scope here) found 20 places still describing the pre-flip topology, including two real functional gaps. Second: an independent read-only review (gpt-5.6-sol, max effort) audited the whole packet's own completion claims against real repo state and found 12 more issues — 6 in this phase's own documentation, 6 in wider tooling the migration had surfaced but nobody had followed up on. Third: a 3-way parallel fix swarm (gpt-5.6-luna, max effort, cli-codex + cli-opencode + cli-pi) resolved all 12, with two dispatched fixes independently re-verified and corrected before landing.

### Fixed — round 1 (the original 20 findings)

- **Real functional bugs (2):** `check-no-spec-imports.cjs` only checked imports against `.opencode/specs` — a canonical-path `specs/...` import could bypass the durable no-spec-import guard entirely. `memory-drift-marker.sh` diffed `git diff-tree` against `-- .opencode/specs`, which after the flip matches only the symlink blob itself, never the real tree — every drift-marking hook was silently detecting zero changes. Verified empirically: 0 lines detected with the old pathspec, 16 with the fixed one, same commit range.
- **18 documentation findings:** README examples, config-resolution-order claims, and cross-reference links across `system-spec-kit`, `sk-design`, `sk-doc`, `system-deep-loop`, `.opencode/bin`, and the repo root README canonicalized to `specs/`.
- 2 findings (F012: `.txt` command-help files; F020: a closed historical packet's example commands) were initially deferred exactly as the review recommended, then fixed on request.

### Fixed — round 2 (the independent review's 12 findings)

- **This phase's own doc accuracy (6):** added the missing `review/review-report.md` this phase's own `spec.md` required as evidence; reconciled phase 003's `plan.md`, which still said "Not run" after execution; corrected three wrong numeric/commit-hash claims (a "61-test" matrix that was really 15 cases, a "25 files" count that was 26, a rebased-away commit hash cited as stable); fixed three internally-contradictory completion-metadata pairs; qualified the "20/20 fixed" headline next to F020's disclosed caveat instead of leaving it buried.
- **Wider tooling gaps the migration surfaced (6):** `.github/workflows/routing-registry-drift.yml` watched 0 tracked files under a legacy path filter; the mandatory `runtime-no-spec-import.yml` CI gate was permanently red because `compiled-route-guard.cjs`'s `authoredDrift()` genuinely reads the authored spec tree at verify-time (a real runtime dependency, not a false positive — fixed to canonical path and given the same properly-justified exemption `compiled-route-sync.cjs` already has); `process-memory-harness.ts` had two real `TS2739` type errors; `/doctor:update`'s 6 `find .opencode/specs` checks (no symlink-follow) silently saw zero spec packets; `index-scope.ts`'s default code-graph exclusion only matched the legacy path (dormant, no live caller, confirmed via grep); the F017 regression harness still built its own fixtures under the legacy path so its assertion against the fixed pathspec could never pass.

### Fixed — round 3 (self-caught gaps in round 2's own fix pass)

- Phase 003's `plan.md` Definition of Done: the dispatched fix updated the prose but never checked the 3 DoD boxes as instructed.
- Phase 004's `graph-metadata.json` stayed `in_progress` despite `spec.md` saying Complete. Root cause, confirmed via a live A/B: 12 checklist items were legitimately deferred N/A but left as `[ ]` instead of `[x]`, which is what the metadata backfill tool's status derivation actually gates on — not the spec.md prose. Flipped all 12 to match the sibling phase's own established convention; status flipped from `in_progress` to `complete`.

### Fixed — follow-up (2026-08-08, on operator request)

- F020's fix (round 1) was correct for what it scoped — the `.opencode/specs` → `specs` prefix swap — but the review had already flagged, and this phase's own docs disclosed, that the example commands in that closed packet's `prompts/README.md` still didn't resolve: a stale track name (`system-spec-kit` vs the real `system-speckit`) and a stale folder depth (`003-continuity-memory-runtime` vs the real `003-memory-and-causal-runtime/001-continuity-memory-runtime`), both leftovers from an unrelated document reorganization. Fixed all 12 references in that file; verified every one resolves against the real repo now.

### Verification

- `check-no-spec-imports.cjs` exits 0 for real (not masked); both its fixtures still behave correctly; `tsc --noEmit` 0 errors; `index-scope.vitest.ts` 8/8; the harness's all 7 scenarios pass; `validate.sh --recursive --strict` 0/0 across all 6 folders in the parent packet.

### Notes

An operator instruction misread mid-session led to a broken `git stash push`/`pop` sequence that briefly pulled in an unrelated stash meant for a different branch (`system-deep-loop/0129-036-remediation-execution`); caught immediately via diff-line-count matching, cleanly discarded with zero data loss (the original stash was never consumed). A second, similar conflict during a later rebase resolved the same way — both were the concurrent session's own superseded pre-commit drafts, already landed by their own subsequent commits.
