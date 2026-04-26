import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles
import { Navigation } from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'DocPilot | Smart PDF Toolkit',
  description: 'Edit, convert, manage, and chat with your PDFs using AI.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning className="font-sans bg-slate-50 text-slate-700 antialiased selection:bg-blue-100 selection:text-blue-900">
        <div className="flex flex-col h-[100dvh] overflow-hidden">
          <Navigation />
          <main className="flex-1 flex flex-col overflow-y-auto pb-24 md:pb-24 pt-4 px-2 sm:px-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
