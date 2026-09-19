# Resource Map — staleness (in-process emission)

Hand-emitted by the lineage process from this lineage's converged deltas (deltas/iter-001.jsonl through deltas/iter-005.jsonl), because the shipped emitter (reduce-state.cjs --emit-resource-map) resolves its paths from a spec folder and would write outside the bound lineage directory; the same satisfaction the fan-out invocation grants the executor-dispatch and reducer steps. Recorded here, in the registry notes, and in research.md §2.

Topic: which parts of AGENTS.md no longer describe reality (class one), and which explain what a delegate already owns (class two).

## Evidence-derived sections (counts are finding+observation records per section)

- Documents (5): AGENTS.md:263/266/270/303/463 (the checklist.md group), AGENTS.md:99 (the advisor invocation), AGENTS.md:110-112 (the advisor metadata paragraph), AGENTS.md:262/272-278 (the validate.sh contract), AGENTS.md:315 (the retrieval features) — the clauses the audit measured, each paired with its delegate.
- Scripts (6): create.sh:12-16,304-308,450-456; the skill-advisor shim:28-30,62-69; recommend-level.sh:8-24; lookup/generate-trigger-index.mjs; worktree-naming.sh (via shared-patterns.md:34); .opencode/hooks/goal/bin/goal.cjs.
- Skills (7): sk-git (SKILL.md:79,297-321 + the workflow-playbook + shared-patterns), sk-doc/sk-create-skill (the metadata contract:32,40-41,65-77), mcp-code-mode (SKILL.md:4,258 + naming-convention.md:578), sk-code (SKILL.md:50), system-skill-advisor (ARCHITECTURE.md), system-spec-kit (SKILL.md:59), system-deep-loop (this loop's own runtime).
- References (7): validation-rules.md:35,757-775; save-workflow.md:24,151-152,211-244,553-578; retrieval-conventions.md:40,64,167-173; template-mapping.md:70,159,161; folder-structure.md (0 hits); uncertainty-and-honesty.md:48-49,62,72; blast-radius.md:72.
- Commands/configs (5): .opencode/commands/{doctor,create,design}, .utcp_config.json:86-95 (figma), .claude/mcp.json, .codex/config.toml, .opencode/agents/design.md.
- Themes: (1) the completion rule's checklist.md group — one cause, five places, the delegates' fixed answers; (2) the documented-vs-built gap — the advisor invocation needs the compiled CLI; (3) the duplication pattern — the specimen and four of five nominated paragraphs reduce to pointers, while the keeps (session state, question-time vocabulary, promise-time honesty, the non-hook fire sentence, section 8's summaries) are the clauses no delegate reaches.
