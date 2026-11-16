---
title: Security Policy Template
description: Fillable scaffold for a repository security policy, SECURITY.md, that says how to report a flaw privately and which shipped defaults carry risk.
trigger_phrases:
  - "security policy template"
  - "security.md template"
  - "vulnerability reporting policy"
  - "report a vulnerability guide"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Security Policy Template

Use this template for a repository's `SECURITY.md`, the policy a person reads when they find a flaw or want to know what the project can do to their machine.

---

## 1. OVERVIEW

### Purpose

A security policy serves two readers. Someone who found a flaw needs the private way to report it and what counts. Someone who runs the project needs to know what it can reach and which defaults to change. The policy answers both without sending either one to the source code.

### Usage

Copy the scaffold in Section 4 to `SECURITY.md` at the repository root. Fill it from the project's real defaults and settings, then remove the sections the project does not need. Every risk you list names the file that sets it, so a reader can check it.

The validator reads any file named `SECURITY.md` as a security policy. It wants `OVERVIEW` as the first section and a section on reporting a vulnerability, and it recommends one on supported versions and one on scope.

---

## 2. SECTION MODEL

| # | Section | Keep When |
|---|---|---|
| 1 | OVERVIEW | Always. What the project runs, and which sections serve which reader |
| 2 | REPORTING A VULNERABILITY | Always. The private channel and what a report should include |
| 3 | WHAT HAPPENS NEXT | Always. What a reporter can expect after they report |
| 4 | SUPPORTED VERSIONS | Always. Which releases receive fixes |
| 5 | SCOPE | Always. What is in scope, where it lives and what is not |
| 6 | WHAT CAN GO WRONG | The project runs code, reaches the network or handles secrets |
| 7 | RUNNING SAFELY | Shipped defaults carry risk a user can lower |
| 8 | HOW THE PROJECT GUARDS ITSELF | The repository has its own safeguards |
| 9 | RELATED DOCUMENTS | Always when links exist |

---

## 3. WRITING RULES

- Put the private reporting channel in the tagline and in section 2. Never ask for a public issue.
- Ask reporters to leave live secrets out, and to rotate a leaked credential before they write.
- Promise only what the maintainers do. Write "every report is acknowledged" only when it is true, and leave out response times nobody tracks.
- Give each risk its own H3, named for what can happen. Open it with the file or setting that causes it.
- Say plainly which guards fail open and which fail closed.
- Put a setting in a code block only when the reader copies it into a file.
- Use tables for scope and safeguards, where each row pairs a surface with where it lives.

Separators: `SECURITY.md` at a repository root is one of the guides the validator exempts from the `---` rule, so put one `&nbsp;` line above each H2. A policy under `.github/` uses `---`.

---

## 4. FILLABLE SCAFFOLD

````markdown
# Security Policy

> [One sentence on what the project runs and why a flaw matters.] Report one privately, as section 2 describes.

&nbsp;

## 1. OVERVIEW

[What the project runs on a user's machine and with which permissions, in a short paragraph.]

[One paragraph that names the two readers: a reporter reads sections 2 to 5, and a user reads sections 6 and 7.]

&nbsp;

## 2. REPORTING A VULNERABILITY

[The private channel, step by step. For GitHub: open the Security tab and choose Report a vulnerability.] Never open a public issue or pull request for a security problem.

Include what you can of the following:

- The affected file or component, with the commit you tested against
- The version and platform you ran it on
- Every setting you changed from the defaults
- Steps to reproduce, or a proof of concept
- The impact you expect

Leave live secrets out of the report. If a credential leaked, name its kind and where it showed up. Rotate it before you write.

&nbsp;

## 3. WHAT HAPPENS NEXT

[What the maintainers do after a report, and how credit works. Promise only what is true.]

&nbsp;

## 4. SUPPORTED VERSIONS

[Which releases receive security fixes.]

&nbsp;

## 5. SCOPE

[What this repository ships, and what is out of scope with where to report it instead.]

| Surface | Where it lives |
|---|---|
| [Surface] | `[path]` |

&nbsp;

## 6. WHAT CAN GO WRONG

Each risk below names the file that sets the behavior, so you can check it yourself.

### [What Can Happen]

[The file or setting that causes it. What it means for the user. Whether its guard fails open or closed.]

&nbsp;

## 7. RUNNING SAFELY

### [The Change To Make]

[Why it lowers the risk, and how to make it.]

```json
[the setting to copy, when there is one]
```

&nbsp;

## 8. HOW THE PROJECT GUARDS ITSELF

| Safeguard | What it does | Where |
|---|---|---|
| [Safeguard] | [What it blocks or checks] | `[path]` |

&nbsp;

## 9. RELATED DOCUMENTS

- **[Contributing](CONTRIBUTING.md)** - how to contribute a fix
````

---

## 5. VALIDATION CHECKLIST

- [ ] The private channel appears in the tagline and in section 2.
- [ ] No sentence invites a public report of a security flaw.
- [ ] Every risk names the file or setting that causes it.
- [ ] Every promise in section 3 matches what the maintainers do.
- [ ] Separators match the file: `&nbsp;` at the repository root, `---` under `.github/`.
- [ ] `validate_document.py` reads the file as `security_policy` and reports zero issues.
- [ ] HVR passes: no em dashes, semicolons, banned words or setup phrases.

---

## 6. RELATED RESOURCES

- [`readme-template.md`](./readme-template.md) - Selection guide and the front-page scaffold that links to this policy.
- [`contributing-template.md`](./contributing-template.md) - Contributing guide scaffold that sends security reports here.
- [`hvr-rules.md`](../../sk-create-with-human-voice/references/hvr-rules.md) - Human Voice Rules.
