# Iteration 3: RQ3 — validator + benchmark coverage defects and the checks that catch them

## Focus
Enumerate the concrete command-surface defects that `validate_document.py --type command` and the 066 `sk-doc-command.cjs` deterministic adapter (S1–S5) **fail** to catch, then specify each as a deterministic, fixture-able check with a clean-control and a defect-control. Reconcile against what the adapter *does* check so no proposed check duplicates an existing one.

## Findings

### What the two existing instruments already check (scope fence)
- `validate_document.py --type command` (`validate_document.py:417-515`, rules `template_rules.json:109-198`): section presence; router detection + blocking core (`owned_assets`+`presentation_boundary`); recommended router sections as warnings; synonym alias-normalization (warnings). **It performs zero frontmatter checks** — description, argument-hint, and allowed-tools are not evaluated by `--type command` at all.
- `quick_validate.py:70-204`: a *separate* frontmatter validator (description single-line/no-`<>`/length soft-target 110 for commands; allowed-tools *array format*). **Not wired into `--type command`** — it is a standalone skill-frontmatter validator that happens to also handle commands by path.
- `sk-doc-command.cjs` (066 adapter, lines 86-487): S1 mirror identity, S2 target reachability, S3 route-graph integrity (subaction-target-mismatch/route-cycle/topology-unclassified), S4 capability-undeclared (declared `allowed-tools` vs used, line 315) + destructive-without-confirmation, S5 presentation-asset-leaked/duplicated. By 066 design, S5 scores **only explicit duplicated display blocks or exact asset leakage — natural-router prose is explicitly NOT regex-scored** (066/spec.md:158).

### F3.1 — Defect: required-arg command with no gate obligation satisfied (wholesale, uncaught)
**Defect control:** `.opencode/commands/memory/save.md` — `argument-hint: "<spec-folder>"`, no inline gate, and no declared presentation input-surface obligation. **Clean control:** a router that declares the input surface in PRESENTATION BOUNDARY + the empty-`$ARGUMENTS` path in MODE ROUTING. **What misses it today:** `validate_document.py` (no gate logic), `quick_validate.py` (no hint→gate coupling), adapter S4 (capability only). This is the F1.1/F2.1 class.

**Candidate check C3.1:** A `gate_obligation` check with two compliant forms: (a) inline `MANDATORY`/`PHASE` marker before first `## ` (simple/workflow commands), OR (b) for routers, a PRESENTATION BOUNDARY that declares an input-collection surface AND a MODE ROUTING step handling empty `$ARGUMENTS`. Block when neither form is present and `argument-hint` carries `<…>` (and no `render-command-contract` marker). Acceptance: defect-control `memory/save.md` (current shape, before any canon fix) flags P1; clean control exits 0.

[SOURCE: .opencode/skills/sk-doc/shared/scripts/validate_document.py:417-515]
[SOURCE: .opencode/skills/sk-doc/shared/scripts/quick_validate.py:186-204]
[SOURCE: .opencode/commands/memory/save.md:3,68-76]

### F3.2 — Defect: bare MCP tool tokens in allowed-tools (uncaught)
**Defect control:** `.opencode/commands/goal_opencode.md:4` `allowed-tools: mk_goal, mk_goal_status`. **Clean control:** `.opencode/commands/memory/save.md:4` (all `mcp__mk_spec_memory__*`). **What misses it today:** `quick_validate.py:196-202` checks only array format, not the FQ/MCP distinction; adapter S4 reads `allowed-tools` for capability-vs-used but does not validate token form.

**Candidate check C3.2:** A `allowed_tools_qualified` check: maintain a known-core-tools allowlist `{Read,Write,Edit,Bash,Grep,Glob,Task,TodoWrite,WebFetch,WebSearch,…}`; every other token must match `mcp__<server>__<tool>`. Severity P1 (correctness/least-privilege, since bare tokens may fail to bind at runtime). Acceptance: `goal_opencode.md` and `speckit/plan.md:4` flag until `mk_goal*` qualified; memory/save exits 0.

