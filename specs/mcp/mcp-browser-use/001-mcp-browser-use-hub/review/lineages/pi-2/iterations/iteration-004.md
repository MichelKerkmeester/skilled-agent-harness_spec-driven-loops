# Review Iteration 004 - mcp-browser-use hub

## Dispatcher

- Mode: review (LEAF, single iteration)
- Run: fanout-pi-2-1795511024070-2cuwlj, generation 4, lineageMode new
- Iteration: 4 of 7
- Dimension: maintainability
- Operator review focus: every phase's shipped work against its goal criteria. This iteration takes the doc-consistency half of that focus over the hub itself: whether the indexes, versions and cross-references the packet ships still describe the files on disk after fifteen phases of edits, and whether the phase 015 doc corrections held.

## Files Reviewed

- `.skilled/skills/mcp-browser-use/{SKILL.md,README.md,ROUTER.md,description.json,graph-metadata.json,leaf-manifest.json,leaf-scopes.json}`
- `.skilled/skills/mcp-browser-use/changelog/v1.0.0.0.md` through `v1.1.3.0.md` (headings and format claims)
- `.skilled/skills/mcp-browser-use/mcp-{chrome-devtools,aside-devtools,bladebro}/{SKILL.md,ROUTER.md}` (link targets)
- `.skilled/skills/mcp-browser-use/benchmark/reports/README.md` and `benchmark/reports/compiled-routing/`
- `.skilled/changelog/mcp-browser-use/parent/`
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs` (run)

## Findings

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The README's changelog section states a per-entry format that none of the five entries follows, so the section misdescribes its own artifacts as well as indexing three of them** -- `.skilled/skills/mcp-browser-use/README.md:68` -- the section says "Each entry opens with the release title and the reason, then lists what changed and the files changed." Every entry does open with a title and reason, and every entry has a What's New list, but no entry lists the files changed: `grep -ciE '^\| .*\.(json|md|sh|cjs) \||files changed|^## Files'` returns 0 for each of `v1.0.0.0.md`, `v1.1.0.0.md`, `v1.1.1.0.md`, `v1.1.2.0.md` and `v1.1.3.0.md`. The five entries run What's New at a Glance, sometimes Correction and How It Was Checked, then Upgrade. This is the same section as PI2-D3-P2-001 and one edit closes both: list all five releases and describe the format the entries actually use.
   - Finding class: doc-format-misstatement
   - Scope proof: README is in the pre-bound review scope, changelog files sit under the same skill root.
   - Affected surface hints: `.skilled/skills/mcp-browser-use/README.md`, `.skilled/skills/mcp-browser-use/changelog/`
   Case: an author writing the next release note follows the README, adds a files-changed list that no sibling entry has, and the section drifts further; a reader looks for the files a release touched and finds none, because the promise was never true.
   ```json
   {"type":"claim-adjudication","claim":"The README changelog section promises a per-entry files-changed list that none of the five existing entries contains.","evidenceRefs":[".skilled/skills/mcp-browser-use/README.md:66-72",".skilled/skills/mcp-browser-use/changelog/v1.1.3.0.md:19-55"],"counterevidenceSought":"Counted files-changed markers and headings in all five changelog files; opened the newest entry and read every heading.","alternativeExplanation":"Inline file mentions in a What's New bullet may be intended to satisfy the promise, as v1.1.3.0's version bullet does.","finalSeverity":"P2","confidence":0.8,"downgradeTrigger":"Closed if the sentence is reworded to describe the actual format, or if the entries gain the promised list."}
   ```

## Confirmed-Clean Surfaces

- Layout completeness: all sixteen entries in the hub `SKILL.md` layout block exist on disk (SKILL.md, README.md, mode-registry.json, hub-router.json, ROUTER.md, description.json, graph-metadata.json, leaf-manifest.json, leaf-scopes.json, changelog/, manual-testing-playbook/, benchmark/, shared/, and the three mode folders).
- Link integrity: every relative markdown link in the 9 hub and mode docs resolves (README, hub SKILL, hub ROUTER, and both files for each of the three modes); 0 broken targets.
- Version parity: hub `SKILL.md`, `hub-router.json`, `mode-registry.json` and `description.json` all read 1.1.3.0, and `parent-skill-check.cjs` passes its 13a/13b/13d version invariants with `OK: parent-skill-check — all hard invariants passed, 0 warnings`; that includes "SKILL.md version matches the newest changelog entry" and "3 mode packets match their newest changelog entry".
- Benchmark index: `benchmark/reports/README.md` names all three `compiled-routing` report directories that exist, so the report index is complete where the changelog index is not.
- Changelog mirror: `.skilled/changelog/mcp-browser-use/parent/` holds all five hub release files, so the top-level coverage check that phase 007 relied on sees the full set; the gap is the README table alone.
- Phase 015's two restored advisor phrases are present in both places it claims: `ROUTER.md:53` carries `chrome live manual` inside CHROME_DEVTOOLS and `ROUTER.md:54` carries `core web vitals` inside LIGHTHOUSE_TRACE, and `graph-metadata.json`'s 65 generated intent signals carry both.
- The v1.1.3.0 "Correction to v1.1.2.0" is a self-correction of a count, not a silent rewrite: it names the older claim and the release that invalidated it, which is the honest shape.
- Mode packet changelogs live beside their packets with no index in `SKILL.md`; the parent-skill checker does not require one, so their absence is a design choice rather than drift.

## Edge Cases

- The hub README's own `version: 1.1.4.0` differs from the canonical 1.1.3.0. Phase 015 ruled that each Markdown doc carries its own version line and that this is not drift (`015-fix-follow-up-review-findings/spec.md:130`), and `parent-skill-check` deliberately does not check README, so the ruling holds and the version line is not raised here.
- `graph-metadata.json` still names `mcp-code-mode`, but only in `edges.depends_on` and in a `derived` prose note describing the shared execution substrate. It is not in a keyword list, and the advisor probe for "fix the code in the parser" no longer lifts the hub, so the phase 015 keyword removal is complete in the scoring path.
- `graph-metadata.json` is generated data (`derived.created_at` 2026-11-21, `last_updated_at` 2026-11-24, `sanitizer_version`), so its vocabulary being wider than `hub-router.json` is expected; the discovery-versus-scoring defer documented in iteration 1 covers it.
- `leaf-manifest.json` is generated and was not treated as hand-editable, so its content count was checked against `ROUTER.md` in iteration 1 rather than compared to itself.

## Ruled Out

- "The mode packets need their own changelog index": ruled out -- the checker's version invariant is the contract, and no requirement asks for a per-packet table.
- "`shared/` or `manual-testing-playbook/` is a stale layout entry": ruled out -- both exist.
- "The benchmark report index drifted like the changelog table": ruled out -- all three report directories are listed.
- "The v1.1.3.0 correction hides a rewrite": ruled out -- it quotes the older claim and names the release that retired it.

## Next Focus

- Dimension: all four, closing pass
- Focus area: whether the four accumulated P2 findings are complete and correctly scoped, whether any can be closed on evidence already gathered, and whether the legal-stop gates pass; then settle the stop decision rather than adding a fifth dimension sweep.
- Reason: D1 to D4 are each covered once, the registry holds four open P2s and no P0/P1, and the iteration cap is 7 with the anti-convergence floor already met.
- Required evidence: registry read-back, gate output from the convergence script, and a file:line re-check that every cited line still exists.
- Rotation status: D1 to D4 covered.

Review verdict: PASS
