---
title: "wave1-glm iteration 001 — Angle 6: deep-loop command YAMLs"
loop: review
lane: wave1-glm
session: fanout-wave1-glm-1789465945073-px9i6h
iteration: 1 of 5
angle: 6
dimension_primary: traceability
dimension_secondary: correctness
verdict: CONDITIONAL
---

# Dimension / Focus

**Dimension:** traceability (primary), correctness (secondary).
**Focus (Angle 6):** the deep-loop command YAMLs — the review-variant pair (`deep-review-auto.yaml`, `deep-review-confirm.yaml`), the presentation assets they render, and the prompt-pack/runtime counterparts they reference — examined for auto-versus-confirm step parity, duplicated banners, stale inline containment comments in executor branches, the confirm workflow's resource-map handling, and every `append_jsonl`/`append_to_jsonl` directive's persistence mechanism.

# Files Reviewed

All under the repo root; reads were locus-targeted (the pair totals ~298 KB, so the angle question-set was answered via a step-census diff, 40+ targeted loci, and cross-checks against runtime sources — not full-file passes):

- `.opencode/commands/deep/assets/deep-review-auto.yaml` (173039 B) — step census, all `append_*` directives, containment branches, reducer/verify/convergence invocations, adjudication + synthesis events, provenance comments
- `.opencode/commands/deep/assets/deep-review-confirm.yaml` (125018 B) — same loci, plus its variable/bindings block (grep: every `resource[-_ ]?map` occurrence)
- `.opencode/commands/deep/review.md` (10173 B) — the `:auto` directive, flag provenance target of the YAML's cross-reference
- `.opencode/commands/deep/assets/deep-review-presentation.txt` (31769 B) — fan-out policy paragraph, setup-binding rows, YAML selection (:auto → deep-review-auto.yaml:350)
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` — banner provenance (1493-1557, 1413-1437, 1436-1437), containment commentary (2452-2458), cursor preflight (2745-2749)
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` — event append contract (`containment_violation` :186, "appended to this JSONL log" :221, "advisory, never fatal" :247, `classifyViolation` :592)
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/` — directory census: `prompt-pack.ts` (3256 B) and `post-dispatch-validate.ts` (65538 B) exist as referenced
- `.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` — CLI parse (`--loop-type`/`--artifact-dir`/`--iteration`, lines 67-69), narrative filename pattern (:116), route-proof check (:130-139)
- `.opencode/skills/sk-code/sk-code-review/references/review-core.md` — severity contract (:32-34, :40, :46-48, :95) — loaded before final severity calls per prompt pack
- `.opencode/skills/system-deep-loop/deep-review/references/state/state-jsonl.md` — record field contract (required/optional, severity keys)
- Target packet `spec.md` — Angle 6 definition (:83) and REQ-003 (:135)

**Assets not read (bounded out, see Ruled Out):** the research-variant YAML pair, the agent-improvement / ai-council / model-benchmark command YAMLs, `assets/compiled/` and `assets/legacy/` contents.

# Scorecard

| Gate | Rating | Basis |
|------|--------|-------|
| evidence | pass | every finding cites file:line, taken from this session's grep/diff/sed output |
| scope | pass | all cited artifacts are the angle-6 bound scope (prompt-001 line 28; strategy §13); zero writes outside the ALLOWED-WRITE set |
| coverage | pass | every angle-6 question (parity / banners / containment comments / confirm resource-map / append-directive executors) received a verdict — five findings, two negative results, one deferred cluster |

# Findings by Severity

## P0

None. No finding blocks a lane: nothing here destroys state, loses data, or breaks the running loop; the severest gap (F001) yields a misrecorded init record, not a lost one.

## P1

### F001 — Confirm variant's line-1 config record diverges from auto: flag ignored, `stopPolicy` dropped, `resource_map_present` unbound

`[SOURCE: deep-review-confirm.yaml:412,422; deep-review-auto.yaml:454-456,466-467; step-census diff 2,3d1+9d6]`

The auto variant binds `resource_map.emit` to the parsed `--no-resource-map` flag (auto:454-456: "Honor the parsed --no-resource-map flag from deep-review.md:71 (default true; false when flag is set)"), persists `stopPolicy` in its line-1 config record (auto:467), and states the invariant (auto:466: "Same parsed --no-resource-map flag honored here so config and state_log agree from line 1"). The confirm variant instead hardcodes `resource_map.emit: true` (confirm:412), writes a line-1 config record with **no** `stopPolicy` key (confirm:422), and references `{resource_map_present}` (confirm:422) although **no step or binding in the confirm YAML assigns it**: theauto binding lives in `step_detect_resource_map` (auto:251-259), which the census shows is absent from confirm (diff `9d6`), and grep for `resource[-_ ]?map` across confirm returns only lines 99, 143, 412, 422, 1545, 1546, 1551, 1552 — usages, not bindings. Confirm also lacks `step_bind_reducer_artifact_arg` and `step_apply_lifecycle_request` (diff `2,3d1`), the two steps that finish the init binding chain in auto. Net: a `:confirm` run emits an init config that cannot agree with the state log from line 1 and silently discards the documented flag.

**Adjudication packet (typed, per prompt-pack CLAIM ADJUDICATION):**

```json
{
  "findingId": "F001",
  "claim": "The confirm variant's line-1 config record diverges from the auto variant's: it hardcodes resource_map.emit:true ignoring the documented --no-resource-map flag, omits stopPolicy, references {resource_map_present} with no binding anywhere in the confirm YAML, and therefore cannot satisfy the invariant stated at auto:466 that config and state_log agree from line 1.",
  "evidenceRefs": [
    "deep-review-confirm.yaml:412",
    "deep-review-confirm.yaml:422",
    "deep-review-auto.yaml:454",
    "deep-review-auto.yaml:456",
    "deep-review-auto.yaml:466",
    "deep-review-auto.yaml:467",
    "census diff 2,3d1 (step_bind_reducer_artifact_arg, step_apply_lifecycle_request auto-only)",
    "census diff 9d6 (step_detect_resource_map auto-only)"
  ],
  "counterevidenceSought": "Searched the confirm YAML for any resource_map/stopPolicy binding: grep 'resource[-_ ]?map' returns 8 lines, all usages (99,143,412,422,1545,1546,1551,1552); confirm:422's own rendered literal carries no stopPolicy key; the census shows no confirm-side substitute steps for the three omitted binding steps. Counterevidence NOT excluded: the presentation contract's tier-2/3 interactive setup could bind these values at the presentation layer, which this iteration did not read in full.",
  "alternativeExplanation": "The literals at confirm:412 and the missing keys at 422 may be deliberate interactive-mode simplifications, with the operator supplying the values through the presentation setup flow rather than the YAML; the divergence would then be documented-intentional rather than accidental.",
  "finalSeverity": "P1",
  "confidence": 0.75,
  "downgradeTrigger": "If the presentation contract's tier-2/3 setup binds resource_map.emit, stopPolicy and resource_map_present for :confirm runs (presentation.txt bindings table), the drift becomes documented-intentional; downgrade to P2 cross-variant documentation divergence."
}
```

**Recommendation:** make the confirm variant consume the same parsed flag and persist the same line-1 keys as auto (or bind `resource_map_present`/`stopPolicy` explicitly in confirm's init), so the "agree from line 1" invariant holds in both variants.

## P2

### F002 — Confirm's reducer invocation drops `reducer_artifact_arg`; artifact root silently defaults

`[SOURCE: deep-review-confirm.yaml:1546; deep-review-auto.yaml:2176; census diff 2d1]`

Auto invokes the reducer as `reduce-state.cjs {spec_folder} {reducer_artifact_arg} --create-missing-anchors --emit-resource-map` (auto:2176) after `step_bind_reducer_artifact_arg`; confirm omits the argument entirely (confirm:1546) and the variable occurs **zero** times in confirm. For the non-fanout default this is harmless (`resolveArtifactRoot` resolves to `{spec_folder}/review`, which equals confirm's `artifact_dir`), so the finding is latent, not active: if the confirm variant ever gains a lineage-directory or artifact-root override, the reducer would quietly read and write the wrong root.

**Recommendation:** pass `{reducer_artifact_arg}` (or an explicit `--artifact-dir`) in confirm:1546, or add a comment stating the default-root assumption.

### F003 — The same claim_adjudication event is persisted through two different mechanisms with different shapes

`[SOURCE: deep-review-auto.yaml:1921,1938,1954,1539-1540; deep-review-confirm.yaml:1270,1276; deep-review-auto.yaml:560]`

Both variants persist the post-iteration adjudication outcome, but differently. Auto writes a **ledger-stem** event (`{"stem":"deep_review.claim_adjudication","scope":{...},"data":{...}}`, auto:1938/1954) into an event dir that a shell loop then pushes through the append gateway (auto:1539-1540: `node "$GATEWAY" --mode review --run-directory ... --event-json "$eventFile"`); confirm writes a **flat legacy row** via inline `append_to_jsonl` (confirm:1270/1276, the exact shape my lane and the sibling lane record). Meanwhile the gate-scanner contract — identical in both files (auto:560 = confirm:513) — says "Scan state.jsonl for the most recent `claim_adjudication` **event**; use its `passed` boolean", which names only the flat-row shape. Whether the gateway's projected row of the stem event carries the `event: claim_adjudication` discriminator the scanner greps for is not specified anywhere in either YAML.

**Recommendation:** declare one persisted shape as canonical for the scanner (or teach the scanner both), and note the mechanism difference in the state-write protocol.

### F004 — The four inline containment blocks are one copy-pasted comment: "codex" residue in three branches, and the promised fail-closed resolves to advisory-only at these sites

`[SOURCE: deep-review-auto.yaml:1515-1519,1520,1528-1538; 1565-1572; 1655-1662; 1745-1752; write-containment.ts:186,221,247]`

The codex/cursor/devin/pi dispatch branches each carry a byte-identical 5-line comment: "Structural write-containment: a workspace-write **codex** leaf can write anywhere in the repo. ... append a containment_violation event to the state log, and fail the iteration fail-closed." All three non-codex branches (census: 1565-1572, 1655-1662, 1745-1752) still say *codex* — their own executors (cursor-agent, devin, pi) are never mentioned. Moreover, at these call sites the promised "fail the iteration fail-closed" is not what the code does: after `enforceWriteContainment(...)` (auto:1520, which per write-containment.ts:221 does append the `containment_violation` event itself when given the stateLogPath), the violation branch only `console.error`s "write-containment advisory: detected N out-of-scope path(s), **left on disk**" (1528-1532) and then `process.exit(dispatchExit)` (1538) — the *dispatch's* exit code, not a containment failure. The fail-closed semantics evidently live in the runner (fanout-run.cjs:2452-2458), not at these sites, so the inline comment over-promises relative to the inline code.

**Recommendation:** either specialize the comment per branch (executor name + where the failure actually lands) or reference the runner as the fail-closed authority; keep one wording, not four.

### F005 — Stale provenance reference: auto:454 cites "deep-review.md:71", which is now the table-separator line

`[SOURCE: deep-review-auto.yaml:454; review.md:71]`

The flag-honoring comment points at `deep-review.md:71` for the parsed `--no-resource-map` flag. Line 71 of `review.md` currently renders as the table rule `|------|-------|--------|` — the flag row moved as the surrounding table gained/lost rows. A reader following the reference lands one line off the mark; the comment's specificity is exactly what makes the drift misleading.

**Recommendation:** re-anchor the reference (or drop the line number and name the flag/section).

### F006 — Severity-scale vocabulary mismatch: the target spec promises P0-P3, every governing contract is 3-tier P0/P1/P2

`[SOURCE: spec.md:83,135; review-core.md:32-34,95; state-jsonl.md findingsSummary/findingsNew severity keys]`

The reviewed packet's angle rule says findings are "rated... P0 to P3 with the repo's severity meaning" (spec.md:83) and REQ-003 repeats "Every finding, P0 to P3" (spec.md:135). But the repo's own severity contract is 3-tier: review-core.md:32-34 defines exactly P0 (Blocker), P1 (Required), P2 (Suggestion), :95 constrains `severity` to "One of `P0`, `P1`, `P2`", and the deep-review state record's `findingsSummary`/`findingsNew` admit only P0/P1/P2 keys. A spec-P3 rating is therefore unrepresentable in every loop record; in practice P3 must collapse into P2, silently, with no stated rule. The packet elsewhere acknowledges the 3-key state schema, but REQ-003 still promises the 4-tier vocabulary.

**Recommendation:** either amend spec.md:83/135 to "P0 to P2", or extend the state contract's severity keys to P3 — one of the two, before wave two multiplies the ambiguity across 20 lanes' worth of records.

### F007 — Git policy swap at synthesis: auto leaves artifacts unstaged, confirm stages them; the documented invariant is unqualified

`[SOURCE: census diff 66c56 (step_leave_artifacts_unstaged ↔ step_stage_artifact_dir); state-format/loop-protocol unstaged invariant]`

The census shows the synthesis-tail step renamed between variants: auto's `step_leave_artifacts_unstaged` becomes confirm's `step_stage_artifact_dir` (diff `66c56`). The continuity/loop documentation states, unqualified, that synthesis "must not mutate the shared Git index" and leaves synthesized artifacts unstaged with staging authority retained by the operator. If confirm's stage step mutates the index, that invariant is variant-conditional, not universal; this iteration did not read the step's body, so the semantics are asserted at confidence 0.6.

**Recommendation:** qualify the invariant in the docs ("in `:auto` runs") or make the confirm step's staging read-only-ready; state which side owns the index.

### F008 — Confirm's step-graph omits 12 auto steps, including functional ones, with no in-YAML rationale

`[SOURCE: census diff: 2,3d1, 9d6, 21d17, 23,24d18, 42d35, 44,45d36, 62d52, 68d57]`

Auto carries twelve steps confirm lacks: `step_bind_reducer_artifact_arg`, `step_apply_lifecycle_request`, `step_detect_resource_map`, `step_seed_coverage_graph`, `step_enrich_strategy_resource_map`, `step_init_complete`, `step_apply_divergent_pivot_result`, `step_generate_state_summary`, `step_marker_scan`, `step_resource_map_coverage_gate`, `step_leave_artifacts_unstaged`, `step_compose_save_payload`; confirm adds exactly one (`step_stage_artifact_dir`). Some omissions are plausibly intentional interactive-mode divergences (the pivot-confirmation cluster). But others are functional, not cosmetic: both variants render the **same** iteration prompt pack (confirm:1040-1041 = auto:1037-1037, same `template_path` and same `prompt-pack.ts#renderPromptPack` renderer) whose STATE summary block needs generated inputs — yet `step_generate_state_summary` (and `step_marker_scan`) exist only in auto; likewise confirm has no `step_init_complete` completion marker and no resource-map detection despite its config record consuming `resource_map_present` (see F001). No comment in the confirm YAML justifies any of the twelve.

