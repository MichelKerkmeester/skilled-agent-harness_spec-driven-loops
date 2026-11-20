---
title: "Acceptance Criteria: Phase 1: residue-check-and-cleanup-tool"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "residue check and cleanup tool acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/001-residue-check-and-cleanup-tool"
    last_updated_at: "2026-11-20T21:51:19Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-residue-check-and-cleanup-tool"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: residue-check-and-cleanup-tool

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 024-ollama-lane-removal/001-residue-check-and-cleanup-tool
**Level:** 3
**Status:** Complete
**Date:** 2026-11-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given this worktree at the phase commit, When `sweep-lane-residue.mjs repo` runs, Then it exits 1 and its live count plus its allowlisted count equals 336: the 332 files both vocabularies match, the tracked embeddings symlink that `git grep` cannot see, and the check's own three files | `repo` exit 1, 333 files with 24 allowlisted before the commit; with the three own files indexed, live 309 plus allowlisted 27 equals 336 | Met | - |
| AC-002 | REQ-002 | Given a temporary git repository with one tracked file holding a lane term, When repo mode runs, Then it exits 1; after the file is removed, or allowlisted by exact path, it exits 0 | Planted-term cases in `sweep-lane-residue.vitest.ts` pass (51/51) | Met | - |
| AC-003 | REQ-003 | Given an unknown flag, a flag with no value or a malformed allowlist, When the script runs, Then it exits 2 | Exit-2 cases pass; `--nope` exits 2 | Met | - |
| AC-004 | REQ-004 | Given a fixture database directory with `skill-graph.sqlite`, its `-wal` and `-shm`, a `.bak`, a `.corrupt` and one unrelated file, When apply mode runs, Then only the unrelated file remains and no copy was made | Apply fixture case passes: database, -wal, -shm, .bak, .corrupt gone, unrelated file kept | Met | - |
| AC-005 | REQ-005 | Given a fixture HuggingFace folder and a fake Ollama host listing the model, When apply mode runs with no terminal, Then both remain and are reported | No-terminal apply case passes: HF folder kept, fake Ollama host saw no DELETE | Met | - |
| AC-006 | REQ-006 | Given fixture leftovers, When machine mode runs, Then it names each one and exits 1, and with none it exits 0 | Machine-mode fixture cases pass, exit 1 with leftovers and 0 without | Met | - |
| AC-007 | REQ-007 | Given an allowlist row that ends in `/` or holds `*`, When the loader reads it, Then the script exits 2 | Loader cases for a trailing `/` and `*` exit 2 | Met | - |
| AC-008 | REQ-008 | Given the gates in research section 5.1, When this phase closes, Then each has its command, exit status and count in `implementation-summary.md` | Gate Baselines table in `implementation-summary.md`, 16 rows | Met | - |

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

Every criterion is Met with observed evidence.
<!-- /ANCHOR:closure -->
