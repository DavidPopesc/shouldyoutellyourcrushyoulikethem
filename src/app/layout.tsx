import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "should you tell your crush you like them?",
  description: "a soft scrapbook-style crush quiz"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
