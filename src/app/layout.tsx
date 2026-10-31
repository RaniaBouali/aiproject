import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'ProxiService | Trouvez un Artisan et Service de Proximité',
  description: 'Plateforme de mise en relation directe avec les artisans vérifiés près de chez vous : mécanicien auto, femme de ménage, électricien, plombier, peintre...',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
