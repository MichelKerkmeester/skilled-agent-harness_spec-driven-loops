---
title: "Acceptance Criteria: Phase 10: upgrade-reversibility"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "upgrade reversibility acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/010-upgrade-reversibility"
    last_updated_at: "2026-10-08T04:22:46Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 10: upgrade-reversibility

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/016-research-recommendations/010-upgrade-reversibility
**Level:** 2
**Status:** Planned
**Date:** 2026-10-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a dirty tree, When `--apply` runs without a manifest, Then the tool writes a manifest to `<git-dir>/upgrade-legacy.manifest.json` before any change | Test `upgrade-legacy.vitest.ts::dirty-tree-writes-manifest` exercises this, exit code 0 | Unmet | - |
| AC-002 | REQ-001 | Given a dirty tree where manifest location is not writable, When `--apply` runs, Then the tool refuses with a clear error message | Test `upgrade-legacy.vitest.ts::dirty-tree-unwritable-manifest` exercises this, exit code 2 | Unmet | - |
| AC-003 | REQ-002 | Given an apply run on a dirty tree, When examining `<git-dir>/upgrade-legacy.manifest.json` with `<git-dir>` from `git -C <REPO> rev-parse --absolute-git-dir`, Then it records HEAD SHA, timestamp, the baseline map, and a before-image for each dirty file the run touched, and restoring one gives the original bytes | Test `upgrade-legacy.vitest.ts::manifest-before-image-restores` | Unmet | - |
| AC-004 | REQ-003 | Given a committed tree with a baseline, When dry run is requested, Then the output shows every finding the baseline will downgrade, with packet path, rule, and the error-to-warning transition | Dry run output includes a "Downgrades" section; grep output for "Downgrade" or "warning" | Unmet | - |
| AC-005 | REQ-004 | Given a dirty tree with a manifest that has a baseline, When `--apply` runs a second time on the same tree, Then the output shows zero new planned changes and exit code 0 | Test `upgrade-legacy.vitest.ts::dirty-tree-idempotent` runs apply twice on same fixture, asserts zero plan diff on second run | Unmet | - |
| AC-006 | REQ-005 | Given a session where a manifest was written, When a different session reads the manifest and validates the tree state, Then the baseline from the manifest is restored and used for downgrades | Test `upgrade-legacy.vitest.ts::manifest-recovery` creates manifest in one fixture context, reads in another, asserts baseline applied | Unmet | - |
| AC-007 | REQ-006 | Given the test suite, When it runs, Then all three reversibility paths (committed tree, dirty tree, manifest recovery) pass with no failures | `npm run test -- upgrade-legacy.vitest.ts`, exit code 0 | Unmet | - |
| AC-008 | REQ-007 | Given the README, When searching for "reversibility", "manifest", and "recovery", Then each section explains the guarantee and shows the manifest structure and recovery procedure | `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` grep finds all three terms with explanations | Unmet | - |
| AC-009 | REQ-001 | Given REPO is not a git repository, When `--apply` runs, Then the tool refuses before any write | Test `upgrade-legacy.vitest.ts::no-git-refuses-apply`, exit code 2 | Unmet | - |

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

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
