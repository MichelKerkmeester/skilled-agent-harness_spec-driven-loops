# Review Iteration 3 — traceability

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review` (externalized state, single review iteration, mode locked).
- Target: `skill:sk-create-goal` at `.skilled/skills/sk-doc/sk-create-goal` plus every cross-repo surface that names it (89 scope files).
- Iteration derivation: 2 prior `type:"iteration"` records in `deltas/` → current iteration 3, matching the dispatch. No mismatch.
- Budget profile: `verify` (traceability protocols). Analysis stopped at the ceiling; findings written instead of expanded discovery.
- Agent definition loaded: `.skilled/agents/deep-review.md`. Shared doctrine loaded: `sk-code-review/references/review-core.md`.
- State recording: per the run's STATE RECORDING supersession, `append-mode-event.cjs` was NOT invoked and `deep-review-state.jsonl` was NOT written; the canonical iteration record is the first line of `deltas/iter-003.jsonl` for the orchestrator to ingest.

## Dimension

**traceability** — the operator's bar: PERFECT cross-repo references. Every surface outside the mode that names `sk-create-goal`, `/create:goal`, a mode reference section, an operation or a quoted rule must resolve and agree with the mode's canonical text.

Focus items 1-5 coverage:

| Focus item | Disposition |
|---|---|
| 1. Link/path/section-number resolution | Checked: all section pointers land on the correct headings (see Traceability Checks). One stale evidence citation found (R3-P2-001). |
| 2. Runtime mirrors | Checked: prompt mirrors are wrapper-only diffs; agent mirrors are frontmatter-conversion-only within inspected hunks; generated Hermes copies carry unresolvable relative links (R3-P2-002). |
| 3. sk-doc registries | Checked: the mode, command and version are consistent in every registry that covers it; `leaf-scopes.json`/`leaf-aliases.json` omit it by design (both are partial registries covering 2 and 1 modes respectively). |
| 4. Advisor bridges | Checked: all three name `/create:goal` + `sk-create-goal` consistently. |
| 5. Core protocols (spec_code, checklist_evidence) | Spot-checked live at named lines: REQ-001/008/009/010/015 confirmed; AC-019's citation stale (R3-P2-001). REQ-008's "playbook section 6" half deferred (Edge Cases). |

## Files Reviewed

- `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:37,52` (§3 cut order, §4 send rule headings)
- `.skilled/skills/sk-doc/sk-create-goal/references/parent-and-nested-goals.md:123` (§6 precedence and amendments)
- `.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:46` (§4 completion criteria)
- `AGENTS.md:187`, `README.md:985-991`
- `.skilled/commands/create/assets/create-goal-auto.yaml:27-330`, `create-goal-confirm.yaml:40-346`
- `.skilled/commands/speckit/assets/speckit-plan.yaml:188-201`, `speckit-implement.yaml:153-166`, `speckit-complete.yaml:246-259`, `speckit-resume-auto.yaml:47`, `speckit-resume-confirm.yaml:47`
- `.skilled/hooks/goal/README.md:147`, `.skilled/hooks/goal/lib/goal-slice.cjs:208-214`
- `.skilled/skills/system-spec-kit/SKILL.md:58-63,155-162,485`, `README.md:230-235`
- `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:26-143`, `quick-reference.md:19`, `structure/phase-definitions.md:205`, `structure/phase-system.md:85`, `templates/template-guide.md:185-189`, `validation/validation-rules.md:709-722`, `validation/phase-checklists.md:39`, `config/hook-system.md:99`
- `.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1050-1053`, `runtime/cli/spec/create.sh:285-1890`, `templates/addons/goal.md.tmpl:33`
- Mirrors: `.codex/prompts/create-goal.md`, `.hermes/prompts/create-goal.md`, `.pi/prompts/create-goal.md`; `.claude/agents/markdown.md`, `.codex/agents/markdown.toml:53,196`, `.pi/agents/markdown.md`, `.hermes/skills/agent-markdown/SKILL.md`; `.hermes/skills/{sk-create-goal,sk-doc,system-spec-kit}/SKILL.md`
- Registries: `mode-registry.json:560-600`, `hub-router.json:22-444`, `leaf-manifest.json:110`, `leaf-scopes.json`, `leaf-aliases.json`, `command-metadata.json:456-485`, `description.json:3-36`, `graph-metadata.json:451`
- Bridges: `command-bridges.generated.json:152-154`, `projection.ts:346-352`, `skill_advisor.py:2449-2453`
- Spec: `specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe/spec.md:129-155`, `acceptance-criteria.md:57-81`
- `.opencode/plugins/README.md:31-124`, `.skilled/skills/sk-doc/feature-catalog/feature-catalog.md:35`, `feature-catalog/packet-authored-registry-routing/packet-authored-registry-routing.md:28`

## Findings by Severity (New)

### P0 Findings

None.

### P1 Findings

None new this iteration. Three P1 findings from iterations 1-2 remain ACTIVE (registry Resolved: 0) and are not re-reported here.

### P2 Findings

1. **AC-019 evidence cites `README.md:988` but the claim it proves sits at `README.md:990`** -- `specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe/acceptance-criteria.md:77` -- The AC-019 Verification cell reads "Cited: `README.md:988` and `.skilled/hooks/goal/README.md:147`" to support "the root README, goal hooks README and phase checklist name `/create:goal` where they describe goal authoring." Line 988 is the plugin's one-line summary ("Gives a session a durable completion objective that survives across turns…") and contains no `/create:goal`; the naming sentence is at line 990 ("…What that chat slice contains is section 4 of `sk-create-goal`'s `references/budget-and-handoff.md`, and `/create:goal` authors the file."). The `.skilled/hooks/goal/README.md:147` half resolves exactly.
   - Impact: the `checklist_evidence` pointer does not resolve to the claimed content; a reviewer following the citation lands on a sentence that proves nothing about `/create:goal` naming and must search nearby to confirm the row.
   - Fix: in the AC-019 Verification cell replace `README.md:988` with `README.md:990`.
   - Finding class: instance-only
   - Scope proof: every file:line citation across all 23 AC rows was resolved (only AC-001 `budget-and-handoff.md:52`, AC-002 `goal.md.tmpl:33`, AC-009 `phase-definitions.md:205`, AC-017 `goal-slice.cjs:211`, AC-019 `README.md:988` + `hooks/goal/README.md:147` carry file:line citations); the four other rows resolve exactly at the cited lines — AC-019's README citation is the single stale one.
   - Affected surface hints: ["acceptance-criteria.md AC-019 evidence row", "README.md Goal Plugin section"]

2. **Generated Hermes skill copies keep canonical relative links that resolve to nothing from the mirror tree** -- `.hermes/skills/sk-create-goal/SKILL.md:57` -- `ls .hermes/skills/{sk-create-goal,sk-doc,system-spec-kit}/` shows each mirror directory holds only `SKILL.md`. A resolution check of the six in-body link targets prints MISSING for all six: `references/parent-and-nested-goals.md`, `references/authoring-standards.md`, `references/budget-and-handoff.md` (resolve inside the empty mirror dir), `../../system-spec-kit/references/workflows/goal-set-string-playbook.md` and `../../hooks/goal/goal-plugin.md` (the flattened `sk-doc/sk-create-goal` → `sk-create-goal` path loses one directory level, so `../../` escapes `.hermes/skills/` entirely and lands at `.hermes/system-spec-kit/…`), and `../sk-doc/sk-create-goal/references/budget-and-handoff.md` from `.hermes/skills/system-spec-kit/SKILL.md:490`. The mirrors' generated banner ("read `references/`, `assets/` and `scripts/` from the canonical path above") mitigates the resource reads but not cross-packet pointers such as the goal-set-string-playbook link at `:161`.
   - Impact: a Hermes-runtime agent following any in-body link from the loaded copy reaches a nonexistent path; resolution depends on the reader ignoring the link and re-deriving the canonical path from the banner.
   - Fix: in `sync-skills-hermes.cjs`'s copy step, rewrite relative links in the generated copy to canonical repo-root paths (e.g. `.skilled/skills/sk-doc/sk-create-goal/references/parent-and-nested-goals.md`), or replace body links with plain canonical paths matching the banner's instruction.
   - Finding class: class-of-bug
   - Scope proof: `diff` shows the three in-scope Hermes copies carry the canonical body verbatim with only the banner inserted, so every relative link in every generated copy is affected; all six resolved targets were checked and are MISSING. The same generator serves 71 copies (AC-018), so the class extends beyond these three, but only the in-scope copies are reported here.
   - Affected surface hints: [".hermes/skills/sk-create-goal/SKILL.md", ".hermes/skills/sk-doc/SKILL.md", ".hermes/skills/system-spec-kit/SKILL.md", "sync-skills-hermes.cjs copy step"]

## Traceability Checks

- **spec_code (core)** — VERIFIED with one deferred half. REQ-001/REQ-003 section ownership: `budget-and-handoff.md` §3 = "CUT IN THIS ORDER" and §4 = "WHAT A PARENT GOAL SENT IN CHAT CONTAINS" match every pointer's claim. REQ-008: `system-spec-kit/README.md:232` states the `--phase` child-only and `--level phase-parent --with-goal` parent behavior; `template-guide.md:187` states the child-only half and "Both work at every level"; `create.sh:285,296,1655,1888-1890` agrees. REQ-009: `SKILL.md:61` admits `/create:goal` ("`goal.md` may also come from `/create:goal`"). REQ-010: `SKILL.md:160` HOOKS keywords contain none of "packet goal", "goal.md", "nested goal" and keep the goal-hook vocabulary. REQ-015: `validation-rules.md:709,722` and `spec-doc-structure.ts:1050-1053` name the section 3 cut order and `/create:goal <parent> phase-add`. Deferred: REQ-008's "playbook section 6" statement (see Edge Cases).
- **checklist_evidence (core)** — FINDING (R3-P2-001). All file:line citations in `acceptance-criteria.md` resolved; AC-019's `README.md:988` is stale by two lines. AC rows citing V-commands only were not re-executed (validators out of scope per dispatch).
- **skill_agent (overlay)** — VERIFIED. `.codex/agents/markdown.toml:53,196` names `/create:goal` and the three goal templates consistently with `.skilled/agents/markdown.md`; the `.claude`/`.pi`/`.hermes` copies differ from canonical by frontmatter conversion only within inspected hunks (body parity beyond the first diff hunk bounded — Edge Cases).
- **agent_cross_runtime (overlay)** — FINDING (R3-P2-002). Prompt mirrors (`.codex`, `.hermes`, `.pi`) are wrapper-only diffs around `.skilled/commands/create/goal.md`, each naming the canonical path — consistent. The three generated Hermes skill copies carry unresolvable relative links.
- **feature_catalog_code (overlay)** — VERIFIED. `feature-catalog.md:35` and `packet-authored-registry-routing.md:28` list `sk-create-goal` among the 15 workflow modes; `mode-registry.json:567-588` entry (`workflowMode`/`packet`/`packetSkillName`/`command: /create:goal`), `hub-router.json:178`, `leaf-manifest.json:110`, `command-metadata.json:456-485`, `description.json:36`, `graph-metadata.json:451` all agree. Version parity: skill `version: 1.2.0.0` matches `changelog/v1.2.0.0.md` and the Hermes copy (`:5`); hub version `2.1.0.0` is a separate namespace consistently applied.
- **playbook_capability (overlay)** — DEFERRED. The playbook-scenario runnability bar belongs to a later focus; not entered this iteration.

## Integration Evidence

Named surfaces checked exactly: command `.skilled/commands/create/goal.md` and its three runtime prompt mirrors (`.codex/prompts/create-goal.md`, `.hermes/prompts/create-goal.md`, `.pi/prompts/create-goal.md`); agent `.skilled/agents/markdown.md` and mirrors `.claude/agents/markdown.md`, `.codex/agents/markdown.toml`, `.pi/agents/markdown.md`, `.hermes/skills/agent-markdown/SKILL.md`; generated skill copies `.hermes/skills/{sk-create-goal,sk-doc,system-spec-kit}/SKILL.md` produced by `system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`; registries `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `leaf-scopes.json`, `leaf-aliases.json`, `command-metadata.json`, `description.json`, `graph-metadata.json`; advisor bridges `command-bridges.generated.json`, `projection.ts`, `skill_advisor.py`; workflows `speckit-{plan,implement,complete,resume-auto,resume-confirm}.yaml`; validator `spec-doc-structure.ts` and its vitest; hooks `goal-slice.cjs`, `.skilled/hooks/goal/README.md`; scaffolder `create.sh`; templates `goal.md.tmpl` + three asset templates.

