# Deep Research Strategy - Session Tracking

## 2. TOPIC
Sweep the repo-wide manual-testing-playbooks (~41 files) and feature-catalogs (~1500 files) for snippets and entries now STALE against the changed injection-bloat behavior, committed at 2af2feb113:
- Delivery confirmation now requires an observed receipt with `lifecycleEpoch >= 1` (epoch 0 never confirms) across the policy sink, the generic delivery state, the activation-matrix evidence, and `gate3DeliveryConfirmed`.
- Gate-3 delivery observers fire strictly POST-EMISSION on the four stdout-write adapters (claude/codex/cursor/devin); the Pi and return-based hooks observe as the final pre-return step.
- The shadow-delivery state machine keeps EVERY candidate flag OFF and emits byte-identical baseline output; `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION` is default-off, fail-open.
- New/updated exports in `spec-gate-core.mjs`: `observeGate3QuestionDelivery`, `buildGate3ObservedReceipt`, `currentGate3LifecycleEpoch`, `shouldSuppressGate3Delivery`.

FINDINGS ONLY — do not modify any playbook or catalog file; a later pass implements verified fixes.

## 3. KEY QUESTIONS (remaining)
- [x] Q1: Which manual-testing-playbook snippets assert behavior contradicted by the epoch>=1 receipt floor, post-emission observers, or the flags-off shadow delivery?
- [x] Q2: Which feature-catalog entries describe the changed surfaces inaccurately or omit now load-bearing behavior?
- [x] Q3: Which matched docs are authoritative test contracts versus illustrative examples that need no change?
- [x] Q4: Which stale snippets document deliberately-frozen shadow behavior that is CORRECT and must NOT be flagged?
- [x] Q5: What is the must-fix vs optional split for the follow-on implementation pass?

## 4. NON-GOALS
- Do NOT propose changing the frozen shadow-delivery or Gate-3 code behavior; snippets documenting deliberately-frozen behavior are CORRECT.
- Do NOT modify any playbook or catalog file.
- Do NOT run the resolveArtifactRoot node command; artifact_dir is bound directly to the override.
- Do not touch any path outside the lineage artifact dir `.opencode/specs/hooks/002-injection-bloat-reduction/009-testing-doc-alignment/research/lineages/deepseek-go`.

## 5. STOP CONDITIONS
- maxIterations (10) reached. Convergence before that is telemetry only; broaden review angles instead of synthesizing early.

## 6. ANSWERED QUESTIONS
- Q1 (stale playbook snippets): Exactly one — `spec-mutation-gate-enforce.md:57-63` asserts core-suite `# tests 67`; the suite runs 87 (verified twice, 87/87). All other matched playbooks (cursor CU-013/014/020, codex-hook-parity, devin DV-009/DV-021, pi PI-014/PI-016, claude CL-001, NC-010) are accurate for the changed contract.
- Q2 (stale catalog entries): None inaccurate. Two omission classes: (A) changed-surface catalogs (`cursor-hooks-and-spec-gate.md`, `claude-hook.md`) omit post-emission observers / epoch>=1 floor / `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION`; (B) `feature-flag-reference/` catalog + playbook layers have zero spec-gate env coverage.
- Q3 (authoritative vs illustrative): authoritative = spec-mutation-gate-enforce, codex-hook-parity, CL-001, NC-010, cursor hook scenarios; illustrative/benign = "skip Gate 3" dispatch prompts, SKGIT advisory suppression, advisor-probe-battery, DV-009/DV-021, PI-014/PI-016.
- Q4 (frozen-behavior): no snippet documents frozen behavior incorrectly; zero flags against frozen behavior.
- Q5 (must-fix vs optional): 1 P1 must-fix (test-count drift + hermetic env on step 2); 4 P2 optional catalog items; 1 out-of-scope pre-existing WS4 import drift.

