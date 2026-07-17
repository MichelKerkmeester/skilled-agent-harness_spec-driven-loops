---
title: "167 -- Response profile v1 (SPECKIT_RESPONSE_PROFILE)"
description: "This scenario validates response profile v1 (SPECKIT_RESPONSE_PROFILE) for `167`. It focuses on enabling the flag, requesting the `quick` profile, and verifying reduced response shape while keeping the live context-side profile routing in view."
version: 3.6.0.15
id: ux-hooks-response-profile-v1-speckit-response-profile-v1
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 167 -- Response profile v1 (SPECKIT_RESPONSE_PROFILE)

## 1. OVERVIEW

This scenario validates response profile v1 (SPECKIT_RESPONSE_PROFILE) for `167`. It focuses on enabling the flag, requesting the `quick` profile, and verifying reduced response shape while the context-side routing path remains live.

---

## 2. SCENARIO CONTRACT


- Objective: Verify mode-aware response shape routing for the quick profile.
- Real user request: `Please validate Response profile v1 (SPECKIT_RESPONSE_PROFILE) against SPECKIT_RESPONSE_PROFILE=true and tell me whether the expected signals are present: quick profile returns QuickProfile with topResult, oneLineWhy, omittedCount, and tokenReduction.savingsPercent; research profile returns results[], evidenceDigest, followUps[]; resume profile returns state, nextSteps[], blockers[]; original full response when flag OFF or profile omitted.`
- Prompt: `Validate response profile v1 quick-mode response routing with SPECKIT_RESPONSE_PROFILE enabled.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: quick profile returns QuickProfile with topResult, oneLineWhy, omittedCount, and tokenReduction.savingsPercent; research profile returns results[], evidenceDigest, followUps[]; resume profile returns state, nextSteps[], blockers[]; original full response when flag OFF or profile omitted
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if quick profile contains topResult + tokenReduction, research has evidenceDigest, resume has nextSteps, and full response when flag OFF; FAIL if profile shape missing expected fields or token savings not calculated; memory_context now auto-routes an inferred profile when no explicit profile is supplied, so the profile surface is live on both search and context handlers even though this scenario stays search-first.

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, verify quick profile reduced response shape against SPECKIT_RESPONSE_PROFILE=true. Verify quick: topResult + oneLineWhy + omittedCount + tokenReduction; research: results + evidenceDigest + followUps; resume: state + nextSteps + blockers; full response when flag OFF. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `SPECKIT_RESPONSE_PROFILE=true`
2. `memory_search({ query: "test profiles", profile: "quick" })`
3. Verify QuickProfile shape
4. Re-run with profile=research, verify ResearchProfile
5. Re-run with profile=resume, verify ResumeProfile

### Expected

quick: topResult + oneLineWhy + omittedCount + tokenReduction; research: results + evidenceDigest + followUps; resume: state + nextSteps + blockers; full response when flag OFF

### Evidence

Executed the scenario against the live `memory_search` MCP surface. Initial native MCP calls with empty optional values were rejected before execution:

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

Daemon-backed CLI attempt to set the feature flag explicitly was blocked by stale dist output:

```text
$ SPECKIT_RESPONSE_PROFILE=true node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"test profiles","profile":"quick","limit":10}' --format json --timeout-ms 3000
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
```

Rebuilding would modify files outside this scenario's allowed write path, so no build was run.

Native MCP quick profile executed with schema-valid parameters and returned the expected quick-profile fields:

```json
{
  "summary": "Found 5 memories",
  "data": {
    "topResult": {
      "id": 27621,
      "title": "Implementation Summary [template:level_1/implementation-summary.md]",
      "score": 0.55136796
    },
    "oneLineWhy": "Ranked first because semantic similarity and high spec quality",
    "omittedCount": 4,
    "tokenReduction": {
      "originalTokens": 1309,
      "returnedTokens": 281,
      "savingsPercent": 79
    }
  },
  "meta": {
    "responseProfile": "quick"
  }
}
```

Native MCP research profile returned the expected research-profile fields:

```json
{
  "summary": "Found 5 memories",
  "data": {
    "results": [
      {
        "id": 27621,
        "title": "Implementation Summary [template:level_1/implementation-summary.md]",
        "score": 0.55136796
      },
      {
        "id": 27623,
        "title": "Feature Specification: Phase 5: filename-underscore-alignment [template:level_1/spec.md]",
        "score": 0.54007512
      }
    ],
    "evidenceDigest": "5 results retrieved; avg score 0.52.",
    "followUps": []
  },
  "meta": {
    "responseProfile": "research"
  }
}
```

Native MCP resume profile returned the expected resume-profile fields:

```json
{
  "summary": "Found 5 memories",
  "data": {
    "state": "Found 5 memories",
    "nextSteps": [],
    "blockers": [
      "5 result(s) have low confidence scores"
    ],
    "topResult": {
      "id": 27621,
      "title": "Implementation Summary [template:level_1/implementation-summary.md]",
      "score": 0.55136796
    }
  },
  "meta": {
    "responseProfile": "resume"
  }
}
```

Native MCP debug profile returned a full response-shaped payload, but this does not verify the required "full response when flag OFF" condition because the flag-off CLI path is blocked by stale dist:

```json
{
  "summary": "Found 5 memories",
  "data": {
    "results": [
      {
        "id": 27621,
        "title": "Implementation Summary [template:level_1/implementation-summary.md]",
        "score": 0.55136796
      }
    ],
    "summary": "Found 5 memories",
    "hints": [
      "Use includeContent: true to embed file contents in results"
    ],
    "meta": {
      "tool": "memory_search",
      "tokenCount": 4758,
      "latencyMs": 597,
      "cacheHit": false
    },
    "tokenStats": {
      "totalTokens": 1309,
      "resultCount": 5,
      "avgTokensPerResult": 262
    }
  },
  "meta": {
    "responseProfile": "debug"
  }
}
```

### Pass / Fail

- **BLOCKED**: quick, research, and resume profile shapes matched the Expected fields, but the required full-response flag-off control could not be verified because `SPECKIT_RESPONSE_PROFILE=true node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"test profiles","profile":"quick","limit":10}' --format json --timeout-ms 3000` returned `@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build`, and rebuilding would modify files outside the allowed write path.

### Failure Triage

Verify SPECKIT_RESPONSE_PROFILE env → Inspect profile-formatters.ts profile routing → Check estimateTokens() → Verify QuickProfile.tokenReduction.savingsPercent → Check fallback for unknown profile names

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [ux_hooks/mode_aware_response_profiles.md](../../feature_catalog/ux_hooks/mode_aware_response_profiles.md)
- Feature flag reference: [feature_flag_reference/1_search_pipeline_features_speckit.md](../feature_flag_reference/1_search_pipeline_features_speckit.md)
- Source file: `mcp_server/lib/response/profile-formatters.ts`

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 167
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `ux_hooks/response_profile_v1_speckit_response_profile_v1.md`
- phase_018_change: memory_context now auto-routes inferred profiles when no explicit profile is supplied
- audited_post_018: true
