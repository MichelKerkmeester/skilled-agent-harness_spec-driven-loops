---
title: "Acceptance Criteria: spec-kit runtime rename"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-spec-kit-runtime-rename"
    last_updated_at: "2026-09-04T19:16:06Z"
    last_updated_by: "code-agent"
    recent_action: "Recorded the move, the dependency audit and the gate evidence against each criterion"
    next_safe_action: "Run the ten-iteration review on the moved tree for AC-005"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: spec-kit runtime rename

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 053-spec-kit-runtime-rename
**Level:** 3
**Status:** Complete
**Date:** 2026-09-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the engine package, When the tree is inspected, Then it exists only at `.opencode/skills/system-spec-kit/runtime/`, is named `@spec-kit/runtime`, and carries `lib/`, `scripts/`, `hooks/` and `tests/` at its root | `runtime/package.json:2`; `ls .opencode/skills/system-spec-kit/runtime`; `grep -n mcp runtime/package.json` returns nothing | Met | - |
| AC-002 | REQ-002 | Given the new path, When `validate.sh --strict` runs on this packet, Then it prints `RESULT: PASSED` | `validate.sh specs/system-speckit/053-spec-kit-runtime-rename --strict` -> exit 0, Errors 0, `RESULT: PASSED` | Met | - |
| AC-003 | REQ-002 | Given the new path, When the continuity writer is invoked, Then it runs from `scripts/dist/` without a resolution error | `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --help` -> exit 0 | Met | - |
| AC-004 | REQ-002 | Given the moved adapters, When each registered hook is executed once with an empty payload, Then none reports a missing module | 19 adapters across `.claude`, `.codex`, `.cursor`, `.devin` -> every exit 0, zero `MODULE_NOT_FOUND` | Met | - |
| AC-005 | REQ-002 | Given the moved root, When the dist-freshness guard runs, Then it records a build for both watched entries | `cd runtime && npm run rebuild` -> exit 0, `dist build preparation recorded` twice | Met | - |
| AC-006 | REQ-003 | Given the manifest, When each dependency is traced, Then every remaining entry names a live consumer and every removed one has none | `scratch/inventory.md` §4; manifest drops 9 of 12 entries, `chokidar` last after the review pass found its advisor fallback shadowed | Met | - |
| AC-007 | REQ-003 | Given the pruned manifest, When the lockfile is regenerated, Then a fresh install resolves without drift | `npm install` at the workspace root -> removed 126 packages; `npm ci --dry-run` -> exit 0 | Met | - |
| AC-008 | REQ-004 | Given the whole repository, When the old path and npm name are searched over live surfaces, Then nothing outside historical evidence names them | `rg` -> 0 hits; `git grep` -> 0 hits; no symlink targets the old path | Met | - |
| AC-009 | REQ-004 | Given the moved tree, When the repository gates run, Then the residue sweep, doctor routes, command references, skill-root audit, derived freshness and routing guard all pass | six gates, each exit 0; `counts.live` 0; guard green after the `cli-external-orchestration` re-mint | Met | - |
| AC-010 | REQ-005 | Given the moved tree, When a ten-iteration review runs, Then it reports no P0 and no P1 | lineage `review/lineages/luna-max-pass3`: ten iterations, verdict PASS, 0 P0, 0 P1, 2 P2 fixed at `85d9791eb3`; the three earlier attempts and their fixes sit beside it | Met | - |

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

All ten criteria are met: the package moved, the manifest names only dependencies
a resolution trace reaches, every gate that ran on the old path runs on the new one,
and the ten-iteration review on the moved tree reports no P0 and no P1.
<!-- /ANCHOR:closure -->
