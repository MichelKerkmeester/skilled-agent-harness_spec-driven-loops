---
title: "Feature Specification: Fix Code-Review P0-P3 Findings for Directive-Lifecycle Delivery"
description: "Implement and verify the correctness, security, evidence-integrity, adapter-parity, and repository-truth remediation required by the directive-lifecycle review. Runtime work, regression evidence, fresh review, and final metadata reconciliation are complete."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "directive lifecycle review findings"
  - "transcript high-water mark"
  - "directive lifecycle store hardening"
  - "scenario 457 evidence taxonomy"
  - "adapter parity"
importance_tier: "high"
contextType: "spec"
parent: "../spec.md"
predecessor: "017-adapter-live-delivery-verification"
successor: "None"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery"
    last_updated_at: "2026-08-12T06:27:39Z"
    last_updated_by: "codex"
    recent_action: "Completed fresh review, metadata regen, and strict validation (PASSED, 0/0)"
    next_safe_action: "Await operator push and native-host rollout decision"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts"
      - ".opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts"
      - ".opencode/plugins/mk-skill-advisor.js"
      - ".opencode/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs"
    session_dedup:
      fingerprint: "sha256:ae7f5007107efa4b13f95d48ecd249b04cf0d2c1bd7717f0e21e50c62b0fcca2"
      session_id: "2026-08-11-directive-lifecycle-review-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "P3 is a non-gating residual-risk register, not a formal repository priority"
      - "All Claude, Codex, Cursor, and Devin discovery symlinks must be preserved"
---
# Feature Specification: Fix Code-Review P0-P3 Findings for Directive-Lifecycle Delivery

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The source review found stale suppression after transcript growth and shrink, untrusted lifecycle and identity signals, unsafe file-store topology, and overstated evidence strength. The fail-open remediation now spans the canonical TypeScript core, the OpenCode JavaScript mirror, host lifecycle adapters, Pi prompt delivery, scenario 457, benchmark provenance, tests, and phase metadata. Focused suites and the final identical-manifest comparison pass; fresh review and final metadata reconciliation are complete and strict validation reports RESULT: PASSED with zero errors and warnings.

**Key Decisions**: use an explicit host-wired lifecycle epoch plus transcript high-water mark and a store-wide invalidation generation for unidentified resets; require race-safe file-store operations before relying on cross-process state; classify proof as unit, adapter-driven, registered-path, or native-host-delivered; preserve every runtime discovery symlink.

