# Headroom Utilization — Research Synthesis

**20 iterations, two GPT-5.5 (`xhigh`, `fast`) cli-codex lineages:**
- `gpt55xhigh` — iterations 1–8 (survey + integration-fit matrix), converged.
- `gpt55xhigh-perfectfit` — iterations 9–20 (deep validation: prove one perfect-fit integration), converged at the 0.05 threshold.

Full per-lineage detail: `lineages/gpt55xhigh/research.md` and `lineages/gpt55xhigh-perfectfit/research.md` (+ `lineages/gpt55xhigh-perfectfit/worked-example/`). 123 file:line citations across both rounds.

<!-- ANCHOR:executive-verdict -->
## 0. Executive Verdict

**There is a Headroom integration that works perfectly with this stack:** a **guarded, offline `compress()` pass over copied, non-authoritative bundles** (deep-loop prompt-pack context / large tool outputs), emitted as a **sibling compact artifact** — never a mutation of any authoritative control plane. It is "perfect" because every control plane (MCP envelopes, hook briefs, code-graph payloads, generated metadata, JSONL state, source citations, live prompts) is **excluded before** the call, Headroom **returns the original on inflation or error**, and a thin shim adds raw-hash + citation-survival gates. Optional companion: **CacheAligner as a detector-only** diagnostic (it never mutates messages). [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:262-278] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/cache_aligner.py:214-222]

**Do not adopt into core:** the OpenAI/Anthropic proxy, `headroom wrap`, the output-shaper, `headroom learn`, and Headroom's cross-agent memory — they mutate provider traffic, system prompts, structured metadata, or memory/instruction files that our gates treat as executable. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/proxy/output_shaper.py:253] [SOURCE: .opencode/skills/system-spec-kit/constitutional/memory-system-spec-kit-only.md:24]

**Residual caveat (honest):** the *live* Headroom call could not be executed in the research sandbox (`ModuleNotFoundError: opentelemetry`, and installing deps would break the research-only rule). All source-level claims are confirmed with citations; a live benchmark remains the one open implementation-validation gate.
<!-- /ANCHOR:executive-verdict -->

---

# PART A — The Perfect-Fit Integration (iterations 9–20)

## A1. Exact surface + config

Call Headroom `compress()` as an **offline library** on a copied bundle represented as a synthetic tool/document message — never a system/developer prompt, MCP envelope, hook JSON, code-graph payload, or state file.

```python
CompressConfig(
    compress_user_messages=False,     # true only for explicit document/RAG/tool-output bundles
    compress_system_messages=False,   # system/developer/hook context is control-plane — never compress
    protect_recent=0,                 # 0 only for a standalone copied bundle; keep default 4 for conversation arrays
    protect_analysis_context=True,
    target_ratio=0.5,                 # soft conservative target
    min_tokens_to_compress=250,       # keep small artifacts out of the path
    kompress_model="disabled",        # skip ML model → no network/model dependency in the first integration
)
```

Each knob is cited to `external/headroom/compress.py:100-135`. The library **reverts if compression inflates token count and returns originals on exception** — the safety property the whole integration leans on. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:262-278] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:336-349]

## A2. Exclusion set + programmatic guard

**Never touch:** generated `description.json` / `graph-metadata.json`, continuity frontmatter, canonical spec docs, MCP request/response envelopes, hook JSON / startup context / skill-advisor briefs, code-graph readiness/diffs/identifiers, deep-loop state/deltas/graphEvents/validator output, source citations, patches, diffs, Bash outputs, or any byte-exact artifact. Justified against our own hardening contracts. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:139-142] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1435-1461] [SOURCE: .opencode/skills/system-code-graph/references/runtime/tool_surface.md:42-66] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:756-779]

```js
const DENY_PATH = [
  /(^|\/)(description|graph-metadata)\.json$/,
  /(^|\/)deep-research-state\.jsonl$/,
  /(^|\/)deltas\/iter-\d+\.jsonl$/,
  /(^|\/)(handover|implementation-summary|spec|plan|tasks|checklist)\.md$/,
  /(^|\/)(AGENTS|CLAUDE|CODEX|instructions)\.md$/,
  /\.(diff|patch)$/,
];
const DENY_KEYS = new Set([
  'jsonrpc','method','params','result','error','meta','data','hints',
  'readiness','canonicalReadiness','trustState','requiredAction',
  'affectedSymbols','symbolId','manifestDigest','source_fingerprint',
  '_memory','graphEvents','sessionId','generation',
]);
```

The guard canonicalizes the path, requires an allowlisted artifact kind, rejects denied paths, parses JSON/YAML frontmatter and recursively rejects denied keys, computes raw sha256, extracts `[SOURCE: ...]` citations before/after, calls Headroom **only after** those gates pass, rejects inflation or citation loss, and **falls back to raw on any exception**.

## A3. Wiring point

One high-value, low-risk insertion: **after** deep-loop renders `prompts/iteration-NNN.md`, **before** cli-codex consumes the prompt file, write a **sibling compact artifact + sidecar** — never mutating the rendered prompt, source docs, JSONL state, deltas, graph metadata, or external source. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:595-614] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/prompt-pack.ts:55-72]

## A4. Worked example (deterministic estimate)

Real on-disk inputs: round-1 `iteration-003.md` + `iteration-007.md` → compact bundle. The sidecar records sha256 of raw + compact for audit/re-run (`lineages/gpt55xhigh-perfectfit/worked-example/headroom-sidecar.json`):

