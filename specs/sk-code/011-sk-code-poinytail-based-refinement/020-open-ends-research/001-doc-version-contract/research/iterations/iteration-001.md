# Iteration 1: Why `verify --skill <name>` Exits 1 — Rule, Derivation, or Missing Enforcement

## Focus

Q1 of the strategy key questions: why does `node .skilled/skills/sk-doc/scripts/frontmatter-version.mjs verify --skill <name>` exit 1 on every skill it checks — is the cause (a) the rule as specified, (b) the derivation implementation, or (c) the absence of enforcement? The dispatch left "why does it fail" ambiguous between "which mechanism produces the observed exit 1" and "which line to patch"; the narrowest reading — diagnose the mechanism, no fixes (strategy §4 non-goals) — was chosen.

## Actions Taken

1. Read state: `research/deep-research-config.json`, `research/deep-research-state.jsonl` (4 control records, zero completed iterations), `research/deep-research-strategy.md`. Lineage mode `new`; no exhausted approaches; no pivot lineage.
2. Read the engine `.skilled/skills/sk-doc/scripts/frontmatter-version.mjs` (477 lines; compute/apply/verify/gate).
3. Read the standard `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` (189 lines).
4. Ran `node .skilled/skills/sk-doc/scripts/frontmatter-version.mjs verify --skill sk-code` — observed `340 files | ... ok=6`, exit 1.
5. Ran the enforcement wrapper `.skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh --skill sk-code` — observed exit 0.
6. Searched the enforcement surface: `rg` over `.skilled/hooks`, `.githooks`, `.github/workflows`, `package.json`; read the post-edit router row and hook README.
7. Spot-checked the derivation on `.skilled/skills/sk-code/shared/references/stack-detection.md`: 28 path-commits vs engine-expected 2.2.0.26 while stored is 2.2.0.0.
8. `diff -q` of the two engine copies under `scripts/` and `shared/scripts/` — identical.

## Findings

1. **The exit 1 is the documented expected state, not a fault.** The standard separates `gate` (the enforced check the post-edit hook runs; presence + 4-part format only; never consults git) from `verify` (compares each recorded version against what git implies now; "a reconciliation tool, not a gate") [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:127][SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131]. It states that a fleet-wide `verify` "reports thousands of mismatches on a repository whose `gate` is clean, and that is the expected reading rather than a fault to chase" [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:133]. Observed live: `verify --skill sk-code` → 340 mismatches, exit 1; the same skill's corpus wrapper → exit 0.

2. **The derivation is self-invalidating by construction because `W` is a git-history function.** For every non-`SKILL.md` doc the engine derives `X.Y.0.W` with `W = min(realEditCount(file), 99)` [SOURCE: .skilled/skills/sk-doc/scripts/frontmatter-version.mjs:282], where `realEditCount` counts commits with nonzero per-file added+deleted `numstat` after `git log --follow` [SOURCE: .skilled/skills/sk-doc/scripts/frontmatter-version.mjs:70][SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:90]. Applying `W` is itself an edit that changes `W`, so one pass never converges; the standard mandates a two-pass apply + amend per skill and says the ordinary case is to apply in the same commit as the content change [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:98][SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:106][SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:120]. Nothing carries that discipline into ordinary editing, so stored-vs-derived drift is the default state.

3. **The derivation is faithful; the stored values are stale snapshots from earlier mint epochs.** Spot check on `stack-detection.md`: 28 commits touch the path, the engine derives `W=26` and expects 2.2.0.26, while the stored value is 2.2.0.0 — consistent with zero-line/rename commits being discarded by the numstat gate and with no re-apply since mint [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:1]. Other stored values carry a nonzero `Z` that the current rule seeds to `0` (e.g. `sk-code/README.md` stored 2.2.11.0 vs expected 2.2.0.38) [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:50]. [INFERENCE: Z-bearing stored values were minted under an earlier layout or are human-set values preserved by `skip-conflict`; distinguishing the two needs `git log -S` on the version line and is deferred.] Anchor-era moves also strand children: stored `1.5.0.x` values against expected `2.2.0.y` show child docs were never re-versioned when the skill anchor advanced [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:61].

4. **Enforcement covers presence + format only, on three surfaces, none of which compares stored against derived.** (a) The post-edit hook's row 3 runs the corpus wrapper in `gate` mode scoped by skill [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:200][SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:38][SOURCE: .skilled/hooks/post-edit-quality/README.md:50]. (b) `quick_validate.py` / `package_skill.py` reject a malformed or absent version at package time [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:166]. (c) CI's `skill-doc-frontmatter.yml` runs a different guard (`check-skill-doc-frontmatter.sh`), which checks frontmatter coverage, not version values [SOURCE: .github/workflows/skill-doc-frontmatter.yml:31]. Nothing runs `apply`/`verify` automatically, and even `apply` silently skips a differing value without `--update` [SOURCE: .skilled/skills/sk-doc/scripts/frontmatter-version.mjs:315]. The "nothing enforces it" half is deliberate, documented under the standard's own heading "What nothing enforces" [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:170].

5. **The standard's instruction to "Run it in CI or pre-commit" the corpus gate is unhonored, and honoring it would not catch value drift anyway** — `gate` is presence + format only by design [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:168][SOURCE: .skilled/skills/sk-doc/scripts/frontmatter-version.mjs:397]. A searched surface (`.github/workflows`, `.githooks`, `package.json`) contains no reference to `check-frontmatter-versions.sh` or `frontmatter-version.mjs`; the only version-adjacent CI job is the different coverage guard above.

