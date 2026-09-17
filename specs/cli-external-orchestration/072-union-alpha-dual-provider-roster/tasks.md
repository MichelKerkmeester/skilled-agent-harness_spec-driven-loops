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

- [x] T001 Re-read both live catalogs and record the `context`, `max-out`, `thinking` and `images` columns for each route. **Evidence 2026-09-17:** `pi --list-models` → `opencode-go union-alpha 262.1K 131.1K thinking:yes images:yes` and `openrouter stealth/union-alpha 262.1K 131.1K thinking:no images:yes`; `opencode models opencode-go` (28 ids) lists `opencode-go/union-alpha`, `opencode models openrouter` (369 ids) lists `openrouter/stealth/union-alpha`; the OpenRouter `/api/v1/models` entry gives `context_length 262144`, `pricing.prompt "0"`, `pricing.completion "0"`, and `supported_parameters` without any reasoning parameter
- [x] T002 Probe both routes with one real turn each. **Evidence 2026-09-17 — all four dispatched, all four returned the expected token `UNIONOK`:** `pi --model opencode-go/union-alpha` exit 0; `pi --model openrouter/stealth/union-alpha` exit 0; `opencode run --model opencode-go/union-alpha --format json` exit 0, `cost 0`; `opencode run --model openrouter/stealth/union-alpha --format json` exit 0, `cost 0`. The output text, not the exit code, is what classifies these, per the cli-pi rule that an exit code is never an availability signal. **The OpenRouter credential authorizes completions**, which settles the packet's main dependency risk
- [x] T002a Probe the thinking claim, because it is the only asymmetry the roster would record. **Evidence 2026-09-17:** both routes accept `--thinking max` and `--thinking xhigh` without error, so flag acceptance is not a signal. Through `opencode run --thinking max`, neither Union Alpha route emitted a `reasoning` part; a control dispatch of `opencode-go/glm-5.3-flash` at the same tier emitted one of 48 characters. The `tokens.reasoning` counter read `0` for the control too, so that counter is not a usable instrument and the part-type check is. **Result: the opencode-go `thinking: yes` catalog column is contradicted by the only behavioral test run against it**
- [ ] T003 [P] Confirm which working-tree files belong to other in-flight work, so none is swept into this packet's commit
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the opencode-go Union Alpha row with the bare id `union-alpha`, its measured figures, its thinking tier and the direct-dispatch-only note (`cli-pi/references/providers-and-models.md`)
- [ ] T005 Restore the `### openrouter` section with `stealth/union-alpha` as its only model, stating that the route carries no thinking tier and that it is free at $0 in and $0 out (`cli-pi/references/providers-and-models.md`)
- [ ] T006 Rewrite the "OpenRouter is off this roster, and deliberately still in the fan-out" paragraph so it states the post-change truth: one roster model, and the two fan-out literals unchanged (`cli-pi/references/providers-and-models.md`)
- [ ] T007 Correct the "six authenticated providers" claim in the same file (`cli-pi/references/providers-and-models.md`)
- [ ] T008 [P] Add the matching opencode-go row and `### openrouter` section (`cli-opencode/references/providers-and-models.md`)
- [ ] T009 [P] Change "Six providers are reachable" to seven and name `openrouter` in the provider list, adding no model ids (`cli-pi/SKILL.md`)
- [ ] T010 [P] Make the same count and provider-list change (`cli-opencode/SKILL.md`)
- [ ] T011 Add `opencode-go/union-alpha` and `openrouter/stealth/union-alpha` to `enabledModels`, leaving `defaultProvider` and `defaultModel` untouched, and re-parse the file as JSON before and after (`.pi/settings.json`)
- [ ] T012 [P] Write the roster-change changelog entry and bump the mode frontmatter version (`cli-pi/changelog/v1.5.4.0.md`)
- [ ] T013 [P] Write the roster-change changelog entry and bump the mode frontmatter version (`cli-opencode/changelog/v1.4.7.0.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Confirm every figure in all four new rows matches the T001 catalog output, column by column, rather than matching the other route's row
- [ ] T015 Confirm no row claims a thinking tier that T002a did not demonstrate: the OpenRouter row states none, and the opencode-go row states the catalog claim and the contradicting observation together rather than picking one (REQ-003)
- [ ] T016 Run `grep -rn "[Ss]ix providers\|six authenticated providers" .opencode/skills/cli-external-orchestration/cli-pi .opencode/skills/cli-external-orchestration/cli-opencode` and confirm every surviving hit is under `changelog/` (REQ-004)
- [ ] T017 Confirm no surface still says OpenRouter is off the roster, and that the rewritten paragraph does not contradict the new section (REQ-005)
- [ ] T018 Re-read `.pi/settings.json` after the edit: it parses, both entries are present, and `defaultProvider` and `defaultModel` are byte-identical to their pre-change values (REQ-006)
- [ ] T019 Confirm all four rows cite the 2026-09-17 dispatch that verified them, and that none carries a listing-only hedge it no longer needs (REQ-009)
- [ ] T020 Confirm the deep-loop fan-out is untouched: `PI_SUPPORTED_MODELS`, `PI_ALLOWED_MODELS` and `PI_MODEL_PROVIDERS` contain no `union-alpha` literal, and all four rows say the routes are direct-dispatch only (REQ-007)
- [ ] T021 Run `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/072-union-alpha-dual-provider-roster --strict` and require an explicit `RESULT: PASSED`
- [ ] T022 Inspect the scoped diff: only the seven files in the spec's Files to Change table are modified or created, and no unrelated working-tree file is staged
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
