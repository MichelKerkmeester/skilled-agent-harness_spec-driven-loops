# Review Iteration 004

## Dispatcher

- Mode: review
- Target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Dimension: maintainability
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change
- Lineage: sessionId `fanout-vibe-2-1795511024070-2cuwlj`, generation 1, lineageMode new
- Iteration: 4 of 7

## Files Reviewed

- `.skilled/skills/mcp-browser-use/SKILL.md:78` -- the hub layout block and companion-metadata list
- `.skilled/skills/mcp-browser-use/README.md:66` -- the hub release-file rule
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/README.md:1` -- mode README frontmatter
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/SKILL.md:1` -- mode SKILL frontmatter
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/README.md:1` -- mode README frontmatter
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:1` -- mode SKILL frontmatter
- `.skilled/skills/mcp-browser-use/mcp-bladebro/README.md:1` -- mode README frontmatter
- `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:1` -- mode SKILL frontmatter
- `.skilled/skills/mcp-browser-use/leaf-scopes.json:1` -- generator input for leaf scoping
- `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:18` -- the leaf-scopes consumer
- `.skilled/skills/mcp-browser-use/benchmark/reports/README.md:26` -- hub report index
- `.skilled/skills/mcp-browser-use/mcp-*/benchmark/reports/README.md:1` -- three mode report indexes

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Four P1 findings from iterations 1 to 3 remain active and keep this iteration's verdict at CONDITIONAL.

### P2 Findings

1. **Two of three mode READMEs carry a version behind their own SKILL.md and newest changelog** -- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/README.md:1` -- `mcp-chrome-devtools/README.md` declares `1.0.26.0` while its `SKILL.md` and newest changelog are `1.0.28.0`; `mcp-aside-devtools/README.md` declares `1.1.10.0` while its `SKILL.md` and newest changelog are `1.1.13.0`. `mcp-bladebro` is consistent at `1.2.1.0` across all three. The hub states the convention at `SKILL.md:18` and repeats it at `README.md:66` ("one file per release, named `v[version].md`"), but no checker enforces cross-file version equality anywhere under `.skilled/bin` or `.skilled/commands/doctor/scripts`, so the drift is invisible to every gate that currently runs. This is the same defect class as iteration 3's hub README finding, on three more files.
   Finding class: maintainability
   Scope proof: all six files are inside the declared review target; the convention is stated by the hub's own SKILL.md and README.md.
   Affected surface hints: `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/README.md`, `.skilled/skills/mcp-browser-use/mcp-aside-devtools/README.md`, `.skilled/skills/mcp-browser-use/mcp-bladebro/README.md`, `.skilled/skills/mcp-browser-use/SKILL.md`
   Case: a reader opens the Chrome DevTools README to learn the current release, sees `1.0.26.0`, and reads two superseded changelog entries as the current state; the same reader on the Aside README is three releases behind.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Carried: the hub version-authority invariant is broken at `README.md:8` (iteration 3) and the same convention is unenforced across the mode READMEs (finding 1). |
| `checklist_evidence` | partial | Carried from iteration 3: phase 006 cites a superseded Chrome DevTools run. |
| `skill_agent` | pass | `parent-skill-check.cjs` exits 0; the three mode packets carry identical top-level layouts (13 entries each). |
| `agent_cross_runtime` | notApplicable | No agent definition carries hub logic. |
| `feature_catalog_code` | fail | Carried from iteration 2: the Aside install catalog documents an unpinned path that decision D2 forbids. |
| `playbook_capability` | pass | Carried from iteration 3: all three modes carry a playbook with a recorded run. |

## Integration Evidence

- `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:18` documents `leaf-scopes.json` as an optional narrowing input: "Without scopes, each mode walks its full configured leaf roots." The one-mode entry is therefore a deliberate narrowing, not an omission.
- `.skilled/skills/mcp-browser-use/benchmark/reports/README.md` lists five rows and all five run folders exist, two directly and three under `compiled-routing/`.
- The three mode report indexes each match their folder count exactly: Aside 7 rows and 7 folders, Bladebro 3 and 3, Chrome DevTools 3 and 3.
- The hub `SKILL.md:78` layout block lists 16 entries and every one resolves on disk.

## Edge Cases

- The mode `SKILL.md` files state no version-authority rule of their own, so the mode README drift is a convention gap rather than a violation of a contract those packets declared. That is why it is P2 and not P1.
- `leaf-scopes.json` declaring only `mcp-chrome-devtools` is intentional: the generator walks a mode's full configured roots when that mode has no scope entry, and `SKILL.md:106` documents the entry as adding the Lighthouse and performance-trace catalog leaf.
- `mcp-bladebro` carries a `benchmark/` directory that `mcp-tooling`'s `mcp-click-up` leaf does not. That is a consequence of Bladebro having recorded runs, not a layout divergence.
- The hub README's own release rule at `README.md:66` is contradicted by its own frontmatter at `README.md:8`. That is recorded as corroboration for iteration 3's finding rather than re-raised here.

## Confirmed-Clean Surfaces

- The three mode packets carry identical top-level layouts: `assets`, `benchmark`, `changelog`, `examples`, `feature-catalog`, `INSTALL-GUIDE.md`, `manual-testing-playbook`, `mcp-servers`, `README.md`, `references`, `ROUTER.md`, `scripts`, `SKILL.md`.
- The hub `SKILL.md` layout block matches the tree exactly.
- Every benchmark report index matches its folder count.
- `mcp-bladebro` is version-consistent across README, SKILL.md and changelog.
- `leaf-scopes.json` has a live consumer and documented semantics.

## Ruled Out

- **A dead or orphaned `leaf-scopes.json`.** It is read by `generate-leaf-manifest.cjs`, and `SKILL.md:106` documents its purpose.
- **A layout divergence between the hub's mode packets and the `mcp-tooling` sibling.** The three mode packets are identical to each other and differ from `mcp-click-up` only by the `benchmark/` directory that recorded runs require.
- **A stale benchmark report index.** All four indexes match their folder counts.
- **A missing hub layout entry.** All 16 entries in the `SKILL.md` layout block resolve on disk.

## Next Focus

- Dimension: cross-reference
- Focus area: the advisor 2.0.3.0 id-noun change end to end, the two-stage replay evidence, and the completion-criteria checklist as a whole
- Reason: all four canonical dimensions are covered; the remaining work is the cross-reference pass that decides whether the run can stop
- Rotation status: correctness, security, traceability and maintainability complete; cross-reference next
- Blocked/productive carry-forward: the version-consistency scan is exhausted as a source of new findings
- Required evidence: file:line citations from the advisor scorer, the replay results and the parent goal checklist

Review verdict: CONDITIONAL