**Critical Dependencies**: the immutable whole-gate baseline and final comparison are present; registered hook paths, build outputs, and append-only benchmark provenance are verified. Fresh review and canonical metadata regeneration are complete.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 (highest active formal finding; P0 tier is empty) |
| **Status** | Complete |
| **Completion** | 100% |
| **Created** | 2026-08-11 |
| **Branch** | Current checkout; no packet-specific branch assumed |
| **Parent** | `../spec.md` |
| **Predecessor** | `017-adapter-live-delivery-verification` |
| **Successor** | None |
| **Packet Pointer** | `hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Before this phase, the canonical decision recorded transcript size only when it delivered the full directive block. A `5 KB → 10 KB → 7 KB` sequence could therefore suppress at 7 KB because 10 KB was never retained as the high-water mark, while repeated unknown stats (`null → null`) could suppress without proof that history was intact. Synthetic lifecycle fields were insufficient because registered Claude, Codex, Cursor, and Devin boundaries did not advance shared directive-lifecycle state.

OpenCode selected the first session-id candidate rather than rejecting conflicts, and its JavaScript mirror lacked a contract-vector gate against the TypeScript core. The file-backed store trusted separately checked paths and did not prove containment, owner, regular-file, link-count, or no-follow invariants across check/use races; failed renames could strand `.tmp-*` files.

The verification surface also conflated unit tests, adapter probes, registered-path execution, and native host delivery. Scenario 457 used temporary command outputs, benchmark records lacked durable hashes and clean provenance, Cursor's dormant event could be mistaken for a PASS, and phase metadata contained conflicting status and obsolete symlink-deletion language. The implementation preserves the historical evidence while appending corrected, typed, hash-bound outcomes.

### Purpose

Deliver an implementation-ready, fail-open remediation plan that prevents stale suppression, secures cross-process state, preserves discovery wiring, makes every evidence claim classifiable and durable, restores one repository truth across phases 014-018, and proves no regression by rerunning the exact whole-gate baseline.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add a transcript high-water mark, per-session lifecycle epoch, and store-wide invalidation generation to the canonical decision and durable record; unknown or missing transcript stats must never authorize suppression.
- Wire epoch advancement from actual host session-start/resume/compact paths, not only test-provided prompt fields. A reset without a usable session identity increments the store-wide generation so every older session record fails open on its next prompt.
- Reject missing, ambiguous, object-shaped, or conflicting OpenCode session identities for directive suppression.
- Harden `FileDirectiveLifecycleStore` against symlinked components, unowned/insecure records, hard-link or non-regular-file injection, oversized/malformed JSON, unsafe temp/rename behavior, and check/use races. Authoritative IO must be directory-handle anchored or use equivalent post-open inode and ancestry verification; platforms that cannot prove the invariant disable durable suppression.
- Preserve and verify the existing `.claude`, `.codex`, `.cursor`, and `.devin` discovery symlinks; explicitly supersede phase 017's deletion plan.
- Rework scenario 457 and benchmark persistence around evidence classes, repository-relative artifacts, SHA-256 hashes, runtime/version/command/payload metadata, and clean model provenance.
- Add Codex, Cursor, and Devin user-prompt adapter parity tests for normalization, envelope, malformed output, timeout, missing fields, and symlink discovery-path versus canonical real-path execution.
- Reconcile phases 014-017, parent phase maps and metadata, graph children, continuity status, and generated fingerprints; mark phase 017 superseded by 018 without deleting its historical record.
- Capture a durable whole-gate baseline before edits and rerun the identical manifest after edits.
- Repair bounded temp cleanup and test teardown hygiene.

### Out of Scope

- Deleting or replacing any discovery symlink. The `.claude/.codex/.cursor/.devin` symlink set is protected input to this remediation.
- Claiming Cursor native delivery while `beforeSubmitPrompt` remains dormant or unconfirmed.
- Rewriting immutable historical benchmark report directories. Supersession is recorded in new index/manifest evidence.
- Treating P3 as a formal priority or completion gate. Formal repository handling remains P0/P1/P2.
- Activating the separate shadow-delivery program or changing the Gate-3 activation matrix.
- Claiming completion from focused green tests without an identical whole-gate comparison.

### Files to Change

| File Path or Surface | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts` | Modify | Add versioned record, epoch, transcript high-water update, fail-open stat rules, hardened store IO, and bounded temp cleanup. |
| `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Modify | Consume trusted epoch and stat evidence; stop treating synthetic lifecycle fields as sufficient host reset proof. |
| `.opencode/plugins/mk-skill-advisor.js` | Modify | Reject conflicting OpenCode session identities and align behavior with contract vectors. |
| `.opencode/plugins/lib/opencode-message-identity.js` | Verify/modify if shared resolver is reused | Preserve fail-open identity normalization and add conflict-aware resolution without separator ambiguity. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/{session-prime.ts,compact-inject.ts}` | Modify | Advance the canonical epoch from registered Claude lifecycle events. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/codex/{session-start.ts,compact-inject.ts}` | Modify | Advance the canonical epoch from registered Codex lifecycle events. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/{session-start.ts,precompact.ts}` | Modify | Wire reset at registered paths while retaining dormant/unconfirmed native-event status. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/devin/{session-start.ts,post-compaction.cjs}` | Modify | Advance the canonical epoch from registered Devin lifecycle events. |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/directive-lifecycle.vitest.ts` | Modify | Add high-water, null-stat, containment, ownership, no-follow, injection, failure cleanup, and race fail-open tests. |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modify | Prove trusted epoch/stat consumption and complete environment/singleton teardown. |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/mk-skill-advisor-plugin.vitest.ts` | Modify | Add conflicting identity and host event reset cases; restore timers, env, modules, and mocks after every test. |
| `.opencode/skills/system-spec-kit/mcp-server/tests/directive-lifecycle-adapter-parity.vitest.ts` | Create | Contract matrix for Codex/Cursor/Devin payloads, envelopes, malformed child output, timeouts, missing fields, and path form. |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md` | Modify | Make evidence classes and Cursor's unconfirmed status explicit; replace `/tmp` evidence claims with durable artifacts. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs` and report renderers/tests | Modify | Require relative evidence, hashes, runtime/version/command/payload/evidence class, and valid model provenance. |
| `.opencode/skills/system-spec-kit/benchmark/reports/` | Append/index only | Add immutable corrected runs plus an external supersession manifest; never rewrite historical report directories. |
| `.claude/hooks/user-prompt-submit.js`, `.codex/hooks/user-prompt-submit.js`, `.cursor/hooks/user-prompt-submit.js`, `.devin/hooks/user-prompt-submit.js` | Preserve/verify | Assert each remains a symlink to the registered dist adapter and works via both discovery and canonical paths. |
| `specs/hooks/002-injection-bloat-reduction/{spec.md,description.json,graph-metadata.json}` | Modify during implementation reconciliation | Add 017/018 truth, active child, current status, and regenerated source hashes. |
| `specs/hooks/002-injection-bloat-reduction/{014-cross-runtime-directive-lifecycle,015-directive-docs-alignment,016-directive-playbook-alignment,017-adapter-live-delivery-verification}/` | Reconcile docs/metadata | Remove contradictions and zero fingerprints; keep 014-016 historical delivery truth and mark 017 superseded by 018. |
| `specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/evidence/whole-gate/` | Create during implementation | Store command manifest, baseline and post-run logs/results, hashes, runtime versions, and comparison. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

