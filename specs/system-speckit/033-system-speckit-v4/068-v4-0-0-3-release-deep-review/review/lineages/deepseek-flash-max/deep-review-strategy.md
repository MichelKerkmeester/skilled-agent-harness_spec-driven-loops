---
title: "Deep Review Strategy — v4.0.0.2..v4.0.0.3 (lineage: deepseek-flash-max)"
trigger_phrases: []
---

# Deep Review Strategy

## Review Charter

- Target: the `v4.0.0.2..v4.0.0.3` release range (633 commits), reviewed through the packet `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review`.
- Fan-out lineage: `deepseek-flash-max` (`cli-pi`, model `opencode-go/deepseek-v4.1-flash`, effort `max`), artifact dir `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/lineages/deepseek-flash-max`.
- Focus area (lead steer): `.skilled/skills/system-spec-kit/` runtime and shared code; `.skilled/skills/system-deep-loop/` (fan-out, gateway, locks, dispatch); `.skilled/skills/cli-external-orchestration/` and `.skilled/skills/cli-classifier/` (Jev); `.skilled/skills/system-skill-advisor/`. Later iterations spend on cross-skill contracts between these areas.
- Dimensions: correctness, security, traceability, maintainability.
- Scope: the 1999-file `goal-file-manifest.txt`; this lineage concentrates on its share (~1300 entries in the four focus areas) and follows any finding that points at a caller, contract, doc or test outside the area.
- Stop policy: `max-iterations` (15); convergence signals are telemetry only — a converged signal broadens the next angle instead of stopping.
- Success criteria: every dimension covered; core protocols (`spec_code`, `checklist_evidence`) executed at least once with full coverage; findings carry file:line or commit evidence; final report carries the 9 core sections; stopReason `maxIterationsReached`.

## Scope Files

The manifest lists 1999 files across the release. This lineage's share by area (counts from the manifest):

**`.skilled/skills/system-spec-kit/` (612)**
- `runtime/cli/**` — validation engine (`spec/validate.sh`, rules, validator registry), retrieval (`retrieval/**`), spec lifecycle (`spec-folder/**`), extractors, continuity writers, optimizer, runtime-mirror sync, codex/hermes/pi sync.
- `runtime/lib/**` — validation orchestrator, spec-doc-structure, graph metadata, continuity, description.
- `runtime/hooks/**` — spec-gate core and per-runtime adapters, completion-evidence sentinel.
- `shared/**` — review-research-paths, parsing (memory-sufficiency, spec-doc-health, secret-scrubber), predicates, algorithms (rrf-fusion), embeddings registry.
- `references/**`, `feature-catalog/**`, `manual-testing-playbook/**`, `templates/**` — contracts and claims to trace.
- `runtime/tests/**`, `runtime/cli/tests/**` — behavior claims pinned by tests.

**`.skilled/skills/system-deep-loop/` (390)**
- `runtime/scripts/**` — `fanout-run.cjs`, `fanout-merge.cjs`, `fanout-pool.cjs`, `append-mode-event.cjs`, `reduce-state.cjs`, `synthesis-closeout.cjs`, `convergence.cjs`, `loop-lock.cjs`, `upsert.cjs`, `verify-*`, `status.cjs`.
- `runtime/lib/**` — authorized-ledger, mode-append-gateway, deep-review/research schemas, write-set conflict graph, lock/fencing, result envelopes, next-focus, claim continuity.
- `deep-ai-council/**`, `deep-improvement/**` — sibling loop contracts touched by the release.
- Per-mode `deep-review/**`, `deep-research/**` references and prompts.

**`.skilled/skills/system-skill-advisor/` (158)** — advisor runtime, daemon-backed CLI surface, hook brief, tests.

**`.skilled/skills/cli-external-orchestration/` (41) + `.skilled/skills/cli-classifier/` (118)** — cli-X mode registry, dispatch prompts, Jev classifier transport and benchmarks.

## Cross-Reference Targets

- `spec_paths`: `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/{spec.md,plan.md,tasks.md,acceptance-criteria.md,implementation-summary.md,goal.md,goal-file-manifest.txt}`, `specs/system-speckit/033-system-speckit-v4/spec.md`.
- `code_paths`: the four focus-area trees above, concentrated on files changed in `v4.0.0.2..v4.0.0.3`.
- `test_paths`: `system-deep-loop/runtime/tests/**`, `system-spec-kit/runtime/cli/tests/**` and `runtime/tests/**` that pin the changed behavior.
- `doc_paths`: the release's changelog entries and feature-catalog entries making claims about the changed code.

## Dimension Queue

Rotation, area-first then cross-skill (each block re-enterable if a finding pulls it deeper):

1. correctness — deep-loop dispatch/fan-out/gateway (scripts + mode-append-gateway)
2. correctness — deep-loop reducer/convergence/synthesis closeout
3. security — deep-loop locks, fencing, authority, path containment
4. correctness — spec-kit validation engine and rule scripts
5. correctness — spec-kit retrieval + trigger index
6. security — spec-kit hooks, env precedence, secret scrubber
7. correctness — spec-kit runtime/lib (validation orchestrator, graph, continuity)
8. traceability — spec-kit validation rules vs packet/reference claims (`spec_code`)
9. maintainability — cli-external-orchestration + cli-classifier (Jev) + skill-advisor
10. correctness — system-skill-advisor runtime (scoring, routing, daemon CLI)
11. security — Jev transport + advisor daemon surfaces
12. correctness — cross-skill: spec-kit review-research-paths ↔ deep-loop artifacts
13. traceability — cross-runtime mirrors and agent/skill parity (`skill_agent`, `agent_cross_runtime`)
14. maintainability — carried-finding re-verification, drift and comment hygiene in changed files
15. correctness — synthesis-prep broadening: remaining slices and P0/P1 replay before synthesis

## Known Context

- `resource-map.md` does not exist in the packet; `resource_map_present = false`, so the Resource Map Coverage Gate is skipped (recorded, not a failure).
- No `checklist.md` exists; the `AC_COVERAGE` signal predicate is inactive; the Verification Checklist lives inside `tasks.md` and `acceptance-criteria.md`.
- Packet lifecycle: this packet is `In Progress`; its own deliverables (three lineages + merged report) are what this review run produces. Nothing in the packet can be treated as already-closed evidence.
- The review range is a release, not a feature: claims about behavior come from current code plus the range's commits, and stale prose is judged against implementation.
- Bounded Context Snapshot (init):
  - **Target pointers**: the four focus trees above; the release tags `v4.0.0.2` and `v4.0.0.3` (both resolve).
  - **Claimed behavior to verify**: (a) fan-out runs lineages to their full iteration counts and merges with strongest-restriction; (b) the append gateway is the single state-log writer and refuses direct writes; (c) convergence math (weights P0=10/P1=5/P2=1, rolling 0.08, P0 floor 0.5) matches the skill contract; (d) validation rules resolve source tags and fail closed; (e) advisor routing returns stable command ids; (f) Jev classifier transport routes judgment requests.
  - **Reuse/conventions**: severity scale is exactly P0/P1/P2; verdict mapping PASS/CONDITIONAL/FAIL; iteration final-line contract is exact-match.
  - **Risk areas**: recently rewritten dispatch/ledger/fencing code; rename-heavy paths; mirrors that can drift from their source; gate scripts that write state.
  - **Missing context / gaps**: no ability to re-run vitest suites inside this lineage (write containment); graph/semantic tooling unavailable; per-iteration budget 9-13 tool calls; breadth over depth.
  - **Out of scope**: fixing anything; files outside the manifest; `.git/**`; `specs/**` except as traceability evidence (this lineage writes only inside its lineage directory).

## 3. REVIEW DIMENSIONS (remaining)
<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

## 4. COMPLETED DIMENSIONS
<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

## 5. RUNNING FINDINGS
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 2
- P2 (Suggestions): 6
- Resolved: 0

<!-- /ANCHOR:running-findings -->

## 6. NON-GOALS

- Fixing anything: the loop is observation-only; findings route to `/speckit:plan`.
- Executing test suites: lineage write containment forbids commands that write outside the lineage directory.
- Reviewing `specs/**` code claims — packet docs enter only as traceability evidence.

## 7. STOP CONDITIONS

- Primary: `maxIterations` (15) reached — `stopPolicy: max-iterations`.
- Convergence (rolling average <= 0.08, MAD noise floor, dimension coverage 1.0 with stabilization) is telemetry only; a converged signal broadens the next angle instead of stopping.
- Hard escalation: 3+ consecutive iteration failures, state corruption, or a security vulnerability in production code (report immediately in the iteration file).

## 8. WHAT WORKED

