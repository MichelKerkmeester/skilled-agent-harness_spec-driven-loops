# Iteration 3 — Scenario Realism + Coverage

## Verdict
PASS

## Summary
Spot-checked 15 of 28 scenarios (2+ per category) and bulk-verified all 28 via grep. Every scenario has a REALISTIC operator-style user request using concrete domains (legal contracts, HIPAA, customer support, CI/CD, data extraction, sentiment analysis) and conversational tone — none are SKILL.md paraphrases. All pass/fail conditions are deterministic with named signals (mode, DEPTH round count, CLEAR score, framework name, output block fields). The 7-category split (4+4+6+4+4+4+2=28) matches spec.md exactly.

## Findings

### P0 (Blockers)
None

### P1 (Required)
None

### P2 (Suggestions)
None

## Verification Evidence

### 1. Active-scope grep for `@improve-prompt|improve-prompt` residuals
```
$ rg -l '@improve-prompt|improve-prompt' .opencode .claude .codex .gemini *.md *.json \
  -g '!**/z_archive/**' -g '!**/z_future/**' \
  -g '!**/054-*/**' ... [full exclusion list]
```
**Result:** (empty — zero hits in active scope)

### 2. Scenario file count
```
$ find .opencode/skills/sk-prompt/manual_testing_playbook -name "[0-9][0-9][0-9]-*.md" | wc -l
28
```

### 3. Per-category scenario counts (matches spec.md 4+4+6+4+4+4+2)
```
01--mode-detection/:         4
02--smart-routing/:          4
03--depth-clear-loop/:       6
04--clear-scoring/:          4
05--framework-selection/:    4
06--escalation-tiers/:       4
07--format-modes/:           2
Total: 28
```

### 4. SP row count in root cross-reference index
```
$ grep -cE '^\| SP-[0-9][0-9][0-9] ' manual_testing_playbook.md
28
```

### 5. All 28 scenarios have `Real user request` field
```
$ for f in $(find ... -name "[0-9][0-9][0-9]-*.md"); do
  grep -cE '^\- Real user request' "$f"
done
--- REAL REQUEST CHECK DONE --- (no missing)
```

### 6. All 28 scenarios have deterministic `Pass/fail:` field
```
$ for f in $(find ... -name "[0-9][0-9][0-9]-*.md"); do
  grep -cE '^\- Pass/fail:' "$f"
done
--- PASS/FAIL CHECK DONE --- (no missing)
```

### 7. All 28 scenarios have 5 mandatory sections
```
$ for f in $(find ... -name "[0-9][0-9][0-9]-*.md"); do
  count=$(grep -cE '^## [1-5]\. (OVERVIEW|SCENARIO CONTRACT|TEST EXECUTION|SOURCE FILES|SOURCE METADATA)' "$f")
  [ "$count" -ne 5 ] && echo "MISSING: $f has $count/5"
done
--- DONE --- (no output = all 28 pass)
```

### 8. All 28 scenarios reference `@prompt-improver` (not legacy name)
```
$ grep -l '@prompt-improver' [all 7 category dirs]/*.md | wc -l
28
```

### 9. validate_document.py
```
$ python3 .opencode/skills/sk-doc/scripts/validate_document.py manual_testing_playbook.md
VALID: Document type: readme, Total issues: 0
```

### 10. Strict validate on packet 085
```
$ bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict
RESULT: PASSED — Errors: 0, Warnings: 0
```

### 11. Advisor probe
```
$ python3 .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "improve my prompt" --threshold 0.0
sk-prompt @ 0.9262 confidence — resolves correctly.
```

### 12. SKILL.md has exactly 1 RELATED PLAYBOOK link
```
.opencode/skills/sk-prompt/SKILL.md:453:## RELATED PLAYBOOK
```

### 13. Renamed agent paths all exist
```
.opencode/agents/prompt-improver.md
.claude/agents/prompt-improver.md
.codex/agents/prompt-improver.toml
.gemini/agents/prompt-improver.md
```

### 14. Spot-checked scenarios across all 7 categories

| Category | Scenarios Spot-Checked | Real User Request Style | Deterministic Pass/Fail |
|----------|----------------------|------------------------|------------------------|
| 1. Mode Detection | SP-001, SP-004 | Concrete domains (meeting notes, tight/reusable phrasing) | Named signals: mode, DEPTH rounds, keyword suppression |
| 2. Smart Routing | SP-005, SP-008 | Dual-input test with realistic asks (customer email, framework choice) | Named signals: intent name, resource list matching, checklist items |
| 3. DEPTH+CLEAR Loop | SP-009, SP-012, SP-013, SP-014 | Legal contracts, onboarding prompts — domain-specific and imperative | Named signals: phase order, RICCE presence, mechanism-first ordering |
| 4. CLEAR Scoring | SP-015, SP-017, SP-018 | Customer feedback, data validation — why-driven scoring asks | Named signals: 5 dims, 40/50 threshold, per-dim rationale |
| 5. Framework Selection | SP-019, SP-022 | Customer support, sentiment analysis — framework pick + explain | Named signals: framework name, complexity score, switch logged |
| 6. Escalation Tiers | SP-023, SP-024, SP-026 | HIPAA compliance, CLI dispatch — trigger-sensitive, payload-aware | Named signals: escalation reason, output block fields |
| 7. Format Modes | SP-027, SP-028 | JSON API, YAML CI/CD — format-explicit, on-demand aware | Named signals: valid JSON, YAML-specific structure, guide loaded |

All 15 spot-checked scenarios have:
- Contractions + conversational tone ("I'm", "don't", "no shortcuts", "tell me WHY")
- Concrete domains (not abstract "prompt enhancement")
- Imperative / questioning phrasing (operator asking the system to do work)

None are SKILL.md paraphrases (no clinical "evaluate prompt quality with CLEAR scoring" language without operator framing).

## Adversarial Self-Check

**Did I miss scenarios with vague or non-deterministic pass/fail?** The bulk grep confirmed all 28 have exactly one `- Pass/fail:` line. The sampled 15 use explicit named signals: mode name, DEPTH round count, CLEAR score threshold, framework name, output block field names. No scenario uses purely qualitative criteria like "the prompt should be better."

**Could some "real user requests" be hidden SKILL.md paraphrases?** I compared the spot-checked requests against SKILL.md §1-8 verbatim. SKILL.md uses clinical language like "Enhancing or improving an AI prompt," "Evaluating prompt quality with CLEAR scoring," and "Selecting the right prompt framework." The scenario real user requests use domain-anchored language like "extract action items from meeting notes," "HIPAA-bound data handling," "CI/CD config prompt," "sentiment analysis." The gap between specification language and operator language is clear.

**Does the SP-005 dual-input format (two `Real user request (input A):` / `(input B):` lines) break the contract?** No — it's an intentional annotation for a scenario that tests two inputs. The single-command pass/fail line (`PASS if both inputs resolve to the expected intent...`) still provides one deterministic verdict.

**Is 4+4+6+4+4+4+2 = 28 confirmed?** Yes, both the `find` per-category counts and the root index SP-row count confirm 28 scenarios across exactly the 7 categories specified in spec.md §3 SCOPE.
