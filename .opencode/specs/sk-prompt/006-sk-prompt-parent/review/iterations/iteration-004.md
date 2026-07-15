# Deep Review Iteration 004

## Dimension

maintainability

## Files Reviewed

- `.opencode/skills/sk-code/code-review/references/review_core.md:28-40` — severity definitions and evidence requirements.
- `.opencode/specs/sk-prompt/006-sk-prompt-parent/review/deep-review-config.json:9-17` — configured target and dimension queue.
- `.opencode/specs/sk-prompt/006-sk-prompt-parent/review/deep-review-strategy.md:111-129` — maintainability was the only remaining uncovered dimension, with prior finding counts P1=2/P2=2.
- `.opencode/specs/sk-prompt/006-sk-prompt-parent/review/deep-review-findings-registry.json:132-143` — registry still marked maintainability uncovered before this iteration.
- `.opencode/skills/sk-prompt/SKILL.md:32-85` — parent hub routing contract and resource loading pattern.
- `.opencode/skills/sk-prompt/mode-registry.json:30-40` — prompt-models mode declares a read-only `toolSurface` with `Read`, `Grep`, and `Glob` allowed.
- `.opencode/skills/sk-prompt/prompt-models/SKILL.md:1-4` — prompt-models packet frontmatter declares `allowed-tools: []`.
- `.opencode/skills/sk-prompt/prompt-models/SKILL.md:103-109` — prompt-models loading levels require reading model index, model profiles, and pattern index.
- `.opencode/skills/sk-prompt/prompt-models/SKILL.md:136-184` — prompt-models router pseudocode performs guarded skill-local markdown discovery and loads `_index.md`, profile markdown, and `pattern_index.md`.
- `.opencode/skills/sk-prompt/prompt-models/README.md:40-42` — README says the packet owns profile lookup and instructs operators to read the profile then follow `pattern_index.md`.
- `.opencode/skills/sk-prompt/prompt-models/references/models/_index.md:22-30` — active model profile index exists and is the packet's required lookup surface.
- `.opencode/skills/sk-prompt/prompt-models/references/pattern_index.md:73-85` — adoption checklist expects updates to profiles, index, dispatch matrix, triggers, and advisor re-indexing.
- `.opencode/skills/sk-prompt/manual_testing_playbook/manual_testing_playbook.md:23-41` — hub routing playbook covers mode selection and wrong-packet fallthrough.
- `.opencode/agents/prompt-improver.md:55-83` and `.claude/agents/prompt-improver.md:40-68` — stale `/prompt` command mapping remains covered by prior finding R1-P1-001, not re-raised here.

## Findings by Severity

### P0

None.

### P1

#### R4-P1-001 [P1] prompt-models packet denies the read tools its own router contract requires

- Claim: The `prompt-models` packet is intended to be a read-only lookup workflow, but its packet `SKILL.md` frontmatter declares `allowed-tools: []`, while the hub registry and packet router require `Read`, `Grep`, and `Glob` to load model profiles and the pattern index.
- Evidence: The registry declares the `prompt-models` mode read-only with `toolSurface.allowed` set to `Read`, `Grep`, and `Glob` and `mutatesWorkspace:false` [SOURCE: `.opencode/skills/sk-prompt/mode-registry.json:30-40`]. The packet frontmatter instead declares `allowed-tools: []` [SOURCE: `.opencode/skills/sk-prompt/prompt-models/SKILL.md:1-4`]. The same packet then defines mandatory resource loading over `references/models/_index.md`, `references/models/<id>.md`, and `references/pattern_index.md` [SOURCE: `.opencode/skills/sk-prompt/prompt-models/SKILL.md:103-109`; `.opencode/skills/sk-prompt/prompt-models/SKILL.md:168-184`].
- Counterevidence sought: Checked the parent hub routing contract for a possible parent-level tool grant and found the hub can read router resources, but per-packet behavior is explicitly not flattened and each packet keeps its own authoring contract [SOURCE: `.opencode/skills/sk-prompt/SKILL.md:83-85`]. Checked README guidance and confirmed operators are instructed to read the profile/index resources from this packet [SOURCE: `.opencode/skills/sk-prompt/prompt-models/README.md:40-42`].
- Alternative explanation: The empty tool list may have been intended to mean "no mutating tools" rather than "no tools", but that intent conflicts with both the registry's explicit read-only tool surface and the packet's own router pseudocode.
- Final severity: P1.
- Confidence: 0.86.
- Downgrade trigger: Downgrade to P2 if the runtime is proven to ignore packet `allowed-tools` for skill resource loading and uses only the parent hub `allowed-tools`, but keep an advisory because the contradictory contracts still mislead maintainers.

### P2

None new.

## Traceability Checks

- Core `spec_code`: PARTIAL. The parent hub shape and registry routing remain traceable, but the prompt-models packet's frontmatter contradicts the registry tool-surface contract for the same workflow mode [SOURCE: `.opencode/skills/sk-prompt/mode-registry.json:30-40`; `.opencode/skills/sk-prompt/prompt-models/SKILL.md:1-4`].
- Core `checklist_evidence`: PARTIAL. Prior phase closeout evidence proves strict parent-hub checks and stale-reference sweeps, but this iteration found a maintainer-facing contract drift between packet frontmatter and registry data that the closeout evidence did not cover.
- Overlay `skill_agent`: PARTIAL. The parent hub explicitly keeps packet behavior unflattened [SOURCE: `.opencode/skills/sk-prompt/SKILL.md:83-85`], so the packet-level allowed-tools conflict matters for future skill invocation and maintenance.
- Overlay `agent_cross_runtime`: Existing stale `/prompt` references in both runtime agents remain covered by R1-P1-001 and were not re-raised [SOURCE: `.opencode/agents/prompt-improver.md:62-83`; `.claude/agents/prompt-improver.md:47-68`].
- Overlay `feature_catalog_code`: NOT APPLICABLE. No feature-catalog file is in the declared review scope.
- Overlay `playbook_capability`: PASS for routing coverage only. The hub playbook covers wrong-packet fallthrough and expected workflowMode selection [SOURCE: `.opencode/skills/sk-prompt/manual_testing_playbook/manual_testing_playbook.md:23-41`]; it does not exercise the packet frontmatter/tool-surface mismatch.

## SCOPE VIOLATIONS

No out-of-scope mutation was executed. Post-write strict validation found one target-file evidence-marker gap at `.opencode/specs/sk-prompt/006-sk-prompt-parent/006-advisor-and-integration/tasks.md:97`; fixing it would require modifying the read-only review target, so the would-be mutation is recorded here instead of applied.

## Verdict

CONDITIONAL. One new P1 maintainability finding was recorded; no P0 findings were found in this iteration.

## Next Dimension

correctness recycle pass, unless the reducer or synthesis phase chooses to stop after full dimension coverage.

Review verdict: CONDITIONAL
