---
title: "Review Report: epic closeout commits"
description: "Five-iteration DeepSeek deep review of commits 77f14f88d0..d04df31790. No P0 or P1. Four P2 findings hold on a rerun; three get their own fix phase and the fourth is cleared by this phase's commit."
trigger_phrases:
  - "closeout deep review report"
importance_tier: "normal"
contextType: "review"
---
# Review Report: epic closeout commits

## 1. Verdict

**PASS with advisories.** No reviewed commit breaks what it claims to fix, and every regression gate is green. Four P2 findings hold on a rerun. Two predate the range but sit in lines the range rewrote, so they are fixed here rather than handed on.

| Severity | Found by the lineage | Confirmed on rerun |
|----------|---------------------:|-------------------:|
| P0 | 0 | 0 |
| P1 | 0 | 0 |
| P2 | 4 | 4 |

## 2. How It Ran

- `/deep:review :auto`, `--max-iterations=5 --stop-policy=max-iterations`, executor cli-pi `deepseek-v4.1-flash` at `max` on llmgateway (DevPass). The run went through the workflow's fan-out step with one lineage, `review/lineages/dsflash-llmgw`, as the 013 remediation review did. It ran 11:11Z to 11:26Z, 5 iteration records, every one with stop reason `maxIterationsReached` at the end, `fanout-merge.cjs` verdict PASS, containment advisory 0. DevPass never hit its limit, so there was no Cline Pass switch.
- Iterations covered correctness, security, traceability, maintainability, then a replay pass that re-read every finding at its line.
- Each finding was treated as a hypothesis. The synthesizer reran the probe below before keeping it.

## 3. Confirmed Findings

### P2-1. A dispatch inside a later shell wrapper classifies as none

- **Where**: `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:326`, `shellPayload`, used by `inspectDispatch`. Commit `8642195b24` rewrote these lines; the first-match-only behavior predates it.
- **Evidence**: `inspectDispatch` on `bash -c 'true' ; bash -c "devin -p task </dev/null"` returns `{"kind":"none"}`. The same two wrappers in the other order return `{"kind":"direct","executor":"cli-devin"}`. The Pi guard returns early on `none` (`.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:236`).
- **Fix phase**: `007-dispatch-wrapper-scan`. Read every wrapper payload, not only the first.

### P2-2. The workspace surface hint treats any `.skilled` path component as the hub

- **Where**: `.opencode/plugins/system-skill-advisor.js:689`. Commit `e3a67a5c58`.
- **Evidence**: `detectWorkspaceSurface` called on a scratch folder `.../scratchpad/r5-f2/.skilled/demo`, outside this repository, returns `OPENCODE`. The canonical rule in `.skilled/skills/sk-code/shared/references/stack-detection.md` §2 holds OPENCODE only inside the hub's own `.skilled/` directory.
- **Fix phase**: `008-surface-hint-hub-root`. Compare against the hub's own `.skilled` directory.

### P2-3. The phase's derived artifacts were stale while the review ran

- **Where**: `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and this phase's `graph-metadata.json`.
- **Evidence**: `generate-trigger-index.mjs --check` printed `stale documents : 1`, this phase's `goal.md`, exit 1.
- **Resolution**: not a defect in the range. The phase commit regenerates the index and the metadata, and the final gate reruns `--check`.

### P2-4. The strict missing-config failure is headlined as state-log corruption

- **Where**: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:592`, `createCorruptionError`. Commit `d3ccf503e1` made a missing config reach it.
- **Evidence**: reducing a scratch review folder that holds only a state log prints `parseJsonl detected 1 corrupt line(s) in .../deep-review-state-and-deltas` and `... to ignore corruption`, while the only warning is `deep-review-config.json: config file is missing; reduced on default settings`. Exit 2.
- **Fix phase**: `009-reducer-config-message`. Name the missing config in the headline when it is a warning.

## 4. Refuted or Clean

| Candidate | Result |
|-----------|--------|
| Ephemeral labels in code comments added by the range | Clean. A grep of every added code line in the range for spec paths, phase numbers and ids finds none |
| Served compiled-route copies drift from their authored files | Clean. `compiled-route-sync.cjs --check` prints `all 55 served copies match their authored files` |
| A hub canary regresses | Clean. `all-canaries.cjs` prints `all hubs failures 0` |
| Deep command contracts drift | Clean. `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3` |
| The guard misses shapes it cannot prove, such as a variable in command position | Not a finding. The guard's contract reads an unprovable shape as no dispatch; only P2-1, a provable shape, is kept |

## 5. Regression Gates, Rerun by the Synthesizer

| Gate | Result |
|------|--------|
| `node .skilled/bin/compiled-route-sync.cjs --check` | `all 7 hubs resolve`, `all 55 served copies match their authored files` |
| `node .skilled/bin/compiled-route-guard.cjs` | `All hubs fresh or excused` |
| `all-canaries.cjs` | `all hubs failures 0` |
| `check-contract-drift.cjs` | `[CONTRACT DRIFT] OK commands=3` |