## Edge Cases

- **Verdict-mapping adjudication.** The dispatch maps "PASS if no P0 or P1 findings this iteration"; the agent definition maps the final line "over findings ACTIVE at this iteration rather than only the ones it raised". Three P1s from iterations 1-2 are active (registry Resolved: 0) and the state summary's Provisional Verdict is CONDITIONAL. The agent definition's active-finding semantics govern (it is the loaded contract and is the more specific statement); the emitted verdict is therefore CONDITIONAL, matching what a registry-based recompute returns.
- **REQ-008 "playbook section 6" deferred.** The manual-testing-playbook heading dump covered sections 1-5 plus feature-file headings within the analysis budget; the section-6 statement REQ-008 names was not directly inspected, so that half of REQ-008 is deferred rather than passed.
- **Mirror body parity bounded.** `diff` output for `.claude`/`.pi` markdown-agent mirrors was inspected to the first hunk (frontmatter conversion). Body parity beyond that hunk is claimed only within inspected hunks.
- **Tool-budget overrun (disclosed).** Discovery used 13 analysis calls; the three mandatory artifact writes plus the Step-11 output-verification pass push the total to 17. The write steps and output verification are contract-mandatory ("NEVER skip writing the iteration file"; "NEVER claim complete when output verification… was skipped"), so they ran; the overrun is disclosed here rather than hidden.
- **Coverage graph unavailable.** `resource-map.md` not present; `graphStatus: unavailable`, no graph-backed coverage this iteration.

