# Iteration 2: RQ2 — per-family conformance divergences (wholesale vs one-off)

## Focus
Sweep all six command families plus the three standalone commands to classify each RQ1 defect class (F1.1–F1.6) as **recurring canon gap** (a canon change closes it wholesale) versus **one-off authoring error** (a per-file fix). The verdict drives remediation priority: wholesale classes get canon+validator deltas; one-off classes get per-file tickets.

## Findings

### Recurrence matrix (measured across the corpus)

| Defect class | Families / commands affected | Count | Verdict |
|---|---|---|---|
| F1.1 missing mandatory gate (required `<arg>`, no gate marker) | create(11), deep(8), speckit(4), memory(4), design(5), doctor(2), standalones(3) | **35/~37** | **WHOLESALE** |
| F1.3 argument-hint over any sane length | deep/review 551, deep/research ~750, speckit/plan 511, deep/alignment 471, memory/manage 363, speckit/complete 344, deep/ai-council 336, + create/* 190–232 | **~20** | **WHOLESALE** |
| F1.6 ROUTER CONTRACT content shape undefined | memory/save (substantive), doctor/update (minimal), speckit/plan (canonical) — divergent | variable | **WHOLESALE** |
| F1.4 route-manifest topology undocumented | doctor (whole family via `_routes.yaml`) | 1 family | **WHOLESALE** (canon taxonomy gap) |
| F1.2 bare MCP tool tokens in allowed-tools | goal_opencode (`mk_goal, mk_goal_status`), speckit/plan (`mk_goal, mk_goal_status`) | 2 | **borderline → leaning one-off** |
| F1.5 `skill_agent:` loader-gating frontmatter | doctor/update, doctor/speckit, doctor/mcp | 3 | **canon gap, currently isolated** |

Evidence for the headline counts:
- **F1.1 universality:** a corpus scan for commands whose `argument-hint` contains `<…>` but which lack any `MANDATORY FIRST ACTION`/`MANDATORY PHASES`/`DO NOT SKIP` marker returned 35 hits spanning every family — e.g. `.opencode/commands/speckit/plan.md:3`, `.opencode/commands/deep/research.md:2`, `.opencode/commands/memory/save.md:3`, all `.opencode/commands/create/*.md`, all `.opencode/commands/design/*.md`. Only `doctor/update.md` is legitimately exempt (its `argument-hint` is all-optional flags: `update.md:3`).
- **F1.3 distribution:** argument-hint char lengths measured; the top offenders are deep/* (543–750) and speckit/plan (511), all >3× any reasonable ceiling.
- **Router core conformance (the good news):** all 35 namespace commands carry both `OWNED ASSETS` and `PRESENTATION BOUNDARY` (create 11/11, design 5/5, speckit 4/4, memory 4/4, doctor 3/3, deep 8/8). The blocking router core is the one place canon+validator+corpus agree.

[SOURCE: corpus scan argument-hint+gate markers, 2026-07-16]
[SOURCE: .opencode/commands/deep/research.md:2-3]
[SOURCE: .opencode/commands/doctor/update.md:3]
[SOURCE: .opencode/commands/doctor/_routes.yaml:1-30]

### F2.1 — The mandatory-gate rule is the wrong abstraction for router commands (key RQ2 insight)
F1.1 is not 35 authoring errors; it is a **canon rule that does not fit the router topology**, uniformly worked around. Router commands delegate user-input collection to the presentation asset's startup prompt (`.opencode/commands/memory/save.md:14-16` "use the presentation contract's startup prompt to ask"; `.opencode/commands/speckit/plan.md:35` "use the presentation contract's startup prompt to ask for execution mode"; `.opencode/commands/deep/research.md` ROUTER CONTRACT → presentation-first loading). The create-command gate pattern (SKILL.md:219-240) was designed for **simple/workflow** commands that own their input collection inline; applying it verbatim to a thin router that must "load the presentation contract before showing any startup question" (command_router_template.md:57) is self-contradictory — the gate says "ask now, inline" while the router contract says "ask only via the presentation asset, after loading it."

So the wholesale fix is **not** "add inline gates to 35 routers". It is to canonize the **router-gate alternative**: a router command satisfies the mandatory-gate obligation when (a) it carries the required arg in `argument-hint`, AND (b) its PRESENTATION BOUNDARY declares the startup-question/input-collection surface, AND (c) its MODE ROUTING states the empty-`$ARGUMENTS` resolution path. This is what the corpus already does in prose; the canon just never names it as a compliant gate form.

[SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:219-240]
[SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:53-58]
[SOURCE: .opencode/commands/memory/save.md:14-16,68-76]

**Candidate delta C2.1:** Canon: extend SKILL.md Step 7 with a "Router gate alternative" subsection and a parallel entry in `command_router_template.md` MODE ROUTING stating the three compliance conditions above. Validator: add a check that, for router commands, accepts (presentation-boundary-declares-input-surface + mode-routing-states-empty-arg-path) as satisfying the gate obligation in lieu of an inline marker. Acceptance: the 35 router commands are re-classified as gate-compliant without prose edits, while a router that drops the presentation input-surface declaration becomes non-compliant.

### F2.2 — Standalone commands form an unmeasured conformance class
The three root-level commands `.opencode/commands/agent_router.md`, `goal_opencode.md`, `prompt-improve.md` are neither namespace routers nor obviously simple/workflow commands. `goal_opencode.md:4` ships bare `mk_goal, mk_goal_status` and a required-looking arg surface; `agent_router.md` is a router-style dispatcher outside any namespace. The 066 census counts "36 baseline, 37 after the launcher ships" (066/spec.md:184), but the create-command canon's namespace/router taxonomy does not give standalone commands a first-class slot, so their conformance is ad hoc. This is a recurring *class* gap (every standalone command hits it), hence wholesale.

[SOURCE: .opencode/commands/goal_opencode.md:4]
[SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/spec.md:184]

**Candidate delta C2.2:** Canon: add a "Standalone command" note to create-command SKILL.md Step 2/Step 4 stating that root-level `/<command>.md` files follow the same frontmatter + (router OR simple) rules as namespace commands, with the namespace-prefix dropped. Validator: ensure `validate_document.py --type command` already covers them by path (it does, via `:144-145`), and add the F1.1/F1.2 checks so standalones are measured. Acceptance: agent_router/goal_opencode/prompt-improve are classified and measured; goal_opencode's bare `mk_goal` flagged.

### F2.3 — doctor family: one topology, three undocumented mechanisms
The doctor family simultaneously uses (a) a `_routes.yaml` route manifest, (b) per-route `.yaml` assets under `doctor/assets/`, and (c) the `<!-- skill_agent: system-spec-kit -->` loader-gating directive (`update.md:6`). None of these three mechanisms are in the create-command canon. Because all three cluster in one family, a single canon addition — the **route-manifest argv-router topology** (F1.4) plus an optional loader-gating field (F1.5) — closes the whole family at once. This confirms F1.4/F1.5 as wholesale, not per-file.

[SOURCE: .opencode/commands/doctor/_routes.yaml:1-30]
[SOURCE: .opencode/commands/doctor/update.md:6,23]
[SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:108-116]

**Candidate delta C2.3:** = C1.4 + C1.5, now justified as wholesale (closes the entire doctor family). Acceptance: a doctor-style command can be authored canonically; the three mechanisms are citable.

## Sources Consulted
- Corpus scans: argument-hint lengths; gate-marker presence; router-core marker counts per family; standalone command inventory.
- Re-read: deep/research.md:1-20; doctor/update.md; doctor/_routes.yaml; memory/save.md; speckit/plan.md.
- Canon: SKILL.md:219-240; command_router_template.md:53-58,108-116.

## Assessment
- **newInfoRatio: 0.7** — RQ2 re-frames RQ1's per-gap findings into a wholesale-vs-one-off priority map; the router-gate-alternative insight (F2.1) and the standalone-class gap (F2.2) are net-new reframings, while the matrix itself consolidates known defects.
- **Novelty justification:** The decisive new signal is that the "35 missing gates" is one canon-shape problem, not 35 errors — which inverts the remediation from "add 35 gates" to "canonize the router-gate alternative." That changes the backlog shape.
- **Confidence:** high on F2.1/F2.3 (measured + mechanism-clustered); medium on F2.2 (standalone class identified; full per-file audit of the 3 standalones deferred).
- **Partial RQ2 answer:** four of six RQ1 classes are wholesale (F1.1, F1.3, F1.4, F1.6), one is borderline-one-off (F1.2), one is canon-gap-but-isolated (F1.5). The doctor family is a single wholesale bundle (F2.3).

## Reflection
- **What worked:** Quantifying recurrence (counts) before judging wholesale-vs-one-off — the 35/35 router-core conformance vs 0/35 gate conformance contrast is the load-bearing evidence.
- **What failed / ruled out:** The initial family-loop shell had a path-quoting bug (produced `0/0`); re-run with `-exec grep` fixed it. No research cost beyond one extra call.
- **Ruled out:** "Add inline gates to every router" — contradicted by the router-contract/presentation-first invariant; ruled out in favor of C2.1.
- **Recommended next focus (RQ3):** Now that wholesale classes are known, enumerate the concrete defects `validate_document.py --type command` + the 066 benchmark fail to catch (the gate check, the FQ-tool check, the hint-budget check, the presentation-leak/router-overclaim check, the topology-classification check) and specify each as a deterministic, fixture-able check with a clean-control and a defect-control.
