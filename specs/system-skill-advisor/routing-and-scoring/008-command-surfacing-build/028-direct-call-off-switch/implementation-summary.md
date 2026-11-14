---
title: "Implementation Summary"
description: "The Gate 2 direct advisor call now abstains under the off switch, in the caller's own process, so phase 026's off arm truly has the advisor off."
trigger_phrases:
  - "direct call off switch implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/028-direct-call-off-switch"
    last_updated_at: "2026-11-15T00:05:00Z"
    last_updated_by: "claude"
    recent_action: "Closed the phase: fix 88d8bebcd7, doc follow-up 7fda767c08, review SHIP"
    next_safe_action: "Phase 026 marks T032 done from switch-probe-after-028.txt"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts"
      - ".skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts"
      - ".skilled/bin/system-skill-advisor-launcher.cjs"
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
| **Spec Folder** | 028-direct-call-off-switch |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Set `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1` and the Gate 2 direct call, `node .skilled/bin/skill-advisor.cjs advisor_recommend`, now prints the empty `ADVISOR_DISABLED` envelope instead of a recommendation. Before the fix it answered with `sk-doc:/create:readme:start` on all nine probe lines, so an off-arm model that ran the direct call still got the command.

### Phase 28: direct-call-off-switch

The client used to send every recommend call to the workspace daemon, and the daemon read the switch from its own environment. A fresh socket folder fell through to the local scorer, which never read it. Now one module, `lib/advisor-disabled.ts`, owns the switch list and the disabled envelope. The client asks it first, before any socket probe, launcher spawn or scorer run, and the handler returns the same envelope from the same function. The launcher also stops passing the two switch names to a daemon it starts, so one flagged command can no longer leave a shared daemon abstaining for everyone.

BASE is `8bac97d71c`. The fix is `88d8bebcd7` and the doc follow-up from the review is `7fda767c08`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/advisor-disabled.ts` | Created | Switch list, exact-`1` lookup, workspace root and the disabled envelope |
| `runtime/tests/advisor-disabled.vitest.ts` | Created | Names, value rule and envelope fields |
| `runtime/handlers/advisor-recommend.ts` | Modified | Returns the shared envelope, its local copies removed |
| `runtime/skill-advisor-cli.ts` | Modified | Decides the switch before any daemon or scorer |
| `runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts` | Modified | Flagged calls send no request and start no launcher |
| `runtime/tests/skill-advisor-cli-test-utils.ts` | Modified | Strips the switch from the shared test env |
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modified | Both `_HOOK_DISABLED` names leave the child allowlist |
| `runtime/tests/launcher-bootstrap.vitest.ts` | Modified | Pins that the names no longer reach the daemon |
| `hooks/skill-advisor-hook.md` | Modified | Switch rows, the caller-process rule and the launcher sentence |
| `manual-testing-playbook/compat-and-disable/global-disable-flag.md` | Modified | Step 1 runs against the warm daemon |
| `feature-catalog/cli-surface/advisor-recommend.md` | Modified | Names the shared module and the client's early check |

Paths start at `.skilled/skills/system-skill-advisor/` unless they start with `.skilled/bin`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek workers built the lane tasks one session each, test first, and an Opus verifier passed each one. Every failing-first run is on its task line: T005 failed 3 of 6 before the client change and passed 6 of 6 after, and T017 failed 1 of 21 before the allowlist change and passed 21 of 21 after. The coordinator then ran the gates, the floors, the reproduction and the boundaries (T010 to T013), committed the fix and had one Opus reviewer read the diff.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The client decides in its own process | The daemon is shared, so its environment cannot carry a per-call switch |
| One module builds the envelope for both callers | The client and the handler cannot drift on fields, warning code or abstain text |
| Remove the switch names from the launcher allowlist (A6) | Once the client decides per call, a daemon started by a flagged command must not abstain for the next caller |
| Keep the static import of the schema module (review P2-1) | NFR-R01 allows exactly this closure and NFR-P02 sets no timing bound |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reproduction before (`repro-before.txt`) | 9 lines `disabledCount=none`, 5 live `sk-doc:/create:readme:start`, 4 local scorer |
| Reproduction after (`repro-after.txt`) | 5 of 5 off lines `disabledCount=1` with `recs: []`, warm and fresh, both orders and stdin. The on lines match the before lines exactly. The lease was unchanged across the run (pid 12311) |
| Floors and eval | `cmp` exit 0: 24/44, 0/35, combined 1/44, eval `[160,51,21,5]` |
| Suites (`after.txt`) | BUILD and TC exit 0. advisor-disabled 10/10, handler 22/22, stale-daemon-retry 6/6, dual-client 1/1, launcher-bootstrap 21/21. VALL 2121 passed, up from 2106. DT and VP fail 0 |
| Import closure | The client loads 13 files with `zod` as its only package. No `better-sqlite3` |
| Warm unflagged timing | Median 0.15 s before and 0.22 s after, sampled while other work ran |
| Playbook step 1 | The flagged call prints `ADVISOR_DISABLED` and the unflagged call recommends `sk-git` |
| Boundaries | `AGENTS.md`, both row files, the baseline and the package files are unchanged. No comment carries an id, and no doc line has an em dash |
| Review (`scratch/review/report.txt`) | VERDICT: SHIP, 0 P0, 0 P1, 4 P2. P2-4 was fixed in `7fda767c08`, the spec example for P2-3 was corrected, and P2-1 to P2-3 were kept with reasons on T015 |
| Blocked tasks | None |

The `off` and `on` lines of `scratch/repro-after.txt`, quoted:

```text
warm, flag first   1st off disabledCount=1 {"degraded":null,"source":null,"freshness":"unavailable","abstain":["Skill advisor disabled by SYSTEM_SKILL_ADVISOR_HOOK_DISABLED."],"recs":[]}
warm, flag first   2nd on disabledCount=none {"degraded":null,"source":null,"freshness":"live","abstain":null,"recs":["sk-doc:/create:readme:start","system-spec-kit:-:-","mcp-tooling:-:-"]}
fresh, plain first 1st on disabledCount=none {"degraded":true,"source":"local-scorer","freshness":null,"abstain":null,"recs":["system-spec-kit:-:-","sk-doc:-:-"]}
fresh, plain first 2nd off disabledCount=1 {"degraded":null,"source":null,"freshness":"unavailable","abstain":["Skill advisor disabled by SYSTEM_SKILL_ADVISOR_HOOK_DISABLED."],"recs":[]}
warm, stdin form       off disabledCount=1 {"degraded":null,"source":null,"freshness":"unavailable","abstain":["Skill advisor disabled by SYSTEM_SKILL_ADVISOR_HOOK_DISABLED."],"recs":[]}
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A daemon started before the fix keeps the old environment.** If an older launcher started a daemon while the switch was set, that daemon abstains until it is recycled. Run an unflagged `advisor_status --no-warm-only` after a rebuild, as the playbook's step 1 does, so the daemon is replaced.
2. **Flagged calls skip the daemon's input schema.** Input that the CLI manifest allows but the daemon would refuse, such as `"topK": 1.5`, gets an ok abstain instead of an invalid-params error. Under the switch no call returns a recommendation, so nothing leaks.
3. **Flagged thresholds come from the caller.** The reported `effectiveThresholds` read the caller's environment, so a flagged envelope's metadata can differ from what the daemon would report.
<!-- /ANCHOR:limitations -->
