I could not edit anything, and the operator is partly right on each point. The fix I recommend is mostly cutting repeated text, not adding new files. Marks: (C) means I read it or ran it, (I) means inferred.

## A. Routing inventory

The routing makes five decisions. Each one is restated in two to six places.

| Decision | Mechanisms | Read by |
|---|---|---|
| D1. Which skill | `graph-metadata.json` `intent_signals` and `derived.trigger_phrases` (C) | advisor script |
| D2. Which mode or packets | `compiled-route.cjs`, compiled from `mode-registry.json`, `hub-router.json` and the hub SKILL.md bytes (`build-artifacts.cjs:52-66`) (C). The `hub-router.json` signals, classes and `routerPolicy` (C). Hub SKILL.md pseudocode `route()` at `SKILL.md:76-134` (C). Registry `aliases[]` (C). The "Keyword triggers:" lines at `sk-code-quality/SKILL.md:30` and `sk-code-review/SKILL.md:29` (C). | compiler, replay and model |
| D3. Which surface | `shared/references/stack-detection.md`, which the model runs and passes on as `--surface-hint` (`SKILL.md:62`) (C). Registry `surfaceDetection` (C). The `quality-gate.cjs --explain` resolver (C). The review pseudocode `surface_evidence()` at `sk-code-review/SKILL.md:275-291` (C). | script and model |
| D4. Which leaf files | ROUTER.md prose §2-§4 and its machine block §9 (C). Every packet's own `INTENT_SIGNALS`/`RESOURCE_MAP` and its "Resource Loading Levels" table (C). Review's `ON_DEMAND_KEYWORDS` and `SK_CODE_REVIEW_DEPTH` (C). | model, plus guards that parse it |
| D5. Which checklists per file | `--explain`, reading registry `quality.checklists` and `quality-defaults.json` (C). The quality SKILL.md table at `:110-118` (C). The skilled §5 table (C). The ROUTER.md CODE_QUALITY overlay at `:121` (C). | script, model, and one test |

Several things I was asked about are not routing deciders:
- **ROUTER.md.** sk-code already has one, `router_state: active`, 394 lines (C). No mode packet has its own anywhere in `.skilled/skills` (C).
- **`leaf-aliases.json`.** It does not exist in sk-code (C).
- **`leaf-manifest.json`.** It is generated and checked, and it decides nothing (C).
- **"Keyword triggers:" lines.** I found no parser for them (I). In sk-code they are model-only.

Places that restate the same decision and have already drifted (all C):
- **CI vocabulary is kept in four lists:**
  - `mode-registry.json`, about 59 aliases.
  - `hub-router.json:77`.
  - `ROUTER.md:61` and again at `:252`.
  - `sk-code-ci/SKILL.md:61`, with only 12 keywords.
- **ROUTER.md §2 has intents that §9 lacks.** §2 lists TESTING and LANGUAGE_STANDARDS (`:57`, `:60`), which have no §9 key. ROUTER.md says itself that §9 is lossy and carries neither the +5 boost nor the doc-only anti-signals (`:225-228`).
- **The two docs disagree on which source is authoritative.** The hub says the registry is "the single source of truth" (`SKILL.md:54`). Review says "Keep Section 2 (`SMART ROUTING`) as the authoritative routing source" (`sk-code-review/SKILL.md:612`).

So there are not too many kinds of routing. The same decision is written down too many times.

## B. What enforces the current shape

All of these were run or read (C):
- **`parent-skill-check.cjs`** passes 0 warnings. Check 12a needs the root ROUTER.md (`:1785-1840`). Check 5k-alias needs registry aliases to be a subset of the `hub-router` classes.
- **`verify-router-sync.cjs`** passes 5/5. It reads each packet's router from `<packet>/SKILL.md` (`:47`).
  - Leg 1b fails on any reference doc that no router names.
  - Leg 2 needs the hub map to equal the union of the surface maps plus `SHARED_CONTROL_RESOURCES`.
  - So the quality "thin router" is load-bearing, even though it calls the replay "retired" (`sk-code-quality/SKILL.md:154`). The replay is live in `router-replay-lib.cjs`.
