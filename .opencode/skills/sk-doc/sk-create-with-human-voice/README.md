---
title: "create-with-human-voice"
description: "Applies the Human Voice Rules to prose and proves it landed: a scope gate, a scanner that reads the standard at run time, a judgment pass no scanner can do, and a re-scan after the rewrite."
trigger_phrases:
  - "create with human voice"
  - "human voice mode"
  - "what does create-with-human-voice do"
  - "how do i apply hvr"
  - "why did the scanner flag that"
  - "voice pass workflow"
importance_tier: normal
contextType: general
version: 1.1.0.1
---

# create-with-human-voice

> Turn a draft that reads like a machine wrote it into one that does not, and show the numbers that prove the pass happened.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Applying the Human Voice Rules to prose, or scoring prose against them |
| **Invoke with** | `/create:with-human-voice`, "make this sound human" or a direct read of `SKILL.md` |
| **Works on** | A file, a passage, a reply, or a draft you are part way through |
| **Produces** | An edited target plus a before and after report, or a report alone |
| **Owns** | The standard at `references/hvr-rules.md`, and the workflow that applies it |
| **Does not own** | The document-level audit. Structure, the Document Quality Index and the validators belong to `sk-create-quality-control` |

---

## 2. OVERVIEW

### Why This Mode Exists

The Human Voice Rules have been in this repository for a long time, and hundreds of files
point at them. What was missing was anything that ran them.

The standard describes what to aim for. Every consumer was left to eyeball 120 banned
terms, 7 punctuation rules and a dozen structural patterns by reading, which is exactly
the task attention is worst at. The nearest thing to enforcement was one step inside the
document-quality audit that said "flag only issues that matter" and named no method.

So this mode is the method. It answers what may be touched, what a machine can settle,
what a reader has to settle, how the arithmetic works, and what proof the pass produces.

### What It Does Not Do

It does not restate the standard. Every rule, term and penalty stays in the one file at
`references/hvr-rules.md`, which the scanner reads at run time. No document in this packet
carries a second copy, and no consumer elsewhere does either. The one thing worse than an
unenforced standard is two versions of it disagreeing.

It also does not own the document-level audit. Structure, the Document Quality Index and
the validators belong to `sk-create-quality-control`. That mode audits a file end to end
and calls this one for the voice finding it reports.

---

## 3. QUICK START

**Step 1: Scan before you read.**

```bash
python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <file>
```

You get the hard blockers, the soft deductions, a count per term and a mechanical ceiling.
It takes under a second and settles the part of the standard a reader is worst at.

**Step 2: Decide what the scanner may not touch.** Quotations, code, generated files and
released changelog entries are out. `references/scope-and-exemptions.md` has the classes,
and getting this wrong is how a voice pass breaks a working code sample.

**Step 3: Read for what the scanner cannot see.** Three-item lists, triple headers, setup
language, synonym cycling, fragmented headers, hedging. The scanner prints this list on
every run so a clean mechanical result is never mistaken for a clean document.

**Step 4: After editing, scan again and report both numbers.** A rewrite that only reports
its final score has proved nothing.

---

## 4. HOW IT WORKS

The scanner parses its term lists out of the standard on every run. Section 6 gives the
hard blocker words, section 7 the phrase blockers, section 8 the soft deductions and
section 3 the punctuation bans. Nothing is hardcoded, so editing the standard changes the
scan on the next invocation with no second file to update.

It masks what the standard does not govern before it looks: frontmatter, fenced blocks and
inline code spans, with the spans replaced by spaces so line and column numbers stay true.
`--include-code` turns that off when you actually want to scan a sample.

Findings are collapsed under the standard's own precedence rule. One occurrence costs one
penalty, the longest matching term wins, and a word listed as both an extended blocker and
context-dependent is charged once rather than twice.

### Key Concept: It Over-Reports On Purpose

Scanning `sk-create-repo-rule/README.md`, a document written to this standard and reviewed
before it shipped, finds two hard blockers. Both are the word `harness`, used as a noun
meaning the AI runtime. That is the literal sense the standard permits, so the right
outcome is two recorded exemptions and no edit at all.

A scanner that tried to tell those apart would need to read for meaning, and one that
guessed would start hiding real findings. Over-reporting costs a reader a second per
candidate. Under-reporting ships the tell.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Mode

Reach for it when a draft reads as machine-written, when a document is about to ship and
wants a voice pass, when someone asks how prose scores without wanting edits, or when you
are about to write documentation and want the standard in force from the first sentence.

