---
title: "D2-R3 — Metadata fragmented across wrapper/hub/registry; no SSOT or drift gate"
description: "Create sk-design/command-metadata.json as the command-surface SSOT plus a design-command-surface-check.mjs drift gate, keeping mode-registry.json routing-only."
trigger_phrases:
  - "d2-r3 command metadata ssot"
  - "command metadata ssot design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D2-R3 — Metadata fragmented across wrapper/hub/registry; no SSOT or drift gate

## 1. OBJECTIVE
Establish one source of truth for the design command surface and a deterministic checker that drift-gates the wrappers against it.

## 2. WHY
Command metadata is scattered across wrapper frontmatter, the hub, and the registry with no single authority, so the surfaces silently drift and nothing fails.

## 3. TARGET & CLASS
- **Target file(s):** new `.opencode/skills/sk-design/command-metadata.json` + `design-command-surface-check.mjs`
- **Severity:** P0
- **Enforcement class:** enforceable
- **Dimension:** D2 — Command Specificity

## 4. BUILD OUTLINE
- Create `command-metadata.json` keyed by command: ownerMode, description, argumentHint, aliases, accepts, returns, next, proofFields, deferToHubWhen.
- Constrain each ownerMode to equal a `workflowMode`; keep `mode-registry.json` routing-only.
- Add `design-command-surface-check.mjs` asserting wrapper frontmatter equals metadata.
- **Candidate nested sub-phases (materialize at execution):** (a) author the metadata schema + data; (b) build the surface checker + alias-uniqueness gate.

## 5. ACCEPTANCE
- Checker fails on any wrapper/metadata mismatch, unknown ownerMode, or duplicate alias; passes on an aligned surface.

## 6. EVIDENCE
- `sk-design/SKILL.md:41` — hub-level metadata with no SSOT binding.
- `commands/design/interface.md:2` — wrapper frontmatter is a separate, undrift-checked copy.
- Source: `research/research.md` §5 (D2-R3)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
