// ============================================================================
// Design Command Surface Check
// ============================================================================

import { readFile } from "node:fs/promises";

const REQUIRED_FIELDS = [
  "command",
  "ownerMode",
  "description",
  "descriptionRole",
  "autoTriggerEligible",
  "hubKeywordProjection",
  "argumentHint",
  "argumentGrammar",
  "choreography",
  "aliases",
  "userIntent",
  "copyGuard",
  "accepts",
  "returns",
  "examples",
  "next",
  "handoff",
  "proofFields",
  "taskProjections",
  "pipeline",
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
  "user-intent",
  "sibling-discriminator",
  "task-lanes",
  "taskProjections",
  "preconditions",
  "pipeline",
  "handoff",
  "choreography",
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
const PIPELINE_FIELDS = ["stage", "acceptsFrom", "produces", "nextCommands", "proofRequired"];
const PIPELINE_SECTION_MARKERS = [
  "Stage:",
  "Accepts from:",
  "Produces:",
  "Hands to next",
  "Hands to build:",
  "Recommend-only:"
];
const PIPELINE_STATUS_TOKENS = ["PRODUCES=", "NEXT=", "PROOF="];
const HANDOFF_OPTION_FIELDS = ["command", "when"];
const HANDOFF_STATUS_TOKENS = ["NEXT_OPTIONS=", "HANDOFF_REQUIRED=", "HANDOFF_REASON="];
const REQUIRED_RETURN_STATUS_TOKENS = [
  "STATUS=OK",
  "STATUS=ASK MISSING=<input>",
  "STATUS=FAIL ERROR=<named-cause>",
  "STATUS=DEFER ROUTE="
];
const STATUS_ONLY_FAILURE_PATTERN = /STATUS=FAIL\s+ERROR="<message>"/;
const ARTIFACT_KINDS = new Set(["report", "plan", "spec", "reference-doc"]);
const INTERFACE_COMMAND = "/design:interface";
const INTERFACE_AUDIT_ROUTE = "/design:audit";
const INTERFACE_TASK_CLASSES = new Set(["sibling-command", "argument", "internal", "hidden"]);
const TASK_PROJECTION_STRICTNESS = new Set(["advisory"]);
const TASK_PROJECTION_FIELDS = ["verb", "ownerMode", "strictness", "referenceSources", "requires", "fixtures"];
const TASK_PROJECTIONS_NEGATIVE_CORPUS_MARKER = "Negative corpus:";
const ARGUMENT_GRAMMAR_POSITIONAL_FIELDS = ["name", "required", "kind"];
const ARGUMENT_GRAMMAR_FLAG_FIELDS = ["name", "required", "takesValue", "kind"];
const CHOREOGRAPHY_FIELDS = ["order", "skill", "resource", "action"];
const DESIGN_COMMAND_PATTERN = /\/design:[a-z-]+/;
const DESCRIPTION_ROLES = new Set(["hub-keyword-projection"]);
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
const interfaceSkillUrl = new URL("design-interface/SKILL.md", skillRootUrl);
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
  const [metadata, registry, interfaceSkillSource] = await Promise.all([
    readJson(metadataUrl),
    readJson(registryUrl),
    readFile(interfaceSkillUrl, "utf8")
  ]);
  const workflowModes = readWorkflowModes(registry);
  const registryAliasesByMode = readRegistryAliasesByMode(registry);
  const interfaceIntentLanes = parseInterfaceIntentSignalKeys(interfaceSkillSource);
  const metadataErrors = [
    ...validateInterfaceIntentSignalKeys(interfaceIntentLanes),
    ...validateMetadata(metadata, workflowModes, interfaceIntentLanes, registryAliasesByMode)
  ];

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

function readRegistryAliasesByMode(registry) {
  const aliasesByMode = new Map();

  if (!registry || !Array.isArray(registry.modes)) {
    return aliasesByMode;
  }

  for (const mode of registry.modes) {
    if (typeof mode?.workflowMode !== "string" || mode.workflowMode.length === 0) {
      continue;
    }

    aliasesByMode.set(
      mode.workflowMode,
      Array.isArray(mode.aliases) ? mode.aliases.filter((alias) => typeof alias === "string") : []
    );
  }

  return aliasesByMode;
}

function validateMetadata(metadata, workflowModes, interfaceIntentLanes, registryAliasesByMode) {
  const errors = [];

  if (!Array.isArray(metadata)) {
    return ["metadata root must be an array"];
  }

  const seenCommands = new Map();
  const expectedCommands = new Set(COMMANDS);
  const seenAliases = new Map();
  const seenTaskProjectionVerbs = new Map();
  const workflowCommandSet = commandSetForModes(workflowModes);

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

    errors.push(...validateDescriptionRoleProjection(record, command));
    errors.push(...validateArgumentGrammar(record, command));
    errors.push(...validateChoreography(record, command));
    errors.push(...validateUserIntent(record, command));

    if (typeof record?.toolPolicy?.mutatesWorkspace !== "boolean") {
      errors.push(`${command}: toolPolicy.mutatesWorkspace must be a boolean`);
    }

    errors.push(...validatePreconditions(record, command));
    errors.push(...validateRegisterPolicy(record, command));
    errors.push(...validateExamples(record, command));
    errors.push(...validateOutputContract(record, command));
    errors.push(...validateDiscriminator(record, command, workflowModes));
    errors.push(...validatePipeline(record, command, expectedCommands));
    errors.push(...validateHandoff(record, command, expectedCommands));
    errors.push(
      ...validateTaskProjections(
        record,
        command,
        workflowModes,
        expectedCommands,
        workflowCommandSet,
        seenTaskProjectionVerbs,
        registryAliasesByMode
      )
    );

    if (command === INTERFACE_COMMAND) {
      errors.push(...validateInterfaceTasks(record, command, interfaceIntentLanes, expectedCommands));
    }

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

  errors.push(...validatePipelineGraph(seenCommands));

  return errors.sort();
}

function validateDescriptionRoleProjection(record, command) {
  const errors = [];

  if (typeof record?.descriptionRole !== "string" || record.descriptionRole.trim().length === 0) {
    errors.push(`${command}: descriptionRole must be a non-empty string`);
  } else if (!DESCRIPTION_ROLES.has(record.descriptionRole)) {
    errors.push(`${command}: descriptionRole must be one of ${[...DESCRIPTION_ROLES].join(",")}`);
  }

  if (record?.autoTriggerEligible !== false) {
    errors.push(`${command}: autoTriggerEligible must be the boolean false`);
  }

  if (!isNonEmptyStringArray(record?.hubKeywordProjection)) {
    errors.push(`${command}: hubKeywordProjection must be a non-empty string array`);
  } else {
    const description = typeof record?.description === "string" ? record.description : "";

    for (const token of record.hubKeywordProjection) {
      if (!containsPhrase(description, token)) {
        errors.push(`${command}: hubKeywordProjection token "${token}" must be a substring of description`);
      }
    }
  }

  const ownerMode = typeof record?.ownerMode === "string" ? record.ownerMode : "<missing>";
  const expectedSuffix = `sk-design ${ownerMode} mode.`;

  if (typeof record?.description !== "string" || !record.description.endsWith(expectedSuffix)) {
    errors.push(`${command}: description must end with ${expectedSuffix}`);
  }

  return errors;
}

function validateArgumentGrammar(record, command) {
  const errors = [];
  const grammar = record?.argumentGrammar;

  if (!isPlainObject(grammar)) {
    return [`${command}: argumentGrammar must be an object`];
  }

  if (typeof grammar.render !== "string" || grammar.render.trim().length === 0) {
    errors.push(`${command}: argumentGrammar.render must be a non-empty string`);
  } else if (grammar.render !== record?.argumentHint) {
    errors.push(`${command}: argumentGrammar.render must match argumentHint`);
  }

  if (!Array.isArray(grammar.positional) || grammar.positional.length === 0) {
    errors.push(`${command}: argumentGrammar.positional must be a non-empty array`);
  } else {
    grammar.positional.forEach((token, index) => {
      const label = `${command}: argumentGrammar.positional[${index}]`;

      if (!isPlainObject(token)) {
        errors.push(`${label} must be an object`);
        return;
      }

      for (const field of ARGUMENT_GRAMMAR_POSITIONAL_FIELDS) {
        if (!Object.hasOwn(token, field)) {
          errors.push(`${label}.${field} is required`);
        }
      }

      if (typeof token.name !== "string" || !/^[a-z][a-z0-9-]*$/.test(token.name)) {
        errors.push(`${label}.name must use lowercase letters, numbers, and hyphens`);
      }

      if (token.required !== true && token.required !== false) {
        errors.push(`${label}.required must be a boolean`);
      }

      if (typeof token.kind !== "string" || token.kind.trim().length === 0) {
        errors.push(`${label}.kind must be a non-empty string`);
      }
    });
  }

  if (!Array.isArray(grammar.flags)) {
    errors.push(`${command}: argumentGrammar.flags must be an array`);
  } else {
    grammar.flags.forEach((flag, index) => {
      const label = `${command}: argumentGrammar.flags[${index}]`;

      if (!isPlainObject(flag)) {
        errors.push(`${label} must be an object`);
        return;
      }

      for (const field of ARGUMENT_GRAMMAR_FLAG_FIELDS) {
        if (!Object.hasOwn(flag, field)) {
          errors.push(`${label}.${field} is required`);
        }
      }

      if (typeof flag.name !== "string" || !/^--[a-z][a-z0-9-]*$/.test(flag.name)) {
        errors.push(`${label}.name must be a long flag such as --scope`);
      }

      if (flag.required !== true && flag.required !== false) {
        errors.push(`${label}.required must be a boolean`);
      }

      if (flag.takesValue !== true && flag.takesValue !== false) {
        errors.push(`${label}.takesValue must be a boolean`);
      }

      if (typeof flag.kind !== "string" || flag.kind.trim().length === 0) {
        errors.push(`${label}.kind must be a non-empty string`);
      }

      if (flag.takesValue === true && (typeof flag.valueName !== "string" || flag.valueName.trim().length === 0)) {
        errors.push(`${label}.valueName must be a non-empty string when takesValue is true`);
      }
    });
  }

  return errors;
}

function validateChoreography(record, command) {
  const errors = [];
  const choreography = record?.choreography;

  if (!Array.isArray(choreography) || choreography.length === 0) {
    return [`${command}: choreography must be a non-empty array`];
  }

  const orders = [];
  const seenOrders = new Set();

  choreography.forEach((step, index) => {
    const label = `${command}: choreography[${index}]`;

    if (!isPlainObject(step)) {
      errors.push(`${label} must be an object`);
      return;
    }

    for (const field of CHOREOGRAPHY_FIELDS) {
      if (!Object.hasOwn(step, field)) {
        errors.push(`${label}.${field} is required`);
      }
    }

    if (!Number.isInteger(step.order) || step.order < 1) {
      errors.push(`${label}.order must be a positive integer`);
    } else {
      orders.push(step.order);

      if (seenOrders.has(step.order)) {
        errors.push(`${label}.order ${step.order} is duplicated`);
      }

      seenOrders.add(step.order);
    }

    for (const field of ["skill", "resource", "action"]) {
      if (typeof step[field] !== "string" || step[field].trim().length === 0) {
        errors.push(`${label}.${field} must be a non-empty string`);
      }
    }
  });

  const sortedOrders = [...orders].sort((left, right) => left - right);
  sortedOrders.forEach((order, index) => {
    const expectedOrder = index + 1;
    if (order !== expectedOrder) {
      errors.push(`${command}: choreography orders must be contiguous from 1`);
    }
  });

  return errors;
}

function parseInterfaceIntentSignalKeys(source) {
  const blockMatch = source.match(/^INTENT_SIGNALS\s*=\s*\{([\s\S]*?)^}\s*$/m);
  if (!blockMatch) {
    return [];
  }

  return [...blockMatch[1].matchAll(/^\s+"([A-Z_]+)"\s*:/gm)].map((match) => match[1]);
}

function validateInterfaceIntentSignalKeys(keys) {
  if (keys.length === 0) {
    return [`${INTERFACE_COMMAND}: interface router INTENT_SIGNALS block must expose at least one lane`];
  }

  const duplicates = duplicateValues(keys);
  if (duplicates.length > 0) {
    return [`${INTERFACE_COMMAND}: interface router INTENT_SIGNALS contains duplicate lanes [${duplicates.join(",")}]`];
  }

  return [];
}

function validateInterfaceTasks(record, command, interfaceIntentLanes, commandSet) {
  const errors = [];
  const tasks = record?.tasks;

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return [`${command}: tasks must be a non-empty array`];
  }

  const expectedLanes = interfaceIntentLanes;
  const expectedLaneSet = new Set(expectedLanes);
  const actualLanes = [];

  tasks.forEach((task, index) => {
    const label = `${command}: tasks[${index}]`;

    if (!isPlainObject(task)) {
      errors.push(`${label} must be an object`);
      return;
    }

    for (const field of ["lane", "label", "class", "surface"]) {
      if (typeof task[field] !== "string" || task[field].trim().length === 0) {
        errors.push(`${label}.${field} must be a non-empty string`);
      }
    }

    if (typeof task.lane === "string" && task.lane.trim().length > 0) {
      actualLanes.push(task.lane);

      if (commandSet.has(task.lane)) {
        errors.push(`${label}.lane must not be promoted into the /design:* command set`);
      }
    }

    if (typeof task.class === "string" && !INTERFACE_TASK_CLASSES.has(task.class)) {
      errors.push(`${label}.class must be one of ${[...INTERFACE_TASK_CLASSES].join(",")}`);
    }

    if (
      typeof task.class === "string"
      && task.class !== "argument"
      && typeof task.surface === "string"
      && DESIGN_COMMAND_PATTERN.test(task.surface)
    ) {
      errors.push(`${label}.surface must not name a /design:* command unless class is argument`);
    }
  });

  const duplicateLanes = duplicateValues(actualLanes);
  for (const lane of duplicateLanes) {
    errors.push(`${command}: tasks lane ${lane} is duplicated`);
  }

  const actualLaneSet = new Set(actualLanes);
  const missingLanes = expectedLanes.filter((lane) => !actualLaneSet.has(lane));
  const extraLanes = [...actualLaneSet].filter((lane) => !expectedLaneSet.has(lane)).sort();

  if (missingLanes.length > 0 || extraLanes.length > 0) {
    errors.push(
      `${command}: tasks lane set must match interface INTENT_SIGNALS missing=[${missingLanes.join(",")}] extra=[${extraLanes.join(",")}]`
    );
  }

  return errors;
}

