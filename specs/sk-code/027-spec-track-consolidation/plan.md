---
title: "Plan: Sk-Code Spec-Track Consolidation"
description: "Copy-verify-rewrite-reverify: copy both source trees byte-identical, rewrite identity metadata and path references, recompute invalidated fingerprints, and validate origin against destination pairwise."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "spec track consolidation plan"
  - "cross-repo spec relocation plan"
importance_tier: "high"
contextType: "plan"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-code/027-spec-track-consolidation"
    last_updated_at: "2026-08-29T09:27:16Z"
    last_updated_by: "claude"
    recent_action: "Copied both trees, rewrote identity metadata and path references, recomputed hashes"
    next_safe_action: "Delete origin-repo source folders after explicit operator approval"
    blockers: []
    key_files:
      - "specs/sk-code/025-sk-code-obsidian-surface"
      - "specs/sk-code/026-sk-code-mobile-cli-mode"
      - ".opencode/skills/sk-code/sk-code-obsidian/README.md"
      - ".opencode/changelog/sk-code/code-obsidian"
    session_dedup:
      fingerprint: "sha256:97b53db9f3e6f28c4fd279ccbc9c8e9241c2c697f65dd59c97da419d212ed13f"
      session_id: "2026-08-29-sk-code-027"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Sk-Code Spec-Track Consolidation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

`Public/specs/sk-code/` holds every other sk-code spec packet, each with `description.json`/`graph-metadata.json` identity metadata pointing at its own `sk-code/<NNN-slug>` location. Two packets predate that consolidation and live in the Obsidian Plugin and Mobile CLI repos instead, with identity metadata and internal path references pointing at their old locations.

### Overview

Copy each source tree into its new `specs/sk-code/` location, verify the copy byte-identical, then rewrite every identity-metadata field and internal path reference to the new location, author the description.json files the Obsidian packet never had, recompute any fingerprint the rewrites invalidated, repoint the one inbound external reference, and add the missing changelog leaf.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Both source trees enumerated: 71 tracked files across 13 children (Obsidian), 22 tracked files across 3 children (Mobile CLI).
- The identity-metadata fields needing rewrite identified: `specFolder`/`specId`/`folderSlug`/`parentChain` in `description.json`, `packet_id`/`spec_folder`/`parent_id`/`children_ids`/`last_active_child_id` in `graph-metadata.json`.

### Definition of Done

- Zero residue occurrences of the retired slugs or prefixes in either moved tree.
- Zero identity-metadata mismatches across every rewritten JSON file.
- Net zero validation regressions comparing each folder's origin-repo result to its destination result.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Copy-verify-rewrite-reverify. The origin tree is the source of truth until the destination copy is proven byte-identical; only then does identity metadata and path rewriting begin, and only a residue scan plus a pairwise origin/destination validation run proves the rewrite is complete and safe.

### Key Components

- `description.json` identity rewrite: `specFolder`, `specId`, `folderSlug`, `parentChain`.
- `graph-metadata.json` identity rewrite: `packet_id`, `spec_folder`, `parent_id`, `children_ids`, `last_active_child_id`.
- Markdown path-reference rewrite, including `_memory.continuity.packet_pointer` values.
- Fingerprint recompute via `computeSourceFingerprintForFolder`/`computeSourceDocHashes`.

### Data Flow

Origin tree → `diff -r` verified copy → destination tree → identity + path rewrite → residue scan → fingerprint recompute → `validate.sh` on both origin and destination → pairwise comparison → net-regression check.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Enumerate both source trees and confirm tracked-file counts; copy each into its `specs/sk-code/` destination and verify byte-identical with `diff -r`.

### Phase 2: Core Implementation

Rewrite identity metadata across every JSON file in both moved trees; author the description.json files the Obsidian packet never had; rewrite in-file path references and `_memory.continuity.packet_pointer` values across the moved markdown; repoint the one inbound external reference; add the missing changelog leaf (W5).

### Phase 3: Verification

Residue-scan both trees; recompute every fingerprint the rewrites invalidated; validate every folder at origin and destination and compare pairwise; root-cause and fix the one mid-migration regression found; confirm net zero regressions.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Behavioral: `diff -r` on both trees before any rewrite; a grep-based residue scan for the four retired identifiers across both trees after the rewrite; `validate.sh` run per folder at both the origin repo and the destination, compared pairwise. Controlled: the mid-migration regression on `026/001-mode-design-plan` served as a live negative control — it reproduced as a PASS-to-FAIL regression with `SOURCE_FINGERPRINT_MISMATCH`, was root-caused and fixed, and was reverified back to PASS with the same check.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `system-spec-kit`'s `graph-metadata-parser` module (`computeSourceFingerprintForFolder`, `computeSourceDocHashes`).
- No new packages or network access.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Reversible: the destination folders (`specs/sk-code/025-sk-code-obsidian-surface`, `specs/sk-code/026-sk-code-mobile-cli-mode`) and the new changelog leaf are pure additions. Removing them restores the prior state exactly, since the origin trees in the Obsidian Plugin and Mobile CLI repos were never modified or deleted.

<!-- /ANCHOR:rollback -->
