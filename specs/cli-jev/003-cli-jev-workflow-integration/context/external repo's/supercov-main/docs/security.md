# Security surface

`npx supercov security` tells you what security-relevant surface each file shows:
twelve named checks, asked file by file, each mapped to the weakness classes it
stands for. There is no score. A file is clean, or it names what fired.

Judgments come from [Jev](https://typesafe.ai), the same way `npx supercov quality`
gets them. Set `TYPESAFE_API_KEY`, and optionally another provider, as described
in [quality](quality.md); reading a saved assessment never needs a key.

## Start with the repository

```bash
npx supercov security
```

```
Security: 6 of 73 files flagged, 67 clean; 4 confirmed at a line.
  destination_from_input 3, injection_sink 1, missing_authorization 1, unsafe_code_execution 1
Catalog security-v4, model jev-1.13.0, snapshot q_5e1c…

Flagged:
  src/routes/invoices.ts
    0.91  injection_sink
          line 42  0.88  db.query(`select * from invoices where id = ${req.params.id}`)
  src/gateways/sseToStdio.ts
    0.77  destination_from_input  (file-level only)
```

Every line is a claim you can check against the file in seconds. The value is
the model's probability that the pattern is present; nothing is averaged,
because nothing in the evidence supported averaging security answers.

## Two passes, two tiers

Every file is asked the twelve questions once. For the checks that fired at
all, the parser lists every call, literal, route handler and request-body
spread the file has (Python, JavaScript and TypeScript), or every template
expression and configuration value (templates and config files), and the
model says which of the fired checks, if any, each line shows, one Choice
per line. Each classified line then gets the check's own question and a
triage question: would a careful reviewer report this, or dismiss it. A finding confirmed at a line is shown with the line and
the code on it, and with the line where the outside value enters the program
when the model can name one; a finding only the first pass made is marked
file-level only. Three findings of one check within ten lines count as one.
Authorisation findings stay file-level. Whether a guard reaches a handler
and which callers it admits is a fact that lives in the wiring, not the
handler, and no per-line question has been found that decides it: every
attempt measured on the labelled corpus fired on unguarded handlers the
application leaves open by design as often as on the ones it should not.


Measured with 2.0.1 on the 72 held-out repositories of RealVuln, a
140-repository labelled corpus, scored by its own rule: F1 0.42 with 42%
precision and 43% recall, in a median of 10 seconds and about 5 cents a
repository. The strongest agent-based scanners score 0.69 to 0.71 but take
5 to 9 minutes and about $4 a repository; Semgrep's default rules score 0.11.
Redirects, injection, unsafe code execution and paths taken from a request
are found at 79 to 89% recall; authorisation (11%) and authentication (24%)
are the weakest, because the guard that decides them lives in another file.
Every scanner's results are at
[supercov.com/docs/security-benchmark](https://supercov.com/docs/security-benchmark).
A file too large for one request is read in windows at declaration
boundaries, or at line boundaries where Supercov has no parser for it, such as
a template.

## What is read

Security reads every source file, template and configuration file that the
conventions do not exclude, including files under no recognised source root,
because code a project did not declare is deployed as often as not.
`npx supercov security scope` lists exactly the files a run reads and why the
rest were left out. Three kinds are left out because they are not the code
under review:

- **Tests and generated output**, as for `quality`.
- **Vendored and minified JavaScript.** A minified file anywhere, and in a
  served or vendor directory (`static/`, `public/`, `assets/`, `plugins/`,
  `vendor/`, `lib/`) a file with a licence banner or a well-known library's
  name, such as `jquery.flot.js` or `swagger-ui-bundle.js`.
- **JSON data.** A JSON file is read when its name or directory says it
  configures something (`config.json`, `proxy.conf.json`, `appsettings.json`,
  `secrets.json`, anything under `config/`), and not when it holds data such
  as translations, schema snapshots or scanner output.

A directory called `target/` is build output only when a build that writes
there (Cargo, Maven, Gradle, sbt, Leiningen) is declared beside it; otherwise
it is read like any other. Name a file directly to read it whatever the scope
says: `npx supercov security static/js/app.min.js`.

A run that could not assess a few files still exits 0: each one is in the
report with its reason, and stderr says how many. It exits 2 only when no
file could be assessed.
## Across files

The second pass also labels every function of every file, on the same
request: does it take caller-supplied data, does a parameter reach a
dangerous operation unprotected inside it, does it sanitise or authorise what
it receives, and which kind of operation. Supercov then resolves the file's
imports itself, pairs every function that takes outside data with every
imported function that reaches a sink without sanitising, where the caller's
body names the callee, and confirms each pair with one question that carries
both function bodies. A confirmed path is printed as a call site and a sink:

```
Cross-file paths confirmed: 2
  0.79  injection_sink  app/routes/index.js:19 index -> app/routes/allocations.js:11 displayAllocations
  0.70  injection_sink  app/routes/benefits.js:11 BenefitsHandler -> app/data/benefits-dao.js:2 BenefitsDAO
```

The model never sees two files at once until a path is confirmed; the graph
is host code over resolved imports, one hop.

With `--run`, a second kind of edge joins the first: the run's own record of
which tests executed which lines. A sink function and an entry function that
took outside data under the same test are paired and confirmed the same way,
whether or not any import connects them. That is how a handler that reaches
its sink through a lookup table, a registry, a decorator or a framework is
followed; no import graph has that edge, and no trace is attempted. On a
library whose views dispatch to their sinks by name, this took recall of the
labelled weaknesses from 42% to 75%. Without a run, nothing here is asked. Measured on a third of the same
corpus, confirmed paths fired on 0.1% of unlabelled files, and on real CVEs
in mature projects this stage is where the recall has to come from, because
a real vulnerability rarely sits in one file. JavaScript, TypeScript and
Python have parsers for this; other languages get the twelve questions and
the pattern candidates only.

## The twelve checks

| Check | Stands for |
| --- | --- |
| secret_in_source | a credential or signing secret written into the source (CWE-798, 259, 321) |
| injection_sink | a query or command assembled from a caller's value (CWE-89, 78, 77, 943, 90) |
| unsafe_code_execution | eval, exec, pickle or unsafe deserialisation of outside data (CWE-94, 95, 502, 1336) |
| unescaped_output | an outside value written into markup without escaping (CWE-79, 116) |
| path_from_input | a file operation on a caller-controlled path, name or type (CWE-22, 73, 434) |
| missing_authorization | a handler acting on a caller-chosen record with no visible check (CWE-862, 863, 639, 284, 306) |
| weak_authentication | a token, session or password handled in a way that weakens it (CWE-287, 613, 614, 347, 384, 1004) |
| weak_cryptography | a primitive weak for its purpose, or predictable randomness for a secret (CWE-327, 328, 326, 330, 338, 916) |
| sensitive_data_exposure | a secret, token or internal detail in a log or a response (CWE-200, 209, 532, 312) |
| destination_from_input | a request or redirect going wherever a caller's value says (CWE-918, 601) |
| unchecked_mass_assignment | a request body copied wholesale into a record (CWE-915, 1321) |
| insecure_configuration | a provided protection switched off or weakened, or debug mode left on (CWE-16, 295, 352, 611, 942, 1004, 489, 215) |

Each asks whether a pattern is present, never whether it is exploitable, and
each states its exception. A value is from outside the program when it arrives
at run time from a caller, request, message, upload or third-party service; the
operator's own configuration, arguments, environment and shipped files are not.

## What is known about each check

Measured on 2026-09-20 against constructed pairs, a clean floor, and RealVuln,
a corpus of 140 deliberately vulnerable repositories with 3,381 labelled
findings in Python, TypeScript and JavaScript:

- every check caught its constructed positive at 0.97 or above and stayed quiet
  on a matched safe file, both when asked of a file and of a change;
- on the labelled corpus, the check a finding's weakness class maps to fired on
  68% of files carrying a finding, from 96% for secrets in source down to 43%
  for missing authorisation, and on 5 of 76 certified false-positive traps;
- on the same files and labels, Semgrep reached 10%, SonarQube 18% and Snyk 21%.

`missing_authorization` is the weak one and is shown with that number. A
per-file question cannot see a guard in another file, so it is right seven
times in ten on code people wrote and less on generated corpora that label
single unguarded routes inside otherwise guarded files.

```bash
npx supercov security file src/routes/invoices.ts
```

shows every check with its value and its evidence line, so a finding can be
weighed without leaving the terminal.

## Cross it with a run

```bash
npx supercov security --run latest
```

adds, for every flagged file, whether the saved coverage run executed it and how
many of its measured lines no test reached. A handler that builds a query from
request input is one thing; the same handler that no test ever executes is a
stronger claim, and one that needs both halves of this product to make.

## What a change introduced

```bash
npx supercov security patch --base origin/main
npx supercov security patch --annotate github
```

The same twelve, asked whether the new version shows a surface the old one did
not. `quality patch` asks them too, alongside its own catalog, so a review of a
change needs one command; `security patch` is the same answers without the
complexity findings.

## Reference

```bash
npx supercov security                             # this repository
npx supercov security gaps                        # only files something fired on
npx supercov security file src/server.ts          # one file, every check, with evidence
npx supercov security scope                       # which files, and why
npx supercov security snapshots                   # saved assessments
npx supercov security diff <older> <newer>        # what appeared
npx supercov security patch                       # what a change introduced
npx supercov security --run latest                # flagged and untested
```

Cache and snapshots live under `.supercov/security/`, apart from quality's, so
one can never be read as the other.
