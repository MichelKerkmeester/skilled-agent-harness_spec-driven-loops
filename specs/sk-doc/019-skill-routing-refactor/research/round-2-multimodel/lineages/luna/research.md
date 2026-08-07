---
title: "Second-pass deep audit — sk-doc/019-skill-routing-refactor"
description: "Evidence-backed findings from ten max-iteration passes over the parent packet, 21 direct children, nested descendants, and seven compiled-routing hubs."
session_id: "fanout-luna-1784833766851-nhdtp"
loop_type: research
stop_policy: max-iterations
iterations: 10
---

# Second-pass deep audit

## Scope and outcome

This detached lineage audited the parent packet, all 21 direct children, nested descendants under 020/007/015, the four parent routing-reference documents, the compiled-routing runtime, and all seven hub surfaces. The loop ran all ten configured iterations; convergence telemetry was not used as a stop condition.

Result: 15 verified findings — 10 P1 and 5 P2. One is NEW relative to `140266be3e`; fourteen are PRE-EXISTING. Frozen `research/**`, `benchmark/**`, `lineages/**`, `*.out`, `*.log`, and run-record artifacts were excluded.

## Findings

### F01 — P1 — PRE-EXISTING — 012 is missing a required Level-3 file

`012-sk-doc-routing-fixes/spec.md:36` and `checklist.md:32` declare Level 3, but `implementation-summary.md` is absent. The strict validator reports the required-file failure. The child packet was not changed by `140266be3e`.

### F02 — P1 — PRE-EXISTING — 012 fails the Level-3 consistency check

The Level-3 declaration appears at `012-sk-doc-routing-fixes/spec.md:36`, `plan.md:33`, `tasks.md:32`, `checklist.md:32`, and `decision-record.md:33`; strict validation still reports `LEVEL_MATCH` for the packet. No child file was changed by `140266be3e`.

### F03 — P2 — PRE-EXISTING — 017 violates the frontmatter memory-block field contract

`017-system-code-graph-routing-research/implementation-summary.md:15-16` stores long narrative values in `recent_action` and `next_safe_action`. Structural validation reports `SPECDOC_FRONTMATTER_004`. A separate missing `_memory` warning in `research/research.md` was excluded because `research/**` is frozen by scope.

### F04 — P1 — PRE-EXISTING — 019 claims research completion while graph state remains active

`019-sk-prompt-routing-research/spec.md:46` says `Research Complete`; `implementation-summary.md:45` says `Research Complete (100%)`; `graph-metadata.json:42` remains `in_progress`. The lifecycle authority rule at `context-index.md:113-118` makes this a completion-truthfulness defect.

### F05 — P2 — PRE-EXISTING — pending-state vocabulary is inconsistent

`006-create-skill-router-marker-gap/graph-metadata.json:37` says `in_progress` while `spec.md:19` says analysis is complete and a decision is pending. Separately, `015-sk-code-router-alignment/graph-metadata.json:42` says `planned`, while `implementation-summary.md:43` says `In Progress (~70%)` and `checklist.md:76` remains open. These are pending-state synchronization defects, not completion claims.

### F06 — P1 — PRE-EXISTING — the parent contradicts itself about surface-router coverage

`routing-config-and-advisor-reference.md:136` and `:184` say only `sk-code` and `sk-doc` carry the surface router, while `:199` and `:202` describe all seven hubs and a 7-of-7 collapse. Direct inspection found `shared/references/smart-routing.md` and populated manifests for all seven named hubs. The contradictory parent wording predates `140266be3e`.

### F07 — P1 — PRE-EXISTING — the parent calls hub-router selection telemetry-only while the live runtime serves compiled policy

`routing-config-and-advisor-reference.md:202` describes hub-router selection as only `routeTelemetry`, but `routing-before-after.md:131` identifies the compiled runtime as serving authority. The live runtime loads and evaluates compiled hub policy at `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/compiled-route.cjs:65-106`; representative serving routers consume policy-defined bundles at `.../007-sk-doc/lib/router.cjs:167-172`, `.../006-sk-design/lib/router.cjs:158-163`, and `.../003-mcp-tooling/lib/router.cjs:119-127`. The parent claim is unscoped and stale; it was not introduced by the commit.

### F08 — P2 — PRE-EXISTING — route-gold hub denominator is inconsistent

`routing-before-after.md:154` reports `7/7 hubs PASS`, while the non-frozen verification report at `020-router-unification-program/001-3-tier-consistency-standard/verification-report.md:32-55` covers six hubs and reports `6/6 PASS`; `routing-before-after.md:161` also says six hubs are applicable. The child implementation summary repeats `7/7` at `.../implementation-summary.md:54,111`, although its arithmetic contains six hub rows. The 91/106 scenario count is not itself rejected; the hub denominator is ambiguous. This wording predates `140266be3e`.

### F09 — P1 — NEW — the commit's new root pointer leaves nested resume stranded at 020

`019/graph-metadata.json:122` now points to `020-router-unification-program`; that line changed in `140266be3e`. The resume contract at `.opencode/skills/system-spec-kit/README.md:198` requires nested redirects, but `020/graph-metadata.json:109` is null and `020/007-unified-refactor-implementation/graph-metadata.json:111` is also null. Read-only execution of the real resolver reaches 020 and stops before active descendants. The null nested fields predate the commit; exposing that incomplete chain through the new root pointer is the NEW behavior.

