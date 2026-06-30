---
title: "Implementation Summary: Two-axis Open Design tool classification"
description: "Post-build record for the two-axis classification table added to mcp-open-design/references/tool_surface.md: feedsDesignDecision x mutatesWorkspace tags on all 18 tools, guarded = feeds OR mutates, the 13/5/18 split, get_run-guarded / list_projects-exempt, the D4-R4 mutatesWorkspace-column reconciliation, the old single-axis correction (9 deletions), the advisory-judgment framing, and the tool_surface-only scope."
trigger_phrases:
  - "two-axis tool classification implementation summary"
  - "feedsDesignDecision mutatesWorkspace record"
  - "guarded set union 13 5 18 summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/009-two-axis-tool-classification"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the two-axis table, the 13/5/18 split, and the tool_surface-only scope"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-two-axis-tool-classification |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverable** | `.opencode/skills/mcp-open-design/references/tool_surface.md` (two-axis classification table, 61 insertions, 9 deletions) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

A single safe/unsafe read axis used to stamp every read-only Open Design tool "surface freely," which let an agent launder design context through a nominally read-only call: `get_run` returns the generated design, `get_artifact` returns the artifact, yet both were classed as harmless transport. This phase re-models the surface on two independent axes so a tool that does not write can still be guarded when its OUTPUT feeds a design decision. A design-bearing read is now guarded by classification, not waved through as "always safe."

This is a documentation re-model, not code. It restructures one classification table in one existing reference and authors no runtime classifier. The change touches only `tool_surface.md`.

### The two-axis table and the guarded rule

