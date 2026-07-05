# Gap Synthesis — 035 Plan Red-Team

**What this is:** a 10-iteration adversarial gap-analysis of the 035 implementation plan (the packet that fixes the GPT-executor reliability problems measured in 033 and diagnosed in 034). Orchestrator-hosted; two critic models ran bounded read-only critique dispatches; every cited gap was verified by the orchestrator against the actual 035/034/033 files before entry. **58 gaps confirmed, 1 rejected as a fabrication.**

**Provenance:** iters 001–004 `zai-coding-plan/glm-5.2 --variant max`; iters 005–010 `minimax/MiniMax-M3 --variant thinking` (mid-campaign model switch for cross-model diversity). Full per-iteration verdicts in `iteration-log.md`; every gap with evidence + amendment in `gap-registry.md`.

---

## 1. Verdict

The 035 plan is **directionally sound but not execution-ready.** Its fixes target the right findings and the dependency-first instinct is correct — but the review found **three blocker-class issues**, a **strategic simplification the plan almost reaches but doesn't take**, and a **cluster of cross-model-confirmed structural defects** that make the plan's central "each phase ships and verifies independently" claim materially false.

Do not execute past phase 002 without a pre-execution amendment pass. Two of the three blockers sit inside the P0/P1 designs themselves; landing them as-written ships broken safety guarantees.

**Severity tally:** 3 blocker-class · 48 major · 8 minor. **Convergence:** 6 gaps were independently re-discovered by the second model across different angles (highest-confidence defects). **Method integrity:** 1 confident-but-false claim (F-038 "unphased") was caught and rejected in verification — the count is clean.

---

## 2. The three blocker-class issues (must fix before execution)

### B1 — GAP-16: The Gate-3 skip trusts an unvalidated boolean *(P0, phase 002)*
The satisfaction rule grants the Gate-3 skip on `boundSpecFolder.validated` with **no validator that ever sets it**; 002 REQ-002 specifies the API shape but no `validateSpecFolderBinding()` predicate. Since `allowedSpecFolderSources` includes `'flags'`, a literal executor — this packet's exact target — passes `--spec-folder ../` with `validated:true` and skips the gate to any write. The entire P0 safety guarantee rests on an undefined boolean. **Fix:** ship a concrete, called validator (path under specs tree, exists, has mandatory metadata, Status≠Deprecated, is a leaf) before 002 lands.

### B2 — GAP-23: The dispatch-receipt HMAC key leaks through the command string *(P1, phase 004)*
The design claims the key is "never passed through `buildExecutorDispatchEnv`" (env-protected), but it is interpolated as `receiptKey: '{dispatch_receipt.key}'` inside the `if_cli_opencode` `command:` heredoc — the exact ancestry/cmdline surface `executor-audit.ts:detectFromAncestry` already reads. A compromised executor reading `ps`/`/proc` recovers the key and forges valid receipts, defeating the whole mechanism. **Fix:** keep the key in the engine process; compute the HMAC engine-side and have the wrapper *return* post-dispatch facts to countersign — never interpolate the key into any command template.

### B3 — GAP-47: The synthesis-mandated rollout safety-belt was dropped *(packet-level; triple-converged)*
Synthesis §5 item 4 explicitly mandates "root-policy and profile changes behind **per-command opt-in with fallback to current injection**," and it was handed off as a required implementation item. **035 has zero feature-flag / opt-in / fallback references across all 10 phases.** The three highest-blast-radius rewrites (Gate-3 bridge in 002, compiled flatten in 008, injection dedupe in 010) ship as forced re-wires with no kill switch — a regression in any one silently reverts the cell-flips the prior phases earned, with no frozen pre-035 baseline to A/B against. *Independently re-discovered in iters 008, 009, and 010, each rating it blocker.* **Fix:** insert a rollout-mechanism phase **before 002**: byte-hashed pre-035 fallback, per-command opt-in flag defaulting off, a CI comparator on the Claude-native cells, and an N-green promotion rule.

---

## 3. The strategic decision — GAP-58 (evaluate before executing past 002)

