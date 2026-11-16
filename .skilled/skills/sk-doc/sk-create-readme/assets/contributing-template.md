---
title: Contributing Guide Template
description: Fillable scaffold for a repository contributing guide at the root, CONTRIBUTING.md, covering setup, the rules the checks enforce, commit format and what a pull request needs.
trigger_phrases:
  - "contributing guide template"
  - "contributing.md template"
  - "how to contribute guide"
  - "pull request guide scaffold"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Contributing Guide Template

Use this template for a repository's `CONTRIBUTING.md`, the guide an outside contributor reads before their first pull request.

---

## 1. OVERVIEW

### Purpose

A contributing guide tells a newcomer how to get a change accepted. It names every rule a check will enforce and what a reviewer looks for, so the first pull request does not fail on something nobody wrote down.

### Usage

Copy the scaffold in Section 4 to the repository root as `CONTRIBUTING.md`. Fill it from the project's real hooks and CI workflows, then remove the sections the project does not need.

---

## 2. SECTION MODEL

| # | Section | Keep When |
|---|---|---|
| 1 | OVERVIEW | Always. The whole path from fork to merged pull request, in a few sentences |
| 2 | DEVELOPMENT SETUP | Always. Prerequisites, install and how to run the tests |
| 3 | CODE STYLE | The project has style rules a reviewer checks |
| 4 | COMMIT MESSAGES | A hook or CI check enforces a commit format |
| 5 | PULL REQUESTS | Always. What the description needs and which checks run |
| 6 | WHAT TO CONTRIBUTE | The project wants some kinds of change more than others |
| 7 | QUESTIONS AND SECURITY | Always. Where to ask, and the private path for a security flaw |
| 8 | LICENSE | The project has a license |

---

## 3. WRITING RULES

- Open with one or two sentences under the title. Thank the reader and say what the guide covers.
- Write the overview as a short paragraph of steps, not a list. Link each step to the section that explains it.
- State every rule a hook or CI check enforces, and say which check enforces it. A contributor should never meet a rule for the first time in a failed check.
- Show one example of each format the checks hold a contributor to, such as a commit message or a pull request description.
- Put only what the reader types in a code block. Describe a check in a sentence.
- Point to the full install guide for setup detail, and keep only the commands a contributor needs here.
- Send security reports to the security policy, never to a public issue.
- Use plain words in prose. Name a file or setting only where the contributor opens it or sets it.

Separators: `CONTRIBUTING.md` at a repository root is one of the guides the validator exempts from the `---` rule, so put one `&nbsp;` line above each H2. A contributing guide anywhere else, such as `.github/CONTRIBUTING.md`, uses `---`.

---

## 4. FILLABLE SCAFFOLD

````markdown
# Contributing to [PROJECT_NAME]

Thank you for wanting to improve [PROJECT_NAME]. This guide covers the setup and the rules a pull request has to pass.

&nbsp;

## 1. OVERVIEW

[The whole path in a few sentences: fork and clone, create a branch, make the change and run the tests, then open a pull request. Link each step to its section.]

[One sentence on where the rules are checked, such as local hooks and CI.]

&nbsp;

## 2. DEVELOPMENT SETUP

### Prerequisites

[What a contributor needs, with exact versions.]

### Install

Run every command from the repository root:

```bash
[clone and install commands]
```

[One sentence that points to the install guide for the full setup.]

### Testing Changes

[Where the tests live and which suite to run for which part.]

```bash
[test command]
```

&nbsp;

## 3. CODE STYLE

[The rules reviewers check most often, as short paragraphs. Link the full style guide.]

&nbsp;

## 4. COMMIT MESSAGES

[The format, and the check that enforces it.]

```
[an example commit message]
```

[What each part of the message must hold.]

### Branch Names

[The branch names the checks accept, with one example a contributor can copy.]

&nbsp;

## 5. PULL REQUESTS

### Description

[What the description must contain, and the check that holds it to that.]

```markdown
[an example description]
```

### Checks

[Which checks run on a pull request, and when.]

### What Reviewers Look For

[Two or three sentences on what gets a change approved.]

&nbsp;

## 6. WHAT TO CONTRIBUTE

[The changes the project wants most, in a short paragraph. Name the command or template that starts each kind.]

&nbsp;

## 7. QUESTIONS AND SECURITY

[Where to ask a question or propose an idea.] Report a security problem privately, as [SECURITY.md](SECURITY.md) describes, and never in a public issue.

&nbsp;

## 8. LICENSE

By contributing, you agree that your contributions are licensed under the project's [[LICENSE_NAME]](LICENSE).
````

---

## 5. VALIDATION CHECKLIST

- [ ] Every rule a check enforces is stated, with the check that enforces it.
- [ ] Every example passes the project's own checks.
- [ ] Every command ran from the repository root on a fresh clone.
- [ ] Security reports go to the security policy, never to a public issue.
- [ ] Separators match the file: `&nbsp;` at the repository root, `---` anywhere else.
- [ ] Every local link resolves from the repository root.
- [ ] HVR passes: no em dashes, semicolons, banned words or setup phrases.

---

## 6. RELATED RESOURCES

- [`readme-template.md`](./readme-template.md) - Selection guide and the front-page scaffold that links to this guide.
- [`install-template.md`](./install-template.md) - Install guide scaffold this guide points to for setup detail.
- [`security-policy-template.md`](./security-policy-template.md) - Security policy scaffold this guide sends security reports to.
- [`hvr-rules.md`](../../sk-create-with-human-voice/references/hvr-rules.md) - Human Voice Rules.
