# Iteration 1: RQ1 — Workflow-YAML canonical schema (_auto.yaml / _confirm.yaml) + corpus divergence

## Focus
Establish the canonical schema of the `_auto.yaml` / `_confirm.yaml` workflow YAMLs (top-level nodes, step structure, bindings, placeholder conventions), pinpoint where the shipped corpus diverges across families, and define what a machine-readable command contract must capture so prose (router) and wiring (YAML) cannot drift. Ground in the 012 thesis: the triad is the validated-good foundation (35/35) — build on it, do not rebuild it.

## Findings

### F1.1 — The canonical workflow-YAML schema IS observable but UNSTATED in canon
The `_auto.yaml` / `_confirm.yaml` triad shares a fixed top-level node set across all four triad families. Reading the reference (`create_command_auto.yaml`) and comparing to `_confirm.yaml` and the deep family yields a stable schema:

**Shared top-level nodes** (`create_command_auto.yaml`, representative):
- `role`, `purpose`, `action` (identity triple — `:8-10`)
- `operating_mode` (workflow, compliance, execution, approvals, tracking, validation, permissions — `:28-38`)
- `development_philosophy`, `runtime_command_path_resolution` (`:40-48`)
- `confidence_framework`, `request_analysis_framework` (`:53-98`)
- `user_inputs`, `field_handling`, `input_contract` (`:103-151`)
- `documentation_level`, `command_templates`, `command_scripts`, `command_references` (`:155-180`)
- `context_loading` (`:184-195`)
- `workflow_enforcement`, `gate_logic`, `workflow_overview`, `workflow` (`:200-261`)
- `circuit_breaker`, `error_recovery`, `quality_standards`, `completion_report`, `termination`, `rules` (`:600-733`)

**The one canonical invariant the corpus proves:** `confirm == auto + checkpoints`. The create family states this in prose (`create_command_auto.yaml:419` "confirm must equal auto plus checkpoints") and the two files demonstrate it: `_auto.yaml` has `operating_mode.workflow_execution: autonomous` / `approvals: none` and NO `checkpoint:` blocks in its steps (`:28-34`, `:267-260`); `_confirm.yaml` has `workflow_execution: interactive` / `approvals: step_by_step`, an added `checkpoint_options:` node (`_confirm.yaml:185-194`), and a `checkpoint:` block on every workflow step (`_confirm.yaml:301-309`, `377-385`, `429-437`, `456-464`, `485-493`, `533-539`), plus `interactive_execution` replacing `autonomous_execution` (`_confirm.yaml:582` vs `auto:638`).

The problem: **this schema and the `confirm==auto+checkpoints` invariant are nowhere captured as a machine-checkable contract.** The canon (`command_router_template.md`) describes the router skeleton but says nothing about the YAML's internal node schema; the validator does not parse these nodes. So the strongest, most-repeated structure in the system has no machine definition — exactly what 012 AL-row identified as "build on it" material that still lacks a contract.

[SOURCE: .opencode/commands/create/assets/create_command_auto.yaml:8-10,28-38,184-195,200-261,600-733]
[SOURCE: .opencode/commands/create/assets/create_command_confirm.yaml:29-38,185-194,301-309,582]
[SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md (no YAML-node schema section)]

**Candidate delta D1.1 (schema capture):** Define a versioned `command-workflow.schema.yaml` under `create-command/assets/` enumerating the shared top-level nodes (identity, operating_mode, user_inputs/field_handling/input_contract, context_loading, workflow_enforcement/gate_logic, workflow steps, rules) and the `mode_delta` rule: a `_confirm.yaml` MUST equal its `_auto.yaml` plus (a) `operating_mode` execution/approvals fields and (b) per-step `checkpoint:` blocks. Target: new `create-command/assets/command-workflow.schema.yaml` + `create-command/SKILL.md` Step 10 reference. Acceptance criterion: a fixture `_confirm.yaml` that drops a step present in its `_auto.yaml` fails schema validation; a correctly-paired triad passes.

