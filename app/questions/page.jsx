import { Suspense } from "react";
import QuestionsGuideClient from "./questions-guide-client";

export const metadata = {
  title: "Penjelasan Pertanyaan Survei | Komdigi Staff Survey",
  description: "Halaman penjelasan untuk pimpinan dan stakeholder tentang tujuan setiap pertanyaan survei staf Komdigi dan bagaimana jawabannya akan digunakan.",
};

export default function QuestionsExplanationPage() {
  return (
    <Suspense fallback={null}>
      <QuestionsGuideClient />
    </Suspense>
  );
}