| Metric | Value |
|---|---|
| chars before → after | 7,870 → 4,148 |
| est. tokens before → after (`ceil(chars/4)`) | 1,968 → 1,037 |
| est. tokens saved | **931 (47.3%)** |
| citation set preserved | **true** |

> The estimator is a deterministic local `ceil(chars/4)` for research comparison only — **not** a live Headroom output (the live call was dep-blocked, see caveat). It demonstrates the shape and the citation-survival gate, not a production token number.

## A5. Reversibility / fidelity

Two layers: the shim keeps the **raw bundle sha256** for deterministic restore/re-run, and Headroom **CCR** can store originals by hash and retrieve full content locally. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/ccr/mcp_server.py:359-413] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/cache/compression_store.py:261-388] Fidelity gates: raw sha256 exists pre-compression; re-run deterministic for same input/config; citation set equal before/after; answer-probes pass; any failed check → raw input.

## A6. Telemetry / privacy / licensing (clean-room)

```bash
HEADROOM_TELEMETRY=off
HEADROOM_UPDATE_CHECK=off
HF_HUB_OFFLINE=1
TRANSFORMERS_OFFLINE=1
HEADROOM_DETECT_BACKEND=python
```

Telemetry only enables on explicit on-values; update checks disable with `HEADROOM_UPDATE_CHECK=off`; offline HF mode is supported. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/telemetry/beacon.py:72-80] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:333-335] Licensing is Apache-2.0 with NOTICE obligations on redistribution. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/LICENSE:89-121]

## A7. "Works perfectly" acceptance criteria + validation plan

All must pass: (1) guard accepts only copied-bundle artifacts, rejects every excluded path/key class; (2) `compress_system_messages=False` enforced, system/developer/hook candidates rejected pre-call; (3) `kompress_model="disabled"` + telemetry/update off + offline env active; (4) Headroom returns raw on exception/inflation and the shim independently rejects non-positive savings; (5) worked example shows positive savings + citation equality; (6) raw sha256 sidecar traces compact → raw; (7) prepared-env **live** benchmark on the same bundle records before/after tokens + answer-probe/citation survival; (8) zero writes outside the lineage / designated sibling dir.

**Benchmark fixtures** include **negative** fixtures (`description.json`, `graph-metadata.json`, `deep-research-state.jsonl`, deltas, an MCP JSON-RPC envelope, hook startup JSON, a code-graph readiness payload, a diff/patch, Bash output, a citation-heavy summary). **Pass threshold:** 100% rejection of excluded fixtures, 100% citation equality for accepted cited fixtures, positive token delta on ≥1 large copied bundle, zero mutation of authoritative artifacts.

---

# PART B — Survey & Integration-Fit Matrix (iterations 1–8)

Legend: `fits` = usable directly · `needs-shim` = only behind explicit guardrails · `conflicts` = conflicts as-is · `irrelevant` = no role.

| Headroom Surface | spec-kit Memory MCP | skill-advisor | code-graph | deep-loop | cli-* | hooks | runtimes |
|---|---|---|---|---|---|---|---|
| `compress()` library | needs-shim | needs-shim | needs-shim | needs-shim | needs-shim | conflicts | needs-shim |
| OpenAI/Anthropic proxy | conflicts | conflicts | conflicts | needs-shim | needs-shim | conflicts | fits |
| MCP server | needs-shim | irrelevant | needs-shim | needs-shim | fits | irrelevant | fits |
| `headroom wrap` | conflicts | conflicts | conflicts | needs-shim | needs-shim | conflicts | fits |
| `headroom learn` | conflicts | conflicts | irrelevant | conflicts | conflicts | conflicts | needs-shim |
| Bundled RTK / lean-ctx | needs-shim | irrelevant | needs-shim | fits | fits | irrelevant | fits |
| **CacheAligner** | **fits** | **fits** | **fits** | **fits** | **fits** | **fits** | **fits** |
| Output-shaper | conflicts | conflicts | conflicts | conflicts | conflicts | conflicts | needs-shim |
| Cross-agent memory | conflicts | conflicts | irrelevant | conflicts | conflicts | conflicts | needs-shim |

**Top risks (round 1):** prompt-cache busting; generated-metadata determinism (exclude `description.json`/`graph-metadata.json`); structured-metadata fidelity; code-graph false confidence (never compress readiness/diffs/identifiers); advisor misrouting; duplicate memory system; constitutional system-prompt mutation; telemetry doc-vs-code discrepancy (`llms.txt` says on-by-default, code says opt-in — a confirmed inconsistency). Full register + per-subsystem notes: `lineages/gpt55xhigh/research.md`.

**Round-1 ranked recommendation:** (1) pilot `compress()` library offline; (2) CacheAligner detector-only; (3) Headroom MCP as an explicit helper; (4) RTK separately; (5) do not adopt proxy/wrap/output-shaper/learn/memory into core. Round 2 turned recommendation #1 into the proven perfect-fit spec in Part A.

---

## Convergence Report

| Round | Lineage | Iterations | newInfoRatio | Stop |
|---|---|---|---|---|
| 1 (survey) | `gpt55xhigh` | 1–8 | 1.0 → 0.18 | converged |
| 2 (validation) | `gpt55xhigh-perfectfit` | 9–20 | 0.72 → 0.05 | converged (0.05 threshold) |

**Total: 20 iterations. All 8 charter questions answered + a proven perfect-fit integration specified. One open gate: a live (non-estimated) Headroom benchmark, which belongs to a `002` implementation phase.**
