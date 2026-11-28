---
title: "Evidence: the two alignment reports, copied into the packet"
description: "The manifest for the six files this phase copies out of the operator state root, why they are copied rather than referenced, and the check that reads each one."
trigger_phrases:
  - "alignment evidence"
  - "alignment report copy"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Evidence: the two alignment reports, copied into the packet

Both alignment commands write outside the checkout, under the operator's state root. A clean close that lives only there cannot be checked later, and `prune-runs.cjs` keeps only the newest ten run folders per command. [SOURCE: .skilled/commands/local-skilled-alignment.md:99] So the last run of each command is copied here, and this folder is one of the two things the phase hands to 015.

The other is `../scratch/rebuttals.md`.

---

## 1. WHAT GOES IN EACH FOLDER

| Folder | File | Copied from |
|--------|------|-------------|
| `skilled-alignment/` | `report.md` | `<state>/local-skilled-alignment/system-skilled-bots/<stamp>/report.md` |
| `skilled-alignment/` | `findings.json` | `<state>/local-skilled-alignment/system-skilled-bots/<stamp>/findings.json` |
| `skilled-alignment/` | `recheck.md` | `<state>/local-skilled-alignment/system-skilled-bots/<stamp>/recheck.md` |
| `doc-alignment/` | `report.md` | `<state>/local-doc-alignment/system-skilled-bots/<stamp>/report.md` |
| `doc-alignment/` | `findings.json` | `<state>/local-doc-alignment/system-skilled-bots/<stamp>/findings.json` |
| `doc-alignment/` | `recheck.md` | `<state>/local-doc-alignment/system-skilled-bots/<stamp>/report.md`, copied under the recheck name |

`<state>` is `${XDG_STATE_HOME:-$HOME/.local/state}`. `<stamp>` is the run folder's UTC timestamp.

The doc run has no recheck mode, so its `recheck.md` is its last `report.md` copied under that name. That keeps the two folders the same shape, so a reader who opens one can open the other the same way. The doc run's clean criterion is its report's `- Open findings:` line, and the recheck table is the skilled run's.

---

## 2. THE CHECK THAT READS THEM

```text
$ rg -n '^- Open findings: 0' evidence/*/report.md
evidence/doc-alignment/report.md:13:- Open findings: 0 (0 handed off, 0 rebutted)
evidence/skilled-alignment/report.md:13:- Open findings: 0 (0 handed off, 0 rebutted)
```

Two lines, one per folder. The pattern matches the prefix and not the whole line, because the line continues with the handed-off and rebutted counts.

```text
$ rg -n '^\| (still_open|new) \| 0 \|' evidence/skilled-alignment/recheck.md
6:| still_open | 0 |
7:| new | 0 |
```

Two lines, so the skilled run's recheck left nothing open and found nothing new.

Both blocks show the post-copy state. Today each folder holds only its `.gitkeep`, so `rg -n '^- Open findings: 0' evidence/*/report.md` prints nothing and exits non-zero, because the glob matches no file. That is the honest reading until T020 copies the six files, and it is why the criterion is a completion criterion and not a baseline.

---

## 3. WHAT 015 DOES WITH THEM

015 seeds one finding per row of each handoff file, so a `handed_off` row becomes a finding the review must settle and a `rebutted` row becomes a finding the review may overturn. The verdict cannot read PASS while a filed product failure is open, and the same rule applies here: a `handed_off` row is an open product failure until 015 fixes the code root it names.

The two folders are read-only evidence. A later phase that changes a doc the reports name does not edit them, because they are the record of what the run found at the commit the run read.
