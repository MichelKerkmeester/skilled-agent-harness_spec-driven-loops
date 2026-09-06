---
title: "Implementation Summary: One Validation Verdict, Honestly Earned"
description: "The two validators became one, after the surviving engine was taught the two checks only the other one made."
trigger_phrases:
  - "validation gate coherence status"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/007-completion-gate-coherence"
    last_updated_at: "2026-08-29T13:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Deleted the second validator and repaired surfaced packets"
    next_safe_action: "None outstanding; the packet is complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts"
      - ".opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Delete the second engine or keep it behind a flag? Deleted, once the survivor made every check it made."
      - "Merge the two template-shape rules? No — measurement refuted the premise that they always fire together."
---
# Implementation Summary: One Validation Verdict, Honestly Earned

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 040-validation-gate-coherence |
| **Status** | Complete |
| **Level** | 2 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

One validator where there were two.

The completion gate used to be answered by either a shell rule engine or a
compiled orchestrator, chosen by environment, with nothing in the output saying
which. The shell engine is gone; the front-end that used to contain it now only
resolves arguments and the set of folders to validate, and hands every rule
decision to the orchestrator. It went from 1430 lines to roughly 340, and the
output names the engine that produced the verdict.

Deleting it was only safe because the survivor was taught what it was missing
first. Two real checks existed solely in the deleted engine:

- A required frontmatter field that is present but **empty**. The survivor tested
  that the key existed and never looked at its value, so a packet with
  `trigger_phrases:` and nothing after it passed.
- The checklist title. The survivor compared only second-level headings, so a
  document titled `# Checklist: X` instead of `# Verification Checklist: X`
  passed.

Both now run on the surviving engine. Their findings match the removed engine's
line for line, with one deliberate difference: the title check anchors the
expected text to the start of the heading, where the original accepted it
anywhere in the line. That is the stricter reading and it rejects nothing in the
corpus — every checklist title was measured against both rules and none passes
one while failing the other — but it is a difference, not a faithful copy.

Four smaller things came with it. The freshness rule's applicability is decided
once, at the rule's own entry point, so it cannot depend on who asked. The
command-tree comparison — a repository-wide fact that no packet could satisfy
from inside itself — moved out of the per-packet gate into its own repository
check. A rule that duplicated the template-header comparison at a lower severity
was removed. And a stale hardcoded list of child folders, which had been quietly
limiting one packet's recursive run to 9 of its 25 children, was deleted.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Measurement came before every removal.

The two engines were run against the same 150 packets. They disagreed on 48, in
four signatures. Each signature was traced to a named cause and a decision
before any code changed:

| Disagreement | Cause | Resolution |
|---|---|---|
| Empty required frontmatter field | Only the deleted engine checked values | Ported to the survivor |
| Checklist title shape | Only the deleted engine checked the title | Ported to the survivor |
| Extra custom anchor, mid-document extra header | A rule labelling its own findings non-blocking, then blocking on them | Left to the survivor's behaviour, which ignores them |
| Freshness rule fired without opt-in | Gated on a flag in one engine, unconditional in the other | Decided once, at the rule |

Only after the ports did the deletion happen, and the replacement front-end was
proved verdict-neutral: 120 packets returned identical exit statuses under the
old and new front-ends.

Restoring the title check would have failed 243 packets that previously passed.
Rather than leave that debt, all 384 non-conforming titles were rewritten and
the generated metadata each edit invalidated was re-derived in the same pass.

An independent review of the finished change found a defect worth more than the
rest combined: a mistyped rule name in the subset variable produced an empty
rule set, which reported a clean pass for a packet no rule had examined. It now
refuses an unrecognised name outright.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| Port before deleting | Deleting first would have silently dropped two real checks and called it a simplification |
| Delete rather than keep behind a flag | A fallback that answers differently is the defect, not a safety net |
| Fail closed on an unknown rule name | A gate that passes because nothing ran is worse than one that errors |
| Repair the surfaced packets rather than surface and leave | A restored check that adds 243 failures teaches readers to ignore the gate |
| Drop the rule merge | Measurement refuted the premise that the two rules always fire together |
| Print every finding's details | A finding that will not say what it found cannot be acted on |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Engines disagreed before the work | PASS | 48 of 150 packets, in four signatures; 17 of 30 across four environment selections |
| Ported checks match the removed engine | PASS | Same packet, same three findings, identical detail lines |
| Front-end swap changes no verdict | PASS | 120 packets, identical exit statuses old vs new |
| No check lost to the deletion | PASS | Every remaining disagreement is a finding the removed rule itself called non-blocking |
| Restored title check leaves no debt | PASS | 384 titles rewritten, metadata re-derived; 0 packets fail on it |
| Affected packets improved overall | PASS | Of the 384, 243 passed before and 286 pass now |
| Recursive coverage restored | PASS | One packet went from 10 folders validated to 26 |
| Mistyped rule subset cannot pass | PASS | Exits 1 naming the unknown rule instead of reporting PASSED |
| Test suites | PASS | No regression against the same suites at the previous commit; 10 new tests cover the added behaviour |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A checkout with no build now stops instead of guessing.** With neither a
   compiled build nor the TypeScript loader, validation exits with a system
   error telling the reader to build. Previously it fell back to the engine that
   has been deleted. This is the intended trade and is recorded in `spec.md`.
2. **The removed duplicate rule was not a perfect duplicate.** It selected the
   contract for a phase parent differently, so on a phase parent that also
   carries a plan, it compared the same document against a different template
   than the surviving rule does. That case is no longer checked anywhere. It was
   already inert on the default engine before this work, so nothing regressed,
   but the original justification of "strict duplicate" was too strong.
3. **The failure-rate figures are sampled.** The engine comparison used 150
   packets and the co-occurrence measurement 220; the whole-corpus rate was not
   measured.
4. **An independent review found three defects after this shipped**, all since
   fixed and covered by tests: a mistyped rule subset reported a clean pass for
   a packet nothing had examined; a third rule-script inventory still named the
   deleted rule, which failed the first suite in a chained command and stopped
   the other two from running at all; and re-deriving metadata at scale ran into
   a specs-root lookup that only recognised the pre-move layout, dropping every
   repository-relative key file from the derived graph. The last was the
   expensive one, and it was a pre-existing bug this work happened to run 384
   times.

<!-- /ANCHOR:limitations -->
