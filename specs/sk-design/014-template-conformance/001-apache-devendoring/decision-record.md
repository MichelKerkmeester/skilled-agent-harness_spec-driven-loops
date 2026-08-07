---
title: "Decision Record: De-vendor design-interface's Apache-2.0 dependency"
description: "Single ADR recording why the Apache-2.0 LICENSE.txt in design-interface must be de-vendored before it is deleted, and why a .gitignore rule is not an acceptable alternative."
trigger_phrases:
  - "apache devendoring decision"
  - "design-interface license removal decision"
  - "de-vendor before delete"
  - "vendored guidance decision record"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/001-apache-devendoring"
    last_updated_at: "2026-07-27T19:00:00Z"
    last_updated_by: "spec-reconciler"
    recent_action: "Moved ADR-001 from Accepted to Implemented by commit 8fa4752968"
    next_safe_action: "None; the ordering decision is discharged and needs no follow-up"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/changelog/v1.1.0.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: De-vendor design-interface's Apache-2.0 dependency
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: De-vendor before delete, in that order, with a hard stop

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted — implemented in commit `8fa4752968` |
| **Date** | 2026-07-27 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

`design-interface/LICENSE.txt` is the full Apache-2.0 license text, committed as the compliance artefact for guidance vendored verbatim from Anthropic's `frontend-design` skill into `references/design-process/design-principles.md`. Nothing regenerates the file — no script, postinstall hook, or download step — so it exists purely as a tracked git object. As long as `design-principles.md` is genuinely Apache-2.0 content, the license is legally required; simply deleting `LICENSE.txt` would leave licensed content unlicensed.

### Constraints

- The license may not be removed while the vendored guidance it covers is still vendored verbatim.
- `.gitignore` cannot substitute for actually resolving the compliance state — an ignored file is still a compliance gap, just a hidden one.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Rewrite `design-principles.md`'s guidance in original words first, verify the rewrite preserves the original's intent point-by-point, and only then `git rm LICENSE.txt` plus every site that cites it. If the rewrite cannot genuinely preserve intent, halt before deletion and escalate.

**How it works**: Phase 1 (rewrite + verify) is a hard gate on Phase 2 (delete). The ordering itself is the safety mechanism — there is no valid execution path where the license is removed before the rewrite is confirmed to preserve intent.

**As executed**: both phases landed inside the single commit `8fa4752968`, with the rewrite and the removal ordered within it. The commit message states the constraint explicitly: "The licence could only go once the text it covered was genuinely replaced; removing it first would have left borrowed wording shipping without its terms." No intermediate commit shipped Apache-2.0 wording without its licence, because no intermediate commit existed.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **De-vendor then delete (chosen)** | Compliance is genuinely resolved, not hidden; skill keeps its guidance | Requires a careful rewrite that risks losing nuance if done hastily | 9/10 |
| Delete `LICENSE.txt` immediately, rewrite later | Fast, unblocks conformance checks sooner | Ships Apache-2.0 content without its required license in the interim — a real compliance violation, not just a documentation gap | 2/10 |
| Add `LICENSE.txt` to `.gitignore` | Stops it reappearing in status output | Masks the compliance state instead of resolving it; the vendored content is still Apache-2.0 and still needs its license the moment it's tracked again | 1/10 |
| Leave as-is | No work required | Vestigial Apache-2.0 dependency persists indefinitely, contradicting the operator's priority to resolve it | 1/10 |

**Why this one**: It is the only option that resolves the actual compliance state — the guidance stops being vendored, so the license stops being required — rather than hiding or racing past the requirement.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- `design-interface` gained an original-words version of its aesthetic-direction guidance, which must be maintained going forward as first-party content rather than a passthrough of upstream Anthropic changes.
- Manual-testing scenario ID-007, whose entire premise was "confirm Apache-2.0 provenance," was **deleted** rather than inverted. Inverting it would have left a scenario whose subject no longer existed; the de-vendored state is already asserted by the grep sweep in `checklist.md` (CHK-060).
- `changelog/v1.1.0.0.md` is the permanent record of why the license disappeared, which matters for anyone auditing the skill's history later.
- Three documents that claimed the live-read grounding policy "keeps the skill Apache-2.0 only" were corrected in the same commit — that claim became false in a new way once the skill carried no such licence. Two passages describing which licences *would* attach if external content were copied were deliberately left untouched, since they remain accurate.
<!-- /ANCHOR:adr-001-consequences -->
