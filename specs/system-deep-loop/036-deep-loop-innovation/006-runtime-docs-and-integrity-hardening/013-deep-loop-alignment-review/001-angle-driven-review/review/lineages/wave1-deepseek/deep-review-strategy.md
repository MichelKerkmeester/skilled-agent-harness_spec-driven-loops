---
title: "Deep Review Strategy — Angle-Driven Alignment Review, wave1-deepseek"
trigger_phrases: []
---
# Deep Review Strategy — Angle-Driven Alignment Review, wave1-deepseek

## 1. TOPIC

Angle-driven alignment review of the deep-loop system, its neighbours and its hubs. This lane runs wave one, angles 1 to 5, one angle per iteration: hub routing-artifact parity for `system-deep-loop`; the same parity question for `sk-code` and `cli-external-orchestration`; SKILL.md-to-resource reachability; feature catalogs against the runtime; playbooks and READMEs against the runtime.

---

## 2. REVIEW CHARTER

- Target: `specs/system-deep-loop/049-deep-loop-alignment-review/001-angle-driven-review` (`spec-folder`)
- Execution: autonomous detached lineage, executor `cli-pi`, model `deepseek-v4.1-flash`, reasoningEffort `max`
- Artifact root: `specs/system-deep-loop/049-deep-loop-alignment-review/001-angle-driven-review/review/lineages/wave1-deepseek`
- Findings only: P0/P1/P2; no fixes inside the review
- Resource Map Coverage: disabled because `resource-map.md` was absent at initialization
- Wave: 1 of 2. Angles 1 to 5 of the phase spec's declared angle block.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- ANCHOR:review-dimensions -->
- [x] D1 Correctness — iteration 1, angle 1 (hub routing-artifact parity)
- [ ] D2 Security — no angle in this lane touches a security surface
- [x] D3 Traceability — iterations 1-5 (angles 1, 2, 3, 4, 5)
- [x] D4 Maintainability — iterations 3, 4, 5 (angles 3, 4, 5)
<!-- /ANCHOR:review-dimensions -->

---

## 4. NON-GOALS

- No changes to any reviewed file: SKILL.md, registries, routers, manifests, catalogs, playbooks, READMEs, runtime code or the phase spec itself.
- No fixes. Every confirmed finding routes to a parent phase in a separate follow-up.
- No re-run of wave two's repo-rule angles; this lane owns wave-one angles 1 to 5 only.
- No structural review of surfaces outside the deep-loop, sk-code, cli-external-orchestration and sk-doc trees except where an angle crosses into them.

---

## 5. STOP CONDITIONS

- Run exactly five iterations, one per angle, in the order the phase spec names them.
- `stopPolicy: max-iterations`; `convergenceMode: off`. Convergence telemetry is recorded but never truncates the lane, and reaching a convergence signal before iteration 5 broadens the angle rather than synthesizing early.
- Stop after iteration 5 and synthesize, even if active findings remain.

---

## 6. COMPLETED DIMENSIONS
<!-- ANCHOR:completed-dimensions -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D3 Traceability | FAIL | 1 | Angle 1: 4 P1 + 2 P2 across the seven `system-deep-loop` hub routing artifacts; the tool-surface union, the routed leaf paths and the hub-identity defer guard all ruled out clean. |
| D3 Traceability | FAIL | 2 | Angle 2: 1 P0 + 2 P1 + 1 P2. The phase spec's `cli-hermes` prediction is confirmed at line (F007). `sk-code` passes every parity property and stands as the fleet baseline. Two iteration-1 findings re-scoped: F003 fleet-wide, F004 narrowed off the first-slice premise. |
| D3 Traceability, D4 Maintainability | FAIL | 3 | Angle 3: 2 P1 + 1 P2. A generator defect is the root cause: `generate-leaf-manifest.cjs` skips symlinks, so `sk-code`'s 12 shared workflow-doctrine files never become typed leaves. The drift gate cannot catch it because it regenerates with the same walker. |
| D3 Traceability, D4 Maintainability | CONDITIONAL | 4 | Angle 4: 2 P1 + 2 P2. The compiled-routing catalog is written against a superseded layout generation (F014), and four independently verified stale-reference classes run through the catalog tree (F015). Catalog reference resolution required four candidate roots; a single-root pass produced 129 false misses. |
| D3 Traceability, D4 Maintainability | FAIL | 5 | Angle 5: 2 P1 + 1 P2, 1 drafted finding withdrawn after its own verification. The compiled-contracts README misstates its own inventory count and is the angle's named high-value target (F018); the deep-review playbook asserts no test suite exists while 18 test files do (F019). All 10 playbook `(script, flag)` pairs, all 17 invoked scripts, both declared directory trees and all three contracts' freshness checks pass. |
<!-- /ANCHOR:completed-dimensions -->

