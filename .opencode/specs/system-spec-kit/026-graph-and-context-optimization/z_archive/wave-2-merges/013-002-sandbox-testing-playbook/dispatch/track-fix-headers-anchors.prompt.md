# Codex dispatch: Fix G3 strict validate — TEMPLATE_HEADERS + ANCHORS_VALID

## ROLE

You are Codex (gpt-5.5 high fast) dispatched by Claude Opus 4.7 to add missing template headers + HTML anchors to 6 packet docs so `validate.sh --strict` passes G3.

Spec folder (pre-approved, skip Gate 3): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/`

Branch: stay on `main`. Do not create or switch branches.

## CANONICAL TEMPLATE SOURCE (read first; treat as locked)

`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/`

Use that packet's spec.md / plan.md / tasks.md / checklist.md / implementation-summary.md / decision-record.md as the canonical reference for required headers + anchors. The validator demands exact section names + matching `<!-- ANCHOR:slug -->` comments.

## CURRENT FAILING SET (from `validate.sh --strict --verbose`)

### spec.md missing headers
- EXECUTIVE SUMMARY (must appear BEFORE `## 1. METADATA`)
- 7. NON-FUNCTIONAL REQUIREMENTS (currently `## L2: NON-FUNCTIONAL REQUIREMENTS` — RENAME)
- 8. EDGE CASES (currently `## L2: EDGE CASES` — RENAME)
- 9. COMPLEXITY ASSESSMENT (currently `## L2: COMPLEXITY ASSESSMENT` — RENAME)
- 10. RISK MATRIX (NEW — extract from existing §6 RISKS table or stub)
- 11. USER STORIES (NEW — stub with audit-trail justification: scenarios serve operators upgrading spec-kit + maintainers running smoke tests)
- 12. OPEN QUESTIONS (currently `## 7. OPEN QUESTIONS` — RENUMBER to 12)
- RELATED DOCUMENTS (NEW — list 001-doctor-commands packet docs + canonical playbook templates as ## RELATED DOCUMENTS)

### plan.md missing headers + anchors
- 5. TESTING STRATEGY (anchor `testing`)
- 6. DEPENDENCIES (anchor `dependencies`)
- 7. ROLLBACK PLAN (anchor `rollback`)
- L2: PHASE DEPENDENCIES (anchor `phase-deps`)
- L2: EFFORT ESTIMATION (anchor `effort`)
- L2: ENHANCED ROLLBACK (anchor `enhanced-rollback`)
- L3: DEPENDENCY GRAPH (anchor `dependency-graph`)
- L3: CRITICAL PATH (anchor `critical-path`)
- L3: MILESTONES (anchor `milestones`)

### tasks.md missing headers + anchors
- Task Notation (anchor `notation`) — RENAME current `## 1. OVERVIEW` to `## Task Notation` and explain ID format `T-NNN`
- Phase 1: Setup (anchor `phase-1`) — RENAME current `## 2. PHASE A: SCAFFOLD 002`
- Phase 2: Implementation (anchor `phase-2`) — combine current `## 3. PHASE B` + `## 4. PHASE C` + `## 5. PHASE D` under one `## Phase 2: Implementation` umbrella with sub-sections
- Phase 3: Verification (anchor `phase-3`) — RENAME current `## 6. PHASE E: VERIFICATION GATES G1-G7`
- Completion Criteria (anchor `completion`) — NEW section
- Cross-References (anchor `cross-refs`) — NEW section linking back to spec.md REQs

### checklist.md missing headers + anchors
- Code Quality (anchor `code-quality`)
- Testing (anchor `testing`)
- Fix Completeness (anchor `fix-completeness`)
- Security (anchor `security`)
- Documentation (anchor `docs`)
- File Organization (anchor `file-org`)
- Verification Summary (anchor `summary`)
- L3+: ARCHITECTURE VERIFICATION (anchor `arch-verify`)
- L3+: PERFORMANCE VERIFICATION (anchor `perf-verify`)
- L3+: DEPLOYMENT READINESS (anchor `deploy-ready`)
- L3+: COMPLIANCE VERIFICATION (anchor `compliance-verify`)
- L3+: DOCUMENTATION VERIFICATION (anchor `docs-verify`)
- L3+: SIGN-OFF (anchor `sign-off`)

Existing checklist anchors (KEEP): `protocol`, `pre-impl`, `scenario-authoring`, `root-playbook`, `sandbox-harness`, `smoke-tests`, `close`. Add the 13 new anchors as additional sections (don't delete existing).

### implementation-summary.md missing headers + anchors
- How It Was Delivered (anchor `how-delivered`)
- Key Decisions (anchor `decisions`)
- Verification (anchor — already present as `verification`, just verify it stays)
- Known Limitations (anchor `limitations`)

Existing impl-summary anchors (KEEP): `metadata`, `what-built`, `dispatch-results`, `verification`, `deferred`, `files-touched`, `next-session`. Add `how-delivered`, `decisions`, `limitations` as additional sections referencing or summarizing existing content.

### decision-record.md missing anchors
- adr-001 (anchor wrapping `## ADR-001: Scenario ID range` section)
- adr-001-context (anchor on the **Context** subsection)
- adr-001-decision (anchor on the **Decision** subsection)
- adr-001-alternatives (anchor on the **Alternatives rejected** subsection)
- adr-001-consequences (anchor on the **Consequences** subsection)
- adr-001-five-checks (anchor — NEW; add a "Five Checks" subsection with stubs covering simplicity / performance / maintainability / scope / security)
- adr-001-impl (anchor — NEW; add an "Implementation pointer" subsection citing where ADR-001 is realized in code/docs)

For ADR-001 only — the validator only flags ADR-001's missing anchors. ADR-002..ADR-007 don't need explicit anchor coverage at this validator level; preserve them as-is.

## HARD CONSTRAINTS

1. **Do NOT delete existing content.** Add or rename, but preserve all existing tables / requirements / ADRs / scripts. Validator wants additions, not rewrites.
2. **Do NOT change frontmatter.** Frontmatter compact fixes already applied; do not touch `_memory.continuity.recent_action` or `next_safe_action`.
3. Use the canonical 010/003 packet (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/`) as your section/anchor reference. Match its structure exactly.
4. The validator checks section name match (case-insensitive) and `<!-- ANCHOR:slug -->` placement. Section name must be on a `## ` line in proper order; anchor must be on its own comment line just above the matching `## ` heading and closed with `<!-- /ANCHOR:slug -->` at end of section (or implicit-close before next anchor).
5. For NEW sections (USER STORIES, RISK MATRIX, etc.), keep content brief but specific — extract from existing prose where possible, otherwise stub with bullet pointers (1-3 lines).
6. For RENAMES (L2: → numbered), keep the existing content; only the heading changes.
7. After each file edit, re-run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <PACKET> --strict --verbose 2>&1 | tail -50` to verify the count of TEMPLATE_HEADERS + ANCHORS_VALID violations is decreasing. Final goal: both checks PASS or 0 issues remain.
8. **Stay on main.** Do not branch.

## VERIFICATION COMMAND

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook \
  --strict --verbose 2>&1 | tail -80
```

Target outcome: `Errors: 0` (or close to it — accept any residual frontmatter narrative issue I missed).

## OUTPUT REQUIREMENT

After completion, print:
1. List of files modified
2. Final `validate.sh --strict` summary (paste tail -10 output)
3. If any error remains: short note on what's left + why it's stuck