Formal priorities are only P0, P1, and P2. The user-requested P3 tier appears below as a non-gating residual-risk register and must not be parsed as a repository completion priority.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P0-001 | **Empty finding tier:** the current review found no P0 issue. P0 remains an active escalation gate. | The final review artifact states `active P0 = 0`; if any new P0 evidence appears, implementation stops, the item is added to the formal checklist, and completion is blocked until resolved. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1-001 | Use transcript high-water state, fail open on unknown/missing stat, and wire real host lifecycle epoch/reset events. | Core and registered-path tests prove `5 KB → 10 KB → 7 KB` yields full, route-only, full; `null → null` yields full, full; identified host boundaries advance the session epoch; an unidentified boundary increments a store-wide invalidation generation; the next prompt is full without synthetic prompt-only lifecycle fields. |
| REQ-P1-002 | OpenCode ambiguous or conflicting session identities never suppress. | Plugin tests cover absent, object-shaped, explicit-ambiguous, and disagreeing top-level/nested identities; every case emits full directives and records no suppression state. |
| REQ-P1-003 | Harden `FileDirectiveLifecycleStore` against path, record, and check/use-race injection. | Linux/macOS-capable tests cover symlinked base/intermediate/project/file/temp components, intermediate replacement races, outside-root targets, wrong owner where supported, non-regular files, hard links, insecure mode, oversized/malformed records, and race-safe reads/writes; every unsafe or unprovable case disables durable suppression and delivers full. |
| REQ-P1-004 | Preserve runtime discovery symlinks and supersede the phase 017 deletion plan. | `test -L` plus `readlink`/`realpath` evidence covers every `.claude/.codex/.cursor/.devin` user-prompt discovery path; phase 017 is marked superseded and contains no executable deletion instruction. |
| REQ-P1-005 | Distinguish unit, adapter-driven, registered-path, and native-host-delivered evidence in scenario 457 and its results. | Scenario and run JSON carry one evidence class per claim; Cursor native delivery is `UNCONFIRMED`/dormant, never PASS; aggregate wording cannot upgrade adapter evidence to native-host evidence. |
| REQ-P1-006 | Persist durable, reproducible benchmark evidence with clean provenance. | Every current result points to repository-relative evidence with SHA-256, runtime and version, exact command, sanitized payload fixture, evidence class, executor, and one valid model or an explicit model-not-applicable reason; no `/tmp`-only PASS exists; historical directories remain byte-immutable and are listed as superseded by a new manifest. |
| REQ-P1-007 | Add Codex/Cursor/Devin user-prompt adapter parity tests. | Tests cover native payload normalization, expected envelope, malformed child output, child timeout, required-field omissions, and discovery symlink path versus canonical real path for all three adapters. |
| REQ-P1-008 | Reconcile repository truth across phases 014-018 and the parent. | A generated reconciliation artifact and strict validation show synchronized status/completion, parent map, graph children, active child, description metadata, source-doc hashes, and nonzero fingerprints; phase 017 is superseded by 018 and phase 018's own metadata is included. |
| REQ-P1-009 | Capture and rerun an identical whole-gate baseline. | A repository-resident command manifest is hashed before edits; baseline and post-run use the same manifest, cwd, env policy, runtime versions, test filters, discovered test-file inventories, totals, skipped/todo counts, and lane availability; the comparison records zero new failures and zero lost coverage. Focused suites alone cannot satisfy this item. |

