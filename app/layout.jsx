import "./globals.css";
import AuthProvider from "../components/auth-provider";

export const metadata = {
  title: "Komdigi Staff Questionnaire",
  description: "Token-gated internal survey for Komdigi staff.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
