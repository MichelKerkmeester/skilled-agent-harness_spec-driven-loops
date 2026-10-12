
# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
How should Skilled treat the sk-code surfaces for external repository users? The v4.0.0.4 release note entry "One Surface Order Everywhere" (.skilled/changelog/skilled/v4.0.0.4.md) says every sk-code file that ranks the code surfaces lists OpenCode, then Obsidian, then Webflow; a prompt matching two surfaces lists them in that order; on a keyword tie the session's current surface can lead via `compiled-route.cjs --surface-hint`. The operator says this is wrong for external users: sk-code-obsidian and sk-code-webflow are the operator's personal surfaces and serve only as examples, which an external user deletes and replaces with an sk-code surface for their own project, so the doctor and everything else in Skilled should assume they are gone. sk-code-opencode is the one native surface and, for users other than the operator, should have the LOWEST priority: a user's own non-native surface outranks it. sk-code-review, sk-code-quality and the shared/ layer are stack-agnostic and serve every user. Answer with path:line or command evidence: (1) every place that encodes the surface order or treats obsidian or webflow as installed: sk-code hub-router.json tieBreak, mode-registry.json, SKILL.md, ROUTER.md, shared/references (stack-detection.md), the compiled-routing manifest and runtime (.skilled/bin/compiled-route.cjs, .skilled/bin/lib/compiled-routing/), canary fixtures, the skill advisor (graph metadata, scorer boosts, batteries), the doctor commands and checks (.skilled/commands/doctor/), install guides, READMEs and the v4.0.0.4 note; (2) what breaks today when an external user deletes sk-code-obsidian and sk-code-webflow, observed in a throwaway copy outside the worktree (doctor checks, compiled-route-guard, route sync, canaries, advisor, package and parent-skill checks), and what happens when they add their own surface packet; (3) how a user-added surface should outrank sk-code-opencode: a priority or rank field in mode-registry.json, a native or fallback flag on opencode, a tieBreak derived when the manifest is minted, the --surface-hint path, or something else, compared on cost and risk with one recommendation; (4) how the operator's own repository keeps its current order with obsidian and webflow present while the shipped default assumes they are gone: configuration versus data, example versus shipped; (5) doctor and documentation changes that tell external users obsidian and webflow are examples to delete or replace, and how to scaffold their own surface (sk-doc create-skill, parent-skill mode packets); (6) ideas to reject, with reasons. Every recommendation must pass .skilled/repo-rules/prevent-overengineering.md: name the cheaper move and why it fails.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Where is the surface order (opencode, obsidian, webflow) encoded, and where are sk-code-obsidian and sk-code-webflow treated as installed?
- [x] Q2: What breaks when an external user deletes sk-code-obsidian and sk-code-webflow, observed in a throwaway copy, and what happens when they add their own surface?
- [x] Q3: How should a user-added surface outrank sk-code-opencode (registry priority field, native or fallback flag, tieBreak derived at mint time, --surface-hint, other), and which option is cheapest at acceptable risk?
- [x] Q4: How does the operator repository keep its current order while the shipped default assumes the examples are gone (configuration versus data, example versus shipped)?
- [x] Q5: Which doctor and documentation changes tell external users the two surfaces are examples, and how do they scaffold their own surface?
- [x] Q6: Which ideas should be rejected, and why?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
Changing any skill, script, command, README or release note; deleting anything inside the worktree; building the recommendation.

---

