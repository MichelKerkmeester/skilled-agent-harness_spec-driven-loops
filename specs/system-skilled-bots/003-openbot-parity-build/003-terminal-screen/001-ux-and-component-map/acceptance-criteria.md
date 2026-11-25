---
title: "Acceptance Criteria: Phase 1: ux-and-component-map"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ux and component map acceptance criteria"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: ux-and-component-map

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `001-ux-and-component-map`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Every command runs from the repository root with the two variables `tasks.md` sets:

```bash
P=specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map
D=$P/design
```

The Verification column names the block below that proves the row. The blocks carry the commands, because a command with a pipe in it cannot live in a table cell and still be copyable.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the four documents in `design/`, When every `SOURCE` pointer is resolved, Then none is missing and none points past the last line of its file, and a pointer into the gitignored reference folder is skipped by name when that folder is absent | AC-001 block prints `4` then `0` | Unmet | - |
| AC-002 | REQ-002 | Given the twenty-seven states in the index, When each is drawn at 80x24 and at 120x40, Then every fenced block is exactly 24 or 40 lines and no line is wider than its size, and the too-small block is exactly 7 lines and no line wider than 30 | AC-002 block prints `frames=53 bad=0` | Unmet | - |
| AC-003 | REQ-003 | Given the key table, When each binding is read, Then it names a context, an action, the label the frame draws and the frame that draws it, no key carries two meanings inside one context, and a key that answers is bound only outside text mode | AC-003 block prints `29` then `0` | Unmet | - |
| AC-004 | REQ-004 | Given the seven group ids in payload order, When the glyph table is read, Then each id has a glyph and an ASCII character, an unnamed state draws `?` plus its raw value, and the ASCII set is selected by one flag | AC-004 block prints `7` then `2` | Unmet | - |
| AC-005 | REQ-005 | Given the component inventory, When each component is read, Then it names what it reads, the keys it binds, every state it can be in, and the frame that draws each state | AC-005 block prints `13` then `13` | Unmet | - |
| AC-006 | REQ-006 | Given the openhuman sources under `specs/system-skilled-bots/context/`, When the design documents are searched for their text, Then no line of openhuman source appears in them | AC-006 block prints nothing and exits 1 | Unmet | - |
| AC-007 | REQ-007 | Given the key map, When the operator approves it, Then the approval names the date and the key set it covers | AC-007 block prints one line | Unmet | - |
| AC-008 | REQ-008 | Given each surface, When its reads are read, Then the document names the JSON verb it calls and the phase that owns that verb | AC-008 block prints `4` | Unmet | - |
| AC-009 | REQ-009 | Given the visual references, When the design documents are read, Then the four screenshots and the openhuman `--demo` capture are named, so a reader can open each one | AC-009 block prints `5` | Unmet | - |
| AC-010 | REQ-010 | Given every row above, When its Verification cell is read, Then it names a block that runs here without a tty, and every block exists | AC-010 block prints `11` | Unmet | - |
| AC-011 | REQ-011 | Given an answer that exits 0, When the overlay closes, Then the answered row stays drawn with its outcome word, `approved`, `denied` or `answered`, the banner count drops at once, and the row leaves on the next successful inbox read rather than at once | AC-011 block prints `4` then `1` | Unmet | - |

### The commands

**AC-001**: the four documents exist, and every pointer resolves.

```bash
ls $D | wc -l
ctx=specs/system-skilled-bots/context
rg -o --no-filename '\[SOURC[E]: [^]]+\]' $D/*.md $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md $P/goal.md \
  | sed -e 's/^\[SOURCE:[ ]*//' -e 's/\]$//' | sort -u \
  | while IFS= read -r p
    do
      f=${p%%:*}
      r=${p#*:}
      hi=${r##*-}
      if [ "${f#"$ctx"/}" != "$f" ] && [ ! -d "$ctx" ]
      then
        echo "SKIP context-absent $p" >&2
        continue
      fi
      if [ ! -f "$f" ]
      then
        echo "MISSING $p"
        continue
      fi
      n=$(wc -l < "$f" | tr -d ' ')
      [ "$hi" -le "$n" ] || echo "PAST-END $p"
    done | wc -l
```

