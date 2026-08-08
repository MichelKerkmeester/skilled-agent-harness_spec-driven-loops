# Iteration 2: Verify the test-count drift and spot-check non-matched catalogs/playbooks

## Focus

Confirm the F2 spec-gate-core test-count drift against a real run, neutralize the ambient fan-out env leak that masks the suite, and spot-check the remaining matched catalog entries plus a sample of non-matched playbooks to ensure none assert the changed delivery contract.

## Findings

### F6 — CONFIRMED: `spec-mutation-gate-enforce.md` step-2 expected signal `# tests 67` is stale; the suite now runs 87

Real run, ambient env neutralized exactly as the playbook's own hermetic doctrine prescribes:

```text
$ env -u AI_SESSION_CHILD -u MK_SPEC_GATE_ENFORCE -u MK_SPEC_GATE_DISABLED \
    node --experimental-test-module-mocks --test \
    .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.test.mjs
ℹ tests 87
ℹ pass 87
ℹ fail 0
```

- The playbook asserts `Expected: # tests 67, # pass 67, # skipped 0, # fail 0` at `:57-63`. The shipped suite reports **87**. Commit `78ef96ae6b`'s message claimed "spec-gate-core 84/0"; the live file reports 87 (`rg -c "test("` → 88 call sites, 87 executed). Either way, **67 is wrong on all counts**.
- IMPORTANT NUANCE: in this fan-out child session the ambient env carries `AI_SESSION_CHILD=1`, `MK_SPEC_GATE_ENFORCE=0`, `MK_SPEC_GATE_DISABLED=1`, which drives the suite to 0-pass (every deny assertion flips to allow). The playbook's step-1 hermetic `env -u` pattern is correct; step-2's core-suite invocation does NOT neutralize these env vars, so in a child-dispatched run the step-2 command would also fail. This is a second, subtler staleness: the playbook should neutralize the same env vars on the step-2 core run (or document that the core suite requires an interactive env).
- `[SOURCE: spec-gate-core.test.mjs run — 87 pass / 0 fail under env -u; 0 pass under ambient AI_SESSION_CHILD=1]`
- `[SOURCE: .opencode/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md:57-63]`

### F7 — Non-matched system-spec-kit tooling playbooks contain no delivery-contract assertions

Sampled `.opencode/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/` (24 files) and the memory/governance subdirectories for the changed vocabulary (`deliver`, `observe`, `suppress`, `epoch`, `receipt`, `MK_SPEC_GATE`): the only hits are unrelated uses (`SPECKIT_*_DEV_ALLOW_STALE` dev overrides, Gate-3 classifier confusion-matrix prompts in `sk-code/.../advisor-probe-battery.md` P7/P8, Lenis IntersectionObserver). None assert delivery-confirmation, observer timing, or suppression semantics. The broad surface is clean.

### F8 — Matched catalog entries are all accurate for the changed contract

- `cli-external-orchestration/feature-catalog/feature-catalog.md:63-77` (§4 CURSOR HOOKS AND SPEC-GATE INTEGRATION): describes prebind/enforce/classify adapters and cursor delivery status ("prompt-submit and pre-compact delivery remain unconfirmed"). Accurate — the classify adapter's post-emission observer is dormant (F3).
- `cli-external-orchestration/feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md`: describes the Pi dispatch inspector and `shouldDenyPiDispatch`; its only gate reference (`:40`, "the injected advisor or spec-gate content") is about NOT letting injected directives authorize a dispatch — unrelated to the delivery contract, and still true.
- `sk-git/feature-catalog/session-lifecycle/launch-wrapper-session-isolation.md:29`: "A child session also has `MK_SPEC_GATE_ENFORCE=0` neutralized on its way in" — matches the real worktree-session.sh child-neutralization and the `AI_SESSION_CHILD` handling. Accurate and unchanged by this commit.
- `system-spec-kit/feature-catalog/governance/session-resume-caller-binding-and-unicode-sanitization.md`: describes NFKC/zero-width sanitization in `gate-3-classifier.ts` (classifier normalization, a different layer than delivery observation). Accurate.
- `sk-git/.../orchestrated-child-execs-in-place.md` (GIT-028) optional check (`:53`): "Confirm `MK_SPEC_GATE_ENFORCE=0` is exported before the in-place exec" — matches real behavior; the actual neutralization is set inside worktree-session.sh, not merely exported by the caller, but the scenario's intent (children never inherit an enforced gate) is correct.

### F9 — The delivery-observation API is absent from every catalog entry that inventories the spec-gate surface

The cursor-hooks-and-spec-gate catalog (`:53-55` source table) lists `spec-gate-prebind.mjs`, `spec-gate-enforce.mjs`, `spec-gate-classify.mjs` but not the post-emission observer call, `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION`, or the new core exports (`observeGate3QuestionDelivery`, `buildGate3ObservedReceipt`, `currentGate3LifecycleEpoch`, `shouldSuppressGate3Delivery`). The system-spec-kit feature-catalog has NO entry for the Gate-3 delivery-observation layer at all. This is omission-stale (the changed behavior is load-bearing and undocumented in the catalog layer), matching the README gap that phase 008 already partially fixed for READMEs — the catalog layer was not swept by that phase.

## Sources Consulted

- [SOURCE: live run spec-gate-core.test.mjs — 87/87 under env -u; 0-pass under ambient child env]
- [SOURCE: spec-mutation-gate-enforce.md:57-63; step-2 command at :60-61]
- [SOURCE: sample grep across system-spec-kit tooling-and-scripts + memory + governance playbooks]
- [SOURCE: cli-external-orchestration feature-catalog.md:63-77; cli-dispatch-authorization.md:40]
- [SOURCE: sk-git launch-wrapper-session-isolation.md:29; orchestrated-child-execs-in-place.md:53]
- [SOURCE: system-spec-kit feature-catalog governance/session-resume-caller-binding-and-unicode-sanitization.md]

## Assessment

newInfoRatio: 0.55
noveltyJustification: F6 confirms the count drift with a real neutralized run and surfaces the additional child-env staleness nuance; F7/F8 clear the sampled surface; F9 extends the delivery-API catalog gap. 

Key questions answered: Q1 (confirmed only one concrete stale playbook snippet), Q2 (catalog gap, no contradiction), Q3 (authoritative contract vs illustrative split).

## Reflection

What worked: running the actual suite with `env -u` reproduced both the playbook's hermetic doctrine and the count reality; the ambient child-env leak in this lineage itself proved the step-2 neutrality gap is real.

What failed / ruled out: Ruled out every matched catalog entry as a contradiction — all remain true for the changed contract. Ruled out the tooling-scripts playbook sample. The only stale playbook assertion found so far is the 67→87 count drift.

## Recommended Next Focus

Iteration 3: Verify whether the `spec-gate-core.test.mjs` count drift and child-env neutrality gap are the ONLY authoritative-contract staleness by checking the sk-code skill-advisor-integration playbook and the cli-codex hook-parity sub-playbooks (which exercise the classify adapter) for any epoch/observer assertions; then check whether any catalog entry for `advisor` delivery (policy sink, receipts) needs the epoch>=1 floor documented.