### P2 - Optional (may defer with owner and reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P2-001 | Remove `.tmp-*` files after write or rename failure and bound cleanup. | Fault-injection tests show the attempted temp file is removed in `finally`; cleanup scans only the owned state directory, matches the store prefix, and caps entries/age/work per call. |
| REQ-P2-002 | Restore every mutated environment variable, singleton, timer, module cache, and mock in test teardown. | Hostile-order and repeat-run tests pass with a shared teardown helper; a post-suite snapshot equals the pre-suite process state. |
| REQ-P2-003 | Correct ephemeral evidence and malformed model metadata not already closed by P1-006. | A repository evidence audit returns zero absolute temp-only references, multiline/mixed model ids, or runtime names stored as models in current records. |
| REQ-P2-004 | Clean duplicate and stale phase 017 documentation during reconciliation. | The duplicate requirements header, obsolete deletion language, stale PASS claims, zero fingerprints, and conflicting progress fields are removed or replaced by a concise superseded record. |
| REQ-P2-005 | Characterize cross-process races, latency, cleanup bounds, and structural-test coverage before assigning residual dispositions. | Repository evidence records same-session/boundary/eviction races, p50/p95/p99 hook latency, cleanup work bounds, every structurally affected surface, which tool covers it, uncovered surfaces, and baseline/post coverage deltas; unresolved results remain RR-002 or RR-005 with owners and reopen criteria. |

### P3 - Non-Gating Residual-Risk Register

