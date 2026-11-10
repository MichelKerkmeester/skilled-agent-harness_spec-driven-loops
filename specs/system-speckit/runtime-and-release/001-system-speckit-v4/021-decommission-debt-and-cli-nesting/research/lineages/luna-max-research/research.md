---
title: "Deep Research — Memory-database decommission review angle"
description: "Lineage-local synthesis of residue, drift, weakened proof, and gate debt found after the memory-database decommission programme."
research_topic: "Review-angle research over the memory-database decommission programme in this repository: what did it miss?"
session_id: fanout-luna-max-research-1788581555646-udzw72
executor: "cli-codex model=gpt-5.6-luna"
loop_type: research
stop_policy: max-iterations
max_iterations: 20
convergence_threshold: 3
---

# Deep Research Synthesis

## 1. Metadata

- **Lineage:** `luna-max-research`
- **Session:** `fanout-luna-max-research-1788581555646-udzw72`
- **Spec folder:** `.opencode/specs/system-speckit/054-decommission-debt-fixes`
- **Execution mode:** inline detached fan-out executor; no nested iteration dispatch
- **Iterations:** 20 of 20
- **Stop reason:** `maxIterationsReached`
- **Raw findings:** 59 — 1 P0, 32 P1, 26 P2
- **Confidence:** 54 confirmed, 5 inferred
- **Resource map:** [`resource-map.md`](resource-map.md), generated from 20 lineage delta sources
- **Scope note:** This is a research artifact, not a claim that packet 054 or the wider decommission programme is complete. Repository writeback, validator execution, and continuity-writer execution were intentionally omitted because the detached lineage was restricted to this directory.

Evidence labels are preserved throughout: `CONFIRMED` means the cited source or path inspection establishes the contract or mismatch; `INFERRED` means the cited code makes the risk plausible but an adversarial runtime or full-repository execution was intentionally not performed.

## 2. Investigation Report

The review began with the requested evidence order: the 052 programme goal and decision log, the 053 runtime-rename implementation summary, the 054 specification and task list, and the 053 review reports. It then rotated through seven angles: live retired-surface residue; registrations and mirrors; dependency/importer balance; weakened tests; documentation and runtime-mirror parity; successor retrieval and continuity coverage; and gates that can report success while debt remains.

The source-only method followed producers into consumers, resolved named paths directly, compared package declarations with importers, inspected skip and exit branches, and distinguished preserved owners from retired system-spec-kit surfaces. Excluded trees and files were not read, and no repository tooling was run. Every iteration wrote a prompt, markdown record, JSONL delta, and gateway event inside this lineage.

The resulting pattern is not one hidden replacement memory server. It is a set of seams where decommission work stopped at one layer while a launcher, detector, test, README, doctor path, mirror, or gate retained the older contract. The most consequential confirmed defect is the live spec-folder detector's database open; the most consequential proof defects are disabled successor tests and validators whose failure signals can be swallowed.

## 3. Executive Overview

The programme has a partial successor architecture, but its retirement boundary is not yet enforceable.

- **P0:** the live spec-folder detector still imports `DB_PATH` and constructs a database handle. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:15-20,1341-1351]
- **P1 live/decommission debt:** runtime configuration and recovery still expose database paths; memory-named workflow and handler surfaces remain public; worktree launch still exports a runtime database directory; the update doctor still exposes context-index and memory-migration phases. [SOURCE: .opencode/skills/system-spec-kit/runtime/core/config.ts:61-113] [SOURCE: .opencode/commands/doctor/assets/doctor-update.yaml:1-22,87-130,240-328,354-369]
- **P1 registration and operator risk:** Copilot registrations point at absent targets and fall back to repository mutation; Codex and Devin hook commands can convert adapter failure into a successful shell command. [SOURCE: .github/hooks/scripts/session-start.sh:10-18] [SOURCE: .github/hooks/scripts/user-prompt-submitted.sh:10-23] [SOURCE: .codex/hooks.json:3-9,43-59,122-132] [SOURCE: .devin/hooks.v1.json:2-9,137-149]
- **P1 proof debt:** core successor tests are disabled or `fails.skip`; folder-detector coverage can be all-skipped and still exit green; the runtime excludes a nonexistent memory-save test path. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:929-977,1026-1089,1395-1458] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/canonical-save-validation.vitest.ts:125-215] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:81-95,1279-1346]
- **P1 gate debt:** the node-rule bridge discards nonzero status, continuity freshness can be opt-in or pass-style skipped, and the residue sweep does not cover all named retired vocabularies. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:286-314,917-933] [SOURCE: .opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:88-93,296-316,350-409,537-555] [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs:5-6,30,60-118,203-212,423-458]
- **P1 workflow infrastructure:** the detached gateway writes the legacy projection under a nested `research/` path while the configured state path and reducer use the lineage root. This run required an adapter to reduce successful gateway receipts without directly rewriting the state log. [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:130-156] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts:41-64] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:288-304,495-560] [SOURCE: .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2918-2934]

The smallest coherent next move is to establish one ownership table for the retired database, current trigger-index, continuity writer, advisor graph, and deep-loop graph; then make every producer, test, doctor, mirror, and gate refer to that table. Deleting names in isolation would risk breaking the intentionally preserved advisor, IPC, embeddings, and model-server owners.

## 4. Core Architecture

### Retired or suspect boundary

The old boundary is represented by the database fallback in the spec-folder detector, database path/configuration and recovery helpers, memory-index handler naming, memory-management package descriptions, zvec declarations, old doctor phases, and retired-surface residue checks that enumerate only a subset of the old vocabulary. These are not all the same defect: some are live behavior, some are documentation, and some are incomplete detectors. The full distinction is retained in the findings register.

### Current successor boundary

The successor set observed in the source is the trigger-index generator and lookup, ripgrep retrieval conventions, the continuity writer, resume ladder, `/doctor memory` trigger-index diagnostics, and the `@spec-kit/runtime` validation/metadata/hook-adapter library. The current data README explicitly describes `runtime/data/trigger-index.json` and forbids databases/logs there, so it is useful contrast rather than residue. [SOURCE: .opencode/skills/system-spec-kit/runtime/data/README.md:11-35]

The continuity writer is not classified as a retired database server. Its source routes canonical content through the workflow/continuity path, and the root documentation describes it as the canonical continuity writer. The concern is its package naming and the missing freshness/ownership linkage, not the existence of the writer itself. [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:90-105,920-950] [SOURCE: .opencode/skills/system-spec-kit/README.md:374-378]

### Preserved owners that must not be swept away

The skill-advisor MCP/graph, shared IPC server, embedding/model-server surfaces, deep-loop graph database, and third-party MCP names are separate owners. The shared `@modelcontextprotocol/sdk` dependency has a production IPC importer, and `system-skill-advisor/mcp-server` is identified as its own package in the root and Pi documentation. [SOURCE: .opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:14-15] [SOURCE: .opencode/skills/system-spec-kit/shared/ipc/README.md:12-28] [SOURCE: .pi/extensions/README.md:23-30,67-74] [SOURCE: README.md:304-310]

## 5. Technical Specifications

### 5.1 Live code and configuration residue

