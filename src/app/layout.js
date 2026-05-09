import { Alegreya, Cinzel, Fira_Code } from "next/font/google";
import PageTransition from '@/components/PageTransition';
import "./globals.css";

const bodyFont = Alegreya({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Cinzel({
  variable: "--font-heading",
  subsets: ["latin"],
});

const codeFont = Fira_Code({
  variable: "--font-code",
  subsets: ["latin"],
});

export const metadata = {
  title: "The Lost Code Kingdom",
  description: "A magical Python adventure for new heroes.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bodyFont.variable} ${headingFont.variable} ${codeFont.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
