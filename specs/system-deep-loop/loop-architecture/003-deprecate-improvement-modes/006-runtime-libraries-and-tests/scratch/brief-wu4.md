GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-deep-loop/039-deprecate-improvement-modes/006-runtime-libraries-and-tests
It lives in the main checkout; you do not write to it. You write only in the current directory, which is a git worktree.

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

ROLE: You remove a retired lane family from four deep-loop runtime docs. Nothing else.

Removed lanes: `agent-improvement`, `model-benchmark`, `skill-benchmark` and their shared base `deep-improvement-common` (also spelled `deep-improvement` or `improvement` as a mode alias), plus the packet `.skilled/skills/system-deep-loop/deep-improvement/` and its loop host. They are the "improvement family". Remaining deep-loop modes: research, review and ai-council (decision kinds `deep-review`, `deep-ai-council`, research where present).
Their libraries, lane tests and `lib/legacy-projections/deep-improvement-ledgers-contract.ts` are already deleted in this tree.

RULE: delete rows, bullets and list items that exist only for the improvement family; drop the family's names from mixed lists; keep everything else word for word. No "removed" notes.

FILES
  .skilled/skills/system-deep-loop/runtime/references/integration-points.md line ~161: delete the "Doctor + deep-improvement" row; renumber later rows only if the table numbers them sequentially.
  .skilled/skills/system-deep-loop/runtime/feature-catalog/validation/mk-deep-loop-guard.md line ~23 and .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/validation/mk-deep-loop-guard.md line ~15: drop `deep-improvement` (and any improvement mode) from the lists of guarded agents and modes.
  .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/script-entry-points/append-mode-event-script.md lines ~74 and ~119: these steps show a mode that resolves but sits outside the authority order, using `deep-improvement`, which no longer resolves. Read scripts/append-mode-event.cjs and lib/per-mode-authority-flip/types.ts: if another mode still resolves but is outside the authority order, use it; if none does, delete both bullets.

DON'T
- BANNED OPERATIONS: git commit, git push, git checkout, git reset, git stash, git rebase, git branch, rm -rf, npm install, editing anything under specs/.
- ALLOWED WRITE PATHS: the four files above only.

VERIFY
  rg -n -i "agent-improvement|model-benchmark|deep-improvement|skill-benchmark|improvement-host" .skilled/skills/system-deep-loop/runtime --glob '*.md' --glob '!**/changelog/**'

HANDBACK: list every file you changed and the VERIFY output (should be empty apart from changelog history).
