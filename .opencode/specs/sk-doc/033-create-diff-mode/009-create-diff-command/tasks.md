---
title: "Tasks: /create:diff slash command for the create-diff mode"
description: "Planned implementation queue for the /create:diff command: author the router, presentation contract, and auto/confirm workflow YAML; generate the Codex stub via sync-prompts.cjs; wire the mode-registry command field; verify asset existence, tool-surface subset, engine-never-bypassed, and recursive strict validation."
trigger_phrases:
  - "create diff command tasks"
  - "diff command router tasks"
  - "create-diff command workflow tasks"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/033-create-diff-mode/009-create-diff-command"
    last_updated_at: "2026-07-15T19:16:49Z"
    last_updated_by: "claude"
    recent_action: "Applied create-command conformance fix; reconciled 009 to Complete"
    next_safe_action: "Commit the conformance fix + finalized 009 and push to v4"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-diff-command-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: /create:diff slash command for the create-diff mode

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are satisfied |
| `[B]` | Blocked by an explicit gate |

**Task Format**: T### [P?] Description (file path)

> This packet is built and structurally verified: every task is `[x]` complete with an inline `[EVIDENCE: ...]` bracket. The only deferred item is live end-to-end `/create:diff` invocation in an actual OpenCode/Codex session, which is a user-runtime acceptance step not reproducible from this authoring environment (see `checklist.md` and `implementation-summary.md` Known Limitations).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the sibling command pattern by reading `flowchart.md` + its three assets, and the create-diff engine CLI surface from `create-diff/SKILL.md` §3; freeze scope in `spec.md` (full sibling pattern, engine-backed). [EVIDENCE: `flowchart.md` + its three assets and create-diff SKILL.md §3 were read; scope frozen as the full sibling pattern, engine-backed.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Author `.opencode/commands/create/diff.md`: frontmatter (`description`, `argument-hint`, `allowed-tools: Read, Write, Edit, Bash, Glob, Grep`) + ROUTER CONTRACT / OWNED ASSETS / MODE ROUTING / EXECUTION TARGETS / PRESENTATION BOUNDARY / WORKFLOW SUMMARY, ending `User request: $ARGUMENTS`, modeled on `flowchart.md` (REQ-001, REQ-004) (`.opencode/commands/create/diff.md`). [EVIDENCE: `diff.md` authored — 54 lines with all six sections (ROUTER CONTRACT / OWNED ASSETS / MODE ROUTING / EXECUTION TARGETS / PRESENTATION BOUNDARY / WORKFLOW SUMMARY), ending `User request: $ARGUMENTS`.]
- [x] T003 Author `create_diff_presentation.txt`: Phase 0 packet-resource self-check, the four startup questions (which document; automatic-baseline vs explicit before/after pair; report output path; unified vs side-by-side view), setup/status dashboards, and the completion display (report path + change counts + fidelity tier + validator result) (REQ-007) (`.opencode/commands/create/assets/create_diff_presentation.txt`). [EVIDENCE: `create_diff_presentation.txt` authored — 183 lines carrying the Phase 0 packet self-check, the four startup questions, setup/status dashboards, and the completion display (report path, +A −R ~C counts, fidelity tier, validator result).]
- [x] T004 [P] Author `create_diff_auto.yaml`: autonomous workflow — resolve inputs → `create_diff.py compare` (automatic baseline) or `compare-pair` (explicit pair) → `validate_report.py` on the output → present; no approval gates (REQ-001, REQ-003) (`.opencode/commands/create/assets/create_diff_auto.yaml`). [EVIDENCE: `create_diff_auto.yaml` authored — 566 lines, autonomous, wrapping `create_diff.py compare`/`compare-pair` → `validate_report.py` → present with no approval gates; `yaml.safe_load` parses clean.]
- [x] T005 [P] Author `create_diff_confirm.yaml`: interactive checkpointed workflow with the same engine steps as `:auto`; the default when no mode is given (REQ-001, REQ-003) (`.opencode/commands/create/assets/create_diff_confirm.yaml`). [EVIDENCE: `create_diff_confirm.yaml` authored — 629 lines, interactive default, driving the same engine steps as `:auto`; `yaml.safe_load` parses clean.]
- [x] T006 Set the create-diff mode's `command` field in `mode-registry.json` from `null` to `"/create:diff"`; keep the JSON valid (REQ-005) (`.opencode/skills/sk-doc/mode-registry.json`). [EVIDENCE: create-diff `command` field flipped `null` → `"/create:diff"`; JSON re-validated as valid.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Generate `.codex/prompts/create-diff.md` via `.opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs` from the OpenCode command; confirm it is idempotent and carries no hand-authored drift (REQ-006) (`.codex/prompts/create-diff.md`). [EVIDENCE: generated via `sync-prompts.cjs` (wrote 1 of 38); `--check` re-run reports "PASS: 38 prompts are in sync"; result is a 12-line stub pointing to the canonical OpenCode command.]
- [x] T008 Verify `:auto`, `:confirm`, and an omitted mode each resolve exactly one workflow YAML, and that the router references only owned assets that exist on disk (REQ-001, REQ-002). [EVIDENCE: router MODE ROUTING verified — `:auto` → `create_diff_auto.yaml`, `:confirm`/omitted → `create_diff_confirm.yaml`; all three referenced assets confirmed present on disk.]
- [x] T009 Verify `allowed-tools` is a subset of the create-diff mode surface with no `Task`, and that the workflow drives `create_diff.py` + `validate_report.py` without re-implementing any diffing (REQ-003, REQ-004). [EVIDENCE: `allowed-tools` verified exactly `Read, Write, Edit, Bash, Glob, Grep` (no `Task`); every `--flag` in the YAMLs (`--before/--after/--report/--view/--json/--label-before/--label-after/--state-dir`) verified real against `build_parser`; the workflow drives the CLIs and never re-implements diffing.]
- [x] T010 Run `parent-skill-check.cjs` (create-diff registered with its command) and confirm `mode-registry.json` is valid (REQ-005). [EVIDENCE: `parent-skill-check.cjs .opencode/skills/sk-doc` → "all hard invariants passed, 0 warnings" (create-diff registered, 12 modes); `mode-registry.json` confirmed valid JSON.]
- [x] T011 Run `validate.sh --recursive --strict` on 033; confirm 0 content/structure errors for this child (the not-yet-generated `description.json`/`graph-metadata.json` are produced by the operator afterward). [EVIDENCE: `validate.sh --recursive --strict` on 033 → Errors 0 for every folder including this child (009 → 0/0); the only tree warning is a pre-existing continuity-freshness lag in sibling 001-research, which is untouched and out of scope.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Router + presentation + both workflow YAMLs authored; every owned asset resolves
- [x] `:auto`/`:confirm`/omitted-mode each resolve exactly one workflow YAML
- [x] `allowed-tools` is a subset of the mode surface with no `Task`
- [x] The workflow drives the engine end to end; no diffing re-implemented; source byte-unchanged
- [x] `mode-registry.json` `command` = `"/create:diff"`; `parent-skill-check.cjs` clean
- [x] Codex stub generated (not hand-edited) and idempotent
- [x] Recursive strict validation clean (content/structure) on the 033 parent
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification Checklist**: `checklist.md`
- **Predecessor (hardened engine)**: `../008-fidelity-safety-a11y-hardening/`
- **Modeled-on router**: `../../../../commands/create/flowchart.md`
- **Engine + validator**: `../../../../skills/sk-doc/create-diff/scripts/`
<!-- /ANCHOR:cross-refs -->