## 5. STOP CONDITIONS
Stop policy is max-iterations: all 10 iterations run. An unavailable executor or a usage limit stops the lineage with no substitute.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Where is the surface order (opencode, obsidian, webflow) encoded, and where are sk-code-obsidian and sk-code-webflow treated as installed?
- Q2: What breaks when an external user deletes sk-code-obsidian and sk-code-webflow, observed in a throwaway copy, and what happens when they add their own surface?
- Q3: How should a user-added surface outrank sk-code-opencode (registry priority field, native or fallback flag, tieBreak derived at mint time, --surface-hint, other), and which option is cheapest at acceptable risk?
- Q4: How does the operator repository keep its current order while the shipped default assumes the examples are gone (configuration versus data, example versus shipped)?
- Q5: Which doctor and documentation changes tell external users the two surfaces are examples, and how do they scaffold their own surface?
- Q6: Which ideas should be rejected, and why?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the named hub-root files directly first located the only true rank (`hub-router.json:7` + `stack-detection.md:39`) immediately, which then anchored the classification of every list as "variant" rather than "rank". The batch `cat` + overflow-grep pattern covered six remaining files in two calls. (iteration 1)
- reading the mint-side compiler before the runtime made the data/code split obvious — `tieBreak` goes in at `registry-compiler.cjs:261,265` and order comes out; the three live front-door runs then converted the static claim into observed behavior for the price of one exec. (iteration 2)
- the key-path JSON walk (`node -e` recursion printing `$.signals.sk-code[i]`) was the only cheap way to locate strings inside the single-line `skill-graph.json` (18,413 chars); a plain grep could not show where in the line the match sat. One call converted "the file mentions obsidian" into exact key paths. (iteration 3)
- the copy's baseline git commit made a cheap, decisive control — `git checkout` restored the packets and proved the manifest-test failure was a specs-exclusion artifact rather than a deletion break. The control/treatment pairs (guard pre/post, route pre/post) converted every claim into before/after evidence instead of inference. (iteration 4)
- reusing the iteration-4 copy with its baseline commit gave a decisive control pair for free — register (stale) vs `git checkout` restore (fresh) converted causality into before/after evidence inside one exec, and the guard's own message named the re-mint that then failed. (iteration 5)
- reading the mint chain and the runtime tests in three scoped batches converted "options" into exact touch-sites; the sk-doc derivation precedent was the decisive find for option (c) because it proves the derivation pattern ships in-tree today. (iteration 6)
- reading `update.md` and the phase assets before the engine gave the generated-versus-hand-written policy and the action semantics in one call; targeted greps of `release-update.cjs` converted "how does it treat a user-modified file" into an exact decision vocabulary and class-driven recommendation function. The `grep -c "example"` check was a cheap decisive negative for the example-unit concept. (iteration 7)
- targeted single-file greps after the broad hub grep hit nested packet READMEs (known walk-order effect) converted "where would the docs say X" into exact line anchors; opening the `/create:skill-parent` assets was the decisive find because it shows the add path is documented while the example marker is not. (iteration 8)
- one batched exec re-verified every anchor the recommendations cite, so the synthesis rests on lines opened this iteration; the two `rg` checks converted the carried "ROUTER §8–§11 open" into a decisive negative. (iteration 9)
- re-running the decisive command (copy deletion) rather than re-reading its summary converted the BREAK baseline from carried text into a re-observed fact with an exact failure count (113) — the strongest possible confirmation. The first no-op deletion attempt also proved the value of adversarial method: the path assumption, not the finding, was wrong. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- bare-basename grep globs (`{README.md,...}`) match at any depth, so walk order under the hit cap surfaced nested packet READMEs instead of the hub-root files — two sweep calls returned mostly noise ("example.com" fixtures, benchmark reports). (iteration 1)
- nothing failed; the budget ran 21 research/state calls because the focus names 12+ files (over the persona's 3–5 action target, at the config's 24 cap once writes are counted). (iteration 2)
- nothing failed; the 24-call cap was reached with 22 used because the focus names four subsystems. `.skilled/README.md` was named but absent — a reminder to `fs.existsSync` before reading dispatch-named paths. (iteration 3)
- the recipe's `specs` exclusion blocks the two commands whose authored sources live under `specs/` (sync, manifest test), so both needed a caveat rather than a verdict. The first probe pass also dropped the advisor section (a draft slip), costing an extra round. (iteration 4)
- the `specs`-excluded copy cannot exercise the mint path, so the successful-re-mint branch stayed unobserved; the scaffold-guide read covered only the first 130 lines of `sk-create-skill/SKILL.md`, leaving the deeper parent-skill references unread. (iteration 5)
- the successful re-mint branch still cannot be observed — the copy recipe excludes `specs/` and this run had no wall clock left for a full-tree copy; the mint prerequisite stays carried rather than resolved. (iteration 6)
- the middle 354 lines of the first combined read landed in the overflow file, so their content needed greps rather than a direct read; no full-tree copy probe ran (wall clock), so the re-mint prerequisite stays carried. (iteration 7)
- nothing failed; the broad `.skilled/skills/sk-code` grep exhausted its cap on nested packet READMEs first, costing one call before the targeted greps. (iteration 8)
- the combined `cat` of iterations 6–7 overflowed mid-file, costing a second read; the `prevent-overengineering` §2 text needed the overflow again — reading each prior iteration with the line-numbered read tool would have avoided both. (iteration 9)
- the addition half and the canary line range were not re-run — wall clock; both are named as carried so the next reader knows exactly what remains unverified. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `--surface-hint` as the tie fix: same legacy stub under a stale manifest. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `--surface-hint` as the tie fix: same legacy stub under a stale manifest.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `--surface-hint` as the tie fix: same legacy stub under a stale manifest.

