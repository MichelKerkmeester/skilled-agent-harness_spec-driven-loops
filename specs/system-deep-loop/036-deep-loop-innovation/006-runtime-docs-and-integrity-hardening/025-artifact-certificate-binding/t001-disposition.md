<!-- SPECKIT_LEVEL: 3 -->

# T001 — Confirm-Before-Build Disposition (Packet 025: Artifact & Certificate Binding)

> **AUTHORITATIVE build gate.** This document is grounded against origin `38dea5f1a5`
> (`skilled/v4.0.0.0` tip; the 024 fence/receipt primitives 025 depends on are present). It is a
> **read-only** confirm-first pass: no code was edited. Where this table and the `spec.md` §3
> "Findings in Scope" list disagree on a location or status, **this table governs** — it re-resolves
> every cited `file:line` at HEAD. All twelve findings are **CONFIRMED-REAL and GO-to-build**;
> none are REFUTED, ALREADY-FIXED, or purely NEEDS-DESIGN. Three design decisions (§3 below) must be
> settled before the corresponding fixes are written.

All paths below are relative to `.opencode/skills/system-deep-loop/runtime/lib/`.

---

## 1. Method & guarantees

- Every cited anchor was re-read at HEAD; the defective code is quoted per row. "Already-fixed" is
  definitively ruled out because the defect is present and quotable at HEAD in all twelve cases.
- Supporting types were read to validate each decoy: reference derivation (`qualified_digest`
  excludes `artifact_kind`), the sealed-payload parser, the council/deep-improvement artifact
  materials, and the origin-event binding type.
- Corroboration for F-007-01: the sibling `deep-ai-council-certificates.ts` `eventHeads` already
  builds heads from the **real** `event.frame.sequence`, proving the true sequence is exposed and the
  fix needs no new 024 primitive.
- Line numbers match the register anchors except **F-015-01** (anchor `460` is the function head; the
  real defect is the compare loop at `484-497` — noted drift, not a refutation).

---

## 2. Disposition table (12 / 12 CONFIRMED-REAL)

