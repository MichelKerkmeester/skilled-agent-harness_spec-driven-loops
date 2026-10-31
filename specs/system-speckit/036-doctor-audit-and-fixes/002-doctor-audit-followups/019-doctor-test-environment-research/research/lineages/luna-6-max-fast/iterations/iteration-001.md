# Iteration 001 — Doctor contract gaps

## Focus
Resolve corpus-pollution severity semantics in `/doctor:speckit` and the missing unknown-flag contract in `/doctor:mcp`.

## Actions Taken
- Read the retrieval doctor’s severity, status, and recommendation rules; inspected the committed diagnostics and lookup scoring path.
- Read DOC-349 and DOC-350 and the generator’s phrase-quality tests.
- Read the MCP router/presentation schemas and compared the other doctor routers’ unknown-argument contracts.

## Findings

### 1. Make corpus quality advisory, not staleness severity
The doctor currently marks `corpus_pollution` medium for any non-zero phrase-quality bucket, reports it in `staleness_classes`, includes it in `severity_max`, and recommends cleanup/regeneration; its recommendation rationale says those phrases “never rank.” A fresh corpus therefore cannot have zero severity while any quality bucket remains nonzero. [SOURCE: .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:135-137] [SOURCE: .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:191-205] [SOURCE: .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:211-215]

The committed diagnostics contain 251 flagged phrases (2 editor-fallback, 32 folder-token-fallback, 3 generic-workflow-word, 28 numeric-only, 19 prose-sentence, 166 single-token, and 1 stop-word-only) alongside 33,468 `ok`, for 33,719 total; the flagged share is 251 / 33,719 ≈ 0.74%. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json:32-51]

The blanket “never rank” explanation is inaccurate. The scorer returns exact equality at 1.0 before its short-phrase guard; non-exact phrases with fewer than two tokens do not match, while phrase/query containment scores 0.94/0.88 and token overlap scores when query coverage is at least 0.8. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs:120-150] The lookup scores candidate phrases, retains a document’s best phrase, filters zero scores only in scoring-only mode, and sorts results by score and match class; it does not filter using `phraseQuality`. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:171-210] The generator uses phrase quality as a diagnostic bucket while constructing the phrase table; it does not remove those entries. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:253-296]

**Recommendation:** keep phrase-quality counts and share visible in a `quality_advisories`/diagnostics section, but remove `corpus_pollution` from the staleness class map and `severity_max`. Do not impose an arbitrary percentage threshold before measuring harmful retrievals; do not bulk-clean the corpus or filter phrases in the generator merely to make the status green. Clean individual source phrases only when a measured lookup or precision failure justifies it. This makes `OK` reachable for a fresh index while retaining useful hygiene evidence.

DOC-349 currently calls pollution the sole non-zero staleness class and expects a medium pollution recommendation; change it to expect `STATUS_OK`, the count/share advisory, and no pollution severity. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-speckit-retrieval-healthy.md:26-30] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-speckit-retrieval-healthy.md:55-59] DOC-350 should continue to expect `index_content_stale` and `STATUS_STALE`; assert that phrase advisory counts do not add to the stale severity or change its regeneration recommendation. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-speckit-stale-index.md:26-30] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-speckit-stale-index.md:56-60]

Keep the generator’s phrase-quality tests, which assert diagnostic class counts and folder-token ownership behavior. Add doctor-level contract coverage for a fresh index with nonzero phrase counts yielding `OK`, and for a stale index retaining stale severity independently of the advisory. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:562-592]

### 2. Distinguish unknown flags from known cross-action flags
`/doctor:mcp` parses the selected action’s schema and documents only the cross-sub-action error; its install schema accepts `--runtime`, and debug accepts `--fix`. [SOURCE: .skilled/commands/doctor/mcp.md:42-65] The presentation defines only unknown-sub-action and cross-sub-action flag errors. [SOURCE: .skilled/commands/doctor/assets/doctor-mcp-presentation.txt:22-45] The route manifest confirms the per-action allowed flags. [SOURCE: .skilled/commands/doctor/_routes.yaml:262-280]

For a recognized action, classify a flag as unknown only if it belongs to neither action’s known schema; reject it before loading YAML with an error such as `Unknown flag '--server' for /doctor:mcp install. Valid flags: --runtime <name>.` and `STATUS=FAIL ERROR="unknown_flag"`. A known flag exclusive to the other action should continue to produce `cross_sub_action_flag_injection` with the existing hint. Update both `mcp.md` and the presentation; keep the schemas in `_routes.yaml` as the validity source. Add DOC-380 covering `install --server`, proving rejection happens before workflow execution and showing the valid-flags hint.

This matches existing routers: `/doctor:git` and `/doctor:skill-advisor` reject unknown/cross-target flags; `/doctor:speckit` rejects any other positional or flag; `/doctor:env` rejects unknown flags and extra selectors; `/doctor:runtime-mirrors` takes no arguments; `/doctor:deep-loop` allows only `--scope`; and `/doctor:update` explicitly rejects both cross-action and unknown flags before YAML load. [SOURCE: .skilled/commands/doctor/git.md:41-45] [SOURCE: .skilled/commands/doctor/skill-advisor.md:41-47] [SOURCE: .skilled/commands/doctor/speckit.md:31-37] [SOURCE: .skilled/commands/doctor/env.md:27-33] [SOURCE: .skilled/commands/doctor/runtime-mirrors.md:29-35] [SOURCE: .skilled/commands/doctor/deep-loop.md:29-35] [SOURCE: .skilled/commands/doctor/update.md:35-45]

## Questions Answered
- What should /doctor:speckit do with non-zero phraseQuality diagnostics, given the lookup ranking behavior, and how should DOC-349/DOC-350 and tests change?
- What unknown-flag error should /doctor:mcp add, and how do the other doctor command contracts handle unknown arguments today?

## Questions Remaining
- How to build and reset a local `/doctor:update` fixture that reaches customized, conflict, removed, and local-only unit statuses across all five actions.
- Which doctor playbook scenarios should share it, and which exact files plus new scenarios are required.

## Next Focus
Iteration 2: inspect updater classification, release-base, apply/rollback and worktree tooling, then map the exact playbook scenario files for the other doctor suites.

## Sources Consulted
- `.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/{fixtures/generation-diagnostics.json,lib/normalize.mjs,lookup-trigger-index.mjs,generate-trigger-index.mjs}`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts`
- DOC-349 and DOC-350 retrieval playbook scenarios
- `/doctor:mcp` command, presentation, route manifest, and the other doctor router contracts
- `.skilled/commands/deep/assets/deep-research-auto.yaml:452-514`

## Assessment
The retrieval and argument-routing contracts are unambiguous. The status change is a recommendation grounded in lookup behavior; the exact report-field label should be chosen consistently by the implementation owner. No live command was executed.

## Reflection
The original severity couples persistent source-quality diagnostics to freshness. The error text also collapses unrecognized flags with a separate cross-action misuse case. Both can be fixed at the owning contract layer without changing lookup semantics or route schemas.

## Recommended Next Focus
Use Git-tree comparisons and updater source contracts to design a low-cost persistent test fixture without executing a checkout or changing the worktree.

## SCOPE VIOLATIONS
The workflow’s pre-init spec branch may create or edit `{spec_folder}/spec.md` and run strict validation after that edit. Those paths are outside the user-authorized lineage write surface, so this branch was not executed and no spec file was changed. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:452-514]
