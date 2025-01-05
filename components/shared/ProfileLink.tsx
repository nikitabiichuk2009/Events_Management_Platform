import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface ProfileProps {
  imgUrl: string;
  alt: string;
  title: string;
  href?: string
}

const ProfileLink = ({ imgUrl, href, alt, title }: ProfileProps) => {
  return (
    <div className='flex-center gap-1'>
      <Image src={imgUrl} alt={alt} width={24} height={24} />
      {href ?
        <Link href={href} target='_blank' className='text-primary-400 hover:text-primary-500 ease-in-out transition-colors duration-300'>{title}</Link>
        :
        <p className='p-regular-16'>{title}</p>}
    </div>
  )
}

export default ProfileLink
