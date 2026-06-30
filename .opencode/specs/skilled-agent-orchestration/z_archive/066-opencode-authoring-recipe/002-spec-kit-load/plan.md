---
title: "Implementation Plan: 078/002 /speckit:complete Authoring-Time sk-code Load"
description: "Add authoring-time sk-code load to /speckit:complete:auto and :confirm YAMLs. Document the cross-skill load contract in system-spec-kit and sk-code SKILL.md. Bump sk-code 3.2.0.0 → 3.2.1.0 (patch)."
trigger_phrases: ["078/002 plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/066-opencode-authoring-recipe/002-spec-kit-load"
    last_updated_at: "2026-05-05T18:10:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 2 implementation complete via cli-codex; validate PASS"
    next_safe_action: "Commit + push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "078-002-final"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 078/002 /speckit:complete Authoring-Time sk-code Load

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

077 finding F-009-001 surfaced that `/speckit:complete` loads sk-code only at REVIEW TIME (post-write), not at AUTHORING TIME (pre-write). When the implementation target is under `.opencode/skills/`, `.opencode/agents/`, `.opencode/commands/`, or `.opencode/specs/`, the orchestrator wrote without consulting sk-code's authoring checklists. Phase 2 closes that gap with: (a) a new activity at the top of `step_10_development.activities` in both auto/confirm YAMLs that detects `.opencode/` targets and instructs the orchestrator to load sk-code authoring resources before the first write; (b) a new `cross_skill_authoring_load` block alongside the existing `agent_dispatch.review` to make the authoring-time intent explicit; (c) a paragraph in system-spec-kit/SKILL.md §17 distinguishing authoring-time vs review-time load; (d) a Cross-Skill Consumption block in sk-code/SKILL.md declaring the contract from sk-code's side. sk-code bumps 3.2.0.0 → 3.2.1.0 (patch — doc-only declaration). Implementation dispatched via cli-codex; validate.sh --strict + YAML parseability + alignment-verifier all PASS.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criterion |
|---|---|
| G1 | speckit_complete_auto.yaml step_10 activity references "sk-code authoring" |
| G2 | speckit_complete_confirm.yaml mirrors G1 |
| G3 | Both YAMLs add `cross_skill_authoring_load` block |
| G4 | system-spec-kit/SKILL.md adds authoring-time vs review-time paragraph |
| G5 | sk-code/SKILL.md adds Cross-Skill Consumption block + version bump 3.2.1.0 |
| G6 | sk-code description.json version 3.2.1.0 |
| G7 | changelog/v3.2.1.0.md created (compact format) |
| G8 | Both YAMLs parse with `yaml.safe_load` |
| G9 | Existing review-time `Pre-Commit code review` block preserved unchanged |
| G10 | validate.sh --strict on 078/002 exits 0 |
| G11 | One commit on main + push origin/main success |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### YAML edit pattern (auto + confirm symmetric)

Two surgical insertions per YAML (no restructuring):

**Insertion A — `step_10_development.activities` prepend.** The first activity in the list becomes the sk-code authoring-time load instruction with target detection clause naming all 4 `.opencode/*` paths and explicit reference to the v3.2.0.0+ checklists + spec_folder_write recipe. The activity is a one-liner directive the orchestrator follows before any other Step 10 activity.

**Insertion B — `cross_skill_authoring_load` block.** A new top-level block under `agent_dispatch:` (parallel to the existing `review:` block at lines 306-320), with fields purpose / available_at_step (10) / condition (target detection) / resources / precedence / not_for. This makes the authoring-time intent observable + machine-readable, distinct from the review-time `review.standards_contract` overlay.

The existing `review:` block at lines 306-320 is preserved verbatim — review-time behavior is unchanged.

### Doc edit pattern (SKILL.md cross-references)

**system-spec-kit/SKILL.md §17:** A sub-bullet appended below rule 17 ("Route all code creation/updates through sk-code") naming the authoring-time vs review-time split. Pull-side of the contract — the system-spec-kit consumer side.

**sk-code/SKILL.md:** A new "Cross-Skill Consumption" sub-section (under §1 WHEN TO USE, before §2 SMART ROUTING) with a target-path-to-resource table mapping each `.opencode/` path to its matching authoring checklist (and recipe for `.opencode/specs/`). Push-side of the contract — what sk-code surfaces when called.

### Cli-codex dispatch

Single codex exec with stdin redirection (memory rule). Prompt enumerated insertion points with explicit line-number references and exact symmetric edits across auto/confirm. ~30s wall-clock; exit 0. Codex self-reported validate.sh + YAML parseability + alignment-verifier PASS, all re-verified by Claude orchestrator.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Spec authoring (Claude orchestrator)
- 078/002 spec.md authored with 13 REQs (11 P0 + 2 P1)
- 4 files in scope; out-of-scope explicitly excludes review block edits

### Phase 2: Implementation (cli-codex dispatch)
- Single dispatch via stdin
- 4 modified files + 1 new changelog
- ~30s wall-clock; exit 0

### Phase 3: Verification (Claude orchestrator)
- YAML parseability via `yaml.safe_load` (auto + confirm)
- REQ greps (REQ-001 through REQ-008) — all PASS (REQ-004 needed case-insensitive grep; text is present)
- validate.sh --strict on 078/002 → exit 0
- alignment-verifier on sk-code → PASS (24 files scanned, 0 findings)

### Phase 4: Commit + push
- git add 078/002 + 5 modified files + new changelog
- Commit + push origin main
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Method |
|---|---|
| YAML parseability | `python3 -c "import yaml; yaml.safe_load(open(f))"` for both YAMLs |
| Activity insertion | grep "sk-code authoring" in step_10_development context |
| cross_skill_authoring_load block | grep block name in both YAMLs (1 hit each) |
| Doc paragraphs | grep "authoring-time" (case-insensitive) in system-spec-kit SKILL.md; grep "Cross-Skill Consumption" in sk-code SKILL.md |
| Version bumps | grep version in 2 places (SKILL.md + description.json) |
| Changelog format | grep canonical heading + sections |
| validate.sh --strict | exit 0 |
| alignment-verifier | exit 0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dep | Status | Note |
|---|---|---|
| 078/001 sk-code v3.2.0.0 (provides authoring assets to load) | Green | Just shipped |
| sk-doc changelog template | Green | Used in 078/001 |
| cli-codex (gpt-5.5/high/fast) | Green | Phase 1 dispatch worked; Phase 2 dispatch also exit 0 |
| python3 yaml module | Green | Standard library |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Phase 2 is doc + YAML hint only — no algorithmic changes. Rollback paths:

- Revert single commit: `git revert <sha>` removes the 5 file changes + new changelog
- Or surgical: remove the activity + cross_skill_authoring_load block from both YAMLs; revert SKILL.md doc paragraphs; revert version bumps; delete changelog/v3.2.1.0.md

The pull-side contract (system-spec-kit/SKILL.md) and push-side contract (sk-code/SKILL.md) reference each other; rolling back one without the other creates orphan documentation. Roll back both or neither.

Stay on main; no feature branches per memory rule.
<!-- /ANCHOR:rollback -->
