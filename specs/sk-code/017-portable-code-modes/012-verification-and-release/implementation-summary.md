---
title: "Implementation Summary"
description: "Six shipped playbook scenarios now pass from one worktree with their deviations written down, this repository has its own quality config at the skill-folder path, and the framework and skill changelogs carry the settings move. The packet also says what was not done: no GitHub release was published."
trigger_phrases:
  - "verification and release implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/012-verification-and-release"
    last_updated_at: "2026-10-28T09:10:00Z"
    last_updated_by: "implementer"
    recent_action: "Recorded the six runs and the release records"
    next_safe_action: "Conductor reviews and commits the packet; the operator decides on the v4.0.0.17 release"
    blockers: []
    key_files:
      - "scratch/e2e/CQ-012.md"
      - "scratch/e2e/CQ-013.md"
      - "scratch/e2e/CR-029.md"
      - "scratch/e2e/CR-030.md"
      - "scratch/e2e/CR-031.md"
      - "scratch/e2e/ci-foreign-repository-profile.md"
      - "scratch/in-repo.txt"
      - ".skilled/skills/sk-code/sk-code-quality/repository/quality.json"
      - ".skilled/changelog/skilled/v4.0.0.17.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "verification-and-release-implementer"
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
| **Spec Folder** | 012-verification-and-release |
| **Status** | Complete |
| **Completed** | 2026-10-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The three modes had shipped their playbook scenarios and nobody had run them end to end, so a scenario could break behind a change the docs described and still read as correct. Six of them now pass from one worktree with every command, output and deviation on record, this repository has its own quality config, and the release notes say what shipped.

### Phase 12: verification-and-release

Each recorded file is the run, not a summary of it: the fixture build, every command, the verbatim output, the exit codes and the pass criteria, in the order the playbook gives them. Two quality-gate scenarios prove that a repository can switch a hygiene rule off and that a floor rule stays refused. Three review scenarios prove that a live reviewer records both overrides, raises an undocumented function at P2 with the repository's own replacement text, and keeps a path traversal at P0 even when the repository's checklist asks to drop input validation. The CI scenario proves that a repository without a profile gets the defaults, that the scaffold writes nothing repository-specific, and that the gate, master and unknown switches are refused.

