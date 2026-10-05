---
title: "Adoption ledger: Rule delivery debugging"
description: "Gate 6 as committed to AGENTS.md, the two sentences cut to keep Devin's prefix, and the guard change."
trigger_phrases:
  - "gate 6 adoption ledger"
importance_tier: "normal"
contextType: "implementation"
---
# Adoption ledger: Rule delivery debugging

## 1. CHANGE

`AGENTS.md` carries the Gate 6 arm from `experiment/arms.json` verbatim: the GATE 6 block before CONSOLIDATED QUESTION PROTOCOL, and "- Reply rules load under Gate 6 in §2." in place of the §4 reply-rule bullet. The file went from 26,778 to 26,811 bytes.

As tested, the arm adds 149 bytes and pushes the end of "Blast-Radius Management" to byte 16,494, past Devin's 16,384-byte cut. `check-rule-copies.js` blocked it there, which no 009 run showed because Devin was not an executor. Two sentences were cut to make room, and the section now ends at byte 16,359.

## 2. DROPPED SENTENCES

- §1 intro: "It keys on the action you are about to take, not on the section you are reading." (restatement, Gate 5 step 2 says "the action, never the topic")
- PLAN-WORKFLOW LOCK step 4: "The difference from step 2 is whether you can comply." (rationale, the two steps already state their own conditions)

## 3. POINTERS AND GUARD

- §8 now reads "The reply-time rule loads are Gate 6 in §2, and the two clauses that bind regardless of what loads are in §4, under Reply Rules and Mandates".
- `check-rule-copies.js` drops the line anchor "These five fire on a reply rather than on a write", which the arm removes, and adds a section anchor for `#### GATE 6:`. It reports 21 anchors inside the prefix, and `check-rule-copies.test.sh` passes.

## 4. TIMING

The parent goal's D2 ordered this change last, after 7-day windows for 006, 007 and 008. The operator ended further test rounds on 2026-10-05 and approved applying the recommendations, so Gate 6 landed the same day as the 007 wording and the 010 phrases. The cards stay out (`008-gate5-card-pilot/decision-record.md` ADR-003).
