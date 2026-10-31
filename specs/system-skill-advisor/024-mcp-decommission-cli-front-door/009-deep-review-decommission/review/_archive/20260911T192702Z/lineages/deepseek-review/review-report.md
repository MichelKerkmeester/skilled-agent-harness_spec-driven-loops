---
title: Deep Review Report - Advisor MCP Decommission (phase 009)
session: fanout-deepseek-review-1789148343059-q7g4rk
lineage: deepseek-review
loop: review
iterations: 6
stopReason: maxIterationsReached
verdict: CONDITIONAL
---

# Deep Review Report: Advisor MCP Decommission

Review target: `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/009-deep-review-decommission` (spec-folder; the review audits the parent packet `025-mcp-decommission-cli-front-door` and the tree it changed).
Lineage artifacts: `review/lineages/deepseek-review/`.

## Executive Summary

- **Overall verdict: CONDITIONAL.** No active P0. Nine active P1 findings require fixes before the packet can present itself as complete; eight active P2 items are advisories.
- **hasAdvisories: false** (the field applies to PASS; this verdict is CONDITIONAL).
- **Counts (active):** P0 = 0, P1 = 9, P2 = 8 (17 total).
- **Scope of review:** six iterations over the four configured dimensions plus both required traceability protocols. The audit covered the decommission's claim surfaces (the doctor command tree, the launcher, the plugin, the `bin/` map, the `.pi` runtime docs, spec-kit's live references and hook shim, the install guide, and the packet's own documents), not just the advisor package. Every finding was produced by re-proving a claim against the final tree state; no finding rests on a summary.
- **What holds:** the decommission's core is real and verified from the final state - the advisor is gone from all five runtime configs, the SDK dependency is gone, the package directory is `runtime/`, the daemon speaks the advisor's own protocol, the CLI answers and is the single front door, the launcher carries the two rehomed environment defaults, the trust model is fail-closed and environment-based, and the prompt-time brief still arrives (warm, cold, and degraded paths statically traced).
- **What fails:** the residue sweep's own claim ("Zero live hits") does not hold outside the advisor package. Live operator surfaces still describe an MCP server that no longer exists - and in the worst case (the doctor install workflow) print a build command against a directory that does not exist. The gate phase that was supposed to prove the packet's claims has not run.
- **Stop condition:** iteration ceiling reached (`maxIterations 6`). Composite convergence telemetry independently supported stopping: weighted stop score 0.70 >= 0.60, all nine legal-stop gates passed. Terminal `stopReason: maxIterationsReached`.

## Planning Trigger

