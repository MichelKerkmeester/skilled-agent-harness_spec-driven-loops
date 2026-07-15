---
title: "Feature Specification: pipeline command router inline — uniform triad shape for the 4 render-pipeline deep commands"
description: "Promote research/review/ai-council/alignment from opaque compiled-contract render stubs to full self-describing router triads (## 1..## 6 body + presentation + auto/confirm YAML), drop the runtime bang line, fold each command's autonomousExecutionDirective into the promoted body, and keep the compile/render/drift pipeline dormant-but-maintained in-repo."
trigger_phrases:
  - "deep command router inline"
  - "promote deep command body drop bang"
  - "render pipeline stub to router triad"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/064-deep-command-family-parity/004-pipeline-command-router-inline"
    last_updated_at: "2026-07-13T21:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded phase 004 planning docs (spec/plan/tasks/checklist/decision-record)"
    next_safe_action: "Begin Phase 2: promote the 4 bodies, fold the directive, drop the bang"
---
# Feature Specification: pipeline command router inline — uniform triad shape for the 4 render-pipeline deep commands

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Branch** | `wt/0036-deep-command-family-parity` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-deep-loop/064-deep-command-family-parity |
| **Predecessor** | 001-pipeline-command-parity (gave alignment render-pipeline parity + ai-council fix flip) |
| **Successor** | None pre-scoped (CI wiring of the drift/render checks remains a plausible tail) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 064 already converted `skill-benchmark` to a yaml-backed triad and gave `alignment`/`ai-council` render-pipeline parity, but the family still ships in three different shapes. Four commands — `research`, `review`, `ai-council`, `alignment` — remain opaque ~10-line "compiled-contract render stubs": frontmatter + an `# H1` + a single `!node render-command-contract.cjs --command deep/<name>` bang line that injects a compiled contract plus the legacy body at runtime. The file the operator opens is therefore not self-describing: its routing behaviour lives in a compiled artifact and a legacy body that are stitched in only at render time. The operator wants all 7 deep commands to share ONE self-describing router-triad shape (a full `## 1 ROUTER CONTRACT` → `## 6 WORKFLOW SUMMARY` router `.md` paired with `_presentation.txt` + `_auto.yaml` + `_confirm.yaml`) while KEEPING the compile/render/drift pipeline maintained in-repo.

