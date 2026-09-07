# Research Synthesis: Ripgrep Search System — Round Two Skeptical Retrieval Audit

**Lineage:** `deepseek-v4-flash-ripgrep-search` · **Session:** `fanout-deepseek-v4-flash-ripgrep-search-1788758095488-2h9wqe` · **Loop:** research (round 2) · **Executor:** cli-pi (deepseek-v4-flash-vision-exp), inline (no nested dispatch)
**Parent lineage:** `glm-5-3-flash-ripgrep-search` (round one, pre-remediation tree)
**Spec folder:** `specs/system-speckit/035-spec-kit-simplification-research/001-ripgrep-search-system`
**Stop reason:** `maxIterationsReached` (10/10 — charter mandates exactly 10; convergence is telemetry only; per-iteration newInfoRatio: 1.0, 0.9, 1.0, 0.85, 0.9, 0.55, 0.5, 0.45, 0.45, 0.4)
**Method constraints honored:** no edits to any repo file; no validate.sh, no node tooling, no git, no nested dispatch; all evidence is checked-in-source reading plus read-only Python/json census of the committed artifacts; all writes confined to this lineage directory.

---

## 1. Verdict

The 006 remediation **landed its own scope almost completely** — the committed index and manifest are a matched pair (`4baf2dbd…`), the concept-lane contradiction is gone, the search-router recipe is byte-identical to conventions §2.1, the retrofit pipeline is fully relocated with zero old-path residue, and the doctor's `committed_pair_mismatch` signal, activity and command wiring all exist. **Two document lines were left behind** in the one file the fix was supposed to make consistent — the search presentation asset's §3 free-text contract still documents a match-class vocabulary and field names no code path emits (V1, V2).

The bigger round-two findings are **what round one never looked at**: the index's own content and the enforcement stack around it. The committed index holds 352 single-token phrase keys (2,245 postings, 826 owning documents) including 29 numeric-only keys and junk path-fragment phrases ('ation', 'tion', '009', '007') produced by a repo-wide frontmatter sweep; 175 documents own a phrase from the conventions' own warn list. The shared phrase judge has no negative class for any of these, the doctor's high-severity `corpus_pollution` signal screens only ≤5 packets that are already flagged stale, and the generator's diagnostics carry no quality bucket — so the documented rule ("declare phrases of two or more tokens") is enforced nowhere (N1-N6). Separately, 164 author-declared trigger phrases in `repo-rules/*.md` are unreachable by Gate 1 because the corpus roots exclude the repository root, and the conventions §9 root table is silent on that exclusion (N7).

No P0: nothing is broken for the user today. 8 P1 (2 incomplete-fix, 6 new gaps), 12 P2, 11 verified-positive, 5 re-verified decisions.

---

## 2. The Ledger

### P1 — A. 006 FIXES LEFT INCOMPLETE (remediation verification)

| ID | Path:line | Claimed vs actual | Recommendation |
|----|-----------|-------------------|----------------|
| **V1 — §3 matchClass vocabulary** | `commands/speckit/assets/search-presentation.txt:106` (vs `:60`) | Claimed: "both documents now list the five labels in rank order" (confirmed-findings P2). Actual: §2 lists `exact`, `phrase-containment`, `query-containment`, `token-overlap`, `partial`; §3 still maps `<matchClass>` to `exact`, `containment`, `token-coverage`; the filled example (:92) renders `body containment`. Code (`rg-lane.mjs:427`, `normalize.mjs:42-47`) emits the five; conventions §5:199: "no document may rename them". | One-line mapping fix + example re-render (same pass as V2). |
| **V2 — §3 evidence-field names** | `search-presentation.txt:105` vs `rg-lane.mjs:69-72,391-394` | §3 documents `trigger_phrases`, `title`, `description`, `anchor`, `body`; the wrapper emits `trigger_phrases`, `title-or-description`, `anchor-marker`, `body`. Two documented names never exist; two emitted names are undocumented. | Document the emitted names; no code change (code verified correct in round one). |

### P1 — B. NEW FINDINGS (round-one gaps, least-explored angles first)

