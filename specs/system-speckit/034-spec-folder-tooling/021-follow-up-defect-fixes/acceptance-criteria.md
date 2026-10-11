---
title: "Acceptance Criteria: Phase 21: follow-up-defect-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met or else waived or superseded by a decision record."
trigger_phrases:
  - "follow up defect fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/021-follow-up-defect-fixes"
    last_updated_at: "2026-10-11T12:13:52Z"
    last_updated_by: "closeout"
    recent_action: "All 35 rows Met. Pushed as 01db8367c3, CI green except main's corpus pin"
    next_safe_action: "Monitor main CI and reopen only for a new tooling defect"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planner-021-follow-up-defect-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 21: follow-up-defect-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/021-follow-up-defect-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-10-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a `--folder` whose parent is a link outside every root, a working directory outside every repository and no `--roots`, When the default healer runs with `--apply`, Then the outside `spec.md` keeps its digest and the run follows decision 1, answered "Refuse, ask for --roots" (exit 2 with a message that names `--roots`) | scratch/evidence/lane-1-healer.txt:26, RED, GREEN, MUTANTS and NEIGHBOR | Met | - |
| AC-002 | REQ-002 | Given an `.opencode`-anchored specs folder outside the repository, When the backfill CLI runs `--all --root` on it in apply mode, Then it exits nonzero before any write and no `graph-metadata.json` exists under that folder | scratch/evidence/lane-2-backfill.txt:35, Red, Green and Mutants | Met | - |
| AC-003 | REQ-003 | Given a root with no `.opencode` anchor, When `executeBackfill` runs with `pruneReport`, Then `writePruneReportArtifact` throws, no report file exists and no temporary file is left | scratch/evidence/lane-2-backfill.txt:35, Red, Green and Mutants | Met | - |
| AC-004 | REQ-004 | Given `specs/002-alias` linked to `specs/001-real`, When `archive.sh --force specs/002-alias` runs, Then no link is left dangling and the outcome follows decision 2, answered "Refuse a linked argument" (exit 1 before any copy, both folders unchanged and a message that names `001-real`) | scratch/evidence/lane-3-archive.txt:20, Red, Green and Mutant proof | Met | - |
| AC-005 | REQ-005 | Given a `leaf-manifest.json` that is a live link to fresh bytes, or a dangling link, When `generate-leaf-manifest.cjs --check` runs, Then it exits 2 with `symbolic link, not followed` and reads nothing through the link | scratch/evidence/lane-4-leaf-check.txt:25, Red, Green, Mutant M4-a and Hub check | Met | - |
| AC-006 | REQ-006 | Given a reversibility manifest that is a link to an outside manifest with a matching HEAD, When upgrade-legacy reads it, Then the run refuses the link and reuses no baseline from it | scratch/evidence/lane-5-upgrade-legacy.txt:24, Red, Green and Mutants M5-a and M5-b | Met | - |
| AC-007 | REQ-007 | Given `--roots linkOut/../specs` with `linkOut` linked outside the repository, When upgrade-legacy resolves its roots, Then it exits 2 before any walk, and a plain `--roots specs` still resolves | scratch/evidence/lane-5-upgrade-legacy.txt:24, Red, Green and Mutants M5-a and M5-b | Met | - |
| AC-008 | REQ-008 | Given a rewrite target that becomes a link to an outside file after planning, When repair-derived applies, Then the recorded reads hold no outside path and the FAILED line names the link refusal | scratch/evidence/lane-6-repair-derived.txt:21, Red, Green, Mutants M6-a and Probe outside the suite | Met | - |
| AC-009 | REQ-009 | Given a `description.json` that becomes invalid JSON holding a marker string after planning, When repair-derived applies, Then the FAILED line names the file and the parse failure and does not contain the marker | scratch/evidence/lane-6-repair-derived.txt:21, Red, Green and Mutants M6-b | Met | - |
| AC-010 | REQ-010 | Given an implementation summary that lists 13 files, When the nested changelog generator runs, Then the Files Changed table holds 13 rows, and a 12-file fixture holds 12 | scratch/evidence/lane-7-changelog.txt:21, Red, Green and Mutant M7-a | Met | - |
| AC-011 | REQ-011 | Given a paragraph with an inline HTML comment, one on a single line and one across a line break, When the generator writes the changelog, Then no `<!--` and no comment text appear in the output | scratch/evidence/lane-7-changelog.txt:21, Red, Green and Mutant M7-b | Met | - |
| AC-012 | REQ-012 | Given a lean phase parent with no implementation summary and a stored `in_progress`, When every child is `complete`, Then it derives `complete`, and When one child is `in_progress` or has no metadata, Then it derives `in_progress` | scratch/evidence/lane-8-lean-parent.txt:57, sections 4, 9 and Mutants M8-a and M8-b | Met | - |
| AC-013 | REQ-013 | Given a repository root with no `scratch/` folder, When `ci-rule-set-comparison.vitest.ts` runs, Then the root still has no `scratch/` folder after the run | scratch/evidence/lane-9-test-hygiene.txt:27, Red (a), Green and Mutant M9-a | Met | - |
| AC-014 | REQ-014 | Given one busy loop per CPU core, When T046-26 runs, Then it passes on the median of its repeated calls, and When `loadPerFolderDescription` is slowed by 6 ms, Then it fails | scratch/evidence/lane-21-t046-under-load.txt:25, scratch/evidence/lane-21-t046-under-load.txt:28, scratch/evidence/lane-21-t046-under-load.txt:31, scratch/evidence/lane-21-t046-under-load.txt:34 and scratch/evidence/lane-21-t046-under-load.txt:37 | Met | - |
| AC-015 | REQ-015 | Given a session launched through `worktree-session.sh`, When its runtime starts, Then `AI_SESSION_CHILD` is not `1` in its environment, and When a descendant calls the launcher, Then no second worktree is allocated | scratch/evidence/lane-10-child-marker.txt:42, Red, Green, Mutants M10-a and M10-b, AI_SESSION_CHILD consumers | Met | - |
| AC-016 | REQ-016 | Given the Hermes plugin and the gate core, When the same environment is read by both, Then both class the session the same way under the rule decision 4 sets, answered "AI_SESSION_CHILD=1 alone" | scratch/evidence/lane-10-child-marker.txt:43, Red, Green, Mutant M10-c and Follow-up: ENFORCE scope | Met | - |
| AC-017 | REQ-017 | Given the final state, When the 19-job gate, packet validation and 034 parent validation run, Then every required suite meets its T002 baseline and both validators print RESULT: PASSED | Evidence: scratch/evidence/lane-24-final-gate.txt:64, scratch/evidence/lane-24-final-gate.txt:238, scratch/evidence/lane-24-final-gate.txt:242, scratch/evidence/lane-24-final-gate.txt:245 and scratch/evidence/lane-24-final-gate.txt:250. Lane 29 validation: scratch/evidence/lane-29-final-rederive.txt:34 and scratch/evidence/lane-29-final-rederive.txt:36. G7 ran 117 steps with 115 rc 0. The deep-loop suite had one in-gate timeout outside this phase and passed alone with 2,896 passed and 8 skipped. Main's journey-proof failure is recorded under Decision 30. Every suite this phase touches met or beat T002. Both validators printed RESULT: PASSED. | Met | - |
| AC-018 | REQ-018 | Given --restore reaches a packet through a link below specs, When archive.sh runs, Then it exits 1 and moves neither the archived source nor the destination | scratch/evidence/lane-3-archive.txt:64, RESTORE REFUSAL and Mutant M3-b | Met | - |
| AC-019 | REQ-019 | Given spec.md is a link, When declaredLevel and levelFromSpec read its level, Then both refuse before reading content and keep the established linked-document exit status 0 | scratch/evidence/lane-1-healer.txt:71, scratch/evidence/lane-1-healer.txt:86. LANE 1 ADDENDUM, SCOPE NOTE, GREEN and MUTANTS. | Met | - |
| AC-020 | REQ-020 | Given the measured re-derive read set and an inside-packet linked input, When the child starts, Then it follows the inside link and refuses or skips a link that leaves the packet | scratch/evidence/lane-6-repair-derived.txt:74, scratch/evidence/lane-6-repair-derived.txt:119, scratch/evidence/lane-6-repair-derived.txt:121, scratch/evidence/lane-6-repair-derived.txt:130, scratch/evidence/lane-13-inside-links.txt:111, scratch/evidence/lane-13-inside-links.txt:164 and scratch/evidence/lane-13-inside-links.txt:206 | Met | - |
| AC-021 | REQ-021 | Given the launcher tilde path case, When shellcheck runs after the pattern fix, Then it reports no SC2088 warning and the case still behaves as before | scratch/evidence/lane-10-child-marker.txt:103, Follow-up: case pattern | Met | - |
| AC-022 | REQ-022 | Given SYSTEM_SPEC_GATE_ENFORCE is set by the operator, When a dispatched child starts, Then only that path exports SYSTEM_SPEC_GATE_ENFORCE=0 and launched sessions keep the operator value | scratch/evidence/lane-10-child-marker.txt:94, Follow-up: ENFORCE scope | Met | - |
| AC-023 | REQ-023 | Given an unknown healer option or a missing --folder or --roots value, When any healer mode starts, Then it exits 2 before work begins | scratch/evidence/lane-1-healer.txt:120, scratch/evidence/lane-1-healer.txt:135. LANE 1 ADDENDUM 2, GREEN and MUTANTS. | Met | - |
| AC-024 | REQ-024 | Given .skilled/release/.apply.lock exists, When upgrade-legacy starts apply, Then it exits 2 before changes | scratch/evidence/lane-5-upgrade-legacy.txt:69, scratch/evidence/lane-5-upgrade-legacy.txt:88. Section 2, test counts and Mutant M5-c. | Met | - |
| AC-025 | REQ-025 | Given a canonical source document is a link, When readDoc or computeSourceDocHashes handles it, Then readDoc refuses before reading and computeSourceDocHashes skips it like a missing document | scratch/evidence/lane-8-lean-parent.txt:86, section 10, Changes, Red cases, Counts and Mutants | Met | - |
| AC-026 | REQ-026 | Given open boxes in 016 children 003, 009, 011 and 015, When the audit and requested follow-up runs finish, Then each box has evidence or remains open with a matching child status | scratch/evidence/lane-11-016-audit.txt:6, scratch/evidence/lane-11-016-audit.txt:9, scratch/evidence/lane-11-016-audit.txt:11, scratch/evidence/lane-16-009-compat-run.txt:16, scratch/evidence/lane-17-t022-corpus.txt:117, scratch/evidence/lane-18-hostile-rerun.txt:37, scratch/evidence/lane-18-hostile-rerun.txt:42, scratch/evidence/lane-20-016-residual-boxes.txt:11, scratch/evidence/lane-20-016-residual-boxes.txt:21, scratch/evidence/lane-20-016-residual-boxes.txt:31, scratch/evidence/lane-20-016-residual-boxes.txt:40, scratch/evidence/lane-23-015-per-mode.txt:24, scratch/evidence/lane-23-015-per-mode.txt:78, scratch/evidence/lane-23-015-per-mode.txt:167, scratch/evidence/lane-23-015-per-mode.txt:252, scratch/evidence/lane-23-015-per-mode.txt:330, scratch/evidence/lane-23-015-per-mode.txt:426, ../016-research-recommendations/015-lane-rules-as-heal-modes/implementation-summary.md:194 and ../016-research-recommendations/015-lane-rules-as-heal-modes/implementation-summary.md:200 | Met | - |
| AC-027 | REQ-027 | Given a file or directory link whose real path stays inside the packet, When graph readers and re-derive inspect it, Then they follow it while refusing or skipping outside and dangling links | scratch/evidence/lane-13-inside-links.txt:111, scratch/evidence/lane-13-inside-links.txt:112, scratch/evidence/lane-13-inside-links.txt:113, scratch/evidence/lane-13-inside-links.txt:204, scratch/evidence/lane-13-inside-links.txt:205 and scratch/evidence/lane-13-inside-links.txt:206 | Met | - |
| AC-028 | REQ-028 | Given the removed --mode or --json flags, When the healer receives either flag, Then it exits 2 with specific guidance and other unknown flags keep the generic message | scratch/evidence/lane-14-removed-flags.txt:7, scratch/evidence/lane-14-removed-flags.txt:10, scratch/evidence/lane-14-removed-flags.txt:20 and scratch/evidence/lane-14-removed-flags.txt:28 | Met | - |
| AC-029 | REQ-029 | Given a plain folder outside the supplied specs root or a folder reached through a linked parent, When the healer refuses it, Then the message states the cause that applies | scratch/evidence/lane-15-refusal-wording.txt:7, scratch/evidence/lane-15-refusal-wording.txt:8, scratch/evidence/lane-15-refusal-wording.txt:13, scratch/evidence/lane-15-refusal-wording.txt:14, scratch/evidence/lane-15-refusal-wording.txt:20, scratch/evidence/lane-15-refusal-wording.txt:28, scratch/evidence/lane-15-refusal-wording.txt:35 and scratch/evidence/lane-15-refusal-wording.txt:60 | Met | - |
| AC-030 | REQ-030 | Given the deprecated specs/sk-communication track has been removed, When the D26 impact check is reviewed, Then the tracked-file, link and metadata-consumer checks are recorded | scratch/evidence/decision-ledger.txt:44 | Met | - |
| AC-031 | REQ-031 | Given the review findings P2-1 through P2-7, When the fix lanes complete, Then system-link wording, linked-directory containment, archive prefix checks, restore wording, release-note manifest naming, incomplete-child rollup and catalog wording are corrected | scratch/evidence/lane-19-opus-review.txt:25, scratch/evidence/lane-13-inside-links.txt:106, scratch/evidence/lane-15-refusal-wording.txt:46, scratch/evidence/lane-3-archive.txt:82 and scratch/evidence/decision-ledger.txt:52 | Met | - |
| AC-032 | REQ-032 | Given a document has leading frontmatter and no description, When description fill runs, Then the first body sentence is used instead of a frontmatter key, the code fix passes red and green checks, the reverted-fix mutant fails, all 40 affected descriptions are repaired and affected packet validation finds no new failures | scratch/evidence/lane-22-fill-description.txt:12, scratch/evidence/lane-22-fill-description.txt:15, scratch/evidence/lane-22-fill-description.txt:73, scratch/evidence/lane-22-fill-description.txt:76, scratch/evidence/lane-22-fill-description.txt:109, scratch/evidence/lane-22-fill-description.txt:114 and scratch/evidence/lane-22-fill-description.txt:121 | Met | - |
| AC-033 | REQ-033 | Given the backfill CLI imports `getSpecsBasePaths` through `@spec-kit/runtime/api`, When the CLI check runs, Then the import policy passes without an allowlist entry | scratch/evidence/lane-26-import-policy.txt:4 and scratch/evidence/lane-26-import-policy.txt:63 | Met | - |
| AC-034 | REQ-034 | Given the two tests run in a repository without a pre-existing root `scratch/`, When both tests finish, Then neither leaves a root `scratch/` folder that it created | scratch/evidence/lane-27-root-scratch.txt:18, scratch/evidence/lane-27-root-scratch.txt:25 and scratch/evidence/lane-27-root-scratch.txt:52 | Met | - |
| AC-035 | REQ-035 | Given `upgrade-legacy` encounters a dangling reversibility-manifest link, When it runs in dry-run or apply mode, Then it refuses the link and creates nothing at its target | scratch/evidence/lane-28-dangling-manifest.txt:4, scratch/evidence/lane-28-dangling-manifest.txt:10 and scratch/evidence/lane-28-dangling-manifest.txt:22 | Met | - |

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

**Closeable:** Yes

AC-001 to AC-035 are Met. The packet was pushed as 01db8367c3. Post-push CI passed 13 of 14 workflows. Routing Registry Drift Guard failed because main's pinned corpus changed before this push.
<!-- /ANCHOR:closure -->
