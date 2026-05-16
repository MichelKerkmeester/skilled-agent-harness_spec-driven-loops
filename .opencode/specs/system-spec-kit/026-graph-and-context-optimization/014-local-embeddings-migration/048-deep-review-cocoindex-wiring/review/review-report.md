# Deep Review Report: 045 cocoindex_code MCP Wiring

**Review Session**: `rvw-2026-05-14-cocoindex-wiring`  
**Commit Reviewed**: `cddfbe4aa` (feat(test-infra,045): cocoindex_code MCP wiring + wave handover)  
**Date**: 2026-05-14  
**Iterations**: 5 (4 dimension passes + 1 stabilization)  
**Stop Reason**: `converged` — rolling average 0.033 < 0.08 threshold, all 4 dimensions covered, minStabilizationPasses satisfied.

---

## 1. EXECUTIVE SUMMARY

| Field | Value |
|-------|-------|
| **Verdict** | **CONDITIONAL** |
| **Active P0** | 0 |
| **Active P1** | 2 (F001, F002) |
| **Active P2** | 12 (F003–F014) |
| **hasAdvisories** | true |
| **Review Scope** | Commit cddfbe4aa — cocoindex_code MCP wiring in `run-mcp-direct.mjs` + spec docs |

The two-client shared-daemon architecture is sound and the CocoIndex wiring is correctly implemented. The smoke results (403/404/407/410 all PASS) are truthful and match the TSV evidence. The CONDITIONAL verdict is driven by 2 P1 correctness findings: a cleanup TypeError on partial connect failure (F001) and a missing connect timeout (F002). Neither blocks shipping (both are latent in the success path), but both should be addressed before the full 401–415 suite run.

---

## 2. PLANNING TRIGGER

**Route**: `/spec_kit:plan` — CONDITIONAL verdict triggers remediation planning.

**Why**: 2 active P1 findings require resolution before the packet can be considered PASS. The remediation is bounded: ~10 lines of code for F001 (null guard on cleanup), ~5 lines for F002 (Promise.race timeout on connect). Both are in `run-mcp-direct.mjs` only. No daemon source changes needed.

**P2 advisories**: 12 findings covering test coverage gaps, documentation staleness, defense-in-depth security, and code structure refinements. None block shipping.

---

## 3. ACTIVE FINDING REGISTRY

### P1 — Required (2 active)

| ID | Dimension | Title | File:Line | Iteration |
|----|-----------|-------|-----------|-----------|
| F001 | correctness | `finally` cleanup throws TypeError on null client | `run-mcp-direct.mjs:581` | It-1, upheld It-5 |
| F002 | correctness | No timeout on `client.connect()` | `run-mcp-direct.mjs:273` | It-1, upheld It-5 |

#### F001 — Cleanup TypeError on null client

- **Evidence**: `connection.client?.close().catch(() => {})` at line 581. When `connectSharedClient` returns `client: null` (partial connect failure, line 284), `null?.close()` evaluates to `undefined`, then `.catch()` throws `TypeError`. This is a synchronous throw inside `.map()`, aborting cleanup for ALL connections.
- **Impact**: TSV summary is written (line 580 executes first), but daemon client close and stderr stream end are skipped. Daemon processes may leak.
- **Adjudication (It-5)**: Verified. The null-client path is explicitly supported by `connectSharedClient` (spec says "falls back to memory-only behavior"). The cleanup path contradicts this contract.
- **Remediation**: Replace line 581 with: `await Promise.all(connections.map((connection) => connection.client ? connection.client.close().catch(() => {}) : Promise.resolve()));`

#### F002 — Missing connect timeout

- **Evidence**: `await client.connect(transport)` at line 273 has no timeout wrapper. The codebase already uses `Promise.race` with timeout for `callTool` (lines 189–197), but `connectSharedClient` does not.
- **Impact**: If a daemon process spawns but hangs during the MCP handshake, the runner hangs indefinitely. The `waitForCocoIndexDaemonIdle` check runs AFTER connect (line 550–557 guard), so it cannot prevent a connect hang.
- **Adjudication (It-5)**: Verified. The MCP SDK may or may not have internal connect timeouts — without documentation, we must assume it does not.
- **Remediation**: Wrap `client.connect(transport)` in `Promise.race` with a 60s timeout. On timeout, throw to trigger the existing catch path that emits a diagnostic row and sets `client: null`.

