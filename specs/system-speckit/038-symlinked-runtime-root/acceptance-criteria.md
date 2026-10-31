---
title: "Acceptance Criteria: Symlinked runtime: entry guard, project root and empty saves"
description: "The criteria this packet must satisfy before it may be closed: the entry guard holds under the symlink flag, a linked repository saves to its own root, and an empty save does not exit 0."
trigger_phrases:
  - "symlinked runtime root acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/051-symlinked-runtime-root"
    last_updated_at: "2026-10-12T12:00:00Z"
    last_updated_by: "claude-opus-5.5"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Write the T001 to T003 cases and record each failing against the current code"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/lib/esm-entry.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/core/config.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-12-symlinked-runtime-root-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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

**Packet:** system-speckit/051-symlinked-runtime-root
**Level:** 2
**Status:** Planned
**Date:** 2026-10-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Vitest commands run from `.skilled/skills/system-spec-kit/runtime`. Probe commands run from the `AI Systems` repository, whose `.skilled` links to this runtime. Each case must be seen failing against the current code before it counts.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a script launched through a symlinked path with `--preserve-symlinks-main`, When it asks whether it is the entrypoint, Then the answer is yes | `npx vitest run tests/esm-entry-symlink.vitest.ts -t "recognizes the entrypoint under preserve-symlinks-main"`. Fails today because `cli/lib/esm-entry.ts:40` compares a canonical launch path with a non-canonical module URL | Unmet | - |
| AC-002 | REQ-001 | Given the same script imported rather than executed under the flag, When it asks the same question, Then the answer is no | `npx vitest run tests/esm-entry-symlink.vitest.ts -t "stays dormant on import under preserve-symlinks-main"`. The control: a guard that always answered yes would pass AC-001 and fail here | Unmet | - |
| AC-003 | REQ-001 | Given `generate-description.js` with no arguments, When it runs with `--preserve-symlinks-main` through `.skilled`, Then it prints its usage and exits 1, as it does without the flag | `node --preserve-symlinks-main .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/generate-description.js`, then read its exit status. On 2026-10-12 this printed 0 bytes and `0`, against usage and `1` without the flag | Unmet | - |
| AC-004 | REQ-001 | Given `generate-context.js --not-an-option`, When it runs with the flag through `.skilled`, Then it reports the unknown option and exits 1 | `node --preserve-symlinks-main .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js --not-an-option`, then read its exit status. On 2026-10-12 this printed 0 bytes and `0`, against an error and `1` without the flag | Unmet | - |
| AC-005 | REQ-002 | Given a temp git repository whose `.skilled` links to this runtime and which holds a spec packet, When `generate-context.js` saves to that packet from there, Then the write lands in the temp repository and no `divergent-duplicate` refusal is raised | A case named `saves to the linked repository's own packet` in `cli/tests/generate-context-linked-root.vitest.ts`. Fails today because `cli/core/config.ts:299` resolves the root to this runtime repository | Unmet | - |
| AC-006 | REQ-003 | Given `--project-root` naming the temp repository, When the save runs from an unrelated directory, Then the write lands in the named repository | A case named `honours an explicit project root` in the same file. Fails today because the CLI rejects `--project-root` as an unknown option | Unmet | - |
| AC-007 | REQ-004 | Given a save input whose `exchanges` array is empty, When the save runs, Then it exits non-zero and stderr names the empty input | A case named `does not exit 0 on an empty save` in the same file. Fails today because `cli/core/workflow.ts:1517-1520` only warns and the save exits 0 | Unmet | - |
| AC-008 | REQ-001 | Given the spec-kit suites, both builds and both typechecks, When they run from the final state, Then they pass and the test count differs from the baseline only by the added cases | `npm test` in `runtime` and in `runtime/cli`, with the baseline captured at T004 | Unmet | - |

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

Planned. No criterion has been worked yet.
<!-- /ANCHOR:closure -->
