# Review Iteration 004

## Dispatcher

- Mode: review
- Target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Dimension: maintainability
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made
- Artifact dir: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/vibe-2`
- Session: `fanout-vibe-2-1795504079797-ay97sx`, generation 1, lineageMode new
- Sources read this iteration: `steer.md` (absent), `deep-review-strategy.md`, `deep-review-findings-registry.json`, `.skilled/skills/mcp-browser-use/{SKILL.md,ROUTER.md,README.md,description.json,leaf-scopes.json,leaf-manifest.json}`, `.skilled/skills/mcp-browser-use/mcp-aside-devtools/{SKILL.md,README.md,feature-catalog/feature-catalog.md}`

## How this iteration addressed the operator focus

The focus binds every iteration. This one took the maintainability dimension and pointed it at the
hub's own prose, because the hub is the artifact every phase shipped into. It checked the hub
`SKILL.md` capability matrix against the mode packets it delegates to, the `ROUTER.md` claim that
every routed leaf is listed in the generated manifest, and the version-authority rule `SKILL.md`
states against every hub metadata file. The matrix and the version rule both failed; the manifest
claim held once the manifest's packet-relative path form was accounted for.

## Files Reviewed

- `.skilled/skills/mcp-browser-use/SKILL.md:1-160`
- `.skilled/skills/mcp-browser-use/ROUTER.md:1-140`
- `.skilled/skills/mcp-browser-use/README.md:1-50`
- `.skilled/skills/mcp-browser-use/description.json:1-30`
- `.skilled/skills/mcp-browser-use/leaf-scopes.json:1-12`
- `.skilled/skills/mcp-browser-use/leaf-manifest.json:1-40`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:147,202-205`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/README.md:189`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/feature-catalog.md:122-142`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The hub capability matrix advertises `page.on(...)` events as a working Aside capability, while the Aside packet documents that `page.on` throws on the pinned version** -- `.skilled/skills/mcp-browser-use/SKILL.md:40` -- the matrix row reads `| Console and network | bdg console --list, CDP network methods | page.on(...) events | see logs rings |`, so it presents `page.on(...)` as the Aside answer for console and network capture. The Aside packet says the opposite in three places: `mcp-aside-devtools/SKILL.md:147` ("The `page.on('console' | 'request' | 'response')` calls throw there"), `:202-203` ("gap on 1.26.626.1517 — `page.on` rejects the event"), and `feature-catalog/feature-catalog.md:122` ("`page.on('console'|'request'|'response', ...)` throws on 1.26.626.1517. Probe it only inside `try`/`catch`"). The hub's own rule at `SKILL.md:96` says "Each mode keeps its own safety contract in its packet. This hub does not restate those contracts", so the matrix restates a contract it should not, and restates it wrongly.
   Finding class: maintainability
   Scope proof: the hub `SKILL.md` and the three Aside files are all inside the pre-bound scope list; the matrix row and each contradicting Aside line are cited at line level.
   Affected surface hints: `.skilled/skills/mcp-browser-use/SKILL.md`, `.skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md`, `.skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/feature-catalog.md`, and the phase 014 AC-012 fix that corrected the packet but not the hub.
   Case: a reader opens the hub `SKILL.md`, sees `page.on(...)` listed as the Aside console-and-network capability, writes `page.on('console', ...)` in an `aside repl` evaluation, and gets a throw on Aside 1.26.626.1517.

```json
{
  "type": "maintainability",
  "claim": "The hub capability matrix states a capability the mode packet documents as a gap, and the hub's own rule forbids restating mode contracts.",
  "evidenceRefs": [
    ".skilled/skills/mcp-browser-use/SKILL.md:40",
    ".skilled/skills/mcp-browser-use/SKILL.md:96",
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:147",
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:202-203",
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/feature-catalog.md:122"
  ],
  "counterevidenceSought": "Checked whether the matrix row could be read as a Playwright-generic capability rather than a claim about the pinned Aside build: the row sits under the mcp-aside-devtools column of a capability matrix whose header says each mode owns a distinct band, so it reads as a claim about that mode. Checked whether phase 014 already fixed it: AC-012's search is scoped to mcp-aside-devtools, so the hub SKILL.md was outside the fix.",
  "alternativeExplanation": "The matrix may be deliberately coarse, listing the Playwright API surface rather than what works on the pinned build. That reading is consistent with the row's brevity but not with the packet's explicit gap markers, and it leaves the hub as the only surface that presents the call as usable.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 if the matrix is documented elsewhere as an API-surface list rather than a working-capability list."
}
```

### P2 Findings

