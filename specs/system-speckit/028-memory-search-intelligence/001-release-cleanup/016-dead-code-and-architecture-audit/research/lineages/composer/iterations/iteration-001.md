# Iteration 001 — bin/ and launcher/daemon surface

**Focus:** `.opencode/bin/` entrypoints, launcher lifecycle parity, compiled-routing serving closure, install-guide symlinks.
**newInfoRatio:** 1.0
**Novelty:** First pass on bin surface; identified orphan smoke script, broken install-guide symlink, launcher lifecycle asymmetry, and calibration closure files not wired into runtime engine.
**Status:** complete

## Findings

### F1 — CAT-1: `cli-exit-taxonomy-smoke.cjs` has no runtime caller beyond its own README
- **Path:** `.opencode/bin/cli-exit-taxonomy-smoke.cjs`
- **Evidence:** `.opencode/bin/cli-exit-taxonomy-smoke.cjs:1-14` documents daemon-free exit-taxonomy smoke; `.opencode/bin/README.md:75,226` is the only non-spec reference.
- **Proof:** `rg -l 'cli-exit-taxonomy-smoke' --glob '*.{json,md,yaml,cjs,ts,sh}' .opencode/bin .opencode/skills .opencode/commands .opencode/plugins` → only `.opencode/bin/README.md` (excluding `.opencode/specs/`).
- **Simpler shape:** Fold into `cli-offline-smoke.cjs` test suite or wire once into CI/validate; delete standalone script if redundant.

### F2 — CAT-4: Broken install-guide symlink points at pre-nesting skill path
- **Path:** `.opencode/install-guides/MCP - Chrome Dev Tools.md`
- **Evidence:** Symlink target `../skills/mcp-chrome-devtools/INSTALL_GUIDE.md` missing; live guide at `.opencode/skills/mcp-tooling/mcp-chrome-devtools/INSTALL-GUIDE.md`.
- **Proof:** `readlink '.opencode/install-guides/MCP - Chrome Dev Tools.md'` → `../skills/mcp-chrome-devtools/INSTALL_GUIDE.md`; `test -f .opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md` → fail; `test -f .opencode/skills/mcp-tooling/mcp-chrome-devtools/INSTALL-GUIDE.md` → pass.

### F3 — CAT-5: Launcher lifecycle parity gap across three MCP launchers
- **Path:** `.opencode/bin/README.md`, `.opencode/bin/mk-spec-memory-launcher.cjs`, `.opencode/bin/mk-code-index-launcher.cjs`, `.opencode/bin/mk-skill-advisor-launcher.cjs`
- **Evidence:** `.opencode/bin/README.md:114` — spec-memory launcher is hardened reference (detached re-election); code-index and skill-advisor launchers stop with child.
- **Proof:** `rg -n 'Lifecycle parity note' .opencode/bin/README.md` → line 114 documents intentional asymmetry.
- **Simpler shape:** Align code-index and skill-advisor launchers to spec-memory re-election contract or document as permanent dual-class with explicit operator guidance.

### F4 — CAT-6: Compiled-routing `005-decision-evaluator` and `008-calibration` in serving closure but not runtime-engine imports
- **Path:** `.opencode/bin/lib/compiled-routing/005-decision-evaluator/`, `.opencode/bin/lib/compiled-routing/008-calibration/`, `.opencode/bin/lib/compiled-routing/serving-closure.manifest.json`
- **Evidence:** Manifest lists calibration and decision-evaluator files (`serving-closure.manifest.json:22-26`); `014-runtime-engine/lib/compiled-route.cjs` only loads hub rollout children + activation manifests.
- **Proof:** `rg -l '005-decision-evaluator|008-calibration' --glob '*.cjs' .opencode/bin/lib/compiled-routing/014-runtime-engine .opencode/bin/compiled-route.cjs` → empty; manifest still enumerates them (`fileCount: 62`).
- **Simpler shape:** Move build-only calibration/decision artifacts to a dev-only package or strip from serving closure if manifest sync no longer needs them at runtime.

## Dead Ends / Ruled Out
- All `009-parent-hub-rollout/**/router.cjs` dead: `014-runtime-engine/lib/compiled-route.cjs:69-74` dynamically requires `router.cjs` or `canary-router.cjs`.

## Next focus
MCP-server trees: deleted `:memory:` artifacts, vector shard layout, hook duplication across mirrors.