---

## 7. RUNNING FINDINGS
<!-- ANCHOR:running-findings -->
- **P0 (Critical):** 1 active (F007)
- **P1 (Major):** 12 active (F001, F002, F003, F004, F008, F009, F011, F012, F014, F015, F018, F019)
- **P2 (Minor):** 7 active (F005, F006, F010, F013, F016, F017, F020)
- **Final verdict:** FAIL, `release-blocking`. Synthesis complete at iteration 5 of 5.
- **Delta this iteration:** +2 P1, +1 P2; 1 drafted finding withdrawn
- **Cumulative delta:** iterations 1-5 added 1 P0, 12 P1, 7 P2 with zero findings resolved and one withdrawn (DRAFT-005-A)
- **Refined this iteration:** none; F018, F019 and F020 are new classes rather than extensions of earlier findings. F014 (iteration 4) did not extend into angle 5: the deep-command contracts themselves are fresh and the drift checker passes on all three registered commands, so F014 remains confined to catalog prose.

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- /ANCHOR:running-findings -->

---

## 7A. WHAT WORKED

- **Using a sibling hub as a control (iteration 1).** Reading the same artifact set in `sk-code` and `cli-external-orchestration` converted a bare "versions differ" observation into a hub-local defect, because both siblings keep the pairs this hub splits. Reuse for angle 2 and any future parity claim.
- **Programmatic set difference over sampled greps (iteration 1).** Computing registry-minus-vocabulary and lane-minus-lane as actual set operations found F006 and F004, which eyeballing the files had not exposed. Reuse wherever two declared sets must agree.
- **Tracing a contradicting field to its consuming validator (iteration 1).** Reading the compiled-routing authored validator bounded F003 honestly instead of letting it read as a live route failure.
- **Tracing an unreachable artifact to the generator that omitted it (iteration 3).** Following 12 untyped `sk-code` leaves back to `walkLeafFiles`' `entry.isFile()` guard produced a single root cause and explained why the drift gate stays green. The same move bounded the severity honestly: the files are loadable, they are simply untyped.
- **Executing the live runtime rather than reading its description (iteration 4).** Running the compiled-route front door proved the runtime itself is correct and isolated F014 to the catalog prose, which is what kept the finding at P1 instead of escalating it.
- **Running the validator a README cites, and then believing it (iteration 5).** The cli hub's own-conformance table was drafted as a false claim on the reasoning that a hub with a P0 roster omission should not pass its own gate. `parent-skill-check.cjs` exits 0 on all three hubs, so the draft was withdrawn before it reached the registry. Executing the claim is what caught it; reasoning about likely outcomes would have filed a wrong finding.
- **Reading the sibling playbook to learn the intended section form (iteration 5).** `deep-research` §15 and `deep-ai-council` §16 both enumerate test files by path, which converted F019 from a subjective "thin section" into a measurable gap against an established convention.

## 7B. WHAT FAILED

