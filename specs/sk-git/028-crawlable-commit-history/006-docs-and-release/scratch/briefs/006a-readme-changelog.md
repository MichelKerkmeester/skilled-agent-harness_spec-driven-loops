GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-git/028-crawlable-commit-history/006-docs-and-release

Proceed directly to the work. Do not print A/B/C/D/E options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

# ROLE

You are the Markdown persona of this repository (`.claude/agents/markdown.md`): a template-first
documentation editor working under sk-doc. You edit only the files named here, keep each file's
existing structure, headings and anchors, write in plain active English with no em dashes, no
semicolons and no serial commas, and you run the named validators on every file you touch. You
are a leaf: never dispatch another agent or CLI. Do not commit.

# CONTEXT

sk-git shipped commit identity in this packet. What changed, with evidence you can open:
- Every commit ends with a contiguous trailer paragraph: `Spec: <track>/<packet>[/<phase>...]`
  when the work belongs to a spec packet, `Commit-Id: NNNNNNN` always, a seven-digit
  repository-wide ordinal. `Refs:` is now external links only. See `SKILL.md` section 6 and
  `assets/commit-message-template.md`.
- `.opencode/scripts/git-hooks/prepare-commit-msg` stamps both keys, keeps the id on amend,
  re-mints on cherry-pick, exits silently outside this repository. `commit-msg` whitelists the
  keys and refuses a malformed or duplicate id. Harnesses: `tests/commit-msg.test.sh` (9),
  `tests/prepare-commit-msg.test.sh` (43).
- `scripts/commit-id-naming.sh` mints ordinals under a lock with a history-derived high-water
  mark (`allocate`, `next`, `scan-max`, `validate`, `rebuild-highwater`); harness 35 cases.
- `scripts/stamp-branch.sh <branch> <base>` stamps a rebased branch's unique commits; harness
  24 cases.
- Queries: `git log -E --grep='^Spec: sk-git/028'`, `git log --fixed-strings --grep='Commit-Id: 0009113'`,
  `git log --format='%(trailers:key=Commit-Id,valueonly)'`. Catalog subsection "Commit Identity
  And Search" and playbook scenario GIT-044 exist.
- The existing history is retrofitted by a separate, operator-gated rewrite; the README does
  not promise it has happened.

Version: `SKILL.md` is 1.5.2.0. This release is 1.6.0.0. `README.md` carries a stale 1.4.1.0.
The latest changelog entry is `changelog/v1.5.2.0.md`; copy its shape exactly (the `## [**x**] - date`
heading, an opening paragraph, `## What Changed` with `####` groups and bold-led bullets,
`## Not Changed`, `## Migration Notes`).

Read before editing:
- `.opencode/skills/sk-git/README.md` in full
- `.opencode/skills/sk-git/changelog/v1.5.2.0.md` in full
- `.opencode/skills/sk-doc/sk-create-readme/assets/readme-template.md` sections 4 and 5 for the
  README shape it must keep
- `.opencode/skills/sk-doc/sk-create-changelog/SKILL.md` section 3

# ACTION

Edit or create exactly these files.

1. `.opencode/skills/sk-git/README.md`
   - frontmatter `version: 1.6.0.0`; add one trigger phrase `"commit id trailer"`.
   - Section 1 AT A GLANCE: one line on commit identity.
   - Section 4 HOW IT WORKS, subsection "Deterministic Commit Messages": add one paragraph on
     the trailer paragraph, the stamped ordinal, the amend and cherry-pick rules, and the three
     queries, each as a code span.
   - Section 5 "Skill Layout": add `scripts/commit-id-naming.sh`, `scripts/stamp-branch.sh` and
     their tests where the layout lists scripts.
   - Section 7 FAQ: one question, "How do I find the commits for a packet?", answered with the
     packet query.
   - Section 8 VERIFICATION: add the three new harness commands.
2. `.opencode/skills/sk-git/changelog/v1.6.0.0.md` (new), dated 2026-09-11, in the v1.5.2.0 shape.
3. `.opencode/skills/sk-git/SKILL.md`: frontmatter `version: 1.6.0.0`. Nothing else in that file.

# FORMAT

Return, in this order:
1. `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py` output for README.md,
   the new changelog file and SKILL.md.
2. `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-git --check` output.
3. `git diff --stat`.
4. One line: FILES_CHANGED: <paths>.
5. One line: UNKNOWNS: <anything you could not verify, or "none">.
