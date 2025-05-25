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
export const extractEmailFromText = (text: string): string[] => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex);
  return matches || [];
};
