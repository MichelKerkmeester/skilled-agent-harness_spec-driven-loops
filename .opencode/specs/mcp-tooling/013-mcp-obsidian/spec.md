---
title: "Feature Specification: mcp-obsidian — Obsidian CLI + MCP mode for the mcp-tooling hub"
description: "Phase parent: add Obsidian dual CLI+MCP tooling as a new mcp-obsidian workflow mode of the mcp-tooling hub, mirroring mcp-click-up — research, build-or-adopt, author the skill package, register in hub + advisor, verify end-to-end."
trigger_phrases:
  - "mcp-obsidian"
  - "obsidian cli mcp"
  - "obsidian vault tooling"
  - "mcp-tooling obsidian mode"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author phase-parent spec + 8-phase documentation map"
    next_safe_action: "Execute 001-deep-research (multi-model /deep:research, no early convergence)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Build vs adopt for the CLI and MCP servers (decided in 001)"
      - "Does the target environment have an Obsidian vault + Local REST API available for live smoke?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: mcp-obsidian — Obsidian CLI + MCP mode for the mcp-tooling hub

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase parent) |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (mcp-tooling track) |
| **Parent Packet** | `mcp-tooling` |
| **Predecessor** | `012-template-alignment` (sibling under mcp-tooling) |
| **Successor** | None |
| **Handoff Criteria** | All 8 phases validate; `mcp-obsidian` registered in the hub (mode-registry + hub-router + leaf-manifest) and discoverable by the skill-advisor; live CLI + MCP smoke passes; `parent-skill-check` exits 0. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
We can drive ClickUp from both a terminal CLI and an MCP tool (the `mcp-click-up` mode of the `mcp-tooling` hub). There is no equivalent for Obsidian. Users who keep notes/knowledge in an Obsidian vault cannot create, search, link, or manage notes from either the terminal or an agent session inside this framework.

### Purpose
Add a new **`mcp-obsidian`** workflow mode to the `mcp-tooling` parent hub that exposes Obsidian through **both** a CLI path and an MCP path — structurally identical to `mcp-click-up` — so notes/vault operations are available to humans (terminal) and to agents (Code Mode / MCP). The mode ships install-pointer packages (not vendored source), is registered across the hub's routing surfaces, is discoverable by the skill-advisor, and is verified end-to-end.

**End goal (what "done" looks like):** a `mcp-obsidian` mode whose `mcp-servers/` holds an `obsidian-cli` install pointer and an `obsidian-mcp` install pointer, wired into `.utcp_config.json` + `.env.example`, registered in all five hub files, advisor-discoverable, and covered by a feature catalog + manual-testing playbook — used exactly like `/mcp-tooling → mcp-click-up`.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose + child-phase manifest for the `mcp-obsidian` mode.
- A dual CLI + MCP surface for Obsidian, mirroring the `mcp-click-up` two-package `mcp-servers/` pattern (install pointers, not vendored code).
- Registration of the mode across the `mcp-tooling` hub (routing) + skill-advisor (discovery), plus runtime wiring in `.utcp_config.json` and `.env.example`.
- Skill package docs (SKILL.md, README, INSTALL-GUIDE, references, examples, changelog), a feature catalog, and a manual-testing playbook.

### Out of Scope
- Detailed per-phase implementation plans at the parent level (they live in child folders).
- Building a general Obsidian sync/plugin ecosystem; only the CLI + MCP surfaces needed to operate a vault are in scope.
- Changing any other `mcp-tooling` mode.

