---
title: "Feature Specification: sk-doc Documentation-Quality Program (phase parent)"
description: "The sk-doc documentation-quality program: restore the skill tree to sk-doc's own standards across four fronts (legacy/misplaced metadata JSONs, reference/asset template alignment, per-folder code READMEs repo-wide, and bare skill/mode READMEs) plus the doc-tooling bugs the audits surfaced. Eight phases, hardest and highest-leverage first, each one reviewable commit; agent-swarm authoring against the current templates."
trigger_phrases:
  - "documentation quality program"
  - "sk-doc readme and template conformance"
  - "code readme and json cleanup program"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program"
    last_updated_at: "2026-07-22T13:27:47Z"
    last_updated_by: "claude"
    recent_action: "Opened the program; shipped phase 001 (JSON cleanup + conventions)."
    next_safe_action: "Author phase 002 (reference/asset template alignment)."
    blockers: []
    key_files: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN: merge/migration/consolidation narratives (use context-index.md); heavy docs (plan/tasks/checklist/decision-record/implementation-summary belong in children).
  REQUIRED: root purpose; the phase map.
-->

# Feature Specification: sk-doc Documentation-Quality Program

## EXECUTIVE SUMMARY

sk-doc owns the repo's documentation standards (the README, reference, asset, and code-README templates and the `validate_document.py` gate), yet several classes of its own output have drifted from those standards. This program restores conformance across four fronts and fixes the doc-tooling bugs four read-only audits surfaced. The recurring finding is that the core work is smaller and cleaner than the raw asks implied (one JSON to remove, three template files to fix, thirteen bare READMEs to rewrite, one hundred nineteen missing code READMEs), while each audit surfaced an optional repo-wide extension and a few real infrastructure bugs.

Templates and tooling land first so all authoring runs against a correct, enforceable standard. Every phase is one reviewable commit on the `sk-doc/0097-documentation-quality` worktree, and merge to v4 stays operator-gated. No frozen files or unrelated trees are touched.

## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus |
|---|---|---|
| 001 | `001-json-cleanup-and-conventions` | Remove the one dead advisor-metadata residue; harden the doctrine, `parent-skill-check.cjs` (recursive rule 2b), and AGENTS.md so it cannot recur |
| 002 | `002-reference-asset-template-alignment` | Conform the 3 flagged create-skill reference/asset files to the ALL-CAPS, frontmatter, and HVR standard; close the `h2UppercaseRequired` validator gap |
| 003 | `003-doc-tooling-and-template-fixes` | Fix the broken `validate_document.py` path; small `skill-readme-template.md` clarifications; document `audit_readmes.py` |
| 004 | `004-skill-mode-readme-overhaul` | Rewrite the 13 bare skill/mode READMEs (11 sk-doc modes + 2 sk-code surfaces) plus a light restructure of 2 structural-drift READMEs |
| 005 | `005-code-readmes-infra-and-sk` | Author code READMEs for the small-infra hubs plus the sk-doc and sk-code batch |
| 006 | `006-code-readmes-design-prompt-speckit` | Author code READMEs for sk-design, sk-prompt, and system-spec-kit |
| 007 | `007-code-readmes-deep-loop` | Author code READMEs for system-deep-loop (including the 35 `runtime/lib` domains) and fix the stale runtime catalogs |
| 008 | `008-verification-and-closeout` | Full validation gate; conformance sweeps; surface the optional repo-wide extensions |

> **Phase-parent note:** this `spec.md` is the only authored document at the parent level. Per-phase scope, plans, tasks, and evidence live in the phase children. A per-phase cross-reference is maintained in `context-index.md`.
