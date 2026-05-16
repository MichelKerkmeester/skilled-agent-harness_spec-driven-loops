// Another unrelated getUserData. Different signature, different domain.
// Do NOT rename this either.
export class DataPipeline {
  getUserData(row: { user: { id: string } }) {
    return row.user;
  }
}
