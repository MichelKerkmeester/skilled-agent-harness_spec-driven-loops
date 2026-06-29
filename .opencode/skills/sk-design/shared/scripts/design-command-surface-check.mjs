// ============================================================================
// Design Command Surface Check
// ============================================================================

import { readFile } from "node:fs/promises";

const REQUIRED_FIELDS = [
  "command",
  "ownerMode",
  "description",
  "argumentHint",
  "aliases",
  "accepts",
  "returns",
  "examples",
  "next",
  "proofFields",
  "registerPolicy",
  "deferToHubWhen",
  "preconditions",
  "discriminator",
  "toolPolicy",
  "outputContract"
];

const COMMANDS = [
  "/design:audit",
  "/design:foundations",
  "/design:interface",
  "/design:md-generator",
  "/design:motion"
];

const FRONTMATTER_DRIFT_FIELDS = ["description", "argument-hint", "allowed-tools"];
const DRIFT_FIELDS = [
  ...FRONTMATTER_DRIFT_FIELDS,
  "emit-deliverable",
  "example",
  "example-invocation",
  "example-prefix",
  "returns",
  "sibling-discriminator",
  "preconditions",
  "register",
  "wrapper"
];
const GENERIC_ARGUMENT_HINT = "<design request>";
const READ_ONLY_TOOLS = ["Read", "Glob", "Grep"];
const MUTATING_TOOLS = ["Read", "Write", "Edit", "Bash", "Glob", "Grep"];
const DRIFT_SORT_FIELDS = [...DRIFT_FIELDS];
const PRECONDITION_FIELDS = [
  "requiredInputKind",
  "missingInputQuestion",
  "cannotRunWhen",
  "escalateIf",
  "routeInstead"
];
const REGISTER_POLICY_FIELDS = ["accepted", "default", "resolutionOrder", "askWhen", "proofFields"];
const PRECONDITION_SECTION_MARKERS = ["Requires:", "Ask-first:", "Cannot-run:", "Escalate:"];
const REQUIRED_RETURN_STATUS_TOKENS = [
  "STATUS=OK",
  "STATUS=ASK MISSING=<input>",
  "STATUS=FAIL ERROR=<named-cause>",
  "STATUS=DEFER ROUTE="
];
const STATUS_ONLY_FAILURE_PATTERN = /STATUS=FAIL\s+ERROR="<message>"/;
const ARTIFACT_KINDS = new Set(["report", "plan", "spec", "reference-doc"]);
const GENERIC_ARTIFACT_NAMES = new Set([
  "output",
  "result",
  "artifact",
  "deliverable",
  "data",
  "response",
  "file",
  "document",
  "thing",
  "stuff"
]);

const scriptUrl = new URL(import.meta.url);
const skillRootUrl = new URL("../../", scriptUrl);
const opencodeRootUrl = new URL("../../", skillRootUrl);
const metadataUrl = new URL("command-metadata.json", skillRootUrl);
const registryUrl = new URL("mode-registry.json", skillRootUrl);
const commandsRootUrl = new URL("commands/design/", opencodeRootUrl);
const SIBLING_DISCRIMINATOR_START = "<!-- ANCHOR:sibling-discriminator -->";
const SIBLING_DISCRIMINATOR_END = "<!-- /ANCHOR:sibling-discriminator -->";
const REGISTER_SECTION_START = "<!-- ANCHOR:register -->";
const REGISTER_SECTION_END = "<!-- /ANCHOR:register -->";

const args = new Set(process.argv.slice(2));
const jsonMode = args.has("--json");
const unknownArgs = [...args].filter((arg) => arg !== "--json");

if (unknownArgs.length > 0) {
  emitAndExit(
    {
      status: "invalid",
      stage: "usage",
      errors: unknownArgs.map((arg) => `unknown argument: ${arg}`),
      drift: []
    },
    2
  );
}

main().catch((error) => {
  emitAndExit(
    {
      status: "invalid",
      stage: "runtime",
      errors: [error instanceof Error ? error.message : String(error)],
      drift: []
    },
    2
  );
});

