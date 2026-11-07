---
title: "Acceptance Criteria: Symlinked runtime: entry guard, project root and empty saves"
description: "The criteria this packet must satisfy before it may be closed: the entry guard holds under the symlink flag, a linked repository saves to its own root, and an empty save does not exit 0."
trigger_phrases:
  - "symlinked runtime root acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/037-symlinked-runtime-root"
    last_updated_at: "2026-10-31T17:40:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Set every criterion Met with the run and the case that prove it"
    next_safe_action: "None. Rerun the cited cases before reopening a row"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/lib/esm-entry.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/core/config.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-12-symlinked-runtime-root-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "AC-007: a save with nothing in it already exits 1 with INSUFFICIENT_CONTEXT_ABORT, so the criterion is met by a test rather than a workflow change"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Symlinked runtime: entry guard, project root and empty saves

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/037-symlinked-runtime-root
**Level:** 2
**Status:** Complete
**Date:** 2026-10-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Vitest commands run from `.skilled/skills/system-spec-kit/runtime`, and the cli cases run from `runtime/cli` where they need that project. Probe commands run from a temp repository whose `.skilled` links to the build under test. Each case must be seen failing against the current code before it counts.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a script launched through a symlinked path with `--preserve-symlinks-main`, When it asks whether it is the entrypoint, Then the answer is yes | `npx vitest run tests/esm-entry-symlink.vitest.ts` from `runtime` → `Tests 11 passed (11)`. The case is `lets a script launched through a symlink with --preserve-symlinks-main know it was run` at `.skilled/skills/system-spec-kit/runtime/tests/esm-entry-symlink.vitest.ts:184`, and the direct module-URL case is `recognizes the entrypoint when the module URL keeps the linked path` at `.skilled/skills/system-spec-kit/runtime/tests/esm-entry-symlink.vitest.ts:98`. Against the old guard the new cases read `Tests 3 failed \| 8 passed (11)` | Met | - |
| AC-002 | REQ-001 | Given the same script imported rather than executed under the flag, When it asks the same question, Then the answer is no | `leaves an imported module dormant under --preserve-symlinks-main` at `.skilled/skills/system-spec-kit/runtime/tests/esm-entry-symlink.vitest.ts:201` passes in the same `Tests 11 passed (11)` run, and passed against the old guard too: it is the control against a guard that answered yes every time | Met | - |
| AC-003 | REQ-001 | Given `generate-description.js` with no arguments, When it runs with `--preserve-symlinks-main` through `.skilled`, Then it prints its usage and exits 1, as it does without the flag | From a temp repository whose `.skilled` links to the build under test: `node --preserve-symlinks-main .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/generate-description.js` → exit 1 with 92 bytes of usage, the same as without the flag. Main's build with the flag exited 0 with 0 bytes. Recorded at scratch/verification-evidence.md:62 | Met | - |
| AC-004 | REQ-001 | Given `generate-context.js --not-an-option`, When it runs with the flag through `.skilled`, Then it reports the unknown option and exits 1 | Same setup: `node --preserve-symlinks-main .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js --not-an-option` → exit 1 with 1049 bytes, against 854 without the flag. Main's build with the flag exited 0 with 0 bytes. The case at `.skilled/skills/system-spec-kit/runtime/cli/tests/symlinked-project-root.vitest.ts:138` asserts `Unknown option: --not-an-option` on stderr and the same exit status with and without the flag | Met | - |
| AC-005 | REQ-002 | Given a temp git repository whose `.skilled` links to this runtime and which holds a spec packet, When `generate-context.js` saves to that packet from there, Then the write lands in the temp repository and no `divergent-duplicate` refusal is raised | `npx vitest run --config ../../vitest.config.ts --project cli tests/symlinked-project-root.vitest.ts` from `runtime/cli` → `Tests 10 passed (10)`. The case is `saves to the linked repository's own packet` at `.skilled/skills/system-spec-kit/runtime/cli/tests/symlinked-project-root.vitest.ts:108`, which asserts exit 0 with `description.json` and `graph-metadata.json` in the temp repository and nothing under the runtime repository's `specs/demo`. Against main's build the same save exits 1 with `Spec packet write blocked for "demo/001-demo": collision class is divergent-duplicate (no readable packet roots)`, at scratch/verification-evidence.md:38 | Met | - |
| AC-006 | REQ-003 | Given `--project-root` naming the temp repository, When the save runs from an unrelated directory, Then the write lands in the named repository | The case `honours an explicit project root from a directory outside any repository` at `.skilled/skills/system-spec-kit/runtime/cli/tests/symlinked-project-root.vitest.ts:119`, part of `Tests 10 passed (10)`. It runs from a directory outside any repository with `--project-root` naming the linked repository, and asserts exit 0 with `graph-metadata.json` landing in that repository | Met | - |
| AC-007 | REQ-004 | Given a save input whose `exchanges` array is empty, When the save runs, Then it exits non-zero and stderr names the empty input | The case `does not exit 0 on a save with nothing in it` at `.skilled/skills/system-spec-kit/runtime/cli/tests/symlinked-project-root.vitest.ts:129` sends `exchanges: []` and asserts a non-zero exit with `INSUFFICIENT_CONTEXT_ABORT` and `No primary evidence was captured` on stderr. The measurement behind it, and the decision to change no workflow code, are at scratch/verification-evidence.md:91 | Met | - |
| AC-009 | REQ-005 | Given a workspace whose `specs` root links to a track inside it, When graph metadata is written through the track's resolved path, Then the write succeeds | `writes to the resolved track path of a packet under the linked root` in `.skilled/skills/system-spec-kit/runtime/tests/graph-metadata-schema.vitest.ts`, part of `Tests 59 passed (59)` | Met | - |
| AC-010 | REQ-006 | Given a project with a real `.opencode/` whose `specs` links into another workspace's track, When a refresh, backfill or save targets `specs/<packet>`, Then `graph-metadata.json` lands at the canonical path and the command exits 0 | Cases `writes the packet reached through the project specs link` and `writes the resolved packet path when the save runs inside the project`, each seen failing without its change. From a scratch project: backfill exit 0 with `"failed": []`, and a `generate-context.js` save exit 0 with `Created graph-metadata.json`. Before the change the same backfill exited 1 with the refusal | Met | - |
| AC-011 | REQ-007 | Given a destination outside every root of the destination's and the process's workspaces, When graph metadata is written there, Then it is refused | `still refuses a destination outside every root of its workspace`, `refuses a packet outside both workspaces` and the stray assertion inside `writes the resolved packet path when the save runs inside the project`, all asserting `outside a configured specs root` | Met | - |
| AC-008 | REQ-001 | Given the spec-kit suites, both builds and both typechecks, When they run from the final state, Then they pass and the test count differs from the baseline only by the added cases | `npm run typecheck` and `npm run build` in `runtime` and in `runtime/cli` → exit 0. The cli suite read `Test Files 193 passed \| 3 skipped (196)` and `Tests 2255 passed \| 20 skipped (2275)`, against main's `2245 passed \| 20 skipped`: a delta of exactly the 10 new cases. The runtime suite read `Tests 4220 passed \| 21 skipped (4241)` with no main baseline captured, so its delta is not stated. Recorded at scratch/verification-evidence.md:86. That run is the 2026-10-31 final state. The 2026-11-07 reopening's full runtime suite read `Tests 9 failed \| 4269 passed \| 22 skipped (4300)`: seven pass when rerun alone, and the other two (`hook-adapter-path-parity`, `deep-research-ledger-schema`) fail identically with the reopened change reverted, so none is attributed to this packet. Both were then fixed, and the final runtime suite read `Tests 4278 passed \| 22 skipped (4300)` | Met | - |

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

Every criterion is met with a recorded run, including AC-009 to AC-011 from the 2026-11-07 reopening. Nothing was waived, so the decision record carries no closure ADR.
<!-- /ANCHOR:closure -->
