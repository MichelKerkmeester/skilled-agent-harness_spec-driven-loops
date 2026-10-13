# Iteration 001 — correctness

**Review target:** commits `17e465512a`, `dae07e6286`, `d6c30ebdf5` on `worktrees/133-surface-setup-build` (diff `a98004816d..d6c30ebdf5`)
**Iteration:** 1 of 5 · **Counts:** P0=0 · P1=0 · P2=1

---

## Dimension

correctness (dimensions for this run: correctness, security, traceability, maintainability).

Focus: the three commits' claim that each behavior change is correct, minimal, and pinned by tests — the guard's stale-fix line, the contract library's relabeled load failure with its gate handler, and the README adapting block's named commands and files.

---

## Files Reviewed

| File | What was checked |
| --- | --- |
| `README.md` | The adapting block: "Before you start" items 1–4, removal steps 6–7, add step 3 — every command, path and key the new text names. |
| `.skilled/bin/compiled-route-guard.cjs` | Full read: the `manifestPair` extraction, `staleFix`, the `inspect` fix plumbing, the `main` output loop and the module exports. |
| `.skilled/bin/tests/compiled-route-manifest.test.cjs` | T1/T2: the `guard.staleFix('sk-code', ...)` assertion and the per-hub skill-root edge (`sk-doc`). |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` | The `loadSharedFrontmatterParser` relabel, its exact-match condition, and its load-time position before the parser destructure. |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | The `SHARED_NOT_BUILT` catch: one-line stderr write, exit 1, rethrow of every other error. |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs` | T3/T4: the staged-library child runs, the one-line/no-stack assertions and the unrelated-missing-module edge. |
| `spec.md` (packet) | R1, R2, R4, R5, the edge cases and the acceptance ledger — the traceability anchor. |
| `goal.md` (packet) | D1–D5 decisions, completion criteria, progress log. |

Key citations: [SOURCE: .skilled/bin/compiled-route-guard.cjs:99] (`staleFix`), [SOURCE: .skilled/bin/compiled-route-guard.cjs:145] (`inspect` fix), [SOURCE: .skilled/bin/compiled-route-guard.cjs:195] (per-hub print), [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:83] (`failure.code = 'SHARED_NOT_BUILT'`), [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:63] (the one handler), [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:628], [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:642].

---

## Findings by Severity

### P0 — Blockers

None.

### P1 — Required

None.

### P2 — Suggestions

#### R1-P2-001 [P2] Only the gate catches the relabeled load failure; the spec's doctor edge case has no coverage

- **Case:** A fresh clone runs the doctor before provisioning: the contract library now throws `SHARED_NOT_BUILT` at load, and any consumer that recognizes only `MODULE_NOT_FOUND` no longer matches the failure.
- **File:** [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:83]
- **Evidence:** `SHARED_NOT_BUILT` appears at exactly two code sites in the changed set — the throw and the gate's catch at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:63]. T3/T4 cover the library in a staged temp dir, not the doctor. The spec's doctor edge case ("its 12-lib line carries the provision command", spec.md §EDGE CASES) is asserted with no test and no doctor change in these commits.
- **User impact:** If the doctor branches on `MODULE_NOT_FOUND`, a fresh-clone user sees a raw stack from the doctor instead of the named provision command — the exact failure R5 exists to remove. Unverified in either direction; no observed regression.
- **Finding class:** cross-consumer
- **Scope proof:** `grep -n SHARED_NOT_BUILT` over `.skilled` returns only `root-router-contract.cjs:83` (throw) and `ci-skill-root-metadata.cjs:63` (handler); no other handler exists in the changed set.
- **Affected surface hints:** ["parent-skill-check.cjs lib loader", "ci-skill-root-metadata.cjs gate", "root-router-contract.cjs relabel"]
- **Confidence:** 0.6 · **Downgrade trigger:** reading `parent-skill-check.cjs`'s lib loader and finding a code-agnostic catch (or running the clone scenario against the doctor) closes this as verified.
- **Recommendation:** Extend the clone ledger (L-1/L-2) or a test to run `parent-skill-check.cjs` in the unprovisioned tree and assert its line names the provision command; adjust the doctor's catch only if it branches on `MODULE_NOT_FOUND`.

---

## Traceability Checks

- **core — spec_code: verified.** R1 → README before-you-start items 1–2 (provision command and `skilled.trustRepoHooks`); R2 → `staleFix` names the refresh command, the skill root and both manifest paths, per hub, after the kept `Re-mint:` line; R4 → removal step 6 names the feature catalog, step 7 runs `regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write` with only `causal_summary` left by hand, add step 3 names the surface-count files and `leaf-scopes.json`; R5 → the relabel plus the gate's one-line exit 1. All four requirements map to changed lines; D1–D5 hold.
- **core — checklist_evidence: deferred.** Ledger rows L-1..L-6 and T1..T4 are recorded in `implementation-summary.md`, which is outside this review's scope files; the goal log still shows the build in progress. This iteration records what the change must satisfy, not that the ledger rows ran.
- **overlay — skill_agent: no skill agent document changed.** Both script edits are code; D5 (no skill release) is consistent with the diff.
- **overlay — agent_cross_runtime: no runtime-specific file appears in the changed set** (six files: README, two scripts, two test files, and the guard).
- **overlay — feature_catalog_code: partial.** Removal step 6 now names the hub's catalog files; the sk-code catalog file existence itself was not directly confirmed in this iteration (stated coverage limit).
- **overlay — playbook_capability: observed unchanged.** The removal recipe's playbook references are untouched, and no capability claim was invalidated.

### Coverage limits (not findings)

- Tests were not executed: this dispatch is a read-only iteration and repo tooling is out of scope, so all verification here is static.
- `parent-skill-check.cjs` was not read (see R1-P2-001); the two sk-code catalog/`leaf-scopes.json` files were not directly listed in the search result set.

---

## Verdict

**PASS** — no P0 or P1 findings. One P2 advisory (R1-P2-001) is recorded with its downgrade trigger; per the verdict mapping, P2-only remains PASS. The two code changes match their spec requirements, the message construction is sound (the pair derivation preserves the prior authored-path logic byte-for-byte), the relabel's exact-match condition is correctly scoped to the shared frontmatter module, and the four tests exist and assert on the changed behavior.

## Next Dimension

security (iteration 2), with R1-P2-001 as a candidate to re-check if the doctor path is read.

Review verdict: PASS
