---
title: "Feature Specification: Fix the four-folder rename and record the shared/ decision"
description: "The operator renamed four deep-loop-workflows mode-packet folders to the deep- prefix (context→deep-context, research→deep-research, review→deep-review, improvement→deep-improvement; ai-council unchanged), breaking the path references the 152 build wired to the bare names. This phase sweeps every live surface back to consistency and records the architectural decision that shared/ stays in deep-loop-workflows rather than moving into the frozen deep-loop-runtime."
trigger_phrases:
  - "deep-loop-workflows folder rename fix"
  - "deep- prefix packet rename"
  - "shared stays in deep-loop-workflows"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/155-parent-nested-skill-pattern/001-rename-fix-and-shared-decision"
    last_updated_at: "2026-06-15T09:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Swept rename refs to consistency; authoring phase docs"
    next_safe_action: "Validate and commit phase 001 scoped"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/mode-registry.json"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-001-rename-fix-and-shared-decision"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Does shared/ move into deep-loop-runtime? (No — it would create a runtime→system-spec-kit dependency violating the frozen MCP-free boundary)"
---
# Feature Specification: Fix the four-folder rename and record the shared/ decision

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Phase** | 001 (parent: `155-parent-nested-skill-pattern`) |
| **Depends on** | `../152-deep-loop-workflows` (the merge that created the parent skill) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 152 merge wired `deep-loop-workflows`'s internal references to bare packet names (`context/`, `research/`, `review/`, `improvement/`, `ai-council/`). The operator then renamed four of those folders to carry the `deep-` prefix that matches each packet's own `SKILL.md` `name:` — `context→deep-context`, `research→deep-research`, `review→deep-review`, `improvement→deep-improvement` — leaving `ai-council` as-is. Every reference to the four renamed paths is now broken: the `mode-registry.json` packet keys, the `/deep:*` command YAML assets, `deep-loop-runtime/scripts/fanout-run.cjs`'s loop-prompt SKILL.md paths, the hub `graph-metadata.json` `key_files`, the hub `SKILL.md`/`README.md`, and the internal docs inside each packet. Separately, the epic raised whether the packet-shared `shared/` directory belongs in the frozen `deep-loop-runtime` backend instead of in `deep-loop-workflows`.

### Purpose
Make the renamed structure consistent and working again — zero broken references in live surfaces, all packet scripts resolving, registry/JSON valid — and record the architectural decision that `shared/` stays in `deep-loop-workflows`. This is a mechanical reference sweep plus one decision record; it changes no deep-loop mode behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `mode-registry.json` — the four renamed `packet` keys repointed to `deep-context`/`deep-research`/`deep-review`/`deep-improvement` (`ai-council` key unchanged).
- The `/deep:*` command YAML assets that reference the four old packet paths.
- `deep-loop-runtime/scripts/fanout-run.cjs` — the `buildLoopPrompt` SKILL.md paths for context/research/review.
- Hub `deep-loop-workflows/graph-metadata.json` `key_files`, hub `SKILL.md` routing/layout lines, and `README.md`.
- The per-packet internal documentation sweep (the four renamed packets only), repointing `deep-loop-workflows/{context,research,review,improvement}/` → the `deep-`-prefixed paths.
- One cross-reference straggler in `cli-opencode/references/destructive_scope_violations.md` that the original file-list sweep did not cover.
- `decision-record.md` capturing the `shared/`-stays decision and its rationale.

### Out of Scope
- The routing/identity-model rework (registry-driven routing, discoverability) — that is research-gated and lands in later phases.
- Any move of `shared/` into `deep-loop-runtime`, any MCP reintroduction, or any `improvement` `loopType`.
- Any change to a deep-loop mode's convergence, state, artifacts, or permissions (byte-identical parity stays frozen from 152).
- Renaming the `ai-council` folder or reconciling its folder≠`name:` mismatch (accepted under one-identity; deferred to research).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1 (MUST):** Zero references to `deep-loop-workflows/{context,research,review,improvement}/` (slash and bare/quote-terminated forms) remain in live surfaces (skills, commands, agents, advisor, root docs), excluding historical spec/changelog evidence.
- **R2 (MUST):** Every `.cjs` script under the four renamed packets resolves its `require()`/import paths (depth correct after the rename).
- **R3 (MUST):** `mode-registry.json` is valid JSON; the four renamed `packet` keys point at the `deep-`-prefixed folders; `ai-council` is unchanged.
- **R4 (MUST):** The `shared/`-stays decision is recorded in `decision-record.md` with its frozen-boundary and semantic-mismatch rationale.
- **R5 (MUST):** No regression in the `deep-loop-runtime` test suite beyond the known pre-existing cross-process loop-lock flake; the advisor `skill_graph_scan` stays clean.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

This phase is complete when:
- Broken-ref grep over live surfaces returns **0** for both the slash and bare forms.
- All packet `.cjs` scripts resolve (spot-run + require-resolution check).
- `mode-registry.json` parses and its keys match the on-disk folder names.
- `deep-loop-runtime` vitest is green modulo the documented pre-existing flake; advisor `skill_graph_scan` reports no rejected edges from this change.
- `decision-record.md` (shared/-stays) authored; `validate.sh --strict` green on this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

**Depends on:** `../152-deep-loop-workflows` (the parent skill must already exist in its merged form).

- A sweep pattern that silently matches zero files (BSD-grep `\b` portability) — mitigated by sanity-checking match counts against a known baseline and using trailing-slash + bare-form patterns.
- Double-prefix mangling (`deep-deep-context`) from an over-broad sweep — mitigated by anchoring the pattern on the bare names only and verifying zero double-prefix hits.
- A reference outside the packet file-lists (e.g. a cross-skill doc) left stale — caught by a final repo-wide grep, which is how the `cli-opencode` straggler was found.

Rollback is `git restore` of the swept paths; the change is additive-consistency only, no data migration.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Parity:** no deep-loop mode behavior changes (path-reference consistency only).
- **Backend boundary:** `deep-loop-runtime` stays MCP-free; `shared/` does not move into it.
- **Validation:** `validate.sh --strict` green on this phase before the research phase begins.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A reference using the bare quote-terminated form (`deep-loop-workflows/research"`) with no trailing slash — the slash-anchored file-list misses it; a second bare-form sweep is required.
- A path that legitimately contains a renamed substring at the root level (`deep-loop-workflows/` itself, or `deep-loop-runtime/`) — must not be rewritten; the pattern targets the four bare packet names only.
- Historical references in `.opencode/specs/**` and `**/changelog/**` that describe the pre-rename state — intentionally left untouched (they document history).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Large blast-radius by file count (the rename moves hundreds of packet files and rewrites their internal cross-references), but low conceptual risk: it is a mechanical, reversible, deterministic reference sweep with a single architectural decision attached. The risk is sweep-correctness (zero-match false-negatives, double-prefix mangling), addressed by baseline-checked patterns and a final repo-wide grep.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None blocking. The routing-model and `ai-council`-mismatch questions are deliberately deferred to the parent's phase-2 research (see `../spec.md` §4 Open Questions).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent control file**: `../spec.md` (Phase Documentation Map).
- **Decision**: `decision-record.md` (shared/-stays, ai-council-mismatch-accepted).
- **The parent skill**: `.opencode/skills/deep-loop-workflows/`.
- **Frozen backend**: `.opencode/skills/deep-loop-runtime/`.