function validateTaskProjections(
  record,
  command,
  workflowModes,
  expectedCommands,
  workflowCommandSet,
  seenVerbs,
  registryAliasesByMode
) {
  const errors = [];
  const projections = record?.taskProjections;

  if (!Array.isArray(projections)) {
    return [`${command}: taskProjections must be an array`];
  }

  projections.forEach((projection, index) => {
    const label = `${command}: taskProjections[${index}]`;

    if (!isPlainObject(projection)) {
      errors.push(`${label} must be an object`);
      return;
    }

    for (const field of TASK_PROJECTION_FIELDS) {
      if (!Object.hasOwn(projection, field)) {
        errors.push(`${label}.${field} is required`);
      }
    }

    const verb = typeof projection.verb === "string" ? projection.verb.trim() : "";
    if (verb.length === 0) {
      errors.push(`${label}.verb must be a non-empty string`);
    } else {
      if (projection.verb !== verb || !/^[a-z][a-z-]*$/.test(verb)) {
        errors.push(`${label}.verb must use lowercase letters and hyphens`);
      }

      const priorOwner = seenVerbs.get(verb);
      if (priorOwner) {
        errors.push(`${label}.verb ${verb} is already owned by ${priorOwner}`);
      } else {
        seenVerbs.set(verb, command);
      }

      const projectedCommand = `/design:${verb}`;
      if (expectedCommands.has(projectedCommand) || workflowCommandSet.has(projectedCommand)) {
        errors.push(`${label}.verb ${verb} must not be minted as ${projectedCommand}`);
      }

      errors.push(...validateTaskProjectionAliasCollisions(label, record?.ownerMode, verb, registryAliasesByMode));
    }

    if (typeof projection.ownerMode !== "string" || projection.ownerMode.trim().length === 0) {
      errors.push(`${label}.ownerMode must be a non-empty string`);
    } else {
      if (projection.ownerMode !== record?.ownerMode) {
        errors.push(`${label}.ownerMode must match record ownerMode ${record?.ownerMode ?? "<missing>"}`);
      }

      if (!workflowModes.has(projection.ownerMode)) {
        errors.push(`${label}.ownerMode must match a workflowMode`);
      }
    }

    if (typeof projection.strictness !== "string" || !TASK_PROJECTION_STRICTNESS.has(projection.strictness)) {
      errors.push(`${label}.strictness must be one of ${[...TASK_PROJECTION_STRICTNESS].join(",")}`);
    }

    for (const field of ["referenceSources", "fixtures"]) {
      if (!isNonEmptyStringArray(projection[field])) {
        errors.push(`${label}.${field} must be a non-empty string array`);
      } else {
        errors.push(...validateUniqueArray(label, field, projection[field]));
      }
    }

    if (typeof projection.requires !== "string" || projection.requires.trim().length === 0) {
      errors.push(`${label}.requires must be a non-empty string`);
    }
  });

  return errors;
}

