import { Inter } from "next/font/google";
import "./globals.css"; // This line imports your Tailwind CSS styles

// Configure the Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GitHub Public Timeline Updates",
  description: "Sign up for weekly updates from the GitHub public timeline.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* The inter.className applies the Inter font to the entire application.
        The other classes set a dark background and smooth font rendering.
      */}
      <body
        className={`${inter.className} bg-gray-900 text-gray-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