**AC-002**: every frame is exactly 24 or 40 lines and no line is wider than its size, and the too-small frame is 7 lines and no wider than 30.

```bash
perl -CSD -e 'local $/; $_=<>; @b = /```[^\n]*\n(.*?)```/gs; $bad=0; for $x (@b) { $h = ($x =~ tr/\n//); $w=0; for (split /\n/, $x) { $w = length($_) if length($_) > $w } $bad++ unless ($h==24&&$w==80)||($h==40&&$w==120)||($h==7&&$w<=30) } print "frames=", scalar(@b), " bad=$bad\n"' $D/mockups.md
```

**AC-003**: the key table has twenty-nine bindings, and every drawn label appears in a frame.

```bash
awk '/^## 2\. THE KEY TABLE/{f=1;next} /^## 3\./{f=0} f && /^\| `/{n++} END{print n}' $D/key-map.md
awk -F'|' '/^## 2\. THE KEY TABLE/{f=1;next} /^## 3\./{f=0} f && /^\| `/{gsub(/^ +| +$/,"",$5); gsub(/`/,"",$5); print $5}' $D/key-map.md \
  | sort -u | while IFS= read -r l; do rg -qF "$l" $D/mockups.md || echo "MISSING $l"; done | wc -l
```

**AC-004**: seven glyph rows, and two ASCII selectors.

```bash
awk '/^## 1\. THE GLYPH TABLE/{f=1;next} /^## 2\./{f=0} f && /^\| `/{n++} END{print n}' $D/glyph-table.md
awk '/^## 5\. THE ASCII FALLBACK SET/{f=1;next} /^## 6\./{f=0} f && /^\| `/{n++} END{print n}' $D/glyph-table.md
```

**AC-005**: thirteen components, and every one of them names at least one frame.

```bash
rg -c '^\| [0-9]+ \| ' $D/component-inventory.md
awk '/^## 1\. THE INVENTORY/{f=1;next} /^## 2\./{f=0} f && /^\| [0-9]+ \|.*\| [0-9]+(, [0-9]+)* \|$/{n++} END{print n}' $D/component-inventory.md
```

**AC-006**: no line of the GPL source appears in the design documents.

```bash
rg -c 'GNU GENERAL PUBLIC LICENSE' $D/
```

**AC-007**: the operator's approval row reads `Met`.

```bash
rg -n '^\| \*\*Approved\*\* \| Met \|' $D/key-map.md
```

**AC-008**: four surfaces name the JSON verb they read.

```bash
rg -c 'bots (status|activity|inbox|routines) --json' $D/component-inventory.md
```

**AC-009**: the four screenshots and the `--demo` capture are named.

```bash
rg -c 'screenshots/' $D/mockups.md
```

**AC-010**: every criterion has a command block.

```bash
rg -c '^\*\*AC-0' $P/acceptance-criteria.md
```

**AC-011**: the answered row's outcome word is carried by the requirement, the criterion and both design documents, and the glyph table names all three words.

```bash
rg -l 'outcome word' $D/component-inventory.md $D/glyph-table.md $P/spec.md $P/acceptance-criteria.md | wc -l
rg -c '^\| `answered` \|.*approved.*denied.*answered' $D/glyph-table.md
```

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

This packet carries a `decision-record.md`, so a row may be `Waived` or `Superseded` when its Waiver cell names an ADR that exists there. The operator's approval is recorded in `design/key-map.md` section 6, restated as AC-007, and added as a row in `decision-record.md` when it is given.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

AC-007 is unmet: the operator has not yet approved the key map, and that approval is the packet's exit.
<!-- /ANCHOR:closure -->
