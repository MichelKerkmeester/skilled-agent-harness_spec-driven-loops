---
title: "Feature Specification: sk-doc parent skill"
description: "Convert sk-doc from a 6-mode monolith into a WORKFLOW-ONLY parent hub with a shared/ doc-quality backbone — one advisor identity dispatching to self-contained create-* packets — following the canonical two-axis pattern proven by sk-code/sk-design/deep-loop and hardened by the 124/022 over-decomposition lesson. Final packet set settled by a 30-iteration deep research before any file moves."
trigger_phrases:
  - "sk-doc parent skill"
  - "sk-doc parent hub"
  - "documentation skill family"
  - "create-* sub-skills"
  - "doc-quality shared backbone"
importance_tier: "important"
contextType: "implementation"
parent: "skilled-agent-orchestration"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent"
    last_updated_at: "2026-07-06T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Build live: 003 hub shell + 004 shared/facades + 005-012 packet content moved (37 facades, zero breakage); 9 packet SKILL.md via GPT-5.5 writers in progress")
    next_safe_action: "Verify packet SKILL.md (fresh Sonnet-5); then cutover (hub SKILL.md swap + advisor) + validate")
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase list + outcome only; no merge/migration/consolidation history; heavy docs live in children. -->

# Feature Specification: sk-doc parent skill

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase (program Level 3) |
| **Priority** | P1 |
| **Status** | In Progress (foundation scaffolded; research phase 001 pending) |
| **Created** | 2026-07-06 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | None (root) |
| **Parent Packet** | `skilled-agent-orchestration` |
| **Predecessor** | `124-sk-code-parent` (reference conversion, incl. the 022 over-decomposition lesson); `117-parent-nested-skill-pattern` (governing pattern); `119-parent-skill-native-invocability` |
| **Successor** | Active child phases listed in the Phase Documentation Map |
| **Handoff Criteria** | Each child phase validates independently; parent validates under recursive phase-parent policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-doc` is a 6-mode **monolith**: one overloaded `SKILL.md` carries document-quality management, skill/agent/command/readme/feature-catalog/testing-playbook/benchmark/changelog authoring, and flowchart creation, with `references/`, `scripts/`, and `assets/` flat at the skill root. It is the last major authoring skill **not** following the canonical two-axis parent-hub pattern that `sk-code` (124/022), `sk-design`, and `deep-loop-workflows` have adopted. The monolith is hard to route (one advisor identity absorbing many distinct authoring intents), hard to maintain (per-artifact doctrine tangled in shared prose), and its content is referenced by hardcoded absolute paths from ~40+ tight couplings (the 7 `/create:*` command YAMLs) and ~151+ looser couplings (external READMEs, 3 sibling hubs, `/doctor`'s budget-constant import, the git pre-commit hook, the council test matrix) — so any restructure risks silently breaking runtime tooling.

### Purpose
Convert `sk-doc` into a **WORKFLOW-ONLY parent hub** with a `shared/` doc-quality backbone, exposing exactly **one** advisor-routable identity (`skill_id: sk-doc`) that dispatches to self-contained nested `create-*` packets via a `mode-registry.json` source-of-truth and a `hub-router.json`. Each artifact-type creator becomes a nested workflow packet; the universal doc-quality pipeline (validators + global standards + frontmatter/llms.txt/template_rules + flowchart) lives **once** in `shared/` and is symlinked inward; a new `doc-quality` workflow packet anchors the validate/score/optimize-existing-doc route. The conversion preserves every external coupling via the `sk-code` shared/+stable-facade-symlink pattern (**zero edits** to the ~151 external refs) while explicitly repointing the tightly-coupled command YAMLs and rewriting the advisor/skill-graph metadata.

> **Phase-parent note:** This `spec.md` is the ONLY authored document at the parent level. All detailed planning, blast-radius inventories, checklists, and decisions live in the child phase folders in the Phase Documentation Map below. The **final packet set** (esp. the two provisional packets and the new `doc-quality` route) is settled by the phase 001 deep research before any file moves — the map below is the **initial research-grounded proposal**.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Restructure `.opencode/skills/sk-doc/` into a two-tier hub (hub + nested `create-*` packets + `shared/`).
- Create `mode-registry.json`, `hub-router.json`, `description.json`; rewrite `graph-metadata.json` to **one** identity.
- Build the confirmed `create-*` workflow packets + the `doc-quality` packet + the `shared/` doc-quality backbone.
- Establish root **facade symlinks** (`scripts/`, `references/skill_creation/`, `assets/frontmatter_templates.md`) for zero external edits.
- Repoint the 7 `/create:*` command `auto.yaml`/`confirm.yaml` pairs + `commands/create/README.txt` reference table.
- Rewrite advisor boosters (`skill_advisor.py`) + regenerate `skill-graph.json` + advisor rebuild/scan.
- Reconcile fail-open couplings (`/doctor` `audit_descriptions.py` import, pre-commit hook, council matrix, `check-markdown-links` allowlist).
- Routing benchmark + cross-hub parity gate; strict validation + parent rollup + close-out.

### Out of Scope
- Rewriting the doctrine **content** of any doc-type reference — this program **moves**, it does not rewrite standards.
- Adding a surface axis or any named extension beyond an optional `deprecated-modes` shim — the base case is **zero extensions** (the doc-quality pipeline is universal doctrine, not a surface: labeling it a surface would be a category error).
- Changing validator-script behavior — scripts move to `shared/`, logic unchanged.
- Editing the ~151 external README/playbook validation-command refs — facades preserve them.
- Introducing new `/create:*` commands beyond an optional `/doc:quality` (deep-research-gated).
- The one coordinated canonical reindex — handed off to the operator at close-out.
- Restructuring any OTHER skill or the command family's internal logic beyond path repoints.

### Files to Change
Per-phase detail lives in each child's spec/plan; the authoritative blast-radius inventory is produced in `001-research-and-canon/`. Summary for audit trail only:

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-research-and-canon/research/` | Create | 001 | 30-iteration deep-research artifacts (packet-boundary rulings, facade/coupling matrix, canon-conformance) |
| `.opencode/skills/sk-doc/` | Restructure | 003–012 | Monolith → parent hub (`SKILL.md`, `mode-registry.json`, `hub-router.json`, `shared/`, per-packet child folders) |
| `.opencode/commands/create/assets/*.yaml`, `commands/create/README.txt` | Update | 013 | Repoint the 7 tightly-coupled `/create:*` command routers to child/shared paths (atomic, self-hosting-safe) |
| `.opencode/skills/sk-doc/graph-metadata.json`, `description.json`; `skill_advisor.py`; `skill-graph.json` | Rewrite / Regen | 014 | One advisor identity spanning all workflow surfaces; boosters for missing verbs; regenerated graph |
| `/doctor` `audit_descriptions.py`, git pre-commit hook, council `test-council-matrix.sh`, `check-markdown-links.cjs` | Reconcile | 015 | Explicit repoint or facade per fail-open coupling; zero silent degradation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder; all implementation detail lives in the children. The arc below is the **initial research-grounded proposal** from the foundation workflow — phase 001 (the 30-iteration deep research) may refine the downstream shape, especially the two PROVISIONAL packets.

