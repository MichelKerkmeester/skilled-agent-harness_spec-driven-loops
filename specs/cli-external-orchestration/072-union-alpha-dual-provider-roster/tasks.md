---
title: "Tasks: Add Union Alpha to the cli-opencode and cli-pi rosters through opencode-go and OpenRouter"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "union alpha roster tasks"
  - "union alpha task breakdown"
  - "openrouter restore checklist"
  - "union alpha verification tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Add Union Alpha to the cli-opencode and cli-pi rosters through opencode-go and OpenRouter

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-read both live catalogs and record the `context`, `max-out`, `thinking` and `images` columns for each route. **Evidence 2026-09-17:** `pi --list-models` → `opencode-go union-alpha 262.1K 131.1K thinking:yes images:yes` and `openrouter stealth/union-alpha 262.1K 131.1K thinking:no images:yes`; `opencode models opencode-go` (28 ids) lists `opencode-go/union-alpha`, `opencode models openrouter` (369 ids) lists `openrouter/stealth/union-alpha`; the OpenRouter `/api/v1/models` entry gives `context_length 262144`, `pricing.prompt "0"`, `pricing.completion "0"`, and `supported_parameters` without any reasoning parameter. **Superseded 2026-09-18 on the re-read the plan's §5 requires before writing:** `opencode models opencode-go` is down to 27 ids with `union-alpha` gone, `opencode models openrouter` carries no `stealth/` entry at any id, and the OpenRouter `/api/v1/models` catalog of 446 ids has no `union` or `stealth` match. Only `pi --list-models` still prints both rows, from pi's builtin catalog rather than a live provider query — which is exactly why §5 says re-read before writing and not after
- [x] T002 Probe both routes with one real turn each. **Evidence 2026-09-17 — all four dispatched, all four returned the expected token `UNIONOK`:** `pi --model opencode-go/union-alpha` exit 0; `pi --model openrouter/stealth/union-alpha` exit 0; `opencode run --model opencode-go/union-alpha --format json` exit 0, `cost 0`; `opencode run --model openrouter/stealth/union-alpha --format json` exit 0, `cost 0`. The output text, not the exit code, is what classifies these, per the cli-pi rule that an exit code is never an availability signal. **The OpenRouter credential authorizes completions**, which settles the packet's main dependency risk. **Superseded 2026-09-18 — all four routes now fail, and the model rather than the wiring is why.** `pi --model openrouter/stealth/union-alpha` returns `404: {"message":"Thank you for participating in the Stealth Union Alpha testing period. This model was Unbiased's Pareto. Use it now: https://openrouter.ai/unbiased/pareto","code":404}`; `pi --model opencode-go/union-alpha` returns `400 {"type":"error","error":{"type":"api_error","message":"Error from provider (Console Go): Upstream request failed: Model is unavailable."}}`; both `opencode run` dispatches return `UnknownError` / `Unexpected server error`, the resolution signature for an id models.dev no longer carries. **Controls, same session, classified on output text:** `opencode run --model opencode-go/glm-5.3-flash --variant max` returned `UNIONOK` at exit 0 and `pi --model llmgateway/glm-5.3-flash --thinking max` returned `UNIONOK` at exit 0, so both clients, both credentials and the opencode-go gateway are serving. The stealth id was withdrawn between planning and implementation
- [x] T002a Probe the thinking claim, because it is the only asymmetry the roster would record. **Evidence 2026-09-17:** both routes accept `--thinking max` and `--thinking xhigh` without error, so flag acceptance is not a signal. Through `opencode run --thinking max`, neither Union Alpha route emitted a `reasoning` part; a control dispatch of `opencode-go/glm-5.3-flash` at the same tier emitted one of 48 characters. The `tokens.reasoning` counter read `0` for the control too, so that counter is not a usable instrument and the part-type check is. **Result: the opencode-go `thinking: yes` catalog column is contradicted by the only behavioral test run against it**. **Left unresolved 2026-09-18:** the route was withdrawn before a discriminator could settle it, so the contradiction is recorded rather than closed. The instrument lesson outlives the model — `tokens.reasoning` read `0` for a known-good control too, so only the `reasoning` part type discriminates
- [x] T003 [P] Confirm which working-tree files belong to other in-flight work, so none is swept into this packet's commit. **Evidence 2026-09-18:** `git status --porcelain --untracked-files=no` is empty, so no tracked file was modified by anything in flight; all 21 untracked entries sit under `specs/cli-external-orchestration/071-cli-hermes-creation/` and `specs/sk-communication/006-sk-communication-clarity/` and belong to other packets. Staging by explicit path keeps them out
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> **All blocked 2026-09-18 — not deferred, and not partially done.** Every task below writes a roster row, a provider section, a count or a picker entry for a model that no longer answers on any of its four routes (T001/T002). Not one byte was written to `.skilled/skills/cli-external-orchestration/` or to `.pi/settings.json`. Shipping them would add four dispatch permissions to two closed rosters for a dead id, and would reverse packet 068's OpenRouter retirement to carry zero working models. These unblock only if an operator adopts a successor, at which point the ids, the pricing and the thinking column all change and the rows must be re-derived rather than renamed.

