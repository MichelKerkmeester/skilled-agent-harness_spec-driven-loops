# Iteration 015 — Final sweep: P1 re-verification, cross-lane containment, strongest per type

**Mode:** research · **Iteration:** 15 of 15 · **Status:** insight · **Write scope:** read-only outside this packet

## Focus

Final iteration, read-only, no write commands executed against the repo. Three jobs: (1) re-verify the registry's P1 findings at the path and line each one cites, marking HOLDS or CHANGED; (2) record the new cross-lane write-containment finding and locate the snapshot scope in the runtime; (3) name the strongest finding of each of the seven types.

## Actions Taken

1. Read the run config for lineage.sessionId and enumerated the registry: 127 key findings, 11 key questions, 8 resolved, 78 carried-forward open questions.
2. Localised the workflows. The auto YAMLs are not under a modes/ directory: they live at .skilled/commands/deep/assets/deep-research-auto.yaml and deep-review-auto.yaml.
3. Enumerated the single-executor branch keys in the research YAML: 1211 if_cli_claude_code, 1275 if_cli_cursor, 1376 if_cli_devin, 1477 if_cli_pi, 1589 if_cli_opencode, 1667 if_cli_codex. An awk scan for else/default/if_unknown across lines 1155-1900 returned nothing.
4. Read EXECUTOR_KINDS. Eight kinds: native, cli-codex, cli-claude-code, cli-opencode, cli-cursor, cli-devin, cli-pi, cli-deepseek-harness. No copilot.
5. Grepped fanout-run.cjs for if_cli_: zero hits. The fan-out script carries no if_cli_ branch surface at all, so the registry's "near 3002" citation points at a surface that does not exist in that file.
6. Read the lock path end to end: acquire at yaml 286 without --owner-pid, the CLI default at loop-lock.cjs 183-186, staleness at loop-lock.ts 641, heartbeat refresh at yaml 599.
7. Read the containment snapshot: snapshotOutOfScopeDirtyPaths at write-containment.ts 1133-1145 takes readStatusEntries over repoRoot, filtered only by artifact containment.
8. Counted quarantine manifests citing cli-classifier.zip across the parent packet: one hit each in 001-spec-kit-core, 003-cli-and-deep-loop and 005-doctor-git-ci-runtime.
9. Attempted to localise the gateway unknown-option parser: append-mode-event.cjs exists and its parseArgs starts at line 58, but the harness call budget closed before the body was read. Recorded UNVERIFIED rather than inferred.

## P1 Re-Verification (Job 1)

| # | Registry P1 | Verdict | Evidence opened this iteration |
|---|---|---|---|
| 1 | Missing if_cli_deepseek_harness branch, yaml near 1579 / fanout-run.cjs near 3002 | **HOLDS (yaml) / CHANGED (fanout)** | Six branch keys, none for deepseek; EXECUTOR_KINDS lists cli-deepseek-harness; no default branch. fanout-run.cjs has zero if_cli_ tokens, so the second half of the citation is wrong even though the defect it points at is real. |
| 2 | Unbound {generation} placeholder, yaml 1327/1428/1530 vs 329 | **HOLDS, restated** | The three dispatchId sites use bare {generation}; the same file binds the namespaced form {config.lineage.generation} at 748. Two spellings for one value inside one file. Only one can be bound by a single token map. |
| 3 | config.executor.type gates, yaml 1198/1204 | **HOLDS, sharpened** | The config template writes "kind": "native"; the runtime reader prefers kind and only falls back to type; the review YAML branches on .kind; the research branch bodies then ship executorKind: '{config.executor.type}'. Gate and payload both read a field the shipped template never writes. |
| 4 | Transient lock without --owner-pid, yaml 286 / review 322 / loop-lock.ts 641 | **CHANGED** | The omission is deliberate: loop-lock.cjs 183-186 marks an owner-less lock transient on purpose, and a heartbeat refresh step exists at yaml 599. The surviving defect is narrower and different — isStaleLoopLock returns ownerDead=false for transient, contradicting the YAML note at 288 which promises reclaim "when its owning process is known to be dead". |
| 5 | Unreachable if_cli_copilot, deep-review-auto.yaml 1239 | **HOLDS** | The review branch is switchable (branch_on is .kind, the canonical field) but no executor kind can select it: EXECUTOR_KINDS has no copilot member and no cli-copilot alias. Dead branch. |
| 6 | minIterations has no code owner | **HOLDS, now self-documented** | The floor lives entirely in agent-executed YAML bookkeeping (636-641, 747-749) and the ledger schema marks deep_research.min_iterations_guard_pass as reserved with the reason "No workflow stages it". The schema admits the gap. |
| 7 | Dark branch-leases-waves module | **HOLDS** | Only two importers, substrate-ports.ts 10 and conditional-fanin/types.ts 19, and both are type-only imports erased at runtime. No script imports it. |
| 8 | cli-classifier phrases missing from hub-router.json | **HOLDS (scoped)** | hub-router.json vocabularyClasses holds only cli-jev-aliases and jev-dispatch; ROUTER.md 18 registers cli-jev as the sole mode. No classifier-generic vocabulary class exists. |
| 9 | Gateway accepts unknown options | **UNVERIFIED** | append-mode-event.cjs exists with parseArgs at line 58 but the body was not read within the call budget. Not inferred either way. |