- **Treating "no `version` key" as an absent version (iteration 1).** `leaf-manifest.json` and `graph-metadata.json` both carry a version-like discriminator with contractual rather than chronological meaning; counting them as missing made the finding unactionable. Scoped F001 to the six real values and two real absences instead.
- **Asserting a subset relationship was a sync failure (iteration 1, corrected in iteration 2).** F004 was framed as a 2-vs-61 breach of the `ROUTER.md`/`leaf-manifest.json` sync rule. A sibling hub's `ROUTER.md` declares its `RESOURCE_MAP` explicitly as a **first slice** and says deeper references are not in it, so subset is not a mismatch. F004's 2-vs-61 arm is withdrawn; only the N-to-1 non-distinctness arm stands.
- **Comparing leaves hub-relative instead of packet-root-relative (iteration 2).** A contamination check flagged 65 "foreign" leaves on the cli hub; leaves are packet-root-relative, so every one belonged to its own packet. Do not re-run that check without the packet root.
- **Parsing a machine block with a nested-brace split (iteration 2).** Splitting `INTENT_SIGNALS` on the first `}` returned one key of seven and briefly read as a defect. Always parse to the closing brace.
- **Resolving catalog citations against one fixed base path (iteration 4).** Catalog entries use `../feature-catalog/…` links relative to the document's own directory plus bare basenames that live elsewhere in the hub, so a single-root pass reported 129 missing references against 9 genuine ones. Resolve against four candidate roots plus a basename index before filing anything (see `iterations/iteration-004.md` §Notes).
- **Extracting `(script, flag)` pairs per line instead of per command (iteration 5).** A playbook table cell can carry a dozen chained `node … --flag` invocations, so line-scoped matching produced 34 phantom missing-flag reports against zero real ones. Parse the command snippet, and search the script's own directory rather than the one file, because thin wrappers delegate to `lib/`. This is the third iteration where a text-extraction shortcut manufactured a false-positive population (see `iterations/iteration-005.md` §Dead Ends).
- **Judging a validator claim by reasoning about what it ought to return (iteration 5).** The drafted DRAFT-005-A finding was wrong and cost one verification cycle to disprove. Run the command; the exit status is the evidence.

---

## 9. EXHAUSTED APPROACHES (do not retry)
<!-- ANCHOR:exhausted-approaches -->
[Populated when a review approach has been tried from multiple angles without yielding new findings]
<!-- /ANCHOR:exhausted-approaches -->

---

## 9A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- ANCHOR:dimension-expansion -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- /ANCHOR:dimension-expansion -->

---

## 11A. HAND-OFF NOTES FOR WAVE TWO

- **Angle 15 (hooks and gates against their docs).** `parent-skill-check.cjs` exits 0 on all three in-scope hubs and its `10c`/`10d` checks do reconcile the manifest against the registry — but it never reads `ROUTER.md`'s roster statements. That is why `cli-external-orchestration` passes its own gate while F007 leaves a registered mode missing from every roster statement in its surface document, and why both `system-deep-loop` (F002) and `cli-external-orchestration` (F008) pass while misstating their own mode counts in `SKILL.md`. This lane did not investigate the gate's contract and does not assert it is defective; the gap and its evidence are recorded so the wave-two lane does not rediscover it.
- **Angle 13 (dead code and duplication after the worktree removal).** F014's four superseded compiled-routing generation references (`010-live-activation`, `011-runtime-engine` against the live `013`/`014`) are the only stale-generation sites angle 4 found in the catalogs. Whether the retired generation directories were removed cleanly, or leave residue elsewhere in the runtime, is squarely angle 13's question and was not in this lane's angles.
- **Angle 12 (scope and evidence, comment hygiene).** F016 and F018 are both hand-maintained counts or inventory claims that the tree already answers. The durable-why question — whether these numbers should be derived rather than written — is a repo-rule restraint question, not a documentation one, and belongs with the wave-two restraint angle.

---

## 11. RULED OUT DIRECTIONS