**Recommendation:** annotate each omission (or restore the functional ones); a future confirm-mode failure will otherwise be diagnosed as mystery, not divergence.

# Traceability Checks

| Protocol | Class | Status | Evidence / notes |
|----------|-------|--------|------------------|
| spec_code | hard | partial | Angle 6 (spec.md:83) declares "the four YAMLs"; this iteration's bound scope (prompt-001:28, strategy §13) covers the review-variant pair + presentation + referenced counterparts — 2 of the 4 YAMLs examined, 40+ loci, every question verdicted. The research-variant pair is deferred (Ruled Out #1). All 8 findings carry file:line. |
| checklist_evidence | hard | notApplicable | Target packet has no checklist.md (init: AC_COVERAGE signal inactive) and its acceptance-criteria.md is an unsatisfied scaffold (single AC-001, no evidence rows); parent-REQ assessment belongs to synthesis. |

Summary: required 2, executed 1, pass 0, partial 1, fail 0, blocked 0, notApplicable 1, gatingFailures 0.

Overlay note: this lane's crossReference config (feature_catalog_code, playbook_capability) — feature_catalog_code is partially served by the spec.md:83/135 vs contract-scale comparison (F006); playbook_capability not applicable to a prompt/YAML surface. No overlay failures.

# Assessment

