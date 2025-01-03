import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="wrapper flex md:flex-row flex-col items-center justify-between gap-3 md:gap-0 text-center">
        <Link href="/">
          <Image src="/assets/images/logo.svg" alt="Evently logo" width={128} height={38} />
        </Link>
        <p>© {new Date().getFullYear()} Evently. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer