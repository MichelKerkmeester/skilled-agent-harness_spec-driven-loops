# Iteration 020 — Angle 20

**Angle:** Continuity ladder truth: resume documentation vs implemented handover/continuity frontmatter behavior.

**Summary:** The implemented resume ladder is freshness-based and implementation-summary-centric, while several docs still describe strict handover-first ordering, phase-parent redirect behavior, and broader continuity-frontmatter placement. The highest-risk gaps are direct `session_resume` missing the documented phase-parent redirect and the official handover template not feeding the parser's structured resume fields.

**Findings kept:** 4

## [P1][DOC-DRIFT] Docs claim fixed handover-first ordering, but code selects freshest handover or continuity

- Evidence: .opencode/skills/system-spec-kit/README.md:97; .opencode/skills/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:870-873; .opencode/skills/system-spec-kit/mcp_server/tests/resume-ladder.vitest.ts:187-210
- Detail: The README says resume rebuilds context in a fixed order with handover first. The implementation compares `handover.md` and `_memory.continuity` timestamps and selects whichever is fresher, and the regression test explicitly expects newer continuity to beat older handover.
- Fix sketch: Update README, feature catalog, and playbooks to describe the actual freshest-handover-or-continuity policy, or change the code/tests to enforce strict handover priority.

## [P1][BROKEN-FEATURE] Documented phase-parent last_active_child redirect is absent from session_resume resume ladder

- Evidence: .opencode/commands/speckit/assets/speckit_resume_auto.yaml:59-63; .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:53-55; .opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts:648-653; command: rg -n "last_active_child_id|isPhaseParent|phase-parent|graph-metadata|last_active_at" ".opencode/skills/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts" ".opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts" -> no output
- Detail: The resume workflow and schema comments claim phase parents redirect through `graph-metadata.json.derived.last_active_child_id`. The direct `session_resume` path simply calls `buildResumeLadder()` with the provided folder and the resume ladder contains no phase-parent or graph-metadata handling, so direct tool callers can resume the parent instead of the active child.
- Fix sketch: Implement phase-parent detection and fresh child-pointer resolution inside `buildResumeLadder()` or remove the direct `session_resume` redirect claim from docs.

## [P1][BUG] Official handover template does not match the handover parser's fields

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:469-482; .opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl:72-83; .opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl:90-95
- Detail: The parser only extracts `**Recent action**`, `**Next safe action**`, `**Blockers**`, and `**Key files**`. The official template uses sections like `Recommended Starting Point`, `Priority Tasks Remaining`, and a validation checklist, so a template-based handover can win the ladder without structured next-step/blocker data.
- Fix sketch: Either add parser support for the template sections or update the handover template to include the exact parser-recognized labels.

## [P2][DOC-DRIFT] Validation contract overstates where _memory.continuity lives

- Evidence: .opencode/skills/system-spec-kit/references/validation/template_compliance_contract.md:263; .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:1301-1317; .opencode/skills/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:818-835
- Detail: The validation contract says to put a `_memory.continuity` frontmatter block in every doc, including plan/tasks/checklist. The implemented save and resume paths route/read continuity from `implementation-summary.md` when present, falling back to `spec.md` as metadata host only when the summary is absent.
- Fix sketch: Narrow the validation documentation to the implemented canonical host behavior or add real multi-doc continuity support.
