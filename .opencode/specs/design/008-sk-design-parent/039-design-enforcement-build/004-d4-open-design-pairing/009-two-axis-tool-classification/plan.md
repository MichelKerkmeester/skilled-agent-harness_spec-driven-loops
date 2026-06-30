---
title: "Implementation Plan: Two-axis Open Design tool classification + ambiguous-read receipts"
description: "Plan to re-model the Open Design tool surface on two independent axes — feedsDesignDecision x mutatesWorkspace — so the guarded set is feedsDesignDecision OR mutatesWorkspace and pure transport is NEITHER, reconciled with deny-by-default and the derived guardedTools list."
trigger_phrases:
  - "two-axis tool classification plan"
  - "feedsDesignDecision mutatesWorkspace axes"
  - "open design ambiguous read receipts"
  - "tool surface two axis guarded set"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/009-two-axis-tool-classification"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all plan gates and phases complete with delivery evidence"
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
# Implementation Plan: Two-axis Open Design tool classification + ambiguous-read receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Target file (primary)** | `.opencode/skills/mcp-open-design/references/tool_surface.md` (the single-axis classification) |
| **Target file (secondary)** | `.opencode/skills/mcp-open-design/references/guarded_proxy.md` (the policy block that derives the guarded/exempt sets) |
| **Doc type** | Skill reference — tool-surface classification + guarded-proxy policy |
| **Change shape** | Re-model the read/mutating/destructive split into two independent axes and make the guarded set a derived union |
| **Status** | Planned — authored when an implementer runs this brief; not yet implemented |