### `.skilled/README.md` as a documentation surface — the path does not exist (row 10). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `.skilled/README.md` as a documentation surface — the path does not exist (row 10).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.skilled/README.md` as a documentation surface — the path does not exist (row 10).

### Broad repo-wide order grep before reading the named hub files: the bare-basename glob matched nested packet READMEs first and the 70-hit cap exhausted before the hub-root files; targeted reads were cheaper. (Evidence: grep result counts and file paths in Actions Taken item 4.) -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Broad repo-wide order grep before reading the named hub files: the bare-basename glob matched nested packet READMEs first and the 70-hit cap exhausted before the hub-root files; targeted reads were cheaper. (Evidence: grep result counts and file paths in Actions Taken item 4.)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broad repo-wide order grep before reading the named hub files: the bare-basename glob matched nested packet READMEs first and the 70-hit cap exhausted before the hub-root files; targeted reads were cheaper. (Evidence: grep result counts and file paths in Actions Taken item 4.)

### Checker-only downgrade of absent example surfaces: no example marker exists in the engine (iteration 7) and a blanket WARN would silence 3c. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Checker-only downgrade of absent example surfaces: no example marker exists in the engine (iteration 7) and a blanket WARN would silence 3c.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Checker-only downgrade of absent example surfaces: no example marker exists in the engine (iteration 7) and a blanket WARN would silence 3c.

### Confirmation, not re-entry: `--surface-hint` as the default tie fix stays blocked (strategy §9); the new evidence (matched-only test :79-83, opt-in pass-through) confirms it cannot be the shipped default. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Confirmation, not re-entry: `--surface-hint` as the default tie fix stays blocked (strategy §9); the new evidence (matched-only test :79-83, opt-in pass-through) confirms it cannot be the shipped default.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Confirmation, not re-entry: `--surface-hint` as the default tie fix stays blocked (strategy §9); the new evidence (matched-only test :79-83, opt-in pass-through) confirms it cannot be the shipped default.

### Deriving surface order from the installed packet set inside `/doctor:update`: the engine's unit universe is tree+base paths and it computes file status, not routing order. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Deriving surface order from the installed packet set inside `/doctor:update`: the engine's unit universe is tree+base paths and it computes file status, not routing order.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deriving surface order from the installed packet set inside `/doctor:update`: the engine's unit universe is tree+base paths and it computes file status, not routing order.

### Docs-only example markers as the whole fix: leaves the shipped data referencing the examples, so the carried delete-path failures stand. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Docs-only example markers as the whole fix: leaves the shipped data referencing the examples, so the carried delete-path failures stand.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Docs-only example markers as the whole fix: leaves the shipped data referencing the examples, so the carried delete-path failures stand.

### Docs-only insertion convention (insert before `sk-code-opencode` in `tieBreak` + `routerSignals`): two lists must agree and have already drifted in a sibling hub; insertion position is unenforced; stale-manifest stub on hand edit (carried). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Docs-only insertion convention (insert before `sk-code-opencode` in `tieBreak` + `routerSignals`): two lists must agree and have already drifted in a sibling hub; insertion position is unenforced; stale-manifest stub on hand edit (carried).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Docs-only insertion convention (insert before `sk-code-opencode` in `tieBreak` + `routerSignals`): two lists must agree and have already drifted in a sibling hub; insertion position is unenforced; stale-manifest stub on hand edit (carried).

### Docs-only registration instructions (hand-edit registry + router): observed to break routing entirely without a working mint. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Docs-only registration instructions (hand-edit registry + router): observed to break routing entirely without a working mint.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Docs-only registration instructions (hand-edit registry + router): observed to break routing entirely without a working mint.

