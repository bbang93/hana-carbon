import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/Layout/Header";
import PageTransition from "@/components/UI/PageTransition";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Carbon Dashboard",
  description: "탄소 배출량 모니터링 및 관리 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log('🏠 RootLayout: 렌더링 시작');

  return (
    <html lang="ko" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 dark:bg-gray-900 antialiased`}>
        <ErrorBoundary>
          <Providers>
            <div className="flex h-full">
              {/* Desktop Sidebar */}
              <div className="hidden lg:flex lg:flex-shrink-0">
                <Sidebar />
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col min-h-0">
                <Header />
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                  <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                      <PageTransition>
                        {children}
                      </PageTransition>
                    </div>
                  </div>
                </main>
              </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden">
              <Sidebar />
            </div>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
