# Iteration 4: Goal Parity

## Focus

For all seven runtimes: how does a packet goal reach a session, by which file and hook, and what
happens when it does not? Identify the runtimes with no path and decide whether each needs an
adapter, a native equivalent, or nothing. Include what a missing adapter costs an operator
mid-session.

## Findings

### F1. The parity standard is defined by the goal hub itself, and only two runtimes meet it

`.opencode/hooks/goal/README.md` states the bar: "A runtime is not called fully supported unless
injection and management bind the same native current-session identity."
[SOURCE: file:.opencode/hooks/goal/README.md:84]

| Runtime | Adapter / path | Event wiring | Identity source | Verdict against the bar |
|---|---|---|---|---|
| **OpenCode** | `.opencode/plugins/opencode-goal.js` (separate implementation; browsability symlink at `hooks/goal/opencode/opencode-goal.js`) | native plugin lifecycle | native OpenCode session | **full** — native `bind`/`resent`/`packet` tools, verifier, guarded continuation |
| **Pi** | `pi/goal-context.ts`, discovered at `.pi/extensions/goal-context.ts` | `input` + `session_start` + `turn_end`; registers `/goal-pi` | `ctx.sessionManager.getSessionId()` | **full** — injection + management + heuristic verify |
| **Cursor** | `cursor/goal-inject.mjs` at `.cursor/hooks.json:36` | `sessionStart` only | `session_id`, else `conversation_id` | **injection only** — no mid-session refresh, no verify/continue |
| **Devin** | `devin/goal-inject.mjs` at `.devin/hooks.v1.json:33,55` | `SessionStart` + `UserPromptSubmit` | `session_id`; `cwd` or `DEVIN_PROJECT_DIR` | **injection only** — no Devin prompt-command surface to manage from |
| **Hermes** | `.hermes/plugins/repo-guards/__init__.py` section `repo-guards-goal` (`:845`) | session-start system-prompt section | `_session_goal(_session_id(...))`, falling back to `_goal_slice()` | **read-only projection** — real path, absent from the hub's own table |
| **Claude** | none in repo | native host goal command; speckit workflows render the stripped durable slice | host-native | **native equivalent**, operator-confirmed only |
| **Codex** | none in repo | "Same as Claude, on the same confirmation" | host-native | **native equivalent**, weakest evidence chain |

[SOURCE: file:.opencode/hooks/goal/README.md:71-84]
[SOURCE: file:.cursor/hooks.json:36] [SOURCE: file:.devin/hooks.v1.json:33,55]
[SOURCE: file:.hermes/plugins/repo-guards/__init__.py:124,615,653,744,845]
[SOURCE: file:.pi/extensions/goal-context.ts → ../../.opencode/hooks/goal/pi/goal-context.ts]

### F2. The hub's own delivery table omits Hermes, which has a working binding

`README.md` §3 has six rows: Pi, Cursor, Devin, OpenCode, Claude, Codex. Hermes appears nowhere in
that file, and `goal-plugin.md` carries only the Claude/Codex lines 159–160 in the same shape.
Yet Hermes does bind a goal: `GOAL_RUNTIME = "hermes"` at `__init__.py:124`, a session-start
`repo-guards-goal` prompt section at `:845`, and a per-session lookup that prefers
`_session_goal(session_id)` and falls back to the packet's durable slice `_goal_slice()` at `:744`.

**Consequence:** anyone auditing goal parity from the goal hub's own table will conclude Hermes has no
goal path and either re-build one or report a false gap. This is the same failure class as
`.devin/SYNC.md:74` (iteration 2) and `.cursor/SYNC.md:32` (iteration 3): the authoritative doc
lags the code, and the doc is what a maintainer reads first.

### F3. Injection without management is not read-only — it is the one write those adapters make

The hub is careful about this and the care is load-bearing: "Injection-without-management is not
read-only: both adapters record a turn on the bound record, which is the one write they make."
[SOURCE: file:.opencode/hooks/goal/README.md:84]

So Cursor's and Devin's adapters are not passive; they mutate session state. That matters for any
"does this runtime need a goal adapter" decision: the question is never injection alone.

### F4. Cursor's limit is an identity limit, not an adapter limit

"management needs identity the prompt command does not carry, so `/goal-cursor` answers only
`packet <path>`, a session-free read." The command itself declares the same contract in its own
frontmatter: "management stays unavailable without native session identity … any management action
fails closed: no session identity."
[SOURCE: file:.opencode/hooks/goal/README.md:77] [SOURCE: file:.cursor/commands/goal-cursor.md:2]

**Verdict:** no adapter should be added. Cursor's host does not expose the identity, so a Cursor
adapter and a Cursor host capability are the same missing thing, and only Cursor can supply it.

### F5. Claude and Codex: the fallback exists in the speckit workflows, the host claim does not verify in-repo

What the repo does control is present and wired:

- Every speckit command carries goal handling in its YAML assets: `speckit-plan.yaml`,
  `speckit-resume-auto.yaml`, `speckit-resume-confirm.yaml`, `speckit-implement.yaml`,
  `speckit-complete.yaml`, plus presentation templates.
  [SOURCE: shell `rg -ln -i goal .opencode/commands/speckit/`]
- The always-on posture row binds the agent every turn: `AGENTS.md:185` and `CLAUDE.md:185`
  "GOAL POSTURE RULE [ALWAYS ON]".
