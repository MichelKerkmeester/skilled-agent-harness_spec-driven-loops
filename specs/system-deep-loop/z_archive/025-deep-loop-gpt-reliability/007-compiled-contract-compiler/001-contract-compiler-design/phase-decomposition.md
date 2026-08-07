# 036 Build/Retrofit Phase Decomposition

> Output of phase 001 (design). Proposes the build phases that follow the verified design (`design.md`). Each becomes a 036 phase child once approved. Effort tiers: S (<100 LOC), M (100-499), L (≥500 / high risk). "Unblocks T002" marks phases the 035 acceptance re-run depends on.

## Proposed phases

| ID | Phase | Effort | Depends on | Unblocks T002 | Acceptance |
|----|-------|--------|------------|---------------|------------|
| P1 | Contract schema + compiler (`/deep:review` prototype) | M | 001 | indirect | Compiler reads the 16 review sources and emits `compiled/deep_review.contract.md` with all schema blocks + `sourceDigests` + `compiledBodyDigest`; artifact is grep-checkable; unit test asserts each block present. |
| P2 | Drift-guard + CI | M-L | P1 | no | Hard-fails on each drift class (stale source digest, unresolved marker, tool-allowlist overflow, **new-unlisted-source**); CI runs it; `--accept-compiled-drift` records a delta; test per class. |
| P3 | Deterministic setup loader | L | P1 | no | Emits `{contractPath,setupValues,writeBoundary,selectedWorkflow,renderedPromptPrelude}` before YAML load; fails before load on placeholder / unknown-field / dup-marker / invalid-path / tool-mismatch (test per class). |
| P4 | Rollout live consumer + manifest + comparator | M-L | P1 | **yes** | `render-command-contract.cjs` at the bang-shell seam; `fallback` renders `/deep:review` **byte-identical** to legacy (comparator green); `fix` prepends the compiled contract; manifest JSONL row per render; comparator + promotion rules runnable in CI + locally. |
| P5 | Fan-out receipt/progress parity | M | 035 receipt infra (exists) | no (independent — see note) | `fanout-run.cjs` lineages write INTENT+COMPLETION receipts validated identically to single-executor CLI branches (or a parity adapter with the same intent/completion semantics); test proves a fan-out lineage produces a valid receipt pair. |
| P6 | Pacing/resume + council convergence | M-L | P1, P3 | **yes** (council cells) | Progress-non-terminal test (reducers unchanged); pre-cap-finalizer writes partial-not-success; dark-stall gets no budget extension; resume via `classifyPrompt` needs no Gate-3 re-ask on a bound folder; council persists per-seat then ≤1 referee pass per round. |
| P7 | Retrofit: research/context/council + siblings + 14 agents + AGENTS.md prose thinned | L | P1, P2, P4 | **yes** (all-command coverage) | All four deep commands render through the consumer; agent files become thin contract-pointers; the root AGENTS.md/policy Gate-3 prose is thinned to point at the compiled machine-bound precedence (§9/§11), not restated; drift guard (P2) covers every compiled command. |
| P8 | 035 T002 live acceptance re-run | M (mostly runtime) | P4, P6, P7 | **closes it** | Capture fallback baseline via `opencode run --command`; flip target commands to `fix`; re-run the six cells on gpt-fast-med + high; manifest comparator confirms the flip with the baseline leg green; record the result back in 035 phase 004. |

## Dependency order + critical path

```
001 ──→ P1
P1  ──→ P2, P3, P4, P6
P3  ──→ P6
P1 + P2 + P4 ──→ P7
P4 + P6 + P7 ──→ P8        ← closes 035 T002
P5  : independent (needs only the 035 receipt infra) — NOT a T002 gate
```

- **Critical path to unblock T002:** `001 → P1 → P4 → P7 → P8`, with P6 required for the ACB council cells' coverage. **P5 is NOT on this path** — the six T002 cells dispatch via `multi-seat-dispatch.cjs` / single-executor CLI branches (which already write receipts), not `fanout-run.cjs` (operator-opt-in only, never the default per-iteration path), so fan-out receipt parity does not gate T002.
- **Earliest partial T002 signal:** after `P1 → P4`, the three non-fan-out/non-council absorption cells (RVB-007, RSB-005, RSB-007) can be measured in `fix` mode before P5/P6/P7 land — useful as an early proof that the compiled-contract mechanism flips behavior at all.
- **P5 can start immediately** (parallel to P1-P4) — it depends only on the existing 035 receipt infrastructure, not on the compiler.

## Sequencing recommendation

1. **P1** first (everything hangs off a working compiler + one real contract).
2. Then **P4** (the live consumer) as the priority second step — it is the single highest-leverage piece: it makes the flag live, ships zero-behavior-change in `fallback`, and enables the early partial-T002 signal. Run **P2** alongside (drift safety before any `fix` flip).
3. **P3** and **P6** next (setup loader + pacing/resume); **P5** in parallel whenever capacity allows.
4. **P7** (retrofit) once P1/P4 are proven on `/deep:review`.
5. **P8** (T002) last — it is the acceptance gate, not new mechanism.

## Feature-flag safety (carried from 035 guardrails)

Every phase ships behind the per-command `SPECKIT_COMMAND_INJECTION_MODE` flag with a **byte-identical `fallback`**. No command changes behavior until it is explicitly flipped to `fix` and its comparator is green. P4's comparator is the enforcement: a `fallback` byte-diff blocks promotion. This preserves the "no forced rewrites" guarantee end-to-end.

## Notes for whoever picks this up

- Resolve the **deterministic dispatch-id** refactor early (P4/P8 both need it) — today's YAML-rendered Node snippets use random ids, which receipt validation cannot bind reliably.
- P4 must **prove byte-identical fallback** against the OpenCode renderer's actual whitespace handling around `!`…`` output before any `fix` flip is trusted.
- Keep the **fan-out parity residual risk** (P5) explicitly separate from T002's per-cell claims; do not let a green non-fan-out cell imply fan-out receipts work.
