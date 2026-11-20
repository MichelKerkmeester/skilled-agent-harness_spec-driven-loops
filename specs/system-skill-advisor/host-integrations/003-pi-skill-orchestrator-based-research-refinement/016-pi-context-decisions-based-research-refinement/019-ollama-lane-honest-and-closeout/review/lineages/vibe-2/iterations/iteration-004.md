# Review Iteration 004

## Dispatcher

- Mode: review (fan-out lineage `vibe-2`)
- Session: `fanout-vibe-2-1795172940208-84a42n`, generation 1, lineageMode `new`
- Focus: Frontier node F-1-005, dimension `security`
- Review target type: `files`
- Operator review focus: the commit set `31ffd18beab`, `1ccbb3283c6`, `dc3979eb451`, `86038dfba80`, `c74042fd559`, `571575632a4`, `5c91b2f3f5d`, `0390556ee2b`, and the ten `docs(specs)` commits `2f5fe41bb9e`..`aaaff7dd9df`.

### How this iteration addressed the operator review focus

The focus asks for defects in shipped behavior and for doc claims that mislead an operator. This iteration read the security-relevant claims in the feature catalog, the scoring references and the changelogs that commit `1ccbb3283c6` rewrote, and checked each against the code it names. The prompt-isolation claim for `why_recommended` holds, the `semanticLaneHealth` gating claim holds, and the line references the commit updated are correct. One gap remains: the docs define three of the eight `disabledReason` tokens the code can emit.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/attribution.md:25`
- `.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:76-84`
- `.skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md:55-62`
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-status.md`
- `.skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/trust-state.md`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:168-220`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:195-245,530-580`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:27,157-260,325-338,399-413`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. R1-P1-001 from iteration 1 remains active and keeps this run at CONDITIONAL.

### P2 Findings

1. **The docs define three of the eight `disabledReason` tokens the code can emit** -- `.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:80` -- the reference says "Missing or stale coverage reports `incomplete_skill_vectors`", and the changelog repeats it. The code emits eight distinct tokens: `adapter_unavailable`, `database_absent`, `dim_mismatch`, `incomplete_skill_vectors`, `lane_weight_zero`, `no_skill_vectors`, `projection_embedding_stale` and `skill_embedding_load_failed` (`semantic-shadow.ts:157-260,399-413`, `advisor-status.ts:209-224`). Only `database_absent`, `incomplete_skill_vectors` and `lane_weight_zero` appear in any doc under the feature catalog, references, playbook, changelog or `INSTALL-SKILLED.md`. A missing vector set reports `no_skill_vectors`, not the `incomplete_skill_vectors` the reference names.
   Finding class: `traceability`
   Scope proof: the claim is in the declared target `.skilled/skills/system-skill-advisor/references`; the tokens are emitted from the declared target `.skilled/skills/system-skill-advisor/runtime`.
   Affected surface hints: `advisor_status --include-semantic-health`, `semanticLaneHealth.disabledReason`, doctor embedder diagnosis, operator H5 playbook.
   Case: an operator runs `advisor_status --include-semantic-health true` on a workspace whose skill-graph database has no skill vectors yet. The status reports `disabledReason: "no_skill_vectors"`. The reference tells them missing coverage reports `incomplete_skill_vectors`, so they search the docs for a token that never appears and find no explanation of the one they were given.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | partial | `.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:80`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:400` | The reference names one coverage token where the code emits two. Recorded as R4-P2-001. |
| `checklist_evidence` | notApplicable | `review/deep-review-config.json` `resource_map_present: false` | Files target, no checklist to reconcile. |
| `skill_agent` | pass | `.skilled/skills/system-skill-advisor/SKILL.md`, `.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:76-84` | The skill's own scoring reference matches the lane's shipped behavior on weight, gating and degradation. |

## Integration Evidence

- Prompt isolation: `publicWhyRecommended` maps every evidence entry through `evidenceFeature`, which returns a fixed category token from the prefix before the first colon (`advisor-recommend.ts:168-190`), so no raw prompt phrase, token or evidence string reaches `why_recommended`.
- Health gating: `semanticLaneHealth` is added only when `includeSemanticHealth || debug` (`advisor-status.ts:534,558`), and the backend probe runs only when `includeSemanticHealth === true` (`advisor-status.ts:575-576`), matching the reference's wording.
- Line references the commit updated resolve: `semantic-shadow.ts:27` is `COSINE_THRESHOLD = 0.2`, `semantic-shadow.ts:405` is the `score <= COSINE_THRESHOLD` cutoff, and `semantic-shadow.ts:325-338` is the `VITEST` token-overlap fallback.

## Edge Cases

- **Ambiguity: whether an undocumented token is a defect or an internal detail.** The tokens are operator-facing through `advisor_status`, so they are documented surface. Recorded as a finding rather than dismissed.
- **Contradiction: the reference and the changelog both name only `incomplete_skill_vectors`.** Both are wrong for the empty-vector case. The finding cites the reference as the primary location and names the changelog as a second occurrence.
- **Missing dependency: no test asserts the documented token set.** No test in the declared target enumerates the `disabledReason` vocabulary against the docs. Recorded, not converted into a pass.

## Confirmed-Clean Surfaces

- `why_recommended` cannot leak prompt content: every evidence entry is reduced to a fixed category token (`advisor-recommend.ts:168-190`), and the doc-path allowlist rejects anything outside `references/` or `assets/` markdown (`advisor-recommend.ts:225`).
- `semanticLaneHealth` is opt-in exactly as the reference states (`advisor-status.ts:534,558`).
- The `VITEST` token-overlap fallback is at the lines the reference cites (`semantic-shadow.ts:325-338`).
- The cosine cutoff is at the lines the reference cites (`semantic-shadow.ts:27,405`).
- The trust-state vocabulary the feature catalog lists matches the four states the code exposes: live, stale, absent, unavailable.

## Ruled Out

- **`why_recommended` leaks prompt phrases.** Ruled out: `evidenceFeature` returns a fixed token for every prefix and a fixed fallback for anything else.
- **`semanticLaneHealth` is always emitted.** Ruled out: both call sites gate it on `includeSemanticHealth || debug`.
- **The reference's line citations drifted.** Ruled out: all three cited ranges resolve to the code they describe.

## Next Focus

- Dimension: `traceability`
- Focus area: frontier node F-1-002, the `spec_code` and `checklist_evidence` core protocols against the owning packet's decisions D1 and D2, and the `agent_cross_runtime` overlay for the advisor's agent surfaces.
- Reason: F-1-005 `security` is complete; F-1-002 `traceability` is the next uncovered dimension and carries the two core protocols the run must record at least once.
- Rotation status: F-1-002 `correctness` and `security` complete; F-1-005 `correctness` and `security` complete.
- Blocked/productive carry-forward: productive — enumerating the code's token vocabulary and diffing it against the docs produced a precise gap.
- Required evidence: the owning packet's `decision-record.md` D1 and D2, `acceptance-criteria.md`, and the advisor's `SKILL.md`.
- Recovery note: none.

Review verdict: CONDITIONAL
