# Iteration 005 — cli-classifier / cli-jev: router phrases, Jev switches, hub canon

Iteration 5 of 10 · mode=research · focus: `.skilled/skills/cli-classifier/**` against v4.0.0.2, v4.0.0.3 and v4.0.1.0.

## Focus

Close the standing question on the classifier cluster: do the router phrases, the Jev feature
switches and the stored-key behaviour in `.skilled/skills/cli-classifier/**` match the release
notes and the hub's own `hub-router.json`, `mode-registry.json` and `ROUTER.md`? Three checks were
planned: (1) the phrasings v4.0.0.2 claims to have fixed, exercised live through the compiled
route and the skill advisor; (2) the four Jev features, their off switches and where a stored key
is read; (3) hub canon — whether the three routing documents agree with each other and with the
mode packet's own `ROUTER.md`.

## Actions Taken

1. Read the three release notes in scope — `.skilled/changelog/skilled/v4.0.0.2.md`,
   `v4.0.0.3.md`, `v4.0.1.0.md` — for the cli-jev, Jev-feature and ROUTER.md sections.
2. Enumerated the hub tree and opened `SKILL.md`, `ROUTER.md`, `hub-router.json`,
   `mode-registry.json`, `leaf-manifest.json`, `description.json` and the mode packet's
   `cli-jev/ROUTER.md`.
3. Ran the live route for the phrasing claims:
   `node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "<phrase>"` for
   "ask jev whether this is safe", "through jev, classify this prompt", "use jev to pick a queue",
   then for three stage-2 question-shaping phrases.
4. Ran `node .skilled/bin/skill-advisor.cjs advisor_recommend` for the same two prompts and read
   the rank order, scores and confidences.
5. Opened `shared/scripts/jev-features.mjs` (switch resolution and the feature table), grepped the
   four documented switch names across `.skilled/`, and read the Jev block of
   `.skilled/hooks/hook-flags.env`.
6. Path-limited `git diff --stat bcb775402e 7980001709 -- .skilled/skills/cli-classifier` to see
   where the v4.0.0.2 routing fix actually landed. **Result: no change under
   `.skilled/skills/cli-classifier`.** The fix landed in
   `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-jev/manifest.json`,
   `compiled-route.cjs`, the advisor launcher and the advisor runtime — the compiled-route layer,
   not the authored routing data.

## Findings

### F1 — Bug, P1: the stage-1 vocabulary cannot reach three advertised question-shaping phrases; the only live router answers `defer`

v4.0.1.0 moved each hub's routing words into one checked place (`hub-router.json`) and made
`ROUTER.md` the stage-2 leaf router. The stage-2 intent model advertises five `JEV_QUESTION`
phrases — "jev pick one", "jev options", "jev question", "shape a jev question", "jev batch",
"jev run", "several jev questions", "jev question card" [SOURCE: .skilled/skills/cli-classifier/ROUTER.md:68].
The stage-1 class that must fire first, `jev-dispatch`, contains none of `jev batch`,
`jev pick one` or `jev options` [SOURCE: .skilled/skills/cli-classifier/hub-router.json:37].
`routerPolicy.defaultMode` is `null`, so a phrase stage 1 does not recognise defers instead of
falling through to stage 2.

Live evidence (this iteration):

```
$ node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "jev batch of three questions"
{"hubId":"cli-classifier","action":"defer"}          # no targets
$ ... --prompt "jev pick one of these queues"        → defer
$ ... --prompt "jev options for this question"       → defer
```

Three of the mode's advertised entry phrases are unreachable through the only live routing path.
`ROUTER.md:68` and `hub-router.json:37` disagree by construction, and no check compares them:
the stage-2 phrase list is an allowed superset of stage 1's by design, but the reverse (a stage-2
phrase with no stage-1 carrier) is silent and fatal because `defaultMode` is `null`.
Introduced: the hub split in v4.0.0.3, untouched by v4.0.1.0. Confidence 0.9.
Verify: the three commands above, all of which print `defer`.

### F2 — Drift, P2: the mode's own `ROUTER.md` still carries the pre-v4.0.0.2 keyword set

