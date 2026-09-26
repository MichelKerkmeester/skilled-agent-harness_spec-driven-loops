export interface QueueNotificationBundle {
  roots: string[];
  order: string[];
  missing?: string[];
  cycles?: string[][];
}

/**
 * Format the post-queue notification so every loaded skill is named.
 * Root skills stay in the main list; dependency-only skills are named in
 * parentheses after the dependency count.
 */
export function formatQueueNotification(label: string, bundle: QueueNotificationBundle): string {
  const rootSet = new Set(bundle.roots);
  const dependencyNames = bundle.order.filter((name) => !rootSet.has(name));
  const rootsText = bundle.roots.join(", ");
  const warningParts: string[] = [];
  if (bundle.missing?.length) warningParts.push(`${bundle.missing.length} missing ${bundle.missing.length === 1 ? "dependency" : "dependencies"}`);
  if (bundle.cycles?.length) warningParts.push(`${bundle.cycles.length} dependency cycle${bundle.cycles.length === 1 ? "" : "s"}`);
  const warningSuffix = warningParts.length ? ` Warning: ${warningParts.join(", ")}.` : "";

  if (dependencyNames.length === 0) {
    return `Queued ${label}: ${rootsText}.${warningSuffix}`;
  }

  const dependencyWord = dependencyNames.length === 1 ? "dependency" : "dependencies";
  return `Queued ${label}: ${rootsText} + ${dependencyNames.length} ${dependencyWord} (${dependencyNames.join(", ")}).${warningSuffix}`;
}
