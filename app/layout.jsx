import "./globals.css";

export const metadata = {
  title: "Komdigi Staff Questionnaire",
  description: "Token-gated internal survey for Komdigi staff.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