function validateTaskProjectionAliasCollisions(label, ownerMode, verb, registryAliasesByMode) {
  const errors = [];

  if (typeof ownerMode !== "string" || ownerMode.length === 0) {
    return errors;
  }

  for (const [workflowMode, aliases] of registryAliasesByMode) {
    if (workflowMode === ownerMode) {
      continue;
    }

    for (const alias of aliases) {
      if (containsWholeWord(alias, verb)) {
        errors.push(`${label}.verb ${verb} collides with ${workflowMode} alias "${alias}"`);
      }
    }
  }

  return errors;
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

function validatePipeline(record, command, commandSet) {
  const errors = [];
  const pipeline = record?.pipeline;

  if (!isPlainObject(pipeline)) {
    return [`${command}: pipeline must be an object`];
  }

  for (const field of PIPELINE_FIELDS) {
    if (!Object.hasOwn(pipeline, field)) {
      errors.push(`${command}: pipeline.${field} is required`);
    }
  }

  if (typeof pipeline.stage !== "string" || pipeline.stage.trim().length === 0) {
    errors.push(`${command}: pipeline.stage must be a non-empty string`);
  }

  if (typeof pipeline.produces !== "string" || pipeline.produces.trim().length === 0) {
    errors.push(`${command}: pipeline.produces must be a non-empty string`);
  } else if (pipeline.produces !== record?.outputContract?.primaryArtifactName) {
    errors.push(`${command}: pipeline.produces must match outputContract.primaryArtifactName`);
  }

  errors.push(...validatePipelineCommandList(record, command, "acceptsFrom", commandSet, true));
  errors.push(...validatePipelineCommandList(record, command, "nextCommands", commandSet, false));

  if (!isNonEmptyStringArray(pipeline.proofRequired)) {
    errors.push(`${command}: pipeline.proofRequired must be a non-empty string array`);
  } else {
    errors.push(...validateUniqueArray(command, "pipeline.proofRequired", pipeline.proofRequired));

    if (Array.isArray(record?.proofFields) && !sameValue(pipeline.proofRequired, record.proofFields)) {
      errors.push(`${command}: pipeline.proofRequired must match proofFields`);
    }
  }

  if (Array.isArray(pipeline.nextCommands) && Array.isArray(record?.next)) {
    const nextSet = new Set(record.next);
    for (const nextCommand of pipeline.nextCommands) {
      if (!nextSet.has(nextCommand)) {
        errors.push(`${command}: pipeline.nextCommands must be a subset of next`);
      }
    }
  }

  return errors;
}

function validatePipelineCommandList(record, command, field, commandSet, allowEmpty) {
  const errors = [];
  const value = record?.pipeline?.[field];
  const validArray = allowEmpty ? isStringArray(value) : isNonEmptyStringArray(value);

  if (!validArray) {
    errors.push(`${command}: pipeline.${field} must be a ${allowEmpty ? "" : "non-empty "}string array`);
    return errors;
  }

  errors.push(...validateUniqueArray(command, `pipeline.${field}`, value));

  for (const item of value) {
    if (!commandSet.has(item)) {
      errors.push(`${command}: pipeline.${field} contains unknown command ${item}`);
    }

    if (item === command) {
      errors.push(`${command}: pipeline.${field} must not reference its own command`);
    }
  }

  return errors;
}

function validatePipelineGraph(recordsByCommand) {
  const errors = [];
  const records = [...recordsByCommand.values()].filter((record) => isPlainObject(record?.pipeline));
  const stageOwners = new Map();

  for (const record of records) {
    const stage = record.pipeline.stage;
    if (typeof stage !== "string" || stage.trim().length === 0) {
      continue;
    }

    const owner = stageOwners.get(stage);
    if (owner) {
      errors.push(`${record.command}: pipeline.stage "${stage}" is already owned by ${owner}`);
    } else {
      stageOwners.set(stage, record.command);
    }
  }

  for (const record of records) {
    if (!isStringArray(record.pipeline.acceptsFrom)) {
      continue;
    }

    const expected = new Set();
    for (const upstream of records) {
      if (
        upstream.command !== record.command
        && Array.isArray(upstream.pipeline?.nextCommands)
        && upstream.pipeline.nextCommands.includes(record.command)
      ) {
        expected.add(upstream.command);
      }
    }

    const actual = new Set(record.pipeline.acceptsFrom);
    if (!sameSet(actual, expected)) {
      errors.push(
        `${record.command}: pipeline.acceptsFrom must match inverse nextCommands expected [${[...expected].sort().join(",")}]`
      );
    }
  }

  return errors;
}

function validateHandoff(record, command, commandSet) {
  const errors = [];
  const handoff = record?.handoff;

  if (!isPlainObject(handoff)) {
    return [`${command}: handoff must be an object`];
  }

  for (const field of ["nextOptions", "handoffRequired", "handoffReason"]) {
    if (!Object.hasOwn(handoff, field)) {
      errors.push(`${command}: handoff.${field} is required`);
    }
  }

  const optionCommands = [];

  if (!Array.isArray(handoff.nextOptions) || handoff.nextOptions.length === 0) {
    errors.push(`${command}: handoff.nextOptions must be a non-empty array`);
  } else {
    const seenOptions = new Set();

    handoff.nextOptions.forEach((option, index) => {
      const label = `${command}: handoff.nextOptions[${index}]`;

      if (!isPlainObject(option)) {
        errors.push(`${label} must be an object`);
        return;
      }

      for (const field of HANDOFF_OPTION_FIELDS) {
        if (!Object.hasOwn(option, field)) {
          errors.push(`${label}.${field} is required`);
        }
      }

      if (typeof option.command !== "string" || option.command.trim().length === 0) {
        errors.push(`${label}.command must be a non-empty string`);
      } else {
        optionCommands.push(option.command);

        if (!commandSet.has(option.command)) {
          errors.push(`${label}.command contains unknown command ${option.command}`);
        }

        if (option.command === command) {
          errors.push(`${label}.command must not reference its own command`);
        }

        if (seenOptions.has(option.command)) {
          errors.push(`${label}.command is duplicated`);
        }

        seenOptions.add(option.command);
      }

      if (typeof option.when !== "string" || option.when.trim().length === 0) {
        errors.push(`${label}.when must be a non-empty string`);
      }
    });
  }

  if (!Array.isArray(record?.next)) {
    errors.push(`${command}: handoff.nextOptions cannot be checked until next is a string array`);
  } else if (!sameValue(optionCommands, record.next)) {
    errors.push(`${command}: handoff.nextOptions commands must match next exactly`);
  }

  if (typeof handoff.handoffRequired !== "boolean") {
    errors.push(`${command}: handoff.handoffRequired must be a boolean`);
  } else if (handoff.handoffRequired !== false) {
    errors.push(`${command}: handoff.handoffRequired must be false for recommend-only command handoff`);
  }

  if (typeof handoff.handoffReason !== "string" || handoff.handoffReason.trim().length === 0) {
    errors.push(`${command}: handoff.handoffReason must be a non-empty string`);
  }

  return errors;
}

function validateUserIntent(record, command) {
  const errors = [];
  const userIntent = record?.userIntent;

  if (!isPlainObject(userIntent)) {
    errors.push(`${command}: userIntent must be an object`);
  } else {
    if (typeof userIntent.job !== "string" || userIntent.job.trim().length === 0) {
      errors.push(`${command}: userIntent.job must be a non-empty string`);
    }

    if (!isNonEmptyStringArray(userIntent.ownedSignals)) {
      errors.push(`${command}: userIntent.ownedSignals must be a non-empty string array`);
    } else {
      errors.push(...validateUniqueArray(command, "userIntent.ownedSignals", userIntent.ownedSignals));

      const aliases = new Set(Array.isArray(record?.aliases) ? record.aliases : []);
      for (const signal of userIntent.ownedSignals) {
        if (!aliases.has(signal)) {
          errors.push(`${command}: userIntent.ownedSignals contains non-alias signal ${signal}`);
        }
      }
    }
  }

  if (!isNonEmptyStringArray(record?.copyGuard)) {
    errors.push(`${command}: copyGuard must be a non-empty string array`);
  } else {
    errors.push(...validateUniqueArray(command, "copyGuard", record.copyGuard));
  }

  return errors;
}

function validateUniqueArray(command, field, values) {
  const errors = [];
  const seen = new Set();

  for (const value of values) {
    if (seen.has(value)) {
      errors.push(`${command}: ${field} contains duplicate value ${value}`);
    }
    seen.add(value);
  }

  return errors;
}

function duplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  }

  return [...duplicates].sort();
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

    drift.push(...expectedUserIntentDrift(record, markdown));
    drift.push(...expectedExampleDrift(record, markdown, wrapperPath));
    drift.push(...expectedDiscriminatorDrift(record, markdown));
    drift.push(...expectedPreconditionsDrift(record, markdown));
    drift.push(...expectedPipelineDrift(record, markdown));
    drift.push(...expectedHandoffDrift(record, markdown));
    drift.push(...expectedChoreographyDrift(record, markdown));
    drift.push(...expectedRegisterDrift(record, markdown));
    drift.push(...expectedTaskProjectionsDrift(record, markdown));

    if (record.command === INTERFACE_COMMAND) {
      drift.push(...expectedInterfaceTaskLanesDrift(record, markdown));
    }
  }

  return drift.sort(compareDrift);
}