### Expecting the compiled manifest to encode the surface order — it stores policy identity only (row 7). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Expecting the compiled manifest to encode the surface order — it stores policy identity only (row 7).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Expecting the compiled manifest to encode the surface order — it stores policy identity only (row 7).

### Hardcoded native-last rule in the shared compiler or runtime: forces the operator's order to change; the Q4 split is data. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Hardcoded native-last rule in the shared compiler or runtime: forces the operator's order to change; the Q4 split is data.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hardcoded native-last rule in the shared compiler or runtime: forces the operator's order to change; the Q4 split is data.

### Nine ideas rejected with reasons in the Q6 table; see the delta's `ruled_out` rows (config file, plugin system, flag, operator-repo removal, docs-only convention, hint-as-default, installed-set derivation, checker-only downgrade, examples schema). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Nine ideas rejected with reasons in the Q6 table; see the delta's `ruled_out` rows (config file, plugin system, flag, operator-repo removal, docs-only convention, hint-as-default, installed-set derivation, checker-only downgrade, examples schema).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Nine ideas rejected with reasons in the Q6 table; see the delta's `ruled_out` rows (config file, plugin system, flag, operator-repo removal, docs-only convention, hint-as-default, installed-set derivation, checker-only downgrade, examples schema).

### None definitively eliminated. The BREAK-class observation (deleting the two packets in a throwaway copy) was intentionally not attempted: this iteration's focus is the static hub inventory; the deletion experiment is Q2's focus. No throwaway copy was created. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None definitively eliminated. The BREAK-class observation (deleting the two packets in a throwaway copy) was intentionally not attempted: this iteration's focus is the static hub inventory; the deletion experiment is Q2's focus. No throwaway copy was created.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None definitively eliminated. The BREAK-class observation (deleting the two packets in a throwaway copy) was intentionally not attempted: this iteration's focus is the static hub inventory; the deletion experiment is Q2's focus. No throwaway copy was created.

### None newly eliminated beyond the above; the deletion experiment remains Q2's focus and was again not attempted. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: None newly eliminated beyond the above; the deletion experiment remains Q2's focus and was again not attempted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None newly eliminated beyond the above; the deletion experiment remains Q2's focus and was again not attempted.

### None newly eliminated beyond the ruled-out rows. The full-tree re-mint observation remains the one open angle for the A/C prerequisite (carried from iterations 5–6; not attempted this run — wall clock). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: None newly eliminated beyond the ruled-out rows. The full-tree re-mint observation remains the one open angle for the A/C prerequisite (carried from iterations 5–6; not attempted this run — wall clock).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None newly eliminated beyond the ruled-out rows. The full-tree re-mint observation remains the one open angle for the A/C prerequisite (carried from iterations 5–6; not attempted this run — wall clock).

### None newly eliminated this iteration; the full-tree re-mint observation remains the one open angle (Phase 0, carried). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: None newly eliminated this iteration; the full-tree re-mint observation remains the one open angle (Phase 0, carried).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None newly eliminated this iteration; the full-tree re-mint observation remains the one open angle (Phase 0, carried).

### None newly eliminated; the full-tree re-mint observation remains the one open angle for the Q3 prerequisite (carried, not attempted — wall clock). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: None newly eliminated; the full-tree re-mint observation remains the one open angle for the Q3 prerequisite (carried, not attempted — wall clock).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None newly eliminated; the full-tree re-mint observation remains the one open angle for the Q3 prerequisite (carried, not attempted — wall clock).

### None newly eliminated. The full-tree re-mint observation remains the one open angle (Phase 0, carried from iterations 5-9). -- BLOCKED (iteration 10, 1 attempts)
- What was tried: None newly eliminated. The full-tree re-mint observation remains the one open angle (Phase 0, carried from iterations 5-9).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None newly eliminated. The full-tree re-mint observation remains the one open angle (Phase 0, carried from iterations 5-9).

### None newly eliminated. The full-tree re-mint observation remains the one open angle for the A/C prerequisite (named for next focus). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: None newly eliminated. The full-tree re-mint observation remains the one open angle for the A/C prerequisite (named for next focus).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None newly eliminated. The full-tree re-mint observation remains the one open angle for the A/C prerequisite (named for next focus).

