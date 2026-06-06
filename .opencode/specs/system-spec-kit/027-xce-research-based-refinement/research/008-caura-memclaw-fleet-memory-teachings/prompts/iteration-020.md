ROLE: ADVERSARIAL verifier + negative-knowledge consolidator. Your job is to REFUTE weak teachings AND compile the final negative-knowledge ledger. Default position: "this should NOT be adopted as-is." READ-ONLY. Do NOT write/edit/create files or run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings (pre-approved; skip Gate 3).

TARGET (verify against real code): caura-memclaw at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/caura-memclaw-main . CONSUMER: Spec Kit Memory (LOCAL single-user, SQLite; 37-tool MCP surface with per-tool token budgets; FSRS decay + tiers; eval_run_ablation + dashboards + memory_health already exist).

CLAIMS TO ATTACK (from iterations 009/090/091/092). For EACH: (1) OPEN cited file:line/path, CONFIRM/REFUTE; (2) attack: bureaucracy/over-engineering for a single-user internal surface? already done in Spec Kit (token budgets / FSRS / dashboards exist)? aspirational vs actionable? (3) render UPHELD / DOWNGRADE / REFUTED.
- C1 (091): Adopt a Spec Kit Memory MCP "surface-ownership charter" + consolidate the 37 tools via op-dispatch. Cited: docs/api-surfaces.md; core-api/src/core_api/mcp_server.py. ATTACK: is op-dispatch consolidation harmful to LLM tool discoverability? is a charter bureaucracy for one user?
- C2 (090): Slice-first / summary-first recall output with citations + explicit expansion (token efficiency). Cited: docs/performance.md; core-api/src/core_api/services (result shaping). ATTACK: Spec Kit MCP tools ALREADY return trimmed slices with token budgets — redundant?
- C3 (089): Soft stale/currency/status penalties over hard exclusion; bounded decaying activation multiplier. Cited: core-storage-api/src/core_storage_api/services/postgres_service.py:919-1207; common/constants.py. ATTACK: Spec Kit FSRS decay + co-activation may already cover this — redundant?
- C4 (092): End-task LLM-judge eval over developer-memory tasks; token-efficiency ratio in dashboards; metric-limitation notes. Cited: docs/performance.md. ATTACK: aspirational? cost? does eval_run_ablation already suffice?

ALSO: compile the FINAL NEGATIVE-KNOWLEDGE LEDGER — the consolidated list of MemClaw mechanisms that must NOT be ported into a single-user local store (multi-tenant scoping, fleet trust tiers, cross-agent propagation/divergence, PII quarantine, pgvector/Postgres-specific machinery, distributed workers/brokers, warm-cache/rate-limit/bulkhead infra, public-SemVer external-API governance). Cite representative evidence for each.

DELIVERABLE — markdown with EXACTLY these sections:
## Citation verification
Per claim: VERIFIED / MISATTRIBUTED / NOT-FOUND.
## Refutation analysis
Per claim, strongest argument AGAINST (esp. redundancy with existing Spec Kit features).
## Verdict adjustments
Table: Claim · Prior verdict · NEW verdict · Reason.
## Final negative-knowledge ledger
The consolidated do-NOT-port list with one evidence cite each.
## Surviving teachings
Minimal subset of 089-092 that genuinely adds value.

Then output EXACTLY one final line, valid compact JSON:
DELTA_JSON: {"iteration":"020","focus":"ADVERSARIAL refute MCP/perf/eval + final negative-knowledge ledger","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"topVerdicts":["UPHELD: ...","REFUTED: ..."],"sources":["path:line"]}
