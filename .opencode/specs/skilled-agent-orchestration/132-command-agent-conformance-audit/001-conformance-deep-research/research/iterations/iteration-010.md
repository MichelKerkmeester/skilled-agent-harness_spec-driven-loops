# Iteration 10 (Final): Synthesis — Ranked P0/P1/P2 Findings by Surface

## Focus

Should create-agent call the system-spec-kit command workflow directly, or should a new typed handoff field replace the retired `speckit.md` agent lookup? (carried forward since iteration 5 — answered in principle at iteration 7, implementation not yet applied). As the final iteration in a 10-iteration batch with `convergenceMode: off`, this iteration also performs the required synthesis pass: consolidate all 9 prior iterations' findings into final P0/P1/P2 rankings partitioned by surface, resolve or explicitly defer each remaining open question, and check for cross-iteration contradictions.

## Actions Taken

1. Re-verified the create-agent focus question is unchanged since iteration 7's "answered in principle" resolution: confirmed on disk that `create_agent_auto.yaml:301` / `create_agent_confirm.yaml:334` still target `[runtime_agent_path]/speckit.md` (`agent_availability.agent_file`) and that the sibling `create_command_auto.yaml` step_1c pattern (no `agent_availability` block, direct "distributed governance" prose) remains the correct precedent — no implementation has landed yet. This closes the question at the recommendation level; only the code-side fix remains, which is explicitly out of scope (report-only).
2. Read all 9 prior `iterations/iteration-00N.md` narratives and all 9 `deltas/iter-00N.jsonl` files end-to-end to build a complete finding inventory (grep-driven extraction of every `"type":"finding"` record plus narrative-only findings not delta-recorded).
3. Spot-verified representative findings from each iteration batch against the live filesystem to confirm none have been fixed or gone stale since discovery: `create_agent_auto.yaml:45` / `create_agent_confirm.yaml:46` (singular `.opencode/agent` typo — still present), `.claude/agents/deep-research.md:11` and `.claude/agents/markdown.md:11` (Path Convention miswiring — still present), `doctor/speckit.md` Workflow Assets table lines 29-39 (still 9 rows, still omits `skill-graph-freshness`), `doctor_speckit_presentation.txt` menu/valid-targets lines (still 9-target enumeration, `skill-graph-freshness` absent from both the numbered menu and the "Valid targets:" line), `_routes.yaml` (still 10 routes: memory, embeddings, causal-graph, code-graph, deep-loop, skill-advisor, skill-budget, parent-skill, skill-graph-freshness, fable-mode), and all 4 `cli-opencode skill SKILL.md` framing sites in the deep family (still present, still nested under `cli-external/cli-opencode/`).
4. Ran two targeted checks to close residual open questions before final synthesis: (a) `grep -rln "mutation_boundaries:"` and `grep -rln "forbidden_operations:\|approval_gates:"` across all `.opencode/commands/**/*.yaml` — confirmed `mutation_boundaries:` is declared in exactly the 10 doctor route YAMLs (all except `doctor_fable-mode.yaml`, per iteration 6's finding) and nowhere else in the 62-YAML surface; `forbidden_operations:`/`approval_gates:` appear only in doctor plus one non-doctor site (`deep_research_confirm.yaml`, a pre-existing narrower usage, not full `mutation_boundaries:` parity). (b) checked `.opencode/skills/system-deep-loop/graph-metadata.json` for retired-topology language — confirmed its `causal_summary` field already documents the deep-loop-runtime merge accurately (no stale node), narrowing the still-open canonical-skill-graph-reindex question to whatever other skills' metadata was not sampled this iteration.
5. Cross-checked all 9 iterations' findings for contradictions or duplicate-but-differently-labeled defects (e.g., confirmed the iteration-7 "singular `.opencode/agent`" fix recommendation and the iteration-9 "speckit family needs the block added" fix recommendation both converge on the same corrected value — plural `.opencode/agents` — no conflict). Found one near-duplicate pair (iteration-1's `f-iter001-004`/`f-iter001-005` and iteration-2's `f-iter002-004` are earlier, less-verified passes over the same two defect classes iteration 6 (`f-iter006-001`) and iteration 9 (`f-cli-opencode-standalone-framing-4x`) later confirmed with file:line precision and full 4-site enumeration) — consolidated these into single ranked entries below, citing the most complete iteration's evidence.
6. Assembled the final ranked findings table below, partitioned by surface, superseding earlier partial-precision duplicates with their most complete/most recent iteration's file:line citations.

## Findings

This is the full 10-iteration consolidated ranking. Findings are deduplicated where later iterations sharpened an earlier iteration's discovery (the superseding iteration's evidence is cited; the superseded id is noted in parentheses for registry traceability).

