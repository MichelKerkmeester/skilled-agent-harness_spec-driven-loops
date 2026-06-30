# Iteration 007 - Register-Gated Transform Remediation

## Focus

Check whether `bolder`, `quieter`, `distill` and `redesign` are routed correctly from audit findings to owner modes.

## Evidence Read

- `references/transform_remediation.md` maps the four verbs to finding signals, owner modes and accepted paths.
- `shared/register.md` defines Brand vs Product posture and says audit uses the register to weight distinctiveness for Brand and affordance/accessibility/consistency for Product.

## Findings

1. Transform remediation is well scoped. It names direction and owner, and explicitly does not implement the transform.
2. The dependency on `shared/register.md` amplifies the router gap from iteration 003. If the register is not loaded, the same observation can be routed to the wrong transform direction.
3. The top implementation should fix routing and benchmark this specific class with a prompt like "Make this interface bolder after the audit identifies why it feels bland."

## Delta

- New information ratio: 0.21.
- Q2 answered; Q3 answered; Q6 partly answered.

## Next

Check manual testing and benchmark coverage.