The table tags every registered tool on two axes: `feedsDesignDecision` (does the tool's OUTPUT inform a design choice — UI, design system, visual artifact, prototype, motion, or build brief?) and `mutatesWorkspace` (does the call write project, run, file, or artifact state?). The guarded decision is a pure function of the two: **`guarded = feedsDesignDecision OR mutatesWorkspace`**, and pure transport is the complement — **`exempt = neither axis`**. A new, unclassified, or axis-indeterminate tool is guarded by default until both axes are tagged.

### The 13 / 5 / 18 split

All 18 registered tools are classified. The result is 13 guarded and 5 exempt:

- **Exempt pure transport (5):** `list_projects`, `list_files`, `list_skills`, `list_plugins`, `list_agents` — each `feeds=N, mutates=N`, bare inventory or capability listings that deliver no design content.
- **Design-feeding reads, guarded (4):** `get_active_context`, `get_project`, `get_artifact`, `get_run` — each `feeds=Y, mutates=N`; their output IS design-bearing state.
- **Ambiguous reads, guarded and receipt-exemptible (2):** `get_file`, `search_files` — each `feeds=Y (ambiguous), mutates=N`; guarded by default, exempt only with a non-design-use receipt.
- **Mutating/destructive, guarded (7):** `create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run`, `delete_file`, `delete_project` — the `mutatesWorkspace = Y` column.

### The key anchor cases

`get_run` is the canonical read-but-design-feeding tool: `feeds=Y, mutates=N, guarded=Y`. It returns the run result — the generated design itself — so it is guarded even though the registry marks it read-only. `list_projects` is the canonical pure-transport tool: `feeds=N, mutates=N, guarded=N` (EXEMPT). It returns only project identifiers, so it surfaces freely.

### The D4-R4 mutatesWorkspace-column reconciliation

The `mutatesWorkspace = Y` column equals the seven-tool guardedTools projection EXACTLY: `create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run`, `delete_file`, `delete_project`. The doc states the table is the source and the configured guardedTools list is a projection of the write axis. The four design-feeding reads are additionally guarded-when-feeding through the proxy's conditional read list rather than the static guardedTools array. This makes the guardedTools list a derived view of one column, not a separately maintained inventory.

### The old single-axis correction (the 9 deletions)

The 9 deletions are the correction at the heart of this phase. The old single-axis "Surface freely (read-only)" classification wrongly listed `get_active_context`, `get_artifact`, `get_project`, `get_file`, and `search_files` as freely surfaceable reads. The two-axis model replaces that bucket: design-feeding reads are now GUARDED, and the ambiguous reads are guarded-by-default and receipt-exemptible. No tool information was lost — the surface was restructured into the more precise table.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-open-design/references/tool_surface.md` | Modified | Add the two-axis classification table tagging all 18 tools on `feedsDesignDecision` × `mutatesWorkspace` with a derived `guarded` column and a one-line rationale per `feedsDesignDecision` tag; restate §3 as a derivation of the table; record deny-by-default and the ambiguous-read receipt rule — 61 insertions, 9 deletions; the 9 deletions replace the old single-axis read-only bucket |

No live skill, gate, hook, or CLI file was edited beyond `tool_surface.md`. `guarded_proxy.md` was named as a secondary reconciliation target in the plan but needed no edit: it already implements the consumer policy and already states its policy is derived from the tool-surface reference.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (`cli-codex gpt-5.5 high fast`) edited only `tool_surface.md` — 61 insertions, 9 deletions — adding the two-axis table and restating the surface/gate/omit policy as a derivation of it. The orchestrator then verified the result independently against the actual file: `get_run` is GUARDED (a read-only-but-design-feeding tool), `list_projects` is EXEMPT (pure transport), the `mutatesWorkspace = Y` column equals the D4-R4 guardedTools seven exactly, the guarded/exempt split is 13/5/18, the evergreen scan is clean, and the change set is scoped to `tool_surface.md` only. The reconciliation target `guarded_proxy.md` was confirmed to already read as the consumer — its Classification table guards `read && feedsDesignDecision`, its `exemptTransport` is a positive allowlist gated on `feedsDesignDecision = false`, and it explicitly states the policy is derived from the tool-surface reference — so reconciliation was achieved with zero proxy edit and no parallel drift. This documentation records and re-verifies that work; it writes only the phase-folder docs and touches no live file.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Model the surface on two independent axes instead of one | A single read/write axis cannot express a read whose output IS the design; splitting `feedsDesignDecision` from `mutatesWorkspace` lets a non-mutating tool still be guarded when it feeds a design decision |
| Make `guarded` a pure function: `feeds OR mutates` | A derived guarded column removes ambiguity — every row's guard status is computable from its two tags, and a new tool fails closed under deny-by-default |
| Treat the `mutatesWorkspace = Y` column as the source of the guardedTools list | The seven-tool list stops being a parallel inventory and becomes a projection of one column, so the table and the configured list cannot drift apart |
| Promote `list_projects` to clean transport, keep `get_file`/`search_files` guarded | On the design-feeding axis, `list_projects` returns identifiers only (no design substance) while file reads and searches can carry design content; the refined split is a documented divergence from the research's flat "ambiguous_read" trio |
| Guard ambiguous reads by default, exempt only with a non-design-use receipt | Deny-by-default keeps a nominally read-only call from laundering design context; the receipt is the explicit, auditable path back to pure-transport handling |
| Label `feedsDesignDecision` an advisory judgment, not a runtime probe | The tag is a per-tool judgment made explicit with a one-line rationale; the table is the source the proxy's runtime decision consumes, and stating this keeps the contract honest — taste is not certified |
| Edit `tool_surface.md` only; leave `guarded_proxy.md` untouched | The proxy already implements the consumer policy and already names the tool-surface reference as its source; reconciliation needed only that the table declare itself the source, so the scope stayed minimal with no parallel drift |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| All 18 tools tagged on both axes | PASS, every row carries `feedsDesignDecision` (Y/N) and `mutatesWorkspace` (Y/N) |
| `guarded = feedsDesignDecision OR mutatesWorkspace` for every row | PASS, row-by-row boolean check holds |
| Every `feedsDesignDecision` tag carries a one-line rationale | PASS, advisory judgment documented per row, not implied |
| ACCEPTANCE: read-but-design-feeding tool is GUARDED | PASS, `get_run` is `feeds=Y, mutates=N, guarded=Y` |
| ACCEPTANCE: pure-transport tool is EXEMPT | PASS, `list_projects` is `feeds=N, mutates=N, guarded=N` |
| Guarded/exempt split | PASS, 13 guarded (7 mutating + 4 design-reads + 2 ambiguous) + 5 exempt = 18 total |
| D4-R4 reconciliation: `mutatesWorkspace = Y` equals the seven-tool guardedTools list | PASS, `create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run`, `delete_file`, `delete_project` exactly |
| Old single-axis correction (the 9 deletions) | PASS, the freely-surfaceable read-only bucket replaced by the two-axis table; no tool information lost |
| Deny-by-default floor stated | PASS, an unclassified or axis-indeterminate tool resolves to guarded |
| Ambiguous-read receipts | PASS, `get_file`/`search_files` guarded by default, exempt only with a non-design-use receipt |
| `guarded_proxy.md` reconciled as the consumer | PASS, the proxy guards `read && feedsDesignDecision`, `exemptTransport` requires `feedsDesignDecision = false`, and it states the policy is derived from the tool-surface reference — zero proxy edit |
| Evergreen: no spec/packet/phase IDs or `specs/` paths in the doc body | PASS, `tool_surface.md` body scan clean |
| Scope: only `tool_surface.md` edited | PASS, working-tree diff is +61/-9 on `tool_surface.md` alone; `guarded_proxy.md` has no uncommitted change |
| `validate.sh --strict` (phase folder) | PASS for all non-generated checks; see GENERATED_METADATA residual below |
| GENERATED_METADATA residual (description.json / graph-metadata.json) | EXPECTED, the orchestrator regenerates these; level/status/fingerprint drift is not hand-written |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`feedsDesignDecision` is an advisory judgment, not a runtime probe.** Each tag is a per-tool judgment made explicit with a one-line rationale. The table is the source the proxy's runtime decision consumes; it does not itself probe a specific call.
2. **The phase ships no runtime classifier.** It re-models one classification table. The enforceable consumer is `guarded_proxy.md`, which keys on `feedsDesignDecision` and `mutationClass` and is unchanged by this phase.
3. **Ambiguous reads stay guarded absent a receipt.** A legitimate non-design `get_file`/`search_files` read incurs the design precondition unless a non-design-use receipt is supplied; the receipt path is the explicit exemption.
4. **`guarded_proxy.md` was reconciled by confirmation, not edit.** The plan named it a secondary target; the delivered reconciliation makes the table the named source and confirms the proxy already reads as a projection. No proxy edit was made, so the scope stayed `tool_surface.md` only.
5. **Taste is not certified.** This makes the design-feeding judgment explicit and guards the read-then-launder path; it does not certify the design quality of any artifact a tool returns.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Two-axis tool classification added to tool_surface.md: guarded = feedsDesignDecision OR mutatesWorkspace; 13 guarded / 5 exempt / 18 total
- get_run GUARDED, list_projects EXEMPT; mutatesWorkspace=Y column = the D4-R4 guardedTools seven; 9 deletions correct the old single-axis read-only bucket
- Scope = tool_surface.md only (61/9); guarded_proxy.md reconciled by confirmation (zero edit); GENERATED_METADATA regenerated by the orchestrator
-->
