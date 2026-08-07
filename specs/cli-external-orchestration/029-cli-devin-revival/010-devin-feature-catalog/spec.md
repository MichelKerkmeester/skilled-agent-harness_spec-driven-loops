---
title: "Feature Specification: Devin feature catalog"
description: "Author a create-feature-catalog package for cli-devin covering every shipped capability, with the hooks category enumerating all 8 lifecycle events and their verified observed, unobserved or empty status."
trigger_phrases: ["devin feature catalog", "cli-devin capability inventory", "devin hooks catalog entry"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/010-devin-feature-catalog"
    last_updated_at: "2026-07-24T18:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase 011 replaced the dormant enum with event-specific evidence states"
    next_safe_action: "Author plan.md, tasks.md, checklist.md, decision-record.md next"
    blockers: ["Depends on phases 003/005/009 landing for non-hooks category content; the hooks category itself is unblocked"]
    key_files: [".opencode/skills/sk-doc/create-feature-catalog/SKILL.md", "../004-devin-hook-adapter-layer/implementation-summary.md", "../008-devin-hook-parity/implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Should the catalog be authored incrementally as each dependency phase (003/005/009) lands, or held until all land? Leaning toward incremental with an explicit per-category completeness note."]
    answered_questions: ["No cli-external-orchestration sibling mode has a feature-catalog package today.", "Phase 008 is Complete and the hooks category uses event-specific evidence states from phase 011."]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Devin feature catalog

---

## EXECUTIVE SUMMARY

Author a `create-feature-catalog` package at `cli-devin/feature-catalog/` inventorying every shipped capability. The `hooks` category is the highest-scrutiny section: all 8 lifecycle events appear with an event-specific state of observed live, registered but unobserved or explicit empty gap. This phase authors the spec only; actual catalog content is written later through the approved executor workflow.

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
| **Successor** | `011-hook-truth-and-runtime-readmes` (sequential-numbering neighbor only; phase 011 is independently complete) |
| **Handoff Criteria** | `feature-catalog/feature-catalog.md` exists with a `hooks` category enumerating all 8 lifecycle events; every per-feature file has source anchors and validation anchors; `create-feature-catalog`'s shared validator passes on the root and every per-feature leaf. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No sibling mode has a feature-catalog package today. The immediate risk is inaccurate flattening: a catalog could omit registered events, claim unobserved events fired or retain the superseded packet-wide dormancy conclusion after six events were observed under the corrected schema.

### Purpose
Define the catalog taxonomy, mandatory per-hook-event evidence-state field and approved authoring mechanism so the eventual package is complete and evidence-ranked from its first commit.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define the catalog's category taxonomy (7 categories, see §4 REQ-002).
- Define one `hooks` per-feature file per lifecycle event, each stating its current evidence state and linking the exact adapter file and source phase.
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
| `cli-external-orchestration/cli-devin/feature-catalog/hooks/session-start.md` ... `session-end.md` (8 files) | Create | One per lifecycle event, evidence state mandatory. |
| `cli-external-orchestration/cli-devin/feature-catalog/{cli-invocation,permission-modes,model-dispatch,subagents,mcp-host-integration,sequential-thinking}/*.md` | Create | Remaining 6 categories' per-feature files. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | The catalog package follows `create-feature-catalog`'s exact contract: root `feature-catalog/feature-catalog.md`, kebab-case category folders with no numeric prefix, one per-feature file per root entry, no `graph-metadata.json` inside the package. | P0 |
| REQ-002 | 7 categories: `hooks`, `cli-invocation`, `permission-modes`, `model-dispatch`, `subagents`, `mcp-host-integration`, `sequential-thinking`. | P0 |
| REQ-003 | The `hooks` category contains exactly 8 per-feature files, one per Devin lifecycle event, no fewer and no more (no event silently merged or split). | P0 |
| REQ-004 | **Updated 2026-07-25**: each hook file uses one evidence state: `observed live` (`SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, `SessionEnd`), `registered, unobserved` (`PostCompaction`) or `no adapter, explicit empty registration` (`PermissionRequest`). Adapter-specific caveats such as unobserved `run_subagent` and deny behavior remain explicit. | P0 |
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
- **SC-002**: The `hooks` category has exactly 8 per-feature files and every one uses the evidence-state set in REQ-004.
- **SC-003**: `create-feature-catalog`'s shared validators pass clean on the root and every per-feature leaf.
- **SC-004**: No category describes a not-yet-shipped capability as current behavior (manually spot-checked against each dependency phase's actual `Status` field).
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | Real content depends on phases 003, 005 and 009; hook content depends on phases 004/008 plus phase 011's corrected matrix | Catalog could be authored against missing capabilities or stale hook evidence | REQ-008 uses explicit planned stubs; REQ-004 requires current event-specific evidence. |
| Risk | The hook matrix drifts after a future Devin release or new event test | Catalog silently states outdated evidence | Re-run the bounded live matrix and update only the affected event states. |
| Risk | LUNA dispatch (future implementation step) invents plausible-sounding hook behavior instead of citing phase 004/008's actual evidence | Catalog states unverified claims as fact | REQ-006 requires citing the exact `implementation-summary.md` evidence table, not free-form description |
| Dependency | Sequential-numbering neighbor is `006`, but the real dependency is 003/004/005/008/009 | A future reader could assume 006 must complete first | Phase Transition Rules note in the parent `spec.md` states this explicitly, mirroring phases 008/009's own precedent |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- **NFR-C01 (Currency)**: every hook evidence-state claim traces to dated live verification or an explicit statement that the event did not occur.

## 8. EDGE CASES
- A future Devin build changes hook behavior before implementation: rerun the corrected-schema matrix and author against current event-specific results.
- Phase 008 lands partially (some of its 6 events built, others still Planned) before this phase's implementation: each `hooks` per-feature file's status reflects its OWN event's actual state, not a blanket "phase 008 status" applied to all 6.

## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|---|---|---|
| Scope | 14/25 | 7 categories, ~15-20 per-feature files total, matching `create-feature-catalog`'s own target range. |
| Risk | 12/25 | Primary risk is staleness or overstatement of event evidence, mitigated by the 3-value state set and dated citations. |
| Research | 10/20 | Content sources (phases 001-009) are already authored and live-verified; this phase organizes, doesn't re-research. |
| **Total** | **36/70** | **Level 3** (cross-cutting: spans 6 other phases' content, one novel artifact type for the hub) |

## 10. RISK MATRIX
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Hooks category overstates an unobserved event as live | Low (REQ-004 is a hard state set) | High | REQ-004/REQ-006 require event-specific evidence and citations. |
| Catalog authored before dependency phases land, describing vaporware | Medium | Medium | REQ-008's explicit stub labeling |

## 11. USER STORIES
- As an operator, I want the catalog to distinguish events observed live from events that remain unobserved.
- As a future maintainer, I want 8 stable hook entries so new evidence updates status rather than category structure.

## 12. OPEN QUESTIONS
- Should this phase's implementation wait for all of 003/005/009 to land, or proceed incrementally with explicit stubs? Leaning toward incremental (see frontmatter `open_questions`), but not decided here -- operator to confirm at implementation time.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` (this phase)
- `.opencode/skills/sk-doc/create-feature-catalog/SKILL.md` (package contract this phase's future implementation must follow)
- `../004-devin-hook-adapter-layer/implementation-summary.md` (first two adapters and corrected live status)
- `../008-devin-hook-parity/spec.md` (source of the remaining 6 events' planned adapter paths)
- `../009-devin-mcp-host-integration/spec.md` (sequential-numbering neighbor only, not a dependency - real dependencies are 003/005/009, see §6 and the parent's Phase Transition Rules)
- `../006-devin-manual-testing-playbook/spec.md` (sequential-numbering neighbor; playbook cross-reference, see phase 006's own amendment)
- `../spec.md` (parent packet)
