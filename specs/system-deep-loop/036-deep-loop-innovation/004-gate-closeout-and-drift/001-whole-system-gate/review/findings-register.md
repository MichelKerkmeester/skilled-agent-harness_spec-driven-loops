# Findings Register — pre-cutover validation gate

Every finding from the 40-iteration review, with its evidence and recommended
action. Generated from the reducer-owned findings registry, which remains the
source of truth; regenerate rather than hand-edit.

**Read `review-report.md` first.** It carries the verdict, the four cutover
blockers, and the three calibration classes without which these counts mislead —
most importantly that severity here marks whether a bad outcome is *possible*, and
in every case verified the actor was the operator or a stale local file, not a
remote attacker. Read severity as cutover-readiness risk, not breach risk.

## Legend

- **CONFIRMED / CONFIRMED-*** — checked against the code by the orchestrator, not just reported by a leaf. 13 of 13 checked held up.
- **CUTOVER BLOCKER** — belongs to one of the four mechanisms that block the authority cutover.
- Unmarked findings are leaf-reported and unverified: treat as hypotheses with cited evidence, and confirm before acting.

## Totals

166 findings — 36 P0 · 104 P1 · 26 P2

| Dimension | Count |
|---|---|
| correctness | 62 |
| maintainability | 39 |
| traceability | 38 |
| security | 27 |

| Module | Count |
|---|---|
| `runtime/lib` | 64 |
| `runtime/scripts` | 27 |
| `deep-improvement/scripts` | 10 |
| `deep-alignment/scripts` | 10 |
| `commands/deep` | 7 |
| `specs/system-deep-loop` | 6 |
| `deep-research/README.md` | 4 |
| `deep-alignment/README.md` | 3 |
| `deep-ai-council/scripts` | 3 |
| `deep-ai-council/README.md` | 3 |
| `deep-improvement/assets` | 3 |
| `runtime/tests` | 3 |
| `README.md` | 2 |
| `deep-review/manual-testing-playbook` | 2 |
| `deep-alignment/assets` | 2 |

---

# P0 — 36 findings

## `.codex/agents` (1)

### F-028-01 — Codex ai-council conversion loses the no-shell and scoped-write boundary

`.codex/agents/ai-council.toml:5` · traceability

**Evidence.** The Codex agent runs with sandbox_mode = "workspace-write", while the source agent denies bash at .opencode/agents/ai-council.md:10 and states that it never runs shell commands or writes outside packet-local ai-council artifacts at lines 27 and 31. The generated body still says Bash is denied, but the runtime setting permits workspace mutation; sync-agents.cjs hardcodes this mode for ai-council instead of deriving the source deny.

**Recommended action.** Preserve the per-agent deny boundary in the Codex runtime or execute the agent behind a host-enforced packet-scoped writer. Do not rely on the embedded prose to prevent shell or out-of-scope mutation.

## `commands/deep` (3)

### F-016-01 — Fanout shell wrappers interpolate unescaped attacker-controlled values

`commands/deep/assets/deep-research-auto.yaml:165` · security · **CONFIRMED-SEVERITY-CALIBRATED**

**Evidence.** The command block inserts --spec-folder {spec_folder}, --research-topic "{research_topic}", --fanout-config-json '{config.fanout_json}', and --base-artifact-dir {artifact_dir} directly into a shell command. fanout-run.cjs only trims researchTopic before use; it does not receive these values until after shell parsing. A topic containing a quote followed by shell syntax, or JSON containing a single quote, can escape the intended argument and execute arbitrary commands. The same construction appears in the confirm and review wrappers.

**Recommended action.** Invoke fanout-run through structured argv/execFile. Pass JSON and topic data through stdin or a file where possible. If shell execution is unavoidable, apply real shell quoting to every placeholder and reject control characters in namespace and path fields.

**Verification.** Structurally confirmed: deep-research-auto.yaml ~164-171 interpolates {spec_folder}, "{research_topic}", '{config.fanout_json}' and {artifact_dir} directly into a shell command; deep-review-auto.yaml ~187-188 uses the identical construction. Quoting is breakable (a double-quote in the topic, a single-quote inside the JSON, a space/semicolon in an unquoted path). CALIBRATION: all these values are operator-supplied, not remote — realistic failure is a broken or unintended dispatch from ordinary punctuation, not external RCE. Fix = pass argv without a shell, or escape at interpolation.

### F-021-01 — Autonomous model benchmark fabricates promotion approval

`commands/deep/assets/deep-model-benchmark-auto.yaml:198` · security

**Evidence.** The workflow declares approvals: none at line 15, but its unconditional step_promote_candidate has no condition and invokes promote-candidate.cjs with --approve. promote-candidate.cjs treats the presence of that flag as approval and directly copies the candidate over the target in its default promote phase.

**Recommended action.** Make autonomous mode advisory-only, or require a separately supplied, candidate- and target-bound operator approval receipt before invoking promotion. Never synthesize --approve from workflow execution mode.

### F-RES-01 — Workflow marks a run complete without requiring the reducer to have sealed it

`commands/deep/assets/deep-alignment-auto.yaml:770` · correctness · **CONFIRMED**

**Evidence.** Synthesis sets config status complete (auto:770,785; confirm:429,444) without checking the reducer output sealed===true. The reducer refuses to seal an integrity fault (reduce-alignment-state.cjs:641) but exits successfully with sealed:false, so both workflows can still mark and present that run as complete. Completed sessions also bypass convergence entirely (auto:194; confirm:186).

**Recommended action.** Gate status complete on the reducer reporting sealed===true. Config status must never assert more than the registry proves.

**Verification.** Found by the final adversarial verification of the alignment coverage fix; recorded as a documented residual rather than fixed in this session.

## `deep-ai-council/scripts` (2)

### F-019-01 — Council writer scopes writes relative to an attacker-chosen root

`deep-ai-council/scripts/lib/persist-artifacts.cjs:532` · security

**Evidence.** councilRootFor() applies path.resolve(packetSpecFolder) and only verifies that packetRoot/ai-council is inside that caller-selected packetRoot. The CLI accepts packetSpecFolder as its first positional argument at lines 918-950 and writeArtifacts() creates packetRoot and aiCouncilRoot at lines 656-662. orchestrate-session.cjs independently accepts --packet-spec-folder or executor/session JSON and path.resolve()s it without checking an approved specs root, so workflow-controlled persistence can create or overwrite ai-council artifacts anywhere writable.

**Recommended action.** Centralize packet-root authorization using a canonical realpath containment check against registered worktree .opencode/specs and specs roots. Reject missing, symlinked, non-spec, temporary, or external roots before any mkdir, lock, heartbeat, registry, or artifact write.

### F-019-02 — Council topic identifiers traverse outside the packet

`deep-ai-council/scripts/orchestrate-topic.cjs:48` · security

**Evidence.** normalizeTopicId() only trims and checks non-emptiness. roundStatePath() at lines 115-116 inserts topicId directly into path.join(packetSpecFolder, 'ai-council', 'topics', topicId, ...), and line 340 passes the unchecked value to appendRoundStateRecord(). session-state-hierarchy.cjs:182-189 validates only that topic_id is a string, while round-state-jsonl.cjs:280-292 recursively creates the resulting parent and appends the state record. A session topic_id containing ../ segments therefore escapes ai-council/topics and causes an unauthorized write.

**Recommended action.** Require topic IDs to match a conservative stable-ID grammar, reject separators, dot segments, absolute paths, control characters, and platform-specific separators, then canonicalize the final state path and prove it remains below the authorized ai-council/topics root immediately before mkdir and append.

## `deep-alignment/scripts` (2)

### F-009-01 — Missing or corrupt corpus becomes 100% coverage

`deep-alignment/scripts/check-convergence.cjs:107` · correctness · **CONFIRMED**

**Evidence.** readCorpusSizes() returns an empty object when the corpus file is absent or JSON parsing fails. computeArtifactCoverage() then assigns coverage 1 when discoveredArtifactCount is zero, allowing malformed or missing discovery evidence to satisfy convergence instead of producing an integrity fault. reduce-alignment-state.cjs mirrors the same fail-open corpus loading behavior.

**Recommended action.** Represent unavailable or malformed corpus data as an explicit integrity failure. Permit zero-artifact coverage only when a valid, schema-checked corpus proves that the lane discovered zero artifacts.

**Verification.** check-convergence.cjs readCorpusSizes:107 returns {} on absent file OR JSON parse failure; computeArtifactCoverage:135-144 then skips every lane (laneDiscovered===0 -> continue) leaving discovered=0, and coverage = discovered>0 ? checked/discovered : 1.0 -> 1.0. Internal contradiction: readCorpusSizes docstring promises degrade-to-not-covered, math yields trivially-covered. Mitigation: AND-gated with stability window (fails closed under window size).

### F-009-04 — Live-render adapter passes without render evidence

`deep-alignment/scripts/adapters/sk-design-live-render.cjs:465` · correctness

**Evidence.** check() accepts a renderResult whose only meaningful field is dispatchedThrough equal to sk-design-mcp-open-design. Missing measurements and judgment findings produce no findings, and renderedAt is optional, so a caller-supplied dispatch string with no captured render evidence returns a clean result.

**Recommended action.** Require a receipt-bound render result tied to the target and current execution, plus mandatory evidence or an explicit evidence-completeness verdict. Fail closed when timestamps, measurements, judgment output, or ownership binding are absent.

## `deep-improvement/scripts` (5)

### F-017-01 — Promotion accepts evaluator receipts for a different artifact

`deep-improvement/scripts/shared/promote-candidate.cjs:455` · security · **CONFIRMED-WITH-MITIGATION**

**Evidence.** The helper reads score and benchmark JSON, then checks status, recommendation, numeric thresholds, and dimensions at lines 486-606, but never verifies score.candidate, score.target, score.inputHash, or the current candidate hash. The candidate is only checked for existence at line 550 before being copied at lines 716-718; benchmark mode checks only benchmarkReport.target.

**Recommended action.** Require exact resolved candidate and target identity plus recomputed content hashes in every score and benchmark receipt. Reject stale, cross-candidate, cross-target, or unsigned evidence.

**Verification.** Benchmark report IS target-bound (benchmarkReport.target!==target fails; plus profileId and config.target checks). Score receipt is NOT: grep shows zero checks on score.candidate/score.target/score.inputHash; only score.status===scored is gated. candidateHash at :242 belongs to the ship path against mutable acceptedState, not a score->candidate binding. Realistic failure mode is a STALE score from an earlier candidate revision authorizing promotion of a newer unscored candidate — live risk since promotion copies bytes into canonical targets.

### F-017-02 — Promotion has no candidate or artifact-output containment

`deep-improvement/scripts/shared/promote-candidate.cjs:550` · security

**Evidence.** The candidate path is accepted from CLI or acceptance state and only checked with fs.existsSync. The write-boundary check at lines 572-579 protects the canonical target only; candidate, archiveDir, acceptance-file, event-log, and state-file paths are not constrained. Lines 658 and 716-718 then copy arbitrary readable candidate bytes into the canonical target.

**Recommended action.** Resolve and contain candidates beneath the packet-local candidates directory, require regular non-symlink files, and contain every archive, receipt, journal, and state output beneath the packet runtime.

### F-017-03 — Ship trusts a caller-forged acceptance receipt

`deep-improvement/scripts/shared/promote-candidate.cjs:157` · security

**Evidence.** Acceptance state is plain JSON written at line 201 and later loaded from a caller-selected path. Ship verifies only status and hashes stored inside that same mutable JSON at lines 205-248; score, benchmark, repeatability, config, manifest, target, and candidate paths remain mutable pointers. A forged state can set preAcceptTargetHash to the current target hash, candidateSnapshotPath to arbitrary content, candidateHash to that content's hash, and point to fabricated passing gate files before line 706 copies it into the canonical target.

**Recommended action.** Use an authenticated, append-only acceptance receipt binding all evidence digests, paths, target preimage, candidate snapshot, evaluator epoch, and approval identity. Ship must consume that receipt without allowing path overrides.

### F-017-04 — Rollback hash guard is bypassable through the candidate-hash alternative

`deep-improvement/scripts/shared/rollback-candidate.cjs:177` · security

**Evidence.** expectedRollbackSourceHashes accepts both preAcceptTargetHash and candidateHash, and line 210 permits the current target to match either hash. An attacker can forge an acceptance file with preAcceptTargetHash equal to an arbitrary backup's digest and candidateHash equal to the current target's digest; lines 201-214 then pass and line 269 copies the arbitrary backup over the canonical target. The acceptance JSON itself has no authenticity check.

**Recommended action.** Require a trusted acceptance receipt, bind backup path and digest to the recorded preimage, require the current target to equal only the recorded promoted-candidate hash, and reject caller-authored hash alternatives.

### F-017-05 — Candidate controls evaluator identity and derived rubric

`deep-improvement/scripts/agent-improvement/score-candidate.cjs:535` · security

**Evidence.** The scorer generates the profile from the candidate itself, then sets agentName to profile.id at line 549. generate-profile derives id from candidate frontmatter name and derives structural, rule, output, and integration checks from that same file. scan-integration uses the attacker-selected name to inspect existing canonical and mirror files, so a candidate can impersonate a well-integrated agent while authoring the checks it is scored against.

**Recommended action.** Freeze the evaluator profile and rubric from the canonical target or trusted configuration before candidate generation. Bind evaluator identity to the manifest target basename and scan integration against the canonical target identity, not candidate-authored metadata.

## `runtime/lib` (14)

### F-011-01 — Public deletion and restoration cutovers trust unverified authorization objects

`runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts:680` · correctness

**Evidence.** deleteAuthorized reads the artifact, then validates only the shape of authorization.eventId, ledgerId, ledgerSequence, ledgerRecordHash, and authorizedAt before copying those caller-supplied values into a tombstone and removing the reference, blob, and descriptor at lines 686-715. restoreAuthorized similarly checks only eventId and ledgerRecordHash at lines 730-739; it never resolves either authorization against an AppendOnlyLedger or verifies the exact lifecycle event, action, and reference.

**Recommended action.** Make these filesystem cutovers private or require a verified ledger receipt/proof. Validate the durable event type, exact artifact reference, lifecycle action, ledger identity, sequence, record hash, and authorization before mutating storage.

### F-011-03 — Common offline certificates leave semantic artifact identity fields unchecked

`runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts:1485` · correctness

**Evidence.** The offline verifier rereads artifactClaims and checks only the recomputed claims and artifactSetDigest at lines 1485-1506. It re-derives the promotion verdict at lines 1567-1576, then verifies the body digest and certification receipt at lines 1578-1607, but never reads or compares body.evaluatorEpochId, candidateId, baselineId, canaryEpochId, evaluatorCapsuleQualifiedDigest, candidateInputQualifiedDigest, baselineInputQualifiedDigest, rawObservationQualifiedDigests, canaryEpochQualifiedDigest, promotionEvidenceQualifiedDigest, evaluatorPolicyDigest, budgetDigest, or vetoEvidenceDigests. These fields are emitted into the certificate body at lines 1203-1229, so a syntactically valid signed certificate can carry false semantic bindings and still return valid.

**Recommended action.** Re-derive every semantic body field from the verified typed artifact materials, projection, and closure map, then compare the complete derived body before accepting the certificate.

### F-013-01 — Standalone readiness gates do not bind sealed artifacts to the verified certificate

`runtime/lib/deep-research-rollback-gate/mode-gate.ts:389` · correctness

