---
title: "Implementation Summary: Sk-Code Spec-Track Consolidation"
description: "Both cross-repo sk-code spec packets now live under Public/specs/sk-code with rewritten identity metadata and path references, verified with zero net validation regressions."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "spec track consolidation implementation"
  - "cross-repo spec relocation summary"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-code/009-spec-track-consolidation"
    last_updated_at: "2026-08-29T09:27:16Z"
    last_updated_by: "claude"
    recent_action: "Shipped the relocation; verified zero net regressions vs origin at both packets"
    next_safe_action: "Delete origin-repo source folders after explicit operator approval"
    blockers: []
    key_files:
      - "specs/sk-code/007-sk-code-obsidian-surface"
      - "specs/sk-code/008-sk-code-mobile-cli-mode"
      - ".opencode/skills/sk-code/sk-code-obsidian/README.md"
      - ".opencode/changelog/sk-code/code-obsidian"
    session_dedup:
      fingerprint: "sha256:414d7790b6d8ed524263866ee44b9d688d7aed71d20fc15690222d91ca5ff917"
      session_id: "2026-08-29-sk-code-027"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Sk-Code Spec-Track Consolidation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-spec-track-consolidation |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Completion** | 100% — both packets relocated, identity metadata and path references rewritten, verified with zero net validation regressions |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two sk-code spec packets that lived outside the `Public/specs/sk-code/` track, in different git repos, were relocated into it and made indistinguishable from packets authored in place.

1. **Verified copy.** `Obsidian Plugin/specs/public/005-sk-code-obsidian-surface` (71 tracked files across 13 children) and `Mobile CLI/specs/004-sk-code-mobile-cli-mode` (22 tracked files across 3 children) were copied into `specs/sk-code/007-sk-code-obsidian-surface` and `specs/sk-code/008-sk-code-mobile-cli-mode`, each verified byte-identical against its origin with `diff -r` before any rewrite.

2. **Identity metadata rewrite.** 37 JSON files across both trees had their identity fields rewritten to the new location: `specFolder`/`specId`/`folderSlug`/`parentChain` in each `description.json`, and `packet_id`/`spec_folder`/`parent_id`/`children_ids`/`last_active_child_id` in each `graph-metadata.json`. Verified zero mismatches.

3. **Missing descriptions authored.** The Obsidian packet shipped `graph-metadata.json` only for 14 of its folders, with no `description.json`, which made those folders invisible to memory search. All 14 were authored from each folder's own `spec.md` frontmatter.

4. **Path references rewritten.** 117 in-file path references across 48 markdown files, plus 12 `_memory.continuity.packet_pointer` values that carried a `specs/`-prefixed form, were rewritten to point at the new location.

5. **Fingerprints recomputed.** The markdown rewrites invalidated 4 `source_fingerprint`/`source_doc_hashes` pairs; all 4 were recomputed via the tool's own `computeSourceFingerprintForFolder`/`computeSourceDocHashes`, never hand-written.

6. **External reference repointed.** `.opencode/skills/sk-code/sk-code-obsidian/README.md` section 8 named the old Obsidian-repo location; repointed to `specs/sk-code/007-sk-code-obsidian-surface/`.

7. **Missing changelog leaf added (W5).** `.opencode/changelog/sk-code/code-obsidian` is now a symlink to `../../skills/sk-code/sk-code-obsidian/changelog`, matching the naming convention (strips the `sk-` prefix) the other five sk-code changelog leaves already followed.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`git mv` was not available across the repo boundary, so the relocation used a copy-verify-rewrite-reverify sequence instead: copy each tree, prove it byte-identical to its origin, only then rewrite identity metadata and path references, and prove the rewrite complete with a grep-based residue scan for the retired slugs and prefixes. Verification ran a negative-control comparison — validating every folder in both moved packets at both the origin repo and the destination and comparing the results pairwise, rather than trusting the destination's result in isolation. That comparison caught a real mid-migration regression in `026/001-mode-design-plan` (`SOURCE_FINGERPRINT_MISMATCH`), which was root-caused and fixed before completion. The origin-repo source folders were deliberately left in place: deleting them is a destructive action in two other repos and needs explicit operator approval, which this packet's scope does not include.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Verified copy instead of `git mv` | The source and destination trees sit in different git repositories with no shared history; `git mv` cannot cross that boundary. |
| Negative-control validation (origin vs. destination, pairwise) | Validating the destination alone cannot prove the relocation introduced no regression; comparing against the origin's own result for the same folder can. |
| Author the 14 missing `description.json` files from each folder's `spec.md` frontmatter | The Obsidian packet shipped `graph-metadata.json` only, which made it invisible to memory search; inventing description content instead of deriving it from the folder's own spec would have been dishonest. |
| Leave origin-repo source folders in place | Deleting them is destructive, crosses repo boundaries, and one repo (Obsidian Plugin) has 8 uncommitted edits inside the packet on branch `impl`; that decision needs explicit operator approval, not an inferred default. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Copy fidelity | PASS — `diff -r` clean on both trees before any rewrite |
| Identity metadata rewrite | PASS — 37 JSON files rewritten, zero mismatches verified |
| Missing descriptions | PASS — 14 `description.json` files authored under `007-sk-code-obsidian-surface`, sourced from each folder's own `spec.md` |
| Path-reference rewrite | PASS — 117 references across 48 markdown files, plus 12 `packet_pointer` values, rewritten |
| Residue scan | PASS — zero occurrences of the four retired identifiers in either tree |
| Fingerprint recompute | PASS — 4 stale `source_fingerprint`/`source_doc_hashes` pairs recomputed via the tool's own function |
| External reference | PASS — `.opencode/skills/sk-code/sk-code-obsidian/README.md` section 8 repointed |
| Changelog leaf (W5) | PASS — `.opencode/changelog/sk-code/code-obsidian` symlink added, convention-consistent |
| Net validation regressions | PASS — zero; one mid-migration regression found and fixed, everything else identical to origin |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Origin-repo source folders still exist.** The Obsidian Plugin and Mobile CLI repos still hold the original packets. This packet's scope was relocation and verification, not destructive cleanup in repos it does not own; deletion is a deliberately deferred, separate action pending explicit operator approval.
2. **Pre-existing validation failures were not fixed.** `007-sk-code-obsidian-surface`'s 14 folders failed `validate.sh --strict` at the origin repo before this packet touched them, and still fail after the move, identically. This packet's scope was proving the relocation introduced no *new* regression, not repairing pre-existing packet defects.

<!-- /ANCHOR:limitations -->