async function main() {
  const [metadata, registry] = await Promise.all([readJson(metadataUrl), readJson(registryUrl)]);
  const workflowModes = readWorkflowModes(registry);
  const metadataErrors = validateMetadata(metadata, workflowModes);

  if (metadataErrors.length > 0) {
    emitAndExit(
      {
        status: "invalid",
        stage: "metadata",
        errors: metadataErrors,
        drift: []
      },
      2
    );
  }

  const records = [...metadata].sort((a, b) => a.command.localeCompare(b.command));
  const drift = await collectSurfaceDrift(records);

  emitAndExit(
    {
      status: drift.length > 0 ? "drift" : "pass",
      stage: drift.length > 0 ? "surface" : "complete",
      metadata: {
        commandCount: records.length,
        workflowModes: [...workflowModes].sort(),
        aliasCount: records.reduce((count, record) => count + record.aliases.length, 0)
      },
      drift
    },
    drift.length > 0 ? 1 : 0
  );
}

async function readJson(url) {
  const raw = await readFile(url, "utf8");
  return JSON.parse(raw);
}

function readWorkflowModes(registry) {
  if (!registry || !Array.isArray(registry.modes)) {
    return new Set();
  }

  return new Set(
    registry.modes
      .map((mode) => mode && mode.workflowMode)
      .filter((workflowMode) => typeof workflowMode === "string" && workflowMode.length > 0)
  );
}

function validateMetadata(metadata, workflowModes) {
  const errors = [];

  if (!Array.isArray(metadata)) {
    return ["metadata root must be an array"];
  }

  const seenCommands = new Map();
  const expectedCommands = new Set(COMMANDS);
  const seenAliases = new Map();

  for (const record of metadata) {
    const command = typeof record?.command === "string" ? record.command : "<missing command>";

    for (const field of REQUIRED_FIELDS) {
      if (!Object.hasOwn(record ?? {}, field)) {
        errors.push(`${command}: missing required field ${field}`);
      }
    }

    if (!expectedCommands.has(command)) {
      errors.push(`${command}: command is not in the expected /design:* command set`);
    }

    if (seenCommands.has(command)) {
      errors.push(`${command}: command is duplicated`);
    } else {
      seenCommands.set(command, record);
    }

    if (typeof record?.ownerMode !== "string" || !workflowModes.has(record.ownerMode)) {
      errors.push(`${command}: ownerMode must match a workflowMode`);
    }

    for (const field of ["description", "argumentHint", "accepts", "returns", "deferToHubWhen"]) {
      if (typeof record?.[field] !== "string" || record[field].length === 0) {
        errors.push(`${command}: ${field} must be a non-empty string`);
      }
    }

    for (const field of ["aliases", "next", "proofFields"]) {
      if (!isNonEmptyStringArray(record?.[field])) {
        errors.push(`${command}: ${field} must be a non-empty string array`);
      }
    }

    if (typeof record?.toolPolicy?.mutatesWorkspace !== "boolean") {
      errors.push(`${command}: toolPolicy.mutatesWorkspace must be a boolean`);
    }

    errors.push(...validatePreconditions(record, command));
    errors.push(...validateRegisterPolicy(record, command));
    errors.push(...validateExamples(record, command));
    errors.push(...validateOutputContract(record, command));
    errors.push(...validateDiscriminator(record, command, workflowModes));

    if (Array.isArray(record?.aliases)) {
      for (const alias of record.aliases) {
        const owner = seenAliases.get(alias);
        if (owner && owner !== command) {
          errors.push(`${command}: alias "${alias}" is already owned by ${owner}`);
        } else {
          seenAliases.set(alias, command);
        }
      }
    }
  }

  for (const command of COMMANDS) {
    if (!seenCommands.has(command)) {
      errors.push(`${command}: missing metadata record`);
    }
  }

  return errors.sort();
}

