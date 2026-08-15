I've completed my spot-check of the synthesis against source. Here is my independent final review.

---

# Final Review — Pi Remote Deep-Review Synthesis

## VERDICT: **ENDORSE-WITH-CHANGES**

The synthesis is fundamentally sound: every "known-accepted-gap" and "review-noise" rejection I spot-checked is backed by explicit documentation, and all five P1 confirms are factually accurate against source. The main defect is a **triage inconsistency** — two of the five "P1 blockers" (F006, F007) live in the *same unwired mutation path* that the synthesis correctly used to reject F001, yet they are graded as production P1s. That overstates their severity and mis-orders the remediation plan.

## 1. Safety of the rejections — sound, with one borderline

I verified the rejection evidence against source and found the docs genuinely support them:

- **F001** (no command route): security.md "Runtime Limit" states the entrypoint "does not wire Pi tool calls into `request()`". Rejection sound.
- **F005** (memory-only auth): `EnrollmentRegistry`/`AuthService` use only in-memory `Map`s (`enrollment.ts:19-21`, `auth-service.ts:72-75`); security.md:33-39 documents it. Rejection sound.
- **F004** (fixture fallback + health omission): `supervisor.ts:169-173` activates fixture on ENOENT; `/health` (`server.ts:327-333`) omits supervisor state. rollback.md §7 documents exactly this. Rejection sound.
- **F008** (cache survives logout/revoke): `cache.ts` has no deletion path in `logoutDevice`/`revokeDevice` (`auth.ts:117-125`); rollback.md §5 and security.md document the bounded 7-day non-authority cache. Rejection sound — but note the fix text ("reconcile wording or change privacy policy first") is a genuine open privacy decision, correctly flagged.
- **P1-002** (credential storage): `web/src/auth.ts:30-37` generates a **non-extractable** ECDSA key, `clearDevice()` on revoke, retained on logout; session is a separate HttpOnly cookie. Rejection sound.
- **F009** (unscoped selectors): correct that `transcript`/`approvals`/`subscribe` accept client-supplied `sessionId` without principal/workspace binding (`server.ts:414-422,466-479`), but the app has exactly one hardcoded `session_local`/`workspace_default`/`host_local` (`index.ts:21-23`). No cross-tenant data exists. Rejection sound as "latent, add ACLs before multi-tenant."

**Borderline — F011/P2-022.** The rejection is technically right (`check-rollout.mjs --require-ready` enforces promotion; `release-verify.mjs:73-74` `overallStatus` is machine-gate status). But the evidence JSON's top-level `status: "PASS"` with every stage `NOT-READY` is genuinely ambiguous for a safety-critical release artifact. The synthesis's own "optional field rename" should be **promoted to a real (cheap) P2**, not dismissed.

## 2. Soundness of the confirms — accurate, but two severity errors

