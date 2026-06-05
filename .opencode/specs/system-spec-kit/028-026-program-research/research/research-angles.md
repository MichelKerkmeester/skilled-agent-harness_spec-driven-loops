# 50 Research Angles — Work Done in 026 (graph-and-context-optimization)

Open, falsifiable research questions spawned by the closed 026 program. Each is tied to real shipped work. Grouped by theme; the executor column is the assigned deep-research model.

## A. Memory & causal runtime (track 003)
1. Measured impact of default-on async enrichment on save p50/p95 latency vs the prior synchronous path, including total time to fully-enriched state.
2. Crash-safety of the bounded background enrichment scheduler: what is lost if the daemon dies between save-commit and deferred enrichment, and is it recoverable on replay?
3. How far does causal relation inference generalize beyond spec-document lineage? Could it promote edges from commit history, code-graph, or test references?
4. Formal correctness of the SEC-001 conflict guard against transitive (3+ node) contradiction cycles, not just reciprocal pairs.
5. The production backfill raised coverage 39.91% to 43.59%. What is the realistic ceiling, and what fraction of true causal edges remain undiscovered by the current collectors?
6. Reconsolidation was kept opt-in. What is the empirical quality delta when enabled, and what risk justified not defaulting it on?
7. Entity-density cache invalidation completeness: are there save paths that mutate entities without invalidating the cache?
8. Self-maintaining index move-reconciliation under rapid concurrent folder moves across sessions: correctness and race exposure.
9. Multi-tenant scope isolation: is there any cross-scope read/write leak past the active-row uniqueness guard?
10. checkpoint-v2 durability: is there any crash window in the restore journal + .needs-rebuild sentinel that leaves an unrecoverable database state?

## B. Embeddings (track 003 / embedding-stack)
11. Retrieval-quality delta between nomic-local and cloud providers (Voyage/OpenAI) on a judged fixture: what is the measurable cost of going local-first?
12. Design and run the unran q8-vs-fp16 dtype bench: does fp16/MPS beat q8 on latency/recall enough to change DEFAULT_DTYPE?
13. RSS behavior of the hf-local model server under sustained load: is the opt-in RSS watchdog threshold well-calibrated, and should a memory-sufficiency preflight exist?
14. Did the nomic-only consolidation cost any domain-specific recall (code vs prose) versus the pruned multi-model menu?
15. Cold-start latency of the Python-free hf-local server (~15-30s, ~274MB): can it be reduced via model caching or a warm pool?

## C. Daemon & MCP reliability (track 007 + launcher)
16. Front-proxy transparency: under what daemon-recycle timing can a client still observe an error? Adversarial timing analysis.
17. Shared-daemon lease model: failure analysis when the lease-holder launcher dies ungracefully, and re-election latency for secondaries.
18. Generalize the transparent daemon-child recycle to mk-code-index and mk-skill-advisor (which currently exit on child SIGTERM): design and risk.
19. WAL-checkpoint-on-close data-loss window: formal bound on uncheckpointed data at crash, and whether bounded autocheckpoint closes it.
20. Socket-path canonicalization and TOCTOU: residual symlink/race attack surface after the hardening.
21. Deep-loop fan-out shipped serial (spawnSync). Measure the real speedup of the async-concurrency remediation vs serial across executor counts.
22. The launcher-lease flake root cause (lib/ tree not copied by the fixture): are other test fixtures carrying the same copy-incompleteness latent bug?

## D. Code-graph (track 004)
23. Detector-provenance precision/recall versus a labeled ground-truth corpus.
24. CocoIndex decoupling: what capability, if any, was lost versus the Python CocoIndex indexer, and is it worth re-adding?
25. Bounded traversal (maxDepth): does it ever truncate genuinely-relevant blast-radius nodes? Recall analysis.
26. Multi-file union queries: usage and value analysis of unionMode:'multi' and the hotFileBreadcrumb.

## E. Skill-advisor (track 002)
27. Routing accuracy on a held-out corpus of real user phrasings (not the regression fixture): true in-the-wild top-1.
28. Semantic routing lane vs lexical: ablation on how often semantic routing changes the top-1.
29. Routing-confidence calibration: is the 0.8 invoke threshold optimal, or does it over/under-trigger?
30. Skill-graph enhancement-edge propagation: does it measurably improve unprompted skill discovery?

## F. Deep-loop, research & review (skilled-agent 121-123, 127)
31. Parallel fan-out lineage diversity: does N-model fan-out find materially more than N runs of one model?
32. The reusable model-benchmark framework's correctness gate: stress-test whether it reliably prevents saturation from crowning a wrong winner.
33. Adversarial round-2 verify (the "downgrade 4 of 5 P1s" pattern): measured false-positive reduction across reviews.
34. Convergence detection: is the 0.10 threshold well-calibrated, or do loops stop too early or too late?
35. Cross-model research diversity (meta, tested by this very run): do MiMo, DeepSeek, and MiniMax surface different findings or converge?

## G. Prompt toolkit (130/131, sk-prompt-small-model)
36. Per-model prompt-craft frameworks (RCAF/COSTAR/TIDD-EC): which are empirically validated vs convention defaults, and which lack any benchmark?
37. sk-prompt forkability: is the hub-to-cli seam truly decoupled, or are there residual cross-refs that would break an extraction?
38. Open-model cost/quality frontier via cli-opencode: DeepSeek vs MiniMax vs MiMo on a standardized task suite, per task class.
39. The "--variant high" reasoning-effort mapping: is it actually forwarded for each provider (several flagged unverified)?

## H. Operator tooling (track 006)
40. Doctor command coverage gaps: which subsystems lack a /doctor target, and what failure modes go undiagnosed?
41. Worktree-per-session isolation: measured reduction in cross-session contention incidents versus pre-isolation.
42. Hook parity across runtimes (Claude/Codex/OpenCode/Gemini): is behavior truly equivalent, or are there runtime-specific gaps?

## I. Program-meta & process (track 000, 026 as a whole)
43. Was the 634-phase phase-parent/lean-trio decomposition net-positive for navigation and resume, or did it add overhead?
44. Did changelog centralization actually reduce drift, or relocate it? (the program-context drift just found suggests partial.)
45. AI-authored changelog accuracy: systematic measurement of the invented-verification rate across the ~694 changelogs.
46. Verify-first scouted-bugfix batches: false-positive rate of "confirmed" bugs that were actually non-issues.
47. Spec-folder derived-metadata staleness half-life: how fast does graph-metadata/description drift after a save, and should TTL-refresh be automated?
48. The "shipped-then-removed" honesty pattern: how many other changelogs describe later-removed code but are not marked?
49. Multi-session shared-index race: frequency and cost, and whether a per-session index or commit-discipline tooling would help.
50. Generalizability: which 026 capabilities (front-proxy, causal inference, self-maintaining index, local-first embeddings) are reusable in other repos/products, and what is the extraction cost?
