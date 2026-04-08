import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "CT1001 Exam Practice Trainer",
  description:
    "Practise CT1001 Introduction to Computational Thinking exam-style Python code snippet questions with AI-powered feedback.",
  keywords: ["CT1001", "Python", "exam practice", "computational thinking", "code snippets"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <NavBar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
