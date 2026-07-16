# Context Index — 031 GPT Reliability (Deep-Loop) reorg

This packet was renamed `031-deep-loop-issues-with-gpt-opencode` →
`031-deep-loop-gpt-reliability` and regrouped from **22 phases** (18 original
phases + the moved-in packets 034/035/036/037) into **7 themed L1 tracks**, with child
numbers restarted per track. This document is the old→new remap so by-number
cross-references ("see phase 017", "the 004 dispatch phase") stay traceable, and
preserves the per-phase narrative that previously lived in the root `spec.md`.

The live truth (metadata, packet pointers, graph edges) was updated to the new
paths; historical research/review/iteration narrative under each phase was
preserved verbatim.

---

## 1. Old → New remap

| Old (flat) phase | New location | Track |
|---|---|---|
| `007-gpt-behavioral-hardening-research` | `001-research-and-diagnosis/001-gpt-behavioral-hardening-research` | Research & diagnosis |
| `034-gpt-reliability-research` (moved packet) | `001-research-and-diagnosis/002-gpt-reliability-research` | Research & diagnosis |
| `001-deep-agent-router-and-orchestration` | `002-routing-dispatch-and-identity/001-deep-agent-router-and-orchestration` | Routing/dispatch/identity |
| `002-route-proof-validation` | `002-routing-dispatch-and-identity/002-route-proof-validation` | Routing/dispatch/identity |
| `003-agent-dispatch-hardening` | `002-routing-dispatch-and-identity/003-agent-dispatch-hardening` | Routing/dispatch/identity |
| `004-command-pre-route-headers` | `002-routing-dispatch-and-identity/004-command-pre-route-headers` | Routing/dispatch/identity |
| `006-host-hard-identity-fix5` | `002-routing-dispatch-and-identity/005-host-hard-identity-fix5` | Routing/dispatch/identity |
| `008-mode-d-ai-council-identity-fix` | `002-routing-dispatch-and-identity/006-mode-d-ai-council-identity-fix` | Routing/dispatch/identity |
| `009-orchestrate-universal-routing` | `002-routing-dispatch-and-identity/007-orchestrate-universal-routing` | Routing/dispatch/identity |
| `010-ai-council-subagent-only` | `002-routing-dispatch-and-identity/008-ai-council-subagent-only` | Routing/dispatch/identity |
| `013-fix5-checkpoint` | `002-routing-dispatch-and-identity/009-fix5-checkpoint` | Routing/dispatch/identity |
| `011-deep-route-guard-plugin` | `003-guard-and-enforcement/001-deep-route-guard-plugin` | Guard & enforcement |
| `016-mk-deep-loop-guard-hardening` | `003-guard-and-enforcement/002-mk-deep-loop-guard-hardening` | Guard & enforcement |
| `017-loop-guard-implementation` | `003-guard-and-enforcement/003-loop-guard-implementation` | Guard & enforcement |
| `018-fanout-stopreason-tolerance` | `003-guard-and-enforcement/004-fanout-stopreason-tolerance` | Guard & enforcement |
| `037-mk-deep-loop-guard-retention` (moved packet) | `003-guard-and-enforcement/005-mk-deep-loop-guard-retention` | Guard & enforcement |
| `005-gpt-verification-smoke` | `004-benchmarks-and-verification/001-gpt-verification-smoke` | Benchmarks & verification |
| `012-gpt-claude-benchmark` | `004-benchmarks-and-verification/002-gpt-claude-benchmark` | Benchmarks & verification |
| `014-skill-doc-drift-audit` | `005-skill-doc-hygiene/001-skill-doc-drift-audit` | Skill-doc hygiene |
| `015-skill-doc-drift-remediation` | `005-skill-doc-hygiene/002-skill-doc-drift-remediation` | Skill-doc hygiene |
| `035-gpt-reliability-fixes` (moved packet) | `006-reliability-fixes/` (children 001/002, and 004→003) | Reliability fixes |
| `036-command-contract-compiler` (moved packet) | `007-compiled-contract-compiler/` (children 001/002/003) | Compiled-contract compiler |

---

## 2. Preserved per-phase narrative (pre-reorg)

The status notes below were carried over from the root `spec.md` phase map before
the reorg. Phase numbers are the ORIGINAL flat numbers; see the remap above for
their current location.

