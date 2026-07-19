---
title: "179 -- Empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY)"
description: "This scenario validates empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY) for `179`. It focuses on the default-on graduated rollout and verifying structured recovery payloads for empty/weak search results."
version: 3.6.0.14
id: ux-hooks-empty-result-recovery-speckit-empty-result-recovery-v1
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 179 -- Empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY)

## 1. OVERVIEW

This scenario validates empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY) for `179`. It focuses on the default-on graduated rollout and verifying structured recovery payloads for empty/weak search results.

---

## 2. SCENARIO CONTRACT


- Objective: Verify structured recovery payloads for empty/weak search results.
- Real user request: `Please validate Empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY) against SPECKIT_EMPTY_RESULT_RECOVERY and tell me whether the expected signals are present: 3 statuses: no_results, low_confidence, partial; root cause reasons: spec_filter_too_narrow, low_signal_query, knowledge_gap; suggested actions: retry_broader, switch_mode, save_memory, ask_user; alternative queries generated; DEFAULT_LOW_CONFIDENCE_THRESHOLD=0.4; PARTIAL_RESULT_MIN=3.`
- Prompt: `Validate empty result recovery payloads for empty and weak memory_search results.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: 3 statuses: no_results, low_confidence, partial; root cause reasons: spec_filter_too_narrow, low_signal_query, knowledge_gap; suggested actions: retry_broader, switch_mode, save_memory, ask_user; alternative queries generated; DEFAULT_LOW_CONFIDENCE_THRESHOLD=0.4; PARTIAL_RESULT_MIN=3
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all 3 recovery statuses generate structured payloads with root cause, actions, and alternative queries; FAIL if any status missing, payloads lack required fields, or recovery not triggered at correct thresholds

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, verify structured recovery payloads for empty/weak search results against SPECKIT_EMPTY_RESULT_RECOVERY. Verify recovery payload contains status (no_results/low_confidence/partial); root cause reason (spec_filter_too_narrow/low_signal_query/knowledge_gap); suggested actions (retry_broader/switch_mode/save_memory/ask_user); alternative query suggestions; thresholds: LOW_CONFIDENCE=0.4, PARTIAL_MIN=3. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Confirm `SPECKIT_EMPTY_RESULT_RECOVERY` is unset or `true`
2. `memory_search({ query: "completely nonexistent topic xyzzy" })` — triggers no_results
3. Search for vague/low-signal query — triggers low_confidence
4. Search with narrow specFolder filter — triggers partial
5. Inspect recovery payload for each: status, reason, actions, alternative queries

### Expected

Recovery payload contains status (no_results/low_confidence/partial); root cause reason (spec_filter_too_narrow/low_signal_query/knowledge_gap); suggested actions (retry_broader/switch_mode/save_memory/ask_user); alternative query suggestions; thresholds: LOW_CONFIDENCE=0.4, PARTIAL_MIN=3

### Evidence

Test transcript and observed output, run on 2026-07-02:

```text
$ if test -z "${SPECKIT_EMPTY_RESULT_RECOVERY+x}"; then printf 'SPECKIT_EMPTY_RESULT_RECOVERY is unset\n'; else printf 'SPECKIT_EMPTY_RESULT_RECOVERY=%s\n' "$SPECKIT_EMPTY_RESULT_RECOVERY"; fi
SPECKIT_EMPTY_RESULT_RECOVERY is unset
```

Native MCP `memory_search` wrapper attempts were rejected before executing the scenario search when empty optional fields or placeholder cursors were supplied:

```json
{
  "summary": "Error: An unexpected error occurred. Please check logs for details.",
  "data": {
    "error": "An unexpected error occurred. Please check logs for details.",
    "code": "E030",
    "details": {
      "tool": "memory_search",
      "issues": [
        "cursor: Too small: expected string to have >=1 characters",
        "concepts: Too small: expected array to have >=2 items"
      ]
    }
  }
}
```

The documented CLI front door was initially blocked by stale dist:

```text
$ node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"completely nonexistent topic xyzzy","limit":10,"includeConstitutional":false,"profile":"debug","includeTrace":true,"bypassCache":true}' --format json --timeout-ms 10000
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp-server && npm run build
```

Rebuild was not run because it would write outside the allowed scenario file. The CLI source exposes the read-only stale-dist bypass `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1`, so the search commands were executed with that environment variable.

No-results command from the scenario did not produce `status: "no_results"`; it returned 5 memories and no `recovery` object:

```text
$ SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1 node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"completely nonexistent topic xyzzy","limit":10,"includeConstitutional":false,"profile":"debug","includeTrace":true,"bypassCache":true}' --format json --timeout-ms 10000
(node:6431) ExperimentalWarning: SQLite is an experimental feature and might change at any time
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
    "citationPolicy": "do_not_cite_results",
    "envelopeRender": "requestQuality weak\ncitationPolicy do_not_cite_results",
    "retrievalTrace": {
      "traceId": "tr_mr43r2ct_jym5g7",
      "query": "completely nonexistent topic xyzzy",
      "finalResultCount": 5
    },
    "summary": "Found 5 memories"
  }
}
```

Low-signal query produced a `low_confidence` recovery payload with `knowledge_gap`, suggested queries, and singular `recommendedAction`:

```text
$ SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1 node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"thing stuff help","limit":10,"includeConstitutional":false,"profile":"debug","includeTrace":true,"bypassCache":true}' --format json --timeout-ms 10000
[factory] Failed to read active-embedder metadata from /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp-server/database/context-index.sqlite: database is locked; continuing provider cascade.
(node:6435) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{
  "summary": "Found 5 memories",
  "data": {
    "searchType": "hybrid",
    "count": 5,
    "constitutionalCount": 0,
    "requestQuality": {
      "label": "gap"
    },
    "recovery": {
      "status": "low_confidence",
      "reason": "knowledge_gap",
      "suggestedQueries": [
        "thing stuff",
        "thing stuff help"
      ],
      "recommendedAction": "ask_user"
    },
    "responsePolicy": {
      "requiredAction": "broaden_or_ask",
      "noCanonicalPathClaims": true,
      "citationRequiredForPaths": true,
      "safeResponse": "Retrieval quality is weak. Broaden the query or ask the user for disambiguation before citing any path."
    },
    "retrievalTrace": {
      "traceId": "tr_mr43r2pv_875v0u",
      "query": "thing stuff help",
      "finalResultCount": 5
    },
    "summary": "Found 5 memories"
  }
}
```

Narrow specFolder filter with a nonexistent folder did not produce `partial` or `spec_filter_too_narrow`; it returned 5 memories and no `recovery` object:

```text
$ SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1 node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"memory search recovery payload","specFolder":"definitely-no-such-spec-folder-xyzzy","limit":10,"includeConstitutional":false,"profile":"debug","includeTrace":true,"bypassCache":true}' --format json --timeout-ms 10000
(node:6434) ExperimentalWarning: SQLite is an experimental feature and might change at any time
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
    "citationPolicy": "cite_with_caveat",
    "retrievalTrace": {
      "traceId": "tr_mr43r2m4_c71hph",
      "query": "memory search recovery payload",
      "finalResultCount": 5
    },
    "summary": "Found 5 memories"
  }
}
```

An additional narrow existing specFolder run with `limit: 2` did produce `partial`, but its reason/action did not match the expected `spec_filter_too_narrow` / action-list contract:

```text
$ SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1 node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"memory search recovery payload","specFolder":"system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/003-generic-query-deep-routing","limit":2,"includeConstitutional":false,"profile":"debug","includeTrace":true,"bypassCache":true}' --format json --timeout-ms 10000
(node:6887) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{
  "summary": "Found 2 memories",
  "data": {
    "searchType": "hybrid",
    "count": 2,
    "constitutionalCount": 0,
    "requestQuality": {
      "label": "weak"
    },
    "recovery": {
      "status": "partial",
      "reason": "knowledge_gap",
      "suggestedQueries": [
        "memory search recovery payload",
        "context search recovery payload",
        "memory retrieval recovery payload"
      ],
      "recommendedAction": "broaden_or_ask"
    },
    "retrievalTrace": {
      "traceId": "tr_mr43s25w_somjgm",
      "query": "memory search recovery payload",
      "finalResultCount": 2
    },
    "summary": "Found 2 memories"
  }
}
```

Source constants observed in `mcp-server/lib/search/recovery-payload.ts`:

```ts
const DEFAULT_LOW_CONFIDENCE_THRESHOLD = 0.4;
const PARTIAL_RESULT_MIN = 3;
```

### Pass / Fail

- **FAIL**: Expected outcome did not hold. Observed output did not produce all 3 statuses: `no_results` was missing for `completely nonexistent topic xyzzy`; the nonexistent narrow `specFolder` run produced no recovery payload; the only observed `partial` payload used `reason: "knowledge_gap"` and `recommendedAction: "broaden_or_ask"` rather than the expected `spec_filter_too_narrow` and suggested action-list contract. Threshold constants matched source (`DEFAULT_LOW_CONFIDENCE_THRESHOLD = 0.4`, `PARTIAL_RESULT_MIN = 3`).

### Failure Triage

Verify recovery-payload.ts module loaded → Confirm flag is not forced off → Check DEFAULT_LOW_CONFIDENCE_THRESHOLD=0.4 → Verify PARTIAL_RESULT_MIN=3 → Inspect reason inference logic → Check alternative query generation

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [ux-hooks/empty-result-recovery.md](../../feature-catalog/ux-hooks/empty-result-recovery.md)
- Feature flag reference: [feature-flag-reference/1-search-pipeline-features-speckit.md](../../feature-catalog/feature-flag-reference/1-search-pipeline-features-speckit.md)
- Source file: `mcp-server/lib/search/recovery-payload.ts`

---

## 5. SOURCE METADATA

- Group: UX hooks
- Playbook ID: 179
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `ux-hooks/empty-result-recovery-speckit-empty-result-recovery-v1.md`
- audited_post_018: true
