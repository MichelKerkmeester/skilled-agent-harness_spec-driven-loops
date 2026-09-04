---
title: "Tasks: the CLI roster truth pass — DevPass, vision, Gemini 3.8, V4 Pro retirement, pi repair"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "devpass llmgateway roster"
  - "gemini 3.8 flash swap"
  - "deepseek v4 flash vision"
  - "retire deepseek v4 pro"
  - "pi config repair"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/060-devpass-roster-vision-gemini-3-8"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All workstreams executed and verified"
    next_safe_action: "T001 baseline capture"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-060-devpass-vision-gemini"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: the CLI roster truth pass — DevPass, vision, Gemini 3.8, V4 Pro retirement, pi repair

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001a Capture the DevPass provider facts [evidence: `opencode auth list` shows `DevPass (LLM Gateway) · api`; `auth.json` key `llmgateway`; `opencode models llmgateway` = 183 ids; `llmgateway/claude-haiku-4-5` returned `PONG-DEVPASS`, session `ses_f93e9004fffewr3kE8NNhOVFFE`, 2026-09-04]
- [x] T001b Capture the four target models' ladders, vision flags and prices [evidence: `opencode models llmgateway --verbose` — flash `none`..`max` / attachment false / $0.104 out; vision-exp `none`,`low`,`high`,`max` / attachment true / $0.28; glm-5.3-flash `none`..`max` / attachment true / $0.40; gemini-3.8-flash `minimal`..`high` / attachment true / $3.75]
- [x] T001c Confirm the vision variant per provider [evidence: present on `llmgateway`, `openrouter/deepseek/`, `opencode-go` (ladder `low`/`high`/`max`, 1M ctx); **absent** on `cline-pass`, which lists only `deepseek-v4-flash`, `deepseek-v4-pro`, `glm-5.3`]
- [x] T001d Run the operator's gate on the widest Gemini reach [evidence: `cursor-agent --list-models` prints `gemini-3.8-flash-{low,medium,high}`; `devin models list` prints `gemini-3-8-flash-{low,medium,high}` marked `new`, with the `gemini` alias on the 3.8 family and pricing $1.5/$7.5 per 1M vs 3.7's $0.75/$3.75]
- [x] T002 Capture the pre-change verification baseline (`scratch/baseline/`) [evidence: `npx vitest run tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts` pass/fail counts + `tsc --noEmit` error list, both saved to file before any edit]
- [x] T003 Capture the full `rg` inventory of every in-scope id site (`scratch/baseline/`) [evidence: `rg -n 'gemini-3\.7|gemini-3-7'`, `rg -n 'llmgateway'`, and `rg -n 'deepseek-v4-pro|\bdeepseek-v4\b'` over the two skill trees and `.pi`, saved]
- [x] T003b Separate V4 Pro roster entries from incident history before any deletion [evidence: roster = `DEVIN_SUPPORTED_MODELS`/`DEVIN_ALLOWED_MODELS` (3 ids: `deepseek-v4`, `deepseek-v4-pro`, `deepseek-v4-pro-max`) + 5 devin recommendation sites + inert `.pi/models.json` block + 1 cli-claude-code example; history = `destructive-scope-violations.md` and the `cli-opencode/SKILL.md` line citing the 2026-05-04 incident, both preserved]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### WS1 — DevPass provider onboarding (docs only)

- [x] T004 Add the `llmgateway` section to §2 with exactly four rows, the `https://api.llmgateway.io/v1` endpoint, the two-segment id form, and the Standard-tier / no-weekly-cap note (`cli-opencode/references/providers-and-models.md`)
- [x] T005 Add an `llmgateway` row to the §4 `--variant` mapping table: `max` for the three flash/GLM entries, `high` ceiling for Gemini 3.8 (`cli-opencode/references/providers-and-models.md`)
- [x] T006 [P] Add llmgateway to the auth pre-flight provider list, and correct the stale "OpenRouter routes DeepSeek V4 Flash only" line to the current allowlist (`cli-opencode/references/cli-reference.md`)
- [x] T007 [P] Add llmgateway to the model-selection prose at both sites (`cli-opencode/SKILL.md`)
- [x] T008 [P] Add llmgateway to the provider roster prose (`cli-opencode/README.md`)

