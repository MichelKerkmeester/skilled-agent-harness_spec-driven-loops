# Iteration 004 — sk-prompt Note Drift, CLI Card Delegation, Changelog Move, and Playbook Validity

## Focus

Key questions 7, 8 and 9:

- Q7: Does sk-prompt match its v4.0.0.0 note, and do the cli-* skills consume `sk-prompt/assets/cli-prompt-quality-card.md` the same way?
- Q8: Did the v4.0.0.16 move Changelogs Live in Skills Only leave stale changelog paths or references in these four hubs?
- Q9: Do the manual testing playbooks touched in v4.0.1.0 point at files, commands and scenarios that exist?

## Actions Taken

1. Read `sk-prompt/SKILL.md` (314 lines), the canonical `assets/cli-prompt-quality-card.md` (212 lines), the `/prompt:improve` command (4,899 bytes) and its three assets, and confirmed the `@prompt-improver` agent exists.
2. Compared the skill against the v4.0.0.0 release note's "Prompt Engineering" section and against sk-prompt's own v4.0.0.0 changelog.
3. Ran `check-prompt-quality-card-sync.sh` and inspected all seven `cli-*` executor cards for their delegation link and for inlined framework/CLEAR tables; tested the canonical card's §9 relative links with `test -f`.
4. Swept every symlink under `.skilled/changelog/` for a broken target and grepped the four hubs for packet-local or stale changelog guidance.
5. Ran `validate-playbook-package.cjs` in strict mode against the four hub playbook roots, then read the persistence-marker check.
6. Used `git log` and `git show v4.0.0.0:` to date the canonical card's §8/§9 text and the marker check.

## Findings

### F1 — The v4.0.0.0 release note says sk-prompt ships DEPTH, but the same release removes it (drift, P2)

The release note describes the shipped skill as "seven frameworks, DEPTH thinking and CLEAR scoring". The skill's own v4.0.0.0 changelog says the DEPTH thinking framework is removed and `references/depth-framework.md` became `references/improvement-checklist.md`. The current `SKILL.md` names seven framework presets and CLEAR, and contains zero DEPTH mentions. A reader who trusts the release note expects a framework the release itself deleted.

- Type: drift
- Severity: P2
- Release: v4.0.0.0
- Confidence: high
- Evidence:
  - [SOURCE: .skilled/changelog/skilled/v4.0.0.0.md:400] "`sk-prompt` is the single home for prompt work: seven frameworks, DEPTH thinking and CLEAR scoring behind `/prompt:improve`"
  - [SOURCE: .skilled/skills/sk-prompt/changelog/v4.0.0.0.md:13] "The DEPTH thinking framework is removed, and `references/depth-framework.md` became `references/improvement-checklist.md`"
  - [SOURCE: .skilled/skills/sk-prompt/SKILL.md:38] lists RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE and CRAFT as optional presets with CLEAR screening; no DEPTH mention
- Verify:
  ```bash
  rg -n 'DEPTH' .skilled/changelog/skilled/v4.0.0.0.md          # line 400 claims it ships
  rg -n 'DEPTH thinking framework is removed' .skilled/skills/sk-prompt/changelog/v4.0.0.0.md
  rg -c 'DEPTH' .skilled/skills/sk-prompt/SKILL.md              # 0
  ```

### F2 — The canonical CLI card's mirror contract names three cards and lists one twice (drift, P2)

The card's Mirror Sync section says "All three cli-* cards (`cli-claude-code`, `cli-opencode`, `cli-opencode`)". Seven executor cards exist, the sync guard checks all seven, and `cli-opencode` is named twice. The guard therefore enforces a seven-card contract while the canonical prose describes a three-card one. The text was already present at tag `v4.0.0.0` and is unchanged at `v4.0.2.0`.

- Type: drift
- Severity: P2
- Release: v4.0.0.0 baseline (present at the tag; still live at v4.0.2.0)
- Confidence: high
- Evidence:
  - [SOURCE: .skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md:192] "All three cli-* cards (`cli-claude-code`, `cli-opencode`, `cli-opencode`) are THIN DELEGATING mirrors"
  - [SOURCE: .skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md:197] names the duplication guard at `.skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh`
  - The guard's CHECK 1 prints seven PASS rows (claude-code, codex, cursor, deepseek-harness, devin, opencode, pi) and ends `GUARD PASS`
