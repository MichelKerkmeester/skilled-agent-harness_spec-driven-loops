# Iteration 3 — Traceability

**Iteration:** 3 of 5 · **Mode:** review · **Dimension:** traceability
**Target:** commits 17e465512a, dae07e6286, d6c30ebdf5 on `worktrees/133-surface-setup-build` (diff a98004816d..d6c30ebdf5)
**Prior findings:** P0=0, P1=0, P2=1 (R1-P2-001, active)

---

## DIMENSION

Traceability, checked in both directions over the full six-file diff: every requirement (R1, R2, R4, R5), decision (D1–D5) and edge case in the packet maps to a changed line or a pinning test, and every changed hunk maps back to a requirement. Core protocols: `spec_code`, `checklist_evidence`. Overlay protocols: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`.

## FILES REVIEWED

| File | Lines | Role in the trace |
|---|---|---|
| `README.md` | 1451–1452, 1463–1464, 1472 | R1 and R4 text side |
| `.skilled/bin/compiled-route-guard.cjs` | 62–104, 145, 192–195, 219 | R2 implementation |
| `.skilled/bin/tests/compiled-route-manifest.test.cjs` | 623–647 | T1/T2 pins for R2 |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` | 64–90 | R5 named failure |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | 55–66 | R5 stack-free exit |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs` | 718–800 | T3/T4 pins for R5 |
| `spec.md` | 74–77, 87–94, 104–116, 176–185 | Requirement side of the trace |
| `goal.md` | 44–48, 61–67 | D1–D5 and the completion criteria |
| `scratch/review-diff.patch` | 1–333 | The reviewed diff |

Line numbers are the post-change (new-file) numbers derived from the diff hunk arithmetic and cross-checked against the iteration 1–2 citations.

## FINDINGS BY SEVERITY

### P0 — none

### P1 — none

### P2 — none new

One carried advisory stays active and is traceability-relevant: **R1-P2-001** — the spec's doctor edge case (`spec.md:184`) has no mapped change or test in this diff. It is not re-filed; it is already open in the findings registry with a `downgradeTrigger` ("reading parent-skill-check.cjs's lib loader … closes this as verified") for whoever next reads that file.

## TRACEABILITY CHECKS

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | pass | requirement↔changed-line map complete in both directions (below) |
| `checklist_evidence` | core | blocked | ledger rows live in `implementation-summary.md`, outside the review scope files |
| `skill_agent` | overlay | notApplicable | no skill doc or agent document in the changed set; D5 holds |
| `agent_cross_runtime` | overlay | notApplicable | no runtime-specific file in the changed set |
| `feature_catalog_code` | overlay | pass | `README.md:1463` names the hub catalog; existence confirmed in iteration 2 |
| `playbook_capability` | overlay | observed unchanged | removal step 6 keeps the manual-testing-playbook rows |

### spec_code — pass

**Requirements → changed lines**

- **R1** → [SOURCE: README.md:1451] (provision item) and [SOURCE: README.md:1452] (`skilled.trustRepoHooks` item), matching D1 at `goal.md:44`.
- **R2** → the new `staleFix` derivation at [SOURCE: .skilled/bin/compiled-route-guard.cjs:100], its per-hub return string at [SOURCE: .skilled/bin/compiled-route-guard.cjs:104], the `inspect` branch at [SOURCE: .skilled/bin/compiled-route-guard.cjs:145] and the print at [SOURCE: .skilled/bin/compiled-route-guard.cjs:195]. The line names the refresh command, the runtime manifest, its authored twin, the copy and the hooks alternative — D2 verbatim.
- **R4** → [SOURCE: README.md:1463] (removal step 6, feature catalog), [SOURCE: README.md:1464] (step 7, `regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write`, with `causal_summary` as the only hand edit), [SOURCE: README.md:1472] (add step 3, the surface-count files plus `leaf-scopes.json` with the sk-doc format exemplar).
- **R5** → the loader at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:83] (`failure.code = 'SHARED_NOT_BUILT'`), message at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:81], rethrow of any other load error at `:79`, and the stack-free gate at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:64] with the exit at `:66`.

**Changed lines → requirements (reverse direction)**

The diff touches exactly the six rows of the spec's Files to Change table (`spec.md:87–94`): README, guard, guard test, contract library, ci checker, contract test. No seventh file appears, and every hunk maps to R1, R2, R4, R5 or its test row. The README's untouched neighbors are the declared non-goals.

**Tests pinning the behavior changes**

- T1/T2 (guard): `compiled-route-manifest.test.cjs:623–647`, calling `guard.staleFix` at `:628` and `:642`; T2 asserts a second hub gets its own skill root and that no `sk-code` text leaks.
- T3/T4 (relabel): `root-router-contract.test.cjs:718–800`; T3 asserts one line naming the provision command with no stack frame (`:753–769`), T4 asserts an unrelated missing module is not relabeled (`:773–797`).

**Edge cases (`spec.md:176–185`)**

- A stale hub other than sk-code → T2.
- A module other than `@spec-kit/shared` → T4.
- A fresh hub carries no stale fix text → trivially unreachable: fresh hubs are never in the failures array, and the print loop filters `stale-manifest` only (guard `:192`).
- The doctor loads the library in an unprovisioned tree → no mapped change or test; carried as open R1-P2-001.

**Decisions**

D1 → README `:1451–1452`; D2 → guard `:100–104`; D3 → router `:79–84` and ci `:64–66`; D4 → T1–T4 plus the ledger rows the spec declares; D5 → no skill doc changed, and the two `.skilled/skills/.../scripts` files are code and tests, not skill docs.

### checklist_evidence — blocked

The acceptance ledger (L-1..L-6) and the T-row results are recorded in `implementation-summary.md`, which is not among the review scope files; `goal.md:64` shows the packet still expects those rows. A read-only iteration cannot execute the clone and copy runs. Recorded as blocked, not failed: the ledger is the phase's own closure gate.

### Overlay checks

- **skill_agent — notApplicable.** No SKILL.md or agent document is in the changed set; D5 holds.
- **agent_cross_runtime — notApplicable.** No runtime-specific file appears in the diff.
- **feature_catalog_code — pass.** `README.md:1463` now names `.skilled/skills/sk-code/feature-catalog/feature-catalog.md` and its `two-axis-registry-driven-routing/` file; iteration 2 confirmed both exist. `sk-code/leaf-scopes.json` remains absent by design — `README.md:1472` names it as the file a user creates when `MODE_LEAF_SET_COLLISION` fires, with `.skilled/skills/sk-doc/leaf-scopes.json` as the format exemplar (exists).
- **playbook_capability — observed unchanged.** The removal recipe's playbook references are untouched and no capability claim is invalidated.

## SCOPE VIOLATIONS

None.

## VERDICT

**PASS with advisories.** Zero new findings this iteration; no P0 or P1. The single active P2 (R1-P2-001) is carried, traceability-relevant but not re-filed. All core and overlay traceability protocols resolve except `checklist_evidence`, which is blocked by the review scope, not by the change.

## NEXT DIMENSION

maintainability (iteration 4 of 5).

Review verdict: PASS
