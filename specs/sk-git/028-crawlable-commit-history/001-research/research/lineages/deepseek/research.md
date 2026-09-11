---
title: "Crawlable commit history — deepseek lineage research"
trigger_phrases: []
---
# Crawlable commit history — deepseek lineage research

Research topic: how commits in this repository become addressable and searchable the way spec packets are — a numbered, crawlable commit message grammar for `sk-git`; how the identifier is minted without collisions; how the 9,106 existing commits on `main` and `skilled/v4.0.0.0` are rewritten with their spec citations remapped.

Evidence labels used below:

- **Confirmed** — measured with a local command, or read directly from a local file with a line cite.
- **Inferred** — supported by the measurements but not exercised end-to-end.
- **Unknown** — not settleable from a local static read (operator policy or post-rewrite behavior).

This file is progressive synthesis: each iteration appends its own section under the dispatch brief's output shape; the consolidated findings and convergence report are appended at iteration 10.

## Iteration 1 — The contract and its hook

The enforced contract is `type(scope)[!]: imperative summary`: `SUBJECT_RE` at `.opencode/scripts/git-hooks/commit-msg:72` allows 13 types, a lowercase kebab scope, optional `!`, and any non-empty summary. The hook hard-blocks a numeric-only scope (79-81), a non-lowercase summary start (83-85), repeated spaces (87-89), trailing punctuation (91-94), vague summaries (96-100), subjects over 100 characters (110-113), a missing blank line before the body (52-61), a missing `BREAKING CHANGE:` footer after `!` (139-141), and a body-less commit when 4+ paths are staged (153-155). It only warns on process labels (`Phase N`, `wave`, `Lane`, `N tasks`, `swarm`, `tranche`, `WU<N>`; 102-105) and over-long body lines (123-125). `Merge `/`Revert "/`fixup! `/`squash! `/`amend! ` subjects bypass everything (43-48). `TRAILER_RE` (117) is a closed whitelist: `Co-Authored-By`, `Signed-off-by`, `Reviewed-by`, `Tested-by`, `Refs:`, plus `Fixes `, `Closes `, `Related to `. Any new key — `Commit-Id:` included — is currently classified as explanatory body, which also means a lone machine trailer satisfies the ≥4-path body gate. Measured: no `prepare-commit-msg` hook exists, no commit-msg unit test exists, and enforcement is machine-wide because global `core.hooksPath=/Users/michelkerkmeester/.config/git/hooks` symlinks to the main clone's hook sources.

Collision verdict for a numbered identifier: scope placement is dead on arrival (regex + explicit doc prohibition at SKILL.md:400-401); subject placement spends the 80/100-character budget and trips the process-language warning class; the body/trailer zone collides with nothing blocking, but a new key should be added to `TRAILER_RE` (117), the template (`assets/commit-message-template.md:67`), and SKILL.md §6 (463-495). The doc contract already pushes packet/phase/task metadata into the body or `Refs:` (SKILL.md:410-412), and the only current packet link is the optional, unvalidated `Refs: <issue, PR, or spec path>` line (SKILL.md:360,486).

Full findings, the placement-cost table, and five ranked recommendations: `iterations/iteration-001.md`.

## Iteration 2 — What the history actually contains

Measured baseline (live, supersedes the brief's fixture counts): **9,108 commits** on `skilled/v4.0.0.0` (= `origin/main`); `main` is **47 behind**; 60 branches, 28 worktrees, **149 tags**. Of 9,108 subjects, 6,643 match the hook's `SUBJECT_RE` (73%), 147 are git-generated exemptions, and 2,318 authored subjects fail — 1,864 with a `type(` prefix but scope/charset issues (`fix(spec-kit tests):`, `(036/014)`), 601 with no prefix. **1,355 commits carry numeric-only scopes** (028:256, 026:112, 016:106, 027:94, 029:69, 152:42 …), 2,948 subjects exceed 80 chars and 558 exceed 100 (max 359). Trailers: `Co-Authored-By` 7,363 (80.8%), `Claude-Session` 3,836 (42.1%), `BREAKING CHANGE` 11; `Refs:` only 349 (3.8%) — 306 spec-path, 51 free-text/URL, **zero** numeric issue/PR. Bodies are 90.1% non-empty. Spec linkage: 677 bodies mention `specs/`, 1,194 commits touch `specs/`, 4,937 touch `.opencode/specs`. Citation mass: **12,718 ten-hex tokens across 1,904 markdown files under `specs/`** (only 31 files elsewhere under `.opencode/skills`; zero in changelogs/README).

Key consequence: the retrofit has good body coverage to append to, but the "commit → packet" signal is thin; numeric scopes are the richest mapping source. Full tables and commands: `iterations/iteration-002.md`.

## Iteration 3 — The search surfaces

`git log --grep` is the only general local message surface: line-oriented regex over subject+body+trailers, case-sensitive (363 `Refs:` vs 9 `refs:`), `^` anchors per line (344 for `^Refs: `), literal with `--fixed-strings` (130), OR across repeated `--grep`, AND only when `--all-match` is given — and the packet query `028 ∧ sk-git` matches just **2 commits**, while `028` alone matches 622. Pickaxe `-S`/`-G` returned **0** for message text: they search diffs, not messages. Trailer extraction is structural: `%(trailers:key=Refs)` extracts only **119 of 349** literal `Refs:` lines because git parses the final contiguous paragraph only (commit `2d356893a8` demonstrates the loss); keys are case-insensitive, `valueonly` works, and a new `Commit-Id:` key is already parseable today (0 in history only because none exists). `git interpret-trailers` stamps trailers cleanly (demo appended `Spec=` + `Commit-Id=`), with the `Context:`-as-trailer caution. The spec-kit trigger index is docs-only (`CORPUS_ROOTS = specs, .opencode/skills, .opencode/install-guides`; research lineages excluded), so commits cannot enter it without a new ingestion pipeline; the topic lookup returned 175 score-0 partials. GitHub commit search (unverified offline) is token-based message text with no regex or trailer semantics. Design consequence: a literal identifier token in a final contiguous trailer block satisfies both search axes. Full matrix: `iterations/iteration-003.md`.

## Iteration 4 — Identifier design

All five candidate value shapes (`000123`, `sk-git-003`, `sk-git/028-003`, `sk-git-028-0003`, `20260911-0001`, `pid-…`) pass the real hook in a final trailer block at **zero subject cost**; subject placement also passes the hook (`feat(sk-git): implement 028/003 identifier minting` → exit 0) but contradicts SKILL.md:402-412 and spends 12-17 of the 80/100 budget (the 117-char `c9` blocks); scope placement dies (numeric → exit 1, hyphenated packet scope passes the hook but is doc-forbidden, slash fails the regex). Minting precedent: `worktree-naming.sh`'s locked high-water allocator (lock dir + counter file in the common Git dir, `next = max+1`, no back-fill, ceiling 999) transfers directly to commit-id minting and already survives 28-worktree contention. Message identity is not unique — **413 duplicated subjects covering 1,002 commits** — so copy operations (cherry-pick/squash) duplicate embedded ids unless policy strips or re-mints them. Survival table: message ids duplicate on cherry-pick; content-derived `patch-id` (measured demo `90bb5766…`) is stable under rebase/cherry-pick but changes on amend/squash and does not exist for merges; hash-derived ids change with the hash. Ranked recommendation: packet-derived hyphen key (`Commit-Id: sk-git-028-0003`) with a fallback namespace, locked minting seeded from the retrofit's frozen old-SHA→new-SHA→id map. Full table: `iterations/iteration-004.md`.

## Iteration 5 — Body and trailer shape

Proposed canonical shape: human prose (Context ≤40 words / Changes / Verification) followed by a final contiguous block of four keys — `Spec: sk-git/028-crawlable-commit-history`, `Phase: 001-research`, `Commit-Id: sk-git-028-0003`, `Refs:` (external links; spec paths kept for compatibility). Measured grounding: `Spec:` already appears in 81 commits but only **2** extract via `%(trailers:key=Spec)` because the other 79 sit before the Co-Authored-By/Claude-Session block; `Phase:`/`Commit-Id:` are greenfield (0); a live `Refs: specs/hooks/016` query returns 4 commits with 0 extractions (search/structure split); body norm is median 101 words (budget ≤120, Context ≤40). `git interpret-trailers` round-trips the four-key block, appends a fresh paragraph when the last line is prose, and merges into `Token:`-shaped last lines (the `Context:` trap). Canonical queries need no new tooling: `-E --grep='^Spec: sk-git/028'` (packet), `^Phase: 001-research` (phase), `--fixed-strings --grep='Commit-Id: sk-git-028-0003'` (identifier), plus `%(trailers:key=…,valueonly)` extraction. The hook currently classifies all four keys as explanatory body — whitelisting them is a recommended contract change. Full shape and demos: `iterations/iteration-005.md`.

## Iteration 6 — Conventions already in the world

Prior-art verdicts (local knowledge, no fetch): **Conventional Commits** is the base layer and this repo already enforces a stricter variant (required scope, vague blocks, caps) — the grammar must extend it, not fork it. **Gerrit Change-Id** is the closest precedent to "the identifier must survive git": a hook-stamped message footer id that survives amend/rebase — its mechanism transfers, its review-change semantics and duplicate-on-cherry-pick expectation are warnings. **Linux kernel trailers** contribute the provenance-key pattern, but `Fixes: <12-hex>` hash references dangle under the planned rewrite — worse here. **Jujutsu** separates change id from commit id (validates the two-identity design) but its store is invisible to git-history consumers. **GitHub/GitLab issue refs** are complementary linking only. **Fossil** content-addressing is incompatible with any rewrite. No prior art provides packet-like addressing; only mechanisms transfer. Worse-than-current list: bare CC without scope, hash-prefix refs, date ids, content ids as the primary address. Full analysis: `iterations/iteration-006.md`.

## Iteration 7 — The retrofit mapping

Cascade over the 9,111-commit pin (`1b57a90d73`): **6,036 commits resolve to a packet** — `Refs:`/`Spec:` path 297+65, numeric-scope + unique matching touched packet 719, exactly-one-packet touch 4,250, multi-packet winner by changed-file count 705 — and **3,075 fall back** (41 dominance ties + 310 scope-only + 2,724 no-signal). The spec-touch signal is the backbone (5,987 commits touch `specs/`; 4,250 touch exactly one packet; 746 touch several). Numeric scope alone cannot resolve the track: of 310 scope-only commits, 52 have one candidate track, 258 span 2-20 (number 80 spans 13 tracks). Fallback archetypes are skill-tree commits (1,491 touch `.opencode/skills`), tooling commits, merges/exempts — non-packet work, not noise. Live drift: four commits landed mid-session, so the map must freeze a SHA with writers stopped. Options surfaced: multi-valued `Spec:` trailers for multi-packet membership (single `Commit-Id:` for the dominant owner), and a deterministic `misc-NNNN` fallback assigned by enumeration. Full cascade and tie rules: `iterations/iteration-007.md`.

## Iteration 8 — Rewrite mechanics and alternatives

Verdict from the installed `git filter-repo --help` contract: a **mirror rewrite with `--commit-callback` is the only mechanism that puts the identifier where both `git log --grep` and GitHub look — the message text**. Mechanics: stream-based fast-export/import that preserves messages (stamp via callback), rewrites hashes, strips extended headers and signatures (11 signed commits measured, status `B`; 98 annotated tags degrade to unsigned), prunes reflogs/old objects by default, aborts on non-fresh clones, and emits a commit-map (`old`/`new` header, all commits listed, null new = removed, cumulative across runs) that is the remap source for angle 9. Traps: `--message-callback` processes **tag messages too** (stamp via `--commit-callback`); `--dry-run` disables message rewriting so id stamping cannot be rehearsed there. **Alternatives rejected on evidence:** `git notes` (0 today; not fetched/pushed by default; `--grep` does not search notes; GitHub renders nothing) and `git replace` (local-only; not fetched by default; no platform support). Rollback = restore refs from an untouched bare backup, since pruned objects are unrecoverable. Full excerpts: `iterations/iteration-008.md`.

## Iteration 9 — Citation remap and blast radius

The citation corpus reduces cleanly: of **7,260 unique 10-40-hex tokens across `specs/**/*.md`**, **1,700 match a commit prefix and 294 are full-SHA commits that all match exactly**, while **5,560 are decoys** (13-digit epoch timestamps, digests) that must stay byte-identical; one token `e5ee6609c2` carries 4,287 occurrences, and 10-hex prefix collisions among the 9,112 commits are **zero**, so the remap key is deterministic. Commit citations live almost entirely under `specs/` (31 markdown files under `.opencode/skills`; none in changelogs or root docs; 1,119 non-markdown hits are CSS colors/digests/benchmark noise). **460 commit messages cite 551 hex tokens** — a layer the first rewrite pass cannot remap (new SHAs do not exist yet), needing a second pass or an explicit dangle decision. One branch name carries a hash (`backup-pre-v4-rebase-3f6b840da7`); no tag or worktree names do. Blast radius: **60 branches, 28 worktrees (2 prunable), 149 tags (98 annotated), 8 origin-tracking refs, 2 dependabot branches**; `main` and `skilled/v*` are pre-push-exempt, live-sync must be stopped and the live branch reset, and CI re-runs as a full wave. Rollback sentence and the nine-step order of operations are specified in the iteration file. Full analysis: `iterations/iteration-009.md`.

## Iteration 10 — Enforcement, tooling and the phase plan

Only one line in `commit-msg` changes (extend `TRAILER_RE` with `Spec`/`Phase`/`Commit-Id`), plus tests; a new `prepare-commit-msg` stamper must be **repo-identity-aware** because the installer symlinks hooks machine-wide (global `core.hooksPath`); its state machine is governed by git's `$2` source (stamp on message/template; preserve ids on amend/rebase/cherry-pick; idempotence mandatory); the allocator reuses `worktree-naming.sh` lock+high-water mechanics; `git-rule-checks.mjs` needs no message check; and the test gap is the real blocker (no commit-msg, prepare-commit-msg, or commit-side allocator tests — nine fixtures already exist from iteration 4). The angles 1-9 output is sorted into 16 ranked items (8 implementable today, 8 contract decisions) and a five-phase plan: **002 contract freeze → 003 forward tooling → 004 mapping → 005 rewrite execution → 006 convergence**, each with its gate. Full table and plan: `iterations/iteration-010.md`.

---

# Final Synthesis — a numbered, crawlable commit grammar for sk-git

Ten iterations, one per dispatch angle, stopped at the configured cap (`maxIterationsReached`). Evidence is local only; every claim traces to a file line or to a command run against the live repository (pinned at `skilled/v4.0.0.0` @ `1b57a90d73`, 9,112 commits, moving while measured).

## S1. Executive summary

Commits are not addressable the way spec packets are. The enforced grammar (`type(scope)[!]: imperative summary`) forbids the obvious design (a number in the scope), the documented contract pushes process metadata into the body, and the only packet link — an optional `Refs: <issue, PR, or spec path>` line present in 3.8% of commits — is unvalidated and, in 66% of its uses, invisible to git's own trailer extraction. A query for the packet's commits (`028` AND `sk-git`) returns 2 of 9,112 today.

The evidence supports a specific, additive design: **keep the subject grammar unchanged; make the final trailer block the address of record.** A commit carries `Spec: <track>/<packet>` (packet context), `Phase: <child>` (optional), `Commit-Id: <track>-<packet>-<NNNN>` (the minted address), and `Refs:` (external links) as one contiguous paragraph at the very end of the message. The identifier is a literal, hyphen-only token; it lives in message text, which is the only surface both `git log --grep` and GitHub index, and the only surface that survives rebases, cherry-picks, and a filter-repo rewrite. It is minted by the same locked high-water allocator the repository already trusts for worktree names, seeded once by the retrofit and extended per packet (plus a `misc` namespace for the ~34% of commits that belong to no packet).

The retrofit is bounded and reviewable: a deterministic cascade maps **6,036 of 9,111 commits** to a packet (trailer path 362; numeric scope + matching path 719; single-packet touch 4,250; multi-packet dominance 705) and assigns the remaining **3,075** to a deterministic fallback (41 dominance ties adjudicated, 310 scope-only, 2,724 no-signal). The rewrite runs on a mirror with `git filter-repo --commit-callback`, preserving messages, authors, and dates while losing 11 signatures and degrading 98 annotated tags; citations remap from the commit-map — **1,700 prefix-matching tokens + 294 full-SHA citations** among 7,260 unique tokens, with 5,560 decoys left byte-identical — plus an explicit decision about the **460 commit messages** that cite other hashes. Rollback is a restore from a bare backup, and the window requires freezing writers because the branch gained 4 commits during this very session.

Verdict: the engineering path is sound and measured end to end. What remains are contract decisions, not unknowns.

## S2. The proposed grammar (contract candidate)

```text
type(scope): imperative summary            <- unchanged (hook-enforced today)

Context: <problem, <=40 words>

Changes:
- <observable change>

Verification:
- `<command>` -> <result>

Spec: sk-git/028-crawlable-commit-history
Phase: 001-research
Commit-Id: sk-git-028-0003
Refs: specs/sk-git/028-crawlable-commit-history
```

Rules, each measured:

1. **Placement law** — the machine keys are one contiguous final paragraph, separated from prose by a blank line. Git extracts only that paragraph (`%(trailers:key=…)`); `Spec:`'s 81-vs-2 extraction gap proves the cost of ignoring this.
2. **Literal token** — hyphens only, no `/`, no `#`; `git log --fixed-strings --grep='Commit-Id: sk-git-028-0003'` and GitHub token search both hit it.
3. **Query set** — by packet: `git log -E --grep='^Spec: sk-git/028'`; by phase: `^Phase: 001-research`; by id: the fixed-strings query; values: `%(trailers:key=Commit-Id,valueonly)`.
4. **Body budget** — ≤120 words (measured median 101), Context ≤40 words, trailer block ≤5 lines and no prose inside it.
5. **Hook** — extend `TRAILER_RE` (hook:117) with the new keys so "explanatory body" means human prose; stamp via `git interpret-trailers` appended to a fresh final paragraph (never to a `Token:`-shaped last line).

## S3. Identifier design and minting

- **Chosen shape:** `Commit-Id: sk-git-028-0003` (packet-derived, hyphen form; ranked first against ordinal, per-track, date-based, content-derived, and hash-derived candidates).
- **Minting:** lock directory + per-namespace high-water file in the common Git dir, `next = max + 1`, no back-fill, ceiling — the exact `worktree-naming.sh` mechanism, seeded by the retrofit and read O(1) forward. The retrofit itself is single-writer enumeration from the frozen graph (no lock needed).
- **What survives:** the message text survives rebase/cherry-pick/amend/rewrite; the *id remains valid* across all of them. What does not survive: uniqueness under copy — cherry-pick duplicates the id (1,002 commits already share subjects). Policy options are strip-and-re-mint on copy (detectable via `patch-id`) or redefinition of the id as a change-lineage handle. This is decision #4 in S8.
- **What does not survive without care:** the *mint* must never happen inside the rewrite callback; the id comes from the frozen plan, joined to the commit-map by old SHA. A re-run without the map shifts ids.

## S4. The retrofit mapping rule

1. `Refs:`/`Spec:` naming a `specs/<track>/<packet>` path → that packet (362 commits; precise).
2. Numeric scope + exactly one touched packet whose number matches → that packet (719).
3. Exactly one touched packet → that packet (4,250).
4. Multiple touched packets → the changed-file-count winner (705), tie-break: deepest path, then lexicographic, then manual (41 adjudicated).
5. Nothing → `misc-NNNN`, assigned by deterministic enumeration (committer date, subject, old SHA) over the frozen set (3,075; includes the 41 ties, 310 scope-only, 2,724 no-signal).

Every commit gets exactly one `Commit-Id:`. Multi-packet commits may carry one `Spec:` per touched packet (decision #5). Merge/exempt commits: default is a `misc` id with their subjects left exempt (decision #3).

## S5. Rewrite and citation-remap runbook

- **Mechanics:** mirror clone + bare backup; `git filter-repo --commit-callback` (not bare `--message-callback` — it would stamp tag messages); messages preserved, signatures and extended headers stripped, tags rewritten (98 annotated), reflogs/old objects pruned; commit-map (`old`/`new`, cumulative) is the join key.
- **Remap:** dry-run-first script; prefix-index of old SHAs (assert zero collisions — measured 0); replace `[0-9a-f]{10,40}` tokens only when `old[:L] == token`, emitting `new[:L]`; 1,700 + 294 real citations, 5,560 decoys untouched; residue scan must return zero old prefixes. Message-internal cites (460 messages) need a second pass or an explicit accept-dangling decision (decision #6).
- **Blast radius:** 60 branches, 28 worktrees (2 prunable), 149 tags, 8 origin-tracking refs, 2 dependabot branches; live-sync disabled during the window and the live branch reset after; pre-push allowlist already exempts `main` and `skilled/v*`; CI re-runs on `main`/`skilled/**`.
- **Rollback sentence:** stop the window, restore every ref from the pre-rewrite bare backup, re-enable autosync, and treat the pre-rewrite SHAs as canonical until the rewritten state passes every invariant check; the rewritten mirror is abandoned, not repaired.
- **Order of operations:** freeze writers → backup + mirror → freeze map → rewrite with id stamping → verify invariants → remap citations → tags → operator-authorized force-push of `main` + `skilled/v4.0.0.0` + tags → follower sync → query acceptance.

## S6. Enforcement, tooling, phases 002-006

- `commit-msg`: one-line `TRAILER_RE` extension + fixture tests (none exist today).
- `prepare-commit-msg` (new): repo-identity-aware, allocator-backed, idempotent; stamp on message/template, preserve on amend/rebase/cherry-pick, skip merges per policy; the machine-wide install is the reason detection is mandatory.
- `commit-id-naming.sh` (new): the allocator, mirroring `worktree-naming.sh`; tests mirror `worktree-naming.test.sh`.
- Docs: SKILL.md §6, the template asset, `commit-workflows.md` Step 5, `quick-reference.md` queries, one commit-formation playbook.
- `git-rule-checks.mjs`: no message check needed; defer a rewrite-window advisory to phase 005.
- Phases: **002 contract freeze** (gate: operator-approved decision record) → **003 forward tooling** (gate: hook/allocator suites green + legacy-pass regression) → **004 mapping** (gate: frozen map, 100% assigned, ties adjudicated) → **005 rewrite execution** (gate: invariants + operator go/no-go per push, rollback armed) → **006 convergence** (gate: acceptance evidence from a fresh clone + GitHub, CI green, backup retention closed).

## S7. Eliminated alternatives

Numeric/packet scope placement (hook-blocked and doc-forbidden); subject-prefix default (budget + contract); hash-derived ids (change with the hash); date-based ids (redundant, racing); content-derived ids as primary (wrong question, merge holes); kernel hash-prefix references (dangle under rewrite); Fossil content addressing (no rewrite); `git notes` and `git replace` (not message-searchable, not published, not rendered); pickaxe (diffs only); trigger-index ingestion (docs-only corpus; new pipeline needed); scope-only mapping (2-20 track ambiguity); trailer-primary mapping (362 commits); non-markdown and uppercase citation scans (noise); the brief's fixture counts as execution numbers (live drift).

## S8. Open contract decisions (ranked)

1. Freeze the contract (key set, placement law, id shape, fallback namespace, enforcement level, cherry-pick policy) — phase 002 is blocked on this.
2. Identifier confirmation: `sk-git-028-0003` form and `misc-NNNN` fallback.
3. Which commits receive ids (merges/exempts) and the fallback enumeration key order.
4. Cherry-pick/squash duplication policy (strip-and-re-mint vs accepted duplication).
5. Multi-valued `Spec:` vs single dominant owner for multi-packet commits.
6. Message-internal citation second pass (460 messages, 551 tokens).
7. Enforcement level and rollout order (warn → `Spec:`-scoped block → full).
8. Stamper install scope (machine-wide symlink vs repository-scoped hooks path).
9. Signature-loss acceptance and any re-signing (11 commits, 98 tags).
10. Phase plan approval and rewrite-window authorization (push set + rollback readiness).

## S9. Convergence Report

- Stop reason: `maxIterationsReached` (hard cap; early-convergence synthesis suppressed by design).
- Total iterations: 10 of 10.
- Questions answered: 10 / 10 angles. Contract decisions carried forward: 10 (S8).
- New-information ratios: `1.00, 0.90, 0.85, 0.85, 0.80, 0.60, 0.85, 0.80, 0.80, 0.75`; last-three rolling average 0.78, above the 0.05 threshold throughout (threshold telemetry only).
- Quality: every iteration cites files/lines or command output; source diversity spans the hook, skill docs, git history, retrieval runtime, filter-repo help, and CI/live-sync config; no single-weak-source finding.
- Live drift: the measured branch moved from 9,106 (brief) → 9,108 → 9,112 commits during the session; all retrofit numbers are pinned to `1b57a90d73` and must be re-derived at execution time.
- Unknowns retained: GitHub search tokenization (offline), committer-date preservation under filter-repo (verify on mirror), operator policy answers (S8).

## S10. References

Primary local authorities:

- [SOURCE: file:.opencode/scripts/git-hooks/commit-msg:43-48,72,79-81,83-105,110-117,123-129,139-141,153-155]
- [SOURCE: file:.opencode/skills/sk-git/SKILL.md:352-519]
- [SOURCE: file:.opencode/skills/sk-git/assets/commit-message-template.md]
- [SOURCE: file:.opencode/skills/sk-git/references/commit-workflows.md:163-214]
- [SOURCE: file:.opencode/skills/sk-git/scripts/worktree-naming.sh:8-32,209-247,250-309]
- [SOURCE: file:.opencode/scripts/install-git-hooks.sh:29-107]
- [SOURCE: file:.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:1-80]
- [SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:29-70]
- [SOURCE: file:.opencode/skills/sk-git/references/remote-branch-policy.md:36-70]
- [SOURCE: file:.opencode/bin/git-sync.sh:3-28]
- [SOURCE: command:git filter-repo --help]
- [SOURCE: command:git log/grep/trailer/scan runs over skilled/v4.0.0.0 @ 1b57a90d73]
- [SOURCE: file:.opencode/specs/sk-git/028-crawlable-commit-history/001-research/research/dispatch-prompt.md]
- [SOURCE: file:.opencode/specs/sk-git/028-crawlable-commit-history/001-research/research/lineages/deepseek/iterations/iteration-001.md … iteration-010.md]