function expectedHandoffDrift(record, markdown) {
  const section = extractHandoffGrammarSection(markdown);

  if (!section) {
    return [
      {
        kind: "handoff",
        command: record.command,
        field: "handoff",
        expected: "## HANDOFF GRAMMAR",
        actual: "<missing section>"
      }
    ];
  }

  const drift = [];
  const handoff = record.handoff;
  const nextOptionCommands = Array.isArray(handoff?.nextOptions)
    ? handoff.nextOptions.map((option) => option.command)
    : [];
  const expectedLines = [
    `NEXT_OPTIONS=${nextOptionCommands.join(",")}`,
    `HANDOFF_REQUIRED=${String(handoff?.handoffRequired)}`,
    `HANDOFF_REASON="${handoff?.handoffReason}"`
  ];

  for (const token of HANDOFF_STATUS_TOKENS) {
    if (!section.includes(token)) {
      drift.push({
        kind: "handoff",
        command: record.command,
        field: "handoff",
        expected: token,
        actual: "<missing handoff token>"
      });
    }
  }

  for (const expectedLine of expectedLines) {
    if (!section.includes(expectedLine)) {
      drift.push({
        kind: "handoff",
        command: record.command,
        field: "handoff",
        expected: expectedLine,
        actual: "<missing or mismatched handoff value>"
      });
    }
  }

  for (const option of handoff.nextOptions) {
    if (!section.includes(option.command)) {
      drift.push({
        kind: "handoff",
        command: record.command,
        field: "handoff",
        expected: option.command,
        actual: "<missing next option command>"
      });
    }

    if (!containsPhrase(section, option.when)) {
      drift.push({
        kind: "handoff",
        command: record.command,
        field: "handoff",
        expected: option.when,
        actual: "<missing next option rationale>"
      });
    }
  }

  if (handoff.handoffRequired === false && !section.includes("HANDOFF_REQUIRED=false")) {
    drift.push({
      kind: "handoff",
      command: record.command,
      field: "handoff",
      expected: "HANDOFF_REQUIRED=false",
      actual: "<missing recommend-only handoff flag>"
    });
  }

  if (!containsPhrase(section, "never silently chains")) {
    drift.push({
      kind: "handoff",
      command: record.command,
      field: "handoff",
      expected: "never silently chains",
      actual: "<missing no-silent-chain assertion>"
    });
  }

  return drift;
}