2. **The hub README frontmatter carries version 1.1.3.0 while every other hub metadata file and the newest changelog entry carry 1.1.2.0** -- `.skilled/skills/mcp-browser-use/README.md:8` -- `SKILL.md:20` states the rule: "This file's `version` matches the newest entry under `changelog/`. The hub metadata files carry the same value." The hub changelog holds `v1.0.0.0.md`, `v1.1.0.0.md`, `v1.1.1.0.md` and `v1.1.2.0.md`, and `SKILL.md`, `ROUTER.md`, `description.json`, `mode-registry.json` and `hub-router.json` all carry `1.1.2.0`. Only `README.md` carries `1.1.3.0`, a version with no changelog entry.
   Finding class: maintainability
   Scope proof: every file named is inside the pre-bound scope list; the rule, the README value and the changelog listing are cited at line level.
   Affected surface hints: `.skilled/skills/mcp-browser-use/README.md`, `.skilled/skills/mcp-browser-use/changelog/`, and the parent-skill checker's `13a-version` and `13b-version` invariants, which cover JSON routing files and `SKILL.md` but not the README.
   Case: a reader checks the hub version from the README, sees 1.1.3.0, and looks for a `changelog/v1.1.3.0.md` that does not exist.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `spec_code` | pass | `SKILL.md:20` vs the changelog and the metadata files | The version-authority rule holds for every file it names except the README, recorded as finding 2 |
| `checklist_evidence` | partial | `SKILL.md:40` vs `mcp-aside-devtools/SKILL.md:202-203` | Phase 014 AC-012 holds inside the Aside packet but not at the hub, so the checklist row is scoped too narrowly |
| `skill_agent` | pass | `SKILL.md:1-160`, `ROUTER.md:1-140` | The hub declares no agent definition of its own and the parent-skill checker's `12a-router-contract` and `12b-routing-shape` invariants pass |

## Integration Evidence

- `rg -n 'page\.on' .skilled/skills/mcp-browser-use/SKILL.md` printed exactly one hit, the matrix row at line 40.
- `rg -n 'page\.on\(|page\.context\(\)' .skilled/skills/mcp-browser-use/mcp-aside-devtools --glob '!**/changelog/**'` printed nine hits, every one of them a gap marker or a warning.
- All eight `RESOURCE_MAP` paths in `ROUTER.md` resolve on disk, and each is listed in `leaf-manifest.json` under its own packet's `leaves` array in packet-relative form, so the `ROUTER.md` manifest claim holds.
- `ls .skilled/skills/mcp-browser-use/changelog/` printed four entries, the newest `v1.1.2.0.md`.
- `.skilled/skills/mcp-browser-use/leaf-scopes.json` adds exactly the Chrome DevTools Lighthouse and performance-trace catalog leaf, as `SKILL.md:88` states.

## Edge Cases

- **The `ROUTER.md` manifest claim looked false at first.** `rg -c 'mcp-aside-devtools/references/aside-cli-reference.md' leaf-manifest.json` returned 0, but the manifest stores leaves packet-relative under each mode's `leaves` array, so the leaf is listed. Recorded as a resolved ambiguity rather than a finding, because the first check used the wrong path form.
- **`graph-metadata.json` carries no `version` key.** The version-authority rule names "the hub metadata files", and `graph-metadata.json` is one, but it has no version field to drift. Not a finding.
- **The parent-skill checker does not cover the README.** Its `13a-version` and `13b-version` invariants check JSON routing files and `SKILL.md`, which is why the README drift passed a green checker run. Recorded inside finding 2 rather than as a separate finding.

## Confirmed-Clean Surfaces

- `.skilled/skills/mcp-browser-use/ROUTER.md`: the two-stage model, the own-Chrome versus caller-owned-browser rule, the narrow-alias rule and the `UNKNOWN_FALLBACK` checklist all match `hub-router.json` and `mode-registry.json`.
- `.skilled/skills/mcp-browser-use/leaf-scopes.json`: one entry, the Chrome DevTools mode, with the Lighthouse and performance-trace catalog leaf, exactly as `SKILL.md` describes.
- `.skilled/skills/mcp-browser-use/description.json`: one hub identity, three mode names, no second advisor identity for any mode.
- `.skilled/skills/mcp-browser-use/SKILL.md` Layout block: every listed entry exists on disk, including `shared/` and `leaf-scopes.json`.

## Ruled Out

- **`ROUTER.md` routes to leaves that are not in the generated manifest.** Ruled out: all eight `RESOURCE_MAP` paths resolve and each is listed in `leaf-manifest.json` in packet-relative form.
- **The hub declares a second advisor identity.** Ruled out: `description.json` carries one identity and `mode-registry.json` sets `routingClass: metadata` on every mode.
- **The hub `SKILL.md` Layout block lists a folder that does not exist.** Ruled out: `shared/` and every other listed entry exist.
- **The changelog convention is broken.** Ruled out: `SKILL.md`, `ROUTER.md`, `description.json`, `mode-registry.json` and `hub-router.json` all match the newest changelog entry at 1.1.2.0.

## Next Focus

- Dimension: cross-reference
- Focus area: the compiled-routing artifacts under `.skilled/bin/lib/compiled-routing/` against the hub registries, and the `mcp-tooling` parent hub's six modes
- Reason: all four configured dimensions are now covered; the remaining budget goes to cross-reference analysis, which the loop contract names as the fallback when no dimension remains
- Rotation status: all four configured dimensions complete; cross-reference pass not started
- Blocked/productive carry-forward: the `validate.sh --strict --recursive` criterion stays blocked for this lineage; the hub prose surface is productive and produced one P1 and one P2
- Required evidence: file:line citations from the pre-bound scope list

Review verdict: CONDITIONAL
