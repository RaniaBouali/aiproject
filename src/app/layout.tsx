import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'ProxiService | Plateforme des Métiers & Artisans de Proximité',
  description: 'Mise en relation directe avec des artisans et prestataires qualifiés près de chez vous : mécanique auto, ménage, plomberie, électricité, dépannage.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#F9F9F7] text-slate-900 antialiased selection:bg-amber-600 selection:text-white font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