**Evidence.** `evaluateSealed` verifies caller-supplied bindings and returns their digests at lines 389-410, while `evaluateCertificates` independently accepts any offline-valid certificate bundle at lines 443-484. The final readiness certificate copies `sealed.artifactDigests` at line 739 and the separately verified `runCertificateDigest` at line 744, without comparing the sealed digest set to the certificate's `artifactClaims` or `artifactSetDigest`.

**Recommended action.** Require exact equality between the verified sealed-artifact set, certificate artifact claims, artifact-set digest, and semantic run or lineage identity before issuing readiness. Apply the same binding in deep-review, deep-ai-council, and deep-alignment gates.

### F-013-02 — Standalone rollback switches trust an unbound allow decision

`runtime/lib/deep-research-rollback-gate/rollback-switch.ts:263` · correctness

**Evidence.** The request is validated against mode, authority epoch, and evidence digest at lines 231-235, but after gateway authorization the switch only checks `authorization.verdict` at lines 263-270. It never compares the returned decision's mode, authority epoch, evidence digest, or request digest with the prepared request before using those returned fields to build the rollback certificate at lines 293-314. The same omission exists in the deep-review, deep-ai-council, and deep-alignment switches.

**Recommended action.** Reject any allow response whose decision identity does not exactly match the prepared request, including mode, epoch, evidence digest, request digest, and decision correlation, before acquiring a fence or issuing a certificate.

### F-014-01 — Ledger append can bypass the fencing-token boundary

`runtime/lib/authorized-ledger/append-only-ledger.ts:298` · security · **CONFIRMED · CUTOVER BLOCKER**

**Evidence.** AppendOnlyLedger.appendAuthorized accepts only an EventWritePreflight and GatewayAllowProof. Its locked verification checks the decision's event, prior head, expiry, authority state, and authority epoch, but never requires or checks a FencedLease or the ledger resource's durable fencing-token high-water mark. FencedLedgerWriter.append is only a separate optional wrapper, and the protected-surface manifest merely names it as a direct replacement. Therefore, after a successor lease is granted but before it changes the ledger head, a superseded writer holding an unexpired proof can call appendAuthorized directly and commit despite its stale fencing token.

**Recommended action.** Make the fenced append gateway the only exported domain mutation capability. Bind the ledger resource identity and fencing token into the authorization request, durable decision, audit frame, domain frame, and proof; revalidate the token against the coordinator high-water mark inside the same protected commit boundary.

**Verification.** append-only-ledger.ts has ZERO matches for fenc|lease|token|highWater — appendAuthorized enforces decision/head/expiry/authority-epoch but nothing fencing-related. Fencing is opt-in via the separate FencedLedgerWriter wrapper, so a superseded writer holding an unexpired allow proof can append directly. CALIBRATION: in-process API gap, not an externally reachable exploit while dark; becomes a real corruption vector at cutover when this ledger is authoritative under multi-writer leases.

### F-014-02 — Caller-controlled identity strings can forge writer authority

`runtime/lib/authorized-ledger/transition-authorization-gateway.ts:113` · security

**Evidence.** isTransitionRequest treats actorId and capabilityId as authorized inputs when they are merely bounded non-empty strings, and requestEvaluationInput forwards them directly to the policy evaluator. evidenceDigest is likewise caller-supplied without evidence verification. AuthorizationGatewayOptions supplies only an authorityProvider for mode state and epoch; it has no trusted principal or capability verifier. A caller can therefore copy identifiers accepted by a policy and obtain a durable allow decision without proving possession of that identity or capability.

**Recommended action.** Resolve the principal and capabilities from a trusted, unforgeable credential outside the request payload. Verify its signature, audience, scope, expiry, authority epoch, and fencing token, then bind the verified credential digest and principal identity into the decision and append proof.

### F-014-03 — Policy identity omits captured authorization state

`runtime/lib/authorized-ledger/transition-policy-registry.ts:97` · security

**Evidence.** registerPolicy computes implementationDigest from Function.prototype.toString.call(definition.evaluate) and derives the policy digest from that source string plus declared metadata. Captured closure values, environment-derived configuration, mutable allowlists, and imported mutable state are absent. An evaluator closing over a Set can have that Set changed to authorize another actor while retaining the same policy digest; authorization replay invokes the same current evaluator, so it can also report parity under the unchanged supposedly immutable policy identity.

**Recommended action.** Require policy definitions to include a canonical, immutable configuration or authority-material digest and incorporate it into the registry digest. Reject evaluators whose authorization result depends on unbound ambient or mutable state, and replay against the exact sealed policy artifact referenced by the decision.

### F-015-01 — Creation evidence accepts a different full reference sharing partial digests

`runtime/lib/sealed-reference-artifacts/artifact-events.ts:460` · security

**Evidence.** readVerifiedArtifactEvidence filters sealed events only by payload.reference.qualified_digest at lines 461-466, then checks only descriptor_digest and qualified_digest at lines 483-495. It never compares the complete event reference with the requested reference. A ledger event can copy those two digests while changing artifact_kind or canonicalization_version; the subsequent store read verifies the requested reference, so the unrelated event is returned as its creation evidence.

**Recommended action.** Require canonical equality of the complete parsed event reference and requested reference. Prefer additionally resolving the event reference through the store and checking its descriptor before accepting the event as creation evidence.

### F-015-02 — Deep Review certificates bind artifacts to events using metadata only

`runtime/lib/deep-review-certificates/deep-review-certificates.ts:602` · security

**Evidence.** artifactCorrespondsToEvent compares only the event stem, event ID, and authority epoch at lines 607-617. It does not compare the artifact's report, delta, claim, convergence, dependency, or content digests with fields in the ledger event. Both requireArtifactEventCorrespondence at lines 906-945 and assertArtifactEventsAuthorized at lines 1279-1291 rely on this predicate, so a newly sealed decoy artifact carrying copied event metadata can satisfy issuance and offline verification against a legitimate event.

**Recommended action.** Define a closed per-event-stem correspondence map that recomputes every load-bearing artifact identity from the typed ledger payload, including named digests and dependency closure. Reject artifacts when the event lacks an exact digest commitment instead of accepting metadata-only correspondence.

### F-018-01 — Stale lock reclamation can move a refreshed lock without identity verification

`runtime/lib/deep-loop/loop-lock.ts:274` · security

**Evidence.** `acquireLoopLockFileOnly` reads the holder and evaluates staleness at lines 431-434, then `tryReclaimStaleLoopLock` unconditionally executes `renameSync(lockPath, reclaimPath)` at line 277 before writing the successor lock. It never compares the claimed file's acquire nonce, owner, or inode with the stale observation. A heartbeat can replace the stale file with a fresh lock between those operations, after which the reclaimer moves the fresh lock and installs a competing owner.

**Recommended action.** Bind reclamation to the expected nonce and filesystem identity. After claiming, verify the nonce/inode and stale state; restore and retry when they differ.

### F-018-02 — Lock release can delete a successor after a stale identity check

`runtime/lib/deep-loop/loop-lock.ts:705` · security

**Evidence.** `releaseLoopLock` reads the current lock and validates `lockIdentityMatches` at lines 705-708, then performs an unconditional `unlinkSync(lockPath)` at line 711. A successor can reclaim and publish a new lock between the read and unlink, causing the old owner to remove the successor's lock and allowing a third owner to acquire while the successor is still active.

**Recommended action.** Release by atomically renaming the expected lock to a private claim path, then verify its nonce/inode before deletion. Do not unlink the shared path after a separate identity read.

### F-018-03 — Branch worker side effects are not fenced for the lease lifetime

`runtime/lib/branch-leases-waves/durable-orchestrator.ts:675` · security

**Evidence.** `runAuthorizedWave` acquires a branch lease with a caller-supplied TTL at lines 631-642, then invokes arbitrary `options.worker` at line 675. Only later ledger mutations are routed through `#appendRecord` and `withFences`; there is no lease renewal or side-effect gateway covering the worker execution. If the worker outlives the TTL, a successor can acquire the branch and run concurrently while the stale worker continues mutating state.

**Recommended action.** Keep the lease renewed for the worker lifetime and require actual worker mutations to use a lease-bound fenced effect gateway. Abort or reject effects once the lease is lost; do not rely on post-worker ledger commits to fence earlier side effects.

### F-RES-04 — Alignment artifact coverage is self-attested — audit execution is never proven

`runtime/lib/deep-loop/leaf-artifact-writer.ts:145` · correctness · **CONFIRMED**

**Evidence.** Neither the reducer nor the leaf writer proves that claimed canonical paths were actually audited or even belonged to the dispatched slice; the writer only verifies artifactsChecked is an array (leaf-artifact-writer.ts:145-160). Corpus membership is enforced, audit execution is not. A leaf claiming the entire canonical corpus therefore obtains full identity-verified coverage. This is the same fabrication mode observed live this session when a fanout lineage emitted formally-valid iteration artifacts it had not earned.

**Recommended action.** Bind coverage claims to evidence of work: restrict credit to the dispatched slice, and require per-artifact evidence (a finding, a content digest, or an adapter check receipt) before an identity counts as audited.

**Verification.** Found by the final adversarial verification of the alignment coverage fix; recorded as a documented residual rather than fixed in this session.

### F-039-01 — Reported finding counts can disappear before verdict reduction

`runtime/lib/deep-loop/leaf-artifact-writer.ts:145` · correctness

**Evidence.** validateReported requires findingsCount only by field presence and validates neither its numeric shape nor equality with findingDetails/deltaFindings. Lines 228-237 then permit an empty delta when findingDetails is absent. reduce-alignment-state.cjs lines 396-404 and 450-465 derive blockers exclusively from structured finding rows, never findingsCount, so a payload with findingsCount:1, full artifactsChecked coverage, and no details is accepted and can reduce to PASS.

**Recommended action.** Require a non-negative integer findingsCount, validate findingDetails and deltaFindings schemas, require both representations to describe the same lane and findings, and fail reducer integrity whenever the count, embedded details, and delta rows disagree.

## `runtime/scripts` (8)

### F-009-02 — Coverage accepts checked identifiers outside the corpus

`runtime/scripts/reduce-alignment-state.cjs:259` · correctness · **CONFIRMED**

**Evidence.** The reducer unions every non-empty artifactsChecked string, then compares only the resulting count with discoveredArtifactCount. It never verifies membership in the lane's canonical corpus identities; two arbitrary identifiers therefore satisfy a two-artifact corpus and can yield PASS with complete coverage.

**Recommended action.** Intersect checked identifiers with the canonical per-lane corpus identity set, reject unknown identifiers as integrity faults, and calculate coverage from verified members only.

**Verification.** reduce-alignment-state.cjs:259 unions any non-empty artifactsChecked string into checkedPaths with NO intersection against canonical corpus identities; checked clamps via Math.min(entry.artifactsChecked, laneDiscovered) so N arbitrary identifiers satisfy an N-artifact corpus -> coverage 1.0.

### F-009-03 — Adapter variants collide under the same lane identity

`runtime/scripts/reduce-alignment-state.cjs:97` · correctness

**Evidence.** laneKey() concatenates authority, artifactClass, and scope but omits adapter. Configured lanes using different adapters over the same tuple—such as sk-design and sk-design-live-render—therefore share reducer state; corpus and partition maps are also keyed by this identity, so one adapter's checks can satisfy or overwrite the other's lane.

**Recommended action.** Include adapter in the canonical lane identity throughout scoping, corpus generation, partitioning, convergence, and reduction. Alternatively, reject configurations containing differing adapters for one three-axis tuple.

### F-010-01 — Fan-out fulfills lineages with only a top-level report

`runtime/scripts/fanout-run.cjs:553` · correctness

**Evidence.** expectedLineageArtifactPaths() requires only review-report.md for review or research.md for research, and findMissingLineageArtifacts() checks only that file is non-empty. After process success, lines 2463-2510 reject missing artifacts using that minimal list; for the normal convergence policy, findMaxIterationsPolicyViolation() performs no state validation. The worker then returns a fulfilled output at line 2541 even if the canonical state JSONL, iteration markdown, deltas, findings registry, or legal synthesis evidence are absent.

**Recommended action.** Define and validate the complete per-mode artifact contract before fulfillment: parse the state JSONL, require the expected unique iteration records and files, validate their correspondence, require a legal terminal synthesis event, and verify mode-specific registries/deltas. Treat any missing, malformed, duplicated, or inconsistent evidence as an artifact failure.

### F-010-02 — Max-iteration completion trusts child-authored synthesis counters

`runtime/scripts/fanout-run.cjs:674` · correctness

**Evidence.** findMaxIterationsPolicyViolation() computes iterationCount, but when findSynthesisRecord() returns a record it never checks the actual iteration files or unique iteration records. Lines 689-697 accept Number(synthesis.totalIterations) and synthesis.stopReason directly; a lineage can therefore emit one synthesis record claiming the configured count, create a non-empty review-report.md, and be fulfilled despite not executing those iterations. Artifact-derived checking at lines 641-658 runs only when no recognizable synthesis event exists.

**Recommended action.** Treat synthesis fields as assertions, not evidence. Derive the completed count from unique, valid iteration identities present in both JSONL and iteration files, require an exact one-to-one sequence through the configured cap, and use synthesis.totalIterations and stopReason only as consistency checks against that derived evidence.

### F-016-02 — Native fanout dispatch always bypasses permissions and has no write containment

`runtime/scripts/fanout-run.cjs:1593` · security · **CORROBORATED-IN-PART**

**Evidence.** The native adapter constructs opencode arguments containing --dangerously-skip-permissions and --dir process.cwd(). The worker calculates a sandbox mode but the native adapter ignores it. Post-dispatch containment is enabled only when lineage.kind === 'cli-codex', so native lineages have no structural enforcement of the prompt-level lineageDir boundary.

**Recommended action.** Remove the unconditional permission bypass, dispatch native lineages inside an isolated worktree or path-scoped sandbox, and apply containment to every write-capable adapter. Fail closed when a native adapter cannot enforce the requested boundary.

**Verification.** The claim that post-dispatch containment is gated on lineage.kind===cli-codex is corroborated by a live incident this session: cli-codex fanout lineages DID run containment and reverted 15 untracked files belonging to a concurrent session. Confirms containment is kind-specific and blunt; the native-bypass half is not independently verified yet.

### F-016-03 — cli-opencode silently ignores read-only and workspace-write sandbox modes

`runtime/scripts/fanout-run.cjs:1630` · security

**Evidence.** The cli-opencode adapter always uses --dir process.cwd(). It adds --dangerously-skip-permissions only for danger-full-access; read-only and workspace-write produce no permission or sandbox flag. The worker still records the resolved sandbox mode, while its own comments state that the lineageDir boundary is prompt-only, and containment excludes cli-opencode.

**Recommended action.** Reject unsupported sandbox modes instead of recording them as effective. Use an isolated worktree or a genuinely enforced read-only/path-scoped mechanism, and fail closed when OpenCode cannot provide the requested policy.

### F-RES-02 — Reducer seal predicate excludes integrity faults but not pre-discovery state

`runtime/scripts/reduce-alignment-state.cjs:641` · correctness · **CONFIRMED**

**Evidence.** sealed = integrity.sealed === true && !integrityFault. discoveryIncomplete is not part of the predicate, so a completed session with a missing corpus can be sealed and marked complete even though discovery never ran.

**Recommended action.** Add pre-discovery state to the seal predicate: a run whose corpus never existed must never seal.

**Verification.** Found by the final adversarial verification of the alignment coverage fix; recorded as a documented residual rather than fixed in this session.

### F-RES-03 — Failed iteration evidence still counts toward coverage and stability

