# Iteration 14 — Agent mirror parity: what the gate actually checks

## Focus

Run every body-parity checker that already exists and report real drift rather than
assumed drift: `check-agent-mirror-sync.cjs --all`, each `upstream_assets` sync script
in its `--check` form, and a direct hash/body comparison across `.skilled/agents`,
`.claude/agents` and `.codex/agents`. Then the Q11 canon half: three doctor command
files and two sk-git references against the sk-doc command and reference templates,
citing both sides.

## Actions Taken

1. Enumerated the four agent trees and their sizes (`.skilled` 11 `.md` + README,
   `.claude` 11 `.md` + `Explore.md` + README, `.codex` 11 `.toml`, plus `.cursor`,
   `.pi`, `.devin`, `.dsh` at 11 entries each).
2. Ran the gates: `check-agent-mirror-sync.cjs --all` → `11 agent(s) checked — all
   mirrors in sync — OK`, exit 0. `sync-runtime-mirrors.cjs --check` → `PASS: 247
   mirrors across 10 trees are in sync`, exit 0. `sync-agents.cjs --check` → `PASS:
   11 agents are in sync`, exit 0.
3. Ran `--check` against the two doctor roster scripts named in the YAML's
   `upstream_assets`. Both reject the flag and exit 2.
4. Resolved the "every agent body differs" delta: a frontmatter-stripped diff of
   `.skilled/agents/code.md` vs `.claude/agents/code.md` shows exactly 18 changed
   lines, and every one is the runtime path token (`.skilled/agents` ↔
   `.claude/agents`) or the `permission:` block vs `tools:` line. So the byte deltas
   (146–228 B per agent) are frontmatter-dialect, not body drift.
5. Checked symlinks before calling anything duplication: `.opencode/agents` is a
   symlink to `../.skilled/agents`; `.cursor/agents/code.md` → `../../.claude/agents/
   code.md`; `.devin/agents/code/AGENT.md` → `../../../.claude/agents/code.md`.
   `.pi/agents/code.md` is a real 48,863-byte file, not a link. `.dsh/agents/` holds
   `*.patch.yml` overlays, a third mechanism again.
6. Read the canon side: `command-router-template.md` (§4 skeleton), `template-rules.json`
   `reference` template, and compared three doctor routers and three sk-git references.

## Findings

### F14-01 — The agent body-parity gate covers 3 of 8 runtime trees; `.pi` is a real copy outside it

**Type** drift · **Severity** P1 · **Release** v4.0.0.0 baseline · **Confidence** high

`RUNTIME_MIRRORS` names three targets only — `opencode` (required), `claude`
(required), `codex` (optional). No `pi`, `devin`, `cursor` or `dsh` entry exists:

[SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:50]
[SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:51]
[SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:53]

`.cursor` and `.devin` are safe by accident: their files are symlinks into
`.claude/agents`, so they inherit that comparison. `.pi/agents/*.md` are not — 11 real
files, `code.md` at 48,863 B, byte-distinct from both `.skilled` (49,002) and `.claude`
(48,781). `.dsh` is a fourth shape entirely (`*.patch.yml`). The gate that runs at
commit time can therefore pass `--all` while `.pi` carries a divergent body.

**Verify** `node .skilled/bin/check-agent-mirror-sync.cjs --all` (reports 11 checked)
then `ls -la .pi/agents/code.md` (regular file) and `ls -la .cursor/agents/code.md`
(symlink) — the asymmetry is the finding.

### F14-02 — Two scripts in the same pipeline name different canonical agent roots

**Type** drift · **Severity** P1 · **Release** v4.0.0.0 baseline · **Confidence** high

The commit gate calls `.opencode/agents` (→ `.skilled/agents`) the authored canonical:

[SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:6]
[SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:29]

The runtime-mirror sync calls `.claude/agents` the source for the Cursor and Devin
trees, and says so explicitly:

[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:36]
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:38]
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:40]

Both pass today only because the trees currently agree modulo path rewriting. The
failure mode is asymmetric: editing `.claude/agents/x.md` immediately changes what
Cursor and Devin execute (they are symlinks), while `check-agent-mirror-sync` blocks
the commit until `.skilled/agents/x.md` is hand-edited to match — and the reverse edit
propagates to nobody. A component author following
`sync-runtime-mirrors.cjs`'s own comment edits the tree that is not the gate's
canonical.

**Verify** `grep -n "CLAUDE_AGENTS = \|AGENTS_DIR = " .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs .skilled/bin/check-agent-mirror-sync.cjs`

### F14-03 — Two `upstream_assets` checkers reject `--check` and exit 2, against the route's own invariant

**Type** bug · **Severity** P2 · **Release** v4.0.2.0 · **Confidence** high

The runtime-mirrors route states an invariant that every `upstream_assets` checker is
invoked in its check-only form:

[SOURCE: .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:28]

and lists both roster scripts as upstream assets:

[SOURCE: .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:37]
[SOURCE: .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:38]

Neither script accepts the flag. `agent-roster-mirror-check.cjs` documents only
`[--root <dir>]` and exits 2 on anything else:

[SOURCE: .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:78]
[SOURCE: .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:89]

`command-catalog-mirror-check.cjs` behaves the same. Repro (exit codes read without a
pipe): `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs --check`
→ 2, `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs --check`
→ 2, both exit 0 with no args. The invariant is satisfiable in spirit (both scripts are
read-only by construction) but not in the letter: an agent that reads "check-only form"
as `--check` gets a hard failure on 2 of 12 assets. The other ten accept `--check`.

**Verify** `for s in agent-roster-mirror-check command-catalog-mirror-check; do node .skilled/commands/doctor/scripts/$s.cjs --check >/dev/null 2>&1; echo "$s=$?"; done` → `2` and `2`.

