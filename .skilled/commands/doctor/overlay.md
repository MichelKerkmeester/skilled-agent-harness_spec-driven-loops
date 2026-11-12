---
description: "Check whether a vendored Skilled tree still carries its overlays, put them back, or re-pin it, after one yes."
argument-hint: "[status|apply|repin] [--json] [--audit] [--root <dir>] [--capture|--adopt <path>|--relayout] [--upstream|--to|--rollback <value>] | list | ?"
allowed-tools: Read, Bash
---
<!-- skill_agent: system-skilled-doctor -->

# /doctor:overlay Router

This command is a thin router. It binds the read-only `status` target or one of the writing `apply` and `repin` targets from `_routes.yaml`, then loads that target's workflow YAML and the presentation contract.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command. Do not copy an overlay byte or touch the overlay lock by hand. The overlay engine owns every classification and every write.

Load the presentation contract before showing anything the operator reads. That contract owns every visible line, from the menu to the closing status.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Route manifest | `.skilled/commands/doctor/_routes.yaml` |
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` |
| Overlay engine | `.skilled/commands/doctor/scripts/overlay-engine.cjs` |

---

## 3. MODE ROUTING

- `_routes.yaml` is the canonical routing and mutation-class manifest, and this command owns the routes whose `command` is `/doctor:overlay`.
- `execution_mode` is always `INTERACTIVE`. No `:auto` or `:confirm` suffix is supported.
- The first positional token of `$ARGUMENTS` is the target. With no token the target is `status`, the route marked `default_target` because it only reads, so `/doctor:overlay` and `/doctor:overlay status` both run it. A bare `/doctor:overlay` never reaches `apply` or `repin`, which write. A menu word from the argument table shows the presentation contract's startup menu instead of binding a target.
- `--json`, `--audit` and `--root <dir>` belong to `status`. `--root <dir>`, `--capture <path>`, `--adopt <path>` and `--relayout` belong to `apply`, which takes at most one of `--capture`, `--adopt` and `--relayout`. `--root <dir>`, `--upstream <dir>`, `--to <commit>` and `--rollback <run-id>` belong to `repin`.
- A `repin` needs both `--upstream <dir>` and `--to <commit>`. `--rollback <run-id>` selects the rollback path and is given alone, or with `--root <dir>` only.
- The engine has no plan mode for `apply`, so the plan is one the engine itself printed: the whole `status` report, or with `--relayout` the `LAYOUT` lines in it, one per source that sits off its layout path. `repin` stages the re-pin on a copy in a temporary folder and shows that report as its plan. The workflow never runs a writing target before the operator has read that report, and never runs a writing target without its yes.
- `--capture <path>` is part of `apply`: it moves one live edit into its overlay source, and it is asked the same way.
- `--adopt <path>` is part of `apply` too: it brings one vendored path no overlay owns under a new manifest entry and then applies, and it is asked the same way.
- `--relayout` is part of `apply` too: it moves each overlay source kept off its layout path onto it, points the manifest and its layout links there, then applies, and it is asked the same way.
- The manifest setting `strictWrites` is off unless the vendoring project sets it. It is never an argument of this command, and the presentation contract describes what it turns on.
- An argument failure stops the run before YAML load, with the presentation contract's wording for each case:
  - an unknown target or an unknown flag
  - a flag another target owns, such as `--audit` given to `apply` or `--upstream` given to `status`
  - a value flag without its value
  - a second positional
  - `--capture` given with `--adopt` or `--relayout`, or `--adopt` given with `--relayout`
  - a `repin` without `--upstream` or `--to`
  - `--rollback` given with `--upstream` or `--to`
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior. The presentation text owns visible wording and layout.

---

## 4. EXECUTION TARGETS

| Target | Workflow |
|--------|----------|
| `status` | `.skilled/commands/doctor/assets/doctor-overlay-status.yaml` |
| `apply` | `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml` |
| `repin` | `.skilled/commands/doctor/assets/doctor-overlay-repin.yaml` |

| Argument | Applies to | Effect |
|----------|------------|--------|
| `--json` | `status` | Print the engine's JSON report and nothing else |
| `--audit` | `status` | Add one `AUDIT` line per unowned vendored path that differs from upstream at the pin, is missing from the tree, or is tracked there and never upstream, and fail the status on any of them |
| `--root <dir>` | `status`, `apply`, `repin` | Work on that vendored tree instead of the one this command ships in |
| `--capture <path>` | `apply` | Move the live edit at that path into its overlay source, instead of applying every overlay |
| `--adopt <path>` | `apply` | Add a manifest entry for that vendored file or folder, which no overlay owns yet, then apply every overlay |
| `--relayout` | `apply` | Move each overlay source kept off its layout path onto it, back up what it leaves and point the manifest there, then apply every overlay |
| `--upstream <dir>` | `repin` | The local Skilled checkout that holds both the pinned commit and the new one |
| `--to <commit>` | `repin` | The upstream commit to move the vendored tree to |
| `--rollback <run-id>` | `repin` | Restore the backup one re-pin run kept, instead of re-pinning |
| `list`, `?`, `menu` | the command | Show the startup menu and the route manifest, and load no workflow |

1. Read `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt`.
2. Read `.skilled/commands/doctor/_routes.yaml` and keep the `/doctor:overlay` routes.
3. If the bound target is unknown, render the presentation contract's unknown-target failure and stop.
4. Resolve the route's fields from `_routes.yaml`. Reject a flag outside its `allowed_flags`, including a flag another target owns.
5. Load the resolved workflow YAML from `.skilled/commands/doctor/assets/<yaml>` and execute it step by step.

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt`, never inline in this router:

- The argument failure wording and the startup menu.
- The status report and the plan each writing target shows.
- The question each writing target asks.
- What the `strictWrites` setting, the `generated` list and `repin.rootFiles` do in the overlay manifest.
- The result templates and next-step text.

---

## 6. WORKFLOW SUMMARY

1. Bind the target from the first positional token, `status` when there is none, then resolve its route from `_routes.yaml`.
2. `status` runs `overlay-engine.cjs status` once, adding `--root <dir>`, `--json` and `--audit` only when the operator passed them. It prints one line per destination that is not in sync, a `STALE` line for a root file upstream changed under a `repin.rootFiles` overlay, a `LAYOUT` line for each source kept off its layout path, then the state counts and the full check, and it writes nothing. With `--audit` it also prints one `AUDIT` line per unowned path that drifted from the pin, and that finding fails the status.
3. `apply` first runs `overlay-engine.cjs status` with the same `--root`, and that report is the plan. A tree already in sync ends the run as unchanged, and nothing is asked.
4. A live edit or a conflict state stops the run before the question, because the engine would refuse to apply. The run names the engine's own fix for each such line and writes nothing.
5. `apply` asks the apply question once, against the report the operator has just read. Any answer other than yes is a no, so the run ends as cancelled and nothing is written.
6. After the yes, `apply` runs `overlay-engine.cjs apply` with the same `--root`. The engine takes its own lock and classifies every destination again. When a conflict appeared since the report it refuses rather than writes. Otherwise it writes the overlays, then runs the manifest's regenerate and verify steps.
7. With `--capture <path>`, the plan is the one report line for that path. The run asks the capture question only when that line is `live-edited`, and only after its yes runs `overlay-engine.cjs apply --capture <path>`.
8. With `--adopt <path>`, the plan is the same status report plus the path to adopt. A live edit or a conflict state stops the run before the question, because the apply that follows the new entry would be refused. The run asks the adopt question once, and only after its yes runs `overlay-engine.cjs apply --adopt <path>`, which copies the path into the overlay folder, appends its manifest entry and applies.
9. With `--relayout`, the plan is the `LAYOUT` lines of the same status report, one per overlay source kept off its layout path. A report with no `LAYOUT` line ends the run as nothing to move, and nothing is asked. A live edit, a conflict state, a `MISS` line or a `STALE` line stops the run before the question, because the apply that follows the move would be refused until it is settled.
10. With `--relayout`, the run asks the relayout question once, against those lines. Any answer other than yes is a no, so the run ends as cancelled and nothing is written.
11. After that yes, `apply --relayout` runs `overlay-engine.cjs apply --relayout` with the same `--root`, then `overlay-engine.cjs apply` with the same `--root`. The engine takes its own lock, copies every source it moves into `<overlay folder>/relayout-runs/<stamp>/`, moves each one onto its layout path with the leading dot dropped and points the manifest's fields and layout links there. It refuses with exit 2 rather than overwrite an existing target, and then nothing is written. The apply that follows retargets the live links and puts the destinations on the moved sources.
12. Any of the four writes is re-read through `overlay-engine.cjs status`, and that verdict is shown beside the engine's own result lines.
13. `repin` first runs `overlay-engine.cjs repin --stage <dir>` with the same `--upstream`, `--to` and `--root` into a fresh temporary folder, and that report is the plan. The live tree is not touched.
14. A stage report that lists a blocked overlay stops the run before the question, because the operator rebases those overlays first and then reruns. A refusal or a failed check on the copy stops it the same way, and nothing is written.
15. `repin` asks the repin question once, against the stage report on screen. Any answer other than yes is a no, so the run ends as cancelled and nothing is written.
16. After the yes, `repin` runs `overlay-engine.cjs repin` with the same flags. The engine backs up every path it touches before its first write. When the run fails after that backup, the route shows the engine's rollback line, asks a separate rollback question and runs `overlay-engine.cjs repin --rollback <run-id>` only after that yes.
17. With `--rollback <run-id>` given directly, the plan is what that run's folder holds. The route asks the rollback question once and restores only after its yes.
18. A re-pin or a rollback is re-read through `overlay-engine.cjs status`, and that verdict is shown beside the engine's own result lines.
19. Render the result through the presentation contract, name the next command for the operator, and end with the result template's status line. After a clean re-pin that command is `/doctor:update record-base`, because the release-update base still names the old pin. The route stages nothing and commits nothing, so whoever ran it commits the change themselves.