function validatePreconditions(record, command) {
  const errors = [];
  const preconditions = record?.preconditions;

  if (!isPlainObject(preconditions)) {
    return [`${command}: preconditions must be an object`];
  }

  for (const field of PRECONDITION_FIELDS) {
    if (typeof preconditions[field] !== "string" || preconditions[field].trim().length === 0) {
      errors.push(`${command}: preconditions.${field} must be a non-empty string`);
    }
  }

  return errors;
}

function validateRegisterPolicy(record, command) {
  const errors = [];
  const policy = record?.registerPolicy;

  if (!isPlainObject(policy)) {
    return [`${command}: registerPolicy must be an object`];
  }

  for (const field of REGISTER_POLICY_FIELDS) {
    if (!Object.hasOwn(policy, field)) {
      errors.push(`${command}: registerPolicy.${field} is required`);
    }
  }

  if (!isNonEmptyStringArray(policy.accepted)) {
    errors.push(`${command}: registerPolicy.accepted must be a non-empty string array`);
  } else {
    const accepted = new Set(policy.accepted);
    for (const posture of ["brand", "product"]) {
      if (!accepted.has(posture)) {
        errors.push(`${command}: registerPolicy.accepted must include ${posture}`);
      }
    }
  }

  if (typeof policy.default !== "string" || policy.default.trim().length === 0) {
    errors.push(`${command}: registerPolicy.default must be a non-empty string`);
  } else if (policy.default !== "auto") {
    errors.push(`${command}: registerPolicy.default must be auto`);
  }

  if (!isNonEmptyStringArray(policy.resolutionOrder)) {
    errors.push(`${command}: registerPolicy.resolutionOrder must be a non-empty string array`);
  }

  if (typeof policy.askWhen !== "string" || policy.askWhen.trim().length === 0) {
    errors.push(`${command}: registerPolicy.askWhen must be a non-empty string`);
  }

  if (!isNonEmptyStringArray(policy.proofFields)) {
    errors.push(`${command}: registerPolicy.proofFields must be a non-empty string array`);
  } else if (!policy.proofFields.includes("register")) {
    errors.push(`${command}: registerPolicy.proofFields must include register`);
  }

  return errors;
}

function validateDiscriminator(record, command, workflowModes) {
  const errors = [];
  const discriminator = record?.discriminator;
  const commandSet = commandSetForModes(workflowModes);
  const expectedSiblings = new Set([...commandSet].filter((sibling) => sibling !== command));

  if (!isPlainObject(discriminator)) {
    return [`${command}: discriminator must be an object`];
  }

  if (typeof discriminator.whenToUse !== "string" || discriminator.whenToUse.trim().length === 0) {
    errors.push(`${command}: discriminator.whenToUse must be a non-empty string`);
  }

  if (typeof discriminator.pairWithHubWhen !== "string" || discriminator.pairWithHubWhen.trim().length === 0) {
    errors.push(`${command}: discriminator.pairWithHubWhen must be a non-empty string`);
  } else if (discriminator.pairWithHubWhen !== record?.deferToHubWhen) {
    errors.push(`${command}: discriminator.pairWithHubWhen must match deferToHubWhen`);
  }

  if (!Array.isArray(discriminator.preferSiblingWhen) || discriminator.preferSiblingWhen.length === 0) {
    errors.push(`${command}: discriminator.preferSiblingWhen must be a non-empty array`);
  } else {
    const seenSiblings = new Set();

    discriminator.preferSiblingWhen.forEach((entry, index) => {
      const label = `${command}: discriminator.preferSiblingWhen[${index}]`;

      if (!isPlainObject(entry)) {
        errors.push(`${label} must be an object`);
        return;
      }

      if (typeof entry.sibling !== "string" || entry.sibling.trim().length === 0) {
        errors.push(`${label}.sibling must be a non-empty string`);
      } else {
        if (!commandSet.has(entry.sibling)) {
          errors.push(`${label}.sibling must be one of ${[...commandSet].sort().join(",")}`);
        }

        if (entry.sibling === command) {
          errors.push(`${label}.sibling must not reference its own command`);
        }

        if (seenSiblings.has(entry.sibling)) {
          errors.push(`${label}.sibling is duplicated`);
        }

        seenSiblings.add(entry.sibling);
      }

      if (typeof entry.when !== "string" || entry.when.trim().length === 0) {
        errors.push(`${label}.when must be a non-empty string`);
      }
    });

    if (!sameSet(seenSiblings, expectedSiblings)) {
      errors.push(`${command}: discriminator.preferSiblingWhen must cover exactly ${[...expectedSiblings].sort().join(",")}`);
    }
  }

  errors.push(...validateDiscriminatorSequence(record, command, discriminator.sequence, commandSet));

  return errors;
}