6. **The engine is duplicated byte-for-byte across two paths.** `.skilled/skills/sk-doc/scripts/frontmatter-version.mjs` and `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs` are identical (`diff -q` clean) [SOURCE: .skilled/skills/sk-doc/scripts/frontmatter-version.mjs:1][SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:1]; the standard links only the `shared/scripts` copy [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:193]. Two copies of drift-sensitive logic double the update surface whenever the contract changes.

7. **Composite answer to Q1.** The rule and the derivation are coherent and functioning; what is not functioning is the expectation of a green fleet-wide `verify`. `verify` is the only consumer of stored-vs-derived equality, it is deliberately not a gate, nothing schedules it, and its derivation changes with every commit that touches a doc — so exit 1 on (nearly) every skill is guaranteed until a skill is two-pass reconciled and then left untouched. The open design question that follows is not "fix verify" but "what property should the stored per-doc version assert?" (feeds Q2–Q4).

## Ruled Out

- `verify` exit 1 as an engine bug — the engine's comparison matches its documented rule, and the spot-check arithmetic supports the derivation.
- The numstat edit counter as silently broken — 28 path-commits resolve to an expected `W=26`, consistent with zero-line/rename commits being discarded as documented.
- "Nothing enforces it" as an accidental oversight — the gate/verify separation and the "What nothing enforces" section are explicit in the standard, so this is a stated boundary, not a gap someone forgot.

## Dead Ends

- "Make `verify` quiet by reconciling the fleet" — explicitly discouraged: the sweep rewrites every in-scope document, buries real changes in noise, and is undone by its own commit [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:135]. Candidate for reducer promotion to Exhausted Approaches; any recommendation that amounts to "run `apply --update` everywhere and commit" is a dead end.

## Edge Cases

- Ambiguous input: dispatch phrase "why does verify fail" — chosen interpretation: diagnose the producing mechanism, not patch it. Deferred alternative: locate the single line to change (that is a fix, out of scope).
- Contradictory evidence: none. Nonzero-`Z` stored values are inconsistent with the current rule but are stale-mint evidence, not conflicting evidence about current behavior; recorded in Finding 3.
- Missing dependencies: none — all scripts, docs, and git history for the spot check were present. The `.opencode` mirror path referenced by CI was not needed because the two engine copies are identical.
- Partial success: none — all planned actions completed.

## SCOPE VIOLATIONS

None. No out-of-scope mutation was attempted; all researched files were read-only.

## Questions Answered

- Q1: Why does verify fail: the rule, the derivation, or the fact that nothing enforces it? — **Answered.** The derivation functions as specified and the rule makes stored-vs-derived equality transient by construction; enforcement checks format presence only, and `verify` — which nothing gates on — reports the accumulated drift. The exit 1 is the documented expected reading for a corpus whose `gate` is clean.

## Questions Remaining

- Q2: What should doc versions mean for an external author?
- Q3: What is the smallest contract that stays green by construction?
- Q4: Should the per-doc version exist at all?
- Q5: Which hooks, generators or CI steps write or check a doc version today, if any? (evidence partially gathered this iteration: post-edit hook gate, package-time validators, separate CI coverage guard; nothing runs verify/apply — to be consolidated under Q5 rather than claimed answered here.)

## Sources Consulted

- `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` (lines 44-55, 61-73, 85-136, 164-172, 193)
- `.skilled/skills/sk-doc/scripts/frontmatter-version.mjs` (lines 50-101, 165-194, 270-339, 389-414)
- `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs` (identical copy, `diff -q` clean)
- `.skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh` (line 13: `exec node ... gate "$@"`)
- `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` (lines 38, 125-128, 200-212)
- `.skilled/hooks/post-edit-quality/README.md` (line 50)
- `.github/workflows/skill-doc-frontmatter.yml` (lines 23-43)
- `.skilled/skills/sk-code/shared/references/stack-detection.md` (spot check: 28 path-commits, expected `W=26`)
- Command outputs: `verify --skill sk-code` (340 mismatches, exit 1); wrapper `gate --skill sk-code` (exit 0), recorded in Action 4-5.

## Assessment

- New information ratio: 1.0 — 6 of 7 findings fully new; 1 partially new (the 340-file count was in Known Context, the mechanism was not): `(6 + 0.5) / 7 = 0.93`, plus the +0.10 synthesis bonus for the gate-vs-verify reframing that resolves the topic's framing question, capped at 1.0.
- Questions addressed: Q1.
- Questions answered: Q1.

## Reflection

- What worked and why: reading the standard's framing (enforced gate vs reconciliation tool) before diagnosing turned the "failure" into a documented expected state in one pass; running both commands live made the separation empirical rather than textual.
- What did not work and why: nothing failed; the one unresolved detail is the mint epoch of nonzero-`Z` stored values, which needs per-file `git log -S` on the `version:` line and does not block Q1.
- What I would do differently: bring a `git log -S "<stored version>"` probe when a stored value's shape contradicts the current rule, instead of deferring it.

## Recommended Next Focus

Q2: what should a per-doc version mean for an external author? Carry the two structural candidates surfaced here — anchor-only `X.Y.0.0` (green by construction, `W` retired) versus a real per-doc revision marker — into Q3's "smallest contract" evaluation. Q5 is largely evidenced already (Finding 4-5) and should be consolidated rather than re-investigated from scratch.