### Re-asking whether the parent-skill-check failure is deletion-caused: settled directly — exit 0 at baseline with packets present, exit 1 with 113 failures after deletion. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Re-asking whether the parent-skill-check failure is deletion-caused: settled directly — exit 0 at baseline with packets present, exit 1 with 113 failures after deletion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-asking whether the parent-skill-check failure is deletion-caused: settled directly — exit 0 at baseline with packets present, exit 1 with 113 failures after deletion.

### Re-reading the canary fixture :117-140 line range: path confirmed; the range remains carried (time budget). -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Re-reading the canary fixture :117-140 line range: path confirmed; the range remains carried (time budget).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-reading the canary fixture :117-140 line range: path confirmed; the range remains carried (time budget).

### Re-running the addition half (five new FAILs, 113 → 118): the scaffold + re-mint cycle would exceed the wall clock. Carried, not re-observed (iteration-005.md:24). -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Re-running the addition half (five new FAILs, 113 → 118): the scaffold + re-mint cycle would exceed the wall clock. Carried, not re-observed (iteration-005.md:24).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-running the addition half (five new FAILs, 113 → 118): the scaffold + re-mint cycle would exceed the wall clock. Carried, not re-observed (iteration-005.md:24).

### Reading `004-compiler-n1-shadow/compiler/order.cjs` as the surface rank — it is a UTF-16 string comparator (row 5). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Reading `004-compiler-n1-shadow/compiler/order.cjs` as the surface rank — it is a UTF-16 string comparator (row 5).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `004-compiler-n1-shadow/compiler/order.cjs` as the surface rank — it is a UTF-16 string comparator (row 5).

### Reading the advisor as a surface ranker — it has no surface ids and its surfaceHint is a pass-through to `compiled-route.cjs` (rows 4–5). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reading the advisor as a surface ranker — it has no surface ids and its surfaceHint is a pass-through to `compiled-route.cjs` (rows 4–5).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the advisor as a surface ranker — it has no surface ids and its surfaceHint is a pass-through to `compiled-route.cjs` (rows 4–5).

### README-only wording: `SKILL.md:40` is the pointer target every other doc defers to; a README-only edit leaves the hub contract unmarked. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: README-only wording: `SKILL.md:40` is the pointer target every other doc defers to; a README-only edit leaves the hub contract unmarked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: README-only wording: `SKILL.md:40` is the pointer target every other doc defers to; a README-only edit leaves the hub contract unmarked.

### Running the deletion experiment now — Q2's focus; not attempted, same call as iteration 1. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Running the deletion experiment now — Q2's focus; not attempted, same call as iteration 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running the deletion experiment now — Q2's focus; not attempted, same call as iteration 1.

### Searching the compiled-routing runtime for a hardcoded surface order: none exists. The order enters as data (hub tieBreak) and leaves as data; only the comparator and the hint reorder are code (rows 1–3, 5). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Searching the compiled-routing runtime for a hardcoded surface order: none exists. The order enters as data (hub tieBreak) and leaves as data; only the comparator and the hint reorder are code (rows 1–3, 5).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching the compiled-routing runtime for a hardcoded surface order: none exists. The order enters as data (hub tieBreak) and leaves as data; only the comparator and the hint reorder are code (rows 1–3, 5).

### The mint path cannot be judged inside a `specs`-excluded copy; candidate for the reducer: "re-mint verification requires a full-tree copy" (not promoted to exhausted — one more angle remains). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The mint path cannot be judged inside a `specs`-excluded copy; candidate for the reducer: "re-mint verification requires a full-tree copy" (not promoted to exhausted — one more angle remains).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The mint path cannot be judged inside a `specs`-excluded copy; candidate for the reducer: "re-mint verification requires a full-tree copy" (not promoted to exhausted — one more angle remains).

### Treating `/doctor:update` as an operator/external split mechanism: its decisions are per-checkout and uniform; no example-unit class and no operator-specific layer exist. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating `/doctor:update` as an operator/external split mechanism: its decisions are per-checkout and uniform; no example-unit class and no operator-specific layer exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `/doctor:update` as an operator/external split mechanism: its decisions are per-checkout and uniform; no example-unit class and no operator-specific layer exist.

