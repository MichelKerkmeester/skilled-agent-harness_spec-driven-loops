---
title: "Implementation Plan: Phase 12: alignment-remediation"
description: "Close the alignment run's 34 findings group by group, each one from its own reproducing command, and rerun the nine battery rows that failed."
trigger_phrases:
  - "alignment remediation plan"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 12: alignment-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs, JSON routing files, Node and Python checkers, GitHub Actions workflows |
| **Framework** | Skill hub routing through the advisor and the hub registries, checked by the spec-kit validator |
| **Storage** | None |
| **Testing** | The battery rows named in `spec.md` §2, `validate.sh --strict`, `validate_skill_package.py`, and the two README checkers |

### Overview
Fifteen groups of fixes, one group per requirement in `spec.md` §4. Each group starts by running the command that found it, edits only the files in its row of the Files to Change table, and reruns the same command. The phase closes when the nine failing battery rows pass and the parent packet validates with `--recursive --strict`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (`spec.md` §2 and §3)
- [ ] Success criteria measurable (`spec.md` §5)
- [ ] Dependencies identified and available: the alignment run artifacts, and phase 011's regenerated mirrors

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The nine failing battery rows pass, with each command's output and exit status recorded in `scratch/after.md`
- [ ] `validate.sh --recursive --strict` prints `RESULT: PASSED` for the parent folder
- [ ] Docs updated (spec, plan, tasks, acceptance criteria, implementation summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reproduce, fix at the producer, rerun the same command.

### Key Components
- **Producers**: the checkers and generators that report. `sync-runtime-mirrors.cjs` derives the expected mirror set, the two README checkers read claims and links, and `generate-leaf-manifest.cjs` reads the authored leaf scopes.
- **Consumers**: the CI workflows that run those commands, and the skill docs that describe them. A consumer takes the producer's verdict, so a consumer is edited after the producer is right.
- **Proof rows**: the battery rows named in `spec.md` §2. Each row is one command with one exit status, and the row is the only evidence that counts for it.

### Data Flow
A row runs a command. The command reads the tree and prints a verdict. The fix goes into the file that made the verdict wrong, which is the producer, never the row and never the document that quotes the row. Then the same command runs again.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet fixes reported findings, so every surface each finding reaches is named here with what happens to it.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sync-runtime-mirrors.cjs` | Derives the expected OpenCode command mirror from the top-level entries of `.skilled/commands` | Update: skip every path the tree ignores | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` exits 0 |
| `validate-command-tree-parity.sh` | Shells out to the same check, so it reports the same drift | Not a producer, a consumer | `bash .skilled/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh` exits 0 |
| `spec-kit-check.yml`, `command-tree-parity.yml` | Run those two commands in CI | Unchanged | Both jobs run the fixed command |
| `check_readme_references.py` | Resolves every backticked path a README mentions | Update: a bracketed filename template is a template, not a path | Both rows pass on `cli-classifier` and `sk-design-chart` |
| `check_derived_readme_counts.py` | Reads a number plus a plural noun as a count claim | Update: an adjective or a compound noun is not a count noun | Both rows pass on the six READMEs the row names |
| `generate-leaf-manifest.cjs` | Reads the authored `leaf-scopes.json` for a standalone root | Not a producer here, unchanged | `validate_skill_package.py` exits 0 on `.skilled/skills/system-skill-advisor` |
| `system-skill-advisor/SKILL.md` | States the leaf inventory that file describes | Update: five roots | The sentence names all five, checked against `leaf-manifest.config.json` |
| `cli-orca/SKILL.md` | Holds the routing claim the probe contradicted | Update: state what the signal does, and give both phrasings a signal | `advisor_recommend` returns `cli-orca` as top-1 for both phrasings |
| `.github/workflows/*.yml` triggers | Name the paths that fire each workflow | Update: one entry per path | `rg -c "'\.opencode/plugins" .github/workflows/opencode-dual-version.yml` counts one per block |
| `.skilled/agents/prompt-improver.md` | Cites the command path an agent acts on | Update: the path that exists | `ls .skilled/commands/prompt/improve.md` lists it, and `rg -c 'prompt-improve\.md' .skilled/agents/prompt-improver.md` reads 0 |

Required inventories:
- Same-class producers: `rg -n "per-session worktree wrapper" .skilled/skills/cli-external-orchestration` lists every cli skill that carries the gated preamble sentence, and each one takes the edit.
- Consumers of the changed symbols: `rg -n "listCommandRootEntries|OPENCODE_COMMANDS|EXCLUDED_COMMAND_DIRS" .skilled/skills/system-spec-kit/runtime` lists the mirror derivation and its tests.
- Matrix axes: for the mirror, the axes are entry kind (command file, shared folder, dot-prefixed name, `local-*` name) by ignore state (tracked, gitignored). For the README checkers, the axes are token kind (link, filename template, external output path, runtime-generated path) by resolution (exists, absent, allowlisted).
- Algorithm invariant: the expected mirror set equals the top-level entries of `.skilled/commands` that the tree tracks, minus dot-prefixed names, minus `local-*` names, minus every path the ignore rules cover. Adversarial cases to hold: a gitignored shared folder, a tracked command file, a `local-*` name, and a dot-prefixed folder. The check stays red for the tracked file and green for the other three.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` holds the ordered work and its checkboxes. Setup records the starting state of every failing row. Implementation carries one task per requirement. Verification reruns the rows, walks the findings and validates the packet.

The order inside Implementation is fixed by two rules. A producer is fixed before the consumer that quotes it, so a checker is corrected before a README it flags. And a row that walks all 55 READMEs runs after the checker rules settle, so one pass measures the settled rules.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The changed checkers and the tests this phase adds | `node --test` on the named file, and `pytest` on the named file |
| Integration | The nine battery rows and the two README rows over all 55 files | The commands those rows run, rerun from `scratch/before.md` |
| Manual | Each changed document, read against the check it answers | Read the file, then run its check |

The two README rows walk a fixed 55-file list. The table below records what each failing file is reported for, read from both checkers' own output on 2026-10-28, and the disposition it takes. A disposition of **fix** means the README's claim or link is wrong and the document changes. A disposition of **rule** means the checker misread the token and the checker changes instead. Every **rule** row is a case REQ-005 has to cover, and every **fix** row is a document edit REQ-015 has to justify.

| README | Row | What the row reports | Disposition |
|--------|-----|----------------------|-------------|
| `.skilled/skills/cli-classifier/README.md` | references | `v[version].md`, a filename template | rule: a template is not a path |
| `.skilled/skills/sk-design/sk-design-chart/README.md` | references | `v[version].md`, the same template | rule: the same case |
| `.skilled/skills/sk-doc/sk-create-benchmark/README.md` | references | `benchmark-report.md`, `benchmark-YYYY-MM-DD/`, `benchmark/README.md` and `mcp-server/benchmarks/`, all output a run writes | rule: an output path is not a shipped path |
| `.skilled/skills/sk-doc/sk-create-feature-catalog/README.md` | references | `feature-catalog/feature-catalog.md`, the package the mode generates | rule: a generated package path |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/README.md` | references, counts | `checklist.md` three times, and "two different tests" | rule: a generated package path and a prose count |
| `.skilled/skills/sk-doc/sk-create-diff/README.md` | references, counts | `.sk-create-diff/`, "two explicit files" and "a bundle of multiple files" | rule: the tool's own output folder and two prose counts |
| `.skilled/system-deep-loop/deep-ai-council/README.md` | references | `seats/round-NNN/` and `failed/`, both runtime output | rule: a runtime output path |
| `.skilled/skills/sk-doc/sk-create-repo-rule/README.md` | counts | "four decision tests" and "five reader tests", the skill's own terms | rule: a domain plural is not a file count |
| `.skilled/skills/sk-doc/sk-create-agent/README.md` | counts | "Author two files, one per runtime directory", advice about a tree that is not there yet | rule: an instruction is not a folder count |
| `.skilled/skills/mcp-tooling/mcp-chrome-devtools/README.md` | counts | "All three scripts" and "three example scripts", both true today (`scripts/` holds three and `examples/` holds three) | rule: the checker cannot map a count noun to the folder it counts |
| `.skilled/logs/README.md` | counts | "6 log files on disk", a count of runtime output the folder does not hold | rule: runtime output is not a folder listing |
| `.opencode/plugins/README.md` | counts | "Two plugins reject by default" and "Several plugins are mirrored there" | rule: a count of behaviours, and one with no number |
| `.opencode/plugins/tests/helpers/README.md` | counts | "all four suites" | rule: a count of suites |
| `.opencode/plugins/tests/README.md` | references, counts | `.test.cjs` twice as a pattern, `hooks/goal/lib/goal-core.cjs` and `plugins/README.md` as paths that do not resolve from this folder, and "9 files" which is true today | fix the two paths, rule the two patterns and the count |
| `.skilled/skills/cli-external-orchestration/cli-hermes/README.md` | references | two unresolved paths | fix |
| `.skilled/skills/mcp-tooling/mcp-figma/README.md` | references | two unresolved paths | fix |
| `.skilled/skills/mcp-tooling/mcp-obsidian/README.md` | references | two unresolved paths | fix |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The alignment run artifacts | External | Green | No reproducing command, so no finding can be confirmed fixed |
| Phase 011's regenerated mirrors | Internal | Green | Both P0 rows keep failing for a second reason |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Internal | Green | The packet cannot be verified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fixed row gets worse than its recorded start state, and the cause is not found inside the same group.
- **Procedure**: revert that group's commits. Each group is one commit that touches only its own files, so a revert returns its rows to the state in `scratch/before.md` and leaves the other groups standing.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
011-regeneration-and-verification ──► 012-alignment-remediation ──► None
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 012-alignment-remediation | 011-regeneration-and-verification | None |
<!-- /ANCHOR:phase-deps -->
