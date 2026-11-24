# Review Iteration 006

## Dispatcher

- Mode: review
- Target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Dimension: cross-reference (verification pass on the four active P1 findings)
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change
- Lineage: sessionId `fanout-vibe-2-1795511024070-2cuwlj`, generation 1, lineageMode new
- Iteration: 6 of 7

## Files Reviewed

- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:84` -- `selectNearTiedModes` and the ambiguity window
- `.skilled/skills/mcp-browser-use/SKILL.md:62` -- the documented front-door invocation
- `.skilled/skills/mcp-browser-use/ROUTER.md:105` -- the machine-router callout that repeats it
- `.skilled/skills/mcp-browser-use/README.md:8` -- the hub release declaration
- `.skilled/skills/mcp-browser-use/mode-registry.json:3` -- the registry version
- `.skilled/skills/mcp-browser-use/changelog/` -- the five release files
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/install/install-and-doctor.md:24` -- the install instruction
- `.skilled/bin/compiled-route.cjs:43` -- the `--prompt-stdin` contract

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. All four P1 findings from iterations 1 to 3 were re-read against current source and all four remain active. Each one's recorded `downgradeTrigger` was checked and none has fired.

### P2 Findings

None new. Seven P2 findings remain active from iterations 1 to 5.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Re-read: `README.md:8` still declares `1.1.4.0` against `mode-registry.json:3` at `1.1.3.0` and a newest changelog of `v1.1.3.0.md`; the mixed id/alias form still drops a named mode. |
| `checklist_evidence` | partial | Carried: phase 006 cites a superseded Chrome DevTools run; the parent goal's evidence row cites a path that does not resolve. |
| `skill_agent` | pass | Carried: `parent-skill-check.cjs` exits 0 and names the hub. |
| `agent_cross_runtime` | notApplicable | No agent definition carries hub logic. |
| `feature_catalog_code` | fail | Re-read: `install-and-doctor.md:24` still presents the unpinned `curl | bash` form as an equal first option beside the digest-pinned wrapper. |
| `playbook_capability` | pass | Carried: all three modes carry a playbook with a recorded run. |

## Integration Evidence

- **P1-1 re-read, `router.cjs:84`.** `selectNearTiedModes` keeps every mode within `ambiguityDelta` of the top score, and `scoreModes` counts distinct fold-deduped keywords times the mode weight. Live, in this iteration: `--prompt "use mcp-chrome-devtools and bladebro"` returns `route` / `single` / `[mcp-chrome-devtools]`, while `--prompt "use mcp-chrome-devtools and mcp-bladebro"` returns `route` / `orderedBundle` / `[mcp-chrome-devtools, mcp-bladebro]`. The finding is unchanged and its downgrade trigger has not fired.
- **P1-2 re-read, `SKILL.md:62` and `ROUTER.md:105`.** Both still document `--prompt "<task>"` and neither mentions `--prompt-stdin`. Run literally through a shell, the documented form with a task containing inner double quotes returns `{"action":"defer","selectionKind":null,"targets":[]}`, and a task containing `$(whoami)` has the substitution executed before the CLI sees it. The same text passed as a single argv element routes correctly to `mcp-chrome-devtools`, which isolates the defect to the documented shell form rather than to the CLI's argv handling. The finding is unchanged and its downgrade trigger has not fired.
- **P1-3 re-read, `README.md:8`.** The hub README still declares `version: 1.1.4.0`; `mode-registry.json:3` declares `1.1.3.0`; `changelog/` holds `v1.0.0.0.md` through `v1.1.3.0.md` with no `v1.1.4.0.md`. The invariant stated at `SKILL.md:18` is still broken. The finding is unchanged.
- **P1-4 re-read, `install-and-doctor.md:24`.** The entry still reads "Install with `curl -fsSL https://releases.aside.com/install.sh | bash` or the packaged wrapper `bash scripts/install.sh`", with no deprecation marker and no reference-only framing. Phase 015 decision D2 still forbids the unpinned path. The finding is unchanged and its downgrade trigger has not fired.

## Edge Cases

- **The P1-2 reproduction depends on how the caller quotes.** Passing the task as one argv element makes the CLI route correctly, so a reviewer who tests only the CLI and not the documented shell form would wrongly close the finding. The reproduction recorded here runs the documented form literally, which is the form the hub tells the agent to use.
- **No finding was closed.** Nothing under the review target changed between iteration 3 and this iteration, so a closure would have been a bookkeeping artefact rather than a fix. All four P1 findings carry forward at their original severity.
- **The `$(...)` case is a live command substitution, not a routing defect.** The substitution ran in the caller's shell and the CLI then deferred on the substituted text. The finding is scoped to the documented invocation, which is what makes the substitution reachable.
- **`hotspotSaturationGate` and `dimensionCoverageGate` still block convergence.** The convergence run after iteration 5 reported `traceabilityCovered: false` with `unfinishedCoreProtocols: ["spec_code","checklist_evidence"]`, which is the honest state while four P1 findings are open. This iteration does not change that state.

## Confirmed-Clean Surfaces

- `compiled-route.cjs` argv handling: a task passed as a single argv element, including inner double quotes, routes correctly. The defect is the documented shell form, not the CLI.
- `changelog/`: five files, `v1.0.0.0.md` through `v1.1.3.0.md`, no gap and no `v1.1.4.0.md`.
- `router.cjs:84`: the ambiguity window behaves as its comment describes for the all-id form; the defect is the scoring asymmetry between id and alias forms, not the window itself.

## Ruled Out

- **P1-2 no longer reproduces.** Ruled out: the documented form still truncates at the first inner double quote and still executes a command substitution. The earlier reproduction stands.
- **P1-1 was fixed by the phase 015 alias addition.** Ruled out: the alias addition fixed the all-id bundle, and the mixed id/alias form still collapses to `single`.
- **P1-3 was fixed by a changelog addition.** Ruled out: no `v1.1.4.0.md` exists.
- **P1-4 was fixed by the phase 015 installer pin.** Ruled out: the pin landed in `install.sh`, and the feature catalog line that bypasses it is untouched.

## Next Focus

- Dimension: cross-reference
- Focus area: the two remaining core protocols and the seven active P2 findings, re-read once to confirm none has been silently fixed and to record the final carry-forward set for synthesis
- Reason: the four P1 findings are confirmed active and the run is at its last iteration; the remaining work is to fix the carry-forward set the synthesis will report
- Rotation status: correctness, security, traceability and maintainability complete; cross-reference pass 2 of 2 complete
- Blocked/productive carry-forward: the P1 re-read is exhausted as a source of new findings; the P2 set has not been re-read since it was raised
- Required evidence: file:line citations for each P2 finding, re-read in the iteration that carries it into synthesis

Review verdict: CONDITIONAL