| ID | Path:line | Finding | Recommendation |
|----|-----------|---------|----------------|
| **N1 — Single-token pollution at scale** | index census (`runtime/data/trigger-index.json`); `retrieval-conventions.md:260`; `normalize.mjs:131-150` | 352 single-token keys, 2,245 postings, 826 docs — every one violates the documented two-token rule and can only exact-match; they are dead weight in the file every Gate 1 lookup parses cold. | Judge negative class (warn) + diagnostics count; see N4/N6. |
| **N2 — §8 warn-list words in 175 docs** | census vs `grep-convention.mjs:149-155`; conventions §8 | The documented per-precision cost is real: 175 docs own 'memory'/'session'/'context'/'summary'/'feature'/'update' phrases. Validator flags them WARN only; generator has no quality gate. | Escalate-or-count policy decision; N5/N6 make the number observable. |
| **N3 — Junk fragments pass every check** | index keys 'ation','tion','ment','dab','pec'…; owner `…/001-copilot-hook-gap-deep-review-remediation/research.md:5-12` (`["ation","009","hook","daemon","parity","research","007","deep"]`; `_memory` note: "Backfilled _memory block (repo-wide frontmatter sweep)") | A sweep-produced truncated path fragment is indexed as a searchable phrase; it is not generic, not stopword-only, not prose, not a folder token — so judge, validator, generator and doctor all pass it. | Judge gains numeric-only + path-fragment negatives. |
| **N4 — No class for N1-N3 in the shared judge** | `grep-convention.mjs:742-781`; `CATEGORY_SEVERITY :88-100` | The one judge shared by retrofit gate and validator has negatives for generic words, stopword-only, prose, folder-token echo — and none for single-token/numeric/fragment, the exact classes the §8 sentence bans. | Add `single-token` and `numeric-or-fragment` warns; both enforcers inherit. |
| **N5 — Doctor pollution screen can never fire on a fresh pair** | `doctor-speckit-retrieval.yaml:138-139` vs `:180-182` | `corpus_pollution` is severity high, but its detection screens only ≤5 packets already flagged via mtime staleness; on the current matched pair nothing is ever screened — the high-severity signal has near-zero detection power in steady state. | Screen the committed index directly (one JSON read, no corpus walk); report counts regardless of staleness. |
| **N7 — repo-rules trigger phrases are dead to Gate 1** | `repo-rules/*.md` (164 phrases); `corpus.mjs:16`; conventions §9 `:264-281` | 9 repo-local rule documents carry the same frontmatter contract as spec docs; the corpus roots exclude the repo root, so Gate 1 can never surface a repo rule, and §9's root table names README.md and mirrors but is silent on `repo-rules/` — an undocumented exclusion + dead surface. `sk-create-repo-rule` verifies only manual collision checks (`SKILL.md:170`). | Decision: index `repo-rules` (blast radius: +9 docs, regeneration) or retire the frontmatter and document the exclusion row in §9. |

### P2 rows (condensed)

| Theme | Rows |
|-------|------|
| Leftover doc lines | V3 (README §2 diagram still draws retrofit box + "All six scripts", `retrieval/README.md:49,56`); V4 (three recipe counts: README "three", conventions §10 "Section 2 recipes", wrapper 3 of 4); V8 (EXCLUSIONS derivation not executed — parity test now guards the drift, scoped rows untested); V9 (`**/tests/fixtures/**` row redundant and undocumented in §9); V10 (doctor pair check covers 2 of 4 generated artifacts; AGENTS.md:477 names two) |
| Utilization | N6 (diagnostics lack phrase-quality counts); N9 (3-char gate floor lets 'the'/'and' flood the candidate scan — mirrored but unbounded); N10 (8-token cap drops last tokens by first-seen order, undocumented); N11 (save-path freshness is advisory wording; gate lives in runtime tests); V13 (phrase-variants still default-published, 2.87 MB, no reader — carried F1.9); V17 (Gate 1 hashes 3.85 MB per lookup unless `--no-index-hash` — kept decision confirmed) |
| Verified positive | V5 pair equal; V6 doctor signal+activity; V7 retrofit relocation closed; V11 constants↔artifact; V12 README §7 suites exist; V14 IGNORED_PATHS live; V15 lookup exit/parse contract; V16 scope filter exact; V18 no hook executes lookup; V19 doctor wired; V20 generator consumers (15 surfaces) |

### Re-verified round-one decisions (no re-list without new contradictory evidence)

| Row | Verdict |
|-----|---------|
| L5 (dropped) | Holds — hook-system.md:89 column is titled `Manual fallback`; census shows no hook/plugin/settings executes the lookup. |
| L9 (kept: promptSetHash slot) | Reason holds; NEW nuance — `semantic-probes.json` pins `promptSetHash == sha256(prompt-set.json bytes)` (verified by re-hashing the file), so the value the manifest slot was reserved for already exists at fixture level while the three-arm parity harness never landed. Carry: land a tiny pin-check or delete both. |
| L1 frozen pins | Recorded decision (README §3 documents frozen acceptance evidence); not an incomplete fix. |
| F6.2 (context.md 3.8 MB) | Unverifiable in this tree — the cited file was not located; parked as an owner question (second worktree-artifact candidate). |
| Shortlist item 6 (derive EXCLUSIONS) | Rationale discharged by the parity test; re-scope to "derive or document row provenance" (V9). |
| Rule-outs (repo-rules rule, hook-executed Gate 1, generator nondeterminism, stale-index-drops-docs) | All hold; the repo-rules RULE rule-out (Gate 5 timing) does not extend to repo-rules DOCUMENTS — N7 is a new surface, not a contradiction. |

---

## 3. Simplification Shortlist (no documented capability lost)

