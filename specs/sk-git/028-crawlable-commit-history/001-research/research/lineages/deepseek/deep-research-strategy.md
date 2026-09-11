---
title: Deep Research Strategy — Crawlable Commit History (deepseek lineage)
description: Terminal strategy state for the ten-iteration crawlable-commit-history research lineage.
trigger_phrases: []
---

# Deep Research Strategy — Crawlable Commit History (deepseek lineage)

## 1. Overview

Terminal state for detached lineage `deepseek` (`fanout-deepseek-1789111510857-0nqzvk`). Ten iterations ran to the configured cap (`stopPolicy: max-iterations`), one per dispatch angle, in order. Convergence was telemetry only; no early synthesis.

## 2. Topic

How commits in this repository become addressable and searchable the way spec packets are: a numbered, crawlable commit message grammar for `sk-git`; collision-free identifier minting; the 9,112-commit retrofit on `main` and `skilled/v4.0.0.0` with spec-citation remap.

<!-- ANCHOR:key-questions -->
## 3. Key Questions (remaining)

- [x] Q1 (angle 1): Which commit-message rules does the current sk-git contract and `commit-msg` hook enforce, and which collide with a numbered identifier?
- [x] Q2 (angle 2): What do the commits on `skilled/v4.0.0.0`/`main` actually contain?
- [x] Q3 (angle 3): What can each search surface match in a subject, body, or trailer?
- [x] Q4 (angle 4): Which identifier scheme survives git and mints without collision at what subject cost?
- [x] Q5 (angle 5): What body/trailer shape makes commits searchable by packet, phase, and identifier?
- [x] Q6 (angle 6): What does prior art solve, cost, and whether it transfers?
- [x] Q7 (angle 7): How do the existing commits map to a packet and identifier, and what rule applies to unmappable ones?
- [x] Q8 (angle 8): What do filter-repo callbacks preserve/lose; are notes/replace viable alternatives?
- [x] Q9 (angle 9): Where are commit hashes cited, what is the remap script, and what is the force-push blast radius + rollback?
- [x] Q10 (angle 10): What must change in hooks/tooling/docs, and what should phases 002-006 decide/build?
<!-- /ANCHOR:key-questions -->

## 4. Non-Goals

- No implementation in this phase: no hook edits, no rewrite, no `git filter-repo`, no commit/push, no writes outside the lineage directory.
- No network fetches; all evidence is local files, local git history, and local runtime reads.
- No new dependencies, build steps, or frameworks.

## 5. Stop Conditions

- Ten evidence iterations completed; stopped at the cap with `maxIterationsReached`.
- All ten angle questions answered; ten contract decisions carried forward explicitly.

<!-- ANCHOR:answered-questions -->
## 6. Answered Questions

- Q1: enforced grammar is `type(scope)[!]: imperative summary` (13 types, kebab scope, numeric-only blocked); three summary blocks, process warnings, >100 cap; Git-generated exempt; machine-wide install via global `core.hooksPath`; trailer whitelist closed. (iteration 1)
- Q2: 9,112 live commits (9,106 at brief time), 73% subject-compliant, 1,355 numeric scopes, 2,948 subjects >80 chars, 90.1% bodies, Co-Authored-By 80.8%, Refs 3.8%, 12,718 cited hex tokens in specs. (iteration 2)
- Q3: `--grep` is the only general message surface (case-sensitive, line-anchored, OR default/AND via `--all-match`); packet AND query = 2 commits; pickaxe = 0; `%(trailers:key=)` extracts final-block only (119/349); trigger index is docs-only. (iteration 3)
- Q4: packet-derived hyphen key in a final trailer block is the ranked candidate; minting via the worktree allocator pattern; message ids duplicate under copy; 1,002 duplicate-subject commits measured. (iteration 4)
- Q5: four-key final block `Spec`/`Phase`/`Commit-Id`/`Refs` above Context/Changes/Verification prose; placement law; body budget ≤120 words grounded in median 101. (iteration 5)
- Q6: Conventional Commits is the base (stricter here); Gerrit's stamping mechanism transfers; kernel hash refs, Fossil, date/content ids are worse for this goal; no prior art addresses packets. (iteration 6)
- Q7: cascade maps 6,036/9,111 to a packet, 3,075 fall back; scope-only mapping is ambiguous; 41 multi-packet ties; fallback archetypes are skill/tooling work; pin SHA and stop writers. (iteration 7)
- Q8: mirror rewrite with `--commit-callback` is the only message-embedded mechanism; signatures/headers lost; commit-map drives remap; notes/replace rejected. (iteration 8)
- Q9: citation corpus reduces to 1,700 prefix matches + 294 full-SHA (5,560 decoys); 460 messages cite hashes; blast radius 60/28/149/8/2; remap spec + order of operations + rollback sentence written. (iteration 9)
- Q10: one-line `TRAILER_RE` change; repo-identity-aware `prepare-commit-msg`; allocator reuse; tests are the gap; five doc surfaces; 16 ranked decisions; phase plan 002-006 with gates. (iteration 10)
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. What Worked