- **001 deep-agent-router-and-orchestration** — Completed research (`research/research.md` v2, 6 iterations, 10/10 KQs) that decomposed the implementation into the phases below.
- **002 route-proof-validation** — Route-proof validator fields (closes the FIX-5 false-negative) + evidence base + citation corrections. Independently re-verified (30/30 vitest, clean typecheck, strict validate PASS).
- **003 agent-dispatch-hardening** — `deep.md` primary router (deterministic table lookup) + `.claude` mirror + `Deep Route:` field in `orchestrate.md`.
- **004 command-pre-route-headers** — `Resolved route:` headers across all 4 deep modes (research/review/context/council) — prompt templates + CLI/inline dispatch.
- **005 gpt-verification-smoke** — Blocked/inconclusive: 0/4 command-owned smokes reached a real leaf dispatch (all blocked upstream by `cli-opencode` self-invocation guards). Neither proves nor disproves 002-004 sufficiency.
- **006 host-hard-identity-fix5** — Host-runtime hard identity + FIX-5 process isolation. Closed 2026-07-01 by phase 013's gate against phase 012's real benchmark results (zero wrong-mode artifacts, zero route-proof mismatches). Agent-layer fix confirmed sufficient; reopenable on fresh contrary evidence.
- **007 gpt-behavioral-hardening-research** — Six-lineage, two-round research. Final verdict: do not unpark 006/FIX-5 yet; keep `ai-council` as `mode: all` (6/6, later overridden in 010); harden `@orchestrate` via registry delegation; detection-only enforcement plugin feasible; run external smoke + benchmark only after cheaper fixes land.
- **008 mode-d-ai-council-identity-fix** — Replaced the Mode-D self-classification gate in all 7 surviving `/deep:*` command files with an evidence-based dispatch-context check; reconciled the ai-council route-proof identity toward `mode-registry.json`. Strict validate PASS, vitest 76/76.
- **009 orchestrate-universal-routing** — Completed orchestrate's Priority table with the 2 missing deep-mode rows; made the Deep Route field registry-resolved; added an explicit NDP boundary. Verified live.
- **010 ai-council-subagent-only** — Converted `ai-council.md` from `mode: all` to `mode: subagent` — a deliberate operator override of research's 6/6 recommendation (see `decision-record.md`). Verified live; redirected 2 documentation callers.
- **011 deep-route-guard-plugin** — Built `.opencode/plugins/mk-deep-loop-guard.js` (`tool.execute.before` hook). Live-tested: fires correctly, fail-closed throw genuinely blocks dispatch, warn path non-blocking, fail-open confirmed.
- **012 gpt-claude-benchmark** — Ran live smoke dispatches across 4 modes x 2 models: zero wrong-mode artifacts, zero route-proof mismatches, zero Mode-D recurrences; measured a 3-10x GPT latency gap. Full results in `benchmark-results.md`.
- **013 fix5-checkpoint** — Applied the cross-validated negative gate against phase 012's results. No trigger met; 006/FIX-5 closed as "agent-layer fix sufficient." Packet complete.
- **014 skill-doc-drift-audit** — 10-iter deep-review + 10-iter deep-research fan-outs audited 45 candidate skill docs; all 20 iterations re-verified by fresh Sonnet agents. Confirmed 6 real drift clusters. Findings-only; recommended phase 015.
- **015 skill-doc-drift-remediation** — Patched all 6 confirmed drift clusters; post-fix re-scan fixed 13 more `.toml`-mirror references + a pre-existing `REPO_ROOT` sandbox-script bug. Follow-up dual-model review confirmed and fixed 2 residuals.
- **016 mk-deep-loop-guard-hardening** — 5-iter dual-model research on mechanically detecting loop-like repeated orchestrate→loop-executor dispatches. Surfaced the load-bearing fact that orchestrate dispatches always set `subagent_type: "general"` (which silently no-ops phase 011's mode-mismatch guard). Recommended phase 017.
- **017 loop-guard-implementation** — Implemented `resolveTargetIdentity()` (prompt-text-first identity, fixing the `subagent_type="general"` no-op) + session-scoped loop-repeat detection + `MK_DEEP_LOOP_GUARD_REJECT_LOOP`. Live re-verified against opencode v1.17.11. Feature catalog F050 + playbook DLR-052 updated.
- **018 fanout-stopreason-tolerance** — Tolerant `isMaxIterationsStopReason` check for fanout-run stopReason strictness.

Moved-in packets:

- **034 gpt-reliability-research** — 15/15 productive xhigh iterations, 44 verified findings, ranked synthesis. Now `001-research-and-diagnosis/002`.
- **035 gpt-reliability-fixes** — Acute reliability fixes (acceptance/rollout foundation, Gate-3 precedence + validator, dispatch receipts + progress). Now track `006`.
- **036 command-contract-compiler** — Command-contract compiler design, deep-loop router deprecation, generalization probes. Now track `007`.
- **037 mk-deep-loop-guard-retention** — Sweep/archive/prune retention for the mk-deep-loop-guard .loop-guard-state dir. Now `003-guard-and-enforcement/005` (was a top-level packet, re-homed once the reorg settled).
