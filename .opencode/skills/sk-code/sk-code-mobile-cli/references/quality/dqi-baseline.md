---
title: Pi Remote DQI Baseline
description: Last measured Document Quality Index for every doc and README in the app, with the min median and max per class and the files below the 70 bar.
trigger_phrases:
  - 'dqi baseline'
  - 'doc quality scores'
  - 'dqi below bar'
  - 'readme score table'
  - 'doc score table'
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Pi Remote DQI Baseline

The baseline records the last measured Document Quality Index for every markdown file that ships with Pi Remote. The scores come from the sk-doc structure extractor run with `python3 .opencode/skills/sk-doc/scripts/extract_structure.py <file>`. The sweep covered 43 files, 10 reference docs under docs/ and 33 README files across the app tree, on 2026-08-13. Build output under dist/ and node_modules were excluded from the sweep.

---

## 1. SUMMARY

| Metric                    | Value |
| ------------------------- | ----- |
| Files measured            | 43    |
| Docs under docs/          | 10    |
| README files              | 33    |
| Lowest score              | 65    |
| Median score              | 76    |
| Highest score             | 97    |
| Files below the bar of 70 | 4     |

Per class:

| Class            | Files | Min | Median | Max |
| ---------------- | ----- | --- | ------ | --- |
| Docs under docs/ | 10    | 88  | 94     | 97  |
| README files     | 33    | 65  | 75     | 91  |
| All files        | 43    | 65  | 76     | 97  |

---

## 2. DOC SCORES

Every reference doc under docs/ clears the bar of 70 and the class target of 90 except two docs at 88, which sit between the bar and the target.

| File                           | Type    | DQI | Band      |
| ------------------------------ | ------- | --- | --------- |
| ARCHITECTURE.md                | generic | 97  | excellent |
| docs/code-standards.md         | generic | 91  | excellent |
| docs/incident-playbooks.md     | generic | 88  | good      |
| docs/install-and-onboarding.md | generic | 97  | excellent |
| docs/operations.md             | generic | 94  | excellent |
| docs/platform-support.md       | generic | 91  | excellent |
| docs/release-verification.md   | generic | 96  | excellent |
| docs/rollback.md               | generic | 95  | excellent |
| docs/security.md               | generic | 88  | good      |
| docs/setup.md                  | generic | 94  | excellent |

---

## 3. README SCORES

| File                                          | Type   | DQI | Band       |
| --------------------------------------------- | ------ | --- | ---------- |
| README.md                                     | readme | 91  | excellent  |
| apps/pi-remote-relay/README.md                | readme | 79  | good       |
| apps/pi-remote-relay/migrations/README.md     | readme | 79  | good       |
| apps/pi-remote-relay/scripts/README.md        | readme | 70  | acceptable |
| apps/pi-remote-relay/src/README.md            | readme | 79  | good       |
| apps/pi-remote-relay/src/approval/README.md   | readme | 76  | good       |
| apps/pi-remote-relay/src/auth/README.md       | readme | 76  | good       |
| apps/pi-remote-relay/src/fixtures/README.md   | readme | 71  | acceptable |
| apps/pi-remote-relay/src/http/README.md       | readme | 77  | good       |
| apps/pi-remote-relay/src/policy/README.md     | readme | 75  | good       |
| apps/pi-remote-relay/src/prompt/README.md     | readme | 75  | good       |
| apps/pi-remote-relay/src/push/README.md       | readme | 70  | acceptable |
| apps/pi-remote-relay/src/release/README.md    | readme | 70  | acceptable |
| apps/pi-remote-relay/src/replay/README.md     | readme | 69  | acceptable |
| apps/pi-remote-relay/src/rpc/README.md        | readme | 74  | acceptable |
| apps/pi-remote-relay/src/sessions/README.md   | readme | 65  | acceptable |
| apps/pi-remote-relay/src/store/README.md      | readme | 75  | good       |
| apps/pi-remote-relay/tests/README.md          | readme | 73  | acceptable |
| apps/pi-remote-web/README.md                  | readme | 74  | acceptable |
| apps/pi-remote-web/public/README.md           | readme | 72  | acceptable |
| apps/pi-remote-web/src/README.md              | readme | 76  | good       |
| apps/pi-remote-web/tests/README.md            | readme | 66  | acceptable |
| deploy/README.md                              | readme | 79  | good       |
| deploy/containment/README.md                  | readme | 77  | good       |
| extensions/pi-remote-approval/README.md       | readme | 75  | good       |
| extensions/pi-remote-approval/src/README.md   | readme | 72  | acceptable |
| extensions/pi-remote-approval/tests/README.md | readme | 65  | acceptable |
| packages/pi-rpc-protocol/README.md            | readme | 79  | good       |
| packages/pi-rpc-protocol/src/README.md        | readme | 71  | acceptable |
| packages/pi-rpc-protocol/tests/README.md      | readme | 73  | acceptable |
| release/README.md                             | readme | 79  | good       |
| scripts/README.md                             | readme | 76  | good       |
| tests/README.md                               | readme | 71  | acceptable |

---

## 4. BELOW THE BAR

Four README files score below the bar of 70. Each fails the same readme checklist items and shares the same score shape.

| File                                          | DQI | Main gaps                                                                   |
| --------------------------------------------- | --- | --------------------------------------------------------------------------- |
| apps/pi-remote-relay/src/sessions/README.md   | 65  | No blockquote after H1, no TABLE OF CONTENTS, 194 words, no intro paragraph |
| apps/pi-remote-relay/src/replay/README.md     | 69  | No blockquote after H1, no TABLE OF CONTENTS, 295 words, no intro paragraph |
| apps/pi-remote-web/tests/README.md            | 66  | No blockquote after H1, no TABLE OF CONTENTS, 202 words, no intro paragraph |
| extensions/pi-remote-approval/tests/README.md | 65  | No blockquote after H1, no TABLE OF CONTENTS, 179 words, no intro paragraph |

The readme checklist requires a blockquote description after the H1 and a TABLE OF CONTENTS section. No module README in the app satisfies either, which caps the structure component at 24 of 40 for 32 of the 33 README files. The root README.md passes the blockquote item, which lifts its structure component to 32 of 40.

Fix order for the four files: add the blockquote and TABLE OF CONTENTS, expand the body past 500 words, and add an intro paragraph. Re-run the extractor until each file reaches 70.

---

## 5. MEASUREMENT NOTES

- The extractor scores every file deterministically. Re-runs on the same file return the same DQI.
- The word range for README files is 500 to 3000 words. Short module READMEs lose word count points before any other check.
- The heading density range for README files is 2.0 to 8.0 H2 sections per 500 words. Short files with many H2 sections lose heading points.
- The style component grants 4 points for an intro paragraph after the H1. None of the below-bar files earn it.
- The gate refreshes this table on every passing docs change. Re-run the full sweep before a release.
