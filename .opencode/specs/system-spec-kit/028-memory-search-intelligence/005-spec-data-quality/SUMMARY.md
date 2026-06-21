# Data Quality Program: Plain-Language Summary

> What this folder is, in one line: a research packet that asked how to make spec-kit write the best possible documentation and metadata by default, and turned the answer into 28 planned improvements. Nothing here is built yet. It is a researched, costed, ready-to-build plan.

---

## The two things to understand first

**1. Production keeps at least three results, and the "3" is a floor, not a cap.** When the system looks something up it always returns at least three results, and usually more, up to about twenty. It only trims the longer tail in two cases: when there is a sharp relevance drop-off it cuts at that cliff, and a running token budget caps how much text can be handed to the AI. That token budget, not the number three, is the real limiter in production. So an improvement that "finds more documents" is not automatically wasted. The catch is that the offline test harness does not trim the way production does, so any retrieval improvement has to be re-measured in production mode before it can be trusted. Write-time fixes (improving a document as it is saved) skip the retrieval path entirely, so they ship on cost alone. That split, retrieval must be proven and write-time is cheap, is what decides which ideas below are worth doing.

**2. There is already an automatic quality checker that nobody pointed at the right files.** A tool already grades documents and auto-fixes problems when memories get saved. The biggest single win in the whole program is just to *also run it on the spec docs and the JSON metadata files*, where it does not run today. Most of the program is wiring up machinery that already exists, not building new things.

---

## What got added to this folder

- **The research** (`research/`): five independent deep-research passes (37 rounds total, run on Opus) that produced `research/research.md`, the full findings and the tiered list of recommendations.
- **28 planned phase folders** (`001-*` through `028-*`): one per recommendation, each with its own spec, plan, task list, checklist and summary. They are grouped into on-write checks (001-010), background automation (011-013), search-tuning items (014-018, all gated), novel ideas (019-025), the shared engine (026), the search-window experiment (027) and the rollout plan (028).
- **A changelog for every phase** plus a rollup, in the packet changelog directory.
- **Updates to the wider 028 planning docs** so the parent packet records this work honestly as a research track.

---

## The recommendations in plain terms

**Do now, one sure thing (low risk):** turn on a schema check that already exists but is not switched on. It catches malformed metadata files. The one catch is small but real: a few older files fail the check today, so the switch flips to error-level only after those are repaired to a clean baseline. Cheap, not literally free.

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

**The maybes (do not build until proven):** the search-tuning tricks. They only pay off if a real production-mode measurement shows they help, and that proof does not exist yet. The plan builds the measurement first.

**The do-nots:** do not swap the database, do not add cryptographic signing and above all do not build a second quality system. Extend the one that already runs.

---

## What is buildable now, and what waits for proof

Of the 28 planned phases, four are ready to build today, because the machinery they lean on already ships and their value does not depend on an unproven measurement:
- the schema check that catches malformed metadata (the one sure thing),
- the shared engine that the on-write checks share,
- the keystone that points the existing quality checker at the spec docs and JSON files,
- locking the allowed values for the status and tier fields.

Everything in the search-tuning group and the thinner novel ideas is deferred-until-measured. They earn a build only once a real production-mode measurement shows that the change actually helps what readers see, and that measurement does not exist yet. So those phases stay scaffolded and planned, not started. Nothing here is removed. The honest reading is "a handful of buildable phases plus a measurement gate", not "all 28 ready to go".

---

## What was done to this folder (the work history)

1. **Researched** the topic with the official multi-pass deep-research workflow.
2. **Scaffolded** all 28 phases to full detail so each is ready to pick up and build.
3. **Wrote** a changelog for every phase and wove the program into the parent planning docs.
4. **Reviewed** the whole packet with a 20-round deep review. It caught a real bookkeeping mistake (some docs claimed 100 percent done while others still said 5 percent and pointed at "start the research loop") and a few inaccurate scaffold details (a plan that said to add an export which already exists, a seam that needed to cover both metadata files not one, a reuse that crossed a code boundary). All of these were verified and fixed.

---

## Honest status

This is research only. Nothing is built and nothing is shipped. The only measurement that exists is the small census that sized the schema-check win, and the pass-or-fail outcomes that would prove each phase are SPECIFIED but not yet run. The one sure-thing improvement is turning on an existing schema check, once the few stale files it flags are cleaned up first. The search-tuning ideas stay switched off until a real production-mode measurement proves they help, because production trims results differently than the offline test harness does. The single biggest piece of value is the keystone: extend the live quality checker to the documents and JSON files it does not yet touch. The folder is a ready-to-build plan, not a delivered feature.
