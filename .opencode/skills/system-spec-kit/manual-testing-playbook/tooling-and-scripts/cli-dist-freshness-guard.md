---
title: "429 -- CLI Dist-Freshness Guard Trip"
description: "Manual check that a CLI shim refuses a stale dist entrypoint with exit 69 and a rebuild instruction, that the per-system dev-override env restores pass-through, and that the trip is fully reversible via content restore."
version: 4.0.0.0
id: tooling-and-scripts-cli-dist-freshness-guard
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 429 -- CLI Dist-Freshness Guard Trip

## 1. OVERVIEW


A SHA256 content hash over the watched source files is written lazily into a small cache file next to the dist entry (e.g. `dist/.dist-freshness-<package>-<suffix>.json`) purely as a same-session performance short-circuit: if a later check finds the same content hash already cached, it reports fresh without re-checking mtime at all. This cache is not pre-warmed by any build script -- it is written only by the runtime check itself, and only on a fresh pass -- so a clean checkout or the first check against a given source state always falls through to the authoritative mtime comparison. One consequence worth knowing (directly verified): a bare `touch` (mtime bump, no content change) does NOT re-trip the guard once a matching cache entry already exists for that exact content, but the identical `touch` DOES trip the guard when no matching cache entry exists yet, because mtime alone decides staleness in that case.

The test trips the guard reversibly: it backs up the source file, appends a content change so it is genuinely newer than the dist entry, observes the refusal and the override, then restores the exact original content — no rebuild needed and no lasting host impact. If the restored run still refuses (no matching cache entry for the original content on this host), `touch` the dist entry to clear it without rebuilding. The development override `SYSTEM_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1` turns the refusal into pass-through. The `spec-memory` and `code-index` shims that once shared this guard were removed with their servers, so `skill-advisor.cjs` is the only CLI consumer left.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the stale-dist refusal (exit 69), the dev-override pass-through, and clean restoration.
- Real user request: `If I edit the CLI source and forget to rebuild, will the shim run the old build behind my back?`
- Prompt: `Trip the skill-advisor dist-freshness guard reversibly, confirm exit 69 plus the rebuild message, confirm the dev override, then restore.`
- Expected execution process: Back up source, append a content change, run `list-tools` (refusal), rerun with the override env (pass), restore exact content, rerun clean (pass).
- Expected signals: Exit 69 with `dist is stale` on the tripped run; exit 0 under the override; exit 0 after restore.
- Desired user-visible outcome: Stale builds are loudly refused with the exact rebuild command, never silently executed.
- Pass/fail: PASS only when all three phases behave as expected and the source content is restored byte-exact.

---

## 3. TEST EXECUTION

### Prompt

```text
Trip the skill-advisor dist-freshness guard reversibly, confirm exit 69 plus the rebuild message, confirm the dev override, then restore.
```

### Commands

```bash
SRC=.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts
BAK=$(mktemp); cp "$SRC" "$BAK"                                  # exact content backup
printf '\n// freshness probe: content change to trip the hash gate (reverted below)\n' >> "$SRC"

node .opencode/bin/skill-advisor.cjs list-tools --format json >/dev/null; echo "tripped exit=$?"
SYSTEM_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1 node .opencode/bin/skill-advisor.cjs list-tools --format json >/dev/null; echo "override exit=$?"

cp "$BAK" "$SRC"; rm -f "$BAK"                                   # restore exact content (hash matches again)
node .opencode/bin/skill-advisor.cjs list-tools --format json >/dev/null; echo "restored exit=$?"
```


### Expected

- `tripped exit=69` with a stderr `dist is stale` line naming the exact rebuild command for the advisor package
- `override exit=0`.
- `restored exit=0` with no rebuild having run.


### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file the run reads or writes.

### Pass / Fail

- **Pass**: All three phases behave as expected and the source content is restored byte-exact.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

A restored run that still exits 69 means the restore was not byte-exact — confirm `git diff` on the source file is empty — or another tracked source in the advisor's watched set genuinely changed and is newer than the compiled dist output; rebuild instead of restoring. If the diff is clean but the restored run still refuses, the on-disk hash cache next to the dist entry has no matching entry for the restored content yet; `touch` the dist entry (e.g. `dist/skill-advisor-cli.js`) so its mtime is newer than the restored source and re-run — no rebuild required. An untripped first run means the content append did not land (source unchanged) or the override env leaked into the shell.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/tooling-and-scripts/dist-freshness-enforcement.md` | Feature-catalog source describing the shim guards |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs` | Shared `checkPackageFreshness()` module: mtime comparison, lazy same-session hash cache, `DIST_PACKAGES` registry (7 watched packages) |
| `.opencode/bin/skill-advisor.cjs` | `ensureFreshDist` guard, exit 69, `SYSTEM_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE` |
| `.opencode/bin/skill-advisor.cjs` | Same guard for skill-advisor, `SYSTEM_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE` |

---

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 429
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/cli-dist-freshness-guard.md`
