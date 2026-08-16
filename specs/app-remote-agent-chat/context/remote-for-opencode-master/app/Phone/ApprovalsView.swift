import RemoteKit
import SwiftUI

/// What a push opens onto: every request currently blocked in a project,
/// answerable right here. Fetched fresh from the Mac over the authenticated
/// channel — the push only said "something needs you", never what.
struct ApprovalsView: View {
    let attention: Attention.Info
    @Environment(\.dismiss) private var dismiss

    @State private var pending: [PermissionRequest] = []
    @State private var questions: [QuestionRequest] = []
    @State private var answering: QuestionRequest?
    @State private var loading = true
    @State private var error: String?

    var body: some View {
        NavigationStack {
            List {
                if let error {
                    Label(error, systemImage: "wifi.exclamationmark")
                        .foregroundStyle(.secondary)
                }
                ForEach(pending) { request in
                    VStack(alignment: .leading, spacing: 10) {
                        Label(request.permission ?? "Permission", systemImage: "hand.raised")
                            .font(.headline)
                        if let patterns = request.patterns, !patterns.isEmpty {
                            Text(patterns.joined(separator: "\n"))
                                .font(.callout.monospaced())
                        }
                        HStack {
                            Button("Reject", role: .destructive) { answer(request, "reject") }
                            Spacer()
                            Button("Allow Once") { answer(request, "once") }
                                .buttonStyle(.borderedProminent)
                        }
                        .buttonStyle(.bordered)
                    }
                    .padding(.vertical, 6)
                }
                ForEach(questions) { request in
                    Button {
                        answering = request
                    } label: {
                        VStack(alignment: .leading, spacing: 4) {
                            Label(
                                request.questions.first?.header ?? "Question",
                                systemImage: "questionmark.bubble"
                            )
                            .font(.headline)
                            if let text = request.questions.first?.question {
                                Text(text)
                                    .font(.callout)
                                    .foregroundStyle(.secondary)
                                    .lineLimit(3)
                            }
                        }
                        .padding(.vertical, 4)
                    }
                }
                if !loading, pending.isEmpty, questions.isEmpty, error == nil {
                    // The honest empty state: someone (or a timeout) already
                    // answered, or the turn finished — nothing is stuck.
                    Label(
                        attention.kind == "done"
                            ? "The agent finished." : "Nothing is waiting on you.",
                        systemImage: attention.kind == "done" ? "checkmark.circle" : "checkmark.seal"
                    )
                    .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("Needs You")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
            .overlay { if loading { ProgressView() } }
            .task { await load() }
            .sheet(item: $answering) { request in
                QuestionSheet(request: request) { answers in
                    answering = nil
                    questions.removeAll { $0.id == request.id }
                    var wire = Wire.Request(kind: "question")
                    wire.questionID = request.id
                    wire.project = attention.directory
                    wire.answers = answers
                    Task {
                        for await event in CompanionLink().run(wire) where event.kind == "failed" {
                            error = event.text
                        }
                    }
                }
            }
        }
    }

    private func load() async {
        defer { loading = false }
        guard let directory = attention.directory else { return }
        var request = Wire.Request(kind: "pending")
        request.project = directory
        for await event in CompanionLink().run(request) {
            switch event.kind {
            case "pending":
                pending = event.permissions ?? []
                questions = event.questions ?? []
            case "failed":
                error = event.text
            default: break
            }
        }
    }

    private func answer(_ request: PermissionRequest, _ reply: String) {
        Task {
            // Same gate as the live session: Face ID before granting,
            // never before declining.
            if reply != "reject", await !Approver.confirm() { return }
            pending.removeAll { $0.id == request.id }
            var wire = Wire.Request(kind: "permission")
            wire.permissionID = request.id
            wire.project = attention.directory
            wire.reply = reply
            for await event in CompanionLink().run(wire) where event.kind == "failed" {
                error = event.text
            }
        }
    }
}
