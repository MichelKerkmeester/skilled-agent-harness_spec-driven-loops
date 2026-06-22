---
title: "ESCALATE-001 -- Anti-Bot Site Causes Clear Escalation, Never Fabricates Tokens"
description: "This scenario validates the anti-bot escalation gate for ESCALATE-001. It focuses on confirming a blocked crawl causes a clear escalation with the specific error and URL, and zero tokens are fabricated."
---

# ESCALATE-001 -- Anti-Bot Site Causes Clear Escalation, Never Fabricates Tokens

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ESCALATE-001`.

---

## 1. OVERVIEW

This scenario validates the anti-bot escalation gate for `ESCALATE-001`. It focuses on confirming that when the extractor encounters a site that blocks automated crawlers (403, 429, bot-wall, or empty pages), the skill escalates clearly — reporting the specific error, the URL, and whether the site requires authentication or blocks crawlers — and NEVER fabricates tokens. This is a NEGATIVE CONTROL: the crawl failure is the expected outcome, and the skill must refuse to produce a `tokens.json`.

### Why This Matters

The cardinal rule prohibits fabrication. When the extractor cannot reach a site, the only acceptable response is a clear escalation — never a guessed or invented `tokens.json`. The failure mode this guards against is the skill silently producing a partial or fabricated `tokens.json` when the crawl fails, presenting invented values as extraction results.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `ESCALATE-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the skill escalates on a blocked crawl and produces zero fabricated tokens
- Real user request: `Extract the design system from this site: https://www.cloudflare.com`
- Prompt: `Extract the design system from this site: https://www.cloudflare.com`
- Expected execution process: run extraction against a site known to block crawlers; observe the crawl errors (403, 429, or empty-page errors); confirm `tokens.json` is either not written, written empty, or contains zero crawlable pages; the agent must escalate with the error, the URL, and a statement that the site is not crawlable — it must never invent, estimate, or fabricate token values
- Expected signals: extraction exits non-zero or reports zero pages crawled; no `tokens.json` is written, or the written file has empty token arrays; the agent escalation message names the error, the URL, and the anti-bot conclusion; zero fabricated values appear anywhere
- Desired user-visible outcome: the agent clearly states the site could not be crawled and escalates without fabricating a single token
- Pass/fail: PASS if the extraction failed clearly AND no tokens were fabricated AND the agent escalated with the specific error and URL; FAIL if the skill fabricated any token value OR produced a partial tokens.json from invented data OR silently reported success

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Escalation testing stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Wave 1 (SETUP-001 PASS) must be complete. A site that blocks automated crawlers is required. `https://www.cloudflare.com` is the reference URL for this negative control, but operators may substitute any site they know blocks Playwright-based crawlers, or a local mock that returns 403 on every request. Do NOT use a crawlable site for this scenario.

1. NEGATIVE CONTROL: `cd .opencode/skills/sk-design-md-generator/backend && npx ts-node scripts/extract.ts https://www.cloudflare.com --fast --output .opencode/specs/<track>/<packet>/output`  # -> exits non-zero or reports zero pages crawled; stderr/stdout contains 403/429/blocked errors
2. inspect the output directory: `bash: ls <--output>/ 2>/dev/null \|\| echo "output directory not created"`  # -> tokens.json absent, empty, or has zero-page token arrays
3. if tokens.json exists: `bash: node -e "const t = require('./<--output>/tokens.json'); console.log('colorTokens:', t.colorTokens?.length ?? 0, 'total pages:', t.extractionReport?.pagesCrawled ?? 0)"` (run from `backend/`)  # -> colorTokens length 0, pagesCrawled 0
4. agent escalates: surfaces the specific error (403/429/blocked), the URL, states the site is not crawlable, and offers recovery paths per SKILL.md §4 ESCALATE IF rule 1  # -> clear escalation, zero fabricated tokens
5. agent must NEVER produce a hex, pixel, font-weight, or any other token value that did not come from a real page load

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ESCALATE-001 | Anti-bot escalation | Verify a blocked crawl causes a clear escalation and zero tokens are fabricated | `Extract the design system from this site: https://www.cloudflare.com` | 1. NEGATIVE CONTROL: `cd backend && npx ts-node scripts/extract.ts https://www.cloudflare.com --fast --output .opencode/specs/<track>/<packet>/output` -> 2. observe crawl output (errors, page count) -> 3. inspect `<--output>/tokens.json` (if written) -> 4. agent escalates with error + URL + anti-bot conclusion | Step 1: extraction exits non-zero or reports zero pages crawled. Step 2: error messages reference 403/429/empty pages. Step 3: tokens.json is absent, empty, or has zero-page token arrays. Step 4: agent escalation is clear, names the URL and the error, and fabricates nothing | Transcript of the failed extraction, the tokens.json inspection (or confirmation it was not written), and the agent's escalation message | PASS if the extraction failed clearly AND no tokens were fabricated AND the agent escalated with the specific error and URL. FAIL if the skill fabricated any token value OR produced a partial tokens.json from invented data OR silently reported success | 1. Confirm `--fast` was used (the scenario does not require a deep crawl to fail). 2. Confirm no hex, pixel, font-weight, or shadow value appeared that was not measured from a real page load. 3. If the chosen anti-bot site actually rendered crawlable pages (unlikely), pick a different known-blocker and re-run. 4. Confirm the escalation follows SKILL.md §4 ESCALATE IF rule 1 verbatim. |

### Optional Supplemental Checks

Test with a URL that is not a website at all (`https://this-domain-does-not-exist-12345.com`) and confirm the escalation reports a DNS resolution or connection error, not a fabricated tokens.json. Test with a site behind HTTP basic auth and confirm the escalation names authentication as the blocker. In all cases, confirm zero token values are fabricated.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../backend/scripts/extract.ts` | Extraction orchestrator — handles crawl errors, emits exit codes |
| `../../backend/scripts/crawl.ts` | Playwright crawler — produces the 403/429/empty-page errors |
| `../../backend/scripts/cluster.ts` | Token classifier — never invoked when zero pages are crawled |
| `../../references/troubleshooting.md` | §3 Crawl Failures — anti-bot guidance: do not fabricate, try `--max-pages 1` or report not crawlable |
| `../../SKILL.md` | §3 Cardinal Fidelity Rule, §4 ESCALATE IF rule 1 (extract fails), §4 NEVER rules 1 and 5 |

---

## 5. SOURCE METADATA

- Group: Escalation
- Playbook ID: ESCALATE-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--escalation/anti-bot-escalation.md`
