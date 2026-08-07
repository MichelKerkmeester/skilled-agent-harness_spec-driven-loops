# Deep Review Iteration 7

## Dimension
Synthesis-risk release-readiness pass: verify the complete fix set for the four active P1 findings closes cleanly without leaving half-fixed documentation or metadata surfaces.

## Files Reviewed
- `README.md:33` - current FEATURES TOC still links `SPEC KIT DOCUMENTATION` to `#spec-kit-documentation`.
- `README.md:208` - current FEATURES heading still says `### 📋 Spec Kit Documentation`.
- `README.md:778-818` - root Deep Loop feature text advertises autonomous loops and runtime capabilities without the permission/sandbox boundary or fan-out guardrail posture.
- `README.md:866` - root README already links to the Deep Loop Runtime README, but the link is generic.
- `README.md:1230-1234` - current Goal utility entry carries Claude/OpenCode split, `/goal_opencode`, `mk_goal` controls, atomic fail-closed state, active-goal injection, lifecycle accounting, and default-off autonomy guardrails.
- `.opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/tasks.md:72-73` - task plan includes the Spec Kit rename and Goal Plugin FEATURES subsection with TOC entry.
- `.opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/graph-metadata.json:164` - active metadata still indexes `Spec Kit Documentation`.
- `.opencode/skills/deep-loop-runtime/README.md:44` - runtime README mentions permissions gating and cost guards generically.
- `.opencode/skills/deep-loop-runtime/README.md:102` - runtime README mentions fixed-rate overrun accounting, isolated lineage directories, and opt-in stall watchdog, but not the full root-README safety sentence needed for P1-004.
- `.opencode/skills/deep-loop-runtime/scripts/README.md:22-23` - script README covers fanout-run signal handling and the lag-ceiling/stall detector wording.
- Whole-repo markdown grep for `#spec-kit-documentation` - live action remains README plus this phase's spec/review evidence; archived review artifacts are non-live.

## Findings by Severity

### P0
None.

### P1

#### P1-003 [UPDATED] Active graph metadata will not safely self-resolve from checkbox-only completion
- Claim: The prior expectation that `graph-metadata.json` will self-resolve after metadata regeneration is incomplete unless the source wording is also corrected or the generated metadata is explicitly patched after regeneration.
- Evidence: `graph-metadata.json:164` still contains the derived entity name `Spec Kit Documentation`; `tasks.md:72` still contains the same retired phrase in the active task text, so a regenerate after only marking checkboxes complete still has live source text from which the entity can be re-derived.
- Counterevidence sought: I checked whole-repo `#spec-kit-documentation` references and did not find another live anchor-dependent consumer outside README/spec/review evidence; that narrows P1-001 but does not clear the metadata source problem.
- Alternative explanation: The metadata generator might ignore completed task rows or quoted old labels, but no reviewed evidence proves that behavior, and current `graph-metadata.json` already shows the task wording can feed the entity catalog.
- Final severity: P1, because memory/search graph consumers can continue surfacing the retired label after the README fix if metadata is trusted as regenerated but the source remains unchanged.
- Confidence: 0.84.
- Downgrade trigger: Downgrade only if the metadata regeneration implementation is proven to ignore completed task rows or quoted old labels, or if the remediation explicitly updates `tasks.md:72` wording before regenerating metadata.
- Finding class: cross-consumer.
- Content hash: `docaudit-p1-003-active-graph-metadata-old-spec-kit-entity-v2`.

### P2
No new P2 findings.

## Traceability Checks
- `P1-001` fix completeness: PASS. Rename both `README.md:33` and `README.md:208` to `Spec Kit Framework`, and change the TOC target to `#spec-kit-framework`. Whole-repo `#spec-kit-documentation` search found no additional live anchor consumer beyond README/spec/review evidence.
- `P1-002` fix completeness: CONDITIONAL. The plan is complete only if the new `### Goal Plugin` FEATURES subsection also gets a TOC entry and preserves every fact currently carried by `README.md:1231-1234` before the Utility entry is trimmed to a cross-reference.
- `P1-003` fix completeness: FAIL for self-resolution. Regeneration-after-completion alone is not a safe plan while `tasks.md:72` still contains `Spec Kit Documentation`; explicitly update source wording and regenerate metadata, or manually correct `graph-metadata.json` after generation.
- `P1-004` fix completeness: CONDITIONAL. A bare link to `.opencode/skills/deep-loop-runtime/README.md` is insufficient because the runtime README only partially covers the safety posture. The root README needs one sentence naming permission/sandbox boundary plus stall watchdog, per-lineage cost cap, and lag-ceiling/overrun guardrails, with a link to runtime/script docs.
- `spec_code`: PASS for this iteration's scope; the current spec/tasks already require the README rename, Goal subsection, and TOC entry.
- `checklist_evidence`: CONDITIONAL; the final checklist should require evidence that metadata no longer contains the retired entity after regeneration or manual correction.
- `feature_catalog_code`: PASS/partial. Runtime docs have usable supporting links for stall watchdog and lag ceiling, but not enough to replace the missing root safety-posture sentence.

## Verdict
CONDITIONAL. No new independent P1 was added, but active `P1-003` is materially narrowed: do not close it as self-resolving unless source wording and regenerated metadata are both verified.

## Next Dimension
Continue to iteration 8 under `stop-policy=max-iterations`; recommended angle is synthesis-input integrity for the final review report and remediation plan seed.
Review verdict: CONDITIONAL
