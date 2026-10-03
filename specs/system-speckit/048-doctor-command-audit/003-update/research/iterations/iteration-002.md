# Iteration 002 — Q1c: The frontmatter/changelog "mismatch" — drift, or measurement artifact?

**Focus:** Q1c — is the system-skill-advisor frontmatter/changelog mismatch accepted practice or drift — is reconciliation an error or a warning?

## Actions Taken

1. Numeric vs lexical changelog resolution: re-ran the frontmatter-vs-newest-changelog scan for system-skill-advisor and all 14 top-level skills using segment-wise numeric sort (`sort -t. -k1.2n -k2n -k3n -k4n`), alongside the lexical tail for comparison.
2. Full-tree scan: every `SKILL.md` under `.skilled/skills/` (59 files, including composite children) checked against the numerically newest `vX.Y.Z.W.md` in its sibling `changelog/` directory.
3. Verdict surfaces: read `system-skill-advisor/SKILL.md` frontmatter, `changelog/v0.14.1.0.md` and `v0.14.0.0.md`, git provenance of both changelog files and of the frontmatter commit.
4. Tooling audit: read `.skilled/commands/doctor/scripts/parent-skill-check.cjs` check 13 (lines 1470–1536) and its `softFail` definition (lines 135–137); inspected `.skilled/commands/doctor/assets/doctor-parent-skill.yaml`; grepped `.skilled/skills/sk-doc/scripts/frontmatter-version.mjs` (header + tests) and `check-skill-doc-frontmatter.mjs`; `git log -S 'sixteen days'` and `git show` on the change-history commits.
5. Registry read for stable graph ids; confirmed prior-iteration records before retracting iteration-1 F5.

## Findings

### F1 — Iteration-1 F5 was a false positive: no frontmatter/changelog mismatch exists anywhere

- `system-skill-advisor/SKILL.md` carries `version: 0.14.1.0`; its changelog's numerically newest entry is `v0.14.1.0.md` (whose own frontmatter also carries `version: 0.14.1.0`). **They match.**
- The iteration-1 claim ("frontmatter 0.14.1.0 vs newest changelog v0.9.0.0") came from a **lexicographic filename sort**: among `v0.1.0.0 … v0.14.1.0`, the string-last file is `v0.9.0.0.md`. system-skill-advisor is the only top-level skill with a double-digit minor, which is why it was the only skill that appeared mismatched.
- With numeric segment-wise sort, **all 14 top-level skills match**, and so do **all 59 `SKILL.md` files** in `.skilled/skills/` (14 top-level + composite/nested children): zero mismatches, zero missing changelog dirs, zero missing `version` frontmatter.
- Corpus detail: 17 advisor changelog entries from `v0.1.0.0.md` to `v0.14.1.0.md`; lexical tail = `v0.9.0.0.md`, numeric max = `v0.14.1.0.md`.

### F2 — The repository already owns this reconciliation, and it treats divergence as an error (warning only under an explicit WIP opt-out)

- `.skilled/commands/doctor/scripts/parent-skill-check.cjs` check 13 is titled **"Release-version parity (canon: soft, one authority per hub)"** (line 1470). Check **13b** compares the SKILL.md four-part version against the newest changelog entry using **segment-wise numeric sort** (lines 1517–1525: `split('.').map(Number)`, four segments), then reports `softFail` at line 1532 when they differ.
- Severity semantics: `softFail(msg)` = `(STRICT_HUB_CANON ? fail : warn)(msg)` (lines 135–137). Under the default canon it is a **hard FAIL** (exit 1); only `PARENT_HUB_CHECK_STRICT=0` — the work-in-progress opt-out documented in the script header — downgrades it to WARN. Exit code is 0 only when no hard invariant failed (lines 1543–1548).
- The checker's own comment (lines 1473–1478) records the history that motivated it: *"Nothing enforced that, and the two drifts it allowed each ran over a fortnight before a human audit caught them: a hub claiming a release with no entry behind it, and a sibling reconciled late in a batch."*
- Commit `96ee85d5b79` — `feat(doctor): catch a hub whose version outruns its own changelog` — added the check. So a real divergence is treated as a **defect to catch and repair**, not accepted practice. The answer to Q1c's second half: **reconciliation is an error by default; warning only under the documented WIP escape hatch.**

### F3 — Version parity is five-artifact-wide, not SKILL.md-only (check 13a)