## 7. WHAT WORKED
- Restricting the sweep to the two surface types (playbooks + live feature-catalogs) kept the ~1500-file surface tractable.
- Running the actual suites under `env -u` reproduced the count reality and the child-env neutrality gap.
- Line-level verification of all five adapters proved observer timing without ambiguity.
- Reading the sibling luna lineage's synthesized research.md enabled clean complementary reconciliation.

## 8. WHAT FAILED
- The first whole-repo grep matched thousands of spec/review files; narrowing to `find .opencode -name manual-testing-playbook.md` + feature-catalog paths was required.
- The ambient fan-out child env (`AI_SESSION_CHILD=1`, `MK_SPEC_GATE_ENFORCE=0`, `MK_SPEC_GATE_DISABLED=1`) caused the core suite to 0-pass until neutralized — itself the proof for the step-2 hermetic-gap finding.

## 9. EXHAUSTED APPROACHES (do not retry)
- Direct term grep for the changed vocabulary across all of `.opencode` (too broad; must scope to surface types).

## 10. RULED OUT DIRECTIONS
- Ruled out every playbook/catalog contradiction claim (none asserted the old contract).
- Ruled out CU-014 dormant-adapter, codex-hook-parity envelopes, NC-010 shadow-delta sink, WS4 import drift as change-derived.

## 11. NEXT FOCUS
COMPLETE — all 10 iterations run (max-iterations stop policy). Synthesis in research.md: 1 P1 must-fix (playbook test-count 67→87 + hermetic env), 4 P2 optional catalog items, 0 P0. Playbook/catalog surfaces otherwise aligned; no doc asserted the old contract.

## 12. KNOWN CONTEXT
- Changed behavior to check documents against (committed at 2af2feb113): epoch>=1 observed-receipt floor across policy sink + generic delivery state + activation-matrix evidence + gate3DeliveryConfirmed; Gate-3 observers post-emission on stdout-write adapters (claude/codex/cursor/devin), final-pre-return for Pi and return-based hooks; shadow-delivery flags ALL OFF, byte-identical baseline, MK_SPEC_GATE_3_DELIVERY_SUPPRESSION default-off fail-open.
- Changed exports in spec-gate-core.mjs: observeGate3QuestionDelivery, buildGate3ObservedReceipt, currentGate3LifecycleEpoch, shouldSuppressGate3Delivery (plus advanceGate3LifecycleEpoch, clearGate3SessionDelivery, resetGate3DeliveryShadow, getGate3ShadowReceipts).
- Surface counts: ~41 manual-testing-playbook.md files, ~1498 feature-catalog files (many under z_archive / specs / review lineages — exclude those).
- grep hits on the live surface (playbooks): cli-codex, cli-cursor (hooks: CU-014, CU-020, confirmed-fires, task-dispatch-guard), cli-opencode (memory_health test, Gate-3 skip reference only).
- grep hits on live feature-catalogs: cli-external-orchestration (cli-dispatch-authorization, cursor-hooks-and-spec-gate, feature-catalog.md), sk-git (launch-wrapper-session-isolation), system-spec-kit governance (session-resume-caller-binding-and-unicode-sanitization).
- Bounded Context Snapshot: source pointers = spec-gate-core.mjs, the five spec-gate-classify adapters (claude/codex/cursor/devin/pi), mk-spec-gate.js, mk-skill-advisor.js, policy-plan.ts, render.ts, activation-matrix-evidence.mjs. Playbook surface = .opencode/skills/*/manual-testing-playbook/manual-testing-playbook.md. Catalog surface = .opencode/skills/*/feature-catalog/**.md.
- resource-map.md not present; skipping coverage gate.

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05 (telemetry only; max-iterations stop policy governs)
- Per-iteration budget: 12 tool calls
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output
- Lineage sessionId: fanout-deepseek-go-1786120169844-ep05xl
- Current generation: 1
- Started: 2026-08-07T18:35:00Z
