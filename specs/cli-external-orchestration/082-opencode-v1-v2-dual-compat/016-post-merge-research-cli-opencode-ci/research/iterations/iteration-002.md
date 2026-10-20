# Deep-Research Iteration 2 — A25: Doctor version battery and dual-version CI

Run: `2026-10-19T19:09:07.051Z` · Segment 1 · Iteration 2 of 2 (final) · Research packet `016-post-merge-research-cli-opencode-ci`

## Focus

Does `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` test what `/doctor` and packet 082 claim (plugin-active counts, skill visibility, version families) without pinning stale numbers; does `.github/workflows/opencode-dual-version.yml` install both pinned versions and run the battery checks it claims; did CI pass on main after the 2026-10-19 merges; which battery leg failed in run 39308825187.

## Actions Taken

1. Read the full battery source (898 lines) and mapped every leg and exit rule.
2. Read the full CI workflow (220 lines) and extracted pins, jobs and steps.
3. Read the claim surfaces: `008-doctor-and-ci/scratch/battery-contract.md`, `008-doctor-and-ci/spec.md`, `011-two-version-proof-and-closeout/proof.md`, `.skilled/command-support/doctor/scripts/README.md`.
4. Ran read-only `gh` queries: `gh run list --workflow opencode-dual-version.yml`, `gh run view` on the latest main run and on failed run 39308825187, `--log-failed` tails, artifact listing via `gh api`.
5. Verified on disk (read-only) that installed versions match the pins (`~/.local/lib/node_modules/opencode-ai/package.json` → `opencode-ai 1.19.3`; `~/.local/opencode-v2/lib/node_modules/@opencode/cli/package.json` → `@opencode/cli 2.0.32`) and counted `.opencode/plugins/*.js` (17). Never started, stopped, restarted or contacted the shared OpenCode 2 service (PID 46220); never edited outside the packet.

## Findings

### Claim-versus-reality rows

| # | Claim (source) | Reality | Verdict |
|---|----------------|---------|---------|
| 1 | Battery has legs `family-present`, `plugin-discovered`, `plugin-load` (v1), `plugin-active`, `skill-visible` (v2); exit 2/1/3/0 (`008-doctor-and-ci/scratch/battery-contract.md`) | Source implements exactly that: `family-present` [SOURCE: .skilled/commands/doctor/scripts/opencode-version-battery.cjs:263], `plugin-discovered` [SOURCE: .skilled/commands/doctor/scripts/opencode-version-battery.cjs:272], `plugin-load` [SOURCE: .skilled/commands/doctor/scripts/opencode-version-battery.cjs:315], `plugin-active` [SOURCE: .skilled/commands/doctor/scripts/opencode-version-battery.cjs:376], `skill-visible` [SOURCE: .skilled/commands/doctor/scripts/opencode-version-battery.cjs:429], `worstExit` 1/3/0 with usage error 2 [SOURCE: .skilled/commands/doctor/scripts/opencode-version-battery.cjs:445] | confirmed |
| 2 | Battery judges version families "without pinning stale numbers" (focus A25) | No version or count literals anywhere in the script: family comes from parsing each candidate's `--version` output with `VERSION_PATTERN` [SOURCE: .skilled/commands/doctor/scripts/opencode-version-battery.cjs:50], candidates are `$OPENCODE_BIN`, `which opencode`, `which opencode2` [SOURCE: .skilled/commands/doctor/scripts/opencode-version-battery.cjs:470], and `plugin-active` requires every scoped entry `state.status === 'active'` on a stable read [SOURCE: .skilled/commands/doctor/scripts/opencode-version-battery.cjs:400] rather than a pinned count | confirmed |
| 3 | Packet 082 proof rows: "1.19.3 → 16 of 16 plugin files discovered/loaded", "2.0.32 → 16 of 16 plugin files active, 57 skill entries visible", dated 2026-10-19 [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/011-two-version-proof-and-closeout/proof.md:48] | Snapshot is already stale as a description of "now": `.opencode/plugins` holds 17 top-level `.js` plugins, and run 39308825187's log at 19:12Z already read "all 17 plugin files discovered". The battery itself would report 17 — the 16/57 numbers are dated proof snapshots, not battery pins | documented |
| 4 | Workflow installs both pinned packages [SOURCE: .github/workflows/opencode-dual-version.yml:56] | Pins `opencode-ai@1.19.3` (matrix + both job) and `@opencode/cli@2.0.32` [SOURCE: .github/workflows/opencode-dual-version.yml:152], each into its own prefix with `npm install -g` and a `$OPENCODE_BIN` export [SOURCE: .github/workflows/opencode-dual-version.yml:89]; pins equal the installed 1.19.3 / 2.0.32 | confirmed |
| 5 | Workflow runs the version battery it claims [SOURCE: .github/workflows/opencode-dual-version.yml:108] | Both the per-family matrix jobs (`--family=<v1\|v2> --json --out`, artifacts `battery-v1/-v2` uploaded `if: always()`) and the both-install job (`--family=both`, artifact `battery-both`) [SOURCE: .github/workflows/opencode-dual-version.yml:206] | confirmed |
| 6 | "…and run the battery and smoke checks it claims" (focus A25) | The workflow contains **no** smoke dispatch steps. Its only non-battery assertions in the both job are the two dispatch names resolving to two binaries and the exact `--version` strings `1.19.3` / `opencode v2.0.32` [SOURCE: .github/workflows/opencode-dual-version.yml:191]. The dispatch smoke (`scratch/proof/smoke.sh`) is documented as an operator-approved phase-011 activity, not CI [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/011-two-version-proof-and-closeout/proof.md:66]; 008's CI claim is battery-only [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/008-doctor-and-ci/spec.md:77] | documented |
| 7 | Trigger list includes `.skilled/bin/tests/opencode-config-shape.test.cjs` [SOURCE: .github/workflows/opencode-dual-version.yml:18] | No job step runs that test — the workflow runs the battery only. A path filter claims CI relevance for a check the jobs never execute | documented (minor drift) |
| 8 | Battery never touches the shared v2 service (008 spec D4) | It spawns its own `serve` on a free loopback port with private `OPENCODE_DB` and `XDG_DATA_HOME` inside a temp dir, kills it SIGTERM→SIGKILL on every path [SOURCE: .skilled/commands/doctor/scripts/opencode-version-battery.cjs:770]; doctor README documents the same [SOURCE: .skilled/command-support/doctor/scripts/README.md:76] | confirmed |

