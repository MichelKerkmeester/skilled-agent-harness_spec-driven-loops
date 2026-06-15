---
title: Runtime Capability Matrix
description: Single source of truth for deep-research runtime parity, lifecycle guarantees, and provider adaptation requirements.
trigger_phrases:
  - "runtime capability matrix"
  - "deep research runtime parity"
  - "provider adaptation rules"
  - "non-hook equivalence"
  - "research parity baseline"
importance_tier: important
contextType: implementation
---

# Runtime Capability Matrix

Canonical runtime parity reference for deep-research mirrors and provider adaptation.

---

## 1. OVERVIEW

### Purpose

Canonical runtime contract for `deep-research`. This matrix defines what every runtime mirror must support and what the workflow may adapt per provider. Packet files remain the source of truth; runtime behavior may differ only where this matrix says it may differ.

### Machine-Readable Source of Truth

- Data: `.opencode/skills/deep-loop-workflows/research/assets/runtime_capabilities.json`
- Resolver: `.opencode/skills/deep-loop-workflows/research/scripts/runtime-capabilities.cjs`

---

## 2. PARITY BASELINE

Every runtime mirror for `@deep-research` must preserve these invariants:

1. LEAF-only execution. No sub-agent dispatch.
2. Canonical packet paths under `{spec_folder}/research/`, especially `research/deep-research-state.jsonl` and `research/findings-registry.json`.
3. Lifecycle vocabulary: `resume`, `restart`, `fork`, `completed-continue`.
4. Reducer-owned synchronization of strategy, dashboard, findings registry, and synthesis metadata.
5. Canonical pause sentinel: `research/.deep-research-pause`.
6. Lineage metadata keys: `sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`.

If any mirror drifts on those invariants, treat it as a contract failure rather than a runtime-specific customization.

---

## 3. MATRIX

| Runtime | Mirror Path | Tool Surface | Hook Bootstrap | Schema Adaptation | Fallback Bridge Eligible | Notes |
|---------|-------------|--------------|----------------|-------------------|--------------------------|-------|
| OpenCode / Copilot | `.opencode/agents/deep-research.md` | `Read`, `Write`, `Edit`, `Bash`, `Grep`, `Glob`, `WebFetch`, memory | Yes (plugin) | Low | Yes | OpenCode uses plugin-based hooks (`@opencode-ai/plugin`); Copilot uses repo-local session-start banner hook. |
| Claude | `.claude/agents/deep-research.md` | `Read`, `Write`, `Edit`, `Bash`, `Grep`, `Glob`, `WebFetch`, MCP memory | Yes | Low | Yes | Default command YAML example path points here, but behavior is runtime-agnostic. |
| Codex | `.codex/agents/deep-research.toml` | `Read`, `Write`, `Edit`, `Bash`, `Grep`, `Glob`, `WebFetch`, memory MCP | Yes | Medium | Yes | TOML mirror must keep the same lifecycle/reducer contract as the Markdown mirrors. |

---

## 4. ADAPTATION RULES

Allowed runtime adaptation:

- Tool names and transport details may change per runtime.
- Provider-specific request formatting may change.
- Hook-based startup ergonomics may change.

Forbidden runtime drift:

- Renaming packet artifacts.
- Changing lifecycle branch meaning.
- Letting agent mirrors own reducer outputs.
- Treating logs or traces as the source of truth instead of packet files.

---

## 5. NON-HOOK EQUIVALENCE

Hook-capable and non-hook runtimes must reach the same branch decision when given the same packet files:

- Active packet -> `resume`
- Completed packet reopened -> `completed-continue`
- Explicit user reset -> `restart`
- Explicit branch-from-current-state -> `fork`

The packet, not the hook state, decides the branch.

---

## 6. VALIDATION TARGETS

Use this matrix as the parity checklist for validation:

- Each mirror mentions the same canonical packet files.
- Each mirror mentions reducer-owned synchronization.
- Each mirror mentions the same lineage keys.
- Each mirror preserves LEAF-only enforcement.
- Each mirror treats `research/.deep-research-pause` as the only pause sentinel.
