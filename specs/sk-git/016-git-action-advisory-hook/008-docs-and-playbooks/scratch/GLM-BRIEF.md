# BRIEF: Spec Docs + Manual-Testing Playbook Coverage for the Git Preflight Advisory

You are GLM-5.2 acting as a documentation engineer. Work entirely inside THIS repository
checkout. Write the files listed below, verify them, then stop. Do not commit. Do not touch
git state. Do not edit any file outside the WRITE SCOPE at the bottom.

Everything you write must be grounded in the FACTS section at the bottom of this brief and in
the files it names. Do not invent behavior, paths, or numbers. Where you are not certain,
read the named source file first.

## PART A — Spec phase docs (two folders)

Write spec.md, plan.md, tasks.md, implementation-summary.md for:

1. `.opencode/specs/sk-git/016-git-action-advisory-hook/007-runtime-coverage/`
2. `.opencode/specs/sk-git/016-git-action-advisory-hook/008-docs-and-playbooks/`

Format authority (copy the structure EXACTLY, including anchors and frontmatter shape):
- Read `.opencode/specs/sk-git/016-git-action-advisory-hook/005-destructive-tier/spec.md`,
  `plan.md`, `tasks.md`, `implementation-summary.md` — your four templates.
- Frontmatter: same `_memory.continuity` block shape; `packet_pointer` =
  `sk-git/016-git-action-advisory-hook/<folder>`; `last_updated_by: "glm-5-2"`;
  `completion_pct: 100`; status Complete; Level 1; Phase 7 of 8 / Phase 8 of 8;
  predecessor/successor chained accordingly (006 ← 007 ← 008 → None).
- Content: describe what was ACTUALLY built (FACTS section), including limitations honestly.
- HARD RULE: no ADR-/REQ-/CHK-/task-ids and no spec paths inside any CODE comments you might
  quote; in prose tables REQ-00N ids are fine (they are part of the template).

007 covers: the four new runtime integrations (OpenCode plugin, Pi extension, Cursor proxy,
Devin wiring) plus the style alignment of the hook code.
008 covers: the two code READMEs plus the seven playbook features (this Part B work).

## PART B — sk-git playbook feature

Create `.opencode/skills/sk-git/manual-testing-playbook/git-preflight-advisory/` with ONE
feature file: `advisory-fires-on-silent-scope-drop.md`, scenario id `GIT-042`.

Format authority (copy EXACTLY — frontmatter, section numbering, the wide TEST EXECUTION
table):
`.opencode/skills/sk-git/manual-testing-playbook/safety-refusals/no-verify-bypass-refused.md`

Scenario content:
- Objective: the preflight advisory fires when a directory-scoped commit would silently
  exclude untracked files, stays silent on an ordinary commit, and is suppressible.
- Real user request example: "Commit the src folder for me" while `src/` holds one modified
  tracked file and one untracked file.
- Command sequence (documented for the operator): create a scratch repo, modify a tracked
  file under a subdir, add an untracked file there, then run `git commit --only <dir> -m x`
  through the AI runtime and observe the `⚠ sk-git advisory` line naming
  `commit-scope-drops-untracked`; then repeat with `SKGIT_ADVISORY=0` and confirm silence;
  then an ordinary clean commit and confirm silence.
- Expected signals: advisory text contains the rule id; the commit itself still runs
  (advisory never blocks); suppression works.
- Pass/fail: PASS when the advisory names the rule id AND the command still executed AND the
  suppressed re-run prints nothing. FAIL if the command is blocked, or no advisory appears on
  the trap shape.

## PART C — six cli playbook features

One feature file per playbook. Each must follow ITS OWN playbook's local format — read one
existing feature file from each playbook first and copy its exact frontmatter/section shape.
Use the next free scenario id per skill (listed below). Name each file
`git-preflight-advisory.md`, in a new feature folder `git-preflight-advisory/`.

| Playbook | New id | Runtime surface facts to state |
|---|---|---|
| cli-claude-code | CC-028 | PreToolUse Bash hook via `.claude/settings.json`; advisory arrives as hook additionalContext |
| cli-codex | CX-029 | PreToolUse exec via `.codex/hooks.json`; same shared hook, `tool_name: exec` |
| cli-cursor | CU-026 | `preToolUse` (tool_name `Shell`) via `.cursor/hooks.json` → `.cursor/hooks/git-preflight-advisory.mjs` proxy |
| cli-devin | DV-021 | `PreToolUse` matcher `^exec$` via `.devin/hooks.v1.json`, direct reference to the shared hook |
| cli-opencode | CO-038 | `.opencode/plugins/mk-git-preflight-advisory.js`, `tool.execute.before`; delivery per the FACTS section (plugins never print) |
| cli-pi | PI-020 | `.pi/extensions/git-preflight-advisory.ts`, `tool_call` event on `bash`, warn returned as `reason` |

