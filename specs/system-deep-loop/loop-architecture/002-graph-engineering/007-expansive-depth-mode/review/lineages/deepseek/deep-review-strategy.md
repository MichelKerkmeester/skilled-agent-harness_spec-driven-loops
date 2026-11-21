---
title: Deep Review Strategy - Session Tracking
description: Runtime strategy for the deepseek fan-out lineage of the expansive-depth review over the deep-loop runtime and command surface.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for this review lineage. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next.

### Usage

- **Init:** Populated from config and the bounded context snapshot.
- **Per iteration:** Agent reads Next Focus, reviews the assigned frontier node and dimension, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.

---

## 2. TOPIC

Review: `17a9ddbcb68..555487146e2 -- .skilled/skills/system-deep-loop .skilled/commands/deep` (88 changed files, commit-range target, review target type `files`).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- No fixes, no source edits, no refactors: this loop is observation-only.
- No review of files outside the commit range `17a9ddbcb68..555487146e2` under the two pathspecs.
- No web research and no external resource fetching.
- No review of the `review/` packet artifacts themselves except as traceability evidence.

---

## 5. STOP CONDITIONS

- Legal convergence per `convergence.cjs` (composite weighted vote under `convergenceThreshold: 0.1`, all dimensions clean, frontier drained).
- `maxIterations: 24` reached.
- Stuck recovery (`stuckThreshold: 2`) or three consecutive failed iterations.
- Wall-clock budget `maxDurationMinutes: 120` from `createdAt`.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 9
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Builder-to-record comparison: reading each `build*LineageCommand` beside its `EXECUTOR_ADAPTER_CAPABILITIES` row found both P2s without running the suite (iteration 1).
- Tracing the built command's `env` through `extraEnv` into `runLineageProcess` proved the opencode deny reaches the child in both dispatch paths (iteration 1).
- Following a stripped field from the CLI metadata into the projection (`withoutGatewayIdentity` then `data.record` then `{...record}`) found the one place the "dropped, not kept" claim does not hold (iteration 2).

---

## 9. WHAT FAILED
- Reading the conformance test as proof of the sandbox contract: its `permission-mode` assertion compares only `read-only` with `danger-full-access`, so it cannot see the dsh `workspace-write` collapse (iteration 1).
- Reading the gateway comment as proof of the projection: the comment describes the envelope, and the projected row is a separate spread that keeps the model's identity fields (iteration 2).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`--auto` on opencode as a privilege regression.** Ruled out: `read-only` is refused before spawn, and `workspace-write` pairs `--auto` with an `external_directory` deny that is covered by `dispatch-iteration.vitest.ts:504-528` and `fanout-run.vitest.ts:3826-3914`. The residual Bash write path is documented in the builder warning and in `loop-protocol.md:294`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`--auto` on opencode as a privilege regression.** Ruled out: `read-only` is refused before spawn, and `workspace-write` pairs `--auto` with an `external_directory` deny that is covered by `dispatch-iteration.vitest.ts:504-528` and `fanout-run.vitest.ts:3826-3914`. The residual Bash write path is documented in the builder warning and in `loop-protocol.md:294`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`--auto` on opencode as a privilege regression.** Ruled out: `read-only` is refused before spawn, and `workspace-write` pairs `--auto` with an `external_directory` deny that is covered by `dispatch-iteration.vitest.ts:504-528` and `fanout-run.vitest.ts:3826-3914`. The residual Bash write path is documented in the builder warning and in `loop-protocol.md:294`.

### **`DISPATCH_ENV_KEYS` blocking the fan-out merge.** Ruled out: `assertDispatchEnvAllowed` runs only in `runAuditedExecutorCommand`, and the fan-out path assembles `extraEnv` itself. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`DISPATCH_ENV_KEYS` blocking the fan-out merge.** Ruled out: `assertDispatchEnvAllowed` runs only in `runAuditedExecutorCommand`, and the fan-out path assembles `extraEnv` itself.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`DISPATCH_ENV_KEYS` blocking the fan-out merge.** Ruled out: `assertDispatchEnvAllowed` runs only in `runAuditedExecutorCommand`, and the fan-out path assembles `extraEnv` itself.