The detector's database constructor is the hard boundary: it imports shared `DB_PATH` and opens a read-only handle. Runtime configuration and transaction recovery still expose database resolution, while the public scripts and Claude stop hook retain memory workflow terminology. The workflow itself still names predecessor and quality paths, and `memory-index-discovery` remains a live API/handler name. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:15-20,1341-1351] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/storage/transaction-manager.ts:6-9,364-389] [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:1-6] [SOURCE: .opencode/skills/system-spec-kit/runtime/handlers/memory-index-discovery.ts:41-52,133-143]

The same path is exported by the worktree launcher and ignored as a retrieval index/backup location even though the successor doctor points to trigger-index data. [SOURCE: .opencode/bin/worktree-session.sh:224-244,324-326] [.gitignore:302-307] [.opencode/commands/doctor/assets/doctor-memory.yaml:18-35,43-55]

### 5.2 Registrations, mirrors, and operator paths

The four discovery-mirror READMEs undercount their actual resolved symlink inventories after the lifecycle restoration. Direct inventory found resolved counts of 21/18/17/19 versus documented counts of 19/16/15/13; the count mismatch is confirmed as documentation drift, while the exact inventory numbers are an inspection inference. The four non-Copilot runtime registrations resolve; the Copilot targets do not have a current source or built artifact. [SOURCE: .claude/hooks/README.md:9-13,29-37] [SOURCE: .codex/hooks/README.md:9-13,27-35] [SOURCE: .cursor/hooks/README.md:9-13,29-38] [SOURCE: .devin/hooks/README.md:9-13,17-25] [SOURCE: .github/hooks/scripts/session-start.sh:10-18] [SOURCE: .github/hooks/scripts/user-prompt-submitted.sh:10-23]

The Copilot fallback can mutate a repository document when its primary target is absent. Devin operator guidance still tells users to build `mcp-server`, while active CI comments use the old server terminology for runtime/shared/scripts workspaces. [SOURCE: .github/hooks/scripts/user-prompt-submitted.sh:10-23] [SOURCE: .devin/hooks.v1.json:2-10,137-145] [.github/workflows/changed-packet-validation.yml:24-37] [.github/workflows/strict-pass-freshness-report.yml:32-45]

Codex and Devin lifecycle commands use warning-printing fallback chains that can return shell success after the runtime adapter fails. Codex stop cleanup also chains `true` before its diagnostic fallback, making that fallback unreachable; Claude and Devin have related best-effort cleanup behavior without an equivalent structured status. [SOURCE: .codex/hooks.json:3-9,43-59,122-142] [.devin/hooks.v1.json:2-9,137-149,168-177] [.claude/settings.json:157-164]

### 5.3 Dependency and importer balance

The scripts workspace declares `sqlite-vec` and an optional Darwin package, but the bounded production search found no importer, `vec0`, `loadExtension`, or equivalent outside tests/fixtures. Runtime retains `better-sqlite3` around type-only or legacy storage/extraction paths, with no bounded production value importer or public runtime caller established. Pi hook dependency ownership is split deliberately because runtime excludes `hooks/pi/**`, but the aggregate boundary is undocumented. [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:21-30] [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/parity-check.mjs:44-62,950-965] [SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:41-44] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/extraction/entity-extractor.ts:6-15] [SOURCE: .opencode/skills/system-spec-kit/runtime/tsconfig.json:34-53] [.pi/extensions/deep-pi/package.json:28-50]

This does not support a blanket dependency purge: `@modelcontextprotocol/sdk`, `@spec-kit/runtime`, `@spec-kit/shared`, `js-yaml`, and `zod` each have bounded importers or preserved owners. [SOURCE: .opencode/skills/system-spec-kit/shared/package.json:24-27] [.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:14-15] [.opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:6-10] [.opencode/skills/system-spec-kit/runtime/lib/graph/graph-metadata-schema.ts:1-6]

### 5.4 Documentation and mirror drift

The public package identity still says “memory management” and exposes `dist/memory/generate-context.js`; the shared README says the skill advisor is the only database consumer even though the detector opens `DB_PATH`. The system-spec-kit README scopes `MEMORY_DB_PATH` to the advisor while the detector consumes the same variable. Install recovery instructions still expose a system-spec-kit database, the Pi mirror names a nonexistent bare `mcp-server` path, and central docs do not classify retained memory names as successor, compatibility, or debt. [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:1-6,10-19] [.opencode/skills/system-spec-kit/package.json:14-24] [.opencode/skills/system-spec-kit/shared/README.md:339-344] [.opencode/skills/system-spec-kit/README.md:354-370] [.opencode/install-guides/README.md:544-568,904-934,987-998] [.pi/extensions/README.md:59-74]

The runtime core README is more severe: it documents removed `db-state.ts` and `core/index.ts`, database rebinding and lease APIs, and two nonexistent test files. The source inventory showed only `config.ts` and the README under `runtime/core`; the current `runtime/data` README is aligned, which confirms this is local phantom documentation rather than a whole-runtime contract failure. [SOURCE: .opencode/skills/system-spec-kit/runtime/core/README.md:14-23,34-48,53-82,84-136] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts:6-20] [INFERENCE: bounded source inventory found no documented runtime/core implementation files or two named test paths]

### 5.5 Successor retrieval and continuity

The trigger-index corpus walker and ripgrep conventions have different exclusion boundaries. The trigger-index path excludes scratch/research/lineages/tests/fixtures and several generated or vendored roots, while the documented ripgrep recipes exclude only a smaller set. In addition, both successor paths omit ordinary root, runtime-mirror, and install-guide documentation requested by this review. The mismatch is confirmed in code and documentation; its effect on a particular query is inferred because no retrieval command was run. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs:19-31,50-70,97-112,126-145,193-205] [.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:104-107,114-128,140-159,221-230]

The workflow names a `handlers/memory-save.ts` content router that is absent from the bounded runtime inventory, while the actual writer is `scripts/memory/generate-context.ts`. A save can therefore succeed without proving that the committed trigger index reflects the current source corpus: no save-time refresh or current-corpus comparison connects writer and lookup. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1319-1331] [.opencode/skills/system-spec-kit/runtime/handlers/README.md:16-23,55-73] [.opencode/skills/system-spec-kit/runtime/api/index.ts:30-40,43-56] [.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:90-96,920-950] [.opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs:13-15,363-380] [.opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:72-85,150-178]

Resume has a related authority gap: a handover document can be freshness-ranked without packet identity or content-fingerprint binding, and a malformed thin-continuity record rejected by strict parsing can still contribute a manually extracted signal. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts:577-669,1000-1063] [.opencode/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:977-1026] [.opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:350-365,389-435]

### 5.6 Tests and weakened proof

The complete auto-detection suite is disabled; canonical-save integration is an empty skipped placeholder; task-enrichment successor assertions remain behind compact-wrapper TODOs; the canonical-save validator's principal negative and drift checks are `fails.skip`; and the runtime Vitest config excludes an absent `memory-save` test path. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:244-245,350-415] [.opencode/skills/system-spec-kit/scripts/tests/workflow-canonical-save-metadata.vitest.ts:267-281] [.opencode/skills/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:929-977,1026-1089,1395-1458] [.opencode/skills/system-spec-kit/scripts/tests/canonical-save-validation.vitest.ts:125-215] [.opencode/skills/system-spec-kit/runtime/vitest.config.ts:18-26]

