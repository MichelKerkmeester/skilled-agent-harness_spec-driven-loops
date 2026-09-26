import { changedFiles } from "../adapters/git.ts";
import { TEST_FILE } from "../domain/config.ts";
import type { ReviewReport } from "../domain/types.ts";
import { locateSignal, profileFile, screenFile } from "./judgments.ts";
import { type Log, runReview } from "./workflow.ts";

export function runChangeReview(scope: string, log: Log): Promise<ReviewReport> {
  return runReview(scope, log, {
    mode: "changes",
    subject: "changed source",
    context: "changed test",
    discover: (target) => {
      const changed = changedFiles(target);
      const contextFiles = changed.filter((file) => TEST_FILE.test(file.path));
      return {
        files: changed.filter((file) => !TEST_FILE.test(file.path)),
        contextFiles,
      };
    },
    screen: screenFile,
    profile: profileFile,
    locate: locateSignal,
  });
}
