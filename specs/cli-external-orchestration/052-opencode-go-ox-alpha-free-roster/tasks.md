---
title: "Tasks: Ox Alpha via OpenRouter roster"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "ox-alpha roster"
  - "openrouter stealth ox-alpha"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/052-opencode-go-ox-alpha-free-roster"
    last_updated_at: "2026-08-22T11:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded task breakdown for the openrouter route; all tasks complete"
    next_safe_action: "Commit when operator approves"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-052-opencode-go-ox-alpha-free"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Ox Alpha via OpenRouter roster

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

- [x] T001 Probe zen + OpenRouter for ox [evidence: `opencode/ox-alpha-free` and `opencode/ox-alpha` → `Model not found`; `openrouter/stealth/ox-alpha` → real `PONG` on opencode and pi]
- [x] T002 Locate enforcement points + OpenRouter policy sites [evidence: `grep -n stealth/ox-alpha` locates roster in executor-config.ts + fanout-run.cjs; policy in 2 comments + 2 doc blockquotes]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Remove `ox-alpha-free`, add `stealth/ox-alpha` to `PI_SUPPORTED_MODELS` [evidence: executor-config.ts roster; ox-alpha-free count 0]
- [x] T004 Same swap in `PI_ALLOWED_MODELS` mirror [evidence: fanout-run.cjs Set synced with executor-config]
- [x] T005 Map `stealth/ox-alpha → openrouter`; drop the opencode-go ox map entry [evidence: `PI_MODEL_PROVIDERS`]
- [x] T006 Relax OpenRouter policy comments to "Flash + Ox Alpha" [evidence: `grep -rn "Flash + Ox Alpha"` returns comments in executor-config.ts + fanout-run.cjs]
- [x] T007 cli-pi doc: drop opencode-go ox row, add OpenRouter row, relax blockquote [evidence: `cli-pi/references/providers-and-models.md`]
- [x] T008 cli-opencode doc: drop opencode-go ox row, add OpenRouter row, relax blockquote [evidence: `cli-opencode/references/providers-and-models.md`]
- [x] T009 Swap guard test expectations [evidence: `executor-config.vitest.ts` exact-roster + `fanout-run.vitest.ts` providerByModel]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Syntax + unit tests [evidence: `node --check` ok; `npx vitest run` = 199 passed]
- [x] T011 Fanout builder wiring probe [evidence: emits `pi -p --offline --model openrouter/stealth/ox-alpha probe`]
- [x] T012 Live dispatch both CLIs [evidence: `opencode run` + `pi` of `openrouter/stealth/ox-alpha` each returned `PONG`]
- [x] T013 No opencode-go ox residue [evidence: `grep -c ox-alpha-free` both runtime files = 0]
- [x] T014 Spec docs + metadata + strict validate [evidence: 5 docs + regenerated `description.json`/`graph-metadata.json`; `validate.sh --strict` recorded in implementation-summary]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: `T001`-`T014` complete]
- [x] No `[B]` blocked tasks remaining [evidence: `grep '\[B\]' tasks.md` returns nothing]
- [x] Tests green + both CLIs live-verified [evidence: see `implementation-summary.md` Verification table]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