### P0 — COMMANDS

**P0-C1 — `speckit` family's 12 `[runtime_agent_path]` token sites have zero resolution definition anywhere in the repo** (iter 9, `f-speckit-runtime-agent-path-undefined`)
Files: `speckit_complete_auto.yaml:357,363,387`; `speckit_complete_confirm.yaml:330,336,360`; `speckit_implement_auto.yaml:252,267`; `speckit_implement_confirm.yaml:216,231`; `speckit_plan_auto.yaml:297`; `speckit_plan_confirm.yaml:303`. None of these 6 files defines a `runtime_agent_path_resolution:` block, no shared/include YAML mechanism exists in this codebase, and no `.ts/.js/.cjs/.mjs` resolver exists anywhere. The bracket token is a dangling literal at runtime.
**Fix**: Add `runtime_agent_path_resolution: { default: .opencode/agents, claude: .claude/agents }` to the top of all 6 speckit workflow YAMLs, using the corrected plural form (do not copy the P0-C2 typo).

**P0-C2 — `runtime_agent_path_resolution.default` is the nonexistent singular `.opencode/agent` in 4 `/create` family files** (iter 7, `f-agent-path-singular-typo`)
Files: `create_agent_auto.yaml:45`, `create_agent_confirm.yaml:46`, `create_readme_auto.yaml:83`, `create_readme_confirm.yaml:78`. Real directory is `.opencode/agents` (plural). Feeds 8 downstream `agent_file:` interpolation sites onto a nonexistent path on the non-Claude branch. (Superseded/duplicated by iter 4's `f-iter004-002`, "twelve create workflow assets" — same defect class, less-precise site count; this entry supersedes it.)
**Fix**: change `default: .opencode/agent` → `default: .opencode/agents` in all 4 locations.

**P0-C3 — `create_agent_auto.yaml:301` / `create_agent_confirm.yaml:334` target the retired `speckit.md` agent; no successor exists** (iter 7, `f-create-agent-speckit-dead`; also iter 5 `f-iter005-001`)
`agent_availability.agent_file: "[runtime_agent_path]/speckit.md"` — confirmed via `git log --all -p -- '*/agents/speckit.md'` that this was a real per-runtime agent (retired across `.claude`, `.codex`, `.gemini`), with no successor among the current 12 agents. **This iteration's assigned focus question is answered here**: `create_command_auto.yaml`'s sibling `step_1c_spec_folder_setup` (lines 287-298) already avoids this dead lookup entirely — no `agent_availability`/`agent_file` block, just prose routing spec.md/plan.md creation through "distributed governance" (AGENTS.md Rule 5). `create-agent` should be rewritten to match that existing, working sibling pattern — not given a new typed handoff field. No new investigation changes this iteration; it is confirmed final.
**Fix**: Remove the `agent_availability`/`agent_file: "[runtime_agent_path]/speckit.md"` block from both files' `step_1c_spec_folder_setup`; replace with the `create_command_auto.yaml`-style direct system-spec-kit routing prose.

**P0-C4 — Six `/create` quality-gate steps target the retired `write` agent** (iter 5, `f-iter005-002`)
Same defect class and era as `speckit.md` (both retired in the same "remove @write agent" commit, `dde19822df`), but never applied to these 6 sites. Fix mirrors the already-completed `write.md` remediation pattern elsewhere in the codebase.
**Fix**: Remove the dead `write` agent lookup from all 6 sites; route through the live `markdown` agent or direct skill invocation, matching whatever pattern replaced `write` in the sites that were already fixed.

### P0 — DOCTOR

**P0-D1 — Doctor "Workflow Assets" table AND presentation menu/valid-targets both omit `skill-graph-freshness`** (iter 6, `f-iter006-001`, confirmed independently at iter 1/2/7; superseding `f-iter001-004`, `f-iter002-004`, `f-doctor-table-menu-omit-freshness`)
- `.opencode/commands/doctor/speckit.md` "Workflow Assets" table (lines 29-39): lists 9 targets (memory, embeddings, causal-graph, code-graph, deep-loop, skill-advisor, skill-budget, parent-skill, fable-mode); omits `skill-graph-freshness`, which is route #9 of 10 in `_routes.yaml:171-185` with a real asset (`doctor_skill-graph-freshness.yaml`, confirmed present on disk).
- `doctor_speckit_presentation.txt` numbered menu (lines 30-41, options 1-10) and "Valid targets:" line (line 79) both also skip `skill-graph-freshness` entirely — verified again this iteration, unchanged since discovery.
Net effect: `/doctor skill-graph-freshness` works directly (router reads `_routes.yaml`), but `/doctor` (interactive menu), `/doctor list`, and `/doctor ?` give users no way to discover the target exists.
**Fix**: Add `skill-graph-freshness` as a row/menu option (position 9, after `parent-skill`/before `fable-mode`, matching `_routes.yaml` order) to the `speckit.md` table, the presentation numbered menu (renumbering `fable-mode` to 10), and the "Valid targets:" enumeration.

**P0-D2 — All three compiled deep contracts are stale against their own `sourceDigests`; `ai-council`'s on-disk contract also mismatches its own manifest row** (iter 6, `f-iter006-004`)
The `compile-command-contracts.cjs` output (`deep/assets/compiled/*.contract.md`, `manifest.jsonl`) is a build artifact whose freshness invariant (contract content hash == recorded `sourceDigests`) is violated for all three deep commands, and the ai-council contract additionally disagrees with its own manifest entry — meaning the manifest itself is internally inconsistent, not just stale relative to source.
**Fix**: Re-run `compile-command-contracts.cjs` to regenerate all three contracts and the manifest; then decide (per the still-open question below) whether to wire this into CI/pre-commit so it cannot silently go stale again.

### P0 — AGENTS

**P0-A1 — `.claude/agents/deep-research.md:11` Path Convention self-references `.opencode/agents/*.md` instead of `.claude/agents/*.md`** (iter 7, `f-deep-research-path-miswired`; confirmed recon seed #2; also iter 1 `f-iter001-003`, iter 3 `f-iter003-004`)
Confirmed unchanged on disk this iteration. All 9 other agents that carry this line correctly self-localize per-runtime.
**Fix**: change to `.claude/agents/*.md`.

### P0 — CROSS-SURFACE

None ranked P0 at cross-surface level distinct from the above; the two cross-surface-flavored candidates (`cli-opencode` standalone-skill framing, and the dead `/design:design-mcp-open-design` command) are ranked P1 below — neither breaks a currently-working path the way P0-C1/P0-D1/P0-D2/P0-A1 do (they are misleading documentation/prose, not dangling interpolation tokens or missing menu rows a user actively hits).

---

### P1 — COMMANDS

**P1-C1 — `cli-opencode` framed as a standalone top-level "skill" in 4 self-invocation-guard sites, not the originally-seeded 1** (iter 9, `f-cli-opencode-standalone-framing-4x`, expanding recon seed #4 and iter 1's `f-iter001-005`/iter 4's `f-iter004-001`)
`deep_research_auto.yaml:1016`, `deep_research_confirm.yaml:765`, `deep_review_auto.yaml:1073`, `deep_review_confirm.yaml:840` — all say "The cli-opencode skill SKILL.md §SELF-INVOCATION PROHIBITED contract is the authoritative gate." `cli-opencode`'s actual `SKILL.md` is nested at `.opencode/skills/cli-external/cli-opencode/SKILL.md`, a mode under the `cli-external` parent hub, not a standalone skill. Confirmed unchanged on disk this iteration at all 4 sites.
**Fix**: Reword all 4 sites to "the `cli-external/cli-opencode` mode's SKILL.md (`.opencode/skills/cli-external/cli-opencode/SKILL.md`)".

**P1-C2 — Five `/design` command routers reference the nonexistent slash command `/design:design-mcp-open-design`** (iter 1, `f-iter001-001` — recon seed #1, confirmed)
`.opencode/commands/design/{interface,foundations,motion,audit,md-generator}.md` at lines 52/39/39/39/39 respectively. No such command exists; the transport is a nested `sk-design` mode reached via the skill directly, not a slash command.
**Fix**: Replace the dead slash-command reference in all 5 files with the correct invocation path — load `sk-design`, which routes to the nested `design-mcp-open-design` transport mode internally; do not present it as an independently dispatchable `/design:*` command.

**P1-C3 — Four doctor routes marked read-only actually write packet-local artifacts** (iter 2, `f-iter002-001`)
**Fix**: Either reclassify these routes' declared mutation-class in `_routes.yaml` to reflect the packet-local writes they perform, or make the writes conditional/opt-in so the read-only classification is accurate.

**P1-C4 — Doctor `memory` route declares the mutating `memory_index_scan` tool call despite being presented as a read-only route** (iter 2, `f-iter002-002`)
**Fix**: Either move `memory_index_scan` out of the read-only route's tool grant, or reclassify the route's mutation-class to match what it actually calls.

**P1-C5 — Doctor's `route-validate.py` misses script-existence and mutation-honesty checks** (iter 2, `f-iter002-003`)
The validator's `G1` and sibling checks enforce schema hygiene (e.g., non-empty `trigger_phrases`) but do not verify that a route's declared script actually exists on disk, nor that a route's declared mutation-class matches what its steps actually do — which is how P1-C3/P1-C4 went undetected by tooling.
**Fix**: Extend `route-validate.py` with a script-existence check per route and a lightweight mutation-class cross-check (e.g., flag any read-only route whose steps reference a known-mutating tool/script name).

**P1-C6 — `deep-research` leaf omits a workflow-required delta artifact** (iter 3, `f-iter003-001`)
**Fix**: Add the missing delta-artifact write step to the deep-research leaf's workflow YAML, matching the pattern used by sibling leaves that do emit it.

**P1-C7 — Six create-family agent bodies advertise an absent Codex agent mirror** (iter 3, `f-iter003-003`)
Distinct from the false-positive-guarded live `.codex` runtime mirror mentions in `deep-improvement.md`/`prompt-improver.md`/`orchestrate.md` — this is agent body prose claiming a `.codex/agents` directory that does not exist (related to the already-known README seed #5, but this is agent-body prose, not README).
**Fix**: Remove or correct the 6 sites' claims about a `.codex/agents` mirror; either state it does not currently exist, or scope the claim to the live runtime-mirror sense the false-positive guard protects.

**P1-C8 — `.claude/agents/markdown.md:11` Path Convention self-references `.opencode/agents/*.md` instead of `.claude/agents/*.md`** (iter 7, `f-markdown-path-miswired`)
Second confirmed instance of P0-A1's exact defect class, found by diffing all 12 frontmatter-stripped agent body pairs. Ranked P1 (not P0) because it is a duplicate-class instance rather than the originally-seeded defect, but the fix is equally mechanical and equally load-bearing for anyone following this agent's own self-reference.
**Fix**: change to `.claude/agents/*.md`.

### P1 — DOCTOR

**P1-D1 — `_routes.yaml:7` header comment claiming advisor consumption of `trigger_phrases` is affirmatively false, not merely stale** (iter 8, `f-doctor-triggerphrases-header-false`, resolving the carried-forward wiring question)
Both the Python shim (`skill_advisor.py:810-871`) and the TS daemon (`doc-frontmatter.ts:23`) harvest exclusively `.opencode/skills/*/{references,assets}/*.md` frontmatter, gated by `SPECKIT_ADVISOR_DOC_TRIGGERS`; neither has ever been capable of reading a `.yaml` file, nor anything under `.opencode/commands/`. Confirmed via `git log --follow -p` that this header line has been unchanged and uncorrected since the file's schema was formalized (commit `10b76891c2`) across 17+ subsequent revisions — this was never true, not a regression. **Resolves the carried-forward open question**: there is no intentional design exemption; the header is simply wrong and always has been.
**Fix**: Rewrite the header to state the true scope (e.g., "NOTE: not currently harvested by the advisor; retained for future wiring or operator discoverability") and soften `route-validate.py`'s `G1` message, which currently implies a live consumption path.

**P1-D2 — `doctor_fable-mode.yaml` lacks the structured `mutation_boundaries` block used by all 9 sibling doctor route YAMLs** (iter 6, `f-iter006-003`, confirmed this iteration: `mutation_boundaries:` present in exactly 10 doctor asset files, `fable-mode` was the one missing at time of check — re-verify count includes `doctor_skill-graph-freshness.yaml`, which DOES have it, per this iteration's grep)
**Fix**: Add a `mutation_boundaries:` block to `doctor_fable-mode.yaml` consistent with its 9 (now 10, minus itself) siblings' schema.

### P1 — AGENTS

**P1-A1 — Claude frontmatter policy is split/inconsistent across runtime mirrors and `create-agent`'s emission logic** (iter 3, `f-iter003-002`, related open question re: "which frontmatter schema does the installed Claude runtime enforce")
**Fix**: Document (or, in a follow-up implementation pass, enforce) a single canonical frontmatter schema per runtime in `create-agent`'s templates, resolving the drift between what's currently emitted and what the Claude runtime actually expects.

### P1 — CROSS-SURFACE

**P1-X1 — Root `agent_router.md` is coupled to an unrelated "Barter" workspace topology and carries non-current tool grants** (iter 1, `f-iter001-002`, confirmed this iteration at lines 93-98)
`.opencode/commands/agent_router.md:93-98` hardcodes ancestor-directory detection logic for a workspace literally named "Barter" (`AI_Systems/Barter`), which is unrelated to this repository's actual structure — this reads as leftover logic from a different project/template that was never generalized or removed.
**Fix**: Remove the Barter-specific workspace-detection logic, or generalize it into a project-agnostic ancestor-detection pattern; audit the file's tool grants against the current OpenCode tool registry in the same pass (ties into the still-open router-level allowed-tool-overgrant question below).

**P1-X2 — Skill graph representations retain retired topology beyond what canonical reindex removes** (iter 2, `f-iter002-005`, partially narrowed this iteration)
This iteration sampled `system-deep-loop/graph-metadata.json`'s `causal_summary` field and found it already correctly documents the deep-loop-runtime merge with no stale node reference — so the retained-retired-topology defect, if still present, is not in this specific file/field. The broader "does reindex remove every retired node, or are source metadata changes also required" question remains open (see Questions Remaining) because a full sweep of all skills' `graph-metadata.json` files was not performed this iteration (out of budget).
**Fix**: Deferred — requires a full-sweep follow-up across all skills' `graph-metadata.json` derived fields, not just the one sampled here.

### P2 — COMMANDS

- **P2-C1** — `ai-council.md` (both runtimes) has no Path Convention line at all, unlike the other 11 agents (iter 7, `f-ai-council-no-path-convention`). Fix: add a Path Convention line consistent with sibling agents' phrasing, per-runtime.
- **P2-C2** — `.claude/agents/orchestrate.md:784` and `.opencode/agents/orchestrate.md:809` disagree on dual-runtime canonical-source provenance prose (iter 7, `f-orchestrate-dual-runtime-asymmetry`). Fix: add the equivalent clause to the OpenCode mirror or drop it from Claude for parity.
- **P2-C3** — Deep family's 4 `agent_file:` sites are documentation-only (dispatch is by bare `agent:` name) — a different semantic than create/speckit's live-interpolated `agent_file:`, risking a future miscorrection (iter 9, `f-deep-agent-file-schema-inconsistent`). Fix: add a one-line schema note clarifying the field is documentation-only in this family.
- **P2-C4** — Deep command frontmatter omits flags that presentation contracts parse (iter 4, `f-iter004-003`). Fix: sync frontmatter flag declarations with what the presentation `.txt` actually parses.
- **P2-C5** — README workflow assets retain dead router and copied verification names (iter 4, `f-iter004-004`) — noted per topic scope as README-adjacent; core finding retained here since it lives in a workflow YAML asset, not the README itself, but remediation should be sequenced with phase-005 README work.
- **P2-C6** — `deep-review` includes a nonexistent `.agents` runtime reference (iter 5, `f-iter005-003`). Fix: remove or correct the phantom runtime reference.
- **P2-C7** — Command validation lacks referential-integrity checks generally (iter 5, `f-iter005-004`) — a tooling-gap finding parallel to P1-C5's specific mutation-honesty gap; both point at the same underlying need to harden `route-validate.py`/command validators beyond schema hygiene.
- **P2-C8** — No non-doctor confirm YAML declares the structured `mutation_boundaries` schema used by doctor routes (iter 6, `f-iter006-005`) — ties directly to the still-open "should `mutation_boundaries:` become cross-family" question; confirmed this iteration via grep that the schema remains doctor-exclusive (10/10 doctor files, 0/52 non-doctor files) plus one narrower `forbidden_operations`/`approval_gates` usage in `deep_research_confirm.yaml`.

### P2 — DOCTOR

- **P2-D1** — (Superseded duplicate of P0-D1, retained for registry traceability) iter 1's `f-iter001-004` and iter 2's `f-iter002-004` were earlier, less-precise passes over the same skill-graph-freshness omission that iter 6/7 later confirmed with full file:line precision — no separate action needed beyond P0-D1's fix.

### P2 — AGENTS

None beyond those already listed under P2-COMMANDS/P2-CROSS-SURFACE that touch agent bodies (P2-C1, P2-C2, P2-C3 are agent-body findings filed under COMMANDS/AGENTS boundary by their originating iterations; retained as originally categorized).

### P2 — CROSS-SURFACE

- **P2-X1** — `.opencode/install_guides/README.md` "Current Skills" catalog is stale — noted per the audit context's own instruction to defer to phase 005; not actioned here.

---

## Questions Answered

1. **This iteration's assigned focus — Should create-agent call the system-spec-kit command workflow directly, or should a new typed handoff field replace the retired `speckit.md` agent lookup?** — **Direct invocation**, confirmed final. `create_command_auto.yaml`'s `step_1c_spec_folder_setup` already implements the correct pattern (no `agent_availability`/`agent_file`, just distributed-governance prose per AGENTS.md Rule 5); `create_agent_auto.yaml`/`create_agent_confirm.yaml` (P0-C3) should be rewritten to match. No new typed field is needed or recommended.
2. **Should doctor `_routes.yaml` trigger_phrases be wired into the advisor, or is the header simply wrong?** (iter 8) — The header is simply wrong; there is no intentional exemption. Confirmed final, no reversal this iteration.
3. **Which command-to-skill/command-to-agent references remain dead beyond `speckit.md`/`write.md`/singular `.opencode/agent`?** (iter 9) — None among literal agent-name references; the sweep is exhaustive and complete. The structural `[runtime_agent_path]`-undefined-in-speckit defect (P0-C1) and the `cli-opencode` standalone-framing defect (P1-C1) are the two residual structural classes, both already ranked above.
4. **Is `mutation_boundaries:` correctly doctor-specific, or should it become cross-family?** — Partially answered this iteration: confirmed via full-tree grep it is currently doctor-exclusive (10/10 doctor asset files, 0/52 non-doctor asset files, with one narrower `forbidden_operations`/`approval_gates` outlier in `deep_research_confirm.yaml`). This iteration does not make the adoption-vs-status-quo call — that is a design decision for the implementation follow-up, not a research finding — but the research substrate needed to decide is now complete (full inventory of where the schema is/isn't used).

## Questions Remaining (deferred to follow-up implementation/research, not re-investigated this iteration)

- Which remaining router-level allowed-tool grants are unused overgrants after route-specific reconciliation? (carried forward since iteration 5 — still unaddressed; P1-X1's Barter-topology finding is adjacent but does not close this broader question)
- Should `compile-command-contracts.cjs` be wired into a pre-commit/CI hook keyed on the same source paths it digests, and who owns triggering re-compilation? (carried forward since iteration 6 — still unaddressed; directly relevant to preventing P0-D2 from recurring)
- Should `mutation_boundaries:` become a cross-family workflow-YAML convention? (inventory complete per Q4 above; the adoption decision itself is deferred to implementation/design, not research)
- Does canonical skill-graph reindex remove every retired topology node, or are source metadata changes also required? (carried forward since iteration 2 — narrowed but not closed: one sampled file (`system-deep-loop/graph-metadata.json`) is clean; a full sweep of all skills' `graph-metadata.json` was not completed within this iteration's budget)

## Next Focus

This is the final iteration of the 10-iteration batch (`minIterations=maxIterations=10`, `convergenceMode: off`). No further iteration is scheduled within this research run. Recommended next steps for the workflow owner:
1. Route the P0/P1 findings above to an implementation follow-up (sk-code or a new spec-folder task), since this loop is report-only per its constraints.
2. If further research is warranted, open a new deep-research run scoped to the 4 remaining deferred questions above (router allowed-tool overgrant audit; CI-hook wiring decision; mutation_boundaries adoption decision; full skill-graph-metadata sweep) rather than continuing this run past its configured 10-iteration ceiling.