[SOURCE: .opencode/skills/sk-doc/shared/scripts/quick_validate.py:196-202]
[SOURCE: .opencode/commands/goal_opencode.md:4]

### F3.3 — Defect: argument-hint budget blown (wholesale, uncaught)
**Defect control:** `.opencode/commands/deep/research.md:2` (~750 chars), `.opencode/commands/speckit/plan.md:3` (511 chars). **Clean control:** a hint ≤140 chars that summarizes modes and defers flag enumeration to the router body. **What misses it today:** nobody budgets argument-hint; only `description` is budgeted (quick_validate soft-target 110). The 066 benchmark flags "fat" commands behaviorally but has no structural rule.

**Candidate check C3.3:** A `argument_hint_budget` check: warn (P2) when `argument-hint` > 140 chars; advise moving flag enumeration to a MODE ROUTING / EXECUTION TARGETS sub-table. Non-blocking to permit legitimate long hints, but visible. Acceptance: the 20 over-budget commands emit warnings; a ≤140 hint exits clean.

[SOURCE: .opencode/commands/deep/research.md:2]
[SOURCE: .opencode/commands/speckit/plan.md:3]

### F3.4 — Defect: router-overclaim / presentation-leak in natural prose (uncaught by design)
**Defect control:** a router whose ROUTER CONTRACT contains dashboard/prompt/result-template wording that belongs in the presentation asset (the F1.6 class; e.g. `.opencode/commands/memory/save.md:12-28` places Inputs/Outputs/Guardrails in ROUTER CONTRACT — borderline, since some is routing not display). **Clean control:** a router whose ROUTER CONTRACT holds only the two invariant sentences. **What misses it today:** adapter S5 catches *explicit duplicated display blocks* only, and 066 explicitly excludes natural prose (spec.md:158); `validate_document.py` has no presentation-leak check at all.

**Candidate check C3.4:** A `router_contract_prose_boundary` check: warn (P2) when ROUTER CONTRACT exceeds a small line budget OR contains presentation-vocabulary tokens (`dashboard`, `result template`, `next-step`, `startup question`) beyond the invariant sentences. Pair with the canon decision in C1.6 (pick shape (a): keep ROUTER CONTRACT thin). Acceptance: a router leaking a result-template block warns; the canonical thin router exits clean. Note the intentional false-positive boundary: this is heuristic prose detection, so it stays P2/non-blocking and must not be promoted to blocking without a curated allowlist.

[SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/spec.md:158]
[SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:460-487]
[SOURCE: .opencode/commands/memory/save.md:12-28]

### F3.5 — Defect: unreconciled topology taxonomy (structural meta-gap)
**Defect control:** a command shaped like doctor (route-manifest argv-router) cannot be classified by the create-command canon's 3-variant taxonomy, and the 066 contract uses a *different* 4-topology taxonomy (workflow router, subaction router, direct-tool/plugin router, monolithic — `000/spec.md:56`). **Clean control:** a command classifiable under both. **What misses it today:** adapter S3 emits `CMD-S3-TOPOLOGY-UNCLASSIFIED` for shapes outside the 066 taxonomy, but neither instrument reconciles the canon's variant taxonomy with the 066 topology taxonomy, so an author following the canon can produce a command the benchmark flags unclassified (or vice versa).

**Candidate check C3.5:** Not a runtime check but a **canon-reconciliation** deliverable: a single topology table mapping {canon command-types} × {canon router-variants} × {066 topologies} with a one-to-one rule and a fail-closed unclassified bucket shared by both. Land it in create-command SKILL.md Step 4/Step 11 and reference it from the 066 contract. Acceptance: every live command classifies under both vocabularies consistently; the doctor family maps to "subaction router" (066) ≈ "route-manifest argv-router" (canon).

[SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/000-command-benchmark-contract/spec.md:56]
[SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:139-153,318-351]