- Verify:
  ```bash
  rg -n 'All three cli' .skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md   # line 192
  fd -HI 'prompt-quality-card.md' .skilled/skills/cli-external-orchestration | wc -l  # 8 (7 executor cards + 1 playbook subfile)
  bash .skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh
  ```

### F3 — Two RELATED RESOURCES links in the canonical card resolve outside the skills tree (bug, P2)

Both §9 links climb one directory too far. From `sk-prompt/assets/`, `../../../` lands on `.skilled/`, so the targets become `.skilled/cli-claude-code/...` and `.skilled/cli-external-orchestration/...`; neither exists. The correct prefix is `../../`, which reaches `.skilled/skills/cli-external-orchestration/...`. The same two lines were present at tag `v4.0.0.0`.

- Type: bug
- Severity: P2
- Release: v4.0.0.0 baseline (present at the tag; still live at v4.0.2.0)
- Confidence: high
- Evidence:
  - [SOURCE: .skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md:211] "- `../../../cli-claude-code/assets/prompt-quality-card.md`"
  - [SOURCE: .skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md:212] "- `../../../cli-external-orchestration/cli-opencode/assets/prompt-quality-card.md`"
- Repro:
  ```bash
  test -f .skilled/skills/sk-prompt/assets/../../../cli-claude-code/assets/prompt-quality-card.md || echo MISSING
  test -f .skilled/skills/sk-prompt/assets/../../../cli-external-orchestration/cli-opencode/assets/prompt-quality-card.md || echo MISSING
  test -f .skilled/skills/cli-external-orchestration/cli-claude-code/assets/prompt-quality-card.md && echo TARGET_EXISTS
  ```
  Both `MISSING` lines print; `TARGET_EXISTS` prints.

### F4 — The playbook validator warns every root playbook missing an advisory marker, including packages it then SKIPs (improvement, P2)

`executionContractChecks` checks for `MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT` unconditionally, before the package tier is known. In the four-hub run, sk-doc and sk-design are SKIPped as routing-gold packages (`operator=0`), yet each still reports `RESULT_PERSISTENCE_MARKER_MISSING`; sk-prompt passes but carries the same warning among its four. Only sk-code carries the marker. The warning does not change the exit status, so three hubs report a finding that has no scenario-level fix and no effect on the verdict.

- Type: improvement
- Severity: P2
- Release: v4.0.0.0 baseline (the check is in the initial commit `330427cf30`, 2026-09-17; observable at v4.0.2.0)
- Confidence: high for the behavior; medium that the warning is unintended for routing-gold packages
- Evidence:
  - [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:749] `if (!text.includes(RESULT_PERSISTENCE_MARKER)) {`
  - [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:751] `'RESULT_PERSISTENCE_MARKER_MISSING',`
  - [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md:182] the template carries `<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->`
- Verify:
  ```bash
  for h in sk-doc sk-code sk-design sk-prompt; do
    node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs \
      --package ".skilled/skills/$h/manual-testing-playbook" --format text | tail -6
  done
  for h in sk-doc sk-code sk-design sk-prompt; do
    printf '%s: ' "$h"; rg -c 'MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT' \
      ".skilled/skills/$h/manual-testing-playbook/manual-testing-playbook.md" || echo 0
  done   # sk-doc 0, sk-code 1, sk-design 0, sk-prompt 0
  ```

## Observations (command evidence, no narrative finding)

