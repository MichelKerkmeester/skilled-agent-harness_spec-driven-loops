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
    last_updated_at: "2026-10-30T10:45:00Z"
    last_updated_by: "code-agent-worker"
    recent_action: "Fixed the two reviews, added the approval flags and wired the integration rows"
    next_safe_action: "Close both phase packets against the recorded evidence"
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

Convert now handles a plain agent skill end to end. A source outside the skills root is copied under its declared frontmatter name, its router is rendered from the shipped template with one intent and a body-ordered resource map, the workflow agent's reshaped prose is accepted through a flag, and the original body is checked line by line before anything else is written. Resource documents get their frontmatter and their kebab names, the missing scaffold files arrive from a throwaway `init_skill.py` run, the two generators refresh the metadata, both format validators close the run, and the six integration rows run only after they pass.

The review of the shipped phase found eleven defects. A symlinked source file could be copied as a link and written through; a hash line inside a code fence was dropped as a heading; the link rewriter missed reference definitions, HTML attributes and inline-code paths, so a renamed document stayed reachable under its old name; the plain check pinned `/usr/bin/python3`; the preservation proof stripped link targets, matched reference lines against SKILL.md lines and ignored line kind or table padding. Each is fixed in the two scripts, covered by a case that failed before the fix, and the acceptance rows were re-pointed at the lines that now hold the evidence.

### Phase 4: convert-plain-skill

`plan` stays read-only: it refuses a target that exists, a hub candidate, a reserved name, a skill that does not classify as plain, a symlink anywhere in the source tree, fewer than eight approved phrases, and a description over 130 characters without a separate trim. `apply` repeats those refusals as pre-write checks, then runs V1 to V8 in order and stops at the first failure.

Both conversion paths accept `--description-trim <text>` (the approved trim, at most 130 characters) and `--allowed-tools <comma list>` (the operator's grant). With either flag the plan prints the field change as its own line and apply backs `SKILL.md` up before the first write, so the printed undo restores the original fields; without them the older refusals stay.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/sk-skill-convert.cjs` | Modified | V1 stage, V3(a) router render, V4 preservation check, V5 resource pass, V6 scaffold copy, V7 generators, V8 gates, and the `preserve` subcommand |
| `.skilled/commands/doctor/scripts/lib/sk-skill-convert-transforms.cjs` | Modified | Reference-link harvest, plain router render, resource frontmatter insert, kebab rename map with link rewrite in four forms, phrase proposal, frontmatter approvals, preservation line rules |
| `.skilled/commands/doctor/scripts/lib/sk-skill-integrate.cjs` | Read | The six integration rows the converter plans and applies after the format gate |
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
| Apply `--description-trim` and `--allowed-tools` inside the conversion rather than in the workflow | The workflow writes `SKILL.md` before any backup exists, so a field it rewrites cannot be undone. An approved value applied here lands after the backup and before the first write, which is what makes the printed undo restore the original fields. |
| Run the integration rows only after both format validators pass | A row wires a skill into reach; running it around a root the gates refuse would leave a changelog link and a compiled graph pointing at a skill that cannot be packaged. |
| Propose one `enhances` edge and refuse to write it unapproved | The scaffold writes an empty edges map, and the advisor graph counts a zero-edge skill as an orphan and refuses it, so the conversion was leaving a root row I2 could not compile. `enhances` is the one edge type the compiler's symmetry check does not require the other side to mirror, which is what lets one skill declare it alone. The advisor already ranks which skill answers a phrase, so the plan offers that name and the operator approves it; nothing is defaulted because an invented relationship between two skills is a claim the converter cannot support. |
| Build the edge context sentence from the skill's own description | The compiler requires a context string, and the only honest source for one is what the operator already approved as the description. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` on the converter, the transforms library and the test file | Exit 0 on all three |
| `node --test .skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` | Exit 0; 51 tests passed, 0 failed |
| `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` | Exit 0; 54 tests passed, 0 failed |
| `node --test .skilled/commands/doctor/scripts/tests/sk-skill-integrate.test.cjs` | Exit 0; 25 tests passed, 0 failed |
| Temporary-copy run: 7 approved phrases | Exit 1, `INTENT_SIGNALS_BELOW_FLOOR` |
| Temporary-copy run: 8 phrases, three approved tools and the reshaped body | Exit 0; V1 to V8 all passed; outside source hash unchanged |
| `package_skill.py --check --strict` on the converted fixture | Exit 0; `Result: PASS` |
| `ci-skill-root-metadata.cjs --skills-dir <temp> --skill brindle-lantern` | Exit 0; `OK [S] brindle-lantern`, `checked=1 passed=1` |
| `preserve --snapshot <backup>/before` on the converted fixture | Exit 0; `Preservation PASS: 7 original body line(s) found` |
| `preserve --snapshot <backup>/before <dropped-line skill>` | Exit 1; names `Read the field notes before choosing a review path` |
| Forced strict-gate failure | Exit 1, `STRICT_PACKAGE_FAILED`, and `validate_skill_package.py` never ran |
| Symlinked source tree | Exit 1, `SOURCE_SYMLINK`, and the outside file is byte-identical afterwards |
| Staged tree still naming an old resource path | Exit 1, `RESOURCE_LINK_STALE`, and no staged copy is left |
| Approved trim and approved tools on an older Skilled skill | Exit 0; each field change prints as its own plan line, the backup keeps the original text, and the undo `cp` restores it |
| Temp-repo convert, end state | `package_skill.py --check --strict` PASS, `ci-skill-root-metadata.cjs --skill` exit 0, `sync-skills-hermes.cjs --check` PASS, `skill-graph-freshness.cjs --strict` exit 0, `.skilled/changelog/brindle-lantern` resolves to `../skills/brindle-lantern/changelog` |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/075-doctor-sk-skill-command/004-convert-plain-skill --strict` | `RESULT: PASSED`; 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The prose reshape is an agent step.** The script renders the router, stages, checks and gates, but a workflow agent still writes the reshaped `SKILL.md`; `preserve` bounds it rather than performing it.
2. **A dropped line stops the run at V4.** The staged copy is removed and only the snapshot survives, so recovery means re-running the plan with a corrected body rather than resuming an interrupted conversion.
3. **The derived generator needs a repo root that contains the staged skill.** The `key_files` it verifies are repo-relative, so the tests stage under their own `.skilled/skills`. A conversion outside a repository root cannot run V7 truthfully.
4. **The integration rows live in their own library.** Advisor registration, changelog wiring and runtime mirrors are implemented and proven in phase 005; the converter plans and applies them from `lib/sk-skill-integrate.cjs` once the format gate passes.
<!-- /ANCHOR:limitations -->

---