v4.0.0.2 states cli-jev "now answers 'ask jev', 'use jev', 'with jev' and 'through jev', where its
router passed on six of the eight phrasings the skill advertises"
[SOURCE: .skilled/changelog/skilled/v4.0.0.2.md:190], and the fix is real on the compiled path (all
four phrases route to `cli-jev` in the live run below). But v4.0.1.0's canon is that every skill
routes from its own `ROUTER.md`. The mode packet's `JEV_JUDGMENT` row still lists ten keywords and
omits `use jev`, `with jev`, `through jev`, `does jev use`, `run jev`, `jev dispatch` and
`jev judgment call`, all of which the hub-level stage-2 row carries
[SOURCE: .skilled/skills/cli-classifier/cli-jev/ROUTER.md:117] versus
[SOURCE: .skilled/skills/cli-classifier/ROUTER.md:67]. The `git diff` between the v4.0.0.1 and
v4.0.0.2 tags confirms why: no file under `.skilled/skills/cli-classifier` changed in that release,
so the authored router data was never corrected — only the compiled route was. A reader or replay
that follows the mode's own router therefore still passes on forty percent of the phrases the
release says are fixed. Introduced: v4.0.0.2 (partial fix). Confidence 0.85.
Verify: `node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "through jev, classify this prompt"`
routes today, while `grep -n "through jev" .skilled/skills/cli-classifier/cli-jev/ROUTER.md`
returns nothing.

Live run backing the compiled-path half of this finding:

```
ask jev whether this is safe        → route → cli-jev
through jev, classify this prompt   → route → cli-jev
use jev to pick a queue             → route → cli-jev
```

### F3 — Drift / bug, P2: the mode's `RESOURCE_MAP` contradicts the hub's per-intent sets, and its baseline constant is dead

The hub router gives every intent the two baseline leaves plus its own
[SOURCE: .skilled/skills/cli-classifier/ROUTER.md:83] and
[SOURCE: .skilled/skills/cli-classifier/ROUTER.md:88]. The mode router gives the provider and MCP
intents only their own leaf [SOURCE: .skilled/skills/cli-classifier/cli-jev/ROUTER.md:126] and
[SOURCE: .skilled/skills/cli-classifier/cli-jev/ROUTER.md:127], and gives `JEV_QUESTION` the CLI
reference plus the card but not the integration-patterns guide
[SOURCE: .skilled/skills/cli-classifier/cli-jev/ROUTER.md:125]. The file declares
`DEFAULT_RESOURCES` "Baseline ... as in the hub ROUTER.md"
[SOURCE: .skilled/skills/cli-classifier/cli-jev/ROUTER.md:114] and then never reads it: the map at
line 123 has no merge step, so the constant is dead code that states a rule the data below it
breaks.

