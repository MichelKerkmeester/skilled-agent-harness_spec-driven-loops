# Iteration 004 — Q4: graph-metadata Attribution

## Focus
Validate the claim that the ~1437 modified `graph-metadata.json` files are pre-existing working-tree state + operator's maintainer-mode code-index daemon background rescans — NOT produced by the harness.

## Actions Taken
1. Grep'd harness for all `.json` writes and `graph-metadata` references (mjs)
2. Grep'd launcher for `graph-metadata`, `INDEX`, `buildIfNeeded` references (cjs)
3. Traced launcher exit-before-scan path when `acquireOwnerLeaseFile` fails (cjs:850-864)
4. Read launcher MAINTAINER_MODE env-override block (cjs:80-94)
5. Read harness comment about maintainer mode and graph-metadata rewrite intent (mjs:708-711)

## Findings

### F-013: Harness writes NO graph-metadata.json (mjs:20-31, 477, 668)
**File write inventory of the harness:**
- `SUMMARY_TSV` at lines 20-23, written at line 668
- `MEMORY_DAEMON_STDERR_LOG` at lines 24-27
- `CODE_INDEX_DAEMON_STDERR_LOG` at lines 28-31
- `workload.json` at line 477 (scenario 410 only)
- **Zero graph-metadata.json writes anywhere in the harness**

Grep for `graph-metadata` in the harness returns only one hit: the comment at mjs:708-711 that explicitly says a forced INDEX_* full scan **would** rewrite graph-metadata — but the harness intentionally does NOT enable that.

### F-014: Harness child daemon exits BEFORE buildIfNeeded when owner is live (cjs:850-864)
**Launcher exit-before-scan proof:**

```js
// cjs:850
const ownerLeaseResult = acquireOwnerLeaseFile();
// cjs:851
if (!ownerLeaseResult.acquired) {
  // cjs:857
  log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid}...`);
  // cjs:858-863
  await bridgeOrReportLeaseHeld({...}, {...});
  // cjs:864 — RETURNS WITHOUT calling buildIfNeeded
  return;
}
```

`buildIfNeeded(actions)` is called at **cjs:944**, which is **unreachable** when `acquireOwnerLeaseFile()` returns `acquired: false` (live owner held the lease). The harness child daemon exits at cjs:864 **before** ever reaching cjs:944 → **no INDEX scan, no graph-metadata write**.

### F-015: Only the operator's own daemon (maintainer mode) writes graph-metadata.json
**Maintainer mode logic (cjs:80-94):**
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
  // ...
}
```

When the **operator** launches their code-index daemon with `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true` in `.env.local`, these flags force full rescans including `.opencode/skills/*/graph-metadata.json`, `.opencode/specs/*/graph-metadata.json`, etc. This is **independent of the harness** — it runs in the operator's long-lived daemon process.

**Harness explicitly does NOT set maintainer mode (mjs:708-711):**
```js
// Maintainer mode is intentionally NOT enabled: a forced INDEX_* full scan
// would rewrite graph-metadata across the tree.
```

The harness passes `SPECKIT_LAUNCHER_BRIDGE_DISABLED: '1'` (mjs:697, 719) but never sets `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true`.

### F-016: Adversarial path — harness indirect triggering is implausible
Could the harness's file writes under `_sandbox` or the packet directory **indirectly** trigger the operator daemon's graph-metadata writes?

- The operator daemon's INDEX scan targets `.opencode/skills/`, `.opencode/specs/`, `.opencode/agents/`, `.opencode/commands/`, `.opencode/plugins/` — **NOT** `_sandbox/`
- The harness writes workload.json at `_sandbox/.../410/workload.json` — outside the daemon's scan scope
- The harness writes SUMMARY_TSV at `SANDBOX_EVIDENCE_DIR/...run-2026-05-14-shared-daemon.summary.tsv` — also outside scan scope
- The operator daemon scans only the skill-owned directories listed above; it does not recursively scan arbitrary user directories

**Attribution chain for ~1437 modified graph-metadata.json files:**
1. Pre-existing modified working-tree files (unrelated to any stress run)
2. Operator's own maintainer-mode daemon background rescans (independent of harness)
3. NOT the harness (child exits before scan, maintainer mode OFF in harness env)

### F-017: Strict single-writer enforcement means the harness child can never scan while operator owns lease (cjs:848-849)
```js
const strictSingleWriter = !isStrictModeDisabled(process.env.MK_CODE_INDEX_STRICT_SINGLE_WRITER);
if (strictSingleWriter) {
  const ownerLeaseResult = acquireOwnerLeaseFile();
  if (!ownerLeaseResult.acquired) {
    // ... live owner detected ... return BEFORE buildIfNeeded
    return;
  }
}
```

The `strictSingleWriter` flag defaults to true. When operator daemon holds the owner lease, `acquireOwnerLeaseFile()` returns `acquired: false` at cjs:850-354, and the child exits at cjs:864. The child daemon **never** becomes a scanning entity under the harness's process tree.

## Questions Answered

| Question | Answer |
|---|---|
| Q4a: Does harness directly write graph-metadata.json? | **NO** — zero graph-metadata.json writes in harness file |
| Q4b: Does harness child daemon reach scan when operator is live? | **NO** — exits at cjs:864 before buildIfNeeded (cjs:944) |
| Q4c: Confirm harness child cannot scan in interactive session? | **CONFIRMED** — child exits via cjs:864 return, before any INDEX scan |
| Q4d: What DOES write graph-metadata.json across the tree? | **Operator's own maintainer-mode daemon** with SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true; harness env does NOT set this |
| Q4e: Any path where harness indirectly triggers operator graph-metadata writes? | **IMPLAUSIBLE** — harness writes only to _sandbox/ which is outside INDEX scan scope; operator daemon only scans .opencode/{skills,specs,agents,commands,plugins} |

## Questions Remaining
- Q5: Is the `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true` leak genuinely sidestepped by skip-not-fail (operator never needs to run harness with maintainer mode ON), or merely hidden (operator could accidentally set it and corrupt evidence)?

## Next Focus
Q5: Investigate whether the maintainer-mode leak (F-015's inverse — operator accidentally running harness with MAINTAINER_MODE=true) is a genuine risk or theoretically impossible given the harness's env construction.
