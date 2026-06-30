# What Changed in 150: Parent Skills with Nested Mode Packets

> Spec 150 turned the parent-nested-skill pattern from a repaired deep-loop convention into a created, checked, benchmarked and CI-guarded operating pattern.

---

## THE UNIFYING PRINCIPLE

A parent skill with nested mode packets only works if identity has one source, routing has a guard and operators have a way to create and check the structure. The folder names, registry keys, advisor projections, doctor checks and benchmark fixtures all have to describe the same mode set without inventing a second contract.

Spec 150 followed that rule in sequence. First it repaired the names that every later surface depends on. Then it made the registry-to-advisor projection explicit without changing runtime behavior. Then it formalized the pattern as reusable documentation and command machinery. Finally it implemented the improvement research findings that made the routing guarantee enforceable in CI and observable through `/doctor`.

That rule shaped every section below.

---

## 1. MODE PACKET IDENTITY

**Before**

The 152 build had wired deep-loop mode packet references to bare folder names: `context`, `research`, `review` and `improvement`. Each packet's own `SKILL.md` name carried the deep-prefixed identity, so the filesystem and the skill identity disagreed. `ai-council` was the exception, and that mismatch was known but not yet documented as an accepted case.

**After**

The four folders were renamed to `deep-context`, `deep-research`, `deep-review` and `deep-improvement`, while `ai-council` stayed unchanged. The sweep updated `/deep:*` command YAML assets, hub `graph-metadata.json`, hub `SKILL.md`, hub `README.md`, `mode-registry.json`, `fanout-run.cjs`, four packet doc trees and the cross-reference straggler in `.opencode/skills/cli-opencode/references/destructive_scope_violations.md`.

**Impact**

The mode packet path now matches the SKILL identity everywhere the runtime and documentation read it. The zero-match guard for old bare paths and the zero `deep-deep-` result made the repair checkable instead of rhetorical.

**Why the exception stayed**

The `ai-council` folder-name mismatch was not hidden inside a mechanical rename. The phase recorded it as a deliberately accepted exception pending the next research step, because changing it would have expanded a path-text repair into a broader behavior and compatibility decision.

---

## 2. ADVISOR ROUTING DRIFT

**Before**

The advisor still routed through hardcoded Python and TypeScript maps in `skill_advisor.py` and `aliases.ts`. The registry did not carry an advisor-routing projection, so a future edit could make `mode-registry.json` and the hardcoded maps diverge without a focused failure.

**After**

`mode-registry.json` now carries an 8-mode `advisorRouting` block, a top-level `advisorRoutingContract` legend and version `1.1.0`. The advisor gained `python3 skill_advisor.py --dump-routing-maps`, `aliases.ts` exports `DEEP_MODE_BY_CANONICAL` and the drift-guard vitest compares the registry projection against the Python and TypeScript maps exactly.

**Impact**

The C-plus strategy became concrete without changing runtime routing behavior. The maps stay hand-maintained, but the registry contract and parity test make drift visible.

**Why no runtime registry read**

This phase was deliberately additive. The advisor did not start reading the registry at runtime, because the goal was to guard the existing routing contract before replacing or generating it. That kept the change low-risk and preserved all existing parity fixtures.

---

## 3. PATTERN AUTHORING AND VALIDATION

**Before**

The parent-nested-skill pattern existed in the deep-loop implementation and research, but there was no reusable operator path to create a parent skill, no sk-doc section naming the structure, no doctor route for validation and no benchmark fixture corpus proving the pattern could be scored.

**After**

The phase added `/create:parent-skill` with 3 assets plus README and agent mirror registration. `sk-doc` gained section 10, `Parent Skills with Nested Mode Packets`, plus parent skill hub and registry templates. `/doctor:parent-skill` gained a route, `parent-skill-check.cjs`, workflow asset and router row. The benchmark corpus gained 5 mode scenarios and a routing-precision scorecard under `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/`.

**Impact**

The pattern moved from one implemented example to an operator-ready convention. A future parent skill can be created from templates, documented in the house structure, checked through `/doctor` and represented in the skill-benchmark corpus.

