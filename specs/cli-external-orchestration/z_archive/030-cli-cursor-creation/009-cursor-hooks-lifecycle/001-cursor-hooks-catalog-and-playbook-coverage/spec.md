---
title: "Feature Specification: cli-cursor hooks feature-catalog + playbook coverage"
description: "Add a feature-catalog entry and manual-testing-playbook coverage for every cli-cursor hook adapter (session-start.ts, session-end.ts, spec-gate-enforce.mjs, spec-gate-classify.mjs, spec-gate-prebind.mjs), authored via sk-doc's create-feature-catalog and create-manual-testing-playbook contracts, executed by dispatched LUNA (gpt-5.6-luna via cli-codex) xhigh-fast agents."
trigger_phrases: ["cli-cursor hooks feature catalog", "cli-cursor hooks playbook coverage", "cursor hook adapter inventory"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/001-cursor-hooks-catalog-and-playbook-coverage"
    last_updated_at: "2026-07-24T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented via 2 dispatched LUNA agents; both independently verified"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files: [".opencode/skills/cli-external-orchestration/feature-catalog/feature-catalog.md", ".opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/", ".opencode/skills/sk-doc/create-feature-catalog/SKILL.md", ".opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-catalog-implementation", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Execution mechanism: dispatched LUNA agents (gpt-5.6-luna via cli-codex) at xhigh reasoning effort + service_tier=fast, per the user's explicit instruction - not composer-2.5 via cli-cursor (LUNA is a cli-codex model, confirmed via cli-codex/SKILL.md's model table).", "Spec-folder placement: new child under the existing 030-cli-cursor-creation phase-parent, matching phases 006/007/008's precedent.", "spec-gate-prebind.mjs documented now with explicit hedging rather than waiting for review - it remained unchanged and uncommitted throughout this phase.", "Feature-catalog placement: hub-level, extending the existing single catalog with a new category - no sibling packet has a nested one.", "CU-013/CU-014 extension vs new CU-020: new CU-020, documentation-only and SKIP-by-default, to avoid asserting runtime behavior for an unreviewed file."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: cli-cursor hooks feature-catalog + playbook coverage

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../../spec.md` |
| **Parent Packet** | `cli-external-orchestration/030-cli-cursor-creation` |
| **Predecessor** | `../../008-cursor-model-allowlist/spec.md` |
| **Successor** | `../002-cursor-hooks-live-wiring/spec.md` |
| **Handoff Criteria** | Every cli-cursor hook adapter file is named, source-anchored, and delivery-status-labeled in both the hub feature-catalog and the manual-testing-playbook's `hooks/` category; both docs pass their respective sk-doc validators; the whole `030-cli-cursor-creation` packet re-validates `--recursive --strict` 0/0. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cli-external-orchestration/feature-catalog/feature-catalog.md` (the hub-level feature catalog) was never updated for `cli-cursor` at all — it still describes "three packets" (`cli-opencode`, `cli-claude-code`, `cli-codex`) and covers only routing concerns (two-axis dispatch, compiled routing). It has zero mention of Cursor's hook system, which is architecturally unique among the 4 modes (shared with the Cursor editor, not tool-private) and was a major finding of phase 004.

Separately, the manual-testing-playbook's `hooks/` category (`CU-013`/`CU-014`, phase 006) documents the phase-004 event-delivery table (confirmed-fires / confirmed-non-delivery / untested) and names 3 of this repo's own hook adapter files (`session-start.ts`, `session-end.ts`, `spec-gate-enforce.mjs` implicitly via the confirmed-fires events, and `spec-gate-classify.mjs` explicitly for the dormant case) — but a **5th adapter, `runtime/hooks/cursor/spec-gate-prebind.mjs`, now exists on disk and is mentioned nowhere** in either document. It appeared after phase 006 shipped, from a concurrent session, and addresses a real gap phase 004 itself flagged as a known limitation: since `beforeSubmitPrompt` never fires, the Gate-3 enforcement gate can never *open* for a Cursor session, so `spec-gate-enforce.mjs`'s deny path is currently unreachable regardless of `MK_SPEC_GATE_ENFORCE`. `spec-gate-prebind.mjs` opens the gate at `sessionStart` instead.

**This file is uncommitted, unreviewed, and not authored by this packet's own work** — it must not be documented as a confirmed, working feature without review; see Risks.

### Purpose
Add a feature-catalog entry documenting cli-cursor's hook/spec-gate integration system as a first-class feature (mirroring the existing "CLI Executor Two-Axis Dispatch Routing" / "Compiled Routing" category-and-per-feature-file pattern), and extend the manual-testing-playbook's `hooks/` category so every hook adapter file this repo has for `cli-cursor` — confirmed-working, dormant, or newly-added-and-unreviewed — is named, source-anchored, and its delivery/review status stated honestly. Author both via `sk-doc`'s official `create-feature-catalog` and `create-manual-testing-playbook` sub-skill contracts (read in full before authoring), executed by dispatched `gpt-5.6-luna` (via `cli-codex`) agents at `xhigh` reasoning effort with `service_tier="fast"`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Review `spec-gate-prebind.mjs` (read-only) closely enough to describe its current, honest state (built, uncommitted, unreviewed by this packet) — do not review it as if approving or endorsing it for production use; that is out of scope for this phase.
- Add a new category + per-feature file to `cli-external-orchestration/feature-catalog/` documenting cli-cursor's hook/spec-gate system, following `create-feature-catalog`'s exact package contract (root catalog entry, category folder, per-feature file with `## 1 OVERVIEW` / `## 2 HOW IT WORKS` / `## 3 SOURCE FILES` / `## 4 SOURCE METADATA`, implementation + validation anchor tables).
- Extend the manual-testing-playbook's `hooks/` category so `session-start.ts`, `session-end.ts`, `spec-gate-enforce.mjs`, `spec-gate-classify.mjs`, and `spec-gate-prebind.mjs` are each explicitly named with their current confirmed/dormant/unreviewed status — either by extending `CU-013`/`CU-014`'s Source Files tables and prose, or by adding a new `CU-020` scenario scoped to `spec-gate-prebind.mjs` specifically (decide during planning below).
- Cross-reference the new feature-catalog entry from the playbook's `hooks/` category, and the playbook from the catalog, per both packets' cross-reference rules.
- Run both packets' shared validators (`validate_document.py`, `check_no_hyphenated_catalog_content.py`) and this phase's own `validate.sh --strict`.
- Dispatch via LUNA (`gpt-5.6-luna`, `cli-codex`, `xhigh` effort, `service_tier="fast"`) per the user's explicit instruction; read `cli-codex/SKILL.md` in full before composing any dispatch prompt (mandatory per this repo's CLI-dispatch rule).

