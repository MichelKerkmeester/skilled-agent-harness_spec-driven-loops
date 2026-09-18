---
title: "Acceptance Criteria: Phase 14: fix-pre-existing-defects-found-by-migration"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "pre-existing defects acceptance"
  - "phase 14 closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/014-fix-pre-existing-defects-found-by-migration"
    last_updated_at: "2026-09-18T18:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Met the criteria the local tree proves"
    next_safe_action: "Push on approval, watch CI"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 14: fix-pre-existing-defects-found-by-migration

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 041-skilled-source-root-migration/014-fix-pre-existing-defects-found-by-migration
**Level:** 2
**Status:** In Progress
**Date:** 2026-09-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase changes, When every local suite runs, Then none fails | Node runner: 89 files, 1,007 pass, 0 fail, against 88 files, 1,001 pass, 1 fail at the phase 13 tip. Spec-kit `root` and `cli` projects: 254 files, 2,724 pass, 0 fail. Standalone deep-loop suite: 154 files, 2,684 pass, 0 fail, run from `.skilled/skills/system-deep-loop/runtime/vitest.config.ts:17`. sk-doc script tests: all 24 pass | Met | - |
| AC-002 | REQ-002 | Given a scaffolded hub, When its versions are compared, Then `SKILL.md` matches its router files and the scaffold proof passes | `.skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py:69` sets `1.0.0.0`. `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/create-journey-proof.test.cjs:118` passes; it failed on the version before this change | Met | - |
| AC-003 | REQ-003 | Given the sk-doc script tests, When each runs as written, Then all pass | `.skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` passes all 24, four of which failed before. `test_create_skill_contract.py:276` follows the renamed heading; `test_validator.py:54` now proves a README with a TOC is rejected | Met | - |
| AC-004 | REQ-004 | Given the regenerated trigger index, When it is searched for deleted files, Then none is listed | `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` publishes, and `rg` for the deleted paths in the index and its three companion files finds nothing. The generator refused until `.skilled/skills/cli-external-orchestration/cli-cursor/benchmark/README.md:24` held the paragraph phase 13 had put in its frontmatter | Met | - |
| AC-005 | REQ-005 | Given a deep-loop test run, When it finishes, Then the tracked council database is unchanged | `.skilled/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts:84` honours the override. `.skilled/skills/system-deep-loop/runtime/tests/integration/council-graph-script.vitest.ts:31` fails before the fix and passes after; a full standalone run left the file clean | Met | - |
| AC-006 | REQ-006 | Given the reinstalled Codex hooks, When the installer checks them, Then it reports no drift | `.skilled/bin/install-codex-hooks.mjs --check` from the main checkout reports OK. The prior file is kept at `~/.codex/hooks.json.bak-before-phase14-20260918T191907`, and all 26 of the operator's other hooks are kept | Met | - |
| AC-007 | REQ-007 | Given a checkout whose only source root is `.opencode`, When hook flags, search roots and plugin logs resolve, Then each lands under `.opencode` | `.skilled/hooks/shared/hook-flags.test.cjs:129`, `.skilled/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts:207` and `.opencode/plugins/tests/mcp-route-guard.test.cjs:47` each fail before the fix. All 22 rewritten hook imports resolve to `hooks/shared/` from their run location, for example `.skilled/skills/system-spec-kit/runtime/hooks/codex/session-start.ts:23` | Met | - |
| AC-008 | REQ-008 | Given the new workflows, When their steps run in a clean clone under Node 22, Then both pass | `.github/workflows/sk-doc-script-tests.yml:51` passed in a shallow clone. `.github/workflows/deep-loop-runtime.yml:60` in the same clone: 150 of 154 files passed at depth one; the other four bind events to the commit's parent, which a depth-one checkout lacks, and pass 86/86 with full history, which the job now fetches | Met | - |
| AC-009 | REQ-009 | Given the pushed tip, When CI runs, Then every workflow passes | Not yet pushed | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

Every criterion the local tree can prove is met. CI on the pushed tip is outstanding.
<!-- /ANCHOR:closure -->