## Confirmed-Clean Surfaces

- Canonical section pointers land and agree everywhere they appear: "section 3 / §3" = cut order and "section 4 / §4" = send rule in `budget-and-handoff.md` (pointers at `create-goal-auto.yaml:216,330`, `create-goal-confirm.yaml:233,346`, `speckit-plan.yaml:189,199`, `speckit-implement.yaml:154,164`, `speckit-complete.yaml:247,257`, `speckit-resume-auto.yaml:47`, `speckit-resume-confirm.yaml:47`, `spec-doc-structure.ts:1052`, `validation-rules.md:709,722`, `goal-set-string-playbook.md:65,79`, `sk-create-goal/README.md:98`, `AGENTS.md:187`, root `README.md:990`, `.skilled/hooks/goal/README.md:147`, `hook-system.md:99`); "section 6" = precedence and amendments in `parent-and-nested-goals.md` (`speckit-plan.yaml:188,201`, `speckit-implement.yaml:153,166`, `speckit-complete.yaml:246,259`, `goal-set-string-playbook.md:26,86`); "section 4" = criteria rules in `authoring-standards.md` (`goal-set-string-playbook.md:59`).
- Advisor bridges agree: `command-bridges.generated.json:152-154`, `projection.ts:346-352` (`command-create-goal`), `skill_advisor.py:2449-2453` (`slash_markers: ["/create:goal"]`, `owner_mode: sk-create-goal`).
- `leaf-scopes.json` (2 modes) and `leaf-aliases.json` (1 mode) omit `sk-create-goal` without inconsistency: both are by-design partial registries for shared-leaf resources, not exhaustive mode lists.
- The goal-slice resend reminder (`goal-slice.cjs:211`) restates no cut order or send definition; it names `packet_budget=ok`, 4000, and defers the slice definition to the canonical surface — consistent with REQ-001/REQ-012 and AC-017.

