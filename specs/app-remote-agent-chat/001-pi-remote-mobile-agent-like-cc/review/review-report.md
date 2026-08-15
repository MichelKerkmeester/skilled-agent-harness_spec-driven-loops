# Deep Review Report: Pi Remote Mobile Agent Control Plane

- **Review target:** `.pi/pi-remote` (loopback relay + pi-rpc-protocol + installable PWA + approval extension) and its spec packet `specs/cli-external-orchestration/001-pi-remote-mobile-agent-like-cc`
- **Target type:** files (implementation) + spec-folder packet (planning corpus)
- **Spec folder:** `specs/cli-external-orchestration/001-pi-remote-mobile-agent-like-cc`
- **Mode:** fan-out review — 2 parallel lineages (`sol-high` = cli-opencode/gpt-5.6-sol-fast high; `deepseek-flash` = cli-pi/deepseek-v4-flash), concurrency 2
- **Stop policy:** max-iterations (convergence telemetry only); 20/20 iterations per lineage
- **Session:** `2026-08-13T05:37:25.000Z` (generation 1, lineageMode new)
- **Report date:** 2026-08-13

---

## 1. Executive Summary

- **Verdict:** CONDITIONAL
- **hasAdvisories:** true
- **Active findings:** P0=0, P1=15, P2=24 (merged, strongest-restriction)
- **Release readiness:** in-progress — P1 set blocks PASS; no P0 blocker
- **Iterations:** 40 total (20 sol-high + 20 deepseek-flash), all dimensions covered 4/4 by both lineages
- **Stop reason:** maxIterationsReached (both lineages)

Two independent lineages reviewed the Pi Remote feature from opposite surfaces: **sol-high** performed a code-surface review of the live `.pi/pi-remote` implementation (relay, RPC supervisor, auth, approval, PWA, release scripts) and found **12 P1 + 1 P2** in live behavior; **deepseek-flash** performed a spec-packet review of the nine-phase planning corpus and found **3 P1 + 23 P2** in documentation closure, ownership assignment, and status-truth. Merged under strongest-restriction: **no P0**, **15 P1**, **24 P2**.

The dominant cross-lineage finding is a **packet-truth contradiction** (P1-003/F010): the packet still reports `Draft / completion 10% / "implementation has not started"`, while a substantial `.pi/pi-remote` implementation exists through phase 009 (verified by both lineages: relay `index.ts` 220L, `http/server.ts` 661L, web `App.tsx` 1068L, release-verify machinery, git commits `feat(pi-remote): phase 009 … (SOL, verified)`).

The code-surface P1 findings show core remote-control, isolation, security-lifecycle, and release-truth claims are incomplete in the implementation: mobile commands have no live transport, the relay collapses all work into one hard-coded session/child, no producer emits the transcript blocks the API/PWA consume, device enrollment is not durable across restarts, revocation does not drain leases/grants, accept-edits grants survive disablement/restart, and the release whole-gate can report PASS while every rollout stage is NOT-READY and omits browser/lint/format checks.

## 2. Planning Trigger

