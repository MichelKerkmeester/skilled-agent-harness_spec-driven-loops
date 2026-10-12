---
title: "Goal: Per-doc versions"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "per doc versions goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/001-per-doc-versions"
    last_updated_at: "2026-10-12T06:00:00Z"
    last_updated_by: "builder"
    recent_action: "Built the phase, ran the deep review, fixed its findings and recorded the D1 amendment"
    next_safe_action: "Merge the branch, then run the bump over the docs phase 002 changed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-022-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Per-doc versions

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every skill doc carry its own 4-part version again, raised automatically whenever its content changes, and restore the version lines removed in 31888d05bb.

### Decisions

Frozen choices, by operator decision of 2026-10-12. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every Markdown doc under `.skilled/skills/**` with a frontmatter block carries a 4-part `version:`. Out: changelog entries, which keep their release version, and docs with no frontmatter block (style corpus, benchmark output, runtime and test fixtures, 21 hand-authored docs listed in `spec.md`). |
| D2 | `SKILL.md`'s version is the skill edition and equals the newest changelog entry. A child doc's version is that doc's own edition: a new doc starts at 1.0.0.0 and any content change raises it. The builder picks the smallest bump rule and documents it in `frontmatter-versioning.md`. |
| D3 | The pre-commit hook raises the version of a staged doc whose body changed and whose version did not go up, and re-stages it, with a named bypass variable. A pull-request check fails on a changed doc whose version did not go up and names the one command that fixes it. `frontmatter-version.mjs verify` checks every in-scope doc has a valid version. |
| D4 | The lines removed in 31888d05bb come back with their prior values on every file that still exists and lacks one. A doc that never had a version gets 1.0.0.0. |
| D5 | Every sk-doc doc template seeds `version: 1.0.0.0`. |
| D6 | sk-doc gets one bump and changelog entry. The restore and the per-doc raises are sk-doc housekeeping and bump no other skill. A skill whose shipped behavior changes is bumped once. |
| D7 | Changed behavior gets a test that fails before and passes after: hook auto-bump, pull-request check, `verify` on a doc with no version, template seeding. |
| D8 | Every ledger row ends Fixed with a backticked command proof or Closed with a reason that prevent-overengineering or an operator decision backs. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `grep -cE '^\| PV-R[0-9]+ \| (Fixed|Closed) \|' specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/001-per-doc-versions/implementation-summary.md`, run from the repository root, prints 8.
- [x] `grep -E '^\| PV-R[0-9]+ \| Fixed \|' specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/001-per-doc-versions/implementation-summary.md | grep -vcF "$(printf '\140')"` prints 0, and `grep -E '^\| PV-R[0-9]+ \| Closed \|' specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/001-per-doc-versions/implementation-summary.md | grep -vcE 'prevent-overengineering|operator decision'` prints 0, both run from the repository root.
- [x] `F=specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/001-per-doc-versions/implementation-summary.md; [ "$(grep -cE '^\| T[0-9]+ \| .+ \| before: exit [1-9][0-9]* \| after: exit 0 \|$' $F)" = "$(grep -cE '^\| T[0-9]+ \|' $F)" ] && grep -qE '^\| T4 \|' $F && echo ok`, run from the repository root, prints ok.
- [x] `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs verify` exits 0, and `git show --format= --name-only 31888d05bb | while read f; do [ -f "$f" ] && ! grep -qE '^version: "?[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+"?$' "$f" && echo "$f"; done` prints nothing, both run from the repository root.
- [x] `G='^Spec: sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/001-per-doc-versions$'; [ "$(git log --no-merges --format= --name-only --diff-filter=A --grep="$G" -- .skilled/skills/sk-doc/changelog | grep -c .)" = 1 ] && git log --no-merges --format= -p --grep="$G" -- .skilled/skills/sk-doc/SKILL.md | grep -q '^+version:' && [ -z "$(git log --no-merges --format= --name-only --diff-filter=A --grep="$G" -- .skilled/skills | grep '/changelog/' | cut -d/ -f3 | sort | uniq -d)" ] && echo ok`, run from the repository root, prints ok.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/001-per-doc-versions --strict`, run from the repository root, prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Packet scaffolded | Done | create.sh phase mode with `--level 2` and `--with-goal`; spec.md lists every ledger row |
| Build | Done | Worktree `.worktrees/119-docver-per-doc`, branch `worktrees/119-docver-per-doc`; ledger and Tests table in `implementation-summary.md` |
| Deep review | Done | `/deep:review :auto`, 5 iterations, cli-pi DeepSeek V4.1 Flash max; artifacts under `review/` |

### Amendments

| Decision | Amendment | Operator decision behind it |
|----------|-----------|-----------------------------|
| D1 | The 21 hand-authored docs with no frontmatter block are in scope. Each gained the minimal frontmatter its class needs plus `version: 1.0.0.0`. The build found a 22nd, `system-spec-kit/runtime/cli/references/spec-root-alias-retirement-runbook.md`, and treated it the same way. Generated corpora (style corpus, benchmark output, runtime and test fixtures) stay out | Orchestrator ruling relaying the operator, 2026-10-12: "The 21 hand-authored docs with no frontmatter are IN scope" |

### Deviations and findings

| Item | Note |
|------|------|
| Reverses part of 021/003 | 021/003 decision D1 kept `version` on `SKILL.md` only. The operator reversed it for child docs on 2026-10-12; this phase carries that decision as D1 to D4. 021/003's catalog and citation checks and its SKILL.md edition check stay |
| Count of docs with a version today | The operator brief names 61. `git grep -l '^version:'` lists 81 at the scaffold commit, because 20 sk-doc templates and references carry a `version:` line in their body; 61 carry it in frontmatter |
| PV-R7 out-of-scope docs | 16 of the 61 now sit outside the scope rule and keep their values unchecked: 14 benchmark READMEs and reports (cli-classifier, cli-jev, cli-orca, mcp-tooling, sk-design, sk-vision), the sk-doc test fixture `clean-package/manual-testing-playbook.md` and `system-spec-kit/runtime/cli/spec/README-repair-derived.md` |
| Hub READMEs in the restore commit | sk-code and mcp-tooling hub READMEs took their SKILL.md versions (2.2.12.0, 1.8.2.0) so parent-skill doctor 13c would pass; the restore alone would have left them on older values |
| Global hook runs main's copy | `~/.config/git/hooks/pre-commit` links to the main checkout, so the new gate did not run on this branch's commits. Each doc commit ran `frontmatter-version.mjs bump` by hand and staged what it printed |
| Playbook validator | 021/003 stopped the playbook validator from requiring a version on a scenario. That stays: `frontmatter-version.mjs verify` now covers it |
| `*-fixture` folders | Not added to the scope rule: no doc with frontmatter sits in one today |
| Review executor model | The review config names `deepseek-v4.1-flash`, which the cli-pi allowlist resolves to `llmgateway/deepseek-v4.1-flash`; the full `llmgateway/` form is refused by the allowlist |
<!-- /ANCHOR:log -->
