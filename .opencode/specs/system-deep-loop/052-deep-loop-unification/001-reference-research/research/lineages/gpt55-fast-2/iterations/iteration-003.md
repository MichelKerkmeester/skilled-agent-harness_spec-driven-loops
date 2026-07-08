# Iteration 003 - Tooling Borrow And External Migration

## Focus

Check the `system-spec-kit` tooling-borrow table and external reference migration plan across commands, agents, READMEs, and advisor corpus.

## Findings

1. The four planned tooling-borrow edits are real and load-bearing. Runtime typecheck and `typeRoots` currently point one level up to `system-spec-kit`; after nesting they need one more hop. `system-spec-kit`'s council tests and Vitest include glob currently point to `../../deep-loop-runtime/...` and `../deep-loop-runtime/...`; after nesting they must point to `system-deep-loop/runtime`. [SOURCE: .opencode/skills/deep-loop-runtime/package.json:10-13] [SOURCE: .opencode/skills/deep-loop-runtime/tsconfig.json:12-14] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/package.json:29-32] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:18-21]

2. The child 003 plan correctly treats advisor migration as more than find/replace. The hot path has `MODE_REGISTRY_PATH` and `MERGED_DEEP_SKILL_ID` in Python, and the TypeScript scorer has the same merged identity plus generated alias projection. The drift guard hardcodes the old mode-registry path and the old merged skill name in the projection hash canonical object. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:83-90] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2568-2587] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:92-110] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:20-27]

3. Corpus and divergence-ledger rows already encode `deep-loop-workflows` as expected output. These should be field-scoped updates with accuracy re-baseline, not blind prompt text rewrites. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json:24-33] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json:155-172]

4. Commands and agents have duplicated surfaces. `.opencode/agents` and `.claude/agents` both carry deep-loop paths, and `/deep:*` command YAML assets contain many direct paths to both old skills. This supports child 003's requirement to update both runtime agent trees and regenerate compiled command contracts rather than hand-editing compiled output. [SOURCE: .opencode/agents/orchestrate.md:163-206] [SOURCE: .claude/agents/orchestrate.md:152-195] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:66-77] [SOURCE: .opencode/commands/deep/review.md:9]

5. Root README text is user-facing and must migrate, but command names should remain `/deep:*`. The README describes `deep-loop-workflows` and `deep-loop-runtime` as the public loop pair, so it will be confusing if left stale after the identity merge. [SOURCE: README.md:781-868] [SOURCE: README.md:912-912]

## Ruled Out

- Updating `.opencode/specs/**` historical mentions is not necessary for runtime behavior.
- Hand-editing compiled `.contract.md` files is unsafe because the contract generation flow owns hashes.

## Next Focus

Evaluate whether GLM-5.2 to MiMo-v2.5-Pro fallback should be wired, and what safe wiring requires.