### **`emittedPermissionMode` misreporting another kind's flag.** Ruled out: it reads the argv it was given and each builder emits its own vocabulary; no cross-kind value is reused. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`emittedPermissionMode` misreporting another kind's flag.** Ruled out: it reads the argv it was given and each builder emits its own vocabulary; no cross-kind value is reused.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`emittedPermissionMode` misreporting another kind's flag.** Ruled out: it reads the argv it was given and each builder emits its own vocabulary; no cross-kind value is reused.

### **A `run`-versus-`iteration` contradiction.** Ruled out: the reference describes both and the readers accept both. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **A `run`-versus-`iteration` contradiction.** Ruled out: the reference describes both and the readers accept both.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `run`-versus-`iteration` contradiction.** Ruled out: the reference describes both and the readers accept both.

### **A commit message overstating its diff.** Ruled out: each of the three messages names a behavior the diff implements, and none claims a broader guarantee. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A commit message overstating its diff.** Ruled out: each of the three messages names a behavior the diff implements, and none claims a broader guarantee.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A commit message overstating its diff.** Ruled out: each of the three messages names a behavior the diff implements, and none claims a broader guarantee.

### **A cost double-count across rotated claude logs.** Ruled out: rotation is per attempt, and each attempt's log carries its own cumulative total, so summing attempts is correct. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A cost double-count across rotated claude logs.** Ruled out: rotation is per attempt, and each attempt's log carries its own cumulative total, so summing attempts is correct.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A cost double-count across rotated claude logs.** Ruled out: rotation is per attempt, and each attempt's log carries its own cumulative total, so summing attempts is correct.

### **A cross-run append through `--run-directory`.** Ruled out as a gateway finding: the caller already holds filesystem write authority, so naming another directory is not an escalation the gateway can prevent; containment is the fan-out guard's job. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A cross-run append through `--run-directory`.** Ruled out as a gateway finding: the caller already holds filesystem write authority, so naming another directory is not an escalation the gateway can prevent; containment is the fan-out guard's job.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A cross-run append through `--run-directory`.** Ruled out as a gateway finding: the caller already holds filesystem write authority, so naming another directory is not an escalation the gateway can prevent; containment is the fan-out guard's job.

### **A cross-stream write through `streamId`.** Ruled out: the ledger file is selected by the ledger's own id, not the event's `streamId`. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **A cross-stream write through `streamId`.** Ruled out: the ledger file is selected by the ledger's own id, not the event's `streamId`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A cross-stream write through `streamId`.** Ruled out: the ledger file is selected by the ledger's own id, not the event's `streamId`.

### **A destructive default.** Ruled out: `preserve` is the default and `restore` is opt-in. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: **A destructive default.** Ruled out: `preserve` is the default and `restore` is opt-in.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A destructive default.** Ruled out: `preserve` is the default and `restore` is opt-in.

### **A digest collision risk from `withoutHeads`.** Ruled out: it only nulls a value equal to one of the two event heads, which a review record's content cannot plausibly contain, and both sides are transformed identically. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A digest collision risk from `withoutHeads`.** Ruled out: it only nulls a value equal to one of the two event heads, which a review record's content cannot plausibly contain, and both sides are transformed identically.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A digest collision risk from `withoutHeads`.** Ruled out: it only nulls a value equal to one of the two event heads, which a review record's content cannot plausibly contain, and both sides are transformed identically.

### **A digest-collision replay bypass.** Ruled out: the digest is computed over the payload with the same head-nulling on both sides, and a different payload produces a different digest. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A digest-collision replay bypass.** Ruled out: the digest is computed over the payload with the same head-nulling on both sides, and a different payload produces a different digest.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A digest-collision replay bypass.** Ruled out: the digest is computed over the payload with the same head-nulling on both sides, and a different payload produces a different digest.

### **A doc claiming an OS sandbox where only a permission rule exists.** Ruled out: every opencode and pi statement names the control as a permission rule or tool allowlist and names Bash as unconfined. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A doc claiming an OS sandbox where only a permission rule exists.** Ruled out: every opencode and pi statement names the control as a permission rule or tool allowlist and names Bash as unconfined.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A doc claiming an OS sandbox where only a permission rule exists.** Ruled out: every opencode and pi statement names the control as a permission rule or tool allowlist and names Bash as unconfined.

