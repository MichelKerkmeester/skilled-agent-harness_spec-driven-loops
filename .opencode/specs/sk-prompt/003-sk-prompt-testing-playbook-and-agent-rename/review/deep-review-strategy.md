---
title: Deep Review Strategy — Packet 085 (sk-prompt playbook + agent rename)
description: 5-iteration deep review of packet 085 deliverables. Driver = cli-opencode with deepseek-v4-pro primary / copilot Claude Sonnet 4.6 fallback.
review_target: skilled-agent-orchestration/z_archive/003-sk-prompt-testing-playbook-and-agent-rename
max_iterations: 5
convergence_threshold: 0.10
---

# Deep Review Strategy

## Target

Packet `skilled-agent-orchestration/z_archive/003-sk-prompt-testing-playbook-and-agent-rename` — two phases shipped today:

- **Phase 001**: agent `@improve-prompt` → `@prompt-improver` (4 runtime renames + 35 reference rotations)
- **Phase 002**: 28-scenario manual testing playbook for `sk-prompt` skill conforming to sk-doc contract

## Review Dimensions

| # | Dimension | Focus |
|---|-----------|-------|
| 1 | Agent-rename completeness | Any active-scope `@improve-prompt` or `improve-prompt` (as agent name) refs missed? Frontmatter `name:` rotated in all 4 runtime files? |
| 2 | Playbook sk-doc conformance | Root index has all required sections (TOC, OVERVIEW, GLOBAL PRECONDITIONS, EVIDENCE REQUIREMENTS, COMMAND NOTATION, REVIEW PROTOCOL, ORCHESTRATION, category sections, AUTOMATED TEST CROSS-REFERENCE, FEATURE CATALOG INDEX). Per-feature files have 5 mandatory sections. |
| 3 | Scenario realism + coverage | Each of 28 scenarios has a realistic operator-style user request (NOT a SKILL.md paraphrase). Coverage matches the 7-category split documented in spec.md. Pass/fail conditions are deterministic. |
| 4 | Identity preservation | Command `/prompt` and command file path UNCHANGED. Only agent name + agent file rotated. |
| 5 | Documentation hygiene | Spec docs (parent + 2 children) PASS strict validate. SKILL.md has ONE backref link, not 28 inline. |
| 6 | Frozen continuity respect | Historical/completed packet docs (z_archive, z_future, completed packets, .git, barter) NOT touched. |

## Severity Ladder

- **P0 (Blocker)**: missed agent-name rotation, broken skill-graph routing, malformed playbook structure, scenario file missing mandatory sections, identity violations
- **P1 (Required)**: stale doc references, scenario without realistic user request, half-rotated files, frozen-scope violations
- **P2 (Suggestion)**: minor wording, follow-on cleanup, optional consistency improvements

## Per-Iteration Focus

| Iteration | Primary Lens | Adversarial Bias |
|-----------|--------------|------------------|
| 1 | Agent-rename completeness + Identity preservation | "Where's a missed @improve-prompt or rotated identity?" |
| 2 | Playbook sk-doc conformance | "Where does the playbook drift from sk-doc contract?" |
| 3 | Scenario realism + coverage | "Which scenarios paraphrase SKILL.md instead of having operator-realistic user requests?" |
| 4 | Documentation hygiene + Frozen continuity respect | "Where do spec docs drift from convention or leak into frozen scope?" |
| 5 | Synthesis + cross-cutting | "What did the prior 4 iterations miss?" |

## Convergence

- Stop early if 3 consecutive iterations report 0 P0 + 0 P1 findings
- Severity-weighted newFindingsRatio < 0.10 also satisfies convergence
- All P0 findings must be resolved or explicitly accepted before PASS verdict

## Known Context

- Phase 001 verified: 4 agent files renamed, 0 active-scope `@improve-prompt` residuals after corrected glob exclusions
- Phase 002 verified: 28 scenario files (4+4+6+4+4+4+2 across 7 categories), `validate_document.py` exit 0, root index 28 SP rows, 0 forbidden sidecars
- Strict validate parent + 2 children: 0 errors / 0 warnings
- Advisor probe `"improve my prompt"` → `sk-prompt` @ 0.9262 (still resolves correctly)
- sk-prompt SKILL.md has 1 `## RELATED PLAYBOOK` line in §10
- Phase 002 used per-category numbering convention (001-name.md per folder), NOT global SP-NNN paths
- `.codex/` paths required manual finalization (cli-codex sandbox blocked its own runtime)

## Executor

- Primary: `opencode-go/deepseek-v4-pro` via `opencode run -m opencode-go/deepseek-v4-pro --pure --dangerously-skip-permissions`
- Fallback: `github-copilot/claude-sonnet-4.6` if deepseek doesn't respond (per memory rule)
- Each iteration runs in fresh opencode session

## Outputs

- `review/iterations/iteration-NNN.md` per iteration (raw findings + adversarial self-check)
- `review/deltas/iter-NNN.jsonl` per iteration (machine-readable findings)
- `review/deep-review-state.jsonl` (loop state)
- `review/review-report.md` (final synthesis with P0/P1/P2 table + verdict)
