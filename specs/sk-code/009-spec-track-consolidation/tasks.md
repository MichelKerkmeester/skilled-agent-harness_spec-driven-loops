---
title: "Tasks: Sk-Code Spec-Track Consolidation"
description: "Ordered tasks: verify the copy, rewrite identity metadata and path references, recompute fingerprints, and validate origin against destination."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "spec track consolidation tasks"
  - "cross-repo spec relocation tasks"
importance_tier: "high"
contextType: "tasks"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-code/009-spec-track-consolidation"
    last_updated_at: "2026-08-29T09:27:16Z"
    last_updated_by: "claude"
    recent_action: "Completed the relocation tasks; residue scan and fingerprint recompute both clean"
    next_safe_action: "Delete origin-repo source folders after explicit operator approval"
    blockers: []
    key_files:
      - "specs/sk-code/007-sk-code-obsidian-surface"
      - "specs/sk-code/008-sk-code-mobile-cli-mode"
      - ".opencode/skills/sk-code/sk-code-obsidian/README.md"
      - ".opencode/changelog/sk-code/code-obsidian"
    session_dedup:
      fingerprint: "sha256:05ebf0ba2eabc580f832ae32dc06bc74127092abebc341ae8c8d01875b6eb04f"
      session_id: "2026-08-29-sk-code-027"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Sk-Code Spec-Track Consolidation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` completed and evidenced; `[~]` explicitly deferred with a recorded reason and owner; `[ ]` pending.
- `T-NNN` identifiers are stable within this packet.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Enumerate both source trees and confirm tracked-file counts. Evidence: `Obsidian Plugin/specs/public/005-sk-code-obsidian-surface` — 71 tracked files across 13 children; `Mobile CLI/specs/004-sk-code-mobile-cli-mode` — 22 tracked files across 3 children.
- [x] T-002 Copy both trees into their `specs/sk-code/` destinations and verify byte-identical. Evidence: `diff -r` returned clean on both trees.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-003 Rewrite identity metadata in every `description.json`/`graph-metadata.json` across both moved trees. Evidence: 37 JSON files rewritten (`specFolder`/`specId`/`folderSlug`/`parentChain`; `packet_id`/`spec_folder`/`parent_id`/`children_ids`/`last_active_child_id`), verified zero mismatches.
- [x] T-004 Author the `description.json` files the Obsidian packet never had. Evidence: 14 `description.json` files created under `specs/sk-code/007-sk-code-obsidian-surface`, sourced from each folder's own `spec.md` frontmatter.
- [x] T-005 Rewrite in-file path references across both moved trees. Evidence: 117 path references rewritten across 48 markdown files, plus 12 `_memory.continuity.packet_pointer` values that carried a `specs/`-prefixed form.
- [x] T-006 Repoint the one inbound external reference. Evidence: `.opencode/skills/sk-code/sk-code-obsidian/README.md` section 8 now points at `specs/sk-code/007-sk-code-obsidian-surface/`.
- [x] T-007 Add the missing sk-code-obsidian changelog leaf (W5). Evidence: `.opencode/changelog/sk-code/code-obsidian` symlink to `../../skills/sk-code/sk-code-obsidian/changelog`, matching the naming convention the other five changelog leaves already use.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-008 Run a residue scan across both moved trees. Evidence: zero occurrences of `005-sk-code-obsidian-surface`, `004-sk-code-mobile-cli-mode`, `app-mobile-cli`, or `public/005` remaining in either tree.
- [x] T-009 Recompute every fingerprint the rewrites invalidated. Evidence: 4 stale `source_fingerprint`/`source_doc_hashes` pairs recomputed via `computeSourceFingerprintForFolder`.
- [x] T-010 Validate every folder at origin and destination, and compare pairwise. Evidence: `008-sk-code-mobile-cli-mode` — one folder out of its four (parent plus three children) passed `validate.sh --strict` at the origin repo, and the same one folder passed after the move; the child `001-mode-design-plan` regressed mid-migration from PASS to FAIL with `SOURCE_FINGERPRINT_MISMATCH`, was root-caused and fixed, and was reverified back to PASS. `007-sk-code-obsidian-surface` — none of its 14 folders passed `validate.sh --strict` at the origin repo, and none passed after the move, an identical pre-existing state. Net: zero validation regressions introduced by the relocation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- Both moved packets live under `specs/sk-code/` with identity metadata and path references pointing entirely at their new location, with zero residue of the retired identifiers.
- Every folder in both moved packets validates identically to how it validated at its origin repo, with the one mid-migration regression found and fixed rather than left standing.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: `spec.md`.
- Approach and rollback: `plan.md`.
- Moved packets: `../007-sk-code-obsidian-surface/`, `../008-sk-code-mobile-cli-mode/`.
<!-- /ANCHOR:cross-refs -->
