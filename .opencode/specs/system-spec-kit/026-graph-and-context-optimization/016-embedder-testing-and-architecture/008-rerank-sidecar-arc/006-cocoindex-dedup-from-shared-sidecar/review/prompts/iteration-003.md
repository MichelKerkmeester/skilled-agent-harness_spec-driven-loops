DEEP-REVIEW

# Deep-Review Iteration 3 — Security Pass

## STATE

STATE SUMMARY (auto-generated):
Iteration: 3 of 20
Dimension: security
Prior Findings: P0=0 P1=2 P2=1 (P1-001 PROMOTE default doesn't reach runtime, P1-002 cocoindex MCP doesn't auto-spawn sidecar, P2-001 REQ-006 wording vs D-004)
Dimension Coverage: [inventory, correctness] (1/4)
Traceability: core=mapped overlay=mapped (gates ran in iter-002: 6 required / 6 executed / 3 pass / 1 partial / 2 fail / 2 gatingFailures)
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 1
Last 2 ratios: 0.0 -> compute_from_iter2
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 3 of 20
Mode: review
Dimension: security
Review Target: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar
Prior Findings: P0=0 P1=2 P2=1

## PRIOR CONTEXT

Read these first:

- Iteration 2 narrative: .opencode/specs/.../006-cocoindex-dedup-from-shared-sidecar/review/iterations/iteration-002.md — has P1-001 PROMOTE-default dispatch gap, P1-002 cocoindex MCP auto-ensure gap, P2-001 spec REQ-006 wording drift; full claim adjudication packets.
- Strategy: .opencode/specs/.../006-cocoindex-dedup-from-shared-sidecar/review/deep-review-strategy.md — §6 COMPLETED DIMENSIONS, §7 RUNNING FINDINGS, §12 NEXT FOCUS.
- Findings registry: .opencode/specs/.../006-cocoindex-dedup-from-shared-sidecar/review/deep-review-findings-registry.json.

## SCOPE REMINDER

Two commits shipped:
1. `c0941055f` feat(016/008/006): cocoindex dedup via shared sidecar — PROMOTE
2. `131838c96` docs(system-rerank-sidecar): feature catalog + manual testing playbook

Files under review: see config.reviewScopeFiles or strategy §15.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS + GATES

Dimensions: correctness, security, traceability, maintainability.
Quality gates: evidence (file:line), scope (within review_scope_files), coverage (all dimensions touched before STOP).
Verdicts: FAIL (any P0) | CONDITIONAL (any P1, no P0) | PASS (no P0/P1; hasAdvisories=true if active P2 exist).

## CLAIM ADJUDICATION (mandatory for new P0/P1)

Every NEW P0/P1 finding must include in the iteration narrative:
- claim: 1-sentence assertion
- evidenceRefs: list of "path:line" or shell command outputs
- counterevidenceSought: what would disprove the finding
- alternativeExplanation: what the finding could be instead
- finalSeverity: P0/P1/P2 after self-adjudication
- confidence: low | medium | high
- downgradeTrigger: what would justify a future downgrade

## ASSIGNED FOCUS — SECURITY PASS

Audit the security posture of the shipped changes. Open the actual files and quote file:line evidence.

1. **HTTP localhost trust boundary** — `reranker.py:221-351` HttpSidecarRerankerAdapter. The adapter makes outbound HTTP requests to `127.0.0.1:8765/rerank`. Verify:
   - Is the URL hardcoded or env-controllable? Can an attacker on the machine spoof the sidecar?
   - What's the sidecar bound interface? (Check `system-rerank-sidecar/scripts/rerank_sidecar.py` and `scripts/start.sh`.) Does it bind to 127.0.0.1 only, or 0.0.0.0?
   - Authentication: is there any token, mTLS, signature on the /rerank request?
   - On a multi-user Mac/Linux box, can a non-privileged user pose as the sidecar by binding 8765 first?

2. **Payload validation** — the sidecar accepts `query`, `candidates`, `top_k`, etc. Trace `system-rerank-sidecar/scripts/rerank_sidecar.py` for:
   - Pydantic/schema validation strictness — extra fields rejected? Type coercion safe?
   - Size limits on `candidates` array and individual chunk text — is there an upper bound that prevents OOM via large payload?
   - `top_k` bounds — can a caller pass `top_k=10**9`?

