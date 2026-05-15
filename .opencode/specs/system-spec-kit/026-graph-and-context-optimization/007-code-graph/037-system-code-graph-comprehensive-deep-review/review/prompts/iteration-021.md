# Iteration 021 Prompt — Verify P0-1 Spec-Kit Isolation Claim

## SITUATION

The packet 037 review-report promotes P0-1 as a release-blocking spec-kit isolation violation. The report claims 46 `system-spec-kit` / `@spec-kit/shared` imports across 23 files, with a 15 production / 8 test split, and says the changelog + install guide claim zero imports while CI checks only the reverse direction.

## TASK

Independently verify the import count, file count, documentation claims, and CI isolation-check direction using grep/read-only evidence.

## SCOPE

- `.opencode/skills/system-code-graph/`
- `.opencode/skills/system-code-graph/changelog/v1.0.0.0.md`
- `.opencode/skills/system-code-graph/INSTALL_GUIDE.md`
- `.github/workflows/isolation-check.yml`

## CONSTRAINTS

- Read-only on `.opencode/skills/system-code-graph/`.
- Use direct grep/read evidence.
- Classify the finding as VERIFIED, HALLUCINATED, or PARTIAL.

## OUTPUT FORMAT

Mirror the deep-review iteration format: Summary, Files Reviewed, Findings grouped by severity, and Convergence Signal.
