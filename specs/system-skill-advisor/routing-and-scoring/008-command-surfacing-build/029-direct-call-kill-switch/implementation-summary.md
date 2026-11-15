---
title: "Implementation Summary"
description: "The Gate 2 advisor_recommend direct call now abstains whenever the skill-advisor hooks are off, under any switch name, truthy value or flags-file line, decided by the hooks' own resolver in the caller's process. All 14 lines of the switch matrix now match, against 6 before."
trigger_phrases:
  - "direct call kill switch implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/029-direct-call-kill-switch"
    last_updated_at: "2026-11-15T10:30:00Z"
    last_updated_by: "coordinator"
    recent_action: "Closed the phase: fix 0bc486b1637 and follow-up 01788431d19, review SHIP"
    next_safe_action: "None in this phase"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts"
      - "scratch/repro-after.txt"
      - "scratch/review/report.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "77af2d6d-58e8-4180-b6da-697f12833f71"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 029-direct-call-kill-switch |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

When you turn the skill advisor off the documented way, the Gate 2 direct call now goes quiet too. Before this phase, `SYSTEM_SKILL_ADVISOR_DISABLED`, the master switch, a value like `true` or a line in `.skilled/hooks/hook-flags.env` turned off the prompt hooks but left `node .skilled/bin/skill-advisor.cjs advisor_recommend` answering.

### Phase 29: direct-call-kill-switch

The CLI client now asks `hookFlagDecision('skill-advisor')` in `.skilled/hooks/shared/hook-flags.cjs`, the resolver every adapter uses, before it connects to a daemon or runs the local scorer. It reads the caller's environment over the flags file, so a caller's own `0` still beats a saved switch, and the abstain reason names the switch that decided. A shared daemon decides only from the environment it was started with and never reads the flags file, because only the caller can see a caller's `0`. The module finds the resolver by walking up from its own folder, because the source and the built copy sit at different depths, and it answers as if no switch were set when it cannot find one, as every adapter does.

BASE is `b5805efeccd`. The fix is `0bc486b1637` and the review follow-up is `01788431d19`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts` | Modified | Decides through the hooks' resolver, reads the flags file in the caller's process, takes an explicit config |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | Modified | The daemon passes an empty config, so it never reads the flags file |
| `.skilled/skills/system-skill-advisor/runtime/tests/advisor-disabled.vitest.ts` | Modified | Truthy values, the canonical and master names, the resolver's name list and three flags-file cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend.vitest.ts` | Modified | A truthy canonical value in the daemon environment, and a case that proves the daemon ignores the flags file |
| `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts` | Modified | Four switch cases, a flags-file case and an environment `0` control through the real CLI against a warm fake daemon |
| `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-test-utils.ts` | Modified | The isolated scope names a flags file that does not exist |
| `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | Modified | The direct call uses the adapters' resolution, every alias row says so |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md` | Modified | Step 1 also checks the canonical name set to `true` and pins its flags file |
| `.skilled/hooks/hook-flags.env.example` | Modified | The canonical switch also turns off the direct call |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md` | Modified | Names every switch the direct call honours |
| `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md` | Modified | The Hook Health item covers every switch |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modified | The canonical row names the direct call |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The coordinator recorded the before state and reproduced the gap. DeepSeek v4.1 flash workers on OpenCode Go then ran four lanes, one task each, and an Opus verifier checked every code task before its lane moved on. The coordinator checked the doc tasks. The full gates, the floors, the reproduction, the closure probe, the timing and the playbook step ran after every lane closed. One Opus reviewer read the fix diff and then the follow-up diff.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse the hooks' resolver rather than copy its rules | One rule cannot drift, and loading it costs no native package. The CLI still loads only `zod` |
| The daemon never reads the flags file | A caller's `0` must beat the file, and a shared daemon cannot see the caller's environment |
| Record the `MK_` copy in the client as intended | The alias bridge exists so old names keep working, and the one non-switch name it reaches, `--trusted`, is a flag any caller can pass |
| Fix three review P2s, record the rest with reasons | Those three made a doc or a test header state less than the code does. The rest are outside the changed paths or unreachable |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Switch matrix | before: 6 of 14 lines match, 8 do not, the canonical name ignored by the direct call on 4. After: 14 of 14 match, `hook=on` lines identical, daemon lease unchanged |
| Kill-switch CLI cases | 5 of 12 failed before the module change, 16 of 16 pass after |
| Advisor suite | 185 files, 2121 passed before, 2139 passed after, 0 failed both times, 6 skipped |
| Focused files after | module 16/16, handler 24/24, CLI 16/16, dual client 1/1, also under an exported kill-switch flags file |
| Doctor, plugin and hook-flags tests | 1221/1221, 45/45 and 28/28, before and after |
| Floors and eval | typed recall 24/44, false offers 0/35, attached 1/44 and `[160,51,21,5]`, `cmp` equal before and after |
| Import closure | CLI and module load only `zod`, the resolver requires only `node:fs`, `node:path` and `./env-aliases.cjs` |
| Warm call timing | median 0.18 s before, 0.17 s after |
| Playbook step 1 | both flagged calls abstain and name their switch, the unflagged call recommends `sk-git`, plain and with the fixture exported |
| Boundaries | client, launcher, resolver, compat contract, baselines and prompt row files unchanged, the real flags file absent and never opened |
| Review | `verdict: SHIP`, 0 P0 and 0 P1, follow-up `verdict: SHIP` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **An MCP tool call answered by a daemon ignores a flags-file line alone.** That is the residual decision D2 records. The Gate 2 direct call is covered, and a switch in the daemon's own environment still works.
2. **No worker recorded its failing first run for T004 or T005.** The red state rests on the verifiers' probes of the old code and on `repro-before.txt`.
3. **Review P2s left open.** The `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED` row still says native adapters. The playbook assumes the shell exports no other switch. A relative `HOOK_FLAGS_CONFIG` resolves from the repository root in the client. `tests/skill-advisor-cli-json-stdin.vitest.ts` and `command-offer.mjs` would read a checkout flags file. The full list is on task T015.
<!-- /ANCHOR:limitations -->

---
