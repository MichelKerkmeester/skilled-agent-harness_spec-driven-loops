# Iteration 1: RQ1 — create-command canon completeness gaps

## Focus
Identify gaps in the create-command authoring canon (SKILL.md + `command_router_template.md` + `command_template.md`) that let non-conformant commands author "correctly" against an incomplete rule — i.e. canon rules the validator does not enforce, and validator rules the canon does not state. Ground each gap in file:line evidence and propose a candidate delta with acceptance criterion.

## Findings

### F1.1 — Mandatory input gate is a canon RULE but never a validator CHECK (canon↔validator drift)
The canon makes the mandatory gate a hard rule: create-command SKILL.md Step 7 (`.opencode/skills/sk-doc/create-command/SKILL.md:219-240`) requires a gate "immediately after frontmatter" whenever `argument-hint` contains any required `<argument>`, and Step 13 (line 376) restates it as a delivery check. Yet `validate_document.py --type command` validates only section presence (`validate_document.py:417-515`); the command rules in `template_rules.json:109-133` have no gate rule. Frontmatter/argument-hint live in the separate `quick_validate.py:70-204`, which checks description single-line + allowed-tools array form but has **no argument-hint→gate coupling**.

Evidence of a command passing validation while violating this rule: `.opencode/commands/memory/save.md:3` declares `argument-hint: "<spec-folder>"` (a required angle-bracket arg) but the file has **no mandatory gate** after frontmatter (jumps straight to `# /memory:save` at line 7). Per canon Step 7 this is non-conformant; per `validate_document.py --type command` it is clean.

[SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:219-240,376]
[SOURCE: .opencode/skills/sk-doc/shared/scripts/validate_document.py:417-515]
[SOURCE: .opencode/skills/sk-doc/shared/scripts/quick_validate.py:186-204]
[SOURCE: .opencode/commands/memory/save.md:3-7]

**Candidate delta C1.1:** Add a deterministic "argument-hint-required-gate" check. Target: `template_rules.json` command block gains a `requiredGateRule`, and `validate_document.py` gains a function that, when `argument-hint` contains `<…>` and no `render-command-contract` marker is present, asserts a blocking marker (`# 🚨 MANDATORY FIRST ACTION` or a `MANDATORY`/`PHASE` semantic marker) appears before the first `## ` section. Acceptance: `validate_document.py memory/save.md --type command` exits non-zero until a gate is added; a correctly-gated command exits 0.

### F1.2 — allowed-tools fully-qualified rule is stated but unenforced
Canon SKILL.md Step 6 (`.opencode/skills/sk-doc/create-command/SKILL.md:216-218`) and `command_template.md:828` require MCP tools in `allowed-tools` to use the `mcp__<server>__<tool>` form; bare IDs belong in prose only. The validator only checks allowed-tools *array format* (`quick_validate.py:196-202`), never the FQ/MCP distinction. Commands leak bare MCP tool IDs: `.opencode/commands/goal_opencode.md:4` lists `mk_goal, mk_goal_status` (both MCP-server tools, not core tools), and `.opencode/commands/speckit/plan.md:4` appends bare `mk_goal, mk_goal_status` after a correct `mcp__…` list.

[SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:216-218]
[SOURCE: .opencode/skills/sk-doc/shared/scripts/quick_validate.py:196-202]
[SOURCE: .opencode/commands/goal_opencode.md:4]
[SOURCE: .opencode/commands/speckit/plan.md:4]

**Candidate delta C1.2:** Add a `allowed_tools_mcp_qualified` check. Target: `quick_validate.py` (or a new command-frontmatter validator wired into `--type command`). Maintain a known-core-tools set `{Read,Write,Edit,Bash,Grep,Glob,Task,TodoWrite,WebFetch,…}`; any token not in that set and not matching `mcp__<server>__<tool>` is a blocking error. Acceptance: `goal_opencode.md` and `speckit/plan.md` flagged until bare `mk_goal*` tokens are qualified or moved to prose; a fully-qualified command exits 0.

### F1.3 — No argument-hint length/complexity budget (canon silent)
The canon budgets only `description` (≤110 chars; `command_template.md:63`). `argument-hint` has grammar rules (`<>` required, `[]` optional, `--flag`) but **no length or token-count ceiling**. `.opencode/commands/speckit/plan.md:3` ships an `argument-hint` of ~990 characters enumerating every flag and a parenthetical about pre-bound setup answers. This defeats the argument-hint's purpose (scannable `/help` surface) and guarantees drift between hint and MODE ROUTING prose. The 066 benchmark flagged "fat" commands; the canon has no rule to cite against it.

[SOURCE: .opencode/skills/sk-doc/create-command/assets/command_template.md:63,301-317]
[SOURCE: .opencode/commands/speckit/plan.md:3]

**Candidate delta C1.3:** Canon: add an `argument-hint` budget rule to create-command SKILL.md Step 6 + `command_template.md` §7 (e.g. soft target ≤140 chars; flag-heavy commands must summarize modes in the hint and enumerate flags in an OWNED ASSETS / MODE ROUTING sub-table, not inline). Validator: add a non-blocking warning when `argument-hint` exceeds the soft target. Acceptance: a command with a >140-char hint emits a warning; the speckit/plan hint would be flagged, forcing flag enumeration into the router body.

### F1.4 — The "direct-dispatch vs workflow-YAML" variant map is stale and contradicts the corpus
`command_router_template.md:108-116` (and `command_template.md:837-843`) classify the **doctor** family as "Direct-dispatch-script … No workflow YAML". But `.opencode/commands/doctor/update.md:23` owns a workflow YAML (`doctor_update.yaml`), executes it "phase by phase" (`update.md:47`), and the family uses a `_routes.yaml` route manifest + per-route `.yaml` assets. So doctor is neither pure direct-dispatch nor the workflow-YAML-backed variant — it is a **route-manifest argv-router** topology the canon's three-variant taxonomy never names. Because the canon's family→variant mapping is wrong, an author following the canon would either wrongly omit the YAML or wrongly add `_auto`/`_confirm` triads.

[SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:108-116]
[SOURCE: .opencode/commands/doctor/update.md:23,47]
[SOURCE: .opencode/commands/doctor/_routes.yaml:1-30]

**Candidate delta C1.4:** Canon: replace the stale family→variant table with a **topology-by-shape** taxonomy (workflow-YAML-backed router; direct-dispatch router; route-manifest argv-router; compiled-stub) and decouple it from family names so it does not rot when a family evolves. Add the route-manifest variant to `command_router_template.md` §3 with its required core (route manifest + owned per-route assets) and the doctor family as its reference. Acceptance: a new command matching the doctor shape can be classified and authored canonically without contradicting a named-family row.

### F1.5 — `skill_agent:` loader-gating frontmatter is used but undocumented in canon
Three doctor commands inject `<!-- skill_agent: system-spec-kit -->` (`.opencode/commands/doctor/update.md:6`, `doctor/speckit.md`, `doctor/mcp.md`). This is a loader-gating directive that binds the command's agent context, but the create-command canon never mentions it (SKILL.md Step 6 frontmatter, lines 187-218, lists only `description`/`argument-hint`/`allowed-tools`). Because it is undocumented, the 066 corpus shows it applied inconsistently (3 of ~37 commands) and an author has no rule to decide when to add it. This is the "missing loader-gating frontmatter" failure mode named in RQ5, rooted here as a canon gap.

[SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:187-218]
[SOURCE: .opencode/commands/doctor/update.md:6]

**Candidate delta C1.5:** Canon: add an optional frontmatter field (e.g. `agent:` or documented `<!-- skill_agent -->` directive) to create-command SKILL.md Step 6, with the rule "set when the command must execute under a specific agent/skill context; omit otherwise". Validator: add a non-blocking consistency check that a declared skill-agent exists. Acceptance: the directive is citable in canon; an author can decide its presence deterministically.

### F1.6 — Router CONTRACT section has no defined content boundary (prose-drift admission)
The canonical skeleton (`command_router_template.md:53-58`) shows `## 1. ROUTER CONTRACT` as two invariant sentences ("Do not dispatch agents…"; "Load the presentation contract before showing…"). But `.opencode/commands/memory/save.md:12-28` fills ROUTER CONTRACT with substantive Inputs/Outputs/Guardrails, and `.opencode/commands/doctor/update.md:12-17` keeps it minimal. The canon never states whether ROUTER CONTRACT may carry inputs/outputs/guardrails, so both shapes "pass" and prose drifts unchecked. This is the seed of the "router-overclaim prose" defect class flagged in 066 RQ3.

[SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:53-58]
[SOURCE: .opencode/commands/memory/save.md:12-28]
[SOURCE: .opencode/commands/doctor/update.md:12-17]

**Candidate delta C1.6:** Canon: define ROUTER CONTRACT's permitted content — either (a) keep it the two-sentence invariant and move inputs/outputs/guardrails into a separate `MODE ROUTING`/`EXECUTION TARGETS` subsection, or (b) explicitly permit an Inputs/Outputs/Guardrails block here. Pick (a) to keep the router thin. Validator: add a non-blocking warning if ROUTER CONTRACT exceeds N lines or contains presentation-template vocabulary (dashboard/prompt/result-template wording). Acceptance: memory/save.md ROUTER CONTRACT is refactored without behavior change; a router with leaked presentation vocabulary warns.

## Sources Consulted
- create-command canon: SKILL.md:96-394; command_router_template.md:39-124; command_template.md:301-846.
- Validator: validate_document.py:417-515; quick_validate.py:70-204; template_rules.json:109-198.
- Corpus: speckit/plan.md; memory/save.md; doctor/update.md; doctor/_routes.yaml; goal_opencode.md.
- 066 context: spec.md:66-107; 010 spec (scorecard/closeout).

## Assessment
- **newInfoRatio: 1.0** — first evidence pass; all six gaps are net-new to this packet.
- **Novelty justification:** Establishes the central RQ1 thesis (canon↔validator drift is the completeness failure mode) with six distinct, file-cited gaps spanning frontmatter, gate, allowed-tools, hint budget, topology taxonomy, loader-gating, and section-content boundary. Each carries a candidate delta + acceptance criterion.
- **Confidence:** high on F1.1/F1.2/F1.3/F1.4 (directly observed + canon rule directly stated); medium-high on F1.5/F1.6 (observed inconsistency; canon silence is the gap).
- **Partial RQ1 answer:** the gaps cluster into three families — (A) rules stated but unenforced [F1.1, F1.2], (B) canon silent where it should speak [F1.3, F1.5, F1.6], (C) canon stale/contradicted by corpus [F1.4]. Full RQ1 close pending cross-family confirmation in RQ2.

## Reflection
- **What worked:** Reading one representative command per topology (workflow-YAML, direct-dispatch, route-manifest) plus the validator source exposed drift that a canon-only read would miss.
- **What failed / ruled out:** Treating the validator as the canon source-of-truth — the validator is *narrower* than the canon, so it is the leak, not the floor.
- **Ruled out:** "Rewrite the canon from the validator" — out of scope and wrong direction (canon is richer; the fix is to make the validator enforce canon, then close canon silence).
- **Recommended next focus (RQ2):** Sweep all six families to test whether F1.1–F1.6 defects recur (canon gap) or are isolated (one-off error), which determines wholesale-vs-per-file fix priority.