function validateDiscriminatorSequence(record, command, sequence, commandSet) {
  const errors = [];

  if (!isPlainObject(sequence)) {
    return [`${command}: discriminator.sequence must be an object`];
  }

  for (const field of ["typicallyAfter", "typicallyBefore"]) {
    if (!isStringArray(sequence[field])) {
      errors.push(`${command}: discriminator.sequence.${field} must be a string array`);
      continue;
    }

    for (const item of sequence[field]) {
      if (!commandSet.has(item)) {
        errors.push(`${command}: discriminator.sequence.${field} contains unknown command ${item}`);
      }

      if (item === command) {
        errors.push(`${command}: discriminator.sequence.${field} must not reference its own command`);
      }
    }
  }

  if (isStringArray(sequence.typicallyBefore) && Array.isArray(record?.next)) {
    const nextSet = new Set(record.next);
    for (const item of sequence.typicallyBefore) {
      if (!nextSet.has(item)) {
        errors.push(`${command}: discriminator.sequence.typicallyBefore must be a subset of next`);
      }
    }
  }

  return errors;
}

function validateExamples(record, command) {
  const errors = [];

  if (!Array.isArray(record?.examples) || record.examples.length === 0) {
    return [`${command}: examples must be a non-empty array`];
  }

  record.examples.forEach((example, index) => {
    const label = `${command}: examples[${index}]`;

    if (!isPlainObject(example)) {
      errors.push(`${label} must be an object`);
      return;
    }

    if (typeof example.invocation !== "string" || example.invocation.trim().length === 0) {
      errors.push(`${label}.invocation must be a non-empty string`);
    } else if (firstToken(example.invocation) !== command) {
      errors.push(`${label}.invocation must start with ${command}`);
    }

    if (typeof example.returnsArtifact !== "string" || example.returnsArtifact.trim().length === 0) {
      errors.push(`${label}.returnsArtifact must be a non-empty string`);
    }
  });

  return errors;
}

function validateOutputContract(record, command) {
  const errors = [];
  const contract = record?.outputContract;

  if (!isPlainObject(contract)) {
    return [`${command}: outputContract must be an object`];
  }

  if (typeof contract.primaryArtifactName !== "string" || contract.primaryArtifactName.trim().length === 0) {
    errors.push(`${command}: outputContract.primaryArtifactName must be a non-empty string`);
  } else if (isGenericArtifactName(contract.primaryArtifactName)) {
    errors.push(`${command}: outputContract.primaryArtifactName must name a concrete artifact`);
  }

  if (typeof contract.artifactKind !== "string" || !ARTIFACT_KINDS.has(contract.artifactKind)) {
    errors.push(`${command}: outputContract.artifactKind must be one of ${[...ARTIFACT_KINDS].join(",")}`);
  }

  if (!isNonEmptyStringArray(contract.requiredFields)) {
    errors.push(`${command}: outputContract.requiredFields must be a non-empty string array`);
  }

  if (!isStringArray(contract.fileOutputs)) {
    errors.push(`${command}: outputContract.fileOutputs must be a string array`);
  }

  if (Array.isArray(record?.proofFields) && Array.isArray(contract.requiredFields) && !sameValue(record.proofFields, contract.requiredFields)) {
    errors.push(`${command}: outputContract.requiredFields must match proofFields`);
  }

  if (typeof record?.toolPolicy?.mutatesWorkspace === "boolean" && Array.isArray(contract.fileOutputs)) {
    const hasFileOutputs = contract.fileOutputs.length > 0;

    if (record.toolPolicy.mutatesWorkspace && !hasFileOutputs) {
      errors.push(`${command}: outputContract.fileOutputs must be non-empty when toolPolicy.mutatesWorkspace is true`);
    }

    if (!record.toolPolicy.mutatesWorkspace && hasFileOutputs) {
      errors.push(`${command}: outputContract.fileOutputs must be empty when toolPolicy.mutatesWorkspace is false`);
    }
  }

  return errors;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyStringArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === "string" && item.length > 0);
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.length > 0);
}

