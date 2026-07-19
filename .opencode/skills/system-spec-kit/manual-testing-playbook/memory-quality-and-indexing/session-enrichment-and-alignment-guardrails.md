---
title: "M-006 -- Session Enrichment and Alignment Guardrails"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-006`."
audited_post_018: true
phase_018_replaces: "archived phase 014 quality-gate framing and external memory-continuity assumptions"
version: 3.6.0.20
id: memory-quality-and-indexing-session-enrichment-and-alignment-guardrails
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# M-006 -- Session Enrichment and Alignment Guardrails

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-006`.

---

## 2. SCENARIO CONTRACT


- Objective: This snippet preserves the canonical memory/spec-kit operator workflow for `M-006`.
- Real user request: `` Please validate Session Enrichment and Alignment Guardrails against memory_search({ query: "handover continuity alignment", specFolder: "specs/<target-spec>" }) and tell me whether the expected signals are present: the save resolves through `handover.md` first, then `_memory.continuity`, then spec docs; spec-folder and git enrichment remain supporting-only; and it does not raise `ALIGNMENT_BLOCK` when captured files match the spec's files-to-change table. ``
- Prompt: `Validate session enrichment and alignment guardrails against memory_search.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: the save resolves through `handover.md` first, then `_memory.continuity`, then spec docs; spec-folder and git enrichment remain supporting-only; and it does not raise `ALIGNMENT_BLOCK` when captured files match the spec's files-to-change table
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: captured-session save succeeds for matching files, emits provenance-backed context, and still blocks unrelated captures when overlap is genuinely low.

---

## 3. TEST EXECUTION

### Prompt

`Validate session enrichment and alignment guardrails against memory_search.`
### Commands
- `memory_search({ query: "handover continuity alignment", specFolder: "specs/<target-spec>" })`
### Expected

the save resolves through `handover.md` first, then `_memory.continuity`, then spec docs; spec-folder and git enrichment remain supporting-only; and it does not raise `ALIGNMENT_BLOCK` when captured files match the spec's files-to-change table.
### Evidence

Command run exactly as documented, preserving the unresolved target placeholder via the daemon-backed CLI front door after native MCP wrapper validation rejected empty optional fields:

`node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"handover continuity alignment","specFolder":"specs/<target-spec>"}' --format json --timeout-ms 3000`

Actual stdout/stderr excerpt:

```text
(node:2723) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{
  "summary": "Found 5 memories",
  "data": {
    "searchType": "hybrid",
    "count": 5,
    "constitutionalCount": 0,
    "requestQuality": {
      "label": "weak"
    },
    "recovery": {
      "status": "low_confidence",
      "reason": "knowledge_gap",
      "suggestedQueries": [
        "handover continuity alignment"
      ],
      "recommendedAction": "ask_user"
    },
    "citationPolicy": "cite_with_caveat",
    "envelopeRender": "requestQuality weak\ncitationPolicy cite_with_caveat",
    "responsePolicy": {
      "requiredAction": "broaden_or_ask",
      "noCanonicalPathClaims": true,
      "citationRequiredForPaths": true,
      "safeResponse": "Retrieval quality is weak. Broaden the query or ask the user for disambiguation before citing any path."
    },
    "pipelineMetadata": {
      "stage1": {
        "searchType": "hybrid",
        "channelCount": 1,
        "activeChannels": 2,
        "candidateCount": 6,
        "constitutionalInjected": 0,
        "durationMs": 397
      },
      "stage2": {
        "sessionBoostApplied": "off",
        "causalBoostApplied": "applied",
        "intentWeightsApplied": "off",
        "artifactRoutingApplied": "applied",
        "qualityFiltered": 0,
        "durationMs": 580,
        "coActivationApplied": true,
        "communityBoostApplied": true,
        "graphSignalsApplied": true
      },
      "timing": {
        "stage1": 397,
        "stage2": 580,
        "stage3": 0,
        "stage4": 0,
        "total": 977
      }
    },
    "sourceContract": {
      "version": "gate-d-reader-ready-v1",
      "archivedTierEnabled": false,
      "legacyFallbackEnabled": false,
      "includeArchivedCompatibility": "not_requested",
      "preferredDocumentTypes": [
        "spec_doc",
        "continuity"
      ],
      "retainedResults": 5,
      "droppedNonCanonicalResults": 0,
      "countsBySourceKind": {
        "spec_doc": 5,
        "continuity": 0,
        "constitutional": 0
      }
    },
    "progressiveDisclosure": {
      "summaryLayer": {
        "count": 5,
        "digest": "5 weak"
      }
    },
    "results": [
      {
        "id": 4498,
        "specFolder": "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/050-all-skills-alignment-sweep",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/050-all-skills-alignment-sweep/tasks.md",
        "title": "Tasks: All Skills Alignment Sweep",
        "score": 0.58484168,
        "importanceTier": "critical",
        "sourceKind": "system"
      },
      {
        "id": 4481,
        "specFolder": "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/047-handover-anchor-naming",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/047-handover-anchor-naming/tasks.md",
        "title": "4481 -> 3540",
        "score": 0.5729837435452942,
        "importanceTier": "important",
        "sourceKind": "system"
      },
      {
        "id": 4577,
        "specFolder": "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/007-auto-embedder-selection-and-llama-cpp-purge",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/007-auto-embedder-selection-and-llama-cpp-purge/handover.md",
        "title": "Handover: 016/002/007 — pre-compaction state snapshot 2026-05-18 21:50 PM",
        "score": 0.45359999999999995,
        "importanceTier": "important",
        "sourceKind": "system"
      }
    ],
    "evidenceDigest": "5 results retrieved; avg score 0.46."
  }
}
```

