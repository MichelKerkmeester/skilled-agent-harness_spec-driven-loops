# Iteration 008 — Adherence evidence inside specs/: who actually honors the covenant (angle 7)

Session: fanout-glm-5-3-flash-overengineering-1788746122749-wk19z4 | run 8 | focus: placeholders left, criteria never marked Met, checklists unticked, fingerprints never recorded — measured, not asserted
Evidence reads: this packet's six docs (wc/greps), the 5-criteria ledger + closure statement, the 5-packet 035 track census, the corpus-wide implementation-summary/fingerprint census (2,874 files), acceptance-criteria.md's own waiver protocol. Reads cost: 3 shell calls.

## What exists (the governed corpus, measured)

- **2,874 packets** carry `implementation-summary.md` under specs/ (excluding research/ subtrees). **1,790 (62.2%)** carry the all-zero `sha256:0000…` fingerprint — the value `validation-rules.md:113` defines as "never recorded". 1,084 (37.8%) carry real fingerprints (samples: `specs/cli-external-orchestration/028-cli-hub-rename/002-advisor-realign` = `sha256:56e8ccee`, `065-retire-gemini-devin-route` = `sha256:64a04b8b`, `z_archive/021-cli-gemini-deprecation/002-…` = `sha256:b93242c5`).
- The 035 track (this research's home) = 5 packets (001-005), ALL: `<!-- SPECKIT_LEVEL: 2 -->`, unticked/ticked tasks = 20/3, criteria-mention counts 3/6, all-zero fingerprints, identical 10-doc layouts (spec, plan, tasks, acceptance-criteria, implementation-summary, goal, description.json, graph-metadata.json, research/, scratch/).
- 005 (this packet): criteria ledger = 5 AC rows (`grep -cE "^\| *AC-"` = 5); its own protocol: "every row below is `Met`, `Waived` or `Superseded`" (`acceptance-criteria.md:65-73`), waiver requires a named ADR, "an unbacked waiver is treated as an unmet criterion" (:72-74); closure statement: "**Closeable:** No" (:83-84), "Written when the packet is closed, not before" (:85); continuity frontmatter: `recent_action: "Authored the acceptance criteria for this packet"`, `next_safe_action: "Meet the open criteria as the lane runs"` (:22-23), `last_updated_by: "claude-fable-5-1"`, fingerprint = zero (:25-26); placeholder residue in implementation-summary.md: **0**.

## Findings

**F27 [P2 — candidate, the duty-cycle datum] 62% of the governed corpus has never recorded a continuity fingerprint — the freshness covenant's machinery guards a surface that is 62% no-op by its own rule's definition.**
- Where: 1,790 of 2,874 `implementation-summary.md` files with `sha256:0{4,}` (counted); the covenant: `validation-rules.md:113` ("The zero fingerprint placeholder is treated as never recorded and does not produce stale warnings"), the governance freshness clause (COMPLETION VERIFICATION RULE item 4: fingerprint-match + packet-scoped paths clean), `SPECKIT_COMPLETION_FRESHNESS`/`_ENFORCE` (both default `false`, `validation-rules.md:126-127`).
- Cost: the freshness machinery (registry rule + drift guard + "4-ways-a-run-lies" #4 + the generator's recomputation) delivers comparisons on 1,084 of 2,874 governed packets; 1,790 produce the covenant's own "no data"答案. Reads: every completion-claim discussion walks the freshness covenant whether or not the packet ever recorded a fingerprint (62% chance it didn't).
- Protects: stale-continuity detection at completion — exercised by the 38% (1,084 packets of recorded work).
- Recommendation: **keep** (1,084 worked samples = the covenant validated where it matters), noting the measured 62% no-op duty cycle as the machinery's true cost basis; if a future revision adds freshness plumbing, this 62% is the number that says how much of the corpus it will actually touch.

**F28 [P2 — candidate] The covenant's home track: 5 packets, 0 executed — the authoring pass IS the recorded work; the research this lineage produces is the first criterion work the lane will see.**
- Where: `specs/system-speckit/035-…/001-…005-…` — identical Level 2, 20/3 unticked, zero fingerprints, 10-doc layouts; 005's continuity: `recent_action: "Authored the acceptance criteria…"`, `next_safe_action: "Meet the open criteria as the lane runs"` (acceptance-criteria.md:22-23); closure: "Closeable: No" (:83).
- Cost: 5×10 = 50 authored documents in a track whose criterion-execution count is 0/5 (the 3 "Met"-mention rows are the authoring criteria); the covenant's authoring-vs-execution ratio in its home track = 50:0. Reads: any auditor of "does the covenant hold" must first discover that the home track samples the *scaffolding* covenant, not the *execution* covenant.
- Protects: the scaffolding honesty (nothing here is faked: closure says No, fingerprint says never-recorded, no placeholder debt).
- Recommendation: **keep** — recorded as the base-rate caveat for every "does the covenant hold" claim: the 035 track measures authoring adherence; execution adherence lives in the 1,084 fingerprinted packets (F27's 38%).

**F29 [P2 — the positive control] Where the covenant mechanisms fire, honesty is mechanical: zero placeholder debt, a closure statement that cannot claim itself, waivers that fail validation without an ADR.**
- Where: `acceptance-criteria.md:65-74` (Met/Waived/Superseded + "an unbacked waiver is treated as an unmet criterion"), :83-85 ("**Closeable:** No… Written when the packet is closed, not before"); `implementation-summary.md` placeholder census = 0 (`grep -cE "\[###|TBD|PLACEHOLDER"` = 0); the intake contract's planning-vs-closeout placeholder distinction (intake-contract.md:112) honored.
- Cost: (the+ side) — the machinery makes the honest state the default; the reader cost of the closure statement is 3 lines.
- Protects: completion-claim honesty — the mechanism the F27 62% proves is only 38%-exercised, but where exercised, unfaked in this sample.
- Recommendation: **keep** — this is the affirmative evidence that the covenant's design (anchors + closure + waiver-ADR + fingerprint) improves AI adherence *in practice*, which is the strongest argument for the machinery F18/F24 flag as overbuilt at the edges.

## Corrections

- Run-8's interim "criteria: Met=3/Open=6" counts included legend/protocol words (acceptance-criteria.md:65-73); the clean datum is 5 criterion rows + "Closeable: No". The 3/6 mention-counts are recorded as noisy, superseded by :83-84.
- `goal.md` is a produced template (`templates/spec-kit-docs.json:21,158-159`: `"goal.md": {"template": "goal.md.tmpl"}`) — the run-5 phantom-hypothesis is dead; the 10-doc layouts of 001-005 are all legitimately templated.

## Census carried (run 9)

- `sha256:56e8ccee` appears in TWO different packets (`028-cli-hub-rename/002-advisor-realign` and `…/004-verify-closeout`): legitimate shared content or a fingerprint collision — 1 diff away, unresolved (recorded UNKNOWN).
- The four quality/evaluation apparatuses' adoption (tests/ vs benchmark/ vs playbook vs optimizer-replay): which does an editor actually rerun?