`runtime/scripts/reduce-alignment-state.cjs:393` · correctness · **CONFIRMED**

**Evidence.** An iteration recorded with error, stuck, or timeout status still contributes its artifactsChecked to coverage and its newFindingsRatio to the stability window (reduce-alignment-state.cjs:393-424; check-convergence.cjs:236-247). Iteration status is recorded but never disqualifies its evidence, so failure-status records can drive a CONVERGED outcome.

**Recommended action.** Exclude non-successful iteration records from both coverage credit and the stability window.

**Verification.** Found by the final adversarial verification of the alignment coverage fix; recorded as a documented residual rather than fixed in this session.

## `specs/system-deep-loop` (1)

### F-029-02 — Mandatory legacy-writer-retirement evidence does not exist

`specs/system-deep-loop/036-deep-loop-innovation/004-legacy-writer-retirement/checklist.md:42` · traceability · **CONFIRMED**

**Evidence.** Every phase-015 checklist item from line 42 onward is unchecked, tasks.md has all T001-T026 and completion criteria open, graph-metadata.json reports status planned, and the folder has no implementation-summary.md. Phase-016 tasks.md line 43 and checklist.md line 42 both make landed zero-use, rollback, and archival-reader evidence a blocking prerequisite.

**Recommended action.** Block candidate freezing and all phase-016 gate execution until phase 015 has a completed implementation summary, fully evidenced blocking checklist, deletion/retention manifest, zero-use report, archival-read results, rollback evidence, and a receipt digest-bound to the candidate SHA.

**Verification.** Phase 015 verified: no implementation-summary.md, 0 checked and 29 unchecked checklist items, graph-metadata status planned. Phase 016 tasks and checklist make landed retirement evidence a blocking prerequisite, and the authority cutover it follows has not run. ROOT CAUSE IS MINE: I parked a pre-014 validation gate inside the 016 packet, so its artifacts could be misread as phase-016 execution. Corrected by an explicit PRE-014-VALIDATION-RUN.md boundary notice; relocation or formal re-scoping deferred to closeout.

---

# P1 — 104 findings

## `.claude/agents` (1)

### F-028-02 — Deep-review requires detect_changes in runtimes that do not expose it

`.claude/agents/deep-review.md:4` · traceability

**Evidence.** The Claude tools allowlist contains Read, Write, Edit, Bash, Grep, Glob, and memory MCP only; detect_changes is absent. The same definition instructs the agent to use detect_changes for local diffs at line 157 and lists it as a required code-intelligence tool at line 254. OpenCode explicitly allows detect_changes in its frontmatter, while the mirror checker strips frontmatter and compares only body tokens, so the current tool-surface loss is reported as synchronized.

**Recommended action.** Expose the same detect_changes tool in Claude and Codex, or remove the unconditional instruction and route through a runtime-neutral capability check. Extend mirror validation to compare normalized tool capabilities, not only body text.

## `agents/ai-council.md` (1)

### F-028-03 — AI-council persistence has no single executable writer authority

`agents/ai-council.md:722` · traceability

**Evidence.** The agent requires direct use of the JavaScript persistence library so each artifact write emits an artifact_written event, but its frontmatter denies Bash and exposes no code-execution tool. The CLI wrapper only invokes the library when executed as a process at scripts/persist-artifacts.cjs:13-14. The agent says the leaf owns persistence and the parent need not invoke the helper at line 731, while orchestrator.md:163 separately requires the parent to invoke that helper after the leaf returns.

**Recommended action.** Choose one writer authority. Prefer a host-owned, scoped persistence step after the leaf returns, then remove the leaf-direct-write claim; alternatively expose a dedicated scoped persistence tool and remove the parent fallback. Update all runtime mirrors together.

## `bin/lib` (1)

### F-027-02 — Compiled routing accepts packet and leaf identities without resolving them on disk

`bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs:349` · traceability

**Evidence.** `compileManifestResources()` only checks leaf values with `assertString` at lines 349-353 and constructs `${mode.packet}/${leafResourceId}` at lines 362-365; `compileRegistry()` invokes it at lines 538-543. The build harness supplies registry, router, manifest, and smart-routing bytes but no packet SKILL bytes. An in-memory probe replacing the research packet with nonexistent `deep-ghost` and a leaf with `references/protocol/__missing__.md` still compiled, producing a nonexistent packet destination and missing leaf.

**Recommended action.** Require every registry packet SKILL file and selected packet-relative leaf to exist and pass safe-path validation before compilation; bind their bytes or digests into source identity.

## `commands/deep` (3)

### F-022-01 — 013 typed migration families are absent from the shipped research and review execution paths

`commands/deep/assets/deep-research-confirm.yaml:1059` · traceability · **CONFIRMED-BY-DESIGN**

**Evidence.** The live research workflow validates legacy iteration JSONL and then invokes deep-research/scripts/reduce-state.cjs at line 1059; the review workflow similarly dispatches the legacy deep-review agent and calls runtime/scripts/reduce-state.cjs at line 1195. A source scan found no non-test callers of the deep-research/deep-review typed families or their mode gates. Real runs therefore do not emit the typed event envelopes or produce the 013 migration-gate evidence.

**Recommended action.** Add mode-owned adapters that wire both command workflows through the typed schema, reducers, sealed artifacts, certificates, resume adapter, shadow parity, and rollback gate. Add an end-to-end test executing one real run per lane and proving the typed ledger and gate evidence are produced.

**Verification.** Factually accurate (live workflows still call the legacy reduce-state paths; no non-test callers of the typed families) but this is the INTENDED additive-dark state, not a defect: the migration program deliberately built the typed spine without wiring authority, so authority flips one mode at a time at the cutover phase. Reclassify as expected-state documentation, NOT a cutover blocker. It becomes a real finding only if a packet claims real-run migration-gate evidence.

### F-SOL-05 — DISCOVERY_INCOMPLETE is not handled by its workflow consumers

`commands/deep/assets/deep-alignment-auto.yaml:733` · correctness · **CONFIRMED**

**Evidence.** deep-alignment-auto.yaml:733-759 and deep-alignment-confirm.yaml:392-418 omit DISCOVERY_INCOMPLETE from the declared decision enum and the branch table. The command exits 0 with no explicit fail/continue branch, so a pre-discovery run can fall through toward synthesis and completion.

**Recommended action.** Not supplied by the reporting iteration — derive one when triaging.

**Verification.** in-memory probes reproduced each; found while verifying round 2 of the coverage fix

### F-037-02 — Synthesis silently ignores malformed canonical state records

`commands/deep/assets/deep-review-auto.yaml:1879` · maintainability

**Evidence.** The synthesis helper catches JSON.parse failures and returns an empty array for malformed lines at lines 1879-1891. The resulting stateRecords are used for invariant calculations at lines 1941-1962, and the no-failure branch appends synthesis_complete at lines 1987-2001. A corrupt or lost state row can therefore be omitted before the workflow marks the run complete.

**Recommended action.** Use strict shared JSONL parsing for canonical state. Any malformed line must block synthesis completion and produce an explicit corruption or incomplete result.

## `deep-ai-council/README.md` (1)

### F-038-06 — Council completion is documented as a gate but implemented as advisory

`deep-ai-council/README.md:80` · maintainability

**Evidence.** The handoff instructions say to verify that the state log ends with council_complete. advise-council-completion.cjs only checks whether any such event exists, emits advisories, and returns 0 even when the event is missing; its tests explicitly preserve that behavior.

**Recommended action.** Either label this step explicitly as advisory and require a separate authoritative completion check, or make the verifier fail closed and validate the terminal event semantics.

## `deep-ai-council/scripts` (1)

### F-019-03 — Memory-save payload output is an unrestricted file overwrite

`deep-ai-council/scripts/lib/persist-artifacts.cjs:1007` · security

**Evidence.** parseArgs() accepts --memory-save-payload-out as an arbitrary string at line 938. Lines 1007-1011 path.resolve() that value, recursively create its parent, and writeFileSync() the payload without an approved-root, packet-root, symlink, or existing-file check. Supplying a writable repository or user path overwrites it with attacker-influenced JSON.

**Recommended action.** Remove the arbitrary output-path surface in favor of stdout, or restrict it to a fixed packet-local filename beneath the already-authorized council root using canonical parent containment and no-follow/exclusive creation semantics.

## `deep-alignment/assets` (1)

### F-038-01 — Command-surface benchmark mixes live 035 and absent 066 packet

`deep-alignment/assets/conformance-benchmark/command-surface/conformance-benchmark.md:38` · maintainability

**Evidence.** The benchmark index and runnable README use .opencode/specs/system-deep-loop/035-command-surface-benchmark, but this contract's verification command, fixture root, execution phase, and evidence paths use .opencode/specs/system-deep-loop/066-command-surface-benchmark. The 066 packet and oracle path are absent while the referenced 035 phase exists.

**Recommended action.** Select one canonical packet, then regenerate the contract, fixture manifest, hashes, commands, and evidence links so every benchmark artifact resolves to the same existing packet.

## `deep-alignment/scripts` (8)

### F-009-05 — Live-render artifacts have no partition identity

`deep-alignment/scripts/partition-corpus.cjs:92` · correctness

**Evidence.** artifactIdentity() recognizes only artifact.path and artifact.ref, while sk-design-live-render emits artifacts with target and targetType. Their identity is always null, so resolveNextSlice() always treats them as unchecked; when the corpus exceeds batchSize, it repeatedly selects the first batch and never reaches later targets.

**Recommended action.** Define and share a canonical identity function covering target-based artifacts, then add progress tests with more live-render targets than one batch.

### F-009-06 — Interactive scoping discards the selected adapter

`deep-alignment/scripts/scoping.cjs:254` · correctness

**Evidence.** resolveLanesFromSelections() constructs each raw lane from authority, artifactClass, and scope only, dropping selection.adapter before validation. The same live-render selection resolves to sk-design-live-render through config input but defaults to sk-design through the interactive path, making adapter variants unreachable or silently changed without a config.

**Recommended action.** Preserve adapter in the interactive lane object and expose adapter selection where multiple registered variants support the same authority and artifact class.

### F-ORC-01 — deep-alignment script test suite baseline is RED (5 pre-existing failures)

`deep-alignment/scripts/tests/` · traceability · **CONFIRMED**

