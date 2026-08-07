# Iteration 1: Correctness — Routing and Route-Gold Enforcement

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Agent definition loaded: `.opencode/agents/deep-review.md`
- Budget profile: verify
- Focus: prior F001-F005 and F008

## Files Reviewed

- Hub policy and inventory: `hub-router.json`, `mode-registry.json`, hub `SKILL.md`.
- All 13 `manual_testing_playbook/hub_routing/` scenarios, including six bound holdouts.
- Six packet recall corpora through the loader/replay path (49 scenarios).
- `router-replay.cjs`, `run-skill-benchmark.cjs`, `score-skill-benchmark.cjs`, route-gold tests, and the post-remediation report.

## Findings — New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence | Result |
|----------|--------|----------|--------|
| `playbook_capability` | pass | `logs/iteration-001-replay-hub.json`; `logs/iteration-001-replay-packets.json` | 13/13 hub and 49/49 packet rows match exact intent and resource gold. |

## Integration Evidence

- `hub-router.json:20-29` declares fallback-only default resources and separates discovery-only classes from scoring classes.
- `router-replay.cjs:529-550` consumes that policy generically: legacy undeclared routers retain default union, fallback-only routers never assemble the default.
- Current benchmark execution wrote only inside this lineage and returned `PASS`, aggregate 98, route gold enabled, 13 rows, 13 matches, 0 violations, 0 parse failures.
- An in-memory wrong-intent/wrong-resource control passed through `evaluateRouteGold` + `aggregate` and returned `BLOCKED-BY-ROUTE-GOLD` with one counted violation, closing the prior report-only gate blindness.

## Edge Cases

- Code-graph projection was intentionally not invoked because it writes outside the lineage artifact root. Direct producer-consumer reads and executable full-matrix replays supply the fallback ledger.
- The worktree contains the remediation plus unrelated concurrent changes; this iteration reviewed the current filesystem candidate without modifying it.

## Confirmed-Clean Surfaces

- F001: Figma positive route is recovered (`figma`/design-transport vocabulary; MT-003 passes).
- F002: no Chrome default contaminates scored routes; defer assembles nothing.
- F003: hub identity is discovery-only, so MT-004 defers instead of bundling six modes.
- F004: six hub holdouts route to their declared modes; the five repaired bindings are documented as `blindExceptions`.
- F005: provider-neutral `screen examples` is discovery-only; provider-qualified Refero/Mobbin prompts remain distinct.
- F008: route gold is an enforced verdict/process gate and current hub gold is 13/13.

## Ruled Out

- Reopening the six prior correctness classes: ruled out by source-level producer/consumer tracing, 62/62 exact replay rows, current PASS 98 benchmark evidence, and the negative hard-gate control.

## Next Focus

- Dimension: security
- Focus area: resource isolation, parser/path safety, fallback trust boundary, transport mutation vocabulary, Figma `workspaceWrites`, and mandatory `sk-design` pairing
- Reason: verify F006-F007 plus remediation-introduced regressions at trust boundaries
- Rotation status: 1/4 dimensions complete

Review verdict: PASS
