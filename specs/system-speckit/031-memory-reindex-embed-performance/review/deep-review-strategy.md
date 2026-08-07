---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `review/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

---

## 2. TOPIC

Review of all code and test changes made in this session on the `system-speckit/031-memory-reindex-embed-performance` packet:
1. The scan write-back data-integrity fix (REQ-006): `persistQualityLoopContent` origin-gating in `memory-save.ts`, plus the `startupScan`/file-watcher gap fix in `context-server.ts`.
2. The daemon/startup/MCP hardening implementation (REQ-007..011): probe collapse, async-ingest origin fix, background-scan default, owner-lease leaseId fencing, and canonical model-socket default.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [x] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [x] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [x] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS

- Not re-litigating the packet's original reindex-performance objective (REQ-001-005, not started, out of scope).
- Not reviewing unrelated concurrent-session work visible elsewhere in the repo.
- Not re-running the two prior GPT-5.6-Sol reviews from earlier this session (REQ-006 review, deep-research synthesis) — this is a fresh, independent pass using a different model.

---

## 5. STOP CONDITIONS

- Operator directive: run exactly 10 iterations, no early convergence unless genuinely exhausted (`stopPolicy: "max-iterations"` in config — convergence signals are telemetry only until iteration 10).
- Hard stop only at `maxIterationsReached` or an unrecoverable dispatch error.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
None yet -- populated as iterations complete dimension reviews

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| Traceability — REQ-006..011, checklist, continuity, overlays | PASS WITH P2 DOC FINDINGS | 6 | REQ-006..009 and REQ-011 align with implementation; REQ-010/CHK-074 reaffirms P1-001 scope boundary. P2-001: plan.md phase labels disagree with four other continuity blocks. P2-002: two affected-surfaces verification cells are manual or underspecified. Targeted evidence runs passed. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 1 active (`P1-001`: refresh/clear generation checks are not mutation-atomic — RE-ADJUDICATED in iter 8; stays P1 with refined framing: same-class TOCTOU as §13 item 1, sub-microsecond window between validation and write/unlink, bounded damage via heartbeat fence; documentation-completeness finding more than code-correctness finding)
- **P2 (Minor):** 3 active (`P2-001`: continuity phase-label mismatch; `P2-002`: affected-surfaces verification cells not uniformly executable; `P2-003`: leaseId-fencing invariant anchor gap in clear paths)
- **Delta this iteration (8):** +0 P0, +0 P1 (P1-001 re-adjudicated: stays P1), +0 P2; findings registry re-loaded with 4 active findings (1 P1 + 3 P2) and iter-8 adjudication record

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED

- Iteration 1 inventory mapped all 16 scope files (21,219 LOC) to REQ-006..011.
- Direct control-flow review plus the focused 8-test lifecycle suite confirmed the stale-reclaim regression test is non-vacuous and passes.
- Claim adjudication separated the accepted reclaim read→unlink residual from the broader unfenced refresh/clear mutations.

---

## 9. WHAT FAILED

- REQ-010 / CHK-074 overclaim complete heartbeat replacement fencing: refresh and clear do not bind mutation atomically to the validated `leaseId` (`P1-001`).

---

## 10. EXHAUSTED APPROACHES (do not retry)

[Populated when a review approach has been tried from multiple angles without yielding new findings]

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- MACHINE-OWNED: END -->

---

## 11. RULED OUT DIRECTIONS

- Iteration 1 ruled out “REQ-010 interleaving test is vacuous”: its side-effect spy installs a distinct successor lease between reads and its assertions require both acquisition refusal and exact successor survival; targeted execution passed 8/8.

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Iteration 2: continue correctness into REQ-007 probe collapse. Review `.opencode/bin/lib/launcher-ipc-bridge.cjs`, `.opencode/bin/lib/launcher-session-proxy.cjs`, and `.opencode/bin/mk-spec-memory-launcher.cjs:323-332`; verify warm-owner probe reuse, rejection handling, and preservation of reattach-path probing against `launcher-ipc-bridge-probe.vitest.ts` and `launcher-session-proxy.vitest.ts`. **[Iteration 2 — PASS, 0 findings, 4 verification claims adjudicated]**

Iteration 3: REQ-008 async-ingest fromScan fix verification + same-class producer sweep. Read `.opencode/skills/system-spec-kit/mcp-server/context-server.ts:2442-2456` processFile callback, audit `lib/ops/job-queue.ts:739-751` + `:635` crash-replay path, verify T47c/T47c-2 source-pattern vs runtime convention. **[Iteration 3 — PASS, 0 findings, 4 verification claims adjudicated; newFindingsRatio 0.0]**

Iteration 4: REQ-009 background-scan default at the MCP tool dispatch boundary. Confirmed strict omitted-only injection at `tools/lifecycle-tools.ts:63-71`, direct synchronous-handler bypasses at `cli.ts:468-491` and `context-server.ts:2264-2275`, non-vacuous focused tests (4/4 passed), schema agreement, and compiled-dist parity. **[Iteration 4 — PASS, 0 findings, 4 verification claims adjudicated; newFindingsRatio 0.0]**

Iteration 5 (DONE): shift to the SECURITY dimension across all 16 scoped files. Prioritize REQ-011 model-socket path handling for injection/traversal and unsafe filesystem-boundary behavior; examine REQ-010 `leaseId` for predictable-token or authority-confusion risk; run a general secrets/hardcoded-credential sweep. **[Iteration 5 — PASS, 0 findings, 5 adjudications: S-Q1 P2 (microsecond TOCTOU residual on /tmp/mk-hf-embed; asserts ARE invoked); S-Q2 PASS (crypto.randomUUID appropriate); S-Q3 PASS (background:true default expands convenience not trust boundary); S-Q4 PASS (every spawn fixed command + arg array); S-Q5 PASS (no hardcoded secrets; scrubSecretsDetailed + CHILD_ENV_ALLOWLIST active); newFindingsRatio 0.0]**

Iteration 6 (DONE): TRACEABILITY review across REQ-006..011, CHK-070..078, all five continuity blocks, feature-catalog overlay, and the FIX ADDENDUM affected-surfaces table. Targeted evidence runs passed (6 focused tests plus 27 hardening tests). REQ-006..009 and REQ-011 text matches implementation; REQ-010's complete-fencing wording remains bounded by P1-001. Added P2-001 for inconsistent plan.md phase labels and P2-002 for two non-executable/underspecified verification cells. Feature-catalog overlay correctly notApplicable for internal daemon hardening.

Iteration 7 (DONE): MAINTAINABILITY. Found P2-003 (leaseId-fencing invariant anchor gap in clear paths) and reaffirmed comment-hygiene discipline.

Iteration 8 (DONE): ADVERSARIAL RE-VERIFICATION OF P1-001. Three scenarios adjudicated: (a) refresh late-arrival heartbeat — EXPLOITABLE in sub-microsecond window between L563 read and L570 write; damage bounded to successor-process self-termination via heartbeat fence L595-601. (b) clear cross-process — EXPLOITABLE in sub-microsecond window between L616 second-read and L617 unlink; same bounded damage. (c) heartbeat vs stale-reclaim within SAME process — NOT POSSIBLE (Node single-threaded event loop). P1-001 stays P1; refined framing: same-class TOCTOU as §13 item 1 (already acknowledged for ACQUIRE), documentation-completeness finding more than code-correctness finding. Confidence 0.75. Downgrade trigger: implementer extends §13 to cover all three lease-mutation paths AND either moves reread to pre-write position OR adopts flock.

Iteration 9 (DONE — 2026-07-23T18:57:30Z): FINAL ADVERSARIAL SWEEP. PASS (verification only). Independently re-ran the 17-file vitest suite: **521 passed / 0 failed / 36 pre-existing skipped** (16/17 test files passed, 1 pre-existing skipped). Independently re-ran `npm run build`: clean (prepare-build 3/3, tsc --build silent on success, finalize-dist silent on success, no error markers). Scope-violation retrospective across iterations 1–8: CLEAN (7 of 8 SCOPE VIOLATIONS sections reported "None"; iter-6 delta sentinel recorded no violation; BANNED-operation grep returned 0 matches). **No new findings; no downgrades; no state changes.** Cumulative: P0=0 P1=1 (P1-001 reaffirmed) P2=3.

Iteration 10 (next — synthesis): FINAL VERDICT. Compile the complete cumulative finding list across all 9 prior iterations, produce the final dimension-coverage map, and issue the release-readiness verdict: PASS / CONDITIONAL / FAIL, noting that PASS may include hasAdvisories=true given the 3 open P2s and the reaffirmed P1. Specifically:
1. Cumulative finding list (verbatim from registry): P0=0, P1=1 (P1-001), P2=3 (P2-001 plan.md phase labels, P2-002 FIX ADDENDUM non-runnable rows, P2-003 leaseId-fencing invariant anchor gap) — confirmed by iter-9 evidence check.
2. Final dimension-coverage map: correctness (iters 1–4 + 8), security (iter 5), traceability (iter 6), maintainability (iter 7), verification (iter 9) — all 4 review dimensions plus the verification sweep, no dimension un-covered.
3. Preliminary release-readiness call (iter 10 to ratify): **CONDITIONAL PASS** — implementer's REQ-006..011 implementation is behaviorally correct (521/521 tests pass, build clean, security and traceability dimensions clean) and the only blocking-class concern is the open P1-001 lease-use/generation TOCTOU. P1-001 is in scope for a merge gate per `review-core.md` §2 (P1 = required fix before merge) — but the iter-8 refinement notes damage is bounded (heartbeat fence L595-601 catches every inconsistency, triggers graceful shutdown; SQLite sidecar is the integrity backstop), the alternative-explanation path includes a documentation-only downgrade (extend §13 to cover refresh/clear same as ACQUIRE), and the 3 P2s are advisory/documentation. Iter 10 should ratify either (a) PASS with hasAdvisories=true OR (b) PASS-CONDITIONAL-on-P1-001-downgrade (the implementer can trigger by extending §13 + adopting one of the documented mitigations).
4. Hand-back to operator: final synthesis written to `review/review-report.md`; verdict **CONDITIONAL**, `hasAdvisories=true`, release readiness `converged`. Use `/speckit:plan` for P1-001 accepted-risk documentation and the three low-effort P2 follow-ups. REQ-001..005 remains a separate, not-yet-started workstream.
5. Iteration 10 (DONE — 2026-07-23T17:03:28Z): FINAL SYNTHESIS. Reconciled all four dimensions and four active findings; issued CONDITIONAL because project convention forbids PASS with an active P1, while bounded P1-001 does not justify FAIL. No new findings or scope violations. Hard stop: `maxIterationsReached`.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers**: see Files Under Review (§15) for the full 16-file scope list. Canonical spec docs for this packet: `spec.md` (REQ-001..011), `plan.md` (Phase 1-5 architecture + FIX ADDENDUM: AFFECTED SURFACES table), `tasks.md` (T001-T047), `checklist.md` (CHK-001..079), `implementation-summary.md` (What Was Built / Key Decisions / Verification / Known Limitations for both REQ-006 and Phase 7).
- **Behavior claims**: REQ-006 — scan-origin indexing must never write back to source docs. REQ-007 — warm-owner MCP startup skips a redundant daemon-readiness probe. REQ-008 — async ingest must never persist quality-loop auto-fixes. REQ-009 — `memory_index_scan` MCP tool defaults to `background: true` when omitted, without changing internal synchronous callers. REQ-010 — owner-lease reclaim is fenced against a TOCTOU race with a `leaseId` token. REQ-011 — the empty-environment model-socket fallback uses a canonical short constant instead of an unconditional `dbDir`-derived path.
- **Reuse and conventions**: the fix follows an existing `indexingOrigin`-based provenance-gating pattern already present in `memory-save.ts`; the lease fencing follows the existing O_EXCL CAS pattern already used for owner-lease acquisition; the socket-default fix mirrors the value both `opencode.json` and `.claude/mcp.json` already pin.
- **Review risks and gaps documented by the implementer** (verify or refute independently): (1) REQ-010's fencing narrows but does not eliminate a sub-microsecond OS-level TOCTOU window between the re-validation read and the unlink syscall — implementer judged this proportionate given the SQLite sidecar lock is the real integrity backstop; (2) REQ-009's fix point was deliberately the MCP tool dispatch boundary (`lifecycle-tools.ts`), not `handleMemoryIndexScan` itself, to avoid breaking internal synchronous callers (CLI reindex, boot-time drift repair) and dozens of existing tests; (3) REQ-011 required two additional call-site fixes beyond the original plan (`createModelServerControl`'s own dbDir default, `mk-skill-advisor-launcher.cjs`'s wrapper) that the implementer says were needed to actually reach the canonical default through the real bug path — verify this claim independently; (4) one single-test flake was observed in `launcher-lease.vitest.ts` during a full-batch run but passed clean on isolated + full re-runs — implementer attributed this to resource contention in a heavily concurrent shared repo, not a real regression.

Do not inline full source bodies. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | passed | 6 | REQ-006..009 and REQ-011 match implementation; REQ-010 complete-fencing claim remains bounded by active P1-001. |
| `checklist_evidence` | core | passed | 6 | CHK-070, CHK-072, CHK-073, CHK-074 scope, and CHK-076 spot-checked with direct reads and focused test runs; CHK-079 correctly deferred. |
| `skill_agent` | overlay | notApplicable | 0 | Not a skill-authoring change |
| `agent_cross_runtime` | overlay | notApplicable | 0 | Not an agent-definition change |
| `feature_catalog_code` | overlay | notApplicable | 6 | No product feature-catalog entry applies to this internal daemon-hardening fix. |
| `playbook_capability` | overlay | notApplicable | 0 | Not a playbook change |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts` | | | | pending |
| `.opencode/skills/system-spec-kit/mcp-server/context-server.ts` | | | | pending |
| `.opencode/skills/system-spec-kit/mcp-server/tests/handler-memory-index.vitest.ts` | | | | pending |
| `.opencode/skills/system-spec-kit/mcp-server/tests/context-server.vitest.ts` | | | | pending |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | | | | pending |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | | | | pending |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | | | | pending |
| `.opencode/bin/lib/model-server-supervision.cjs` | | | | pending |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | | | | pending |
| `.opencode/skills/system-spec-kit/mcp-server/tools/lifecycle-tools.ts` | | | | pending |
| `.opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts` | | | | pending |
| `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-session-proxy.vitest.ts` | | | | pending |
| `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-ipc-bridge-probe.vitest.ts` | | | | pending |
| `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-spec-memory-lifecycle.vitest.ts` | | | | pending |
| `.opencode/skills/system-spec-kit/mcp-server/tests/lifecycle-tools-scan-default.vitest.ts` | | | | pending |
| `.opencode/skills/system-spec-kit/mcp-server/tests/embedders/launcher-model-server-cross-launcher.vitest.ts` | | | | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10 (telemetry only — stopPolicy=max-iterations)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=20260723-160812-031-hardening-review, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-07-23T16:08:12Z
<!-- MACHINE-OWNED: END -->
