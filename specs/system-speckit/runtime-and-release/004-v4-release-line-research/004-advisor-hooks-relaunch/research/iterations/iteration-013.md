# Iteration 13 — Least-Read Release Notes, Advisor Respawn, Doctor Tool Enum

## Focus

The four least-read release notes for this cluster: `v4.0.0.9`, `v4.0.0.4`, `v4.0.0.3`, `v4.0.0.11`. Three claims to test against the current tree:

1. `v4.0.0.3` "A Rebuilt Advisor Restarts Itself" — the respawn switch and its name.
2. `v4.0.0.3` "Hook Switches and Message Rules in One Place" — "a switch is read from the environment first and then from `.skilled/hooks/hook-flags.env`".
3. `v4.0.0.11` `/doctor:git setup` — "eleven read-only checks", "all seven AI tools", and "counts an AI tool hook only when the script it runs exists".

Registry was checked first: `hook-flags` had 27 hits and `git setup` 1, but **`respawn` had 0** — that surface was unclaimed.

## Actions Taken

- Read all four release notes in full (`v4.0.0.3` via a cluster-term filter, 353 lines).
- Grepped the findings registry for `RESPAWN`, `hook-flags`, `git setup`, `injection`, `ask-surface` to avoid repeating findings.
- Traced `SPECKIT_BRIDGE_RESPAWN_DISABLED` through the launcher, the root `.env.example` and the daemon lease contract.
- Read `hook-flags.cjs` lines 188–275 — the resolver body, not its header comment.
- Enumerated the doctor's check table and its tool enum, then **ran** `--tool hermes` and `--tool dsh` for observed behaviour.
- Ran `agents-md-manifest.cjs --check` against the working tree.
- Checked the Pi ask-surface adapter's import resolution against its shipped `.pi/extensions/` copy.

## Findings

### f-iter013-001 — P1, bug: the shipped AGENTS.md manifest is stale and still carries Hermes doctrine

`agents-md-manifest.cjs --check` **fails at HEAD** (exit 1):

```
[agents-md-manifest] FAIL: the manifest's derived key does not match AGENTS.md
[agents-md-manifest]   history: the recorded body 865f058927ed is no longer released
[agents-md-manifest] Run: node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --write
```

The current `AGENTS.md` §9 routes to `.dsh/agents/`. The committed manifest's §9 body still carries `.hermes/agents/`, "Hermes is the exception worth knowing", `HERMES_AGENT_PERSONA` and the `cli-hermes` packet [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:1068]. Across the manifest, `Hermes` appears 3 times, `.hermes` once and `.dsh` once — the two models coexist inside one artifact.

**This closes iteration 6's question.** The manifest body is written **verbatim**: the embed step joins `manifest.derived.sections[entry.id].body` with no Hermes→dsh transform [SOURCE: .skilled/commands/doctor/scripts/agents-md-embed.cjs:667]. So a vendored repository that regenerates from the shipped manifest receives the pre-`v4.0.2.0` Hermes doctrine, undoing the removal in the artifact it is told to treat as canon.

Introduced by: `v4.0.2.0` (the Hermes removal edited `AGENTS.md` without regenerating the manifest). Confidence: high — the check's own exit status is the evidence. Verify: `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check`.

### f-iter013-002 — P2, drift: `/doctor:git setup`'s tool enum is `dsh`, the release note says Hermes

`v4.0.0.11` states `--tool` "names Claude, Codex, Devin, Cursor, OpenCode, Pi or Hermes". The enum is `['claude', 'codex', 'devin', 'cursor', 'opencode', 'pi', 'dsh']` [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:64], and the usage string repeats it [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:62]. Observed:

```
$ node .skilled/commands/doctor/scripts/git-setup-check.cjs --tool hermes --repo .
git-setup-check: unknown tool: hermes
exit=2
```

Note the measurement trap: a first run piped through `tail` reported `EXIT=0`, because that was `tail`'s status. The unpiped run gives the real **2**. The changelog is a frozen record and was accurate at `v4.0.0.11`; live docs under `.skilled/commands/doctor/` no longer mention Hermes, so only the historical note is stale. Severity stays P2 for that reason. Confidence: high. Verify: `node .skilled/commands/doctor/scripts/git-setup-check.cjs --tool hermes --repo . ; echo $?`.

**The rest of the v4.0.0.11 claim set holds.** Exactly eleven checks: `install, hooks, trust, gates, standards, allowlist, worktrees, commit-id, advisory-rules, suppression, ai-tool-hooks` [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:1572] through [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:1582]. The "hook counts only when its script exists" clause is real [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:1096]. A `--tool dsh` run returns `STATUS=OK checks=11`.

### f-iter013-003 — P2, bug: the Pi ask-surface adapter is authored destination-relative, unlike every sibling

The Pi source adapter imports through a path that only resolves after it is copied to `.pi/extensions/`:

```ts
import askSurfaceCore from '../../.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs';
import { isHookEnabled } from '../../.skilled/hooks/shared/hook-flags.mjs';
```

[SOURCE: .skilled/hooks/ask-surface-guard/pi/ask-surface-guard.ts:12]

From its own directory `../../` is `.skilled/hooks/`, so the specifier resolves to `.skilled/hooks/.skilled/hooks/shared/hook-flags.mjs`:

```
$ ls -d .skilled/hooks/ask-surface-guard/pi/../../.skilled
ls: No such file or directory
```

The shipped copy carries the identical specifiers and resolves correctly, because from `.pi/extensions/` `../../` is the repository root [SOURCE: .pi/extensions/ask-surface-guard.ts:12]. The Claude and dsh siblings use the location-relative form instead — `require('../../shared/hook-flags.cjs')` [SOURCE: .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs:20] and `'../../shared/hook-flags.mjs'` [SOURCE: .skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs:9].

So two conventions coexist in one hook family: two adapters are importable in place, one is not. Harm is a mirror-tooling friction — the source copy cannot be imported or tested where it lives, and an edit must respect that only the destination form is legal. Confidence: high on the resolution fact, medium on harm; what would raise it is any test that imports the source file in place.

### f-iter013-004 — P2, operator UX: the live `hook-flags.env` never receives the ask-surface switch

The resolver's default config path is the **live** file, not the example [SOURCE: .skilled/hooks/shared/hook-flags.cjs:124]. The live file carries no `ASK_SURFACE` line at all; the switch exists only in the template [SOURCE: .skilled/hooks/hook-flags.env.example:26]. The switch is real — the ask-surface guard consumes the resolver through `isHookEnabled(core.CONCERN)` [SOURCE: .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs:111].

This closes the question carried since iteration 5: the disabled-switch reachability gap is **distribution**, not dead config. `hook-flags.env` is gitignored and copied once, so every switch added to the template after a user's copy silently never arrives, and no release note in the tree asks for a re-copy. The persisted config the file header promises therefore under-delivers by one switch, and the operator's only route to it is an exported env var.

The same file shows relaunch is already ON globally while OFF for Claude: `SYSTEM_SESSION_RELAUNCH_ENABLED=1` [SOURCE: .skilled/hooks/hook-flags.env:54] against `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` [SOURCE: .skilled/hooks/hook-flags.env:55] — the copy is three keys richer than the example at that block, which is what a hand-edit looks like, not a template.

## Verified, no finding

**`v4.0.0.3` "Hook Switches" holds.** The environment does win over the file, in the code and not only in the header comment:

```js
const resolve = (key) => {
  const fromEnv = source[key];
  return fromEnv !== undefined ? fromEnv : cfg[key];
};
```

[SOURCE: .skilled/hooks/shared/hook-flags.cjs:216] — a set env key short-circuits the file, including an empty string. Recorded as `inv-iter013-001`.

**`v4.0.0.3` "A Rebuilt Advisor Restarts Itself" holds.** `SPECKIT_BRIDGE_RESPAWN_DISABLED` is read on both launcher gates [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:848] and [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:962], documented in the operator surface [SOURCE: .env.example:120] and in the lease contract [SOURCE: .skilled/skills/system-skill-advisor/references/runtime/daemon-lease-contract.md:53]. No name drift. Recorded as `obs-iter013-002`.

**`v4.0.0.4` is verified-empty for this cluster.** Its four changes — series-parent packets, Devin rules, bundled lockfile patches, removed flags — touch no advisor, hook, relaunch or adapter claim.

**`v4.0.0.9` carries one routing claim not assessed here** ("every mode alias is lowercase and listed among its router keywords", "the doctor compares only `description.json`, `hub-router.json` and `mode-registry.json` with `SKILL.md`"). It belongs to the compiled-routing surface, not this cluster's runtime path. Not marked verified-empty.

## SCOPE VIOLATIONS

None. Every command run was read-only against the repository: two greps, one `sed`, three `node` invocations of doctor scripts, and `ls`. The `agents-md-manifest.cjs --check` run was the read-only branch of a `--check | --write` tool and wrote nothing. No `>` redirect targeted a repository file.

## Questions Answered

None of the three strategy key questions are fully answered; partial progress is recorded below rather than ticked.

## Questions Remaining

- **Advisor transport (v4.0.0.0, v4.0.0.16)** — the respawn half is now verified. Degraded local scoring and the shared-daemon lease/race remain unexercised, **eight** iterations carried. Still the largest untested claim in the run.
- **Does any CI gate run `agents-md-manifest.cjs --check`?** It exits 1 at HEAD. A red consistency check that nobody runs is a governance gap, not a code gap, and that discriminates f-iter013-001's true severity.
- **UX and extension proper** — reading the advisor brief and recovering history after compaction. f-iter013-004 now covers the relaunch/ask-surface *enablement* surface only; the other two blocks are untouched, thirteenth iteration.
- **Advisor follow-ups from generation 1** — the sk-doc `sk-create-skill-parent` shared-packet entry and duplicate `package_skill.py`. Untouched, thirteenth iteration.
- Carried unchanged: the hook git-call time limit; `hook-flags.sh` vs `hook-flags.cjs` differential; which non-shared adapters import the flag module; `leaf-scopes.json` optionality; the live Claude turn-end hang; the live Codex compaction; which layer drops the advisor redirect.
- **New:** `v4.0.0.9`'s routing claim (mode aliases lowercase and listed among router keywords) — one generator or doctor run settles it.

## Next Focus

Close f-iter013-001's governance half: find whether `agents-md-manifest.cjs --check` is wired into any CI job. Then take the UX question head-on — the advisor brief reader path and history recovery after compaction, the two blocks that have survived thirteen iterations untouched.