- Reading the actual hook line by line produced the exact collision table instead of guessing at Conventional Commits. (iteration 1)
- A single python pass over `git log --format` gave the full baseline (types, scopes, lengths, trailers, bodies). (iteration 2)
- Running every required query against live history exposed the 2-match AND failure and the 119/349 trailer loss. (iteration 3)
- Testing all candidate messages against the real hook (fixtures c1-c9) settled placement with primary evidence. (iteration 4)
- `Spec:`'s 81-vs-2 extraction gap turned placement from advice into a measured law. (iteration 5)
- The filter-repo `--help` text is the authoritative local rewrite contract and resolved mechanics without a network fetch. (iteration 8)
- Reducing 7,260 citation tokens to 1,700 real matches with zero prefix collisions made the remap bounded and reviewable. (iteration 9)
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. What Failed

- Treating the brief's fixture counts as fixed: the repo moved during measurement (9,108→9,112), so all numbers are pinned to a SHA. (iterations 2, 7)
- A first mapping pass without the ref parameter undercounted touches; corrected by re-running with the pinned ref. (iteration 7)
- The first candidate-hook port had a regex group bug (`(?!)?` capture order); fixed by mirroring bash's `BASH_REMATCH` numbering exactly. (iteration 4)
- A combined heredoc+hook-loop command was denied by the environment dispatch guard; split into direct invocations. (iteration 4)
- GitHub commit-search behavior cannot be validated offline; left as labeled local knowledge. (iteration 3)
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. Exhausted Approaches

- Brief fixture counts as execution numbers: exhausted; use pinned live SHAs. (iteration 2)
- Scope/subject/hash/date/content-derived identifier placements: exhausted with measured hook outcomes. (iterations 1, 4)
- Pickaxe and trigger-index routes for commit metadata: exhausted (0 hits; docs-only corpus). (iteration 3)
- Notes/replace as address carriers: exhausted (publishing and search both fail). (iteration 8)
- Non-markdown citation scanning and uppercase token matching: exhausted (noise). (iteration 9)
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. Ruled-Out Directions

- Numeric or packet-path scope placement; subject-prefix default placement. (iterations 1, 4)
- Hash-derived ids; date-based ids as primary; content-derived ids as primary. (iterations 4, 6)
- Kernel-style hash-prefix references and Fossil-style content addressing. (iteration 6)
- Notes/replace carriers; naive `--message-callback` stamping. (iteration 8)
- Scope-number-only and trailer-primary mapping. (iteration 7)
- Non-md/uppercase citation scans. (iteration 9)
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. Saturated Directions and Divergence Frontier

- Completed pivots: 0 (no divergent pivots configured or needed)
- Failed pivots: 0
- Audited overrides: 0
- Saturated: all ten angles (contract, baseline, search, identifier, shape, prior art, mapping, rewrite, remap, enforcement)
- Remaining frontier: none in research scope; ten contract decisions are the downstream frontier (see §11A and research.md S8)
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. Carried-Forward Open Questions

1. Final key minimalism: keep `Phase:` when `Spec:` exists?
2. Identifier shape confirmation (`sk-git-028-0003`) and fallback namespace (`misc-NNNN`) spelling.
3. Which commits receive ids (merges/exempts) and the enumeration key order for fallback ids.
4. Cherry-pick/squash duplication policy (strip-and-re-mint vs accepted duplication).
5. Multi-valued `Spec:` for multi-packet commits vs single dominant owner.
6. Message-internal citation second pass (460 messages) — yes/no.
7. Enforcement level: warn / block / `Spec:`-scoped block, and staged rollout timing.
8. Stamper install scope: machine-wide symlink vs repository-scoped hooks path.
9. Signature-loss acceptance (11 signed commits, 98 annotated tags) and any re-signing.
10. Phase plan approval (002-006) and rewrite-window authorization (push set + rollback readiness).
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. Next Focus

Synthesis complete. Next packet action: phase 002 — contract freeze, gated on operator approval of the decision record.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. Known Context

- Full synthesis: `research.md` (iterations 1-10 + Final Synthesis).
- Evidence: `iterations/iteration-001.md` … `iteration-010.md`, `deltas/iter-001.jsonl` … `iter-010.jsonl`.
- Metrics/decisions: `findings-registry.json`, `deep-research-dashboard.md`, `resource-map.md`.

## 13. Research Boundaries

- Max iterations: 10 (reached)
- Convergence threshold: 0.05 (telemetry only; cap used)
- Stop policy: max-iterations → `maxIterationsReached`
- Per-iteration budget: 12 tool calls
- Progressive synthesis: true
- Executor provenance: `cli-pi`, model `deepseek-v4.1-flash`, effort `max`
- Session: `fanout-deepseek-1789111510857-0nqzvk`
- Allowed write root: `.opencode/specs/sk-git/028-crawlable-commit-history/001-research/research/lineages/deepseek`
