# Data Quality Program: Plain-Language Summary

> What this folder is, in one line: a research packet that asked how to make spec-kit write the best possible documentation and metadata by default, and turned the answer into 28 planned improvements. Nothing here is built yet. It is a researched, costed, ready-to-build plan.

---

## The two things to understand first

**1. Search only ever shows the top 3 results.** In production, when the system looks something up, it cuts the answer down to about three results to keep the prompt small and fast. So any improvement that just "finds more documents" is wasted, because the extras get cut off before anyone sees them. Only two kinds of change actually help: ones that change *which three* show up and ones that help the AI better *read and follow* a document it already found. This single rule decides whether every idea below is worth doing.

**2. There is already an automatic quality checker that nobody pointed at the right files.** A tool already grades documents and auto-fixes problems when memories get saved. The biggest single win in the whole program is just to *also run it on the spec docs and the JSON metadata files*, where it does not run today. Most of the program is wiring up machinery that already exists, not building new things.

---

## What got added to this folder

- **The research** (`research/`): five independent deep-research passes (37 rounds total, run on Opus) that produced `research/research.md`, the full findings and the tiered list of recommendations.
- **28 planned phase folders** (`001-*` through `028-*`): one per recommendation, each with its own spec, plan, task list, checklist and summary. They are grouped into on-write checks (001-010), background automation (011-013), search-tuning items (014-018, all gated), novel ideas (019-025), the shared engine (026), the search-window experiment (027) and the rollout plan (028).
- **A changelog for every phase** plus a rollup, in the packet changelog directory.
- **Updates to the wider 028 planning docs** so the parent packet records this work honestly as a research track.

---

## The recommendations in plain terms

**Do now, one sure thing (zero risk):** turn on a schema check that already exists but is not switched on. It catches malformed metadata files. Free.

**Cheap wins, extend the existing quality checker to the docs:**
- Auto-write a real description instead of copying the title.
- Lock the allowed values for status and tier fields so typos cannot sneak in.
- Make the keywords match across the three places they are stored.
- Auto-fix the house-style rules.
- Add fill-in-the-blank requirement templates so the AI follows specs more precisely.
- Surface the freshness and source information that is already computed but hidden.

**The most-automated layer (the part that runs itself):**
- A scheduled sweep that re-checks every document on a timer and auto-fixes the safe problems, flagging the risky ones for a human.
- Give the `/doctor` command the ability to fix things, not just detect them.
- A feedback loop where documents that never get used in searches get flagged for improvement.

**The novel ideas (judged 12, kept 7):** an AI that grades each doc's quality, auto-generated "what questions does this answer" tags, cross-document contradiction detection, freshness decay, search-index drift monitoring, auto-generated examples and tests and a quality dashboard.

**The maybes (do not build until proven):** the search-tuning tricks. They only pay off if measured on the real top three, and that proof does not exist yet. The plan builds the measurement first.

**The do-nots:** do not swap the database, do not add cryptographic signing and above all do not build a second quality system. Extend the one that already runs.

---

## What was done to this folder (the work history)

1. **Researched** the topic with the official multi-pass deep-research workflow.
2. **Scaffolded** all 28 phases to full detail so each is ready to pick up and build.
3. **Wrote** a changelog for every phase and wove the program into the parent planning docs.
4. **Reviewed** the whole packet with a 20-round deep review. It caught a real bookkeeping mistake (some docs claimed 100 percent done while others still said 5 percent and pointed at "start the research loop") and a few inaccurate scaffold details (a plan that said to add an export which already exists, a seam that needed to cover both metadata files not one, a reuse that crossed a code boundary). All of these were verified and fixed.

---

## Honest status

This is research only. Nothing is shipped, and nothing is measured. The one sure-thing improvement is turning on an existing schema check. The search-tuning ideas stay switched off until a real measurement proves they help past the top-three cutoff. The single biggest piece of value is the keystone: extend the live quality checker to the documents and JSON files it does not yet touch. The folder is a ready-to-build plan, not a delivered feature.