| Residual ID | Residual Risk | Disposition | Owner | Reopen Criteria |
|-------------|---------------|-------------|-------|-----------------|
| RR-001 | TypeScript canonical core and OpenCode JavaScript mirror can drift. | Monitor with shared contract vectors; migration to one compiled implementation remains desirable but does not block this packet. | Skill Advisor maintainer | Any contract-vector mismatch, separator/epoch schema change, or production behavior divergence. |
| RR-002 | Cross-process races, eviction, and hook latency require continued monitoring across platforms and workloads. | Current probe passed: 16/16 concurrent high-water writes, no residue, and file-store p99 65.706 ms under the 100 ms budget. Duplicate-full fail-open remains acceptable; stale suppression is forbidden. | Hook performance owner | Any stale suppression, state corruption, cleanup residue, unbounded eviction work, or p99 above 100 ms. |
| RR-003 | Cursor `beforeSubmitPrompt` remains host-event dormant/unconfirmed. | Keep registered-path adapter coverage but label native delivery unconfirmed; retest on a version trigger. | Cursor integration owner | Cursor version/build changes, event documentation changes, or a receipt appears in a real dispatch. |
| RR-004 | Actual Claude/Codex/Devin/OpenCode host receipts remain weaker than adapter probes. | Track separately from P1 evidence taxonomy; do not upgrade evidence class. | Runtime verification owner | A supported host harness becomes available or a release requires native-delivery certification. |
| RR-005 | The full-suite baseline contains pre-existing failures and structural graph tooling was unavailable. | Preserve the exact zero-blocker baseline delta and the direct producer/consumer coverage inventory; native-host boundaries remain explicitly uncovered. | Release gate owner | Failure identities change, structural tooling becomes available, or an unresolved structural change touches an unmapped surface. |
| RR-006 | Devin's source-tree CommonJS post-compaction adapter locates the compiled shared boundary bridge through the repository layout rather than importing a sibling JavaScript source file. | Keep the intentional CJS/build boundary and guard it with the registered-path suite, which executes the real adapter through the shared bridge. The suggested sibling `.js` import does not exist before build. | Spec Kit hook maintainer | The registered-path bridge suite fails, the dist layout or hook registration moves, or a native Devin receipt shows missed invalidation. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No decision suppresses when transcript state is unknown, below the observed high-water mark, separated by a host-owned epoch change, or older than a store-wide invalidation generation.
- **SC-002**: No ambiguous or conflicting OpenCode identity can create or consume directive suppression state.
- **SC-003**: The file store rejects unsafe topology, record metadata, and intermediate-component replacement races without following links or escaping the trusted root; unprovable platforms disable durable suppression and failures only cause duplicate full delivery.
- **SC-004**: Every runtime discovery symlink remains present and resolves to its registered adapter target.
- **SC-005**: Scenario 457 and benchmark reports state exactly which evidence class passed; Cursor native delivery remains unconfirmed until a real receipt exists.
- **SC-006**: Current benchmark evidence is repository-relative, hashed, reproducible, versioned, and provenance-clean; historical records remain immutable and externally marked superseded.
- **SC-007**: Codex/Cursor/Devin adapter parity matrices pass all payload, envelope, error, timeout, missing-field, and path-form rows.
- **SC-008**: Parent and phases 014-018 tell one status and fingerprint truth, with 017 superseded by 018.
- **SC-009**: Post-change whole-gate results introduce no failure, missing lane, lost test file, lower test total, or unexplained skip/todo delta beyond the durable pre-change baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing registered lifecycle hooks and dist build | Epoch reset cannot be proven from test-only fields. | Wire source adapters, rebuild dist, and execute registration paths from actual config files. |
| Dependency | Benchmark wrapper and report renderers | Evidence may remain ephemeral or provenance-poor. | Add schema validation and reject PASS before report persistence if required fields/hashes are absent. |
| Dependency | Whole-gate runtime availability | Baseline and post-run may not be comparable. | Pin command manifest, runtime versions, cwd, env allowlist, and unavailable-lane disposition before edits. |
| Risk | Store hardening becomes platform-specific | Ownership or `O_NOFOLLOW` behavior differs by OS. | Capability-detect; unsupported security proof fails open and is recorded, never downgraded to a PASS. |
| Risk | Epoch reset race with prompt subprocess | One process can observe old state during reset. | Version records and use monotonic epoch comparison; ambiguity yields full delivery. |
| Risk | Phase reconciliation rewrites history | Review provenance could be lost. | Preserve historical reports and phase intent; update current status/fingerprints and add explicit supersession links. |
| Risk | Symlink cleanup instructions are executed accidentally | Runtime discovery breaks. | Put preservation gate before any reconciliation and forbid deletion in plan/tasks/checklist. |
| Risk | Focused tests hide broader regressions | Local suites pass while repository gate worsens. | Baseline and rerun the identical whole-gate manifest; compare failure identities and exit codes. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Correctness work must not introduce unbounded directory scans; eviction and temp cleanup use fixed caps and owned-prefix filtering.
- **NFR-P02**: Capture hook latency p50/p95/p99 as RR-002 evidence. Latency characterization is non-gating unless it exposes stale suppression or a regression large enough to elevate.

### Security
- **NFR-S01**: Store operations require containment, current-user ownership where supported, regular-file and link-count checks, restrictive modes, size bounds, and directory-handle-anchored or equivalent race-safe no-follow semantics. Unsupported proof disables durable suppression.
- **NFR-S02**: Benchmark payloads are sanitized and may not persist prompts, paths, secrets, or host metadata beyond the documented fixture contract.

### Reliability
- **NFR-R01**: All uncertainty, IO failure, race, missing identity, missing stat, or version mismatch resolves to full directive delivery.
- **NFR-R02**: Append-only evidence and immutable historical records preserve auditability through corrections.

---

## 8. EDGE CASES

### Data Boundaries
- Empty or missing session id: full delivery; no state write.
- Multiple equal session-id candidates: eligible only after normalization proves equality.
- Multiple conflicting session-id candidates: full delivery; no state write.
- Transcript `5 KB → 10 KB → 7 KB`: full, route-only with high-water update, full after shrink below high-water.
- Transcript `null → null`: full, full because unchanged history is not proven.
- Oversized or malformed record: reject record and deliver full.
- Store at capacity: bounded eviction; an eviction race may duplicate full delivery but must not suppress stale policy.