### F1.2 — Placeholder conventions are consistent but uncanonized (`[PLACEHOLDER]` / `FROM <source>`)
The workflow YAMLs use a stable placeholder grammar inside `user_inputs` and step `outputs`: bracketed uppercase tokens (`[COMMAND_INVOCATION]`, `[COMMAND_PATH]`, `[SPEC_PATH]` — `create_command_auto.yaml:103-122`) and a provenance suffix (`FROM UNIFIED SETUP PHASE (Q1 choice A/B/C/D)`, `:117`). Bindings flow setup-phase → `user_inputs` → step `activities` → `outputs` (named tokens like `command_invocation_validated`, `:281`). This is a clean, repeatable contract — but it lives only in the assets, never named in canon, so a new family author has no rule to follow and must sibling-copy (the root cause 012 identified for the `$ARGUMENTS` echo drift). The `create_command_auto.yaml:135` `note: "Creates router .md plus _auto.yaml, _confirm.yaml, and _presentation.txt assets"` is the only place the asset triad is named inside a YAML.

[SOURCE: .opencode/commands/create/assets/create_command_auto.yaml:103-151,281]
[SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md (no placeholder-grammar section)]

**Candidate delta D1.2:** Canonize the placeholder grammar in `create-command/SKILL.md` Step 10 (workflow-YAML authoring): bracketed-uppercase `[TOKEN]` for inputs, `FROM <phase/choice>` provenance suffix, and named `snake_case` output tokens that downstream steps consume. Acceptance: a new workflow-YAML family authors its `user_inputs`/`outputs` from the canon alone without sibling-copy; a placeholder lacking a `FROM` provenance warns.

### F1.3 — OWNED ASSETS table schema diverges 20-vs-15 across the corpus
The router's OWNED ASSETS table — the single strongest, most-consistent layer per 012 — is rendered in TWO incompatible shapes:
- **2-column `| Purpose | Asset |`** — matches the canon template (`command_router_template.md:63-67`). Used by deep, doctor, speckit, and the canon itself: **20 routers**.
- **3-column `| Asset | Path | Purpose |`** — used by every `create/*` router and memory: **15 routers** (`create/command.md:20`, `create/agent.md:20`, … `memory/search.md:34`).

So the create family (the family the create-command canon *generates*) disagrees with the create-command canon's own template on the table shape. Because the validator (`validate_document.py` / `template_rules.json`) only checks that a table *exists* under an OWNED ASSETS heading (router detection per `template_rules.json:109-133`, per 012 RQ3), both shapes pass. This is prose-vs-wiring drift inside the strongest layer: the contract has no single table schema, so the renderer cannot produce one canonical table and a future generator will have to pick.

[SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:63-67]
[SOURCE: .opencode/commands/create/command.md:20, .opencode/commands/doctor/update.md:20, .opencode/commands/deep/research.md:122]
[SOURCE: corpus census 2026-07-16 — 20× `| Purpose | Asset |`, 15× `| Asset | Path | Purpose |`]

