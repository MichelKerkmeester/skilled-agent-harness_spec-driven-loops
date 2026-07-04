---
title: "Feature Specification: Phase 11 — hub canon (the ONE parent-hub method)"
description: "Define the single canonical parent-hub method: the sk-design/sk-code 2-tier shape generalized, with deep-loop's 3-tier machinery expressed as named extensions and a two-axis modes[] model (packetKind workflow|surface). Publish the sk-doc templates + a new hub-router schema doc, and upgrade parent-skill-check.cjs to enforce it (new checks 5-9 at WARN, promoted to FAIL in 015)."
trigger_phrases:
  - "parent hub canonical method"
  - "hub-router.json schema"
  - "two-axis parent hub packetKind"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/011-hub-canon"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the canonical two-axis contract; grounded it in the sk-code registry/router/description shapes"
    next_safe_action: "Author sk-doc templates + schema doc (GPT) and upgrade parent-skill-check.cjs + vocab-sync (Claude), then run the 3-hub gap inventory"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/assets/skill/parent_skill_hub_template.md"
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11 — hub canon

<!-- SPECKIT_LEVEL: 2 -->

## Overview

The repo has two rival parent-hub shapes: deep-loop-workflows' 3-tier machinery and
the sk-design/sk-code 2-tier shape, with the canon docs/templates/validator encoding
the wrong/old one. This phase defines ONE method and makes the tooling enforce it.

## The canon (settled)

Canon = the 2-tier shape generalized; deep-loop's 3-tier machinery becomes **named
extensions** that activate in-place fields (never relocated — the advisor drift-guard
hashes `advisorRouting.*` at current locations and must stay green). **Two-axis
model:** every packet is a `modes[]` entry with a required `packetKind:
"workflow" | "surface"` discriminator; surfaces are `backendKind: "evidence-base"`,
read-only `toolSurface`, `routingClass: metadata`; no separate array.
`hub-router.json` + `description.json` become REQUIRED for all hubs.

Full field-level contract: `/private/tmp/.../scratchpad/124-011-canonical-contract.md`
(this session), which expands into the published `parent_hub_router_schema.md`.

## Scope (FROZEN)

- **sk-doc templates** (rewrite/new): `parent_skill_hub_template.md`,
  `parent_skill_registry_template.json`, `parent_skill_graph_metadata_template.json`,
  NEW `parent_skill_hub_router_template.json`, NEW `parent_skill_description_template.json`,
  NEW `references/skill_creation/parent_hub_router_schema.md`; rewrite
  `parent_skills_nested_packets.md`; update `skill_creation.md` index + sk-doc `SKILL.md`
  (routable PARENT_HUB intent).
- **Enforcement** (Claude): upgrade `parent-skill-check.cjs` (full checks all hubs;
  new checks 5-9 at WARN); update `doctor_parent-skill.yaml`; fix
  `parent-hub-vocab-sync.cjs` (fail-loud missing-router P0, stale prose) + its vitest
  fixtures in the SAME commit.
- **Scaffolder** (Claude): `/create:sk-skill-parent` emits the full canon file set;
  scratch-scaffold → parent-skill-check clean → delete (QA).

## Requirements

- R1: Templates + schema doc conform to the canonical contract; sk-code is the canonical example.
- R2: `parent-skill-check.cjs` runs FULL checks on all three hubs (no basename gating);
  checks 5-9 WARN in this phase.
- R3: vocab-sync fails loud on a missing hub-router (P0), no longer silently no-ops; its
  vitest fixture update lands in the same commit.
- R4: advisor drift-guard stays GREEN untouched (additive-only changes).

## Verification

- advisor drift-guard GREEN; vocab-sync vitest GREEN (with fixtures); deep-improvement
  vitest suite GREEN.
- 3× parent-skill-check runs captured as the expected-gap inventory (deep-loop / sk-design /
  sk-code) that seeds 013/015.
- Scaffolder dry-run emits the canon shape and passes parent-skill-check clean.
- Full Level-2 doc completion + `validate.sh --strict` deferred to the 014 roll-up.
