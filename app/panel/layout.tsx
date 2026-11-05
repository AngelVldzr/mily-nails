import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel · Club Mily",
  robots: { index: false, follow: false },
  manifest: "/panel.webmanifest",
  appleWebApp: { capable: true, title: "Club Mily", statusBarStyle: "default" },
};

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