### **A doc omitting the opencode read-only refusal.** Ruled out: `review.md`, both presentations, both compiled contracts and `loop-protocol.md:286` all state it. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A doc omitting the opencode read-only refusal.** Ruled out: `review.md`, both presentations, both compiled contracts and `loop-protocol.md:286` all state it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A doc omitting the opencode read-only refusal.** Ruled out: `review.md`, both presentations, both compiled contracts and `loop-protocol.md:286` all state it.

### **A duplicate of R1-P2-001.** Ruled out: that finding is the dsh command being confined while the label says `none`; this one is a runner-level guard the label cannot see. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: **A duplicate of R1-P2-001.** Ruled out: that finding is the dsh command being confined while the label says `none`; this one is a runner-level guard the label cannot see.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A duplicate of R1-P2-001.** Ruled out: that finding is the dsh command being confined while the label says `none`; this one is a runner-level guard the label cannot see.

### **A duplicate of R2-P2-001.** Ruled out: R2-P2-001 is about the projected row keeping stripped fields; this finding is about four fields that are never stripped at all. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **A duplicate of R2-P2-001.** Ruled out: R2-P2-001 is about the projected row keeping stripped fields; this finding is about four fields that are never stripped at all.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A duplicate of R2-P2-001.** Ruled out: R2-P2-001 is about the projected row keeping stripped fields; this finding is about four fields that are never stripped at all.

### **A duplicate of R3-P2-001.** Ruled out: that finding is the weak `permission-mode` assertion; this pass found no additional gap worth a separate finding. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: **A duplicate of R3-P2-001.** Ruled out: that finding is the weak `permission-mode` assertion; this pass found no additional gap worth a separate finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A duplicate of R3-P2-001.** Ruled out: that finding is the weak `permission-mode` assertion; this pass found no additional gap worth a separate finding.

### **A duplicate of R4-P2-001.** Ruled out: R4-P2-001 is the pi content drift; this finding is the structural duplication that let it happen, in a different file set. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **A duplicate of R4-P2-001.** Ruled out: R4-P2-001 is the pi content drift; this finding is the structural duplication that let it happen, in a different file set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A duplicate of R4-P2-001.** Ruled out: R4-P2-001 is the pi content drift; this finding is the structural duplication that let it happen, in a different file set.

### **A finding for the `--pure` guard being too narrow on its own.** Ruled out as the same finding: the narrow guard is the evidence, not a separate defect. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **A finding for the `--pure` guard being too narrow on its own.** Ruled out as the same finding: the narrow guard is the evidence, not a separate defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A finding for the `--pure` guard being too narrow on its own.** Ruled out as the same finding: the narrow guard is the evidence, not a separate defect.

### **A finding for the catalog's per-kind paragraphs.** Ruled out: every claim checked matches the builders. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: **A finding for the catalog's per-kind paragraphs.** Ruled out: every claim checked matches the builders.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A finding for the catalog's per-kind paragraphs.** Ruled out: every claim checked matches the builders.

### **A finding for the claude `--output-format` difference between dispatch paths.** Ruled out: the reference names the `dispatch-iteration.cjs` branch, and that branch still emits text. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A finding for the claude `--output-format` difference between dispatch paths.** Ruled out: the reference names the `dispatch-iteration.cjs` branch, and that branch still emits text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A finding for the claude `--output-format` difference between dispatch paths.** Ruled out: the reference names the `dispatch-iteration.cjs` branch, and that branch still emits text.

### **A finding for the compiled contracts.** Ruled out: they are generated and their digests match. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **A finding for the compiled contracts.** Ruled out: they are generated and their digests match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A finding for the compiled contracts.** Ruled out: they are generated and their digests match.

### **A finding for the conformance test not asserting the label.** Ruled out as a duplicate of R3-P2-001's test-gap class. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: **A finding for the conformance test not asserting the label.** Ruled out as a duplicate of R3-P2-001's test-gap class.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A finding for the conformance test not asserting the label.** Ruled out as a duplicate of R3-P2-001's test-gap class.

