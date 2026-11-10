# Deep Review — Iteration 4 of 5: Maintainability

## Dimension

`maintainability` — the fourth and final dimension (correctness, security and traceability ran in iterations 1-3). Target: the six changed files of commits `17e465512a`, `dae07e6286`, `d6c30ebdf5` (diff `a98004816d..d6c30ebdf5`) plus the packet's `spec.md` and `goal.md`. Read-only pass: no test, build or repository tooling was executed, and no reviewed file was touched.

## Files Reviewed

| File | Lines read | What was judged |
|------|-----------|-----------------|
| `README.md` | 1451, 1463, 1472 | the adapting block: "Before you start" items 1-4, removal steps 6-7, add step 3 |
| `.skilled/bin/compiled-route-guard.cjs` | full file (219 lines); 65, 99, 145, 195, 219 | `manifestPair`, `staleFix`, `inspect` wiring, CLI print, exports |
| `.skilled/bin/tests/compiled-route-manifest.test.cjs` | 623-648 | T1/T2: stale-fix text pins for sk-code and sk-doc |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` | 67, 83 (hunk 60-93) | `SHARED_FRONTMATTER_MODULE`, `PROVISION_COMMAND`, `loadSharedFrontmatterParser` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | 64 (hunk 51-67) | code-gated catch, one-line print, exit 1 |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs` | 718-801 | section 7: T3/T4 with a staged lib copy and child-process require |
| `spec.md` / `goal.md` | 74 / 36 | R1, R2, R4, R5; D1-D5 |
| repo-wide exact search | — | `compiled-route-manifest.cjs refresh\|worktree-naming.sh provision\|SHARED_NOT_BUILT` (60-hit cap; non-review-directory sites enumerated in the ledger) |

## Findings by Severity

### P0 — none

### P1 — none

### P2 — none new this iteration

No new maintainability finding. The one open advisory remains carried from iteration 1 (correctness): **R1-P2-001** — the relabeled `SHARED_NOT_BUILT` failure has exactly one updated handler, while the spec's doctor edge case is covered by no test in this change. It is not re-filed here; its downgrade trigger (read `parent-skill-check.cjs`'s lib loader, or run the clone scenario) is unchanged and was not re-entered this iteration.

Maintainability directions checked and ruled out (ledger `SL-016`..`SL-022` in the delta):

- **duplication** — each command string has exactly one code literal: the refresh command only at [SOURCE: .skilled/bin/compiled-route-guard.cjs:99] (the `staleFix` return), the provision command only as `PROVISION_COMMAND` in `root-router-contract.cjs`, and `ci-skill-root-metadata.cjs` prints `err.message` instead of restating it. The README, spec and goal restate the strings as documentation — the intended direction of truth is code → docs.
- **dead_code** — `staleFix` is called by `inspect()` at [SOURCE: .skilled/bin/compiled-route-guard.cjs:145] and by T1/T2 ([SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:623]); `manifestPair` serves both `authoredDrift` and `staleFix`. Nothing became dead in the refactor.
- **export_surface** — [SOURCE: .skilled/bin/compiled-route-guard.cjs:219] extends the existing export object by one name in the same pattern; its consumer is the test file.
- **message_consistency** — the stale sentence ("…, then copy … over …, or commit with the hooks installed so the pre-commit gate does both") and the sibling drift sentence ("…so the pre-commit gate copies it") differ deliberately: one clears two writes, the other one. The README fallback wording matches.
- **error_handling_consistency** — both new handlers rethrow anything that does not match: the library relabels only `MODULE_NOT_FOUND` whose message names exactly `SHARED_FRONTMATTER_MODULE`, and the gate swallows only `err.code === 'SHARED_NOT_BUILT'` ([SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:64]). T4 pins the negative path.
- **test_maintainability** — the new tests are deterministic and self-cleaning: `mkdtempSync` plus `try/finally` `rmSync`, `NODE_PATH` deleted from the child env, exit code and stderr asserted, no shared mutable state (the suite already runs `concurrency: false`).
- **comment_drift** — every new comment carries the durable WHY (parser built-not-committed, byte-comparison rationale, stale-is-the-one-failure-a-command-clears) with no packet, phase or requirement labels.

## Traceability Checks

Core:
- **spec_code — pass.** R2: the fix text built at [SOURCE: .skilled/bin/compiled-route-guard.cjs:99] is printed per stale hub at [SOURCE: .skilled/bin/compiled-route-guard.cjs:195] and pinned by T1/T2 at [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:623]. R5: the loader at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:83] relabels only the named module and the gate at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:64] prints it stack-free, pinned by T3/T4 at [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs:718]. R1/R4 README rows map as recorded in iteration 3. D2, D3 and D5 hold.
- **checklist_evidence — blocked.** Ledger rows L-1..L-6 and T1..T4 live in `implementation-summary.md`, outside the review scope files; carried from iteration 3 and not re-attempted (the strategy's do-not-retry entry covers the R5 verification attempt).

Overlay:
- **skill_agent — notApplicable.** No skill doc or agent document in the changed set; D5 holds.
- **agent_cross_runtime — notApplicable.** No runtime-specific file in the changed set.
- **feature_catalog_code — pass.** `README.md:1463` names the hub feature catalog and its two-axis file (existence confirmed in iteration 2; unchanged here).
- **playbook_capability — observed.** Removal step 6 keeps the manual-testing-playbook rows; no capability claim invalidated.

## SCOPE VIOLATIONS

None. All writes went to the bound artifacts; no reviewed file was modified.

## Verdict

**PASS.** No P0 and no P1 this iteration, and no new P2. The single carried advisory R1-P2-001 (correctness) remains open, so the provisional verdict stays `PASS hasAdvisories=true`.

## Next Dimension

None remaining — this iteration completes dimension coverage 4/4 (correctness, security, traceability, maintainability). Iteration 5 is the convergence pass over the findings registry.

Review verdict: PASS