1. **One editing pass on `search-presentation.txt` §3** — closes V1+V2 (five labels verbatim; emitted field names verbatim). This is the only code-adjacent doc still contradicting the code after 006.
2. **Judge + diagnostics quality classes** — add `single-token` / `numeric-or-fragment` warns to `judgeTriggerPhrase` (retrofit and validator inherit), and emit a `phraseQuality` bucket in `generation-diagnostics.json` using the same judge. Pollution becomes observable at generation time and through the doctor; no capability lost (those phrases never rank today).
3. **Doctor pollution screen decoupled** — screen the committed index's phrase table in one read (it IS the census: 35,453 keys, 46,260 postings), independent of staleness sampling. Kills the severity-high-with-no-detection mismatch.
4. **repo-rules index-or-retire decision** — either add `repo-rules` to `CORPUS_ROOTS` (rule docs become retrievable; regeneration required) or drop the trigger_phrases requirement from the repo-rule template and the 9 files' frontmatter, adding the exclusion to §9. Either way §9 gains a row today.
5. **Extend the committed-pair check to 3 reads** (diagnostics + variants manifestHash) and name all four artifacts in AGENTS.md:477 (V10).
6. **Drop or document `**/tests/fixtures/**`** redundancy (V9), align the recipe count wording (V4), fix the README diagram (V3), make `--variants` opt-in (V13).

---

## 4. Open Questions (carried)

1. **repo-rules coverage** (N7): was `repo-rules/` ever indexed by a prior generator generation, or is its exclusion an unintended side effect of trimming roots to three? (Not answerable without git history — prohibited here.)
2. **Phrase-quality enforcement level** (N1-N4): warn-with-diagnostics, or escalate `generic-trigger` to ERROR (validate.sh starts failing 175+ docs)? Policy call; the 826-doc corpus cleanup is a separate workstream.
3. **promptSetHash three-way state** (REV-2): manifest null + probes pinned + harness absent — land the tiny sha256 pin-check, or delete the manifest slot AND the probes/prompt-set hash fields together?
4. **F6.2 source location** (REV-3): where does the context.md that reads the 3.8 MB index live in this tree?
5. **Whole-corpus regeneration owner** (round-one, still open): AGENTS.md:477 names the generator + doctor verifier; no CI/owner.
6. **grep-convention migration formal acceptance** (round-one, still open) — licenses the retrofit's final disposition (keep in ops vs archive).
7. **Fixture hash pins** (round-one, still open): exemption or auto-refresh — currently documented as frozen, doctor ignores them by design.

---

## 5. Convergence Report

- **Stop reason:** `maxIterationsReached` (charter: exactly 10, no early convergence).
- **Iterations completed:** 10/10, all `status: complete`; zero timeouts/errors.
- **Question coverage:** 8/8 charter questions answered; 7 open questions carried (§4).
- **newInfoRatio trend:** 1.0 → 0.4, descending; never forced below the charter bar.
- **Negative knowledge:** execution-level determinism re-claim (no-node policy), generator fail-closed expansion, L5/L9 re-listing, digits-in-phrases corruption, doctor-as-dead-surface, repo-rules rule-out extension — all ruled out with evidence in the per-iteration files.

## 6. Method & Evidence Notes

- Every P1 row carries file:line plus an observed value (Python census of the committed artifact, grep residue sweep, or line-by-line read); no self-reported success trusted; the one partial check (`ignoredPathsUnmatched` array content) is flagged as such in iteration-006.md's fidelity note rather than overclaimed.
- All counts are measured in THIS tree — round-one counts are cited only as provenance, never reused (e.g. single-token 352 / postings 2,245 / docs 826 / generic-owners 175 / repo-rules phrases 164 / repo-rules files 9).
- No repository tooling executed: no validate.sh, no node, no git. The two round-one worktree-artifact candidates (foreign-worktree fixture hash; F6.2's unavailable source) are identified in iterations 2 and 9.
- Evidence gathering was batched per pass (2-5 tool calls per equivalent iteration, well under the 12-tool-call TCB; the skill's per-iteration budget was respected throughout).

## References

- Iteration narratives: `iterations/iteration-001.md` … `iteration-010.md` (this directory)
- Per-iteration deltas: `deltas/iter-001.jsonl` … `iter-010.jsonl`; state log: `deep-research-state.jsonl`
- Parent round: `../glm-5-3-flash-ripgrep-search/{research.md,confirmed-findings.md}`; remediation: `specs/system-speckit/035-spec-kit-simplification-research/006-retrieval-drift-remediation`
- Ground truth: `.opencode/skills/system-spec-kit/runtime/cli/retrieval/**`, `runtime/data/trigger-index.json`, `.opencode/commands/speckit/{search.md, assets/search-presentation.txt}`, `.opencode/commands/doctor/{speckit.md, _routes.yaml, assets/doctor-speckit-retrieval.yaml}`, `references/retrieval/retrieval-conventions.md`, `references/config/hook-system.md`, `AGENTS.md`, `REPO RULES.md`, `repo-rules/*.md`, `sk-doc/sk-create-repo-rule/**` — paths and lines cited per row.