**Evidence.** node --test .../deep-alignment/scripts/tests/*.test.cjs -> 18 tests, 11 pass, 5 fail, 2 skipped, exit 1, measured before any change this session. Failures: scheduler-enumerates-required-cells; command suite exactly DAB-012..DAB-027 schema-v2; presentation markers pinned to command sources; contracts cover every command topology; sk-doc-command-adapter.test.cjs (file-level). All in the command-contract surface, not coverage math.

**Recommended action.** Triage the 5 command-contract failures separately; a red baseline means any packet claiming green alignment test evidence is stale. Also note `node --test <dir>` fails on this Node (treats dir as module path) - the file glob is required, so a doc/runner instruction may be wrong.

**Verification.** measured directly; used as the delta baseline for the coverage fix

### F-021-02 — REMEDIATE hook does not enforce operator confirmation

`deep-alignment/scripts/remediate-hook.cjs:87` · security

**Evidence.** parseArgs sets args.confirm when --confirm is present, but main only checks args.specFolder and calls enterRemediateHook(args.specFolder) regardless of confirmation. The exported enterRemediateHook function accepts only specFolder, so direct module callers also enter REMEDIATE without authorization. The current body is a no-op, but the documented future replacement would inherit this unauthenticated entry path.

**Recommended action.** Require an explicit authorization value at both the CLI and module boundary, reject missing or invalid approval before entering REMEDIATE, and bind approval to the specific packet and intended remediation operation.

### F-SOL-03 — Absent corpus indistinguishable from valid empty corpus — pre-discovery reads as a pass

`deep-alignment/scripts/check-convergence.cjs:227` · correctness · **CONFIRMED**

**Evidence.** With no corpus file, configured lanes become NOT_APPLICABLE and the run returns NOTHING_TO_CONVERGE (operator-visible as zero applicable lanes), which is indistinguishable from a genuine no-op pass. A run whose DISCOVER never executed therefore looks clean.

**Recommended action.** Separate three states: corpus absent = discovery incomplete (distinct non-pass); present+valid+zero artifacts = genuine NOTHING_TO_CONVERGE; present+malformed = integrity fault.

**Verification.** found while adversarially verifying the round-1 coverage fix; pure-function probes reproduced each

### F-026-04 — Alignment is registered as review-backed although it uses a separate convergence backend

`deep-alignment/scripts/check-convergence.cjs:21` · traceability

**Evidence.** The implementation explicitly says runtime/scripts/convergence.cjs does not accept alignment and implements a manual alignment-specific coverage and stability check. Despite that, mode-registry.json assigns alignment runtimeLoopType review and the parent SKILL/README describe all non-null modes as using runtime convergence.

**Recommended action.** Represent alignment's custom convergence backend explicitly in the registry and parent documentation, or implement a real runtime alignment backend; do not map it to review without equivalent semantics.

### F-SOL-06 — Present-but-empty corpus with configured lanes still reads as NOTHING_TO_CONVERGE

`deep-alignment/scripts/check-convergence.cjs:168` · correctness · **CONFIRMED**

**Evidence.** Both readers gate the missing-configured-lane guard on lanes.length > 0 (check-convergence.cjs:168; reduce-alignment-state.cjs:233), so a corpus of {lanes:[]} with configured lanes bypasses it entirely and resolves to NOTHING_TO_CONVERGE. Absent or non-array config.lanes similarly collapses to zero configured lanes (reduce-alignment-state.cjs:681-687).

**Recommended action.** Not supplied by the reporting iteration — derive one when triaging.

**Verification.** in-memory probes reproduced each; found while verifying round 2 of the coverage fix

### F-RES-06 — Count-only progress advances the partition cursor without earning credit

`deep-alignment/scripts/partition-corpus.cjs:126` · correctness · **CONFIRMED**

**Evidence.** The partitioner falls back to raw artifactsChecked as a cursor when checkedArtifactIds is null (partition-corpus.cjs:126-139). A count-only record equal to the corpus size returns done:true despite zero credited coverage. It cannot cause false convergence, but it suppresses all remaining dispatches and strands the loop or forces a sealed FAIL at the cap.

**Recommended action.** Advance the partition cursor from credited identity evidence only; treat count-only progress as no progress for slicing.

**Verification.** Found by the final adversarial verification of the alignment coverage fix; recorded as a documented residual rather than fixed in this session.

## `deep-improvement/assets` (1)

### F-033-01 — Seven shipped benchmark profiles reference nonexistent fixture IDs

`deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo-v3.json:9` · maintainability

**Evidence.** The profile references validate_ipv4, validate_date, validate_semver, and hard_roman_to_int, while the fixture IDs use hyphens. sweep-benchmark.cjs only resolves exact parsed IDs or filename stems at lines 121-127; its exported selector reports fixture-not-found errors for seven of the ten shipped profiles.

**Recommended action.** Normalize one canonical fixture-ID convention, update all profiles and tests, and add an all-profile asset-resolution gate.

## `deep-improvement/scripts` (5)

### F-008-01 — Non-finite score values bypass promotion gates

`deep-improvement/scripts/shared/promote-candidate.cjs:518` · correctness

**Evidence.** The benchmark gate uses `Number(benchmarkReport.aggregateScore || 0) < BENCHMARK_AGGREGATE_GATE`; Lane A uses the same pattern for `Number(score.score || 0)` and `Number(scoreDelta || 0)` at lines 593-605. `Number('not-a-number')` produces NaN, and comparisons with NaN are false, so malformed score or delta evidence can pass these gates and reach promotion.

**Recommended action.** Require finite numeric values before every promotion comparison and fail closed on absent, NaN, Infinity, or non-numeric score, delta, aggregate, and threshold fields.

### F-008-02 — Benchmark sweep scores raw event JSON when assistant text is absent

`deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:322` · correctness

**Evidence.** `dispatchCell` assigns `assistantText` with `extractAssistantText(stdout) || stdout`. For a syntactically valid JSONL event stream containing no `type:'text'` events, the parser returns an empty assistant string, so the fallback uses raw event JSON; line 326 then marks the dispatch successful when that JSON is non-empty and sends it to scoring.

**Recommended action.** Preserve an empty parsed assistant output and mark text-less streams unscorable. Only fall back to raw stdout when parsing reports an actual error.

### F-008-03 — Direct rollback trusts an unbound backup file

`deep-improvement/scripts/agent-improvement/rollback-candidate.cjs:144` · correctness

**Evidence.** After checking target, manifest, configuration, and allowed roots, the direct rollback path executes `fs.copyFileSync(backup, target)` and emits `status:'rolled_back'`. It does not require an acceptance record, compare the backup hash with a recorded pre-promotion hash, or establish that the backup is the archived preimage. Any readable file under the allowed roots can therefore be restored as a successful rollback.

**Recommended action.** Require rollback evidence containing the recorded pre-promotion hash, verify the backup against it before copying, and reject unbound direct backup paths.

### F-028-04 — Agent mirror validation ignores instruction ordering

`deep-improvement/scripts/lib/mirror-sync-verify.cjs:71` · traceability

**Evidence.** tokenizeBody converts each body into a Set, and compareBodyTokens only checks missing and unexpected tokens at lines 83-95. A read-only probe showed that 'STEP READ STATE THEN WRITE FINDINGS' and 'STEP WRITE FINDINGS THEN READ STATE' return matches=true, so reordered load-bearing workflow instructions pass the mirror gate.

**Recommended action.** Compare canonical bodies structurally or byte-for-byte after a narrow allowlist of runtime substitutions, and separately validate frontmatter/tool-surface parity.

### F-033-02 — Documented nested legacy fixture corpus is skipped by the loader

`deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:280` · maintainability

**Evidence.** loadFixtures() scans only immediate directory entries for *.public.json. The asset README documents fixtures/<skill-id>/ subdirectories and says the corpus is consumed via --fixtures-dir; calling loadFixtures() on the documented fixtures parent returns zero rows, while the deep-improvement child returns one.

**Recommended action.** Recurse into skill subdirectories or resolve the target skill child explicitly, and fail when an explicit corpus path yields zero fixture rows.

## `deep-research/README.md` (1)

### F-038-02 — Research README promises corruption repair that the reducer does not perform

`deep-research/README.md:130` · maintainability

**Evidence.** The troubleshooting section says the reducer auto-repairs one trailing corrupt JSONL line. The implementation records corruption warnings, throws in strict mode, and exits with status 2 unless --lenient is supplied; no truncation or repair branch exists.

**Recommended action.** Document strict fail-closed behavior accurately and describe --lenient as an explicit recovery mode, not automatic repair.

## `deep-review/assets` (1)

### F-040-02 — Codex agent mirrors are outside runtime parity coverage

`deep-review/assets/runtime-capabilities.json:6` · traceability

**Evidence.** The runtime array contains only `opencode` and `claude`, although `.codex/agents/deep-review.toml` exists as a converted runtime mirror. The review parity test likewise hardcodes only those two mirrors and asserts exactly `['opencode','claude']`; review-mode-contract.yaml lists authored artifacts for OpenCode and Claude but no Codex artifact while claiming runtime coverage for every supported agent. The deep-research matrix and parity test repeat the same omission, and both resolvers reject `codex` with exit 1.

**Recommended action.** Add Codex records and mirror paths to both runtime-capability matrices, include Codex in the review authored-artifact and parity-test sets, and derive expected runtime IDs from an authoritative cross-runtime registry. If Codex is intentionally unsupported, remove or explicitly classify the existing Codex agents outside the parity claim.

## `deep-review/manual-testing-playbook` (2)

### F-030-01 — Release coverage omits intra-routing recall scenarios

`deep-review/manual-testing-playbook/manual-testing-playbook.md:31` · traceability

**Evidence.** The root inventory declares 51 scenarios across nine categories and its canonical-artifact list omits intra-routing-recall/. Four additional scenario files exist there as DV-R01 through DV-R04, each with category, expected intent, expected resources, and an exact prompt. The release rule at lines 105-111 measures only scenarios defined by the root index, so it can report 100% coverage without executing these four shipped routing scenarios.

**Recommended action.** Add intra-routing-recall to the canonical inventory and coverage map, include DV-R01..DV-R04 in the total and readiness denominator, and validate that every scenario-shaped file under the playbook is indexed exactly once.

### F-030-03 — Release rules accept a verdict forbidden by the execution policy

`deep-review/manual-testing-playbook/manual-testing-playbook.md:9` · traceability

**Evidence.** The execution policy says the only acceptable classifications are PASS, FAIL, or SKIP. Lines 89-98 separately define PARTIAL for both scenarios and features, while lines 105-109 allow READY whenever no feature is FAIL and critical scenarios pass. A non-critical scenario with incomplete evidence can therefore become PARTIAL and still permit READY despite PARTIAL being prohibited by the governing policy.

**Recommended action.** Define one verdict enum for scenario, feature, and release aggregation. If PARTIAL remains valid, state it in the execution policy and make release readiness explicitly reject unresolved PARTIAL evidence; otherwise remove PARTIAL from all subordinate rules.

## `deep-review/scripts` (1)

### F-040-01 — Contract snapshot verifier cannot accept its generated artifact

`deep-review/scripts/render-contract-snapshot.cjs:445` · traceability

**Evidence.** renderSnapshot() constructs output beginning with a generated comment and contains no YAML frontmatter, while review-mode-contract-snapshot.md begins with a 12-line metadata frontmatter block. Lines 501-505 compare the entire existing file byte-for-byte with that frontmatter-free rendering. Running `node .opencode/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs --check` deterministically returned `drift detected`, so the contract's declared render-verification gate cannot pass without deleting the snapshot metadata.

**Recommended action.** Preserve the existing frontmatter when rendering, or compare and replace only the bounded generated-marker block. Add a test that runs `--check` against the committed snapshot and asserts success.

## `hub-router.json` (1)

### F-027-01 — Supported command alias is absent from the hub route vocabulary

`hub-router.json:72` · traceability

**Evidence.** `mode-registry.json:192` declares `/deep:command-benchmark` as an alignment alias, while `deep-alignment/SKILL.md:35,356` and `command-metadata.json:332-376` treat it as a supported launcher. `hub-router.json:71-73` omits the command, and the compiler derives live vocabulary only from hub-router classes. The read-only vocabulary check reports the alias as orphaned; replay and compiled canary both defer the exact command prompt.

**Recommended action.** Add the specialized command to the typed alignment routing projection, or model it as an explicit command subworkflow with an alignment owner, then regenerate and verify both routing paths.

## `runtime/lib` (46)

### F-002-01 — Torn-tail recovery can quarantine bytes without durable recovery evidence

`runtime/lib/authorized-ledger/immutable-frame-store.ts:502` · correctness

**Evidence.** quarantineTornTailUnlocked renames the candidate into quarantine at line 502, fsyncs the directories, and only then opens and writes the recovery marker at lines 521-532. If openSync, writeFileSync, fsyncSync, or close fails after the rename, the method throws with the frame removed from frames and no recovery marker. append-only-ledger.ts scans only frames and recovery markers, so a later scan treats the prior prefix as the current head and can reuse the quarantined sequence.

**Recommended action.** Make quarantine and recovery evidence crash-consistent: publish durable pending recovery state before removing the frame, or retain a blocking marker/orphan quarantine record on any post-rename failure. Never allow a subsequent scan to silently advance from an unlinked quarantined sequence.

### F-002-02 — Cyclic or throwing request data bypasses durable default denial

`runtime/lib/authorized-ledger/transition-authorization-gateway.ts:130` · correctness

**Evidence.** isEventPreflight calls canonicalBytes(value.envelope) directly at lines 130-132. canonicalBytes rejects cyclic JSON by throwing. authorize calls #prepareContext(input) at lines 554-555 before its audit-storage catch, and #prepareContext invokes isTransitionRequest at lines 611-612. A structurally object-like request containing a cyclic envelope therefore rejects the promise before an invalid-input decision is built or audited.

**Recommended action.** Make the request predicate total by catching canonicalization and property-access failures, or catch preparation failures in authorize and construct one durable INVALID_INPUT denial. The gateway contract should never throw for untrusted request data.

### F-003-01 — Lock release can unlink a successor owner's lock after a reclaim race

`runtime/lib/deep-loop/loop-lock.ts:705` · correctness

**Evidence.** releaseLoopLock reads and identity-checks the lock at lines 706-708, then unconditionally unlinks the pathname at line 711. Unlike refreshLoopLock, it does not atomically claim the inode before removal. A stale reclaimer can replace the lock between the read and unlink, causing release to delete the successor owner's lock or throw ENOENT.

**Recommended action.** Release through the same atomic claim-and-verify protocol as refresh, removing only the claimed inode and preserving any successor lock; handle ENOENT as a failed release.

### F-003-02 — Leaf artifact publication can leave an orphaned delta without a canonical state record

`runtime/lib/deep-loop/leaf-artifact-writer.ts:246` · correctness

**Evidence.** The writer creates the iteration directory, writes iteration markdown at line 253, writes the delta at line 254, and appends the state record last at line 255. The catch only returns an error and performs no rollback. A crash or write failure after either first write leaves artifacts that the orchestrator cannot see through the state log, while the write-once delta check at line 250 blocks a clean retry.

**Recommended action.** Publish via staged temporary files plus an atomic commit marker/recovery protocol, or implement rollback and reconciliation so narrative, delta, and state record become one recoverable transaction.

### F-004-01 — Concurrent recovery callers can both execute the same unresolved effect

`runtime/lib/receipts-and-effect-recovery/effect-gateway.ts:615` · correctness

**Evidence.** The gateway appends the deterministic recovery-started event but discards the append result. Independent gateway instances can both calculate the same attempt and recovery ID; one append returns appended and the other idempotent, yet both continue through lines 617-657. If both reconciliation queries observe not_applied before either mutation completes, both call #executeAdapter. The #withLock map at lines 1285-1297 is instance-local and therefore does not elect a cross-process owner.

**Recommended action.** Use the recovery-started append as the durable ownership election: only the appended winner may reconcile and execute. An idempotent caller should read or wait for the matching reconciled/confirmation event and must not cross the effect boundary. Bind claim consumption to the durable event or an equivalent fenced single-use lease.

### F-004-02 — Conflicting operator decisions can both commit and drive side effects

`runtime/lib/receipts-and-effect-recovery/effect-gateway.ts:760` · correctness

**Evidence.** resolution_id is derived from recovery_id plus the chosen resolution and evidence digest, so conflicting decisions receive different event IDs. Two gateway instances can both read priorResolutions as empty, append distinct operator-resolved events, and each receive status appended because AuthorizedEvidenceWriter deduplicates only event identity. A terminal_failed caller returns at line 814 while a concurrent confirmed_not_applied caller can continue to lines 826-849 and execute the effect, contradicting the terminal decision.

**Recommended action.** Give each recovery one deterministic operator-resolution slot independent of the selected decision, or enforce uniqueness for its idempotency key under the ledger lock. After any lost append race, re-read the winning resolution and reject conflicting facts before reconciliation or execution.

### F-004-03 — Concurrent exact attestation writes do not converge idempotently

`runtime/lib/replay-fingerprint/replay-fingerprint-attestation.ts:373` · correctness

**Evidence.** recordReplayFingerprintAttestation scans for an existing attestation at lines 373-409 and then directly calls ledger.appendAuthorized at line 423. Two exact writers can both complete the scan before either append. AppendOnlyLedger requires an exact retry to reuse the original authorization decision, so the second caller's independently issued proof is rejected as AUTHORIZATION_ALREADY_USED rather than returning the first durable receipt.

**Recommended action.** Publish through the race-aware authorized writer or catch the authorization/head race, re-read the ledger, verify identical descriptor bytes and digest, and return the existing receipt. Derive a stable event identity from the attestation key so the single durable slot is explicit.

### F-004-04 — Resume treats a caller assertion as ledger-authoritative result evidence

`runtime/lib/dispatch-receipts/resume-projection.ts:203` · correctness

**Evidence.** When input.result is present, validateResult checks only the plain object's verified === true marker, result ID/digest shape, and three receipt-binding strings. The result is never located in verified ledger events, yet lines 214-220 return classification result_recorded with authority ledger. A caller can construct a matching object with an arbitrary result ID and digest and receive a ledger-authoritative recorded-result decision.

**Recommended action.** Accept a VerifiedLedgerEvent or an opaque verifier-issued capability, parse the typed result-envelope payload, and verify its digest, event identity, receipt causation, and ledger membership before returning result_recorded. Do not label caller-branded evidence as ledger authority.

### F-005-01 — Initial research replay silently accepts stream-sequence gaps

`runtime/lib/deep-research-reducers/deep-research-reducer.ts:2106` · correctness

**Evidence.** foldDeepResearchEvents validates and sorts events at line 2101, but its cursor-gap check at lines 2106-2119 executes only when a checkpoint exists. With no checkpoint, a valid run_initialized event at sequence 1 followed by an otherwise independent valid event at sequence 3 is folded and returned as projected. applyEvent's appendSeenEvent path at lines 1654-1680 only checks duplicate event IDs and does not enforce stream continuity or prev-event linkage.

**Recommended action.** Apply contiguous-tail validation to fresh folds as well as checkpoint resumes. Track the expected sequence per permitted stream from zero, reject gaps, out-of-order input, and unauthorized stream splits by default, and preserve requireContiguousTail=false as the explicit escape hatch.

### F-005-02 — Rollback-window success count trusts unauthenticated execution claims

`runtime/lib/deep-review-rollback-gate/mode-gate.ts:605` · correctness

**Evidence.** evaluateDeepReviewRollbackWindow filters executions only by token shape, authority-state text, positive epoch, trusted-completion text, and digest shape at lines 605-612. Lines 613-655 then count connected execution/certificate identities, and line 657 uses that count to make the window eligible_to_close. No execution row is resolved to an authenticated run certificate, receipt, or ledger event, so two fabricated execution IDs with distinct syntactically valid certificate digests satisfy the execution threshold after the calendar minimum.

**Recommended action.** Derive qualifying executions from verified certificate or authorized-ledger evidence supplied by the gate, binding execution ID, certificate digest, authority epoch, trusted lifecycle result, and occurrence within the rollback window. Treat unmatched or duplicate claims as unresolved evidence rather than threshold credit.

### F-006-01 — Council parity discards the real reducer projection

`runtime/lib/deep-ai-council-shadow-parity/harness-adapter.ts:1263` · correctness · **CONFIRMED · CUTOVER BLOCKER**

**Evidence.** councilLedgerProjection calls foldDeepAiCouncilEvents only to check that folding succeeds, then returns councilProjectionFromEvents; councilLegacyProjection returns the same helper directly. replayState therefore fingerprints identical raw-event projections for both paths, so reducer-specific semantic divergence cannot produce a parity diff.

**Recommended action.** Use the actual folded council projection for the ledger path and an independently implemented legacy oracle for the legacy path; compare their canonical projections and event observations before issuing parity evidence.

**Verification.** councilProjectionFromEvents:1126 hand-derives projection by event-stem scan; councilLedgerProjection:1253 folds the real reducer ONLY to validate then discards it; both parity sides use the scanner. Real reducer projection never compared.

### F-006-02 — Alignment parity derives both paths from one typed projection

`runtime/lib/deep-alignment-shadow-parity/harness-adapter.ts:793` · correctness · **CONFIRMED · CUTOVER BLOCKER**

**Evidence.** legacyProjection first calls foldProjection, which invokes foldDeepAlignmentEvents, then creates projectDeepAlignmentLegacyView from that already-folded state and returns projectionView of the same state. ledgerProjection also returns projectionView(foldProjection(events)), so the legacy and ledger fingerprints share the same reducer output.

**Recommended action.** Make the legacy executor replay an independent legacy representation or oracle and make only the ledger executor depend on foldDeepAlignmentEvents; compare the independent outputs rather than a view of the same state.

**Verification.** replayState:824 both paths call foldProjection(events) then projectionView(...,path); only resumeDecisionDigest varies with path (:779). Diff at :645 compares projectionFingerprint, so semantic divergence is undetectable. Partial independent oracle exists (assertLegacyProjectionMatchesCurrentState:814, 4 digests, throws not diffs).

### F-006-03 — Council source references ignore round identity

`runtime/lib/deep-ai-council-reducers/deep-ai-council-reducer.ts:651` · correctness

**Evidence.** assertProposalReferences builds a Set of proposalId values without roundId. The same reducer stores proposals with the composite roundId:proposalId key at lines 562 and 639, while candidate, judgment, and stance checks likewise compare only candidateId or judgmentId. A round-B event can therefore cite an identically named proposal, candidate, or judgment captured only in round A.

**Recommended action.** Resolve every round-owned reference with a composite roundId plus local ID and require referenced events and projection rows to share the source event's round.

### F-006-04 — Council certificates do not bind artifact scope to event scope

`runtime/lib/deep-ai-council-certificates/deep-ai-council-certificates.ts:454` · correctness

**Evidence.** sourceRangeMatchesEvent checks only sourceEventRange.lastEventId, lastStem, and authorityEpoch. It never compares the artifact material scope.runId or scope.roundId with the matched event payload scope. verifiedArtifactSet and verifyArtifacts read artifacts without expectedScope, and assertArtifactEventsAuthorized accepts any artifact with exactly one such match.

**Recommended action.** Require artifact scope.runId and scope.roundId to match the covered run and event, validate the complete source range on the same stream, and pass explicit scope expectations through both issuance and offline verification.

### F-007-01 — Mode certificate receipts fabricate ledger head sequences

`runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts:1026` · correctness

**Evidence.** certificateUnsignedReceipt() sets result_head.sequence to body.receiptDigests.length even though finalHeadHash comes from the covered ledger frame at lines 1193-1230; transition receipts similarly derive head sequences from attemptNumber at lines 359 and 364 instead of resultEvent.frame.sequence. Verification re-derives the same synthetic values, so signatures remain valid for false ledger positions. The agent, model, and skill certificate emitters contain the same receipt-count sequence pattern.

**Recommended action.** Derive certificate head sequences from the actual replay range and transition head sequences from the verified ledger frame. Enforce those equalities during offline verification across all four mode emitters.

### F-007-02 — Artifact origin validation omits scoped identity binding

`runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts:630` · correctness

**Evidence.** assertArtifactOrigin() checks only origin eventId, eventStem, and payloadDigest at lines 634-643. It never compares the authorized event scope or data to the material's candidateId, evaluatorEpochId, canaryEpochId, or promotion identity. The certificate then copies candidateMaterial.candidateId directly into the body at line 1204 without comparing it with the replayed projection. A candidate artifact for B can therefore name an exact authorized event for A as its origin while the certificate reports B.

**Recommended action.** Add per-artifact-kind origin constraints that validate run, lineage, candidate, epoch, and promotion identities against the origin event scope/data and the reducer projection; apply the same checks in agent, model, and skill certificate paths.

### F-007-03 — Model score references are not ownership-bound to the target trial

`runtime/lib/model-benchmark-reducers/model-benchmark-reducer.ts:480` · correctness

**Evidence.** assertSource() only checks event ID, stem, and optional payload digest at lines 377-395. score_vector_observed calls it with the observation event and digest at lines 478-483, but does not compare candidateId, trialId, taskInstanceId, or trialMatrixKey. The reducer then records the target scope's candidate/trial together with the referenced observationEventId at lines 1141-1161, while the projection validator performs no semantic reference validation. A score for one candidate can therefore cite an observation from another candidate's trial and enter ranking.

**Recommended action.** Resolve the referenced event's full typed scope and require ownership equality with the scoring event, including candidate, trial, task, and matrix identity. Apply equivalent checks to usage and judge references.

### F-010-04 — Executor JSONL audits collapse materially different dispatches

`runtime/lib/deep-loop/executor-audit.ts:824` · correctness

**Evidence.** buildExecutorAuditRecord() records only kind, model, reasoningEffort, serviceTier, and optional lineageId. It omits sandboxMode, timeoutSeconds, liveTools.webSearch, configDir, governor, executable identity, and invocation fingerprint. Consequently, dispatches with different permission posture, network policy, timeout, or prompt-governor settings can produce identical executor audit blocks.

**Recommended action.** Record the resolved behavior-defining configuration rather than the partial source config, including sandbox and permission posture, web-search policy, timeout, executable identity/version, governor digest, and invocation fingerprint. Canonicalize the schema so audit comparison cannot conflate materially different invocations.

### F-011-02 — Verified sealed reads do not enforce the claimed canonicalization profile

`runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts:838` · correctness

**Evidence.** The read path calls canonicalizers.describe at lines 838-841 and 907-910, which checks only registered metadata. It then accepts blob bytes after checking byte length and SHA-256 equality at lines 926-937. It never runs the registered canonicalizer or compares canonicalized bytes with the stored blob, so a coherent reference, descriptor, and blob can claim a profile without satisfying its canonical byte contract.

**Recommended action.** Re-run the registered canonicalizer or an equivalent verified decoder/re-encoder during read and require byte-for-byte equality before returning VerifiedSealedArtifact.

### F-011-04 — Alignment output provenance accepts lifecycle events without artifact identity binding

`runtime/lib/deep-alignment-certificates/deep-alignment-certificates.ts:717` · correctness

**Evidence.** artifactCorrespondsToEvent checks only the envelope stem/type, material.authorityEpochId versus event scope authorityEpochId, and presence of data at lines 690-705. For LANE_CONFIGURATION, lines 717-724 return true for run_initialized, scope_resolved, dimension_ordered, or lane_completed without requiring laneId or a digest match. requireArtifactEventCorrespondence applies this predicate to every output artifact at lines 1184-1199. The shared alignment material base contains artifactId and authorityEpochId but no runId or sessionId at deep-alignment-sealed-artifact-types.ts lines 84-92.

**Recommended action.** Require each artifact kind to bind to event-specific identity data, including run/session scope where applicable. Remove broad lifecycle fallbacks and require exact digest, lane, artifact, or source-event correspondence for every output.

### F-012-01 — Agent-improvement ledger parity returns the legacy projection

`runtime/lib/agent-improvement-shadow-parity/harness-adapter.ts:850` · correctness

**Evidence.** ledgerProjection calls foldAgentImprovementEvents and stores folded.projection in state, but computes stateDigest only as a SHA-256 availability check and returns legacyProjection(events, resumeEvidence) spread into the result. The typed reducer projection is never mapped into the ledger parity output.

**Recommended action.** Construct the ledger projection from folded.projection, compare its complete semantic surface against the independent legacy projection, and remove the no-op digest gate.

### F-012-02 — Model-benchmark ledger parity discards the reducer projection

`runtime/lib/model-benchmark-shadow-parity/harness-adapter.ts:784` · correctness

**Evidence.** After foldModelBenchmarkEvents succeeds, ledgerProjection assigns projection = legacyProjection(events, resumeEvidence) and returns it. The folded reducer projection is used only to reject non-projected outcomes, so semantic reducer drift cannot be observed by the parity comparator.

**Recommended action.** Map folded.projection into the protected ledger projection and compare all protected fields against the legacy projection before issuing parity evidence.

### F-012-03 — Skill-benchmark ledger parity discards the reducer projection

`runtime/lib/skill-benchmark-shadow-parity/harness-adapter.ts:788` · correctness

**Evidence.** ledgerProjection folds the events, rejects non-projected results, then assigns and returns legacyProjection(events, resumeEvidence). No field from folded.projection contributes to the returned ledger projection.

**Recommended action.** Derive the ledger side from folded.projection, retain an independent legacy projection, and fail parity when their full semantic projections differ.

### F-012-04 — Deep-review parity converts reducer failure into legacy success

`runtime/lib/deep-review-shadow-parity/harness-adapter.ts:1637` · correctness

**Evidence.** ledgerProjection catches foldDeepReviewEvents exceptions and returns legacyReviewProjection; it also returns the legacy projection when folded.outcome is not projected. When folding succeeds, it compares only run identity, generation, dimensions, and active finding IDs, then returns the canonical legacy projection.

**Recommended action.** Propagate reducer exceptions and rebuild outcomes as parity failures, materialize the ledger projection from folded.projection, and compare the complete protected semantic surface rather than returning the legacy projection.

### F-013-03 — Closure context is only shallowly immutable

`runtime/lib/cross-mode-closures/context.ts:163` · correctness

**Evidence.** The context freezes its outer object and arrays, but stores `input.lifecycleEvent`, `input.budgetScope`, and each `input.sealedReferences` element by reference at lines 163-180. Later closure code reads mutable nested values such as `context.budgetScope.scope.scopeId` and sealed-reference fields after context creation, so a caller retaining the original input can redirect budget scope or artifact identity after validation.

**Recommended action.** Canonicalize and deeply clone/freeze all identity-bearing inputs before binding the context, or store immutable canonical digests and validated snapshots rather than caller-owned objects.

### F-013-04 — Reducer conformance accepts an event-unbound reducer

`runtime/lib/mode-contracts/conformance.ts:739` · correctness

**Evidence.** `runReducerFixtures` invokes the reducer twice and checks determinism, input immutability, freezing, reducer identity, and owned changed fields at lines 739-768, but never checks `first.appliedEventId` or `second.appliedEventId` against the fixture event identity. A deterministic reducer that ignores the supplied event and returns an unchanged state can therefore satisfy an accept fixture.

**Recommended action.** Require the reduction result's applied event identity to equal the verified fixture event and require the returned reducer to declare the fixture event type; add an explicit contract for legitimate no-op events.

### F-013-05 — Certificate conformance accepts evidence-unbound certificates

`runtime/lib/mode-contracts/conformance.ts:855` · correctness

**Evidence.** `runCertificateFixtures` calls `issueCertificate(fixture.evidence)` and only checks closed shape, authority neutrality, and non-empty evidence references and invalidation conditions at lines 855-864. It never checks that certificate evidence references derive from or cover the fixture's `evidenceReferences` and `inputDigests`, so a constant certificate containing unrelated non-empty references can pass.

**Recommended action.** Validate the certificate's evidence references against the fixture evidence and reject outputs whose identity, referenced digests, or invalidation scope are unrelated to the supplied evidence.

### F-013-06 — Deep-research and deep-review gates throw on malformed top-level input

`runtime/lib/deep-research-rollback-gate/mode-gate.ts:683` · correctness

**Evidence.** `evaluate` starts `Promise.all` over component evaluators at lines 682-697 and only performs guarded top-level validation at lines 711-717. Component access such as `input.parity` at line 267 occurs outside an outer catch, so `null` or `undefined` input rejects the promise instead of returning a blocked gate result. Deep-review has the same structure.

**Recommended action.** Guard the entire public evaluation boundary with a fail-closed top-level type check and return a deterministic blocked or malformed disposition for every invalid runtime input.

### F-016-04 — Write containment exempts pre-existing dirty paths by pathname only

`runtime/lib/deep-loop/write-containment.ts:295` · security

**Evidence.** detectNewOutOfScopeViolations builds a Set of preDispatchDirtyPaths and skips any post-dispatch path found in that set. The comparison is path-only: a child can overwrite, truncate, or delete an already-dirty file outside its artifact directory and the guard will treat the path as an exempt pre-existing change.

**Recommended action.** Snapshot file content or repository blob identity before dispatch and compare it afterward. Prefer clean isolated worktrees for write-capable children; do not exempt a path solely because it was dirty at startup.

### F-016-05 — Containment fails open when the artifact scope is outside the worktree

`runtime/lib/deep-loop/write-containment.ts:238` · security

**Evidence.** resolveArtifactScope returns null when the artifact realpath is outside the Git worktree, and detectNewOutOfScopeViolations returns an empty violation list when scope is null. fanout-run.cjs validates the base directory against the physical spec-folder path, while its namespace validation is lexical; a repository-local symlink to an external spec location can therefore pass dispatch validation and cause containment to be skipped.

**Recommended action.** Canonicalize spec and artifact paths before validation, require their realpaths to remain inside the intended worktree, and treat an unresolved or external scope as a hard dispatch failure rather than an empty violation set.

### F-018-04 — Cross-process diff-gated JSONL append is a check-then-append race

`runtime/lib/deep-loop/atomic-state.ts:337` · security

**Evidence.** `appendJsonlIfChangedAtomic` checks `readLastDiffFingerprint` at line 337, separately reads the current file at lines 344-346, and appends with `appendTextWithFsync` at line 347 without a cross-process lock or compare-and-swap. Two processes with fresh caches can observe the same absent fingerprint and both append the same event. `divergent-pivot.ts` passes a new `Map` cache for each append, so its in-memory deduplication does not close this race.

**Recommended action.** Perform fingerprint check and append under a per-file lock or atomic idempotency claim. Enforce event-ID uniqueness within the same serialized critical section.

### F-020-01 — Observability ledger persists unrestricted producer payloads

`runtime/lib/deep-loop/observability-events.cjs:109` · security

**Evidence.** normalizeObservabilityEvent stores `payload: { ...payload }` without an allowlist, recursive inspection, redaction, or sensitivity classification. appendObservabilityEvent then writes the complete envelope with `fs.appendFileSync(eventPath, `${JSON.stringify(envelope)}\n`, 'utf8')` at line 133. Actual bridges pass whole native objects: fanout-run.cjs line 315 passes `entry`, and round-state-jsonl.cjs line 101 passes `record`, so any prompt fragment, exception detail, credential, or PII placed in those extensible records is copied verbatim into observability-events.jsonl.

**Recommended action.** Define a closed payload schema per event type and persist only operational metadata. Add recursive secret/PII rejection or redaction at this shared sink as defense in depth, cover nested objects and arrays, bound string sizes, and add tests using credential-shaped keys and prompt/error text.

### F-020-02 — Loud lifecycle events disclose raw lineage labels on stderr

`runtime/lib/deep-loop/observability-events.cjs:137` · security

**Evidence.** For `stall_detected`, `orphan_requeued`, and `aborted`, the helper reads `envelope.payload.label` and interpolates it directly into `process.stderr.write(`[deep-loop] ${envelope.event}${label ? ` lineage=${label}` : ''}\n`)`. fanout-run.cjs passes its raw ledger entry into this helper and separately identifies `entry.label` as the lineage label. A label containing a user task name, path, email address, ticket subject, or accidentally pasted credential therefore reaches terminal capture, CI logs, and parent-process log collectors without escaping or redaction.

**Recommended action.** Emit an opaque run or lineage identifier instead of the label. If human-readable labels are required, sanitize and length-bound them, redact credential/PII patterns, and place their emission behind an explicit diagnostic policy.

### F-022-02 — Research legacy compatibility blocks normal lifecycle events

`runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:90` · traceability · **CONFIRMED-WITH-CORRECTION · CUTOVER BLOCKER**

**Evidence.** recordTarget() recognizes only type=config, type=iteration, and the three mapped event stems resumed, restarted, and blocked_stop. decideDeepResearchCompatibility() returns blocked with unknown-legacy-record when no target exists. The live research workflow emits graph_convergence at line 530, manualStop at line 823, config_warning at line 515, and lock_released at line 1604; these records are neither mapped nor pinned, so ordinary lifecycle logs cannot be losslessly migrated.

**Recommended action.** Define a complete mapping or explicit pinning policy for every event emitted by the live research workflow, then run the compatibility adapter against captured real state logs rather than only synthetic unit records.

**Verification.** CONFIRMED: LEGACY_EVENT_STEMS maps exactly 3 events (resumed, restarted, blocked_stop) at :30-34; PINNED_LEGACY_EVENTS covers only 7 (idea_observed/promoted/rejected, ideaRejectedRemoved, ideaRejectedReset, stuckRecovery, userPaused) at :36-44; recordTarget returns null otherwise (:90-95) and null routes to decision(blocked, unknown-legacy-record) at :168. The live research workflow emits graph_convergence (1), config_warning (3), lock_released (1) — verified NOT mapped and NOT pinned, therefore blocked. A real legacy state log cannot be migrated: the first ordinary lifecycle record blocks it. CORRECTION to the finding: it also cited manualStop at line 823, but manualStop appears 0 times in deep-research-auto.yaml — that sub-claim is wrong; the other three carry the finding.

### F-022-03 — Review legacy compatibility omits the live review event vocabulary

`runtime/lib/deep-review-ledger-schema/legacy-compatibility.ts:89` · traceability · **CUTOVER BLOCKER**

**Evidence.** The review recordTarget() supports only type=config, type=iteration, and resumed, restarted, or blocked_stop. The live review workflow emits graph_convergence at line 525, claim_adjudication at lines 1184 and 1190, userPaused at line 951, and synthesis_complete at line 1526. None are in the review mapping or pinned set, so a normal review log reaches the unknown-legacy-record blocked path instead of a typed review event.

**Recommended action.** Add lossless compatibility mappings or explicit migration dispositions for every review event emitted by the command workflow, and verify them with an end-to-end replay fixture derived from real review state.

### F-023-01 — Alignment upcaster treats every iteration as lane completion

`runtime/lib/deep-alignment-ledger-schema/legacy-compatibility.ts:92` · traceability · **CUTOVER BLOCKER**

**Evidence.** `recordTarget()` maps every record with `type === 'iteration'` to `deep_alignment.lane_completed`. The live command dispatches one lane-slice iteration at `.opencode/commands/deep/assets/deep-alignment-auto.yaml:352-354`, and the agent contract requires each per-iteration record to use `type:"iteration"` at `.opencode/agents/deep-alignment.md:226-230`. A migrated slice is therefore represented as terminal lane completion rather than an iteration/convergence observation.

**Recommended action.** Require an explicit lane-terminal marker before emitting `lane_completed`, or add a dedicated upcast path for per-slice iteration records. Test with a command-generated multi-slice lane stream and verify the reducer does not complete the lane after the first slice.

### F-023-02 — Alignment compatibility cannot migrate live identity and convergence records

`runtime/lib/deep-alignment-ledger-schema/legacy-compatibility.ts:77` · traceability · **CUTOVER BLOCKER**

**Evidence.** `hasStableIdentity()` requires `runId`, `sessionId`, and `authorityEpochId`, but the live config record at `.opencode/commands/deep/assets/deep-alignment-auto.yaml:252` emits only `sessionId`. The same file emits `type:"event", event:"convergence_check"` at line 732, while `LEGACY_EVENT_STEMS` registers only `resumed`, `restarted`, and `blocked_stop`. The decision path therefore returns `pin-old-runtime` for normal config/iteration records and `blocked:unknown-legacy-record` for convergence records.

**Recommended action.** Stamp live records with the authenticated run and authority identity required by the schema, register the actual convergence event vocabulary, and add fixtures copied from command output rather than synthetic identity-complete records.

### F-023-03 — Council compatibility rejects live heartbeat and terminal state records

`runtime/lib/deep-ai-council-ledger-schema/legacy-compatibility.ts:194` · traceability · **CUTOVER BLOCKER**

**Evidence.** `PINNED_LEGACY_EVENTS` contains `progress_record`, but the decision checks `input.event`; the live heartbeat is `{type:'progress_record', event:'session_heartbeat'}` at `deep-ai-council/scripts/orchestrate-session.cjs:423-431`, so it is neither pinned nor mapped and becomes `unknown-legacy-record`. The live writers also emit `type:'topic_completed'` and `type:'round_completed'` at `orchestrate-session.cjs:520-524` and `orchestrate-topic.cjs:257-261`, neither of which appears in `LEGACY_EVENT_STEMS`; the round payload additionally lacks the required `runId` checked at line 89.

**Recommended action.** Match pinned records using the actual record discriminator, register the shipped session/topic/round event vocabulary, and bind missing run identity from authenticated session context before migration.

### F-024-01 — Skill Benchmark cannot migrate shared common legacy lifecycle records

`runtime/lib/skill-benchmark-ledger-schema/legacy-compatibility.ts:28` · traceability · **CUTOVER BLOCKER**

**Evidence.** The Skill Benchmark compatibility table only maps `benchmark_run_planned` to `skill_benchmark.run_planned` at lines 28-30. For every other non-current record, `recordTarget` returns null and `decideSkillBenchmarkCompatibility` returns `blocked` at lines 147-150. This means legacy shared common lifecycle records such as common session, candidate, and evaluation records handled by `deep-improvement-common-ledger-schema/legacy-compatibility.ts` never reach the common upcaster, even though `skill-benchmark-ledger-types.ts` imports `DeepImprovementCommonEventStems` and `skill-benchmark-ledger-schema.ts` incorporates `deepImprovementCommonEventDefinitions()` into the Skill Benchmark registry.

**Recommended action.** Mirror the agent/model variant pattern: delegate unrecognized Skill Benchmark-specific records through `decideDeepImprovementCommonCompatibility` and `upcastLegacyDeepImprovementCommonRecord`, enforce the Skill Benchmark variant scope, and add migration tests for common run, candidate, and evaluation records.

### F-024-02 — Common and Agent Improvement mode gates trust caller-supplied version bindings

`runtime/lib/deep-improvement-common-rollback-gate/mode-gate.ts:320` · traceability

**Evidence.** Deep Improvement Common validates `eventSchemaVersion`, `reducerVersion`, and `projectionVersion` only with `isToken(...)` at lines 320-322, then copies those values into the readiness certificate at lines 1000-1005. Agent Improvement repeats this pattern in `agent-improvement-rollback-gate/mode-gate.ts` lines 222-226. Model Benchmark and Skill Benchmark instead compare these fields with installed envelope, event-schema, reducer, and projection constants. The 013 and 016 contracts require gate evidence to identify the exact installed versions, so common/agent can produce internally consistent readiness certificates carrying stale or incorrect version labels.

**Recommended action.** Import the installed envelope, event-schema, reducer, and projection-version constants into the common and agent mode gates and require exact equality, matching the model-benchmark and skill-benchmark gates. Add negative tests using stale but syntactically valid version tokens.

### F-036-01 — Run cache erases the pool-item generic

`runtime/lib/branch-leases-waves/durable-orchestrator.ts:591` · maintainability

**Evidence.** initializeRun<TItem> stores CompiledBranchRun<TItem> in Map<string, CompiledBranchRun<unknown>> via a cast at line 362. runAuthorizedWave<TItem> retrieves the same runId and casts it to CompiledBranchRun<TItem> at line 591, then passes poolItem to the caller's typed worker at lines 625-675. Independent calls can initialize a run with string items and invoke it with TItem=number.

**Recommended action.** Bind the compiled run to an opaque typed handle returned by initialization, or remove the generic cache and require a revalidated typed manifest at execution time.

### F-036-02 — Pivot events are cast after generic-only validation

`runtime/lib/deep-loop/divergent-pivot.ts:528` · maintainability

**Evidence.** readEventStore checks only generic event fields and then casts parsed JSON directly to PivotEvent. completedResultFromEvent validates selectedCandidate but only checks isRecord(event.agreement) before casting it to PivotAgreementResult at line 742; event-specific agreement fields are never validated.

**Recommended action.** Use a discriminated per-event parser that validates every required nested field before constructing the PivotEvent union.

### F-036-03 — Persisted pivot config is asserted as a closed shape after shallow checks

`runtime/lib/deep-loop/divergent-pivot.ts:995` · maintainability

**Evidence.** readPersistedConfig checks only that the JSON value is an object with the expected pivotId and an acceptedCandidates array, then returns it as PersistedPivotConfig. Later code dereferences seats at lines 1168 and 1225 and usageAtStart at line 1305 without validating those fields or their nested members.

**Recommended action.** Parse the complete persisted configuration schema, including identity, limits, seats, candidates, usage counters, and saturated directions; reject malformed or incomplete resume artifacts.

### F-036-04 — Leaf state records accept wrong-typed authoritative fields

`runtime/lib/deep-loop/leaf-artifact-writer.ts:149` · maintainability

**Evidence.** validateReported casts the payload to Record<string, unknown>, checks only field presence plus status and artifactsChecked, and does not validate laneId, authority, artifactClass, findingsCount, or array element types. writeLeafArtifacts then persists the unchecked record at line 226 and also casts deltaFindings at lines 229-237.

**Recommended action.** Introduce a closed runtime parser for the state record and finding entries, validating string identities, allowed artifact classes, nonnegative integer counts, and audited-path strings before persistence.

### F-037-01 — State-log append failure strands the write-once delta and defeats redispatch

`runtime/lib/deep-loop/leaf-artifact-writer.ts:243` · maintainability

**Evidence.** The writer performs sequential writes for iterationMdPath, deltaPath, and stateLogPath at lines 253-255, then converts any failure into ok:false at lines 256-257. Because the delta is write-once and an existing delta causes rejection at lines 250-251, a successful delta write followed by a failed state-log append leaves a retry unable to complete the iteration.

**Recommended action.** Stage all outputs and commit them atomically, or remove only newly-created artifacts when the state-log append fails. Make retries idempotent for matching content before claiming all-or-nothing behavior.

### F-039-02 — Leaf artifact persistence is not all-or-nothing

`runtime/lib/deep-loop/leaf-artifact-writer.ts:253` · correctness

**Evidence.** writeLeafArtifacts writes the narrative, then the write-once delta, then appends the state record at lines 253-255. Any failure after the first write returns ok:false without rollback; a retry then fails immediately because the delta already exists at lines 250-252, leaving the iteration permanently unpersistable despite the documented all-or-nothing and redispatch contract.

**Recommended action.** Stage all three artifacts under temporary names, append or replace through a recoverable transaction protocol, and remove staged/partial outputs on failure. Make retry detection distinguish a complete committed iteration from recoverable partial files.

## `runtime/manual-testing-playbook` (1)

### F-030-02 — Fourteen manual scenarios prescribe test commands with dead runtime paths

`runtime/manual-testing-playbook/coverage-graph/coverage-graph-fuzzy-merge.md:45` · traceability

**Evidence.** The scenario requires `cd .opencode/skills/runtime/`, but that directory does not exist; the live package is `.opencode/skills/system-deep-loop/runtime/package.json`. Seven fan-out scenarios instead change into system-spec-kit/mcp-server and invoke `../../runtime/...`, which resolves to the same missing `.opencode/skills/runtime` location. Across the runtime playbook, fourteen scenario files contain one of these dead path forms, so their mandatory EXIT-0 validation cannot execute as documented.

**Recommended action.** Run tests from `.opencode/skills/system-deep-loop/runtime` using its package test script, repair every stale relative target, and add a documentation check that resolves each prescribed cwd and test path before accepting the playbook.

## `runtime/references` (1)

### F-038-03 — Runtime script contract omits the supported council loop type

`runtime/references/script-interface-contract.md:67` · maintainability

**Evidence.** The contract restricts --loop-type to research or review. The actual status.cjs, upsert.cjs, and query.cjs implementations accept council, and runtime/lib/council/README.md documents those scripts with loopType=council.

**Recommended action.** Update the interface contract with council's accepted arguments, lifecycle, and specialized storage semantics, and distinguish it from the research/review/context database path.

## `runtime/scripts` (15)

### F-003-03 — Malformed delta rows bypass strict corruption handling

`runtime/scripts/reduce-state.cjs:154` · correctness

**Evidence.** loadDeltaPayloads parses delta corruption warnings, logs them, and converts them to null placeholders at lines 163-170. The caller then filters those placeholders at lines 2095-2098. Strict failure at lines 2069 and 2116 only uses corruptionWarnings from the main state log, so a malformed delta row can silently remove a finding from the registry and dashboard. reduce-alignment-state.cjs has the same issue at lines 145-150.

**Recommended action.** Aggregate corruption warnings from every delta file into the reducer's authoritative corruption set and fail closed unless an explicit lenient mode is selected; also surface invalid structured records rather than silently dropping them.

### F-010-03 — Fan-out discards invocation provenance before spawning

`runtime/scripts/fanout-run.cjs:2272` · correctness

**Evidence.** finalizeLineageCommand() returns effectiveConfig and invocationFingerprint at lines 1496-1516. The worker destructures only command, args, and input from buildLineageCommand() at lines 2272-2286, dropping both provenance values. The subsequent status-ledger, process, result, and summary paths never bind the spawned command to that generated effective configuration or fingerprint, and fanout-run imports only environment/recursion helpers from executor-audit rather than its receipt path.

**Recommended action.** Carry effectiveConfig and invocationFingerprint through the worker, write an intent receipt before spawn and a completion receipt after exit, and include their identifiers in lineage status and orchestration-summary records. Fail closed if the receipt cannot be durably written.

### F-016-06 — Standalone Codex dispatch forwards the entire parent environment

`runtime/scripts/codex-dispatch.cjs:122` · security

**Evidence.** dispatchCodex calls spawnSync with env: { ...process.env, AI_SESSION_CHILD: '1' }. Unlike the fanout executor environment builder, this passes unrelated credentials, configuration variables, NODE_PATH, and other process controls into the external Codex child.

**Recommended action.** Reuse an explicit executor environment allowlist and pass only required authentication, locale, path, and session variables. Exclude unrelated provider secrets, module-loading controls, and arbitrary user configuration.

### F-SOL-01 — Alignment corpus/config bijection unvalidated — omitted lane silently drops from coverage

`runtime/scripts/reduce-alignment-state.cjs:399` · correctness · **CONFIRMED**

**Evidence.** A lane in config but absent from a non-empty corpus resolves to null discovery -> NOT_APPLICABLE -> excluded from the coverage ratio AND from partitioning, so remaining lanes can still reach 1.0. Found by adversarial verification of the round-1 coverage fix.

**Recommended action.** Once discovery yields a non-empty corpus, every configured lane must be represented; a missing configured lane is a typed integrity fault, not a silent NOT_APPLICABLE.

**Verification.** found while adversarially verifying the round-1 coverage fix; pure-function probes reproduced each

### F-SOL-02 — Duplicate/orphan corpus lane IDs accepted; the two readers disagree

`runtime/scripts/reduce-alignment-state.cjs:188` · correctness · **CONFIRMED**

**Evidence.** Reducer identity/discovery Maps OVERWRITE on a repeated laneId while totalDiscovered SUMS all artifacts; the convergence reader overwrites or ignores. The two views then disagree, permitting CONVERGED while overallVerdict is FAIL. Orphan corpus lanes matching no configured lane are also accepted.

**Recommended action.** Duplicate laneIds and orphan corpus lanes are typed integrity faults in BOTH readers; both must reach the same conclusion on identical bytes.

**Verification.** found while adversarially verifying the round-1 coverage fix; pure-function probes reproduced each

### F-SOL-04 — Alignment lane-ID normalization differs between the two readers

`runtime/scripts/reduce-alignment-state.cjs:212` · correctness · **CONFIRMED**

**Evidence.** check-convergence.cjs:147 normalizes lane IDs with .trim() while reduce-alignment-state.cjs:212 collapses internal whitespace. Identical corpus bytes can be accepted by one reader and rejected by the other, or classified ORPHAN by one and DUPLICATE by the other. Also an OVER-TIGHTENING regression: a legitimate scope with repeated internal spaces is preserved by scoping validation but collapsed by the reducer, so an honest corpus lane is falsely rejected as CORPUS_ORPHAN_LANE_ID.

**Recommended action.** Not supplied by the reporting iteration — derive one when triaging.

**Verification.** in-memory probes reproduced each; found while verifying round 2 of the coverage fix

### F-SOL-07 — Repeated bare artifact counts re-credit coverage for unmeasured identities

`runtime/scripts/reduce-alignment-state.cjs:381` · correctness · **CONFIRMED**

**Evidence.** When iterations report artifactsChecked as bare numbers instead of paths, counts accumulate and are only clamped at the canonical-set size (reduce-alignment-state.cjs:381-407; check-convergence.cjs:209-215). Repeatedly re-checking the same slice therefore reaches full coverage without any distinct identity being audited.

**Recommended action.** Not supplied by the reporting iteration — derive one when triaging.

**Verification.** in-memory probes reproduced each; found while verifying round 2 of the coverage fix

### F-032-01 — Malformed query bounds return success with incorrect data

`runtime/scripts/query.cjs:100` · maintainability

**Evidence.** `limit` is computed with `Number(args.limit || 50)` and no finite/integer validation; `--limit nope` produces `NaN`, which is passed to array slicing while the script still emits status ok. `maxDepth` repeats the same pattern at lines 131 and 218.

**Recommended action.** Validate numeric options before opening the database and return INPUT_VALIDATION with exit code 3 for non-finite or invalid values.

### F-032-02 — Invalid fanout schemas are reported as generic script failures

`runtime/scripts/fanout-run.cjs:2062` · maintainability

**Evidence.** `parseFanoutConfig(rawConfig)` throws `ExecutorConfigError`, but that error has no `code`; the final handler delegates to `classifyExitCode`, which maps only INPUT_VALIDATION to 3 and otherwise returns 1/SCRIPT_ERROR.

**Recommended action.** Wrap configuration-schema failures as INPUT_VALIDATION or teach the shared classifier to recognize ExecutorConfigError.

### F-032-03 — Misspelled reducer flags silently redirect writes

`runtime/scripts/reduce-state.cjs:2181` · maintainability

**Evidence.** The CLI searches only for an exact `--artifact-dir`, filters all flag-looking tokens out of positional arguments, and ignores unknown flags and extra positionals. A typo such as `--artifcat-dir <path>` therefore leaves `artifactDir` undefined and writes to the default artifact root while exiting successfully.

**Recommended action.** Use a strict parser with an allowlist, required values, and rejection of unknown flags or extra positional arguments before invoking the reducer.

### F-032-04 — Missing or unreadable event files produce SCRIPT_ERROR instead of input validation

`runtime/scripts/upsert.cjs:131` · maintainability

**Evidence.** A valueless `--events` becomes boolean `true`; `readEvents` then calls `path.resolve(true)`, and a nonexistent path throws ENOENT. Neither error is converted to INPUT_VALIDATION, so the catch path returns exit 1 instead of the documented input-error code 3.

**Recommended action.** Require a string value during argument parsing and translate file-read failures for user-supplied event paths into structured INPUT_VALIDATION errors.

### F-032-05 — Context merge mode silently reads research artifacts

`runtime/scripts/fanout-merge.cjs:1097` · maintainability

**Evidence.** The CLI accepts `context` at line 1061, but selects `findings-registry.json`, `deep-research-findings-registry.json`, and `deep-research-state.jsonl`, then calls `mergeResearchRegistries` at line 1146. A context tree can therefore return success with missing or misinterpreted research-shaped output.

**Recommended action.** Reject context with INPUT_VALIDATION until a context-specific artifact map exists, or implement a dedicated context merge path.

### F-RES-05 — Lane IDs are not injective across scope types or comma-containing values

`runtime/scripts/reduce-alignment-state.cjs:100` · correctness · **CONFIRMED**

**Evidence.** Lane identity omits scope type and joins array values with a comma-space, so paths:["docs/"] and globs:["docs/"] collide, as do paths:["a","b"] and paths:["a, b"]. Whitespace is now preserved consistently, but the serialization remains lossy. Consequence is inverted from the original defect: legitimate distinct lanes now collide and the run halts with a duplicate-corpus integrity fault.

**Recommended action.** Include scope type in lane identity and use a separator that cannot occur in scope values, or hash the canonical scope object.

**Verification.** Found by the final adversarial verification of the alignment coverage fix; recorded as a documented residual rather than fixed in this session.

### F-037-03 — Mechanical iteration verification can accept a stale record after corruption

`runtime/scripts/verify-iteration.cjs:57` · maintainability

**Evidence.** The JSONL reader skips malformed lines at lines 57-76. Verification then selects the last parseable matching iteration with findLast at lines 145-159, so a malformed newest append can be ignored in favor of an older valid record. The auto workflow invokes this verifier as the post-dispatch gate at deep-review-auto.yaml lines 1454-1457.

**Recommended action.** Track parse failures and fail verification when corruption occurs in the current append region. Never satisfy the current iteration using an older record after a newer malformed append.

### F-037-04 — Malformed delta rows are dropped while the iteration still passes

`runtime/scripts/reduce-state.cjs:154` · maintainability

**Evidence.** loadDeltaPayloads logs a warning and returns parsed records with null placeholders when delta parsing encounters malformed lines at lines 154-170. reduceReviewState later flattens the payloads and filters null values at lines 2093-2099. post-dispatch validation only requires the last parseable iteration record, so malformed finding rows can disappear while the iteration remains valid.

**Recommended action.** Parse each review delta strictly and block reduction or completion on any malformed row, or preserve corruption as a blocking state that cannot be filtered away.

## `runtime/tests` (3)

### F-034-01 — Aggregate suites register independently discovered tests a second time

`runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:64` · maintainability

**Evidence.** Lines 65-71 side-effect-import seven executable `*.vitest.js` suites. The same pattern exists at model-benchmark-rollback-gate.vitest.ts:70-76 and skill-benchmark-rollback-gate.vitest.ts:74-80. runtime/vitest.config.ts:17 independently discovers every `tests/**/*.{vitest,test}.ts`, so `npm test` collects each imported source suite directly and also registers its tests inside each rollback aggregate. Static registration counts show the agent aggregate imports at least 100 tests, while the model and skill aggregates import similarly large suites; nested imports such as agent-improvement-resume-adapter.vitest.ts:62 add further duplication.

**Recommended action.** Stop importing executable test files. Extract reusable contract cases into non-discovered factory modules and invoke those factories explicitly, or rely on Vitest discovery and validate cross-suite coverage through metadata. Add a lint/test guard that rejects imports whose target matches the test-discovery pattern.

### F-034-02 — File-wide timeout overrides can hide a hung test for a day

`runtime/tests/unit/model-benchmark-resume-adapter.vitest.ts:16` · maintainability

**Evidence.** The module executes `vi.setConfig({ testTimeout: 86_400_000 })`, raising every test in the file from the configured 30 seconds to 24 hours without a matching reset. skill-benchmark-resume-adapter.vitest.ts:2067 and skill-benchmark-rollback-gate.vitest.ts:85 similarly install one-hour timeouts; the rollback aggregate explicitly extends that budget across all seven imported suites. A deadlock, leaked process, or unresolved promise therefore occupies a serial test worker for hours instead of producing timely failure evidence.

**Recommended action.** Remove module-wide timeout mutation. Put bounded timeouts only on demonstrated slow cases, split expensive replay scenarios from unit tests, and add an independent process watchdog with a CI-scale upper bound. Require justification for any timeout exceeding the suite default.

### F-034-03 — Shared spawn timeout never settles when the child ignores SIGTERM

`runtime/tests/helpers/spawn-cjs.ts:331` · maintainability

**Evidence.** On timeout, lines 331-335 only set `timedOut = true` and call `child.kill('SIGTERM')`; the returned promise resolves exclusively from the `close` listener at lines 345-354. A child that ignores SIGTERM therefore remains alive and the promise never settles. The unit test at spawn-cjs.vitest.ts:40-44 uses a cooperative timer process with no SIGTERM handler, so it passes without exercising the failure mode. This helper is used by lifecycle and integration suites, including callers that request 15-second timeouts.

**Recommended action.** Implement two-stage termination: send SIGTERM, wait a short bounded grace period, then kill the process group with SIGKILL and settle the promise exactly once. Add a test fixture that ignores SIGTERM and spawns a descendant, asserting bounded completion and complete process-tree cleanup.

## `shared/behavior-benchmark` (1)

### F-035-03 — Benchmark postconditions can depend on arbitrary host paths

`shared/behavior-benchmark/behavior-bench-run.cjs:147` · maintainability

**Evidence.** `resolveProbePath` returns `path.resolve(rawPath)` unchanged for every absolute path at line 151. `evaluatePostconditions` then uses that result for existence, JSON-field, and text probes. The framework explicitly documents that absolute paths remain absolute, so a schema-v2 benchmark can pass or fail based on files outside its fixture or repository, contradicting the suite's hermetic-fixture claim.

**Recommended action.** Reject absolute probe paths and require resolved paths to remain beneath the fixture root. If repository-level probes are needed, expose a separate explicit probe kind with a declared, validated allowlist.

## `shared/references` (1)

### F-035-02 — Shared-packet leaf identity makes two workflow routes unobservable

`shared/references/smart-routing.md:42` · maintainability

**Evidence.** Lines 42-47 state that all `deep-improvement` leaf paths bind to the first-declared `agent-improvement` mode, so model-benchmark and skill-benchmark rows cannot emit their actual observed workflowMode. Lines 122-126 consequently instruct benchmark readers to reinterpret the observed `agent-improvement` identity rather than treating it as a routing miss. Any replay or telemetry consumer therefore loses the distinction between three registered workflow modes.

**Recommended action.** Bind leaf identity using `(workflowMode, packet, leafResourceId)` rather than deriving mode from packet ownership. Allow one packet path to register mode-qualified leaf entries and add replay tests proving all three improvement modes remain distinct.

## `shared/rollout` (1)

### F-035-01 — Four commands are promoted before the required evidence mechanism exists

`shared/rollout/command-injection-rollout.json:2` · maintainability

**Evidence.** The map sets research, review, ai-council, and alignment to `fix`. The adjacent rollout README lines 17-18 says manifest capture and the CI comparator are deferred, while promotion-rule.md lines 3-8 requires three consecutive green comparator runs, a green comparator, an unchanged fallback hash, and zero unexpected baseline divergence before any flip. The checked-in promotion state therefore cannot be reproduced or audited under its own governance contract.

**Recommended action.** Make promotion evidence machine-readable and required by a validator that rejects `fix` entries without matching capture manifests, fallback hashes, comparator runs, and baseline-divergence results. Revert unsupported entries to `fallback` until that evidence exists.

## `skills/system-spec-kit` (1)

### F-029-03 — Recursive strict validation follows an unfrozen live child set

`skills/system-spec-kit/scripts/spec/validate.sh:1039` · traceability · **CONFIRMED**

**Evidence.** The recursive path globs every direct NNN-* child under the supplied parent and validates each child containing spec.md or description.json; it has no phase-manifest boundary. The 036 parent says phases 003-017 are the implementation program at spec.md line 209 but now contains phases 018-020. Phase 019 and 020 checklists contain unchecked items without the required CHK-* [P*] form, while orchestrator.ts lines 550-560 emits PRIORITY_TAGS warnings for exactly that shape; strict mode propagates a nonzero child result. Phase-016 spec.md also conflicts between 'complete 006 tree' at lines 93-94 and '036 parent tree' at line 122.

**Recommended action.** Bind the acceptance command to a hashed child manifest for the intended 001-017 program, or formally expand phase 016 to cover every current 036 child and repair them all. Record the resolved parent path, ordered child set, validator version, and per-child result in gate evidence.

**Verification.** validate.sh recursive globs every numbered child with no phase-manifest boundary, so phases added after the original program participate and their non-standard checklist item form trips strict warnings, making a recursive strict run red for reasons unrelated to the migration. Durable fix is binding acceptance to a hashed child manifest for the intended program.

## `specs/system-deep-loop` (5)

### F-025-01 — Deep Review resume checklist certifies scenarios absent from its cited suite

`specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/005-resume-adapter/checklist.md:60` · traceability · **CUTOVER BLOCKER**

**Evidence.** Lines 59-71 mark replay-frontier, malformed-event, concurrent-resume, changed-fingerprint, finding-lineage, and concurrency requirements complete using the same "focused Vitest 6/6" citation. The current deep-review-resume-adapter.vitest.ts defines 12 cases: eight ordinary tests plus four forged-confirmation parameter cases. Its cases cover compatibility, forged confirmations/checkpoints, certificate-frontier mismatch, split streams, and sequential idempotency, but contain no concurrent resume fixture, same-versus-independent-lineage concurrency fixture, or introduced/fixed/preexisting finding-lineage assertions.

**Recommended action.** Reopen checklist items without a matching fixture. Bind each completed item to exact test names and fixture cases, plus the candidate SHA or suite-content digest and discovered test count.

### F-025-02 — Council resume checklist overstates coverage behind obsolete 6/6 evidence

`specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter/checklist.md:58` · traceability · **CUTOVER BLOCKER**

**Evidence.** Every completed requirement cites the same 6/6 run. The current deep-ai-council-resume-adapter.vitest.ts defines ten tests at lines 1545-1827, covering dispositions, registry trust, fingerprint/version drift, forged effect confirmation, certificate rejection, checkpoint/frontier corruption, cursor splitting, and sequential idempotency. It has no named fixture for worker completion-order invariance, partial deliberation or critique recovery, dispatch-without-result/result-without-fold crashes, or blinded-scorer information leakage, despite lines 59-69 and 85 marking those claims complete.

**Recommended action.** Replace the blanket run citation with a requirement-to-test matrix. Add the missing partial-state, crash-boundary, ordering, and information-surface fixtures before retaining those completion marks.

### F-025-03 — Council shadow-parity checklist contradicts its own implementation evidence

`specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity/checklist.md:44` · traceability · **CONFIRMED · CUTOVER BLOCKER**

**Evidence.** All completed items state that implementation-summary.md records a focused 26/26 run. The referenced implementation summary instead records 39 tests passed at line 75, and the current deep-ai-council-shadow-parity.vitest.ts statically defines 39 cases after expanding its parameterized matrices. The checklist supplies no source digest that could identify an earlier 26-case suite snapshot.

**Recommended action.** Reconcile the recorded run count and bind the evidence to an immutable candidate SHA and suite digest. Map each checklist claim to the relevant subset of the 39 cases.

**Verification.** Three-way mismatch confirmed: the council shadow-parity checklist repeats '26/26' across CHK-006/007/008/009/010 while citing implementation-summary.md as the evidence source; that summary line 75 records 39 tests passed; the suite defines 23 literal it()/test() blocks (39 plausible post-matrix-expansion, 26 matches nothing). The [x] P0/P1 marks rest on a count reproducible from no source. ACCOUNTABILITY: this session landed that column and reconciled the parent to Complete, so this is a defect in my own completion claim, not someone else's.

### F-025-04 — Deep Research certificate evidence uses stale counts and displaced line anchors

`specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts/checklist.md:67` · traceability · **CUTOVER BLOCKER**

**Evidence.** Lines 67, 72, 83, and 92 cite a 31/31 suite, while the current deep-research-certificates.vitest.ts defines 36 tests. The line-specific evidence is also displaced: line 68 points to test line 859, which is now helper data, while the idempotency/conflict test begins at line 1812; line 101 points to line 938, now fixture timestamp data, while the wrong-kind test begins at line 1908. Following the checklist therefore does not reach the claimed verifier evidence.

**Recommended action.** Use stable test names or generated test identifiers instead of raw line numbers. Refresh the count, record the suite-content digest, and verify every completed requirement still maps to a current positive or negative case.

### F-029-01 — Review manifest mixes ignored local state with an incomplete tracked evidence set

`specs/system-deep-loop/036-deep-loop-innovation/001-whole-system-gate/goal-file-manifest.txt:1075` · traceability · **CONFIRMED-WITH-CORRECTION**

**Evidence.** An exact set comparison with git ls-files found all 48 omissions under tracked benchmark/reports directories, while lines 1075 and 1746 include two ignored, untracked paths: runtime/.opencode/skills/.advisor-state/skill-graph-generation.json and runtime/package.json. benchmark/README.md lines 46-62 defines reports/baseline as the frozen before-comparison anchor, so omitting reports is not equivalent to excluding disposable output. Conversely, dist/ is globally ignored as build output and no tracked system-deep-loop dist path exists.

**Recommended action.** Generate and validate separate candidate-source and gate-evidence manifests from the Git tree. Reject ignored or untracked entries, include the curated benchmark baseline/evidence required by the gate, and explicitly document that generated dist output is excluded and rebuilt by a recorded toolchain.

**Verification.** Both cited untracked paths ARE in my manifest (runtime/package.json and the advisor-state json), so ignored local state was included as scope. benchmark/reports: 33 tracked files excluded (leaf said 48; count differs, defect identical) including the declared frozen baseline. DISPOSITION: manifest deliberately FROZEN mid-run, because re-scoping at iteration 30 would mean iterations 1-29 audited a different corpus than 30-40, which is worse than a documented imperfection. Recorded as a known limitation of this run.

---

# P2 — 26 findings

## `README.md` (2)

### F-026-08 — Top-level README names an unregistered external-adapter backend

`README.md:63` · traceability

**Evidence.** The README lists backendKind values as runtime convergence loop, improvement host, or external adapter. mode-registry.json defines only runtime-loop-type and improvement-host, and no mode uses an external-adapter backend.

**Recommended action.** Remove the unsupported backend kind from the contract or add an explicit registry schema and implementation for it.

### F-035-04 — Hub documentation advertises an unsupported backend kind

`README.md:63` · maintainability

**Evidence.** The README says `backendKind` may select an external adapter and line 65 describes routing null loop types to that adapter. mode-registry.json lines 8-9 defines only `runtime-loop-type` and `improvement-host`, and every registered mode uses one of those two values. The mode-authoring documentation therefore describes a backend contract absent from the registry.

**Recommended action.** Remove the external-adapter wording or add it to the registry schema, validation, and mode-authoring checklist with an implemented dispatch path.

## `benchmark/reports` (1)

### F-033-04 — Benchmark report index is empty beside existing report folders

`benchmark/reports/README.md:25` · maintainability

**Evidence.** The RUN INDEX contains only the table header, while baseline and three compiled-routing run folders exist on disk. append-run-index.cjs updates the index only when a future run writes through the current code path, so existing evidence remains undiscoverable.

**Recommended action.** Backfill the index from existing folders and add a drift check comparing indexed folders with report directories.

## `commands/deep` (1)

### F-003-04 — Auto research convergence never persists graph snapshots

`commands/deep/assets/deep-research-auto.yaml:610` · correctness

**Evidence.** The step action at line 609 says to persist the graph decision snapshot, but the command at line 610 omits both --persist-snapshot and --iteration. convergence.cjs only writes a snapshot when both conditions are true at lines 807-821, so normal auto research runs always report snapshotPersistence as not_requested and accumulate no score-delta or sliding-window baseline.

**Recommended action.** Pass --persist-snapshot and the validated current iteration from the workflow, then verify snapshot persistence is included in the loop's durability contract.

## `deep-ai-council/README.md` (2)

### F-026-06 — Council documentation undercounts manual-test scenarios

`deep-ai-council/README.md:196` · traceability

**Evidence.** The README and SKILL.md describe 32 scenarios across 9 categories. The root manual-testing-playbook.md states 33 scenarios, and the playbook contains DAC-001 through DAC-033.

**Recommended action.** Update the documented count to 33 and derive or validate the count from the playbook index.

### F-026-09 — Council README omits alignment from the current active roster

`deep-ai-council/README.md:128` · traceability

**Evidence.** The README describes the current roster as research, review, ai-council, and improvement, while the parent registry and SKILL.md include alignment as the fifth active family.

**Recommended action.** Synchronize the council README roster with the authoritative registry.

## `deep-alignment/README.md` (3)

### F-001-02 — Deep-alignment adapter inventory omits a registered adapter variant

`deep-alignment/README.md:102` · traceability

**Evidence.** The README says five adapters ship and lists sk-doc, sk-git, sk-design, sk-code, and sk-design-live-render. scoping.cjs registers sk-doc-command as an additional adapter variant, and scripts/adapters/sk-doc-command.cjs exists.

**Recommended action.** Document sk-doc-command explicitly or clarify that the count excludes adapter variants; align the README, catalog, and registry.

### F-026-02 — Deep-alignment README omits the registered sk-doc-command adapter

`deep-alignment/README.md:102` · traceability

**Evidence.** The README enumerates five adapters: sk-doc, sk-git, sk-design, sk-code, and sk-design-live-render. scoping.cjs registers sk-doc-command as an additional sk-doc variant, and scripts/adapters/sk-doc-command.cjs exists.

**Recommended action.** Document sk-doc-command and distinguish four authorities from six adapter variants.

### F-038-04 — Alignment README documents a nonexistent --convergence flag

`deep-alignment/README.md:144` · maintainability

**Evidence.** The README lists --convergence=N as part of the command contract. The actual alignment command and both workflow assets use --coverage-threshold, --stability-window, and --convergence-mode; no --convergence option appears in the command surface.

**Recommended action.** Replace the stale flag with the implemented coverage, stability, and convergence-mode options and update adjacent examples and references.

## `deep-alignment/assets` (1)

### F-033-06 — Alignment benchmark contains a broken local evidence link

`deep-alignment/assets/conformance-benchmark/command-surface/conformance-benchmark.md:164` · maintainability

**Evidence.** The evidence pointer targets .opencode/specs/system-deep-loop/066-command-surface-benchmark/004-command-lane-integration/alignment/, which is absent from the workspace; the local-link scan found this as the only broken markdown link.

**Recommended action.** Update the pointer to the current evidence phase, or mark it as an external/generated reference and exclude it from local-link validation.

## `deep-improvement/README.md` (1)

### F-026-07 — Improvement README overstates packet-local output locations

`deep-improvement/README.md:27` · traceability

**Evidence.** The README says all candidates, benchmark reports, journals, and dashboards are under `{spec_folder}/improvement/`. loop-host.cjs requires caller-provided --outputs-dir for model and skill benchmark lanes, and SKILL.md documents external or caller-selected output locations.

**Recommended action.** Document output paths separately for agent improvement, model benchmark, and skill benchmark lanes.

## `deep-improvement/assets` (2)

### F-033-03 — Lane-A config contains a missing and unconsumed fixture catalog path

`deep-improvement/assets/agent-improvement/improvement-config.json:35` · maintainability

**Evidence.** paths.fixtureCatalog points to .opencode/skills/system-deep-loop/deep-improvement/assets/fixtures, which does not exist. No implementation script references fixtureCatalog; the asset README nevertheless describes it as resolving under the skill assets.

**Recommended action.** Remove the stale field or point it at a real catalog, then validate every configured asset path during initialization.

### F-033-05 — Lane-C profile and remediation assets are inert duplicate sources of truth

`deep-improvement/assets/skill-benchmark/README.md:22` · maintainability

**Evidence.** The README states default-profile.json is not loaded at runtime and remediation-taxonomy.json is not imported by the report renderer. score-skill-benchmark.cjs hardcodes WEIGHTS at line 35, leaving edits to the shipped profile or taxonomy unable to affect benchmark behavior.

**Recommended action.** Either wire both assets into runtime validation/rendering or move them into clearly labelled historical/reference documentation.

## `deep-research/README.md` (3)

### F-001-03 — Research README describes an obsolete workflow roster

`deep-research/README.md:41` · traceability

**Evidence.** The README claims four active families and omits deep-alignment, while the hub and mode registry define five families and seven active modes including alignment. It also says improvement has four command lanes while the registry defines three improvement lanes.

**Recommended action.** Synchronize the roster and lane count with mode-registry.json and the parent hub documentation.

### F-026-03 — Deep-research README has an obsolete family and lane roster

`deep-research/README.md:41` · traceability

**Evidence.** The README claims four active families and four improvement lanes, while mode-registry.json defines five families including alignment and three improvement lanes: agent-improvement, model-benchmark, and skill-benchmark.

**Recommended action.** Synchronize the roster and lane count with mode-registry.json.

### F-038-05 — Sibling docs still advertise a pre-alignment four-family roster

`deep-research/README.md:41` · maintainability

**Evidence.** This README says the active roster has four families and four improvement lanes. The root SKILL.md defines five families including deep-alignment and three improvement lanes; similar four-family claims remain in the council and runtime READMEs.

**Recommended action.** Synchronize the mode roster across all sibling READMEs and replace duplicated counts with links to one authoritative registry where possible.

## `deep-review/SKILL.md` (1)

### F-035-05 — Deep-review integration documentation ends at an empty section

`deep-review/SKILL.md:440` · maintainability

**Evidence.** The file ends immediately after the `### Code Graph Integration` heading. There is no contract, limitation, or explicit statement that code-graph integration is unavailable, leaving the final integration surface undefined.