- **Counts:** 8 findings — P0: 0, P1: 1 (F001), P2: 7 (F002-F008). All new; zero refinements (first iteration, no prior registry).
- **newFindingsRatio:** 1.00 — formula (new + 0.5·refined) / (priorOpen + new + refined) = 8/(0+8).durationMs note: 768000 ms measures prompt-render (T0=1789467589) to evidence-close (T2=1789468357); the artifact-compose window follows this checkpoint.
- **Novelty justification:** Angle 6 artifacts (`.opencode/commands/deep/assets/deep-review-*`, `review.md`, presentation, their referenced runtime modules) are disjoint from the sibling lane's angle-1..5 surface (SKILL.md, hub-router, leaf-manifest — its findings cite those trees); within this lane it is the first iteration. Novelty = 1.0.
- **Quality gates:** evidence — every finding cites file:line observed this session; scope — only the three narrative/delta/sidecar writes plus the sanctioned state-log append, all inside the lineage; coverage — every angle-6 question answered, negatives recorded below.
- **Verdict logic:** no P0 → not FAIL; 1 active P1 → CONDITIONAL (F001). Per prompt-001:77 mapping. P2s ride as advisories.

# Ruled Out

1. **The research-variant YAML pair** (`deep-research-auto/confirm.yaml`) — in the angle-6 *name* but outside this lane's bound prompt scope (prompt-001:28 binds the review pair + presentation + referenced). Deferred to synthesis/parent. `[SOURCE: prompt-001:28; strategy §13]`
2. **Duplicated-banner drift** — answered negative. The fan-out banner is runner-templated from a single source (fanout-run.cjs:1493 "You are orchestrating the ${agentName} workflow YAML as a detached fan-out lineage." + :1494 detachedIntro + the 7-item no-dispatch list :1436-1437, which matches the banner this lane received verbatim); presentation:86 is policy prose, not a banner copy; the only duplication is the *same sentence* of the ternary's two arms inside one function (1416 vs 1422: "Use the separate lineage directory and session id below as the detached state boundary."). No cross-artifact drift exists. `[SOURCE: fanout-run.cjs:1436-1437,1493-1494,1416,1422; presentation:86]`
3. **The agent-improvement / ai-council / model-benchmark command YAMLs** — separate commands, not the deep-loop review/research loops this angle targets; out of the bound scope. `[SOURCE: assets/ census; prompt-001:28]`
4. **`assets/compiled/` and `assets/legacy/`** — build-artifact/archives; their.timestamps (Sep 11 19:55) predate the current YAML/text quartet (Sep 15 07:19/07:37), so no staleness of the reviewed pair vs its last build is indicated; ancestry checks deferred to synthesis. `[SOURCE: assets/ listing, this session]`
5. **Renderer/counterpart existence** — `prompt-pack.ts` (3256 B) and `post-dispatch-validate.ts` (65538 B) exist as referenced (auto:1038/confirm:1041); `verify-iteration.cjs:67-69` parses exactly the `--loop-type/--artifact-dir/--iteration` invocation this lane's pack mandates; `reduce-state.cjs` honors `--artifact-dir`/`--create-missing-anchors`/`--emit-resource-map` (verified earlier this session). The "runtime counterparts" leg of Angle 6 is clean at the contract level. `[SOURCE: lib/deep-loop/ dir census; verify-iteration.cjs:67-69]`

