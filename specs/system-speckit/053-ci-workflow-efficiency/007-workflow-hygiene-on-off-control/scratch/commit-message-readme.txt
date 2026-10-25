docs(ci): document the workflow switches

The workflows README gains an On/off switches section. It names the six
repository variables, lists the workflows each group covers and says that
off is the only token that disables a job.

It also records that the Dependabot workflow has no switch and that the
message contract variable must stay unset while the ruleset requires that
check, because a job skipped by its condition reports Success.

Spec: system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
