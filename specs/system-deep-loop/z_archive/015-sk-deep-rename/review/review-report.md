# Deep Review Report — Packet 070 (sk-deep-* -> deep-* Rename)

## VERDICT
**Status**: FAIL
**Date**: 2026-05-05
**Iterations**: 5 / 5 (fixed-pass)
**Executor**: cli-codex (gpt-5.5, high, fast)

## EXECUTIVE SUMMARY

The five-pass review covered cross-file consistency, advisor/skill graph integrity, broken references, over-replacement, and an adversarial behavior-parity pass. The rename is largely complete in active command, agent, runtime mirror, and renamed skill-folder surfaces: sampled skill files match old content after token normalization, no `*sk-deep-*` filenames remain inside the renamed skill folders, command YAML assets use `deep-review` / `deep-research`, and system-spec-kit test fixtures do not contain stale exact `sk-deep-*` references.

The packet is not ready for commit. One P0 remains active: Packet 070 child-phase docs still contain over-replaced identity-renames such as `deep-review to deep-review`, including Phase 002 and additional Phase 003 / Phase 004 metadata found in the final pass. Four P1s also remain: stale changelog symlinks, an advisor probe that still prefers `sk-code-review`, the public `sk-deep` graph family identity, and strict advisor validation failure on unrelated `sk-code` metadata.

Recommended next action: remediate the P0 first, then either fix or explicitly accept the P1s before re-running a focused validation pass. Do not commit this packet as final while the P0 is live.

## FINDINGS BY SEVERITY

### P0 (Blockers)

- **P0-004 (AMENDED)** — Packet 070 child-phase docs contain over-replaced self-renames.
  - Evidence: `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/002-skill-folder-rename/spec.md:7`, `spec.md:74`, `plan.md:98`, `tasks.md:67`, `implementation-summary.md:73`, `graph-metadata.json:19`; plus `003-opencode-internals/spec.md:7`, `003-opencode-internals/graph-metadata.json:20`, `004-runtime-mirrors/spec.md:8`, `004-runtime-mirrors/spec.md:179`, and `004-runtime-mirrors/graph-metadata.json:20`.
  - Fix: restore source-side `sk-deep-review` / `sk-deep-research` wording in rename narratives and metadata; then grep for identity-rename strings under the packet.

### P1 (Required)

- **P1-001** — Active changelog symlinks still use old names and target missing old folders: `.opencode/changelog/sk-deep-review` and `.opencode/changelog/sk-deep-research`.
- **P1-002** — Advisor probe `iterative review loop for spec folder audit` still ranks `sk-code-review` above `deep-review`, so loop-language prompts can route to the single-pass review skill.
- **P1-003 (AMENDED)** — Deep-loop family identity remains `sk-deep` across graph metadata, compiled graph, SQLite/schema code, handler validation, tool schemas, compiler allow-lists, and derived trigger phrases.
- **P1-004** — `skill_advisor.py --validate-only --show-rejections` still fails because `.opencode/skills/sk-code/graph-metadata.json:201` uses entity kind `reference-category`, which the compiler rejects.

### P2 (Suggestions)

- None.

## DIMENSION COVERAGE
| Dimension | Iter Coverage | Verdict |
|---|---|---|
| 1. Cross-file consistency | 1, 5 | FAIL |
| 2. Advisor + skill graph integrity | 2, 5 | FAIL |
| 3. No broken references | 3, 5 | PARTIAL |
| 4. No over-replacement | 4, 5 | FAIL |
| 5. Behavior parity | 5 | PASS |

## REMEDIATION RECOMMENDATION

1. Fix P0-004 in Packet 070 child specs:
   - `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/002-skill-folder-rename/spec.md`
   - `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/002-skill-folder-rename/plan.md`
   - `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/002-skill-folder-rename/tasks.md`
   - `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/002-skill-folder-rename/implementation-summary.md`
   - `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/002-skill-folder-rename/graph-metadata.json`
   - `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/003-opencode-internals/spec.md`
   - `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/003-opencode-internals/graph-metadata.json`
   - `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/004-runtime-mirrors/spec.md`
   - `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/004-runtime-mirrors/graph-metadata.json`
2. Replace stale changelog symlinks with `.opencode/changelog/deep-review -> ../skill/deep-review/changelog` and `.opencode/changelog/deep-research -> ../skill/deep-research/changelog`.
3. Tune advisor routing so combined iterative-review-loop/spec-folder-audit prompts rank `deep-review` top-1, then add a regression fixture.
4. Decide the canonical new family ID (`deep` or `deep-loop`), update metadata/schema/compiler/query surfaces, and rebuild graph artifacts.
5. Fix strict advisor validation by changing `reference-category` to an allowed entity kind or deliberately extending the entity-kind contract and tests.

## POSITIVE OBSERVATIONS

- Renamed skill folders exist and old `.opencode/skills/sk-deep-*` roots are absent.
- Behavior-parity spot checks across 3 random files per renamed skill matched their old tracked counterparts after rename-token normalization.
- No filenames containing `sk-deep-*` remain under `.opencode/skills/deep-review` or `.opencode/skills/deep-research`.
- Command workflow assets hardcode the new skill IDs and paths.
- `.opencode/skills/sk-code/references/motion_dev`, `.opencode/skills/sk-code/references/webflow`, and `.opencode/skills/system-spec-kit/scripts/test-fixtures/` have no stale exact `sk-deep-*` references.

## METHODOLOGY NOTES

- Read-only, fixed 5-pass review.
- cli-codex gpt-5.5 high fast --full-auto.
- Final pass used Hunter + Skeptic + Referee: new false-negative search, independent challenge of all prior P0/P1 findings, and final release verdict synthesis.
- Writes were limited to `review/iterations/iteration-005.md`, `review/review-report.md`, and `review/deltas/iter-005.jsonl`.

## ITERATION INDEX

- iter-001: cross-file consistency · P0=0, P1=1, P2=0
- iter-002: advisor + skill graph integrity · P0=0, P1=3, P2=0
- iter-003: broken references · P0=0, P1=0 new, P2=0; carried P1-003
- iter-004: no over-replacement · P0=1, P1=0, P2=0
- iter-005: adversarial · final verdict FAIL · outstanding P0=1, P1=4, P2=0
