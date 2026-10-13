# Deep Review Iteration 4 — maintainability

- Run: `2026-10-13T21:11:31.000Z` (generation 1, lineage new)
- Mode: review; dimension 4 of 4 — maintainability
- Target: commit 79f5dacc52 (diff 49cfd5c89f..79f5dacc52): the read-only /doctor:sk-code setup battery and its surface
- Prior state: P0=0 P1=0 P2=7 (7 active)

## Dimension

maintainability — the fourth and final dimension. Focus: the executable surface (the setup battery script and its node:test suite) plus the command doc as the router contract those files must keep true. The traceability protocols were completed in iteration 3 and were not re-entered; no swept or blocked direction was re-entered.

Untrusted-content guard: the reviewed artifacts carried no instruction-like text; nothing embedded was treated as a directive.

## Files Reviewed

- `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs` — full read (328 lines); key lines 15-19, 37-67, 89-141, 184-255, 261-286, 305-328.
- `.skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs` — full read (208 lines); fixtures 37-101, cases 107-207.
- `.skilled/commands/doctor/sk-code.md` — full read (61 lines); router contract and workflow summary.
- State inputs (read, not reviewed as targets): findings registry, strategy, iteration-3 delta.

## Findings by Severity

### P0 — none

### P1 — none

### P2 — two new

#### 1 [P2] Leg wiring invariants are implicit; a missing JUDGES entry crashes instead of reporting

- Case: a maintainer adds a ninth leg to `LEGS` (or renames a leg id) without adding the matching `JUDGES` function or updating `PROVISION_DEPENDENTS`. The battery throws `TypeError: JUDGES[leg.id] is not a function` and prints a raw stack; a renamed id silently drops out of the skip set, so the dependent legs run on an unprovisioned tree instead of skipping.
- File: `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs:319` [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:319]
- Evidence: `LEGS` (8 entries) and `JUDGES` (8 keys) are separate id-keyed tables; the only link is the call at line 319. `PROVISION_DEPENDENTS` is a bare id Set at line 61 [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:61] and the skip gate at line 315 assumes provisioning is the first leg [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:315]. The leg layer explicitly normalizes a missing binary to a failure, "never a crash" (line 74) [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:74] — a missing judge is exactly a crash.
- User impact: a future leg edit fails with an internal stack trace (or a mis-skip) instead of the battery's FAIL/repair report, and the maintainer debugs the wrong layer.
- Finding class: class-of-bug
- Scope proof: full-file read shows the three id-keyed sites (61, 89-141, 184-255) and the single call site (319); no assertion or startup check references them.
- Affected surface hints: ["LEGS table", "JUDGES table", "PROVISION_DEPENDENTS set", "main loop"]
- Recommendation: add a module-load completeness check (every LEGS id has a JUDGES function; PROVISION_DEPENDENTS ⊆ LEGS ids) that fails with a clear message, or colocate the judge with each leg entry so the three tables become one.

#### 2 [P2] Header comment calls every leg a child process; the provisioning leg resolves in-process

- Case: a maintainer reads the module header, "Every leg runs as a child process from the repository root" (line 15), and models the provisioning leg as spawned. It is an in-process `require.resolve` with a paths override, so spawn-side concerns (cwd, env, buffer, missing-binary normalization) do not apply to it.
- File: `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs:15` [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:15]
- Evidence: the header sentence at 15-16 generalizes all legs to child processes; the provisioning leg's own comment at 93-94 states "No child process: the built shared package is resolved the way the skill scripts resolve it" [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:93], and its `run()` (95-104) is a try/catch `require.resolve` [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:96].
- User impact: a maintainer editing leg execution semantics misapplies them to the provisioning leg or misses that it has no child-process surface.
- Finding class: instance-only
- Scope proof: the contradiction is localized to the header sentence and one leg; every other leg spawns through `spawnLeg` (109-139).
- Affected surface hints: ["module header comment", "provisioning leg"]
- Recommendation: qualify the header sentence with the provisioning exception, or move the leg's existing note into the header.

Cumulative active findings after this iteration: 9 P2 (7 prior + 2 new); P0=0, P1=0.

## Traceability Checks

- Not re-entered: `spec_code`, `checklist_evidence` and the overlay protocols were completed in iteration 3; the strategy's exhausted list was respected.
- Scope confinement: both findings cite declared review-scope files only.
- Registry and strategy were read as state inputs, not reviewed as targets.

## Verdict

PASS — no P0 or P1 findings. Two new P2s on the final dimension; dimension coverage is now complete (4/4).

## Next Dimension

correctness (recheck) — the planned iteration 5, per the strategy's dimension order.

Review verdict: PASS