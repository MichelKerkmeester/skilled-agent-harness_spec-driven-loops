---
title: "Feature Specification: sk-doc Documentation-Quality Program (phase parent)"
description: "The sk-doc documentation-quality program: restore the skill tree to sk-doc's own standards across four fronts (legacy/misplaced metadata JSONs, reference/asset template alignment, per-folder code READMEs repo-wide, and bare skill/mode READMEs) plus the doc-tooling bugs the audits surfaced. Phases sequenced hardest and highest-leverage first, each a reviewable commit, with agent-swarm authoring against the current templates."
trigger_phrases:
  - "documentation quality program"
  - "sk-doc readme and template conformance"
  - "code readme and json cleanup program"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-documentation-quality-program"
    last_updated_at: "2026-07-22T16:53:38Z"
    last_updated_by: "claude"
    recent_action: "Shipped 001-010; deep-review + remediation (011) landed the P0 fixes and validator hardening."
    next_safe_action: "Triage the remaining P1 README-accuracy findings."
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
| 008 | `008-existing-readme-cleanup` | Surgically repair older skill/code READMEs (broken refs traced to moved targets, missing OVERVIEW); delete the approved stale duplicate |
| 009 | `009-titlecase-config-and-closeout` | Harden the validator ALL-CAPS check; flip `h2UppercaseRequired` for reference/asset; uppercase the genuine offender headers |
| 010 | `010-deferred-code-and-checker-fixes` | Fix the 10a leaf-manifest checker path and the two data gaps it surfaced; flip skill/command `h2UppercaseRequired`; record the not-fixed decisions |
| 011 | `011-review-remediation` | Remediate the deep-review FAIL blockers: NUL-byte header corruption, non-runnable commands, and validator correctness |

> **Phase-parent note:** this `spec.md` is the only authored document at the parent level. Per-phase scope, plans, tasks, and evidence live in the phase children. A per-phase cross-reference is maintained in `context-index.md`.