Folder-detector functional checks can report green when every required database check is skipped, while profile-keyed database filename coverage is entirely skipped behind the legacy singleton. Memory-learn docs parity is a known-failure/skip pair, and export/naming tests preserve old memory handler budgets without a successor mapping or expiry boundary. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:81-95,162-175,789-840,1279-1346] [.opencode/skills/system-spec-kit/runtime/tests/local-llm-features/profile-db-filename.vitest.ts:23-24,46-84] [.opencode/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:25-59] [.opencode/skills/system-spec-kit/scripts/tests/memory-learn-command-docs.vitest.ts:14-26] [.opencode/skills/system-spec-kit/scripts/tests/test-export-contracts.js:162-175] [.opencode/skills/system-spec-kit/scripts/tests/test-naming-migration.js:27-84]

### 5.7 Gates and detector integrity

The `dist` freshness path can produce an error status that exits zero, making a stale-but-runnable compiled gate appear authoritative. Generated status can be complete while completion evidence disagrees; continuity freshness is opt-in and missing evidence is pass-style skipped; explicit validation bypasses and missing completion sections also return zero. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:17-22,114-115,275-299] [.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:614-626,675-689,894-946] [.opencode/skills/system-spec-kit/runtime/lib/config/capability-flags.ts:176-201] [.opencode/skills/system-spec-kit/runtime/lib/validation/generated-metadata-integrity.ts:202-264,377-394] [.opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:536-558] [.opencode/skills/system-spec-kit/scripts/spec/check-completion.sh:438-451]

The node-rule bridge is a separate false-green seam: the registry runs continuity freshness as a strict-only rule, the child emits nonzero on stale strict output, but the orchestrator checks output/error and not the child status before aggregate `passed` is derived from zero errors. [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:356-363] [.opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:536-558] [.opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:286-314,917-933]

The update doctor still exposes context-index and memory migration phases, deep-loop doctor keeps unqualified retired database patterns, and system-spec-kit doctor can return zero after runtime import failures in advisory mode. The successor trigger-index diagnostic remains branded `/doctor memory` without a compatibility boundary. [SOURCE: .opencode/commands/doctor/update.md:1-8,25-36,69] [.opencode/commands/doctor/assets/doctor-update.yaml:1-22,87-130,240-328,354-369] [.opencode/commands/doctor/assets/doctor-deep-loop.yaml:80-108] [.opencode/skills/system-spec-kit/scripts/doctor.sh:5-17,40-72] [.opencode/commands/doctor/_routes.yaml:35-47] [.opencode/commands/doctor/assets/doctor-memory.yaml:1-35,69-73,231-233]

Finally, the residue sweep's term set covers memory MCP names and the system-spec-memory launcher but not database paths/files, zvec, system-plugins, or old mcp-server identity. Its classifier forces every matching `.jsonl` path into the historical bucket before root checks, so a live JSONL control file could be hidden from `counts.live`. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs:5-6,30,60-118,120-144,203-212,220-227,423-458,524-549] [.opencode/skills/system-spec-kit/scripts/tests/sweep-memory-residue.vitest.ts:94-106]

## 6. Constraints and Limitations

- This lineage was read/research-only. No validator, doctor, retrieval command, test suite, `generate-context.js`, or spec writeback was executed.
- `node_modules`, `dist`, benchmark, changelog, `z_archive`, manual-testing-playbook, feature-catalog, package-lock.json, and trigger-index JSON were outside the reading budget.
- Missing-file statements are based on direct bounded path checks or source inventories. Where a generated artifact or external package could change the runtime result, the finding is marked inferred or the uncertainty is stated.
- The trigger-index/ripgrep parity finding is a contract comparison, not a count of current query hits.
- The handover, malformed-continuity, node-rule, JSONL-classification, and hook-host impact statements identify reachable control-flow risks; adversarial fixtures or full host execution were not created.
- The detached gateway/projection mismatch was observed while persisting this run. The reducer's normal root-state reader and the gateway's nested projection were bridged in-process for this lineage; the adapter itself did not rewrite the state log.

## 7. Integration Patterns

The debt clusters at boundaries rather than inside one isolated module:

| Boundary | Producer | Consumer or gate | Failure mode |
|---|---|---|---|
| Database retirement | `folder-detector.ts`, launcher, runtime config | doctor, shared paths, recovery | Old storage remains reachable or described |
| Registration restoration | JSON hook authorities and symlink mirrors | host-specific adapters | Mirror counts drift; Copilot target/fallback is not owned |
| Continuity successor | `generate-context.ts`, trigger-index generator | workflow, lookup, resume | Writer, index, and resume authority are not freshness-bound |
| Validation | registry and child rules | node/shell bridges, aggregate status | Nonzero or skipped evidence becomes pass-style output |
| Research state | append gateway | configured state log and reducer | Receipt succeeds while consumer reads a different projection |
| Residue detection | term-set sweep | completion/debt decision | Clean result covers only the detector's vocabulary |

The practical implication is that a fix must cross the seam. Removing a declaration without its launcher and doctor contract, or re-enabling a test without its fixture and exit accounting, leaves a different false-green path behind.

## 8. Implementation Guide

The following is the smallest ordered remediation sequence implied by the findings. It is guidance only; this detached research run made no production edits.

1. **Close the P0 database seam.** Decide whether the spec-folder detector is a transitional validator or a retired consumer. If retired, remove its database fallback and the related runtime/launcher/doctor/ignore exposure; if retained, assign an explicit current owner and contract. Address LUNA-007, LUNA-008, LUNA-026, LUNA-041, LUNA-042, and LUNA-047 together.
2. **Make packet status honest.** Complete or explicitly defer 054 tasks and carry the 052 D6 rows into named follow-up ownership. Reconcile the stale 053 reports before any completion claim. Address LUNA-001 through LUNA-006.
3. **Restore blocking successor proof.** Re-enable task-enrichment, canonical-save, auto-detection, folder-detector, and profile-contract checks; remove dead exclusions; make skipped required coverage nonzero. Address LUNA-020 through LUNA-025 and LUNA-048 through LUNA-050.
4. **Fix status propagation.** Treat nonzero node-rule exits as errors, distinguish skipped/not-applicable from success, and require completion/freshness evidence for decommission claims. Address LUNA-033 through LUNA-036 and LUNA-056.
5. **Unify successor ownership.** Publish one table for trigger-index, ripgrep, continuity writer, resume, doctor, advisor, and deep-loop owners; point workflow/docs at real files and make save/index freshness explicit. Address LUNA-009 through LUNA-012, LUNA-029 through LUNA-032, and LUNA-054 through LUNA-055.
6. **Centralize retrieval and residue coverage.** Share an exclusion/corpus manifest between trigger-index and ripgrep, include the intended root/mirror/install-guide docs, and drive residue detection from a versioned retired-surface manifest with explicit JSONL lifecycle roots. Address LUNA-030, LUNA-053, and LUNA-058 through LUNA-059.
7. **Repair host and mirror contracts.** Regenerate mirror inventories, remove or own Copilot fallbacks, fix Devin/Codex status semantics, update operator guidance and CI comments, and document Pi's host dependency boundary. Address LUNA-013 through LUNA-016, LUNA-019, LUNA-043 through LUNA-045.
8. **Remove or own dependencies and phantom docs.** Resolve sqlite-vec/better-sqlite3 ownership, rewrite `runtime/core/README.md`, remove dead test commands, and label compatibility aliases. Address LUNA-017, LUNA-018, LUNA-028, LUNA-038, LUNA-046, and LUNA-051 through LUNA-052.

