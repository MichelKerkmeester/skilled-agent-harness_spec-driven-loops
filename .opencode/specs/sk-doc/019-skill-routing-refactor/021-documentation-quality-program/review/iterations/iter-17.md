# Iteration 17: cross-cutting broken-link sweep across authored/repaired READMEs

> dimension: broken-refs | model: gpt-5.6-sol effort=high tier=fast | sandbox: read-only
> status: 0 | timedOut: false

- **[P0] All 1,290 style-catalog links point one directory too shallow**

  `.opencode/skills/sk-design/styles/README.md:25`

  Evidence: Rows 25–1314 link to targets such as `099-supply/` and `zora/`. The sweep found all 1,290 targets missing under `styles/<slug>/`, while all 1,290 exist under `styles/library/bundles/<slug>/`.

  Fix: Prefix every catalog destination with `library/bundles/`, for example `(library/bundles/099-supply/)`.

- **[P0] Styles overview links to removed harness and manifest paths**

  `.opencode/skills/sk-design/styles/README.md:8`

  Evidence: `_harness/` and `_manifest.json` are both absent. The current committed manifest is `library/manifests/retrieval-manifest.json`.

  Fix: Link the manifest to `library/manifests/retrieval-manifest.json`; remove the `_harness/` claim or replace it with the actual committed harness location.

- **[P0] Chrome DevTools install-guide links resolve through a dangling symlink**

  `.opencode/install-guides/README.md:79`

  Evidence: Lines 79 and 546 link to `./MCP%20-%20Chrome%20Dev%20Tools.md`. That symlink targets `../skills/mcp-chrome-devtools/INSTALL_GUIDE.md`, which does not exist. The guide now exists at `../skills/mcp-tooling/mcp-chrome-devtools/INSTALL-GUIDE.md`.

  Fix: Retarget the symlink to `../skills/mcp-tooling/mcp-chrome-devtools/INSTALL-GUIDE.md`.

- **[P1] Stress-test README displays three nonexistent legacy paths**

  `.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/README.md:115`

  Evidence: `../../skill_advisor/tests/`, `../../skill_advisor/tests/README.md`, and `../../skill_advisor/lib/README.md` do not resolve. Lines 154–155 already link to the existing `../../tests/README.md` and `../../lib/README.md`, but their visible labels remain stale.

  Fix: Replace the three `../../skill_advisor/...` references with `../../tests/...` and `../../lib/...`.

Review verdict: FAIL
