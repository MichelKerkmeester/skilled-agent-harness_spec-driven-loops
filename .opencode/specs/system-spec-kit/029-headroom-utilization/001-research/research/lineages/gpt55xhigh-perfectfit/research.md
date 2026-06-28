# Perfect-Fit Integration - Headroom Utilization

## Verdict

The perfect-fit integration is offline Headroom library compression over copied, non-authoritative deep-loop prompt-pack/tool-output bundles, guarded before the library call and verified after it. The integration point is a sibling compact bundle between deep-loop prompt-pack rendering and cli-codex consumption, not a mutation of MCP traffic, hook briefs, code-graph payloads, generated metadata, JSONL state, source files, or live prompts.

CacheAligner remains useful as an optional detector, but not as the integration itself: it explicitly does not mutate, move, or normalize messages, and its apply path keeps token counts unchanged. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/cache_aligner.py:214-222] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/cache_aligner.py:266-276] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/cache_aligner.py:336-344]

## 1. Exact Surface And Config Knobs

Surface: call Headroom compress() as an offline library on a copied bundle extracted from authoritative artifacts. The bundle is represented as a synthetic tool/document message, never as a system/developer prompt, MCP envelope, hook JSON, code-graph payload, or deep-loop state file.

Exact config:

    CompressConfig(
        compress_user_messages=False,
        compress_system_messages=False,
        protect_recent=0,  # only for isolated copied bundles; keep default 4 for conversation arrays
        protect_analysis_context=True,
        target_ratio=0.5,
        min_tokens_to_compress=250,
        kompress_model="disabled",
    )

Why these knobs:

- compress_user_messages defaults false and should only be true for explicit document/RAG/tool-output cases. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:100-104]
- compress_system_messages must be false, because system/developer messages and hook-injected developer-role context are control-plane data. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:106-110] [SOURCE: .opencode/skills/cli-codex/references/hook_contract.md:137-141]
- protect_recent defaults to 4; use 0 only for a standalone copied bundle. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:111-113]
- protect_analysis_context=True preserves analysis-style context by default. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:115-116]
- target_ratio is a soft conservative target. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:119-123]
- min_tokens_to_compress=250 keeps small artifacts out of the path. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:125-128]
- kompress_model="disabled" skips ML model compression, avoiding network/model dependency in the first integration. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:131-135] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/content_router.py:2099-2113]
- compress() passes the config into the pipeline and uses undiscovered extensions, keeping the call isolated. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:215-216] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:242-256]
- The library reverts if compression inflates token count and returns original messages on exception. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:262-278] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:336-349]

## 2. Exclusion Set And Programmatic Guard

Never touch generated description.json/graph-metadata.json, continuity frontmatter, canonical spec docs, MCP request/response envelopes, hook JSON/startup context/skill-advisor briefs, code-graph readiness/diffs/identifiers, deep-loop state/deltas/graphEvents/validator output, source citations, patches, diffs, Bash outputs, or any byte-exact artifact.

Generated metadata has hardening/fingerprint and strict integrity controls. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:139-142] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:441-444] MCP envelopes are schema-bound and response decoration carries metadata/hints. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1246-1252] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1366-1371] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1435-1461] Hooks have explicit budgets and threshold contracts. [SOURCE: .opencode/skills/system-spec-kit/references/config/hook_system.md:62-78] [SOURCE: .opencode/skills/system-spec-kit/references/config/hook_system.md:98-103] [SOURCE: .opencode/skills/system-spec-kit/references/config/hook_system.md:147-162] Code graph tools gate on freshness and canonical readiness payloads. [SOURCE: .opencode/skills/system-code-graph/references/runtime/tool_surface.md:42-66] [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:983-1012] Deep-loop validates iteration files, state appends, deltas, and graph upserts. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:756-779] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:797-810]

Concrete guard:

    const DENY_PATH = [
      /(^|\/)(description|graph-metadata)\.json$/,
      /(^|\/)deep-research-state\.jsonl$/,
      /(^|\/)deltas\/iter-\d+\.jsonl$/,
      /(^|\/)(handover|implementation-summary|spec|plan|tasks|checklist)\.md$/,
      /(^|\/)(AGENTS|CLAUDE|CODEX|instructions)\.md$/,
      /\.(diff|patch)$/
    ];
    const DENY_KEYS = new Set([
      'jsonrpc', 'method', 'params', 'result', 'error', 'meta', 'data', 'hints',
      'readiness', 'canonicalReadiness', 'trustState', 'requiredAction',
      'affectedSymbols', 'symbolId', 'manifestDigest', 'source_fingerprint',
      '_memory', 'graphEvents', 'sessionId', 'generation'
    ]);

The guard canonicalizes the path, requires an allowlisted artifact kind, rejects denied paths, parses JSON/YAML frontmatter and recursively rejects denied keys, computes raw sha256, extracts [SOURCE: ...] citations before and after, calls Headroom only after those gates pass, rejects inflation or citation loss, and falls back to raw on any exception. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:262-278] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:336-349]

## 3. Exact Wiring Shim

Use one high-value low-risk point: copied prompt-pack context bundles in this lineage family.

- raw copied input: .opencode/specs/system-spec-kit/029-headroom-utilization/001-research/research/lineages/gpt55xhigh-perfectfit/worked-example/raw-bundle.json
- compact candidate: .opencode/specs/system-spec-kit/029-headroom-utilization/001-research/research/lineages/gpt55xhigh-perfectfit/worked-example/compact-bundle.md
- sidecar: .opencode/specs/system-spec-kit/029-headroom-utilization/001-research/research/lineages/gpt55xhigh-perfectfit/worked-example/headroom-sidecar.json