### WS2 — DeepSeek V4 Flash Vision rollout

- [x] T009 Add the vision row to the `openrouter` and `opencode-go` tables, and a callout stating `cline-pass` offers no vision id with its `opencode models cline-pass` evidence (`cli-opencode/references/providers-and-models.md`)
- [x] T010 Correct the GLM-5.3-Flash "no `max` variant on any route" claim to the per-route truth: `max` on `llmgateway`, `xhigh` ceiling on `cline-pass` (`cli-opencode/references/providers-and-models.md`)

### WS3 — Gemini 3.7 → 3.8, hub-wide

- [x] T011 [P] OpenRouter callout + row → `google/gemini-3.8-flash` (`cli-opencode/references/providers-and-models.md`, `cli-opencode/SKILL.md` x2)
- [x] T012 [P] OpenRouter callout + row → 3.8 (`cli-pi/references/providers-and-models.md`); expected-id list (`cli-pi/manual-testing-playbook/model-dispatch/supported-model-allowlist-smoke.md`)
- [x] T013 [P] `gemini-3.7-flash-high` → `gemini-3.8-flash-high` across all five cursor doc surfaces (`cli-cursor/{README.md,references/providers-and-models.md,references/cli-reference.md,assets/prompt-templates.md,manual-testing-playbook/manual-testing-playbook.md}`)
- [x] T014 [P] `gemini-3-7-flash-high` → `gemini-3-8-flash-high`, and record the alias move plus the 2x price change (`cli-devin/SKILL.md`, `cli-devin/references/providers-and-models.md`)
- [x] T015 Swap the Gemini id in all three source-of-truth arrays and their doc comments (`executor-config.ts`: `PI_SUPPORTED_MODELS`, `CURSOR_SUPPORTED_MODELS`, `DEVIN_SUPPORTED_MODELS`)
- [x] T016 Swap all three mirrors plus the `PI_MODEL_PROVIDERS` key, keeping alphabetical order (`fanout-run.cjs`: `PI_ALLOWED_MODELS`, `CURSOR_ALLOWED_MODELS`, `DEVIN_ALLOWED_MODELS`)
- [x] T017 Update both guard suites **in the same step as T015/T016** — roster assertions, provider-map coverage, and negatives asserting the 3.7 ids now reject (`executor-config.vitest.ts`, `fanout-run.vitest.ts`)
- [x] T018 Confirm `isFlashMaxPinnedModel` needs no edit and say so in the commit — Gemini has no `max` tier and was never pinned (`executor-config.ts`, `fanout-run.cjs`)

### WS5 — Retire DeepSeek V4 Pro

- [x] T019a Remove all three V4 Pro ids from `DEVIN_SUPPORTED_MODELS`, leaving 14, and rewrite the doc comment's max-tier provenance so it stops describing a removed model (`executor-config.ts`)
- [x] T019b Remove the same three ids from `DEVIN_ALLOWED_MODELS` and its comment block; confirm `deepseek-v4-flash-max` survives (`fanout-run.cjs`)
- [x] T019c Update the devin fixtures to the 14-id set and add negatives asserting all three V4 Pro ids now reject — same step as T019a/T019b (`executor-config.vitest.ts`, `fanout-run.vitest.ts`)
- [x] T019d Drop the two V4 Pro rows and trim the max-tier provenance note (`cli-devin/references/providers-and-models.md`)
- [x] T019e Repoint all three V4 Pro recommendations to `gpt-5-6-luna-max`: the curated-families line, the selection strategy, and the "Use deepseek" trigger row (`cli-devin/SKILL.md`)
- [x] T019f Repoint the reasoning-heavy recommendation in the model-choice FAQ (`cli-devin/README.md`)
- [x] T019g Remove the V4 Pro invocation examples and `/model` lines; repoint the §5 architecture, security and planning rows and the `DEVIN_MODEL` example (`cli-devin/references/cli-reference.md`)
- [x] T019h Repoint the `--variant` illustration off a retired model (`cli-claude-code/references/claude-tools.md`)
- [x] T019i Confirm the incident record still names `opencode-go/deepseek-v4-pro` and was NOT edited — retirement does not rewrite history (`cli-opencode/references/destructive-scope-violations.md`, `cli-opencode/SKILL.md`)