**Recommended action.** Document the actual code-graph integration and fallback behavior, or remove the empty heading if no integration exists.

## `runtime/README.md` (1)

### F-026-05 — Runtime README omits alignment from its active consumer inventory

`runtime/README.md:29` · traceability

**Evidence.** The README lists research, review, ai-council, and improvement as runtime consumers, omitting alignment. Alignment scripts import runtime CLI guards, artifact-root handling, and the runtime alignment reducer.

**Recommended action.** Add alignment and its custom runtime integration to the active-mode inventory and FAQ.

## `runtime/lib` (4)

### F-002-03 — Transition policy registry digest depends on process locale

`runtime/lib/authorized-ledger/transition-policy-registry.ts:145` · correctness

**Evidence.** Policy identities accept arbitrary bounded strings at lines 46-55, but inspect sorts registry entries with localeCompare at lines 145-146 before computing the registry digest at line 137. The same policy definitions containing locale-sensitive Unicode identifiers can therefore produce different registry digests under different host locales.

**Recommended action.** Replace localeCompare with an explicit code-unit or code-point comparator and add a hostile-locale determinism test for policy identifiers.

### F-031-01 — Deep-research and deep-review mode gates silently accept unknown top-level evidence

`runtime/lib/deep-research-rollback-gate/mode-gate.ts:241` · maintainability

