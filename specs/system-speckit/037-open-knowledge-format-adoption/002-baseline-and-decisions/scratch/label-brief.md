Label 40 citations. Read-only: change no file.

Input: specs/system-speckit/050-open-knowledge-format-adoption/002-baseline-and-decisions/scratch/sample-rows.jsonl
One JSON row per line. Fields: id, claim (the citing paragraph), target (path from the repo root), target_line, target_line_end, window (numbered lines around the cited line).

For each row:
1. verdict: do the window lines support what the claim says about this target and line? One of supports, partial, contradicts, unclear. If the claim cites several targets, judge only the part that cites this one.
2. If the verdict is partial or contradicts, open the whole target file and look for text that would support the claim. relocated is yes with that line number, or no.

Output exactly 40 lines of JSON, one per row, in input order, and nothing else:
{"id":"d3-01","verdict":"supports","relocated":"na","relocated_line":null,"note":"at most 15 words"}
Use relocated "na" when the verdict is supports or unclear.