function expectedTaskProjectionsDrift(record, markdown) {
  const section = extractTaskProjectionsSection(markdown);

  if (!section) {
    return [
      {
        kind: "taskProjections",
        command: record.command,
        field: "taskProjections",
        expected: "## TASK PROJECTIONS",
        actual: "<missing section>"
      }
    ];
  }

  const drift = [];
  const projections = Array.isArray(record.taskProjections) ? record.taskProjections : [];

  for (const projection of projections) {
    if (!isPlainObject(projection) || typeof projection.verb !== "string" || projection.verb.length === 0) {
      continue;
    }

    if (!containsWholeWord(section, projection.verb)) {
      drift.push({
        kind: "taskProjections",
        command: record.command,
        field: "taskProjections",
        expected: projection.verb,
        actual: "<missing projection verb>"
      });
    }
  }

  if (projections.length === 0 && !containsPhrase(section, "No transform-verb projections")) {
    drift.push({
      kind: "taskProjections",
      command: record.command,
      field: "taskProjections",
      expected: "No transform-verb projections",
      actual: "<missing empty-projection notice>"
    });
  }

  if (!section.includes(TASK_PROJECTIONS_NEGATIVE_CORPUS_MARKER)) {
    drift.push({
      kind: "taskProjections",
      command: record.command,
      field: "taskProjections",
      expected: TASK_PROJECTIONS_NEGATIVE_CORPUS_MARKER,
      actual: "<missing negative corpus marker>"
    });
  }

  return drift;
}

