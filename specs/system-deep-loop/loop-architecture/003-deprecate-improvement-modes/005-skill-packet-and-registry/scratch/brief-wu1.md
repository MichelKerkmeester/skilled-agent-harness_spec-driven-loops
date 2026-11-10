GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-deep-loop/039-deprecate-improvement-modes/005-skill-packet-and-registry
It lives in the main checkout; you do not write to it. You write only in the current directory, which is a git worktree.

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

ROLE: You delete one retired skill packet and keep its changelog history. Nothing else.

The deep-loop modes `agent-improvement` and `model-benchmark` are being removed. Their packet `.skilled/skills/system-deep-loop/deep-improvement/` goes, but its changelog must survive.

STEP 1. Keep the changelog. `.skilled/changelog/system-deep-loop/deep-improvement` is a symlink into the packet. Replace it with the real folder:
  git rm -q .skilled/changelog/system-deep-loop/deep-improvement
  git mv .skilled/skills/system-deep-loop/deep-improvement/changelog .skilled/changelog/system-deep-loop/deep-improvement
STEP 2. Delete the packet: git rm -r -q .skilled/skills/system-deep-loop/deep-improvement
  If any untracked or ignored files remain in that folder afterwards, list them in your handback and leave them.
STEP 3. Delete .skilled/skills/system-deep-loop/leaf-scopes.json with git rm. Both of its entries are for the removed modes, and the leaf-manifest generator treats an absent file as "no scopes".

DON'T
- BANNED OPERATIONS: git commit, git push, git checkout, git reset, git stash, git rebase, git branch, rm -rf, npm install, editing anything under specs/.
- Do not put spec paths, phase numbers or ticket ids in code comments.
- Do not touch `.skilled/skills/system-deep-loop/runtime/`, `.skilled/skills/system-skill-advisor/` or any file not named in this brief.
- ALLOWED WRITE PATHS: the three paths above only.

VERIFY (run these; report each exit status)
  ls .skilled/changelog/system-deep-loop/deep-improvement | head -3
  test ! -e .skilled/skills/system-deep-loop/deep-improvement/SKILL.md && echo packet-gone
  git status --short | wc -l

HANDBACK: list what you moved and deleted, then each VERIFY command with its exit status.