function isGenericArtifactName(value) {
  const normalized = value.trim().toLowerCase();

  if (GENERIC_ARTIFACT_NAMES.has(normalized)) {
    return true;
  }

  const words = normalized.split(/[^a-z0-9]+/).filter(Boolean);
  return words.length > 0 && words.every((word) => GENERIC_ARTIFACT_NAMES.has(word));
}

async function collectSurfaceDrift(records) {
  const drift = [];

  for (const record of records) {
    const wrapperPath = wrapperPathForCommand(record.command);
    let markdown;
    let frontmatter;

    try {
      markdown = await readFile(wrapperPath.url, "utf8");
      frontmatter = parseFrontmatter(markdown);
    } catch (error) {
      drift.push({
        command: record.command,
        field: "wrapper",
        expected: wrapperPath.relativePath,
        actual: error instanceof Error ? error.message : String(error)
      });
      continue;
    }

    for (const field of FRONTMATTER_DRIFT_FIELDS) {
      const expected = expectedFrontmatterValue(record, field);
      const actual = frontmatter[field];
      const isGenericArgumentHint = field === "argument-hint" && actual === GENERIC_ARGUMENT_HINT;

      if (isGenericArgumentHint || !sameValue(expected, actual)) {
        drift.push({
          command: record.command,
          field,
          expected,
          actual: Object.hasOwn(frontmatter, field) ? actual : "<missing>"
        });
      }
    }

    const deliverableDrift = expectedEmitDeliverableDrift(record, markdown);
    if (deliverableDrift) {
      drift.push(deliverableDrift);
    }

    drift.push(...expectedExampleDrift(record, markdown, wrapperPath));
    drift.push(...expectedDiscriminatorDrift(record, markdown));
    drift.push(...expectedPreconditionsDrift(record, markdown));
    drift.push(...expectedRegisterDrift(record, markdown));
  }

  return drift.sort(compareDrift);
}

function expectedRegisterDrift(record, markdown) {
  const section = extractRegisterSection(markdown);

  if (!section) {
    return [
      {
        kind: "register",
        command: record.command,
        field: "register",
        expected: REGISTER_SECTION_START,
        actual: "<missing section>"
      }
    ];
  }

  const drift = [];
  const lowerSection = section.toLowerCase();

  if (!section.includes("--register")) {
    drift.push({
      kind: "register",
      command: record.command,
      field: "register",
      expected: "--register",
      actual: "<missing flag token>"
    });
  }

  for (const posture of ["brand", "product"]) {
    if (!lowerSection.includes(posture)) {
      drift.push({
        kind: "register",
        command: record.command,
        field: "register",
        expected: posture,
        actual: "<missing posture token>"
      });
    }
  }

  if (!section.includes("STATUS=ASK MISSING_REGISTER")) {
    drift.push({
      kind: "register",
      command: record.command,
      field: "register",
      expected: "STATUS=ASK MISSING_REGISTER",
      actual: "<missing ask token>"
    });
  }

  for (const dial of record.registerPolicy.proofFields) {
    if (!section.includes(dial)) {
      drift.push({
        kind: "register",
        command: record.command,
        field: "register",
        expected: dial,
        actual: "<missing dial token>"
      });
    }
  }

  return drift;
}

