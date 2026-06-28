---
title: "D4-R9 — Two-axis tool classification + ambiguous-read receipts"
description: "Re-model the Open Design tool surface on two independent axes — feedsDesignDecision x mutatesWorkspace — so guarded = feeds OR mutates, pure transport is NEITHER, the mutatesWorkspace=Y column is the derived guardedTools projection, and ambiguous reads are guarded-by-default and receipt-exemptible."
trigger_phrases:
  - "d4-r9 two-axis classification"
  - "ambiguous read receipts design build"
  - "feedsDesignDecision mutatesWorkspace axes"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/009-two-axis-tool-classification"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2 and record advisory-judgment axis and proxy reconciliation"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/tool_surface.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# D4-R9 — Two-axis tool classification + ambiguous-read receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Enforcement class** | enforceable |
| **Dimension** | D4 — mcp-open-design Pairing |
| **Completed** | 2026-06-28 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The tool surface was classified on ONE axis — read-only / mutating / destructive — and every read-only tool was stamped "surface freely." That mislabels a read whose OUTPUT is the design itself as harmless transport: `get_run` returns the generated design, `get_artifact` returns the artifact, `get_active_context`/`get_project` return design-bearing state. The old single-axis bucket wrongly listed `get_active_context`, `get_artifact`, `get_project`, `get_file`, and `search_files` as freely surfaceable reads, which lets an agent launder design context through a nominally read-only call.

