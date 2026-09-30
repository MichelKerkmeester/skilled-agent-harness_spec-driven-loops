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

TASK: add the offline judge measurement to the skill's feature-catalog index.
F = .skilled/skills/sk-communication/feature-catalog/feature-catalog.md (exists; the only file you edit)
Read F in full first. Apply the three edits exactly, character for character. Every other line stays byte-identical.

EDIT 1. F:9 reads `last_updated: "2026-09-14"`. Change it to `last_updated: "2026-09-29"`.

EDIT 2. F:21 reads:
```
Each feature summary links to a per-feature reference with implementation and test anchors under `.skilled/skills/sk-communication/cli-communication-projection/`.
```
Replace that whole line with:
```
Each feature summary links to a per-feature reference with implementation and test anchors under `.skilled/skills/sk-communication/cli-communication-projection/`, or under `.skilled/skills/sk-communication/benchmark/reply-harness/` for the offline judge measurement.
```

EDIT 3. Section `## 6. EVALUATION AND OBSERVABILITY` ends with the `### Content-free observability` entry, its `See [...]` line, a blank line, a `---` line and a blank line, just above `## 7. PACKAGING AND RELEASE`. Insert the block below directly above the `## 7. PACKAGING AND RELEASE` line, then one `---` line and one blank line, so the new entry sits between two `---` lines like every other entry:
````markdown
### Offline judge agreement

#### Description

Measures offline whether a Deem or Jev score per rubric dimension agrees with the operator's grades of masked replies more often than the mechanical scores, with a zero-call default and a label gate.

#### Current Reality

`judge-agreement.mjs` joins masked replies to their reply files by the SHA-256 of the reply text, scores the baseline with `score.mjs` unchanged and stops below 20 operator-graded replies without calling a model. `--jev` and `--deem` each run only after their own check and with `--out <dir>`, ask one `score` per reply and dimension, and print one verdict per column under a keep rule fixed before any run. No verdict reaches `compare.mjs` or the release gate.

#### Source Files

See [`evaluation-and-observability/offline-judge-agreement.md`](evaluation-and-observability/offline-judge-agreement.md) for full implementation and test file listings.

---
````

Accept when: 1 file changed (F), `grep -c "^### " F` prints 13, and the validator exits 0.
Checks you run, from the repo root:
- `grep -c "^### " .skilled/skills/sk-communication/feature-catalog/feature-catalog.md` (expect 13)
- `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-communication/feature-catalog/feature-catalog.md` (expect exit 0)

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
