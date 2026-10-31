# Iteration 4: External user and benchmark operator experience

## Focus

Audit the path for a repository user who installs cli-classifier without Jev and for an operator who wants to run the benchmarks. Compare entry-point, prerequisite, safe-default, output, and measured-result documentation with the implementation. Read only; no tests, benchmark, Jev calls, or validators ran.

## Actions Taken

- Followed the hub and cli-jev prerequisite instructions to see what happens when Jev is unavailable and where installation is explained.
- Read the benchmark index, both benchmark README files, their test READMEs, measurement catalog entries, measurement playbooks, and the curated report index.
- Checked the Pi comparison's referenced baseline and historical run artifacts by path and inspected the recorded report text; did not execute the scorer.
- Compared the hub's statement about its default transport with the shared implementation and its shared-script and feature-catalog docs.

## Findings

### LUNA-F005 — Hub skill describes the wrong default for the shared choice/noul transport

- **Severity:** P2
- **Axis:** 5 — documentation accuracy against code
- **Evidence:** The hub skill says the shared helper's Pi route is opt-in and Jev CLI is the default and fallback (`.skilled/skills/cli-classifier/SKILL.md:114`). The helper's `resolveTransport` says that no option and no environment selection yields `transport: 'auto'` (`.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:55-72`), and `spawnClassifierCall` sends supported `choice` and `noul` requests through Pi preflight unless that route resolves to Jev (`.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:526-545`). The shared README and feature-catalog entry correctly describe Pi as the unset-route preference (`shared/scripts/README.md:16,28`; `feature-catalog/measurements/pi-transport-integration.md:18-25,37-42`).
- **How confirmed:** Static comparison of the root skill sentence, the route selector, and the call path. This does not execute the transport. The stale sentence can lead an operator to believe Pi will only be used when explicitly enabled.

## User and Operator UX Observations

- The external user path is explicit: the hub exposes only the Jev transport, the packet checks `command -v jev` before a judgment, and a missing binary makes the mode unavailable instead of fabricating an answer (`SKILL.md:20-24, 137-139`; `cli-jev/SKILL.md:59-70`). The packet README contains the installation command `uv tool install jev-cli` as contract provenance (`cli-jev/README.md:127-132`), though it does not place that command in the main prerequisite section.
- The benchmark operator has a zero-call census and explicit `--pi` / `--cli` arms, each requiring `--out <dir>` before calls are made; docs explain output files, gates, stop results, and cost-bearing live arms (`benchmark/pi-transport/README.md:38-53, 69-87`). The pi comparison baseline path exists in this checkout and the saved CLI calls file contains 334 JSONL rows. The historical measured Pi/CLI result is visible in the feature-catalog integration entry (`feature-catalog/measurements/pi-transport-integration.md:103-106`). The new replay script has no live report or verdict and states that fact (`benchmark/pi-transport/README.md:87`; `feature-catalog/measurements/pi-transport-comparison.md:30-38`).
- The injection-screen docs describe the label/sentence gate (`feature-catalog/measurements/injection-screen-measurement.md:30-36`; `changelog/v0.5.0.0.md:17-23`). A final-pass recheck found the checked-in input files are already populated: 90 labeled rows in `benchmark/injection-screen/labels.jsonl:1-90` and 30 planted sentences in `benchmark/injection-screen/planted.jsonl:1-30`. That corrects my earlier placeholder observation. No `report.json` or `calls.jsonl` exists in the current scorer directory or in the originating `035-fetched-text-injection-screen` scratch packet, so the completed inputs do not establish a published benchmark result. I did not execute the scorer or its gates.
- The curated benchmark report index exposes two hub-routing reports, not the Pi comparison (`benchmark/reports/README.md:23-30`). The historical Pi/CLI numbers remain discoverable in the integration feature-catalog entry; no scored injection-screen result is available to expose.

## Questions Answered

- The Jev-missing path fails closed and tells the user the Jev mode is unavailable. Installation is mentioned in the packet README's provenance rather than the prerequisite section.
- Benchmark instructions distinguish their zero-call mode from live, recorded arms; historical Pi/CLI measurements are visible in a feature-catalog entry, while the new comparison script and injection screen do not have current verdicts.
- The hub skill's transport-default description contradicts the actual helper behavior.

## Questions Remaining

- Do the full documentation surface, mirrors, and changelogs meet their structural conventions and agree with current code?
- Do Jev-named callers force the Jev backend or accurately surface an automatic Pi answer?
- Which earlier findings survive a whole-surface cross-check, and what final axis coverage is still missing?

## Assessment

- **New-information ratio:** 0.30 (telemetry only; maximum iterations remains controlling).
- **Novelty:** The main new defect is a direct mismatch at the hub's public description of a live helper default. The operator docs give separate, accurate safe-run and live-run behavior, and report absence of current results rather than imply measured success.
- **Negative knowledge:** No missing-baseline defect was found: the comparison's named input exists in this checkout. No P0/P1 external-user blocker was confirmed. No tests, benchmark arms, Jev judgments, or validators ran.

## Sources

- `.skilled/skills/cli-classifier/SKILL.md:20-24, 112-115, 133-139` — registered mode, stale transport-default sentence, and missing-Jev escalation.
- `.skilled/skills/cli-classifier/cli-jev/SKILL.md:59-70` — Jev availability and credential gates.
- `.skilled/skills/cli-classifier/cli-jev/README.md:125-132` — documented pinned Jev install command and provenance caveat.
- `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:55-72, 526-545` — unset route and Pi preflight path.
- `.skilled/skills/cli-classifier/shared/scripts/README.md:14-30` — accurate default transport behavior and outcome labels.
- `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:18-25, 37-42, 88-106` — accurate automatic route, switch, callers, and prior recorded verdict.
- `.skilled/skills/cli-classifier/benchmark/README.md:17-33` — benchmark layout and zero-call gates.
- `.skilled/skills/cli-classifier/benchmark/pi-transport/README.md:38-87` — comparison commands, outputs, safe gates, decision rule, and no current result.
- `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-comparison.md:18-38` — new replay methodology and no verdict yet.
- `.skilled/skills/cli-classifier/feature-catalog/measurements/injection-screen-measurement.md:26-36` — label gate and result shape.
- `.skilled/skills/cli-classifier/changelog/v0.5.0.0.md:17-23` — release-time note about the injection-screen label gate.
- `.skilled/skills/cli-classifier/benchmark/injection-screen/labels.jsonl:1-90` and `planted.jsonl:1-30` — current populated inputs observed in the final cross-check.
- `.skilled/skills/cli-classifier/benchmark/reports/README.md:23-36` — current curated report index and storage rule.
- `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/pi-transport-comparison.md:15-31, 46-48` — safe census and operator verification contract.