The observed output did not include save stdout, did not show a continuity ladder resolving through `handover.md` then `_memory.continuity` then spec docs, did not demonstrate absence of `ALIGNMENT_BLOCK` for matching code files, and returned `requestQuality.label: "weak"` with `responsePolicy.requiredAction: "broaden_or_ask"`. The scenario command contains `specs/<target-spec>` but no concrete target spec or setup data is provided in this file.
### Pass/Fail

BLOCKED - the command's unresolved `specs/<target-spec>` placeholder prevents validating the expected continuity ladder and alignment-guard behavior against a real target spec.
### Failure Triage

inspect `input-normalizer.ts` relevance filtering, compare captured file paths to the spec's files-to-change table, verify handover/continuity precedence, then rerun.

#### M-006a: Unborn-HEAD and dirty snapshot fallback
1. Initialize a sandbox repo without creating a commit yet, then create one in-scope file.
2. Run:
   `node - <<'NODE'
   const { extractGitContext } = require('./.opencode/skills/system-spec-kit/scripts/dist/extractors/git-context-extractor.js');
   (async () => {
     const result = await extractGitContext(process.cwd());
     console.log(JSON.stringify(result, null, 2));
   })().catch((error) => {
     console.error(error);
     process.exit(1);
   });
   NODE`
3. Verify: `headRef` shows the current branch, `commitRef` is `null`, `repositoryState` is `dirty`, and uncommitted files are listed.

#### M-006b: Detached-HEAD snapshot preservation
1. Checkout a detached `HEAD` in a sandbox repo that already has at least one commit affecting the target scope.
2. Run the same extractor command as M-006a.
3. Verify: `headRef` is `HEAD`, `commitRef` is populated, `isDetachedHead` is `true`, and the extractor still returns recent in-scope commit observations.

#### M-006c: Similar-folder boundary protection
1. Create two spec folders where one slug is a prefix of the other, but only the target spec contains in-scope files.
2. Commit a change only under the similarly named foreign folder.
3. Run the extractor command from M-006a with the target spec folder hint.
4. Verify: recent commit observations do not include the foreign folder path, and the target result remains empty or limited to genuinely in-scope history.

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [memory-quality-and-indexing/session-enrichment-and-alignment-guards.md](../../feature-catalog/memory-quality-and-indexing/session-enrichment-and-alignment-guards.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: M-006
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `memory-quality-and-indexing/session-enrichment-and-alignment-guardrails.md`
