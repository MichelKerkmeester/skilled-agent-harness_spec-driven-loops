# Iteration 001 - Correctness

## Dispatcher
- Lineage: opus-4 (fan-out), session fanout-opus-4-1795495435655-lf6jf3, generation 1, lineageMode new.
- Dimension: correctness. Operator focus: every phase's shipped work against its goal criteria.
- Sources: deep-review-config.json, deep-review-strategy.md, review-scope-files.txt; steer.md absent.
- Focus coverage: re-ran the parent goal's completion criteria and each child goal's machine-checkable criteria against the current tree, read-only, and verified that the prior generation's claimed P1 fixes still hold.

## Files Reviewed
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:91-99 (parent criteria 1-7)
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/0*/goal.md completion anchors (13 children)
- .skilled/skills/mcp-browser-use/mode-registry.json, .skilled/skills/mcp-tooling/mode-registry.json
- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:101-125
- .skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:45,61,68
- .skilled/scripts/git-hooks/pre-commit:726, .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh:148-157
- .skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:2,112-116 against 004-bladebro-mode/spec.md:91-95
- .utcp_config.json (bladebro manual)
- .skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/feature-catalog.md:243
- .skilled/skills/mcp-browser-use/*/benchmark/reports/*/results.csv and README.md tallies
- .skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:88-160,255-268

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None.

## Traceability Checks
- Parent criterion 1: `001-research/research/deep-research-state.jsonl` holds 12 iteration records and `research.md` exists. Holds.
- Parent criterion 2: hub registry lists 3 modes (mcp-chrome-devtools, mcp-aside-devtools, mcp-bladebro); mcp-tooling lists 6. Holds.
- Parent criterion 3: both rg checks print no match, including mcp-tooling/ROUTER.md (003's wider list). Holds.
- Parent criterion 5 (stage two only): `compiled-route.cjs --hub mcp-browser-use` routes a Chrome, an Aside and a Bladebro request to the matching mode with selectionKind single. Stage one (advisor) not re-run here because the advisor daemon writes state outside the lineage; the recorded two-stage replay (`benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/results.csv`, 6 of 6 PASS) is the evidence relied on.
- Parent criterion 6: each mode has recorded runs (Chrome 5+17+8 = 30 scenarios, Aside several folders, Bladebro macOS 14-step plan with real output for steps 7-13).
- 003 mutation guard: manifest skill_dir values, the pre-commit regex and the guard HOOK_PATTERN/DISCOVERY_GLOBS all name mcp-browser-use/. Holds.
- 004: `name: mcp-bladebro`, `command -v bladebro` x4, R-SEC rule text identical to spec.md section 3, UTCP manual has args ["mcp"]. Holds.
- 005: Chrome catalog has 31 leaves and TOTAL 31. Holds.
- 008: Bladebro results.csv 5 rows 4 PASS 1 FAIL; Aside signed-in-live 15 rows 10 PASS 5 FAIL. Holds.
- 013 REQ-001: positional-JSON `bdg cdp` rg prints nothing over .skilled/skills and README.md. Holds.
- Prior C2-I1-P1-001 fix: router rejects only on the `forbidden` constraint (router.cjs:107-109); the live 403 prompt routes to mcp-chrome-devtools; the authored bundle and the .skilled/bin copy are byte-identical for router.cjs, registry-compiler.cjs, policy-card.cjs and the canary fixture.

## Integration Evidence
- `.skilled/bin/compiled-route.cjs` (live stage-two replay, six prompts).
- `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml`, `.skilled/scripts/git-hooks/pre-commit`, `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh`.

## Edge Cases
- Validation criteria that need `validate.sh --strict --recursive` or the advisor could not be re-run inside this lineage's write limits; relied on recorded evidence and marked them as not independently re-verified.
- "Aside from that, run lighthouse" still yields an orderedBundle with Aside; this is the prior generation's deferred C2-I1-P2-001, not re-raised.

## Confirmed-Clean Surfaces
- Hub/mcp-tooling registry split, stale-path removal, mutation-guard wiring, Bladebro R-SEC text, UTCP manual, compiled router reject logic, install.sh macOS Chrome detection and domain count parse.

## Ruled Out
- Top-level `await` in Code Mode examples: the hits under mcp-aside-devtools/feature-catalog are Aside REPL snippets, where top-level await is the documented form, not Code Mode.
- Drift between the authored compiled-routing bundle and its .skilled/bin copy: byte-identical.

## Next Focus
- Dimension: security.
- Focus area: Bladebro and Aside safety gates (R-SEC-1/2/3 as shipped in references and playbooks), installer scripts, teardown paths, signed-in run evidence hygiene, against 004/006/007/008 goal criteria.
- Reason: correctness of goal criteria holds; security is next in risk order.
- Rotation status: correctness done; security, traceability, maintainability remain.
- Required evidence: file:line in the shipped playbooks and scripts.

Review verdict: PASS
