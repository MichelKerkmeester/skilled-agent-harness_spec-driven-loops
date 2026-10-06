---
title: "Implementation Summary: v4.0.0.3 review remediation"
description: "Planning is complete, at Level 3+ for multi-agent execution, for the v4.0.0.3 review's 21 findings, one new P1 found in planning (R-22) and the 8 Luna lineage fixes. No source has changed yet."
trigger_phrases:
  - "v4.0.0.3 remediation summary"
  - "remediation planning status"
  - "finding to commit map"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/069-v4-0-0-3-review-remediation"
    last_updated_at: "2026-10-06T10:55:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Raised the plan to Level 3+ with eight workstreams and self-contained work packages"
    next_safe_action: "Run /speckit:implement wave 0"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: v4.0.0.3 review remediation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 069-v4-0-0-3-review-remediation |
| **Status** | Planned |
| **Completed** | Not yet |
| **Level** | 3+ |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing has shipped yet. The packet holds a plan that sends every v4.0.0.3 review finding to a specific fix, test, owning agent and commit. Every citation it relies on was re-read at `b5353b1f7a`. Raising it to Level 3+ split the work into seven implementer workstreams with exclusive file ownership and one integrator. Each workstream got a self-contained work package, so several agents can work at once without re-researching or colliding.

### v4.0.0.3 review remediation

The plan fixes the four P1s first (the review's three plus R-22), each behind a test that has to fail before the fix. It then clears the 18 P2s in the report's workstream order and lands the eight lineage-prompt fixes last. Four explorers mapped producers, consumers and tests. Their findings changed the plan in three places:
- **R-01 is bigger than the report says.** `deep-review-confirm.yaml` emits five more legacy rows than it lists.
- **Two files are generated or wrapped.** `.devin/hooks.v1.json` is generated, and `loop-lock.cjs` is a tsx wrapper with nothing to rebuild.
- **`AGENTS.md` has 25 bytes to spare** before Devin's 16 KB cut, so F1 has to be byte-neutral.

### What the Level 3+ pass found

Seven design agents read the code behind every fix, and their drafts surfaced four things the review missed:
- **R-22, a new P1.** The workflow loop lock never excludes a second run, because each workflow acquires it under the short-lived CLI process id and never refreshes it. In a lead probe, a second acquire 160 ms later reclaimed a fresh lock. ADR-004 fixes it.
- **R-16's symptom was misdescribed.** The scan prints nothing at all, rather than an all-zero summary.
- **A second sk-git parse bug.** `-s` swallows the following `-m`.
- **R-18's unguarded call has a copy.** `validate-message.mjs:45` carries the same call, and there it fails closed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md` | Created | Packet docs |
| `decision-record.md` | Created | ADR-001 to ADR-005 and an index |
| `plan.md` (L3+ sections) | Created | Workstream table, execution waves, sync points, file ownership rules, the agent dispatch contract, work packages WP-A to WP-H, communication plan |
| `research/research.md` | Created | Explorer findings, lead spot checks, and section 4 (findings from work-package design) |
| `../spec.md` | Modified | Phase map row for phase 69 (by `create.sh`) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet was planned with `/speckit:plan :auto`. Four parallel explorer agents (architecture, feature, dependency, test) re-located every cited line. The lead then checked the load-bearing claims directly:
- the tsx import at `loop-lock.cjs:142`;
- the `DEVIN_EDIT_TOOLS` allowlist;
- the hook-registry note;
- the reserved stems;
- the trigger-index staleness;
- the NUL counts;
- the `check-rule-copies.js` anchor offsets.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Level 3 over the recommended 2 | A hard-rule document and two shared runtime contracts change, and each needs a decision record |
| R-01 through the reserved stems (ADR-003) | The reducer reads these rows back from the state log, so print-only bookkeeping would leave its inputs dead |
| R-03 read-back (ADR-002) | Single-flight holds on one host only |
| F1 accepted (ADR-001) | The operator accepted the widened exemption as written on 2026-10-06 |
| DeepSeek V4.1 Flash through `cli-pi` as the implementer executor | Operator decision on 2026-10-06 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-goal.cjs` on this folder | PASS, 5/5 |
| `lint-goal-criteria.cjs` on `goal.md` | 0 rule-4 and 0 rule-5 violations |
| `check-rule-copies.js` (baseline) | Exit 0; last anchor at byte 16,359 of 16,384 |
| `generate-trigger-index.mjs --check` (baseline) | Exit 1; v4.0.0.3 changelog stale (R-09 still open) |
| NUL bytes (baseline) | 1 in `completion-evidence-sentinel.cjs`, 1 in `rubric-guard.cjs` (R-19 still open) |
| R-22 lock probe | `acquire` gave `acquired:true`, `status` gave `stale:true, alive:false`, and a second `acquire` gave `acquired:true` with `reclaimed` |
| sk-git probes (lead re-run) | `git commit -am "wip"` is allowed by the gate; `parseGitCommand` puts `wip` in paths for both `-am` and `-s -m` |
| `check-repo-rules.cjs` (baseline, design agent) | 11/11 PASSED |
| Test suite baseline | Not run yet; T002 records it before the first source edit |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **ADR-004 trade-off.** A crashed run holds its packet lock for up to 60 minutes; `loop-lock.cjs status` names the holder for a manual release.
2. **Devin `write` payload shape unconfirmed.** The post-edit hook calls its tool name "unconfirmed live". T013 tests the adapter contract, while a live Devin run is the only proof of the real payload.
3. **`~/.claude/CLAUDE.md` is outside the repository.** If F1 lands, the operator updates that copy.
<!-- /ANCHOR:limitations -->

---