- Comparing a writer against the subsystem that owns its target file (salvage vs the append gateway and the projection refresh) surfaced the one direct-write bypass in the fan-out path. (iteration 1)
- Reading the guard (`check-direct-append.cjs`) alongside the writer it judges pinned the authority-state-dependent consequence instead of guessing at impact. (iteration 1)
- Checking the unit test for the suspect path showed the test asserts only the immediate state-log content, which sharpened the durability argument rather than weakening it. (iteration 1)
- Reading the projection engine's publication rule (prefix-append vs `writeTextAtomic` replace, shadow-projection-store.ts:548-577) converted an "arguably not durable" worry into a mechanical proof. (iteration 1-2)
- Following the surface census (legacy-projection-manifest.ts) to the gateway's single-surface refresh (append-mode-event.ts:467-475) settled whether leaf-written delta files are gateway-owned. They are not. (iteration 2)
- Reading the reducer and the close-out against each other (registry fields the close-out reads vs fields the reducer writes) found no gap, which is the useful negative result for this slice. (iteration 2)
- Comparing every mutation in the lock lifecycle against its verification step isolated the one mutation that is unverified (the reclaim rename) from the four that re-read identity. (iteration 3)
- A production-path injection sweep (shell-true/exec/eval) plus a scrubber read settled the obvious security classes quickly and honestly. (iteration 3)
- Sweeping for the portability defect the release fixed in one awk script (and finding no remaining instance) converted "did they fix the class or the instance?" into a checkable answer. (iteration 4)
- Auditing a skip predicate against the actual tree (walking every numbered child it matches) separated a latent gap from an exercised one, which set F003's severity honestly. (iteration 4)
- Executing the repo's own `--check` mode and two phrase lookups turned "the index may be stale" into a reproduced miss and a reproduced stale hit with exit-code evidence. (iteration 5)
- Comparing an artifact's blob at the tag with HEAD settled which staleness belonged to the release and which was this branch's own work. (iteration 5)
- Reading the gate's env semantics against its header comment confirmed the documented fail-open posture end to end, which is what makes the one hygiene finding stand out. (iteration 6)
- The hygiene sweep that produced F005 started as a failed rg search on the file itself — the defect demonstrated itself while being looked for. (iteration 6)
- Executing the shipped metadata gate (check + resolve with the orchestrator's own defaults) turned a survey into a precise finding, and comparing checker blobs across the tag showed the gate's verdict was the shipped one. (iteration 7)
- The 279-packet sweep let the finding state its class size (two blocking folders, seven non-blocking ones) instead of implying a repo-wide break. (iteration 7)
- Reading the lead's updated ruling before this iteration and mapping its sanctioned conflict to exact lines turned the steer into a properly evidenced P2 rather than an unverified claim. (iteration 8)
- Treating the orchestration ledger as the traceability source (dispatch/failure/retry/containment events) produced checklist evidence that no prose claim could have provided. (iteration 8)
- Running the fleet's own root-metadata gate (read-only) turned a class-matrix reading into a 14/14 executed result, and the alias-versus-router comparison covered the stage a live advisor replay could not. (iteration 9)
- Locating the documenting line for the second trust env var before writing anything down stopped a phantom finding; the same check verified the degraded-fallback marking in code. (iteration 10)

## 9. WHAT FAILED

[None yet]

## 10. EXHAUSTED APPROACHES (do not retry)
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "`/tmp/system-skill-advisor` is an insecure predictable temp directory": ruled out on the bind side — the server refuses a pre-existing socket dir not owned by the current uid, refuses a group/world-writable dir, and refuses to bind over a symlink at the socket path (`socket-server.ts:437-468`), with the attacker-planted-dir case named in the comment. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: "`/tmp/system-skill-advisor` is an insecure predictable temp directory": ruled out on the bind side — the server refuses a pre-existing socket dir not owned by the current uid, refuses a group/world-writable dir, and refuses to bind over a symlink at the socket path (`socket-server.ts:437-468`), with the attacker-planted-dir case named in the comment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`/tmp/system-skill-advisor` is an insecure predictable temp directory": ruled out on the bind side — the server refuses a pre-existing socket dir not owned by the current uid, refuses a group/world-writable dir, and refuses to bind over a symlink at the socket path (`socket-server.ts:437-468`), with the attacker-planted-dir case named in the comment.

### "`STATUS_COMPLETE_EVIDENCE_MISMATCH` failures are blocking": ruled out — the resolver treats that code as non-blocking unless `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE` is enabled (default off), and executed runs on `039-review-state-init-and-dispatch` return `info`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "`STATUS_COMPLETE_EVIDENCE_MISMATCH` failures are blocking": ruled out — the resolver treats that code as non-blocking unless `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE` is enabled (default off), and executed runs on `039-review-state-init-and-dispatch` return `info`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`STATUS_COMPLETE_EVIDENCE_MISMATCH` failures are blocking": ruled out — the resolver treats that code as non-blocking unless `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE` is enabled (default off), and executed runs on `039-review-state-init-and-dispatch` return `info`.

### "`validate.sh` skip-switch handling can print non-JSON prose before a JSON report": ruled out — env overrides and the skip decision run before any notice is printed, and the auto-recursion notice is suppressed in JSON/quiet mode (`validate.sh:404-414`); the skip path emits a complete report object with `skipped: true` (`validate.sh:142-150`). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "`validate.sh` skip-switch handling can print non-JSON prose before a JSON report": ruled out — env overrides and the skip decision run before any notice is printed, and the auto-recursion notice is suppressed in JSON/quiet mode (`validate.sh:404-414`); the skip path emits a complete report object with `skipped: true` (`validate.sh:142-150`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`validate.sh` skip-switch handling can print non-JSON prose before a JSON report": ruled out — env overrides and the skip decision run before any notice is printed, and the auto-recursion notice is suppressed in JSON/quiet mode (`validate.sh:404-414`); the skip path emits a complete report object with `skipped: true` (`validate.sh:142-150`).

### "A carried finding's anchor has moved since it was written": ruled out except for the F003 refinement above; all eight anchors still resolve to the substance they cite. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: "A carried finding's anchor has moved since it was written": ruled out except for the F003 refinement above; all eight anchors still resolve to the substance they cite.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A carried finding's anchor has moved since it was written": ruled out except for the F003 refinement above; all eight anchors still resolve to the substance they cite.

### "A child-phase artifact root can be mis-resolved or escape its packet": ruled out by execution — `resolveArtifactRoot('specs/system-speckit/033-system-speckit-v4/068-…', 'review')` returns the flat `…/068-…/review` with `subfolder: null`, matching the observed layout; the resolver normalizes the stored config value before comparison (`review-research-paths.cjs:106-136, 150-164`) and guards shell metacharacters plus approved-root containment before any path is returned (`:332-360`). -- BLOCKED (iteration 11, 1 attempts)
- What was tried: "A child-phase artifact root can be mis-resolved or escape its packet": ruled out by execution — `resolveArtifactRoot('specs/system-speckit/033-system-speckit-v4/068-…', 'review')` returns the flat `…/068-…/review` with `subfolder: null`, matching the observed layout; the resolver normalizes the stored config value before comparison (`review-research-paths.cjs:106-136, 150-164`) and guards shell metacharacters plus approved-root containment before any path is returned (`:332-360`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A child-phase artifact root can be mis-resolved or escape its packet": ruled out by execution — `resolveArtifactRoot('specs/system-speckit/033-system-speckit-v4/068-…', 'review')` returns the flat `…/068-…/review` with `subfolder: null`, matching the observed layout; the resolver normalizes the stored config value before comparison (`review-research-paths.cjs:106-136, 150-164`) and guards shell metacharacters plus approved-root containment before any path is returned (`:332-360`).

### "A corrupt gate state can block mutations": ruled out — every entrypoint fails open on unreadable state, classifier throw, or unexpected argument shape, as the module header documents and the catch at `:1794-1797` implements. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "A corrupt gate state can block mutations": ruled out — every entrypoint fails open on unreadable state, classifier throw, or unexpected argument shape, as the module header documents and the catch at `:1794-1797` implements.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A corrupt gate state can block mutations": ruled out — every entrypoint fails open on unreadable state, classifier throw, or unexpected argument shape, as the module header documents and the catch at `:1794-1797` implements.

### "A dispatched session can be denied by a leaked enforce env": ruled out — `isChildSession` short-circuits to a complete allow before any state read or telemetry (`spec-gate-core.mjs:1755-1758`), and the comment states why. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "A dispatched session can be denied by a leaked enforce env": ruled out — `isChildSession` short-circuits to a complete allow before any state read or telemetry (`spec-gate-core.mjs:1755-1758`), and the comment states why.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A dispatched session can be denied by a leaked enforce env": ruled out — `isChildSession` short-circuits to a complete allow before any state read or telemetry (`spec-gate-core.mjs:1755-1758`), and the comment states why.

### "A hook registration file diverged from the canonical hook registry, or a Pi extension link died": ruled out by execution — the registration checker matches 4 generated files against the 31-hook registry and resolves 18 Pi extensions. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: "A hook registration file diverged from the canonical hook registry, or a Pi extension link died": ruled out by execution — the registration checker matches 4 generated files against the 31-hook registry and resolves 18 Pi extensions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A hook registration file diverged from the canonical hook registry, or a Pi extension link died": ruled out by execution — the registration checker matches 4 generated files against the 31-hook registry and resolves 18 Pi extensions.

### "A malformed index can be silently half-read": ruled out — `loadIndex` runs the same shape assertion the generator enforces at publish time and refuses to return a partial result (`lookup-trigger-index.mjs:81-92`). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "A malformed index can be silently half-read": ruled out — `loadIndex` runs the same shape assertion the generator enforces at publish time and refuses to return a partial result (`lookup-trigger-index.mjs:81-92`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A malformed index can be silently half-read": ruled out — `loadIndex` runs the same shape assertion the generator enforces at publish time and refuses to return a partial result (`lookup-trigger-index.mjs:81-92`).

### "A mode alias is dead vocabulary nothing routes": ruled out for both hubs — every alias in each `mode-registry.json` is present in the hub's `hub-router.json` (stage two), and the hub `graph-metadata.json` carries the stage-one vocabulary (substring check over all aliases; derived phrase coverage is complete for the cli-external-orchestration set and partial for Jev, whose remaining aliases are the ones the router resolves). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: "A mode alias is dead vocabulary nothing routes": ruled out for both hubs — every alias in each `mode-registry.json` is present in the hub's `hub-router.json` (stage two), and the hub `graph-metadata.json` carries the stage-one vocabulary (substring check over all aliases; derived phrase coverage is complete for the cli-external-orchestration set and partial for Jev, whose remaining aliases are the ones the router resolves).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A mode alias is dead vocabulary nothing routes": ruled out for both hubs — every alias in each `mode-registry.json` is present in the hub's `hub-router.json` (stage two), and the hub `graph-metadata.json` carries the stage-one vocabulary (substring check over all aliases; derived phrase coverage is complete for the cli-external-orchestration set and partial for Jev, whose remaining aliases are the ones the router resolves).

### "A re-derive can fix the fingerprint without touching content": ruled out as an assumption — a fingerprint refresh rewrites `graph-metadata.json`, so the repair is a generated-file write, not a doc edit; stated so the remediation is planned correctly. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "A re-derive can fix the fingerprint without touching content": ruled out as an assumption — a fingerprint refresh rewrites `graph-metadata.json`, so the repair is a generated-file write, not a doc edit; stated so the remediation is planned correctly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A re-derive can fix the fingerprint without touching content": ruled out as an assumption — a fingerprint refresh rewrites `graph-metadata.json`, so the repair is a generated-file write, not a doc edit; stated so the remediation is planned correctly.

### "A registered cli mode has no packet": ruled out — for both hubs, the registry's `packet` set equals the on-disk `cli-*` directory set, and every packet carries `SKILL.md` (7 + 1 checked). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: "A registered cli mode has no packet": ruled out — for both hubs, the registry's `packet` set equals the on-disk `cli-*` directory set, and every packet carries `SKILL.md` (7 + 1 checked).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A registered cli mode has no packet": ruled out — for both hubs, the registry's `packet` set equals the on-disk `cli-*` directory set, and every packet carries `SKILL.md` (7 + 1 checked).

### "A runtime mirror drifted from its canonical `.skilled` source": ruled out by execution — the mirror checker walks all 8 trees and reports 187 mirrors in sync with exit 0. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: "A runtime mirror drifted from its canonical `.skilled` source": ruled out by execution — the mirror checker walks all 8 trees and reports 187 mirrors in sync with exit 0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A runtime mirror drifted from its canonical `.skilled` source": ruled out by execution — the mirror checker walks all 8 trees and reports 187 mirrors in sync with exit 0.

### "A second trust env name is undocumented": ruled out — `ENV-REFERENCE.md:388` records the primary name, its purpose, the mutation commands it unlocks, and the `SPECKIT_SKILL_ADVISOR_CLI_TRUSTED` alias. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: "A second trust env name is undocumented": ruled out — `ENV-REFERENCE.md:388` records the primary name, its purpose, the mutation commands it unlocks, and the `SPECKIT_SKILL_ADVISOR_CLI_TRUSTED` alias.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A second trust env name is undocumented": ruled out — `ENV-REFERENCE.md:388` records the primary name, its purpose, the mutation commands it unlocks, and the `SPECKIT_SKILL_ADVISOR_CLI_TRUSTED` alias.

### "A stale or missing dist can still serve": ruled out — the shim checks package freshness and exits 69 (protocol) or 75 (retryable, warm-only) before spawning the daemon CLI (`skill-advisor.cjs:70-83`), matching the documented exit taxonomy. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: "A stale or missing dist can still serve": ruled out — the shim checks package freshness and exits 69 (protocol) or 75 (retryable, warm-only) before spawning the daemon CLI (`skill-advisor.cjs:70-83`), matching the documented exit taxonomy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A stale or missing dist can still serve": ruled out — the shim checks package freshness and exits 69 (protocol) or 75 (retryable, warm-only) before spawning the daemon CLI (`skill-advisor.cjs:70-83`), matching the documented exit taxonomy.

### "Authority can silently fork per run": ruled out — the authority root discovers the checkout rather than accepting a per-run directory, with the documented reason that a per-run root would let two runs disagree on the canonical writer (`resolve-authority-root.ts:5-17, 56-71`). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "Authority can silently fork per run": ruled out — the authority root discovers the checkout rather than accepting a per-run directory, with the documented reason that a per-run root would let two runs disagree on the canonical writer (`resolve-authority-root.ts:5-17, 56-71`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Authority can silently fork per run": ruled out — the authority root discovers the checkout rather than accepting a per-run directory, with the documented reason that a per-run root would let two runs disagree on the canonical writer (`resolve-authority-root.ts:5-17, 56-71`).

### "Command injection through an executor or evaluator path": ruled out — a production-path sweep of the four focus trees found no `shell: true`, no `eval`, and no `new Function`; the only `exec` hits are `RegExp.exec` loops and SQLite DDL (`db.exec` with literal statements, no interpolation). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "Command injection through an executor or evaluator path": ruled out — a production-path sweep of the four focus trees found no `shell: true`, no `eval`, and no `new Function`; the only `exec` hits are `RegExp.exec` loops and SQLite DDL (`db.exec` with literal statements, no interpolation).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Command injection through an executor or evaluator path": ruled out — a production-path sweep of the four focus trees found no `shell: true`, no `eval`, and no `new Function`; the only `exec` hits are `RegExp.exec` loops and SQLite DDL (`db.exec` with literal statements, no interpolation).

### "F001's row could be re-projected from the ledger": unchanged — the salvage event is not a ledger stem and is never appended to the ledger. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: "F001's row could be re-projected from the ledger": unchanged — the salvage event is not a ledger stem and is never appended to the ledger.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "F001's row could be re-projected from the ledger": unchanged — the salvage event is not a ledger stem and is never appended to the ledger.

### "F002's race is closed by some other guard": unchanged — refresh/release identity checks run after acquisition; the acquire path still has no read-back. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: "F002's race is closed by some other guard": unchanged — refresh/release identity checks run after acquisition; the acquire path still has no read-back.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "F002's race is closed by some other guard": unchanged — refresh/release identity checks run after acquisition; the acquire path still has no read-back.

### "Fan-out merge violates strongest-restriction": ruled out on read — `mergeReviewRegistries` counts only `disposition === 'active'` findings and maps any active P0 to FAIL before P1 to CONDITIONAL (fanout-merge.cjs:843-847, 889-901). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "Fan-out merge violates strongest-restriction": ruled out on read — `mergeReviewRegistries` counts only `disposition === 'active'` findings and maps any active P0 to FAIL before P1 to CONDITIONAL (fanout-merge.cjs:843-847, 889-901).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Fan-out merge violates strongest-restriction": ruled out on read — `mergeReviewRegistries` counts only `disposition === 'active'` findings and maps any active P0 to FAIL before P1 to CONDITIONAL (fanout-merge.cjs:843-847, 889-901).

### "JSON mode can pass while printing no RESULT line": not a defect — JSON mode returns the machine report and deliberately omits the prose RESULT line; the completion gate's documented invocation is plain `--strict` (`orchestrator.ts:1150-1175`). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "JSON mode can pass while printing no RESULT line": not a defect — JSON mode returns the machine report and deliberately omits the prose RESULT line; the completion gate's documented invocation is plain `--strict` (`orchestrator.ts:1150-1175`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "JSON mode can pass while printing no RESULT line": not a defect — JSON mode returns the machine report and deliberately omits the prose RESULT line; the completion gate's documented invocation is plain `--strict` (`orchestrator.ts:1150-1175`).

### "Pi's exit code is treated as a success signal": ruled out — `cli-pi` non-zero exits are explicitly tolerated and the artifact gate decides instead (fanout-run.cjs:3782-3787). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "Pi's exit code is treated as a success signal": ruled out — `cli-pi` non-zero exits are explicitly tolerated and the artifact gate decides instead (fanout-run.cjs:3782-3787).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Pi's exit code is treated as a success signal": ruled out — `cli-pi` non-zero exits are explicitly tolerated and the artifact gate decides instead (fanout-run.cjs:3782-3787).

### "Recorded baseline findings can hollow out the pass verdict": ruled out on read — `applyRecordedFindings` downgrades only error entries whose exact deduplicated detail counts are recorded, never `NEVER_RECORDED_RULES` outside archived packets, and a malformed baseline means nothing is recorded (`orchestrator.ts:930-1020`). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "Recorded baseline findings can hollow out the pass verdict": ruled out on read — `applyRecordedFindings` downgrades only error entries whose exact deduplicated detail counts are recorded, never `NEVER_RECORDED_RULES` outside archived packets, and a malformed baseline means nothing is recorded (`orchestrator.ts:930-1020`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Recorded baseline findings can hollow out the pass verdict": ruled out on read — `applyRecordedFindings` downgrades only error entries whose exact deduplicated detail counts are recorded, never `NEVER_RECORDED_RULES` outside archived packets, and a malformed baseline means nothing is recorded (`orchestrator.ts:930-1020`).

### "Recursive runs can mask a child's system error (exit 3) behind a validation error (2)": ruled out — the aggregation takes the maximum child exit code (`validate.sh:393`). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "Recursive runs can mask a child's system error (exit 3) behind a validation error (2)": ruled out — the aggregation takes the maximum child exit code (`validate.sh:393`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Recursive runs can mask a child's system error (exit 3) behind a validation error (2)": ruled out — the aggregation takes the maximum child exit code (`validate.sh:393`).

### "Secrets can reach a durable save unscrubbed": ruled out on read — the save path scrubs slug, filename, title, description, sessionData and collectedData as whole trees (`workflow.ts:208-247, 1612-1625`), the scrubber resets `lastIndex` before each pattern and fails closed by throwing (`secret-scrubber.ts:196-239`), and the pattern set covers private keys, AWS/GitHub/Anthropic/OpenAI/Google/Slack/JWT/bearer and credential assignments with documented guard reasoning. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "Secrets can reach a durable save unscrubbed": ruled out on read — the save path scrubs slug, filename, title, description, sessionData and collectedData as whole trees (`workflow.ts:208-247, 1612-1625`), the scrubber resets `lastIndex` before each pattern and fails closed by throwing (`secret-scrubber.ts:196-239`), and the pattern set covers private keys, AWS/GitHub/Anthropic/OpenAI/Google/Slack/JWT/bearer and credential assignments with documented guard reasoning.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Secrets can reach a durable save unscrubbed": ruled out on read — the save path scrubs slug, filename, title, description, sessionData and collectedData as whole trees (`workflow.ts:208-247, 1612-1625`), the scrubber resets `lastIndex` before each pattern and fails closed by throwing (`secret-scrubber.ts:196-239`), and the pattern set covers private keys, AWS/GitHub/Anthropic/OpenAI/Google/Slack/JWT/bearer and credential assignments with documented guard reasoning.

### "The advisor root misclassifies its metadata class": ruled out — `system-skill-advisor` declares neither `mode-registry.json` nor `hub-router.json`, so it is class S, for which `description.json` is forbidden and `graph-metadata.json` + `leaf-manifest.config.json` are the authored files; its root listing matches exactly. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: "The advisor root misclassifies its metadata class": ruled out — `system-skill-advisor` declares neither `mode-registry.json` nor `hub-router.json`, so it is class S, for which `description.json` is forbidden and `graph-metadata.json` + `leaf-manifest.config.json` are the authored files; its root listing matches exactly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The advisor root misclassifies its metadata class": ruled out — `system-skill-advisor` declares neither `mode-registry.json` nor `hub-router.json`, so it is class S, for which `description.json` is forbidden and `graph-metadata.json` + `leaf-manifest.config.json` are the authored files; its root listing matches exactly.

### "The CLI contract in `SKILL.md` diverges from the implemented command": ruled out — `advisor_recommend` requires a non-empty `prompt` (max 10,000) and supports `includeAbstainReasons` (`advisor-recommend.ts:13-20`), matching the documented `--json '{"prompt":…}'` invocation and its failure-mode notes (`SKILL.md:297-301`). -- BLOCKED (iteration 10, 1 attempts)
- What was tried: "The CLI contract in `SKILL.md` diverges from the implemented command": ruled out — `advisor_recommend` requires a non-empty `prompt` (max 10,000) and supports `includeAbstainReasons` (`advisor-recommend.ts:13-20`), matching the documented `--json '{"prompt":…}'` invocation and its failure-mode notes (`SKILL.md:297-301`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The CLI contract in `SKILL.md` diverges from the implemented command": ruled out — `advisor_recommend` requires a non-empty `prompt` (max 10,000) and supports `includeAbstainReasons` (`advisor-recommend.ts:13-20`), matching the documented `--json '{"prompt":…}'` invocation and its failure-mode notes (`SKILL.md:297-301`).

### "The containment advisory means the run wrote outside its lane": ruled out on the event payload — it carries three advisories with `preserved_untracked` dispositions, which is the preserve branch, and no violation event exists. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "The containment advisory means the run wrote outside its lane": ruled out on the event payload — it carries three advisories with `preserved_untracked` dispositions, which is the preserve branch, and no violation event exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The containment advisory means the run wrote outside its lane": ruled out on the event payload — it carries three advisories with `preserved_untracked` dispositions, which is the preserve branch, and no violation event exists.

### "The corpus walk indexes review artifacts and inflates the corpus": ruled out — `specs/**/lineages/**` is excluded (`lib/corpus.mjs:66`), which is why this lineage's own iteration files do not appear in the check report. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The corpus walk indexes review artifacts and inflates the corpus": ruled out — `specs/**/lineages/**` is excluded (`lib/corpus.mjs:66`), which is why this lineage's own iteration files do not appear in the check report.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The corpus walk indexes review artifacts and inflates the corpus": ruled out — `specs/**/lineages/**` is excluded (`lib/corpus.mjs:66`), which is why this lineage's own iteration files do not appear in the check report.

### "The correct command form is nowhere in the tree": ruled out — two control scenarios use the deep-loop working directory with repo-relative test paths, which is the form the nine broken scenarios would need. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: "The correct command form is nowhere in the tree": ruled out — two control scenarios use the deep-loop working directory with repo-relative test paths, which is the form the nine broken scenarios would need.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The correct command form is nowhere in the tree": ruled out — two control scenarios use the deep-loop working directory with repo-relative test paths, which is the form the nine broken scenarios would need.

### "The daemon-unreachable fallback can masquerade as a live answer": ruled out — the fallback path sets `degraded: true` and an explanatory field beside the recommendations (`skill-advisor-cli.ts:1531-1534`), and the docs state a degraded answer is stale rather than missing. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: "The daemon-unreachable fallback can masquerade as a live answer": ruled out — the fallback path sets `degraded: true` and an explanatory field beside the recommendations (`skill-advisor-cli.ts:1531-1534`), and the docs state a degraded answer is stale rather than missing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The daemon-unreachable fallback can masquerade as a live answer": ruled out — the fallback path sets `degraded: true` and an explanatory field beside the recommendations (`skill-advisor-cli.ts:1531-1534`), and the docs state a degraded answer is stale rather than missing.

### "The deny surface is wider than the contract says": ruled out — deny applies only to `write`/`edit` (`DENY_CAPABLE_TOOLS`, `:142`), only while the gate is open and unanswered, and never to exempt targets; `bash` can only advise (`:1774-1793`). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "The deny surface is wider than the contract says": ruled out — deny applies only to `write`/`edit` (`DENY_CAPABLE_TOOLS`, `:142`), only while the gate is open and unanswered, and never to exempt targets; `bash` can only advise (`:1774-1793`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The deny surface is wider than the contract says": ruled out — deny applies only to `write`/`edit` (`DENY_CAPABLE_TOOLS`, `:142`), only while the gate is open and unanswered, and never to exempt targets; `bash` can only advise (`:1774-1793`).

### "The fleet's root metadata has drifted from the class matrix": ruled out by execution — `ci-skill-root-metadata.cjs` (no `--fix`) reports `checked=14 passed=14 failed=0 fixed=0`, exit 0, with the 7 class-H roots carrying `description.json` and the 7 class-S roots carrying neither hub file nor `description.json`, exactly as the contract's fleet table states. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: "The fleet's root metadata has drifted from the class matrix": ruled out by execution — `ci-skill-root-metadata.cjs` (no `--fix`) reports `checked=14 passed=14 failed=0 fixed=0`, exit 0, with the 7 class-H roots carrying `description.json` and the 7 class-S roots carrying neither hub file nor `description.json`, exactly as the contract's fleet table states.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The fleet's root metadata has drifted from the class matrix": ruled out by execution — `ci-skill-root-metadata.cjs` (no `--fix`) reports `checked=14 passed=14 failed=0 fixed=0`, exit 0, with the 7 class-H roots carrying `description.json` and the 7 class-S roots carrying neither hub file nor `description.json`, exactly as the contract's fleet table states.

### "The Gate 1 pointer block drifted in the instruction file": ruled out by execution — the pointer checker reports the block present and current. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: "The Gate 1 pointer block drifted in the instruction file": ruled out by execution — the pointer checker reports the block present and current.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Gate 1 pointer block drifted in the instruction file": ruled out by execution — the pointer checker reports the block present and current.

### "The gawk portability defect class the release fixed in `check-ac-coverage.sh` survives elsewhere": ruled out — a sweep for a hyphen immediately after a POSIX bracket expression found only three bracket expressions (`check-ac-coverage.sh:224,328`, `check-ac-closure.sh:146`) and all three now carry the hyphen last, which every awk reads as a literal. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The gawk portability defect class the release fixed in `check-ac-coverage.sh` survives elsewhere": ruled out — a sweep for a hyphen immediately after a POSIX bracket expression found only three bracket expressions (`check-ac-coverage.sh:224,328`, `check-ac-closure.sh:146`) and all three now carry the hyphen last, which every awk reads as a literal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The gawk portability defect class the release fixed in `check-ac-coverage.sh` survives elsewhere": ruled out — a sweep for a hyphen immediately after a POSIX bracket expression found only three bracket expressions (`check-ac-coverage.sh:224,328`, `check-ac-closure.sh:146`) and all three now carry the hyphen last, which every awk reads as a literal.

### "The generator and the checker can disagree on what stale means": ruled out — both import `compareDocumentPhrases`/`indexedPhrasesFor` from `lib/freshness.mjs`, which documents itself as the single definition (`freshness.mjs:4-8`); the checker rebuilds the corpus and compares against the committed index (`generate-trigger-index.mjs:533-556`). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The generator and the checker can disagree on what stale means": ruled out — both import `compareDocumentPhrases`/`indexedPhrasesFor` from `lib/freshness.mjs`, which documents itself as the single definition (`freshness.mjs:4-8`); the checker rebuilds the corpus and compares against the committed index (`generate-trigger-index.mjs:533-556`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The generator and the checker can disagree on what stale means": ruled out — both import `compareDocumentPhrases`/`indexedPhrasesFor` from `lib/freshness.mjs`, which documents itself as the single definition (`freshness.mjs:4-8`); the checker rebuilds the corpus and compares against the committed index (`generate-trigger-index.mjs:533-556`).

### "The hub SKILL.md tables drifted from the registries": ruled out — every registered `workflowMode` appears in its hub's `SKILL.md` (counts 6-10 mentions each). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: "The hub SKILL.md tables drifted from the registries": ruled out — every registered `workflowMode` appears in its hub's `SKILL.md` (counts 6-10 mentions each).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The hub SKILL.md tables drifted from the registries": ruled out — every registered `workflowMode` appears in its hub's `SKILL.md` (counts 6-10 mentions each).

### "The integrity gate reads only the current directory": ruled out — it reads the folder's own generated files and re-derives from its docs; it never walks children (`checkGeneratedMetadataIntegrity`, `:344-390`). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "The integrity gate reads only the current directory": ruled out — it reads the folder's own generated files and re-derives from its docs; it never walks children (`checkGeneratedMetadataIntegrity`, `:344-390`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The integrity gate reads only the current directory": ruled out — it reads the folder's own generated files and re-derives from its docs; it never walks children (`checkGeneratedMetadataIntegrity`, `:344-390`).

### "The leaf-written `review/deltas/iter-NNN.jsonl` files are overwritten by the gateway's projection refresh": ruled out — the deltas surface carries a registered contract and a manifest entry with `refreshBoundary: 'event'`, but the gateway refresh resolves only the `review-state` surface (`append-mode-event.ts:467-475` -> `resolveDefaultProjectionContract`, which returns the state contract), and the deltas contract is constructed only in the census checker and its tests. The leaf-owned delta files are not gateway-published today. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The leaf-written `review/deltas/iter-NNN.jsonl` files are overwritten by the gateway's projection refresh": ruled out — the deltas surface carries a registered contract and a manifest entry with `refreshBoundary: 'event'`, but the gateway refresh resolves only the `review-state` surface (`append-mode-event.ts:467-475` -> `resolveDefaultProjectionContract`, which returns the state contract), and the deltas contract is constructed only in the census checker and its tests. The leaf-owned delta files are not gateway-published today.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The leaf-written `review/deltas/iter-NNN.jsonl` files are overwritten by the gateway's projection refresh": ruled out — the deltas surface carries a registered contract and a manifest entry with `refreshBoundary: 'event'`, but the gateway refresh resolves only the `review-state` surface (`append-mode-event.ts:467-475` -> `resolveDefaultProjectionContract`, which returns the state contract), and the deltas contract is constructed only in the census checker and its tests. The leaf-owned delta files are not gateway-published today.

### "The ledger append can commit under a stale or forged fence": ruled out on read — the fenced writer compares the fence's resource identity and the expected head sequence before commit (`fenced-ledger-writer.ts:57-77`) and the ledger re-checks the current fence token against the holder (`append-only-ledger.ts:552-560`); a stale, released, or forged capability is rejected before append. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The ledger append can commit under a stale or forged fence": ruled out on read — the fenced writer compares the fence's resource identity and the expected head sequence before commit (`fenced-ledger-writer.ts:57-77`) and the ledger re-checks the current fence token against the holder (`append-only-ledger.ts:552-560`); a stale, released, or forged capability is rejected before append.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The ledger append can commit under a stale or forged fence": ruled out on read — the fenced writer compares the fence's resource identity and the expected head sequence before commit (`fenced-ledger-writer.ts:57-77`) and the ledger re-checks the current fence token against the holder (`append-only-ledger.ts:552-560`); a stale, released, or forged capability is rejected before append.

### "The lineage completion check can pass without route-proof records": ruled out — `retainIterationRecords` prefers the gateway copy and `forcedDepthIterationViolation` requires exactly iterations 1..cap on both disk and state log (fanout-run.cjs:726-790). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The lineage completion check can pass without route-proof records": ruled out — `retainIterationRecords` prefers the gateway copy and `forcedDepthIterationViolation` requires exactly iterations 1..cap on both disk and state log (fanout-run.cjs:726-790).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The lineage completion check can pass without route-proof records": ruled out — `retainIterationRecords` prefers the gateway copy and `forcedDepthIterationViolation` requires exactly iterations 1..cap on both disk and state log (fanout-run.cjs:726-790).

### "The lookup CLI's exit contract contradicts the retrieval convention": ruled out — exit 0 with rows, 1 with no rows (a clean no-hit), 2 on a bad invocation or unreadable index (`lookup-trigger-index.mjs:312-336`), matching the convention quoted in the deep-review agent contract. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The lookup CLI's exit contract contradicts the retrieval convention": ruled out — exit 0 with rows, 1 with no rows (a clean no-hit), 2 on a bad invocation or unreadable index (`lookup-trigger-index.mjs:312-336`), matching the convention quoted in the deep-review agent contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The lookup CLI's exit contract contradicts the retrieval convention": ruled out — exit 0 with rows, 1 with no rows (a clean no-hit), 2 on a bad invocation or unreadable index (`lookup-trigger-index.mjs:312-336`), matching the convention quoted in the deep-review agent contract.

### "The lookup's scope filter can match a sibling folder by prefix": ruled out — `specFolderMatches` cuts at the last slash and tests folder equality or a `/`-boundary prefix (`lookup-trigger-index.mjs:107-111`), so `specs/a` cannot capture `specs/ab`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The lookup's scope filter can match a sibling folder by prefix": ruled out — `specFolderMatches` cuts at the last slash and tests folder equality or a `/`-boundary prefix (`lookup-trigger-index.mjs:107-111`), so `specs/a` cannot capture `specs/ab`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The lookup's scope filter can match a sibling folder by prefix": ruled out — `specFolderMatches` cuts at the last slash and tests folder equality or a `/`-boundary prefix (`lookup-trigger-index.mjs:107-111`), so `specs/a` cannot capture `specs/ab`.

### "The luna-max failure indicates a dispatch defect": ruled out — the runner recorded exit 0 with a missing expected artifact, scheduled a retry, and relaunched; that is NFR-R01's designed path, and the retry's first two iterations now exist without duplicate iteration numbers. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "The luna-max failure indicates a dispatch defect": ruled out — the runner recorded exit 0 with a missing expected artifact, scheduled a retry, and relaunched; that is NFR-R01's designed path, and the retry's first two iterations now exist without duplicate iteration numbers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The luna-max failure indicates a dispatch defect": ruled out — the runner recorded exit 0 with a missing expected artifact, scheduled a retry, and relaunched; that is NFR-R01's designed path, and the retry's first two iterations now exist without duplicate iteration numbers.

### "The pool can settle a worker twice or drop a rejected result": ruled out on read — `settleItem` never throws, and every outcome resolves to a `fulfilled`/`rejected` result slot (fanout-pool.cjs:346-407). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The pool can settle a worker twice or drop a rejected result": ruled out on read — `settleItem` never throws, and every outcome resolves to a `fulfilled`/`rejected` result slot (fanout-pool.cjs:346-407).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The pool can settle a worker twice or drop a rejected result": ruled out on read — `settleItem` never throws, and every outcome resolves to a `fulfilled`/`rejected` result slot (fanout-pool.cjs:346-407).

### "The range's added code comments embed ephemeral labels or spec paths": ruled out — a delta-only sweep of all 778 changed code files in the four focus areas found one occurrence of `specs/` in a comment (`.skilled/…/check-source-tags.vitest.ts:43-44`), and it names the corpus root in an explanation of a machine-wide excludes file, which is the durable WHY rather than an ephemeral label. The matcher was controlled against a synthetic `// label REQ-001 for packet specs/x/y` line, which it matched. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: "The range's added code comments embed ephemeral labels or spec paths": ruled out — a delta-only sweep of all 778 changed code files in the four focus areas found one occurrence of `specs/` in a comment (`.skilled/…/check-source-tags.vitest.ts:43-44`), and it names the corpus root in an explanation of a machine-wide excludes file, which is the durable WHY rather than an ephemeral label. The matcher was controlled against a synthetic `// label REQ-001 for packet specs/x/y` line, which it matched.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The range's added code comments embed ephemeral labels or spec paths": ruled out — a delta-only sweep of all 778 changed code files in the four focus areas found one occurrence of `specs/` in a comment (`.skilled/…/check-source-tags.vitest.ts:43-44`), and it names the corpus root in an explanation of a machine-wide excludes file, which is the durable WHY rather than an ephemeral label. The matcher was controlled against a synthetic `// label REQ-001 for packet specs/x/y` line, which it matched.

### "The reducer can report a terminal stop without a synthesis event": ruled out — `buildTerminalStopState` requires an event row named `synthesis_complete` that is not older than the last iteration or lifecycle event (reduce-state.cjs:1617-1655). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The reducer can report a terminal stop without a synthesis event": ruled out — `buildTerminalStopState` requires an event row named `synthesis_complete` that is not older than the last iteration or lifecycle event (reduce-state.cjs:1617-1655).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The reducer can report a terminal stop without a synthesis event": ruled out — `buildTerminalStopState` requires an event row named `synthesis_complete` that is not older than the last iteration or lifecycle event (reduce-state.cjs:1617-1655).

### "The release's own deep-review contract-parity assertions fail on this tree": ruled out by replication — 43 of 43 checks pass: deferred lifecycle branches present and `on_fork` absent in both YAMLs, the lazy guarded archive move present and no eager archive mkdir, canonical `agent_file` in both, all four dimensions tracked in the findings-registry seeds, the `step_graph_upsert` blocks identical between auto and confirm with `graphEvents` optional, and the generated contract using `{artifact_dir}` paths only. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: "The release's own deep-review contract-parity assertions fail on this tree": ruled out by replication — 43 of 43 checks pass: deferred lifecycle branches present and `on_fork` absent in both YAMLs, the lazy guarded archive move present and no eager archive mkdir, canonical `agent_file` in both, all four dimensions tracked in the findings-registry seeds, the `step_graph_upsert` blocks identical between auto and confirm with `graphEvents` optional, and the generated contract using `{artifact_dir}` paths only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The release's own deep-review contract-parity assertions fail on this tree": ruled out by replication — 43 of 43 checks pass: deferred lifecycle branches present and `on_fork` absent in both YAMLs, the lazy guarded archive move present and no eager archive mkdir, canonical `agent_file` in both, all four dimensions tracked in the findings-registry seeds, the `step_graph_upsert` blocks identical between auto and confirm with `graphEvents` optional, and the generated contract using `{artifact_dir}` paths only.

### "The release/refresh path can clobber a lock reclaimed after a stale read": ruled out for those paths — `refreshLoopLock` and `releaseLoopLock` both re-verify identity from the claimed record and restore it on mismatch (`loop-lock.ts:634-666, 731-756`), and unit tests cover the reclaim-during-refresh and reclaim-during-release interleavings; the gap is the reclaim path itself. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The release/refresh path can clobber a lock reclaimed after a stale read": ruled out for those paths — `refreshLoopLock` and `releaseLoopLock` both re-verify identity from the claimed record and restore it on mismatch (`loop-lock.ts:634-666, 731-756`), and unit tests cover the reclaim-during-refresh and reclaim-during-release interleavings; the gap is the reclaim path itself.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The release/refresh path can clobber a lock reclaimed after a stale read": ruled out for those paths — `refreshLoopLock` and `releaseLoopLock` both re-verify identity from the claimed record and restore it on mismatch (`loop-lock.ts:634-666, 731-756`), and unit tests cover the reclaim-during-refresh and reclaim-during-release interleavings; the gap is the reclaim path itself.

### "The review init step still writes the config row directly": ruled out in-range — commit `ef155cf8f4` moved init onto `deep_review.run_initialized` through the gateway; the current YAML init step records the event via `append-mode-event.cjs` and never touches the log directly (deep-review-auto.yaml:463-509). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The review init step still writes the config row directly": ruled out in-range — commit `ef155cf8f4` moved init onto `deep_review.run_initialized` through the gateway; the current YAML init step records the event via `append-mode-event.cjs` and never touches the log directly (deep-review-auto.yaml:463-509).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The review init step still writes the config row directly": ruled out in-range — commit `ef155cf8f4` moved init onto `deep_review.run_initialized` through the gateway; the current YAML init step records the event via `append-mode-event.cjs` and never touches the log directly (deep-review-auto.yaml:463-509).

### "The review projection cannot survive any extra row": ruled out — the attribution-collapse invariant only guards the first (config) row, which is why the salvage row is silently dropped rather than blocking the append; this is consistent with F001's failure mode, not a separate defect. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The review projection cannot survive any extra row": ruled out — the attribution-collapse invariant only guards the first (config) row, which is why the salvage row is silently dropped rather than blocking the append; this is consistent with F001's failure mode, not a separate defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The review projection cannot survive any extra row": ruled out — the attribution-collapse invariant only guards the first (config) row, which is why the salvage row is silently dropped rather than blocking the append; this is consistent with F001's failure mode, not a separate defect.

### "The runtime-capability matrix names mirrors that no longer exist": ruled out by execution — `listRuntimeCapabilityIds()` returns `['opencode','claude','codex']`, all three mirror paths exist (`.skilled/agents/deep-review.md`, `.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`), and `resolveRuntimeCapability()` succeeds for each. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: "The runtime-capability matrix names mirrors that no longer exist": ruled out by execution — `listRuntimeCapabilityIds()` returns `['opencode','claude','codex']`, all three mirror paths exist (`.skilled/agents/deep-review.md`, `.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`), and `resolveRuntimeCapability()` succeeds for each.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The runtime-capability matrix names mirrors that no longer exist": ruled out by execution — `listRuntimeCapabilityIds()` returns `['opencode','claude','codex']`, all three mirror paths exist (`.skilled/agents/deep-review.md`, `.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`), and `resolveRuntimeCapability()` succeeds for each.

### "The source-tag wrapper mis-parses the helper's tab-separated contract": ruled out — the helper documents `WARN <doc>:<line> <citation> <class> <detail>` and emits exactly those five fields (`check-source-tags-helper.mjs:10-16, 396`); the shell's warning line wraps field 3, which is the citation match rather than the whole tag (`sourceTagCitations`, `:244-273`). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The source-tag wrapper mis-parses the helper's tab-separated contract": ruled out — the helper documents `WARN <doc>:<line> <citation> <class> <detail>` and emits exactly those five fields (`check-source-tags-helper.mjs:10-16, 396`); the shell's warning line wraps field 3, which is the citation match rather than the whole tag (`sourceTagCitations`, `:244-273`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The source-tag wrapper mis-parses the helper's tab-separated contract": ruled out — the helper documents `WARN <doc>:<line> <citation> <class> <detail>` and emits exactly those five fields (`check-source-tags-helper.mjs:10-16, 396`); the shell's warning line wraps field 3, which is the citation match rather than the whole tag (`sourceTagCitations`, `:244-273`).

### "The spec gate can be silently disarmed by a crafted environment": ruled out on read — deny is opt-in only under the exact `SYSTEM_SPEC_GATE_ENFORCE=1`; the kill switches (`SYSTEM_SPEC_GATE_DISABLED`, the repo's `hook-flags.env` spec-gate toggle) are documented operator surfaces, and the child-session bypass requires `AI_SESSION_CHILD` to be exactly `1` (every other value is interactive, the safe default) (`spec-gate-core.mjs:79-106, 1754-1758`). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "The spec gate can be silently disarmed by a crafted environment": ruled out on read — deny is opt-in only under the exact `SYSTEM_SPEC_GATE_ENFORCE=1`; the kill switches (`SYSTEM_SPEC_GATE_DISABLED`, the repo's `hook-flags.env` spec-gate toggle) are documented operator surfaces, and the child-session bypass requires `AI_SESSION_CHILD` to be exactly `1` (every other value is interactive, the safe default) (`spec-gate-core.mjs:79-106, 1754-1758`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The spec gate can be silently disarmed by a crafted environment": ruled out on read — deny is opt-in only under the exact `SYSTEM_SPEC_GATE_ENFORCE=1`; the kill switches (`SYSTEM_SPEC_GATE_DISABLED`, the repo's `hook-flags.env` spec-gate toggle) are documented operator surfaces, and the child-session bypass requires `AI_SESSION_CHILD` to be exactly `1` (every other value is interactive, the safe default) (`spec-gate-core.mjs:79-106, 1754-1758`).

### "The stall detector aborted a working lineage": ruled out on the ledger — three `stall_detected` events (04:19:48 and later) are followed by continued `progress` events for the same labels, so the default action is detect-only; no lineage was killed by it. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "The stall detector aborted a working lineage": ruled out on the ledger — three `stall_detected` events (04:19:48 and later) are followed by continued `progress` events for the same labels, so the default action is detect-only; no lineage was killed by it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The stall detector aborted a working lineage": ruled out on the ledger — three `stall_detected` events (04:19:48 and later) are followed by continued `progress` events for the same labels, so the default action is detect-only; no lineage was killed by it.

### "The strongest-restriction catalog/scenario claims drifted from the implementation": ruled out — every named signal resolves in the source, and the five required tests exist under their stated names. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: "The strongest-restriction catalog/scenario claims drifted from the implementation": ruled out — every named signal resolves in the source, and the five required tests exist under their stated names.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The strongest-restriction catalog/scenario claims drifted from the implementation": ruled out — every named signal resolves in the source, and the five required tests exist under their stated names.

### "The target packet's generated metadata violates its own schema": ruled out — `validateGraphMetadataContent` returns `ok: true` with `migrated: false` on the packet's `graph-metadata.json`, and both `folderDescriptionSchema` and `perFolderDescriptionSchema` pass on its `description.json`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "The target packet's generated metadata violates its own schema": ruled out — `validateGraphMetadataContent` returns `ok: true` with `migrated: false` on the packet's `graph-metadata.json`, and both `folderDescriptionSchema` and `perFolderDescriptionSchema` pass on its `description.json`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The target packet's generated metadata violates its own schema": ruled out — `validateGraphMetadataContent` returns `ok: true` with `migrated: false` on the packet's `graph-metadata.json`, and both `folderDescriptionSchema` and `perFolderDescriptionSchema` pass on its `description.json`.

### "The workflow calls `convergence.cjs` with flags the script rejects": ruled out — the YAML passes `--spec-folder/--loop-type/--session-id/--convergence-mode` and the script's main path requires exactly those (convergence.cjs:672-716). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The workflow calls `convergence.cjs` with flags the script rejects": ruled out — the YAML passes `--spec-folder/--loop-type/--session-id/--convergence-mode` and the script's main path requires exactly those (convergence.cjs:672-716).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The workflow calls `convergence.cjs` with flags the script rejects": ruled out — the YAML passes `--spec-folder/--loop-type/--session-id/--convergence-mode` and the script's main path requires exactly those (convergence.cjs:672-716).

### "Trust resolution can default to trusted": ruled out — the default is `SYSTEM_SKILL_ADVISOR_CLI_TRUSTED === '1' || SPECKIT_SKILL_ADVISOR_CLI_TRUSTED === '1'`, else untrusted (`skill-advisor-cli.js:300-301, 344`), `--untrusted` can force it back off (`:400-401`), and the guard refuses anything without `trusted === true` (`trusted-caller.ts:23-40`). -- BLOCKED (iteration 10, 1 attempts)
- What was tried: "Trust resolution can default to trusted": ruled out — the default is `SYSTEM_SKILL_ADVISOR_CLI_TRUSTED === '1' || SPECKIT_SKILL_ADVISOR_CLI_TRUSTED === '1'`, else untrusted (`skill-advisor-cli.js:300-301, 344`), `--untrusted` can force it back off (`:400-401`), and the guard refuses anything without `trusted === true` (`trusted-caller.ts:23-40`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Trust resolution can default to trusted": ruled out — the default is `SYSTEM_SKILL_ADVISOR_CLI_TRUSTED === '1' || SPECKIT_SKILL_ADVISOR_CLI_TRUSTED === '1'`, else untrusted (`skill-advisor-cli.js:300-301, 344`), `--untrusted` can force it back off (`:400-401`), and the guard refuses anything without `trusted === true` (`trusted-caller.ts:23-40`).

### "Version drift across a hub's surfaces": ruled out — `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json` and the latest changelog all read `1.7.1.0` for `cli-external-orchestration` and `0.8.0.0` for `cli-classifier`. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: "Version drift across a hub's surfaces": ruled out — `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json` and the latest changelog all read `1.7.1.0` for `cli-external-orchestration` and `0.8.0.0` for `cli-classifier`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Version drift across a hub's surfaces": ruled out — `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json` and the latest changelog all read `1.7.1.0` for `cli-external-orchestration` and `0.8.0.0` for `cli-classifier`.

### Diffing mirrors by hand for content that a format conversion makes incomparable (e.g. codex TOML): not attempted — the repository's own checker owns the comparison rule and was executed instead. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Diffing mirrors by hand for content that a format conversion makes incomparable (e.g. codex TOML): not attempted — the repository's own checker owns the comparison rule and was executed instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Diffing mirrors by hand for content that a format conversion makes incomparable (e.g. codex TOML): not attempted — the repository's own checker owns the comparison rule and was executed instead.

### Executing one scenario end to end via vitest: not attempted — the runner writes caches and fixtures outside the lineage; the path resolution and file existence are the observed facts, and the runner's own filter semantics are not needed to show the named path is absent. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Executing one scenario end to end via vitest: not attempted — the runner writes caches and fixtures outside the lineage; the path resolution and file existence are the observed facts, and the runner's own filter semantics are not needed to show the named path is absent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Executing one scenario end to end via vitest: not attempted — the runner writes caches and fixtures outside the lineage; the path resolution and file existence are the observed facts, and the runner's own filter semantics are not needed to show the named path is absent.

### Executing the convergence script against this lineage's own state to compare graph signals with the documented 3-signal vote: not attempted — it would write observability events outside the lineage directory, and the run keeps convergence as telemetry under `stopPolicy: max-iterations`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Executing the convergence script against this lineage's own state to compare graph signals with the documented 3-signal vote: not attempted — it would write observability events outside the lineage directory, and the run keeps convergence as telemetry under `stopPolicy: max-iterations`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Executing the convergence script against this lineage's own state to compare graph signals with the documented 3-signal vote: not attempted — it would write observability events outside the lineage directory, and the run keeps convergence as telemetry under `stopPolicy: max-iterations`.

### Invoking the advisor CLI end to end: not attempted — it cold-starts a daemon and writes under a state directory outside the lineage; the contract checks above are static and the limitation is stated. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Invoking the advisor CLI end to end: not attempted — it cold-starts a daemon and writes under a state directory outside the lineage; the contract checks above are static and the limitation is stated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Invoking the advisor CLI end to end: not attempted — it cold-starts a daemon and writes under a state directory outside the lineage; the contract checks above are static and the limitation is stated.

### Loading the sentinel and the rubric guard under a parser to prove the NUL is syntactically benign: the files are already required by their adapters and tests in shipped runs, and no parser was needed for the finding; executing them would write state under the hooks' state directory, outside the lineage. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Loading the sentinel and the rubric guard under a parser to prove the NUL is syntactically benign: the files are already required by their adapters and tests in shipped runs, and no parser was needed for the finding; executing them would write state under the hooks' state directory, outside the lineage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Loading the sentinel and the rubric guard under a parser to prove the NUL is syntactically benign: the files are already required by their adapters and tests in shipped runs, and no parser was needed for the finding; executing them would write state under the hooks' state directory, outside the lineage.

### Re-executing any of the suites for final numerics: still BLOCKED by containment; every verification in this lineage is a read, an executed read-only command, or a repository checker run in `--check` mode. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Re-executing any of the suites for final numerics: still BLOCKED by containment; every verification in this lineage is a read, an executed read-only command, or a repository checker run in `--check` mode.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-executing any of the suites for final numerics: still BLOCKED by containment; every verification in this lineage is a read, an executed read-only command, or a repository checker run in `--check` mode.

### Re-running the base-tree validation to prove the mismatch predates `v4.0.0.2`: not attempted — it needs a second worktree (`git worktree add`), a git write the lineage contract forbids; the tag-blob comparison already establishes the shipped state. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Re-running the base-tree validation to prove the mismatch predates `v4.0.0.2`: not attempted — it needs a second worktree (`git worktree add`), a git write the lineage contract forbids; the tag-blob comparison already establishes the shipped state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-running the base-tree validation to prove the mismatch predates `v4.0.0.2`: not attempted — it needs a second worktree (`git worktree add`), a git write the lineage contract forbids; the tag-blob comparison already establishes the shipped state.

### Re-running the fan-out or salvage unit suites to reproduce the direct write live: not attempted — lineage containment forbids commands that write outside the lineage directory (vitest caches and temp fixtures). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Re-running the fan-out or salvage unit suites to reproduce the direct write live: not attempted — lineage containment forbids commands that write outside the lineage directory (vitest caches and temp fixtures).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-running the fan-out or salvage unit suites to reproduce the direct write live: not attempted — lineage containment forbids commands that write outside the lineage directory (vitest caches and temp fixtures).

### Regenerating the index to verify the fix direction: not attempted — the generator writes the committed artifact, which is outside the lineage write surface. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Regenerating the index to verify the fix direction: not attempted — the generator writes the committed artifact, which is outside the lineage write surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Regenerating the index to verify the fix direction: not attempted — the generator writes the committed artifact, which is outside the lineage write surface.

### Replaying stage one with a live advisor request: not attempted — the advisor CLI is daemon-backed and could write state outside the lineage; the static alias-versus-router check substitutes for it here and the limitation is stated rather than hidden. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Replaying stage one with a live advisor request: not attempted — the advisor CLI is daemon-backed and could write state outside the lineage; the static alias-versus-router check substitutes for it here and the limitation is stated rather than hidden.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replaying stage one with a live advisor request: not attempted — the advisor CLI is daemon-backed and could write state outside the lineage; the static alias-versus-router check substitutes for it here and the limitation is stated rather than hidden.

### Reproducing the reclaim race by executing the lock library: not attempted — the race needs process interleaving; a scripted reproduction would write outside the lineage directory (temp dirs), and the static interleaving is fully specified by the code paths. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reproducing the reclaim race by executing the lock library: not attempted — the race needs process interleaving; a scripted reproduction would write outside the lineage directory (temp dirs), and the static interleaving is fully specified by the code paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reproducing the reclaim race by executing the lock library: not attempted — the race needs process interleaving; a scripted reproduction would write outside the lineage directory (temp dirs), and the static interleaving is fully specified by the code paths.

### Running `validate.sh` against a scratch fixture to exercise the skip predicate: not attempted — fixtures and build output would write outside the lineage directory. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Running `validate.sh` against a scratch fixture to exercise the skip predicate: not attempted — fixtures and build output would write outside the lineage directory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running `validate.sh` against a scratch fixture to exercise the skip predicate: not attempted — fixtures and build output would write outside the lineage directory.

### Running the parity suite itself (vitest): not attempted — runner caches and fixtures write outside the lineage; the replication above covers the assertions the suite makes about these files. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Running the parity suite itself (vitest): not attempted — runner caches and fixtures write outside the lineage; the replication above covers the assertions the suite makes about these files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running the parity suite itself (vitest): not attempted — runner caches and fixtures write outside the lineage; the replication above covers the assertions the suite makes about these files.

### Running vitest suites to re-derive the tests this loop cites: BLOCKED by lineage containment (runner caches and fixtures write outside the lineage); recorded as exhausted, not retired — a single-writer run outside the lineage can re-derive them. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Running vitest suites to re-derive the tests this loop cites: BLOCKED by lineage containment (runner caches and fixtures write outside the lineage); recorded as exhausted, not retired — a single-writer run outside the lineage can re-derive them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running vitest suites to re-derive the tests this loop cites: BLOCKED by lineage containment (runner caches and fixtures write outside the lineage); recorded as exhausted, not retired — a single-writer run outside the lineage can re-derive them.

### Verifying AC-005/AC-007 (report and push): impossible mid-run and outside the lineage's write authority; recorded as unmet with the sequencing reason rather than guessed. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Verifying AC-005/AC-007 (report and push): impossible mid-run and outside the lineage's write authority; recorded as unmet with the sequencing reason rather than guessed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Verifying AC-005/AC-007 (report and push): impossible mid-run and outside the lineage's write authority; recorded as unmet with the sequencing reason rather than guessed.

<!-- /ANCHOR:exhausted-approaches -->

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- Merge strongest-restriction passing an active P0 — counted-active-only + FAIL mapping verified (fanout-merge.cjs:843-847, 889-901). (iteration 1)
- Leaf-written delta files being gateway-owned — append path refreshes only the state surface. (iteration 2)
- Config-row direct write still in init — fixed in-range by `ef155cf8f4`. (iteration 2)
- The reused reclaim/refresh/release paths clobbering each other — identity re-read and restore verified; only the reclaim path itself lacks the re-read (F002). (iteration 3)
- Command injection in the four focus trees — sweep clean; no `shell: true`/`eval`/`new Function`. (iterations 3, 6)
- Secrets surviving the save scrubber — tree-walk coverage and fail-closed throw verified. (iteration 3)
- The gawk portability defect class surviving elsewhere — all bracket expressions carry the hyphen last. (iteration 4)
- Lookup scope matching a sibling folder by prefix — slash-boundary logic verified. (iteration 5)
- The spec gate being disarmed by environment or by a corrupt state read — fail-open/no-op paths are the documented posture; child bypass requires exactly `1`. (iteration 6)
- Projection replace dropping config keys — invariant only guards the first row (which is why F001's row drops silently). (iterations 1-2)
- The target packet's generated metadata failing its schemas — both schemas executed, pass. (iteration 7)
- The luna-max failure being a dispatch defect — designed retry path, recorded. (iteration 8)
- Registry, version or root-metadata drift in the cli hubs and the fleet — executed gates pass. (iteration 9)
- Advisor trust defaults, degraded marking, socket hardening — verified against code and ENV-REFERENCE. (iteration 10)
- Artifact-root mis-resolution or escape — executed resolver returns the flat packet root. (iteration 11)
- Mirror or hook-registration drift — three checkers pass with exit 0. (iteration 12)
- Playbook/catalog claim drift other than the command base — signals and test names resolve. (iteration 13)
- Added code comments embedding ephemeral labels — delta sweep clean with a matcher control. (iteration 14)

## 12. NEXT FOCUS
<!-- ANCHOR:next-focus -->
None — synthesis complete. Terminal stop: `maxIterationsReached` (15 of 15). Final lineage verdict: CONDITIONAL (0 P0, 2 P1, 6 P2). Report: `review-report.md`; registry: `deep-review-findings-registry.json`.
<!-- /ANCHOR:next-focus -->

## 13. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial (terminal) | 8 | REQ-003 holds; REQ-004 passes on the sample; REQ-001 completes only when all three lineages hit their counts; REQ-002/REQ-005 downstream of the run. |
| `checklist_evidence` | core | partial (terminal) | 8 | CHK-011/012/013/030/031/050 pass on executed evidence; CHK-021 satisfied for this lineage; CHK-020/022/023 downstream. |
| `skill_agent` | overlay | pass (surface) | 9 | Registries, directories, SKILL.md tables and versions agree on both cli hubs; routing not claimed beyond surface consistency. |
| `agent_cross_runtime` | overlay | pass (executed) | 12 | 187 mirrors in sync; 4 hook registration files match the 31-hook registry with 18 Pi extensions; Gate 1 pointer present; all exit 0. |
| `feature_catalog_code` | overlay | pass | 13 | Verdict, claim-adjudication and three-tier severity claims resolve in code. |
| `playbook_capability` | overlay | fail on command base | 13 | Nine scenarios name an unreachable test path (F008); expected signals otherwise match. |

## 14. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial (dispatch/exit/stop-policy paths read) |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs | correctness | 1 | 0 P0, 1 P1 (F001), 0 P2 | complete |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial (verdict/attribution/merge paths read) |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial (settle/pool core read) |
| .skilled/skills/system-deep-loop/runtime/scripts/check-direct-append.cjs | correctness | 1 | 0 P0, 0 P1, 0 P2 | complete (guard semantics read) |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/jsonl-repair.ts | correctness | 1 | 0 P0, 1 P1 (F001) | complete (writer read) |
| .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/shadow-projection-store.ts | correctness | 1 | 0 P0, 1 P1 (F001) | partial (publish/refresh path read) |
| .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs | correctness | 1 | 0 P0, 0 P1, 0 P2 | complete (event-shape and write path read) |
| .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs | correctness | 2 | 0 P0, 0 P1, 0 P2 | partial (registry/coverage/stop/dashboard paths read) |
| .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs | correctness | 2 | 0 P0, 0 P1, 0 P2 | partial (composite score, CLI contract, signal builders read) |
| .skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs | correctness | 2 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts | correctness | 2 | 0 P0, 0 P1, 0 P2 | complete (row mapping read) |
| .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-deltas-contract.ts | correctness | 2 | 0 P0, 0 P1, 0 P2 | partial (stem set and row builders read) |
| .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-manifest.ts | correctness | 2 | 0 P0, 0 P1, 0 P2 | partial (review surfaces read) |
| .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts | correctness | 2 | 0 P0, 0 P1, 0 P2 | partial (projection refresh path read) |
| .skilled/commands/deep/assets/deep-review-auto.yaml | correctness | 2 | 0 P0, 0 P1, 0 P2 | partial (state-write protocol, init, convergence/stop steps read) |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts | security | 3 | 0 P0, 1 P1 (F002), 0 P2 | complete |
| .skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs | security | 3 | 0 P0, 1 P1 (F002), 0 P2 | complete |
| .skilled/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-ledger-writer.ts | security | 3 | 0 P0, 0 P1, 0 P2 | complete (fence comparison read) |
| .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts | security | 3 | 0 P0, 0 P1, 0 P2 | partial (fence-token and append paths read) |
| .skilled/skills/system-deep-loop/runtime/lib/authority-root/resolve-authority-root.ts | security | 3 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/system-deep-loop/runtime/tests/unit/loop-lock.vitest.ts | security | 3 | 0 P0, 0 P1, 0 P2 | partial (race tests indexed/read) |
| .skilled/skills/system-spec-kit/shared/parsing/secret-scrubber.ts | security | 3 | 0 P0, 0 P1, 0 P2 | complete (patterns and fail-closed path read) |
| .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts | security | 3 | 0 P0, 0 P1, 0 P2 | partial (scrub coverage read) |
| .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh | correctness | 4 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh | correctness | 4 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs | correctness | 4 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh | correctness | 4 | 0 P0, 0 P1, 1 P2 (F003 context) | partial (separator/table/citation paths read) |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-closure.sh | correctness | 4 | 0 P0, 0 P1, 0 P2 | partial (separator rows read) |
| .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts | correctness | 4 | 0 P0, 0 P1, 0 P2 | partial (report/exit/baseline/CLI paths read) |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs | correctness | 5 | 0 P0, 0 P1, 0 P2 | complete (executed) |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs | correctness | 5 | 0 P0, 0 P1, 1 P2 (F004 context) | partial (check mode executed and read) |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/freshness.mjs | correctness | 5 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs | correctness | 5 | 0 P0, 0 P1, 0 P2 | partial (roots/exclusions read) |
| .skilled/skills/system-spec-kit/runtime/data/trigger-index.json | correctness | 5 | 0 P0, 0 P1, 1 P2 (F004) | complete (checked against the tag) |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs | security | 6 | 0 P0, 0 P1, 0 P2 | partial (env semantics and decision path read) |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs | security | 6 | 0 P0, 0 P1, 1 P2 (F005) | complete (NUL site inspected) |
| .skilled/skills/system-deep-loop/deep-improvement/scripts/shared/rubric-guard.cjs | security | 6 | 0 P0, 0 P1, 1 P2 (F005, pre-existing) | complete (NUL site inspected) |
| .skilled/skills/system-spec-kit/runtime/lib/validation/generated-metadata-integrity.ts | correctness | 7 | 0 P0, 0 P1, 1 P2 (F006 context) | complete (executed) |
| .skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts | correctness | 7 | 0 P0, 0 P1, 1 P2 (F006 context) | partial (validation/fingerprint paths read and executed) |
| .skilled/skills/system-spec-kit/runtime/lib/config/capability-flags.ts | correctness | 7 | 0 P0, 0 P1, 0 P2 | partial (flag defaults read) |
| specs/system-speckit/033-system-speckit-v4/graph-metadata.json | correctness | 7 | 0 P0, 0 P1, 1 P2 (F006) | complete (gate executed) |
| specs/system-speckit/033-system-speckit-v4/068-.../graph-metadata.json + description.json | correctness | 7 | 0 P0, 0 P1, 0 P2 | complete (schemas executed) |
| review/deep-review-config.json + orchestration-status.log | traceability | 8 | 0 P0, 0 P1, 0 P2 | complete (events mapped) |
| acceptance-criteria.md + tasks.md (packet) | traceability | 8 | 0 P0, 0 P1, 0 P2 | complete (rows mapped) |
| .skilled/skills/system-deep-loop/deep-review/SKILL.md + .skilled/commands/deep/assets/deep-review-auto.yaml | traceability | 8 | 0 P0, 0 P1, 1 P2 (F007) | complete (conflict lines read) |
| cli-external-orchestration + cli-classifier registries/routers/SKILL.md | maintainability | 9 | 0 P0, 0 P1, 0 P2 | complete (cross-checked + gate executed) |
| system-skill-advisor root metadata | maintainability | 9 | 0 P0, 0 P1, 0 P2 | complete (class S confirmed by gate) |
| .skilled/bin/skill-advisor.cjs + advisor runtime tools | correctness | 10 | 0 P0, 0 P1, 0 P2 | complete (static; contract cross-checks) |
| system-spec-kit/shared/ipc/socket-server.ts (bind hardening) | correctness | 10 | 0 P0, 0 P1, 0 P2 | partial (bind guards read) |

## 15. REVIEW BOUNDARIES

- Max iterations: 15
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-flash-max-1791260058145-vgna23, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 9-13 tool calls
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-10-06T04:20:00Z
