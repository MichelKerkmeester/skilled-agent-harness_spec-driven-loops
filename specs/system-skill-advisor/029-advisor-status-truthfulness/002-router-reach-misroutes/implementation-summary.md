---
title: "Implementation Summary"
description: "A live full-fleet router-reach run found no wrong-hub or outranked phrase, all 32 recorded misroutes no longer reproduce, and no routing vocabulary changed."
trigger_phrases:
  - "router reach misroutes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/033-advisor-status-truthfulness/002-router-reach-misroutes"
    last_updated_at: "2026-10-03T07:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Shipped and verified phase 2"
    next_safe_action: "Parent session reviews and commits the packet"
    blockers: []
    key_files:
      - "specs/system-skill-advisor/033-advisor-status-truthfulness/002-router-reach-misroutes/scratch/reproduction.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-router-reach-misroutes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-router-reach-misroutes |
| **Status** | Complete |
| **Completed** | 2026-10-03 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Verdict: done, with no graph-metadata vocabulary edits and one cross-packet description fix. The live fleet reaches its hubs. The audit's 14 wrong-hub and 18 outranked rows came from a degraded local scorer, and none of them reproduces against the live advisor.

### Phase 2: router-reach-misroutes

The full probe ran twice against the live daemon, with no hub filter and no limit. The first run (generation 19) followed phase 1's fixes and preceded everything else. The second (generation 29) followed every code and doc change in this packet. Both reported `wrong-hub=0, outranked=0, no-reach=0, allowed=10, probe-error=0` and `RESULT: PASSED`. Each of the 32 recorded phrases was then sent alone to `advisor_recommend`, and each now ranks its declaring hub first. ADR-001 allowed exactly this ending: the run is the deliverable, and only reproduced cases get edits.

One run in between was not scored. Concurrent source edits by other sessions had left the generation signature stale, so the probe failed closed on all 500 phrases. A trusted `advisor_rebuild` republished the generation (28 to 29) and the clean rerun followed. That run is kept as an excerpt, showing the fail-closed gate working.

### Deviation: a cross-packet regression was found and fixed

The full advisor suite had three failures in `tests/parity`. A follow-up measurement traced them to two changes landing at once. This packet's shared hash recipe raised the Python reference to 107 correct and resolved `rr-iter3-066`. The description-budget packet trimmed the `sk-code` description to 127 characters, which cost two rows. One of them was `rr-iter3-077` ("Add a JSON schema comment block to the corpus writer describing every field."), which the old wording matched only through the `json` token inside a file name. The native-advisor routing check could not see this regression, because only the local scorer reads descriptions this way.

The fix rewrote the `sk-code` description to 128 characters: "Implement, debug and verify code: TypeScript, Python, shell, JSON; quality and review workflow modes with stack surface packets." It names the languages directly. Candidates that dropped "packets" or added a second "review" lost `rr-iter3-151` or `rr-iter3-145`. With the new wording `pythonCorrect` is 107, `tsAlsoCorrect` is 100, the regression list is unchanged and `rr-iter3-077` routes to sk-code again. Three ledger entries no longer diverge and were removed: `harder:00b82eb94d58`, `rr-iter3-066` and `rr-hub6-204`. The parity expectation rose 106 to 107 and 99 to 100, with a comment saying why. `rr-iter3-077` was not added to the ledger. The full suite then showed one more expected value moving the same way. The graph-dependent `tests/legacy/advisor-corpus-parity.vitest.ts` rose from 112 to 113 Python-correct and from 108 to 109 native-preserved, with its accepted regression list unchanged, so both expectations were raised with a comment. Live routing kept sk-code on top for a code review, a TypeScript fix, a webflow animation debug and a JSON config edit. The JSON edit wins by only 0.0034 over sk-doc.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/live-fleet.log` | Created | First live full-fleet run |
| `scratch/reproduction.md` | Created | Hub inventory, counts and the 32-row classification with live winners |
| `scratch/verification.log` | Created | Post-change full-fleet run |
| `scratch/verification-degraded-attempt.log` | Created | Excerpt of the fail-closed run while the generation was stale |
| `.skilled/skills/sk-code/SKILL.md` | Modified | `description:` line only (cross-packet regression fix) |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Modified | Removed three entries that no longer diverge |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts` | Modified | Expectations 107 and 100 with the reason |
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-corpus-parity.vitest.ts` | Modified | Expectations 113 and 109 with the reason |

No graph-metadata vocabulary, allowlist, probe script or doctor router-reach file changed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The probes ran in the orchestrating session, outside any executor sandbox, because they need the daemon socket. No executor was dispatched, because no vocabulary edit was justified.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Make no vocabulary edits | Zero reproduced phrases; an edit would rest only on the degraded audit run, which the scope forbids |
| Rebuild the advisor before the post-change run rather than score a degraded answer | REQ-001 says a degraded or generation-less answer fails the run and is not scored |
| Leave the allowlist untouched | No reproduced dispute exists to justify an entry |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` (first) | `checked=7 hub(s), wrong-hub=0, outranked=0, no-reach=0, allowed=10, probe-error=0`, `advisor generation: 19`, `RESULT: PASSED`, exit 0 |
| Same command (post-change) | same counts, `advisor generation: 29`, `RESULT: PASSED`, exit 0 |
| Recorded 32 phrases, one `advisor_recommend` each | 32 no longer reproduced, 0 reproduced, 0 probe errors, all `live` at generation 20 |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | `OK: route-validate - 9 routes validated, 2 warnings`, exit 0 |
| `npx vitest run tests/parity` after the description fix | PASS, 8 files, 158/158, exit 0 |
| Full runtime suite `npx vitest run` | PASS, 135/135 files, 1101 passed, 6 skipped, exit 0 |
| `python3 .skilled/commands/doctor/scripts/audit_descriptions.py` | total 6,331 of 6,400, sk-code 128, exit 0 |
| Live `advisor_recommend`, 4 sk-code prompts, generation 43 | sk-code first on all four (0.9189, 0.9031, 0.95, 0.8234) |
| `git diff --stat` on the probe script, `router-reach-allowlist.json` and `doctor-router-reach.yaml` | empty |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two phrases win by less than 0.002.** `audit the docs` (sk-doc over sk-code) and `review convergence` (system-deep-loop over sk-code) pass today. A later scorer or vocabulary change could flip them, and the fleet probe would report it.
2. **Re-measured on the settled vocabulary.** Skill descriptions were being rewritten in this worktree during the original runs. After every description edit landed and main was merged, `ci-router-vocabulary-reach.cjs` reported `RESULT: PASSED` across all seven hubs: 0 wrong-hub, 0 outranked, 0 no-reach.
3. **Not reproduced since: a watcher reindex that left a stale signature.** In a later probe, adding a trailing newline to `sk-git/graph-metadata.json` and then restoring it each triggered a watcher reindex within 5 seconds (generation 67 to 68 to 69), and `indexStaleness` read `fresh`, 0 changed, both times. The earlier case predates phase 001's shared hash recipe, which plausibly explains it; that link is inferred, not proven.
<!-- /ANCHOR:limitations -->

---

## Handed Off

None. The `sk-code` description line belongs to the description-budget packet; the coordinator authorized this one-line edit, and that packet's summary records it.