## Ruled Out

- Section-pointer drift (wrong section number landing): every `section N` / `§N` pointer in scope resolves to the heading holding that content. Do not re-audit.
- Registry omission of the mode from an exhaustive registry: no exhaustive registry omits it; `leaf-scopes`/`leaf-aliases` are partial by design. Do not re-audit.
- Advisor-bridge naming drift across `command-bridges.generated.json`, `projection.ts`, `skill_advisor.py`: all three agree on `/create:goal` and `sk-create-goal`. Do not re-audit.
- Stale citations in the other four AC file:line rows (AC-001, AC-002, AC-009, AC-017 + AC-019's hooks half): all resolve exactly at the cited lines.

## Next Focus

- dimension: maintainability
- focus area: the operator's first bar — perfect sk-doc alignment of `SKILL.md`, `README.md`, `references/`, `assets/`, `changelog/` against `sk-create-skill/assets/skill/` templates, and the manual testing playbook against `sk-create-manual-testing-playbook/` (`SKILL.md`, `manual-testing-playbook-template.md`, `manual-testing-playbook-snippet-template.md`, `common-pitfalls.md`, `prompt-voice.md`); plus the deferred `playbook_capability` overlay (every playbook scenario runnable).
- reason: last unreviewed dimension; both alignment bars remain unmeasured.
- rotation status: correctness ✓ (iter 1), security ✓ (iter 2), traceability ✓ (iter 3), maintainability next.
- blocked/productive carry-forward: `GOAL_NOT_UTF8` (goal-core.cjs/bin/goal.cjs) deferred from the security focus — outside the 89 scope files; REQ-008 playbook-section-6 half deferred here.
- required evidence: template-diff evidence per skill file against the four `sk-create-skill` templates; playbook-template diff; scenario-by-scenario runnability traces.

## Next Dimension

maintainability

## Verdict

- New findings this iteration: 2 × P2 (R3-P2-001, R3-P2-002). No new P0 or P1.
- Active findings carried: 0 P0, 3 P1 (iterations 1-2), 8 P2 + 2 new P2 = 10 P2. Registry Resolved: 0.
- newFindingsRatio: 0.08 — (weightedNew 2×1 + weightedRefinement 0) / weightedTotal 25 (prior 23 + new 2), weights P0=10, P1=5, P2=1. Below the 0.10 threshold, but `stopPolicy: max-iterations` makes convergence telemetry only.
- noveltyJustification: both findings are new to the registry — no prior finding covers acceptance-criteria evidence citations or Hermes mirror link resolution; neither refines or restates an open finding.
- The verdict is computed over ACTIVE findings per the agent definition's final-line mapping: active P1s remain and no P0 exists → CONDITIONAL.

Review verdict: CONDITIONAL