The release half writes `.skilled/skills/sk-code/sk-code-quality/repository/quality.json`: this repository's name, one optional `actionlint` check for workflow files, and no hygiene rule disabled. The quality doctor reads it as `SOURCE="repo" TRUST=trusted` with no error, and the 21 hygiene rules stay on. `.skilled/changelog/skilled/v4.0.0.17.md` describes the settings move; `v4.0.0.16.md` was restored to the wording its tag published, because that release shipped before the move. sk-code 3.9.18.0, sk-code-ci 1.1.9.0 and sk-code-quality 1.13.11.0 each get a changelog entry, and every carrier that names the sk-code version moved with them.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/e2e/CQ-012.md` | Created | The disabled-hygiene-rules scenario, with its override and its one-finding control run |
| `scratch/e2e/CQ-013.md` | Created | The floor-override-refused scenario, through the linter, the resolver and both gate runs |
| `scratch/e2e/CR-029.md` | Created | The almost-no-inline-comments review, with both overrides in the `Rule sources:` line |
| `scratch/e2e/CR-030.md` | Created | The comment-every-function review, with one P2 finding quoting the replacement text |
| `scratch/e2e/CR-031.md` | Created | The floor-override-refused review, with the traversal at P0 and the first failed attempt recorded |
| `scratch/e2e/ci-foreign-repository-profile.md` | Created | The foreign-repository CI scenario, from the default profile through the refused switches |
| `scratch/in-repo.txt` | Created | The in-repository checks and their exit codes |
| `.skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/foreign-repository/foreign-repository-profile.md` | Modified | Copies `repository-identity.cjs` into the fixture, so the copied profile loads |
| `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` | Created | This repository's quality config |
| `.skilled/changelog/skilled/v4.0.0.17.md` | Created | Framework release notes for the settings move |
| `.skilled/changelog/skilled/v4.0.0.16.md` | Modified | Restored the wording the tagged release published |
| `.skilled/skills/sk-code/changelog/v3.9.18.0.md`, `sk-code-ci/changelog/v1.1.9.0.md`, `sk-code-quality/changelog/v1.13.11.0.md` | Created | The three skill releases |
| `.skilled/skills/sk-code/SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json` and the `.hermes/skills/sk-code/SKILL.md` copy | Modified | Step the sk-code version to 3.9.18.0 |
| `.skilled/skills/sk-code/sk-code-ci/SKILL.md` and `.hermes/skills/sk-code-ci/SKILL.md` | Modified | Step sk-code-ci to 1.1.9.0 |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` and `.hermes/skills/sk-code-quality/SKILL.md` | Modified | Step sk-code-quality to 1.13.11.0 |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its `specs/sk-doc/z_archive/` twin | Modified | Re-mint the compiled route from the new carrier |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modified | Refresh the graph for the stepped carriers |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The six scenarios were read first, then each was run from the worktree with its fixture at a fixed path under `.scratch-dc90/fixtures/` instead of `mktemp -d`. The two quality-gate runs and the CI run are shell only; the three review runs drove `devin 3000.11.228` with `deepseek-v4-1-flash-max` in print mode, because the playbook's `@review` agent step needs a live model. Each fixture outside the worktree could not see the repository's `sk-code` skill, so `$SCRATCH/.devin/skills/sk-code` was symlinked to the installed hub; the first unscaffolded CR-031 run produced prose with no `Rule sources:` line and neither report checker could consume it, so that attempt is recorded and the rerun with the symlink is the one that passed. Every file states its deviations at the top rather than burying them.

The release half followed: the quality config, then the framework changelog with `v4.0.0.16` restored to its tagged wording, then the three skill changelogs and their carriers, then the compiled route re-mint. The setup battery failed three legs against the stale sk-code manifest after the version step and read `STATUS=OK legs=9` once the route was re-minted, which is why the re-mint is part of this phase rather than a later cleanup. The in-repository checks ran last and are recorded line by line in `scratch/in-repo.txt`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The three review scenarios ran through `devin` rather than the `@review` agent step | The playbook's step needs a live reviewer, and the dispatch contract for this program runs it through the executor; the file names the model and the flag so a reader can judge the report |
| The fixtures use a fixed path instead of `mktemp -d` | This machine's cleaner deletes the system temporary folders, so a fixture there can vanish mid-run; the fixed path keeps a rerun reproducible, and each file records the substitution |
| The executor got a `.devin/skills/sk-code` symlink | A fixture outside the worktree does not see the repository's skills, and without one the review came back as prose that neither checker accepts; the symlink changes the executor's view, not the files under test |
| The `v4.0.0.16` notes were restored instead of rewritten | That release was already tagged and published, so its notes have to keep describing what it actually shipped; the move belongs in `v4.0.0.17`, which had not shipped |
| This repository's quality config adds one optional check and disables no rule | The config exists to prove the loader reads a repository's own file, not to loosen this repository's gate; `actionlint` is optional, so a machine without it still passes |
| No GitHub release was published for `v4.0.0.17` | A release is a public act with its own timing, so the operator decides it; the changelog and the carriers are ready and the packet says the release is still open |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg -c 'VERDICT: PASS' scratch/e2e/*.md` | one hit in each of the six files, exit 0 |
| `scratch/e2e/CQ-012.md` | `VERDICT: PASS`; with the key the gate exits 0 and reports `disabled hygiene.issue`; without it, exit 1 with `hygiene.issue@src/total.js:1` |
| `scratch/e2e/CQ-013.md` | `VERDICT: PASS`; the linter exits 1 naming the floor rule at line 9, the resolver refuses the checklist, both gate runs exit 3 with `CONFIG_INVALID` |
| `scratch/e2e/CR-029.md` | `VERDICT: PASS`; the `Overrides:` group carries `hygiene.issue none` and `floor.documentation none`, no findings, both checkers exit 0 |
| `scratch/e2e/CR-030.md` | `VERDICT: PASS`; one P2 finding names `total` and `average`, the status is `COMMENTED`, both checkers exit 0 |
| `scratch/e2e/CR-031.md` | `VERDICT: PASS`; linter exit 1, checklist refused with 0 rows, the traversal at P0, `Review status: REQUESTED_CHANGES` |
| `scratch/e2e/ci-foreign-repository-profile.md` | `VERDICT: PASS`; default profile, zero repository-specific scaffold lines, gate, master and unknown switches refused, stub logged zero writes |
| `sk-code-quality-config.cjs status` | `Config: .skilled/skills/sk-code/sk-code-quality/repository/quality.json (repo, 748 bytes)`, `Trust: trusted`, `Errors: none`, `STATUS=OK SOURCE="repo" TRUST=trusted`, exit 0 |
| `ci-report.cjs --no-gh --json` | `"source": "repo"`, `"path": ".skilled/skills/sk-code/sk-code-ci/repository/ci.json"`, `"workflowCount": 32`, `"errors": []` |
| `compiled-route-guard.cjs --json` | `"failures": 0`, exit 0 |
| `compiled-route-sync.cjs --check` | `all 55 served copies match their authored files`, exit 0 |
| `scratch/in-repo.txt` | setup battery `STATUS=OK legs=9`, quality config trusted, skill graph fresh, 67 Hermes copies in sync, routing capture equal to the baseline, every check exit 0 |
| `validate.sh specs/sk-code/017-portable-code-modes/012-verification-and-release --strict` | `RESULT: PASSED`, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No GitHub release was published for `v4.0.0.17`.** The changelog and the version carriers are ready; announcing a tag is the operator's decision, and this phase stops before it.
2. **The operator-local web surface's checklist rows are not in this repository.** Its rows are outside this checkout, so they are neither proved nor changed here.
3. **The three review runs are one model's output.** `devin 3000.11.228` with `deepseek-v4-1-flash-max` produced them, and each file names the model; a different reviewer may word the same findings differently.
4. **The review runs needed executor scaffolding.** The `.devin/skills/sk-code` symlink is what let the fixture's review see the skill, so a rerun without it reproduces the first failed attempt rather than the recorded pass.
5. **The fixtures sit at a fixed path, not a temporary one.** A rerun reuses `/Users/michelkerkmeester/worktrees/public/.scratch-dc90/fixtures/<name>`, and CR-031 deletes its fixture first because a stale tree would otherwise leak into the run.
<!-- /ANCHOR:limitations -->

---