The plan fixes **one defect in five fragments**: the executor doesn't see the command contract because it's distributed across files and weighted by file position. Phases 002 (prelude), 003 (render markers), 007 (executor-contract block), 008 (compiled flatten), and 010 (injection slim) each patch a piece.

A single build-time artifact subsumes them: **one typed, self-contained contract per command** — Gate-3 precedence, setup render block, output template, write boundary, receipts + progress contracts, tool list — compiled as the first ~150 lines of the prompt. Then 007 becomes a pointer, 010 becomes "inject the contract + one link," 008 *is* the build step, 002 is one line in the contract, 003 is markers inside it. **10 phases collapse toward ~3.**

This is the highest-leverage decision in the review. It also neutralizes **GAP-57** (the 8-rule prelude, shipped as raw injected text, is itself a new Claude-shaped convention a literal executor mis-reads in interactive sessions — the fix recreating the failure mode it targets) by making the contract *typed and mode-bound* rather than prose. Recommendation: make the build/no-build call explicitly before authoring phases 003+.

---

## 4. Convergence-confirmed structural defects (highest confidence)

These were hit by both models and/or multiple angles — the plan's most certain defects:

| Gap | Defect | Converged by |
|---|---|---|
| **GAP-03** | ACB-004 is an acceptance cell in BOTH phase 002 and 005, with no primary/secondary-cause attribution mechanism → both can claim the flip or neither can prove its share | iter-001, iter-006 (+ concrete fix: define `primary_cause`/`secondary_cause` JSON fields + a locked multi-cause list {ACB-004,ACB-005,CXB-004}) |
| **GAP-10** | 007/008/010 have NO unique acceptance cells ("measured indirectly") → the "each phase verifies independently" claim is false; they can only be non-regression passes gated on 002/003/004 | iter-002, iter-006, iter-009 (+ fix: measurable artifacts — `grep -c '^## EXECUTOR CONTRACT'==1` for 007, token-count assertion for 010, drift-guard CI + loader unit-test for 008) |
| **GAP-02** | The synthesis's interim first-line-abort absorption guard (S, lands before receipts) was dropped → 3 absorption cells unmitigated in the window between phases 002 and 004 | iter-001, iter-008, iter-009 |
| **GAP-09** | 002 and 010 mutate the same command-scoped injection payload; 010 lands last (predecessor 009, not 002) and can silently revert 002's five flips | iter-002, iter-008 |
| **GAP-06 / GAP-37** | Baselines are single-sample and, for ~69 non-affected cells, produced by the pre-F-014/F-025 *broken* runner → "baseline green" rests on possibly-misclassified prior scores | iter-001, iter-006, iter-010 |
| **GAP-14** | Phase 001's path-free rewrite re-scores the exact three cells (ACB-003/IMB-003/RSB-004) that are phase 006's acceptance cells → 006 measures against a 001-moved baseline with no attribution | iter-002, iter-006 |

---

## 5. Per-phase amendment map

