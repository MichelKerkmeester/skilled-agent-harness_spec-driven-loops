# Iteration 6 - Phase 006 command and agent alignment under the overlay protocols

## Focus

Overlay traceability protocols `skill_agent` and `agent_cross_runtime`: does every surface that describes packet authoring actually name the three things phase 006 promised — the authoring card, the v2.3 token form and the two guard scripts — and do the four doc-authoring agents and their runtime copies line up with what the phase summary says was changed?

## Files Reviewed

- `.skilled/agents/*.md` (all eleven agent definitions, card / token / guard reference counts)
- `.skilled/agents/markdown.md:206-210` (routing table, `spec-doc` row)
- `.skilled/agents/markdown.md` versus `.claude/agents/markdown.md` (diff)
- `.skilled/commands/speckit/*.md` (all seven command surfaces)
- `.skilled/commands/speckit/assets/speckit-plan.yaml:311-313`
- `.skilled/commands/speckit/assets/speckit-complete.yaml:469,1116`
- `.skilled/commands/doctor/` (speckit entry and the card-reference sweep)
- `specs/system-speckit/054-weak-model-spec-authoring/006-speckit-command-and-agent-alignment/implementation-summary.md:68,73`
- `git show d0d9d596c5 -- .skilled/agents/` (the alignment commit's stat and its diff for `code.md`)

## Findings

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The phase 006 summary attributes the card and the filled example to four agent definitions, but three of them carry neither** -- `specs/system-speckit/054-weak-model-spec-authoring/006-speckit-command-and-agent-alignment/implementation-summary.md:68` -- The row reads `.skilled/agents/markdown.md, orchestrate.md, code.md, context.md | Modified | Card and filled example, retired checklist doc dropped`. Counting references across all eleven agents, `spec-authoring-card` appears exactly once, at `markdown.md:208`; `code.md`, `context.md` and `orchestrate.md` return 0 for `spec-authoring-card`, 0 for `templates/examples` and 0 for `templates/core`. The commit that made the change states the narrower truth — "the agents and creator commands no longer send a reader to a checklist.md that has no template" (`git show d0d9d596c5`), and its per-file stat shows `code.md` and `orchestrate.md` at two changed lines each, consistent with a single dead-reference removal. The summary row widened a one-agent route into a four-agent claim.
2. **The plan asset describes authoring and names the guard scripts, but neither the card nor the v2.3 token form, so phase 006's three-part criterion holds for one part** -- `.skilled/commands/speckit/assets/speckit-plan.yaml:313` -- The rule at line 313 tells the workflow to "embed the matching inline scaffold below in the authoring prompt and preserve the required ANCHOR/H2 order from the canonical template", so this asset is a surface that describes authoring. Line 311 supplies the two guard scripts. A search for `spec-authoring-card` across every `.md` and `.yaml` under `.skilled/commands/speckit` returns matches in `speckit-complete.yaml` only (three), and `speckit-plan.yaml` carries no token-form mention either. Phase 006's handoff criterion requires "the card, the v2.3 token and the guard scripts" wherever a surface describes authoring, so the command that writes the plan document satisfies one of the three.

## Traceability Checks

- **`skill_agent` (overlay)**: the `spec-doc` route in `markdown.md:208` is correct and specific — card first, then the matching filled example, with the template described as "the section contract, not a model to copy". This is the shape the criterion wants.
- **`agent_cross_runtime` (overlay)**: `.skilled/agents/markdown.md` versus `.claude/agents/markdown.md` differ only in frontmatter (`mode`/`permission` versus `model`/`tools`) and in the one canonical-path line each runtime is required to state. No semantic drift. `code.md`, `context.md`, `markdown.md` and `orchestrate.md` are mirrored into `.hermes/skills/agent-*` by a generator, so a hand edit cannot diverge there without regenerating.
- **Retired `checklist.md` sweep**: with a pattern that excludes `*-checklist.md`, `rg -n "(^|[^-A-Za-z0-9_])checklist\.md" .skilled/commands .skilled/agents` returns nothing, so the 45-mention remediation in the command assets is complete for the retired template name. The earlier grep hits (`review-checklist.md`, `worktree-checklist.md`, `spec-folder-authoring-checklist.md`) are different files and are not regressions.
- **Doctor entry**: no file under `.skilled/commands/doctor` mentions the card. This matches the phase 006 goal log, which records a read-only re-audit of 91 doctor files with 0 authoring findings, so no row was owed.
- **`feature_catalog_code` and `playbook_capability`**: still deferred, to iteration 7.

## Confirmed-Clean Surfaces

- All seven `speckit/*.md` command surfaces carry zero card references, but only `complete.md` and `plan.md`-adjacent assets describe authoring at all, and `plan.md` itself contains no template, fill or scaffold language beyond the `--start-state placeholder-upgrade` flag, so the absence is not a gap for those files.
- `speckit-complete.yaml` names the card three times, including the sk-code checklist carve-out at line 469, which is the correct place for the "spec-folder authoring now lives in system-spec-kit" pointer.
- The Hermes mirrors (`agent-code`, `agent-context`, `agent-markdown`, `agent-orchestrate`) are generated output and were regenerated in the same commit, so they cannot silently disagree with the four `.skilled` originals.

## Assessment

Dimensions addressed: traceability

Two P2 findings, both accuracy-of-claim rather than behaviour: a summary row that covers three agents it did not touch, and a plan asset that names one third of the three surfaces the criterion requires. The overlay protocols otherwise hold: the one agent that authors spec docs routes correctly to the card, the runtime copies differ only where they must, and the retired template name is gone from the command surface.

## Next Focus

Iteration 7 (maintainability, overlay protocols `feature_catalog_code` and `playbook_capability`): phase 007's catalog, README and playbook alignment and phase 008's execution report. Check that every scenario the packet added is indexed by the playbook, that the catalog rows describe behaviour the shipped code now has, and that the phase 008 report's eight PASS rows correspond to runs whose transcripts exist.

Review verdict: PASS