The production-shaped insertion point is after deep-loop renders prompts/iteration-NNN.md and before cli-codex consumes the prompt file. The YAML shows prompt-pack rendering writes the prompt file, and cli-codex then reads it. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:595-614] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:628-669] The prompt-pack renderer is deterministic over provided state/context. [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/prompt-pack.ts:55-72]

The shim writes a sibling compact artifact and sidecar only. It does not mutate the rendered prompt, source docs, JSONL state, delta records, graph metadata, or external Headroom source.

## 4. Worked Example

Input bundle sources:

- .opencode/specs/system-spec-kit/029-headroom-utilization/001-research/research/lineages/gpt55xhigh/iterations/iteration-003.md
- .opencode/specs/system-spec-kit/029-headroom-utilization/001-research/research/lineages/gpt55xhigh/iterations/iteration-007.md

Measured with deterministic ceil(characters / 4) estimate:

- before chars: 7870
- after chars: 4148
- estimated tokens before: 1968
- estimated tokens after: 1037
- estimated tokens saved: 931
- savings ratio: 47.31%
- citation set preserved: true

The compact bundle keeps answer probes and the full extracted citation set from the copied raw bundle. The sidecar records raw and compact sha256 values for audit/re-run. See .opencode/specs/system-spec-kit/029-headroom-utilization/001-research/research/lineages/gpt55xhigh-perfectfit/worked-example/headroom-sidecar.json.

This is a research-side deterministic compact candidate, not a live Headroom output. Live Headroom execution is blocked in this fan-out environment by missing opentelemetry import dependencies, and installing dependencies is outside the research-only instruction.

## 5. Reversibility And Fidelity Proof

Reversibility has two layers: the shim keeps the raw copied bundle hash for deterministic restore/re-run, and Headroom CCR can store originals by hash and retrieve full content locally when CCR markers are used. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/ccr/mcp_server.py:359-413] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/ccr/mcp_server.py:415-483] The compression store validates/stores hashes and retrieves deep-copied original content. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/cache/compression_store.py:261-388] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/cache/compression_store.py:390-451]

Fidelity gates: raw sha256 exists before compression; re-run is deterministic for the same raw input/config or the sidecar is invalid; citation set is equal before/after for cited bundles; answer probes pass against compact output; any failed check uses raw input.

## 6. Telemetry, Privacy, Licensing

Clean-room environment:

    HEADROOM_TELEMETRY=off
    HEADROOM_UPDATE_CHECK=off
    HF_HUB_OFFLINE=1
    TRANSFORMERS_OFFLINE=1
    HEADROOM_DETECT_BACKEND=python
    HEADROOM_WORKSPACE_DIR=.opencode/specs/system-spec-kit/029-headroom-utilization/001-research/research/lineages/gpt55xhigh-perfectfit/.headroom-workspace

Telemetry only enables on explicit on-values. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/telemetry/beacon.py:72-80] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/cli/proxy.py:750-758] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/cli/proxy.py:953-958] Update checks can be disabled with HEADROOM_UPDATE_CHECK=off. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:333-335] Offline HF mode is documented, and model loading supports local-only behavior when downloads are not allowed. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:357-363] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/kompress_compressor.py:494-503] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/kompress_compressor.py:523-529]

Licensing is Apache-2.0 with NOTICE handling. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:443-445] Redistribution requires license/notice obligations. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/LICENSE:89-121] Existing notices are in the external snapshot. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/NOTICE:1-43]

## 7. Acceptance Criteria And Validation Plan

Works perfectly means all pass:

1. Guard accepts only copied bundle artifacts and rejects every excluded path/key class.
2. compress_system_messages=False is enforced and system/developer/hook prompt candidates are rejected before Headroom call.
3. kompress_model="disabled", telemetry off, update check off, and offline env are active for the first pilot.
4. Headroom returns raw on exception or inflation; shim independently rejects non-positive savings. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:262-278] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:336-349]
5. Worked example has positive estimated savings and citation-set equality.
6. Raw sha256 sidecar exists and compact output traces back to raw input.
7. Prepared-env live benchmark runs on the same copied bundle with no network/telemetry/update check and records before/after tokens plus answer-probe/citation survival.
8. No writes occur outside the lineage or future designated prompt-pack sibling directory.

Benchmark fixtures: copied large tool-output bundle, copied Round 1 iteration bundle, copied long prompt-pack context bundle, plus negative fixtures for description.json, graph-metadata.json, deep-research-state.jsonl, deltas, MCP JSON-RPC envelope, hook startup JSON, code-graph readiness payload, diff/patch, Bash output, and citation-heavy summary.

Pass threshold: 100% rejection of excluded fixtures, 100% citation equality for cited accepted fixtures, positive token delta on at least one large copied bundle, and zero mutation of authoritative artifacts.

## 8. Residual Caveat

Residual caveat: the live Headroom compression call was not executed in this fan-out environment because importing the vendored package failed with ModuleNotFoundError: opentelemetry, and installing dependencies would violate the research-only/no-install constraint. All source-level claims above are confirmed with citations; the live benchmark remains an implementation validation gate.

## Final Statement

The perfect-fit integration is a guarded offline compress() pass over copied prompt-pack/tool-output bundles, plus optional CacheAligner detector telemetry. It works perfectly with the stack because every authoritative control plane is excluded before compression, Headroom provides raw passthrough on inflation/error, the shim adds raw hash and citation/fidelity gates, and the first integration point is a sibling artifact rather than a mutation of system prompts, hooks, MCP envelopes, metadata, state, code-graph payloads, or source citations.
