---
title: "Feature Specification: Deprecate sk-design hub + interface; graduate md-generator to standalone"
description: "Program parent that retires the sk-design parent hub and its interface (design-direction/taste) mode, graduates the surviving DESIGN.md CSS-extraction engine (sk-design-md-generator) plus its styles corpus into a standalone advisor-routable skill enriched with a condensed design-knowledge layer distilled from the retired interface/shared reference base, then reconciles every live cross-skill contract and regenerates the advisor graph and compiled routing, across six numbered children."
trigger_phrases:
  - "deprecate sk-design"
  - "retire sk-design interface"
  - "graduate md-generator standalone"
  - "sk-design-md-generator standalone skill"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface"
    last_updated_at: "2026-08-19T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored phase-parent spec + 6-child phase map"
    next_safe_action: "Execute child 001 inventory via cli-devin"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/sk-design-md-generator/"
      - ".opencode/skills/sk-design/styles/"
      - ".opencode/skills/sk-design/sk-design-interface/"
      - ".opencode/skills/sk-design/shared/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase map only; no plan/tasks/checklist/decision/impl-summary here (those live in child phase folders). -->

# Feature Specification: Deprecate sk-design hub + interface; graduate md-generator to standalone

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Phase Parent lean trio (program umbrella over six numbered children) |
| **Priority** | P1 |
| **Status** | Complete — all 7 children shipped; scoped commit operator-gated. **Superseded in part** by `sk-design/018-sk-design-parent-v2` |
| **Created** | 2026-08-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None; root packet under the design track |
| **Parent Packet** | `sk-design` |
| **Predecessor** | `sk-design/015-deprecate-open-design` (retired the mcp-open-design mode; this packet retires the last non-md-generator mode and the hub itself) |
| **Successor** | `sk-design/018-sk-design-parent-v2` (reverses the hub decision below; keeps every scope decision) |
| **Handoff Criteria** | The standalone `sk-design-md-generator` skill validates under `validate.sh --strict`; the `016` packet validates under `validate.sh --recursive --strict`; no dangling `sk-design`/`interface:` references remain in live surfaces |
<!-- /ANCHOR:metadata -->

