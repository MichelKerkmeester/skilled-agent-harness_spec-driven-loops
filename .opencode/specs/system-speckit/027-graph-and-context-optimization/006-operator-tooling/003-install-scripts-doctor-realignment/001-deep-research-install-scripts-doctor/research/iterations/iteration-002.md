# Iteration 2: Q2 scripts sweep

## Focus

Sweep setup, launcher, hook, copy, bridge, and skill scripts for stale post-CocoIndex-deprecation references, with special attention to live scripts that an operator or CI path would run.

## Actions Taken

- Read the current deep-research state and strategy, then used the supplied Q2 focus rather than re-opening Q1 install-guide work.
- Inventoried the requested script surfaces with `rg --files -g '*.sh' -g '*.cjs' .opencode/scripts .github/hooks .opencode/skills/*/scripts .opencode/skills/*/mcp_server/scripts`, finding 144 shell/CJS script files; `.opencode/scripts` contains `README.md`, `claude-session-cleanup.sh`, `copy-skill-advisor-dist-data.sh`, `git-hooks`, `install-git-hooks.sh`, `launchagents`, and `orphan-mcp-sweeper.sh`.
- Grepped those script files for CocoIndex/`ccc`/daemon/sidecar/rerank/env/port/deleted-hook tokens plus Q4 old skill-name markers, then read the hit contexts in `setup/install.sh`, `test-council-matrix.sh`, `install-git-hooks.sh`, `copy-skill-advisor-dist-data.sh`, and the installed git hook templates.
- Checked existence of `.opencode/skills/sk-ai-council` and deleted `pre-push-council` hook paths to distinguish live breakage from stale text.

## Findings

- **[P2 / STALE-LIVE]** `.opencode/skills/system-spec-kit/scripts/setup/install.sh:280` — the live installer help still advertises `Structural authority propagation (cross-encoder reranking)` while the current post-CocoIndex reality says the cross-encoder/rerank sidecar path was removed; this is not a launcher failure, but an operator-running `install.sh --help` still receives stale setup-surface capability text.
- **[P1 / STALE-LIVE / Q4-NOTE]** `.opencode/skills/system-spec-kit/scripts/test-council-matrix.sh:14` — the council matrix script runs `python3 .opencode/skills/sk-doc/scripts/quick_validate.py .opencode/skills/sk-ai-council`, but `.opencode/skills/sk-ai-council` is absent after the 116 rename to `deep-ai-council`; this is Q4 territory, but it is a live script command that would fail if invoked.

## Ruled Out

- No `*.sh` or `*.cjs` script in `.opencode/scripts`, `.github/hooks`, skill `scripts`, or skill `mcp_server/scripts` contains `cocoindex`, `ccc`, `ccc search/index/mcp/status/reindex`, `coco-daemon`-style text, `.venv`, or `.cocoindex_code`; Q2 removed CocoIndex/`ccc` runtime setup residue is ruled out for this script set.
- No requested script contains rerank-sidecar runtime wiring: no `sidecar`, `8765`, `RERANKER_LOCAL`, `SPECKIT_CROSS_ENCODER`, or `rerank_sidecar` hits were present in the targeted `*.sh`/`*.cjs` sweep.
- `.opencode/scripts/install-git-hooks.sh:21-50` installs only files from `.opencode/scripts/git-hooks`, and the current hook templates at `.opencode/scripts/git-hooks/pre-commit:22` and `.opencode/scripts/git-hooks/post-commit:43-65` reference the doc-model validator and structural code-graph DB invalidation, not CocoIndex/`ccc`/rerank sidecar paths.
- `.opencode/scripts/copy-skill-advisor-dist-data.sh:25-44` copies JSON data from `system-skill-advisor/mcp_server/data` into the compiled dist data directory; it does not copy or build removed embedder, reranker, sidecar, CocoIndex, or `ccc` artifacts.
- No targeted script references the deleted `pre-push-council.sh`; both `.opencode/scripts/git-hooks/pre-push-council.sh` and `.github/hooks/scripts/pre-push-council.sh` are absent, so the prior council pre-push hook deletion has no installer residue in the swept script surfaces.

## Questions Answered

Q2 is substantially answered for the requested shell/CJS operator-facing script set: no live script launches, health-checks, cleans up, copies, or configures removed CocoIndex/`ccc`/rerank-sidecar infrastructure. One live help-text stale reference remains in the setup installer, and one 116 rename script failure was noted for Q4.

## Questions Remaining

Q3 remains open for `/doctor` command and route manifest behavior. Q4 remains open for a focused 116 deep-skill-evolution sweep beyond the old-skill-name hit found here. Q5 remains open for cross-runtime consistency once Q2-Q4 are complete.

## Next Focus

Q3 — sweep `/doctor`, `/doctor:*`, doctor scripts, and route manifests for stale CocoIndex/`ccc`/rerank-sidecar diagnostics and post-coco route consistency.