### Error Scenarios
- Symlink or hard-link injection: reject before read/write/rename and deliver full.
- Rename failure: remove owned temp artifact in `finally`; leave prior valid record untouched.
- Host reset arrives without usable session identity: increment the store-wide invalidation generation without targeting another session; every older record fails open on its next prompt.
- Cursor event does not fire: record native evidence as unconfirmed, not PASS.
- Benchmark evidence exists only in `/tmp`: persistence rejects PASS until copied into a repository-relative artifact and hashed.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 23/25 | Canonical core, plugin mirror, 8 lifecycle adapters, 4 test surfaces, playbook, wrapper, reports, and phase metadata. |
| Risk | 24/25 | Security-sensitive filesystem state and guardrail suppression across host processes. |
| Research | 16/20 | Host event semantics, no-follow portability, evidence taxonomy, and baseline interpretation. |
| Multi-Agent | 6/15 | One implementation owner is preferred; review can be independent after writes. |
| Coordination | 13/15 | Build outputs, registrations, immutable evidence, and parent/child metadata must land in order. |
| **Total** | **82/100** | **Level 3 is required for architecture, security, proof, and reconciliation detail.** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Stale suppression after untracked transcript growth/shrink | H | H | Persist high-water on eligible suppressed turns and require known stat. |
| R-002 | Host lifecycle event is absent from prompt payload | H | H | Advance epoch from registered lifecycle hook paths. |
| R-003 | Symlinked state path redirects file operations | H | M | Component-by-component no-follow, owner, containment, and regular-file checks. |
| R-004 | Evidence overstates native delivery | H | H | Evidence-class enum and aggregate verdict rules. |
| R-005 | Reconciliation executes phase 017 deletion plan | H | M | Preservation gate first; mark 017 superseded before doc cleanup. |
| R-006 | Existing full-suite failures obscure a regression | H | M | Durable baseline with identical manifest and failure-identity diff. |

---

## 11. USER STORIES

### US-001: Safe Lifecycle Suppression (Priority: P1)

**As a** runtime user, **I want** directives suppressed only when the current lifecycle epoch and complete transcript history are proven, **so that** compaction or stat uncertainty never removes guardrails.

**Acceptance Criteria**:
1. Given known sizes 5 KB, 10 KB, then 7 KB in one session, when three prompts run, then delivery is full, route-only, full.
2. Given two missing stats, when the same prompt repeats, then both deliveries remain full.

---

### US-002: Unambiguous OpenCode Identity (Priority: P1)

**As an** OpenCode user, **I want** conflicting session fields to fail open, **so that** one session cannot inherit another session's suppression state.

**Acceptance Criteria**:
1. Given different top-level and nested session ids, when the transform runs twice, then both outputs contain the full directive block and the dedup map does not gain that identity.

---

### US-003: Secure Durable Store (Priority: P1)

**As a** repository operator, **I want** file-backed lifecycle state contained and owner-controlled, **so that** a local filesystem attacker cannot inject stale suppression records or redirect writes.

**Acceptance Criteria**:
1. Given any symlinked component or injected record type, when the store reads or writes, then it rejects the path and the hook delivers full directives.

---

### US-004: Honest Cross-Runtime Evidence (Priority: P1)

**As a** reviewer, **I want** unit, adapter, registered-path, and native-host evidence separated, **so that** a probe is never presented as a real host receipt.

**Acceptance Criteria**:
1. Given Cursor adapter cadence without a firing `beforeSubmitPrompt` event, when results are persisted, then registered-path may pass but native-host-delivered is unconfirmed.

---

### US-005: Stable Discovery Wiring (Priority: P1)

**As a** runtime integrator, **I want** every existing discovery symlink preserved, **so that** remediation does not break hook lookup.

**Acceptance Criteria**:
1. Given the four runtime discovery paths, when reconciliation finishes, then each remains a symlink to the expected dist target and both path forms pass the parity probe.

---

### US-006: Comparable Regression Proof (Priority: P1)

**As a** release owner, **I want** the same whole-gate manifest before and after the fix, **so that** focused green tests cannot hide a broader regression.

**Acceptance Criteria**:
1. Given a hashed baseline manifest, when implementation ends, then the post-run uses the identical manifest and reports no new failure identity.

---

## 12. OPEN QUESTIONS

None. The review supplies the required behavior, protected symlink policy, evidence taxonomy, formal-priority interpretation, predecessor, successor, and rollback direction. Implementation must reopen this section only if new evidence changes a formal gate or a host cannot expose a safe epoch reset seam.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Predecessor**: `../017-adapter-live-delivery-verification/`