## 9. Code Examples and Snippets

These are small contract sketches, not edits made by this lineage.

### Preserve child exit status

The node-rule bridge should carry a nonzero child status into the aggregate result before parsing a warning envelope:

```js
const result = runNodeRule(rule);
if (result.status !== 0) {
  errors.push({ rule: rule.id, reason: 'child exited nonzero', status: result.status });
}
```

This targets the gap between the registry's strict continuity rule, the child's exit behavior, and the orchestrator's current output/error-only handling. [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:356-363] [.opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:536-558] [.opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:286-314]

### Require a declared lifecycle root before classifying JSONL

The residue classifier should decide whether a path is under an explicit historical root before applying an extension-based shortcut:

```js
const lifecycle = isUnderHistoricalRoot(path)
  ? 'historical'
  : isUnderLiveRoot(path)
    ? 'live'
    : 'unknown';
```

The current classifier treats the `.jsonl` suffix first, which is why LUNA-059 remains an inferred live-control-file risk. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs:120-144,220-227]

### Bind resume signals to packet identity

Handover and thin-continuity signals should carry a packet identity and content fingerprint that the resume ladder validates before freshness ranking:

```text
signal = { packetId, fingerprint, createdAt, summary }
accept(signal) only when packetId == resolvedPacket && fingerprint == graphFingerprint
```

This is the smallest seam change indicated by the unbound handover and permissive fallback findings. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts:577-669,1000-1063] [.opencode/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:977-1026]

## 10. Testing and Debugging

The strongest proof gap is not a failing assertion; it is the number of ways a suite can avoid asserting the successor contract:

- suite-level `describe.skip` removes the auto-detection integration surface;
- an empty skipped canonical-save suite provides no replacement proof;
- TODO-gated task-enrichment checks omit contamination, provenance, statelessness, and state-leak guarantees;
- `it.fails.skip` leaves the canonical-save negative/drift contract nonblocking;
- functional folder-detector checks can all skip when the expected database is absent;
- the runtime configuration excludes an absent test path;
- memory-learn docs parity and old-name budget tests encode known failure or compatibility without a retirement boundary.

The debugging order should therefore be: make skipped coverage visible in CI; restore the smallest current fixture; run the specific successor assertion; then run the whole gate and inspect its process status. A green result without a nonzero skipped-required-coverage policy is not evidence that the retired surface is gone. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:244-245] [.opencode/skills/system-spec-kit/scripts/tests/workflow-canonical-save-metadata.vitest.ts:267-281] [.opencode/skills/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:929-977] [.opencode/skills/system-spec-kit/scripts/tests/canonical-save-validation.vitest.ts:125-215] [.opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:81-95,1279-1346]

## 11. Recommendations

### Immediate P0/P1 actions

- Remove or explicitly own the detector's database fallback before claiming decommission closure.
- Make all required successor tests executable and make skipped required coverage fail.
- Correct the node-rule status bridge and distinguish skipped, warning, error, and passed states.
- Make continuity/resume signals packet-bound and make trigger-index freshness observable.
- Expand residue detection to every named retired surface, not only memory MCP terminology.
- Align the gateway projection with the configured reducer state path and assert that a successful receipt advances that exact file.

### P2 cleanup after the boundary is decided

- Reconcile package descriptions, `dist/memory` compatibility naming, README inventories, CI comments, doctor aliases, and Pi/Devin operator guidance.
- Remove importerless sqlite-vec declarations or place them under an owned compatibility package; resolve runtime `better-sqlite3` ownership with the database decision.
- Rewrite phantom runtime-core documentation and make named validation paths existence-checked.
- Add mirror-count, corpus-parity, JSONL-lifecycle, and special-exclusion fixtures.

## Eliminated Alternatives

The following hypotheses were investigated and deliberately not promoted to new live-residue findings:

| Hypothesis | Why it was eliminated |
|---|---|
| All final 053 P2 review rows are still current | 052 records two as fixed; the report is stale evidence, not a live inventory. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:124-127] |
| Every `mcp-server` occurrence is retired system-spec-kit runtime | Advisor MCP, code-mode launchers, and third-party names have separate owners; only the bare Pi path and Devin guidance were retained as scoped findings. [SOURCE: .pi/extensions/README.md:23-30,67-74] [SOURCE: README.md:304-310] |
| Every mirror registration was dropped | Direct inventories found resolved non-Copilot links; the defect is count drift and Copilot ownership, not wholesale loss. [SOURCE: .claude/settings.json:96-134] [SOURCE: .codex/hooks.json:3-41] [SOURCE: .cursor/hooks.json:4-39] [SOURCE: .devin/hooks.v1.json:2-32] |
| Shared MCP SDK is an orphaned dependency | Shared IPC imports `StdioServerTransport` and assigns the bridge to current code-index/advisor owners. [SOURCE: .opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:14-15] [SOURCE: .opencode/skills/system-spec-kit/shared/ipc/README.md:12-28] |
| All `better-sqlite3`/runtime dependencies are unused | Bounded importers or preserved ownership exist; the findings are limited to sqlite-vec and the legacy runtime boundary. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:16-20] [.opencode/skills/system-spec-kit/runtime/lib/graph/graph-metadata-schema.ts:1-6] |
| The trigger-index exclusions are accidental | Tests, fixtures, lineages, and vendored paths are intentionally excluded; the finding is the root/mirror/install-guide omission and ripgrep mismatch. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs:22-31,53-70] |
| `/doctor memory` is a dangling memory-server command | Its asset diagnoses the current trigger index; the finding is successor branding and the still-live `/doctor:update` predecessor phases. [SOURCE: .opencode/commands/doctor/assets/doctor-memory.yaml:1-35,69-73,231-233] [.opencode/commands/doctor/assets/doctor-update.yaml:354-369] |
| `runtime/data/README.md` documents the retired database | It describes the trigger-index successor and explicitly forbids databases/logs. [SOURCE: .opencode/skills/system-spec-kit/runtime/data/README.md:11-35] |
| The continuity writer is the retired database server | Its source routes canonical continuity content; the issue is package/ownership/freshness terminology. [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:90-105,920-950] |
| The deep-loop graph database is system-spec-kit residue | Its paths are explicitly rooted under the deep-loop owner; only unqualified forbidden-policy patterns were retained. [SOURCE: .opencode/commands/doctor/assets/doctor-deep-loop.yaml:80-108] |
| The final pass found a new zvec/system-plugins registration | The bounded exact authority scan found no new active target; detector coverage is already captured by LUNA-058. [INFERENCE: bounded exact-file scan of active authority paths] |

## Divergence Map

No formal pivot, wave, or council branch was recorded: `completedPivots=0`, `failedPivots=0`, and `pivotOverrides=0`. The investigation nevertheless broadened across 20 explicit focus tracks rather than stopping when the convergence telemetry dipped below the threshold. The sequence moved from programme charter, to live surfaces, registrations, dependencies, tests, docs, retrieval, gates, doctor migration, launcher/CI, hooks, package identity, skipped tests, phantom docs, corpus parity, resume authority, exit semantics, detached projection, residue coverage, and final cross-angle audit.

