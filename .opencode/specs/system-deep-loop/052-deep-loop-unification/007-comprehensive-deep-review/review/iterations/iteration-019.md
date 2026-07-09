# Deep Review Iteration 019

## Dimension

Traceability + maintainability — `deep-ai-council` packet.

## Files Reviewed

- `.opencode/skills/sk-code/code-review/references/review_core.md:28` — severity ladder and evidence requirements loaded before severity calls.
- `.opencode/skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:166` — iteration artifact/state checklist loaded.
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-strategy.md:86` — Section 12 next focus read before review.
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl:41` — latest iteration record read; iteration 18 findings carried forward only.
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json:162` — current registry count read before starting: P0=0, P1=7, P2=13.
- `.opencode/commands/deep/ai-council.md:10` — command wrapper renders the maintained command contract.
- `.opencode/commands/deep/assets/compiled/deep_ai-council.contract.md:44` — compiled contract includes current packet path.
- `.opencode/commands/deep/assets/compiled/deep_ai-council.contract.md:160` — autonomous command contract uses the current command surface.
- `.opencode/commands/deep/assets/compiled/deep_ai-council.contract.md:218` — command write boundary remains `{spec_folder}/ai-council`, matching packet-local artifact layout.
- `.opencode/skills/system-deep-loop/mode-registry.json:79` — live workflow mode remains `ai-council`.
- `.opencode/skills/system-deep-loop/mode-registry.json:90` — live packet path is `deep-ai-council`.
- `.opencode/skills/system-deep-loop/mode-registry.json:92` — live runtime agent is `ai-council`.
- `.opencode/skills/system-deep-loop/mode-registry.json:93` — live artifact root is `ai-council/`.
- `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:5` — current packet version is `2.4.0.0`.
- `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:20` — in-CLI multi-seat design is documented.
- `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:432` — success checklist explicitly distinguishes packet name from `@ai-council` agent identity.
- `.opencode/skills/system-deep-loop/deep-ai-council/README.md:11` — README frontmatter version inspected.
- `.opencode/skills/system-deep-loop/deep-ai-council/README.md:39` — human overview explains six lenses and convergence.
- `.opencode/skills/system-deep-loop/deep-ai-council/README.md:94` — README explains one-CLI-per-round seat orchestration.
- `.opencode/skills/system-deep-loop/deep-ai-council/README.md:110` — README documents two-of-three convergence behavior.
- `.opencode/skills/system-deep-loop/deep-ai-council/changelog/v2.4.0.0.md:4` — latest changelog version inspected.
- `.opencode/skills/system-deep-loop/deep-ai-council/changelog/v2.4.0.0.md:19` — changelog documents current packet/command/agent/artifact split.
- `.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/seat_diversity_patterns.md:27` — maintainer-facing lens selection matrix inspected.
- `.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/seat_diversity_patterns.md:52` — same-CLI vantage model inspected.
- `.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/feature_catalog.md:15` — feature catalog overview inspected.
- `.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/feature_catalog.md:39` — DAC-001 catalog entry inspected.
- `.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/01--runtime-routing-and-rename/runtime-agent-renamed-to-deep-ai-council.md:31` — DAC-001 detail page inspected.
- `.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/01--runtime-routing-and-rename/runtime-agent-renamed-to-deep-ai-council.md:25` — DAC-001 scenario objective inspected.
- `.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/01--runtime-routing-and-rename/runtime-agent-renamed-to-deep-ai-council.md:30` — DAC-001 desired visible outcome inspected.
- `.opencode/agents/ai-council.md:2` — live OpenCode agent identity inspected.

## Findings By Severity

### P0

None.

### P1

None new. `DR-018-P1-001` remains active and was carried forward only: persistence still records council completion as converged even when max-round or all-seat-failure paths should stay non-converged.

### P2

#### DR-019-P2-001 [P2] README version metadata lags the current packet release

- File: `.opencode/skills/system-deep-loop/deep-ai-council/README.md:11`
- Evidence: `SKILL.md` now declares `version: 2.4.0.0` and the latest changelog is `v2.4.0.0`, but the README frontmatter still says `version: 2.3.0.21`. The changelog specifically records the folder/name alignment in v2.4.0.0 and preserves command, agent, and artifact keys, so README metadata is stale even though most README body content is current.
- Evidence refs: `.opencode/skills/system-deep-loop/deep-ai-council/README.md:11`, `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:5`, `.opencode/skills/system-deep-loop/deep-ai-council/changelog/v2.4.0.0.md:4`, `.opencode/skills/system-deep-loop/deep-ai-council/changelog/v2.4.0.0.md:19`
- Finding class: instance-only
- Scope proof: README/changelog currency was checked directly; the newest changelog file exists and matches the SKILL version, isolating the drift to README metadata rather than package release absence.
- Recommendation: Update README frontmatter version to the current packet release or mark it as independently versioned if that is intended.
- finalSeverity: P2
- confidence: 0.94

#### DR-019-P2-002 [P2] DAC-001 still expects `@deep-ai-council` as the active runtime agent identity

- File: `.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/01--runtime-routing-and-rename/runtime-agent-renamed-to-deep-ai-council.md:30`
- Evidence: The live registry says the packet is `deep-ai-council`, but the command agent is `ai-council` and artifact root is `ai-council/`. The live OpenCode agent frontmatter also names `ai-council`. `SKILL.md` success criteria describe exactly that split: packet folder/SKILL name is `deep-ai-council`, while the dispatched agent identity remains `ai-council`. DAC-001 still asks testers to verify active runtime mirrors use `deep-ai-council` and says the desired visible outcome is `@deep-ai-council`, which contradicts the current preserved agent identity.
- Evidence refs: `.opencode/skills/system-deep-loop/mode-registry.json:90`, `.opencode/skills/system-deep-loop/mode-registry.json:92`, `.opencode/skills/system-deep-loop/mode-registry.json:93`, `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:432`, `.opencode/agents/ai-council.md:2`, `.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/01--runtime-routing-and-rename/runtime-agent-renamed-to-deep-ai-council.md:25`, `.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/01--runtime-routing-and-rename/runtime-agent-renamed-to-deep-ai-council.md:30`
- Finding class: matrix/evidence
- Scope proof: The DAC-001 feature detail partly corrects the split at line 31, but the root feature row and playbook scenario still encode the obsolete expectation, so a future maintainer/tester can get conflicting instructions from the catalog/playbook path.
- Recommendation: Rename DAC-001 around the current split, e.g. packet routes to `deep-ai-council` while runtime agent remains `@ai-council`, and update scenario expected signals/pass-fail accordingly.
- finalSeverity: P2
- confidence: 0.91

## Traceability Checks

| Check | Result | Evidence |
|---|---|---|
| `package_skill.py --check` | PASS | Exact output below. |
| Command references current layout | PASS | Command wrapper renders maintained contract; compiled/rendered contract references current `deep-ai-council` packet sources and `{spec_folder}/ai-council` artifact boundary. |
| README/changelog currency | PARTIAL | Latest changelog and SKILL are `2.4.0.0`; README metadata is still `2.3.0.21`. |
| Multi-seat maintainability | PASS with existing advisories | README/SKILL/seat-diversity docs clearly document 2-3 seats, six lenses, one-CLI-per-round, same-CLI vantage diversity, and two-of-three convergence. |
| SKILL/reference duplication | PASS | SKILL.md carries the compact routing/resource map and top-level rules; deeper details live in references (`seat_diversity_patterns`, `convergence_signals`, `state_format`, etc.). No harmful duplication was confirmed. |

Package check exact output:

```text
🔍 Validating skill: deep-ai-council
==================================================

✅ Skill is valid!

==================================================
Result: PASS
```

## Verdict

`deep-ai-council` is structurally valid and maintainable enough for future seat additions, but it is not clean. It carries forward `DR-018-P1-001` and `DR-018-P2-001`, and this iteration adds two P2 traceability/currency advisories. No new P0/P1 was confirmed.

## Next Dimension

Iteration 20: cross-cutting synthesis. Re-run fresh package checks plus parent-skill check, reconcile packet-level verdicts, and synthesize active findings across hub, deep-research, deep-review, deep-improvement, and deep-ai-council.

Review verdict: PASS
