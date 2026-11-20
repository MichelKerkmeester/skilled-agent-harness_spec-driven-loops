---
title: "Acceptance Criteria: Phase 5: barter-move-overlays-out-of-tree"
description: "The criteria phase 5 must meet before it closes: hooks learn both overlay locations first, the folder moves to ai-speckit/overlays, status and all three hooks behave as before, and a staged re-pin writes nothing live."
trigger_phrases:
  - "barter move overlays out of tree acceptance criteria"
  - "barter overlays move closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree"
    last_updated_at: "2026-11-20T09:33:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Planned the acceptance criteria; nothing implemented"
    next_safe_action: "Run phase 5 from an ai-speckit session after phase 4, re-pin and relayout, is committed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-barter-move-overlays-out-of-tree"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: barter-move-overlays-out-of-tree

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree`
**Level:** 2
**Status:** Planned
**Date:** 2026-11-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Commands run in `ai-speckit/`. `ENG` is `node .skilled/commands/doctor/scripts/overlay-engine.cjs`, run from `ai-speckit/skilled`. `STAGE` is a fresh empty folder outside both `skilled/` and `overlays/`, `SKILLED` is the local Skilled checkout, and `PIN` is the manifest's `pin.commit`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the folder still at `skilled/barter-overlays/`, When commit 1 lands, Then each hook's test suite passes with the folder in either place and `git show --stat` of commit 1 lists no rename | `node --test` on the four hook test files exits 0; `git log --oneline -2` shows the hook commit before the move commit | Unmet | - |
| AC-002 | REQ-002 | Given commit 2, When status runs, Then it passes with an empty `offLayout` list and the baseline in-sync count | `cd skilled && $ENG status --json` reports `result` `PASSED`, an `offLayout` list of length 0 and `counts["in-sync"]` equal to the count from tasks T003, judged by the output since `--json` exits non-zero on `FAILED`; `cat skilled/.skilled-overlays.json` prints `{ "overlayDir": "../overlays" }` | Unmet | - |
| AC-003 | REQ-003 | Given commit 2, When the guard checks an owned destination, Then it refuses and names the source under `../overlays/` | `cd skilled && $ENG --guard .skilled/skills/sk-git/sk-git-skilled/SKILL.md` exits 1 and prints `../overlays/framework/...`; the OpenCode edit guard plugin refuses the same edit | Unmet | - |
| AC-004 | REQ-003 | Given commit 2, When the guard checks a file inside the folder, Then it allows the edit | `cd skilled && $ENG --guard ../overlays/README.md` exits 0 (`strictWriteRefusal`, `overlay-engine.cjs:5439`) | Unmet | - |
| AC-005 | REQ-004 | Given a clean index, When the commit gate runs, Then it runs the overlay checks and exits 0 | `skilled/.opencode/scripts/git-hooks/pre-commit` exits 0 and its output shows the overlay status ran | Unmet | - |
| AC-006 | REQ-005 | Given an ai-speckit session, When the git-write gate classifies it, Then it answers as it did before the move | From `skilled/`, `node .skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs --session-kind` prints `ai-speckit`, and `--check "git commit -m x" --cwd .` prints the baseline answer | Unmet | - |
| AC-007 | REQ-006 | Given the live folder, When a staged re-pin to the current pin runs, Then the live manifest, state and `repin-runs/` do not change | After `$ENG repin --stage $STAGE --upstream $SKILLED --to $PIN` (judged by the hashes, since whether a same-pin stage exits 0 is UNKNOWN), sha256 of `overlays/overlay-manifest.json`, `overlays/sync-state.json` and every file under `overlays/repin-runs/` match before and after | Unmet | - |
| AC-008 | REQ-007 | Given commit 2, When the test suites run, Then all pass | `node --test` on every `*.test.cjs` and `*.test.mjs` under `overlays/` exits 0; `bash tests/run-all.sh` exits 0 | Unmet | - |
| AC-009 | REQ-008 | Given commit 2, When the old name is searched, Then only track-name false positives remain | `rg -n --hidden '(^|[^-])barter-overlays' --glob '!specs/**' --glob '!**/changelog/**' --glob '!.index/**' --glob '!.git/**' .` prints only the lines `../scratch/inventory/b-barter.md` B lists and the temp-folder fixture name at `overlays/tests/compiled-routing-byte-parity.test.cjs:64` | Unmet | - |
| AC-010 | REQ-009 | Given commit 2, When the hooks and ignore rules are checked, Then no old-location probe remains and the new folders are ignored | `rg -n '(^|[^-])barter-overlays' overlays/framework/hooks overlays/root/opencode/scripts overlays/framework/skills/sk-git/scripts/hooks` prints nothing; `git check-ignore -v overlays/repin-runs/x overlays/framework/skills/a/node_modules/x overlays/framework/hooks/a/dist/x` prints three rule lines | Unmet | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** No

No. Nothing in this phase has run, so every criterion is unmet.
<!-- /ANCHOR:closure -->
