# Alignment triage

Run folder: `/Users/michelkerkmeester/.local/state/local-skilled-alignment/383-mistral-vibe-runtime/20261115T063605Z`. Recheck folder: `/Users/michelkerkmeester/.local/state/local-skilled-alignment/383-mistral-vibe-runtime/20261115T081518Z`.

Scope rule: a finding counts only when this branch's own work introduced it or made a true statement false. A line whose blame commit is an ancestor of the base `99d197475d9`, or another session's commit merged from main, is out of scope.

Rows: 58, one per `findings.json` entry. out of scope 6, confirmed in scope 51, deferred 1. The critic re-listed many lane findings under the same id, so most lane findings appear twice: once from the lane and once from the critic.

| # | Id | Source | Severity | Surface | Disposition | Evidence |
|---|---|---|---|---|---|---|
| 1 | BAT-02 | battery | P0 | S1 | out of scope | By design: the only hit is the untracked `sample-bad.ts` fixture the post-edit-quality scenario writes on purpose. |
| 2 | BAT-03 | battery | P0 | S3 | confirmed in scope | fixed: `feature-catalog/mistral-vibe-dispatch-mode/mistral-vibe-dispatch-mode.md` frontmatter now carries the roster clause. `validate_catalog_package.py` exits 0. |
| 3 | A-1 | A | P1 | S1 | out of scope | Pre-existing: blame `d136c791f60` is an ancestor of the base (critic override). |
| 4 | D-01 | D | P1 | S10 | confirmed in scope | fixed: `.skilled/agents/orchestrate.md` Rule 7 drops the bare `vibe` and says it names no executor. The Claude, Pi and Codex forks were edited and the DSH and Vibe mirrors regenerated. `check-agent-mirror-sync.cjs --all` prints OK. The recheck lists it under needs review because the file changed differently from the lane's literal fix. |
| 5 | D-01 | critic | P1 | S10 | confirmed in scope | fixed: `.skilled/agents/orchestrate.md` Rule 7 drops the bare `vibe` and says it names no executor. The Claude, Pi and Codex forks were edited and the DSH and Vibe mirrors regenerated. `check-agent-mirror-sync.cjs --all` prints OK. The recheck lists it under needs review because the file changed differently from the lane's literal fix. |
| 6 | B-01 | B | P1 | S2 | confirmed in scope | fixed: six to seven rules, with `rendered-home-hooks` named, in `cli-mistral-vibe/SKILL.md`, `README.md`, `ROUTER.md`, `assets/prompt-quality-card.md`, `references/cli-reference.md`, `changelog/v1.0.0.0.md` and `manual-testing-playbook/manual-testing-playbook.md`. |
| 7 | B-01 | critic | P1 | S2 | confirmed in scope | fixed: six to seven rules, with `rendered-home-hooks` named, in `cli-mistral-vibe/SKILL.md`, `README.md`, `ROUTER.md`, `assets/prompt-quality-card.md`, `references/cli-reference.md`, `changelog/v1.0.0.0.md` and `manual-testing-playbook/manual-testing-playbook.md`. |
| 8 | B-02 | B | P1 | S2 | confirmed in scope | fixed: `cli-mistral-vibe/references/cli-reference.md` dispatch line chains the render, the table has a `rendered-home-hooks` row, and the count reads seven. `evaluateDispatch` returns no violation for the line. |
| 9 | B-02 | critic | P1 | S2 | confirmed in scope | fixed: `cli-mistral-vibe/references/cli-reference.md` dispatch line chains the render, the table has a `rendered-home-hooks` row, and the count reads seven. `evaluateDispatch` returns no violation for the line. |
| 10 | B-03 | B | P1 | S2 | confirmed in scope | fixed: `cli-mistral-vibe/README.md` Step 3 run line chains the render and names `VIBE_HOME` itself. `evaluateDispatch` returns no violation, while the old line is refused with `isolated-vibe-home`. |
| 11 | B-03 | critic | P1 | S2 | confirmed in scope | fixed: `cli-mistral-vibe/README.md` Step 3 run line chains the render and names `VIBE_HOME` itself. `evaluateDispatch` returns no violation, while the old line is refused with `isolated-vibe-home`. |
| 12 | B-04 | B | P1 | S2 | confirmed in scope | fixed: `cli-mistral-vibe/ROUTER.md` overview names the hub's `mode-registry.json` and `hub-router.json` rows instead of saying no hub row routes here. |
| 13 | B-04 | critic | P1 | S2 | confirmed in scope | fixed: `cli-mistral-vibe/ROUTER.md` overview names the hub's `mode-registry.json` and `hub-router.json` rows instead of saying no hub row routes here. |
| 14 | B-05 | B | P1 | S2 | confirmed in scope | fixed: `cli-mistral-vibe/SKILL.md` section 8 links `ROUTER.md` and drops the dangling-router sentence. |
| 15 | B-05 | critic | P1 | S2 | confirmed in scope | fixed: `cli-mistral-vibe/SKILL.md` section 8 links `ROUTER.md` and drops the dangling-router sentence. |
| 16 | B-06 | B | P1 | S2 | confirmed in scope | fixed: `cli-mistral-vibe/references/runtime-folder-and-sync.md` Status and section 4 describe the shipped folder and generators. |
| 17 | B-06 | critic | P1 | S2 | confirmed in scope | fixed: `cli-mistral-vibe/references/runtime-folder-and-sync.md` Status and section 4 describe the shipped folder and generators. |
| 18 | X-07 | critic | P1 | S2 | confirmed in scope | fixed by operator decision (the doc in the skill naming it is the guard): `cli-mistral-vibe/SKILL.md` opens with a self-invocation refusal and a When NOT to Use bullet keyed on `VIBE_SESSION=1`, which Vibe 3.1.2 sets on every spawned shell (`vibe/core/utils/shell.py:10`). The playbook recursion line and `guards-and-hooks.md` cite it. |
| 19 | B-08 | B | P1 | S3 | confirmed in scope | fixed: same change as BAT-03. |
| 20 | B-08 | critic | P1 | S3 | confirmed in scope | fixed: same change as BAT-03. |
| 21 | B-07 | B | P1 | S4 | confirmed in scope | fixed: `hard-rules/hard-rule-sidecar-integrity.md` expects and records `count=7` with `rendered-home-hooks`, and `hard-rules/dispatch-rule-check-suite.md` expects and records `tests 65`, rerun 2026-11-15. The root playbook says 65 tests. |
| 22 | B-07 | critic | P1 | S4 | confirmed in scope | fixed: `hard-rules/hard-rule-sidecar-integrity.md` expects and records `count=7` with `rendered-home-hooks`, and `hard-rules/dispatch-rule-check-suite.md` expects and records `tests 65`, rerun 2026-11-15. The root playbook says 65 tests. |
| 23 | PRB-01 | probe | P1 | S8 | confirmed in scope | fixed with D-05: the probe passes in the replay (`run-probes.cjs` pass=10 fail=0). |
| 24 | PRB-02 | probe | P1 | S8 | confirmed in scope | fixed with D-05: the probe passes in the replay (`run-probes.cjs` pass=10 fail=0). |
| 25 | PRB-03 | probe | P1 | S8 | confirmed in scope | fixed with D-05: the probe passes in the replay (`run-probes.cjs` pass=10 fail=0). |
| 26 | PRB-04 | probe | P1 | S8 | confirmed in scope | fixed with D-05: the probe passes in the replay (`run-probes.cjs` pass=10 fail=0). |
| 27 | BAT-01 | battery | P2 | S1 | out of scope | Pre-existing and by design. The hits are the fake PEM block in `dispatch-audit.test.mjs:885,889` (blame `d136c791f60`, 2026-07-28, an ancestor of the base), the deliberately bad untracked fixture `sample-bad.ts`, and merge markers in `specs/agents/**/scratch` from another session's main commit `31ced0f5ea6` (critic override). |
| 28 | D-04 | D | P2 | S11 | confirmed in scope | fixed: `.vibe/SYNC.md` and the `.vibe/config.toml` header say a print-mode dispatch copies the config into its home and needs no trust entry. |
| 29 | D-04 | critic | P2 | S11 | confirmed in scope | fixed: `.vibe/SYNC.md` and the `.vibe/config.toml` header say a print-mode dispatch copies the config into its home and needs no trust entry. |
| 30 | X-05 | critic | P2 | S11 | confirmed in scope | fixed: `.skilled/CROSS-CLI.md` says the home holds a copy of `config.toml`, not a trust entry. |
| 31 | ENV-01 | env | P2 | S13 | confirmed in scope | fixed: the six `VIBE_*_DIR` names are listed in `.env.example` and `system-spec-kit/runtime/ENV-REFERENCE.md`, as the sibling `DSH_*_DIR` names already are. The critic called them internal test seams; the DSH precedent decided it. |
| 32 | ENV-02 | env | P2 | S13 | confirmed in scope | fixed: the six `VIBE_*_DIR` names are listed in `.env.example` and `system-spec-kit/runtime/ENV-REFERENCE.md`, as the sibling `DSH_*_DIR` names already are. The critic called them internal test seams; the DSH precedent decided it. |
| 33 | ENV-03 | env | P2 | S13 | confirmed in scope | fixed: the six `VIBE_*_DIR` names are listed in `.env.example` and `system-spec-kit/runtime/ENV-REFERENCE.md`, as the sibling `DSH_*_DIR` names already are. The critic called them internal test seams; the DSH precedent decided it. |
| 34 | ENV-04 | env | P2 | S13 | confirmed in scope | fixed: the six `VIBE_*_DIR` names are listed in `.env.example` and `system-spec-kit/runtime/ENV-REFERENCE.md`, as the sibling `DSH_*_DIR` names already are. The critic called them internal test seams; the DSH precedent decided it. |
| 35 | ENV-05 | env | P2 | S13 | confirmed in scope | fixed: the six `VIBE_*_DIR` names are listed in `.env.example` and `system-spec-kit/runtime/ENV-REFERENCE.md`, as the sibling `DSH_*_DIR` names already are. The critic called them internal test seams; the DSH precedent decided it. |
| 36 | ENV-06 | env | P2 | S13 | confirmed in scope | fixed: the six `VIBE_*_DIR` names are listed in `.env.example` and `system-spec-kit/runtime/ENV-REFERENCE.md`, as the sibling `DSH_*_DIR` names already are. The critic called them internal test seams; the DSH precedent decided it. |
| 37 | ENV-07 | env | P2 | S13 | out of scope | Internal: `WIRE_LOG` is the required input of one test fixture (`record-and-deny.sh:4`), never operator-set. No doc owed. |
| 38 | B-10 | B | P2 | S2 | confirmed in scope | fixed: hub `SKILL.md` layout lists `README.md` and `manual-testing-playbook/`, and the hub `README.md` roster row links the packet README. |
| 39 | B-10 | critic | P2 | S2 | confirmed in scope | fixed: hub `SKILL.md` layout lists `README.md` and `manual-testing-playbook/`, and the hub `README.md` roster row links the packet README. |
| 40 | B-12 | B | P2 | S2 | confirmed in scope | fixed: `cli-mistral-vibe/SKILL.md` ALWAYS list renumbered 9 to 12. |
| 41 | B-12 | critic | P2 | S2 | confirmed in scope | fixed: `cli-mistral-vibe/SKILL.md` ALWAYS list renumbered 9 to 12. |
| 42 | X-01 | critic | P2 | S2 | confirmed in scope | fixed: `cli-mistral-vibe/SKILL.md` ALWAYS item 9 gives the true reason the persona is inlined. |
| 43 | X-02 | critic | P2 | S2 | confirmed in scope | fixed: `.skilled/hooks/injection-contract.md` names Mistral Vibe and points to `guards-and-hooks.md` for its per-entry channels. |
| 44 | X-03 | critic | P2 | S2 | confirmed in scope | fixed: `.skilled/hooks/decision-capture/bin/README.md` says eight runtimes. |
| 45 | B-09 | B | P2 | S3 | confirmed in scope | fixed: `feature-catalog/feature-catalog.md` says seven hard rules. |
| 46 | B-09 | critic | P2 | S3 | confirmed in scope | fixed: `feature-catalog/feature-catalog.md` says seven hard rules. |
| 47 | B-11 | B | P2 | S4 | confirmed in scope | fixed: `hub-routing/front-door-compiled-decision.md` and the root playbook record policy hash `1f77e1ab...` at generation 5 from a 2026-11-15 rerun (`match=true`). |
| 48 | B-11 | critic | P2 | S4 | confirmed in scope | fixed: `hub-routing/front-door-compiled-decision.md` and the root playbook record policy hash `1f77e1ab...` at generation 5 from a 2026-11-15 rerun (`match=true`). |
| 49 | BAT-04 | battery | P2 | S5 | out of scope | Pre-existing: `.skilled/hooks/README.md:206` (blame `73d5a9b6408`) and `system-spec-kit/README.md:465` (blame `9a0b4a935e5`) both come from ancestors of the base. |
| 50 | BAT-05 | battery | P2 | S5 | confirmed in scope | fixed: `cli-mistral-vibe/README.md` (`$RUN_DIR/out/export.json`), the hub `README.md` roster row, and `check_readme_references.py`, which now reads `.vibe/` from the repository root as it already read `.dsh/`, with a new test in `tests/test_readme_references.py`. The checker passes on all five touched READMEs. |
| 51 | C-1 | C | P2 | S5 | confirmed in scope | fixed: root `README.md` skill catalog lists `cli-mistral-vibe`. |
| 52 | C-1 | critic | P2 | S5 | confirmed in scope | fixed: root `README.md` skill catalog lists `cli-mistral-vibe`. |
| 53 | C-2 | C | P2 | S5 | out of scope | Pre-existing on main: `references/workflows/orchestrator-dispatch.md` came from `9a8a5f50266`, another session's commit merged from main (critic override). |
| 54 | X-06 | critic | P2 | S5 | confirmed in scope | fixed: `system-spec-kit/references/cli/memory-handback.md` counts eight siblings and has a `cli-mistral-vibe` row. |
| 55 | BAT-06 | battery | P2 | S6 | deferred | Release owner's call. Tag `v4.0.2.1` contains the Mistral routes commit `5a1a516b082` but its notes do not mention the routes. The Vibe mode commit `36ddad5062d` came after the tag and belongs to the next release's notes, which do not exist yet. |
| 56 | D-05 | D | P2 | S8 | confirmed in scope | fixed by operator decision (fix in this phase): compound phrases added to the hub `graph-metadata.json` intent signals, `hub-router.json` and the hub `ROUTER.md`. Compiled routes reminted and synced, the manifest refreshed, `skill-graph.json` regenerated. All ten probes pass, the out-of-domain prompt "give this landing page a calmer vibe" still defers, and the advisor regression suite passes 42 of 42. |
| 57 | D-05 | critic | P2 | S8 | confirmed in scope | fixed by operator decision (fix in this phase): compound phrases added to the hub `graph-metadata.json` intent signals, `hub-router.json` and the hub `ROUTER.md`. Compiled routes reminted and synced, the manifest refreshed, `skill-graph.json` regenerated. All ten probes pass, the out-of-domain prompt "give this landing page a calmer vibe" still defers, and the advisor regression suite passes 42 of 42. |
| 58 | X-04 | critic | P2 | S9 | confirmed in scope | fixed: `.skilled/bin/README.md` wrapper row lists `vibe`, seven runtimes, and says Vibe never arms. |

## Overturned by the critic

- A-2 (overturned): 
- C-4 (overturned): 
- C-3 (overturned): 
- D-02 (overturned): 
- D-03 (overturned): 
