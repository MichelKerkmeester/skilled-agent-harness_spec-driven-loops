# Decision table matcher calibration

## Inputs and method

The read-only run compared 35 queue records from `.skilled/skills/.state/decision-capture/66653063393939302d303664332d343534652d613865372d376337626336343962633439.jsonl` with the 99 Q rows parsed from `barter/ai-speckit/specs/barter-framework/001-coder-skilled-v4-conversion/decision-record.md`.

The normalized answer must match exactly before a score is considered. The score weights symmetric token overlap for options at 0.35, header-to-topic overlap at 0.30, question overlap at 0.30 and the same UTC day at 0.05. The default threshold is 0.40 and the tie margin is 0.05.

## Results

The matcher summary was `consumed 33, refused 0, pending 2`. Here, “consumed” means an accepted row match. This calibration run did not write a consumed log.

The lowest accepted score was 0.5200 for record 28 and Q93. It is 0.1200 above the threshold and 0.0700 above the threshold plus tie margin. Records 12 and 31 had no answer-gated row, so they remain pending and have no candidate score.

| Queue record | Match or reason | Score |
|---:|---|---:|
| 1 | Q67 | 0.6518 |
| 2 | Q68 | 0.7367 |
| 3 | Q69 | 0.9127 |
| 4 | Q70 | 0.8462 |
| 5 | Q71 | 0.8226 |
| 6 | Q72 | 0.9943 |
| 7 | Q73 | 0.7678 |
| 8 | Q74 | 0.8125 |
| 9 | Q75 | 0.8105 |
| 10 | Q76 | 0.8114 |
| 11 | Q77 | 0.7415 |
| 12 | pending: no row | n/a, answer gate |
| 13 | Q78 | 0.7952 |
| 14 | Q79 | 0.5759 |
| 15 | Q80 | 0.8916 |
| 16 | Q81 | 0.7463 |
| 17 | Q82 | 0.7609 |
| 18 | Q83 | 0.7289 |
| 19 | Q84 | 0.7400 |
| 20 | Q85 | 0.6567 |
| 21 | Q86 | 0.7283 |
| 22 | Q87 | 0.6412 |
| 23 | Q88 | 0.7491 |
| 24 | Q89 | 0.8417 |
| 25 | Q90 | 0.6798 |
| 26 | Q91 | 0.7935 |
| 27 | Q92 | 0.7312 |
| 28 | Q93 | 0.5200 |
| 29 | Q94 | 0.6671 |
| 30 | Q95 | 0.5500 |
| 31 | pending: no row | n/a, answer gate |
| 32 | Q96 | 0.7053 |
| 33 | Q97 | 0.7698 |
| 34 | Q98 | 0.5837 |
| 35 | Q99 | 0.7263 |

## Read-only check

The queue SHA-256 was `426295a886e8d57e3b076271317c368aa718c61e9fa60ddb89ea271f05436c12` before and after calibration. The decision record SHA-256 was `f25074d57968e7d61e8af488f5d899d49fbe6d3e0ea2b0170f130b47e6257867` before and after calibration.
