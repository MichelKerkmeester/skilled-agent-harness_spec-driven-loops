---
title: "Acceptance Criteria: Phase 12: fix-deep-review-p1-p2-findings-for-source-root-migration"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "source root remediation acceptance"
  - "deep review fix closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/012-fix-deep-review-p1-p2-findings-for-source-root-migration"
    last_updated_at: "2026-09-18T10:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 12: fix-deep-review-p1-p2-findings-for-source-root-migration

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 041-skilled-source-root-migration/012-fix-deep-review-p1-p2-findings-for-source-root-migration
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
| AC-001 | REQ-001 | Given the changed hooks, When a commit and a push run in this worktree and in the main checkout, Then both pass and the hook suites pass | Commit and push output. Suite output at the fix SHA | Unmet | - |
| AC-002 | REQ-002 | Given four layouts, When `findSourceRoot` runs, Then it returns `.skilled`, `.skilled`, `.opencode` and `.opencode` for both, skilled-only, legacy-only and placeholder `.skilled` | `.skilled/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts:212` 42/42, per-entry and placeholder rows included | Met | - |
| AC-003 | REQ-003 | Given every hook and checker, When the selection test runs, Then every block is identical, no tree path names a root directly, and each layout selects the right root | `.skilled/scripts/git-hooks/tests/source-root-selection.test.sh:40`, `:53`, `:67` 38/38. A drifted block and a reintroduced `$REPO_ROOT/.opencode` path each fail it | Met | - |
| AC-004 | REQ-004 | Given a hook naming a missing `$REPO_ROOT/.skilled/...` input, When the gate-input check runs, Then it fails naming that path | `.github/scripts/tests/check-gate-inputs.test.sh:436` to `:454`, 48/48. Reverting the variable-path fix fails case 43 | Met | - |
| AC-005 | REQ-005 | Given a checkout with one root name, When the `gate-inputs.yml` loop runs, Then it finds and runs the hook suites | `.github/workflows/gate-inputs.yml:32` run locally in a `.skilled`-only and an `.opencode`-only checkout ran both suites. An empty checkout exits 1 | Met | - |
| AC-006 | REQ-006 | Given a legacy-only fixture, When the Codex installer writes hooks, Then every command path exists | `.skilled/bin/tests/install-codex-hooks-source-root.test.cjs:155` 21/21. The pre-fix installer fails the three new rows | Met | - |
| AC-007 | REQ-007 | Given a legacy-only tree and a tree with no source root, When the generator builds, Then the first walks `.opencode` and the second refuses before writing | `.skilled/skills/system-spec-kit/runtime/cli/tests/retrieval-repo-root.vitest.ts:52` 22/22. The pre-fix walker fails both new cases | Met | - |
| AC-008 | REQ-008 | Given a project with only `.opencode`, When the three plugins resolve rules, skill doc and installer, Then they read existing files | `.opencode/plugins/tests/source-root-consumers.test.cjs:59`, `:74`, `:88` 7/7. The pre-fix plugins fail all three `.opencode` rows | Met | - |
| AC-009 | REQ-009 | Given the workflow, When `.skilled/package.json` or its lockfile changes, Then a trigger path matches | `.github/workflows/spec-kit-check.yml:21` to `:24`. `fnmatch` matches both manifests on push and pull request | Met | - |
| AC-010 | REQ-010 | Given the Chrome installer, When its help prints, Then no deleted file is named | `.skilled/skills/mcp-tooling/mcp-chrome-devtools/scripts/install.sh:9`. `.skilled/bin/tests/mcp-installers.test.cjs:59` fails on the pre-fix help | Met | - |
| AC-011 | REQ-011 | Given sk-doc's README, When its flowchart validator path is followed, Then the file exists | `.skilled/skills/sk-doc/README.md:191` names `sk-design/sk-design-diagram/scripts/validate-flowchart.sh`, which exists | Met | - |
| AC-012 | REQ-012 | Given every `INSTALL-GUIDE.md`, When the corpus test validates each, Then all pass | `.skilled/skills/sk-doc/scripts/tests/install-guide-contract.test.cjs:44`. All 11 tracked guides exit 0 and a pre-fix guide fails the sweep | Met | - |
| AC-013 | REQ-013 | Given the six guard workflows, When a push lands on `main` or `skilled/**`, Then each triggers or records why it cannot | `.github/workflows/skill-doc-frontmatter.yml:13` and the five siblings push on `main` and `skilled/**`. Trigger table at `.github/workflows/README.md:47` | Met | - |
| AC-014 | REQ-014 | Given the per-entry layout and the two installers, When their tests run, Then they pass, and fail against a malformed layout or a deleted helper | `.skilled/bin/tests/opencode-compat-layout.test.cjs:60` 23/23 and `.skilled/bin/tests/mcp-installers.test.cjs:71` 5/5. The old manifest and a missing helper each fail | Met | - |
| AC-015 | REQ-015 | Given angle 10's output, When each finding is checked against the tree, Then each is fixed or recorded with a reason | `../review/iterations/iteration-010.md:1` holds the re-run's ten findings. `../review/review-report.md:162` records each as confirmed and fixed, with one generated-file residue recorded | Met | - |
| AC-016 | REQ-016 | Given a project with only `.opencode`, When the advisor builds its signature, Then it hashes that root's skills | `.opencode/plugins/tests/system-skill-advisor.test.cjs:470` and `:494` 29/29. The pre-fix plugin fails both | Met | - |
| AC-017 | REQ-017 | Given the three docs, When each named path is tested, Then each exists or is no longer named | `.opencode/SYNC.md:30` checked by `.skilled/bin/tests/opencode-compat-layout.test.cjs:60`. `PUBLIC-RELEASE.md` and `.github/workflows/README.md:47` name only files that exist | Met | - |
| AC-018 | REQ-018 | Given the two `_utils.sh` copies, When one differs, Then the check fails | `.skilled/bin/tests/mcp-installers.test.cjs:49` fails when one copy gains a line | Met | - |
| AC-019 | REQ-019 | Given the active sk-doc surfaces, When an install-guide route returns, Then the negative test fails | `.skilled/skills/sk-doc/scripts/tests/install-guide-contract.test.cjs:54` failed when a routing surface was mutated to offer install-guide authoring. `:63` guards the central folder | Met | - |

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

Written when the packet closes.
<!-- /ANCHOR:closure -->
