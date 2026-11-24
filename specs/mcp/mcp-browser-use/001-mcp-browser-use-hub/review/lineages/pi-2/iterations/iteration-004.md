# Iteration 004: Maintainability, documentation and router vocabulary drift

## Dimension

maintainability (D4), with traceability evidence where a doc is the stated source of truth. Operator review focus continued: the phase 014 fixes touched the hub's routing vocabulary, so this pass asks whether every surface that states that vocabulary still agrees, and whether packet state still matches the tree.

## Sources

- `.skilled/skills/mcp-browser-use/hub-router.json` (`routerSignals`, `vocabularyClasses`)
- `.skilled/skills/mcp-browser-use/ROUTER.md` (the keyword and weight block)
- `.skilled/skills/mcp-browser-use/mode-registry.json` (mode aliases)
- `.skilled/skills/mcp-browser-use/{SKILL.md,mcp-*/SKILL.md}` version lines
- `.skilled/skills/mcp-browser-use/{,mcp-chrome-devtools/,mcp-aside-devtools/,mcp-bladebro/}changelog/`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md` (status paragraph, 005 requirement note)
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/acceptance-criteria.md`

## Scorecard

- Dimensions covered: maintainability
- Files reviewed: 12 read or grepped
- New findings: P0=0 P1=0 P2=1
- Refined findings: none
- New findings ratio: 1.0 (1 of 1 weighted units is new)

## Findings

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **ROUTER.md's Chrome DevTools keyword list has drifted from the router it documents** -- .skilled/skills/mcp-browser-use/ROUTER.md:53 -- `hub-router.json` resolves `mcp-chrome-devtools` routing through the `chrome-devtools-aliases` and `browser-debug` vocabulary classes, which together hold 38 keywords. The `CHROME_DEVTOOLS` row in `ROUTER.md` lists 33 and is missing eight that the router applies: `lighthouse audit`, `run lighthouse`, `run a lighthouse`, `chrome live manual`, `record a performance trace`, `capture a performance trace`, `chrome performance trace` and `core web vitals`. Two of the missing words are the ones the packet's own routing rules lean on: `lighthouse audit` is a declared mode alias in `mode-registry.json`, and `chrome performance trace` is the anchor the 014 scorer change uses for the browser read-only lift. The Aside and Bladebro rows agree with their classes exactly, so this is one row left behind rather than a general doc policy.
   Case: an agent reads `ROUTER.md` to decide where "run lighthouse on the staging page" or "record a chrome performance trace" will route, concludes Chrome DevTools is not keyed on those phrases, and either picks another mode or reports a routing gap that the router does not have.
   Finding class: instance-only
   Scope proof: a normalized comparison of `routerSignals[*].classes` through `vocabularyClasses` against the three rows of the `ROUTER.md` block reports 8 missing words for Chrome DevTools, 0 for Aside and 0 for Bladebro, and no word that appears only in the doc; the block is one line per mode, so the fix is a single-line edit.
   Affected surface hints: ["hub ROUTER.md", "hub-router.json vocabulary", "mode-registry aliases"]

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| feature_catalog_code | pass | advisory | .skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/README.md:1 | Catalog present per mode; nothing in this pass contradicts the catalog tree. |
| checklist_evidence | partial | hard | specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/acceptance-criteria.md:84 | AC-002 still does not hold against its stated verification. |
| spec_code | partial | hard | .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:30 | Unchanged from iteration 2: a bare hint satisfies the scorer's naming test. |

Maintainability evidence gathered and holding this iteration:

- Packet version versus changelog: the hub reads `1.1.2.0` against `changelog/v1.1.2.0.md`, Chrome DevTools `1.0.28.0` against `v1.0.28.0.md`, Aside `1.1.13.0` against `v1.1.13.0.md`, and Bladebro `1.2.1.0` against `v1.2.1.0.md`, so AC-011's packet-version half holds.
- The parent status paragraph discloses that 005 records REQ-003 and REQ-008 as not met as written, so those live as tracked exceptions rather than silent passes.
- The duplicated `_utils.sh` pair is deliberate: `mcp-installers.test.cjs:49-55` fails when the copies differ, so the duplication is a checked contract rather than an unchecked one. Not reported.

## Integration Evidence

- `.skilled/skills/mcp-browser-use/hub-router.json` is the compiled front door's input, and `ROUTER.md` is the human-facing statement of the same rules; the drift is between two shipped surfaces of one mode, not between a doc and unrelated code.

## Edge Cases

- `ROUTER.md` states weights and keyword lists in prose JSON-shaped text rather than as a generated artifact, so the drift can only be caught by comparison. The finding recommends alignment, not generation: the packet has no build step for this file, and inventing one would be out of scope.
- The eight missing words are all Chrome-specific, so a reader following the Aside or Bladebro rows is unaffected; severity stays P2 because routing behaviour itself is correct.

## Ruled Out

- Packet version versus newest changelog entry: all four agree.
- Aside and Bladebro router documentation: both rows match their vocabulary classes exactly.
- Duplicated installer helper: guarded by a parity test, so not an unchecked maintenance liability.

## Recommended Next Focus

Cross-reference sweep over the 014 acceptance criteria and the parent goal criteria that no earlier pass settled, then a check that the open findings are described the same way in the strategy, the registry and the iteration trail before synthesis.

Review verdict: CONDITIONAL
