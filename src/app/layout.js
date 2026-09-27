import "./globals.css";

export const metadata = {
  title: "Prasanna's Portfolio",
  description: "Filmmaker Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}