function expectedPreconditionsDrift(record, markdown) {
  const drift = [];
  const section = extractPreconditionsSection(markdown);

  if (!section) {
    return [
      {
        command: record.command,
        field: "preconditions",
        expected: "## PRECONDITIONS",
        actual: "<missing section>"
      }
    ];
  }

  for (const marker of PRECONDITION_SECTION_MARKERS) {
    if (!section.includes(marker)) {
      drift.push({
        command: record.command,
        field: "preconditions",
        expected: marker,
        actual: "<missing marker>"
      });
    }
  }

  if (STATUS_ONLY_FAILURE_PATTERN.test(markdown)) {
    drift.push({
      command: record.command,
      field: "preconditions",
      expected: "named failure cause",
      actual: "STATUS=FAIL ERROR=\"<message>\""
    });
  }

  for (const token of REQUIRED_RETURN_STATUS_TOKENS) {
    if (!markdown.includes(token)) {
      drift.push({
        command: record.command,
        field: "preconditions",
        expected: token,
        actual: "<missing return-status token>"
      });
    }
  }

  return drift;
}

function expectedDiscriminatorDrift(record, markdown) {
  const section = extractSiblingDiscriminatorSection(markdown);

  if (!section) {
    return [
      {
        kind: "discriminator",
        command: record.command,
        field: "sibling-discriminator",
        expected: SIBLING_DISCRIMINATOR_START,
        actual: "<missing section>"
      }
    ];
  }

  const drift = [];
  const expectedSiblings = record.discriminator.preferSiblingWhen.map((entry) => entry.sibling).sort();

  for (const sibling of expectedSiblings) {
    if (!section.includes(sibling)) {
      drift.push({
        kind: "discriminator",
        command: record.command,
        field: "sibling-discriminator",
        expected: sibling,
        actual: "<missing sibling token>"
      });
    }
  }

  if (!hasHubLine(section)) {
    drift.push({
      kind: "discriminator",
      command: record.command,
      field: "sibling-discriminator",
      expected: "sk-design hub line",
      actual: "<missing hub line>"
    });
  }

  return drift;
}

function expectedEmitDeliverableDrift(record, markdown) {
  const section = extractEmitDeliverableSection(markdown);

  if (!section) {
    return {
      command: record.command,
      field: "emit-deliverable",
      expected: record.outputContract.primaryArtifactName,
      actual: "<missing section>"
    };
  }

  if (!section.includes(record.outputContract.primaryArtifactName)) {
    return {
      command: record.command,
      field: "emit-deliverable",
      expected: record.outputContract.primaryArtifactName,
      actual: "<missing artifact name>"
    };
  }

  return null;
}

function expectedExampleDrift(record, markdown, wrapperPath) {
  const drift = [];
  const section = extractExampleSection(markdown);
  const [example] = record.examples;

  if (!section) {
    return [
      {
        command: record.command,
        field: "example",
        expected: "## Example",
        actual: "<missing section>"
      }
    ];
  }

  const invocation = extractFirstFencedInvocation(section);
  if (invocation !== example.invocation) {
    drift.push({
      command: record.command,
      field: "example-invocation",
      expected: example.invocation,
      actual: invocation ?? "<missing>"
    });
  }

  if (invocation && firstToken(invocation) !== wrapperPath.commandPrefix) {
    drift.push({
      command: record.command,
      field: "example-prefix",
      expected: wrapperPath.commandPrefix,
      actual: firstToken(invocation)
    });
  }

  const returnsArtifact = extractReturnsArtifact(section);
  if (returnsArtifact !== example.returnsArtifact) {
    drift.push({
      command: record.command,
      field: "returns",
      expected: example.returnsArtifact,
      actual: returnsArtifact ?? "<missing>"
    });
  }

  return drift;
}