Effect: a provider question ("jev auth status") routed through the mode router loads
`references/providers-and-models.md` alone, without the CLI reference that defines the flags it
describes. Two documents in the same skill give two different answers for the same intent, and the
one a reader is told to use (the mode's own) is the thinner one. Introduced: uncertain between the
v4.0.0.3 hub split and the v4.0.1.0 doc-read pass. Confidence 0.7.
Verify: diff the two `RESOURCE_MAP` blocks; `grep -n "DEFAULT_RESOURCES" cli-jev/ROUTER.md` shows
one assignment and zero readers.

### F4 — Operator/AI UX, P2: the advisor ranks `sk-prompt` above `cli-classifier`, so a Jev phrasing still loses the race it was fixed for

Routing a prompt that names Jev to the classifier is now correct at the compiled-route layer, but
the advisor still ranks a competing skill first:

```
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"through jev, classify this prompt"}' --format json
sk-prompt        score 0.586335  confidence 0.8352   (no compiledRoute)
cli-classifier   score 0.570308  confidence 0.8265   compiledRoute → route → cli-jev
```

Both clear the 0.8 confidence bar, so the delivery shows `sk-prompt` first; an AI that takes the
first recommendation never reaches the transport. The word "prompt" outweighs "through jev" by
0.016 of score. The phrase "ask jev whether this is safe" ranks `cli-classifier` first, so the
failure is specific to phrasings that co-name another skill's vocabulary — which is exactly the
shape of the six phrasings v4.0.0.2 set out to repair. Confidence 0.6 (a single labelled prompt is
thin evidence; the release's own labelled sets may not cover it).
Verify: the command above; compare the two `score` fields.

### F5 — Drift, P2: version skew inside the hub

`ROUTER.md` declares `version: 0.8.5.0` [SOURCE: .skilled/skills/cli-classifier/ROUTER.md:11] while
`SKILL.md` declares `version: 0.8.9.0` [SOURCE: .skilled/skills/cli-classifier/SKILL.md:5], and
`mode-registry.json`, `hub-router.json` and `description.json` all agree on 0.8.9.0. `SKILL.md`
also names `changelog/v0.8.6.0.md` as "Hub changelog"
[SOURCE: .skilled/skills/cli-classifier/SKILL.md:154] while the folder holds entries through
v0.8.9.0 — so the router is three minor versions stale and the changelog pointer skips the three
most recent entries. No validator compares these fields, which is why the skew survived v4.0.1.0's
hand read of every skill doc. Confidence 0.95.
Verify: `grep -n "^version:" .skilled/skills/cli-classifier/{SKILL.md,ROUTER.md}` and
`ls .skilled/skills/cli-classifier/changelog | tail -3`.

### F6 — Improvement, P2: stage-1's signal declares one resource where the intent needs three

`routerSignals["cli-jev"].resources` is `["cli-jev/SKILL.md"]`
[SOURCE: .skilled/skills/cli-classifier/hub-router.json:19]. Every stage-2 route, including the
`JEV_JUDGMENT` baseline, needs `references/cli-reference.md` and
`references/integration-patterns.md` as well [SOURCE: .skilled/skills/cli-classifier/ROUTER.md:73].
A consumer that trusts the stage-1 resource list to preload a route loads the thin `SKILL.md` and
misses both baseline leaves. Declaring the baseline in the signal would make the two stages agree
and let a preload skip the second lookup. Introduced: v4.0.0.3. Confidence 0.7.
Verify: `node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "ask jev"` and read
`resources` against the stage-2 `RESOURCE_MAP`.

## Questions Answered

- **cli-classifier and cli-jev (v4.0.0.2, v4.0.0.3, v4.0.1.0): do the router phrases, Jev feature
  switches and stored-key behavior in `.skilled/skills/cli-classifier/**` match the notes and their
  own hub-router.json, mode-registry.json and ROUTER.md?**
  No on two of three counts, and partly yes on the third.
  *Router phrases* — the compiled route now answers all four phrasings v4.0.0.2 lists (verified
  live), but the authored data was never corrected: the mode's `ROUTER.md` still omits them (F2),
  three advertised question-shaping phrases cannot be reached at all because stage 1 does not carry
  them (F1), the two `RESOURCE_MAP` blocks disagree (F3), stage 1 declares one resource where the
  intent needs three (F6), the hub's versions and changelog pointer are stale (F5), and the advisor
  still outranks the hub on a co-named phrasing (F4).
  *Jev feature switches* — correct, and the apparent drift is deliberate: v4.0.0.3 named four
  switches, v4.0.0.7 retired `JEV_FEATURE_VERDICT_FALLBACK` and `JEV_FEATURE_HALLUCINATION_GRADER`
  with the benchmark mode [SOURCE: .skilled/changelog/skilled/v4.0.0.7.md:92], and the shared gate
  registers exactly the two survivors [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:38]
  with the master switch read first [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:33]
  and both documented in the operators' own flags file
  [SOURCE: .skilled/hooks/hook-flags.env:81]. Precedence is environment-first, then
  `hook-flags.env`, and the two-way reading (this set is *off* when set, unlike the hook switches
  above it) is called out in the file itself.
  *Stored key* — the module's stated contract is that it "never reads or passes a key, and discards
  the command's output" and that readiness asks the CLI's own `auth status`
  [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:11]; no key value is
  handled anywhere in the gate, so a missing key simply leaves the feature's caller on its non-Jev
  fallback. That matches the note's "a machine without a stored key never calls the service".

## Questions Remaining

- Single-executor dispatch: which `if_cli_*` branches in `deep-research-auto.yaml` and
  `deep-review-auto.yaml` carry placeholder, field-name or ordering defects? (open since iteration 1)
- Hub canon beyond the classifier: do `cli-external-orchestration` and its seven modes follow the
  same parent-hub canon? The classifier's F1/F3 pattern — a stage-2 row richer than its stage-1
  carrier, and a mode map narrower than the hub's — is cheap to test there next.
- Over-engineering: which system-deep-loop runtime surfaces have no live caller or test?
- UX: which steps of `deep-research-auto.yaml`, `deep-research-presentation.txt` or the
  `cli-*/SKILL.md` dispatch rules are unclear or impossible?
- Extension: what removes the manual steps and defects in this cluster? F1 and F3 now suggest one:
  a stage-1-vs-stage-2 vocabulary check that fails when a stage-2 phrase has no stage-1 carrier.
- Executor failure handling (v4.0.0.3, v4.0.0.16): quota errors and builder throws under the
  single-executor workflow.
- NEW — F5's class: is there any validator that compares `ROUTER.md` frontmatter version and the
  `SKILL.md` changelog pointer against the shipped changelog range? If not, the same skew may exist
  in the other 53 hubs and modes.

## Next Focus

Hub canon across `cli-external-orchestration/` and its seven mode packets: test the same three
consistency questions that paid off here — (a) does every stage-2 phrase have a stage-1 carrier,
(b) does each mode's `RESOURCE_MAP` match the hub's for the same intent, and (c) do the version and
changelog pointers in `SKILL.md` and `ROUTER.md` agree with what the packet ships? Then open the
single-executor dispatch question that has been carried since iteration 1.

## SCOPE VIOLATIONS

None. Every artifact is under the lineage directory; no researched file was modified. `git diff`
was run path-limited only.