| Direction | Result | Evidence retained |
|---|---|---|
| Live database and memory surface | Saturated with one P0 and related P1/P2 boundary findings | LUNA-007 through LUNA-012, LUNA-026, LUNA-041, LUNA-046, LUNA-047 |
| Registrations and mirrors | No wholesale non-Copilot loss; count drift, absent Copilot owner, fallback/status debt | LUNA-013 through LUNA-016, LUNA-044, LUNA-045 |
| Dependency graph | sqlite-vec importer gap and runtime legacy ownership; preserved SDK/importers ruled out | LUNA-017 through LUNA-019, LUNA-047 |
| Successor tests | Broad disabled/skip surface; no convergence claim from green tests | LUNA-020 through LUNA-025, LUNA-048 through LUNA-050 |
| Documentation and corpus | Multiple stale contracts plus trigger-index/ripgrep mismatch | LUNA-027 through LUNA-030, LUNA-043, LUNA-051 through LUNA-053 |
| Gates and continuity | Status, freshness, resume, and residue-detector seams remain open | LUNA-031 through LUNA-040, LUNA-054 through LUNA-059 |

The remaining frontier is operational rather than lexical: execute the scoped fixes, activate blocking proof, and verify the resulting artifacts under the repository's authoritative gates. This report does not claim that the frontier converged merely because the iteration cap was reached.

## 12. Open Questions

The configured stop policy required all 20 iterations, so convergence telemetry was not an early exit. The following questions remain open or only partially answered:

1. **Q1 — Live retired surface:** Is the detector database path transitional or should it be removed, and does any remaining runtime/database owner have an explicit successor contract? **Status: expanded, not resolved.**
2. **Q2 — Registrations and mirrors:** Should Copilot have a real source/build owner, a stdout-only fallback, or no registration; and should mirror counts be generated? **Status: expanded, not resolved.**
3. **Q3 — Dependencies/importers:** What is the intended final owner of sqlite-vec and runtime `better-sqlite3`, and when does each compatibility package expire? **Status: expanded, not resolved.**
4. **Q4 — Tests:** Which skipped/known-failure suites are to be restored as blocking successor tests, and which contracts are intentionally retired? **Status: expanded, not resolved.**
5. **Q5 — Documentation:** Which retained memory names are successor APIs, compatibility aliases, or debt, and which phantom runtime-core docs should be removed? **Status: expanded, not resolved.**
6. **Q6 — Successor guarantees:** Should save refresh the trigger index, should both retrieval lanes share a corpus manifest, and what packet binding should resume require? **Status: expanded, not resolved.**
7. **Q7 — Gate integrity:** Which freshness, status, skip, residue, and projection failures must block completion, and which are report-only diagnostics? **Status: expanded, not resolved.**

The 052-named stalled review artifact also remains unestablished: its exact path should be verified or the LOG pointer corrected. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:124-126] [INFERENCE: the named attempt-1 artifact may be absent, relocated, or represented only by the LOG]

## 13. Future-Proofing and Maintenance

- Maintain a versioned retired-surface manifest covering database paths/files, memory MCP tools, launchers, zvec, system-plugins, old package identities, and related config names. Use it for both scans and completion evidence.
- Maintain one corpus/exclusion manifest for trigger-index and ripgrep, with fixtures proving included root/mirror/install-guide docs and excluded tests/fixtures/lineages.
- Make README named-file checks and mirror count checks part of the owning package's blocking validation.
- Treat required skips, missing special exclusions, missing continuity evidence, and nonzero child processes as explicit machine statuses, not warnings that aggregate into pass.
- Bind every continuity/resume signal to packet identity and fingerprint; record trigger-index freshness against the source corpus.
- Keep compatibility aliases time-bounded and owner-labelled, especially `/doctor memory`, `dist/memory`, and retained `memory-*` handler names.
- Assert that gateway receipts advance the exact state file consumed by reducer and synthesis. A projection receipt alone is insufficient.

## 14. API Reference

### Current successor surfaces observed

| Surface | Role | Evidence |
|---|---|---|
| `/memory:search` | Trigger-index lookup plus ripgrep recipes | [SOURCE: .opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:104-159,221-230] |
| `/memory:save` | Canonical continuity writer | [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:90-105,920-950] |
| `/speckit:resume` | Resume/recovery ladder | [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts:577-669,1000-1063] |
| `/doctor memory` | Trigger-index diagnostics | [SOURCE: .opencode/commands/doctor/assets/doctor-memory.yaml:1-35,69-73,231-233] |
| `lookup-trigger-index.mjs` | Gate-1 retrieval | [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:72-105,127-204] |
| `@spec-kit/runtime` | Validation, metadata, and hook-adapter library | [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:286-348,917-933] |

### Names requiring retirement or an explicit compatibility owner

`system-spec-memory`, `spec-memory`, `/memory:manage`, `/memory:learn`, the old database fallback, zvec declarations, `system-plugins`, unqualified old `mcp-server` package identity, `memory-index-discovery`, `dist/memory`, and phantom `runtime/core` database APIs must not be treated as current by default. The advisor's own `mcp-server` package and deep-loop graph are excluded from this list when their owner context is explicit. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs:5-6,60-118] [SOURCE: .opencode/skills/system-spec-kit/runtime/core/README.md:14-23,53-124] [SOURCE: .pi/extensions/README.md:23-30,67-74] [SOURCE: .opencode/commands/doctor/assets/doctor-deep-loop.yaml:80-108]

## 15. Findings Register

The following register preserves every raw finding emitted by the 20 iterations. Each row includes severity, confidence, source evidence, and the smallest proposed fix. The reducer's 56 `keyFindings` metric is deduplicated registry output; this table intentionally retains all 59 delta findings.

