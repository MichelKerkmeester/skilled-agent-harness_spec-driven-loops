# Iteration 006 — Authoring Hubs (sk-doc / sk-code / sk-design / sk-prompt)

Segment 1 · Iteration 6 of 10 · Mode: research · Native executor

## FOCUS

Carried focus from iteration 5 (its dispatch failed on Devin quota): key question 10
(over-engineering / files with no inbound route) plus the four unread releases
**v4.0.0.13, v4.0.0.14, v4.0.0.15, v4.0.2.0** — path-limited diffstat, open the largest
changed files, and test each note's claims against the hubs.

Depth over breadth: every claim below was checked against the tree at the commit in
question (`git show <tag>:<path>`), not against the release note alone.

## ACTIONS TAKEN

1. **Path-limited diffstat for the four releases** (`git diff <prev>..<tag> -- .skilled/skills/sk-{doc,code,design,prompt}`).
   Largest hub-facing changes: v4.0.0.14 `365 files / -48,358` (a mass deletion round),
   v4.0.0.15 `parent-hub-router-schema.md ±70` plus a **new** `ci-skill-root-metadata.cjs`,
   v4.0.2.0 `sk-prompt` reference re-organisation (`framework-selection/`, `mode-detection/`
   leaf docs deleted and replaced).
2. **Read the parent-hub canon** the four hubs are judged by:
   `git diff bb9b9d1c09..22c3a9b2c7 -- …/parent-hub-router-schema.md` (mode ids renamed to
   `sk-code-quality` / `sk-code-review` / `sk-code-ci` / `sk-code-skilled`, "four packets").
3. **Ran the fleet gate added in this range**:
   `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --format text`
   → `checked=14 passed=14 failed=0`, exit 0, including `[H] sk-code`, `[H] sk-design`,
   `[H] sk-doc`, `[S] sk-prompt`.
4. **Ran a hand-written three-axis routing identity probe** (registry modes ↔ router signals ↔
   packet folders ↔ quality-checklist paths) over sk-code, sk-design and sk-doc.
5. **Chased the three rename chains** introduced in this range against the v4.0.2.0 tree:
   `sk-code-opencode → sk-code-skilled` (v4.0.0.13),
   `sk-code-webflow → sk-code-frontend` (v4.0.2.0, `c0c83e54bc`),
   `cli-hermes → cli-deepseek-harness` (v4.0.2.0).
