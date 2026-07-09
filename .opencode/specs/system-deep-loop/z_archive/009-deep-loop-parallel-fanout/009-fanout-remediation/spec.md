---
title: "Feature Specification: Deep-loop fan-out remediation (009)"
description: "Fix the 14 verified findings from the packet-123 deep review: 2 P0 (serial fan-out, false-PASS), 1 latent-P0 (executor field drift), 8 P1, 3 P2 — making the parallel fan-out actually concurrent, the review gate fail-closed, and the runtime hardened."
trigger_phrases:
  - "123 phase 009 fanout remediation"
  - "fix fanout serial spawnSync"
  - "fanout false pass review gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/009-deep-loop-parallel-fanout/009-fanout-remediation"
    last_updated_at: "2026-05-31T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level-3 remediation spec for the 14 verified fan-out review findings"
    next_safe_action: "Implement Phase 1 P0 fixes; C-02 fail-closed before C-01 async spawn"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Deep-loop fan-out remediation (009)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The packet-123 deep review (16× GPT-5.5 xhigh + 2× Opus-4.8 verification, every finding re-read against source) found the deep-loop parallel fan-out **CONDITIONAL — not a clean pass**: **2 confirmed P0**, **1 latent-P0**, **8 P1**, **3 P2**. The feature's headline capability ("run N executor lineages concurrently, capped") does not work — the pool worker blocks on `spawnSync`, so CLI fan-out is fully serial and `--concurrency` is inert. Worse, a fan-out review whose lineages all crash returns a **false PASS**. The 72-test suite is green but structurally cannot catch either P0 (it injects an async mock worker and never runs the real spawn path; the salvage test enshrines a filename bug).

This phase fixes all 14 findings + optionals, reusing existing runtime helpers (`runAuditedExecutorCommandAsync`, `buildExecutorDispatchEnv`, `pad3`) rather than writing new machinery.

**Key Decisions**: true verbatim per-CLI-lineage execution (ADR-001); standardize the executor field on `.kind` (ADR-002); reuse the existing env allowlist (ADR-003); full Level-3 anchors so the phase passes `validate.sh --strict` (ADR-004); preserve the single-executor byte-identical parity gate (ADR-005).

<!-- /ANCHOR:executive-summary -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-05-31 |
| **Parent** | `123-deep-loop-parallel-fanout` |
| **Estimated LOC** | ~400 (code) + tests |
| **Source review** | `../008-deep-review/review/review-report.md`, `../008-deep-review/opus/iterations/iteration-00{1,2}.md` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 123 shipped a "parallel multi-executor fan-out" layer for `/deep:start-review-loop` and `/deep:start-research-loop`. A three-pass review proved the core behavior is broken: (1) CLI fan-out runs strictly serially because the pool worker calls blocking `spawnSync` with no `await` (`--concurrency` has no effect); (2) a lineage that exits non-zero or times out is recorded as a success, and the review merge returns PASS when zero registries are readable — a fan-out review where every lineage crashed yields a false PASS; (3) the executor field name diverges across three layers (`.type` in command docs, `.kind` in the review YAML predicate, canonicalized only inside the loader); plus 8 P1 and 3 P2 hardening/doc gaps. The green 72-test suite cannot catch the P0s because the pool tests use an async mock worker and never exercise the real spawn path.

### Purpose
Make the fan-out feature do what packet 123 promised — genuinely concurrent, capped, fail-closed, contract-honest — by fixing all 14 verified findings, reusing existing runtime helpers, and adding the tests that would have caught the P0s. Preserve the single-executor path byte-identical throughout.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All 14 verified findings from the 008 review (2 P0, 1 latent-P0, 8 P1, 3 P2), grouped into 3 phases.
- New tests that exercise the REAL spawn worker (not the mock) and assert true concurrency + fail-closed merge.
- Doc-staleness cleanup for sibling children 003–006 + parent continuity.

