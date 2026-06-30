# Deep Research Strategy - sk-design Foundations Improvement

## 1. Research Topic

Investigate how to improve the `sk-design` foundations mode, grounded in the live `design-foundations` packet, references, assets, manual playbook, prior corpus research, available external-corpus summaries, and the operator-provided Mode A routing score of 83/100.

## 2. Key Questions (remaining)

- [x] What is the current foundations skill surface and how does it route inside the parent hub?
- [x] Which 009 corpus recommendations already landed, so this run avoids re-recommending completed work?
- [x] What routing changes would most likely improve the operator-provided Mode A score?
- [x] Which reference or asset additions would improve usefulness without duplicating basics?
- [x] What tooling or validation changes would make foundations easier to trust?
- [x] What should explicitly not be done?

## 3. Non-Goals

- Do not implement changes to the skill.
- Do not write outside the lineage artifact directory.
- Do not re-litigate the parent architecture or split foundations into separate child skills.
- Do not import the external corpus wholesale.

## 4. Stop Conditions

- Stop when all key questions have evidence-backed answers and the last pass adds only marginal novelty.
- Stop before implementation recommendations become code changes.
- Stop if the requested local benchmark or external corpus path cannot be verified, and record that as evidence rather than guessing.

## 5. Answered Questions

- Current surface: the actual packet is `.opencode/skills/sk-design/design-foundations/`, with workflow mode `foundations` in the parent registry.
- Already landed: `data_viz.md`, `adaptation_matrix.md`, and `token_starter.md` were implemented in phase 012.
- Main routing opportunity: parent-level foundations aliases do not include several child-level foundations triggers such as data visualization, adaptation matrix, chart type, grid, container queries, and token starter.
- Main usefulness opportunity: token-system requests should reliably load the register plus the color, type, layout, and token-vocabulary references, not just the token scaffold.
- Main UX opportunity: add a concise foundations intake/handoff card plus worked examples, so operators do not have to infer the output shape from six references.
- Main tooling opportunity: connect manual scenarios to a small benchmark fixture matrix and record PASS/PARTIAL/FAIL runs.

## 6. What Worked

- Reading the parent hub and `mode-registry.json` first exposed the hub-vs-mode routing seam.
- Re-reading 009 and 012 prevented duplicate recommendations for data visualization, adaptation, and token starter.
- Manual playbook scenario metadata provided a ready-made source for benchmark fixtures.
- Treating the missing 014 benchmark path as negative evidence kept the synthesis honest.

## 7. What Failed

- The exact external corpus directory requested by the prompt was not present locally under the stated path.
- The exact `014-routing-benchmark` folder was not present under the sk-design parent. The `83/100` score is therefore treated as operator-provided context, not a locally cited file.
- The current router pseudocode cannot auto-discover `../shared/register.md` because its discovery bases are `references/` and `assets/` under the foundations packet.

## 8. Exhausted Approaches (do not retry)

### Exact 014 benchmark artifact lookup - BLOCKED

- What was tried: exact glob and content search for `014-routing-benchmark`, `Mode A`, and `83` under the sk-design parent.
- Why blocked: no matching local artifact surfaced.
- Do NOT retry in this lineage unless a new path is supplied.

### Exact external corpus path lookup - BLOCKED

- What was tried: exact and broader glob checks for `154-sk-design-parent/external/**/*.md`.
- Why blocked: no local external corpus files were present under the requested parent path.
- Do NOT treat absent files as read; cite the 001 and 009 summaries instead.

## 9. Ruled-Out Directions

- Add another OKLCH basics guide: already covered by `oklch_workflow.md` and `palette_theming.md`.
- Split foundations into color/type/layout child skills now: out of scope and previously ruled out as taxonomy work.
- Add style presets or palette recipes as defaults: conflicts with the role-first and evidence-first foundations contract.
- Add runtime Bash/Write tooling to the foundations skill: the skill is read-guidance oriented and its allowed tools are read/search/task.

## 10. Carried-Forward Open Questions

- None for this research pass. Implementation should still verify the benchmark fixture location before changing routing.

## 11. Next Focus

Converged. Use `research.md` as the prioritized improvement brief.

## 12. Known Context

- `resource-map.md` was not present at the spec-folder root during init; coverage gate was skipped.
- Prior 009 research ranked foundations holes as data visualization, adaptation matrix, and token starter. Phase 012 implemented all three.
- The operator supplied a Mode A routing score of 83/100 for foundations, but the local benchmark artifact path was not present.
- The write scope was restricted to this lineage directory, so spec writeback and memory save were intentionally skipped.

## 13. Research Boundaries

- Max iterations: 10.
- Iterations completed: 6.
- Stop reason: converged.
- Convergence threshold: 0.05.
- Artifact directory: `.opencode/specs/design/008-sk-design-parent/015-per-skill-improvement-research/002-foundations/research/lineages/gpt55fast`.
