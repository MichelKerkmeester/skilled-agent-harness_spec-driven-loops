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

Two rule surfaces need one addition each, decided in
`specs/sk-git/028-crawlable-commit-history/002-format-decision/decision-record.md` ADR-005 (read
it first). No new rule file is created.

The gap: `repo-rules/delegation-and-orchestration.md` section 2 binds the delegate's write
authority and says nothing about the orchestrator's own writes while a fan-out lineage runs. In
this packet the orchestrator edited planning documents while a lineage was live; the runner's
write containment attributed those edits to the lineage, reverted them and marked the run
failed after it had completed every iteration. The research artifacts survived. The rule must
say: while a lineage runs, the repository is frozen for the orchestrator as well.

The second surface: the `AGENTS.md` section 5 "Git Workspace Safety" table has rows for branch
naming, allocation and pushes, and none for commit identity, which sk-git now owns.

Read before editing:
- `.opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md` section "Revise" and
  `references/agents-md-integration.md` section 4 for the revise ordering and the version
  convention
- `repo-rules/delegation-and-orchestration.md` in full
- `AGENTS.md` lines 330 to 350, the Git Workspace Safety table. `CLAUDE.md` is a symlink to
  `AGENTS.md`, edit only `AGENTS.md`.

# ACTION

Edit exactly these two files.

1. `repo-rules/delegation-and-orchestration.md`: in section 2 "BEFORE YOU DISPATCH", after item 2
   "Bind the write authority", add one short paragraph, not a new numbered item, that states the
   freeze: while a fan-out lineage runs, the orchestrator changes nothing in the repository
   outside that lineage's directory until the run settles, because the runner attributes every
   out-of-lineage change to the lineage, reverts it and fails the run. Name the mechanism, not a
   file line. Bump `version` in the frontmatter per the convention you read. Do not change the
   trigger row in `REPO RULES.md`: when the rule fires is unchanged.
2. `AGENTS.md`: add one row to the Git Workspace Safety table, after "No direct branch creation":
   bold name `Commit identity`, requirement: every commit ends with a trailer paragraph carrying
   `Spec:` for packet work and a stamped seven-digit `Commit-Id:`; the commit-msg hook enforces it
   and refuses a hand-written or duplicate id; sk-git owns the grammar, the allocator and the
   stamper. Two sentences at most, in the register of the rows around it.

# FORMAT

Return, in this order:
1. `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py repo-rules/delegation-and-orchestration.md` output.
2. `git diff` for both files, in full.
3. One line: FILES_CHANGED: <paths>.
4. One line: UNKNOWNS: <anything you could not verify, or "none">.
