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
    recent_action: "Authored the closure gate; all rows Unmet pending implementation"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-060-devpass-vision-gemini"
      parent_session_id: null
    completion_pct: 0
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
| AC-001 | REQ-001 | Given the cli-opencode catalog, When the `llmgateway` section is read, Then it lists exactly four model rows and `llmgateway/auto` is absent | Row count = 4; `rg -n 'llmgateway/auto' providers-and-models.md` returns 0 | Unmet | - |
| AC-002 | REQ-002 | Given every new catalog row, When each id, ladder and price is traced, Then each maps to captured `opencode models --verbose` output | `scratch/baseline/` holds the verbose capture; each row's ladder matches it verbatim | Unmet | - |
| AC-003 | REQ-003 | Given both skill trees, When `rg -n 'gemini-3\.7\|gemini-3-7'` runs, Then every remaining hit is under `changelog/` or `benchmark/` | grep output reviewed line by line, not just counted | Unmet | - |
| AC-004 | REQ-004 | Given the three roster pairs, When the guard suites run, Then each `*_SUPPORTED_MODELS` equals its `*_ALLOWED_MODELS` and every pi id resolves in `PI_MODEL_PROVIDERS` | `npx vitest run` roster-equality + provider-map assertions pass | Unmet | - |
| AC-005 | REQ-005 | Given a baseline captured before the first edit, When the gate is rerun after, Then vitest exits 0 and the `tsc --noEmit` error set is unchanged | Baseline and post-change outputs both saved; delta computed, not eyeballed | Unmet | - |
| AC-006 | REQ-006 | Given the four flash providers, When the catalog is read, Then three carry a vision row and `cline-pass` states the variant is not offered | Three rows present; the cline-pass callout names its `opencode models cline-pass` evidence | Unmet | - |
| AC-007 | REQ-007 | Given the corrected paragraphs, When searched, Then no surface claims GLM-5.3-Flash lacks `max` "on any route" nor that OpenRouter routes DeepSeek only | `rg -n 'no .max. variant on any route\|DeepSeek V4 Flash only'` returns 0 outside changelogs | Unmet | - |
| AC-008 | REQ-008 | Given the four DevPass models, When each is dispatched at its documented tier, Then each returns a model reply | Four `opencode run` transcripts in `scratch/evidence/`, each showing a non-empty assistant reply and exit 0 | Unmet | - |
| AC-009 | REQ-009 | Given the cursor and devin 3.8 ids, When each is dispatched, Then each returns a model reply | `cursor-agent -p` and `devin -p` transcripts saved | Unmet | - |
| AC-010 | REQ-010 | Given the three vision routes, When an image is attached, Then the reply describes the image | Three transcripts; a reply that ignores the image FAILS this row regardless of exit code | Unmet | - |
| AC-011 | REQ-003 | Given the enforced rosters after the swap, When a fan-out dispatch names `google/gemini-3.7-flash`, Then it is rejected at the allowlist | Negative-control transcript showing the rejection | Unmet | - |
| AC-013 | REQ-012 | Given the devin allowlist, When both files are read, Then each holds 14 ids and none of `deepseek-v4`, `deepseek-v4-pro`, `deepseek-v4-pro-max` | Id count asserted in both files; `deepseek-v4-flash-max` still present. The count is the check — a `-pro` grep alone would pass while the bare alias survived | Unmet | - |
| AC-014 | REQ-012 | Given the retired ids, When each is dispatched through the devin fan-out, Then all three are rejected | Three rejection transcripts, the bare `deepseek-v4` included | Unmet | - |
| AC-015 | REQ-013 | Given every devin doc, When `rg -n 'deepseek-v4-pro'` runs, Then hits appear only under `changelog/` and `benchmark/` | grep output reviewed; each of the 5 recommendation sites now names an allowlisted id | Unmet | - |
| AC-016 | REQ-014 | Given `.pi/models.json`, When parsed, Then it is valid JSON with two cline-pass models and no `deepseek-v4-pro` | `node -e JSON.parse` clean; `jq '.providers["cline-pass"].models[].id'` shows exactly the flash and GLM ids | Unmet | - |
| AC-017 | REQ-014 | Given `.pi/settings.json`, When parsed, Then `enabledModels` contains `openrouter/google/gemini-3.8-flash` | `node -e JSON.parse` clean; `jq` confirms the id | Unmet | - |
| AC-018 | REQ-013 | Given the 2026-05-04 incident record, When the diff is reviewed, Then it still names `opencode-go/deepseek-v4-pro` and was not edited | `git diff` shows no change to `destructive-scope-violations.md`; retiring a model must not falsify what it did | Unmet | - |
| AC-012 | REQ-011 | Given the packet folder, When `validate.sh --strict` runs, Then it prints `RESULT: PASSED` with `Errors: 0` | Explicit `RESULT: PASSED` line observed — an exit code alone does not satisfy this row, because a stale orchestrator exits 3 with no rule output | Unmet | - |

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

**Closeable:** No

All eighteen rows are `Unmet`: this packet is planning only, and no file outside
`specs/cli-external-orchestration/060-devpass-roster-vision-gemini-3-8/` has been
touched. The evidence already gathered — the DevPass credential, the four models'
ladders and prices, the per-provider vision availability, and the cursor/devin 3.8
tiers — sits in `spec.md` and in Phase 1 of `tasks.md` as **research findings**, not
as satisfied criteria. AC-010 is the row most likely to need a waiver: proving vision
needs an image file and a working attachment path, and a text-only reply must not be
allowed to pass as proof.

AC-013 and AC-018 are the two rows that most repay being written down. AC-013 asserts
an id **count**, not the absence of a substring, because `deepseek-v4` is the V4 Pro
family uid and a grep for `deepseek-v4-pro` would report a clean removal while leaving
the model dispatchable. AC-018 asserts a file was **not** changed: the destructive-scope
incident happened with V4 Pro, and tidying that name away while retiring the model would
turn a true record into a false one.
<!-- /ANCHOR:closure -->