| ID | Severity | Confidence | Finding | Evidence | Smallest fix |
|---|---|---|---|---|---|
| LUNA-001 | P1 | Confirmed | 054 is not yet closeable | `specs/system-speckit/054-decommission-debt-fixes/spec.md:47-57`; `tasks.md:47-62`; `acceptance-criteria.md:55-63` | Complete or explicitly defer each open task with evidence before claiming closure. |
| LUNA-002 | P1 | Confirmed | 052 carries D6 debt outside 054 | `specs/system-speckit/052-memory-decommission-landing/goal.md:60-62,116-122,197-208` | Carry each deferred row into a named follow-up or approved packet extension. |
| LUNA-003 | P2 | Confirmed | 053 PASS report retains superseded P2s | `specs/system-speckit/053-spec-kit-runtime-rename/review/lineages/luna-max-pass3/review-report.md:73-118`; `specs/system-speckit/052-memory-decommission-landing/goal.md:124-127` | Mark rows superseded or regenerate the report against the final tree. |
| LUNA-004 | P2 | Confirmed | 053 summary contradicts its review status | `specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:180-181,205-211` | Reconcile limitation and acceptance status with the authoritative review artifact. |
| LUNA-005 | P2 | Confirmed | 053 carried unfinished tests and stale references | `specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:197-203,222-226` | Add isolated reproduction and ownership rows to the debt inventory. |
| LUNA-006 | P2 | Inferred | Named stalled review artifact is not established | `specs/system-speckit/052-memory-decommission-landing/goal.md:124-126`; `specs/system-speckit/053-spec-kit-runtime-rename/review/lineages/luna-max-pass3/review-report.md:58-71`; [INFERENCE: artifact may be absent, relocated, or represented only by the LOG] | Verify the path and preserve the report or correct the LOG pointer. |
| LUNA-007 | P0 | Confirmed | Live spec-folder detector opens the retired database | `.opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:15-20,1341-1351`; `.opencode/skills/system-spec-kit/scripts/spec-folder/index.ts:9-35`; `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:783-787`; `.opencode/skills/system-spec-kit/shared/paths.ts:143-171` | Remove the database fallback or explicitly re-home it under a documented successor owner. |
| LUNA-008 | P1 | Confirmed | Renamed runtime still ships database configuration and recovery | `.opencode/skills/system-spec-kit/runtime/core/config.ts:61-113`; `.opencode/skills/system-spec-kit/runtime/lib/storage/transaction-manager.ts:6-9,364-389`; `.opencode/skills/system-spec-kit/runtime/tsconfig.json:34-45`; [INFERENCE: no non-test importer found in bounded search] | Delete orphaned legacy modules or document and test a surviving owner. |
| LUNA-009 | P1 | Confirmed | Scripts package and hook still present a memory workflow | `.opencode/skills/system-spec-kit/scripts/package.json:1-6`; `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:1-8,68-98`; `.opencode/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:69-78` | Rename public memory terminology after tracing hook/install consumers, preserving continuity behavior. |
| LUNA-010 | P1 | Confirmed | Workflow still owns memory-named predecessor and quality paths | `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:80-101,1288-1302,1390-1409` | Map predecessor and quality behavior to packet-continuity concepts or explicitly own it. |
| LUNA-011 | P1 | Confirmed | Runtime ENV reference contradicts database ownership | `.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:14-18,114-130,360-374` | Align ownership with importer graph and remove stale launcher rows if the consumer is deleted. |
| LUNA-012 | P2 | Confirmed | Live API path remains named memory-index-discovery | `.opencode/skills/system-spec-kit/runtime/api/graph-refresh.ts:9-17`; `.opencode/skills/system-spec-kit/runtime/handlers/memory-index-discovery.ts:41-52,133-143`; `.opencode/skills/system-spec-kit/runtime/handlers/README.md:18-23` | Rename module, warning prefix, READMEs, and import seam together. |
| LUNA-013 | P2 | Confirmed | Discovery-mirror inventories are stale | `.claude/hooks/README.md:9-13,29-37`; `.codex/hooks/README.md:9-13,27-35`; `.cursor/hooks/README.md:9-13,29-38`; `.devin/hooks/README.md:9-13,17-25`; [INFERENCE: lstat inventory found 21/18/17/19 versus 19/16/15/13] | Regenerate mirror counts and add a parity assertion. |
| LUNA-014 | P1 | Confirmed | Copilot registrations point at absent source/build targets | `.github/hooks/scripts/session-start.sh:10-18`; `.github/hooks/scripts/user-prompt-submitted.sh:10-23`; `.opencode/skills/system-spec-kit/runtime/hooks/README.md:18-25,58-70`; [INFERENCE: targets absent in bounded inventory] | Remove nominal registration and document fallback, or add a real source/build owner and test. |
| LUNA-015 | P1 | Confirmed | Copilot fallback mutates a repository document without freshness guard | `.github/hooks/scripts/user-prompt-submitted.sh:10-23`; `.github/hooks/scripts/session-start.sh:10-18`; [INFERENCE: missing target makes fallback reachable] | Make fallback stdout-only or give generated file an explicit safe ownership contract. |
| LUNA-016 | P2 | Confirmed | Devin failure guidance still instructs operators to build mcp-server | `.devin/hooks.v1.json:2-10,137-145,34-46` | Use the runtime build command consistently and scan active hook configs for stale names. |
| LUNA-017 | P1 | Confirmed | Scripts declares sqlite-vec without bounded production importer | `.opencode/skills/system-spec-kit/scripts/package.json:21-30`; `.opencode/skills/system-spec-kit/scripts/retrieval/parity-check.mjs:44-62,950-965`; [INFERENCE: no importer outside tests/fixtures] | Remove declarations or move them to an owned compatibility package with importer/test. |
| LUNA-018 | P1 | Confirmed | Runtime retains native SQLite dependency around a legacy subsystem | `.opencode/skills/system-spec-kit/runtime/package.json:41-44`; `.opencode/skills/system-spec-kit/runtime/core/config.ts:5-9,61-113`; `.opencode/skills/system-spec-kit/runtime/lib/extraction/entity-extractor.ts:6-15`; `.opencode/skills/system-spec-kit/runtime/lib/storage/transaction-manager.ts:6-10,364-389`; [INFERENCE: no value importer/public caller found] | Remove legacy subsystem and dependency together, or give it a documented owner and recovery test. |
| LUNA-019 | P2 | Inferred | Pi host dependency ownership is split but undocumented | `.opencode/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts:1-6`; `.opencode/skills/system-spec-kit/runtime/tsconfig.json:34-53`; `.pi/extensions/README.md:18-29`; `.pi/extensions/deep-pi/package.json:28-50`; [INFERENCE: runtime excludes hooks/pi and Pi owns peer] | Document/package the host-provided peer boundary; do not add it to runtime only to satisfy type import. |
| LUNA-020 | P1 | Confirmed | Auto-detection integration suite is disabled | `.opencode/skills/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:244-245,350-415` | Port fixtures to current successor shape and remove suite-level skip. |
| LUNA-021 | P1 | Confirmed | Canonical-save integration is an empty skipped placeholder | `.opencode/skills/system-spec-kit/scripts/tests/workflow-canonical-save-metadata.vitest.ts:267-281` | Add executable plan-only/full-auto assertions or replace with current contract. |
| LUNA-022 | P1 | Confirmed | Folder-detector DB tests can exit green when all checks skip | `.opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:81-95,162-175,789-840,1279-1346` | Fail closed for missing required coverage or replace with successor tests and nonzero skip gate. |
| LUNA-023 | P1 | Confirmed | Profile-keyed DB filename contract is entirely skipped | `.opencode/skills/system-spec-kit/runtime/tests/local-llm-features/profile-db-filename.vitest.ts:23-24,46-84`; `.opencode/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:25-59` | Activate supported profile contract or remove abandoned contract and resolver setup. |
| LUNA-024 | P2 | Confirmed | Memory-learn docs parity is a known-failure and skip pair | `.opencode/skills/system-spec-kit/scripts/tests/memory-learn-command-docs.vitest.ts:14-26,27-58` | Make successor/removal wording assertions active instead of skipped. |
| LUNA-025 | P2 | Inferred | Export and naming tests preserve old memory handler contracts | `.opencode/skills/system-spec-kit/scripts/tests/test-export-contracts.js:162-175`; `.opencode/skills/system-spec-kit/scripts/tests/test-naming-migration.js:27-84`; [INFERENCE: no successor mapping or expiry boundary] | Replace old-name budgets with successor contract or explicit compatibility owner/expiry test. |
| LUNA-026 | P1 | Confirmed | Docs scope MEMORY_DB_PATH to advisor while detector consumes it | `.opencode/skills/system-spec-kit/README.md:354-370`; `.opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:15-22,1341-1354`; `.opencode/skills/system-spec-kit/runtime/core/config.ts:61-75` | Remove detector legacy branch or document separate non-overlapping ownership. |
| LUNA-027 | P1 | Confirmed | Install recovery exposes system-spec-kit database after no-database contract | `.opencode/install-guides/README.md:544-568,904-934,987-998`; `README.md:953-955` | Remove retired recovery commands or name exact surviving owner and contract. |
| LUNA-028 | P2 | Confirmed | Pi mirror names nonexistent bare mcp-server post-compaction path | `.pi/extensions/README.md:59-74`; `.opencode/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs:1-17`; [INFERENCE: relative base resolves bare path outside system-spec-kit] | Use full current runtime hook path and identify current adapter owner. |
| LUNA-029 | P2 | Inferred | Memory-named successor and retired-code boundaries lack ownership map | `.opencode/skills/system-spec-kit/README.md:284-294,328-337,354-374`; `.opencode/skills/system-spec-kit/ARCHITECTURE.md:130-140`; `.opencode/skills/system-spec-kit/runtime/README.md:28-37`; [INFERENCE: docs do not classify retained names] | Publish ownership table or rename/remove unsupported names. |
| LUNA-030 | P2 | Confirmed | Successor retrieval omits root, mirror, and install-guide docs | `.opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs:19-30,118-145`; `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:138-147`; [INFERENCE: requested docs outside both root sets] | Add documentation roots to both lanes or enforce a separate route. |
| LUNA-031 | P1 | Confirmed | Workflow names missing canonical memory-save content router | `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:1319-1331`; `.opencode/skills/system-spec-kit/runtime/handlers/README.md:16-23,55-73`; `.opencode/skills/system-spec-kit/runtime/api/index.ts:30-40,43-56`; `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:920-950`; [INFERENCE: no runtime handler/content-router importer found] | Point docs/workflow at actual writer or restore narrow router with end-to-end save test. |
| LUNA-032 | P2 | Inferred | Save completion does not prove current trigger-index representation | `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:90-96`; `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:1580-1588`; `.opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs:13-15,363-380`; `.opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:72-85,150-178`; [INFERENCE: no save-time refresh/current-corpus comparison] | Refresh after relevant changes or make stale index state an explicit lookup diagnostic. |
| LUNA-033 | P1 | Confirmed | Dist-freshness error status can exit zero and vanish from validate | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:275-299`; `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:614-626,675-689,894-946`; [INFERENCE: error result invisible to caller] | Return dedicated nonzero freshness code and make validate stop. |
| LUNA-034 | P1 | Confirmed | Generated complete status can disagree with completion evidence | `.opencode/skills/system-spec-kit/runtime/lib/config/capability-flags.ts:176-201`; `.opencode/skills/system-spec-kit/runtime/lib/validation/generated-metadata-integrity.ts:202-264,377-394`; `.opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:917-933` | Enforce status/completion consistency or require explicit legacy waivers. |
| LUNA-035 | P1 | Confirmed | Continuity freshness is opt-in and missing evidence is pass-style skipped | `.opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:88-93,296-316,350-409,537-555` | Distinguish skipped/not-applicable from success and require usable evidence for completion. |
| LUNA-036 | P2 | Confirmed | Validation bypasses and missing completion sections return zero | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:17-22,114-115`; `.opencode/skills/system-spec-kit/scripts/spec/check-completion.sh:438-451` | Emit machine-readable skipped status and require explicit waiver for completion proof. |
| LUNA-037 | P1 | Confirmed | doctor:update exposes retired context-index and memory migration workflow | `.opencode/commands/doctor/update.md:1-8,25-36,69`; `.opencode/commands/doctor/assets/doctor-update.yaml:1-22,87-130,240-328,354-369`; `.opencode/commands/doctor/assets/doctor-memory.yaml:21-35,43-55`; [INFERENCE: live router makes obsolete phases reachable] | Remove/deprecate retired phases and define one current update workflow. |
| LUNA-038 | P2 | Confirmed | Deep-loop doctor retains unqualified retired database patterns | `.opencode/commands/doctor/assets/doctor-deep-loop.yaml:80-108`; [INFERENCE: policy residue, not proof of matching file] | Delete obsolete patterns or replace with rooted retired-path assertions. |
| LUNA-039 | P1 | Confirmed | system-spec-kit doctor exits zero after runtime import failures | `.opencode/skills/system-spec-kit/scripts/doctor.sh:5-17,40-72` | Make dependency failures nonzero by default or require caller to reject advisory status. |
| LUNA-040 | P2 | Confirmed | Trigger-index doctor remains branded /doctor memory without boundary | `.opencode/commands/doctor/_routes.yaml:35-47`; `.opencode/commands/doctor/assets/doctor-memory.yaml:1-35,69-73,231-233`; `.opencode/commands/doctor/assets/doctor-speckit-presentation.txt:70-96` | Rename route or document a time-bounded successor-only alias. |
| LUNA-041 | P1 | Confirmed | Worktree launcher exports live system-spec-kit runtime database directory | `.opencode/bin/worktree-session.sh:224-244,324-326`; `.opencode/skills/system-spec-kit/runtime/core/config.ts:61-113`; `.opencode/skills/system-spec-kit/shared/paths.ts:143-171`; `.opencode/commands/doctor/assets/doctor-memory.yaml:18-35`; [INFERENCE: actual file creation/use not proven in bounded runtime search] | Remove export after final consumer or re-home surviving owner under current data contract. |
| LUNA-042 | P2 | Confirmed | runtime/database remains labeled retrieval index and backup | `.gitignore:302-307`; `.opencode/commands/doctor/assets/doctor-memory.yaml:18-35,43-55` | Remove obsolete ignore rule or relabel compatibility cleanup and add current data boundary. |
| LUNA-043 | P2 | Confirmed | Active CI comments still describe renamed workspace as mcp-server/server | `.github/workflows/changed-packet-validation.yml:24-37`; `.github/workflows/strict-pass-freshness-report.yml:32-45` | Update comments to current runtime/shared/scripts workspace names. |
| LUNA-044 | P1 | Confirmed | Codex and Devin hooks turn adapter failures into successful shell commands | `.codex/hooks.json:3-9,43-59,122-132`; `.devin/hooks.v1.json:2-9,137-149`; [INFERENCE: host success after fallback not directly observed] | Expose machine-detectable failure or structured drift signal while preserving intended user message. |
| LUNA-045 | P2 | Confirmed | Codex Stop cleanup has unreachable diagnostic fallback | `.codex/hooks.json:122-142`; `.claude/settings.json:157-164`; `.devin/hooks.v1.json:168-177` | Replace unconditional-true chain with one best-effort wrapper and structured warning/status. |
| LUNA-046 | P2 | Confirmed | Scripts package identity exposes memory management and dist/memory | `.opencode/skills/system-spec-kit/scripts/package.json:1-6,10-19`; `.opencode/skills/system-spec-kit/package.json:14-24`; `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:90-105,920-950` | Rename/re-home entrypoint or mark dist/memory as successor compatibility alias. |
| LUNA-047 | P2 | Confirmed | Shared README says advisor is only database consumer while detector opens DB_PATH | `.opencode/skills/system-spec-kit/shared/README.md:339-344`; `.opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:15-20,1341-1351`; `.opencode/skills/system-spec-kit/runtime/core/config.ts:61-113`; `.opencode/skills/system-spec-kit/runtime/lib/storage/transaction-manager.ts:6-10,364-389` | Remove/re-home detector fallback or correct ownership map and retirement boundary. |
| LUNA-048 | P1 | Confirmed | Task-enrichment successor assertions disabled behind fixture TODOs | `.opencode/skills/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:929-977,1026-1089,1395-1458` | Restore compact-wrapper fixtures and assertions or enforce successor equivalents. |
| LUNA-049 | P1 | Confirmed | Canonical-save validator negative/drift contract is entirely fails.skip | `.opencode/skills/system-spec-kit/scripts/tests/canonical-save-validation.vitest.ts:125-215` | Repair seams and re-enable tests or move them into blocking regression suite. |
| LUNA-050 | P2 | Confirmed | Vitest excludes nonexistent runtime/tests/memory-save.vitest.ts | `.opencode/skills/system-spec-kit/runtime/vitest.config.ts:18-26`; [INFERENCE: direct path inspection found no file] | Remove dead exclusion or point to current replacement and assert exclusions resolve. |
| LUNA-051 | P1 | Confirmed | runtime/core README documents removed db-state/core-index subsystem | `.opencode/skills/system-spec-kit/runtime/core/README.md:14-23,34-48,53-82,84-124`; `.opencode/skills/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts:6-20`; [INFERENCE: source inventory only config.ts and README] | Rewrite README around config.ts or restore owned subsystem; replace stale fixtures. |
| LUNA-052 | P2 | Confirmed | runtime core README names two missing test files | `.opencode/skills/system-spec-kit/runtime/core/README.md:128-136`; [INFERENCE: two direct paths absent while unit-path-security exists] | Update recipe and enforce source-to-README named-file checks. |
| LUNA-053 | P1 | Confirmed | Trigger-index and ripgrep successors use different exclusions | `.opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs:19-31,50-70,97-112,126-145,193-205`; `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:104-107,114-128,140-147,152-159,221-230`; [INFERENCE: lanes can produce different candidate sets] | Centralize exclusion policy and add included/excluded parity fixture. |
| LUNA-054 | P1 | Confirmed | Resume freshness-ranks unbound handover over validated continuity | `.opencode/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts:577-619,1000-1063`; `.opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:350-365,389-435`; [INFERENCE: newer unbound handover could steer resume] | Require packet identity/fingerprint and rank only validated signals. |
| LUNA-055 | P2 | Confirmed | Resume consumes malformed thin continuity through fallback | `.opencode/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:977-1026`; `.opencode/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts:622-669`; [INFERENCE: rejected record with fields can still influence resume] | Make fallback explicit legacy-only with marker/warning or return no signal after strict failure. |
| LUNA-056 | P1 | Confirmed | Node-rule nonzero exit discarded so strict freshness can pass | `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:356-363`; `.opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:536-558`; `.opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:286-314,917-933`; [INFERENCE: aggregate consumers can accept stale continuity] | Treat nonzero node exits as errors or map strict warnings to errors before `passed`. |
| LUNA-057 | P1 | Confirmed | Gateway projection path differs from configured/reducer state log | `.opencode/commands/deep/assets/deep-research-auto.yaml:130-156`; `.opencode/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts:41-64`; `.opencode/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:288-304,495-560`; `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2918-2934`; [INFERENCE: successful receipt advanced nested projection while root stayed at two records] | Align projection relativePath or consumers and assert successful append advances configured log. |
| LUNA-058 | P1 | Confirmed | Residue sweep omits database, zvec, system-plugins, and old identity vocabularies | `.opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs:5-6,30,60-118,203-212,423-458`; [INFERENCE: omitted live term can survive clean exit] | Use versioned retired-surface manifest or independent detectors/report fields. |
| LUNA-059 | P2 | Confirmed | Matching JSONL paths are forced into historical bucket | `.opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs:120-144,220-227,437-458,524-549`; `.opencode/skills/system-spec-kit/scripts/tests/sweep-memory-residue.vitest.ts:94-106`; [INFERENCE: live JSONL control record can be hidden; no fixture synthesized] | Check declared historical roots before extension shortcut and add live JSONL fixture. |