- [B] T004 Add the opencode-go Union Alpha row with the bare id `union-alpha`, its measured figures, its thinking tier and the direct-dispatch-only note (`cli-pi/references/providers-and-models.md`)
- [B] T005 Restore the `### openrouter` section with `stealth/union-alpha` as its only model, stating that the route carries no thinking tier and that it is free at $0 in and $0 out (`cli-pi/references/providers-and-models.md`)
- [B] T006 Rewrite the "OpenRouter is off this roster, and deliberately still in the fan-out" paragraph so it states the post-change truth: one roster model, and the two fan-out literals unchanged (`cli-pi/references/providers-and-models.md`)
- [B] T007 Correct the "six authenticated providers" claim in the same file (`cli-pi/references/providers-and-models.md`)
- [B] T008 [P] Add the matching opencode-go row and `### openrouter` section (`cli-opencode/references/providers-and-models.md`)
- [B] T009 [P] Change "Six providers are reachable" to seven and name `openrouter` in the provider list, adding no model ids (`cli-pi/SKILL.md`)
- [B] T010 [P] Make the same count and provider-list change (`cli-opencode/SKILL.md`)
- [B] T011 Add `opencode-go/union-alpha` and `openrouter/stealth/union-alpha` to `enabledModels`, leaving `defaultProvider` and `defaultModel` untouched, and re-parse the file as JSON before and after (`.pi/settings.json`)
- [B] T012 [P] Write the roster-change changelog entry and bump the mode frontmatter version (`cli-pi/changelog/v1.5.4.0.md`)
- [B] T013 [P] Write the roster-change changelog entry and bump the mode frontmatter version (`cli-opencode/changelog/v1.4.7.0.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> **T014-T020 verify rows that Phase 2 did not write, so they are blocked rather than passed.** Marking them `[x]` would be the reassuring-direction error this packet already caught once with the `tokens.reasoning` counter: a check that trivially passes over an empty change set has not verified anything. T021 and T022 apply to the documentation-only change that did ship and were run.

- [B] T014 Confirm every figure in all four new rows matches the T001 catalog output, column by column, rather than matching the other route's row
- [B] T015 Confirm no row claims a thinking tier that T002a did not demonstrate: the OpenRouter row states none, and the opencode-go row states the catalog claim and the contradicting observation together rather than picking one (REQ-003)
- [B] T016 Run `grep -rn "[Ss]ix providers\|six authenticated providers" .opencode/skills/cli-external-orchestration/cli-pi .opencode/skills/cli-external-orchestration/cli-opencode` and confirm every surviving hit is under `changelog/` (REQ-004)
- [B] T017 Confirm no surface still says OpenRouter is off the roster, and that the rewritten paragraph does not contradict the new section (REQ-005)
- [B] T018 Re-read `.pi/settings.json` after the edit: it parses, both entries are present, and `defaultProvider` and `defaultModel` are byte-identical to their pre-change values (REQ-006)
- [B] T019 Confirm all four rows cite the 2026-09-17 dispatch that verified them, and that none carries a listing-only hedge it no longer needs (REQ-009)
- [B] T020 Confirm the deep-loop fan-out is untouched: `PI_SUPPORTED_MODELS`, `PI_ALLOWED_MODELS` and `PI_MODEL_PROVIDERS` contain no `union-alpha` literal, and all four rows say the routes are direct-dispatch only (REQ-007)
- [x] T021 Run `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/072-union-alpha-dual-provider-roster --strict` and require an explicit `RESULT: PASSED`. **Evidence 2026-09-18, run through the `.skilled/` source root rather than the `.opencode/` compatibility path:** `RESULT: PASSED`, `Summary: Errors: 0  Warnings: 0`, exit 0. Baseline before any edit was `RESULT: PASSED` with Errors: 0 and Warnings: 1, so the change is a regression-free improvement on that count. Two intermediate runs are part of the record: the validator first refused to run at all (`validate.sh compiled validation orchestrator is stale`) until `npm run build` was run in `system-spec-kit/runtime`, and the first post-edit run returned `RESULT: FAILED` with 2 derived-metadata errors, cleared by the `repair-derived.cjs --apply` remedy the validator itself prints
- [x] T022 Inspect the scoped diff: only the seven files in the spec's Files to Change table are modified or created, and no unrelated working-tree file is staged. **Evidence 2026-09-18 — zero of those seven are touched, which is the point.** Four files changed, all inside this packet folder: `spec.md`, `tasks.md`, `implementation-summary.md` and the `graph-metadata.json` that `repair-derived.cjs` re-derived. `git status --porcelain .skilled/skills/cli-external-orchestration .pi/settings.json` is empty, so every roster surface and the pi picker config are byte-identical to their pre-packet state. A scan of the full diff for home-directory paths and credential patterns returned nothing, which this public repository requires
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` — **not met, and not closable on this model.** 17 of 23 are `[B]`
- [ ] No `[B]` blocked tasks remaining — **not met.** T004-T020 stay blocked on the upstream withdrawal recorded in T001/T002
- [ ] Manual verification passed — **partially.** T021 and T022 passed against what shipped; T014-T020 verify rows that were never written and cannot pass honestly
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
