---
title: "Changelog: Phase 3: Exact-Wording Guards and Iron Law Cleanup [142-sk-code-ponytail-based-refinement/003-wording-invariant-guards]"
description: "Chronological changelog for the Phase 3 wording invariant and Iron Law guard work."
trigger_phrases:
  - "phase changelog"
  - "rule canary"
  - "wording invariants"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/142-sk-code-ponytail-based-refinement/003-wording-invariant-guards` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/142-sk-code-ponytail-based-refinement`

### Summary

Phase 3 made load-bearing wording observable. Instead of relying on memory that critical strings should stay exact, it added a rule canary that checks the live repo and fails loudly when protected wording drifts. The guard is intentionally small, dependency-free and focused on parsed or safety-critical strings.

### Added

- T-007 recorded alignment-drift exit 0, comment-hygiene on the `.js` exit 0 and scope limited to only three new files.

### Changed

- T-001 reconfirmed the exact Review status strings for per-file scope, the Iron Law lines in `sk-code/SKILL.md` and `CLAUDE.md`.
- T-002 wrote `check-rule-copies.js` as ESM with no dependencies and `--root` support.
- `check-rule-copies.js` uses exact-substring checks per file, Iron-Law-line token checks, collects all failures and treats a missing file as a failure.
- T-003 wrote `check-rule-copies.test.sh` with `run_case` style. It passes on the real repo, fails on a missing triplet and fails on a reworded Iron Law.
- T-004 wrote `.github/workflows/rule-canary-sync.yml`. It runs on pull requests to `main`, runs the canary, emits `::error::` on drift and emits `::warning::` with exit 0 if missing.
- T-005 ran `node --check`, `node check-rule-copies.js` and the test suite. The checks were OK, exit 0 and 3/3 PASS.
- T-006 ran a tampered-root negative control and got exit 1, proving the canary catches drift.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| Task ledger | PASS: 10 completed task item(s) recorded |
| Node syntax | PASS: `node --check` OK |
| Canary | PASS: `node check-rule-copies.js` exited 0 |
| Test suite | PASS: `check-rule-copies.test.sh` reported 3/3 PASS |
| Negative control | PASS: tampered root exited 1 |
| Hygiene and drift | PASS: comment-hygiene on the `.js` exited 0 and alignment-drift exited 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `check-rule-copies.js` | Created | Added dependency-free invariant checker |
| `check-rule-copies.test.sh` | Created | Added real-repo and negative-control shell tests |
| `.github/workflows/rule-canary-sync.yml` | Created | Added pull-request canary workflow |

### Follow-Ups

- The canary guards a fixed list of files and strings. When a new load-bearing string appears, the `INVARIANTS` list must be extended.
- The tiny invariant list is intentional and limited to parsed or safety strings.
- The workflow gates pull requests to `main`. It does not run on feature-branch pushes, matching the existing comment-hygiene gate scope.
- Not committed. Changes sat in the working tree on branch `028-mcp-to-cli-tool-transition`.
