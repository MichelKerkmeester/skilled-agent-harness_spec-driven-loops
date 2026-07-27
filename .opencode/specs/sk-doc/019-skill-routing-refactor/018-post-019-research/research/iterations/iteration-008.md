# Iteration 8: Privacy-preserving sealed natural-prompt sampling

## Focus

Determine a sampling frame that preserves naturally occurring routing prompts, freezes the evaluation cohort before analysis, and yields gold route labels without exposing prompt text or route outcomes to downstream analysts.

## Actions Taken

1. Re-read the prompt-free evaluation-unit and staged-join requirements from iterations 6 and 7.
2. Compared four candidate frames: raw-log export, prompt hashing, de-identified or synthetic release, and controlled-access sampling inside a trusted research environment.
3. Triangulated privacy controls against NIST de-identification guidance and the ONS Five Safes / separation-of-functions model.
4. Mapped temporal sealing to an immutable, embargoable preregistration and opaque sample manifest.
5. Tested whether the frame can lock gold labels before joining route decision, leaf execution, and task outcome telemetry.

## Findings

### 1. The minimum viable frame is a consented stratified reservoir inside a trusted research environment

Sample naturally occurring prompts only from an approved source with explicit research authority, such as opt-in product telemetry or organization-owned internal traffic covered by a documented purpose and retention schedule. Assign the prompt-free evaluation-unit ID at collection, then reservoir-sample within preregistered strata such as hub, routing archetype, risk class, runtime, and collection week. Raw text stays inside the trusted environment; the research packet receives only opaque IDs, stratum metadata, counts, and hashes.

The ONS model supports this architecture: approved researchers access de-identified unpublished data only in secure settings, while outputs receive disclosure review. [SOURCE: https://www.ons.gov.uk/aboutus/whatwedo/statistics/requestingstatistics/secureresearchservice/aboutthesecureresearchservice] This extends the prior requirement that every request receive a prompt-free evaluation unit before route action. [SOURCE: file:22:### 2. Use one prompt-free evaluation unit across three sequential stages]

### 2. Privacy requires role separation, not a stronger hash

Use three non-overlapping roles:

- The sampling broker holds the event-to-evaluation-unit mapping, applies eligibility rules, and releases selected prompts only inside the secure environment.
- Two independent labelers see the minimally redacted prompt and frozen routing authority snapshot, but not the observed route, confidence, leaf receipts, task outcome, or each other's label. An adjudicator resolves disagreement before label lock.
- Analysts receive the locked gold labels joined to prompt-free telemetry only after adjudication; they never receive raw prompts or the reversible identity map.

This is an inference from the ONS separation-of-linkage-and-analysis principle: consistent unique row IDs permit joins without exposing direct identifiers, and the linkage team is separated from analysts. [SOURCE: https://www.ons.gov.uk/file?uri=%2Faboutus%2Fwhatwedo%2Fprogrammesandprojects%2Freferencedatamanagementframework%2Freferencedatamanagementframeworkwhatistherdmfv03.pdf] It also closes the current fleet gap: existing artifacts have no evaluation-unit-level joined run. [SOURCE: file:16:1. **The staged join does not reproduce the sk-doc result across the fleet because no comparable joined fleet run exists.** The sk-doc evidence scores three routers on the same requests and reports correct top-intent recall for eight blind natural phrasings; it does not record a shared evaluation-unit identity, a leaf-originated completion receipt, or a downstream task outcome. The other eleven hubs therefore cannot be compared on the iteration-6 end-to-end estimand from current artifacts. [SOURCE]

### 3. Temporal sealing needs two freezes before route results are inspected

Freeze an embargoed preregistration before drawing labels. It should contain the collection cutoff, eligibility and exclusion rules, stratum targets, sampling seed or deterministic selection function, gold-label rubric, disagreement policy, route budget, analysis plan, and hashes of the serving-authority snapshot. Then freeze a second opaque manifest containing the selected evaluation-unit IDs and encrypted-object hashes before any labeler sees route outcomes.

OSF registrations are frozen after submission, may be embargoed, and cannot be edited in place; that is sufficient for the protocol and manifest commitment, but raw prompts must not be uploaded. [SOURCE: https://help.osf.io/article/330-welcome-to-registrations]

### 4. Gold labels can remain blind while still supporting the staged causal join

The gold record should contain evaluation-unit ID, required leaves, supplemental leaves, routeability or defer label, risk class, authority-snapshot hash, two independent judgments, adjudication result, and label-lock timestamp. Only after that timestamp may the evaluation runner attach route decision, leaf start, leaf finish, and task outcome. Logical event order remains the causal test; wall-clock proximity is not a join key.

This preserves false-route and false-defer cases because the sampling frame is defined before dispatch and includes every sampled request, not only successful executions.

### 5. De-identification, synthetic prompts, and differential privacy are release controls, not substitutes for the gold corpus

Semantic route labels require the meaning of each selected prompt. A hash cannot supply that meaning, and a reversible mapping is pseudonymous rather than anonymous. Synthetic or differentially private prompts may support public stress tests or aggregate reporting, but they no longer constitute the sealed sample of naturally occurring prompts. NIST recommends choosing an explicit release model and evaluating re-identification risk; masking alone is not necessarily adequate. [SOURCE: https://csrc.nist.gov/pubs/sp/800/188/final] NIST also notes that de-identification and synthesis can distort distributions and introduce bias. [SOURCE: https://www.nist.gov/itl/applied-cybersecurity/privacy-engineering/pets-testbed]

Therefore differential privacy belongs at the aggregate-output boundary, after gold locking and staged joins, not in the row-level labeling path.

## Questions Answered

- Which privacy-preserving sampling frame can provide temporally sealed natural prompts and blinded gold labels?
  - A consented, stratified operational-prompt reservoir in a trusted research environment, using opaque evaluation-unit IDs, split sampling/labeling/analysis roles, immutable preregistration, a sealed sample manifest, blind independent labeling, pre-join gold lock, and disclosure-reviewed aggregate release.

## Questions Remaining

- Which source of prompts has sufficient consent or organizational authority, and what retention window is legally and operationally acceptable?
- How much selection bias is introduced by opt-in, safety exclusions, and redaction, measured against prompt-free frame metadata?
- What per-hub, archetype, risk, and runtime sample sizes are required for the false-route, false-defer, causal-execution, and task-failure error budgets?
- Can every supported runtime emit the evaluation-unit ID and four-stage telemetry without retaining prompt text?
- Does the sealed frame reproduce the sk-doc blind result across the other 11 hubs?

## Ruled-Out Directions

- Raw-prompt hashes as a privacy mechanism: hashes preserve neither semantic labelability nor anonymity against guessing and linkage.
- Fully prompt-free labeling: semantic gold cannot be created without controlled access to prompt meaning.
- Synthetic or differentially private prompts as the natural-prompt gold set: they alter the target distribution and can introduce artifacts.
- Labeling after route outcomes are visible: this breaks the blindness needed to estimate routing error.
- Public preregistration of raw prompts: temporal commitment does not authorize disclosure.

## Next Focus

Preregister the hub × archetype × risk × runtime allocation and derive minimum per-stratum sample sizes, including a measurable audit of opt-in and redaction selection bias.

## SCOPE VIOLATIONS

None.