### **A finding for the containment guard itself.** Ruled out: it runs for every kind and reports out-of-scope writes; the gap is the label, not the guard. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: **A finding for the containment guard itself.** Ruled out: it runs for every kind and reports out-of-scope writes; the gap is the label, not the guard.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A finding for the containment guard itself.** Ruled out: it runs for every kind and reports out-of-scope writes; the gap is the label, not the guard.

### **A finding for the lazy `require` inside `sandboxEnforcementFor`.** Ruled out: it is the documented way a CJS script loads the TypeScript record, and Node caches the module. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **A finding for the lazy `require` inside `sandboxEnforcementFor`.** Ruled out: it is the documented way a CJS script loads the TypeScript record, and Node caches the module.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A finding for the lazy `require` inside `sandboxEnforcementFor`.** Ruled out: it is the documented way a CJS script loads the TypeScript record, and Node caches the module.

### **A finding for the single-member `ExecutorResumeMode` union.** Ruled out: it documents the contract that no builder resumes a provider session, and the conformance test asserts it for every kind. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **A finding for the single-member `ExecutorResumeMode` union.** Ruled out: it documents the contract that no builder resumes a provider session, and the conformance test asserts it for every kind.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A finding for the single-member `ExecutorResumeMode` union.** Ruled out: it documents the contract that no builder resumes a provider session, and the conformance test asserts it for every kind.

### **A flag-support entry the builder ignores.** Ruled out: the dsh `reasoningEffort` entry is documented as baked into the route patch, which the builder states at `fanout-run.cjs:3619-3620`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A flag-support entry the builder ignores.** Ruled out: the dsh `reasoningEffort` entry is documented as baked into the route patch, which the builder states at `fanout-run.cjs:3619-3620`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A flag-support entry the builder ignores.** Ruled out: the dsh `reasoningEffort` entry is documented as baked into the route patch, which the builder states at `fanout-run.cjs:3619-3620`.

### **A maintainability finding for the mirrored allowlists.** Ruled out: the fail-closed direction is tested through the builder, and the fail-open direction is unreachable because the config gates first. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **A maintainability finding for the mirrored allowlists.** Ruled out: the fail-closed direction is tested through the builder, and the fail-open direction is unreachable because the config gates first.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A maintainability finding for the mirrored allowlists.** Ruled out: the fail-closed direction is tested through the builder, and the fail-open direction is unreachable because the config gates first.

### **A new finding for the vocabulary.** Ruled out: the catalog and the code agree; the inconsistency is inside the record, already reported. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: **A new finding for the vocabulary.** Ruled out: the catalog and the code agree; the inconsistency is inside the record, already reported.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A new finding for the vocabulary.** Ruled out: the catalog and the code agree; the inconsistency is inside the record, already reported.

### **A non-exhaustive surface switch.** Ruled out: the `default` throws. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: **A non-exhaustive surface switch.** Ruled out: the `default` throws.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A non-exhaustive surface switch.** Ruled out: the `default` throws.

### **A P1 for claude's `preventive` label under `acceptEdits`.** Ruled out: the capability record is the stated authority and justifies the entry as the CLI's tool gate running before a write/exec, and print mode cannot run Bash. Recorded as a judgment call rather than a finding. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: **A P1 for claude's `preventive` label under `acceptEdits`.** Ruled out: the capability record is the stated authority and justifies the entry as the CLI's tool gate running before a write/exec, and print mode cannot run Bash. Recorded as a judgment call rather than a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A P1 for claude's `preventive` label under `acceptEdits`.** Ruled out: the capability record is the stated authority and justifies the entry as the CLI's tool gate running before a write/exec, and print mode cannot run Bash. Recorded as a judgment call rather than a finding.

### **A P1 for the forced `streamSequence`.** Ruled out: the ledger's head fence refuses the append, so the failure is a refused iteration rather than a corrupted chain. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **A P1 for the forced `streamSequence`.** Ruled out: the ledger's head fence refuses the append, so the failure is a refused iteration rather than a corrupted chain.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A P1 for the forced `streamSequence`.** Ruled out: the ledger's head fence refuses the append, so the failure is a refused iteration rather than a corrupted chain.