Each file covers: what the advisory is (one paragraph, pointing at
`.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` and the sk-git
`hard_rules:`), how THIS runtime registers and delivers it, the same trap scenario as GIT-042
(directory-scoped commit with an untracked file inside), the suppression envs
(`SKGIT_ADVISORY=0`, `SKGIT_ADVISORY_SKIP=<rule-id>`), and the fail-open guarantee (a hook
error must never block the command). Keep each file focused — one scenario, the runtime's
registration facts, pass/fail.

If a playbook's root `manual-testing-playbook.md` contains a feature-folder index table, add
one row for the new folder; if it has no such table, leave the root file untouched.

## VERIFY (do all, record results honestly at the end of each file's work)

- Every file you create parses as markdown with intact frontmatter (`---` fences).
- Every path you cite exists in this checkout (check with ls before citing).
- Scenario ids do not collide (grep the playbook for the id before using it).

## WRITE SCOPE (complete list — nothing else)

- `.opencode/specs/sk-git/016-git-action-advisory-hook/007-runtime-coverage/{spec,plan,tasks,implementation-summary}.md`
- `.opencode/specs/sk-git/016-git-action-advisory-hook/008-docs-and-playbooks/{spec,plan,tasks,implementation-summary}.md`
- `.opencode/skills/sk-git/manual-testing-playbook/git-preflight-advisory/` (new)
- `.opencode/skills/cli-external-orchestration/<each of the six>/manual-testing-playbook/git-preflight-advisory/` (new)
- The six playbook root `manual-testing-playbook.md` files ONLY to add an index row where a table exists.

## FACTS (appended by the orchestrator after the code landed — treat as ground truth)

All facts below were verified by the orchestrator against the working tree on 2026-07-28.

- The shared hook is `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`. It
  reads 17 `hard_rules:` from `.opencode/skills/sk-git/SKILL.md`, evaluates them with
  repository state, and emits `hookSpecificOutput.additionalContext` starting with
  `⚠ sk-git advisory`. It never blocks; it fails open; max 3 advisories per command.
- Runtime matrix (all live in this tree):
  - Claude: `.claude/settings.json` PreToolUse Bash → shared hook (stdin JSON, `tool_name: Bash`).
  - Codex: `.codex/hooks.json` PreToolUse exec → shared hook (`tool_name: exec`, payload `cwd`).
  - Devin: `.devin/hooks.v1.json` PreToolUse matcher `^exec$` → shared hook, same envelope as
    sibling entries.
  - Cursor: `.cursor/hooks.json` `preToolUse` matcher `Shell` → proxy
    `.cursor/hooks/git-preflight-advisory.mjs`, which maps the Shell payload onto the shared
    hook and forwards its stdout verbatim.
  - OpenCode: `.opencode/plugins/mk-git-preflight-advisory.js`, `tool.execute.before` on Bash
    calls; delivery is a bounded buffer (max 20 events) drained into the next
    `experimental.chat.system.transform` — plugins never print to stdout/stderr.
  - Pi: `.pi/extensions/git-preflight-advisory.ts`, `pi.on("tool_call")` on `bash`; warnings
    return as `{ reason }`; suppression tiers honored; fail open.
- Style alignment: the five sk-git script files now carry the boxed COMPONENT headers and
  numbered section dividers of the sk-code JS style guide; behavior unchanged; 23/23 tests
  green before and after; all three sk-code drift guards pass.
- READMEs: `.opencode/skills/sk-git/scripts/lib/README.md` and
  `.opencode/skills/sk-git/scripts/hooks/README.md` exist (patterned on the cli-opencode lib
  README).
- Trap scenario verified live: in a scratch repo with `src/tracked` modified and
  `src/untracked` present, payload `{"tool_name":"Bash","tool_input":{"command":"git commit --only src -m x"}}`
  produces the advisory naming `commit-scope-drops-untracked`; ordinary commit and non-git
  commands produce no output; `SKGIT_ADVISORY=0` silences.
- Known limitations to state honestly in 007's implementation-summary:
  - Pi extension not compiled (`tsc` unavailable in this checkout); import paths verified to
    resolve; runtime execution under a live Pi session not exercised.
  - OpenCode plugin delivery verified by code review against the sibling
    `mk-skill-advisor.js` transform pattern, not by a live OpenCode session.
  - Cursor proxy verified by stdin simulation, not by a live cursor-agent session.
