# sk-code--review

Stack-agnostic baseline code-review skill for OpenCode repositories.

This skill defines universal findings-first review principles and mandatory security/correctness minimums. It is designed to run with one stack overlay skill:

- `sk-code--opencode` for OpenCode system code
- `sk-code--web` for frontend/web code
- `sk-code--full-stack` as default fallback

## What This Skill Adds

- Severity-ordered findings (`P0` to `P3`) with file:line evidence
- Baseline+overlay standards contract with explicit precedence
- Security/correctness minimum floor that overlays cannot weaken
- SOLID, quality, and removal-plan references for consistent review output

## Intended Usage

Use this skill when review intent is explicit, for example:

- "Review this PR for blockers"
- "Run a security-focused code review"
- "Quality gate this diff before merge"
- "Find P0/P1 issues and propose fixes"

Default behavior is review-first and read-only findings.

## Package Structure

```text
sk-code--review/
├── SKILL.md
├── README.md
└── references/
    ├── quick_reference.md
    ├── solid_checklist.md
    ├── security_checklist.md
    ├── code_quality_checklist.md
    └── removal_plan.md
```

## Validation

Run validation from repo root:

```bash
python3 .opencode/skill/sk-documentation/scripts/quick_validate.py .opencode/skill/sk-code--review --json
python3 .opencode/skill/sk-documentation/scripts/package_skill.py .opencode/skill/sk-code--review
```
