# Iteration 3 — sk-design and system-deep-loop: the last two hubs

## Focus

Complete the hub inventory with sk-design (4 modes) and system-deep-loop (3 modes), and test two claims carried forward: that the "machine block must not move" rule is a hub-level invariant, and that `system-deep-loop` serves a stale compiled manifest.

## Actions Taken

1. Inventoried both hubs: sk-design `SKILL.md` 215 / `ROUTER.md` 115 / `hub-router.json` 187 / `mode-registry.json` 206; system-deep-loop `SKILL.md` 170 / `ROUTER.md` 97 / `hub-router.json` 51 / `mode-registry.json` 104.
2. Read both `SKILL.md` §2 routing sections and both `ROUTER.md` intent models and §3 machine blocks.
3. Read `system-deep-loop/hub-router.json` whole.
4. Grepped the "must not move" rationale across all seven hubs' `SKILL.md`.
5. Ran `node .skilled/bin/compiled-route-guard.cjs --json` (read-only; the script contains no write call).

## Findings

1. **The rule that blocks the hub-level move is copied in four hubs, and one copy has drifted.** sk-doc `SKILL.md:65`, system-deep-loop `SKILL.md:50` and cli-external-orchestration `SKILL.md:78` carry the sentence verbatim, including "(schema handoff-ambiguity rule)"; sk-design `SKILL.md:74` paraphrases it as "nor into `hub-router.json`, which is a different schema". The rule is the single most load-bearing constraint on the restructuring question, and its justification is now paraphrased in one of the four places that state it. [SOURCE: .skilled/skills/sk-doc/SKILL.md:65] [SOURCE: .skilled/skills/sk-design/SKILL.md:74]

2. **Hub-level only: no document extends the forbid to a packet's own `SKILL.md`.** Every copy of the rule names "the machine block" moving into *the hub's* `SKILL.md` or into `hub-router.json`. Since a packet's machine block already lives in the packet's own `SKILL.md`, moving it within that file is outside the rule's wording. The advisor report conflated the two cases; the texts do not. [SOURCE: .skilled/skills/system-deep-loop/SKILL.md:50]

3. **`workflowMode` means a different thing in system-deep-loop than in the other three hubs.** sk-code keys it by packet (`sk-code-review`, `SKILL.md:69`), sk-doc by packet (`SKILL.md:68`), sk-design by packet (`SKILL.md:80`); system-deep-loop keys it by loop (`research`, `review`, `ai-council`, `SKILL.md:59`) while its `hub-router.json` resources point at `deep-research/SKILL.md`. So the canonical `(workflowMode, leafResourceId)` pair has per-hub key semantics, and any cross-hub resolver has to special-case this hub. [SOURCE: .skilled/skills/system-deep-loop/SKILL.md:59] [SOURCE: .skilled/skills/system-deep-loop/hub-router.json:24]

4. **The no-match outcome has three names and no shared enum.** system-deep-loop writes "no keyword match → hub `defer`" (`SKILL.md:48`) and encodes `outcomes.defer` in `hub-router.json:11`; sk-code returns `load_level: "UNKNOWN_FALLBACK"` from its `route()` (`SKILL.md:110`); sk-doc writes "hub UNKNOWN fallback" (`ROUTER.md:405`) and sk-design "the hub's UNKNOWN fallback" (`SKILL.md:76`). A consumer that joins hub decisions cannot key on one value. [SOURCE: .skilled/skills/system-deep-loop/hub-router.json:11] [SOURCE: .skilled/skills/sk-design/SKILL.md:71]

5. **sk-design restates the mode list a fourth time inside the hub.** `SKILL.md:54-60` is a four-column mode table (mode, command, owns, reach by asking), while the same list is the registry `modes[]`, the `hub-router.json` `routerSignals` keys and `tieBreak`, and the `ROUTER.md` intent model. The table is the copy most likely to drift, because nothing parses it. [SOURCE: .skilled/skills/sk-design/SKILL.md:54]

6. **The staleness claim does not reproduce.** `compiled-route-guard.cjs` reports all seven hubs `fresh` today, system-deep-loop included (`{"hubId":"system-deep-loop","ok":true,"reason":"fresh"}`), and the guard iterates the full hub list, not just sk-code. The report's note that "system-deep-loop reports a stale compiled manifest today" is stale itself, and the guard's coverage means any hub `SKILL.md` edit forces a re-mint while a packet edit does not. [SOURCE: .skilled/bin/compiled-route-guard.cjs:168]

7. **Correction to iteration 2's cost estimate: growth is linear, the per-mode constant is not.** Registry lines per mode are sk-code 32.5, system-deep-loop 34.7, sk-doc 40.3, sk-design 51.5. The linear-in-mode-count claim holds; "roughly constant per mode" does not, because alias and `toolSurface` blocks vary by hub — so a generator must be parameterised per hub, not templated globally. [SOURCE: .skilled/skills/sk-design/mode-registry.json:1] [SOURCE: .skilled/skills/system-deep-loop/mode-registry.json:1]

8. **Readability: a hard invariant sits inside the routing section of a 170-line hub.** `system-deep-loop/SKILL.md:54-58` carries a 96-word note explaining that the hub's `allowed-tools` grant must equal the union of every mode's `toolSurface.allowed` or `parent-skill-check.cjs` check 3j fails — a build constraint, not a routing rule, placed between the routing model and the discriminator. sk-design's `SKILL.md:61` opens a paragraph with the fragment "Four modes." after the table has already said so. [SOURCE: .skilled/skills/system-deep-loop/SKILL.md:54] [SOURCE: .skilled/skills/sk-design/SKILL.md:61]

## Questions Answered

- Q1: all four hubs' routing mechanisms are now inventoried (sk-code iteration 1, sk-doc iteration 2, sk-design and system-deep-loop here).
- Q2: four drift classes are located — §2/§9 intent mismatch (sk-code), packet-trigger versus JSON projection (sk-doc), the paraphrased hub-level rule (sk-design), and the three-name no-match outcome (all hubs).

## Questions Remaining

- Q3 (enforcement and breakage), Q4 (verdict), Q5 (per-skill readability), Q6 (plan).

## Next Focus

Iteration 4: the enforcement layer — `parent-skill-check.cjs`, `verify-router-sync.cjs`, `router-replay-lib.cjs` `parseRouter`, `compiled-route-sync.cjs`/`compiled-route-guard.cjs`, `build-artifacts.cjs`, `package_skill.py`, `check-rule-copies.js`, the create-skill and parent-skill templates/canon under sk-doc, and the doctor `router-reach` workflow; determine what each proposed change breaks.

## SCOPE VIOLATIONS

None. The guard run is read-only and every write landed under the lineage directory.