- **F003** (no transcript projection): **CONFIRMED and correctly P1.** `publishPiEvent` emits `kind: pi.*` (`index.ts:135-137`); the only transcript consumers filter `kind='transcript.block'` (`relay-store.ts:301`, `state.ts:272`). The shipped read-only transcript is always empty — this is the one P1 that breaks the *actual* product. Note it is documented at `architecture.md:60`, which the synthesis could have cited.
- **F006** (revocation doesn't drain approvals): factually correct (`server.ts:340-344` calls only `push.unsubscribe` + `auth.revokeDevice`). Contract REQ-006 (`004/spec.md` acceptance: "revocation invalidates the device's capabilities **and leases**") is real. **But over-severitized — see §3.**
- **F007** (grants survive invalidation): factually correct. `onDisable→revokeAll` (`approval-service.ts:103`), `invalidateEpoch` (`:351-354`), `close()` (`:423-443`), and `reconcileRestart()` all touch leases only, never `accept_edits_grants`; `requestFromGrant` (`:292-317`) never rechecks `policy.isAllowed`. **But over-severitized — see §3.**
- **F014** (missing browser/lint/format gates): **CONFIRMED.** `release-verify.mjs:30-43` gates are typecheck/tests/web-build/workspace-build/rollback/thresholds; `package.json` has no lint/format scripts; `009/spec.md` REQ-001 requires "Format, lint, … browser, security, chaos, and package checks." P1 defensible (it's a governance/traceability blocker, not a runtime security bug).
- **F010+P1-003** (stale canonical status): **CONFIRMED.** Parent `spec.md:12-25` still says "Draft", `completion_pct: 10`, blocker "implementation has not started," contradicting the live tree. Traceability P1; reasonable as release-blocking reconciliation.

## 3. Severity calibration — the core issue

The synthesis treats F006/F007 as "real P1 code bugs to fix now" while rejecting F001 as an accepted "unwired transport" gap. This is inconsistent: **`request`, `requestFromGrant`, and `consume` have zero production callers.** My grep shows they are invoked only from tests (`approval.test.ts`, `negative-controls.test.ts`, `kill-points/recovery.test.ts`), `rollback-drill.ts`, and an abstract `authorizer.consume` in `extensions/pi-remote-approval/src/index.ts:48` that is never bound to `ApprovalService` in production. Concretely:

- **No lease can ever be created in production** (only `list`/`decide`/`createAcceptEditsGrant` are reachable via HTTP). So F006's "device revocation fails to revoke leases" has *nothing to drain* today.
- **F007's surviving grants can never be exercised in production** (no `requestFromGrant` caller), and even if wired, `verifyFinalGate` rechecks `policyAllows` at consume (`final-gate.ts:33`, called from `consume` at `approval-service.ts:156-166`), and restart rotates the epoch (`index.ts:37`) so old-epoch grants are unusable.

**Required re-classifications:**
- **F007 → P2.** Latent grant-lifecycle gap in the unwired mutation path; final-gate recheck + epoch rotation contain it. Becomes P1 the moment live mutation transport is wired.
- **F006 → P2** (or explicitly "narrow scope OR fix," consistent with F001). Real REQ-006 contract gap, but latent until leases can be created. Must be fixed before mutation ships.
- **F011/P2-022** → keep REJECTED, but promote the `machineStatus` field rename to P2 (safety-critical ambiguity at near-zero cost).

This leaves **one defensible P1 code bug (F003)** and **two governance P1s (F014, F010)**, which is a materially lighter — and more accurate — release posture than "five real P1 blockers."

## 4. Missed issues

- **Triage inconsistency (the substantive miss):** Neither the deep-review nor the synthesis connected F006/F007 to the documented "mutation transport is not wired" gap. This is what drives both downgrades above — it's a triage error, not a new code defect.
- **Low-severity, low-confidence:** `requestFromGrant` (`approval-service.ts:316-321`) runs `UPDATE accept_edits_grants … WHERE remaining_actions = ?` but never checks `result.changes`; a non-matching CAS would still mint a lease. Not exploitable under better-sqlite3's synchronous single-threaded transactions, but a latent over-mint hazard worth a guard.
- **Observation (not a required change):** `pi.*` event payloads (`index.ts:141-145`) carry raw Pi event fields (message/tool output) that pass through only pattern-based redaction (`redaction.ts` key/pattern sets). This is documented as accepted in security.md ("Redaction is pattern-based, not a proof…"), so I do not flag it as a bug — but it sits oddly next to the headline "redaction before persistence and broadcast" claim and deserves an explicit cross-reference.

## 5. Remediation order

The proposed smallest-safe-first sequence is sensible *given the original severities*, but should be re-ordered to match the re-calibration: **F003 first** (the only shipped-feature break), then the two governance P1s (F014, F010), then F006/F007 as part of the mutation-path completion (or scope narrowing). F006/F007 do not need to gate the read-only release. The three-gate + `release:verify` + `check-rollout --require-ready` loop is correct.

## What I actually verified vs. took on trust

**Spot-checked in source:** `approval-service.ts`, `http/server.ts`, `index.ts`, `mutation-policy.ts`, `final-gate.ts`, `rpc/supervisor.ts`, `auth/auth-service.ts`, `auth/policy.ts`, `auth/enrollment.ts`, `store/relay-store.ts`, `store/redaction.ts`, `replay/sync.ts`, `web/cache.ts`, `web/auth.ts`, `web/state.ts`, `packages/pi-rpc-protocol/{guards,types}.ts`, `scripts/release-verify.mjs`, `scripts/check-rollout.mjs`, `release/rollout-gate.mjs`, `package.json`, and docs `security.md`, `rollback.md`, `release-verification.md`, plus `004/006/009` spec excerpts, parent `spec.md`, and the live `docs/` listing.

**Took on trust:** the low-risk spec-wording P2s I did not re-sum — P2-001 (81-vs-71 arithmetic), P2-011 (ADR mirror), P2-016 (continuity keys), P2-012 (compromise playbook), P2-013 (rollback task order), and the research-path items P2-018/P2-019, plus the "review-noise" rejections P2-002…P2-008, P2-010, P2-014, P2-017. These are documentation-level and their rejection rationales are consistent with what I did inspect.

**Confidence:** HIGH on the rejection evidence and on the F006/F007 downgrade logic (verified the production-caller gap directly); MEDIUM on the two low-severity "missed" observations.
