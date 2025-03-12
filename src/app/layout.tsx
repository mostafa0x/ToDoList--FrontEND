import type { Metadata } from "next";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar from "./_Comopnets/Navbar";
import toast, { Toaster } from 'react-hot-toast';
import UserContextProvider from './_Context/UserContext'
import ProtectingRouting from "./_Comopnets/ProtectingRouting";
import EditorContextProvider from "./_Context/EditorContext"
import ReactQuery from "./_Comopnets/ReactQuery"


export const metadata: Metadata = {
  title: "Tasks",
  description: "Tasks app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="vsc-initialized">
        <ReactQuery>
          <UserContextProvider>
            <ProtectingRouting>
              <EditorContextProvider>
                <Navbar />
                {children}
                <Toaster />
              </EditorContextProvider>
            </ProtectingRouting>
          </UserContextProvider>
        </ReactQuery>
      </body>
    </html >
  );
}
