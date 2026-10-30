---
title: "Implementation Summary"
description: "Implementation and verification evidence for the plain-agent-skill conversion path: staging by copy, the rendered router, the preservation gate, resource rewrites, scaffolding, generation and the format gate."
trigger_phrases:
  - "convert plain skill implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/004-convert-plain-skill"
    last_updated_at: "2026-10-30T09:10:00Z"
    last_updated_by: "claude-opus-worker"
    recent_action: "Finished the converter, its fixtures and the recorded evidence"
    next_safe_action: "Proceed with phase 005 integration"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-convert-plain-skill |
| **Status** | Complete |
| **Completed** | 2026-10-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Convert now handles a plain agent skill end to end. A source outside the skills root is copied under its declared frontmatter name, its router is rendered from the shipped template with one intent and a body-ordered resource map, the workflow agent's reshaped prose is accepted through a flag, and the original body is checked line by line before anything else is written. Resource documents get their frontmatter and their kebab names, the missing scaffold files arrive from a throwaway `init_skill.py` run, the two generators refresh the metadata, and both format validators close the run.

### Phase 4: convert-plain-skill

`plan` stays read-only: it refuses a target that exists, a hub candidate, a reserved name, a skill that does not classify as plain, fewer than eight approved phrases, and a description over 130 characters without a separate trim. `apply` repeats those refusals as pre-write checks, then runs V1 to V8 in order and stops at the first failure.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/sk-skill-convert.cjs` | Modified | V1 stage, V3(a) router render, V4 preservation check, V5 resource pass, V6 scaffold copy, V7 generators, V8 gates, and the `preserve` subcommand |
| `.skilled/commands/doctor/scripts/lib/sk-skill-convert-transforms.cjs` | Modified | Reference-link harvest, plain router render, resource frontmatter insert, kebab rename map with link rewrite, phrase proposal, preservation line rules |
| `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` | Modified | Transform unit cases plus the plain plan, apply, refusal, rollback, dropped-line and description-trim cases |
| `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-convert/plain/` | Added | Invented plain source, a reshaped "after" copy so the test needs no agent, and a dropped-line copy |
| `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `goal.md`, `plan.md` | Updated | Recorded completion, acceptance evidence and the decisions taken during implementation |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Delivered

The plan prints every step before a byte is written, so the operator approves the copy, the rendered router, the resource renames and the permission grant in one read. Apply then stages the copy, writes the agent's body under the original frontmatter, writes `ROUTER.md` exclusively, and holds the run at the preservation check until every original non-blank, non-heading body line appears somewhere in the new `SKILL.md`, `ROUTER.md` or a `references/` document. The snapshot under the backup folder is what the standalone `preserve` subcommand compares against, so an agent step outside a convert run gets the same gate.

The integration test runs apply against a copied fixture, then spawns `package_skill.py --check --strict` and `ci-skill-root-metadata.cjs --skill` as separate processes so the shipped gates, not a stub, decide the verdict. It also hashes the outside source before and after to prove the copy never touched it. A forced strict-gate failure proves the second validator never runs, and the dropped-line fixture proves the check stops the run with no staged copy left behind.

### Test fixtures

| Fixture | What it proves |
|---------|----------------|
| `plain/before` | A plain skill with no `version`, no `allowed-tools`, a non-kebab `references/Field Notes.md` and a keyword comment, so every transform has real input |
| `plain/after` | The reshaped `SKILL.md` an agent would hand back, committed so apply runs unassisted; it names two of the three smart-router markers the format check looks for |
| `plain/dropped` | The same reshape with one body line removed, so the preservation check has a real loss to catch |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Name the phrase and permission inputs as repeated flags, and refuse to write either without them | `allowed-tools` is a permission grant and intent phrases are the routing model, so the plan proposes and the operator approves. The refusal names the exact flag to repeat. |
| Snapshot the source body beside the backup and compare it against the staged tree | The prose reshape is the agent's job, so nothing but a byte-level comparison can prove the agent kept the content. Keeping the snapshot on disk also lets `preserve` run on its own. |
| Remove the staged copy when a run fails after staging | Both the plan and the pre-write check refuse a pre-existing target, so the staged tree is wholly the run's creation. Leaving a half-converted root in the skills tree would put it in front of every gate and the advisor, so a failed run leaves the skills root as it found it and keeps the snapshot for inspection. |
| Resolve the Python interpreter through the context instead of an absolute path | The scaffolder and both validators are plain Python 3, and an absolute Homebrew path does not exist off macOS. An operator-set interpreter still wins. |
| Render the router from the shipped template rather than a literal in the script | The template carries the section order, the explanatory prose and the fallback checklist the fleet already reads, so a rendered router is indistinguishable from an authored one. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` on the converter, the transforms library and the test file | Exit 0 on all three |
| `node --test .skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` | Exit 0; 21 tests passed, 0 failed |
| `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` | Exit 0; 31 tests passed, 0 failed |
| Temporary-copy run: 7 approved phrases | Exit 1, `INTENT_SIGNALS_BELOW_FLOOR` |
| Temporary-copy run: 8 phrases, three approved tools and the reshaped body | Exit 0; V1 to V8 all passed; outside source hash unchanged |
| `package_skill.py --check --strict` on the converted fixture | Exit 0; `Result: PASS` |
| `ci-skill-root-metadata.cjs --skills-dir <temp> --skill brindle-lantern` | Exit 0; `OK [S] brindle-lantern`, `checked=1 passed=1` |
| `preserve --snapshot <backup>/before` on the converted fixture | Exit 0; `Preservation PASS: 7 original body line(s) found` |
| `preserve --snapshot <backup>/before <dropped-line skill>` | Exit 1; names `Read the field notes before choosing a review path` |
| Forced strict-gate failure | Exit 1, `STRICT_PACKAGE_FAILED`, and `validate_skill_package.py` never ran |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/075-doctor-sk-skill-command/004-convert-plain-skill --strict` | `RESULT: PASSED`; 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The prose reshape is an agent step.** The script renders the router, stages, checks and gates, but a workflow agent still writes the reshaped `SKILL.md`; `preserve` bounds it rather than performing it.
2. **A dropped line stops the run at V4.** The staged copy is removed and only the snapshot survives, so recovery means re-running the plan with a corrected body rather than resuming an interrupted conversion.
3. **The derived generator needs a repo root that contains the staged skill.** The `key_files` it verifies are repo-relative, so the tests stage under their own `.skilled/skills`. A conversion outside a repository root cannot run V7 truthfully.
4. **Integration rows I1 to I6 are not written here.** Advisor registration, changelog wiring and runtime mirrors belong to phase 005.
<!-- /ANCHOR:limitations -->

---
