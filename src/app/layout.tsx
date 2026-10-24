import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Orbit-Task | Personal Workspace & Flow",
    template: "%s | Orbit-Task",
  },
  description: "A customizable, private workspace for personal tasks, checklists, and notes powered by Supabase Row-Level Security.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Orbit-Task | Personal Workspace & Flow",
    description: "A customizable, private workspace for personal tasks, checklists, and notes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
