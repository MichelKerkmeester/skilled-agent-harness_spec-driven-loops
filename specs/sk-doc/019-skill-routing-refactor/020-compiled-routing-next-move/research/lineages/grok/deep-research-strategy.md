# Deep Research Strategy — Compiled Routing Next Move (grok lineage)

## 1. OVERVIEW

Detached fan-out lineage deciding the next move for the compiled-routing subsystem. Treats the operator-supplied verified state as baseline; one ordered question per iteration. Completed at max iterations.

## 2. TOPIC

Choose a long-term activation-manifest model, establish the exact authored/runtime closure-resolution discrepancy, place freshness enforcement, assess staging and rollback, and sequence the minimum safe work around the concurrent `sk-design` restructure.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1. Which activation-manifest ownership model should be the long-term contract, and what breaks under authored-only, runtime-authoritative, or a better third model?
- [x] Q2. What exact mechanism makes authored closure tracing fail for `cli-external-orchestration` and `sk-design` while byte-identical runtime manifests resolve?
- [x] Q3. Where should compiled-route freshness block—pre-commit, pre-push, CI, or session hook—and how should legitimately uncompilable in-progress hubs escape?
- [x] Q4. Should staging and rollback remain for a single-operator git-backed build tool, given the former live-runtime `rmSync` hazard?
- [x] Q5. What is the minimum sequenced work for reproducibility, self-reporting, and unattended safety, split into work safe now versus work that must wait for `sk-design`?
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not implement fixes.
- Do not re-prove the supplied verified state unless repository evidence contradicts it.
- Do not redesign unrelated routing or registry systems.
- Do not write outside this detached lineage directory.

## 5. STOP CONDITIONS

- Run all five configured iterations even if convergence telemetry falls below `0.05`.
- Stop after iteration 5 and synthesize concrete recommendations with file-and-line evidence.
- Mark every unsupported or incompletely verified claim explicitly.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1 → derived dual-location ownership
- Q2 → live-input snapshot compile failures swallowed by resolveRoute; harness/registry skew
- Q3 → CI authoritative; allowlist only inputs-do-not-compile
- Q4 → retain staging/rename/rollback; never live rmSync
- Q5 → safe-now vs wait-for-sk-design sequence in research.md
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading writer + sync + resolver + guard as one ownership story (iteration 1)
- Bypassing resolveRoute's catch with direct loadHubEngine to surface ENOENT / six-modes / undefined.toString (iteration 2)
- Separating enforcement authority (CI) from developer feedback (hooks) via actual hook/workflow files (iteration 3)
- Separating staging/rename/rollback from git recovery using publish sequence + git history of rmSync (iteration 4)
- Treating Q5 as dependency ordering over prior decisions (iteration 5)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Broad manifest/hook greps (noise); narrow paths worked (iterations 1, 3)
- Trusting baseline "runtime succeeds" without re-probe (iteration 2)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Pure runtime-authoritative ownership -- BLOCKED (iteration 1)
- Why: rebuilds non-reproducible; mint writes runtime only

### Pure authored-only (no runtime mirror) -- BLOCKED (iteration 1)
- Why: resolver only reads promoted activation root

### Manifest-byte comparison as Q2 root cause -- BLOCKED (iteration 2)
- Why: cli manifests identical yet both graphs fail via live skills/harness

### Authoritative pre-commit / pre-push / session blocking -- BLOCKED (iteration 3)
- Why: opt-in hooks / wrong semantic gate / not merge authority

### Live-root rmSync publication -- BLOCKED (iteration 4)
- Why: historical crash window; superseded by staging rename
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Pure runtime-authoritative ownership (iteration 1)
- Pure authored-only ownership (iteration 1)
- Advisory-only dual-location forever (iteration 1)
- Manifest-byte comparison as sufficient Q2 explanation (iteration 2)
- Current runtime success for cli/sk-design (iteration 2; contradicted)
- Authoritative pre-commit/pre-push/session freshness blocking (iteration 3)
- Git-only rollback for in-flight publish (iteration 4)
- Removing staging/rollback before tests green (iteration 5)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: Q1–Q5 answered under max-iterations stop
- Remaining frontier: sk-design end-state mode cardinality (4 vs 6) UNVERIFIED
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- UNVERIFIED: intended sk-design mode count after restructure (compiler expects 6; live has 4)
- UNVERIFIED: concrete CI workflow path filters / allowlist file location
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Lineage complete — see research.md. Implementation follow-up is out of scope for this research run.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- resource-map.md not present at target spec root at init; lineage emits its own resource-map at synthesis.
- Baseline contradictions recorded in iteration 002 and research.md.

### Bounded Context Snapshot

- Source pointers: compiled-route-sync/guard/manifest; promoted resolve/compiled-route; 004/006 harnesses; CI workflows.
- Constraints: detached write boundary = this lineage dir only.

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only under stopPolicy max-iterations)
- Session: fanout-grok-1785124318112-qa7rq8
- Started: 2026-07-27T03:52:28Z
- Completed: 2026-07-27T03:56:00Z