### **A P1 for the pi help drift.** Ruled out: the sentence is defensible as "no OS sandbox flag", the config field is accepted, and the capability record states the real surface. Kept at P2 with that reasoning recorded. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A P1 for the pi help drift.** Ruled out: the sentence is defensible as "no OS sandbox flag", the config field is accepted, and the capability record states the real surface. Kept at P2 with that reasoning recorded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A P1 for the pi help drift.** Ruled out: the sentence is defensible as "no OS sandbox flag", the config field is accepted, and the capability record states the real surface. Kept at P2 with that reasoning recorded.

### **A P1 for the projected identity fields.** Ruled out after searching for a consumer: neither the reducer nor the verifier reads `eventId` from a state-log row, so nothing mis-correlates today. Kept at P2 as a contract/comment mismatch with latent confusion. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A P1 for the projected identity fields.** Ruled out after searching for a consumer: neither the reducer nor the verifier reads `eventId` from a state-log row, so nothing mis-correlates today. Kept at P2 as a contract/comment mismatch with latent confusion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A P1 for the projected identity fields.** Ruled out after searching for a consumer: neither the reducer nor the verifier reads `eventId` from a state-log row, so nothing mis-correlates today. Kept at P2 as a contract/comment mismatch with latent confusion.

### **A path-traversal write through the projection.** Ruled out: the projection contract and the state-log path are both resolved from the run directory, and no event field contributes a path segment. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A path-traversal write through the projection.** Ruled out: the projection contract and the state-log path are both resolved from the run directory, and no event field contributes a path segment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A path-traversal write through the projection.** Ruled out: the projection contract and the state-log path are both resolved from the run directory, and no event field contributes a path segment.

### **A playbook claiming confinement.** Ruled out: the word is used only for fixture directories and the SKIP criterion. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A playbook claiming confinement.** Ruled out: the word is used only for fixture directories and the SKIP criterion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A playbook claiming confinement.** Ruled out: the word is used only for fixture directories and the SKIP criterion.

### **A privilege escalation through a forged `identity.authorityEpoch`.** Ruled out: the authorization request uses `admission.epoch`, and the caller's value is never read for authorization. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A privilege escalation through a forged `identity.authorityEpoch`.** Ruled out: the authorization request uses `admission.epoch`, and the caller's value is never read for authorization.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A privilege escalation through a forged `identity.authorityEpoch`.** Ruled out: the authorization request uses `admission.epoch`, and the caller's value is never read for authorization.

### **A projection field drop.** Ruled out: the projection spreads the record and overrides only the timestamp. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **A projection field drop.** Ruled out: the projection spreads the record and overrides only the timestamp.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A projection field drop.** Ruled out: the projection spreads the record and overrides only the timestamp.

### **A schema failure for `frontierNodeId`.** Ruled out: the field is optional and the fallback chain is documented in code; the gap is in the reference, not the runtime. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **A schema failure for `frontierNodeId`.** Ruled out: the field is optional and the fallback chain is documented in code; the gap is in the reference, not the runtime.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A schema failure for `frontierNodeId`.** Ruled out: the field is optional and the fallback chain is documented in code; the gap is in the reference, not the runtime.

### **A secret-leak finding from the per-kind env prefixes.** Ruled out: each prefix is the kind's own credential namespace, and the deny table removes the state-home names a prefix would otherwise carry. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A secret-leak finding from the per-kind env prefixes.** Ruled out: each prefix is the kind's own credential namespace, and the deny table removes the state-home names a prefix would otherwise carry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A secret-leak finding from the per-kind env prefixes.** Ruled out: each prefix is the kind's own credential namespace, and the deny table removes the state-home names a prefix would otherwise carry.

### **A security finding from the pi help line.** Already recorded as R4-P2-001 in the F-1-002 security pass; re-reporting it here would double-count the same sentence. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A security finding from the pi help line.** Already recorded as R4-P2-001 in the F-1-002 security pass; re-reporting it here would double-count the same sentence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A security finding from the pi help line.** Already recorded as R4-P2-001 in the F-1-002 security pass; re-reporting it here would double-count the same sentence.

