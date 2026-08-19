---
description: Rewrite the active AI's most recent reply into plain English in-context without changing files.
argument-hint: "[--show-original]"
---

# Rewrite Response

Rewrite the immediately preceding assistant response into plain English directly in-context.

---

## 1. PURPOSE

The `/rewrite-response` command instructs the active AI to rewrite its own most recent assistant response into clear, accessible plain English.

- Operates entirely in-context using the executing model's reasoning capacity.
- Uses no local or external LLM providers, CLI dispatches, or background services.
- Acts as a display-only projection that leaves canonical transcript history and project files unchanged.
- Preserves core meaning, technical accuracy, and protected tokens byte-for-byte.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` — Optional flag `[--show-original]`.

**Outputs:** Formatted plain-English projection followed by structured status.

| Output Status | Condition |
| ------------- | --------- |
| `STATUS=OK` | Successfully generated plain-English projection |
| `STATUS=NOOP REASON="no prior assistant message"` | No previous assistant turn exists in conversation |
| `STATUS=FAIL ERROR="<message>"` | Invalid arguments or unrecoverable error |

---

## 3. INSTRUCTIONS

Execute the following steps in order:

### Step 1: Parse Arguments

- Inspect `$ARGUMENTS` for execution flags.
- If `$ARGUMENTS` contains `--show-original`, set display mode to dual output.
- If `$ARGUMENTS` is empty or contains whitespace only, set display mode to rewrite-only (default).
- If `$ARGUMENTS` contains unknown arguments, report an error and return `STATUS=FAIL ERROR="unknown flag"`.

### Step 2: Locate Target Assistant Message

- Identify the immediately preceding assistant message in the active session.
- If no previous assistant message exists:
  - Emit notice: `No prior assistant message found to rewrite.`
  - Return `STATUS=NOOP REASON="no prior assistant message"`.
  - Terminate execution.

### Step 3: Identify Protected Spans

- Scan the target message for literal technical tokens that must remain byte-for-byte unchanged:
  - Fenced code blocks (triple backticks)
  - Inline code expressions (single backticks)
  - File paths, directory paths, and file extensions
  - Terminal commands, scripts, and command-line flags
  - URLs, URIs, endpoints, and protocol strings
  - Exact numbers, dates, timestamps, and metric values
  - Identifiers (variable names, function names, classes, parameter names)
  - Literal string quotes and configuration keys

### Step 4: Apply In-Context Plain-English Rubric

- Transform the target assistant message according to the self-contained rubric:
  - **Assistant-only scope**: Rewrite only the text of the most recent assistant message. Do not rewrite user prompts or historical turns.
  - **One idea per sentence**: Break compound or convoluted sentences into single, clear thoughts.
  - **Plain vocabulary**: Replace dense jargon, passive constructions, and bureaucratic phrasing with direct, natural language.
  - **Cut filler and hedging**: Remove throat-clearing preambles, excessive disclaimers, and unnecessary conversational padding.
  - **Preserve exact meaning**: Retain every factual statement, logical relationship, instruction, and conclusion without distortion.
  - **Calm, low-embellishment tone**: Use a neutral, objective, and clear presentation.
  - **Exact span fidelity**: Re-insert every protected span identified in Step 3 exactly as originally written.

### Step 5: Render Projection and Return Status

- If display mode is dual output (`--show-original`):
  - Render header `### Original Response` followed by the original assistant message.
  - Render header `### Plain-English Rewrite` followed by the rewritten message.
- If display mode is rewrite-only (default):
  - Render prefix `> **Plain-English Rewrite:**` followed by the rewritten message.
- Output the structured status line:
  - Success: `STATUS=OK`
  - Failure: `STATUS=FAIL ERROR="<message>"`

---

## 4. EXAMPLES

### Example 1: Default Invocation (Rewrite Only)

```text
/rewrite-response
```

Output:

```text
> **Plain-English Rewrite:**
I updated the configuration in `config.json` and verified all 12 test cases. Everything passed.

STATUS=OK
```

### Example 2: Show Original and Rewrite

```text
/rewrite-response --show-original
```

Output:

```text
### Original Response
I have systematically completed the modification of the parameters located within `config.json` and subsequently initiated execution of the test suite, where all 12 test scenarios completed with zero errors.

### Plain-English Rewrite
I updated the parameters in `config.json` and ran the test suite. All 12 tests passed without errors.

STATUS=OK
```

### Example 3: No Prior Message Found

```text
/rewrite-response
```

Output:

```text
No prior assistant message found to rewrite.

STATUS=NOOP REASON="no prior assistant message"
```

---

## 5. NOTES

- **In-Context Execution:** Execution is performed entirely by the active AI model within the existing conversation context. No external APIs or local model processes are invoked.
- **Display-Only Projection:** This command does not write files to disk or modify canonical transcript records. It only presents a rewritten projection in the immediate turn output.
- **Scope Restriction:** Scope is strictly confined to the single most recent assistant message.
- **Protected Span Integrity:** All code blocks, identifiers, commands, paths, and numerical values must match the original message byte-for-byte.
