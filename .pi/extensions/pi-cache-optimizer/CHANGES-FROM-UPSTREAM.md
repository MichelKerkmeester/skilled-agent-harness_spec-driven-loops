# Changes from Upstream

> How this fork of `jiangge/pi-cache-optimizer` differs from upstream, what was verified, and where to read more.

---

## 1. OVERVIEW

This fork starts from `jiangge/pi-cache-optimizer` v2.8.0 and adds a narrow ownership boundary for DeepSeek-direct models. The patched fork commit is `5132d137ce28cb91ec12a5475832df4d5154085a`, and the copy at `.pi/extensions/pi-cache-optimizer/` is the runtime source used by Pi.

| Field | Value |
| --- | --- |
| Repository | `jiangge/pi-cache-optimizer` |
| Version | `v2.8.0` |
| Fork commit | `5132d137ce28cb91ec12a5475832df4d5154085a` |
| License | MIT, unchanged |

---

## 2. CHANGES FROM UPSTREAM

### Guard Patch

- Added `isDeepPiOwned(model)` in `index.ts`. It returns true only when `model.provider === "deepseek"` and `model.id` is exactly `"deepseek-v4-flash"` or `"deepseek-v4-pro"`.
- Kept the existing `isDeepSeekLikeModel` predicate unchanged. That predicate still performs its broader substring matching for proxy compatibility warnings.
- Added an early return using `isDeepPiOwned(model)` as the first statement in six model-specific hooks: `session_start`, `model_select`, `before_agent_start`, `before_provider_request`, `after_provider_response`, and `message_end`.
- Left `session_shutdown` unguarded because it performs global cleanup without model branching.
- Added one boundary test in `tests/review-findings.test.ts` for the new predicate.
- The fork patch changed `index.ts` by 11 added lines and `tests/review-findings.test.ts` by 9 added lines. It did not bump dependencies, remove features, or change behavior for non-DeepSeek-direct models.

### Later Test Coverage (2026-08-08)

- In a later work session on 2026-08-08 (adding test coverage for the sibling `deep-pi` fork's ownership boundary, not a further change to this fork's guard logic), changed the `package.json` test script from targeting one test file to running every `tests/*.test.ts` file under `node:test`, and added two new test files: `tests/ownership-composition.test.ts` (a combined-host test proving `deep-pi` and this fork never both react to the same model) and `tests/hook-guards.test.ts` (six tests exercising the six guarded hooks directly). The guard predicate and its six call sites were not modified.

### Rationale

`pi-cache-optimizer` previously ran unconditionally for DeepSeek's direct API. The sibling `deep-pi` extension now owns `deepseek/deepseek-v4-flash` and `deepseek/deepseek-v4-pro` exclusively, so this fork is a no-op for those two exact models and remains active for every other provider and model, including DeepSeek-family IDs on other providers such as `opencode/deepseek-v4-flash-free`.

---

## 3. VERIFICATION

- Ran a fresh `npm test` against the vendored copy immediately after the guard patch: 25 of 25 tests passed.
- Ran `tsc --noEmit` against the vendored copy: clean.
- A `diff -rq` comparison against the pinned fork commit reported zero differences before the later `package.json` test-runner configuration change.
- Current state (after the later test-file additions): `npm test` passes 34 tests across 8 suites; `tsc --noEmit` remains clean.
- Live Pi sessions confirmed that the guard fires only for the two exact DeepSeek-direct model IDs.
- A non-DeepSeek session incremented statistics normally.
- An `opencode/deepseek-v4-flash-free` session created a new statistics entry.
- A real `deepseek/deepseek-v4-flash` session created zero statistics entries.

---

## 4. RELATED RESOURCES

- [pi-cache-optimizer README](./README.md)