### Files to Change
Aggregate file scope. Per-phase detail lives in each child plan.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/**` | Create | 002–006 | New mode package (SKILL.md, README, INSTALL-GUIDE, mcp-servers/{obsidian-cli,obsidian-mcp}, references/, scripts/, examples/, feature-catalog/, manual-testing-playbook/, changelog/) |
| `.opencode/skills/mcp-tooling/mode-registry.json` | Modify | 007 | Add `mcp-obsidian` mode entry |
| `.opencode/skills/mcp-tooling/hub-router.json` | Modify | 007 | Add tieBreak + routerSignals + vocabularyClasses |
| `.opencode/skills/mcp-tooling/description.json` | Modify | 007 | Add advisor keywords + version bump |
| `.opencode/skills/mcp-tooling/graph-metadata.json` | Modify | 007 | Add advisor intent signals / entities |
| `.opencode/skills/mcp-tooling/leaf-manifest.json` | Regenerate | 007 | Add mode leaves (generator, not hand-edit) |
| `.opencode/skills/mcp-tooling/SKILL.md` | Modify | 007 | Add mode row + counts |
| `.opencode/skills/mcp-tooling/shared/references/smart-routing.md` | Modify | 007 | Add OBSIDIAN intent + resource-map |
| `.utcp_config.json` | Modify | 004 | Add `obsidian` MCP manual (npx/stdio + env) |
| `.env.example` | Modify | 004 | Add `{manual}_OBSIDIAN_*` prefixed keys |
| `README.md` (repo root) | Modify | 007 | Integration list + skill table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-deep-research/ | Multi-model `/deep:research` (GPT-5.6 SOL-high×4 + TERRA-max-fast×3 + LUNA-max×3, **no early convergence**) on Obsidian CLI / REST API / MCP landscape → findings + a build-or-adopt recommendation for both surfaces | Pending |
| 2 | 002-tool-selection-and-scaffold/ | Lock the CLI + MCP choices from research (build vs adopt); scaffold the `mcp-obsidian` package via `sk-create-skill`, mirroring the `mcp-click-up` tree | Pending |
| 3 | 003-cli-tool-integration/ | `mcp-servers/obsidian-cli/` install pointer + `scripts/{install,doctor}.sh` + `references/<cli>-commands.md` (CLI path, invoked via Bash) | Pending |
| 4 | 004-mcp-server-integration/ | `mcp-servers/obsidian-mcp/` + `.utcp_config.json` manual + `.env.example` prefix + `references/mcp-tools.md` (verify the chosen npm package name actually resolves) | Pending |
| 5 | 005-skill-authoring/ | `SKILL.md` routing contract (CLI↔MCP router) + README + INSTALL-GUIDE + references + examples + changelog | Pending |
| 6 | 006-feature-catalog-and-playbook/ | `feature-catalog/` via `sk-create-feature-catalog` + `manual-testing-playbook/` via `sk-create-manual-testing-playbook` | Pending |
| 7 | 007-hub-registration-and-advisor/ | Five hub files + `smart-routing.md` + leaf-manifest regen + compiled-routing re-mint + `advisor_rebuild` + repo README | Pending |
| 8 | 008-verification-and-closeout/ | `validate.sh --recursive --strict`, `parent-skill-check` exit 0, route-validate, advisor-recall test + live CLI/MCP smoke, benchmark, closeout | Pending |
| 9 | 009-community-plugin-support/ | Knowledge / logic / workflows so the mode's AI can operate three community plugins at the vault **file layer**: obsidian-flat-financing (Beancount `.beancount`), obsidian-tables (`.table.md` JSON), obsidian42-BRAT (beta-plugin installer). Authors `references/` + `assets/` that Phase 5 folds into the shipped skill. | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume mcp-tooling/013-mcp-obsidian/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.
- Phases 003 and 004 (CLI and MCP surfaces) may proceed in parallel once 002 locks the tool choices; 005 depends on both.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-deep-research | 002-tool-selection-and-scaffold | Convergence report + a decided build-or-adopt recommendation per surface (CLI, MCP), with named candidate packages/binaries | `research.md` + convergence artifacts present; decision recorded |
| 002-tool-selection-and-scaffold | 003 / 004 | Tool choices locked; empty mode package scaffolded matching the mcp-click-up tree | `mcp-obsidian/` skeleton exists; `sk-create-skill` scaffolder ran |
| 003-cli-tool-integration | 005-skill-authoring | CLI installs via `scripts/install.sh`; `doctor.sh` reports green; CLI command reference authored | CLI binary on PATH; `references/<cli>-commands.md` present |
| 004-mcp-server-integration | 005-skill-authoring | MCP manual registered in `.utcp_config.json`; npm/package name resolves; env prefix documented | `call_tool_chain` reaches the obsidian manual (or documented-unproven if no vault) |
| 005-skill-authoring | 006-feature-catalog-and-playbook | SKILL.md + README + INSTALL-GUIDE authored; CLI↔MCP routing contract present | `validate.sh` on package docs passes |
| 006-feature-catalog-and-playbook | 007-hub-registration-and-advisor | Feature catalog + playbook packages authored and validated | `check_no_hyphenated_catalog_content.py` + `validate_document.py` pass |
| 007-hub-registration-and-advisor | 008-verification-and-closeout | Mode registered in all five hub files + smart-routing; leaf-manifest regenerated; compiled routing re-minted; advisor rebuilt | `parent-skill-check` exit 0; advisor returns `mcp-tooling` for obsidian prompts |
| (additive, runnable after 001) | 009-community-plugin-support | Independent of 008; provides per-plugin knowledge + assets that Phase 5 (skill-authoring) folds into `mcp-obsidian/references/` | `references/{flat-financing,obsidian-tables,obsidian42-brat,plugin-operation-logic}.md` + `assets/` present and validated |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Build vs adopt (per surface):** resolved in Phase 1. Preliminary landscape to validate — an Obsidian community CLI exists (e.g. the terminal workflow described at dsebastien.net) and multiple third-party Obsidian MCP servers exist on npm; several depend on the **Local REST API** community plugin. Phase 1 confirms the best candidate for each surface and whether either must be built.
- **Vault access in this environment:** does the target environment have an Obsidian vault (and Local REST API plugin + token) available? If not, the MCP path is authored as documented-but-unproven (same posture `mcp-click-up` took) and live smoke is deferred.
- **Classification:** decided as a **workflow** mode (`cli-plus-mcp`, `mutatesWorkspace: true`) like `mcp-click-up`, since Obsidian operations read and write a vault. Revisit only if research shows the surface is read-only.
- **CLI transport:** is the chosen CLI a PATH binary (invoked via Bash, registered nowhere) like `cupt`, or does it need its own config store? Phase 3 decides.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Parent Spec**: `../spec.md` (the `mcp-tooling` track).
- **Template mirror**: `.opencode/skills/mcp-tooling/mcp-click-up/` (the structural template this mode copies).
- **Graph Metadata**: `graph-metadata.json` for the `derived.last_active_child_id` pointer.
