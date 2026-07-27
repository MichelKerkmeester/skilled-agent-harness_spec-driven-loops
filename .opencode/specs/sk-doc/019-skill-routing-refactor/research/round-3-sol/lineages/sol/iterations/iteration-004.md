# Iteration 4: Full-Tree Cross-Document Link Audit

## Focus
Audit cross-document references throughout the full 019 packet tree, prioritizing parent documents changed by `140266be3e` and then scanning canonical documents under all 21 direct children. Frozen `research/**`, `benchmark/**`, `lineages/**`, review/run records, `*.out`, and `*.log` artifacts were excluded as defect candidates. The route was fixed by dispatch and state as `mode=research target_agent=deep-research`; no sub-dispatch occurred.

## Findings
1. **P1 · NEW (`140266be3e`)** — The parent phase-handoff table points to backticked `020/spec.md` and `021/spec.md`, but neither target exists. The actual parent specs are `020-router-unification-program/spec.md` and `021-documentation-quality-program/spec.md`. `git blame` attributes the broken references directly to `140266be3e`. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:133] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/spec.md:1] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/021-documentation-quality-program/spec.md:1]
2. **P1 · PRE-EXISTING** — The canonical 012 scope table contains stale snake_case repo paths after the sk-doc naming migration: `manual_testing_playbook`, `skill_smart_router.md`, `parent_skill`, `smart_routing.md`, and `parent_skills_nested_packets.md` do not exist at the cited locations. Their live targets use current packet/hyphen names, including `create-manual-testing-playbook`, `skill-smart-router.md`, `parent-skill`, `smart-routing.md`, and `parent-skills-nested-packets.md`. The lines predate `140266be3e` (`9860de9720a5`). [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/spec.md:112] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/spec.md:120-125] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/skill/skill-smart-router.md:1] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md:1]
3. **P1 · PRE-EXISTING** — The canonical 013 task commands and evidence paths consistently use the removed `system-skill-advisor/mcp_server` tree and stale `skill_advisor_hook.md` name. Consequently, the documented `npm --prefix .../mcp_server` verification commands cannot execute against the current hyphen-case package, while the live hook reference is `references/hooks/skill-advisor-hook.md`. The affected task lines predate `140266be3e` (`9860de9720a5`). [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/013-skill-advisor-routing-fixes/tasks.md:67-74] [SOURCE: .opencode/skills/system-skill-advisor/references/hooks/skill-advisor-hook.md:1] [INFERENCE: exact target probes found `.opencode/skills/system-skill-advisor/mcp_server` absent and the current `.opencode/skills/system-skill-advisor/mcp-server` package present]
4. **P2 · PRE-EXISTING** — The nested 020 context index labels destinations as “New location” but writes six of them as `020-router-unification-program/...` from inside that same directory. They fail document-relative resolution by duplicating the parent segment and resolve only when an unstated 019-packet-root base is assumed; the `001-008` range on line 19 is additionally not a literal target. This is an ambiguous nested-reference contract rather than a missing child. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/context-index.md:13-22] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard/spec.md:1] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/spec.md:1]

## Ruled Out
- No broken Markdown link-syntax target survived exact resolution in the non-excluded scan; the actionable defects were backticked path references and nested path labels.
- Historical rename references in the parent `context-index.md` were not reported because the document explicitly marks them as provenance history.
- A broad JSON path heuristic treated canonical `children_ids` as filesystem-relative paths and produced false positives; those IDs are logical spec IDs, so the heuristic output was rejected rather than reported.

## Dead Ends
- Generic backticked filenames such as `SKILL.md`, `mode-registry.json`, and glob examples cannot be treated as local links without contextual base semantics; only references with a verifiable intended target were retained.

## Edge Cases
- Ambiguous input: “repo-rooted” was interpreted as an explicit repository-relative path such as `.opencode/...`; packet-root-relative nested labels were classified separately as ambiguous.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: the JSON heuristic was unsuitable for logical IDs, but exact target checks plus canonical coverage provided sufficient evidence for the four reported findings.

## Sources Consulted
- `.opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:124-134`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/context-index.md:1-118`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/spec.md:112-125`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/013-skill-advisor-routing-fixes/tasks.md:67-74`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/context-index.md:13-22`
- Canonical non-excluded scan: 903 Markdown/JSON files; canonical coverage recorded for all 21 direct children.
- `git blame` and exact filesystem target probes for every reported reference.

## Assessment
- New information ratio: 1.0
- Questions addressed: `q-links`, commit `140266be3e` link attribution, nested reference ambiguity
- Questions answered: `q-links` for canonical Markdown/backticked paths and sampled JSON reference semantics

## Reflection
- What worked and why: separating Markdown links, explicit repo paths, and context-dependent backticks prevented generic filenames from becoming false defects; exact target probes and blame supplied both validity and attribution.
- What did not work and why: treating graph `children_ids` as direct filesystem paths ignored their logical `track/spec-id` schema and falsely marked valid IDs missing.
- What I would do differently: parse JSON keys against their owning schema first, then apply key-specific resolvers instead of one filesystem heuristic.

## Recommended Next Focus
Audit remaining fleet-wide PASS, authority, metric, and enforcement claims against promoted non-frozen evidence, while preserving the max-iterations stop policy regardless of convergence telemetry.