- Check 13a holds SKILL.md as the release authority and requires four follower artifacts to carry the same version: `ROUTER.md`, `description.json`, `hub-router.json`, `mode-registry.json` (lines 1494–1507).
- Evidence this is enforced in practice: commit `3b1c934e53` (`docs(changelog): record the runtime alignment in each touched skill`) bumps SKILL.md, ROUTER.md, description.json, hub-router.json, mode-registry.json and the changelog file together, across skills (sk-code, sk-doc, system-deep-loop, system-skill-advisor, …).
- Updater implication: per-skill "current version" detection must read all five artifacts and flag intra-skill split versions, not just the SKILL.md/changelog pair.

### F4 — A second, per-doc engine exists with the same direction of truth: the changelog suppresses a stale frontmatter

- `.skilled/skills/sk-doc/scripts/frontmatter-version.mjs` (compute/apply/verify) derives the doc's version as **`max(frontmatter, newest changelog entry)`** — proven by its test fixture `.skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs:79` (`SKILL.md with a stale 3-part version; changelog is higher -> anchor 2.3.0.0`, `anchorSource = max(fm,changelog)`), and `verify` checks each in-scope file's version equals the computed value.
- So the repo has two independent enforcement surfaces (doctor check 13, sk-doc version engine) and both make the **newest changelog entry the ground truth** that frontmatter must not contradict.
- `check-skill-doc-frontmatter.mjs` (advisor runtime) checks only `title`/`description` non-emptiness — no version logic; reconciliation deliberately lives in the doctor and sk-doc surfaces.

### F5 — Implications for the release-aware updater (design constraints, not implementation)

- **Compare versions segment-wise numerically, never as strings.** The repo's own checker is the reference implementation; any lexical comparison reproduces iteration-1's false mismatch. This binds the updater's detection of both release tags and per-skill versions.
- **Classification protocol for divergence:** if SKILL.md (the declared release authority) is ahead of its newest changelog entry, or a follower artifact splits from it, report the component as **blocked-by-reconciliation** (error-level), not merely as a caveat — mirroring doctor check 13b. A WIP/downgraded mode may exist, but it must be explicit (`PARENT_HUB_CHECK_STRICT=0`-style), never silent.
- **Per-component evidence to read:** the five routing artifacts (13a), the SKILL.md version, the newest changelog entry, and (optionally) the sk-doc `max(fm,changelog)` anchor for docs.
- **For this checkout today**, system-skill-advisor is consistent and updatable; there is no drift to carry into the Q2 detection design.

## Questions Answered

**Q1c — answered: neither drift nor accepted practice — the mismatch does not exist.** It was a lexicographic-sort artifact in the iteration-1 scan (lexical tail `v0.9.0.0.md` vs numeric max `v0.14.1.0.md`). All 59 `SKILL.md` files match their numerically newest changelog entry. Where a genuine divergence would occur, the repo's existing canon (doctor `parent-skill-check.cjs` check 13b, `softFail` = FAIL under default `STRICT_HUB_CANON`) treats it as an error; it downgrades to a warning only under the explicit `PARENT_HUB_CHECK_STRICT=0` WIP opt-out. The check was added in commit `96ee85d5b79` precisely because historical drifts ran over a fortnight undetected.

## Questions Remaining

- Q2 (next focus): which customization/override signals does this repository produce or could produce cheaply (three-way merge against the release base, provenance markers, hashes, git history)?
- Q3: how to build and present an alignment proposal for a customized skill while keeping its override specifics.
- Q4: one command or several; what happens to today's database-rebuild behaviour of `/doctor:update`.
- Q5: each command's shape under the sk-create-command contract and reuse of install/sync scripts.
- Q1a (carried): fallback path when the operator checkout has no git metadata or no gh auth.
- Q1b (carried): whether composite child skills are independent update units — note that this iteration's 59-file scan confirms children do carry their own `version` frontmatter and changelog directories, which strengthens the case for treating them as independently versioned units (to be decided under Q1b).

## Next Focus

Q2: enumerate the customization/override detection signals available in this repository (per-skill path diffs against a release base, symlink topology that makes runtime copies drift-free, provenance markers in skills, content hashes, git history) and judge which are cheap and reliable enough for the updater.

## SCOPE VIOLATIONS

None. All reads were read-only; writes were confined to this iteration's narrative and delta files plus the append gateway's own writes.

## Graph Events (also emitted in the iteration record)

- q1c (QUESTION) answered by f-iter002-001 and f-iter002-002
- claim-iter001-f5 (CLAIM) — contradicted by f-iter002-001
- f-iter002-001 — no real drift; lexical artifact (all 59 SKILL.md match numerically)
- f-iter002-002 — check 13b significance: FAIL by default, WARN only under explicit WIP opt-out
- f-iter002-003 — five-artifact version parity (13a)
- f-iter002-004 — sk-doc `max(frontmatter, changelog)` anchor engine
- Sources: `parent-skill-check.cjs` check 13; `frontmatter-version.mjs`
