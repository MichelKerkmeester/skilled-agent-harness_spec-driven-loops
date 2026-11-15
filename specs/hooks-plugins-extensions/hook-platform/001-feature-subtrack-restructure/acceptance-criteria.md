---
title: "Acceptance Criteria: Give every hook, plugin and extension feature its own sub-track under the hooks track, with one overview of all features and their owning packets."
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "feature subtrack restructure acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure"
    last_updated_at: "2026-11-15T06:21:47Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-feature-subtrack-restructure"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Give every hook, plugin and extension feature its own sub-track under the hooks track, with one overview of all features and their owning packets.

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `001-feature-subtrack-restructure`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the approved map, When both map runs complete, Then every `from` path is gone and every `to` path exists | `while read -r from arrow to; do test -e "specs/$from" && echo "OLD $from"; test -e "specs/$to" \|\| echo "MISSING $to"; done < specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/scratch/move-map/map.txt \| wc -l` prints 0 | Met | - |
| AC-002 | REQ-002 | Given the two held packets, When the moves finish, Then both stay at their current paths and `spec.md` names each with its destination | `ls -d specs/hooks-plugins-extensions/session-handover/002-session-relaunch-loop specs/hooks-plugins-extensions/pi-extensions/012-file-relative-adapter-imports \| wc -l` prints 2, and `rg -c '^- 002-session-relaunch-loop\|^- 012-file-relative-adapter-imports' specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/spec.md` prints 2 | Met | - |
| AC-003 | REQ-003 | Given the source sub-tracks that empty out, When the packets have moved, Then the three empty ones are gone and the two that keep a held packet remain | `ls -d specs/hooks-plugins-extensions/goal-and-directive-hooks specs/hooks-plugins-extensions/hook-injection-pipeline specs/hooks-plugins-extensions/repo-commit-gates 2>/dev/null \| wc -l` prints 0, and `ls -d specs/hooks-plugins-extensions/pi-extensions specs/hooks-plugins-extensions/session-turn-boundaries \| wc -l` prints 2 | Met | - |
| AC-004 | REQ-004 | Given the restructured track, When the recursive strict validator runs, Then no `RESULT:` line is anything but `PASSED` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions --strict --recursive --quiet \| grep '^RESULT:' \| grep -vc '^RESULT: PASSED'` prints 0 | Met | - |
| AC-005 | REQ-005 | Given the track root metadata, When it is read, Then it names `hooks-plugins-extensions` | `rg -n '"specFolder": "hooks"\|"specId": "hooks"\|"folderSlug": "hooks"\|"packet_id": "hooks"\|"spec_folder": "hooks"' specs/hooks-plugins-extensions/description.json specs/hooks-plugins-extensions/graph-metadata.json \| wc -l` prints 0 | Met | - |
| AC-006 | REQ-006 | Given every metadata store, When it is searched for a retired sub-track path, Then none matches | `rg -l 'hooks-plugins-extensions/(goal-and-directive-hooks\|hook-injection-pipeline\|repo-commit-gates)/' specs --glob 'description.json' --glob 'graph-metadata.json' \| wc -l` prints 0 | Met | - |
| AC-007 | REQ-007 | Given the overview, When its cards are counted, Then it holds one card per feature and every card names its packets | `grep -c '^## ' specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/feature-overview.md` prints 31, and `grep -c '^- Packets:' specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/feature-overview.md` prints 31 | Met | - |
| AC-008 | REQ-008 | Given every folder under `.skilled/hooks/`, When its name is searched in the overview, Then every one is found | `for d in .skilled/hooks/*/; do b=$(basename "$d"); grep -q "$b" specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/feature-overview.md \|\| echo "$b"; done \| wc -l` prints 0 | Met | - |
| AC-009 | REQ-009 | Given every `.js` file in `.opencode/plugins/`, When its name is searched in the overview, Then every one is found | `for f in .opencode/plugins/*.js; do b=$(basename "$f" .js); grep -q "$b" specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/feature-overview.md \|\| echo "$b"; done \| wc -l` prints 0 | Met | - |
| AC-010 | REQ-010 | Given every entry in `.pi/extensions/`, When its name is searched in the overview, Then every one is found | `for f in .pi/extensions/*; do b=$(basename "$f"); b=${b%.ts}; grep -q "$b" specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/feature-overview.md \|\| echo "$b"; done \| wc -l` prints 0 | Met | - |
| AC-011 | REQ-011 | Given every remaining sub-track directory, When it is checked, Then it is declared and holds a `z_archive/` | `for d in specs/hooks-plugins-extensions/*/; do test -f "$d/z_archive/.gitkeep" \|\| echo "$d"; grep -q '"level": "sub-track"' "$d/description.json" \|\| echo "$d"; done \| wc -l` prints 0 | Met | - |
| AC-012 | REQ-012 | Given `spec.md`, When it is searched for the map reference, Then it points at the map and summarises it by sub-track | `rg -c '^### Move Summary by Sub-Track' specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/spec.md` prints 1, and `rg -c 'move-map/map[.]txt'` on the same file prints 3 | Met | - |

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

AC-001 is unmet: no map row has moved yet, so the rest of the criteria cannot be observed either.
<!-- /ANCHOR:closure -->
