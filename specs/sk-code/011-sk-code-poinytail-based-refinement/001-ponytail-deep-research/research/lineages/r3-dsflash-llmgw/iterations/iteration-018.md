# Iteration 18: Refutation checks, the hub README, and a mid-run file change

## Focus

The catch-all iteration: re-check the premises behind the earliest findings for movement, open the last unread hub-root artifact (the hub `README.md`), and record what changed under this lineage while it ran. This follows iteration 17's Recommended Next Focus.

## Actions Taken

1. Re-read the exact lines behind f-iter001-001, f-iter002-001, f-iter003-001, f-iter006-001 and f-iter012-001 and tested each premise again.
2. Read the hub `README.md` end to end and compared its surface list, packet list and version against the hub files.
3. Re-checked the quality packet after its mtime moved; read its new version, changelog and ceiling rows.
4. Re-counted the stale packet-name rows in the updated quality SKILL.

## Findings

1. **The hub README is a sixth instance of the two-surface prose, and it contradicts its own packet count.** "Works on" names only "WEBFLOW and OPENCODE context" [SOURCE: .skilled/skills/sk-code/README.md:23], the surface table lists `sk-code-webflow` and `sk-code-opencode` and stops [SOURCE: .skilled/skills/sk-code/README.md:55] [SOURCE: .skilled/skills/sk-code/README.md:56], and "When To Use" repeats "for WEBFLOW and OPENCODE work" [SOURCE: .skilled/skills/sk-code/README.md:89], while the FAQ two sections later says "the hub contains five packets" — the count that includes Obsidian [SOURCE: .skilled/skills/sk-code/README.md:105]. The Related Documents table then lists four packet SKILLs and omits `sk-code-obsidian/SKILL.md` [SOURCE: .skilled/skills/sk-code/README.md:135]. Reproducing case: `rg -n -i "obsidian" .skilled/skills/sk-code/README.md` exits 1 while `rg -n "five packets"` matches line 105. NEW, P2.
2. **The hub README's version lags the hub release by three increments with no note.** The README frontmatter reads 2.2.1.0 [SOURCE: .skilled/skills/sk-code/README.md:8] while `SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json` and `description.json` all read 2.2.4.0 [SOURCE: .skilled/skills/sk-code/SKILL.md:5] [SOURCE: .skilled/skills/sk-code/description.json:4]. The version-authority statement names the four hub JSON/markdown artifacts plus the SKILL and does not say whether the README is exempt [SOURCE: .skilled/skills/sk-code/SKILL.md:17], so a reader comparing front pages sees drift the authority does not explain. Reproducing case: `rg -n "version" .skilled/skills/sk-code/README.md .skilled/skills/sk-code/SKILL.md` prints 2.2.1.0 against 2.2.4.0. NEW, P2 (either bring the README into the authority set or exempt it explicitly).
3. **The quality packet changed under this run, and the change is the phase-009 item landing, not a defect.** `sk-code-quality/SKILL.md` now reads version 1.1.0.0 with a matching `changelog/v1.1.0.0.md`, and lists `scripts/ceiling-report.sh` at lines 93-94, 111 and 320; the ceiling-report absence recorded as IN-FLIGHT in iteration 12 is therefore landed. The hook-naming rows (now lines 132-133) and the 39 stale packet-name rows are unchanged by the update, so f-iter012-001 and f-iter012-002 still hold with shifted line numbers. Recorded as a mid-run file change per steer ruling 3; no action.
4. **Every earliest-finding premise re-checked and still holds.** `workflow-verify.md:86` still claims warnings fail under `--strict` against `validation-rules.md:44`; `sk-code-review/SKILL.md`'s detector still returns `sk-code:code-webflow` for `package.json`/`src/`; `shared/assets/patterns/wait-patterns.js` and the Webflow copy still differ; the quality SKILL's hook rows still name the legacy hook. No refutation; four findings confirmed against the files as they read now.

## Questions Answered

- None fully. This is the refutation and unread-artifact pass, not a question close.

## Questions Remaining

- Iteration 19: the synthesis-preparation sweep — collect original ideas and rejections, and check the remaining unread corners.

## Ruled Out

- **"File the mid-run quality update as drift."** It is a declared in-flight phase completing; version and changelog agree.
- **"Re-file the stale-name count as changed."** It is still 39; only the line numbers moved.
- **"Re-check every recorded finding for line movement."** Only the quality packet's mtime moved; the other four premises were re-read at their exact lines and are stable.

## Dead Ends

- The README's verification table names the sk-doc validator with `--type readme`; the earlier playbook run showed that validator's fallback warning exists when no type is passed, and the README passes the explicit type. No finding.
- The FAQ's "five packets" phrasing is correct and is kept as the internal contradiction evidence for Finding 1.

## Edge Cases

- Ambiguous input: whether the README counts as a versioned hub artifact. Chosen interpretation: it carries a frontmatter version, so its lag needs either inclusion or an exemption note.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: the quality packet's mid-run change was observed after the refutation checks, so f-iter012-001's line numbers in the delta reflect the earlier read; the narrative records both.

## Sources Consulted

- `.skilled/skills/sk-code/README.md`
- `.skilled/skills/sk-code/SKILL.md`
- `.skilled/skills/sk-code/description.json`
- `.skilled/skills/sk-code/sk-code-quality/SKILL.md` (re-read after its mtime moved)
- `.skilled/skills/sk-code/sk-code-quality/changelog/v1.1.0.0.md`
- `.skilled/skills/sk-code/shared/references/workflow-verify.md`
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md`
- `.skilled/skills/sk-code/sk-code-review/SKILL.md`
- `.skilled/skills/sk-code/shared/assets/patterns/wait-patterns.js`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/steer.md`

## Assessment

- New information ratio: 0.80 (two fully new findings, one mid-run observation, one refutation block confirming four findings).
- Questions addressed: none.
- Questions answered: none.

## Reflection

- What worked and why: re-reading the exact cited lines rather than trusting the earlier notes. It confirmed four premises and, through the mtime check, caught the one file that moved.
- What did not work and why: the refutation pass ran before the quality re-count, so the shifted line numbers had to be recorded after the fact; ordering the mtime check first would have avoided it.
- What I would do differently: record a hash or mtime for every file a finding cites, then re-check at the end.

## Recommended Next Focus

Iteration 19: the synthesis-preparation sweep — original ideas and rejections inventory, plus the last unread corners (`sk-code-review/README.md`, quality playbook, opencode config references).