### **A security finding in the guard's path construction.** Ruled out of scope: `write-containment.ts` is not in the commit range. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: **A security finding in the guard's path construction.** Ruled out of scope: `write-containment.ts` is not in the commit range.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A security finding in the guard's path construction.** Ruled out of scope: `write-containment.ts` is not in the commit range.

### **A separate finding for the conformance test's weak `permission-mode` assertion.** Ruled out as a duplicate: it is the reason P2-1 escaped, and it is recorded in that finding's scope proof rather than counted twice. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A separate finding for the conformance test's weak `permission-mode` assertion.** Ruled out as a duplicate: it is the reason P2-1 escaped, and it is recorded in that finding's scope proof rather than counted twice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A separate finding for the conformance test's weak `permission-mode` assertion.** Ruled out as a duplicate: it is the reason P2-1 escaped, and it is recorded in that finding's scope proof rather than counted twice.

### **A separate finding for the dsh narrowing being undocumented.** Ruled out after reading `loop-protocol.md:288`, which documents it; the surviving issue is the provenance mismatch already recorded as R1-P2-001. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A separate finding for the dsh narrowing being undocumented.** Ruled out after reading `loop-protocol.md:288`, which documents it; the surviving issue is the provenance mismatch already recorded as R1-P2-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A separate finding for the dsh narrowing being undocumented.** Ruled out after reading `loop-protocol.md:288`, which documents it; the surviving issue is the provenance mismatch already recorded as R1-P2-001.

### **A stale compiled contract.** Ruled out by digest comparison against the current file bytes. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **A stale compiled contract.** Ruled out by digest comparison against the current file bytes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale compiled contract.** Ruled out by digest comparison against the current file bytes.

### **A swallowed violation.** Ruled out: every category the guard returns reaches the ledger or the lineage output. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: **A swallowed violation.** Ruled out: every category the guard returns reaches the ledger or the lineage output.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A swallowed violation.** Ruled out: every category the guard returns reaches the ledger or the lineage output.

### **A timestamp regression for the stamp-window check.** Ruled out: `lineage-timestamp-window.ts` prefers `claimedTimestamp`, so the model's claim is still the value judged. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A timestamp regression for the stamp-window check.** Ruled out: `lineage-timestamp-window.ts` prefers `claimedTimestamp`, so the model's claim is still the value judged.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A timestamp regression for the stamp-window check.** Ruled out: `lineage-timestamp-window.ts` prefers `claimedTimestamp`, so the model's claim is still the value judged.

### **A traceability finding from the dsh narrowing.** Ruled out as a duplicate of R1-P2-001 and its iteration-3 refinement. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A traceability finding from the dsh narrowing.** Ruled out as a duplicate of R1-P2-001 and its iteration-3 refinement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A traceability finding from the dsh narrowing.** Ruled out as a duplicate of R1-P2-001 and its iteration-3 refinement.

### **An inherited `OPENCODE_CONFIG_CONTENT` bypassing the deny.** Ruled out: the deny is applied last and an unparseable inherited value is refused. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **An inherited `OPENCODE_CONFIG_CONTENT` bypassing the deny.** Ruled out: the deny is applied last and an unparseable inherited value is refused.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An inherited `OPENCODE_CONFIG_CONTENT` bypassing the deny.** Ruled out: the deny is applied last and an unparseable inherited value is refused.

### **An orphaned catalog file.** Ruled out: every changed catalog file is linked from the index. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **An orphaned catalog file.** Ruled out: every changed catalog file is linked from the index.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An orphaned catalog file.** Ruled out: every changed catalog file is linked from the index.

### **An unindexed playbook.** Ruled out: DLR-025 and DRV-018 both resolve. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **An unindexed playbook.** Ruled out: DLR-025 and DRV-018 both resolve.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An unindexed playbook.** Ruled out: DLR-025 and DRV-018 both resolve.

### **An untested preventive record.** Ruled out: `executor-config.vitest.ts:486-506` pins it. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: **An untested preventive record.** Ruled out: `executor-config.vitest.ts:486-506` pins it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An untested preventive record.** Ruled out: `executor-config.vitest.ts:486-506` pins it.

