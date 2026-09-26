import { relative, resolve } from "node:path";
import { reportPath, saveReport } from "../adapters/report-store.ts";
import type { ReviewReport } from "../domain/types.ts";
import type { Log } from "../review/workflow.ts";

type Runner = (scope: string, log: Log) => Promise<ReviewReport>;

export async function printReview(run: Runner): Promise<void> {
  const scope = resolve(process.argv[2] ?? ".");
  const report = await run(scope, console.error);
  console.log(JSON.stringify(report, null, 2));
}

export async function saveReview(run: Runner): Promise<void> {
  const scope = resolve(process.argv[2] ?? ".");
  const out = reportPath();
  const outLabel = relative(process.cwd(), out) || out;

  try {
    const report = await run(scope, console.error);
    await saveReport(report, out);
    console.error("saved " + outLabel);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    console.error("review failed; " + outLabel + " unchanged");
    process.exit(1);
  }
}