**Why dogfood mattered**

The benchmark fixtures keep the pattern tied to routing behavior instead of only to markdown shape. The harness still scores skill-id, and mode precision stays covered by parity fixtures, but the fixture set gives the pattern a stable testable footprint.

---

## 4. IMPROVEMENT RESEARCH TO RUNTIME HARDENING

**Before**

The 5-iteration improvement research had judged the deep-loop architecture SOUND, but its actionable findings were not yet implemented. The C-plus guarantee existed as a drift-guard test that nothing ran. The runtime also reached into `system-spec-kit/node_modules`, and several hardening seams lacked focused guards.

**After**

The work landed across six commits and four clusters plus the orchestrator. Cluster A added `/doctor` advisor-sync coverage and the PR CI gate. Cluster B added the runtime-local `package.json`, `package-lock.json`, standalone `vitest.config.ts` and dependency seam guard, then replaced 12 `system-spec-kit/node_modules` reach-ins with bare specifiers or `require.resolve('tsx')`. Cluster C routed research, review and AI Council through the promoted `loop-lock.cjs`, added race-safe stale-lock reclaim through atomic rename and added atomic fan-out-merge write. Cluster D added lifecycle-taxonomy drift guard, `userPaused` as the 7th `stopReason`, advisory benchmark mode-precision signal, stale `@deep-ai-council` to `@ai-council` doc fix and runtime capabilities conformance coverage.

**Impact**

The improvement phase strengthened the real seams without rearchitecting the system. Runtime dependency ownership is local, stale locks and fan-out writes are safer, lifecycle taxonomy has guard coverage and the routing surface is exercised in CI.

**Why this was not a rewrite**

The research verdict was SOUND architecture. The packet honored that by implementing the concrete findings and preserving the invariant: one identity, no mode behavior change beyond added safety and runtime stays MCP-free.

---

## 5. CI, DOCTOR AND BENCHMARK RESTORE

**Before**

Routing drift could be detected only if a local test was run. `/doctor:parent-skill` did not yet carry advisor-sync checks, CI did not exercise the routing surface and skill-benchmark Lane C had broken path depth and stale fixture anchors.

**After**

`.github/workflows/routing-registry-drift.yml` now runs the lightweight routing drift gate through `npx --yes vitest@4.1.6` and `actions/setup-python`, avoiding `npm ci` because of untracked manifest, file sibling and native or ML dependency constraints. `/doctor` now checks canonical advisor-sync exact match and warns on non-canonical lexical coverage. Skill-benchmark Lane C was restored by fixing `SKILLS_DIR` from up-3 to up-4, `REPO_SKILLS` from up-1 to up-2, the deep-improvement e2e `--fixtures-dir agent-improve-001` and 3 stale parser anchors from `sk-code` playbook 24 to 28.

**Impact**

The routing guarantee now has multiple surfaces. CI catches drift in the dependency-free routing surface, `/doctor` gives local operator feedback and Lane C benchmark coverage is green again at HEAD.

**Why the warning stays a warning**

Non-canonical lexical modes are allowed to exist structurally before advisor wiring is complete. A scaffolded second parent skill can be valid with advisor wiring pending, so only the canonical skill asserts exact equality and missing non-canonical coverage warns.

---

## CURRENT STATE

Spec 150 is shipped as a completed phase-parent packet with four completed child phases. The parent remains lean, with authored parent purpose in `spec.md` and per-phase work in child folders. The research evidence stays at the parent level under `research/`, matching the packet's phase-parent note.

The current system has deep-prefixed mode packet identity, registry-level advisor routing metadata, exact projection drift checks, `/create:parent-skill`, sk-doc parent-skill guidance, `/doctor:parent-skill`, benchmark fixtures, CI routing drift coverage, runtime dependency seam guards, lifecycle taxonomy coverage and restored Lane C benchmark paths. Verification recorded 21 completed tasks in Phase 001, 15 in Phase 002, 16 in Phase 003 and 19 in Phase 004. The known follow-on is registry codegen, deliberately deferred because the current hand-maintained maps are now guarded by CI and doctor coverage.