### Treating `mode-registry.json:19` `surfaces` array as the ranking: it is a declaration list; the rank lives in `hub-router.json:7` tieBreak plus the `stack-detection.md:39` precedence. Conflating them would misstate the v4.0.0.4 claim's accuracy. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `mode-registry.json:19` `surfaces` array as the ranking: it is a declaration list; the rank lives in `hub-router.json:7` tieBreak plus the `stack-detection.md:39` precedence. Conflating them would misstate the v4.0.0.4 claim's accuracy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `mode-registry.json:19` `surfaces` array as the ranking: it is a declaration list; the rank lives in `hub-router.json:7` tieBreak plus the `stack-detection.md:39` precedence. Conflating them would misstate the v4.0.0.4 claim's accuracy.

### Treating the advisor's `webflow cms` disambiguation as surface-order evidence — it routes to mcp-code-mode and penalizes sk-code (row 3). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the advisor's `webflow cms` disambiguation as surface-order evidence — it routes to mcp-code-mode and penalizes sk-code (row 3).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the advisor's `webflow cms` disambiguation as surface-order evidence — it routes to mcp-code-mode and penalizes sk-code (row 3).

### Treating the sync failure as deletion-caused: it fails for all seven hubs with the examples present in the authored inputs. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the sync failure as deletion-caused: it fails for all seven hubs with the examples present in the authored inputs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the sync failure as deletion-caused: it fails for all seven hubs with the examples present in the authored inputs.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Broad repo-wide order grep before reading the named hub files: the bare-basename glob matched nested packet READMEs first and the 70-hit cap exhausted before the hub-root files; targeted reads were cheaper. (Evidence: grep result counts and file paths in Actions Taken item 4.) (iteration 1)
- None definitively eliminated. The BREAK-class observation (deleting the two packets in a throwaway copy) was intentionally not attempted: this iteration's focus is the static hub inventory; the deletion experiment is Q2's focus. No throwaway copy was created. (iteration 1)
- Treating `mode-registry.json:19` `surfaces` array as the ranking: it is a declaration list; the rank lives in `hub-router.json:7` tieBreak plus the `stack-detection.md:39` precedence. Conflating them would misstate the v4.0.0.4 claim's accuracy. (iteration 1)
- Expecting the compiled manifest to encode the surface order — it stores policy identity only (row 7). (iteration 2)
- Reading `004-compiler-n1-shadow/compiler/order.cjs` as the surface rank — it is a UTF-16 string comparator (row 5). (iteration 2)
- Running the deletion experiment now — Q2's focus; not attempted, same call as iteration 1. (iteration 2)
- Searching the compiled-routing runtime for a hardcoded surface order: none exists. The order enters as data (hub tieBreak) and leaves as data; only the comparator and the hint reorder are code (rows 1–3, 5). (iteration 2)
- `.skilled/README.md` as a documentation surface — the path does not exist (row 10). (iteration 3)
- None newly eliminated beyond the above; the deletion experiment remains Q2's focus and was again not attempted. (iteration 3)
- Reading the advisor as a surface ranker — it has no surface ids and its surfaceHint is a pass-through to `compiled-route.cjs` (rows 4–5). (iteration 3)
- Treating the advisor's `webflow cms` disambiguation as surface-order evidence — it routes to mcp-code-mode and penalizes sk-code (row 3). (iteration 3)
- `--surface-hint` as the tie fix: same legacy stub under a stale manifest. (iteration 5)
- Docs-only registration instructions (hand-edit registry + router): observed to break routing entirely without a working mint. (iteration 5)
- The mint path cannot be judged inside a `specs`-excluded copy; candidate for the reducer: "re-mint verification requires a full-tree copy" (not promoted to exhausted — one more angle remains). (iteration 5)
- Treating the sync failure as deletion-caused: it fails for all seven hubs with the examples present in the authored inputs. (iteration 5)
- Confirmation, not re-entry: `--surface-hint` as the default tie fix stays blocked (strategy §9); the new evidence (matched-only test :79-83, opt-in pass-through) confirms it cannot be the shipped default. (iteration 6)
- Docs-only insertion convention (insert before `sk-code-opencode` in `tieBreak` + `routerSignals`): two lists must agree and have already drifted in a sibling hub; insertion position is unenforced; stale-manifest stub on hand edit (carried). (iteration 6)
- Hardcoded native-last rule in the shared compiler or runtime: forces the operator's order to change; the Q4 split is data. (iteration 6)
- None newly eliminated. The full-tree re-mint observation remains the one open angle for the A/C prerequisite (named for next focus). (iteration 6)
- Deriving surface order from the installed packet set inside `/doctor:update`: the engine's unit universe is tree+base paths and it computes file status, not routing order. (iteration 7)
- None newly eliminated beyond the ruled-out rows. The full-tree re-mint observation remains the one open angle for the A/C prerequisite (carried from iterations 5–6; not attempted this run — wall clock). (iteration 7)
- Treating `/doctor:update` as an operator/external split mechanism: its decisions are per-checkout and uniform; no example-unit class and no operator-specific layer exist. (iteration 7)
- Checker-only downgrade of absent example surfaces: no example marker exists in the engine (iteration 7) and a blanket WARN would silence 3c. (iteration 8)
- Docs-only example markers as the whole fix: leaves the shipped data referencing the examples, so the carried delete-path failures stand. (iteration 8)
- None newly eliminated; the full-tree re-mint observation remains the one open angle for the Q3 prerequisite (carried, not attempted — wall clock). (iteration 8)
- README-only wording: `SKILL.md:40` is the pointer target every other doc defers to; a README-only edit leaves the hub contract unmarked. (iteration 8)
- Nine ideas rejected with reasons in the Q6 table; see the delta's `ruled_out` rows (config file, plugin system, flag, operator-repo removal, docs-only convention, hint-as-default, installed-set derivation, checker-only downgrade, examples schema). (iteration 9)
- None newly eliminated this iteration; the full-tree re-mint observation remains the one open angle (Phase 0, carried). (iteration 9)
- None newly eliminated. The full-tree re-mint observation remains the one open angle (Phase 0, carried from iterations 5-9). (iteration 10)
- Re-asking whether the parent-skill-check failure is deletion-caused: settled directly — exit 0 at baseline with packets present, exit 1 with 113 failures after deletion. (iteration 10)
- Re-reading the canary fixture :117-140 line range: path confirmed; the range remains carried (time budget). (iteration 10)
- Re-running the addition half (five new FAILs, 113 → 118): the scaffold + re-mint cycle would exceed the wall clock. Carried, not re-observed (iteration-005.md:24). (iteration 10)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Q1 (part 2: `.skilled/bin/compiled-route.cjs`, `.skilled/bin/lib/compiled-routing/`, compiled manifest, canary fixtures, advisor scorer/boosts/batteries, `.skilled/commands/doctor/`, install guides/READMEs) (iteration 1)
- Q2, Q3, Q4, Q5, Q6 — untouched this iteration. (iteration 1)
- Q1 (advisor scorer/boosts/batteries, doctor commands, install guides/READMEs; `ROUTER.md` §8–§11) (iteration 2)
- Q1 (`ROUTER.md:265-618` §8–§11 only) (iteration 3)
- Q2 part 2: what happens when an external user adds their own surface packet (scaffold path, registry edit, re-mint, doctor). (iteration 4)
- Q1 (`ROUTER.md:265-618` §8–§11 only) — still open from iteration 3. (iteration 4)
- Q3, Q4, Q5, Q6 — untouched. (iteration 4)
- Q3 (now with observed cost data for every option), Q4, Q5, Q6 — untouched. (iteration 5)
- Q4, Q5, Q6 — untouched. (iteration 6)
- Q5, Q6 — untouched (Q5 now has a sharper shape: no example marker exists anywhere in the update engine, so Q5's doc/scaffold changes must add the signal). (iteration 7)
- Q1 (`ROUTER.md:265-618` §8–§11 only) — still open from iterations 3-4. (iteration 8)
- Q6 — ideas to reject, with reasons (options 3-4 above are candidates; the final iteration can consolidate). (iteration 8)
- None — 6/6 answered (Q2–Q5 in iterations 5–8; Q1 and Q6 this iteration). The full-tree re-mint verification remains an unobserved deployment prerequisite (Phase 0), not an open key question. (iteration 9)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior work: the v4.0.0.4 release note section "One Surface Order Everywhere"; the session-aware tie-break built in specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation; routing parity work in 021-open-ends-remediation. resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-10-12T16:28:06.444Z
