---
title: "Feature Specification: Non-Hub Rollout — Phase Parent"
description: "Phase parent for compiling standalone, non-hub skills that own an inline router and have no sub-mode packets. Each child proves typed projections, frozen-scorer compatibility, zero-authority shadow parity, and fenced byte-exact rollback before any live activation."
trigger_phrases:
  - "non hub router rollout"
  - "standalone skill compiled policy"
  - "inline skill router canary"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Non-Hub Rollout — Phase Parent

## Purpose

Compile standalone skills that carry their own inline router into the unified policy contract. A child remains shadow-only until its typed fixtures pass the frozen scorer, its legacy comparison is classified at zero effects, and a one-generation fenced activation can be rolled back to byte-identical prior manifest bytes.

## Phase Documentation Map

| Order | Folder | Skill | Router shape |
|-------|--------|-------|--------------|
| 1 | `001-sk-git/` | `sk-git` | One standalone destination, five authored intents, inline resource map, explicit default |

## Boundaries

- The phase does not modify live skills, routing configuration, shared compiler code, or scorer code.
- Heavy implementation documentation belongs in each child.
- Legacy remains serving-authoritative throughout shadow verification.
