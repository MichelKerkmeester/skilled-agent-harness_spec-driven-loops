# Fix plan

Target: topic system-skilled-bots; head: 79519553b62e41c7a018f4e3fde04f1d2f7f30ff

## In scope

### docs:.skilled/skills

- [ ] C-5 P2 .skilled/skills/system-skilled-bots/README.md:11 The README title names the skill `bots skill` and the skill is named `system-skilled-bots`.
  fix: bots skill -> system-skilled-bots
- [ ] A-1 P1 .skilled/skills/system-skilled-bots/SKILL.md:41 The hub entry lists `bots answer` without the `--scope once|deny` option 001 adds, so a reader who follows the doc cannot record a deny.
- [x] B-2 P1 .skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md:34 The reference says a fatigued run is refused `routine-fatigued` before the disabled check, and the code refuses `disabled` first, so the doc describes an order the runtime does not have. [handed off]
- [ ] A-4 P2 .skilled/skills/system-skilled-bots/ROUTER.md:8 The router names four modes and the mode registry carries five, so a reader who counts the modes finds one missing.
- [x] C-3 P2 .skilled/skills/system-skilled-bots/README.md:12 The README says the skill ships a compiled activation manifest, and the compiled front door returns the legacy sentinel instead. [rebutted]

### unowned

- [ ] BAT-01 P1 -:- D2-feature-catalog failed (exit 1).

## Pre-existing or outside the scope