### **Compiled-contract drift.** Ruled out: the body text of both compiled contracts matches the edited `review.md`/`research.md` and presentation assets, and the digest headers were regenerated in the same commit. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Compiled-contract drift.** Ruled out: the body text of both compiled contracts matches the edited `review.md`/`research.md` and presentation assets, and the digest headers were regenerated in the same commit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Compiled-contract drift.** Ruled out: the body text of both compiled contracts matches the edited `review.md`/`research.md` and presentation assets, and the digest headers were regenerated in the same commit.

### **dsh persona path traversal.** Ruled out by the name grammar, which admits no path separator or dot. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **dsh persona path traversal.** Ruled out by the name grammar, which admits no path separator or dot.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **dsh persona path traversal.** Ruled out by the name grammar, which admits no path separator or dot.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- opencode `--auto` as a privilege regression: ruled out; `read-only` is refused before spawn and `workspace-write` pairs `--auto` with a tested `external_directory` deny (iteration 1, evidence: `fanout-run.cjs:2832-2839`, `dispatch-iteration.vitest.ts:504-528`).
- A separate finding for the conformance test's weak `permission-mode` assertion: folded into P2-1's scope proof rather than counted twice (iteration 1).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining on this node; the frontier is drained (all four nodes answered) - Frontier node: none (F-2-007 is the last open node and this pass completes its fourth dimension) - Focus area: synthesis readiness — the next convergence check should form a `frontier_drained` candidate, and the legal-stop gates decide it. - Reason: every node has all four canonical dimensions covered; no open or active node remains. - Rotation status: all dimensions covered on all four nodes. - Blocked/productive carry-forward: productive (test-coverage tracing closed the maintainability question); no blocked approaches. - Required evidence: the convergence decision after this iteration. - Recovery note: none. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the commit range `17a9ddbcb68..555487146e2` under `.skilled/skills/system-deep-loop` and `.skilled/commands/deep`. 88 files: runtime scripts (`append-mode-event.cjs`, `convergence.cjs`, `fanout-run.cjs`, `dispatch-iteration.cjs`, `synthesis-closeout.cjs`, `upsert.cjs`), runtime libs (`executor-config.ts`, `executor-audit.ts`, ledger schemas, legacy projections), command assets (`deep-review.yaml`, `deep-research.yaml`, compiled contracts, presentations), skill references and feature catalogs, manual-testing playbooks, and vitest suites.
- Behavior claims to verify: the range's three commits claim (a) a dry-run convergence call stays read-only, (b) a review row mints identity and refuses a reused key with different content, (c) the blocked-stop record is withheld from a dry run. The expansive-depth frontier, fan-out lineage contract, and executor adapter capability record are the surrounding contracts those fixes touch.
- Reuse and conventions: the append gateway is the single state-log writer; the reducer owns registry/dashboard/strategy projections; `frontier-admit.cjs` owns the node store; the YAML workflow is the stop-decision consumer and computes no arithmetic of its own.
- Review risks and gaps: the range is a commit range, so `reviewScopeFiles` is the git diff list, not a glob expansion. Files deleted by the range have nothing to review. The compiled contract markdown is generated from the YAML, so drift between them is a traceability finding, not a code finding.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | `loop-protocol.md:294` matches the opencode builder; the dsh sandbox paragraph was not located, so partial. |
| `checklist_evidence` | core | notApplicable | 1 | Commit-range implementation target, no spec checklist. |
| `skill_agent` | overlay | notApplicable | 1 | No agent definition in the range. |
| `agent_cross_runtime` | overlay | notApplicable | 1 | No runtime mirror in the range. |
| `feature_catalog_code` | overlay | pending | - | In scope, owned by node F-1-006. |
| `playbook_capability` | overlay | pending | - | In scope, owned by node F-1-006. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery; 88 files in scope, see `deep-review-config.json` `reviewScopeFiles`]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 24
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-1795201537192-sq1ivw, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-20T19:07:02.024Z
<!-- MACHINE-OWNED: END -->
