import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Evently | Log In/Sign Up Page",
  description: "Log In/Sign Up page of Evently",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='flex-center min-h-screen w-full'>
      {children}
    </main>
  )
}

export default Layout
