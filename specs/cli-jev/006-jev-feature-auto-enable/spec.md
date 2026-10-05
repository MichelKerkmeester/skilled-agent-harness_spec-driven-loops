---
title: "Feature Specification: Jev features on by default when a key is stored"
description: "Only the citation drift advisory asks Jev from a live path today. Three more features won a measured keep but still need a flag nobody sets. Turn all four on when a Jev credential is stored, give each an env off switch, and bring the env docs, the root README and changelog v4.0.0.3 up to date."
trigger_phrases:
  - "jev feature auto enable"
  - "jev features env switches"
  - "JEV_FEATURES"
  - "injection screen hook"
  - "jev auto grader"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Jev features on by default when a key is stored

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/085-jev-feature-improvement-research` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four Jev features have a measured keep verdict: the citation drift check (032), the injection screen (035, 84 against 68 of 90), the reviewer verdict fallback (025, 24 against 8 of 24) and the hallucination grader (024, 55 against 47 of 56). Only the citation drift check runs on its own, inside `validate_document.py`. The other three run only when someone passes a scorer flag, so a person with a stored Jev key gets none of their benefit. No env name turns them all off, the env template and the env reference name none of them, and the root README does not say what the classifier hub does today.

### Purpose
With a Jev credential stored, every proven feature runs in its live path without a flag. `JEV_FEATURES=0` turns them all off and one `JEV_FEATURE_<NAME>=0` turns one off. With no credential every path behaves exactly as it does today.
### Research Findings

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Two five-iteration lineages, Luna on cli-pi and DeepSeek on cli-devin, studied the three features without a clean keep. Full synthesis: `research/research.md`.

- **Spec-track narrowing (017):** inconclusive. The repeat stopped on margin with an interval spanning zero. Next: a pre-registered, powered holdout of real Gate 1 requests.
- **Routing clarify default (020):** more kill evidence than win evidence. The router clarifies 3 of 365 committed prompts, and always-none beats Jev on the old fixture. Next: measure the real clarify rate and log user picks in shadow.
- **Alignment folder suggestion (022):** anchored on session state. A distractor-state control flips the keep to a kill. Next: one masked-state ablation that retires the question or earns a real corpus.

None of the three joins the shared gate until it passes the proof standard in `research/research.md` section 3.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One shared switch and readiness helper in the cli-classifier hub that every live Jev path reads.
- The citation drift advisory reads the shared switch, and `SKDOC_CITE_DRIFT_CHECK=0` keeps working.
- The reviewer verdict fallback and the hallucination grader become the `auto` default of the model benchmark, asking the measured questions.
- A Claude Code PostToolUse hook screens WebFetch text with the measured injection question and flag line, advisory only.
- The env template, the env reference that `/doctor:env` reads, the hook flag template, the hub docs and the root README describe the switches and the current state.
- A sweep that removes every non-spec reference to a killed or unshipped Jev feature.
- An sk-code-opencode alignment check over the code this program created.
- A five-iteration deep research run per executor on the features without a keep: search narrowing (017), clarify default (020) and folder suggestion (022). Luna 6 max fast runs on cli-pi with the `openai` provider and DeepSeek V4.1 Flash max runs on cli-devin.
- Global changelog v4.0.0.3 gains the cli-classifier work, written per sk-create-changelog.

### Out of Scope
- Wiring search narrowing, clarify default or folder suggestion into a live path. None holds a clean keep, and the research decides what would prove one.
- Injection screening in runtimes other than Claude Code. Each runtime's hook surface differs, and the measured win is the same either way.
- Blocking a tool call on a Jev answer. Every live feature advises or scores and never stops work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-classifier/shared/scripts/jev-features.mjs` | Create | Switch resolution and the Jev readiness check |
| `.skilled/skills/cli-classifier/shared/scripts/tests/jev-features.test.mjs` | Create | Switch and readiness cases |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs`, `validate_document.py` | Modify | Read the shared switch |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs` | Modify | `auto` grader and the measured verdict question |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs`, `run-benchmark.cjs` | Modify | `jev` and `auto` D4 graders |
| `.skilled/commands/deep/model-benchmark.md` and its two workflow assets | Modify | Default grader `auto` |
| `.skilled/hooks/injection-screen/**` | Create | The WebFetch advisory hook, its library, tests and README |
| `.claude/settings.json` | Modify | Register the hook |
| `.env.example`, `.skilled/hooks/hook-flags.env.example`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.skilled/hooks/README.md` | Modify | Document the switches |
| `.skilled/skills/cli-classifier/**` docs, `README.md` | Modify | Current state of the hub and its features |
| `.skilled/changelog/` v4.0.0.3 entry | Modify | The cli-classifier release notes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With `jev` on PATH and `jev auth status` passing, each proven feature runs in its live path with no flag set. |
| REQ-002 | `JEV_FEATURES=0` stops every feature and `JEV_FEATURE_<NAME>=0` stops one, read from the environment and then from `hook-flags.env`. |
| REQ-003 | With no `jev`, or with auth failing, every changed path prints and scores exactly as before, and no Jev call is made. |
| REQ-004 | Each live call asks the question and options its keep verdict was measured with. |
| REQ-005 | No key is printed, logged or written, and every spawned `jev` gets no inherited stdin. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `.env.example`, `ENV-REFERENCE.md`, `hook-flags.env.example` and the hooks README name every switch, its default and its effect. |
| REQ-007 | No file outside `specs/` names a killed or unshipped Jev feature as available. |
| REQ-008 | The code this program created passes the sk-code-opencode alignment verifier. |
| REQ-009 | The root README states the classifier hub's current features, and changelog v4.0.0.3 records the work. |
| REQ-010 | The research run completes 5 iterations on each executor and ends in a `research.md` with a ranked next step per non-proven feature. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A stubbed `jev` that passes auth makes each of the four paths ask its measured question, and the same run with `JEV_FEATURES=0` logs no call.
- **SC-002**: Every suite the changed files belong to passes at or above its baseline count.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Typesafe's hosted classifier | A slow or failing host would slow a fetch or a benchmark | Each path has a wall budget and fails open to today's behavior |
| Risk | The hook adds latency to every WebFetch | Med | Two calls per section run in parallel, capped by section count and a time budget |
| Risk | A benchmark score shifts once D4 is graded | Low | The resolved grader and its reason are written into the report, and `--grader noop` restores the old score |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The injection hook finishes inside 20 seconds per fetch and gives up silently past that.
- **NFR-P02**: The readiness check spawns at most `jev --version` and `jev auth status`, both local reads.

### Security
- **NFR-S01**: The key never leaves Jev's own credential store through this code.
- **NFR-S02**: Fetched text goes only to the provider `JEV_PROVIDER` names, the same one the scorers use.

### Reliability
- **NFR-R01**: A Jev failure in any path leaves that path's output exactly as it is without Jev.
- **NFR-R02**: The hook never exits non-zero and never blocks a tool call.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty fetched text: the hook prints nothing and makes no call.
- Very long fetched text: the hook screens at most 12 sections of up to 60 lines each.
- Switch values: `0`, `false`, `no` and `off` turn a feature off. Unset or any other value leaves it on.

### Error Scenarios
- `jev` missing or auth failing: every feature is skipped silently.
- A call times out or exits non-zero: that answer counts as unmeasured, never as a flag or a verdict.
- `hook-flags.env` unreadable: the environment alone decides.

### State Transitions
- An explicit `--grader` value always wins over `auto`.
- `SKDOC_CITE_DRIFT_CHECK=0` keeps skipping the citation advisory as before.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | About 20 files across four skills, the hooks tree and root docs |
| Risk | 12/25 | New default behavior on a key, advisory only, fail-open |
| Research | 10/20 | One bounded research run on three features |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The operator chose the scope on 2026-10-04: wire the proven features, then research the rest.
<!-- /ANCHOR:questions -->

---
