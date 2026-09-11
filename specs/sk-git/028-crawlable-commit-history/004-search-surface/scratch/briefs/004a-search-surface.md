GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-git/028-crawlable-commit-history/004-search-surface

Proceed directly to the work. Do not print A/B/C/D/E options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

# ROLE

You are the Markdown persona of this repository (`.claude/agents/markdown.md`): a template-first
documentation editor working under sk-doc create-feature-catalog and
create-manual-testing-playbook. You edit only the files named here, keep each file's existing
structure, headings and anchors, write in plain active English with no em dashes, no semicolons
and no serial commas, and you run the named validators. You are a leaf: never dispatch another
agent or CLI. Do not commit. Do not change any version field.

# CONTEXT

sk-git commits now end with a trailer paragraph: `Spec: <track>/<packet>[/<phase>...]` for
packet work and `Commit-Id: NNNNNNN`, a stamped seven-digit repository-wide ordinal. The
commit-msg hook whitelists both and refuses a malformed or duplicate id. The stamper is
`.opencode/scripts/git-hooks/prepare-commit-msg`, the allocator is
`.opencode/skills/sk-git/scripts/commit-id-naming.sh`. The queries that resolve a commit need no
new tooling, which is why no index is built:

- by packet: `git log -E --grep='^Spec: sk-git/028'`
- by identifier: `git log --fixed-strings --grep='Commit-Id: 0009113'`
- values: `git log --format='%h %(trailers:key=Commit-Id,valueonly)'`

Read before editing:
- `.opencode/skills/sk-git/feature-catalog/workflow-playbooks/conventional-commit-workflows.md`
  in full, the entry you extend, and `feature-catalog/feature-catalog.md` sections 1 and 4
- `.opencode/skills/sk-git/manual-testing-playbook/commit-formation/conventional-commit-from-diff.md`
  in full, the scenario shape you copy, and the index rows near line 840 of
  `manual-testing-playbook/manual-testing-playbook.md`
- `.opencode/skills/sk-git/references/quick-reference.md`, the "Find commits" subsection

# ACTION

Edit or create exactly these files.

1. `feature-catalog/workflow-playbooks/conventional-commit-workflows.md`: in section 2 add a
   subsection "Commit Identity And Search" after "Message Contract" describing the trailer
   paragraph, the stamped ordinal, the amend and cherry-pick rules and the three queries. In
   section 3 add rows for the stamper, the allocator and their harnesses under Implementation and
   Validation And Tests, and a row for the new playbook scenario.
2. `feature-catalog/feature-catalog.md`: in the workflow-playbooks section, add two sentences to
   the conventional-commit entry's Current Reality paragraph naming the trailer paragraph and the
   identifier queries.
3. `manual-testing-playbook/commit-formation/find-commits-by-packet-and-id.md` (new): scenario
   `GIT-044 -- Find commits by packet and identifier`, same shape as GIT-004. Objective: verify
   the three queries resolve a commit after a stamped commit exists. Command sequence: make an
   empty commit with `SPECKIT_COMMIT_SPEC` set, read its trailers with the values query, run the
   packet query and the identifier query, expect the commit's hash in each. Pass if all three
   return it. Include Failure Triage pointing at SKILL.md section 6 and the two hooks.
4. `manual-testing-playbook/manual-testing-playbook.md`: add the GIT-044 index row beside the
   other Commit Formation rows, and add the scenario wherever the root page lists commit-formation
   scenarios in prose.

# FORMAT

Return, in this order:
1. `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py` output for each of the
   four files, with `--type reference` for the root playbook page.
2. `python3 .opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --help | head -5`, then its run for sk-git if a per-package invocation exists.
3. `node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --help | head -5`, then its run for sk-git if a per-package invocation exists.
4. `git diff --stat`.
5. One line: FILES_CHANGED: <paths>.
6. One line: UNKNOWNS: <anything you could not verify, or "none">.
