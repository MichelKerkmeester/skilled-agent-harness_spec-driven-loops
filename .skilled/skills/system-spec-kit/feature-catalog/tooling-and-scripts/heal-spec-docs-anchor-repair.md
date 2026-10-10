---
title: "Heal spec docs anchor repair"
description: "Repairs duplicate anchor pairs and moves a nested questions anchor back above its heading in spec.md, and reports each change it would make and each change it refuses."
trigger_phrases:
  - "Heal spec docs anchor repair"
  - "heal-spec-docs --anchor-repair"
  - "questions anchor un-nesting"
  - "duplicate anchor repair"
version: 1.0.0.0
---

# Heal spec docs anchor repair (heal-spec-docs.cjs --anchor-repair)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Anchor repair is the document repair that fixes anchor structure in a packet's `spec.md`. It handles two defects that each have one safe fix: a duplicate anchor pair, and a questions opener that does not sit directly above its heading. Anything it cannot place with certainty is refused and left unchanged.

The mode edits only `spec.md`. It never writes new prose, so the words of the packet stay the same and only the markers move or get renamed.

---

## 2. HOW IT WORKS

### Duplicate Pairs

A name that is opened more than once keeps its first pair. Each later pair that does not overlap another pair is renamed with a numeric suffix, so a second `problem` pair becomes `problem-2`. If that suffixed name already exists, the rename is refused as a collision. A later pair that overlaps another pair and sits glued to a neighbouring marker is removed with its two markers. An overlapping pair that is not glued is refused as ambiguous. A document with an unmatched marker is left unchanged as a whole.

### Nested Questions Opener

A questions pair that holds exactly one OPEN QUESTIONS heading is moved so that its opener sits on the line directly above that heading. The move changes no prose. The repair is refused when the heading is missing or appears twice, and when the move would overlap another wrapper, such as an older open-questions anchor. The result is parsed again before it is accepted, and a layout whose questions section would become unreadable is refused.

### Dry Run and Apply

The dry run prints a `would repair` line for each change and a summary line, and it writes nothing. Apply writes the document through a temporary file and a rename, so a reader never sees a partial file, and it keeps the file mode. A second apply finds nothing to change. Discovery skips archived folders, but an explicit `--folder` names one packet directly. A symlinked `spec.md` is refused before it is read. The dry run and apply both print `left unchanged <file>: symbolic link, not followed` and write nothing through the link.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Script | Detects duplicate pairs and the nested questions opener, renames or moves them and writes the result atomically |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-anchor-repair.vitest.ts` | Vitest | Covers the glued duplicate removal, the nested questions move, the suffix collision and the ambiguous overlap refusal |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/anchor-repair-sample.vitest.ts` | Vitest | Runs the dry run and apply over a frozen sample of nested questions layouts |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/heal-spec-docs-anchor-repair.md`

Related references:
- [heal-spec-docs-lane-modes.md](heal-spec-docs-lane-modes.md) - The document repairs that run after anchor repair in the same healer
- [anchor-integrity-and-nesting-check.md](anchor-integrity-and-nesting-check.md) - The validator rule whose nesting error this repair clears
