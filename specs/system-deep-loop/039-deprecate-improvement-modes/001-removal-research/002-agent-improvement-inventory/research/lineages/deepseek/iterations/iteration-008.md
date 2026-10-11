# Iteration 8: History and documentation surfaces — root README, hub changelog/feature-catalog/playbook, benchmark reports

## Focus

Inventory the documentation and history surfaces: root `README.md`, the hub's `changelog/`, `feature-catalog/`, `manual-testing-playbook/` (incl. the IL-001 lane scenario), `benchmark/` reports, `shared/progress/README.md`, the packet behavior-benchmark scenarios, and the case-insensitive prose boundary.

## Actions Taken

1. Grepped root `README.md`, `AGENTS.md`, `CLAUDE.md` at max-columns for the canonical tokens and again case-insensitively for prose forms.
2. Read the four root README sections carrying the mode (lines 556, 648-651, 821, 1003-1005, 1239, 1432).
3. Line-level greps across hub `changelog/`, `feature-catalog/`, `manual-testing-playbook/`, `benchmark/`, `shared/progress/`.
4. Read the IL-001 playbook scenario and the IMB scenario header; sampled `command-bridge-guard.md` and `shared/progress/README.md` context.

## Findings

1. **Root `README.md` carries the mode in eight load-bearing places** — line 556 (five `/deep:*` loops incl. both lanes), the "Agent Improvement & Benchmarking" section at lines 648-651 (Lane A `/deep:agent-improvement` runs `@deep-improvement`), line 821 (skill routing list incl. `deep-improvement`), lines 1003-1005 ("Deep Improvement" agent description), line 1239 (command list), line 1432 (skill table row). Disposition: EDIT. [SOURCE: README.md:648]
2. **The hub changelog tree records the mode's history** — `changelog/v1.0.0.0.md:22`, `v1.2.0.0.md:46,62`, `v1.5.0.0.md:36,50`, `v1.5.3.0.md:20`. Disposition: KEEP-AS-HISTORY. [SOURCE: .skilled/skills/system-deep-loop/changelog/v1.5.0.0.md:36]
3. **`feature-catalog/feature-catalog.md` and the mode-classification entry describe the lane** — lines 15 and 35 of the catalog; `deep-loop-mode-classification.md:28` explains `backendKind: improvement-host` via the loop-host path. Disposition: EDIT. [SOURCE: .skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md:15]
4. **The hub manual-testing-playbook references the lane across four files** — playbook root lines 39, 160, 184, 232 (IL-001/IL-002 scenario inventory), 239; `advisor-integration/command-bridge-guard.md:17,33` (agent `deep-improvement`, artifact root `improvement/`), plus `single-advisor-identity.md`, `lexical-mode-scoring.md`, `no-false-fire-code-edit.md` hold the fold/scoring scenarios. Disposition: EDIT (shared playbook surface). [SOURCE: .skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:232]
5. **`improvement-lane-routing/agent-improvement.md` is a whole playbook scenario dedicated to Lane A** — front matter `expected_intent: agent-improvement`, `expected_workflow_mode: agent-improvement`, the leaf resource list (lines 9-18), the registry expectations (lines 41-47, 64, 75), pass criteria (line 88) and the advisorDefaultMode diagnostic (line 94). Disposition: DELETE (the sibling `model-benchmark.md` scenario survives as IL-002). [SOURCE: .skilled/skills/system-deep-loop/manual-testing-playbook/improvement-lane-routing/agent-improvement.md:6]
6. **The runtime-and-backend playbook files share the host narrative** — `improvement-host.md` documents the improvement-host backend and `external-adapter.md` the adapter route; both name the lane. Disposition: EDIT. [SOURCE: .skilled/skills/system-deep-loop/manual-testing-playbook/runtime-and-backend/improvement-host.md]
7. **`benchmark/README.md` names the retired harness and the frozen report sets** — line 3 ("retired deep-improvement benchmark harness"), lines 14 and 20 (report inventory), plus the baseline and compiled-routing reports themselves. Disposition: KEEP-AS-HISTORY (frozen evidence; the README edit is the only live-text touch). [SOURCE: .skilled/skills/system-deep-loop/benchmark/README.md:3]
8. **`shared/progress/README.md` names the lanes by exclusion** — line 12 states the research/review/ai-council completion reducers use this helper while "the deep-improvement lanes reduce state without this helper". Disposition: EDIT the mention. [SOURCE: .skilled/skills/system-deep-loop/shared/progress/README.md:12]
9. **The packet behavior-benchmark scenarios split by lane** — IMB-001's header carries `"mode": "improvement"` with agent-facing scenario content (IMB-001..006 agent/common; IMB-007 `model-benchmark-bare-command-halt`), and the README consumed in iteration 5 links them to `/deep:agent-improvement`. Disposition: classify per-scenario in the tests iteration (Lane A scenarios DELETE; IMB-007 EDIT/sibling). [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/behavior-benchmark/scenarios/IMB-001-auto-run-specified.md:4]
10. **Case-insensitive prose boundary recorded** — space-form mentions ("agent improvement") are concentrated in files already inventoried (hub router/SKILL/command-metadata, agents README, packet assets, playbook) plus four extra root-README lines (556, 648, 1003, 1432); the canonical-token search remains the inventory spine and no un-inventoried surface appeared outside it. [SOURCE: README.md:556]

## Ruled Out

- Treating hub `changelog/` and frozen benchmark `reports/` as edit targets: they are historical records; only their README indexes receive edits.

## Dead Ends

- `AGENTS.md` / `CLAUDE.md` at the repository root carry no canonical-token mentions (checked in the same grep).

## Edge Cases

- Ambiguous input: prose forms without hyphens could balloon the inventory; resolved by the boundary decision in finding 10 (prose confined to already-inventoried files).
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- README.md:556,648-651,821,1003-1005,1239,1432
- AGENTS.md, CLAUDE.md (negative)
- .skilled/skills/system-deep-loop/changelog/v1.0.0.0.md:22; v1.2.0.0.md:46,62; v1.5.0.0.md:36,50; v1.5.3.0.md:20
- .skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md:15,35; deep-loop-mode-classification/deep-loop-mode-classification.md:28
- .skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:39,160,184,232,239
- .skilled/skills/system-deep-loop/manual-testing-playbook/improvement-lane-routing/agent-improvement.md:6-18,41-47,64,75,88,94
- .skilled/skills/system-deep-loop/manual-testing-playbook/advisor-integration/command-bridge-guard.md:17,33
- .skilled/skills/system-deep-loop/manual-testing-playbook/runtime-and-backend/improvement-host.md
- .skilled/skills/system-deep-loop/benchmark/README.md:3,14,20
- .skilled/skills/system-deep-loop/shared/progress/README.md:12
- .skilled/skills/system-deep-loop/deep-improvement/behavior-benchmark/scenarios/IMB-001-auto-run-specified.md:4

## Assessment

- New information ratio: 0.8
- Questions addressed: KQ1 (documentation/history surfaces)
- Questions answered: none in full

## Reflection

- What worked and why: the canonical tokens concentrated the doc surfaces quickly; the case-insensitive pass bounded the prose risk without expanding the inventory.
- What did not work and why: nothing failed; long matching lines required max-columns to read.
- What I would do differently: nothing for this surface.

## SCOPE VIOLATIONS

- None.

## Recommended Next Focus

Iteration 9: consumer and externality checks — callers of every deep-improvement packet script and runtime library from outside the two improvement modes (full sweep), distribution/external-consumption evidence (packages, installs, exports), sk-doc and cli-external-orchestration remaining surfaces, and the compiled/dist freshness surfaces.