| Phase | Gaps to resolve | Headline amendment |
|---|---|---|
| **001** harness | 01, 06, 08, 14, 37, 38, 40, 49 | Expand scope beyond F-014/F-025: add the §5 instrumentation (snapshot/budget/telemetry), an N≥3 rule for contested cells, a full 32×3 re-score before trusting baselines, and per-mode stall-rate deltas. It is under-scoped for its stated "make the harness trustworthy" job. |
| **002** gate3 *(P0)* | **16(B)**, 04, 12, 17, 18, 19, 20, 21, 22, 48, 51 | Ship the validator (B1). Add caller migration (34 vitest + corpus-runner + 2 YAML machine_contracts). Enforce writeBoundary; gate `prior_answer` on mode; handle phase-parent, `/doctor` precedence, child-agent re-classify. Re-rate M→L. |
| **003** render | 42 | Name the five `_confirm.yaml` paths + render.confirm blocks, not just bare-auto. |
| **004** receipts *(P1)* | **23(B)**, 24, 25, 26, 27, 28, 29 | Fix the key channel (B2). Scope the 12-branch wrapper migration; split native intent/completion receipts; add atomic-write + I/O-failure class; migrate the 4 YAMLs' required route fields; parent-owned receipt path. |
| **005** progress | 30, 31, 32, 33, 34, 35, 36 | Lift the reducer allowlist into a REQ; move IMB-001/improvement to 009 or add the insertion point; name the council-persist writer; split F-018 (convergence) out; add a work-anchored schema field to stop no-op heartbeats. |
| **006** routing | 11, 14, 56 | Re-set predecessor to 001/002 (not 005) and parallelize with 003; own the post-001 baseline; add non-regression gate against 010's slimming. |
| **007** agent-contracts | 10, 43, 57 | Enumerate all 14 agent files (only 3 were sampled); give it a measurable contract-presence cell; make the prelude typed/mode-bound (GAP-57). |
| **008** compiled | 10, 53, 55 | It has no design iteration — carve into a `036` design packet; specify the drift-guard contract before it lands. |
| **009** pacing | 13, 28, 54 | No design iteration — carve out; add a resume contract + per-sub-invocation cells + a receipt-key lifecycle for multi-dispatch runs. |
| **010** injection | 09, 46, 52, 56 | Predecessor → 002 with a 5-cell regression gate; per-command deferral matrix; re-rate S-M→M; slim the other MCP/hook injection paths too. |
| **Packet-level** | 03, 05, 07, 15, 39, 41, 44, 45, **47(B)**, 50, 58 | Rollout mechanism (B3); multi-cause attribution (GAP-03); the 3 sibling improvement lanes + non-deep-loop surfaces are unaddressed; validate one non-GPT executor; replace boilerplate Risks rows; **decide GAP-58**. |

---

## 6. Cross-cutting themes

1. **"Each phase ships and verifies independently" is false.** GAP-10 (no unique cells for 007/008/010), GAP-03 (double-claimed cell), GAP-09/GAP-56 (injection collisions), GAP-13/GAP-28 (009→004 receipt coupling), GAP-14 (001→006 baseline coupling), GAP-18/GAP-12 (002 cells co-owned by 007). The dependency graph is denser than the linear phase map admits.

2. **The acceptance harness (033) is trusted as ground truth despite its own confounds.** Phase 001 repairs the instrument (F-014/F-025) but not the epistemic stand: single-sample baselines, ~69 cells scored by the broken runner, the D-007 host-binary latency confound, and a "baseline green" requirement that is impossible-as-stated for ACB-005 (its Claude baseline is a confirm-halt) and has no CI enforcement.

3. **The plan under-scopes its own surface.** 3 sibling improvement lanes, 11 of 14 agent files, ~35 non-deep-loop commands, and 5 non-GPT executors are all in the blast radius of the global fixes but carry no acceptance evidence.

4. **Two phases (008, 009) are research mislabeled as implementation** — they have no design iteration, unlike every P0/P1 phase, and should be their own design packet.

5. **The fix may recreate the disease.** GAP-57: a hard-rule prelude shipped as raw injected text is the same over-literal-reading trap, one level up. GAP-58's typed contract is the durable answer.

---

## 7. Method notes

- **Every gap verified against real files before entry.** Verification materially changed the record three times: rejected GAP-candidate F-038-"unphased" (false — it's phase 008 REQ-003); down-rated MiniMax's aggressive "blocker" labels on scope-completeness gaps to major; confirmed the 008/009 no-design-iteration claim by auditing which iterations produced designs (011–014) vs ranking (015).
- **Cross-model diversity paid off.** GLM (iters 1–4) excelled at deep design/threat critique (both blockers came from GLM angles); MiniMax (iters 5–10) was fast, citation-accurate, and strong on scope/effort/second-order angles, and its registry-awareness produced the convergence signal that hardened the top defects.
- **Convergence indicates saturation.** Re-discovery rose from 0% (iters 1–4) to ~45% (iters 6, 8, 9) — the plan-structure/dependency/verification cluster is well-covered. The novel back-half yield (rollout mechanism, no-design-iteration, simpler root fix, prelude-as-new-convention) came from the orthogonal effort/second-order angles.
- **What this review did NOT do:** re-run the 033 benchmark, execute any fix, or validate the amendments themselves. It is a plan critique; the amendments are recommendations to fold into the 035 specs before execution.
