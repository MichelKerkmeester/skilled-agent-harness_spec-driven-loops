# Iteration 009 — Build, Test, and Verification Surface

## Focus

Identify executable gates that prove the provider is gone without breaking shared runtime behavior.

## Findings

1. The retiring skill is a self-contained package (`.opencode/skills/system-code-graph/package.json`) with build/typecheck/test scripts and 191 exact-identity files in its owned tree. Do not spend migration effort making that package green after the deletion commit; use its pre-removal tests only as a rollback baseline.
2. External live exact-token classification found 26 compiled `dist` files, 60 test/stress files, 164 documentation files, and 107 runtime/configuration files after excluding archives and the owned skill. Counts are triage signals, not blind edit counts.
3. Spec Kit must be rebuilt from source after removing `code-graph-boundary.ts`, routing nudges, session/bootstrap enrichment, shared contracts, and public exports. Its package exposes `npm run typecheck`, `npm run build`, and `npm run test`; dist freshness makes source-only removal invalid.
4. Dedicated launcher tests (`.opencode/bin/mk-code-index-launcher-*.vitest.ts`), code-index cells in `cli-offline-smoke.cjs` / `cli-exit-taxonomy-smoke.cjs`, graph plugin tests, and post-commit graph invalidation tests should be removed. Mixed cleanup, process-liveness, hook, context-server, session, layer-definition, and structural-contract suites must be updated and retained.
5. Test expectations in Spec Kit span direct boundary tests, graph-first routing nudges, session bootstrap/recovery, passive enrichment, hook precompact/session-start behavior, OpenCode plugins, orphan sweeper behavior, trust vocabulary, context metrics, and stress harnesses. Removing production branches without rewriting these expectations leaves false failures or, worse, stale compiled fixtures.
6. Configuration syntax must be validated independently for JSON, JSON-with-comments assumptions, and TOML after deleting MCP blocks. Symlink aliases should resolve to the same physical file after edits.
7. Negative runtime probes are required: tool discovery must not list `mk_code_index` or any `code_graph_*` tool; starting each supported client must not shell out to `mk-code-index-launcher.cjs`; doctor/install routes must not offer reinstallation; a cold and warm session must fall back to `rg`/filesystem discovery without graph recovery prompts.
8. Hook verification must cover repository-local Claude/Codex/Devin/Cursor/OpenCode surfaces plus the installed Codex copy. The current `install-codex-hooks.mjs --check` result is `DRIFT .../.codex/hooks.json (structure=1)`, so the final gate cannot stop at repository config.
9. Process/data verification must check no live launcher/server process, `/tmp/mk-code-index` socket tree, PID/lease marker, freshness state, ignored database, worktree graph DB, or graph-specific environment export remains unintentionally. Data removal is a separate destructive step with a rollback decision.
10. Final residual search must use `rg --hidden --no-ignore`, classify expected archive hits, and fail on exact identities in live paths. A generic “graph” zero-hit gate is invalid because Spec Memory causal/knowledge graphs, Skill Advisor’s skill graph, and deep-loop coverage/council graphs remain supported.

## Proposed Gate Matrix

1. Parse all runtime configs and verify symlink identity.
2. Typecheck/build/test Spec Kit and any changed shared packages.
3. Run retained mixed hook/plugin/launcher/cleanup/doctor tests.
4. Run the isolation workflow’s surviving Skill Advisor checks.
5. Run agent/command mirror parity and compiled-contract freshness checks.
6. Run `install-codex-hooks.mjs --check` after installation refresh.
7. Probe tool discovery and client startup negatively.
8. Inspect process/socket/PID/database residue.
9. Run classified exact-identity residual sweep.
10. Run the repository’s full applicable validation gate and report baseline delta.

## Telemetry

- Findings: 10
- New-information ratio: 0.51
- Convergence: above threshold; telemetry only under `max-iterations`
- Next angle: adversarial residual sweep for names, aliases, indirect shell-outs, and false-positive subsystem collisions
