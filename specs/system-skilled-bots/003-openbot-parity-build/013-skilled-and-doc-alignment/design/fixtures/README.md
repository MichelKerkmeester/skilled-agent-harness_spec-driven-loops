---
title: "Design fixtures: the alignment run records"
description: "The golden files the alignment record shapes are checked against, one per record, each produced by the script that writes it rather than typed by hand, with the check that reads it."
trigger_phrases:
  - "alignment fixtures"
  - "findings json golden"
  - "recheck golden"
importance_tier: "normal"
contextType: "implementation"
version: 1.0.0.0
---

# Design fixtures: the alignment run records

One golden per record `design/records.md` fixes. Every file here was produced by the script that writes it, not typed by hand, so a shape change in a script shows up as a diff against a golden rather than as a doc that quietly disagrees.

The data set is one doc-alignment run over this checkout at `79519553b62e41c7a018f4e3fde04f1d2f7f30ff`, with the topic `design/records.md` section 2.2 fixes. The scope is 121 docs in 4 lanes with 3 checks, which is the measured scope in section 2.3 of that file.

---

## 1. THE FILES

| File | Written by | Which run | What it shows |
|------|------------|-----------|---------------|
| `topic-system-skilled-bots.json` | hand, from the shape `overlay-layout` sets | not a run | The topic entry with every field, ready to paste under `topics.<name>` |
| `findings.json` | `aggregate-findings.cjs` | the first run | Six findings, one per shape: a lane judgment finding, a battery finding, a literal finding, a handed-off finding and a rebutted finding |
| `dispositions.json` | the fix pass | the first run | Two entries, one `handed_off` and one `rebutted` |
| `report-first.md` | `aggregate-findings.cjs` | the first run | A report with findings, reading `- Open findings: 4 (1 handed off, 1 rebutted)` |
| `fix-plan.md` | `aggregate-findings.cjs` | the first run | Six checkbox lines, two of them `[x]` because the finding is settled |
| `report-clean.md` | `aggregate-findings.cjs` | the last run | A clean report, reading `- Open findings: 0 (0 handed off, 0 rebutted)` |
| `recheck.md` | `recheck.cjs` | the recheck of the first run | Five buckets with `still_open` and `new` both `0` |
| `rebuttals.md` | the fix pass | the first run | Two headings, one per settled finding, each with the five fields `design/records.md` section 11 fixes |

`report-first.md` and `report-clean.md` are two runs and not one. The first is the report the fix pass works from. The second is the report the clean criterion reads, and it is the file the phase copies into `evidence/doc-alignment/report.md`.

---

## 2. THE SIX FINDINGS

The six cover every shape a finding takes, so a reader can see what each field holds in each case.

| Id | Lane | Severity | Fix class | File | State after the fix pass |
|----|------|----------|-----------|------|--------------------------|
| `A-1` | A | P1 | judgment | `SKILL.md:41` | Fixed by hand, so the recheck puts it in `needs_review` |
| `A-4` | A | P2 | judgment | `ROUTER.md:8` | Fixed by hand, so the recheck puts it in `needs_review` |
| `B-2` | B | P1 | judgment | `bots-run/references/run-queue-and-answer.md:34` | `handed_off`, because the code root is wrong |
| `C-3` | C | P2 | judgment | `README.md:12` | `rebutted`, because the sentence is about a different artifact |
| `C-5` | C | P2 | literal | `README.md:11` | Fixed, so the recheck puts it in `resolved` |
| `BAT-01` | battery | P1 | judgment | none | Fixed, so the recheck puts the row in `resolved` |

`BAT-01` is the battery finding and it is the one with no file. Its `source_id` is the row id `D2-feature-catalog`, which is what a critic override names when it wants to reach the row rather than the finding.

`C-5` is the only literal finding, and it is the one that shows why a literal finding is worth having: the recheck can test it without a person. Its old text is absent from the file and its new text is present, so the recheck reads `new text present and old text absent` and puts it in `resolved`.

---

## 3. THE CHECKS THAT READ THEM

Each check runs from the phase folder with no tty and prints what the line below says.

```text
$ node -e "const f=require('./design/fixtures/findings.json');console.log(Array.isArray(f), f.length)"
true 6
```

```text
$ rg -c '^- Open findings: 0 \(0 handed off, 0 rebutted\)$' design/fixtures/report-clean.md
1
```

```text
$ rg -c '^- Open findings: 4 \(1 handed off, 1 rebutted\)$' design/fixtures/report-first.md
1
```

```text
$ rg -n '^\| (still_open|new) \| 0 \|' design/fixtures/recheck.md
6:| still_open | 0 |
7:| new | 0 |
```

```text
$ node -e "const d=require('./design/fixtures/dispositions.json');console.log(d.map(x=>x.status).sort().join(' '))"
handed_off rebutted
```

```text
$ node -e "const t=require('./design/fixtures/topic-system-skilled-bots.json');console.log(t.codeRoots.length, t.checks.length, t.terms.length)"
3 3 4
```

```text
$ node -e "const fs=require('fs');const h=[...fs.readFileSync('design/fixtures/rebuttals.md','utf8').matchAll(/^## (\S+)/gm)].map(m=>m[1]);const ids=new Set(require('./design/fixtures/findings.json').map(f=>f.id));console.log(h.length, h.filter(id=>!ids.has(id)).length)"
2 0
```

The last check is the one the phase's own completion criterion uses against `scratch/rebuttals.md`: every heading names an id a run's `findings.json` carries, so a declined finding cannot name a finding that does not exist.

The `report-clean.md` check is the one that matters most, because it is the same pattern the acceptance criterion uses against `evidence/*/report.md`. A pattern anchored on the end of the line would print `0` here, which is why the criterion matches the prefix and not the whole line.

---

## 4. WHAT A BUILDER DOES WITH THEM

- **A shape change.** Edit `design/records.md` first, then regenerate the golden with the script, then the phase documents. The order is the one `contracts/README.md` sets for the packet's own contracts. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/README.md:19]
- **A new field.** Add it to the field table, add it to the golden, and add a check above that reads it. A field with no check is a field nobody will notice going missing.
- **A new bucket or a new disposition.** The golden is the place to show it, because the two scripts that write these files are shared by both commands and a change to one reaches both.

The fixtures are not copied into the run folders. They are the shape a run's own files are compared against, and the run's files stay the record of what the run found.