### Out of Scope
- Packet 122 (separately reviewed PASS).
- Any new fan-out capability beyond shipped scope (the 007 iterationPlan design is its own phase).
- Changing the single-executor default path behavior (hard parity gate — it must stay byte-identical).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `deep-loop-runtime/scripts/fanout-run.cjs` | Modify | C-01 async spawn, C-02 throw-on-failure, C-03 verbatim invoke, ENV-LEAK allowlist, N-02 comment |
| `deep-loop-runtime/scripts/fanout-merge.cjs` | Modify | C-02 fail-closed, MERGE-DROP sentinel, MERGE-DEDUP content-hash, N-04 attribution |
| `deep-loop-runtime/scripts/fanout-salvage.cjs` | Modify | C-04 zero-pad filename, N-01 stop blob reuse |
| `deep-loop-runtime/lib/deep-loop/executor-config.ts` | Modify | BOUNDS caps, XOR root validator |
| `deep-loop-runtime/lib/council/session-state-hierarchy.cjs` | Modify | export `pad3` (reuse target for C-04) |
| `commands/deep/assets/deep_start-{review,research}-loop_{auto,confirm}.yaml` | Modify | U-01 `.kind` predicate parity |
| `commands/deep/start-{review,research}-loop.md` | Modify | U-01 doc field alignment to `.kind` |
| `deep-loop-runtime/tests/unit/fanout-*.vitest.ts` | Modify | new real-spawn + fail-closed + hardening tests |
| `123/00{3,4,5,6}/{implementation-summary.md,graph-metadata.json}` + parent `spec.md` | Modify | DOC-STALENESS |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 (C-02) | A failed lineage must not count as success | Worker throws on `exitCode!==0 \|\| timedOut`; pool `summary.failed>0`; merge non-PASS |
| REQ-002 (C-02) | Review merge fails closed on no readable registries | `mergeReviewRegistries` over zero registries returns non-PASS (not PASS) |
| REQ-003 (C-01) | CLI fan-out runs genuinely concurrently | Real-spawn test at `concurrency:2` shows ≥2 subprocesses alive simultaneously |
| REQ-004 (U-01) | One canonical executor field end-to-end | Native default review/research takes the native branch; docs + YAML + loader all use `.kind` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 (MERGE-DROP) | Malformed registry fails closed | Parse error surfaces; lineage not silently dropped from verdict |
| REQ-011 (TIMEOUT-ORPHANS) | Timed-out lineage leaves no orphans | `detached` + process-group kill on timeout (folded into C-01 reuse) |
| REQ-012 (BOUNDS) | Lineage count + concurrency are bounded | Over-cap config rejected by `parseFanoutConfig` |
| REQ-013 (ENV-LEAK) | Child env is allowlisted | A non-allowlisted parent var is absent in the child env |
| REQ-014 (MERGE-DEDUP) | Cross-lineage dedup by content | Same finding from 2 lineages dedupes to 1 (content-hash key) |
| REQ-015 (XOR) | executor+fanout both-present rejected | Root validator throws on a both-present config |
| REQ-016 (C-04) | Salvage filenames are zero-padded | Salvage writes `iteration-001.md`; matching test updated |
| REQ-017 (N-01) | Salvage does not reuse one blob | Distinct missing iterations do not all get byte-identical content |
| REQ-018 (C-03) | CLI lineage runs the command verbatim | `buildLoopPrompt` synthesis replaced; `lineage.iterations` forwarded as max-iterations |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A real-spawn pool test proves concurrent execution (fails on today's code, passes after C-01).
- **SC-002**: An all-lineages-fail fan-out review yields a non-PASS merged verdict (fails today, passes after C-02).
- **SC-003**: The full fan-out unit suite is green AND includes the two new P0-catching tests (≥72 + new).
- **SC-004**: Single-executor path output is byte-identical to pre-change `main` (parity gate, ADR-005).
- **SC-005**: `validate.sh --strict` is green on this `009` folder.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `runAuditedExecutorCommandAsync` (executor-audit.ts:663) | C-01/TIMEOUT-ORPHANS reuse target | Already async + detached + SIGTERM→SIGKILL; verify signature before wiring |
| Dependency | `buildExecutorDispatchEnv` (executor-audit.ts:466) | ENV-LEAK reuse target | Confirm it carries every CLI auth prefix the lineages need |
| Risk | C-01 changes the dispatch hot path | Could perturb single-executor parity | Touch the INNER worker only; leave the TSX self-respawn `spawnSync` (N-02); run the parity gate |
| Risk | U-01 field rename touches 6 command files | Could break research path while fixing review | Change both consumers to `.kind` atomically; native-run trace both loops |
| Risk | C-03 verbatim is L/High | Largest change, last in order | Sequenced last; behind the parity gate; its own task cluster |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Fan-out wall-clock for N lineages at concurrency K approximates ceil(N/K)×per-lineage, not N×per-lineage (the point of fixing C-01).

### Security
- **NFR-S01**: Child subprocesses receive only allowlisted env (no blanket `*_KEY`/`*_TOKEN` passthrough).
- **NFR-S02**: A hostile config (huge count/concurrency) is rejected, not materialized (BOUNDS).

### Reliability
- **NFR-R01**: A crashed/timed-out/unreadable lineage is always reflected as a failure, never silently dropped or counted as success (C-02 + MERGE-DROP).
- **NFR-R02**: No orphan subprocess survives a timed-out lineage (TIMEOUT-ORPHANS).

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Zero readable registries**: merge returns non-PASS (fail-closed), not PASS.
- **count/concurrency at/over cap**: rejected with a clear validation error.
- **Both executor + fanout present**: rejected by the XOR validator.

### Error Scenarios
- **Lineage exits non-zero**: counted as failed; merge reflects it.
- **Lineage times out**: SIGTERM→SIGKILL the process group; counted as failed; no orphans.
- **Malformed lineage registry JSON**: parse-error sentinel; lineage not dropped from the verdict.

### Concurrent Operations
- **N>K lineages**: at most K subprocesses alive at once; remainder admitted as slots free (verified by the real-spawn test).

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Overall complexity: **Medium-High**. The change set is ~400 LOC across 5 code files + 6 command files + tests, decomposed into independent fixes with one genuinely hard item (C-03 verbatim, L/High) and one hot-path item (C-01 async spawn) gated by the byte-identical parity requirement. Risk concentrates in two places: the C-01 spawn rewrite (mitigated by reusing `runAuditedExecutorCommandAsync` and touching the inner worker only) and the U-01 field rename (mitigated by an atomic `.kind` change across both consumers). The remaining 10 fixes are S/M, mostly local, individually testable. Reusing three existing helpers (async spawn, env allowlist, pad) keeps net new logic small.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | C-01 async rewrite perturbs single-executor parity | H | L | Inner-worker-only change + parity gate (ADR-005) |
| R-002 | U-01 fix breaks research while fixing review | M | M | Atomic `.kind` change across both consumers + native trace |
| R-003 | C-03 verbatim invoke regresses a CLI kind | M | M | Sequenced last, behind parity gate, per-kind test |
| R-004 | ENV allowlist drops a var a CLI needs | M | L | Reuse the proven single-executor allowlist (carries auth prefixes) |
| R-005 | Daemon graph-metadata churn pollutes commits | M | H | Scope every commit by explicit pathspec; never `git add -A` |

<!-- /ANCHOR:risk-matrix -->
---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Genuinely parallel fan-out (Priority: P0)
**As an** operator running a multi-model fan-out review, **I want** the lineages to actually run concurrently, **so that** N models finish in roughly one model's time, not N×.
**Acceptance Criteria**: Given `--concurrency 2` and 4 CLI lineages, When fan-out runs, Then at most 2 subprocesses are alive at once and wall-clock ≈ 2× per-lineage, not 4×.

### US-002: Trustworthy fan-out verdict (Priority: P0)
**As an** operator, **I want** a fan-out review to fail when its lineages fail, **so that** I never get a green light on a review that produced nothing.
**Acceptance Criteria**: Given every lineage exits non-zero, When the merge runs, Then the merged verdict is non-PASS and `summary.failed > 0`; a lineage with an unreadable registry is surfaced as failed, not silently skipped.

### US-003: Honest, consistent contract (Priority: P1)
**As a** maintainer, **I want** one executor field name and a verbatim lineage command, **so that** the native default path branches correctly and lineages run the real loop.
**Acceptance Criteria**: Given a default (native) run, When dispatch resolves, Then the native branch is taken; given a CLI lineage, When it runs, Then it invokes the existing command verbatim with `lineage.iterations` as the iteration cap.

<!-- /ANCHOR:user-stories -->
---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- U-01: does the YAML runner write the loader's normalized config back before the `.kind` predicate? **RESOLVED for spec purposes: standardize on `.kind` across docs + predicates so the answer doesn't matter (ADR-002).**
- C-03: verbatim vs prompt-synthesis for CLI kinds? **RESOLVED: implement true verbatim (ADR-001).**
- ENV-LEAK: allowlist vs denylist? **RESOLVED: reuse the existing allowlist `buildExecutorDispatchEnv` (ADR-003).**

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Resource Map**: See `resource-map.md`
- **Source review**: `../008-deep-review/review/review-report.md`

<!-- /ANCHOR:related-docs -->