**`/speckit:plan` is required** for the P1 remediation set (all nine items are live-surface corrections, each with a known file:line and an acceptance check that is a grep, not a design).

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    { "id": "F001", "severity": "P1", "findingClass": "failing_printed_command", "title": "MCP install workflow for the advisor cannot succeed, and carries a keyless orphan server block", "file": ".opencode/commands/doctor/assets/doctor-mcp-install.yaml:114", "dimension": "correctness" },
    { "id": "F002", "severity": "P1", "findingClass": "false_diagnostic", "title": "Live doctor script still presents the advisor as an MCP server and permanently reports it unwired", "file": ".opencode/commands/doctor/scripts/mcp-doctor.sh:59", "dimension": "correctness" },
    { "id": "F004", "severity": "P1", "findingClass": "stale_transport_claim", "title": "Launcher reports having built an MCP server, and its comments still name an MCP child under the deleted path", "file": ".opencode/bin/system-skill-advisor-launcher.cjs:1235", "dimension": "correctness" },
    { "id": "F005", "severity": "P1", "findingClass": "stale_transport_doc", "title": "Pi sync table and extension map describe a caller that no longer exists", "file": ".pi/SYNC.md:29", "dimension": "traceability" },
    { "id": "F008", "severity": "P1", "findingClass": "stale_transport_doc", "title": "Daemon CLI reference teaches that MCP is still the primary transport and prints a build command against the deleted directory", "file": ".opencode/skills/system-spec-kit/references/cli/daemon-cli-reference.md:25", "dimension": "traceability" },
    { "id": "F009", "severity": "P1", "findingClass": "stale_path_in_reference", "title": "Spec-kit architecture ownership table names the advisor under mcp-server/ and calls it the only MCP daemon still running", "file": ".opencode/skills/system-spec-kit/ARCHITECTURE.md:157", "dimension": "traceability" },
    { "id": "F010", "severity": "P1", "findingClass": "stale_path_in_reference", "title": "Env reference sources advisor variables from the deleted tree and documents hook-walk targets the live shim no longer uses", "file": ".opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:303", "dimension": "traceability" },
    { "id": "F012", "severity": "P1", "findingClass": "stale_transport_doc", "title": "Bin entrypoint map describes a dual-stack MCP surface and prints a CLI dist path that does not exist", "file": ".opencode/bin/README.md:100", "dimension": "maintainability" },
    { "id": "F015", "severity": "P1", "findingClass": "completion_claim_unverified", "title": "Packet completion state is unverifiable: gate phase unstarted, phase map placeholders, target packet an unpopulated scaffold, cross-skill residue unowned", "file": "specs/system-skill-advisor/025-mcp-decommission-cli-front-door/008-verification-and-closeout/implementation-summary.md:51", "dimension": "traceability" },
    { "id": "F003", "severity": "P2", "findingClass": "stale_transport_doc", "title": "MCP debug workflow still enumerates the advisor as a supported MCP server", "file": ".opencode/commands/doctor/assets/doctor-mcp-debug.yaml:27", "dimension": "traceability" },
    { "id": "F006", "severity": "P2", "findingClass": "name_outlived_referent", "title": "Caller-context module still names the retired MCP transport", "file": ".opencode/skills/system-skill-advisor/runtime/lib/context/caller-context.ts:7", "dimension": "maintainability" },
    { "id": "F007", "severity": "P2", "findingClass": "name_outlived_referent", "title": "Plugin status output and timeout env still speak the deleted bridge", "file": ".opencode/plugins/system-skill-advisor.js:1457", "dimension": "maintainability" },
    { "id": "F011", "severity": "P2", "findingClass": "phase_framing_drift", "title": "Install guide validates the advisor inside the MCP-servers phase", "file": ".opencode/install-guides/README.md:661", "dimension": "maintainability" },
    { "id": "F013", "severity": "P2", "findingClass": "self_fallback", "title": "Advisor database-directory legacy fallback is a self-fallback and its README documents the alias as working", "file": ".opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:199", "dimension": "correctness" },
    { "id": "F014", "severity": "P2", "findingClass": "retired_coverage", "title": "Stress suite still carries the retired transport in its name and runs in no default suite", "file": ".opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/mcp-diagnostics-stress.vitest.ts:2", "dimension": "maintainability" },
    { "id": "F016", "severity": "P2", "findingClass": "stale_packet_record", "title": "Phase 007 limitation block is stale against the current tree", "file": "specs/system-skill-advisor/025-mcp-decommission-cli-front-door/007-docs-and-residue-sweep/implementation-summary.md:159", "dimension": "traceability" },
    { "id": "F017", "severity": "P2", "findingClass": "evidence_placement_gap", "title": "Retired-coverage accounting lives only in a commit message, not in the packet", "file": "specs/system-skill-advisor/025-mcp-decommission-cli-front-door/spec.md:1", "dimension": "traceability" }
  ],
  "remediationWorkstreams": [
    { "id": "WS-1", "priority": "P1", "theme": "Doctor command tree presents the advisor as a live MCP server", "findings": ["F001", "F002", "F003"], "shape": "Rewrite the advisor rows against runtime/ and the CLI; the install steps must name a directory that exists, the config-wiring check must stop asking for declarations that were deliberately removed, and the keyless orphan server block must be repaired or deleted." },
    { "id": "WS-2", "priority": "P1", "theme": "Entrypoint and launcher surfaces name a transport that was removed", "findings": ["F004", "F012", "F005"], "shape": "Reword the launcher action string, rewrite the bin README's framing and dead dist path, and correct the .pi SYNC/extensions rows against the live import." },
    { "id": "WS-3", "priority": "P1", "theme": "Spec-kit live references still teach the retired transport", "findings": ["F008", "F009", "F010"], "shape": "Fix or retire the three documents; F010 needs the whole advisor-owned env block rewritten, including the two solver-facing sentences that claim the registrations carry the defaults." },
    { "id": "WS-4", "priority": "P1", "theme": "The packet cannot present its own completion", "findings": ["F015", "F016", "F017"], "shape": "Scope phase 009 in the parent map, run phase 008 against the final state, refresh phase 007's stale limitation block, and move the retired-coverage accounting into the packet." },
    { "id": "WS-5", "priority": "P2", "theme": "Naming residue and coverage bookkeeping", "findings": ["F006", "F007", "F011", "F013", "F014"], "shape": "Rename or annotate the identifiers that outlived their referent (each has test pins listed in the registry), fix or drop the DB-dir legacy alias claim, and either wire the stress suite into a default run or record why it is manual-only." }
  ],
  "specSeed": [
    "Amend the parent packet: give phase 009 its scope and criteria in the phase documentation map, and name the owner for the class-3 cross-skill residue findings (WS-1 and WS-2 sit in files no phase owns today).",
    "Record that the doctor command tree under .opencode/commands/doctor/ was outside phase 007's declared sweep scope, which is why the advisor-as-MCP framing survives there.",
    "Record the retired-coverage accounting (26 bridge tests retired, 3 inverted, 4 migrated, 828 to 863 passing) in the phase that owns the test change.",
    "State the closure rule the decommission actually needs: zero live surfaces naming the advisor as an MCP server or resolving an mcp-server/ path."
  ],
  "planSeed": [
    "T1: repair .opencode/commands/doctor/assets/doctor-mcp-install.yaml (F001) - install steps, fallback_build, entry_point and the keyless System Code Graph block.",
    "T2: rewrite the advisor branch of mcp-doctor.sh (F002) - help text, diagnose() wording, and detect_and_check_configs must stop demanding a declaration that no longer exists.",
    "T3: reword doctor-mcp-debug.yaml's advisor row (F003).",
    "T4: launcher action string and comments (F004); bin README framing and dist path (F012).",
    "T5: .pi/SYNC.md row and .pi/extensions/README.md paths (F005).",
    "T6: daemon-cli-reference.md (F008), spec-kit ARCHITECTURE.md (F009), ENV-REFERENCE.md advisor block (F010).",
    "T7: close the packet record (F015-F017) and schedule the phase 008 gate run, including the recursive strict validate that this review could not run.",
    "T8 (P2 batch): MCPCallerContext naming (F006), plugin bridge strings (F007), install-guide heading (F011), DB-dir alias (F013), stress-suite placement (F014)."
  ],
  "findingClasses": [
    "stale_transport_doc",
    "failing_printed_command",
    "false_diagnostic",
    "stale_path_in_reference",
    "completion_claim_unverified",
    "name_outlived_referent",
    "phase_framing_drift",
    "self_fallback",
    "retired_coverage",
    "stale_packet_record",
    "evidence_placement_gap",
    "stale_transport_claim"
  ],
  "affectedSurfacesSeed": [
    ".opencode/commands/doctor/ (assets + script + route)",
    ".opencode/bin/ (launcher, README, CLI shim)",
    ".opencode/plugins/system-skill-advisor.js",
    ".pi/ (SYNC.md, extensions/README.md)",
    ".opencode/skills/system-spec-kit/ (ARCHITECTURE.md, runtime/ENV-REFERENCE.md, references/cli/daemon-cli-reference.md, runtime/hooks/claude/)",
    ".opencode/install-guides/README.md",
    ".opencode/skills/system-skill-advisor/runtime/ (caller-context.ts, skill-advisor-cli.ts, stress-test/)",
    "specs/system-skill-advisor/025-mcp-decommission-cli-front-door/ (parent map, phases 007/008/009)"
  ],
  "fixCompletenessRequired": false
}
```

## Active Finding Registry

### P0, Blocker

None.

### P1, Required

**F001 - MCP install workflow for the advisor cannot succeed, and carries a keyless orphan server block** (correctness, `.opencode/commands/doctor/assets/doctor-mcp-install.yaml:114`)

```text
$ rg -n "mcp-server" .opencode/commands/doctor/assets/doctor-mcp-install.yaml
114:      - "cd {skill_dir}/mcp-server && npm install"
115:      - "cd {skill_dir}/mcp-server && npm run build"
116:    fallback_build: "cd {skill_dir}/mcp-server && npm install && npm run build"
120:    entry_point: "mcp-server/dist/index.js"
...
$ test -d .opencode/skills/system-skill-advisor/mcp-server || echo "ABSENT"
ABSENT
```

The same entry's `health_checks` (lines 108-112) correctly use `runtime/`, so the workflow contradicts itself; under last-key-wins parsing the keyless block at 118-129 re-points `entry_point` at `mcp-server/dist/index.js`. **Impact:** an operator following the route executes a command that cannot succeed. **Fix:** rebase the steps on `runtime/`, fix or delete the orphan block. **Disposition:** active.

**F002 - Live doctor script still presents the advisor as an MCP server and permanently reports it unwired** (correctness, `.opencode/commands/doctor/scripts/mcp-doctor.sh:59`)

```text
59:  system_skill_advisor      Skill Advisor (Node.js MCP, advisor_recommend + skill_graph_*)
260:  local srv="system_skill_advisor"
437:        record_warn "config" "${cfg_path}:${srv}" "Not wired"
$ test -f .vscode/mcp.json || echo ABSENT
ABSENT
```

The route binds the script (`_routes.yaml:233`), so it is operator-reachable; three configs are checked for a declaration that was deliberately deleted, and one of the three does not exist. **Impact:** the health route can never report a healthy advisor and mislabels it as MCP. **Fix:** rewrite the advisor branch for the CLI front door and drop the wiring expectations. **Disposition:** active. *(Refined in iteration 6 with the `.vscode/mcp.json` absence.)*

**F004 - Launcher reports having built an MCP server, and its comments still name an MCP child under the deleted path** (correctness, `.opencode/bin/system-skill-advisor-launcher.cjs:1235`)

```text
39:// Load project-local env overrides BEFORE spawning the MCP child.
1227:  // reinstalls node_modules under the real mcp-server and hangs the whole suite.
1235:  actions.push('installed dependencies and built @spec-kit/system-skill-advisor MCP server');
```

Line 1235 is outside the vitest guard and reaches the operator-visible bootstrap actions. **Fix:** reword the three strings; the code itself already resolves `runtime/dist/runtime/advisor-server.js`. **Disposition:** active.

**F005 - Pi sync table and extension map describe a caller that no longer exists** (traceability, `.pi/SYNC.md:29`)

```text
29:| `mcp.json` | **hand-authored** | — | Registers system_skill_advisor and code_mode |
$ rg -n "skill" .pi/mcp.json    # exit 1, no matches
$ rg -n "mcp-server" .pi/extensions/README.md
25:... system-skill-advisor/mcp-server/dist/hooks/claude/user-prompt-submit.js ...
70:| `prompt-advisor.ts` | `input` | ... mcp-server/dist/hooks/claude/user-prompt-submit.js ...
$ rg -n "runtime/dist/hooks/claude/user-prompt-submit.js" .pi/extensions/prompt-advisor.ts
48:  "../../.opencode/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js";
```

**Impact:** an operator maintaining the Pi integration reads a registration and a path that do not exist. **Fix:** correct both files against the live import. **Disposition:** active.

**F008 - Daemon CLI reference teaches that MCP is still the primary transport and prints a build command against the deleted directory** (traceability, `.opencode/skills/system-spec-kit/references/cli/daemon-cli-reference.md:25`)

```text
17:The daemon CLI shim is an additive IPC client over the skill-advisor MCP daemon. It is not a replacement server, and MCP remains the primary in-session transport.
25:... It is the operator's map; the MCP transport remains the runtimes' route.
33:| `node .opencode/bin/skill-advisor.cjs` | `system_skill_advisor` | 9 | ...
126:| `skill-advisor.cjs` | `Run the skill-advisor TypeScript build.` | `npm --prefix .opencode/skills/system-skill-advisor/mcp-server run build` |
```

Live (linked from root `README.md:1048`, listed in `SKILL.md:264` and the leaf manifests). **Fix:** rewrite as the shipped CLI-primary reference. **Disposition:** active.

**F009 - Spec-kit architecture ownership table names the advisor under mcp-server/ and calls it the only MCP daemon still running** (traceability, `.opencode/skills/system-spec-kit/ARCHITECTURE.md:157`)

```text
157:| `.opencode/skills/system-skill-advisor/mcp-server/database/` | The skill advisor | ... the only MCP daemon this repository still runs |
160:| `shared/ipc/`, `@modelcontextprotocol/sdk` in `shared/` | The skill advisor daemon through `shared/ipc` | The IPC seam the advisor's MCP transport is built on |
```

Both claims are false (path renamed; `code_mode` is the registered MCP server). **Fix:** correct the two rows. **Disposition:** active.

**F010 - Env reference sources advisor variables from the deleted tree and documents hook-walk targets the live shim no longer uses** (traceability, `.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:303`)

```text
$ rg -c "mcp-server" .opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md
30
318:... pinned `true` in the runtime configs (`.claude/mcp.json`, `.codex/config.toml`, `opencode.json`) ...
366:... Set in the committed MCP registrations, and callers cannot forge it.
$ rg -n "SKILL_ADVISOR_DOC_TRIGGERS" .claude/mcp.json .codex/config.toml opencode.json   # exit 1
```

Lines 142/148/193-194 carry the dead paths; lines 318/366 carry false operational claims that the registrations supply the defaults (the launcher does, at `system-skill-advisor-launcher.cjs:84-85`). **Fix:** rewrite the advisor-owned block against `runtime/` and the launcher. **Disposition:** active. *(Extended in iteration 6.)*

**F012 - Bin entrypoint map describes a dual-stack MCP surface and prints a CLI dist path that does not exist** (maintainability, `.opencode/bin/README.md:100`)

```text
1:title: "bin: MCP Launchers, Daemon CLIs, Compiled Routing and Repo Tooling"
64:+-- system-skill-advisor-launcher.cjs  # Launches system-skill-advisor MCP, ...
99:| `system-skill-advisor-launcher.cjs` | Boots the system-skill-advisor MCP child. ...
100:| `skill-advisor.cjs` | CLI shim ... runs `mcp-server/dist/mcp-server/skill-advisor-cli.js`. ...
153:| `node .opencode/bin/system-skill-advisor-launcher.cjs` | CLI | Start the system-skill-advisor MCP server. |
```

The printed dist path does not exist (the shim resolves `runtime/dist/runtime/skill-advisor-cli.js`). **Fix:** rewrite the framing and the path. **Disposition:** active.

**F015 - Packet completion state is unverifiable** (traceability, `008-verification-and-closeout/implementation-summary.md:51`)

```text
$ rg -n "Not started" 008-verification-and-closeout/implementation-summary.md
51:Not started. The planning artifacts exist and bind the work.
$ sed -n '150p;174,175p' ../spec.md
150:| 9 | 009-deep-review-decommission/ | [Phase 9 scope] | Pending |
174:| 008-verification-and-closeout | 009-deep-review-decommission | [Criteria TBD] | [Verification TBD] |
175:| 009-deep-review-decommission | 010-deep-research-residue | [Criteria TBD] | [Verification TBD] |
```

Phase 008 owns the packet's proof obligations (including the recursive strict validate) and has run none of them; the phase map never gave this phase a scope; the residue this review reports has no owning phase. **Fix:** scope the phase, run the gate, assign the residue. **Disposition:** active.

### P2, Suggestion

| ID | Title | File:line | Why it matters |
|----|-------|-----------|----------------|
| F003 | MCP debug workflow still enumerates the advisor as a supported MCP server | `.opencode/commands/doctor/assets/doctor-mcp-debug.yaml:27` | Its repair actions are already post-rename correct; only the framing is stale. |
| F006 | Caller-context module still names the retired MCP transport | `runtime/lib/context/caller-context.ts:7` | `MCPCallerContext`, the header comment and the throw string; renaming touches `lib/auth/trusted-caller.ts` and test pins. |
| F007 | Plugin status output and timeout env still speak the deleted bridge | `.opencode/plugins/system-skill-advisor.js:1457` | `bridge_timeout_ms=`, `last_bridge_status=`, `SYSTEM_SKILL_ADVISOR_BRIDGE_TIMEOUT_MS`; pinned by tests in two suites. |
| F011 | Install guide validates the advisor inside the MCP-servers phase | `.opencode/install-guides/README.md:661` | Its advisor section is otherwise accurate; the heading and the "2 NATIVE MCP SERVERS" box are not. |
| F013 | Advisor database-directory legacy fallback is a self-fallback | `runtime/skill-advisor-cli.ts:199` | `X ?? X` at three sites and a README sentence claiming a second variable works. **Pre-existing** (proven at `ed5f102287`), reported with provenance, not as a regression. |
| F014 | Stress suite still carries the retired transport in its name and runs in no default suite | `runtime/stress-test/skill-advisor/mcp-diagnostics-stress.vitest.ts:2` | Named for the deleted transport and excluded by `vitest.config.ts` include patterns. |
| F016 | Phase 007 limitation block is stale against the current tree | `007-docs-and-residue-sweep/implementation-summary.md:159` | Claims four red tests and two bridge suites that no longer exist (favourable divergence). |
| F017 | Retired-coverage accounting lives only in a commit message | `spec.md:1` (packet-wide) | Closure evidence outside the closure surface. |

## Remediation Workstreams

| Order | Workstream | Findings | Blast radius |
|-------|-----------|----------|--------------|
| 1 | Doctor command tree presents the advisor as a live MCP server | F001, F002, F003 | Operator-reachable mutating route; the install workflow prints a command that fails today |
| 2 | Entrypoint and launcher surfaces | F004, F012, F005 | First surfaces a maintainer reads; wording and one dead path |
| 3 | Spec-kit live references | F008, F009, F010 | Three live documents routed through the resource map; F010 is the widest single edit |
| 4 | Packet completion record | F015, F016, F017 | Documentation plus the phase 008 gate run that only the owning packet can perform |
| 5 | Naming residue and coverage bookkeeping (P2) | F006, F007, F011, F013, F014 | Renames touch test pins listed per-finding in the registry |

All five workstreams are documentation-or-string work except F013, which is a one-line code fix plus a doc correction. None requires redesign.

## Spec Seed

- Phase 009 needs its scope and criteria written into the parent map; phase 008 needs its gate run; the class-3 residue needs an owner (WS-1/WS-2 files belong to no phase today).
- The decommission's closure rule should be restated as: *zero live surfaces naming the advisor as an MCP server or resolving an `mcp-server/` path* - which is stricter, and truer, than "zero live hits" scoped to the advisor package.
- Phase 007's exit record should note that the doctor command tree was outside its declared sweep scope, so the next sweep does not repeat the omission.
- The retired-coverage accounting should live in the packet, not only in `9015d00c79`.

## Plan Seed

1. T1 (F001): repair `doctor-mcp-install.yaml` - install steps, `fallback_build`, `entry_point`, orphan block.
2. T2 (F002): rewrite the advisor branch of `mcp-doctor.sh` (help, `diagnose_*`, `detect_and_check_configs`).
3. T3 (F003): reword the advisor row in `doctor-mcp-debug.yaml`.
4. T4 (F004, F012): launcher strings; bin README framing and dist path.
5. T5 (F005): `.pi/SYNC.md` row and `.pi/extensions/README.md` paths.
6. T6 (F008, F009, F010): the three spec-kit documents.
7. T7 (F015-F017): packet record + phase 008 gate run including the recursive strict validate.
8. T8 (P2 batch): F006, F007, F011, F013, F014.

## Traceability Status

**Core protocols**

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | pass (hard) | parent `spec.md:99-108` vs the final tree; iterations 3, 5 and 6 | None in the plan itself - the transport removal, rename, rewire and env rehoming all hold. The failures are residue documents, filed as F001-F012/F015. |
| `checklist_evidence` | pass (hard; `notApplicable` inside the target) | target `spec.md:15` (Level 1 scaffold, no `checklist.md`); nearest authoritative list is `008-verification-and-closeout/goal.md:64-68` | 0 of 5 phase-008 criteria verified; recorded as F015 rather than scored as this protocol's failure. |

**Overlay protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| `feature_catalog_code` | pass (advisory) | `feature-catalog/` leaves describe CLI invocations; the retained MCP-named directories are a written preserve decision. |
| `playbook_capability` | pass (advisory) | `manual-testing-playbook/` procedures cite live CLI invocations; prepended run records keep their pre-rewrite quotes as documented. |

**AC_COVERAGE:** exempt - the target packet exposes no acceptance criteria to cover (Level 1 scaffold; no `checklist.md` or `acceptance-criteria.md`). The nearest authoritative list belongs to phase 008 and stands at covered 0 / total 5, recorded as F015; `fixCompletenessRequired: false` (this is not a security-sensitive fix rerun).

## Deferred Items

- **F013** is pre-existing work (`ed5f102287` shows the identical self-fallback), so it is reported with provenance and can be scheduled independently of the decommission's remediation.
- **F014** may legitimately be manual-only; the deferred decision is "wire it into a default run" versus "document why it is not".
- **Phase 008's recursive strict validate** is carried as owed evidence: this lineage cannot run it (it writes packet metadata outside the artifact directory).

## Dimension Expansion Map

No divergence data: the run used the `default` convergence mode (`antiConvergence.divergent` absent), so there are no saturated directions, pivots, audited overrides or Council artifact references to render. This section records breadth only and does not alter the verdict.

## Search Ledger

- **searchCoverage (lineage):** required bug classes were carried forward across iterations and re-verified at the ceiling - iteration 6's classes `unfalsified_p1_evidence`, `stale_transport_doc`, `completion_claim_unverified` were all covered; graph coverage mode `graphless_fallback` (no code graph available; every search ran as a direct read or exact grep).
- **searchDebt:** none. **hasSearchDebt: false.**
- **ruledOutCandidates:** `resurrected_mcp_surface` (no second copy of the server exists - directory, dist path and Pi config all negative), `dead_surface_claim` (the doctor route binds the surfaces), plus the earlier ruled-outs: the retained trigger phrases and MCP-named leaf directories (written preserve decision), the advisor package's own docs (clean), the agent hook-paragraph surfaces (clean), and the CLI shim's `mcpServerDir` name (functional; folded into F012 as a scope note).
- **cleanSearchProof:** the final gates were re-run against the final finding set and all passed - evidence 17/17 with `file:line`, scope within target, coverage 4/4 dimensions and 2/2 core protocols; the nine falsification attempts in iteration 6 all failed to falsify.

## Audit Appendix

**Convergence summary**

| Iteration | Focus | Ratio | New P0/P1/P2 |
|-----------|-------|-------|----------------|
| 1 | Doctor command family (correctness) | 1.00 | 0/2/1 |
| 2 | Launcher, plugin, `.pi`, caller context (correctness/security) | 0.52 | 0/2/2 |
| 3 | Spec-kit cross-skill surfaces (traceability) | 0.41 | 0/3/1 |
| 4 | Bin map, retained names, coverage (maintainability) | 0.15 | 0/1/2 |
| 5 | Packet completion claims (traceability) | 0.13 | 0/1/2 |
| 6 | Adversarial replay and gates | 0.047 | 0/0/0 |

Stop: hard cap (`iteration_count 6 >= maxIterations 6`), `stopReason: maxIterationsReached`. Telemetry: rolling average 0.0885 (continue), MAD noise floor 0.284 vs latest 0.047 (stop), dimension coverage complete (stop) -> weighted score 0.70 >= 0.60; all nine legal-stop gates passed; no blocked-stop event was required (`blockedBy: []`). Graph convergence telemetry was never populated (v2 search path active, graph unavailable) and does not gate this terminal stop.

**Coverage summary:** correctness (iterations 1, 2, 4, 6), security (2, 6), traceability (3, 5, 6), maintainability (4, 6); core protocols executed in iterations 3, 5 and 6.

**Ruled-out claims (all verified against the tree):** the prompt-time brief is not broken (the Claude shim and the Pi adapter resolve `runtime/`; the stale ENV-REFERENCE walk target is documentation drift); the trust model is not weakened (environment-only, fail-closed); the two accuracy gates are pre-existing failures, independently corroborated; the five-config deregistration is complete; the launcher's rehomed environment defaults are intact; the CLI shim resolves a build that exists.

**Sources reviewed:** 60+ files across `.opencode/commands/doctor/`, `.opencode/bin/`, `.opencode/plugins/`, `.pi/`, `.opencode/skills/system-spec-kit/`, `.opencode/skills/system-skill-advisor/`, `.opencode/install-guides/`, and the parent packet's phases 007/008/009; plus `git log`/`git show` for provenance (read-only). Containment note: `validate.sh`, the advisor CLI, and the test suites were never executed by this lineage - every claim in this report is either a reproduced static observation or is marked as owed.
