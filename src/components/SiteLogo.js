'use client';

import Image from 'next/image';

/*
  SiteLogo
  ========
  Uses the current polished site logo asset.
  The logo is a wide plaque, so we keep its natural ratio.
*/

export default function SiteLogo({
  className = '',
  priority = false,
  alt = 'The Lost Code Kingdom logo',
}) {
  return (
    <div className={className}>
      <Image
        src="/art/site-logo-royal.svg"
        alt={alt}
        width={960}
        height={720}
        priority={priority}
        unoptimized
        className="h-auto w-full object-contain drop-shadow-[0_18px_40px_rgba(16,185,129,0.24)]"
      />
    </div>
  );
}
