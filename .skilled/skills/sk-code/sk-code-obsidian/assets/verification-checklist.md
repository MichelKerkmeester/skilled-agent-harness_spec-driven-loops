---
title: Verification-Gate Checklist
description: The Note Database plugin's five real gates as a checklist — tsc, build, vitest, screenshots:verify, and the known 115-problem lint baseline, plus the command set.
trigger_phrases:
  - "obsidian plugin verification checklist"
  - "note database plugin gate baseline"
  - "lint baseline 115 problems"
  - "evidence before claims obsidian plugin"
  - "run the five gates"
  - "completion claim obsidian plugin"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Verification-Gate Checklist

Use this checklist BEFORE claiming any change to the Note Database plugin is complete, fixed, or
working. See `references/verification.md` for the full command set and the measured baseline it
gates against.

---

## 1. OVERVIEW

### Purpose

The plugin's correctness is proven by five real commands, not by inspection of a diff. Four must
stay clean; the fifth — lint — carries a known pre-existing baseline that this packet records
rather than targets. A completion claim that skips any of the five, or that implies the lint
baseline is clean, is not evidence.

### Usage

Work through the sections in order — the iron law, type and build gates, the test gate, the
screenshot freshness gate, and the lint baseline — before claiming a change is done, then confirm
against THE GATE. Use the CLAIMING FORMAT section to report exact numbers, not impressions.

---

## 2. THE IRON LAW FOR THIS SURFACE

**Run the real gate commands and read their actual output and exit status, always.** A capture
succeeding, a build finishing, or code "looking right" proves nothing on its own here.

- [ ] I ran all five gate commands from this checklist, not a subset
- [ ] I read each command's actual output and exit status, not just whether it returned
- [ ] I can state the exact pass/fail counts from `vitest run` and the exact entry count from
  `screenshots:verify`
- [ ] I did not substitute "the code looks correct" for any of the above

**If you cannot check all four boxes, the claim is premature.**

---

## 3. TYPE AND BUILD GATES

- [ ] `npx tsc --noEmit` — exit 0
- [ ] `npm run build` (`node esbuild.config.mjs production`) — exit 0, and the committed `main.js`
  matches a fresh build with no unexpected tracked diff

---

## 4. TEST GATE

- [ ] `npx vitest run` — exit 0
- [ ] Passing count is **at or above** the measured baseline of **386 passing across 49 files**; a
  drop below that floor means a test was broken or silently skipped, not that the suite shrank for
  a good reason
- [ ] A new source file with test-worthy logic got a co-located `*.test.ts`, matching the existing
  convention (tests live beside their source except under `src/__tests__/` and
  `src/data/__tests__/`)

---

## 5. SCREENSHOT FRESHNESS GATE

- [ ] `npm run screenshots:verify` — exit 0, entry count **at or above** the measured baseline of
  **180**
- [ ] Any scenario whose `sources` covered a changed file was recaptured (`npm run screenshots`)
  before verifying — see `assets/screenshot-coverage-checklist.md` for the full scenario-change
  discipline
- [ ] Changed PNGs were opened and visually confirmed — a clean `screenshots:verify` exit proves
  source hashes match, nothing about what the image shows

---

## 6. LINT BASELINE

- [ ] `npm run lint` run and its output read
- [ ] Reported the **exact current count**, not a rounded or remembered one — the measured baseline
  at this packet's audit is **115 problems (100 errors, 15 warnings, 42 autofixable)**
- [ ] Did **not** claim the lint gate is "clean" or "passing" — it is a known pre-existing baseline,
  recorded, not a target this packet or any ordinary change reduces
- [ ] If the change touched files lint already flags, or added new ones, reran `npm run lint` and
  reported the **delta** against 115 — never assert "no regression" without rerunning the count
- [ ] If the change deliberately reduces the count, reported the new exact number with the count
  method used (`npm run lint`, same command, same flags) — never claim a reduction anecdotally

---

## 7. THE GATE (all must hold)

A change is "done" only when: `tsc --noEmit` and `build` both exit 0 with no unexpected diff;
`vitest run` exits 0 with passing count ≥386 across ≥49 files; `screenshots:verify` exits 0 with
entry count ≥180 and any affected PNGs were opened; and `npm run lint`'s exact current count was
read and reported — either unchanged at 115, or reported as an explicit, rerun delta.

---

## 8. CLAIMING FORMAT

### Correct
```
npx tsc --noEmit: exit 0. npm run build: exit 0, no tracked diff. npx vitest run: 386 passed,
49 files (unchanged from baseline). npm run screenshots:verify: 180 entries, all fresh; opened
the 3 changed PNGs in both themes, no visual regression. npm run lint: 115 problems (100 errors,
15 warnings) — unchanged baseline, this change touched no linted file differently.
```

### Incorrect
```
Ran the tests, they pass. Build works. Should be good to merge.
```

---

## 9. RELATED RESOURCES

- [verification.md](../references/verification.md) — the full command set and measured baseline
- [screenshot-coverage-checklist.md](screenshot-coverage-checklist.md) — the scenario-change
  discipline this gate depends on
- [fixture-authoring-checklist.md](fixture-authoring-checklist.md) — the fixture guard test
  `ScreenshotFixtures.test.ts` this gate's vitest run includes
