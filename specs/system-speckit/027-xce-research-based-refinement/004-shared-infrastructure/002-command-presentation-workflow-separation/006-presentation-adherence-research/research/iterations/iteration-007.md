# Iteration 007 (deepseek-v4-pro, prose-extracted)

> The seat answered in prose instead of the findings JSON contract; key claims distilled below, full prose preserved.

## [P1][REFINEMENT] Template-as-example ambiguity: fenced text blocks read as illustrative, not mandatory
- Evidence: prose-extracted from deepseek seat 7; presentation contracts use ```text fences with no MUST language or post-generation check
- Detail: Models treat fenced templates as examples unless the surrounding text marks them as the required output shape; no router enforces the header/footer lines post-generation.
- Fix sketch: Mark render fences as mandatory output contracts (MUST emit exactly this shape) and add a self-check line instructing the model to verify header/STATUS footer before finishing.

---
## Full seat output

Now let me read the render contracts and remaining transcripts:

Let me check the /doctor memory transcript output and a few more details:

Now I have the complete picture. Let me compile the findings:

```json
{
  "angle": 7,
  "findings": [
    {
      "class": "DOC-DRIFT",
      "severity": "P1",
      "title": "memory:search ignores parseable retrieval template entirely",
      "evidence": "search_presentation.md:26-41 defines `MEMORY:SEARCH \"<query>\" intent=... STATUS=OK` but memory-search-dash.json:17 free-prose reply: 'Found the relevant memory...' with no parseable header, no score/id grouping, no STATUS= footer",
      "detail": "Of all 8 transcripts, /memory:search had the worst adherence: zero parseable elements survived. The model produced a natural-language summary with markdown formatting that conveyed the right content but dropped every header, separator, field label, and status footer from section 2 of the contract. The only surviving structure was a file path in backticks.",
      "fix_sketch": "Move parseable templates into a `## REQUIRED OUTPUT FORMAT` section with explicit `MUST render verbatim` directive and add a pre-render validation check that rejects output missing the `MEMORY:SEARCH` header."
    },
    {
      "class": "DOC-DRIFT",
      "severity": "P2",
      "title": "memory:manage stats uses free prose instead of MEMORY:STATS dashboard",
      "evidence": "manage_presentation.md:13-36 defines `MEMORY:STATS` compact table with STATUS=OK footers, but memory-stats-dash2.json:10 renders `**Memory Stats**` markdown with bold headers and bullet lists, and memory-stats-dash.json:13 uses similar free prose",
      "detail": "Both the healthy-DB run (dash2) and corrupted-DB run (dash) diverged from the contract template. Neither produced the `MEMORY:STATS` header, separator lines, or `STATUS=OK ACTION=stats` footer. The healthy run used bold markdown sub-headers and bullet points; the corrupted run used a narrative `FAIL` block instead of the error template at §9.",
      "fix_sketch": "Apply the same parseable-output enforcement strategy described for search: make the dashboard template a required output gate with a MUST directive."
    },
    {
      "class": "DOC-DRIFT",
      "severity": "P2",
      "title": "speckit:resume paraphrases RESUME BRIEF into custom markdown",
      "evidence": "speckit_resume_presentation.md:114-124 specifies `RESUME BRIEF` with exactly labeled fields (Now:, Last confirmed:, Next safe action:, etc.), but resume-dash.json:27 emits `**Resume Summary**` with different field names and a narrative 'Current state' bullet list",
      "detail": "Information completeness was good—all relevant facts (status, pending tasks, next action, blockers) appeared—but the parseable field structure was replaced with a conversational format. The `RESUME BRIEF` header became `**Resume Summary**`, and structured fields like `Now:` and `Progress: [X]%` became free-text sections.",
      "fix_sketch": "Add a `## OUTPUT ENFORCEMENT RULE` to each presentation contract that states exact header/footer tokens must appear in the final answer or the command is considered failed."
    },
    {
      "class": "DOC-DRIFT",
      "severity": "P2",
      "title": "/doctor memory diagnostic drops contract template fields",
      "evidence": "doctor_speckit_presentation.md:149-158 defines `DOCTOR DIAGNOSTIC RESULT` with Target:/Workflow:/Mutation class: fields, but doctor-memory-dash.json:41 renders `**/doctor memory Report**` without Target:, Workflow:, or Mutation class: lines",
      "detail": "The model correctly reported DEGRADED status, evidence, and recommendations, but used a custom markdown structure. Required fields Target:, Workflow:, and Mutation class: were omitted entirely, and the STATUS= footer line was dropped. The model did respect the read-only constraint by noting 'No mutations or repairs were applied'.",
      "fix_sketch": "Add post-generation validation in the command router that checks for the presence of required template tokens before considering output complete."
    },
    {
      "class": "DOC-DRIFT",
      "severity": "P2",
      "title": "STATUS= footer lines systematically omitted across all commands",
      "evidence": "Every presentation contract (§2 search, §2 manage, §2 resume, §5 doctor) terminates templates with `STATUS=OK|FAIL` footers, but zero of 8 transcripts emitted one. search: no STATUS= line, stats: no STATUS= line, resume: no STATUS= line, doctor-memory: no STATUS= line",
      "detail": "This is a universal failure pattern. The STATUS= footer serves as a machine-parseable completion signal for downstream dispatch, but gpt-5.5-medium treats it as internal template metadata rather than mandatory output. This breaks any downstream code that relies on parsing STATUS= tokens to determine command completion state.",
      "fix_sketch": "Add a hard rule to each command .md: `FINAL OUTPUT MUST end with a line matching STATUS=<value>` and add a lightweight post-generation grep-based validation in the command dispatch layer."
    },
    {
      "class": "REFINEMENT",
      "severity": "P1",
      "title": "Template-as-example ambiguity causes universal format drift",
      "evidence": "All presentation contracts present templates in ```text code blocks with field placeholders (<count>, <query>, etc.), but the command routers (search.md:17, manage.md:18, speckit.md:43-52) say only 'read the presentation asset and use it as the display source of truth' without a MUST directive or enforcement mechanism",
      "detail": "The root cause across all P1-P2 findings: models treat ```text code blocks as illustrative examples rather than mandatory output schemas. The contract language ('use as source of truth') is advisory, not imperative. Without a mechanical enforcement gate, mid-tier models default to conversational prose because that is their training distribution for user-facing output. The one exception—/doctor's menu rendered verbatim—works because numbered lists in code blocks happen to match natural model output for menus.",
      "fix_sketch": "Redesign presentation contracts to separate instructions ('YOU MUST:') from templates, add a lightweight output validator that runs at the command-layer after the model returns, and flag non-conforming output as a dispatch failure."
    },
    {
      "class": "REFINEMENT",
      "severity": "P3",
      "title": "Gate-3 question blocks survive dispatch reliably",
      "evidence": "speckit-plan-dash.json:2, create-skill-dash.json:2, and deep-review-dash.json:2 all render A/B/C/D/E spec-folder questions with correct option labels and structure, matching the AGENTS.md Gate-3 contract across three different command families",
      "detail": "Gate-3 adherence is the strongest render-contract success in the test set. All three commands that hit the gate produced structured questions with all five options and clear labeling. Minor wording variation exists but the option set (A-E) and conceptual structure are preserved. This likely works because Gate 3 is flagged as a [HARD] BLOCK in the system prompt, creating an imperative expectation that survives model dispatch.",
      "fix_sketch": "Apply the same HARD BLOCK enforcement pattern from Gate 3 to parseable render templates: tag them as REQUIRED in the command router frontmatter rather than advisory in the presentation asset."
    },
    {
      "class": "REFINEMENT",
      "severity": "P3",
      "title": "/doctor router menu survives with minor annotation drift",
      "evidence": "doctor_speckit_presentation.md:9-23 defines 11 menu items verbatim, doctor-router-dash.json:18 reproduces all 11 correctly but annotates option 7 with 'mutates routing metadata; needs spec-folder approval' not in the contract",
      "detail": "The model rendered the menu inside a ```text code block which preserved the exact numbering and descriptions. The only deviation was option 7 where the model appended its own mutation-class annotation learned from reading _routes.yaml. This is the closest adherence to a render contract in the entire test set, likely because code blocks in templates signal 'literal output' to the model.",
      "fix_sketch": "Use code-block-enclosed templates for all parseable output formats (not just menus) and add a warning that 'annotation outside the code block is forbidden' to prevent model-added commentary."
    }
  ],
  "summary": "Across 8 transcripts from 6 command families dispatched to gpt-5.5-medium, Gate-3 question blocks and /doctor router menus survived dispatch faithfully, but every parseable render template (MEMORY:SEARCH, MEMORY:STATS, RESUME BRIEF, DOCTOR DIAGNOSTIC RESULT) was paraphrased into free prose with zero STATUS= footer lines preserved. The root cause is template-as-example ambiguity: presentation contracts use ```text code blocks that models treat as illustrative rather than mandatory, and the command routers lack any post-generation enforcement mechanism."
}
```