### Overview
Today the tool surface is classified on ONE axis (read-only / mutating / destructive), and every read-only tool is stamped "always safe to surface." That mislabels a read whose OUTPUT is the design itself — `get_run` returns the generated design, `get_artifact` returns the artifact — as harmless transport, which lets an agent launder design context through a nominally read-only call. This plan re-models the surface on TWO independent axes: `feedsDesignDecision` (does the tool's OUTPUT inform a design choice?) and `mutatesWorkspace` (does the tool write?). The guarded set becomes `feedsDesignDecision OR mutatesWorkspace`; the exempt pure-transport set is `NEITHER`. The `mutatesWorkspace = Y` column reproduces the existing guardedTools list exactly, so that list becomes a DERIVED projection of this table rather than an independently maintained inventory; the `feedsDesignDecision = Y` column extends guarding to design-bearing reads. Ambiguous reads (`get_file`, `search_files`) default to guarded and become exempt only when accompanied by a non-design-use receipt, honoring deny-by-default. The `feedsDesignDecision` axis is an advisory per-tool JUDGMENT made explicit, not a runtime probe, so every tag carries a one-line rationale. This phase re-models the classification; it does not build a runtime classifier.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Both axes defined with a precise question each (output-informs-design vs writes-workspace)
- [x] Guarded rule fixed as the union `feedsDesignDecision OR mutatesWorkspace`; exempt set fixed as the complement (NEITHER)
- [x] Every Open Design tool enumerated from the live tool-surface reference and tagged on both axes (see ARCHITECTURE table)
- [x] Reconciliation targets named: deny-by-default floor, the derived guardedTools projection, and the ambiguous-read receipt mechanism
- [x] Evergreen constraint understood (skill content carries no spec/packet/phase IDs)

### Definition of Done
- [x] `tool_surface.md` carries a two-axis table where every tool has an explicit `feedsDesignDecision` (Y/N) and `mutatesWorkspace` (Y/N) tag plus a one-line rationale for the `feedsDesignDecision` call — all 18 rows tagged with per-row rationale
- [x] The derived `guarded` column equals `feedsDesignDecision OR mutatesWorkspace` for every row — row-by-row boolean check holds
- [x] A read-only-but-design-feeding tool (e.g. `get_run` returning the design) is classified GUARDED — `get_run` is `feeds=Y, mutates=N, guarded=Y`
- [x] A pure-transport tool (e.g. `list_projects`) is classified EXEMPT — `list_projects` is `feeds=N, mutates=N, guarded=N`
- [x] The `mutatesWorkspace = Y` set reproduces the seven-tool guardedTools list exactly, and the doc states the list is DERIVED from this column — the column equals `create_artifact`/`write_file`/`create_project`/`start_run`/`cancel_run`/`delete_file`/`delete_project`
- [x] Deny-by-default is stated: an unclassified or axis-indeterminate tool is treated as guarded — `tool_surface.md` §2 deny-by-default sentence
- [x] Ambiguous reads (`get_file`, `search_files`) are guarded by default and exempt only with a non-design-use receipt — both tagged `feeds=Y (ambiguous), guarded=Y, receipt-exemptible`
- [x] `guarded_proxy.md` policy lists are reconciled so the guarded/exempt sets read AS DERIVED from the two-axis table (no independent drift) — proxy already guards `read && feedsDesignDecision`, `exemptTransport` gated on `feedsDesignDecision=false`, and states the policy is derived from the tool-surface reference; reconciled by confirmation, zero proxy edit
- [x] Doc bodies carry no spec/packet/phase IDs or spec paths (durable WHY only) — evergreen scan over `tool_surface.md` body clean
- [x] `checklist.md` items verified with evidence — all P0/P1 items `[x]` with evidence

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two independent boolean axes per tool, with the guarded decision as a pure function of the two axes. The classification table is the SINGLE SOURCE; the guardedTools list and the proxy policy's guarded/exempt arrays are projections of it, not parallel inventories.

### The two axes
- **`feedsDesignDecision`** — Does the tool's OUTPUT (its returned content) inform a design choice — a UI, design system, visual artifact, prototype, motion, or build brief? This is an advisory per-tool JUDGMENT made explicit; it is NOT a runtime probe of a specific call. Each tag carries a one-line rationale so the judgment is auditable.
- **`mutatesWorkspace`** — Does the tool write or change project/run/file state? This is mechanical: it follows the registry mutating/destructive hints.

### Decision rule
- `guarded = feedsDesignDecision OR mutatesWorkspace`
- `exempt (pure transport) = NOT feedsDesignDecision AND NOT mutatesWorkspace`
- Deny-by-default floor: a tool that cannot be positively placed as pure transport (new tool, indeterminate axis) is treated as guarded.

### Derived two-axis table (the implementer authors this into `tool_surface.md`)

| Tool | feedsDesignDecision | mutatesWorkspace | guarded | feedsDesignDecision rationale |
|------|:---:|:---:|:---:|---|
| `list_projects` | N | N | N (EXEMPT) | Returns only project identifiers/names — bare inventory, no design substance |
| `list_files` | N | N | N (EXEMPT) | Returns filenames in a project — inventory of names, not contents |
| `list_skills` | N | N | N (EXEMPT) | Capability listing; names available skills, delivers no design content |
| `list_plugins` | N | N | N (EXEMPT) | Capability listing; names plugins, delivers no design content |
| `list_agents` | N | N | N (EXEMPT) | Capability listing; names inner agents, delivers no design content |
| `get_active_context` | Y | N | Y | Returns the active project/context the design work is grounded in — surfaces live design state |
| `get_project` | Y | N | Y | Returns one project's design-bearing state (entryFile, previewUrl, design linkage), not just a name |
| `get_artifact` | Y | N | Y | Returns a design artifact — the output IS design content |
| `get_run` | Y | N | Y | Returns the run result — the generated design itself; the canonical read-but-design-feeding case |
| `get_file` | Y (ambiguous) | N | Y (receipt-exemptible) | May return a design file (tokens, components) or config; deny-by-default keeps it guarded absent a non-design-use receipt |
| `search_files` | Y (ambiguous) | N | Y (receipt-exemptible) | Literal substring match can surface design-file content; guarded by default, exempt only with a non-design-use receipt |
| `create_artifact` | Y | Y | Y | Writes a design file into a project |
| `write_file` | Y | Y | Y | Overwrites/writes file content, including design content |
| `create_project` | N | Y | Y | Creates a new project handle; guarded on the mutation axis |
| `start_run` | Y | Y | Y | Fires the build that writes the design; guarded on both axes |
| `cancel_run` | N | Y | Y | Control mutation (aborts a run); guarded on the mutation axis |
| `delete_file` | N | Y | Y | Destructive mutation; guarded on the mutation axis |
| `delete_project` | N | Y | Y | Destructive mutation; guarded on the mutation axis |

### Resulting sets
- **Guarded (13):** the seven mutating/destructive tools, plus the four intrinsic design-reads (`get_active_context`, `get_project`, `get_artifact`, `get_run`), plus the two ambiguous reads (`get_file`, `search_files`) that are guarded by default and receipt-exemptible.
- **Exempt pure transport (5):** `list_projects`, `list_files`, `list_skills`, `list_plugins`, `list_agents`.

### Reconciliation contracts
1. **Derived guardedTools (the source relationship).** The seven-tool guardedTools list — `create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run`, `delete_file`, `delete_project` — equals the `mutatesWorkspace = Y` column EXACTLY. The doc must state that the guardedTools list is DERIVED from this column (the table is the source), and that the `feedsDesignDecision = Y` reads are additionally guarded-when-feeding through the proxy's conditional read list rather than the static guardedTools array.
2. **Deny-by-default.** The two-axis table refines the coarse "ambiguous_read = always safe" bucket: any tool not positively classified as pure transport (`feeds=N AND mutates=N`) is guarded. A newly added tool, route, or verb starts guarded until it is classified on both axes.
3. **Ambiguous-read receipts.** `get_file` and `search_files` are tagged `feeds=Y (ambiguous)`: guarded by default, exempt only when the caller supplies a non-design-use receipt asserting the output will not feed a design decision. This is the mechanism that keeps a nominally read-only call from laundering design context.

### Honest divergence to record
The originating research grouped `list_projects` with `get_file`/`search_files` as one flat "ambiguous_read" bucket. The two-axis model is finer-grained: on the `feedsDesignDecision` axis, `list_projects` returns only identifiers (feeds=N, exempt), whereas `get_file`/`search_files` return content that may be design substance (feeds=Y ambiguous, default-guarded). The plan adopts the refined split (list_projects = clean transport) and records this as a deliberate, documented judgment.

### Scope boundary
- **In scope:** the two-axis table in `tool_surface.md` (§2 read/mutating/destructive split gains both axis tags; §3 surface/gate policy is restated as a derivation of the table), and the `guarded_proxy.md` policy block reconciled so its guarded/exempt arrays read as projections of the table.
- **Out of scope:** any runtime classifier, hook, or proxy code; the receipt VALIDATOR internals (this phase specifies the receipt requirement, not its schema); any file outside the two named references.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-read the live tool-surface reference and enumerate every registered tool with its mutating/destructive hint — 18 tools enumerated (11 read-only, 5 mutating, 2 destructive)
- [x] Confirm the seven-tool guardedTools list and the exempt-transport arrays in the proxy policy block — confirmed; proxy `exemptTransport` is a positive allowlist gated on `feedsDesignDecision=false`

### Phase 2: Core Implementation
- [x] Author the two-axis table into `tool_surface.md`: every tool tagged `feedsDesignDecision` (Y/N + one-line rationale) and `mutatesWorkspace` (Y/N), with a derived `guarded` column — table authored, all 18 rows
- [x] Restate the surface/gate/omit policy so it reads as a derivation of the table (guarded = feeds OR mutates; exempt = neither) — §3 restated as a derivation of the table
- [x] Record the deny-by-default floor and the ambiguous-read receipt rule for `get_file`/`search_files` — both recorded in §2
- [x] State that the guardedTools list is DERIVED from the `mutatesWorkspace = Y` column and that design-feeding reads are guarded-when-feeding — stated above the table
- [x] Reconcile `guarded_proxy.md` policy arrays so they read as projections of the table (no parallel inventory) — confirmed; the proxy already guards `read && feedsDesignDecision` and states its policy is derived from the tool-surface reference; reconciled by confirmation, zero proxy edit
- [x] Record the honest list_projects divergence note — recorded: `list_projects` promoted to clean transport, `get_file`/`search_files` kept guarded-by-default

### Phase 3: Verification
- [x] Walk every row: `guarded` equals `feeds OR mutates`; `get_run` GUARDED, `list_projects` EXEMPT — verified independently by the orchestrator
- [x] Confirm the `mutatesWorkspace = Y` set equals the seven-tool guardedTools list — set-equality holds exactly
- [x] Confirm an unclassified tool resolves to guarded under the stated deny-by-default rule — deny-by-default sentence covers the indeterminate case
- [x] Grep both reference bodies for spec/packet/phase IDs and `specs/` paths; confirm none remain — evergreen scan clean
- [x] Update `implementation-summary.md` and mark `checklist.md` with evidence — both authored and marked

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Axis completeness | Every tool carries both a `feedsDesignDecision` and a `mutatesWorkspace` tag | Manual table walk against the live tool-surface reference (~18 tools) |
| Decision-rule consistency | `guarded` column equals `feedsDesignDecision OR mutatesWorkspace` for every row | Row-by-row boolean check |
| Anchor cases | `get_run` is GUARDED; `list_projects` is EXEMPT | Inspect those two rows directly |
| Derived-list parity | `mutatesWorkspace = Y` set equals the seven-tool guardedTools list | Set-equality check against the guardedTools enumeration |
| Deny-by-default | A hypothetical unclassified tool resolves to guarded | Trace the rule for `feeds=N? mutates=N?` indeterminate input |
| Receipt gating | `get_file`/`search_files` guarded by default, exempt only with a non-design-use receipt | Read the ambiguous-read rows and the receipt rule |
| Evergreen | No spec/packet/phase IDs or spec paths in either doc body | `rg` over the two reference bodies for ID and `specs/` patterns |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Live tool-surface reference (the ~18-tool enumeration + registry hints) | Internal | Green | Table loses its source-of-truth tool set |
| Guarded-proxy policy block (guarded/exempt arrays) | Internal | Green | Reconciliation target missing; guardedTools cannot be shown as derived |
| Derived guardedTools list (the seven mutating/destructive tools) | Reference | Green | Parity check loses its anchor |
| Deny-by-default exemption model | Reference | Green | Receipt/unclassified handling loses its rule |
| Receipt validator internals | Downstream | Not built here | This phase names the receipt requirement; the validator is out of scope |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The two-axis split conflicts with the proxy policy, the guardedTools parity breaks, or an axis judgment is challenged.
- **Procedure**: `git revert` the authoring commit. Both targets are documentation references; reverting restores the single-axis classification with no runtime blast radius (no classifier consumes the table yet).

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Enumerate) ──> Phase 2 (Author table + reconcile) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Enumerate | None | Author |
| Author | Enumerate | Verify |
| Verify | Author | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Enumerate (tool set + guardedTools confirm) | Low | 20 minutes |
| Author (two-axis table + policy reconciliation) | Medium | 1.5-2.5 hours |
| Verify (row walk + parity + evergreen scan) | Low | 30 minutes |
| **Total** | | **2.3-3.3 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Both target paths confirmed inside `mcp-open-design/references/` (no live classifier touched) — only `tool_surface.md` edited; `guarded_proxy.md` left unchanged
- [x] No edits to any hook, proxy, or CLI code file — none touched
- [x] Authoring commit isolated to `tool_surface.md` — working-tree diff is +61/-9 on `tool_surface.md` alone; `guarded_proxy.md` reconciled by confirmation, no edit

### Rollback Procedure
1. **Immediate**: `git revert HEAD` for the authoring commit
2. **Verify**: Confirm the single-axis classification and the prior policy arrays are restored
3. **Confirm**: No consumer reads the two-axis table at runtime yet (this phase ships none)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — documentation-only change, no schema or data state created

<!-- /ANCHOR:enhanced-rollback -->

---