- **`RESOURCE_MAP` leaf counts must equal `leaf-manifest.json` counts (iteration 2).** A sibling hub's `ROUTER.md` declares its `RESOURCE_MAP` explicitly as a first slice; only per-path resolvability is required. Do not re-run a count-equality check.
- **Comparing leaf paths hub-relative instead of packet-root-relative (iteration 2).** Produced a 65-leaf false contamination alarm. Packets own their leaves.
- **Treating a version-like discriminator as a missing version (iteration 1).** `resourceContractVersion` and `schema_version` are contractual, not chronological.
- **Counting catalog path references without resolving them (iteration 4).** Five-to-one false-positive ratio; see §7B.
- **Line-scoped `(script, flag)` extraction (iteration 5).** 34 phantom misses from one table cell; see §7B.
- **Reasoning a validator claim false without running it (iteration 5, DRAFT-005-A).** Withdrawn; the claim was true.
- **Playbook command and flag existence (angle 5, iteration 5).** All 10 `(script, flag)` pairs and all 17 invoked scripts resolve. Do not re-run the check without the command-snippet parser and the `lib/` sibling search.
- **Deep-command contract freshness (angle 5, iteration 5).** `checkCommand()` returns zero failures on all three registered commands and the renderer's throw-on-stale path is live. Do not re-infer freshness from the manifest's digests; the manifest is an append-only render-evidence log by design.
- **Per-mode version parity between a packet SKILL.md and its registry entry (iteration 3).** No mode entry in any of the three hubs carries a `version` field, so the check has no subject and is not assessable.
- **Security dimension for this lane (iterations 1-4).** No angle in angles 1-4 touches an auth, secret, permission or injection surface; the dimension remains unreached by design rather than by omission.

---

