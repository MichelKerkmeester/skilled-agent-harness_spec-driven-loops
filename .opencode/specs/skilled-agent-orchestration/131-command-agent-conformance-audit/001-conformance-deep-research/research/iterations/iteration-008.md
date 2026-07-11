# Iteration 8: Resolving the Doctor `trigger_phrases` Advisor-Wiring Question

## Focus

Should doctor `_routes.yaml` `trigger_phrases` be actively wired into the advisor's signal map, or is the presentation-menu-driven dispatch intentionally exempt from Gate-2 lexical routing (and the header comment simply wrong)? This question has carried forward unaddressed since iteration 6.

## Actions Taken

1. Read `.opencode/commands/doctor/_routes.yaml` in full (all 10 routes + 2 mcp_subroutes + 1 standalone entry), confirming its header claims `# Consumed by: Skill Advisor lexical lane (per-target trigger_phrases)` and that `trigger_phrases:` lists exist on every route.
2. Traced the advisor's actual doc-frontmatter trigger-phrase harvest code path in both implementations: the Python shim (`skill_advisor.py:810-871`, `_DOC_HARVEST_SUBDIRS = ("references", "assets")`, rooted at `SKILLS_DIR = .opencode/skills`) and the TS daemon (`doc-frontmatter.ts`, referenced from `ENV_REFERENCE.md:639`). Confirmed both walk only `.opencode/skills/*/{references,assets}/*.md` frontmatter blocks — neither ever opens a `.yaml` file, and neither ever looks under `.opencode/commands/`.
3. Confirmed the harvest is itself gated by `SPECKIT_ADVISOR_DOC_TRIGGERS` (opt-in, pinned `true` in all three runtime configs per `ENV_REFERENCE.md:639`) — even the in-scope skills-directory harvest only activates through this flag, and even when active it is structurally incapable of reading `.opencode/commands/doctor/_routes.yaml` because that path is outside both the harvested subdirectory names (`references`/`assets` under a skill, not under a command) and the harvested root (`SKILLS_DIR`, not `.opencode/commands/`).
4. Checked `route-validate.py:46,243-245` (`G1: every route has ≥1 trigger phrase`) — confirmed this validator only enforces non-emptiness as schema hygiene; it does not check or claim consumption, so it gives false confidence that a populated field is functionally wired.
5. Searched the full non-worktree tree for any script/import that reads `_routes.yaml` outside `doctor/scripts/route-validate.{sh,py}` and `doctor/speckit.md` (which loads it purely for target/setup-var resolution, not trigger-phrase harvesting) — zero hits. No harvester of any kind touches this file's `trigger_phrases` field.
6. Reviewed `git log --follow -p` across all revisions of `_routes.yaml` (17+ commits) — the `# Consumed by: Skill Advisor lexical lane` header line has been present since the file's schema was formalized (commit `10b76891c2`, "decouple system-code-graph from CocoIndex") and has never been revised or challenged in any subsequent commit, despite the field never having been wired. This is long-standing unmaintained documentation, not a recent regression.
7. Checked for adjacent instances of the same "documented-as-consumed but not-harvestable" class: confirmed the field-level annotations in `doctor_skill-advisor.yaml:197,227,242` and `doctor_memory.yaml:129` reference the *real*, harvested `derived.trigger_phrases` in `.opencode/skills/{skill}/graph-metadata.json` — a different, correctly-wired field — so those are not instances of the same defect; the defect is isolated to `_routes.yaml`'s own per-route `trigger_phrases:` lists.

## Findings

### Doctor

#### P1: Doctor `_routes.yaml`'s `trigger_phrases:` field is structurally unreachable by the advisor, and its header comment is affirmatively false, not merely stale

The question carried forward since iteration 6 is now resolved with high confidence: doctor `_routes.yaml` `trigger_phrases` are **not** intentionally exempt from Gate-2 lexical routing — there is no design decision to exempt them, because the advisor's doc-frontmatter harvester was never built to look at `.opencode/commands/**` at all, in either runtime implementation (Python shim or TS daemon). Both harvesters are hardcoded to `.opencode/skills/*/{references,assets}/*.md` frontmatter blocks (`_DOC_HARVEST_SUBDIRS = ("references", "assets")` rooted at `SKILLS_DIR`, mirrored by `doc-frontmatter.ts`), and the harvest itself only activates when `SPECKIT_ADVISOR_DOC_TRIGGERS=true` — a flag whose entire purpose (per `ENV_REFERENCE.md:639`) is scoped to "reference/asset doc frontmatter" *inside a skill directory*. A `.yaml` file living under `.opencode/commands/doctor/` is doubly out of scope: wrong file type (never `.yaml`, only `.md`) and wrong root (`.opencode/commands/`, not `.opencode/skills/`). This has been true, unchanged, since the header comment was first written (commit `10b76891c2`) — it was never true and has never been corrected across 17+ subsequent revisions of the file. `route-validate.py`'s `G1` check (`.opencode/commands/doctor/scripts/route-validate.py:46,243-245`) enforces non-emptiness only, giving every route author false confidence that populating the field does something. [SOURCE: .opencode/commands/doctor/_routes.yaml:1-24] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:805-813,849-871] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/doc-frontmatter.ts:23] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:639] [SOURCE: .opencode/commands/doctor/scripts/route-validate.py:46,243-245] [SOURCE: git log --follow -p .opencode/commands/doctor/_routes.yaml, commit 10b76891c2]