function expectedInterfaceTaskLanesDrift(record, markdown) {
  const section = extractInterfaceTaskLanesSection(markdown);

  if (!section) {
    return [
      {
        kind: "task-lanes",
        command: record.command,
        field: "task-lanes",
        expected: "## INTERFACE TASK LANES",
        actual: "<missing section>"
      }
    ];
  }

  const drift = [];
  const lowerSection = section.toLowerCase();
  const tasks = Array.isArray(record.tasks) ? record.tasks : [];

  for (const task of tasks) {
    if (!isPlainObject(task) || typeof task.label !== "string") {
      continue;
    }

    if (["argument", "sibling-command", "internal", "hidden"].includes(task.class) && !containsPhrase(section, task.label)) {
      drift.push({
        kind: "task-lanes",
        command: record.command,
        field: "task-lanes",
        expected: task.label,
        actual: "<missing lane label>"
      });
    }
  }

  if (tasks.some((task) => task?.class === "sibling-command") && !section.includes(INTERFACE_AUDIT_ROUTE)) {
    drift.push({
      kind: "task-lanes",
      command: record.command,
      field: "task-lanes",
      expected: INTERFACE_AUDIT_ROUTE,
      actual: "<missing sibling route>"
    });
  }

  if (tasks.some((task) => ["internal", "hidden"].includes(task?.class))) {
    if (!lowerSection.includes("not surfaced")) {
      drift.push({
        kind: "task-lanes",
        command: record.command,
        field: "task-lanes",
        expected: "not surfaced",
        actual: "<missing internal/hidden lane note>"
      });
    }

    if (!lowerSection.includes("not selectable")) {
      drift.push({
        kind: "task-lanes",
        command: record.command,
        field: "task-lanes",
        expected: "not selectable",
        actual: "<missing internal/hidden lane note>"
      });
    }
  }

  return drift;
}

