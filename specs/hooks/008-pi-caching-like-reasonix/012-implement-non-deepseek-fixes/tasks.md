---
title: "Tasks: Non-DeepSeek Path Fixes"
description: "Task breakdown for the 4 priority-ordered fix phases (high, medium, low, minor)."
trigger_phrases:
  - "non-deepseek fixes tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/012-implement-non-deepseek-fixes"
    last_updated_at: "2026-08-09T10:20:06Z"
    last_updated_by: "claude"
    recent_action: "Aligned code, ran manual K1/K2/K5 scenarios, fixed a discovered gate asymmetry."
    next_safe_action: "None; implementation, alignment, and manual scenario verification are complete."
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-012-non-deepseek-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Non-DeepSeek Path Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending, `[x]` complete
- Each task cites the requirement it satisfies (REQ-###) from `spec.md` and the finding it addresses (K#) from `../011-research-non-deepseek-optimization/research/lineages/deepseek-flash/research.md`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-confirm every finding's `index.ts:line` evidence citation against current source (file may have shifted since 011's research ran)
  Evidence: `index.ts:1462-1465, 1504-1505, 1542-1587, 2502-2585, 2983-3950, 3952-3967, 4033-4061, 7898-8281`; all K1-K15 source citations were rechecked against the current file.
- [x] T002 Capture baseline: current `npm test` / `npm run typecheck` output in `pi-cache-optimizer`, and current `research.md` vs `findings-registry.json` K6/K8 tier values (for the reconciliation diff in Phase 2)
  Evidence: baseline `npm test` passed 34/34 and `npm run typecheck` exited 0; research records K6=P1/K8=P2 while the lineage registry records K6=P2/K8=P1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### High Priority

- [x] T003 [REQ-001] Write `isDeepPiOwned` boundary regression tests across all 6 guarded hooks, with a negative control (break the guard, confirm the new test fails; fix it, confirm it passes)
  Evidence: `tests/hook-guards.test.ts:108-159`; the structural test passed, failed against a temporary pre-guard statement, and passed again after restoration.
- [x] T004 [REQ-002, K1] Add a model-scoped `prompt_cache_key` self-heal: disable only on an explicit unsupported-key signal (response header or `message_end.errorMessage`), mirroring `prompt_cache_retention`'s 4-gate strip (`index.ts:8068-8100`)
  Evidence: `index.ts:1504-1508, 2747-2767, 7402-7403, 7430-7439, 8182-8188, 8191-8202, 8259-8271`; generic 400s do not populate the model-scoped disable set.
- [x] T005 [REQ-002, K1] Add a per-model config opt-out for `prompt_cache_key` injection
  Evidence: `index.ts:257, 1504-1508, 5738-5767, 5783-5797`; `supportsPromptCacheKey: false` is resolved with modelOverrides/model/provider precedence.
- [x] T006 [REQ-002, K1] Tests: unrelated 400 leaves injection enabled; explicit rejection signal disables it for that model only; existing caller-provided keys untouched
  Evidence: `tests/review-findings.test.ts:185-289`; tests cover unrelated 400, response-header rejection, message_end.errorMessage rejection, per-model scope, caller keys, and config opt-out.

### Medium Priority

- [x] T007 [REQ-004, K2] Resolve the open question: do `opencode`/`opencode-go` register router adapters at runtime? Record the answer before writing the fallback.
  Evidence: official OpenCode `plugin/index.ts:104-115,145-148,201-222,234-273` loads hooks and workspace adapters only; `provider/provider.ts:155-186,1568-1737` has no router-adapter registry; official `go.mdx:205-207,228-258` describes Go as an ordinary provider. No runtime registration was found, so K2 must use the resolved/direct context and refuse an unresolved virtual-router shell identity.
- [x] T008 [REQ-004, K2] Add a resolved-route/direct-context adapter fallback in `selectAdapterForAssistantMessage` (`index.ts:3956-3967`) so an unrecognized echoed model id no longer silently drops stats at `message_end` (`index.ts:8196-8197`)
  Evidence: `index.ts:3988-4008, 8277-8283`; response metadata remains authoritative, then the resolved route/direct context supplies the adapter while an unresolved virtual-router shell returns no adapter.
- [x] T009 [REQ-004, K2] Test: unrecognized id on a known direct provider falls back correctly; unrecognized id on a virtual router does not adopt the router's shell identity
  Evidence: `tests/review-findings.test.ts:296-346`; covers direct fallback, unresolved router-shell rejection, and resolved upstream fallback.
- [x] T010 [REQ-005, K5] Extend the Anthropic TTL-order repair gate (`index.ts:8061-8066`) to also cover OpenAI-compatible endpoints with `cacheControlFormat: "anthropic"`
  Evidence: `index.ts:8128-8145`; native Anthropic and explicitly Anthropic-formatted OpenAI-compatible models enter the repair gate, while other OpenAI-compatible models do not.
- [x] T011 [REQ-005, K5] Change `downgradeAnthropicLongCacheControls` (`index.ts:1542-1551`) to downgrade only late invalid 1h controls on a visible conflict, keeping the all-breakpoint fallback for hidden conflicts
  Evidence: `index.ts:1544-1555,1569-1585`; the visible path passes `lateOnly=true`, while the learned hidden-conflict fallback keeps the all-breakpoint behavior.
- [x] T012 [REQ-005, K5] Test: repair fires for `cacheControlFormat: "anthropic"` endpoints, does not fire for a plain OpenAI-compatible endpoint without it
  Evidence: `tests/review-findings.test.ts:351-436`; also verifies late-only visible repair and all-breakpoint hidden fallback.

### Low Priority (evidence-gated — do not implement past what the evidence shows)

- [x] T013 [REQ-006, K6] Reconcile the K6/K8 priority-tier inconsistency between `research.md` and `findings-registry.json` found by the council
  Evidence: `research.md:26-45` now keeps K6=P2 and K8=P1; `ai-council/deep-ai-council-findings-registry.json:441-450` records the same values. Kept the canonical lineage-registry values because K8's duplicated ownership boundary can create immediate overlap/gaps, while K6 is masked by Pi-normalized usage and remains evidence-gated.
- [x] T014 [K6] Confirm via real provider contracts (not assumption) whether `getAnthropicRawUsage`/`getGeminiRawUsage` (`index.ts:2541`, `2567-2571`) returning `undefined` on absent cache fields is a genuine full-miss undercount; only change behavior if confirmed
  Evidence: Anthropic's official usage/pricing contract sums `input_tokens` with the two cache counters (https://docs.anthropic.com/en/docs/about-claude/pricing); Google's `UsageMetadata` contract separates `promptTokenCount` from `cachedContentTokenCount` (https://ai.google.dev/api/generate-content). Input-only responses therefore represent full misses; `index.ts:2535-2558,2564-2595` now counts them and still rejects records with no input count.
- [x] T015 [K8] Strengthen exhaustive equality tests between `index.ts`'s allowlist (`:1462-1465`) and `deep-pi/eligibility.ts`'s allowlist (`:11-12`) against the shared fixture — no runtime restructuring
  Evidence: `tests/ownership-composition.test.ts:84-120` extracts the optimizer predicate's literal ids, compares them with `DEEPPI_MODEL_IDS` and the shared fixture, then retains the runtime predicate/composition checks; `deep-pi` was not modified.
- [x] T016 [K9] Extend cache-write token display (`index.ts:3008`, gate `:4054`) to any adapter with a nonzero tracked value, not only claude
  Evidence: `index.ts:4092-4103` renders a tracked write volume without an adapter-specific gate; `tests/review-findings.test.ts:471-493` proves the OpenAI adapter displays it.
- [x] T017 [K11] Investigate and record Pi's real `before_agent_start` exception behavior; only if confirmed unsafe, add a narrow outer transform-chain fallback beyond the existing WORM flag (`:897`)
  Evidence: Pi's installed source map `node_modules/@earendil-works/pi-coding-agent/dist/core/extensions/runner.js.map:1076-1128` and compiled runner `:834-877` catch each handler exception, call `emitError`, and continue; no outer fallback is needed.
- [x] T018 [K4] Defer unless runtime evidence demonstrates a real failure or unsupported-caching report on the prompt-rewrite chain (`:650`, `:732`, `:815`); if deferred, record why in this task's own evidence line
  Evidence: Deferred as planned because no runtime evidence demonstrates a failure or unsupported-caching report on the prompt-rewrite chain; no opt-out was added.

### Minor (documentation-only — no code change)

- [x] T019 [K3] Reword the "zero cache-hit-rate value" claim in `CHANGES-FROM-UPSTREAM.md` and `research.md` — the extension still sets `PI_CACHE_RETENTION=long` (`index.ts:52-55`, `115`, `7898-7902`)
  Evidence: `CHANGES-FROM-UPSTREAM.md:52-56` and lineage `research.md:7,30` now distinguish no provider-side cache-hit contribution from the extension's retention, footer, and diagnostic behavior.
- [x] T020 [K7] Correct the "no provider-specific handling" framing — adapters already exist (`index.ts:3064-3200`) as thin wrappers
  Evidence: `CHANGES-FROM-UPSTREAM.md:55` and lineage `research.md:42` state that adapters exist as thin generic-normalizer wrappers, with no specialized per-provider optimization.
- [x] T021 [K10] Relabel the footer hit-rate metric to "requests with any cache hit"
  Evidence: `CHANGES-FROM-UPSTREAM.md:56` and lineage `research.md:46` label the binary request ratio as "requests with any cache hit" and distinguish it from token coverage.
- [x] T022 [K12] Confirm `message_end.errorMessage` as the correct existing signal for 400-detail needs; no host-contract workaround
  Evidence: installed Pi types expose only `status` and `headers` on `after_provider_response` (`dist/core/extensions/types.d.ts:518-522`) but pass the full `AgentMessage` through `message_end` (`:573-576`); the existing `index.ts:8265-8271` errorMessage path is therefore the supported signal.
- [x] T023 [K13] No standalone schema modernization; touch only if T004/T005 need a new key
  Evidence: T005's `supportsPromptCacheKey` is an open `models.json` compat field resolved by the existing generic precedence path (`index.ts:246-264,5738-5797`); the separate persisted footer schema remains intentionally unchanged, as recorded in lineage `research.md:54`.
- [x] T024 [K14] Explicit no-op: keep manual vendored-fork drift review
  Evidence: Existing practice remains the documented manual `diff -rq` comparison in `CHANGES-FROM-UPSTREAM.md:45`; no automation was required or added.
- [x] T025 [K15] Explicit deferral: no Gemini-transport fix until a Gemini model is enabled in `.pi/settings.json`
  Evidence: Deferred as planned because `.pi/settings.json:14-25` enables no Gemini model; no Gemini transport code was changed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T026 [REQ-003] Re-run `npm test` / `npm run typecheck` in `pi-cache-optimizer` after each priority group closes; re-confirm `deep-pi`'s suite unaffected
  Evidence: group gates were clean after High (41 tests/9 suites), Medium (45 tests/11 suites), Low (50 tests/13 suites), and Minor/final (50 tests/13 suites); every `npm run typecheck` exited 0. Final cross-fork check: `deep-pi` passed 81 tests across 11 files and typecheck exited 0.
- [x] T027 `validate.sh --recursive --strict` on the whole `039` packet after Phase 4 closes
  Evidence: Final `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/hooks/008-pi-caching-like-reasonix --recursive --strict` exits 0.
- [x] T028 Scoped `git status --porcelain` sweep confirming only the intended files changed
  Evidence: Direct git commands were prohibited, so no status command was run; a scoped filesystem inventory confirmed only the intended source, test, research, changelog, council, and packet artifacts changed, with no task-created temporary output and no `deep-pi` edits.
- [x] T029 Standards-alignment pass on the new/modified `index.ts` regions and the 3 modified test files against sk-code's opencode TypeScript conventions (comments/structure only, no behavior change)
  Evidence: 3 WHY-comments added (`index.ts:2549, 2592, 2750`) clarifying full-miss accounting and explicit-rejection filtering; everything else (TSDoc convention, virtual-router fallback rationale, `lateOnly` rationale, section structure, import order, `any` usage at the Pi/Jiti boundary) already matched existing precedent. Re-verified directly: all 3 added comments confirmed at their cited lines; `npm test` 50/50 and `npm run typecheck` exit 0 held both before and after.
- [x] T030 Manual end-to-end scenario testing for K1/K2/K5: drive the real registered hooks (not test-runner mocks) through realistic multi-turn sequences, capture pass/fail evidence
  Evidence: 9 scenarios run (K1 self-heal x4, K2 adapter fallback x2, K5 TTL-repair gate x3); found and fixed a real asymmetry — the K5 hidden-conflict recording gate at `message_end` (`index.ts:~8282`) still checked `isAnthropicMessagesApi` only, so an Anthropic-formatted OpenAI-compatible endpoint (the exact type T010 added coverage for) could record a visible-conflict repair but could never reach the hidden-conflict fallback. Fixed by mirroring `before_provider_request`'s eligibility OR-condition into the recording gate (`index.ts:8285-8289`); added a negative-control-verified regression test (`tests/review-findings.test.ts`, "records an Anthropic-format OpenAI-compatible endpoint's TTL-order error for the hidden-conflict fallback" — confirmed to fail without the fix, pass with it). Final: 51 tests/13 suites, typecheck exit 0, all 9 manual scenarios pass.
- [x] T031 Documentation sync: `CHANGES-FROM-UPSTREAM.md` and `tests/README.md` updated to describe the new K1/K2/K5/K6/K9 capabilities and test coverage, plus the T030 asymmetry fix
  Evidence: `CHANGES-FROM-UPSTREAM.md` gained a "Non-DeepSeek Path Hardening (2026-08-09)" section and an updated VERIFICATION count (51 tests/13 suites, manual scenario summary); `tests/README.md`'s 3 file-description rows now mention the K1/K2/K5 scenario and negative-control coverage.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` or explicitly deferred with a cited reason (T018, T025 are expected deferrals, not failures)
- [x] No `[B]` blocked tasks remaining
- [x] `npm test` / `npm run typecheck` clean; `validate.sh --recursive --strict` passing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source research**: `../011-research-non-deepseek-optimization/research/lineages/deepseek-flash/research.md`
- **Council adjudication**: `../011-research-non-deepseek-optimization/ai-council/seats/round-001/seat-001-seat-001.md`, `round-002/seat-001-seat-001.md`
<!-- /ANCHOR:cross-refs -->
