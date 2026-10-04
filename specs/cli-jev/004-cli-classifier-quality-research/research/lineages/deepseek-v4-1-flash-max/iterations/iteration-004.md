# Iteration 004 — Skill-advisor integration (axis 3) and UX (axis 4)

- **Focus:** How a prompt reaches the hub — advisor graph, compiled route, hub router, dispatch hook; then UX for an external repository user without Jev and for the benchmark operator.
- **Read first:** no `steer.md` exists in this lineage (checked at iteration start, absent).
- **Method:** read the advisor's committed skill graph and parity fixtures; ran the compiled route live (iteration 1) and matched its policy hash against the activation manifest; ran the dispatch engine's own test suite containment-safe; read the hub/packet READMEs, hard rules, and the benchmark README.

## How a prompt reaches the hub — chain verified end to end

1. **Advisor (stage 1).** `skill-graph.json` holds `cli-classifier` in family `cli` with adjacency `enhances system-spec-kit (0.3)`, `siblings cli-external-orchestration (0.4)` and the ten signals matching `graph-metadata.json` `intent_signals` exactly (graph `:signals["cli-classifier"]` vs `graph-metadata.json:32-43`). The transport stays `routingClass: "metadata"` with no advisor map entry (`mode-registry.json:47-50`), so the advisor resolves the hub identity only. `hub_skills` in the graph query is a degree metric ("Skills with highest in or out degree", `skill-graph-query-cookbook.md:54`), so cli-classifier's absence there is structural, not a defect.
2. **Compiled route.** `compiled-route.cjs --hub cli-classifier --prompt "use jev choice to pick a queue"` returns `action: route`, `selectionKind: single`, target `cli-jev`, with `effectivePolicyHash c3aa7776…`. The activation manifest pins the same hash (`013-live-activation/activation/cli-classifier/manifest.json`: `servingAuthority: "compiled"`, `shadowOnly: false`), so the live front door and the activation record agree.
3. **Hub router.** `parent-skill-check.cjs` passes every hard invariant, including router resource paths resolving, tieBreak coverage, and `ROUTER.md` conforming to the active two-state contract; all 5 `RESOURCE_MAP` paths are `leaf-manifest.json` leaves.
4. **Dispatch hook.** `.claude/settings.json:47` registers `dispatch-preflight-lint.mjs` as a PreToolUse hook; the registry maps `jev noul|choice|score|run` and `jev-mcp` to `cli-classifier/cli-jev` (`dispatch-audit.mjs:44-46`), and the engine implements every cli-jev hard rule including `command-v-jev-required` (`dispatch-rule-checks.mjs:251`) and the six judgment-shape rules (`:215-244`). Its suite runs 20/20 pass, matching the JEV-019 scenario's claim.

## Findings

### F-006 — Advisor fixture records a native-route divergence where a non-Jev "score" prompt reaches cli-classifier (axis 3, P2; approved divergence)

`local-native-approved-divergences.json:753-761` records prompt "Score this task brief for ambiguity, missing inputs, and whether the requested behavior is testable." with `gold: sk-prompt`, `localTop: none`, `nativeTop: cli-classifier`, approved 2026-09-29 as "current-state capture after the merged skill inventory and command-bridge reconciliation". This is the only cli-classifier entry in the fixture (grep count 1).

- **Confirmed by:** reading the fixture entry in full and cross-checking the count.
- **Impact:** it is an accepted current-state divergence, not a regression — recorded because the audit asks how a prompt reaches the hub, and this shows the "score" vocabulary can pull a non-Jev task-brief-scoring prompt to the classifier hub on the native route. Worth watching if the routing corpus is re-baselined.

### F-007 — The `jev` install prerequisite is not surfaced where an external user starts (axis 4, P2)

An external repository user who installs the skill without Jev finds no prerequisite or install line in the hub `README.md` or `SKILL.md`: the hub README's "At a glance" and "Verification" never name the `jev` binary, and the only install command (`uv tool install jev-cli`) lives in `cli-jev/README.md:127` (§6 PROVENANCE) and one playbook scenario (`cli-invocation/binary-resolves-and-pins-version.md` §1 "Why This Matters").

The failure behavior itself is good: the dispatch engine refuses with the rule message "Run `command -v jev` before every judgment; if it fails, refuse the route without constructing or launching a command" (`cli-jev/hard-rules.json:2-7`), and the hub `SKILL.md:139` escalates with "Mode `cli-jev` is not routable on this machine, and the hub says so rather than inventing a judgment." A user then has to search for the install line.

- **Confirmed by:** grep for install/prerequisite wording across the four front docs; reading the hard rule and the packet PROVENANCE section.
- **Impact:** the first-run path for a user without Jev has a gap between "refused" and "here is how to install it". Fix: one prerequisite line in the hub README's At-a-glance table pointing at `cli-jev/README.md §6`.

## Checked and cleared (with evidence)

- **"Keywords equal to both mode routers" (hub README:71) is not an enforceable convention.** hub-router vocabulary (26 keywords) and ROUTER.md `INTENT_SIGNALS` (29) differ, and so do all three sibling hubs sampled (`cli-external-orchestration` 94/72, `mcp-tooling` 157/94, `system-deep-loop` 39/30) — the two stages serve different purposes, and the contract library explicitly "never evaluates intent keywords" (`root-router-contract.cjs:46`). The enforceable invariants (equal key sets, resolving paths, leaf-manifest pairs) all pass. Not reported as a defect.
- **Operator UX is complete.** `benchmark/README.md` names both scorers, the zero-call defaults, the gated live flags (`--jev`, `--pi --out`, `--cli --out`), the baseline evidence locations and the dated-folder report convention; the referenced activation manifest exists and matches the live policy hash.
- **Key/auth guidance exists and is actionable.** `providers-and-models.md:29-32,53-63` documents the four providers, their key variables and the exact `jev auth set --provider <provider>` remedy in the exit-3 message.
- **JEV-019's "20 tests passing" claim is accurate** — the dispatch-engine suite ran 20/20 pass (containment-safe).

## Ruled-out directions

- `hub_skills` omission as a defect — it is a degree metric, not a hub registry.
- The keyword-set difference as a defect — no sibling hub matches it either; the README phrase is prose, not contract.

## Key-question progress

- Q3 (axis 3): chain verified end to end; one approved-divergence observation (F-006).
- Q4 (axis 4): operator UX complete; one external-user prerequisite gap (F-007).
- Q1/Q5: final consolidation and drift checks in iteration 5.

## Next focus

Iteration 5 — axis 7 consolidation: mirror drift (`.claude/skills/cli-classifier` vs `.skilled` source), metadata-vs-code version cross-checks, measured with-and-without results visibility for a reader, and verification of the top findings (F-001…F-007).
