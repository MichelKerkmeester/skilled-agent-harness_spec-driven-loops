# Iteration 004 — skills hub metadata and mode registries

**Focus:** Parent-hub `mode-registry.json`, `hub-router.json`, `description.json`/`graph-metadata.json` placement, compiled-routing activation manifests.
**newInfoRatio:** 0.65
**Novelty:** Found audit-era semantic retained in sk-design registry, duplicated compiled-routing feature-catalog packets per hub, and test-fixture metadata files outside advisor contract.
**Status:** complete

## Findings

### F14 — CAT-5: `sk-design` `mode-registry.json` retains `auditFrame` for removed audit mode
- **Path:** `.opencode/skills/sk-design/mode-registry.json`
- **Evidence:** Registry defines four modes (interface, motion, md-generator, design-mcp-open-design) but `transformVerbRouting.auditFrame` still set to `"should it be"` (lines 27-30); no `audit` mode in `modes` array.
- **Proof:** `rg -n 'auditFrame|"audit"' .opencode/skills/sk-design/mode-registry.json` → lines 30, 28-29; `node .opencode/bin/compiled-route.cjs --hub sk-design --prompt 'audit this design'` (if runnable) routes to interface per prior phase research — maintenance drift not routing outage.
- **Simpler shape:** Remove `auditFrame` and audit split prose; keep `interfaceFrame` aliases only.

### F15 — CAT-6: Seven near-identical `compiled-routing-and-legacy-fallback` feature-catalog copies (one per hub)
- **Path:** `.opencode/skills/*/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md` (sk-code, sk-design, sk-doc, sk-prompt, cli-external-orchestration, mcp-tooling, system-deep-loop)
- **Evidence:** Same feature-catalog slug replicated under each parent hub per sk-doc hyphen-case pilot.
- **Proof:** `find .opencode/skills -path '*/feature-catalog/compiled-routing-and-legacy-fallback/*.md' | wc -l` → 7; files share trigger phrase "compiled routing legacy fallback".
- **Simpler shape:** Single system-spec-kit or sk-doc canonical catalog entry; hub READMEs link to it.

### F16 — CAT-4: Test-fixture `description.json` files outside advisor metadata contract locations
- **Path:** `.opencode/skills/system-spec-kit/scripts/test-fixtures/*/description.json`, `scripts/tests/fixtures/*/description.json`
- **Evidence:** Advisor doctrine: `description.json` at hub root or spec folder, not inside `scripts/test-fixtures/`.
- **Proof:** `find .opencode/skills/system-spec-kit/scripts -name description.json` → 6 fixture paths without sibling `SKILL.md` or `hub-router.json` at same directory.
- **Simpler shape:** Rename fixture files to `fixture-description.json` or nest under `__fixtures__/` to avoid memory-index false positives.

### F17 — CAT-5: `013-live-activation/activation/*/fence-state.json` duplicates manifest authority
- **Path:** `.opencode/bin/lib/compiled-routing/013-live-activation/activation/sk-design/fence-state.json` (and six sibling hubs)
- **Evidence:** Each hub has `manifest.json` + `fence-state.json` in activation directory; both listed in `serving-closure.manifest.json:71-77`.
- **Proof:** `ls .opencode/bin/lib/compiled-routing/013-live-activation/activation/sk-design/` → `manifest.json`, `fence-state.json`; serving closure fileCount 62 includes both per hub.
- **Simpler shape:** Embed fence generation stamp in manifest.json only; drop parallel fence-state files if sync guard reads one source.

## Dead Ends / Ruled Out
- Hub `router.cjs` vs `canary-router.cjs` split is intentional archetype difference, not duplicate dead copies.

## Next focus
`commands/`, `agents/`, repo-root config, runtime mirrors (`.claude/`, `.codex/`, `.cursor/`, `.devin/`).