### F14-04 — Three agent trees each tell their reader that *they* are the canonical path

**Type** drift · **Severity** P3 · **Release** v4.0.0.0 baseline · **Confidence** high

The same sentence exists in three files with three different referents:

[SOURCE: .skilled/agents/code.md:26]
[SOURCE: .claude/agents/code.md:11]
[SOURCE: .pi/agents/code.md:19]

The `.pi` copy is the sharp edge: a Pi agent reads "Use only `.skilled/agents/*.md` as
the canonical runtime path reference" while executing from `.pi/agents/code.md`, a tree
no `.pi` runtime resolves. And the checker cannot see it, because the normalizer folds
`.skilled|opencode|claude|pi` into one token before comparing:

[SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:141]

So the drift is not merely unchecked — it is normalized away. Each runtime ends up with
a self-description that is right for that runtime and wrong about where the authority
lives.

**Verify** `grep -rn "canonical runtime path reference" .skilled/agents .claude/agents .pi/agents | head -3`

### F14-05 — `/doctor:ci` claims `sk-code` while sk-git owns the CI canon

**Type** drift · **Severity** P2 · **Release** v4.0.2.0 · **Confidence** medium

The router-to-skill tags disagree about who owns CI:

[SOURCE: .skilled/commands/doctor/ci.md:6]
[SOURCE: .skilled/commands/doctor/git.md:6]
[SOURCE: .skilled/commands/doctor/runtime-mirrors.md:6]

`git.md` → `sk-git`, `runtime-mirrors.md` → `system-skilled-doctor`, but `ci.md` →
`sk-code` — while the CI reference lives under sk-git:

[SOURCE: .skilled/skills/sk-git/references/continuous-integration.md:22]

An agent that routes on the tag loads the code-implementation skill to answer a
GitHub Actions question whose answer is a sk-git reference. (The tag's existence at all
is the duplicated-identity issue already logged; this is the distinct point that its
*value* can name the wrong owner.)

**Verify** `grep -n "skill_agent" .skilled/commands/doctor/ci.md .skilled/commands/doctor/git.md` and `ls .skilled/skills/sk-git/references/continuous-integration.md`

### F14-06 — Q11 negative result: the doctor routers and sk-git references conform to their sk-doc templates

**Type** misalignment (not found) · **Severity** — · **Release** n/a · **Confidence** high

The canon half of Q11 comes back clean on structure. The router template fixes the
six-section skeleton and names `OWNED ASSETS` and `PRESENTATION BOUNDARY` as the
blocking core:

[SOURCE: .skilled/skills/sk-doc/sk-create-command/assets/command-router-template.md:33]
[SOURCE: .skilled/skills/sk-doc/sk-create-command/assets/command-router-template.md:62]

`/doctor:ci` carries exactly those six, uppercase, divider-separated:

[SOURCE: .skilled/commands/doctor/ci.md:12]
[SOURCE: .skilled/commands/doctor/ci.md:82]

`/doctor:git` adds a `MANDATORY INPUT GATE` before the contract, which is the
template's prescribed position for a command with a required positional — and `ci`
correctly omits it, since the command contract keeps `input.required` true only for
the skill-advisor, git and mcp routers. On the reference side the template requires an
`overview` section and puts `related` last; both sk-git references satisfy it:

[SOURCE: .skilled/skills/sk-doc/shared/assets/template-rules.json:326]
[SOURCE: .skilled/skills/sk-git/references/worktree-workflows.md:23]
[SOURCE: .skilled/skills/sk-git/references/commit-workflows.md:443]

Recorded as a real negative so the next iteration does not re-run it: the departures
from canon in this cluster are the `skill_agent` tag's value (F14-05) and the missing
`.pi` coverage (F14-01), not section vocabulary.

## Questions Answered

None of the two open key questions. Q11 (line 73) was already ticked in a prior
iteration; this run closes its *format* half with F14-06 and leaves nothing open there.
The hooks question (line 66) and the operator-friction question (line 72) were not
touched.

## Questions Remaining

- **Q3/Q4 (hooks)** — `pre-push` without a `Commit-Id`, the 20 s `gate:git-timeout`,
  and the whole v4.0.0.15/v4.0.0.16 worktree set stay unmeasured; every attempt is
  blocked by the read-only bound, which forbids the scratch repo a repro needs.
- **Q10 (friction)** — F14-01, F14-02 and F14-03 are all friction inputs (a gate that
  green-lights an uncovered tree; a commit blocked for editing the "wrong" canonical;
  a route flag that fails on 2 of 12 assets) but none was measured against operator
  behaviour, so Q10 stays open.
- Does `.dsh/agents/*.patch.yml` overlay a body that the parity gate could ever see, or
  is the fourth mechanism entirely outside every check in this cluster? (new, from step 5)
- Is `.skilled/agents/README.txt` (2,029 B) meant to describe 11 agents to a reader who
  opens the tree directly, and does it disagree with `.claude/agents/README.txt`
  (2,405 B)? (new, 376 B apart, unread)

## Next Focus

Stop trying to repro the hooks without a scratch repo — every remaining hook question
needs a throwaway tree, and the read-only bound (correctly) refuses it. Instead take the
one direction this iteration opened that does not need a write: read
`.dsh/agents/*.patch.yml` and `.skilled/agents/README.txt` vs `.claude/agents/README.txt`
to finish the eight-tree parity map, and count how many of the 247 mirrors that
`sync-runtime-mirrors` calls "in sync" are body-checked by anyone. That converts F14-01
from "3 of 8 trees" into an exact uncovered-file count, which is the number the next
reader needs.
