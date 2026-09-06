---
title: "Decision Record: Fix newcomer reachability for sk-create-frontmatter routing"
description: "Why one phrase was dropped for over-capture, why the version phrases were refused, and why committed tool-digest drift was re-pinned across the sibling canaries."
trigger_phrases:
  - "alias over-capture decision"
  - "version alias refused"
  - "tool digest re-pin"
  - "adr newcomer reachability"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/010-fix-newcomer-reachability-for-sk-create-frontmatter-routing"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "implementation"
    recent_action: "Recorded the three decisions"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-049-010-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Fix newcomer reachability for sk-create-frontmatter routing

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Drop a phrase that captures unrelated traffic

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-06 |
| **Deciders** | Implementation session for this phase |

---

<!-- ANCHOR:adr-001-context -->
### Context

`missing a field` was added for the prompt "the validator says my file is missing a field the
neighbour has". Replayed against "the form is missing a field for the phone number", it routed that
prompt to `sk-doc` at 0.8966.

### Constraints

- The hub routing rule says an alias earns its place only by catching a request for this mode.
- A misroute on a natural phrase surfaces only when someone types it.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: to replace it with `validator says my file is missing` on all five surfaces.

**How it works**: the narrower phrase still matches the newcomer prompt, which resolves to the mode
at 0.9336 after the compile, and the form prompt returns nothing.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Replace with the narrower phrase** | Keeps the newcomer prompt, drops the capture | One fewer generic match | 9/10 |
| Keep `missing a field` | Catches more phrasings | Routes form and schema prompts to a frontmatter mode | 2/10 |
| Drop without replacement | No capture | Loses the prompt the phrase was for | 5/10 |

**Why this one**: it is the only option that keeps the target prompt and loses the capture.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- No form or schema prompt reaches the frontmatter mode on this phrase.

**What it costs**:
- A prompt that says "missing a field" without naming the validator does not match. Mitigation: `validator says my file is missing` and `field the validator wants` cover the validator-driven phrasings.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Another phrasing of the same complaint stays unmatched | L | The residual set is recorded for the next measurement |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | An observed capture at 0.8966 |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed |
| 3 | **Sufficient?** | PASS | One string swapped on five surfaces |
| 4 | **Fits Goal?** | PASS | The parent's D3, reachability measured, and the hub rule on narrow aliases |
| 5 | **Open Horizons?** | PASS | The replay set is recorded for the next phrase added |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: one phrase on the five routing surfaces.

**How to roll back**: `git checkout -- .opencode/skills/sk-doc/{graph-metadata.json,mode-registry.json,hub-router.json,ROUTER.md,sk-create-frontmatter/SKILL.md}`, then re-mint and re-pin.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Refuse the version phrases

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-06 |
| **Deciders** | Implementation session for this phase |

---

<!-- ANCHOR:adr-002-context -->
### Context

Two newcomer prompts stop at the hub: "what version number do I put at the top of a new doc" and
"add the version line to this command file". The candidate aliases `version number` and
`version line` were probed before adding. "what is the version number of node" and "the version
line at the top of this doc" already reach `sk-doc` at the floor, and "bump the version number in
package.json" reaches `sk-code`.

### Constraints

- An alias at stage two turns a hub hit into a mode target. The Node question would land on the frontmatter mode.
- Commands are out of scope for the version field by the mode's own standard, so the second prompt should not resolve to it anyway.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: not to add either phrase, and to record both prompts as residual.

**How it works**: the two prompts keep their hub-only outcome. The mode's own standard says a command
file carries no version, so the second prompt reaching the mode would have been a wrong answer.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Refuse both** | No misroute | Two prompts stay hub-only | 8/10 |
| Add `version number at the top` only | Narrower | Already added in this phase, and the prompt still stops at the floor | 6/10 |
| Add both | Two more prompts resolve | A Node version question resolves to a frontmatter mode | 2/10 |

**Why this one**: the capture is certain and the gain is one prompt whose correct answer is not the mode.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- No version question outside documentation reaches the frontmatter mode.

**What it costs**:
- Two of ten newcomer prompts stay at the hub. Mitigation: recorded with the probe results.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reader asking about the doc version field stops at the hub router | L | The hub router's fallback names the mode among its packets |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The probe showed the capture before anything was added |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed |
| 3 | **Sufficient?** | PASS | Nothing added |
| 4 | **Fits Goal?** | PASS | Narrow aliases, per the hub rule |
| 5 | **Open Horizons?** | PASS | The probe set is recorded for a future scorer change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**: nothing.

**How to roll back**: not applicable.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Re-pin committed tool-digest drift across the sibling canaries

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-06 |
| **Deciders** | Implementation session for this phase |

---

<!-- ANCHOR:adr-003-context -->
### Context

After the authored digests were re-pinned, the sk-doc canary stayed red on a second set: the
benchmark loader and scorer scripts under `system-deep-loop/deep-improvement/scripts/skill-benchmark/`.
Both changed in commit `2f21545e3e` and are clean at HEAD. The same stale hashes sit in the shared
`005-decision-evaluator/harness/protected-digests.json` and in the four sibling hub canaries.

### Constraints

- A pin that names a committed file attests a real state. A pin that names an uncommitted file does not.
- The sibling canaries belong to other hubs, but they pin the same two committed files.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: to update the two hashes wherever they are a live pin, and nowhere else.

**How it works**: the sk-doc canary, the shared pin source and the four sibling canaries carry the
committed hashes. Nine historical evidence files in another packet that quoted the old hash were
touched by a first replacement pass and restored from HEAD, since evidence records what was true
when written.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Re-pin every live pin, restore the evidence files** | Every pin names HEAD bytes, history untouched | Touches four sibling canaries | 9/10 |
| Re-pin sk-doc only | Smallest diff | Siblings stay red on the same drift | 5/10 |
| Leave all red | No cross-hub edit | Every canary red on an unchanged tree, which phase 008 already called out | 2/10 |

**Why this one**: the drift is one commit's, and one pass closes it everywhere it is a pin.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The sk-doc canary is green at 23 of 23. The siblings no longer fail on the tool digests.

**What it costs**:
- The siblings may still be red on their own hub sources. Mitigation: their status is recorded in the summary, and their sources are their owners'.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future benchmark commit moves the scripts again | M | The pin carries a comment saying a deliberate change re-pins in the same commit |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The canary was red on an unchanged tree |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed |
| 3 | **Sufficient?** | PASS | Two hashes in six files |
| 4 | **Fits Goal?** | PASS | The parent's D4, remeasure rather than soften |
| 5 | **Open Horizons?** | PASS | The comment names the refresh rule |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**: two hash literals in the sk-doc canary, `protected-digests.json` and the four sibling canaries.

**How to roll back**: `git checkout` those six files.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
