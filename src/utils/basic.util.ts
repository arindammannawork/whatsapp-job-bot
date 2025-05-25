export function extractSubject(text: string | undefined): string | null {
  if (!text) {
    return null;
  }
  const match = text.match(/^Subject:\s*(.+)$/m);
  return match ? match[1].trim() : null;
}
export function removeSubjectLine(text: string | undefined): string | null {
  if (!text) {
    return null;
  }
  return text.replace(/^Subject:.*\n?/m, "").trim();
}
