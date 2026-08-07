# Iteration 003 — KQ3: COMMANDS surface DQ automation

**Focus:** Argument-grammar/mode validation, router-manifest contract tests, mutation_class discipline, command-doc ↔ skill consistency, YAML-workflow schema validation across the 28 command docs + ~30 workflow YAMLs.

## Findings

### F3.1 — KEYSTONE: an 8-assertion router-contract validator already exists — scoped to ONE command
`commands/doctor/scripts/route-validate.py` is a "Canonical-manifest CI assertion for the /doctor router" that validates `_routes.yaml` against **eight** contract checks: (A) YAML parse + schema_version, (B) routes-list integrity + required keys, (C) no duplicate target names, (D) **every route's YAML asset exists in assets/**, (E) **mutation_class ∈ {read-only, add-only, mutates}**, (F) **each route's `mcp_tools` ⊆ the router frontmatter `allowed-tools` union**, (G) every route has ≥1 trigger phrase, (H) flag-name collision detection. Exit 0/1. `[SOURCE: route-validate.py:1-22]`
- This is the command-surface twin of dq-probe's "DQI scorer exists but unwired" — except here a **complete router-contract validator** is built and ships, but only `/doctor` has both a `_routes.yaml` manifest and this validator. The other 27 command docs (speckit, create, deep, memory, prompt, agent_router) get **none** of A–H. `[SOURCE: find _routes.yaml → 1 hit (doctor only)]`
- **Granular feature (net-new, reuse-first):** generalize route-validate's 8 assertions into a **per-command router-contract gate**. Assertions D/E/F are the highest-value and fully mechanical: D catches a mode that names an owned YAML asset that doesn't exist; E enforces the Gate-3 mutation-class enum the root CLAUDE.md mandates for *all* router commands but only doctor machine-checks; F catches a command claiming an MCP tool its frontmatter never granted (a real privilege-drift defect a per-file scorer cannot see).

### F3.2 — Argument-grammar is a free-text frontmatter string with no parser
`argument-hint` is an unparsed prose string. `speckit/plan.md` declares modes `:auto|:confirm|:with-context|:with-phases` plus ~14 flags in one ~700-char line; nothing asserts those declared modes map to real handlers or owned YAML assets. `[SOURCE: speckit/plan.md:2-3]` The create family ships paired `*_auto.yaml`/`*_confirm.yaml` assets (e.g. `create_sk_skill_auto.yaml` + `create_sk_skill_confirm.yaml`), so a **declared-mode ⇄ owned-asset presence check** is purely mechanical. `[SOURCE: create/assets/ pairing census]`
- **Granular feature:** parse `argument-hint`, extract declared `:modes` and `--flags`, and assert (a) each mode has a matching owned-asset YAML, (b) no orphan asset (a `*_confirm.yaml` with no `:confirm` in the hint), (c) flag names don't collide with mode tokens. This is assertion-D/H from F3.1 generalized to the argument grammar.

### F3.3 — ~30 workflow YAMLs own behavior and have NO schema validator
The command docs are explicitly "thin routers" — "Agent dispatch, workflow steps, and artifact-writing behavior are owned by the workflow YAML assets" (`speckit/plan.md:11-13`). There are ~30 such YAMLs (`create/assets/*`, `doctor/assets/doctor_*`). A grep for any workflow-YAML schema/zod validator returns **empty**. `[SOURCE: grep "workflow.*schema|validate.*workflow.yaml" commands/ → 0 hits]` route-validate assertion D only checks the asset *exists*, never its internal shape (steps, phases, node names, mode field).
- **Granular feature:** a workflow-YAML schema validator (the command-surface analogue of spec-kit's zod `graph-metadata`/`description` schemas) asserting required top-level keys (meta/mode/steps), that step references resolve, and that the declared mode matches the filename suffix (`*_auto.yaml` declares `mode: auto`). Bypasses the truncation floor (these are authoring-logic artifacts, never retrieval results).

### F3.4 — mutation_class discipline is machine-checked on exactly TWO narrow surfaces
`check-mcp-mutation-class.sh` guards `install_script_mutation_class`/`doctor_script_mutation_class` in the **MCP server manifest**, and route-validate assertion E guards mutation_class in the **doctor `_routes.yaml`**. `[SOURCE: check-mcp-mutation-class.sh:3,73-83; route-validate.py:E]` Every other command that mutates files (speckit, create, memory) declares its mutation behavior in prose only.
- **Granular feature:** extend the mutation_class enum check to every command's route/mode table, so the Gate-3 "read-only / add-only / mutates" classification the root doc requires becomes machine-enforced corpus-wide, not doctor-only.

## Dead Ends / Ruled Out
- **Assuming command routing is already broadly validated** — route-validate is real but doctor-scoped; 27/28 command docs are ungated. `[SOURCE: find _routes.yaml → 1]`
- **Expecting a workflow-YAML schema gate** — none exists; asset *existence* is the only structural check. `[SOURCE: empty grep]`

## Assessment
- **newInfoRatio:** 0.75 — the doctor-only 8-assertion validator is the command-surface keystone (generalize, don't build); the missing workflow-YAML schema gate and corpus-wide mutation_class lint are net-new and specific.
- **Novelty justification:** moves dq-probe's one-line "command docs get nothing" into four named, file:line-grounded primitives, three of which reuse route-validate's shipped assertions.
- Questions answered: KQ3.
