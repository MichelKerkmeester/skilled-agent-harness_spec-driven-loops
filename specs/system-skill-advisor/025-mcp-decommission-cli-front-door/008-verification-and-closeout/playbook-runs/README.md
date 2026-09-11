---
title: "Manual testing playbook: four-runtime verification run"
description: "All 47 advisor playbook scenarios run across four runtimes after the MCP decommission, with every reported failure traced to its cause."
trigger_phrases:
  - "playbook verification run"
  - "advisor post-decommission verification"
importance_tier: "important"
contextType: "reference"
---
# Manual testing playbook: four-runtime verification run

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> The question this run answers: did removing the advisor's MCP transport degrade
> anything it automates? No. Every failure reported below traces to a stale
> scenario, an invocation error, a sandbox limit, or a defect older than the
> packet. None traces to the decommission.

---

## 1. WHAT RAN

47 scenarios, split so no two runtimes covered the same file.

| Runtime | Model | Scenarios | Reported |
|---|---|---|---|
| Claude | Haiku | 7 hooks-and-plugin, operator-daemon-state | 5 pass, 2 operator-only blocked |
| cli-pi | DeepSeek V4.1 Flash | 15 native-CLI-tools, auto-update-daemon | 9 pass, 2 partial, 4 fail |
| cli-opencode | DeepSeek V4.1 Flash | 9 compat-and-disable, python-compat | 8 of 9 matched; 6 now pass where stored evidence said BLOCKED or FAIL |
| cli-codex | GPT-5.6 LUNA | 16 scorer-fusion, auto-indexing, lifecycle-routing | 3 pass, 10 fail, 23 blocked |

---

## 2. DELIVERY PATHS, VERIFIED DIRECTLY

Six ways the advisor reaches a session. All six work.

| Path | Evidence |
|---|---|
| Claude, Codex, Devin, Cursor adapters | byte-identical live brief for the same prompt |
| OpenCode plugin | 27 of 27 of its own tests pass |
| Pi extension | in-process import resolves into `runtime/` and loads its handlers |
| Registrations | all 15 hook paths named by the four runtime configs exist on disk |

A registration pointing at a moved file would leave an adapter correct and never
fired, which is why the last row matters as much as the first.

---

## 3. EVERY REPORTED FAILURE, TRACED

| Reported | Cause | Disposition |
|---|---|---|
| Parity baseline 0.7897 vs 0.805 | The known scorer parity pair | Pre-existing; fails identically in an untouched checkout |
| Trust state stays `stale` after reindex | Specific to the disposable `/tmp` workspaces the run used | Does not reproduce live: freshness live, trustState live |
| Shadow sink refuses its documented path | Containment compared a resolved path against an already-canonical root | **Fixed.** Both sides canonicalized |
| Rebuild fails on a corrupt database | Only while a daemon holds the file; SQLite cannot replace an open file | **Scenario fixed** to state the precondition; the recovery path itself works |
| `absent` envelope unreachable | Scenario contract predates the front door | **Scenario fixed** to the shipped behaviour |
| Absent surfaces as `trustState` not `freshness` | Both are present: `freshness: "absent"` and `trustState.state: "absent"` | Refuted; the scenario was right |
| Regression dataset 47 cases, not 50 | Dataset held 47 before the packet began | **Scenario fixed**; not a regression |
| `topK` ignored, attribution absent | Passed flat; the schema nests them under `options` | Refuted: nested, `topK: 1` returns 1 with both fields |
| 23 scenarios blocked under cli-codex | Its sandbox denies the unix socket with `listen EPERM` | Environment limit; it cannot start a daemon at all |

---

## 4. WHAT THE RUN FOUND THAT WAS REAL

Three defects, all older than the packet, all now fixed:

1. **The shadow sink refused paths inside its own workspace.** `process.cwd()`
   returns a path with symlinks resolved, so a workspace under `/tmp` on macOS
   canonicalized on one side only and the containment check compared
   `/private/tmp/...` against `/tmp/...`. Proven both ways: the old comparison
   refuses the path, the new one accepts it.
2. **21 stress suites ran in no suite at all.** No script and no pattern selected
   them. They are now reachable behind an opt-in flag that replaces the default
   set rather than adding to it, because they churn the daemon and its lease and
   fail the ordinary suites on shared state otherwise. 63 of 64 pass.
3. **Two scenario contracts and one fixture count no longer matched the runtime.**

---

## 5. A NOTE ON READING THESE RESULTS

The default suite reported 13 failures at one point during this work. Eight were
a stale build: editing the package's config staled its `dist`, and the freshness
guard returned exit 69 rather than letting a stale binary answer. After a
rebuild the count returned to the known 5. A failing number is worth one rebuild
before it is worth a diagnosis.
