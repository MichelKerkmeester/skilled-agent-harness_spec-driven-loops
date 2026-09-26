import type { Command } from "commander";
import type { CommandContext } from "../context.js";
import type { BatchItemRunner } from "../core/batch.js";
import {
  buildRouteRequest,
  type Handlers,
  parseHandlerList,
  parseHandlers,
  ROUTE_FAIL_CONDITIONS,
  type RouteOutput,
  routeFailed,
  runRoute,
} from "../core/route.js";
import { CliError, EXIT } from "../errors.js";
import { parseJson, readInput, readStdin } from "../input.js";
import { parseFailOn, parseProbability } from "../lib.js";
import { emit, formatProbability, paint, type View } from "../output.js";

export interface RouteFlags {
  handlers?: string;
  handlersJson?: string;
  instructions?: string;
  minConfidence?: string;
  stateJson?: boolean;
  failOn?: string;
}

function resolve(flags: RouteFlags, ctx: CommandContext) {
  if (Boolean(flags.handlers) === Boolean(flags.handlersJson)) {
    throw new CliError("Provide exactly one of --handlers <list> or --handlers-json <ref>.");
  }
  let handlers: Handlers;
  try {
    handlers = flags.handlers
      ? parseHandlerList(flags.handlers)
      : parseHandlers(parseJson(readInput(flags.handlersJson!, "handlers"), "handlers"));
  } catch (err) {
    if (err instanceof CliError) throw err;
    throw new CliError((err as Error).message);
  }
  const minConfidence = parseProbability(
    "--min-confidence",
    flags.minConfidence,
    ctx.config.route.minConfidence,
  );
  const failOn = parseFailOn(flags.failOn, ROUTE_FAIL_CONDITIONS, []);
  return { handlers, minConfidence, failOn };
}

export function resolveRequest(positional: string | undefined, flags: RouteFlags): unknown {
  let raw: string;
  if (positional !== undefined) raw = readInput(positional, "request");
  else if (!process.stdin.isTTY) raw = readStdin("request");
  else throw new CliError("Provide the request as an argument, @file, or pipe it on stdin.");
  return flags.stateJson ? parseJson(raw, "request") : raw;
}

export async function routeAction(
  positional: string | undefined,
  flags: RouteFlags,
  ctx: CommandContext,
): Promise<number> {
  const { handlers, minConfidence, failOn } = resolve(flags, ctx);
  const request = resolveRequest(positional, flags);
  if (ctx.dryRun) {
    const { state, questions } = buildRouteRequest({ request, handlers, instructions: flags.instructions });
    emit({ ...ctx.output, format: "json" }, { model: ctx.config.model, state, questions }, () => ({}));
    return EXIT.OK;
  }
  const output = await runRoute(ctx.ask(), {
    request,
    handlers,
    instructions: flags.instructions,
    minConfidence,
  });
  emit(ctx.output, output, () => renderRoute(output, ctx));
  return routeFailed(output, failOn) ? EXIT.JUDGMENT : EXIT.OK;
}

export function renderRoute(out: RouteOutput, ctx: CommandContext): View {
  const c = ctx.output.color;
  const dist = Object.entries(out.probabilities)
    .sort(([, a], [, b]) => b - a)
    .map(([k, v]) => `${k} ${formatProbability(v)}`)
    .join(", ");
  const head = [
    out.handler === null
      ? `${paint(c, ["bold", "yellow"], "no handler")}  conf ${formatProbability(out.confidence)}`
      : `${paint(c, ["bold", "green"], out.handler)}  conf ${formatProbability(out.confidence)}  ${out.action === "review" ? paint(c, "yellow", "review") : paint(c, "dim", "auto")}`,
    paint(c, "dim", `[${dist}]`),
  ];
  const kv: Array<[string, string]> = [
    ["handler", out.handler ?? ""],
    ["confidence", formatProbability(out.confidence)],
    ["action", out.action],
  ];
  for (const [name, a] of Object.entries(out.args)) {
    const extra =
      a.type === "noul" ? `p ${formatProbability(a.probability)}` : `conf ${formatProbability(a.confidence)}`;
    head.push(
      `  ${name} = ${a.value === null ? paint(c, "dim", "unspecified") : paint(c, "green", String(a.value))}  ${paint(c, "dim", extra)}`,
    );
    kv.push([`arg.${name}`, a.value === null ? "" : String(a.value)]);
  }
  return { head, kv, usage: { usage: out.usage, model: out.model, provider: out.provider } };
}

/** Batch: each row is a request routed with the shared handlers. */
export function prepareRouteBatch(flags: RouteFlags, ctx: CommandContext): BatchItemRunner {
  const { handlers, minConfidence, failOn } = resolve(flags, ctx);
  return async (row) => {
    const request =
      row.state !== undefined && typeof row.state !== "string"
        ? row.state
        : flags.stateJson
          ? parseJson(row.text, `row ${row.id}`)
          : row.text;
    const output = await runRoute(ctx.ask(), {
      request,
      handlers,
      instructions: flags.instructions,
      minConfidence,
    });
    return { output, failed: routeFailed(output, failOn) };
  };
}

export function registerRoute(
  program: Command,
  run: (fn: (ctx: CommandContext) => Promise<number>, cmd: Command) => Promise<void>,
) {
  program
    .command("route")
    .description("Pick the handler for a request and fill its arguments from closed sets, in one call.")
    .argument("[request]", "the request text, @file, or - for stdin (default: stdin)")
    .option("-H, --handlers <list>", "handlers without arguments: name:description,name2:description")
    .option("--handlers-json <ref>", "handlers with arguments as JSON (see below)")
    .option("-i, --instructions <text>", "the routing question to ask instead of the default")
    .option("--min-confidence <p>", "confidence below which the route is flagged 'review' (default 0.6)")
    .option("--state-json", "parse the request as JSON")
    .option(
      "--fail-on <list>",
      `exit 2 when: ${ROUTE_FAIL_CONDITIONS.join(", ")} (no handler fits), or none (default none)`,
    )
    .addHelpText(
      "after",
      `
Handlers JSON: {"name": "description" | null | {"description": "...", "args": {"argName": spec}}}
  spec: {"type": "choice", "options": ["a","b"] | {"a": "desc"}, "instructions"?: "..."}
        {"type": "noul", "instructions": "yes/no question"}
        {"type": "score", "levels": ["low","mid","high"], "instructions"?: "..."}
A "none" option is always added so the model can say nothing fits (action: none).
Argument questions for every handler run in the same request; only the chosen handler's are returned.

Examples:
  jev route "cancel my order and refund me" -H "refund:money back,cancel:stop an order,support:everything else"
  jev route @message.txt --handlers-json @handlers.json --fail-on review,unrouted --json`,
    )
    .action(async (request: string | undefined, flags: RouteFlags, cmd: Command) => {
      await run((ctx) => routeAction(request, flags, ctx), cmd);
    });
}
