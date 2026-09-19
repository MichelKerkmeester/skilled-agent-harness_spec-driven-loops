# Reply harness smoke

Date: 2026-09-14. Harness: .opencode/skills/sk-communication/benchmark/reply-harness/. The model step stayed with the operator, no script called a model.

## 1. Prompt generation, both conditions

Command: node generate-prompts.mjs --condition before --out <spec scratch>/smoke-prompts-before and the same with --condition after --out <spec scratch>/smoke-prompts. Both exited 0.

First line, the before side:

    generate-prompts: condition=before ruleSetSource=4512473abdec9c7f0ea02126f85bb5c709b2ac26 ruleSections=13 cases=7

First line, the after side:

    generate-prompts: condition=after ruleSetSource=working-tree ruleSections=14 cases=7

Seven prompt files per side plus a manifest.json. The before side assembles thirteen sections from the recorded commit. The after side reads fourteen from the working tree.

## 2. The manifests

Both carry the same fields and the same case ids C1 to C6 and NC1. The rule-file labels differ only where the working tree gained prose-mechanics.md, thirteen sections on the before side, fourteen on the after side. The before side's twelve whole-file hashes reproduce the measurement baseline's, eleven under repo-rules/ plus REPO RULES.md, exactly. The AGENTS.md entry hashes the extracted section-8 slice, not the whole file, so it differs from the baseline's whole-file hash by design. The working section-8 slice matches the recorded one, its hash is identical on both manifests.

## 3. Scoring, first pass, missing reply

Command: node score.mjs --condition after --replies <spec scratch>/smoke-replies --out <spec scratch>/smoke.json, run while only C1.md and NC1.md existed. It stopped as designed:

    score: missing reply file: <spec scratch>/smoke-replies/C2.md

Exit 1.

## 4. The malformed case set

With cases.json replaced by the one-element array [1] the same command exited 1:

    score: <harness>/cases.json misses case C1

The original file was restored afterwards and its head verified.

## 5. Scoring, full pass

Five short replies followed, C2 to C6, so the scoring run could finish. Same command, exit 0. First line:

    score: condition=after cases=7 replies=<spec scratch>/smoke-replies

Then:

    score: wrote <spec scratch>/smoke.json
    score: ruleRows=7 noOpRows=0 blockingRows=0

All seven keyed predicates passed, so no blocking class fired. The receipts dimension carried the only weight. C1 to C4 scored 1 there, C5, C6 and NC1 scored 0, so the weighted scores read 1, 1, 1, 1, 0.8, 0.8, 0.8. The scanner returned no findings on any reply, so mechanical tells stayed at 1.

## 6. The comparison exercise

Command: node compare.mjs --before <spec scratch>/smoke.json --after <spec scratch>/smoke.json. Both sides pointed at the same results file, so every printed delta read 0.0000 by construction and the control read 0.8 to 0.8, unchanged. This exercised the comparison, it did not measure a change. Exit 0.

## 7. One fix during the smoke

The first full scoring run exited 1. The six predicate mechanics returned true where the scorer demanded a number. The mechanics now return 1 or 0. The rerun passed. Recorded here because the smoke ran twice.