### Proposed final packet set (settled by 001)

- **Confirmed workflow packets:** `create-skill` (heaviest; `create-skill-parent` is a 2nd `workflowMode` over the same packet; absorbs the `create-command` templates), `create-readme` (install-guide folded as a variant), `create-agent`, `create-feature-catalog`, `create-manual-testing-playbook`, `doc-quality` (NEW — validate/score/optimize an existing doc; the `sk-design` audit analog).
- **Provisional (keep-or-fold, 001 rules):** `create-benchmark` (no bound command, ~2 repo uses), `create-changelog` (template-only).
- **`shared/` backbone (not routed, no `graph-metadata.json`):** generic validators, `references/global/*`, frontmatter/llms.txt/`template_rules.json`/flowchart assets. Children symlink inward; root facades preserve external refs.
- **Folded (both analyses agree):** `create-command` → `create-skill` templates; `create-skill-parent` → 2nd mode; install-guide → `create-readme` variant; flowchart → shared assets.

### Phases

| Phase | Folder | Focus | Placeholder | Status |
|-------|--------|-------|-------------|--------|
| 001 | `001-research-and-canon/` | 30-iteration deep research: settle every packet-boundary + migration ruling; re-verify canon; enumerate the exact facade set. RESEARCH GATE. **Read-only — no sk-doc mutations.** | no | pending |
| 002 | `002-architecture-decision/` | Lock hub architecture from 001: `modes[]`, `hub-router.json` schema, shared/symlink topology, graph-metadata/advisor plan, `extensions=[]`, atomic command-repoint sequencing. DECISION GATE. | no | pending |
| 003 | `003-hub-scaffold/` | Scaffold the two-tier hub in place via `/create:sk-skill-parent`: thin `SKILL.md`, registry, router, `description.json`, one-identity `graph-metadata.json`, empty packet dirs + `shared/` skeleton + hub companion dirs. | no | pending |
| 004 | `004-shared-backbone/` | Populate `shared/` (generic validators + global refs + shared assets) as single source of truth; establish the critical root facades for zero external edits. | yes | pending |
| 005 | `005-create-skill/` | Build `create-skill` (heaviest; `create-skill-parent` 2nd mode; absorbed command templates; `init_skill.py`+`package_skill.py`); self-hosting-safe template facade. | yes | pending |
| 006 | `006-create-readme/` | Build `create-readme` (install-guide variant folded; `audit_readmes.py`). | yes | pending |
| 007 | `007-create-agent/` | Build `create-agent` (distinct OpenCode-component output contract). | yes | pending |
| 008 | `008-create-feature-catalog/` | Build `create-feature-catalog` (multi-file inventory contract + validator branch). | yes | pending |
| 009 | `009-create-manual-testing-playbook/` | Build `create-manual-testing-playbook` (release-review/evidence contract). | yes | pending |
| 010 | `010-create-benchmark/` | **PROVISIONAL** — execute 001's keep-or-fold ruling for `create-benchmark`. | yes | pending |
| 011 | `011-create-changelog/` | **PROVISIONAL** — execute 001's keep-or-fold ruling for `create-changelog`. | yes | pending |
| 012 | `012-doc-quality/` | Build the `doc-quality` workflow packet (validate/score/optimize existing docs; extract → DQI → HVR → validate; orchestration-only). | yes | pending |
| 013 | `013-command-rebinding/` | Repoint the 7 `/create:*` command YAMLs + `README.txt`; atomic, self-hosting-safe commit that flips the `parent_skill_*` template refs. | yes | pending |
| 014 | `014-advisor-and-skill-graph/` | Rewrite `graph-metadata.json` + `description.json`; extend `skill_advisor.py` boosters; regenerate `skill-graph.json`; one-identity + no-child-metadata verification. | yes | pending |
| 015 | `015-external-refs-and-facades/` | Verify every preserved facade resolves (~151 external refs, 3 sibling hubs, pre-commit, council matrix); reconcile the 3 fail-open sites with zero silent degradation. | yes | pending |
| 016 | `016-routing-benchmark/` | Hub routing benchmark + cross-hub parity gate (CONDITIONAL); ranked Skill Benchmark Report. | yes | pending |
| 017 | `017-cutover-and-closeout/` | Cutover: remove residual monolith remnants, `parent-skill-check.cjs` STRICT 0/0, recursive `validate.sh --strict`, parent rollup, close-out memory save + reindex handoff. | yes | pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.
- **Research gate:** phases 002+ begin only after a human reviews the 001 deep-research output.
- **Architecture gate:** build phases 003+ begin only after the user approves the 002 architecture decision.
- **Provisional gate:** phases 010–011 execute 001's keep-vs-fold ruling; their specs branch on the decision.