### WS6 — Repair the pi config

- [x] T019j Delete the `cline-pass/deepseek-v4-pro` model block, keeping the other two array entries and valid JSON (`.pi/models.json`)
- [x] T019k Add `openrouter/google/gemini-3.8-flash` to `enabledModels` (`.pi/settings.json`)
- [x] T019l Update the two playbook lines that tell a reader the V4 Pro entry may still appear (`cli-pi/manual-testing-playbook/model-dispatch/cline-provider-id-format-dispatch.md`)

### WS4 — Record

- [x] T019 Write the hub changelog entry (`.opencode/skills/cli-external-orchestration/changelog/v1.4.6.0.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Unit + syntax + type gate [evidence: `npx vitest run` on both suites exits 0; `node --check fanout-run.cjs` clean; `tsc --noEmit` delta zero against the T002 baseline]
- [x] T021 Stale-id sweep [evidence: `rg -n 'gemini-3\.7|gemini-3-7'` over both skill trees returns hits only under `changelog/` and `benchmark/`]
- [x] T022 Roster-equality + provider-map check [evidence: all three `*_SUPPORTED_MODELS`/`*_ALLOWED_MODELS` pairs equal; devin pair is 14 ids in both files; every pi id resolves in `PI_MODEL_PROVIDERS`]
- [x] T022b V4 Pro sweep [evidence: `rg -n 'deepseek-v4-pro|\bdeepseek-v4\b' .opencode/skills .pi` returns hits only under `changelog/`, `benchmark/`, and the two incident-record files]
- [x] T022c pi config parse + content check [evidence: `node -e JSON.parse` clean on both `.pi` files; `jq` shows no `deepseek-v4-pro` id and a present `openrouter/google/gemini-3.8-flash`]
- [x] T023 Live text dispatch, four DevPass models [evidence: `opencode run --model llmgateway/deepseek-v4-flash --variant max`, `…/deepseek-v4-flash-vision-exp --variant max`, `…/glm-5.3-flash --variant max`, `…/gemini-3.8-flash --variant high` each return a model reply; transcripts in `scratch/evidence/`]
- [x] T024 Live vision dispatch [evidence: one image-attachment dispatch per vision route (`llmgateway`, `openrouter`, `opencode-go`) returns a description of the image; a text-only reply is a FAIL, not a pass]
- [x] T025 Live Gemini 3.8 on cursor + devin [evidence: `cursor-agent -p --model gemini-3.8-flash-high` and `devin -p --model gemini-3-8-flash-high --respect-workspace-trust false` each return a reply]
- [x] T026 Negative control, Gemini [evidence: a fan-out dispatch of `google/gemini-3.7-flash` is rejected at the allowlist, proving the swap is enforced and not merely documented]
- [x] T026b Negative control, V4 Pro [evidence: a devin fan-out dispatch of each of `deepseek-v4`, `deepseek-v4-pro` and `deepseek-v4-pro-max` is rejected; the bare alias is tested explicitly because it is the one a `-pro` grep would miss]
- [x] T027 Packet close-out [evidence: `implementation-summary.md` written; `acceptance-criteria.md` rows moved to `Met` with real receipts; metadata regenerated; `validate.sh --strict` prints `RESULT: PASSED` with `Errors: 0`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: WS1-WS6 shipped; guard suites 204/204; devin roster 17->14; zero V4 Pro or Gemini 3.7 refs outside changelogs; vision measured on all three image-capable entries]
- [x] No `[B]` blocked tasks remaining [check: `grep '\[B\]' tasks.md`]
- [x] Both guard suites green and the `tsc` delta zero against a baseline captured **before** the first edit
- [x] Every documented model dispatch-tested; every vision claim proven with a real image
- [x] `validate.sh --strict` exit 0 with an explicit `RESULT: PASSED` line, not merely the absence of `RESULT: FAILED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure Gate**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->