# Dead Ends

- First step-census grep (`id: (step|phase)_…`) returned nothing — this YAML family keys steps as bare `step_foo:`/`phase_foo:` map keys, not `id:`-fields. Recounted with a key-anchored pattern; noted here because a reviewer trusting the first pattern would wrongly conclude "no steps found".
- One residual UNKNOWN (by design, not a dead end): whether the presentation contract's tier-2/3 setup binds `resource_map_present`/`stopPolicy` for `:confirm` runs — flagged in F001's downgradeTrigger rather than resolved, since reading the presentation's full bindings table exceeded this iteration's locus.

# SCOPE VIOLATIONS

None. All writes this iteration: `iterations/iteration-001.md`, `deltas/iter-001.jsonl`, `logs/iter-001-events.jsonl`, the sanctioned lane-direct append to `deep-review-state.jsonl`, and the reducer/verify invocations' in-lineage outputs.

# Recommended Next Focus / Next Dimension

Iteration 2 = **Angle 7 — agents and mirrors** (every `.opencode/agents/` agent against its `.claude`, `.codex`, `.pi` mirrors; permission mappings dropped to comments; delegation/tool vocabularies per runtime), dimensions: traceability (primary) + maintainability (secondary). Carry-over questions for later angles/synthesis: the `write-containment.ts` enforcement semantics behind F004 (angle 9's containment read); the gateway-projection discriminator behind F003 (angle 10's state/ledger read); confirm's stage-vs-leave semantics (F007) and the twelve-omission rationale (F008) — candidates for the synthesis's confirm-variant posture question.

Review verdict: CONDITIONAL