3. **Error / log info leakage** — `reranker.py:259-319` HTTP error paths record diagnostics. Check `RetrievalDiagnostics.reranker_fallback_reason`:
   - Does it include sidecar URL or other deployment-identifying info?
   - Does it include user query text, candidate paths, or any content that could leak into logs?

4. **Env-var precedence + defaults safety** — `config.py:746-769`:
   - `COCOINDEX_RERANK_VIA_SIDECAR` default `True` flip — does it affect non-cocoindex contexts (e.g. tests, CLI sub-commands)?
   - Is there any other env var that overrides the dispatch without operator awareness?
   - Does the sidecar URL come from env? If yes, can an attacker who controls the env redirect rerank traffic to a malicious server?

5. **Sidecar process lifecycle / privilege** — `cli.py:139-158` `_ensure_rerank_sidecar_for_mcp` spawns the sidecar. Verify:
   - Does it inherit the parent's full env including OPENAI_API_KEY / VOYAGE_API_KEY?
   - Is there a pidfile race condition that lets another user steal sidecar identity?
   - What's the file mode of the lease/cache files? World-readable? Per memory `feedback_solo_mac_user_posture.md`, mode 644 is INFO on solo Mac — but flag it as INFO if found, not HIGH.

6. **httpx lazy-import** — does the lazy `import httpx` inside the adapter hide a transitive dep that could be replaced via PYTHONPATH manipulation? (This is a low-severity supply chain question.)

7. **Test fixture safety** — `test_http_sidecar_adapter.py:48-83`:
   - Mock transport: does it disable real network correctly? Could a test accidentally hit the real sidecar / external host?
   - Fallback recorder: does it leak state across tests?

8. **Benchmark fixture safety** — `benchmark-2026-05-20-cocoindex-via-sidecar/run_ab.py`:
   - Does it run against a real sidecar with real model? Where does it pull the fixture from? Any path-traversal risk in the `--fixture` arg?

9. **Feature catalog + playbook claims** — do the security sections (`feature_catalog.md:170-186`) and any playbook scenarios match reality? Are there security caveats missing from the docs?

For findings:
- LOW-severity security info (e.g. file mode 644 on solo Mac per memory rule) → INFO/P2
- Real cross-user attack vectors → P1
- Auth bypass / data exfiltration / RCE → P0

Apply the 7-field claim adjudication packet to any new P1/P0.

## OUTPUT CONTRACT

Produce THREE artifacts:

1. Iteration narrative at `.opencode/specs/.../006-cocoindex-dedup-from-shared-sidecar/review/iterations/iteration-003.md` with headings: Dimension Focus, Files Reviewed, Findings by Severity (P0/P1/P2 with claim-adjudication packets), Traceability Checks, Verdict, Next Dimension. Final line MUST be exactly one of: `Review verdict: PASS` | `Review verdict: CONDITIONAL` | `Review verdict: FAIL` | `Review verdict: PENDING`.

2. Append to `.opencode/specs/.../006-cocoindex-dedup-from-shared-sidecar/review/deep-review-state.jsonl` exactly one canonical record with `"type":"iteration"`.

3. Per-iteration delta file at `.opencode/specs/.../006-cocoindex-dedup-from-shared-sidecar/review/deltas/iter-003.jsonl` with at least one `"type":"iteration"` record plus one `"type":"finding"` per new finding (one per line).

After the iteration completes:
- Update `<review-packet>/deep-review-strategy.md`: mark security in §6 COMPLETED DIMENSIONS if confident; refresh §7 RUNNING FINDINGS; §12 NEXT FOCUS = traceability; §14/15 status.
- Update `<review-packet>/deep-review-findings-registry.json`: refresh `dimensionCoverage.security`, `findingsBySeverity`, `openFindingsCount`.

## CONSTRAINTS

- LEAF agent, no sub-agent dispatch. Target 12 tool calls, soft max 18, hard max 24.
- Write ALL findings to files. Read-only against reviewed source/tests/docs/specs.
- BANNED: rm, mv, sed -i, git, any modification to reviewed paths.
- ALLOWED write targets: only paths inside the review packet directory `<review-packet>/`.
- newFindingsRatio: severity-weighted P0=10, P1=5, P2=1. If any new P0 → ratio = max(calc, 0.50). If 0 findings → 0.0.
