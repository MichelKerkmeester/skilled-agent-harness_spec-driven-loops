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
  "next",
  "proofFields",
  "deferToHubWhen",
  "toolPolicy"
];

const COMMANDS = [
  "/design:audit",
  "/design:foundations",
  "/design:interface",
  "/design:md-generator",
  "/design:motion"
];

const DRIFT_FIELDS = ["description", "argument-hint", "allowed-tools"];
const GENERIC_ARGUMENT_HINT = "<design request>";
const READ_ONLY_TOOLS = ["Read", "Glob", "Grep"];
const MUTATING_TOOLS = ["Read", "Write", "Edit", "Bash", "Glob", "Grep"];

const scriptUrl = new URL(import.meta.url);
const skillRootUrl = new URL("../../", scriptUrl);
const opencodeRootUrl = new URL("../../", skillRootUrl);
const metadataUrl = new URL("command-metadata.json", skillRootUrl);
const registryUrl = new URL("mode-registry.json", skillRootUrl);
const commandsRootUrl = new URL("commands/design/", opencodeRootUrl);

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

function isNonEmptyStringArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === "string" && item.length > 0);
}

async function collectSurfaceDrift(records) {
  const drift = [];

  for (const record of records) {
    const wrapperPath = wrapperPathForCommand(record.command);
    let frontmatter;

    try {
      frontmatter = parseFrontmatter(await readFile(wrapperPath.url, "utf8"));
    } catch (error) {
      drift.push({
        command: record.command,
        field: "wrapper",
        expected: wrapperPath.relativePath,
        actual: error instanceof Error ? error.message : String(error)
      });
      continue;
    }

    for (const field of DRIFT_FIELDS) {
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
  }

  return drift.sort(compareDrift);
}

function wrapperPathForCommand(command) {
  const name = command.replace("/design:", "");
  const relativePath = `.opencode/commands/design/${name}.md`;
  return {
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

function compareDrift(left, right) {
  const commandCompare = left.command.localeCompare(right.command);
  if (commandCompare !== 0) {
    return commandCompare;
  }

  return DRIFT_FIELDS.indexOf(left.field) - DRIFT_FIELDS.indexOf(right.field);
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
    lines.push(
      `DRIFT ${item.command} ${item.field} expected=${formatValue(item.expected)} actual=${formatValue(item.actual)}`
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