- The hub records the delivery: "The speckit workflows render the parent goal's durable slice,
  frontmatter excluded, and hand it over to be set; the `AGENTS.md` goal posture row binds the agent
  on every turn." [SOURCE: file:.opencode/hooks/goal/README.md:81]

What the repo cannot verify: the host command itself. The hub marks it "operator-confirmed 2026-09-12
and re-checkable only against a live host" and `goal-plugin.md:159-160` repeats the same provenance
for both hosts. Neither `.claude/settings.json` nor `.codex/hooks.json` contains a goal entry
(checked directly), so nothing repo-side would break loudly if the host behavior changed.
[SOURCE: file:.opencode/hooks/goal/goal-plugin.md:159-160] [SOURCE: shell `rg -i goal .claude/settings.json .codex/hooks.json` → no match]

**Verdict:** Claude — native equivalent, no adapter needed; the residual risk is an unverifiable
claim, mitigated by the posture row and the speckit handover. Codex — the same claim restated as
"Same as Claude", which means Codex's coverage rests on a host-parity assumption *derived from
another host's confirmation*. That is the weakest link in the goal row and the one place a cheap,
verifiable repo-side fallback does not exist today (Codex has a `prompts/` surface and no
`goal-codex.md` stub in it).

### F6. What a missing or partial goal path costs an operator mid-session

- **Cursor / Devin (injection only):** a new `bind` mid-session is not re-read. The session keeps
  operating on the goal captured at `sessionStart`; only a fresh session picks up a re-bound packet.
  Cursor additionally has no verify/continue surface at all.
- **Claude / Codex (host-native, unverified):** if the host goal command is absent or renamed, nothing
  in the repo fails; the operator's symptoms are a silently unbound goal and an agent that never
  restates it. The posture row tells the agent *how to behave about a goal*, not whether one exists.
- **Hermes (undocumented but present):** the operator's cost is borne by maintainers rather than the
  session — a false "no goal support" conclusion in the next audit.
- **OpenCode / Pi (full):** no cost; both bind injection and management to the same identity.

## Sources Consulted

- `file:.opencode/hooks/goal/README.md:71-110` (per-runtime delivery, the support bar, directory tree)
- `file:.opencode/hooks/goal/goal-plugin.md:159-160`
- `file:.opencode/hooks/goal/bin/goal.cjs:114-190` (runtime label, show/bind/unbind/resent, set)
- `file:.opencode/hooks/goal/lib/goal-core.cjs`, `lib/goal-slice.cjs` (present, not read line-by-line)
- `file:.hermes/plugins/repo-guards/__init__.py:124,615-627,653,744,845`
- `file:.cursor/hooks.json:36`, `file:.cursor/commands/goal-cursor.md:2`
- `file:.devin/hooks.v1.json:33,55`
- `file:.pi/extensions/` symlink table; `.opencode/plugins/opencode-goal.js` (present, not read)
- `file:AGENTS.md:185`, `file:CLAUDE.md:185`
- Shell: `rg` for goal in `.claude/settings.json`, `.codex/hooks.json`, `.opencode/commands/speckit/`

## Assessment

`newInfoRatio: 0.75` — The charter's fact 4 named the adapter directories; this iteration replaces it
with the hub's own seven-way classification and finds the one cell the charter's framing would have
missed: Hermes has a working goal path that the goal hub's table does not list. Also new: the
"injection-without-management is not read-only" property, Cursor's limit being an identity limit
rather than an adapter limit, and the fact that neither `.claude/settings.json` nor
`.codex/hooks.json` carries any goal registration a repo-side change could break.

Confidence: **high** on the Cursor, Devin, Pi, OpenCode and Hermes rows (adapter file, registration
line, and identity source all read). **Low-moderate on Claude and Codex**: the repo's own evidence for
those two is a dated operator confirmation plus a parity restatement, and the confirming check
(a live host probe of the native goal command) is explicitly out of this lineage's reach. Recorded as
an open question rather than a finding.

## Reflection

Worked: reading the hub's *standard* before its table. The sentence "not called fully supported
unless injection and management bind the same native current-session identity" turned six rows into a
ranked classification instead of a presence list, and made Cursor's and Devin's partiality a stated
property rather than an inference.

Failed: the first search for goal wiring across manifests (`rg -i goal` in `.claude/settings.json`
and `.codex/hooks.json`) returned empty, and it was briefly tempting to read that as "Claude and Codex
have nothing". An empty result from a manifest lookup is evidence about the manifest, not about the
runtime — the goal reach for those two runs through the host and the speckit handover.

Ruled out: recommending a `goal-codex.md` prompt stub as the primary fix. It is a legitimate
cheap fallback and it is listed below, but the honest ordering is: probe the host first, add the stub
only if the host path fails. Recommending the stub first would be building around an unverified
premise.

## Recommended Next Focus

Iteration 5: Agents parity — verify the agents mirrors are actually in sync with the authored source,
not merely present. Name the gate that keeps them in sync and whether it covers every runtime; report
any runtime whose agent files have drifted, with the diff shape. Carry forward what this lineage
already knows: `.claude/agents` holds 13 regular files, `.codex/agents` 12 regular + 1 other,
`.cursor/agents` 12 symlinks, `.devin/agents` 12 nested symlinks, `.pi/agents` 12 regular files,
`.hermes/agents` a whole-dir symlink to `.opencode/agents`, and there are two named checkers
(`check-agent-mirror-sync.cjs --all`, `agent-roster-mirror-check.cjs`).