| Finding | Location @ HEAD (file:line) | Verdict | Evidence / decoy |
|---|---|---|---|
| **F-011-01** | `sealed-reference-artifacts/sealed-artifact-store.ts:680` (`deleteAuthorized`); `:721` (`restoreAuthorized`) | **CONFIRMED-REAL** | `deleteAuthorized` validates only shape — `isBoundedString(eventId) …ledgerId …isPositiveInteger(ledgerSequence) …DIGEST_PATTERN.test(ledgerRecordHash) …authorizedAt` (687-699) — then writes the tombstone from those fields and `rmSync`es reference/blob/descriptor (712-715); no ledger read. `restoreAuthorized` is weaker (only `eventId` bounded + `ledgerRecordHash` digest-shaped, 730). **Decoy:** a caller passes `{eventId:"x",ledgerId:"y",ledgerSequence:1,ledgerRecordHash:"<64 hex>",authorizedAt:"2026-…"}` with no matching ledger entry → object files deleted, tombstone cites a fabricated ledger position. **Fix needs design (§3b):** the store holds no ledger handle. |
| **F-011-02** | `sealed-artifact-store.ts:838` (and `:907`) | **CONFIRMED-REAL** | Verified reads call `this.#canonicalizers.describe(...)` (838, 907) — profile lookup only. `canonicalize()` runs **only** in `derive()` (506). The read checks `sha256Bytes(bytes) !== descriptor.content_digest` (929) but never re-runs the canonicalizer to prove the bytes are the canonical form. **Decoy:** a hand-crafted self-consistent triple (reference+descriptor+blob) whose `content_digest = hash(non-canonical bytes)` passes; `canonicalize(bytes)` would differ. Lowest-impact of the set (the digest forecloses random tampering; requires an operator/stale-file-crafted triple), but a real REQ-005 gap. |
| **F-011-03** | `deep-improvement-common-certificates/deep-improvement-common-certificates.ts` — offline verifier `verifyDeepImprovementCommonCertificateOffline` (1427-1636); anchor `1485` lands inside it | **CONFIRMED-REAL** | The offline verifier re-derives the verdict (1571) and checks `digest(certificate.body) === certificate.certificateDigest` (1578), but never re-derives the semantic identity fields the body emits — `lineageId, generation, evaluatorEpochId, candidateId, baselineId, canaryEpochId` (1201-1206), the six per-kind `*QualifiedDigest` pointers, `evaluatorPolicyDigest, budgetDigest, vetoEvidenceDigests` — from the verified artifact material. The epoch/lineage closure check (`candidateMaterial.lineageId !== input.lineageId …`) exists **only at issuance** (1179-1192), with no verifier counterpart. **Decoy (US-002):** an issuer emits a validly-signed body with `candidateId:"false"` (≠ the sealed candidate material's `candidateId`); `digest(body)==certificateDigest` and the signature verify; no field re-derivation catches the false binding. Violates NFR-V01. |
| **F-011-04** | `deep-alignment-certificates/deep-alignment-certificates.ts:717` (LANE_CONFIGURATION case, 717-724; four-stem OR at 721-724) | **CONFIRMED-REAL** | `return (typeof scope?.laneId==='string' && material.laneId===scope.laneId) \|\| stem==='deep_alignment.run_initialized' \|\| …'scope_resolved' \|\| …'dimension_ordered' \|\| …'lane_completed';` — for those **four** stems it returns `true` with no lane and no digest comparison (only the top guard `material.authorityEpochId === scope?.authorityEpochId` at 701 applies). **Decoy:** a LANE_CONFIGURATION artifact for lane "A" corresponds to a `lane_completed` event for lane "B" (same authority epoch). Peer cases (RULE_MANIFEST, TARGET_SNAPSHOT, APPLICABILITY_DECISION) do bind digests/lane — this case is the outlier. |
| **F-015-01** | `sealed-reference-artifacts/artifact-events.ts` — `readVerifiedArtifactEvidence` (455); defective compare loop `484-497` (**anchor `460` = fn head; real defect `484-497`**) | **CONFIRMED-REAL** | Filter matches on `payload.reference.qualified_digest` only (463-467); `qualified_digest = qualifiedDigest(digest_algorithm, content_digest)` (`sealed-artifact-store.ts:547`) — **excludes `artifact_kind`**. The conflict check compares only `payload.descriptor_digest` and `payload.reference.qualified_digest` (487-488), never the complete reference (`sameReference`). `parseArtifactSealedPayload` forces `payload.descriptor_digest = reference.descriptor_digest` (300), but the embedded `payload.reference.artifact_kind` is a **free field** not bound to that digest. **Decoy:** an event whose `payload.reference` copies the requested `qualified_digest` + `descriptor_digest` but sets `artifact_kind:"EVIL"` is returned as `sealedEvent`/`receipt` creation evidence. |
| **F-015-02** | `deep-review-certificates/deep-review-certificates.ts:602` (`artifactCorrespondsToEvent`, 602-618) | **CONFIRMED-REAL** | Entire correspondence: `stem in DeepReviewWireEventTypes && …===envelope.event_type && material.eventStem===stem && material.eventId===envelope.event_id && material.authorityEpoch===envelope.authority_epoch`. **No content digest at all** (contrast the deep-alignment/council versions, which switch per-kind on `material.*Digest===data.*Digest`). **Decoy:** any sealed artifact whose material copies `{eventStem,eventId,authorityEpoch}` of a real event satisfies correspondence regardless of content → passes issuance and offline verification. |
| **F-007-01** | `deep-improvement-common-certificates.ts:1026` (mode cert `result_head`); transition heads `unsignedSharedReceipt` `357-366` | **CONFIRMED-REAL** | Mode cert: `result_head: head('authorized-ledger', body.receiptDigests.length, body.finalHeadHash)` (1026). Transition receipt: `fromHead = head(…, Math.max(0, attemptNumber-1), …)`, `resultHead = head(…, attemptNumber, …)` (357-366), where `attemptNumber = input.attemptNumber` (536) is a retry counter, not a ledger position. **Verifier re-derives the same synthetic values:** `unsignedSharedReceipt(expected,…)` (1341) and `certificateUnsignedReceipt(certificate.body,…)` (1596) rebuild those heads from `attemptNumber`/`receiptDigests.length`, then `verifyShared` validates the signature → valid for a false sequence. The record_hash *is* real (heads bind `frame.record_hash`/`prev_record_hash`; 1557-1566 check them) — only the integer sequence is false. **024-dependency: NO** — the true sequence is already exposed (`resultEvent.frame.sequence`, used at 507/519; `coveredEvents.at(-1).frame.sequence`) and the sibling council `eventHeads` (412-427) already uses it. |
| **F-007-02** | `deep-improvement-common-certificates.ts:630` (`assertArtifactOrigin`, 630-644) | **CONFIRMED-REAL** (exact binding target is a minor design choice) | `const origin = verified.material.originEvent; const event = findEvent(ledgerEvents, origin.eventId); const payload = eventPayload(event); if (payload.stem !== origin.eventStem \|\| payload.payloadDigest !== origin.payloadDigest) throw`. Binding type is `{eventStem,eventId,payloadDigest}` (`sealed-artifact-types.ts:68-72`) — no scope. The check resolves a named event by id + stem + self-reported `payloadDigest`, but never binds the origin event to **this artifact's own identity** (`verified.binding.reference.qualified_digest`) nor verifies the event actually sealed this artifact. **Decoy:** artifact A names `originEvent = {eventId: E_b, stem: S, payloadDigest: D_b}` where `E_b` is a *different* artifact B's event (same stem/payloadDigest in range) → A's origin "validates" against B's event. `findEvent` confines it to the covered range (cross-run blocked), but cross-artifact within the run is not. |
| **F-007-03** | `model-benchmark-reducers/model-benchmark-reducer.ts:480` (`score_vector_observed` → `assertSource`, 478-491) | **CONFIRMED-REAL** | `assertSource(state, typed.observationEventId, ['model_benchmark.trial_observation_recorded'], typed.observationPayloadDigest, …)`. `assertSource` (377-395) checks only existence + stem ∈ expected + `payloadDigest` match — **no trial/candidate ownership**. The cell state-machine advances *this* score's trial `observed→scored` (295-360), but nothing ties `typed.observationEventId` to that trial's `rawObservationEventId`. **Decoy:** a score for candidate A's trial cites `observationEventId` of candidate B's `trial_observation_recorded` (copying B's `observationPayloadDigest`) → accepted. Violates REQ-007. |
| **F-006-03** | `deep-ai-council-reducers/deep-ai-council-reducer.ts:651` (`assertProposalReferences`, 646-659) | **CONFIRMED-REAL** | `const captured = new Set(proposals.map(p => p.proposalId)); if (proposalIds.some(id => !captured.has(id))) throw`. Membership is over **all** proposals across **all** rounds; `proposal.roundId` exists (639-641) but is never used. Callers pass `payload.data.sourceProposalIds` from a `critique_round_started` that carries `payload.scope.roundId` (676), yet roundId is never passed in. **Decoy:** a critique in round R2 cites `sourceProposalIds` from round R1's proposals → accepted. Violates REQ-006 (cross-round). |
| **F-006-04** | `deep-ai-council-certificates/deep-ai-council-certificates.ts:454` (`sourceRangeMatchesEvent`); `artifactCorrespondsToEvent` `466-544` | **CONFIRMED-REAL** | Correspondence binds `sourceEventRange.lastEventId`, `lastStem`, `material.authorityEpoch`, and per-kind `material.materialDigest===data.*Digest`, but **never reads `material.scope.runId`/`scope.roundId` nor `event.payload.scope`**. The material *has* `scope.{runId,roundId,artifactId}` (`deep-ai-council-artifact-material.ts:94,209-210`). Reads use `readDeepAiCouncilArtifact(store, binding)` — 2-arg, no expected scope (1213, 1658) — so scope isn't bound there either. Certificate-level run/round is checked only for the *projection* (1922-1923), not per-artifact. **Decoy:** an artifact sealed under a different run/round is admitted to the closure if its `sourceEventRange.lastEventId` names an in-range event. Violates REQ-006 (cross-run). |
| **F-005-01** | `deep-research-reducers/deep-research-reducer.ts:2106` (`foldDeepResearchEvents`, gap check 2106-2120) | **CONFIRMED-REAL** | The `cursor-gap` contiguity check is gated `if (checkpoint !== undefined && options.requireContiguousTail !== false)` (2106). When `checkpoint === undefined` (initial replay) the block is skipped and folding proceeds unconditionally (2121-2122). **Decoy:** fold `[stream_sequence 1, 3]` (missing 2) with no checkpoint → returns `outcome:'projected'` today; must be `rebuild_required`. Violates REQ-008. |

---

## 3. Design decisions that MUST precede the fixes

### (a) Shared binding-validator core + shared primitives — RECOMMENDED (aligns with ADR-001 / R-002)

The four emitters each own an emitter-specific `artifactCorrespondsToEvent` switch (deep-alignment binds
`ruleIrDigest`/`subjectDigest`; council binds `critiqueArtifactDigest`/`contentDigest`; etc.). Those
per-kind field→event-data mappings are irreducibly local and cannot be generic. But the *universal
invariants* each finding restores are the same four rules, and each emitter is the lone violator of one:

- content-digest-required — deep-review is the violator (F-015-02),
- scope-required — council is the violator (F-006-04),
- exact re-derivation of emitted body fields — deep-improvement offline is the violator (F-011-03),
- no issuer-invented values — deep-improvement heads is the violator (F-007-01; council already does this right).

**Recommendation:** one shared binding-strength core plus shared primitives — `sameReference` for the
sealed store (F-015-01), and a **re-derive-and-compare-fields** helper **driven by per-emitter field
lists as DATA** — with each emitter keeping its local per-kind correspondence map as input to that core.
Every finding is independently buildable, but building the F-011-03 / F-015-02 / F-006-04 / F-007-01
fixes without settling this risks twelve divergent binding definitions (R-002).

### (b) F-011-01 — ledger injection into the sealed store

The sealed store holds **no ledger handle**; `deleteAuthorized`/`restoreAuthorized` receive only the
authorization object. Resolving the authorization against the ledger requires either injecting the 024
authorized-ledger into `SealedArtifactStore`, or resolving the authorization at the call site before
invoking the store. Decide the seam before writing the fix.

### (c) F-007-01 — issuer-vs-verifier ordering

The true sequence is **already exposed** (`frame.sequence`); no missing 024 primitive is involved. The
fix swaps **both** the issuer (`unsignedSharedReceipt` heads and the mode `certificateUnsignedReceipt`
`result_head`) **and** the verifier (which re-derives via the same two helpers) from
`attemptNumber`/`receiptDigests.length` to `frame.sequence`. Both sides must change together to keep
already-issued signatures coherent — decide the landing order (open question 2 in `spec.md` §12) before
Phase 3.

---

## 4. 024-dependency flags and threat calibration

**024-dependency flags.** Only **F-011-01** leans on 024's landed authorized-ledger for its *fix* (§3b —
the store has no ledger handle). **F-007-01 does NOT need any missing 024 primitive** — the true
`frame.sequence` is already exposed and already used correctly by the council `eventHeads` (412-427); the
fix is a mechanical issuer+verifier swap. The other ten are self-contained local binding fixes.

**Threat calibration (carry verbatim, do not re-escalate).** Every confirmed case is
**cutover-readiness and robustness risk, not breach risk**: in each the actor is the operator or a stale
local file, not a remote attacker. The decoys above are hand-crafted-artifact / hand-crafted-event
scenarios, not network attacks. A finding's P0/P1 severity label is not a licence to treat it as a
security incident.

---

## 5. Acceptance per finding

Per REQ-U03, acceptance for each confirmed finding is a **decoy or forgery NEGATIVE test** — a test that
**passes (the decoy is accepted) before the fix and fails (the decoy is rejected) after** — never a green
suite alone. Each row's "Decoy" clause names the exploit the negative test must encode. Suggested homes
(from `spec.md` §3 test files):

- F-015-02 → `tests/unit/deep-review-certificates.vitest.ts` (decoy artifact with copied metadata).
- F-011-03 / F-007-01 / F-007-02 → `tests/unit/deep-improvement-common-certificates.vitest.ts`
  (false-binding certificate; false ledger position; cross-artifact origin).
- F-011-04 → `tests/unit/deep-alignment-certificates.vitest.ts` (unrelated four-stem lifecycle event).
- F-006-04 → `tests/unit/deep-ai-council-certificates.vitest.ts` (cross-scope certificate).
- F-011-01 / F-011-02 / F-015-01 → sealed-store / artifact-events unit suites.
- F-006-03 → council reducer suite; F-007-03 → model-benchmark reducer suite; F-005-01 → deep-research
  reducer suite.

---

## Bottom line

12 / 12 **CONFIRMED-REAL**, all **GO-to-build**; zero REFUTED, zero ALREADY-FIXED. Line anchors match
HEAD except F-015-01 (fn head vs real defect at 484-497). Settle the three design decisions in §3 —
shared validator core, F-011-01 ledger injection, F-007-01 issuer/verifier swap order — before writing
the corresponding fixes.
