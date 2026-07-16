# Iteration 003 — Q3: TSV Reproducibility

## Focus
Does the evidence TSV reproducibly show `runner:mk-spec-memory SKIP` / `runner:mk-code-index SKIP` with the owning pids and a stable, reproducible explanation? Distinguish "reproducible structure" from "reproducible pid value".

## Actions Taken
1. Read `writeSummary` function (run-substrate-stress-harness.mjs:660-677) — TSV write determinism and EPERM fallback
2. Read diagnostic row template for SKIP path with live owner (mjs:398-404)
3. Read `liveOwnerForService` (mjs:339-365) — pid source and stability
4. Read evidence TSV (run-2026-05-14-shared-daemon.summary.tsv) — actual row contents

## Findings

### 1. writeSummary is deterministic given the same rows (mjs:660-666)
```
function writeSummary(rows) {
  const header = 'scenario\tverdict\tkey_metric\tdetail\n';
  const body = rows
    .map((row) => [row.scenario, row.verdict, row.key_metric, row.detail]
      .map((value) => String(value).replace(/\t/g, ' ').replace(/\n/g, ' '))
      .join('\t'))
    .join('\n');
  try {
    fs.writeFileSync(SUMMARY_TSV, `${header}${body}\n`);
```
- Tab-joined 4-field rows (scenario, verdict, key_metric, detail)
- Each field has embedded tabs/newlines replaced with spaces via `.replace(/\t/g, ' ').replace(/\n/g, ' ')` — so `detail` is sanitized before joining
- Given identical row objects, TSV output is byte-for-byte identical
- **VERDICT: DETERMINISTIC per input**

### 2. SKIP diagnostic row template is fully structured (mjs:398-404)
```js
const diagnostic = liveOwner
  ? {
      scenario: `runner:${name}`,
      verdict: 'SKIP',
      key_metric: `${name} owned by live daemon pid ${liveOwner.ownerPid}`,
      detail: `Connection skipped: a live single-writer owner (pid ${liveOwner.ownerPid}) holds the lease and bridging is disabled, so the harness cannot spawn a dedicated child. Expected during an interactive session; stop operator daemons for a fully hermetic exercise. Underlying connect error: ${baseDetail}`,
    }
```
- `scenario` = `runner:mk-spec-memory` or `runner:mk-code-index` — deterministic string
- `verdict` = `SKIP` — constant
- `key_metric` = `${name} owned by live daemon pid ${liveOwner.ownerPid}` — embeds the pid
- `detail` = structured explanation template with pid interpolated twice, then `baseDetail` (the connection error message)
- **VERDICT: STRUCTURE IS REPRODUCIBLE; pid VALUE is environment-dependent**

### 3. Evidence TSV confirms the template (TSV lines 2-3)
```
runner:mk-spec-memory	SKIP	mk-spec-memory owned by live daemon pid 57747	Connection skipped: a live single-writer owner (pid 57747) holds the lease...
runner:mk-code-index	SKIP	mk-code-index owned by live daemon pid 69226	Connection skipped: a live single-writer owner (pid 69226) holds the lease...
```
- Both rows follow the template exactly
- pids (57747, 69226) differ — they are session-specific owner pids
- **VERDICT: TSV CONFIRMS reproducible template application with session-specific pids**

### 4. EPERM-locked TSV fallback is a reproducibility HAZARD (mjs:667-676)
```js
  } catch (error) {
    const code = error && typeof error === 'object' && 'code' in error ? error.code : null;
    if (code === 'EPERM' && fs.existsSync(SUMMARY_TSV)) {
      console.warn(`[substrate-stress-harness] summary TSV is locked; preserving existing evidence at ${SUMMARY_TSV}`);
      return;  // ← RETURNS without writing; existing file preserved
    }
    throw error;
  }
```
- When TSV is locked (EPERM), harness PRESERVES existing file and warns
- If the existing file contains pids from a PRIOR session (e.g., pids 48700/57747 from yesterday), and the current run's pids are different (e.g., 51234/60123), the stale pids remain visible in the TSV
- A subsequent analyst reading the TSV would see wrong pids
- **VERDICT: STALE PID HAZARD CONFIRMED — TSV can show pids from a prior run when EPERM lock is encountered**

### 5. liveOwnerForService pid stability within a run (mjs:339-365)
```js
function liveOwnerForService(name) {
  let leasePath;
  let pidFields;
  if (name === 'mk-spec-memory') {
    leasePath = path.join(MEMORY_SERVER_ROOT, 'database', '.mk-spec-memory-launcher.json');
    pidFields = ['ownerPid', 'pid'];
  } else if (name === 'mk-code-index') {
    leasePath = path.join(REPO_ROOT, '.opencode/skills/system-code-graph/mcp_server/database', '.code-graph-owner.json');
    pidFields = ['ownerPid'];
  }
  try {
    const lease = JSON.parse(fs.readFileSync(leasePath, 'utf8'));
    for (const field of pidFields) {
      const pid = lease?.[field];
      if (isPidAlive(pid)) return { ownerPid: pid, leasePath };
    }
  } catch { /* treat as no live owner */ }
  return null;
}
```
- Reads on-disk lease file at moment of connection failure
- Returns the FIRST alive pid found from the pidFields array
- Within a single run, if the lease is stable (same owner holds across the run), the pid is stable
- **VERDICT: Within a run, pid is stable IF the same operator daemon holds the lease throughout**

### 6. pid values are session-dependent, not reproducible across sessions
- TSV line 2 shows `mk-spec-memory owned by live daemon pid 57747`
- TSV line 3 shows `mk-code-index owned by live daemon pid 69226`
- Prior iterations observed different pids (mem 57747, code-index 48700) — these changed
- **VERDICT: pid VALUES are NOT reproducible across sessions; row STRUCTURE is reproducible**

## Questions Answered
| Question | Answer |
|---|---|
| Is TSV write deterministic? | YES, given same row objects — `.replace(/\t/g,' ').replace(/\n/g,' ')` sanitizes fields, tab-joins, writes deterministically |
| Does SKIP key_metric embed owning pid? | YES — `${name} owned by live daemon pid ${liveOwner.ownerPid}` at mjs:402 |
| Does detail embed reproducible explanation? | YES — template at mjs:403 includes pid, explains live-owner skip rationale |
| EPERM fallback — stale pid hazard? | YES — returns without writing when locked, preserving prior-run pids |
| Is owning pid stable within a run? | YES, if the same daemon holds lease throughout the run |
| Reproducible structure vs reproducible pid value? | STRUCTURE reproducible within session; pid VALUE is session/environment-dependent |

## Questions Remaining
- Q4: graph-metadata churn during substrate stress runs — does the harness (with maintainer mode OFF) rewrite graph-metadata?
- Q5: maintainer-mode leak — does `run-substrate-stress-harness.mjs` ever set SPECKIT_MAINTAINER_MODE=1 and cause ODK/embedding-write side effects?

## Next Focus
Q4: graph-metadata churn. Investigate whether scenario execution (particularly code_graph_context scenarios) rewrites `.opencode/skills/system-code-graph/mcp_server/database/graph-metadata.json` when maintainer mode is OFF but the daemon is connected. Confirm from the daemon launch env and the scenario playbook files.
