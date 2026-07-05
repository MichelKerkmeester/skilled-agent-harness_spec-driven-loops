---
title: "Implementation Summary: Close-out and tail"
description: "The sk-code parent close-out tail shipped three commits: review identity label cleanup, advisor scorer and cli-opencode routing repair, and rename-invariant TOML restoration."
trigger_phrases:
  - "sk-code close-out summary"
  - "review identity cleanup shipped"
  - "advisor scorer repair shipped"
  - "rename invariants restored"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/014-close-out-and-tail"
    last_updated_at: "2026-07-05T04:34:34.172Z"
    last_updated_by: "gpt-5.5"
    recent_action: "doc-backfill"
    next_safe_action: "Handle deferred follow-ups"
    blockers:
      - "Canonical reindex and skill-graph recompile are gated by broken daemon state"
    key_files:
      - ".opencode/skills/sk-code/review/SKILL.md"
      - ".opencode/skills/sk-code/review/manual_testing_playbook/"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/scorer/advisor-quality-049-003.vitest.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/rename-invariants.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Remaining advisor-suite failures are owned by other in-flight sessions and were left untouched"
      - "Review is a mode of sk-code, not a standalone sk-code-review skill identity"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-close-out-and-tail |
| **Completed** | 2026-07-05 |
| **Level** | 2 |
| **Actual Effort** | Already-shipped code work plus documentation backfill |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Closed the tail of the sk-code parent program with three pushed commits. The phase retired stale review identity labels, repaired advisor scorer behavior for the folded review model and explicit OpenCode CLI delegation, and restored rename-invariant TOML test reads.

### Review identity cleanup

Commit `027882bfd0` changed the review mode identity from `code-review` to `review` in `.opencode/skills/sk-code/review/SKILL.md`. It also replaced 77 stale `sk-code-review` identity labels with `review` across 24 files under `.opencode/skills/sk-code/review/manual_testing_playbook/`, while keeping the intentional `sk-code-review` search keyword.

### Advisor scorer repair

Commit `ea689d84e0` fixed three advisor scorer failures. Two were stale tests from the pre-fold two-skill world and now assert `sk-code`, because the hub owns review. The real routing regression was the prompt `Use cli-opencode to delegate this coding task through OpenCode CLI`; the explicit lane penalty was widened to `-3.0` so repeated bare `opencode` tokens no longer saturate `sk-code` and hide the explicit orchestrator intent.

### Rename-invariant repair

Commit `dd9487d65d` fixed a committed parse error in `.opencode/skills/system-skill-advisor/mcp_server/tests/rename-invariants.vitest.ts`. The test once again reads `.codex/config.toml` for TOML assertions instead of pointing them at JSON config.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-code/review/SKILL.md` | Updated | Retire stale review skill-name identity |
| `.opencode/skills/sk-code/review/manual_testing_playbook/` | Updated | Replace stale identity labels in review playbooks |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Updated | Restore explicit cli-opencode routing for OpenCode CLI delegation prompts |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/advisor-quality-049-003.vitest.ts` | Updated | Retarget stale review scorer expectation |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts` | Updated | Retarget stale review expectation and cover cli-opencode routing |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/rename-invariants.vitest.ts` | Updated | Restore `.codex/config.toml` TOML reads |
| `.opencode/specs/skilled-agent-orchestration/124-sk-code-parent/014-close-out-and-tail/` | Created | Backfill Level 2 phase documentation |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The code work shipped as remote commits `027882bfd0`, `ea689d84e0`, and `dd9487d65d`. The verification path was target-first: review cleanup gates, advisor target suites and parity report, full-suite baseline delta, and rename-invariant target suite were checked before the remaining failures were classified as unrelated concurrent work.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Use `review` as the mode identity | Review is now a mode of `sk-code`, not a standalone `sk-code-review` skill |
| Keep the `sk-code-review` search keyword | Search compatibility remains useful while identity labels move to `review` |
| Retarget stale review scorer tests to `sk-code` | The folded model makes `sk-code` the advisor owner for review prompts |
| Widen cli-opencode disambiguation to `-3.0` | The old `-0.5` penalty was invisible after sk-code saturated on repeated bare `opencode` tokens |
| Leave eight remaining advisor failures untouched | They belonged to other sessions' dirty or WIP work, not this phase |
| Defer reindex and skill-graph recompile | The daemon was flagged broken, so generated graph artifacts were not trustworthy |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Review identity cleanup | Pass | `027882bfd0` | `parent-skill-check` strict exit 0, `check-rule-copies` plus test exit 0, review-tree links clean |
| Advisor target suites | Pass | `ea689d84e0` | Three target suites 39/39 green |
| Full advisor suite delta | Pass | `ea689d84e0` | Stashed baseline 13 failures to 9 failures, zero new failures |
| Advisor parity report | Pass | `ea689d84e0` | 197-prompt advisor-parity-report byte-identical |
| Rename invariants | Pass | `dd9487d65d` | Target suite 4/4 green |
| Phase docs strict validation | Pass | Phase 014 docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/124-sk-code-parent/014-close-out-and-tail --strict` |

### Test Coverage Summary

| File | Statements | Branches | Functions |
|------|------------|----------|-----------|
| Review identity and playbook docs | Covered by parent-skill and link checks | N/A | N/A |
| Advisor scorer explicit lane | Covered by target scorer suites | Covered by cli-opencode regression prompt | N/A |
| Rename invariants test | Covered by 4/4 target suite | N/A | N/A |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | Avoid broad advisor parity churn | 197-prompt parity report byte-identical | Pass |
| NFR-S01 | No secrets introduced | Changed files are docs, scorer code, and tests | Pass |
| NFR-R01 | Target suites green | Advisor 39/39 and rename-invariants 4/4 green | Pass |
| NFR-R02 | Remaining failures classified | Eight failures assigned to other sessions' in-flight work | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Canonical reindex and skill-graph recompile remain deferred because the daemon was flagged broken.
2. Lane-C fresh baseline re-derivation remains open.
3. `.worktrees/0014-sk-code-parent` cleanup remains open.
4. Phase 015 sibling alignment remains open.
5. Eight advisor-suite failures remain outside this phase: seven from concurrent dirty advisor files and one from deep-loops/036 WIP playbook row.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Close out code tail | Completed and pushed in three commits | Matches phase scope |
| Canonical reindex plus skill-graph recompile | Deferred | Daemon was flagged broken |
| Lane-C fresh baseline re-derivation | Deferred | Explicitly gated follow-up |
| Worktree cleanup | Deferred | Explicitly open follow-up |
| Phase 015 sibling alignment | Deferred | Explicitly separate sibling work |

<!-- /ANCHOR:deviations -->
