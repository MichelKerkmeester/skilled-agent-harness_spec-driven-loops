---
title: "Feature Specification: command-canon remediation (phase parent)"
description: "Phase parent implementing the 012 command-improvement backlog via a versioned machine-readable command contract. The contract is the single source for templates, routers, loaders, mirrors, semantic validation, and benchmark discovery, instead of prose duplicated across seven surfaces and per-command patching. Sequenced keystone-first (compose frontmatter validation) then contract, semantic validation, generation, and command-local cleanup last. Asset-layer phases are refined by the 014 asset-layer research."
trigger_phrases:
  - "command canon remediation"
  - "versioned command contract"
  - "command validator compose"
  - "command surface remediation phases"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation"
    last_updated_at: "2026-07-16T07:15:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded remediation phase parent + P0 phases"
    next_safe_action: "Build phase 000 keystone validator compose"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
---

# Feature Specification: command-canon remediation (phase parent)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## ROOT PURPOSE

Implement the cross-model improvement backlog produced by the 012 research: make a **versioned, machine-readable command contract** the single source that every surface consumes, so command-authoring truth no longer lives as prose duplicated across seven surfaces (skill, two templates, router prose, workflow YAML, runtime, mirrors, benchmark adapters), and make the validator authors run enforce behavioral invariants, not just section presence.

The corrective sequence — established independently by both research lineages — is **keystone first, contract second, semantic validation third, generation fourth, command-local cleanup last.** Reversing it repairs symptoms while preserving the authoring mechanism that produces them. Per-command patching is explicitly rejected.

This parent documents root purpose only. Each phase child carries its own scope, plan, and verification. Asset-layer detail (the `_auto.yaml` / `_confirm.yaml` / `_presentation.txt` triad and the `doctor` route-manifest YAMLs) is deepened by the sibling `014-command-asset-layer-research` and folds into phases 001/002/003/005.

---

## PHASE DOCUMENTATION MAP

| Phase | Scope | Backlog | Status |
| --- | --- | --- | --- |
| `000-keystone-validator-compose` | Compose frontmatter validation into the canonical `validate_document.py --type command` path | K1 | Materialized |
| `001-versioned-command-contract` | Define the versioned command contract (topology, gate owner, execution targets, mode matrix, owned assets, loader reqs, presentation ownership + typed exceptions, destructive policy, runtime aliases); fix required-input contradiction + stale template refs | K2 | Materialized (014 asset detail delivered) |
| `002-executable-edge-route-parsing` | Schema-aware executable-edge route parsing instead of raw-text inference; clear the false P0 cycles | K3 | Materialized |
| `003-semantic-validation-and-fixtures` | Router-gate alternative + `gate_obligation`; semantic invariant checks + mutation fixtures; mode-completeness check across all families | W1, W2, W6 | Planned |
| `004-census-runtime-taxonomy` | Freeze command census; normalize cross-runtime invocation + split host/leaf roles; shape-based topology taxonomy incl. route-manifest variant | W3, W4, W5 | Planned |
| `005-generation-and-cleanup` | Generate thin routers + asset tables from the contract; command-local mismatch fixes; hint budget; loader/subaction ergonomics | G1, G2, G3, G4 | Planned |
| `006-claude-parity-decision` | Decide Claude command parity explicitly — wire the mirror or re-scope canon/benchmark to opencode+codex | D1 | Planned (decision gate) |

**Dependency spine:** 000 then 001 then 003 then 005; phases 002 and 004 run independently of the keystone-to-contract chain; 006 is a decision gate, not code.

---

## SOURCE

The backlog, evidence, and acceptance criteria are in `012-command-improvement-research/research/research.md` (cross-model synthesis) and its per-lineage sources. The asset-layer phases additionally consume `014-command-asset-layer-research/research/research.md` once that run completes.