### Out of Scope
- Reviewing, testing, fixing, or endorsing `spec-gate-prebind.mjs`'s actual behavior — this phase documents its existence and stated purpose honestly, it does not validate or take ownership of it.
- Registering `.cursor/hooks.json` — still explicitly deferred per phase 004's operator decision; unaffected by this phase.
- Any other feature-catalog or playbook category beyond hooks (worktree, MCP, session-continuity, etc.) — those already have adequate coverage from phase 006 and are not the subject of this request.
- Building a NEW hook adapter or fixing the `beforeSubmitPrompt`/`stop` non-delivery gap — that is runtime work, not documentation.
- Retroactively rewriting phase 004/006/007's implementation-summary.md files.

### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `.opencode/skills/cli-external-orchestration/feature-catalog/feature-catalog.md` | Modify | Add a new H2 category section for cli-cursor's hook system, per `create-feature-catalog`'s root-catalog contract. |
| `.opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/*.md` (new category folder) | Create | Per-feature file(s) documenting the 5 hook adapters with source + validation anchors. |
| `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/{confirmed-fires-smoke-test.md,confirmed-non-delivery-documentation.md}` | Modify | Add explicit `spec-gate-prebind.mjs` mentions with honest unreviewed-status labeling. |
| `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/*.md` (possible new `CU-020` file) | Create (conditional) | A dedicated scenario for `spec-gate-prebind.mjs` if the planning phase decides extension of existing files is insufficient. |
| `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/manual-testing-playbook.md` | Modify | Update the hooks category summary + Feature Catalog Cross-Reference Index if a new scenario is added. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | The feature catalog names all 5 cli-cursor hook adapter files with a source anchor and a delivery-status label (confirmed-wired / dormant / unreviewed-new). | P0 |
| REQ-002 | The manual-testing-playbook's `hooks/` category names all 5 adapter files, extending existing scenarios or adding a new one, with `spec-gate-prebind.mjs` explicitly labeled as uncommitted/unreviewed at authoring time, not presented as a confirmed working feature. | P0 |
| REQ-003 | Both documents are authored per their respective `sk-doc` sub-skill contracts (`create-feature-catalog`, `create-manual-testing-playbook`) — read in full before authoring, package shape and per-file section order followed exactly. | P0 |
| REQ-004 | No fabricated claim about `spec-gate-prebind.mjs`'s actual runtime behavior — only what a careful read of the file itself supports, explicitly hedged as unreviewed. | P0 |
| REQ-005 | Execution is dispatched to `gpt-5.6-luna` via `cli-codex` at `xhigh` reasoning effort and `service_tier="fast"`, per the user's explicit instruction, with `cli-codex/SKILL.md` read in full before the dispatch prompt is composed. | P1 |
| REQ-006 | Both docs pass their shared validators (`validate_document.py`, `check_no_hyphenated_catalog_content.py` where applicable), and this phase's spec-folder plus the whole `030-cli-cursor-creation` packet re-validate `--recursive --strict` 0/0. | P0 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: `grep -rn "spec-gate-prebind"` across the feature-catalog and manual-testing-playbook trees returns at least 1 hit in each, with an explicit unreviewed/uncommitted-status label. **MET** — 21 hits, 100% hedged.
- **SC-002**: `grep -c` for each of the other 4 adapter files (`session-start.ts`, `session-end.ts`, `spec-gate-enforce.mjs`, `spec-gate-classify.mjs`) across both docs returns `>=1`. **MET**.
- **SC-003**: `validate_document.py` on the new/modified feature-catalog and playbook files returns 0 structural errors. **MET** — 4/4 files `✅ VALID`.
- **SC-004**: `validate.sh 030-cli-cursor-creation --recursive --strict` returns 0/0 after this phase lands. **MET** — 10/10 folders PASSED.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- **Documenting unreviewed, uncommitted code as a shipped feature.** `spec-gate-prebind.mjs` was authored by a concurrent session, is not committed, and this packet has not reviewed or tested it. Mitigation: REQ-004 mandates explicit "unreviewed/in-progress, authored by a concurrent session" labeling everywhere it's mentioned — never presented as confirmed-working alongside the phase-004 live-verified adapters.
- **The file could be modified, removed, or committed differently before this phase executes** (it's someone else's in-flight work). Mitigation: re-check its existence and content immediately before dispatching the authoring agents, not just at planning time.
- **Feature-catalog placement ambiguity**: no sibling CLI packet has its own nested `feature-catalog/`; the only existing one is hub-level and routing-scoped. Mitigation: flagged as an open question (§12) — the planning-only nature of this spec defers the final placement call to plan.md/tasks.md, informed by a quick check of whether any sibling packet's docs already reference the hub catalog for non-routing features.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- **NFR-C01**: New feature-catalog and playbook content matches the exact structural section order each sk-doc sub-skill requires — no freehand section layout.

