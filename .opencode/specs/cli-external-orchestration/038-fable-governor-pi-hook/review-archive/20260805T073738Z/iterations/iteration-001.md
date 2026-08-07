# Deep Review Iteration 001

## Dimension

correctness

## Files Reviewed

- .opencode/hooks/dispatch/lib/dispatch-audit.mjs:207-263
- .opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts:186-301
- .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs:53-101
- .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts:110-252
- .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:64-106
- .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:265-414
- .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening/spec.md:104-199
- .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/checklist.md:93-160
- .opencode/hooks/injection-contract.md:47-58
- .opencode/skills/system-spec-kit/constitutional/fable-governor.md:19-34

## Findings by Severity

### P0

None.

### P1

#### R1-P1-001 — Over-limit dispatch commands bypass Pi authorization

- File: .opencode/hooks/dispatch/lib/dispatch-audit.mjs:229-249
- Claim: A direct external dispatch padded beyond the inspector bound is returned as kind none.
- Evidence: The inspector exits early for command.length > 32768; Pi preflight returns on kind none before shouldDenyPiDispatch. The targeted probe produced length 32782 and inspection kind none.
- Counterevidence sought: A lower upstream Pi/shell command limit or another preflight rejecting over-limit dispatch candidates.
- Alternative explanation: The bound may be intended only as a resource guard, but the reviewed Pi path has no second classifier.
- Finding class: cross-consumer
- Scope proof: Shared inspector plus Pi consumer; packet REQ-005/NFR-S02 require opaque candidates not to bypass.
- Recommendation: Treat over-limit dispatch-shaped input as ambiguous or fail closed, and add a padded direct-dispatch regression.
- Final severity: P1; confidence 0.98. Downgrade only if an upstream limit or second guard is proven.

#### R1-P1-002 — Unquoted echo text is blocked as an ambiguous dispatch

- File: .opencode/hooks/dispatch/lib/dispatch-audit.mjs:207-221
- Claim: echo devin -p task is classified as an ambiguous candidate.
- Evidence: hasDispatchEvidence only checks for executor and print tokens, not command head; Pi blocks every ambiguous inspection. Existing negative coverage uses quoted echo only.
- Counterevidence sought: A documented intentional policy to block unquoted echo/printf text or a parser rule that filters safe text emitters.
- Alternative explanation: The parser may conservatively block opaque syntax, but the packet explicitly lists echo/printf text as non-dispatch controls.
- Finding class: class-of-bug
- Scope proof: Shared predicate and Pi deny branch affect all executor-shaped text in a segment.
- Recommendation: Require executable-position evidence or model safe echo/printf heads; add unquoted negative-control tests.
- Final severity: P1; confidence 0.95. Downgrade if the contract explicitly allows this false positive.

#### R1-P1-003 — Write containment exempts pre-existing dirty paths by name only

- File: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:273-301
- Claim: A leaf can mutate an already-dirty out-of-scope path without detection.
- Evidence: The baseline is string[]; detection skips any current path in preSet without comparing status/content and cannot observe disappearance of a pre-existing untracked path.
- Counterevidence sought: Caller-level content snapshots or a read-only guarantee for guarded leaves.
- Alternative explanation: Path-only subtraction may be intentional to avoid reverting operator work, but it does not prove the leaf left it unchanged.
- Finding class: cross-consumer
- Scope proof: These functions are the complete baseline/detection pair for the module.
- Recommendation: Snapshot content/presence or another immutable fingerprint and detect modifications/deletions separately from unchanged dirty paths.
- Final severity: P1; confidence 0.93. Downgrade if an external baseline or read-only guarantee is proven.

## Traceability Checks

- Core spec_code: FAIL — REQ-005 and the containment invariant are contradicted by observed boundary behavior.
- Core checklist_evidence: PARTIAL — focused tests cover normal direct/ambiguous cases and transform order, but not padded dispatches, unquoted echo, or mutation of pre-existing dirty paths.
- Overlay skill_agent: NOT APPLICABLE for this correctness pivot.
- Overlay agent_cross_runtime: PARTIAL — the shared inspector affects runtime adapters, but only Pi consumption was exercised.
- Overlay feature_catalog_code: NOT APPLICABLE.
- Overlay playbook_capability: PARTIAL — hook installation check was run, but the installed Codex hook surface is stale.
- Quality gates: evidence PARTIAL, scope PASS, coverage PARTIAL.
- Resource-map coverage: skipped because resource-map.md is absent.
- Environment note: node .opencode/bin/install-codex-hooks.mjs --check exited 1 with missing=8 and orphaned=7; no installation mutation was attempted.

## Verdict

FAIL — three P1 correctness findings remain open.

## Next Dimension

security — focus on authorization bypasses, fail-open boundaries, and receipt/containment failure paths.

## SCOPE VIOLATIONS

None. Only the four externalized review state paths are writable; no reviewed source or packet document was modified.
---

## Supplemental Correctness Sweep

### Findings by Severity

#### P0

None.

#### P1

##### R1-P1-004 — Receipt paths accept traversal-capable caller input

- File: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:515-519
- Evidence: receiptDir and dispatchId flow into path.join without a safe-identifier or descendant check; the resulting path is written atomically at lines 531-537.
- Scope proof: executor-audit.ts:146-151, 515-519, 605-614 contains the complete input-to-write flow.
- Recommendation: Constrain both inputs and enforce resolved-path containment.
- Final severity: P1; confidence 0.97.

##### R1-P1-005 — Non-Codex fanout leaves run write-capable without structural containment

- File: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2360-2367
- Evidence: the sandbox is write-capable and the lineageDir boundary is prompt-only, while structural containment is enabled only for cli-codex.
- Scope proof: the conditional at 2366 controls the only guard invoked at 2424-2457.
- Recommendation: Enforce a filesystem boundary for every writable executor or fail closed before dispatch.
- Final severity: P1; confidence 0.95.

##### R1-P1-006 — Pi nonzero exits are accepted when partial artifacts remain

- File: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2475-2512
- Evidence: nonzero cli-pi exits are exempted, then artifact presence alone can satisfy the success gate.
- Scope proof: the exception is at 2481-2487 and the artifact gate at 2502-2512; no terminal-success marker is required.
- Recommendation: Require a terminal-success record or a proven benign exit contract tied to complete artifacts.
- Final severity: P1; confidence 0.93.

### Traceability Checks

- spec_code: FAIL
- checklist_evidence: PARTIAL
- agent_cross_runtime: PARTIAL
- quality gates: evidence PARTIAL, scope PASS, coverage PARTIAL
- graph/semantic search: unavailable; graphless fallback used

### Verdict

FAIL — three additional P1 correctness findings are open.

### Next Dimension

Security: receipt trust boundaries, fail-open behavior, and cross-runtime authorization/containment interactions.

## SCOPE VIOLATIONS

None. Only the four externalized review state paths were written.
