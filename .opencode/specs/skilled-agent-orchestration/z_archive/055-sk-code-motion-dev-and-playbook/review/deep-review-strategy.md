# Deep Review Strategy — Packet 069 sk-code Motion.dev + Playbook

## TARGET

`specs/skilled-agent-orchestration/z_archive/055-sk-code-motion-dev-and-playbook/` (phase parent + 3 children + sk-code skill modifications + cross-stack motion_dev/ category + sk-doc-aligned playbook extensions).

## CHARTER

Final pre-commit audit. Verify all phase work has been correctly applied/implemented and nothing is missing. The packet is currently in "complete" state (strict validation passes; per-packet opus reviewers approved with remediations applied; sk-doc template alignment complete). This deep review is the LAST gate before commit.

## ITERATION POLICY

- **Fixed 7 iterations.** Do not converge early. Each iteration produces a focused findings file.
- **Executor**: cli-codex with model `gpt-5.5`, `model_reasoning_effort=high`, `service_tier=fast`, `--full-auto` sandbox.
- **READ-ONLY**: review iterations do not modify source files. Only `review/iterations/*.md`, `review/deltas/*.jsonl`, `review/deep-review-dashboard.md`, and (final) `review/review-report.md` are written.
- **Findings format**: severity (P0/P1/P2), file:line citation, recommended remediation. No vague observations.

## DIMENSION ROTATION (10 dimensions across 7 iterations)

| Iter | Primary dimensions | Cross-cutting check |
|---|---|---|
| 001 | (1) Cross-stack peer-category architecture, (3) sk-doc template compliance | Naming consistency (snake_case) |
| 002 | (2) Citation discipline, (8) Anti-pattern audit | URL resolution probe (5+ motion.dev URLs HEAD-test) |
| 003 | (4) No-clobber discipline, (5) Cross-ref correctness | Webflow content preservation diff |
| 004 | (7) Snippet runnability + JSDoc, (9) Skill-router coverage | Snippet API trace against motion.dev docs |
| 005 | (6) Spec-doc continuity, (10) Changelog accuracy | _memory.continuity freshness |
| 006 | Re-pass on ALL 10 dimensions — find anything missed in 001-005 | Whole-packet sanity |
| 007 | Adversarial pass — challenge prior findings; check for false positives + false negatives; verify every prior P0/P1 with independent evidence | Hunter/Skeptic/Referee |

## CONFIG

- Target: `specs/skilled-agent-orchestration/z_archive/055-sk-code-motion-dev-and-playbook`
- Mode: review
- maxIterations: 7
- convergenceThreshold: 0.0 (force fixed-pass; ignore early-stop signals)
- Executor: cli-codex, gpt-5.5, high, fast
- Output root: `review/`
- Iteration files: `review/iterations/iteration-NNN.md`
- Final synthesis: `review/review-report.md`

## KNOWN CONTEXT (loaded at init)

- All 3 child packets validate strict-pass.
- Per-packet opus reviewers approved (Packet 1: PASS_WITH_NOTES → remediated; Packet 2: PASS; Packet 3: PASS_WITH_NOTES → remediated).
- Post-implementation sk-doc alignment: snake_case rename + content restructure + 23 cross-ref propagation files.
- Pre-existing telemetry schema docs drift validator bug prevents canonical generate-context.js save (system-wide bug, not 069-specific).
- Cross-ref count in webflow/* = 13 files (was 11 originally; 2 missed mentions added during P3 remediation).
- Manual testing playbook scenario count: 17 across 6 categories (was 10 across 4).
- cli-codex GPT-5.5 high tokens consumed across implementation: ~1.08M.
