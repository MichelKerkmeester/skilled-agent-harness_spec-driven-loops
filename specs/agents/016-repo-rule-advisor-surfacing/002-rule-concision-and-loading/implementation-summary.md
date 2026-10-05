---
title: "Implementation Summary: Repo rule concision and loading"
description: "A measured baseline and four steered research lineages found that loading more rule text is not the fix: reading a rule moves one ban and leaves the rest unchanged. The verdict names what to cut, which compressed load to pilot, and a Devin truncation to fix now."
trigger_phrases:
  - "repo rule concision summary"
  - "rule loading research outcome"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading"
    last_updated_at: "2026-10-04T15:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Synthesized the four-lineage steered research run and checked its citations"
    next_safe_action: "Operator picks the first build packet"
    blockers: []
    key_files:
      - "research/research.md"
      - "prep/evidence-pack.md"
      - "prep/measure-rule-compliance.py"
    session_dedup:
      fingerprint: "sha256:0fcb56ac36870a66c1511c13514d9231830b903bddb664079870fe6a8529afc2"
      session_id: "scaffold-002-rule-concision-and-loading"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Why does the table ban fail while the semicolon ban partly works?"
      - "How often does a session need a reply rule and not have it?"
    answered_questions:
      - "Is loading every rule affordable? About 37k tokens per window, affordable but with no measured benefit."
      - "Can the rules be cut without losing norms? Yes, about 20% to 28%, by removing apparatus."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Repo rule concision and loading

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-rule-concision-and-loading |
| **Completed** | 2026-10-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You now have a measured answer to why the repo rules do not stick. Reading `communication-prose.md` roughly halves the semicolon rate, but reading `communication.md` leaves the table rate where it was. So loading more text is not the lever, and loading all 13 rules (about 37k tokens a window) would buy nothing the data can show.

### Phase 2: rule-concision-and-loading

The run produced a concision playbook, a per-rule size table for a card-plus-self-check load (18,699 B for all 13 rules, 17% of the corpus), two drafted rule rewrites with keep/drop ledgers, a hook design that delivers a rule once per compaction window, and one confirmed delivery gap. Devin cuts `AGENTS.md` at 16,384 B, so its sessions never see the §8 line that loads the reply rules.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `prep/evidence-pack.md` | Created | Token load, read rates and compliance baseline, aggregates only |
| `prep/measure-rule-compliance.py` | Created | Reproducible compliance measurement over local transcripts |
| `research/` | Created | Four lineages, steering files, merge outputs and `research.md` |
| `spec.md`, `plan.md`, `tasks.md` | Modified | Status, the GLM replacement, and the generated findings block |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator measured first, then ran four lineages in one fan-out: DeepSeek and SWE 2 on cli-devin, and two Luna lineages on cli-codex. Each lineage read its `steer.md` before every iteration and ran to a forced cap of 12 iterations in total. The orchestrator merged the lineages, recomputed the card table, and checked the load-bearing citations against the working tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Replace the GLM lineage with a second Luna lineage | The llmgateway route rejected every GLM 5.3 Flash request. The operator chose more Luna on cli-codex |
| Recommend no hook now | No Gate 5 miss rate exists, and post-compaction re-reads are not misses |
| Treat card-only loading as unsafe | A plain card drops the operative bans in 6 of 13 files |
| Report disagreements instead of averaging them | The cards split, the short-wording claim and the MessageDisplay claim each stay open with both sides' evidence |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iteration counts | PASS: DeepSeek 4, SWE 3, luna-compliance 3, luna-advocate 2, all `maxIterationsReached` |
| Route proof | PARTIAL: the Devin lineages carry the fields; the codex lineages' iteration records lack them |
| Citation spot-check | PASS on every citation checked, listed in `research/research.md` §11 |
| Card table | PASS: recomputed by script, total 18,699 B |
| Strict validation | See the parent's recursive `validate.sh --strict` run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Observational data.** Cohorts are not randomized and detectors match patterns, so no cause is identified. The recommended wording test and pilot are designed to close this.
2. **Same-family lineages.** Both Luna lineages run the same model, so they do not confirm each other independently.
3. **MessageDisplay.** Whether it can replace reply text is UNKNOWN until a live probe.
4. **Containment advisory.** The runner attributed a `.pi/settings.json` change to luna-advocate. That attribution is most likely wrong (inferred). The file was left untouched.
<!-- /ANCHOR:limitations -->

---