function extractEmitDeliverableSection(markdown) {
  const sectionMatch = markdown.match(/^##\s+\d+\.\s+EMIT DELIVERABLE\s*$/im);
  if (!sectionMatch || typeof sectionMatch.index !== "number") {
    return null;
  }

  const bodyStart = sectionMatch.index + sectionMatch[0].length;
  const nextSection = markdown.slice(bodyStart).search(/\r?\n##\s+\d+\./);
  return nextSection === -1 ? markdown.slice(bodyStart) : markdown.slice(bodyStart, bodyStart + nextSection);
}

function extractExampleSection(markdown) {
  const sectionMatch = markdown.match(/^##\s+(?:\d+\.\s+)?Example\b.*$/im);
  if (!sectionMatch || typeof sectionMatch.index !== "number") {
    return null;
  }

  const bodyStart = sectionMatch.index + sectionMatch[0].length;
  const nextSection = markdown.slice(bodyStart).search(/\r?\n##\s+/);
  return nextSection === -1 ? markdown.slice(bodyStart) : markdown.slice(bodyStart, bodyStart + nextSection);
}

function extractFirstFencedInvocation(section) {
  const fenceMatch = section.match(/```[^\r\n]*\r?\n([\s\S]*?)\r?\n```/);
  if (!fenceMatch) {
    return null;
  }

  return fenceMatch[1].split(/\r?\n/).map((line) => line.trim()).find(Boolean) ?? null;
}

function extractReturnsArtifact(section) {
  const returnsMatch = section.match(/^Returns:\s*(.+)$/im);
  return returnsMatch ? returnsMatch[1].trim() : null;
}

function extractPreconditionsSection(markdown) {
  const sectionMatch = markdown.match(/^##\s+(?:\d+\.\s+)?PRECONDITIONS\s*$/im);
  if (!sectionMatch || typeof sectionMatch.index !== "number") {
    return null;
  }

  const bodyStart = sectionMatch.index + sectionMatch[0].length;
  const nextSection = markdown.slice(bodyStart).search(/\r?\n##\s+/);
  return nextSection === -1 ? markdown.slice(bodyStart) : markdown.slice(bodyStart, bodyStart + nextSection);
}

function extractSiblingDiscriminatorSection(markdown) {
  const start = markdown.indexOf(SIBLING_DISCRIMINATOR_START);
  const end = markdown.indexOf(SIBLING_DISCRIMINATOR_END);

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  return markdown.slice(start + SIBLING_DISCRIMINATOR_START.length, end);
}

function extractRegisterSection(markdown) {
  const start = markdown.indexOf(REGISTER_SECTION_START);
  const end = markdown.indexOf(REGISTER_SECTION_END);

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  return markdown.slice(start + REGISTER_SECTION_START.length, end);
}

function hasHubLine(section) {
  return section
    .split(/\r?\n/)
    .some((line) => line.includes("sk-design") && /\bhub\b/i.test(line));
}

function wrapperPathForCommand(command) {
  const name = command.replace("/design:", "");
  const relativePath = `.opencode/commands/design/${name}.md`;
  return {
    commandPrefix: `/design:${name}`,
    relativePath,
    url: new URL(`${name}.md`, commandsRootUrl)
  };
}

function expectedFrontmatterValue(record, field) {
  switch (field) {
    case "description":
      return record.description;
    case "argument-hint":
      return record.argumentHint;
    case "aliases":
      return record.aliases;
    case "allowed-tools":
      return record.toolPolicy.mutatesWorkspace ? MUTATING_TOOLS : READ_ONLY_TOOLS;
    default:
      throw new Error(`unknown drift field: ${field}`);
  }
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    throw new Error("missing frontmatter");
  }

  return parseYamlSubset(match[1]);
}

function parseYamlSubset(source) {
  const result = {};
  const lines = source.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim() || line.trimStart().startsWith("#")) {
      continue;
    }

    const keyValue = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);
    if (!keyValue) {
      continue;
    }

    const [, key, rawValue = ""] = keyValue;

    if (rawValue.length > 0) {
      result[key] = parseScalarOrArray(key, rawValue.trim());
      continue;
    }

    const values = [];
    while (index + 1 < lines.length) {
      const nextLine = lines[index + 1];
      const listItem = nextLine.match(/^\s*-\s+(.*)$/);
      if (!listItem) {
        break;
      }
      values.push(unquote(listItem[1].trim()));
      index += 1;
    }
    result[key] = values;
  }

  return normalizeFrontmatter(result);
}

function parseScalarOrArray(key, value) {
  const unquoted = unquote(value);

  if (unquoted.startsWith("[") && unquoted.endsWith("]")) {
    const inner = unquoted.slice(1, -1).trim();
    return inner.length === 0 ? [] : inner.split(",").map((item) => unquote(item.trim()));
  }

  if (["aliases", "allowed-tools"].includes(key) && value.includes(",")) {
    return value.split(",").map((item) => unquote(item.trim()));
  }

  return unquoted;
}

function normalizeFrontmatter(frontmatter) {
  const normalized = { ...frontmatter };

  if (Object.hasOwn(normalized, "allowed-tools") && typeof normalized["allowed-tools"] === "string") {
    normalized["allowed-tools"] = normalized["allowed-tools"].split(",").map((item) => item.trim()).filter(Boolean);
  }

  return normalized;
}

function firstToken(value) {
  return value.trim().split(/\s+/)[0] ?? "";
}

function unquote(value) {
  const quote = value[0];
  if ((quote === "\"" || quote === "'") && value[value.length - 1] === quote) {
    return value.slice(1, -1);
  }
  return value;
}

function sameValue(expected, actual) {
  if (Array.isArray(expected) || Array.isArray(actual)) {
    return Array.isArray(expected)
      && Array.isArray(actual)
      && expected.length === actual.length
      && expected.every((item, index) => item === actual[index]);
  }

  return expected === actual;
}

function sameSet(left, right) {
  if (left.size !== right.size) {
    return false;
  }

  for (const item of left) {
    if (!right.has(item)) {
      return false;
    }
  }

  return true;
}

function commandSetForModes(workflowModes) {
  return new Set([...workflowModes].map((workflowMode) => `/design:${workflowMode}`));
}

function compareDrift(left, right) {
  const commandCompare = left.command.localeCompare(right.command);
  if (commandCompare !== 0) {
    return commandCompare;
  }

  const leftIndex = DRIFT_SORT_FIELDS.indexOf(left.field);
  const rightIndex = DRIFT_SORT_FIELDS.indexOf(right.field);
  const fieldCompare = normalizeSortIndex(leftIndex) - normalizeSortIndex(rightIndex);

  if (fieldCompare !== 0) {
    return fieldCompare;
  }

  return left.field.localeCompare(right.field);
}

function normalizeSortIndex(index) {
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function emitAndExit(report, exitCode) {
  if (jsonMode) {
    console.log(JSON.stringify(report, null, 2));
    process.exit(exitCode);
  }

  console.log(formatTextReport(report));
  process.exit(exitCode);
}

function formatTextReport(report) {
  const lines = [`STATUS=${report.status.toUpperCase()} STAGE=${report.stage}`];

  if (report.errors?.length) {
    for (const error of report.errors) {
      lines.push(`INVALID ${error}`);
    }
    lines.push(`SUMMARY invalid=${report.errors.length} drift=0`);
    return lines.join("\n");
  }

  if (report.metadata) {
    lines.push(
      `METADATA commands=${report.metadata.commandCount} aliases=${report.metadata.aliasCount} workflowModes=${report.metadata.workflowModes.join(",")}`
    );
  }

  for (const item of report.drift ?? []) {
    const kind = item.kind ? ` kind=${item.kind}` : "";
    lines.push(
      `DRIFT${kind} ${item.command} ${item.field} expected=${formatValue(item.expected)} actual=${formatValue(item.actual)}`
    );
  }

  lines.push(`SUMMARY invalid=0 drift=${report.drift?.length ?? 0}`);
  return lines.join("\n");
}

function formatValue(value) {
  if (Array.isArray(value)) {
    return `[${value.join(",")}]`;
  }
  return JSON.stringify(value);
}
