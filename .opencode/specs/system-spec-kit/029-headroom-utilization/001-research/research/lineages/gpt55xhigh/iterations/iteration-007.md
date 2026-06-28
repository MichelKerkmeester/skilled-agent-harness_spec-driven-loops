# Iteration 007: Risk Register and Guardrails

## Focus

Build the risk register required by the charter.

## Evidence

- CacheAligner is detector-only, never mutates messages, and returns a byte-equivalent deep copy with warning metadata. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/cache_aligner.py:1] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/cache_aligner.py:266]
- Output-shaper appends a steering block to the tail of the system prompt and lowers effort on mechanical continuations when enabled. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/proxy/output_shaper.py:253] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/proxy/output_shaper.py:289]
- TagProtector discards a tag restoration if the placeholder is lost rather than reinjecting malformed XML; downstream validation must catch regressions. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/tag_protector.py:97]
- SmartCrusher's strict lossless mode avoids CCR markers and keeps output byte-recoverable. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/smart_crusher.py:190]
- Headroom README says update checks hit PyPI at most once per day unless `HEADROOM_UPDATE_CHECK=off`. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:333]
- `llms.txt` says telemetry is enabled by default, but the proxy code says telemetry is opt-in/off by default and only enabled via `HEADROOM_TELEMETRY=on` or `--telemetry`. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/llms.txt:67] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/telemetry/beacon.py:1] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/cli/proxy.py:750]
- `headroom learn --apply` writes recommendations to context/memory files. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/cli/learn.py:75]
- The Codex writer writes learned patterns to `AGENTS.md` and `instructions.md`. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/learn/writer.py:347]
- The memory constitutional rule says only Spec Kit Memory should be used for memories unless the user explicitly requests native memory. [SOURCE: .opencode/skills/system-spec-kit/constitutional/memory-system-spec-kit-only.md:24]
- The license is Apache 2.0. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:443]

## Risk Register

1. Prompt-cache busting: CacheAligner is safe as detector-only; output-shaper and CCR system-instruction injection are not.
2. Determinism: generated `description.json` and `graph-metadata.json` must remain exact and validator-controlled.
3. Structured metadata fidelity: strict JSON schemas and graph readiness payloads cannot be lossy-compressed.
4. Telemetry/privacy: code says opt-in, docs disagree; require explicit opt-out and disabled update checks in experiments.
5. Licensing: Apache 2.0 is compatible for use, but vendored attribution and NOTICE handling still need owner review before productization.
6. Constitutional gates: `headroom learn` and cross-agent memory conflict with Spec Kit Memory-only policy.
7. Runtime interception: OpenCode plugin and proxy transport mutate process-wide provider routing.

New information ratio: 0.40.

## Dead Ends / Ruled Out

- Treating telemetry as definitively enabled by default is unsupported by code; the risk is doc drift plus external beacon capability.
- Treating output-shaper as harmless "verbosity preference" is wrong; it changes system prompt and effort.
