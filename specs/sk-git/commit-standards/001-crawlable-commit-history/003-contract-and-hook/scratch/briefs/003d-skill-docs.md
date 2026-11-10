GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-git/028-crawlable-commit-history/003-contract-and-hook

Proceed directly to the work. Do not print A/B/C/D/E options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

# ROLE

You are the Markdown persona of this repository (`.claude/agents/markdown.md`): a template-first
documentation editor working under sk-doc create-skill. You edit only the files named here, keep
each file's existing structure, headings and anchors, write in plain active English with no em
dashes, no semicolons and no serial commas, and you run the named validator on every file you
touch. You are a leaf: never dispatch another agent or CLI. Do not commit. Do not change any
version field or changelog, a later phase owns those.

# CONTEXT

The sk-git commit contract gained two machine trailers, approved in
`specs/sk-git/028-crawlable-commit-history/002-format-decision/decision-record.md` (read ADR-001
to ADR-003 first). In short:

- Every commit ends with one contiguous trailer paragraph, separated from prose by a blank line.
- `Spec: <track>/<packet>[/<phase>...]` carries the packet path relative to `specs/`, nested
  phases included, and is omitted when the commit is not packet work.
- `Commit-Id: NNNNNNN` is a seven-digit zero-padded repository-wide ordinal, minted by
  `scripts/commit-id-naming.sh allocate` and stamped by the `prepare-commit-msg` hook. Never
  hand-write one. An amend keeps its id. A cherry-pick gets a fresh one.
- `Refs:` now carries external links only: issues, pull requests, URLs. Spec paths move to `Spec:`.
- The commit-msg hook whitelists `Spec:` and `Commit-Id:` as trailers and refuses a malformed or
  duplicate id. The subject grammar is unchanged.
- Queries: by packet `git log -E --grep='^Spec: sk-git/028'`, by id
  `git log --fixed-strings --grep='Commit-Id: 0009113'`, values via
  `git log --format='%(trailers:key=Commit-Id,valueonly)'`.

Read before editing:
- `.opencode/skills/sk-git/SKILL.md` lines 352-519: ALWAYS rule 5, the Commit Message Logic
  section 6 body contract at 463-490, and NEVER rule 9 and 10
- `.opencode/skills/sk-git/assets/commit-message-template.md` in full
- `.opencode/skills/sk-git/references/commit-workflows.md` lines 160-215, Step 5
- `.opencode/skills/sk-git/references/quick-reference.md` lines 100-112 and 345-352

# ACTION

Edit exactly these four files. Keep every heading and anchor. Add, do not rewrite.

1. `.opencode/skills/sk-git/SKILL.md`
   - ALWAYS rule 5: replace its text so it says the packet path goes in a `Spec:` trailer,
     names the shape, and says `Refs:` is for external links.
   - Section 6 Body Contract: update the preferred structure block to end with the trailer
     paragraph (`Spec:`, `Commit-Id:`, `Refs:` when present), add the placement law in one
     sentence, and add three sentences: the ordinal is stamped by the hook and never typed by
     hand, an amend keeps it, a cherry-pick re-mints it.
   - Section 7 Deterministic Self-Check: add the trailer paragraph to the list of things verified.
   - NEVER rules: add rule 11, never hand-write or edit a `Commit-Id:` value.
2. `.opencode/skills/sk-git/assets/commit-message-template.md`: update the canonical contract
   section and the body template to show the trailer paragraph, update the three examples so
   each ends with `Spec:` and `Commit-Id:` lines (use ids 0009021, 0009022, 0009023 and the
   packet paths the examples already imply, or omit `Spec:` where the example is not packet
   work), and add two self-check lines: the trailer paragraph is last and contiguous, and the
   `Commit-Id:` was stamped, not typed.
3. `.opencode/skills/sk-git/references/commit-workflows.md` Step 5: extend the quick summary
   with the trailer paragraph and one sentence on `SPECKIT_COMMIT_SPEC` (the environment
   variable the stamper reads to add `Spec:`).
4. `.opencode/skills/sk-git/references/quick-reference.md`: in the commit command block add
   one example that exports `SPECKIT_COMMIT_SPEC` before `git commit`, and add three query
   lines under a new short subsection "Find commits" using the queries above.

# FORMAT

Return, in this order:
1. For each file, the output of
   `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <file>`.
2. The output of `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-git --check`.
3. `git diff --stat`.
4. One line: FILES_CHANGED: <the four paths>.
5. One line: UNKNOWNS: <anything you could not verify, or "none">.