## 8. EDGE CASES
- `spec-gate-prebind.mjs` is committed (by its owning session) before this phase's implementation step runs: re-read it fresh at that time rather than relying on this spec's snapshot description.
- `spec-gate-prebind.mjs` is deleted or superseded before this phase's implementation step runs: document only the 4 confirmed adapters and note the 5th was removed before this phase could document it, rather than describing a file that no longer exists.

## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|---|---|---|
| Scope | 10/25 | 1 new feature-catalog category/file + edits to 2-3 existing playbook files; docs-only. |
| Risk | 9/25 | Low blast radius; main risk is documenting another session's unreviewed work inaccurately, mitigated by explicit hedging. |
| Research | 6/20 | Both sk-doc contracts already read in full during this spec's authoring; hook facts already established in phase 004. |
| **Total** | **25/70** | **Level 2** |

## 10. RISK MATRIX
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `spec-gate-prebind.mjs` documented as confirmed-working when unreviewed | Medium | Medium (inaccurate docs) | REQ-004 explicit hedging language |
| Concurrent session changes/removes the file before implementation | Low | Low (re-check before dispatch) | Edge case §8 documents the re-check step |
| sk-doc contract violated (wrong section order, missing anchors) | Low | Medium (fails shared validators) | Both SKILL.md contracts read in full before authoring |

## 11. USER STORIES
- As the operator, I want the feature catalog and playbook to name every hook adapter this repo has for Cursor, so nothing (including brand-new, in-flight work from another session) silently falls off the documented inventory.
- As a maintainer, I want an unreviewed adapter labeled honestly as unreviewed, so the catalog never implies more confidence than the evidence supports.

## 12. OPEN QUESTIONS
Both questions below are now resolved.
- Should this phase wait for `spec-gate-prebind.mjs` to be committed/reviewed before documenting it, or document it now with explicit unreviewed-status hedging? **Resolved: documented now with hedging.** The file remained unchanged and uncommitted throughout this phase; both new docs carry 21 hedged mentions and 0 unhedged confirmed-working claims about it.
- Does the feature-catalog entry belong at the hub level or should `cli-cursor` gain its own nested `feature-catalog/`? **Resolved: hub-level**, extending the existing single catalog with a new "Cursor Hooks And Spec-Gate Integration" category, matching the existing 2 categories' exact shape.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../../008-cursor-model-allowlist/spec.md` (predecessor)
- `../../spec.md` (phase-parent packet)
- `../../004-cursor-hook-adapter-layer/decision-record.md` (source of the confirmed-fires/non-delivery/untested event table this phase cites)
- `../../006-cursor-manual-testing-playbook/implementation-summary.md` (the playbook this phase extends)
- `.opencode/skills/sk-doc/create-feature-catalog/SKILL.md` (authoring contract for the feature-catalog addition)
- `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md` (authoring contract for the playbook extension)
