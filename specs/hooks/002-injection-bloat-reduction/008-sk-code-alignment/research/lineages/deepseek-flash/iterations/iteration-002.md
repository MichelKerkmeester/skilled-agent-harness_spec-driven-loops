# Iteration 2: README freshness — in-directory and adjacent READMEs vs the changed delivery/observer contract

## Focus

Determine which READMEs in the changed directories (and adjacent READMEs that describe the delivery/observer contract) are stale against the three changed behaviors: (1) delivery confirmation requires an observed receipt with `lifecycleEpoch >= 1` (epoch 0 never confirms), (2) Gate-3 delivery observers fire strictly post-emission on the stdout-write adapters while return-based hooks observe as the final pre-return step, (3) the shadow-delivery state machine keeps every candidate flag OFF and emits byte-identical baseline output.

## Findings

### F9 — Key finding: no README documents the delivery-confirmation / epoch / observer contract at all

Exhaustive grep across `.opencode/skills` (all `*.md`, excluding dist/database/changelog) for `lifecycleEpoch`, `delivery confirmation`, `observed receipt`, `post-emission`, `delivery state`, `SUPPRESSED_SAME`, `GATE_3_DELIVERY_SUPPRESSION`, `observeGate3QuestionDelivery`, `observeEmittedAdvisorPolicy`, `recordObservedPolicyDelivery` returned **zero matches** in READMEs. The epoch>=1 receipt floor, the post-emission/pre-return observer timing, and the byte-identical shadow-delivery guarantee are documented ONLY in code comments and spec-packet docs (`007-guardrail-controls-and-activation/risk-register.md`, phase `implementation-summary.md` files), never in a README an operator would read.

Consequence: **no in-directory README statement is directly contradicted** because none described the confirmation semantics in the first place. The staleness is one of omission and inventory drift, not of a false claim. This is the dominant README-freshness finding.

### F10 — `lib/README.md` directory trees omit `policy-plan.ts`, the module this commit made load-bearing

- `.opencode/skills/system-skill-advisor/mcp-server/lib/README.md:58-79` (Package Topology) and `:101-122` (Directory Tree) enumerate the flat modules: `advisor-runtime-values.ts`, `prompt-policy.ts`, `render.ts`, `subprocess.ts` (tree 1) and `advisor-runtime-values.ts`, `affordance-normalizer.ts`, `error-diagnostics.ts`, `freshness.ts`, `generation.ts`, `metrics.ts`, `normalize-adapter-output.ts`, `prompt-cache.ts`, `prompt-policy.ts`, `render.ts`, `skill-advisor-brief.ts`, `source-cache.ts`, `subprocess.ts` (tree 2). **`policy-plan.ts` is absent from both.**
- `policy-plan.ts` carries the `DeliveryStateMachine`, the epoch-floored `isObservedDeliveryReceipt` predicate, and the policy-observation sink — the exact code this commit modified (`+210` lines). The README's inventory claim ("the directory tree enumerates the flat modules") is now inaccurate: it omits a load-bearing module a reader would need to find the delivery-confirmation contract.
- Also `:23` and the `shadow/` topology line `:71` describe `shadow/` only as "Shadow-mode telemetry helpers" / the shadow-**delta** sink (`SPECKIT_ADVISOR_SHADOW_DELTA`). The shadow-**delivery** state machine lives in `policy-plan.ts` (flat, not in `shadow/`), so a reader following the README's `shadow/` pointer would not find the delivery machine.

### F11 — `lib/spec-gate/README.md` ENTRYPOINTS omits the delivery-observation API and the suppression env var

- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/README.md:23-29` "ENTRYPOINTS" lists only `classifyIntent`, `evaluateMutation`, `isChildSession`, `resolveGuardPaths`/`appendWarningLog`, `sweepStaleGateStates`. It omits the functions this commit's behavior depends on: `observeGate3QuestionDelivery`, `shouldSuppressGate3Delivery`, `buildGate3ObservedReceipt`, `currentGate3LifecycleEpoch`, `advanceGate3LifecycleEpoch`, `gate3DeliveryConfirmed`.
- The README documents `MK_SPEC_GATE_ENFORCE` (line 26) but not `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION` (the observer's load-bearing flag) or `MK_SPEC_GATE_DISABLED`. An operator reading this README would not know the Gate-3 observer exists or that suppression is env-gated.

### F12 — `ENV-REFERENCE.md` has no spec-gate section at all

- `.opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md` (799 lines) documents env vars across 17 sections but grep for `MK_SPEC_GATE|spec-gate|SPEC_GATE|GATE_3_DELIVERY|DELIVERY_SUPPRESSION` returns **zero** rows. `MK_SPEC_GATE_ENFORCE`, `MK_SPEC_GATE_DISABLED`, `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION`, and `AI_SESSION_CHILD` are load-bearing gate envs, yet the authoritative env reference omits them all. The reader who relies on `ENV-REFERENCE.md` for runtime controls cannot discover the delivery-suppression switch that gates the post-emission observer.

### F13 — Per-runtime spec-gate READMEs (claude/codex/cursor/devin/pi) describe the hooks without the observer timing

- `hooks/claude/README.md:65`, `hooks/codex/README.md:40`, `hooks/devin/README.md:50`, `hooks/pi/README.md` describe `spec-gate-classify` as "surfaces the bounded Gate-3 question as additionalContext / appends the question" — true but incomplete: none mention that the adapter now records a post-emission observed receipt (`observeGate3QuestionDelivery` in the `stdout.write` callback for the four stdout adapters, and pre-return for Pi). `hooks/cursor/README.md:64` still correctly marks `beforeSubmitPrompt` delivery as unconfirmed. None of these statements are false; they are under-specified for the new observer behavior. (Optional improvement, not a contradiction.)

### F14 — Adjacent contract READMEs that describe injection channels are NOT contradicted

- `.opencode/hooks/injection-contract.md:69-83` documents the Gate-3 question channel per runtime (Claude/Cursor/Devin/Codex `[SYS]`, OpenCode plugin, Pi `[MSG]`). It does not describe confirmation/epoch semantics, so it is accurate as far as it goes; it simply does not cover the delivery-observation contract (no change needed for correctness).
- `.opencode/skills/system-skill-advisor/hooks/skill-advisor-hook.md` runtime matrix + `.opencode/plugins/README.md` inventory describe delivery channels and plugin responsibilities, not the confirmation contract — accurate, not contradicted.
- `.opencode/skills/system-skill-advisor/mcp-server/README.md:26,153` and `lib/shadow/README.md` describe the shadow-**delta** sink; accurate for that concept, and the naming overlap with the shadow-**delivery** machine is a terminology hazard worth a cross-reference note (optional).

## Sources Consulted

- [SOURCE: grep across .opencode/skills/*.md for delivery/epoch/observer terms — zero README matches]
- [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/README.md:58-79, 101-122]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/README.md:23-29]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md (grep MK_SPEC_GATE → no rows)]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/{claude,codex,cursor,devin,pi}/README.md]
- [SOURCE: .opencode/hooks/injection-contract.md:69-83]
- [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/risk-register.md:14-15]

## Assessment

newInfoRatio: 0.6
noveltyJustification: F9 (no README documents the contract — silence is the finding) is new and sharpens the freshness picture; F10-F12 (inventory/ENV omissions) are new concrete README findings. F13-F14 confirm prior READMEs are under-specified rather than false.

Key questions answered: Q2, Q3 (README freshness — see verdict below). Q4 (must-fix split) and Q5 remain.

## Reflection

What worked: exhaustive term-based grep (grep tool, not bash) gave clean evidence that the delivery contract exists nowhere in READMEs; per-file tree reads produced exact omitted-file statements.

What failed / ruled out: Ruled out "README X contradicts behavior Y" — no README makes a confirmable false statement about the epoch/observer contract. Ruled out treating `injection-contract.md` as stale — its channel statements remain true.

## Recommended Next Focus

Iteration 3: Broaden review angle — verify the must-fix vs optional split by checking the alignment-drift verifier expectations (`verify_alignment_drift.py` language/header rules) against the changed files, and confirm whether `ENV-REFERENCE.md` omission is covered elsewhere (manual-testing-playbook, skill-advisor-hook.md control-flag table) so the follow-on pass has an authoritative target. Also verify whether the `hooks/claude/README.md` (skill-advisor) "Code files | 1" count is still accurate given `user-prompt-submit.ts` is the only code file (yes) and confirm no other in-directory README count drifted.
