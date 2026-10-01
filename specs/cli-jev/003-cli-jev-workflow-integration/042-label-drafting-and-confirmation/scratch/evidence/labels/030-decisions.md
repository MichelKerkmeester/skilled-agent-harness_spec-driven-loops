# 030 label decisions

The label file holds finding text, so it lives outside the repository at the operator-named folder: `~/.skilled/.labels/030-labels.jsonl` (mode 600). This log carries no finding text.

## Method

- Sheet: `score-fanout-pairs.cjs --write-pair-sheet`, written to the session scratchpad, 60 pairs, all cross-body (the near-line class is empty on today's corpus, as the phase recorded).
- Luna 6 max and SWE 2 max labeled each pair blind under neutral ids P01 to P60. They agreed on 57 of 60.
- An Opus 5.5 medium arbiter, run alone and delegated by the operator, settled every pair.

## Arbiter ruling

`same` means the same defect at the same concrete location, so one fix closes both. Wording, severity, scope and count differences about one artifact do not matter. Class-level findings whose cited file sets do not overlap are `different`. Summary-only placeholder entries naming different review dimensions are `different`.

Result: 48 `same`, 12 `different`. The arbiter differs from Luna on P15 and P24 and from SWE on P27, each settled from the run registries.

## Session checks

- The P15 pair key joins composer-2-5-r2 F007 and swe-1-7 F008, which matches the arbiter's registry evidence.
- Zero-call census with `--labels ~/.skilled/.labels/030-labels.jsonl`: exit 0, `planned calls: jev 181, deem 120`, no headroom stop. The merge decides `different` on every cross-body pair under both dedup settings, so its baseline matches only the 12 `different` labels. No arm ran, and a switched run needs the operator's separate yes.
