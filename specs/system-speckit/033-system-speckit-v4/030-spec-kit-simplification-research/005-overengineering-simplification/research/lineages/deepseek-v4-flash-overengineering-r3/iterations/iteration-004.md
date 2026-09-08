# Iteration 004 — KQ-R3d: reachability of the references corpus

Session: fanout-deepseek-v4-flash-overengineering-r3-1788784311216-27elid | run 4 | focus: which files under `references/` (41) and `assets/` (4) — 45 total — are routed or linked to by path from `system-spec-kit/SKILL.md`, a README under `references/`, or a command asset.

Evidence reads (6 calls): full FST listing of `references/` + `assets/` (45 files, 9 subdirectories under references: cli 3, config 3, debugging 2, memory 5, retrieval 1, structure 6, templates 4, validation 6, workflows 11; assets 4); `SKILL.md` path extraction (all `references/…`/`assets/…` mentions, unique), SKILL.md RESOURCE_MAP extraction (lines 155-250), RESOURCE_MAP-bound awk scan, per-basename mention counts for the 17 zero-mention files in SKILL.md, and the same basename counts in repo-root `AGENTS.md` + `REPO RULES.md` + `repo-rules/` (context check), plus `leaf-manifest.json` path enumeration. No node/validate/git executed.

## Reachability result

Routing surfaces in scope: `system-spec-kit/SKILL.md` (routing + reference sections), READMEs under `references/`, command assets (`.opencode/commands/speckit/*.md` + `assets/*.yaml`).

- READMEs under `references/`: **zero** (find returned nothing). There is no index or navigation document inside the corpus.
- Command assets referencing `references/`/`assets/` by path: **zero** (grep over all 6 .md routers and 12 .yaml assets returned no path).
- SKILL.md names 29 unique paths; 28 exist in the corpus (the 29th, `references/protocol/spec-check-protocol.md`, is the tail of a cross-skill pointer written `../system-deep-loop/deep-research/references/protocol/spec-check-protocol.md` at SKILL.md:129 — resolves correctly, not broken).
- Of those 28: 26 appear in RESOURCE_MAP (the router's selection); 2 are linked in prose but never routable (`references/retrieval/retrieval-conventions.md`, `references/structure/grep-convention.md` — full-path links at SKILL.md:428).
- **17 of 45 files are named nowhere in SKILL.md** — no path, no basename, 0 mentions (per-basename grep). Only 3 of the 17 are named in repo-root governance docs (`folder-structure.md`, `folder-routing.md`, `agent-io-contract.md` — 1 hit each in AGENTS.md/REPO RULES.md/repo-rules); the other 14 have zero mentions even there.
- `leaf-manifest.json` enumerates 45 paths — exactly the corpus — while RESOURCE_MAP emits 26: 19 manifest leaves are never emitted by any intent.

## Findings

**F3-14 [P2 — browse-only corpus] 17 of 45 reference/asset files are unreachable from the skill's own routing: no SKILL.md mention, no README (there is none), no command-asset path.**
Grouped by directory (file — only routing surface that names it, if any):

| Directory | Files unreachable by path | Only mentions |
|---|---|---|
| workflows/ (11) | agent-io-contract.md, auto-mode-contract.md, execution-methods.md, goal-set-string-playbook.md | agent-io-contract: repo-root AGENTS.md/REPO RULES.md only; others: none |
| templates/ (4) | level-selection-guide.md, level-specifications.md, template-style-guide.md | none |
| structure/ (6) | folder-routing.md, folder-structure.md, phase-system.md | folder-routing, folder-structure: repo-root docs only; phase-system: none |
| validation/ (6) | decision-format.md, five-checks.md, path-scoped-rules.md | none |
| cli/ (3) | daemon-cli-reference.md, memory-handback.md, shared-smart-router.md | none (directory is domain-described at SKILL.md:91, no file path) |
| assets/ (4) | parallel-dispatch-config.md | none |

- Claim side: SKILL.md:82-93 says the router discovers resources recursively and the domain block describes all nine `references/<key>/` groups; SKILL.md:95 says "every one is enumerated in leaf-manifest.json" — the reader's model is "the corpus is the navigation".
- Actual: 17 files carry no path from any in-skill surface; a reader who wants `references/validation/five-checks.md` must browse the tree. Two of them (`folder-structure.md` — the doc the repo-root governance layer tells agents to read — and `folder-routing.md`) are reachable only from outside the skill; the other 14 are reachable from nowhere in this repository's docs.
- Severity: P2. Recommendation: **fix** — either add the 17 to RESOURCE_MAP intents (or a "reference library" intent), or link them from `quick-reference.md` (the first-touch file, itself reachable), or delete the genuinely unreferenced ones (`phase-system.md` vs `phase-definitions.md` and `phase-checklists.md` look like candidates — not verified, budget).

**F3-15 [P2 — manifest/RESOURCE_MAP claim mismatch] SKILL.md:95 states "The RESOURCE_MAP below emits those exact leaf paths", while the manifest enumerates 45 and RESOURCE_MAP emits 26.**
- Claim side: SKILL.md:95 — manifest = every routable leaf; RESOURCE_MAP emits "those exact leaf paths".
- Actual: leaf-manifest.json lists all 45 corpus files; RESOURCE_MAP (SKILL.md:167ff) contains 26 unique paths; 19 manifest leaves are emitted by no intent and can never be loaded through the router even if reachable by link.
- Cost: the typed-leaf-projection paragraph promises coherence between manifest and route selection that does not hold; regenerate/keep-in-sync instructions (SKILL.md:95) refer to a sync the corpus already violates.
- Severity: P2. Recommendation: **fix** — state the actual invariant (manifest = corpus inventory; RESOURCE_MAP = routed subset) in SKILL.md:95, or add the missing intents.

## Verified correct this iteration

- 28 of 45 files are reachable by path from SKILL.md; 26 of those are router-emitted.
- `references/protocol/spec-check-protocol.md` inside the SKILL.md mention list is the tail of a correct cross-skill pointer (`../system-deep-loop/…`), not a broken path.
- The resource-domain block (SKILL.md:84-93) describes all nine references groups and assets; the "deliberately NOT routable" exclusions (runtime/, shared/, feature-catalog/, manual-testing-playbook/) match the corpus layout (they live outside references/ and assets/).
- Command assets carry no stale `references/` links (post-011 the command surface is self-contained; presentation assets are the .txt files, not corpus docs).
- No file in the corpus is referenced by a command asset by path — the commands' doc links go to `../commands/speckit/assets/*.txt`, not into references/.

## Open questions

1. Are the 14 document-orphan files truly unneeded (candidates: phase-system.md vs phase-definitions.md/phase-checklists.md; level-selection-guide.md vs level-specifications.md vs template-guide.md; five-checks.md vs validation-rules.md), or are they documentation of capabilities no current intent covers? Bodies not read (budget) — only reachability was measured.
2. What generates leaf-aliases.json and does it carry typed pairs for the 19 never-emitted leaves? Not inspected (node tooling excluded).
3. Is quick-reference.md itself the intended index, and would adding a "browse index" section there close F3-14? (Its content not read this iteration.)
