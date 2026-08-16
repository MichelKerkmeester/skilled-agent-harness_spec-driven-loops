import RemoteKit
import SwiftUI

enum InspectorTab: String, CaseIterable, Identifiable {
    case changes, plan, approvals
    var id: String { rawValue }

    var label: String {
        switch self {
        case .changes: return "Changes"
        case .plan: return "Plan"
        case .approvals: return "Approvals"
        }
    }
}

/// The workspace's right pane: the review surfaces that were sheets on the
/// phone, standing open. Changes is the one that makes desktop work
/// finishable — everything the agent changed, per file, split when wide.
struct InspectorPane: View {
    @ObservedObject var state: WorkspaceState
    @ObservedObject var turn: TurnController
    @Binding var tab: InspectorTab

    var body: some View {
        VStack(spacing: 0) {
            Picker("", selection: $tab) {
                ForEach(InspectorTab.allCases) { tab in
                    Text(tab.label).tag(tab)
                }
            }
            .pickerStyle(.segmented)
            .labelsHidden()
            .padding(10)

            switch tab {
            case .changes:
                ChangesPane(state: state, project: turn.project)
            case .plan:
                planPane
            case .approvals:
                approvalsPane
            }
        }
        .background(Color.canvas)
    }

    @ViewBuilder
    private var planPane: some View {
        if turn.todos.isEmpty {
            quiet("No plan yet", detail: "The agent's todo list appears here while it works.")
        } else {
            ScrollView {
                TodoList(todos: turn.todos)
                    .padding(12)
            }
        }
    }

    @ViewBuilder
    private var approvalsPane: some View {
        if turn.permission == nil, turn.question == nil {
            quiet("Nothing waiting", detail: "Approvals and questions land here when the agent blocks.")
        } else {
            ScrollView {
                VStack(spacing: 12) {
                    if let permission = turn.permission {
                        PermissionCard(request: permission) { reply, message in
                            turn.answer(permission, reply: reply, message: message)
                        }
                    }
                    if let question = turn.question {
                        QuestionCard(request: question) { answers in
                            turn.answer(question, answers: answers)
                        }
                    }
                }
                .padding(12)
            }
        }
    }

    private func quiet(_ title: String, detail: String) -> some View {
        VStack(spacing: 6) {
            Text(title)
                .font(.callout.weight(.medium))
                .foregroundStyle(Color.inkMuted)
            Text(detail)
                .font(.footnote)
                .foregroundStyle(Color.inkFaint)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(20)
    }
}

/// Accumulated changes for the project, with the phone's two lenses —
/// working tree, and vs. the default branch the way a reviewer would see
/// a pull request — over a file list and the selected file's diff.
struct ChangesPane: View {
    @ObservedObject var state: WorkspaceState
    let project: String

    @State private var changes: WorkingChanges?
    @State private var mode = "git"
    @State private var loading = true
    @State private var error: String?
    @State private var selectedFile: String?
    @State private var unifiedFiles: Set<String> = []

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Picker("", selection: $mode) {
                    Text("Working tree").tag("git")
                    Text("vs. branch").tag("branch")
                }
                .pickerStyle(.menu)
                .fixedSize()
                Spacer()
                if let changes {
                    Text("\(changes.files.count)  +\(changes.additions) −\(changes.deletions)")
                        .font(.caption.monospacedDigit())
                        .foregroundStyle(Color.inkMuted)
                }
                Button {
                    Task { await load() }
                } label: {
                    Image(systemName: "arrow.clockwise")
                }
                .buttonStyle(.plain)
                .foregroundStyle(Color.inkMuted)
                .accessibilityLabel("Refresh changes")
            }
            .padding(.horizontal, 10)
            .padding(.bottom, 8)

            if let changes, !changes.files.isEmpty {
                List(selection: $selectedFile) {
                    ForEach(changes.files, id: \.file) { diff in
                        fileRow(diff)
                            .tag(diff.file)
                            .contextMenu {
                                Button(unifiedFiles.contains(diff.file)
                                    ? "Show Side by Side" : "Show Unified") {
                                    if !unifiedFiles.insert(diff.file).inserted {
                                        unifiedFiles.remove(diff.file)
                                    }
                                }
                            }
                    }
                }
                .listStyle(.plain)
                .frame(minHeight: 120, maxHeight: 220)

                Divider().overlay(Color.hairline)

                if let selected = changes.files.first(where: { $0.file == selectedFile })
                    ?? changes.files.first {
                    SplitDiff(diff: selected, forceUnified: unifiedFiles.contains(selected.file))
                }
            } else if loading {
                ProgressView("Reading the working tree…")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                VStack(spacing: 6) {
                    Image(systemName: "checkmark.circle")
                        .foregroundStyle(Color.positive)
                    Text(error ?? "The working tree is clean.")
                        .font(.footnote)
                        .foregroundStyle(Color.inkMuted)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .onChange(of: mode) { Task { await load() } }
        .task { await load() }
    }

    private func fileRow(_ diff: FileDiff) -> some View {
        HStack(spacing: 8) {
            Image(systemName: icon(diff))
                .font(.caption)
                .foregroundStyle(tint(diff))
                .frame(width: 14)
            Text(diff.file)
                .font(.caption.monospaced())
                .lineLimit(1)
                .truncationMode(.head)
            Spacer(minLength: 8)
            Text("+\(diff.additions ?? 0)").foregroundStyle(Color.positive)
            Text("−\(diff.deletions ?? 0)").foregroundStyle(Color.negative)
        }
        .font(.caption2.monospacedDigit())
    }

    private func icon(_ diff: FileDiff) -> String {
        switch diff.status {
        case "added": return "plus.circle"
        case "deleted": return "minus.circle"
        default: return "pencil.circle"
        }
    }

    private func tint(_ diff: FileDiff) -> Color {
        switch diff.status {
        case "added": return .positive
        case "deleted": return .negative
        default: return .inkMuted
        }
    }

    private func load() async {
        loading = true
        defer { loading = false }
        error = nil
        var request = Wire.Request(kind: "changes")
        request.project = project
        request.mode = mode
        for await event in state.makeLink().run(request) {
            switch event.kind {
            case "changes": changes = event.changes
            case "failed": error = event.text
            default: break
            }
        }
    }
}
