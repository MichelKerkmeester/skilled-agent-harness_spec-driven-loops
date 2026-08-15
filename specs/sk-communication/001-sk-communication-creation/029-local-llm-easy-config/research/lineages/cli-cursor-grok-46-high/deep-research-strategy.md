# Deep Research Strategy - Session Tracking

Lineage: cli-cursor-grok-46-high | executor: cli-cursor / cursor-grok-4.6-high | session: fanout-cli-cursor-grok-46-high-1786720025911-6qn2nd

## 1. OVERVIEW

Persistent research plan for this fan-out lineage. Machine-owned sections refreshed after iteration 5 (max-iterations stop).

---

## 2. TOPIC

Design the simplest possible way for a person to configure their own local LLM (LM Studio or Ollama OpenAI-compatible endpoint) for the communication projection, so that after a minimal one-time setup the projection automatically activates and uses that model, with no further manual steps.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
Generated from the reducer registry.

- All five key questions answered in this lineage.
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing any shipped runtime in this phase.
- Hosted-provider configuration or remote egress of message content.
- Auto-probing every localhost port without an operator-authored config.
- Changing the default-off enablement contract so a repo pull rewrites CLI output.

---

## 5. STOP CONDITIONS

- `config.stopPolicy` is `max-iterations`: exactly 5 iterations. Convergence before that was telemetry only.
- Do not implement code. Report findings only.
- Halt if a finding would require writing outside this lineage directory.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- [x] Q1: Config surface — extend `enablement.local.json`; env stays on/off overlay (iteration 1)
- [x] Q2: Auto-construction — `createOllamaModelRecord` / `createLlamaCppModelRecord`; LM Studio is llama-cpp family (iteration 2)
- [x] Q3: Judge — reuse reject-only judge with `judgeMode: 'required'`; no new judge (iteration 3)
- [x] Q4: Privacy — loader-built local-only policy, `egressConsent: false`, fallback none (iteration 4)
- [x] Q5: Auto-pickup — shared `src/config` loader called by plugin `createProjectionInput` and wrapper bin (iteration 5)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- File-and-line inventory of enablement vs provider discovery (iteration 1)
- Reading `validateFamilyCompatibility` before proposing a hosted protocol for LM Studio (iteration 2)
- Judge tests as ground truth over the phase-spec wording (iteration 3)
- Mapping privacy requirements onto existing router reason codes (iteration 4)
- Treating plugin, wrapper library, and wrapper bin as three seams (iteration 5)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Assuming `docs/configuration.md` already described a local endpoint file (iteration 1)
- Treating "OpenAI-compatible" as the hosted protocol name for local LM Studio (iteration 2)
- Taking the phase spec's "even a good rewrite is rejected" as an algorithm fact (iteration 3)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Env-only primary config -- BLOCKED (iteration 1)
- What was tried: rank env vars as the one-time setup
- Why blocked: no reader exists; not auditable; no committed example
- Do NOT retry: env overlays only

### New judge or disabled-judge default -- BLOCKED (iteration 3)
- What was tried: design a local-accept judge; default to judgeMode disabled
- Why blocked: shipped judge already accepts good rewrites; disabled skips meaning coverage
- Do NOT retry: reuse `createRejectOnlyMeaningJudge` with required mode
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Env-only as primary one-time setup (iteration 1, evidence: src/config/enablement.ts)
- Silent localhost port scanning (iteration 1, evidence: docs/enablement.md)
- Hand-authored full ProviderModelRecord JSON as minimal UX (iteration 1)
- Map LM Studio to GENERIC_HOSTED (iteration 2, evidence: registry.ts:208-226)
- New LM Studio wire adapter (iteration 2, evidence: adapters.ts)
- Default missing kind to OpenCode Go hosted (iteration 2)
- New local-accept judge (iteration 3, evidence: reject-only-judge.ts:10-14)
- judgeMode disabled as easy-config default (iteration 3)
- egressConsent true in local easy-config (iteration 4)
- Mixed local+hosted as default (iteration 4)
- Wrapper CLI flag for provider config (iteration 5)
- Two-file setup as default (iteration 5)
- Require doctor before first projection (iteration 5)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: env-only primary config; new judge; mixed-mode default
- Pivot lineage: none (stopPolicy max-iterations; angles broadened by design: config, construction, judge, privacy, pickup)
- Remaining frontier: optional env overlays (rank 2); llama-cpp naming alias for LM Studio (build-phase cosmetic)
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Should a later build add `createOpenAiCompatibleLocalRecord` as a named alias over llama-cpp family, so operator docs never say "llama.cpp" for LM Studio? (cosmetic; not required for correctness)
- Exact capability-expiry window the loader should stamp (doctor example uses ~8 days)
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
None in this lineage — max-iterations (5/5) reached. Parent fan-out merge synthesizes canonical packet `research/research.md`.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

resource-map.md not present; skipping coverage gate.

See iteration files for the bounded snapshot of plugin, wrapper, transport, adapters, presets, judge, privacy router, and enablement.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only; stopPolicy max-iterations)
- Per-iteration budget: 12 tool calls, 30 minutes
- Progressive synthesis: true
- Current generation: 1
- Started: 2026-08-14T15:12:00.000Z
- Executor: cli-cursor model=cursor-grok-4.6-high