### Phase Handoff Criteria

| From | To | Criteria |
|------|-----|----------|
| 001 | 002 | Every packet-boundary + facade ruling is decision-ready with file:line evidence; canon re-verified |
| 002 | 003 | Architecture decision record approved (registry, router, shared/symlink, advisor, sequencing) |
| 003 | 004 | Hub shell validates; exactly one `graph-metadata.json`; no content moved yet |
| 004 | 005–012 | `shared/` is the source of truth and root facades resolve with zero external edits |
| 005–012 | 013 | All confirmed packets built and self-contained; provisional rulings executed |
| 013 | 014 | The 7 command routers resolve at runtime; atomic self-hosting-safe repoint landed |
| 014 | 015 | Advisor single-identity live; skill-graph regenerated with exactly one sk-doc entry |
| 015 | 016 | Every external coupling verified; zero fail-open silent-degradation sites remain |
| 016 | 017 | Routing benchmark + parity gate pass; routing gaps remediated |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

Bound to the phase children; the 30-iteration deep research (001) is the instrument that resolves them:

- **Provisional packet count (~6 vs operator's 8):** keep-vs-fold for `create-benchmark` and `create-changelog`; the merge candidates (`agent`+`command` → `create-component`; `feature-catalog`+`playbook` → `create-validation-package`) are carried as first-class deep-research angles, not the default.
- **`doc-quality` routability:** is it an advisor-visible workflow packet (the `sk-design` audit analog) or pure `shared/` backbone? Does it warrant a `/doc:quality` command?
- **Shared-vs-packet script split:** which scripts are universal backbone vs artifact-type-specific (`init_skill`/`package_skill` → `create-skill`, `audit_readmes` → `create-readme`).
- **Facade topology:** the exact facade set that yields zero external edits, and per-site rulings for the 3 fail-open couplings.
- **Self-hosting sequencing:** the atomic order that keeps `parent_skill_*` templates readable at their old path until `/create:sk-skill-parent`'s refs flip.
- **Named extensions:** confirm the zero-extension base case; whether a `deprecated-modes` shim is needed for a retired flat public entry point.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Authoritative pattern contract:** `.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md`; templates in `.opencode/skills/sk-doc/assets/skill/parent_skill_*`.
- **Reference conversion (worked example):** `../124-sk-code-parent/` — esp. `022-collapse-to-four-subskills/` (the over-decomposition lesson) and `023-sk-code-workflow-subskill-research/` (deep-research on refining workflow sub-skills).
- **Governing packets:** `../117-parent-nested-skill-pattern/`, `../119-parent-skill-native-invocability/`, `../118-frontmatter-versioning/`.
- **Scaffolder:** `.opencode/commands/create/sk-skill-parent.md` (`/create:sk-skill-parent`) — PLAN-WORKFLOW LOCK: use it, do not hand-roll the hub.
- **Hub validator:** `.opencode/commands/doctor/scripts/parent-skill-check.cjs` (canon checks 1,2,3,5–9 must pass STRICT).
- **Target skill:** `.opencode/skills/sk-doc/` (monolith, v1.8.x).
- **Hub references:** `.opencode/skills/sk-code/`, `.opencode/skills/sk-design/`, `.opencode/skills/deep-loop-workflows/`.
- **Graph Metadata:** see `graph-metadata.json` for `derived.last_active_child_id` pointer.
