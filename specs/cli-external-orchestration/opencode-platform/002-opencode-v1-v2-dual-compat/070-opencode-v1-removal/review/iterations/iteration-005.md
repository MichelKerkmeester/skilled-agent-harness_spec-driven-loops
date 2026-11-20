# Deep Review — Iteration 005

## Dispatcher

- Mode: review (single iteration, LEAF)
- Target agent: `@deep-review`
- Resolved route: `Resolved route: mode=review target_agent=deep-review`
- Run: `2026-11-20T10:07:53.884Z`, sessionId `2026-11-20T10:07:53.884Z`, generation 3, lineageMode `restart`
- Iteration: 5 of 5 (JSONL-derived: 4 prior `type:"iteration"` records + 1)
- Focus: correctness fix-completeness replay — the three closed prior P1s re-proven PASS/FAIL against the merged tree, then all eight open P2s of this run re-adjudicated as confirmed, downgraded, or false positive. Terminal pass; no new dimension.

BINDING: target=specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness
BINDING: specFolder=specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal

## Files Reviewed

- `.vibe/plugins/repo-guards/session-cleanup.mjs:51,60,77,86` — the consumer that triggered DR4-P1-001; both hook paths build through `.factory`
- `.vibe/plugins/repo-guards/lib/hook-io.mjs:112-124` — `runGuard` fail-open wrapper
- `.vibe/plugins/repo-guards/tests/session-cleanup.test.mjs:36-38` — the test that drives the plugin factory
- `.opencode/plugins/lib/v2-bridge.js:16-23,313,327,343,348,429` — `dualPlugin` contract, `MAPPED_HOOKS`, `skippedKeys`
- `specs/.../003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:57,59,60,82-92` — AC-004/AC-006/AC-007 rows and the closure statement
- `specs/.../003-v1-docs-and-playbooks-sweep/implementation-summary.md:13,88` — AC-004 closure prose
- `specs/.../003-v1-docs-and-playbooks-sweep/scratch/justified.txt:1-32` — the justified survivor list, including the `f6aa8dc052b` additions
- `specs/.../001-v1-runtime-code-and-tests/scratch/event-capture.txt:1-3` — DR3-P2-001 header
- `specs/.../001-v1-runtime-code-and-tests/tasks.md:157` — DR3-P2-002 CHK-041
- `.github/workflows/opencode-v2-battery.yml:100-135` — the four-test step and its own trigger-path invariant comment
- `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts:108-123,520-529` — `VERSION_OUTPUTS`, `VERSION_CORPUS`, the parity loop
- `.skilled/commands/doctor/scripts/opencode-version-battery.cjs:867,893,942,976` — `serve` spawn, probe bind, readiness expectation
- `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:121-142,178-212` — trust resolution and the parser
- `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-models-form.test.cjs:15,51-53,64,146,173,205,440`
- `.skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs` (2 `opencode2` hits), `.opencode/plugins/tests/system-dist-freshness-guard.test.cjs` (6 `opencode2` hits)
- `.skilled/skills/cli-external-orchestration/feature-catalog/**` — AC-006 replacement grep surface (executed, 0 rows)

## Findings - New

### P0 Findings

None.

### P1 Findings

None. All three prior P1s replay clean (evidence table below).

### P2 Findings

None new this iteration. All eight open P2s of this run were re-read against the merged tree and each is re-confirmed active — none was fixed by `f6aa8dc052b`, none was a false positive, and none was downgraded (P2 is already the floor of the scale). They carry forward to synthesis unchanged.

## Fix-Completeness Replay (prior P1s)

| Prior finding | Claim under replay | Evidence (merged tree) | Verdict |
|---|---|---|---|
| DR4-P1-001 | No caller invokes the removed `.server` entry, and a factory-side TypeError is reported instead of being swallowed | Both hook paths call `sessionCleanupPlugin.factory({ worktree: projectDir })` [SOURCE: .vibe/plugins/repo-guards/session-cleanup.mjs:51] [SOURCE: .vibe/plugins/repo-guards/session-cleanup.mjs:60], reached through a dynamic `import` of the plugin's default export [SOURCE: .vibe/plugins/repo-guards/session-cleanup.mjs:77]. A repo-wide sweep for a dual-entry `.server` call finds only mcp-route-guard's unrelated `parsed.server` token, not the plugin bridge [SOURCE: .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs:242]. The bridge's return contract now states `serverUrl: undefined - Not provided on OpenCode 2` [SOURCE: .opencode/plugins/lib/v2-bridge.js:313]. `runGuard` writes `label: message` to stderr before taking the fail-open exit [SOURCE: .vibe/plugins/repo-guards/lib/hook-io.mjs:112-124], so a TypeError surfaces in the hook transcript rather than disappearing. The regression test drives the same `.factory` entry the hook uses [SOURCE: .vibe/plugins/repo-guards/tests/session-cleanup.test.mjs:36-38]. | PASS |
| DR3-P1-001 | 003 `acceptance-criteria.md` AC-004 `Met` agrees with 003 `implementation-summary.md` | AC-004 row reads `Met` with the live evidence inline (doctor battery, deep-loop iteration, plugin scenario CO-056, `observed 2026-11-19`) [SOURCE: specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:57]; the summary says "AC-004 was closed live on 2026-11-19" with the same three legs [SOURCE: specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/implementation-summary.md:88], and its continuity field repeats it [SOURCE: specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/implementation-summary.md:13]. No residual "not met" sentence survives. | PASS |
| DR-001-P1-001 | The closure statement no longer claims the phase is unimplemented or not closeable | "**Closeable:** Yes" followed by "Every criterion is Met, except AC-002, AC-006 and AC-008, which ADR-001 supersedes with replacement checks that print 0. AC-004 was met live on OpenCode 2.3.2" [SOURCE: specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:87-91]. A grep for `unimplemented` / `not closeable` over both 003 docs returns no hit. | PASS |

