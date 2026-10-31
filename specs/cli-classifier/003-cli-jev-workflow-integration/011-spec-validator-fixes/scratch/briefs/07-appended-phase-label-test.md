GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/code.md; focused summary for a one-change brief) ===
You are @code, a leaf implementer dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. Read each file before editing it and re-read the edited region after.
Standards: read .skilled/skills/sk-code/SKILL.md and follow the route it resolves for this file type.
Comment hygiene is a hard block: no spec paths, packet or phase numbers, or REQ/task ids in code comments. Keep the durable why.
Verification: run only the checks this brief lists. Fail closed: no retry loop, no workaround. Report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: code) ===

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes
- Other workers edit other files in this tree at the same time. Touch only the files this brief names.
- The orchestrator runs the test suites, spec validation and every git commit after you return.
- Your sandbox may block test runners that open local sockets (tsx, vitest). Run only the checks listed here; the orchestrator runs the rest.

DON'T
- Edit, create or delete any file this brief does not name.
- Run a git command that writes (add, commit, stash, checkout, restore, reset, merge, rebase, push).
- Install anything (npm/pnpm/pip/brew install, npm ci) or touch node_modules.
- Open any .env file, print environment variables, or write a key or token into any file.
- Call jev, the local Deem server (127.0.0.1:8300) or any network service.
- Put spec paths, packet or phase numbers, or REQ/task ids in code comments.
- Reformat, reorder or "improve" anything outside the named edit.
- Ask a question. If a step cannot be done exactly as written, stop and report BLOCKED with the reason.

STEP 1: pin, in the shell suite, that children appended to a phase parent carry their own phase number in all three labels
File: T = .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh (test only; create.sh already labels by phase number, do not touch it)
Line numbers are those of the file before this brief. Do T b first, then T a, so each stays valid.
T a. In the stub heredoc of install_desc_generator_stub, directly after its `if (logPath) { ... }` block (lines 89-91), add:
const labelLogPath = process.env.DESC_STUB_LABEL_LOG;
const description = (() => {
  const idx = process.argv.indexOf('--description');
  return idx >= 0 ? process.argv[idx + 1] : '';
})();
if (labelLogPath) {
  fs.appendFileSync(labelLogPath, `${targetPath}\t${description}\n`);
}
   The existing DESC_STUB_LOG line format must not change: test 3 greps it. In the comment at lines 73-76, after
   "to DESC_STUB_LOG" add ", and its --description to DESC_STUB_LABEL_LOG when that is set,". Nothing else in the comment.
T b. Insert a Test 4 section above line 239 (the `echo ""` before the Results banner), in the style of Tests 2 and 3:
   header comment `# Test 4: an appended child is labeled with its own phase number`, then `echo "-- Appended phase labels --"`.
   repo4=$(make_temp_repo); install_desc_generator_stub "$repo4"; create4=<create.sh under repo4, as line 154>; label_log="$repo4/desc-labels.log"
   Run 1: base_json=$(cd "$repo4" && DESC_STUB_LABEL_LOG="$label_log" bash "$create4" --json --phase --skip-branch --number 4 --phases 1 --phase-names "foundation" "Label base parent")
          parent_rel="specs/$(echo "$base_json" | json_field "BRANCH_NAME")"
   Case 1: pass "A new parent's first child is labeled Phase 1" when
          grep -qF "$(printf '%s\t%s' "001-foundation" "Phase 1: foundation")" "$label_log", else a fail line.
   Run 2, in a subshell so the script's working directory does not move:
          (cd "$repo4" && DESC_STUB_LABEL_LOG="$label_log" bash "$create4" --json --phase --parent "$parent_rel" --phases 2 --phase-names "implementation,integration" "Label append run" >/dev/null)
   Case 2: for the pairs 002-implementation / "Phase 2: implementation" and 003-integration / "Phase 3: integration", all of:
          the label log holds "<child><TAB><label>" (grep -qF with printf as in case 1);
          python3 -c 'import json, sys; print(json.load(open(sys.argv[1]))["derived"]["causal_summary"])' "$repo4/$parent_rel/<child>/graph-metadata.json" prints exactly <label>;
          grep -qF "<label>" "$repo4/$parent_rel/<child>/spec.md" matches.
          One pass "Appended children carry Phase 2 and Phase 3 in description, graph metadata and spec title" when all six hold, else one fail line.
Accept when: 1 file changed: the stub gains the label log, the comment gains one clause, Test 4 adds exactly 2 pass/fail cases.

VERIFY (paste each command with its result line and exit code; the orchestrator runs the suite, which needs node_modules)
  bash -n .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh   # exit 0
  grep -c 'DESC_STUB_LABEL_LOG' .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh   # 4
  grep -c '^# Test 4:' .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh   # 1

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