**Evidence.** validateTopLevel() checks individual fields and versions but does not enforce a closed GATE_INPUT_KEYS set. The evaluate path then uses that result to build certificateCore without preserving unknown fields. Deep-ai-council, deep-alignment, agent-improvement, and benchmark gates reject unknown top-level keys and have corresponding tests.

**Recommended action.** Use a shared strict validator requiring plain objects and exact top-level and nested keys in both legacy clones, then add the unknown-field and prototype parity tests used by the newer modes.

### F-031-02 — Legacy rollback-window clones filter malformed rows instead of rejecting the evidence set

`runtime/lib/deep-research-rollback-gate/mode-gate.ts:595` · maintainability

**Evidence.** evaluateDeepResearchRollbackWindow() parses the window metadata and then filters input.executions to rows matching a trusted-completion predicate; malformed or extra execution objects are silently discarded. Deep-alignment and deep-improvement-common validate exact window keys, lowTraffic, and every execution row before counting successes.

**Recommended action.** Centralize rollback-window shape and row validation, make deep-research and deep-review use it, and add malformed-row and unknown-field parity cases before successful executions are counted.

### F-036-05 — Frozen wave collections are typed as mutable arrays

`runtime/lib/branch-leases-waves/wave-plan.ts:90` · maintainability

**Evidence.** ImmutableWave declares memberBranchIds and prerequisiteWaveIds as string[], while wave-plan freezes both arrays and casts them back to mutable arrays with as unknown as string[]. The outer waves array is likewise frozen and cast to ImmutableWave[] at line 106. Tests explicitly verify that push throws at branch-leases-waves.vitest.ts:247.

