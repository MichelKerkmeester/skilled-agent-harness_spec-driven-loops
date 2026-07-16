# Iteration 005 — Q5: SPECKIT_CODE_GRAPH_MAINTAINER_MODE Leak — Sidestepped vs. Hidden

## Focus
Determine whether the `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true` env leak from `.env.local` is genuinely **sidestepped** by the skip-not-fail fix (operator never runs harness when they'd need maintainer mode), or merely **hidden** by accident (interactive sessions never start child, but clean env would trigger it).

## Actions Taken
1. Confirmed `.env.local` sets `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true` and the launcher loads it (cjs:65-71)
2. Traced whether launcher scrubs this var before child spawn (cjs:645-652 `buildChildEnv`)
3. Traced whether harness `buildDaemonEnv` scrubs it (mjs:57-64)
4. Confirmed clean-env vs. interactive-session child-exit paths
5. Traced forced INDEX scan path in clean env (cjs:944 `buildIfNeeded`)
6. Quantified blast radius of forced INDEX scan in clean env

## Findings

### Q5-1: CONFIRMED — `.env.local` loads and forces INDEX_* (`.env.local:4`, cjs:65-94)

`.env.local` (line 4): `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true`

The launcher loads `.env.local` at cjs:65-71 BEFORE spawning any child:
```js
// cjs:65-71
for (const fname of ['.env.local', '.env']) {
  const p = path.join(root, fname);
  if (fs.existsSync(p)) {
    const n = loadEnvFile(p);
    // ...
  }
}
```

And at cjs:80-94, the maintainer-mode block forces all 5 INDEX_* keys:
```js
if (process.env.SPECKIT_CODE_GRAPH_MAINTAINER_MODE === 'true') {
  const INDEX_KEYS = [
    'SPECKIT_CODE_GRAPH_INDEX_SKILLS',
    'SPECKIT_CODE_GRAPH_INDEX_AGENTS',
    'SPECKIT_CODE_GRAPH_INDEX_COMMANDS',
    'SPECKIT_CODE_GRAPH_INDEX_SPECS',
    'SPECKIT_CODE_GRAPH_INDEX_PLUGINS',
  ];
  for (const key of INDEX_KEYS) {
    process.env[key] = 'true';
  }
}
```

### Q5-2: NEITHER `buildChildEnv` NOR `buildDaemonEnv` SCRUB `SPECKIT_CODE_GRAPH_MAINTAINER_MODE`

**Launcher `buildChildEnv` (cjs:645-652):**
```js
const BLOCKED_CHILD_ENV_RE = /^(NODE_|npm_|NPM_)/;
// ...
function buildChildEnv(extra = {}) {
  const nextEnv = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (BLOCKED_CHILD_ENV_RE.test(key)) continue;  // SPECKIT_* passes
    nextEnv[key] = value;
  }
  return { ...nextEnv, ...extra };
}
```

`SPECKIT_CODE_GRAPH_MAINTAINER_MODE` is NOT matched by `BLOCKED_CHILD_ENV_RE` — it **passes through** to the child daemon.

**Harness `buildDaemonEnv` (mjs:57-64):**
```js
const DAEMON_ENV_DENYLIST = /^(GITHUB_TOKEN|GITLAB_TOKEN|NPM_TOKEN|GH_TOKEN|AWS_|GCP_|GOOGLE_|AZURE_|SLACK_|DISCORD_|TWILIO_|STRIPE_|SSH_|GPG_|GNUPGHOME|PASSWORD|SECRET)/i;

function buildDaemonEnv(extras = {}) {
  const env = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (value === undefined || DAEMON_ENV_DENYLIST.test(key)) continue;
    env[key] = value;
  }
  return { ...env, ...extras };
}
```

`SPECKIT_CODE_GRAPH_MAINTAINER_MODE` is NOT matched by `DAEMON_ENV_DENYLIST` — it **passes through** to the harness-spawned daemon.

**Conclusion**: Both the launcher (cjs:652 `buildChildEnv` used by `launchServer` at cjs:773) and the harness (mjs:63) propagate `SPECKIT_CODE_GRAPH_MAINTAINER_MODE` to their respective child processes. The variable is **NOT scrubbed at any point**.

### Q5-3: INTERACTIVE SESSION — child exits before scan, leak never fires (cjs:850-864, cjs:944)

As established in Q4 (iteration-004 F-014), when the operator daemon is live:
- `acquireOwnerLeaseFile()` returns `acquired: false` at cjs:850-854
- Child exits at **cjs:864** via `return;` — before ever reaching `buildIfNeeded` at **cjs:944**
- No INDEX scan occurs; `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true` has **no effect** in this scenario
- The leak is **effectively sidestepped in interactive sessions**, but only because the child daemon never starts — not because the env var was neutralized

### Q5-4: CLEAN ENV (no operator daemon) — child acquires lease, scan runs with maintainer mode active

When no operator daemon is running (e.g., CI):
- `acquireOwnerLeaseFile()` returns `acquired: true` at cjs:859-870
- `buildIfNeeded(actions)` is reached at **cjs:944**
- With `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true` already set in the launcher's env (from `.env.local` loading at cjs:65-71), the child daemon inherits all 5 `INDEX_* = 'true'` flags
- The child spawns (cjs:771-775) and attempts a **forced full INDEX scan** of `.opencode/{skills,agents,commands,specs,plugins}`
- This rewrites `graph-metadata.json` across the entire skill ecosystem

**The leak is LIVE in clean env** — it is not sidestepped, it is simply not triggered because interactive sessions never reach the scan path.

### Q5-5: ORTHOGONAL — skip-not-fail and maintainer-mode leak are independent issues

The skip-not-fail fix (harness classifying `liveOwner!=null` as SKIP rather than FAIL) addresses **lease contention failure**. The maintainer-mode env leak is **a separate problem**: an accidental env var that causes an unintended full INDEX scan.

skip-not-fail: changes `FAIL → SKIP` when harness child detects live owner.
Maintainer-mode leak: causes unintended full scan when no live owner (clean env).

They operate on **different code paths** and **different failure modes**. Fixing one does not fix the other.

### Q5-6: VERDICT — "merely hidden", not fixed

The maintainer-mode leak is **HIDDEN** in interactive sessions (the only scenario where the harness is normally run), not **SIDESTEPPED** by skip-not-fail. The reasons:

1. The env var is **never scrubbed** — it propagates from `.env.local` → launcher → child daemon
2. In interactive sessions, the child exits at cjs:864 before the env var can cause any effect — the leak is **untriggered**, not neutralized
3. In clean env (CI, no operator daemon), the child **DOES** reach `buildIfNeeded` with `INDEX_*='true'` forced, and the forced scan fires — the leak is **live**
4. skip-not-fail is **orthogonal** — it converts a different failure mode (live-owner contention) from FAIL→SKIP, but does nothing to prevent the maintainer-mode scan in clean env

**Bottom line**: The harness comment at mjs:708-711 acknowledges this: "Maintainer mode is intentionally NOT enabled: a forced INDEX_* full scan would rewrite graph-metadata across the tree." But the harness cannot prevent the launcher from loading `.env.local` and forcing INDEX_* — because the launcher runs as a **separate process** that independently loads `.env.local` at startup (cjs:65-71).

### Q5-7: Blast Radius Quantification (Clean Env)

A forced INDEX_* scan with all 5 flags true (`SPECKIT_CODE_GRAPH_INDEX_SKILLS=true`, `INDEX_AGENTS=true`, `INDEX_COMMANDS=true`, `INDEX_SPECS=true`, `INDEX_PLUGINS=true`) covers:

| Directory | Scope |
|---|---|
| `.opencode/skills/*/` | All skill packages |
| `.opencode/agents/*/` | All agent definitions |
| `.opencode/commands/*/` | All command definitions |
| `.opencode/specs/*/` | All packet spec folders |
| `.opencode/plugins/*/` | All plugin packages |

The operator's maintainer-mode daemon (not the harness) would write `graph-metadata.json` into each of these directories during the forced scan. The ~1437 modified `graph-metadata.json` files observed in prior runs are **attributable to the operator's own daemon's background rescans**, not the harness.

The **clean-env blast radius**: one full INDEX_* scan writes `graph-metadata.json` into every skill, agent, command, spec, and plugin directory — potentially **hundreds of graph-metadata.json files** across the `.opencode/` tree.

## Questions Answered

| Question | Answer |
|---|---|
| Q5a: Does `.env.local` set MAINTAINER_MODE and does launcher load it? | YES — `.env.local:4` sets it; cjs:65-71 loads it |
| Q5b: Does launcher force INDEX_* when MAINTAINER_MODE=true? | YES — cjs:80-94 forces all 5 flags |
| Q5c: Does `buildChildEnv` scrub MAINTAINER_MODE? | NO — cjs:21 BLOCKED_CHILD_ENV_RE only blocks NODE_/npm_/NPM_ |
| Q5d: Does `buildDaemonEnv` scrub MAINTAINER_MODE? | NO — mjs:49 DAEMON_ENV_DENYLIST only blocks token/credential patterns |
| Q5e: Interactive session — does leak fire? | NO — child exits at cjs:864 before scan; effectively sidestepped |
| Q5f: Clean env — does leak fire? | YES — child acquires lease, reaches cjs:944, forced INDEX_* scan fires |
| Q5g: Is skip-not-fail a fix for the leak? | NO — orthogonal; skip-not-fail fixes live-owner contention, not maintainer-mode env |
| Q5h: Verdict: sidestepped or hidden? | HIDDEN — untriggered in interactive sessions, live in clean env |

## Questions Remaining
None — all 5 questions (Q1-Q5) are now resolved.

## Next Focus
This is iteration 5 of 5 (FINAL). All questions are resolved. See Cross-Cutting Verdict below.

## Cross-Cutting Verdict — All 5 Iterations

| Claim | Verdict | Evidence |
|---|---|---|
| Q1: Genuine daemon crashes still FAIL via liveOwnerForService null path | **PROVEN** | F-001, F-002, F-003: null path at mjs:364 catches crashes; PID recycling is only residual risk (F-005) |
| Q2: False-green guard still fires in clean env | **PROVEN** | F-008, F-009, F-010: guard at vitest.ts:79-83 catches all-SKIP false green; only bypass is PID recycling F-005 |
| Q3: TSV structure reproducible; pid values session-dependent; EPERM-locked TSV stale-pid hazard | **PROVEN** | TSV format stable (mjs:661-666); pids are live-lease pids not harness pids; EPERM on locked TSV (mjs:671) is the stale-pid write failure mode |
| Q4: Harness never writes graph-metadata; child exits before scan (cjs:864 before cjs:944); operator daemon is the writer | **PROVEN** | F-013: zero graph-metadata writes in harness; F-014: child exits at cjs:864 before buildIfNeeded at cjs:944; F-015: operator's maintainer-mode daemon writes graph-metadata |
| Q5: SPECKIT_CODE_GRAPH_MAINTAINER_MODE leak is hidden, not fixed; skip-not-fail is orthogonal | **PROVEN** | F-015 inverse: launcher loads `.env.local` and forces INDEX_* (cjs:65-94); neither buildChildEnv (cjs:645) nor buildDaemonEnv (mjs:57) scrub it; interactive sessions sidestep because child exits at cjs:864 (never triggers); clean env triggers full scan at cjs:944; skip-not-fail (live-owner contention FAIL→SKIP) is orthogonal |

**Overall: ALL 5 CLAIMS PROVEN.**

The skip-not-fail fix is effective for its intended purpose (converting live-owner lease contention from FAIL→SKIP in interactive sessions). The maintainer-mode env leak is real but untriggered in normal interactive use — "merely hidden", not fixed, and orthogonal to skip-not-fail. Clean env / CI runs would trigger the leak if the operator's `.env.local` is present.
