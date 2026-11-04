VERDICT: FIX

- [P2] .skilled/skills/sk-prompt/references/improvement-checklist.md:28 | 4 | The new “When to Use” subsection contains process guidance, not a trigger for using this reference. | Replace the subsection with:

  ```markdown
  ### When to Use

  Use this reference when choosing an effort level, applying the checklist, or preparing a prompt for delivery.

  ### Core Principle

  There are no rounds and no phases. The checklist is not a gate that repeats until clean. It is a single reading that decides what the prompt is missing before the prompt is written.
  ```

- [P2] .skilled/skills/sk-prompt/references/improvement-checklist.md:26 | 5 | The overview says prompts are checked against ten rows before the effort rules define Quick as four rows and None as zero. The scope summary still conflicts with those rules. | Replace the Purpose paragraph with the text below, then move the second paragraph to immediately after Section 2:

  ```markdown
  sk-prompt improves a prompt in one pass. It checks the prompt once against the rows selected by the effort level, writes from one component skeleton when an improvement is needed, checks the result against its stated success criteria, and delivers.

  When a checklist pass runs, it uses the same ten-row list in the same order. The selected effort determines how many rows it checks. That shared list makes checklist runs comparable.
  ```