### F10 — P1 — PRE-EXISTING — the 14-child 015 parent points resume at stale work

`020/007/.../015-routing-coverage-activation-verification/graph-metadata.json:168-169` points to child 011 with a 2026-07-21 active timestamp. Child 013 has a later save at `.../013-compiled-coverage-buildout/graph-metadata.json:42,210` on 2026-07-23. The real resolver follows 011 rather than the later active child. `015/graph-metadata.json:6-20` confirms all 14 children are enumerated, so this is pointer freshness, not child enumeration. No nested file was changed by the commit.

### F11 — P2 — PRE-EXISTING — nested completion surfaces disagree with graph/checklist state

`015/.../009-sk-doc-template-alignment/spec.md:40` and `implementation-summary.md:22` say Complete, but `graph-metadata.json:42` says `in_progress` and `checklist.md:67,109` remains open. Likewise, `015/.../013-compiled-coverage-buildout/spec.md:64` and `implementation-summary.md:48` say Complete, while `graph-metadata.json:42` says `in_progress` and `checklist.md:92,124,159` has open items. The explicit deferrals explain the conservative graph state but do not synchronize the surfaces.

### F12 — P1 — PRE-EXISTING — 013's scope table points at an untracked advisor tree

`013-skill-advisor-routing-fixes/spec.md:118-136` directs hook, test, scorer, baseline, and script work under `system-skill-advisor/mcp_server/`. The canonical tracked source is `system-skill-advisor/mcp-server/`; `git ls-files .opencode/skills/system-skill-advisor/mcp_server` returns no tracked files. The packet acknowledges the correction at `decision-record.md:580-582`, but its authoritative scope table remains stale. The child was not changed by the commit.

### F13 — P2 — PRE-EXISTING — 012 retains the removed `smart_routing.md` filename

`012-sk-doc-routing-fixes/spec.md:90,124,149` and `plan.md:102` retain `smart_routing.md`, while the live file is `.opencode/skills/sk-doc/shared/references/smart-routing.md`. The parent spelling was corrected by `140266be3e`, but the child was not, leaving a stale cross-document path contract.

### F14 — P1 — PRE-EXISTING — parent phase-map lifecycle is ahead of nested graph state

The parent phase map labels Group E and Group F Active/In Progress at `019/spec.md:115-116`, while their phase-parent graphs say `planned` at `020/graph-metadata.json:41` and `021/graph-metadata.json:41`. Active descendants exist at `020/001.../graph-metadata.json:51`, `020/004.../graph-metadata.json:41`, and `021/011-review-remediation/graph-metadata.json:42`. This conflicts with the machine-authoritative lifecycle rule at `context-index.md:113-118` and predates the commit.

### F15 — P1 — PRE-EXISTING — sk-code's live typed resource contract resolves no routed resources

Live replay of `sk-code` returns `resourceContractVersion: 1`, `pairs: []`, and seven unresolved paths for a task selecting implementation and debugging resources. `router-replay.cjs:235-261` shows that the contract dual-reads each raw path and rejects paths absent from the declared manifest. The source emits unqualified paths at `sk-code/shared/references/smart-routing.md:317-322`, `:347-350`, `:399-409`, and `:411-417`, while `sk-code/leaf-manifest.json:4-72` registers mode-qualified leaves such as `code-opencode/...` and `code-webflow/...`. The source's relative links to `./stack-detection.md` and `./phase-detection.md` at `smart-routing.md:17,29,40-41` also have no corresponding hub-root files. This contradicts the parent path/coverage claim at `routing-config-and-advisor-reference.md:122-138`. The router, manifest, and parent lines were not changed by `140266be3e`; the defect is PRE-EXISTING.

## Clean checks and ruled-out directions

- All 21 direct children and the nested 020/007/015 topology were enumerated. `children_ids` matched on-disk children for the parent, 020, 020/007, and 015.
- The duplicate `012` prefixes in 020/007 are distinct full packet IDs; the real resume resolver does not treat them as a collision. This is not a finding.
- All seven hubs matched on registry/router/manifest mode identity; all seven activation manifests are compiled-serving; the 62-file serving closure exists; and check-only manifest regeneration passed.
- The non-excluded root-aware Markdown-link scan found no broken or absolute-worktree links in 449 Markdown files. Stale authored path tokens are reported separately as F12, F13, and F15.
- The other six hubs did not produce an equivalent unresolved typed-contract result in representative replays.
- Conservative `in_progress` states with explicit deferred requirements were not promoted without contradictory completion evidence.

## Execution note

The detached executor route was recorded as `cli-codex` with model `gpt-5.6-luna`. The environment could not complete the nested external dispatch because the Codex app server lacked network/DNS access, so the workflow's in-process fallback carried out the same research phases while preserving executor metadata, route-proof, append-only state, ten max iterations, and the requested lineage write boundary.

## Synthesis status

Phase synthesis completed in this lineage. No audited parent, child, runtime, manifest, or historical artifact was modified.