## Findings

### f-iter015-001 — drift, P1. Executor field name is split across gate, payload and template.
The dispatch gate reads config.executor.type while the config template writes executor.kind and the runtime reader accepts kind first. With the shipped template the branch selector resolves against an undefined field, so no if_cli_* branch matches. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1204] [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json:20] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:204]
Same defect one layer down in the payload: [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1248]. Release introduced: the single-executor surface as shipped in v4.0.0.3. Confidence high. Verify: rg -n "config.executor.(type|kind)" .skilled/commands/deep/assets/.

### f-iter015-002 — bug, P1. A valid executor kind dispatches nothing and says nothing.
EXECUTOR_KINDS admits cli-deepseek-harness; the research YAML has six branches and no default, so a run configured with that kind falls out of the branch block with no dispatch and no operator-visible error. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1589] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:18]
Confidence high on the absence (awk scan of 1155-1900 found no else/default). Verify: rg -n "if_cli_|else:|default" .skilled/commands/deep/assets/deep-research-auto.yaml.

### f-iter015-003 — drift, P1. One value, two token spellings.
Bare {generation} at the three dispatchId sites versus namespaced {config.lineage.generation} in the same file. A single token map cannot bind both, and the bare form has no visible definition site. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1327] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:748]
Confidence medium-high: the spelling split is confirmed; which of the two the renderer binds remains unread.

### f-iter015-004 — drift (doc vs code), P2. The lock note promises a reclaim the transient path cannot perform.
Note at 288 says a lock is stale when its heartbeat is old OR its owning process is known dead. isStaleLoopLock hard-codes ownerDead=false for a transient holder, and the acquire step at 286 is exactly the owner-less call that produces a transient holder. A crashed run therefore blocks the packet for up to 2x TTL, 60 minutes at the configured 1800000 ms. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:288] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:641] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:186]

### f-iter015-005 — over-engineering, P2. if_cli_copilot is unreachable.
No executor kind can select the branch; removing it costs nothing at runtime and removes a false promise to the operator that Copilot dispatch exists. [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:1239] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:18]

### f-iter015-006 — misalignment, P1. The anti-convergence floor is prose-only.
minIterations is computed and compared entirely by agent bookkeeping steps; no code path owns it and the ledger schema records the stem as reserved with a reason that says so. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:636] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts:725]

### f-iter015-007 — over-engineering, P2. branch-leases-waves has no runtime consumer.
Two importers, both import type, so the module is erased from every runtime graph and its vitest suite tests dead code. Removal breaks nothing that executes; it does break the type contracts in mode-contracts and conditional-fanin. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/mode-contracts/substrate-ports.ts:10] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/conditional-fanin/types.ts:19]

### f-iter015-008 — drift, P2. The classifier hub routes only Jev.
hub-router.json registers two Jev-scoped vocabulary classes and ROUTER.md registers cli-jev as the sole mode, so a generic classification request has no class to route on while the hub is named for the general capability. [SOURCE: .skilled/skills/cli-classifier/ROUTER.md:18]

