REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/399-hook-feature-subtracks
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

ROLE
You are a careful repository analyst. You read code and docs and record facts. You do not edit code.

TASK
Write one feature card per feature listed under FEATURES into exactly one new file:
  specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/scratch/wave-a/cards-w5.md

FEATURES (name => where its code lives)
- post-edit-quality => .skilled/hooks/post-edit-quality/
- session-cleanup => .skilled/hooks/session-cleanup/
- session-lifecycle => .skilled/hooks/session-lifecycle/
- session-relaunch => .skilled/hooks/session-relaunch/ (search specs for session-relaunch; the big packet is specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop, list it once and do not list its children)
- skill-advisor => .skilled/hooks/skill-advisor/ (search specs for 'skill-advisor hook' and 'prompt-advisor')

HOW TO BUILD EACH CARD
1. Read the feature's README.md and list its folder. Read enough of the code to confirm what the README says.
2. Runtimes: list the runtime subfolders that exist (claude, codex, cursor, devin, dsh, pi, opencode) and check for a same-named mirror in .opencode/plugins/ and .pi/extensions/.
3. Kill switch: find the feature's flag in .skilled/hooks/hook-flags.env.example. Write "none found" if there is none.
4. Spec packets: run  rg -l -i "<feature name>" specs --glob spec.md  (skip paths containing z_archive or /scratch/). For each hit, read the spec title and its problem statement, then classify it:
   OWNS      = the feature is the main subject of that packet
   MENTIONS  = the feature is only referenced
   Also say whether the packet is TOP-LEVEL (specs/<track>/<sub-track>/<NNN-name> or specs/<track>/<NNN-name>) or a CHILD of a phase parent (a deeper path).
   List at most 12 hits per feature, OWNS first. If there are more, write "N more MENTIONS omitted".

CARD FORMAT (use exactly these field labels, one card per feature, cards separated by a line containing only ---)
## <feature name>
- Purpose: <one or two sentences, from the README and code>
- Kind: <hook | plugin | extension | git hook | library | mix: ...>
- Code: <paths, comma separated>
- Runtimes: <list>
- Mirrors: <paths in .opencode/plugins and .pi/extensions, or none>
- Kill switch: <flag name or none found>
- Packets:
  - <OWNS|MENTIONS> | <TOP-LEVEL|CHILD> | <spec folder path> | <packet title>
- Evidence: <two or three file:line citations that back the Purpose line>
- Unsure: <anything you could not confirm, or none>

RULES
- Every path you write must exist. Check with ls before writing it.
- Record only what you read. If you did not confirm something, put it under Unsure. Do not guess.
- Do not copy this brief's wording into Purpose; take it from the files.

ALLOWED WRITE PATHS
- specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/scratch/wave-a/cards-w5.md   (create this one file only)

BANNED OPERATIONS
- Any git command that changes state (commit, push, add, checkout, switch, branch, reset, stash, restore, clean, mv, rm).
- Editing, creating, moving or deleting any file other than the one allowed path.
- Running relocate.mjs, create.sh, validate.sh, generate-context.js, npm install, or any model CLI.
- Reading or printing any .env file.

VERIFICATION (run it last and include its output in your final message)
  rg -c '^## ' specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/scratch/wave-a/cards-w5.md
It must print the number of features listed above.

HANDBACK
End with: the verification output, the list of features, and any feature you could not complete with the reason.