6. **Ran the compiled router** for one hub: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "quality gate on this module"`
   → `selectionKind: single`, `packetId: sk-code-quality`.

## FINDINGS

### F1 — The renamed surface still owns the runtime's own name in routing vocabulary

- **Type:** drift (1) · **Severity:** P2 · **Release:** v4.0.0.13 · **Confidence:** high that the
  vocabulary overlaps; medium that the overlap produces a wrong route in practice.
- **Claim:** v4.0.0.13 renamed the surface precisely to stop sharing a name with the OpenCode
  runtime — "The code check no longer shares a name with the OpenCode runtime"
  [SOURCE: .skilled/changelog/skilled/v4.0.0.13.md:122], with the hard form "anything that
  matched the surface id `OPENCODE` must now match `SKILLED`, and links to
  `sk-code/sk-code-opencode/` must point to `sk-code/sk-code-skilled/`"
  [SOURCE: .skilled/changelog/skilled/v4.0.0.13.md:124]. The *folder and id* moved, but the
  surface's scoring vocabulary still carries the old runtime's name, including the bare token:
  `["opencode system code", "opencode system code workflow", "opencode typescript verification", "opencode", "system code", "system-code", "mcp"]`
  [SOURCE: .skilled/skills/sk-code/hub-router.json:73], and the registry aliases repeat the
  same phrases [SOURCE: .skilled/skills/sk-code/mode-registry.json:74].
- **Why it matters:** a sibling hub claims the same bare token at the same weight —
  `cli-opencode` is a weight-4 signal [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:33]
  whose `cli-opencode-aliases` class contains `opencode` [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:36].
  Because `sk-code` declares `defaultMode: null` and `outcomes.single` routes "a surface alone
  when no workflow mode scores", the prompt "opencode system code" lands on the read-only
  `sk-code-skilled` surface while "opencode" alone is contested by two hub identities.
- **Verify:**
  `rg -n '"opencode"' .skilled/skills/sk-code/hub-router.json .skilled/skills/cli-external-orchestration/hub-router.json`

### F2 — The new fleet gate validates root metadata, not hub routing identity

- **Type:** extension (7) · **Severity:** P2 · **Release:** v4.0.0.15 (gate added) · **Confidence:** high
  that the gate reads no router; high that the three probes are absent from it.
- **Claim:** `ci-skill-root-metadata.cjs` describes itself as the "fleet gate for root-level skill
  metadata" [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:8]
  and it passes 14/14 roots, yet a hub can have a perfectly seeded root and still ship a broken
  routing pair: nothing in the gate's import set (`generate-leaf-manifest`,
  `leaf-resource-contract`, `skill-root-metadata-contract`) reads `hub-router.json` or
  `mode-registry.json`. To establish the invariant in §INVARIANTS below I had to write a
  15-line probe by hand.
- **Concrete extension:** add three assertions to the same gate, all of which pass today for
  sk-code (5), sk-design (3) and sk-doc (15) and would fail loudly on a rename that moves ids
  without moving vocabulary: (a) `modes[].workflowMode` set equals `routerSignals` key set;
  (b) every `packet`/`packetSkillName` names an existing folder under the hub;
  (c) every `modes[].quality.checklists[].file` resolves. Cheapest home is the existing gate,
  because it already owns discovery of every skill root.
- **Verify:**
  `node -e 'const r=require("./.skilled/skills/sk-code/mode-registry.json"),t=require("./.skilled/skills/sk-code/hub-router.json");console.log(JSON.stringify(r.modes.map(m=>m.workflowMode).sort())===JSON.stringify(Object.keys(t.routerSignals).sort()))'`

### INVARIANTS (confirmed, no defect)

- **I1 — Routing identity holds across all three hubs.** sk-code 5 modes, sk-design 3,
  sk-doc 15: registry↔signal sets equal, no registry-only or signal-only mode, zero missing
  packet folders, zero missing quality-checklist files.
- **I2 — No orphan vocabulary classes.** Declared vs referenced classes: sk-code 15 declared /
  14 used with 1 in `discoveryClasses` (`hub-identity`), sk-design 3/3, sk-doc 17/17; zero
  orphan classes and zero referenced-but-undeclared classes in any of the three.
- **I3 — The v4.0.0.15 root-metadata contract is satisfied** by all four hubs
  (`checked=14 passed=14 failed=0`).

### DISCONFIRMED (hypotheses this iteration killed — recorded so later iterations do not re-open them)

- **D1 — "the schema doc forgot the new `sk-code-frontend` surface".** False. At v4.0.2.0 the
  schema is version `1.2.10.0` and names "three surface packets, `sk-code-ci`, `sk-code-frontend`
  and `sk-code-skilled`" [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:29],
  with `tieBreak` updated to `["sk-code-quality","sk-code-review","sk-code-frontend","sk-code-ci","sk-code-skilled"]`.
  The "four packets" wording was correct at v4.0.0.15 and was corrected in the same release
  that added the surface.
- **D2 — "sk-prompt's model table still admits the removed `cli-hermes`".** False. At v4.0.2.0
  the row is `cli-deepseek-harness` with "Experimental mode: no pair is admitted yet", and
  `cli-hermes` appears in no line of `sk-prompt/SKILL.md`.
- **D3 — "sk-prompt still advertises the removed DEPTH framework".** False. The description is
  already "turns a request into a structured, checked AI prompt, with a component skeleton and
  CLEAR screening" at both v4.0.0.15 and v4.0.2.0, `references/improvement-checklist.md` is the
  only surviving depth file, and the two residual `DEPTH` hits are inside escaped Codex `stderr`
  blobs in archived benchmark reports.
- **D4 — "the sk-prompt benchmark reports are unmarked stale artifacts (over-engineering)".**
  False. `benchmark/README.md` declares "Archive status: the Lane C harness that produced these
  reports was retired … none of them can be re-run from the current tree". Removing them would
  break nothing functionally, but it would delete the only in-tree evidence for the routing-gold
  claim, so they are documented history rather than dead weight.
- **D5 — "sk-code never got a compiled router, unlike sk-doc/sk-design".** False.
  `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/` exists and
  `compiled-route.cjs --hub sk-code` returns a correct `sk-code-quality` selection.

### Q10 status (over-engineering) — partially answered, not closed

The **mode/vocabulary** half is now clean (I2: no orphan classes, no dangling mode, no missing
packet folder, no missing checklist path, D4: the apparent stale artifacts are labelled archives).
The **references / assets / scripts** half was not scanned this iteration and is handed forward:
a file-level "no inbound reference" sweep across the four hubs is still owed.

## QUESTIONS ANSWERED

- "What concrete extensions would let the four hubs share validators, routing tests or templates,
  based on gaps found in this run?" → **F2**: extend `ci-skill-root-metadata.cjs` with the three
  routing-identity assertions it currently does not perform, reusing its existing root discovery
  instead of building a second gate. Evidence that the gap is real: the assertions had to be run
  by hand, and they are the only check that binds the `hub-router.json` voice to the
  `mode-registry.json` voice, which is exactly where the v4.0.0.13 / v4.0.2.0 renames touched code.

## QUESTIONS REMAINING

- Q10 (open half): which **templates / references / assets / scripts** in the four hubs have no
  inbound reference, and what breaks if each is removed? (Mode-level clean per I2; file level not
  yet swept.)
- Q11: what friction do the operator and the AI user hit — ambiguous mode choice, unclear validator
  errors, large mandatory loads? F1 is one instance of ambiguous mode choice; the validator-error
  and mandatory-load halves are still untouched.

## NEXT FOCUS

Q10's file-level half: enumerate `references/`, `assets/` and `scripts/` in sk-doc, sk-code,
sk-design and sk-prompt, and for each file test inbound references with
`rg -l "<basename>" .skilled --glob '!**/changelog/**'`; for every zero-hit file state explicitly
what breaks if it is removed (nothing / a validator / a routing class / a template consumer).
Fold in Q11's remaining halves (validator error text, mandatory-load size) if a second pass fits.

## SCOPE VIOLATIONS

None. All reads were `git show`, `rg`, `ls` and node probes; the only writes are this narrative,
`deltas/iter-006.jsonl` and the gateway record.
