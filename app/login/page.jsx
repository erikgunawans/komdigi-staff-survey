import SurveyEntryLanding from "../survey-entry-landing";

export const metadata = {
  title: "Masuk | Komdigi Staff Survey",
  description: "Masuk dengan akun kerja (Google/Microsoft) atau token survei internal Komdigi.",
};

export default async function LoginPage(props) {
  return <SurveyEntryLanding {...props} />;
}