**Recommended action.** Declare these members as readonly string[] and the plan collection as readonly ImmutableWave[], removing the casts so compile-time mutability matches runtime behavior.

## `runtime/scripts` (4)

### F-001-01 — Runtime scripts README links to a removed parent SKILL.md

`runtime/scripts/README.md:40` · maintainability

**Evidence.** The related-resources section points to .opencode/skills/system-deep-loop/runtime/SKILL.md, but that file is absent; runtime operating rules were folded into runtime/README.md.

**Recommended action.** Replace the stale link with runtime/README.md and update the parent-resource wording.

### F-026-01 — Runtime scripts README links to removed runtime SKILL.md

`runtime/scripts/README.md:40` · traceability

**Evidence.** The Related Resources section points to `.opencode/skills/system-deep-loop/runtime/SKILL.md`, but that file does not exist; runtime/README.md states that the former SKILL.md was folded into README.md.

**Recommended action.** Replace the stale reference with runtime/README.md and update the parent-resource wording.

### F-032-06 — verify-iteration help advertises an unsupported loop type

`runtime/scripts/verify-iteration.cjs:178` · maintainability

**Evidence.** Help lists `review|research|context|alignment`, but `LEAF_BY_LOOP` contains only review, research, and alignment. Passing `--loop-type context` is rejected at line 182.

**Recommended action.** Generate usage text from LEAF_BY_LOOP or add actual context support.

### F-032-07 — Command renderer help omits a supported command

`runtime/scripts/render-command-contract.cjs:216` · maintainability

**Evidence.** `COMMANDS` includes `deep/alignment` at lines 33-37, but `printHelp()` lists only ai-council, review, and research.

**Recommended action.** Generate the command list dynamically from Object.keys(COMMANDS) so help cannot drift.