- **`parseRouter`** (`router-replay-lib.cjs:397-436`) reads the block from inside SKILL.md first. Its fallback pointer regex only accepts `references/*.md` (`:374`). A packet-root ROUTER.md would be invisible to it.
- **`compiled-route-guard.cjs`** reports sk-code fresh. The compiler hashes the hub SKILL.md, so any edit to it needs a re-mint through `compiled-route-sync.cjs`. Packet SKILL.md files are not hashed (C, from `build-artifacts.cjs`).
- **`package_skill.py:69,181-185`** needs a standalone `SMART ROUTING` H2 containing the words `discover_markdown_resources`, `_guard_in_skill` and `UNKNOWN_FALLBACK`.
- **The canon** says the stage-two doc is "first-class at the hub root as `ROUTER.md`, never at a nested path" (`parent-skill-root-router-template.md:19-20`).
- **`/doctor:skill-advisor router-reach`** reads `.skilled/skills/*/ROUTER.md` (`doctor-router-reach.yaml:65`).
- **`check-rule-copies.js`** pins the review Extension Floors lines word for word (`sk-code-review/SKILL.md:583`).
- **Hermes** keeps plain-file copies at `.hermes/skills/sk-code*/SKILL.md` (C). Which generator writes them is UNKNOWN.

sk-doc explains why its ROUTER.md is separate (`sk-doc/SKILL.md:65`): the replay reads the mode from `hub-router.json` and the leaf sets from that doc. That reasoning carries over to sk-code's hub level, which already follows it. It does not support a ROUTER.md per mode.

## C. Readability

**Routing comes before the instructions** (C):

| Packet | Lines of routing | Share of the file | First instruction |
|---|---|---|---|
| review | 364 | 50% | line 418 |
| skilled | 123 | 54% | |
| quality | 130 | 37% | |

**Other problems** (C):
- **The same tables appear several times.** The checklist lists and the Rust and TypeScript file lists appear in four docs.
- **Jargon is used before it is defined.** Examples: "MODE child", "evidence-base", "two axes", "floor", "default lens".
- **Old project history sits inside instructions.**
- **The README contradicts the SKILL.md.** The quality README puts "unchecked generated drift or missing checklist evidence" under P0 (`README.md:81`). Its SKILL.md calls those UNVERIFIED (`:209`).

Four quoted passages:
1. "`quality` is the author-side quality gate MODE child of the `sk-code` family. It runs after the acting agent applying `workflow-implement.md` changes the code…" (`sk-code-quality/SKILL.md:15`)
2. "One skill, two axes, one shared surface-detection router, and one advisor identity." (`SKILL.md:15`)
3. "The router-sync guard … restores the four checks of the `sk-code-router-sync.vitest.ts` suite, which was deleted, and the wrapper runs every leg of it (1a, 1b, 2, 3 and 4)" (`sk-code-skilled/SKILL.md:178`, part of one bullet of about 250 words)
4. "STEP 0: Load the `sk-code-review` mode baseline + `sk-code` surface evidence. A dispatcher adds `CODE-REVIEW\n\n`, the marker line and one blank line, as the first two lines…" (`sk-code-review/SKILL.md:69`, five sentences inside an ASCII tree)

The READMEs read noticeably better than the SKILL.md files (C).

## D. Recommendation

### Where routing should live

- **Keep the one hub ROUTER.md.**
- **Do not add a ROUTER.md per mode.** The canon forbids nested routers, `parseRouter` cannot see one, and it would add a fifth place to restate D4.
- **Shrink each mode's routing in place instead:**
  - §2 SMART ROUTING becomes 8 to 12 lines. It says the hub picks the mode, `--explain` picks the checklists, and which few files to load first. It keeps the three marker words in one call-sequence line.
  - The Python block moves to a final appendix such as `## 9. MACHINE ROUTER`. The guard reads the whole SKILL.md text, so this should cost no tooling change (I). Confirm by rerunning `verify-router-sync.cjs`.

Reduce routing to three kinds:
1. JSON for stage one: `hub-router.json`, `mode-registry.json` and the compiled router.
2. The hub ROUTER.md for stage two.
3. Script resolvers: `--explain` and the quality runner.

What to remove:
- The hub `route()` pseudocode, which restates `compiled-route.cjs`.
- The per-packet loading tables that restate `--explain`.
- Review's 280-line resolver pseudocode. The override algorithm moves to `review-core.md` §8 or into a script.
- The "Keyword triggers:" lines, or else declare them the source of truth as sk-doc does.
- Three of the four CI lists. Keep `hub-router.json` as the source, which check 5k-alias already pins.

### Target shape