**`/speckit:plan` is required.** The CONDITIONAL verdict means remediation planning must precede release-readiness. Most deepseek-flash findings are documentation/metadata corrections; the sol-high findings require product implementation changes before release gates.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": {
    "total": 39,
    "P0": 0,
    "P1": 15,
    "P2": 24
  },
  "remediationWorkstreams": [
    "Live Pi control and projection (F001-F004): authenticated command ingress, per-session child ownership, typed transcript projection, live-vs-fixture health semantics",
    "Durable identity and scoped authorization (F005, F009): persist enrollment/revocation; bind session/workspace selectors to the authenticated principal",
    "Authority and data drain (F006-F008): revocation, policy disablement, epoch invalidation, restart, logout must revoke leases/grants and erase protected local transcript data",
    "Packet and release truth (F010, F011, F014, P1-003, P2-017/P2-018/P2-019): reconcile lifecycle metadata to the live implementation; split configuration-valid from release-ready; expand the whole gate to browser/lint/format/rollout",
    "Packet ownership closure (P1-001, P1-002): assign command-channel auth and PWA credential storage/erasure ownership in the dependency closures",
    "Cross-doc consistency sweep (P2-001..P2-007, P2-011, P2-016, P2-020, P2-023): complexity totals, ownership partitions, REQ-09x namespaces, template label drift, continuity key_files, Files-to-Change vs live tree, 008 deliverables"
  ],
  "specSeed": [
    "Require an authenticated live command path for send/steer/follow-up/abort with explicit per-session child ownership and typed transcript projection",
    "Require durable device enrollment/revocation and principal-to-workspace/session authorization at every selector boundary",
    "Define a single authority-drain contract covering revocation, policy disablement, epoch invalidation, restart, logout, approval leases, grants, and local protected caches",
    "Define health semantics that cannot report live-ready while running fixture fallback",
    "Assign command-channel authentication and PWA credential storage/erasure ownership in the relevant phase closures",
    "Require packet lifecycle metadata to reflect the live implementation and current evidence state"
  ],
  "planSeed": [
    "Implement command ingress, per-session supervisor lifecycle, and transcript-block projection (F001-F003)",
    "Add live-child health state and fail-closed deployment verification (F004)",
    "Add durable device storage and selector authorization with restart and cross-session negative tests (F005, F009)",
    "Centralize authority drain across revocation/policy/epoch/restart/logout; verify leases, grants, caches (F006-F008)",
    "Reconcile parent/phase metadata, split release-status fields, expand the whole-gate runner (F010, F011, F014, P1-003)",
    "Close packet ownership gaps for command-channel auth and PWA credential lifecycle (P1-001, P1-002)",
    "Run the 22-item deepseek-flash doc/metadata fix list (see Plan Seed section below)"
  ],
  "findingClasses": [
    "algorithmic",
    "cross-consumer",
    "matrix/evidence",
    "class-of-bug",
    "doc-closure",
    "status-truth"
  ],
  "affectedSurfacesSeed": [
    ".pi/pi-remote/apps/pi-remote-relay/src/http/server.ts",
    ".pi/pi-remote/apps/pi-remote-relay/src/index.ts",
    ".pi/pi-remote/apps/pi-remote-relay/src/rpc/supervisor.ts",
    ".pi/pi-remote/apps/pi-remote-relay/src/auth/ (enrollment.ts, policy.ts)",
    ".pi/pi-remote/apps/pi-remote-relay/src/approval/approval-service.ts",
    ".pi/pi-remote/apps/pi-remote-web/src/ (cache.ts, auth.ts)",
    ".pi/pi-remote/scripts/release-verify.mjs, release/rollout-gate.mjs",
    "specs/cli-external-orchestration/001-pi-remote-mobile-agent-like-cc/ (parent + 001..009 phase packets)"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

Merged registry: `review/deep-review-findings-registry.json` (39 active findings, strongest-restriction). `content_hash` and dedup provenance are reducer-owned; see the registry file for full records.

### P1 (Required — 15)

| ID | Dimension | Finding | Evidence | Lineage |
|---|---|---|---|---|
| F001 | correctness | Mobile control commands have no live transport | `.pi/pi-remote/apps/pi-remote-relay/src/http/server.ts:57` | sol-high |
| F002 | correctness | Relay collapses all work into one hard-coded session and child | `.pi/pi-remote/apps/pi-remote-relay/src/index.ts:20` | sol-high |
| F003 | correctness | No producer emits the transcript blocks consumed by the API and PWA | `.pi/pi-remote/apps/pi-remote-relay/src/index.ts:131` | sol-high |
| F004 | correctness | Missing Pi silently becomes fixture mode while health remains ok | `.pi/pi-remote/apps/pi-remote-relay/src/rpc/supervisor.ts:167` | sol-high |
| F005 | security | Enrolled devices vanish on every relay restart | `.pi/pi-remote/apps/pi-remote-relay/src/auth/enrollment.ts:40` | sol-high |
| F006 | security | Device revocation does not revoke leases or grants | `.pi/pi-remote/apps/pi-remote-relay/src/http/server.ts:340` | sol-high |
| F007 | security | Accept-edits grants survive disablement and restart | `.pi/pi-remote/apps/pi-remote-relay/src/approval/approval-service.ts:292` | sol-high |
| F008 | security | Logout and revocation leave cached transcripts on device | `.pi/pi-remote/apps/pi-remote-web/src/cache.ts:13` | sol-high |
| F009 | security | Authenticated devices can select any stored session | `.pi/pi-remote/apps/pi-remote-relay/src/http/server.ts:168` | sol-high |
| F010 | traceability | The canonical packet still says implementation has not started | `specs/cli-external-orchestration/001-pi-remote-mobile-agent-like-cc/spec.md:17` | sol-high |
| F011 | traceability | Release verification reports PASS while every rollout stage is NOT-READY | `.pi/pi-remote/scripts/release-verify.mjs:63` | sol-high |
| F014 | traceability | The authoritative whole gate omits required browser, lint, and format checks | `.pi/pi-remote/scripts/release-verify.mjs:30` | sol-high |
| P1-001 | security | P0 REQ-006 authenticated command channel unowned in phase-003 dependency closure (code-resolved; packet closure gap) | `003-relay-protocol-and-state/spec.md:110` | deepseek-flash |
| P1-002 | security | PWA auth-session credential storage/erasure surface unowned across 005/007 (code-resolved; packet closure gap) | `005-mobile-pwa-and-reconciliation/spec.md:117` | deepseek-flash |
| P1-003 | traceability | Cross-lineage review-surface contradiction: sol-high reviewed `.pi/pi-remote` code (verified present, phase 008/009 commits) vs packet no-implementation status | `spec.md` Status + 9x `implementation-summary.md` completion_pct 0 | deepseek-flash |

### P2 (Advisory — 24)

| ID | Dimension | Finding | Evidence | Lineage |
|---|---|---|---|---|
| P2-001 | correctness | Complexity total 81 contradicts component sum 71 (6/9 phases affected) | `001-.../spec.md:180` (also 003/004/006/007/009) | deepseek-flash |
| P2-002 | correctness | Duplicate Create ownership of `tests/pi-remote/security/` across 001 and 002 | `001:92`, `002:93` | deepseek-flash |
| P2-003 | correctness | Phase-shared REQ-090..093 IDs create cross-phase citation ambiguity | `001:115-118` | deepseek-flash |
| P2-004 | security | REQ-008 Serve-to-relay trust anchor left as OR of two mechanisms | `004-auth-and-tailnet-boundary/spec.md:111` | deepseek-flash |
| P2-005 | maintainability | 008 complexity heading `## L2:` diverges from `## 9. COMPLEXITY ASSESSMENT` pattern | `008-.../spec.md:164` | deepseek-flash |
| P2-006 | maintainability | 008 lacks `decision-record.md` (8/9 siblings have one); checklist omits CHK-100..142 block | `008-documentation-and-runbooks/` | deepseek-flash |
| P2-007 | maintainability | tasks.md "Phase 2: Implementation" vs plan.md "Phase 2: Core Implementation" label drift (9/9) | `008-.../tasks.md:61` | deepseek-flash |
| P2-008 | correctness | 005 REQ-008 references three attention classes defined only in successor 007 | `005-.../spec.md:114` | deepseek-flash |
| P2-009 | security | 006 mutation kill switch leaves in-flight execution semantics unspecified | `006-.../spec.md:110` | deepseek-flash |
| P2-010 | security | 006 REQ-004 redaction boundary enumeration omits telemetry/metrics and diagnostics exports | `006-.../spec.md:109` | deepseek-flash |
| P2-011 | traceability | 001 plan.md L3 ARCHITECTURE DECISION RECORD mirrors only ADR-001 of 3 accepted decisions | `001-.../plan.md:259` | deepseek-flash |
| P2-012 | security | 008 REQ-005 incident-guidance enumeration omits compromise response (no incident→revoke/rotate linkage) | `008-.../spec.md:107` | deepseek-flash |
| P2-013 | correctness | 009 rollback-drill sequence diverges from REQ-004 (restore before disablement, no drain) | `009-.../tasks.md:70` | deepseek-flash |
| P2-014 | correctness | 009 SC-001 stage→evidence-subset gating mapping unenumerated | `009-.../spec.md:128` | deepseek-flash |
| P2-015 | security | Kill-switch trigger path and authentication unspecified in 006 REQ-005 acceptance | `006-.../spec.md:110` | deepseek-flash |
| P2-016 | maintainability | `_memory.continuity.key_files` omits checklist.md/decision-record.md/implementation-summary.md in 9/9 phases | `001..009/implementation-summary.md:19-22` | deepseek-flash |
| P2-017 | traceability | `description.json` memoryNameHistory "deep-review-completed" claim premature | `description.json` | deepseek-flash |
| P2-018 | traceability | research/ top-level reduction stale (0/20) vs 3 lineage synthesis_complete | `research/deep-research-dashboard.md` | deepseek-flash |
| P2-019 | traceability | research config + orchestration specFolder path typo `041=` vs `041-` | `research/deep-research-config.json` | deepseek-flash |
| P2-020 | traceability | Files-to-Change path drift 3/7 vs live tree (`tests/pi-remote/`→`tests/`, `deploy/pi-remote/`→`deploy/containment/`, `docs/pi-remote/`→`docs/`) | `spec.md:102` | deepseek-flash |
| P2-021 | security | mutation-policy docstring claims independently enabled families; implementation enforces single-family | `.pi/pi-remote/apps/pi-remote-relay/src/policy/mutation-policy.ts:9` | deepseek-flash |
| P2-022 | correctness | release-verify top-level PASS achievable with zero READY stages (status conflates schema validity with green) | `.pi/pi-remote/scripts/release-verify.mjs:63` | deepseek-flash |
| P2-023 | maintainability | 008 documentation deliverables drift — `protocol.md` absent; operator-runbook/mobile-guide delivered as split/partial equivalents | `008-.../spec.md:82-86` vs `.pi/pi-remote/docs/` | deepseek-flash |
| F015 | maintainability | Mutation authority is modeled as read-only policy | `.pi/pi-remote/apps/pi-remote-relay/src/auth/policy.ts:1` | sol-high |

## 4. Remediation Workstreams

Ordered lanes, P1-first:

1. **Live Pi control and projection (F001-F004)** — Add the authenticated command ingress and `RpcSupervisor.send()` integration; replace the singleton session/child with per-session ownership; project Pi events into the typed transcript contract; make health distinguish live Pi from fixture fallback.
2. **Durable identity and scoped authorization (F005, F009)** — Persist enrolled-device and revocation state; bind every session/workspace selector to the authenticated principal's allowed scope.
3. **Authority and data drain (F006-F008)** — Make revocation, policy disablement, epoch invalidation, logout, and restart revoke leases/grants and erase protected local transcript data.
4. **Packet and release truth (F010, F011, F014, P1-003, P2-017..P2-019)** — Reconcile canonical lifecycle metadata (parent spec.md status, 9x implementation-summary completion, description.json, continuity) with the live implementation; separate configuration-valid from release-ready status; make the whole gate execute browser/lint/format/rollout checks; fix the `041=` path typo and re-run the research reducer.
5. **Packet ownership closure (P1-001, P1-002, P2-004, P2-015)** — Assign command-channel authentication and PWA credential storage/erasure ownership in the phase closures; pin the REQ-008 trust anchor; specify kill-switch trigger path/auth.
6. **Cross-doc consistency sweep (P2-001..P2-007, P2-011, P2-016, P2-020, P2-023)** — Fix complexity totals; partition `tests/pi-remote/security/` ownership; de-collide REQ-09x namespaces; unify 008 heading and Phase-2 labels (template-level); mirror ADR-002/003; extend continuity `key_files`; reconcile Files-to-Change with the live tree; add 008 `decision-record.md`/CHK block and `protocol.md`.
7. **Security rows (P2-009, P2-010, P2-012, P2-021)** — Specify kill-switch in-flight semantics; extend redaction enumeration with telemetry/diagnostics; add compromise-response guidance; fix the mutation-policy docstring.
8. **Release/rollout docs (P2-013, P2-014, P2-022)** — Correct the rollback-drill sequence; enumerate SC-001 stage→evidence mapping; clarify release-verify status semantics.
9. **Authorization taxonomy (F015)** — Model approval decisions and accept-edits grants as mutation authority so policy and audit names match behavior.

## 5. Spec Seed

- Require an authenticated live command path for send, steer, follow-up, and abort operations, with explicit per-session child ownership and typed transcript projection.
- Require durable device enrollment/revocation and principal-to-workspace/session authorization at every selector boundary.
- Define a single authority-drain contract covering revocation, policy disablement, epoch invalidation, restart, logout, approval leases, grants, and local protected caches.
- Define health semantics that cannot report a live-ready state while running fixture fallback.
- Distinguish verification execution success, rollout configuration validity, stage readiness, and release readiness in both machine output and operator text.
- Assign command-channel authentication and PWA credential storage/erasure ownership in the relevant phase closures.
- Require packet lifecycle metadata to reflect the live implementation and current evidence state.
- Parent `spec.md`: update Status/completion and Files-to-Change table to the live `.pi/pi-remote` layout or add an explicit workspace-relocation row.

## 6. Plan Seed

1. Implement and test command ingress, per-session supervisor lifecycle, and transcript-block projection (F001-F003).
2. Add live-child health state and fail-closed deployment verification (F004).
3. Add durable device storage and selector authorization checks with restart and cross-session negative tests (F005, F009).
4. Centralize authority drain and invoke it from revocation, policy, epoch, restart, and logout paths; verify leases, grants, and local caches (F006-F008).
5. Reconcile parent and phase metadata, split release status fields, and expand the whole-gate runner (F010, F011, F014).
6. Assign auth-channel ownership in 003 and PWA credential lifecycle ownership across 005/007 (P1-001, P1-002).
7. Run the deepseek-flash 22-item doc/metadata fix list: complexity totals (6 specs), `tests/pi-remote/security/` partition, REQ-09x de-collision, 008 heading + Phase-2 labels, ADR-002/003 mirror, continuity `key_files`, research reducer + `041=` typo, Files-to-Change reconciliation, mutation-policy docstring, release-verify semantics, rollback-drill sequence, SC-001 mapping, redaction/telemetry enumeration, kill-switch semantics, trust-anchor pin, 008 decision-record/CHK block + `protocol.md`.
8. Rename and retest mutation policy actions (F015), then rerun the complete release and strict packet gates.

## 7. Traceability Status

Core protocols first, then overlays.

| Protocol | Class | Status | Evidence | Finding refs |
|---|---|---|---|---|
| `spec_code` | core | fail (sol-high) / partial-clean (deepseek-flash) | Live implementation vs parent/phase requirements materially misaligned (sol-high); parent↔child chain clean with closure gaps (deepseek-flash) | F001-F011, F014, P1-001, P1-002, P2-004, P2-020..P2-022 |
| `checklist_evidence` | core | partial (sol-high) / clean (deepseek-flash) | 71/71 checked items resolved by deepseek-flash; lifecycle state stale and whole gate incomplete per sol-high | F010, F014, P2-006 |
| `feature_catalog_code` | overlay | notApplicable | No feature-catalog artifact in the packet corpus | — |
| `playbook_capability` | overlay | notApplicable | No playbook scenarios shipped (planning packet); target-host/device checks operator-unrun | F004, F011, F014 |
| `skill_agent` / `agent_cross_runtime` | overlay | notApplicable | Target type is files + spec-folder, not skill/agent | — |

`AC_COVERAGE` was not emitted by the runtime; no advisory covered/total floor was available. No `resource-map.md` existed at initialization, so the conditional resource-map coverage gate did not apply.

## 8. Resource Map Coverage Gate

Skipped — `resource-map.md` was not present at initialization, so the coverage gate is not applicable to this run.

## 9. Deferred Items

- F015 and the full P2 set are advisory and can be completed within the remediation passes above; highest-priority advisories: P2-001 (class-of-bug complexity totals), P2-006 (008 completeness), P2-020 (path drift), P2-023 (`protocol.md`).
- Target-host, Tailscale, PWA installability, push, and physical-device release procedures still require operator evidence after the P1 implementation fixes land.
- 002/005 harness and browser/chaos suites remain Draft-absent (002 is not implemented; consistent with the packet's Draft state).
- Adjudicated non-findings (deepseek-flash): 008 L3 Dependency Matrix absence (level-2 conformance); REQ-citation style (keyword-implicit, content-reflected 9/9); scratch/.gitkeep template artifacts; all-unchecked tasks.md (correct Draft state).
- Blocked checks: code-graph unavailable (graphless fallback used); `check-rollout --require-ready` promotion path not executed end-to-end; containment profile not executed on this machine.
- No reviewed target files were modified by either lineage; product remediation remains a separate implementation workflow.

## 10. Dimension Expansion Map

Breadth-only record; cannot alter the Executive Summary verdict or finding registry.

- **Convergence mode:** `default`; stop policy `max-iterations` — convergence treated as telemetry; both lineages reached the 20-iteration ceiling.
- **Divergent pivots:** none prepared (no all-dimensions-clean STOP candidate within the max-iterations run).
- **Pivot lineage / saturated directions:** none recorded in the merged registry.
- **Completed pivots / failed pivots / audited overrides:** none (no divergent mode activated).

## 11. Search Ledger

- **searchCoverage / candidateCoverage / searchDebt / ruledOutCandidates / cleanSearchProof:** not captured — the merged registry carries legacy v1 records only.
- `*No search-depth state captured (legacy v1 record)*`
- No search debt is recorded; nothing blocks STOP on that basis.

## 12. Audit Appendix

### Convergence Summary

- Stop policy `max-iterations`; both lineages produced exactly 20/20 iteration records with `maxIterationsReached` stop reasons — the max-iterations policy was honored (no early convergence synthesis, no policy violation).
- sol-high: final three new-finding ratios 0.00/0.00/0.00; reducer + graph convergence replay 1.00; 4/4 dimensions; all new P1 carried typed claim-adjudication events.
- deepseek-flash: last-2 rolling ratio 0.0, composite stop score 1.0 (coverage), no P0 override; 3 P1 re-confirmed at final adversarial pass.
- Fan-out run: 2/2 lineages fulfilled, 0 failed, 0 salvage misses, 0 timeouts. Advisory timestamp anomalies recorded for both lineages (state-record timestamps outside the measured slot window; telemetry only).
- No P0 existed, so the P0-override and P0-replay paths were vacuous.

### Coverage Summary

- Dimensions: correctness, security, traceability, maintainability — 4/4 covered by both lineages.
- sol-high file surfaces: relay HTTP/RPC/store/session-catalog, auth/approval services, PWA auth/state/cache, parent + nine phase packets, release scripts/rollout gate.
- deepseek-flash file surfaces: 54/54 packet markdown files (parent spec.md + 9 phases × ~6 docs); `.pi/pi-remote` code read as spec_code context evidence only.

### Ruled-Out Claims

- No P0 findings survived adjudication in either lineage.
- deepseek-flash downgraded/closed the code-graph absence and REQ-citation-style concerns as level-2 conformance non-issues; scratch artifacts and unchecked tasks.md ruled out as template noise.
- sol-high stabilization iterations 17-20 (live-producer replay, authority-drain replay, traceability replay, full adversarial replay) produced zero new findings, confirming registry stability.

### Sources Reviewed

- **Review artifacts:** `review/lineages/sol-high/review-report.md` (20 iterations), `review/lineages/deepseek-flash/review-report.md` (20 iterations), merged `review/deep-review-findings-registry.json`, `review/fanout-attribution.md`, both lineage `deep-review-state.jsonl`, `orchestration-summary.json`.
- **Reviewed surfaces:** `.pi/pi-remote` implementation tree (relay, RPC supervisor, auth, approval, policy, PWA, scripts, docs) and the full 041 spec packet (parent + 001..009 phase docs).
- **Cross-reference appendix — Core Protocols:** `spec_code`, `checklist_evidence` (see §7).
- **Cross-reference appendix — Overlay Protocols:** `feature_catalog_code`, `playbook_capability` (see §7).

---

**Verdict: CONDITIONAL** — route to `/speckit:plan [remediation]`. After fixes, rerun this review (PASS gate) before `/create:changelog`.