function expectedUserIntentDrift(record, markdown) {
  const drift = [];
  const userIntentSection = extractUserIntentSection(markdown);
  const internalBindingSection = extractInternalBindingSection(markdown);
  const leadRegion = extractIntentLeadRegion(markdown);

  if (!userIntentSection) {
    drift.push({
      kind: "user-intent",
      command: record.command,
      field: "user-intent",
      expected: "## USER INTENT",
      actual: "<missing section>"
    });
  }

  if (!internalBindingSection) {
    drift.push({
      kind: "user-intent",
      command: record.command,
      field: "user-intent",
      expected: "## INTERNAL BINDING",
      actual: "<missing section>"
    });
  }

  if (!leadRegion) {
    drift.push({
      kind: "user-intent",
      command: record.command,
      field: "user-intent",
      expected: record.userIntent.job,
      actual: "<missing lead region>"
    });
    return drift;
  }

  if (!leadRegion.includes(record.userIntent.job)) {
    drift.push({
      kind: "user-intent",
      command: record.command,
      field: "user-intent",
      expected: record.userIntent.job,
      actual: "<missing job text>"
    });
  }

  for (const phrase of record.copyGuard) {
    if (containsPhrase(leadRegion, phrase)) {
      drift.push({
        kind: "user-intent",
        command: record.command,
        field: "user-intent",
        expected: `lead region without "${phrase}"`,
        actual: phrase
      });
    }
  }

  return drift;
}

function expectedChoreographyDrift(record, markdown) {
  const section = extractChoreographySection(markdown);

  if (!section) {
    return [
      {
        kind: "choreography",
        command: record.command,
        field: "choreography",
        expected: "## CHOREOGRAPHY",
        actual: "<missing section>"
      }
    ];
  }

  const drift = [];
  const steps = Array.isArray(record.choreography) ? record.choreography : [];
  const numberedLines = section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^\d+\.\s+/.test(line));

  if (numberedLines.length !== steps.length) {
    drift.push({
      kind: "choreography",
      command: record.command,
      field: "choreography",
      expected: `${steps.length} ordered steps`,
      actual: `${numberedLines.length} numbered steps`
    });
  }

  for (const step of steps) {
    if (!isPlainObject(step) || !Number.isInteger(step.order)) {
      continue;
    }

    const line = numberedLines.find((candidate) => candidate.startsWith(`${step.order}.`));
    if (!line) {
      drift.push({
        kind: "choreography",
        command: record.command,
        field: "choreography",
        expected: `step ${step.order}`,
        actual: "<missing ordered step>"
      });
      continue;
    }

    for (const field of ["skill", "resource", "action"]) {
      const expected = step[field];
      if (typeof expected !== "string" || expected.length === 0) {
        continue;
      }

      if (!containsPhrase(line, expected)) {
        drift.push({
          kind: "choreography",
          command: record.command,
          field: "choreography",
          expected,
          actual: `<missing ${field} in step ${step.order}>`
        });
      }
    }
  }

  return drift;
}

function expectedPipelineDrift(record, markdown) {
  const section = extractPipelineSection(markdown);
  const drift = [];

  if (!section) {
    return [
      {
        kind: "pipeline",
        command: record.command,
        field: "pipeline",
        expected: "## PIPELINE & HANDOFF",
        actual: "<missing section>"
      }
    ];
  }

  for (const marker of PIPELINE_SECTION_MARKERS) {
    if (!section.includes(marker)) {
      drift.push({
        kind: "pipeline",
        command: record.command,
        field: "pipeline",
        expected: marker,
        actual: "<missing marker>"
      });
    }
  }

  if (!section.includes(record.pipeline.stage)) {
    drift.push({
      kind: "pipeline",
      command: record.command,
      field: "pipeline",
      expected: record.pipeline.stage,
      actual: "<missing stage>"
    });
  }

  if (!section.includes(record.pipeline.produces)) {
    drift.push({
      kind: "pipeline",
      command: record.command,
      field: "pipeline",
      expected: record.pipeline.produces,
      actual: "<missing produced artifact>"
    });
  }

  for (const upstream of record.pipeline.acceptsFrom) {
    if (!section.includes(upstream)) {
      drift.push({
        kind: "pipeline",
        command: record.command,
        field: "pipeline",
        expected: upstream,
        actual: "<missing upstream command>"
      });
    }
  }

  for (const nextCommand of record.pipeline.nextCommands) {
    if (!section.includes(nextCommand)) {
      drift.push({
        kind: "pipeline",
        command: record.command,
        field: "pipeline",
        expected: nextCommand,
        actual: "<missing next command>"
      });
    }
  }

  for (const proofField of record.pipeline.proofRequired) {
    if (!section.includes(proofField)) {
      drift.push({
        kind: "pipeline",
        command: record.command,
        field: "pipeline",
        expected: proofField,
        actual: "<missing proof field>"
      });
    }
  }

  if (!hasSkCodeHandoffLine(section)) {
    drift.push({
      kind: "pipeline",
      command: record.command,
      field: "pipeline",
      expected: "sk-code handoff card",
      actual: "<missing handoff line>"
    });
  }

  drift.push(...expectedPipelineStatusDrift(record, markdown));

  return drift;
}

