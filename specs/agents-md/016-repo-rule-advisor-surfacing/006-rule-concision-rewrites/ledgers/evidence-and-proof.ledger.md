# Ledger: evidence-and-proof.md

Before 11,823 B, after 10,745 B: -1,078 B, -9.1%. Version 1.1.1.0 to 1.1.1.1.

The cut stops well short of the 20% aim because nearly all of the file is operative: 12 self-check items, the 4-item final-state gate, the tier table, the four receipt shapes and the four green-run lies. The starting draft (`002-rule-concision-and-loading/research/lineages/swe-2-max/drafts/evidence-and-proof.md`, 10,465 B) reached -11.5% only by dropping the subordination line (123 B) and the cause-standing failure line (132 B). Both are restored here. The draft also dropped "the cause-then-fix order holds", a norm backed by the trigger phrase "cause then fix", and that is restored too. Where the draft unwrapped paragraphs into single long lines, this version keeps the original wrapping so unchanged lines stay byte-identical.

| Part | Before B | After B | Action |
|---|---:|---:|---|
| Frontmatter | 892 | 892 | keep, version bumped in the fourth segment |
| Title + routed-from + subordination | 259 | 259 | keep verbatim (subordination line restored from the draft's loss) |
| Fires when | 364 | 364 | keep verbatim |
| The rule | 163 | 163 | keep verbatim |
| 1. THREE TIERS | 2,165 | 1,801 | cut rationale and restatement, restored the failure line and the cause-then-fix order |
| 2. COMMAND EVIDENCE | 775 | 742 | cut restatement |
| 3. THE FOUR WAYS A GREEN RUN LIES | 872 | 811 | cut rationale |
| 4. THE NEGATIVE CONTROL | 339 | 300 | cut restatement |
| 5. BASELINES | 494 | 494 | keep |
| 6. SHAPE-SPECIFIC PROOF | 647 | 529 | cut boilerplate and rationale |
| 7. A FINDING IS A HYPOTHESIS | 518 | 498 | shortened cross-reference wording, both links kept |
| 8. PROOF PLAN BEFORE IMPLEMENTATION | 415 | 415 | keep |
| 9. FINAL-STATE PROOF | 577 | 577 | keep, checklist verbatim |
| 10. CLOSE-OUT | 992 | 848 | cut rationale and boilerplate |
| 11. REASON FROM DATA, NOT FROM MEMORY | 1,201 | 902 | cut boilerplate, illustration and rationale |
| 12. SELF-CHECK | 1,150 | 1,150 | keep verbatim |
| **Total** | **11,823** | **10,745** | **-9.1%** |

## Dropped sentences

- §1: "That is how a confident summary certifies work nobody checked." (rationale)
- §1: "whatever you ran" (rationale, emphasis tail on "the receipt is not an observation of that claim")
- §1: "because verifying its parts is not deriving the whole" (rationale for "derive it here, at the total's own level")
- §1: "Against the tiers, a suspected cause is INFERRED, and the INFERRED tier already demands what would confirm it, so the clause adds a reporting shape and takes nothing from the proof." (rationale. The tier mapping survives as "Where no run confirms the cause, it is INFERRED".)
- §1: "a cause is either a finding with its receipt or suspected with its next check" (restatement. The norm still lives in the two sentences before "There is no unmarked case" in §1.)
- §1, shortened: "Where no run confirms the cause, label it as suspected and name the next check. A confirmed cause is reported as a finding." became "Where no run confirms the cause, it is INFERRED: label it as suspected and name the next check. A confirmed cause is reported as a finding with its receipt." (restatement, merging the dropped mapping sentence and the dropped tail into it)
- §2: "Not launched. Not assumed. Read." (restatement. The norm still lives in the bold §2 sentence "only after its output and exit status have been read".)
- §3: "and several files here use NUL as a composite-key separator" (rationale. The ban on trusting an empty grep and the `-a` repair are kept.)
- §4: "Then the same check proves the change." (restatement. The norm still lives in the bold §4 sentence "with the exact check you will use to prove the fix".)
- §6: "Three task shapes fail in ways the checks above do not catch:" (boilerplate, list intro)
- §6: "and a clean diff does not reveal an unprocessed input" (rationale)
- §7, shortened: "Confirming against the real symptom is" became "Confirming the symptom is", and "what a delegate hands back is" became "a delegate's return is" (restatement. "the real symptom" still lives in the first §7 sentence.)
- §10: "Four different states, routinely conflated." (rationale)
- §10: "the hedging habit devalues the honest report when it matters" (rationale for "stated plainly, without hedging")
- §10: "This section covers what happened." (boilerplate. The scope split still lives in "What is now the operator's to do is a separate report".)
- §11: "Everything above is about proving a claim after the fact. This is about where the claim came from." (boilerplate, section framing)
- §11: "You have read this pattern a hundred times, so you know what `resolveConfig` returns." (rationale, an illustration of the habit and not a scope list)
- §11: "These are cheap before the edit and expensive after it, the same asymmetry as §8's proof plan, one step earlier." (rationale. "Before the change" carries the timing norm.)
