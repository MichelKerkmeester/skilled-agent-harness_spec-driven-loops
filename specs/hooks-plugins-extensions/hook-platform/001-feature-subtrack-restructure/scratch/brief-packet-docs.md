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
You are a spec author. You write PLANNING documents only. You move no packet and change no code.

TASK
Fill the scaffolded docs spec.md, plan.md, tasks.md, acceptance-criteria.md and goal.md in
  specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure
Follow .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md sections 4 to 9
(the folder exists: do NOT run create.sh). Leave implementation-summary.md untouched. Keep Status: Draft.

WHAT THIS PACKET IS
The spec track specs/hooks-plugins-extensions/ grouped its packets into six broad sub-tracks. The operator
asked for one sub-track per hook, plugin or extension feature, plus one overview of every feature.
Read these before writing:
- specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/feature-overview.md (31 feature cards, already written and verified)
- specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/scratch/move-map/map.txt (the approved move map: 29 in-track rows, then 11 rows from other tracks)
- .skilled/skills/system-spec-kit/references/structure/folder-structure.md lines 97-152 (sub-track rules)
- node .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs --help  (the only tool that may move a packet)

DECISIONS ALREADY MADE BY THE OPERATOR (state them as decisions, do not reopen them)
- One sub-track per feature, named after the feature's folder under .skilled/hooks/. 36 sub-tracks exist now, each with z_archive/.gitkeep, including sub-tracks for features that have no packet yet.
- hook-platform holds cross-cutting packets. retrieval-integrations stays as it is.
- Whole top-level packets in other tracks whose main subject is a hook feature move in (the 11 foreign rows). A child phase inside another track's phase parent does not move; the overview points to it.
- Two packets are HELD because other worktrees have unmerged or uncommitted work in them: session-turn-boundaries/002-session-relaunch-loop (destination session-relaunch/) and pi-extensions/012-file-relative-adapter-imports (destination hook-platform/). They move after those worktrees merge.
- The session history lookup gets no sub-track of its own: its packet lives in session-relaunch/ because it is being folded into the handover.
- Moves run only through relocate.mjs, in the worktree, after a local commit, because the tool refuses to run over uncommitted changes. Nothing is pushed.

REQUIREMENTS TO COVER (write them as testable rows)
- The overview has one card per feature and covers every folder under .skilled/hooks/, every .js file in .opencode/plugins/ and every entry in .pi/extensions/.
- Every row of map.txt is applied, the old sub-tracks that end up empty are retired or reported, and the two held packets are listed with their destinations.
- bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions --strict --recursive reports RESULT: PASSED for every packet (baseline before the work: 39 passed, 0 failed).
- The track root metadata names hooks-plugins-extensions (it still says "hooks" in specs/hooks-plugins-extensions/description.json).
- No old packet id remains outside the relocation ledger and archives.

WRITING RULES
- Every path and number you write must come from a file you opened or from this brief.
- spec.md Measured Behavior: run  ls -d specs/hooks-plugins-extensions/*/ | wc -l  and paste the command and its exact output.
- If you cannot answer something, write UNKNOWN and add an "Open question:" line in goal.md section 4.
- plan.md has exactly three phases: Setup, Implementation, Verification. tasks.md lines each end with "Verify: <command and expected output>".
- Do not paste the whole map into spec.md; point to scratch/move-map/map.txt and summarise by sub-track.

ALLOWED WRITE PATHS
- specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/spec.md, plan.md, tasks.md, acceptance-criteria.md, goal.md, description.json, graph-metadata.json (the last two only through validate.sh auto-repair)

BANNED OPERATIONS
- Any git command that changes state. Running relocate.mjs with --apply, create.sh, generate-context.js, npm install, any model CLI.
- Any edit outside the allowed paths. Opening any secrets or dotenv file.

VERIFICATION (run last, include the output in your final message)
  rg -o '\[YOUR_VALUE_HERE:' specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/spec.md specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/plan.md specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/tasks.md specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/acceptance-criteria.md specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/goal.md | wc -l      (must print 0)
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure --strict --quiet      (first RESULT line must be PASSED)
If validation fails, run it once without --quiet, fix every failing rule, and retry. Stop after three rounds and report the errors.

HANDBACK
End with both verification outputs and the open questions you recorded.