function expectedPipelineStatusDrift(record, markdown) {
  const status = extractSuccessStatusLine(markdown);

  if (!status) {
    return [
      {
        kind: "pipeline",
        command: record.command,
        field: "pipeline",
        expected: "STATUS=OK PRODUCES= NEXT= PROOF=",
        actual: "<missing success status tail>"
      }
    ];
  }

  const drift = [];

  for (const token of PIPELINE_STATUS_TOKENS) {
    if (!status.includes(token)) {
      drift.push({
        kind: "pipeline",
        command: record.command,
        field: "pipeline",
        expected: token,
        actual: "<missing status token>"
      });
    }
  }

  if (!status.includes(record.pipeline.produces)) {
    drift.push({
      kind: "pipeline",
      command: record.command,
      field: "pipeline",
      expected: record.pipeline.produces,
      actual: "<missing status artifact>"
    });
  }

  for (const nextCommand of record.pipeline.nextCommands) {
    if (!status.includes(nextCommand)) {
      drift.push({
        kind: "pipeline",
        command: record.command,
        field: "pipeline",
        expected: nextCommand,
        actual: "<missing status next command>"
      });
    }
  }

  for (const proofField of record.pipeline.proofRequired) {
    if (!status.includes(proofField)) {
      drift.push({
        kind: "pipeline",
        command: record.command,
        field: "pipeline",
        expected: proofField,
        actual: "<missing status proof field>"
      });
    }
  }

  return drift;
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

function extractPipelineSection(markdown) {
  const sectionMatch = markdown.match(/^##\s+(?:\d+\.\s+)?PIPELINE & HANDOFF\s*$/im);
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

function extractSuccessStatusLine(markdown) {
  const statusMatch = markdown.match(/^\s*-\s+Success:\s+`([^`]*STATUS=OK[^`]*)`/im);
  return statusMatch ? statusMatch[1].trim() : null;
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

function extractUserIntentSection(markdown) {
  return extractNamedSection(markdown, "USER INTENT");
}

function extractInternalBindingSection(markdown) {
  return extractNamedSection(markdown, "INTERNAL BINDING");
}

function extractInterfaceTaskLanesSection(markdown) {
  return extractNamedSection(markdown, "INTERFACE TASK LANES");
}

function extractTaskProjectionsSection(markdown) {
  return extractNamedSection(markdown, "TASK PROJECTIONS");
}

function extractChoreographySection(markdown) {
  return extractNamedSection(markdown, "CHOREOGRAPHY");
}

function extractHandoffGrammarSection(markdown) {
  return extractNamedSection(markdown, "HANDOFF GRAMMAR");
}

function extractNamedSection(markdown, sectionName) {
  const sectionMatch = markdown.match(new RegExp(`^##\\s+(?:\\d+\\.\\s+)?${escapeRegExp(sectionName)}\\s*$`, "im"));
  if (!sectionMatch || typeof sectionMatch.index !== "number") {
    return null;
  }

  const bodyStart = sectionMatch.index + sectionMatch[0].length;
  const nextSection = markdown.slice(bodyStart).search(/\r?\n##\s+/);
  return nextSection === -1 ? markdown.slice(bodyStart) : markdown.slice(bodyStart, bodyStart + nextSection);
}

function extractIntentLeadRegion(markdown) {
  const titleMatch = markdown.match(/^#\s+\/design:[^\r\n]+$/im);
  if (!titleMatch || typeof titleMatch.index !== "number") {
    return null;
  }

  const bodyStart = titleMatch.index + titleMatch[0].length;
  const afterTitle = markdown.slice(bodyStart);
  const internalBindingMatch = afterTitle.match(/^##\s+(?:\d+\.\s+)?INTERNAL BINDING\s*$/im);

  if (internalBindingMatch && typeof internalBindingMatch.index === "number") {
    return afterTitle.slice(0, internalBindingMatch.index);
  }

  const nextSection = afterTitle.search(/\r?\n##\s+/);
  return nextSection === -1 ? afterTitle : afterTitle.slice(0, nextSection);
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

function hasSkCodeHandoffLine(section) {
  return section
    .split(/\r?\n/)
    .some((line) => line.includes("sk-code") && line.includes("sk_code_handoff.md"));
}

function containsPhrase(value, phrase) {
  return value.toLowerCase().includes(phrase.toLowerCase());
}

function containsWholeWord(value, word) {
  if (typeof value !== "string" || typeof word !== "string" || word.length === 0) {
    return false;
  }

  return new RegExp(`(^|[^a-z0-9-])${escapeRegExp(word)}([^a-z0-9-]|$)`, "i").test(value);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
