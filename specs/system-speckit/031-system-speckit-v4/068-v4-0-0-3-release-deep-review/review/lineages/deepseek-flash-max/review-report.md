---
title: "Deep Review Report — v4.0.0.2..v4.0.0.3 (lineage: deepseek-flash-max)"
trigger_phrases: []
---

# Deep Review Report — v4.0.0.3 release (lineage deepseek-flash-max)

<!-- Machine-owned markers preserved for reducer re-runs -->
<!-- ANCHOR:review-dimensions -->
Dimensions reviewed: correctness, security, traceability, maintainability
<!-- /ANCHOR:review-dimensions -->

## 1. Executive Summary

**Verdict: CONDITIONAL** — 0 P0, 2 P1, 6 P2 active across 15 iterations.

- **Scope**: the release range `v4.0.0.2..v4.0.0.3` as it touches this lineage's focus areas — `system-spec-kit` runtime and shared code, `system-deep-loop` (fan-out, gateway, locks, dispatch), `cli-external-orchestration` and `cli-classifier` (Jev), and `system-skill-advisor` — read and, wherever possible, executed read-only.
- **Headline**: the deep-loop's dispatch, reducer, fencing and trust surfaces hold up under reading and execution; the release's own cross-skill checks pass (43/43 replicated parity assertions, 187 mirrors in sync, 14/14 root-metadata roots, capability matrix clean). The two P1s are both writers that bypass the machinery around them: the fan-out salvage sweep writes the gateway-owned state log directly, and the stale-lock reclaim can hand two runs the same packet lock. Both are narrow-path defects with mechanical failure scenarios, not systemic breakage.
- **Executor**: `cli-pi`, model `opencode-go/deepseek-v4.1-flash`, effort `max`, one fan-out lineage, in-process iteration execution, stop policy `max-iterations` (15 of 15; stopReason `maxIterationsReached`). All verification is reading plus read-only commands; no test suite was executed inside the lineage (containment), and that limit is stated wherever a suite result would have been the stronger receipt.

## 2. Planning Trigger

