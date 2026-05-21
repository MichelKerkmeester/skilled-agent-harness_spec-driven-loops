# Deep Review Iteration 002

## Dispatcher

- Target: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc`
- Review packet root: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/review/`
- Iteration: 002
- Dimension: D2 Security
- Focus area: `trust_remote_code=True` posture, localhost binding, detached subprocess/env allowlist behavior, benchmark/log sanitization, and runtime config env exposure
- Budget profile: scan
- Status: complete

## Files Reviewed

- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py`
- `.opencode/skills/system-rerank-sidecar/scripts/start.sh`
- `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py`
- `.opencode/skills/system-rerank-sidecar/.env.example`
- `.opencode/bin/lib/ensure-rerank-sidecar.cjs`
- `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts`
- `.opencode/bin/mk-spec-memory-launcher.cjs`
- `.opencode/bin/mk-skill-advisor-launcher.cjs`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py`
- `.mcp.json`
- `opencode.json`
- `.gemini/settings.json`
- `.codex/config.toml`
- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/rerank-ab-fixture.json`
- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/per-probe-arm-a.jsonl`
- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/per-probe-arm-b.jsonl`
- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/per-probe.jsonl`
- `.opencode/skills/sk-code-review/references/review_core.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Auto-spawned sidecar receives the full parent environment despite running trusted model code** -- `.opencode/bin/lib/ensure-rerank-sidecar.cjs:97` -- The JavaScript ensure helper spawns `scripts/start.sh` with `env: { ...processObj.env, RERANK_SIDECAR_PORT: String(port) }`, so every launcher environment variable reaches the detached sidecar. The Python ensure helper mirrors the same pattern with `env = {**os.environ, "RERANK_SIDECAR_PORT": str(resolved_port)}` before `subprocess.Popen(...)`. That matters because the sidecar loads Qwen with `trust_remote_code=True`; the current pin and `local_files_only=True` prevent silent remote refresh, but they do not reduce what the local model code can read from `os.environ`. `mk-spec-memory-launcher.cjs` also explicitly loads repo-root `.env.local` and `.env` into `process.env` before the ensure call, so API keys or tokens placed there for embeddings can be unnecessarily exposed to the sidecar process. [SOURCE: `.opencode/bin/lib/ensure-rerank-sidecar.cjs:97`] [SOURCE: `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:95`] [SOURCE: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:47`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:17`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:48`]

   Finding class: cross-consumer
   Scope proof: Both sidecar auto-start consumers were checked: `mk-spec-memory-launcher.cjs` calls the JavaScript helper before launching the memory server, and CocoIndex `cli.py` imports the Python helper from the sidecar skill path. The unrelated `mk-skill-advisor-launcher.cjs` uses a constrained `CHILD_ENV_ALLOWLIST`, showing the codebase already has an env-minimization pattern for MCP children. [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:449`] [SOURCE: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:139`] [SOURCE: `.opencode/bin/mk-skill-advisor-launcher.cjs:67`] [SOURCE: `.opencode/bin/mk-skill-advisor-launcher.cjs:131`]
   Affected surface hints: ["system-rerank-sidecar auto-spawn", "mk-spec-memory launcher", "CocoIndex MCP launcher", "CrossEncoder trust boundary", "launcher env hygiene"]
   Recommendation: Replace whole-environment inheritance with a sidecar-specific allowlist in both helpers. Include only process basics and required rerank/model/cache knobs, for example `PATH`, `HOME`, `TMPDIR`, locale variables, `RERANK_SIDECAR_PORT`, `RERANK_MODEL_NAME`, `RERANK_MODEL_REVISION`, `RERANK_DEVICE`, `RERANK_LOG_PATH`, and explicitly needed Hugging Face cache/offline variables; exclude generic `*_API_KEY`, `*_TOKEN`, `SECRET`, and cloud-provider credentials by default.

   Claim adjudication:
   ```json
   {"type":"gate-relevant-p1","claim":"The auto-spawned rerank sidecar receives more environment data than it needs while executing model code loaded with trust_remote_code=True.","evidenceRefs":[".opencode/bin/lib/ensure-rerank-sidecar.cjs:97",".opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:95",".opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:47",".opencode/bin/mk-spec-memory-launcher.cjs:17",".opencode/bin/mk-spec-memory-launcher.cjs:48"],"counterevidenceSought":"Confirmed the model loader pins a revision and sets local_files_only=True, confirmed start.sh binds uvicorn to 127.0.0.1, checked mk-skill-advisor's child allowlist pattern, checked runtime configs for committed secret values, and scanned benchmark JSONL/fixture files for common credential, JWT, email, .env.local, and non-localhost IP patterns.","alternativeExplanation":"Full env inheritance may have been chosen to avoid missing cache, device, or offline Hugging Face settings during detached startup.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 only if the project explicitly documents the sidecar as sharing the exact same secret trust boundary as its launcher and constrains all model-code inputs to a locally audited cache."}
   ```

### P2 Findings

None.

## Traceability Checks