### P2 — Suggestion (12 active)

| ID | Dimension | Title | File:Line |
|----|-----------|-------|-----------|
| F003 | correctness / security | `parseObjectLiteral` uses `Function()` constructor | `run-mcp-direct.mjs:138` |
| F004 | correctness | `responseFailureMessage` may miss error patterns | `run-mcp-direct.mjs:203-209` |
| F005 | correctness | `runGenericScenario` fail-fast loses parallel-call information | `run-mcp-direct.mjs:447-476` |
| F006 | security | Unconditional `process.env` propagation to subprocess daemons | `run-mcp-direct.mjs:524-526` |
| F007 | security | Stderr capped logs may capture sensitive daemon output | `run-mcp-direct.mjs:21-25` |
| F008 | traceability | Handover file describes 045 as PARTIAL, contradicting commit | `HANDOVER...evening.md:96` |
| F009 | traceability | Spec requirements REQ-002/SC-001 describe only single-client | `spec.md:112,133` |
| F010 | traceability | Architecture tradeoff analysis not documented | `implementation-summary.md:119-130` |
| F011 | maintainability | Test uses fallback keys, not primary keys from production | `vitest.ts:48-53` |
| F012 | maintainability | Minimal test coverage (2 of 14+ functions tested) | `vitest.ts:1-55` |
| F013 | maintainability | Deep relative import path fragile to file moves | `vitest.ts:6` |
| F014 | maintainability | `runGenericScenario` mixes 3 phases in one function | `run-mcp-direct.mjs:422-483` |

**Detailed P2 descriptions and remediations** are in the per-iteration files: `iterations/iteration-001.md` through `iterations/iteration-004.md`.

---

## 4. REMEDIATION WORKSTREAMS

### Lane 1: Runner Cleanup Fixes (P1)

| Order | Finding | Action | Target |
|-------|---------|--------|--------|
| 1 | F001 | Add null guard on `client` before `.close().catch()` | `run-mcp-direct.mjs:581` |
| 2 | F002 | Add `Promise.race` timeout (60s) on `client.connect()` | `run-mcp-direct.mjs:273` |

**Estimated effort**: 15 minutes. Single file, 2 line changes.

### Lane 2: Documentation Updates (P2)

| Order | Finding | Action | Target |
|-------|---------|--------|--------|
| 3 | F008 | Update handover to reflect post-fix 045=SHIPPED state | `HANDOVER...evening.md:96` |
| 4 | F009 | Add REQ-010 for CocoIndex client; update SC-001 | `spec.md` |
| 5 | F010 | Document "two transports vs proxy through memory" tradeoff | `implementation-summary.md` |

### Lane 3: Defense-in-Depth (P2)

| Order | Finding | Action | Target |
|-------|---------|--------|--------|
| 6 | F003 | Replace `Function()` with safe object-literal tokenizer | `run-mcp-direct.mjs:138` |
| 7 | F006 | Pass only needed env vars to daemons (not full `process.env`) | `run-mcp-direct.mjs:524,534` |
| 8 | F007 | Document stderr log sensitivity; add `--no-stderr-log` flag | `run-mcp-direct.mjs` |

### Lane 4: Robustness & Test Coverage (P2)

| Order | Finding | Action | Target |
|-------|---------|--------|--------|
| 9 | F004 | Broaden error detection in `responseFailureMessage` | `run-mcp-direct.mjs:203` |
| 10 | F005 | Collect all call results before deciding verdict | `run-mcp-direct.mjs:447` |
| 11 | F011 | Add test with primary key names (`spec_kit_memory`, `cocoindex_code`) | `vitest.ts` |
| 12 | F012 | Add tests for `parseScenarioList`, `normalizeArguments`, etc. | `vitest.ts` |
| 13 | F013 | Use workspace alias or copy helpers to test dir | `vitest.ts:6` |
| 14 | F014 | Extract `checkToolAvailability` and `executeScenarioCalls` | `run-mcp-direct.mjs` |