Concrete fix: rewrite the `_routes.yaml` header comment (currently `# Consumed by: Skill Advisor lexical lane (per-target trigger_phrases)`) to state the truth — e.g. `# NOTE: these trigger_phrases are NOT currently harvested by the advisor (which only scans .opencode/skills/*/{references,assets}/*.md); /doctor <target> dispatch is presentation-menu/explicit-argv driven only. Field retained for future wiring or documentation purposes.` Additionally, either (a) soften `route-validate.py` `G1`'s wording from "advisor will lose recall" (which asserts a live consumption path that doesn't exist) to something like "recommended for future advisor wiring / operator discoverability," or (b) if live lexical routing to `/doctor <target>` is actually desired, extend the harvester's scope (Python `_DOC_HARVEST_SUBDIRS`/`SKILLS_DIR` and the TS `doc-frontmatter.ts` equivalent) to also walk `.opencode/commands/doctor/_routes.yaml`'s `routes[].trigger_phrases` and `mcp_subroutes[].trigger_phrases` — this is a larger scope change than a doc fix and should be tracked separately if pursued, since it would also require deciding how a matched doctor route's trigger phrase maps to advisor output (there is no "doctor" skill entry in the skill graph to recommend).

## Questions Answered

- **Should doctor `_routes.yaml` trigger_phrases be actively wired into the advisor's signal map, or is the presentation-menu-driven dispatch intentionally exempt from Gate-2 lexical routing (and the header comment simply wrong)?** Resolved: there is no intentional exemption — the header comment is simply wrong, and has been wrong since it was written. The advisor's harvester (both Python and TS implementations) is scoped exclusively to `.opencode/skills/*/{references,assets}/*.md` frontmatter and has never been capable of reading a `.yaml` file under `.opencode/commands/`. This is not a live-collision risk (as iteration 6 also found) and not an ambiguous design tradeoff — it is unmaintained documentation asserting a consumption path that was never implemented. The fix is a doc correction (rewrite the false `# Consumed by:` claim and soften the misleading `G1` validator message); actually wiring the harvest is a separate, larger scope decision this iteration does not recommend as the default fix.

## Questions Remaining

(All carried forward from iterations 1-7, unaddressed by this iteration's narrow focus)

- Which remaining router-level allowed-tool grants are unused overgrants after route-specific reconciliation? (carried forward since iteration 5)
- Should create-agent call the system-spec-kit command workflow directly, or should a new typed handoff field replace the retired `speckit.md` agent lookup? (carried forward since iteration 5)
- Should `compile-command-contracts.cjs` be wired into a pre-commit/CI hook keyed on the same source paths it digests, and who owns triggering re-compilation when `mode-registry.json` or a mode `SKILL.md` changes? (carried forward since iteration 6)
- Should `mutation_boundaries:` become a cross-family workflow-YAML convention, or is it correctly doctor-specific alongside `approval_gates:`/`forbidden_operations:` elsewhere? (carried forward since iteration 6)
- Which command-to-skill and command-to-agent references remain dead beyond the classes already found across iterations 5 and 7 (`speckit.md`, `write.md`, singular `.opencode/agent`)? A full mechanical sweep of every `agent_file:`/`agent_availability` block across all 62 workflow YAMLs beyond `/create`, `/deep`, and `/speckit` families has not yet been done. (carried forward since iteration 7)
- Does canonical skill-graph reindex remove every retired topology node, or are source metadata changes also required? (carried forward since iteration 2)

## Next Focus

Iteration 9 should perform the full mechanical sweep of every `agent_file:`/`agent_availability` block across all 62 workflow YAMLs (beyond the `/create`, `/deep`, and `/speckit` families already covered), cross-checking each named agent path against the 12 live agents in `.claude/agents/` + `.opencode/agents/`, to close the remaining dead-agent-reference open question before the loop's final iteration.

## Sources Consulted

- `.opencode/commands/doctor/_routes.yaml` (full file, all routes)
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:805-871`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/doc-frontmatter.ts:23`
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:639`
- `.opencode/commands/doctor/scripts/route-validate.py:1-50,230-250`
- `.opencode/commands/doctor/assets/doctor_skill-advisor.yaml:194-242`, `doctor_memory.yaml:126-129`
- `.opencode/commands/create/assets/create_skill_auto.yaml`, `create_skill_confirm.yaml`, `create_readme_auto.yaml`, `create_readme_confirm.yaml` (adjacent-class check)
- `git log --follow -p -- .opencode/commands/doctor/_routes.yaml`

## Assessment

- `newInfoRatio`: 0.35
- Novelty justification: this iteration resolves one specific carried-forward open question definitively rather than surfacing new finding classes; it converts iteration 6's "dead wiring, question open" into a fully-cited, code-path-traced closure with a concrete doc-fix recommendation, and rules out both the "intentional exemption" and "same-class defect exists elsewhere" hypotheses. Lower novelty is expected and appropriate for a targeted question-closure iteration late in the loop.
- Confidence: high — traced both the Python and TS harvester implementations directly (not inferred from one side), confirmed the opt-in flag's scope via `ENV_REFERENCE.md`, and confirmed via `git log --follow -p` that the header comment has been wrong since its introduction rather than having regressed from a once-true state.

## Reflection

- Worked: checking both runtime implementations (Python shim AND TS daemon) rather than just one closed the door on a "maybe the other implementation does harvest it" escape hatch.
- Worked: `git log --follow -p` on the single file surfaced the exact commit where the misleading header was introduced and confirmed it was never revised, which is stronger evidence than "currently wrong" — it's "has always been wrong."
- Ruled out: the doctor_skill-advisor.yaml/doctor_memory.yaml trigger_phrases mentions as being the same defect class — those correctly describe the real, harvested `derived.trigger_phrases` field in `graph-metadata.json`, a different mechanism entirely.