## 12. NEXT FOCUS
<!-- ANCHOR:next-focus -->
All five wave-one angles are complete and the lane is synthesized. `review-report.md` carries the FAIL verdict, the 20-finding registry and the remediation workstreams; the state log's terminal `synthesis_complete` and `traceability_summary` events record the stop reason `maxIterationsReached`. Three things are carried forward: (a) the ranked findings with F007 as the sole P0; (b) the two wave-two seeds this lane has now earned — repo-rule restraint for catalog and README prose that restates counts it can derive (F002, F004, F016, F018, F019), and dead-code/duplication scanning after the worktree removal, which F014's superseded layout-generation references suggest is a live surface; and (c) the three hand-off notes recorded in §11A.
<!-- /ANCHOR:next-focus -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers**: `.opencode/skills/system-deep-loop/{SKILL.md,ROUTER.md,mode-registry.json,hub-router.json,leaf-manifest.json,graph-metadata.json,description.json}` plus the five mode packets under the hub and `runtime/`.
- **Behaviour claims to verify**: the phase spec's angle list (angles 1–5) is the authoritative statement of what each iteration must check; the hub's own artifacts claim to describe one consistent mode set.
- **Reuse and conventions**: hubs follow a common seven-artifact shape (`SKILL.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `graph-metadata.json`, `description.json`); mode packets follow a `SKILL.md` + `references/` + `assets/` shape with a mode-level `mode-registry` projection.
- **Review risks and gaps**: no code graph and no semantic search were available to this lane; every claim rests on direct reads and exact-path searches. Convergence is off by configuration, so the lane's coverage is bounded by the angle list, not by a stop signal.

---

## 14. CROSS-REFERENCE STATUS
<!-- ANCHOR:cross-reference-status -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | Angle 1 fully covered (`spec.md:86`); four of five required parity properties disagree and the spec names no resolution authority. [SOURCE: specs/system-deep-loop/049-deep-loop-alignment-review/001-angle-driven-review/spec.md:86] |
| `checklist_evidence` | core | notApplicable | 1 | The phase spec carries no per-iteration checklist rows; its REQ rows are assessed at synthesis. |
| `feature_catalog_code` | overlay | partial | 4 | Angle 4 resolved 445 catalog references across six catalog trees; four stale-reference classes and one count mismatch confirmed (F014, F015, F016, F017). [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:19] |
| `playbook_capability` | overlay | pending | — | Angle 5 owns this protocol; iterations 3-4 touched only playbook *paths*, not playbook commands or flags. |
<!-- /ANCHOR:cross-reference-status -->

---

## 15. FILES UNDER REVIEW
<!-- ANCHOR:files-under-review -->
[Per-file coverage state table — populated as iterations read files]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/skills/cli-external-orchestration/ROUTER.md` | D3 | 2 | 1 P0, 1 P1 | partial |
| `.opencode/skills/cli-external-orchestration/SKILL.md` | D3 | 2 | 1 P1 | partial |
| `.opencode/skills/cli-external-orchestration/mode-registry.json` | D3 | 2 | 1 P1 | partial |
| `.opencode/skills/cli-external-orchestration/leaf-manifest.json` | D3 | 2 | 1 P2 | partial |
| `.opencode/skills/cli-external-orchestration/{hub-router.json,description.json,README.md}` | D3 | 2 | 0 | complete |
| `.opencode/skills/sk-code/**` (all seven routing artifacts) | D3 | 2 | 0 | complete |
| `.opencode/skills/system-deep-loop/SKILL.md` | D3, D1 | 1 | 2 P1, 1 P2 | partial |
| `.opencode/skills/system-deep-loop/mode-registry.json` | D3, D1 | 1 | 1 P1, 1 P2 | partial |
| `.opencode/skills/system-deep-loop/hub-router.json` | D3, D1 | 1 | 1 P1 | partial |
| `.opencode/skills/system-deep-loop/ROUTER.md` | D3, D1 | 1 | 1 P1 | partial |
| `.opencode/skills/system-deep-loop/leaf-manifest.json` | D3, D1 | 1 | 1 P1 | partial |
| `.opencode/skills/system-deep-loop/graph-metadata.json` | D3 | 1 | 1 P2 | partial |
| `.opencode/skills/system-deep-loop/description.json` | D3 | 1 | 0 | complete |
| `.opencode/skills/system-deep-loop/README.md` | D3 | 1 | 1 P1 (ref F002) | partial |
| `.opencode/skills/sk-code/**` (`references/`, `assets/`, four surface packets) | D3, D4 | 3 | 2 P1, 1 P2 | partial |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` | D3 | 3 | 1 P1 | partial |
| `.opencode/skills/system-deep-loop/feature-catalog/**` | D3, D4 | 4 | 1 P1 | partial |
| `.opencode/skills/system-deep-loop/runtime/feature-catalog/**` | D3, D4 | 4 | 1 P1, 1 P2 | partial |
| `.opencode/skills/system-deep-loop/{deep-research,deep-review,deep-ai-council,deep-improvement}/feature-catalog/**` | D3 | 4 | 1 P1 (ref F015) | partial |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | D4 | 4 | 1 P2 | complete |
| `.opencode/commands/deep/assets/compiled/README.md` | D3, D4 | 5 | 1 P1 | complete |
| `.opencode/commands/deep/assets/legacy/README.md` | D3 | 5 | 1 P2 | complete |
| `.opencode/commands/deep/assets/compiled/manifest.jsonl` | D3 | 5 | 0 | complete |
| `.opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/**` | D3, D4 | 5 | 1 P1 | partial |
| `.opencode/skills/system-deep-loop/{deep-research,deep-ai-council,deep-improvement}/manual-testing-playbook/**` | D3 | 5 | 0 | complete |
| `.opencode/skills/{sk-code,cli-external-orchestration}/manual-testing-playbook/**` | D3 | 5 | 0 | complete |
| `.opencode/skills/system-deep-loop/runtime/scripts/{compile-command-contracts,render-command-contract,check-contract-drift}.cjs` | D3 | 5 | 0 | complete |
| `.opencode/skills/system-deep-loop/{README.md,SKILL.md}` | D3, D4 | 5 | 1 P1 (ref F002), 1 P2 (ref F005) | partial |
| `.opencode/skills/sk-code/README.md` | D3 | 5 | 0 | complete |
| `.opencode/skills/cli-external-orchestration/README.md` | D3 | 5 | 0 (DRAFT-005-A withdrawn) | complete |
<!-- /ANCHOR:files-under-review -->

---

## 16. REVIEW BOUNDARIES
<!-- ANCHOR:review-boundaries -->
- Max iterations: 5
- Convergence threshold: 0.1
- Convergence mode: off (telemetry only)
- Stop policy: max-iterations
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-wave1-deepseek-1789465945073-px9i6h, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-09-15T09:52:25Z
<!-- /ANCHOR:review-boundaries -->
