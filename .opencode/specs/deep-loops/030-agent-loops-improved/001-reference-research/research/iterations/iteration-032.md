# Iteration 32: S4-08 Advisor Routing Registry Projection

## Focus

[S4-08] How can the `advisorRouting` projection be kept from drifting from `mode-registry.json`, and should the drift guard become a generator from registry to advisor maps?

This pass maps the loop-cli centralization pattern onto our deep-loop parent-skill routing stack. The question is not whether the advisor should read `mode-registry.json` at runtime; the existing local contract already rejects that. The sharper backlog item is whether the hand-coded advisor maps should be generated from the registry, then checked for freshness.

## Actions Taken

- Loaded the deep-research iteration/output contract and used the dispatch-specific delta-file rule instead of appending to the shared state log.
- Checked prior research and the registry: iteration 30 only left S4-08 as a next focus, and the findings registry still has S4-08 unresolved.
- Mined loop-cli-main for the pointed reference pattern: centralized `i18n/en.json` plus typed translator, centralized `config/constants.ts`, and the architecture note that strings and magic numbers live in those central surfaces.
- Mapped OUR target surfaces: `mode-registry.json`, the TS alias/mode projection, the Python deep routing map, the current drift-guard test, and parent-skill scaffolder validation.
- Searched kasper for a comparable mode-registry or advisor-projection generator pattern. It has constants and registries, but no directly relevant mode-routing projection source for this focus.

## Findings

1. **Rank 1 - Replace equality-only drift guard with generator freshness.**

   Reference mechanism: loop-cli centralizes user-facing strings in one JSON catalog and exposes a typed translator over it: `src/i18n/index.ts` imports `en.json` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/i18n/index.ts:1`], derives `I18nKey` from that source [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/i18n/index.ts:3`], and resolves all calls through `t(key, params)` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/i18n/index.ts:9`]. The architecture doc states that all user-facing strings are centralized under `src/i18n/` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/ARCHITECTURE.md:216`].

   Exact OUR target file: `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`. It already reads the registry [TARGET: `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:32`], computes a projection from `advisorRouting` [TARGET: `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:48`], and asserts Python/TS maps equal it [TARGET: `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:82`; TARGET: `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:88`].

   Backlog item: add a registry-to-projection generator and make this test validate generated freshness, not just hand-maintained equality. The generator should read `.opencode/skills/deep-loop-workflows/mode-registry.json` as the source of truth, emit or compare the TS and Python projection fragments, and fail with a precise update hint when generated output is stale.

   Why it helps: the current guard catches drift after a human updates both sides incorrectly; a generator removes most hand-sync work while preserving the existing no-runtime-registry-read constraint.

   Port difficulty: med. Tag: quick-win.

2. **Rank 2 - Generate the TS alias/mode projection from `advisorRouting.legacyAliases`.**

   Reference mechanism: loop-cli keeps a primary color map and derives the secondary key list from it: `PROJECT_COLORS` is the source object [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/config/constants.ts:29`] and `PROJECT_COLOR_KEYS` is derived from that object [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/config/constants.ts:38`].

   Exact OUR target file: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`. `RAW_ALIAS_GROUPS` repeats alias sets by hand [TARGET: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:5`], and `DEEP_MODE_BY_CANONICAL` repeats the registry's lexical plus alias-fold projection [TARGET: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:96`]. The source data already exists in registry `advisorRouting` blocks for research [TARGET: `.opencode/skills/deep-loop-workflows/mode-registry.json:42`], review [TARGET: `.opencode/skills/deep-loop-workflows/mode-registry.json:58`], ai-council [TARGET: `.opencode/skills/deep-loop-workflows/mode-registry.json:74`], and agent-improvement [TARGET: `.opencode/skills/deep-loop-workflows/mode-registry.json:92`].

   Backlog item: generate the deep-loop subset of `RAW_ALIAS_GROUPS` and `DEEP_MODE_BY_CANONICAL` from `mode-registry.json`, while leaving non-deep alias groups in `aliases.ts`. The generated block can be committed as a stable artifact or emitted into a small adjacent module imported by `aliases.ts`.

   Why it helps: adding a new lexical or alias-fold mode currently requires editing the registry, alias group, canonical-mode map, and drift test expectations. A generated projection collapses that to registry plus generator freshness.

   Port difficulty: med. Tag: quick-win.