## References

- [`resource-map.md`](resource-map.md) — 134 references extracted from the 20 lineage delta files, with per-source provenance.
- [`deep-research-strategy.md`](deep-research-strategy.md) — reducer-owned questions, exhausted directions, and iteration focus history.
- [`findings-registry.json`](findings-registry.json) — reducer projection containing deduplicated key findings and metrics.
- [`iterations/`](iterations/) and [`deltas/`](deltas/) — complete per-iteration evidence trail; each finding's original citations are retained there.

## Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 20
- Questions answered: 0 / 7
- Remaining questions: Q1, Q2, Q3, Q4, Q5, Q6, Q7 (all expanded or partially answered; none resolved)
- Last 3 iteration summaries: run 18: Detached lineage projection path (0.94); run 19: Residue-sweep coverage (0.90); run 20: Final cross-angle audit (0.28)
- Convergence threshold: 3
- Divergence summary: no formal pivots, failed pivots, overrides, or council artifacts; the review broadened through all seven requested angles and retained an open remediation frontier.
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.

## Appendix — Iteration Trail

| # | Focus | New-info ratio | Findings |
|---:|---|---:|---:|
| 1 | Programme charter baseline from 052/053/054 and 053 review reports | 1.00 | 6 |
| 2 | Live retired-surface residue: database, memory workflow, launcher, runtime identity | 0.95 | 6 |
| 3 | Registrations, symlinks, hooks, and doctor assets | 0.90 | 4 |
| 4 | Dependency and importer balance across shared, scripts, and runtime | 0.86 | 3 |
| 5 | Tests, fixtures, skips, and weakened coverage | 0.84 | 6 |
| 6 | Documentation and runtime mirror parity | 0.82 | 4 |
| 7 | Successor retrieval and continuity coverage | 0.80 | 3 |
| 8 | Gate integrity and false-green outcomes | 0.79 | 4 |
| 9 | Deferred validator, doctor, and migration debt | 0.78 | 4 |
| 10 | Active launcher, ignore, and CI identity residue | 0.75 | 3 |
| 11 | Hook fallback status and cleanup observability | 0.72 | 2 |
| 12 | Package identity and database ownership contracts | 0.68 | 2 |
| 13 | Skipped successor and canonical-save tests | 0.84 | 3 |
| 14 | Phantom runtime core documentation | 0.79 | 2 |
| 15 | Trigger-index versus ripgrep corpus parity | 0.81 | 1 |
| 16 | Continuity writer, freshness metadata, and resume authority | 0.86 | 2 |
| 17 | Validation bridge exit semantics | 0.91 | 1 |
| 18 | Detached lineage projection path | 0.94 | 1 |
| 19 | Residue-sweep coverage | 0.90 | 2 |
| 20 | Final cross-angle audit | 0.28 | 0 |

