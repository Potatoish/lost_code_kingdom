import PageTransition from '@/components/PageTransition';
import "./globals.css";

export const metadata = {
  title: "The Lost Code Kingdom",
  description: "A magical Python adventure for new heroes.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
