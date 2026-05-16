# Iteration 005 — Adversarial Final Pass

## METADATA
- Iteration: 5 / 5
- Date: 2026-05-05
- Executor: cli-codex (gpt-5.5, high, fast)
- Lens: Hunter + Skeptic + Referee

## HUNTER FINDINGS (new issues missed by prior iterations)
- No new standalone finding. The hunter pass **amends P0-004**: the self-rename over-replacement is broader than Phase 002. Phase 003 also says `deep-review to deep-review` and `deep-research to deep-research` in `specs/skilled-agent-orchestration/070-sk-deep-rename/003-opencode-internals/spec.md:7` and `specs/skilled-agent-orchestration/070-sk-deep-rename/003-opencode-internals/graph-metadata.json:20`; Phase 004 repeats the same pattern in `specs/skilled-agent-orchestration/070-sk-deep-rename/004-runtime-mirrors/spec.md:8`, `specs/skilled-agent-orchestration/070-sk-deep-rename/004-runtime-mirrors/spec.md:179`, and `specs/skilled-agent-orchestration/070-sk-deep-rename/004-runtime-mirrors/graph-metadata.json:20`. Recommended remediation: restore source-side `sk-deep-review` / `sk-deep-research` wording in child-phase rename narratives and metadata, then grep Packet 070 for identity rename strings.

Hunter checks that did not produce new findings:

- Behavior parity sample: 3 files from each renamed skill matched their old `sk-deep-*` counterpart after rename-token normalization:
  - `.opencode/skills/deep-review/feature_catalog/02--state-management/02-strategy-tracking.md`
  - `.opencode/skills/deep-review/assets/deep_review_strategy.md`
  - `.opencode/skills/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-003.md`
  - `.opencode/skills/deep-research/feature_catalog/01--loop-lifecycle/05-memory-save.md`
  - `.opencode/skills/deep-research/assets/deep_research_strategy.md`
  - `.opencode/skills/deep-research/scripts/tests/fixtures/interrupted-session/research/iterations/iteration-003.md`
- Asset filename scan: `find .opencode/skills/deep-review .opencode/skills/deep-research -name "*sk-deep-*"` returned no filenames.
- Assets/references/scripts scan: 41 files under renamed skills' `assets/`, `references/`, and `scripts/` had no exact `sk-deep-review` / `sk-deep-research` text.
- Command YAML assets use new skill names: `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:56`, `spec_kit_deep-review_confirm.yaml:56`, `spec_kit_deep-research_auto.yaml:67`, and `spec_kit_deep-research_confirm.yaml:53`.
- Cross-stack docs: `.opencode/skills/sk-code/references/motion_dev` and `.opencode/skills/sk-code/references/webflow` contain no stale `sk-deep-*` references.
- Test fixtures: `.opencode/skills/system-spec-kit/scripts/test-fixtures/` contains no stale `sk-deep-*` references.

## SKEPTIC REVIEW
| Prior ID | Iteration | Severity | Verdict (KEEP/DOWNGRADE/DROP/AMEND) | Notes |
|---|---:|---|---|---|
| P1-001 | 001 | P1 | KEEP | Evidence still holds. `.opencode/changelog/sk-deep-review` and `.opencode/changelog/sk-deep-research` are active symlinks to missing old skill folders, while `.opencode/skills/deep-review/changelog/` and `.opencode/skills/deep-research/changelog/` exist. Severity stays P1 because active changelog discovery remains broken for the renamed skills. |
| P1-002 | 002 | P1 | KEEP | The exact advisor probe still ranks `sk-code-review` first and `deep-review` second for `iterative review loop for spec folder audit` (`0.942` vs `0.925`). Severity stays P1 because top-1 routing can bypass the deep-review state machine for loop-language prompts. |
| P1-003 | 002 / 003 | P1 | AMEND | Core evidence holds and expands. `deep-review` / `deep-research` graph metadata still use `"family": "sk-deep"`; compiled `skill-graph.json`, `skill-graph-db.ts`, `query.ts`, `tool-schemas.ts`, `tool-input-schemas.ts`, and `skill_graph_compiler.py` still expose `sk-deep` as a public family. Also, derived trigger phrases still include `sk deep review` / `sk deep research`. Severity remains P1 because this is a public graph/API identity surface, not a dangling path. |
| P1-004 | 002 | P1 | KEEP | Strict advisor validation still exits non-zero on `.opencode/skills/sk-code/graph-metadata.json:201` because `reference-category` is not in the compiler allow-list at `skill_graph_compiler.py:387`. Severity stays P1 for release signoff because strict advisor validation cannot be claimed green. |
| P0-004 | 004 | P0 | AMEND | Phase 002 evidence is correct and still present. The finding expands to Phase 003 and Phase 004 identity-rename metadata/narrative. Severity stays P0 because Packet 070 cannot honestly sign off while child specs document self-renames instead of source-to-target renames. |