### CI verdict

- **PASS on main.** Latest main run `39309852507` (push, 2026-10-19T19:18:20Z, head `793b50cc`, "merge(system-spec-kit): bring the rebuilt trigger index into the CI fix"): completed **success**, all three jobs (`Battery on OpenCode v2`, `Battery on OpenCode v1`, `Both versions installed at once`) green — https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/actions/runs/39309852507.
- The immediately preceding main run `39308825187` (2026-10-19T19:11:04Z, head `6d7f6b84`) failed all three jobs; its battery artifacts (`battery-v1`, `battery-v2`, `battery-both`) exist and its logs answer the carried-forward question:
  - v1 matrix job: `plugin-discovered` PASS ("all 17 plugin files discovered"), then **`plugin-load` FAIL — "the import harness could not load every plugin"**, exit 1.
  - both job: v2 **`plugin-active` FAIL — "the stable read shows missing or inactive plugins"** with details `system-skill-advisor.js: status failed` and `system-spec-gate.js: status failed`; `skill-visible` PASS "57 skill entries visible" (59 entries, 57 visible); exit 1.
- So the regression window is 2026-10-19 ~19:11→19:18Z and was closed by the CI-fix merge `793b50cc`; the failing legs were v1 `plugin-load` and v2 `plugin-active` on `system-skill-advisor.js` / `system-spec-gate.js`, both of which are present and (per the later green run) now loading/active on the pinned versions.

### Synthesis

The battery is behaviour-locked to its contract, not to numbers — the only literals in the battery are timeouts and attempt counts. The workflow's pins today equal the installed reality (1.19.3 / 2.0.32), and CI proved that pair green on main at 19:18Z after the 2026-10-19 merges. The dated numbers in packet 082's proof (16 plugins, 57 skill entries) and in the earlier green logs vs today's 17-plugin folder are ordinary snapshot drift that the battery's dynamic design absorbs; the one forward-looking smell is the config-shape test's presence in the trigger list without a corresponding job step.

## Questions Answered

- "Do the doctor battery and the dual-version CI workflow test what they claim, and did CI pass on main?" — Yes: the battery leg-by-leg matches its documented contract with dynamic family detection and no pinned counts; the workflow installs exactly the pinned packages `opencode-ai@1.19.3` and `@opencode/cli@2.0.32` (matching the installed versions) and runs the battery per family and on both installs; the latest main run after the 2026-10-19 merges (39309852507, 793b50cc) passed all three jobs at 2026-10-19T19:18:20Z, after run 39308825187 had failed on v1 `plugin-load` and v2 `plugin-active` (`system-skill-advisor.js`, `system-spec-gate.js`).
- Carried-forward (iteration 1): "Which specific battery leg failed in run 39308825187?" — Answered by the `--log-failed` body: v2 `plugin-active` (both job, details naming `system-skill-advisor.js: status failed`, `system-spec-gate.js: status failed`) and v1 `plugin-load` (v1 matrix job).

## Questions Remaining

- "Is the same leg failing locally for the same reason?" stays open: resolving it needs a battery run against the local installs (a repo-test execution and a private v2 server) and/or a look at the shared service — both outside this iteration's declared check surface (`gh` read-only + battery source; shared service PID 46220 untouchable). CI evidence covers the pinned-version-on-runner case only.
- The v1 `plugin-load` import-harness failure detail at 6d7f6b84 (which plugin, what message) was truncated in the retrieved log tail; the `battery-v1` artifact JSON would name it if a later investigation needs it.
- Iteration-1 leftovers untouched here (declared out of A25's surface): which agent directory the installed binary reads (`opencode agent list` / `opencode debug agent` probe), and whether v1 1.19.3 accepts `--share` functionally.

## SCOPE VIOLATIONS

None. All writes were confined to the two allowed research files plus the append gateway's own run-directory writes; `gh` usage was read-only (`run list`, `run view`, `--log-failed`, `gh api` artifact listing); the shared OpenCode 2 service (PID 46220) was never started, stopped, restarted or contacted, and the battery was never executed locally.

## Next Focus

Final iteration of this run (2 of 2). Hand-off state: battery/workflow verified as claim-true for the 1.19.3 + 2.0.32 pair, CI green on main at 39309852507; open residue is the local-leg question above, the two iteration-1 runtime probes, and (cosmetic) either running or dropping `.skilled/bin/tests/opencode-config-shape.test.cjs` from the workflow's trigger list.
