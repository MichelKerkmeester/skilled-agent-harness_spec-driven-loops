TASK: restore one lost technique and fix one security wording defect (workstream WS-3 in facts.md). Make exactly the edits below and nothing else.
READ FIRST: specs/sk-design/021-deprecate-fundamentals/004-review-remediation/scratch/facts.md, the WS-3 block, and each file before you edit it.

EDITS:
1. `.skilled/skills/sk-code/sk-code-frontend/references/web-visual-values.md`, item `### V20. Five shadow elevations`. Do NOT add a new item and do NOT renumber anything. Extend its Pitfall bullet with this second sentence: "Transitioning `box-shadow` directly repaints on every frame, so put the target shadow on a pseudo-element and animate its `opacity` instead." Directly after the Pitfall bullet, add this code block:
```css
.card { position: relative; box-shadow: var(--shadow-1); }
.card::after {
  content: ''; position: absolute; inset: 0; border-radius: inherit;
  box-shadow: var(--shadow-3); opacity: 0; transition: opacity 180ms ease;
  pointer-events: none;
}
.card:hover::after { opacity: 1; }
```
   Then extend its See also bullet with: "The 180ms transition sits in the state-change band in [web-motion-and-interaction.md](web-motion-and-interaction.md#10-the-enforceable-motion-ruleset)." Check that anchor exists in that file and use the real one.
2. `.skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md`, item `### M33. Server-side authentication redirect`, the When not to bullet. Replace it with: "- **When not to:** Redirect on the client when the session expires while the page is already open. That redirect is UX only. The server still refuses every data request from the expired session, and the client clears any protected data it cached."

ALLOWED WRITE PATHS: the two files above.
BANNED OPERATIONS: any git command that changes state, deleting files, editing any other file.
STYLE: plain declarative sentences. No em dash, no semicolon.

VERIFY BEFORE YOU FINISH and paste the output:
  python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/web-visual-values.md
  python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md
  grep -c '^### V' .skilled/skills/sk-code/sk-code-frontend/references/web-visual-values.md
