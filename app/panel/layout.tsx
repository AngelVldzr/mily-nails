import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel · Club Mily",
  robots: { index: false, follow: false },
};

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