- The model execution surface is partially hardened: `trust_remote_code=True` is paired with a pinned default `MODEL_REVISION` and `local_files_only=True`, so cache misses fail instead of fetching new remote code. [SOURCE: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:22`] [SOURCE: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:47`] [SOURCE: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:49`]
- The HTTP bind is localhost-only: `start.sh` execs uvicorn with `--host 127.0.0.1`, and no `0.0.0.0` bind was found in the sidecar or launcher surfaces reviewed. [SOURCE: `.opencode/skills/system-rerank-sidecar/scripts/start.sh:25`]
- `mk-skill-advisor-launcher.cjs` adds `RERANK_SIDECAR_PORT` to its existing allowlist and does not allow generic API-key/token names into its child process. [SOURCE: `.opencode/bin/mk-skill-advisor-launcher.cjs:67`] [SOURCE: `.opencode/bin/mk-skill-advisor-launcher.cjs:93`] [SOURCE: `.opencode/bin/mk-skill-advisor-launcher.cjs:131`]
- The runtime config additions are limited to `RERANK_SIDECAR_PORT` plus explanatory `_NOTE_*` strings. The grep hits for `API_KEY`/`.env.local` in `.mcp.json`, `opencode.json`, `.gemini/settings.json`, and `.codex/config.toml` were explanatory text, not committed credential values.
- Benchmark leak scan found no matches for common OpenAI/Voyage/Cohere key prefixes, JWT-looking tokens, email addresses, `.env.local` paths, generic secret/token/password labels, or non-localhost IP addresses in the two arm JSONL files, combined per-probe JSONL, or fixture snapshot.

## Integration Evidence

- `mk-spec-memory-launcher.cjs` invokes `ensureRerankSidecar({ port: Number(process.env.RERANK_SIDECAR_PORT || 8765) })` after winning the launcher lease and before launching the memory server. [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:449`]
- CocoIndex's MCP entrypoint imports `scripts.ensure_rerank_sidecar` from `.opencode/skills/system-rerank-sidecar` and passes the configured port and sidecar skill path. [SOURCE: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:139`] [SOURCE: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:152`]
- Detached subprocess stdio is not inherited broadly: the JavaScript helper uses `stdio: ['ignore', logFd, logFd]`, and the Python helper uses `stdin=subprocess.DEVNULL` plus a sidecar log file for stdout/stderr. The remaining privilege issue is env scope, not inherited stdin/stdout file handles. [SOURCE: `.opencode/bin/lib/ensure-rerank-sidecar.cjs:94`] [SOURCE: `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:96`]
- Sidecar log file paths are helper-owned under `~/.cache/mk-reranker` with `/tmp/mk-reranker` fallback; no user-supplied PID/log path is interpolated into those helper log paths. [SOURCE: `.opencode/bin/lib/ensure-rerank-sidecar.cjs:48`] [SOURCE: `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:54`]
- Request logging is opt-in through `RERANK_LOG_PATH`; the committed `.env.example` leaves it unset by default. [SOURCE: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:28`] [SOURCE: `.opencode/skills/system-rerank-sidecar/.env.example:5`]

## Edge Cases

- The P1 is about minimizing the sidecar process trust boundary. It is not evidence that a committed credential is currently leaked, and the benchmark/config scans did not find committed secret material.
- `trust_remote_code=True` remains a deliberate compatibility choice for Qwen. The revision pin and `local_files_only=True` materially reduce network-update risk, but they do not make broad env inheritance harmless.
- The optional `RERANK_LOG_PATH` request log records raw query text when enabled. This iteration did not escalate that to an active finding because logging is disabled by default and the committed benchmark query set appears synthetic/internal rather than credential-bearing.

## Confirmed-Clean Surfaces

- No missing `revision=` pin was found next to sidecar `trust_remote_code=True`.
- No missing `local_files_only=True` was found in the sidecar `CrossEncoder` loader.
- No LAN-exposed `0.0.0.0` uvicorn bind was found in `start.sh`.
- No committed credential-like values were found in the benchmark per-probe JSONL files or fixture snapshot.
- No committed runtime config value sets `SPECKIT_CROSS_ENCODER=true`; the phase 005 HOLD posture remains opt-in rather than default-on.

## Ruled Out

- Ruled out: silent model-code network refresh from the sidecar loader. Evidence: pinned `MODEL_REVISION` and `local_files_only=True`.
- Ruled out: sidecar listening on all interfaces. Evidence: `start.sh` binds uvicorn to `127.0.0.1`.
- Ruled out: benchmark JSONL credential leak under the requested key/JWT/email/IP patterns. Evidence: focused grep scan over all per-probe and fixture files returned no matches.
- Ruled out: `mk-skill-advisor-launcher.cjs` broadening its child env for this phase. Evidence: it still filters through `CHILD_ENV_ALLOWLIST`, with `RERANK_SIDECAR_PORT` as a narrow addition.

## Next Focus

- dimension: D3 Traceability
- focus area: spec/code alignment for phases 001-005, REQ/task evidence, implementation-summary accuracy, arc-parent phase-map rows, and benchmark HOLD verdict coherence
- reason: D2 found one required env-boundary fix but confirmed the model pin/local-cache posture, localhost binding, config additions, and committed benchmark artifacts are otherwise clean.
- rotation status: D2 complete; rotate to D3 for iteration 003.
- blocked/productive carry-forward: Productive D2 method was line-window review of the sidecar, launchers, runtime configs, and targeted leak scans. Carry P1-001 into synthesis/remediation; no D2 blocker prevents the D3 traceability pass.
- required evidence: phase specs/tasks/implementation summaries, arc parent control files, benchmark report section 8, source/config diffs for HOLD invariant, and checklist evidence rows.

Review verdict: CONDITIONAL
