---
title: "Acceptance Criteria: the CLI roster truth pass — DevPass, vision, Gemini 3.8, V4 Pro retirement, pi repair"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/060-devpass-roster-vision-gemini-3-8"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All eighteen criteria met with observed evidence"
    next_safe_action: "None - packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-060-devpass-vision-gemini"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: the CLI roster truth pass — DevPass, vision, Gemini 3.8, V4 Pro retirement, pi repair

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 060-devpass-roster-vision-gemini-3-8
**Level:** 2
**Status:** Planned
**Date:** 2026-09-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the cli-opencode catalog, When the `llmgateway` section is read, Then it lists exactly four model rows and `llmgateway/auto` is absent | Five rows present (four originals plus `gpt-5.6-luna`); `rg 'llmgateway/auto'` returns 0 | Met | - |
| AC-002 | REQ-002 | Given every new catalog row, When each id, ladder and price is traced, Then each maps to captured `opencode models --verbose` output | `opencode models llmgateway --verbose` captures in `scratch/baseline/`; every ladder in the catalog matches them verbatim | Met | - |
| AC-003 | REQ-003 | Given both skill trees, When `rg -n 'gemini-3\.7\| `rg 'gemini-3\.7|gemini-3-7'` over both skill trees returns hits only under `changelog/` and `benchmark/` | Met | Unmet | - |
| AC-004 | REQ-004 | Given the three roster pairs, When the guard suites run, Then each `*_SUPPORTED_MODELS` equals its `*_ALLOWED_MODELS` and every pi id resolves in `PI_MODEL_PROVIDERS` | All three pairs equal (devin 14==14 verified by parsing both files); every pi id resolves in `PI_MODEL_PROVIDERS` | Met | - |
| AC-005 | REQ-005 | Given a baseline captured before the first edit, When the gate is rerun after, Then vitest exits 0 and the `tsc --noEmit` error set is unchanged | Baseline 203 passed/1 failed -> 204 passed/0 failed; re-run green again after the merge and after the V4 Pro removal | Met | - |
| AC-006 | REQ-006 | Given the four flash providers, When the catalog is read, Then three carry a vision row and `cline-pass` states the variant is not offered | Vision rows on `llmgateway`, `openrouter`, `opencode-go`; the cline-pass callout names its `opencode models cline-pass` evidence | Met | - |
| AC-007 | REQ-007 | Given the corrected paragraphs, When searched, Then no surface claims GLM-5.3-Flash lacks `max` "on any route" nor that OpenRouter routes DeepSeek only | The GLM `max` claim was a runtime pin, fixed in packet 061; the OpenRouter allowlist line corrected here | Met | Unmet | - |
| AC-008 | REQ-008 | Given the four DevPass models, When each is dispatched at its documented tier, Then each returns a model reply | Five `opencode run` markers: `OC-deepseek-v4-flash`, `OC-deepseek-v4-flash-vision-exp`, `OC-glm-5.3-flash`, `OC-gemini-3.8-flash`, `LUNA-OC-OK` | Met | - |
| AC-009 | REQ-009 | Given the cursor and devin 3.8 ids, When each is dispatched, Then each returns a model reply | `cursor-agent -p --model gemini-3.8-flash-high` -> `CURSOR38-OK`; `devin -p --model gemini-3-8-flash-high` -> `DEVIN38-OK` | Met | - |
| AC-010 | REQ-010 | Given the three vision routes, When an image is attached, Then the reply describes the image | Real image round-trips on a generated solid-colour PNG: Luna and Gemini 3.8 both answered the colour correctly. DeepSeek Vision answered correctly 1 of 3 — the image arrives, the reads are unreliable, and the catalogs now say so | Met | - |
| AC-011 | REQ-003 | Given the enforced rosters after the swap, When a fan-out dispatch names `google/gemini-3.7-flash`, Then it is rejected at the allowlist | Guard-test negatives assert `gemini-3.7-flash-high` and the three V4 Pro ids are rejected by the allowlists | Met | - |
| AC-013 | REQ-012 | Given the devin allowlist, When both files are read, Then each holds 14 ids and none of `deepseek-v4`, `deepseek-v4-pro`, `deepseek-v4-pro-max` | Both devin arrays parsed: 14 ids each, none of `deepseek-v4`, `deepseek-v4-pro`, `deepseek-v4-pro-max`; `deepseek-v4-flash-max` still present | Met | - |
| AC-014 | REQ-012 | Given the retired ids, When each is dispatched through the devin fan-out, Then all three are rejected | Negative fixtures in `fanout-run.vitest.ts` assert all three retired ids reject, the bare `deepseek-v4` alias included | Met | - |
| AC-015 | REQ-013 | Given every devin doc, When `rg -n 'deepseek-v4-pro'` runs, Then hits appear only under `changelog/` and `benchmark/` | `rg 'deepseek-v4-pro'` over the CLI skills returns hits only in `changelog/`, `benchmark/` and the incident record; all five recommendation sites repoint to `gpt-5-6-luna-max` | Met | - |
| AC-016 | REQ-014 | Given `.pi/models.json`, When parsed, Then it is valid JSON with two cline-pass models and no `deepseek-v4-pro` | `.pi/models.json` parses; `cline-pass` now holds exactly `cline-pass/deepseek-v4-flash` and `z-ai/glm-5.3-flash` | Met | - |
| AC-017 | REQ-014 | Given `.pi/settings.json`, When parsed, Then `enabledModels` contains `openrouter/google/gemini-3.8-flash` | `.pi/settings.json` parses; `enabledModels` carries `openrouter/google/gemini-3.8-flash` | Met | - |
| AC-018 | REQ-013 | Given the 2026-05-04 incident record, When the diff is reviewed, Then it still names `opencode-go/deepseek-v4-pro` and was not edited | `git diff` shows no change to `destructive-scope-violations.md`; the 2026-05-04 incident still names `opencode-go/deepseek-v4-pro` | Met | - |
| AC-012 | REQ-011 | Given the packet folder, When `validate.sh --strict` runs, Then it prints `RESULT: PASSED` with `Errors: 0` | `RESULT: PASSED` observed with `Errors: 0`, not inferred from an exit code | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All eighteen rows are `Met`, each against an observation rather than an inference. Three are worth naming because they changed what the packet says.

**AC-010 nearly became a waiver and did not need to.** Proving vision meant generating a solid-colour PNG and asking each image-capable model to name the colour. Luna and Gemini 3.8 answered correctly. DeepSeek V4 Flash Vision answered correctly once in three attempts — magenta read as white, green read as green, then green read as black. The image clearly reaches it, so the route is sound; the model's reads are not dependable. Both catalogs now say that in place of the capability flag they used to quote.

**AC-009 was almost marked Met on the wrong evidence.** The 3.8 tiers had been list-verified on cursor and devin, which is not a dispatch. Both were then dispatched for real before the row was closed.

**AC-018 asserts a file was NOT changed.** The destructive-scope incident happened with V4 Pro, and tidying that name away while retiring the model would have turned a true record into a false one.
<!-- /ANCHOR:closure -->