---

## 5. SPEC SEED

Minimal spec updates implied by findings:

```markdown
## REQ-010: Runner starts a second StdioClientTransport for cocoindex_code
- AC: Script creates one StdioClientTransport for `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc mcp`
- AC: cocoindex_code.search calls are routed through this transport

## SC-001 (revised): Runner uses one MCP client connection per daemon surface
- AC: spec_kit_memory client connects to memory launcher
- AC: cocoindex_code client connects to CocoIndex MCP daemon

## REQ-011: Runner survives partial connect failure without crashing during cleanup
- AC: Failed daemon connections emit diagnostic rows
- AC: Remaining connected clients are properly closed in finally
- AC: Stderr streams are ended for both connected and failed daemons

## REQ-012: Runner times out daemon connections that hang during MCP handshake
- AC: client.connect() wrapped in configurable timeout (default 60s)
- AC: Timeout emits a diagnostic row and marks the client as disconnected
```

---

## 6. PLAN SEED

```markdown
### Phase 1: Runner Cleanup (P1 Fixes) — 15 min
- [ ] T001 Fix F001: null guard on client.close() in finally block (run-mcp-direct.mjs:581)
- [ ] T002 Fix F002: Promise.race timeout on client.connect() (run-mcp-direct.mjs:273)
- [ ] T003 Smoke re-run: node run-mcp-direct.mjs --scenarios 403,404,407,410
- [ ] T004 Verify smoke verdicts unchanged (should all PASS)

### Phase 2: Documentation Updates — 15 min
- [ ] T005 Update HANDOVER-2026-05-14-evening.md 045 status to SHIPPED
- [ ] T006 Add REQ-010/REQ-011/REQ-012 to spec.md
- [ ] T007 Add tradeoff analysis to implementation-summary.md Key Decisions

### Phase 3: Follow-up (P2, deferred) — 60 min
- [ ] T008 Replace Function() constructor with safe tokenizer (F003)
- [ ] T009 Scoped env vars for daemon subprocesses (F006)
- [ ] T010 Broaden responseFailureMessage error detection (F004)
- [ ] T011 Collect all call results before verdict (F005)
- [ ] T012 Add primary-key routing test (F011)
- [ ] T013 Add helper unit tests (F012)
```

---

## 7. TRACEABILITY STATUS

### Core Protocols

| Protocol | Status | Gate | Findings |
|----------|--------|------|----------|
| spec_code | **partial** | hard | F009: REQ-002/SC-001 describe only single-client. Scope section (line 80) correctly lists CocoIndex. |
| checklist_evidence | **partial** | hard | F001: CHK-012 "both clients close in finally" — inaccurate for partial-connect path. All other 27 checklist items verified. |

### Spec/Doc Alignment

| Check | Result |
|-------|--------|
| Smoke results match TSV evidence | PASS — verbatim match |
| Continuity frontmatter consistency (5 docs) | PASS — identical fields |
| Actor slug naming (`cli-codex-gpt-5-5-high`) | PASS — consistent, no `@` prefix |
| description.json accuracy | PASS — `status: "complete"`, keywords include `cocoindex-wired` |
| graph-metadata.json accuracy | PASS — two-client routing described in `causal_summary` |
| plan.md phases match implementation | PASS — Phase 2 CocoIndex Wiring documents 6 sub-tasks |
| tasks.md T018/T019 match completed work | PASS — T018 cocoindex wiring, T019 routing helper coverage |

### Overlay Protocols

Not applicable (target type = spec-folder; no overlay protocols configured).

---

## 8. DEFERRED ITEMS

The following P2 findings are deferred to follow-up work and do not block the CONDITIONAL → PASS transition:

| ID | Reason for Deferral |
|----|---------------------|
| F003 | Trusted repo content only; safe tokenizer is nice-to-have |
| F004 | Current patterns cover known MCP error shapes |
| F005 | Fail-fast is intentional design; partial-success metrics are enhancement |
| F006 | Internal daemons; defense-in-depth only |
| F007 | Capped at 200KB in sandbox; documented limitation |
| F008 | Handover is a session note, not canonical reference |
| F009 | Scope section already covers CocoIndex; requirements are implicit |
| F010 | Architecture is straightforward; rationale is inferable |
| F011 | Fallback keys work; primary keys would catch same errors |
| F012 | Sandbox evidence runner; unit coverage adequate for purpose |
| F013 | File layout is stable; cross-tree imports are project convention |
| F014 | Function is readable; extraction adds indirection for marginal gain |

---

## 9. AUDIT APPENDIX

### Iteration Summary

| Run | Focus | Files | P0 | P1 | P2 | Ratio | Status |
|-----|-------|-------|----|----|----|-------|--------|
| 1 | Correctness | 1 | 0 | 2 | 3 | 0.28 | complete |
| 2 | Security | 1 | 0 | 0 | 2* | 0.05 | complete |
| 3 | Traceability | 7 | 0 | 0 | 3 | 0.04 | complete |
| 4 | Maintainability | 2 | 0 | 0 | 4 | 0.06 | complete |
| 5 | Stabilization | 1 | 0 | 0 | 0 | 0.00 | complete |

*It-2: 1 refined (F003 severity confirmed) + 2 new = 3 total P2 findings.

### Convergence Signal Replay

| Signal | Weight | Value | Threshold | Pass |
|--------|--------|-------|-----------|------|
| Rolling average (It-3,4,5) | 0.30 | 0.033 | 0.08 | ✓ |
| MAD noise floor | 0.25 | 0.02 | — | ✓ |
| Dimension coverage | 0.45 | 1.0 (4/4) | 1.0 | ✓ |
| **Composite stop score** | — | **0.72** | 0.60 | ✓ |

**Stabilization**: 1 pass completed (It-5), 0 new findings. P0 override: not triggered (no P0 findings).

### File Coverage Matrix

| File | Lines | C | S | T | M | Findings |
|------|-------|---|---|---|---|----------|
| `run-mcp-direct.mjs` | 591 | ✓ | ✓ | — | ✓ | F001–F007, F014 |
| `shared-daemon-runner-helpers.vitest.ts` | 55 | — | — | — | ✓ | F011, F012, F013 |
| `045-shared-daemon-suite-runner/spec.md` | 214 | — | — | ✓ | — | F009 |
| `implementation-summary.md` | 191 | — | — | ✓ | — | F010 |
| `HANDOVER-2026-05-14-evening.md` | 263 | — | — | ✓ | — | F008 |
| Other spec docs (plan/tasks/checklist) | 468 | — | — | ✓ | — | — |

### Dimension Breakdown

| Dimension | Iterations | P0 | P1 | P2 |
|-----------|-----------|----|----|-----|
| Correctness | It-1, It-5 | 0 | 2 | 3 |
| Security | It-2, It-5 | 0 | 0 | 3* |
| Traceability | It-3, It-5 | 0 | 0 | 3 |
| Maintainability | It-4, It-5 | 0 | 0 | 4 |

*Includes F003 counted in both correctness and security dimensions.

### Convergence Reasoning

The review converged after 5 iterations:
1. **It-1 (0.28)**: First pass on correctness found the highest density of findings — expected for a new code surface.
2. **It-2 (0.05)**: Security scan on internal evidence tooling found only defense-in-depth issues — expected low.
3. **It-3 (0.04)**: Traceability found 3 documentation staleness issues in 7 files — the core alignment is strong.
4. **It-4 (0.06)**: Maintainability found 4 refinements in clean, well-factored code.
5. **It-5 (0.00)**: Stabilization pass confirmed no new findings, adversarial re-check upheld both P1 findings.

The rolling average dropped below 0.08 after It-3 and stayed there. The MAD noise floor confirms the finding rate has stabilized, not just slowed. All 4 dimensions are covered. The single stabilization pass revealed no missed issues, confirming saturation.

---

**Report Generated**: 2026-05-14T18:30:00Z  
**Review Session**: `rvw-2026-05-14-cocoindex-wiring`  
**Generation**: 1, Lineage Mode: new
