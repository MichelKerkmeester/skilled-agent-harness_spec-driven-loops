# Deep Research Dashboard: repo-wide goal surfaces (lineage `deepseek`)

Session: `fanout-deepseek-1789192823658-autusz` · executor `cli-pi model=deepseek-v4.1-flash`
Stop policy: `max-iterations` (5) · convergence threshold 0.05 (telemetry only)

| Iteration | Ring | Status | newInfoRatio | Findings | Contradictions named |
|---|---|---|---|---|---|
| 1 | The goal engine (`.opencode/hooks/goal`) | complete | 0.95 | 9 | 5 |
| 2 | Every runtime surface | complete | 0.88 | 9 (+1 correction to R1-F7) | 6 |
| 3 | Spec-kit's own goal contract | complete | 0.86 | 6 (+1 narrowing of R2-F8) | 4 |
| 4 | Everything else that touches a goal | complete | 0.80 | 11 (+1 downgrade of R1-F1) | 4 |
| 5 | The whole picture | complete | 0.30 | 1 + register (C1–C15) | 15 reconciled |

## Ring coverage

### Ring 1 — the goal engine

| Surface | Path | Read |
|---|---|---|
| Slice module | `.opencode/hooks/goal/lib/goal-slice.cjs` | yes |
| Core | `.opencode/hooks/goal/lib/goal-core.cjs` | yes |
| Manage CLI | `.opencode/hooks/goal/bin/goal.cjs` | yes |
| Engine docs | `.opencode/hooks/goal/README.md`, `goal-plugin.md` | yes |
| Adapters | `pi/goal-context.ts`, `cursor/goal-inject.mjs`, `devin/goal-inject.mjs` | yes |
| Tests | `lib/*.test.cjs`, `bin/goal.test.cjs`, `pi/*.test.mjs`, `cursor/*.test.mjs`, `devin/*.test.mjs` | yes |
| Shared flags | `hooks/shared/hook-flags.cjs`, live `hook-flags.env` + example | yes |

### Ring 2 — every runtime surface

| Surface | Path | Read |
|---|---|---|
| OpenCode plugin | `.opencode/plugins/opencode-goal.js` (3372 lines) + 8 test suites | yes |
| Registries | `.cursor/hooks.json`, `.devin/hooks.v1.json`, `hook-registry.json:506-547`, `sync-hook-registrations.cjs` | yes |
| Command surfaces | `.opencode/commands/goal-opencode.md`, `.cursor/commands/goal-cursor.md`, `.pi/prompts/goal-pi.md` | yes |
| Discovery paths | `.pi/extensions/goal-context.ts` symlink, `.pi/settings.json`, `.opencode/hooks/README.md`, `injection-contract.md` | yes |
| Claude/Codex border | `.claude/commands` (no goal file), `.codex/prompts` (none), `.codex/hooks*` (none) | yes |

### Ring 3 — spec-kit's own goal contract

| Surface | Path | Read |
|---|---|---|
| Budget manifest | `templates/spec-kit-docs.json` `goalDurableBudget` | yes |
| Validator | `runtime/lib/validation/spec-doc-structure.ts` + dist twin | yes |
| Resolver | `runtime/lib/templates/level-contract-resolver.ts` + dist twin | yes |
| Template | `templates/addons/goal.md.tmpl` | yes |
| Rules + playbook | `references/validation/validation-rules.md` §12, `references/workflows/goal-set-string-playbook.md` | yes |
| Workflow assets | `speckit-{plan,complete,implement,resume-auto,resume-confirm}.{yaml,md,txt}` + offer-contract test | yes |
| Retrieval | `runtime/data/trigger-index.json` | yes |

### Ring 4 — everything else that touches a goal

| Surface | Path | Read |
|---|---|---|
| Root instructions | `AGENTS.md:291-297`, `:468`; `README.md:854-866`; `REPO RULES.md` + `repo-rules/*` (zero goal text) | yes |
| Hook hub | `hooks/README.md` (concern table, matrix, tree), `coverage-rationale.md` | yes |
| Shared flag docs | `shared/README.md`, `hook-flags.test.cjs`, live vs example env file | yes |
| Env rosters | `.env.example`, `runtime/ENV-REFERENCE.md` | yes |
| Catalogues | spec-kit, skill-advisor, cli-external-orchestration feature catalogues | yes |
| Playbooks | 454, CL-007, CE-P03, CC-029, CU-027, DV-022, CO-039, PI-021 | yes |
| Scaffold metadata | `create.sh`, `template-structure.js`, `graph-metadata-parser.ts`, `check-template-staleness.sh`, template README/EXTENSION-GUIDE | yes |
| Template tests | `scaffold-golden-snapshots`, `template-version-parity`, `spec-doc-structure` vitest suites | yes |
| Advisor metadata | `leaf-aliases.json`, `leaf-manifest.json` | yes |
| Collision surfaces | `deep-review-auto.yaml:373-376` (`goal-file-manifest.txt`), `mcp-click-up` goals card, generic prose hits | yes |

### Ring 5 — the whole picture

| Surface | Artifact | Written |
|---|---|---|
| Reconciled register (C1–C15), unowned surfaces, reader traps, defect sorting | `research.md`, `iterations/iteration-005.md` | yes |
| Stragglers read | `save.md:61`, `template-style-guide.md:42-45`, `recursive-child-manifest.vitest.ts:14-22`, `check-goal-file-manifest.sh`, retrieval fixtures, deep-loop harness docs | yes |
| Convergence verdict | `convergence-report.md` | yes |

## Working notes

- Write surface is the lineage directory. The append gateway is deliberately not invoked;
  see the deviation record in `deep-research-state.jsonl` and `deep-research-config.json`.
- `containment/` (13 MB of other packets' baseline copies) is harness scaffolding, not
  evidence, and is never cited.
- Ring 4 ran the plugin suites as observed evidence: `node --test .opencode/plugins/tests/opencode-goal-*.test.cjs`
  → 8 suites, 137 tests, 137 pass (recorded under R4-F5).
- `findings-registry.json` is regenerated from the five delta files by
  `logs/registry-build.cjs`, so it always mirrors the deltas rather than a hand summary.
- Final shape: 36 findings, 2 corrections, 4 resolved questions, 15 reconciled contradictions,
  8 unowned surfaces, 12 reader traps. Stopped on the max-iterations cap; not converged.