## Open P2 Re-Adjudication (all eight)

| Finding | Re-read evidence | Disposition |
|---|---|---|
| DR1-P2-001 — `opencode2` still a live v2 spelling in tests and docs | Still present: `opencode-models-form.test.cjs` scans for both spellings [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-models-form.test.cjs:15,51-53], `dispatch-audit.test.mjs` carries 2 hits, `system-dist-freshness-guard.test.cjs` carries 6. Trust resolution still lists only `opencode` plus `OPENCODE_BIN` [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:121-142]. Dispatch consequence stays latent exactly as recorded. | Confirmed active, no severity change |
| DR2-P2-001 — battery server bound to the package default while inheriting the full environment | `spawn(bin, ['serve', '--port', String(port)])` still passes no host flag [SOURCE: .skilled/commands/doctor/scripts/opencode-version-battery.cjs:976], the free-port probe still binds `127.0.0.1` [SOURCE: .skilled/commands/doctor/scripts/opencode-version-battery.cjs:867], and the readiness assertion still expects a `127.0.0.1` listening line [SOURCE: .skilled/commands/doctor/scripts/opencode-version-battery.cjs:893]. Bind posture remains unstated on the child. | Confirmed active |
| DR2-P2-002 — unmapped hook key dropped with no runtime signal | `skippedKeys` is still computed against `MAPPED_HOOKS` [SOURCE: .opencode/plugins/lib/v2-bridge.js:348] and attached only as a frozen non-enumerable property [SOURCE: .opencode/plugins/lib/v2-bridge.js:429]; no throw, log or registration-time assertion was added, and the live tree holds no test consumer of the property. | Confirmed active |
| DR3-P2-001 — event-capture evidence file contradicts itself | Header unchanged: "Event capture for OpenCode 2.3.2 (static, no live session was launched)" [SOURCE: specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/event-capture.txt:1], while the live-capture section the earlier iteration read at `:22-23` is untouched. | Confirmed active |
| DR3-P2-002 — CHK-041's recorded "prints 0" is not reproducible from the command as written | The check text is unchanged and still carries no file-scope or comment-only narrowing [SOURCE: specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/tasks.md:157]. | Confirmed active |
| DR4-P2-001 — the only `remove-v1` end-to-end test runs in no workflow | The step still names four files — config-shape, battery, `default-model-id`, `opencode-models-form` [SOURCE: .github/workflows/opencode-v2-battery.yml:117-124] — and `opencode-setup-classify.test.cjs` is still absent, under a comment that states the exact invariant the gap violates [SOURCE: .github/workflows/opencode-v2-battery.yml:110-113]. | Confirmed active |
| DR4-P2-002 — parser parity iterates the 9-element list, not the 13-entry corpus | The loop still runs `for (const output of VERSION_OUTPUTS)` [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts:520-529] over the nine constants [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts:108-117], while `VERSION_CORPUS` is still loaded from the 13-row JSON a few lines below [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts:119-123]. | Confirmed active |
| DR4-P2-003 — primary export builder still named `dualPlugin` | `export function dualPlugin(id, factory)` [SOURCE: .opencode/plugins/lib/v2-bridge.js:327] with a JSDoc that describes a single-target `{ id, setup }` builder [SOURCE: .opencode/plugins/lib/v2-bridge.js:317-326]. 525 files reference the identifier. | Confirmed active |

## Operator Focus: v1 survivorship and the justified list