`/speckit:plan` **is required for the two P1s**; the six P2s are advisories that can ride a routine cleanup or the next release tail.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": { "P0": 0, "P1": 2, "P2": 6 },
  "remediationWorkstreams": [
    "WS-A (required): route the fan-out salvage event through the append gateway (or its deltas) and add a test that appends again after salvage; F001",
    "WS-B (required): verify the claimed record in tryReclaimStaleLoopLock before republishing, or wire the host-local single-flight guard into the acquire CLI; add a two-reclaimer interleaving test; F002",
    "WS-C (advisory): regenerate and pin the release trigger index for the changed changelog entry; F004",
    "WS-D (advisory): repair the two raw-NUL source files to ASCII escape form; F005",
    "WS-E (advisory): re-derive the 033 phase folder's graph metadata; narrow or report the recursive-skip predicate; align the nine playbook test commands; restate the config-read-only rule; F003, F006, F007, F008"
  ],
  "specSeed": "No behavior change to the review loop itself. Amendments: (1) scope SKILL.md's config rule to review parameters and name the terminal status flip; (2) state the salvage event's canonical channel; (3) narrow the recursive-skip predicate; (4) fix the nine playbook commands.",
  "planSeed": "Order: F001 (gateway route + regression test) before F002 (reclaim verification test), because both touch the deep-loop runtime and one test suite covers both areas. Then the five advisories as a documentation/derived-artifact batch.",
  "findingClasses": ["cross-consumer", "race-condition", "instance-only"],
  "affectedSurfacesSeed": [
    "scripts/fanout-salvage.cjs",
    "lib/deep-loop/loop-lock.ts",
    "scripts/loop-lock.cjs",
    "runtime/data/trigger-index.json",
    "hooks/lib/completion-evidence-sentinel.cjs",
    "specs/system-speckit/033-system-speckit-v4/graph-metadata.json",
    "deep-review/SKILL.md",
    "manual-testing-playbook/fanout/**"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | File:line | Finding | Evidence | Fix |
|----|-----|-----------|-----------|---------|----------|-----|
| F001 | P1 | correctness | `.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:170` | The post-exit salvage sweep appends `salvaged_from_stdout` with `mergeJsonlUnderLock` (a raw locked rewrite) instead of the append gateway; the projection drops the row on the next gateway append, and the same bytes are a guard violation under ledger authority. | Replayed in iterations 1, 2, 15; `jsonl-repair.ts:282-296`; `shadow-projection-store.ts:548-577`; `check-direct-append.cjs:223-253`; workflow contract `deep-review-auto.yaml:114-117`; unit test asserts only the immediate row. | Emit through the gateway (or the delta stream); add a re-append test. |
| F002 | P1 | security | `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:298` | `tryReclaimStaleLoopLock` renames whatever holds `lockPath` and republishes without verifying it is the stale holder it observed; a second reclaimer can replace the fresh lock, so two runs can both hold the packet lock. | Replayed in iterations 3, 15; reclaim body `:298-315`; publish window `:265-286`; single-flight un-used by CLI `:600-603` + `loop-lock.cjs:156`; no two-reclaimer test (test covers fresh-acquire only). | Verify the claimed record before republish (pid/nonce/heartbeat), or wire the single-flight guard; add an interleaving test. |
| F003 | P2 | correctness | `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:386-388` | Recursive validation silently skips a numbered child with content but neither `spec.md` nor `description.json`, so a broken phase can be invisible to the parent gate. | Iteration 4; all currently matched children are artifact-only (walk); citation refined in iteration 14 from `:385`. | Narrow the predicate or report skipped children. |
| F004 | P2 | correctness | `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | The release shipped a trigger index stale for its own changelog entry: index rebuilt at `903c983c39`, six later changelog commits changed its phrases, no rebuild before the tag. | `--check` exits 1 on the tagged tree; current phrase misses the entry; stale phrase hits at 1.0; index blob identical at tag and HEAD. | Regenerate the index in the release tail. |
| F005 | P2 | security | `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs:318` | A raw NUL byte (offset 16206) makes a release-introduced source file binary to `rg`/`diff`/`file`; the same defect pre-exists at `rubric-guard.cjs:59`. | Sweep of the four focus trees; `rg` binary notice; `diff` binary verdict. | Write the separator as `\u0000` in both files. |
| F006 | P2 | correctness | `specs/system-speckit/033-system-speckit-v4/graph-metadata.json` | The phase folder resolves to `error` under the shipped default-on generated-metadata integrity gate (`SOURCE_FINGERPRINT_MISMATCH`); an archived sibling likewise; carried pre-existing debt touched by the release. | Executed check+resolve; checker and folder blobs tag-identical; 279-packet sweep sizes the class. | Re-derive the folder's graph metadata. |
| F007 | P2 | traceability | `.skilled/skills/system-deep-loop/deep-review/SKILL.md:392` | The contract calls the config read-only after init while the workflow flips its status at the terminal step (`deep-review-auto.yaml:2322-2325`); the lead's binding ruling favors the workflow. | Both lines read; lead steer. | Scope the rule to review parameters; name the terminal flip. |
| F008 | P2 | traceability | `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-salvage-recovery.md:52` | Nine playbook scenarios run their tests from `system-spec-kit/runtime` with `../../runtime//tests/unit/…`, which resolves to the nonexistent `.skilled/skills/runtime`; the named tests live under the deep-loop runtime. | Nine files enumerated; `.skilled/skills/runtime` absent; four named tests present; two correct-form controls. | Use the deep-loop base in all nine commands. |

Finding lifecycle: no P0 was ever recorded; F001-F008 are all `active`; F003's citation was refined once (representation fix, finding unchanged); registry dedup was corrected in synthesis by aligning narrative titles with delta rows (documented in the Audit Appendix).

## 4. Remediation Workstreams

**WS-A (required) — salvage writes through the gateway (F001).** Change `fanout-salvage.cjs` to record the event through `append-mode-event.cjs` under a ledger stem (or drop it from the state log and carry it in the delta), then extend `fanout-salvage.vitest.ts` to append once more through the gateway and assert the event survives. Verification: the re-append test plus a `--check`-style state-log/ledger comparison.

**WS-B (required) — reclaim verifies its claim (F002).** In `tryReclaimStaleLoopLock`, read the renamed record and compare owner pid/nonce/heartbeat with the observed stale holder before republishing; restore an unverified fresh lock untouched. Alternatively engage `hostLocalSingleFlight` from the CLI. Verification: a test that interleaves two reclaimers over one stale lock and asserts a single winner; keep the existing fresh-acquire race test.

**WS-C (advisory) — release index (F004).** Regenerate `trigger-index.json` from the tagged content; consider regenerating in the same commit as changelog phrase edits.

**WS-D (advisory) — ASCII sources (F005).** Replace the two raw NUL bytes with the escape sequence; no behavior change.

**WS-E (advisory) — derived/doc batch (F003, F006, F007, F008).** Re-derive the 033 phase folder's metadata; narrow the recursive-skip predicate or report skipped children; fix the nine playbook command bases; reword the config-read-only rule.

## 5. Spec Seed

No spec delta is required for the review loop's behavior. Documentation amendments worth recording: the config rule's scope (F007), the salvage event's canonical channel (F001), the recursive-skip predicate (F003), and the playbook command form (F008). The other findings need code or generated-artifact changes, not spec text.

## 6. Plan Seed

Single remediation train, ordered by shared test surface: (1) F001 with its test; (2) F002 with its interleaving test; (3) one advisory batch for F003-F008 (two generated-artifact regenerations, two file-text repairs, four doc/command corrections). Each step's verification is named in the workstreams above; the deep-loop suite is the shared gate for (1) and (2).

## 7. Traceability Status

**Core Protocols**

| Protocol | Status | Notes |
|----------|--------|-------|
| `spec_code` | partial | REQ-003 holds so far and REQ-004 passes on the sample; REQ-001 completes when all three lineages reach their counts; REQ-002 and REQ-005 are downstream (no merged report, nothing committed/pushed). |
| `checklist_evidence` | partial | CHK-011/012/013/030/031/050 pass on executed evidence (run ledger, secret sweep with control, git status); CHK-021 satisfied for this lineage at synthesis; CHK-020/022/023 downstream. |

**Overlay Protocols**

| Protocol | Status | Notes |
|----------|--------|-------|
| `skill_agent` | pass (surface) | Registry ↔ directories ↔ SKILL.md ↔ versions agree on both cli hubs; routing not claimed beyond surface consistency. |
| `agent_cross_runtime` | pass (executed) | 187 mirrors in sync; 4 hook registration files match the 31-hook registry with 18 Pi extensions; Gate 1 pointer present. |
| `feature_catalog_code` | pass | Verdict, claim-adjudication and severity catalog claims resolve in code. |
| `playbook_capability` | fail on command base | F008; the scenarios' expected signals otherwise match the implementation. |

## 8. Deferred Items

- The 7 `STATUS_COMPLETE_EVIDENCE_MISMATCH` folders from the 279-packet sweep resolve to `info` under the default rollout gate; they are recorded here as advisory, not findings.
- F005's pre-existing `rubric-guard.cjs` instance is folded into the same fix rather than tracked separately.
- Slices not read in this lineage (continuity lib, optimizer, embeddings, deep-improvement scripts, council assets, classifier benchmark, most playbook prose) are stated in the coverage matrix below; they remain for the other lineages or a follow-up pass.

## 9. Search Ledger

Search-depth v2 fields were not emitted by this lineage's iteration records (legacy v1 depth). The equivalent work is captured in each iteration's Ruled Out / Dead Ends sections: absence claims were paired with positive controls (secret-pattern control line, index `--check` exit 1, matcher control for the comment sweep), and every executed checker's exit status is quoted where relied on. `searchDebt` is empty; `searchCoverage` and `candidateCoverage` are not applicable to this lineage's records.

## 10. Audit Appendix

**Convergence and coverage.** 15 of 15 iterations under `stopPolicy: max-iterations`; stopReason `maxIterationsReached`; all four dimensions covered; new-findings ratios 1.0/0.0/1.0/1.0/1.0/1.0/1.0/1.0/0.0/0.0/0.0/0.0/1.0/0.0/0.0 (findings landed in iterations 1, 3, 4, 5, 6, 7, 8, 13).

**Convergence telemetry (not a stop reason).** The reducer's composite score at synthesis is 1.0 with graph convergence 0; under `max-iterations` this is telemetry by contract.

**Replay validation.** Both P1s were replayed adversarially in the final iteration against the tree as it stands and remained active; F001's and F002's downgrade triggers were re-checked and did not fire.

**Registry hygiene note.** During synthesis, three registry duplicates (F004, F006 from narrative-vs-delta title drift; F007 fixed by title alignment) were removed by aligning the narrative finding titles with their delta rows (F004/F006 reformatted to non-numbered bullets). Content of every finding is unchanged; the registry now holds exactly the 8 findings above.

**Evidence classes.** Executed receipts: `generate-trigger-index.mjs --check` (exit 1, stale), `resolveArtifactRoot` output, capability-matrix load/resolve, the generated-metadata check/resolve pair, `ci-skill-root-metadata.cjs` (14/14), the three mirror checkers (all exit 0), 43 replicated parity assertions, secret-sweep positive control, 279-packet metadata sweep. Reads: every file:line cited above. Inferred and labeled: F006's root cause.

**Sources reviewed.** 15 iteration files with paired deltas and gateway records; the strategy; the run ledger; the packet's requirements, acceptance criteria, tasks, config, manifest; the lead steer (updated ruling).

**Lineage verdict.**

Review verdict: CONDITIONAL
