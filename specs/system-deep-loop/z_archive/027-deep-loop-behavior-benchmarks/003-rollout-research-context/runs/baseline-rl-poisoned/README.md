# Quarantined: rate-limited baseline cells (round 1)

These 9 cells hit the Claude session quota limit mid-round (rejection text:
"You've hit your session limit · resets 3pm (Europe/Amsterdam)") — the model
never saw the prompts, so none of these results are behavioral evidence. They
were produced BEFORE the runner learned to classify quota rejections as
`env_error`; kept only as the record that motivated that calibration. Valid
re-runs live in `../baseline/`.
