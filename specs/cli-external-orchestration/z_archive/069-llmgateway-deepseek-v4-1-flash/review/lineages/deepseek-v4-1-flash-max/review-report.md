# Review Report: 069 llmgateway DeepSeek V4.1 Flash route repoint

Fan-out lineage `deepseek-v4-1-flash-max` · executor `cli-pi` (`deepseek-v4.1-flash`, reasoning effort `max`) · session `fanout-deepseek-v4-1-flash-max-1789146954427-phycl9` · 2026-09-11 · iterations: 1 · stop reason: `maxIterationsReached`

## 1. Executive Summary

**Verdict: CONDITIONAL** — no active P0, one active P1, six active P2. `hasAdvisories: true`.

The routing change itself is correct. The DevPass bare literal, the cli-pi allowlist, the fan-out provider mapping, the default and the effort pin all agree between the fan-out script (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) and its TypeScript source of record (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`), the `opencode-go` route was moved through every surface the first pass had left alone, and the `cline-pass` route is documented as listing-only with both its blocker and its fallback named. No credential shape changed, nothing hardcodes a secret, and the allowlist still fails closed on an off-roster id.

What the review does not accept is the packet's claim that the retired-id sweep came back clean. A present-tense testing contract in the cli-pi manual-testing playbook still declares `deepseek-v4-flash-vision-exp` as the expected `PI_DEFAULT_MODEL`, which contradicts REQ-001 and falsifies AC-001's evidence cell as written. Three of the handover's own verification statements — the pi `--mode text` trap, the validator-warning attribution and the acceptance-criteria counts — are also wrong, and all three are read as fact by the next session. Two further documents describe a Pi `defaultProvider` the config does not set.

Scope: the declared target spec folder and the implementation surfaces its `spec.md` §3 names — both CLI rosters and SKILL.md anchors, the three `.pi` config files, the cli-pi model-dispatch playbook, the deep-loop executor config and its unit tests, and the packet's own documents. Reviewed against the working tree at `bce3ad789d` with the packet's uncommitted changes in place; no target file was modified.

- Active findings: **P0 = 0, P1 = 1, P2 = 6**
- `hasAdvisories`: true
- Convergence reason: single iteration at the configured cap (`config.stopPolicy: max-iterations`, `maxIterations: 1`). The composite stop score computed from the recorded signals (0.75, driven by full dimension coverage in one pass) is telemetry only for this lineage and was not used as a stop decision.
- Reported-not-confirmed: live route evidence (`200`/`410`/`400`/`429` statuses, pricing, tier ladder, `pi --list-models` output) is the packet's recorded evidence. This lineage could not reproduce it and does not claim to.

## 2. Planning Trigger

Route to **remediation planning** (`/speckit:plan`), not changelog. A CONDITIONAL verdict with an active P1 means the packet's closure gate is not satisfied: REQ-001 ("no live surface names the deactivated gateway id") is unmet on one non-changelog surface, and the acceptance-criteria row that certifies it overstates the evidence. The remediation is small and local — a handful of documentation lines plus a re-run of the sweep — but it must land before the packet closes, because the next session reads `handover.md` and `acceptance-criteria.md` as fact.

The packet's own status is consistent with this: `acceptance-criteria.md` §3 reads `Closeable: No`, with two live gates deliberately deferred (the pi-side turn on the new id and the post-quota `cline-pass` turn).

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | First / last seen | Status |
|----|----------|-----------|-------|----------|-------------------|--------|
| F001 | P1 | traceability | Retired id still named on a non-changelog surface | `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/supported-model-allowlist-smoke.md:29` and `:46` | 1 / 1 | active |
| F002 | P2 | traceability | Recorded retired-id scan evidence is overstated | `acceptance-criteria.md:57`; `implementation-summary.md:138` | 1 / 1 | active |
| F003 | P2 | traceability | Handover trap "pi has no `--mode text`" is false | `handover.md:125`, `:153`, `:171`; `…/pi-coding-agent/dist/cli/args.js:42`, `:274` | 1 / 1 | active |
| F004 | P2 | traceability | Validator warning misattributed to AC_COVERAGE | `handover.md:211`, `:267-268`; `validator-registry.json`; `check-ac-coverage.sh:464-495`; `orchestrator.ts:275-286` | 1 / 1 | active |
| F005 | P2 | traceability | AC-coverage counts wrong in the handover | `handover.md:267-269`; `check-ac-coverage.sh:275-388` (analyzer: `rows=21 covered=6 malformed=15`) | 1 / 1 | active |
| F006 | P2 | maintainability | Pi default-provider claim contradicts settings.json | `cli-pi/references/providers-and-models.md:86`; `.pi/custom-providers.md:27,35,67,152`; `.pi/settings.json:4` | 1 / 1 | active |
| F007 | P2 | maintainability | Duplicated closure paragraph in the acceptance criteria | `acceptance-criteria.md:126-129` and `:135` | 1 / 1 | active |

Detail, recommendations and typed adjudication packets for every finding are in `iterations/iteration-001.md`; machine state is in `deep-review-findings-registry.json`.

## 4. Remediation Workstreams

**Lane 1 — Close the retired-id gap (F001, F002).** Update the two playbook rows to the live id, then re-run the sweep across `.opencode` and `.pi` with a predicate that includes playbooks and every non-changelog document; classify each remaining hit as OpenRouter-prefixed (out of scope by decision), regex assertion, changelog (historical), or genuine. Rewrite AC-001's Verification cell and the "Repository scan" row of `implementation-summary.md` from the real run. Order matters: the evidence cells must be written after the sweep, not before.

**Lane 2 — Correct the continuity record before the next session reads it (F003, F004, F005).** These three are independent edits to a single file. For F004, run the validator and paste the actual `Summary:` line and warning rule id rather than naming a rule from memory; the reasoning in this report shows the currently named rule cannot produce a warning at all.

**Lane 3 — Reconcile the Pi default (F006, plus one deferred check).** State the real `defaultProvider` in the roster and the setup doc, then settle whether `llmgateway` + `z-ai/glm-5.3-flash` resolves at all; if it does not, the correct fix is either a bare-id default model or a provider change, and the documentation must follow whichever is chosen.

**Lane 4 — Documentation hygiene (F007).** Delete the duplicated paragraph in the same edit that carries Lane 1's evidence correction.

**Sequencing:** Lanes 1 and 4 touch `acceptance-criteria.md`; Lanes 2 and 4 are pure edits. Lane 3 is the only lane with an open question attached, and it does not block the others.

## 5. Spec Seed

Minimal spec deltas implied by the findings, for the packet's own documents:

- **`spec.md` §3 (In Scope):** widen the retired-id item from "the two sibling DeepSeek routes … in both skills and in the Pi config" to name the class of surface the sweep must cover — changelogs excluded, playbooks and other non-changelog documentation included — so a future sweep has a predicate rather than an informal scope.
- **`acceptance-criteria.md` AC-001:** restate the criterion's Verification to the sweep's real scope and result, and record the playbook file in the criterion's evidence rather than describing the result as a clean miss.
- **`implementation-summary.md` §6 (Known Limitations):** add the Pi default-resolution question as a named open item if Lane 3's check cannot be run before closure, so the next reader inherits the question rather than the assumption that the default is settled.
- **`handover.md` §4/§5:** replace the three incorrect statements with their corrected forms; keep the AC-coverage advisory as an advisory, attributed to the rule that actually produces it.

No new requirements are implied: REQ-001 and REQ-002 already cover the substance, and the findings are execution and recording defects against them.

## 6. Plan Seed

Action-ready remediation tasks, each naming its finding and target:

1. **T-R1 (F001)** — Update `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/supported-model-allowlist-smoke.md:29` and `:46` to `deepseek-v4.1-flash`; re-capture the Evidence cell only if the scenario is re-run. Done when the file contains no occurrence of the retired id.
2. **T-R2 (F001)** — Re-run the retired-id sweep over `.opencode` and `.pi`, excluding `changelog/` directories and the OpenRouter-prefixed literal; record the command and its output as the closure evidence.
3. **T-R3 (F002)** — Rewrite AC-001's Verification cell and `implementation-summary.md:138` from T-R2's result; if a hit remains, leave AC-001 `Unmet` rather than describing a partial sweep as clean.
4. **T-R4 (F003)** — Replace the `--mode text` trap row in `handover.md:125` with the true statement and delete the two denying comments at `:153` and `:171`.
5. **T-R5 (F004)** — Run `validate.sh … --strict`, copy the `Summary:` line and the warning rule id into `handover.md` §4/§5, and correct the attribution.
6. **T-R6 (F005)** — Re-derive the AC-coverage counts from the rule's analyzer, correct §5 note 6, and restate the conclusion without the "predates this pass" claim.
7. **T-R7 (F006)** — State `defaultProvider: llmgateway` in `cli-pi/references/providers-and-models.md:86` and in the three `.pi/custom-providers.md` statements; then run the deferred resolution check and record its result.
8. **T-R8 (F007)** — Delete the duplicated closure paragraph at `acceptance-criteria.md:135`.
9. **T-R9 (carry-over, not a finding)** — Run the two deferred live gates the packet already names (pi-side turn on the new id; post-quota `cline-pass` control-then-candidate) and update AC-016/AC-017/AC-021 from their results.

Verification for the remediation: T-R2's sweep output, the validator's `Summary:` line, and a re-read of the three corrected handover statements. No code change is implied by any finding.

## 7. Traceability Status

| Protocol | Level | Status | Gate | Evidence | Notes |
|----------|-------|--------|------|----------|-------|
| `spec_code` | core | partial | hard | `executor-config.ts:189,214,243`; `fanout-run.cjs:1984,2080,2099,2285`; `cli-opencode/SKILL.md:174,176,194,240`; `acceptance-criteria.md:57` | REQ-002, REQ-003, REQ-006, REQ-007 and REQ-009 resolve to shipped code and the packet's recorded probes. REQ-001 does not: one non-changelog surface still names the retired id (F001), and the recorded sweep overstates its scope (F002). REQ-004, REQ-008 and SC-002/SC-004/SC-008 rest on runs this lineage did not execute, so they are recorded evidence, not confirmed evidence |
| `checklist_evidence` | core | partial | hard | `tasks.md:125-155`, `:208-214`; `implementation-summary.md:129-146` | All checklist items are `[x]` except `CHK-FIX-006`, which is declared unrun with a reason. Per-item `file:line` evidence is absent, and the AC-coverage analyzer independently reports only 6 of 21 criteria with citations (F005) |
| `skill_agent` | overlay | notApplicable | advisory | `config.reviewTargetType = spec-folder` | No skill/agent pair in scope |
| `agent_cross_runtime` | overlay | notApplicable | advisory | — | No agent definitions in scope |
| `feature_catalog_code` | overlay | notApplicable | advisory | — | No catalog claim depends on this change |
| `playbook_capability` | overlay | partial | advisory | `supported-model-allowlist-smoke.md:29,46`; `cline-provider-id-format-dispatch.md` | The cli-pi playbook's id-format control was updated correctly; its allowlist-smoke scenario was not, and now contradicts shipped behaviour (F001) |

Hard-gate failures: 2 (`spec_code`, `checklist_evidence`), both partial rather than fail — the shipped code agrees with the spec on every routing claim, and the deficit is in coverage and recorded evidence.

Acceptance-coverage signal (advisory): the AC-coverage rule is active for this Level 2 packet and reports `6/21` criteria with citations against a 90% floor — an advisory under-floor result, not a failing rule. Its contents are the substance of F005; its own status is `pass`/`info` by design and it is not what makes this verdict CONDITIONAL.

## 8. Deferred Items

- **DV-1 — Pi default-model resolution.** Whether `defaultProvider: llmgateway` with `defaultModel: "z-ai/glm-5.3-flash"` resolves is unproven: `z-ai/glm-5.3-flash` is not a declared id in the `llmgateway` block of `.pi/models.json` (which declares `glm-5.3-flash`), and `dist/core/model-resolver.js:502-528` silently falls through to the first authenticated model when the configured pair does not resolve. Next check: `pi --list-models` (or one `pi -p` turn) and read which provider/model it starts on. Not raised as a finding because the resolution semantics could not be exercised from this lineage.
- **DV-2 — The packet's two deferred live gates.** The pi-side turn on the new id and the post-quota `cline-pass` control-then-candidate turn remain open by design and are named with owners in `tasks.md` and §3.1 of the handover.
- **DV-3 — AC evidence under floor.** 15 of 21 criteria lack a `file:line` citation. The harness treats this as an advisory signal, so it is not raised as a separate finding; it is carried as Lane 1/2 remediation context and as spec seed.
- **DV-4 — Overlay protocols not exercised.** `skill_agent`, `agent_cross_runtime` and `feature_catalog_code` are not applicable to a spec-folder target and are recorded as such rather than as passes.
- **DV-5 — OpenRouter fan-out literals.** Two literals still map to a provider the operator does not use. The packet deliberately leaves them as another owner's contract (`spec.md:198`); this review concurs that the decision is not this packet's to overturn.

## 9. Audit Appendix

**Iteration table**

| # | Focus | Dimensions | Files | New P0/P1/P2 | Ratio | Status |
|---|-------|------------|-------|--------------|-------|--------|
| 1 | Full-dimension pass over packet 069 and its verification claims | correctness, security, traceability, maintainability | 24 | 0 / 1 / 6 | 1.00 | complete |

**Convergence signal replay (stored values)**

| Signal | Value | Weight | Interpretation |
|--------|-------|--------|----------------|
| rollingAvg | 1.00 | 0.30 | Single iteration; every active finding is new |
| madScore | 0.00 | 0.25 | Single sample; no deviation to measure |
| dimensionCoverage | 1.00 | 0.45 | All four dimensions covered in the single pass |
| compositeStop | 0.75 | — | Telemetry only: the lineage stops by `maxIterationsReached`, and with a fully-new finding set the composite is not usable as a convergence vote |

No `graph_convergence` event was emitted and no graph-assisted signal exists for this lineage (`graphConvergenceScore: 0`, `graphDecision: null`); the review-depth-v2 search path is inactive, so `candidateCoverageGate` and `graphlessFallbackGate` pass trivially. No blocked-stop event was recorded and no P0 was asserted, so the adversarial P0 replay has no subject: zero P0 findings were carried into this report, and the P1 was re-read at its cited lines before registration.

**Claim-adjudication replay.** All seven findings carry typed packets (embedded in `iterations/iteration-001.md`) with evidence refs, counterevidence sought, a rejected alternative explanation, a final severity, a confidence value and a downgrade trigger; `claim_adjudication` recorded `passed: true` with `missingPackets: []`. Two packets carry an explicit confidence below 0.9 with the reason stated (F004 at 0.80 because the warning classification is inferred from rule sources rather than an executed validator run; F002, F006 at 0.85).

**File coverage matrix.** 24 files read; the 14 implementation and packet documents reviewed are listed in `deep-review-strategy.md` §15 with per-file findings. No file under review was modified; the lineage's writes are confined to `review/lineages/deepseek-v4-1-flash-max/`.

**Registry note.** `deep-review-findings-registry.json` derives each finding's `dimension` field by scanning the iteration focus text, which for this single-pass lineage enumerates all four dimensions in order, so the field collapses to `correctness` for every entry even though the titles and packets record the true dimension (`traceability` for F001-F005, `maintainability` for F006-F007). The iteration file and this report are authoritative; the registry field is a known derivation artifact, not a coverage statement.

**Evidence boundary.** Confirmed by direct read: the retired-id occurrences and their classifications, the allowlist/default/provider-map/pin values, the mirror parity of the pin regex, the changelog and SKILL.md version anchors, the Pi settings values, the three refuted handover claims, the AC-coverage analyzer output, and the pi CLI flag parser. Recorded but not confirmed by this lineage: every live route result, the two unit suites' pass counts, the frontmatter gate's exit code, and the validator's summary line. Inferred and labelled as such: the identity of the currently-warning rule (F004).

**Stop reason:** `maxIterationsReached` (configured cap of 1 iteration reached; no convergence claim is made for this lineage).
