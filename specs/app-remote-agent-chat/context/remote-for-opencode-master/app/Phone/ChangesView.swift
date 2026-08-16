import RemoteKit
import SwiftUI

/// Everything the agent has changed, accumulated — not one turn's worth.
///
/// This is the screen that makes remote work finishable rather than just
/// steerable: "show me everything that changed before I sign off." No
/// phone-based coding tool ships it. Two lenses, because the two questions
/// are different: **Working tree** is what's uncommitted right now, and
/// **vs. branch** is what a reviewer would see in a pull request.
struct ChangesView: View {
    let project: String

    @State private var changes: WorkingChanges?
    @State private var mode = "git"
    @State private var loading = true
    @State private var error: String?
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            Group {
                if let changes, !changes.files.isEmpty {
                    List {
                        Section {
                            ForEach(changes.files, id: \.file) { diff in
                                NavigationLink {
                                    PatchView(diff: diff)
                                } label: {
                                    FileRow(diff: diff)
                                }
                            }
                        } header: {
                            summary(changes)
                        }
                    }
                    .listStyle(.plain)
                } else if loading {
                    ProgressView("Reading the working tree…")
                } else {
                    ContentUnavailableView(
                        "Nothing changed",
                        systemImage: "checkmark.circle",
                        description: Text(error ?? "The working tree is clean.")
                    )
                }
            }
            .background(Color.canvas)
            .navigationTitle("Changes")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Picker("", selection: $mode) {
                        Text("Working tree").tag("git")
                        Text("vs. branch").tag("branch")
                    }
                    .pickerStyle(.menu)
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
            .onChange(of: mode) { Task { await load() } }
            .task { await load() }
            .refreshable { await load() }
        }
    }

    private func summary(_ changes: WorkingChanges) -> some View {
        HStack(spacing: 8) {
            if let branch = changes.branch {
                Label(branch, systemImage: "arrow.triangle.branch")
                    .font(.caption.monospaced())
            }
            Spacer()
            Text("\(changes.files.count) file\(changes.files.count == 1 ? "" : "s")")
                .font(.caption)
            Text("+\(changes.additions)").foregroundStyle(Color.positive)
            Text("−\(changes.deletions)").foregroundStyle(Color.negative)
        }
        .font(.caption.monospacedDigit())
        .foregroundStyle(Color.inkMuted)
        .textCase(nil)
    }

    private func load() async {
        loading = true
        defer { loading = false }
        error = nil
        var request = Wire.Request(kind: "changes")
        request.project = project
        request.mode = mode
        for await event in CompanionLink().run(request) {
            switch event.kind {
            case "changes": changes = event.changes
            case "failed": error = event.text
            default: break
            }
        }
    }
}

private struct FileRow: View {
    let diff: FileDiff

    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: icon)
                .font(.caption)
                .foregroundStyle(tint)
                .frame(width: 16)
            Text(diff.file)
                .font(.callout.monospaced())
                .lineLimit(1)
                .truncationMode(.head)
            Spacer(minLength: 8)
            Text("+\(diff.additions ?? 0)").foregroundStyle(Color.positive)
            Text("−\(diff.deletions ?? 0)").foregroundStyle(Color.negative)
        }
        .font(.caption.monospacedDigit())
    }

    private var icon: String {
        switch diff.status {
        case "added": return "plus.circle"
        case "deleted": return "minus.circle"
        default: return "pencil.circle"
        }
    }

    private var tint: Color {
        switch diff.status {
        case "added": return .positive
        case "deleted": return .negative
        default: return .inkMuted
        }
    }
}

/// One file's patch, coloured by line. Unified always — split needs about
/// 120 columns and a phone has roughly 42.
struct PatchView: View {
    let diff: FileDiff

    var body: some View {
        ScrollView([.vertical, .horizontal]) {
            VStack(alignment: .leading, spacing: 0) {
                ForEach(Array(lines.enumerated()), id: \.offset) { _, line in
                    Text(line.isEmpty ? " " : line)
                        .font(.system(.footnote, design: .monospaced))
                        .foregroundStyle(color(for: line))
                        .padding(.horizontal, 12)
                        .padding(.vertical, 1)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(background(for: line))
                        .fixedSize(horizontal: true, vertical: false)
                }
            }
            .padding(.vertical, 8)
            // A two-axis ScrollView centres content shorter than the
            // viewport; a diff must start at the top.
            .frame(maxHeight: .infinity, alignment: .topLeading)
        }
        .background(Color.canvas)
        .navigationTitle(diff.file.split(separator: "/").last.map(String.init) ?? diff.file)
        .navigationBarTitleDisplayMode(.inline)
    }

    private var lines: [String] {
        (diff.patch ?? "").components(separatedBy: "\n")
    }

    private func color(for line: String) -> Color {
        if line.hasPrefix("+++") || line.hasPrefix("---") { return .inkFaint }
        if line.hasPrefix("@@") { return .clay }
        if line.hasPrefix("+") { return .positive }
        if line.hasPrefix("-") { return .negative }
        if line.hasPrefix("diff ") || line.hasPrefix("index ") { return .inkFaint }
        return .inkMuted
    }

    private func background(for line: String) -> Color {
        if line.hasPrefix("+++") || line.hasPrefix("---") { return .clear }
        if line.hasPrefix("+") { return Color.positive.opacity(0.10) }
        if line.hasPrefix("-") { return Color.negative.opacity(0.10) }
        return .clear
    }
}