- **O1 — Q9 validator results.** Strict run against the four playbook roots: sk-doc `SKIP package=sk-doc tier=FAIL_CLOSED scenarios=29 categories=8 operator=0 routing_gold_excluded=29 violations=0 warnings=1`; sk-code `PASS ... scenarios=27 ... operator=18 ... violations=0 warnings=0`; sk-design `SKIP ... scenarios=4 categories=3 operator=0 routing_gold_excluded=4 violations=0 warnings=1`; sk-prompt `PASS ... scenarios=28 categories=7 operator=28 ... violations=0 warnings=4`. Zero violations across all four. The only unresolved path is `clear-scoring/forty-of-fifty-threshold.md:82` → `../../manual-testing-playbook.md`, already recorded as `finding-2-6` in the registry and not re-reported here.
- **O2 — Q8 changelog sweep is clean.** Every symlink under `.skilled/changelog/` resolves (the broken-link sweep printed none), including all 26 links in the four hub folders (`sk-doc` 15, `sk-code` 6, `sk-design` 4, `sk-prompt` 1). The four hubs' guidance is global-only: `sk-create-changelog/SKILL.md` says changelogs live only under `.skilled/changelog/` and each skill's own `changelog/`, and the deprecated packet-local path is labeled as deprecated rather than presented as current. `sk-prompt` is a direct symlink to its skill changelog; the other three are link directories with a `parent` link, which matches their hub shape.
- **O3 — Q7 consumption is consistent.** All seven executor cards link to `../../../sk-prompt/assets/cli-prompt-quality-card.md`, the sync guard passes both checks for all seven, and none re-inlines the framework or CLEAR table. The `/prompt:improve` command is a 4,899-byte router with `prompt_improve_auto.yaml`, `prompt_improve_confirm.yaml` and `prompt_improve_presentation.txt`; `@prompt-improver` exists at `.skilled/agents/prompt-improver.md`. `prompt-models` and `small-model` appear only in historical changelog entries, not in the current skill or command.
- **O4 — validator entry-point friction.** `--package .skilled/skills/sk-prompt` exits 2 with `package does not resolve to a manual-testing-playbook root`; `--package .skilled/skills/sk-prompt/manual-testing-playbook` works. The error text at `validate-playbook-package.cjs:1224` does not name the expected subpath, although `--help` says "one package or an explicit playbook root". Recorded as command evidence, not a separate finding.

## Questions Answered

- Q7: **The skill matches the note's substance, but the note contradicts itself on DEPTH, and the canonical card's own mirror prose is stale.** Seven frameworks, CLEAR, the one-pass checklist, the thin `/prompt:improve` router and `@prompt-improver` all match; the retired `prompt-models` and small-model skills are gone. The note's claim that DEPTH ships is contradicted by sk-prompt's own v4.0.0.0 changelog (F1). Consumption is consistent: all seven cli-* cards delegate to the canonical card with the correct path and the guard passes; the defect is the card's §8 prose (F2) and its §9 links (F3).
- Q8: **No.** The v4.0.0.16 move left no stale changelog path or reference in the four hubs. All changelog links resolve, and the hub docs consistently state the global-only rule and mark the packet-local path deprecated.
- Q9: **Yes, with one known exception.** The strict validator reports zero violations on all four hub playbook roots; sk-code and sk-prompt pass, sk-doc and sk-design are skipped as routing-gold packages. The one unresolved backtick path in sk-prompt is already in the registry. The new issue is the advisory marker warning on three of four roots (F4).

## Questions Remaining

- Q10: Which templates, references, assets or modes across the four hubs have no inbound route or duplicate another, and what breaks if each is removed?
- Q11: What friction do the operator and the AI user hit in these hubs: ambiguous mode choice, unclear validator errors, large mandatory loads? (Partly addressed by F4 and O4.)
- Q12: What concrete extensions would let the four hubs share validators, routing tests or templates, based on gaps found in this run?

## Next Focus

Iteration 5 should take Q10 and Q12. Q10: build an inbound-route inventory for the four hubs' templates, references, assets and modes, then name what breaks if each is removed; the validator entry point and the canonical card's mirror prose are two candidates already surfaced. Q12: derive a shared-validator proposal from the concrete gaps found in this run, starting with a card-link resolver and a playbook-root wrapper that accepts a skill root and resolves its `manual-testing-playbook/` child. Q11 should be answered from the operator path through the same evidence rather than as a separate sweep.

## SCOPE VIOLATIONS

None. All research commands were read-only (`rg`, `fd`, `ls`, `sed -n`, `test -f`, the sync guard, the playbook validator in strict/check mode, `git log` and `git show`); writes were limited to this iteration's narrative, its delta file, the append-gateway event file and the gateway's own state-log refresh.
