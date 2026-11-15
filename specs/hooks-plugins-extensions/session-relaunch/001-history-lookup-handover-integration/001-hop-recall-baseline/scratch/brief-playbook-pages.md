REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/399-hook-feature-subtracks
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/001-hop-recall-baseline

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

ROLE
You are a documentation author for manual testing playbooks. You change no code and run no model CLI.

TASK
Create two playbook scenario pages and register them:
  A) .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md            (arm "lookup": the history lookup CLI is on disk)
  B) .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-baseline-conversation.md   (arm "baseline": the lookup CLI is hidden for the run)
  C) add one index row per page to .skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md, beside the rows of the compaction pair.

READ FIRST
- The pattern to follow, section by section: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-recall-conversation.md and compaction-history-recall-baseline-conversation.md
- A page with a "### Recorded Results" table: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md (search for "Recorded Results")
- The procedure these pages document, which already exists as a script: specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/001-hop-recall-baseline/scratch/harness/hop-recall.sh and specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/001-hop-recall-baseline/scratch/harness/analyze.py
- What the phase requires: specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/001-hop-recall-baseline/spec.md sections 3 to 5
- The authoring rules: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md and its references/conversation-scenarios.md

WHAT THE SCENARIO IS (take the details from hop-recall.sh, do not invent any)
A sender session under skilled-loop runs a script that prints 120 one-time codes, then works on an unrelated small task. A hop to a fresh session is forced with a low relaunch threshold. Once the handoff note is claimed, the operator asks the receiver for the code printed for K073 (expected PDSNMMBW). The run measures whether a receiver recovers a detail the handoff note left out. The conversation runner cannot drive a hop, so the page is an operator procedure built on the harness script, not a scripted json conversation block. Say so, and cite the runner limit.

EACH PAGE MUST CONTAIN
- The same five numbered top-level sections the compaction pair uses, with frontmatter (title, description, trigger_phrases, version 1.0.0.0).
- The exact command to run one arm: bash specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/001-hop-recall-baseline/scratch/harness/hop-recall.sh <lookup|baseline> <label>
- The observed line format the harness prints, with its fields: answer, lookup_attempted, native_recall, transcript_read, note_leaked, note_status, counted.
- The counting rule: a run counts only when the note reached claimed, note_leaked=0, the receiver session differs from the sender, the question was asked, and (baseline) the CLI did not reappear.
- Pass or fail rule and failure triage (at least: the hop never happened, the note leaked the code, the CLI reappeared in the baseline arm).
- A paragraph naming "Pi, OpenCode and Codex" as optional follow-ups: they need SYSTEM_SESSION_RELAUNCH_ENABLED=1, and Codex also needs its hooks trusted (trust_hooks).
- A "### Recorded Results" section with a table whose columns are: arm | runtime | run | answer | lookup_attempted | native_recall | transcript_read | note_leaked | counted. Put exactly one row in it:
  | <arm> | claude-code | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
  The orchestrator replaces that row with the measured runs. Do not invent results.

ALLOWED WRITE PATHS
- .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md (create)
- .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-baseline-conversation.md (create)
- .skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md (add two index rows only)

BANNED OPERATIONS
- Any git command that changes state. Any edit outside the allowed paths. Running hop-recall.sh, tmux, claude, opencode or any model CLI.
- Editing anything under scratch/harness or scratch/runs. Opening any secrets or dotenv file.

VERIFICATION (run last, include the output in your final message)
  node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook --repo-root . --skills-root .skilled/skills
It must end with scenarios=126 violations=0 (it prints scenarios=124 violations=0 before your work). If it reports violations, fix them and rerun, at most three rounds.

HANDBACK
End with the verification output and anything you could not confirm.