3. **Rank 3 - Generate the Python deep routing set/map, but keep weighted regex behavior in code.**

   Reference mechanism: loop-cli centralizes constants and strings, but does not move execution behavior into data files. Its architecture separates `src/config/constants.ts` for magic numbers [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/ARCHITECTURE.md:213`] from `src/i18n/` for strings [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/ARCHITECTURE.md:216`], and the constants file contains static values such as `POLL_MS`, timeouts, and log limits [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/config/constants.ts:1`].

   Exact OUR target file: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`. `DEEP_ROUTING_SKILLS` and `DEEP_ROUTING_MODE_BY_KEY` are hand-coded [TARGET: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2309`; TARGET: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2322`], while lexical scoring behavior starts in `DEEP_ROUTING_LEXICAL_PATTERNS` [TARGET: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2328`].

   Backlog item: generate only the structural set/map from registry `routingClass == "lexical"` and leave regex weights/patterns in Python. Add a guard that every generated lexical key has a corresponding Python lexical pattern group.

   Why it helps: this preserves the current hot-path and fixture-sensitive scoring behavior while removing the duplicated "which modes exist and what workflowMode do they project to?" list.

   Port difficulty: med. Tag: quick-win.

4. **Rank 4 - Update the parent-skill scaffolder so future lexical modes are not born inert.**

   Reference mechanism: loop-cli's architecture makes centralization part of the project structure, not a post-hoc reminder: config constants and i18n are named architectural surfaces [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/ARCHITECTURE.md:213`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/ARCHITECTURE.md:216`].

   Exact OUR target file: `.opencode/commands/create/assets/create_parent_skill_auto.yaml`. The scaffolder creates or updates `mode-registry.json` with `advisorRouting` [TARGET: `.opencode/commands/create/assets/create_parent_skill_auto.yaml:281`] and validates the block [TARGET: `.opencode/commands/create/assets/create_parent_skill_auto.yaml:297`], but completion still emits a warning that lexical/alias-fold modes are inert until a human hand-adds projection-map entries and a drift guard [TARGET: `.opencode/commands/create/assets/create_parent_skill_auto.yaml:315`; TARGET: `.opencode/commands/create/assets/create_parent_skill_auto.yaml:323`].

   Backlog item: after registry generation, run the projection generator in check-or-write mode. For new parent skills, scaffold the guard and generated projection path automatically. The completion warning should become a freshness result, not a manual follow-up.

   Why it helps: S4-08 is not only a deep-loop cleanup. The creation workflow currently institutionalizes the drift-prone manual step for every future parent skill with lexical or alias-fold routing.

   Port difficulty: easy. Tag: quick-win.

## Questions Answered

- S4-08: Yes, the drift guard should become generator-backed. The registry should remain the authoritative source, the advisor should still avoid runtime reads of a foreign skill's registry, and generated projection artifacts should be checked in CI.
- The nearest loop-cli analogue is not "read JSON at runtime everywhere"; it is "centralize the source data, derive typed or secondary surfaces from it, and keep behavior-specific code in code."
- Kasper did not add a directly relevant routing-projection pattern for this focus; its registry hits are state/plugin internals rather than mode-advisor projection contracts.

## Questions Remaining

- Choose generated artifact shape: committed generated modules versus a check-mode generator that prints the expected patch. Committed modules fit the current no-runtime-cross-skill-read constraint best.
- Decide whether the generator is deep-loop-specific first or generic for all parent skills. The scaffolder target argues for generic, but the current worked example is still deep-loop-specific.
- Decide how much Python alias data should be generated. The safe boundary is structural keys and workflow modes; regex weights should stay in code unless a later pass designs an escaping-safe fixture format.

## Next Focus

[S4-09] What from loop-cli's `/ob-autopilot` propose -> apply -> archive -> merge pipeline should speckit implement/complete adopt for unattended runs?
