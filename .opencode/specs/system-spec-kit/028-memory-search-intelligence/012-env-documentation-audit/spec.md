---
title: "Spec: ENV Documentation Deep Review and Remediation"
description: "A ten-iteration opus deep review of the repository ENV-variable documentation, and the remediation that fixed what it found. The review treated the canonical ENV_REFERENCE.md, the sibling environment_variables.md, the four changelogs, the root README, and the four skills' flag source as one surface. It found the reference was actively misleading, not merely incomplete: a stale dist build left twelve graduated features' documented disable knobs inert at runtime, five documented defaults were wrong, several entries were stale or contradictory across the two docs, and fifteen genuinely user-facing flags were undocumented including the bitemporal reads, the reverse-dependency force-parse and its degree cap, and the advisor RRF spine. The remediation rebuilt the dist, added the missing rows, corrected the defaults, reconciled the two docs, and fixed the structure, while verifying every finding against source and correcting three review errors in the process."
trigger_phrases:
  - "env documentation audit"
  - "ENV_REFERENCE.md missing flags"
  - "stale dist flag rename"
  - "undocumented feature flags"
  - "flag coverage gap"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/012-env-documentation-audit"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Audited ENV docs, rebuilt the stale dist, added 15 flags and fixed defaults"
    next_safe_action: "A separate house-style pass over pre-existing ENV_REFERENCE prose"
    blockers: []
---
# Spec: ENV Documentation Deep Review and Remediation

## 1. METADATA

A review-and-fix packet. It holds the ENV-documentation deep-review record (`review/review-report.md`) and tracks the remediation that cleared its findings. The doc edits live in the system-spec-kit ENV reference and its sibling.

## 2. PROBLEM & PURPOSE

The root README points readers to ENV_REFERENCE.md as the complete flag reference, and a code-graph changelog claimed specific flags were documented there. Neither held. A check of the code against the docs showed 412 flags read versus 289 documented, and the gap hid real defects: a stale build that made documented disable knobs inert, wrong defaults, and contradictions between the two ENV docs. This packet audits the whole ENV-documentation surface and fixes it so a reader who trusts the reference is not misled.

## 3. SCOPE

### In Scope

The deep-review record, and the remediation: the dist rebuild, the flag rows added to ENV_REFERENCE.md, the corrected defaults, the cross-doc reconciliations, and the structural fixes.

### Out of Scope

Reformatting the pre-existing ENV_REFERENCE.md prose for house style (a separate pass). Flipping any production default.

## 4. OUTCOME

Entry verdict POOR. The stale dist was rebuilt, fifteen genuinely user-facing flag rows were added, five defaults were corrected, two stale entries were fixed, three cross-doc inconsistencies were reconciled, and two structural issues were resolved. The remediation verified each finding against source and corrected three review errors. No production default was flipped.

## 5. ARTIFACTS

- `review/review-report.md` the deep-review record: the entry verdict, the defects by severity, the three review errors caught, and the remediation applied.
