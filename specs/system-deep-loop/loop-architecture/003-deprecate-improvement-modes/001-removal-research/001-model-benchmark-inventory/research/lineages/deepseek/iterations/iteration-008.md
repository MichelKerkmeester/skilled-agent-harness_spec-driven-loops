# Iteration 8: Repo-level surfaces (hooks, env, READMEs, changelogs, external consumers)

## Focus

The repository-level surfaces named by the dispatch: hook trees and configs, `scripts/git-hooks`, env examples, the root `README.md`, the global and packet changelogs, sibling mode READMEs, and whether anything outside the repository consumes the mode.

## Actions Taken

- Swept all hook trees (`.skilled/hooks`, `.claude/hooks`, `.codex/hooks*`, `.cursor/hooks*`, `.devin/hooks*`, `.pi/extensions`) and `.skilled/scripts/git-hooks` for the mode.
- Read the env examples, the root README sections at match sites, the global skill changelogs and the hub/deep-improvement changelogs, and the `deep-review`/`deep-ai-council` READMEs.
- Probed publish manifests for external consumption.

## Findings

1. `.skilled/hooks/hook-flags.env.example:54-55` documents JEV feature flags in terms of model-benchmark usage (reviewer verdict fallback, D4 hallucination grader). **EDIT** both comments [SOURCE: .skilled/hooks/hook-flags.env.example:55]
2. `.env.example:451-452` documents the same two JEV features with benchmark wording. **EDIT** both comment lines [SOURCE: .env.example:451-452]
3. Root `README.md` references the mode at lines 555-556 (loop family description), 649-651 (Lane A/Lane B paragraph), 867-869 (JEV feature bullet), 1242-1243 (command bullet `/deep:model-benchmark`), and 1431-1433 (skills table row). **EDIT** all five sites [SOURCE: README.md:650]
4. Every changelog mention is historical: `.skilled/changelog/skilled/v3+/v3.5.0.0.md:37,129-131`, `v4.0.0.3.md:244,255,353`, `v4.0.0.0.md:111`, `.skilled/skills/system-deep-loop/changelog/v1.5.0.0.md:36`, `v1.5.1.0.md:20`, and the deep-improvement changelogs v1.9.0.0 through v1.19.1.0. **KEEP-AS-HISTORY** (no edits) [SOURCE: .skilled/changelog/skilled/v3+/v3.5.0.0.md:131]
5. `.skilled/skills/system-deep-loop/deep-ai-council/README.md:134` describes `deep-improvement` as running both command lanes. **EDIT** [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/README.md:134]
6. `.skilled/skills/system-deep-loop/deep-review/README.md:176` describes the two lanes. **EDIT** [SOURCE: .skilled/skills/system-deep-loop/deep-review/README.md:176]
7. All seven runtime hook configuration sets and `.skilled/scripts/git-hooks/**` contain no model-benchmark reference (verified sweep) — nothing to change there [SOURCE: .skilled/scripts/git-hooks/pre-commit]
8. External consumption: no publish manifest (root, `.skilled`, `.opencode`, `system-deep-loop` package.json) references the mode, and its identifiers are internal routing keys (command, workflowMode, loopHostMode). Nothing outside the repository consumes it; the only copies are the in-repo mirror trees already classified [INFERENCE: based on the publish-manifest probe plus the repo-wide master sweep]

## Ruled Out

- Editing any changelog: all historical mentions are KEEP-AS-HISTORY.
- Hunting for hook-level registrations: hooks never reference the mode (verified across all seven runtimes).
- Claiming external consumers exist: the probe found none; statement recorded as inference with its basis.

## Dead Ends

- `.pi/extensions` and runtime hook JSONs: no matches.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/hooks/hook-flags.env.example
- .env.example
- README.md
- .skilled/changelog/skilled/v3+/v3.5.0.0.md
- .skilled/changelog/skilled/v4.0.0.0.md
- .skilled/changelog/skilled/v4.0.0.3.md
- .skilled/skills/system-deep-loop/changelog/v1.5.0.0.md
- .skilled/skills/system-deep-loop/changelog/v1.5.1.0.md
- .skilled/skills/system-deep-loop/deep-ai-council/README.md
- .skilled/skills/system-deep-loop/deep-review/README.md
- .skilled/scripts/git-hooks/pre-commit

## Assessment

- New information ratio: 1.0
- Questions addressed: KQ4
- Questions answered: KQ4

## Reflection

- What worked and why: a per-surface sweep kept the READMEs and env files from being missed, and the changelog classification stayed uniform.
- What did not work and why: nothing material.
- What I would do differently: nothing; the external-consumer statement is explicitly marked inference.

## Recommended Next Focus

Iteration 9: indirect wiring — `system-spec-kit` retrieval fixtures and trigger index, `ENV-REFERENCE.md`, `folder-structure.md`, runtime schemas (`model-benchmark-ledger-schema`, `model-benchmark-reducers`, `model-benchmark-sealed-artifacts`, `per-mode-authority-flip`, `blinded-adjudication`, `deep-improvement-common-*`, `legacy-projections`, `write-set-conflict-graph`), runtime unit tests, and the compiled routing stages under `.skilled/bin/lib/compiled-routing/`.
