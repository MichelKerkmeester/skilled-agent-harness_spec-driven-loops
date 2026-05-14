# Iteration 2: Security

## Focus
D2 Security — Command injection surface, `Function()` constructor (F003 carry-over), env propagation, stderr log sensitivity, sandboxing compliance, `COCOINDEX_CODE_ROOT_PATH` path traversal.

## Scorecard
- Dimensions covered: security
- Files reviewed: 1 (`run-mcp-direct.mjs`)
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=1 (F003 severity confirmed from correctness review)
- New findings ratio: 0.05

## Findings

### P2 — Suggestion

- **F003** (re-confirmed, security dimension): `parseObjectLiteral` uses `Function()` constructor — `run-mcp-direct.mjs:138`
  - **Evidence**: Line 138: `Function('"use strict"; return (' + trimmed + ');')()` evaluates arbitrary JavaScript code from playbook argument blocks. While playbook files are trusted repository content (not external user input), this violates the principle of least privilege and Defense in Depth. A malicious or compromised playbook `.md` file could execute arbitrary code in the runner process, which has access to the local filesystem and environment variables via `process.env`.
  - **Category**: security
  - **Recommendation**: Replace with a safe tokenizer that only handles JSON-like literals (strings, numbers, booleans, null, nested objects, arrays). Reject any function calls, expressions, or computed property names. Alternative: require playbook argument blocks to use valid JSON (already the primary path at line 135-136; `Function()` is only the fallback). **Severity maintained at P2** because the attack surface is limited to repo-internal, trusted playbook files.
  - **Claim adjudication**:
    ```json
    {
      "findingId": "F003",
      "claim": "`Function()` constructor at line 138 executes arbitrary JavaScript from playbook argument blocks, creating a code-execution surface.",
      "evidenceRefs": [
        "_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs:132-143"
      ],
      "counterevidenceSought": "Checked whether playbook files are ever sourced from external input — they are read from a fixed repo directory (PLAYBOOK_DIR, line 13-16). Checked whether user input reaches parseObjectLiteral — it only processes playbook markdown content. Searched for any path where untrusted content reaches this function — none found.",
      "alternativeExplanation": "The Function() fallback exists because some playbook argument blocks use unquoted object keys (which are valid JS but not valid JSON). The test at vitest:9-23 explicitly covers this case ('num_results: 10' with unquoted key). A hand-rolled tokenizer could handle this without eval.",
      "finalSeverity": "P2",
      "confidence": 0.88,
      "downgradeTrigger": "Not downgradeable — code execution from repo content is a permanent risk that a simple tokenizer eliminates.",
      "transitions": [
        { "iteration": 1, "from": null, "to": "P2", "reason": "Initial discovery (correctness)" },
        { "iteration": 2, "from": "P2", "to": "P2", "reason": "Confirmed security dimension" }
      ]
    }
    ```

- **F006**: Unconditional `process.env` propagation to subprocess daemons — `run-mcp-direct.mjs:524-526,534-537`
  - **Evidence**: Lines 524-526: `env: { ...process.env, SPECKIT_RETRY_ENABLED: 'false' }` and lines 534-537: `env: { ...process.env, COCOINDEX_CODE_ROOT_PATH: REPO_ROOT, ... }`. The entire parent process environment (including any API keys, tokens, or secrets) is passed to both daemon subprocesses. While these are project-internal daemons, there is no need for them to inherit secrets like `GITHUB_TOKEN`, `OPENAI_API_KEY`, or other credentials that may be present in the operator's shell environment.
  - **Category**: security
  - **Recommendation**: Pass only the environment variables the daemons need (e.g., `PATH`, `HOME`, `SPECKIT_RETRY_ENABLED`, `COCOINDEX_CODE_ROOT_PATH`, `COCOINDEX_CODE_MCP_REQUEST_TIMEOUT_MS`) instead of spreading `process.env`. This follows the principle of least privilege and prevents accidental credential leakage if a daemon logs its environment or dumps it on error.

