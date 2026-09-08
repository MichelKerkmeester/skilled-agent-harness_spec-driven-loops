# Deep Research Strategy — deepseek-v4-flash-templates-r3

- Session: `fanout-deepseek-v4-flash-templates-r3-1788784306229-pqwref`
- Lineage: `deepseek-v4-flash-templates-r3` (round three, deepseek-v4-flash-vision-exp executor, inline)
- Status: COMPLETE (5/5 iterations, stopReason maxIterationsReached)

## Known Context

- Rounds 1-2 (GLM 5.3 Flash, DeepSeek V4 Flash; 10 iterations each) produced findings remediated in 010-template-contract-alignment and 016-template-seams-and-sentinel-repair. Census read once in iteration 1; no census-fixed/kept/recorded row re-reported without new evidence.
- Round-three mandate: five fixed angles, one per iteration, hand-read checked-in source only.

## Key Questions

- KQ1: Does each packet-type scaffold pass its own validation rules untouched? → answered (iteration 1)
- KQ2: Do upgrades 1→2 and 2→3 produce everything a fresh scaffold at the target level carries? → answered (iteration 2)
- KQ3: Do check-placeholders.sh patterns cover every bracketed token shape templates ship? → answered (iteration 3)
- KQ4: Do templates citing HVR_REFERENCE obey the human-voice rules they cite? → answered (iteration 4)
- KQ5: Do sk-doc and system-spec-kit ship competing templates for the same document class? → answered (iteration 5)

## Answered Questions

- KQ1: No. create.sh rejects review/research levels entirely; review-report.md has no template; the renderer cannot place path-typed docs; two resolvers disagree on review spec.md.
- KQ2: No. Upgrades omit implementation-summary.md (present in every fresh scaffold) and add decision-record.md on 2→3 (absent from fresh L3 scaffold); scaffold-only appended blocks are never injected.
- KQ3: No. The guard detects two shapes; the templates' dominant left-to-fill class is neither substituted nor detected, and the detected class in handover.md is destroyed by blanket substitution.
- KQ4: No. goal.md ships an em dash and a semicolon, decision-record.md an Oxford comma, and hvr-rules.md's own template registry names nonexistent paths.
- KQ5: No conflict. Zero acceptance-criteria content under sk-doc; only two minimal validator fixtures model a divergent spec shape.

## What Worked

- The diff-driven upgrade design (render old vs new, inject only new sections) is drift-proof for the five mapped docs and matched the scaffolder's template choices.
- The scaffolder's phase special case and its phase-parent rename are coherent with both rules' phase branches.
- The census-driven two rounds left the lifecycle gating (tasks.md list items), template-source marker placement, and checkbox exclusion classes correct in the reads performed.

## What Failed

- The render output naming is basename-only, defeating contract path-typed doc names — the same class as the phase-parent rename hack, still unhidden behind CLI level rejection.
- The placeholder guard and the scaffolder's substitution list are two uncoordinated authorities: each misses shapes the other owns.
- The sk-doc HVR reference was never reconciled with the flattened system-spec-kit template tree during rounds one and two (stale table paths; template punctuation violations).

## Exhausted Approaches

- Reading register: per-iteration 12-call budget (iteration 1 disclosed a 2-call overage for verification + artifact persistence; all later iterations ≤8 evidence calls).
- Search-based overlap detection (file names + content grep) — exhausted for sk-doc; the 8-hit cap was not reached because the universe holds 2.

## Ruled-Out Directions

- review-report.md template absence is deliberate (unverified; loop writers generate the report).
- create.sh phase path is broken (verified coherent).
- Checkbox false-positive class and backtick exclusions are broken (verified correct).
- HVR_REFERENCE path is broken (verified: file exists at cited path).
- sk-doc ships a competing acceptance-criteria template (grep: 0 hits).

## Divergence Frontier

- The packet-type level rows (review/research) versus the CLI and the template universe form the largest coherent seam: three declared packet types, one scaffoldable.
- The placeholder/guard authority split suggests one test (render every template at every level, assert zero un-replaced bracket shapes) as the consolidation point.

## Next Focus

- (none — loop complete per mandate; findings and open questions carried in findings-registry.json, research.md and the iteration files.)

<!-- machine-owned sections above; append-only notes below -->

## Notes

- Executor hard limits honored: ≤12 tool calls per iteration; ≤8 items sampled per scan; no script/harness; no validate.sh / node / git; writes confined to this lineage directory.