- The `f6aa8dc052b` gap is closed: `scratch/justified.txt` now holds 32 rows and names `.skilled/bin/skilled-loop` [SOURCE: specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/justified.txt:2] plus its wrapper model-effort test [SOURCE: specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/justified.txt:10]. Not re-reported, per instruction.
- No stale entry in that list: all 32 paths resolve on the merged tree (32 of 32 exist, 0 `MISSING`).
- AC-006's ADR-001 replacement command, run live this iteration over the feature catalog, prints `0`.
- OpenCode 2 remains the only supported major on the dispatch guard: `SUPPORTED_FAMILIES` and every rule's `appliesTo` were confirmed in iterations 1 and 2 and nothing in this merge's later commits changes them; the only v1-capable surfaces left are the justified deliberate ones (refusal paths and their tests).

## Traceability Checks

- `checklist_evidence` — pass. 003 AC-004/AC-006/AC-007 and the closure statement re-read against the tree; the AC-006 replacement command executed live this iteration returns 0 [SOURCE: specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:59]. Two P2 documentation defects (DR3-P2-001, DR3-P2-002) remain open and unchanged.
- `spec_code` — pass (carried from iteration 3, spot-rechecked here via the trust-list and parser reads). `feature_catalog_code` and `playbook_capability` — pass (carried from iteration 3; no code behind them changed after the reviewed merge).
- `skill_agent` — notApplicable this iteration: the maintainability iteration reviewed the cli-opencode skill contract directly and raised no skill-contract finding, so there is no agent-facing surface left to key this protocol to.
- `agent_cross_runtime` — notApplicable this iteration: the runtime-mirror checkers are read-only packaging surfaces here, and this pass made no mirror claim.

## Integration Evidence

- `/deep:review` loop owner `.skilled/commands/deep/review.md` and its workflow `.skilled/commands/deep/assets/deep-review.yaml`: not re-read this iteration (no change since iteration 4); this iteration's state was written through the documented append gateway only.
- Caller agent `@orchestrate`, single-pass `@review`, sibling `@deep-research`: not invoked. LEAF nesting prohibition observed — no Task dispatch, no delegation, no sub-agent.

## Edge Cases

- `f6aa8dc052b` sits after the merge under review. It touched only the 003 justified list, so it does not widen the code-review scope; it was read as evidence for the operator's explicit instruction and for DR4/003 closure only.
- `justified.txt` uses tab-separated `path<TAB>reason`; the staleness loop reads field 1, which is why all 32 resolve.
- DR2-P2-002's only `skippedKeys` consumers in the repository are vendored `barter/` container baselines, not live surfaces. That confirms the property is unasserted in the live tree; the baselines are out of scope and were not treated as evidence of a fix.
- The 003 closure statement names AC-002/AC-006/AC-008 as ADR-001-superseded while the AC-002 row itself reads `Met`-adjacent wording elsewhere in the table; this mismatch was already adjudicated in iteration 3 as superseded-by-design and is not re-opened without new evidence.

## Confirmed-Clean Surfaces

- `.vibe/plugins/repo-guards/session-cleanup.mjs` — both hook paths, the dynamic import, and the fail-open wrapper; no removed entry point is reached.
- `.vibe/plugins/repo-guards/lib/hook-io.mjs` `runGuard` — error text reaches stderr before the fail-open exit.
- `.vibe/plugins/repo-guards/tests/session-cleanup.test.mjs` — drives the factory the hook itself uses.
- 003 `acceptance-criteria.md` closure block and AC-004 row — mutually consistent and consistent with `implementation-summary.md`.
- 003 `scratch/justified.txt` — 32 rows, all resolving, `skilled-loop` and its wrapper test included.
- Feature catalog — AC-006 replacement command returns 0 rows.

## Ruled Out

- "The `.server` entry still has a caller somewhere in the merge" — ruled out: the repo-wide token sweep returns only mcp-route-guard's unrelated `parsed.server`, and both vibe hook paths build through `.factory`.
- "The `f6aa8dc052b` fix is cosmetic and the T021 sweep still has a hole" — ruled out: the list has 32 resolving rows and the feature-catalog replacement grep prints 0.
- "One of the eight P2s was silently fixed by a later commit" — ruled out by direct re-read of each cited line; all eight still stand as filed.
- "The 003 closure statement still contradicts the AC table" — ruled out: it now states `Closeable: Yes` with the ADR-001 supersessions named explicitly.

## Next Focus

- Dimension: none — iteration 5 of 5. Rotation complete, `dimensionCoverage` 4/4.
- Focus area: synthesis. Carry the eight P2s and this replay table into the final verdict document.
- Reason: the fix-completeness replay is clean (3/3 PASS) and no new direction is available inside the iteration budget.
- Rotation status: complete.
- Blocked/productive carry-forward: reuse "read the consumer together with the builder it calls" — it is what let this pass prove the `.server` removal from the caller side instead of from the builder's JSDoc.
- Required evidence: none outstanding; synthesis owns the release-readiness decision.
- Recovery note: not applicable — no stuck count, no failed check, no blocked tool.

Review verdict: PASS