### Purpose
Re-model the surface on TWO independent axes: `feedsDesignDecision` (does the tool's OUTPUT inform a design choice — UI, design system, visual artifact, prototype, motion, or build brief?) and `mutatesWorkspace` (does the call write?). The guarded set becomes `feedsDesignDecision OR mutatesWorkspace`; exempt pure transport is NEITHER. The `mutatesWorkspace = Y` column reproduces the seven-tool guardedTools list exactly, so that list becomes a DERIVED projection of the table rather than a parallel inventory, and the four design-bearing reads are additionally guarded-when-feeding. `feedsDesignDecision` is an advisory per-tool judgment made explicit, not a runtime probe, so every tag carries a one-line rationale. This phase re-models the classification table; it builds no runtime classifier.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The two-axis table in `.opencode/skills/mcp-open-design/references/tool_surface.md` §2, tagging all 18 registered tools on both axes with a derived `guarded` column and a one-line `feedsDesignDecision` rationale per row
- The §3 surface/gate/omit policy restated as a derivation of the table (`guarded = feeds OR mutates`; `exempt = neither`)
- The deny-by-default floor and the ambiguous-read receipt rule for `get_file` and `search_files`
- The statement that the seven-tool guardedTools list is DERIVED from the `mutatesWorkspace = Y` column, and that design-feeding reads are guarded-when-feeding through the proxy's conditional read list

### Out of Scope
- Any runtime classifier, hook, or proxy code
- The receipt VALIDATOR internals — this phase names the receipt requirement, not its schema
- Any edit to `guarded_proxy.md` or any file beyond `tool_surface.md`: the proxy already implements the consumer policy and already names the tool-surface reference as its source, so no proxy edit was required

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-open-design/references/tool_surface.md` | Modify | Add the two-axis classification table tagging all 18 tools on `feedsDesignDecision` × `mutatesWorkspace` with a derived `guarded` column, restate §3 as a derivation, and record deny-by-default plus the ambiguous-read receipt rule — 61 insertions, 9 deletions; the 9 deletions replace the old single-axis "surface freely (read-only)" classification with the precise table (no tool information lost) |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define both axes as independent | `feedsDesignDecision` (output informs a design choice?) and `mutatesWorkspace` (writes?) are stated as two independent axes with a precise question each |
| REQ-002 | Tag every tool on both axes with a derived guarded column | All 18 registered tools carry an explicit `feedsDesignDecision` (Y/N) and `mutatesWorkspace` (Y/N) tag; `guarded` equals `feedsDesignDecision OR mutatesWorkspace` for every row |
| REQ-003 | Record the advisory-judgment nature with per-tool rationale | Every `feedsDesignDecision` tag carries a one-line rationale; the axis is labeled an advisory per-tool judgment made explicit, not a runtime probe |
| REQ-004 | Make guardedTools a derived projection | The `mutatesWorkspace = Y` column equals the seven-tool guardedTools list exactly (`create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run`, `delete_file`, `delete_project`); the doc states the list is DERIVED from this column |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Anchor the key cases | `get_run` is classified GUARDED (read-but-design-feeding); `list_projects` is classified EXEMPT (pure transport) |
| REQ-006 | State deny-by-default and the ambiguous-read receipt rule | A tool not positively classified as pure transport is guarded; `get_file` and `search_files` are guarded by default and exempt only with a non-design-use receipt |
| REQ-007 | Keep the body evergreen | No spec, packet, or phase IDs and no `specs/` paths in the `tool_surface.md` body |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `tool_surface.md` carries a two-axis table where all 18 tools are tagged `feedsDesignDecision` (Y/N) and `mutatesWorkspace` (Y/N), each with a derived `guarded` column and a one-line rationale; `guarded = feedsDesignDecision OR mutatesWorkspace` holds for every row, yielding 13 guarded and 5 exempt.
- **SC-002**: `get_run` is `feeds=Y, mutates=N, guarded=Y`; `list_projects` is `feeds=N, mutates=N, guarded=N`; the `mutatesWorkspace = Y` set equals the seven-tool guardedTools list exactly.
- **SC-003**: Deny-by-default and the ambiguous-read receipt rule are documented, the `feedsDesignDecision` axis is labeled advisory, the body carries no spec/packet/phase IDs or `specs/` paths, and only `tool_surface.md` was edited.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `feedsDesignDecision` is advisory, not a runtime probe | A runtime that ignores the table is not mechanically stopped by it | The axis is judgment-made-explicit per tool, each tag carrying a one-line rationale; the enforceable consumer (`guarded_proxy.md`) keys on `feedsDesignDecision` and `mutationClass` and is unchanged |
| Risk | `list_projects` vs `get_file`/`search_files` split | The originating research grouped all three as one flat "ambiguous_read" bucket; the two-axis model splits them | Documented judgment: `list_projects` returns identifiers only (`feeds=N`, exempt), while `get_file`/`search_files` can carry design substance (`feeds=Y ambiguous`, default-guarded, receipt-exemptible) |
| Risk | Ambiguous reads kept guarded by default | A legitimate non-design file read incurs the design precondition unless a receipt is supplied | The receipt path is the explicit, auditable exemption: a non-design-use receipt asserting the output will not feed a design decision restores pure-transport handling |
| Risk | `guarded_proxy.md` named as a secondary target but not edited | The plan named the proxy as a reconciliation target | The proxy already implements the consumer policy (`read && feedsDesignDecision => Guarded`; `exemptTransport` positive allowlist gated on `feedsDesignDecision = false`) and already names the tool-surface reference as its source; reconciliation achieved by making the table the named source — zero proxy edit, no parallel drift |
| Dependency | Live tool-surface registry (the 18-tool enumeration + mutating/destructive hints) | Green | The table loses its source-of-truth tool set |
| Dependency | `guarded_proxy.md` consumer policy | Green | Loses the runtime consumer the table feeds |
| Dependency | Receipt validator internals | Not built here | This phase names the receipt requirement; the validator schema is out of scope |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: The read-then-launder path is closed by classification — the four design-bearing reads (`get_active_context`, `get_project`, `get_artifact`, `get_run`) are guarded, not "always safe."
- **NFR-S02**: No tool is silently widened to exempt — only `feeds=N AND mutates=N` rows are exempt; a new or axis-indeterminate tool is guarded by default.

### Defense-in-Depth
- **NFR-DD01**: The table is the single source; the seven-tool guardedTools projection and the `guarded_proxy.md` `exemptTransport` allowlist are projections of it, not parallel inventories. Ambiguous reads add a receipt gate on top of the deny-by-default floor.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Classification cases
- **Read-but-design-feeding**: `get_run` returns the generated design → `feeds=Y, mutates=N, guarded=Y`.
- **Pure transport**: `list_projects` returns identifiers only → `feeds=N, mutates=N, guarded=N` (EXEMPT).
- **Ambiguous read**: `get_file`/`search_files` can return design files (tokens, components) or config → `feeds=Y (ambiguous)`, guarded by default, exempt only with a non-design-use receipt.
- **Unclassified tool**: a new tool that cannot be positively placed as pure transport → guarded by the deny-by-default floor until tagged on both axes.

### Axis-interaction cases
- **Mutating but not design-feeding**: `create_project`, `cancel_run`, `delete_file`, `delete_project` are `feeds=N, mutates=Y` → guarded on the mutation axis alone.
- **Both axes**: `create_artifact`, `write_file`, `start_run` are `feeds=Y, mutates=Y` → guarded on both axes.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One classification table in one existing reference restructures the read/mutating/destructive split into two independent axes; no source or runtime change.
- **Risk concentration**: The single judgment-bearing axis is `feedsDesignDecision`; each tag carries a one-line rationale and the enforceable consumer (`guarded_proxy.md`) is unchanged, so the blast radius is documentation only.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `list_projects` be guarded with the other "ambiguous_read" tools? **RESOLVED: No. On the `feedsDesignDecision` axis, `list_projects` returns only identifiers (`feeds=N`, exempt), whereas `get_file`/`search_files` return content that may be design substance (`feeds=Y ambiguous`, default-guarded, receipt-exemptible). The refined split — `list_projects` promoted to clean transport — is a deliberate, documented judgment that diverges from the research's flat trio.**
- Does the table need a `guarded_proxy.md` edit to reconcile? **RESOLVED: No. The proxy already implements the consumer policy (`read && feedsDesignDecision => Guarded`; `exemptTransport` positive allowlist gated on `feedsDesignDecision = false`) and already states its policy is derived from the tool-surface reference. The reconciliation is achieved by naming the two-axis table the source and confirming the proxy reads as a projection — zero proxy edit, no parallel drift. Scope stayed `tool_surface.md` only, matching the verified change set.**
- Is `feedsDesignDecision` a runtime probe? **RESOLVED: No. It is an advisory per-tool judgment made explicit, with a one-line rationale per row. The table is the source the proxy's runtime decision consumes; taste is not certified.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification focus
- Two-axis tool classification: guarded = feedsDesignDecision OR mutatesWorkspace; exempt = neither; 13 guarded / 5 exempt / 18 total
- Advisory-judgment axis, list_projects-vs-get_file split, and the receipt-exemptible ambiguous reads recorded in RISKS/OPEN QUESTIONS
- Scope = tool_surface.md only; guarded_proxy.md already reads as the consumer (zero proxy edit); GENERATED_METADATA regenerated by the orchestrator
-->
