---
title: "Implementation Plan: Fix the four-folder rename and record the shared/ decision"
description: "Implementation Plan for phase 001 of the parent-nested-skill-pattern epic: sweep every live reference from the four old bare packet paths to their deep- prefixed names, verify resolution and parity, and record the shared/-stays decision."
trigger_phrases:
  - "deep-loop-workflows rename fix plan"
  - "parent-nested-skill-pattern phase 001 plan"
  - "deep- prefix sweep plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/150-parent-nested-skill-pattern/001-rename-fix-and-shared-decision"
    last_updated_at: "2026-06-15T09:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored implementation plan for the rename-fix phase"
    next_safe_action: "Verify sweep then validate and commit scoped"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-001-rename-fix-and-shared-decision-implementationplan"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Fix the four-folder rename and record the shared/ decision

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs, `.cjs` runtime, JSON registry/metadata, YAML command assets |
| **Framework** | `deep-loop-workflows` parent skill over the frozen `deep-loop-runtime` backend |
| **Storage** | `.opencode/skills/deep-loop-workflows/`, `.opencode/commands/deep/`, `.opencode/skills/cli-opencode/` |
| **Testing** | broken-ref grep == 0, packet `.cjs` require-resolution, `deep-loop-runtime` vitest, advisor `skill_graph_scan`, `validate.sh --strict` |

### Overview
A deterministic reference sweep executed directly by the orchestrator — no worker fleet, because the change is mechanical and reversible. The four renamed bare packet names (`context`/`research`/`review`/`improvement`) are rewritten to their `deep-` prefixed forms everywhere they appear in live surfaces, with `ai-council` and the `deep-loop-workflows`/`deep-loop-runtime` roots untouched. Sweep correctness is the only real risk: zero-match false-negatives (BSD-grep `\b`) and double-prefix mangling are guarded by baseline-checked match counts, a bare-form second pass, and a final repo-wide grep. The architectural question raised alongside the rename — whether `shared/` belongs in the backend — is answered NO and recorded.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent skill exists in its merged form (`../147-deep-loop-workflows` complete).
- [x] The four folders are renamed on disk; `ai-council` left as-is.
- [x] Scope limited to reference consistency + the `shared/` decision per `spec.md`.

### Definition of Done
- [x] Zero `deep-loop-workflows/{context,research,review,improvement}/` refs (slash + bare forms) in live surfaces.
- [x] `mode-registry.json` valid; packet keys match on-disk folders.
- [x] All packet `.cjs` scripts resolve their requires.
- [x] `deep-loop-runtime` vitest green modulo the documented pre-existing flake; advisor scan clean.
- [x] `decision-record.md` (shared/-stays) authored.
- [x] `validate.sh --strict` green on this phase (close-out, this turn).

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic find-and-rewrite sweep over a fixed file set, plus one decision record. Additive-consistency and fully reversible via `git restore`; no behavior surface is touched.

### Parallel Groups (worker fleet)
- **None.** The orchestrator executed the sweep directly. A mechanical, deterministic rewrite does not benefit from fleet parallelism and would only add dispatch risk.

### Read/Write Split
Orchestrator reads (grep/baseline), writes (per-packet `perl`/`Edit` sweeps + the registry/asset/script edits), and verifies (grep, require-resolution, vitest, advisor scan). No CLI executor or `claude2` seat is involved.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the four on-disk folder renames and that `ai-council` is unchanged.
- [x] Capture a baseline match count for the old bare paths to guard against zero-match false-negatives.