## REFEREE VERDICT
**Verdict**: FAIL
**Outstanding counts**: P0=1, P1=4, P2=0

Rationale: there are no outstanding behavior-parity failures in the renamed skill folders from this pass, and several high-risk reference surfaces are clean. The unresolved P0 in Packet 070's child-phase documentation blocks final commit readiness. The four P1s are also still live and require remediation or explicit acceptance, but the P0 alone is enough to fail.

## INDEPENDENT VERIFICATION (3 prior findings spot-checked)

1. **P0-004 spot-check**: `specs/skilled-agent-orchestration/070-sk-deep-rename/002-skill-folder-rename/spec.md:74` still says to rename `.opencode/skills/deep-review/` to `.opencode/skills/deep-review/`; `tasks.md:67` and `implementation-summary.md:73` repeat the same identity-rename pattern. The cited evidence is correct.
2. **P1-002 spot-check**: running `skill_advisor.py "iterative review loop for spec folder audit" --threshold 0.0` still returns `sk-code-review` above `deep-review`. The remediation should tune loop/state-machine prompts toward `deep-review` and add a regression fixture.
3. **P1-001 spot-check**: `.opencode/changelog/sk-deep-review -> ../skill/sk-deep-review/changelog` and `.opencode/changelog/sk-deep-research -> ../skill/sk-deep-research/changelog` still point at missing old folders. The fix remains to replace them with `deep-review` / `deep-research` symlinks targeting existing changelog directories.

## FINAL FINDING SET (post-skeptic adjustments)

### P0

- **P0-004 (AMENDED)** — Packet 070 child-phase docs contain over-replaced self-renames.
  - Evidence: `002-skill-folder-rename/spec.md:7`, `002-skill-folder-rename/spec.md:74`, `002-skill-folder-rename/plan.md:98`, `002-skill-folder-rename/tasks.md:67`, `002-skill-folder-rename/implementation-summary.md:73`, `002-skill-folder-rename/graph-metadata.json:19`, `003-opencode-internals/spec.md:7`, `003-opencode-internals/graph-metadata.json:20`, `004-runtime-mirrors/spec.md:8`, `004-runtime-mirrors/spec.md:179`, `004-runtime-mirrors/graph-metadata.json:20`.
  - Remediation: restore source-side `sk-deep-review` / `sk-deep-research` wording wherever the child specs describe the rename source, then re-run focused greps for `deep-review to deep-review`, `deep-research to deep-research`, and same-path `.opencode/skills/deep-*` rename rows.

### P1

- **P1-001 (KEEP)** — Active changelog symlinks still expose old skill names and point at missing old skill folders.
- **P1-002 (KEEP)** — Required iterative-review advisor probe routes top-1 to `sk-code-review`, not `deep-review`.
- **P1-003 (AMENDED)** — Public deep-loop family identity remains `sk-deep` across metadata, compiled graph, schema, handler, compiler, and query surfaces.
- **P1-004 (KEEP)** — Strict advisor graph validation still fails on `sk-code` entity kind `reference-category`.

### P2

- None.
