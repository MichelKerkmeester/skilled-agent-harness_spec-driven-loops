---
title: "Heal spec docs lane modes"
description: "Runs five document repairs over each packet in order: anchor-wrap, link-repoint, continuity-placeholders, level-from-spec and header-add. The flags are --folder, --roots and --apply."
trigger_phrases:
  - "Heal spec docs lane modes"
  - "heal-spec-docs --lane-modes"
  - "header-add template source"
  - "level-from-spec"
version: 1.0.0.0
---

# Heal spec docs lane modes (heal-spec-docs.cjs --lane-modes)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Lane modes restore the scaffold values that a packet's documents lost. Each mode repairs one defect whose correct value can be derived from evidence in the packet, the shipped template or the spec. A defect without that evidence is refused and left alone. Lane modes are the document edits that upgrade-legacy runs after the healer and before the derivation tools.

The modes never author content. Each one either recovers a value the document already implied or reports why it could not.

---

## 2. HOW IT WORKS

### The Five Modes

Every mode runs over the four lane documents, `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md`, in that order. Each mode reads the text the mode before it returned, so the order is part of the contract.

- **anchor-wrap** wraps a heading that the active template anchors when the heading has lost its anchor pair. A heading the template does not map is authored prose and stays untouched.
- **link-repoint** repoints a broken inline markdown link to the one indexed file whose trailing path segments match it. Zero matches and several matches are both refused. The mode never removes a link.
- **continuity-placeholders** sets `recent_action` and `next_safe_action` when both still hold a template placeholder or an empty value. The values are fixed strings: `No continuity update was recorded` for `recent_action` and `None recorded` for `next_safe_action`. A document under a `z_archive` or `z_future` folder receives `None, the packet is archived` as its next action instead. A pair where only one field is a placeholder is refused as an edit in progress.
- **level-from-spec** adds a `level:` frontmatter key to a document that declares no level, taken from the `SPECKIT_LEVEL` marker in `spec.md`. A malformed marker, or two markers that disagree, is refused. A document that already declares a level is never overwritten.
- **header-add** names the template with a `SPECKIT_TEMPLATE_SOURCE` header when the document's anchors match the level's render exactly. A document with an extra anchor or a missing one is refused, and the refusal names the anchors that differ.

### Flags and Output

The lane CLI reads three flags, `--folder <packet>`, `--roots <dir>` and `--apply`. It ignores other arguments. Without `--apply` it prints `would apply` and `refused` lines and writes nothing. With `--apply` it prints `applied` lines for each change. When `--anchor-repair` and `--lane-modes` are both given, the anchor repair runs and the lane modes do not.

### Symbolic Links

The healer refuses a symlinked packet document on all three of its paths and writes nothing through the link. The default heal prints `refused <file>: symbolic link, not followed`, `--anchor-repair` prints `left unchanged <file>: symbolic link, not followed`, and `--lane-modes` prints `refused containment <file>: symbolic link, not followed` for each linked lane document. The refusal is whole-file on purpose, because a write through a link changes a file outside the packet. A `--folder` is checked the same way before any mode runs: a folder that is a link, or that sits beneath a link at or below the point where its path enters a specs root, is refused. That entry point is the first part of the path whose real location lies under a root, judged by filesystem identity, so an alias, a case variant or a relative spelling reaches the same root. Links above the entry point, such as the system links under `/var` and `/tmp`, are not judged. With `--roots`, that root alone counts, and a folder outside it is refused. Without `--roots`, the roots are `specs` and `.opencode/specs` under the working directory when they exist, plus, for each git repository that the working directory, the folder's own location or any real location along the folder's path sits in, that repository's top and its `specs` directory. A folder that no root reaches is accepted, because the operator approved that default. The run prints `refused <folder>: symbolic link, not followed (<reason>)` in every mode, writes nothing and exits 2. A `--folder` or `--roots` with no value exits 2 with a usage error and writes nothing.

### Derivation After Lane Modes

Lane modes change document text, and the generated metadata was derived from the text before the change. A packet repaired by lane modes can therefore fail the generated metadata checks until repair-derived re-derives its fields. upgrade-legacy runs repair-derived after the lane modes for this reason.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Script | Runs the five lane modes in order, applies or previews their edits and reports each refusal |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts` | Vitest | Covers each lane mode's positive case, its refusals and its idempotence |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-provenance.vitest.ts` | Vitest | Covers the header-add stamp and the cases where a plan must be left alone |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/heal-spec-docs-lane-modes.md`

Related references:
- [heal-spec-docs-anchor-repair.md](heal-spec-docs-anchor-repair.md) - The anchor repair that runs in the same healer
- [upgrade-legacy-downgrades-report.md](upgrade-legacy-downgrades-report.md) - The report that lists the lane-mode refusals each run records
