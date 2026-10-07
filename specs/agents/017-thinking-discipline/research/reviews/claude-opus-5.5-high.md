# Review: Claude Opus 5.5, high effort (read-only subagent)

Verdict: ship with changes. No P0.

P1
1. The AGENTS.md "ask what backs it" clause conflicts with uncertainty-and-honesty.md §1 "Investigate before you ask". It risks demanding proof from an operator who is right. Fix: check whether they could be right first, and ask only if you cannot.
2. The AGENTS.md "Settled stays settled" reasons read as a closed list that contradicts the "Recheck your work when something changes" line above it. Fix: frame them as examples and add "a changed state".
3. Gate 3 option C "another change" lost the defined term "a different change" (phase-definitions.md §2, condition 3). That term is what sends a correction to Option A. Fix: restore "a different change".

P2
4. Name the second derivation (evidence-and-proof.md §6) as the settling check for a computed answer.
5. "their call on what is theirs" is vague. Replace it with "an instruction or decision they reaffirm stays theirs (§3); a factual conclusion moves only on a fact".
6. "switch only on a blocker" forbids moving to a clearly better approach. Use "a reason".
7. "a named error" overlaps "a fact that contradicts it". Drop it.
8. Grammar: "talked out of" becomes "talked away", and the bands "still run" becomes "still apply".
9. "Which to choose" dropped "must meet independently". Restore the meaning.
10. Record the thin prefix margin in the packet.

Trigger row: matches the Fires-when bullet. "change a checked answer after pushback or doubt" names the moment more recognizably (reviewer judgment).

UNKNOWN: whether Devin ever sees the AGENTS.md line, which sits past the prefix; and whether agents flip less in practice, since no behavioral test was run.
