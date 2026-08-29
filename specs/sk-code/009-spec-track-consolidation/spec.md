---
title: "Spec: Sk-Code Spec-Track Consolidation"
description: "Relocate the Obsidian-surface and Mobile-CLI-mode sk-code spec packets from their origin repos into Public/specs/sk-code, rewriting identity metadata and path references so both are first-class sk-code packets."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "spec track consolidation"
  - "cross-repo spec packet relocation"
  - "sk-code obsidian surface migration"
  - "sk-code mobile cli mode migration"
importance_tier: "high"
contextType: "spec"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-code/009-spec-track-consolidation"
    last_updated_at: "2026-08-29T09:27:16Z"
    last_updated_by: "claude"
    recent_action: "Relocated 025/026 spec packets cross-repo; rewrote metadata; added changelog leaf"
    next_safe_action: "Delete origin-repo source folders after explicit operator approval"
    blockers: []
    key_files:
      - "specs/sk-code/007-sk-code-obsidian-surface"
      - "specs/sk-code/008-sk-code-mobile-cli-mode"
      - ".opencode/skills/sk-code/sk-code-obsidian/README.md"
      - ".opencode/changelog/sk-code/code-obsidian"
    session_dedup:
      fingerprint: "sha256:ccb4f8fa8842e811c20ec7decc14e368b15313299989242edb7d6a6ff030ea20"
      session_id: "2026-08-29-sk-code-027"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Sk-Code Spec-Track Consolidation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-spec-track-consolidation |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Predecessor** | None |
| **Successor** | None |
| **Priority** | P2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Two sk-code spec packets were created before `Public/specs/sk-code/` existed as the consolidated home for the sk-code track, and lived in different git repos than every other sk-code packet: `Obsidian Plugin/specs/public/005-sk-code-obsidian-surface` (71 tracked files across 13 children) and `Mobile CLI/specs/004-sk-code-mobile-cli-mode` (22 tracked files across 3 children). Because they were outside `specs/sk-code/`, they were invisible to memory search and graph traversal the way the rest of the track is, and their spec numbers and identity metadata did not line up with the sk-code sequence.

`git mv` was not an option because the source and destination trees sit in different git repositories with no shared history. The purpose was to relocate both trees into `Public/specs/sk-code/007-sk-code-obsidian-surface` and `Public/specs/sk-code/008-sk-code-mobile-cli-mode`, rewrite every piece of identity metadata and internal path reference so the moved packets are indistinguishable from packets authored in place, and do this without introducing a single validation regression relative to how each packet already validated at its origin.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: verified copy of both source trees into their new `specs/sk-code/` locations; rewriting `specFolder`/`specId`/`folderSlug`/`parentChain` in every `description.json` and `packet_id`/`spec_folder`/`parent_id`/`children_ids`/`last_active_child_id` in every `graph-metadata.json` across both moved trees; authoring the `description.json` files the Obsidian packet never had; rewriting in-file path references (old slugs, old repo-relative prefixes) across the moved markdown, including `_memory.continuity.packet_pointer` values; recomputing `source_fingerprint`/`source_doc_hashes` invalidated by those rewrites; repointing the one inbound external reference to the moved Obsidian packet; adding the sk-code-obsidian changelog leaf that the naming convention required but the packet never had (W5).

Out of scope: deleting the origin-repo source folders — a destructive cross-repo change deferred pending explicit operator approval; any content or requirement change inside the moved packets beyond identity metadata and path references; the five sk-code changelog leaves that already followed the convention.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P1]** The copy of each source tree into its destination is verified byte-identical (`diff -r` clean) before any metadata or path rewrite begins.
- **REQ-002 [P1]** Every `description.json` and `graph-metadata.json` in both moved trees is rewritten to identify the new location (the two packets landed as `sk-code/025-*` and `sk-code/026-*`, since renumbered to `sk-code/007-*` and `sk-code/008-*`), verified with zero mismatches.
- **REQ-003 [P2]** Every `description.json` the Obsidian packet was missing is authored from that folder's own `spec.md` frontmatter, not invented content.
- **REQ-004 [P1]** Every in-file path reference to the retired slugs or repo-relative prefixes is rewritten across the moved markdown, including `_memory.continuity.packet_pointer` values that carried a `specs/`-prefixed form.
- **REQ-005 [P1]** Any `source_fingerprint`/`source_doc_hashes` invalidated by the rewrites is recomputed via the tool's own `computeSourceFingerprintForFolder`/`computeSourceDocHashes`, never hand-written.
- **REQ-006 [P2]** The one inbound external reference to the moved Obsidian packet outside its own tree is repointed to the new location.
- **REQ-007 [P3]** The missing sk-code-obsidian changelog leaf is added, following the naming convention the other five leaves already use (W5).

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** A residue scan across both moved trees finds zero occurrences of `005-sk-code-obsidian-surface`, `004-sk-code-mobile-cli-mode`, `app-mobile-cli`, or `public/005`.
- **SC-002** Validating every folder in both moved packets, at both the origin repo and the destination, shows the same pass/fail outcome pairwise, with any mid-migration regression root-caused and fixed before completion — net zero validation regressions introduced by the relocation.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **No `git mv` across repo boundaries.** Mitigated by treating the origin as source of truth until the destination is proven byte-identical via `diff -r`, then proving no residue of the old identity remains via a grep-based scan.
- **Leaving source folders in place.** The Obsidian Plugin repo is on branch `impl` with 8 uncommitted edits inside the packet, and Mobile CLI is on `main`; deleting either origin tree is a destructive action in a different repo and is deferred pending explicit operator approval rather than done unilaterally.
- **Dependencies.** `system-spec-kit`'s `graph-metadata-parser` (`computeSourceFingerprintForFolder`, `computeSourceDocHashes`) for fingerprint recomputation. No new packages or network access.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the origin-repo source folders be deleted now that the copy is verified byte-identical? Deferred: the Obsidian Plugin repo has 8 uncommitted edits inside the packet on branch `impl`, and Mobile CLI is on `main`; deletion in either repo needs explicit operator approval before it happens.

<!-- /ANCHOR:questions -->
