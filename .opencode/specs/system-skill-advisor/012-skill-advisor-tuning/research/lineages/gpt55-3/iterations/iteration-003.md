# Iteration 3: Cross-Hub Collision Guard

## Focus
Angle 3. Design a cross-hub collision report for normalized phrases shared by sk-code, sk-design, and deep-loop-workflows.

## Findings
1. `parent-hub-vocab-sync.cjs` is structurally hub-local: it receives one `skillRoot` and reads that hub's `hub-router.json`, `mode-registry.json`, and optional `graph-metadata.json`. [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:263]
2. The guard already has the needed normalizer and per-mode owner concepts: `normalizePhrase`, `ownerModeForClass`, registry alias owners, typed alias keys, and alias collision detection. [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:61]
3. Current collision logic only flags multiple modes inside one hub, not the same normalized phrase across multiple hubs. [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:363]
4. A cross-hub guard must classify collisions by intent class because shared words can be legitimate. Example: sk-code has `code-review-aliases`; sk-design has `audit` and `design review` in its audit mode; deep-loop has review-loop aliases. [SOURCE: file:.opencode/skills/sk-code/hub-router.json:48] [SOURCE: file:.opencode/skills/sk-design/mode-registry.json:117] [SOURCE: file:.opencode/skills/deep-loop-workflows/hub-router.json:59]

## Sources Consulted
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs`
- `.opencode/skills/sk-code/hub-router.json`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/deep-loop-workflows/hub-router.json`

## Assessment
newInfoRatio: 0.72. Novelty: converts existing hub-local guard into a cross-hub report design. Confidence: high for report shape.

## Reflection
What worked: reusing the existing normalizer and owner model minimizes implementation risk.
What failed: naive collision = error would overflag legitimate shared generic terms.
Ruled out: fail every shared phrase across hubs.

## Recommended Next Focus
Map the advisor projection fields not covered by the current guard.
