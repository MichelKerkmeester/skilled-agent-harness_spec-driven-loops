# Iteration 003 - Maintainability and Context Index

Focus: maintainability/context-index.

Findings:
- `G3-F004` P2 documentation count drift. The target spec says the context-index documents 6 left-in-place items at `spec.md:127`, but `context-index.md:50-58` lists 7 rows. [SOURCE: .opencode/specs/system-skill-advisor/000-migration-from-system-speckit/spec.md:127] [SOURCE: .opencode/specs/system-skill-advisor/context-index.md:50]
- `G3-F005` P2 documentation path drift. `context-index.md:40` says the old disk name was `system-skill-advisor/999-skill-advisor-tuning`, while `spec.md:112` and `decision-record.md:123` describe renaming `system-skill-advisor/001-skill-advisor-tuning`. [SOURCE: .opencode/specs/system-skill-advisor/context-index.md:40] [SOURCE: .opencode/specs/system-skill-advisor/000-migration-from-system-speckit/spec.md:112] [SOURCE: .opencode/specs/system-skill-advisor/000-migration-from-system-speckit/decision-record.md:123]

Review verdict: PASS
