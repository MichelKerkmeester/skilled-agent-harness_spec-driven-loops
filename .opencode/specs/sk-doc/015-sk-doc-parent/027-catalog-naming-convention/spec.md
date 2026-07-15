---
title: "Feature Specification: catalog & playbook naming-convention program"
description: "Program parent grouping all naming-convention governance for feature_catalog / manual_testing_playbook content across every skill. Holds three children: the two completed de-numbering packets (former top-level 025 category folders, 026 snippet filenames, re-nested here as 001/002) and the new hyphen->underscore restyle of content folders and files (003). Root purpose only; the re-nest mechanics live in context-index.md and each child's own docs."
trigger_phrases:
  - "catalog naming convention"
  - "playbook naming convention"
  - "feature_catalog folder naming"
  - "manual_testing_playbook folder naming"
  - "naming convention program"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention"
    last_updated_at: "2026-07-12T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Re-nested completed children 001/002 and migrated sk-doc-owned naming-convention content"
    next_safe_action: "Reconcile concurrent non-sk-doc restyles before closing child 003"
    blockers: []
    key_files: []
    completion_pct: 66
    open_questions: []
    answered_questions:
      - "Executor confirmed: openai/gpt-5.6-terra-fast --variant xhigh (luna returns empty completions; terra smoke-test returned real content)"
      - "Structure chosen by operator: group 025/026 + new underscore packet under one new parent"
      - "Scope chosen by operator: all content folders AND all per-feature files, hyphen->underscore"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + child list + outcome only. Re-nest/consolidation narrative belongs in context-index.md; per-child mechanics live in each child's plan.md. -->

# Feature Specification: Catalog & Playbook Naming-Convention Program

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/015-sk-doc-parent/027-catalog-naming-convention |
| **Level** | phase parent (program Level 3) |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-07-12 |
| **Owner skill** | sk-doc (owns the `create-feature-catalog` + `create-manual-testing-playbook` conventions, their templates, the `/create:*` generators, and the `validate_document.py` classifier) |
| **Origin** | Operator: group the two completed de-numbering packets with a new hyphen->underscore restyle of all catalog/playbook content folders and files under one governance parent |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The `feature_catalog/` and `manual_testing_playbook/` content surfaces have accreted three related naming-convention
debts, each fixed by its own packet. This parent groups them so the convention is governed in one place instead of
drifting across sibling packets:

- **De-numbered category folders** (former 025) — stripped the `NN--` ordinal prefix from category folders.
- **De-numbered snippet filenames** (former 026) — stripped the `NNN-` ordinal prefix from per-scenario files.
- **Underscore restyle** (new, 003) — converts the surviving hyphenated content folder AND file names to
  `underscore_case`, so `feature_catalog/mcp-tool-surface/read-path-freshness.md` becomes
  `feature_catalog/mcp_tool_surface/read_path_freshness.md`.

**Purpose:** make one program own the canonical naming form for catalog/playbook content, land the underscore restyle
without regressing validation, the Lane C benchmark corpus, or CI, and keep the two completed de-numbering packets as
the historical record of how the convention got here.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- The three children below.
- Re-nesting the two completed de-numbering packets from top-level `015-sk-doc-parent/025` and `.../026` into this
  parent as `001` and `002`, with a lockstep reference sweep (their own `packet_pointer` paths, the `014` parent's
  `children_ids`, and any cross-references), and reconciling their stale completion metadata during the move
  (`graph-metadata.json` status `planned`->`complete`; continuity blocks refreshed).
- The new underscore restyle (`003`), scoped in its own `spec.md`.

**Out of scope (deliberate):**
- Skill / agent / command directory names and spec phase-folder names — hyphen-only by hard convention
  (`^[0-9]{3}-[a-z0-9-]+$` and OpenCode skill naming). Never underscored.
- Changelogs, `z_archive/`, and completed spec-folder history — frozen; they record prior names.
- Reopening the completed de-numbering work — 001/002 are re-nested as-is, not re-executed.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phases -->
## 4. CHILDREN

| Child | Origin | Outcome |
|-------|--------|---------|
| **001** | re-nested from top-level 025 | De-numbered category folders (`NN--` prefix removed). COMPLETE; re-nested + metadata reconciled. |
| **002** | re-nested from top-level 026 | De-numbered snippet filenames (`NNN-` prefix removed). COMPLETE; re-nested + metadata reconciled. |
| **003** | new | Hyphen->underscore restyle of all in-scope content folders AND per-feature files, with convention docs, guard, migration tooling, execution, and re-benchmark. See `003-underscore-content-folders-and-files/spec.md`. |
| **004** | folded in (operator directive) | Decommission of the checked-in Superset/Copilot hook bridge — NOT a naming-convention debt; grouped here at operator request. 6 deletes + 6 surgical edits + local-config purge, spec-kit Copilot priming preserved. See `004-remove-superset-copilot-hook-bridge/spec.md`. |

> Note: child 004 is unrelated to catalog/playbook naming; it was folded into this parent solely at operator direction to keep the active workstream together. Its scope, risks, and evidence live entirely in its own docs.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. 001 and 002 live under this parent; the `014` parent no longer lists top-level `025`/`026`; every re-nested
   reference resolves; their completion metadata reads `complete` (not `planned`).
2. 003's own success criteria pass (see its `spec.md`).
3. `validate.sh --recursive --strict` is Errors 0 across this parent and all three children.
4. No skill/agent/command/phase-folder name was underscored; no changelog/archive/history was rewritten.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Re-nest ref breakage** — renumbering 025/026 to 001/002 restates every `packet_pointer` and the parent's
  `children_ids`; mitigated by a scripted word-boundary-safe sweep and a recursive strict validate after the move.
- **External references to "025"/"026"** — memory goal files and prior narrative cite those numbers; the move stales
  those pointers. Flagged for a follow-up memory pass; not a build blocker.
- **Dependency:** the underscore migration (003) depends on the re-nest (001/002) only for final tree consistency,
  not for its own logic; the two can proceed in parallel and reconcile at the 003 gate.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The renumber-vs-preserve choice for 025/026 was decided in favor of renumber (001/002) for a clean
program; the operator may override before the re-nest lands.
<!-- /ANCHOR:questions -->


<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Child | Status |
|-------|-------|--------|
| 001 | `001-deprecate-numbered-category-prefix` | Complete |
| 002 | `002-deprecate-numbered-snippet-filenames` | Complete |
| 003 | `003-underscore-content-folders-and-files` | Complete |
| 004 | `004-remove-superset-copilot-hook-bridge` | Complete |
<!-- /ANCHOR:phase-map -->
