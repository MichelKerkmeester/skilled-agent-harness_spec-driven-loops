# Router-reach proposal

## Verdict

**fix**

The target routes to the intended workflow and its declared paths exist, but the current check does not reliably prove what its contract says: the advisor CLI can return a degraded local-scorer response that the script classifies as no-reach, the doctor-level concurrency flag has no documented path into the script, and the numeric presentation entry for router-reach is not displayed. The shared route validator passes despite that menu gap. Evidence: route and assets are present in `.skilled/commands/doctor/_routes.yaml:154-162`; the full sweep returned `RESULT: FAILED` with advisor generation unknown (`doctor-run.log:303-305`); the separate advisor response was degraded and lacked recommendations and trust state (`doctor-run.log:21-34`); the route validator exited 0 but its target-parity check uses accepted-answer rows as its “menu” set (`doctor-run.log:312-343`, `.skilled/commands/doctor/scripts/route-validate.py:161-170`).

## Minimal edits

### 1. Fail closed when the advisor is degraded or lacks live trust metadata

File: `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs`, response parsing in `reaches()` around lines 140-147.

Old:

```js
let data;
try { data = JSON.parse(raw).data; } catch {
  return { error: 'probe returned unparseable JSON' };
}
if (!data) return { error: 'probe returned no data envelope' };
const bar = data.effectiveThresholds ? data.effectiveThresholds.confidenceThreshold : 0.8;
```

New:

```js
let envelope;
try { envelope = JSON.parse(raw); } catch {
  return { error: 'probe returned unparseable JSON' };
}
const data = envelope.data;
if (!data) return { error: 'probe returned no data envelope' };
const trust = data.trustState;
if (envelope.degraded || trust?.state !== 'live' || !Number.isInteger(trust.generation)) {
  return { error: 'advisor response is degraded, not live, or lacks generation' };
}
const bar = data.effectiveThresholds ? data.effectiveThresholds.confidenceThreshold : 0.8;
```

The current CLI response had `degraded: true`, `source: local-scorer`, no recommendations, and no `trustState` (`doctor-run.log:21-34`). The current script only rejects a missing `data` envelope, then treats an empty recommendation set as no-reach and leaves generation unknown (`ci-router-vocabulary-reach.cjs:140-156, 194-206`). The workflow explicitly says a failed advisor probe is `PROBE-ERROR` and fails (`doctor-router-reach.yaml:39-41`); the advisor response schema defines a state and integer generation under `trustState` (`.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:278-284`).

### 2. Wire the already-allowed concurrency flag through the workflow

The route allows `--concurrency=<n>`, and the script accepts `--concurrency N` with a default of 8, but the route only passes `execution_mode` and `hub` and the workflow only mentions adding `--hub` (`_routes.yaml:156-162`; `doctor-router-reach.yaml:60-70, 89`; `ci-router-vocabulary-reach.cjs:33, 173-175`).

In `.skilled/commands/doctor/_routes.yaml:156`:

- Old: `setup_vars: [execution_mode, hub]`
- New: `setup_vars: [execution_mode, hub, concurrency]`

In `.skilled/commands/doctor/assets/doctor-router-reach.yaml`, add this optional input after `hub`:

```yaml
concurrency: "optional probe concurrency; omitted means the script default"
```

At the phase 0 activity around line 89:

- Old: `Execute upstream_assets.diagnostic_script via Bash, adding --hub when the operator named one.`
- New: `Execute upstream_assets.diagnostic_script via Bash, adding --hub <id> when named and --concurrency <n> when supplied; pass each flag and value as separate arguments.`

In the script usage header at line 5:

- Old: `usage: ci-router-vocabulary-reach.cjs [--hub <id>] [--json] [--limit N]`
- New: `usage: ci-router-vocabulary-reach.cjs [--hub <id>] [--concurrency N] [--json] [--limit N]`

### 3. Show router-reach in the numeric startup menu and help

File: `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`.

The accepted-answer table already assigns 12 to runtime-mirrors and 13 to router-reach, but the visible menu ends at 11; the help block also says “Press 1-11, 0, or X” (`doctor-speckit-presentation.txt:9-24, 26-41, 70`).

- Add these menu entries after option 11:
  - `12) Check Runtime Mirrors`
  - `13) Check Router Reach`
- Add help lines:
  - `Runtime agents, commands, prompts or hooks out of sync -> 12 Runtime Mirrors`
  - `A router-declared phrase does not reach its hub -> 13 Router Reach`
- Replace `Press 1-11, 0, or X.` with `Press a listed number, H, 0, or X.`

### 4. Make the route validator inspect the visible startup menu

File: `.skilled/commands/doctor/scripts/route-validate.py`, `parse_presentation_targets()` around lines 161-170.

Old:

```python
menu_targets = set(re.findall(r"target = `([a-z0-9-]+)`", text))
```

New:

```python
startup = re.search(r"What do you want to do\?\s*```text(.*?)```", text, re.DOTALL)
visible_answers = set(re.findall(
    r"^\s*(\d+)\)", startup.group(1) if startup else "", re.MULTILINE
))
answer_targets = re.findall(
    r"^\|\s*`(\d+)`\s*\|\s*target = `([a-z0-9-]+)`\s*\|",
    text,
    re.MULTILINE,
)
menu_targets = {target for number, target in answer_targets if number in visible_answers}
```

The current validator reports J1 passed (`doctor-run.log:339`), while its parser extracts the accepted-answer mapping rather than checking which numeric choices appear in the startup prompt (`route-validate.py:161-170`). This change makes an accepted-but-undisplayed answer fail parity.

## FINDINGS

These are observed diagnostic classifications for the inspected subsystem, not edits to the doctor. The full-fleet run reported 14 wrong-hub and 18 outranked phrases; examples include `jev mcp server` routing to `mcp-code-mode=0.8500`, `full plugin and memory stack` ranking `memory:save` and `system-spec-kit` at `0.9500`, and `notion mcp` ranking `mcp-code-mode` above `mcp-tooling` (`doctor-run.log:43, 45, 66, 303`). The workflow defines wrong-hub and outranked as failures (`doctor-router-reach.yaml:30-33`).

The same run reported 221 no-reach rows, 8 allowed disputes, and 0 probe-error rows (`doctor-run.log:303`). No-reach is reported but does not fail by workflow contract (`doctor-router-reach.yaml:34-35, 112-114`); allowed disputes are explicitly accepted under the allowlist (`doctor-router-reach.yaml:36-38`). Because the advisor response-shape probe returned a degraded local-scorer response, these wrong-hub and outranked classifications are observed fallback-scoring results and are not verified against a live advisor (`doctor-run.log:21-34`).
