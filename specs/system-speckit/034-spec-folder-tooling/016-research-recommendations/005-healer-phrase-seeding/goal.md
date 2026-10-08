---
title: "Goal: Phase 5 healer-phrase-seeding"
description: "Stop heal-spec-docs.cjs from writing trigger phrases that phrase-judge rejects as template defaults."
trigger_phrases:
  - "phase 5 healer phrase seeding goal"
  - "packet goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/005-healer-phrase-seeding"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the planning documents"
    next_safe_action: "Build against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5 healer-phrase-seeding

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Stop the upgrade path from writing any trigger phrase that phrase-judge rejects: heal-spec-docs refills an empty list from the slug seeder, and fill-frontmatter's `inferTriggerPhrases` emits only admissible phrases.

### Decisions

Frozen choices, decided 2026-10-08 by the operator. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | An empty trigger_phrases list is refilled with the exact output of `seededPhrases` in template-phrase-cleanup.mjs. It is never left empty and never filled from template defaults |
| D2 | TEMPLATE_DEFAULTS is deleted from heal-spec-docs.cjs, not pinned in a test |
| D3 | Scope covers `inferTriggerPhrases` in frontmatter-migration.ts, and the upgrade test checks every negative judge class |
| D4 | Built in wave 1 by DeepSeek V4.1 Flash max through cli-pi on the LLM Gateway route: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true pi -p "<brief>" --model llmgateway/deepseek-v4.1-flash --thinking max --mode text --offline </dev/null`. One task from tasks.md per brief, in task order, and the diff is checked before the next brief |
| D5 | Reviewed read-only by Luna max fast through cli-codex with `--sandbox read-only`. The builder applies a finding only after confirming it in the code, for at most two rounds |
| D6 | The builder writes only the files in spec.md Files to Change, its tests and this folder. The orchestrator reverts any other write |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -c TEMPLATE_DEFAULTS .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` prints 0
- [ ] A create-root-numbering.vitest.ts case shows heal-spec-docs refills an empty list with exactly the `seededPhrases` output, Vitest exit code 0
- [ ] An upgrade-legacy.vitest.ts case runs `--apply` on a fixture with an empty list and a missing key, and `judgeTriggerPhrase` returns null for every written phrase, Vitest exit code 0
- [ ] `grep -n "'memory', 'indexing', 'context'" .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts` finds nothing
- [ ] `validate.sh --strict` on this packet prints RESULT: PASSED

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents written | Done | spec.md, plan.md, tasks.md, acceptance-criteria.md, implementation-summary.md all completed |
| Repair-derived and goal checks | Done | Both passed after goal.md creation |

### Deviations and findings

| Item | Note |
|------|------|
| Empty-list policy decided | 2026-10-08, the operator chose to refill from the slug seeder. Recording the list as unknown was considered because it writes nothing, and rejected because the document could never be found by its own phrases. An earlier D1 had frozen "record as unknown" without an operator decision; it is replaced |
| Pin scope decided | 2026-10-08, the operator chose to delete TEMPLATE_DEFAULTS rather than pin it, which removes the old conflict with the pin-test criterion |
| Scope widened | 2026-10-08, the operator added `inferTriggerPhrases`, which writes single title tokens and a `memory`, `indexing`, `context` fallback the judge rejects |
<!-- /ANCHOR:log -->

---