### f-iter015-009 — bug, P1 (new this iteration). The containment baseline is repo-wide, so concurrent lanes quarantine each other's files.
snapshotOutOfScopeDirtyPaths reads git status over repoRoot and filters only paths inside the artifact dir; it never filters by own-lane ownership. Post-dispatch, any path that became dirty after the snapshot is attributed to this lane even when a sibling lane wrote it, and the remedy copies it into quarantine. Observed: cli-classifier.zip is quarantined in the manifest of three sibling research folders of the same parent packet, one hit each in 001-spec-kit-core, 003-cli-and-deep-loop and 005-doctor-git-ci-runtime, from a single package build. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1136] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1143]
The in-code comment at 1138 already names the assumption it breaks: "one snapshot is one lane's baseline" — the baseline is one lane's, the snapshot is the whole repo's. Repro: run grep -rl "cli-classifier\.zip" --include=manifest.json specs/system-speckit/047-v4-release-line-research and count sibling folders; expect >1. Severity P1 for operator trust: the containment signal is a false positive generator whenever two lanes run concurrently, which is exactly what fan-out does. Release introduced: the write-containment layer in v4.0.0.16.

## Questions Answered

None of the strategy key questions is newly answered this iteration, so answeredQuestions is empty. The three jobs were re-verification and census, not question resolution.

## Questions Remaining

- Item 9 above: does append-mode-event.cjs parseArgs reject unknown options? Body unread; parseArgs at line 58 is the entry point.
- Which token map binds {generation} versus {config.lineage.generation}? The spelling split is proven; the binding is not.
- Executor failure handling, eleventh carry: what a single-executor run records for a devin resource_exhausted, or when a builder throws. Still unread in the whole run.
- package_skill.py --strict conformance across the cli-external-orchestration hub, the cli-classifier hub and the deep-loop modes. Structural routing is proven; conformance is not.
- Two of the three *-presentation.txt assets remain unread, and the deep-research twin has never been compared with the deep-review instances.
- Whether any normaliser maps executor.kind onto executor.type before the YAML evaluates branch_on. f-iter015-001 rests on the absence of one; this iteration found no such step, but a renderer-side map would overturn it.

### f-iter015-010 — drift, P2. The append gateway strips the fields the leaf contract requires.

The first gateway call reported ok true and exit 0, so the record is durable. The persisted shape is another matter. The stored record carries seven keys — type, iteration, run, status, newInfoRatio, ruledOut, timestamp — and none of runId, sessionId, lineageId, answeredQuestions or graphEvents. A count over the whole state log returns zero records carrying a graphEvents key, so this is how every iteration of the run has been stored, not a one-call artefact. The delta file keeps the full record including all five dropped fields, so the reducer loses nothing; what is wrong is that the leaf contract names the state-log record as the home for stable identity and graphEvents and the gateway has never put them there. The projecting code path inside the gateway was not localised this iteration, so the mechanism is unproven and the observation is not.

## Job 3 — Strongest Finding Per Type

- **drift:** f-iter015-001, the executor field split. One field, three spellings of truth — template writes kind, gate reads type, payload ships type, reader accepts both.
- **misalignment:** f-iter015-006, the anti-convergence floor. A documented safety floor that no code enforces, with the schema itself recording the stem as reserved.
- **bug:** f-iter015-009, the repo-wide containment baseline. It manufactures false violations between concurrent lanes, and the three sibling quarantine manifests are the observed footprint.
- **improvement:** one render-time lint over the auto YAMLs that asserts every {token} used has a bound definition and every EXECUTOR_KINDS member has a branch with a default fallback. It closes items 1, 2 and 3 of this job at the gate instead of at review.
- **UX:** f-iter015-002 seen from the operator side. Choosing a supported executor produces a silent no-op — no dispatch, no error, no status line. A one-line fail-closed message on unmatched branch is the whole fix.
- **over-engineering:** f-iter015-007, the dark branch-leases-waves module, with f-iter015-005 as the cheaper sibling instance: a branch no configuration can reach.
- **extension:** generate the YAML branch keys from EXECUTOR_KINDS and the hub vocabularyClasses from each ROUTER.md, so the registry is stated once and the drift class closes at the source rather than per instance.