**Candidate delta D1.3 (table schema unification):** Pick ONE OWNED ASSETS table schema in the contract (recommend the canon's 2-col `| Purpose | Asset |` for router-thinness, or a standardized 3-col with fixed column order) and record it in `command_router_template.md` §2 + the new contract. Acceptance: every router's OWNED ASSETS table matches the single schema; the generator renders it from the contract's `owned_assets[]` list; a mutation fixture with the wrong column order fails.

### F1.4 — EXECUTION TARGETS is rendered as a table in deep but a prose list in create
Even within the workflow-YAML-backed topology, the EXECUTION TARGETS section diverges in *shape*: `deep/research.md:159-164` renders it as a `| Mode | Workflow |` table; `create/command.md:31-40` renders it as a numbered prose list ("4. Load exactly one workflow YAML: `:auto` -> … `:confirm` or omitted mode -> …"). Both advertise `:auto`/`:confirm` and both resolve correctly, but the mode→target mapping is structurally different (declarative table vs imperative list). The canon template shows a table (`command_router_template.md:82-85`), so create diverges from canon here too. This matters for RQ3's completeness check: a machine must locate the mode→target mapping, and a prose list is harder to parse reliably than a table.

[SOURCE: .opencode/commands/deep/research.md:159-164]
[SOURCE: .opencode/commands/create/command.md:31-40]
[SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:82-85]

**Candidate delta D1.4:** Standardize EXECUTION TARGETS as a `| Mode | Target |` table in the contract (matching the canon template), with the mode→asset binding as the machine-readable source for the RQ3 completeness check. Acceptance: every workflow-YAML router exposes its mode→target map as a table; the completeness check parses the table, not prose.

### F1.5 — What the machine-readable contract must capture (RQ1 synthesis)
Synthesizing F1.1–F1.4, a command contract that makes prose and YAML unable to drift must capture, per command: (1) **identity** (ns/action, topology class); (2) **owned_assets[]** with kind ∈ {presentation, workflow_auto, workflow_confirm, workflow_single, route_manifest, route_yaml, script}; (3) **mode_matrix** (declared modes, default-mode policy, each mode's target asset — feeds RQ3); (4) **presentation_owner + exceptions[]** (feeds RQ2); (5) **workflow_schema_ref** (the `command-workflow.schema.yaml` from D1.1, pinning node set + `confirm==auto+checkpoints`); (6) **placeholder_grammar** (D1.2). The router's OWNED ASSETS / EXECUTION TARGETS / PRESENTATION BOUNDARY sections become *rendered projections* of this contract (RQ5), not hand-authored prose — which is the mechanism that closes the drift. None of these six fields exist as typed data today; they exist only as scattered prose.

[SOURCE: 012/research/research.md:117-143 (AL1-AL6 + build-on-triad thesis)]
[SOURCE: corpus-wide observation across create/command.md, deep/research.md, doctor/update.md, memory/search.md]

**Candidate delta D1.5 (contract fields):** This is the spine delta — the contract file (e.g. `command.contract.yaml` sidecar or frontmatter block) carries `owned_assets[]`, `mode_matrix`, `presentation.{owner, exceptions[]}`, `workflow_schema_ref`. Target: defined in `create-command/SKILL.md` Step 3 (contract) + `command_router_template.md`. Acceptance: the OWNED ASSETS table, EXECUTION TARGETS table, and PRESENTATION BOUNDARY can all be regenerated from the contract fields alone (no hand-maintained prose); a drift between contract and rendered section fails a check.

## Sources Consulted
- Workflow YAMLs: `create_command_auto.yaml` (full), `create_command_confirm.yaml` (full); census of all 28 triad YAMLs.
- Canon: `command_router_template.md` (full skeleton + variants).
- Corpus routers: `create/command.md`, `deep/research.md`, `doctor/update.md`, `memory/search.md`.
- Grounding: `012/research/research.md:117-143`.

## Assessment
- **newInfoRatio: 1.0** — first pass on RQ1; the schema invariant (`confirm==auto+checkpoints`), the placeholder grammar, and the 20/15 + table/list divergences are all net-new to this packet.
- **Novelty justification:** Establishes that the strongest layer (the triad) has a stable, observable schema that is *completely undefined as a contract* — so the "build on it" instruction has no machine foundation yet. The 20-vs-15 OWNED ASSETS split and the table-vs-list EXECUTION TARGETS split are newly-measured corpus divergences inside the layer 012 called strongest.
- **Confidence:** high on F1.1/F1.3/F1.4 (directly observed across the corpus + canon); high on F1.2 (consistent grammar, canon-silence is the gap); F1.5 is a synthesis (medium-high, to be hardened by RQ2–RQ5).
- **Partial RQ1 answer:** the schema exists and is stable; the divergences are real and measurable; the contract-field set is proposed. Full RQ1 close lands once RQ2–RQ5 confirm presentation-ownership and mode-matrix field shapes.

## Reflection
- **What worked:** Diffing the reference `_auto.yaml` against its `_confirm.yaml` line-by-line isolated the exact delta (checkpoints + operating_mode fields) that defines the topology — the schema fell out of the comparison.
- **What failed / ruled out:** Reading the canon template first was misleading — it describes the router, not the YAML, so the YAML schema had to be *induced from the corpus*. The canon is not the source of truth for YAML-node shape.
- **Ruled out:** "Rewrite the YAMLs to a new schema" — the triad is validated-good; capture the existing schema, do not redesign it.
- **Recommended next focus (RQ2):** presentation ownership + the typed inline-exception — the contract's `presentation.owner` + `presentation.exceptions[]` fields, and why a blunt leak-blocker (adapter S5) cannot distinguish `memory/search`'s legitimate inline "hard render reminder" from a real leak.