### Purpose
Promote each of the four stubs to a full inline router body and drop the runtime bang, so the committed `command.md` is the self-describing router the family standard expects — without deleting the render pipeline. For each command the promoted body is lifted from its already-complete `assets/legacy/deep_<name>.body.md` (which is itself a full `## 1..## 6` router) under the existing frontmatter and `# H1`; the command's own compiled `autonomousExecutionDirective` prose is folded in as a short subsection so `:auto` behaviour is preserved without the bang; and the pipeline (`render-command-contract.cjs`, `compile-command-contracts.cjs`, `check-contract-drift.cjs`, `compiled/*.contract.md`, `legacy/*.body.md`, `manifest.jsonl`, `command-injection-rollout.json`) stays present, recompiled, drift-clean, and test-green. The four commands stay `fix` in the rollout so the render vitest `mode==='fix'` assertions keep passing; removing the bang is what decouples the LIVE runtime path, and nothing is deleted.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Promote the four stub bodies (`research`, `review`, `ai-council`, `alignment`) by lifting the `## 1..## 6` router content of each `assets/legacy/deep_<name>.body.md` under the existing frontmatter + `# H1`, and REMOVE the `!node render-command-contract.cjs` bang line.
- Fold each command's compiled `autonomousExecutionDirective` (from `assets/compiled/deep_<name>.contract.md`) into the promoted router body as a short subsection, preserving the `:auto` "setup already resolved / do not halt for the CLAUDE.md Gate-3 gate under AUTONOMOUS + prebound spec folder / dispatch-only + route-proof" prose.
- Preserve frontmatter `allowed-tools` byte-for-byte (the drift checker's `checkToolAllowlist` depends on it).
- Recompile the four compiled contracts (`compile-command-contracts.cjs --command deep/<name> --write`) so they stay fresh against the promoted sources.
- Keep the render/compile/drift pipeline dormant-but-maintained: scripts, `compiled/*.contract.md`, `legacy/*.body.md`, `manifest.jsonl`, and `command-injection-rollout.json` all stay in the repo; the four commands stay `fix` in the rollout.
- Update the create-command standard docs that cite `research`/`review`/`ai-council` as compiled-stub EXAMPLES (they are no longer stubs).

### Out of Scope
- Deleting or redesigning any pipeline script, compiled contract, legacy body, manifest, or rollout entry — the pipeline stays maintained, only the runtime bang is dropped.
- Changing any deep command's runtime BEHAVIOR (routing, dispatch, or gates). Promotion + directive-fold must be behaviour-preserving.
- The other three deep commands (`agent-improvement`, `model-benchmark`, `skill-benchmark`) — already bang-less yaml-backed triads.
- CI wiring of the drift/render/validate checks — a plausible follow-on, not built here.
- The create-agent dialect documentation (predecessor phase `003-deep-agent-family-reconciliation`) and the earlier parity/dispatch phases (`001-pipeline-command-parity`, `002-direct-dispatch-to-yaml`) — this phase builds on that 064 lineage but does not revisit it.

### Files to Change
Command and pipeline files below are the phase's IMPLEMENTATION targets, owned and edited by the orchestrator during execution; this spec folder documents them but does not itself mutate them.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/research.md` | Modify | Promote legacy body under frontmatter + H1, fold directive, drop bang |
| `.opencode/commands/deep/review.md` | Modify | Promote legacy body under frontmatter + H1, fold directive, drop bang |
| `.opencode/commands/deep/ai-council.md` | Modify | Promote legacy body under frontmatter + H1, fold directive, drop bang |
| `.opencode/commands/deep/alignment.md` | Modify | Promote legacy body under frontmatter + H1, fold directive, drop bang |
| `.opencode/commands/deep/assets/compiled/deep_research.contract.md` | Regenerate | Recompile against the promoted source |
| `.opencode/commands/deep/assets/compiled/deep_review.contract.md` | Regenerate | Recompile against the promoted source |
| `.opencode/commands/deep/assets/compiled/deep_ai-council.contract.md` | Regenerate | Recompile against the promoted source |
| `.opencode/commands/deep/assets/compiled/deep_alignment.contract.md` | Regenerate | Recompile against the promoted source |
| `.opencode/skills/sk-doc/create-command/SKILL.md` | Modify | ~line 318: drop the research/review/ai-council compiled-stub example |
| `.opencode/skills/sk-doc/create-command/assets/command_router_template.md` | Modify | ~line 102: same example correction |
| `.opencode/skills/sk-doc/create-command/assets/command_template.md` | Modify | ~line 843: same example correction |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each of the 4 commands has a full inline `## 1..## 6` router body, no bang line | `grep` finds `## 1` through `## 6`; no `render-command-contract.cjs` bang remains |
| REQ-002 | Each promoted body folds in the command's `autonomousExecutionDirective` prose | A dedicated autonomous-execution subsection is present in each body |
| REQ-003 | Frontmatter `allowed-tools` preserved byte-for-byte on all 4 | `checkToolAllowlist` reports no change; no `TOOL_ALLOWLIST_OVERFLOW` |
| REQ-004 | The 4 compiled contracts recompiled and fresh | `compile-command-contracts.cjs --write` clean; `check-contract-drift.cjs` exit 0 |
| REQ-005 | All 7 deep commands pass `validate_document.py --type command` | exit 0 each |
| REQ-006 | Render smoke passes for all 4 in `mode=fix` | `render-command-contract.cjs --command deep/<name> --compare` → COMPARE OK, no throw |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | The 4 stay `fix` in the rollout; render vitest `mode==='fix'` assertions stay green | `command-injection-rollout.json` unchanged for the 4 |
| REQ-008 | All four vitest suites pass | `render-command-contract`, `check-contract-drift`, `compile-command-contracts`, `resolve-injection-mode` green |
| REQ-009 | create-command standard docs no longer cite these 4 as compiled-stub examples | SKILL.md ~318, command_router_template.md ~102, command_template.md ~843 corrected |
| REQ-010 | Live `:auto` smoke of `research` + `review` behaves as before the bang drop | Manual dispatch confirms setup-resolved, no Gate-3 halt, route-proof |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 7 deep commands are self-describing router triads; the 4 promoted commands carry a full inline `## 1..## 6` body with no bang line.
- **SC-002**: `check-contract-drift.cjs` reports clean (exit 0) for every registered command after recompile; render smoke returns COMPARE OK in `mode=fix` for all 4.
- **SC-003**: `validate_document.py --type command` passes on all 7 commands, all four vitest suites are green, and the live `:auto` smoke of research/review preserves the prior autonomous behaviour.

### Acceptance Scenarios

- **Scenario 1**: **Given** a promoted `research.md`, **when** the operator opens it, **then** the full `## 1..## 6` router and the folded autonomous-execution subsection are visible in the committed file with no runtime bang.
- **Scenario 2**: **Given** the recompiled contracts, **when** `check-contract-drift.cjs` runs, **then** it reports clean and `render-command-contract.cjs --compare` returns COMPARE OK in `mode=fix`.
- **Scenario 3**: **Given** the bang is dropped but the rollout still marks the 4 as `fix`, **when** the render vitest runs, **then** its `mode==='fix'` assertions stay green because the pipeline remains maintained.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Dropping the bang changes machine-level Gate-3 satisfaction | Autonomous dispatch could halt for the doc gate | Investigation confirmed Gate-3 satisfaction is driven by the spec-gate hook's runtime `classificationOptions` (mode + bound spec folder), not by parsing the injected contract; the folded directive is belt-and-suspenders |
| Risk | Promoted body drifts from the legacy body it was lifted from | Two sources of truth for the router | Lift verbatim; the legacy body stays the compiler source, recompiled and drift-checked |
| Risk | `allowed-tools` accidentally reformatted during promotion | `TOOL_ALLOWLIST_OVERFLOW` / drift | Preserve frontmatter byte-for-byte; verify with `checkToolAllowlist` |
| Dependency | `render-command-contract.cjs` / `compile-command-contracts.cjs` / `check-contract-drift.cjs` | Internal, green | No path to keep the pipeline maintained if these break |
| Dependency | `command-injection-rollout.json` `fix` entries | Internal, green | Render vitest `mode==='fix'` assertions depend on the 4 staying `fix` |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Recompiling the four contracts and the full drift sweep complete in well under a second locally.

### Security
- **NFR-S01**: Promotion advertises no tool surface beyond each command's existing frontmatter `allowed-tools`; the read-only/native contracts (`alignment`, `review`) keep their existing surfaces.

### Reliability
- **NFR-R01**: The bang drop removes the LIVE runtime injection path only; the pipeline stays deterministic — recompiling the same promoted source yields a byte-identical contract body.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- A command whose legacy body is not a clean `## 1..## 6` router would break the "lift verbatim" assumption; Setup verifies each legacy body is a full router before promotion.

### Error Scenarios
- A `fix`-mode command whose recompiled contract is stale makes the renderer refuse in the render smoke; the fix is a recompile, surfaced by `check-contract-drift.cjs`.

### Concurrent Operations
- Render smoke uses `writeManifest:false` so verification never pollutes the committed `manifest.jsonl`.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | Four command promotions + recompile + three standard-doc corrections against a fixed pipeline |
| Risk | 12/25 | Behaviour-preservation of the machine-level Gate-3 path is the sensitive edge; investigation-backed, and the fold is belt-and-suspenders |
| Research | 12/20 | Read the render/compile/drift scripts and the spec-gate hook to prove the bang is not load-bearing for Gate-3 |
| **Total** | **37/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None blocking. PATH A (promote + drop bang + fold hardening) is chosen and recorded in `decision-record.md`; the deliberate reversal of 064's "compiled-stub is a blessed conformant variant" stance for these 4 commands is accepted (ADR-002).

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md` (authored by the orchestrator at completion)
- **Parent Spec**: See `../spec.md`

<!-- /ANCHOR:related-docs -->
