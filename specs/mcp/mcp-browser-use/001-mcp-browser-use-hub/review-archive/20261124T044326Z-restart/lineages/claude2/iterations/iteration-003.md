# Iteration 003 — Traceability: packet docs against the hub

## Dispatcher

- Lineage: claude2, sessionId `fanout-claude2-1795300286921-qfagh7`, iteration 3 of 5
- Dimension: traceability
- Operator focus coverage: this pass checked the "end-to-end verification" commit and the packet's status claims against what the hub files and the recorded runs show. It covered the phase map, the 005 known limitations, the 006 decision record (MT-H04 gold change, Bladebro kept installed), the 003 acceptance criteria, the Bladebro references' run-state prose, and the agreement of the hub's metadata files with each other.
- Sources: `steer.md` absent; strategy Next Focus from iteration 2.

## Files Reviewed

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:47-155`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/implementation-summary.md:47,117,150-165`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/spec.md:23,140-172`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/implementation-summary.md:58,74,123-127`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/decision-record.md:98-125`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/003-mode-relocation/acceptance-criteria.md:34-79`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/00*/tasks.md` (open-item counts)
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md:14`, `mcp-wiring.md:67`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md:23-25`
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/holdout-agentic-browser.md:6-40`
- `.skilled/skills/mcp-browser-use/{mode-registry,hub-router,leaf-manifest,description}.json`
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/fence-state.json`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The parent spec's unmet-requirement count disagrees with phase 005's own records** -- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:51 -- The parent status says "005 records two requirements not met as written". Phase 005's implementation summary status (`005-routing-and-surfaces/implementation-summary.md:47`) lists three, REQ-003, REQ-008 and REQ-009, and its Known Limitations 2-4 (lines 157-160) describe all three. The 005 `spec.md:23` status names REQ-003 and REQ-009 only, leaving REQ-008 out. Three docs, three different accounts of the same phase.
   - Finding class: traceability / status reconciliation
   - Scope proof: all three docs are edited or added on this branch.
   - Affected surface hints: parent `spec.md` metadata table, `005-routing-and-surfaces/spec.md` status row, `005-routing-and-surfaces/implementation-summary.md` status row.
   - Case: a reader of the parent packet concludes two requirements are open and misses REQ-008 (fixtures relabeled rather than passing unchanged).

2. **Bladebro references still say nothing has run and no callable was observed, after the live macOS run** -- .skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md:14 -- The file says "None of it has run on this host", and `mcp-wiring.md:67` says "No callable name for this manual has been observed on this host". The 006 live benchmark records the install, a digest PASS, doctor, five tools in Code Mode and a live `bladebro_see` call (`benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md:23-25`), and the operator chose to keep Bladebro installed (`006-verification/decision-record.md` Q004). The references were not reconciled with the run, so an agent reads the pre-run "do not assume a callable" guidance next to an observed callable.
   - Finding class: traceability / stale prose
   - Scope proof: both references and the benchmark are added on this branch.
   - Affected surface hints: `install-and-verify.md` intro, `mcp-wiring.md` §3, the macOS-live benchmark.
   - Case: an agent loading `mcp-wiring.md` skips the observed `bladebro.bladebro_see` form and repeats discovery, or treats the install as absent and asks the operator for an install that already exists.

3. **The bare-"aside" note's premise is contradicted by phase 005's own stage-one replay** -- .skilled/skills/mcp-browser-use/hub-router.json:117 -- Refines C2-I1-P2-001. The `aside-devtools-aliases` note says ordinary-prose uses of the word never reach stage two because the advisor picks the hub first. Phase 005 Known Limitation 3 (`005-routing-and-surfaces/implementation-summary.md:158`) records that "set that aside and fix the failing unit test" still returns the hub at 0.82 at stage one. So prose with "aside" can reach stage two, where iteration 1 showed it adds the Aside mode.
   - Finding class: traceability / design note vs evidence
   - Scope proof: both files on this branch.
   - Affected surface hints: `hub-router.json` note, 005 Known Limitations.
   - Case: the advisor surfaces the hub for "set that aside and fix the failing unit test"; stage two then scores Aside on the word "aside".

## Traceability Checks

- `spec_code` (partial): the hub's three metadata files agree (registry, router and leaf manifest list the same three modes; description.json and registry are both 1.1.0.0). The parent status count and the Bladebro run-state prose drift (P2-001, P2-002).
- `checklist_evidence` (pass): 003 acceptance criteria AC-001..AC-008 are `Met`, each with observed evidence (`003-mode-relocation/acceptance-criteria.md:59-66`). Open task items are explained in place: `004-bladebro-mode/tasks.md:74` (live run handed to 006) and `005-routing-and-surfaces/tasks.md:79-80` (T020/T021 blocked with not-met notes).
- `playbook_capability` (pass): the hub playbook carries 7 hub-routing scenarios that feed admission (`006-verification/implementation-summary.md:58,123`); the MT-H04 gold change from Aside to defer is an operator decision recorded in `006-verification/decision-record.md:98-112` and in the scenario (`holdout-agentic-browser.md:24`).
- `agent_cross_runtime` (notApplicable): no agent definitions are in scope.

## Integration Evidence

- `activation/mcp-browser-use/fence-state.json` is at fencing epoch 1, consistent with a single flip.
- 005 Known Limitation 1 records that the official activation scripts refused to run (frozen scorer hashes) and the flip went through `mint`, `refresh` and admission instead. 006 later reports admission 7 pass / 0 drift and the guard green on all 8 hubs. This is documented, not hidden.

## Edge Cases

- The parent status says "Complete" while phase 005 is "Partial". The parent qualifies this by pointing at the goal criteria, so it is recorded as part of P2-001, not as a separate finding.
- The MT-H04 gold was changed to match observed output. Because the operator chose it with options and the scenario explains the split between Bladebro and Aside, it is not a finding.

## Confirmed-Clean Surfaces

- No stale `mcp-tooling/mcp-{chrome,aside}-devtools` path outside changelogs and benchmarks (`rg` over `.skilled`, no match).
- Hub metadata files agree with each other on modes and version.

## Ruled Out

- Gold-tuning without an operator decision: MT-H04 change is operator-approved and documented.
- Missing acceptance evidence in 003: every row cites observed output.

## Next Focus

- Dimension: maintainability
- Focus area: nested sub-track support in system-spec-kit (`track-roots.mjs`, `relocate.mjs`, `create.sh`, `sweep-track-roots.mjs`, `validate.sh`, `graph-metadata-parser.ts`, `orchestrator.ts`, the new `nested-subtrack.vitest.ts`).
- Reason: last canonical dimension; the spec-kit commit is the largest code change not yet reviewed.
- Rotation status: correctness, security, traceability done (3/4).
- Verdict basis: C2-I1-P1-001 remains active.

Review verdict: CONDITIONAL
