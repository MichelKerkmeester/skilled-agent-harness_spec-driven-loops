GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/markdown.md; focused summary for a one-change brief) ===
You are @markdown, a leaf documentation editor dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. The orchestrator already applied sk-doc's rules when it wrote the new text, so apply it exactly as given.
Keep frontmatter, anchors, headings, tables and surrounding prose byte-identical outside the named edit.
Verification: run only the checks this brief lists and report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: markdown) ===

TASK: update one README so it names the new offline judge script and passes the repository's document validator.
F = .skilled/skills/sk-communication/benchmark/reply-harness/README.md (exists; the only file you edit)
Read F in full first. Apply the four edits below exactly, character for character. Change nothing else: every other line stays byte-identical.

EDIT 1. F:3-5 now reads these three lines:
```
Mechanical plumbing for the reply comparison. No script here calls a model, the model step belongs to the operator.

## What each piece does
```
Replace them with these seven lines:
```
## 1. OVERVIEW

Mechanical plumbing for the reply comparison. The default run of every script here calls no model. Only `judge-agreement.mjs` can ask one, and only behind its `--deem` or `--jev` switch, so the model step that feeds the comparison still belongs to the operator.

---

## 2. WHAT EACH PIECE DOES
```

EDIT 2. Insert this one line directly above the line that starts with "- `release-gate.md`." (it follows the `compare.mjs` line):
```
- `judge-agreement.mjs`. Measures offline whether a model judge agrees with the operator's grades of masked replies more often than the mechanical scores of `score.mjs`. Takes `--masked` and `--replies`, each repeatable, plus an optional `--labels` file of operator grades. It joins each masked reply to its reply file by the SHA-256 of the reply text, runs `score.mjs` unchanged for the baseline, counts apart any empty or missing reply it cannot score, and prints the census, the baseline agreement and a label gate that stops below 20 graded distinct replies. The default run calls no model and writes no file. `--deem` asks the local Deem server and `--jev` asks the hosted Jev service, each only after its own check passes and only with `--out <dir>`, where the run writes `report.json` and one `calls.jsonl` line per call. No verdict it prints reaches `compare.mjs` or the release gate.
```

EDIT 3. The line `## Run order` becomes these three lines:
```
---

## 3. RUN ORDER
```

EDIT 4. Insert this one line directly below the line that starts with "5. `node compare.mjs":
```
6. `node judge-agreement.mjs --masked <masked dir> --replies <before replies dir> --replies <after replies dir> --labels <grades file>` when you want to know whether a model judge would grade the masked replies as you would. The grades file holds one JSON line per graded masked file: `masked`, its path from the repository root, and `grades`, each of the seven `rubric.json` dimension ids set to `absent`, `partly met` or `fully met`. Add `--deem --out <dir>` or `--jev --out <dir>` only once at least 20 distinct replies are graded. `--jev` sends reply text to a hosted service, so a masked file that git does not track also needs `--accept-payload`.
```

Accept when: 1 file changed (F), it has exactly 3 lines starting with `## `, and the validator below prints `VALID`.
Checks you run, from the repo root:
- `grep -c "^## " .skilled/skills/sk-communication/benchmark/reply-harness/README.md` (expect 3)
- `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-communication/benchmark/reply-harness/README.md` (expect `VALID` and exit 0)

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge
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

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
