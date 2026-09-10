import './globals.css';
import { RoleThemeProvider } from '../context/RoleThemeContext';
import CustomCursor from '../components/shared/CustomCursor';

export const metadata = {
  title: 'KARTHEEK E — Enterprise & Cloud Network Systems Engineer',
  description: 'Enterprise Network Engineering, Cloud Transit Architecture, Zero-Trust Perimeter, and High-Availability Infrastructure. 6 years production experience across NYS ITS, JPMorganChase, and ADP.',
  keywords: ['Network Engineer', 'Cloud Networking', 'BGP', 'OSPF', 'Cisco Nexus', 'Zero-Trust', 'Network Security', 'Kartheek E'],
  authors: [{ name: 'Kartheek E' }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#06090e] text-[#f8fafc] min-h-screen selection:bg-sky-900 selection:text-white font-sans antialiased">
        <RoleThemeProvider>
          <CustomCursor />
          <div className="relative min-h-screen flex flex-col">
            {children}
          </div>
        </RoleThemeProvider>
      </body>
    </html>
  );
}