### Phase 2: Core Implementation
- [x] T001 Repoint `mode-registry.json` packet keys (4) to the `deep-` prefixed names. (`.opencode/skills/deep-loop-workflows/mode-registry.json`) — _verify:_ `node -e` JSON.parse succeeds and keys equal on-disk folder names.
- [x] T002 Rewrite the `/deep:*` command YAML assets referencing the four old packet paths. (`.opencode/commands/deep/assets/`) — _verify:_ grep over `assets/` shows zero old-form refs.
- [x] T003 Fix `buildLoopPrompt` SKILL.md paths for context/research/review. (`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`) — _verify:_ the constructed paths resolve to existing `deep-*/SKILL.md`.
- [x] T004 Update the hub `graph-metadata.json` `key_files` + hub `SKILL.md` + `README.md`. (`.opencode/skills/deep-loop-workflows/{graph-metadata.json,SKILL.md,README.md}`) — _verify:_ referenced paths exist on disk.
- [x] T005 Per-packet internal doc sweep across the four renamed packets (slash form). (`.opencode/skills/deep-loop-workflows/deep-*/`) — _verify:_ 388 files swept; zero double-prefix (`deep-deep-`) hits.
- [x] T006 Bare-form straggler sweep for quote-terminated refs missed by the slash pattern. (`.opencode/skills/deep-loop-workflows/deep-*/`) — _verify:_ 3 files swept; bare-form grep returns 0.
- [x] T007 Fix the cross-reference straggler outside the packet file-lists. (`.opencode/skills/cli-opencode/references/destructive_scope_violations.md`) — _verify:_ the three `review/` refs now read `deep-review/`; repo-wide grep returns 0.
- [x] T008 Author the `shared/`-stays decision record. (`decision-record.md`) — _verify:_ ADR states the execution-vs-synthesis rationale (amended post-research).
- [x] T009 Refresh phase metadata and run strict validation. (`description.json`, `graph-metadata.json`) — _verify:_ `validate.sh --strict` exits 0.

### Phase 3: Verification
- [x] Broken-ref grep over live surfaces returns 0 (slash + bare).
- [x] Packet `.cjs` require-resolution check passes for all packet scripts.
- [x] `deep-loop-runtime` vitest green modulo the documented pre-existing loop-lock cross-process flake.
- [x] Advisor `skill_graph_scan` clean (no rejected edges from this change).
- [x] `validate.sh --strict` on this phase folder (close-out).

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Reference integrity | Live surfaces | repo-wide grep for both old-form patterns returns 0, excluding `.opencode/specs/**` and `**/changelog/**` |
| Resolution | Packet scripts | resolve each packet `.cjs` require/import; spot-run a representative subset |
| Parity | Runtime | `deep-loop-runtime` vitest; only the known cross-process loop-lock flake may differ |
| Advisor | Graph | `skill_graph_scan` reports no rejected edges introduced by the rename |
| Structural | Spec docs | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../147-deep-loop-workflows` | Internal epic | Complete | The parent skill must exist in merged form |
| On-disk folder renames | Operator action | Done | The sweep targets the renamed paths |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: broken-ref grep is non-zero after the sweep, a packet script fails to resolve, or `validate.sh --strict` errors.
- **Procedure**: `git restore` the swept paths (registry, assets, `fanout-run.cjs`, hub files, packet docs, the cli-opencode reference). No data migration; the change is reference-text only.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `../147-deep-loop-workflows` + on-disk rename | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | The parent's phase-2 research |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | confirm rename + baseline grep |
| Core Implementation | Medium | mechanical sweep across ~392 files + 1 decision record |
| Verification | Medium | grep + resolution + vitest + advisor scan + strict validate |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline match count captured (guards against zero-match false-negatives).
- [x] `ai-council` and the `deep-loop-workflows`/`deep-loop-runtime` roots confirmed out of the sweep pattern.

### Rollback Procedure
1. **Sweep matched zero files (BSD-grep `\b` portability).** -> Re-run with trailing-slash + bare-form patterns; verify match count against the baseline before trusting "0 broken refs."
1. **Double-prefix mangling (`deep-deep-context`).** -> `git restore` the affected packet, re-run with the bare-name-anchored pattern, and grep for `deep-deep-` to confirm zero.
1. **A live reference outside the packet file-lists left stale.** -> repo-wide grep; fix in place (this is how the `cli-opencode` straggler was caught).

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: `git restore` the swept files; no data migration.

<!-- /ANCHOR:enhanced-rollback -->