Skip it when the target needs a structural audit rather than a voice pass, when the
artifact does not exist yet, or when the text is something you are carrying rather than
writing.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-create-quality-control` | Owns the file-level audit: structure, DQI and validators. Calls this mode for its voice step |
| `sk-create-readme` | Owns README and install-guide structure. This mode passes over the prose those templates produce |
| `sk-communication` | Consumes this mode for voice guidance rather than carrying its own copy |
| `sk-create-repo-rule` | Owns repo-local rules. A rule about writing style would route here instead |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| A hard blocker on a word used literally | The scanner matches spelling, not sense. `harness` the noun, `landscape` in photography, `journey` when someone travelled | Record an exemption. Do not edit the sentence |
| Dozens of `do`, `get`, `make`, `take` findings | The standard's vague-verb list is real and very common | Fix the ones where a specific verb is clearly better. Density matters here, not the raw count |
| A negative score on a long reference | The 100-point scale assumes a piece, not a 900-line document | Report hard blockers and deductions per hundred lines, and say that is what you did |
| `exit 2` and a "parsed too thin" message | The standard's section headings changed and the parser no longer finds a list | Fix the parser. The scanner refuses to report a clean scan it never performed |
| A finding inside a code block | `--include-code` was passed, or the fence is malformed | Drop the flag, or repair the fence |
| Findings on `hvr-rules.md` itself | It lists every banned term, so it fails against itself | Do not score documents about the standard |

---

## 7. FAQ

**Q: Why does the standard sit in this packet rather than the hub's shared tier?**

A: Shared means every mode may reach it. Exactly one mode applies it, and one more reaches
it through a declared alias, so the shared placement bought a hop and no reuse. The move
repointed the live consumers, including the scanner, the hub router and the spec-kit
templates. Frozen spec documents and released changelog entries kept the old path, because
they record what was true when they were written.

**Q: Does a clean scan mean the document passes?**

A: No, and the scanner says so on every run. It covers the punctuation bans and the term
lists. Structure, rhythm, synonym cycling, significance inflation and whether the writing
has any personality all need a reader.

**Q: What happens when the standard and accuracy disagree?**

A: Accuracy wins and the exception gets recorded. A document that reads beautifully and
says something false has failed at the only thing that mattered.

**Q: Why does the scan run before the reading?**

A: Because it is cheap and complete over its own subset. A reader who starts with rhythm
spends their attention there while a hard blocker sits unfixed on line 8.

**Q: Can I scan something that is not markdown?**

A: Yes. Pass a path or pipe the text in on stdin. Frontmatter and fence masking simply
find nothing to mask.

---

## 8. VERIFICATION

| Check | How to run it | What a pass looks like |
|---|---|---|
| Dirty fixture | `python3 scripts/hvr_scan.py scripts/tests/fixtures/voice-dirty.md` | 6 hard blockers, exit 1, and nothing reported from the fenced block or the inline code span |
| Clean fixture | `python3 scripts/hvr_scan.py scripts/tests/fixtures/voice-clean.md` | `no mechanical findings`, exit 0 |
| Fails closed on a moved standard | `sed 's/^## 6\. HARD BLOCKER WORDS.*/## 6. RENAMED/' references/hvr-rules.md > /tmp/broken.md && python3 scripts/hvr_scan.py scripts/tests/fixtures/voice-dirty.md --rules /tmp/broken.md` | `parsed too thin`, exit 2 |
| Survives renumbering | `sed 's/^## 6\. HARD BLOCKER/## 99. HARD BLOCKER/' references/hvr-rules.md > /tmp/renum.md && python3 scripts/hvr_scan.py scripts/tests/fixtures/voice-dirty.md --rules /tmp/renum.md` | 6 hard blockers, same as the real standard |
| Packet contract | `python3 ../sk-create-skill/scripts/package_skill.py . --check --strict` | `Result: PASS` |

Paths are relative to this packet directory.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the apply and score orderings, the always and never rules |
| [`references/scope-and-exemptions.md`](./references/scope-and-exemptions.md) | Which spans the standard governs, and the classes that are never in scope |
| [`references/scoring-and-verification.md`](./references/scoring-and-verification.md) | Pass order, precedence arithmetic, the bands, and the re-scan |
| [`assets/voice-report-template.md`](./assets/voice-report-template.md) | The fixed shape of a voice-pass result |
| [`scripts/hvr_scan.py`](./scripts/hvr_scan.py) | The mechanical pass |
| [`references/hvr-rules.md`](references/hvr-rules.md) | The standard itself, owned here and parsed at run time by the scanner |