- **F007**: Stderr capped logs may capture sensitive daemon output — `run-mcp-direct.mjs:21-25,240-261`
  - **Evidence**: Lines 240-261 create capped stderr logs for both daemons. The logs are written to `_sandbox/.../evidence/` (a tracked directory). If either daemon logs sensitive information (file paths with secrets, query content with PII, error stacks with environment details), it would be persisted to disk in a location that could be committed. The 200000-byte cap limits exposure but does not filter sensitive content.
  - **Category**: security
  - **Recommendation**: Add a brief note in the runner docs stating that daemon stderr logs are capped to 200KB and may contain file paths and query strings. Consider adding a `--no-stderr-log` flag for operators who don't need daemon diagnostics. Since the daemons are internal project tools that don't process secrets, this is P2.

### Confirmed Safe

The following were investigated and found to have no security issues:

| Surface | Finding | Evidence |
|---------|---------|----------|
| Subprocess command injection | SAFE | Commands and args are hardcoded constants: `process.execPath` (line 521), `path.join(REPO_ROOT, '...')` (line 533), `['mcp']` (line 543). No user input flows to command or args. |
| Shell injection | SAFE | `execFileAsync` (from `node:child_process` `execFile`) is used exclusively (line 4, 29, 301). Unlike `exec`, `execFile` does not spawn a shell — it executes the binary directly. |
| `COCOINDEX_CODE_ROOT_PATH` path traversal | SAFE | `REPO_ROOT` is derived from `path.resolve(SCRIPT_DIR, '../../..')` (line 11) — always the repository root. No user input in path construction. |
| User input handling | SAFE | `parseArgs` only parses `--scenarios` with digit/range validation (line 36-51). `findScenarioFile` uses numeric scenario IDs (line 67-72). `section()` regex escapes special chars (line 75). |
| `callTool` timeout | SAFE | Uses `Promise.race` with `.unref()` timeout (line 189-197). The `.unref()` prevents the timeout from keeping the event loop alive after the scenario completes. |
| Sandbox compliance | SAFE | Runner lives in `_sandbox/24--.../evidence/`. All writes (TSV, stderr logs, workload JSON) stay within `_sandbox/`. No writes outside sandbox except through MCP daemon RPC calls (by design). |
| `writeSummary` path traversal | SAFE | `SUMMARY_TSV` uses `path.join(SCRIPT_DIR, ...)` — fixed location within sandbox. |

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | spec.md:168-170 | NFR-S01 "runner does not write secrets or modify scenario playbooks" — confirmed. NFR-S02 "tool-call parsing is limited to repository playbook content" — confirmed (playbook content only, not user input). |
| checklist_evidence | pass | hard | checklist.md:98-101 | CHK-030 "No hardcoded secrets" — confirmed. CHK-031 "Input validation implemented" — confirmed for scenario IDs and playbook paths. |

## Assessment
- New findings ratio: 0.05 (only 2 new P2 findings from a security-specific scan)
- Dimensions addressed: security
- Novelty justification: F006 (env propagation) and F007 (stderr log sensitivity) are new, defense-in-depth findings. F003 was re-confirmed from correctness review and now carries a security dimension tag. No P0 or P1 security findings — the runner has a clean security posture for its threat model (internal evidence tooling, trusted repo content, no network exposure).
- The code follows good security practices: `execFile` over `exec`, hardcoded command paths, validated numeric input, no credentials in code, sandboxed file writes.

## Ruled Out
- **Command injection via scenario IDs**: Scenario IDs are validated as digits/ranges in `parseScenarioList` (line 36-51). They are only used in `findScenarioFile` which constructs a read path with `path.join`. No command or shell interpolation.
- **Path traversal via playbook files**: `findScenarioFile` uses `fs.readdirSync` on a fixed directory and `path.join` — no `..` traversal possible.
- **Environment variable injection**: The runner does not read env vars into command args or shell strings. Env vars are passed as a map to `StdioClientTransport`, which uses `child_process.spawn` with the `env` option (safe, no shell interpolation).

## Dead Ends
None.

## Recommended Next Focus
D3 Traceability — Validate spec docs against implementation, check continuity frontmatter accuracy, verify architecture decisions are documented, check the `cli-codex-gpt-5-5-high` actor slug naming consistency, verify smoke results in implementation-summary match the TSV evidence.