| Where | What goes there |
|---|---|
| SKILL.md | When to use, the steps, rules, the output contract, a short §2, then the machine block as the appendix |
| ROUTER.md | Intents, leaf maps and shared controls. Its §2 and §9 must agree, or §2 is generated from §9 |
| JSON only | Mode selection, aliases, tie-break, surface markers and checklist rows |

### The JSON-only option

My verdict is that JSON-only is viable with named gaps, as a hybrid. Pure JSON-only is not viable today.

**Already deterministic and only restated in prose** (C):
- Mode selection, including defer. The prompt "help me with code" returned `defer`. "review my typescript module" returned the surface bundle `[sk-code-review, sk-code-skilled]`.
- Tie-break and `defaultMode: null`.
- Surface markers.
- Checklist rows.

**Not expressible in today's JSON:**
- The +5 phase boost and the doc-only anti-signals, which ROUTER.md admits it cannot project (`:225-228`) (C).
- The exception "keep sk-code if the request also changes code" (`ROUTER.md:83`) (C).
- What to ask after a defer. The compiled router returns only `defer`, and the questions live in prose (C).
- Reading file content for language sub-detection (I).
- Escalating an override conflict in review (C).

**Stage-two leaf choice has no runtime script.** The compiled router emits packets, not leaves (C). The replay library is a test harness (I).

**JSON-only also breaks checks** (C):
- RRC-001 if ROUTER.md goes away.
- router-reach.
- `package_skill` markers.
- Leg 2. It fails on empty `SHARED_CONTROL_RESOURCES`, so even the canon's `stage1-only` posture breaks it (`verify-router-sync.cjs:198`).

**The hybrid holds up.** JSON decides. The prose explains the judgment calls in a few lines next to the data. The model handles defer questions and anti-signals.

### What breaks, and the order

1. Merge the CI lists into one. Fix the ROUTER.md §2 and §9 drift. Rerun `verify-router-sync.cjs` and `parent-skill-check.cjs`.
2. Restructure review, then quality, skilled and ci, one packet at a time. Leave the pinned Extension Floors lines word for word, or update `check-rule-copies.js` in the same change.
3. Do the prose pass.
4. Run the checks:
   - `run-all-drift-guards.sh`
   - `package_skill.py --strict`
   - `quality-checklist-map.test.cjs`
   - `verify-doc-claims.cjs`
   - `compiled-route-guard.cjs`, re-minting if the hub SKILL.md changed.
5. Regenerate the Hermes copies.
6. Bump packet versions and changelogs. Check 13d compares them.

### Clarity rules

1. Instructions come first and the machine block goes last.
2. State each fact once and link to it everywhere else.
3. One idea per sentence. Split anything over about 30 words.
4. Define each term once, in one hub glossary.
5. Speak to the reader as "you", not "the acting agent applying…".
6. No project history inside instructions.
7. Use code blocks only for something a person runs or a parser reads.

Before (`sk-code-quality/SKILL.md:15`): "`quality` is the author-side quality gate MODE child of the `sk-code` family. It runs after the acting agent applying `workflow-implement.md` changes the code and before the surface's verification workflow or done-claim…"

After: "Run this mode after you change code and before you say it is done. It runs the quality runner on your change and loads the checklists the runner names. You then fix what fails in the files you already touched. It writes no new files and writes no review. For a review, use `sk-code-review`."

**On `sk-create-with-human-voice`:** yes for the prose. It does not own document structure, so pair it with sk-doc's document-quality mode. Keep it away from code blocks and pinned lines.

### Risks and what I could not confirm

- **Moving the machine block may not be free.** I did not test that moving it inside SKILL.md leaves `parseRouter` working, or whether `package_skill` checks section order.
- **Hermes generator.** Which script writes the Hermes copies is UNKNOWN.
- **Keyword-trigger readers.** I did not confirm that nothing reads the "Keyword triggers:" lines. My search found no parser.
- **Pinned review lines.** Any wording change to the Extension Floors lines fails `check-rule-copies.js`.
- **Compiled router fallback.** Editing the hub SKILL.md without a re-mint silently drops the hub to the legacy router. The guard is the only signal.
- **One hub is stale.** `system-deep-loop` reports a stale compiled manifest today. It is unrelated to sk-code, but a whole-repo guard run will show it.

The operator's next step is to choose between this hybrid and a per-mode ROUTER.md before any edits start.