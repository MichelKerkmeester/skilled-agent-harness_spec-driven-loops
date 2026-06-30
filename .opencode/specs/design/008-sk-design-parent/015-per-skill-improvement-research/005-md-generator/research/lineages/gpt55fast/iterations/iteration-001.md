# Iteration 1: Live Contract And Path Reality

## Focus

Map the active md-generator skill, its owning hub, and non-negotiable output contract.

## Findings

- The live target is `.opencode/skills/sk-design/design-md-generator`, not `.opencode/skills/sk-design/md-generator`. The parent hub lists `md-generator` as workflow mode and points it to `sk-design/design-md-generator/` [SOURCE: .opencode/skills/sk-design/SKILL.md:23-29].
- The mode's core value is measured CSS to a v3 Style Reference `DESIGN.md`; it captures existing CSS and does not invent a design direction [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:12-15], [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:42-51].
- The pipeline is sequential: EXTRACT crawls and emits tokens, WRITE runs `build-write-prompt.ts` and writes prose around deterministic sections, VALIDATE checks fidelity [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:221-305].
- The cardinal rule is the main boundary: every value in DESIGN.md must be verbatim from `tokens.json`, with stability gates and no fabricated dark mode [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:263-270], [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:328-335].

## What Was Tried And Failed

- Tried to read canonical docs in the declared target spec subfolder. `spec.md`, `plan.md`, `tasks.md`, and `resource-map.md` were absent. This lineage therefore records `folderState: no-spec`.

## Assessment

- newInfoRatio: 0.92
- Novelty: high. This iteration established the live path and contract, preventing stale flat-path assumptions.
- Next focus: reconcile prior corpus recommendations with current live files.