### F3.6 — Structural meta-defect: validator frontmatter blind spot (the root cause)
The deepest RQ3 finding: **`validate_document.py --type command` does not run any frontmatter validation.** The frontmatter logic lives in `quick_validate.py`, which is a separate entrypoint invoked for skills/commands independently and is not composed into `--type command`. Consequently every canon frontmatter rule (description, argument-hint grammar, allowed-tools) is structurally unenforceable through the canonical `--type command` path, regardless of whether the rule is written. This is why F1.1/F1.2/F1.3 and C3.1/C3.2/C3.3 all exist: the checks have nowhere to live on the canonical path.

**Candidate check C3.6 (architectural):** Compose frontmatter validation into the command type: either (a) `validate_document.py --type command` calls `quick_validate.py`'s frontmatter functions as a sub-step, or (b) move the frontmatter rules into `template_rules.json` command block + a frontmatter pass in `validate_document.py`. This is the enabling change that makes C3.1/C3.2/C3.3/C3.4 implementable on the canonical path. Acceptance: `validate_document.py <cmd>.md --type command` emits frontmatter findings (description/gate/tools) today it silently passes; a command with a 2000-char description fails the hard cap (1536, quick_validate.py:52) on the canonical path.

[SOURCE: .opencode/skills/sk-doc/shared/scripts/validate_document.py:417-515]
[SOURCE: .opencode/skills/sk-doc/shared/scripts/quick_validate.py:43-55,186-204]

## Sources Consulted
- Validator: validate_document.py:417-515; quick_validate.py:43-55,70-204; template_rules.json:109-198.
- Adapter: sk-doc-command.cjs:86-487 (S1–S5 rule map, capability line 315, presentation 460-487).
- 066 contract: 000/spec.md:56; parent spec.md:158 (prose-exclusion), :73-74 (S1–S5 definitions).
- Corpus defect controls: memory/save.md, goal_opencode.md, deep/research.md, speckit/plan.md.

## Assessment
- **newInfoRatio: 0.75** — RQ3 introduces the validator-architecture root cause (F3.6) and the topology-reconciliation meta-gap (F3.5) as net-new; C3.1–C3.4 operationalize RQ1/RQ2 classes into fixture-able checks with clean/defect controls.
- **Novelty justification:** The decisive new insight is F3.6: the frontmatter blind spot is structural, so all canon frontmatter rules are dead letters on the canonical path — fixing one rule at a time would not help; the composition change is the prerequisite.
- **Confidence:** high on F3.1/F3.2/F3.3/F3.6 (directly verified in source); medium on F3.4 (heuristic, intentionally P2); medium-high on F3.5 (taxonomy mismatch confirmed across two docs).
- **Partial RQ3 answer:** six deterministic checks specified (C3.1–C3.5) plus one architectural enabler (C3.6), each with clean/defect controls; none duplicate an existing S1–S5 check.

## Reflection
- **What worked:** Reading the adapter's S1–S5 rule map (sk-doc-command.cjs:86-487) before proposing checks — prevented proposing a presentation-leak check that duplicates S5, and pinned the prose-exclusion boundary (spec.md:158) so C3.4 is correctly scoped as P2 heuristic.
- **What failed / ruled out:** Initially considered proposing C3.4 as blocking; corrected to P2 after reading 066's explicit prose-exclusion design intent — promoting it would fight the benchmark's own scope contract.
- **Ruled out:** "Add a regex presentation-leak blocker to the adapter" — contradicts 066/spec.md:158; keep prose detection in the lighter `validate_document` layer as P2.
- **Recommended next focus (RQ4):** Router/dispatch-logic improvements — argument-hint grammar, `$ARGUMENTS`/`$1..$N` handling, `:auto`/`:confirm` resolution completeness, and dual-runtime (opencode/codex/claude) parity — where the canon is silent and the corpus has drift (raw `$ARGUMENTS` echo, undeclared mode targets).
