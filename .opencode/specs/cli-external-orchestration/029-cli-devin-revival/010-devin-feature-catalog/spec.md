---
title: "Feature Specification: Devin feature catalog"
description: "Author a create-feature-catalog package for cli-devin covering every shipped capability, with the hooks category enumerating all 8 lifecycle events and their real dormancy status accurately -- no capability silently omitted, no dormant hook overstated as active."
trigger_phrases: ["devin feature catalog", "cli-devin capability inventory", "devin hooks catalog entry"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/010-devin-feature-catalog"
    last_updated_at: "2026-07-24T18:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase 008 shipped Complete (dormant) - refreshed REQ-004/005/006 + risk table"
    next_safe_action: "Author plan.md, tasks.md, checklist.md, decision-record.md next"
    blockers: ["Depends on phases 003/005/009 landing for non-hooks category content; the hooks category itself is unblocked"]
    key_files: [".opencode/skills/sk-doc/create-feature-catalog/SKILL.md", "../004-devin-hook-adapter-layer/implementation-summary.md", "../008-devin-hook-parity/implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Should the catalog be authored incrementally as each dependency phase (003/005/009) lands, or held until all land? Leaning toward incremental with an explicit per-category completeness note."]
    answered_questions: ["No cli-external-orchestration sibling mode (cli-codex, cli-cursor) has a feature-catalog package today -- this is a new artifact type for the hub, not a precedent replay.", "Phase 008 (the remaining 6 lifecycle events) is Complete (dormant) as of 2026-07-24, not Planned - the hooks category's REQ-004 status enum was updated accordingly."]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Devin feature catalog

---

## EXECUTIVE SUMMARY

Author a `create-feature-catalog` package at `cli-devin/feature-catalog/` inventorying every shipped `cli-devin` capability, with the `hooks` category as the highest-scrutiny section: all 8 Devin lifecycle events must appear, each with its real, currently-confirmed dormancy status (per phase 004's live-verified finding that no hook fires under `devin -p`), never silently omitted and never overstated as active. This phase authors the spec only -- actual catalog content is written later, dispatched to `gpt-5.6-luna` (`xhigh` reasoning, `fast` service tier) via `cli-codex`, per operator direction.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/029-cli-devin-revival` |
| **Predecessor** | `006-devin-manual-testing-playbook` (sequential-numbering neighbor; real dependency is 003/004/005/008/009, see §6) |
| **Successor** | None |
| **Handoff Criteria** | `feature-catalog/feature-catalog.md` exists with a `hooks` category enumerating all 8 lifecycle events; every per-feature file has source anchors and validation anchors; `create-feature-catalog`'s shared validator passes on the root and every per-feature leaf. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No `cli-external-orchestration` sibling mode has a feature-catalog package today -- `cli-codex` and `cli-cursor` both ship only a `manual-testing-playbook/`. `cli-devin` will be the first, at the operator's explicit direction. The immediate risk this phase guards against: once `cli-devin/feature-catalog/` exists, its `hooks` category could easily under-report coverage (omitting the 6 events phase 008 hasn't built yet) or over-report it (describing phase 004's 2 built adapters as "active" when phase 004's own live-verification confirmed they never fire under `devin -p`). Either error would make the catalog actively misleading rather than merely incomplete.

### Purpose
Define the catalog's category taxonomy, the mandatory per-hook-event entries and their required dormancy-status field, and the authoring mechanism (dispatched to `gpt-5.6-luna xhigh fast` via `cli-codex`, following `create-feature-catalog`'s exact package contract), so that when this phase is later implemented, the catalog is complete and honest from the first commit -- not retrofitted after an incomplete first pass.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define the catalog's category taxonomy (7 categories, see §4 REQ-002).
- Define the mandatory `hooks` category content: one per-feature file per Devin lifecycle event (8 total: `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `PermissionRequest`, `Stop`, `PostCompaction`, `SessionEnd`), each stating its real dormancy status as of the last live-verification pass, cross-referencing the exact adapter file and the phase that built it.
- Define the dispatch mechanism for actual catalog authoring: `cli-codex` with `--model gpt-5.6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast"`, following the 3-tier prompt-quality-card rule, with the spec folder pre-approved in the dispatch prompt.
- Define validation requirements: `create-feature-catalog`'s shared validators (`validate_document.py`, `extract_structure.py`, `check_no_hyphenated_catalog_content.py`) run clean on the root and every per-feature leaf.

### Out of Scope
- Actually writing `feature-catalog/feature-catalog.md` or any per-feature file -- that is this phase's own future implementation, dispatched to LUNA agents, not done in this spec-authoring pass.
- Cataloging capabilities that don't exist yet: if phases 003/005/009 haven't landed when this phase is implemented, their categories are authored as "Planned capability, not yet shipped" stubs, never fabricated as if already live (`create-feature-catalog`'s own rule: describe shipped behavior, not roadmap).
- Any change to the `manual-testing-playbook` package -- that is phase 006's own amendment, cross-referenced but not duplicated here (see `../006-devin-manual-testing-playbook/spec.md`).
- Registering this catalog in the hub's `mode-registry.json`/`hub-router.json` -- phase 003's job, not this phase's.

### Files to Change (future implementation, not this spec-authoring pass)
| File Path | Change Type | Description |
|---|---|---|
| `cli-external-orchestration/cli-devin/feature-catalog/feature-catalog.md` | Create | Root catalog, 7 categories. |
| `cli-external-orchestration/cli-devin/feature-catalog/hooks/session-start.md` ... `session-end.md` (8 files) | Create | One per lifecycle event, dormancy status mandatory. |
| `cli-external-orchestration/cli-devin/feature-catalog/{cli-invocation,permission-modes,model-dispatch,subagents,mcp-host-integration,sequential-thinking}/*.md` | Create | Remaining 6 categories' per-feature files. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | The catalog package follows `create-feature-catalog`'s exact contract: root `feature-catalog/feature-catalog.md`, kebab-case category folders with no numeric prefix, one per-feature file per root entry, no `graph-metadata.json` inside the package. | P0 |
| REQ-002 | 7 categories: `hooks`, `cli-invocation`, `permission-modes`, `model-dispatch`, `subagents`, `mcp-host-integration`, `sequential-thinking`. | P0 |
| REQ-003 | The `hooks` category contains exactly 8 per-feature files, one per Devin lifecycle event, no fewer and no more (no event silently merged or split). | P0 |
| REQ-004 | **Updated 2026-07-24 - phase 008 shipped, all 8 events now have adapters or a documented gap.** Every `hooks` per-feature file states its dormancy status as one of: `built, confirmed dormant` (all 8 events - `SessionStart`/`UserPromptSubmit` from phase 004, `PreToolUse`/`PostToolUse`/`Stop`/`PostCompaction`/`SessionEnd` from phase 008), `no adapter - no Claude source handler to port` (`PermissionRequest`, an explicit empty registration, not a dormant adapter), or `status unknown, re-verify live` (only if a future re-test changes the picture) -- never `active`/`working` while the confirmed `-p` dormancy finding stands. | P0 |
| REQ-005 | Each `hooks` per-feature file's Implementation Source table cites the exact adapter file path (e.g. `mcp-server/hooks/devin/session-start.ts`) and the exact phase that built it (004 or 008). | P0 |
| REQ-006 | Each `hooks` per-feature file's Validation And Tests table cites the direct-invocation test evidence (phase 004's or phase 008's `implementation-summary.md` Verification table, as applicable) -- never a fabricated test reference. | P0 |
| REQ-007 | The `model-dispatch` category's single per-feature file documents the 7-model allowlist (phase 005 REQ-011) and the fail-closed enforcement (phase 002 REQ-014/015), cross-referencing both phases by number in prose, not duplicating the model table itself (link to phase 005's spec.md instead). | P1 |
| REQ-008 | Categories for capabilities not yet shipped (`mcp-host-integration` if phase 009 hasn't landed, `model-dispatch` if phase 002 hasn't landed) are authored as explicitly-labeled "Planned capability" stubs per `create-feature-catalog`'s own anti-roadmap rule, never described as current shipped behavior. | P1 |
| REQ-009 | The actual authoring dispatch uses `cli-codex` with `--model gpt-5.6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast"`, the spec folder pre-approved in the dispatch prompt (Gate 3 already resolved for this packet), and the local `cli-codex` prompt-quality-card's 3-tier precedence rule. | P1 |
| REQ-010 | `create-feature-catalog`'s shared validators (`validate_document.py`, `extract_structure.py`, `check_no_hyphenated_catalog_content.py` against the staging root) all pass clean on delivery. | P0 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: `feature-catalog/feature-catalog.md` exists with exactly 7 categories, each root entry linking to exactly one per-feature file.
- **SC-002**: The `hooks` category has exactly 8 per-feature files; every one states a dormancy status from the 3-value set in REQ-004, never `active` while the finding stands.
- **SC-003**: `create-feature-catalog`'s shared validators pass clean on the root and every per-feature leaf.
- **SC-004**: No category describes a not-yet-shipped capability as current behavior (manually spot-checked against each dependency phase's actual `Status` field).
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | Real content depends on phases 003 (skill packet), 005 (model registry), 009 (MCP host) landing - the `hooks` category itself is now fully unblocked (004 + 008 both Complete (dormant) as of 2026-07-24) | Catalog could be authored against non-hooks capabilities that don't exist on disk yet | REQ-008: explicit "Planned capability" stubs for anything not yet shipped, re-authored for real once each dependency lands |
| Risk | The `hooks` category drifts stale the next time phase 004/008's dormancy status is re-verified (e.g. a future `devin` build adds `-p` hook support) | Catalog silently states an outdated dormancy status | REQ-004's status-value set forces an explicit re-verification trigger rather than a vague "check the code" note |
| Risk | LUNA dispatch (future implementation step) invents plausible-sounding hook behavior instead of citing phase 004/008's actual evidence | Catalog states unverified claims as fact | REQ-006 requires citing the exact `implementation-summary.md` evidence table, not free-form description |
| Dependency | Sequential-numbering neighbor is `006`, but the real dependency is 003/004/005/008/009 | A future reader could assume 006 must complete first | Phase Transition Rules note in the parent `spec.md` states this explicitly, mirroring phases 008/009's own precedent |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- **NFR-C01 (Currency)**: every dormancy-status claim in the `hooks` category must trace to a dated live-verification event (phase 004's 2026-07-24 pass, or a later re-verification), never an undated assumption.

## 8. EDGE CASES
- A future `devin` build adds `-p` hook support before this phase is implemented: the `hooks` category must be authored against the CURRENT status at implementation time, re-running phase 004's probe methodology first, not assuming the 2026-07-24 finding is still accurate.
- Phase 008 lands partially (some of its 6 events built, others still Planned) before this phase's implementation: each `hooks` per-feature file's status reflects its OWN event's actual state, not a blanket "phase 008 status" applied to all 6.

## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|---|---|---|
| Scope | 14/25 | 7 categories, ~15-20 per-feature files total, matching `create-feature-catalog`'s own target range. |
| Risk | 12/25 | Primary risk is staleness/overstatement of hook dormancy, mitigated by the 3-value enum and dated citations. |
| Research | 10/20 | Content sources (phases 001-009) are already authored and live-verified; this phase organizes, doesn't re-research. |
| **Total** | **36/70** | **Level 3** (cross-cutting: spans 6 other phases' content, one novel artifact type for the hub) |

## 10. RISK MATRIX
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Hooks category overstates dormant adapters as active | Low (REQ-004 is a hard enum) | High (misleads a future operator into assuming coverage exists) | REQ-004/REQ-006 make overstatement a validation-checkable violation, not a style preference |
| Catalog authored before dependency phases land, describing vaporware | Medium | Medium | REQ-008's explicit stub labeling |

## 11. USER STORIES
- As an operator deciding whether to dispatch `cli-devin` for a task needing guard-hook enforcement, I want the feature catalog to tell me plainly that hooks are dormant today, not imply coverage that doesn't exist.
- As a future implementer of phase 008, I want the catalog's `hooks` category to already have 8 correctly-scoped placeholder entries, so I only need to update dormancy status, not invent category structure.

## 12. OPEN QUESTIONS
- Should this phase's implementation wait for all of 003/005/009 to land, or proceed incrementally with explicit stubs? Leaning toward incremental (see frontmatter `open_questions`), but not decided here -- operator to confirm at implementation time.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` (this phase)
- `.opencode/skills/sk-doc/create-feature-catalog/SKILL.md` (package contract this phase's future implementation must follow)
- `../004-devin-hook-adapter-layer/implementation-summary.md` (source of the confirmed dormancy finding)
- `../008-devin-hook-parity/spec.md` (source of the remaining 6 events' planned adapter paths)
- `../009-devin-mcp-host-integration/spec.md` (sequential-numbering neighbor only, not a dependency - real dependencies are 003/005/009, see §6 and the parent's Phase Transition Rules)
- `../006-devin-manual-testing-playbook/spec.md` (sequential-numbering neighbor; playbook cross-reference, see phase 006's own amendment)
- `../spec.md` (parent packet)
