---
title: "Acceptance Criteria: Phase 1: relocation-engine"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "relocation engine acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/001-relocation-engine"
    last_updated_at: "2026-11-13T10:07:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-relocation-engine"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: relocation-engine

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/001-relocation-engine
**Level:** 2
**Status:** Draft
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`R` is `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs`. `COPY` is a throwaway copy of the repository.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a valid map, When `node R --map <file>` runs without `--apply`, Then no file changes and the exit code is 1, and a second `--apply` run on an applied map exits 0 | Real tree: `relocate.mjs --map scratch/sample-map.json` exit 1, `git status --porcelain` identical before and after. COPY: first `--apply` exit 0, second `--apply` printed `relocate: nothing to do` and exit 0 | Met | - |
| AC-002 | REQ-002 | Given each input mode, When `--map`, `--from` with `--to`, and `--renumber <folder>` run in `COPY`, Then each one plans the expected moves | COPY dry runs: `--map` listed 3 moves (re-parent, tracked, untracked), `--from demo/006-alpha --to demo/008-alpha` listed that pair, `--renumber demo` listed 006-alpha -> 004-alpha and 007-delta -> 005-delta (001 skipped, held by an archived packet), `--renumber demo/003-qq` printed nothing to do | Met | - |
| AC-003 | REQ-003 | Given a map with a collision, a mixed track, a second subtrack level, a bad name or a dirty path, When the dry run starts, Then it exits 2 before any write and names the refusal | COPY dry runs, each exit 2 with a `refused:` line naming the path: collision, mixed track, second sub-track level, bad name, number taken, dirty path, outside specs, symlinked folder. `git status --porcelain` unchanged across all of them | Met | - |
| AC-004 | REQ-004 | Given one tracked and one untracked packet, When both move with `--apply`, Then `git status` shows a rename for the tracked one and the untracked one exists at its new path | COPY fixture apply: `git status --porcelain` printed `RM specs/demo/001-alpha/spec.md -> specs/demo/006-alpha/spec.md` and `?? specs/demo/007-delta/` for the untracked packet | Met | - |
| AC-005 | REQ-005 | Given a moved packet, When the apply finishes, Then `description.json` holds the new `specFolder`, `specId`, `folderSlug` and `parentChain` and `graph-metadata.json` holds the new `packet_id` | COPY sample apply: `rg -c` of the old id over the moved `description.json` and `graph-metadata.json` exit 1 (no match). description holds specFolder sk-git/worktree-lifecycle/007-standards-template-round-trip, specId 007, folderSlug standards-template-round-trip, parentChain [sk-git, worktree-lifecycle] | Met | - |
| AC-006 | REQ-006 | Given a moved packet with `goal.md`, `acceptance-criteria.md`, `resource-map.md` and `decision-record.md`, When `repair-derived.cjs --roots <dest> --apply` runs, Then each `packet_pointer` names the new path and `METADATA_DISK_PATH_CONSISTENCY` passes | COPY: `SPECKIT_RULES=METADATA_DISK_PATH_CONSISTENCY bash validate.sh <dest>` printed `RESULT: PASSED`. `repair-derived.cjs --roots <dest>` dry run printed `repairable=0 failed=0` | Met | - |
| AC-007 | REQ-007 | Given a phase child moved to another parent, When the apply finishes, Then the old parent's `children_ids` lacks the old id, the new parent's holds the new id, and `sweep-track-roots.mjs` exits 0 | COPY fixture apply: `rg -c` old child id in specs/demo/002-pp/graph-metadata.json exit 1, new id in specs/demo/003-qq/graph-metadata.json printed 1, `sweep-track-roots.mjs` exit 0 | Met | - |
| AC-008 | REQ-008 | Given another packet that names the moved one in `manual.depends_on` and in a markdown link, When the apply finishes, Then both name the new id and an id that only shares a prefix is untouched | COPY fixture apply: `rg -l` of the three old ids over specs found none outside the adversarial fixture, whose `shasum -c` printed OK (byte-identical). manual.depends_on and relative links from a moving and a staying file name the new path. Sample apply: only the input map file still names the old id | Met | - |
| AC-009 | REQ-009 | Given an applied map, When the run ends, Then `relocation-ledger.json` holds the map and `cite-drift-redirects.json` was rebuilt | COPY: `rg -c '"from": "sk-git/commit-standards/006-standards-template-round-trip"'` on the ledger printed 1. Step `redirect table (cite-drift-scan --rebuild-redirects): ok` | Met | - |
| AC-010 | REQ-010 | Given an applied map, When the run ends, Then the trigger index and `specs/descriptions.json` name the new path | COPY: `generate-trigger-index.mjs --check` exit 0 after both applies. Fixture cache row: `rg -c` old id in specs/descriptions.json exit 1, new specFolder row count 1 | Met | - |
| AC-011 | REQ-011 | Given a map that moves `specs/sk-doc/z_archive/019-skill-routing-refactor`, When the dry run starts, Then it reports `.skilled/bin/lib/compiled-route-layout.cjs` and exits 2 without rewriting it | Real tree dry run of specs/sk-doc/z_archive/019-skill-routing-refactor exit 2, named `.skilled/bin/lib/compiled-route-layout.cjs:54` and routing-registry-drift.yml lines 69 and 118. `git diff --stat .skilled/bin` printed nothing | Met | - |
| AC-012 | REQ-012 | Given an applied map, When the close step runs, Then each moved packet prints `RESULT: PASSED` and a forced validation failure leaves the report and exits 2 | COPY: sample apply output ended `RESULT: PASSED` for the moved packet. A packet without plan.md moved with `--apply` printed `x FILE_EXISTS`, `RESULT: FAILED` and exit 2 | Met | - |
| AC-013 | REQ-013 | Given a track `demo`, When `node R --declare-subtrack demo/sub --apply` runs, Then `demo/sub` holds `description.json` with `"level": "sub-track"`, `graph-metadata.json` and `z_archive/.gitkeep` | COPY: `--declare-subtrack demo/sub --apply` exit 0, `ls` showed description.json (level sub-track), graph-metadata.json and z_archive/.gitkeep. `create.sh --track demo/sub` exit 0 | Met | - |
| AC-014 | REQ-014 | Given an archived `001-a` and a live `001-b` in the same folder, When `archive.sh --restore` runs on `001-a`, Then it exits 0 and the packet lands on the next free number | COPY: `archive.sh --restore specs/demo/z_archive/001-old` beside live 001-holder exit 0, `ls specs/demo` showed 011-old, close printed `RESULT: PASSED` | Met | - |

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

All 14 criteria are Met with evidence observed in the real tree (dry runs only) and in a throwaway clone (every apply). `npm test` after the change exits 0 with the same counts as the baseline in `scratch/baseline.txt`. A restore onto an existing same-named folder stays refused by decision, and the consistency check reads only the first document that carries a pointer; both are recorded in `plan.md` section 3. A packet moved into a track root now ends with a parent the path check accepts, proven by a sub-track-to-flat and a flat-to-flat move in a throwaway clone.
<!-- /ANCHOR:closure -->