> **Superseded in part, 2026-09-06.** `sk-design/018-sk-design-parent-v2` reinstated the
> `sk-design` parent hub. The reasoning recorded below was sound for the shape it described — a hub
> routing exactly two unevenly-coupled modes — and the successor packet reinstates it for a
> different shape: four modes with one subject, after chart and diagram arrived from the
> documentation hub. `sk-design-md-generator` is no longer a standalone root; it is the hub's
> EXTRACT mode.
>
> What this packet retired stays retired: the interface mode, the `commands/interface/` surface, and
> the design-taste layer. Only the hub decision is reversed. This document is left as written,
> because it is the record of a decision that was correct when it was taken.

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `sk-design` parent hub currently routes exactly two workflow modes through `mode-registry.json`: `sk-design-interface` (invents new visual direction — palette, type, layout, motion, anti-slop critique; the design *taste* authority) and `sk-design-md-generator` (extracts a live website's real CSS into a v3 Style Reference `DESIGN.md`; the extraction *fidelity* engine). The operator is retiring the design-direction surface and the hub wrapper entirely. Only the DESIGN.md CSS-extraction capability survives.

The two modes are unevenly coupled to the shared `styles/` corpus: `sk-design-interface` is the heavy consumer (≈25 imports of the `styles/lib/engine` style-library across its `corpus/` subsystem and tests), while `sk-design-md-generator` touches `styles/` only once (a single test manifest path). Because `interface` is being deleted, its dependency on `styles/` evaporates, so `styles/` moves cleanly with the surviving `md-generator`.

Because `sk-design` is not just a skill folder — it is an advisor-routed identity (`graph-metadata.json`), a compiled-routing hub (`.opencode/bin/lib/compiled-routing/.../006-sk-design/`), a deep-alignment authority (adapter scripts + known-deviation docs), and the target of every `cli-*` skill's "Design Standards Loading" dispatch contract — deprecating it is a runtime migration, not a folder delete.

### Purpose

1. **Graduate** `sk-design-md-generator` (with its `styles/` corpus, style database, and all runtime assets) into a standalone, advisor-routable skill at `.opencode/skills/sk-design-md-generator/`, fully functional detached from the hub.
2. **Enrich** it with a *condensed* general-design-knowledge layer distilled from the retired `interface` mode and the hub's `shared/` reference base (anti-slop principles, cognitive/numeric design laws, design-token vocabulary, register, structural-fingerprint pattern cards, and a slimmed direction/foundations digest) — less expansive than the full interface mode, giving the surviving skill broader design knowledge than pure extraction.
3. **Delete** the `sk-design` parent hub, the `sk-design-interface` mode, and `.opencode/commands/interface/` after extraction is proven green.
4. **Reconcile** every live cross-skill contract that named the hub (README/AGENTS docs, `cli-*` Design Standards Loading, deep-alignment authority, mcp-tooling pairing, agent defs, opencode.json) to point at the standalone skill, and **regenerate** the advisor skill-graph and compiled-routing artifacts from their own tooling.

### Topology Narrative

The design surface has been contracting across a documented arc: `sk-design/014-template-conformance` merged motion into interface and retired the audit/foundations modes (6 modes → 3 modes / 2 commands); `sk-design/015-deprecate-open-design` retired the `mcp-open-design` transport mode (→ 2 modes). This packet removes the second-to-last mode (`interface`) and the hub wrapper, leaving **one standalone skill** — `sk-design-md-generator` — as the entire surviving design surface. `/interface:design` is deleted; `/interface:design-reference` (the DESIGN.md extraction command) survives, rebound to the standalone skill.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Extracting `sk-design-md-generator/` and `styles/` into a new top-level standalone skill root `.opencode/skills/sk-design-md-generator/` (name kept per operator decision).
- Adding the standalone-root metadata the skill lacks as a hub mode: its own `graph-metadata.json` advisor identity (and README/INSTALL-GUIDE/changelog root docs), per the skill-root-metadata contract.
- Rewiring the one `md-generator → styles` import path and any other internal path/DB/asset reference so the skill runs detached.
- Folding a condensed design-knowledge layer (salvaged from `shared/` + `interface/references/{foundations,design-process,design-grounding,motion}`) into the standalone skill.
- Deleting the `sk-design` parent hub, the `sk-design-interface` mode, and `.opencode/commands/interface/`.
- Repo-wide reconciliation of **live** `sk-design` / `interface:` references: `README.md`, `AGENTS.md`, `.opencode/skills/README.txt`, `cli-*/SKILL.md` Design Standards Loading, `mcp-tooling` pairing docs, agent defs (`.opencode/agents`, `.claude/agents`, `.codex/agents`, `.cursor/agents`, `.pi/agents`, `.devin/agents`), `opencode.json`, deep-alignment adapters.
- Regenerating the advisor skill-graph (`skill_advisor` tooling) and compiled-routing artifacts (`compiled-route-sync`) so both forget the hub and know the standalone skill.

### Out of Scope

- **Editing frozen historical evidence**: benchmark reports under `**/benchmark/reports/**`, deep-improvement `fixtures/sk-design*`, and prior `specs/**` documents stay as dated record (operator decision — editing evidence corrupts it).
- **Renaming** the surviving skill — the name `sk-design-md-generator` is kept verbatim.
- **Preserving** `interface`'s heavy operational apparatus — its `corpus/` styles-engine consumer, `scripts/`, the 30-directory `manual-testing-playbook/`, the "invent-N-variations" `procedures/`, and `feature-catalog/` are deleted, not salvaged. Only durable *knowledge* (reference markdown) is distilled into the condensed layer.
- **Merging or pushing** anything — nothing lands on a shared branch without explicit operator approval.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/specs/sk-design/016-deprecate-sk-design-interface/` | Create | (parent) | Phase-parent trio + six children |
| `.opencode/skills/sk-design/sk-design-md-generator/` → `.opencode/skills/sk-design-md-generator/` | Move | 002 | Graduate the extraction engine to a top-level skill root |
| `.opencode/skills/sk-design/styles/` → `.opencode/skills/sk-design-md-generator/styles/` | Move | 002 | Move the styles corpus + database with the generator |
| `.opencode/skills/sk-design-md-generator/graph-metadata.json` (+ README/INSTALL/changelog roots) | Create | 003 | Standalone-root advisor identity + root docs |
| `.opencode/skills/sk-design-md-generator/backend/tests/corpus-baseline-v3.test.ts` and any other internal path refs | Rewrite | 003 | Rewire `../../../styles/...` → the new relative location |
| `.opencode/skills/sk-design-md-generator/references/design-knowledge/` (distilled) | Create | 004 | Condensed design-knowledge layer salvaged from `shared/` + `interface/references` |
| `.opencode/skills/sk-design/` (hub root, `sk-design-interface/`, `shared/`, `benchmark/`, etc.) | Delete | 005 | Remove the hub + interface after extraction is verified |
| `.opencode/commands/interface/` | Delete | 005 | Remove all `interface:*` commands (design.md; design-reference.md rebinds to the standalone skill first) |
| Live reference sites (README/AGENTS/README.txt, `cli-*/SKILL.md`, agent defs, `opencode.json`, mcp-tooling, deep-alignment) | Rewrite | 006 | Reconcile every live `sk-design`/`interface:` reference |
| Advisor skill-graph + compiled-routing artifacts | Regenerate | 006 | Rebuild from tooling so both forget the hub and know the standalone skill |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:execution-model -->
## EXECUTION MODEL

Most execution work is delegated to **`cli-devin` running `gemini-3-7-flash-high`** ("Gemini 3.7 Flash @ high thinking"), dispatched as scoped, verifiable, single-at-a-time jobs per the `cli-devin` SKILL.md contract (spec folder passed pre-approved, `AI_SESSION_CHILD=1`, `</dev/null`, PID-scoped kill). **Fallback: `glm-5-2`** if the Gemini path fails. The main agent (Claude) owns orchestration, spec-doc authoring (per distributed-governance Rule 5), verification between phases, and the destructive-phase operator gate. Spec-folder is passed to each dispatch as pre-approved (Gate 3 resolved: this packet).

**Blast-radius controls.** Phase 005 (delete) and any push/merge are **operator-gated** — the delete runs only after 002-004 are verified green, and the rollback (git-tracked; `sk-design/` restorable from HEAD) is named before it runs.
<!-- /ANCHOR:execution-model -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is an independently validatable Level 1-2 packet; all plan/tasks/checklist/decision/continuity content lives inside the children. Children are strictly sequential (each consumes the prior's verified output).

| Phase | Folder | Focus | Mutation Class | Status |
|-------|--------|-------|----------------|--------|
| 1 | `001-inventory-and-dependency-map/` | Grep the whole repo for `sk-design` / `interface:`; classify every hit as live-contract / frozen-evidence / generated-artifact; produce the authoritative reconcile map that 002-006 consume | read-only | **Complete** |
| 2 | `002-extract-md-generator-and-styles/` | `git mv` `sk-design-md-generator/` + `styles/` to the new top-level skill root; move nothing else | add-only (move) | **Complete** |
| 3 | `003-standalone-rewire-and-metadata/` | Rewire the one styles import + any internal paths; add root `graph-metadata.json`/README/INSTALL/changelog; **prove** the DB loads, extraction runs, and `validate.sh --strict` passes on the new root | mutates | **Complete** |
| 4 | `004-fold-design-knowledge/` | Distill the salvage set (`shared/` principles + `interface/references` digest) into a condensed `references/design-knowledge/` layer in the standalone skill | add-only | **Complete** |
| 5 | `005-delete-hub-and-interface-commands/` | Delete the `sk-design` hub + `sk-design-interface` mode + `.opencode/commands/interface/` (after rebinding `/…design-reference`) | **destructive — operator gate** | **Complete** |
| 6 | `006-reference-cleanup-and-reconcile/` | Repo-wide live-ref cleanup + repoint `cli-*`/deep-alignment/mcp-tooling contracts + regenerate advisor graph + compiled routing; `validate.sh --recursive --strict`; closeout | mutates | **Complete** |
| 7 | `007-rename-design-reference-to-extract/` | Rename `/design:design-reference` -> `/design:extract` (file, assets, all six runtime mirrors via existing sync tooling); close the interface-era mirror residue 006 left (broken `.claude/commands/interface` symlinks, stale never-synced `.codex`/`.pi` `interface-*.md` copies) | mutates | **Complete** |

### Phase Transition Rules

- Each child MUST pass `validate.sh` independently before the next child starts.
- **Extraction-before-deletion invariant:** 005 (delete) MUST NOT run until 002-004 are verified green — never delete the parent before the generator is proven detached and functional.
- Resume a specific child with `/speckit:resume sk-design/016-deprecate-sk-design-interface/[NNN-child]/`.
- `validate.sh --recursive --strict` on this parent runs only in 006 after all children land.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 inventory | 002 extract | Every `sk-design`/`interface:` hit is classified with a reconcile action; the live-contract set is enumerated with exact paths | `001` dependency-map artifact + reviewer diff against a fresh `rg` count |
| 003 rewire | 004 / 005 | New root passes `validate.sh --strict`; `node`/vitest proof that the DB loads and the extract pipeline runs from the new location | `003` checklist + captured command output |
| 004 fold | 005 delete | Condensed design-knowledge layer present, self-contained (no back-references into the doomed hub), validates | `004` checklist |
| 005 delete | 006 reconcile | `sk-design/` hub + `sk-design-interface/` + `commands/interface/` gone; `/…design-reference` rebound; no build breaks from the deletion alone | `005` checklist + `rg` for dangling imports |
| 006 reconcile | Program complete | Repo-wide `rg "sk-design"`/`"interface:"` over live surfaces returns only intended standalone-skill hits; advisor graph + compiled routing regenerated; `validate.sh --recursive --strict` = 0 errors | `006` checklist + advisor `advisor_status`/`skill_graph_status` + `validate.sh --recursive --strict` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Salvage-set precision (resolved in 004):** the exact subset of `interface/references/{foundations,design-process,design-grounding,motion}` to distill (vs. `shared/`, which is salvaged wholesale as durable principles) is decided during `004` authoring, biased toward "less expanded" per the operator directive. Not a blocker.
- **Advisor trigger-phrase split:** the hub `graph-metadata.json` carries ≈60 design trigger phrases spanning both direction and extraction. The standalone skill inherits the extraction + general-design-knowledge phrases; the pure "invent new direction / N variations / motion choreography" phrases retire with `interface`. The precise partition is finalized in `003`/`006` and verified by advisor re-scan.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children:** `00[1-6]-*/`; see each child's own `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`implementation-summary.md`.
- **Predecessor:** `.opencode/specs/sk-design/015-deprecate-open-design/` — the prior mode-retirement packet in this arc (a strong precedent for structure and closeout).
- **Program history:** `.opencode/specs/sk-design/014-template-conformance/` — the mode-reduction program that preceded this.
- **cli-devin contract:** `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md` — MUST be honored for every dispatch.
- **skill-root-metadata contract:** `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` — the standalone-root metadata requirements.
- **Graph Metadata:** `graph-metadata.json` (`derived.last_active_child_id` resume pointer).
