# Iteration 5 Prompt

Dispatcher: inline autonomous executor (`cli-codex`, `gpt-5.6-luna`); no executor dispatch is performed.

Focus: trigger-index correctness. Compare the reader’s load and lookup checks with the generator’s read-back validator, the documented Gate 1 failure contract, and the existing malformed-input test coverage. Reproduce the reasoning statically from the source; do not mutate the committed index or run generators. Adjudicate F001 if the reader can silently turn a corrupt-but-readable index into an incomplete or empty answer, then continue the loop.
