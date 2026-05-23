# Iteration 001 - inventory + correctness

## Dispatcher

- Session: `deep-review-066-20260503T211436Z`
- Mode: `review`
- Budget profile: `scan` (target 9 calls; completed within hard ceiling)
- Focus: inventory + correctness
- Scope lock: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger` plus configured merger cleanup surfaces; reviewed target files remained read-only.

## Dimension

Inventory + correctness pass over accepted merger decisions, public agent/command cleanup, deleted legacy resources, moved verifier paths, and generated/advisor artifacts.

## Files Reviewed

- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-config.json`
- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-state.jsonl`
- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-findings-registry.json`
- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-strategy.md`
- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/resource-map.md`
- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/checklist.md`
- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/decision-record.md`
- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/implementation-summary.md`
- `.opencode/skills/sk-code/SKILL.md`
- Public agent mirrors under `.opencode/agents/`, `.claude/agents/`, `.gemini/agents/`, `.codex/agents/`
- `spec_kit` command assets under `.opencode/commands/speckit/`
- Deleted legacy paths checked by glob: `.opencode/skills/sk-code-opencode/**`, `.opencode/skills/sk-code/references/{go,nextjs}/**`, `.opencode/skills/sk-code/assets/{go,nextjs}/**`

## Findings - New

### P0 Findings

None.

### P1 Findings

- **F001**: ADR still describes the decision as proposed and plan-only after implementation completed -- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/decision-record.md:48` -- The ADR status remains `Proposed` and its constraints still say the turn is plan-only with no implementation edits, but the implementation summary says the runtime merge was delivered and the obsolete skill deleted. This makes the architecture decision record contradict the implemented state and the completed checklist evidence. [SOURCE: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/decision-record.md:48`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/decision-record.md:63`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/implementation-summary.md:59`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/checklist.md:65`]
   - Finding class: `matrix/evidence`
   - Scope proof: The contradictory state appears in the canonical ADR status/constraint fields, while the implementation summary and checklist show completed implementation and verification evidence for the same packet.
   - Affected surface hints: [`decision-record.md`, `implementation-summary.md`, `checklist.md`, `release-readiness synthesis`]
   - Recommendation: Update the ADR metadata/status and stale plan-only constraint language to reflect the implemented/accepted decision while preserving historical context as history, not current state.
   - Claim adjudication:
     ```json
     {
       "type": "claim-adjudication",
       "claim": "The ADR currently contradicts the implemented merger state and can mislead release-readiness decisions.",
       "evidenceRefs": [
         ".opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/decision-record.md:48",
         ".opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/decision-record.md:63",
         ".opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/implementation-summary.md:59",
         ".opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/checklist.md:65"
       ],
       "counterevidenceSought": "Checked implementation summary and checklist for whether the packet intentionally remained planning-only; both indicate completed runtime implementation and verification.",
       "alternativeExplanation": "The ADR may intentionally preserve original planning context, but its Status and Constraints are current-state fields rather than a history section.",
       "finalSeverity": "P1",
       "confidence": 0.86,
       "downgradeTrigger": "Downgrade to P2 if the project explicitly treats ADR status as immutable historical metadata after implementation."
     }
     ```

### P2 Findings

- **F002**: Resource map continuity still reflects the pre-implementation approval state -- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/resource-map.md:13` -- The resource map frontmatter says the next safe action is to await implementation approval and lists implementation approval as a blocker, while the implementation summary says the merge is complete with no blockers. Because this review uses the resource map as a coverage gate, stale continuity metadata can confuse later synthesis even though the path ledger itself was still useful for this iteration. [SOURCE: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/resource-map.md:13`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/resource-map.md:16`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/implementation-summary.md:14`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/implementation-summary.md:16`]
   - Finding class: `matrix/evidence`
   - Scope proof: The stale metadata is packet-local and affects the canonical resource map used by the configured coverage gate; no runtime code behavior depends on it.
   - Affected surface hints: [`resource-map.md`, `deep-review coverage gate`, `review-report synthesis`]
   - Recommendation: Refresh the resource map frontmatter/summary to distinguish original pre-implementation inventory from current post-implementation coverage state.

## Traceability Checks

- `spec_code`: partial pass with one P1 documentation-state contradiction in ADR current-state fields.
- `checklist_evidence`: partial pass; checklist records completed verification, but ADR status/constraints lag behind that evidence.
- Resource map coverage: partial pass; ledger covered expected target classes, but resource map continuity metadata is stale.
- Public cleanup: pass for sampled exact searches; public agent mirrors did not show live `sk-code-opencode`, `sk-code-*`, `GO`, `NEXTJS`, or React/NextJS support claims. `spec_kit` command assets retained generic `sk-code router-selected evidence` wording.
- Legacy deletion inventory: pass for checked glob paths; `.opencode/skills/sk-code-opencode/**`, `.opencode/skills/sk-code/references/{go,nextjs}/**`, and `.opencode/skills/sk-code/assets/{go,nextjs}/**` were absent.

## Integration Evidence

- Reviewed exact public integration surfaces: `.opencode/agents/*`, `.claude/agents/*`, `.gemini/agents/*`, `.codex/agents/*`, and `.opencode/commands/speckit/*`.
- Reviewed shared severity doctrine from `.opencode/skills/sk-code-review/references/review_core.md` before severity classification.
- Code graph was not used for evidence because startup context reported stale graph status; direct reads, glob checks, and exact searches were used instead.

## Edge Cases

- Exact broad search for `sk-code-opencode` returns many intentional spec-folder references; those were not treated as defects unless they contradicted current packet state.
- Resource map entries intentionally include historical/moved/deleted paths; the active P2 is limited to stale continuity/current-state metadata, not every historical path row.

## Confirmed-Clean Surfaces

- Deleted legacy skill and placeholder route trees were absent by glob.
- `sk-code` top-level router advertises `WEBFLOW`, `OPENCODE`, and `UNKNOWN`, with OpenCode language sub-detection and the moved verifier path.
- Public agent mirrors and `spec_kit` command assets no longer expose the old public `sk-code-opencode` or `sk-code-*` overlay model in sampled exact searches.

## Ruled Out

- No P0 correctness failure found in the runtime router inventory during this iteration.
- No live public-agent old-skill leak found in the sampled runtime mirrors.
- No missing deleted legacy directory found in the checked obsolete path globs.

## Verdict

Status: `complete` for this iteration. Provisional review verdict remains `CONDITIONAL` because one active P1 traceability/correctness finding exists.

Findings summary: P0=0, P1=1, P2=1. `newFindingsRatio=1.0`.

## Assessment

Dimensions addressed: correctness

## Next Dimension

- Dimension: security
- Focus area: verify advisor/hook prompt-injection safeguards, script path safety, command/workflow language, and generated artifact handling after the single-skill merger.
- Reason: inventory/correctness found documentation-state drift but no immediate runtime deletion/route correctness blocker; security should validate trust-boundary risks before deeper traceability/maintainability passes.
- Rotation status: D1 covered; proceed to D2.
- Blocked/productive carry-forward: productive exact-search and direct-read inventory; carry forward stale ADR/resource-map documentation-state findings for later traceability synthesis.
- Required evidence: advisor/hook fixture evidence, moved verifier script behavior, generated skill graph/telemetry labels, command YAML wording, and prompt-injection sanitization tests where available.
